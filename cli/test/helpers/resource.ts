/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from "fs";
import path from "path";

/**
 * Get the normalised absolute path to a file in the test resources folder
 * @param paths path to the file relative to the resources folder
 */
export function resourcePath(...paths: string[]) {
  return path.join(__dirname, "..", "resources", ...paths);
}

/**
 * Read a utf-8 encoded file in the test resources folder
 * @param paths path to the file relative to the resources folder
 */
export function loadTextResource(...paths: string[]) {
  const filePath = resourcePath(...paths);
  return readFileSync(filePath, "utf8");
}

/**
 * Read a binary file in the test resources folder
 * @param paths path to the file relative to the resources folder
 */
export function loadBinaryResource(...paths: string[]) {
  const filePath = resourcePath(...paths);
  return readFileSync(filePath);
}
