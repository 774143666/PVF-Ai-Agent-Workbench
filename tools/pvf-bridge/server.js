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

const nativePath = findBundledNativeBackend();
const native = require(nativePath);

const sessions = new Map();
let currentSessionId;

const REGISTRY_CATALOG = [
  { path: "town/town.lst", label: "town", description: "城镇" },
  { path: "region/region.lst", label: "region", description: "区域" },
  { path: "worldmap/worldmap.lst", label: "worldmap", description: "副本接口" },
  { path: "appendage/appendage.lst", label: "appendage", description: "状态/APD" },
  { path: "character/character.lst", label: "character", description: "角色" },
  { path: "equipment/equipment.lst", label: "equipment", description: "装备" },
  { path: "stackable/stackable.lst", label: "stackable", description: "消耗品" },
  { path: "aicharacter/aicharacter.lst", label: "aicharacter", description: "APC/人偶" },
  { path: "dungeon/dungeon.lst", label: "dungeon", description: "副本" },
  { path: "monster/monster.lst", label: "monster", description: "怪物" },
  { path: "creature/creature.lst", label: "creature", description: "宠物" },
  { path: "cashshop/cashshop.lst", label: "cashshop", description: "商城" },
  { path: "map/map.lst", label: "map", description: "地图" },
  { path: "npc/npc.lst", label: "npc", description: "NPC" },
  { path: "itemshop/itemshop.lst", label: "itemshop", description: "NPC商店" },
  { path: "passiveobject/passiveobject.lst", label: "passiveobject", description: "被动对象" },
  { path: "n_quest/quest.lst", label: "quest", description: "任务" },
  { path: "pvp_mission/mission.lst", label: "pvp_mission", description: "PVP任务" },
  { path: "etc/independentdrop.lst", label: "independentdrop", description: "独立掉落" },
  { path: "skill/swordmanskill.lst", label: "swordman_skill", description: "鬼剑士技能" },
  { path: "skill/fighterskill.lst", label: "fighter_skill", description: "格斗家技能" },
  { path: "skill/gunnerskill.lst", label: "gunner_skill", description: "神枪手技能" },
  { path: "skill/mageskill.lst", label: "mage_skill", description: "魔法师技能" },
  { path: "skill/priestskill.lst", label: "priest_skill", description: "圣职者技能" },
  { path: "skill/atgunnerskill.lst", label: "atgunner_skill", description: "女枪手技能" },
  { path: "skill/thiefskill.lst", label: "thief_skill", description: "暗夜使者技能" },
  { path: "skill/atfighterskill.lst", label: "atfighter_skill", description: "男格斗技能" },
  { path: "skill/atmageskill.lst", label: "atmage_skill", description: "男法师技能" },
  { path: "skill/demonicswordman.lst", label: "demonicswordman_skill", description: "黑暗武士技能" },
  { path: "skill/creatormage.lst", label: "creatormage_skill", description: "缔造者技能" },
  { path: "chatemoticon/chatemoticon.lst", label: "chatemoticon", description: "表情", secondary: true },
  { path: "stagemap/stagemap.lst", label: "stagemap", description: "阶段图", secondary: true },
  { path: "aura/aura.lst", label: "aura", description: "光环", secondary: true },
  { path: "pet/pet.lst", label: "pet", description: "宠物/废弃", secondary: true },
];

const ITEM_REGISTRY_PATHS = ["stackable/stackable.lst", "equipment/equipment.lst"];

function getSessionState(sessionId) {
  const state = sessions.get(sessionId);
  if (!state) {
    throw new Error(`Unknown PVF session: ${sessionId}`);
  }
  if (!state.registryCache) {
    state.registryCache = new Map();
  }
  return state;
}

function text(value) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
  };
}

function errorResult(message, data) {
  return {
    content: [{ type: "text", text: data === undefined ? String(message) : JSON.stringify({ error: String(message), data }, null, 2) }],
    isError: true,
  };
}

function normalizePvfPath(value) {
  if (!value || typeof value !== "string") {
    throw new Error("pvfPath is required.");
  }
  return value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+/g, "/");
}

function normalizeEncoding(value) {
  const raw = String(value || "Tw").trim();
  const map = new Map([
    ["tw", "Tw"],
    ["cn", "Cn"],
    ["kr", "Kr"],
    ["jp", "Jp"],
    ["utf8", "Utf8"],
    ["utf-8", "Utf8"],
    ["unicode", "Unicode"],
  ]);
  return map.get(raw.toLowerCase()) || raw;
}

function resolveSessionId(args) {
  const sessionId = args && args.sessionId ? String(args.sessionId) : currentSessionId;
  if (!sessionId) {
    throw new Error("No PVF session is open. Call pvf_open first.");
  }
  return sessionId;
}

function getSessionInfo(sessionId) {
  const local = sessions.get(sessionId) || {};
  return { sessionId, ...local };
}

function limitText(value, maxChars) {
  const limit = Number.isFinite(maxChars) ? maxChars : 30000;
  if (!limit || value.length <= limit) {
    return { textContent: value, truncated: false };
  }
  return {
    textContent: value.slice(0, limit),
    truncated: true,
    originalCharCount: value.length,
    returnedCharCount: limit,
  };
}

function sliceLines(value, startLine, endLine) {
  if (!startLine && !endLine) {
    return value;
  }
  const lines = value.split(/\r?\n/);
  const start = Math.max(1, Number(startLine || 1)) - 1;
  const end = endLine ? Math.max(start + 1, Number(endLine)) : lines.length;
  return lines.slice(start, end).join("\n");
}

function makeSearchQuery(args) {
  return {
    keyword: String(args.keyword || ""),
    searchPath: String(args.searchPath || ""),
    isStartMatch: Boolean(args.isStartMatch),
    isUseLikeSearchPath: Boolean(args.isUseLikeSearchPath),
    searchType: args.searchType || "SearchName",
    matchMode: args.matchMode || "Like",
    convertToSimplifiedChinese: args.convertToSimplifiedChinese !== false,
    sourceFiles: Array.isArray(args.sourceFiles) ? args.sourceFiles : undefined,
  };
}

function commonReadOptions(args = {}) {
  return {
    pvfEncoding: args.pvfEncoding ? normalizeEncoding(args.pvfEncoding) : undefined,
    decompileScript: args.decompileScript !== false,
    decompileBinaryAni: args.decompileBinaryAni !== false,
    autoConvertStringLink: Boolean(args.autoConvertStringLink),
    useCompatibleDecompiler: args.useCompatibleDecompiler !== false,
    convertToSimplifiedChinese: args.convertToSimplifiedChinese !== false,
  };
}

async function readPvfText(sessionId, pvfPath, args = {}) {
  const file = await native.readFile(sessionId, normalizePvfPath(pvfPath), commonReadOptions(args));
  if (typeof file.textContent !== "string") {
    throw new Error(`PVF file is not text-readable: ${pvfPath}`);
  }
  return file;
}

function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTagBlock(content, tag) {
  const open = `[${tag}]`;
  const close = `[/${tag}]`;
  const start = content.indexOf(open);
  if (start < 0) {
    return "";
  }
  const blockStart = start + open.length;
  const end = content.indexOf(close, blockStart);
  if (end >= 0) {
    return content.slice(blockStart, end);
  }
  const next = content.slice(blockStart).search(/\r?\n\[[^\]]+\]/);
  return next >= 0 ? content.slice(blockStart, blockStart + next) : content.slice(blockStart);
}

function extractBacktickValues(value) {
  return Array.from(String(value || "").matchAll(/`([\s\S]*?)`/g)).map((match) => normalizeWhitespace(match[1]));
}

function extractFirstBacktickAfterTag(content, tag) {
  const values = extractBacktickValues(extractTagBlock(content, tag));
  return values.length ? values[0] : "";
}

function extractFirstNumberAfterTag(content, tag) {
  const block = extractTagBlock(content, tag);
  const match = block.match(/-?\d+/);
  return match ? Number(match[0]) : undefined;
}

function parseLstEntries(content, lstPath) {
  const entries = [];
  const baseDir = path.posix.dirname(normalizePvfPath(lstPath));
  const lines = String(content || "").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*(\d+)\s+`([^`]+)`/);
    if (!match) {
      continue;
    }
    const id = Number(match[1]);
    const rawPath = match[2].replace(/\\/g, "/").replace(/^\/+/, "");
    const resolvedPath = normalizePvfPath(rawPath.toLowerCase().startsWith(`${baseDir.toLowerCase()}/`) ? rawPath : `${baseDir}/${rawPath}`);
    entries.push({
      id,
      rawPath,
      pvfPath: resolvedPath,
      line: index + 1,
    });
  }
  return entries;
}

function registryInfo(lstPath) {
  const normalized = normalizePvfPath(lstPath).toLowerCase();
  return REGISTRY_CATALOG.find((item) => item.path.toLowerCase() === normalized) || {
    path: normalizePvfPath(lstPath),
    label: path.posix.basename(lstPath, ".lst"),
    description: "",
    custom: true,
  };
}

async function getRegistry(sessionId, lstPath, args = {}) {
  const normalized = normalizePvfPath(lstPath).toLowerCase();
  const state = getSessionState(sessionId);
  if (state.registryCache.has(normalized)) {
    return state.registryCache.get(normalized);
  }
  const info = registryInfo(lstPath);
  const file = await readPvfText(sessionId, info.path, args);
  const entries = parseLstEntries(file.textContent, info.path);
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const registry = {
    ...info,
    path: info.path,
    metadata: {
      fileName: file.fileName,
      dataLength: file.dataLength,
      isScriptFile: file.isScriptFile,
    },
    entryCount: entries.length,
    entries,
    byId,
  };
  state.registryCache.set(normalized, registry);
  return registry;
}

async function resolveLstId(sessionId, lstPath, id, args = {}) {
  const registry = await getRegistry(sessionId, lstPath, args);
  const numericId = Number(id);
  const entry = registry.byId.get(numericId);
  if (!entry) {
    return {
      found: false,
      id: numericId,
      registry: {
        path: registry.path,
        label: registry.label,
        description: registry.description,
        entryCount: registry.entryCount,
      },
    };
  }
  return {
    found: true,
    id: numericId,
    registry: {
      path: registry.path,
      label: registry.label,
      description: registry.description,
      entryCount: registry.entryCount,
    },
    entry,
  };
}

function summarizeDefinitionText(content) {
  return {
    name: extractFirstBacktickAfterTag(content, "name"),
    name2: extractFirstBacktickAfterTag(content, "name2"),
    explain: extractFirstBacktickAfterTag(content, "explain"),
    type:
      extractFirstBacktickAfterTag(content, "stackable type") ||
      extractFirstBacktickAfterTag(content, "equipment type") ||
      extractFirstBacktickAfterTag(content, "type"),
    subType: extractFirstBacktickAfterTag(content, "sub type"),
    minimumLevel: extractFirstNumberAfterTag(content, "minimum level"),
    rarity: extractFirstNumberAfterTag(content, "rarity"),
    grade: extractFirstNumberAfterTag(content, "grade"),
  };
}

async function summarizeDefinitionFile(sessionId, pvfPath, args = {}) {
  const file = await readPvfText(sessionId, pvfPath, args);
  const summary = summarizeDefinitionText(file.textContent);
  return {
    pvfPath: normalizePvfPath(pvfPath),
    metadata: {
      fileName: file.fileName,
      dataLength: file.dataLength,
      isScriptFile: file.isScriptFile,
    },
    ...summary,
  };
}

async function resolveIdAcrossRegistries(sessionId, id, registryPaths, args = {}) {
  const matches = [];
  for (const registryPath of registryPaths) {
    try {
      const resolved = await resolveLstId(sessionId, registryPath, id, args);
      if (!resolved.found) {
        continue;
      }
      if (args.includeFileSummary === true) {
        try {
          resolved.fileSummary = await summarizeDefinitionFile(sessionId, resolved.entry.pvfPath, args);
        } catch (err) {
          resolved.fileSummaryError = err && err.message ? err.message : String(err);
        }
      }
      matches.push(resolved);
    } catch (err) {
      if (args.includeErrors === true) {
        matches.push({
          found: false,
          id: Number(id),
          registry: { path: normalizePvfPath(registryPath) },
          error: err && err.message ? err.message : String(err),
        });
      }
    }
  }
  return matches;
}

function parseNumericTagList(content, tag) {
  return Array.from(extractTagBlock(content, tag).matchAll(/-?\d+/g)).map((match) => Number(match[0]));
}

function countBy(values, getKey) {
  const counts = {};
  for (const value of values) {
    const key = getKey(value) || "(unknown)";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function changedPreview(before, after) {
  if (before === after) {
    return { changed: false };
  }
  const prefixLimit = Math.min(before.length, after.length);
  let start = 0;
  while (start < prefixLimit && before[start] === after[start]) {
    start += 1;
  }
  let beforeEnd = before.length - 1;
  let afterEnd = after.length - 1;
  while (beforeEnd >= start && afterEnd >= start && before[beforeEnd] === after[afterEnd]) {
    beforeEnd -= 1;
    afterEnd -= 1;
  }
  const context = 240;
  return {
    changed: true,
    beforeSnippet: before.slice(Math.max(0, start - context), Math.min(before.length, beforeEnd + 1 + context)),
    afterSnippet: after.slice(Math.max(0, start - context), Math.min(after.length, afterEnd + 1 + context)),
  };
}

async function toolOpen(args) {
  const sourcePath = path.resolve(String(args.path || ""));
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    throw new Error(`PVF file does not exist: ${sourcePath}`);
  }
  const encoding = normalizeEncoding(args.encoding);
  const session = await native.openSession(sourcePath, encoding);
  const sessionId = session.sessionId;
  currentSessionId = sessionId;
  sessions.set(sessionId, {
    sourcePath,
    encoding: session.encoding || encoding,
    fileCount: session.fileCount,
    openedAt: new Date().toISOString(),
  });
  return text({
    ok: true,
    session: getSessionInfo(sessionId),
  });
}

async function toolSessionInfo(args) {
  const sessionId = args && args.sessionId ? String(args.sessionId) : currentSessionId;
  if (!sessionId) {
    return text({ ok: true, currentSessionId: null, openSessions: [] });
  }
  let nativeInfo;
  try {
    nativeInfo = await native.getSession(sessionId);
  } catch (err) {
    nativeInfo = { nativeError: err && err.message ? err.message : String(err) };
  }
  return text({
    ok: true,
    currentSessionId,
    session: getSessionInfo(sessionId),
    nativeSession: nativeInfo,
    openSessions: Array.from(sessions.keys()),
  });
}

async function toolClose(args) {
  const sessionId = resolveSessionId(args);
  await native.closeSession(sessionId);
  sessions.delete(sessionId);
  if (currentSessionId === sessionId) {
    currentSessionId = sessions.keys().next().value;
  }
  return text({ ok: true, closedSessionId: sessionId, currentSessionId: currentSessionId || null });
}

async function toolListFiles(args) {
  const sessionId = resolveSessionId(args);
  const files = await native.listFiles(sessionId);
  const prefix = args.prefix ? String(args.prefix).replace(/\\/g, "/").toLowerCase() : "";
  const contains = args.contains ? String(args.contains).toLowerCase() : "";
  const limit = Math.max(1, Math.min(Number(args.limit || 200), 2000));
  const filtered = files.filter((file) => {
    const name = String(file.fileName || "").toLowerCase();
    return (!prefix || name.startsWith(prefix)) && (!contains || name.includes(contains));
  });
  return text({
    ok: true,
    sessionId,
    totalFileCount: files.length,
    matchedCount: filtered.length,
    returnedCount: Math.min(limit, filtered.length),
    items: filtered.slice(0, limit),
  });
}

async function toolListFilesPage(args) {
  const sessionId = resolveSessionId(args);
  const files = await native.listFiles(sessionId);
  const prefix = args.prefix ? String(args.prefix).replace(/\\/g, "/").toLowerCase() : "";
  const contains = args.contains ? String(args.contains).toLowerCase() : "";
  const offset = Math.max(0, Number(args.offset || 0));
  const limit = Math.max(1, Math.min(Number(args.limit || 2000), 2000));
  const filtered = files.filter((file) => {
    const name = String(file.fileName || "").toLowerCase();
    return (!prefix || name.startsWith(prefix)) && (!contains || name.includes(contains));
  });
  const pageItems = filtered.slice(offset, offset + limit);
  const nextOffset = offset + pageItems.length;
  return text({
    ok: true,
    sessionId,
    totalFileCount: files.length,
    matchedCount: filtered.length,
    offset,
    limit,
    returnedCount: pageItems.length,
    nextOffset: nextOffset < filtered.length ? nextOffset : null,
    hasMore: nextOffset < filtered.length,
    items: pageItems,
  });
}

async function toolSearch(args) {
  const sessionId = resolveSessionId(args);
  if (!args.keyword) {
    throw new Error("keyword is required.");
  }
  const result = await native.searchFiles(sessionId, makeSearchQuery(args));
  const items = Array.isArray(result.items) ? result.items : [];
  const limit = Math.max(1, Math.min(Number(args.limit || 50), 500));
  return text({
    ok: true,
    sessionId,
    matchedCount: result.matchedCount,
    searchedCount: result.searchedCount,
    returnedCount: Math.min(limit, items.length),
    items: items.slice(0, limit),
  });
}

async function toolReadFile(args) {
  const sessionId = resolveSessionId(args);
  const pvfPath = normalizePvfPath(args.pvfPath);
  const readOptions = {
    pvfEncoding: args.pvfEncoding ? normalizeEncoding(args.pvfEncoding) : undefined,
    decompileScript: args.decompileScript !== false,
    decompileBinaryAni: args.decompileBinaryAni !== false,
    autoConvertStringLink: Boolean(args.autoConvertStringLink),
    useCompatibleDecompiler: args.useCompatibleDecompiler !== false,
    convertToSimplifiedChinese: args.convertToSimplifiedChinese !== false,
  };
  const file = await native.readFile(sessionId, pvfPath, readOptions);
  const content = typeof file.textContent === "string" ? sliceLines(file.textContent, args.startLine, args.endLine) : undefined;
  const limited = content === undefined ? {} : limitText(content, Number(args.maxChars || 30000));
  return text({
    ok: true,
    sessionId,
    pvfPath,
    metadata: {
      fileName: file.fileName,
      dataLength: file.dataLength,
      isScriptFile: file.isScriptFile,
      isBinaryAniFile: file.isBinaryAniFile,
    },
    ...limited,
    base64Content: content === undefined && file.base64Content ? file.base64Content : undefined,
  });
}

async function writeText(sessionId, pvfPath, textContent, args) {
  const options = {
    pvfEncoding: args.pvfEncoding ? normalizeEncoding(args.pvfEncoding) : undefined,
    compileScript: args.compileScript !== false,
    compileBinaryAni: args.compileBinaryAni !== false,
    convertToTraditionalChinese: Boolean(args.convertToTraditionalChinese),
  };
  return native.upsertTextFileRaw(sessionId, pvfPath, Buffer.from(textContent, "utf8"), options);
}

async function toolReplaceText(args) {
  const sessionId = resolveSessionId(args);
  const pvfPath = normalizePvfPath(args.pvfPath);
  if (typeof args.previousText !== "string" || typeof args.newText !== "string") {
    throw new Error("previousText and newText are required strings.");
  }
  const file = await native.readFile(sessionId, pvfPath, {
    pvfEncoding: args.pvfEncoding ? normalizeEncoding(args.pvfEncoding) : undefined,
    decompileScript: true,
    decompileBinaryAni: true,
    autoConvertStringLink: Boolean(args.autoConvertStringLink),
    useCompatibleDecompiler: args.useCompatibleDecompiler !== false,
    convertToSimplifiedChinese: args.convertToSimplifiedChinese !== false,
  });
  if (typeof file.textContent !== "string") {
    throw new Error("Target file is not text-readable.");
  }
  const before = file.textContent;
  const hits = before.split(args.previousText).length - 1;
  if (hits <= 0) {
    throw new Error("previousText was not found in the current PVF file content.");
  }
  const after = args.replaceAll === true ? before.split(args.previousText).join(args.newText) : before.replace(args.previousText, args.newText);
  const preview = changedPreview(before, after);
  if (args.dryRun === true) {
    return text({ ok: true, dryRun: true, sessionId, pvfPath, occurrences: hits, ...preview });
  }
  const writeResult = await writeText(sessionId, pvfPath, after, args);
  return text({ ok: true, dryRun: false, sessionId, pvfPath, occurrences: hits, writeResult, ...preview });
}

async function toolWriteFile(args) {
  const sessionId = resolveSessionId(args);
  const pvfPath = normalizePvfPath(args.pvfPath);
  if (typeof args.textContent !== "string") {
    throw new Error("textContent is required.");
  }
  const writeResult = await writeText(sessionId, pvfPath, args.textContent, args);
  return text({ ok: true, sessionId, pvfPath, writeResult });
}

async function toolSave(args) {
  const sessionId = resolveSessionId(args);
  const session = sessions.get(sessionId);
  const targetPath = args.targetPath ? path.resolve(String(args.targetPath)) : session && session.sourcePath;
  if (!targetPath) {
    throw new Error("targetPath is required when the session source path is unknown.");
  }
  if (!args.targetPath && args.allowOverwriteSource !== true) {
    throw new Error("Refusing to overwrite the source PVF. Provide targetPath, or set allowOverwriteSource=true.");
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const saveResult = await native.saveSession(sessionId, targetPath);
  return text({ ok: true, sessionId, targetPath, saveResult });
}

async function toolBackup(args) {
  const sourcePath = path.resolve(String(args.path || (currentSessionId && sessions.get(currentSessionId)?.sourcePath) || ""));
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    throw new Error(`PVF file does not exist: ${sourcePath}`);
  }
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
  const targetPath = args.targetPath
    ? path.resolve(String(args.targetPath))
    : path.join(path.dirname(sourcePath), `${path.basename(sourcePath)}.${stamp}.bak`);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  return text({ ok: true, sourcePath, targetPath });
}

async function toolListRegistries(args) {
  const sessionId = resolveSessionId(args);
  const includeSecondary = args.includeSecondary !== false;
  const includeCounts = args.includeCounts === true;
  const catalog = REGISTRY_CATALOG.filter((item) => includeSecondary || !item.secondary);
  const items = [];
  for (const item of catalog) {
    const row = { ...item };
    if (includeCounts) {
      try {
        const registry = await getRegistry(sessionId, item.path, args);
        row.entryCount = registry.entryCount;
        row.dataLength = registry.metadata.dataLength;
      } catch (err) {
        row.error = err && err.message ? err.message : String(err);
      }
    }
    items.push(row);
  }
  return text({
    ok: true,
    sessionId,
    totalCount: items.length,
    primaryCount: items.filter((item) => !item.secondary).length,
    secondaryCount: items.filter((item) => item.secondary).length,
    items,
  });
}

async function toolResolveLstId(args) {
  const sessionId = resolveSessionId(args);
  if (!args.lstPath) {
    throw new Error("lstPath is required.");
  }
  if (args.id === undefined || args.id === null) {
    throw new Error("id is required.");
  }
  const resolved = await resolveLstId(sessionId, args.lstPath, args.id, args);
  if (resolved.found && args.includeFileSummary !== false) {
    try {
      resolved.fileSummary = await summarizeDefinitionFile(sessionId, resolved.entry.pvfPath, args);
    } catch (err) {
      resolved.fileSummaryError = err && err.message ? err.message : String(err);
    }
  }
  return text({ ok: true, sessionId, ...resolved });
}

async function toolResolveId(args) {
  const sessionId = resolveSessionId(args);
  if (args.id === undefined || args.id === null) {
    throw new Error("id is required.");
  }
  const includeSecondary = args.includeSecondary === true;
  const registryPaths = Array.isArray(args.registryPaths)
    ? args.registryPaths
    : REGISTRY_CATALOG.filter((item) => includeSecondary || !item.secondary).map((item) => item.path);
  const matches = await resolveIdAcrossRegistries(sessionId, args.id, registryPaths, {
    ...args,
    includeFileSummary: args.includeFileSummary === true,
  });
  return text({
    ok: true,
    sessionId,
    id: Number(args.id),
    searchedRegistryCount: registryPaths.length,
    matchedCount: matches.length,
    matches,
  });
}

async function resolveNpcSource(sessionId, args) {
  if (args.npcPath) {
    return { found: true, pvfPath: normalizePvfPath(args.npcPath), source: "npcPath" };
  }
  if (args.npcId !== undefined && args.npcId !== null) {
    const resolved = await resolveLstId(sessionId, "npc/npc.lst", args.npcId, args);
    return resolved.found
      ? { found: true, pvfPath: resolved.entry.pvfPath, source: "npcId", npcId: Number(args.npcId), registryEntry: resolved.entry }
      : { found: false, reason: "npcId was not found in npc/npc.lst", npcId: Number(args.npcId) };
  }
  if (!args.npcName) {
    return { found: false, reason: "Provide npcName, npcId, or npcPath." };
  }
  const keyword = String(args.npcName);
  const result = await native.searchFiles(sessionId, {
    keyword,
    searchPath: "",
    isStartMatch: false,
    isUseLikeSearchPath: false,
    searchType: "SearchStrings",
    matchMode: "Like",
    convertToSimplifiedChinese: args.convertToSimplifiedChinese !== false,
  });
  const candidates = (Array.isArray(result.items) ? result.items : [])
    .map((item) => String(item.fileName || "").replace(/\\/g, "/"))
    .filter((fileName) => /^npc\/.+\.npc$/i.test(fileName));
  const uniqueCandidates = Array.from(new Set(candidates));
  if (!uniqueCandidates.length) {
    return { found: false, reason: "No NPC file matched npcName.", npcName: keyword };
  }
  const inspected = [];
  for (const candidate of uniqueCandidates.slice(0, 30)) {
    try {
      const file = await readPvfText(sessionId, candidate, args);
      const name = extractFirstBacktickAfterTag(file.textContent, "name");
      const fieldName = extractFirstBacktickAfterTag(file.textContent, "field name");
      inspected.push({ pvfPath: candidate, name, fieldName });
      if (name === keyword || fieldName === keyword) {
        return { found: true, pvfPath: candidate, source: "npcName", npcName: keyword, name, fieldName };
      }
    } catch (err) {
      inspected.push({ pvfPath: candidate, error: err && err.message ? err.message : String(err) });
    }
  }
  if (uniqueCandidates.length === 1) {
    return { found: true, pvfPath: uniqueCandidates[0], source: "npcName", npcName: keyword, inspected };
  }
  return {
    found: false,
    ambiguous: true,
    reason: "Multiple NPC files matched npcName; provide npcPath or npcId.",
    npcName: keyword,
    candidates: inspected,
  };
}

async function toolSummarizeNpcShop(args) {
  const sessionId = resolveSessionId(args);
  const npcSource = await resolveNpcSource(sessionId, args);
  if (!npcSource.found) {
    return text({ ok: true, sessionId, ...npcSource });
  }
  const npcFile = await readPvfText(sessionId, npcSource.pvfPath, args);
  const npcText = npcFile.textContent;
  const itemShopId = extractFirstNumberAfterTag(npcText, "item shop");
  const npcSummary = {
    pvfPath: npcSource.pvfPath,
    source: npcSource.source,
    npcId: npcSource.npcId,
    name: extractFirstBacktickAfterTag(npcText, "name"),
    fieldName: extractFirstBacktickAfterTag(npcText, "field name"),
    itemShopId,
  };
  if (itemShopId === undefined) {
    return text({ ok: true, sessionId, npc: npcSummary, hasItemShop: false });
  }

  const shopResolved = await resolveLstId(sessionId, "itemshop/itemshop.lst", itemShopId, args);
  if (!shopResolved.found) {
    return text({ ok: true, sessionId, npc: npcSummary, hasItemShop: true, shop: shopResolved });
  }
  const shopFile = await readPvfText(sessionId, shopResolved.entry.pvfPath, args);
  const shopText = shopFile.textContent;
  const sellNumbers = parseNumericTagList(shopText, "sell item");
  const segments = [];
  let current = [];
  for (const value of sellNumbers) {
    if (value === -2) {
      segments.push(current);
      current = [];
    } else if (value > 0) {
      current.push(value);
    }
  }
  if (current.length || !segments.length) {
    segments.push(current);
  }
  const tabNames = extractBacktickValues(extractTagBlock(shopText, "tab name"));
  const itemRegistryPaths = Array.isArray(args.itemRegistryPaths) ? args.itemRegistryPaths : ITEM_REGISTRY_PATHS;
  const allIds = segments.flat();
  const maxItems = Math.max(0, Math.min(Number(args.maxItems || 300), 1000));
  const uniqueIds = Array.from(new Set(allIds.slice(0, maxItems)));
  const resolvedById = new Map();
  for (const id of uniqueIds) {
    const matches = await resolveIdAcrossRegistries(sessionId, id, itemRegistryPaths, {
      ...args,
      includeFileSummary: true,
    });
    resolvedById.set(id, {
      id,
      found: matches.length > 0,
      matches,
      primaryMatch: matches[0],
    });
  }
  const segmentSummaries = segments.map((ids, index) => {
    const resolvedItems = ids.slice(0, maxItems).map((id) => resolvedById.get(id) || { id, found: false, matches: [] });
    return {
      index,
      tabName: tabNames[index] || "",
      itemCount: ids.length,
      resolvedCount: resolvedItems.filter((item) => item.found).length,
      unresolvedIds: resolvedItems.filter((item) => !item.found).map((item) => item.id),
      countsByRegistry: countBy(resolvedItems.filter((item) => item.primaryMatch), (item) => item.primaryMatch.registry.path),
      countsByType: countBy(
        resolvedItems.filter((item) => item.primaryMatch && item.primaryMatch.fileSummary),
        (item) => item.primaryMatch.fileSummary.type
      ),
      samples: resolvedItems
        .filter((item) => item.primaryMatch)
        .slice(0, Number(args.sampleLimit || 12))
        .map((item) => ({
          id: item.id,
          registry: item.primaryMatch.registry.path,
          pvfPath: item.primaryMatch.entry.pvfPath,
          name: item.primaryMatch.fileSummary && item.primaryMatch.fileSummary.name,
          type: item.primaryMatch.fileSummary && item.primaryMatch.fileSummary.type,
          explain: item.primaryMatch.fileSummary && item.primaryMatch.fileSummary.explain,
        })),
    };
  });
  const allResolved = Array.from(resolvedById.values());
  return text({
    ok: true,
    sessionId,
    npc: npcSummary,
    shop: {
      id: itemShopId,
      registryPath: "itemshop/itemshop.lst",
      pvfPath: shopResolved.entry.pvfPath,
      npcField: extractFirstNumberAfterTag(shopText, "NPC"),
      type: extractFirstBacktickAfterTag(shopText, "type"),
      message: extractFirstBacktickAfterTag(shopText, "message"),
      tabNames,
    },
    sellItemCount: allIds.length,
    uniqueSellItemCount: new Set(allIds).size,
    resolvedUniqueItemCount: allResolved.filter((item) => item.found).length,
    unresolvedUniqueIds: allResolved.filter((item) => !item.found).map((item) => item.id),
    truncated: allIds.length > maxItems,
    segments: segmentSummaries,
  });
}

const tools = [
  {
    name: "pvf_open",
    title: "Open PVF",
    description: "Open a PVF archive and create a session for subsequent search/read/write tools.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        encoding: { type: "string", enum: ["Tw", "Cn", "Kr", "Jp", "Utf8", "Unicode"] },
      },
      required: ["path"],
    },
  },
  {
    name: "pvf_session_info",
    title: "PVF Session Info",
    description: "Show the current PVF session and open sessions in this bridge process.",
    inputSchema: {
      type: "object",
      properties: { sessionId: { type: "string" } },
    },
  },
  {
    name: "pvf_close",
    title: "Close PVF",
    description: "Close an open PVF session.",
    inputSchema: {
      type: "object",
      properties: { sessionId: { type: "string" } },
    },
  },
  {
    name: "pvf_backup",
    title: "Backup PVF",
    description: "Copy a PVF archive to a timestamped backup path.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        targetPath: { type: "string" },
      },
    },
  },
  {
    name: "pvf_list_files",
    title: "List PVF Files",
    description: "List files in the current PVF session, optionally filtered by prefix or substring.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        prefix: { type: "string" },
        contains: { type: "string" },
        limit: { type: "integer", minimum: 1, maximum: 2000 },
      },
    },
  },
  {
    name: "pvf_list_files_page",
    title: "List PVF Files Page",
    description: "List a paged slice of files in the current PVF session. Read-only; use offset/limit to export large file indexes safely.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        prefix: { type: "string" },
        contains: { type: "string" },
        offset: { type: "integer", minimum: 0 },
        limit: { type: "integer", minimum: 1, maximum: 2000 },
      },
    },
  },
  {
    name: "pvf_search",
    title: "Search PVF",
    description: "Search file names, names, scripts, strings, numbers, code, or nut text in the current PVF session.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        keyword: { type: "string" },
        searchPath: { type: "string" },
        isStartMatch: { type: "boolean" },
        isUseLikeSearchPath: { type: "boolean" },
        searchType: {
          type: "string",
          enum: ["SearchNum", "SearchStrings", "SearchFileName", "SearchScript", "SearchName", "SearchCode", "SearchNutText"],
        },
        matchMode: { type: "string", enum: ["None", "Like", "Regex"] },
        convertToSimplifiedChinese: { type: "boolean" },
        sourceFiles: { type: "array", items: { type: "string" } },
        limit: { type: "integer", minimum: 1, maximum: 500 },
      },
      required: ["keyword"],
    },
  },
  {
    name: "pvf_list_registries",
    title: "List PVF Registries",
    description: "List known primary .lst registries and optional secondary registries. Use includeCounts=true to parse entry counts.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        includeSecondary: { type: "boolean" },
        includeCounts: { type: "boolean" },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
    },
  },
  {
    name: "pvf_resolve_lst_id",
    title: "Resolve LST ID",
    description: "Resolve an ID through a specific .lst registry, returning the registered PVF path and an optional file summary.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        lstPath: { type: "string" },
        id: { type: "integer" },
        includeFileSummary: { type: "boolean" },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
      required: ["lstPath", "id"],
    },
  },
  {
    name: "pvf_resolve_id",
    title: "Resolve ID Across Registries",
    description: "Resolve an ID against known .lst registries, or against an explicit registryPaths list.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        id: { type: "integer" },
        registryPaths: { type: "array", items: { type: "string" } },
        includeSecondary: { type: "boolean" },
        includeFileSummary: { type: "boolean" },
        includeErrors: { type: "boolean" },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
      required: ["id"],
    },
  },
  {
    name: "pvf_summarize_npc_shop",
    title: "Summarize NPC Shop",
    description:
      "Resolve an NPC's [item shop] through itemshop/itemshop.lst, then summarize shop tabs and sell items through item registries.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        npcName: { type: "string" },
        npcId: { type: "integer" },
        npcPath: { type: "string" },
        itemRegistryPaths: { type: "array", items: { type: "string" } },
        maxItems: { type: "integer", minimum: 0, maximum: 1000 },
        sampleLimit: { type: "integer", minimum: 0, maximum: 50 },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
    },
  },
  {
    name: "pvf_read_file",
    title: "Read PVF File",
    description: "Read and decompile a text/script file from the current PVF session.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        pvfPath: { type: "string" },
        pvfEncoding: { type: "string" },
        decompileScript: { type: "boolean" },
        decompileBinaryAni: { type: "boolean" },
        autoConvertStringLink: { type: "boolean" },
        useCompatibleDecompiler: { type: "boolean" },
        convertToSimplifiedChinese: { type: "boolean" },
        startLine: { type: "integer", minimum: 1 },
        endLine: { type: "integer", minimum: 1 },
        maxChars: { type: "integer", minimum: 0 },
      },
      required: ["pvfPath"],
    },
  },
  {
    name: "pvf_replace_text",
    title: "Replace PVF Text",
    description: "Read a PVF text file, replace an exact text fragment, and write it back to the open session. Use dryRun=true before risky edits.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        pvfPath: { type: "string" },
        previousText: { type: "string" },
        newText: { type: "string" },
        replaceAll: { type: "boolean" },
        dryRun: { type: "boolean" },
        pvfEncoding: { type: "string" },
        autoConvertStringLink: { type: "boolean" },
        useCompatibleDecompiler: { type: "boolean" },
        convertToSimplifiedChinese: { type: "boolean" },
        compileScript: { type: "boolean" },
        compileBinaryAni: { type: "boolean" },
        convertToTraditionalChinese: { type: "boolean" },
      },
      required: ["pvfPath", "previousText", "newText"],
    },
  },
  {
    name: "pvf_write_file",
    title: "Write PVF File",
    description: "Write full text content to a file in the open PVF session.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        pvfPath: { type: "string" },
        textContent: { type: "string" },
        pvfEncoding: { type: "string" },
        compileScript: { type: "boolean" },
        compileBinaryAni: { type: "boolean" },
        convertToTraditionalChinese: { type: "boolean" },
      },
      required: ["pvfPath", "textContent"],
    },
  },
  {
    name: "pvf_save",
    title: "Save PVF",
    description: "Save the open PVF session. By default this refuses to overwrite the original archive; provide targetPath.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        targetPath: { type: "string" },
        allowOverwriteSource: { type: "boolean" },
      },
    },
  },
];

const handlers = {
  pvf_open: toolOpen,
  pvf_session_info: toolSessionInfo,
  pvf_close: toolClose,
  pvf_backup: toolBackup,
  pvf_list_files: toolListFiles,
  pvf_list_files_page: toolListFilesPage,
  pvf_search: toolSearch,
  pvf_list_registries: toolListRegistries,
  pvf_resolve_lst_id: toolResolveLstId,
  pvf_resolve_id: toolResolveId,
  pvf_summarize_npc_shop: toolSummarizeNpcShop,
  pvf_read_file: toolReadFile,
  pvf_replace_text: toolReplaceText,
  pvf_write_file: toolWriteFile,
  pvf_save: toolSave,
};

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(message) {
  if (!message || typeof message !== "object") {
    return;
  }
  const id = message.id;
  try {
    if (message.method === "initialize") {
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: message.params && message.params.protocolVersion ? message.params.protocolVersion : "2025-06-18",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "codex-pvf-bridge", version: "1.0.0" },
          instructions:
            "Use pvf_open first to create a PVF session. Use pvf_list_registries, pvf_resolve_lst_id, pvf_resolve_id, and pvf_summarize_npc_shop for registered PVF data. Use pvf_backup before edits. Use pvf_replace_text with dryRun=true before writing. Use pvf_save with targetPath to avoid overwriting the original PVF.",
        },
      });
      return;
    }
    if (message.method === "tools/list") {
      send({ jsonrpc: "2.0", id, result: { tools } });
      return;
    }
    if (message.method === "tools/call") {
      const name = message.params && message.params.name;
      const args = (message.params && message.params.arguments) || {};
      const fn = handlers[name];
      if (!fn) {
        send({ jsonrpc: "2.0", id, result: errorResult(`Unknown tool: ${name}`) });
        return;
      }
      try {
        const result = await fn(args);
        send({ jsonrpc: "2.0", id, result });
      } catch (err) {
        send({ jsonrpc: "2.0", id, result: errorResult(err && err.message ? err.message : String(err)) });
      }
      return;
    }
    if (id !== undefined) {
      send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${message.method}` } });
    }
  } catch (err) {
    if (id !== undefined) {
      send({ jsonrpc: "2.0", id, error: { code: -32603, message: err && err.message ? err.message : String(err) } });
    }
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  for (;;) {
    const index = buffer.indexOf("\n");
    if (index < 0) {
      break;
    }
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) {
      continue;
    }
    try {
      void handle(JSON.parse(line));
    } catch (err) {
      send({ jsonrpc: "2.0", error: { code: -32700, message: err && err.message ? err.message : String(err) } });
    }
  }
});

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
