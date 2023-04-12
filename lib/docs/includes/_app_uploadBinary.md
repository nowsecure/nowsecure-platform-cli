### processBinary

```tsx
interface PlatformAPI {
  uploadBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    config?: RequestConfig
  ): Promise<UploadApplicationResponse>;
}

interface UploadApplicationResponse {
  digest: string;
  algorithm: string;
  analyzed: boolean;
  platform: PlatformEnum;
  package: string;
  version: string;
  title: string;
  name: string;
  icon: string;
  downloaded_appstore_application_key: string;
}
```

Upload an ipa or apk file to Platform without starting an assessment.

| Parameter | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| stream    | The application data to send to Platform                                                                 |
| groupId   | The application group to use for the assessment. Required if the user is a member of more than one group |
| config    | [`RequestConfig`](#requestconfig). Upload progress can be monitored via the `onUploadProgress` callback. |

`UploadApplicationResponse`

| Field                               | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| digest                              | Hash of the uploaded binary                                       |
| algorithm                           | Algorithm used to obtain the digest                               |
| analyzed                            | True if the build has already been analyzed                       |
| platform                            | The platform type (`android` or `ios`)                            |
| package                             | The package or bundle ID of the application                       |
| version                             | Application version                                               |
| title                               | Application title                                                 |
| name                                | Application name                                                  |
| icon                                | The application's icon in Base64 encoding                         |
| downloaded_appstore_application_key | App or Play store ID for applications downloaded from their store |
