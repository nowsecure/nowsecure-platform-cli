/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { PlatformAPI, ValueError } from "@nowsecure/platform-lib";
import { expect, test } from "@oclif/test";
import { getGroupRef, getGroupsList } from "../../src/utils";
import { CommandShim } from "../helpers/command-shim";

chai.use(chaiAsPromised);

describe("Group lists", () => {
  const mock = {
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

  test.it("groupRefs", async () => {
    const shim = new CommandShim();
    const groups = await getGroupsList(mock as unknown as PlatformAPI, shim, [
      "Group 1",
      "Group 2",
    ]);
    expect(groups?.length).to.eql(2);
    expect(groups?.[0]).to.eql("00000000-0000-0000-0000-000000000001");
    expect(groups?.[1]).to.eql("00000000-0000-0000-0000-000000000002");

    expect(
      getGroupsList(mock as unknown as PlatformAPI, shim, ["not here"])
    ).to.eventually.be.rejectedWith(ValueError);
  });

  test.it("groupRef", async () => {
    const shim = new CommandShim();
    const group = await getGroupRef(
      mock as unknown as PlatformAPI,
      shim,
      undefined,
      "Group 1"
    );
    expect(group).to.eql("00000000-0000-0000-0000-000000000001");
  });
});
