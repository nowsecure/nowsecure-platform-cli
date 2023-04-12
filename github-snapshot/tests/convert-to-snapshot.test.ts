/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { convertToSnapshot } from "../src/index";
import type { DependenciesOutput } from "@nowsecure/platform-lib/lib/types";
import data from "./resources/dependencies-output.json";

describe("Snapshot conversion", () => {
  test("can perform conversion", async () => {
    const snapshot = convertToSnapshot(
      data as DependenciesOutput,
      "my-correlation-id",
      "7fc5849154e48c752bd5436f8ec32b2bc00e548e",
      "branch-or-tag",
      12345
    );
    expect(snapshot).toMatchSnapshot();
  });
});
