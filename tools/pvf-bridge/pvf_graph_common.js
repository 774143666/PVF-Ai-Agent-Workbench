"use strict";

const fs = require("fs");
const path = require("path");

const REGISTRY_PATHS = {
  aicharacter: "aicharacter/aicharacter.lst",
  appendage: "appendage/appendage.lst",
  character: "character/character.lst",
  dungeon: "dungeon/dungeon.lst",
  equipment: "equipment/equipment.lst",
  map: "map/map.lst",
  monster: "monster/monster.lst",
  npc: "npc/npc.lst",
  passiveobject: "passiveobject/passiveobject.lst",
  stackable: "stackable/stackable.lst",
  itemshop: "itemshop/itemshop.lst",
  quest: "n_quest/quest.lst",
  worldmap: "worldmap/worldmap.lst",
};

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
  return path.posix.dirname(normalizePvfPath(registryPath));
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
    const header = !/^\s*\d/.test(line) && line.match(/^\s*([A-Za-z0-9_./-]+).*(?:needs list|list)\s*$/i);
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

function tagBlocks(content, tag) {
  const open = `[${tag}]`;
  const close = `[/${tag}]`;
  const blocks = [];
  let index = 0;
  while (true) {
    const start = content.indexOf(open, index);
    if (start < 0) {
      break;
    }
    const contentStart = start + open.length;
    const end = content.indexOf(close, contentStart);
    if (end >= 0) {
      blocks.push(content.slice(contentStart, end));
      index = end + close.length;
      continue;
    }
    const next = content.slice(contentStart).search(/\r?\n\[[^\]]+\]/);
    const contentEnd = next >= 0 ? contentStart + next : content.length;
    blocks.push(content.slice(contentStart, contentEnd));
    index = contentEnd;
  }
  return blocks;
}

function firstTagBlock(content, tag) {
  return tagBlocks(content, tag)[0] || "";
}

function numbers(value) {
  return Array.from(String(value || "").matchAll(/-?\d+/g)).map((match) => Number(match[0]));
}

function tokens(value) {
  return Array.from(String(value || "").matchAll(/`[^`]*`|-?\d+/g)).map((match) => match[0]);
}

function backtickValues(value) {
  return Array.from(String(value || "").matchAll(/`([\s\S]*?)`/g)).map((match) => match[1]);
}

function firstBacktick(content, tag) {
  const values = backtickValues(firstTagBlock(content, tag));
  return values.length ? values[0].replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim() : "";
}

function parseAiCharacterRows(content) {
  const out = [];
  for (const block of tagBlocks(content, "ai character")) {
    const rawTokens = tokens(block);
    for (let i = 0; i + 7 < rawTokens.length; ) {
      if (rawTokens[i].startsWith("`")) {
        i += 1;
        continue;
      }
      const id = Number(rawTokens[i]);
      const side = String(rawTokens[i + 4] || "").replace(/^`|`$/g, "");
      if (Number.isFinite(id) && side.startsWith("[")) {
        out.push(id);
        i += 8;
      } else {
        i += 1;
      }
    }
  }
  return out;
}

function firstOfFixedGroups(content, tag, groupSize) {
  const out = [];
  for (const block of tagBlocks(content, tag)) {
    const values = numbers(block);
    for (let i = 0; i < values.length; i += groupSize) {
      if (values[i] > 0) {
        out.push(values[i]);
      }
    }
  }
  return out;
}

function pairFirsts(content, tag) {
  return firstOfFixedGroups(content, tag, 2);
}

function tripleFirsts(content, tag) {
  return firstOfFixedGroups(content, tag, 3);
}

function resolveSkillRegistryCandidates(pvfPath) {
  const lower = normalizeKey(pvfPath);
  if (lower.includes("/priest/")) return ["skill/priestskill.lst"];
  if (lower.includes("/swordman/")) return ["skill/swordmanskill.lst"];
  if (lower.includes("/fighter/")) return ["skill/fighterskill.lst"];
  if (lower.includes("/gunner/")) return ["skill/gunnerskill.lst"];
  if (lower.includes("/magician/") || lower.includes("/mage/")) return ["skill/mageskill.lst"];
  if (lower.includes("/atgunner/")) return ["skill/atgunnerskill.lst"];
  if (lower.includes("/atfighter/")) return ["skill/atfighterskill.lst"];
  if (lower.includes("/atmagician/") || lower.includes("/atmage/")) return ["skill/atmageskill.lst"];
  if (lower.includes("/thief/")) return ["skill/thiefskill.lst"];
  if (lower.includes("/demonicswordman/")) return ["skill/demonicswordman.lst"];
  if (lower.includes("/creatormage/")) return ["skill/creatormage.lst"];
  return [];
}

function parseLstContent(content, registryPath) {
  const entries = [];
  const byId = new Map();
  for (const line of String(content || "").split(/\r?\n/)) {
    const match = line.match(/^\s*(\d+)\s+`([^`]+)`/);
    if (!match) {
      continue;
    }
    const entry = {
      id: Number(match[1]),
      rawPath: normalizePvfPath(match[2]),
      pvfPath: resolveRegisteredPath(registryPath, match[2]),
    };
    entries.push(entry);
    byId.set(entry.id, entry);
  }
  return { entries, byId };
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

function commonReadOptions() {
  return {
    decompileScript: true,
    decompileBinaryAni: true,
    autoConvertStringLink: true,
    useCompatibleDecompiler: true,
    convertToSimplifiedChinese: true,
  };
}

module.exports = {
  REGISTRY_PATHS,
  backtickValues,
  commonReadOptions,
  findBundledNativeBackend,
  firstBacktick,
  firstOfFixedGroups,
  firstTagBlock,
  normalizeEncoding,
  normalizeKey,
  normalizePvfPath,
  numbers,
  pairFirsts,
  parseAiCharacterRows,
  parseImportList,
  parseLstContent,
  registryPathForSection,
  resolveRegisteredPath,
  resolveSkillRegistryCandidates,
  tagBlocks,
  tokens,
  tripleFirsts,
};
