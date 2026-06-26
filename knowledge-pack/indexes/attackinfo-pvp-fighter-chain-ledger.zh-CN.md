# AttackInfo PVP Fighter 链路账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/character/fighter/attackinfo/` 下带 `[pvp] ... [/pvp]` 的 `.atk` 文件如何静态连回 owner `.obj` 与 ANI。它只证明目标 PVF 的只读结构、PVP 覆盖块和帧级攻击框字段存在；不证明实机 PVP 伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| Fighter 目录 PVP `.atk` | 4 个，均已闭合到 owner `.obj`。 |
| PVP 块闭合 | 4 个均读到 `[/pvp]`。 |
| owner 形态 | 毒瓶、念气球、毒爆走 `.obj [attack info]`；野蛮冲撞终段走 `.obj [etc attack info]`。 |
| ANI 观察 | 毒瓶、念气球、毒爆、野蛮冲撞基础爆石 ANI 均有 `[ATTACK BOX]` 正样本。 |
| 静态风险 | 部分视觉 / dodge / etc motion 已读但未见 `[ATTACK BOX]`；静态只读不能解释运行时 motion 与 attackinfo 的精确选择。 |

## 链路表

| PVP `.atk` | PVP 块内字段 | owner `.obj` | motion / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `atpoisonflask.atk` | `[hit info] -> [blow] [no blood] 100 1.0` | `atpoisonflask.obj [attack info]` | `ATEnchantPoison/ATPoisonFlask.ani` 有 `[ATTACK BOX]`。 | 根层 `[active status] [poison] 0 0 0 0` 不属于 PVP 块。 |
| `energyball.atk` | `[damage reaction] [damage]`，并覆盖 `[push aside] 200`、`[lift up] 200` | `energyball.obj [attack info]` | `EnergyBall.ani` 有 `[ATTACK BOX]`；相邻 `EnergyBallExp.ani`、`EnergyBallCharge.ani` 也有 `[ATTACK BOX]`。 | `EnergyBallExp.atk`、`EnergyBallCharge.atk` 为相邻 etc attack info，未观察到 PVP 块。 |
| `venomexplosion.atk` | `[lift up] 350`、`[push aside] 120` | `venomexplosion.obj [attack info]` | `VenomExplosion.ani` 有 `[ATTACK BOX]`；`VenomExplosionLinearDodge.ani` 已读但未见 `[ATTACK BOX]`。 | basic motion 与 etc motion hitbox 不能合并写成同一结论。 |
| `wildcannonspikeexpfinal.atk` | `[lift up] 200` | `wildcannonspikeexp.obj [etc attack info]` | `WildCannonSpike/ExpStone.ani` 有 `[ATTACK BOX]`；`ExpStoneGlow.ani`、`ExpStoneBreak.ani`、`ExpFlash1.ani`、`ExpFlash2.ani` 已读但未见 `[ATTACK BOX]`。 | 主 `[attack info]` 是 `WildCannonSpikeExp.atk` 且未观察到 PVP 块；Final PVP `.atk` 在 `[etc attack info]`。 |

## 相邻但不并入 PVP 计数

| 文件 | 主目标观察 |
| --- | --- |
| `atpoisonflaskgas.atk` | 同目录相邻攻击文件，未作为当前样本 PVP 文件计数。 |
| `energyballexp.atk` / `energyballcharge.atk` | `energyball.obj [etc attack info]` 引用，未观察到 `[pvp]`。 |
| `wildcannonspikeexp.atk` | `wildcannonspikeexp.obj [attack info]` 引用，未观察到 `[pvp]`。 |

## 方法规则

- Fighter PVP `.atk` 不能只按技能名猜 owner；必须读取 `.obj [attack info]` 与 `[etc attack info]` 原文。
- owner 有 `[etc motion]` 时，必须逐个读取对应 ANI；读取到无 `[ATTACK BOX]` 的视觉 motion 也要保留为边界。
- PVP 块内字段只记录覆盖值，不解释为竞技场最终公式。

## 未完成

- 本账本只完成 Fighter 目录 4 个 PVP `.atk`，不代表其余职业、公共对象、装备 passiveobject 或 zrr_skill PVP `.atk` 已闭合。
- 野蛮冲撞终段的 `[etc attack info]` 与多个 `[etc motion]` 的运行时映射仍需实机或更深动作链验证。
