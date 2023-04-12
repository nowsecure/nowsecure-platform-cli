/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { ValueError } from "@nowsecure/platform-lib";
import { expect, test } from "@oclif/test";
import { ConfigFile } from "../../src/utils";
import { resourcePath } from "../helpers/resource";

describe("Config", () => {
  test.it("reads a config file", () => {
    const config = new ConfigFile(resourcePath("test-config.ini"), true);

    expect(config.str("default.token")).to.eql("authToken");

    expect(config.str("no-key-here")).to.eql(undefined);
    expect(config.bool("no-key-here")).to.eql(undefined);

    expect(config.str("no-key-here", "default")).to.eql("default");
    expect(config.bool("no-key-here", true)).to.eql(true);

    expect(() => config.bool("default.token")).to.throw(ValueError);
    expect(() => config.str("test.array")).to.throw(ValueError);
    expect(config.str("test.number")).to.eql("1");

    expect(config.hasSection("default")).to.eql(true);
    expect(config.hasSection("not_a_section")).to.eql(false);
    expect(config.hasSection("default.token")).to.eql(false);
  });
});
