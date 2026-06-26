# AttackInfo Payload / Damage / Element / ActiveStatus 字段词典

状态：默认可用

本文记录主目标 PVF `passiveobject/` 范围内 `.atk` payload 的只读字段边界。它只说明静态结构、字段入口和样本列形，不证明命中、伤害公式、元素结算、异常状态概率、PVP 最终规则或客户端表现。

## 文件与上下文

| 项 | 主目标观察 | 边界 |
| --- | ---: | --- |
| 全 PVF `.atk` 扩展名文件 | 6610 | 扩展名不等于所有文件都已闭合到 owner 或 hitbox。 |
| `passiveobject/` `.atk` 文件 | 2704 | 本词典的统计桶；不代表 character、monster、AI character 等全域已穷尽。 |
| `[ACTIVE STATUS]` 大写 | `passiveobject/` 命中 48，全 PVF 命中 151 | 样本是 `.act` 行为上下文，不并入 `.atk [active status]` 结论。 |

## 基础 payload

| 字段 / 块 | 主目标命中 | 已观察列形 / token | 边界 |
| --- | ---: | --- | --- |
| `[attack type]` | 2664 | 块内可见 `[physic]`、`[magic]`。 | 不证明最终防御结算。 |
| `[attack enemy]` | 2205 | 单数值行。 | 不证明实机敌我判定。 |
| `[attack friend]` | 102 | 单数值行。 | 不证明友方命中或治疗规则。 |
| `[damage reaction]` | 未单独计数 | 样本中可含 `[damage]`、`[down]`、`[push aside]`、`[lift up]`、`[knuck back]`。 | 不证明卡肉、击退、浮空或倒地实机表现。 |
| `[hit wav]` | 未单独计数 | 反引号声音 token。 | 不证明客户端音频资源存在或实际播放。 |
| `[hit info]` | 未单独计数 | 可含 `[blow]`、`[cut]`、`[blood]`、`[no blood]`、`[noblood]`。 | 不证明血效、切割表现或 UI 正常。 |

## 伤害入口

| 字段 | 主目标命中 | 样本列形 | 边界 |
| --- | ---: | --- | --- |
| `[damage]` | 1687 | 单数值行；也可作为 `[damage reaction]` 子 token。 | 不解释固定伤害或百分比公式。 |
| `[damage bonus]` | 849 | 单数值行，可为正值、负值或 0。 | 不解释倍率公式或 PVP 修正。 |
| `[absolute damage]` | 330 | 单数值行。 | 不证明固定伤害实际结算。 |
| `[damage increase rate]` | 61 | 浮点数样本。 | 只记录字段存在，不解释叠加方式。 |
| `[weapon damage apply]` | 1799 | `0` 或 `1` 等单数值行。 | 不证明实机一定吃武器伤害。 |
| `[human damage rate]` | 5 | 浮点数样本。 | 不证明对玩家最终增减伤。 |
| `[human active status rate]` | 2 | 浮点数样本。 | 不证明异常状态对玩家最终概率。 |
| `[monster damage rate]` | 2 | 浮点数样本。 | 不证明对怪物最终增减伤。 |
| `[ignore defense]` | 66 | 单数值样本。 | 不证明无视防御实机公式。 |
| `[all damage rate]` | 0 | 当前未命中。 | 不能写成主目标字段事实。 |

## 元素入口

| 字段 / token | 主目标命中 | 边界 |
| --- | ---: | --- |
| `[elemental property]` | 2589 | 元素父块入口，不证明最终属性伤害。 |
| `[fire element]` | 508 | 火元素 token，需处于正确父块内解读。 |
| `[water element]` | 200 | 水/冰元素 token，资料库常量名只能当线索。 |
| `[dark element]` | 265 | 暗元素 token。 |
| `[light element]` | 307 | 光元素 token。 |
| `[no element]` | 1274 | 无属性 token。 |
| `[no elemental]` | 5 | 无属性拼写变体，保留原样。 |
| `[elemental property multi]` | 0 | 主目标当前全 PVF 未命中；辅助对照命中也不能提升为主目标事实。 |
| `[force elemental property]` | 0 | 主目标 `passiveobject/` 范围未命中。 |

## 异常状态入口

| 字段 / token | 主目标命中 | 已观察列形 | 边界 |
| --- | ---: | --- | --- |
| `[active status]` | 526 | 段入口，下面跟状态 token 行。 | 未观察到 `[/active status]`；不要写成闭合块。 |
| `[bleeding]` | 样本 token | `20 0 5000 200`，四数值列。 | 不把四列外推到全部状态。 |
| `[hold]` | 样本 token | `100 0 8000`，三数值列。 | 不解释三列含义。 |
| `[burn]` | 样本 token | `0 70 3000 600 20 1 3000`、`100 78 6000 1000 60 1 3000`，七数值列。 | 不证明燃烧概率、等级、持续、伤害公式。 |
| `[slow]` | 样本 token | `100 89 7000 15 15`，五数值列。 | 五列不代表所有 slow 固定规则。 |
| `[blind]` | 样本 token | `0 0 0 0 0`，五数值列。 | 不证明失明实际效果。 |
| `[curse]` | 样本 token | `100 10 5000 20 20 20 20`，七数值列。 | 不证明诅咒属性含义。 |
| `[stun]` | 样本 token | `100 0 4000`，三数值列。 | 不证明眩晕概率或持续。 |
| `[active status apply weapon]` | 0 | 主目标全 PVF 未命中。 | 辅助对照命中也不能写成主目标字段。 |

## PVP 覆盖

| 块 / 字段 | 主目标命中 | 已观察形态 | 边界 |
| --- | ---: | --- | --- |
| `[pvp]` | 40 | `.atk` 内闭合覆盖块起始。 | 不证明竞技场最终规则。 |
| `[/pvp]` | 40 | 与 `[pvp]` 数量相等。 | 读取时必须按块范围切分。 |
| PVP `[damage bonus]` | 既有全量盘点中 14 个文件 | 可只覆盖一个局部字段。 | 不要求镜像根层字段。 |
| PVP `[hit info]` | 既有全量盘点中 10 个文件 | 可覆盖 `[blood]`、`[no blood]` 等命中表现。 | 不证明血效或客户端表现。 |
| PVP `[damage reaction]` | 既有全量盘点中 8 个文件 | 可覆盖 `[damage]`、`[none]`、`[down]` 等。 | 不证明击退、浮空、硬直实机结果。 |

## 资料库线索的使用边界

- 资料库中的 AttackInfo 函数说明提示应关注攻击信息对象、伤害倍率、固伤、武器伤害、元素、攻击类型、击退/浮空和异常状态。
- 资料库中的异常状态函数说明提示状态行可能与类型、概率、等级、时间、伤害等概念相关。
- 资料库中的元素和异常常量名只用于辅助识别 token 家族；主目标 `.atk` 样本以方括号 token 为准。
- 资料库说明和 PVF 静态字段不能替代实机验证；字段结论必须回主目标 PVF 只读观察。

## 未证明事项

- 不证明伤害公式、最终伤害、独立攻击力、技攻、附加伤害或异常伤害结算。
- 不证明元素强化、抗性、属性攻击、无属性或多属性的最终生效。
- 不证明异常状态概率、等级、持续、伤害、抗性、免疫或 PVP 修正。
- 不证明 `.atk` 能被 owner 实际触发，也不证明 `.ani` 攻击框命中。
