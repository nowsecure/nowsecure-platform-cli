const fs = require("fs");
const path = require("path");

const DIRS = [".", "lib", "github-snapshot", "sarif", "cli"];

const load = (dir) =>
  JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));

const save = (dir, pkg) =>
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, 0, 2));

const VERSION = process.env["CLI_VERSION"];
const SIGNING_ID = process.env["SIGNING_ID"];
const SEMVER = VERSION.startsWith("v") ? VERSION.substring(1) : VERSION;

if (SEMVER) {
  for (const dir of DIRS) {
    const pkg = load(dir);
    pkg.version = SEMVER;
    save(dir, pkg);
  }
}

if (SIGNING_ID) {
  const cli = load("cli");
  cli.oclif.macos.sign = SIGNING_ID;
  save("cli", cli);
}
