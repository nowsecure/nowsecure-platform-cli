/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { assessmentInfoQuery } from "../../queries";
import { CancelAssessmentResponse } from "../../types";

export async function cancelAssessment(
  client: NowSecureClient,
  assessmentRef: string
): Promise<CancelAssessmentResponse> {
  const info = await assessmentInfoQuery(client, { ref: assessmentRef });
  const assessment = info.auto.assessments[0];
  const url = `/app/${assessment.platformType}/${assessment.packageKey}/assessment/${assessment.taskId}/cancel?group=${assessment.groupRef}`;
  return client.post<CancelAssessmentResponse>(url);
}
