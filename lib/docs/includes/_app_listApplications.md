### listApplications

```tsx
interface PlatformAPI {
  listApplications(
    options?: ListApplicationOptions,
    filter?: Filter
  ): Promise<Application[]>
}

type ListApplicationOptions {
  refs?: string | string[] | null;
  groupRefs?: string | string[]| null;
  platformTypes?: PlatformEnum | PlatformEnum[] | null;
  packageKeys?: string | string[]| null;
  limit?: number| null;
  offset?: number| null;
  reverse?: boolean| null;
  lastAssessment?: boolean| null;
  includeDeputy?: boolean| null;
  includeConfig?: boolean| null;
  includeState?: boolean| null;
  includeReport?: boolean| null;
  includeBuild?: boolean| null;
}

type Application {
  ref: string;
  platformType: PlatformEnum;
  packageKey: string;
  title?: string | null;
  iconURL?: string | null;
  createdAt: string;
  archivedAt?: string | null;
  group: {
    ref: string;
    name: string
  };
  latestCompleteAssessment?: Assessment
}
```

Returns a list of applications

| Parameter | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| options   | Search and output selection parameters                                |
| filter    | Finding filter applied to the last complete assessment (if requested) |

`ListApplicationOptions`:

| Field          | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| refs           | Filter the list by application reference(s)                                                   |
| groupRefs      | Filter the list by group reference(s). Only applications in the specified groups are returned |
| platformTypes  | Filter the list by platform type(s)                                                           |
| packageKeys    | Filter the list by package name / bundle ID                                                   |
| limit          | Pagination: Maximum number of applications to return                                          |
| offset         | Pagination: Offset within the returned list                                                   |
| reverse        | Return the list in reverse order                                                              |
| lastAssessment | Return the last completed assessment in the returned data                                     |
| includeDeputy  | Include Deputy (library dependency) information in the last assessment                        |
| includeConfig  | Include the assessment configuration data                                                     |
| includeState   | Include the assesment data                                                                    |
| includeReport  | Include the findings report                                                                   |
| includeBuild   | Include the build details                                                                     |

`Application`

| Field                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| ref                      | The application reference ID                    |
| platformType             | `ios` or `android`                              |
| packageKey               | The bundle or package ID                        |
| createdAt                | Creation date of the application record         |
| archivedAt               | Date when the application was archived, or null |
| group                    | The ID and name of the application group        |
| latestCompleteAssessment | The last successful [Assessment](#assessment)   |
