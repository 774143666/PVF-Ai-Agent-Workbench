# PVP Mission / mission.lst / MSN Boundary

状态：默认可用

用途：记录 PVP Mission 窄主线的注册链、`.msn` 结构、条件矩阵、奖励闭合、未注册风险、辅助差异和静态/动态边界。本文不授权写 PVF。

## 审计快照

| 项 | 主目标静态结论 |
| --- | ---: |
| `pvp_mission/mission.lst` 注册条目 | 108 |
| 唯一注册路径 | 108 |
| `pvp_mission/` 下 `.msn` 总数 | 126 |
| 注册且文件存在 | 108 |
| 注册缺失文件 | 0 |
| 注册路径重复 | 0 |
| 未注册 `.msn` | 18 |
| 已解析注册 `.msn` | 108 |
| 读取失败 | 0 |
| 条件类型 | 15 |
| grade 类型 | 4 |
| 子目录 | 4 |
| kind 类型 | 27 |
| 字段标签类型 | 16 |

处理口径：正式结论只看注册的 108 条；18 个未注册 `.msn` 只进入风险桶。

## 子目录与 grade

| 子目录 | 注册数 | grade | 主要内容 |
| --- | ---: | --- | --- |
| `general` | 71 | `[normal]`、`[rank up]` | 普通累计、偷学技能、频道移动、练习模式连击 |
| `repeatable` | 26 | `[repeatable]` | 循环 PVP 条件 |
| `daily` | 8 | `[daily]` | 每日 PVP 条件 |
| `rankup` | 3 | `[rank up]` | 晋级类条件 |

| grade | 注册数 | 边界 |
| --- | ---: | --- |
| `[normal]` | 64 | 不证明 UI 默认展示或可完成 |
| `[repeatable]` | 26 | 不证明循环次数、冷却或重置 |
| `[rank up]` | 10 | 不证明晋级成功或段位结算 |
| `[daily]` | 8 | 不证明每日刷新、服务器时间或次数重置 |

## 字段覆盖

| 字段标签 | 注册出现数 | 说明 |
| --- | ---: | --- |
| `[kind]` | 108 | 任务种类编号 |
| `[grade]` | 108 | 任务分组 |
| `[rank range]` | 108 | PVP 等级/段位范围候选 |
| `[rate range]` | 104 | PVP 范围候选；4 条未出现 |
| `[prev mission]` | 108 | 前置任务 ID；`-1` 为边界值 |
| `[next mission]` | 108 | 后续任务 ID；`-1` 为边界值 |
| `[name_text]` | 108 | 名称文本 |
| `[cond_text]` | 108 | 条件文本 |
| `[condition]` | 108 | 条件父块，全部闭合 |
| `[reward item]` | 87 | 物品奖励块，全部闭合 |
| `[difficulty_ratio]` | 21 | 难度/权重候选 |
| `[stealing skill]` | 5 | 偷学/拷贝技能标签 |
| `[target character]` | 5 | 目标职业标签 |
| `[job]` | 4 | 练习模式连击职业子块 |
| `[reward skill]` | 4 | 奖励技能标签，代表样本标签体为空 |
| `[reward sp]` | 3 | 奖励 SP 标签，代表样本标签体为空 |

闭合标签只观察到 `[/condition]` 108 次、`[/reward item]` 87 次。

## 条件矩阵

| `[condition]` | 注册数 | grade | 子目录 | kind 分布 | 条件数字列 | 奖励/特殊字段 | 静态边界 |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| `[join]` | 22 | `[normal]` | `general` | 1x11、3x11 | 3 列 | 22 条有 `[reward item]` | 累计参赛候选，不证明场次计数增长 |
| `[winning count]` | 22 | `[normal]` | `general` | 2x11、4x11 | 3 列 | 22 条有 `[reward item]` | 累计胜场候选，不证明胜负判定 |
| `[kill count]` | 11 | `[normal]` | `general` | 5x11 | 3 列 | 11 条有 `[reward item]` | 累计击杀候选，不证明击杀归属 |
| `[hereafter join]` | 8 | `[repeatable]`、`[daily]` | `repeatable`、`daily` | 8x3、13x3、18x1、23x1 | 3 列 | 6 条有 `[reward item]`，2 条有 `[difficulty_ratio]` | “之后”语义需实机确认 |
| `[hereafter winning count]` | 8 | `[repeatable]`、`[daily]` | `repeatable`、`daily` | 9x3、14x3、19x1、24x1 | 3 列 | 2 条有 `[reward item]`，6 条有 `[difficulty_ratio]` | 不证明接取后胜场计数归零 |
| `[winning streak]` | 6 | `[repeatable]`、`[daily]` | `repeatable`、`daily` | 10x5、20x1 | 3 列 | 6 条有 `[reward item]` | 不证明连胜断点规则 |
| `[remainS HP]` | 5 | `[normal]` | `general` | 6x5 | 3 列 | `[target character]` + `[stealing skill]` | 不证明 HP 判定或偷学技能解锁 |
| `[combo clear]` | 4 | `[normal]` | `general` | 31x2、32x2 | 嵌套职业列，长度 112/406 | 4 条有 `[job]` 和嵌套 `[reward item]` | 不能按普通 3 列条件解释 |
| `[hereafter kill count]` | 4 | `[repeatable]`、`[daily]` | `repeatable`、`daily` | 15x3、25x1 | 3 列 | 4 条有 `[reward item]` | 不证明接取后击杀计数增长 |
| `[kill]` | 4 | `[repeatable]` | `repeatable` | 16x4 | 3 列 | 4 条有 `[reward item]` | 不证明单局击杀结算规则 |
| `[move_channel_total]` | 4 | `[rank up]` | `general` | 30x4 | 3 列 | 4 条有 `[difficulty_ratio]`；部分带 `[reward skill]` / `[reward sp]` | 不证明频道移动触发或奖励发放 |
| `[move_channel]` | 3 | `[rank up]` | `general` | 7x3 | 3 列 | 3 条有 `[difficulty_ratio]`；部分带 `[reward skill]` / `[reward sp]` | 不证明频道入口或自动完成 |
| `[revenge]` | 3 | `[repeatable]`、`[daily]` | `repeatable`、`daily` | 12x2、22x1 | 3 列 | 3 条有 `[reward item]`，2 条有 `[difficulty_ratio]` | 不证明复仇关系判定 |
| `[within]` | 3 | `[rank up]` | `rankup` | 27x3 | 3 列 | 3 条有 `[reward item]`，3 条有 `[difficulty_ratio]` | 不证明晋级或段位结算 |
| `[remain HP]` | 1 | `[daily]` | `daily` | 21x1 | 3 列 | 1 条有 `[difficulty_ratio]` | 不证明 HP 阈值实机一致 |

## 链路与断链

| 引用 | 主目标观察 | 结论 |
| --- | ---: | --- |
| `[prev mission]` 正数引用 | 59 | 全部闭合到 `mission.lst` |
| `[next mission]` 正数引用 | 57 | 55 个闭合，2 个未闭合 |
| 未闭合 next ID | 132、136 | 对应 `.msn` 文件存在，但未进入 `mission.lst` |

断链风险：

- 注册任务 131 指向 next 132；132 文件存在，但未注册，且名称/条件文本键显示缺失。
- 注册任务 135 指向 next 136；136 文件存在，但未注册，且名称/条件文本键显示缺失。
- 因此不能把 132、136 写成注册链可达任务，除非后续找到显式调用入口。

## 奖励闭合

| 奖励类 | 主目标观察 | 边界 |
| --- | ---: | --- |
| `[reward item]` 所在注册任务 | 87 | 可作为静态物品奖励候选 |
| 展开奖励物品引用 | 157 | 全部闭合到 item registry |
| 唯一奖励物品 ID | 46 | 具体字段解释引用既有 Equipment / Stackable 主线 |
| `[reward skill]` | 4 | 标签存在，代表样本未给出具体技能 ID |
| `[reward sp]` | 3 | 标签存在，代表样本未给出具体 SP 数值 |
| `[stealing skill]` | 5 | 标签存在并配合目标职业，不能证明实机解锁 |

## 未注册 `.msn` 风险桶

主目标目录中观察到 18 个未注册 `.msn`：

- `daily/daily_mission009.msn`
- `general/general_mission132.msn`
- `general/general_mission133.msn`
- `general/general_mission136.msn`
- `general/general_mission137.msn`
- `pop/pop_mission001.msn` 到 `pop/pop_mission011.msn`
- `repeatable/repeatable_mission034.msn`
- `repeatable/repeatable_mission035.msn`

风险口径：

- 未注册文件可作为“文件存在”记录。
- 未注册文件中出现的 `[reduce HP]` 等条件不能提升为主目标注册条件。
- `pop` 子目录样本不能默认当作弹窗任务可用；需要先找到显式调用入口。

## 辅助对照提示

辅助对照的注册数、`.msn` 数、条件类型数、grade 数、子目录数、kind 数和字段标签数与主目标一致。

仅作为差异提示：

- 21 条记录存在具体内容差异。
- 差异集中在 `difficulty_ratio` 数值尺度，以及部分频道/晋级任务的文本引用。
- 例如主目标循环/每日/晋级类任务里可见 `difficulty_ratio` 为 1、2、4；辅助对照对应样本可见 100、200、400。
- 这些差异不能覆盖主目标结论，只能提醒后续跨版本验证时注意数值尺度。

## 与 Quest 主线的边界

| 项 | 处理 |
| --- | --- |
| `pvp_mission/mission.lst` | 本主线负责 |
| `n_quest/quest.lst` 中的 `[pvp rank]` | Quest 主线负责 |
| 未注册 Quest 中的 `[pvp match]` | Quest 未注册风险桶负责 |
| `.msn` 与 `.qst` | 不互相替代，不共享裸数字语义 |

## 静态与动态边界

静态只读能证明：

- `mission.lst` 注册链是否完整。
- `.msn` 字段、条件类型、闭合标签和列形是否存在。
- 奖励物品 ID 是否能闭合到 item registry。
- 哪些未注册文件和断链 ID 需要作为风险记录。

静态只读不能证明：

- PVP 任务在实机 UI 中可见、可接、可完成或可自动续接。
- 参赛、胜场、击杀、连胜、复仇、HP、频道移动、晋级和练习模式连击计数器实机增长。
- 奖励物品、技能、SP、偷学技能实机发放成功。
- PVP 最终规则、匹配、段位、结算、服务器放行或客户端资源完整。

## 最小实机验收建议

1. 注册 `[join]`：打完指定模式后观察任务计数是否增长。
2. 注册 `[winning count]`：胜利后观察任务计数和完成状态。
3. 注册 `[kill count]` 或 `[kill]`：验证击杀数归属和单局/累计差异。
4. 注册 `[move_channel]` / `[move_channel_total]`：移动频道后确认是否触发。
5. 注册 `[reward item]`：完成后核对背包和奖励提示。
6. 不测试未注册 `.msn` 的可接取性，除非先找到显式调用入口。
