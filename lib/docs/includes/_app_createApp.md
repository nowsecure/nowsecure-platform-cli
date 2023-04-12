### createApp

```tsx
interface PlatformApi {
  createApp(
    platform: PlatformEnum,
    packageName: string,
    groupRef?: string
  ): Promise<AppResource>;
}
```

Create an application record without uploading an application binary.

A group reference is required if the user is a member of more than one group.

An error will be thrown if the application already exists.

| Parameter   | Description                                               |
| ----------- | --------------------------------------------------------- |
| platform    | The target platform - `ios` or `android`                  |
| packageName | The package id, e.g. com.example.app                      |
| groupRef    | If defined, the application will be created in this group |

Returns a promise resolving to an [`AppResource`](#appresource) object
