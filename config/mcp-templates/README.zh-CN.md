# MCP 模板

这里放宿主 Agent 注册 Workbench MCP 的参考模板。

这些模板只描述 Workbench 这一侧的稳定入口：用 Node 启动 `core/pvf-agent-core/mcp/server.js`，工作目录设为 Workbench 根目录。不同 Agent 宿主的配置文件名、字段名和导入方式可能不同，按宿主工具自己的 MCP 设置界面或文档映射即可。

## 推荐入口

优先使用 Workbench 自带 Node：

```text
command: <WORKBENCH_ROOT>\runtime\node\node.exe
args:    <WORKBENCH_ROOT>\core\pvf-agent-core\mcp\server.js
cwd:     <WORKBENCH_ROOT>
```

如果宿主不接受绝对路径中的空格，使用宿主支持的路径转义方式，或改用系统 `node`。

## 模板文件

- `pvf-agent-core.windows-bundled-node.fragment.json`: Windows + Workbench 自带 Node。
- `pvf-agent-core.system-node.fragment.json`: 使用系统 `node`。
- `host-agent-notes.zh-CN.md`: Codex、Claude Code、OpenCode、Trae 等宿主的通用接入说明。
- `typesquirrel-optional.zh-CN.md`: TypeSquirrel 可选增强边界。

## 验证

注册后开启新的 Agent 会话，先看当前工具列表是否出现 `pvf_agent_*` 或 `pvf_*` 只读工具。没有出现时，不要假设 MCP 可用，改用：

```bat
workbench.bat check
workbench.bat doctor check --skip-profiles
workbench.bat pvf-read adapter-info
```

PVF 写出仍然只能走 `workbench.bat pvf-change apply` 的受控输出通道。MCP 模板不改变写入授权边界。
