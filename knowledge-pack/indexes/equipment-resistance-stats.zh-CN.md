# Equipment 抗性与补充属性索引

## 用途

本索引用于只读判断 equipment `.equ` 中异常状态抗性、补充暴击、防御修正、宠物攻击、恢复和特殊产出加成字段。它只记录目标 PVF 可观察到的结构边界，不授权直接写 PVF。

## 总规则

- 以下字段默认状态均为 `需验证`。
- 单数值形态只证明目标文件中的列形，不自动证明显示单位、上限、叠加公式或实际战斗效果。
- 字段位于 `[set ability]`、`[piece set ability]`、`[if]`、`[then]`、`[pvp]` 等块内时，必须连同父级一起解释。
- 负数是目标样本中可存在的原始值，不要擅自改成正数。
- 仅出现于样例文件或单一样本的字段，只能作为存在性和列形线索，不能当作稳定生产模板。

## 异常状态抗性

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[all activestatus resistance]` | 单数值 | 全异常状态抗性数值线索；可位于根级或 `[set ability]`。具体覆盖哪些状态、数值单位和上限需实机确认。 |
| `[freeze resistance]` | 单数值 | 冰冻异常状态抗性线索。不要与 `[water resistance]` 属性抗性混用。 |
| `[bleeding resistance]` | 单数值 | 出血异常状态抗性线索。 |
| `[poison resistance]` | 单数值 | 中毒异常状态抗性线索。 |
| `[stun resistance]` | 单数值 | 眩晕异常状态抗性线索。 |
| `[confuse resistance]` | 单数值 | 混乱异常状态抗性线索。 |
| `[lightning resistance]` | 单数值 | 感电异常状态抗性线索。不要与 `[light resistance]` 属性抗性混用。 |
| `[curse resistance]` | 单数值 | 诅咒异常状态抗性线索；目标样本可见负值。 |
| `[slow resistance]` | 单数值 | 减速异常状态抗性线索。 |
| `[blind resistance]` | 单数值 | 失明异常状态抗性线索。 |
| `[burn resistance]` | 单数值 | 灼伤异常状态抗性线索；目标样本可见负值。 |
| `[sleep resistance]` | 单数值 | 睡眠异常状态抗性线索。 |
| `[stone resistance]` | 单数值 | 石化异常状态抗性线索。 |
| `[hold resistance]` | 单数值 | 束缚或控制类异常状态抗性线索；精确客户端名称和作用范围需确认。 |
| `[piercing resistance]` | 单数值 | `piercing` 类抗性线索；只读结构不能证明对应的中文状态名或公式。 |

## 罕见抗性字段

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[deadlystrike resistance]` | 单数值 | 目标包仅在样例型文件中确认存在；字段名和结构保留原样，不外推具体机制。 |
| `[deelement resistance]` | 单数值 | 目标包仅在样例型文件中确认存在；可能是旧式或特殊状态名，不能按字面改名。 |
| `[tradeze resistance]` | 单数值 | 目标包仅在样例型文件中确认存在；可能是旧式拼写，不能自行纠正标签。 |

## 暴击、伤害与防御补充

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[increase critical damage]` | `%` token、数值 | 主要位于 `[then]` 或 `[pvp]` 内的暴击伤害增加线索；百分号 token 必须保留，公式与叠加需实机确认。 |
| `[decrease critical damage]` | `%` token、数值 | 根级暴击伤害减少线索；不要与 `[increase critical damage]` 或暴击率字段混用。 |
| `[add physical critical hit]` | 单数值 | 补充物理暴击字段；目标只确认根级单数值，不等同于常规 `[physical critical hit]`。 |
| `[add magical critical hit]` | 单数值 | 补充魔法暴击字段；目标只确认根级单数值，不等同于常规 `[magical critical hit]`。 |
| `[ignore defense]` | 单数值 | 忽略防御相关标记或数值线索；目标仅有单一样本，不能据此确定百分比、固定值或完整伤害公式。 |
| `[add absolute defense percent]` | 目标 token、数值 | 效果侧防御百分比修正线索；目标 token 可见 `all`，数值可正可负。必须结合 `[then]`、目标和持续时间读取。 |

## 宠物、恢复与特殊加成

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[creature physical attack]` | 单数值 | creature 相关物理攻击数值线索；具体作用对象、面板位置和换算需实机确认。 |
| `[creature magical attack]` | 单数值 | creature 相关魔法攻击数值线索；具体作用对象、面板位置和换算需实机确认。 |
| `[MP regen speed rate]` | 单数值 | MP 回复速度率线索；标签大小写必须保留。不要与 `[MP regen speed]` 合并，比例和显示单位未定性。 |
| `[hp recovery]` | 单数值 | 恢复 HP 的参数线索；目标样本位于 `[rebirth]`，数值与实际恢复比例、上限和触发时机需实机确认。 |
| `[mp recovery]` | 单数值 | 恢复 MP 的参数线索；目标样本位于 `[rebirth]`，数值与实际恢复比例、上限和触发时机需实机确认。 |
| `[recovery status]` | 闭合整数流 | 必须读取 `[/recovery status]`。目标仅有单一样本，首部整数后出现大量重复整数对；静态观察不足以安全命名每一列。 |
| `[quest item drop rate bonus]` | 单数值 | 任务物品掉落率加成线索；可位于根级或套装能力块，单位和与服务端掉落逻辑的叠加方式未定性。 |
| `[war room point bonus]` | `%` token、数值 | war room 点数加成线索；百分号 token 必须保留，适用内容和结算时机需实机确认。 |

## `[rebirth]` 容器

`[rebirth]` 是闭合效果容器，必须读取 `[/rebirth]`。目标包只确认一个样本，块内依次可见：

- `[probability]`
- `[consume item]`
- `[hp recovery]`
- `[mp recovery]`
- `[cooltime]`

该结构只能证明目标样本把概率、消耗、恢复和冷却组合在同一复活相关容器中。是否受其他复活状态阻止、物品何时扣除、冷却何时开始，仍需运行验证。

## 最低验证清单

1. 保留标签原始大小写和拼写，尤其是 `[MP regen speed rate]` 与三个罕见抗性字段。
2. 先判断字段在根级、套装能力块、条件块还是效果块。
3. `%`、`all` 等 token 不能丢失或改成纯数字。
4. `[recovery status]` 与 `[rebirth]` 必须检查闭合标签。
5. 单一样本和样例型文件字段不得直接复制到生产装备。
6. 实际战斗数值、显示单位、叠加与服务端结算仍需游戏内验证。
