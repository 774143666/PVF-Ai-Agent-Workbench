"use strict";

const fs = require("fs");
const path = require("path");

function findBundledNativeBackend() {
  if (process.env.PVF_XPILOT_NATIVE) {
    return process.env.PVF_XPILOT_NATIVE;
  }
  const localCandidates = [
    path.join(__dirname, "native", "pvf_rust_core.node"),
    path.join(__dirname, "pvf_rust_core.node"),
  ];
  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  const homes = [process.env.USERPROFILE, process.env.HOME].filter(Boolean);
  const extensionRoots = [];
  for (const home of homes) {
    extensionRoots.push(path.join(home, ".vscode", "extensions"));
    extensionRoots.push(path.join(home, ".vscode-insiders", "extensions"));
  }
  const candidates = [];
  for (const root of extensionRoots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^dof\.pvf-x-pilot-/i.test(entry.name)) {
        continue;
      }
      const nativePath = path.join(root, entry.name, "dist", "native", "pvf_rust_core.node");
      if (fs.existsSync(nativePath)) {
        candidates.push(nativePath);
      }
    }
  }
  candidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!candidates.length) {
    throw new Error("PVF X-Pilot native backend was not found. Set PVF_XPILOT_NATIVE to pvf_rust_core.node.");
  }
  return candidates[0];
}

const native = require(findBundledNativeBackend());

const REGISTRY_PATHS = {
  aicharacter: "aicharacter/aicharacter.lst",
  appendage: "appendage/appendage.lst",
  dungeon: "dungeon/dungeon.lst",
  equipment: "equipment/equipment.lst",
  map: "map/map.lst",
  monster: "monster/monster.lst",
  npc: "npc/npc.lst",
  passiveobject: "passiveobject/passiveobject.lst",
  stackable: "stackable/stackable.lst",
};

function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
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

function resolveInsideWorkspace(targetPath, label) {
  const resolved = path.resolve(targetPath || "");
  const cwd = process.cwd();
  if (!targetPath || !isInside(cwd, resolved)) {
    throw new Error(`Refusing ${label || "path"} outside workspace: ${resolved}`);
  }
  return resolved;
}

function localPath(extractDir, pvfPath) {
  return path.join(extractDir, ...normalizePvfPath(pvfPath).split("/"));
}

function timestamp() {
  const d = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join("");
}

function registryPathForSection(section) {
  const normalized = normalizePvfPath(section);
  if (/\.lst$/i.test(normalized)) {
    return normalized;
  }
  const hit = REGISTRY_PATHS[normalized.toLowerCase()];
  if (!hit) {
    throw new Error(`Unsupported registry section: ${section}`);
  }
  return hit;
}

function registryBaseDir(registryPath) {
  const normalized = normalizePvfPath(registryPath);
  return path.posix.dirname(normalized);
}

function resolveRegisteredPath(registryPath, rawPath) {
  const raw = normalizePvfPath(rawPath);
  const baseDir = registryBaseDir(registryPath);
  if (!baseDir || baseDir === ".") {
    return raw;
  }
  return normalizeKey(raw).startsWith(`${normalizeKey(baseDir)}/`) ? raw : normalizePvfPath(`${baseDir}/${raw}`);
}

function parseImportList(listPath) {
  const registries = new Map();
  let current;
  for (const line of fs.readFileSync(listPath, "utf8").split(/\r?\n/)) {
    const header = line.match(/^\s*(.+?)\s*(?:needs list|\u9700\u8981\u6dfb\u52a0\u7684list)\s*$/i);
    if (header) {
      const registryPath = registryPathForSection(header[1].trim());
      current = registryPath;
      if (!registries.has(current)) {
        registries.set(current, []);
      }
      continue;
    }
    const entry = line.match(/^\s*(\d+)\s+`([^`]+)`/);
    if (!entry || !current) {
      continue;
    }
    registries.get(current).push({
      id: Number(entry[1]),
      rawPath: normalizePvfPath(entry[2]),
      pvfPath: resolveRegisteredPath(current, entry[2]),
    });
  }
  return registries;
}

function parseRegistryContent(content, registryPath) {
  const entries = [];
  const byId = new Map();
  const byPath = new Map();
  for (const line of String(content || "").split(/\r?\n/)) {
    const match = line.match(/^\s*(\d+)\s+`([^`]+)`/);
    if (!match) {
      continue;
    }
    const id = Number(match[1]);
    const rawPath = normalizePvfPath(match[2]);
    const pvfPath = resolveRegisteredPath(registryPath, rawPath);
    const entry = { id, rawPath, pvfPath };
    entries.push(entry);
    byId.set(id, entry);
    byPath.set(normalizeKey(pvfPath), entry);
  }
  return { entries, byId, byPath };
}

function readExtractedFiles(extractDir) {
  const listPath = path.join(extractDir, "extracted-files.txt");
  if (fs.existsSync(listPath)) {
    return fs
      .readFileSync(listPath, "utf8")
      .split(/\r?\n/)
      .map(normalizePvfPath)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "_meta") {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const rel = normalizePvfPath(path.relative(extractDir, fullPath));
      if (/^(manifest|external_refs|missing_refs|read_errors|list)\./i.test(rel) || /\.hash$/i.test(rel)) {
        continue;
      }
      files.push(rel);
    }
  }
  walk(extractDir);
  return files.sort((a, b) => a.localeCompare(b));
}

async function readPvfTextOrEmpty(sessionId, pvfPath) {
  try {
    const file = await native.readFile(sessionId, pvfPath, {
      pvfEncoding: "Tw",
      decompileScript: true,
      decompileBinaryAni: true,
      autoConvertStringLink: true,
      useCompatibleDecompiler: true,
      convertToSimplifiedChinese: true,
    });
    if (typeof file.textContent === "string") {
      return { exists: true, text: file.textContent };
    }
    return { exists: true, text: "" };
  } catch {
    return { exists: false, text: "#PVF_File\r\n" };
  }
}

function appendRegistryEntries(existingText, entries) {
  const base = String(existingText || "#PVF_File\r\n").replace(/\s*$/, "\r\n");
  const addition = entries.map((entry) => `${entry.id}\t\`${entry.rawPath}\``).join("\r\n");
  return `${base}${addition}\r\n`;
}

function summarizeRoots(paths) {
  const counts = {};
  for (const pvfPath of paths) {
    const root = normalizePvfPath(pvfPath).split("/")[0] || "other";
    counts[root] = (counts[root] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])));
}

function listedFileName(item) {
  if (typeof item === "string") {
    return item;
  }
  if (item && typeof item.fileName === "string") {
    return item.fileName;
  }
  return String(item || "");
}

async function buildPlan(sessionId, extractDir, targetFiles, registries) {
  const registryPlans = [];
  const conflicts = [];
  const duplicatePathAliases = [];
  let alreadyRegistered = 0;

  for (const [registryPath, entries] of registries.entries()) {
    const existing = await readPvfTextOrEmpty(sessionId, registryPath);
    const parsed = parseRegistryContent(existing.text, registryPath);
    const additions = [];

    for (const entry of entries) {
      const existingById = parsed.byId.get(entry.id);
      if (existingById) {
        if (normalizeKey(existingById.pvfPath) === normalizeKey(entry.pvfPath)) {
          alreadyRegistered += 1;
          continue;
        }
        conflicts.push({
          type: "id",
          registryPath,
          id: entry.id,
          targetPath: existingById.rawPath,
          importPath: entry.rawPath,
        });
        continue;
      }

      const existingByPath = parsed.byPath.get(normalizeKey(entry.pvfPath));
      if (existingByPath && existingByPath.id !== entry.id) {
        duplicatePathAliases.push({
          registryPath,
          targetId: existingByPath.id,
          importId: entry.id,
          importPath: entry.rawPath,
        });
      }

      additions.push(entry);
    }

    registryPlans.push({
      registryPath,
      existing,
      additions,
      existingCount: parsed.entries.length,
    });
  }

  const extractedFiles = readExtractedFiles(extractDir);
  const missingLocalFiles = [];
  const filesToWrite = [];
  const filesAlreadyPresent = [];

  for (const pvfPath of extractedFiles) {
    const filePath = localPath(extractDir, pvfPath);
    if (!fs.existsSync(filePath)) {
      missingLocalFiles.push(pvfPath);
      continue;
    }
    if (targetFiles.has(normalizeKey(pvfPath))) {
      filesAlreadyPresent.push(pvfPath);
      continue;
    }
    filesToWrite.push(pvfPath);
  }

  return {
    conflicts,
    registryPlans,
    registryAdditions: registryPlans.reduce((sum, item) => sum + item.additions.length, 0),
    alreadyRegistered,
    duplicatePathAliases,
    extractedFiles,
    filesToWrite,
    filesAlreadyPresent,
    missingLocalFiles,
  };
}

async function writePlan(sessionId, extractDir, plan, replaceExisting) {
  const writeTargets = replaceExisting ? plan.extractedFiles : plan.filesToWrite;
  for (const pvfPath of writeTargets) {
    const text = fs.readFileSync(localPath(extractDir, pvfPath), "utf8");
    await native.upsertTextFileRaw(sessionId, pvfPath, Buffer.from(text, "utf8"), {
      pvfEncoding: "Tw",
      compileScript: true,
      compileBinaryAni: true,
      convertToTraditionalChinese: true,
    });
  }

  for (const item of plan.registryPlans) {
    if (!item.additions.length) {
      continue;
    }
    const nextText = appendRegistryEntries(item.existing.text, item.additions);
    await native.upsertTextFileRaw(sessionId, item.registryPath, Buffer.from(nextText, "utf8"), {
      pvfEncoding: "Tw",
      compileScript: true,
      compileBinaryAni: false,
      convertToTraditionalChinese: true,
    });
  }
}

async function saveImportedPvf(sessionId, targetPvf, outPvf, apply) {
  if (!apply) {
    return { saved: false, backupPath: null, outputPath: null };
  }
  const stamp = timestamp();
  if (outPvf) {
    const resolvedOut = resolveInsideWorkspace(outPvf, "out-pvf");
    await native.saveSession(sessionId, resolvedOut);
    return { saved: true, backupPath: null, outputPath: resolvedOut };
  }

  const backupPath = `${targetPvf}.bak-${stamp}`;
  const tempPath = `${targetPvf}.import-${stamp}.tmp`;
  fs.copyFileSync(targetPvf, backupPath);
  await native.saveSession(sessionId, tempPath);
  fs.copyFileSync(tempPath, targetPvf);
  fs.unlinkSync(tempPath);
  return { saved: true, backupPath, outputPath: targetPvf };
}

function compactPlan(plan, saveInfo, apply, replaceExisting) {
  const replacedExistingCount = replaceExisting ? plan.filesAlreadyPresent.length : 0;
  return {
    ok: plan.conflicts.length === 0 && plan.missingLocalFiles.length === 0,
    applied: Boolean(apply && saveInfo.saved),
    replaceExisting: Boolean(replaceExisting),
    extractedFileCount: plan.extractedFiles.length,
    filesToWriteCount: replaceExisting ? plan.extractedFiles.length : plan.filesToWrite.length,
    newFileWriteCount: plan.filesToWrite.length,
    replacedExistingCount,
    filesAlreadyPresentCount: plan.filesAlreadyPresent.length,
    filesToWriteByRoot: summarizeRoots(replaceExisting ? plan.extractedFiles : plan.filesToWrite),
    replacedExistingByRoot: summarizeRoots(replaceExisting ? plan.filesAlreadyPresent : []),
    registryAdditions: plan.registryAdditions,
    alreadyRegistered: plan.alreadyRegistered,
    duplicatePathAliasCount: plan.duplicatePathAliases.length,
    duplicatePathAliases: plan.duplicatePathAliases.slice(0, 50),
    registryAdditionsByRegistry: Object.fromEntries(
      plan.registryPlans
        .filter((item) => item.additions.length)
        .map((item) => [item.registryPath, item.additions.length])
        .sort((a, b) => a[0].localeCompare(b[0]))
    ),
    conflictCount: plan.conflicts.length,
    conflicts: plan.conflicts.slice(0, 50),
    missingLocalFileCount: plan.missingLocalFiles.length,
    missingLocalFiles: plan.missingLocalFiles.slice(0, 50),
    backupPath: saveInfo.backupPath,
    outputPath: saveInfo.outputPath,
  };
}

async function main() {
  const extractDir = resolveInsideWorkspace(argValue("extract-dir", ""), "extract-dir");
  const targetPvf = resolveInsideWorkspace(argValue("target-pvf", ""), "target-pvf");
  const outPvf = argValue("out-pvf", "");
  const apply = hasFlag("apply");
  const replaceExisting = hasFlag("replace-existing");

  if (!fs.existsSync(extractDir)) {
    throw new Error(`Extract directory does not exist: ${extractDir}`);
  }
  if (!fs.existsSync(targetPvf)) {
    throw new Error(`Target PVF does not exist: ${targetPvf}`);
  }

  const listPath = path.join(extractDir, "list.txt");
  const codexListPath = path.join(extractDir, "list.codex.txt");
  const importListPath = fs.existsSync(codexListPath) ? codexListPath : listPath;
  if (!fs.existsSync(importListPath)) {
    throw new Error(`Import list was not found: ${importListPath}`);
  }

  const session = await native.openSession(targetPvf, "Tw");
  try {
    const targetFiles = new Set((await native.listFiles(session.sessionId)).map((item) => normalizeKey(listedFileName(item))));
    const registries = parseImportList(importListPath);
    const plan = await buildPlan(session.sessionId, extractDir, targetFiles, registries);
    let saveInfo = { saved: false, backupPath: null, outputPath: null };

    if (plan.conflicts.length || plan.missingLocalFiles.length) {
      const result = compactPlan(plan, saveInfo, false, replaceExisting);
      result.error = "Import blocked by conflicts or missing local files.";
      console.log(JSON.stringify(result, null, 2));
      process.exitCode = 1;
      return;
    }

    if (apply) {
      await writePlan(session.sessionId, extractDir, plan, replaceExisting);
      saveInfo = await saveImportedPvf(session.sessionId, targetPvf, outPvf, true);
    }

    const result = compactPlan(plan, saveInfo, apply, replaceExisting);
    const metaDir = path.join(extractDir, "_meta");
    fs.mkdirSync(metaDir, { recursive: true });
    fs.writeFileSync(
      path.join(metaDir, apply ? "import-result.json" : "import-plan.json"),
      JSON.stringify(result, null, 2),
      "utf8"
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await native.closeSession(session.sessionId);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
