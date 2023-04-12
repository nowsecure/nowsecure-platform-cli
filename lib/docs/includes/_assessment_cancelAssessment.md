### cancelAssessment

```tsx
interface PlatformAPI {
  cancelAssessment(assessmentRef: string): Promise<CancelAssessmentResponse>;
}

interface CancelAssessmentResponse {
  status: AssessmentJobSummaryStatus;
}
```

Cancel a running assessment

| Parameter     | Description                    |
| ------------- | ------------------------------ |
| assessmentRef | ID of the assessment to cancel |
