# Skill / State / NUT Runtime API 分组边界验收索引

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线的 API 分组收口入口。本文把已由主目标 PVF 只读样本和 TypeSquirrel 查询支撑过的 NUT API，按功能组整理成“最低可用含义、代表样本、不可静态证明边界”。本文不是完整 API 手册，不授权写 PVF，不替代运行测试。

## 100% 高覆盖口径

| 验收项 | 当前结论 |
| --- | --- |
| load_state 入口 | `sqr/character/*_load_state.nut` 12/12 已纳入入口矩阵。 |
| 模式桶 | 重型 state+PO、state+appendage/buff/throw、Avenger `CNAvenger`、Creator hybrid/mouse-control、Common loop state、script-only 被动入口、Priest light state 均已有代表样本。 |
| registry 规则 | skill、passiveobject、monster、APC 等数字 ID 不按外形猜，必须按父块和上下文走正确 `.lst`。 |
| API 分组 | 已把现有 API 按入口、技能使用、state 参数、appendage、PO、AttackInfo、对象/场景、timer/冷却、移动/输入、视觉/粒子、弱定义 helper 分组。 |
| Workbench 闭环 | 本索引用于最终 MANIFEST 与检查脚本验收；静态结论仍保留运行风险。 |

## API 功能组总览

| 功能组 | 代表 API / 对象 | 代表样本 | 最低可用结论 | 不可静态证明 |
| --- | --- | --- | --- | --- |
| 入口注册 | `IRDSQRCharacter.pushScriptFiles`、`pushState`、`pushPassiveObj`、`CNAvenger.push*` | load_state 矩阵、Avenger、Creator、Common、Priest | 判断脚本是否可能进入运行时的第一入口。 | 函数被注册不等于技能实际可用、命中或资源完整。 |
| skill registry / 数据 | `skill/*.lst`、`.skl [static data]`、`[level info]`、`sq_GetLevelData`、`sq_GetIntData` | Burster、ReleaseBuffs、Creator、Avenger | skill ID 必须按当前职业 registry 闭合；数据列只能按目标脚本读取点解释。 | 数据列最终数值、面板、PVP 修正和服务端结算。 |
| 技能使用 / 命令 | `sq_IsCommandEnable`、`sq_IsEnterSkill`、`sq_IsUseSkill`、`setSkillCommandEnable` | Burster、Gunner comminterrupt、ReleaseBuffs | 说明脚本尝试释放或开放命令。 | 是否学会、冷却、输入窗口、释放成功和手感。 |
| state packet / substate | `sq_IntVectClear`、`sq_IntVectPush`、`sq_AddSetStatePacket`、`sq_GetVectorData`、`setSkillSubState` | Gunner、ReleaseBuffs、AT Mage 多 state | int vector 和 substate 是状态参数通道，必须按当前链读取端闭合。 | 抢占优先级、取消窗口、同步和通用化 substate 含义。 |
| script-only / 被动回调 | `ProcPassiveSkill_*`、`procAppend_*`、`checkExecutableSkill_*`、`checkCommandEnable_*` | Swordman、Gunner、Priest | load_state 只推脚本也可能通过引擎回调进入逻辑。 | 回调频率、默认学习、外部注入和失败恢复。 |
| Appendage / buff | `CNSquirrelAppendage.sq_AppendAppendage`、`sq_AddFunctionName`、`sq_SetValidTime`、`sq_AddChangeStatusAppendageID`、`sq_AppendAppendageID` | MagicShield、ManaBurst、PowerOfDarkness、Gunner、Burster | appendage 是持续效果、proc、buff 和 change status 的主要挂载层。 | 生命周期、叠加、刷新、死亡清理、Buff UI 和最终数值。 |
| PassiveObject 创建 / receiveData | `pushPassiveObj`、`sq_SendCreatePassiveObjectPacket*`、`sq_StartWrite`、`sq_Write*`、`receiveData.read*` | AT Mage 多 PO、Avenger、Creator | PO ID 必须走 `passiveobject/passiveobject.lst`；写包顺序必须和读取端闭合。 | 轨迹、命中、销毁时序、同步、客户端资源完整性。 |
| AttackInfo / hit packet | `sq_GetCurrentAttackInfo`、`sq_SetCurrentAttackInfo`、`sq_SetCurrentAttackBonusRate`、`sq_SendHitObjectPacket*`、异常状态写入 | WindStrike、DarkChange、LightningWall、MagicShield | 说明脚本尝试改写攻击包、发送命中包或异常状态。 | 最终伤害、命中、卡肉、浮空、抗性、PVP 和服务端结算。 |
| 对象 / 场景 / 目标 | `getObjectManager`、`isEnemy`、`sq_GetObjectId`、`sq_GetObjectByObjectId`、`sq_getGrowType`、`sq_IsTowerDungeon` | BlueDragonWill、ChainLightning、Gunner、Common | 支撑目标搜索、对象找回、转职分支和场景排除。 | 目标优先级、死亡/离场、特殊免疫、性能和联机一致性。 |
| Timer / 冷却 / 队列 | `setTimeEvent`、`EventTimer`、`sq_AddSkillLoad`、`startSkillCoolTime`、`CNRDSkill.isInCoolTime`、`setEnableChangeState` | PowerOfDarkness、ChainLightning、HolongLight、Burster、ReleaseBuffs | 支撑多段时序、冷却、装载和队列推进。 | timer 精度、UI 显示、失败释放恢复、跨图和服务端一致性。 |
| 移动 / 坐标 / 输入 | `sq_GetUniformVelocity`、`sq_SetMoveParticle`、`isMovablePos`、`IMouse.GetXPos/YPos`、`stage.getMainControl()` | Teleport、WaterCannon、PieceOfIce、CreatorMage | 支撑位移、轨迹、鼠标坐标和按键状态。 | 真实落点、阻挡、碰撞、手感、输入容错和同步。 |
| 动画 / 视觉 / 粒子 | `sq_CreateAnimation`、draw-only、`sq_flashScreen`、`sq_SetShake`、`GetparticleCreaterMap`、aura master | LightningWall、FrozenLand、PieceOfIce、Burster | 支撑视觉层、粒子、震动、吸附视觉或 draw-only 对象。 | 资源存在、图层、残留、实际吸附、攻击来源和多人显示。 |

## API 可信度分层

| 层级 | 可写入 Workbench 的结论 | 例子 | 边界 |
| --- | --- | --- | --- |
| TypeSquirrel 已查 + 主目标脚本实见 | 可写最低含义和目标链用途。 | `sq_AddSetStatePacket`、`sq_AppendAppendage`、`sq_GetSkillLevel`。 | 仍不能证明运行结果。 |
| 主目标脚本实见但 TypeSquirrel 未完整闭合 | 只能写“目标脚本观察到该调用形态”。 | `receiveData.read*`、部分 `getVar` 变量容器、`IMouse` 直接定义。 | 不写成完整 API 手册。 |
| 搜不到定义或目标未命中 | 不能作为当前主目标事实。 | `ForceUse_Character`、当前未闭合的 `IsInterval` 定义。 | 只能作为风险或线索。 |
| 运行效果层 | 必须另走运行测试或目标 PVF 实验。 | 伤害、命中、卡肉、击退、浮空、追踪、销毁、同步、PVP。 | 静态 Workbench 不替代实机。 |

## 后续默认动作

1. 用户问 Skill / State / NUT 入口、注册、API 边界时，先读高覆盖矩阵和本文。
2. 已有代表模式只复核、引用、汇报风险；不默认继续采样。
3. 只有明确出现“现有组无法解释的新 API 类别”或“某字段缺口待补”，才补一个最小主目标只读样本。
4. 运行效果、PVP、同步、资源完整性问题，直接转运行测试或资源链检查，不用静态账本硬推。
