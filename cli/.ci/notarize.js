#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { notarize } = require("@electron/notarize");

const APPLEID = process.env.APPLEID;
const APPLEID_TEAM = process.env.APPLEID_TEAM;
const APPLEID_PASSWORD = process.env.APPLEID_PASSWORD;

async function processOne(fileName) {
  const fullPath = path.normalize(path.resolve(fileName));
  console.log(`Notarizing ${fullPath}`);
  await notarize({
    tool: "notarytool",
    appPath: fullPath,
    appleId: APPLEID,
    appleIdPassword: APPLEID_PASSWORD,
    teamId: APPLEID_TEAM,
  });
  console.log(`${fullPath} completed`);
}

async function processAll() {
  const files = process.argv.slice(2);

  if (!APPLEID) {
    console.log("No Apple ID specified, skipping");
    return;
  }

  if (!(APPLEID_PASSWORD && APPLEID_TEAM)) {
    console.error("APPLEID_PASSWORD and APPLEID_TEAM are required");
    process.exit(1);
  }

  const promises = [];
  for (const file of files) {
    const stat = fs.statSync(file);
    if (stat.isFile()) {
      promises.push(processOne(file));
    }
  }

  if (promises.length === 0) {
    console.log("No files found");
  } else {
    await Promise.all(promises);
  }
}

Promise.resolve().then(processAll);
