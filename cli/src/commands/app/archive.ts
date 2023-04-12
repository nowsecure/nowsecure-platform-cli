/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { AppResource } from "@nowsecure/platform-lib/lib/types";
import { Flags } from "@oclif/core";
import { appRefArgs, appRefFlags, resolveAppRef } from "../../utils/app-ref";
import { BaseCommand } from "../../utils/base-command";

export default class ArchiveApp extends BaseCommand {
  static description = "Archive or unarchive an app";

  static examples = [
    `<%= config.bin %> <%= command.id %> android com.example.package --group "My group"`,
    `<%= config.bin %> <%= command.id %> --app=d296eaea-f714-4e2d-8930-023b3f2bb12a --unarchive`,
  ];

  static args = { ...appRefArgs };

  static flags = {
    ...appRefFlags,
    unarchive: Flags.boolean({
      required: false,
      char: "u",
      summary: "unarchive the application",
    }),
  };

  async run(): Promise<AppResource> {
    const { args, flags, platform } = await this.parseClient(ArchiveApp);

    const appRef = await resolveAppRef(platform, args, flags, this);
    const response = await platform.archiveApp(appRef, flags.unarchive);
    const isArchived = !!response.archived_at;
    if (isArchived === !!flags.unarchive) {
      this.error(
        `Failed. App ${appRef} is ${isArchived ? "archived" : "unarchived"}`
      );
    }
    this.log(`App ${appRef} is ${isArchived ? "archived" : "unarchived"}`);
    return response;
  }
}
