# AttackInfo 状态 / PVP 覆盖账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/` 范围内 `.atk` 的 `[active status]` 与 `[pvp] ... [/pvp]` 只读观察。它只证明静态结构、块闭合和列形，不证明异常状态公式、概率、持续、伤害、PVP 结算或实机命中结果。

## 主目标计数

| 标签 / 块 | 主目标命中 | 观察结论 |
| --- | ---: | --- |
| `[active status]` | 526 | `.atk` 中的状态入口；未观察到对应 `[/active status]` 结束标签。 |
| `[ACTIVE STATUS]` | 48 | 样本命中为 `.act` 上下文，不并入 `.atk [active status]` 结论。 |
| `[active status apply weapon]` | 0 | 当前主目标 `passiveobject/` 搜索范围未观察到；不能写成主目标字段。 |
| `[pvp]` | 40 | `.atk` PVP 覆盖块起始标签。 |
| `[/pvp]` | 40 | 数量与 `[pvp]` 相等；样本中为闭合覆盖块。 |

## `[active status]` 样本

| 样本 | 状态 token | 观察列形 | 边界 |
| --- | --- | --- | --- |
| `passiveobject/actionobject/act8/monster/attackinfo/arrow.atk` | `[bleeding]` | `20 0 5000 200`，四数值列 | 不解释四列分别代表概率、等级、持续或伤害。 |
| `passiveobject/actionobject/act8/monster/crokhan/attackinfo/herobubble.atk` | `[hold]` | `100 0 8000`，三数值列 | 状态行长度可变。 |
| `passiveobject/actionobject/act8/monster/crokhan/attackinfo/kiss.atk` | `[confuse]` | `100 0 10000 1`，四数值列 | 状态 token 需原样保留。 |
| `passiveobject/actionobject/breakableobject/attackinfo/scasaegg_fluid.atk` | `[poison]` | `10 55 5000 1000`，四数值列 | 不把 poison 的列形外推到所有状态。 |
| `passiveobject/actionobject/spc/_diredirt/attackinfo/body2_weapon.atk` | `[poison]` | `75 70 1500 2200`，四数值列 | 本样本由 `_diredirt/body2_weapon.obj` 静态挂接；只证明 `.atk [active status]` poison 四列结构，不证明异常状态运行公式。 |
| `passiveobject/actionobject/common/attackinfo/snowball1.atk` | `[freeze]` | `25 0 1000`，三数值列 | 不把三列样本外推到所有状态。 |
| `passiveobject/equipmentpassiveobject/boom/attackinfo/boom.atk` | `[burn]` | `0 70 3000 600 20 1 3000`，七数值列 | 状态行列数可继续变化。 |
| `passiveobject/actionobject/monster/powerstation/kohlepowerstation/fitz/attackinfo/boom.atk` | `[burn]` | `100 78 6000 1000 60 1 3000`，七数值列 | 同名 `boom.atk` 必须按 owner 目录区分；fitz 是 `[absolute damage]` 样本。 |
| `passiveobject/actionobject/monster/powerstation/kohlepowerstation/slime/attackinfo/boom.atk` | `[burn]` | `100 70 3000 600 20 1 3000`，七数值列 | 同名 `boom.atk` 必须按 owner 目录区分；slime 是 `[damage bonus]` 样本。 |
| `passiveobject/equipmentpassiveobject/requiem/003/attackinfo/boom.atk` | `[burn]` | `100 70 3000 600 20 1 3000`，七数值列 | 与 slime / equipment boom 同形也必须按物理路径单独闭合。 |
| `passiveobject/actionobject/monster/chiefmong/attackinfo/boom.atk` | `[curse]` | `100 70 5000 30 200 20 200`，七数值列 | owner `.obj` 使用 `AttackInfo/Boom.atk` 大小写路径；七数值列不只出现在 burn token。 |
| `passiveobject/actionobject/spc/despair_tower/attackinfo/shouting.atk` | `[stun]` | `100 70 2000`，三数值列 | `shouting.obj` owner-linked 到本 `.atk`；同一 `.atk` 内还观察到 confuse 四数值列。 |
| `passiveobject/actionobject/spc/despair_tower/attackinfo/shouting.atk` | `[confuse]` | `100 70 10000 0`，四数值列 | `shouting.atk` 同时有 attack friend `1` 与 attack enemy `1`；状态列形不解释敌我命中规则。 |
| `passiveobject/actionobject/spc/despair_tower/attackinfo/shouting2.atk` | `[stun]` | `50 1 2000`，三数值列 | `shouting2.obj` 物理可读且 owner-linked 到本 `.atk`；当前未把 `shouting2.obj` 闭合到主目标 registry 数字入口。 |
| `passiveobject/actionobject/spc/despair_tower/attackinfo/shouting2.atk` | `[curse]` | `50 1 7000 0 500 0 500`，七数值列 | curse 七数值列可出现在 `despair_tower` 的普通 `.atk` 样本中；不解释各列运行语义。 |
| `passiveobject/actionobject/spc/despair_tower/attackinfo/apc_pinattack.atk` | `[curse]` | `100 70 20000 0 0 0 250`，七数值列 | `apc_niddle.obj` owner-linked 到本 `.atk`，9236 已回 passiveobject registry；同桶 `apc_pinattack1.atk` 未观察到 `[active status]`。 |
| `passiveobject/actionobject/monster/powerstation/kohlepowerstation/slime/attackinfo/boom2.atk` | `[burn]` | `100 70 3000 600 20 1 3000`，七数值列 | `boom2.obj` 复用 `boom.act`，但 `.atk` 是独立物理文件；`.atk` 同时含 `[damage]`、`[absolute damage]` 与 `[damage bonus]`。 |
| `passiveobject/equipmentpassiveobject/requiem/003/attackinfo/boom2.atk` | `[slow]` | `100 89 7000 15 15`，五数值列 | 本样本把 `.atk [active status]` 列形扩展到五数值列；不解释 slow 各列运行语义。 |
| `passiveobject/monster/zealotrebirth/attackinfo/nenguard.atk` | `[blind]` | `0 0 0 0 0`，五数值列 | 由 gashengrigun `Boom2.act` 创建的 8588 下游对象挂接；五数值列不只出现在 slow token。 |
| `passiveobject/actionobject/monster/gashengrigun/attackinfo/gas.atk` | `[sleep]` | `100 60 10000`，三数值列 | owner 字符串 `AttackInfo/Gas.atk` 在多个目录命中；本行只记录 gashengrigun 物理 `.atk`。 |
| `passiveobject/actionobject/monster/gashengrigun/attackinfo/gas2.atk` | `[sleep]` | `100 64 3000`，三数值列 | `sleepinggas2.obj` 独立挂接；不从文件名推断持续或等级语义。 |
| `passiveobject/actionobject/monster/gashengrigun/attackinfo/gas3_weapon.atk` | `[sleep]` | `80 70 1500`，三数值列 | `sleepinggas3_weapon.obj` 与 `sleepinggas.obj` 共用 `SleepingGas.act`，但 `.atk` 物理文件不同。 |

结论：

- `[active status]` 在样本中表现为状态段入口，下面跟一个或多个状态 token 行；当前样本未观察到 `[/active status]` 闭合标签。
- 状态 token 行已观察到三数值列、四数值列、五数值列和七数值列；静态只读不能给出各列运行语义。
- `[ACTIVE STATUS]` 大写样本属于 `.act` 行为上下文；不要混入 `.atk` 字段词典。

## `[pvp] ... [/pvp]` 样本

| 样本 | PVP 块内观察 | 边界 |
| --- | --- | --- |
| `passiveobject/character/fighter/attackinfo/atpoisonflask.atk` | 覆盖 `[hit info]`，其中 `[no blood]` 为 `100 1.0`。 | 只证明 PVP 块可覆盖命中表现字段。 |
| `passiveobject/character/fighter/attackinfo/energyball.atk` | 覆盖 `[damage reaction]`，含 `[push aside] 200`、`[lift up] 200`。 | 不证明 PVP 最终击退/浮空公式。 |
| `passiveobject/character/gunner/attackinfo/bulletbowgun.atk` | 覆盖 `[damage bonus] -8`。 | 不解释伤害倍率或竞技场结算。 |
| `passiveobject/character/fighter/attackinfo/venomexplosion.atk` | 覆盖 `[lift up] 350`、`[push aside] 120`。 | PVP 块内字段集合可变。 |
| `passiveobject/character/fighter/attackinfo/wildcannonspikeexpfinal.atk` | 只覆盖 `[lift up] 200`。 | PVP 块不要求镜像根层字段结构。 |

结论：

- `[pvp] ... [/pvp]` 是 `.atk` 内的闭合覆盖块。
- PVP 块内部可以只覆盖局部字段；不要默认整份 `.atk` 在 PVP 中重写。
- PVP 静态覆盖不等于竞技场最终规则，仍需实机或运行链验证。

全量盘点见 `indexes/attackinfo-pvp-block-inventory.zh-CN.md`。
触发链试点见 `indexes/attackinfo-pvp-chain-pilot-ledger.zh-CN.md`。

## 辅助对照提示

| 标签 / 块 | 辅助对照命中 | 只可作为 |
| --- | ---: | --- |
| `[active status]` | 1236 | 目标集差异提示。 |
| `[ACTIVE STATUS]` | 236 | 大写标签在对照中也可见 `.act` 上下文。 |
| `[active status apply weapon]` | 7 | 辅助对照观察到，但主目标同范围未观察到。 |
| `[pvp]` | 152 | 对照范围内 PVP 覆盖块更多。 |
| `[/pvp]` | 152 | 对照中起止数量相等。 |

辅助对照只能提示差异，不证明主目标存在辅助独有字段、ID、路径或列形。后续如果要修改主目标，必须回主目标单独只读复核目标文件。

## 下一步只读测试

- 按 `actionobject/`、`character/`、`mapobject/`、`monster/` 分桶扩大 `.atk [active status]` 样本，记录状态 token 清单和列数范围。
- 主目标 40 个 `[pvp]` 文件已完成全量块体盘点，且已有触发链试点；下一步继续把剩余 PVP 文件逐一连接回 `.obj/.act/.ani` 链路。
- 把 `.atk` 静态结果与 `.obj/.act/.ani` 链路相连时，仍必须单独查看 ANI hitbox；`.atk` 不能独立证明命中。
