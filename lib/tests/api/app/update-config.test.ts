/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs from "fs";
import {
  processConfigUpdate,
  RunnerType,
  UpdateConfigOptions,
  UpdateSearchDataInput,
  UpdateSearchTermInput,
  ValueError,
} from "../../../src";
import {
  AnalysisConfigActionsEntry,
  AnalysisConfigAppiumRunnerInput,
  AnalysisConfigSearchDataEntry,
  AnalysisConfigSearchTermEntry,
  AnalysisConfigXcTestRunnerInput,
  AppAnalysisConfigFieldsFragment,
  AppiumInterpreter,
  PlatformEnum,
} from "../../../src/generated/graphql";
import { resourcePath } from "../../helpers/resources";

type UpdateType = Awaited<ReturnType<typeof processConfigUpdate>>;

const defaultUser: AnalysisConfigSearchDataEntry = {
  key: "user",
  nonSensitive: true,
  value: "roadRunner",
  searchStrings: ["name", "user"],
};
const defaultPassword: AnalysisConfigSearchDataEntry = {
  key: "password",
  nonSensitive: false,
  value: "beepbeep",
  searchStrings: [],
};
const defaultSearchData = [defaultUser, defaultPassword];

const currentUser: AnalysisConfigSearchDataEntry = {
  key: "user",
  nonSensitive: true,
  value: "coyote",
  searchStrings: ["account"],
};
const currentPassword: AnalysisConfigSearchDataEntry = {
  key: "password",
  nonSensitive: false,
  value: "drawingboard",
  searchStrings: ["pass"],
};
const currentSearchData = [currentUser, currentPassword];

const defaultAction: AnalysisConfigActionsEntry = {
  find: ["OK", "options"],
  avoid: ["facebook", "Google"],
};
const currentActions: AnalysisConfigActionsEntry = {
  find: ["the", "one", "ring"],
  avoid: ["nazgul"],
};
const updateActions: AnalysisConfigActionsEntry = {
  find: ["my", "way", "home"],
  avoid: ["getting", "caught"],
};

function simpleConfigUpdate(
  current: AppAnalysisConfigFieldsFragment,
  update: UpdateConfigOptions
): Promise<UpdateType> {
  return processConfigUpdate(
    defaultSearchData,
    defaultAction,
    current,
    PlatformEnum.Android,
    undefined,
    undefined,
    update
  );
}

describe("Update config: Runners", () => {
  test("javascript not permitted in ios", async () => {
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Ios,
      RunnerType.JavaScript,
      "/tmp/jsfile"
    );
    await expect(promise).rejects.toThrow(ValueError);
  });

  test("javascript file must exist", async () => {
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Android,
      RunnerType.JavaScript,
      "/not/a/file"
    );
    await expect(promise).rejects.toThrow();
  });

  test("runner file required", async () => {
    for (const rt of [
      RunnerType.JavaScript,
      RunnerType.Appium,
      RunnerType.XCTest,
    ]) {
      const promise = processConfigUpdate(
        defaultSearchData,
        defaultAction,
        {},
        rt == RunnerType.JavaScript ? PlatformEnum.Android : PlatformEnum.Ios,
        rt
      );
      await expect(promise).rejects.toThrow(ValueError);
    }
  });

  test("None runner clears existing", async () => {
    const jsUpdate = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { jsScript: "hello", dslScriptFilename: "a file name" },
      PlatformEnum.Android,
      RunnerType.None
    );
    // JS runners aren't uploaded, so deleteRunner should be false here
    expect(jsUpdate.deleteRunner).toBe(false);

    const xcUpdate = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { xctest: { runnerFilename: "A file.ipa" } },
      PlatformEnum.Ios,
      RunnerType.None
    );
    expect(xcUpdate.deleteRunner).toBe(true);

    const appiumUpdate = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {
        appium: {
          archiveFilename: "A file.zip",
          runnerFilename: "somefile.py",
        },
      },
      PlatformEnum.Ios,
      RunnerType.None
    );
    expect(appiumUpdate.deleteRunner).toBe(true);
  });

  test("javascript read immediately", async () => {
    const baseName = "js-runner.js";
    const jsPath = resourcePath(baseName);
    const jsText = fs.readFileSync(jsPath, "utf-8");
    const update = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Android,
      RunnerType.JavaScript,
      jsPath
    );
    expect(update.config.jsScript).toEqual(jsText);
    expect(update.config.dslScriptFilename).toEqual(baseName);
    expect(update.uploadRunner).toBe(false);
  });

  test("appium upload", async () => {
    const update = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Android,
      RunnerType.Appium,
      "/path/to/runner.zip",
      {
        appium: {
          interpreter: AppiumInterpreter.Node,
          runnerFilename: "file.js",
        },
      }
    );
    const expected: AnalysisConfigAppiumRunnerInput = {
      interpreter: AppiumInterpreter.Node,
      archiveFilename: "runner.zip",
      runnerFilename: "file.js",
    };
    expect(update.config.appium).toEqual(expected);
    expect(update.uploadRunner).toBe(true);
  });

  test("appium: Python 2 disabled", async () => {
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Android,
      RunnerType.Appium,
      "/path/to/runner.zip",
      {
        appium: {
          interpreter: AppiumInterpreter.Python,
          runnerFilename: "file.py",
        },
      }
    );
    await expect(promise).rejects.toThrow(ValueError);
  });

  test("appium update: Cannot update runner without upload", async () => {
    const current: AnalysisConfigAppiumRunnerInput = {
      archiveFilename: "old_runner.zip",
      runnerFilename: "test.py",
      interpreter: AppiumInterpreter.Python3,
    };
    let promise = simpleConfigUpdate(
      { appium: current },
      { appium: { archiveFilename: "archive.zip" } }
    );
    await expect(promise).rejects.toThrow(ValueError);

    promise = simpleConfigUpdate(
      { appium: current },
      { appium: { interpreter: AppiumInterpreter.Node } }
    );
    await expect(promise).rejects.toThrow(ValueError);

    const update = await simpleConfigUpdate(
      { appium: current },
      { appium: current }
    );
    expect(update.config.appium).toBeUndefined();
  });

  test("appium update: Can update non-runner fields", async () => {
    const current: AnalysisConfigAppiumRunnerInput = {
      archiveFilename: "old_runner.zip",
      runnerFilename: "test.py",
      interpreter: AppiumInterpreter.Python3,
      setupCommand: "old_command",
      code: "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
    };
    const update = {
      runnerFilename: "new_test.py",
      setupCommand: "new_command",
    };

    const updateRunner = await simpleConfigUpdate(
      { appium: current },
      { appium: { runnerFilename: update.runnerFilename } }
    );
    expect(updateRunner.config.appium).toEqual({
      ...current,
      runnerFilename: update.runnerFilename,
    });

    const updateSetup = await simpleConfigUpdate(
      { appium: current },
      { appium: { setupCommand: update.setupCommand } }
    );
    expect(updateSetup.config.appium).toEqual({
      ...current,
      setupCommand: update.setupCommand,
    });
  });

  test("appium update: Can pass in original setting", async () => {
    const current: AnalysisConfigAppiumRunnerInput = {
      archiveFilename: "old_runner.zip",
      runnerFilename: "test.py",
      interpreter: AppiumInterpreter.Python3,
      setupCommand: "old_command",
      code: "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
    };

    const update = await simpleConfigUpdate(
      { appium: current },
      { appium: current }
    );
    expect(update.config.appium).toBeUndefined();
  });

  test("appium update: Cannot update runner without previous settings", async () => {
    const promise = simpleConfigUpdate(
      {},
      { appium: { setupCommand: "test" } }
    );
    await expect(promise).rejects.toThrow(ValueError);
  });

  test("xctest not permitted in android", async () => {
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Android,
      RunnerType.XCTest,
      "/tmp/test.ipa"
    );
    await expect(promise).rejects.toThrow(ValueError);
  });

  test("xctest upload", async () => {
    const update = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Ios,
      RunnerType.XCTest,
      "/path/to/runner.ipa",
      { xctest: { functionName: "test" } }
    );
    const expected: AnalysisConfigXcTestRunnerInput = {
      runnerFilename: "runner.ipa",
      functionName: "test",
    };
    expect(update.config.xctest).toEqual(expected);
    expect(update.uploadRunner).toBe(true);
  });

  test("xctest update: Cannot update runner without upload", async () => {
    const current: AnalysisConfigXcTestRunnerInput = {
      runnerFilename: "test.ipa",
      functionName: "test_fn",
    };
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { xctest: current },
      PlatformEnum.Ios,
      undefined,
      undefined,
      { xctest: { runnerFilename: "another.ipa" } }
    );
    await expect(promise).rejects.toThrow(ValueError);
  });

  test("xctest update: Can update non-runner fields", async () => {
    const current: AnalysisConfigXcTestRunnerInput = {
      runnerFilename: "test.ipa",
      functionName: "test_fn",
    };
    const new_fn = "new_fn";
    const update = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { xctest: current },
      PlatformEnum.Ios,
      undefined,
      undefined,
      { xctest: { functionName: new_fn } }
    );
    expect(update.config.xctest).toEqual({
      ...current,
      functionName: new_fn,
    });
  });

  test("xctest update: Can pass in original settings", async () => {
    const current: AnalysisConfigXcTestRunnerInput = {
      runnerFilename: "test.ipa",
      functionName: "test_fn",
    };
    const update = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { xctest: current },
      PlatformEnum.Ios,
      undefined,
      undefined,
      { xctest: current }
    );
    expect(update.config.xctest).toBeUndefined();
  });

  test("xctest update: Cannot update runner without previous settings", async () => {
    const promise = processConfigUpdate(
      defaultSearchData,
      defaultAction,
      {},
      PlatformEnum.Ios,
      undefined,
      undefined,
      { xctest: { functionName: "test_2" } }
    );
    await expect(promise).rejects.toThrow(ValueError);
  });
});

describe("Update config: Actions", () => {
  test("Undefined does nothing", async () => {
    const update = await simpleConfigUpdate({ actions: currentActions }, {});
    expect(update.config.actions).toBeUndefined();
  });

  test("null clears", async () => {
    const update = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: null }
    );
    expect(update.config.actions).toBeNull();
  });

  test("value replaces", async () => {
    const update = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: updateActions }
    );
    expect(update.config.actions).toEqual(updateActions);

    const newValues = await simpleConfigUpdate({}, { actions: updateActions });
    expect(newValues.config.actions).toEqual(updateActions);
  });

  test("undefined ignored", async () => {
    const findUpdate = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: { find: updateActions.find } }
    );
    expect(findUpdate.config.actions).toEqual({
      find: updateActions.find,
      avoid: currentActions.avoid,
    });

    const avoidUpdate = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: { avoid: updateActions.avoid } }
    );
    expect(avoidUpdate.config.actions).toEqual({
      find: currentActions.find,
      avoid: updateActions.avoid,
    });
  });

  test("undefined ignored - no previous values", async () => {
    const findUpdate = await simpleConfigUpdate(
      {},
      { actions: { find: updateActions.find } }
    );
    expect(findUpdate.config.actions).toEqual({
      find: updateActions.find,
      avoid: defaultAction.avoid,
    });

    const avoidUpdate = await simpleConfigUpdate(
      {},
      { actions: { avoid: updateActions.avoid } }
    );
    expect(avoidUpdate.config.actions).toEqual({
      find: defaultAction.find,
      avoid: updateActions.avoid,
    });
  });

  test("null resets to default", async () => {
    const findUpdate = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: { find: null } }
    );
    expect(findUpdate.config.actions).toEqual({
      find: defaultAction.find,
      avoid: currentActions.avoid,
    });

    const avoidUpdate = await simpleConfigUpdate(
      { actions: currentActions },
      { actions: { avoid: null } }
    );
    expect(avoidUpdate.config.actions).toEqual({
      find: currentActions.find,
      avoid: defaultAction.avoid,
    });
  });

  test("null resets to default - no previous values", async () => {
    const findUpdate = await simpleConfigUpdate(
      {},
      { actions: { find: null } }
    );
    expect(findUpdate.config.actions).toEqual(defaultAction);

    const avoidUpdate = await simpleConfigUpdate(
      {},
      { actions: { avoid: null } }
    );
    expect(avoidUpdate.config.actions).toEqual(defaultAction);
  });
});

describe("Update config: Fixed searches", () => {
  const findUser = (update: UpdateType) =>
    update.config.searchData.find((x) => x.key === "user");

  const testUser = async (
    x: Partial<UpdateSearchDataInput>,
    currentIsNull = false
  ) => {
    const update = await simpleConfigUpdate(
      { searchData: currentIsNull ? null : currentSearchData },
      { searchData: [{ ...x, key: "user" }] }
    );
    return findUser(update);
  };

  test("undefined does nothing", async () => {
    const undefinedUpdate = await simpleConfigUpdate(
      { searchData: currentSearchData },
      { searchData: undefined }
    );
    expect(undefinedUpdate.config.searchData).toBeUndefined();
  });

  test("null clears", async () => {
    const nullUpdate = await simpleConfigUpdate(
      { searchData: currentSearchData },
      { searchData: null }
    );
    expect(nullUpdate.config.searchData).toBeNull();
  });

  test("Empty list does nothing", async () => {
    const emptyUpdate = await simpleConfigUpdate(
      { searchData: currentSearchData },
      { searchData: [] }
    );
    expect(emptyUpdate.config.searchData).toBeUndefined();
  });

  test("updates fields if not undefined", async () => {
    expect(await testUser({})).toEqual(currentUser);
    expect(await testUser({}, true)).toEqual(defaultUser);

    expect(await testUser({ value: "value" })).toEqual({
      ...currentUser,
      value: "value",
    });
    expect(await testUser({ value: "value" }, true)).toEqual({
      ...defaultUser,
      value: "value",
    });

    expect(await testUser({ searchStrings: ["searchStrings"] })).toEqual({
      ...currentUser,
      searchStrings: ["searchStrings"],
    });
    expect(await testUser({ searchStrings: ["searchStrings"] }, true)).toEqual({
      ...defaultUser,
      searchStrings: ["searchStrings"],
    });

    expect(
      await testUser({ value: "value", searchStrings: ["searchStrings"] })
    ).toEqual({
      ...currentUser,
      value: "value",
      searchStrings: ["searchStrings"],
    });
    expect(
      await testUser({ value: "value", searchStrings: ["searchStrings"] }, true)
    ).toEqual({
      ...defaultUser,
      value: "value",
      searchStrings: ["searchStrings"],
    });
  });

  test("resets fields if null", async () => {
    expect(await testUser({ value: null })).toEqual({
      ...currentUser,
      value: defaultUser.value,
    });
    expect(await testUser({ value: null }, true)).toEqual(defaultUser);

    expect(await testUser({ searchStrings: null })).toEqual({
      ...currentUser,
      searchStrings: defaultUser.searchStrings,
    });
    expect(await testUser({ searchStrings: null }, true)).toEqual(defaultUser);

    expect(await testUser({ value: null, searchStrings: null })).toEqual({
      ...currentUser,
      value: defaultUser.value,
      searchStrings: defaultUser.searchStrings,
    });
    expect(await testUser({ value: null, searchStrings: null }, true)).toEqual(
      defaultUser
    );
  });

  test("values must be >= 3 characters long", async () => {
    expect(testUser({ value: "aa" })).rejects.toThrow(ValueError);
  });

  test("copies unreferenced entries from current", async () => {
    async function unrefed(hasCurrent: boolean) {
      const update = await simpleConfigUpdate(
        { searchData: hasCurrent ? currentSearchData : null },
        { searchData: [{ key: "user", value: "updated" }] }
      );
      const baseData = hasCurrent ? currentSearchData : defaultSearchData;
      const baseKeys = baseData.map((x) => x.key).sort();
      const updateKeys = update.config.searchData.map((x) => x.key).sort();
      expect(updateKeys).toEqual(baseKeys);
    }

    await unrefed(false);
    await unrefed(true);
  });

  test("unknown keys not allowed", async () => {
    const promise = simpleConfigUpdate(
      { searchData: defaultSearchData },
      { searchData: [{ key: "unknown", value: "222" }] }
    );
    await expect(promise).rejects.toThrow(ValueError);
  });
});

describe("Update config: Custom searches", () => {
  const c1 = {
    name: "c1_name",
    value: "c1_value",
    searchStrings: ["c1_search"],
  };
  const c2 = {
    name: "c2_name",
    value: "c2_value",
    searchStrings: ["c2_search"],
  };
  const c3 = {
    name: "c3_name",
    value: "c3_value",
    searchStrings: ["c3_search"],
  };
  const currentTerms: AnalysisConfigSearchTermEntry[] = [c1, c2];

  const termUpdate = async (
    current: AnalysisConfigSearchTermEntry[] | null,
    update: UpdateSearchTermInput[],
    merge = false
  ) => {
    const upd = await processConfigUpdate(
      defaultSearchData,
      defaultAction,
      { searchTerms: current },
      PlatformEnum.Android,
      undefined,
      undefined,
      {
        searchTerms: update,
      },
      merge
    );

    return upd.config.searchTerms;
  };

  test("undefined does nothing", async () => {
    expect(await termUpdate(currentTerms, undefined)).toBeUndefined();
  });

  test("null clears", async () => {
    expect(await termUpdate(currentTerms, null)).toBeNull();
  });

  test("replace: update replaces old list", async () => {
    expect(await termUpdate(currentTerms, [c1])).toEqual([c1]);
    expect(await termUpdate(currentTerms, [c3, c2])).toEqual([c3, c2]);

    expect(await termUpdate(null, [c1])).toEqual([c1]);
    expect(await termUpdate(null, [c3, c2])).toEqual([c3, c2]);
  });

  test("replace: name and value >= 3 characters", async () => {
    const name = termUpdate(currentTerms, [{ name: "aa", value: "aaa" }]);
    expect(name).rejects.toThrow(ValueError);

    const value = termUpdate(currentTerms, [{ name: "aaa", value: "aa" }]);
    expect(value).rejects.toThrow(ValueError);

    const ok = [{ name: "aaa", value: "aaa", searchStrings: ["aßß"] }];
    expect(await termUpdate(currentTerms, ok)).toEqual(ok);
  });

  test("merge: null value deletes", async () => {
    const clear: UpdateSearchTermInput[] = [{ name: c1.name, value: null }];

    const updated = await termUpdate(currentTerms, clear, true);
    expect(updated).toEqual([c2]);

    // deleting an entry that doesn't exist does nothing
    const missed = await termUpdate([c2, c3], clear, true);
    expect(missed).toEqual([c2, c3]);

    // deleting against a null list is also a no-op
    const nullUpdated = await termUpdate(null, clear, true);
    expect(nullUpdated).toEqual([]);
  });

  test("merge: new value appends", async () => {
    const updated = await termUpdate(currentTerms, [c3], true);
    expect(updated).toEqual([...currentTerms, c3]);

    // appending when there's no existing list works as expected
    const nullUpdated = await termUpdate(null, [c3], true);
    expect(nullUpdated).toEqual([c3]);
  });

  test("merge: matching value updates", async () => {
    const valUpdate = [{ name: c1.name, value: "updated" }];
    const searchUpdate = [{ name: c2.name, searchStrings: ["updated"] }];

    const changeValue = await termUpdate(currentTerms, valUpdate, true);
    expect(changeValue).toEqual([{ ...c1, value: "updated" }, c2]);

    // merge against a miss or against a null list is an append if value is specified
    const changeNullValue = await termUpdate(null, valUpdate, true);
    expect(changeNullValue).toEqual([{ ...valUpdate[0], searchStrings: [] }]);

    const changeSearch = await termUpdate(currentTerms, searchUpdate, true);
    expect(changeSearch).toEqual([c1, { ...c2, searchStrings: ["updated"] }]);

    // merge against a miss or against a null list is a no-op if value is not specified
    const changeNullSearch = await termUpdate(null, searchUpdate, true);
    expect(changeNullSearch).toEqual([]);
  });
});
