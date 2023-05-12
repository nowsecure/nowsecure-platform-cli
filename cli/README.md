# ns-cli

NowSecure command line tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [ns-cli](#ns-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @nowsecure/platform-cli
$ ns-cli COMMAND
running command...
$ ns-cli (--version)
@nowsecure/platform-cli/1.0.0 darwin-x64 node-v16.19.1
$ ns-cli --help [COMMAND]
USAGE
  $ ns-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ns-cli app`](#ns-cli-app)
* [`ns-cli app archive [PLATFORM] [PACKAGENAME]`](#ns-cli-app-archive-platform-packagename)
* [`ns-cli app config [PLATFORM] [PACKAGENAME]`](#ns-cli-app-config-platform-packagename)
* [`ns-cli app create PLATFORM PACKAGENAME`](#ns-cli-app-create-platform-packagename)
* [`ns-cli app last [PLATFORM] [PACKAGENAME]`](#ns-cli-app-last-platform-packagename)
* [`ns-cli app last-assessment [PLATFORM] [PACKAGENAME]`](#ns-cli-app-last-assessment-platform-packagename)
* [`ns-cli app list`](#ns-cli-app-list)
* [`ns-cli app process BINARY`](#ns-cli-app-process-binary)
* [`ns-cli app update [PLATFORM] [PACKAGENAME] [STDIN]`](#ns-cli-app-update-platform-packagename-stdin)
* [`ns-cli app upload BINARY`](#ns-cli-app-upload-binary)
* [`ns-cli app vulnerabilities [PLATFORM] [PACKAGENAME]`](#ns-cli-app-vulnerabilities-platform-packagename)
* [`ns-cli assessment`](#ns-cli-assessment)
* [`ns-cli assessment cancel ASSESSMENT`](#ns-cli-assessment-cancel-assessment)
* [`ns-cli assessment github-snapshot ASSESSMENT`](#ns-cli-assessment-github-snapshot-assessment)
* [`ns-cli assessment list`](#ns-cli-assessment-list)
* [`ns-cli assessment raw ASSESSMENT`](#ns-cli-assessment-raw-assessment)
* [`ns-cli assessment sarif ASSESSMENT`](#ns-cli-assessment-sarif-assessment)
* [`ns-cli assessment show ASSESSMENT`](#ns-cli-assessment-show-assessment)
* [`ns-cli assessment start [PLATFORM] [PACKAGENAME]`](#ns-cli-assessment-start-platform-packagename)
* [`ns-cli autocomplete [SHELL]`](#ns-cli-autocomplete-shell)
* [`ns-cli configure`](#ns-cli-configure)
* [`ns-cli help [COMMANDS]`](#ns-cli-help-commands)
* [`ns-cli organization`](#ns-cli-organization)
* [`ns-cli organization groups`](#ns-cli-organization-groups)
* [`ns-cli organization invitations`](#ns-cli-organization-invitations)
* [`ns-cli organization invite EMAIL`](#ns-cli-organization-invite-email)
* [`ns-cli organization revoke-invitation [EMAIL]`](#ns-cli-organization-revoke-invitation-email)
* [`ns-cli organization users`](#ns-cli-organization-users)
* [`ns-cli plugins`](#ns-cli-plugins)
* [`ns-cli plugins:install PLUGIN...`](#ns-cli-pluginsinstall-plugin)
* [`ns-cli plugins:inspect PLUGIN...`](#ns-cli-pluginsinspect-plugin)
* [`ns-cli plugins:install PLUGIN...`](#ns-cli-pluginsinstall-plugin-1)
* [`ns-cli plugins:link PLUGIN`](#ns-cli-pluginslink-plugin)
* [`ns-cli plugins:uninstall PLUGIN...`](#ns-cli-pluginsuninstall-plugin)
* [`ns-cli plugins:uninstall PLUGIN...`](#ns-cli-pluginsuninstall-plugin-1)
* [`ns-cli plugins:uninstall PLUGIN...`](#ns-cli-pluginsuninstall-plugin-2)
* [`ns-cli plugins update`](#ns-cli-plugins-update)
* [`ns-cli user`](#ns-cli-user)
* [`ns-cli user account`](#ns-cli-user-account)
* [`ns-cli user groups`](#ns-cli-user-groups)

## `ns-cli app`

Commands to manipulate applications for analysis

```
USAGE
  $ ns-cli app

DESCRIPTION
  Commands to manipulate applications for analysis
```

_See code: [dist/commands/app/index.ts](https://github.com/cosdon/nowsecure-cli/blob/v1.0.0/dist/commands/app/index.ts)_

## `ns-cli app archive [PLATFORM] [PACKAGENAME]`

Archive or unarchive an app

```
USAGE
  $ ns-cli app archive [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-r <value>] [-u]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -g, --group=<value>  Group name
  -r, --ref=<value>    Application reference
  -u, --unarchive      unarchive the application
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Archive or unarchive an app

EXAMPLES
  $ ns-cli app archive android com.example.package --group "My group"

  $ ns-cli app archive --app=d296eaea-f714-4e2d-8930-023b3f2bb12a --unarchive
```

## `ns-cli app config [PLATFORM] [PACKAGENAME]`

Retrieve the analysis configuration

```
USAGE
  $ ns-cli app config [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-r <value>]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -g, --group=<value>  Group name
  -r, --ref=<value>    Application reference
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Retrieve the analysis configuration

EXAMPLES
  $ ns-cli app config
```

## `ns-cli app create PLATFORM PACKAGENAME`

Create an app resource without a binary

```
USAGE
  $ ns-cli app create PLATFORM PACKAGENAME [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -g, --group=<value>  Group name
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Create an app resource without a binary

EXAMPLES
  $ ns-cli app create android com.example.package --group "My group"
```

## `ns-cli app last [PLATFORM] [PACKAGENAME]`

Show the details and findings of the last complete assessment for an application

```
USAGE
  $ ns-cli app last [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-a | -m critical|c|high|h|medium|m|low|l|info|i | -w
    | -i <value> | -e <value>] [-f] [-s] [-c] [-d] [-b] [-g <value>] [--group-ref <value>] [-r <value>]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -a, --all-findings           show all findings
  -b, --[no-]build             Include details of the build
  -c, --[no-]config            Include the analysis configuration
  -d, --dependencies           Include the application dependency analysis
  -e, --exclude=<value>...     Findings that should always be excluded
  -f, --[no-]findings          Include the findings report
  -g, --group=<value>          Group name
  -i, --include=<value>...     Findings that should always be included
  -m, --min-severity=<option>  minimum severity to report
                               <options: critical|c|high|h|medium|m|low|l|info|i>
  -r, --ref=<value>            Application reference
  -s, --[no-]state             Include the current state of the assessment tasks
  -w, --warnings               Include warnings
  --group-ref=<value>          Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Show the details and findings of the last complete assessment for an application

ALIASES
  $ ns-cli app last

EXAMPLES
  $ ns-cli app last 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli app last-assessment [PLATFORM] [PACKAGENAME]`

Show the details and findings of the last complete assessment for an application

```
USAGE
  $ ns-cli app last-assessment [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-a | -m critical|c|high|h|medium|m|low|l|info|i | -w
    | -i <value> | -e <value>] [-f] [-s] [-c] [-d] [-b] [-g <value>] [--group-ref <value>] [-r <value>]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -a, --all-findings           show all findings
  -b, --[no-]build             Include details of the build
  -c, --[no-]config            Include the analysis configuration
  -d, --dependencies           Include the application dependency analysis
  -e, --exclude=<value>...     Findings that should always be excluded
  -f, --[no-]findings          Include the findings report
  -g, --group=<value>          Group name
  -i, --include=<value>...     Findings that should always be included
  -m, --min-severity=<option>  minimum severity to report
                               <options: critical|c|high|h|medium|m|low|l|info|i>
  -r, --ref=<value>            Application reference
  -s, --[no-]state             Include the current state of the assessment tasks
  -w, --warnings               Include warnings
  --group-ref=<value>          Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Show the details and findings of the last complete assessment for an application

ALIASES
  $ ns-cli app last

EXAMPLES
  $ ns-cli app last-assessment 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli app list`

List available applications on Platform

```
USAGE
  $ ns-cli app list [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json] [--group-ref <value>] [-g <value>] [-r <value>] [-t <value>] [-p android|ios] [-i
    <value>]

FLAGS
  -g, --group=<value>...      Filter by group name
  -i, --id=<value>...         Filter on ID (package name or bundle ID)
  -p, --platform=<option>...  Filter on platform
                              <options: android|ios>
  -r, --ref=<value>...        Filter on reference
  -t, --title=<value>...      Filter on title
  --group-ref=<value>...      Filter by group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  List available applications on Platform

EXAMPLES
  $ ns-cli app list
```

## `ns-cli app process BINARY`

Upload and analyze an application binary

```
USAGE
  $ ns-cli app process BINARY [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile
    <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-v <value>] [-t
    full|static|dependencies]

ARGUMENTS
  BINARY  file to send to Platform

FLAGS
  -g, --group=<value>           Group name
  -t, --analysis-type=<option>  The type of analysis to perform
                                <options: full|static|dependencies>
  -v, --set-version=<value>     Set the version of the uploaded binary
  --group-ref=<value>           Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Upload and analyze an application binary

EXAMPLES
  $ ns-cli app process my_application.apk
```

## `ns-cli app update [PLATFORM] [PACKAGENAME] [STDIN]`

Update the application's analysis configuration

```
USAGE
  $ ns-cli app update [PLATFORM] [PACKAGENAME] [STDIN] [--token <value>] [--graphql <value>] [--rest <value>]
    [--ui <value>] [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-r <value>]
    [-r | -t none|js|xctest|appium | -f <value>] [-c <value>] [-m]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)
  STDIN        (-) Read the configuration from stdin instead of a file

FLAGS
  -c, --config=<value>        JSON or YAML file containing the required updates
  -f, --script-file=<value>   Script file
  -g, --group=<value>         Group name
  -m, --[no-]merge            Merge search terms in the update file with the existing values
  -r, --ref=<value>           Application reference
  -r, --reset
  -t, --script-type=<option>  Set up a Javascript, Appium or XCTest script, or remove all scripts.
                              <options: none|js|xctest|appium>
  --group-ref=<value>         Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Update the application's analysis configuration

EXAMPLES
  $ ns-cli app update
```

## `ns-cli app upload BINARY`

Upload an application binary

```
USAGE
  $ ns-cli app upload BINARY [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile
    <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>]

ARGUMENTS
  BINARY  file to send to Platform

FLAGS
  -g, --group=<value>  Group name
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Upload an application binary

EXAMPLES
  $ ns-cli app upload my_application.apk
```

## `ns-cli app vulnerabilities [PLATFORM] [PACKAGENAME]`

Show application vulnerabilities

```
USAGE
  $ ns-cli app vulnerabilities [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-r <value>]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -g, --group=<value>  Group name
  -r, --ref=<value>    Application reference
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Show application vulnerabilities

EXAMPLES
  $ ns-cli app vulnerabilities android com.example.package --group "My group"

  $ ns-cli app vulnerabilities --app=d296eaea-f714-4e2d-8930-023b3f2bb12a
```

## `ns-cli assessment`

Commands to retrieve assessment data

```
USAGE
  $ ns-cli assessment

DESCRIPTION
  Commands to retrieve assessment data
```

_See code: [dist/commands/assessment/index.ts](https://github.com/cosdon/nowsecure-cli/blob/v1.0.0/dist/commands/assessment/index.ts)_

## `ns-cli assessment cancel ASSESSMENT`

Cancel a running assessment

```
USAGE
  $ ns-cli assessment cancel ASSESSMENT [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>] [--json]

ARGUMENTS
  ASSESSMENT  Reference of the assessment to cancel

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Cancel a running assessment

EXAMPLES
  $ ns-cli assessment cancel 244ed89a-a99c-1fec-b95d-1be1c0238cb4
```

## `ns-cli assessment github-snapshot ASSESSMENT`

Create a SARIF report from an assessment

```
USAGE
  $ ns-cli assessment github-snapshot ASSESSMENT -c <value> -s <value> -r <value> -j <value> [--token <value>] [--graphql
    <value>] [--rest <value>] [--ui <value>] [--profile <value>] [--config-file <value>] [--json] [-t <value>] [-o
    <value>]

ARGUMENTS
  ASSESSMENT  Source assessment reference

FLAGS
  -c, --correlator=<value>  (required) Correlation ID to link snapshots for the same app
  -j, --job-id=<value>      (required) id of the build job
  -o, --output=<value>      Write to a file, instead of STDOUT
  -r, --ref=<value>         (required) Tag or branch causing the build
  -s, --sha=<value>         (required) git hash of the commit causing the build
  -t, --timeout=<value>     Timeout in seconds to wait for the analysis to complete

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Create a SARIF report from an assessment

EXAMPLES
  $ ns-cli assessment github-snapshot 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli assessment list`

List assessments

```
USAGE
  $ ns-cli assessment list [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [-m critical|c|high|h|medium|m|low|l|info|i --json ] [-w  ] [-i <value>  ] [-e <value>  ]
    [-a  ] [-f ] [--config ] [-d ] [-b ] [--group-ref <value>] [-g <value>] [-r <value>] [--platform android|ios]
    [--limit <value>] [--scope *] [--finding <value>] [--status cancelled|completed|failed|pending] [--since <value>]
    [--after <value>] [--before <value>] [--until <value>] [--reverse] [-d] [--baseline] [--appstore] [--fail-fast]
    [--favorite]

FLAGS
  -a, --all-findings           show all findings
  -b, --[no-]build             Include details of the build
  -d, --[no-]dependencies      Include the application dependency analysis
  -d, --include-deleted        Show all assessements including deleted ones
  -e, --exclude=<value>...     Findings that should always be excluded
  -f, --[no-]findings          Include the findings report
  -g, --group=<value>...       Filter by group name
  -i, --include=<value>...     Findings that should always be included
  -m, --min-severity=<option>  minimum severity to report
                               <options: critical|c|high|h|medium|m|low|l|info|i>
  -r, --ref=<value>...         Filter on reference
  -w, --warnings               Include warnings
  --after=<value>              Assessments created after this date
  --[no-]appstore              Show assessments on apps downloaded from the platform's app store
  --[no-]baseline              Only show baseline assessments
  --before=<value>             Assessments created before this date
  --[no-]config                Include the analysis configuration
  --[no-]fail-fast
  --[no-]favorite              Show favorited assessments
  --finding=<value>            Only show assessments with this finding
  --group-ref=<value>...       Filter by group reference
  --limit=<value>
  --platform=<option>          Filter on platform
                               <options: android|ios>
  --reverse                    Show in reverse order
  --scope=<option>             <options: *>
  --since=<value>              Assessments created since this date
  --status=<option>            Filter by job status
                               <options: cancelled|completed|failed|pending>
  --until=<value>              Assessments created until this date

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  List assessments

EXAMPLES
  $ ns-cli assessment list
```

## `ns-cli assessment raw ASSESSMENT`

Get the raw data for an assessment

```
USAGE
  $ ns-cli assessment raw ASSESSMENT [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>] [--json]

ARGUMENTS
  ASSESSMENT  Reference of the assessment

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Get the raw data for an assessment

EXAMPLES
  $ ns-cli assessment raw 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli assessment sarif ASSESSMENT`

Create a SARIF report from an assessment

```
USAGE
  $ ns-cli assessment sarif ASSESSMENT [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>] [--json] [-a | -m critical|c|high|h|medium|m|low|l|info|i | -w | -i
    <value> | -e <value>] [-t <value>] [-c <value>] [-o <value>] [--fingerprint] [--package] [--platform] [--v1-key
    <value>]

ARGUMENTS
  ASSESSMENT  Source assessment reference

FLAGS
  -a, --all-findings           show all findings
  -c, --code=<value>
  -e, --exclude=<value>...     Findings that should always be excluded
  -i, --include=<value>...     Findings that should always be included
  -m, --min-severity=<option>  minimum severity to report
                               <options: critical|c|high|h|medium|m|low|l|info|i>
  -o, --output=<value>         Write to a file, instead of STDOUT
  -t, --timeout=<value>        Timeout in seconds to wait for the analysis to complete
  -w, --warnings               Include warnings
  --[no-]fingerprint
  --[no-]package
  --[no-]platform
  --v1-key=<value>

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Create a SARIF report from an assessment

EXAMPLES
  $ ns-cli assessment sarif 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli assessment show ASSESSMENT`

Show the details and findings of an assessment

```
USAGE
  $ ns-cli assessment show ASSESSMENT [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>] [--json] [-a | -m critical|c|high|h|medium|m|low|l|info|i | -w | -i
    <value> | -e <value>] [-f] [-s] [-c] [-d] [-b] [-t <value>]

ARGUMENTS
  ASSESSMENT  Reference of the assessment to view

FLAGS
  -a, --all-findings           show all findings
  -b, --[no-]build             Include details of the build
  -c, --[no-]config            Include the analysis configuration
  -d, --dependencies           Include the application dependency analysis
  -e, --exclude=<value>...     Findings that should always be excluded
  -f, --[no-]findings          Include the findings report
  -i, --include=<value>...     Findings that should always be included
  -m, --min-severity=<option>  minimum severity to report
                               <options: critical|c|high|h|medium|m|low|l|info|i>
  -s, --[no-]state             Include the current state of the assessment tasks
  -t, --timeout=<value>        Timeout in seconds to wait for the analysis to complete. Specify -1 to wait indefinitely.
                               If unspecified or 0, the assessment is returned as-is and may contain partial results
  -w, --warnings               Include warnings

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Show the details and findings of an assessment

EXAMPLES
  $ ns-cli assessment show 24891ee6-698e-4a55-bb27-adbfa4694787
```

## `ns-cli assessment start [PLATFORM] [PACKAGENAME]`

Start an assessment

```
USAGE
  $ ns-cli assessment start [PLATFORM] [PACKAGENAME] [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [-g <value>] [--group-ref <value>] [-r <value>] [-s]

ARGUMENTS
  PLATFORM     (android|ios) Platform
  PACKAGENAME  Package identifier (e.g. com.example.app)

FLAGS
  -g, --group=<value>  Group name
  -r, --ref=<value>    Application reference
  -s, --app-store
  --group-ref=<value>  Group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Start an assessment

EXAMPLES
  $ ns-cli assessment start android com.example.package --group "My group" --app-store

  $ ns-cli assessment start --app=d296eaea-f714-4e2d-8930-023b3f2bb12a
```

## `ns-cli autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ ns-cli autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ ns-cli autocomplete

  $ ns-cli autocomplete bash

  $ ns-cli autocomplete zsh

  $ ns-cli autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.1.8/src/commands/autocomplete/index.ts)_

## `ns-cli configure`

```
USAGE
  $ ns-cli configure [-y | -n] [-c] [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>]
    [--profile <value>] [--config-file <value>]

FLAGS
  -c, --clear            Remove the profile from the configuration file
  -n, --no               Abort if an existing profile would be overwritten
  -y, --yes              Do not prompt for confirmation when overwriting an existing profile
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --profile=<value>      Name of the profile
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server
```

_See code: [dist/commands/configure/index.ts](https://github.com/cosdon/nowsecure-cli/blob/v1.0.0/dist/commands/configure/index.ts)_

## `ns-cli help [COMMANDS]`

Display help for ns-cli.

```
USAGE
  $ ns-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ns-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `ns-cli organization`

Commands for the user's organization

```
USAGE
  $ ns-cli organization

DESCRIPTION
  Commands for the user's organization
```

_See code: [dist/commands/organization/index.ts](https://github.com/cosdon/nowsecure-cli/blob/v1.0.0/dist/commands/organization/index.ts)_

## `ns-cli organization groups`

Get the organization's groups

```
USAGE
  $ ns-cli organization groups [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json] [--active | --inactive]

FLAGS
  --active    List only active groups
  --inactive  List only inactive groups

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Get the organization's groups

EXAMPLES
  $ ns-cli organization groups
```

## `ns-cli organization invitations`

List invitations

```
USAGE
  $ ns-cli organization invitations [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json]

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  List invitations

EXAMPLES
  $ ns-cli organization invitations
```

## `ns-cli organization invite EMAIL`

Invite a user to join your organization

```
USAGE
  $ ns-cli organization invite EMAIL -n <value> -r <value> [--token <value>] [--graphql <value>] [--rest <value>] [--ui
    <value>] [--profile <value>] [--config-file <value>] [--json] [--group-ref <value>] [-g <value>]

ARGUMENTS
  EMAIL  Email address of the new user

FLAGS
  -g, --group=<value>...  Add user to this group by group name
  -n, --name=<value>      (required)
  -r, --role=<value>      (required) Role to assign to the user
  --group-ref=<value>...  Add user to this group by group reference

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Invite a user to join your organization

EXAMPLES
  $ ns-cli organization invite someone@example.com --name "John Doe" --role "QA" --group "Test Apps"
```

## `ns-cli organization revoke-invitation [EMAIL]`

Revoke an invitation to join your organization

```
USAGE
  $ ns-cli organization revoke-invitation [EMAIL] [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile
    <value>] [--config-file <value>] [--json] [--ref <value>]

ARGUMENTS
  EMAIL  Email address to revoke

FLAGS
  --ref=<value>  Reference of the invitation to delete

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Revoke an invitation to join your organization

EXAMPLES
  $ ns-cli organization revoke-invitation someone@example.com

  $ ns-cli organization revoke-invitation --ref=7342762a-5a3b-4ca9-95e7-225ea6913aee
```

## `ns-cli organization users`

List users in the organization

```
USAGE
  $ ns-cli organization users [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json] [--active | --inactive]

FLAGS
  --active    Only list active users
  --inactive  List only inactive users

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  List users in the organization

EXAMPLES
  $ ns-cli organization users
```

## `ns-cli plugins`

List installed plugins.

```
USAGE
  $ ns-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ns-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.4/src/commands/plugins/index.ts)_

## `ns-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ns-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ ns-cli plugins add

EXAMPLES
  $ ns-cli plugins:install myplugin 

  $ ns-cli plugins:install https://github.com/someuser/someplugin

  $ ns-cli plugins:install someuser/someplugin
```

## `ns-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ns-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ns-cli plugins:inspect myplugin
```

## `ns-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ns-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ ns-cli plugins add

EXAMPLES
  $ ns-cli plugins:install myplugin 

  $ ns-cli plugins:install https://github.com/someuser/someplugin

  $ ns-cli plugins:install someuser/someplugin
```

## `ns-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ ns-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ns-cli plugins:link myplugin
```

## `ns-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ns-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ns-cli plugins unlink
  $ ns-cli plugins remove
```

## `ns-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ns-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ns-cli plugins unlink
  $ ns-cli plugins remove
```

## `ns-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ns-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ns-cli plugins unlink
  $ ns-cli plugins remove
```

## `ns-cli plugins update`

Update installed plugins.

```
USAGE
  $ ns-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `ns-cli user`

Commands for users & accounts

```
USAGE
  $ ns-cli user

DESCRIPTION
  Commands for users & accounts
```

_See code: [dist/commands/user/index.ts](https://github.com/cosdon/nowsecure-cli/blob/v1.0.0/dist/commands/user/index.ts)_

## `ns-cli user account`

Current user details

```
USAGE
  $ ns-cli user account [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json]

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Current user details

EXAMPLES
  $ ns-cli user account
```

## `ns-cli user groups`

Get the user's groups

```
USAGE
  $ ns-cli user groups [--token <value>] [--graphql <value>] [--rest <value>] [--ui <value>] [--profile <value>]
    [--config-file <value>] [--json]

GLOBAL FLAGS
  --config-file=<value>  Path to the config file
  --graphql=<value>      URL of the graphql server
  --json                 Format output as json.
  --profile=<value>      Profile to read from ~/.nsclirc
  --rest=<value>         URL of the REST server
  --token=<value>        Platform API token
  --ui=<value>           URL of the UI server

DESCRIPTION
  Get the user's groups

EXAMPLES
  $ ns-cli user groups
```
<!-- commandsstop -->
