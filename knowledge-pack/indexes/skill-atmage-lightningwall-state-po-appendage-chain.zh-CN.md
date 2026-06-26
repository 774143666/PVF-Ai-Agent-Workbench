# AT Mage LightningWall State/PO/appendage 链只读核验

状态：默认可用

用途：记录当前主目标中 `LightningWall` 的 skill registry、state、load_state、`24218` passiveobject、AttackInfo 写入、移动粒子、onAttack 追加 appendage 和 NUT API 边界。本文只覆盖这一个技能创建的 PO/appendage 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`LightningWall` 是男法 `skill 29` 的主动技能，运行入口注册到 `STATE_LIGHTNING_WALL = 46`。角色状态本身不使用 substate：施放动作 `FRAME007 [SET FLAG] 1` 写入移动距离、攻击倍率、触电概率/等级/时间/攻击力后创建 `24218`；角色动画超过 frame 20 后向已创建的 wall PO 发送 move state。`24218` 再负责向前移动、用光属性 AttackInfo 攻击，并在 onAttack 中对可控制、可抓取、非 fixture 目标追加 `ap_LightningWall.nut` 的短时控制/电击视觉 appendage。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `29 -> ATMage/LightningWall.skl`；`239 -> ATMage/LightningWallEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `LightningWall.skl` 为 active，命令 `↓↑→ + Z`，施放时间 `1000`，冷却 `20000`，需求等级 `40`，`[feature skill index] = 239`。 | 可释放条件仍受当前状态、冷却、MP、技能等级、消耗品和引擎判断影响。 |
| `.skl executable states` | `[executable states]` 为 `8 0 14`。 | 只说明静态可执行状态线索，不证明强制释放、取消窗口或实机可用范围。 |
| header 常量 | `STATE_LIGHTNING_WALL = 46`，`SKILL_LIGHTNING_WALL = 29`，`SKILL_LIGHTNING_WALL_EX = 239`，`CUSTOM_ANI_LIGHTNING_WALL = 53`，光元素枚举为 `ENUM_ELEMENT_LIGHT = 3`。 | 常量只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `LightningWall` state，并注册 `po_LightningWall.nut -> 24218`。 | `24218` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `24218 -> Character/Mage/ATLightningWall.obj`。 | registry 中显示名复用为“火焰爆炸”，不能用显示名解释技能语义。 |
| PO object / atk | `ATLightningWall.obj` 引用 `AttackInfo/ATLightningWall.atk`；该 `.atk` 为 magic、light、weapon damage apply，并带 hit wav / hit info。 | object/atk 只能证明静态载体存在，不证明命中、伤害、卡肉、击退、浮空、触电或 PVP 表现。 |

## `.skl` 数据与运行索引

| 运行字段 | 来源 | 当前用法 | 边界 |
| --- | --- | --- | --- |
| wall 尺寸/缩放 | static data index `0`，当前为 `100` | PO 按 `size / 100.0` 缩放主体动画、子层和视觉偏移。 | 视觉缩放和攻击范围是否同步需要实机确认。 |
| wall 移动速度 | static data index `1`，当前为 `1500` | PO move state 设置移动粒子速度，并按速度推导 floor/electric timer 间隔。 | 移动轨迹、碰撞和 timer 实际节奏不能静态证明。 |
| wall 移动距离 | static data index `2`，当前为 `2000` | 角色写给 PO；PO 计算目标 X，并在到达后切 destroy。 | 真实终点、阻挡、同步和销毁时序需实机。 |
| hold appendage 有效期 | static data index `3`，当前为 `1000` | PO onAttack 追加 appendage 后设置有效时间。 | 目标实际被控多久、是否提前失效、是否受免疫影响需实机。 |
| wall 攻击倍率 | level data index `0` | 角色用 `sq_GetBonusRateWithPassive` 写给 PO；PO 写入当前 AttackInfo 百分比攻击力。 | 最终伤害和被动叠加规则不能静态证明。 |
| 触电等级 | level data index `1` | 写给 PO，再写入 AttackInfo 异常状态参数。 | 触电是否触发、等级是否生效、抗性/PVP 规则需实机。 |
| 触电概率 | level data index `2`，显示 scale 为 `0.1` | 角色脚本读取后 `/ 10.0`，PO 用 `prob.tointeger()` 写入 AttackInfo。 | 概率表现、四舍五入/截断和抗性不能静态证明。 |
| 触电攻击力 | level data index `3` | 写给 PO，再作为 AttackInfo 异常状态额外参数。 | 异常伤害结算必须实机验证。 |
| 触电持续时间 | level data index `4` | 写给 PO，再写入 AttackInfo 异常状态有效时间。 | 持续时间最终表现和 PVP 修正不能静态证明。 |

## 角色 state 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_LightningWall` 成功使用 `SKILL_LIGHTNING_WALL` 后直接发送 `STATE_LIGHTNING_WALL`，没有 substate vector。 | 成功进入仍受技能条件和引擎判断影响。 |
| 命令允许 | `checkCommandEnable_LightningWall` 在普通攻击 state 内额外查 `sq_IsCommandEnable`，其他状态返回 true。 | 只说明命令层检查，不等于任何状态都能实际释放。 |
| onSetState | 停止移动，切 `CUSTOM_ANI_LIGHTNING_WALL`，读取 cast time，以当前动画 frame 6 的开始时间绘制施放读条，清空本技能 bool 标记，并追加光元素链。 | 读条、动作速度和实际施放窗口需实机。 |
| keyframe flag 1 | 结束施放读条，给人物加白色身体层效果；my-control 分支写 7 个字段后创建 `24218`，创建坐标为 `50, -1, 0`。 | 只证明写包与创建链路；坐标可见性、同步和目标有效性需实机。 |
| keyframe flag 2 / 3 | flag 2 追加人物身体层效果；flag 3 触发本机震动。 | 震动和体效显示需资源链或实机。 |
| onProc move 触发 | my-control、bool 未置位且当前帧 `> 20` 时，对已创建的 `24218` 发送 move state，触发闪屏、置 bool 并播放发射音效。 | frame 窗口、闪屏可见性、联机同步和取消行为不能静态证明。 |
| onEndState | 离开本 state 时调用 destroy 分支；脚本只会把非 move 状态的 wall PO 切 destroy，已进入 move 的 wall 继续按自身目标 X 销毁。 | 不要写成角色离开一定立刻销毁所有 wall；实际残留和时序需实机。 |

## 写包字段与 `24218` 读取

| 顺序 | 角色写入 | PO 读取 | 当前用法 |
| ---: | --- | --- | --- |
| 1 | dword `moveDistance` | dword | 计算 wall 的目标 X。 |
| 2 | dword `attackPower` | dword | 设置当前 AttackInfo 百分比攻击力。 |
| 3 | dword `skill_level` | dword | 读取后当前脚本未继续使用。 |
| 4 | float `prob` | float | 转整数后写入触电异常概率。 |
| 5 | dword `level` | dword | 写入触电异常等级。 |
| 6 | dword `duration` | dword | 写入触电异常持续时间。 |
| 7 | dword `lightDamage` | dword | 写入触电异常附加攻击力参数。 |

## `24218` PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | 读取角色写包字段；取得当前 AttackInfo，设置攻击倍率，调用 `sq_SetChangeStatusIntoAttackInfoWithEtc(... ACTIVESTATUS_LIGHTNING ...)`，并把强制 hit stun 置 `0`。 | 只证明攻击包字段被脚本写入；最终伤害、触电、僵直和 PVP 需实机。 |
| 视觉初始化 | 创建两个 draw-only lightning body 对象，按 static size 缩放并存入变量；目标 X 和原始方向存入变量；PO 自身方向强制设为 right。 | draw-only 对象是视觉载体，不要写成攻击来源。 |
| create state | 初始发送 `PO_LIGHTNING_WALL_CREATE = 2`，基础 motion 为 create 动画。 | create 动画攻击盒能否命中和结算仍需实机。 |
| move state | 切 custom animation index `0`，设置 `Particle/ATLightningWall.ptl`，按 static speed 设 x 轴移动速度；如果父角色方向与 PO 强制方向不同，则速度取负。 | 轨迹、阻挡、方向表现、粒子资源和同步需实机或资源链。 |
| move timer | 按速度和 size 设置 floor/electric mark time events；给两个 lightning body 加 dodge 子层。 | floor/electric mark 是视觉效果，不能证明攻击范围。 |
| procAppend | 持续把两个视觉 lightning body 放到 PO 相对偏移；按原始方向判断是否到达目标 X，达到后切 destroy。 | 到达判定、卡顿、坐标夹取和销毁同步需实机。 |
| destroy state | 移除移动粒子，切 custom animation index `1`，禁用旧视觉对象并创建 destroy 视觉对象。 | 特效残留和对象彻底移除需实机或资源链。 |
| destroy 完成 | destroy 动画结束后 my-control 分支发送 PO 自毁包。 | 销毁时序和联机一致性不能静态证明。 |

## onAttack appendage 链

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| onAttack gate | 只有 `sq_IsHoldable(obj, damager)`、`sq_IsGrabable(obj, damager)` 且 `!sq_IsFixture(damager)` 同时成立时才追加 appendage。 | 哪些目标满足条件、免疫和 PVP 规则必须实机。 |
| 追加 appendage | 对 damager 追加 `ap_LightningWall.nut`，skill index 使用 `SKILL_LIGHTNING_WALL`。 | 追加成功、重复刷新和生命周期需实机。 |
| hold/delay die 调用 | 目标脚本调用 `sq_HoldAndDelayDie(damager, obj, true, true, true, 200, 200, ENUM_DIRECTION_NEUTRAL, masterAppendage)`。 | TypeSquirrel 对该 API 只有变参签名且注释不可靠；这里只记录目标脚本调用形状，不写完整控制语义。 |
| 有效期 | `appendage.getAppendageInfo().setValidTime(time)`，`time` 来自 static data index `3`。 | 有效期最终表现、提前失效和目标死亡边界需实机。 |
| onStart | 创建 `12_el-shock_dodge.ani` draw-only 电击视觉，按目标高度调整大小，记录目标起始 Z，并播放 `LIGHTWALL_ELEC`。 | 视觉和音效资源完整性需资源链或实机。 |
| proc | 用 `sq_GetShuttleValue` 按对象时间让目标 Z 在小范围内往复，并移动电击视觉；同时给目标当前动画设置单色效果层。 | 目标实际浮动、卡肉、受击状态和同步不能静态证明。 |
| onEnd | appendage 结束时禁用电击视觉对象。 | 视觉残留和清理时序需实机。 |

## 动画与攻击载体

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATAnimation/LightningWall.ani` | 角色 etc motion 索引 `53`；frame 7 有 flag 1，frame 20 有 flag 2，frame 21 有 flag 3；多帧标记 superarmor。 | SUPERARMOR、frame 窗口、取消和霸体表现需实机。 |
| `CreateLightningWallBase.ani` | `24218` 基础 create 动画；frame 0/1 可见音效/flag，后续多帧有攻击盒。 | 静态攻击盒不能证明最终命中或伤害。 |
| `MoveLightningWallBase.ani` | `24218` move 动画，loop，带大攻击盒，frame 2 有 flag 2，后段有长 delay。 | 移动和销毁由脚本坐标/状态控制，不要只按动画长度判断。 |
| `DestroyLightningWallBase.ani` | `24218` destroy 动画，部分帧有攻击盒，结束后 PO 自毁。 | destroy 阶段是否仍命中、何时自毁需实机。 |
| `5_el-p_normal_1/2.ani` | PO 创建的两个 lightning body 视觉对象，无攻击盒。 | 视觉对象不是当前确认的命中来源。 |
| `ATLightningWall.atk` | 魔法、光属性、weapon damage apply，hit wav 为 `R_LIGHTSHOT_HIT`，hit info blow/no blood。 | `.atk` 未观察到独立 PVP block，但 `.skl` 有 PVP level info；最终 PVP 规则只能实机确认。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `IRDCollisionObject.getMyPassiveObjectCount(poIndex)` / `getMyPassiveObject(poIndex, arrayId)` | 角色按 PO index 枚举自己创建的 `24218`，用于给 wall 广播 move/destroy state。 | 返回对象数量和状态取决于运行时创建/销毁；必须做空对象防护。 |
| `IRDCollisionObject.sendStateOnlyPacket(state)` | 角色给 wall PO 发送只含 state 的状态包。 | 状态切换时序、是否丢包和同步表现需实机。 |
| `sq_flashScreen(...)` / `sq_EffectLayerAppendageOnlyBody(...)` | 角色释放中使用闪屏和人物身体层效果。 | 只证明视觉接口调用；显示、层级和残留需实机/资源链。 |
| `sq_SetChangeStatusIntoAttackInfoWithEtc(...)` / `sq_SetCurrentAttackeHitStunTime(...)` | PO 写入触电异常参数，并把强制命中僵直时间设为 `0`。 | 触电概率、等级、伤害、僵直、抗性和 PVP 均不可静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(...)` / `sq_SetSpeedToMoveParticle(...)` / `sq_RemoveMoveParticle()` | PO move/destroy 阶段设置、调速并移除移动粒子。 | 轨迹、粒子资源、阻挡和同步需实机或资源链。 |
| `sq_IsHoldable(...)` / `sq_IsGrabable(...)` / `sq_IsFixture(...)` | PO onAttack 用三者作为追加 appendage 的目标条件。 | 目标类型、免疫、PVP 和服务器判定需实机。 |
| `sq_HoldAndDelayDie(...)` | 目标脚本以变参形式调用，用于和 appendage 绑定控制链。 | TypeSquirrel 注释不可靠；只记录当前调用形状，不写完整语义。 |
| `sq_AddDrawOnlyAniFromParent(...)` / `sq_ChangeDrawLayer(...)` | 创建 floor/electric mark、lightning body 和 appendage 电击视觉，并调整绘制层。 | draw-only 是视觉链路，不证明攻击来源。 |
| `CNRDAnimation.resizeWithChild(size)` / `resize(size)` / `setEffectLayer(...)` | 缩放 wall/电击视觉，给目标动画设置单色效果层。 | 视觉缩放和效果层显示需资源链或实机。 |
| `sq_GetShuttleValue(...)` / `sq_GetObjectTime(obj)` | appendage proc 里按对象时间计算目标 Z 往复偏移。 | 实际浮动、卡肉、同步和目标状态需实机。 |
| `IRDAppendage.getAppendageInfo()` / `IRDAppendage.setValidTime(time)` | 取 appendage 信息对象并设置有效时间。 | 有效期刷新、提前失效、重复挂载和死亡清理需实机。 |

## 禁止外推

- 本页只证明 `LightningWall` 这一个技能链；不要把 `24218`、移动粒子、触电写包或 onAttack appendage 结论外推到其他 PO。
- 不要把 `LightningWallEx.skl` 写成独立运行 state。它是 `feature skill index` 指向的强化被动。
- 不要用 `24218` registry 的显示名“火焰爆炸”解释 LightningWall；以当前技能脚本、object、atk 和动画链为准。
- 不要把 draw-only floor/electric/lightning body 特效写成命中来源；当前攻击承载是 `24218` 的基础 PO 动画和 AttackInfo。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、追踪轨迹、hold 成功率、触电概率、销毁时序、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机释放：确认施放读条、frame 7 创建、frame 20 后 move、闪屏、震动和声音时序。
2. 距离测试：不同 static move distance 下观察 wall 是否按目标 X 停止并进入 destroy。
3. 目标测试：可抓取、不可抓取、fixture、霸体、死亡/离场目标分别测试 onAttack appendage 是否追加。
4. 异常测试：按不同技能等级验证触电概率、等级、持续时间和触电攻击力表现。
5. 攻击表现测试：只用实机确认伤害、光属性、卡肉、击退、浮空、hold/delay die、PVP 修正和联机同步。
6. 资源链测试：检查角色动画、wall create/move/destroy、floor/electric mark、电击 appendage、移动粒子、音效和 ImagePacks2 资源是否完整。
