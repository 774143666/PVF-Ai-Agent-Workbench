# AttackInfo PVP Priest / Swordman / Thief 链路账本

状态：需验证

本文记录主目标 PVF 中 Priest、Swordman、Thief 目录下 6 个带 `[pvp] ... [/pvp]` 的 `.atk` 文件如何静态连回 owner `.obj` 与 ANI。它只证明目标 PVF 的只读结构、PVP 覆盖块和已读取的帧级攻击框观察；不证明实机 PVP 伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| 本账本 PVP `.atk` | 6 个，均已闭合到 owner `.obj`。 |
| PVP 块闭合 | 6 个均读到 `[/pvp]`。 |
| owner 形态 | Priest / Swordman 样本可走 `[attack info]`；Thief 的 `attack_pierce.atk` 走 `ballacre.obj [etc attack info]`，且主 `[attack info]` 为空。 |
| ANI 观察 | `DevilStrike1`、`Judgement`、`OutRageBreakFloor`、`OutRageBreakFloor_DS`、`Ballacre attack_pierce`、`BoneShield bone_rotate_none` 均有 `[ATTACK BOX]` 正样本。 |
| 静态风险 | `Judgement` owner 列出大量 `[etc motion]`，本账本只读了命中相邻的 `Hit.ani` / `ExpHit.ani` 正样本，未把全部视觉 motion 写成已穷尽。 |

## 链路表

| PVP `.atk` | PVP 块内字段 | owner `.obj` | motion / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `devilstrike1.atk` | `[hit info] -> [blow] [no blood] 100 2.0` | `devilstrike1.obj [attack info] -> AttackInfo/DevilStrike1.atk` | `Animation/DevilStrike/attack1/2_shadow_normal.ani` 在 `FRAME001` 到 `FRAME005` 观察到 `[ATTACK BOX]`。 | `.obj` 同目录还有 `devilstrike2/3` 相邻对象；本行只覆盖 `devilstrike1`。 |
| `judgement.atk` | `[hit info] -> [cut] [blood] 10 1.0` | `judgement.obj [attack info] -> AttackInfo/Judgement.atk` | `Judgement/Hit.ani` 与 `Judgement/ExpHit.ani` 均观察到 `[ATTACK BOX]`。 | `.atk` 的 `[elemental property] [light element]` 位于 `[/pvp]` 后，不属于 PVP 块；`judgement.obj` 列出大量 etc motion，本账本未逐一穷尽。 |
| `outragebreakfloor.atk` | `[lift up] 450` | `outragebreakfloor.obj [attack info] -> AttackInfo/OutRageBreakFloor.atk` | `OutRageBreak/floor.ani` 在 `FRAME000`、`FRAME001` 观察到 `[ATTACK BOX]`。 | 普通 Swordman 目录与 DS 目录独立，不要合并路径。 |
| `outragebreakfloor_ds.atk` | `[lift up] 450` | `outragebreakfloor_ds.obj [attack info] -> AttackInfo/OutRageBreakFloor_DS.atk` | `OutRageBreak_DS/floor.ani` 在 `FRAME000`、`FRAME001` 观察到 `[ATTACK BOX]`。 | DS 版本使用 `Character/DemonicSwordsman/...` 图像引用。 |
| `ballacre/attack_pierce.atk` | `[hit info] -> [cut] [blood] 60 1.0` | `ballacre.obj [etc attack info] -> AttackInfo/Ballacre/attack_pierce.atk` | `Ballacre/attack_pierce.ani` 在 `FRAME003`、`FRAME004` 观察到 `[ATTACK BOX]`。 | `ballacre.obj [attack info]` 为空；该 `.atk` 是 etc attack info，不是 basic attack info。 |
| `boneshield.atk` | `[damage reaction] [none]` 与 `[hit info] -> [cut] [no blood] 0 0` | `boneshield.obj [attack info] -> AttackInfo/BoneShield.atk` | owner-listed 7 个 motion 已读；只有 `BoneShield/bone_rotate_none.ani` 观察到 `[ATTACK BOX]`，其它已读 motion 未观察到攻击框。 | 同一 `.obj` 的 basic/appear/dodge/rotate motion 不共享 hitbox 结论。 |

## BoneShield owner-listed motion 结果

| ANI | 主目标只读观察 |
| --- | --- |
| `BoneShield/blank.ani` | 空图帧，未观察到 `[ATTACK BOX]`。 |
| `BoneShield/bone_none.ani` | 未观察到 `[ATTACK BOX]`。 |
| `BoneShield/bone_dodge.ani` | 未观察到 `[ATTACK BOX]`。 |
| `BoneShield/appear_floor_none_b.ani` | 未观察到 `[ATTACK BOX]`。 |
| `BoneShield/appear_floor_dodge_b.ani` | 未观察到 `[ATTACK BOX]`。 |
| `BoneShield/bone_rotate_none.ani` | `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]`。 |
| `BoneShield/bone_rotate_dodge.ani` | 未观察到 `[ATTACK BOX]`。 |

## 相邻但不并入 PVP owner 结论

| 文件 / ANI | 主目标观察 |
| --- | --- |
| `Ballacre/attack_pierce.[pvp].ani` | 文件存在且已读到 `[ATTACK BOX]`，但 `ballacre.obj` 当前明列的是 `Animation/Ballacre/attack_pierce.ani`；是否运行时替换到 `.[pvp].ani` 不能由本账本静态证明。 |
| `ambitionofballacre.obj` | 该对象引用 `AmbitionOfBallacreAppear.atk` 与 `AmbitionOfBallacreHandGrab.atk`，未引用 `attack_pierce.atk`。 |
| `Judgement` 大量 floor / break / angel / effect motion | owner 中存在大量 etc motion；本账本只把已读取的 `Hit.ani` / `ExpHit.ani` 作为 hitbox 正样本，不把未读 motion 写成无攻击框。 |

## 方法规则

- `[etc attack info]` 与 `[etc motion]` 只证明同一 owner 中存在相邻列表；运行时序号映射仍需更深链路或实机验证。
- owner 搜索不能只靠小写 basename；`ballacre/attack_pierce.atk` 的 owner 是 `ballacre.obj [etc attack info]`，主 `[attack info]` 为空。
- 文件名带 `.[pvp].ani` 不能自动替代 `.obj` 明列的普通 ANI；只能写成相邻 PVP-named ANI 观察。
- PVP 块内字段只记录覆盖值，不解释竞技场最终公式。

## 未完成

- 本账本只完成 Priest / Swordman / Thief 目录中的 6 个 PVP `.atk` owner/ANI 审计，不代表公共对象、装备 passiveobject 或 zrr_skill PVP `.atk` 已闭合。
- `Judgement` 大量 owner-listed motion 尚未逐帧穷尽，只能登记已读命中相邻正样本和剩余静态风险。
- 实机 PVP 伤害、命中、浮空、击退、硬直、同步和资源显示仍需独立运行测试。
