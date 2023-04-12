/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  DEFAULT_API_URL,
  DEFAULT_LAB_API_URL,
  DEFAULT_LAB_UI_URL,
  PlatformConfig,
} from "../src/platform-config";
import { Assessment } from "../src/types/platform";
import asmt from "./resources/assessment.json";

describe("platform-config", () => {
  test("defaults", () => {
    const pf = new PlatformConfig("token");
    expect(pf.labApiUrl).toBe(DEFAULT_LAB_API_URL);
    expect(pf.apiUrl).toBe(DEFAULT_API_URL);
    expect(pf.labUrl).toBe(DEFAULT_LAB_UI_URL);
  });

  test("url generation", () => {
    const config = new PlatformConfig("token");
    const assessment = asmt as unknown as Assessment;
    const finding = assessment.report?.findings[0];

    expect(config.assessmentLink(assessment)).toBe(
      `${DEFAULT_LAB_UI_URL}/app/00000000-0000-0000-0000-000000000001/assessment/00000000-0000-0000-0000-000000000002`
    );
    expect(config.assessmentLink(assessment, finding)).toBe(
      `${DEFAULT_LAB_UI_URL}/app/00000000-0000-0000-0000-000000000001/assessment/00000000-0000-0000-0000-000000000002/findings#finding-check_1`
    );
  });
});
