/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import type { DependencySnapshot, Manifest } from "./dependency-snapshot";
import type { DependenciesOutput } from "@nowsecure/platform-lib/lib/types";

/** The default GitHub REST server */
export const GITHUB_API_URL = "https://api.github.com";

/**
 * Upload URL for snapshots.
 *
 * @param owner Repository owner
 * @param repo Repository name
 * @param apiUrl optional: The address of the GitHub API server
 * @returns the url to use in an HTTP POST to upload the snapshot
 */
export const snapshotUploadUrl = (
  owner: string,
  repo: string,
  apiUrl = GITHUB_API_URL
) => `${apiUrl}/repos/${owner}/${repo}/dependency-graph/snapshots`;

/**
 * Generate a package url (PURL)
 */
function encodePurl(ecosystem: string, name: string, version?: string): string {
  let purl = `pkg:${ecosystem}/${name}`;
  if (version) {
    purl += `@${version}`;
  }

  return purl;
}

/**
 * Convert a Platform report to the Snapshot format.
 *
 * ref, sha and runId can be retrieved from the action context
 * ```
 * import * as github from "@actions/github";
 * const {ref, sha, runId} = github.context
 * ```
 *
 * @param dependencies The dependency data retrieved from the assessment.
 * `fetchAssessment` or `pollForReport` in `@nowsecure/platform-lib` retrieves
 * this data in the correct format
 * @param githubCorrelator Correlation id to group snapshots over time.
 * @param sha commit hash of the commit that triggered the snapshot
 * @param ref Ref of the git commit. For example, "refs/heads/main".
 * @param runId runId of the action
 * @returns a dependency snapshot that can be uploaded to GitHub
 */
export function convertToSnapshot(
  dependencies: DependenciesOutput,
  githubCorrelator: string,
  sha: string,
  ref: string,
  runId: number
): DependencySnapshot {
  const manifests = new Map<string, Manifest>();

  for (const component of dependencies.components) {
    let source = component.source;
    if (source.startsWith("/")) {
      source = source.substring(1);
    }

    let manifest = manifests.get(source);
    if (!manifest) {
      manifest = {
        name: source,
        resolved: {},
      };
    }

    // We need to translate our ecosystem into a proper PURL type.
    // See https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst for supported PURL
    // types.
    let ecosystem = component.ecosystem.toLowerCase();
    switch (component.ecosystem) {
      case "Commercial":
      case "Native":
        // Fallback to "generic" which is reserved for this purpose.
        ecosystem = "generic";
        break;
      case "CocoaPods":
      case "Maven":
      case "npm":
      case "NuGet":
        break;
      // We purposefully omit default because the typings include a union here so if new types are
      // added the TypeScript compiler will emit an error.
    }

    const purl = encodePurl(ecosystem, component.name, component.version);

    manifest.resolved[component.name] = {
      package_url: purl.toString(),
      relationship: "direct",
    };

    manifests.set(source, manifest);
  }

  const snapshot: DependencySnapshot = {
    version: 0,
    ref,
    sha,
    job: {
      correlator: githubCorrelator,
      id: `${runId}`,
    },
    detector: {
      name: "NowSecure",
      url: "https://www.nowsecure.com/",
      version: dependencies.deputy,
    },
    scanned: new Date(dependencies.timestamp).toISOString(),
    manifests: Object.fromEntries(manifests),
  };

  return snapshot;
}
