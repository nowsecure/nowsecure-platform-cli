/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs, { promises as fsPromises } from "fs";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils";
import { appRefArgs, appRefFlags, resolveAppRef } from "../../utils";
import { AppAnalysisConfig } from "@nowsecure/platform-lib/lib/types";
import { RequestConfig, RunnerType } from "@nowsecure/platform-lib";
import { outputAnalysisConfig } from "./config";
import ProgressBar from "progress";
import yaml from "yaml";

/**
 * fsPromises doesn't work with numeric file descriptors, so wrap the callback readFile in a promise
 */
function readFile(fdOrPath: fs.PathOrFileDescriptor) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(fdOrPath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export default class UpdateConfig extends BaseCommand {
  static description = "Update the application's analysis configuration";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static args = {
    ...appRefArgs,
    stdin: Args.string({
      f: "stdin",
      options: ["-"],
      required: false,
      description: "Read the configuration from stdin instead of a file",
    }),
  };

  static flags = {
    ...appRefFlags,
    reset: Flags.boolean({
      char: "r",
      exclusive: ["script-type", "script-file"],
    }),
    "script-type": Flags.string({
      char: "t",
      options: Object.values(RunnerType),
      description:
        "Set up a Javascript, Appium or XCTest script, or remove all scripts.",
    }),
    "script-file": Flags.string({
      char: "f",
      description: "Script file",
    }),
    config: Flags.string({
      char: "c",
      description: "JSON or YAML file containing the required updates",
    }),
    merge: Flags.boolean({
      char: "m",
      summary: "Merge search terms in the update file with the existing values",
      allowNo: true,
      default: false,
    }),
  };

  async run(): Promise<AppAnalysisConfig> {
    const argv = [...this.argv];
    const readStdin = argv[argv.length - 1] === "-";
    if (readStdin) {
      argv.pop();
    }

    const { args, flags, platform } = await this.parseClient(
      UpdateConfig,
      argv
    );

    const appRef = await resolveAppRef(platform, args, flags, this);

    const scriptType = flags["script-type"];
    const scriptFile = flags["script-file"];
    let requestConfig: RequestConfig | undefined = undefined;
    if (scriptType === RunnerType.None || scriptType === undefined) {
      if (scriptFile !== undefined) {
        this.error("Unexpected script file");
      }
    } else {
      if (!scriptFile) {
        this.error("Script file required");
      }
      if (!fs.existsSync(scriptFile)) {
        this.error(`${scriptFile} does not exist`);
      }

      const stats = await fsPromises.stat(scriptFile);
      if (!stats.isFile()) {
        this.error(`"${scriptFile}" is not a file`);
      }
      if (stats.size == 0) {
        this.error(`"${scriptFile}" is empty`);
      }
      if (scriptType !== RunnerType.JavaScript) {
        const progress = new ProgressBar("Uploading [:bar]", {
          width: 40,
          total: stats.size,
        });
        requestConfig = {
          onUploadProgress: (progressEvent) => {
            progress.tick(progressEvent.bytes);
          },
        };
      }
    }

    let configUpdate = undefined;
    if (readStdin || flags.config) {
      if (readStdin && flags.config) {
        this.error(
          "Specify either a config file or use '-' to read from stdin, not both."
        );
      }
      const source = flags.config || process.stdin.fd;
      const configText = await readFile(source);
      configUpdate = yaml.parse(configText);
    }

    if (flags.reset) {
      await platform.resetAnalysisConfig(appRef);
    } else {
      await platform.updateAnalysisConfig(
        appRef,
        scriptType as RunnerType | undefined,
        scriptFile,
        configUpdate,
        flags.merge,
        requestConfig
      );
    }

    return await outputAnalysisConfig(this, platform, appRef);
  }
}
