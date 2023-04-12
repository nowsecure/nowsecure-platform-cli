/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { PlatformEnum } from "./types";

/** Promisified setTimeout */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, milliseconds);
  });
}

export const ANDROID_PACKAGE_RE =
  /^[A-Za-z][A-Za-z0-9_]*(.[A-Za-z][A-Za-z0-9_]*)*$/;

export const IOS_PACKAGE_RE = /^[A-Za-z0-9\-.]+$/;

/**
 * Checks that an Android package name or iOS BundleID is valid
 *
 * @param packageName Package name or bundle ID
 * @param platform ios or android
 * @returns true if the name is valid for the specified platform
 */
export function isValidPackageID(packageName: string, platform: PlatformEnum) {
  const re =
    platform === PlatformEnum.Android ? ANDROID_PACKAGE_RE : IOS_PACKAGE_RE;
  return re.test(packageName);
}
