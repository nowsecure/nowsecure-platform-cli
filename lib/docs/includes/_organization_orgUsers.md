### orgUsers

```tsx
interface PlatformAPI {
  orgUsers(options: OrgUsersOptions): Promise<User[]>;
}

type OrgUsersOptions = {
  active?: boolean | null;
};
```

Lists the [`users`](#user) in the user's organization

| Parameter | Description                  |
| --------- | ---------------------------- |
| options   | Select which users to return |
