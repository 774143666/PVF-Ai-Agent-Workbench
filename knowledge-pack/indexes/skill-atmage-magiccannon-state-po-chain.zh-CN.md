# AT Mage MagicCannon State/PO 链只读核验

状态：默认可用

用途：记录当前主目标中 `MagicCannon` 的 skill registry、state/substate、角色 keyframe、24227 passiveobject、元素攻击包和 NUT API 边界。本文只覆盖这一个技能创建的 PO 窄链，不重开 PassiveObject / AttackInfo / Hitbox 广域主线。

## 一句话结论

`MagicCannon` 是男法 `skill 18` 的主动技能，运行入口注册到 `STATE_MAGIC_CANNON = 37`；地面释放直接进入 `LAND` 子状态，空中释放先进入 `CHARGE` 再按方向键选择水平、垂直或斜向发射。角色 keyframe 通过二进制 word 包创建 `24227`，PO 再按发射位置和元素类型切换动画、攻击信息、元素爆炸或暗属性自身攻击链。

## 主目标只读闭合链

| 层级 | 当前确认 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `18 -> ATMage/MagicCannon.skl`；`228 -> ATMage/MagicCannonEx.skl` 是强化被动。 | 只证明技能 ID 到 `.skl` 路由；强化被动不单独注册运行 state。 |
| `.skl` 基础字段 | `MagicCannon.skl` 为 active，命令 `↓↓ + Z`，`[executable states] = 8 0 6 14`，`[feature skill index] = 228`。 | 可执行状态只说明静态允许范围，不能证明实战释放成功。 |
| `.skl static data` | `MagicCannon.skl [static data]` 只有 `100`；PO 爆炸创建时用 `sq_GetIntData(parentObj, SKILL_MAGIC_CANNON, 0)` 读取为 sizeRate。 | 只证明脚本按 index 0 取数，不证明实机爆炸范围。 |
| level data | `MagicCannon.skl` 和 `MagicCannonEx.skl` 的 `[level info]` 每级 5 列。 | 5 列必须按元素枚举闭合，不能按展示文本随意重排。 |
| header 常量 | `STATE_MAGIC_CANNON = 37`，`SKILL_MAGIC_CANNON = 18`；元素枚举为 fire 0、water 1、dark 2、light 3、none 4、max 4。 | 枚举只在当前 ATMage header 语境内闭合。 |
| load_state | `atmage_load_state.nut` 注册 `MagicCannon` state，并注册 `Character/ATMage/MagicCannon/po_MagicCannon.nut` 到 `24227`。 | `24227` 必须走 `passiveobject/passiveobject.lst`，不能按数字外形套 skill/monster/APC registry。 |
| passiveobject registry | `passiveobject/passiveobject.lst` 中 `24227 -> Character/Mage/ATMagicCannon.obj`。 | 这里只作为本技能创建对象链，不扩展成 PO 广域采样。 |
| PO object | `ATMagicCannon.obj` 有基础无属性球、4 个元素创建动画、4 个元素射出动画和 `AttackInfo/ATMagicCannonShoot.atk`。 | object/atk 只能证明静态载体存在，不证明命中、伤害或异常。 |

## level data 与元素列

| 脚本元素值 | header 枚举 | `.skl [level property]` 显示列 | 当前用法 |
| ---: | --- | --- | --- |
| `0` | `ENUM_ELEMENT_FIRE` | 火属性魔法球攻击力 | NUT 直接用 `elementalType` 作为 `sq_GetBonusRateWithPassive(..., levelDataIndex, ...)` 的列号。 |
| `1` | `ENUM_ELEMENT_WATER` | 冰属性魔法球攻击力 | 水/冰显示文本和枚举名不同；按 header 与脚本闭合。 |
| `2` | `ENUM_ELEMENT_DARK` | 暗属性魔法球攻击力 | 暗属性走自身攻击信息改写，不走普通元素爆炸创建。 |
| `3` | `ENUM_ELEMENT_LIGHT` | 光属性魔法球攻击力 | 非暗属性命中或落地时走普通元素攻击创建。 |
| `4` | `ENUM_ELEMENT_NONE` | 无属性魔法球攻击力 | `.skl` 展示文本第一列，但脚本列号是 4。 |

结论：`.skl` 展示顺序是无、火、冰/水、暗、光；NUT 运行取数按元素枚举值直接索引。不要把展示第一列误写成 `levelDataIndex = 0`。

## state / substate 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| 释放入口 | `checkExecutableSkill_MagicCannon` 成功使用 `SKILL_MAGIC_CANNON` 后，若当前是 `STATE_JUMP` 压入 `CHARGE(0)`，否则压入 `LAND(4)`，再发送 `STATE_MAGIC_CANNON`。 | 空中/地面分支来自当前状态判断；是否允许释放仍受技能条件和引擎判断影响。 |
| onSetState | 读取 `datas[0..3]` 为 substate 与当前位置，设置 `setSkillSubState`、对应角色动画、攻击/施放速度，并用 `sq_SetCurrentPos` 重置坐标；同时读取 `throwElement` 并调用元素链函数。 | 只证明当前脚本会按 state 包参数恢复位置和元素，不证明网络同步或视觉最终表现。 |
| CHARGE 结束 | `onEndCurrentAni` 在 `CHARGE` 结束时读 `LEFT/RIGHT/DOWN`：只有水平键时进 `HORIZON(1)`；只有 DOWN 时进 `VERTICAL(2)`；默认和水平+DOWN 都落到 `DIAGONAL(3)`。 | 按键读取是结束帧时点判断；手感和输入容错需实测。 |
| LAND 结束 | `LAND(4)` 动画结束后回 `STATE_STAND`。 | 不证明动作取消窗口。 |
| 发射子状态结束 | `HORIZON/VERTICAL/DIAGONAL` 结束后压入 `1,0,0` 并发送 `STATE_JUMP`。 | 只证明回跳跃状态包参数，不证明空中轨迹和落地时序。 |

## 角色 keyframe

| 动画 | 绑定索引 | 已确认 keyframe | 脚本作用 |
| --- | ---: | --- | --- |
| `MagicCannonReady.ani` | `CUSTOM_ANI_AT_MAGIC_CANNON_READY = 46` | 无发射 flag；2 帧。 | 空中蓄力动作。 |
| `MagicCannon1.ani` | `CUSTOM_ANI_AT_MAGIC_CANNON_1 = 34` | `FRAME000 [SET FLAG] 1`，`FRAME007 [SET FLAG] 2`。 | 水平发射创建 PO，随后设置反冲。 |
| `MagicCannon2.ani` | `CUSTOM_ANI_AT_MAGIC_CANNON_2 = 41` | `FRAME000 [SET FLAG] 1`，`FRAME007 [SET FLAG] 2`。 | 斜向发射创建 PO，随后设置反冲和 Z 速度。 |
| `MagicCannon3.ani` | `CUSTOM_ANI_AT_MAGIC_CANNON_3 = 42` | `FRAME000 [SET FLAG] 1`，`FRAME007 [SET FLAG] 2`。 | 垂直发射创建 PO，随后设置 Z 速度。 |
| `MagicCannon4.ani` | `CUSTOM_ANI_AT_MAGIC_CANNON_4 = 78` | `FRAME003 [SET FLAG] 1`，`FRAME010 [SET FLAG] 3`。 | 地面发射创建 PO，随后设置地面后退。 |

`flag 1` 会写入 `subState` 和 `currentElementalType` 两个 word，然后创建 `24227`。`flag 2/3` 只证明脚本设置角色反冲/速度参数；最终位移必须实机验。

## 24227 PO 流程

| 阶段 | 当前确认 | 边界 |
| --- | --- | --- |
| setCustomData | `receiveData.readWord()` 依次读发射位置和元素类型；设置 2000ms time event；保存到 var 0/1。 | 写包和读包顺序闭合；超时销毁是否与命中销毁竞争需实测。 |
| 创建动画 | 非无属性按元素值切换创建动画；4 个元素创建动画末帧均有 `SET FLAG 1`。无属性基础动画末帧也有 `SET FLAG 1`，并带攻击盒。 | 动画 flag 只证明对象可切 SHOOT，不证明攻击一定命中。 |
| 暗属性初始化 | 暗属性在 setCustomData 阶段改写当前 AttackInfo：写诅咒参数、启用武器伤害、设置百分比攻击力、魔法攻击、damage act 1 和 dark 元素。 | 诅咒概率、等级、持续时间、伤害和 PVP 规则必须实测。 |
| SHOOT 状态 | PO 收到 `sendStateOnlyPacket(3)` 后进入 SHOOT；按发射位置设置角度，按元素切换射出动画、旋转、移动粒子、附加 draw-only 拖尾和声音。 | 只证明视觉/状态参数；飞行轨迹和同步不能静态证明。 |
| 非暗命中 | SHOOT 且元素不是暗时，`onAttack` 创建普通元素攻击并销毁自身。 | 普通元素攻击的命中、伤害、异常和范围必须实测。 |
| 暗属性命中 | 暗属性不走普通元素爆炸分支，主要依赖自身攻击信息；`onAttack` 不执行非暗销毁逻辑。 | 暗球命中后的停留、重复命中、超时销毁和同步需要专项测试。 |
| 落地 | `procAppend` 发现 `z <= 0` 时尝试创建元素攻击并销毁自身；暗属性创建函数会早退。 | 落地触发时序、是否重复触发、暗属性落地表现必须实机确认。 |

## 动画与攻击载体

| 载体 | 当前确认 | 边界 |
| --- | --- | --- |
| `ATMagicCannonShoot.atk` | 只有 `[attack enemy] 1` 与 `[damage reaction] [none]`。 | 最终元素、攻击力、异常、damage act 主要由 NUT 改写，不可只看 `.atk`。 |
| 元素射出动画 | 火/冰/光为循环 2 帧攻击盒；暗为循环 5 帧攻击盒。 | 攻击盒存在不等于实机命中范围或多段规则确定。 |
| 创建动画 | 无属性基础球末帧有攻击盒；元素创建动画末帧主要给 flag 1。 | 创建阶段是否能造成伤害需实机，不可仅凭动画盒下结论。 |

## API 边界

| API | 本桶可用结论 | 主要边界 |
| --- | --- | --- |
| `sq_IsKeyDown(index, subKeyType)` | 空中蓄力结束时判断方向键，选择发射 substate。 | 只代表按键状态读取，不证明输入容错、手感或同步。 |
| `sq_GetVectorData(datas, index)` | 在 `onSetState` 读取 state 包里压入的 substate/x/y/z。 | 只在当前 state 包链内解释，不能把数字跨技能硬套。 |
| `sq_SetCurrentPos(obj, x, y, z)` | 按 state 包保存的位置重设角色坐标。 | 最终位置、落地、服务端一致性需实机。 |
| `IRDSQRCharacter.sq_SetStaticSpeedInfo(...)` | 设置动作速度相关参数。 | 动作手感和帧事件时序需实机。 |
| `IRDSQRCharacter.sq_SetStaticMoveInfo(...)` / `sq_SetMoveDirection(...)` / `sq_SetZVelocity(...)` | 设置水平/垂直反冲和 Z 速度。 | 反冲距离、摩擦、落地和同步不可静态证明。 |
| `sq_BinaryStartWrite()` / `sq_BinaryWriteWord(value)` | 创建 24227 前写入发射位置与元素类型两个 word。 | 读取端必须按相同顺序和宽度读取。 |
| `IRDCollisionObject.sendStateOnlyPacket(state)` | PO 动画 flag 1 后切到 SHOOT 状态。 | 状态切换时序、网络同步需实机。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(path, horizonAngle, verticalAngle)` | 给 SHOOT 阶段设置移动粒子。 | 资源存在、角度显示和残留需资源链或实机。 |
| `sq_SetAddWeaponDamage(...)` / `sq_SetCurrentAttackeDamageAct(...)` / `AttackInfo.setElement(...)` | 暗属性分支改写自身攻击信息。 | 攻击类型、受击反馈、元素和伤害结算最终规则需实机。 |
| `sq_getNewAttackInfoPacket()` / `sq_createCommonElementalAttack(...)` | 非暗属性命中或落地时创建普通元素攻击。 | 伤害、异常、范围、同步和 PVP 不可静态证明。 |

## 禁止外推

- 本页只证明 `MagicCannon` 这一个技能链；不要把 24227 的结论外推到其他 PO。
- 不要把 `MagicCannonEx.skl` 写成独立 state。它是 `feature skill index` 指向的强化被动。
- 不要把 `.skl [level property]` 的展示顺序当作运行时列号；运行脚本使用元素枚举值。
- 静态只读不能证明命中、伤害、卡肉、击退、浮空、反冲手感、轨迹、销毁时序、异常触发、PVP 最终规则、同步或客户端资源完整性。

## 下一步验收

1. 实机地面释放：确认地面是否直接走 `LAND`，`flag 1` 创建球，`flag 3` 后退，动画结束回站立。
2. 实机空中释放：分别测试不按方向、只按左右、只按 DOWN、左右+DOWN，确认 substate 分别是否对应斜向、水平、垂直、斜向。
3. 元素测试：无、火、冰/水、暗、光分别确认创建动画、射出动画、声音、命中、落地、销毁和是否生成普通元素攻击。
4. 异常测试：冰冻、感电、诅咒只看实机触发率、等级、持续时间和抗性/PVP 规则，不能用静态结论替代。
5. 资源链测试：检查角色动画、球动画、拖尾、移动粒子和声音资源是否在目标客户端完整存在。
