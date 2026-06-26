# AttackInfo PVP 块全量盘点

状态：需验证

本文记录主目标 PVF 中 `passiveobject/` 范围内 40 个 `.atk [pvp] ... [/pvp]` 文件的全量只读盘点。它只证明 PVP 覆盖块的静态字段集合，不证明竞技场最终伤害、异常、击退、浮空、硬直或命中规则。

## 总结

| 结论项 | 主目标观察 |
| --- | --- |
| `[pvp]` 命中文件 | 40 |
| `[/pvp]` 命中 | 40 |
| 读取结果 | 40 个文件均可读取，未截断。 |
| 块形态 | 样本均为 `.atk` 内闭合覆盖块。 |
| 覆盖模式 | PVP 块可只覆盖局部字段，不要求镜像根层 `.atk`。 |
| 上游触发链 | 已有试点样本闭合到 `.obj/.act/.ani`，但 40 个文件尚未全量闭合。 |

## PVP 块字段覆盖计数

| PVP 块内字段 | 文件数 | 说明 |
| --- | ---: | --- |
| `[damage bonus]` | 14 | 常见于枪手子弹、装备 passiveobject、公共爆炸等样本。 |
| `[hit info]` | 10 | 可单独出现，也可与 `[damage reaction]` 同时出现。 |
| `[damage reaction]` | 8 | 可为 `[damage]`、`[down]`、`[none]` 等子状态入口。 |
| `[lift up]` | 12 | 可单独覆盖，也可与 `[push aside]`、`[hit direction]` 或 `[damage reaction]` 同时出现。 |
| `[push aside]` | 4 | 样本中与 `[lift up]` 或 `[damage reaction]` 同时出现。 |
| `[knuck back]` | 2 | 仅在 wavemark 系列 PVP 块中观察到。 |
| `[hit direction]` | 2 | 可单独覆盖为 `[auto]`，也可与 `[lift up]` 同时出现。 |
| `[ignore super armor]` | 1 | 样本中 PVP 覆盖为 `0`。 |

## 全量清单

| # | `.atk` 文件 | PVP 块内字段集合 | 观察列形 |
| ---: | --- | --- | --- |
| 1 | `passiveobject/character/fighter/attackinfo/atpoisonflask.atk` | `[hit info]` | `[blow]`、`[no blood] 100 1.0` |
| 2 | `passiveobject/character/fighter/attackinfo/energyball.atk` | `[damage reaction]`、`[push aside]`、`[lift up]` | `[damage]`、`[push aside] 200`、`[lift up] 200` |
| 3 | `passiveobject/character/fighter/attackinfo/venomexplosion.atk` | `[lift up]`、`[push aside]` | `[lift up] 350`、`[push aside] 120` |
| 4 | `passiveobject/character/fighter/attackinfo/wildcannonspikeexpfinal.atk` | `[lift up]` | `[lift up] 200` |
| 5 | `passiveobject/character/gunner/attackinfo/bulletbowgun.atk` | `[damage bonus]` | `-8` |
| 6 | `passiveobject/character/gunner/attackinfo/bullethandcannon.atk` | `[damage bonus]` | `-8` |
| 7 | `passiveobject/character/gunner/attackinfo/bullethandcannon_wind_shot.atk` | `[damage bonus]` | `-8` |
| 8 | `passiveobject/character/gunner/attackinfo/bulletmusket.atk` | `[damage bonus]` | `-5` |
| 9 | `passiveobject/character/gunner/attackinfo/bulletrevolver.atk` | `[damage bonus]` | `-12` |
| 10 | `passiveobject/character/gunner/attackinfo/fm-31explosion.atk` | `[hit info]` | 反引号包裹的 `[blow]`、`[no blood]`，后跟 `100 1.5` |
| 11 | `passiveobject/character/gunner/attackinfo/grenadenone.atk` | `[lift up]` | `[lift up] 350` |
| 12 | `passiveobject/character/gunner/attackinfo/jumpbulletautomatic.atk` | `[damage bonus]` | `-7` |
| 13 | `passiveobject/character/gunner/attackinfo/jumpbulletbowgun.atk` | `[damage bonus]` | `-10` |
| 14 | `passiveobject/character/gunner/attackinfo/tempesterexplosion.atk` | `[damage reaction]`、`[hit info]` | `[down]`；`[blow]`、`[no blood] 100 1.0` |
| 15 | `passiveobject/character/gunner/attackinfo/tempestermissileexp.atk` | `[damage reaction]`、`[hit info]` | `[down]`；`[blow]`、`[no blood] 20 1.0` |
| 16 | `passiveobject/character/gunner/attackinfo/upbullethandcannon_wind_shot.atk` | `[damage bonus]` | `-8` |
| 17 | `passiveobject/character/mage/attackinfo/atbrokenarrow.atk` | `[damage bonus]` | `-8` |
| 18 | `passiveobject/character/mage/attackinfo/atchainlightning.atk` | `[hit info]` | `[blow]`、`[no blood] 100 0.10000000149011612` |
| 19 | `passiveobject/character/mage/attackinfo/enhancedmagicmissile.atk` | `[hit info]` | `[blow]`、`[no blood] 100 0.10000000149011612` |
| 20 | `passiveobject/character/mage/attackinfo/timerbombexplosion.atk` | `[damage reaction]` | `[none]` |
| 21 | `passiveobject/character/priest/attackinfo/devilstrike1.atk` | `[hit info]` | `[blow]`、`[no blood] 100 2.0` |
| 22 | `passiveobject/character/priest/attackinfo/judgement.atk` | `[hit info]` | `[cut]`、`[blood] 10 1.0` |
| 23 | `passiveobject/character/swordman/attackinfo/outragebreakfloor.atk` | `[lift up]` | `[lift up] 450` |
| 24 | `passiveobject/character/swordman/attackinfo/outragebreakfloor_ds.atk` | `[lift up]` | `[lift up] 450` |
| 25 | `passiveobject/character/thief/attackinfo/ballacre/attack_pierce.atk` | `[hit info]` | `[cut]`、`[blood] 60 1.0` |
| 26 | `passiveobject/character/thief/attackinfo/boneshield.atk` | `[damage reaction]`、`[hit info]` | `[none]`；`[cut]`、`[no blood] 0 0` |
| 27 | `passiveobject/common/attackinfo/fireexplosionitemattack8.atk` | `[damage bonus]` | `-45` |
| 28 | `passiveobject/equipmentpassiveobject/boom/attackinfo/boom.atk` | `[damage bonus]` | `100` |
| 29 | `passiveobject/equipmentpassiveobject/event_thunder_item1/attackinfo/event_thunder.atk` | `[damage bonus]` | `10` |
| 30 | `passiveobject/equipmentpassiveobject/fire_boom/attackinfo/fireball.atk` | `[damage bonus]` | `40` |
| 31 | `passiveobject/equipmentpassiveobject/revengethunderbolt/attackinfo/revengethunderbolt.atk` | `[damage bonus]` | `30` |
| 32 | `passiveobject/zrr_skill/atmage/attackinfo/atblizzardstormpole.atk` | `[hit direction]` | `[auto]` |
| 33 | `passiveobject/zrr_skill/swordman/attackinfo/atgroupdance/wildwhip2.atk` | `[lift up]` | `[lift up] 375` |
| 34 | `passiveobject/zrr_skill/swordman/attackinfo/givebloodsub.atk` | `[damage reaction]` | `[none]` |
| 35 | `passiveobject/zrr_skill/swordman/attackinfo/grandwavefullcharge.atk` | `[ignore super armor]` | `0` |
| 36 | `passiveobject/zrr_skill/swordman/attackinfo/outragebreakfloor.atk` | `[lift up]` | `[lift up] 450` |
| 37 | `passiveobject/zrr_skill/swordman/attackinfo/outragebreakfloor_ds.atk` | `[lift up]` | `[lift up] 450` |
| 38 | `passiveobject/zrr_skill/swordman/attackinfo/releasewave.atk` | `[lift up]`、`[hit direction]` | `[lift up] 300`、`[outer]` |
| 39 | `passiveobject/zrr_skill/swordman/attackinfo/wavemarkattack.atk` | `[damage reaction]`、`[knuck back]`、`[push aside]`、`[lift up]` | `[none]`、`[knuck back] 0`、`[push aside] 0`、`[lift up] 0` |
| 40 | `passiveobject/zrr_skill/swordman/attackinfo/wavemarkattack_light.atk` | `[damage reaction]`、`[knuck back]`、`[push aside]`、`[lift up]` | `[none]`、`[knuck back] 0`、`[push aside] 0`、`[lift up] 0` |

## 额外观察

- PVP 块之后仍可能继续出现根层字段；例如 `judgement.atk` 的 `[elemental property] [light element]` 位于 `[/pvp]` 之后。读取时必须按文件顺序定位块范围，不要把块外字段并入 PVP。
- `boom.atk` 的根层 `[active status] [burn]` 后观察到七数值列。这扩展了状态行列形范围；不要把早期三数值列、四数值列样本写成全部状态行规则。
- `fm-31explosion.atk` 的 PVP `[hit info]` 内出现反引号包裹的 `[blow]`、`[no blood]` token；读取时保留原样。
- PVP `.atk` 的 owner 搜索不能只靠小写 basename；大小写混合相对路径和多 owner 风险见 `indexes/attackinfo-pvp-chain-pilot-ledger.zh-CN.md`。
- 40 个 PVP `.atk` 均已完成静态只读审计：31 个完成分桶 owner/ANI 观察点闭合，9 个 zrr_skill 文件登记为 owner 未闭合或 ANI 断链风险。
- 分桶入口分别见 `indexes/attackinfo-pvp-gunner-chain-ledger.zh-CN.md`、`indexes/attackinfo-pvp-fighter-chain-ledger.zh-CN.md`、`indexes/attackinfo-pvp-mage-chain-ledger.zh-CN.md`、`indexes/attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`、`indexes/attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`、`indexes/attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md`。
- Mage、`Judgement`、`Event_Thunder` 与 zrr_skill 仍有 hitbox 映射、大量 owner-listed motion 未逐帧穷尽、下游创建时序、owner 未闭合或 ANI 断链风险；不能写成所有 PVP `.atk` 都已完成实机命中验证。

## 边界

- 本清单不是 PVP 公式表。
- `[damage bonus] -8`、`[lift up] 450`、`[ignore super armor] 0` 等只记录静态覆盖值，不解释最终倍率、浮空高度或霸体规则。
- 要验证竞技场实际效果，必须进入独立运行测试或写入实验流程。
