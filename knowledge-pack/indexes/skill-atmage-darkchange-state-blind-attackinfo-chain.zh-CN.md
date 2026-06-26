# AT Mage / DarkChange state 失明攻击包边界只读账本

状态：默认可用

用途：记录男法师 `DarkChange / 暗域扩张` 在主目标 PVF 中可静态闭合的 `skill -> load_state -> state/substate -> 角色攻击信息 -> 动画攻击盒 -> 失明异常状态` 链。本文只证明当前目标静态结构，不证明最终命中、伤害、失明触发、抗性、PVP、同步、动作手感或客户端资源完整性。

## 一句话结论

DarkChange 是男法 `skill 4`，注册到 `STATE_DARK_CHANGE = 23`。释放成功后按 `READY(0) -> START(1)` 两段 substate 运行，READY 段设置 `CUSTOM_ATTACK_INFO_DARK_CHANGE = 0` 和攻击倍率，START 段播放带 `[ATTACK BOX]` 的动作并按 level data 的范围倍率缩放当前动画攻击盒。非 PVP 分支通过全场 active 对象回调给屏幕内敌人发送 `ACTIVESTATUS_BLIND` 异常状态包；PVP 分支在 `onAttack` 中把失明写入当前 AttackInfo。当前链没有 passiveobject，也没有专属 appendage NUT。

## 主目标只读闭合链

| 环节 | 主目标可见事实 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `4 -> ATMage/DarkChange.skl`，`214 -> ATMage/DarkChangeEx.skl`。 | 只证明男法技能 registry 路由。 |
| `.skl` 基础字段 | 名称为 `暗域扩张` / `DarkChange`，类型 `[active]`，`[feature skill index] 214`，前置技能为 `5 5`。 | 说明技能依赖和 EX 入口；不证明最终释放或伤害。 |
| `.skl` 释放状态 | `[executable states]` 为 `8 0 14`，命令为 `↑→→ + Z`。 | 静态列表只作释放线索；具体窗口、取消和失败条件需实机。 |
| `.skl` 等级列 | level property 为 `攻击力`、`攻击范围`、`失明Lv`、`失明几率`、`失明持续时间`；1 级 dungeon 行为 `1361 / 200 / 32 / 100 / 3000`，PVP 行为 `105 / 100 / 32 / 50 / 1500`。 | PVP 静态分区数据不等于 PVP 最终规则。 |
| EX 技能 | `DarkChangeEx.skl` 是 `[passive]`，前置 `4 10`；`[special level up]` 显示提升攻击列、失明等级列和持续时间列。 | 只能写作静态加成意图；最终被动叠加和数值需运行验证。 |
| header 常量 | `STATE_DARK_CHANGE <- 23`，`SKILL_DARK_CHANGE <- 4`，`CUSTOM_ANI_DARK_CHANGE_READY <- 2`，`CUSTOM_ANI_DARK_CHANGE_START <- 3`，`CUSTOM_ATTACK_INFO_DARK_CHANGE <- 0`。 | 常量只在当前男法脚本体系内成立。 |
| load_state 注册 | `atmage_load_state.nut` 注册 `Character/ATMage/DarkChange/dark_change.nut` 到 `STATE_DARK_CHANGE / SKILL_DARK_CHANGE`。 | 证明 state NUT 有入口；不证明释放一定成功。 |
| passiveobject 需求 | 当前 `load_state` 未见 DarkChange 对应 `pushPassiveObj`；DarkChange 目录只读到 `dark_change.nut`。 | 不要把 DarkChange 写成 passiveobject registry 链。 |
| 初始切状态 | `checkExecutableSkill_DarkChange` 成功后写入 `SUB_STATE_DARK_CHANGE_READY`，发送 `STATE_DARK_CHANGE`，优先级为 `STATE_PRIORITY_USER`。 | substate 0 只在当前 DarkChange 链内有意义，不能跨技能外推。 |
| READY 段 | `onSetState_DarkChange` 播放 `CUSTOM_ANI_DARK_CHANGE_READY`，设置 `CUSTOM_ATTACK_INFO_DARK_CHANGE`，用 `sq_GetBonusRateWithPassive(SKILL_DARK_CHANGE, STATE_DARK_CHANGE, 0, 1.0)` 取攻击列并写入当前攻击倍率，按 cast time 启动读条。 | 设置攻击包和倍率不证明最终命中或伤害。 |
| START 段 | READY 动画结束后切到 `SUB_STATE_DARK_CHANGE_START`，播放 `CUSTOM_ANI_DARK_CHANGE_START`，闪屏，按 level data 第 1 列计算 `dark_range * 0.01`，并对当前动画调用 `setAttackBoundingBoxSizeRate(...)`。 | 攻击盒缩放、命中范围和中断还原需实机验证。 |
| START 攻击盒 | `DarkChangeStart.ani` 8 帧；`FRAME000-002` 有 `[ATTACK BOX]`，`FRAME000` 有 `[SET FLAG] 1`。 | 静态攻击盒不证明命中、伤害、卡肉或范围表现。 |
| 攻击信息槽 | `atmage.chr [etc attack info]` 第 0 项为 `ATAttackInfo/DarkChange.atk`；该攻击包为魔法、暗属性、武器伤害应用，含 push aside 30、lift up 80。 | `.atk` 字段只证明攻击包静态参数；最终反馈需实机。 |
| 非 PVP 失明 | START 段在非 PVP 且本机控制时调用 `callBackAllObject(obj, 0, OBJECTTYPE_ACTIVE)`；回调里把屏幕内敌对 active object 作为目标，按 level data 第 2/3/4 列发送 `ACTIVESTATUS_BLIND` 异常状态包。 | 只证明脚本尝试发送失明；概率、等级、抗性、免疫、屏幕判定和同步需实机。 |
| PVP 失明 | `onAttack_DarkChange` 在 PVP 中取当前 AttackInfo，并调用 `sq_SetChangeStatusIntoAttackInfo(attackInfo, 0, ACTIVESTATUS_BLIND, rate, level, time)`。 | 只证明 PVP 分支尝试把失明写入攻击包；触发时序和最终规则需实机。 |
| END 还原 | 离开 `STATE_DARK_CHANGE` 时若已缩放攻击盒，则读取保存的倍率并调用 `setAttackBoundingBoxSizeRate(1.0 / dark_range, false)` 尝试还原。 | 中断、死亡、换状态和异常路径下是否完全还原需实机。 |
| 视觉层 | `DarkChangeReady.ani.als` 引用 charge normal/dodge；`DarkChangeStart.ani.als` 引用 backlight、hand、bodylight、DarkChangeCircle 等 draw-only 视觉；`DarkChangeCircle.ani.als` 再组合多个 circle/light/shockwave/hand 动画。 | Script 内资源路径可见不等于客户端 NPK/ImagePacks2 一定完整。 |
| 元素链调用 | START 段调用 `addElementalChain_ATMage(obj, ENUM_ELEMENT_DARK)`。 | 本桶未展开该函数定义，不能把元素链最终效果写成 DarkChange 已确认事实。 |

## level data 读取点

| index | 当前脚本读取位置 | 用途边界 |
| ---: | --- | --- |
| 0 | READY 段 `sq_GetBonusRateWithPassive(...)` | 百分比攻击力列，最终伤害需实机。 |
| 1 | START 段 `sq_GetLevelData(...)` | 攻击范围缩放倍率，脚本除以 100 后用于当前动画攻击盒缩放。 |
| 2 | 非 PVP 回调 / PVP onAttack | 失明等级。 |
| 3 | 非 PVP 回调 / PVP onAttack | 失明概率。 |
| 4 | 非 PVP 回调 / PVP onAttack | 失明持续时间。 |

## TypeSquirrel 与目标脚本已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_SetCurrentAttackInfo(attackInfoIndex)` | 设置 `.chr [etc attack info]` 槽位；DarkChange 用槽 0。 | 槽位必须由当前 `.chr` 闭合。 |
| `IRDSQRCharacter.sq_SetCurrentAttackBonusRate(rate)` / `sq_GetBonusRateWithPassive(...)` | 读取含被动修正的攻击列并写入当前攻击倍率。 | 最终伤害和被动叠加不能静态证明。 |
| `sq_StartDrawCastGauge(obj, time, bool)` / `sq_EndDrawCastGauge(obj)` | READY 开始读条，START 结束读条。 | 读条显示、取消和手感需实机。 |
| `sq_flashScreen(...)` / `sq_SetMyShake(...)` | START 段黑色闪屏，keyframe flag 1 触发本机震动。 | 视觉和震动表现需实机或资源链。 |
| `CNRDAnimation.setAttackBoundingBoxSizeRate(sizeRate, bool)` | DarkChange 对当前角色动画攻击盒做缩放，并在离开 state 时尝试还原。 | 命中范围、还原时序、中断路径和同步需实机。 |
| `IRDSQRCharacter.callBackAllObject(...)` | DarkChange 非 PVP 分支用它回调 active object，再自行筛屏幕碰撞和敌对关系。 | TypeSquirrel 签名说明较弱；对象范围、调用频率和同步需实机。 |
| `sq_sendSetActiveStatusPacket(damager, parentObj, status, rate, level, bool, time)` | 直接给目标发送异常状态包；DarkChange 非 PVP 用于失明。 | 概率、等级、抗性、免疫和持续时间不能静态证明。 |
| `sq_SetChangeStatusIntoAttackInfo(attackInfo, 0, status, rate, level, time)` | 向 AttackInfo 写入异常状态；DarkChange PVP 用于失明。 | 异常是否随本次攻击触发、PVP 修正和抗性需实机。 |

## 不要外推

- DarkChange 不创建 passiveobject，不要扩成 PassiveObject / AttackInfo / Hitbox 广域样本。
- `SUB_STATE_DARK_CHANGE_READY/START` 只在 DarkChange 链内有意义。
- 非 PVP 直接发异常包、PVP 写 AttackInfo 是当前脚本的分支形状，不等于失明最终一定生效。
- `.atk` 的 push aside、lift up 和 dark element 只证明静态字段，不能证明实战击退、浮空、卡肉或元素最终规则。
- Script 内可读视觉路径不等于客户端资源完整。
- 静态只读不能证明命中、伤害、失明概率、抗性、免疫、PVP 规则、同步或中断后攻击盒还原。

## 下一步实测建议

1. 在普通地下城释放 DarkChange，确认 READY 读条、START 攻击盒范围和失明是否覆盖屏幕内敌人。
2. 在 PVP 环境或 PVP 规则模拟中测试命中目标是否触发失明，重点记录概率、等级、持续时间与 `.skl` PVP 行是否一致。
3. 用不同技能等级测试攻击范围缩放，确认 level data 第 1 列是否等价于实际命中范围倍率。
4. 在释放中被打断、死亡、换状态时观察攻击盒是否还原，避免范围残留或下一动作异常。
