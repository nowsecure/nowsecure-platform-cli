/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import { AppResource, PlatformEnum } from "@nowsecure/platform-lib/lib/types";
import {
  BaseCommand,
  checkValidPackageId,
  getGroupRef,
  groupFlags,
  packageArgsRequired,
} from "../../utils";

export default class CreateAppResource extends BaseCommand {
  static description = "Create an app resource without a binary";

  static examples = [
    `<%= config.bin %> <%= command.id %> android com.example.package --group "My group"`,
  ];

  static args = { ...packageArgsRequired };
  static flags = { ...groupFlags };

  async run(): Promise<AppResource> {
    const {
      args,
      flags,
      platform: platformAPI,
    } = await this.parseClient(CreateAppResource);

    const { platform: plat, packageName } = args;
    const platform = plat as PlatformEnum;
    let groupName = flags.group;
    let groupRef = await getGroupRef(
      platformAPI,
      this,
      flags["group-ref"],
      flags.group
    );

    // Ensure the package name is valid for the platform
    checkValidPackageId(packageName, platform, this);

    // If the group is not specified, check that the user is a member
    // of exactly one group & use that one.
    if (!groupRef) {
      const groupList = await platformAPI.userGroups();
      if (groupList.length !== 1) {
        this.error("Group must be specified");
      }
      groupRef = groupList[0].ref;
      groupName = groupList[0].name;
    }

    // Fail if the app already exists in the group
    const existingApps = await platformAPI.listApplications({
      platformTypes: plat as PlatformEnum,
      packageKeys: packageName,
      groupRefs: groupRef,
    });
    if (existingApps.length > 0) {
      const groupText = groupName ? `"${groupName}"` : groupRef;
      this.error(
        `${plat} application "${packageName}" already exists in group ${groupText}`
      );
    }

    const response = await platformAPI.createApp(
      platform,
      packageName,
      groupRef
    );
    this.log("App Resource created");
    this.log(JSON.stringify(response, null, 2));
    return response;
  }
}
