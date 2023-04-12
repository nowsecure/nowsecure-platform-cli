# `@nowsecure/platform-lib`

An interface to the GraphQL and REST APIs exposed by NowSecure Platform.

## Building (CLI and library)

In the `lib` directory

1. Run `yarn install`
2. Build the library with sourcemaps: `yarn debugbuild`

In the `cli` directory

3. Run `yarn install`
4. Build the CLI: `yarn build`

This will build a CLI client that can be run with `bin/run command subcommand <options>`

Due to constraints with the `oclif` packaging system, the CLI's dependency on the library has to be via a `file:` rather than a `link:` dependency.<br/>
This means that changes in the library will not be reflected in the build until you reinstall the packages or `yarn link` is used to symlink the library.

To symlink the library packages in the CLI

1. Run `yarn link` in the `lib`, `sarif` and `github-snapshot` directories.
2. In the `cli` directory, run `yarn link @nowsecure/platform-lib @nowsecure/sarif @nowsecure/github-snapshot`

Changes made to the library code will now be available in the CLI after running `yarn debugbuild`

## Packaging

Run `cli/.ci/package.sh`. This will build the library and the client, and create x64 and arm64 installation
packages in the `cli/dist/macos` directory.<br/>
The script will temporarily unlink @nowsecure/platform-lib during the build & restore the link afterwards.
