# AttackInfo Payload / Damage / Element / ActiveStatus 只读审计卡

状态：默认可用

用途：作为 `.atk` 攻击 payload、伤害入口、元素入口、异常状态入口和 PVP 静态覆盖的第一层路由。本文只记录主目标 PVF 的只读观察和辅助对照差异提示，不授权写 PVF，不证明实机伤害、命中、异常概率或 PVP 最终规则。

## 快速结论

- 主目标全 PVF 中观察到 `.atk` 扩展名文件 6610 个；本卡封闭 `passiveobject/` 下 2704 个 `.atk` 文件的 payload 小桶。
- `passiveobject/` `.atk` 中，`[active status]` 命中 526；样本行可见三数值列、四数值列、五数值列和七数值列，未观察到 `[/active status]` 闭合标签。
- `[pvp]` 与 `[/pvp]` 在主目标 `passiveobject/` 范围内均命中 40，样本为 `.atk` 内闭合覆盖块；PVP 块可只覆盖局部字段。
- 伤害相关入口已观察到 `[damage]`、`[damage bonus]`、`[absolute damage]`、`[damage increase rate]`、`[weapon damage apply]`、`[human damage rate]`、`[human active status rate]`、`[monster damage rate]` 和 `[ignore defense]`。
- 元素入口已观察到 `[elemental property]`，其下可见 `[fire element]`、`[water element]`、`[dark element]`、`[light element]`、`[no element]`、`[no elemental]` 等 token。
- 主目标当前未命中 `[active status apply weapon]`、`[elemental property multi]`、`[set hp percent damage]`、`[all damage rate]` 和 `[force elemental property]`；不能把辅助对照独有字段写成主目标事实。

## 首选阅读顺序

1. `dictionaries/attackinfo-payload-damage-element-activestatus-fields.zh-CN.md`
2. `indexes/attackinfo-payload-damage-element-activestatus-boundary.zh-CN.md`
3. `dictionaries/attackinfo-atk-fields.zh-CN.md`
4. `indexes/attackinfo-status-pvp-ledger.zh-CN.md`
5. `indexes/attackinfo-pvp-block-inventory.zh-CN.md`
6. `indexes/passiveobject-attackinfo-hitbox-compact-router.zh-CN.md`

## 何时使用

| 问题 | 动作 |
| --- | --- |
| `.atk` 的伤害字段怎么读 | 先区分 `[damage]`、`[damage bonus]`、`[absolute damage]` 和比率字段；只写静态入口，不写公式。 |
| `.atk` 是否有元素属性 | 先定位 `[elemental property]` 父块和子 token；不要把元素 token 写成实机属性伤害已生效。 |
| `.atk` 是否带异常状态 | 先查 `[active status]` 段和状态 token 行列数；不要硬解释每列为概率、等级、持续或伤害。 |
| `.atk` 是否有 PVP 覆盖 | 先按 `[pvp] ... [/pvp]` 块范围切出覆盖字段；块外字段不能并入 PVP。 |
| 辅助对照有主目标没有的字段 | 只写差异提示，回主目标重新只读核验前不得提升为事实。 |

## 禁止外推

- 不把 `.atk` 静态伤害值写成最终伤害、倍率公式、独立攻击力公式或服务端结算。
- 不把 `[weapon damage apply] 1` 写成实机一定吃武器伤害。
- 不把 `[active status]` 行列数写成已确认概率、等级、持续、伤害列。
- 不把 `[pvp]` 覆盖块写成竞技场最终规则、平衡系数或命中结论。
- 不把 `.atk` 独立写成命中成功；仍需 `.obj/.act/.ani` 链路和实机验证。
- 不把资料库、教程、社区函数说明或辅助 PVF 直接写成主目标 Workbench 结论。
