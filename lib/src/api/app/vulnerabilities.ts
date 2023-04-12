/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { VulnerabilityResponse } from "../../types";

export /* async */ function getAppVulnerabilities(
  client: NowSecureClient,
  appRef: string
): Promise<VulnerabilityResponse> {
  const url = `/resource/app/${appRef}/vulnerability`;
  return client.get<VulnerabilityResponse>(url);
}
