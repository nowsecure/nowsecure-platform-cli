### fetchAssessment

```tsx
interface PlatformAPI {
  fetchAssessment(
    reportId: string,
    sections?: AssessmentSections,
    filter?: Filter
  ): Promise<Assessment | null>;
}
```

Fetch an assessment. The query returns with the current state of the assessment which will
include incomplete data if the assessment has yet to complete.

| Parameter | Description                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reportId  | ID of the assessment to fetch                                                                                                                                        |
| sections  | [`AssessmentSections`](#assessmentsections) object controlling which sections of the assessment are fetched                                                          |
| filter    | [`Filter`](#filter) controlling which findings are returned. If no filter is specified all findings are returned, including those that do not affect the application |
