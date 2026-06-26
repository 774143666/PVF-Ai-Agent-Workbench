# PVF Backend Contract v1

本文件定义 Portable PVF Agent Workbench 对 PVF 后端的最低要求。

这里的“后端”不是 OpenCode、Codex 或 MCP 本身，而是 `pvf-agent-core` 背后真正负责打开、读取、解析、索引和受控写出 PVF 的能力层。当前实现复用 `pvf_bridge` / PVF X-Pilot 的底层能力；未来如果替换成 native backend，也必须通过同一组契约测试。

## 设计目标

- 允许当前继续复用已验证的 PVF X-Pilot / `pvf_bridge` 能力。
- 防止上层工作台被某一个 UI 或 runtime 锁死。
- 用机器可执行的检查固定住“什么叫合格 PVF backend”。
- 把读、索引、`.lst` 解析、受控写出和 readback 拆成可验证能力。

## 后端必须提供的能力

| 能力 | 要求 |
| --- | --- |
| session open/close | 用显式编码打开目标 PVF，返回 session id，并可关闭会话。 |
| paged path list | 支持 prefix/contains 过滤、offset/limit 分页和匹配总数。 |
| path search | 能按路径或文件名片段找到文件；可以由 search 实现，也可以由 paged list fallback 实现。 |
| text/script read | 能按 PVF 路径读取文本或脚本反编译结果，并支持显式读取编码。 |
| registry list | 能列出主要 `.lst` 注册表，必要时解析 entry count。 |
| registry resolve | 数字 ID 必须通过明确 `.lst` 解析成 PVF 路径，不允许直接猜。 |
| local index | 能建立或读取 path / registry / `.lst` 索引，并能判断索引是否和源 PVF 匹配。 |
| controlled write | 写入必须经过 change-set、备份、显式 output、重新打开 output readback。 |

## 不变安全规则

- 默认 adapter 必须是 read-only。
- Agent 面向 MCP 默认不得暴露 `pvf_backup`、`pvf_replace_text`、`pvf_write_file`、`pvf_save`。
- 受控写出测试也不能覆盖源 PVF，只能输出到受控目录。
- source PVF 的 readback 才是最终证据；索引只用于加速。
- 客户端资源写入不包含在 PVF 写入权限里。

## 契约测试入口

```bat
workbench.bat backend-contract check --profile <profile> --scope itemshop
```

默认检查是只读的，会验证打开、分页列路径、读文件、列注册表、`.lst` 解析、索引状态和索引查询。

需要验证受控写出闭环时，显式加开关：

```bat
workbench.bat backend-contract check --profile <profile> --scope itemshop --include-write-smoke
```

这个写出烟测使用 fixture 里的 no-op replace，仍然会走备份、显式 output、保存、重新打开 output、readback manifest。它不会覆盖源 PVF，也不会写客户端资源。

## Fixture 策略

默认 fixture 是 `fixtures/itemshop-birken.fixture.json`，用于验证 `itemshop/itemshop.lst` -> `37` -> `itemshop/birken.shp` 闭环。运行前必须确认该闭环存在于当前目标 PVF。

未来换其它 PVF 或其它领域时，不需要改契约，只需要复制 fixture，替换：

- `registryPath`
- `registryId`
- `expectedPvfPath`
- `readPath`
- `pathSearchContains`
- `changeSetFile`

## 合格标准

一个后端只有在以下结果全部成立时，才可以作为生产写入候选：

- 只读检查通过。
- 所需索引 fresh，或者已重建。
- `.lst` 解析结果和 fixture 期望一致。
- optional write smoke 通过，manifest 显示 `sourceOverwritten=false`、`backupCreated=true`、`explicitOutputPath=true`、`readbackOk=true`。
- 源 PVF 文件大小和 mtime 未被写出测试改变。
