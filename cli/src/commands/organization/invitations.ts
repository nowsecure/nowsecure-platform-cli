/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { BaseCommand } from "../../utils/base-command";
import { Column } from "../../utils/table";
import { Invitation } from "@nowsecure/platform-lib/lib/types";

export const invitationDefaultColumns: Column<Invitation>[] = [
  { heading: "REF", data: "ref" },
  { heading: "EMAIL", data: "email" },
  { heading: "NAME", data: "name" },
  { heading: "ROLE", data: (x) => x.role.label },
  { heading: "GROUPS", data: (x) => x.groups.map((gr) => gr.name).join(", ") },
  { heading: "EXPIRES", data: "expiredAt" },
];

export default class ListInvitations extends BaseCommand {
  static description = "List invitations";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  async run(): Promise<Invitation[]> {
    const { platform } = await this.parseClient(ListInvitations);
    const ret = await platform.listInvitations();
    this.outputTable(ret, invitationDefaultColumns);
    return ret;
  }
}
