"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function scriptPath(name) {
  return path.join(__dirname, name);
}

function runNode(scriptName, args) {
  const result = spawnSync(process.execPath, [scriptPath(scriptName), ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (result.status !== 0) {
    throw new Error(`${scriptName} failed with exit code ${result.status}`);
  }
  return result.stdout;
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function countLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

function extractMode() {
  const sourcePvf = argValue("source-pvf", argValue("pvf", ""));
  const out = argValue("out", "");
  const dungeonId = argValue("dungeon-id", "");
  const dungeonName = argValue("dungeon-name", "");
  const dungeonPath = argValue("dungeon-path", "");
  const imagePacks = argValue("imagepacks", "");

  if (!sourcePvf) {
    throw new Error("Extract mode requires --source-pvf=PATH or --pvf=PATH.");
  }
  if (!out) {
    throw new Error("Extract mode requires --out=DIR so later import/validation has a stable path.");
  }
  if (!dungeonId && !dungeonName && !dungeonPath) {
    throw new Error("Extract mode requires one of --dungeon-id, --dungeon-name, or --dungeon-path.");
  }

  const extractArgs = [`--pvf=${sourcePvf}`, `--out=${out}`];
  if (dungeonId) extractArgs.push(`--dungeon-id=${dungeonId}`);
  if (dungeonName) extractArgs.push(`--dungeon-name=${dungeonName}`);
  if (dungeonPath) extractArgs.push(`--dungeon-path=${dungeonPath}`);

  runNode("extract-dungeon.js", extractArgs);

  const extractDir = path.resolve(out);
  const manifest = readJson(path.join(extractDir, "manifest.json"), {});
  const missingRefCount = countLines(path.join(extractDir, "missing_refs.txt"));
  const readErrors = readJson(path.join(extractDir, "read_errors.json"), {});
  const readErrorCount = Object.keys(readErrors || {}).length;

  let assetManifest = null;
  if (imagePacks) {
    runNode("package-dungeon-assets.js", [`--extract-dir=${extractDir}`, `--imagepacks=${imagePacks}`]);
    assetManifest = readJson(path.join(extractDir, "asset_manifest.json"), null);
  }

  const summary = {
    ok: readErrorCount === 0,
    mode: "extract",
    extractDir,
    dungeon: manifest.dungeon || null,
    extractedFileCount: manifest.extractedFileCount || 0,
    cleanPvfClosure: missingRefCount === 0,
    missingRefCount,
    readErrorCount,
    packagedAssets: Boolean(assetManifest),
    selectedImgCount: assetManifest ? assetManifest.selectedImgCount : null,
    avatarLayerImageCheck: assetManifest ? assetManifest.avatarLayerImageCheck || null : null,
    warnings: [
      missingRefCount > 0
        ? "missing_refs.txt is non-empty. Inspect it, but do not assume the dungeon is unusable; some refs are indirect, template, client-side, or outside the selected closure."
        : "",
      assetManifest && assetManifest.avatarLayerImageCheck && assetManifest.avatarLayerImageCheck.missingImgCount > 0
        ? "Client ImagePacks2 is missing avatar layer art. This is not a missed PVF extraction dependency."
        : "",
    ].filter(Boolean),
  };

  const metaDir = ensureDir(path.join(extractDir, "_meta"));
  fs.writeFileSync(path.join(metaDir, "workflow-extract-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) {
    process.exitCode = 1;
  }
}

function importMode() {
  const extractDir = path.resolve(argValue("extract-dir", ""));
  const targetPvf = argValue("target-pvf", "");
  const outPvf = argValue("out-pvf", "");
  const apply = hasFlag("apply");
  const compareExisting = hasFlag("compare-existing");
  const replaceExisting = hasFlag("replace-existing");

  if (!extractDir || extractDir === path.resolve("")) {
    throw new Error("Import mode requires --extract-dir=DIR.");
  }
  if (!targetPvf) {
    throw new Error("Import mode requires --target-pvf=PATH.");
  }

  const importArgs = [`--extract-dir=${extractDir}`, `--target-pvf=${targetPvf}`];
  if (outPvf) importArgs.push(`--out-pvf=${outPvf}`);
  if (apply) importArgs.push("--apply");
  if (replaceExisting) importArgs.push("--replace-existing");
  runNode("import-dungeon-extract.js", importArgs);

  const metaDir = ensureDir(path.join(extractDir, "_meta"));
  const importResultPath = path.join(metaDir, apply ? "import-result.json" : "import-plan.json");
  const importResult = readJson(importResultPath, {});
  let existingDependencyComparePath = null;

  if (compareExisting && importResult.backupPath) {
    existingDependencyComparePath = path.join(metaDir, "existing-content-compare.json");
    runNode("compare-existing-dependencies.js", [
      `--extract-dir=${extractDir}`,
      `--target-pvf=${importResult.backupPath}`,
      `--report=${existingDependencyComparePath}`,
    ]);
  }

  const summary = {
    ok: Boolean(importResult.ok),
    mode: "import",
    applied: Boolean(importResult.applied),
    extractDir,
    targetPvf: path.resolve(targetPvf),
    outputPath: importResult.outputPath || null,
    backupPath: importResult.backupPath || null,
    replaceExisting: Boolean(importResult.replaceExisting),
    filesToWriteCount: importResult.filesToWriteCount || 0,
    newFileWriteCount: importResult.newFileWriteCount || 0,
    replacedExistingCount: importResult.replacedExistingCount || 0,
    filesAlreadyPresentCount: importResult.filesAlreadyPresentCount || 0,
    registryAdditions: importResult.registryAdditions || 0,
    conflictCount: importResult.conflictCount || 0,
    missingLocalFileCount: importResult.missingLocalFileCount || 0,
    existingDependencyComparePath,
    note:
      "Import writes dungeon dependency files and registries only. It does not automatically add unrelated global drop tables such as etc/worlddrop*.",
  };
  fs.writeFileSync(path.join(metaDir, "workflow-import-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) {
    process.exitCode = 1;
  }
}

function printUsage() {
  console.log(`Usage:
  node tools/pvf-bridge/dungeon-workflow.js --mode=extract --source-pvf=Script.pvf --dungeon-id=323 --out=extract-dir [--imagepacks=ImagePacks2]
  node tools/pvf-bridge/dungeon-workflow.js --mode=import --extract-dir=extract-dir --target-pvf=target.pvf [--apply] [--compare-existing] [--replace-existing]

Rules:
  extract mode checks missing_refs/read_errors and, when imagepacks is provided, avatarLayerImageCheck.
  import mode dry-runs by default. Use --apply to write. Use --replace-existing only when intentionally overlaying extracted files over same-path target files.
`);
}

function main() {
  const mode = argValue("mode", "").toLowerCase();
  if (hasFlag("help") || !mode) {
    printUsage();
    return;
  }
  if (mode === "extract") {
    extractMode();
    return;
  }
  if (mode === "import") {
    importMode();
    return;
  }
  throw new Error(`Unknown --mode=${mode}. Expected extract or import.`);
}

try {
  main();
} catch (error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
}
