/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { Args } from "@oclif/core";
import { JSONObject } from "@nowsecure/platform-lib";
import { BaseCommand } from "../../utils/base-command";

export default class RawAssessmentData extends BaseCommand {
  static description = "Get the raw data for an assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> 24891ee6-698e-4a55-bb27-adbfa4694787`,
  ];

  static args = {
    assessment: Args.string({
      name: "assessment",
      required: true,
      description: "Reference of the assessment",
    }),
  };

  async run(): Promise<JSONObject> {
    const { args, platform } = await this.parseClient(RawAssessmentData);
    const raw = await platform.rawAssessmentData(args.assessment);
    if (Object.keys(raw || {}).length == 0) {
      this.error(`Assessment ${args.assessment} not found`);
    }

    this.log(JSON.stringify(raw, null, 2));
    return raw;
  }
}
