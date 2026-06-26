# Gunner Passive Comminterrupt Script-only 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中“非 Swordman 被动脚本入口”桶的代表样本。本文只证明当前主目标 PVF 中 `gunner_load_state.nut` 通过 script-only 方式推入被动脚本、被动回调按 `skill_index == 254` 追加 appendage、appendage 的 `proc` 回调尝试开放命令并发送 state packet；不证明角色默认学会、冷却、输入窗口、强制成功、命中、伤害、PVP、同步或客户端资源完整性。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `IRDSQRCharacter.pushScriptFiles("Character/gunner/passive_skill_gunner.nut")`。 | load_state 只推入脚本，不直接 `pushState`，也不注册 passiveobject。 |
| 代表被动 | `ProcPassiveSkill_Gunner(obj, skill_index, skill_level)` 在 `skill_index == 254` 且等级大于 0 时追加 `ap_gunner_comminterrupt.nut`。 | 被动回调是否被引擎调用、角色是否学会该被动，静态只读不能证明。 |
| skill registry | `skill/gunnerskill.lst` 中 `254 -> Gunner/gunner_comminterrupt.skl`，`.skl` 为 `[passive]`，说明为施放技能时可强制中断当前技能施放其他技能。 | 只证明 Gunner registry 闭合；不能把 `254` 跨职业当同一个 registry 事实。 |
| 已覆盖缺口 | 补上非 Swordman script-only 被动入口代表样本。 | 后续同构职业只引用，不逐职业扩样。 |

## 入口闭合

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| load_state | `gunner_load_state.nut` 只有一个调用点：推入 `Character/gunner/passive_skill_gunner.nut`。 | 这类入口不能写成“load_state 直接注册技能 state”。 |
| 被动脚本 | `passive_skill_gunner.nut` 定义 `ProcPassiveSkill_Gunner`，判断 `skill_index == 254`、`skill_level > 0` 后追加 `character/gunner/appendage/ap_gunner_comminterrupt.nut`。 | 只能证明脚本链存在；不能证明角色学习状态或触发时机。 |
| skill 文件 | `gunner_comminterrupt.skl` 名称为 `体术逆改`，类型为 `[passive]`，最大等级 1。 | `.skl` 不含可执行 state 表；它通过被动回调挂 appendage。 |
| appendage | `ap_gunner_comminterrupt.nut` 用 `sq_AddFunctionName("proc", "proc_appendage_gunner_comminterrupt")` 注册轮询回调。 | proc 频率、时序和对象有效性必须实机确认。 |

## Appendage / State Packet 链

| 阶段 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| proc 入口 | `proc_appendage_gunner_comminterrupt` 调用 `gunner_comminterrupt(appendage)`。 | appendage 不存在、父对象/source 无效时脚本会失效或返回。 |
| 场景排除 | 转换父对象为角色后读取 grow type；塔类副本直接返回，若当前 state 为 `3/4/5/16` 也返回。 | 场景限制和具体 state 含义不在本桶展开。 |
| 命令开放 | `EnableSoften(obj, skillindex, state)` 若当前不是目标 state，就调用 `setSkillCommandEnable(skillindex, true)`。 | TypeSquirrel 说明该接口只是设置技能命令可用，不等于释放成功。 |
| state 切换 | `SetSkillState` 调用 `sq_IsEnterSkill`、`sq_IsUseSkill`，成功后清空 int vector、压入子参数，并调用 `sq_AddSetStatePacket(state, STATE_PRIORITY_USER, true)`。 | substate 数字必须按当前脚本实见解释，不能跨技能硬套。 |
| 转职分支 | appendage 按 `sq_getGrowType(obj)` 对不同转职列出不同技能 ID、state 和 int vector。 | 本桶只证明分支形态，不逐个技能闭合 registry 或运行效果。 |
| 追加副 appendage | 部分分支调用 `gunner_skill_huashi`，再追加 `ap_gunner_huashi.nut` 并设置有效时间与 cause skill。 | 该 buff/状态的最终表现另需专项样本或实机。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `CNSquirrelAppendage.sq_AppendAppendage(parent, source, skillIndex, stackable, path, valid)` | Gunner 被动回调用它挂 `ap_gunner_comminterrupt.nut`。 | 生命周期、重复挂载、失效、死亡清理需实机。 |
| `appendage.sq_AddFunctionName("proc", funcName)` | Gunner appendage 用它注册 proc 回调。 | proc 调用频率和对象有效性要由脚本防护，不能静态证明。 |
| `IRDCharacter.setSkillCommandEnable(skillIndex, true)` | Gunner appendage 用它开放技能命令。 | 只说明命令层启用，不保证 `sq_IsUseSkill` 成功。 |
| `IRDSQRCharacter.sq_IsEnterSkill(index)` / `sq_IsUseSkill(index)` | Gunner appendage 用它判断是否尝试进入/使用技能。 | 受当前状态、冷却、条件和输入影响。 |
| `IRDSQRCharacter.sq_AddSetStatePacket(stateId, priority, hasSubState)` | Gunner appendage 用它发送目标 state，substate 来自 int vector。 | state/substate 数字是高风险参数，必须目标链或实机确认。 |

## 下一步

1. 非 Swordman script-only 被动入口高覆盖缺口到此收口。
2. 下一优先级转向 `priest_load_state.nut` 的 `ReleaseBuffs` light state 代表样本。
3. 本样本后续只在解释“load_state 只推脚本但仍可能通过被动回调进入运行逻辑”时引用。
