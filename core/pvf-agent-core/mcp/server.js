"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { McpStdioClient, parseMcpTextResult } = require("../lib/mcp-stdio-client");
const { loadWorkspaceProfiles, resolveSourcePvf } = require("../lib/workspace-profiles");
const indexStore = require("../lib/pvf-index-store");
const {
  assertReadOnlyAdapter,
  loadAdapterConfig,
  upstreamLaunchOptions,
} = require("../lib/adapter-config");

const workbenchRoot = path.resolve(__dirname, "../../..");
const config = loadAdapterConfig(workbenchRoot);
assertReadOnlyAdapter(config);

let client;
const profileSessions = new Map();

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function errorResponse(id, message, code = -32000) {
  send({
    jsonrpc: "2.0",
    id,
    error: { code, message: String(message) },
  });
}

function textResult(value) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
  };
}

const customTools = [
  {
    name: "pvf_agent_profiles",
    description: "[read-only] List configured workspace profiles without opening a PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
  {
    name: "pvf_agent_open_profile",
    description: "[read-only] Open a workspace profile source PVF and cache the session for repeated read/search/resolve calls.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
        encoding: { type: "string" },
      },
    },
  },
  {
    name: "pvf_agent_cached_sessions",
    description: "[read-only] List cached profile sessions managed by pvf-agent-core.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
  {
    name: "pvf_agent_close_profile",
    description: "[read-only] Close one cached profile session, or all cached profile sessions when profile is omitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
      },
    },
  },
  {
    name: "pvf_agent_list_files",
    description: "[read-only] List files through a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile"],
      properties: {
        profile: { type: "string" },
        prefix: { type: "string" },
        contains: { type: "string" },
        limit: { type: "integer", minimum: 1 },
      },
    },
  },
  {
    name: "pvf_agent_list_files_page",
    description: "[read-only] List a paged slice of files through a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile"],
      properties: {
        profile: { type: "string" },
        prefix: { type: "string" },
        contains: { type: "string" },
        offset: { type: "integer", minimum: 0 },
        limit: { type: "integer", minimum: 1 },
      },
    },
  },
  {
    name: "pvf_agent_list_registries",
    description: "[read-only] List known .lst registries through a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile"],
      properties: {
        profile: { type: "string" },
        includeCounts: { type: "boolean" },
        includeSecondary: { type: "boolean" },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
    },
  },
  {
    name: "pvf_agent_search",
    description: "[read-only] Search names, strings, code, scripts, numbers, or file paths through a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile", "keyword"],
      properties: {
        profile: { type: "string" },
        keyword: { type: "string" },
        searchPath: { type: "string" },
        isStartMatch: { type: "boolean" },
        isUseLikeSearchPath: { type: "boolean" },
        searchType: { type: "string" },
        matchMode: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
        limit: { type: "integer", minimum: 1 },
      },
    },
  },
  {
    name: "pvf_agent_read_file",
    description: "[read-only] Read and decompile a PVF text/script file through a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile", "pvfPath"],
      properties: {
        profile: { type: "string" },
        pvfPath: { type: "string" },
        pvfEncoding: { type: "string" },
        decompileScript: { type: "boolean" },
        decompileBinaryAni: { type: "boolean" },
        autoConvertStringLink: { type: "boolean" },
        useCompatibleDecompiler: { type: "boolean" },
        convertToSimplifiedChinese: { type: "boolean" },
        startLine: { type: "integer" },
        endLine: { type: "integer" },
        maxChars: { type: "integer", minimum: 1 },
      },
    },
  },
  {
    name: "pvf_agent_resolve_lst",
    description: "[read-only] Resolve an ID through a .lst registry using a cached workspace profile session.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["profile", "lstPath", "id"],
      properties: {
        profile: { type: "string" },
        lstPath: { type: "string" },
        id: { type: "integer" },
        includeFileSummary: { type: "boolean" },
        pvfEncoding: { type: "string" },
        convertToSimplifiedChinese: { type: "boolean" },
      },
    },
  },
  {
    name: "pvf_agent_index_catalog",
    description: "[read-only] List scoped local PVF indexes recorded in CATALOG.json without opening the PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
        pvf: { type: "string" },
        catalogPath: { type: "string" },
      },
    },
  },
  {
    name: "pvf_agent_index_summary",
    description: "[read-only] Summarize an existing local PVF index without opening the PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
        pvf: { type: "string" },
        indexDir: { type: "string" },
        scope: { type: "string" },
      },
    },
  },
  {
    name: "pvf_agent_index_status",
    description: "[read-only] Check whether an existing local PVF index still matches its source PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
        pvf: { type: "string" },
        indexDir: { type: "string" },
        scope: { type: "string" },
        skipSampleHash: { type: "boolean" },
      },
    },
  },
  {
    name: "pvf_agent_index_path",
    description: "[read-only] Query paths from an existing local PVF path index without opening the PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string" },
        pvf: { type: "string" },
        indexDir: { type: "string" },
        scope: { type: "string" },
        prefix: { type: "string" },
        contains: { type: "string" },
        ext: { type: "string" },
        limit: { type: "integer", minimum: 1 },
      },
    },
  },
  {
    name: "pvf_agent_index_resolve_lst",
    description: "[read-only] Resolve an ID through an existing local .lst index without opening the PVF.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["lstPath", "id"],
      properties: {
        profile: { type: "string" },
        pvf: { type: "string" },
        indexDir: { type: "string" },
        scope: { type: "string" },
        lstPath: { type: "string" },
        id: { type: "integer" },
        limit: { type: "integer", minimum: 1 },
      },
    },
  },
];

const customToolNames = new Set(customTools.map((tool) => tool.name));

function getClient() {
  if (!client) {
    client = new McpStdioClient(upstreamLaunchOptions(config));
  }
  return client;
}

async function filteredTools() {
  const tools = await getClient().listTools();
  const upstreamTools = tools
    .filter((tool) => config.allowedToolsSet.has(tool.name))
    .map((tool) => ({
      ...tool,
      description: `[read-only] ${tool.description || ""}`.trim(),
    }));
  return [...customTools, ...upstreamTools];
}

async function callAndParse(name, toolArgs) {
  const result = await getClient().request("tools/call", {
    name,
    arguments: toolArgs || {},
  });
  if (result && result.isError) {
    const parsed = parseMcpTextResult(result);
    throw new Error(parsed.error || parsed.text || JSON.stringify(parsed));
  }
  return parseMcpTextResult(result);
}

function profileSessionSummary(value) {
  return {
    profile: value.profile,
    sessionId: value.sessionId,
    sourcePvf: value.sourcePvf,
    openedAt: value.openedAt,
    lastUsedAt: value.lastUsedAt,
  };
}

async function closeProfileSession(profileName) {
  const cached = profileSessions.get(profileName);
  if (!cached) {
    return { closed: false, profile: profileName };
  }
  profileSessions.delete(profileName);
  try {
    await callAndParse("pvf_close", { sessionId: cached.sessionId });
  } catch {
    // Closing is best-effort because an upstream session may already have ended.
  }
  return { closed: true, ...profileSessionSummary(cached) };
}

async function enforceSessionLimit() {
  const maxSessions = Number(config.sessionCache?.maxSessions || 4);
  while (profileSessions.size > maxSessions) {
    const oldest = [...profileSessions.values()].sort((a, b) => Date.parse(a.lastUsedAt) - Date.parse(b.lastUsedAt))[0];
    if (!oldest) {
      return;
    }
    await closeProfileSession(oldest.profile);
  }
}

async function ensureProfileSession(profileName, encoding) {
  const resolved = resolveSourcePvf(workbenchRoot, profileName, null);
  const cacheKey = resolved.profile?.name || profileName;
  const cached = profileSessions.get(cacheKey);
  if (cached && cached.sourcePvf === resolved.sourcePvf) {
    cached.lastUsedAt = new Date().toISOString();
    return cached;
  }
  if (!fs.existsSync(resolved.sourcePvf)) {
    throw new Error(`PVF file does not exist: ${resolved.sourcePvf}`);
  }
  const opened = await callAndParse("pvf_open", {
    path: resolved.sourcePvf,
    encoding: encoding || resolved.profile?.pvfEncoding?.open || config.defaults.pvfOpenEncoding,
  });
  const sessionId = opened.session?.sessionId;
  if (!sessionId) {
    throw new Error("pvf_open did not return a sessionId.");
  }
  const now = new Date().toISOString();
  const session = {
    profile: cacheKey,
    sessionId,
    sourcePvf: resolved.sourcePvf,
    openedAt: now,
    lastUsedAt: now,
    opened,
  };
  profileSessions.set(cacheKey, session);
  await enforceSessionLimit();
  return session;
}

function stripProfile(toolArgs) {
  const { profile, encoding, ...rest } = toolArgs || {};
  return rest;
}

async function callProfileTool(name, toolArgs) {
  const session = await ensureProfileSession(toolArgs.profile, toolArgs.encoding);
  const argsWithSession = {
    ...stripProfile(toolArgs),
    sessionId: session.sessionId,
  };
  if (name === "pvf_search") {
    argsWithSession.searchPath = argsWithSession.searchPath || "";
    argsWithSession.searchType = argsWithSession.searchType || "SearchName";
    argsWithSession.matchMode = argsWithSession.matchMode || "Like";
    argsWithSession.convertToSimplifiedChinese = argsWithSession.convertToSimplifiedChinese !== false;
    argsWithSession.limit = argsWithSession.limit || config.defaults.searchLimit;
  }
  if (name === "pvf_read_file") {
    argsWithSession.pvfEncoding = argsWithSession.pvfEncoding || config.defaults.pvfReadEncoding;
    argsWithSession.decompileScript = argsWithSession.decompileScript !== false;
    argsWithSession.decompileBinaryAni = argsWithSession.decompileBinaryAni !== false;
    argsWithSession.useCompatibleDecompiler = argsWithSession.useCompatibleDecompiler !== false;
    argsWithSession.convertToSimplifiedChinese = argsWithSession.convertToSimplifiedChinese !== false;
    argsWithSession.maxChars = argsWithSession.maxChars || config.defaults.maxReadChars;
  }
  if (name === "pvf_resolve_lst_id") {
    argsWithSession.pvfEncoding = argsWithSession.pvfEncoding || config.defaults.pvfReadEncoding;
    argsWithSession.convertToSimplifiedChinese = argsWithSession.convertToSimplifiedChinese !== false;
    argsWithSession.includeFileSummary = argsWithSession.includeFileSummary !== false;
  }
  if (name === "pvf_list_registries") {
    argsWithSession.pvfEncoding = argsWithSession.pvfEncoding || config.defaults.pvfReadEncoding;
    argsWithSession.convertToSimplifiedChinese = argsWithSession.convertToSimplifiedChinese !== false;
  }
  if (name === "pvf_list_files" || name === "pvf_list_files_page") {
    argsWithSession.limit = argsWithSession.limit || config.defaults.listLimit;
  }

  const result = await callAndParse(name, argsWithSession);
  if (
    name === "pvf_search" &&
    argsWithSession.searchType === "SearchFileName" &&
    Number(result.matchedCount || 0) === 0 &&
    argsWithSession.keyword
  ) {
    const fallback = await callAndParse("pvf_list_files", {
      sessionId: session.sessionId,
      prefix: argsWithSession.searchPath || undefined,
      contains: argsWithSession.keyword,
      limit: argsWithSession.limit,
    });
    return {
      ...fallback,
      sessionCache: profileSessionSummary(session),
      fallbackFrom: "pvf_search",
      fallbackMode: "pvf_list_files_contains",
      upstreamSearch: result,
    };
  }

  return {
    ...result,
    sessionCache: profileSessionSummary(session),
  };
}

async function handleCustomTool(name, toolArgs) {
  if (name === "pvf_agent_profiles") {
    const profiles = loadWorkspaceProfiles(workbenchRoot);
    return {
      ok: true,
      activeProfile: profiles.activeProfile,
      profiles: profiles.profiles.map((profile) => ({
        name: profile.name,
        enabled: profile.enabled,
        sourcePvf: profile.sourcePvf,
        output: profile.output,
        profileSource: profile.profileSource,
      })),
    };
  }
  if (name === "pvf_agent_open_profile") {
    const session = await ensureProfileSession(toolArgs.profile, toolArgs.encoding);
    return { ok: true, sessionCache: profileSessionSummary(session) };
  }
  if (name === "pvf_agent_cached_sessions") {
    return { ok: true, sessions: [...profileSessions.values()].map(profileSessionSummary) };
  }
  if (name === "pvf_agent_close_profile") {
    if (toolArgs.profile) {
      return { ok: true, result: await closeProfileSession(toolArgs.profile) };
    }
    const results = [];
    for (const profileName of [...profileSessions.keys()]) {
      results.push(await closeProfileSession(profileName));
    }
    return { ok: true, results };
  }
  if (name === "pvf_agent_index_catalog") {
    return indexStore.loadIndexCatalog(workbenchRoot, toolArgs);
  }
  if (name === "pvf_agent_index_summary") {
    return indexStore.summarizeIndex(workbenchRoot, toolArgs);
  }
  if (name === "pvf_agent_index_status") {
    return indexStore.indexStatus(workbenchRoot, toolArgs);
  }
  if (name === "pvf_agent_index_path") {
    return indexStore.queryPathIndex(workbenchRoot, {
      ...toolArgs,
      limit: toolArgs.limit || config.defaults.listLimit,
    });
  }
  if (name === "pvf_agent_index_resolve_lst") {
    return indexStore.resolveLstIndex(workbenchRoot, {
      ...toolArgs,
      limit: toolArgs.limit || config.defaults.listLimit,
    });
  }
  const profileToolMap = {
    pvf_agent_list_files: "pvf_list_files",
    pvf_agent_list_files_page: "pvf_list_files_page",
    pvf_agent_list_registries: "pvf_list_registries",
    pvf_agent_search: "pvf_search",
    pvf_agent_read_file: "pvf_read_file",
    pvf_agent_resolve_lst: "pvf_resolve_lst_id",
  };
  const upstreamName = profileToolMap[name];
  if (!upstreamName) {
    throw new Error(`Unsupported custom tool: ${name}`);
  }
  if (!config.allowedToolsSet.has(upstreamName)) {
    throw new Error(`Profile tool maps to a non-allowed upstream tool: ${upstreamName}`);
  }
  return callProfileTool(upstreamName, toolArgs);
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
          protocolVersion: message.params?.protocolVersion || "2025-06-18",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "pvf-agent-core-readonly", version: "1.0.0" },
          instructions:
            "Read-only PVF adapter. Allowed: pvf_open, pvf_session_info, pvf_close, pvf_list_files, pvf_list_files_page, pvf_search, pvf_list_registries, pvf_resolve_lst_id, pvf_resolve_id, pvf_read_file. Write tools are rejected.",
        },
      });
      return;
    }
    if (message.method === "notifications/initialized") {
      return;
    }
    if (message.method === "tools/list") {
      send({ jsonrpc: "2.0", id, result: { tools: await filteredTools() } });
      return;
    }
    if (message.method === "tools/call") {
      const name = message.params?.name;
      if (customToolNames.has(name)) {
        const customResult = await handleCustomTool(name, message.params?.arguments || {});
        send({ jsonrpc: "2.0", id, result: textResult(customResult) });
        return;
      }
      if (!config.allowedToolsSet.has(name)) {
        errorResponse(id, `Tool is not allowed by read-only adapter: ${name}`, -32602);
        return;
      }
      const toolArgs = message.params?.arguments || {};
      const result = await getClient().request("tools/call", {
        name,
        arguments: toolArgs,
      });
      if (name === "pvf_search" && toolArgs.searchType === "SearchFileName") {
        const parsed = parseMcpTextResult(result);
        if (!result.isError && Number(parsed.matchedCount || 0) === 0 && toolArgs.keyword) {
          const fallbackResult = await getClient().request("tools/call", {
            name: "pvf_list_files",
            arguments: {
              sessionId: toolArgs.sessionId,
              prefix: toolArgs.searchPath || undefined,
              contains: toolArgs.keyword,
              limit: toolArgs.limit,
            },
          });
          const fallback = parseMcpTextResult(fallbackResult);
          send({
            jsonrpc: "2.0",
            id,
            result: textResult({
              ...fallback,
              fallbackFrom: "pvf_search",
              fallbackMode: "pvf_list_files_contains",
              upstreamSearch: parsed,
            }),
          });
          return;
        }
      }
      send({ jsonrpc: "2.0", id, result });
      return;
    }
    if (id !== undefined) {
      errorResponse(id, `Unsupported method: ${message.method}`, -32601);
    }
  } catch (error) {
    if (id !== undefined) {
      errorResponse(id, error && error.message ? error.message : String(error));
    }
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  if (!line.trim()) {
    return;
  }
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    errorResponse(null, `Invalid JSON: ${error.message}`, -32700);
    return;
  }
  handle(message);
});

process.on("exit", () => {
  if (client) {
    client.stop();
  }
});
