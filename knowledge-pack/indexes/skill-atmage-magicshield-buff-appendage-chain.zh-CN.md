# AT Mage / MagicShield Buff-Appendage 链只读账本

状态：默认可用

用途：记录男法师 `MagicShield / 元素环绕` 在主目标 PVF 中可静态闭合的 `skill -> state -> keyframe -> appendage -> 被击回调/减伤/元素联动` 链。本文只证明当前目标静态结构，不证明最终减伤、反击伤害、完全防御、僵直、减速、Buff UI、PVP、同步或客户端资源完整性。

## 一句话结论

MagicShield 是男法 `skill 19`，由 `atmage_load_state.nut` 注册到 `STATE_MAGIC_SHIELD = 38`。释放成功后进入 `MagicShield.nut`，角色动画 `MagicShield.ani` 在 `FRAME003 [SET FLAG] 1` 触发挂载 `ap_MagicShield.nut`。真正的持续效果在 appendage 里：按当前 `throwElement` 切换盾动画，读取技能 level data 设置持续时间、减伤和元素分支；火/光用动态 AttackInfoPacket 反击，水分支返回 0 伤害并消耗防御次数，暗分支发送减速异常状态。

## 主目标只读闭合链

| 环节 | 主目标可见事实 | 边界 |
| --- | --- | --- |
| skill registry | `skill/atmageskill.lst` 中 `19 -> ATMage/MagicShield.skl`。 | 只证明男法技能 registry 路由。 |
| `.skl` 基础字段 | 名称为 `元素环绕` / `Elemental Shield`，类型 `[active]`，`[executable states]` 为 `8 0 14`，`[feature skill index]` 为 `229`。 | `[executable states]` 是静态释放线索；不证明任何 Buff 或受击效果。 |
| `.skl` level data | `[level property]` 把 8 列解释为持续时间、伤害减少、火属性攻击力、冰属性完全防御次数、光属性僵直时间、暗属性减速概率/等级/持续时间。 | 列含义按当前 `.skl` 与 NUT 读取闭合；最终数值效果需实机。 |
| feature skill | `229 -> ATMage/MagicShieldEx.skl`，名称 `强化 - 元素环绕`，被动，前置 `19 10`，有 `[special level up]`。 | 只能说明 `MagicShield.skl` 指向强化技能；强化如何进入最终公式需专项核验。 |
| 相邻被动不要混淆 | `34 -> ATMage/ElementalShield.skl`，名称 `属性保护`，被动，`[static data] 10`。 | `SKILL_ELEMENTAL_SHIELD = 34` 是属性变换后的抗性联动，不是 `skill 19` 的环绕盾本体。 |
| header 常量 | `STATE_MAGIC_SHIELD <- 38`，`SKILL_MAGIC_SHIELD <- 19`，`CUSTOM_ANI_AT_MAGIC_SHIELD <- 35`；元素枚举为火 0、水 1、暗 2、光 3、无 4。 | 常量只在当前男法脚本体系内成立。 |
| load_state state 注册 | `pushState(..., "Character/ATMage/MagicShield/MagicShield.nut", "MagicShield", STATE_MAGIC_SHIELD, SKILL_MAGIC_SHIELD)`。 | 证明 state NUT 有入口；不证明释放条件、冷却或实战表现。 |
| state 切换 | `checkExecutableSkill_MagicShield` 使用 `obj.sq_IsUseSkill(SKILL_MAGIC_SHIELD)`，成功后 `sq_AddSetStatePacket(STATE_MAGIC_SHIELD, STATE_PRIORITY_USER, false)`。 | 这里没有 substate；是否能释放仍受冷却、条件和当前状态影响。 |
| 命令可用 | 攻击状态下走 `obj.sq_IsCommandEnable(SKILL_MAGIC_SHIELD)`，其他状态返回 true。 | 命令允许不等于技能一定成功，也不证明可以强制中断所有动作。 |
| 动作入口 | `onSetState_MagicShield` 停止移动，设置 `CUSTOM_ANI_AT_MAGIC_SHIELD`，播放 `MW_ESHIELD`。 | 声音和动作资源实际表现需客户端资源链或实机。 |
| 角色动作索引 | `character/mage/atmage.chr` 的 `[etc motion]` 第 35 项为 `ATAnimation/MagicShield.ani`。 | 这里只证明自定义动作索引闭合。 |
| keyframe 触发 | `character/mage/atanimation/magicshield.ani` 有 6 帧，`FRAME003` 含 `[SET FLAG] 1`。 | 只证明静态触发点；帧时序和手感需实机。 |
| appendage 挂载 | `onKeyFrameFlag_MagicShield` 先移除已有 `Character/ATMage/MagicShield/ap_MagicShield.nut`，再追加同路径 appendage，设置 cause skill，并绑定 `APID_MAGIC_SHIELD`。 | APID 冲突、刷新、重复释放和跨图生命周期需实机。 |
| appendage 回调 | `ap_MagicShield.nut` 注册 `proc/onStart/onEnd/onDamageParent/drawAppend/getImmuneTypeDamageRate`。 | 只证明这些回调名被注册；实际调用频率和触发时机由运行时决定。 |
| appendage 启动 | `onStart` 读取 `level data[3]` 存冰属性防御次数，按当前 `getThrowElement()` 调 `setMagicShieldType`，再用 `level data[0]` 设置有效时间并播放循环音。 | Buff UI、有效期刷新、声音循环和次数显示不能静态证明。 |
| 减伤回调 | `getImmuneTypeDamageRate` 在水属性时返回 `0`；其他属性读取 `level data[1]` 从 `damageRate` 中扣减。 | 静态只读不能证明最终减伤公式、最小伤害、PVP 或服务端同步。 |
| 被击视觉 | `onDamageParent` 会按当前元素创建 `ATMagicShield` 目录下的 circle draw-only 动画，并把方向设为攻击者反向。 | 当前只证明脚本引用路径；客户端动画文件完整性需资源链检查。 |
| 火属性分支 | 被敌方攻击且不是 stuck 时，读取 `sq_GetPowerWithPassive(SKILL_MAGIC_SHIELD, STATE_MAGIC_SHIELD, 2, -1, 1.0)`，构造 AttackInfoPacket，设置 fire element / magical / no weapon，并在本机控制下发送。 | 只证明脚本尝试发送附加攻击包；最终伤害、命中和同步需实机。 |
| 水属性分支 | 敌方攻击且攻击者不是 `0x0821` 类型时，减少冰属性防御次数；次数小于等于 0 时使 appendage 失效。 | 完全防御次数是否按预期扣减、哪些对象被排除，需实机。 |
| 光属性分支 | 读取 `level data[4]`，把值写入 `AttackInfoPacket.hitStunTimeAttackerDamager` 并发送。 | 只证明脚本设置攻击者僵直字段；最终僵直、抗性和 PVP 需实机。 |
| 暗属性分支 | 读取 `level data[5..7]`，向攻击者发送 `ACTIVESTATUS_SLOW` 异常状态包。 | 减速概率、等级、持续时间、抗性和 PVP 不能静态证明。 |
| 盾动画切换 | `setMagicShieldType` 删除旧前/后盾动画，按元素创建新的 back/front 动画，并保留当前帧号。 | 视觉资源是否存在、前后层级是否正确，需要客户端资源链或实机。 |
| 位置刷新 | `proc_appendage_MagicShield` 把记录的 circle draw-only 对象持续移动到角色当前位置。 | 轨迹、残留和销毁时序需实机。 |
| 结束清理 | `onEnd` 删除 back/front 动画、清空对象向量并停止 `SKILL_MAGIC_SHIELD` 声音。 | 声音残留、对象残留和异常失效需实机。 |
| AttackInfo 资源索引 | `atmage.chr` 的 `[etc attack info]` 第 11/12 项为 `ATAttackInfo/MagicShieldFire.atk`、`MagicShieldLight.atk`。 | 当前 appendage 反击分支使用动态 AttackInfoPacket；这些 `.atk` 只作为角色资源索引证据，不等同于当前 NUT 已取用。 |
| ElementalChange 联动 | `onChangeSkillEffect_ATMage` 在 `SKILL_ELEMENTAL_CHANGE` 包中读取元素 byte 后 `setThrowElement(element)`；如果 MagicShield appendage 存在，就调用 `setMagicShieldType` 更新盾元素。 | 只证明属性变换会尝试刷新盾视觉和元素类型；选择 UI、同步和最终效果需实机。 |
| ElementalChange 失效联动 | `ap_ATMage_Elemental_Change.nut` 有效期结束时把 `throwElement` 设回 `ENUM_ELEMENT_NONE`，并尝试刷新 MagicShield 类型。 | 只证明脚本尝试复位；时序和残留需实机。 |
| ElementalShield 抗性联动 | `atmage_throw.nut` 在 `SKILL_ELEMENTAL_SHIELD` 等级大于 0 时，移除 `APID_AT_MAGE_ELEMENT_SHIELD`，按当前元素创建属性抗性 change status。 | 这是 `skill 34` 的抗性链，不是 `skill 19` 本体；最终抗性数值需实机。 |

## level data 读取点

| index | 当前脚本读取位置 | 用途边界 |
| ---: | --- | --- |
| 0 | `onStart_appendage_MagicShield` | appendage 有效时间；单位按 TypeSquirrel 的有效时间接口记录为毫秒语境，实机显示另验。 |
| 1 | `getImmuneTypeDamageRate_appendage_MagicShield` | 非水属性时扣减 `damageRate`；最终减伤公式不可静态证明。 |
| 2 | 火属性 `onDamageParent` | `sq_GetPowerWithPassive` 读取火属性反击攻击力；最终伤害需实机。 |
| 3 | `onStart_appendage_MagicShield` | 水属性完全防御次数初值。 |
| 4 | 光属性 `onDamageParent` | 写入动态攻击包的攻击者僵直时间。 |
| 5 | 暗属性 `onDamageParent` | 减速概率，脚本中除以 `10.0`。 |
| 6 | 暗属性 `onDamageParent` | 减速等级。 |
| 7 | 暗属性 `onDamageParent` | 减速持续时间。 |

## TypeSquirrel 与目标脚本已核 API

| API | 当前可用结论 | 边界 |
| --- | --- | --- |
| `CNSquirrelAppendage.sq_AppendAppendage(...)` / `sq_RemoveAppendage(...)` / `sq_GetAppendage(...)` | 创建、移除、读取指定 appendage；MagicShield 用路径作为唯一挂载目标。 | 路径、重复挂载和生命周期必须按目标脚本核验。 |
| `CNSquirrelAppendage.sq_AppendAppendageID(...)` / `appendage.sq_SetValidTime(time)` | 给 appendage 绑定 APID 并设置有效时间。 | APID 唯一性、刷新、提前失效和跨图表现需实机。 |
| `appendage.sq_AddFunctionName(name, funcName)` | 注册 appendage 回调名。 | 回调是否被引擎按预期调用，只能由运行时验证。 |
| `sq_CreateAnimation(...)` / `sq_GetAnimationFrameIndex(...)` / `sq_SetAnimationFrameIndex(...)` / `sq_DeleteAni(...)` | 创建、读取帧号、设置帧号和删除动画对象；MagicShield 用于切换盾前后层动画。 | 视觉资源完整性和显示层级需资源链或实机。 |
| `sq_AnimationProc(ani)` / `sq_drawCurrentFrame(ani, x, y, isFlip)` | 处理并绘制当前动画帧；MagicShield 的 `drawAppend` 使用。 | 绘制位置、翻转和遮挡只能静态读到调用形状。 |
| `sq_AddDrawOnlyAniFromParent(obj, aniRoute, X, Y, Z)` / `sq_SetCurrentPos(obj, x, y, z)` | 从父对象创建纯绘制动画，并在 proc 中跟随角色位置。 | 残留、销毁和同步需实机。 |
| `sq_getNewAttackInfoPacket()` / `sq_SendHitObjectPacketByAttackInfo(obj, damager, packet)` | 创建攻击信息包并发送附加攻击；MagicShield 火/光分支使用。 | 攻击包字段是否足够、命中和伤害都需实机。 |
| `sq_sendSetActiveStatusPacket(damager, parentObj, status, rate, level, bool, time)` | 发送异常状态包；MagicShield 暗分支使用 `ACTIVESTATUS_SLOW`。 | 异常概率、抗性、等级、PVP 规则不能静态证明。 |
| `sq_GetLevelData(...)` / `IRDSQRCharacter.sq_GetPowerWithPassive(...)` | 读取技能 level data 或带被动修正的攻击力数据。 | 被动修正来源和最终数值必须专项验证。 |

## 不要外推

- `skill 19` 的 MagicShield 本体和 `skill 34` 的 ElementalShield 抗性被动必须分开记录。
- MagicShield 没有注册 passiveobject；本链是 state + appendage + draw-only 动画 + 动态攻击包，不要扩成 PassiveObject 广域样本。
- `MagicShieldFire.atk` / `MagicShieldLight.atk` 存在于角色 `.chr` 资源索引，但当前 appendage 反击分支没有静态读到它们被取用。
- 静态只读不能证明减伤、伤害、完全防御、僵直、减速、Buff 图标、声音循环、PVP、同步或客户端资源完整性。

## 下一步实测建议

1. 释放 MagicShield，确认第 3 帧附近是否挂上环绕盾，持续时间是否按技能等级结束。
2. 先用 ElementalChange 选火/水/暗/光，再释放或刷新 MagicShield，观察盾视觉是否切到对应元素。
3. 分别让怪物近身攻击：火看是否反击伤害，水看防御次数是否消耗，光看攻击者僵直，暗看减速是否触发。
4. 检查 Buff 图标、声音循环、重复释放刷新、换图/死亡/掉线后的残留。
