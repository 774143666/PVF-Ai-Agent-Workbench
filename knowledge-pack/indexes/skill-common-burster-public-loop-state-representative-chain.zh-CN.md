# Common Burster 公共循环 State 代表链只读账本

状态：默认可用

用途：作为 Skill / State / NUT Runtime Boundary 高覆盖主线中 Common 公共循环 state 桶的代表样本。本文只证明当前主目标 PVF 中 `common_load_state.nut` 通过循环给所有 job 注册同一个 `Burster` state、公共 header 常量、Burster state 脚本、appendage 和 `.skl` 同名文件静态可见；不证明实际职业是否学会、命中、伤害、冷却 UI、PVP、同步或客户端资源完整性。

## 高覆盖定位

| 项 | 结论 | 边界 |
| --- | --- | --- |
| 代表模式 | `common_load_state.nut` 使用 `for (i < ENUM_CHARACTERJOB_MAX)` 循环执行 `IRDSQRCharacter.pushState(i, ...)`。 | 这是公共循环 state 模式，不是某个职业专属 state。 |
| 代表 state | `STATE_BURSTER = 100`，`SKILL_BURSTER = 198`。 | 常量来自 common header；当前未在职业 `*skill.lst` 中把 `198` 闭合到普通 registry 条目。 |
| 代表脚本 | `Character/Common/Burster/Burster.nut` + `Character/Common/Burster/ap_Common_Burster.nut`。 | appendage 逻辑只证明脚本调用和字段读取，不证明运行效果。 |
| 已覆盖缺口 | 补上高覆盖矩阵里的 Common `Burster` 公共循环 state 代表样本。 | 后续 Common 默认只引用，不继续逐职业扩样。 |

## 入口闭合

| 层 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| load_state | 先推入 `Character/Common/common_header.nut`，然后循环给 `0..ENUM_CHARACTERJOB_MAX-1` 注册 `Character/Common/Burster/Burster.nut`、state `STATE_BURSTER`、skill `SKILL_BURSTER`。 | 循环次数是调用点形态；不能写成单一职业入口。 |
| header | `STATE_BURSTER = 100`，`SKILL_BURSTER = 198`，并定义通用 static/level column 常量。 | header 里有注释指向 Burster skill，但职业 registry 对 `198` 未在当前样本闭合。 |
| skill 文件 | 当前主目标存在 `skill/atmage/burster.skl`、`skill/swordman/burster.skl`、`skill/priest/burster.skl` 等同名文件；抽读样本均为 `指尖舞蹈 / Buster`。 | 这些文件存在不等于已由职业 `*skill.lst` 注册；当前不能写成普通 registry 事实。 |
| `.skl` 结构 | Burster `.skl` 为 active，`[executable states] 8 0 14`；level info 六列，对应有效时间、攻速、移速、施放速度、攻击力倍率/降低和最小冷却时间等脚本读取项。 | 不同职业 `.skl [static data]` 的禁用技能列表不同，不能用一个职业外推所有职业。 |

## State / Appendage 链

| 阶段 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 可释放检查 | `checkExecutableSkill_Burster` 调用 `sq_IsUseSkill(SKILL_BURSTER)`，成功后发送 `STATE_BURSTER`，`hasSubState=false`。 | 冷却、MP、是否学会和职业条件不能静态证明。 |
| 命令允许 | `checkCommandEnable_Burster` 在 tower dungeon 分支返回 false；攻击 state 下走 `sq_IsCommandEnable(SKILL_BURSTER)`，其他 state 返回 true。 | 场景限制、输入窗口和取消手感需实机。 |
| onSetState | 停止移动，使用 buff 动画，设置 `CUSTOM_ATTACK_INFO_RESONANCE`，按 cast time 调整动画速度，创建前后 draw-only 视觉，并绘制 cast gauge。 | 视觉资源、读条显示和取消窗口需资源链或实机。 |
| onEndCurrentAni | 移除旧 `ap_Common_Burster.nut`，重新追加 appendage，按 level data 0 设置有效时间，写入 buff cause skill，并给 appendage 添加攻速、移速、施放速度 change status。 | change status 最终数值、刷新、叠加和 UI 需实机。 |
| 伤害/冷却钩子 | `getCurrentModuleDamageRate` 从有效 appendage 读取 level data 4 作为倍率；`startSkillCoolTime` 从 level data 5 返回最小冷却时间。 | 这些函数是否被所有技能路径调用、最终伤害和冷却 UI 不能静态证明。 |
| appendage 脚本 | `ap_common_burster.nut` 注册 proc、prepareDraw、onStart、onEnd、isEnd、onStartMap、onAttackParent；onStart 添加光谱视觉并调用 `sq_SetStartCoolTime`。 | 视觉、冷却刷新、跨图剩余时间和命中视觉需实机。 |

## 禁用技能列表边界

| 项 | 主目标只读观察 | 边界 |
| --- | --- | --- |
| 禁用列表来源 | `isEnableBursterSkill` 读取 Burster skill 的 custom int data size，并逐项读取 `.skl [static data]` 中的禁用 skill index。 | static data 中的数字必须按当前职业/当前 Burster `.skl` 解释，不能跨职业套用。 |
| 跨职业差异 | 抽读 `atmage`、`swordman`、`priest` 的 `burster.skl`，三者 skill 名与 level info 形态一致，但 static data 列表不同。 | 只证明抽样差异存在；不需要逐职业穷举。 |

## API 边界补充

| API / 对象 | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.pushState(job, filePath, sklName, state, skillIndex)` | Common 用循环把同一个 Burster state 注册到所有 job。 | `job` 来自循环变量，不是固定职业。 |
| `sq_GetCustomIntDataSize(skill, chr)` / `sq_GetIntData(chr, skill, index)` | Burster 用它读取禁用技能列表。 | 只能按当前 Burster `.skl [static data]` 解释，不凭数字猜技能含义。 |
| `CNSquirrelAppendage.sq_AddChangeStatusAppendageID(...)` | Burster appendage 用它写攻速、移速、施放速度。 | 最终叠加、刷新和 UI 需实机。 |
| `sq_SetStartCoolTime(chr, 0, intVector)` | Burster appendage onStart 把 Burster 和禁用技能列表写入冷却相关接口。 | TypeSquirrel 当前未闭合该接口完整语义；冷却 UI 和服务端一致性需实机。 |

## 下一步

1. Common `Burster` 高覆盖缺口到此收口。
2. 下一优先级转向非 Swordman 被动脚本入口，抽一个最小样本确认 script-only 被动回调边界。
3. 本样本后续只在解释 Common loop state、Burster appendage、禁用技能 static data 或公共冷却/倍率钩子时引用。
