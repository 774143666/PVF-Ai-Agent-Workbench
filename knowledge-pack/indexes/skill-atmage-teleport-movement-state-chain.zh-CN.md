# AT Mage / Teleport 位移 state 链只读账本

状态：默认可用

用途：记录男法师 `Teleport / 瞬移` 在主目标 PVF 中可静态闭合的 `skill -> load_state -> state/substate -> 输入方向 -> 可移动位置查找 -> 镜头滚动 -> 体效 appendage` 链。本文只证明当前目标静态结构，不证明最终位移坐标、碰撞绕障、无敌、同步、PVP、动作手感、镜头表现或客户端资源完整性。

## 一句话结论

Teleport 是男法 `skill 20`，注册到 `STATE_TELEPORT = 39`。释放成功后先进入 `SUB_STATE_TELEPORT_0`，播放 `CUSTOM_ANI_TELEPORT1` 并记录起点坐标；持续读取横向/纵向输入方向。第一段动画结束时，脚本用 `.skl [static data]` 的 X/Y 距离计算目标候选点，非 hold 状态下调用 `sq_SetfindNearLinearMovablePos(...)`，再切到 `SUB_STATE_TELEPORT_1` 播放 `CUSTOM_ANI_TELEPORT2`，第二段动画结束后回到站立。当前链没有 passiveobject，也没有 AttackInfo。

## 主目标只读闭合链

| 环节 | 主目标可见事实 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `20 -> ATMage/Teleport.skl`。 | 只证明男法技能 registry 路由。 |
| `.skl` 基础字段 | 名称为 `瞬移` / `Teleport`，类型 `[active]`，说明为向指定方向快速移动一定距离。 | 说明文本不证明最终坐标、绕障或同步。 |
| `.skl` 释放状态 | 文件中出现攻击状态 `8`，以及站立/跳跃类 `0 14` 的 `[executable states]` 组。 | 静态列表只作线索；当前 `checkExecutableSkill_Teleport` 直接调用 `sq_IsUseSkill(SKILL_TELEPORT)`，未额外在 NUT 中手写 state 白名单。 |
| `.skl` 静态距离 | dungeon `[static data]` 为 `400 100`；PVP `[static data]` 为 `500 250`；`[level property]` 将两列解释为 X 轴移动距离与 Y 轴移动距离。 | PVP 只是静态分区数据；最终 PVP 规则、坐标和限制需实机。 |
| header 常量 | `STATE_TELEPORT <- 39`，`SKILL_TELEPORT <- 20`，`CUSTOM_ANI_TELEPORT1 <- 36`，`CUSTOM_ANI_TELEPORT2 <- 37`。 | 常量只在当前男法脚本体系内成立。 |
| load_state 注册 | `atmage_load_state.nut` 注册 `Character/ATMage/Teleport/Teleport.nut` 到 `STATE_TELEPORT / SKILL_TELEPORT`。 | 证明 state NUT 有入口；不证明释放一定成功。 |
| passiveobject 需求 | 当前 `load_state` 未见 Teleport 对应 `pushPassiveObj`；Teleport NUT 未见创建 PO。 | 不要把 Teleport 写成 passiveobject registry 链。 |
| 初始切状态 | `checkExecutableSkill_Teleport` 成功后清空并初始化 `pos` 变量，向 int vector 写入 `SUB_STATE_TELEPORT_0`，发送 `STATE_TELEPORT`，优先级为 `STATE_PRIORITY_IGNORE_FORCE`。 | substate 0 只在当前 Teleport 链内有意义，不能跨技能外推。 |
| 命令可用 | 攻击状态下走 `sq_IsCommandEnable(SKILL_TELEPORT)`；其他状态返回 true。 | 命令可按不等于技能最终释放成功，也不证明可取消所有动作。 |
| substate 0 进入 | `onSetState_Teleport` 读取 substate 后 `setSkillSubState`，停止移动，记录当前 X/Y/Z 到 `pos`，播放 `MW_TELEPORT`，初始化方向变量为 neutral，设置 `CUSTOM_ANI_TELEPORT1`。 | 记录起点和播放动作不证明位移已发生。 |
| bodyeffect appendage | substate 0 追加 `Appendage/Character/ap_atmage_bodyeffect.nut`，技能索引为 `SKILL_TELEPORT`。实际文件位于 `sqr/appendage/character/ap_atmage_bodyeffect.nut`。 | 路径是 `sqr/` 语境；appendage 主要处理视觉体效，不是位移来源。 |
| 输入采集 | `onProcCon_Teleport` 在 substate 0 中用 `sq_GetInputDirection(0)` 和 `sq_GetInputDirection(1)` 分别记录横向与纵向方向。 | TypeSquirrel 对该 API 的注释较泛；当前只按目标脚本实见记录 0/1 参数用法。 |
| 第一段动画结束 | substate 0 的 `onEndCurrentAni_Teleport` 读取 `sq_GetIntData(SKILL_TELEPORT, 0/1)`；按左右方向改 X，按上下方向改 Y；无输入时按角色面向方向移动 X。 | 只证明候选目标点计算；不证明最终落点。 |
| hold 状态边界 | 若不处于 `ACTIVESTATUS_HOLD`，脚本调用 `sq_SetfindNearLinearMovablePos(fx, fy, currentX, currentY, 10)`。 | 该接口语义需实机验证；静态只读不能证明绕障、阻挡、落点修正或 hold 下的最终表现。 |
| 切到 substate 1 | 本机控制对象在第一段动画结束后发送 `STATE_TELEPORT`，int vector 已写入 `SUB_STATE_TELEPORT_1`。 | 控制权和网络同步需实机。 |
| substate 1 动作 | `onSetState_Teleport` 设置 `CUSTOM_ANI_TELEPORT2`。 | 动作显示和到达特效需资源链或实机。 |
| 第二段结束 | substate 1 的 `onEndCurrentAni_Teleport` 在本机控制对象上发送 `STATE_STAND`。 | 是否被打断、硬直、延迟或同步影响，静态只读不能证明。 |
| 镜头滚动 | `getScrollBasisPos_Teleport` 在 substate 0/1 且本机控制时调用 `sq_SetCameraScrollPosition`；substate 1 中用 `sq_GetUniformVelocity(orgX, posX, currentT, 200)` 平滑 X 方向镜头位置。 | 只证明脚本尝试调整镜头基准；实际镜头表现需实机。 |
| 角色动作索引 | `atmage.chr [etc motion]` 第 36/37 项为 `ATAnimation/Teleport1.ani`、`ATAnimation/Teleport2.ani`。 | 只证明动作索引闭合。 |
| Teleport1 动画 | `Teleport1.ani` 3 帧，每帧有 `[DAMAGE BOX]`；`FRAME000` 播放 `TELEPORT_ACT`；未见 `[ATTACK BOX]`。 | DAMAGE BOX 不等于无敌或可被击规则；是否可受击需实机。 |
| Teleport2 动画 | `Teleport2.ani` 5 帧，每帧有 `[DAMAGE BOX]`；未见 `[ATTACK BOX]`。 | 静态只读不证明到达动作期间受击、碰撞或同步。 |
| ALS 特效层 | `Teleport1.ani.als` 引用移动 `02_line_dodge.ani` 并创建 draw-only 对象；`Teleport2.ani.als` 引用到达 line/ground/smoke 多个动画并添加 none effect / draw-only。 | Script 内资源路径可见不等于客户端 NPK/ImagePacks2 一定完整。 |
| bodyeffect 视觉 | `ap_atmage_bodyeffect.nut` 在 `drawAppend` 中按 `SKILL_TELEPORT` 设置 LINEARDODGE、白色 RGB、alpha 匀速变化，并对当前动画及装扮图层调用 `setEffectLayer`。 | 只证明体效层调用；实际淡入淡出、装扮层、残留和遮罩表现需实机。 |
| bodyeffect 生命周期 | appendage 内部状态从 0 到 1，再设置 `APPENDAGE_INDEX_ISEND = 1` 后 `setValid(false)`；`isEnd` 固定返回 false。 | 生命周期靠 `drawAppend` 内部标记结束；异常中断或未绘制路径需实机。 |

## static data 读取点

| index | 当前脚本读取位置 | 用途边界 |
| ---: | --- | --- |
| 0 | `onEndCurrentAni_Teleport` | X 轴候选移动距离；dungeon 为 400，PVP 分区为 500。 |
| 1 | `onEndCurrentAni_Teleport` | Y 轴候选移动距离；dungeon 为 100，PVP 分区为 250。 |

## TypeSquirrel 与目标脚本已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_SetCurrentAnimation(animationIndex)` | 设置当前角色动画；Teleport 使用 36/37 两个自定义动作。 | 动作索引必须由当前 `.chr [etc motion]` 闭合。 |
| `IRDSQRCharacter.sq_GetInputDirection(...)` | Teleport 目标脚本用参数 0/1 读取横向/纵向输入方向。 | TypeSquirrel 签名说明较泛；参数语义只按当前目标脚本实见，不外推。 |
| `sq_GetDistancePos(startPos, direction, targetPos)` | 按起点、方向和距离计算 X 方向候选坐标。 | 只证明坐标计算接口；最终可达点仍看移动位置查找和实机。 |
| `sq_IsValidActiveStatus(obj, ACTIVESTATUS_HOLD)` | 判断对象是否处于 hold 异常状态；Teleport 用它决定是否调用可移动位置查找。 | hold 下最终是否移动、是否被禁用，需要实机。 |
| `IRDSQRCharacter.sq_SetfindNearLinearMovablePos(...)` | Teleport 用目标候选点、当前位置和半径参数调用该接口，尝试设置临近线性可移动位置。 | TypeSquirrel 注释不够具体；绕障、阻挡、碰撞和最终落点必须实测。 |
| `IRDSQRCharacter.sq_SetCameraScrollPosition(XPos, YPos, Uk)` | 设置镜头滚动位置；Teleport 的 `getScrollBasisPos` 使用。 | 镜头表现、本机/联机差异和滚动平滑度需实机。 |
| `sq_GetUniformVelocity(start, final, current, useTime)` | 用于 substate 1 的镜头 X 坐标平滑过渡，也用于 bodyeffect alpha 变化。 | 静态只读只证明数值插值，不证明实际视觉效果。 |
| `CNRDAnimation.setEffectLayer(...)` / `sq_RGB(...)` / `sq_ALPHA(...)` | bodyeffect 用于给当前动画和装扮图层设置 LINEARDODGE 体效颜色与透明度。 | 装扮图层、遮罩、残留和客户端资源需资源链或实机。 |
| `sq_AniLayerListSize(animation)` / `sq_getAniLayerListObject(animation, layer)` | bodyeffect 遍历当前动画图层并尝试给各层设置体效。 | 图层数量、装扮资源和实际显示仍需实机。 |
| `CNSquirrelAppendage.sq_GetSkillIndex()` | bodyeffect 通过 appendage 绑定的技能 ID 区分 Teleport 与 DieHard。 | 同一 appendage 文件服务多个技能，写结论时必须按 skillIndex 区分。 |

## 不要外推

- Teleport 不创建 passiveobject，不要扩成 PassiveObject / AttackInfo / Hitbox 广域样本。
- `SUB_STATE_TELEPORT_0/1` 只在 Teleport 链内有意义；不要跨技能复用。
- `.skl` 的 PVP static data 不能证明 PVP 最终距离或限制。
- `DAMAGE BOX` 只说明动作帧内有受击/碰撞盒字段，不能证明无敌、可受击、碰撞或卡位规则。
- Script 内可读特效路径不等于客户端资源完整。
- 静态只读不能证明最终落点、穿墙/绕障、同步、镜头手感、取消窗口或动作中断。

## 下一步实测建议

1. 站立、跳跃、攻击中分别释放 Teleport，确认脚本释放窗口与 `.skl [executable states]` 提示是否一致。
2. 分别按左/右/上/下/斜向/无方向输入，记录最终落点，与 dungeon static data `400/100` 对照。
3. 在墙边、障碍物、怪物挤压、hold 异常状态下测试 `sq_SetfindNearLinearMovablePos` 的最终落点和失败表现。
4. 检查 Teleport1/2 期间是否可被击、是否有无敌或受击打断，确认镜头滚动和体效是否残留。
