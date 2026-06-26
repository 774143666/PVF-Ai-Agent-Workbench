# Skill Learnability / Tree / Command / Cooldown Completion Audit

状态：默认可用

用途：作为本主线封存验收入口。本文只证明主目标 PVF 的静态只读知识主线已经覆盖到可日常引用状态；不授权写 PVF，不证明实机 UI、服务端、PVP、装备叠加、失败释放回滚、命中、伤害、同步或客户端资源完整性。

## 封存结论

Skill Learnability / Skill Tree / Command / Cooldown Boundary 主线已按高覆盖模式桶完成静态只读封存。

日常问题先读：

1. `dictionaries/skill-learnability-command-cooldown-fields.zh-CN.md`
2. `indexes/skill-learnability-tree-command-cooldown-boundary.zh-CN.md`
3. `indexes/skill-tree-default-pvp-entry-boundary.zh-CN.md`
4. `indexes/skill-learnability-cost-sp-tp-ui-boundary.zh-CN.md`
5. `task-cards/skill-learnability-tree-command-cooldown-readonly-audit.zh-CN.md`

## 范围验收

| 目标问题 | 覆盖入口 | 验收结论 |
| --- | --- | --- |
| 技能 ID 从哪里来 | `skill/skilllist.lst`、职业 skill registry、数字碰撞规则。 | 已覆盖。任何技能 ID 必须先确定职业 registry，不能靠数字外形猜。 |
| `.skl` 存在之后如何判断能否学 | `.skl` 学习字段：`[purchase cost]`、`[required level]`、`[required level range]`、`[skill class]`、`[maximum level]`、`[growtype maximum level]`、`[skill fitness growtype]`。 | 已覆盖。字段说明静态学习形状，不证明默认学会或服务端放行。 |
| 技能如何显示在技能树 | `clientonly/skilltree/*_sp.co` / `*_tp.co` 的 `[character job]`、`[skill info]`、`[index]`、`[icon pos]`、`[next skill]`。 | 已覆盖。技能树是显示和前置链线索，不替代 `.skl`。 |
| 默认技能从哪里看 | `character/**/*.chr` 的基础 `[skill]`、growtype `[skill]`、`[awakening skill]`，以及 AutoSkill 入口。 | 已覆盖。默认技能和技能树显示是并行入口。 |
| PVP 是否另有入口 | `etc/pvpskilltree/*.etc` 的 `[level]`、`[job index]`、`[grow type index]`、`[skill]`、`[static basic skill]`。 | 已覆盖。PVP 表不能覆盖普通 SP/TP 规则。 |
| 命令/快捷键从哪里来 | `.skl [command]` 与 `[command key explain]`。 | 已覆盖。说明文本不能替代命令 token。 |
| 可释放状态从哪里看 | `.skl [executable states]`。 | 已覆盖。它只是一层静态线索，不证明强制、柔化或脚本最终放行。 |
| 冷却/消耗/施放时间从哪里来 | `.skl [cool time]`、`[start cool time]`、`[auto cooltime apply]`、`[consume MP]`、`[casting time]`、`[consume item]`。 | 已覆盖。静态字段不证明最终 UI 或服务端结果。 |
| TP/EX 学习点数和前置从哪里来 | 强化 `.skl [special purchase cost]` 与 `[pre required skill]`。 | 已覆盖。不能从 TP 树图标位置推断扣点。 |
| 装备技能等级加成是否属于学习来源 | 装备侧 `[skill levelup]` 三列组；`[skill data up]` 与装备冷却效果另行分层。 | 已覆盖。装备加技能等级不是学习来源。 |
| 辅助对照如何使用 | 仅记录目录规模、字段命中规模和自定义入口差异提示。 | 已覆盖。辅助对照不能提升为主目标事实。 |

## 代表样本验收

| 样本 | 已验证用途 | 不能外推为 |
| --- | --- | --- |
| ATMage / IceRoad / ID 7 | 验证普通 `.skl` 学习字段、命令、冷却、SP 显示、TP/EX 入口、PVP 表和默认技能边界。 | 不能证明运行时命中、伤害、移动冰雾、减速、PVP 最终规则或资源完整。 |
| ATMage / IceRoadEx / ID 217 | 验证 TP/EX `[special purchase cost]` 与 `[pre required skill]` 在强化 `.skl` 中。 | 不能证明 TP UI 最终扣点或前置不足时的服务端提示。 |
| Priest / ReleaseBuffs / ID 222 | 验证自定义技能的 registry、`.skl` 学习字段、命令、冷却和 SP 可见入口；同时验证跨职业数字碰撞。 | 不能证明一键 buff 运行成功、默认已学或辅助 PVF 也有该自定义入口。 |
| 装备 `[skill levelup]` 样本 | 验证装备侧三列组：职业 token、技能 ID、等级变化量。 | 不能证明技能学习、技能树显示或最终面板等级。 |
| 装备 `[cooltime]` / `[skill cooltime reset]` 样本 | 验证装备冷却触发层与 `.skl [cool time]` 分层。 | 不能证明最终冷却、叠加、失败释放或 PVP 表现。 |

## 默认处理动作

| 用户问题 | 默认动作 |
| --- | --- |
| “这个技能为什么学不了/几级学/花多少点” | 先按职业 registry 解析技能 ID，再读目标 `.skl` 学习字段；如是 TP/EX，读强化 `.skl` 的特殊购买和前置字段。 |
| “技能树有没有这个技能” | 读对应 SP/TP 技能树，只回答显示入口、图标坐标和 `[next skill]` 线索。 |
| “默认有没有学会” | 读对应 `.chr` 和 AutoSkill；不把技能树可见写成默认已学。 |
| “PVP 是否可用/等级是多少” | 读 PVP 技能树和 `.skl [pvp]` 分段；不把普通技能树结论迁移到 PVP。 |
| “命令、快捷键、可释放状态、冷却从哪里来” | 读 `.skl [command]`、`[command key explain]`、`[executable states]`、冷却/消耗/施放字段；保留实机风险。 |
| “装备加技能等级/改冷却是不是等于学会” | 走装备 `[skill levelup]`、`[skill data up]`、装备触发字段；明确不是学习来源。 |

## 不要继续扩样本的情况

- 用户只是问本主线覆盖的普通字段含义、入口层级、测试口径。
- 问题可以通过当前四个入口文档和审计卡回答。
- 只是看到辅助对照目录更多或字段命中更多。
- 只是想确认 Skill / State / NUT Runtime Boundary 的旧 runtime 结论。

## 允许补最小样本的情况

- 目标技能不在当前代表样本内，且用户需要精确职业 registry、`.skl`、SP/TP/PVP/`.chr`/AutoSkill 的并列确认。
- 遇到当前字典未收录的新字段或同名字段出现在不同父块。
- 遇到装备、avatar、套装、任务或服务端入口与技能学习字段混合的问题。
- 需要证明辅助对照差异是否也存在于主目标。

## 必须实机测试的问题

- UI 实际扣点、点数不足提示、前置不足提示、可点等级上限。
- 命令输入、快捷栏释放、失败释放回滚、冷却开始/结束时机。
- 装备技能等级加成后的面板、卸装回退、冷却叠加、PVP 修正。
- 默认技能在建号、转职、觉醒、外部服务端状态中的最终表现。
- 命中、伤害、卡肉、击退、浮空、追踪、销毁时序、同步和客户端资源完整性。

## 封存边界

- 本主线是静态只读封存，不是运行封存。
- 本主线不重开 Skill / State / NUT Runtime Boundary。
- 本主线不做全技能穷举；后续只按明确问题补最小样本。
- 本主线不授权写 PVF；写 PVF 必须另走生产生命周期和实验流程。
