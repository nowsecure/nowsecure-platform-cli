/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient, RequestConfig } from "../../client";
import {
  ProcessApplicationResponse,
  UploadApplicationResponse,
} from "../../types/platform";

export enum AnalysisType {
  FULL = "full",
  STATIC = "static",
  DEPENDENCIES = "dependencies",
}

function queryParams(
  groupId?: string,
  version?: string,
  analysisType?: AnalysisType
) {
  const args: string[] = [];
  if (groupId) {
    args.push("group=" + encodeURIComponent(groupId));
  }
  if (version) {
    args.push("version=" + encodeURIComponent(version));
  }
  if (analysisType) {
    switch (analysisType) {
      case AnalysisType.FULL:
        break;
      case AnalysisType.DEPENDENCIES:
        args.push("analysisType=sbom");
        break;
      case AnalysisType.STATIC:
        args.push("analysisType=static");
        break;
    }
  }

  return args.length > 0 ? "?" + args.join("&") : "";
}

/**
 * Upload an application binary stream to NowSecure Platform and return job
 * details. Throws an exception if an error occurs.
 */
export /*async*/ function processBinary(
  client: NowSecureClient,
  stream: NodeJS.ReadableStream,
  groupId?: string,
  version?: string,
  analysisType?: AnalysisType,
  config?: RequestConfig
): Promise<ProcessApplicationResponse> {
  const paramStr = queryParams(groupId, version, analysisType);
  return client.postStream<ProcessApplicationResponse>(
    `/build/${paramStr}`,
    stream,
    config
  );
}

// Upload returns the token used in the operation, this gets stripped to prevent accidental disclosure
interface FullUploadApplicationResponse extends UploadApplicationResponse {
  token: string;
}

export async function uploadBinary(
  client: NowSecureClient,
  stream: NodeJS.ReadableStream,
  groupId?: string,
  config?: RequestConfig
): Promise<UploadApplicationResponse> {
  const paramStr = queryParams(groupId);
  const ret = await client.postStream<FullUploadApplicationResponse>(
    `/binary/${paramStr}`,
    stream,
    config
  );
  delete ret.token;
  return ret;
}
