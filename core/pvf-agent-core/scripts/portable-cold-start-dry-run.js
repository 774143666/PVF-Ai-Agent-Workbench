"use strict";

const fs = require("fs");
const path = require("path");
const {
  runNode,
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

function addCheck(checks, errors, id, run, predicate) {
  const ok = run.ok && predicate(run.parsed, run.stdout);
  checks.push({
    id,
    ok,
    exitCode: run.exitCode,
    summary: run.parsed?.summary || null,
    stdoutTail: ok ? undefined : run.stdout.slice(-2000),
    stderr: run.stderr || undefined,
  });
  if (!ok) errors.push(`${id} failed.`);
}

function main() {
  if (command !== "check") throw new Error("Usage: workbench.bat release gate3 [--out <dir>]");
  const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "release-runs", timestamp(), "gate3")));
  const errors = [];
  const warnings = [];
  const checks = [];

  const gate2 = runNode(workbenchRoot, "core/pvf-agent-core/scripts/portable-stage-copy-dry-run.js", ["check", "--out", path.join(outRoot, "gate2")], 300000);
  addCheck(checks, errors, "gate2.stage-copy", gate2, (parsed) => parsed?.summary?.ok === true);
  const stageDir = gate2.parsed?.stageDir || null;

  if (stageDir && fs.existsSync(stageDir)) {
    const stageRuntimeRoot = path.join(outRoot, "stage-runtime");
    const env = runNode(stageDir, "core/pvf-agent-core/scripts/check-env.js");
    addCheck(checks, errors, "stage.check-env", env, (_parsed, stdout) => /PASS 0 error\(s\)/.test(stdout));

    const knowledge = runNode(stageDir, "core/pvf-agent-core/scripts/check-knowledge-pack.js");
    addCheck(checks, errors, "stage.check-knowledge-pack", knowledge, (_parsed, stdout) => /PASS 0 error\(s\)/.test(stdout));

    const skillRun = runNode(stageDir, "core/pvf-agent-core/scripts/install-agent-skill.js", ["self-test"]);
    addCheck(checks, errors, "stage.agent-skill-self-test", skillRun, (parsed) => parsed?.summary?.ok === true);

    const evalRun = runNode(stageDir, "core/pvf-agent-core/scripts/agent-eval.js", ["self-test", "--out", path.join(stageRuntimeRoot, "agent-eval")]);
    addCheck(checks, errors, "stage.agent-eval-self-test", evalRun, (parsed) => parsed?.summary?.ok === true);

    const doctor = runNode(stageDir, "core/pvf-agent-core/scripts/workbench-doctor.js", ["check", "--skip-profiles", "--skip-release-gates", "--out", path.join(stageRuntimeRoot, "doctor")], 180000);
    addCheck(checks, errors, "stage.workbench-doctor", doctor, (parsed) => parsed?.summary?.ok === true);

    const gate1Again = runNode(stageDir, "core/pvf-agent-core/scripts/portable-package-dry-run.js", ["check", "--out", path.join(stageRuntimeRoot, "gate1-after-runtime-check")], 180000);
    addCheck(checks, errors, "stage.gate1-after-generated-output", gate1Again, (parsed) => parsed?.summary?.ok === true);
  } else {
    errors.push("Gate 2 did not produce a stage directory.");
  }

  const reportPath = path.join(outRoot, "PORTABLE-COLD-START-DRY-RUN-REPORT.json");
  const report = {
    schemaVersion: "1.0",
    phase: "release-gate-3-cold-start-dry-run",
    generatedAt: new Date().toISOString(),
    dryRunOnly: true,
    workbenchRoot,
    outRoot,
    stageDir,
    reportPath,
    safety: {
      realPvfRequired: false,
      sourcePvfCopied: false,
      sourcePvfOverwritten: false,
      clientResourceWrite: false,
      localProfileCreated: false,
    },
    summary: {
      ok: errors.length === 0 && checks.every((check) => check.ok),
      checkCount: checks.length,
      failedChecks: checks.filter((check) => !check.ok).length,
      errorCount: errors.length,
      warningCount: warnings.length,
    },
    checks,
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
