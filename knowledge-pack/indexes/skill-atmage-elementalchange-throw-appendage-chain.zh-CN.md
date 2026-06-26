# AT Mage / ElementalChange Throw-Appendage 链只读账本

状态：默认可用

用途：记录男法师 `Elemental Change / 属性变换` 在主目标 PVF 中可静态闭合的 `skill -> Throw state -> appendage -> magic ball element router` 链。本文只证明当前目标静态结构，不证明属性最终伤害、异常状态命中率、视觉资源完整、同步、PVP 或客户端资源完整性。

## 一句话结论

ElementalChange 是男法 `skill 5`，`load_state` 虽注册了 `STATE_ELEMENTAL_CHANGE = 22`，但当前 `checkExecutableSkill_ElementalChange` 实际发送的是 `STATE_THROW`，并用 int vector 写入 `throwIndex = SKILL_ELEMENTAL_CHANGE`。`atmage_throw.nut` 在 Throw 后置处理中给角色挂 `ap_ATMage_Elemental_Change.nut`，设置有效时间和 buff 图标；基础攻击创建 magic ball 时，如果该 appendage 有效，就按 `obj.getThrowElement()` 把普通魔法球 ID 偏移到火/水/暗/光属性版本。

## 主目标只读闭合链

| 环节 | 主目标可见事实 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `5 -> ATMage/ElementalChange.skl`。 | 只证明男法技能 registry 路由。 |
| `.skl` 基础字段 | 名称为 `属性变换` / `Elemental Change`，类型 `[active]`，`[executable states]` 为 `8 0 14`，`[static data]` 为 `70 65 50`。 | `[executable states]` 和 `[static data]` 是静态字段，不能单独证明属性变更生效。 |
| `.skl` level data | `[level info]` 每级 15 列；`[level property]` 解释为持续时间、火/冰/暗/光攻击力与异常状态参数。 | 列含义只按当前 `.skl` 和目标脚本闭合；异常概率、等级和持续时间仍需实机。 |
| header 常量 | `STATE_ELEMENTAL_CHANGE <- 22`，`SKILL_ELEMENTAL_CHANGE <- 5`，`CUSTOM_ANI_ELEMENTAL_CHANGE <- 4`。 | 常量只在当前男法脚本体系内成立。 |
| load_state state 注册 | `pushState(..., "Character/ATMage/ElementalChange/elemental_change.nut", "ElementalChange", STATE_ELEMENTAL_CHANGE, SKILL_ELEMENTAL_CHANGE)`；同文件也注册 `atmage_throw.nut` 到 `STATE_THROW`。 | 入口存在不等于当前释放会直接进入 `STATE_ELEMENTAL_CHANGE`。 |
| 实际切状态 | `checkExecutableSkill_ElementalChange` 在 `sq_IsUseSkill(SKILL_ELEMENTAL_CHANGE)` 成功后清空 int vector，推入 11 个 Throw 参数，随后 `sq_AddSetStatePacket(STATE_THROW, STATE_PRIORITY_USER, true)`。 | 这里 `hasSubState=true` 指向 Throw 的参数向量，不是技能自己的 substate。 |
| 被注释的直切逻辑 | `obj.sq_AddSetStatePacket(STATE_ELEMENTAL_CHANGE, STATE_PRIORITY_USER, false)` 在当前脚本中是注释行。 | 不能把 `STATE_ELEMENTAL_CHANGE` 写成当前有效运行 state。 |
| Throw 后置处理 | `atmage_throw.nut` 的 `onAfterSetState_Throw` 读取 `obj.getThrowIndex()`；当它等于 `SKILL_ELEMENTAL_CHANGE` 时调用 `onAfterSetState_ElementalChange`。 | `getThrowIndex/getThrowState/getThrowElement` 当前只按目标脚本实见记录，未从 TypeSquirrel 独立确认。 |
| 自定义选择 UI | `throwState == 0` 时调用 `obj.setIsCustomSelectSkill(true)`；`throwState == 1` 时播放选择音，并本机控制下写入 throw element byte 后发送 `sq_SendChangeSkillEffectPacket(obj, SKILL_ELEMENTAL_CHANGE)`。 | 自定义选择 UI、选择包和服务端同步不能由静态只读证明。 |
| appendage 挂接 | `throwState == 1` 时追加 `Character/ATMage/ElementalChange/ap_ATMage_Elemental_Change.nut`，用 `level data[0]` 设置有效时间，设置 buff 图标 55，并用 `APID_SKILL_ELEMENTAL_CHANGE` 绑定 appendage ID。 | 生命周期、重复挂载、buff 图标显示和掉线/换图表现需实机。 |
| appendage 文件 | `ap_ATMage_Elemental_Change.nut` 注册 `proc/prepareDraw/onStart/onEnd/isEnd/onVaildTimeEnd` 回调；有效期结束时尝试把 `throwElement` 设回 `ENUM_ELEMENT_NONE`，并联动 MagicShield 类型。 | 该文件多数回调为空或未展开；这里只证明注册名和有效期结束逻辑。 |
| ElementalShield 联动 | 若 `SKILL_ELEMENTAL_SHIELD` 等级大于 0，Throw 后置处理会移除 `APID_AT_MAGE_ELEMENT_SHIELD`，再按当前 `throwElement` 创建元素抗性 change status 并追加。 | 只证明脚本尝试改属性抗性；实际 buff、抗性值和显示需实机。 |
| 选择成功视觉 | `throwState == 1` 时按 `ENUM_ELEMENT_FIRE/WATER/DARK/LIGHT` 创建对应的 pooled animation。 | 这只证明视觉动画路径被脚本引用，不证明客户端资源完整。 |
| 基础攻击读取 appendage | `attack.nut` 在 `onAfterSetState_Attack` 中读取 `Character/ATMage/ElementalChange/ap_ATMage_Elemental_Change.nut`；appendage 不存在或无效时把 element 退回 `ENUM_ELEMENT_NONE`。 | 只证明基础攻击视觉层和 magic ball 路由会检查 appendage。 |
| magic ball ID 路由 | `createMiniMagicCircle` 默认前方发射使用 `24202`；appendage 有效时 `passiveObjectIndex = passiveObjectIndex + 1 + element`，因此普通攻击前方 magic ball 可落到 `24203/24204/24205/24206`。 | `element` 枚举来自 header：火 0、水 1、暗 2、光 3；实际选择和同步需实机。 |
| magic ball registry | `24202 -> ATMagicBallNone.obj`，`24203 -> ATMagicBallFire.obj`，`24204 -> ATMagicBallWater.obj`，`24205 -> ATMagicBallDark.obj`，`24206 -> ATMagicBallLight.obj`。 | 这是 passiveobject registry 闭合；不展开 PO/AttackInfo/Hitbox 广域样本。 |
| magic ball NUT 读取 | `po_magic_ball.nut` 的各属性 `setCustomData` 读取 `Float/Float` 角度；如还有剩余数据则读攻击倍率并设置当前攻击倍率。 | `receiveData.getSize()` 与 `sq_BinaryGetReadSize()` 只在目标脚本里作为剩余数据判断；写读顺序必须闭合。 |
| 属性追加效果 | 火/水/光 magic ball 命中后会创建 `24214/24215/24216` 二级爆炸；水写入 `ACTIVESTATUS_FREEZE`，光写入 `ACTIVESTATUS_LIGHTNING`，暗属性直接在当前攻击信息写入 `ACTIVESTATUS_CURSE`。 | 静态只读不能证明异常状态最终命中率、等级、持续时间或 PVP 规则。 |
| 二级爆炸 registry | `24214 -> ATMagicBallFireExplosion.obj`，`24215 -> ATMagicBallWaterExplosion.obj`，`24216 -> ATMagicBallLightExplosion.obj`。 | 当前未在 `atmage_load_state.nut` 命中这些 ID 的 `pushPassiveObj` 注册；只能写成 registry 存在和脚本尝试创建，不写成已注册 NUT 链。 |

## Throw 参数向量

| 顺序 | 当前写入值 | 目标脚本注释语义 | 边界 |
| ---: | ---: | --- | --- |
| 0 | `0` | throwState | 进入 Throw 选择流程；真实 Throw 状态机需实机。 |
| 1 | `0` | throwType | 仅按目标注释记录。 |
| 2 | `SKILL_ELEMENTAL_CHANGE` | throwIndex | `atmage_throw.nut` 用它分发到 ElementalChange。 |
| 3 | `500` | throwChargeTime | 时长是否准确影响动作手感，需实机。 |
| 4 | `500` | throwShootTime | 同上。 |
| 5 | `0` | throwAnimationIndex | 只证明写入值。 |
| 6 | `4` | chargeSpeedType | 只证明写入值。 |
| 7 | `4` | throwShootSpeedType | 只证明写入值。 |
| 8 | `1000` | chargeSpeedValue | 只证明写入值。 |
| 9 | `1000` | throwShootSpeedValue | 只证明写入值。 |
| 10 | `-1` | personalCastRange | 只证明写入值。 |

## TypeSquirrel 与目标脚本已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_IntVectClear()` / `sq_IntVectPush(value)` | 清空并写入状态参数向量；ElementalChange 用 11 个整数进入 `STATE_THROW`。 | 向量含义必须按目标 Throw 注释和消费脚本核，不能跨技能硬套。 |
| `sq_SendChangeSkillEffectPacket(obj, skillIndex)` | 发送技能效果变化包；ElementalChange 选择元素后发送 `SKILL_ELEMENTAL_CHANGE`。 | 只证明接口形状和脚本调用；同步与 UI 表现需实机。 |
| `sq_BinaryWriteByte/Word/Float/Dword` | 二进制写包可写入不同宽度数据；本链用于元素选择包和属性爆炸参数。 | 读取端顺序必须闭合；类型宽度不能凭字段名猜。 |
| `CNSquirrelAppendage.sq_SetValidTime(time)` / `sq_AppendAppendageID(...)` | 设置 appendage 有效时间并绑定自定义 APID。 | 时间单位按 TypeSquirrel 为毫秒；实际移除和刷新需实机。 |
| `CNSquirrelAppendage.setBuffIconImage(index)` / `setEnableIsBuff(enable)` | 设置 buff 图标和是否作为 buff 显示。 | 图标是否显示、客户端资源是否存在需实机或资源链检查。 |
| `sq_RemoveChangeStatus(obj, apId)` / `sq_CreateChangeStatus(type, isPercent, value, validTime)` | ElementalShield 联动用来替换元素抗性 change status。 | 只证明脚本尝试创建状态变化；数值效果需实机。 |
| `sq_SetChangeStatusIntoAttackInfo(attackInfo, 0, status, rate, level, time)` | 把异常状态写入当前 AttackInfo；暗属性 magic ball 写入诅咒。 | 异常是否命中、是否受抗性/PVP影响，不能静态证明。 |
| `IRDSQRCharacter.sq_AddStateLayerAnimation(layer, ani, 0, 0)` / `sq_CreateCNRDAnimation(path)` | 基础攻击按当前元素添加视觉层动画。 | 视觉层资源完整性和实际显示需客户端资源链或实机。 |

## 不要外推

- 当前有效释放链是 `STATE_THROW`，不是直接进入 `STATE_ELEMENTAL_CHANGE`。
- `STATE_ELEMENTAL_CHANGE = 22` 仍可作为数据取值上下文被 `sq_GetBonusRateWithPassive(..., STATE_ELEMENTAL_CHANGE, ...)` 使用，但不能写成当前动作 state。
- `24214/24215/24216` 的 registry 存在不等于 NUT 已注册；当前未在 `atmage_load_state.nut` 命中对应 `pushPassiveObj`。
- `getThrowElement/setThrowElement/getThrowState/getThrowIndex/setIsCustomSelectSkill` 当前按主目标脚本实见记录，TypeSquirrel 未给出独立内置定义。
- 本文不证明属性攻击、冰冻、感电、诅咒、爆炸范围、PVP 或同步最终表现。

## 下一步实测建议

1. 使用 ElementalChange，确认是否出现属性选择 UI，选择后 buff 图标是否出现并按持续时间消失。
2. 选择火/水/暗/光后平 A，观察魔法球视觉是否切换到对应属性。
3. 分别对普通怪测试火爆炸、水冰冻、暗诅咒、光感电是否触发；这些不能由静态账本代替。
