/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { User } from "@nowsecure/platform-lib/lib/types";
import { Column } from "../../utils/table";

export const userDefaultColumns: Column<User>[] = [
  { heading: "REF", data: "ref" },
  { heading: "NAME", data: "name" },
  { heading: "EMAIL", data: "email" },
  { heading: "ROLE", data: (x) => x.role?.name || "" },
  { heading: "ACTIVE", data: (x) => (x.active ? "Yes" : "No") },
];

export default class OrgUsers extends BaseCommand {
  static description = "List users in the organization";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    active: Flags.boolean({
      description: "Only list active users",
      exclusive: ["inactive"],
    }),
    inactive: Flags.boolean({
      summary: "List only inactive users",
      exclusive: ["active"],
    }),
  };

  async run(): Promise<User[]> {
    const { flags, platform } = await this.parseClient(OrgUsers);
    const active = flags.active ? true : flags.inactive ? false : undefined;
    const ret = await platform.orgUsers({ active });
    this.outputTable(ret, userDefaultColumns);
    return ret;
  }
}
