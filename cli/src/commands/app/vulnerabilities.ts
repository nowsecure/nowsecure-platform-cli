/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  VulnerabilityEntry,
  VulnerabilityResponse,
} from "@nowsecure/platform-lib/lib/types";
import { appRefArgs, appRefFlags, resolveAppRef } from "../../utils/app-ref";
import { BaseCommand, Column } from "../../utils";

const appVulnerabilitiesDefaultColumns: Column<VulnerabilityEntry>[] = [
  { heading: "KEY", data: "finding_id" },
  { heading: "CVSS", data: "last_seen_cvss" },
  { heading: "FIRST SEEN", data: "opened_in_app_version" },
  { heading: "LAST SEEN", data: "last_seen_in_app_version" },
  { heading: "TITLE", data: "finding_title" },
];

export default class GetAppVulnerabilities extends BaseCommand {
  static description = "Show application vulnerabilities";

  static examples = [
    `<%= config.bin %> <%= command.id %> android com.example.package --group "My group"`,
    `<%= config.bin %> <%= command.id %> --app=d296eaea-f714-4e2d-8930-023b3f2bb12a`,
  ];

  static args = { ...appRefArgs };
  static flags = { ...appRefFlags };

  async run(): Promise<VulnerabilityResponse> {
    const { args, flags, platform } = await this.parseClient(
      GetAppVulnerabilities
    );

    const appRef = await resolveAppRef(platform, args, flags, this);

    const vulnerabilities = await platform.getAppVulnerabilities(appRef);
    const sorted = vulnerabilities.sort(
      (a, b) => b.last_seen_cvss - a.last_seen_cvss
    );

    this.outputTable(sorted, appVulnerabilitiesDefaultColumns);
    return vulnerabilities;
  }
}
