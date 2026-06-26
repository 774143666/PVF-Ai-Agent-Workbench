# Avenger CNAvenger / PowerOfDarkness 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中 Avenger “形态/专用 API”桶的代表样本。本文只证明当前主目标 PVF 中 PowerOfDarkness 的入口、skill registry、state/substate、passiveobject registry、appendage、timer 和 NUT 参数流静态可见；不证明命中、伤害、抓取成功率、浮空、卡肉、PVP、同步、手感或客户端资源完整性。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `CNAvenger.pushState` 注册的形态/控制型 Avenger state，内部同时使用全局 PO 创建、appendage、time event 和屏幕效果。 | 这是 Avenger 专用 API 族的第二类代表，不是 Avenger 全技能盘点。 |
| 代表技能 | `PowerOfDarkness / 黑暗权能`，skill id `125`。 | 只覆盖本技能链；不要外推到觉醒、普通攻击或全部恶魔值技能。 |
| 代表 PO | `24107` 黑暗圆阵、`24108` 黑暗箭。 | 两个 ID 都必须按 `passiveobject/passiveobject.lst` 解析；显示名“意念驱动”不能当语义依据。 |
| 已覆盖缺口 | 补上高覆盖矩阵里的 Avenger 形态/专用 API 样本。 | 后续 Avenger 默认只引用，不再继续逐技能扩样。 |

## 入口闭合

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| load_state | `avenger_load_state.nut` 使用 `CNAvenger.pushState("Character/Priest/PowerOfDarkness.nut", "PowerOfDarkness", STATE_POWER_OF_DARKNESS, SKILL_POWER_OF_DARKNESS)`，并注册 `po_PowerOfDarknessCircle.nut -> 24107`、`po_PowerOfDarknessArrow.nut -> 24108`。 | `CNAvenger.pushState` 没有 job 参数；当前上下文隐含 Avenger。 |
| header | `STATE_POWER_OF_DARKNESS = 71`，`SKILL_POWER_OF_DARKNESS = 125`；动画常量 `CUSTOM_ANI_POWER_OF_DARKNESS_START/STAY/END = 111/112/113`；攻击包 `CUSTOM_ATTACKINFO_POWER_OF_DARKNESS = 92`。 | 常量只在当前 Avenger/Priest 入口链内有意义。 |
| skill registry | `skill/priestskill.lst -> Priest/PowerOfDarkness.skl`，技能名为 `黑暗权能 / Power Of Darkness`，类型为 active。 | registry 只证明 skill id 到 `.skl` 的路由。 |
| `.skl` | `[feature skill index] 234`；`[executable states] 0 14 8`；`[static data] 80 200 170 800 80 500 12`；level property 三列对应黑暗晶体数量、恶魔锁链攻击力、黑暗晶体攻击力。 | static data 的列含义按当前 NUT 使用闭合；最终表现需实机。 |

## State / Substate 链

| 阶段 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| START | `checkExecutableSkill_PowerOfDarkness` 调用 `sq_IsUseSkill(SKILL_POWER_OF_DARKNESS)`，成功后发送 `STATE_POWER_OF_DARKNESS`，substate 为 `SUBSTATE_POWER_OF_DARKNESS_START = 0`。 | 冷却、MP、输入和当前状态仍由运行时决定。 |
| START onSetState | 清空目标对象列表，停止移动，设置 START 动画和 `CUSTOM_ATTACKINFO_POWER_OF_DARKNESS`，调用攻击力/被动修正相关接口；非 PVP 下设置 super armor。 | super armor、PVP 分支和攻击倍率最终结算不能静态证明。 |
| keyframe 0 | my-control 写入 1 个 dword 后创建 `24107` circle，并记录 circle index。 | 创建成功、对象返回值和同步需实机。 |
| onCreateObject | 通过 group/uid 找回刚创建的 circle，并记录到 state var。 | 对象销毁、离场或同步异常时是否仍可找回需实机。 |
| onAttack | START 阶段命中目标后给目标追加 `Appendage/Character/ap_PowerOfDarkness.nut`，可 hold 时调用 hold/move 相关 API，并把目标放入对象列表。 | 是否可抓取、可 hold、fixture、PVP 和免疫都不能静态证明。 |
| LIFT / EXPLOSION / LAST / END | 按目标是否可抓取进入 LIFT 或 EXPLOSION；`setTimeEvent` 控制 lift 时间、箭生成间隔、最后一轮箭和结束闪屏；END 动画结束后回 stand。 | timer 精度、箭数量、阶段切换时序、卡肉和联机同步必须实机。 |

## PO registry 与参数流

| ID | registry 解析 | NUT 参数流 | 边界 |
| ---: | --- | --- | --- |
| `24107` | `passiveobject/passiveobject.lst -> Character/Priest/PowerOfDarknessCircle.obj` | circle PO 初始化时追加背面 draw-only 动画；destroy state 时切换收尾动画并发送销毁包。 | circle 是视觉/定位核心；命中来源不由 circle `.obj` 直接证明。 |
| `24108` | `passiveobject/passiveobject.lst -> Character/Priest/PowerOfDarknessArrow.obj` | arrow PO 的 `setCustomData` 读取 `float angle` 和 `dword rate`，设置旋转并写入当前 AttackInfo 倍率；动画结束后销毁。 | 箭的实际轨迹、命中、暗属性表现和攻击范围需实机或资源链。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `sq_SendCreatePassiveObjectPacket(obj, index, level, x, y, z, direction)` | PowerOfDarkness 使用全局函数创建 `24107` circle 与 `24108` arrow；TypeSquirrel 给出的签名与主目标脚本用法一致。 | `index` 仍按 `passiveobject/passiveobject.lst`；坐标、方向、返回值和同步需实机。 |
| `CNAvenger.pushState(filePath, sklName, state, skillIndex)` | PowerOfDarkness 仍走 Avenger 专用 state 注册形态。 | 不能写成 `IRDSQRCharacter.pushState(job, ...)`。 |
| `CNSquirrelAppendage.sq_AppendAppendage(...)` | PowerOfDarkness 对被击目标追加 `ap_PowerOfDarkness.nut`，用于抓取/移动/清理链。 | appendage 生命周期、重复挂载、死亡清理和同步需实机。 |
| `IRDCollisionObject.setTimeEvent(...)` | PowerOfDarkness 用多个 time event 推进 lift、arrow gap、last delay 和 last phase。 | timer 触发节奏、帧率、取消和同步不能静态证明。 |
| `sq_flashScreen(...)` / draw-only 动画 | state 和 circle PO 都使用视觉层对象。 | 视觉层不等于攻击来源；资源完整性需资源链检查。 |

## 下一步

1. Avenger 高覆盖缺口到此收口：已有 Spincutter state+PO 代表和 PowerOfDarkness 形态/专用 API 代表。
2. 下一优先级转向 CreatorMage hybrid/mouse-control；只抽 1 个 script-file 技能库样本和 1 个 state/PO 样本。
3. 本样本后续只在解释 Avenger 形态/控制、24107/24108 registry、appendage、timer 或全局 PO 创建 API 时引用。
