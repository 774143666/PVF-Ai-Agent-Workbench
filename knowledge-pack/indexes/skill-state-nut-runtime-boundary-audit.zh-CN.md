# Skill / State / NUT Runtime Boundary 只读核验索引

状态：默认可用

用途：作为 Skill / State / NUT 运行时主线的第一层核验账本。本文只记录主目标 PVF 只读可见的入口链、state/substate 参数、NUT API 边界和风险；不授权写 PVF，不替代游戏内验证。

## 核验范围

- skill registry 到 `.skl` 的解析。
- `.skl` 基础字段、`[executable states]`、`[static data]` 与运行时脚本之间的边界。
- `sqr/character/*_load_state.nut`、`pushScriptFiles`、`pushState`、`pushPassiveObj` 入口链。
- appendage `proc` 轮询触发 state 切换。
- TypeSquirrel 可查到的核心 API 名称和参数边界。

不包含：

- 伤害、命中、卡肉、击退、浮空、同步、PVP 最终表现。
- 客户端资源完整性。
- PassiveObject / AttackInfo / Hitbox 广域扩样本。

## 主目标只读已确认

| 事实 | 主目标观察 | 边界 |
| --- | --- | --- |
| 鬼剑士技能 registry | `skill/swordmanskill.lst` 中 `79 -> Swordman/BloodyRave.skl`、`81 -> Swordman/OutRageBreak.skl`、`103 -> Swordman/BloodSword.skl` | 只证明 ID 到 `.skl` 路由，不证明任何运行效果。 |
| 男法技能 registry | `skill/atmageskill.lst` 中 `1 -> ATMage/WindStrike.skl` | 只证明 Wind Strike 的技能 ID 路由。 |
| load_state 入口覆盖 | `sqr/character/` 下确认 12 个 `*_load_state.nut`：common、swordman、atmage、creatormage、avenger 等 | 证明当前主目标入口分布；不证明每个 state 的内部行为。 |
| 鬼剑士 load_state | `sqr/character/swordman_load_state.nut` 推入 `passive_skill_swordman.nut` 和 `qf_bloodyrave_bloodsword_common.nut` | 证明脚本入口存在；是否稳定运行仍以实机为准。 |
| BloodyRave -> BloodSword appendage | `passive_skill_swordman.nut` 会追加 `ap_qf_bloodyrave_bloodsword.nut`；appendage 内判断 `state == 43` 且当前帧 `>= 4` 后尝试 `103 -> state 60 / substate [102]` | 这是主目标当前可读的最小派生链。 |
| swordman comminterrupt / skill 254 | `skill/swordmanskill.lst` 中 `254 -> swordman/swordman_comminterrupt.skl`；`passive_skill_swordman.nut` 在 `skill_index == 254` 且 `skill_level > 0` 时追加 `ap_swordman_comminterrupt.nut` | 证明当前主目标存在被动挂接链；不证明角色默认已学习或 Frenzy 脚本变量稳定。 |
| swordman comminterrupt 可达性 | 当前只读未在 swordman SP/TP 技能树、PVP 技能树、角色默认技能表、取消技能表、公共技能表或 `n_quest/` 任务文件中找到 `254` 可达入口 | 不能排除角色存档、服务端逻辑、外部脚本或运行时注入。 |
| comminterrupt 参数证据 | `ap_swordman_comminterrupt.nut` 中 `SetSkillState(103,60,[102])`、`SetSkillState(81,45,[0,1])`、`SetSkillState(79,43,[0])` 可读 | 可作为同目标 PVF 内参数线索；不等同于这些技能都会被当前 qf appendage 主动触发。 |
| 角色动作锚点 | `character/swordman/swordman.chr` 的 `[etc motion]` 中存在 `BloodyRaveInhale.ani`、`BloodyRaveSlash.ani`、`OutRageBreakReady.ani`、`OutRageBreakSlash.ani`、`BloodSwordMake.ani`、`BloodSwordCharge.ani` | 说明动作资源索引可核；帧窗口仍要读 `.ani` 或实测。 |
| Wind Strike 原生链 | `atmage_load_state.nut` 注册 Wind Strike state 和原生 `24201` passiveobject；`wind_strike.nut` 在 keyframe 1 创建 `24201`；`windstrike.ani` 的 `FRAME002` 有 `[SET FLAG] 1` | 详见 `indexes/skill-atmage-windstrike-native-chain.zh-CN.md`；静态只读不能证明命中、伤害、浮空或同步。 |
| CrystalAttack 原生链 | `atmage_load_state.nut` 注册 CrystalAttack state 和 `24221` passiveobject；state NUT 通过 `onProc + setTimeEvent` 创建 PO；PO 在自身 `FRAME002 [SET FLAG] 1` 上写入当前攻击倍率 | 详见 `indexes/skill-atmage-crystalattack-native-chain.zh-CN.md`；静态只读不能证明创建节奏、命中、伤害、冰属性最终规则或屏幕震动。 |
| DarkChange State/Blind/AttackInfo 链 | `skill 4` 注册到 `STATE_DARK_CHANGE = 23`；角色按 `READY(0) -> START(1)` 两段 substate 运行，READY 设置 `CUSTOM_ATTACK_INFO_DARK_CHANGE` 与攻击倍率，START 缩放当前动画攻击盒；非 PVP 用 active object 回调直接发送失明包，PVP 在 onAttack 中把失明写入 AttackInfo | 详见 `indexes/skill-atmage-darkchange-state-blind-attackinfo-chain.zh-CN.md`；当前链不创建 PO，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、失明触发、抗性、PVP、同步或攻击盒还原。 |
| WaterCannon 原生链 | `atmage_load_state.nut` 注册 WaterCannon state 和 `24217/24256` passiveobject；角色 `watercannon.ani` 在 `FRAME005 [SET FLAG] 1` 创建 `24217`，主 PO 命中后在目标位置创建 `24256` | 详见 `indexes/skill-atmage-watercannon-native-chain.zh-CN.md`；静态只读不能证明轨迹、命中、爆炸范围、击倒、推开、浮空或同步。 |
| ElementalChange Throw/appendage 链 | `skill 5` 的 checkExecutable 实际切到 `STATE_THROW`，用 int vector 传 `SKILL_ELEMENTAL_CHANGE`；Throw 后置处理挂 `ap_ATMage_Elemental_Change.nut`，基础攻击按 appendage 和 `throwElement` 切换 magic ball ID | 详见 `indexes/skill-atmage-elementalchange-throw-appendage-chain.zh-CN.md`；静态只读不能证明选择 UI、buff 显示、属性异常、爆炸范围或同步。 |
| MagicShield Buff/appendage 链 | `skill 19` 注册到 `STATE_MAGIC_SHIELD = 38`；`MagicShield.ani` 的 `FRAME003 [SET FLAG] 1` 挂 `ap_MagicShield.nut`；appendage 处理持续减伤、元素盾动画、火/水/光/暗受击分支，并与 ElementalChange 的 `throwElement` 联动 | 详见 `indexes/skill-atmage-magicshield-buff-appendage-chain.zh-CN.md`；静态只读不能证明最终减伤、反击伤害、完全防御、僵直、减速、Buff UI、PVP 或同步。 |
| ManaBurst Throw/Buff 链 | `skill 28` 注册到 `STATE_MANABURST = 44`，但当前 `checkExecutable` 实际发送 `STATE_THROW`；Throw 后置在 `throwState == 1` 时挂 `ap_ATMage_ManaBurst.nut`，appendage 增加百分比攻击力，`useSkill_before_ATMage` 临时提高技能 MP 消耗倍率 | 详见 `indexes/skill-atmage-manaburst-throw-buff-chain.zh-CN.md`；静态只读不能证明最终伤害、最终 MP、动作取消、Buff UI、PVP、声音或同步。 |
| Teleport 位移 state 链 | `skill 20` 注册到 `STATE_TELEPORT = 39`；当前链用 `SUB_STATE_TELEPORT_0 -> 1` 两段动作，读取输入方向与 `.skl static data[0/1]` 计算候选坐标，再调用可移动位置查找并回到站立 | 详见 `indexes/skill-atmage-teleport-movement-state-chain.zh-CN.md`；静态只读不能证明最终落点、绕障、无敌、镜头手感、PVP、同步或客户端资源完整性。 |
| MagicCannon State/PO 链 | `skill 18` 注册到 `STATE_MAGIC_CANNON = 37`；地面释放进入 `LAND(4)`，空中释放先 `CHARGE(0)` 再按方向键进入 `HORIZON(1)`、`VERTICAL(2)` 或 `DIAGONAL(3)`；角色 keyframe 创建 `24227`，PO 读取发射位置和元素类型两个 word 后切 SHOOT、改写攻击包或创建普通元素攻击 | 详见 `indexes/skill-atmage-magiccannon-state-po-chain.zh-CN.md`；这是本技能创建的 PO 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、轨迹、反冲手感、异常、PVP、同步或资源完整性。 |
| ChainLightning State/PO 链 | `skill 2` 注册到 `STATE_CHAINLIGHTNING = 25`；角色按 cast/持续/end 三段 substate 运行，持续段写入搜索范围、链接数、持续时间、攻击倍率和多段次数后创建 `24241`；`24241` 负责找目标和画链路，逐段创建 `24242` 贴目标发送即时与 timer 多段命中 | 详见 `indexes/skill-atmage-chainlightning-state-po-chain.zh-CN.md`；这是本技能创建的 `24241/24242` 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明随机传导、命中、伤害、击退、浮空、霸体、PVP、同步或资源完整性。 |
| LightningWall State/PO/appendage 链 | `skill 29` 注册到 `STATE_LIGHTNING_WALL = 46`；角色无 substate，frame flag 1 写入移动距离、攻击倍率、触电参数后创建 `24218`，frame `> 20` 发送 move；`24218` 用移动粒子推进、写光属性 AttackInfo，并在 onAttack 中按 holdable/grabable/non-fixture 条件追加 `ap_LightningWall.nut` | 详见 `indexes/skill-atmage-lightningwall-state-po-appendage-chain.zh-CN.md`；这是本技能创建的 `24218` + appendage 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、触电、控制、轨迹、PVP、同步或资源完整性。 |
| FireRoad State/PO 链 | `skill 6` 注册到 `STATE_FIRE_ROAD = 24`；角色按 substate `0 -> 1` 运行，CAST1 frame 2 flag 创建交替 `24212/24213` 火柱；PO 初始用 `ATFireRoad1.atk` 和第一次攻击倍率，在自身 frame 15 等待父角色进入 substate 1 或离开 FireRoad 后切 `ATFireRoad2.atk` 和第二次攻击倍率 | 详见 `indexes/skill-atmage-fireroad-state-po-chain.zh-CN.md`；这是本技能创建的 `24212/24213` 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、暂停时序、击倒、推开、浮空、PVP、同步或资源完整性。 |
| IceRoad State/appendage/disabled PO 边界 | `skill 7` 注册到 `STATE_ICEROAD = 26`；释放流程为 `CASTING(5) -> 0`，substate 0 按 frame 追加 `ap_ATMage_IceRoad.nut` 与通用视觉 appendage，并调用 `setSealActiveFunction(false)`；`24243` 已注册为 `ATIceRoad.obj`，但当前可读 NUT 未闭合到实际创建入口，主 appendage 中创建 `24243` 与扣 MP 逻辑为注释 | 详见 `indexes/skill-atmage-iceroad-state-appendage-disabled-po-boundary.zh-CN.md`；这是 IceRoad 的 state/appendage/未闭合 PO 创建入口窄桶，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明扣 MP、冰雾生成、减速、冰冻、命中、PVP、同步或资源完整性。 |
| IceSword State/AttackInfo/EX 回卷链 | `skill 8` 注册到 `STATE_ICE_SWORD = 27`；当前链无 substate、无 PO，角色动作 10 通过 keyframe flag 1/2/3 切换第一段/最后段 AttackInfo、写减速参数；`IceSwordEx` 等级大于 0 时非 PVP 在 flag 3 把当前动画回卷到 frame 0 一次，PVP 跳过回卷 | 详见 `indexes/skill-atmage-icesword-state-attackinfo-ex-rewind-chain.zh-CN.md`；这是 state + AttackInfo + 动画回卷窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、减速、第三击替代、PVP、同步或资源完整性。 |
| FlameCircle State/PO/appendage 链 | `skill 11` 注册到 `STATE_FLAMECIRCLE = 30`；角色按 `CASTING(5) -> 0 -> 1 -> 2` 运行，substate 0 frame `>= 2` 写入旋转次数、半径、速度和攻击倍率后创建 `24244`；`24244` 循环旋转、多段命中并标记完成，角色随后用 `FlameCircle3.ani` 和 `CUSTOM_ATTACK_INFO_FLAMECIRCLE` 做爆炸段，同时追加通用视觉 appendage | 详见 `indexes/skill-atmage-flamecircle-state-po-appendage-chain.zh-CN.md`；这是本技能创建的 `24244` + 视觉 appendage 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、旋转节奏、爆炸范围、击飞、PVP、同步或资源完整性。 |
| BlueDragonWill State/Target/PO 链 | `skill 12` 注册到 `STATE_BLUEDRAGONWILL = 31`；角色按 `0 -> 1 -> 2` 三段 substate 运行，substate 0 用 `findAngleTarget` 找前方目标，substate 1 按目标或默认距离前冲，substate 2 写包创建 `24246` 冲击波 PO 与 `24245` 冰锤/爆炸 PO | 详见 `indexes/skill-atmage-bluedragonwill-state-target-po-chain.zh-CN.md`；这是本技能创建的 `24245/24246` 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明锁定、命中、伤害、前冲绕障、击退、浮空、PVP、同步或资源完整性。 |
| FrozenLand State/PO/appendage 链 | `skill 13` 注册到 `STATE_FROZENLAND = 32`；角色按 `CASTING(5) -> 0 -> 1 -> 2 -> 3` 运行，substate 0 frame `>= 4` 写入 10 个 dword 后创建 `24247` MagicCircle；MagicCircle 创建两个 `24248` Pole，Pole 旋转/回收结束后创建 `24249` Exp，并尝试追加 `ap_common_suck.nut` aura 吸附链 | 详见 `indexes/skill-atmage-frozenland-state-po-appendage-chain.zh-CN.md`；这是本技能创建的 `24247/24248/24249` + aura appendage 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、冰冻、吸附、旋转轨迹、PVP、同步或资源完整性。 |
| Avenger Spincutter CNAvenger State/PO 代表链 | `skill 113` 注册到 `STATE_SPINCUTTER = 61`；`avenger_load_state.nut` 使用 `CNAvenger.pushState` 和 `CNAvenger.pushPassiveObj`，角色 THROW substate 创建 `24101` 初段 PO 和 `24100` 召回/多段 PO；`24100` 按父角色 substate 切 recall 并用 timer 重置命中列表 | 详见 `indexes/skill-avenger-cnapi-spincutter-representative-chain.zh-CN.md`；这是 Avenger `CNAvenger state + PO` 代表样本，不是 Avenger 全技能盘点；静态只读不能证明命中、伤害、多段次数、召回手感、PVP、同步或资源完整性。 |
| Avenger PowerOfDarkness 形态/专用 API 代表链 | `skill 125` 注册到 `STATE_POWER_OF_DARKNESS = 71`；`avenger_load_state.nut` 使用 `CNAvenger.pushState` 和 `CNAvenger.pushPassiveObj`，PowerOfDarkness 在 START/LIFT/EXPLOSION/LAST/END 多 substate 中创建 `24107` circle 与 `24108` arrow，并使用 appendage、hold/move、time event、flash screen 与全局 PO 创建函数 | 详见 `indexes/skill-avenger-cnapi-powerofdarkness-representative-chain.zh-CN.md`；这是 Avenger 形态/专用 API 代表样本，不是 Avenger 全技能盘点；静态只读不能证明抓取成功率、命中、伤害、浮空、PVP、同步或资源完整性。 |
| CreatorMage Hybrid / Mouse-Control 代表链 | `creatormage_load_state.nut` 同时推入 mouse-control 脚本库、script-file 技能库、state 和 PO；`Mgrab` 代表 script-file/mouse-control 链，`WindPress` 代表 `STATE_WINDPRESS = 67` + `24355` PO 链 | 详见 `indexes/skill-creatormage-hybrid-mousecontrol-representative-chain.zh-CN.md`；这是 CreatorMage hybrid 代表样本，不是 CreatorMage 全技能盘点；静态只读不能证明鼠标手感、抓取成功率、命中、能量消耗、PVP、同步或资源完整性。 |
| Common Burster 公共循环 State 代表链 | `common_load_state.nut` 循环给全部 job 注册 `Character/Common/Burster/Burster.nut`；common header 闭合到 `STATE_BURSTER = 100` / `SKILL_BURSTER = 198`；Burster state 追加 `ap_Common_Burster.nut` 并写速度、冷却和伤害倍率相关链 | 详见 `indexes/skill-common-burster-public-loop-state-representative-chain.zh-CN.md`；这是 Common loop state 代表样本，不是逐职业 Burster 盘点；静态只读不能证明是否学会、冷却 UI、最终伤害、PVP、同步或资源完整性。 |
| Gunner Passive Comminterrupt script-only 代表链 | `gunner_load_state.nut` 只推入 `Character/gunner/passive_skill_gunner.nut`；`ProcPassiveSkill_Gunner` 在 `skill_index == 254` 且等级大于 0 时追加 `ap_gunner_comminterrupt.nut`；`skill/gunnerskill.lst` 闭合 `254 -> Gunner/gunner_comminterrupt.skl`。 | 详见 `indexes/skill-gunner-passive-comminterrupt-script-only-representative-chain.zh-CN.md`；这是非 Swordman script-only 被动入口代表样本，不是 Gunner 全技能盘点；静态只读不能证明角色默认学会、命令开放成功、强制切 state、PVP、同步或资源完整性。 |
| Priest ReleaseBuffs light state 代表链 | `priest_load_state.nut` 注册 `ReleaseBuffs` 到 `ENUM_CHARACTERJOB_PRIEST / state 0 / skill 222`；`skill/priestskill.lst` 闭合 `222 -> priest/priestnewskill/ReleaseBuffs.skl`；`new_priest_common.nut` 的 `procAppend_Priest` 调用 `useBuffSkills` 推进 buff 队列并发送 state 13 参数包。 | 详见 `indexes/skill-priest-releasebuffs-light-state-representative-chain.zh-CN.md`；这是 Priest light state 代表样本，不是 Priest 全技能盘点；静态只读不能证明 buff 释放成功、冷却 UI、最终属性、PVP、同步或资源完整性。 |
| HolongLight State/PO/skill-load/Buff 链 | `skill 9` 注册到 `STATE_HOLONG_LIGHT = 28`；首次施放在角色 `HolongLight.ani` 的 keyframe flag 1 创建两个 `24222`，并添加 skill-load；再次施放不重新进角色 state，而是枚举已有 `24222` 并把尚未攻击的火球切到 `ATTACK`；`24222` 的 BUFF 状态跟随父角色并挂防御 change status，ATTACK 状态按角度射出并走爆炸/销毁 | 详见 `indexes/skill-atmage-holonglight-state-po-skillload-buff-chain.zh-CN.md`；这是本技能创建的 `24222` + skill-load + 防御 appendage 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明命中、伤害、跟随轨迹、Buff UI、爆炸范围、PVP、同步或资源完整性。 |
| PieceOfIce State/Core/Shards PO 链 | `skill 10` 注册到 `STATE_PIECE_OF_ICE = 29`；角色 `PieceOfIce.ani` 的 keyframe flag 1 创建 `24224` core，flag `>= 2` 命令 core 进入 DAMAGE 并随机创建 `24223` shard；`24224` 是 pass-all 视觉/震动 core，`24223` 是 do-not-pass 水属性魔法 shard，读取 word/float/word 包、移动粒子、time event 和不可移动位置爆裂 | 详见 `indexes/skill-atmage-pieceofice-state-core-shard-po-chain.zh-CN.md`；这是本技能创建的 `24224 -> 24223` core/shard 窄链，不重开 PO/AttackInfo/Hitbox 广域主线；静态只读不能证明随机分布、命中、伤害、轨迹、爆裂时序、PVP、同步或资源完整性；core 的 frame 选择存在静态边界，需运行确认。 |
| Wind Strike 自定义 PO | 当前主目标未读到 `po_qf_receive_probe.nut`，`wind_strike.nut` 仍创建 `24201` | 历史专项中的 custom PO / dynamic AttackInfoPacket 不能提升为当前主目标事实。 |
| 普攻强制 OutRageBreak qf 文件 | 当前主目标未读到 `ap_qf_basicattack_outragebreak.nut` | 历史专项中的普通攻击强制崩山地裂斩不能作为当前主目标已安装链。 |
| `ForceUse_Character` | 主目标 NUT 文本未命中 | 只能作为教程思路名，不作为可调用 API。 |

## TypeSquirrel 已核 API 边界

| API | 可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDSQRCharacter.pushScriptFiles(path)` | 推入脚本文件。 | 只说明接口存在；新建文件是否被加载仍看目标 load_state 是否推入。 |
| `IRDSQRCharacter.pushState(job, filePath, sklName, state, skillIndex)` | 注册角色 state 脚本入口。 | `job/state/skillIndex` 必须按目标职业和目标技能核验。 |
| `IRDSQRCharacter.pushPassiveObj(path, index)` | 注册 passiveobject 的 NUT 脚本入口，`index` 对应 `passiveobject.lst`。 | `index` 必须按父块上下文走 `passiveobject/passiveobject.lst`，不能凭数字猜。 |
| `CNAvenger.pushScriptFiles` / `pushState` / `pushPassiveObj` | Avenger 专用入口 API；`pushState` 没有 job 参数。 | 只能用于 Avenger 入口族；参数形状不能直接套用 `IRDSQRCharacter.pushState`。 |
| `sq_SendCreatePassiveObjectPacket(obj, index, level, x, y, z, direction)` | PowerOfDarkness 用全局函数创建 `24108` arrow；`index` 仍按 `passiveobject/passiveobject.lst` 闭合。 | TypeSquirrel 只证明函数形状；坐标、返回值、同步和对象生命周期需实机。 |
| `IMouse.GetXPos()` / `IMouse.GetYPos()` / `stage.getMainControl().IsLBDown()` / `IsRBDown()` | CreatorMage Mgrab/WindPress 用鼠标位置和按键状态驱动目标选择、拖动和持续发射。 | `IMouse` 坐标候选可由 TypeSquirrel 语义检索看到；MainControl 按键只按主目标脚本实见记录，最终输入手感需实机。 |
| `sq_GetCustomIntDataSize(skill, chr)` / `sq_GetIntData(chr, skill, index)` | Common Burster 用它读取 `.skl [static data]` 中的禁用技能列表。 | `198` 未按职业 skill registry 闭合；禁用列表只能按当前 Burster `.skl` 文件解释。 |
| `IRDCharacter.setSkillCommandEnable(skillIndex, isEnabled)` | 设置技能命令可用。 | 只点亮/允许命令，不等于技能一定能成功切 state。 |
| `IRDSQRCharacter.sq_IsUseSkill(index)` | 尝试使用技能并返回是否成功。 | 受冷却、条件、当前状态和输入影响。 |
| `IRDSQRCharacter.sq_AddSetStatePacket(stateId, priority, hasSubState)` | 发 state 切换包；substate 由 int vector 提供。 | substate 是高风险参数，必须目标 PVF 找同类证据或实测。 |
| `IRDSQRCharacter.sq_GetCurrentFrameIndex(pAni)` | 读取当前动画帧索引。 | 帧级窗口必须结合当前动画对象和实机节奏核验。 |
| `sq_GetCNRDObjectToSQRCharacter(obj)` / `sq_getGrowType(obj)` / `sq_IsTowerDungeon()` | 可用于角色对象转换、转职分支判断和塔类副本排除。 | 只能支撑脚本条件边界；不证明分支内技能一定成功释放。 |
| `CNRDObject.getObjectManager()` / `CNRDObjectManager.getCollisionObjectNumber()` / `getCollisionObject(index)` / `IRDCollisionObject.isEnemy(...)` / `isInDamagableState(...)` / `CNRDObject.isObjectType(...)` / `sq_GetCNRDObjectToActiveObject(...)` / `sq_GetDistanceObject(...)` | `atmage_common.nut` 的 `findAngleTarget` 用对象管理器扫描敌对 active 目标，并按距离和角度选择最近目标；BlueDragonWill 用它寻找前冲锁定目标。 | TypeSquirrel 只证明 API 形状；目标优先级、距离权重、死亡/离场、角度边界和同步必须实机。 |
| `IRDSQRCharacter.sq_SendCreatePassiveObjectPacket(index, level, x, y, z, direction)` | 创建 passiveobject。 | `index` 必须 registry 闭合；位置和可见性需要实机。 |
| `IRDSQRCharacter.sq_StartWrite()` / `sq_WriteDword(value)` / `sq_WriteWord(value)` | 可向创建的 PO `receiveData` 写入数据；WindStrike 原生链写入百分比攻击力、独立攻击力、浮空力。 | 读取顺序和目标 PO 回调必须闭合；`receiveData.readDword/readWord` 当前只按目标脚本实见记录。 |
| `IRDSQRCharacter.sq_WriteFloat(value)` / `IRDCollisionObject.setTimeEvent(timeIndex, interval, count, immediate)` | CrystalAttack 原生链用 `setTimeEvent(0, 50, count, false)` 分批创建 PO，并写入角度 float。 | 只证明接口形状和目标脚本用法；实际触发节奏、帧率影响和网络同步需要实机。 |
| `sq_GetCurrentAttackInfo(obj)` / `sq_SetCurrentAttackBonusRate(...)` / `sq_SetCurrentAttackPower(...)` / `sq_SetCurrentAttacknUpForce(...)` | WindStrike 原生 PO 用来改写当前攻击包的百分比攻击力、独立攻击力和浮空力。 | 只证明攻击包参数可被脚本设置；不证明最终伤害和浮空表现。 |
| `sq_SetCurrentAttackInfo(obj, attackInfo)` / `CNRDPassiveObject.getDefaultAttackInfo()` / `sq_SetMyShake(obj, shakeRate, shakeTime)` | CrystalAttack 原生 PO 在 keyframe flag 回调中切回默认攻击包、设置攻击倍率并触发屏幕震动。 | 静态只读不证明震动是否可见、攻击包最终命中或伤害结算。 |
| `IRDSQRCharacter.callBackAllObject(...)` / `sq_sendSetActiveStatusPacket(...)` / `sq_SetChangeStatusIntoAttackInfo(...)` | DarkChange 非 PVP 分支回调 active object 并直接发送 `ACTIVESTATUS_BLIND`；PVP 分支在 `onAttack` 中把失明写入当前 AttackInfo。 | 只证明脚本尝试发送或写入失明；目标筛选、触发概率、抗性、免疫、PVP 最终规则和同步必须实测。 |
| `sq_SendCreatePassiveObjectPacketPos(obj, index, level, X, Y, Z)` / `sq_BinaryStartWrite()` / `sq_BinaryWriteDword(value)` | WaterCannon 主 PO 命中后用二进制写包在命中位置创建爆炸 PO `24256`。 | 只证明写包和按坐标创建链路；目标有效性、爆炸命中和同步需实机。 |
| `sq_GetUniformVelocity(...)` / `sq_GetDistancePos(...)` / `sq_setCurrentAxisPos(obj, axis, pos)` | WaterCannon 主 PO 用当前动画时间计算匀速位移并改写 X 轴坐标。 | 静态只读不能证明实机轨迹、碰撞和同步。 |
| `sq_SetAttackBoundingBoxSizeRate(currentAni, xRate, yRate, zRate)` / `CNRDAnimation.setImageRateFromOriginal(...)` | WaterCannon 按 level data 调整 PO 图片和攻击盒大小。 | 攻击盒缩放是否等同于实机范围必须测试。 |
| `sq_GetGroup(obj)` / `sq_GetUniqueId(obj)` / `sq_GetObject(parent, group, id)` / `sq_AddHitObject(obj, colObj)` | WaterCannon 爆炸 PO 用目标 group/id 找回对象并标记命中过。 | 不证明重复命中、目标失效或最终伤害规则。 |
| `IRDSQRCharacter.sq_IntVectClear()` / `sq_IntVectPush(value)` / `sq_SendChangeSkillEffectPacket(obj, skillIndex)` | ElementalChange 用 int vector 进入 Throw，并在选择元素后发送技能效果变化包。 | Throw 参数、选择 UI 和同步必须按目标脚本与实机核验。 |
| `CNSquirrelAppendage.sq_SetValidTime(time)` / `sq_AppendAppendageID(...)` / `setBuffIconImage(...)` / `setEnableIsBuff(...)` | ElementalChange appendage 设置持续时间、APID 与 buff 图标。 | 生命周期、刷新、图标显示和客户端资源需实机或资源链检查。 |
| `sq_SetChangeStatusIntoAttackInfo(...)` / `sq_CreateChangeStatus(...)` / `sq_RemoveChangeStatus(...)` | ElementalChange / ElementalShield 链会写异常状态和元素抗性变化。 | 异常状态、抗性、概率和 PVP 规则不能静态证明。 |
| `sq_getNewAttackInfoPacket()` / `sq_createCommonElementalAttack(...)` | 可构造动态攻击包并创建元素攻击。 | 当前主目标未安装 Wind Strike 自定义 PO 链；动态伤害、元素属性、同步仍需专项实测。 |
| `sq_SendHitObjectPacketByAttackInfo(...)` / `sq_sendSetActiveStatusPacket(...)` | MagicShield 火/光分支会发送动态 AttackInfoPacket；暗分支会发送 `ACTIVESTATUS_SLOW` 异常状态包。 | 只证明脚本尝试发送附加攻击或异常状态；命中、伤害、概率、抗性、PVP 和同步必须实测。 |
| `sq_CreateAnimation(...)` / `sq_GetAnimationFrameIndex(...)` / `sq_SetAnimationFrameIndex(...)` / `sq_DeleteAni(...)` / `sq_AnimationProc(...)` / `sq_drawCurrentFrame(...)` | MagicShield appendage 用于创建、切换、保留帧号、删除和绘制盾前后层动画。 | 视觉资源完整性、层级、残留和显示效果需客户端资源链或实机。 |
| `sq_GetCastTime(obj, skillIndex, skillLevel)` / `CNSquirrelAppendage.sq_AddEffectFront(path)` | ManaBurst 释放入口读取施放时间作为 Throw 充能时间；appendage 添加人物前景循环特效。 | 动作读条、特效显示、资源存在、层级和残留需资源链或实机。 |
| `IRDCharacter.getSkillMpRate(skillIndex)` / `setSkillMpRate(skillIndex, newMpRate)` | ManaBurst 有效时，男法技能使用前回调按 level data 临时提高当前技能 MP 消耗倍率，使用后恢复旧倍率。 | 最终扣蓝、失败释放恢复、Expression 叠加顺序和服务端一致性需实机。 |
| `IRDSQRCharacter.sq_AddPassiveSkillAttackBonusRate(skillIndex, levelDataIndex)` / `sq_RemovePassiveSkillAttackBonusRate(skillIndex)` | ManaBurst appendage 启动时添加百分比伤害加成，结束时移除。 | 只证明接口调用；最终伤害、叠加优先级、面板显示和 PVP 不可静态证明。 |
| `IRDActiveObject.GetSquirrelAppendage(path)` | ManaBurst 的 MP 消耗回调用路径查找当前角色是否已有对应 appendage。 | 是否存在和有效必须看运行上下文；路径只在当前脚本体系内闭合。 |
| `IRDSQRCharacter.sq_GetInputDirection(...)` / `sq_GetDistancePos(...)` / `IRDSQRCharacter.sq_SetfindNearLinearMovablePos(...)` | Teleport 读取横向/纵向输入方向，按静态 X/Y 距离计算候选点，并尝试设置临近线性可移动位置。 | TypeSquirrel 对部分接口注释较泛；最终落点、绕障、阻挡、hold 状态和同步必须实机验证。 |
| `IRDSQRCharacter.sq_SetCameraScrollPosition(...)` / `sq_GetUniformVelocity(...)` | Teleport 用于 substate 0/1 的镜头基准与平滑滚动。 | 只证明脚本尝试设置镜头；实际镜头手感和本机/联机表现需实机。 |
| `CNRDAnimation.setEffectLayer(...)` / `sq_RGB(...)` / `sq_ALPHA(...)` / `sq_AniLayerListSize(...)` / `sq_getAniLayerListObject(...)` | Teleport bodyeffect appendage 用于给当前动画和装扮图层设置 LINEARDODGE 体效。 | 视觉层、装扮图层、遮罩、残留和资源完整性需资源链或实机。 |
| `sq_IsKeyDown(...)` / `sq_GetVectorData(datas, index)` / `sq_SetCurrentPos(obj, x, y, z)` | MagicCannon 用于空中蓄力结束时判断方向键、在 `onSetState` 读取 substate/x/y/z 并重置当前位置。 | 只证明状态包参数和按键读取；输入容错、最终位置、落地和同步必须实机。 |
| `IRDSQRCharacter.sq_SetStaticSpeedInfo(...)` / `sq_SetStaticMoveInfo(...)` / `sq_SetMoveDirection(...)` / `sq_SetZVelocity(...)` | MagicCannon 用于设置动作速度、水平/垂直反冲和 Z 速度。 | 反冲距离、摩擦、轨迹、落地时序和同步不能静态证明。 |
| `IRDCollisionObject.sendStateOnlyPacket(state)` / `CNSquirrelPassiveObject.sq_SetMoveParticle(path, horizonAngle, verticalAngle)` | MagicCannon 24227 PO 在创建动画 flag 后切 SHOOT，并给射出阶段设置移动粒子。 | 只证明对象状态与视觉参数；飞行、命中、资源存在和残留需实机或资源链。 |
| `sq_SetAddWeaponDamage(...)` / `sq_SetCurrentAttackeDamageAct(...)` / `AttackInfo.setElement(...)` | MagicCannon 暗属性分支会改写自身 AttackInfo 的武器伤害、受击反馈和元素。 | 攻击类型、伤害、异常、卡肉和 PVP 规则必须实测。 |
| `sq_GetFrameStartTime(...)` / `sq_StartDrawCastGauge(...)` / `sq_EndDrawCastGauge(...)` | ChainLightning cast 段读取动画帧开始时间，并开始/结束施放读条。 | 当前脚本传 frame `16`，但角色 cast 动画静态只有 4 帧；返回值和读条手感需实机或引擎语义确认。 |
| `IRDSQRCharacter.sq_GetPassiveObject(index)` / `CNSquirrelPassiveObject.sq_FindFirstTarget(...)` / `sq_FindNextTarget(...)` | ChainLightning 角色轮询 `24241`；24241 找首目标与后续目标。 | TypeSquirrel 只证明 API 形状；目标优先级、随机性、去重、死亡/离场处理需实机。 |
| `sq_GetGlobalIntVector()` / `sq_IntVectorClear(...)` / `sq_IntVectorPush(...)` / `IRDCollisionObject.addSetStatePacket(...)` | ChainLightning 24241 用全局 int vector 传 x/y/z/object id，并用 PO state packet 推进链路。 | 向量顺序必须和 `setState` 读取端闭合；参数不能跨技能硬套。 |
| `sq_GetObjectId(...)` / `sq_GetObjectByObjectId(...)` / `sq_GetCNRDObjectToActiveObject(...)` | ChainLightning 在目标搜索、目标找回和后续目标搜索之间传递对象身份。 | 目标销毁、离场、死亡、非 active 对象和同步状态下的返回需实机。 |
| `sq_CreatePooledObject(...)` / `sq_AddObject(..., OBJECTTYPE_DRAWONLY, ...)` / `sq_SetfRotateAngle(...)` / `CNRDAnimation.setImageRate(...)` | ChainLightning 24241 创建 draw-only 闪电线，并用几何计算旋转/缩放到目标。 | 这是视觉线段链路；不要把线段动画中的攻击盒直接写成命中来源。 |
| `sq_SendCreatePassiveObjectPacketFromPassivePos(...)` / `sq_SendHitObjectPacket(...)` / `EventTimer.setParameter(...)` / `EventTimer.isOnEvent(...)` | ChainLightning 24241 从 PO 位置创建 `24242`；24242 对目标发送即时和 timer 多段 hit packet。 | hit packet 只证明脚本尝试命中；最终命中、伤害、击退、浮空、PVP 和同步必须实测。 |
| `sq_CosTable(...)` / `sq_SinTable(...)` / `sq_GetAniRealImageSize(...)` / `sq_SetEnumDrawLayer(...)` | FrozenLand Pole 用三角表计算环绕位置，MagicCircle 用动画真实尺寸估算半径，shockwave draw-only 视觉设置绘制层。 | `sq_GetAniRealImageSize` 参数含义和 `sq_SetEnumDrawLayer` 使用时机存在 TypeSquirrel 边界；轨迹、范围和视觉层级必须实机或资源链。 |
| `CNSquirrelAppendage.sq_getAuraMaster(...)` / `sq_AddAuraMaster(...)` / `CNAuraMasterAttract.setAttractionInfo(...)` | FrozenLand MagicCircle 追加 `ap_common_suck.nut` 后创建 `frozenAura` 并设置吸附参数。 | TypeSquirrel 对 aura 参数说明弱；`ap_common_suck.nut` 本体回调基本为空，吸附成功率、范围、免疫和同步必须实机。 |
| `CSQCommonVarlist.GetparticleCreaterMap(...)` / `sq_AddParticleObject(...)` | FrozenLand MagicCircle 用它创建并附加 ice fog 粒子。 | 只证明粒子接口调用；资源存在、显示层级、残留和多人表现需资源链或实机。 |
| `IRDCollisionObject.getMyPassiveObjectCount(...)` / `getMyPassiveObject(...)` / `sendStateOnlyPacket(...)` | LightningWall 角色枚举自己创建的 `24218`，并向 wall PO 发送 move/destroy state。 | 对象存在、状态切换时序、丢包和同步表现必须实机确认。 |
| `sq_flashScreen(...)` / `sq_EffectLayerAppendageOnlyBody(...)` / `sq_SetMyShake(...)` | LightningWall 角色释放中使用闪屏、人物身体层效果和本机震动。 | 只证明视觉接口调用；显示、层级、残留和多人表现需实机或资源链。 |
| `sq_SetChangeStatusIntoAttackInfoWithEtc(...)` / `sq_SetCurrentAttackeHitStunTime(...)` | LightningWall 24218 写入触电异常参数，并把强制命中僵直时间设为 `0`。 | 触电概率、等级、伤害、僵直、抗性和 PVP 均不可静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(...)` / `sq_SetSpeedToMoveParticle(...)` / `sq_RemoveMoveParticle(...)` | LightningWall 24218 move/destroy 阶段设置、调速并移除移动粒子。 | 轨迹、阻挡、粒子资源、销毁时序和同步需实机或资源链。 |
| `sq_IsHoldable(...)` / `sq_IsGrabable(...)` / `sq_IsFixture(...)` / `sq_HoldAndDelayDie(...)` | LightningWall 24218 onAttack 按目标条件追加 appendage，并调用 hold/delay die 形状的变参 API。 | TypeSquirrel 对 `sq_HoldAndDelayDie` 注释不可靠；只记录目标脚本调用形状，控制成功率和免疫规则必须实测。 |
| `sq_AddDrawOnlyAniFromParent(...)` / `sq_ChangeDrawLayer(...)` / `CNRDAnimation.resizeWithChild(...)` / `CNRDAnimation.resize(...)` | LightningWall 创建 wall 子视觉、floor/electric mark 和 appendage 电击视觉，并按 static size 或目标高度缩放。 | draw-only 是视觉链路，不证明攻击来源；资源存在、层级和残留需资源链或实机。 |
| `sq_GetShuttleValue(...)` / `sq_GetObjectTime(...)` / `CNRDAnimation.setEffectLayer(...)` / `IRDAppendage.getAppendageInfo()` / `IRDAppendage.setValidTime(...)` | LightningWall appendage 用对象时间计算 Z 往复偏移、设置目标单色效果层，并按 static data 设置有效期。 | 实际浮动、卡肉、有效期刷新、目标死亡清理和同步不能静态证明。 |
| `IRDSQRCharacter.sq_SetSkillSubState(...)` / `sq_GetSkillSubState(...)` / `CNSquirrelPassiveObject.sq_GetParentState(...)` / `sq_GetParentSkillSubState(...)` | FireRoad 角色记录 0/1 子状态，PO 在 frame 15 查询父 state/substate 决定是否切第二段攻击。 | 子状态数字只对当前技能链闭合；父对象失效、中断和同步状态需实机。 |
| `sq_SetFrameDelayTime(...)` / `sq_SetPause(...)` / `sq_SetAnimationCurrentTimeByFrame(...)` | FireRoad 改写 CAST1 frame 0 delay、延迟火柱 PO，并在二段切换时跳到 PO frame 16。 | 动作读条、暂停精度、跳帧时序、取消窗口和联机同步需实机。 |
| `IRDSQRCharacter.sq_WriteByte(...)` / `CNSquirrelPassiveObject.sq_SetMaxHitCounterPerObject(...)` | FireRoad 用 byte 传最大命中次数和火柱序号，并限制每对象最大攻击次数。 | byte 宽度、重复命中、目标切换和 PVP 修正需实机。 |
| `sq_GetCustomAttackInfo(...)` / `sq_SetCurrentAttackInfo(...)` / `CNRDAnimation.setAutoLayerWorkAnimationAddSizeRate(...)` | FireRoad PO 切换 `.obj [etc attack info]` 的第二段攻击包，并按 sizeRate 缩放自动层级动画。 | 攻击包切换后的实际命中、伤害和缩放范围需实机。 |
| `IRDCharacter.setSkillSubState(...)` / `getSkillSubState()` | FlameCircle 用成员方法记录和读取 `5/0/1/2` 等子状态。 | 子状态数字只对当前技能链闭合；casting 分支中的 `speedRate` 在当前文件内未被 TypeSquirrel 解析到定义，需实机确认。 |
| `sq_BinaryStartWrite()` / `sq_BinaryWriteWord(...)` / `sq_BinaryWriteFloat(...)` / `sq_BinaryWriteDword(...)` | FlameCircle 创建 `24244` 前写入旋转次数、半径、速度和旋转攻击倍率。 | `receiveData.readWord/readFloat/readDword` 当前只按目标脚本实见记录；读写顺序必须闭合。 |
| `CNRDAnimation.setImageRate(...)` / `setSpeedRate(...)` / `sq_SetAttackBoundingBoxSizeRate(...)` | FlameCircle PO 缩放火环图片、调速并缩放攻击盒；爆炸段角色动画也调用攻击盒缩放。 | TypeSquirrel 对全局攻击盒缩放的非 PO 使用有警告；视觉缩放、攻击范围和同步需实机。 |
| `CNRDPassiveObject.getTopCharacter()` / `IRDCollisionObject.resetHitObjectList()` / `sq_AddHitObject(...)` | FlameCircle PO 读取父角色状态、按旋转帧推进重置命中列表，并在后段标记目标已命中过。 | 重复命中、目标过滤、父角色失效和 PVP 规则不能静态证明。 |
| `sq_CreateAnimation(...)` / `sq_CreatePooledObject(...)` / `sq_AddObject(...)` / `CNRDObject.setValid(false)` | FlameCircle PO 创建 `04_bspin_dodge.ani` draw-only 子视觉，并在完成/销毁时设为无效。 | draw-only 是视觉链路，不证明攻击来源；显示层级和残留需资源链或实机。 |
| `CNSquirrelAppendage.sq_AppendAppendage(...)` / `sq_GetSkillIndex()` / `IRDAppendage.setValid(false)` | FlameCircle 爆炸段追加通用视觉 appendage；appendage 按技能 ID 选择黑色 dodge 效果并自行失效。 | appendage 视觉效果、生命周期、装扮层和残留需实机或资源链。 |
| `IRDSQRCharacter.sq_SetShake(...)` / `sq_SetShake(...)` | FlameCircle 爆炸段触发屏幕震动。 | 震动幅度、是否本机/全局和多人表现需实机。 |
| `IRDSQRCharacter.sq_AddSkillLoad(...)` / `sq_GetSkillLoad(...)` / `sq_RemoveSkillLoad(...)` / `startSkillCoolTime(...)` | HolongLight 首次施放添加 skill-load；再次施放读取 loadSlot 并消耗一次；死亡、重置或 BUFF 超时移除 skill-load；最后一个火球射出后启动冷却。 | TypeSquirrel 对 `sq_GetSkillLoad` 返回标注和脚本对象用法不完全一致；UI、冷却、失败释放和 PVP 修正需实机。 |
| `IRDSQRCharacter.sq_WriteBool(...)` / `sq_WriteFloat(...)` / `sq_WriteDword(...)` | HolongLight 创建 `24222` 前写入左右标记、射击角度、持续时间、防御、攻击倍率和 timer 参数。 | 读取端顺序必须和 `setCustomData` 闭合；字段宽度不能凭名字猜。 |
| `sq_FindShootingTarget(...)` / `sq_GetShootingHorizonAngle(...)` / `sq_GetShootingVerticalAngle(...)` | HolongLight 创建火球时尝试找射击目标并计算水平/垂直角度。 | TypeSquirrel 对 horizon angle 返回标注和目标脚本用法不完全一致；目标选择、空目标、射出手感和同步需实机。 |
| `sq_ObjectToSQRCharacter(...)` / `sq_CreateChangeStatus(...)` / `CNSimpleChangeStatus.sq_AddChangeStatus(...)` / `CNSimpleChangeStatus.sq_Append(...)` | HolongLight BUFF 状态创建防御 change status 并挂到父角色；超时清理时把顶层对象转回角色移除 skill-load。 | 防御最终数值、Buff UI、叠加、失效和父对象异常需实机。 |
| `CNRDPassiveObject.getParent()` / `sq_GetAccel(...)` / `sq_GetShuttleValue(...)` / `sq_SetCurrentPos(...)` | HolongLight BUFF 状态按父对象位置、方向和时间函数更新火球跟随坐标。 | 跟随轨迹、阻挡、卡顿、残留和联机同步不能静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(...)` / `sq_RemoveMoveParticle(...)` / `sq_AddDrawOnlyAniFromParent(...)` | HolongLight ATTACK 状态设置移动粒子、追加射出视觉，EXPLOSION 状态移除粒子。 | 粒子资源、方向、视觉层级、残留和攻击来源需资源链或实机。 |
| `sq_getRandom(min, max)` / `IRDCollisionObject.sendStatePacket(state, value)` | PieceOfIce 在角色 keyframe flag `>= 2` 随机 shard 数量/角度，并把 flagIndex 传给 `24224` core 的 DAMAGE state。 | 随机分布、上下限语义、state 包时序、PVP 和同步需实机；`value` 只按当前 core 读取端闭合。 |
| `sq_CreateDrawOnlyObject(...)` / `CNRDAnimation.addLayerAnimation(...)` | PieceOfIce 创建 core 上的 draw-only shard 视觉，并给 `24223` shard 追加 dodge 视觉层。 | draw-only 和 layer 都是视觉链路，不证明攻击来源；资源、层级、残留需资源链或实机。 |
| `CNRDAnimation.setCurrentFrameWithChildLayer(frameID)` / `sq_SetMyShake(...)` | PieceOfIce core 在 DAMAGE 中把 `flagIndex + 3` 映射到当前帧并触发震动，END 切到 frame 10。 | flag 8 静态映射到 frame 11，而当前 core 动画静态只读为 11 帧；这只能列为静态边界，不写成已确认错误。 |
| `IRDActiveObject.isMovablePos(XPos, YPos)` / `CNSquirrelPassiveObject.sq_SetMoveParticle(...)` | PieceOfIce shard 使用移动粒子飞行，`procAppend` 中发现当前位置不可移动时进入 EXPLOSION。 | 地图可移动判定、碰撞、爆裂时序、轨迹和同步必须实机确认。 |
| `sq_ObjectToSQRCharacter(...)` / `IRDSQRCharacter.sq_GetBonusRateWithPassive(...)` | PieceOfIce shard 从顶层角色读取 `PieceOfIce` 技能与被动加成后的攻击倍率，再写当前 AttackInfo。 | `PieceOfIceEx` 的最终叠加、父对象异常、命中和伤害结算需实机。 |
| `sq_SendChangeSkillEffectPacket(...)` / `CNRDSkill.setSealActiveFunction(...)` | IceRoad 首次释放追加主 appendage 后关闭技能 on/off；已有主 appendage 时再次施放发送技能效果变化包。 | 当前 `IceRoad.nut` 未读到同名接收回调；PO 接收端又依赖 `24243` 创建，不能写成再次施放一定关闭/刷新。 |
| `CNSquirrelAppendage.sq_AddEffectFront(...)` / `sq_DeleteEffectFront(...)` / `sq_GetFrontAnimation(...)` | IceRoad 主 appendage 和目标 CS appendage 添加/删除前景视觉，CS appendage 用前景动画结束判断失效。 | 视觉层不证明攻击来源；资源、层级、残留和有效期需实机或资源链。 |
| `CNSquirrelAppendage.sq_AddChangeStatusAppendageID(...)` / `sq_IsValidActiveStatus(...)` | IceRoad PO 的 skill effect 接收端准备给目标追加移动速度 change status；CS appendage 也检查慢速状态。 | 当前 `24243` 创建入口未闭合；减速/冰冻/异常状态最终规则不能静态证明。 |
| `IRDSQRCharacter.sq_SetCurrentTimeByFrame(...)` / `checkModuleType(MODULE_TYPE_PVP_TYPE)` | IceSwordEx 在非 PVP 分支把当前动画回卷到 frame 0 一次；PVP 分支直接跳过回卷。 | 回卷后的攻击盒、命中列表、第三击替代、取消窗口和同步必须实机。 |
| `IRDSQRCharacter.sq_SetApplyConversionSkill()` / `IRDSQRCharacter.sq_setCustomHitEffectFileName(path)` / `sq_EffectLayerAppendage(...)` | IceSword 切 AttackInfo 后应用转换接口、设置自定义命中特效，并在 onAttack 给目标追加蓝色视觉层。 | TypeSquirrel 对转换接口注释较弱；这里只记录目标脚本调用形状，转换、视觉和资源完整性需实机或资源链。 |

## 当前主线判断

| 子桶 | 状态 | 下一步 |
| --- | --- | --- |
| `skill registry -> .skl` | 可用 | 后续按目标职业继续扩小样本，不做全职业盘点。 |
| `load_state -> appendage -> state packet` | 可用 | 第一优先沉淀 BloodyRave -> BloodSword 当前主目标链。 |
| `普通攻击强制 OutRageBreak` | 当前主目标未安装 qf 专项文件 | 只能列为历史专项能力，若要当前主目标复现需走写入实验生命周期。 |
| `Wind Strike 原生 24201 链` | 当前主目标只读闭合 | 后续只在需要查男法原生 PO 参数流时引用，不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `CrystalAttack 原生 24221 链` | 当前主目标只读闭合 | 后续只在需要查男法 time event 创建 PO 或默认 AttackInfo 重置时引用，不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `DarkChange State/Blind/AttackInfo 链` | 当前主目标只读闭合 | 后续只在需要查男法角色攻击盒缩放、全场 active object 回调、非 PVP 直接异常包或 PVP AttackInfo 异常状态分支时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `WaterCannon 原生 24217 -> 24256 链` | 当前主目标只读闭合 | 后续只在需要查移动型 PO、命中后二级 PO 或攻击盒缩放时引用，不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `ElementalChange Throw/appendage 链` | 当前主目标只读闭合 | 后续只在需要查 Throw 参数向量、自定义选择 UI、appendage 有效期或基础攻击元素路由时引用。 |
| `MagicShield Buff/appendage 链` | 当前主目标只读闭合 | 后续只在需要查男法 Buff appendage、受击回调、动态反击包或 ElementalChange 盾元素联动时引用。 |
| `ManaBurst Throw/Buff 链` | 当前主目标只读闭合 | 后续只在需要查男法 Throw 型 Buff、百分比攻击加成、MP 消耗倍率改写或 Expression 叠加时引用。 |
| `Teleport 位移 state 链` | 当前主目标只读闭合 | 后续只在需要查男法位移型 state、输入方向、static data 距离、可移动位置查找或镜头滚动时引用。 |
| `MagicCannon State/PO 链` | 当前主目标只读闭合 | 后续只在需要查男法空中/地面分支、keyframe 创建 PO、元素 ball、暗属性特殊 AttackInfo 或普通元素攻击创建时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `ChainLightning State/PO 链` | 当前主目标只读闭合 | 后续只在需要查男法目标搜索、PO state packet、draw-only 闪电线、对象 id 传递或 timer 多段命中时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `LightningWall State/PO/appendage 链` | 当前主目标只读闭合 | 后续只在需要查男法移动 wall、AttackInfo 触电写包、PO onAttack 追加 appendage、hold/grabable 条件或移动粒子时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `FireRoad State/PO 链` | 当前主目标只读闭合 | 后续只在需要查男法两段 substate、按 level data 批量创建 PO、对象暂停、父 state/substate 驱动二段 AttackInfo 切换或 FireRoadEx 静态边界时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `IceRoad State/appendage/disabled PO 边界` | 当前主目标只读闭合到未闭合创建入口 | 后续只在需要查男法 on/off 技能、appendage 前景视觉、timer 调整、`24243` 注册但创建入口缺失、IceRoadEx 静态意图时引用；若要恢复冰雾命中需另走运行测试或写入实验流程。 |
| `IceSword State/AttackInfo/EX 回卷链` | 当前主目标只读闭合 | 后续只在需要查男法无 substate 近战 state、角色 AttackInfo 切换、减速写入 AttackInfo、EX 非 PVP 动画回卷或 atmage comminterrupt 对 skill 8 的柔化入口时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `FlameCircle State/PO/appendage 链` | 当前主目标只读闭合 | 后续只在需要查男法旋转计数 PO、二进制 word/float/dword 写包、resetHitObjectList 多段命中、角色自身爆炸攻击包、通用视觉 appendage 或 FlameCircleEx 静态边界时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `BlueDragonWill State/Target/PO 链` | 当前主目标只读闭合 | 后续只在需要查男法目标扫描、三段 substate 前冲、可移动位置截断、二进制 float/dword 写包、双 PO 落锤/冲击波或 atmage comminterrupt 对 skill 12 的条件柔化入口时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `FrozenLand State/PO/appendage 链` | 当前主目标只读闭合 | 后续只在需要查男法 5 段 substate、10 dword MagicCircle 写包、Pole 环绕/多段命中、Exp 爆炸、aura 吸附、ice fog 粒子或 FrozenLandEx 静态边界时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `Avenger Spincutter CNAvenger State/PO 代表链` | 当前主目标只读闭合 | 后续只在需要查 `CNAvenger.pushState`、`CNAvenger.pushPassiveObj`、Avenger state+PO 参数流、24100/24101 registry 或召回型 PO timer 时引用；不扩成 Avenger 技能穷举。 |
| `Avenger PowerOfDarkness 形态/专用 API 代表链` | 当前主目标只读闭合 | 后续只在需要查 Avenger 形态/控制 state、24107/24108 registry、appendage、time event、全局 PO 创建或 circle/arrow 参数流时引用；不扩成 Avenger 技能穷举。 |
| `CreatorMage Hybrid / Mouse-Control 代表链` | 当前主目标只读闭合 | 后续只在需要查 CreatorMage script-file 技能库、mouse-control 坐标流、Mgrab change skill effect、WindPress state+PO、24355 registry 或动态攻击盒时引用；不扩成 CreatorMage 技能穷举。 |
| `Common Burster 公共循环 State 代表链` | 当前主目标只读闭合 | 后续只在需要查 Common loop `pushState`、Burster appendage、禁用技能 static data、冷却/倍率钩子或跨职业公共 state 时引用；不扩成逐职业 Burster 穷举。 |
| `HolongLight State/PO/skill-load/Buff 链` | 当前主目标只读闭合 | 后续只在需要查男法 skill-load、再次施放命令已有 PO、BUFF 跟随父角色、防御 change status、射击角度或 HolongLightEx 静态边界时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `PieceOfIce State/Core/Shards PO 链` | 当前主目标只读闭合 | 后续只在需要查男法随机 shard 批量创建、core PO frame state、draw-only 视觉、shard 移动粒子、不可移动位置爆裂或 PieceOfIceEx 静态边界时引用；不扩成 PO/AttackInfo/Hitbox 广域重采样。 |
| `Wind Strike custom PO / dynamic AttackInfoPacket` | 当前主目标未安装自定义 PO 链 | 可作为已验证能力引用，但不写成当前主目标事实。 |
| `NUT API dictionary` | 可用但高风险 | API 名先 TypeSquirrel，再目标脚本，再实测。 |

## 风险边界

- state/substate 不是通用规则。`60/[102]`、`45/[0,1]` 只在对应目标技能链内有意义。
- `[static data]` 和 `[executable states]` 只能作为静态线索；不能单独证明强制、派生、命中或动作表现。
- 当前主目标 PVF 与历史专项输出可能不同；写 Workbench 时必须标出“当前主目标只读已确认”和“历史专项已验证能力”的区别。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步或 PVP 最终规则。

## 高覆盖策略切换

后续 Skill / State / NUT Runtime Boundary 主线默认先读 `indexes/skill-state-nut-runtime-high-coverage-matrix.zh-CN.md`。AT Mage、Avenger、CreatorMage、Common、非 Swordman 被动入口和 Priest light state 现有样本已经足够支撑主要模式分类，除非发现新的 API 类别或明确缺口，不再按技能顺序继续深拆。下一阶段只做 API 分组视图和最终验收收口。
