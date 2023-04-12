/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Group } from "@nowsecure/platform-lib/lib/types";
import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { groupDefaultColumns } from "../user/groups";

export default class OrgGroups extends BaseCommand {
  static description = "Get the organization's groups";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    active: Flags.boolean({
      summary: "List only active groups",
      exclusive: ["inactive"],
    }),
    inactive: Flags.boolean({
      summary: "List only inactive groups",
      exclusive: ["active"],
    }),
  };

  async run(): Promise<Group[]> {
    const { flags, platform } = await this.parseClient(OrgGroups);
    const active = flags.active ? true : flags.inactive ? false : undefined;
    const groups = await platform.orgGroups({ active });
    this.outputTable(groups, groupDefaultColumns);
    return groups;
  }
}
