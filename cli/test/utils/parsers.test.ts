/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ValueError } from "@nowsecure/platform-lib";
import { expect, test } from "@oclif/test";
import {
  checkValidPackageId,
  flattenCommaSeparated,
  parseDateTime,
  parseRef,
  parseUuidLists,
} from "../../src/utils/parsers";
import { CommandShim } from "../helpers/command-shim";
import { PlatformEnum } from "@nowsecure/platform-lib/lib/types";

chai.use(chaiAsPromised);

describe("Parsers", () => {
  const upperUUID = "4C7F9517-12D0-408B-8854-EE0D17C95114";
  const lowerUUID = "32e5dc4e-60be-4e22-961c-0918a23aa27b";
  const invalidUUID = "not a uuid";
  const expected = [upperUUID.toLowerCase(), lowerUUID];

  test.it("flattenCommaSeparated", () => {
    expect(flattenCommaSeparated(undefined)).to.equal(undefined);
    expect(flattenCommaSeparated("1, 2, 3")).to.eql(["1", "2", "3"]);
    expect(flattenCommaSeparated(["1, 2, 3", "4"])).to.eql([
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  test.it("parseUuidLists", () => {
    const shim = new CommandShim();
    expect(parseUuidLists(`${upperUUID},${lowerUUID}`, shim)).to.eql(expected);
    expect(parseUuidLists([upperUUID, lowerUUID], shim)).to.eql(expected);

    expect(() => parseUuidLists(invalidUUID, shim)).to.throw(
      ValueError,
      invalidUUID
    );
    shim.reset();

    expect(() => parseUuidLists([invalidUUID], shim)).to.throw(
      ValueError,
      invalidUUID
    );
    shim.reset();
  });

  test.it("parseRef", async () => {
    async function succeeds(input: string) {
      const shim = new CommandShim();
      await expect(parseRef(input, shim)).to.eventually.eql(
        input.toLowerCase()
      );
    }
    async function fails(input: string) {
      const shim = new CommandShim();
      await expect(parseRef(input, shim)).to.eventually.be.rejectedWith(
        ValueError,
        input
      );
    }

    await succeeds(upperUUID);
    await succeeds(lowerUUID);

    await fails("32e5dc4e-60be-4e22-961c-0918a23aa27bc"); // too long
    await fails("32e5dc4e-60be-4e22-961c-0918a23aa27"); // too short
    await fails("X2e5dc4e-60be-4e22-961c-0918a23aa27b"); // not hex
    await fails("32e5-dc4e60be-4e22-961c-0918a23aa27b"); // wrong format
  });

  test.it("parseDateTime", async () => {
    async function succeeds(input: string, expected: string) {
      const shim = new CommandShim();
      await expect(parseDateTime(input, shim)).to.eventually.eql(expected);
    }

    async function fails(input: string) {
      const shim = new CommandShim();
      await expect(parseDateTime(input, shim)).to.eventually.be.rejectedWith(
        ValueError,
        input
      );
    }

    await succeeds("10 Jan 2000", new Date(2000, 0, 10, 0, 0, 0).toISOString());
    await succeeds(
      "10 Jan 2000 23:02",
      new Date(2000, 0, 10, 23, 2, 0).toISOString()
    );
    await fails("Not a date");
  });

  test.it("checkValidPackageId", () => {
    // Main validity tests are in the library. This simply checks that
    // context.error is called when isValidPackageID returns false.
    const shim = new CommandShim();

    expect(() => checkValidPackageId("*", PlatformEnum.Android, shim)).to.throw(
      ValueError,
      '"*"'
    );
    expect(() =>
      checkValidPackageId("com.example.app", PlatformEnum.Android, shim)
    ).to.not.throw();

    expect(() => checkValidPackageId("*", PlatformEnum.Ios, shim)).to.throw(
      ValueError,
      '"*"'
    );
    expect(() =>
      checkValidPackageId("com.example.app", PlatformEnum.Ios, shim)
    ).to.not.throw();
  });
});
