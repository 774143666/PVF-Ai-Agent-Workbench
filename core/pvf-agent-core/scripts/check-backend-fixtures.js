"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { loadWorkspaceProfiles, resolveProfile } = require("../lib/workspace-profiles");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const rootArgIndex = rawArgs.indexOf("--root");
const workbenchRoot =
  rootArgIndex >= 0 && rawArgs[rootArgIndex + 1]
    ? path.resolve(rawArgs[rootArgIndex + 1])
    : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => !(item === "--root" || rawArgs[index - 1] === "--root"));
const command = args[0] || "check";

function usage() {
  return `Usage:
  workbench.bat fixture-check check [--profile <name> | --all-profiles] [--fixture <fixture.json>] [--out <dir>]
`;
}

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function flag(name) {
  return args.includes(name);
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function safeName(value) {
  return String(value || "item")
    .replace(/^[A-Za-z]:[\\/]/, "")
    .replace(/[\\/:\s]+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "item";
}

function parseJsonOutput(stdout) {
  try {
    return JSON.parse(String(stdout || "").trim());
  } catch {
    return null;
  }
}

function selectProfiles() {
  const registry = loadWorkspaceProfiles(workbenchRoot);
  const requested = option("--profile");
  if (requested) {
    return [resolveProfile(workbenchRoot, requested)];
  }
  if (flag("--all-profiles")) {
    return registry.profiles.filter((profile) => profile.enabled === true);
  }
  if (registry.activeProfile) {
    return [resolveProfile(workbenchRoot, registry.activeProfile)];
  }
  return registry.profiles.filter((profile) => profile.enabled === true);
}

function discoverFixtures() {
  const requested = option("--fixture");
  if (requested) {
    return [path.resolve(workbenchRoot, requested)];
  }
  const fixturesDir = path.join(workbenchRoot, "core", "pvf-agent-core", "contracts", "fixtures");
  return fs
    .readdirSync(fixturesDir)
    .filter((name) => name.endsWith(".fixture.json"))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(fixturesDir, name));
}

function fixtureInfo(file) {
  const fixture = readJson(file);
  return {
    file,
    fixtureId: fixture.fixtureId || path.basename(file, ".fixture.json"),
    description: fixture.description || null,
  };
}

function runContract(profile, fixture, outDir) {
  const script = path.join(workbenchRoot, "core", "pvf-agent-core", "cli", "pvf-backend-contract.js");
  const result = childProcess.spawnSync(
    process.execPath,
    [
      script,
      "--root",
      workbenchRoot,
      "check",
      "--profile",
      profile.name,
      "--fixture",
      fixture.file,
      "--out",
      outDir,
    ],
    {
      cwd: workbenchRoot,
      encoding: "utf8",
      timeout: 300000,
    },
  );
  const parsed = parseJsonOutput(result.stdout);
  const ok = result.status === 0 && parsed?.summary?.ok === true;
  return {
    ok,
    exitCode: result.status,
    signal: result.signal || null,
    reportPath: parsed?.reportPath || null,
    summary: parsed?.summary || null,
    stdoutTail: ok ? undefined : String(result.stdout || "").slice(-2000),
    stderr: result.stderr || undefined,
  };
}

function runCheck() {
  const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "backend-fixture-runs", timestamp())));
  fs.mkdirSync(outRoot, { recursive: true });

  const profiles = selectProfiles();
  const fixtures = discoverFixtures().map(fixtureInfo);
  const errors = [];
  const runs = [];

  if (profiles.length === 0) {
    errors.push("No enabled/selected workspace profiles were found.");
  }
  if (fixtures.length === 0) {
    errors.push("No backend fixture files were found.");
  }

  for (const profile of profiles) {
    for (const fixture of fixtures) {
      const runOut = path.join(outRoot, "contracts", safeName(profile.name), safeName(fixture.fixtureId));
      const result = runContract(profile, fixture, runOut);
      if (!result.ok) {
        errors.push(`Backend fixture failed: profile=${profile.name}, fixture=${fixture.fixtureId}`);
      }
      runs.push({
        profile: profile.name,
        fixtureId: fixture.fixtureId,
        fixtureFile: fixture.file,
        ok: result.ok,
        exitCode: result.exitCode,
        reportPath: result.reportPath,
        summary: result.summary,
        stderr: result.stderr,
        stdoutTail: result.stdoutTail,
      });
    }
  }

  const failed = runs.filter((run) => !run.ok).length;
  const reportPath = path.join(outRoot, "BACKEND-FIXTURES-CHECK-REPORT.json");
  const report = {
    schemaVersion: "1.0",
    phase: "phase-4-backend-fixture-suite",
    generatedAt: new Date().toISOString(),
    workbenchRoot,
    outRoot,
    reportPath,
    dryRunOnly: true,
    includeWriteSmoke: false,
    summary: {
      ok: errors.length === 0 && failed === 0,
      profileCount: profiles.length,
      fixtureCount: fixtures.length,
      runCount: runs.length,
      passed: runs.length - failed,
      failed,
      errorCount: errors.length,
    },
    profiles: profiles.map((profile) => ({
      name: profile.name,
      sourcePvf: profile.sourcePvf,
    })),
    fixtures: fixtures.map((fixture) => ({
      fixtureId: fixture.fixtureId,
      fixtureFile: fixture.file,
      description: fixture.description,
    })),
    runs,
    errors,
  };
  writeJson(reportPath, report);
  output(report);
  if (!report.summary.ok) {
    process.exitCode = 1;
  }
}

function main() {
  if (command === "help" || command === "--help") {
    process.stdout.write(usage());
    return;
  }
  if (command === "check") {
    runCheck();
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error && error.stack ? error.stack : String(error)}\n`);
  process.exitCode = 1;
}
