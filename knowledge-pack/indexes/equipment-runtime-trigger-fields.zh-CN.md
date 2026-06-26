# Equipment 运行时触发字段索引

## 用途

本索引用于只读判断 equipment `.equ` 中的事件条件、职业或技能过滤、范围属性变化、召唤、技能运行时修改、解除与状态转换字段。以下结论来自目标 PVF 的实际列形；默认状态均为 `需验证`，不授权直接写 PVF。

## 事件与过滤条件

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[cooltime group]` | 单整数 | 位于 `[if]`，是冷却分组标识；目标无闭合标签。相同编号可能共享运行时冷却，但共享范围和重置规则仍需实机确认。 |
| `[party death]` | 单值 `1` | 位于 `[if]`，表示队友死亡事件；不是自身死亡。 |
| `[target death]` | 单值 `1` | 位于 `[if]`，表示当前攻击目标死亡事件；应与攻击条件和 appendage 条件一起读取。 |
| `[event hit]` | 单值 `1` | 位于 `[if]` 的事件型受击条件；不要与普通 `[hit]` 互换。 |
| `[revive]` | 单值 `1` | 位于 `[if]`，目标说明对应使用复活币后的复活事件。 |
| `[overkill]` | 单值 `1` | 位于 `[if]`，表示额外杀伤或过量击杀条件。 |
| `[disable pvp]` | 单值 `1` | 位于 `[if]`，使该触发在 PVP 语境禁用；不要当成根级装备交易限制。 |
| `[is awakening state]` | 无值标记 | 位于 `[if]`，检查角色是否处于觉醒变身或觉醒状态；目标无闭合标签。 |
| `[remove equip]` | 无值标记 | 位于 `[if]`，表示解除或移除装备事件；目标无闭合标签。 |
| `[attack type]` | `physical` 或 `magical` | 位于 `[if]`，限制攻击类型；不要与武器的物理、魔法攻击属性字段混用。 |
| `[distance]` | `near` 或 `far` | 位于 `[if]`，限制近距离或远距离攻击条件；距离阈值未由静态文件给出。 |
| `[character]` | 一个或多个职业 token | 位于 `[if]`，按职业过滤后续效果。职业 token 不是 character registry 数字 ID。 |
| `[keep my state]` | 动作状态 token、持续时间 | 位于 `[if]`，检查自身保持某动作状态达到指定时间；目标时间按毫秒语境读取，存在 `0 0` 兼容形态。 |
| `[my prev state]` | 动作状态 token | 位于 `[if]`，检查自身前一个动作状态；常与 `[set my state]`、`[my appendage]` 配合。 |
| `[check damage]` | `%`、阈值 | 位于 `[if]`，检查单次受击造成的 HP 百分比损失阈值。 |
| `[skill cooltime]` | 比较符、毫秒阈值 | 位于 `[if]`，用于限制技能剩余冷却范围；目标可见原始比较符 `=<`，必须原样保留。 |

以上事件标记均需继续读取同一 `[if]` 的其他条件和对应 `[then]`，不能脱离父块单独解释。

## 技能运行时字段

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[skill super armor]` | 职业 token、技能 ID | 位于 `[then]`，使指定技能的施放动作进入霸体。技能 ID 必须按职业 token 选择 skill registry；目标无闭合标签。 |
| `[skill duration]` | 技能或状态 ID、属性 token、值 | 位于 `[then]`；目标属性 token 可见 `[cooltime]`、`[level]`。首列必须结合相邻 `[event use skill]`、职业和装备上下文解释，不能脱离上下文跨 registry 借义。 |
| `[add skill summon]` | 技能 ID、追加数量、时间参数 | 位于 `[then]` 的闭合块；目标常见追加数量为 `1`，第三列可见 `-1` 或毫秒值。技能 ID 由相邻职业技能触发选择 registry，必须读取 `[/add skill summon]`。 |
| `[all skill item container]` | 嵌套 `[all skill item]` | 根级闭合容器；内部继续读取职业、技能等级上下限、变化值、额外条件和技能阶段，并以 `[/all skill item container]` 结束。 |

`[skill super armor]`、`[skill duration]` 和 `[add skill summon]` 都不是普通属性加成。它们依赖技能运行时，除 registry 解析外仍需游戏内验证施放动作、持续、刷新和 PVP 行为。

## 范围属性与状态转换

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[change status in range]` | HP/MP token、参考值、步长 | 位于 `[if]`，按资源值变化区间驱动后续效果；目标无闭合标签。三列的精确方向需与同一分支的说明和 `[apply status in range]` 配对判断。 |
| `[apply status in range]` | 属性 token、运算符、每步变化值、上限 | 位于 `[then]`，根据前述区间条件逐步修改属性并限制最大值；目标无闭合标签。运算符和属性名必须原样保留。 |
| `[swap stat]` | 来源属性、运算符、来源变化值、目标属性、换算值 | 位于 `[then]`。目标样本表示消耗 MP 并换算为 HP；精确换算和上限仍需实机确认。 |

## 召唤、发言与效果动作

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[speech on]` | 模式整数、显示时间、一个或多个文本 token | 位于 `[then]` 或套装效果中，必须读取 `[/speech on]`。目标存在多文本 token 形态，不能只取第一段文本。首整数的精确模式语义未定性。 |
| `[summon apc]` | APC ID、等级、数量 | 位于 `[then]`，目标为三个整数且无自身闭合标签；持续时间由同分支 `[duration]` 提供。首列必须走 `aicharacter/aicharacter.lst`。 |
| `[disenchant]` | 单值 `1` | 位于 `[then]`，目标说明对应驱散效果，不是装备分解。作用目标、概率和 PVP 修正由同一分支决定。 |
| `[target check]` | 重复的“对象类型 token、对象 ID” | 位于 `[if]` 的闭合块。类型为 `monster` 时，数字必须走 `monster/monster.lst`；必须读取 `[/target check]`。 |

## ID 路由

- `[summon apc]` 首列：`aicharacter/aicharacter.lst`。
- `[skill super armor]`、`[add skill summon]`：按紧邻职业 token 或技能触发上下文选择对应 skill registry。
- `[skill duration]`：先判断首列是职业技能 ID 还是运行时状态号；只有职业语境明确时才走对应 skill registry。
- `[target check]`：由每个类型 token 决定 registry；`monster` 走 monster registry。

## 最低验证清单

1. 先定位完整 `[if]` / `[then]`，再解释单个条件或动作。
2. 所有技能 ID 按职业路由；没有职业上下文时不强行解析。
3. 所有 APC、怪物 ID 通过对应 registry 解析。
4. 关闭标签只按目标实际结构处理；不得为无闭合字段补造结束标签。
5. 冷却、持续、区间换算和 PVP 行为仍需游戏内验证。
