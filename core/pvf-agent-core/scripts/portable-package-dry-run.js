"use strict";

const fs = require("fs");
const path = require("path");
const {
  collectReleaseFiles,
  readJson,
  timestamp,
  writeJson,
} = require("../lib/release-utils");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const rootIndex = rawArgs.indexOf("--root");
const workbenchRoot = rootIndex >= 0 ? path.resolve(rawArgs[rootIndex + 1]) : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => item !== "--root" && rawArgs[index - 1] !== "--root");
const command = args[0] || "check";

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function main() {
  if (command !== "check") throw new Error("Usage: workbench.bat release gate1 [--out <dir>]");
  const manifestPath = path.join(workbenchRoot, "release", "PORTABLE-RELEASE-MANIFEST.json");
  const versionPath = path.join(workbenchRoot, "VERSION");
  const manifest = readJson(manifestPath);
  const version = fs.readFileSync(versionPath, "utf8").trim();
  const errors = [];
  const warnings = [];
  if (manifest.schemaVersion !== "1.0") errors.push("Release manifest schemaVersion must be 1.0.");
  if (manifest.phase !== "agent-workspace-portable-release") errors.push("Unexpected release manifest phase.");
  if (manifest.packageVersion !== version) errors.push(`VERSION mismatch: ${version} != ${manifest.packageVersion}`);

  const collected = collectReleaseFiles(workbenchRoot, manifest);
  errors.push(...collected.errors);
  const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "release-runs", timestamp(), "gate1")));
  const reportPath = path.join(outRoot, "PORTABLE-PACKAGE-DRY-RUN-REPORT.json");
  const report = {
    schemaVersion: "1.0",
    phase: "release-gate-1-package-dry-run",
    generatedAt: new Date().toISOString(),
    dryRunOnly: true,
    packageName: manifest.packageName,
    packageVersion: manifest.packageVersion,
    workbenchRoot,
    manifestPath,
    reportPath,
    summary: {
      ok: errors.length === 0,
      includedFileCount: collected.includedFiles.length,
      includedBytes: collected.includedBytes,
      excludedCandidateCount: collected.excludedCandidates.length,
      errorCount: errors.length,
      warningCount: warnings.length,
    },
    includedFiles: collected.includedFiles,
    excludedCandidates: collected.excludedCandidates,
    errors,
    warnings,
  };
  writeJson(reportPath, report);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.summary.ok) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
}
