/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { PlatformAPI } from "@nowsecure/platform-lib";
import { CommandCore } from "./command-core";
import { parseUuidLists } from "./parsers";

export async function getGroupsList(
  client: PlatformAPI,
  command: CommandCore,
  names?: string[],
  refs?: string[]
) {
  if (!(names || refs)) {
    return null;
  }
  const ret = parseUuidLists(refs, command) || [];
  if (names?.length) {
    const groups = await client.userGroups();
    for (const name of names) {
      const group = groups.find((gr) => gr.name == name);
      if (group) {
        ret.push(group.ref);
      } else {
        command.error(`Group ${name} not found`);
      }
    }
  }
  return ret;
}

export async function getGroupRef(
  client: PlatformAPI,
  command: CommandCore,
  ref?: string,
  name?: string
) {
  if (ref) {
    return ref;
  }

  if (name) {
    const groupList = await client.userGroups();
    const found = groupList.find((grp) => grp.name === name);
    if (!found) {
      command.error(`Could not find group "${name}"`);
    }
    return found.ref;
  }

  return undefined;
}
