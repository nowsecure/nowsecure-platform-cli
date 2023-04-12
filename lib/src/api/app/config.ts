/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { appAnalysisConfigQuery } from "../../queries";
import { AppAnalysisConfig } from "../../types";

type Hash = Record<string, unknown>;

export async function getAnalysisConfig(
  client: NowSecureClient,
  appRef?: string
): Promise<AppAnalysisConfig> {
  const getApp = !!appRef;
  if (!getApp) {
    appRef = "00000000-0000-0000-0000-000000000000";
  }
  const ret = await appAnalysisConfigQuery(client, { ref: appRef, getApp });
  const defaultConfig = ret.auto.defaultAnalysisConfig;
  const appConfig = ret.auto.application.analysisConfig;

  if (!getApp) {
    return ret.auto.defaultAnalysisConfig;
  }
  for (const key of Object.keys(defaultConfig)) {
    if (appConfig[key as keyof AppAnalysisConfig] === null) {
      (appConfig as Hash)[key] = (defaultConfig as Hash)[key];
    }
  }
  return appConfig;
}
