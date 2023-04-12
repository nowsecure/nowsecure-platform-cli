# NowSecure CLI

## Overview

The NowSecure CLI is a tool that allows users to interact with the NowSecure Platform. It is a command line interface that allows users to perform a variety of tasks, including:

* Uploading Applications to NowSecure Platform.
* Accessing assessment data.
* Managing your NowSecure Organization including sending invitations.

## User's Guide

### Getting Started

### Prerequisites

The following is needed to use the ns-cli:

* A valid NowSecure Platform account.
* A valid NowSecure Platform API token.  Instructions on how to acquire this can be found in the NowSecure support center document [Creating an API Bearer Token in Platform](https://support.nowsecure.com/hc/en-us/articles/7499657262093-Creating-an-API-Bearer-Token-in-Platform) 
* If you are using a single tenant deployment of NowSecure Platform, you will need to specify the URLs of your deployment during configuration.  Please be sure to have the following URLs available:
  * The URL of your NowSecure Platform REST API.  This is the URL that you will use to access the NowSecure Platform API.  This URL will be in the format of `lab-api.<tenant>.nowsecure.com`.
  * The URL of your NowSecure Graph API.  This is the URL that you will use to access the NowSecure Graph API.  This URL will be in the format of `api.<tenant>.nowsecure.com`.
  * The URL of your NowSecure Platform UI.  This is the URL that you will use to access the NowSecure Platform UI.  This URL will be in the format of `app.<tenant>.nowsecure.com`.

### Install

1. Get binary from [Releases](https://github.com/nowsecure/nowsecure-platform-cli/releases)
2. Right click the .pkg file and select `run`.

### Configure

1. After the `ns-cli` has been installed on your system, run `ns-cli configure` to configure the CLI with your NowSecure Platform Account.
2. The first prompt will ask you to enter the profile you are using. Hit enter to select the default profile of `default`. 

   **Note:** Most users will only need to use the default profile.  
3. The next prompt will ask you to enter the Platform API token that you will be using.  Paste this into the field provided  and hit enter.
4. The next prompt will ask you to enter the Graphql endpoint for the NowSecure Platform.  You can just hit enter if you are using the CLI to interact with the default production instance of NowSecure Platform.  If you are using a single tenant deployment of NowSecure Platform, you will need to enter the URL of your Graphql endpoint.  This URL will be in the format of `api.<tenant>.nowsecure.com`.
5. The next prompt will ask you to enter the REST endpoint for the NowSecure Platform.  You can just hit enter if you are using the CLI to interact with the default production instance of NowSecure Platform.  If you are using a single tenant deployment of NowSecure Platform, you will need to enter the URL of your REST endpoint.  This URL will be in the format of `lab-api.<tenant>.nowsecure.com`.
6. The next prompt and final will ask you to enter the UI Server for the NowSecure platform.  You can just hit enter if you are using the CLI to interact with the default production instance of NowSecure Platform.  If you are using a single tenant deployment of NowSecure Platform, you will need to enter the URL of your UI Server.  This URL will be in the format of `app.<tenant>.nowsecure.com`.

Once done, verify that the CLI functions as expected by running `ns-cli app list`.  A listing of the apps in your platform account will be displayed.  If desired, you can run `ns-cli app list --json` to return the results in json format.  Example:

```bash
✗ ns-cli app list
REF                                   TITLE                                       PLATFORM  PACKAGE                                                         GROUP
9fc8a97e-2044-11eb-80b5-snip          "Business Suite"                            ios       com.facebook.PageAdminApp                                       "Auto Group"
952801a2-2a96-11eb-80b5-snip          Disney+                                     android   com.disney.disneyplus                                           "Auto Group"
0f377a8a-2b51-11eb-b2b8-snip          Strava                                      ios       com.strava.stravaride                                           TriageGroup
dcf30d7a-2c16-11eb-80b5-snip          Facebook                                    ios       com.facebook.Facebook                                           "Cool Group"
9d691706-3181-11eb-80b5-snip          Darksky                                     ios       com.jackadam.darksky                                            "Auto Group"
```

### Usage

Running `ns-cli help` will provide a top level list of the options that are available via the CLI:

```
$ ns-cli help
VERSION
  @nowsecure/cli/1.0.0-alpha.2 darwin-arm64 node-v16.19.1

USAGE
  $ ns-cli [COMMAND]

TOPICS
  app           Commands to manipulate applications for analysis
  assessment    Commands to retrieve assessment data
  organization  Commands for the user's organization
  plugins       List installed plugins.
  user          Commands for users & accounts

COMMANDS
  app           Commands to manipulate applications for analysis
  assessment    Commands to retrieve assessment data
  autocomplete  display autocomplete installation instructions
  configure
  help          Display help for ns-cli.
  organization  Commands for the user's organization
  plugins       List installed plugins.
  user          Commands for users & accounts
  ```
Options are as follows

#### app

App commands provide steps that can be used to manipulate application binaries for analysis.  The following commands are available:

* **app archive**  Allows you to Archive or Unarchive an application that has been uploaded to NowSecure Platform.
* **app config** Retrieve the analysis configuration for an application that has been uploaded to NowSecure Platform
* **app create** Create an app resource without a binary
* **app last-assessment**:  Show the details and findings of an assessment based on platform (`ios` or `android`) and package name (`com.facebook.katana`). If the app exists in multiple groups, provide the group reference using the `-g` or `--group` option.
* **app list** List available applications in your platform account.
* **app process** Upload and analyze an application binary.
* **app update**  Update the application's analysis configuration.
* **app upload** Upload an application binary.
* **app vulnerabilities** Show application vulnerabilities

You can use the `--help` option to get more details on each of the options above.


#### assessment

Assessment commands are used to interact with assessments created in in NowSecure Platform.  The following commands are available: 

* **assessment cancel** Cancel a running assessment
* **assessment github-snapshot** Create a SARIF report from an assessment
* **assessment list** List assessments in your NowSecure Platform account
* **assessment raw** Get the raw data for an assessment
* **assessment sarif** Create a SARIF report from an assessment
* **assessment show** Show the details and findings of an assessment
* **assessment start** Start an assessment

You can use the `--help` option to get more details on each of the options above.

#### autocomplete

Running `ns-cli autocomplete` will provide details on how to integrate the ns-cli into your `.zshrc` to perform autocomplete actions.

#### configure

Configure is described above in the [Configure](#configure) section.

#### help

Help provides help for the ns-cli.

#### organization  

Organization commands provide steps that can be used to manipulate an organization within NowSecure Platform.  The following commands are available:

* **organization groups** Returns the groups that have been configured in an NowSecure Platform organization.
* **organization invitations** List invitations that have been created within your NowSecure Platform organization.
* **organization invite** Create an invitiation to add someone to your NowSecure Platform organization.
* **organization revoke-invitation** Revoke an invitation that has been created in your NowSecure Platform organization.
* **organization users**  List the users that exist in your NowSecure Platform organization.

You can use the `--help` option to get more details on each of the options above.

#### plugins

The Plugins options will list plugins that have been added to the ns-cli.
  
#### user

User commands provide steps that can be used to manipulate users within NowSecure Platform.  The following commands are available:

* **user account** Get the user details from NowSecure Platform for the user account that was used to create the token that the ns-cli has been configured to use.
* **user groups** Get the group membership from NowSecure Platform for the user account that was used to create the token that the ns-cli has been configured 

You can use the `--help` option to get more details on each of the options above.



## Developer's Guide

This is a Monorepo containing the following items.
 - The [NowSecure Sarif Conversion Module](./sarif/README.md)
 - The [NowSecure GitHub Snapshot Module](./github-snapshot/README.md)
 - The [NowSecure REST and GQL API Library](./lib/README.md)
 - The [NowSecure CLI](./cli/README.md)

## Building

> Ensure you are using Node >= 16 and have `yarn` installed before proceeding.

If you are looking to build a specific library or tool, see
[Building specific tools](#building-specific-tools).

Run the following to build everything:
```sh
yarn run build
```

Run the following to clean up all build artifacts:
```sh
yarn run clean 
```

### Building specific tools

| Tool | Build Command | Clean Command |
|:--|:--|:--|
| [NowSecure REST and GQL API Library](./lib/README.md) | `yarn run build:lib` | `yarn run clean:lib` |
| [NowSecure Sarif Conversion Module](./sarif/README.md) | `yarn run build:sarif` | `yarn run clean:sarif` |
| [NowSecure GitHub Snapshot Module](./github-snapshot/README.md) | `yarn run build:github-snapshot` | `yarn run clean:github-snapshot` |
| [NowSecure CLI](./cli/README.md) | `yarn run build:cli` | `yarn run clean:cli` |

