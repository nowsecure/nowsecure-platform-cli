### inviteUser

```tsx
interface PlatformAPI {
  inviteUser(options: InviteUserOptions): Promise<Invitation>;
}

type InviteUserOptions = {
  name: string;
  email: string;
  roleName: string;
  groupRefs: string | string[];
};
```

Send an invitation to join the user's group

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| name      | The invitee's name                                            |
| email     | The invitee's email address                                   |
| roleName  | The role that will be assigned to the invitee                 |
| groupRefs | IDs of the group or groups to which the invitee will be added |

Returns an [`Invitiation`](#invitation) object.
