# AT Mage HolongLight State/PO/skill-load/Buff 链只读核验

状态：默认可用

用途：记录当前主目标中 `HolongLight` 的 skill registry、state、load_state、`24222` passiveobject、首次施放 Buff PO、再次施放 skill-load 射出、appendage 防御提升、射击角度与 NUT API 边界。本文只覆盖这一个技能创建的 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`HolongLight` 是男法 `skill 9` 的主动技能，运行入口注册到 `STATE_HOLONG_LIGHT = 28`。首次施放进入角色 state，在 `HolongLight.ani` 的 keyframe flag 1 创建两个 `24222` 火球 PO，并给角色添加一个计时 appendage；再次施放时，如果已有 `24222`，角色不会重新进 state，而是枚举自己创建的火球，把尚未攻击的火球切到 `ATTACK`，并通过 skill-load 管理剩余次数和冷却。`24222` 的 `BUFF` 状态负责跟随父角色和追加防御 change status，`ATTACK` 状态负责按接收包角度射出，命中、超时、父角色死亡或动画结束后走销毁/爆炸分支。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `9 -> ATMage/HolongLight.skl`；`219 -> ATMage/HolongLightEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `HolongLight.skl` 为 active，命令 `↓ + Z`，冷却 `10000`，需求等级 `10`，`[feature skill index] = 219`。 | 可释放条件仍受当前状态、冷却、MP、技能等级和引擎判断影响。 |
| `.skl executable states` | `[executable states]` 为 `0 14 8 20 21 22 23 24 25 26 27 28 29 30`。 | 只说明静态可执行状态线索，不证明强制释放、取消窗口或实机可用范围。 |
| header 常量 | `SKILL_HOLONG_LIGHT = 9`，`STATE_HOLONG_LIGHT = 28`，`CUSTOM_ANI_HOLONG_LIGHT = 11`。 | 常量只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `HolongLight` state，并注册 `po_ATHolongLight.nut -> 24222`。 | `24222` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24222 -> Character/Mage/ATHolongLight.obj`。 | registry 只证明对象路由；不证明命中、伤害或资源完整。 |
| PO object / atk | `ATHolongLight.obj` 是 pass all、piercing power `1000`，basic motion 为待机火球，attack info 为 `ATHolongLight.atk`；攻击包为 magic，weapon damage apply。 | object/atk 只能证明静态载体存在，不证明命中、伤害、击退、浮空或 PVP 表现。 |
| 角色动画 | `character/mage/atmage.chr` 的 etc motion index `11` 为 `ATAnimation/HolongLight.ani`；该动画 `FRAME007` 有 `[SET FLAG] 1`。 | flag 只证明创建触发点存在；动作节奏和取消窗口需实机。 |
| appendage | 角色 state 追加 `Appendage/Character/ap_atmage_buff.nut`，真实脚本中该 appendage 本体只做有效期/绘制回调；防御 change status 由 `24222` 的 BUFF 状态创建并挂入。 | appendage 生命周期、Buff UI、最终防御数值和刷新规则需实机。 |

## `.skl` 数据与运行索引

| 运行字段 | 来源 | 当前用法 | 边界 |
| --- | --- | --- | --- |
| 火球持续时间 | level data index `0` | 角色写入 PO；PO 在 BUFF 状态设置 `setTimeEvent(0, lifeTime, 1, false)`，超时后进入 DESTROY。 | 持续时间受强化被动和运行时修正影响的最终结果需实机。 |
| 防御提升 | level data index `1` | PO BUFF 状态创建魔防 change status，并追加物防 change status。 | 只能证明脚本尝试改防御；面板、战斗结算和 PVP 规则不能静态证明。 |
| 火球攻击倍率 | level data index `2` 经 `sq_GetBonusRateWithPassive` | 角色写入 PO；PO setCustomData 后设置当前攻击包百分比攻击力。 | 最终伤害、被动叠加和 PVP 修正不能静态证明。 |
| 射出等待时间 | static data index `0`，当前普通模式为 `500` | PO ATTACK 状态设置 `setTimeEvent(1, shotTime, 1, false)`，到时进入 EXPLOSION。 | 实际飞行/爆炸时序和网络同步需实机。 |
| skill-load 填充时间 | static data index `1`，普通模式为 `500`，PVP 块中为 `1000` | 角色 keyframe 处调用 `sq_AddSkillLoad(SKILL_HOLONG_LIGHT, 40, 2, 500)`；再次施放时读取 loadSlot 并 `use(1)`。 | `sq_GetSkillLoad` 的 TypeSquirrel 返回标注和脚本对象用法不完全一致；最终 UI/冷却规则需实机。 |
| 强化被动 | `HolongLightEx.skl` 为 passive，前置 `9 level 10`，说明每级攻击力、防御、持续时间增加。 | 说明文字和 special level up 只证明强化意图；是否、何时、如何合并到主动技能要靠引擎语义或实机确认。 |

## 角色 state 与再次施放流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 首次释放入口 | 当自己没有 `24222`，且当前 state 是站立、冲刺或攻击时，`checkExecutableSkill_HolongLight` 成功使用技能后发送 `STATE_HOLONG_LIGHT`，`hasSubState=false`。 | 成功进入仍受技能条件、冷却、MP 和引擎判断影响。 |
| 命令允许 | 如果没有 `24222` 且当前状态不是站立、冲刺或攻击，命令不可用；攻击 state 内额外查 `sq_IsCommandEnable`。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| onSetState | 停止移动，设置 `CUSTOM_ANI_HOLONG_LIGHT`，按技能等级读取持续时间，并追加 `ap_atmage_buff.nut`。 | `AppendAppendageToSimple` 在当前 TypeSquirrel 索引中未找到定义，本页只记录目标脚本调用事实。 |
| keyframe flag 1 | 角色调用 `sq_AddSkillLoad(SKILL_HOLONG_LIGHT, 40, 2, 500)`，计算射击目标角度，写入 8 个字段后创建两个 `24222`。 | 两个火球是否都成功创建、角度选择是否符合手感和同步需实机。 |
| 动画结束 | `onEndCurrentAni_HolongLight` 发送站立 state。 | 动作结束时序和可取消窗口需实机。 |
| 再次施放 | 如果已有 `24222`，脚本读取 skill load；未冷却时找到第一个 `state < ATTACK` 的火球，发送 `ATTACK`，并 `loadSlot.use(1)`。 | 这一路径返回 false，不重新进入角色 state；loadSlot 对象语义需实机确认。 |
| 冷却启动 | 再次施放后如果已没有未攻击的 BUFF 火球，脚本调用 `startSkillCoolTime(SKILL_HOLONG_LIGHT, 1, -1)`。 | 最终冷却 UI、PVP 修正、失败释放和同步不能静态证明。 |
| 死亡/重置清理 | `atmage_common.nut` 在死亡 state 或副本重置路径中调用 `sq_RemoveSkillLoad(SKILL_HOLONG_LIGHT)`。 | 只证明脚本有清理意图；异常中断和联机残留需实机。 |
| 转换适用 | `isApplyConversionSkillPassiveObject_ATMage` 中 `24222` 返回 true。 | 只能说明该 PO 被当前脚本列入转换适用列表；实际转换效果需专项核验。 |

## 写包字段与 PO 读取

| 顺序 | 角色写入 | PO 读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | bool `i` | bool | 标记左右火球，用于 BUFF 跟随位置分支。 |
| 2 | float `horizonAngle` | float | 射出横向角度。 |
| 3 | float `verticalAngle` | float | 射出纵向角度。 |
| 4 | dword `lifeTime` | dword | BUFF 持续时间和防御 appendage 有效期。 |
| 5 | dword `defenceUp` | dword | 物防/魔防 change status 数值。 |
| 6 | dword `attackPower` | dword | 火球攻击倍率。 |
| 7 | dword `shotTime` | dword | 射出后爆炸 timer。 |
| 8 | dword `coolTime` | dword | 当前脚本保存该值，但当前未观察到 PO 内直接用它启动冷却。 |

边界：

- TypeSquirrel 可查到 `sq_WriteBool`、`sq_WriteFloat`、`sq_WriteDword`；读取端 `receiveData.readBool/readFloat/readDword` 当前只按目标脚本实见记录。
- 写包顺序必须和 PO 读取顺序一致；字段含义只在 `HolongLight` 当前链内闭合。

## `24222` PO 状态机

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取 bool、两个 float 和五个 dword，保存变量，立刻发送 `BUFF`，并设置当前攻击包攻击倍率。 | 攻击倍率写入不证明最终伤害。 |
| BUFF 状态 | 初始化 timer；设置 lifetime 事件；创建魔防 change status，再追加物防 change status，最后挂到父角色。 | 防御提升是否显示、是否叠加、是否受 PVP 修正需实机。 |
| BUFF 跟随 | `procAppend` 读取父角色位置、方向、dash state 和对象时间，用加速/往复值更新火球坐标；父角色死亡则 DESTROY。 | 跟随轨迹、阻挡、卡顿和同步不能静态证明。 |
| ATTACK 状态 | 使防御 appendage 失效，设置射出动画，按横向角度旋转动画，设置 shotTime 事件，设置移动粒子，追加 draw-only 射出特效并播放攻击音效。 | 飞行轨迹、粒子显示、资源完整和命中手感需实机或资源链。 |
| 超时销毁 | BUFF 状态 lifeTime 事件触发后发送 DESTROY，并从顶层角色移除 skill load。 | 顶层角色失效、重复清理和同步需实机。 |
| onAttack | 命中时发送 EXPLOSION。 | onAttack 被调用不等于命中伤害已按预期结算。 |
| EXPLOSION | 设置爆炸动画并移除移动粒子。 | 爆炸范围、伤害、残留和资源表现需实机。 |
| onEndCurrentAni | DESTROY 或 EXPLOSION 动画结束后发送 `sq_SendDestroyPacketPassiveObject(obj)`。 | 销毁时序、对象残留和联机同步需实机。 |

## 动画、攻击包与资源引用

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATAnimation/HolongLight.ani` | 角色 etc motion index `11`；10 帧，`FRAME007 [SET FLAG] 1` 触发创建火球。 | 角色动画引用 skin IMG；客户端资源完整性需资源链检查。 |
| `00_lamp_dodge_passive_stay.ani` | PO 待机循环动画，引用 `00_lamp_dodge.img`。 | 待机显示需客户端资源链或实机。 |
| `00_lamp_dodge_passive_move.ani` | PO 跟随移动循环动画，引用 `00_lamp_dodge.img`。 | 跟随时切换是否平滑需实机。 |
| `00_lamp_dodge_passive_destroy.ani` | PO 消失动画，逐帧降低透明度。 | 销毁残留需实机。 |
| `00_shot_dodge.ani` | PO 射出循环动画，每帧有 attack box。 | 攻击盒存在不证明最终命中或伤害。 |
| `01_explosion_dodge.ani` | PO 爆炸动画，无静态攻击盒；爆炸由 onAttack/状态机收尾触发。 | 爆炸视觉不等于额外命中来源。 |
| `shot_effect_dodge.ani` | ATTACK 状态追加的 draw-only 射出特效。 | draw-only 是视觉链路，不证明攻击来源。 |
| `ATHolongLight.atk` | magic，weapon damage apply，hit wav `CHASER_FIRE_HIT`。 | 伤害、命中反馈、PVP 和击退/浮空表现需实机。 |
| `ATHolongLight.ptl` | 移动粒子为 straight line，move variable `600 600`，life time `2000`，landing stop。 | 粒子轨迹和显示完整性需资源链或实机。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDCollisionObject.getMyPassiveObjectCount(index)` / `getMyPassiveObject(index, arrayId)` | 角色用来判断是否已有自己的 `24222`，并在再次施放时找到可射出的火球。 | 对象数量、状态和同步取决于运行时创建/销毁。 |
| `IRDSQRCharacter.sq_AddSkillLoad(skillIndex, imgPath, value, chargeTime)` | keyframe 处添加 HolongLight 的 skill-load 图标/次数，脚本传入 `40, 2, 500`。 | 第二参数 TypeSquirrel 标注为图标路径，但目标脚本传数字；只记录目标脚本实见，不解释底层 UI。 |
| `IRDSQRCharacter.sq_GetSkillLoad(skillIndex)` / `sq_RemoveSkillLoad(skillIndex)` | 再次施放读取 skill load，死亡/重置或 BUFF 超时清理 skill load。 | TypeSquirrel 返回标注与脚本对象用法存在差异；`isCooling/use` 的对象语义需实机。 |
| `IRDSQRCharacter.startSkillCoolTime(skillIndex, skillLevel, unknown)` | 最后一个未攻击火球被射出后，角色启动 HolongLight 冷却。 | 冷却 UI、PVP 修正和失败释放恢复需实机。 |
| `IRDSQRCharacter.sq_WriteBool/Float/Dword(...)` | 角色创建两个 `24222` 前写入左右标记、射击角度、持续时间、防御、攻击倍率和 timer 参数。 | 读取顺序必须闭合；字段宽度不能凭名字猜。 |
| `sq_FindShootingTarget(...)` / `sq_GetShootingHorizonAngle(...)` / `sq_GetShootingVerticalAngle(...)` | 角色在创建火球时尝试找射击目标并计算水平/垂直角度。 | TypeSquirrel 对 horizon angle 返回标注和目标脚本用法不完全一致；目标选择、空目标、角度手感需实机。 |
| `sq_ObjectToSQRCharacter(obj)` | PO 超时清理时把顶层对象转回角色，再移除 skill load。 | 转换失败或顶层对象失效需脚本防护；当前脚本只在存在分支里使用。 |
| `sq_CreateChangeStatus(...)` / `CNSimpleChangeStatus.sq_AddChangeStatus(...)` / `CNSimpleChangeStatus.sq_Append(...)` | BUFF 状态创建魔防/物防变化并挂到父角色。 | 最终防御数值、显示、叠加、失效和 PVP 不能静态证明。 |
| `CNRDPassiveObject.getParent()` / `CNRDPassiveObject.getTopCharacter()` | PO 读取父对象/顶层角色，用于跟随、死亡判断和 skill-load 清理。 | 父对象失效、离场、中断和联机同步需实机。 |
| `sq_GetAccel(...)` / `sq_GetShuttleValue(...)` / `sq_GetObjectTime(...)` / `sq_SetCurrentPos(obj, x, y, z)` | BUFF 状态用时间函数计算火球跟随位置。 | 轨迹、阻挡、卡顿和同步不能静态证明。 |
| `IRDCollisionObject.sendStateOnlyPacket(state)` | 角色和 PO 内部用它推动 BUFF/ATTACK/DESTROY/EXPLOSION 状态。 | 状态切换时序、丢包和联机表现需实机。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(path, horizonAngle, verticalAngle)` / `sq_RemoveMoveParticle()` | ATTACK 设置移动粒子，EXPLOSION 移除移动粒子。 | 粒子资源、方向、残留和轨迹需资源链或实机。 |
| `sq_AddDrawOnlyAniFromParent(...)` / `sq_SetfRotateAngle(...)` / `sq_ToRadian(...)` | ATTACK 追加射出视觉并按角度旋转射出动画。 | draw-only 是视觉链路，不证明攻击来源；旋转视觉和实际攻击盒需实机。 |
| `sq_SendDestroyPacketPassiveObject(obj)` | DESTROY/EXPLOSION 动画结束后销毁 PO。 | 销毁时序、残留和同步不能静态证明。 |

## 禁止外推

- 不要把再次施放写成“再次进入 `STATE_HOLONG_LIGHT`”。当前脚本在已有 `24222` 时是命令现有 PO 射出，并返回 false。
- 不要把 `HolongLightEx.skl` 写成独立运行 state。它是 `feature skill index` 指向的强化被动。
- 不要把 `ap_atmage_buff.nut` 写成直接提供防御提升的脚本；当前防御 change status 是 `24222` 的 BUFF 状态创建并挂入。
- 不要把 `shot_effect_dodge.ani` 或 `01_explosion_dodge.ani` 写成额外攻击来源；当前静态攻击盒在射出动画 `00_shot_dodge.ani` 中可见。
- 不要把 skill-load 的 `40` 参数解释成已确认图标路径；TypeSquirrel 标注与目标脚本实见存在差异。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、跟随轨迹、爆炸范围、销毁时序、Buff UI、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 首次释放：确认角色播放 HolongLight 动作后生成两个火球，并出现 skill-load 次数。
2. Buff 阶段：确认两个火球跟随角色，站立/冲刺时动画切换正常，角色防御数值或受击表现是否变化。
3. 再次释放：连续按技能，确认每次只射出一个尚未攻击的火球，最后一个射出后进入技能冷却。
4. 攻击阶段：确认射出方向、目标选择、命中、爆炸、伤害和音效表现。
5. 清理阶段：等待持续时间结束、角色死亡或重置副本，确认火球和 skill-load 均被清理。
6. 强化被动：学习/不学习 HolongLightEx，对比持续时间、防御提升和火球伤害是否变化。
7. 资源链：检查角色动画、PO 待机/移动/射出/消失/爆炸动画、攻击包、粒子和 ImagePacks2 资源是否完整。
