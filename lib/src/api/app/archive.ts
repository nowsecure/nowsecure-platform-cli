/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { AppResource } from "../../types";

export async function archiveApp(
  client: NowSecureClient,
  appRef: string,
  unarchive?: boolean
) {
  const url = `/resource/${
    unarchive ? "_unarchive_app" : "_archive_app"
  }/${appRef}`;

  // workround for bug: the archive route returns an array of one element
  // containing the original
  const ret = await client.post<AppResource | AppResource[]>(url);
  if (!Array.isArray(ret)) {
    return ret;
  }
  const pre = ret[0];
  const checkUrl = `/app/${pre.platform}/${pre.package}?group=${pre.group}`;
  return await client.get<AppResource>(checkUrl);
}
