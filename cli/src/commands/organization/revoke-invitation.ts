/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { ValueError } from "@nowsecure/platform-lib";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { parseRef } from "../../utils/parsers";
import { invitationDefaultColumns } from "./invitations";

export default class RevokeInvitation extends BaseCommand {
  static description = "Revoke an invitation to join your organization";

  static examples = [
    `<%= config.bin %> <%= command.id %> someone@example.com`,
    `<%= config.bin %> <%= command.id %> --ref=7342762a-5a3b-4ca9-95e7-225ea6913aee`,
  ];

  static flags = {
    ref: Flags.string({
      description: "Reference of the invitation to delete",
      parse: parseRef,
    }),
  };
  static args = {
    email: Args.string({
      name: "email",
      required: false,
      description: "Email address to revoke",
    }),
  };

  async run(): Promise<void> {
    const { args, platform, flags } = await this.parseClient(RevokeInvitation);
    let ref = flags.ref || "";
    const email = args.email || "";
    if (email && ref) {
      this.error(
        "Only one of an email address and a reference can be specified"
      );
    }

    if (!(email || ref)) {
      throw new ValueError(
        "One of an email address or a reference must be specified"
      );
    }
    if (email) {
      const invitations = await platform.listInvitations();
      const matches = invitations.filter((x) => x.email === email);
      if (matches.length == 0) {
        this.error(`No invitation found for ${email}`);
      }
      if (matches.length > 1) {
        this.error(`Multiple invitations found for ${email}`, { exit: false });
        this.errorTable(matches, invitationDefaultColumns);
      }
      ref = matches[0].ref;
    }

    const ret = await platform.revokeInvitation(ref);
    this.log(`Invitation ${ret} revoked`);
  }
}
