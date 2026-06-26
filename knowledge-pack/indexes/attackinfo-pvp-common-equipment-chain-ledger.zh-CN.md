# AttackInfo PVP Common / Equipment 链路账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/common/attackinfo/` 与 `passiveobject/equipmentpassiveobject/` 下 5 个带 `[pvp] ... [/pvp]` 的 `.atk` 文件如何静态连回 owner `.obj`、`.act` 与 ANI。它只证明目标 PVF 的只读结构、PVP 覆盖块、相对路径解析和已读取帧级盒字段；不证明实机 PVP 伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| 本账本 PVP `.atk` | 5 个，均已闭合到目标目录下的 owner `.obj`。 |
| PVP 块闭合 | 5 个均读到 `[/pvp]`。 |
| owner 形态 | `fireexplosionitemattack8.obj` 走 `[basic motion]`；装备 `boom`、`fire_boom`、`event_thunder_item1`、`revengethunderbolt` 走 `[basic action]` 再展开 `.act`。 |
| ANI 观察 | `FireExplosion.ani`、`boom01.ani`、`fire_boom_e1.ani`、`TalismanThunderbolt1.ani` 有 `[ATTACK BOX]`；`empty_00.ani`、`boom02.ani`、`TalismanThunderbolt2/3.ani` 未观察到攻击框。 |
| Registry | `event_thunder_item01.act [CREATE PASSIVEOBJECT] [INDEX] 48234` 已回 `passiveobject/passiveobject.lst` 解析到装备 `RevengeThunderbolt` 对象。 |
| 路径风险 | `attackinfo/boom.atk`、`attackinfo/fireball.atk`、`AttackInfo/Event_Thunder.atk`、`AttackInfo/RevengeThunderBolt.atk` 这类相对字符串可在多个 owner 中出现；必须按 owner 所在目录解析成物理文件。 |

## 链路表

| PVP `.atk` | PVP 块内字段 | owner `.obj` | action / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `common/attackinfo/fireexplosionitemattack8.atk` | `[damage bonus] -45` | `common/fireexplosionitemattack8.obj [attack info] -> AttackInfo/FireExplosionItemAttack8.atk` | `[basic motion] -> Animation/FireExplosion.ani`；`FRAME000` 有 `[ATTACK BOX]`。 | `.obj` 还含粒子 string data；PVF 引用存在不证明客户端资源完整。 |
| `equipmentpassiveobject/boom/attackinfo/boom.atk` | `[damage bonus] 100` | `equipmentpassiveobject/boom/boom.obj [attack info] -> attackinfo/boom.atk` | `Action/boom.act [BASE ANI] -> boom01.ani`，`boom01.ani` `FRAME000` 到 `FRAME003` 有 `[ATTACK BOX]`；`[SUB ANI] -> boom02.ani` 已读但未见攻击框。 | `attackinfo/boom.atk` 字符串在多个 owner 中出现；本行只闭合装备 `boom/boom.obj` 的相对路径。 |
| `equipmentpassiveobject/fire_boom/attackinfo/fireball.atk` | `[damage bonus] 40` | `equipmentpassiveobject/fire_boom/fire_boom.obj [attack info] -> attackinfo/fireball.atk` | `Action/fire_boom.act [BASE ANI] -> fire_boom_e1.ani`；`fire_boom_e1.ani` 多帧有 `[ATTACK BOX]`；action 行为块含 `[SET ACTION] [ATTACK] 7 [NOW]`。 | `[SET ACTION] [ATTACK] 7 [NOW]` 只证明行为入口存在，不解释运行时攻击调度。 |
| `equipmentpassiveobject/event_thunder_item1/attackinfo/event_thunder.atk` | `[damage bonus] 10` | `equipmentpassiveobject/event_thunder_item1/event_thunder_item1.obj [attack info] -> AttackInfo/Event_Thunder.atk` | `Action/Event_Thunder_item01.act [BASE ANI] -> empty_00.ani`；`empty_00.ani` 为空图帧，未见攻击框；action 每帧创建 `[INDEX] 48234`，最后 `[DESTROY]`。 | 父对象自身无已读攻击框；实际命中更可能来自下游创建对象，但静态只读不证明运行命中时序。 |
| `equipmentpassiveobject/revengethunderbolt/attackinfo/revengethunderbolt.atk` | `[damage bonus] 30` | `equipmentpassiveobject/revengethunderbolt/revengethunderbolt.obj [attack info] -> AttackInfo/RevengeThunderBolt.atk` | `Action/Lighting.act [BASE ANI] -> TalismanThunderbolt1.ani` 有 `[ATTACK BOX]`；`TalismanThunderbolt2.ani`、`TalismanThunderbolt3.ani` 已读但未见攻击框。 | character/priest 目录也有同名相对字符串，但解析到 priest 目录的非 PVP `.atk`，不是本行装备 PVP 文件。 |

## Registry 样本

| 上下文 | 数字 | Registry 结果 |
| --- | ---: | --- |
| `Event_Thunder_item01.act [CREATE PASSIVEOBJECT] [INDEX]` | 48234 | `passiveobject/passiveobject.lst` 命中 `EquipmentPassiveObject/RevengeThunderbolt/RevengeThunderbolt.obj`。 |

## 同名相对路径边界

| 相对字符串 | 主目标只读观察 |
| --- | --- |
| `attackinfo/boom.atk` | 在多个 owner 中出现；本账本只把装备 `boom/boom.obj` 解析到装备 `boom/attackinfo/boom.atk`。 |
| `attackinfo/fireball.atk` | 在 actionobject 与 equipmentpassiveobject owner 中出现；本账本只把装备 `fire_boom/fire_boom.obj` 解析到装备 `fire_boom/attackinfo/fireball.atk`。 |
| `AttackInfo/Event_Thunder.atk` | 搜索可命中多个 owner 字符串；本账本只闭合装备 `event_thunder_item1` 目录下的 PVP `.atk`。 |
| `AttackInfo/RevengeThunderBolt.atk` | character/priest 与 equipmentpassiveobject owner 都写该相对字符串；priest 版解析到非 PVP `.atk`，装备版解析到本账本 PVP `.atk`。 |

## 方法规则

- 相对路径必须从 owner `.obj` 所在目录解析；同名相对字符串不是同一物理 `.atk` 的证明。
- `.obj [basic action]` 必须继续读 `.act [BASE ANI]`、`[SUB ANI]`、`[TRIGGER]`、`[BEHAVIOR]`，不能只停在 `.atk`。
- `[CREATE PASSIVEOBJECT] [INDEX]` 必须回 `passiveobject/passiveobject.lst` 解析目标对象。
- PVP 块内字段只记录覆盖值，不解释竞技场最终公式。

## 未完成

- 本账本只完成 common/equipment 5 个 PVP `.atk` 的目标目录 owner/ANI 审计，不代表同名相对路径的所有 owner 都已逐一闭合。
- `Event_Thunder` 父对象创建下游对象的实机命中、时序和目标选择仍需运行链或实机测试。
- 实机 PVP 伤害、命中、浮空、击退、硬直、同步和资源显示仍需独立运行测试。
