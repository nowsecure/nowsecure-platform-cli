### listAssessments

```tsx
interface PlatformAPI {
  listAssessments(
    options?: AssessmentsQueryVariables,
    filter?: Filter
  ): Promise<Assessment[]>;
}

type AssessmentsQueryVariables = {
  groupRefs?: string[] | string | null;
  platformType?: PlatformEnum | null;
  refs?: string[] | string | null;
  limit?: number | null;
  scope?: string | null;
  affectedByFindingKey?: string | null;
  status?: string | null;
  since?: string | null;
  after?: string | null;
  before?: string | null;
  until?: string | null;
  reverse?: boolean | null;
  includeDeleted?: boolean | null;
  defaultConfig?: boolean | null;
  appstoreDownload?: boolean | null;
  failFast?: boolean | null;
  favorite?: boolean | null;
  includeDeputy?: boolean | null;
  includeConfig?: boolean | null;
  includeState?: boolean | null;
  includeReport?: boolean | null;
  includeBuild?: boolean | null;
};
```

Return a list of assessments

| Parameter | Description                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options   | Select which assessments & what data to return                                                                                                                      |
| filter    | [`Filter`](#filter) controlling which findings are returned.If no filter is specified all findings are returned, including those that do not affect the application |

`AssessmentsQueryVariables`<br/>

| Field                | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| groupRefs            | Filter by group reference                                                     |
| platformType         | Filter by platform type (ios or android)                                      |
| refs                 | Filter by assessment ID                                                       |
| limit                | Limit the number of assessments returned                                      |
| scope                | Query scope                                                                   |
| affectedByFindingKey | Filter assessments affected by a specific finding. Requires a limit to be set |
| status               | Filter by a status, e.g. "completed"                                          |
| since                | Filter on creation date >= date                                               |
| after                | Filter on creation date > date                                                |
| before               | Filter on creation date < date                                                |
| until                | Filter on creation date <= date                                               |
| reverse              | Reverse the order in the list                                                 |
| includeDeleted       | Include deleted assessments                                                   |
| defaultConfig        | Filter by default or custom configuration used                                |
| appstoreDownload     | Filter by the source of the binary analyzed                                   |
| failFast             | Filter by failFast option                                                     |
| favorite             | Filter by favorite status                                                     |
| includeDeputy        | Include deputy ()                                                             |
| includeConfig        | Include the assessment configuration                                          |
| includeState         | Include the current assessment state                                          |
| includeReport        | Include the findings report                                                   |
| includeBuild         | Include build information about the analyzed binary                           |
