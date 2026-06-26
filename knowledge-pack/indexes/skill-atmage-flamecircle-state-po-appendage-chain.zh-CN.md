# AT Mage FlameCircle State/PO/appendage 链只读核验

状态：默认可用

用途：记录当前主目标中 `FlameCircle` 的 skill registry、state/substate、load_state、`24244` passiveobject、二进制写包/读包、旋转段 PO 命中、爆炸段角色自身攻击包、通用视觉 appendage 和 NUT API 边界。本文只覆盖这一个技能创建的 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`FlameCircle` 是男法 `skill 11` 的主动技能，运行入口注册到 `STATE_FLAMECIRCLE = 30`。角色从 `CASTING(5)` 进入 `0 -> 1 -> 2` 三段流程：substate 0 在 frame `>= 2` 创建 `24244` 旋转火环 PO，PO 按接收包中的旋转次数、半径、速度和攻击倍率循环命中；当 PO 标记接近完成后，角色切到 substate 1，再切 substate 2 播 `FlameCircle3.ani`，用角色自身 `CUSTOM_ATTACK_INFO_FLAMECIRCLE` 做最后爆炸攻击，并临时挂 `ap_atmage_effect.nut` 做视觉效果。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `11 -> ATMage/FlameCircle.skl`；`221 -> ATMage/FlameCircleEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `FlameCircle.skl` 为 active，命令 `↑↓↑ + Z`，冷却 `20000`，需求等级 `35`，前置 `FireRoad skill 6 level 5`，`[feature skill index] = 221`。 | 可释放条件仍受当前状态、冷却、MP、技能等级和引擎判断影响。 |
| `.skl executable states` | `[executable states]` 为 `0 8 14`。 | 只说明静态可执行状态线索，不证明强制释放、取消窗口或实机可用范围。 |
| header 常量 | `STATE_FLAMECIRCLE = 30`，`SKILL_FLAMECIRCLE = 11`；角色动画索引 `14/15/16/74` 分别为 `FLAMECIRCLE1/2/3/CASTING`；自定义攻击信息 index `4` 为 `CUSTOM_ATTACK_INFO_FLAMECIRCLE`。 | 常量只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `FlameCircle` state，并注册 `po_ATFlameCircle.nut -> 24244`。 | `24244` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24244 -> Character/Mage/ATFlameCircle.obj`。 | registry 显示名为“火焰爆炸”，不能用显示名解释技能语义。 |
| PO object / atk | `ATFlameCircle.obj` 是 normal layer、pass all、piercing power `1000`，basic motion `05_fspin_dodge.ani`，attack info `ATFlameCircle.atk`。 | object/atk 只能证明静态载体存在，不证明命中、伤害、击退、浮空或 PVP 表现。 |
| 视觉 appendage | substate 2 frame `>= 1` 追加 `Appendage/Character/ap_atmage_effect.nut`；真实 PVF 文件落点为 `sqr/appendage/character/ap_atmage_effect.nut`。 | appendage 主要改当前动画效果层；视觉显示、残留和资源完整性需实机或资源链检查。 |

## `.skl` 数据与运行索引

| 运行字段 | 来源 | 当前用法 | 边界 |
| --- | --- | --- | --- |
| 旋转半径倍率 | static data index `0`，当前为 `100` | 角色写入 `spin_r = static0 / 100.0`；PO 用它缩放图片和攻击盒。 | 视觉半径和实机命中范围需测试。 |
| 爆炸范围倍率 | static data index `1`，当前为 `100` | substate 2 用它缩放 `FlameCircle3.ani` 攻击盒；离开 state 时按倒数尝试恢复。 | TypeSquirrel 对全局 `sq_SetAttackBoundingBoxSizeRate` 有非 PO 警告；当前脚本实见不等于实机范围可靠。 |
| 旋转次数 | level data index `0` | 角色写入 PO，PO 用作循环计数上限。 | `FlameCircleEx.skl` 的 special level up 显示可增加次数，但静态只读不能证明最终合并规则。 |
| 旋转速度倍率 | level data index `1` | 角色写入 PO，PO 用 `CNRDAnimation.setSpeedRate(speed)` 同步主动画和 draw-only 子视觉速度。 | 播放速度、命中节奏和同步需实机。 |
| 旋转攻击倍率 | level data index `2` 经 `sq_GetBonusRateWithPassive` | 角色写入 PO；PO 设置当前 AttackInfo 百分比攻击力。 | 最终伤害、被动叠加和 PVP 修正不能静态证明。 |
| 爆炸攻击倍率 | level data index `3` 经 `sq_GetBonusRateWithPassive` | 角色 substate 2 设置自身当前攻击包百分比倍率。 | 最终伤害、击飞和 PVP 修正需实机。 |
| 强化被动 | `FlameCircleEx.skl` 为 passive，前置 `11 level 10`，说明每级旋转次数 +1、爆炸攻击力 +10%。 | 说明文字和 special level up 只证明强化意图；是否、何时、如何影响主动技能要靠引擎语义或实机确认。 |

## 角色 state / substate 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_FlameCircle` 成功使用 `SKILL_FLAMECIRCLE` 后压入 `SUB_STATE_FLAMECIRCLE_CASTING = 5`，发送 `STATE_FLAMECIRCLE` 且 `hasSubState=true`。 | 成功进入仍受技能条件和引擎判断影响。 |
| 命令允许 | `checkCommandEnable_FlameCircle` 在普通攻击 state 内额外查 `sq_IsCommandEnable`，其他状态返回 true。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| casting | 设置 `CUSTOM_ANI_FLAMECIRCLE_CASTING`，调用 `sq_SetStaticSpeedInfo(... speedRate, speedRate)`，并追加火元素链。 | 当前文件内原本计算 `speedRate` 的代码被注释；TypeSquirrel 当前上下文未解析到 `speedRate` 定义。这里只记录静态风险，不断定实机必坏。 |
| substate 0 | 设置 `CUSTOM_ANI_FLAMECIRCLE1`。`onProc` 在 frame `>= 2` 且本机控制时写包并创建 `24244`。 | frame 触发是轮询当前帧，不是 keyframe flag；实际时序需实机。 |
| 等待 PO 完成 | substate 0 frame `>= 3` 后读取 `obj.sq_GetPassiveObject(24244)`；若 PO 不存在，或 PO 的 `sq_var[3] == 1`，角色发送 substate 1。 | `sq_GetPassiveObject` 返回受创建、销毁和同步影响；当前脚本有空对象分支。 |
| substate 1 | 设置 `CUSTOM_ANI_FLAMECIRCLE2`；动画结束后发送 substate 2。 | 动作衔接和可取消窗口需实机。 |
| substate 2 | 播 `CUSTOM_ANI_FLAMECIRCLE3` 和声音 `MW_FLAMECILCLE`，设置 `CUSTOM_ATTACK_INFO_FLAMECIRCLE`，按 static index 1 缩放攻击盒，按 level data index 3 设置爆炸攻击倍率，触发屏幕震动。 | 爆炸攻击来源是角色当前攻击包；命中、击飞、震动和 PVP 表现不能静态证明。 |
| substate 2 appendage | frame `>= 1` 追加 `ap_atmage_effect.nut`，该 appendage 按 `sq_GetSkillIndex() == SKILL_FLAMECIRCLE` 设置当前动画效果层并在 alpha 达目标后失效。 | appendage 是视觉效果链路，不证明攻击来源。 |
| onEndState | 如果 `expflag` 为 1，脚本尝试按 static index 1 的倒数恢复攻击盒倍率。 | 恢复是否完整、异常中断和多次释放残留需实机。 |
| onAttack | substate 2 命中时调用 `sq_AddHitObject(obj, damager)` 标记目标。 | 标记不等于最终伤害或重复命中规则已证明。 |

## 写包字段与 PO 读取

| 顺序 | 角色写入 | PO 读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | word `spin_num` | word | PO 总旋转次数。 |
| 2 | float `spin_r` | float | 主 PO 动画、draw-only 子视觉和攻击盒缩放倍率。 |
| 3 | float `speed_rate` | float | 主 PO 动画和 draw-only 子视觉播放速度倍率。 |
| 4 | dword `firstAttackRate` | dword | 旋转段 `ATFlameCircle.atk` 百分比攻击倍率。 |

边界：

- TypeSquirrel 可查到 `sq_BinaryStartWrite`、`sq_BinaryWriteWord`、`sq_BinaryWriteFloat`、`sq_BinaryWriteDword`；读取端 `receiveData.readWord/readFloat/readDword` 当前未查到独立内置定义，只按目标脚本实见记录。
- 写包顺序必须和 PO 读取顺序一致；宽度不能凭字段名猜。

## `24244` PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取旋转次数、半径、速度、攻击倍率；缩放当前动画图片，设置动画速度，保存计数变量，创建 draw-only 子视觉 `04_bspin_dodge.ani`，缩放攻击盒并设置当前 AttackInfo 攻击倍率。 | 视觉缩放、攻击盒缩放和命中范围需实机。 |
| draw-only 子视觉 | `04_bspin_dodge.ani` 无攻击盒，通过 `sq_CreatePooledObject` 和 `sq_AddObject(..., 2, false)` 挂到 PO 上。 | 这是视觉链路，不是命中来源。 |
| 主 PO 动画 | `05_fspin_dodge.ani` 有 5 帧、循环、每帧都有攻击盒。 | 静态攻击盒不能证明最终命中、伤害、击退或浮空。 |
| 旋转计数 | `procAppend` 用动画 frame 0-2 / 3-4 的切换标志累加旋转次数，并调用 `resetHitObjectList()` 允许下一轮命中。 | 多段命中节奏、帧率、卡顿和同步需实机。 |
| 完成标记 | 当 `spin_cnt >= total_spin_cnt - 1` 时设置 `sq_var[3] = 1`，角色随后可切 substate 1。 | 角色轮询和 PO 计数之间的实际时序需实机。 |
| 自毁 | 当 `spin_cnt >= total_spin_cnt` 时，清理 draw-only 子视觉并发送 `sq_SendDestroyPacketPassiveObject(obj)`。 | 销毁时序、残留视觉和联机同步需实机。 |
| 命中后标记 | `onAttack` 在 `spin_cnt >= total_spin_cnt` 时调用 `sq_AddHitObject(obj, damager)`。 | 不能静态证明重复命中边界或目标过滤。 |

## 动画与攻击载体

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATAnimation/FlameCircleCasting.ani` | 角色 etc motion index `74`；1 帧，有 damage box 和 superarmor 标记。 | casting 速度调用存在 `speedRate` 静态风险；实际释放需实机。 |
| `ATAnimation/FlameCircle1.ani` | 角色 etc motion index `14`；17 帧，frame 0 播 `FLAMECILCLE_SPIN`，frame 3 播 `MW_FLAMECILCLE_READY`，frame 4-16 是 loop 段。 | 角色本体该段没有攻击盒，旋转命中来自 PO。 |
| `ATAnimation/FlameCircle2.ani` | 角色 etc motion index `15`；2 帧，无攻击盒。 | 过渡动作，不写成攻击来源。 |
| `ATAnimation/FlameCircle3.ani` | 角色 etc motion index `16`；7 帧，frame 0-4 有 attack box，frame 0 播 `FLAMECILCLE_ATK`。 | 爆炸段攻击盒来自角色动画；命中、击飞和范围需实机。 |
| `passiveobject ... 05_fspin_dodge.ani` | PO 主动画 5 帧循环，每帧有 attack box。 | 旋转段命中载体；最终命中次数需实机。 |
| `passiveobject ... 04_bspin_dodge.ani` | PO 创建的 draw-only 子视觉，5 帧循环，无 attack box。 | 只作为视觉辅助，不是攻击来源。 |
| `ATFlameCircle.atk` | PO 旋转段攻击包：magic/fire/weapon damage apply，knockback `-1`，lift up `50`，hit wav `ASTORM_HIT_FIRE`。 | 击退、浮空和伤害需实机。 |
| `ATAttackInfo/FlameCircle.atk` | 角色爆炸段攻击包：magic/fire/weapon damage apply，down，push aside `400`，lift up `300`，hit down。 | 击飞、击倒、推开和 PVP 表现需实机。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDCharacter.setSkillSubState(substate)` / `getSkillSubState()` | FlameCircle 用成员方法记录和读取 `5/0/1/2` 等子状态。 | 子状态数字只对本技能链闭合，不能跨技能硬套。 |
| `sq_BinaryStartWrite()` / `sq_BinaryWriteWord/Float/Dword(...)` | FlameCircle 创建 PO 前写入 word/float/float/dword 四项数据。 | 读取端顺序必须闭合；`receiveData.read*` 当前只按目标脚本实见记录。 |
| `CNRDAnimation.setImageRate(width, height)` / `setSpeedRate(rate)` | PO 按接收包缩放图片和调动画速度。 | 视觉尺度、播放速度和实际命中节奏需实机。 |
| `sq_SetAttackBoundingBoxSizeRate(currentAni, xRate, yRate, zRate)` | PO 缩放旋转段攻击盒；角色 substate 2 也用它缩放爆炸动画攻击盒。 | TypeSquirrel 对非 PO 使用有警告；当前脚本实见不等于实机范围可靠。 |
| `sq_CreateAnimation(...)` / `sq_CreatePooledObject(...)` / `sq_AddObject(...)` | PO 创建并挂接 `04_bspin_dodge.ani` 作为 draw-only 子视觉。 | draw-only 不等于攻击来源；显示、层级和残留需资源链或实机。 |
| `CNRDPassiveObject.getTopCharacter()` | PO 在 `procAppend` 找创建它的角色；角色不在或不处于 FlameCircle 时自毁。 | 父角色失效、中断和同步状态需实机。 |
| `IRDCollisionObject.resetHitObjectList()` | PO 每次旋转计数推进后重置命中列表，用于多段命中。 | 重复命中、目标过滤、PVP 和同步不能静态证明。 |
| `sq_AddHitObject(obj, damager)` | PO 和角色爆炸段都用它标记目标已命中过。 | 只证明脚本标记命中对象；最终伤害与重复命中边界需实机。 |
| `sq_SendDestroyPacketPassiveObject(obj)` / `CNRDObject.setValid(false)` | PO 完成后销毁自身，并把 draw-only 子视觉设为无效。 | 销毁时序、残留和联机同步需实机。 |
| `CNSquirrelAppendage.sq_AppendAppendage(...)` / `sq_GetSkillIndex()` | 角色爆炸段追加通用 appendage；appendage 按技能 ID 选择 FlameCircle 的黑色 dodge 效果。 | appendage 是视觉效果链；生命周期和显示需实机。 |
| `IRDAppendage.setValid(false)` / `CNRDAnimation.setEffectLayer(...)` | 通用 appendage 在 alpha 达目标后失效，并改当前动画效果层。 | 透明度、装扮层、残留和资源表现需资源链或实机。 |
| `IRDSQRCharacter.sq_SetShake(...)` / `sq_SetShake(...)` | FlameCircle 爆炸段触发屏幕震动。 | 震动幅度、是否仅本机/全局和多人表现需实机。 |

## 禁止外推

- 本页只证明 `FlameCircle` 这一个技能链；不要把 `24244` 的旋转计数、重置命中列表或 draw-only 子视觉写成其他 PO 的通用机制。
- 不要把 `FlameCircleEx.skl` 写成独立运行 state。它是 `feature skill index` 指向的强化被动。
- 不要把 `FlameCircleEx.skl` 的说明直接写成主动技能最终必定增加次数和爆炸攻击力；需要引擎语义或实机确认。
- 不要把 `04_bspin_dodge.ani` 写成攻击来源；它没有攻击盒，当前攻击来源是 `05_fspin_dodge.ani` 和角色 `FlameCircle3.ani`。
- 不要把当前文件内 `speedRate` 静态风险直接写成实机必坏；只能记录为需运行验证的脚本形状风险。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、旋转节奏、重复命中、爆炸范围、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机释放：确认 casting -> spin -> ready -> explosion -> stand 的动作顺序。
2. 旋转段：按不同技能等级确认 `24244` 的旋转次数、旋转速度、多段命中和火属性表现。
3. 强化被动：学习/不学习 FlameCircleEx，对比旋转次数和爆炸伤害是否变化。
4. 爆炸段：确认 `FlameCircle3.ani` 的攻击范围、击倒、推开、浮空和震动表现。
5. 风险点：重点观察 casting 阶段是否因 `speedRate` 未闭合出现动作速度异常或脚本异常。
6. 资源链：检查角色 4 段动画、PO 两个动画、PO/角色攻击包、音效和 ImagePacks2 资源是否完整。
