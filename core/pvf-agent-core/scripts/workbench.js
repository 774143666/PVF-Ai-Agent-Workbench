"use strict";

const childProcess = require("child_process");
const path = require("path");

const rawArgs = process.argv.slice(2);
const rootIndex = rawArgs.indexOf("--root");
const workbenchRoot = rootIndex >= 0 ? path.resolve(rawArgs[rootIndex + 1]) : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => item !== "--root" && rawArgs[index - 1] !== "--root");
const command = String(args[0] || "help").toLowerCase();
const commandArgs = args.slice(1);

const commands = {
  check: "core/pvf-agent-core/scripts/check-env.js",
  "knowledge-check": "core/pvf-agent-core/scripts/check-knowledge-pack.js",
  "real-task-check": "core/pvf-agent-core/scripts/check-real-task-runs.js",
  "fixture-check": "core/pvf-agent-core/scripts/check-backend-fixtures.js",
  profile: "core/pvf-agent-core/scripts/workbench-profile.js",
  absorb: "core/pvf-agent-core/scripts/runtime-absorb-checklist.js",
  "pvf-read": "core/pvf-agent-core/cli/pvf-readonly.js",
  "pvf-index": "core/pvf-agent-core/cli/pvf-index.js",
  "pvf-change": "core/pvf-agent-core/cli/pvf-change-set.js",
  "backend-contract": "core/pvf-agent-core/cli/pvf-backend-contract.js",
  doctor: "core/pvf-agent-core/scripts/workbench-doctor.js",
  eval: "core/pvf-agent-core/scripts/agent-eval.js",
  skill: "core/pvf-agent-core/scripts/install-agent-skill.js",
};

function help() {
  return `PVF-Agent-Workbench 0.5 command entry

Usage:
  workbench.bat <command> [arguments]

Everyday:
  check                 Validate the local Workbench environment
  profile               Manage machine-local PVF paths
  pvf-read              Inspect PVF content through the read-only lane
  pvf-index             Build or query a local read-only index
  pvf-change            Validate, dry-run, or apply a controlled change set
  skill                 Validate or install the Agent Skill adapter
  doctor                Run integrated Workbench checks

Maintenance:
  knowledge-check       Validate the clean knowledge pack
  eval                  Run deterministic Agent evaluations
  absorb                Create a runtime absorption checklist
  backend-contract      Run the PVF backend contract
  fixture-check         Check backend fixtures
  real-task-check       Check recorded real-task runs
  release gate1         Validate the portable package manifest
  release gate2         Copy and hash-check an independent stage
  release gate3         Run the no-PVF cold-start gate
  release all           Run gate1, gate2, then gate3

Advanced compatibility wrappers remain under commands\.
`;
}

function runScript(relativeScript, forwardedArgs) {
  const script = path.join(workbenchRoot, relativeScript);
  const result = childProcess.spawnSync(process.execPath, [script, "--root", workbenchRoot, ...forwardedArgs], {
    cwd: workbenchRoot,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  return Number.isInteger(result.status) ? result.status : 1;
}

function runRelease(releaseArgs) {
  const gate = String(releaseArgs[0] || "").toLowerCase();
  const forwarded = releaseArgs.slice(1);
  const scripts = {
    gate1: "core/pvf-agent-core/scripts/portable-package-dry-run.js",
    gate2: "core/pvf-agent-core/scripts/portable-stage-copy-dry-run.js",
    gate3: "core/pvf-agent-core/scripts/portable-cold-start-dry-run.js",
  };
  if (gate === "all") {
    if (forwarded.length > 0) throw new Error("release all does not accept additional arguments; run individual gates when --out is needed.");
    for (const id of ["gate1", "gate2", "gate3"]) {
      const status = runScript(scripts[id], ["check"]);
      if (status !== 0) return status;
    }
    return 0;
  }
  if (!scripts[gate]) throw new Error("Usage: workbench.bat release <gate1|gate2|gate3|all> [arguments]");
  return runScript(scripts[gate], ["check", ...forwarded]);
}

try {
  if (command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(help());
  } else if (command === "release") {
    process.exitCode = runRelease(commandArgs);
  } else if (commands[command]) {
    process.exitCode = runScript(commands[command], commandArgs);
  } else {
    process.stderr.write(`Unknown command: ${command}\n\n${help()}`);
    process.exitCode = 1;
  }
} catch (error) {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
}
