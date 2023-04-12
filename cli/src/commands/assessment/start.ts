/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  PlatformEnum,
  StartAssessmentResponse,
} from "@nowsecure/platform-lib/lib/types";
import { Flags } from "@oclif/core";
import { appRefArgs, appRefFlags } from "../../utils/app-ref";
import { BaseCommand } from "../../utils/base-command";
import { getGroupRef } from "../../utils/group-list";

export default class StartAssessment extends BaseCommand {
  static description = "Start an assessment";

  static examples = [
    `<%= config.bin %> <%= command.id %> android com.example.package --group "My group" --app-store`,
    `<%= config.bin %> <%= command.id %> --app=d296eaea-f714-4e2d-8930-023b3f2bb12a`,
  ];

  static args = { ...appRefArgs };

  static flags = {
    ...appRefFlags,
    "app-store": Flags.boolean({
      required: false,
      char: "s",
    }),
  };

  async run(): Promise<StartAssessmentResponse> {
    const {
      args,
      flags,
      platform: platformAPI,
    } = await this.parseClient(StartAssessment);

    let { platform, packageName } = args;
    let groupRef: string | undefined;

    if (flags.ref) {
      if (platform || packageName || flags.group || flags["group-ref"]) {
        this.error(
          "Specify either a platform, package and group or an application reference"
        );
      }
      const apps = await platformAPI.listApplications({ refs: flags.ref });
      if (apps.length !== 1) {
        this.error(`Cannot find application reference ${flags.ref}`);
      }
      platform = apps[0].platformType;
      packageName = apps[0].packageKey;
      groupRef = apps[0].group.ref;
    } else {
      if (!(platform && packageName)) {
        this.error("Platform and package name required");
      }
      groupRef = await getGroupRef(
        platformAPI,
        this,
        flags["group-ref"],
        flags.group
      );
      if (!groupRef) {
        this.error("No group specified");
      }
    }

    const response = await platformAPI.startAssessment(
      platform as PlatformEnum,
      packageName,
      groupRef,
      !!flags["app-store"]
    );
    this.log(`Assessment ${response.ref} started`);
    return response;
  }
}
