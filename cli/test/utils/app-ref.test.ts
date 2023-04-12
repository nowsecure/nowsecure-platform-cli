/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { PlatformAPI } from "@nowsecure/platform-lib";
import { expect, test } from "@oclif/test";
import { resolveAppRef } from "../../src/utils";
import { CommandShim } from "../helpers/command-shim";

chai.use(chaiAsPromised);

const APPS = [
  {
    ref: "00000000-0000-0000-0000-000000000004",
    platformType: "android",
    group: {
      ref: "00000000-0000-0000-0000-000000000001",
      name: "Group 1",
    },
    packageKey: "com.example.app",
    title: "Example android app",
    iconURL: null,
  },
  {
    ref: "00000000-0000-0000-0000-000000000005",
    platformType: "android",
    group: {
      ref: "00000000-0000-0000-0000-000000000002",
      name: "Group 2",
    },
    packageKey: "com.example.app",
    title: "Example android app",
    iconURL: null,
  },
  {
    ref: "00000000-0000-0000-0000-000000000006",
    platformType: "ios",
    group: {
      ref: "00000000-0000-0000-0000-000000000002",
      name: "Group 2",
    },
    packageKey: "com.example.app",
    title: "Example ios app",
    iconURL: null,
  },
];

describe("App Ref", () => {
  const mock = {
    listApplications: async (args: { groupRefs: string }) => {
      return APPS.filter(
        (app) => !args.groupRefs || app.group.ref == args.groupRefs
      );
    },

    userGroups: async () => {
      return [
        {
          ref: "00000000-0000-0000-0000-000000000001",
          id: "1",
          name: "Group 1",
          createdAt: "2020-02-04T16:18:13.134000Z",
          active: true,
          note: null,
          settings: [],
          currentApplicationCount: 1,
          completedAssessmentCount: 6,
          completedBaselineAssessmentCount: 0,
        },
        {
          ref: "00000000-0000-0000-0000-000000000002",
          id: "2",
          name: "Group 2",
          createdAt: "2020-07-22T12:43:30.468000Z",
          active: true,
          note: null,
          settings: [
            {
              key: "assessment.filter:licenseType",
              value: "both",
            },
            {
              key: "assessment.filter:sourceType",
              value: "appstore",
            },
          ],
          currentApplicationCount: 7,
          completedAssessmentCount: 8,
          completedBaselineAssessmentCount: 4,
        },
        {
          ref: "00000000-0000-0000-0000-000000000003",
          id: "3",
          name: "Group 3",
          createdAt: "2020-03-17T10:52:20.102000Z",
          active: false,
          note: null,
          settings: [],
          currentApplicationCount: 10,
          completedAssessmentCount: 6,
          completedBaselineAssessmentCount: 0,
        },
      ];
    },
  };

  test.it("resolves", async () => {
    const api = mock as unknown as PlatformAPI;
    const shim = new CommandShim();

    await expect(
      resolveAppRef(
        api,
        { platform: "ios", packageName: "com.example.app" },
        {
          group: undefined,
          "group-ref": undefined,
          ref: undefined,
        },
        shim
      )
    ).to.eventually.eql("00000000-0000-0000-0000-000000000006");
  });

  test.it("rejects if duplicates", async () => {
    const api = mock as unknown as PlatformAPI;
    const shim = new CommandShim();

    await expect(
      resolveAppRef(
        api,
        { platform: "android", packageName: "com.example.app" },
        {
          group: undefined,
          "group-ref": undefined,
          ref: undefined,
        },
        shim
      )
    ).to.eventually.be.rejected;
  });

  test.it("resolves with group if duplicates", async () => {
    const api = mock as unknown as PlatformAPI;
    const shim = new CommandShim();
    await expect(
      resolveAppRef(
        api,
        { platform: "android", packageName: "com.example.app" },
        {
          group: "Group 2",
          "group-ref": undefined,
          ref: undefined,
        },
        shim
      )
    ).to.eventually.eql("00000000-0000-0000-0000-000000000005");
  });

  test.it("rejects if app and package specified", async () => {
    const api = mock as unknown as PlatformAPI;
    const shim = new CommandShim();
    await expect(
      resolveAppRef(
        api,
        { platform: "android", packageName: "com.example.app" },
        {
          group: "Group 2",
          "group-ref": undefined,
          ref: "00000000-0000-0000-0000-000000000005",
        },
        shim
      )
    ).to.eventually.be.rejected;
  });
});
