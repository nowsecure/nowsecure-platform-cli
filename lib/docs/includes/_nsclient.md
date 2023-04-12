## NowSecureClient

NowSecureClient is the class used for raw calls to the NowSecure Platform APIs (both REST and GraphQL)

### constructor

```tsx
constructor(platform: PlatformConfig, options?: NSClientOptions);
```

```tsx
import {
  PlatformConfig,
  NSClientOptions,
  version,
  NowSecureClient,
} from "@nowsecure/platform-lib";

const config = new PlatformConfig("MyPlatformApiToken");
const options: NSClientOptions = {
  userAgent: `My Amazing App / NS Library ${version}`,
};
return new NowSecureClient(config, options);
```

Create a new NowSecureClient with the parameters passed in a PlatformConfig object

### async query(query, variables, ignoreGQLErrors, config)

```tsx
  query<T, V extends JSONObject = JSONObject>(
    query: string | DocumentNode,
    variables?: V,
    ignoreGQLErrors?: boolean,
    config?: RequestConfig
  ): Promise<T>;
```

Runs a graphql query using an HTTP GET call. This call will retry up to 3 times on failure.

| Parameter       | Description                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| query           | The GraphQL query to execute. This can be a string or a [graphql](https://github.com/graphql/graphql-js) document node. |
| variables       | Variables used in the query                                                                                             |
| ignoreGQLErrors | Don't throw an exception when errors are present in the response                                                        |
| config          | [Request configuration](#requestconfig)                                                                                 |

### async mutation(query, variables, ignoreGQLErrors, config)

```tsx
  mutation<T, V extends JSONObject = JSONObject>(
    query: string | DocumentNode,
    variables?: V,
    ignoreGQLErrors?: boolean,
    config?: RequestConfig
  ): Promise<T>
```

Runs a graphql mutation using an HTTP POST call. This call will not retry on failure.

| Parameter | Description                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| query     | The GraphQL mutation to execute. This can be a string or a [graphql](https://github.com/graphql/graphql-js) document node. |
| variables | Variables used in the query                                                                                                |
| config    | Request configuration                                                                                                      |

### get(path, config)

```tsx
  get<T>(relativeUrl: string, config?: RequestConfig): Promise<T>;
```

Sends a GET request to the REST server. The request will retry on error

| Parameter   | Description                                     |
| ----------- | ----------------------------------------------- |
| relativeUrl | Path for the request including query parameters |
| config      | Request configuration                           |

### post(relativeUrl, params, config)

```tsx
  post<T>(
    relativeUrl: string,
    params?: JSONObject,
    config?: RequestConfig
  ): Promise<T>;
```

Sends a POST request to the REST server. The request will not retry on error

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| query     | Path for the request including query parameters. |
| variables | Sent as JSON body                                |
| config    | Request configuration                            |

### postStream(relativeUrl, stream, config)

```tsx
  postStream<T>(
    relativeUrl: string,
    stream: NodeJS.ReadableStream,
    config?: RequestConfig
  ): Promise<T>;
```

Stream a NodeJS stream incrementally to the REST server. The request will not retry on error

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| query     | Path for the request including query parameters. |
| stream    | The stream to send                               |
| config    | Request configuration                            |

### delete(relativeUrl, config)

```tsx
  async delete<T = void>(
    relativeUrl: string,
    config?: RequestConfig
  ): Promise<T>;
```

Sends a DELETE request to the server. The request will retry on error

| Parameter   | Description                                     |
| ----------- | ----------------------------------------------- |
| relativeUrl | Path for the request including query parameters |
| config      | Request configuration                           |

## RequestConfig

```tsx
type RequestConfig = Pick<
  AxiosRequestConfig,
  | "onDownloadProgress"
  | "onUploadProgress"
  | "signal"
  | "timeout"
  | "timeoutErrorMessage"
>;

// equivalent to
interface RequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
}
```

> Use of the `signal` field:

A subset of the [AxiosRequestConfig](https://axios-http.com/docs/req_config) options passed to NowSecureClient get and post operations.

| Field                 | Description                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `onDownloadProgress`  | A callback invoked when data is received in a streaming download operation                                         |
| `onUploadProgress`    | A callback invoked when data is sent in a streaming upload operation                                               |
| `signal`              | An [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) used to terminate a request |
| `timeout`             | timeout period in milliseconds for the request                                                                     |
| `timeoutErrorMessage` | message to return in the `AxiosError` returned when a request times out                                            |

```tsx
const controller = new AbortController();
await client.get(url, { signal: controller });

// invoked from e.g. a UI event handler
controller.abort();
```
