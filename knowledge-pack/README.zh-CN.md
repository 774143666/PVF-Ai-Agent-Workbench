# knowledge-pack

这里是 PVF-Agent-Workbench 的纯净知识包。它只放 Agent 执行任务需要的结论、词典、流程和安全规则。

它不是 `DNFPVFwork` 的备份，也不是来源资料库。来源、实验报告、旧路径、社区教程、源码参考、候选报告和争议追查材料不进入纯净工作台；需要验收或追查时回到原研究工作区处理。

## 默认入口

Agent 应先读：

1. `safety/README.zh-CN.md`
2. `indexes/knowledge-index.json`
3. 路由命中的 `encyclopedia/`、`dictionaries/`、`workflows/` 或 `task-cards/` 文件

`indexes/knowledge-index.json` 是轻量根路由。找不到旧 topic 时，再按需打开 `indexes/knowledge-topic-routes.full.json`；不要默认读取完整 topic 路由或深账本。

如果某个主题没有命中路由，先做只读定位，不要回退到来源资料或旧报告。

## 子目录

- `safety/`：只放硬边界。默认只读、不覆盖源 PVF、写出必须备份和读回。
- `indexes/`：只放路由 JSON 和少量入口说明，不放证据链。
- `encyclopedia/`：纯百科，说明某类 PVF 文件或系统是什么。
- `dictionaries/`：纯词典，说明标签、字段、词条、常见值是什么意思。
- `workflows/`：纯流程，说明某类任务怎么做。
- `task-cards/`：面向 Agent 的短任务卡。

## 状态标记

纯净知识包只使用三种状态：

- `默认可用`：Agent 可以按正文理解和执行；写 PVF 时仍必须确认目标 PVF、解析 `.lst`、备份、输出新 PVF、读回。
- `需验证`：只能当任务线索；必须查目标 PVF、客户端或实机后才能下结论。
- `禁用`：已知容易错、过时、误导，不能照做。

不要在正文里写来源报告、旧实验路径或证据链。结论是否可靠由维护者在研究工作区完成验收后再迁入。

## 禁止进入

- 真实 PVF、PVF 备份、实验输出 PVF。
- 客户端、ImagePacks2/NPK 原文件。
- API key、本地 profile、索引缓存、运行报告。
- 社区教程全文、源码全文、OCR 全文、旧实验报告全文。
- 只用于证明“为什么这么写”的证据链。
