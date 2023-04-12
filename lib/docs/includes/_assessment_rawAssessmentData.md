### rawAssessmentData

```tsx
interface PlatformAPI {
  rawAssessmentData(assessmentId: string): Promise<JSONObject>;
}
```

Returns the raw assessment data in JSON format.

| Parameter    | Descriptions               |
| ------------ | -------------------------- |
| assessmentId | The assessment to retrieve |
