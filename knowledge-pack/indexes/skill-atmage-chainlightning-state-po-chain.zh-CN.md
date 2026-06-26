# AT Mage ChainLightning State/PO 链只读核验

状态：默认可用

用途：记录当前主目标中 `ChainLightning` 的 skill registry、state/substate、load_state、24241/24242 passiveobject、目标搜索、多段命中计时和 NUT API 边界。本文只覆盖这一个技能创建的 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`ChainLightning` 是男法 `skill 2` 的主动技能，运行入口注册到 `STATE_CHAINLIGHTNING = 25`；角色先走施放、持续、结束三段 substate，在持续段写入目标搜索范围、传导次数、持续时间、攻击倍率和多段次数后创建 `24241`。`24241` 负责找首目标、画闪电链和继续找下个目标；每段链路触发时再在目标身上创建 `24242`，由 `24242` 贴目标发送即时命中和 timer 多段命中。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `2 -> ATMage/ChainLightning.skl`；`212 -> ATMage/ChainLightningEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `ChainLightning.skl` 为 active，命令 `↑→↓ + Z`，施放时间 `600`，冷却 `12000`，需求等级 `30`，前置 `ElementalChange skill 5 level 5`，`[feature skill index] = 212`。 | 可释放条件仍受当前状态、冷却、MP、技能等级和引擎判断影响。 |
| `.skl executable states` | 同一 `.skl` 中观察到两处 `[executable states]`：早段为 `8 0 14`，后段为 `0 14`。 | 静态只读不判定引擎最终采用哪一处；只记录重复标签风险。 |
| `.skl static data` | `500 0 650 400 300`，NUT 按索引用作首目标 Y 范围、首目标 X 起止、后续目标范围、目标最大高度。 | 其中首目标 X 起点在脚本里用数值 index 1 读取，常量名写法有混用风险；只按实际索引闭合。 |
| level data | `[level info]` 每级 4 列；脚本使用列 `0` 传导/链接数、`1` 持续时间、`2` 攻击倍率、`3` 多段次数。 | 脚本虽声明 `SKL_CL_LI_4`，但多段间隔读取被注释；不要写成 5 个运行列。 |
| header 常量 | `STATE_CHAINLIGHTNING = 25`，`SKILL_ATCHAINLIGHTNING = 2`；角色动画索引 `7/8/9` 分别为 cast/loop/end；光元素枚举为 `ENUM_ELEMENT_LIGHT = 3`。 | 常量只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `ChainLightning` state，并注册 `po_ATChainLightning.nut -> 24241`、`po_ATChainLightningTarget.nut -> 24242`。 | `24241/24242` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24241 -> Character/Mage/ATChainLightning.obj`；`24242 -> Character/Mage/ATChainLightningTarget.obj`。 | registry 中两者显示名复用为“高马力魔法导弹”，不能用显示名解释技能语义。 |
| PO object | 两个 `.obj` 都引用 `AttackInfo/ATChainLightning.atk`；`24242` 额外有目标循环动画和结束动画。 | object/atk 只能证明静态载体存在，不证明命中、伤害、击退、浮空或 PVP 表现。 |

## level data 与写包字段

| 运行字段 | 来源 | 写入/读取 | 当前用法 |
| --- | --- | --- | --- |
| 首目标 Y 范围 | static index `0` | 角色写 word，24241 读 word | `sq_FindFirstTarget` 的 Y 范围。 |
| 首目标 X 起点 | static index `1` | 角色写 word，24241 读 word | `sq_FindFirstTarget` 的起始 X。 |
| 首目标 X 终点 | static index `2` | 角色写 word，24241 读 word | `sq_FindFirstTarget` 的终止 X。 |
| 后续目标范围 | static index `3` | 角色写 word，24241 读 word | `sq_FindNextTarget` 的 X 范围。 |
| 目标最大高度 | static index `4` | 角色写 word，24241 读 word | 首目标/后续目标的 Z 范围。 |
| 链接数 | level data index `0` | 角色写 word，24241 读后 `+1` | 24241 实际保存的 `link_sum_num = readWord() + 1`。 |
| 持续时间 | level data index `1` | 角色写 word，24241/24242 读 | 角色超时结束、24242 计算多段间隔。 |
| 攻击倍率 | level data index `2` 经 `sq_GetBonusRateWithPassive` | 角色写 dword，24242 读 | 24242 写入当前 AttackInfo 百分比攻击力。 |
| 多段次数 | level data index `3` | 角色写 word，24242 读 | 24242 即时命中一次后用 timer 继续发送 hit packet。 |

## state / substate 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_ChainLightning` 成功使用 `SKILL_ATCHAINLIGHTNING` 后压入 substate `0`，发送 `STATE_CHAINLIGHTNING`。 | 成功进入仍受技能条件和引擎判断影响。 |
| 命令允许 | `checkCommandEnable_ChainLightning` 在普通攻击 state 内额外查 `sq_IsCommandEnable`，其他状态返回 true。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| substate 0 | 设置 cast 动画、读取施放时间、取当前动画 frame start time，开始绘制施放读条，并追加光元素链。 | NUT 读取 frame index `16`，但当前 cast 动画反编译只有 4 帧；静态只读不解释引擎返回值。 |
| substate 1 | 设置持续动画，播放声音，写 9 个字段并创建 `24241`，同时启动循环音效；之后 `onProc` 等待 PO 状态或持续时间结束。 | 只证明创建和轮询链路；首目标选择、传导顺序和实际持续时长需实机。 |
| substate 2 | 设置结束动画；结束动画播放完回站立，并停止施放读条和循环音效。 | 不证明取消窗口、受击中断或同步。 |
| 无目标/超时 | 若 `24241` 的 `nograb` 变量置 1，或持续段时间超过 level data 持续时间，角色发送 substate `2`。 | `nograb` 由 PO 搜索/销毁逻辑写入；实机目标死亡、离场、免疫仍需测试。 |

## 24241 链路控制 PO

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 依序读取搜索范围、链接数、持续时间、攻击倍率、多段次数；清空 `nograb`、链路对象、目标对象和计数变量。 | 写包和读包顺序闭合；字段宽度不能凭名字改。 |
| 首目标搜索 | my-control 分支用当前 PO 坐标加范围调用 `sq_FindFirstTarget`，取目标 object id；未找到时置 `nograb = 1`。 | TypeSquirrel 只能确认 API 形状；目标筛选优先级和“随机传导”描述需实机。 |
| state 10 | 每次进入 state 10 递增链路计数；若目标存在，创建 `6_lightning_dodge.ani` 的 draw-only 闪电线对象，并调用几何函数旋转/缩放到目标。 | 该线对象是 draw-only；不要仅凭线动画中的攻击盒下命中结论。 |
| 触发目标 PO | 线动画帧号达到 `>= 2` 且该段未触发时，写入目标 id、持续时间、攻击倍率、多段次数，并从当前 PO 位置创建 `24242`。 | 实际命中由 `24242` 发送 hit packet；线段显示和命中结算不能混为一谈。 |
| 后续目标 | 当前目标转 active object 后调用 `sq_FindNextTarget`，再把新目标 id 和当前位置压入 state 10。 | 静态只读不能证明传导是否随机、是否排除已命中目标、死亡目标如何处理。 |
| state 11 / 销毁 | 当角色离开 ChainLightning、进入结束段、目标/线对象失效或链路耗尽时，切空动画、禁用 draw-only 对象或销毁自身。 | 销毁时序、残留、同步和目标失效边界需实机。 |

## 24242 目标命中 PO

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取目标 id、持续时间、攻击倍率和多段次数；通过 object id 找回目标；设置 timer 间隔 `attack_time / hitCnt`；写当前 AttackInfo 百分比攻击力。 | 若目标找回失败，脚本后续会切结束或销毁；实际目标有效性需实机。 |
| 即时命中 | my-control 分支创建后立即对目标发送一次 `sq_SendHitObjectPacket`。 | 只证明脚本尝试发送命中包，不证明最终命中、伤害或服务器判定。 |
| 多段命中 | `procAppend` 贴目标位置，timer 到点后递增计数并继续发送 hit packet，直到达到多段次数。 | timer 精度、帧率、卡顿、目标死亡和联机同步不能静态证明。 |
| 结束 | 父角色进入 substate 2、目标丢失或结束动画完成后进入 state 11，最后按计数/对象状态销毁。 | 销毁时序和特效残留需实机或资源链检查。 |

## 动画与攻击载体

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ChainLightningCast.ani` | 角色 etc motion 索引 `7`；4 帧，首帧播放 `CHAINLIGHT_CAST`，有 damage box。 | NUT 读取 frame index `16` 的返回值需实机或引擎语义确认。 |
| `ChainLightning.ani` | 角色 etc motion 索引 `8`；5 帧，首帧播放 `CHAINLIGHT_ATK`，各帧标记 `SUPERARMOR`。 | SUPERARMOR 标记只说明动画静态配置；受击、霸体、取消和 PVP 需实机。 |
| `ChainLightningEnd.ani` | 角色 etc motion 索引 `9`；5 帧，有 damage box。 | 只证明结束动作资源存在。 |
| `Firing/6_lightning_dodge.ani` | 6 帧，LINEARDODGE，带 loop start/end 和 attack box。 | 当前脚本把它作为 draw-only 线段使用；攻击盒不直接证明它负责命中。 |
| `Firing/6_lightning_dodge_empty.ani` | 4 帧，LINEARDODGE，无 attack box。 | 用于切空/收尾显示。 |
| `Target/1_target_normal.ani` | `24242` 基础循环动画，5 帧，含空白首帧和 loop。 | 只证明目标特效存在，不证明 hit packet 成功。 |
| `TargetEnd/2_target_dodge.ani` | `24242` 结束动画，5 帧，LINEARDODGE。 | 只证明收尾特效存在。 |
| `ATChainLightning.atk` | 魔法、光属性、武器伤害 apply；damage reaction 为 damage；含 push aside、lift up、hit wav、hit info、PVP 段。 | 静态 `.atk` 不能证明最终伤害、击退、浮空、卡肉、命中率或 PVP 最终规则。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `sq_GetFrameStartTime(animation, frameIndex)` | 读取指定动画帧开始时间；本桶用于 cast gauge 时间。 | 当前脚本传 frame `16`，动画静态只有 4 帧；返回值不可静态推断。 |
| `sq_StartDrawCastGauge(obj, time, bool)` / `sq_EndDrawCastGauge(obj)` | 开始/结束技能施放读条绘制。 | 读条显示和动作真实施放窗口需实机。 |
| `IRDSQRCharacter.sq_GetPassiveObject(index)` | 角色按 passiveobject index 找回已创建 PO；本桶用来查看 `24241` 的 `nograb`。 | 返回对象是否存在取决于运行时创建和销毁状态。 |
| `sq_GetGlobalIntVector()` / `sq_IntVectorClear(...)` / `sq_IntVectorPush(...)` | PO 状态包使用全局 int vector 传 x/y/z/object id 等整数。 | 向量内容必须和 `setState` 读取顺序一致。 |
| `IRDCollisionObject.addSetStatePacket(subState, data, state, isSend, name)` | 给 PO/碰撞对象追加 state 包；本桶 24241 用它在 state 10/11 间推进。 | 参数名里 `subState/state` 易混，按当前脚本实见解释。 |
| `CNSquirrelPassiveObject.sq_FindFirstTarget(...)` / `sq_FindNextTarget(...)` | 在范围内找首目标/下个目标。 | TypeSquirrel 不证明随机、优先级、去重或目标过滤规则。 |
| `sq_GetObjectId(obj)` / `sq_GetObjectByObjectId(parent, id)` | 把目标对象转成局内 id，再按 id 找回对象。 | 目标销毁、离场、死亡或同步状态下的返回需实机。 |
| `sq_GetCNRDObjectToActiveObject(obj)` | 将基础对象转活动对象，供 `sq_FindNextTarget` 使用。 | 转换失败或非 active 目标必须按脚本防护。 |
| `sq_CreatePooledObject(ani, autoDestroy)` / `sq_AddObject(parent, child, OBJECTTYPE_DRAWONLY, bool)` | 创建并添加 draw-only 闪电线对象。 | 视觉对象的攻击盒、层级、残留和同步需实机/资源链。 |
| `sq_SendCreatePassiveObjectPacketFromPassivePos(obj, index, level, X, Y, Z)` | 从 PO 坐标语境创建另一个 PO；本桶 24241 创建 `24242`。 | `index` 仍必须 registry 闭合；坐标与同步需实机。 |
| `sq_GetCurrentAttackInfo(obj)` / `sq_SetCurrentAttackBonusRate(attackInfo, rate)` | 24242 设置自身当前攻击包的百分比攻击力。 | 最终伤害、被动叠加、PVP 修正不能静态证明。 |
| `sq_SendHitObjectPacket(obj, enemy, x, y, z)` | 向目标发送一次命中包。 | 是否命中、伤害多少、卡肉/击退/浮空如何表现必须实机。 |
| `EventTimer.setParameter(...)` / `resetInstant(...)` / `isOnEvent(time)` | 24242 用 timer 做多段命中节奏。 | timer 精度、帧率和联机同步不可静态证明。 |
| `sq_GetDistance(...)` / `sq_Atan2(...)` / `sq_SetfRotateAngle(...)` / `CNRDAnimation.setImageRate(...)` / `sq_Cos(...)` / `sq_Sin(...)` | 24241 用来把 draw-only 线段旋转、缩放、定位到目标。 | 只证明视觉几何计算，不证明攻击范围。 |
| `CNRDObject.setValid(false)` | 24241 收尾时禁用 draw-only 对象。 | 对象何时彻底移除和是否残留需实机。 |

## 禁止外推

- 本页只证明 `ChainLightning` 这一个技能链；不要把 `24241/24242` 的结论外推到其他 PO。
- 不要把 `ChainLightningEx.skl` 写成独立运行 state。它是 `feature skill index` 指向的强化被动。
- 不要把 `.skl [explain]` 里的“随机传导”直接写成已证明算法；当前静态脚本只确认调用 `sq_FindNextTarget`。
- 不要把 draw-only 闪电线动画中的攻击盒直接写成实际命中来源；本桶已确认 `24242` 发送 hit packet。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、霸体、传导顺序、销毁时序、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机释放：确认 cast、持续、结束三段动作，读条显示，循环音效是否按 substate 结束停止。
2. 首目标测试：无目标、单目标、多个目标、目标不同高度/距离，确认 `nograb`、首目标选择和结束时机。
3. 传导测试：多目标排列下记录传导顺序、是否重复命中、是否符合“随机”描述、目标死亡/离场后的行为。
4. 多段命中测试：按不同技能等级验证多段次数和持续时间，观察 timer 命中节奏和是否漏段。
5. 攻击表现测试：只用实机确认伤害、光属性、击退、浮空、卡肉、霸体、PVP 修正和联机同步。
6. 资源链测试：检查角色三段动画、闪电线、目标循环/结束特效、音效和 ImagePacks2 资源是否完整。
