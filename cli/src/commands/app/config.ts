/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { BaseCommand, Column } from "../../utils";
import { appRefArgs, appRefFlags, resolveAppRef } from "../../utils";
import {
  AnalysisConfigSearchDataEntry,
  AnalysisConfigSearchTermEntry,
} from "@nowsecure/platform-lib/lib/generated/graphql";
import { AppAnalysisConfig } from "@nowsecure/platform-lib/lib/types";
import { PlatformAPI } from "@nowsecure/platform-lib";

export const searchDataDefaultColumns: Column<AnalysisConfigSearchDataEntry>[] =
  [
    { heading: "NAME", data: "key" },
    { heading: "VALUE", data: "value" },
    { heading: "APP FIELDS", data: (search) => search.searchStrings.join(",") },
  ];

function convertTerm(
  term: AnalysisConfigSearchTermEntry
): AnalysisConfigSearchDataEntry {
  return {
    key: term.name,
    value: term.value,
    searchStrings: term.searchStrings,
    nonSensitive: true,
  };
}

export async function outputAnalysisConfig(
  command: BaseCommand,
  platform: PlatformAPI,
  appRef: string
): Promise<AppAnalysisConfig> {
  const config = await platform.getAnalysisConfig(appRef);

  const hasJS = config.dslScriptFilename && config.jsScript;
  const hasXCTest = !!config.xctest?.runnerFilename;
  const hasAppium = !!config.appium?.archiveFilename;
  const hasScript = hasJS || hasXCTest || hasAppium;

  const searches = [
    ...(config.searchData || []),
    ...(config.searchTerms || []).map(convertTerm),
  ];
  command.log("Search Terms:");
  command.outputTable(searches, searchDataDefaultColumns, "    ");

  if (hasScript) {
    if (hasXCTest) {
      command.log("");
      command.log("XCTest:");
      command.log("    Runner: " + config.xctest?.runnerFilename || "");
      command.log("    Function: " + config.xctest?.functionName || "");
    }

    if (hasJS) {
      command.log("");
      command.log("JS automation script:" + config.dslScriptFilename);
    }

    if (hasAppium) {
      const appium = config.appium;
      command.log("");
      command.log("Appium:");
      command.log("    Archive: " + appium?.archiveFilename);
      command.log("    Runner: " + appium?.runnerFilename);
      command.log("    Setup command: " + appium?.setupCommand);
      command.log("    Interpreter: " + appium?.interpreter);
    }
  } else {
    command.log("");
    command.log("Actions:");
    command.log("    Search for:" + (config.actions?.find || []).join(", "));
    command.log("    Avoid: " + (config.actions?.avoid || []).join(", "));
  }

  return config;
}

export default class GetAppConfig extends BaseCommand {
  static description = "Retrieve the analysis configuration";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static args = { ...appRefArgs };

  static flags = {
    ...appRefFlags,
  };

  async run(): Promise<AppAnalysisConfig> {
    const { args, flags, platform } = await this.parseClient(GetAppConfig);

    const appRef = await resolveAppRef(platform, args, flags, this);
    return await outputAnalysisConfig(this, platform, appRef);
  }
}
