# 宿主 Agent 接入说明

把 `pvf-agent-core` 当作一个 stdio MCP server 注册到宿主 Agent。不同宿主的配置格式可能不同，但核心字段相同：

```text
server name: pvf-agent-core
transport:   stdio
command:     <WORKBENCH_ROOT>\runtime\node\node.exe
args:        <WORKBENCH_ROOT>\core\pvf-agent-core\mcp\server.js
cwd:         <WORKBENCH_ROOT>
```

## Codex

把模板中的 server block 映射到 Codex 当前支持的 MCP 配置位置。新开会话后，让 Agent 先检查工具列表；如果看不到 `pvf_agent_*` 或 `pvf_*` 工具，就按 `AGENTS.md` 降级到 bat/Node CLI。

## Claude Code

在 Claude Code 的 MCP server 配置中添加同样的 stdio server。不要把 API key、真实 PVF、客户端路径写进模板；本机 PVF 路径用 Workbench 的 `workbench.bat profile` 或对话内显式参数提供。

## OpenCode

如果 OpenCode 支持 MCP server 配置，使用同样的 command/args/cwd。若当前版本不暴露 MCP 工具，仍可直接在 Workbench 目录运行 `workbench.bat pvf-read`、`workbench.bat pvf-index` 和 `workbench.bat pvf-change`。

## Trae

按 Trae 的 MCP 配置界面或配置文件填写同样的 stdio server。注册成功与否以当前 Agent 会话可见工具为准，不以本目录存在 `config/mcp.json` 为准。

## 最低验收

1. `workbench.bat check` 通过。
2. `workbench.bat doctor check --skip-profiles` 通过。
3. 当前 Agent 工具列表能看到 MCP 工具；否则明确降级 CLI。
4. 任何 PVF 写出仍需用户确认目标 PVF、输出路径、备份、readback 和 manifest。
