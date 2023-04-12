/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { ValueError } from "../../errors";
import { AppResource, PlatformEnum } from "../../types";
import { isValidPackageID } from "../../utils";

type CreateAppParams = {
  platform: string;
  package: string;
  group?: string;
};

export async function createApp(
  client: NowSecureClient,
  platform: PlatformEnum,
  packageName: string,
  groupRef?: string
): Promise<AppResource> {
  if (!isValidPackageID(packageName, platform)) {
    throw new ValueError(`"${packageName}" is not a valid ${platform} ID`);
  }

  const body: CreateAppParams = {
    platform,
    package: packageName,
  };
  if (groupRef) {
    body.group = groupRef;
  }
  return await client.post<AppResource>("/app/", body);
}
