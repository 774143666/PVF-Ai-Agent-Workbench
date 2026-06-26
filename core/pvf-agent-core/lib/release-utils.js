"use strict";

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizeRel(value) {
  return toPosix(value).replace(/^\/+/, "").replace(/\/+/g, "/");
}

function pathInside(root, file) {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256File(file) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(file, "r");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    while (true) {
      const bytes = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (bytes === 0) break;
      hash.update(buffer.subarray(0, bytes));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest("hex");
}

function listFilesRecursive(root) {
  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile()) files.push(full);
    }
  }
  return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function globToRegex(pattern) {
  const escaped = normalizeRel(pattern)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

function releaseReadmeException(relPath) {
  return /^workspaces\/(absorption-checklists|agent-eval-runs|doctor-runs|indexes|package-dry-runs|planner-runs|release-runs)\/README\.zh-CN\.md$/i.test(normalizeRel(relPath));
}

function hardForbiddenReason(relPath) {
  const value = normalizeRel(relPath);
  if (releaseReadmeException(value)) return null;
  if (/^config\/(providers\.local\.json|workspace-profiles\.local\.json)$/i.test(value)) return "local private config";
  if (/^config\/.*\.secret\.json$/i.test(value)) return "local secret config";
  if (/^workspaces\/(dry-runs|apply-runs|backend-contract-runs|backend-fixture-runs|first-run-reports|real-task-runs|real-task-checks|absorption-checklists|agent-eval-runs|agent-workspace-stages|runtime-overlay-dry-runs|runtime-overlay-stages|stage-copy-dry-runs|cold-start-dry-runs|doctor-runs|planner-runs|package-dry-runs|release-runs|indexes)\//i.test(value)) {
    return "generated workspace output";
  }
  if (/\.(pvf|bak|npk|img|zip|7z|rar)$/i.test(value)) return "heavy or source artifact";
  return null;
}

function makeExcludeRules(manifest) {
  const patterns = [
    ...(manifest.exclude?.localPrivate || []),
    ...(manifest.exclude?.generatedOutputs || []),
    ...(manifest.exclude?.heavyArtifacts || []),
  ];
  return patterns.map((raw) => {
    const pattern = normalizeRel(raw);
    if (pattern.endsWith("/")) return { pattern, type: "prefix" };
    if (pattern.includes("*")) return { pattern, type: "glob", regex: globToRegex(pattern) };
    return { pattern, type: "exact" };
  });
}

function excludedReason(relPath, rules) {
  if (releaseReadmeException(relPath)) return null;
  const hard = hardForbiddenReason(relPath);
  if (hard) return hard;
  const value = normalizeRel(relPath);
  for (const rule of rules) {
    if (rule.type === "prefix" && value.toLowerCase().startsWith(rule.pattern.toLowerCase())) return `manifest exclude: ${rule.pattern}`;
    if (rule.type === "glob" && rule.regex.test(value)) return `manifest exclude: ${rule.pattern}`;
    if (rule.type === "exact" && value.toLowerCase() === rule.pattern.toLowerCase()) return `manifest exclude: ${rule.pattern}`;
  }
  return null;
}

function collectReleaseFiles(workbenchRoot, manifest) {
  const errors = [];
  const excludedCandidates = [];
  const rules = makeExcludeRules(manifest);
  const included = new Map();
  for (const rawEntry of manifest.portableCore?.include || []) {
    const entry = normalizeRel(rawEntry);
    if (!entry || path.isAbsolute(entry) || entry.includes("..")) {
      errors.push(`Unsafe include path: ${rawEntry}`);
      continue;
    }
    const absolute = path.join(workbenchRoot, entry);
    if (!fs.existsSync(absolute)) {
      errors.push(`Included path does not exist: ${entry}`);
      continue;
    }
    const stat = fs.statSync(absolute);
    const files = stat.isDirectory() ? listFilesRecursive(absolute) : [absolute];
    for (const file of files) {
      const relPath = normalizeRel(path.relative(workbenchRoot, file));
      const reason = excludedReason(relPath, rules);
      if (reason) {
        excludedCandidates.push({ path: relPath, reason });
      } else {
        included.set(relPath, file);
      }
    }
  }
  const includedFiles = [];
  let includedBytes = 0;
  for (const [relPath, file] of [...included.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const stat = fs.statSync(file);
    includedBytes += stat.size;
    includedFiles.push({ path: relPath, bytes: stat.size, sha256: sha256File(file) });
  }
  return { errors, excludedCandidates, includedFiles, includedBytes };
}

function parseJsonOutput(stdout) {
  try {
    return JSON.parse(String(stdout || "").trim());
  } catch {
    return null;
  }
}

function runNode(root, scriptRelativePath, scriptArgs = [], timeoutMs = 120000) {
  const script = path.join(root, scriptRelativePath);
  const node = path.join(root, "runtime", "node", "node.exe");
  const executable = fs.existsSync(node) ? node : process.execPath;
  const result = childProcess.spawnSync(executable, [script, "--root", root, ...scriptArgs], {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
  });
  return {
    exitCode: result.status,
    signal: result.signal || null,
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || "").trim(),
    ok: result.status === 0,
    parsed: parseJsonOutput(result.stdout),
  };
}

module.exports = {
  collectReleaseFiles,
  hardForbiddenReason,
  listFilesRecursive,
  normalizeRel,
  parseJsonOutput,
  pathInside,
  readJson,
  runNode,
  sha256File,
  timestamp,
  toPosix,
  writeJson,
};
