"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const NPK_HEADER = "NeoplePack_Bill";
const NAME_KEY_PHRASE = "puchikon@neople dungeon and fighter ";
const DEFAULT_NPK_NAME = "\u6574\u5408\u7684NPK.NPK";
const COMPAT_SECTION_SUFFIX = "\u9700\u8981\u6dfb\u52a0\u7684list";

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
  node tools/pvf-bridge/package-dungeon-assets.js --extract-dir=extract-dir --imagepacks=ImagePacks2 [--npk-name=Integrated.NPK]

Rules:
  --extract-dir and --imagepacks are required. The script writes only inside the extract directory.
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

function makeNameKey() {
  const key = Buffer.alloc(256);
  const phrase = Buffer.from(NAME_KEY_PHRASE, "utf8");
  const dnf = Buffer.from("DNF", "utf8");
  phrase.copy(key);
  for (let i = phrase.length; i < 255; i += 1) {
    key[i] = dnf[i % 3];
  }
  key[255] = 0;
  return key;
}

const NAME_KEY = makeNameKey();

function decodeNpkName(buffer) {
  const plain = Buffer.alloc(256);
  let end = 0;
  for (let i = 0; i < 256; i += 1) {
    plain[i] = buffer[i] ^ NAME_KEY[i];
    if (plain[i] === 0 && end === 0) {
      end = i;
    }
  }
  return normalizePvfPath(plain.subarray(0, end || 256).toString("utf8"));
}

function encodeNpkName(name) {
  const plain = Buffer.alloc(256);
  Buffer.from(normalizePvfPath(name), "utf8").copy(plain, 0, 0, 255);
  const encoded = Buffer.alloc(256);
  for (let i = 0; i < 256; i += 1) {
    encoded[i] = plain[i] ^ NAME_KEY[i];
  }
  return encoded;
}

function readExact(fd, offset, length) {
  const buffer = Buffer.alloc(length);
  let read = 0;
  while (read < length) {
    const bytesRead = fs.readSync(fd, buffer, read, length - read, offset + read);
    if (!bytesRead) {
      throw new Error(`Unexpected EOF at offset ${offset + read}`);
    }
    read += bytesRead;
  }
  return buffer;
}

function readCStringHeader(fd, filePath) {
  const header = readExact(fd, 0, 48);
  const zero = header.indexOf(0);
  const end = zero >= 0 ? zero : header.length;
  return {
    value: header.subarray(0, end).toString("utf8"),
    nextOffset: zero >= 0 ? zero + 1 : header.length,
    filePath,
  };
}

function readNpkIndex(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const header = readCStringHeader(fd, filePath);
    if (header.value !== NPK_HEADER) {
      return [];
    }
    const count = readExact(fd, header.nextOffset, 4).readInt32LE(0);
    if (count < 0 || count > 500000) {
      throw new Error(`Suspicious NPK entry count ${count}: ${filePath}`);
    }
    const table = readExact(fd, header.nextOffset + 4, count * 264);
    const entries = [];
    for (let i = 0; i < count; i += 1) {
      const base = i * 264;
      const offset = table.readInt32LE(base);
      const length = table.readInt32LE(base + 4);
      const imgPath = decodeNpkName(table.subarray(base + 8, base + 264));
      entries.push({
        imgPath,
        key: normalizeKey(imgPath),
        containerPath: filePath,
        containerName: path.basename(filePath),
        offset,
        length,
      });
    }
    return entries;
  } finally {
    fs.closeSync(fd);
  }
}

function readDirectImgIndex(filePath, imagePacksPath) {
  const relative = normalizePvfPath(path.relative(imagePacksPath, filePath));
  const stats = fs.statSync(filePath);
  return [
    {
      imgPath: relative,
      key: normalizeKey(relative),
      containerPath: filePath,
      containerName: path.basename(filePath),
      offset: 0,
      length: stats.size,
    },
  ];
}

function walkImagePackFiles(root) {
  const pending = [root];
  const files = [];
  while (pending.length) {
    const dir = pending.shift();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (/\.(npk|img)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function pathVariants(value) {
  const normalized = normalizeKey(value);
  if (!normalized) {
    return [];
  }
  return normalized.startsWith("sprite/") ? [normalized, normalized.slice(7)] : [normalized, `sprite/${normalized}`];
}

function expectedContainerNames(value) {
  const names = new Set();
  for (const variant of pathVariants(value)) {
    const slash = variant.lastIndexOf("/");
    if (slash < 0) {
      continue;
    }
    const dir = variant.slice(0, slash);
    if (dir) {
      names.add(`${dir.replace(/\//g, "_")}.npk`);
    }
  }
  return names;
}

function buildImageIndex(imagePacksPath) {
  const byKey = new Map();
  const allEntries = [];
  let badContainers = 0;
  for (const filePath of walkImagePackFiles(imagePacksPath)) {
    let entries = [];
    try {
      entries = /\.npk$/i.test(filePath) ? readNpkIndex(filePath) : readDirectImgIndex(filePath, imagePacksPath);
    } catch {
      badContainers += 1;
      continue;
    }
    for (const entry of entries) {
      allEntries.push(entry);
      for (const key of pathVariants(entry.imgPath)) {
        if (!byKey.has(key)) {
          byKey.set(key, []);
        }
        byKey.get(key).push(entry);
      }
    }
  }
  return { allEntries, byKey, badContainers };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function templateRegex(value) {
  const normalized = normalizeKey(value);
  const pattern = /%0?(\d*)d/gi;
  let output = "";
  let cursor = 0;
  let match;
  for (;;) {
    match = pattern.exec(normalized);
    if (!match) {
      break;
    }
    output += escapeRegex(normalized.slice(cursor, match.index));
    const width = Number.parseInt(match[1] || "", 10) || 0;
    output += width > 0 ? `(\\d{${width}})` : "(\\d+)";
    cursor = pattern.lastIndex;
  }
  if (cursor === 0) {
    return undefined;
  }
  output += escapeRegex(normalized.slice(cursor));
  return new RegExp(`^${output}$`, "i");
}

function isTemplateRef(value) {
  return /%0?\d*d/i.test(value);
}

function chooseBestSource(candidates, imagePath) {
  const expected = expectedContainerNames(imagePath);
  return (
    candidates.find((candidate) => expected.has(candidate.containerName.toLowerCase())) ||
    candidates.slice().sort((a, b) => a.containerName.localeCompare(b.containerName))[0]
  );
}

function parseExternalRefs(filePath) {
  const refs = new Map();
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const arrow = trimmed.lastIndexOf(" -> ");
    const sourceRaw = arrow >= 0 ? trimmed.slice(0, arrow).trim() : "";
    const imgPath = normalizePvfPath(arrow >= 0 ? trimmed.slice(arrow + 4) : trimmed);
    if (!/\.img$/i.test(imgPath)) {
      continue;
    }
    const key = normalizeKey(imgPath);
    const optional = normalizeKey(sourceRaw).startsWith("__seed__/right/");
    if (!refs.has(key)) {
      refs.set(key, {
        sourceRaw,
        imgPath,
        imgKey: key,
        optional,
      });
      continue;
    }
    const existing = refs.get(key);
    if (!optional) {
      existing.optional = false;
      if (!existing.sourceRaw || normalizeKey(existing.sourceRaw).startsWith("__seed__/right/")) {
        existing.sourceRaw = sourceRaw;
      }
    }
  }
  return Array.from(refs.values()).sort((a, b) => a.imgPath.localeCompare(b.imgPath));
}

function resolveImageRefs(refs, imageIndex) {
  const selected = new Map();
  const missingRequired = [];
  const missingOptional = [];
  const templateExpansions = [];

  for (const ref of refs) {
    if (isTemplateRef(ref.imgPath)) {
      const regexes = pathVariants(ref.imgPath).map(templateRegex).filter(Boolean);
      const hitsByPath = new Map();
      for (const entry of imageIndex.allEntries) {
        if (!pathVariants(entry.imgPath).some((key) => regexes.some((regex) => regex.test(key)))) {
          continue;
        }
        if (!hitsByPath.has(entry.key)) {
          hitsByPath.set(entry.key, []);
        }
        hitsByPath.get(entry.key).push(entry);
      }
      if (!hitsByPath.size) {
        (ref.optional ? missingOptional : missingRequired).push(ref.imgPath);
        continue;
      }
      const expanded = [];
      for (const [imgKey, candidates] of Array.from(hitsByPath.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
        const chosen = chooseBestSource(candidates, candidates[0].imgPath);
        selected.set(chosen.key, chosen);
        expanded.push(chosen.imgPath);
      }
      templateExpansions.push({ ref: ref.imgPath, count: expanded.length, images: expanded, optional: ref.optional });
      continue;
    }

    const candidates = pathVariants(ref.imgPath).flatMap((key) => imageIndex.byKey.get(key) || []);
    if (!candidates.length) {
      (ref.optional ? missingOptional : missingRequired).push(ref.imgPath);
      continue;
    }
    const chosen = chooseBestSource(candidates, ref.imgPath);
    selected.set(chosen.key, chosen);
  }

  return {
    selected: Array.from(selected.values()).sort((a, b) => a.imgPath.localeCompare(b.imgPath)),
    missingRequired,
    missingOptional,
    templateExpansions,
  };
}

function walkFiles(root, predicate) {
  if (!fs.existsSync(root)) {
    return [];
  }
  const pending = [root];
  const files = [];
  while (pending.length) {
    const dir = pending.shift();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (!predicate || predicate(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function avatarLayerRuleFromPath(filePath) {
  const normalized = normalizePvfPath(filePath);
  const match = normalized.match(/equipment\/character\/([^/]+)\/(at_avatar|avatar)\/([^/]+)\//i);
  if (!match) {
    return undefined;
  }
  const [, character, avatarKind, slot] = match;
  if (character.toLowerCase() === "mage" && avatarKind.toLowerCase() === "avatar") {
    return { character: "mage", equipmentDir: "equipment", prefix: "mg", slot };
  }
  if (character.toLowerCase() === "mage" && avatarKind.toLowerCase() === "at_avatar") {
    return { character: "mage", equipmentDir: "atequipment", prefix: "mm", slot };
  }
  return undefined;
}

function collectAvatarLayerRefs(extractDir) {
  const equipmentRoot = path.join(extractDir, "equipment", "character");
  const refs = new Map();
  const unsupportedFiles = [];
  const files = walkFiles(equipmentRoot, (filePath) => /\.equ$/i.test(filePath));
  for (const filePath of files) {
    const relative = normalizePvfPath(path.relative(extractDir, filePath));
    const rule = avatarLayerRuleFromPath(relative);
    const text = fs.readFileSync(filePath, "utf8");
    const layerMatches = Array.from(text.matchAll(/\[layer variation\]\s*\r?\n\s*(\d+)\s+`([^`]+)`/g));
    if (!layerMatches.length) {
      continue;
    }
    if (!rule) {
      if (/equipment\/character\/[^/]+\/(at_avatar|avatar)\//i.test(relative)) {
        unsupportedFiles.push(relative);
      }
      continue;
    }
    for (const match of layerMatches) {
      const layerNumber = match[1];
      const layerName = match[2];
      const suffix = (layerName.match(/_([a-z])$/i) || [])[1] || "";
      const imgSlot = rule.slot === "skin" ? "body" : rule.slot;
      const imgPath = `sprite/character/${rule.character}/${rule.equipmentDir}/avatar/${rule.slot}/${rule.prefix}_${imgSlot}${layerNumber}${suffix}.img`;
      const key = normalizeKey(imgPath);
      if (!refs.has(key)) {
        refs.set(key, { sourceRaw: relative, sources: [relative], imgPath, imgKey: key, optional: true });
      } else {
        const existing = refs.get(key);
        if (!existing.sources.includes(relative)) {
          existing.sources.push(relative);
          existing.sourceRaw = existing.sources.join(", ");
        }
      }
    }
  }
  return {
    refs: Array.from(refs.values()).sort((a, b) => a.imgPath.localeCompare(b.imgPath)),
    unsupportedFiles: Array.from(new Set(unsupportedFiles)).sort((a, b) => a.localeCompare(b)),
  };
}

function resolveDirectImageRefs(refs, imageIndex) {
  const selected = new Map();
  const missing = [];
  for (const ref of refs) {
    const candidates = pathVariants(ref.imgPath).flatMap((key) => imageIndex.byKey.get(key) || []);
    if (!candidates.length) {
      missing.push(ref);
      continue;
    }
    const chosen = chooseBestSource(candidates, ref.imgPath);
    selected.set(chosen.key, chosen);
  }
  return {
    selected: Array.from(selected.values()).sort((a, b) => a.imgPath.localeCompare(b.imgPath)),
    missing,
  };
}

function mergeSelectedImages(groups) {
  const selected = new Map();
  for (const group of groups) {
    for (const entry of group) {
      selected.set(entry.key, entry);
    }
  }
  return Array.from(selected.values()).sort((a, b) => a.imgPath.localeCompare(b.imgPath));
}

function writeNpk(records, targetPath) {
  const header = Buffer.from(`${NPK_HEADER}\0`, "utf8");
  const count = Buffer.alloc(4);
  count.writeInt32LE(records.length, 0);

  const table = Buffer.alloc(records.length * 264);
  let nextOffset = header.length + count.length + table.length + 32;
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const base = i * 264;
    table.writeInt32LE(nextOffset, base);
    table.writeInt32LE(record.length, base + 4);
    encodeNpkName(record.imgPath).copy(table, base + 8);
    nextOffset += record.length;
  }

  const gap = crypto.createHash("sha256").update(Buffer.concat([header, count, table])).digest();
  const tmpPath = `${targetPath}.tmp`;
  const out = fs.openSync(tmpPath, "w");
  try {
    fs.writeSync(out, header);
    fs.writeSync(out, count);
    fs.writeSync(out, table);
    fs.writeSync(out, gap);
    for (const record of records) {
      const input = fs.openSync(record.containerPath, "r");
      try {
        fs.writeSync(out, readExact(input, record.offset, record.length));
      } finally {
        fs.closeSync(input);
      }
    }
  } finally {
    fs.closeSync(out);
  }
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
  fs.renameSync(tmpPath, targetPath);
}

function parseRegistryList(listPath) {
  const sections = new Map();
  let current;
  for (const line of fs.readFileSync(listPath, "utf8").split(/\r?\n/)) {
    const header = line.match(/^\s*(.+?)\s+(?:needs list|\u9700\u8981\u6dfb\u52a0\u7684list)\s*$/i);
    if (header) {
      current = header[1].trim();
      if (!sections.has(current)) {
        sections.set(current, []);
      }
      continue;
    }
    const entry = line.match(/^\s*(\d+)\s+`([^`]+)`/);
    if (entry && current) {
      sections.get(current).push({ id: entry[1], rawPath: normalizePvfPath(entry[2]) });
    }
  }
  return sections;
}

function writeCompatibleList(sections, listPath) {
  const parts = [];
  const suffix = Buffer.from("d0e8d2aaccedbcd3b5c46c697374", "hex");
  for (const [section, entries] of sections.entries()) {
    parts.push(Buffer.concat([Buffer.from(section, "ascii"), suffix, Buffer.from("\r\n", "ascii")]));
    for (const entry of entries) {
      parts.push(Buffer.from(`${entry.id}\t\`${entry.rawPath}\`\r\n`, "ascii"));
    }
    parts.push(Buffer.from("\r\n\r\n", "ascii"));
  }
  fs.writeFileSync(listPath, Buffer.concat(parts));
}

function nextPowerOfTwo(value) {
  let out = 1;
  while (out < value) {
    out *= 2;
  }
  return out;
}

function hashFileName(section) {
  const normalized = normalizePvfPath(section);
  const base = path.posix.basename(normalized).replace(/\.lst$/i, "") || normalized;
  return `${base.replace(/[<>:"/\\|?*]/g, "_")}.hash`;
}

function writeHash(section, entries, targetPath) {
  const payloads = [];
  for (const entry of entries) {
    const key = Buffer.from(`${entry.id}\0`, "utf8");
    const value = Buffer.from(`${entry.id}\t\`${entry.rawPath}\`\0`, "utf8");
    const record = Buffer.alloc(8 + key.length + value.length);
    record.writeInt32LE(key.length, 0);
    key.copy(record, 4);
    record.writeInt32LE(value.length, 4 + key.length);
    value.copy(record, 8 + key.length);
    payloads.push(record);
  }

  const payload = Buffer.concat(payloads);
  const header = Buffer.alloc(44);
  const capacity = Math.max(16, nextPowerOfTwo(Math.ceil(entries.length / 0.75)));
  header.writeInt32LE(header.length + payload.length, 0);
  header.writeInt32LE(10, 4);
  header.writeInt32LE(10, 8);
  header.writeInt32LE(capacity, 12);
  header.writeFloatLE(0.75, 16);
  header.writeInt32LE(1, 20);
  header.writeInt32LE(entries.length, 40);
  fs.writeFileSync(targetPath, Buffer.concat([header, payload]));
  return { section, fileName: path.basename(targetPath), count: entries.length, capacity };
}

function findDefaultImagePacksPath() {
  for (const entry of fs.readdirSync(process.cwd(), { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const candidate = path.join(process.cwd(), entry.name, "ImagePacks2");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return "";
}

function findDefaultExtractDir() {
  const candidates = [];
  for (const entry of fs.readdirSync(process.cwd(), { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const candidate = path.join(process.cwd(), entry.name);
    const manifestPath = path.join(candidate, "manifest.json");
    if (fs.existsSync(manifestPath) && fs.existsSync(path.join(candidate, "external_refs.txt"))) {
      candidates.push({ path: candidate, mtime: fs.statSync(manifestPath).mtimeMs });
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0]?.path || "";
}

function verifyNpk(filePath) {
  const entries = readNpkIndex(filePath);
  const errors = [];
  const stats = fs.statSync(filePath);
  for (const entry of entries) {
    if (entry.offset < 0 || entry.length < 0 || entry.offset + entry.length > stats.size) {
      errors.push(entry.imgPath);
    }
  }
  return { count: entries.length, errors };
}

function main() {
  if (hasFlag("help") || hasFlag("?")) {
    printUsage();
    return;
  }
  const rawImagePacks = argValue("imagepacks", "");
  const rawExtractDir = argValue("extract-dir", "");
  if (!rawExtractDir) {
    throw new Error("Use --extract-dir=DIR. Refusing to infer an extract directory from the current workspace.");
  }
  if (!rawImagePacks) {
    throw new Error("Use --imagepacks=ImagePacks2. Refusing to infer client assets from the current workspace.");
  }
  const imagePacksPath = path.resolve(rawImagePacks);
  const extractDir = resolveInsideWorkspace(rawExtractDir);
  const npkName = argValue("npk-name", DEFAULT_NPK_NAME);
  if (!fs.existsSync(imagePacksPath)) {
    throw new Error(`ImagePacks2 path does not exist: ${imagePacksPath}`);
  }
  if (!fs.existsSync(extractDir)) {
    throw new Error(`Extract directory does not exist: ${extractDir}`);
  }

  const externalRefsPath = path.join(extractDir, "external_refs.txt");
  const listPath = path.join(extractDir, "list.txt");
  if (!fs.existsSync(externalRefsPath)) {
    throw new Error(`external_refs.txt was not found: ${externalRefsPath}`);
  }
  if (!fs.existsSync(listPath)) {
    throw new Error(`list.txt was not found: ${listPath}`);
  }

  const refs = parseExternalRefs(externalRefsPath);
  const imageIndex = buildImageIndex(imagePacksPath);
  const resolved = resolveImageRefs(refs, imageIndex);
  if (resolved.missingRequired.length) {
    throw new Error(`Missing IMG refs: ${resolved.missingRequired.join(", ")}`);
  }

  const avatarLayerRefs = collectAvatarLayerRefs(extractDir);
  const avatarLayerResolved = resolveDirectImageRefs(avatarLayerRefs.refs, imageIndex);
  const selectedImages = mergeSelectedImages([resolved.selected, avatarLayerResolved.selected]);

  const optionalMissingPath = path.join(extractDir, "missing_optional_seed_refs.txt");
  if (resolved.missingOptional.length) {
    fs.writeFileSync(optionalMissingPath, `${resolved.missingOptional.join("\r\n")}\r\n`, "utf8");
  } else if (fs.existsSync(optionalMissingPath)) {
    fs.unlinkSync(optionalMissingPath);
  }

  const avatarLayerMissingPath = path.join(extractDir, "missing_avatar_layer_refs.txt");
  if (avatarLayerResolved.missing.length) {
    fs.writeFileSync(
      avatarLayerMissingPath,
      `${avatarLayerResolved.missing
        .map((entry) => `${(entry.sources || [entry.sourceRaw]).join(", ")} -> ${entry.imgPath}`)
        .join("\r\n")}\r\n`,
      "utf8",
    );
  } else if (fs.existsSync(avatarLayerMissingPath)) {
    fs.unlinkSync(avatarLayerMissingPath);
  }

  const npkPath = path.join(extractDir, npkName);
  writeNpk(selectedImages, npkPath);
  const npkVerification = verifyNpk(npkPath);

  const npkImgSavePath = path.join(extractDir, "NPK_IMG_save.txt");
  fs.writeFileSync(npkImgSavePath, `${selectedImages.map((entry) => entry.imgPath).join("\r\n")}\r\n`, "utf8");

  const originalListBackup = path.join(extractDir, "list.codex.txt");
  if (!fs.existsSync(originalListBackup)) {
    fs.copyFileSync(listPath, originalListBackup);
  }
  const sections = parseRegistryList(originalListBackup);
  writeCompatibleList(sections, listPath);

  const hashFiles = [];
  for (const [section, entries] of sections.entries()) {
    if (!entries.length) {
      continue;
    }
    hashFiles.push(writeHash(section, entries, path.join(extractDir, hashFileName(section))));
  }

  const sourceNpkCounts = new Map();
  let sourceBytes = 0;
  for (const entry of selectedImages) {
    sourceNpkCounts.set(entry.containerName, (sourceNpkCounts.get(entry.containerName) || 0) + 1);
    sourceBytes += entry.length;
  }

  const manifest = {
    ok: true,
    extractDir,
    imagePacksPath,
    uniqueExternalImgRefs: refs.length,
    requiredExternalImgRefs: refs.filter((entry) => !entry.optional).length,
    optionalSeedImgRefs: refs.filter((entry) => entry.optional).length,
    selectedImgCount: selectedImages.length,
    externalSelectedImgCount: resolved.selected.length,
    omittedOptionalSeedImgCount: resolved.missingOptional.length,
    omittedOptionalSeedImgSample: resolved.missingOptional.slice(0, 50),
    avatarLayerImageCheck: {
      scannedRefCount: avatarLayerRefs.refs.length,
      selectedImgCount: avatarLayerResolved.selected.length,
      missingImgCount: avatarLayerResolved.missing.length,
      missingImgSample: avatarLayerResolved.missing.slice(0, 50).map((entry) => ({
        source: entry.sourceRaw,
        sources: entry.sources || [entry.sourceRaw],
        imgPath: entry.imgPath,
      })),
      unsupportedFileCount: avatarLayerRefs.unsupportedFiles.length,
      unsupportedFileSample: avatarLayerRefs.unsupportedFiles.slice(0, 50),
      missingPath: avatarLayerResolved.missing.length ? avatarLayerMissingPath : null,
      note:
        "Avatar equipment can reference runtime character-layer images through .equ layer variations and .lay scripts. Missing entries usually mean the client ImagePacks2 lacks the APC costume art, even when the PVF equipment files were extracted correctly.",
    },
    sourceBytes,
    imagePackIndex: {
      imgEntryCount: imageIndex.allEntries.length,
      badContainerCount: imageIndex.badContainers,
    },
    integratedNpk: {
      path: npkPath,
      bytes: fs.statSync(npkPath).size,
      entryCount: npkVerification.count,
      invalidEntryCount: npkVerification.errors.length,
      checksumNote:
        "32-byte NPK gap is deterministic SHA-256 of the generated header, count, and index table; PVF X-Pilot's reader ignores this field.",
    },
    templateExpansions: resolved.templateExpansions.map((item) => ({
      ref: item.ref,
      count: item.count,
      optional: item.optional,
    })),
    sourceNpkTop: Array.from(sourceNpkCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30),
    hashFiles,
    optionalMissingPath: resolved.missingOptional.length ? optionalMissingPath : null,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(extractDir, "asset_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(JSON.stringify(manifest, null, 2));
}

try {
  main();
} catch (err) {
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
}
