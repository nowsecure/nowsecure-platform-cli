/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import fs, { promises as fsPromises } from "fs";
import ProgressBar from "progress";
import { Args } from "@oclif/core";
import { RequestConfig } from "@nowsecure/platform-lib";
import { UploadApplicationResponse } from "@nowsecure/platform-lib/lib/types";

import { BaseCommand, getGroupRef, groupFlags } from "../../utils";

export default class UploadBinary extends BaseCommand {
  static description = "Upload an application binary";

  static examples = [`<%= config.bin %> <%= command.id %> my_application.apk`];

  static flags = groupFlags;

  static args = {
    binary: Args.string({
      name: "binary",
      required: true,
      description: "file to send to Platform",
    }),
  };

  async run(): Promise<UploadApplicationResponse> {
    const { args, flags, platform } = await this.parseClient(UploadBinary);
    const groupRef = await getGroupRef(
      platform,
      this,
      flags["group-ref"],
      flags.group
    );
    const { size: fileSize } = await fsPromises.stat(args.binary);
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
    const ret = await platform.uploadBinary(stream, groupRef, config);
    this.log(`Uploaded ${ret.platform} package "${ret.package}"`);
    return ret;
  }
}
