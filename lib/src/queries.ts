/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { DocumentNode } from "graphql/language/ast";
import { JSONObject, NowSecureClient } from "./client";
import {
  AppsList,
  AppsListQuery,
  AppsListQueryVariables,
  Assessments,
  AssessmentInfo,
  AssessmentInfoQuery,
  AssessmentInfoQueryVariables,
  AssessmentsQuery,
  AssessmentsQueryVariables,
  CreateInvitation,
  CreateInvitationMutation,
  CreateInvitationMutationVariables,
  CurrentUser,
  CurrentUserQuery,
  CurrentUserQueryVariables,
  Invitations,
  InvitationsQuery,
  InvitationsQueryVariables,
  LicenseValid,
  LicenseValidQuery,
  LicenseValidQueryVariables,
  OrgGroupsQueryVariables,
  OrgGroupsQuery,
  OrgGroups,
  OrgUsers,
  OrgUsersQuery,
  OrgUsersQueryVariables,
  RevokeInvitation,
  RevokeInvitationMutation,
  RevokeInvitationMutationVariables,
  Roles,
  RolesQuery,
  RolesQueryVariables,
  UserGroups,
  UserGroupsQuery,
  UserGroupsQueryVariables,
  AppAnalysisConfigQuery,
  AppAnalysisConfigQueryVariables,
  AppAnalysisConfig,
  UpdateAppAnalysisConfigMutation,
  UpdateAppAnalysisConfigMutationVariables,
  UpdateAppAnalysisConfig,
  ResetAppAnalysisConfigMutation,
  ResetAppAnalysisConfigMutationVariables,
  ResetAppAnalysisConfig,
} from "./generated/graphql";

export function makeQuery<RET extends JSONObject, ARGS extends JSONObject>(
  query: DocumentNode | string
): (
  client: NowSecureClient,
  args: ARGS,
  ignoreGQLErrors?: boolean
) => Promise<RET> {
  return (client: NowSecureClient, args: ARGS, ignoreGQLErrors = false) => {
    return client.query<RET, ARGS>(query, args, ignoreGQLErrors);
  };
}

export function makeMutation<RET extends JSONObject, ARGS extends JSONObject>(
  query: DocumentNode | string
): (
  client: NowSecureClient,
  args: ARGS,
  ignoreGQLErrors?: boolean
) => Promise<RET> {
  return (client: NowSecureClient, args: ARGS, ignoreGQLErrors = false) => {
    return client.mutation<RET, ARGS>(query, args, ignoreGQLErrors);
  };
}

export const listApplicationsQuery = makeQuery<
  AppsListQuery,
  AppsListQueryVariables
>(AppsList);

export const assessmentInfoQuery = makeQuery<
  AssessmentInfoQuery,
  AssessmentInfoQueryVariables
>(AssessmentInfo);

export const assessmentsQuery = makeQuery<
  AssessmentsQuery,
  AssessmentsQueryVariables
>(Assessments);

export const listInvitationsQuery = makeQuery<
  InvitationsQuery,
  InvitationsQueryVariables
>(Invitations);

export const licenseValidQuery = makeQuery<
  LicenseValidQuery,
  LicenseValidQueryVariables
>(LicenseValid);

export const rolesQuery = makeQuery<RolesQuery, RolesQueryVariables>(Roles);

export const userGroupsQuery = makeQuery<
  UserGroupsQuery,
  UserGroupsQueryVariables
>(UserGroups);

export const orgUsersQuery = makeQuery<OrgUsersQuery, OrgUsersQueryVariables>(
  OrgUsers
);

export const currentUserQuery = makeQuery<
  CurrentUserQuery,
  CurrentUserQueryVariables
>(CurrentUser);

export const orgGroupsQuery = makeQuery<
  OrgGroupsQuery,
  OrgGroupsQueryVariables
>(OrgGroups);

export const appAnalysisConfigQuery = makeQuery<
  AppAnalysisConfigQuery,
  AppAnalysisConfigQueryVariables
>(AppAnalysisConfig);

export const inviteUserMutation = makeMutation<
  CreateInvitationMutation,
  CreateInvitationMutationVariables
>(CreateInvitation);

export const revokeInvitationMutation = makeMutation<
  RevokeInvitationMutation,
  RevokeInvitationMutationVariables
>(RevokeInvitation);

export const updateAppAnalysisConfigMutation = makeMutation<
  UpdateAppAnalysisConfigMutation,
  UpdateAppAnalysisConfigMutationVariables
>(UpdateAppAnalysisConfig);

export const resetAppAnalysisConfigMutation = makeMutation<
  ResetAppAnalysisConfigMutation,
  ResetAppAnalysisConfigMutationVariables
>(ResetAppAnalysisConfig);
