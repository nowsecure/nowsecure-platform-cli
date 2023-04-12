/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { CancelAssessmentResponse } from "@nowsecure/platform-lib/lib/types";
import { Args } from "@oclif/core";
import { BaseCommand } from "../../utils/base-command";

export default class CancelAssessment extends BaseCommand {
  static description = "Cancel a running assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> 244ed89a-a99c-1fec-b95d-1be1c0238cb4`,
  ];

  static args = {
    assessment: Args.string({
      description: "Reference of the assessment to cancel",
      required: true,
    }),
  };

  async run(): Promise<CancelAssessmentResponse> {
    const { args, platform } = await this.parseClient(CancelAssessment);
    const ret = await platform.cancelAssessment(args.assessment);
    this.log(`Assessment ${args.assessment} status: ${ret.status}`);
    return ret;
  }
}
