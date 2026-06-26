# CreatorMage Hybrid / Mouse-Control 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中 CreatorMage hybrid / mouse-control 桶的代表样本。本文只证明当前主目标 PVF 中 CreatorMage 的 load_state 混合入口、script-file 技能库、mouse-control 坐标流、state+PO 创建链和 registry 关系静态可见；不证明实战命中、伤害、鼠标手感、抓取成功率、能量消耗、PVP、同步或客户端资源完整性。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `IRDSQRCharacter.pushScriptFiles` + `IRDSQRCharacter.pushState` + `IRDSQRCharacter.pushPassiveObj` 的 CreatorMage 混合入口。 | CreatorMage 不能按普通“每个技能都 pushState”的职业理解。 |
| script-file 样本 | `Mgrab / 时空之手`，skill id `137`。 | `Mgrab.nut` 是被推入脚本库；当前不证明它由 load_state 直接注册 state。 |
| state+PO 样本 | `WindPress / 超能旋风波`，skill id `248`，state `STATE_WINDPRESS = 67`，PO `24355`。 | 只覆盖 CreatorMage 的代表 state+PO 链，不外推到 WindStorm、WoodFence 或全部 Creator 技能。 |
| 已覆盖缺口 | 补上高覆盖矩阵里的 CreatorMage hybrid / mouse-control 代表样本。 | 后续 CreatorMage 默认只引用，不继续逐技能扩样。 |

## load_state 入口形态

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 公共脚本 | `creatormage_load_state.nut` 推入 CreatorMage header、`mousecontrol_lib.nut`、common 和 passive 脚本。 | 推入脚本只说明文件进入运行脚本环境，不等于直接注册 state。 |
| script-file 技能库 | `Mgrab`、`Firewall`、`WoodFence`、`IceRock`、`FireMeteo`、`IcePlate`、`WindStorm` 通过 `pushScriptFiles` 推入。 | 这些技能不能只按 load_state 的 state 注册表解释。 |
| state 注册 | `FireHurricane`、`IceShield`、`WindPress`、`CreatorFlame`、`CreatorIce`、`CreatorDisturb`、`CreatorGuardian`、`CreatorWind` 通过 `pushState` 注册。 | state 注册仍需结合对应 `.skl` 和脚本回调。 |
| PO 注册 | `24353`、`24354`、`24355`、`24356` 通过 `pushPassiveObj` 注册 NUT。 | 数字 ID 必须走 `passiveobject/passiveobject.lst`。 |

## Mgrab script-file / mouse-control 样本

| 节点 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| skill registry | `skill/creatormage.lst -> CreatorMage/mgrab.skl`，技能名 `时空之手 / Draw`，类型为 `[passive]`，static data 为 `150 5 30`，level property 说明抓取范围和能量消耗值。 | `[passive]` 不等于没有运行逻辑；CreatorMage 通过脚本库和 mouse-control 调用。 |
| header | `STATE_MGRAB = 61`，`SKILL_MGRAB = 137`。 | 当前 load_state 未见 `Mgrab` 的 `pushState` 行；不能写成普通 state 注册入口。 |
| 初始化 | `setStateMouseGrab` 初始化 `mgrab` var、timer vector 和 ct timer，并清理 `grabobj` outline。 | 静态只读不证明该函数何时被引擎调用。 |
| 鼠标选取 | `grabThrowObject` 使用 `IMouse.GetXPos()` / `IMouse.GetYPos()` 找鼠标下目标，检查 `sq_IsHoldable` 与 `sq_IsGrabable`，并调用 Creator 消耗/能量相关函数后把目标压入 `grabobj`。 | 目标过滤、抓取免疫和消耗是否成功必须实机。 |
| 拖动过程 | `onProc_Mgrab` 检查 `control.IsRBDown()`；按住时 `onMouseMoveButtonDown_Mgrab` 读取鼠标坐标并发送 `sq_SendChangeSkillEffectPacket(obj, SKILL_MGRAB)`。 | `control.IsRBDown()` 的完整内置定义当前未闭合，只记录主目标脚本实见。 |
| 接收端 | `onChangeSkillEffect_Mgrab` 读取 8 个 dword，按 group/uid 找回目标，设置目标位置，并按 state 值发送 HOLD 或 DOWN state packet。 | 位置同步、抛出轨迹、HOLD/DOWN 是否生效不能静态证明。 |

## WindPress state+PO 样本

| 节点 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| skill registry | `skill/creatormage.lst -> CreatorMage/WindPress.skl`，技能名 `超能旋风波 / Wind Press`，类型为 `[passive]`，`[executable states] 0 8 14`。 | CreatorMage 技能显示为 `[passive]`，但仍可通过脚本进入 state。 |
| header | `STATE_WINDPRESS = 67`，`SKILL_WINDPRESS = 248`，`CUSTOM_ANI_WINDPRESS_CAST/START/WINDPRESS/END = 75/76/77/78`。 | 常量只在当前 CreatorMage 入口链内有意义。 |
| state 入口 | `checkExecutableSkill_WindPress` 调用 `sq_IsUseSkill(SKILL_WINDPRESS)`，成功后发送 `STATE_WINDPRESS` 与 substate 0。 | 冷却、输入、能量和当前状态仍由运行时决定。 |
| substate 流 | 0 为 cast，1 为 start，2 为维持发射，3 为 end；动画结束和左键/PO 状态共同推动切换。 | 按键持续、动画结束和取消时序需实机。 |
| PO 创建 | substate 1 的 frame 窗口中读取 static data 和 CreatorWind level data，写入 5 个 dword 后用 `sq_SendCreatePassiveObjectPacketPos(obj, 24355, ...)` 创建 PO。 | 写包顺序必须和 PO `setCustomData` 闭合；位置和同步需实机。 |
| PO registry | `passiveobject/passiveobject.lst -> Character/Mage/CreatorWindPress.obj`；`.obj` 为 normal/pass all，使用 `CreatorWindPress.atk`。 | 显示名“高马力魔法导弹”不能当语义依据。 |
| PO 接收端 | `po_WindPress.nut` 读取 multiHitTerm、targetLen、consume、rangeDir、power，写当前 AttackInfo power，启动 timer，并按鼠标方向动态旋转/缩放攻击盒。 | 多段命中、攻击盒真实覆盖、耗能和 PVP 需实机。 |
| PO 维持/结束 | PO 在循环态按 timer 消耗 Creator 能量并 `resetHitObjectList()`；左键松开或能量归零后进入结束态并销毁。 | 能量条、timer 精度、残留和联机同步不能静态证明。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IMouse.GetXPos()` / `IMouse.GetYPos()` | CreatorMage 用它读取鼠标屏幕坐标；TypeSquirrel 语义检索给出候选签名。 | 直接定义查询未闭合；坐标系、缩放和 UI 遮挡必须实机。 |
| `stage.getMainControl().IsLBDown()` / `IsRBDown()` | WindPress 用左键维持，Mgrab 用右键拖动/松手分支。 | 当前只按主目标脚本实见记录，不写成完整输入 API 手册。 |
| `objectManager.getFieldXPos/getFieldYPos/getFieldZPos(...)` | Mgrab 和 WindPress 把鼠标屏幕坐标换成场景坐标。 | 地图层、Z 轴、可移动位置和同步需实机。 |
| `sq_SendChangeSkillEffectPacket(obj, skillIndex)` | Mgrab 和 WindPress 用它把鼠标目标/坐标变化发送给接收回调。 | 只证明脚本尝试发送变化包；接收时序和丢包边界需实机。 |
| `sq_ClearAttackBox` / `sq_AddAttackBox` / `sq_SetfRotateAngle` | WindPress PO 按鼠标方向重建攻击盒并旋转动画。 | 攻击盒最终命中、目标过滤和 PVP 不能静态证明。 |

## 下一步

1. CreatorMage 高覆盖缺口到此收口：已有 script-file/mouse-control 样本和 state+PO 样本。
2. 下一优先级转向 Common `Burster` 公共循环 state。
3. 本样本后续只在解释 CreatorMage hybrid 入口、mouse-control 坐标流、24355 registry、WindPress PO 或 Mgrab change skill effect 时引用。
