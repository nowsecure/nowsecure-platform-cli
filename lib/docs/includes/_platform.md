## Platform

The Platform class implements the API as methods

### constructor(client: NowSecureClient)

Constructs a Platform instance that will communicate with the server via the passed NowSecureClient instance.

### methods

Each method invokes the matching API function passing the NowSecureClient instance used to construct the class.

#### Application methods

[<code>async archiveApp(appRef: string, unarchive?: boolean): Promise\<AppResource\></code>](#archiveapp)

[<code>async getAnalysisConfig(appRef?: string): Promise\<AppAnalysisConfig\></code>](#getanalysisconfig)

[<code>async updateAnalysisConfig(appRef: string, runnerType?: RunnerType, runnerFile?: string, update?: UpdateConfigOptions, mergeSearchTerms?: boolean, requestConfig?: RequestConfig): Promise\<void\></code>](#updateanalysisconfig)

[<code>async resetAnalysisConfig(appRef: string): Promise\<void\></code>](#resetanalysisconfig)

[<code>async createApp(platform: PlatformEnum, packageName: string, groupRef?: string): Promise\<AppResource\></code>](#createapp)

[<code>async listApplications(options?: ListApplicationOptions, filter?: Filter): Promise\<Application[]\></code>](#listapplications)

[<code>async processBinary(stream: NodeJS.ReadableStream, groupId?: string, config?: RequestConfig): Promise\<ProcessApplicationResponse\></code>](#processbinary)

[<code>async uploadBinary(stream: NodeJS.ReadableStream, groupId?: string, config?: RequestConfig): Promise\<UploadApplicationResponse\></code>](#uploadbinary)

[<code>async processBinary(stream: NodeJS.ReadableStream, groupId?: string, config?: RequestConfig): Promise\<ProcessApplicationResponse\></code>](#processbinary)

[<code>async uploadBinary(stream: NodeJS.ReadableStream, groupId?: string, config?: RequestConfig): Promise\<UploadApplicationResponse\></code>](#uploadbinary)

[<code>async getAppVulnerabilities(appRef: string): Promise\<VulnerabilityResponse\></code>](#getappvulnerabilities)

[<code>async cancelAssessment(assessmentRef: string): Promise\<CancelAssessmentResponse\></code>](#cancelassessment)

[<code>async fetchAssessment(reportId: string, sections?: AssessmentSections, filter?: Filter): Promise\<Assessment | null\></code>](#fetchassessment)

[<code>async pollForReport(reportId: string, sections?: PollSections, filter?: Filter, pollInterval?: number, timeout?: number, log?: (text: string) => void): Promise\<Assessment | null\></code>](#pollforreport)

[<code>async isLicenseValid(licenseWorkaround: boolean): Promise\<boolean\></code>](#islicensevalid)

[<code>async listAssessments(options?: AssessmentsQueryVariables, filter?: Filter): Promise\<Assessment[]\></code>](#listassessments)

[<code>async rawAssessmentData(assessmentId: string): Promise\<JSONObject\></code>](#rawassessmentdata)

[<code>async startAssessment(platform: PlatformEnum, packageName: string, groupRef: string, isAppStore: boolean): Promise\<StartAssessmentResponse\></code>](#startassessment)

[<code>async orgGroups(options: OrgGroupsOptions): Promise\<Group[]\></code>](#orggroups)

[<code>async listInvitations(): Promise\<Invitation[]\></code>](#listinvitations)

[<code>async inviteUser(options: InviteUserOptions): Promise\<Invitation\></code>](#inviteuser)

[<code>async revokeInvitation(ref: string): Promise\<string\></code>](#revokeinvitation)

[<code>async listRoles(): Promise\<Role[]\></code>](#listroles)

[<code>async orgUsers(options: OrgUsersOptions): Promise\<User[]\></code>](#orgusers)

[<code>async userGroups(): Promise\<Group[]\></code>](#usergroups)

[<code>async userInfo(): Promise\<FullUser\></code>](#userinfo)
