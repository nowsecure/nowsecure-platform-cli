### getAnalysisConfig

```tsx
interface PlatformApi {
  getAnalysisConfig(appRef?: string): Promise<AppAnalysisConfig>;
}
```

Return either the current analysis configuration for the specified app or the default configuration

| Parameter | Description                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| appRef    | Reference (UUID) of the application. If this value is falsy the default configuration is retrieved |

Returns a promise resolving to an [AppAnalysisConfig](#appanalysisconfig) object
