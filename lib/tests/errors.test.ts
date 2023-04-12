/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { CustomError } from "../src/errors";

class TestError extends CustomError {}

describe("custom errors", () => {
  test("sets the error name from the class", () => {
    expect(new CustomError().name).toBe("CustomError");
    expect(new TestError().name).toBe("TestError");
  });
});
