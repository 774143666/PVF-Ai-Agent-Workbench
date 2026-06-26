# AttackInfo Payload / Damage / Element / ActiveStatus Boundary

状态：已完成静态只读封存

用途：记录主目标 PVF 中 `passiveobject/` `.atk` 的攻击 payload、伤害入口、元素入口、异常状态入口、PVP 覆盖和资料库定向线索边界。本文不重开 PassiveObject / AttackInfo / Hitbox 大主线，不证明实机命中、伤害、异常状态或 PVP 最终规则。

## 方法边界

- 先用外部资料做定向线索：AttackInfo 函数、伤害设置、元素设置、异常状态设置和常量名只用于决定核验桶。
- 结论只按主目标 PVF 只读观察晋级。
- 辅助对照 PVF 只记录差异提示，不覆盖主目标事实。
- `.atk` 字段必须放回 owner 链路和 `.ani` hitbox 才能讨论命中；当前只封闭静态 payload 边界。

## 主目标观察矩阵

| 小桶 | 主目标只读观察 | 结论 |
| --- | --- | --- |
| 文件范围 | 全 PVF `.atk` 扩展名文件 6610；`passiveobject/` 下 `.atk` 文件 2704。 | 本主线封闭 `passiveobject/` `.atk` payload 小桶，不代表全域 owner/hitbox 已穷尽。 |
| 基础 payload | `[attack type]` 2664、`[attack enemy]` 2205、`[attack friend]` 102。 | `.atk` 可携带攻击类型和敌我入口；不能静态证明命中规则。 |
| 伤害入口 | `[damage]` 1687、`[damage bonus]` 849、`[absolute damage]` 330、`[damage increase rate]` 61、`[weapon damage apply]` 1799。 | 可确认静态伤害字段存在；不能解释最终伤害公式或武器伤害结算。 |
| 特殊比率 | `[human damage rate]` 5、`[human active status rate]` 2、`[monster damage rate]` 2、`[ignore defense]` 66。 | 可作为后续定向复核入口；不能证明对人/怪/PVP最终生效。 |
| 元素入口 | `[elemental property]` 2589；子 token 包括 fire 508、water 200、dark 265、light 307、no element 1274、no elemental 5。 | 元素 token 需要按父块读取；拼写变体保留原样。 |
| 异常状态 | `[active status]` 526；样本可见三、四、五、七数值列；未观察到 `[/active status]`。 | `[active status]` 是状态段入口，不是闭合块；列含义不能静态硬命名。 |
| PVP 覆盖 | `[pvp]` 40、`[/pvp]` 40；既有全量盘点显示 PVP 块可覆盖 `[damage bonus]`、`[hit info]`、`[damage reaction]`、`[lift up]`、`[push aside]` 等局部字段。 | PVP 块是闭合覆盖块，但不是 PVP 公式表。 |
| 未命中字段 | 主目标当前全 PVF 未命中 `[active status apply weapon]`、`[elemental property multi]`、`[set hp percent damage]`；`passiveobject/` 范围未命中 `[all damage rate]`、`[force elemental property]`。 | 不能把旧碎片或辅助对照命中提升为主目标事实。 |
| 大写状态上下文 | `[ACTIVE STATUS]` 在 `passiveobject/` 命中 48，全 PVF 命中 151，样本为 `.act` 行为上下文。 | 与 `.atk [active status]` 分开记录，不混入本词典。 |

## 代表样本

| 样本 | 主目标只读观察 | 风险 |
| --- | --- | --- |
| `passiveobject/actionobject/act8/monster/attackinfo/arrow.atk` | `[damage bonus] 10`、`[weapon damage apply] 1`、`[attack type] [physic]`、`[elemental property] [no element]`、`[active status] [bleeding] 20 0 5000 200`。 | 四数值列不能直接解释为概率、等级、持续、伤害。 |
| `passiveobject/actionobject/act8/monster/crokhan/attackinfo/herobubble.atk` | `[active status] [hold] 100 0 8000`，三数值列。 | 三列样本不能外推到全部状态。 |
| `passiveobject/equipmentpassiveobject/boom/attackinfo/boom.atk` | 根层 `[damage bonus] 200`、`[elemental property] [fire element]`、`[active status] [burn] 0 70 3000 600 20 1 3000`；PVP 块只覆盖 `[damage bonus] 100`。 | PVP 块不等于整份 `.atk` 重写；burn 七列不证明燃烧公式。 |
| `passiveobject/equipmentpassiveobject/requiem/003/attackinfo/boom2.atk` | `[attack type] [magic]`、`[damage bonus] 2900`、`[active status] [slow] 100 89 7000 15 15`。 | slow 五列不证明减速实机参数。 |
| `passiveobject/monster/zealotrebirth/attackinfo/nenguard.atk` | `[active status] [blind] 0 0 0 0 0`。 | 零值样本不证明失明无效或免疫。 |
| `passiveobject/actionobject/monster/powerstation/kohlepowerstation/fitz/attackinfo/boom.atk` | `[absolute damage] 4500`、`[active status] [burn] 100 78 6000 1000 60 1 3000`。 | 同名 `boom.atk` 必须按完整物理路径区分。 |
| `passiveobject/character/priest/attackinfo/judgement.atk` | PVP 块覆盖 `[hit info]`；根层 `[elemental property] [light element]` 位于 `[/pvp]` 之后。 | 块外字段不能并入 PVP。 |
| `passiveobject/character/fighter/attackinfo/energyball.atk` | 根层 `[damage reaction]` 与 PVP 块内 `[damage reaction]` 值不同。 | 不证明竞技场击退或浮空公式。 |
| `passiveobject/actionobject/monster/timegate/attackinfo/fish.atk` | 同文件有 `[damage] 100`、`[absolute damage] 30`、`[damage bonus] 0`、`[weapon damage apply] 0`、`[active status] [curse]` 七数值列、`[human active status rate] 70.0`。 | 多伤害入口同文件存在也不能静态解释优先级或叠加。 |
| `passiveobject/creature/fairytale/lucy/attackinfo/tidalwave.atk` | `[damage] 20000`、`[damage increase rate] 100.0`、`[human damage rate] 30.0`、`[elemental property] [water element]`。 | 不证明对玩家或怪物的最终伤害比例。 |
| `passiveobject/actionobject/monster/captainshured/attackinfo/attack3.atk` | `[monster damage rate] 100.0`、`[active status] [stun] 100 0 4000`、`[no elemental]`。 | `no elemental` 是拼写变体，保留原样。 |
| `passiveobject/actionobject/act8/monster/crokhan/action/illuminating_shell_bomb.act` | `.act` 中 `[ACTIVE STATUS] [blind] ...` 与 `[ACTIVE STATUS] [confuse] ...`。 | 大写状态是行为上下文，不并入 `.atk` 状态段。 |

## 辅助对照提示

| 项 | 辅助对照观察 |
| --- | --- |
| 文件规模 | `passiveobject/` `.atk` 命中 6847，高于主目标。 |
| `[active status]` | 1236，高于主目标。 |
| `[pvp]` / `[/pvp]` | 152 / 152，高于主目标。 |
| `[active status apply weapon]` | 7；主目标当前全 PVF 未命中。 |
| `[elemental property multi]` | 13；主目标当前全 PVF 未命中。 |
| 伤害与元素 | `[damage bonus]` 2998、`[absolute damage]` 1326、`[weapon damage apply]` 5418、`[elemental property]` 6487。 |

辅助对照只说明同类结构或新增字段家族在另一个目标集中存在，不说明主目标缺失、应迁移或可直接编辑。

## 可复用规则

- `.atk` 的数字和 token 先按父块解释，再谈运行语义。
- `[active status]` 行列数可变；只读文档中不要把列硬命名为概率、等级、持续、伤害。
- `[pvp] ... [/pvp]` 只覆盖块内字段；读取时必须按块范围切分。
- 根层字段、PVP 块字段、`.act [ACTIVE STATUS]` 和 NUT 运行 API 是不同层，不能互相替代。
- 资料库只给核验方向；Workbench 结论必须由主目标 PVF 只读观察支撑。
- 要讨论命中，必须回到 `.obj/.act/.ani` 和帧级 hitbox；`.atk` 不能独立证明命中。

## 未证明事项

- 不证明实机伤害、攻击倍率、独立攻击力、武器伤害、附加伤害、技攻或最终伤害。
- 不证明元素强化、抗性、属性攻击、多属性或无属性最终生效。
- 不证明异常状态概率、等级、持续、伤害、抗性、免疫、对人/对怪修正或 PVP 修正。
- 不证明 PVP 竞技场最终规则、击退、浮空、硬直、霸体、命中或客户端表现。
- 不证明 owner 链路完整、ANI 攻击框存在、客户端资源完整或服务端放行。
