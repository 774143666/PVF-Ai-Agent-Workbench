# AT Mage / CrystalAttack 原生链只读账本

状态：默认可用

用途：记录男法师 `Crystal Attack / 冰晶坠` 在主目标 PVF 中可静态闭合的 `skill -> state NUT -> time event -> passiveobject -> AttackInfo` 原生链。本文只证明当前目标静态结构，不证明命中、伤害、冰属性最终规则、屏幕震动、同步、PVP 或客户端资源完整性。

## 一句话结论

CrystalAttack 是男法 `skill 3`，由男法 `load_state` 注册到 `state 21`；进入 state 后，NUT 在当前动画帧推进到 `> 1` 时设置 `time event`，按 50ms 间隔尝试创建 `passiveobject 24221`。PO 读取写入的伤害倍率、角度、攻速、序号，在自身动画 `FRAME002` 的 `[SET FLAG] 1` 上重置默认攻击信息并写入当前攻击倍率。

## 主目标只读闭合链

| 环节 | 主目标可见事实 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `3 -> ATMage/CrystalAttack.skl`。 | 只证明男法技能 registry 路由。 |
| `.skl` 基础字段 | 名称为 `冰晶坠` / `Crystal Attack`，类型 `[active]`，`[executable states]` 为 `0 14 8`，`[static data]` 为 `125 3`。 | `[executable states]` 与 `[static data]` 是静态字段，不能单独证明释放成功、创建数量或伤害表现。 |
| header 常量 | `STATE_CRYSTALATTACK <- 21`，`SKILL_CRYSTALATTACK <- 3`，`CUSTOM_ANI_CRYSTALATTACK <- 1`，`SKILL_CRYSTALATTACK_EX <- 213`。 | 常量只在当前男法脚本体系内成立。 |
| load_state state 注册 | `pushState(ENUM_CHARACTERJOB_AT_MAGE, "Character/ATMage/CrystalAttack/CrystalAttack.nut", "CrystalAttack", STATE_CRYSTALATTACK, SKILL_CRYSTALATTACK)`。 | 证明 state NUT 有入口；不证明每个分支都已实机覆盖。 |
| load_state PO 注册 | `pushPassiveObj("Character/ATMage/CrystalAttack/po_CrystalCore.nut", 24221)`。 | `24221` 必须按 `passiveobject/passiveobject.lst` 解析。 |
| state 切换 | `checkExecutableSkill_CrystalAttack` 使用 `sq_IsUseSkill(SKILL_CRYSTALATTACK)`，成功后 `sq_AddSetStatePacket(STATE_CRYSTALATTACK, STATE_PRIORITY_USER, false)`。 | 这里没有 substate；是否能释放仍受冷却、状态和命令条件影响。 |
| 命令可用 | `checkCommandEnable_CrystalAttack` 在攻击状态走 `sq_IsCommandEnable(SKILL_CRYSTALATTACK)`，其他状态返回 true。 | 命令允许不等于技能一定命中或最终进入目标动作。 |
| 动作入口 | `onSetState_CrystalAttack` 停止移动、设置 `CUSTOM_ANI_CRYSTALATTACK`，读取 `static data[0]` 作为动画攻速，播放声音，并调用 `addElementalChain_ATMage(obj, ENUM_ELEMENT_WATER)`。 | `addElementalChain_ATMage` 还要求 `SKILL_ELEMENTAL_CHAIN` 等级大于 0；不能静态证明元素链实战生效。 |
| 角色 ANI | `character/mage/atanimation/crystalattack.ani` 有 18 帧，`FRAME001/002/003` 分别有 `[SET FLAG] 1/2/3`。 | 当前 state NUT 的 keyframe 处理函数是注释块；实际原生创建链走 `onProc + onTimeEvent`，不是这些 keyframe flag。 |
| time event | `onProc_CrystalAttack` 在当前帧 `> 1` 且本地布尔未置位时调用 `setTimeEvent(0, 50, maxCreateCount, false)`；`maxCreateCount` 来自 12 个预设位置。 | 实际创建时还会比较 `timeEventCount` 与 `static data[1]`；静态只读不能证明实机触发节奏。 |
| 创建 PO 写包 | `onTimeEvent_CrystalAttack` 读取伤害倍率、攻速、位置角度，写入 `Dword/Float/Word/Word`，并调用 `sq_SendCreatePassiveObjectPacket(24221, 0, 120 + xDistance, 1, 0)`。 | 坐标、朝向、创建次数、同步和可见性必须实机确认。 |
| PO registry | `passiveobject/passiveobject.lst` 中 `24221 -> Character/Mage/ATCrystalCore.obj`。 | 这是 passiveobject registry 闭合，不是技能、怪物或 APC registry。 |
| PO `.obj` | `ATCrystalCore.obj` 有 `[pass all]`、`[piercing power] 1000`、`[basic motion] Animation/ATCrystalAttack/CrystalBase_0.ani`、两个 `[etc motion]` 和 `[attack info] AttackInfo/CrystalCore.atk`。 | 文件名里同时出现 `CrystalCore` 与 `ATCrystalAttack` 资源；以 `.obj` 实际引用为准。 |
| PO base ANI | `CrystalBase_0.ani` 有 4 帧，`FRAME002` 有 `[SET FLAG] 1` 和 `[ATTACK BOX]`；`.als` 追加 5 个冰晶视觉动画。 | `[ATTACK BOX]` 只证明静态盒存在，不证明实机命中、卡肉或范围。 |
| PO ATK | `CrystalCore.atk` 是 `[magic]`、`[weapon damage apply] 1`、`[water element]`、`[damage reaction] [damage]`、`[push aside] 0`。 | 只证明静态 AttackInfo 字段；冰属性最终规则、伤害和 PVP 要实测。 |
| PO NUT | `setCustomData_po_ATCrystalCore` 读取 `Dword/Float/Word/Word`，按序号选择自定义动画、角度转弧度、保存伤害倍率、旋转对象并改动画速度；`onKeyFrameFlag` 在 PO flag 上重置默认攻击信息、写当前攻击倍率并触发本机震动；动画结束销毁 PO。 | `receiveData.readFloat/readWord/readDword` 当前仍按目标脚本回调参数用法记录，不升级成通用 API 规则。 |

## 参数流

| 写入端 | 传入 PO 的字段 | 读取端 | 用途边界 |
| --- | --- | --- | --- |
| `sq_GetBonusRateWithPassive(SKILL_CRYSTALATTACK, STATE_CRYSTALATTACK, 0, 1.0)` | `sq_WriteDword(dmg)` | `receiveData.readDword()` | 写入当前攻击倍率；最终伤害必须实机确认。 |
| `CrystalAttackCreatePos[currentIndex][1]` | `sq_WriteFloat(angle.tofloat())` | `receiveData.readFloat()` 后 `sq_ToRadian(angle)` | 用于 PO 旋转；视觉朝向和命中方向需实机。 |
| `sq_GetIntData(SKILL_CRYSTALATTACK, 0)` | `sq_WriteWord(attackSpeedRate)` | `receiveData.readWord()` | 用于角色动画和 PO 动画速度；静态不证明手感。 |
| `timeEventCount - 1` | `sq_WriteWord(currentIndex)` | `receiveData.readWord()` | 用于选择 PO 自定义动画；越界和实际创建次数需实机。 |

## TypeSquirrel 与目标脚本已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `IRDCollisionObject.setTimeEvent(timeIndex, timeInterval, timeCount, bool)` | 设置时间事件；`bool=false` 表示先等一次间隔再触发。 | CrystalAttack 由角色对象调用，按继承到碰撞对象方法理解；触发节奏需实机。 |
| `IRDSQRCharacter.sq_WriteFloat(value)` | 向 PO `receiveData` 写入浮点数。 | 读取端顺序必须一致。 |
| `IRDSQRCharacter.sq_GetIntData(skill, staticIndex)` | 读取 `.skl [static data]` 对应位置。 | 只说明取静态数据；数值语义要结合目标脚本。 |
| `setCurrentAnimationFromCutomIndex(obj, index)` | 从自定义索引设置动画。 | 函数名原文为 `Cutom`；索引语义必须按当前对象自定义动画体系核。 |
| `sq_ToRadian(angle)` | 角度转弧度。 | 只说明单位转换，不证明视觉正确。 |
| `sq_SetCustomRotate(obj, angle)` | 设置对象自定义旋转。 | 旋转后的判定、显示和同步需实机。 |
| `sq_GetCurrentAnimation(obj)` / `CNRDAnimation.setSpeedRate(rate)` | 取得当前动画并设置播放速度。 | 不证明动画资源完整或实际手感。 |
| `sq_SetCurrentAttackInfo(obj, attackInfo)` / `CNRDPassiveObject.getDefaultAttackInfo()` | PO 可把当前攻击信息重置为默认攻击信息。 | 只证明脚本写法和 API 形状；不证明最终命中。 |
| `sq_SetCurrentAttackBonusRate(attackInfo, value)` | 设置当前攻击倍率。 | 静态只读不能证明最终伤害。 |
| `sq_SetMyShake(obj, shakeRate, shakeTime)` | 设置本机可见震动。 | 震动幅度、持续感和多人同步不是静态结论。 |
| `CNRDPassiveObject.getParent()` | 取得 PO 父对象。 | 父对象存在与否仍要脚本空值防护和实机确认。 |
| `sq_GetSkillLevel(obj, skillIndex)` / `sq_GetSkill(obj, skillIndex)` / `sq_CreateChangeStatus(...)` | `addElementalChain_ATMage` 用于判断元素链技能并创建属性攻击变化。 | 这里只确认公共函数依赖链；不证明角色学了元素链或 buff 实战生效。 |

## 不要外推

- 本文没有证明 CrystalAttack 的所有创建次数一定等于 `.skl [static data]` 第二列；它只是当前脚本中用于截断 time event 的静态线索。
- 本文没有证明 `[water element]` 在所有场景、PVP 或元素抗性环境里的最终效果。
- 本文没有重开 PassiveObject / AttackInfo / Hitbox 广域主线；这里只是为一个技能的原生链做最小只读闭合。
- CrystalAttack state NUT 中保留了注释掉的 `onKeyFrameFlag_CrystalAttack` 旧逻辑；当前主目标有效链按未注释的 `onProc + onTimeEvent` 记录。

## 下一步实测建议

1. 用男法释放 CrystalAttack，确认动作进入后是否按时间间隔连续落下冰晶。
2. 观察大约第三帧后是否开始创建 PO，是否只出现 `.skl [static data]` 指定数量附近的冰晶。
3. 对普通怪确认是否命中、掉血、冰属性表现、屏幕震动和击退；这些不能由静态账本代替。
