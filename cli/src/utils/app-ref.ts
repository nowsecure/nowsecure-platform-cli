/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { PlatformAPI } from "@nowsecure/platform-lib";
import { Flags } from "@oclif/core";
import { ArgOutput } from "@oclif/core/lib/interfaces/parser";
import { groupFlags, packageArgs } from "./args";
import { CommandCore } from "./command-core";
import { getGroupRef } from "./group-list";
import { parseRef } from "./parsers";

export const appRefArgs = packageArgs;

export const appRefFlags = {
  ...groupFlags,
  ref: Flags.string({
    char: "r",
    summary: "Application reference",
    parse: parseRef,
  }),
};

type AppRefFlagsType = {
  group: string | undefined;
  "group-ref": string | undefined;
  ref: string | undefined;
};

export async function resolveAppRef(
  client: PlatformAPI,
  args: ArgOutput,
  flags: AppRefFlagsType,
  command: CommandCore
) {
  const { platform, packageName } = args;

  if (flags.ref) {
    if (platform || packageName) {
      command.error(
        "Specify either a platform and package or an application reference"
      );
    }
    return flags.ref;
  }

  if (!(platform && packageName)) {
    command.error("Platform and package name required");
  }
  const groupRef = await getGroupRef(
    client,
    command,
    flags["group-ref"],
    flags.group
  );
  const apps = await client.listApplications({ groupRefs: groupRef });
  const matches = apps.filter(
    (app) => app.packageKey == packageName && app.platformType == platform
  );
  if (matches.length == 0) {
    command.error("No app found");
  }
  if (matches.length > 1) {
    command.error(
      "Multiple matching apps found. Specify a group or use the app reference"
    );
  }
  return matches[0].ref;
}
