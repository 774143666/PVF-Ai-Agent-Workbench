"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const workbenchRoot = path.resolve(argValue("--root", path.resolve(__dirname, "../../..")));
const knowledgeRoot = path.join(workbenchRoot, "knowledge-pack");

function toPosix(file) {
  return file.replace(/\\/g, "/");
}

function readJson(file, errors) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON: ${file} -> ${error.message}`);
    return null;
  }
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function listFilesRecursive(root) {
  const files = [];
  if (!fs.existsSync(root)) {
    return files;
  }
  const stack = [root];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    }
  }
  return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b), "zh-Hans-CN"));
}

function main() {
  const errors = [];
  const warnings = [];
  const info = [];

  if (!fs.existsSync(knowledgeRoot)) {
    errors.push(`knowledge-pack directory is missing: ${knowledgeRoot}`);
  }

  const manifestPath = path.join(knowledgeRoot, "MANIFEST.json");
  const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath, errors) : null;
  if (!manifest) {
    errors.push("knowledge-pack/MANIFEST.json is missing.");
  }

  if (manifest) {
    if (manifest.schemaVersion !== "1.0") {
      errors.push("MANIFEST schemaVersion must be 1.0.");
    }
    const allowedPhases = new Set([
      "phase-1.5-knowledge-bootstrap",
      "phase-2-clean-encyclopedia-bootstrap"
    ]);
    if (!allowedPhases.has(manifest.phase)) {
      errors.push("MANIFEST phase must be a known knowledge-pack phase.");
    }
    if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
      errors.push("MANIFEST entries must not be empty.");
    }
    if (manifest.summary?.rawMaterialsCopied !== false || manifest.summary?.pvfCopied !== false || manifest.summary?.clientCopied !== false) {
      errors.push("MANIFEST must explicitly record that raw materials, PVF, and client files were not copied.");
    }

    const seenDest = new Set();
    const allowedSourcePrefixes = ["${SOURCE_WORKSPACE}/", "${DNF_PVF_XPILOT_SKILL}/", "${WORKBENCH_GENERATED}/"];
    const forbiddenDestPattern = /\.(pvf|bak|npk|img|zip|7z|rar|png|jpg|jpeg|webp|gif|docx|xlsx|pdf)$/i;
    const forbiddenDestSegments = /(^|\/)(高价值资料库|clients|materials|清风1031极纯客户端|幻境86客户端|单机动作化DNF|pvf-lab\/experiments)(\/|$)/;

    for (const entry of manifest.entries || []) {
      if (!entry.dest || !entry.source || !entry.sourceGroup || !entry.evidenceLevel || !entry.sha256) {
        errors.push(`MANIFEST entry is missing required fields: ${JSON.stringify(entry)}`);
        continue;
      }
      if (path.isAbsolute(entry.dest) || entry.dest.includes("..")) {
        errors.push(`MANIFEST entry has unsafe dest: ${entry.dest}`);
      }
      if (seenDest.has(entry.dest)) {
        errors.push(`Duplicate MANIFEST dest: ${entry.dest}`);
      }
      seenDest.add(entry.dest);

      if (!allowedSourcePrefixes.some((prefix) => entry.source.startsWith(prefix))) {
        errors.push(`MANIFEST source must use source variables, not raw absolute paths: ${entry.source}`);
      }
      if (forbiddenDestPattern.test(entry.dest) || forbiddenDestSegments.test(entry.dest)) {
        errors.push(`Forbidden copied artifact in knowledge-pack: ${entry.dest}`);
      }

      const file = path.join(knowledgeRoot, entry.dest);
      if (!fs.existsSync(file)) {
        errors.push(`MANIFEST entry file is missing: ${entry.dest}`);
        continue;
      }
      const buffer = fs.readFileSync(file);
      if (buffer.length !== entry.bytes) {
        errors.push(`Byte size mismatch: ${entry.dest}`);
      }
      const actualHash = sha256(buffer);
      if (actualHash !== entry.sha256) {
        errors.push(`SHA-256 mismatch: ${entry.dest}`);
      }
      if (buffer.length > 5 * 1024 * 1024) {
        errors.push(`Knowledge-pack file is unexpectedly large: ${entry.dest}`);
      }
    }

    const pathReferenceCount = Array.isArray(manifest.pathReferences)
      ? manifest.pathReferences.reduce((sum, item) => sum + (item.count || 0), 0)
      : 0;
    if (pathReferenceCount > 0) {
      warnings.push(`${pathReferenceCount} absolute path reference(s) remain in copied docs as source-reference-only.`);
    }
  }

  const allFiles = listFilesRecursive(knowledgeRoot);
  const textFiles = allFiles.filter((file) => /\.(md|json|txt)$/i.test(file));
  for (const file of textFiles) {
    const rel = toPosix(path.relative(knowledgeRoot, file));
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("\uFFFD")) {
      errors.push(`Unicode replacement character found in knowledge text: ${rel}`);
    }
    const suspiciousQuestionLines = text
      .split(/\r?\n/)
      .map((line, index) => ({ line, lineNumber: index + 1 }))
      .filter((item) => /\?{3,}/.test(item.line));
    if (suspiciousQuestionLines.length > 0) {
      errors.push(
        `Suspicious repeated question marks found in knowledge text: ${rel}:${suspiciousQuestionLines[0].lineNumber} (${suspiciousQuestionLines.length} line(s))`
      );
    }
  }
  const allowedGeneratedPrefixes = [
    "dictionaries/",
    "encyclopedia/",
    "safety/",
    "task-cards/"
  ];
  const allowedGeneratedFiles = new Set([
    "indexes/knowledge-index.json",
    "workflows/README.zh-CN.md",
    "workflows/npc-shop-edit.zh-CN.md",
    "workflows/skill-derivative-and-cancel.zh-CN.md"
  ]);
  const unmanagedGeneratedFiles = allFiles
    .map((file) => toPosix(path.relative(knowledgeRoot, file)))
    .filter((rel) => !["README.zh-CN.md", "EXPORT-POLICY.zh-CN.md", "MANIFEST.json", "workflows/README.md", "knowledge/README.md", "indexes/README.md", "health-check/README.md"].includes(rel))
    .filter((rel) => !allowedGeneratedFiles.has(rel))
    .filter((rel) => !allowedGeneratedPrefixes.some((prefix) => rel.startsWith(prefix)))
    .filter((rel) => manifest && !manifest.entries.some((entry) => entry.dest === rel));
  if (unmanagedGeneratedFiles.length > 0) {
    warnings.push(`Files not listed in MANIFEST: ${unmanagedGeneratedFiles.slice(0, 10).join(", ")}`);
  }

  info.push(`Knowledge root: ${knowledgeRoot}`);
  if (manifest) {
    info.push(`Manifest entries: ${manifest.entries?.length || 0}`);
    info.push(`Manifest bytes: ${manifest.summary?.totalBytes || 0}`);
  }

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
