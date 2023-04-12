/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { NowSecureClient } from "../../client";
import { CreateInvitationMutationVariables as InviteUserOptions } from "../../generated/graphql";
import {
  inviteUserMutation,
  listInvitationsQuery,
  revokeInvitationMutation,
} from "../../queries";
import { Invitation } from "../../types";

export { CreateInvitationMutationVariables as InviteUserOptions } from "../../generated/graphql";

export async function listInvitations(
  client: NowSecureClient
): Promise<Invitation[]> {
  const ret = await listInvitationsQuery(client, {});
  return ret.my.organization.invitations;
}

export async function inviteUser(
  client: NowSecureClient,
  options: InviteUserOptions
): Promise<Invitation> {
  const ret = await inviteUserMutation(client, options);
  return ret.organization.createUserInvitation;
}

export async function revokeInvitation(
  client: NowSecureClient,
  ref: string
): Promise<string> {
  const ret = await revokeInvitationMutation(client, { ref });
  return ret.organization.revokeUserInvitation.ref;
}
