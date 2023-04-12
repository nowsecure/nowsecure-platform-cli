### orgGroups

```tsx
interface PlatformAPI {
  orgGroups(options: OrgGroupsOptions): Promise<Group[]>;
}

type OrgGroupsOptions = {
  active?: boolean | null;
};
```

Lists the [`groups`](#group) in the user's organization

| Parameter | Description                   |
| --------- | ----------------------------- |
| options   | Select which groups to return |
