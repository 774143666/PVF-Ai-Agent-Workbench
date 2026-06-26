# APC 提取 Planner 流程

状态：默认可用

## 适用

用于把 APC / AICharacter 相关文件做只读闭合和分析，输出 `.aic -> .ai -> .key -> skill/equipment/item` 的可审阅依赖图。

本流程不写 PVF，不生成可直接导入的补丁，不证明 APC 战斗行为、技能释放节奏或门控逻辑在实机中成功。

## 输入

- 源 PVF 或已经提取出的工作目录。
- APC 的 aicharacter ID、`.aic` path、名称关键词，或副本提取目录中的 APC 文件。
- 输出目录，必须位于工作区内。

## 执行

1. 先确认问题是 APC 提取/分析，而不是 monster、passiveobject、skill 或 dungeon 的单独问题。
2. 如果输入是数字，先按 `aicharacter/aicharacter.lst` 解析；不要和 monster、npc、skill ID 混用。
3. 收集 root `.aic`、同目录或显式引用的 `.ai`、`.key`、必要 registry 和被引用技能/装备/快捷道具线索。
4. 对 `.aic` 中的 `[ai pattern]`、`[key stream]`、`[quick skill]`、`[skill]`、`[equipment]`、`[quick item]` 等字段做只读闭合。
5. key stream 的动作名必须回到 `.aic` 或 `.ai` 的上下文解释，不要只看 `.key` 文件名。
6. skill ID 必须按目标职业 skill registry 解析；不能用全局数字猜技能。
7. equipment 和 stackable ID 必须分别按 `equipment/equipment.lst` 与 `stackable/stackable.lst` 解析。
8. 若 APC 来自副本提取目录，可在提取后运行 APC 分析器生成 JSON/Markdown 摘要。
9. 未解析字段、未命中 ID、缺失 `.ai/.key`、跨目录引用全部进入 unresolved，不写成成功闭合。

## 常用命令

```powershell
node "tools\pvf-bridge\analyze-apc.js" --extract-dir="pvf-lab\experiments\task\dungeon-extract"
node "tools\pvf-bridge\analyze-apc.js" --extract-dir="pvf-lab\experiments\task\apc-extract" --out="pvf-lab\experiments\task\apc-extract\_meta\apc-analysis.json" --md-out="pvf-lab\experiments\task\apc-extract\_meta\apc-analysis.md"
```

## 输出审阅

- APC 数量、`.aic/.ai/.key` 文件数量。
- skill、equipment、quick item 的唯一 ID 数量。
- AI pattern、AI return、AI import、key skill command 的使用摘要。
- 未闭合引用和字段含义不明项。

## 验收

- root APC 唯一或已明确是批量分析。
- `.aic -> .ai -> .key` 链路可追踪。
- skill、equipment、stackable 均按正确 registry 解析。
- unresolved 和 read error 已列出。
- 输出明确标记未写 PVF、未部署客户端、不是运行时成功证明。

## 边界

- `.aic` 数值列含义不足时保持 `需验证`，不要从邻近样本硬推。
- AI/key 静态闭合不证明实机会按预期放技能。
- APC 出现在副本闭包中，不等于副本门控、事件触发或 Boss 判定成功。
- 涉及战斗表现、门控、事件触发或技能节奏时，必须实机验证。
