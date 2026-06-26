"use strict";

const fs = require("fs");
const path = require("path");
const { readJson, timestamp, writeJson } = require("../lib/release-utils");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const rootIndex = rawArgs.indexOf("--root");
const workbenchRoot = rootIndex >= 0 ? path.resolve(rawArgs[rootIndex + 1]) : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => item !== "--root" && rawArgs[index - 1] !== "--root");
const command = args[0] || "list";
const suitePath = path.join(workbenchRoot, "evals", "agent", "suite.json");

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function matches(text, pattern) {
  return new RegExp(pattern, "is").test(text);
}

function evaluateResponses(suite, responsesDir) {
  const cases = [];
  for (const testCase of suite.cases) {
    const responsePath = path.join(responsesDir, testCase.responseFile);
    const response = fs.existsSync(responsePath) ? fs.readFileSync(responsePath, "utf8") : "";
    const required = (testCase.requiredGroups || []).map((group) => {
      const matchedPattern = (group.patterns || []).find((pattern) => matches(response, pattern)) || null;
      return { id: group.id, ok: Boolean(matchedPattern), matchedPattern };
    });
    const forbidden = (testCase.forbiddenPatterns || []).map((pattern) => ({
      pattern,
      matched: matches(response, pattern),
    }));
    const requiredPassed = required.filter((item) => item.ok).length;
    const requiredTotal = required.length;
    const forbiddenHits = forbidden.filter((item) => item.matched).length;
    const score = requiredTotal === 0 ? 1 : requiredPassed / requiredTotal;
    const ok = response.length > 0 && score === 1 && forbiddenHits === 0;
    cases.push({
      id: testCase.id,
      title: testCase.title,
      responsePath,
      responsePresent: response.length > 0,
      score,
      ok,
      required,
      forbiddenHits: forbidden.filter((item) => item.matched),
    });
  }
  const averageScore = cases.length === 0 ? 0 : cases.reduce((sum, item) => sum + item.score, 0) / cases.length;
  return {
    suiteId: suite.suiteId,
    suiteVersion: suite.version,
    responsesDir,
    summary: {
      ok: cases.every((item) => item.ok) && averageScore >= suite.minimumAverageScore,
      caseCount: cases.length,
      passedCases: cases.filter((item) => item.ok).length,
      failedCases: cases.filter((item) => !item.ok).length,
      averageScore,
      minimumAverageScore: suite.minimumAverageScore,
    },
    cases,
  };
}

function checkRun(suite, responsesDir, outRoot) {
  const evaluation = evaluateResponses(suite, responsesDir);
  const reportPath = path.join(outRoot, "AGENT-EVAL-REPORT.json");
  const report = {
    schemaVersion: "1.0",
    phase: "agent-eval",
    generatedAt: new Date().toISOString(),
    reportPath,
    ...evaluation,
  };
  writeJson(reportPath, report);
  return report;
}

function scaffold(suite, outRoot) {
  const responsesDir = path.join(outRoot, "responses");
  fs.mkdirSync(responsesDir, { recursive: true });
  const promptLines = ["# PVF Agent Eval Prompts", ""];
  for (const testCase of suite.cases) {
    promptLines.push(`## ${testCase.id}`, "", testCase.prompt, "", `回答文件：\`${testCase.responseFile}\``, "");
    const responsePath = path.join(responsesDir, testCase.responseFile);
    if (!fs.existsSync(responsePath)) fs.writeFileSync(responsePath, "", "utf8");
  }
  fs.writeFileSync(path.join(outRoot, "PROMPTS.md"), `${promptLines.join("\n")}\n`, "utf8");
  return { ok: true, outRoot, responsesDir, caseCount: suite.cases.length };
}

function main() {
  const suite = readJson(suitePath);
  if (command === "list") {
    process.stdout.write(`${JSON.stringify({ suiteId: suite.suiteId, version: suite.version, cases: suite.cases.map(({ id, title, prompt, responseFile }) => ({ id, title, prompt, responseFile })) }, null, 2)}\n`);
    return;
  }
  if (command === "scaffold") {
    const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "agent-eval-runs", timestamp(), "scaffold")));
    process.stdout.write(`${JSON.stringify(scaffold(suite, outRoot), null, 2)}\n`);
    return;
  }
  if (command === "check") {
    const responses = option("--responses");
    if (!responses) throw new Error("check requires --responses <dir>.");
    const responsesDir = path.resolve(responses);
    const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "agent-eval-runs", timestamp(), "check")));
    const report = checkRun(suite, responsesDir, outRoot);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!report.summary.ok) process.exitCode = 1;
    return;
  }
  if (command === "self-test") {
    const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "agent-eval-runs", timestamp(), "self-test")));
    const pass = checkRun(suite, path.join(workbenchRoot, "evals", "agent", "fixtures", "pass"), path.join(outRoot, "pass"));
    const fail = checkRun(suite, path.join(workbenchRoot, "evals", "agent", "fixtures", "fail"), path.join(outRoot, "fail"));
    const report = {
      schemaVersion: "1.0",
      phase: "agent-eval-self-test",
      generatedAt: new Date().toISOString(),
      reportPath: path.join(outRoot, "AGENT-EVAL-SELF-TEST.json"),
      summary: {
        ok: pass.summary.ok === true && fail.summary.ok === false,
        passFixtureAccepted: pass.summary.ok,
        failFixtureRejected: !fail.summary.ok,
      },
      passReportPath: pass.reportPath,
      failReportPath: fail.reportPath,
    };
    writeJson(report.reportPath, report);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!report.summary.ok) process.exitCode = 1;
    return;
  }
  throw new Error("Usage: workbench.bat eval <list|scaffold|check|self-test>");
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
}
