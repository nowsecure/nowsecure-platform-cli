/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { JSONObject } from "../client";
import {
  AssessmentJobSummaryStatus,
  AssessmentsQuery,
  UserFieldsFragment,
  GroupFieldsFragment,
  InvitationFieldsFragment,
  RoleFieldsFragment,
  PermissionFieldsFragment,
  PlatformEnum,
  DefaultAnalysisConfigFieldsFragment,
  AppAnalysisConfigFieldsFragment,
} from "../generated/graphql";

export {
  AssessmentJobSummaryStatus,
  PlatformEnum,
  VulnerabilitySeverityCategoryEnum as Severity,
} from "../generated/graphql";

/**
 * Response from Upload Application.
 *
 * # References
 * * <https://docs.nowsecure.com/auto/api/spec/#api-Applications-submitBuild>
 */
export interface ProcessApplicationResponse {
  ref: string;
  application: string;
  group: string;
  account: string;
  platform: string;
  package: string;
  task: number;
  creator: string;
  created: string;
  binary: string;
  config: unknown;
  status: {
    static: {
      state: AssessmentJobSummaryStatus;
    };
    dynamic: {
      state: AssessmentJobSummaryStatus;
    };
  };
  cancelled: boolean;
  task_status: AssessmentJobSummaryStatus;
  events: unknown;
}

export interface UploadApplicationResponse {
  digest: string;
  algorithm: string;
  analyzed: boolean;
  platform: PlatformEnum;
  package: string;
  version: string;
  title: string;
  name: string;
  icon: string; // base64 encoded binary
  downloaded_appstore_application_key: string;
}

export interface CancelAssessmentResponse {
  status: AssessmentJobSummaryStatus;
}

export interface StartAssessmentResponse {
  ref: string;
  application: string;
  group: string;
  account: string;
  platform: PlatformEnum;
  package: string;
  task: number;
  creator: string;
  created: string;
  favorite: boolean;
  appstore_download: string;
  config: {
    static: Record<string, boolean>;
    dynamic: {
      actions: {
        find: string[];
        avoid: string[];
      };
      search_data: Record<
        string,
        {
          value: string;
          is_sensitive: boolean;
          search_strings: string[];
        }
      >;
    };
  };
  status: {
    static: {
      state: AssessmentJobSummaryStatus;
    };
    dynamic: {
      state: AssessmentJobSummaryStatus;
    };
  };
  cancelled: boolean;
  task_status: AssessmentJobSummaryStatus;
}

export interface AppResource {
  ref: string;
  account: string;
  platform: PlatformEnum;
  package: string;
  group: string;
  created: string;
  archived_at: string;
  config_level: string;
  binary: string;
  test_runner_binary: string;
  config: JSONObject;
}

export interface VulnerabilityEntry {
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

export type VulnerabilityResponse = VulnerabilityEntry[];

export type Assessment = NonNullable<
  AssessmentsQuery["auto"]["assessments"][0]
>;

export type Finding = NonNullable<
  NonNullable<Assessment["report"]>["findings"][0]
>;

export type Group = GroupFieldsFragment;

export type User = UserFieldsFragment;

export type FullUser = UserFieldsFragment & { groups: Group[] };

export type Invitation = InvitationFieldsFragment;

export type Role = RoleFieldsFragment;

export type Permissions = PermissionFieldsFragment;

export type DefaultAnalysisConfig = DefaultAnalysisConfigFieldsFragment;

export type AppAnalysisConfig = AppAnalysisConfigFieldsFragment;
