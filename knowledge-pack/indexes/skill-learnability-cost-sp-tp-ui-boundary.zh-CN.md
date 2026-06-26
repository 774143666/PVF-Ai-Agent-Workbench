# Skill Learnability Cost / SP-TP / UI Boundary

状态：默认可用

用途：回答“学习等级、普通学习消耗、TP/EX 强化消耗、前置技能条件、装备技能等级加成和冷却效果分别从哪里查”。本文只覆盖静态只读边界，不证明 UI 最终扣点、服务端放行、PVP 修正、装备叠加、失败释放回滚或实际战斗效果。

## 本桶主目标确认

| 桶 | 主目标只读结果 | 当前结论 |
| --- | --- | --- |
| 普通 `.skl` 学习消耗 | `IceRoad.skl` 可见 `[purchase cost] 30`、`[required level] 25`、`[required level range] 2`、`[maximum level] 70`、growtype 上限和适配字段。 | 普通学习等级和购买消耗先回 `.skl` 查。 |
| 自定义主动技能学习消耗 | `ReleaseBuffs.skl` 可见 `[purchase cost] 0`、`[required level] 1`、`[required level range] 3`、`[maximum level] 50`、growtype 上限和适配字段。 | 自定义技能同样不能只看技能树图标判断是否可学。 |
| TP/EX 强化消耗 | `IceRoadEx.skl` 可见 `[special purchase cost] 2`、`[pre required skill] 7 10`、`[required level] 55`、`[required level range] 5`、`[maximum level] 10`。 | TP/EX 点数和前置技能条件在强化技能 `.skl` 中验证，不在 TP 树图标列表中验证。 |
| 技能树字段缺失 | 主目标 21 个 `clientonly/skilltree/*_sp.co` / `*_tp.co` 中，限定搜索未命中 `[purchase cost]`、`[special purchase cost]`、`[required level]`、`[maximum level]`、`[skill class]`、`[pre required skill]`、`[required skill]`。 | 技能树文件承载显示、图标坐标和前置链线索，不承载学习费用或等级上限字段。 |
| 技能树前置链 | 同一批技能树文件中 `[next skill]` 命中在多个 SP 文件中；代表样本有 `IceRoad(7) -> IceChakram(48)`。 | `[next skill]` 是技能树显示前置链线索，不等于 `.skl [pre required skill]`。 |
| 装备技能等级加成 | `[skill levelup]` 全 PVF 命中 3884；样本为职业 token、技能 ID、等级变化量三列一组。 | 装备侧 `[skill levelup]` 是等级加成，不是技能学习消耗或最终技能等级。 |
| 装备冷却效果 | 装备样本中可见条件块 `[cooltime]` 与 `[skill cooltime reset]`。 | 这是装备效果/触发层，不等于 `.skl [cool time]`，也不是学习点数来源。 |
| 关键字段规模 | 全 PVF 搜索 `[special purchase cost]` 命中 554；`[pre required skill]` 命中 960。 | 两者是高频静态线索，但解释时仍要回到当前职业 registry 和具体 `.skl`。 |

## 字段分层

| 字段或入口 | 当前可用含义 | 不要写成 |
| --- | --- | --- |
| `[purchase cost]` | 普通技能 `.skl` 的学习购买消耗线索。 | 不要单独写成 UI 最终 SP 扣点或服务端通过。 |
| `[special purchase cost]` | TP/EX/强化类 `.skl` 的特殊购买消耗线索。 | 不要和普通 `[purchase cost]` 混写，也不要从 TP 树图标位置推断。 |
| `[pre required skill]` | `.skl` 内的前置技能线索；代表样本为同职业基础技能 ID 与需求等级。 | 不要和技能树 `[next skill]` 或装备 `[required skill]` 混写。 |
| `[required level]` | `.skl` 的学习等级门槛线索。 | 不要写成技能树一定显示或角色默认获得。 |
| `[required level range]` | `.skl` 中与等级门槛相邻的范围/步进线索。 | 不要写成最终 UI 升级步进规则；需实机或同族专项验证。 |
| `[maximum level]` | `.skl` 基础等级上限。 | 不要写成角色实际可点上限；还要看 growtype、树、PVP、服务端。 |
| `[growtype maximum level]` | `.skl` 按 growtype 列出的等级上限形状。 | 不要脱离当前职业/growtype 上下文解释列位。 |
| `[skill fitness growtype]` | `.skl` 的 growtype 适配线索。 | 不要写成自动获得或默认学习。 |
| `[next skill]` | SP 技能树中的显示前置链线索。 | 不要写成学习扣点或 `.skl` 前置技能条件。 |
| `[skill levelup]` | 装备、套装或 avatar/aura 等上下文中的技能等级变化块。 | 不要写成技能学习来源、技能树显示或最终技能等级。 |
| `[cooltime]` / `[skill cooltime reset]` | 装备效果、条件或触发层冷却线索。 | 不要写成 `.skl [cool time]` 或学习冷却字段。 |

## 代表技能矩阵

| 技能 | 普通消耗/等级 | TP/EX 消耗/前置 | 技能树显示 | 验证边界 |
| --- | --- | --- | --- | --- |
| ATMage `IceRoad(7)` | `IceRoad.skl`：`[purchase cost] 30`、`[required level] 25`、`[required level range] 2`、`[maximum level] 70`。 | `IceRoadEx(217)`：`[special purchase cost] 2`、`[pre required skill] 7 10`、`[required level] 55`、`[maximum level] 10`。 | SP 树 glacialmaster 分支有 `index 7`、`next skill 48`；TP 树 glacialmaster 分支有 `index 217`。 | 普通技能和 EX 技能要分别按 registry 读 `.skl`；树只证明显示入口。 |
| Priest `ReleaseBuffs(222)` | `ReleaseBuffs.skl`：`[purchase cost] 0`、`[required level] 1`、`[required level range] 3`、`[maximum level] 50`。 | 本桶未观察到对应 TP/EX 强化入口。 | SP 树 crusader 分支有 `index 222` 与 `icon pos 0 67`。 | 自定义 SP 可见不等于默认学会，也不等于服务端会执行全部 buff。 |
| 装备 `skill levelup` 样本 | 不属于技能学习字段。 | 不属于 TP/EX 学习字段。 | 不属于技能树入口。 | 三列一组：职业 token、技能 ID、等级变化量；必须按外层装备/套装上下文解释。 |

## UI 和实机测试口径

| 问题 | 只读应先查 | 实机要测 |
| --- | --- | --- |
| 技能几级可学 | `.skl [required level]` 与 `[required level range]`。 | 技能树 UI 是否按该等级显示/解锁。 |
| 普通学习扣多少点 | `.skl [purchase cost]`。 | UI 实际扣点、服务端是否允许学习、点数不足时提示。 |
| TP/EX 扣多少点 | EX/TP `.skl [special purchase cost]`。 | TP UI 实际扣点、前置技能等级不足时提示。 |
| 需要哪个前置技能 | `.skl [pre required skill]` 和 SP 树 `[next skill]` 分开查。 | UI 前置线、前置等级门槛和服务端校验是否一致。 |
| 技能最高能点几级 | `.skl [maximum level]` 与 `[growtype maximum level]`。 | 实际角色/growtype 可点上限和 PVP 修正规则。 |
| 装备加了多少技能等级 | 装备侧 `[skill levelup]` 三列组并按职业 registry 解析技能 ID。 | 穿戴后面板等级、技能树等级、卸装回退。 |
| 装备改冷却或重置冷却 | 装备效果块、`[skill data up]`、`[cooltime]`、`[skill cooltime reset]` 分开查。 | 释放成功、失败释放、PVP、装备叠加后的实际冷却。 |

## 辅助对照差异提示

辅助对照只提示差异，不提升为主目标事实：

- SP/TP 技能树目录为 25 个文件，比主目标多 AT priest 与 AT swordman 入口。
- 辅助对照 25 个技能树文件中，同样未命中 `[purchase cost]`、`[special purchase cost]`、`[pre required skill]`。
- 辅助对照全 PVF `[special purchase cost]` 命中 749，高于主目标的 554，提示技能规模和职业覆盖不同。

## 验收口径

- 查学习点数时，不要只看技能树；必须回 `.skl`。
- 查 TP/EX 点数时，不要把基础技能 ID 当强化技能 ID；必须按同职业 registry 解析 EX/TP `.skl`。
- 查装备加技能等级时，不要把 `[skill levelup]` 当成学习来源。
- 查冷却时，区分 `.skl [cool time]`、装备 `[cooltime]` / `[skill cooltime reset]`、`[skill data up] [cooltime]` 和旧 Runtime API 样本。
- 所有 UI 扣点、服务端放行、PVP 修正、装备叠加和失败回滚都必须实机测试。
