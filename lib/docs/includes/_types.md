# Types and Interfaces

## AppResource

```tsx
interface AppResource {
  ref: string;
  account: string;
  platform: PlatformEnum;
  package: string;
  group: string;
  created: string;
  archived_at: string;
  config_level: string;
  binary: string;
  test_runner_binary: string;
  config: JSONObject;
}
```

| Field                | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `ref`                | Application reference (UUID)                                 |
| `account`            | Group UUID (duplicate of `group`)                            |
| `platform`           | `ios` or `android`                                           |
| `package`            | package id, e.g. `com.example.app`                           |
| `group`              | Group UUID                                                   |
| `created`            | Creation time for the app record in ISO format               |
| `archived_at`        | Time the application was archived in ISO format              |
| `config_level`       | string                                                       |
| `binary`             | Id of the application binary (SHA256 hash)                   |
| `test_runner_binary` | string                                                       |
| `config`             | The analysis & integration configuration for the application |

## AppAnalysisConfig

```tsx
type AppAnalysisConfigFieldsFragment = {
  jsScript?: string | null;
  dslScript?: string | null;
  dslScriptFilename?: string | null;
  searchTerms?: Array<{
    name: string;
    value: string;
    searchStrings: Array<string>;
  }> | null;
  searchData?: Array<{
    key: string;
    value: string;
    searchStrings: Array<string>;
    nonSensitive: boolean;
  }> | null;
  actions?: {
    find: Array<string>;
    avoid: Array<string>;
  } | null;
  xctest?: {
    functionName?: string | null;
    runnerFilename?: string | null;
  } | null;
  appium?: {
    archiveFilename?: string | null;
    runnerFilename?: string | null;
    interpreter?: AppiumInterpreter | null;
    setupCommand?: string | null;
    code?: string | null;
  } | null;
};
```

<table>
<thead><tr><th>Field</th><th>Descriptions</th></tr></thead>
<tbody>
<tr><td>jsScript</td><td>JavaScript to run when testing an Android app</td></tr>
<tr><td>dslScriptName</td><td>Name of the JS file containing the script. Set when uploading, display use only </td></tr>
<tr><td style="white-space: pre;">searchTerms
        name
        value
        searchStrings</td>
<td style="white-space: pre;">An array of entries for search data corresponding to the predefined terms from the default configuration.
        Name of the term
        Text to search for
        Application fields</td></tr>
<tr><td style="white-space: pre;">searchData
        key
        value
        searchStrings
        nonSensitive</td>
<td style="white-space: pre;">An array of custom search terms.
        Name of the term
        Text to search for
        Application fields
        If false, data will be shown masked in the UI</td></tr>
<tr><td style="white-space: pre;">actions
        find
        avoid</td>
<td style="white-space: pre;">Action string configuration.
        Tappable actions to search for
        Tappable actions to avoid</td></tr>
<tr><td style="white-space: pre;">xctest
        functionName
        runnerFilename</td>
<td style="white-space: pre;">XCTest configuration.
        Function to invoke
        Name of the uploaded .ipa file</td></tr>
<tr><td style="white-space: pre;">appium
        archiveFilename
        runnerFilename
        interpreter
        setupCommand
        code</td>
<td style="white-space: pre;">Appiun string configuration.
        Name of the uploaded archive
        Entry point filename
        `python3` or `node`
        Setup command
        URL for the uploaded script archive</td></tr>
</tbody>
</table>

## Assessment

```tsx
type Assessment = {
  ref: string;
  platformType: PlatformEnum;
  packageKey: string;
  packageVersion?: string | null;
  buildVersion: string;
  isAppstoreDownload: boolean;
  taskId: string;
  groupRef: string;
  applicationRef: string;
  createdAt: string;
  config?: any | null;
  deputy?: any | null;
  build?: AutoBuild | null;
  analysis?: AutoAssessmentAnalysis;
  report?: {
    findings: Finding[];
  } | null;
};
```

| Field              | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| ref                | The assessment's ID                                               |
| platformType       | android or ios                                                    |
| packageKey         | The package or bundle ID                                          |
| packageVersion     | The version retrieved from the package                            |
| buildVersion       | The build version retrieved from the package                      |
| isAppstoreDownload | True if the application binary came from the platform's app store |
| taskId             | ID of the task running the assessment                             |
| groupRef           | ID of the application group                                       |
| applicationRef     | ID of the application                                             |
| createdAt          | Creation date of the assessment                                   |
| config             | The configuration used in the assessment                          |
| deputy             | The dependency information surfaced in the assessment             |
| build              | Detailed build information                                        |
| analysis           | The detailed analysis status                                      |
| report             | The list of findings                                              |

## AutoAssessmentAnalysis

```tsx
type AutoAssessmentAnalysis = {
  status: string;
  isRunning: boolean;
  isComplete: boolean;
  isCancelled: boolean;
  errorCode?: string | null;
  task: {
    dynamic: AnalysisJob;
    static: AnalysisJob;
  };
};

type AnalysisJob = {
  status: string;
  modifiedAt?: string | null;
  isRunning: boolean;
  isComplete: boolean;
  emsg?: string | null;
};
```

The execution state of an assessment.

| Field       | Description                                   |
| ----------- | --------------------------------------------- |
| status      | Current status of the assessment              |
| isRunning   | True if the assessment is still running       |
| isComplete  | True if the assessment completed successfully |
| isCancelled | True if the assessment was cancelled          |
| errorCode   | The error if the assessment failed            |
| task        | The status of the static and dynamic jobs     |

`AnalysisJob`

| Field      | Description                            |
| ---------- | -------------------------------------- |
| status     | Status of the job                      |
| modifiedAt | Last time the job state was modified   |
| isRunning  | True if the job is still running       |
| isComplete | True if the job completed successfully |
| emsg       | The error message if the job failed    |

## AssessmentSections

```tsx
type AssessmentSections = {
  includeConfig?: boolean;
  includeDeputy?: boolean;
  includeReport?: boolean;
  includeState?: boolean;
  includeBuild?: boolean;
};
```

Controls which parts of an assessment to include when fetching an assessment.

| Field         | Description                                        |
| ------------- | -------------------------------------------------- |
| includeConfig | Include the analysis configuration data            |
| includeDeputy | Include the dependency information for the package |
| includeReport | Include the findings                               |
| includeState  | Include the assessment state information           |
| includeBuild  | Include the package build information              |

## AutoBuild

```tsx
type AutoBuild = {
  ref: string;
  groupRef: string;
  digest: string;
  platformType: PlatformEnum;
  packageKey: string;
  appstoreApplicationKey?: string | null;
  createdAt: string;
  uploadedAt?: string | null;
  uploadedBy?: string | null;
  title?: string | null;
  version?: string | null;
  iconURL?: string | null;
  isAnalyzed: boolean;
  isAppstoreDownload: boolean;
};
```

Details of specific version of a package

| Field                   | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| ref                     | The build record's ID                                                                |
| groupRef                | ID of the application group                                                          |
| digest                  | SHA256 hash of the binary                                                            |
| platformType            | android or ios                                                                       |
| packageKey              | the package or bundle ID                                                             |
| appstoreApplicationKey? | The ID used for this app by the platform's app store (if isAppstoreDownload is true) |
| createdAt               | When the build record was created                                                    |
| uploadedAt?             | When the application binary was uploaded                                             |
| uploadedBy?             | User that uploaded the binary                                                        |
| title?                  | Application title                                                                    |
| version?                | Application version. Applications uploaded                                           |
| iconURL?                | URL for the application icon                                                         |
| isAnalyzed              | True if an assessment has completed on this build                                    |
| isAppstoreDownload      | Whether the source of the binary was the platform's application store                |

## Filter

```tsx
interface Filter {
  includeChecks: string[];
  excludeChecks: string[];
  severityFilter: Severity[];
  includeWarnings: boolean;
}
```

Filter settings used to control which findings are returned in an assessment report.<br/>
All filters exclude findings which do not affect the application

| Field           | Description                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| includeChecks   | Findings to include, even if the finding does not meet the other criteria                                                                                       |
| excludeChecks   | Findings that should not be included, even if the finding meets the other criteria                                                                              |
| severityFilter  | Filter on severity, returning the finding if its severity is included in the list. Possible severity values are `critical`, `high`, `medium`, `low`, and `info` |
| includeWarnings | Include findings classed as warnings, even if the severity criterion does not include `info` findings                                                           |

## Finding

```tsx
type Finding = {
  kind: string;
  category?: string | null;
  key: string;
  title: string;
  summary?: string | null;
  affected?: boolean | null;
  severity?: VulnerabilitySeverityCategoryEnum | null;
  impactType: FindingImpactTypeEnum;
  uniqueVulnerabilityId?: number | null;
  checkId: string;
  cvss?: number | null;
  cvssVector?: string | null;
  context?: FindingContext | null;
  check: FindingCheck;
};

type FindingContext = {
  fields?: any | null;
  rows?: Array<any> | null;
  description?: string | null;
  items?: Array<any> | null;
  checkId: string;
};

type FindingCheck = {
  title: string;
  analysisType: AnalysisType;
  context?: FindingMetadata | null;
  issue?: FindingIssue | null;
};

type FindingContextMetadata = {
  view: FindingContextViewEnum;
  title?: string | null;
  fields?: Array<{
    key: string;
    title: string;
    description?: string | null;
    format?: string | null;
    template?: string | null;
  }> | null;
  children?: Array<{
    view: FindingContextViewEnum;
    title?: string | null;
    fields?: Array<{
      key: string;
      title: string;
      format?: string | null;
      template?: string | null;
    }> | null;
  }> | null;
};

type FindingIssue = {
  title: string;
  warn: boolean;
  description: string;
  impactSummary?: string | null;
  stepsToReproduce?: string | null;
  recommendation?: string | null;
  category?: VulnerabilityCategoryEnum | null;
  cvss?: number | null;
  cve?: string | null;
  cvssVector?: string | null;
  regulations: Array<{
    label: string;
    links: Array<{ title: string; url?: string | null }>;
  }>;
  codeSamples?: Array<{
    syntax: IssueCodeSyntaxType;
    caption: string;
    block: string;
  }> | null;
  guidanceLinks?: Array<{
    caption: string;
    url?: string | null;
  }> | null;
};
```

A specific instance of a finding, associated with a specific assessment.

| Field                 | Description                                                                       |
| --------------------- | --------------------------------------------------------------------------------- |
| kind                  | The finding type, `static` or `dynamic`                                           |
| category              | The finding category, e.g `network` or `code`                                     |
| key                   | Finding key                                                                       |
| title                 | The finding title                                                                 |
| summary               | Summary of the finding                                                            |
| affected              | Whether the application is affected by this finding                               |
| severity              | Finding severity                                                                  |
| impactType            | The impact of the finding, ranging from `pass` to `critical`                      |
| uniqueVulnerabilityId | Unique id of the vulnerability                                                    |
| checkId               | ID of the check made for this finding                                             |
| cvss                  | CVSS score for the finding                                                        |
| cvssVector            | CVSS vector for this finding                                                      |
| context               | The context data for this finding, for example method names using an insecure api |
| check                 | The check made for this finding                                                   |

`FindingContext`

Finding context data, including a potentially recursive declarative schema defining tabular fields, including formatting hints for rendering.

`FindingCheck`

Definition of the check that was run for this finding.ß

| Field        | Description                                     |
| ------------ | ----------------------------------------------- |
| title        | Title of the check                              |
| analysisType | `static` or `dynamic`                           |
| context      | Metadata describing the finding's context data  |
| issue        | The issue definition associated with this check |

`FindingContextMetadata`

Describes how to render the context metadata, if the finding has context.

`FindingIssue`

The definition of an issue

| Field            | Description                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| title            | The issue title                                                                                            |
| warn             | True if the issue is flagged as a developer warning                                                        |
| description      | Description of the issue                                                                                   |
| impactSummary    | The impact the issue will have on the application                                                          |
| stepsToReproduce | How to demonstrate the issue in the app                                                                    |
| recommendation   | Recommended action to remediate the issue                                                                  |
| category         | The issue category, e.g. `network` or `code`                                                               |
| cvss             | The CVSS score for the issue                                                                               |
| cve              | CVE reference                                                                                              |
| cvssVector       | CVSS vector describing the issue                                                                           |
| regulations      | List of regulations that may apply to the issue (e.g HIPAA)                                                |
| codeSamples      | Code samples showing good and bad coding practices. The `syntax` field defines the language for the sample |
| guidanceLinks    | External links to guidance on the issue                                                                    |

## Group

```tsx
type Group = {
  ref: string;
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  note?: string | null;
  currentApplicationCount: number;
  completedAssessmentCount: number;
  completedBaselineAssessmentCount: number;
  settings?: Array<{ key: string; value?: any | null } | null> | null;
};
```

Information about a group

| Field                            | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| ref                              | Group ID                                              |
| name                             | The group name                                        |
| createdAt                        | When the group was created                            |
| active                           | True if the group is active                           |
| note                             | Group notes                                           |
| currentApplicationCount          | The number of non-archived application in the group   |
| completedAssessmentCount         | Number of assessments successfully completed          |
| completedBaselineAssessmentCount | Number of baseline assessments successfully completed |
| completedAdvancedAssessmentCount | Number of advanced assessments successfully completed |
| settings                         | key-value pairs containing the group's settings       |

## Invitation

```tsx
type Invitation = {
  ref: string;
  name: string;
  email: string;
  expiredAt: string;
  role: { ref?: string | null; name: string; label: string };
  groups: Array<{ ref: string; name: string }>;
};
```

Details of an invitation to join the user's organization

| Field     | Description                         |
| --------- | ----------------------------------- |
| ref       | The ID of the invitation            |
| name      | Invitee's name                      |
| email     | Invitee's email address             |
| expiredAt | Date when the invitation expired    |
| role      | The role selected for the invitee   |
| groups    | The groups selected for the invitee |

## User

```tsx
type User = {
  ref: string;
  name: string;
  email?: string | null;
  createdAt?: string | null;
  active: boolean;
  note?: string | null;
  groups: Array<{ name: string; ref: string } | null>;
  role?: { ref?: string | null; name: string; label: string } | null;
};
```

Details of a Platform user

| Field     | Description                                            |
| --------- | ------------------------------------------------------ |
| ref       | User ID                                                |
| name      | User's name                                            |
| email     | User's email address                                   |
| createdAt | Creation date of the user record                       |
| active    | Whether the user is still active                       |
| note      | User notes                                             |
| groups    | Name and ID of the user's groups                       |
| role      | The name and ID of the user's role in the organization |
