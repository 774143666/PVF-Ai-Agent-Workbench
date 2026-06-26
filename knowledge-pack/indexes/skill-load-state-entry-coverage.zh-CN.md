# Skill / NUT load_state 入口覆盖只读账本

状态：默认可用

用途：记录当前主目标中 `sqr/character/*_load_state.nut` 的职业入口覆盖、推入脚本、注册 state、注册 passiveobject 和 API 边界。本文只证明入口链静态可见，不证明实战运行效果、伤害、命中、同步、PVP 规则或客户端资源完整。

## 总览

当前主目标 `sqr/character/` 下只读确认 12 个 `load_state` 入口：

```text
atfighter_load_state.nut
atgunner_load_state.nut
atmage_load_state.nut
avenger_load_state.nut
common_load_state.nut
creatormage_load_state.nut
fighter_load_state.nut
gunner_load_state.nut
mage_load_state.nut
priest_load_state.nut
swordman_load_state.nut
thief_load_state.nut
```

## 入口覆盖表

| 入口 | 只读观察 | 边界 |
| --- | --- | --- |
| `common_load_state.nut` | 推入 `Character/Common/common_header.nut`；循环给所有 job 注册 `Burster` state | `STATE_BURSTER` 和 `SKILL_BURSTER` 是常量链，需另查 header 才能解释数值。 |
| `atfighter_load_state.nut` | 推入 `Character/atfighter/passive_skill_atfighter.nut` | 只证明被动处理入口存在。 |
| `atgunner_load_state.nut` | 推入 `Character/atgunner/passive_skill_atgunner.nut` | 只证明被动处理入口存在。 |
| `fighter_load_state.nut` | 推入 `passive_skill_fighter.nut`、`fighter_common.nut`、`fighter_header.nut` | 只证明公共函数/header 被加载，不证明具体技能 state 已注册。 |
| `gunner_load_state.nut` | 推入 `Character/gunner/passive_skill_gunner.nut` | 已用 Gunner comminterrupt 做非 Swordman script-only 被动入口代表；不证明 load_state 直接注册 state。 |
| `mage_load_state.nut` | 推入 `character/mage/passive_skill_mage.nut` | 只证明被动处理入口存在。 |
| `priest_load_state.nut` | 推入 `new_priest` 被动脚本和 common；注册 `ReleaseBuffs` state | 已用 `ReleaseBuffs` 做 light state 代表；这是普通 Priest 入口，不等同于 `avenger_load_state.nut` 的 `CNAvenger` 专项入口。 |
| `swordman_load_state.nut` | 推入 `passive_skill_swordman.nut` 和 `qf_bloodyrave_bloodsword_common.nut` | 当前 Swordman 派生链依赖这里被加载。 |
| `thief_load_state.nut` | 推入 `new_thief/passive_skill_new_thief.nut` | 只证明被动处理入口存在。 |
| `atmage_load_state.nut` | 推入 header/common/passive；大量注册 AT Mage state；注册多组 passiveobject NUT | 当前主目标最重的 `IRDSQRCharacter` 职业入口之一。 |
| `creatormage_load_state.nut` | 推入 CreatorMage header/common/passive/mouse 控制库；注册 Creator state；注册 Creator passiveobject NUT | Creator 技能 ID 必须走 `skill/creatormage.lst`，不能和其他职业同号混用。 |
| `avenger_load_state.nut` | 使用 `CNAvenger.push*` 推入 Avenger header/common/passive、注册 Avenger state、注册 Avenger passiveobject NUT | `CNAvenger.pushState` 的签名不同于 `IRDSQRCharacter.pushState`，没有 job 参数。 |

## 被动脚本存在性

当前主目标中，与上述入口对应的被动脚本均存在：

```text
sqr/character/atfighter/passive_skill_atfighter.nut
sqr/character/atgunner/passive_skill_atgunner.nut
sqr/character/atmage/passive_skill_atmage.nut
sqr/character/creatormage/passive_skill_creatormage.nut
sqr/character/fighter/passive_skill_fighter.nut
sqr/character/gunner/passive_skill_gunner.nut
sqr/character/mage/passive_skill_mage.nut
sqr/character/new_priest/passive_skill_new_priest.nut
sqr/character/new_thief/passive_skill_new_thief.nut
sqr/character/priest/passive_skill_priest.nut
sqr/character/swordman/passive_skill_swordman.nut
```

存在性只证明文件在 PVF 内可读；被动函数是否被运行、以什么 skill_index/skill_level 调用，仍要结合引擎回调和实机。

## 代表性 passiveobject registry 核验

| 入口 | load_state 里的 ID | registry 解析 |
| --- | ---: | --- |
| `atmage_load_state.nut` | `24201` | `passiveobject/passiveobject.lst -> Character/Mage/ATWindStrike.obj` |
| `atmage_load_state.nut` | `24221` | `passiveobject/passiveobject.lst -> Character/Mage/ATCrystalCore.obj` |
| `atmage_load_state.nut` | `24217` | `passiveobject/passiveobject.lst -> Character/Mage/ATWaterCannon.obj` |
| `atmage_load_state.nut` | `24256` | `passiveobject/passiveobject.lst -> Character/Mage/ATWaterCannonExp.obj` |
| `atmage_load_state.nut` | `24227` | `passiveobject/passiveobject.lst -> Character/Mage/ATMagicCannon.obj` |
| `atmage_load_state.nut` | `24241` | `passiveobject/passiveobject.lst -> Character/Mage/ATChainLightning.obj` |
| `atmage_load_state.nut` | `24242` | `passiveobject/passiveobject.lst -> Character/Mage/ATChainLightningTarget.obj` |
| `atmage_load_state.nut` | `24218` | `passiveobject/passiveobject.lst -> Character/Mage/ATLightningWall.obj` |
| `atmage_load_state.nut` | `24212` | `passiveobject/passiveobject.lst -> Character/Mage/ATFireRoad1.obj` |
| `atmage_load_state.nut` | `24213` | `passiveobject/passiveobject.lst -> Character/Mage/ATFireRoad2.obj` |
| `atmage_load_state.nut` | `24243` | `passiveobject/passiveobject.lst -> Character/Mage/ATIceRoad.obj` |
| `atmage_load_state.nut` | `24244` | `passiveobject/passiveobject.lst -> Character/Mage/ATFlameCircle.obj` |
| `atmage_load_state.nut` | `24245` | `passiveobject/passiveobject.lst -> Character/Mage/ATBlueDragonWillExp.obj` |
| `atmage_load_state.nut` | `24246` | `passiveobject/passiveobject.lst -> Character/Mage/ATBlueDragonWillSub.obj` |
| `atmage_load_state.nut` | `24247` | `passiveobject/passiveobject.lst -> Character/Mage/ATFrozenLandMagicCircle.obj` |
| `atmage_load_state.nut` | `24248` | `passiveobject/passiveobject.lst -> Character/Mage/ATFrozenLandPole.obj` |
| `atmage_load_state.nut` | `24249` | `passiveobject/passiveobject.lst -> Character/Mage/ATFrozenLandExp.obj` |
| `atmage_load_state.nut` | `24222` | `passiveobject/passiveobject.lst -> Character/Mage/ATHolongLight.obj` |
| `atmage_load_state.nut` | `24223` | `passiveobject/passiveobject.lst -> Character/Mage/ATPieceOfIce.obj` |
| `atmage_load_state.nut` | `24224` | `passiveobject/passiveobject.lst -> Character/Mage/ATPieceOfIceCore.obj` |
| `atmage_load_state.nut` | `24202` | `passiveobject/passiveobject.lst -> Character/Mage/ATMagicBallNone.obj` |
| `atmage_load_state.nut` | `24203-24206` | `passiveobject/passiveobject.lst -> Character/Mage/ATMagicBallFire/Water/Dark/Light.obj` |
| `creatormage_load_state.nut` | `24353` | `passiveobject/passiveobject.lst -> Character/Mage/CreatorMicroAttack.obj` |
| `creatormage_load_state.nut` | `24354` | `passiveobject/passiveobject.lst -> Character/Mage/CreatorWoodFence.obj` |
| `creatormage_load_state.nut` | `24355` | `passiveobject/passiveobject.lst -> Character/Mage/CreatorWindPress.obj` |
| `creatormage_load_state.nut` | `24356` | `passiveobject/passiveobject.lst -> Character/Mage/CreatorWindStorm.obj` |
| `avenger_load_state.nut` | `24100` | `passiveobject/passiveobject.lst -> Character/Priest/Spincutter.obj` |
| `avenger_load_state.nut` | `24107` | `passiveobject/passiveobject.lst -> Character/Priest/PowerOfDarknessCircle.obj` |
| `avenger_load_state.nut` | `24108` | `passiveobject/passiveobject.lst -> Character/Priest/PowerOfDarknessArrow.obj` |

这些只作为 registry 走法样本：`pushPassiveObj(path, index)` 的 `index` 必须按 `passiveobject/passiveobject.lst` 解析，不能用 skill、monster、APC 或 map registry 代替。

## API 边界

| API 族 | 当前主目标用法 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.pushScriptFiles(path)` | 大多数职业入口用于推入 header/common/passive NUT | 推入脚本不等于注册技能 state。 |
| `IRDSQRCharacter.pushState(job, filePath, sklName, state, skillIndex)` | `common`、`priest`、`atmage`、`creatormage` 等入口使用 | 第一个参数是 job 常量；`skillIndex=-1` 表示不绑定具体技能。 |
| `IRDSQRCharacter.pushPassiveObj(path, index)` | `atmage`、`creatormage` 大量使用 | `index` 必须走 `passiveobject/passiveobject.lst`。 |
| `CNAvenger.pushScriptFiles(path)` | `avenger_load_state.nut` 使用 | 只用于 Avenger 入口族，不要和 `IRDSQRCharacter` 随意混写。 |
| `CNAvenger.pushState(filePath, sklName, state, skillIndex)` | `avenger_load_state.nut` 使用 | 没有 job 参数；当前上下文隐含 Avenger。 |
| `CNAvenger.pushPassiveObj(path, index)` | `avenger_load_state.nut` 使用 | `index` 同样走 `passiveobject/passiveobject.lst`。 |

## 当前可用判断

| 问题 | 判断 |
| --- | --- |
| 新建 NUT 文件会不会自动运行 | 不会。必须被已有 load_state 或已加载脚本推入。 |
| Swordman 当前 QF 派生链为什么能进入 | `swordman_load_state.nut` 明确推入 `passive_skill_swordman.nut` 和公共函数脚本。 |
| AT Mage 当前原生 WindStrike PO 为什么能进入 | `atmage_load_state.nut` 明确注册 WindStrike state 和 `24201` passiveobject NUT。 |
| AT Mage 当前原生 CrystalAttack PO 为什么能进入 | `atmage_load_state.nut` 明确注册 CrystalAttack state 和 `24221` passiveobject NUT。 |
| AT Mage 当前 DarkChange 为什么能进入 | `atmage_load_state.nut` 明确注册 `DarkChange` state 到 `STATE_DARK_CHANGE / SKILL_DARK_CHANGE`；当前 `dark_change.nut` 按 READY/START 两段 substate 处理攻击包、攻击盒缩放和失明分支。 |
| DarkChange 是否需要 passiveobject registry | 当前链不需要。DarkChange 本体是 state + 角色自定义 AttackInfo + 动画攻击盒缩放 + 直接异常状态包/PVP AttackInfo 分支，不要把它当成 `pushPassiveObj(path, index)` 链。 |
| AT Mage 当前原生 WaterCannon PO 为什么能进入 | `atmage_load_state.nut` 明确注册 WaterCannon state，并注册 `24217` 主水球 PO 与 `24256` 爆炸 PO 的 NUT。 |
| AT Mage 当前 ElementalChange 为什么走 Throw/appendage | `atmage_load_state.nut` 同时注册 ElementalChange state 与 `STATE_THROW`；ElementalChange 当前脚本发送 `STATE_THROW`，Throw 后置处理挂 ElementalChange appendage。 |
| AT Mage 当前 MagicShield 为什么能进入 | `atmage_load_state.nut` 明确注册 `MagicShield` state 到 `STATE_MAGIC_SHIELD / SKILL_MAGIC_SHIELD`；角色 `MagicShield.ani` 的 keyframe 再挂 `ap_MagicShield.nut`。 |
| MagicShield 是否需要 passiveobject registry | 当前链不需要。MagicShield 本体是 state + appendage + draw-only 动画 + 动态攻击包；不要把它当成 `pushPassiveObj(path, index)` 链。 |
| AT Mage 当前 ManaBurst 为什么走 Throw/appendage | `atmage_load_state.nut` 明确注册 `ManaBurst` state 和 `STATE_THROW`；当前 `ManaBurst.nut` 释放入口实际发送 `STATE_THROW`，Throw 后置在 `throwState == 1` 时挂 `ap_ATMage_ManaBurst.nut`。 |
| ManaBurst 是否需要 passiveobject registry | 当前链不需要。ManaBurst 本体是 Throw + appendage + 技能使用前后 MP 倍率回调 + 百分比攻击力加成，不要把它当成 `pushPassiveObj(path, index)` 链。 |
| AT Mage 当前 Teleport 为什么能进入 | `atmage_load_state.nut` 明确注册 `Teleport` state 到 `STATE_TELEPORT / SKILL_TELEPORT`；当前 `Teleport.nut` 用 `SUB_STATE_TELEPORT_0 -> 1` 两段 state 流程处理位移。 |
| Teleport 是否需要 passiveobject registry | 当前链不需要。Teleport 本体是 state + substate + 输入方向 + 静态距离 + 可移动位置查找 + 体效 appendage，不要把它当成 `pushPassiveObj(path, index)` 链。 |
| AT Mage 当前 MagicCannon 为什么能进入 | `atmage_load_state.nut` 明确注册 `MagicCannon` state 到 `STATE_MAGIC_CANNON / SKILL_MAGIC_CANNON`，并注册 `24227` 的 `po_MagicCannon.nut`；当前 `MagicCannon.nut` 在角色 keyframe 上创建该 PO。 |
| MagicCannon 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24227` 窄链。`24227` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATMagicCannon.obj`，不要外推到其他 PO 或重开广域采样。 |
| AT Mage 当前 ChainLightning 为什么能进入 | `atmage_load_state.nut` 明确注册 `ChainLightning` state 到 `STATE_CHAINLIGHTNING / SKILL_ATCHAINLIGHTNING`，并注册 `24241` 的 `po_ATChainLightning.nut` 与 `24242` 的 `po_ATChainLightningTarget.nut`；当前 `ChainLightning.nut` 在持续 substate 创建 `24241`，再由 `24241` 创建 `24242`。 |
| ChainLightning 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24241/24242` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析，不要因显示名复用或数字相近外推到其他 PO。 |
| AT Mage 当前 LightningWall 为什么能进入 | `atmage_load_state.nut` 明确注册 `LightningWall` state 到 `STATE_LIGHTNING_WALL / SKILL_LIGHTNING_WALL`，并注册 `24218` 的 `po_LightningWall.nut`；当前 `LightningWall.nut` 在 keyframe flag 1 创建 `24218`，frame `> 20` 时发送 move state。 |
| LightningWall 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24218` 窄链。`24218` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATLightningWall.obj`，不要因显示名“火焰爆炸”复用或数字相近外推到其他 PO。 |
| AT Mage 当前 FireRoad 为什么能进入 | `atmage_load_state.nut` 明确注册 `FireRoad` state 到 `STATE_FIRE_ROAD / SKILL_FIRE_ROAD`，并注册 `24212/24213` 的 `po_fire_road.nut`；当前 `FireRoad.nut` 在 substate 0 的 keyframe 回调创建交替的 `24212/24213` 火柱 PO。 |
| FireRoad 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24212/24213` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATFireRoad1.obj` 和 `Character/Mage/ATFireRoad2.obj`；显示名同为“火焰爆炸”不能当语义依据。 |
| AT Mage 当前 IceRoad 为什么能进入 | `atmage_load_state.nut` 明确注册 `IceRoad` state 到 `STATE_ICEROAD / SKILL_ICEROAD`，并注册 `24243` 的 `po_ATIceRoad.nut`；当前 `IceRoad.nut` 能进入 CASTING 后追加 `ap_ATMage_IceRoad.nut`。 |
| IceRoad 是否需要 passiveobject registry | 需要，但当前只闭合到注册，不闭合到可执行创建。`24243` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATIceRoad.obj`；当前可读 NUT 中创建 `24243` 的逻辑为注释，不能写成已运行 PO 链。 |
| AT Mage 当前 IceSword 为什么能进入 | `atmage_load_state.nut` 明确注册 `IceSword` state 到 `STATE_ICE_SWORD / SKILL_ICE_SWORD`；当前 `IceSword.nut` 直接进入 state 27，没有 substate 向量。 |
| IceSword 是否需要 passiveobject registry | 当前链不需要。IceSword 本体是 state + 角色自定义动画 + AttackInfo 切换 + EX 动画回卷；当前只读未见 IceSword 专属 `pushPassiveObj` 或创建 PO 调用。 |
| AT Mage 当前 FlameCircle 为什么能进入 | `atmage_load_state.nut` 明确注册 `FlameCircle` state 到 `STATE_FLAMECIRCLE / SKILL_FLAMECIRCLE`，并注册 `24244` 的 `po_ATFlameCircle.nut`；当前 `FlameCircle.nut` 在 substate 0 frame `>= 2` 创建旋转火环 PO。 |
| FlameCircle 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24244` 窄链。`24244` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATFlameCircle.obj`；显示名“火焰爆炸”不能当语义依据。 |
| AT Mage 当前 BlueDragonWill 为什么能进入 | `atmage_load_state.nut` 明确注册 `BlueDragonWill` state 到 `STATE_BLUEDRAGONWILL / SKILL_BLUEDRAGONWILL`，并注册 `24245` 的 `po_ATBlueDragonWillExp.nut` 与 `24246` 的 `po_ATBlueDragonWillSub.nut`；当前 `BlueDragonWill.nut` 在 substate 2 创建两个 PO。 |
| BlueDragonWill 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24245/24246` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATBlueDragonWillExp.obj` 与 `Character/Mage/ATBlueDragonWillSub.obj`；显示名“火焰爆炸”不能当语义依据。 |
| AT Mage 当前 FrozenLand 为什么能进入 | `atmage_load_state.nut` 明确注册 `FrozenLand` state 到 `STATE_FROZENLAND / SKILL_FROZENLAND`，并注册 `24247` 的 `po_ATFrozenLandMagicCircle.nut`、`24248` 的 `po_ATFrozenLandPole.nut` 与 `24249` 的 `po_ATFrozenLandExp.nut`；当前 `FrozenLand.nut` 在 substate 0 创建 `24247`，再由 PO 链级联。 |
| FrozenLand 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24247/24248/24249` 窄链。三者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATFrozenLandMagicCircle.obj`、`Character/Mage/ATFrozenLandPole.obj` 与 `Character/Mage/ATFrozenLandExp.obj`；显示名“火焰爆炸”不能当语义依据。 |
| AT Mage 当前 HolongLight 为什么能进入 | `atmage_load_state.nut` 明确注册 `HolongLight` state 到 `STATE_HOLONG_LIGHT / SKILL_HOLONG_LIGHT`，并注册 `24222` 的 `po_ATHolongLight.nut`；当前 `HolongLight.nut` 在角色 keyframe flag 1 创建两个 `24222`，再次施放时命令已有 `24222` 射出。 |
| HolongLight 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24222` 窄链。`24222` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATHolongLight.obj`；再次施放依赖已创建 PO 和 skill-load，不要写成重新进入 state。 |
| AT Mage 当前 PieceOfIce 为什么能进入 | `atmage_load_state.nut` 明确注册 `PieceOfIce` state 到 `STATE_PIECE_OF_ICE / SKILL_PIECE_OF_ICE`，并注册 `24223` shard 与 `24224` core 的 NUT；当前 `PieceOfIce.nut` 在角色 keyframe flag 1 创建 core，后续 flags 命令 core 并批量创建 shard。 |
| PieceOfIce 是否需要 passiveobject registry | 需要，但只限本技能创建的 `24223/24224` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/ATPieceOfIce.obj` 与 `Character/Mage/ATPieceOfIceCore.obj`；`24224` core 不是当前攻击来源。 |
| Common 当前 Burster 为什么能进入 | `common_load_state.nut` 明确推入 `common_header.nut`，并循环执行 `IRDSQRCharacter.pushState(i, "Character/Common/Burster/Burster.nut", "Burster", STATE_BURSTER, SKILL_BURSTER)`；header 闭合到 `STATE_BURSTER = 100` / `SKILL_BURSTER = 198`。 |
| Common Burster 的 skill 文件是否按 registry 闭合 | 当前未在职业 `*skill.lst` 中把 `198` 闭合到普通 registry 条目；当前只读确认 `skill/atmage/burster.skl`、`skill/swordman/burster.skl`、`skill/priest/burster.skl` 等同名文件存在且可读。不能写成“198 已按职业 registry 全闭合”。 |
| Gunner 当前 comminterrupt 为什么能进入脚本环境 | `gunner_load_state.nut` 明确推入 `Character/gunner/passive_skill_gunner.nut`；该脚本的 `ProcPassiveSkill_Gunner` 在 `skill_index == 254` 且等级大于 0 时追加 `character/gunner/appendage/ap_gunner_comminterrupt.nut`；`skill/gunnerskill.lst` 闭合 `254 -> Gunner/gunner_comminterrupt.skl`。 |
| Gunner comminterrupt 是否是 load_state 直接 state 注册 | 不是。当前入口是 script-only 被动回调 + appendage proc；appendage 内部再按条件调用 `setSkillCommandEnable`、`sq_IsEnterSkill`、`sq_IsUseSkill` 和 `sq_AddSetStatePacket`。 |
| Priest 当前 ReleaseBuffs 为什么能进入 | `priest_load_state.nut` 明确注册 `ReleaseBuffs` 到 `ENUM_CHARACTERJOB_PRIEST / state 0 / skill 222`；`skill/priestskill.lst` 闭合 `222 -> priest/priestnewskill/ReleaseBuffs.skl`；`new_priest_common.nut` 的 `procAppend_Priest` 会调用 `useBuffSkills(obj)` 推进队列。 |
| Priest ReleaseBuffs 是否需要 passiveobject registry | 当前链不需要。它是 light state + 变量队列 + `sq_AddSetStatePacket(13, STATE_PRIORITY_IGNORE_FORCE, true)` 的批量 buff 调度链，不是 `pushPassiveObj(path, index)` 链。 |
| CreatorMage 当前 Mgrab 为什么能进入脚本环境 | `creatormage_load_state.nut` 明确推入 `Character/CreatorMage/Mgrab/Mgrab.nut`，header 闭合到 `STATE_MGRAB = 61` / `SKILL_MGRAB = 137`，skill registry 闭合到 `skill/creatormage.lst -> CreatorMage/mgrab.skl`；当前 load_state 未见 `Mgrab` 的直接 `pushState` 行。 |
| CreatorMage 当前 WindPress 为什么能进入 | `creatormage_load_state.nut` 明确注册 `WindPress` state 到 `STATE_WINDPRESS / SKILL_WINDPRESS`，header 闭合到 `STATE_WINDPRESS = 67` / `SKILL_WINDPRESS = 248`，skill registry 闭合到 `skill/creatormage.lst -> CreatorMage/WindPress.skl`。 |
| CreatorMage WindPress 是否需要 passiveobject registry | 需要，但只限本代表技能创建的 `24355` 窄链。`24355` 必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Mage/CreatorWindPress.obj`；显示名“高马力魔法导弹”不能当语义依据。 |
| Avenger 是否走普通 `IRDSQRCharacter.pushState` 签名 | 不是。当前 `avenger_load_state.nut` 使用 `CNAvenger.pushState(filePath, sklName, state, skillIndex)`。 |
| Avenger 当前 Spincutter 为什么能进入 | `avenger_load_state.nut` 使用 `CNAvenger.pushState("Character/Priest/Spincutter.nut", "spincutter", STATE_SPINCUTTER, SKILL_SPINCUTTER)`，header 闭合到 `STATE_SPINCUTTER = 61` / `SKILL_SPINCUTTER = 113`，skill registry 闭合到 `skill/priestskill.lst -> Priest/Spincutter.skl`。 |
| Avenger Spincutter 是否需要 passiveobject registry | 需要，但只限本代表技能创建的 `24100/24101` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Priest/Spincutter.obj` 与 `Character/Priest/SpincutterThrow.obj`；显示名“破魔符”不能当语义依据。 |
| Avenger 当前 PowerOfDarkness 为什么能进入 | `avenger_load_state.nut` 使用 `CNAvenger.pushState("Character/Priest/PowerOfDarkness.nut", "PowerOfDarkness", STATE_POWER_OF_DARKNESS, SKILL_POWER_OF_DARKNESS)`，header 闭合到 `STATE_POWER_OF_DARKNESS = 71` / `SKILL_POWER_OF_DARKNESS = 125`，skill registry 闭合到 `skill/priestskill.lst -> Priest/PowerOfDarkness.skl`。 |
| Avenger PowerOfDarkness 是否需要 passiveobject registry | 需要，但只限本代表技能创建的 `24107/24108` 窄链。两者必须按 `passiveobject/passiveobject.lst` 解析为 `Character/Priest/PowerOfDarknessCircle.obj` 与 `Character/Priest/PowerOfDarknessArrow.obj`；显示名“意念驱动”不能当语义依据。 |
| 只看到 `.nut` 文件存在能否写成已加载 | 不能。必须看到入口推入或被已加载脚本调用。 |

## 风险边界

- `load_state` 只证明入口注册，不证明技能条件、冷却、伤害、命中、浮空、卡肉、同步或 PVP 最终表现。
- Header 常量如 `STATE_*`、`SKILL_*` 的具体数值要另查对应 header 或 registry。
- `path` 大小写在 PVF 工具里可读，不等于所有运行环境都无大小写风险；写入实验仍应沿用目标文件现有大小写风格。
- 当前账本不展开每个 state 文件内部逻辑；后续按高覆盖矩阵抽代表样本，只有发现新 API 类别或明确缺口时才回到具体技能窄桶，不逐技能穷举。

## 下一步验收

1. 若继续 Swordman 主线，优先围绕已加载的 `passive_skill_swordman.nut` 和公共函数脚本做窄桶。
2. 若继续 AT Mage 主线，可从 `WindStrike` / `CrystalAttack` / `WaterCannon` / `MagicCannon` / `ChainLightning` / `LightningWall` / `FireRoad` / `IceRoad` / `IceSword` / `FlameCircle` / `BlueDragonWill` / `FrozenLand` / `HolongLight` / `PieceOfIce` 原生 state/PO 或 state/AttackInfo 链，或 `ElementalChange` / `ManaBurst` / `Teleport` 的 state/appendage 链继续。
3. 若继续 Avenger 主线，先按 `CNAvenger` API 族单独建账，不能套用 `IRDSQRCharacter.pushState` 的参数形状。

## 高覆盖路线更新

上述“下一步验收”保留为旧的窄桶入口清单，但后续默认不再按 AT Mage、Avenger、CreatorMage、Common、非 Swordman 被动或 Priest 技能顺序推进。当前主线应先读 `indexes/skill-state-nut-runtime-high-coverage-matrix.zh-CN.md`，按入口 API 族和运行模式补代表样本；现阶段只剩 API 分组视图和最终验收收口。只有发现新 API 类别或明确缺口时，才回到具体技能窄桶。
