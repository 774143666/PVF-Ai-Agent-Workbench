"use strict";

const path = require("path");
const {
  installSkill,
  selfTest,
  skillStatus,
  validateBundledSkill,
} = require("../lib/agent-skill");

const rawArgs = process.argv.slice(2);
const rootIndex = rawArgs.indexOf("--root");
const workbenchRoot = rootIndex >= 0 ? path.resolve(rawArgs[rootIndex + 1]) : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => item !== "--root" && rawArgs[index - 1] !== "--root");
const command = args[0] || "status";

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function main() {
  const client = option("--client", "codex");
  const targetRoot = option("--target", null);
  if (command === "validate") {
    const result = validateBundledSkill(workbenchRoot);
    output(result);
    if (!result.ok) process.exitCode = 1;
    return;
  }
  if (command === "status") {
    const result = skillStatus(workbenchRoot, { client, targetRoot });
    output(result);
    if (!result.ok) process.exitCode = 1;
    return;
  }
  if (command === "install") {
    output(installSkill(workbenchRoot, { client, targetRoot, force: args.includes("--force") }));
    return;
  }
  if (command === "self-test") {
    const result = selfTest(workbenchRoot);
    output(result);
    if (!result.summary.ok) process.exitCode = 1;
    return;
  }
  throw new Error("Usage: workbench.bat skill <validate|status|install|self-test> [--client codex|agents] [--target <skills-directory>] [--force]");
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
}
