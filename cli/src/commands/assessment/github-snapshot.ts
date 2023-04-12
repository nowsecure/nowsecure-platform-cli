/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { promises as fsPromises } from "fs";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { parseRef } from "../../utils/parsers";
import { convertToSnapshot } from "@nowsecure/github-snapshot";

export default class GitHubSnapshot extends BaseCommand {
  static description = "Create a SARIF report from an assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> 24891ee6-698e-4a55-bb27-adbfa4694787`,
  ];

  static args = {
    assessment: Args.string({
      required: true,
      description: "Source assessment reference",
    }),
  };

  static flags = {
    timeout: Flags.integer({
      min: 0,
      char: "t",
      summary: "Timeout in seconds to wait for the analysis to complete",
      default: 0,
    }),
    output: Flags.string({
      char: "o",
      summary: "Write to a file, instead of STDOUT",
    }),
    correlator: Flags.string({
      char: "c",
      required: true,
      description: "Correlation ID to link snapshots for the same app",
    }),
    sha: Flags.string({
      char: "s",
      required: true,
      description: "git hash of the commit causing the build",
    }),
    ref: Flags.string({
      char: "r",
      required: true,
      description: "Tag or branch causing the build",
    }),
    "job-id": Flags.integer({
      char: "j",
      required: true,
      description: "id of the build job",
    }),
  };

  async run() {
    const { args, flags, platform } = await this.parseClient(GitHubSnapshot);
    const ref = await parseRef(args.assessment, this);

    const assessment =
      flags.timeout === 0
        ? await platform.fetchAssessment(ref, {
            includeReport: false,
            includeState: false,
            includeConfig: false,
            includeDependencies: true,
            includeBuild: false,
          })
        : await platform.pollForReport(args.assessment.toLowerCase(), {
            includeState: false,
            includeConfig: false,
            includeDependencies: true,
            includeBuild: false,
          });

    if (!assessment) {
      this.error(`Cannot find assessment ${args.assessment}`);
    }
    if (!assessment.dependencies) {
      this.error(`Assessment ${ref} does not contain dependency information`);
    }

    const snapshot = convertToSnapshot(
      assessment.dependencies,
      flags.correlator,
      flags.sha,
      flags.ref,
      flags["job-id"]
    );

    if (flags.output) {
      await fsPromises.writeFile(
        flags.output,
        JSON.stringify(snapshot, null, 2),
        "utf-8"
      );
    } else {
      this.log(JSON.stringify(snapshot, null, 2));
    }
    return snapshot;
  }
}
