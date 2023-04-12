/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { OrgGroupsQueryVariables as OrgGroupsOptions } from "../../generated/graphql";
import { orgGroupsQuery } from "../../queries";
import { Group } from "../../types";

export { OrgGroupsQueryVariables as OrgGroupsOptions } from "../../generated/graphql";

export async function orgGroups(
  client: NowSecureClient,
  options: OrgGroupsOptions
): Promise<Group[]> {
  const ret = await orgGroupsQuery(client, options);
  return ret.my.organization.groups;
}
