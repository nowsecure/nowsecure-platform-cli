### updateAnalysisConfig

```tsx
interface PlatformAPI {
  updateAnalysisConfig(
    appRef: string,
    runnerType?: RunnerType,
    runnerFile?: string,
    update?: UpdateConfigOptions,
    mergeSearchTerms?: boolean,
    requestConfig?: RequestConfig
  ): Promise<void>;
}

type UpdateSearchDataInput = {
  key: string;
  value?: string;
  searchStrings?: string[];
};

type UpdateSearchTermInput = {
  name: string;
  searchStrings?: string[];
  value?: string;
};

type UpdateConfigOptions = {
  appium?: {
    archiveFilename?: string;
    interpreter?: string;
    runnerFilename?: string;
    setupCommand?: string;
  };
  xctest?: {
    functionName?: string;
    runnerFilename?: string;
  };
  actions?: Partial<AnalysisConfigActionsEntry>;
  searchData?: UpdateSearchDataInput[] | null;
  searchTerms?: UpdateSearchTermInput[] | null;
};
```

Update the analysis configuration for an application

| Parameter        | Description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| appRef           | ID of the target application                                                       |
| runnerType       | Type of the runner to set - one of `none`, `js`, `xctest` or `appium`              |
| runnerFile       | Path to the runner to upload                                                       |
| update           | Updates to the existing configuration                                              |
| mergeSearchTerms | Controls whether the searchTerms array overwrites or is merged with existing terms |
| requestConfig    | [`RequestConfig`](#requestconfig) for the operation                                |

**Configuring scripts**

If the runnerType parameter is `none` the existing script (if any) will be removed.
For `js`, `xctest` or `appium` types an appropriate runner file must be passed in runnerFile.

`appium` requires that the update paramater contains values for `interpreter` (`node` or `python3`) and `runnerFileName` (the entry point) in the `appium` object.

If the runnerType parameter is undefined the xctest `runnerFileName`, and appium `interpreter` and `archiveFilename` values cannot be changed.

**Configuring search terms**

Any missing values in the `update.searchData` list will be filled from the existing configuration. Passing `null` as the value of `update.searchData` will reset the terms to their default values.

Passing null for `update.searchTerms` will remove any existing custom terms.

If `mergeSearchTerms` is false the list of custom terms in `update.searchTerms` (if defined) will overwrite the existing custom terms.

If `mergeSearchTerms` is true the update data is used to update the existing list:

- Items that have a `null` value will be removed from the existing list
- Items with a non-null value will update existing items (if the name matches an existing item) or add a new item.

**Configuring Action Strings**

Passing null for `update.actions` will reset the action strings to the system defaults.<br/>
The find and avoid lists can also be individually reset by passing null for `update.actions.find` or `update.actions.avoid`

If a non-null value is passed for find or avoid the new list will overwrite the existing settings.
