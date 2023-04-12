/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Assessment, Finding } from "@nowsecure/platform-lib/lib/types";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { filterFlags, getFilter } from "../../utils/filters";
import { parseRef } from "../../utils/parsers";
import { Column } from "../../utils/table";

export interface ShowAssessmentFieldOptions {
  ref?: boolean;
  status?: boolean;
}

export function assessmentDefaultFields({
  ref,
  status,
}: ShowAssessmentFieldOptions): Column<Assessment>[] {
  const ret: (Column<Assessment> | boolean | undefined)[] = [
    ref && { heading: "Ref", data: "ref" },
    { heading: "Created", data: "createdAt" },
    { heading: "Platform", data: "platformType" },
    { heading: "Package", data: "packageKey" },
    { heading: "Version", data: "packageVersion" },
    {
      heading: "From app store",
      data: (x) => (x.isAppstoreDownload ? "Yes" : "No"),
    },
    status && { heading: "Status", data: (x) => x.analysis?.status || "" },
  ];
  return ret.filter((x) => !!x) as Column<Assessment>[];
}

export const showFindingsDefaultColumns: Column<Finding>[] = [
  { heading: "ID", data: "checkId" },
  { heading: "KIND", data: "kind" },
  { heading: "CATEGORY", data: "category" },
  { heading: "CVSS", data: "cvss" },
  { heading: "SEVERITY", data: "severity" },
  { heading: "IMPACT", data: "impactType" },
  { heading: "TITLE", data: "title" },
];

export abstract class ShowAssessmentBase extends BaseCommand {
  static flags = {
    ...filterFlags,
    findings: Flags.boolean({
      char: "f",
      summary: "Include the findings report",
      allowNo: true,
      default: true,
    }),
    state: Flags.boolean({
      char: "s",
      summary: "Include the current state of the assessment tasks",
      allowNo: true,
      default: true,
    }),
    config: Flags.boolean({
      char: "c",
      summary: "Include the analysis configuration",
      allowNo: true,
      default: false,
    }),
    dependencies: Flags.boolean({
      char: "d",
      summary: "Include the application dependency analysis",
      allowNo: false,
      default: false,
    }),
    build: Flags.boolean({
      char: "b",
      summary: "Include details of the build",
      allowNo: true,
      default: false,
    }),
  };

  showAssessment(
    assessment: Assessment,
    flags: Record<string, unknown>,
    options: ShowAssessmentFieldOptions
  ) {
    if (flags.summary) {
      this.outputFields(assessment, assessmentDefaultFields(options));
    }

    if (flags.config) {
      this.log("Config: " + JSON.stringify(assessment.config || {}, null, 2));
    }

    if (flags.findings) {
      const findings = assessment.report?.findings || [];
      const prefix = flags.config || flags.summary ? "    " : "";
      this.log("Findings:");
      this.outputTable(findings, showFindingsDefaultColumns, prefix);
    }
  }
}

export default class ShowAssessment extends ShowAssessmentBase {
  static description = "Show the details and findings of an assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> 24891ee6-698e-4a55-bb27-adbfa4694787`,
  ];

  static args = {
    assessment: Args.string({
      name: "ref",
      required: true,
      description: "Reference of the assessment to view",
    }),
  };

  static flags = {
    ...ShowAssessmentBase.flags,
    timeout: Flags.integer({
      min: -1,
      char: "t",
      description:
        "Timeout in seconds to wait for the analysis to complete. Specify -1 to wait indefinitely. If unspecified or 0, the assessment is returned as-is and may contain partial results",
      default: 0,
    }),
  };

  async run(): Promise<Assessment> {
    const { args, flags, platform } = await this.parseClient(ShowAssessment);
    const ref = await parseRef(args.assessment, this);
    const filter = getFilter(flags);

    const assessment =
      flags.timeout === 0
        ? await platform.fetchAssessment(
            ref,
            {
              includeReport: flags.findings,
              includeState: flags.state,
              includeConfig: flags.config,
              includeDependencies: flags.dependencies,
              includeBuild: flags.build,
            },
            filter
          )
        : await platform.pollForReport(
            args.assessment.toLowerCase(),
            {
              includeState: flags.state,
              includeConfig: flags.config,
              includeDependencies: flags.dependencies,
              includeBuild: flags.build,
            },
            filter,
            undefined,
            flags.timeout < 0 ? undefined : flags.timeout * 1000
          );

    if (!assessment) {
      this.error(`Cannot find assessment ${args.assessment}`);
    }

    this.showAssessment(assessment, flags, { status: true });

    return assessment;
  }
}
