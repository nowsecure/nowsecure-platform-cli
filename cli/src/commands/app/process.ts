/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import * as fs from "fs";
import { Args, Flags } from "@oclif/core";
import { ProcessApplicationResponse } from "@nowsecure/platform-lib/lib/types";
import { getGroupRef, BaseCommand, groupFlags } from "../../utils";
import ProgressBar from "progress";
import { AnalysisType, RequestConfig } from "@nowsecure/platform-lib";

export default class ProcessBinary extends BaseCommand {
  static summary = "Upload and analyze an application binary";

  static examples = [`<%= config.bin %> <%= command.id %> my_application.apk`];

  static flags = {
    ...groupFlags,
    "set-version": Flags.string({
      char: "v",
      summary: "Set the version of the uploaded binary.",
      description: `Attached a custom version string to the uploaded build,
overriding the version string contained in the package file.

The custom string will be displayed in the "Version" column of the application list in Platform.`
    }),
    "analysis-type": Flags.string({
      char: "t",
      summary: "The type of analysis to perform.",
      description: `"static": Perform a static analysis only.
"dependencies": Analyze the application's library dependencies.
"full": Run a complete assessment including dynamic analysis.

If the flag is not specified a full analysis will be run.

Static-only and dependency-only analyses do not attempt to decrypt encrypted binaries as 
these analyses are intended to provide a rapid result for e.g. a CI/CD pipeline. An encrypted
binary will fail to analyze.

Please note: 
The assessment status on NowSecure Platform UI does not reflect successful completion of
static-only or dependencies-only analysis. The labels in the UI will be "Partial Results"
and "Failed Dynamic Analysis" due to the lack of a dynamic analysis.`,
      options: Object.values(AnalysisType),
    }),
  };
  static args = {
    binary: Args.string({
      required: true,
      description: "file to send to Platform",
    }),
  };

  async run(): Promise<ProcessApplicationResponse> {
    const { args, flags, platform } = await this.parseClient(ProcessBinary);
    const groupRef = await getGroupRef(
      platform,
      this,
      flags["group-ref"],
      flags.group
    );
    const fileSize = fs.lstatSync(args.binary).size;
    const progress = new ProgressBar("Uploading [:bar]", {
      width: 40,
      total: fileSize,
    });
    const stream = fs.createReadStream(args.binary);
    const config: RequestConfig = {
      onUploadProgress: (progressEvent) => {
        progress.tick(progressEvent.bytes);
      },
    };
    const ret = await platform.processBinary(
      stream,
      groupRef,
      flags["set-version"],
      flags["analysis-type"] as AnalysisType | undefined,
      config
    );
    this.log(
      `Uploaded ${ret.platform} package "${ret.package}"\nStarted assessment ${ret.ref}`
    );
    return ret;
  }
}
