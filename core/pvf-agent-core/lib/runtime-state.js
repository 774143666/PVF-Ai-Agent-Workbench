"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function pathInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertExternal(workbenchRoot, target) {
  if (pathInside(workbenchRoot, target)) {
    throw new Error(`Runtime output root must stay outside the Workbench: ${target}`);
  }
  return target;
}

function runtimeRoot(workbenchRoot) {
  if (process.env.PVF_WORKBENCH_RUNS_ROOT) {
    return assertExternal(workbenchRoot, path.resolve(process.env.PVF_WORKBENCH_RUNS_ROOT));
  }

  const workspaceRoot = path.dirname(path.resolve(workbenchRoot));
  const derivedRoot = path.join(workspaceRoot, "derived");
  if (fs.existsSync(derivedRoot)) {
    return assertExternal(workbenchRoot, path.join(derivedRoot, "reports", "pvf-agent-workbench", "runtime-runs"));
  }

  const stateRoot =
    process.env.LOCALAPPDATA ||
    process.env.XDG_STATE_HOME ||
    path.join(os.homedir(), ".local", "state");
  return assertExternal(workbenchRoot, path.join(stateRoot, "PVF-Agent-Workbench-State", "runs"));
}

function runtimePath(workbenchRoot, ...segments) {
  return path.join(runtimeRoot(workbenchRoot), ...segments);
}

module.exports = {
  runtimePath,
  runtimeRoot,
};
