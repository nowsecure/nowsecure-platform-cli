/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Command, Help } from "@oclif/core";

/** A simple command that displays the help to list subcommands */
export default class SubCommandLister extends Command {
  async run(): Promise<void> {
    const help = new Help(this.config);
    if (this.id) {
      const command = this.config.findCommand(this.id as string);
      if (command) {
        await help.showCommandHelp(command);
      }
    }
  }
}
