# PVF-Agent-Workbench 变更记录

## 1.0.0 - 2026-06-20

首次公开发布。

- 提供可由 Codex、Claude Code、OpenCode、Trae 等命令型桌面 Agent 使用的便携 PVF 工作台。
- 支持项目级 Agent Skill、MCP 接入和 `workbench.bat` 命令行降级通道。
- 默认只读；PVF 写出必须使用显式输出、时间戳备份、最小修改、保存清单和 readback。
- 内置纯净 knowledge-pack、任务路由、字段词典、工作流、环境检查、Agent 回归评测和三阶段发布门禁。
- 真实 PVF、客户端、机器路径、索引、报告和 release stage 不进入干净 Workbench。
- 运行产物默认保存在 Workbench 外部，并由纯净度检查阻止回写到源目录。
