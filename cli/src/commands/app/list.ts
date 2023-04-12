/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Flags } from "@oclif/core";
import { BaseCommand, getGroupsList, Column, parseRef } from "../../utils";
import { ListApplicationOptions, Application } from "@nowsecure/platform-lib";
import { PlatformEnum } from "@nowsecure/platform-lib/lib/types";

const defaultColumns: Column<Application>[] = [
  { heading: "REF", data: "ref" },
  { heading: "TITLE", data: "title" },
  { heading: "PLATFORM", data: "platformType" },
  { heading: "PACKAGE", data: "packageKey" },
  { heading: "GROUP", data: (x) => (x && x.group.name) || "" },
];

export default class ListApps extends BaseCommand {
  static description = "List available applications on Platform";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
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
    title: Flags.string({
      char: "t",
      summary: "Filter on title",
      multiple: true,
    }),
    platform: Flags.string({
      char: "p",
      summary: "Filter on platform",
      multiple: true,
      options: ["android", "ios"],
    }),
    id: Flags.string({
      char: "i",
      summary: "Filter on ID (package name or bundle ID)",
      multiple: true,
    }),
  };

  async run(): Promise<Application[]> {
    const { flags, platform } = await this.parseClient(ListApps);

    const groupList = await getGroupsList(
      platform,
      this,
      flags.group,
      flags["group-ref"]
    );

    const options: ListApplicationOptions = {
      groupRefs: groupList,
      refs: flags.ref,
      packageKeys: flags.id,
      platformTypes: flags.platform as PlatformEnum[] | undefined,
    };

    let apps = await platform.listApplications(options);

    const titles = flags.title;
    if (titles && titles.length) {
      apps = apps.filter((app) => app?.title && titles.indexOf(app.title) >= 0);
    }

    this.outputTable(apps, defaultColumns);
    return apps;
  }
}
