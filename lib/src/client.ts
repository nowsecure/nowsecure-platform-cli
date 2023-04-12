/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";

import { DocumentNode } from "graphql/language/ast";
import { GraphQLErrorData, GraphQLResponse } from "./types/graphql";
import { version } from "./version";
import {
  PlatformConfig,
  DEFAULT_API_URL,
  DEFAULT_LAB_API_URL,
} from "./platform-config";
import { CustomError } from "./errors";

export type RequestConfig = Pick<
  AxiosRequestConfig,
  | "onDownloadProgress"
  | "onUploadProgress"
  | "signal"
  | "timeout"
  | "timeoutErrorMessage"
>;

export type JSONType =
  | string
  | number
  | boolean
  | null
  | { [index: string]: JSONType }
  | JSONType[];
export type JSONObject = { [index: string]: JSONType };
export type JSONArray = JSONType[];

export const USER_AGENT = `NowSecure API library ${version}`;

export class GraphQLError extends CustomError {
  constructor(
    public readonly errors: GraphQLErrorData[],
    public readonly data: JSONObject
  ) {
    super(`graphql error: ${errors.map((err) => err.message).join(", ")}`);
  }
}

export function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export interface NSClientOptions {
  userAgent?: string;
}
export class NowSecureClient {
  private client: AxiosInstance;
  private apiUrl: string;
  private labApiUrl: string;
  constructor(platform: PlatformConfig, clientOptions?: NSClientOptions) {
    const {
      token: platformToken,
      apiUrl = DEFAULT_API_URL,
      labApiUrl = DEFAULT_LAB_API_URL,
    } = platform;
    this.apiUrl = apiUrl;
    this.labApiUrl = labApiUrl;

    // custom instance to keep our setup from polluting the main axios setup
    this.client = axios.create({
      headers: {
        Authorization: `Bearer ${platformToken}`,
        "User-Agent": clientOptions?.userAgent || USER_AGENT,
      },
    });
    // Retry idempotent operations up to 3 times. Delay is set to zero for tests
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: (retryCount) =>
        process.env.NODE_ENV !== "test" ? retryCount * 1000 + 100 : 0,
    });
  }

  async graphqlRequest<T extends JSONObject, V extends JSONObject = JSONObject>(
    query: string | DocumentNode,
    variables: V = null,
    ignoreGQLErrors = false,
    config?: RequestConfig,
    isMutation = false
  ): Promise<T> {
    if (typeof query !== "string") {
      query = getGqlString(query);
    }
    const request: AxiosRequestConfig = {
      ...(config || {}),
      baseURL: this.apiUrl,
      url: "/graphql",
    };

    if (isMutation) {
      request.method = "post";
      request.data = { query, variables: variables || {} };
    } else {
      request.method = "get";
      request.params = {
        query,
        variables: JSON.stringify(variables || {}),
      };
    }

    const response = await this.client<GraphQLResponse<T>>(request);

    if (response.data.errors && !ignoreGQLErrors) {
      throw new GraphQLError(response.data.errors, response.data.data);
    }

    return response.data.data || null;
  }

  async query<T extends JSONObject, V extends JSONObject = JSONObject>(
    query: string | DocumentNode,
    variables: V = null,
    ignoreGQLErrors = false,
    config?: RequestConfig
  ): Promise<T> {
    return this.graphqlRequest(
      query,
      variables,
      ignoreGQLErrors,
      config,
      false
    );
  }

  async mutation<T extends JSONObject, V extends JSONObject = JSONObject>(
    query: string | DocumentNode,
    variables: V = null,
    ignoreGQLErrors = false,
    config?: RequestConfig
  ): Promise<T> {
    return this.graphqlRequest(query, variables, ignoreGQLErrors, config, true);
  }

  async get<T>(relativeUrl: string, config?: RequestConfig) {
    const response = await this.client.get<T>(
      this.restURL(relativeUrl),
      config
    );

    return response.data;
  }

  async post<T>(
    relativeUrl: string,
    params: JSONObject = {},
    config?: RequestConfig
  ) {
    const response = await this.client.post<T>(
      this.restURL(relativeUrl),
      params,
      config
    );

    return response.data;
  }

  async postStream<T>(
    relativeUrl: string,
    stream: NodeJS.ReadableStream,
    config?: RequestConfig
  ): Promise<T> {
    // Fix for https://github.com/axios/axios/issues/1045 - if maxRedirects is anything
    // other than zero the entire stream will be read into memory.
    const fullConfig: AxiosRequestConfig = {
      ...(config || {}),
      maxRedirects: 0,
    };
    const response = await this.client.post<T>(
      this.restURL(relativeUrl),
      stream,
      fullConfig
    );

    return response.data;
  }

  async delete<T = void>(
    relativeUrl: string,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.delete(
      this.restURL(relativeUrl),
      config
    );
    return response.data;
  }

  restURL(relativeUrl: string) {
    return new URL(relativeUrl, this.labApiUrl).href;
  }

  // For testing purposes only
  _axiosClient() {
    return this.client;
  }
}
