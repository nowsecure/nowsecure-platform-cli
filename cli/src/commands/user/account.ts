/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { BaseCommand } from "../../utils/base-command";
import { userDefaultColumns } from "../organization/users";
import { groupDefaultColumns } from "./groups";
import { FullUser } from "@nowsecure/platform-lib/lib/types";

export default class UserAccount extends BaseCommand {
  static description = "Current user details";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  async run(): Promise<FullUser> {
    const { platform } = await this.parseClient(UserAccount);
    const ret = await platform.userInfo();
    this.outputTable([ret], userDefaultColumns);
    this.log("\nGroups:");
    this.outputTable(ret.groups, groupDefaultColumns, "    ");
    return ret;
  }
}
