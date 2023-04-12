/*
 * Copyright © 2021-2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import type {
  Log,
  Run,
  ReportingDescriptor,
  Result,
  Notification,
  PhysicalLocation,
} from "sarif";
import { ripGrep as rg, RipGrepError } from "ripgrep-js";

import type { Assessment, Severity } from "@nowsecure/platform-lib/lib/types";
import {
  Filter,
  findingMatchesFilter,
  DEFAULT_FILTER,
  KeyParams,
  DEFAULT_KEY_PARAMS,
  ruleIdAndFingerprint,
} from "@nowsecure/platform-lib";
import {
  DEFAULT_LAB_UI_URL,
  assessmentLink,
} from "@nowsecure/platform-lib/lib/platform-config";

export { version } from "./version";

const SARIF_SCHEMA_URL =
  "https://raw.githubusercontent.com/schemastore/schemastore/master/src/schemas/json/sarif-2.1.0-rtm.5.json";

/**
 * Convert NowSecure severity to a SARIF notification level.
 */
function severityToNotification(input: string): Notification.level {
  if (input === "high" || input === "critical") {
    return "error";
  } else if (input === "medium" || input === "low") {
    return "warning";
  } else if (input === "info") {
    return "note";
  } else {
    // NOTE: In practice, this should never happen.
    return "none";
  }
}

/**
 * Convert a severity to a mock score; this value is used
 * by GitHub to calculate its own severity type
 */
function severityToScore(input: Severity): number {
  switch (input) {
    case "critical":
      return 9.5;
    case "high":
      return 8.0;
    case "medium":
      return 5.5;
    case "low":
      return 2.0;
    case "info":
      return 0;
  }
}

/**
 *  Convert a Platform report to Sarif.
 *
 * The data **must** be provided from the query in @nowsecure/platform-lib with includeReport true,
 * otherwise data may be missing, in which case the behavior of this function
 * is undefined.
 *
 * @param assessment The assessment data from Platform
 * @param filter Filter parameters controlling which findings are reported
 * @param codePath Path to the source code; may be null
 * @param keyParams Controls generation of rule IDs
 * @param labUrl Platform UI server
 * @param errorLog Callback for error logging
 * @returns A SARIF report
 */
export async function convertToSarif(
  assessment: Assessment,
  filter: Filter = DEFAULT_FILTER,
  codePath = "./",
  keyParams: KeyParams = DEFAULT_KEY_PARAMS,
  labUrl: string = DEFAULT_LAB_UI_URL,
  errorLog?: (text: string) => void
): Promise<Log> {
  const report = assessment.report;

  if (!report) {
    throw new Error("No report data");
  }

  report.findings = report.findings.filter((finding) =>
    findingMatchesFilter(finding, filter)
  );

  const rules: ReportingDescriptor[] = [];
  for (const finding of report.findings) {
    if (!finding.affected) continue;

    let markdown = "";
    let issueSummary = "No issue description available.\n";
    if (finding.summary) {
      issueSummary = finding.summary;
    }
    const tags: string[] = [];

    const issue = finding.check.issue;
    if (issue) {
      if (issue.category) {
        tags.push(issue.category);
      }

      if (issue.cvss) {
        tags.push(`CVSS-${issue.cvss.toFixed(2)}`);
      }

      if (issue.impactSummary) {
        markdown += `## Business Impact\n${issue.impactSummary}\n`;
      }

      if (issue.stepsToReproduce) {
        markdown += `## Steps to Reproduce\n${issue.stepsToReproduce}\n`;
      }

      if (issue.recommendation || issue.codeSamples || issue.guidanceLinks) {
        markdown += "## Remediation Resources\n";
      }

      if (issue.recommendation) {
        markdown += `### Recommended Fix\n${issue.recommendation}\n`;
      }

      if (issue.codeSamples && issue.codeSamples.length !== 0) {
        markdown += "## Code Samples\n";

        for (const codeSample of issue.codeSamples) {
          markdown += "<details>\n";
          markdown += `<summary>${codeSample.caption} (click to expand)</summary>\n\n`;
          markdown += "```";
          if (codeSample.syntax) {
            markdown += codeSample.syntax;
          }
          markdown += "\n";
          markdown += codeSample.block;
          markdown += "\n```\n";
          markdown += "</details>\n";
        }
      }

      markdown += "\n";

      if (issue.guidanceLinks && issue.guidanceLinks.length !== 0) {
        markdown += "## Additional Guidance\n";
        for (const guidanceLink of issue.guidanceLinks) {
          markdown += `* ${guidanceLink.caption} ${guidanceLink.url}\n`;
        }
      }

      markdown += "\n";
    }

    // Format NowSecure evidence in a Markdown table, when possible.

    const context = finding.context;
    const meta = finding.check.context;
    if (context && context.items && context.items.length > 0) {
      // Markdown tables look like:
      // |A|B|C|
      let markdownHeader = "|";
      // |-|-|-|
      let markdownDivider = "|";
      // If the key for "A" is "a", then it will be the first
      // entry in the ordering list, so on...
      const ordering = [];

      for (const field of meta.fields) {
        const fieldTitle = field.title;
        markdownHeader += `${fieldTitle}|`;
        markdownDivider += `-|`;
        ordering.push(field.key);
      }

      markdown += markdownHeader + "\n";
      markdown += markdownDivider + "\n";

      // For each row, insert keys in the order specified in "ordering".
      for (const row of context.items) {
        markdown += "|";
        for (const key of ordering) {
          let data = row[key];
          if (typeof data !== "string") {
            data = JSON.stringify(data);
          }

          markdown += "```` " + data + " ````" + "|";
        }
        markdown += "\n";
      }
    }

    const { ruleId } = ruleIdAndFingerprint(assessment, finding, keyParams);
    rules.push({
      id: ruleId,
      name: finding.title,
      helpUri: assessmentLink(labUrl, assessment, finding),
      shortDescription: {
        text: finding.title,
      },
      fullDescription: {
        text: issueSummary,
      },
      properties: {
        problem: {
          severity: finding.severity,
        },
        tags,
        precision: "medium",
        // security-severity is a string (even though it's a number)
        "security-severity": severityToScore(finding.severity).toString(),
      },
      help: {
        // NOTE: In practice this should not display on the GitHub UI.
        text: "NowSecure only provides recommendations in a Markdown format.",
        markdown,
      },
    });
  }

  const results: Result[] = [];
  for (const finding of report.findings) {
    if (!finding.affected) continue;

    const issue = finding.check.issue;

    let issueDescription = "No issue description available\n";
    if (issue && issue.description) {
      issueDescription = issue.description;
    }

    const level = severityToNotification(finding.severity);
    const { ruleId, partialFingerprints } = ruleIdAndFingerprint(
      assessment,
      finding,
      keyParams
    );

    // If we are missing a specialized result for a rule, show the "simple"
    // result that does not show detailed line number information (refer to the
    // evidence table instead).
    const simpleResult: Result = {
      ruleId,
      message: {
        // Markdown doesn't work here. We render our information in the "help"
        // field in the reporting descriptor.
        text: issueDescription,
      },
      level: level,
      locations: [
        {
          // We don't have line number information so instead produce phony
          // information for a file that does not exist.
          physicalLocation: {
            artifactLocation: {
              uri: "Unknown",
              uriBaseId: "%SRCROOT%",
            },
            region: {
              startLine: 1,
              endLine: 1,
              byteOffset: 0,
              byteLength: 0,
            },
          },
        },
      ],
    };

    if (partialFingerprints) {
      simpleResult.partialFingerprints = partialFingerprints;
    }

    // FIXME: This should be refactored out and abstracted.
    const localResults = [];

    if (finding.key == "path_traversal" && codePath) {
      const context = finding.context;
      if (context && context.items && context.items.length > 0) {
        for (const row of context.items) {
          const name = row.name as string;
          const namespace = name.split(".");
          if (namespace.length > 0) {
            const [className] = namespace.slice(-1);
            // NOTE: Source mapping works for Java and Kotlin ONLY.
            const locations = await searchLocations(
              codePath,
              `class ${className}`,
              errorLog
            );

            for (const physicalLocation of locations) {
              const localResult: Result = {
                ruleId: ruleId,
                message: {
                  text: issueDescription,
                },
                level: level,
                locations: [
                  {
                    physicalLocation,
                  },
                ],
              };
              if (partialFingerprints) {
                localResult.partialFingerprints = partialFingerprints;
              }
              localResults.push(localResult);
            }
          }
        }
      }
    }

    if (localResults.length !== 0) {
      results.push(...localResults);
    } else {
      results.push(simpleResult);
    }
  }

  const run: Run = {
    tool: {
      driver: {
        name: "NowSecure",
        informationUri: "https://www.nowsecure.com/",
        semanticVersion: "1.0.0",
        rules,
      },
    },
    results,
  };

  const log: Log = {
    $schema: SARIF_SCHEMA_URL,
    version: "2.1.0",
    runs: [run],
  };

  return log;
}

function strip(name: string): string {
  return name.replace(/[^0-9a-z-_\s]/gi, "");
}

/*
 * Search the codebase for a string and return a physical location that corresponds
 * to it.
 */
async function searchLocations(
  codePath: string,
  name: string,
  errorLog?: (text: string) => void
): Promise<PhysicalLocation[]> {
  const errLog = errorLog || console.error;
  let results;
  try {
    results = await rg(codePath, `"${strip(name)}"`);
  } catch (e) {
    const error = e as RipGrepError;
    errLog(`Error: ripgrep: ${error.message}: ${error.stderr}`);
    errLog(
      "Note: ripgrep is required for line-number identification. On Ubuntu-based distributions use `apt-get install -y ripgrep` before running the NowSecure action"
    );
    return [];
  }

  const locations = [];

  for (const result of results) {
    locations.push({
      artifactLocation: {
        uri: result.path.text,
        uriBaseId: "%SRCROOT%",
      },
      region: {
        startLine: result.line_number,
        endLine: result.line_number,
        byteOffset: 0,
        byteLength: 0,
      },
    });
  }

  return locations;
}
