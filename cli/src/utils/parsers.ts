/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { isValidPackageID } from "@nowsecure/platform-lib";
import { PlatformEnum } from "@nowsecure/platform-lib/lib/types";
import { CommandCore } from "./command-core";

export const UUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Return a list of items from a single comma separated list or a list of comma
 * separated lists.
 * @param list
 * @returns
 */
export function flattenCommaSeparated(
  list: string | string[] | undefined
): string[] | undefined {
  if (list === undefined) {
    return undefined;
  }

  if (typeof list === "string") {
    list = [list];
  }
  const listOfLists = list.map((l) => l.split(",").map((item) => item.trim()));
  return Array.prototype.concat(...listOfLists);
}

/**
 * Return a list of lowercase UUID from a single comma separated list of UUID or
 * a list of comma separated list of UUID
 *
 * If any of the inputs is not a valid UUID string context.error() will be called
 * causing the app to exit.
 *
 * @param uuids
 * @param context
 * @returns
 */
export function parseUuidLists(
  uuids: string[] | string | undefined,
  context: CommandCore
): string[] | undefined {
  const all = flattenCommaSeparated(uuids);
  if (!all) {
    return undefined;
  }

  const errors = all.filter((uuid) => !uuid.match(UUID_RE));
  if (errors.length) {
    context.error(`Invalid UUIDs: ${errors.join(", ")}`);
  }

  return all.map((x) => x.toLowerCase());
}

/**
 * Parser for UUIDs that can be passed as the `parse` member of `Flags.string`
 * @param input flag input from Command.parse()
 * @param context the executing command
 * @returns the reference, lowercased.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function parseRef(input: string, context: any) {
  if (!input.match(UUID_RE)) {
    context.error(`"${input}" is not a valid reference`);
  }
  return input.toLowerCase();
}

/**
 * Parse a date using Date.parse & return the result as an ISO format string.
 *
 * If the input does not parse to a valid date context.error will be called.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function parseDateTime(input: string, context: any) {
  const epochTime = Date.parse(input);
  if (isNaN(epochTime)) {
    context.error(`Could not parse "${input}" as a date`);
  }
  return new Date(epochTime).toISOString();
}

export function checkValidPackageId(
  packageName: string,
  platform: PlatformEnum,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  context: any
) {
  if (!isValidPackageID(packageName, platform)) {
    context.error(`"${packageName}" is not a valid ${platform} package name`);
  }
}

/**
 * Performs a basic check that a JWT might be valid
 * - it has 3 sections
 * - all 3 are valid base64
 * - the first two decode to valid JSON
 */
export function checkJWT(token: string) {
  function checkSection(section: string, checkJSON: boolean) {
    try {
      const decoded = Buffer.from(section, "base64").toString("utf8");
      if (checkJSON) {
        JSON.parse(decoded);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  const fields = token.split(".");
  return (
    fields.length == 3 &&
    checkSection(fields[0], true) &&
    checkSection(fields[1], true) &&
    checkSection(fields[2], false)
  );
}
