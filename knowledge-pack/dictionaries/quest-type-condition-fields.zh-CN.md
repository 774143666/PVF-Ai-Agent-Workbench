# Quest Type / Condition 字段字典

状态：默认可用

用途：解释 `n_quest/quest.lst -> .qst` 注册任务里的任务类型、条件、链路和限制字段。本文只记录主目标 PVF 静态只读结论；未注册 `.qst` 和辅助对照只能作风险提示。

## 总规则

- 任务入口以 `n_quest/quest.lst` 为准；注册表没有挂到的 `.qst` 不能默认当作可接任务。
- `[type]` 决定 `[int data]` 的解释域；不能把 `[int data]` 裸数字直接猜成物品、NPC、怪物或副本。
- `[sub type]` 只在同一个 `[type]` 下解释；不同 `[type]` 下相同数字不共享语义。
- 静态只读只能证明文件写了条件、引用和候选目标；不能证明任务可接、可完成、UI 正常、服务端放行或计数器实机生效。

## 入口字段

| 字段 | 静态含义 | registry / 上下文 | 边界 |
| --- | --- | --- | --- |
| `n_quest/quest.lst` | 任务 ID 到 `.qst` 的注册入口 | `n_quest/quest.lst` | 主目标注册 2157 条，全部存在对应 `.qst`，无缺失、无重复。 |
| `.qst` 未注册文件 | 任务目录里的非注册文件 | `n_quest/**/*.qst` | 主目标另有 1822 个未注册 `.qst`，只能作为风险桶，不默认可用。 |
| `[grade]` | 任务大类标记 | 字符串枚举 | 主目标注册任务出现 9 类：`[epic]`、`[achievement]`、`[common unique]`、`[title]`、`[daily]`、`[training]`、`[normaly repeat]`、`[special daily]`、空值。 |
| `[type]` | 任务条件类型 | 见 type 矩阵 | 主目标注册任务出现 17 类；1 个注册样本缺 `[type]`，需按异常样本处理。 |
| `[sub type]` | 条件子类型 | 只在当前 `[type]` 下解释 | 主目标注册任务出现 46 个 type/subtype 组合；缺失 subtype 不是通用错误，要看 type。 |
| `[int data]` | 条件参数 | 父块由 `[type]` + `[sub type]` 决定 | 必须按矩阵解释，禁止裸数字外推。 |

## 链路与限制字段

| 字段 | 静态含义 | registry / 上下文 | 主目标观察 |
| --- | --- | --- | --- |
| `[npc index]` | 接任务/展示 NPC 候选 | `npc/npc.lst` | 正数引用全部闭合到 NPC registry。 |
| `[complete npc index]` | 完成任务 NPC 候选；`-1` 可表示非指定完成 NPC / 非 NPC 完成边界 | `npc/npc.lst` | 正数引用全部闭合到 NPC registry。 |
| `[show npc on clear]` | 清除后显示 NPC 候选 | `npc/npc.lst` | 正数引用全部闭合到 NPC registry。 |
| `[pre required quest]` | 前置任务 ID 列表 | `n_quest/quest.lst` | 大多数闭合；有少量前置 ID 不在注册表内，必须作为断链风险记录。 |
| `[level]` | 等级区间 | 数字区间 | 静态只读只能证明配置了区间，不证明服务端最终等级规则。 |
| `[job]` | 职业限制 | 字符串枚举，如 `[all]` | 不等同于职业可接取实机成功。 |
| `[grow type]` | 成长/转职限制候选 | 数字 | 需要结合职业系统理解，不能单独外推。 |
| `[target character]` | 多职业目标块 | 职业字符串 + 数值列 | 只证明该任务文件写了职业目标块。 |
| `[difficulty]` | 任务显示/要求难度标记 | 字符串，如 `B`、`D`、`F`、`W`、`Y` | 不替代 `[int data]` 里的副本难度列。 |
| `[gold multiple]` | 金币/奖励倍率候选字段 | 数字 | 不证明实机发放金额。 |
| `[quest point]` | 任务点字段 | 数字 | 不证明任务点 UI 或服务端发放。 |
| `[event]` | 活动标记 | 数字 | 不证明活动开关、服务器时间或可接取状态。 |
| `[cant giveup]` | 放弃限制标记 | 数字 | 静态只读不证明 UI 放弃按钮最终行为。 |
| `[check count]` | 称号簿/累计类计数阈值 | 当前任务上下文 | 常见于 `[use item]`、`[disjoint item]` 等称号任务。 |
| `[limit showing msg]` | 计数提示显示阈值 | 当前任务上下文 | 只证明提示阈值配置。 |
| `[condition data]` | 条件 UI 文本格式 | 文本格式参数 | 不证明客户端文本一定正常显示。 |

## 奖励与任务掉落字段

| 字段 | 静态含义 | registry / 上下文 | 边界 |
| --- | --- | --- | --- |
| `[reward type]` | 奖励类型 | 见奖励边界账本 | 固定奖励、称号、转职/成长等奖励类型已在奖励/掉落/门票边界封存；不要在本文重写奖励系统。 |
| `[reward int data]` | 固定奖励参数 | 由 `[reward type]` 决定 | 不能一律按物品 ID/数量对解释。 |
| `[reward selection int data]` | 可选奖励参数 | 由奖励字段上下文决定 | 静态只读不证明 UI 选择和发放成功。 |
| `[monster reward item]` | 接任务后的任务物品掉落候选 | 7 列一组：怪物/目标 ID、副本 ID、难度、物品 ID、数量、概率候选、限制候选 | 静态只读只能证明任务内候选掉落配置，不证明实机掉率、生效条件或服务端放行。 |

## 任务类型总表

| 注册 `[type]` | 主目标注册数量 | 默认解释入口 |
| --- | ---: | --- |
| `[seeking]` | 761 | `[int data]` 物品 ID/数量对；任务物品可闭合到物品 registry。 |
| `[condition under clear]` | 433 | 第一列是副本 ID；`[sub type]` 决定通关条件。 |
| `[meet npc]` | 324 | `[int data]` 为 NPC ID。 |
| `[hunt monster]` | 281 | 4 列一组：副本、难度、怪物、数量。 |
| `[hunt enemy]` | 250 | 5 列一组：副本、难度、enemy 目标、数量/控制列。enemy 目标可落到 monster / aicharacter / passiveobject。 |
| `[clear quest]` | 37 | `[int data]` 为任务 ID。 |
| `[clear map]` | 29 | `[int data]` 为 map ID。 |
| `[use item]` | 14 | 称号簿/累计使用类；物品 ID 可闭合到物品 registry。 |
| `[custom quest]` | 10 | 自定义/称号条件；只能按样本和条件文本解释。 |
| `[equipped item]` | 5 | 穿戴条件；列按装备部位/稀有度/阈值样式出现。 |
| `[amplify item]` | 3 | 增幅类称号条件；静态不证明增幅动作计数生效。 |
| `[get score]` | 3 | 得分/伤害类称号条件；需看条件文本。 |
| `[check time]` | 2 | 在线/停留计时类称号条件。 |
| `[disjoint item]` | 2 | 分解装备获得物品/累计次数类条件。 |
| `[pvp rank]` | 1 | PVP 段位/等级条件；静态不证明 PVP 规则。 |
| `[seek n meet npc]` | 1 | 物品收集 + NPC 完成组合。 |
| 空 `[type]` | 1 | 异常样本，不能作为可用任务类型。 |

## 未注册风险桶

主目标未注册 `.qst` 中还出现 `[mobile]`、`[powerwar point]`、`[powerwar win]`、`[pvp match]` 等类型。它们没有进入主目标 `n_quest/quest.lst` 注册链路；Workbench 只能记录为“文件存在但不可默认路由”的风险，不得写成主目标注册任务事实。

