### listRoles

```tsx
interface PlatformAPI {
  listRoles(): Promise<Role[]>;
}

type Role = {
  ref?: string | null;
  name: string;
  label: string;
  description?: string | null;
  defaultPermissions: Permission[];
  permissions?: Permission[] | null;
};

type Permission = {
  ref: string;
  label: string;
  privileges?: string[] | null;
  createdAt: string;
  updatedAt: string;
};
```

Lists the roles defined for the user's organization
