/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { JSONObject, NowSecureClient, RequestConfig } from "./client";
import { Filter } from "./findings-filter";
import {
  AppAnalysisConfig,
  AppResource,
  Assessment,
  CancelAssessmentResponse,
  FullUser,
  Group,
  Invitation,
  PlatformEnum,
  ProcessApplicationResponse,
  Role,
  StartAssessmentResponse,
  UploadApplicationResponse,
  User,
  VulnerabilityResponse,
} from "./types";
import {
  archiveApp,
  getAnalysisConfig,
  createApp,
  Application,
  ListApplicationOptions,
  listApplications,
  processBinary,
  uploadBinary,
  getAppVulnerabilities,
  cancelAssessment,
  fetchAssessment,
  AssessmentSections,
  PollSections,
  pollForReport,
  isLicenseValid,
  AssessmentsQueryVariables,
  listAssessments,
  rawAssessmentData,
  startAssessment,
  orgGroups,
  OrgGroupsOptions,
  listInvitations,
  InviteUserOptions,
  inviteUser,
  revokeInvitation,
  listRoles,
  OrgUsersOptions,
  orgUsers,
  userGroups,
  userInfo,
  RunnerType,
  updateAnalysisConfig,
  resetAnalysisConfig,
  UpdateConfigOptions,
} from "./api";

export interface PlatformAPI {
  archiveApp(appRef: string, unarchive?: boolean): Promise<AppResource>;

  getAnalysisConfig(appRef?: string): Promise<AppAnalysisConfig>;

  updateAnalysisConfig(
    appRef: string,
    runnerType?: RunnerType,
    runnerFile?: string,
    update?: UpdateConfigOptions,
    mergeSearchTerms?: boolean,
    requestConfig?: RequestConfig
  ): Promise<void>;

  resetAnalysisConfig(appRef: string): Promise<void>;

  createApp(
    platform: PlatformEnum,
    packageName: string,
    groupRef?: string
  ): Promise<AppResource>;

  listApplications(
    options?: ListApplicationOptions,
    filter?: Filter
  ): Promise<Application[]>;

  processBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    version?: string,
    config?: RequestConfig
  ): Promise<ProcessApplicationResponse>;

  uploadBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    config?: RequestConfig
  ): Promise<UploadApplicationResponse>;

  getAppVulnerabilities(appRef: string): Promise<VulnerabilityResponse>;

  cancelAssessment(assessmentRef: string): Promise<CancelAssessmentResponse>;

  fetchAssessment(
    reportId: string,
    sections?: AssessmentSections,
    filter?: Filter
  ): Promise<Assessment | null>;

  pollForReport(
    reportId: string,
    sections?: PollSections,
    filter?: Filter,
    pollInterval?: number,
    timeout?: number,
    log?: (text: string) => void
  ): Promise<Assessment | null>;

  isLicenseValid(licenseWorkaround: boolean): Promise<boolean>;

  listAssessments(
    options?: AssessmentsQueryVariables,
    filter?: Filter
  ): Promise<Assessment[]>;

  rawAssessmentData(assessmentId: string): Promise<JSONObject>;

  startAssessment(
    platform: PlatformEnum,
    packageName: string,
    groupRef: string,
    isAppStore: boolean
  ): Promise<StartAssessmentResponse>;

  orgGroups(options: OrgGroupsOptions): Promise<Group[]>;

  listInvitations(): Promise<Invitation[]>;

  inviteUser(options: InviteUserOptions): Promise<Invitation>;

  revokeInvitation(ref: string): Promise<string>;

  listRoles(): Promise<Role[]>;

  orgUsers(options: OrgUsersOptions): Promise<User[]>;

  userGroups(): Promise<Group[]>;

  userInfo(): Promise<FullUser>;
}

export class Platform implements PlatformAPI {
  private _client: NowSecureClient;
  constructor(client: NowSecureClient) {
    this._client = client;
  }

  archiveApp(appRef: string, unarchive?: boolean): Promise<AppResource> {
    return archiveApp(this._client, appRef, unarchive);
  }

  getAnalysisConfig(appRef?: string): Promise<AppAnalysisConfig> {
    return getAnalysisConfig(this._client, appRef);
  }

  updateAnalysisConfig(
    appRef: string,
    runnerType?: RunnerType,
    runnerFile?: string,
    update?: UpdateConfigOptions,
    mergeSearchTerms?: boolean,
    requestConfig?: RequestConfig
  ): Promise<void> {
    return updateAnalysisConfig(
      this._client,
      appRef,
      runnerType,
      runnerFile,
      update,
      mergeSearchTerms,
      requestConfig
    );
  }

  resetAnalysisConfig(appRef: string) {
    return resetAnalysisConfig(this._client, appRef);
  }

  createApp(
    platform: PlatformEnum,
    packageName: string,
    groupRef?: string
  ): Promise<AppResource> {
    return createApp(this._client, platform, packageName, groupRef);
  }

  listApplications(
    options?: ListApplicationOptions,
    filter?: Filter
  ): Promise<Application[]> {
    return listApplications(this._client, options, filter);
  }

  processBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    version?: string,
    config?: RequestConfig
  ): Promise<ProcessApplicationResponse> {
    return processBinary(this._client, stream, groupId, version, config);
  }

  uploadBinary(
    stream: NodeJS.ReadableStream,
    groupId?: string,
    config?: RequestConfig
  ): Promise<UploadApplicationResponse> {
    return uploadBinary(this._client, stream, groupId, config);
  }

  getAppVulnerabilities(appRef: string): Promise<VulnerabilityResponse> {
    return getAppVulnerabilities(this._client, appRef);
  }

  cancelAssessment(assessmentRef: string): Promise<CancelAssessmentResponse> {
    return cancelAssessment(this._client, assessmentRef);
  }

  fetchAssessment(
    reportId: string,
    sections?: AssessmentSections,
    filter?: Filter
  ): Promise<Assessment | null> {
    return fetchAssessment(this._client, reportId, sections, filter);
  }

  pollForReport(
    reportId: string,
    sections?: PollSections,
    filter?: Filter,
    pollInterval = 60000,
    timeout = 0,
    log?: (text: string) => void
  ): Promise<Assessment | null> {
    return pollForReport(
      this._client,
      reportId,
      sections,
      filter,
      pollInterval,
      timeout,
      log
    );
  }

  isLicenseValid(licenseWorkaround: boolean): Promise<boolean> {
    return isLicenseValid(this._client, licenseWorkaround);
  }

  listAssessments(
    options?: AssessmentsQueryVariables,
    filter?: Filter
  ): Promise<Assessment[]> {
    return listAssessments(this._client, options, filter);
  }

  rawAssessmentData(assessmentId: string): Promise<JSONObject> {
    return rawAssessmentData(this._client, assessmentId);
  }

  startAssessment(
    platform: PlatformEnum,
    packageName: string,
    groupRef: string,
    isAppStore: boolean
  ): Promise<StartAssessmentResponse> {
    return startAssessment(
      this._client,
      platform,
      packageName,
      groupRef,
      isAppStore
    );
  }

  orgGroups(options: OrgGroupsOptions): Promise<Group[]> {
    return orgGroups(this._client, options);
  }

  listInvitations(): Promise<Invitation[]> {
    return listInvitations(this._client);
  }

  inviteUser(options: InviteUserOptions): Promise<Invitation> {
    return inviteUser(this._client, options);
  }

  revokeInvitation(ref: string): Promise<string> {
    return revokeInvitation(this._client, ref);
  }

  listRoles(): Promise<Role[]> {
    return listRoles(this._client);
  }

  orgUsers(options: OrgUsersOptions): Promise<User[]> {
    return orgUsers(this._client, options);
  }

  userGroups(): Promise<Group[]> {
    return userGroups(this._client);
  }

  userInfo(): Promise<FullUser> {
    return userInfo(this._client);
  }
}
