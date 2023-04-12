/*
 * Copyright © 2022 NowSecure Inc.
 *
 * SPDX-License-Identifier: MIT
 */

import * as fs from "fs";
import { homedir } from "os";
import * as ini from "ini";
import { get } from "lodash";
import * as path from "path";
import { ValueError } from "@nowsecure/platform-lib";

export class ConfigFile {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  protected values: Record<string, any> = {};

  constructor(configPath: string | undefined, throwIfNotFound: boolean) {
    if (!configPath) {
      return;
    }

    let iniVal;
    try {
      iniVal = fs.readFileSync(configPath, "utf-8");
    } catch (err) {
      if (throwIfNotFound) {
        throw err;
      }
      return;
    }
    try {
      this.values = ini.parse(iniVal);
    } catch (e) {
      console.error(`Cannot parse ${configPath}`);
      throw e;
    }
  }

  hasSection(path: string) {
    return typeof get(this.values, path, undefined) === "object";
  }

  str(path: string, defaultValue?: string): string | undefined {
    const ret = get(this.values, path, defaultValue);
    if (ret === undefined) {
      return ret;
    }
    if (typeof ret === "string" || typeof ret === "boolean") {
      return ret.toString();
    }
    throw new ValueError(`${ret} is not valid for ${path}`);
  }

  bool(path: string, defaultValue?: boolean): boolean | undefined {
    const ret = get(this.values, path, defaultValue);
    if (ret === undefined || typeof ret === "boolean") {
      return ret;
    }
    throw new ValueError(`${ret} is not valid for ${path}`);
  }

  save(filePath: string) {
    fs.writeFileSync(filePath, ini.stringify(this.values));
  }
}

export type ConfigValues = {
  token: string | undefined;
  graphql: string | undefined;
  rest: string | undefined;
  ui: string | undefined;
};

export type ConfigInput = {
  [P in keyof ConfigValues]: ConfigValues[P] | null;
};

export class CliConfigFile extends ConfigFile {
  configValues(profile?: string): ConfigValues {
    profile = profile || "default";
    return {
      token: this.str(`${profile}.token`),
      graphql: this.str(`${profile}.graphql`),
      rest: this.str(`${profile}.rest`),
      ui: this.str(`${profile}.ui`),
    };
  }

  static read(configPath?: string) {
    return new this(
      configPath || path.join(homedir(), ".nsclirc"),
      !!configPath
    );
  }

  static readProfile(configPath?: string, profile?: string) {
    return this.read(configPath).configValues(profile);
  }

  updateProfile(name: string, values: ConfigInput) {
    const update = (name: keyof ConfigValues) => {
      const value = values[name];
      if (value === null) {
        delete profile[name];
      } else if (value !== undefined) {
        profile[name] = value;
      }
    };

    const profile = this.values[name] || {};

    update("token");
    update("graphql");
    update("rest");
    update("ui");

    if (Object.keys(profile).length == 0) {
      delete this.values[name];
    } else {
      this.values[name] = profile;
    }
  }

  clearProfile(name: string) {
    this.updateProfile(name, {
      token: null,
      graphql: null,
      rest: null,
      ui: null,
    });
  }
}
