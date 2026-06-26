# Priest ReleaseBuffs Light State 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中 `priest_load_state.nut` light state 入口桶的代表样本。本文只证明当前主目标 PVF 中普通 Priest 入口同时推入被动/公共脚本并注册一个轻量 `ReleaseBuffs` state，`ReleaseBuffs` 会初始化待释放 buff 队列，随后由 Priest 公共 `procAppend` 逐步发通用 state packet；不证明角色默认学会、buff 一定释放成功、冷却 UI、读条、最终属性、PVP、同步或客户端资源完整性。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `priest_load_state.nut` 使用 `IRDSQRCharacter.pushState(ENUM_CHARACTERJOB_PRIEST, ..., "ReleaseBuffs", 0, 222)`。 | 这是普通 Priest light state 入口，不是 `CNAvenger` 专用入口。 |
| 代表 skill | `skill/priestskill.lst` 中 `222 -> priest/priestnewskill/ReleaseBuffs.skl`。 | skill ID 222 只能按 Priest skill registry 解释，不能跨职业套用。 |
| 代表脚本 | `ReleaseBuffs.nut` 只做队列初始化和批量释放调度，不创建 passiveobject。 | 释放队列中的各 buff 技能不在本桶逐个深拆。 |
| 已覆盖缺口 | 补上高覆盖矩阵里的 Priest light state 代表样本。 | 后续 Priest 默认只引用该模式，不扩成 Priest 全技能盘点。 |

## 入口闭合

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| load_state | `priest_load_state.nut` 推入 `passive_skill_new_priest.nut`，注册 `ReleaseBuffs` state `0 / skill 222`，再推入 `new_priest_common.nut`。 | `state = 0` 是当前注册参数；不能写成新编号 state。 |
| skill registry | `skill/priestskill.lst` 闭合到 `skill/priest/priestnewskill/ReleaseBuffs.skl`。 | 只证明 ID 到 `.skl` 路由。 |
| `.skl` 结构 | 名称 `自动buff`，类型 `[active]`，`[executable states] 0 14 8`，冷却 60000，命令为 `↑↑ + Z`。 | `.skl [level info]` 大表当前不解释为属性效果；静态只读不能证明冷却/UI/输入手感。 |
| 公共 proc | `new_priest_common.nut` 的 `procAppend_Priest(obj)` 调用 `useBuffSkills(obj)`。 | `useRangeBuff` 是同文件另一路调用，不在本桶展开。 |

## ReleaseBuffs 调度链

| 阶段 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 可释放检查 | `checkExecutableSkill_ReleaseBuffs` 调用 `obj.sq_IsUseSkill(222)`，成功后执行 `initUseBuffSkills(obj)` 并返回 true。 | 是否学会、是否冷却、是否满足状态条件不能静态证明。 |
| 命令允许 | `checkCommandEnable_ReleaseBuffs` 直接返回 true。 | 这只是脚本层允许；实际释放仍受引擎条件影响。 |
| 队列初始化 | `initUseBuffSkills` 设置 `releaseBuffSkills` / `passBuffSkills` / `realBuffSkills` 变量，遍历 buff 技能数组。 | 变量容器行为按目标脚本实见记录；TypeSquirrel 当前未闭合 `getVar` 系列完整定义。 |
| buff 过滤 | 对数组内 skill ID 逐个读取 `sq_GetSkillLevel`；等级小于等于 0 跳过；再取 `sq_GetSkill` 并用 `isInCoolTime()` 排除冷却中技能。 | 数组数字必须按 Priest skill registry 解释；当前只抽查了 7、45、51，不逐项穷举。 |
| 周期推进 | `useBuffSkills` 在 `procAppend_Priest` 中被调用，按 `realBuffSkills` 队列和 `releaseBuffSkills` 下标推进。 | `IsInterval(obj, interval)` 在当前样本 NUT 文本搜索中未闭合定义，只能写成目标脚本调用的间隔 helper。 |
| 发通用 state | 可释放时写入 int vector：含目标 buff skill index、两段 cast time、ani index 等参数，然后调用 `sq_AddSetStatePacket(13, STATE_PRIORITY_IGNORE_FORCE, true)`。 | state 13 和参数含义只按当前脚本形态记录；最终 buff 动作、读条和释放成功需实机。 |
| 完成收尾 | 队列下标超过 size 后，脚本把 `releaseBuffSkills` bool 设为 false，并调用 `setEnableChangeState(true)`。 | TypeSquirrel 对 `setEnableChangeState` 注释为状态变化开关；具体锁定/解锁时机需实机。 |

## Buff 列表边界

| 项 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 列表形态 | `skillArray = [7, 51, 52, 53, 23, 19, 20, 55, 22, 45, 21]`。 | 这是 Priest buff 候选列表，不是全职业列表。 |
| registry 抽查 | `7 -> Priest/Striking.skl`，`45 -> Priest/GloriousBless.skl`，`51 -> Priest/SlowHeal.skl`。 | 抽查证明 registry 走法；不逐项证明最终 buff 效果。 |
| 不做外推 | 数字列表不能凭外形解释，也不能拿到 Avenger、Gunner、AT Mage registry 中套用。 | 同号跨 registry 可能碰撞，必须由 `priest_load_state` 上下文决定。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.pushState(job, filePath, sklName, state, skillIndex)` | Priest 用它注册 `ReleaseBuffs`，job 为 `ENUM_CHARACTERJOB_PRIEST`。 | 与 Avenger 的 `CNAvenger.pushState` 参数形态不同。 |
| `sq_GetSkillLevel(obj, skillIndex)` | ReleaseBuffs 用它过滤未学习的 buff 技能。 | 角色实际技能等级、外部加点和服务端修正需实机。 |
| `sq_GetSkill(obj, skillIndex)` / `CNRDSkill.isInCoolTime()` | ReleaseBuffs 用它取技能对象并排除冷却中技能。 | 冷却状态、UI 和服务端一致性需实机。 |
| `IRDSQRCharacter.sq_IntVectClear()` / `sq_IntVectPush(value)` | ReleaseBuffs 用 int vector 传递通用 state 13 参数。 | 参数顺序只对当前 state 包链有意义，不能跨技能硬套。 |
| `IRDSQRCharacter.sq_AddSetStatePacket(13, STATE_PRIORITY_IGNORE_FORCE, true)` | ReleaseBuffs 用它尝试切到通用 buff 释放 state。 | `STATE_PRIORITY_IGNORE_FORCE` 的最终抢占效果和动作取消需实机。 |
| `setEnableChangeState(true)` | 队列完成后重新打开状态变化。 | TypeSquirrel 只给出接口形状，最终锁定/解锁表现需实机。 |

## 下一步

1. Priest light state 高覆盖缺口到此收口。
2. 下一优先级转向 NUT API 分组视图，把现有 API 按“入口、技能使用、状态参数、appendage、PO、对象/场景、视觉、冷却/队列”等功能组整理为验收索引。
3. 本样本后续只在解释 `priest_load_state.nut` 轻 state、批量 buff 队列或 state 13 参数包时引用。
