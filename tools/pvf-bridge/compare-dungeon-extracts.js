"use strict";

const fs = require("fs");
const path = require("path");

const TEXT_EXTS = new Set([
  ".act",
  ".ai",
  ".aic",
  ".ani",
  ".atk",
  ".dgn",
  ".equ",
  ".etc",
  ".hash",
  ".json",
  ".key",
  ".lay",
  ".lst",
  ".map",
  ".mob",
  ".npc",
  ".obj",
  ".ptl",
  ".qst",
  ".skl",
  ".stk",
  ".til",
  ".txt",
]);

const METADATA_NAMES = new Set([
  "asset_manifest.json",
  "external_refs.txt",
  "extracted-files.txt",
  "manifest.json",
  "missing_refs.txt",
  "read_errors.json",
]);

const SCENARIO_SUPPORT_ROOTS = new Set(["aicharacter", "equipment", "n_quest", "npc"]);

const POLICY_RULES = {
  left: {
    core_ref_source_members: {
      action: "keep_required",
      label: "Keep Required",
      rationale: "Directly referenced source members from the core dungeon closure.",
    },
    core_registered_members: {
      action: "keep_required",
      label: "Keep Required",
      rationale: "Registered members present in the left-side core closure list.",
    },
    core_support_files: {
      action: "keep_required",
      label: "Keep Required",
      rationale: "Support scripts and attack definitions required by core closure members.",
    },
    metadata_artifacts: {
      action: "ignore_tooling",
      label: "Ignore",
      rationale: "Extractor metadata, not gameplay content.",
    },
    uncategorized: {
      action: "manual_review",
      label: "Review",
      rationale: "Not covered by a stable rule yet; needs manual review.",
    },
  },
  right: {
    scenario_support_files: {
      action: "keep_if_expansion_enabled",
      label: "Keep With Expansion",
      rationale: "Support files for story, APC, and equipment expansion layers. Keep them when preserving expansion gameplay.",
    },
    scenario_registered_support: {
      action: "keep_gameplay_expansion",
      label: "Keep Gameplay Expansion",
      rationale: "Registered story, APC, or equipment expansion entities, usually part of gameplay branches.",
    },
    branch_support_files: {
      action: "keep_gameplay_expansion",
      label: "Keep Gameplay Expansion",
      rationale: "Monsters, passive objects, and support files brought in by branch maps or gameplay expansions.",
    },
    branch_registered_support: {
      action: "keep_gameplay_expansion",
      label: "Keep Gameplay Expansion",
      rationale: "Registered members of branch gameplay content; keep them together with the related branch maps.",
    },
    branch_registered_maps: {
      action: "keep_gameplay_expansion",
      label: "Keep Gameplay Expansion",
      rationale: "Variant dungeon maps that usually represent gameplay branches, story inserts, or random-task style flows.",
    },
    branch_map_files: {
      action: "keep_gameplay_expansion",
      label: "Keep Gameplay Expansion",
      rationale: "Variant map files tied to gameplay branch content.",
    },
    packaging_artifacts: {
      action: "ignore_packaging",
      label: "Ignore",
      rationale: "Packaging output rather than PVF closure content.",
    },
    uncategorized: {
      action: "manual_review",
      label: "Review",
      rationale: "Not covered by a stable rule yet; needs manual review.",
    },
  },
};

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
  node tools/pvf-bridge/compare-dungeon-extracts.js --left=DIR --right=DIR [--report=report.md] [--manifest=manifest.json]

Rules:
  Compares two existing local extract directories. It does not read or write PVF files.
`);
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
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

function normalizeImgPath(value) {
  let key = normalizeKey(value);
  if (key.startsWith("sprite/")) {
    key = key.slice("sprite/".length);
  }
  return key;
}

function walkFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const relPath = normalizeRel(path.relative(rootDir, fullPath));
      files.push({
        key: normalizeKey(relPath),
        relPath,
        fullPath,
        size: fs.statSync(fullPath).size,
      });
    }
  }
  files.sort((a, b) => a.key.localeCompare(b.key));
  return files;
}

function fileMap(files) {
  const map = new Map();
  for (const file of files) {
    map.set(file.key, file);
  }
  return map;
}

function directoryHasPackagingArtifacts(files) {
  return files.some((file) => {
    const ext = path.extname(file.relPath).toLowerCase();
    const base = path.basename(file.relPath).toLowerCase();
    return ext === ".npk" || ext === ".hash" || base === "npk_img_save.txt" || base === "asset_manifest.json";
  });
}

function firstSegment(relPath) {
  const normalized = normalizeRel(relPath);
  const slash = normalized.indexOf("/");
  return slash >= 0 ? normalized.slice(0, slash).toLowerCase() : "(top)";
}

function firstTwoSegments(relPath) {
  const parts = normalizeRel(relPath).split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].toLowerCase()}/${parts[1].toLowerCase()}`;
  }
  return parts[0] ? parts[0].toLowerCase() : "(top)";
}

function parseNeedsList(listPath) {
  if (!listPath || !fs.existsSync(listPath)) {
    return { keys: new Set(), sections: {} };
  }
  const lines = fs.readFileSync(listPath, "utf8").replace(/\r\n/g, "\n").split("\n");
  let currentSection = "";
  const keys = new Set();
  const sections = {};
  for (const line of lines) {
    const heading = line.match(/^\uFEFF?\s*([A-Za-z_]+).*?list/i);
    if (heading) {
      currentSection = heading[1].toLowerCase();
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      continue;
    }
    const match = line.match(/`([^`]+)`/);
    if (!match || !currentSection) {
      continue;
    }
    const relPath = normalizeRel(`${currentSection}/${match[1]}`);
    const key = normalizeKey(relPath);
    keys.add(key);
    sections[currentSection].push(relPath);
  }
  return { keys, sections };
}

function parseExternalRefs(refPath) {
  if (!refPath || !fs.existsSync(refPath)) {
    return { sourceKeys: new Set(), imgKeys: new Set() };
  }
  const sourceKeys = new Set();
  const imgKeys = new Set();
  const lines = fs.readFileSync(refPath, "utf8").replace(/\r\n/g, "\n").split("\n");
  for (const line of lines) {
    if (!line.includes("->")) {
      continue;
    }
    const [left, right] = line.split("->", 2);
    const source = normalizeKey(left);
    const img = normalizeImgPath(right);
    if (source) {
      sourceKeys.add(source);
    }
    if (img) {
      imgKeys.add(img);
    }
  }
  return { sourceKeys, imgKeys };
}

function parseNpkImgList(listPath) {
  if (!listPath || !fs.existsSync(listPath)) {
    return new Set();
  }
  const keys = new Set();
  const lines = fs.readFileSync(listPath, "utf8").replace(/\r\n/g, "\n").split("\n");
  for (const line of lines) {
    const value = normalizeImgPath(line);
    if (value) {
      keys.add(value);
    }
  }
  return keys;
}

function readBuffer(filePath) {
  return fs.readFileSync(filePath);
}

function isTextLike(relPath) {
  return TEXT_EXTS.has(path.extname(relPath).toLowerCase());
}

function tokenizeText(value) {
  const text = String(value || "").replace(/\r\n/g, "\n");
  const tokens = [];
  let index = 0;
  while (index < text.length) {
    const ch = text[index];
    if (ch === "`") {
      let end = index + 1;
      while (end < text.length && text[end] !== "`") {
        end += 1;
      }
      const raw = text.slice(index, end < text.length ? end + 1 : text.length);
      const compact = raw.replace(/\s+/g, " ").trim();
      if (compact) {
        tokens.push(compact);
      }
      index = end < text.length ? end + 1 : text.length;
      continue;
    }
    if (/\s/.test(ch)) {
      index += 1;
      continue;
    }
    let end = index + 1;
    while (end < text.length && !/\s/.test(text[end]) && text[end] !== "`") {
      end += 1;
    }
    tokens.push(text.slice(index, end));
    index = end;
  }
  return tokens;
}

function arraysEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  for (let i = 0; i < left.length; i += 1) {
    if (left[i] !== right[i]) {
      return false;
    }
  }
  return true;
}

function isNumericToken(value) {
  return /^[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?$/i.test(value);
}

function approxNum(a, b) {
  if (!isNumericToken(a) || !isNumericToken(b)) {
    return false;
  }
  const left = Number(a);
  const right = Number(b);
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return false;
  }
  return Math.abs(left - right) <= 1e-6 || Math.abs(left - right) <= Math.max(Math.abs(left), Math.abs(right), 1) * 1e-6;
}

function normalizeVariantText(value) {
  return String(value || "")
    .replace(/\u8457/g, "\u7740")
    .replace(/\u88CF/g, "\u91CC")
    .replace(/\u65BC/g, "\u4E8E");
}

function countBy(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const key = selector(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function sample(items, limit) {
  return items.slice(0, limit);
}

function policyForCategory(side, category) {
  const sideRules = POLICY_RULES[side] || {};
  return sideRules[category] || {
    action: "manual_review",
    label: "Review",
    rationale: "Not covered by a stable rule yet; needs manual review.",
  };
}

function classifyLeftOnly(relPath, context) {
  const key = normalizeKey(relPath);
  const base = path.basename(key);
  const root = firstSegment(key);
  if (METADATA_NAMES.has(base)) {
    return "metadata_artifacts";
  }
  if (context.leftNeedsList.keys.has(key)) {
    return "core_registered_members";
  }
  if (context.leftExternalRefs.sourceKeys.has(key)) {
    return "core_ref_source_members";
  }
  if (root === "common" || root === "dungeon" || root === "map" || root === "monster" || root === "passiveobject" || root === "stackable") {
    return "core_support_files";
  }
  return "uncategorized";
}

function isVariantBranchMap(relPath) {
  const normalized = normalizeKey(relPath);
  if (!/^map\/|^ap\//.test(normalized)) {
    return false;
  }
  const base = path.basename(normalized);
  return /^(s\d+|b\d+)\.map$/i.test(base) || /^hell_/i.test(base) || /aganzo/i.test(base);
}

function classifyRightOnly(relPath, context) {
  const key = normalizeKey(relPath);
  const base = path.basename(key);
  const ext = path.extname(key);
  const root = firstSegment(key);
  if (ext === ".npk" || ext === ".hash" || base === "npk_img_save.txt" || base === "asset_manifest.json") {
    return "packaging_artifacts";
  }
  if (context.rightHasPackagingArtifacts && base === "list.txt" && root === "(top)") {
    return "packaging_artifacts";
  }
  if (context.rightNeedsList.keys.has(key) && !context.leftNeedsList.keys.has(key)) {
    if (isVariantBranchMap(key)) {
      return "branch_registered_maps";
    }
    if (SCENARIO_SUPPORT_ROOTS.has(root)) {
      return "scenario_registered_support";
    }
    return "branch_registered_support";
  }
  if (SCENARIO_SUPPORT_ROOTS.has(root)) {
    return "scenario_support_files";
  }
  if (isVariantBranchMap(key)) {
    return "branch_map_files";
  }
  if (root === "passiveobject" || root === "monster" || root === "stackable" || root === "map" || root === "common") {
    return "branch_support_files";
  }
  return "uncategorized";
}

function compareCommon(leftFile, rightFile) {
  const leftBuffer = readBuffer(leftFile.fullPath);
  const rightBuffer = readBuffer(rightFile.fullPath);
  if (leftBuffer.equals(rightBuffer)) {
    return { kind: "identical" };
  }
  if (isTextLike(leftFile.relPath) && isTextLike(rightFile.relPath)) {
    const leftTokens = tokenizeText(leftBuffer.toString("utf8"));
    const rightTokens = tokenizeText(rightBuffer.toString("utf8"));
    if (arraysEqual(leftTokens, rightTokens)) {
      return { kind: "format_only_diff" };
    }
    return { kind: "semantic_diff" };
  }
  return { kind: "binary_diff" };
}

function classifySemanticDiff(relPath, leftText, rightText) {
  if (normalizeKey(relPath) === "list.txt") {
    return {
      category: "derived_regenerate",
      action: "regenerate",
      label: "Regenerate",
      rationale: "This is a derived helper list and should be regenerated from the chosen preset.",
    };
  }
  const leftTokens = tokenizeText(leftText);
  const rightTokens = tokenizeText(rightText);
  if (leftTokens.length === rightTokens.length) {
    let onlyNumericPrecision = true;
    let onlyTextVariant = true;
    let numericDiffCount = 0;
    let textVariantCount = 0;
    for (let i = 0; i < leftTokens.length; i += 1) {
      if (leftTokens[i] === rightTokens[i]) {
        continue;
      }
      if (approxNum(leftTokens[i], rightTokens[i])) {
        numericDiffCount += 1;
        continue;
      }
      onlyNumericPrecision = false;
      if (normalizeVariantText(leftTokens[i]) === normalizeVariantText(rightTokens[i])) {
        textVariantCount += 1;
        continue;
      }
      onlyTextVariant = false;
    }
    if (onlyNumericPrecision && numericDiffCount > 0) {
      return {
        category: "left_float_precision",
        action: "prefer_left",
        label: "Prefer Left",
        rationale: "Only floating-point textual precision differs; keep the left-side canonical values.",
      };
    }
    if (onlyTextVariant && textVariantCount > 0) {
      return {
        category: "left_text_variant",
        action: "prefer_left",
        label: "Prefer Left",
        rationale: "Only text variant normalization differs; keep the left-side canonical wording.",
      };
    }
  }
  return {
    category: "manual_review",
    action: "manual_review",
    label: "Review",
    rationale: "Semantic token content differs in a way that needs manual review.",
  };
}

function summarizeCategory(items, classify, context, side) {
  const buckets = new Map();
  for (const item of items) {
    const category = classify(item, context);
    if (!buckets.has(category)) {
      buckets.set(category, []);
    }
    buckets.get(category).push(item);
  }
  return Array.from(buckets.entries())
    .map(([category, entries]) => ({
      category,
      policy: policyForCategory(side, category),
      count: entries.length,
      rootCounts: countBy(entries, firstSegment),
      sample: sample(entries, 25),
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function summaryStats(files) {
  return countBy(files.map((file) => file.relPath), firstSegment);
}

function summarizeActionBuckets(categoryBuckets) {
  const buckets = new Map();
  for (const bucket of categoryBuckets) {
    const key = bucket.policy.action;
    if (!buckets.has(key)) {
      buckets.set(key, {
        action: key,
        label: bucket.policy.label,
        count: 0,
        categories: [],
      });
    }
    const target = buckets.get(key);
    target.count += bucket.count;
    target.categories.push({
      category: bucket.category,
      count: bucket.count,
    });
  }
  return Array.from(buckets.values()).sort((a, b) => b.count - a.count || a.action.localeCompare(b.action));
}

function summarizeSemanticBuckets(items) {
  const buckets = new Map();
  for (const item of items) {
    if (!buckets.has(item.category)) {
      buckets.set(item.category, {
        category: item.category,
        action: item.action,
        label: item.label,
        rationale: item.rationale,
        count: 0,
        files: [],
      });
    }
    const bucket = buckets.get(item.category);
    bucket.count += 1;
    bucket.files.push(item.file);
  }
  return Array.from(buckets.values())
    .map((bucket) => ({
      ...bucket,
      sample: sample(bucket.files, 25),
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function imagePolicySummary(report) {
  return {
    leftOnly: {
      action: "backfill_packaging",
      label: "Backfill Packaging",
      rationale: "These IMG references appear in the core closure but are missing from the right-side package list.",
      count: report.imageSummary.leftOnlyImgCount,
      groups: report.imageSummary.leftOnlyImgGroups,
      sample: report.imageSummary.leftOnlyImgSample,
    },
    rightOnly: {
      action: "keep_if_expansion_enabled",
      label: "Keep With Expansion",
      rationale: "These IMG entries appear only in the right-side expansion pack and usually belong to branch gameplay, APC, or equipment layers.",
      count: report.imageSummary.rightOnlyImgCount,
      groups: report.imageSummary.rightOnlyImgGroups,
      sample: report.imageSummary.rightOnlyImgSample,
    },
  };
}

function buildPresets(report) {
  return [
    {
      name: "minimal_closure",
      label: "Minimal Core Closure",
      includeActions: ["keep_required"],
      excludeActions: ["ignore_tooling", "ignore_packaging"],
      notes: [
        "Keep only the main dungeon closure, without story branches, APC expansion, or commercial packaging output.",
        "Use this for precise migration, dependency auditing, and minimal patches.",
      ],
    },
    {
      name: "feature_complete_dungeon",
      label: "Feature-Complete Dungeon",
      includeActions: ["keep_required", "keep_gameplay_expansion", "keep_if_expansion_enabled"],
      excludeActions: ["ignore_tooling", "ignore_packaging"],
      notes: [
        "Keep the main closure plus gameplay expansion layers, including branch maps, story or APC support, and registered expansion members.",
        "Use this when branch content is treated as part of the dungeon experience.",
      ],
    },
    {
      name: "repack_output",
      label: "Repack Output",
      includeActions: ["keep_required", "keep_gameplay_expansion", "keep_if_expansion_enabled", "backfill_packaging"],
      excludeActions: ["ignore_tooling", "ignore_packaging"],
      notes: [
        "Organize content using the feature-complete preset, then rebuild NPK and hash files from that cleaned set.",
        "Do not treat old commercial packaging output as the source of truth.",
      ],
    },
  ];
}

function buildDecisionManifest(report) {
  return {
    comparedAt: new Date().toISOString(),
    leftDir: report.leftDir,
    rightDir: report.rightDir,
    leftOnlyCategories: report.leftOnlyCategories.map((bucket) => ({
      category: bucket.category,
      policy: bucket.policy,
      count: bucket.count,
      entries: bucket.entries,
    })),
    rightOnlyCategories: report.rightOnlyCategories.map((bucket) => ({
      category: bucket.category,
      policy: bucket.policy,
      count: bucket.count,
      entries: bucket.entries,
    })),
    commonSummary: report.commonSummary,
    semanticReview: report.semanticReview.map((bucket) => ({
      category: bucket.category,
      action: bucket.action,
      label: bucket.label,
      rationale: bucket.rationale,
      count: bucket.count,
      files: bucket.files,
    })),
    imagePolicy: report.imagePolicy,
    presets: report.presets,
  };
}

function compareDirectories(leftDir, rightDir, options = {}) {
  const leftFiles = walkFiles(leftDir);
  const rightFiles = walkFiles(rightDir);
  const leftMap = fileMap(leftFiles);
  const rightMap = fileMap(rightFiles);

  const leftNeedsList = parseNeedsList(path.join(leftDir, "list.txt"));
  const rightNeedsList = parseNeedsList(path.join(rightDir, "list.txt"));
  const leftExternalRefs = parseExternalRefs(path.join(leftDir, "external_refs.txt"));
  const rightNpkImgs = parseNpkImgList(path.join(rightDir, "NPK_IMG_save.txt"));
  const rightHasPackagingArtifacts = directoryHasPackagingArtifacts(rightFiles);

  const leftOnly = [];
  const rightOnly = [];
  const common = [];

  for (const file of leftFiles) {
    if (!rightMap.has(file.key)) {
      leftOnly.push(file.relPath);
      continue;
    }
    common.push({
      left: file,
      right: rightMap.get(file.key),
    });
  }
  for (const file of rightFiles) {
    if (!leftMap.has(file.key)) {
      rightOnly.push(file.relPath);
    }
  }

  const commonSummary = {
    identical: 0,
    formatOnlyDiff: 0,
    semanticDiff: 0,
    binaryDiff: 0,
    semanticDiffSample: [],
    binaryDiffSample: [],
  };
  const semanticReviewEntries = [];

  for (const pair of common) {
    const result = compareCommon(pair.left, pair.right);
    if (result.kind === "identical") {
      commonSummary.identical += 1;
      continue;
    }
    if (result.kind === "format_only_diff") {
      commonSummary.formatOnlyDiff += 1;
      continue;
    }
    if (result.kind === "semantic_diff") {
      commonSummary.semanticDiff += 1;
      const semanticDecision = classifySemanticDiff(
        pair.left.relPath,
        readBuffer(pair.left.fullPath).toString("utf8"),
        readBuffer(pair.right.fullPath).toString("utf8")
      );
      semanticReviewEntries.push({
        file: pair.left.relPath,
        ...semanticDecision,
      });
      if (commonSummary.semanticDiffSample.length < 30) {
        commonSummary.semanticDiffSample.push(pair.left.relPath);
      }
      continue;
    }
    commonSummary.binaryDiff += 1;
    if (commonSummary.binaryDiffSample.length < 30) {
      commonSummary.binaryDiffSample.push(pair.left.relPath);
    }
  }

  const context = {
    leftNeedsList,
    rightNeedsList,
    leftExternalRefs,
    rightHasPackagingArtifacts,
  };

  const includeEntries = !!options.includeEntries;
  const leftOnlyCategories = summarizeCategory(leftOnly, classifyLeftOnly, context, "left");
  const rightOnlyCategories = summarizeCategory(rightOnly, classifyRightOnly, context, "right");

  if (includeEntries) {
    const leftEntriesByCategory = new Map();
    for (const item of leftOnly) {
      const category = classifyLeftOnly(item, context);
      if (!leftEntriesByCategory.has(category)) {
        leftEntriesByCategory.set(category, []);
      }
      leftEntriesByCategory.get(category).push(item);
    }
    const rightEntriesByCategory = new Map();
    for (const item of rightOnly) {
      const category = classifyRightOnly(item, context);
      if (!rightEntriesByCategory.has(category)) {
        rightEntriesByCategory.set(category, []);
      }
      rightEntriesByCategory.get(category).push(item);
    }
    for (const bucket of leftOnlyCategories) {
      bucket.entries = leftEntriesByCategory.get(bucket.category) || [];
    }
    for (const bucket of rightOnlyCategories) {
      bucket.entries = rightEntriesByCategory.get(bucket.category) || [];
    }
  }

  const leftImgOnly = [];
  const rightImgOnly = [];
  const sharedImgs = [];
  for (const img of leftExternalRefs.imgKeys) {
    if (rightNpkImgs.has(img)) {
      sharedImgs.push(img);
    } else {
      leftImgOnly.push(img);
    }
  }
  for (const img of rightNpkImgs) {
    if (!leftExternalRefs.imgKeys.has(img)) {
      rightImgOnly.push(img);
    }
  }

  const report = {
    leftDir,
    rightDir,
    fileSummary: {
      leftFileCount: leftFiles.length,
      rightFileCount: rightFiles.length,
      commonFileCount: common.length,
      leftOnlyCount: leftOnly.length,
      rightOnlyCount: rightOnly.length,
      leftRootCounts: summaryStats(leftFiles),
      rightRootCounts: summaryStats(rightFiles),
    },
    commonSummary,
    semanticReview: summarizeSemanticBuckets(semanticReviewEntries),
    leftOnlyCategories,
    rightOnlyCategories,
    leftActionSummary: summarizeActionBuckets(leftOnlyCategories),
    rightActionSummary: summarizeActionBuckets(rightOnlyCategories),
    imageSummary: {
      leftExternalImgCount: leftExternalRefs.imgKeys.size,
      rightPackagedImgCount: rightNpkImgs.size,
      sharedImgCount: sharedImgs.length,
      leftOnlyImgCount: leftImgOnly.length,
      rightOnlyImgCount: rightImgOnly.length,
      leftOnlyImgGroups: countBy(leftImgOnly, firstTwoSegments),
      rightOnlyImgGroups: countBy(rightImgOnly, firstTwoSegments),
      leftOnlyImgSample: sample(leftImgOnly, 25),
      rightOnlyImgSample: sample(rightImgOnly, 25),
    },
    referenceSignals: {
      leftNeedsListSections: Object.keys(leftNeedsList.sections).sort(),
      rightNeedsListSections: Object.keys(rightNeedsList.sections).sort(),
      rightHasPackagingArtifacts,
    },
  };
  report.imagePolicy = imagePolicySummary(report);
  report.presets = buildPresets(report);
  return report;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Dungeon Extract Comparison");
  lines.push("");
  lines.push(`- Left: \`${report.leftDir}\``);
  lines.push(`- Right: \`${report.rightDir}\``);
  lines.push("");
  lines.push("## File Summary");
  lines.push("");
  lines.push(`- Left files: ${report.fileSummary.leftFileCount}`);
  lines.push(`- Right files: ${report.fileSummary.rightFileCount}`);
  lines.push(`- Common files: ${report.fileSummary.commonFileCount}`);
  lines.push(`- Left-only files: ${report.fileSummary.leftOnlyCount}`);
  lines.push(`- Right-only files: ${report.fileSummary.rightOnlyCount}`);
  lines.push("");
  lines.push("## Decision Tiers");
  lines.push("");
  lines.push("Left-only action summary:");
  for (const bucket of report.leftActionSummary) {
    lines.push(`- ${bucket.label} (${bucket.action}): ${bucket.count}`);
  }
  lines.push("");
  lines.push("Right-only action summary:");
  for (const bucket of report.rightActionSummary) {
    lines.push(`- ${bucket.label} (${bucket.action}): ${bucket.count}`);
  }
  lines.push("");
  lines.push("## Common Files");
  lines.push("");
  lines.push(`- Identical bytes: ${report.commonSummary.identical}`);
  lines.push(`- Format-only diffs: ${report.commonSummary.formatOnlyDiff}`);
  lines.push(`- Semantic text diffs: ${report.commonSummary.semanticDiff}`);
  lines.push(`- Binary diffs: ${report.commonSummary.binaryDiff}`);
  if (report.commonSummary.semanticDiffSample.length) {
    lines.push("");
    lines.push("Semantic diff sample:");
    for (const item of report.commonSummary.semanticDiffSample) {
      lines.push(`- \`${item}\``);
    }
  }
  lines.push("");
  lines.push("## Semantic Diff Decisions");
  lines.push("");
  for (const bucket of report.semanticReview) {
    lines.push(`### ${bucket.category} (${bucket.count})`);
    lines.push("");
    lines.push(`- Action: ${bucket.label} (${bucket.action})`);
    lines.push(`- Reason: ${bucket.rationale}`);
    for (const item of bucket.sample) {
      lines.push(`- \`${item}\``);
    }
    lines.push("");
  }
  lines.push("## Left-only Categories");
  lines.push("");
  for (const bucket of report.leftOnlyCategories) {
    lines.push(`### ${bucket.category} (${bucket.count})`);
    lines.push("");
    lines.push(`- Action: ${bucket.policy.label} (${bucket.policy.action})`);
    lines.push(`- Reason: ${bucket.policy.rationale}`);
    for (const root of bucket.rootCounts.slice(0, 10)) {
      lines.push(`- ${root.name}: ${root.count}`);
    }
    lines.push("");
    for (const item of bucket.sample) {
      lines.push(`- \`${item}\``);
    }
    lines.push("");
  }
  lines.push("## Right-only Categories");
  lines.push("");
  for (const bucket of report.rightOnlyCategories) {
    lines.push(`### ${bucket.category} (${bucket.count})`);
    lines.push("");
    lines.push(`- Action: ${bucket.policy.label} (${bucket.policy.action})`);
    lines.push(`- Reason: ${bucket.policy.rationale}`);
    for (const root of bucket.rootCounts.slice(0, 10)) {
      lines.push(`- ${root.name}: ${root.count}`);
    }
    lines.push("");
    for (const item of bucket.sample) {
      lines.push(`- \`${item}\``);
    }
    lines.push("");
  }
  lines.push("## External IMG Comparison");
  lines.push("");
  lines.push(`- Left external IMG count: ${report.imageSummary.leftExternalImgCount}`);
  lines.push(`- Right packaged IMG count: ${report.imageSummary.rightPackagedImgCount}`);
  lines.push(`- Shared IMG count: ${report.imageSummary.sharedImgCount}`);
  lines.push(`- Left-only IMG count: ${report.imageSummary.leftOnlyImgCount}`);
  lines.push(`- Right-only IMG count: ${report.imageSummary.rightOnlyImgCount}`);
  lines.push("");
  lines.push(`- Left-only IMG action: ${report.imagePolicy.leftOnly.label} (${report.imagePolicy.leftOnly.action})`);
  lines.push(`- Left-only IMG reason: ${report.imagePolicy.leftOnly.rationale}`);
  lines.push(`- Right-only IMG action: ${report.imagePolicy.rightOnly.label} (${report.imagePolicy.rightOnly.action})`);
  lines.push(`- Right-only IMG reason: ${report.imagePolicy.rightOnly.rationale}`);
  lines.push("");
  lines.push("Left-only IMG groups:");
  for (const group of report.imageSummary.leftOnlyImgGroups.slice(0, 10)) {
    lines.push(`- ${group.name}: ${group.count}`);
  }
  lines.push("");
  lines.push("Right-only IMG groups:");
  for (const group of report.imageSummary.rightOnlyImgGroups.slice(0, 10)) {
    lines.push(`- ${group.name}: ${group.count}`);
  }
  lines.push("");
  lines.push("## Recommended Presets");
  lines.push("");
  for (const preset of report.presets) {
    lines.push(`### ${preset.label}`);
    lines.push("");
    lines.push(`- Name: \`${preset.name}\``);
    lines.push(`- Include actions: ${preset.includeActions.join(", ")}`);
    lines.push(`- Exclude actions: ${preset.excludeActions.join(", ")}`);
    for (const note of preset.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }
  lines.push("## Suggested Workflow Rules");
  lines.push("");
  lines.push("- Treat `manifest.json`, `external_refs.txt`, `missing_refs.txt`, `read_errors.json`, and `extracted-files.txt` as extractor metadata, not gameplay content.");
  lines.push("- Treat `.NPK`, `.hash`, and `NPK_IMG_save.txt` as packaging output, not PVF closure evidence.");
  lines.push("- Use the left `list.txt` plus `external_refs.txt` as the baseline for core dungeon closure.");
  lines.push("- Treat right-only variant maps and their registered support as gameplay expansion, not as disposable noise.");
  lines.push("- Treat right-only `aicharacter`, `equipment`, `n_quest`, and `npc` as expansion support layers that follow those gameplay branches.");
  lines.push("- Audit left-only core support files before pruning them from a commercial pack; they are likely secondary closure members or packaging omissions.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function stripEntries(report) {
  return {
    ...report,
    leftOnlyCategories: report.leftOnlyCategories.map(({ entries, ...rest }) => rest),
    rightOnlyCategories: report.rightOnlyCategories.map(({ entries, ...rest }) => rest),
    semanticReview: report.semanticReview.map(({ files, ...rest }) => rest),
  };
}

function main() {
  if (hasFlag("help") || hasFlag("?")) {
    printUsage();
    return;
  }
  const leftArg = argValue("left", "");
  const rightArg = argValue("right", "");
  const reportPathRaw = argValue("report", "");
  const manifestPathRaw = argValue("manifest", "");
  if (!leftArg || !rightArg) {
    throw new Error("Provide --left=DIR and --right=DIR.");
  }
  const leftDir = path.resolve(leftArg);
  const rightDir = path.resolve(rightArg);
  if (!fs.existsSync(leftDir) || !fs.statSync(leftDir).isDirectory()) {
    throw new Error(`Left directory does not exist: ${leftDir}`);
  }
  if (!fs.existsSync(rightDir) || !fs.statSync(rightDir).isDirectory()) {
    throw new Error(`Right directory does not exist: ${rightDir}`);
  }

  const report = compareDirectories(leftDir, rightDir, { includeEntries: !!manifestPathRaw });
  if (reportPathRaw) {
    const reportPath = path.resolve(reportPathRaw);
    ensureParent(reportPath);
    fs.writeFileSync(reportPath, renderMarkdown(report), "utf8");
  }
  if (manifestPathRaw) {
    const manifestPath = path.resolve(manifestPathRaw);
    ensureParent(manifestPath);
    fs.writeFileSync(manifestPath, JSON.stringify(buildDecisionManifest(report), null, 2), "utf8");
  }
  const outputReport = manifestPathRaw ? stripEntries(report) : report;
  process.stdout.write(`${JSON.stringify(outputReport, null, 2)}\n`);
}

main();
