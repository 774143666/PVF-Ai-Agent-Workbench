# Avenger CNAvenger / Spincutter 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中 `CNAvenger` 专用 API 族的 state + passiveobject 代表样本。本文只证明当前主目标 PVF 中 Avenger 入口、skill registry、state/substate、PO registry 和 NUT 参数流静态可见，不证明命中、伤害、多段次数、召回手感、PVP、同步或客户端资源完整。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `CNAvenger.pushState + CNAvenger.pushPassiveObj` 的 Avenger 专用入口族。 | 不能套用 `IRDSQRCharacter.pushState(job, ...)` 的参数形状。 |
| 代表技能 | `Spincutter / 回旋飞镰`，skill id `113`。 | 这是 Avenger 代表样本，不是 Avenger 全技能盘点。 |
| 代表 PO | `24101` 初段 throw 镰刀，`24100` 召回/多段镰刀。 | 两个 ID 都必须走 `passiveobject/passiveobject.lst`，显示名“破魔符”不能当语义依据。 |
| 已覆盖缺口 | 补上高覆盖矩阵中的 `CNAvenger state + PO` 代表样本。 | 仍需另补一个 Avenger 形态/专用 API 样本，例如觉醒、恶魔值或专用形态链。 |

## 入口闭合

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| load_state | `avenger_load_state.nut` 推入 `avenger_header.nut`、`avenger_common.nut`、`passive_skill_priest.nut`；使用 `CNAvenger.pushState("Character/Priest/Spincutter.nut", "spincutter", STATE_SPINCUTTER, SKILL_SPINCUTTER)`。 | `CNAvenger.pushState` 没有 job 参数；当前上下文隐含 Avenger。 |
| header | `STATE_SPINCUTTER = 61`；`SKILL_SPINCUTTER = 113`；动作常量 `CUSTOM_ANI_SPINCUTTER1/2/3 = 79/80/81`；攻击包 `CUSTOM_ATTACKINFO_SPINCUTTER = 70`。 | 常量只在当前 Avenger/Priest 入口链内有意义。 |
| skill registry | `skill/priestskill.lst` 中 `113 -> Priest/Spincutter.skl`，`132 -> Priest/CancelSpincutter.skl`，`232 -> Priest/SpincutterEx.skl`。 | registry 只证明 ID 到 `.skl` 路由；取消/EX 不等于当前已验证运行链。 |
| `.skl` | `Spincutter.skl` 是 active，`feature skill index 232`；`[executable states]` 为 `0 8 14`；`[static data]` 为 `750 500 8`；level info 两列，对应说明中的初段魔法攻击力和多段魔法攻击力。 | static data 的三列含义按当前 NUT 闭合：投掷长度、停留时间、多段 hit count；最终表现需实机。 |

## PO registry

| ID | registry 解析 | 当前用途 | 边界 |
| ---: | --- | --- | --- |
| `24100` | `passiveobject/passiveobject.lst -> Character/Priest/Spincutter.obj` | 召回/多段镰刀 PO，读取 multi hit count 和攻击倍率。 | `.obj` 为 normal/pass all，引用 `Spincutter.atk` 和 `SpincutterDelay.atk`；命中效果不由静态只读证明。 |
| `24101` | `passiveobject/passiveobject.lst -> Character/Priest/SpincutterThrow.obj` | 初段投掷镰刀 PO，读取初段攻击倍率。 | `.obj` 为 normal/pass all，引用 `SpincutterThrow.atk`；是否命中和打断需实机。 |

## State / Substate 链

| 阶段 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 可释放检查 | `checkExecutableSkill_Spincutter` 调 `sq_IsUseSkill(SKILL_SPINCUTTER)`，成功后 int vector 写入 `S_SPINCUTTER_THROW = 0` 和方向，再发送 `STATE_SPINCUTTER`。 | 冷却、MP、输入和当前动作条件仍由运行时决定。 |
| 命令允许 | 攻击状态下走 `sq_IsCommandEnable(SKILL_SPINCUTTER)`，其他状态返回 true。 | 命令允许不等于一定能切 state。 |
| THROW | `onSetState` 设置 substate 0，设置当前 AttackInfo，按 level data 0 取初段攻击倍率，并创建 `24101`；同时创建 rope draw-only 视觉对象。 | rope 是视觉链路，不是攻击来源。 |
| THROW 进行中 | 当前帧 `>=2 && <6` 且未创建时，读取 static data 的多段次数和 level data 1 的多段攻击倍率，写入两个 dword 后创建 `24100`。 | 写包顺序必须和 `po_spincutter.nut` 的读取顺序闭合。 |
| RECALL 触发 | frame `>=6` 后允许再次输入技能；达到停留时间或再次输入时切 `S_SPINCUTTER_RECALL = 1`。 | 再按技能键、停留时间和取消窗口需实机。 |
| ARRIVAL | recall 动作结束后切 `S_SPINCUTTER_ARRIVAL = 2`，arrival 结束后回 `STATE_STAND`。 | 动作结束、被打断和同步需实机。 |

## PO 参数流

| PO | 读取形状 | 运行边界 |
| --- | --- | --- |
| `24101 / po_spincutterthrow.nut` | `setCustomData` 读取 1 个 dword：初段攻击倍率，并写到当前 AttackInfo。若父角色不在 `STATE_SPINCUTTER` 或不在 THROW substate，则销毁。 | 只证明初段 PO 的攻击倍率写入和父状态绑定。 |
| `24100 / po_spincutter.nut` | `setCustomData` 读取 2 个 dword：multi hit count、攻击倍率；设置 AttackInfo；按 hit count 设置 timer。 | hit count 为 0 的防御、timer 精度、重复命中和目标过滤需运行验证。 |
| `24100` recall | 父角色进入 RECALL 后，PO 用全局 int vector 发送自身 recall state，记录起始 X，再用 `sq_GetAccel` 朝父角色附近回收。 | 轨迹、吸附、碰撞和联机同步不能静态证明。 |
| `24100` 命中列表 | timer 事件触发时 `resetHitObjectList()`。 | 多段命中实际频率和卡肉必须实机。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `CNAvenger.pushScriptFiles(path)` | Avenger load_state 用它加载 header/common/passive。 | 只证明脚本被推入，不证明 state 或技能效果。 |
| `CNAvenger.pushState(filePath, sklName, state, skillIndex)` | Avenger 专用 state 注册，参数不带 job。 | 不能套 `IRDSQRCharacter.pushState`。 |
| `CNAvenger.pushPassiveObj(path, index)` | Avenger 专用 PO NUT 注册，index 走 `passiveobject/passiveobject.lst`。 | 不要用 skill/monster/APC registry 解释同号数字。 |
| `CNAvenger.sq_p00_sendCreatePassiveObjectPacket(poIndex, x, y, z, direction)` | Spincutter state 用它创建 `24100/24101`。 | 坐标、方向、同步和对象生命周期需实机。 |
| `CNAvenger.sq_createCNRDAnimation` / `sq_createCNRDPooledObject` / `sq_AddObject` | Spincutter 用它创建 rope draw-only 视觉。 | draw-only 不证明攻击来源。 |

## 下一步

1. Avenger 仍需一个“形态/专用 API”代表样本，优先从觉醒、恶魔值或 `PowerOfDarkness` 中抽一个，不展开全技能。
2. CreatorMage 是下一类大缺口：需要 hybrid/mouse-control 代表样本。
3. 本样本后续只在解释 `CNAvenger state + PO` API 族时引用，不扩成 Avenger 技能穷举。
