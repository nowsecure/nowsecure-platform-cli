/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { sleep, isValidPackageID } from "../src";
import { PlatformEnum } from "../src/types";

describe("utils", () => {
  test("async sleep", async () => {
    const start = Date.now();
    await sleep(1000);
    const end = Date.now();
    // accept 800-1200ms
    expect(Math.abs(end - start - 1000)).toBeLessThan(200);
  });

  test("checkValidPackageId - Android", () => {
    const fail = (invalid: string) => {
      expect(isValidPackageID(invalid, PlatformEnum.Android)).toBe(false);
    };
    const ok = (valid: string) => {
      expect(isValidPackageID(valid, PlatformEnum.Android)).toBe(true);
    };

    fail(""); // Cannot be blank
    fail("*"); // invalid chars

    // segments must begin with alpha
    fail("0");
    fail("_");
    fail("Valid._NotValid");

    // null segment
    fail("com.");

    // check entire string checked
    fail("Invalid?");
    fail("?Invalid");

    // smallest possible
    ok("c");
    // 2 segments
    ok("com.example");
    // 3 segments
    ok("com.example.app");
    // All valid character types
    ok("Valid_0.package.More");
  });

  test("checkValidPackageId - iOS", () => {
    const fail = (invalid: string) => {
      expect(isValidPackageID(invalid, PlatformEnum.Ios)).toBe(false);
    };
    const ok = (valid: string) => {
      expect(isValidPackageID(valid, PlatformEnum.Ios)).toBe(true);
    };

    // Cannot be blank
    fail("");

    // invalid chars
    fail("*");

    // check entire string checked
    fail("Invalid?");
    fail("?Invalid");

    // can begin or end with non-alpha
    ok(".");
    ok("com.example-");

    // All valid character types
    ok("Valid-0.package.More");
  });
});
