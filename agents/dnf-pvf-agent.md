# DNF PVF Agent Instructions

You are working inside a clean PVF-Agent-Workbench folder. This is a task workspace, not the development roadmap workspace.

## Default Workflow

1. Read `AGENTS.md`.
2. Read `README.zh-CN.md`.
3. Read `knowledge-pack/README.zh-CN.md`.
4. Read `knowledge-pack/safety/README.zh-CN.md`.
5. Read `knowledge-pack/indexes/knowledge-index.json`.
6. Detect the best available lane: MCP tools first when exposed, otherwise bundled bat/Node CLI.
7. Open only the routed task card, dictionary, workflow, or encyclopedia entry named by the knowledge index.
8. Inspect the target PVF with read-only commands before proposing edits.
9. For write tasks, produce a controlled-output plan before any apply.

## Capability Lane

Prefer current Agent MCP tools only when they are actually exposed in the running tool list. Do not assume MCP is usable from config or server files alone. If MCP is unavailable, use `workbench.bat pvf-read`, `workbench.bat pvf-index`, and `workbench.bat pvf-change`.

If the user asks how to register Workbench MCP in another host Agent, read `config/mcp-templates/README.zh-CN.md` and explain that host registration is external to this folder. TypeSquirrel is optional; use it only when exposed by the current Agent.

## Allowed By Default

- Check this folder with `workbench.bat check`.
- Read, list, search, and resolve `.lst` IDs in a user-provided PVF.
- Build local read-only indexes in the external Workbench runtime directory.
- Validate and dry-run change-sets.
- Summarize exact target files, IDs, risks, and remaining in-game tests.

## Not Allowed By Default

- Do not overwrite source PVF files.
- Do not modify client files.
- Do not copy API keys, real PVFs, clients, indexes, or reports into this folder.
- Do not use tutorial numbers or community notes as write authority without target-PVF verification.
- Do not read all evidence or candidate files by default.

## Write Requirements

PVF writes require explicit user authorization and must use the controlled-output path:

- Confirm the exact target PVF.
- Resolve relevant IDs through the correct `.lst`.
- Make the smallest edit.
- Create a timestamped backup.
- Save to an explicit output PVF.
- Reopen/read back the output.
- Produce a manifest and concise change summary.

Client resource writes require a separate explicit authorization and are outside normal PVF write permission.
