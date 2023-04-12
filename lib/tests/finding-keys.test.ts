/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";

import { cloneDeep } from "lodash";
import { Assessment, PlatformEnum } from "../src/types";

import {
  KeyParams,
  findingKey,
  ruleIdAndFingerprint,
  parseKeyConfig,
  DEFAULT_KEY_PARAMS,
} from "../src/finding-keys";
import { JSONObject, ValueError } from "../src";

const ASSESSMENT: Assessment = JSON.parse(
  fs.readFileSync(path.join(__dirname, "resources", "assessment.json"), "utf8")
);

const configs = yaml.parse(
  fs.readFileSync(path.join(__dirname, "resources", "key-params.yml"), "utf8")
);

const fkey = (assessment: Assessment, index: number, keyParams: KeyParams) => {
  const f = assessment.report?.findings?.[index];
  if (!f) {
    throw Error("Finding is null");
  }
  return findingKey(assessment, f, keyParams);
};

const allKey: KeyParams = {
  includePackage: true,
  includePlatform: true,
  v1package: null,
  v1platform: null,
};
const noPlatform: KeyParams = {
  includePackage: true,
  includePlatform: false,
  v1package: null,
  v1platform: null,
};
const noPackage: KeyParams = {
  includePackage: false,
  includePlatform: true,
  v1package: null,
  v1platform: null,
};
const keyOnly: KeyParams = {
  includePackage: false,
  includePlatform: false,
  v1package: null,
  v1platform: null,
};
const v1: KeyParams = {
  includePackage: true,
  includePlatform: true,
  v1package: "com.example.app",
  v1platform: "android",
};
const v1NoPlat: KeyParams = {
  includePackage: true,
  includePlatform: false,
  v1package: "com.example.app",
  v1platform: "android",
};

function getAsmt(platform: string | null, packageName: string | null) {
  const clone = cloneDeep(ASSESSMENT);
  if (platform) {
    clone.platformType = platform as PlatformEnum;
  }
  if (packageName) {
    clone.packageKey = packageName;
  }
  return clone;
}

function getKey(
  platform: string | null,
  packageName: string | null,
  keyParams: KeyParams
) {
  const clone = getAsmt(platform, packageName);
  return fkey(clone, 0, keyParams);
}

function getRuleAndFingerprint(
  platform: string | null,
  packageName: string | null,
  keyParams: KeyParams
) {
  const clone = getAsmt(platform, packageName);
  return ruleIdAndFingerprint(clone, clone.report.findings[0], keyParams);
}

describe("key derivation", () => {
  test("handles key parameters", () => {
    expect(ASSESSMENT.platformType).toEqual("android");
    expect(ASSESSMENT.packageKey).toEqual("com.example.app");

    const all = fkey(ASSESSMENT, 0, allKey);

    // Check that the key is used
    expect(fkey(ASSESSMENT, 1, allKey)).not.toEqual(all);

    // key, platform and package
    expect(getKey(null, null, allKey)).toEqual(all);
    expect(getKey("ios", null, allKey)).not.toEqual(all);
    expect(getKey(null, "another.package", allKey)).not.toEqual(all);

    // key and package
    const noPlat = fkey(ASSESSMENT, 0, noPlatform);
    expect(getKey(null, null, noPlatform)).toEqual(noPlat);
    expect(getKey("ios", null, noPlatform)).toEqual(noPlat);
    expect(getKey(null, "another.package", noPlatform)).not.toEqual(noPlat);

    // key and platform
    const noPkg = fkey(ASSESSMENT, 0, noPackage);
    expect(getKey(null, null, noPackage)).toEqual(noPkg);
    expect(getKey("ios", null, noPackage)).not.toEqual(noPkg);
    expect(getKey(null, "another.package", noPackage)).toEqual(noPkg);

    // key only
    const justKey = fkey(ASSESSMENT, 0, keyOnly);
    expect(getKey(null, null, keyOnly)).toEqual(justKey);
    expect(getKey("ios", null, keyOnly)).toEqual(justKey);
    expect(getKey(null, "another.package", keyOnly)).toEqual(justKey);

    // v1 override
    expect(getKey(null, null, v1)).toEqual(justKey);
    expect(getKey("ios", null, v1)).not.toEqual(justKey);
    expect(getKey(null, "another.package", v1)).not.toEqual(justKey);
  });

  test("fingerprints: no fingerprint matches findingKey", () => {
    function testSame(
      platform: string | null,
      packageName: string | null,
      params: KeyParams
    ) {
      const key = getKey(platform, packageName, params);
      const { ruleId, partialFingerprints } = getRuleAndFingerprint(
        platform,
        packageName,
        { ...params, fingerprint: false }
      );
      expect(ruleId).toEqual(key);
      expect(partialFingerprints).toBeUndefined();
    }
    function testAllSame(params: KeyParams) {
      testSame(null, null, params);
      testSame("ios", null, params);
      testSame(null, "another.package", params);
      testSame("ios", "another.package", params);
    }

    [allKey, noPlatform, noPackage, keyOnly, v1, v1NoPlat].forEach(testAllSame);
  });

  test("fingerprints: fingerprinted ruleID does not change", () => {
    function testRuleId(params: KeyParams) {
      const key = getKey(null, null, keyOnly);
      const { ruleId } = getRuleAndFingerprint(null, null, {
        ...params,
        fingerprint: true,
      });
      expect(ruleId).toEqual(key);
    }

    [allKey, noPlatform, noPackage, keyOnly, v1, v1NoPlat].forEach(testRuleId);
  });

  test("fingerprints: partialFingerprints calculation", () => {
    function fingerprint(
      platform: string | null,
      packageName: string | null,
      params: KeyParams
    ) {
      const { partialFingerprints } = getRuleAndFingerprint(
        platform,
        packageName,
        { ...params, fingerprint: true }
      );
      return partialFingerprints;
    }

    const all = fingerprint(null, null, allKey);

    // platform and package
    expect(fingerprint("ios", null, allKey)).not.toEqual(all);
    expect(fingerprint(null, "another.package", allKey)).not.toEqual(all);

    // package
    const noPlat = fingerprint(null, null, noPlatform);
    expect(fingerprint("ios", null, noPlatform)).toEqual(noPlat);
    expect(fingerprint(null, "another.package", noPlatform)).not.toEqual(
      noPlat
    );

    // platform
    const noPkg = fingerprint(null, null, noPackage);
    expect(fingerprint("ios", null, noPackage)).not.toEqual(noPkg);
    expect(fingerprint(null, "another.package", noPackage)).toEqual(noPkg);

    // neither - no fingerprint
    expect(fingerprint(null, null, keyOnly)).toBeUndefined();
    expect(fingerprint("ios", null, keyOnly)).toBeUndefined();
    expect(fingerprint(null, "another.package", keyOnly)).toBeUndefined();

    // v1 override
    expect(fingerprint(null, null, v1)).toEqual(all);
    expect(fingerprint("ios", null, v1)).not.toEqual(all);
    expect(fingerprint(null, "another.package", v1)).not.toEqual(all);

    // v1 override, package only
    expect(fingerprint(null, null, v1NoPlat)).toEqual(noPlat);
    expect(fingerprint("ios", null, v1NoPlat)).toEqual(noPlat);
    expect(fingerprint(null, "another.package", v1NoPlat)).not.toEqual(noPlat);
  });
});

describe("kdf parser", () => {
  const typeErrors = configs["type-errors"];
  const valueErrors = configs["value-errors"];
  const valid = configs.valid;

  for (const key of Object.keys(typeErrors)) {
    test(`checks types: ${key}`, () => {
      expect(() => parseKeyConfig(typeErrors[key] as JSONObject)).toThrow(
        TypeError
      );
    });
  }

  for (const key of Object.keys(valueErrors)) {
    test(`checks values: ${key}`, () => {
      expect(() => parseKeyConfig(valueErrors[key] as JSONObject)).toThrow(
        ValueError
      );
    });
  }

  test("read fingerprint", () => {
    expect(parseKeyConfig(valid["fingerprint-false"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      fingerprint: false,
    });
    expect(parseKeyConfig(valid["fingerprint-true"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      fingerprint: true,
    });
  });

  test("read platform", () => {
    expect(parseKeyConfig(valid["platform-false"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      includePlatform: false,
    });
    expect(parseKeyConfig(valid["platform-true"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      includePlatform: true,
    });
  });

  test("read package", () => {
    expect(parseKeyConfig(valid["package-false"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      includePackage: false,
    });
    expect(parseKeyConfig(valid["package-true"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      includePackage: true,
    });
  });

  test("read v1-key", () => {
    expect(parseKeyConfig(valid["v1-key"])).toEqual({
      ...DEFAULT_KEY_PARAMS,
      v1platform: "ios",
      v1package: "com.example.app",
    });
  });
});
