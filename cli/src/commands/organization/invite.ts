/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { InviteUserOptions } from "@nowsecure/platform-lib";
import { Invitation } from "@nowsecure/platform-lib/lib/types";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { getGroupsList } from "../../utils/group-list";
import { parseRef } from "../../utils/parsers";

export default class InviteUser extends BaseCommand {
  static description = "Invite a user to join your organization";

  static examples = [
    `<%= config.bin %> <%= command.id %> someone@example.com --name "John Doe" --role "QA" --group "Test Apps"`,
  ];

  static flags = {
    name: Flags.string({
      char: "n",
      required: true,
    }),
    "group-ref": Flags.string({
      summary: "Add user to this group by group reference",
      required: false,
      multiple: true,
      parse: parseRef,
    }),
    group: Flags.string({
      char: "g",
      summary: "Add user to this group by group name",
      required: false,
      multiple: true,
    }),
    role: Flags.string({
      char: "r",
      summary: "Role to assign to the user",
      required: true,
    }),
  };

  static args = {
    email: Args.string({
      name: "email",
      required: true,
      description: "Email address of the new user",
    }),
  };

  async run(): Promise<Invitation> {
    const { args, flags, platform } = await this.parseClient(InviteUser);
    const groupList = await getGroupsList(
      platform,
      this,
      flags.group,
      flags["group-ref"]
    );
    if (!groupList?.length) {
      this.error("At least one group must be specified");
    }
    const roles = await platform.listRoles();
    const role = roles.filter((x) => x.label === flags.role);
    if (role.length != 1) {
      this.error(
        `Unknown role ${flags.role}. Options are ${roles
          .map((x) => x.label)
          .join(", ")}`
      );
    }
    const options: InviteUserOptions = {
      name: flags.name,
      email: args.email,
      roleName: role[0].name,
      groupRefs: groupList,
    };
    const ret = await platform.inviteUser(options);
    this.log(`Invitation sent to ${flags.name} <${args.email}>`);
    return ret;
  }
}
