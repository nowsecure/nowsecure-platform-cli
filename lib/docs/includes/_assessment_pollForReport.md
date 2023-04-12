### pollForReport

```tsx
interface PlatformAPI {
  pollForReport(
    reportId: string,
    sections?: AssessmentSections,
    filter?: Filter,
    pollInterval = 60000,
    timeout = 0
  ): Promise<Assessment | null>;
}
```

Waits for an assessment to complete.

| Parameter    | Description                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reportId     | ID of the assessment to fetch                                                                                                                                        |
| sections     | [`AssessmentSections`](#assessmentsections) object controlling which sections of the assessment are fetched                                                          |
| filter       | [`Filter`](#filter) controlling which findings are returned. If no filter is specified all findings are returned, including those that do not affect the application |
| pollInterval | Polling interval in milliseconds. Defaults to polling every minute.                                                                                                  |
| timeout      | Timeout in milliseconds; if the timeout is exceeded the function will return `null`. Pass 0 to retry indefinitely                                                    |
