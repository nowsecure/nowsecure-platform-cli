/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { AssessmentsQueryVariables } from "@nowsecure/platform-lib";
import {
  Assessment,
  AssessmentJobSummaryStatus,
  PlatformEnum,
} from "@nowsecure/platform-lib/lib/types";
import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { getFilter, makeFilterFlags } from "../../utils/filters";
import { getGroupsList } from "../../utils/group-list";
import { parseDateTime, parseRef, parseUuidLists } from "../../utils/parsers";
import { Column } from "../../utils/table";

const listAssessmentsDefaultColumns: Column<Assessment>[] = [
  { heading: "REF", data: "ref" },
  { heading: "CREATED", data: "createdAt" },
  { heading: "PLATFORM", data: "platformType" },
  { heading: "PACKAGE", data: "packageKey" },
  { heading: "VERSION", data: "packageVersion" },
  {
    heading: "APP STORE",
    data: (x) => (x.isAppstoreDownload ? "Yes" : "No"),
  },
  { heading: "STATUS", data: (x) => x.analysis?.status || "" },
];

export default class ListAssessments extends BaseCommand {
  static description = "List assessments";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    ...makeFilterFlags({ dependsOn: ["json"] }),
    findings: Flags.boolean({
      char: "f",
      summary: "Include the findings report",
      dependsOn: ["json"],
      allowNo: true,
    }),
    config: Flags.boolean({
      summary: "Include the analysis configuration",
      dependsOn: ["json"],
      allowNo: true,
    }),
    dependencies: Flags.boolean({
      char: "d",
      summary: "Include the application dependency analysis",
      dependsOn: ["json"],
      allowNo: true,
    }),
    build: Flags.boolean({
      char: "b",
      summary: "Include details of the build",
      dependsOn: ["json"],
      allowNo: true,
    }),
    "group-ref": Flags.string({
      summary: "Filter by group reference",
      required: false,
      multiple: true,
      parse: parseRef,
    }),
    group: Flags.string({
      char: "g",
      summary: "Filter by group name",
      required: false,
      multiple: true,
    }),
    ref: Flags.string({
      char: "r",
      summary: "Filter on reference",
      multiple: true,
      parse: parseRef,
    }),
    platform: Flags.string({
      summary: "Filter on platform",
      options: Object.values(PlatformEnum),
      multiple: false,
    }),
    limit: Flags.integer({
      min: 1,
    }),
    scope: Flags.string({
      options: ["*"],
    }),
    finding: Flags.string({
      summary: "Only show assessments with this finding",
    }),
    status: Flags.string({
      summary: "Filter by job status",
      options: Object.values(AssessmentJobSummaryStatus),
    }),
    since: Flags.string({
      summary: "Assessments created since this date",
      parse: parseDateTime,
    }),
    after: Flags.string({
      summary: "Assessments created after this date",
      parse: parseDateTime,
    }),
    before: Flags.string({
      summary: "Assessments created before this date",
      parse: parseDateTime,
    }),
    until: Flags.string({
      summary: "Assessments created until this date",
      parse: parseDateTime,
    }),
    reverse: Flags.boolean({
      summary: "Show in reverse order",
    }),
    "include-deleted": Flags.boolean({
      char: "d",
      summary: "Show all assessements including deleted ones",
    }),
    baseline: Flags.boolean({
      summary: "Only show baseline assessments",
      allowNo: true,
    }),
    appstore: Flags.boolean({
      summary:
        "Show assessments on apps downloaded from the platform's app store",
      allowNo: true,
    }),
    "fail-fast": Flags.boolean({
      allowNo: true,
    }),
    favorite: Flags.boolean({
      summary: "Show favorited assessments",
      allowNo: true,
    }),
  };

  async run(): Promise<Assessment[]> {
    const { flags, platform } = await this.parseClient(ListAssessments);
    const filter = getFilter(flags);
    const options: AssessmentsQueryVariables = {
      groupRefs: await getGroupsList(
        platform,
        this,
        flags.group,
        flags["group-ref"]
      ),
      platformType: flags.platform as PlatformEnum | undefined,
      refs: parseUuidLists(flags.ref, this),
      limit: flags.limit,
      scope: flags.scope,
      affectedByFindingKey: flags.finding,
      status: flags.status,
      since: flags.since,
      after: flags.after,
      before: flags.before,
      until: flags.until,
      reverse: flags.reverse,
      includeDeleted: !!flags["include-deleted"],
      defaultConfig: flags.baseline,
      failFast: flags["fail-fast"],
      favorite: flags.favorite,
      includeConfig: flags.config,
      includeDependencies: flags.dependencies,
      includeReport: flags.findings,
      includeBuild: flags.build,
      includeState: true,
    };
    const assessments = await platform.listAssessments(options, filter);
    this.outputTable(assessments, listAssessmentsDefaultColumns);
    return assessments;
  }
}
