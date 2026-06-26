"use strict";

const fs = require("fs");
const path = require("path");

const GENERATED_BASENAMES = new Set(
  [
    "npk_img_save.txt",
    "asset_manifest.json",
    "missing_optional_seed_refs.txt",
    "external_refs.txt",
    "list.txt",
    "list.codex.txt",
    "manifest.json",
    "\u6574\u5408\u7684npk.npk",
  ].map((value) => value.toLowerCase())
);

function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function printUsage() {
  console.log(`Usage:
  node tools/pvf-bridge/clean-client-compatible-extract.js --extract-dir=DIR --out=DIR [--missing-optional=missing_optional_seed_refs.txt]

Rules:
  --extract-dir and --out are required. The output directory is deleted and recreated, so it must not contain or be contained by the source extract.
`);
}

function normalizePvfPath(value) {
  return String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/")
    .trim();
}

function normalizeKey(value) {
  return normalizePvfPath(value).toLowerCase();
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveInsideWorkspace(targetPath) {
  const resolved = path.resolve(targetPath);
  const cwd = process.cwd();
  if (!isInside(cwd, resolved)) {
    throw new Error(`Refusing to write outside workspace: ${resolved}`);
  }
  return resolved;
}

function readLines(filePath) {
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/);
}

function removeTree(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function isGeneratedRootArtifact(relPath) {
  const normalized = normalizeKey(relPath);
  return (
    GENERATED_BASENAMES.has(path.posix.basename(normalized)) ||
    /\.hash$/i.test(normalized)
  );
}

function toEquipmentEntryKey(relPath) {
  return normalizeKey(relPath).replace(/^equipment\//, "");
}

function parseMissingOptionalRefs(filePath) {
  return readLines(filePath).map(normalizePvfPath).filter(Boolean);
}

function refVariants(refPath) {
  const normalized = normalizePvfPath(refPath);
  const variants = new Set();
  const withoutSprite = normalized.replace(/^sprite\//i, "");
  variants.add(normalizeKey(normalized));
  variants.add(normalizeKey(withoutSprite));
  variants.add(normalizeKey(`sprite/${withoutSprite}`));
  variants.add(path.posix.basename(withoutSprite).toLowerCase());
  return Array.from(variants.values()).filter(Boolean);
}

function canReadAsText(filePath) {
  return /\.(ani|equ|mob|map|dgn|stk|npc|qst|etc|lst|txt|act|atk|ai|ptl|til|obj|app|chr|nut)$/i.test(filePath);
}

function scanMissingRefUsage(extractDir, refs) {
  const usage = new Map(refs.map((ref) => [ref, []]));

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === "_meta") {
        continue;
      }
      const fullPath = path.join(currentDir, entry.name);
      const relPath = normalizePvfPath(path.relative(extractDir, fullPath));
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (isGeneratedRootArtifact(relPath)) {
        continue;
      }
      if (!canReadAsText(fullPath)) {
        continue;
      }

      let text;
      try {
        text = fs.readFileSync(fullPath, "utf8").toLowerCase();
      } catch {
        continue;
      }

      for (const ref of refs) {
        const hit = refVariants(ref).some((variant) => text.includes(variant));
        if (hit) {
          usage.get(ref).push(relPath);
        }
      }
    }
  }

  walk(extractDir);
  return usage;
}

function deriveEquipmentDrops(extractDir, usage) {
  const dropEntries = new Set();
  const dropSupportDirs = new Set();
  const actualUsage = new Map();
  const orphanSeeds = [];

  for (const [ref, files] of usage.entries()) {
    const uniqueFiles = Array.from(new Set(files)).sort((a, b) => a.localeCompare(b));
    if (!uniqueFiles.length) {
      orphanSeeds.push(ref);
      continue;
    }
    actualUsage.set(ref, uniqueFiles);

    for (const relPath of uniqueFiles) {
      const normalized = normalizePvfPath(relPath);
      if (!normalized.startsWith("equipment/")) {
        continue;
      }

      const supportDir = normalizePvfPath(path.posix.dirname(normalized));
      const variantToken = path.posix.basename(supportDir);
      const parentDir = path.join(extractDir, path.dirname(supportDir));
      if (!fs.existsSync(parentDir)) {
        continue;
      }

      dropSupportDirs.add(supportDir);
      for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) {
        if (!entry.isFile() || !/\.equ$/i.test(entry.name)) {
          continue;
        }
        const fullPath = path.join(parentDir, entry.name);
        let text = "";
        try {
          text = fs.readFileSync(fullPath, "utf8");
        } catch {
          continue;
        }
        const pattern = new RegExp(`\`\\s*${variantToken}\\s*\``, "i");
        if (pattern.test(text)) {
          const relEquPath = normalizePvfPath(path.relative(path.join(extractDir, "equipment"), fullPath));
          dropEntries.add(relEquPath);
        }
      }
    }
  }

  return {
    actualUsage,
    orphanSeeds: orphanSeeds.sort((a, b) => a.localeCompare(b)),
    dropEntries: Array.from(dropEntries.values()).sort((a, b) => a.localeCompare(b)),
    dropSupportDirs: Array.from(dropSupportDirs.values()).sort((a, b) => a.localeCompare(b)),
  };
}

function shouldDropPath(relPath, dropEntries, dropSupportDirs) {
  const normalized = normalizeKey(relPath);
  if (dropEntries.has(normalized) || dropEntries.has(toEquipmentEntryKey(normalized))) {
    return true;
  }
  for (const dir of dropSupportDirs) {
    if (normalized === dir || normalized.startsWith(`${dir}/`)) {
      return true;
    }
  }
  return false;
}

function copyCompatibleTree(srcDir, outDir, dropEntries, dropSupportDirs) {
  function walk(currentSrc, currentDst) {
    fs.mkdirSync(currentDst, { recursive: true });
    for (const entry of fs.readdirSync(currentSrc, { withFileTypes: true })) {
      const srcPath = path.join(currentSrc, entry.name);
      const relPath = normalizePvfPath(path.relative(srcDir, srcPath));
      if (isGeneratedRootArtifact(relPath) || shouldDropPath(relPath, dropEntries, dropSupportDirs)) {
        continue;
      }
      const dstPath = path.join(currentDst, entry.name);
      if (entry.isDirectory()) {
        walk(srcPath, dstPath);
      } else {
        copyFile(srcPath, dstPath);
      }
    }
  }

  walk(srcDir, outDir);
}

function filterListFile(sourcePath, outputPath, dropEntries) {
  const lines = readLines(sourcePath);
  const kept = [];
  let removed = 0;
  for (const line of lines) {
    const match = line.match(/^(\d+)\s+`([^`]+)`\s*$/);
    if (!match) {
      kept.push(line);
      continue;
    }
    const relPath = normalizeKey(match[2]);
    if (dropEntries.has(relPath)) {
      removed += 1;
      continue;
    }
    kept.push(line);
  }
  fs.writeFileSync(outputPath, `${kept.join("\r\n")}\r\n`, "utf8");
  return { keptLineCount: kept.length, removedEntryCount: removed };
}

function filterExternalRefs(sourcePath, outputPath, missingRefs, dropEntries, dropSupportDirs) {
  const missingKeys = new Set(missingRefs.map(normalizeKey));
  const lines = [];
  for (const rawLine of readLines(sourcePath)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    const arrow = line.lastIndexOf(" -> ");
    const sourceRaw = arrow >= 0 ? line.slice(0, arrow).trim() : "";
    const imgRaw = arrow >= 0 ? line.slice(arrow + 4).trim() : line;
    const imgKey = normalizeKey(imgRaw);
    if (missingKeys.has(imgKey)) {
      continue;
    }
    const sourceKey = normalizeKey(sourceRaw);
    if (sourceKey && !sourceKey.startsWith("__seed__/right/")) {
      const sourcePathKey = normalizeKey(sourceRaw);
      if (
        dropEntries.has(toEquipmentEntryKey(sourcePathKey)) ||
        shouldDropPath(sourcePathKey, dropEntries, dropSupportDirs)
      ) {
        continue;
      }
    }
    lines.push(line);
  }
  fs.writeFileSync(outputPath, `${lines.join("\r\n")}\r\n`, "utf8");
  return lines.length;
}

function filterPackagingSeed(sourcePath, outputPath, missingRefs) {
  if (!fs.existsSync(sourcePath)) {
    return null;
  }
  const missingKeys = new Set(missingRefs.map(normalizeKey));
  const kept = readLines(sourcePath)
    .map(normalizePvfPath)
    .filter(Boolean)
    .filter((value) => !missingKeys.has(normalizeKey(value)) && !missingKeys.has(normalizeKey(`sprite/${value}`)));
  fs.writeFileSync(outputPath, `${kept.join("\r\n")}\r\n`, "utf8");
  return { keptCount: kept.length };
}

function writeCleanupReport(outputRoot, report) {
  const metaDir = path.join(outputRoot, "_meta");
  fs.mkdirSync(metaDir, { recursive: true });
  fs.writeFileSync(path.join(metaDir, "client-compat-cleanup.json"), JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(path.join(outputRoot, "manifest.json"), JSON.stringify(report, null, 2), "utf8");
}

function main() {
  if (hasFlag("help") || hasFlag("?")) {
    printUsage();
    return;
  }
  const rawExtractDir = argValue("extract-dir", "");
  const rawOut = argValue("out", "");
  if (!rawExtractDir) {
    throw new Error("Use --extract-dir=DIR. Refusing to infer a source extract directory.");
  }
  if (!rawOut) {
    throw new Error("Use --out=DIR. Refusing to delete and recreate an implicit output directory.");
  }
  const extractDir = resolveInsideWorkspace(rawExtractDir);
  const outDir = resolveInsideWorkspace(rawOut);
  if (isInside(extractDir, outDir) || isInside(outDir, extractDir)) {
    throw new Error("Refusing overlapping --extract-dir and --out paths.");
  }
  const missingPath = path.resolve(argValue("missing-optional", path.join(extractDir, "missing_optional_seed_refs.txt")));
  const sourceListPath = fs.existsSync(path.join(extractDir, "list.codex.txt"))
    ? path.join(extractDir, "list.codex.txt")
    : path.join(extractDir, "list.txt");

  if (!extractDir || !fs.existsSync(extractDir)) {
    throw new Error(`Extract directory does not exist: ${extractDir}`);
  }
  if (!fs.existsSync(missingPath)) {
    throw new Error(`Missing optional seed list was not found: ${missingPath}`);
  }

  const missingRefs = parseMissingOptionalRefs(missingPath);
  const usage = scanMissingRefUsage(extractDir, missingRefs);
  const plan = deriveEquipmentDrops(extractDir, usage);
  const dropEntryKeys = new Set(plan.dropEntries.map(normalizeKey));
  const dropSupportDirKeys = new Set(plan.dropSupportDirs.map(normalizeKey));

  removeTree(outDir);
  copyCompatibleTree(extractDir, outDir, dropEntryKeys, dropSupportDirKeys);

  const listSummary = filterListFile(sourceListPath, path.join(outDir, "list.txt"), dropEntryKeys);
  filterListFile(sourceListPath, path.join(outDir, "list.codex.txt"), dropEntryKeys);
  const externalRefCount = filterExternalRefs(
    path.join(extractDir, "external_refs.txt"),
    path.join(outDir, "external_refs.txt"),
    missingRefs,
    dropEntryKeys,
    dropSupportDirKeys
  );
  const packagingSeedSummary = filterPackagingSeed(
    path.join(extractDir, "_meta", "packaging_seed_img.txt"),
    path.join(outDir, "_meta", "packaging_seed_img.txt"),
    missingRefs
  );

  const report = {
    ok: true,
    sourceExtractDir: extractDir,
    outputDir: outDir,
    sourceListPath,
    missingOptionalRefCount: missingRefs.length,
    orphanSeedRefCount: plan.orphanSeeds.length,
    orphanSeedRefs: plan.orphanSeeds,
    fileBackedMissingRefs: Object.fromEntries(Array.from(plan.actualUsage.entries())),
    droppedEquipmentEntryCount: plan.dropEntries.length,
    droppedEquipmentEntries: plan.dropEntries,
    droppedSupportDirCount: plan.dropSupportDirs.length,
    droppedSupportDirs: plan.dropSupportDirs,
    listSummary,
    filteredExternalRefCount: externalRefCount,
    packagingSeedSummary,
    generatedAt: new Date().toISOString(),
  };

  writeCleanupReport(outDir, report);
  console.log(JSON.stringify(report, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
}
