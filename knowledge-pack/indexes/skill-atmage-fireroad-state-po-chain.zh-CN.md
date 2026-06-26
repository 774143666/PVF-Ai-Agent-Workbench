# AT Mage FireRoad State/PO 链只读核验

状态：默认可用

用途：记录当前主目标中 `FireRoad` 的 skill registry、state/substate、load_state、`24212/24213` passiveobject、两段 AttackInfo 切换、写包字段、动画 frame 15 等待点和 NUT API 边界。本文只覆盖这一个技能创建的 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`FireRoad` 是男法 `skill 6` 的主动技能，运行入口注册到 `STATE_FIRE_ROAD = 24`。角色先进入 substate `0` 做施放读条，`FireRoadCast1.ani` 的 frame 2 flag 触发批量创建 `24212/24213` 火柱；角色动作结束后切 substate `1` 播 `FireRoadCast2.ani`，再回站立。火柱 PO 初始使用 `ATFireRoad1.atk` 和第一次攻击倍率，在自身动画 frame 15 长停顿处观察父角色 state/substate；当父角色已进入 substate 1 或离开 FireRoad 时，切到 `ATFireRoad2.atk`、第二次攻击倍率并跳到 frame 16 继续播放。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `6 -> ATMage/FireRoad.skl`；`216 -> ATMage/FireRoadEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `FireRoad.skl` 为 active，命令 `→↓→ + Z`，施放时间 `600`，冷却 `5000`，需求等级 `25`，前置 `ElementalChange skill 5 level 2`，`[feature skill index] = 216`。 | 可释放条件仍受当前状态、冷却、MP、技能等级和引擎判断影响。 |
| `.skl executable states` | `[executable states]` 为 `8 0 14`。 | 只说明静态可执行状态线索，不证明强制释放、取消窗口或实机可用范围。 |
| header 常量 | `STATE_FIRE_ROAD = 24`，`SKILL_FIRE_ROAD = 6`，`SKILL_FIRE_ROAD_EX = 216`；角色动画索引 `5/6` 分别为 `CUSTOM_ANI_FIRE_ROAD_CAST1/CAST2`；火元素枚举为 `ENUM_ELEMENT_FIRE = 0`。 | 常量只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `FireRoad` state，并注册 `po_fire_road.nut -> 24212/24213`。 | `24212/24213` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24212 -> Character/Mage/ATFireRoad1.obj`；`24213 -> Character/Mage/ATFireRoad2.obj`。 | registry 中两者显示名复用为“火焰爆炸”，不能用显示名解释技能语义。 |
| PO object / atk | 两个 `.obj` 都是 bottom layer、pass all、piercing power `1000`，初始 `[attack info]` 为 `ATFireRoad1.atk`，`[etc attack info]` 为 `ATFireRoad2.atk`。 | object/atk 只能证明静态载体存在，不证明命中、伤害、击倒、推开、浮空或 PVP 表现。 |

## `.skl` 数据与运行索引

| 运行字段 | 来源 | 当前用法 | 边界 |
| --- | --- | --- | --- |
| PO 暂停间隔 | static data index `0`，当前为 `100` | 每个火柱写入 `pauseTime * i`，PO 读取后调用 `sq_SetPause(..., PAUSETYPE_OBJECT, pauseTime)`。 | 暂停时序、帧率和同步需实机。 |
| 首个 X 偏移 | static data index `1`，当前为 `120` | 角色创建 PO 时作为第一个火柱的 X 基准。 | 实际坐标、方向和可见性需实机。 |
| X 间距 | static data index `2`，当前为 `60` | 每个火柱用 `xPos + xOffset * i` 递增。 | 轨迹/排布是否符合画面感需实机。 |
| 每对象最大命中 | static data index `3`，当前为 `2` | 写入 byte，PO 调用 `sq_SetMaxHitCounterPerObject(maxHit)`。 | 最大命中次数、目标重入和 PVP 规则不能静态证明。 |
| 额外行数 | static data index `4`，主动 `.skl` 为 `0`；`FireRoadEx.skl` 为 `2` | state 脚本读取为 `rowNumber`，大于 0 时在 Y 轴正负方向额外创建火柱。 | 强化被动是否让主动 `sq_GetIntData(SKILL_FIRE_ROAD, 4)` 变为 2 需要引擎语义或实机确认；不要静态硬推。 |
| 尺寸倍率 | static data index `5`，当前为 `100` | PO 读取后非 100 时缩放图片、自动层级动画和攻击盒。 | 视觉缩放和攻击盒缩放的实机范围需测试。 |
| 火柱数量 | level data index `0` | 角色读取后循环创建火柱。 | 强化被动是否叠加数量需实机或引擎规则确认。 |
| 第一次攻击倍率 | level data index `1` 经 `sq_GetBonusRateWithPassive` | 角色写给 PO；PO 初始写入当前 AttackInfo。 | 最终伤害和被动叠加不能静态证明。 |
| 第二次攻击倍率 | level data index `2` 经 `sq_GetBonusRateWithPassive` | PO 在 frame 15 切二段时写入当前 AttackInfo。 | 二段命中、伤害和 PVP 修正需实机。 |

## 角色 state / substate 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_FireRoad` 成功使用 `SKILL_FIRE_ROAD` 后压入 int vector `0`，发送 `STATE_FIRE_ROAD` 且 `hasSubState=true`。 | 成功进入仍受技能条件和引擎判断影响。 |
| 命令允许 | `checkCommandEnable_FireRoad` 在普通攻击 state 内额外查 `sq_IsCommandEnable`，其他状态返回 true。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| substate 0 | 设置 `CUSTOM_ANI_FIRE_ROAD_CAST1`，播放 `MW_FIREROAD`，按技能 cast time 改写当前动画 frame 0 delay，开始施放读条，并追加火元素链。 | 读条、改帧延迟和施放手感需实机。 |
| keyframe 创建 | 只在 substate 0 分支执行；脚本未检查 `flagIndex` 数值。当前 `FireRoadCast1.ani` 的 frame 2 有 `[SET FLAG] 1`，触发创建火柱。 | 若动画未来增加其他 flag，脚本也会进入同一分支；当前只按主目标动画闭合。 |
| substate 0 结束 | 当前动画结束后压入 int vector `1`，再次发送 `STATE_FIRE_ROAD`。 | 切换时序和取消/受击中断需实机。 |
| substate 1 | 设置 `CUSTOM_ANI_FIRE_ROAD_CAST2`；该动画 frame 2 也有 `[SET FLAG] 1`，但脚本的 keyframe 创建逻辑只处理 substate 0。 | 不要把 CAST2 写成二次创建入口。 |
| substate 1 结束 | 当前动画结束后回 `STATE_STAND`。 | 回站立时序、硬直和同步需实机。 |
| onEndState | 离开 FireRoad 时结束施放读条。 | 不证明所有火柱都会立即消失；PO 自身还有 frame 15 逻辑和动画结束自毁。 |

## 写包字段与创建排布

| 顺序 | 角色写入 | PO 读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | word `pauseTime * i` | word | PO 对象级暂停时间。 |
| 2 | dword `damage1` | dword | 初始 `ATFireRoad1.atk` 百分比攻击倍率。 |
| 3 | dword `damage2` | dword | frame 15 切二段后 `ATFireRoad2.atk` 百分比攻击倍率。 |
| 4 | byte `maxHit` | byte | 每对象最大命中次数。 |
| 5 | byte `i` | byte | 火柱序号；当前 PO 脚本读取后未继续使用。 |
| 6 | word `sizeRate` | word | 非 100 时缩放图片、自动层级和攻击盒。 |

创建规则：

- 主线火柱按 `i < createCount` 创建，PO index 为 `24212 + i % 2`，所以 `24212/24213` 交替使用。
- 主线坐标为 `xPos + xOffset * i, 1, 0`。
- 当 `rowNumber > 0` 时，脚本在 Y 轴正负方向按 `55` 间距额外创建同一个 PO index；额外创建前没有重新 `sq_StartWrite()`，只按目标脚本实见记录，不静态推断引擎写包复用规则。

## `24212/24213` PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取 word/dword/dword/byte/byte/word；暂停自身，设置初始攻击倍率，保存第二段攻击倍率，设置最大命中次数，播放 `FIREROAD_01`。 | 写包和读包顺序闭合；命中次数、暂停节奏和声音表现需实机。 |
| 尺寸缩放 | `sizeRate != 100` 时，缩放当前动画图片、自动层级动画和攻击盒。 | 缩放后的可视范围和命中范围必须实机确认。 |
| frame 15 等待点 | PO 动画 frame 15 delay 为 `10000`，没有攻击盒；`procAppend` 在 frame 15 读取父 state/substate。 | delay 和 proc 轮询的实际时序需实机。 |
| 二段切换条件 | 父角色 substate 为 `1`，或父 state 为 `-1`，或父 state 不再是 `STATE_FIRE_ROAD` 时，PO 切到自定义 AttackInfo index `0`，写第二段攻击倍率，并跳到 frame 16。 | 父对象失效、受击中断、换图或同步状态下行为需实机。 |
| 自毁 | `ATFireRoad1` 结束时 my-control 分支发送自毁；`ATFireRoad2` 结束时直接发送自毁。 | 两者自毁控制分支不同，销毁时序和联机残留需实机。 |

## 动画与攻击载体

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATAnimation/FireRoadCast1.ani` | 角色 etc motion 索引 `5`；11 帧，frame 2 有 flag 1，frame 4 播放 `FIREROAD_01`，各帧有 damage box。 | state 脚本会把 frame 0 delay 改为 cast time；实际读条/动作节奏需实机。 |
| `ATAnimation/FireRoadCast2.ani` | 角色 etc motion 索引 `6`；5 帧，frame 2 有 flag 1，frame 3 播放 `FIREROAD_02`，各帧有 damage box。 | 当前脚本 substate 1 不创建新火柱；不要因 flag 存在误写二次创建。 |
| `ATFireRoad1.ani` / `ATFireRoad2.ani` | 两者反编译同形，31 帧；frame 1-14 有攻击盒，frame 15 长 delay 且无攻击盒，frame 16-28 有攻击盒，frame 29-30 无攻击盒。 | 静态攻击盒不能证明最终命中、伤害、击倒、推开或浮空。 |
| `ATFireRoad1.atk` | magic/fire/weapon damage apply/down/blow/no blood/lift up。 | 最终击倒、浮空和伤害需实机。 |
| `ATFireRoad2.atk` | 与第一段同为 magic/fire，额外有 push aside `100`。 | 推开、卡肉和 PVP 表现不能静态证明。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_SetSkillSubState(obj, subState)` / `sq_GetSkillSubState()` | 角色记录并读取 FireRoad 的 0/1 子状态。 | 子状态数字只对本技能链闭合，不能跨技能硬套。 |
| `sq_SetFrameDelayTime(animation, frameIndex, delayTime)` | FireRoad 用 cast time 改写 CAST1 当前动画 frame 0 delay。 | 改帧后动作读条、取消窗口和联机表现需实机。 |
| `IRDSQRCharacter.sq_WriteByte(byte)` / `receiveData.readByte()` | FireRoad 用 byte 传 `maxHit` 和火柱序号。 | byte 宽度为 0-255；读取端顺序必须和写入顺序一致。 |
| `sq_SetPause(obj, PAUSETYPE_OBJECT, pauseTime)` | PO 按写包时间暂停自身，形成逐个火柱延迟。 | 暂停精度、帧率、卡顿和同步不能静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMaxHitCounterPerObject(hitCount)` | PO 限制每对象最大攻击次数。 | 实际重复命中、目标切换和 PVP 修正需实机。 |
| `CNSquirrelPassiveObject.sq_GetParentState()` / `sq_GetParentSkillSubState()` | PO 在 frame 15 查询父角色是否已进入二段或离开 FireRoad。 | 父对象失效、跨同步帧和异常中断需实机。 |
| `sq_GetCustomAttackInfo(obj, 0)` / `sq_SetCurrentAttackInfo(obj, attackInfo)` | PO 切到 `.obj [etc attack info]` 的 `ATFireRoad2.atk`。 | 只证明攻击包切换；实际命中和伤害需实机。 |
| `sq_SetAnimationCurrentTimeByFrame(animation, 16, true)` | PO 二段切换后跳过 frame 15 长停顿，进入 frame 16 后续攻击段。 | 跳帧时序、残留攻击盒和同步需实机。 |
| `CNRDAnimation.setImageRateFromOriginal(...)` / `setAutoLayerWorkAnimationAddSizeRate(...)` / `sq_SetAttackBoundingBoxSizeRate(...)` | PO 按 sizeRate 同步缩放图片、自动层级动画和攻击盒。 | 缩放后的实机命中范围必须测试。 |

## 禁止外推

- 本页只证明 `FireRoad` 这一个技能链；不要把 `24212/24213` 的写包、frame 15 等待或二段 AttackInfo 切换外推到其他 PO。
- 不要把 `FireRoadEx.skl` 写成独立运行 state。它是 `feature skill index` 指向的强化被动。
- 不要把 `FireRoadEx.skl` 的 static data index 4 直接写成当前主动必定额外两行；脚本读取的是 `SKILL_FIRE_ROAD` 的 static data，强化合并效果需实机或引擎语义确认。
- 不要用 `24212/24213` registry 的显示名“火焰爆炸”解释 FireRoad；以当前技能脚本、object、atk 和动画链为准。
- 静态只读不能证明命中、伤害、卡肉、击倒、推开、浮空、暂停时序、二段切换时机、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机释放：确认 cast 读条、CAST1 frame 2 创建、CAST1 -> CAST2 -> 站立时序。
2. 火柱排布：按不同技能等级确认火柱数量、X 间距、交替 `24212/24213` 是否符合画面表现。
3. 强化被动：学习/不学习 FireRoadEx，对比是否出现额外行、数量增加和攻击力增加。
4. 二段攻击：观察 frame 15 长停顿后是否在角色进入 substate 1 时切第二段火焰，是否使用第二段 hit wav/推开表现。
5. 攻击表现：只用实机确认伤害、火属性、最大命中次数、击倒、推开、浮空、PVP 修正和联机同步。
6. 资源链：检查角色 CAST1/CAST2、PO 动画、两段 `.atk`、音效和 ImagePacks2 资源是否完整。
