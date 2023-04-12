### startAssessment

```tsx
interface PlatformAPI {
  startAssessment(
    platform: PlatformEnum,
    packageName: string,
    groupRef: string,
    isAppStore: boolean
  ): Promise<StartAssessmentResponse>;
}

interface StartAssessmentResponse {
  ref: string;
  application: string;
  group: string;
  account: string;
  platform: PlatformEnum;
  package: string;
  task: number;
  creator: string;
  created: string;
  favorite: boolean;
  appstore_download: string;
  config: {
    static: Record<string, boolean>;
    dynamic: {
      actions: {
        find: string[];
        avoid: string[];
      };
      search_data: Record<
        string,
        {
          value: string;
          is_sensitive: boolean;
          search_strings: string[];
        }
      >;
    };
  };
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
}
```

Start an assessment for the latest build of an existing application.

| Parameter   | Description                                    |
| ----------- | ---------------------------------------------- |
| platform    | Application platform (`android` or `ios`)      |
| packageName | Package or Bundle ID                           |
| groupRef    | Application group                              |
| isAppStore  | Pull the binary from the appropriate app store |

`StartAssessmentResponse`

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
