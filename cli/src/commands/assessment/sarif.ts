/*
 * Copyright © 2023 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { promises as fsPromises } from "fs";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";
import { filterFlags, getFilter } from "../../utils/filters";
import { parseRef } from "../../utils/parsers";
import { convertToSarif } from "@nowsecure/sarif";
import { JSONObject, parseKeyConfig } from "@nowsecure/platform-lib";

export default class SarifReport extends BaseCommand {
  static description = "Create a SARIF report from an assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> 24891ee6-698e-4a55-bb27-adbfa4694787`,
  ];

  static args = {
    assessment: Args.string({
      required: true,
      description: "Source assessment reference",
    }),
  };

  static flags = {
    ...filterFlags,
    timeout: Flags.integer({
      min: 0,
      char: "t",
      summary: "Timeout in seconds to wait for the analysis to complete",
      default: 0,
    }),
    code: Flags.string({
      char: "c",
    }),
    output: Flags.string({
      char: "o",
      summary: "Write to a file, instead of STDOUT",
    }),
    fingerprint: Flags.boolean({
      allowNo: true,
      default: true,
    }),
    package: Flags.boolean({
      allowNo: true,
      default: true,
    }),
    platform: Flags.boolean({
      allowNo: true,
      default: true,
    }),
    "v1-key": Flags.string({}),
  };

  async run() {
    const { args, flags, platform } = await this.parseClient(SarifReport);
    const ref = await parseRef(args.assessment, this);
    const filter = getFilter(flags);
    const keyData: JSONObject = {
      fingerprint: flags.fingerprint,
      package: flags.package,
      platform: flags.platform,
    };
    if (flags["v1-key"]) {
      keyData["v1-key"] = flags["v1-key"];
    }
    const keyParams = parseKeyConfig(keyData);

    const assessment =
      flags.timeout === 0
        ? await platform.fetchAssessment(
            ref,
            {
              includeReport: true,
              includeState: false,
              includeConfig: false,
              includeDependencies: false,
              includeBuild: false,
            },
            filter
          )
        : await platform.pollForReport(
            args.assessment.toLowerCase(),
            {
              includeState: false,
              includeConfig: false,
              includeDependencies: false,
              includeBuild: false,
            },
            filter
          );

    if (!assessment) {
      this.error(`Cannot find assessment ${args.assessment}`);
    }

    const report = await convertToSarif(
      assessment,
      filter,
      flags.code,
      keyParams,
      flags.ui,
      (msg) => this.error(msg)
    );

    if (flags.output) {
      await fsPromises.writeFile(
        flags.output,
        JSON.stringify(report, null, 2),
        "utf-8"
      );
    } else {
      this.log(JSON.stringify(report, null, 2));
    }
    return report;
  }
}
