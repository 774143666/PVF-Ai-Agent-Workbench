"use strict";

const fs = require("fs");
const path = require("path");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const rootArgIndex = rawArgs.indexOf("--root");
const workbenchRoot =
  rootArgIndex >= 0 && rawArgs[rootArgIndex + 1]
    ? path.resolve(rawArgs[rootArgIndex + 1])
    : path.resolve(__dirname, "../../..");
const args = rawArgs.filter((item, index) => !(item === "--root" || rawArgs[index - 1] === "--root"));
const command = args[0] || "help";

function usage() {
  return `Usage:
  workbench.bat absorb new --id <run-id> --title <title> --domain <domain> --status PASS [--out <dir>]
  workbench.bat absorb template

The generated checklist is a local run artifact outside the Workbench source tree by default.
It does not edit the knowledge-pack.
`;
}

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function requireOption(name) {
  const value = option(name);
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function safeName(value) {
  return String(value || "runtime-validation")
    .replace(/[\\/:\s]+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "runtime-validation";
}

function checklistMarkdown(meta) {
  return `# Runtime Validation Absorption Checklist

本清单用于把一次实机验证结果吸收到 Workbench clean knowledge-pack。它是本机运行产物，不是证据报告，也不会自动改知识包。

## 输入

- Run ID: ${meta.id}
- Title: ${meta.title}
- Domain: ${meta.domain}
- Runtime status: ${meta.status}
- Generated at: ${meta.generatedAt}

## 吸收前确认

- [ ] 已确认实机结果是 PASS / FAIL / NEGATIVE SAMPLE 中的一类，不是猜测。
- [ ] 已确认目标 PVF、客户端和样本条件；不要把单一样本写成全局规则。
- [ ] 若涉及中文、StringLink、NPC 文本、道具名、描述或副本文本，已计划客户端 UI 文本 smoke check。
- [ ] 若结果来自失败或负例，按 negative boundary 写入，不要改成“默认可用”。

## clean knowledge-pack 更新点

- [ ] 字段词典：更新相关 \`knowledge-pack/dictionaries/*\`。
- [ ] 边界索引：更新相关 \`knowledge-pack/indexes/*boundary*.zh-CN.md\` 或专题索引。
- [ ] 任务卡：如果会影响 Agent 默认操作，更新 \`knowledge-pack/task-cards/*\`。
- [ ] workflow：如果会影响写入流程、验证流程或风险步骤，更新 \`knowledge-pack/workflows/*\`。
- [ ] 完成状态：必要时更新 \`knowledge-pack/indexes/completed-mainlines-status.zh-CN.md\`。
- [ ] 安全护栏：若发现新的污染、编码、覆盖或部署风险，更新 \`knowledge-pack/safety/README.zh-CN.md\`。

## 禁止写入 clean pack 的内容

- [ ] 不写真实 PVF 路径、客户端路径、实验输出路径、报告绝对路径。
- [ ] 不写完整证据链、长日志、截图、原始教程全文或候选报告全文。
- [ ] 不把 PVF 读回正常等同于客户端 UI 正常。

## 机械检查

- [ ] 更新 \`knowledge-pack/MANIFEST.json\` 的新增条目、bytes、sha256、summary。
- [ ] 运行 \`workbench.bat knowledge-check\`。
- [ ] 运行 \`workbench.bat check\` 或 \`workbench.bat doctor check\`。
- [ ] 扫描 clean pack，确认没有误写本机路径、实验编号或报告路径。

## 收尾

- [ ] 在最终回复中说明：吸收了什么、仍然未证明什么、哪些检查通过。
- [ ] 如果本轮动过客户端或实验 PVF，确认已按原流程回滚；仅知识吸收任务不得触碰 PVF/客户端。
`;
}

function commandTemplate() {
  process.stdout.write(checklistMarkdown({
    id: "<run-id>",
    title: "<title>",
    domain: "<domain>",
    status: "PASS",
    generatedAt: "<timestamp>",
  }));
}

function commandNew() {
  const meta = {
    id: requireOption("--id"),
    title: requireOption("--title"),
    domain: requireOption("--domain"),
    status: option("--status", "PASS"),
    generatedAt: new Date().toISOString(),
  };
  const outRoot = path.resolve(option("--out", runtimePath(workbenchRoot, "absorption-checklists")));
  const runDir = path.join(outRoot, `${timestamp()}-${safeName(meta.id)}`);
  fs.mkdirSync(runDir, { recursive: true });
  const markdownPath = path.join(runDir, "ABSORPTION-CHECKLIST.md");
  const summaryPath = path.join(runDir, "ABSORPTION-CHECKLIST.json");
  fs.writeFileSync(markdownPath, checklistMarkdown(meta), "utf8");
  fs.writeFileSync(summaryPath, `${JSON.stringify({ schemaVersion: "1.0", phase: "runtime-validation-absorption-checklist", ...meta, checklistPath: markdownPath }, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ ok: true, command: "new", runDir, checklistPath: markdownPath, summaryPath }, null, 2)}\n`);
}

function main() {
  if (command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage());
    return;
  }
  if (command === "template") {
    commandTemplate();
    return;
  }
  if (command === "new") {
    commandNew();
    return;
  }
  throw new Error(`Unsupported command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
}
