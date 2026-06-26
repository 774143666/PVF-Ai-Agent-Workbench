# AttackInfo PVP Mage 链路账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/character/mage/attackinfo/` 下带 `[pvp] ... [/pvp]` 的 `.atk` 文件如何静态连回 owner `.obj` 与 ANI。它只证明目标 PVF 的只读结构、PVP 覆盖块和已读取的 motion/ANI 观察；不证明实机 PVP 伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| Mage 目录 PVP `.atk` | 4 个，均已闭合到 owner `.obj`。 |
| PVP 块闭合 | 4 个均读到 `[/pvp]`。 |
| owner 形态 | `ATBrokenArrow`、`ATChainLightning`、`EnhancedMagicMissile` 走 `[attack info]`；`TimerBombExplosion` 走 `[etc attack info]`。 |
| hitbox 状态 | `ATBrokenArrow` 的 owner basic motion 有 `[ATTACK BOX]`；其余样本存在 owner-listed motion 无攻击框或相邻 ANI 未能由 `.obj` 直接挂接的静态风险。 |
| 多 owner | `ATChainLightning.atk` 至少被 `atchainlightning.obj` 与 `atchainlightningtarget.obj` 两个 owner 引用。 |

## 链路表

| PVP `.atk` | PVP 块内字段 | owner `.obj` | motion / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `atbrokenarrow.atk` | `[damage bonus] -8` | `atbrokenarrow.obj [attack info]` | `ATBrokenArrow/00_arrow_normal.ani` 有 `[ATTACK BOX]`；`hiteffect/00_arrow_normal.ani`、`hiteffectEnd/00_arrow_normal.ani` 已读但未见 `[ATTACK BOX]`。 | hiteffect motion 只作为相邻视觉观察，不能替代 basic motion hitbox。 |
| `atchainlightning.atk` | `[hit info] -> [blow] [no blood] 100 0.10000000149011612` | `atchainlightning.obj [attack info]`；`atchainlightningtarget.obj [attack info]` | `atchainlightningtarget.obj` 列出的 `Target/1_target_normal.ani`、`TargetEnd/2_target_dodge.ani` 已读但未见 `[ATTACK BOX]`；相邻 `Firing/6_lightning_dodge.ani` 有 `[ATTACK BOX]`，但未在已读 owner `.obj` 中直接列出。 | owner 已闭合；hitbox 映射仍需更深上游或运行链验证。 |
| `enhancedmagicmissile.atk` | `[hit info] -> [blow] [no blood] 100 0.10000000149011612` | `enhancedmagicmissile.obj [attack info]` | owner 的 `[basic motion]` 为空；列出的 `HeadNone1-5`、`HeadDodge1-5`、`HeadGlow1-5` 均已读，未见 `[ATTACK BOX]`。 | 只能写成 owner-listed motion 未观察到攻击框；不能据此否定运行时命中。 |
| `timerbombexplosion.atk` | `[damage reaction] [none]` | `timerbomb.obj [etc attack info]` | owner 的 `[basic motion]` 为空；列出的 `TimerBomb` 六个 etc motion 均已读，未见 `[ATTACK BOX]`。 | 主 `[attack info]` 是 `TimerBomb.atk` 且未观察到 PVP 块；爆炸 PVP `.atk` 在 `[etc attack info]`。 |

## 相邻但不并入 PVP 计数

| 文件 / ANI | 主目标观察 |
| --- | --- |
| `TimerBomb.atk` | `timerbomb.obj [attack info]` 引用，未观察到 `[pvp]`。 |
| `ATChainLightning/Firing/6_lightning_dodge.ani` | 有 `[ATTACK BOX]`，但未在已读 `.obj` 的 motion 列表中直接出现；只能作为相邻 hitbox 观察。 |
| `EnhancedMagicMissile` familiar/tail ANI | 文件存在但未在 `enhancedmagicmissile.obj [etc motion]` 列表中出现；本账本不把它们并入 owner-listed motion 结论。 |

## 方法规则

- Mage PVP `.atk` 审计不能只看 owner 是否存在；还要记录 owner-listed motion 是否真的有 `[ATTACK BOX]`。
- basic motion 为空时，必须转入 `[etc motion]` 列表逐一读取。
- 看到相邻 ANI 有 `[ATTACK BOX]`，但 `.obj` 未直接列出时，只能写成相邻观察，不能写成 owner 链已静态闭合。

## 未完成

- `ATChainLightning`、`EnhancedMagicMissile`、`TimerBombExplosion` 的实机命中来源或上游动作选择仍需更深上游链或运行测试确认。
- 本账本只完成 Mage 目录 4 个 PVP `.atk`，不代表公共对象、装备 passiveobject、zrr_skill 或其他职业目录已闭合。
