/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Assessment, Finding } from "./types/platform";

export const DEFAULT_API_URL = "https://api.nowsecure.com";
export const DEFAULT_LAB_API_URL = "https://lab-api.nowsecure.com";
export const DEFAULT_LAB_UI_URL = "https://app.nowsecure.com";

export class PlatformConfig {
  constructor(
    /** API token */
    public readonly token: string,
    /** GraphQL server */
    public readonly apiUrl: string = DEFAULT_API_URL,
    /** REST API (uploads) */
    public readonly labApiUrl: string = DEFAULT_LAB_API_URL,
    /** UI address */
    public readonly labUrl: string = DEFAULT_LAB_UI_URL
  ) {}

  assessmentLink(assessment: Assessment, finding?: Finding) {
    return assessmentLink(this.labUrl, assessment, finding);
  }
}

export const assessmentLink = (
  labUrl: string,
  assessment: Assessment,
  finding?: Finding
) => {
  const assessmentUrl = `${labUrl}/app/${assessment.applicationRef}/assessment/${assessment.ref}`;
  return finding?.checkId
    ? `${assessmentUrl}/findings#finding-${finding.checkId}`
    : assessmentUrl;
};
