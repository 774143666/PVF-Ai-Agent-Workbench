"use strict";

const fs = require("fs");
const path = require("path");

function toPosix(file) {
  return file.replace(/\\/g, "/");
}

function expandVars(value, vars) {
  if (typeof value === "string") {
    return value.replace(/\$\{([A-Z_]+)\}/g, (_, name) => vars[name] || "");
  }
  if (Array.isArray(value)) {
    return value.map((item) => expandVars(item, vars));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, expandVars(item, vars)]));
  }
  return value;
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadAdapterConfig(workbenchRoot) {
  const root = path.resolve(workbenchRoot);
  const configPath = path.join(root, "config", "pvf-adapter.json");
  const raw = loadJson(configPath);
  const vars = {
    WORKBENCH_ROOT: root,
    WORKBENCH_PARENT: path.dirname(root),
    SOURCE_WORKSPACE: path.dirname(root),
  };
  const config = expandVars(raw, vars);
  const envServer = config.upstream?.serverPathEnv ? process.env[config.upstream.serverPathEnv] : null;
  if (envServer) {
    config.upstream.command = "node";
    config.upstream.args = [envServer];
  }
  config.workbenchRoot = root;
  config.configPath = configPath;
  config.allowedToolsSet = new Set(config.allowedTools || []);
  config.forbiddenToolsSet = new Set(config.forbiddenTools || []);
  return config;
}

function resolveWorkbenchRoot(args, fallback) {
  const rootIndex = args.indexOf("--root");
  return rootIndex >= 0 && args[rootIndex + 1] ? path.resolve(args[rootIndex + 1]) : path.resolve(fallback);
}

function assertReadOnlyAdapter(config) {
  if (config.mode !== "read-only") {
    throw new Error("PVF adapter mode must be read-only.");
  }
  if (config.safety?.writeToolsEnabled !== false || config.safety?.clientWriteEnabled !== false) {
    throw new Error("PVF adapter write and client-write tools must be disabled.");
  }
  for (const tool of config.allowedToolsSet) {
    if (config.forbiddenToolsSet.has(tool)) {
      throw new Error(`Tool cannot be both allowed and forbidden: ${tool}`);
    }
  }
}

function upstreamLaunchOptions(config) {
  return {
    command: config.upstream.command,
    args: config.upstream.args || [],
    cwd: config.upstream.cwd || config.workbenchRoot,
    env: config.upstream.env || {},
  };
}

function adapterInfo(config) {
  return {
    mode: config.mode,
    phase: config.phase,
    upstream: {
      kind: config.upstream.kind,
      command: config.upstream.command,
      args: (config.upstream.args || []).map(toPosix),
      cwd: config.upstream.cwd ? toPosix(config.upstream.cwd) : undefined,
    },
    allowedTools: [...config.allowedToolsSet],
    forbiddenTools: [...config.forbiddenToolsSet],
    defaults: config.defaults,
  };
}

module.exports = {
  adapterInfo,
  assertReadOnlyAdapter,
  loadAdapterConfig,
  resolveWorkbenchRoot,
  upstreamLaunchOptions,
};
