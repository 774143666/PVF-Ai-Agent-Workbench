# PVF AI Agent Workbench

这是一个给 AI Agent 使用的 DNF / DFO PVF 工作台。

把 Codex、Claude Code、OpenCode、Trae 等 AI 工具的工作区指向这个文件夹，它就能按这里的资料和规则帮你分析 PVF 怎么改、该看哪些文件、哪些地方容易出错。

它更像一份“给 AI 用的 PVF 修改说明书 + 安全检查工具箱”，不是游戏客户端，也不是一键改 PVF 的工具。

## 下载使用

点 GitHub 页面右侧的 **Releases**，下载最新版的 **Source code (zip)**。

解压后，用你的 AI Agent 工具打开 `PVF-Agent-Workbench` 文件夹，然后先把这段话发给 AI：

```text
请先只读 AGENTS.md、knowledge-pack/README.zh-CN.md、knowledge-pack/safety/README.zh-CN.md 和 knowledge-pack/indexes/knowledge-index.json。
读完后告诉我这个工作台怎么用，以及我需要提供哪些信息。
```

接着告诉它：

- 你的 `Script.pvf` 在哪里
- 你想改什么，例如任务、商店、装备、技能、掉落、礼包、宠物或副本
- 是否允许生成新的输出 PVF
- 是否会进游戏实测

新手建议先让 AI 做只读分析，不要一上来就写 PVF。

## 能帮你做什么

- 查 PVF 字段、路径、ID 和注册表。
- 判断一个修改大概要动哪些文件。
- 提醒常见崩溃点和格式坑。
- 让 AI 按“只读 -> dry-run -> 受控输出”的路线做事。
- 减少 AI 靠猜修改 PVF 的概率。

## 几条底线

- 不要直接覆盖源 PVF。
- 不要默认修改客户端资源。
- 写 PVF 前先确认目标文件、ID、路径和注册表。
- 写出后要 readback 检查。
- 中文文本替换要用 PVF 原始文本，不要把简体显示文本或 HTML 实体写回去。

更多细节交给 AI 按需读取即可：

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
