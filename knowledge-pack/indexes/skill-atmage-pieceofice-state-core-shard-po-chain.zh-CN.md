# AT Mage PieceOfIce State/Core/Shards PO 链只读核验

状态：默认可用

用途：记录当前主目标中 `PieceOfIce` 的 skill registry、state、load_state、`24224` 核心 PO、`24223` 冰碎片 PO、随机碎片数量、写包/读包、动画 keyframe 和 NUT API 边界。本文只覆盖这一个技能创建的双 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`PieceOfIce` 是男法 `skill 10` 的主动技能，运行入口注册到 `STATE_PIECE_OF_ICE = 29`。角色进入 state 后播放 `CUSTOM_ANI_PIECE_OF_ICE = 12`；角色动画 `PieceOfIce.ani` 的 flag 1 创建大冰球核心 `24224`，后续多个 flag 让核心切到 DAMAGE 帧，同时按 `.skl [static data]` 的随机范围批量创建冰碎片 `24223`。`24224` 本身是 pass all 的视觉/震动核心，不带攻击包；`24223` 是带攻击盒和水属性魔法攻击包的碎片 PO，读取角度、生命周期和攻击倍率后用移动粒子飞出，超时或撞到不可移动位置后进入爆开/销毁。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `10 -> ATMage/PieceOfIce.skl`；`220 -> ATMage/PieceOfIceEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `PieceOfIce.skl` 为 active，命令 `←↓→ + Z`，冷却 `8000`，需求等级 `30`，`[feature skill index] = 220`。 | 可释放条件仍受当前状态、冷却、MP、技能等级和引擎判断影响。 |
| `.skl executable states` | `[executable states]` 为 `8 0 14`。 | 只说明静态可执行状态线索，不证明强制释放、取消窗口或实机可用范围。 |
| header 常量 | `SKILL_PIECE_OF_ICE = 10`，`STATE_PIECE_OF_ICE = 29`，`CUSTOM_ANI_PIECE_OF_ICE = 12`；角色自定义攻击信息 index `3` 为 `CUSTOM_ATTACK_INFO_PIECE_OF_ICE`。 | 当前观察到的 state 脚本没有主动设置角色自定义攻击信息；不要把该槽位直接写成攻击来源。 |
| load_state | `atmage_load_state.nut` 注册 `PieceOfIce` state，并注册 `24223 -> po_ATPieceOfIce.nut`、`24224 -> po_ATPieceOfIceCore.nut`。 | `24223/24224` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24223 -> Character/Mage/ATPieceOfIce.obj`；`24224 -> Character/Mage/ATPieceOfIceCore.obj`。 | registry 只证明对象路由；不证明命中、伤害或资源完整。 |
| `24223` object / atk | `ATPieceOfIce.obj` 是 `[do not pass]`，piercing power `1000`，basic motion `05_piece_normal.ani`，attack info `ATPieceOfIce.atk`；攻击包为 magic、水属性、weapon damage apply。 | object/atk 只能证明静态载体存在，不证明命中、伤害、穿刺表现或 PVP。 |
| `24224` core object | `ATPieceOfIceCore.obj` 是 `[pass all]`，basic motion `03_ice_normal.ani`，无 attack info。 | 当前核心 PO 只作为视觉/状态/震动载体；不要写成直接攻击来源。 |
| 角色动画 | `character/mage/atmage.chr` 的 etc motion index `12` 为 `ATAnimation/PieceOfIce.ani`；该动画有 flag 1、2、3、5、6、7、8。 | flag 分布证明脚本触发点存在；实际节奏、读条和取消窗口需实机。 |

## `.skl` 数据与运行索引

| 运行字段 | 来源 | 当前用法 | 边界 |
| --- | --- | --- | --- |
| 核心创建 X | static data index `0`，当前为 `60` | flag 1 创建 `24224` 时作为 X 偏移。 | 创建位置是否合适需实机。 |
| 核心创建 Z | static data index `1`，当前为 `75` | flag 1 创建 `24224` 时作为 Z 偏移。 | 创建位置和显示高度需实机。 |
| 每次碎片随机最小数 | static data index `2`，当前为 `2` | flag >= 2 时 `sq_getRandom(randMin, randMax)` 的最小值。 | 随机分布和实际碎片数量需实机或日志确认。 |
| 每次碎片随机最大数 | static data index `3`，当前为 `4` | flag >= 2 时随机创建碎片数量上限。 | 同上。 |
| 碎片生命周期 | static data index `4`，普通模式为 `375`，PVP 块中为 `250` | 写入 `24223`，碎片 PO 设置 time event 后爆开。 | 飞行时长、超时和 PVP 修正需实机。 |
| 水平角度范围 | static data index `5`，当前为 `80` | 碎片随机水平角度范围，脚本还限制最大不超过 `360`。 | 角度手感、覆盖范围和同步需实机。 |
| 垂直角度范围 | static data index `6`，当前为 `0` | 碎片随机垂直角度范围；当前值使垂直随机固定为 0。 | 轨迹最终表现需实机。 |
| 碎片攻击倍率 | level data index `0` 经 `sq_GetBonusRateWithPassive` | `24223` 在 setCustomData 中从顶层角色读取并写入当前 AttackInfo 百分比攻击力。 | 最终伤害、强化被动叠加和 PVP 修正不能静态证明。 |
| 强化被动 | `PieceOfIceEx.skl` 为 passive，前置 `10 level 10`，说明每级攻击力增加 10%。 | 说明文字和 special level up 只证明强化意图；是否、何时、如何合并到主动技能要靠引擎语义或实机确认。 |

## 角色 state / keyframe 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_PieceOfIce` 成功使用 `SKILL_PIECE_OF_ICE` 后发送 `STATE_PIECE_OF_ICE`，`hasSubState=false`。 | 成功进入仍受技能条件和引擎判断影响。 |
| 命令允许 | 攻击 state 内额外查 `sq_IsCommandEnable(SKILL_PIECE_OF_ICE)`，其他状态返回 true。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| onSetState | 停止移动，设置 `CUSTOM_ANI_PIECE_OF_ICE`，按攻击速度设置静态速度信息。 | 动作速度和取消窗口需实机。 |
| flag 1 | 写入一个 bool `false` 后创建 `24224` 核心，位置来自 static index `0/1`。 | 当前 `po_ATPieceOfIceCore.nut` 未读取 receiveData；该 bool 只记录为目标脚本实见，不解释用途。 |
| flag >= 2 | 找回自己创建的 `24224`；如果核心是本机控制，发送 `PIECE_OF_ICE_CORE_STATE_DAMAGE`，传入当前 flagIndex；随后随机创建 `24223` 碎片。 | 动画实际没有 flag 4；flag 8 映射到核心帧时存在静态帧号边界风险，需实机确认。 |
| onDamage | 角色受击时，如果核心存在，向核心发送 END state。 | 受击中断、核心销毁和碎片残留需实机。 |
| onEndCurrentAni | 角色动画结束后回到站立。 | 动作结束时序和联机同步需实机。 |

## 写包字段与 PO 读取

### `24224` 核心

| 顺序 | 角色写入 | 核心读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | bool `false` | 未观察到读取 | 只记录为创建前写包事实；当前核心脚本不消费该字段。 |

### `24223` 冰碎片

| 顺序 | 角色写入 | 碎片读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | word `sq_getRandom(0,5)` | word，判断 `< 2` | 决定是否使用小碎片动画。 |
| 2 | float `horizonAngle` | float | 设置移动粒子水平角度，并旋转碎片视觉。 |
| 3 | float `verticalAngle` | float | 设置移动粒子垂直角度。 |
| 4 | word `lifeTime` | word | 设置 time event，超时进入爆开状态。 |

边界：

- TypeSquirrel 可查到 `sq_WriteBool`、`sq_WriteWord`、`sq_WriteFloat`；读取端 `receiveData.readWord/readFloat` 当前只按目标脚本实见记录。
- 写包顺序必须和 PO 读取顺序一致；字段含义只在 `PieceOfIce` 当前链内闭合。

## `24224` 核心 PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 保存创建时 X，创建 ct timer，发送 STAY state，初始化 shake end time。 | 核心没有读取角色写入的 bool。 |
| DAMAGE state | 从 state packet 数据中读取 flagIndex，设置当前动画帧为 `flagIndex + 3`，设置短震动结束时间并触发本机震动。 | `PieceOfIce.ani` 的 flag 8 会映射到 frame id `11`，而核心动画静态反编译可见 frame 0-10；引擎处理需实机确认。 |
| END state | 将核心动画帧设置到 `10`。 | 结束帧、残留和销毁时机需实机。 |
| procAppend | 按 timer 和 `sq_GetShuttleValue` 做短暂 X 抖动，并让 Z 在 `55-65` 往复；随后设置当前位置。 | 漂浮/抖动手感和同步不能静态证明。 |
| keyframe flag | 核心自身动画 flag 1 触发震动；flag 2 发送 END state。 | 震动和结束触发需实机。 |
| onEndCurrentAni | 本机控制时发送销毁包。 | 销毁时序、残留和联机同步需实机。 |

## `24223` 碎片 PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取形态、角度、生命周期；从顶层角色读取 `sq_GetBonusRateWithPassive` 攻击倍率；设置移动粒子；设置大小碎片动画；追加 dodge 图层；按角度旋转；设置 time event；写当前 AttackInfo 攻击倍率。 | 最终伤害、角度轨迹和动画显示需实机。 |
| 小/大碎片 | word 随机值 `< 2` 时使用小碎片自定义动画；否则使用默认大碎片动画。 | 随机分布需实机或日志确认。 |
| 图层动画 | 对当前动画追加 `06_piece_dodge_1.ani` 或 `06_piece_dodge.ani` 作为视觉层。 | 图层是视觉链路，不证明额外命中来源。 |
| 移动粒子 | 使用 `Particle/ATPieceOfice.ptl`，该粒子 X 轴直线 `1600`，landing stop。 | 粒子轨迹、阻挡和资源完整需资源链或实机。 |
| procAppend | 如果顶层角色存在，且当前碎片坐标不是可移动位置，则发送 EXPLOSION。 | `isMovablePos` 的地图/碰撞判断需实机。 |
| time event | lifetime 到期后发送 EXPLOSION。 | 超时和同步需实机。 |
| EXPLOSION | 移除移动粒子，切换到烟雾/爆开动画。 | 爆开视觉和残留需实机。 |
| onEndCurrentAni | 本机控制时销毁自身。 | 销毁时序、残留和联机同步需实机。 |

## 动画、攻击包与资源引用

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATAnimation/PieceOfIce.ani` | 30 帧；frame 4 flag 1 创建核心；frame 13/15/18/20/23/25 分别 flag 2/3/5/6/7/8；角色帧只有 damage box。 | 角色动画本身当前未观察到 attack box；碎片创建节奏需实机。 |
| `03_ice_normal.ani` | 核心动画 11 帧；frame 1 flag 1，frame 10 flag 2。 | 核心是视觉/震动载体，不写成攻击来源。 |
| `05_piece_normal.ani` | 大碎片默认动画，2 帧循环，每帧有 attack box。 | 静态攻击盒不证明最终命中或伤害。 |
| `05_piece_normal_1.ani` | 小碎片默认动画，2 帧循环，每帧有 attack box。 | 同上。 |
| `06_piece_dodge.ani` / `06_piece_dodge_1.ani` | 追加图层动画，无 attack box。 | 视觉层，不是攻击来源。 |
| `08_ice_shard1_dodge.ani` | 角色每个碎片创建前在核心上创建的 draw-only 视觉。 | draw-only 是视觉链路，不证明攻击来源。 |
| `05_2_smoke_dodge .ani` | 碎片 EXPLOSION 状态使用的烟雾/爆开动画。 | 文件名中存在空格；只记录目标 PVF 当前引用，资源链需另验。 |
| `ATPieceOfIce.atk` | `24223` 攻击包：magic、水属性、weapon damage apply，hit wav `ASTORM_HIT_WATER`。 | 命中、伤害、穿刺、PVP 和击退/浮空表现需实机。 |
| `ATAttackInfo/PieceOfIce.atk` | 角色 `.chr` 的 etc attack info index `3` 存在水属性攻击包。 | 当前 `PieceOfIce.nut` 未观察到设置该攻击包；除非后续引擎语义或实机证明，不写成当前攻击来源。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDCollisionObject.getMyPassiveObject(index, arrayId)` | 角色在 flag >= 2 时找回自己创建的 `24224` 核心。 | 返回对象取决于创建、销毁和同步；必须按空对象分支处理。 |
| `IRDCollisionObject.sendStatePacket(state, value)` / `sendStateOnlyPacket(state)` | 角色把 flagIndex 传给核心 DAMAGE state；核心或碎片内部也用 state-only 推进 END/EXPLOSION。 | state packet 数据只在当前 PO 状态机内闭合，不能跨技能硬套。 |
| `sq_getRandom(min, max)` | 角色随机本次碎片数量、碎片形态和射出角度。 | 随机分布、上下界是否含端点和实际表现需实机或日志确认。 |
| `IRDSQRCharacter.sq_WriteBool/Word/Float(...)` | 角色创建核心/碎片前写入布尔、word 和 float 数据。 | 读取顺序必须闭合；核心当前未消费 bool。 |
| `sq_CreateDrawOnlyObject(obj, aniRoute, drawLayer, autoDestroy)` | 角色在核心上创建碎片飞出视觉 `08_ice_shard1_dodge.ani`。 | draw-only 是视觉链路，不证明攻击来源。 |
| `CNRDAnimation.setCurrentFrameWithChildLayer(frameID)` | 核心 DAMAGE state 按 flagIndex 设置当前帧。 | flag 8 对应 frame id `11` 的静态边界需实机确认。 |
| `CNRDAnimation.addLayerAnimation(layer, ani, playNow)` | 碎片 PO 给当前动画追加 dodge 图层。 | 视觉层级和残留需资源链或实机。 |
| `sq_ObjectToSQRCharacter(obj)` / `sq_GetBonusRateWithPassive(...)` | 碎片 PO 从顶层角色取技能攻击倍率并写到当前攻击包。 | 最终伤害、强化被动和 PVP 修正不能静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(path, horizonAngle, verticalAngle)` / `sq_RemoveMoveParticle()` | 碎片设置移动粒子并在 EXPLOSION 移除。 | 轨迹、资源、阻挡和残留需资源链或实机。 |
| `sq_SetCustomRotate(obj, angle)` / `sq_ToRadian(angle)` | 碎片视觉按随机水平角旋转。 | 视觉方向不等于攻击盒方向一定同步。 |
| `IRDActiveObject.isMovablePos(x, y)` | 碎片检测当前位置是否可移动，不可移动时爆开。 | 地图碰撞、阻挡和联机同步需实机。 |
| `sq_GetShuttleValue(...)` / `sq_GetObjectTime(obj)` / `sq_SetCurrentPos(obj, x, y, z)` | 核心 PO 做 X 抖动和 Z 往复漂浮。 | 漂浮手感、抖动、残留和同步不能静态证明。 |
| `sq_SetMyShake(obj, power, time)` | 核心 DAMAGE 和自身 keyframe 触发本机震动。 | 震动幅度、范围和多人表现需实机。 |
| `sq_SendDestroyPacketPassiveObject(obj)` | 核心和碎片动画结束后销毁自身。 | 销毁时序、残留和联机同步需实机。 |

## 禁止外推

- 不要把 `24224` 核心写成攻击来源；当前核心 `.obj` 无 attack info，脚本只做帧、震动、漂浮和销毁。
- 不要把角色 `ATAttackInfo/PieceOfIce.atk` 写成当前已用攻击包；当前 state NUT 未观察到设置该攻击包。
- 不要把每次碎片数量写成固定值；当前脚本按 static index `2/3` 随机。
- 不要把 `06_piece_dodge*.ani` 或 `08_ice_shard1_dodge.ani` 写成命中来源；它们是视觉层或 draw-only。
- 不要把核心 `flagIndex + 3` 帧映射静态风险写成实机必坏；只能列为需要运行验证。
- 静态只读不能证明命中、伤害、穿刺、卡肉、击退、浮空、随机分布、碎片轨迹、销毁时序、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机释放：确认 `PieceOfIce.ani` 播放后先出现大冰球核心，再按挥砍节奏喷出碎片。
2. 随机数量：多次释放观察每个 flag 批次是否约为 2-4 个碎片。
3. 碎片轨迹：观察水平角度、是否贴合角色朝向、是否遇阻爆开。
4. 攻击表现：确认碎片水属性、命中、伤害、穿刺、卡肉和 PVP 表现。
5. 中断清理：角色受击时观察核心是否进入 END，已有碎片是否残留或正常销毁。
6. 强化被动：学习/不学习 PieceOfIceEx，对比碎片伤害是否提高。
7. 资源链：检查角色动画、核心动画、碎片动画、烟雾动画、攻击包、粒子和 ImagePacks2 资源是否完整。
