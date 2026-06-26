"use strict";

const fs = require("fs");
const path = require("path");
const {
  backtickValues,
  commonReadOptions,
  findBundledNativeBackend,
  firstBacktick,
  normalizeEncoding,
  normalizeKey,
  normalizePvfPath,
  numbers,
  parseLstContent,
  resolveRegisteredPath,
  tagBlocks,
} = require("./pvf_graph_common");

const WORKSPACE = process.env.DNFPVF_WORKSPACE || path.resolve(__dirname, "..", "..");
const DATE_TAG = new Date().toISOString().slice(0, 10);
const DEFAULT_OUT_DIR = path.join(WORKSPACE, "workspaces", "planner-runs", "item-stackable");

const REGISTRY_SPECS = [
  { kind: "equipment", path: "equipment/equipment.lst" },
  { kind: "stackable", path: "stackable/stackable.lst" },
  { kind: "appendage", path: "appendage/appendage.lst" },
  { kind: "passiveobject", path: "passiveobject/passiveobject.lst" },
  { kind: "monster", path: "monster/monster.lst" },
  { kind: "aicharacter", path: "aicharacter/aicharacter.lst" },
  { kind: "creature", path: "creature/creature.lst" },
  { kind: "pet", path: "pet/pet.lst" },
  { kind: "aura", path: "aura/aura.lst" },
];

const KNOWN_EXTENSIONS = new Set([
  "act",
  "ai",
  "ani",
  "apd",
  "atk",
  "cre",
  "equ",
  "etc",
  "img",
  "key",
  "lay",
  "mob",
  "obj",
  "ora",
  "ptl",
  "stk",
  "tbl",
]);

const ROOTS = [
  "equipment/",
  "stackable/",
  "appendage/",
  "passiveobject/",
  "monster/",
  "aicharacter/",
  "creature/",
  "pet/",
  "aura/",
  "etc/",
  "character/",
];

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const rawArg = argv[index];
    if (!rawArg.startsWith("--")) continue;
    const raw = rawArg.slice(2);
    const eqIndex = raw.indexOf("=");
    if (eqIndex >= 0) {
      args[raw.slice(0, eqIndex)] = raw.slice(eqIndex + 1);
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[raw] = next;
      index += 1;
    } else {
      args[raw] = "true";
    }
  }
  return args;
}

function numberArg(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(parsed)));
}

function boolArg(value, fallback) {
  if (value === undefined) return fallback;
  return !/^(0|false|no)$/i.test(String(value).trim());
}

function slugify(value) {
  const raw = String(value || "item-plan")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (raw || "item-plan").slice(0, 90);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function unique(values) {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== "")));
}

function extensionOf(value) {
  const match = normalizeKey(value).match(/\.([a-z0-9_]+)$/i);
  return match ? match[1].toLowerCase() : "";
}

function hasKnownExtension(value) {
  return KNOWN_EXTENSIONS.has(extensionOf(value));
}

function compactPath(value) {
  const parts = normalizePvfPath(value).split("/");
  return parts.slice(Math.max(0, parts.length - 4)).join("/");
}

function firstNumberPerLine(value) {
  const out = [];
  for (const line of String(value || "").split(/\r?\n/)) {
    const match = line.match(/^\s*(-?\d+)/);
    if (match) out.push(Number(match[1]));
  }
  return out;
}

function tagFirstColumnIds(text, tag) {
  return unique(tagBlocks(text, tag).flatMap(firstNumberPerLine).filter((value) => value > 0));
}

function tagAllPositiveIds(text, tag) {
  return unique(tagBlocks(text, tag).flatMap((block) => numbers(block).filter((value) => value > 0)));
}

function pairIdsFromBlock(block) {
  const values = numbers(block).filter((value) => value > 0);
  const out = [];
  for (let index = 0; index < values.length; index += 2) {
    out.push(values[index]);
  }
  return unique(out);
}

function inferKind(pvfPath) {
  const normalized = normalizeKey(pvfPath);
  const ext = extensionOf(normalized);
  if (normalized.startsWith("equipment/") && ext === "equ") return "equipment";
  if (normalized.startsWith("stackable/") && ext === "stk") return "stackable";
  if (normalized.startsWith("appendage/") && ext === "apd") return "appendage";
  if (normalized.startsWith("passiveobject/") && ext === "obj") return "passiveobject";
  if (normalized.startsWith("monster/") && ext === "mob") return "monster";
  if (normalized.startsWith("aicharacter/") && ext === "aic") return "aicharacter";
  if (normalized.startsWith("creature/") && ext === "cre") return "creature";
  if (normalized.startsWith("pet/")) return "pet";
  if (normalized.startsWith("aura/") && ext === "ora") return "aura";
  return ext || "file";
}

function pathVariants(value, sourcePath = "") {
  const normalized = normalizeKey(value);
  const sourceDir = path.posix.dirname(normalizeKey(sourcePath || ""));
  const out = [];
  const push = (candidate) => {
    const cleaned = normalizeKey(path.posix.normalize(candidate));
    if (cleaned && !out.includes(cleaned)) out.push(cleaned);
  };
  push(normalized);
  push(normalized.replace(/^(\.\.\/)+/, ""));
  if (sourceDir && sourceDir !== ".") push(path.posix.join(sourceDir, normalized));
  for (const root of ROOTS) {
    const index = normalized.indexOf(root);
    if (index > 0) push(normalized.slice(index));
  }
  const ext = extensionOf(normalized);
  if (ext === "obj" && !normalized.startsWith("passiveobject/")) push(path.posix.join("passiveobject", normalized));
  if (ext === "equ" && !normalized.startsWith("equipment/")) push(path.posix.join("equipment", normalized));
  if (ext === "stk" && !normalized.startsWith("stackable/")) push(path.posix.join("stackable", normalized));
  if (ext === "cre" && !normalized.startsWith("creature/")) push(path.posix.join("creature", normalized));
  if (["act", "ani", "atk", "ptl", "lay"].includes(ext) && sourceDir && sourceDir !== ".") {
    const base = path.posix.basename(normalized);
    push(path.posix.join(sourceDir, "action", base));
    push(path.posix.join(sourceDir, "animation", base));
    push(path.posix.join(sourceDir, "attackinfo", base));
    push(path.posix.join(sourceDir, "particle", base));
    push(path.posix.join(sourceDir, "script", base));
  }
  return out;
}

function walkFiles(root) {
  const pending = [root];
  const files = [];
  while (pending.length) {
    const dir = pending.shift();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

async function openFixtureSource(fixtureDir) {
  const root = path.resolve(fixtureDir);
  const fileMap = new Map();
  for (const filePath of walkFiles(root)) {
    const relative = normalizeKey(path.relative(root, filePath));
    fileMap.set(relative, filePath);
  }
  return {
    kind: "fixture-dir",
    label: path.basename(root),
    sourcePath: root,
    fileSet: new Set(fileMap.keys()),
    fileCount: fileMap.size,
    async readText(pvfPath) {
      const hit = fileMap.get(normalizeKey(pvfPath));
      if (!hit) return "";
      return fs.readFileSync(hit, "utf8");
    },
    async close() {},
  };
}

async function openPvfSource(pvfPath, encoding) {
  const native = require(findBundledNativeBackend());
  const sourcePath = path.resolve(pvfPath);
  const session = await native.openSession(sourcePath, normalizeEncoding(encoding));
  const sessionId = session.sessionId;
  const listed = await native.listFiles(sessionId);
  const fileMap = new Map();
  for (const item of listed) {
    const normalized = normalizeKey(item.fileName);
    if (!fileMap.has(normalized)) fileMap.set(normalized, normalizePvfPath(item.fileName));
  }
  return {
    kind: "pvf",
    label: path.basename(path.dirname(sourcePath)) || path.basename(sourcePath, path.extname(sourcePath)),
    sourcePath,
    fileSet: new Set(fileMap.keys()),
    fileCount: fileMap.size,
    async readText(pvfPathToRead) {
      const normalized = normalizeKey(pvfPathToRead);
      const actual = fileMap.get(normalized);
      if (!actual) return "";
      const options = commonReadOptions();
      const result = await native.readFile(sessionId, actual, options);
      return typeof result.textContent === "string" ? result.textContent : "";
    },
    async close() {
      await native.closeSession(sessionId);
    },
  };
}

async function openSource(args) {
  if (args.fixtureDir) return openFixtureSource(args.fixtureDir);
  if (args.pvf) return openPvfSource(args.pvf, args.encoding);
  throw new Error("Either --fixture-dir or --pvf is required.");
}

function pathExists(ctx, pvfPath) {
  return ctx.source.fileSet.has(normalizeKey(pvfPath));
}

async function safeRead(ctx, pvfPath) {
  if (!pathExists(ctx, pvfPath)) return "";
  try {
    return await ctx.source.readText(pvfPath);
  } catch (error) {
    ctx.readErrors.push({ pvfPath: normalizeKey(pvfPath), error: error.message });
    return "";
  }
}

async function loadRegistries(ctx) {
  for (const spec of REGISTRY_SPECS) {
    const exists = pathExists(ctx, spec.path);
    const registry = {
      ...spec,
      exists,
      entries: [],
      byId: new Map(),
      missingEntryCount: 0,
    };
    if (exists) {
      try {
        const parsed = parseLstContent(await ctx.source.readText(spec.path), spec.path);
        registry.entries = parsed.entries;
        registry.byId = parsed.byId;
        registry.missingEntryCount = registry.entries.filter((entry) => !pathExists(ctx, entry.pvfPath)).length;
        for (const entry of registry.entries) {
          ctx.registryByPath.set(normalizeKey(entry.pvfPath), {
            kind: spec.kind,
            registryPath: spec.path,
            id: entry.id,
            entry,
          });
        }
      } catch (error) {
        ctx.readErrors.push({ pvfPath: spec.path, error: error.message });
      }
    }
    ctx.registries.set(spec.kind, registry);
  }
}

function resolveRegistry(ctx, kind, id) {
  const registry = ctx.registries.get(kind);
  const entry = registry?.byId?.get(Number(id));
  if (!registry || !registry.exists) {
    return { kind, id: Number(id), registryPath: REGISTRY_SPECS.find((item) => item.kind === kind)?.path || "", hasRegistry: false, hasEntry: false, resolved: false, pvfPath: "" };
  }
  if (!entry) {
    return { kind, id: Number(id), registryPath: registry.path, hasRegistry: true, hasEntry: false, resolved: false, pvfPath: "" };
  }
  return {
    kind,
    id: Number(id),
    registryPath: registry.path,
    hasRegistry: true,
    hasEntry: true,
    rawPath: entry.rawPath,
    pvfPath: normalizeKey(entry.pvfPath),
    resolved: pathExists(ctx, entry.pvfPath),
  };
}

function candidateFromPath(ctx, rawPath, source, confidence = "medium") {
  const pvfPath = normalizeKey(rawPath);
  const registryHit = ctx.registryByPath.get(pvfPath);
  return {
    key: registryHit ? `${registryHit.kind}:${registryHit.id}` : `path:${pvfPath}`,
    type: registryHit?.kind || inferKind(pvfPath),
    id: registryHit?.id ?? null,
    registryPath: registryHit?.registryPath || null,
    rawPath: registryHit?.entry?.rawPath || null,
    pvfPath,
    exists: pathExists(ctx, pvfPath),
    root: false,
    confidence: registryHit ? "high" : confidence,
    reasons: [source],
    sampleName: "",
  };
}

function candidateFromRegistryHit(hit, source) {
  return {
    key: `${hit.kind}:${hit.id}`,
    type: hit.kind,
    id: hit.id,
    registryPath: hit.registryPath,
    rawPath: hit.rawPath || null,
    pvfPath: normalizeKey(hit.pvfPath || ""),
    exists: Boolean(hit.resolved),
    root: false,
    confidence: hit.resolved ? "high" : "medium",
    reasons: [source],
    sampleName: "",
  };
}

function addCandidate(ctx, candidate) {
  if (!candidate || !candidate.pvfPath) return null;
  const existing = ctx.candidateMap.get(candidate.key);
  if (!existing) {
    const next = {
      ...candidate,
      reasons: unique(candidate.reasons || []),
    };
    ctx.candidateMap.set(candidate.key, next);
    return next;
  }
  existing.exists = existing.exists || candidate.exists;
  existing.root = existing.root || candidate.root;
  existing.reasons = unique([...(existing.reasons || []), ...(candidate.reasons || [])]);
  if (candidate.confidence === "high") existing.confidence = "high";
  return existing;
}

function addRelation(ctx, relation) {
  const normalized = {
    confidence: relation.resolved ? "high" : "medium",
    ...relation,
  };
  ctx.relations.push(normalized);
  if (!normalized.resolved) ctx.unresolvedReferences.push(normalized);
}

function addResolvedRelation(ctx, sourceCandidate, relationKind, hit, evidence, depthRemaining) {
  const target = {
    type: hit.kind,
    id: hit.id,
    registryPath: hit.registryPath,
    pvfPath: hit.pvfPath || "",
  };
  addRelation(ctx, {
    relationKind,
    source: candidateRef(sourceCandidate),
    target,
    resolved: Boolean(hit.resolved),
    evidence,
  });
  if (!hit.hasEntry || !hit.pvfPath) return null;
  const child = addCandidate(ctx, candidateFromRegistryHit(hit, `${relationKind} ${hit.kind}:${hit.id}`));
  if (child && depthRemaining > 0) ctx.queue.push({ candidate: child, depthRemaining });
  return child;
}

function candidateRef(candidate) {
  return {
    type: candidate.type,
    id: candidate.id,
    registryPath: candidate.registryPath,
    pvfPath: candidate.pvfPath,
  };
}

function addExternalAsset(ctx, sourceCandidate, raw, evidence) {
  const imgPath = normalizePvfPath(raw);
  const key = normalizeKey(imgPath);
  if (!ctx.externalAssetMap.has(key)) {
    ctx.externalAssetMap.set(key, { imgPath, sources: [] });
  }
  const row = ctx.externalAssetMap.get(key);
  row.sources.push({ pvfPath: sourceCandidate.pvfPath, evidence });
  addRelation(ctx, {
    relationKind: "external.img",
    source: candidateRef(sourceCandidate),
    target: { type: "external_img", id: null, registryPath: null, pvfPath: imgPath },
    resolved: false,
    evidence,
    confidence: "low",
  });
}

function resolveFileRef(ctx, raw, sourcePath) {
  const normalized = normalizeKey(raw);
  const ext = extensionOf(normalized);
  if (!normalized || !hasKnownExtension(normalized)) return null;
  if (ext === "img") {
    return { raw, kind: "external_img", resolved: false, targetPath: "", candidates: [] };
  }
  const candidates = pathVariants(normalized, sourcePath);
  const targetPath = candidates.find((candidate) => pathExists(ctx, candidate)) || "";
  return {
    raw,
    kind: targetPath ? inferKind(targetPath) : inferKind(normalized),
    resolved: Boolean(targetPath),
    targetPath,
    candidates: candidates.slice(0, 8),
  };
}

function addFileRelations(ctx, sourceCandidate, text, relationKind, depthRemaining) {
  const rawRefs = unique(backtickValues(text));
  let count = 0;
  for (const raw of rawRefs) {
    const ref = resolveFileRef(ctx, raw, sourceCandidate.pvfPath);
    if (!ref) continue;
    count += 1;
    if (count > ctx.args.limit * 8) break;
    if (ref.kind === "external_img") {
      addExternalAsset(ctx, sourceCandidate, ref.raw, `${relationKind}: ${ref.raw}`);
      continue;
    }
    addRelation(ctx, {
      relationKind,
      source: candidateRef(sourceCandidate),
      target: { type: ref.kind, id: null, registryPath: null, pvfPath: ref.targetPath || normalizePvfPath(ref.raw) },
      resolved: Boolean(ref.resolved),
      evidence: ref.resolved ? ref.raw : `${ref.raw} unresolved; candidates=${ref.candidates.join(", ")}`,
      confidence: ref.resolved ? "high" : "low",
    });
    if (!ref.resolved || depthRemaining <= 0) continue;
    const child = addCandidate(ctx, candidateFromPath(ctx, ref.targetPath, `${relationKind} ${ref.raw}`, "medium"));
    if (child) ctx.queue.push({ candidate: child, depthRemaining });
  }
}

async function addSampleName(ctx, candidate, text) {
  if (candidate.sampleName || !text) return;
  candidate.sampleName = firstBacktick(text, "name") || firstBacktick(text, "name2") || firstBacktick(text, "explain") || "";
}

async function expandEquipment(ctx, candidate, depthRemaining) {
  const text = await safeRead(ctx, candidate.pvfPath);
  await addSampleName(ctx, candidate, text);
  if (!text) return;

  for (const id of unique([...tagAllPositiveIds(text, "appendage"), ...tagAllPositiveIds(text, "my appendage")]).slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.appendage", resolveRegistry(ctx, "appendage", id), `[appendage] id=${id}`, depthRemaining - 1);
  }
  for (const id of tagFirstColumnIds(text, "passive object").slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.passiveObject", resolveRegistry(ctx, "passiveobject", id), `[passive object] id=${id}`, depthRemaining - 1);
  }
  for (const id of tagFirstColumnIds(text, "summon monster").slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.summonMonster", resolveRegistry(ctx, "monster", id), `[summon monster] id=${id}`, depthRemaining - 1);
  }
  for (const id of tagFirstColumnIds(text, "summon apc").slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.summonApc", resolveRegistry(ctx, "aicharacter", id), `[summon apc] id=${id}`, depthRemaining - 1);
  }
  for (const id of tagAllPositiveIds(text, "creature species").slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.creatureSpecies", resolveRegistry(ctx, "creature", id), `[creature species] id=${id}`, depthRemaining - 1);
  }
  for (const id of tagFirstColumnIds(text, "creature").slice(0, ctx.args.limit)) {
    addResolvedRelation(ctx, candidate, "equipment.creature", resolveRegistry(ctx, "creature", id), `[creature] id=${id}`, depthRemaining - 1);
  }

  await inspectEquipmentPartSet(ctx, candidate, depthRemaining);
  addFileRelations(ctx, candidate, text, "equipment.fileRef", depthRemaining - 1);
}

function targetKindsForBlockTag(tag) {
  const normalized = tag.toLowerCase();
  if (normalized.includes("equipment")) return ["equipment"];
  if (normalized.includes("stackable")) return ["stackable"];
  if (normalized.includes("creature") || normalized.includes("pet")) return ["creature", "pet"];
  if (normalized.includes("monster card")) return ["equipment", "stackable"];
  return ["equipment", "stackable", "creature", "pet"];
}

function idsForStackableBlock(tag, block) {
  const normalized = tag.toLowerCase();
  if (["package data", "package data selection", "random list", "result item", "consume item", "item"].includes(normalized)) {
    return pairIdsFromBlock(block);
  }
  return unique(numbers(block).filter((value) => value > 0));
}

async function expandStackable(ctx, candidate, depthRemaining) {
  const text = await safeRead(ctx, candidate.pvfPath);
  await addSampleName(ctx, candidate, text);
  if (!text) return;

  const blockTags = [
    "monster card id",
    "package data",
    "package data selection",
    "random list",
    "result item",
    "consume item",
    "equipment",
    "stackable",
    "creature",
    "pet",
    "item",
    "booster info",
    "booster equipment upgrade",
    "target item id",
  ];
  for (const tag of blockTags) {
    const blocks = tagBlocks(text, tag);
    for (const block of blocks) {
      const ids = idsForStackableBlock(tag, block).slice(0, ctx.args.limit);
      const targetKinds = targetKindsForBlockTag(tag);
      for (const id of ids) {
        let hitCount = 0;
        for (const kind of targetKinds) {
          const hit = resolveRegistry(ctx, kind, id);
          if (!hit.hasEntry) continue;
          hitCount += 1;
          addResolvedRelation(ctx, candidate, `stackable.${tag}`, hit, `[${tag}] id=${id}`, depthRemaining - 1);
        }
        if (!hitCount && ctx.args.reportUnresolvedIds) {
          addRelation(ctx, {
            relationKind: `stackable.${tag}`,
            source: candidateRef(candidate),
            target: { type: targetKinds.join("|"), id, registryPath: null, pvfPath: "" },
            resolved: false,
            evidence: `[${tag}] id=${id} unresolved in ${targetKinds.join(",")}`,
          });
        }
      }
    }
  }

  addFileRelations(ctx, candidate, text, "stackable.fileRef", depthRemaining - 1);
}

async function expandSimpleFile(ctx, candidate, depthRemaining) {
  const text = await safeRead(ctx, candidate.pvfPath);
  await addSampleName(ctx, candidate, text);
  if (!text) return;
  addFileRelations(ctx, candidate, `${text}`, `${candidate.type}.fileRef`, depthRemaining - 1);
}

async function inspectEquipmentPartSet(ctx, candidate, depthRemaining) {
  if (!pathExists(ctx, "etc/equipmentpartset.etc")) return;
  if (!ctx.partSetCache) {
    const text = await safeRead(ctx, "etc/equipmentpartset.etc");
    ctx.partSetCache = tagBlocks(text, "equipment part set").map((block, index) => ({
      index,
      members: unique(backtickValues(block).filter((value) => /\.equ$/i.test(value)).map((value) => normalizePvfPath(value))),
    }));
  }
  const candidateKeys = new Set([candidate.pvfPath, candidate.rawPath, normalizePvfPath(candidate.pvfPath).replace(/^equipment\//i, "")].filter(Boolean).map(normalizeKey));
  for (const block of ctx.partSetCache) {
    const memberKeys = block.members.map((member) => normalizeKey(member).startsWith("equipment/") ? normalizeKey(member) : normalizeKey(`equipment/${member}`));
    if (!memberKeys.some((member) => candidateKeys.has(member) || candidateKeys.has(member.replace(/^equipment\//, "")))) continue;
    const partSet = {
      blockIndex: block.index,
      sourceEquipment: candidate.pvfPath,
      members: block.members,
      resolvedMembers: [],
    };
    for (const rawMember of block.members.slice(0, ctx.args.limit)) {
      const fullPath = normalizeKey(rawMember).startsWith("equipment/") ? normalizeKey(rawMember) : normalizeKey(`equipment/${rawMember}`);
      const registryHit = ctx.registryByPath.get(fullPath);
      const child = registryHit
        ? addCandidate(ctx, candidateFromRegistryHit({
            kind: registryHit.kind,
            id: registryHit.id,
            registryPath: registryHit.registryPath,
            rawPath: registryHit.entry.rawPath,
            pvfPath: registryHit.entry.pvfPath,
            resolved: pathExists(ctx, registryHit.entry.pvfPath),
          }, `equipment.partSet block=${block.index}`))
        : addCandidate(ctx, candidateFromPath(ctx, fullPath, `equipment.partSet block=${block.index}`, "medium"));
      partSet.resolvedMembers.push({
        rawPath: rawMember,
        pvfPath: child?.pvfPath || fullPath,
        exists: Boolean(child?.exists),
        id: child?.id ?? null,
      });
      addRelation(ctx, {
        relationKind: "equipment.partSetMember",
        source: candidateRef(candidate),
        target: { type: child?.type || "equipment", id: child?.id ?? null, registryPath: child?.registryPath || null, pvfPath: child?.pvfPath || fullPath },
        resolved: Boolean(child?.exists),
        evidence: `etc/equipmentpartset.etc block=${block.index}`,
      });
      if (child && depthRemaining > 1) ctx.queue.push({ candidate: child, depthRemaining: depthRemaining - 1 });
    }
    ctx.partSetBlocks.push(partSet);
  }
}

async function expandCandidate(ctx, candidate, depthRemaining) {
  if (!candidate || depthRemaining < 1) return;
  const prevDepth = ctx.expandedDepth.get(candidate.key) || 0;
  if (prevDepth >= depthRemaining) return;
  ctx.expandedDepth.set(candidate.key, depthRemaining);
  if (!candidate.exists) return;
  if (candidate.type === "equipment") {
    await expandEquipment(ctx, candidate, depthRemaining);
  } else if (candidate.type === "stackable") {
    await expandStackable(ctx, candidate, depthRemaining);
  } else {
    await expandSimpleFile(ctx, candidate, depthRemaining);
  }
}

function findSampleRoot(ctx, kind, keyword) {
  const registry = ctx.registries.get(kind);
  if (!registry || !registry.exists) return null;
  const keywordLower = normalizeKey(keyword || "");
  const entries = registry.entries.filter((entry) => pathExists(ctx, entry.pvfPath));
  if (!entries.length) return null;
  const preferred = keywordLower ? entries.find((entry) => normalizeKey(entry.pvfPath).includes(keywordLower) || normalizeKey(entry.rawPath).includes(keywordLower)) : null;
  const entry = preferred || entries[0];
  return candidateFromRegistryHit({
    kind,
    id: entry.id,
    registryPath: registry.path,
    rawPath: entry.rawPath,
    pvfPath: entry.pvfPath,
    resolved: true,
  }, `sample ${kind}${keyword ? ` keyword=${keyword}` : ""}`);
}

function discoverRoots(ctx) {
  const roots = [];
  if (ctx.args.sampleKind) {
    const sample = findSampleRoot(ctx, ctx.args.sampleKind, ctx.args.sampleKeyword);
    if (sample) roots.push(sample);
    else ctx.warnings.push(`No sample root found for ${ctx.args.sampleKind}.`);
  }
  if (ctx.args.path) {
    roots.push(candidateFromPath(ctx, ctx.args.path, "input path", "high"));
  }
  if (ctx.args.id !== undefined) {
    const id = Number(ctx.args.id);
    const kinds = ctx.args.type === "auto" ? ["equipment", "stackable"] : [ctx.args.type];
    for (const kind of kinds) {
      const hit = resolveRegistry(ctx, kind, id);
      if (hit.hasEntry) roots.push(candidateFromRegistryHit(hit, `input ${kind}:${id}`));
    }
    if (!roots.length) ctx.warnings.push(`ID ${id} was not found in ${kinds.join(", ")}.`);
  }
  if (ctx.args.query) {
    const query = String(ctx.args.query).trim();
    const queryKey = normalizeKey(query);
    if (/^\d+$/.test(query)) {
      for (const kind of ["equipment", "stackable"]) {
        const hit = resolveRegistry(ctx, kind, Number(query));
        if (hit.hasEntry) roots.push(candidateFromRegistryHit(hit, `query id ${query}`));
      }
    } else if (hasKnownExtension(queryKey)) {
      roots.push(candidateFromPath(ctx, queryKey, "query path", "high"));
    } else {
      for (const kind of ["equipment", "stackable"]) {
        const registry = ctx.registries.get(kind);
        for (const entry of (registry?.entries || []).filter((item) => pathExists(ctx, item.pvfPath)).slice(0, ctx.args.limit * 20)) {
          if (!normalizeKey(entry.pvfPath).includes(queryKey) && !normalizeKey(entry.rawPath).includes(queryKey)) continue;
          roots.push(candidateFromRegistryHit({
            kind,
            id: entry.id,
            registryPath: registry.path,
            rawPath: entry.rawPath,
            pvfPath: entry.pvfPath,
            resolved: true,
          }, `query ${query}`));
          if (roots.length >= ctx.args.limit) break;
        }
      }
    }
  }
  const deduped = [];
  const seen = new Set();
  for (const root of roots) {
    if (!root || seen.has(root.key)) continue;
    root.root = true;
    seen.add(root.key);
    deduped.push(addCandidate(ctx, root));
  }
  for (const root of deduped) ctx.queue.push({ candidate: root, depthRemaining: ctx.args.depth });
  return deduped;
}

async function expandAll(ctx) {
  while (ctx.queue.length) {
    const { candidate, depthRemaining } = ctx.queue.shift();
    await expandCandidate(ctx, candidate, depthRemaining);
    if (ctx.expandedDepth.size > ctx.args.maxNodes) {
      ctx.warnings.push(`Expansion stopped at maxNodes=${ctx.args.maxNodes}.`);
      break;
    }
  }
}

function registrySummary(ctx) {
  return Object.fromEntries(Array.from(ctx.registries.entries()).map(([kind, registry]) => [
    kind,
    {
      path: registry.path,
      exists: registry.exists,
      entryCount: registry.entries.length,
      missingEntryCount: registry.missingEntryCount,
    },
  ]));
}

function registryAdditionPreview(candidates) {
  const groups = new Map();
  for (const item of candidates) {
    if (!item.registryPath || item.id === null || item.id === undefined) continue;
    if (!groups.has(item.registryPath)) groups.set(item.registryPath, []);
    groups.get(item.registryPath).push({
      id: item.id,
      rawPath: item.rawPath,
      pvfPath: item.pvfPath,
      exists: item.exists,
      root: item.root,
      type: item.type,
    });
  }
  return Array.from(groups.entries()).map(([registryPath, entries]) => ({
    registryPath,
    count: entries.length,
    entries: entries.sort((a, b) => a.id - b.id || a.pvfPath.localeCompare(b.pvfPath)),
  })).sort((a, b) => a.registryPath.localeCompare(b.registryPath));
}

function finalize(ctx, roots) {
  const candidates = Array.from(ctx.candidateMap.values()).sort((a, b) => {
    if (a.root !== b.root) return a.root ? -1 : 1;
    const typeDelta = a.type.localeCompare(b.type);
    if (typeDelta) return typeDelta;
    return a.pvfPath.localeCompare(b.pvfPath);
  });
  const externalAssets = Array.from(ctx.externalAssetMap.values()).map((item) => ({
    imgPath: item.imgPath,
    sourceCount: item.sources.length,
    sources: item.sources.slice(0, ctx.args.limit),
  })).sort((a, b) => a.imgPath.localeCompare(b.imgPath));
  const registryPreview = registryAdditionPreview(candidates);
  return {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    readonly: true,
    artifactId: ctx.artifactId,
    inputs: {
      fixtureDir: ctx.args.fixtureDir || null,
      pvf: ctx.args.pvf || null,
      encoding: ctx.args.encoding,
      id: ctx.args.id ?? null,
      type: ctx.args.type,
      path: ctx.args.path || null,
      query: ctx.args.query || null,
      sampleKind: ctx.args.sampleKind || null,
      sampleKeyword: ctx.args.sampleKeyword || null,
      depth: ctx.args.depth,
      limit: ctx.args.limit,
    },
    source: {
      kind: ctx.source.kind,
      label: ctx.source.label,
      path: ctx.source.sourcePath,
      fileCount: ctx.source.fileCount,
    },
    boundary: {
      sourcePvfOpenedReadOnly: ctx.source.kind === "pvf",
      pvfWritten: false,
      clientTouched: false,
      knowledgePackTouched: false,
      pvfWriteAuthorized: false,
      generatedPatch: false,
      outputIsImportPlan: false,
      clientAssetsNotVerifiedHere: true,
    },
    summary: {
      rootCount: roots.length,
      candidateCount: candidates.length,
      relationCount: ctx.relations.length,
      unresolvedReferenceCount: ctx.unresolvedReferences.length,
      externalAssetRefCount: externalAssets.length,
      registryAdditionPreviewGroupCount: registryPreview.length,
      registryAdditionPreviewEntryCount: registryPreview.reduce((sum, group) => sum + group.count, 0),
      partSetBlockCount: ctx.partSetBlocks.length,
      readErrorCount: ctx.readErrors.length,
      warningCount: ctx.warnings.length,
      expandedNodeCount: ctx.expandedDepth.size,
    },
    registries: registrySummary(ctx),
    roots: roots.map(candidateRef),
    candidates,
    relations: ctx.relations.slice(0, ctx.args.limit * 40),
    unresolvedReferences: ctx.unresolvedReferences.slice(0, ctx.args.limit * 20),
    externalAssetRefs: externalAssets,
    registryAdditionPreview: registryPreview,
    equipmentPartSetBlocks: ctx.partSetBlocks,
    warnings: ctx.warnings,
    readErrors: ctx.readErrors,
  };
}

function escapeMd(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function renderMarkdown(artifact) {
  const lines = [];
  lines.push(`# ${artifact.artifactId}`);
  lines.push("");
  lines.push("本报告由只读 `plan-item-stackable-dependencies.js` 生成，只定位 item/equipment/stackable/creature/avatar 相关依赖候选；不写 PVF、不改客户端、不生成可直接 apply 的 patch。");
  lines.push("");
  lines.push("## 输入");
  lines.push("");
  lines.push(`- source: ${artifact.source.kind} \`${escapeMd(artifact.source.label)}\``);
  lines.push(`- pvf: \`${escapeMd(artifact.inputs.pvf || "-")}\``);
  lines.push(`- fixtureDir: \`${escapeMd(artifact.inputs.fixtureDir || "-")}\``);
  lines.push(`- id/type/path/query/sample: \`${escapeMd([artifact.inputs.id, artifact.inputs.type, artifact.inputs.path, artifact.inputs.query, artifact.inputs.sampleKind].filter(Boolean).join(" / ") || "-")}\``);
  lines.push(`- depth=${artifact.inputs.depth}, limit=${artifact.inputs.limit}`);
  lines.push("");
  lines.push("## 摘要");
  lines.push("");
  lines.push("| 项 | 值 |");
  lines.push("| --- | ---: |");
  for (const [key, value] of Object.entries(artifact.summary)) {
    lines.push(`| ${key} | ${value} |`);
  }
  lines.push("");
  lines.push("## Root");
  lines.push("");
  lines.push("| 类型 | ID | PVF 路径 |");
  lines.push("| --- | ---: | --- |");
  for (const root of artifact.roots) {
    lines.push(`| ${root.type} | ${root.id ?? ""} | \`${escapeMd(root.pvfPath)}\` |`);
  }
  if (!artifact.roots.length) lines.push("| - | - | 未找到 root；请换用明确 ID 或 PVF path。 |");
  lines.push("");
  lines.push("## 候选文件");
  lines.push("");
  lines.push("| root | 类型 | ID | exists | PVF 路径 | 名称/原因 |");
  lines.push("| --- | --- | ---: | --- | --- | --- |");
  for (const item of artifact.candidates.slice(0, 80)) {
    lines.push(`| ${item.root ? "Y" : ""} | ${item.type} | ${item.id ?? ""} | ${item.exists ? "Y" : "N"} | \`${escapeMd(item.pvfPath)}\` | ${escapeMd(item.sampleName || (item.reasons || []).slice(0, 2).join("; "))} |`);
  }
  lines.push("");
  lines.push("## 关系摘要");
  lines.push("");
  lines.push("| 关系 | 来源 | 目标 | 状态 | 证据 |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const relation of artifact.relations.slice(0, 100)) {
    lines.push(`| ${escapeMd(relation.relationKind)} | \`${escapeMd(compactPath(relation.source.pvfPath))}\` | \`${escapeMd(relation.target.pvfPath || `${relation.target.type}:${relation.target.id}`)}\` | ${relation.resolved ? "closed" : "open"} | ${escapeMd(relation.evidence || "")} |`);
  }
  if (!artifact.relations.length) lines.push("| - | - | - | - | 未生成关系。 |");
  lines.push("");
  lines.push("## 未闭合引用");
  lines.push("");
  if (artifact.unresolvedReferences.length) {
    for (const relation of artifact.unresolvedReferences.slice(0, 40)) {
      lines.push(`- ${relation.relationKind}: \`${escapeMd(relation.source.pvfPath)}\` -> \`${escapeMd(relation.target.pvfPath || relation.target.id || "")}\` (${escapeMd(relation.evidence || "")})`);
    }
  } else {
    lines.push("- 无。");
  }
  lines.push("");
  lines.push("## 外部 IMG / 客户端资源风险");
  lines.push("");
  if (artifact.externalAssetRefs.length) {
    for (const item of artifact.externalAssetRefs.slice(0, 40)) {
      lines.push(`- \`${escapeMd(item.imgPath)}\` (${item.sourceCount} refs)`);
    }
  } else {
    lines.push("- 当前闭包未发现外部 IMG 引用；这不等于客户端资源已完整。");
  }
  lines.push("");
  lines.push("## Registry 线索");
  lines.push("");
  for (const group of artifact.registryAdditionPreview) {
    lines.push(`- \`${group.registryPath}\`: ${group.count} entries`);
  }
  if (!artifact.registryAdditionPreview.length) lines.push("- 无 registry 线索。");
  lines.push("");
  lines.push("## equipmentpartset.etc");
  lines.push("");
  if (artifact.equipmentPartSetBlocks.length) {
    for (const block of artifact.equipmentPartSetBlocks.slice(0, 20)) {
      lines.push(`- block ${block.blockIndex}: ${block.resolvedMembers.length} members`);
    }
  } else {
    lines.push("- 未命中套装块，或源 PVF/fixture 不含 `etc/equipmentpartset.etc`。");
  }
  lines.push("");
  lines.push("## 边界");
  lines.push("");
  lines.push("- 本输出不是导入计划，只是只读依赖候选与 registry 线索。");
  lines.push("- `external_img` 必须另用客户端 ImagePacks2/NPK 检查；Script.pvf 引用不能证明客户端资源存在。");
  lines.push("- 未闭合引用不一定是错误，可能是模板路径、客户端资源、未支持 tag 或目标 PVF 缺文件。");
  return `${lines.join("\n")}\n`;
}

function validateArgs(args) {
  if (!args.fixtureDir && !args.pvf) throw new Error("Use --fixture-dir=DIR or --pvf=Script.pvf.");
  if (args.fixtureDir && !fs.existsSync(args.fixtureDir)) throw new Error(`fixture dir not found: ${args.fixtureDir}`);
  if (args.pvf && !fs.existsSync(args.pvf)) throw new Error(`PVF not found: ${args.pvf}`);
  if (!args.sampleKind && !args.path && args.id === undefined && !args.query) {
    throw new Error("Use one root selector: --id, --path, --query, or --sample-kind.");
  }
  if (!["auto", "equipment", "stackable"].includes(args.type)) throw new Error("--type must be auto, equipment, or stackable.");
  if (args.sampleKind && !["equipment", "stackable"].includes(args.sampleKind)) throw new Error("--sample-kind must be equipment or stackable.");
}

async function main() {
  const rawArgs = parseArgs(process.argv.slice(2));
  if (rawArgs.help) {
    console.log(`Usage:
  node tools/pvf-bridge/plan-item-stackable-dependencies.js --fixture-dir=DIR --id=100 --type=equipment
  node tools/pvf-bridge/plan-item-stackable-dependencies.js --pvf=Script.pvf --id=100 --type=equipment
  node tools/pvf-bridge/plan-item-stackable-dependencies.js --pvf=Script.pvf --sample-kind=stackable --sample-keyword=package
`);
    return;
  }
  const rootLabel = rawArgs.id || rawArgs.path || rawArgs.query || `${rawArgs["sample-kind"] || "sample"}-${rawArgs["sample-keyword"] || ""}`;
  const sourceLabel = rawArgs["fixture-dir"] ? path.basename(path.resolve(rawArgs["fixture-dir"])) : path.basename(path.dirname(path.resolve(rawArgs.pvf || "pvf")));
  const artifactId = `item-stackable-plan-${slugify(sourceLabel)}-${slugify(rootLabel)}-${DATE_TAG}`;
  const outDir = rawArgs["out-dir"] ? path.resolve(rawArgs["out-dir"]) : DEFAULT_OUT_DIR;
  const args = {
    fixtureDir: rawArgs["fixture-dir"] ? path.resolve(rawArgs["fixture-dir"]) : "",
    pvf: rawArgs.pvf ? path.resolve(rawArgs.pvf) : "",
    encoding: rawArgs.encoding || "Tw",
    id: rawArgs.id !== undefined ? Number(rawArgs.id) : undefined,
    type: String(rawArgs.type || "auto").toLowerCase(),
    path: rawArgs.path || "",
    query: rawArgs.query || "",
    sampleKind: rawArgs["sample-kind"] || "",
    sampleKeyword: rawArgs["sample-keyword"] || "",
    depth: numberArg(rawArgs.depth, 2, 1, 5),
    limit: numberArg(rawArgs.limit, 40, 1, 300),
    maxNodes: numberArg(rawArgs["max-nodes"], 800, 20, 5000),
    reportUnresolvedIds: boolArg(rawArgs["report-unresolved-ids"], true),
    out: rawArgs.out ? path.resolve(rawArgs.out) : path.join(outDir, `${artifactId}.json`),
    mdOut: rawArgs["md-out"] ? path.resolve(rawArgs["md-out"]) : path.join(outDir, `${artifactId}.zh-CN.md`),
  };
  validateArgs(args);

  const source = await openSource(args);
  const ctx = {
    args,
    source,
    artifactId,
    registries: new Map(),
    registryByPath: new Map(),
    candidateMap: new Map(),
    queue: [],
    expandedDepth: new Map(),
    relations: [],
    unresolvedReferences: [],
    externalAssetMap: new Map(),
    partSetBlocks: [],
    partSetCache: null,
    warnings: [],
    readErrors: [],
  };

  try {
    await loadRegistries(ctx);
    const roots = discoverRoots(ctx);
    await expandAll(ctx);
    const artifact = finalize(ctx, roots);
    writeText(args.out, JSON.stringify(artifact, null, 2));
    writeText(args.mdOut, renderMarkdown(artifact));
    console.log(JSON.stringify({ ok: true, out: args.out, mdOut: args.mdOut, summary: artifact.summary }, null, 2));
  } finally {
    await source.close();
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
