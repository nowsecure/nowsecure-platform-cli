/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  DEFAULT_API_URL,
  DEFAULT_LAB_API_URL,
  DEFAULT_LAB_UI_URL,
} from "@nowsecure/platform-lib/lib/platform-config";
import { expect, test } from "@oclif/test";
import { BaseCommand } from "../../src/utils";
import { resourcePath } from "../helpers/resource";
const envs = ["NS_CLI_TOKEN", "NS_CLI_GRAPHQL", "NS_CLI_REST", "NS_CLI_UI"];

const TOKEN = "testtoken";
const GRAPH = "http://gqlserver";
const REST = "http://restserver";
const UI = "uiServer";

class TestCommand extends BaseCommand {
  async run() {
    return await this.parseClient();
  }
}

describe("BaseCommand", () => {
  const testIniPath = resourcePath("test-config.ini");
  test.it(
    "platformConfig reads the specified ini file and profile",
    async () => {
      const { platformConfig: defaultProfile } = await TestCommand.run([
        "--config-file",
        testIniPath,
      ]);
      expect(defaultProfile.token).to.eql("authToken");
      expect(defaultProfile.apiUrl).to.eql("https://graphql.example.com");
      expect(defaultProfile.labApiUrl).to.eql("https://rest.example.com");
      expect(defaultProfile.labUrl).to.eql("https://ui.example.com");

      const { platformConfig: profile_1 } = await TestCommand.run([
        "--config-file",
        testIniPath,
        "--profile",
        "profile_1",
      ]);
      expect(profile_1.token).to.eql("anotherToken");
      expect(profile_1.apiUrl).to.eql(DEFAULT_API_URL);
      expect(profile_1.labApiUrl).to.eql(DEFAULT_LAB_API_URL);
      expect(profile_1.labUrl).to.eql(DEFAULT_LAB_UI_URL);

      const { platformConfig: profile_2 } = await TestCommand.run([
        "--config-file",
        testIniPath,
        "--profile",
        "profile_2",
      ]);
      expect(profile_2.token).to.eql("authToken_2");
      expect(profile_2.apiUrl).to.eql("https://graphql_2.example.com");
      expect(profile_2.labApiUrl).to.eql("https://rest_2.example.com");
      expect(profile_2.labUrl).to.eql("https://ui_2.example.com");
    }
  );

  test.it("platformConfig uses the correct environment variables", async () => {
    const originalEnv = envs.map((x) => process.env[x]);

    process.env["NS_CLI_TOKEN"] = TOKEN;
    process.env["NS_CLI_GRAPHQL"] = GRAPH;
    process.env["NS_CLI_REST"] = REST;
    process.env["NS_CLI_UI"] = UI;

    const { platformConfig: config, client } = await TestCommand.run([
      "--config-file",
      testIniPath,
    ]);

    expect(config.token).to.eql(TOKEN);
    expect(config.apiUrl).to.eql(GRAPH);
    expect(config.labApiUrl).to.eql(REST);
    expect(config.labUrl).to.eql(UI);

    expect(client.restURL("/test")).to.eql(REST + "/test");

    envs.forEach((env, index) => {
      const val = originalEnv[index];
      if (val === undefined) {
        delete process.env[env];
      } else {
        process.env[env] = val;
      }
    });
  });
});
