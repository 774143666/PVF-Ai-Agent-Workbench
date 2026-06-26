# PVF AI Agent Workbench

这是一个给 AI Agent 使用的 DNF / DFO PVF 工作台。

简单说：把 Codex、Claude Code、OpenCode、Trae 等 AI 工具的工作区指向这个文件夹，它就能按这里的资料和规则帮你分析 PVF 怎么改、哪些文件要看、哪些地方容易崩。

它不是游戏客户端，也不是一键改 PVF 的外挂工具。它更像一份“给 AI 用的 PVF 修改说明书 + 安全检查工具箱”。

## 怎么下载

点 GitHub 页面右侧的 **Releases**，下载最新版的 **Source code (zip)**。

解压后，用你的 AI Agent 工具打开 `PVF-Agent-Workbench` 文件夹。

## 第一次怎么用

打开工作台后，先把这段话发给 AI：

```text
请先只读 AGENTS.md、knowledge-pack/README.zh-CN.md、knowledge-pack/safety/README.zh-CN.md 和 knowledge-pack/indexes/knowledge-index.json。
读完后告诉我这个工作台怎么用，以及我需要提供哪些信息。
```

然后再告诉它：

- 你的 `Script.pvf` 在哪里
- 你想改什么，比如任务、商店、装备、技能、掉落、礼包、宠物或副本
- 是否允许生成新的输出 PVF
- 是否会进游戏实测

新手建议先让 AI 做只读分析，不要一上来就写 PVF。

## 它能帮什么

- 查字段、路径、ID 和注册表。
- 帮你判断一个修改要动哪些 PVF 文件。
- 提醒常见崩溃点和格式坑。
- 做只读检查、dry-run 和受控输出流程。
- 给 AI 提供更稳定的 PVF 修改路线，减少瞎猜。

## 它不负责什么

- 不自带真实 PVF。
- 不自带客户端、NPK、IMG。
- 不保证任何修改不用实测就能进游戏。
- 不默认覆盖源 PVF。
- 不默认修改客户端资源。

## 最重要的安全原则

- 先查清楚，再动手。
- 写 PVF 前要确认目标文件、ID、路径和注册表。
- 不要直接覆盖源 PVF。
- 写出后要 readback 检查。
- 中文文本替换必须用 PVF 原始文本，不要把简体显示文本或 HTML 实体写回去。

更多细节不用全看，交给 AI 按需读取即可：

- [AGENTS.md](AGENTS.md)
- [README.zh-CN.md](README.zh-CN.md)
- [knowledge-pack/README.zh-CN.md](knowledge-pack/README.zh-CN.md)
- [docs/CLEAN-COPY.zh-CN.md](docs/CLEAN-COPY.zh-CN.md)

## 知识包可以拿去用

`knowledge-pack/` 默认使用 CC0。你可以复制、吸收、改写、重新分发，不需要提前问我，也不强制署名。

代码和工具脚本使用 MIT License。

## 有问题怎么办

点页面上方的 **Issues**，把你想改什么、已知 ID/路径、当前现象和尝试过的方法写清楚。

不要上传真实 PVF、客户端文件、账号信息、API key 或私有路径截图。
