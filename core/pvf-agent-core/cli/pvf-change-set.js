"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { McpStdioClient, parseMcpTextResult } = require("../lib/mcp-stdio-client");
const { resolveSourcePvf } = require("../lib/workspace-profiles");
const {
  assertReadOnlyAdapter,
  loadAdapterConfig,
  resolveWorkbenchRoot,
  upstreamLaunchOptions,
} = require("../lib/adapter-config");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const workbenchRoot = resolveWorkbenchRoot(rawArgs, path.resolve(__dirname, "../../.."));
const args = rawArgs.filter((item, index) => !(item === "--root" || rawArgs[index - 1] === "--root"));
const command = args[0];

function usage() {
  return `Usage:
  workbench.bat pvf-change validate --file <change-set.json>
  workbench.bat pvf-change dry-run --file <change-set.json> [--profile <name> | --pvf <override Script.pvf>] [--out <directory>]
  workbench.bat pvf-change apply --file <change-set.json> [--profile <name> | --pvf <override Script.pvf>] (--out <directory> | --output-pvf <Script.pvf>)
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

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function normalizePvfPath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+/g, "/");
}

function samePath(left, right) {
  return path.resolve(left).toLowerCase() === path.resolve(right).toLowerCase();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadWritePolicy() {
  return readJson(path.join(workbenchRoot, "config", "write-policy.json"));
}

function assertControlledWriteRunnerPolicy(writePolicy) {
  const permissionModel = writePolicy.permissionModel || {};
  const runner = writePolicy.controlledWriteRunner || {};
  if (permissionModel.agentMcpWriteToolsEnabled !== false || writePolicy.mcpWriteToolsEnabled !== false) {
    throw new Error("Agent/MCP write tools must remain disabled; only the controlled write runner may write.");
  }
  if (permissionModel.sourceOverwriteAllowed !== false || runner.sourceOverwriteAllowed !== false) {
    throw new Error("Controlled write runner must not allow source PVF overwrite.");
  }
  if (permissionModel.clientWriteAllowed !== false || runner.clientWriteAllowed !== false) {
    throw new Error("Controlled write runner must not allow client resource writes.");
  }
  const allowedBridgeTools = new Set(runner.allowedBridgeTools || []);
  for (const tool of ["pvf_open", "pvf_read_file", "pvf_replace_text", "pvf_backup", "pvf_save", "pvf_close"]) {
    if (!allowedBridgeTools.has(tool)) {
      throw new Error(`controlledWriteRunner.allowedBridgeTools is missing required tool: ${tool}`);
    }
  }
}

function validateChangeSet(changeSet) {
  const errors = [];
  if (changeSet.schemaVersion !== "1.0") {
    errors.push("schemaVersion must be 1.0.");
  }
  if (changeSet.mode !== "dry-run-only") {
    errors.push("mode must be dry-run-only.");
  }
  if (!changeSet.target || typeof changeSet.target.sourcePvf !== "string" || !changeSet.target.sourcePvf.trim()) {
    errors.push("target.sourcePvf is required.");
  }
  if (!Array.isArray(changeSet.changes) || changeSet.changes.length === 0) {
    errors.push("changes must contain at least one entry.");
  }
  if (changeSet.safety?.writeModeEnabled !== false) {
    errors.push("safety.writeModeEnabled must be false.");
  }
  if (changeSet.safety?.requiresBackupBeforeApply !== true) {
    errors.push("safety.requiresBackupBeforeApply must be true.");
  }
  if (changeSet.safety?.requiresExplicitOutputPath !== true) {
    errors.push("safety.requiresExplicitOutputPath must be true.");
  }
  if (changeSet.safety?.requiresReadback !== true) {
    errors.push("safety.requiresReadback must be true.");
  }

  const ids = new Set();
  for (const [index, change] of (changeSet.changes || []).entries()) {
    const prefix = `changes[${index}]`;
    if (!change.id || !/^[A-Za-z0-9._-]+$/.test(change.id)) {
      errors.push(`${prefix}.id is required and must be stable ASCII.`);
    } else if (ids.has(change.id)) {
      errors.push(`Duplicate change id: ${change.id}`);
    }
    ids.add(change.id);
    if (change.type !== "replace-text") {
      errors.push(`${prefix}.type must be replace-text.`);
    }
    if (!change.pvfPath) {
      errors.push(`${prefix}.pvfPath is required.`);
    }
    if (typeof change.previousText !== "string" || change.previousText.length === 0) {
      errors.push(`${prefix}.previousText is required.`);
    }
    if (typeof change.newText !== "string") {
      errors.push(`${prefix}.newText must be a string.`);
    }
    if (/&#\d+;/.test(change.previousText) || /&#\d+;/.test(change.newText)) {
      errors.push(`${prefix}.previousText/newText must not contain HTML numeric entities; read exact source text with raw/no-simplified mode before writing.`);
    }
    if (change.replaceAll !== undefined && typeof change.replaceAll !== "boolean") {
      errors.push(`${prefix}.replaceAll must be boolean when present.`);
    }
  }
  return errors;
}

function countOccurrences(text, needle) {
  if (!needle) {
    return 0;
  }
  let count = 0;
  let index = 0;
  while (true) {
    const found = text.indexOf(needle, index);
    if (found < 0) {
      return count;
    }
    count += 1;
    index = found + needle.length;
  }
}

function replaceText(text, previousText, newText, replaceAll) {
  if (replaceAll) {
    return text.split(previousText).join(newText);
  }
  return text.replace(previousText, newText);
}

function rawTextOptions(changeSet, change, adapterConfig) {
  return {
    pvfEncoding: change?.pvfEncoding || changeSet.target.pvfReadEncoding || adapterConfig.defaults.pvfReadEncoding,
    // Change-set writes must operate on source text, not simplified display text.
    // Simplified display text can be serialized back as HTML numeric entities in TW PVFs.
    convertToSimplifiedChinese: false,
  };
}

function diffSummary(before, after) {
  if (before === after) {
    return {
      changed: false,
      beforeSha256: sha256(before),
      afterSha256: sha256(after),
      beforeLength: before.length,
      afterLength: after.length,
    };
  }
  let start = 0;
  const maxStart = Math.min(before.length, after.length);
  while (start < maxStart && before[start] === after[start]) {
    start += 1;
  }
  let beforeEnd = before.length - 1;
  let afterEnd = after.length - 1;
  while (beforeEnd >= start && afterEnd >= start && before[beforeEnd] === after[afterEnd]) {
    beforeEnd -= 1;
    afterEnd -= 1;
  }
  const context = 160;
  return {
    changed: true,
    beforeSha256: sha256(before),
    afterSha256: sha256(after),
    beforeLength: before.length,
    afterLength: after.length,
    firstDifferenceOffset: start,
    beforeSnippet: before.slice(Math.max(0, start - context), Math.min(before.length, beforeEnd + 1 + context)),
    afterSnippet: after.slice(Math.max(0, start - context), Math.min(after.length, afterEnd + 1 + context)),
  };
}

async function callAndParse(client, name, toolArgs) {
  const result = await client.callTool(name, toolArgs);
  if (result && result.isError) {
    const parsed = parseMcpTextResult(result);
    throw new Error(parsed.error || parsed.text || JSON.stringify(parsed));
  }
  return parseMcpTextResult(result);
}

async function runDryRun(changeSet, changeSetFile, outDirOverride) {
  const adapterConfig = loadAdapterConfig(workbenchRoot);
  assertReadOnlyAdapter(adapterConfig);
  const writePolicy = loadWritePolicy();
  if (writePolicy.mode !== "controlled-output-only" || writePolicy.mcpWriteToolsEnabled !== false) {
    throw new Error("write-policy.json must remain controlled-output-only with mcpWriteToolsEnabled=false.");
  }
  assertControlledWriteRunnerPolicy(writePolicy);

  const explicitPvf = option("--pvf");
  const requestedProfile = option("--profile", changeSet.target.profile);
  const resolvedSource = explicitPvf || requestedProfile
    ? resolveSourcePvf(workbenchRoot, requestedProfile, explicitPvf)
    : { sourcePvf: path.resolve(changeSet.target.sourcePvf), profile: null, source: "change-set" };
  const sourcePvf = resolvedSource.sourcePvf;
  if (!fs.existsSync(sourcePvf)) {
    throw new Error(`PVF file does not exist: ${sourcePvf}`);
  }

  const outRoot = outDirOverride
    ? path.resolve(outDirOverride)
    : runtimePath(workbenchRoot, "dry-runs", timestamp());
  fs.mkdirSync(outRoot, { recursive: true });

  const client = new McpStdioClient(upstreamLaunchOptions(adapterConfig));
  const opened = await callAndParse(client, "pvf_open", {
    path: sourcePvf,
    encoding: changeSet.target.pvfOpenEncoding || adapterConfig.defaults.pvfOpenEncoding,
  });
  const sessionId = opened.session?.sessionId;
  if (!sessionId) {
    throw new Error("pvf_open did not return a sessionId.");
  }

  const results = [];
  try {
    for (const change of changeSet.changes) {
      const pvfPath = normalizePvfPath(change.pvfPath);
      for (const required of change.requiredResolvedIds || []) {
        const resolved = await callAndParse(client, "pvf_resolve_lst_id", {
          sessionId,
          lstPath: required.lstPath,
          id: required.id,
          includeFileSummary: false,
          pvfEncoding: changeSet.target.pvfReadEncoding || adapterConfig.defaults.pvfReadEncoding,
        });
        if (!resolved.found || normalizePvfPath(resolved.entry?.pvfPath) !== normalizePvfPath(required.expectedPvfPath)) {
          throw new Error(`Required ID resolution failed for ${required.lstPath}:${required.id}`);
        }
      }

      const read = await callAndParse(client, "pvf_read_file", {
        sessionId,
        pvfPath,
        ...rawTextOptions(changeSet, change, adapterConfig),
        maxChars: 0,
      });
      if (typeof read.textContent !== "string") {
        throw new Error(`PVF file is not readable as text for dry-run replacement: ${pvfPath}`);
      }
      const occurrenceCount = countOccurrences(read.textContent, change.previousText);
      const replaceAll = change.replaceAll === true;
      const applicable = replaceAll ? occurrenceCount > 0 : occurrenceCount === 1;
      const after = applicable ? replaceText(read.textContent, change.previousText, change.newText, replaceAll) : read.textContent;
      results.push({
        id: change.id,
        type: change.type,
        pvfPath,
        occurrenceCount,
        replaceAll,
        applicable,
        changed: after !== read.textContent,
        fileMetadata: read.metadata,
        diff: diffSummary(read.textContent, after),
        rationale: change.rationale || "",
      });
    }
  } finally {
    try {
      await callAndParse(client, "pvf_close", { sessionId });
    } finally {
      client.stop();
    }
  }

  const manifest = {
    schemaVersion: "1.0",
    phase: "phase-3-dry-run-change-set",
    generatedAt: new Date().toISOString(),
    mode: "dry-run-only",
    writeOperationsExecuted: false,
    sourcePvf,
    changeSetFile: path.resolve(changeSetFile),
    safety: {
      writeToolsEnabled: false,
      backupRequiredBeforeFutureApply: true,
      explicitOutputRequiredBeforeFutureApply: true,
      readbackRequiredBeforeFutureApply: true,
    },
    summary: {
      changeCount: results.length,
      applicableCount: results.filter((item) => item.applicable).length,
      changedCount: results.filter((item) => item.changed).length,
      blockedCount: results.filter((item) => !item.applicable).length,
    },
    results,
  };
  const manifestPath = path.join(outRoot, writePolicy.outputs?.dryRunManifestFileName || "DRY-RUN-MANIFEST.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return { manifestPath, manifest };
}

function resolveApplyPaths(writePolicy, sourcePvf) {
  const outputPvfArg = option("--output-pvf");
  const outArg = option("--out");
  if (!outputPvfArg && !outArg) {
    throw new Error("apply requires --out <directory> or --output-pvf <path>.");
  }
  const runRoot = outputPvfArg ? path.dirname(path.resolve(outputPvfArg)) : path.resolve(outArg);
  const outputPvf = outputPvfArg
    ? path.resolve(outputPvfArg)
    : path.join(runRoot, "output", writePolicy.outputs?.outputFileName || "Script.pvf");
  if (samePath(sourcePvf, outputPvf)) {
    throw new Error("Refusing to save output PVF over the source PVF.");
  }
  const backupPath = path.join(
    runRoot,
    "backups",
    `${path.basename(sourcePvf)}.${timestamp()}.bak`,
  );
  const manifestPath = path.join(runRoot, writePolicy.outputs?.applyManifestFileName || "APPLY-MANIFEST.json");
  return { runRoot, outputPvf, backupPath, manifestPath };
}

async function runApply(changeSet, changeSetFile) {
  const adapterConfig = loadAdapterConfig(workbenchRoot);
  assertReadOnlyAdapter(adapterConfig);
  const writePolicy = loadWritePolicy();
  if (writePolicy.mode !== "controlled-output-only" || writePolicy.controlledApplyEnabled !== true) {
    throw new Error("write-policy.json must enable controlled-output-only apply.");
  }
  assertControlledWriteRunnerPolicy(writePolicy);

  const explicitPvf = option("--pvf");
  const requestedProfile = option("--profile", changeSet.target.profile);
  const resolvedSource = explicitPvf || requestedProfile
    ? resolveSourcePvf(workbenchRoot, requestedProfile, explicitPvf)
    : { sourcePvf: path.resolve(changeSet.target.sourcePvf), profile: null, source: "change-set" };
  const sourcePvf = resolvedSource.sourcePvf;
  if (!fs.existsSync(sourcePvf)) {
    throw new Error(`PVF file does not exist: ${sourcePvf}`);
  }

  const paths = resolveApplyPaths(writePolicy, sourcePvf);
  fs.mkdirSync(path.dirname(paths.outputPvf), { recursive: true });
  fs.mkdirSync(path.dirname(paths.backupPath), { recursive: true });
  fs.mkdirSync(path.dirname(paths.manifestPath), { recursive: true });

  const client = new McpStdioClient(upstreamLaunchOptions(adapterConfig));
  const opened = await callAndParse(client, "pvf_open", {
    path: sourcePvf,
    encoding: changeSet.target.pvfOpenEncoding || adapterConfig.defaults.pvfOpenEncoding,
  });
  const sessionId = opened.session?.sessionId;
  if (!sessionId) {
    throw new Error("pvf_open did not return a sessionId.");
  }

  const results = [];
  const expectedAfterByPath = new Map();
  let backupResult = null;
  let saveResult = null;
  let readbackSessionId = null;

  try {
    for (const change of changeSet.changes) {
      const pvfPath = normalizePvfPath(change.pvfPath);
      for (const required of change.requiredResolvedIds || []) {
        const resolved = await callAndParse(client, "pvf_resolve_lst_id", {
          sessionId,
          lstPath: required.lstPath,
          id: required.id,
          includeFileSummary: false,
          pvfEncoding: changeSet.target.pvfReadEncoding || adapterConfig.defaults.pvfReadEncoding,
        });
        if (!resolved.found || normalizePvfPath(resolved.entry?.pvfPath) !== normalizePvfPath(required.expectedPvfPath)) {
          throw new Error(`Required ID resolution failed for ${required.lstPath}:${required.id}`);
        }
      }

      const beforeRead = await callAndParse(client, "pvf_read_file", {
        sessionId,
        pvfPath,
        ...rawTextOptions(changeSet, change, adapterConfig),
        maxChars: 0,
      });
      if (typeof beforeRead.textContent !== "string") {
        throw new Error(`PVF file is not readable as text for apply: ${pvfPath}`);
      }
      const occurrenceCount = countOccurrences(beforeRead.textContent, change.previousText);
      const replaceAll = change.replaceAll === true;
      const applicable = replaceAll ? occurrenceCount > 0 : occurrenceCount === 1;
      if (!applicable) {
        throw new Error(`Change is not safely applicable: ${change.id} occurrences=${occurrenceCount}`);
      }
      const expectedAfter = replaceText(beforeRead.textContent, change.previousText, change.newText, replaceAll);
      const applyResult = await callAndParse(client, "pvf_replace_text", {
        sessionId,
        pvfPath,
        previousText: change.previousText,
        newText: change.newText,
        replaceAll,
        dryRun: false,
        ...rawTextOptions(changeSet, change, adapterConfig),
      });
      expectedAfterByPath.set(pvfPath, expectedAfter);
      results.push({
        id: change.id,
        type: change.type,
        pvfPath,
        occurrenceCount,
        replaceAll,
        changed: expectedAfter !== beforeRead.textContent,
        beforeSha256: sha256(beforeRead.textContent),
        expectedAfterSha256: sha256(expectedAfter),
        applyResult,
        rationale: change.rationale || "",
      });
    }

    backupResult = await callAndParse(client, "pvf_backup", {
      path: sourcePvf,
      targetPath: paths.backupPath,
    });

    saveResult = await callAndParse(client, "pvf_save", {
      sessionId,
      targetPath: paths.outputPvf,
      allowOverwriteSource: false,
    });
  } finally {
    try {
      await callAndParse(client, "pvf_close", { sessionId });
    } catch {
      // Preserve the original apply error if close fails.
    }
  }

  const readback = [];
  try {
    const reopened = await callAndParse(client, "pvf_open", {
      path: paths.outputPvf,
      encoding: changeSet.target.pvfOpenEncoding || adapterConfig.defaults.pvfOpenEncoding,
    });
    readbackSessionId = reopened.session?.sessionId;
    if (!readbackSessionId) {
      throw new Error("readback pvf_open did not return a sessionId.");
    }
    for (const [pvfPath, expectedText] of expectedAfterByPath.entries()) {
      const rb = await callAndParse(client, "pvf_read_file", {
        sessionId: readbackSessionId,
        pvfPath,
        pvfEncoding: changeSet.target.pvfReadEncoding || adapterConfig.defaults.pvfReadEncoding,
        convertToSimplifiedChinese: false,
        maxChars: 0,
      });
      const actualText = rb.textContent;
      const actualSha256 = typeof actualText === "string" ? sha256(actualText) : null;
      const expectedSha256 = sha256(expectedText);
      readback.push({
        pvfPath,
        ok: actualSha256 === expectedSha256,
        expectedSha256,
        actualSha256,
        metadata: rb.metadata,
      });
    }
  } finally {
    if (readbackSessionId) {
      try {
        await callAndParse(client, "pvf_close", { sessionId: readbackSessionId });
      } catch {
        // No further action.
      }
    }
    client.stop();
  }

  const readbackOk = readback.every((item) => item.ok);
  const manifest = {
    schemaVersion: "1.0",
    phase: "phase-3-controlled-output-apply",
    generatedAt: new Date().toISOString(),
    mode: "controlled-output-only",
    writeOperationsExecuted: true,
    sourcePvf,
    outputPvf: paths.outputPvf,
    backupPath: paths.backupPath,
    changeSetFile: path.resolve(changeSetFile),
    sourceProfile: resolvedSource.profile?.name || null,
    safety: {
      sourceOverwriteAllowed: false,
      sourceOverwritten: false,
      backupCreated: Boolean(backupResult?.targetPath && fs.existsSync(backupResult.targetPath)),
      explicitOutputPath: true,
      readbackExecuted: true,
      readbackOk,
      clientResourceWrite: false,
    },
    summary: {
      changeCount: results.length,
      changedCount: results.filter((item) => item.changed).length,
      outputExists: fs.existsSync(paths.outputPvf),
      backupExists: fs.existsSync(paths.backupPath),
      readbackOk,
    },
    backupResult,
    saveResult,
    results,
    readback,
  };
  fs.writeFileSync(paths.manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  if (!readbackOk) {
    throw new Error(`Apply readback failed. Manifest: ${paths.manifestPath}`);
  }
  return { manifestPath: paths.manifestPath, manifest };
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  if (!command || command === "help" || command === "--help") {
    process.stdout.write(usage());
    return;
  }
  const file = path.resolve(requireOption("--file"));
  const changeSet = readJson(file);
  const validationErrors = validateChangeSet(changeSet);
  if (validationErrors.length > 0) {
    printJson({ ok: false, command, errors: validationErrors });
    process.exit(1);
  }
  if (command === "validate") {
    printJson({ ok: true, command, file, changeCount: changeSet.changes.length });
    return;
  }
  if (command === "dry-run") {
    const { manifestPath, manifest } = await runDryRun(changeSet, file, option("--out"));
    printJson({
      ok: true,
      command,
      manifestPath,
      summary: manifest.summary,
    });
    if (manifest.summary.blockedCount > 0) {
      process.exit(2);
    }
    return;
  }
  if (command === "apply") {
    const { manifestPath, manifest } = await runApply(changeSet, file);
    printJson({
      ok: true,
      command,
      manifestPath,
      outputPvf: manifest.outputPvf,
      backupPath: manifest.backupPath,
      summary: manifest.summary,
    });
    return;
  }
  throw new Error(`Unsupported command: ${command}`);
}

main().catch((error) => {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
});
