"use strict";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const { validateBundledSkill } = require("../lib/agent-skill");

const args = process.argv.slice(2);
const rootArgIndex = args.indexOf("--root");
const workbenchRoot =
  rootArgIndex >= 0 && args[rootArgIndex + 1]
    ? path.resolve(args[rootArgIndex + 1])
    : path.resolve(__dirname, "../../..");

function rel(file) {
  return path.relative(workbenchRoot, file).replace(/\\/g, "/") || ".";
}

function join(relativePath) {
  return path.join(workbenchRoot, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(join(relativePath));
}

function isAgentWorkspaceMode() {
  return exists("release/AGENT-WORKSPACE-MANIFEST.json");
}

function isFile(relativePath) {
  try {
    return fs.statSync(join(relativePath)).isFile();
  } catch {
    return false;
  }
}

function isDirectory(relativePath) {
  try {
    return fs.statSync(join(relativePath)).isDirectory();
  } catch {
    return false;
  }
}

function readText(relativePath) {
  return fs.readFileSync(join(relativePath), "utf8");
}

function readJson(relativePath, errors) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

function hasInlineSecret(value) {
  if (typeof value === "string") {
    return /(sk-[A-Za-z0-9_-]{12,}|api[_-]?key\s*[:=])/i.test(value);
  }
  if (Array.isArray(value)) {
    return value.some(hasInlineSecret);
  }
  if (value && typeof value === "object") {
    return Object.values(value).some(hasInlineSecret);
  }
  return false;
}

function commandVersion(command) {
  try {
    return childProcess.execFileSync(command, ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function expandRuntimePath(value) {
  return String(value || "")
    .replace(/\$\{WORKBENCH_ROOT\}/g, workbenchRoot)
    .replace(/%LOCALAPPDATA%/gi, process.env.LOCALAPPDATA || "")
    .replace(/%USERPROFILE%/gi, process.env.USERPROFILE || "")
    .replace(/%APPDATA%/gi, process.env.APPDATA || "");
}

function resolveRuntimePath(value) {
  const expanded = expandRuntimePath(value);
  return path.isAbsolute(expanded) ? expanded : path.join(workbenchRoot, expanded);
}

function existingRuntimeCandidates(opencodeConfig) {
  const configured = opencodeConfig?.runtime?.executable || "runtime/opencode/OpenCode.exe";
  const candidates = [
    process.env.OPENCODE_EXE,
    configured,
    "%LOCALAPPDATA%\\Programs\\@opencode-aidesktop\\OpenCode.exe",
  ].filter(Boolean);

  const seen = new Set();
  return candidates
    .map(resolveRuntimePath)
    .filter((candidate) => {
      const key = candidate.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .filter((candidate) => {
      try {
        return fs.statSync(candidate).isFile();
      } catch {
        return false;
      }
    });
}

function checkRequiredPaths(errors) {
  if (isAgentWorkspaceMode()) {
    const requiredDirs = [
      ".agents/skills/dnf-pvf-xpilot/agents",
      "commands",
      "docs/release",
      "release",
      "runtime/node",
      "config",
      "config/mcp-templates",
      "agents",
      "core/pvf-agent-core/cli",
      "core/pvf-agent-core/lib",
      "core/pvf-agent-core/mcp",
      "core/pvf-agent-core/scripts",
      "core/pvf-agent-core/schemas",
      "core/pvf-agent-core/contracts",
      "core/pvf-agent-core/contracts/fixtures",
      "knowledge-pack",
      "knowledge-pack/dictionaries",
      "knowledge-pack/encyclopedia",
      "knowledge-pack/encyclopedia/pvf-file-types",
      "knowledge-pack/safety",
      "knowledge-pack/task-cards",
      "knowledge-pack/workflows",
      "knowledge-pack/indexes",
      "knowledge-pack/health-check",
      "evals/agent",
      "evals/agent/fixtures/pass",
      "evals/agent/fixtures/fail",
      "tools/pvf-bridge",
      "tools/pvf-bridge/native",
      "workspaces",
      "workspaces/examples",
      "workspaces/planner-runs",
      "workspaces/agent-eval-runs",
      "workspaces/release-runs",
    ];

    const requiredFiles = [
      "release/AGENT-WORKSPACE-MANIFEST.json",
      ".gitattributes",
      "AGENTS.md",
      "README.md",
      "README.zh-CN.md",
      "docs/CLEAN-COPY.zh-CN.md",
      "VERSION",
      "CHANGELOG.zh-CN.md",
      "release/PORTABLE-RELEASE-MANIFEST.json",
      "docs/release/RELEASE-GATE-1.zh-CN.md",
      "docs/release/RELEASE-GATE-2.zh-CN.md",
      "docs/release/RELEASE-GATE-3.zh-CN.md",
      "workbench.bat",
      "commands/agent-eval.bat",
      "commands/install-agent-skill.bat",
      "commands/portable-package-dry-run.bat",
      "commands/portable-stage-copy-dry-run.bat",
      "commands/portable-cold-start-dry-run.bat",
      "commands/check-env.bat",
      "commands/check-knowledge-pack.bat",
      "commands/check-real-task-runs.bat",
      "commands/check-backend-fixtures.bat",
      "commands/workbench-profile.bat",
      "commands/runtime-absorb-checklist.bat",
      "commands/pvf-readonly.bat",
      "commands/pvf-change-set.bat",
      "commands/pvf-index.bat",
      "commands/pvf-backend-contract.bat",
      "commands/workbench-doctor.bat",
      "runtime/node/node.exe",
      "tools/pvf-bridge/server.js",
      "tools/pvf-bridge/native/pvf_rust_core.node",
      "tools/pvf-bridge/dungeon-workflow.js",
      "tools/pvf-bridge/extract-dungeon.js",
      "tools/pvf-bridge/import-dungeon-extract.js",
      "tools/pvf-bridge/package-dungeon-assets.js",
      "tools/pvf-bridge/compare-existing-dependencies.js",
      "tools/pvf-bridge/analyze-apc.js",
      "tools/pvf-bridge/plan-item-stackable-dependencies.js",
      "tools/pvf-bridge/pvf_graph_common.js",
      "tools/pvf-bridge/pvf-scope-planner.js",
      "tools/pvf-bridge/compare-dungeon-extracts.js",
      "tools/pvf-bridge/clean-client-compatible-extract.js",
      "tools/pvf-bridge/materialize-dungeon-preset.js",
      "config/mcp.json",
      "config/mcp-templates/README.zh-CN.md",
      "config/mcp-templates/pvf-agent-core.windows-bundled-node.fragment.json",
      "config/mcp-templates/pvf-agent-core.system-node.fragment.json",
      "config/mcp-templates/host-agent-notes.zh-CN.md",
      "config/mcp-templates/typesquirrel-optional.zh-CN.md",
      "config/pvf-adapter.json",
      "config/write-policy.json",
      "config/workspace-profiles.json",
      "agents/dnf-pvf-agent.md",
      "agents/pvf-safety-rules.md",
      ".agents/skills/dnf-pvf-xpilot/SKILL.md",
      ".agents/skills/dnf-pvf-xpilot/agents/openai.yaml",
      "core/pvf-agent-core/README.zh-CN.md",
      "core/pvf-agent-core/scripts/check-env.js",
      "core/pvf-agent-core/scripts/workbench.js",
      "core/pvf-agent-core/scripts/workbench-profile.js",
      "core/pvf-agent-core/scripts/runtime-absorb-checklist.js",
      "core/pvf-agent-core/scripts/resolve-node.bat",
      "core/pvf-agent-core/scripts/check-knowledge-pack.js",
      "core/pvf-agent-core/scripts/workbench-doctor.js",
      "core/pvf-agent-core/scripts/check-real-task-runs.js",
      "core/pvf-agent-core/scripts/check-backend-fixtures.js",
      "core/pvf-agent-core/scripts/agent-eval.js",
      "core/pvf-agent-core/scripts/install-agent-skill.js",
      "core/pvf-agent-core/scripts/portable-package-dry-run.js",
      "core/pvf-agent-core/scripts/portable-stage-copy-dry-run.js",
      "core/pvf-agent-core/scripts/portable-cold-start-dry-run.js",
      "core/pvf-agent-core/cli/pvf-readonly.js",
      "core/pvf-agent-core/cli/pvf-change-set.js",
      "core/pvf-agent-core/cli/pvf-index.js",
      "core/pvf-agent-core/cli/pvf-backend-contract.js",
      "core/pvf-agent-core/lib/mcp-stdio-client.js",
      "core/pvf-agent-core/lib/adapter-config.js",
      "core/pvf-agent-core/lib/workspace-profiles.js",
      "core/pvf-agent-core/lib/pvf-index-store.js",
      "core/pvf-agent-core/lib/release-utils.js",
      "core/pvf-agent-core/lib/runtime-state.js",
      "core/pvf-agent-core/lib/agent-skill.js",
      "core/pvf-agent-core/mcp/server.js",
      "core/pvf-agent-core/contracts/pvf-backend-contract.zh-CN.md",
      "core/pvf-agent-core/contracts/pvf-backend-contract.v1.json",
      "core/pvf-agent-core/contracts/fixtures/README.zh-CN.md",
      "core/pvf-agent-core/contracts/fixtures/apc-swordman-gsd.fixture.json",
      "core/pvf-agent-core/contracts/fixtures/itemshop-birken.fixture.json",
      "core/pvf-agent-core/contracts/fixtures/skill-swordman-bloodyrave.fixture.json",
      "core/pvf-agent-core/contracts/fixtures/dungeon-draconiantower.fixture.json",
      "core/pvf-agent-core/schemas/workspace-profiles.schema.json",
      "core/pvf-agent-core/schemas/knowledge-pack-manifest.schema.json",
      "core/pvf-agent-core/schemas/pvf-change-set.schema.json",
      "core/pvf-agent-core/schemas/pvf-index-manifest.schema.json",
      "core/pvf-agent-core/schemas/pvf-index-catalog.schema.json",
      "core/pvf-agent-core/schemas/pvf-backend-contract.schema.json",
      "core/pvf-agent-core/schemas/pvf-backend-contract-report.schema.json",
      "core/pvf-agent-core/schemas/workbench-doctor-report.schema.json",
      "core/pvf-agent-core/schemas/real-task-runs-check-report.schema.json",
      "core/pvf-agent-core/schemas/backend-fixtures-check-report.schema.json",
      "core/pvf-agent-core/schemas/agent-eval-suite.schema.json",
      "core/pvf-agent-core/schemas/agent-eval-report.schema.json",
      "core/pvf-agent-core/schemas/portable-release-manifest.schema.json",
      "core/pvf-agent-core/schemas/portable-package-dry-run-report.schema.json",
      "core/pvf-agent-core/schemas/portable-stage-copy-dry-run-report.schema.json",
      "core/pvf-agent-core/schemas/portable-cold-start-dry-run-report.schema.json",
      "knowledge-pack/README.zh-CN.md",
      "knowledge-pack/EXPORT-POLICY.zh-CN.md",
      "knowledge-pack/MANIFEST.json",
      "knowledge-pack/safety/README.zh-CN.md",
      "knowledge-pack/indexes/knowledge-index.json",
      "knowledge-pack/encyclopedia/README.zh-CN.md",
      "knowledge-pack/dictionaries/README.zh-CN.md",
      "knowledge-pack/workflows/README.zh-CN.md",
      "knowledge-pack/task-cards/README.zh-CN.md",
      "workspaces/README.zh-CN.md",
      "workspaces/absorption-checklists/README.zh-CN.md",
      "workspaces/planner-runs/README.zh-CN.md",
      "workspaces/agent-eval-runs/README.zh-CN.md",
      "workspaces/release-runs/README.zh-CN.md",
      "evals/agent/README.zh-CN.md",
      "evals/agent/suite.json",
      "workspaces/examples/change-set.replace-text.example.json",
      "workspaces/examples/local-workspace-profile.example.json",
      "workspaces/examples/real-task-report-template.zh-CN.md",
      "workspaces/examples/real-task-summary.example.json",
    ];

    for (const dir of requiredDirs) {
      if (!isDirectory(dir)) {
        errors.push(`Missing required directory: ${dir}`);
      }
    }
    for (const file of requiredFiles) {
      if (!isFile(file)) {
        errors.push(`Missing required file: ${file}`);
      }
    }
    return;
  }

  const requiredDirs = [
    "runtime/opencode",
    "runtime/node",
    "config",
    "agents",
    "core/pvf-agent-core/bin",
    "core/pvf-agent-core/cli",
    "core/pvf-agent-core/lib",
    "core/pvf-agent-core/mcp",
    "core/pvf-agent-core/scripts",
    "core/pvf-agent-core/schemas",
    "core/pvf-agent-core/contracts",
    "core/pvf-agent-core/contracts/fixtures",
    "knowledge-pack",
    "knowledge-pack/dictionaries",
    "knowledge-pack/encyclopedia",
    "knowledge-pack/encyclopedia/pvf-file-types",
    "knowledge-pack/safety",
    "knowledge-pack/task-cards",
    "knowledge-pack/workflows",
    "knowledge-pack/indexes",
    "knowledge-pack/health-check",
    "workspaces",
    "workspaces/apply-runs",
    "workspaces/doctor-runs",
    "workspaces/dry-runs",
    "workspaces/absorption-checklists",
    "workspaces/examples",
    "workspaces/indexes",
    "workspaces/package-dry-runs",
  ];

  const requiredFiles = [
    "README.zh-CN.md",
    "CLEAN-COPY.zh-CN.md",
    "COLD-START.zh-CN.md",
    "ROADMAP-v2.zh-CN.md",
    "PORTABLE-RELEASE-MANIFEST.json",
    "RELEASE-GATE-1.zh-CN.md",
    "RELEASE-GATE-2.zh-CN.md",
    "RELEASE-GATE-3.zh-CN.md",
    "AGENTS.md",
    "start-here.bat",
    "setup-deepseek-key.bat",
    "start-pvf-agent.bat",
    "check-env.bat",
    "export-knowledge-pack.bat",
    "check-knowledge-pack.bat",
    "portable-package-dry-run.bat",
    "portable-stage-copy-dry-run.bat",
    "portable-cold-start-dry-run.bat",
    "portable-agent-workspace-stage.bat",
    "portable-runtime-overlay-dry-run.bat",
    "portable-runtime-overlay-stage.bat",
    "check-real-task-runs.bat",
    "check-backend-fixtures.bat",
    "workbench-profile.bat",
    "runtime-absorb-checklist.bat",
    "pvf-readonly.bat",
    "pvf-change-set.bat",
    "pvf-index.bat",
    "pvf-backend-contract.bat",
    "workbench-doctor.bat",
    "config/opencode.json",
    "config/mcp.json",
    "config/pvf-adapter.json",
    "config/write-policy.json",
    "config/providers.example.json",
    "config/workspace-profiles.json",
    "agents/dnf-pvf-agent.md",
    "agents/pvf-safety-rules.md",
    "agents/material-routing-rules.md",
    "core/pvf-agent-core/README.zh-CN.md",
    "core/pvf-agent-core/scripts/check-env.js",
    "core/pvf-agent-core/scripts/workbench-profile.js",
    "core/pvf-agent-core/scripts/runtime-absorb-checklist.js",
    "core/pvf-agent-core/scripts/first-run.js",
    "core/pvf-agent-core/scripts/setup-deepseek-key.js",
    "core/pvf-agent-core/scripts/resolve-node.bat",
    "core/pvf-agent-core/scripts/export-knowledge-pack.js",
    "core/pvf-agent-core/scripts/check-knowledge-pack.js",
    "core/pvf-agent-core/scripts/workbench-doctor.js",
    "core/pvf-agent-core/scripts/portable-package-dry-run.js",
    "core/pvf-agent-core/scripts/portable-stage-copy-dry-run.js",
    "core/pvf-agent-core/scripts/portable-cold-start-dry-run.js",
    "core/pvf-agent-core/scripts/portable-agent-workspace-stage.js",
    "core/pvf-agent-core/scripts/portable-runtime-overlay.js",
    "core/pvf-agent-core/scripts/check-real-task-runs.js",
    "core/pvf-agent-core/scripts/check-backend-fixtures.js",
    "core/pvf-agent-core/cli/pvf-readonly.js",
    "core/pvf-agent-core/cli/pvf-change-set.js",
    "core/pvf-agent-core/cli/pvf-index.js",
    "core/pvf-agent-core/cli/pvf-backend-contract.js",
    "core/pvf-agent-core/lib/mcp-stdio-client.js",
    "core/pvf-agent-core/lib/adapter-config.js",
    "core/pvf-agent-core/lib/workspace-profiles.js",
    "core/pvf-agent-core/lib/pvf-index-store.js",
    "core/pvf-agent-core/lib/runtime-state.js",
    "core/pvf-agent-core/mcp/server.js",
    "core/pvf-agent-core/contracts/pvf-backend-contract.zh-CN.md",
    "core/pvf-agent-core/contracts/pvf-backend-contract.v1.json",
    "core/pvf-agent-core/contracts/fixtures/README.zh-CN.md",
    "core/pvf-agent-core/contracts/fixtures/apc-swordman-gsd.fixture.json",
    "core/pvf-agent-core/contracts/fixtures/itemshop-birken.fixture.json",
    "core/pvf-agent-core/contracts/fixtures/skill-swordman-bloodyrave.fixture.json",
    "core/pvf-agent-core/contracts/fixtures/dungeon-draconiantower.fixture.json",
    "core/pvf-agent-core/schemas/workspace-profiles.schema.json",
    "core/pvf-agent-core/schemas/knowledge-pack-manifest.schema.json",
    "core/pvf-agent-core/schemas/pvf-change-set.schema.json",
    "core/pvf-agent-core/schemas/pvf-index-manifest.schema.json",
    "core/pvf-agent-core/schemas/pvf-index-catalog.schema.json",
    "core/pvf-agent-core/schemas/pvf-backend-contract.schema.json",
    "core/pvf-agent-core/schemas/pvf-backend-contract-report.schema.json",
    "core/pvf-agent-core/schemas/workbench-doctor-report.schema.json",
    "core/pvf-agent-core/schemas/portable-release-manifest.schema.json",
    "core/pvf-agent-core/schemas/portable-package-dry-run-report.schema.json",
    "core/pvf-agent-core/schemas/portable-stage-copy-dry-run-report.schema.json",
    "core/pvf-agent-core/schemas/portable-cold-start-dry-run-report.schema.json",
    "core/pvf-agent-core/schemas/portable-runtime-overlay-report.schema.json",
    "core/pvf-agent-core/schemas/real-task-runs-check-report.schema.json",
    "core/pvf-agent-core/schemas/backend-fixtures-check-report.schema.json",
    "knowledge-pack/README.zh-CN.md",
    "knowledge-pack/EXPORT-POLICY.zh-CN.md",
    "knowledge-pack/MANIFEST.json",
    "workspaces/README.zh-CN.md",
    "workspaces/absorption-checklists/README.zh-CN.md",
    "workspaces/doctor-runs/README.zh-CN.md",
    "workspaces/examples/change-set.replace-text.example.json",
    "workspaces/indexes/README.zh-CN.md",
    "workspaces/package-dry-runs/README.zh-CN.md",
  ];

  for (const dir of requiredDirs) {
    if (!isDirectory(dir)) {
      errors.push(`Missing required directory: ${dir}`);
    }
  }

  for (const file of requiredFiles) {
    if (!isFile(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  }
}

function checkAgentWorkspaceRootLayout(errors, info) {
  const allowedFiles = new Set([
    ".gitattributes",
    ".gitignore",
    "AGENTS.md",
    "CHANGELOG.zh-CN.md",
    "README.md",
    "README.zh-CN.md",
    "VERSION",
    "workbench.bat",
  ]);
  const rootFiles = fs
    .readdirSync(workbenchRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const unexpected = rootFiles.filter((file) => !allowedFiles.has(file));
  if (unexpected.length > 0) {
    errors.push(`Unexpected Workbench root file(s): ${unexpected.join(", ")}. Move implementation files into commands/, docs/, release/, core/, or another owned directory.`);
  }
  info.push(`Root layout: ${rootFiles.length}/${allowedFiles.size} allowed files`);
}

function checkAgentWorkspaceRuntimePurity(errors, info) {
  const workspacesRoot = join("workspaces");
  const unexpected = [];
  const stack = [workspacesRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        const relativePath = rel(fullPath);
        const isExample = relativePath.startsWith("workspaces/examples/");
        const isReadme = /^workspaces\/(?:[^/]+\/)?README\.zh-CN\.md$/i.test(relativePath);
        if (!isExample && !isReadme) unexpected.push(relativePath);
      }
    }
  }
  if (unexpected.length > 0) {
    const sample = unexpected.slice(0, 10).join(", ");
    const remainder = unexpected.length > 10 ? ` (+${unexpected.length - 10} more)` : "";
    errors.push(`Workbench contains generated runtime artifact(s): ${sample}${remainder}. Move them to the external runtime root.`);
  }
  info.push(`Runtime purity: ${unexpected.length === 0 ? "clean" : `${unexpected.length} generated file(s)`}`);
}

function checkProviders(errors, warnings) {
  const providersExample = readJson("config/providers.example.json", errors);
  if (providersExample && hasInlineSecret(providersExample)) {
    errors.push("providers.example.json appears to contain an inline secret.");
  }

  if (!exists("config/providers.local.json")) {
    const knownEnvVars = ["DEEPSEEK_API_KEY"];
    const presentEnvVars = knownEnvVars.filter((name) => Boolean(process.env[name]));
    if (presentEnvVars.length === 0) {
      warnings.push("No providers.local.json file or common provider API key environment variable was found.");
    } else {
      warnings.push(`Using provider API key environment variables: ${presentEnvVars.join(", ")}`);
    }
  } else {
    const providersLocal = readJson("config/providers.local.json", errors);
    if (providersLocal && hasInlineSecret(providersLocal)) {
      warnings.push("providers.local.json contains local credentials; keep it private and out of packages.");
    }
  }
}

function checkRuntime(opencodeConfig, warnings, info) {
  const existing = existingRuntimeCandidates(opencodeConfig);
  if (existing.length > 0) {
    info.push(`OpenCode runtime: ${existing[0]}`);
    return;
  }
  const executable = opencodeConfig?.runtime?.executable || "runtime/opencode/OpenCode.exe";
  warnings.push(`OpenCode runtime is not present: ${executable}`);
}

function checkMcpConfig(mcpConfig, errors, warnings) {
  const server = mcpConfig?.servers?.["pvf-agent-core"];
  if (!server) {
    errors.push("mcp.json must define servers.pvf-agent-core.");
    return;
  }

  if (server.phase !== "phase-4-readonly-session-index") {
    errors.push("pvf-agent-core MCP phase must be phase-4-readonly-session-index.");
  }
  if (server.safety?.defaultMode !== "read-only") {
    errors.push("pvf-agent-core MCP safety.defaultMode must be read-only.");
  }
  if (server.safety?.writeRequiresExplicitAuthorization !== true) {
    errors.push("pvf-agent-core MCP must require explicit write authorization.");
  }
  if (server.safety?.clientWriteRequiresSeparateAuthorization !== true) {
    errors.push("pvf-agent-core MCP must require separate client-write authorization.");
  }

  if (server.enabled === true) {
    const script = Array.isArray(server.args) ? server.args.find((item) => /server\.js$/i.test(item)) : null;
    if (script && !isFile(script)) {
      errors.push(`Enabled MCP server points to a missing script: ${script}`);
    }
  } else {
    warnings.push("pvf-agent-core MCP server is disabled, as expected for phase 1.");
  }
}

function checkPvfAdapter(adapterConfig, errors, warnings) {
  if (!adapterConfig) {
    return;
  }
  if (adapterConfig.phase !== "phase-4-readonly-session-index") {
    errors.push("pvf-adapter.json phase must be phase-4-readonly-session-index.");
  }
  if (adapterConfig.mode !== "read-only") {
    errors.push("pvf-adapter.json mode must be read-only.");
  }
  if (adapterConfig.safety?.writeToolsEnabled !== false || adapterConfig.safety?.clientWriteEnabled !== false) {
    errors.push("pvf-adapter.json must keep writeToolsEnabled=false and clientWriteEnabled=false.");
  }
  const allowed = new Set(adapterConfig.allowedTools || []);
  const forbidden = new Set(adapterConfig.forbiddenTools || []);
  for (const tool of forbidden) {
    if (allowed.has(tool)) {
      errors.push(`pvf-adapter.json lists a forbidden tool as allowed: ${tool}`);
    }
  }
  for (const requiredTool of ["pvf_open", "pvf_list_files", "pvf_list_files_page", "pvf_search", "pvf_read_file", "pvf_resolve_lst_id"]) {
    if (!allowed.has(requiredTool)) {
      errors.push(`pvf-adapter.json is missing required read-only tool: ${requiredTool}`);
    }
  }
  if (adapterConfig.sessionCache?.enabled !== true || adapterConfig.sessionCache?.profileToolsEnabled !== true) {
    errors.push("pvf-adapter.json must enable read-only sessionCache profile tools for phase 4.");
  }
  if (!Number.isInteger(adapterConfig.sessionCache?.maxSessions) || adapterConfig.sessionCache.maxSessions < 1) {
    errors.push("pvf-adapter.json sessionCache.maxSessions must be a positive integer.");
  }
  for (const forbiddenTool of ["pvf_backup", "pvf_replace_text", "pvf_write_file", "pvf_save"]) {
    if (!forbidden.has(forbiddenTool)) {
      errors.push(`pvf-adapter.json must explicitly forbid: ${forbiddenTool}`);
    }
  }
  const upstreamArgs = Array.isArray(adapterConfig.upstream?.args) ? adapterConfig.upstream.args : [];
  const serverArg = upstreamArgs.find((item) => /server\.js$/i.test(String(item)));
  if (!serverArg) {
    errors.push("pvf-adapter.json upstream.args must point to a server.js adapter.");
  } else {
    const expanded = String(serverArg)
      .replace(/\$\{WORKBENCH_ROOT\}/g, workbenchRoot)
      .replace(/\$\{WORKBENCH_PARENT\}/g, path.dirname(workbenchRoot))
      .replace(/\$\{SOURCE_WORKSPACE\}/g, path.dirname(workbenchRoot));
    if (!fs.existsSync(expanded) && !process.env[adapterConfig.upstream?.serverPathEnv || ""]) {
      warnings.push(`Configured upstream pvf_bridge server was not found: ${expanded}`);
    }
  }
}

function checkWritePolicy(writePolicy, errors) {
  if (!writePolicy) {
    return;
  }
  if (writePolicy.phase !== "phase-3-controlled-output-apply") {
    errors.push("write-policy.json phase must be phase-3-controlled-output-apply.");
  }
  if (writePolicy.mode !== "controlled-output-only") {
    errors.push("write-policy.json mode must be controlled-output-only.");
  }
  if (writePolicy.mcpWriteToolsEnabled !== false) {
    errors.push("write-policy.json must keep mcpWriteToolsEnabled=false.");
  }
  if (writePolicy.controlledApplyEnabled !== true) {
    errors.push("write-policy.json must set controlledApplyEnabled=true for phase 3 apply.");
  }
  if (writePolicy.permissionModel?.agentMcpWriteToolsEnabled !== false) {
    errors.push("write-policy.json permissionModel must keep agentMcpWriteToolsEnabled=false.");
  }
  if (writePolicy.permissionModel?.sourceOverwriteAllowed !== false || writePolicy.controlledWriteRunner?.sourceOverwriteAllowed !== false) {
    errors.push("write-policy.json must keep controlled write sourceOverwriteAllowed=false.");
  }
  if (writePolicy.permissionModel?.clientWriteAllowed !== false || writePolicy.controlledWriteRunner?.clientWriteAllowed !== false) {
    errors.push("write-policy.json must keep controlled write clientWriteAllowed=false.");
  }
  const runnerTools = new Set(writePolicy.controlledWriteRunner?.allowedBridgeTools || []);
  for (const tool of ["pvf_open", "pvf_read_file", "pvf_replace_text", "pvf_backup", "pvf_save", "pvf_close"]) {
    if (!runnerTools.has(tool)) {
      errors.push(`write-policy.json controlledWriteRunner.allowedBridgeTools missing: ${tool}`);
    }
  }
  const forbidden = new Set(writePolicy.forbiddenOperations || []);
  for (const operation of ["overwrite-source-pvf", "client-resource-write", "apply-without-backup", "apply-without-explicit-output", "apply-without-readback"]) {
    if (!forbidden.has(operation)) {
      errors.push(`write-policy.json must explicitly forbid: ${operation}`);
    }
  }
  const required = new Set(writePolicy.requiredBeforeApply || []);
  for (const gate of ["explicit-user-authorization", "target-pvf-confirmed", "timestamped-backup", "explicit-output-path", "readback-after-save"]) {
    if (!required.has(gate)) {
      errors.push(`write-policy.json missing apply gate: ${gate}`);
    }
  }
}

function checkWorkspaceProfiles(profilesConfig, errors, warnings, localProfilesConfig) {
  if (!profilesConfig) {
    return;
  }

  if (profilesConfig.schemaVersion !== "1.0") {
    errors.push("workspace-profiles.json must use schemaVersion 1.0.");
  }

  if (!Array.isArray(profilesConfig.profiles) || profilesConfig.profiles.length === 0) {
    errors.push("workspace-profiles.json must contain at least one profile.");
    return;
  }

  const allProfiles = [
    ...profilesConfig.profiles.map((profile) => ({ profile, source: "base" })),
    ...((localProfilesConfig && Array.isArray(localProfilesConfig.profiles)) ? localProfilesConfig.profiles.map((profile) => ({ profile, source: "local" })) : []),
  ];

  const names = new Set();
  for (const [index, item] of allProfiles.entries()) {
    const profile = item.profile;
    const prefix = `${item.source}.profiles[${index}]`;
    for (const field of ["name", "workspace", "sourcePvf", "output"]) {
      if (typeof profile[field] !== "string" || profile[field].trim() === "") {
        errors.push(`${prefix}.${field} is required.`);
      }
    }

    if (names.has(profile.name)) {
      errors.push(`Duplicate workspace profile name: ${profile.name}`);
    }
    names.add(profile.name);

    if (profile.safety?.defaultMode !== "read-only") {
      errors.push(`${prefix}.safety.defaultMode must be read-only.`);
    }
    if (profile.safety?.writeMode?.enabled !== false) {
      errors.push(`${prefix}.safety.writeMode.enabled must be false in phase 1.`);
    }
    if (profile.safety?.clientWrite?.enabled !== false) {
      errors.push(`${prefix}.safety.clientWrite.enabled must be false in phase 1.`);
    }

    const pathValues = [
      profile.workspace,
      profile.sourcePvf,
      profile.output,
      profile.client,
      ...(Array.isArray(profile.materials) ? profile.materials : [profile.materials]),
    ].filter((value) => typeof value === "string");
    if (item.source === "base" && pathValues.some((value) => /DNFPVFwork|Script\.pvf\.2026/i.test(value))) {
      warnings.push(`${prefix} appears to reference the current development workspace; do not ship that as a default profile.`);
    }

    if (profile.enabled === true) {
      for (const [field, value] of [
        ["workspace", profile.workspace],
        ["sourcePvf", profile.sourcePvf],
        ["output", profile.output],
      ]) {
        if (typeof value === "string" && value.trim() && !fs.existsSync(value)) {
          warnings.push(`${prefix}.${field} does not exist on this machine: ${value}`);
        }
      }
    }
  }

  const activeProfile = localProfilesConfig?.activeProfile || profilesConfig.activeProfile;
  if (activeProfile) {
    if (!names.has(activeProfile)) {
      errors.push(`activeProfile does not match a configured profile: ${activeProfile}`);
    }
  } else {
    warnings.push("No activeProfile is selected. Run workbench.bat profile init ... --set-active or use direct --pvf commands.");
  }
}

function main() {
  const errors = [];
  const warnings = [];
  const info = [];
  const agentWorkspaceMode = isAgentWorkspaceMode();

  if (!fs.existsSync(workbenchRoot)) {
    console.error(`ERROR Workbench root does not exist: ${workbenchRoot}`);
    process.exit(1);
  }

  info.push(`Workbench root: ${workbenchRoot}`);
  info.push(`Mode: ${agentWorkspaceMode ? "agent-workspace" : "portable-core"}`);
  info.push(`Node.js: ${process.version}`);

  const npmVersion = commandVersion("npm");
  if (npmVersion) {
    info.push(`npm: ${npmVersion}`);
  } else {
    info.push("npm: not found (not required for current scaffold/read-only adapter)");
  }

  checkRequiredPaths(errors);
  if (agentWorkspaceMode) {
    checkAgentWorkspaceRootLayout(errors, info);
    checkAgentWorkspaceRuntimePurity(errors, info);
    const skillValidation = validateBundledSkill(workbenchRoot);
    errors.push(...skillValidation.errors.map((error) => `Bundled Agent Skill: ${error}`));
    if (skillValidation.ok) info.push(`Bundled Agent Skill: ${skillValidation.skillName} (${skillValidation.sourceHash.slice(0, 12)})`);
  }

  const opencodeConfig = agentWorkspaceMode ? null : readJson("config/opencode.json", errors);
  const mcpConfig = readJson("config/mcp.json", errors);
  const adapterConfig = readJson("config/pvf-adapter.json", errors);
  const writePolicy = readJson("config/write-policy.json", errors);
  const profilesConfig = readJson("config/workspace-profiles.json", errors);
  const localProfilesPath = join("config/workspace-profiles.local.json");
  const localProfilesConfig = fs.existsSync(localProfilesPath) ? readJson("config/workspace-profiles.local.json", errors) : null;
  const schema = readJson("core/pvf-agent-core/schemas/workspace-profiles.schema.json", errors);
  const releaseManifest = readJson(agentWorkspaceMode ? "release/PORTABLE-RELEASE-MANIFEST.json" : "PORTABLE-RELEASE-MANIFEST.json", errors);
  const agentWorkspaceManifest = agentWorkspaceMode ? readJson("release/AGENT-WORKSPACE-MANIFEST.json", errors) : null;
  const version = isFile("VERSION") ? readText("VERSION").trim() : null;

  if (!agentWorkspaceMode) {
    if (opencodeConfig?.startup?.defaultMode !== "read-only") {
      errors.push("opencode.json startup.defaultMode must be read-only.");
    }
    if (!Array.isArray(opencodeConfig?.agentInstructionFiles) || opencodeConfig.agentInstructionFiles.length === 0) {
      errors.push("opencode.json must list agentInstructionFiles.");
    } else {
      for (const file of opencodeConfig.agentInstructionFiles) {
        if (!isFile(file)) {
          errors.push(`Agent instruction file is missing: ${file}`);
        }
      }
    }
  }

  if (schema && schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
    errors.push("workspace profile schema must use JSON Schema draft 2020-12.");
  }
  if (releaseManifest && releaseManifest.packageVersion !== version) {
    errors.push(`PORTABLE-RELEASE-MANIFEST packageVersion does not match VERSION: ${releaseManifest.packageVersion} != ${version}`);
  }
  if (agentWorkspaceManifest && agentWorkspaceManifest.packageVersion !== version) {
    errors.push(`AGENT-WORKSPACE-MANIFEST packageVersion does not match VERSION: ${agentWorkspaceManifest.packageVersion} != ${version}`);
  }

  if (!agentWorkspaceMode) {
    checkRuntime(opencodeConfig, warnings, info);
    checkProviders(errors, warnings);
  }
  checkMcpConfig(mcpConfig, errors, warnings);
  checkPvfAdapter(adapterConfig, errors, warnings);
  checkWritePolicy(writePolicy, errors);
  checkWorkspaceProfiles(profilesConfig, errors, warnings, localProfilesConfig);

  for (const line of info) {
    console.log(`INFO ${line}`);
  }
  for (const line of warnings) {
    console.log(`WARN ${line}`);
  }
  for (const line of errors) {
    console.error(`ERROR ${line}`);
  }

  if (errors.length > 0) {
    console.error(`FAIL ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`PASS 0 error(s), ${warnings.length} warning(s).`);
}

main();
