"use strict";

const fs = require("fs");
const path = require("path");

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
  node tools/pvf-bridge/materialize-dungeon-preset.js --manifest=retention-manifest.json --preset=feature_complete_dungeon --out=DIR

Rules:
  Materializes a local extract preset into a new output directory. The output directory must be inside the current workspace and must not already exist.
`);
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function normalizeRel(value) {
  return String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/")
    .trim();
}

function normalizeKey(value) {
  return normalizeRel(value).toLowerCase();
}

function normalizeImgKey(value) {
  let key = normalizeKey(value);
  if (key.startsWith("sprite/")) {
    key = key.slice("sprite/".length);
  }
  return key;
}

function ensureMissing(targetPath) {
  const resolved = path.resolve(targetPath);
  const cwd = process.cwd();
  if (!isInside(cwd, resolved)) {
    throw new Error(`Refusing to write outside workspace: ${resolved}`);
  }
  if (fs.existsSync(resolved)) {
    throw new Error(`Output directory already exists: ${resolved}`);
  }
  fs.mkdirSync(resolved, { recursive: true });
  return resolved;
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function walkFiles(rootDir) {
  const out = [];
  const pending = [rootDir];
  while (pending.length) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      out.push({
        relPath: normalizeRel(path.relative(rootDir, fullPath)),
        fullPath,
      });
    }
  }
  out.sort((a, b) => a.relPath.localeCompare(b.relPath));
  return out;
}

function fileMap(rootDir) {
  const map = new Map();
  for (const file of walkFiles(rootDir)) {
    map.set(normalizeKey(file.relPath), file);
  }
  return map;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  ensureParent(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyFile(sourcePath, targetPath) {
  ensureParent(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
}

function parseListFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const sections = [];
  let current = null;
  const lines = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").split("\n");
  for (const line of lines) {
    const heading = line.match(/^\uFEFF?\s*([A-Za-z_]+).*?list/i);
    if (heading) {
      current = {
        section: heading[1].toLowerCase(),
        entries: [],
      };
      sections.push(current);
      continue;
    }
    if (!current) {
      continue;
    }
    const entry = line.match(/^\s*(-?\d+)\s+`([^`]+)`/);
    if (!entry) {
      continue;
    }
    current.entries.push({
      id: Number(entry[1]),
      rawPath: normalizeRel(entry[2]),
    });
  }
  return sections;
}

function listSectionRoot(section) {
  if (section === "quest") {
    return "n_quest";
  }
  return section;
}

function listEntryKey(section, rawPath) {
  return normalizeKey(`${listSectionRoot(section)}/${rawPath}`);
}

function generateListFile(selectedKeys, leftListPath, rightListPath, outputPath) {
  const orderedSections = [];
  const bySection = new Map();
  const seenEntryKeys = new Set();

  function pushEntry(sectionName, entry) {
    if (!bySection.has(sectionName)) {
      bySection.set(sectionName, []);
      orderedSections.push(sectionName);
    }
    const dedupeKey = `${sectionName}|${entry.id}|${normalizeKey(entry.rawPath)}`;
    if (seenEntryKeys.has(dedupeKey)) {
      return;
    }
    seenEntryKeys.add(dedupeKey);
    bySection.get(sectionName).push(entry);
  }

  for (const section of [...parseListFile(leftListPath), ...parseListFile(rightListPath)]) {
    for (const entry of section.entries) {
      if (!selectedKeys.has(listEntryKey(section.section, entry.rawPath))) {
        continue;
      }
      pushEntry(section.section, entry);
    }
  }

  const lines = [];
  for (const sectionName of orderedSections) {
    const entries = bySection.get(sectionName);
    if (!entries || !entries.length) {
      continue;
    }
    lines.push(`${sectionName} needs list`);
    for (const entry of entries) {
      lines.push(`${entry.id}\t\`${entry.rawPath}\``);
    }
    lines.push("");
    lines.push("");
  }
  ensureParent(outputPath);
  fs.writeFileSync(outputPath, `${lines.join("\r\n")}\r\n`, "utf8");
  return {
    sectionCount: orderedSections.length,
    entryCount: Array.from(bySection.values()).reduce((sum, entries) => sum + entries.length, 0),
  };
}

function parseExternalRefLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const out = [];
  const lines = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").split("\n");
  for (const line of lines) {
    if (!line.includes("->")) {
      continue;
    }
    const [left, right] = line.split("->", 2);
    const sourceRaw = normalizeRel(left);
    const imgRaw = normalizeRel(right);
    if (!sourceRaw || !imgRaw) {
      continue;
    }
    out.push({
      sourceRaw,
      sourceKey: normalizeKey(sourceRaw),
      imgRaw,
      imgKey: normalizeImgKey(imgRaw),
      line: `${sourceRaw} -> ${imgRaw}`,
    });
  }
  return out;
}

function parseImageList(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs
    .readFileSync(filePath, "utf8")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => normalizeRel(line))
    .filter(Boolean)
    .map((rawPath) => ({
      rawPath,
      key: normalizeImgKey(rawPath),
    }));
}

function firstSegment(relPath) {
  const normalized = normalizeRel(relPath);
  const slash = normalized.indexOf("/");
  return slash >= 0 ? normalized.slice(0, slash).toLowerCase() : "(top)";
}

function countByRoot(values) {
  const counts = new Map();
  for (const value of values) {
    const root = firstSegment(value);
    counts.set(root, (counts.get(root) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function buildSemanticActionMap(manifest) {
  const map = new Map();
  for (const bucket of manifest.semanticReview || []) {
    for (const file of bucket.files || []) {
      map.set(normalizeKey(file), bucket.action);
    }
  }
  return map;
}

function includeCategoryEntries(buckets, includeActions) {
  const result = [];
  for (const bucket of buckets || []) {
    const action = bucket.policy?.action;
    if (!includeActions.has(action)) {
      continue;
    }
    for (const entry of bucket.entries || []) {
      result.push(normalizeRel(entry));
    }
  }
  return result;
}

function materializePreset(manifestPath, presetName, outputDir) {
  const manifest = readJson(manifestPath);
  const preset = (manifest.presets || []).find((item) => item.name === presetName);
  if (!preset) {
    throw new Error(`Preset was not found: ${presetName}`);
  }

  const leftDir = manifest.leftDir;
  const rightDir = manifest.rightDir;
  const leftFiles = fileMap(leftDir);
  const rightFiles = fileMap(rightDir);
  const includeActions = new Set(preset.includeActions || []);
  const outputRoot = ensureMissing(outputDir);
  const semanticActions = buildSemanticActionMap(manifest);
  const selectedKeys = new Set();
  const copiedFromLeft = [];
  const copiedFromRight = [];
  const regenerated = [];
  const unresolved = [];

  for (const [key, leftFile] of leftFiles.entries()) {
    const rightFile = rightFiles.get(key);
    if (!rightFile) {
      continue;
    }
    if (key === "list.txt" || key === "external_refs.txt" || key === "manifest.json") {
      regenerated.push(leftFile.relPath);
      continue;
    }
    const action = semanticActions.get(key) || "prefer_left";
    if (action === "regenerate") {
      regenerated.push(leftFile.relPath);
      continue;
    }
    const chosen = action === "prefer_right" ? rightFile : leftFile;
    if (action === "manual_review") {
      unresolved.push(leftFile.relPath);
    }
    copyFile(chosen.fullPath, path.join(outputRoot, chosen.relPath));
    selectedKeys.add(key);
    if (chosen === leftFile) {
      copiedFromLeft.push(chosen.relPath);
    } else {
      copiedFromRight.push(chosen.relPath);
    }
  }

  for (const relPath of includeCategoryEntries(manifest.leftOnlyCategories, includeActions)) {
    const key = normalizeKey(relPath);
    const file = leftFiles.get(key);
    if (!file) {
      continue;
    }
    copyFile(file.fullPath, path.join(outputRoot, file.relPath));
    selectedKeys.add(key);
    copiedFromLeft.push(file.relPath);
  }

  for (const relPath of includeCategoryEntries(manifest.rightOnlyCategories, includeActions)) {
    const key = normalizeKey(relPath);
    const file = rightFiles.get(key);
    if (!file) {
      continue;
    }
    copyFile(file.fullPath, path.join(outputRoot, file.relPath));
    selectedKeys.add(key);
    copiedFromRight.push(file.relPath);
  }

  const listSummary = generateListFile(
    selectedKeys,
    path.join(leftDir, "list.txt"),
    path.join(rightDir, "list.txt"),
    path.join(outputRoot, "list.txt")
  );

  const leftExternalRefs = parseExternalRefLines(path.join(leftDir, "external_refs.txt"));
  const includedLeftRefs = leftExternalRefs.filter((entry) => selectedKeys.has(entry.sourceKey));
  const includedImgKeys = new Set(includedLeftRefs.map((entry) => entry.imgKey));

  const rightImages = parseImageList(path.join(rightDir, "NPK_IMG_save.txt"));
  const syntheticRefs = [];
  if (includeActions.has("keep_if_expansion_enabled")) {
    for (const image of rightImages) {
      if (includedImgKeys.has(image.key)) {
        continue;
      }
      includedImgKeys.add(image.key);
      syntheticRefs.push({
        sourceRaw: `__seed__/right/${String(syntheticRefs.length + 1).padStart(4, "0")}`,
        imgRaw: image.rawPath,
      });
    }
  }

  const externalRefLines = [];
  for (const entry of includedLeftRefs) {
    externalRefLines.push(`${entry.sourceRaw} -> ${entry.imgRaw}`);
  }
  for (const entry of syntheticRefs) {
    externalRefLines.push(`${entry.sourceRaw} -> ${entry.imgRaw}`);
  }
  fs.writeFileSync(path.join(outputRoot, "external_refs.txt"), `${externalRefLines.join("\r\n")}\r\n`, "utf8");

  const metaDir = path.join(outputRoot, "_meta");
  fs.mkdirSync(metaDir, { recursive: true });
  copyFile(manifestPath, path.join(metaDir, "retention-manifest.json"));
  fs.writeFileSync(
    path.join(metaDir, "packaging_seed_img.txt"),
    `${Array.from(includedImgKeys.values()).sort().join("\r\n")}\r\n`,
    "utf8"
  );
  if (unresolved.length) {
    fs.writeFileSync(path.join(metaDir, "manual_review.txt"), `${unresolved.join("\r\n")}\r\n`, "utf8");
  }

  const outputManifest = {
    ok: unresolved.length === 0,
    preset: preset.name,
    presetLabel: preset.label,
    includeActions: preset.includeActions,
    leftDir,
    rightDir,
    selectedFileCount: selectedKeys.size,
    copiedFromLeftCount: copiedFromLeft.length,
    copiedFromRightCount: copiedFromRight.length,
    regeneratedFiles: regenerated,
    unresolvedManualReviewCount: unresolved.length,
    unresolvedManualReviewSample: unresolved.slice(0, 30),
    listSummary,
    externalRefs: {
      directSourceRefCount: includedLeftRefs.length,
      syntheticSeedRefCount: syntheticRefs.length,
      totalRefCount: externalRefLines.length,
    },
    selectedRootCounts: countByRoot(Array.from(selectedKeys.values())),
    generatedAt: new Date().toISOString(),
  };
  writeJson(path.join(outputRoot, "manifest.json"), outputManifest);
  writeJson(path.join(metaDir, "materialization-summary.json"), outputManifest);

  return {
    outputRoot,
    manifest: outputManifest,
  };
}

function main() {
  if (hasFlag("help") || hasFlag("?")) {
    printUsage();
    return;
  }
  const manifestPathArg = argValue("manifest", "");
  const presetName = argValue("preset", "feature_complete_dungeon");
  const outputDirArg = argValue("out", "");
  if (!manifestPathArg || !outputDirArg) {
    throw new Error("Provide --manifest=FILE and --out=DIR.");
  }
  const manifestPath = path.resolve(manifestPathArg);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file does not exist: ${manifestPath}`);
  }
  const result = materializePreset(manifestPath, presetName, outputDirArg);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
