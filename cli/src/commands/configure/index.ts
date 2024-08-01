import { Command, Flags } from "@oclif/core";
import fs from "fs";
import os from "os";
import path from "path";
import { checkJWT, CliConfigFile, ConfigInput } from "../../utils";
import inquirer, { DistinctQuestion } from "inquirer";

function configPath(input: string | undefined) {
  input = (input || "").trim() || path.join(os.homedir(), ".nsclirc");
  if (input === "~") {
    return os.homedir();
  }
  if (input.startsWith("~" + path.sep)) {
    return path.join(os.homedir(), input.substring(2));
  }
  return input;
}

function checkUrl(test: string) {
  if (!(test.startsWith("http://") || test.startsWith("https://"))) {
    return false;
  }
  try {
    new URL(test);
    return true;
  } catch (e) {
    return false;
  }
}

export default class Configure extends Command {
  static strict = false;

  static flags = {
    yes: Flags.boolean({
      char: "y",
      summary:
        "Do not prompt for confirmation when overwriting an existing profile",
      exclusive: ["no"],
    }),
    no: Flags.boolean({
      char: "n",
      summary: "Abort if an existing profile would be overwritten",
      exclusive: ["yes"],
    }),
    clear: Flags.boolean({
      char: "c",
      summary: "Remove the profile from the configuration file ",
    }),
    token: Flags.string({
      summary: "Platform API token",
      required: false,
    }),
    graphql: Flags.string({
      summary: "URL of the graphql server",
      required: false,
    }),
    rest: Flags.string({
      summary: "URL of the REST server",
      required: false,
    }),
    ui: Flags.string({
      summary: "URL of the UI server",
      required: false,
    }),
    profile: Flags.string({
      summary: "Name of the profile",
      required: false,
    }),
    "config-file": Flags.string({
      summary: "Path to the config file",
      required: false,
    }),
  };

  private getConfigFile(fullPath: string, mustExist: boolean) {
    if (!fs.existsSync(fullPath)) {
      if (mustExist) {
        this.error(`${fullPath} does not exist`);
      }
      return new CliConfigFile("", false);
    }

    if (!fs.statSync(fullPath).isFile()) {
      this.error(`Cannot open ${fullPath}`);
    }

    return new CliConfigFile(fullPath, true);
  }

  private async checkConfirmation(
    flags: { yes?: boolean; no?: boolean },
    prompt: string
  ) {
    if (flags.yes || flags.no) {
      return !flags.no;
    }

    const question: DistinctQuestion = {
      name: "confirm",
      type: "confirm",
      default: false,
      message: prompt,
    };
    const { confirm } = await inquirer.prompt(question);
    if (!confirm) {
      this.log("Cancelled");
      this.exit(1);
    }
  }

  async getToken(flag: string | undefined, existing: string | undefined) {
    if (flag) {
      return flag.toLowerCase() == "none" ? null : flag;
    }

    const question: DistinctQuestion = {
      name: "token",
      transformer: (input: string) => "".padStart(input.length, "*"),
      default: existing ? "Current value" : "None",
      message: existing
        ? 'Platform API token ("None" to remove)'
        : "Platform API token",
    };
    const { token } = await inquirer.prompt(question);
    switch (token.trim().toLowerCase()) {
      case "none":
        return null;
      case "current value":
        return existing;
      default:
        if (!checkJWT(token)) {
          this.error("Not a valid token");
        }
        return token;
    }
  }

  async getUrl(
    flag: string | undefined,
    existing: string | undefined,
    existingPrompt: string,
    noExistingPrompt: string
  ) {
    if (flag) {
      return flag.toLowerCase() == "none" ? null : flag;
    }
    const question: DistinctQuestion = {
      name: "url",
      message: existing ? existingPrompt : noExistingPrompt,
      default: existing || "None",
    };
    const { url } = await inquirer.prompt(question);
    if (url.toLowerCase() === "none") {
      return null;
    }
    if (!checkUrl(url)) {
      this.error(`${url} is not a valid URL`);
    }
    return url;
  }

  getGraphql(flag: string | undefined, existing: string | undefined) {
    return this.getUrl(
      flag,
      existing,
      'Graphql endpoint ("None" to use the default server)',
      "Graphql endpoint"
    );
  }

  getRest(flag: string | undefined, existing: string | undefined) {
    return this.getUrl(
      flag,
      existing,
      'REST endpoint ("None" to use the default server)',
      "REST endpoint"
    );
  }

  getUI(flag: string | undefined, existing: string | undefined) {
    return this.getUrl(
      flag,
      existing,
      'UI server ("None" to use the default server)',
      "UI server"
    );
  }

  async getProfile(flag: string | undefined) {
    if (flag) {
      return flag;
    }
    const { profile } = await inquirer.prompt({
      name: "profile",
      default: "default",
      message: "Profile",
    });
    return profile;
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Configure);

    const fullPath = path.normalize(configPath(flags["config-file"]));
    const config = this.getConfigFile(fullPath, flags.clear);

    const profileName = await this.getProfile(flags.profile);

    if (flags.clear) {
      if (!config.hasSection(profileName)) {
        this.log(`No profile "${profileName}" in ${fullPath}`);
      } else {
        const prompt = `Clear profile "${profileName}"`;
        await this.checkConfirmation(flags, prompt);
        config.clearProfile(profileName);
      }
    } else {
      if (config.hasSection(profileName)) {
        const prompt = `Overwrite existing profile "${profileName}"`;
        await this.checkConfirmation(flags, prompt);
      }

      const current = config.configValues(profileName);
      const token = await this.getToken(flags.token, current.token);
      const graphql = await this.getGraphql(flags.graphql, current.graphql);
      const rest = await this.getRest(flags.rest, current.rest);
      const ui = await this.getUI(flags.ui, current.ui);
      const options: ConfigInput = { token, graphql, rest, ui };
      config.updateProfile(profileName, options);
    }

    config.save(fullPath);
  }
}
