"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { McpStdioClient, parseMcpTextResult } = require("../lib/mcp-stdio-client");
const { resolveSourcePvf } = require("../lib/workspace-profiles");
const {
  assertReadOnlyAdapter,
  loadAdapterConfig,
  resolveWorkbenchRoot,
  upstreamLaunchOptions,
} = require("../lib/adapter-config");
const indexStore = require("../lib/pvf-index-store");
const { runtimePath } = require("../lib/runtime-state");

const rawArgs = process.argv.slice(2);
const workbenchRoot = resolveWorkbenchRoot(rawArgs, path.resolve(__dirname, "../../.."));
const args = rawArgs.filter((item, index) => !(item === "--root" || rawArgs[index - 1] === "--root"));
const command = args[0];

function usage() {
  return `Usage:
  workbench.bat backend-contract show
  workbench.bat backend-contract fixture [--fixture <fixture.json>]
  workbench.bat backend-contract check [--profile <name> | --pvf <Script.pvf>] [--fixture <fixture.json>] [--scope itemshop] [--out <dir>] [--skip-index] [--include-write-smoke]
`;
}

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function flag(name) {
  return args.includes(name);
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizePvfPath(value) {
  return toPosix(value).replace(/^\/+/, "").replace(/\/+/g, "/").toLowerCase();
}

function safeName(value) {
  return String(value || "run")
    .replace(/^[A-Za-z]:[\\/]/, "")
    .replace(/[\\/:\s]+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "run";
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function contractPath() {
  return path.join(workbenchRoot, "core", "pvf-agent-core", "contracts", "pvf-backend-contract.v1.json");
}

function loadContract() {
  const file = contractPath();
  const contract = readJson(file);
  if (contract.schemaVersion !== "1.0") {
    throw new Error("Backend contract schemaVersion must be 1.0.");
  }
  if (!Array.isArray(contract.requiredCapabilities) || contract.requiredCapabilities.length === 0) {
    throw new Error("Backend contract must define requiredCapabilities.");
  }
  return { file, contract };
}

function resolveFixturePath(contract) {
  const requested = option("--fixture");
  if (requested) {
    return path.resolve(requested);
  }
  return path.resolve(path.dirname(contractPath()), contract.defaultFixture);
}

function loadFixture(contract) {
  const file = resolveFixturePath(contract);
  const fixture = readJson(file);
  if (fixture.schemaVersion !== "1.0") {
    throw new Error("Fixture schemaVersion must be 1.0.");
  }
  for (const name of ["registryPath", "registryId", "expectedPvfPath", "readPath", "pathSearchContains"]) {
    if (fixture[name] === undefined || fixture[name] === null || fixture[name] === "") {
      throw new Error(`Fixture requires ${name}.`);
    }
  }
  return { file, fixture };
}

function resolveRunRoot(context = {}) {
  const out = option("--out");
  if (out) {
    return path.resolve(out);
  }
  const profilePart = safeName(context.profileName || context.sourceLabel || "pvf");
  const fixturePart = safeName(context.fixtureId || "fixture");
  return runtimePath(workbenchRoot, "backend-contract-runs", `${timestamp()}-${profilePart}-${fixturePart}`);
}

async function callAndParse(client, name, toolArgs) {
  const result = await client.callTool(name, toolArgs);
  if (result && result.isError) {
    const parsed = parseMcpTextResult(result);
    throw new Error(parsed.error || parsed.text || JSON.stringify(parsed));
  }
  return parseMcpTextResult(result);
}

async function recordTest(tests, id, fn) {
  try {
    const details = await fn();
    tests.push({ id, ok: true, details: details || {} });
  } catch (error) {
    tests.push({ id, ok: false, error: error && error.stack ? error.stack : String(error) });
  }
}

function skipTest(tests, id, reason) {
  tests.push({ id, ok: true, skipped: true, details: { reason } });
}

function collectRegistryPaths(value, out = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectRegistryPaths(item, out);
    }
    return out;
  }
  if (value && typeof value === "object") {
    const candidate = value.path || value.pvfPath || value.registryPath || value.fileName;
    if (typeof candidate === "string" && candidate.toLowerCase().endsWith(".lst")) {
      out.push(toPosix(candidate));
    }
    for (const item of Object.values(value)) {
      collectRegistryPaths(item, out);
    }
  }
  return out;
}

function resolvedPvfPath(result) {
  const candidates = [
    result?.entry?.pvfPath,
    result?.entry?.path,
    result?.entry?.fileName,
    result?.pvfPath,
    result?.path,
    result?.fileSummary?.path,
    result?.fileSummary?.fileName,
  ];
  return candidates.find((item) => typeof item === "string" && item.length > 0) || null;
}

function pathItemsContain(items, expectedPath) {
  const expected = normalizePvfPath(expectedPath);
  return (items || []).some((item) => normalizePvfPath(item.fileName || item.pvfPath || item.path) === expected);
}

function requiredReadTools(contract) {
  const writeSmokeTools = new Set(["pvf_backup", "pvf_replace_text", "pvf_write_file", "pvf_save"]);
  const tools = new Set();
  for (const capability of contract.requiredCapabilities || []) {
    for (const tool of capability.requiredTools || []) {
      if (!writeSmokeTools.has(tool)) {
        tools.add(tool);
      }
    }
  }
  return [...tools].sort();
}

function resolveWriteSmokeChangeSet(fixtureFile, fixture) {
  const configured = fixture.writeSmoke?.changeSetFile;
  if (!configured) {
    throw new Error("Fixture does not define writeSmoke.changeSetFile.");
  }
  const resolved = path.resolve(path.dirname(fixtureFile), configured);
  if (fs.existsSync(resolved)) {
    return resolved;
  }
  const fallback = path.join(workbenchRoot, "workspaces", "examples", path.basename(configured));
  if (fs.existsSync(fallback)) {
    return fallback;
  }
  throw new Error(`Write smoke change-set does not exist: ${resolved}`);
}

function statFingerprint(file) {
  const stat = fs.statSync(file);
  return {
    size: stat.size,
    mtimeMs: stat.mtimeMs,
  };
}

function runWriteSmoke(fixtureFile, fixture, runRoot, resolvedSource) {
  const changeSetFile = resolveWriteSmokeChangeSet(fixtureFile, fixture);
  const smokeRoot = path.join(runRoot, "write-smoke");
  const cli = path.join(workbenchRoot, "core", "pvf-agent-core", "cli", "pvf-change-set.js");
  const childArgs = [cli, "--root", workbenchRoot, "apply", "--file", changeSetFile, "--out", smokeRoot];
  const requestedProfile = option("--profile");
  if (requestedProfile) {
    childArgs.push("--profile", requestedProfile);
  } else if (resolvedSource.profile?.name) {
    childArgs.push("--profile", resolvedSource.profile.name);
  } else {
    childArgs.push("--pvf", resolvedSource.sourcePvf);
  }

  const before = statFingerprint(resolvedSource.sourcePvf);
  const child = childProcess.spawnSync(process.execPath, childArgs, {
    cwd: workbenchRoot,
    encoding: "utf8",
    timeout: 10 * 60 * 1000,
  });
  const after = statFingerprint(resolvedSource.sourcePvf);
  if (child.status !== 0) {
    throw new Error(`write smoke failed exit=${child.status}\nSTDOUT:\n${child.stdout}\nSTDERR:\n${child.stderr}`);
  }

  const parsed = JSON.parse(child.stdout);
  const manifest = parsed.manifest || (parsed.manifestPath ? readJson(parsed.manifestPath) : {});
  const safety = manifest.safety || {};
  assertCondition(safety.sourceOverwritten === false, "write smoke must not overwrite source PVF.");
  assertCondition(safety.backupCreated === true, "write smoke must create a backup.");
  assertCondition(safety.explicitOutputPath === true, "write smoke must use explicit output path.");
  assertCondition(safety.readbackOk === true, "write smoke readback must pass.");
  assertCondition(safety.clientResourceWrite === false, "write smoke must not write client resources.");
  assertCondition(before.size === after.size, "source PVF size changed during write smoke.");
  assertCondition(Math.abs(before.mtimeMs - after.mtimeMs) < 2, "source PVF mtime changed during write smoke.");

  if (fixture.writeSmoke?.expectedChangedCount !== undefined) {
    assertCondition(
      manifest.summary?.changedCount === fixture.writeSmoke.expectedChangedCount,
      `write smoke changedCount expected ${fixture.writeSmoke.expectedChangedCount}, got ${manifest.summary?.changedCount}`
    );
  }

  return {
    changeSetFile,
    smokeRoot,
    manifestPath: parsed.manifestPath,
    outputPvf: manifest.outputPvf,
    backupPath: manifest.backupPath,
    sourceUnchanged: true,
    changedCount: manifest.summary?.changedCount,
  };
}

async function runCheck() {
  const loadedContract = loadContract();
  const loadedFixture = loadFixture(loadedContract.contract);
  const adapterConfig = loadAdapterConfig(workbenchRoot);
  const resolvedSource = resolveSourcePvf(workbenchRoot, option("--profile"), option("--pvf"));
  const sourcePvf = resolvedSource.sourcePvf;
  if (!fs.existsSync(sourcePvf)) {
    throw new Error(`PVF file does not exist: ${sourcePvf}`);
  }

  const tests = [];
  const fixture = loadedFixture.fixture;
  const runRoot = resolveRunRoot({
    profileName: resolvedSource.profile?.name || option("--profile"),
    sourceLabel: path.basename(sourcePvf, path.extname(sourcePvf)),
    fixtureId: fixture.fixtureId,
  });
  fs.mkdirSync(runRoot, { recursive: true });
  const fixtureEncoding = fixture.encoding || {};
  const expectedPvfPath = fixture.expectedPvfPath;
  let openedSessionId = null;
  let client = null;

  await recordTest(tests, "contract.file-valid", async () => ({
    contractFile: loadedContract.file,
    fixtureFile: loadedFixture.file,
    capabilityCount: loadedContract.contract.requiredCapabilities.length,
  }));

  await recordTest(tests, "adapter.read-only-safety", async () => {
    assertReadOnlyAdapter(adapterConfig);
    for (const tool of ["pvf_backup", "pvf_replace_text", "pvf_write_file", "pvf_save"]) {
      assertCondition(adapterConfig.forbiddenToolsSet.has(tool), `adapter must forbid ${tool}`);
    }
    return {
      mode: adapterConfig.mode,
      allowedTools: [...adapterConfig.allowedToolsSet].sort(),
      forbiddenTools: [...adapterConfig.forbiddenToolsSet].sort(),
    };
  });

  client = new McpStdioClient(upstreamLaunchOptions(adapterConfig));
  try {
    await recordTest(tests, "upstream.required-tools-present", async () => {
      const listed = await client.listTools();
      const upstreamNames = new Set(listed.map((tool) => tool.name));
      const missing = requiredReadTools(loadedContract.contract).filter((tool) => !upstreamNames.has(tool));
      assertCondition(missing.length === 0, `upstream missing read tools: ${missing.join(", ")}`);
      return {
        upstreamToolCount: listed.length,
        requiredReadTools: requiredReadTools(loadedContract.contract),
      };
    });

    await recordTest(tests, "session.open", async () => {
      const opened = await callAndParse(client, "pvf_open", {
        path: sourcePvf,
        encoding: option("--encoding", fixtureEncoding.open || adapterConfig.defaults.pvfOpenEncoding),
      });
      openedSessionId = opened.session?.sessionId;
      assertCondition(openedSessionId, "pvf_open did not return sessionId.");
      return {
        sourcePvf,
        profile: resolvedSource.profile?.name || null,
        sessionId: openedSessionId,
        encoding: option("--encoding", fixtureEncoding.open || adapterConfig.defaults.pvfOpenEncoding),
      };
    });

    if (!openedSessionId) {
      throw new Error("Cannot continue backend contract checks without an open session.");
    }

    await recordTest(tests, "path.list-page", async () => {
      const listProbe = fixture.listProbe || {};
      const first = await callAndParse(client, "pvf_list_files_page", {
        sessionId: openedSessionId,
        prefix: listProbe.prefix,
        contains: listProbe.contains,
        offset: 0,
        limit: listProbe.limit || 20,
      });
      assertCondition(Number(first.returnedCount || 0) > 0, "paged list returned no files.");
      assertCondition(pathItemsContain(first.items, expectedPvfPath), `paged list did not include ${expectedPvfPath}.`);

      const details = {
        matchedCount: first.matchedCount,
        returnedCount: first.returnedCount,
        hasMore: first.hasMore,
        nextOffset: first.nextOffset,
      };
      const offsetProbe = Number(listProbe.offsetProbe || 0);
      if (offsetProbe > 0 && Number(first.matchedCount || 0) > offsetProbe) {
        const page = await callAndParse(client, "pvf_list_files_page", {
          sessionId: openedSessionId,
          prefix: listProbe.prefix,
          contains: undefined,
          offset: offsetProbe,
          limit: Math.min(Number(listProbe.limit || 20), 2000),
        });
        assertCondition(Number(page.returnedCount || 0) > 0, `offset page ${offsetProbe} returned no files.`);
        details.offsetProbe = {
          offset: offsetProbe,
          returnedCount: page.returnedCount,
          hasMore: page.hasMore,
        };
      }
      return details;
    });

    await recordTest(tests, "registry.list", async () => {
      const registries = await callAndParse(client, "pvf_list_registries", {
        sessionId: openedSessionId,
        includeCounts: true,
        includeSecondary: false,
        pvfEncoding: fixtureEncoding.read || adapterConfig.defaults.pvfReadEncoding,
        convertToSimplifiedChinese: true,
      });
      const paths = collectRegistryPaths(registries);
      assertCondition(
        paths.map(normalizePvfPath).includes(normalizePvfPath(fixture.registryPath)),
        `registry list did not include ${fixture.registryPath}`
      );
      return {
        registryCount: paths.length,
        fixtureRegistryPath: fixture.registryPath,
      };
    });

    await recordTest(tests, "registry.resolve-lst", async () => {
      const resolved = await callAndParse(client, "pvf_resolve_lst_id", {
        sessionId: openedSessionId,
        lstPath: fixture.registryPath,
        id: Number(fixture.registryId),
        includeFileSummary: true,
        pvfEncoding: fixtureEncoding.read || adapterConfig.defaults.pvfReadEncoding,
        convertToSimplifiedChinese: true,
      });
      assertCondition(resolved.found !== false, `${fixture.registryPath}:${fixture.registryId} was not found.`);
      const pvfPath = resolvedPvfPath(resolved);
      assertCondition(
        normalizePvfPath(pvfPath) === normalizePvfPath(expectedPvfPath),
        `expected ${expectedPvfPath}, got ${pvfPath}`
      );
      return {
        lstPath: fixture.registryPath,
        id: fixture.registryId,
        pvfPath,
      };
    });

    await recordTest(tests, "text.read-registry", async () => {
      const read = await callAndParse(client, "pvf_read_file", {
        sessionId: openedSessionId,
        pvfPath: fixture.readPath,
        pvfEncoding: fixtureEncoding.read || adapterConfig.defaults.pvfReadEncoding,
        decompileScript: true,
        decompileBinaryAni: false,
        useCompatibleDecompiler: true,
        convertToSimplifiedChinese: true,
        maxChars: 30000,
      });
      assertCondition(typeof read.textContent === "string", `${fixture.readPath} did not return textContent.`);
      if (fixture.registryExpectedText) {
        assertCondition(read.textContent.includes(fixture.registryExpectedText), `read text missing ${fixture.registryExpectedText}`);
      }
      return {
        pvfPath: fixture.readPath,
        textLength: read.textContent.length,
        metadata: read.metadata,
      };
    });

    await recordTest(tests, "text.read-resolved-file", async () => {
      const read = await callAndParse(client, "pvf_read_file", {
        sessionId: openedSessionId,
        pvfPath: expectedPvfPath,
        pvfEncoding: fixtureEncoding.read || adapterConfig.defaults.pvfReadEncoding,
        decompileScript: true,
        decompileBinaryAni: false,
        useCompatibleDecompiler: true,
        convertToSimplifiedChinese: true,
        maxChars: 30000,
      });
      assertCondition(typeof read.textContent === "string", `${expectedPvfPath} did not return textContent.`);
      return {
        pvfPath: expectedPvfPath,
        textLength: read.textContent.length,
        metadata: read.metadata,
      };
    });

    await recordTest(tests, "path.search-or-list-fallback", async () => {
      const found = await callAndParse(client, "pvf_list_files_page", {
        sessionId: openedSessionId,
        contains: fixture.pathSearchContains,
        offset: 0,
        limit: 100,
      });
      assertCondition(Number(found.returnedCount || 0) > 0, `path contains search found no results for ${fixture.pathSearchContains}.`);
      assertCondition(pathItemsContain(found.items, expectedPvfPath), `path contains search did not include ${expectedPvfPath}.`);
      return {
        contains: fixture.pathSearchContains,
        matchedCount: found.matchedCount,
        returnedCount: found.returnedCount,
      };
    });
  } finally {
    if (openedSessionId && client) {
      await recordTest(tests, "session.close", async () => {
        await callAndParse(client, "pvf_close", { sessionId: openedSessionId });
        openedSessionId = null;
        return {};
      });
    }
    if (client) {
      client.stop();
    }
  }

  if (flag("--skip-index")) {
    skipTest(tests, "index.status", "--skip-index was provided.");
    skipTest(tests, "index.path-query", "--skip-index was provided.");
    skipTest(tests, "index.resolve-lst", "--skip-index was provided.");
  } else {
    const indexScope = option("--scope", fixture.index?.scope || "itemshop");
    await recordTest(tests, "index.status", async () => {
      const status = indexStore.indexStatus(workbenchRoot, {
        profile: option("--profile"),
        pvf: option("--pvf"),
        scope: indexScope,
      });
      assertCondition(status.exists === true, `index source PVF missing for scope ${indexScope}.`);
      assertCondition(status.fresh === true, `index is stale for scope ${indexScope}.`);
      return {
        scope: indexScope,
        indexDir: status.indexDir,
        summary: status.manifest?.summary,
        checks: status.checks,
      };
    });

    await recordTest(tests, "index.path-query", async () => {
      const result = await indexStore.queryPathIndex(workbenchRoot, {
        profile: option("--profile"),
        pvf: option("--pvf"),
        scope: indexScope,
        prefix: fixture.index?.pathPrefix,
        contains: fixture.index?.pathContains || fixture.pathSearchContains,
        limit: 100,
      });
      const expected = fixture.index?.expectedPvfPath || expectedPvfPath;
      assertCondition(result.returnedCount > 0, "index path query returned no rows.");
      assertCondition(pathItemsContain(result.items, expected), `index path query did not include ${expected}.`);
      return {
        scope: indexScope,
        returnedCount: result.returnedCount,
        expectedPvfPath: expected,
      };
    });

    await recordTest(tests, "index.resolve-lst", async () => {
      const result = await indexStore.resolveLstIndex(workbenchRoot, {
        profile: option("--profile"),
        pvf: option("--pvf"),
        scope: indexScope,
        lstPath: fixture.registryPath,
        id: Number(fixture.registryId),
        limit: 20,
      });
      assertCondition(result.found === true, "index .lst query did not find fixture ID.");
      assertCondition(pathItemsContain(result.items, expectedPvfPath), `index .lst query did not include ${expectedPvfPath}.`);
      return {
        scope: indexScope,
        returnedCount: result.returnedCount,
        expectedPvfPath,
      };
    });
  }

  if (flag("--include-write-smoke")) {
    await recordTest(tests, "write.controlled-output-smoke", async () =>
      runWriteSmoke(loadedFixture.file, fixture, runRoot, resolvedSource)
    );
  } else {
    skipTest(tests, "write.controlled-output-smoke", "Use --include-write-smoke to run controlled output apply/readback.");
  }

  const passed = tests.filter((test) => test.ok && !test.skipped).length;
  const skipped = tests.filter((test) => test.skipped).length;
  const failed = tests.filter((test) => !test.ok).length;
  const reportPath = path.join(runRoot, "BACKEND-CONTRACT-REPORT.json");
  const report = {
    schemaVersion: "1.0",
    phase: "phase-4-backend-contract",
    generatedAt: new Date().toISOString(),
    contractId: loadedContract.contract.contractId,
    contractFile: loadedContract.file,
    fixtureId: fixture.fixtureId,
    fixtureFile: loadedFixture.file,
    profile: resolvedSource.profile?.name || null,
    sourcePvf,
    reportPath,
    summary: {
      ok: failed === 0,
      passed,
      failed,
      skipped,
    },
    tests,
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  output(report);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  if (!command || command === "help" || command === "--help") {
    process.stdout.write(usage());
    return;
  }
  const loadedContract = loadContract();
  if (command === "show") {
    output({
      ok: true,
      contractFile: loadedContract.file,
      contract: loadedContract.contract,
    });
    return;
  }
  if (command === "fixture") {
    const loadedFixture = loadFixture(loadedContract.contract);
    output({
      ok: true,
      fixtureFile: loadedFixture.file,
      fixture: loadedFixture.fixture,
    });
    return;
  }
  if (command === "check") {
    await runCheck();
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  process.stderr.write(`${error && error.stack ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
