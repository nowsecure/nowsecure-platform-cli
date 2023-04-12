/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient, RequestConfig } from "../../client";
import { AppResource, PlatformEnum } from "../../types";

const runnerUrl = (
  platform: PlatformEnum,
  packageName: string,
  groupRef: string
) => `/app/${platform}/${packageName}/runner?group=${groupRef}`;

export async function uploadRunnerBinary(
  client: NowSecureClient,
  stream: NodeJS.ReadableStream,
  platform: PlatformEnum,
  packageName: string,
  groupRef: string,
  config?: RequestConfig
): Promise<AppResource> {
  const url = runnerUrl(platform, packageName, groupRef);
  return await client.postStream<AppResource>(url, stream, config);
}

export async function deleteRunnerBinary(
  client: NowSecureClient,
  platform: PlatformEnum,
  packageName: string,
  groupRef: string
): Promise<AppResource> {
  const url = runnerUrl(platform, packageName, groupRef);
  return await client.delete<AppResource>(url);
}
