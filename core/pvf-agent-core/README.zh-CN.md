# pvf-agent-core

这里是 PVF-Agent-Workbench 的本地能力核心。

## 主要入口

- `cli/pvf-readonly.js`: 只读 open/list/search/read/resolve-lst。
- `cli/pvf-index.js`: 生成和查询本地只读索引。
- `cli/pvf-change-set.js`: 受控写入执行器；校验、dry-run、apply 到显式 output，并强制备份、readback、manifest。
- `cli/pvf-backend-contract.js`: 对 PVF backend 做只读 contract 检查。
- `mcp/server.js`: 给支持 MCP/stdio 的 Agent 使用。
- `scripts/workbench-profile.js`: 创建、选择和查看本机私有 profile。
- `scripts/runtime-absorb-checklist.js`: 生成实机验证结论吸收清单。

权限边界：

- `config/pvf-adapter.json` 是 Agent/MCP 只读通道，不暴露写工具。
- `config/write-policy.json` 定义 `pvf-change-set.js` 的受控写入通道；写入只能保存到显式 output，不能覆盖源 PVF，不能写客户端资源。
