# AT Mage IceRoad State/Appendage/Disabled PO 边界只读核验

状态：默认可用

用途：记录当前主目标 PVF 中 `IceRoad / 冰霜之径` 的 skill registry、state、appendage、`24243` passiveobject 注册和未闭合创建入口。本文只写主目标只读可见事实，不把静态文本推断成实机效果。

## 一句话结论

当前主目标只读可确认：`skill 7 -> ATMage/IceRoad.skl -> STATE_ICEROAD = 26`，释放流程会进入 CASTING，再转到 `SUB_STATE_ICEROAD_0`，随后追加 `ap_ATMage_IceRoad.nut` 和通用视觉 appendage，并关闭技能 on/off 封印函数。`24243 -> ATIceRoad.obj` 虽已在 load_state 和 `passiveobject.lst` 注册，但当前可读 NUT 中未闭合到实际创建入口；地面攻击 PO、减速/冰冻命中链不能写成已静态闭合。

## 主目标只读闭合链

| 层级 | 主目标观察 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `7 -> ATMage/IceRoad.skl`，`217 -> ATMage/IceRoadEx.skl`。 | 只证明技能 ID 到 `.skl` 路由。 |
| header 常量 | `SKILL_ICEROAD = 7`，`STATE_ICEROAD = 26`，`CUSTOM_ANI_ICEROAD = 13`，`CUSTOM_ANI_ICEROAD_CASTING = 76`。 | 常量只在当前男法脚本上下文内解释。 |
| load_state | `atmage_load_state.nut` 注册 `IceRoad.nut`，并注册 `po_ATIceRoad.nut` 到 `24243`。 | 注册不等于运行时一定创建 PO。 |
| passiveobject registry | `24243 -> passiveobject/Character/Mage/ATIceRoad.obj`。 | 必须按 `passiveobject/passiveobject.lst` 解析；不能用 skill/monster/APC registry。 |
| `.skl` 主技能 | `IceRoad.skl` 为 active，命令 `→→ + Space`，需求等级 `25`，冷却 `8000`，施放时间 `500`，`[executable states] = 0 8 14`。 | 可释放状态、冷却、MP 和 on/off 行为仍需实机确认。 |
| `.skl level info` | 4 列：每 0.5 秒 MP 消减量、减速持续时间、移动速度减少率、减速几率。 | 当前脚本中 MP 消耗和 PO 创建代码为注释，不能只按 level info 写成运行事实。 |
| 强化技能 | `IceRoadEx.skl` 为 passive，`[pre required skill] 7 10`，level info 扩展到 7 列并描述冰冻几率、冰冻 Lv、冰冻持续时间。 | 强化数据只作为被动意图；当前 PO 创建入口未闭合时，冰冻运行效果不能静态证明。 |

## state 流程

| 回调 | 只读观察 | 边界 |
| --- | --- | --- |
| `checkExecutableSkill_IceRoad` | 如果角色已有有效 `ap_ATMage_IceRoad.nut`，直接调用 `sq_SendChangeSkillEffectPacket(obj, SKILL_ICEROAD)` 并返回 true；否则检查冷却，再 `sq_IsUseSkill(SKILL_ICEROAD)`，用 int vector 传 `SUB_STATE_ICEROAD_CASTING = 5` 进入 state。 | 再次施放发送的 skill effect packet 在当前 `IceRoad.nut` 内未读到同名接收回调；不能写成一定关闭或刷新。 |
| `checkCommandEnable_IceRoad` | 攻击 state 内额外查 `sq_IsCommandEnable(SKILL_ICEROAD)`，其他 state 返回 true。 | 命令层允许不等于实际释放成功。 |
| `onSetState` CASTING | 设置 `CUSTOM_ANI_ICEROAD_CASTING`，读取 `sq_GetCastTime`，再用 `sq_GetFrameStartTime(animation, 16)` 算读条，播放 `MW_ICEROAD` 并开始 cast gauge。 | 当前 `IceRoadCasting.ani` 静态只有 1 帧；frame 16 的返回语义必须运行确认。 |
| `onEndCurrentAni` CASTING | my control 时推入 `SUB_STATE_ICEROAD_0` 再次进入 `STATE_ICEROAD`。 | 只证明脚本推进形状；读条取消、失败释放和同步需实机。 |
| `onSetState` substate 0 | 设置 `CUSTOM_ANI_ICEROAD`。 | 当前角色 `IceRoad.ani` 只读为 10 帧、伤害盒，无攻击盒。 |
| `onProc` substate 0 | frame `>= 4` 追加通用视觉 appendage；frame `>= 7` 追加 `ap_ATMage_IceRoad.nut`，并在 my control 时 `skill.setSealActiveFunction(false)`。 | 这能闭合到 appendage 和技能 on/off 开关，不能闭合到 `24243` 创建。 |
| `onEndCurrentAni` substate 0 | my control 时回到 stand。 | 持续冰路是否保留完全取决于 appendage 生命周期和运行时。 |
| `onEndState` | 结束 cast gauge。 | UI 读条显示与取消必须实机。 |

## appendage 流程

### `ap_ATMage_IceRoad.nut`

| 回调 | 主目标观察 | 边界 |
| --- | --- | --- |
| `sq_AddEffect` | 添加前景动画 `Character/Mage/Effect/Animation/ATIceRoad/loop/00_icebottom_dodge.ani`。 | 当前读到的是视觉动画，不是 `24243` PO。 |
| `onStart` | 建两个 timer：第一个 `400/-1`，第二个 `500/-1`；播放循环声音 `ICEROAD_LOOP`。 | timer 只是准备；当前文本里实际事件触发创建 PO 的代码为注释。 |
| `proc` | 根据角色状态调整第一个 timer：dash 为 `400`，stand 且非 stay 为 `800`，其他为 `-1`。 | `t.isOnEvent`、扣 MP、创建 `24243`、`sendSetMpPacket` 均在注释块内。 |
| `onEnd` | 停止声音。 | 声音残留与同步需实机。 |

### `ap_ATMage_IceRoadCS.nut`

| 回调 | 主目标观察 | 边界 |
| --- | --- | --- |
| `onStart` | 清理前景效果并添加 `loop/01_iceup_dodge.ani`，初始化两个 vector。 | 该 appendage 在当前脚本中由 `po_ATIceRoad.nut` 的 skill effect 接收端追加；若 PO 未创建，则入口不闭合。 |
| `proc` | 若父对象不存在或 vector 未初始化则失效；若计时达到 `maxT`，切到 `end/00_icebottom_dodge.ani`；结束动画播完后失效。 | `sq_IsValidActiveStatus(ACTIVESTATUS_SLOW)` 判断存在但相关分支被注释；异常状态真实持续和视觉切换需实机。 |
| `onEnd` | 删除前景效果。 | 只证明清理调用，不证明资源显示。 |

## `24243` PO 与攻击链边界

| 项 | 主目标观察 | 边界 |
| --- | --- | --- |
| `ATIceRoad.obj` | `[pass all]`，basic motion `Animation/ATIceRoad/00_icebottom_dodge.ani`，attack info `AttackInfo/ATIceRoad.atk`。 | 对象静态可读，但当前 NUT 未闭合到创建。 |
| `ATIceRoad.atk` | magic、no element、damage reaction none、push/lift 为 0。 | 攻击包静态存在不证明会被创建或命中。 |
| PO 动画 | `passiveobject/.../ATIceRoad/00_icebottom_dodge.ani` 有攻击盒。 | 攻击盒只在 PO 被实际创建并运行时才可能参与判定；当前创建入口未闭合。 |
| `po_ATIceRoad.nut` receiveData | 读取 `changeTime/rate/movSpd` 三个 dword；再读 `exSkillLevel`，大于 0 时读 freeze 概率、等级、持续时间并写 AttackInfo freeze。 | 读取端存在，但写入端/创建端未闭合。 |
| `po_ATIceRoad.nut` onAttack | 按 `SKL_LV_3` 随机判定后，把目标 group/id 写入 skill effect packet。 | 只有 PO 被创建并命中时才可能触发；当前不能写成已生效减速。 |
| `po_ATIceRoad.nut` onChangeSkillEffect | 读回目标 group/id，给目标追加 `ap_ATMage_IceRoadCS.nut`，设置有效期和移动速度 change status。 | 这是 PO 内部链；当前主目标静态未证明 PO 创建，因此只能记录为未闭合读取端。 |

## 动画与资源引用

| 文件 | 只读观察 | 边界 |
| --- | --- | --- |
| `character/mage/atanimation/iceroadcasting.ani` | frame max 1，只有 damage box。 | state 读取 frame 16 是静态边界，需运行确认。 |
| `character/mage/atanimation/iceroad.ani` | frame max 10，frame 3 播放 `ICEBLADE_CAST`，只有 damage box。 | 角色动作本身不提供攻击盒。 |
| `Character/Mage/Effect/Animation/ATIceRoad/loop/00_icebottom_dodge.ani` | appendage 主视觉，loop，未见攻击盒。 | 视觉层不等于攻击来源。 |
| `Character/Mage/Effect/Animation/ATIceRoad/loop/01_iceup_dodge.ani` | 目标 CS appendage 视觉，loop，未见攻击盒。 | 只有 CS appendage 入口闭合时才可能显示。 |
| `Character/Mage/Effect/Animation/ATIceRoad/end/00_icebottom_dodge.ani` | 目标 CS appendage 收尾视觉，未见攻击盒。 | 视觉结束不证明异常结束规则。 |
| `Character/Mage/Effect/Animation/ATIceRoad/03_icecloud_dodge.ani` | 前几帧 image 为空，后续引用 `03_icecloud_dodge.img`，未见攻击盒。 | 当前核验未发现它是攻击来源；资源完整性仍需客户端链检查。 |

## TypeSquirrel API 边界

| API | 本桶用途 | 边界 |
| --- | --- | --- |
| `sq_SendChangeSkillEffectPacket(obj, skillIndex)` | IceRoad 再次施放、PO onAttack 都发送技能效果变化包。 | 必须有运行时接收端；当前 `IceRoad.nut` 未读到接收回调，PO 接收端又依赖 PO 创建。 |
| `CNRDSkill.setSealActiveFunction(bool)` | substate 0 追加主 appendage 后把 IceRoad 技能设为 off。 | on/off UI、再次施放、冷却和失败恢复需实机。 |
| `CNSquirrelAppendage.sq_AppendAppendage(...)` / `sq_Append(...)` | 追加 IceRoad 主 appendage、通用视觉 appendage、目标 CS appendage。 | appendage 生命周期、叠加、死亡清理、跨图和同步需实机。 |
| `EventTimer.setParameter(...)` / `resetInstant(...)` | 主 appendage 根据 dash/stand 调整事件间隔。 | 当前创建/扣 MP 事件代码为注释；timer 本身不证明会产出 PO。 |
| `CNSquirrelAppendage.sq_AddChangeStatusAppendageID(...)` | PO 的 skill effect 接收端给目标追加移动速度 change status。 | 当前 PO 创建入口未闭合；减速最终数值和刷新规则需实机。 |
| `sq_IsValidActiveStatus(...)` / `sq_IsEnd(...)` | CS appendage 检查异常状态和收尾动画是否结束。 | 相关慢速状态检查分支部分注释；异常是否存在和动画结束时机需实机。 |

## 禁止外推

- 不要把 `24243` 注册写成“冰雾 PO 已运行”。当前主目标只读没有闭合到可执行创建入口。
- 不要把 `ATIceRoad.obj` 的攻击盒写成已命中来源。攻击盒必须以 PO 实际创建为前提。
- 不要把 `.skl` 的 MP 消耗描述写成已扣 MP。当前主 appendage 中扣 MP 逻辑为注释。
- 不要把 `IceRoadEx` 的冰冻描述写成已生效。当前只能确认强化 `.skl` 和 PO 读取端意图。
- 不要用辅助对照或教程补齐本桶缺失入口；若要恢复运行效果，需另走受控写入实验生命周期。

## 下一步验收

1. 运行测试：施放 IceRoad 后观察技能是否进入 on/off 状态、是否出现脚下视觉、再次按技能是否关闭或刷新。
2. 运行测试：dash/走路/站立时是否实际生成能碰撞敌人的冰雾；若没有，符合当前静态“PO 创建入口未闭合”风险。
3. 运行测试：确认是否扣 MP；当前静态文本不能证明扣 MP。
4. 运行测试：若想恢复减速/冰冻，需要单独设计目标 PVF 实验，先补创建写包，再验证 `24243` 命中、减速、IceRoadEx 冰冻和资源显示。
