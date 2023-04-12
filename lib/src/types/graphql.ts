/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { JSONObject } from "../client";

export interface GraphQLErrorData {
  message: string;
  locations?: [{ line: number; column: number }];
  path?: [string | number];
  extensions: JSONObject;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: [GraphQLErrorData];
}
