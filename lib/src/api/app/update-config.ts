/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs, { promises as fsPromises } from "fs";
import path from "path";

import { NowSecureClient, RequestConfig } from "../../client";
import {
  appAnalysisConfigQuery,
  resetAppAnalysisConfigMutation,
  updateAppAnalysisConfigMutation,
} from "../../queries";
import { ValueError } from "../../errors";
import {
  AnalysisConfigAppiumRunnerInput,
  AnalysisConfigSearchDataInput,
  AnalysisConfigSearchTermInput,
  AnalysisConfigSearchDataEntry,
  AnalysisConfigXcTestRunnerInput,
  AnalysisConfigAppiumRunnerEntry,
  PlatformEnum,
  AppiumInterpreter,
  AnalysisConfigXcTestRunnerEntry,
  AnalysisConfigSearchTermEntry,
  AppAnalysisConfigFieldsFragment,
  AnalysisConfigActionsEntry,
  AnalysisConfigActionsInput,
} from "../../generated/graphql";
import { deleteRunnerBinary, uploadRunnerBinary } from "./runner";

export type UpdateSearchDataInput = {
  key: string;
  value?: string;
  searchStrings?: string[];
};

export type UpdateSearchTermInput = {
  name: string;
  searchStrings?: string[];
  value?: string;
};

export type UpdateConfigOptions = {
  appium?: Partial<
    Pick<
      AnalysisConfigAppiumRunnerInput,
      "archiveFilename" | "interpreter" | "runnerFilename" | "setupCommand"
    >
  >;
  xctest?: Partial<
    Pick<AnalysisConfigXcTestRunnerInput, "functionName" | "runnerFilename">
  >;
  actions?: Partial<AnalysisConfigActionsEntry>;
  searchData?: UpdateSearchDataInput[] | null;
  searchTerms?: UpdateSearchTermInput[] | null;
};

export enum RunnerType {
  None = "none",
  JavaScript = "js",
  XCTest = "xctest",
  Appium = "appium",
}

const tooShort = (val?: string) => (val?.length || 0) < 3;

/**
 * Return an updated searchData array
 *
 * @param defaultSearch Default searchData (basic config)
 * @param current Current searchData array (may be null)
 * @param update Updates to apply. An update with a null value or
 * searchStrings field will reset the field to the default value.
 * Searches that have not been updated are copied from the current
 * settings.
 * @returns The updated searchData array
 */
function updateSearchData(
  defaultSearch: AnalysisConfigSearchDataEntry[],
  current: AnalysisConfigSearchDataEntry[],
  update: UpdateSearchDataInput[] | null | undefined
): AnalysisConfigSearchDataInput[] | undefined {
  if (update === null || update === undefined) {
    return update as null | undefined;
  }

  // Set of search keys that can be defined in the searchData
  const defaults = new Map(defaultSearch.map((x) => [x.key, x]));
  const currentData = new Map((current || []).map((x) => [x.key, x]));

  // Build list of updates. if the "value" property is falsy,
  // the value is reset to the default.
  const searchData: AnalysisConfigSearchDataInput[] = [];
  for (const search of update) {
    const key = search.key;
    const defaultValue = defaults.get(key);
    const currentValue = currentData.get(key) || defaultValue;
    if (!defaultValue) {
      throw new ValueError(`${key} is not a valid search term`);
    }
    const data = { ...currentValue };
    if (search.value !== undefined) {
      data.value = search.value === null ? defaultValue.value : search.value;
    }
    if (search.searchStrings !== undefined) {
      data.searchStrings =
        search.searchStrings === null
          ? defaultValue.searchStrings
          : search.searchStrings;
    }
    if (tooShort(data.value)) {
      throw new ValueError("searchData.value must be at least 3 characters");
    }
    searchData.push(data);
  }

  if (searchData.length == 0) {
    return undefined;
  }

  // add in any keys in the current settings that haven't been specified in the update
  const updatedKeys = new Set(searchData.map((x) => x.key));
  const curr = current || defaultSearch;
  searchData.push(...curr.filter((data) => !updatedKeys.has(data.key)));

  return searchData;
}

/**
 * Merges a search term into the existing term for that name (which may not exist).
 *
 * @param current Current search term with the same name (may be undefined)
 * @param update Search term update. If the value field is undefined and the current
 * field is also undefined the update will be ignored.
 * @returns An updated search term, or undefined if the update was ignored.
 */
function mergeTerm(
  current: AnalysisConfigSearchTermEntry | undefined,
  update: Partial<AnalysisConfigSearchTermInput>
): AnalysisConfigSearchTermInput | undefined {
  if (current) {
    const ret = { ...current };
    const { value, searchStrings } = update;
    if (value !== undefined) {
      ret.value = value;
    }
    if (searchStrings !== undefined) {
      ret.searchStrings = searchStrings || [];
    }
    return ret;
  }

  if (update.value) {
    return {
      name: update.name,
      value: update.value,
      searchStrings: update.searchStrings || [],
    };
  }

  return undefined;
}

/**
 * Returns an updated custom search array
 *
 * In replace mode (the default), the update array replaces the existing
 * searches.
 *
 * In merge mode
 * - If an update has a `null` value, the term with the same name is removed from the searches
 * - If an update's name matches an existing search, the matching term is updated
 * in the array. Any fields in the update which are `undefined` are left as-is.
 * - Non-matching updates with a non-null value are appended to the array.
 * @param current
 * @param update
 * @param replaceConfig
 * @returns
 */
function updateSearchTerms(
  current: AnalysisConfigSearchTermEntry[],
  update?: UpdateSearchTermInput[],
  replaceConfig = true
): AnalysisConfigSearchTermInput[] | null | undefined {
  if (update === undefined || update === null) {
    return update as undefined | null;
  }
  if (replaceConfig) {
    return update.map((term) => {
      if (tooShort(term.name)) {
        throw new ValueError("searchTerm.name must be at least 3 characters");
      }
      if (tooShort(term.value)) {
        throw new ValueError("searchTerm.value must be at least 3 characters");
      }
      return {
        name: term.name,
        value: term.value,
        searchStrings: term.searchStrings || [],
      };
    });
  }

  // Update mode:
  // - Search terms with a null value are removed
  // - Updates with non-empty values are added or updated
  // - Everything else is left as-is
  const updatedTerms = new Map(
    (current || []).map((term) => [term.name, term])
  );
  update.forEach((term) => {
    if (tooShort(term.name)) {
      throw new ValueError("searchTerm.name must be at least 3 characters");
    }
    if (term.value === null) {
      updatedTerms.delete(term.name);
    } else {
      if (term.value !== undefined && tooShort(term.value)) {
        throw new ValueError("searchTerm.value must be at least 3 characters");
      }

      const newTerm = mergeTerm(updatedTerms.get(term.name), term);
      if (newTerm) {
        updatedTerms.set(term.name, newTerm);
      }
    }
  });
  return [...updatedTerms.values()];
}

/**
 * Calculate the updated actions.
 * @param defaultValue default actions (basic config)
 * @param current current actions (may be null)
 * @param update new actions, or undefined, or null. If the `find` or `avoid`
 * field of the update is `null` the field will be reset to the default value.
 * @returns value for the update mutation (null, undefined or a new action)
 */
function updateActions(
  defaultValue: AnalysisConfigActionsEntry,
  current: AnalysisConfigActionsEntry,
  update?: Partial<AnalysisConfigActionsEntry> | null
): AnalysisConfigActionsInput | null | undefined {
  if (update === null || update === undefined) {
    return update as null | undefined;
  }

  if (update.avoid === undefined && update.find === undefined) {
    return undefined;
  }

  const ret: AnalysisConfigActionsEntry = current ||
    defaultValue || { avoid: [], find: [] };
  if (update.avoid === null) {
    ret.avoid = defaultValue.avoid;
  } else if (update.avoid) {
    ret.avoid = update.avoid;
  }

  if (update.find === null) {
    ret.find = defaultValue.find;
  } else if (update.find) {
    ret.find = update.find;
  }

  return ret;
}

const changed = (oldValue?: string, newValue?: string) =>
  newValue !== undefined && newValue !== oldValue;

function updateXCTest(
  current?: AnalysisConfigXcTestRunnerEntry,
  update?: AnalysisConfigXcTestRunnerInput
): AnalysisConfigXcTestRunnerInput | null | undefined {
  if (update === null || update === undefined) {
    return update;
  }

  if (update && !current) {
    throw new ValueError("No runner defined");
  }

  if (current && update) {
    if (changed(current.runnerFilename, update.runnerFilename)) {
      throw new ValueError("Cannot update runner");
    }
    if (changed(current.functionName, update.functionName)) {
      return {
        runnerFilename: current.runnerFilename,
        functionName: update.functionName,
      };
    }
  }

  return undefined;
}

function updateAppium(
  current?: AnalysisConfigAppiumRunnerEntry,
  update?: Partial<AnalysisConfigAppiumRunnerInput>
): AnalysisConfigAppiumRunnerInput | null | undefined {
  if (update === null || update === undefined) {
    return update as null | undefined;
  }

  if (update && !current) {
    throw new ValueError("No runner defined");
  }

  if (
    changed(current.archiveFilename, update.archiveFilename) ||
    changed(current.interpreter, update.interpreter)
  ) {
    throw new ValueError("Cannot update runner");
  }

  if (
    changed(current.runnerFilename, update.runnerFilename) ||
    changed(current.setupCommand, update.setupCommand)
  ) {
    const ret = {
      archiveFilename: current.archiveFilename,
      interpreter: current.interpreter,
      runnerFilename: current.runnerFilename,
      setupCommand: current.setupCommand,
      code: (current.code || "").split("/").pop(),
    };
    if (update.runnerFilename !== undefined) {
      ret.runnerFilename = update.runnerFilename;
    }
    if (update.setupCommand !== undefined) {
      ret.setupCommand = update.setupCommand;
    }
    return ret;
  }

  return undefined;
}

/**
 * Process the test runner configuration
 *
 * @param current Current application configuration (basic app info and analysis config)
 * @param update Update to apply
 * @param runnerType Type of the runner. If the value is `javascript`, `xctest` or `appium` an
 * appropriate runner file must be specified. If the value is `none`, the existing runner (if
 * any) will be cleared & all runner fields removed.
 *
 * If the value is undefined the runner can be cleared by passing null for the xctest / appium
 * field, or the runnerFilename and setupCommand (appium) or functionName (xctest) fields can
 * be updated. Attempting to change other fields without uploading a new runner will throw an error.
 * @param runnerFile path to the runner file to upload
 * @returns an object containing the `xctest`, `appium`, `dslScript`, `dslScriptFilename` and
 * `jsScript` values to pass to the mutation, along with boolean flags `deleteRunner` and
 * `uploadRunner` indicating the file action to take.
 */
async function processRunner(
  current: AppAnalysisConfigFieldsFragment,
  platform: PlatformEnum,
  update: UpdateConfigOptions,
  runnerType?: RunnerType,
  runnerFile?: string
) {
  const hasExistingRunner = !!(
    current.xctest?.runnerFilename || current.appium?.runnerFilename
  );
  const baseName = runnerFile ? path.basename(runnerFile) : "";
  let appium: AnalysisConfigAppiumRunnerInput | null | undefined = undefined;
  let jsScript: string = undefined;
  let dslScriptFilename: string = undefined;
  let dslScript: string = undefined;
  let xctest: AnalysisConfigXcTestRunnerInput = undefined;
  let uploadRunner = false;
  let deleteRunner = false;

  const clearJS = () => {
    jsScript = null;
    dslScript = null;
    dslScriptFilename = null;
  };

  if (runnerType && runnerType != RunnerType.None && !runnerFile) {
    throw new ValueError("No runner file specified");
  }
  switch (runnerType) {
    case RunnerType.JavaScript:
      {
        // JS runner files are read at the client end and passed as the
        // jsScript parameter.
        if (platform !== PlatformEnum.Android) {
          throw new ValueError(
            `Javascript runners not supported on ${platform}`
          );
        }
        dslScriptFilename = baseName;
        jsScript = await fsPromises.readFile(runnerFile, {
          encoding: "utf8",
        });
        xctest = null;
        appium = null;
        deleteRunner = hasExistingRunner;
      }
      break;

    case RunnerType.XCTest:
      {
        if (update.xctest === null) {
          throw new ValueError("Cannot delete xctest config");
        }
        if (platform !== PlatformEnum.Ios) {
          throw new ValueError(`XCTtest runners not supported on ${platform}`);
        }
        xctest = {
          runnerFilename: baseName,
          functionName: update.xctest?.functionName,
        };
        clearJS();
        appium = null;
        uploadRunner = true;
      }
      break;

    case RunnerType.Appium:
      {
        if (update.appium === null) {
          throw new ValueError("Cannot delete appium config");
        }
        if (!(update.appium?.runnerFilename && update.appium?.interpreter)) {
          throw new ValueError("runnerFilename and interpreter required");
        }
        if (
          // Python 2.7 is deprecated.
          update.appium?.interpreter != AppiumInterpreter.Node &&
          update.appium?.interpreter != AppiumInterpreter.Python3
        ) {
          throw new ValueError(
            `Invalid interpreter ${update.appium?.interpreter}`
          );
        }
        appium = {
          interpreter: update.appium?.interpreter,
          archiveFilename: baseName,
          runnerFilename: update.appium?.runnerFilename,
          setupCommand: update.appium?.setupCommand,
        };
        clearJS();
        xctest = null;
        uploadRunner = true;
      }
      break;

    case RunnerType.None:
      {
        xctest = null;
        appium = null;
        clearJS();
        deleteRunner = hasExistingRunner;
      }
      break;

    default:
      {
        xctest = updateXCTest(current.xctest, update.xctest);
        appium = updateAppium(current.appium, update.appium);
        if (
          hasExistingRunner &&
          !(xctest?.runnerFilename || appium?.archiveFilename)
        ) {
          deleteRunner = true;
        }
      }
      break;
  }
  return {
    deleteRunner,
    uploadRunner,
    config: {
      xctest,
      appium,
      dslScript,
      dslScriptFilename,
      jsScript,
    },
  };
}

export async function processConfigUpdate(
  defaultSearchData: AnalysisConfigSearchDataEntry[],
  defaultAction: AnalysisConfigActionsEntry,
  current: AppAnalysisConfigFieldsFragment,
  platform: PlatformEnum,
  runnerType?: RunnerType,
  runnerFile?: string,
  update: UpdateConfigOptions = {},
  mergeSearchTerms = false
) {
  const ret = await processRunner(
    current,
    platform,
    update,
    runnerType,
    runnerFile
  );

  const searchData = updateSearchData(
    defaultSearchData,
    current.searchData,
    update.searchData
  );
  const searchTerms = updateSearchTerms(
    current.searchTerms,
    update.searchTerms,
    !mergeSearchTerms
  );
  const actions = updateActions(defaultAction, current.actions, update.actions);

  return {
    ...ret,
    config: { ...ret.config, searchData, searchTerms, actions },
  };
}

export async function updateAnalysisConfig(
  client: NowSecureClient,
  appRef: string,
  runnerType?: RunnerType,
  runnerFile?: string,
  update: UpdateConfigOptions = {},
  mergeSearchTerms = false,
  requestConfig?: RequestConfig
): Promise<void> {
  const ret = await appAnalysisConfigQuery(client, {
    ref: appRef,
    getApp: true,
  });
  const app = ret.auto.application;
  const current = app.analysisConfig;

  const {
    deleteRunner,
    uploadRunner,
    config: updateVals,
  } = await processConfigUpdate(
    ret.auto.defaultAnalysisConfig.searchData,
    ret.auto.defaultAnalysisConfig.actions,
    current,
    app.platformType,
    runnerType,
    runnerFile,
    update,
    mergeSearchTerms
  );

  if (uploadRunner) {
    const stream = fs.createReadStream(runnerFile);
    const updatedApp = await uploadRunnerBinary(
      client,
      stream,
      app.platformType,
      app.packageKey,
      app.group.ref,
      requestConfig
    );
    if (updateVals.appium) {
      updateVals.appium.code = updatedApp.test_runner_binary;
    }
  }

  if (Object.values(updateVals).some((x) => x !== undefined)) {
    await updateAppAnalysisConfigMutation(client, {
      appRef,
      actions: updateVals.actions,
      searchData: updateVals.searchData,
      searchTerms: updateVals.searchTerms,
      appium: updateVals.appium,
      jsScript: updateVals.jsScript,
      dslScript: updateVals.dslScript,
      dslScriptFilename: updateVals.dslScriptFilename,
      xctest: updateVals.xctest,
    });
  }

  if (deleteRunner) {
    await deleteRunnerBinary(
      client,
      app.platformType,
      app.packageKey,
      app.group.ref
    );
  }
}

export async function resetAnalysisConfig(
  client: NowSecureClient,
  appRef: string
) {
  await resetAppAnalysisConfigMutation(client, { appRef });
}
