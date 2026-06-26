# PVF AI Agent Workbench

一个面向 DNF / DFO PVF 修改场景的 AI Agent 工作台。

它不是 PVF 编辑器本体，也不自带任何真实 PVF、客户端、NPK 或 IMG 资源。它提供的是一套给 Codex、Claude Code、OpenCode、Trae 等 AI Agent 使用的干净工作区、知识包、安全规则、只读检查工具和受控写入流程。

如果你遇到“不会改 PVF”“字段不知道什么意思”“新增任务或物品会崩溃”“技能参数不知道该改哪个文件”这类问题，可以把 AI Agent 的工作区指向本目录，让 Agent 先按这里的规则做只读分析，再决定是否进入 dry-run 或受控输出。

## 下载

建议直接下载正式版：

[v1.0.0 Release](https://github.com/774143666/PVF-Ai-Agent-Workbench/releases/tag/v1.0.0)

下载页面里的 Source code zip 即可使用。解压后，用你正在使用的 AI Agent 工具打开 `PVF-Agent-Workbench` 文件夹。

## 适合做什么

- 查询 PVF 字段、标签、路径和注册表含义。
- 分析 NPC 商店、道具、装备、礼包、宠物、宝珠、卡片、APC、副本、任务、掉落、技能参数等修改范围。
- 在修改前做只读检查、索引、依赖闭合和风险提示。
- 让 Agent 按固定流程生成 dry-run 或受控输出 PVF。
- 给不熟悉 PVF 结构的人提供一套可复用的排查路线。

## 快速开始

1. 安装并打开一个支持文件夹工作区的 AI Agent 工具，例如 Codex、Claude Code、OpenCode 或 Trae。
2. 让该工具打开解压后的 `PVF-Agent-Workbench` 文件夹。
3. 新建对话，把下面这段发给 Agent：

```text
请先只读 AGENTS.md、knowledge-pack/README.zh-CN.md、knowledge-pack/safety/README.zh-CN.md 和 knowledge-pack/indexes/knowledge-index.json。
读完后告诉我：
1. 这个工作台是做什么的
2. 你需要我提供哪些信息才能开始 PVF 修改
3. 本次任务应该先只读、dry-run，还是可以准备输出 PVF
```

通常你还需要告诉 Agent：

- 目标 `Script.pvf` 的路径
- 你想修改什么，例如任务、商店、技能、装备、掉落、宠物、礼包或副本
- 是否允许生成新的输出 PVF
- 是否有可用于对照的参考 PVF
- 是否会进行实机测试

## 新手建议

第一次使用时，建议从只读查询开始，不要直接要求写 PVF。

相对适合作为第一步的任务：

- 查某个 NPC 商店卖什么
- 查某个物品或装备的字段
- 查某个技能参数在哪些 `.skl` / TP / Ex 文件里
- 查任务、掉落、门票、奖励链路

不建议一开始就做：

- 大型副本导入
- 客户端贴图、NPK、IMG 资源补丁
- NUT / SQR 运行逻辑修改
- 覆盖源 PVF

## 常用命令

普通用户通常只需要根目录的 `workbench.bat`：

```bat
workbench.bat help
workbench.bat check
workbench.bat knowledge-check
workbench.bat release gate3
```

如果你已经有目标 PVF，可以让 Agent 帮你调用只读命令，例如：

```bat
workbench.bat pvf-read list-files --pvf "D:\MyDNFWork\Script.pvf" --prefix itemshop --limit 5
workbench.bat pvf-read read --pvf "D:\MyDNFWork\Script.pvf" --path itemshop/itemshop.lst --max-chars 1200
```

更多命令和工作台内部结构见：

- [README.zh-CN.md](README.zh-CN.md)
- [AGENTS.md](AGENTS.md)
- [docs/CLEAN-COPY.zh-CN.md](docs/CLEAN-COPY.zh-CN.md)

## 安全边界

这个工作台默认把 PVF 修改当成高风险操作处理：

- 先只读，再 dry-run，最后才考虑受控输出。
- 写 PVF 前必须确认目标 PVF、路径、ID、注册表和依赖范围。
- 写出 PVF 必须走显式 output、备份、readback 和 manifest。
- 文本替换必须使用目标 PVF 原始 raw / no-simplified 文本，不要写入简体化显示文本或 `&#数字;` HTML 实体。
- 任务、掉落、技能、客户端资源等结论必须回到目标 PVF 验证，不能只靠教程或别人的样本。

## 知识包

`knowledge-pack/` 是这个仓库最重要的部分之一。它只保留字段、路径、列义、单位、换算线索、路由和安全边界，不保存原始大文本、聊天记录、实验报告、本地证据路径、真实 PVF 或客户端资源。

知识包默认采用 CC0：

[LICENSE-KNOWLEDGE-CC0.md](LICENSE-KNOWLEDGE-CC0.md)

也就是说，你可以复制、吸收、改写、重新分发其中内容，不需要提前询问，也不强制署名。

## 提问

如果你不知道某个 PVF 问题该怎么查，可以在 Issues 里描述：

- 你想改什么
- 已知 ID、路径或 NPC / 物品 / 技能名
- 当前现象，例如崩溃、无效、重复加载、资源红叉
- 你已经尝试过什么

不要上传真实 PVF、客户端文件、账号信息、API key 或私有路径截图。

Issues:

https://github.com/774143666/PVF-Ai-Agent-Workbench/issues

## 许可证

- 代码和工具脚本：MIT License，见 [LICENSE](LICENSE)
- `knowledge-pack/`：CC0 1.0，见 [LICENSE-KNOWLEDGE-CC0.md](LICENSE-KNOWLEDGE-CC0.md)

第三方运行时、工具和二进制文件仍遵循各自上游许可证。
