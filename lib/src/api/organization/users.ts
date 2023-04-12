/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { orgUsersQuery } from "../../queries";
import { User } from "../../types";

import { OrgUsersQueryVariables as OrgUsersOptions } from "../../generated/graphql";
export { OrgUsersQueryVariables as OrgUsersOptions } from "../../generated/graphql";

export async function orgUsers(
  client: NowSecureClient,
  options: OrgUsersOptions
): Promise<User[]> {
  const ret = await orgUsersQuery(client, options);
  return ret.my.organization.users || [];
}
