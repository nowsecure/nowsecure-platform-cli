/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { userGroupsQuery } from "../../queries";
import { Group } from "../../types";

export async function userGroups(client: NowSecureClient): Promise<Group[]> {
  const ret = await userGroupsQuery(client, {});
  return ret.my.groups;
}
