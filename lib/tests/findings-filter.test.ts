/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs from "fs";
import path from "path";

import { Finding } from "../src/types/platform";
import {
  parseFilter,
  findingMatchesFilter,
  FilterConfig,
} from "../src/findings-filter";
import { JSONObject } from "../src/client";
import { ValueError } from "../src/errors";

const findings: Finding[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "resources", "assessment.json"), "utf8")
).report.findings;

/**
 * Test validation of filters created from a JSON object
 */
describe("filter serialization", () => {
  const test_fail = (config: JSONObject, errorClass: jest.Constructable) => {
    expect(() => parseFilter(config as FilterConfig)).toThrow(errorClass);
  };

  test("rejects incorrect types", () => {
    test_fail({ "minimum-severity": 0 }, TypeError);
    test_fail({ "include-warnings": 1 }, TypeError);
    test_fail({ "exclude-checks": "Not an array" }, TypeError);
    test_fail({ "exclude-checks": [3] }, TypeError);
    test_fail({ "include-checks": "Not an array" }, TypeError);
    test_fail({ "include-checks": [3] }, TypeError);
  });

  test("rejects invalid values", () => {
    test_fail({ "minimum-severity": "invalid" }, ValueError);
    test_fail(
      { "include-checks": ["same"], "exclude-checks": ["same"] },
      ValueError
    );
  });
});

/**
 * Test that the filter returns the correct selection
 */
describe("filter selection", () => {
  function filterTest(filterDef: JSONObject) {
    const filter = parseFilter(filterDef);
    return findings
      .filter((finding) => findingMatchesFilter(finding, filter))
      .map((finding) => finding.key);
  }

  function severityTest(severity: string) {
    return filterTest({ "minimum-severity": severity });
  }

  test("severities", () => {
    expect(severityTest("critical")).toEqual(["check_1"]);
    expect(severityTest("high")).toEqual(["check_1", "check_2"]);
    expect(severityTest("medium")).toEqual(["check_1", "check_2", "check_3"]);
    expect(severityTest("low")).toEqual([
      "check_1",
      "check_2",
      "check_3",
      "check_4",
    ]);
    expect(severityTest("info")).toEqual([
      "check_1",
      "check_2",
      "check_3",
      "check_4",
      "check_5",
      "check_6",
      "check_7",
    ]);
  });

  test("warnings", () => {
    const FILTER = {
      "minimum-severity": "critical",
      "include-warnings": true,
    };

    expect(filterTest(FILTER)).toEqual(["check_1", "check_5"]);
  });

  test("exclusion list", () => {
    const FILTER = {
      "minimum-severity": "high",
      "exclude-checks": ["check_2"],
    };
    expect(filterTest(FILTER)).toEqual(["check_1"]);
  });

  test("inclusion list", () => {
    const FILTER = {
      "minimum-severity": "high",
      "include-checks": ["check_5"],
    };
    expect(filterTest(FILTER)).toEqual(["check_1", "check_2", "check_5"]);
  });
});
