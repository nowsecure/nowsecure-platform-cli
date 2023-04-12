/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Command, Flags } from "@oclif/core";
import {
  OutputFlags,
  ParserOutput,
  FlagOutput,
  ArgOutput,
  Input,
} from "@oclif/core/lib/interfaces/parser";

import {
  Platform,
  PlatformAPI,
  NSClientOptions,
  NowSecureClient,
  PlatformConfig,
} from "@nowsecure/platform-lib";

import { Column, outputFields, outputTable } from "./table";
import { CliConfigFile } from "./config";

import fs from "fs";
import { CommandCore } from "./command-core";
import { version, commit } from "../version";
import { CommandError } from "@oclif/core/lib/interfaces";

import { type AxiosError } from "axios";

const USER_AGENT = `NowSecure CLI ${version} (${commit})`;

export const CommonFlags = {
  token: Flags.string({
    summary: "Platform API token",
    required: false,
    env: "NS_CLI_TOKEN",
    helpGroup: "GLOBAL",
  }),
  graphql: Flags.string({
    summary: "URL of the graphql server",
    required: false,
    env: "NS_CLI_GRAPHQL",
    helpGroup: "GLOBAL",
  }),
  rest: Flags.string({
    summary: "URL of the REST server",
    required: false,
    env: "NS_CLI_REST",
    helpGroup: "GLOBAL",
  }),
  ui: Flags.string({
    summary: "URL of the UI server",
    required: false,
    env: "NS_CLI_UI",
    helpGroup: "GLOBAL",
  }),
  profile: Flags.string({
    summary: "Profile to read from ~/.nsclirc",
    required: false,
    env: "NS_CLI_PROFILE",
    helpGroup: "GLOBAL",
  }),
  "config-file": Flags.string({
    summary: "Path to the config file",
    required: false,
    env: "NS_CLI_CONFIG_FILE",
    helpGroup: "GLOBAL",
  }),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ParserOutputAndClient<
  TFlags extends OutputFlags<any> = any,
  GFlags extends OutputFlags<any> = any,
  TArgs extends OutputFlags<any> = any
> = ParserOutput<TFlags, GFlags, TArgs> & {
  platform: PlatformAPI;
  platformConfig: PlatformConfig;
  client: NowSecureClient;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export abstract class BaseCommand extends Command {
  static baseFlags = CommonFlags;
  public static enableJsonFlag = true;

  static platformConfig(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    flags: { [index: string]: any },
    context: CommandCore
  ): PlatformConfig {
    const configPath = flags["config-file"] || "";
    if (configPath) {
      if (!(fs.existsSync(configPath) && fs.statSync(configPath).isFile())) {
        context.error(`Cannot open configuration file "${configPath}"`);
      }
    }
    const values = CliConfigFile.readProfile(configPath, flags.profile);
    const token = flags.token || values.token;
    if (!token) {
      context.error("Platform token required");
    }
    return new PlatformConfig(
      token,
      flags.graphql || values.graphql,
      flags.rest || values.rest,
      flags.ui || values.ui
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  protected async parseClient<
    F extends FlagOutput,
    G extends FlagOutput,
    A extends ArgOutput
  >(
    options?: Input<F, G, A>,
    argv?: string[]
  ): Promise<ParserOutputAndClient<F, G, A>> {
    const parseResult = await this.parse(options, argv);
    const platformConfig = BaseCommand.platformConfig(parseResult.flags, this);
    const clientOptions: NSClientOptions = { userAgent: USER_AGENT };
    const client = new NowSecureClient(platformConfig, clientOptions);
    const ret: any = {
      ...parseResult,
      client,
      platformConfig,
      platform: new Platform(client),
    };
    return ret;
  }

  async catch(error: CommandError) {
    if (error.name === "AxiosError") {
      let serverMessage = "";
      const serverError = error as AxiosError;
      if (serverError.response?.status || 0 >= 400) {
        const serverData = serverError.response?.data;
        if (typeof serverData === "object") {
          try {
            serverMessage = JSON.stringify(serverData, null, 2);
          } catch (e) {
            serverMessage = "" + serverData;
          }
        } else if (serverData !== undefined) {
          serverMessage = "" + serverData;
        }
      }
      this.error(
        serverMessage
          ? error.message + "\nServer message: " + serverMessage
          : error.message
      );
    }
    throw error;
  }

  /* eslint-enable @typescript-eslint/no-explicit-any */

  outputTable<T>(iter: Iterable<T>, columns: Column<T>[], prefix = "") {
    outputTable(iter, columns, (x) => this.log(x), prefix);
  }

  outputFields<T>(item: T, fields: Column<T>[], prefix = "") {
    outputFields(item, fields, (x) => this.log(x), prefix);
  }

  errorTable<T>(iter: Iterable<T>, columns: Column<T>[], prefix = "") {
    outputTable(iter, columns, (x) => this.error(x, { exit: false }), prefix);
  }
}
