### getAppVulnerabilities

```tsx
interface PlatformApi {
  getAppVulnerabilities(appRef: string): Promise<VulnerabilityResponse>;
}
```

Retrieves the application vulnerabilities found by Platform

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| appRef    | Reference (UUID) of the application to archive |

> Return type

```tsx
interface VulnerabilityEntry {
  unique_vulnerability_id: string;
  finding_id: string;
  opened_at: string;
  last_seen_at: string;
  last_seen_cvss: number;
  closed_at: string;
  opened_in_assessment_id: string;
  last_seen_in_assessment_id: string;
  opened_in_app_version: string;
  last_seen_in_app_version: string;
  closed_in_assessment_id: string;
  closed_in_app_version: string;
  finding_title: string;
}

type VulnerabilityResponse = VulnerabilityEntry[];
```

| Field                              | Type   | Description                                                                                                                                                                                                                                                  |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| unique_vulnerability_id            | Number | Monotonically increasing 64-bit integer key representing the identified vulnerability record                                                                                                                                                                 |
| finding_id                         | String | Finding key enum representing the specific finding associated with vulnerability                                                                                                                                                                             |
| opened_at                          | Date   | Timestamp representing when this specific identified vulnerability record was created                                                                                                                                                                        |
| last_seen_at                       | Date   | Timestamp representing the last time we recorded when this specific vulnerability recurred                                                                                                                                                                   |
| last_seen_cvss                     | Number | CVSS value associated with the finding                                                                                                                                                                                                                       |
| closed_at                          | Date   | Timestamp representing when the associated finding was found to no longer be a vulnerability (i.e. either it was tested for and found to not be affected, or the finding was edited to push the CVSS score down to 0, making it no longer a vulnerability)   |
| opened_in_assessment_id            | String | UUID assessment "ref" associated with last assessment where vulnerability was first discovered (e.g. assessment with a non-zero CVSS score for associated finding, and no preexisting identified vuln associated with this app and finding was already open) |
| last_seen_in_assessment_id         | String | UUID assessment "ref" associated with most recent assessment where finding was found to still be vulnerable                                                                                                                                                  |
| opened_in_app_version              | String | Textual app version associated with assessment                                                                                                                                                                                                               |
| last_seen_in_app_version           | String | Textual app version associated with last seen assessment                                                                                                                                                                                                     |
| closed_in_assessment_id (optional) | String | If vulnerability record is closed, the uuid assessment "ref" associated with assessment which closed the vuln                                                                                                                                                |
| closed_in_app_version (optional)   | String | If vulnerability record is closed, the textual app version associated with assessment which closed the vuln                                                                                                                                                  |
