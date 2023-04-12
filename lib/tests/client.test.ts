/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Readable } from "stream";
import { AxiosError } from "axios";
import nock from "nock";
import { JSONObject, NowSecureClient, GraphQLError } from "../src";
import { PlatformConfig } from "../src/platform-config";
import MockAdapter from "axios-mock-adapter";

const REST_ENDPOINT = "/endpoint";
const TEST_STRING = "hello world";

let config: PlatformConfig;
let client: NowSecureClient;

beforeAll(() => {
  config = new PlatformConfig("auth");
  client = new NowSecureClient(config);
});

afterAll(() => {
  nock.cleanAll();
});

const nockGql = () => nock(config.apiUrl).get("/graphql").query(true);
const nockGet = () => nock(config.labApiUrl).get(REST_ENDPOINT);
const nockPost = () => nock(config.labApiUrl).post(REST_ENDPOINT);
const nockDel = () => nock(config.labApiUrl).delete(REST_ENDPOINT);

const testStream = () => {
  const s = new Readable();
  s.push(TEST_STRING); // the string you want
  s.push(null);
  return s;
};

async function getError<T>(p: Promise<unknown>): Promise<T | undefined> {
  try {
    await p;
    expect(true).toBe(false);
  } catch (e) {
    return e as T;
  }
}

describe("client", () => {
  test("bearer token is correct", async () => {
    nockGql().reply(function () {
      expect(this.req.headers?.["authorization"]).toBe("Bearer auth");
      return [200, {}];
    });

    await client.query("");
  });

  test("GraphQL errors are reported", async () => {
    const data = {
      succeeded: { one: 1 },
      failed: null as JSONObject | null,
    };
    const error1 = {
      path: ["failed"],
      locations: [{ line: 2, column: 3 }],
      message: "Something went wrong",
    };
    const error2 = {
      path: ["failed"],
      locations: [{ line: 2, column: 3 }],
      message: "Something else went wrong",
    };
    const errors = [error1, error2];
    const response = { data, errors };

    nockGql().reply(200, response);

    const e = await getError<GraphQLError>(client.query(""));

    expect(e).toBeInstanceOf(GraphQLError);
    expect(e?.message.indexOf(error1.message)).toBeGreaterThanOrEqual(0);
    expect(e?.message.indexOf(error2.message)).toBeGreaterThanOrEqual(0);
    expect(e?.data).toEqual(data);
    expect(e?.errors).toEqual(errors);
  });

  test.each([1, 2, 3])(
    "query performs retries for 502 errors (%d times)",
    async (times) => {
      const scope1 = nockGql().times(times).reply(502);
      const scope2 = nockGql().reply(200);

      await client.query("");
      expect(scope1.isDone());
      expect(scope2.isDone());
    }
  );

  test("query fails on 4th error", async () => {
    const scope = nockGql().times(4).reply(502);

    const e = await getError<AxiosError>(client.query(""));
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);

    expect(scope.isDone());
  });

  test("no retry for mutations", async () => {
    const scope1 = nock(config.apiUrl).post("/graphql").reply(502);
    const scope2 = nock(config.apiUrl).post("/graphql").reply(200);

    const e = await getError<AxiosError>(client.mutation(""));
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);

    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(false);
    nock.cleanAll();
  });

  test("relative URL construction", () => {
    expect(client.restURL("/relative?query=text")).toBe(
      `${config.labApiUrl}/relative?query=text`
    );
    expect(client.restURL("relative?query=text")).toBe(
      `${config.labApiUrl}/relative?query=text`
    );
  });

  test("get", async () => {
    const responseData = { hello: "world" };
    const scope = nockGet().reply(200, responseData);
    const data = await client.get<JSONObject>(REST_ENDPOINT);
    expect(data).toEqual(responseData);
    expect(scope.isDone()).toBe(true);
  });

  test.each([1, 2, 3])(
    "get performs retries for 502 errors (%d times)",
    async (times) => {
      const responseData = { hello: "world" };
      const scope1 = nockGet().times(times).reply(502);
      const scope2 = nockGet().reply(200, responseData);

      const data = await client.get<JSONObject>(REST_ENDPOINT);
      expect(data).toEqual(responseData);

      expect(scope1.isDone());
      expect(scope2.isDone());
    }
  );

  test("get fails on 4th error", async () => {
    const scope = nockGet().times(4).reply(502);

    const e = await getError<AxiosError>(client.get(REST_ENDPOINT));
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);

    expect(scope.isDone());
  });

  test("post", async () => {
    const postData = { one: 2 };
    const responseData = { hello: "world" };
    const scope = nockPost().reply(200, (_uri, body) => {
      expect(body).toEqual(postData);
      return responseData;
    });
    const data = await client.post<JSONObject>(REST_ENDPOINT, postData);
    expect(data).toEqual(responseData);
    expect(scope.isDone()).toBe(true);
  });

  test("post does not retry", async () => {
    const scope1 = nockPost().reply(502);
    const scope2 = nockPost().reply(200);

    const e = await getError<AxiosError>(client.post(REST_ENDPOINT));
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);

    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(false);
  });

  test("delete response", async () => {
    const responseData = { hello: "world" };
    const scope = nockDel().reply(200, responseData);
    const data = await client.delete<JSONObject>(REST_ENDPOINT);
    expect(data).toEqual(responseData);
    expect(scope.isDone()).toBe(true);
  });

  test.each([1, 2, 3])(
    "delete performs retries for 502 errors (%d times)",
    async (times) => {
      const responseData = { hello: "world" };
      const scope1 = nockDel().times(times).reply(502);
      const scope2 = nockDel().reply(200, responseData);

      const data = await client.delete<JSONObject>(REST_ENDPOINT);
      expect(data).toEqual(responseData);

      expect(scope1.isDone());
      expect(scope2.isDone());
    }
  );

  test("delete fails on 4th error", async () => {
    const scope = nockDel().times(4).reply(502);

    const e = await getError<AxiosError>(client.delete(REST_ENDPOINT));
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);

    expect(scope.isDone());
  });

  // Nock appears to respond with a 200 and no data before the reply function is called
  // when fed a stream, hence the split of send and receive tests for postStream.
  test("postStream send", async () => {
    nockPost().reply(200, (_uri, body) => {
      expect(body).toEqual(TEST_STRING);
      return {};
    });
    await client.postStream<JSONObject>(REST_ENDPOINT, testStream());
  });

  test("postStream response", async () => {
    const responseData = { hello: "world" };

    client = new NowSecureClient(config);
    const mock = new MockAdapter(client._axiosClient());
    mock.onPost(client.restURL(REST_ENDPOINT)).reply(() => {
      return [200, responseData];
    });
    const data = await client.postStream<JSONObject>(
      REST_ENDPOINT,
      testStream()
    );
    expect(data).toEqual(responseData);
    mock.restore();
  });

  test("postStream does not retry", async () => {
    let doneResponse = false;

    client = new NowSecureClient(config);
    const mock = new MockAdapter(client._axiosClient());
    mock.onPost(client.restURL(REST_ENDPOINT)).reply(() => {
      expect(doneResponse).toBe(false);
      doneResponse = true;
      return [502, {}];
    });
    const e = await getError<AxiosError>(
      client.postStream(REST_ENDPOINT, testStream())
    );
    expect(e).toBeInstanceOf(AxiosError);
    expect(e?.response?.status).toBe(502);
    mock.restore();
  });
});
