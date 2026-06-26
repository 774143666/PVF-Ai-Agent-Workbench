# AT Mage FrozenLand State/PO/appendage 链只读账本

状态：默认可用

用途：记录当前主目标 PVF 中男法 `FrozenLand` 的 skill registry、state/substate、二进制写包、三段 passiveobject、吸附 appendage、异常状态和动画边界。本文只证明静态只读链路可见，不证明命中、伤害、冰冻、吸附、旋转轨迹、黑屏/震屏表现、PVP 最终规则、联机同步或客户端资源完整。

## 纯结论

| 问题 | 当前主目标只读结论 | 边界 |
| --- | --- | --- |
| 技能入口 | `skill 13 -> ATMage/FrozenLand.skl`，名称为冰龙旋舞；`skill 223 -> ATMage/FrozenLandEx.skl` 为强化被动。 | registry 只证明 ID 到 `.skl` 路由。 |
| state 入口 | `atmage_load_state.nut` 注册 `FrozenLand` 到 `STATE_FROZENLAND = 32` / `SKILL_FROZENLAND = 13`。 | 只证明 state 被注册，不证明释放成功或实战表现。 |
| substate 流程 | 当前脚本按 `CASTING(5) -> 0 -> 1 -> 2 -> 3` 运行；`4` 只保留空分支。 | substate 数字只对本技能闭合，不能跨技能复用。 |
| 主 PO 创建 | substate 0 在角色当前帧 `>= 4` 时写入 10 个 dword，并创建 `24247` MagicCircle。 | 创建坐标、时序、frame 判断和本机控制分支需实机确认。 |
| PO 级联 | `24247` MagicCircle 创建两个 `24248` Pole；Pole 旋转结束后 MagicCircle 创建 `24249` Exp。 | 这是本技能创建的 `24247/24248/24249` 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。 |
| 吸附 appendage | MagicCircle 在 Pole 进入特定状态后追加 `ap_common_suck.nut`，再添加 aura master 并调用 `setAttractionInfo(200, 200, range, 100)`。 | `ap_common_suck.nut` 本体回调几乎为空；TypeSquirrel 对 aura 参数说明弱，吸附成功率、范围和免疫必须实机。 |
| EX 边界 | `FrozenLandEx.skl` 写的是攻击力、冰冻几率和冰冻 Lv 增加；`special level up` 形态包含攻击 +10%、冰冻几率 +5%、冰冻 Lv +1。 | 当前 NUT 未看到专门检查 `SKILL_FROZENLAND_EX` 的分支；最终叠加只能按引擎被动机制或实机确认。 |
| 未闭合文件 | `po_ATFrozenLandExpWaterPole.nut` 文件存在，但当前 load_state 未注册，当前 NUT 文本也未命中同名调用。 | 只能记为存在但入口未闭合，不能写成运行链。 |

## `.skl` 静态字段

| 文件 | 已确认字段 | 边界 |
| --- | --- | --- |
| `ATMage/FrozenLand.skl` | 主动；`feature skill index 223`；前置 `32 1`；需求等级 45；冷却 40000；施放时间 600；消耗物品 `3037 2 2`；static data 为 `120 400 3 1000 0`，PVP 为 `100 400 3 1000 0`。 | static data 含义按当前 NUT 只读闭合：index 0 作魔法阵半径倍率，index 1 作多段攻击间隔，index 2 作水柱停止旋转圈数，index 3 作回收旋转时间，index 4 作额外围绕时间。 |
| `ATMage/FrozenLand.skl` level info | level info 为 5 列；当前 NUT 读取第 0 列为水柱多段攻击倍率，第 1 列为爆炸攻击倍率，第 2 列为冰冻几率，第 3 列为冰冻 Lv，第 4 列为冰冻持续时间。 | 最终攻击力、冰冻概率、抗性、PVP 修正和 EX 加成必须实机。 |
| `ATMage/FrozenLandEx.skl` | 被动；前置 `13 10`；需求等级 65；最大 10 级；说明为增加冰龙旋舞攻击力、冰冻几率和冰冻 Lv。 | 未在当前 state NUT 中看到显式 EX 分支，不能写成已验证运行加成。 |

## state NUT 链路

| 回调 | 当前主目标观察 | 边界 |
| --- | --- | --- |
| `checkExecutableSkill_FrozenLand` | `sq_IsUseSkill(SKILL_FROZENLAND)` 成功后推入 `SUB_STATE_FROZENLAND_CASTING = 5`，并发送 `STATE_FROZENLAND`。 | 冷却、物品消耗、施放条件和命令输入仍由运行时决定。 |
| `checkCommandEnable_FrozenLand` | 普攻状态下检查 `sq_IsCommandEnable(SKILL_FROZENLAND)`，其他状态返回 true。 | 命令允许不等于一定能成功切 state。 |
| `onSetState` casting | 切动作 `CUSTOM_ANI_FROZENLAND_CASTING = 73`，按 cast time 与 frame 16 计算读条，并播放 `MW_SLASHWATER`。 | 当前 casting 动画静态只有 3 帧；frame 16 返回值和读条手感需实机或引擎语义确认。 |
| `onEndCurrentAni` casting | 切 substate 0。 | 只证明正常动画结束路径。 |
| `onSetState` substate 0 | 切动作 `CUSTOM_ANI_FROZENLAND1 = 20`。 | 角色动作本身没有攻击盒。 |
| `onProcCon` substate 0 | 当前帧 `>= 4` 且未创建时，本机控制对象写入 10 个 dword，并创建 `24247`。 | 读写顺序必须和 MagicCircle 的 `setCustomData` 闭合；创建成功和同步需实机。 |
| `onEndCurrentAni` substate 0 | 切 substate 1。 | substate 1 角色动作是等待/维持段。 |
| `onSetState` substate 1 | 切动作 `CUSTOM_ANI_FROZENLAND2 = 21`。 | `FrozenLand2.ani` 有 loop 标签；循环时长和中断需实机。 |
| `onProcCon` substate 1 | 查询角色的 `24247`；若 MagicCircle 已到 `S_PO_FROZENLAND_MC_3` 或对象缺失，则切 substate 2。 | PO 状态同步、对象丢失和异常收尾需实机。 |
| `onSetState` substate 2 | 启动一个 10000ms 计时器，不切角色动作。 | 计时器如何与角色动画/网络同步结合需实机。 |
| `onProc` substate 2 | 计时器超过 240 后切 substate 3。 | 240 的体感时间、卡顿和联机一致性不能静态证明。 |
| `onSetState` substate 3 | 切动作 `CUSTOM_ANI_FROZENLAND3 = 27`。 | 角色收尾动作无攻击盒。 |
| `onEndCurrentAni` substate 3 | 切回站立。 | 被击、中断、取消和同步收尾需实机。 |
| `onEndState` | 结束 cast gauge。 | 只证明清理调用存在。 |

## PO 写包与状态机

| 对象 | registry 解析 | 读取/状态 | 攻击与边界 |
| --- | --- | --- | --- |
| `24247` MagicCircle | `passiveobject.lst -> Character/Mage/ATFrozenLandMagicCircle.obj` | 读取 10 个 dword：半径倍率、停止旋转圈数、回收旋转时间、多段间隔、多段攻击倍率、爆炸攻击倍率、冰冻几率、冰冻 Lv、冰冻时间、额外围绕时间；先进入 `MC_0`，再转 `MC_2`、`MC_3`、`MC_4`。 | `.obj` 为 bottom 层、pass all；基础动画有攻击盒，脚本把冰冻参数写入当前 AttackInfo。最终命中、冰冻和异常抗性不能静态证明。 |
| `24248` Pole | `passiveobject.lst -> Character/Mage/ATFrozenLandPole.obj` | MagicCircle 创建两个 Pole：一根角度 0，一根角度 180；Pole 读取 8 个 dword，按 `sq_CosTable/sq_SinTable` 计算环绕位置，`POLE_1` 多段旋转，`POLE_3` 可额外围绕，`POLE_2` 收回中心并销毁。 | `.obj` 为 normal 层、pass all；攻击动画有 attack box，脚本设置百分比攻击倍率，并按 timer 重置命中列表。多段命中节奏、轨迹、吸附联动和同步需实机。 |
| `24249` Exp | `passiveobject.lst -> Character/Mage/ATFrozenLandExp.obj` | MagicCircle 在 Pole 消失后写入半径、爆炸倍率、半径倍率并创建 Exp；Exp 从 `S_PO_FROZENLAND_0` 切到 `S_PO_FROZENLAND_1`，结束后销毁。 | `.obj` 为 normal 层、pass all；爆炸动画有大范围 attack box，脚本设置百分比攻击倍率并缩放攻击盒。爆炸命中、范围和冰冻残留必须实机。 |

## appendage 与视觉

| 链路 | 当前主目标观察 | 边界 |
| --- | --- | --- |
| `ap_common_suck.nut` | MagicCircle 在 Pole 进入 `S_PO_FROZENLAND_POLE_2` 时追加该 appendage，并设置 2000ms 有效期；实际文件的 proc/start/end/isEnd 基本为空。 | appendage 文件存在不等于吸附生效。 |
| aura master | MagicCircle 用 `sq_getAuraMaster("frozenAura")` / `sq_AddAuraMaster("frozenAura", parentObj, obj, 1200, 18, 5, 0)`，随后 `setAttractionInfo(200, 200, range, 100)`。 | TypeSquirrel 对 aura 参数和 `setAttractionInfo` 签名说明不足；只能按目标脚本实见记录调用形状。 |
| 粒子 | MagicCircle 用 `GetparticleCreaterMap("fronzenLand", "PassiveObject/Character/Mage/Particle/ATFrozenLand.ptl", obj)` 和 `sq_AddParticleObject` 插入 ice fog。 | 粒子只证明视觉链路；资源存在、层级、残留和多人表现需资源链或实机。 |
| draw-only shockwave | FrozenLand 脚本定义 `createShockWaveAnimation`，创建 `sub_dodge.ani` draw-only 视觉；Pole/Exp 会调用。 | draw-only 不是攻击来源；`sq_SetEnumDrawLayer` 对已实例化对象使用存在 TypeSquirrel 警告，实际显示需实机。 |

## 动画锚点

| 资源 | 只读观察 | 边界 |
| --- | --- | --- |
| 角色动作 73 | `FrozenLandCasting.ani` 共 3 帧，SUPERARMOR damage box，无 attack box。 | 脚本读取 frame 16 是静态边界。 |
| 角色动作 20 | `FrozenLand1.ani` 共 11 帧，SUPERARMOR damage box，无 attack box；脚本在 frame `>= 4` 创建 MagicCircle。 | 角色本体不是当前命中来源。 |
| 角色动作 21 | `FrozenLand2.ani` 共 7 帧，有 loop start/end，SUPERARMOR damage box，无 attack box。 | 循环维持和切出时机取决于 PO 状态。 |
| 角色动作 27 | `FrozenLand3.ani` 共 10 帧，SUPERARMOR damage box，无 attack box，frame 1 播放爆炸音效。 | 收尾动作不证明爆炸攻击来源。 |
| MagicCircle 动画 | `00_maigic_dodge_0.ani` 共 6 帧，frame 0-5 有 attack box。 | 当前 AttackInfo 是否实际攻击、冰冻是否触发需实机。 |
| Pole 动画 | 基础 start 动画无 attack box；`03_wind_spray_back_normal_50.ani` 共 7 帧，frame 0-6 有 attack box，frame 3-6 为 loop 段。 | 多段命中节奏由动画、timer 和 resetHitObjectList 共同决定，不能静态证明。 |
| Exp 动画 | start 动画无 attack box；`10_exp_center.ani` 共 7 帧，frame 0-6 有大范围 attack box。 | 攻击盒缩放后的实际范围和最终伤害需实机。 |

## TypeSquirrel 已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `sq_CosTable(angle)` / `sq_SinTable(angle)` | 按角度取余弦/正弦；Pole 用它计算环绕 X/Y。 | 角度单位、取整、Y 轴压缩和最终轨迹只按目标脚本记录，手感需实机。 |
| `sq_GetAniRealImageSize(ani, rect)` | 读取动画真实图片尺寸；MagicCircle 用它估算半径大小。 | TypeSquirrel 对 `rect` 的宽/高含义标注不确定；不能写成固定换算公式。 |
| `sq_SetEnumDrawLayer(obj, drawLayer)` | 设置绘制图层类型；FrozenLand 的 draw-only shockwave 函数调用它。 | TypeSquirrel 警告不要对已实例化对象使用；目标脚本调用存在，但显示结果需实机。 |
| `CNSquirrelAppendage.sq_getAuraMaster(name)` / `sq_AddAuraMaster(...)` / `CNAuraMasterAttract.setAttractionInfo(...)` | FrozenLand 用它创建/取得 `frozenAura` 并设置吸附参数。 | aura 参数说明不足；吸附强度、目标过滤、免疫和同步必须实机。 |
| `CSQCommonVarlist.GetparticleCreaterMap(...)` / `sq_AddParticleObject(...)` | MagicCircle 用它创建并附加 ice fog 粒子。 | 只证明粒子调用形状；资源链和显示表现另验。 |
| `CSQCommonVarlist.get_timer_vector(index)` / `CNTimer.Get()` / `EventTimer.setParameter(...)` / `isOnEvent(...)` | MagicCircle/Pole 用 timer 控制 ice fog、震波和多段命中列表重置。 | `initGetVarTimer` 定义当前未在目标 NUT 搜索或 TypeSquirrel 中闭合；timer 精度和同步必须实机。 |

## 下一步怎么测

1. 普通释放：确认是否从读条进入魔法阵、水柱旋转、聚合爆炸、角色收尾。
2. 范围测试：用不同距离目标测 MagicCircle/Pole/Exp 三段是否命中，尤其是半径倍率缩放后的范围。
3. 多段测试：观察 Pole 旋转期间是否按间隔多段命中，是否存在重复命中异常。
4. 冰冻测试：分别观察 MagicCircle 写入的冰冻参数、Exp 固定冰冻写入和 EX 学习前后冰冻表现。
5. 吸附测试：测普通怪、霸体怪、固定怪、不可抓取怪，确认 aura 吸附是否实际生效。
6. EX 测试：学习 `FrozenLandEx` 后对比攻击力、冰冻几率和冰冻 Lv 是否实际变化。
7. 资源测试：检查水柱、黑屏、震屏、ice fog、shockwave 和爆炸视觉是否缺图或残留。

## 禁止外推

- 不能把 `ap_common_suck.nut` 的存在写成吸附一定生效。
- 不能把 `FrozenLandEx.skl` 文本写成已经静态证明的最终加成。
- 不能把 MagicCircle 的 attack box 写成已证明的最终冰冻或伤害来源。
- 当前只允许记录 `24247/24248/24249` 本技能 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域采样。
