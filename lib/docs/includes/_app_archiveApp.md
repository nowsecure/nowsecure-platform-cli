### archiveApp

```tsx
interface PlatformApi {
  archiveApp(appRef: string, unarchive?: boolean): Promise<AppResource>;
}
```

Archives or unarchives an application. Archiving an already archived application is not an error.

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| appRef    | Reference (UUID) of the application to archive |
| unarchive | Unarchive the application                      |

Returns a promise resolving to an [`AppResource`](#appresource) object
