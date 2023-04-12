/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { expect, test } from "@oclif/test";
import {
  BaseCommand,
  FilterFlags,
  filterFlags,
  getFilter,
} from "../../src/utils";

chai.use(chaiAsPromised);

class FilterFlagsCommand extends BaseCommand {
  static flags = filterFlags;

  async run() {
    const { flags } = await this.parse();
    return flags as FilterFlags;
  }
}

async function filter(args: string[] = []) {
  const flags = await FilterFlagsCommand.run(args);
  return getFilter(flags);
}

describe("Filter flags", () => {
  test.it("all-findings", async () => {
    await expect(filter(["--all-findings"])).to.eventually.eql(undefined);
    await expect(filter(["--all-findings", "-m", "high"])).to.eventually.be
      .rejected;
    await expect(filter(["--all-findings", "-i", "one"])).to.eventually.be
      .rejected;
    await expect(filter(["--all-findings", "-e", "two"])).to.eventually.be
      .rejected;
  });

  test.it("levels", async () => {
    async function levelCheck(level: string, expected: string[]) {
      const f = await filter(["--min-severity", level]);
      expect(f?.severityFilter).to.eql(expected);
    }

    await levelCheck("c", ["critical"]);
    await levelCheck("critical", ["critical"]);
    await levelCheck("h", ["critical", "high"]);
    await levelCheck("high", ["critical", "high"]);
    await levelCheck("m", ["critical", "high", "medium"]);
    await levelCheck("medium", ["critical", "high", "medium"]);
    await levelCheck("l", ["critical", "high", "medium", "low"]);
    await levelCheck("low", ["critical", "high", "medium", "low"]);
    await levelCheck("i", ["critical", "high", "medium", "low", "info"]);
    await levelCheck("info", ["critical", "high", "medium", "low", "info"]);
  });

  test.it("other flags", async () => {
    const f = await filter([
      "-i",
      "one,two",
      "--include",
      "three",
      "-e",
      "four, five",
      "--exclude",
      "six",
      "--warnings",
    ]);
    expect(f?.includeWarnings).to.eql(true);
    expect(f?.includeChecks).to.eql(["one", "two", "three"]);
    expect(f?.excludeChecks).to.eql(["four", "five", "six"]);
  });
});
