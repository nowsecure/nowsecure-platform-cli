### processBinary

```tsx
interface PlatformAPI {
  processBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    version?: string,
    analysisType?: AnalysisType
    config?: RequestConfig
  ): Promise<ProcessApplicationResponse>;
}

enum AnalysisType {
  FULL = "full",
  STATIC = "static",
  DEPENDENCIES = "dependencies",
}

interface ProcessApplicationResponse {
  ref: string;
  application: string;
  group: string;
  account: string;
  platform: string;
  package: string;
  task: number;
  creator: string;
  created: string;
  binary: string;
  config: unknown;
  status: {
    static: {
      state: AssessmentJobSummaryStatus;
    };
    dynamic: {
      state: AssessmentJobSummaryStatus;
    };
  };
  cancelled: boolean;
  task_status: AssessmentJobSummaryStatus;
  events: unknown;
}
```

Upload an ipa or apk file to Platform and begin an assessment.

| Parameter    | Description                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| stream       | The application data to send to Platform                                                                                           |
| groupId      | The application group to use for the assessment. Required if the user is a member of more than one group                           |
| version      | Optional version string for the build. If this field is not specified the version from the application package will be used        |
| analysisType | If specified, the type of analysis to run. "static" runs a static-only analysis, "dependencies" returns the SBOM dependency graph. |
| config       | [`RequestConfig`](#requestconfig). Upload progress can be monitored via the `onUploadProgress` callback.                           |

`ProcessApplicationResponse`

| Field       | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| ref         | The ID of the triggered assessment                                              |
| application | ID of the application                                                           |
| group       | ID of the application group                                                     |
| account     | historical duplicate of group                                                   |
| platform    | The platform type (`android` or `ios`)                                          |
| package     | The package identifier                                                          |
| task        | The ID of the task running the assessment. Can be used to cancel the assessment |
| creator     | ID of the user triggering the assessment                                        |
| created     | Timestamp when the assessment was created (ISO DateTime format)                 |
| binary      | Unique ID for this package (SHA-256 hash of the binary)                         |
| config      | The configuration used for this assessment                                      |
| status      | The status of the static and dynamic portions of the assessment                 |
| cancelled   | True if the assessment has been cancelled                                       |
| task_status | Overall status of the assessment                                                |
| events      | Events occurring during the assessment                                          |
