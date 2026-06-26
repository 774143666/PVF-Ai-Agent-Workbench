# PVP Mission / MSN 字段字典

状态：默认可用

用途：解释 `pvp_mission/mission.lst -> .msn` 注册任务里的字段、上下文和静态边界。本文不覆盖 `n_quest/quest.lst` 的 Quest 字段，也不证明实机 PVP 规则。

## 总规则

- 正式入口以 `pvp_mission/mission.lst` 为准；未进入该 registry 的 `.msn` 不得默认当作可达任务。
- `.msn` 内的数字要按父字段解释，不能把裸数字猜成物品、技能、任务或频道。
- `[condition]` 是 PVP Mission 的条件父块；块内首个反引号字符串决定条件类型，后续数字列只在当前条件类型里解释。
- `[reward item]` 可以独立出现，也可以嵌套在 `[condition]` 的 `[job]` 块里；必须按 item registry 闭合，不得直接按数字外形猜。
- 静态只读只能确认字段、引用和列形存在，不能确认实机匹配、计数、扣发奖、UI 或服务端行为。

## 注册与基础字段

| 字段 | 静态含义 | 主目标观察 | 边界 |
| --- | --- | --- | --- |
| `pvp_mission/mission.lst` | PVP Mission ID 到 `.msn` 的注册入口 | 注册 108 条，唯一注册路径 108 个，全部存在 | 不等同于 `n_quest/quest.lst` |
| 未注册 `.msn` | 目录中存在但未挂入 registry 的任务文件 | 18 个 | 只能作为风险桶，不能默认可达 |
| `[kind]` | PVP Mission 的任务种类编号 | 注册样本出现 27 种 kind | 只在 PVP Mission 上下文解释 |
| `[grade]` | 任务分组 | `[normal]` 64、`[repeatable]` 26、`[rank up]` 10、`[daily]` 8 | 不证明每日刷新、循环次数或晋级实机成功 |
| `[rank range]` | 段位/等级范围候选 | 108 条均出现 | 不证明服务端段位规则只看该字段 |
| `[rate range]` | 另一组 PVP 范围候选 | 104 条出现 | 缺失不等于文件无效；需看样本 |
| `[prev mission]` | 前置 PVP Mission ID | 正数引用 59 次，全部闭合到 registry | `-1` 不是缺失 |
| `[next mission]` | 后续 PVP Mission ID | 正数引用 57 次，其中 55 次闭合 | 132、136 未进入 registry，属断链风险 |
| `[name_text]` | 名称文本引用 | 108 条均出现 | 文本存在不证明 UI 一定正常 |
| `[cond_text]` | 条件文本引用 | 108 条均出现 | 条件文本不能替代条件列解释 |
| `[difficulty_ratio]` | 难度/权重候选 | 21 条出现 | 辅助对照存在数值尺度差异，不能覆盖主目标 |

## 条件字段

| 条件类型 | 主目标注册数 | 常见含义入口 | 边界 |
| --- | ---: | --- | --- |
| `[join]` | 22 | 累计参赛场次 | 不证明实机场次计数增长 |
| `[winning count]` | 22 | 累计胜场 | 不证明胜负判定或计数器生效 |
| `[kill count]` | 11 | 累计击杀数 | 不证明击杀归属规则 |
| `[hereafter join]` | 8 | 接取后/之后参赛场次 | “之后”语义需实机确认 |
| `[hereafter winning count]` | 8 | 接取后/之后胜场 | 不证明接取时间点计数归零 |
| `[winning streak]` | 6 | 连胜 | 不证明断连胜规则 |
| `[remainS HP]` | 5 | 剩余 HP 且胜利类条件，配合偷学技能任务 | 不证明 HP 判定或偷学技能发放 |
| `[combo clear]` | 4 | 练习模式连击清单 | 内含 `[job]` 与奖励块，不能按普通 3 列条件处理 |
| `[hereafter kill count]` | 4 | 接取后/之后击杀 | 不证明击杀计数器实机增长 |
| `[kill]` | 4 | 单场击杀类条件 | 不证明一局内结算规则 |
| `[move_channel_total]` | 4 | 累计/总频道移动类 | 不证明频道入口可用 |
| `[move_channel]` | 3 | 频道移动类 | 不证明移动后任务自动完成 |
| `[revenge]` | 3 | 复仇类条件 | 不证明复仇关系判定 |
| `[within]` | 3 | 晋级/范围内条件 | 不证明晋级成功或段位结算 |
| `[remain HP]` | 1 | 剩余 HP 条件 | 不证明 HP 阈值实机一致 |

## 奖励与职业字段

| 字段 | 主目标观察 | registry / 上下文 | 边界 |
| --- | --- | --- | --- |
| `[reward item]` | 87 条注册任务出现；展开后 157 个物品奖励引用，全部闭合 | item registry；具体物品字段引用 Equipment / Stackable 已封存入口 | 不证明发奖成功、背包空间、绑定状态或 UI |
| `[reward skill]` | 4 条出现，代表样本标签体为空 | PVP Mission 奖励标签 | 只能证明标签存在，不能写具体技能 ID |
| `[reward sp]` | 3 条出现，代表样本标签体为空 | PVP Mission 奖励标签 | 只能证明标签存在，不能写具体 SP 数值 |
| `[target character]` | 5 条出现 | 职业字符串，如 `[swordman]` | 只说明任务写了目标职业 |
| `[stealing skill]` | 5 条出现，配合 `[target character]` 和 `[remainS HP]` | 偷学/拷贝技能任务标签 | 不证明偷学技能在实机解锁 |
| `[job]` | 4 条注册任务出现；只在 `[combo clear]` 条件里大量嵌套 | 职业 token + 数字列 + 嵌套 `[reward item]` | 不能按普通条件裸数字解释 |

## 与 Quest 的关系

| 关系 | 结论 |
| --- | --- |
| PVP Mission registry | `pvp_mission/mission.lst` 是独立主线入口 |
| Quest registry | `n_quest/quest.lst` 覆盖普通 Quest 主线 |
| 可交叉引用的口径 | Quest 里出现的 `[pvp rank]` 或未注册 `[pvp match]` 仍按 Quest 主线处理 |
| 禁止做法 | 不把 `.msn` 当 `.qst`，不把 `quest.lst` ID 当 PVP Mission ID，也不把 `mission.lst` ID 当 Quest ID |

## 静态与动态边界

静态只读可以确认：

- 哪些 PVP Mission ID 注册到 `.msn`。
- 注册 `.msn` 出现哪些字段、条件类型和列形。
- 奖励物品 ID 是否能按 item registry 闭合。
- 哪些 `prev mission` / `next mission` 断链或指向未注册文件。

静态只读不能确认：

- 实机任务是否可见、可接、可完成或自动续接。
- PVP 参赛、胜场、击杀、连胜、复仇、HP、频道、晋级、练习模式连击等计数器是否增长。
- 奖励物品、技能、SP、偷学技能是否发放成功。
- PVP 最终规则、匹配规则、段位规则、服务端放行或客户端 UI/文本资源完整。
