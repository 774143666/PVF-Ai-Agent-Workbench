# NUT Runtime API 边界词典

状态：默认可用

用途：解释 Skill / State / NUT Runtime 主线里常见 API 名称的最低可用含义和边界。本文不是完整 API 手册；写 PVF 前仍要对目标脚本入口、参数和游戏内表现做专项核验。

默认先读轻量入口：`dictionaries/nut-runtime-api-boundary-quick.zh-CN.md`。只有需要确认具体 API、回调参数或脚本写法时，再打开本文。

功能组验收入口：`indexes/skill-state-nut-runtime-api-group-boundary.zh-CN.md`。

## 总规则

- API 名称先查 TypeSquirrel，再看目标 PVF 是否有同类脚本用法。
- 教程 helper 名、社区封装函数名、另一个客户端的函数名不能直接当目标 PVF API。
- 函数存在不等于当前脚本入口会运行；入口链必须由 load_state 或已加载脚本推入。
- 函数签名只能说明调用形状，不能证明伤害、命中、同步、元素或 PVP 行为。

## 入口注册

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `IRDSQRCharacter.pushScriptFiles(path)` | 推入脚本文件。 | `path` 是脚本路径；新建脚本必须被已加载入口推入才可能运行。 |
| `IRDSQRCharacter.pushState(job, filePath, sklName, state, skillIndex)` | 注册某职业的 state 脚本。 | `job`、`state`、`skillIndex` 必须来自目标职业和目标技能链。 |
| `IRDSQRCharacter.pushPassiveObj(path, index)` | 注册 passiveobject 对应的 NUT。 | `index` 按 `passiveobject/passiveobject.lst` 解析；不能用怪物、APC 或 map registry 代替。 |
| `CNAvenger.pushScriptFiles(path)` | Avenger 专用入口中推入脚本文件。 | 只说明 Avenger 脚本入口存在；不要和 `IRDSQRCharacter` 入口形状混写。 |
| `CNAvenger.pushState(filePath, sklName, state, skillIndex)` | Avenger 专用入口中注册 state 脚本。 | 没有 job 参数；当前上下文隐含 Avenger。 |
| `CNAvenger.pushPassiveObj(path, index)` | Avenger 专用入口中注册 passiveobject NUT。 | `index` 仍按 `passiveobject/passiveobject.lst` 解析。 |
| `CNAvenger.sq_p00_sendCreatePassiveObjectPacket(poIndex, x, y, z, direction)` | Avenger state 中创建 passiveobject；Spincutter 用它创建 `24101` 初段镰刀和 `24100` 召回/多段镰刀。 | `poIndex` 仍按 `passiveobject/passiveobject.lst` 解析；坐标、方向、同步和对象生命周期需实机。 |
| `sq_SendCreatePassiveObjectPacket(obj, index, level, x, y, z, direction)` | 全局创建 passiveobject；PowerOfDarkness 用它创建 `24107` circle 和 `24108` arrow。 | `index` 仍按 `passiveobject/passiveobject.lst` 解析；TypeSquirrel 只证明函数形状，坐标、返回值、同步和对象生命周期需实机。 |

## 技能使用与切状态

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `IRDCharacter.setSkillCommandEnable(skillIndex, isEnabled)` | 设置技能命令可用。 | 只代表命令层启用，不保证满足释放条件。 |
| `IRDSQRCharacter.sq_IsCommandEnable(skillId)` | 判断是否允许按下技能命令。 | 只代表当前命令层是否可按；不保证 `sq_IsUseSkill` 成功，也不证明命中。 |
| `IRDSQRCharacter.sq_IsEnterSkill(index)` | 判断当前是否可进入技能。 | 需结合冷却、当前状态、技能条件和输入。 |
| `IRDSQRCharacter.sq_IsUseSkill(index)` | 尝试使用技能并返回是否成功。 | 成功后通常还要准备 int vector 和 state packet。 |
| `IRDSQRCharacter.sq_IntVectClear()` / `sq_IntVectPush(value)` | 清空并写入状态参数向量。 | substate 数字必须来自目标 PVF 同类用法或实测。 |
| `IRDSQRCharacter.sq_AddSetStatePacket(stateId, priority, hasSubState)` | 发送 state 切换包。 | `hasSubState=true` 时必须确认已推入正确 substate。 |
| `sq_GetVectorData(datas, index)` | 在 `onSetState_*` 回调中读取前面压入的状态参数成员。 | 只按当前 state 包链解释；substate/x/y/z 等数字不能跨技能硬套。 |
| `IRDSQRCharacter.sq_SetSkillSubState(obj, subState)` / `IRDCharacter.setSkillSubState(subState)` / `getSkillSubState()` | 设置或读取当前角色技能 substate；FireRoad 和 FlameCircle 都用它区分多段动作。 | substate 含义必须来自当前目标 state 包链和脚本分支，不能拿技能 ID 或其他技能数字套用。 |
| `IRDSQRCharacter.sq_GetInputDirection(...)` | 读取输入方向；Teleport 目标脚本用 0/1 区分横向/纵向。 | TypeSquirrel 签名说明较泛，参数语义只按目标脚本实见，不写成通用规则。 |
| `sq_IsKeyDown(index, subKeyType)` | 判断指定按键当前是否按下；MagicCannon 用于空中蓄力结束时选择发射方向。 | 只证明按键状态可读；输入容错、手感、取消窗口和同步必须实机。 |
| `sq_SendChangeSkillEffectPacket(obj, skillIndex)` | 发送技能效果变化包；ElementalChange 用于选择元素后通知变化，CreatorMage Mgrab/WindPress 用于传递鼠标目标/坐标变化。 | 必须有当前运行对象的接收端；不能只凭发送调用写效果，接收回调、时序和丢包边界需实机。 |
| `checkModuleType(moduleType)` | 检查当前运行模块/场景类型；IceSwordEx 用 `MODULE_TYPE_PVP_TYPE` 判断 PVP 并跳过动画回卷。 | 只证明脚本分支条件存在；PVP 最终规则和服务端修正必须实机。 |
| `IRDSQRCharacter.sq_GetBonusRateWithPassive(skill, state, levelDataIndex, ratio)` | 读取带被动修正的百分比类伤害数据。 | 只能说明取数接口形状；实际数值、被动来源和最终伤害必须专项验证。 |
| `IRDSQRCharacter.sq_GetPowerWithPassive(skill, state, levelDataIndex, dilution, ratio)` | 读取带被动修正的固伤类数据。 | 参数含义必须按目标脚本和目标 `.skl [level info]` 核；不能跨技能硬套。 |
| `IRDSQRCharacter.sq_GetLevelData(...)` | 读取技能 level data。 | TypeSquirrel 可查到多参数形状；目标脚本中的便捷调用只按目标脚本实见记录。 |
| `sq_GetCustomIntDataSize(skill, chr)` | 读取技能 custom int data 数量；Burster 用它枚举禁用技能列表。 | 当前只按 Burster 脚本实见记录，列表数字必须回到当前 `.skl [static data]` 解释。 |
| `sq_GetSkillLevel(obj, skillIndex)` | 读取角色指定技能等级；ReleaseBuffs 用它过滤未学习 buff。 | 角色实际技能等级、外部加点和服务端修正需实机。 |
| `sq_GetSkill(obj, skillIndex)` / `CNRDSkill.isInCoolTime()` | 读取技能对象并判断是否冷却中；ReleaseBuffs 用它排除冷却中的 buff。 | 冷却状态、UI 显示和服务端一致性需实机。 |
| `sq_GetCastTime(obj, skillIndex, skillLevel)` | 读取技能施放时间。 | ManaBurst 用作 Throw 充能时间；读条、动作手感和最终释放时序需实机。 |
| `IRDSQRCharacter.sq_GetIntData(skill, staticIndex)` | 读取 `.skl [static data]` 对应位置。 | 只说明取静态数据；该位置在具体技能里代表什么必须看目标脚本。 |
| `IRDCharacter.getSkillMpRate(skillIndex)` / `setSkillMpRate(skillIndex, newMpRate)` | 读取或设置技能 MP 消耗倍率。 | ManaBurst/Expression 链会在技能使用前后临时改写；最终扣蓝、失败释放恢复和服务端一致性需实机。 |
| `IRDSQRCharacter.sq_AddPassiveSkillAttackBonusRate(skillIndex, skillLevelDataIndex)` / `sq_RemovePassiveSkillAttackBonusRate(skillIndex)` | 添加或移除百分比伤害加成。 | ManaBurst appendage 已观察到使用；最终伤害、叠加优先级、面板显示和 PVP 不能静态证明。 |
| `IRDCollisionObject.setTimeEvent(timeIndex, interval, count, immediate)` | 设置时间事件，触发 `onTimeEvent_*` 回调；PowerOfDarkness 用它推进 lift、arrow gap、last delay 和 last phase。 | 触发节奏、次数和同步需实机；脚本还可能在回调内二次截断。 |
| `IRDSQRCharacter.sq_AddSkillLoad(skillIndex, imgPath, value, chargeTime)` / `sq_GetSkillLoad(skillIndex)` / `sq_RemoveSkillLoad(skillIndex)` | 添加、读取或移除技能装载；HolongLight 用它显示/消耗两个火球的再次施放次数。 | TypeSquirrel 对 `sq_GetSkillLoad` 返回类型和目标脚本对象用法不完全一致；loadSlot 的 `isCooling/use` 语义、UI 和同步需实机。 |
| `IRDSQRCharacter.startSkillCoolTime(skillIndex, skillLevel, unknown)` | 设置技能开始冷却；HolongLight 在最后一个非攻击火球被射出后调用。 | 冷却 UI、PVP 修正、失败释放恢复和服务端一致性需实机。 |
| `IRDCollisionObject.setEnableChangeState(enable)` | 设置状态变化开关；ReleaseBuffs 队列完成后调用 `setEnableChangeState(true)`。 | TypeSquirrel 说明较泛，最终锁定/解锁时机和动作表现需实机。 |

## 动作与帧窗口

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_GetCurrentAni()` | 取当前动画对象。 | 只能证明当前动画可读，不能直接说明动作名。 |
| `IRDSQRCharacter.sq_GetCurrentFrameIndex(pAni)` | 读取当前动画帧索引。 | 帧级窗口需要结合 `.chr [etc motion]`、`.ani` 和实机节奏。 |
| `sq_GetAnimationFrameIndex(ani)` / `sq_GetCurrentTime(ani)` | 读取动画帧号和当前动画时间。 | 常用于 PO `procAppend` 的时间/帧控制；实际节奏和同步需实机。 |
| `sq_GetFrameStartTime(animation, frameIndex)` | 读取指定动画帧的开始时间；ChainLightning 用它推导 cast gauge 时间。 | 必须先确认当前动画和目标帧是否闭合；帧号越界返回不可静态推断。 |
| `sq_SetFrameDelayTime(animation, frameIndex, delayTime)` | 改写指定动画帧延迟；FireRoad 用静态施放时间改 CAST1 第 0 帧 delay。 | 动作实际耗时、读条、取消和同步仍需实机；帧号必须由当前动画闭合。 |
| `sq_StartDrawCastGauge(obj, time, bool)` / `sq_EndDrawCastGauge(obj)` | 开始/结束技能施放读条绘制。 | 只证明脚本调用读条接口；读条显示、取消和施放窗口需实机。 |
| `IRDSQRCharacter.sq_CreateCNRDAnimation(path)` / `sq_AddStateLayerAnimation(layer, ani, x, y)` | 创建动画对象并添加到状态层。 | 只证明脚本引用视觉层；客户端资源完整性和实际显示需另验。 |
| `IRDSQRCharacter.sq_SetCurrentAnimation(animationIndex)` | 设置角色当前自定义动画索引。 | `animationIndex` 必须由当前 `.chr [etc motion]` 闭合，不能跨职业硬套。 |
| `CNRDAnimation.setAttackBoundingBoxSizeRate(sizeRate, bool)` | 设置当前动画攻击盒缩放；DarkChange START 段按 level data 的范围倍率缩放当前角色动画攻击盒。 | 角色动画缩放的命中范围、还原时序、中断路径和同步需实机；不要和 PO 场景的全局 `sq_SetAttackBoundingBoxSizeRate(...)` 混淆。 |
| `sq_CreateAnimation(name, aniRoute)` / `sq_DeleteAni(animation)` | 创建或删除独立 Ani 动画对象。 | 常见于 appendage 视觉层；资源是否存在、显示层级和残留需客户端资源链或实机。 |
| `sq_SetAnimationFrameIndex(animation, index)` / `sq_SetAnimationCurrentTimeByFrame(animation, frameIndex, bool)` / `sq_AnimationProc(ani)` / `sq_drawCurrentFrame(ani, x, y, isFlip)` | 设置动画帧号或跳到目标帧、推进动画并绘制当前帧。 | 只证明绘制调用形状；实际位置、翻转、遮挡和同步需实机。 |
| `IRDSQRCharacter.sq_SetCurrentTimeByFrame(animation, frameIndex)` | 把当前动画时间跳到指定帧；IceSwordEx 非 PVP 分支用它把当前动画回卷到 frame 0。 | 回卷后的攻击盒、命中列表、动作节奏、取消窗口和同步必须实机。 |
| `isCurrentCutomAniIndex(index)` | 常用于动作级窗口限制。 | `index` 必须来自目标 `.chr [etc motion]` 对应项。 |
| `sq_SetCurrentPos(obj, x, y, z)` | 设置对象当前 X/Y/Z 坐标。 | MagicCannon 用于按 state 包恢复释放位置；最终位置、落地和同步必须实机。 |
| `IRDSQRCharacter.sq_SetStaticSpeedInfo(...)` / `sq_SetStaticMoveInfo(...)` / `sq_SetMoveDirection(...)` / `sq_SetZVelocity(...)` | 设置角色动作速度、移动参数、移动方向和 Z 轴速度。 | TypeSquirrel 可查到接口；具体位移、摩擦、反向输入、落地和同步必须实测。 |

## Appendage

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `CNSquirrelAppendage.sq_IsAppendAppendage(obj, path)` | 判断对象是否已有指定 appendage。 | `path` 是 `sqr/` 下相对路径语境。 |
| `IRDActiveObject.GetSquirrelAppendage(path)` | 按 `sqr/` 下相对路径获取指定 appendage。 | 返回对象是否存在、是否有效和是否过期必须看运行上下文。 |
| `CNSquirrelAppendage.sq_GetAppendage(obj, path)` / `sq_RemoveAppendage(obj, path)` | 读取或移除指定 appendage。 | 只能说明目标路径 appendage 可被查找/移除；是否存在和是否有效必须看当前运行上下文。 |
| `CNSquirrelAppendage.sq_AppendAppendage(parent, source, skillIndex, stackable, path, valid)` | 追加 appendage；PowerOfDarkness 对被击目标追加 `ap_PowerOfDarkness.nut`，Gunner 被动回调用它追加 `ap_gunner_comminterrupt.nut`。 | `skillIndex=-1` 可作通用挂载；具体生命周期、重复挂载、死亡清理和触发频率需按目标链或实机确认。 |
| `CNSquirrelAppendage.sq_GetSkillIndex()` | appendage 读取自身绑定的技能 ID；`ap_atmage_effect.nut` 用它区分 FlameCircle 与 BrokenArrow 视觉效果。 | 技能 ID 只说明 appendage 创建时绑定的上下文，不证明效果一定显示或攻击生效。 |
| `IRDAppendage.setValid(enable)` | 设置 appendage 是否有效；通用视觉 appendage 在淡出完成后设为无效。 | 失效时机、残留和多人表现需实机或资源链检查。 |
| `appendage.sq_AddFunctionName("proc", "...")` | 给 appendage 注册 proc 回调名；Gunner comminterrupt 用它把 `proc` 绑定到自定义函数。 | proc 频率和对象有效性要在脚本内防护。 |
| `CNSquirrelAppendage.sq_AddEffectFront(Anipath)` | 给 appendage 添加人物前景动画效果。 | 只证明接口和引用路径；动画资源、显示层级和残留需资源链或实机。 |
| `CNSquirrelAppendage.sq_DeleteEffectFront()` / `sq_GetFrontAnimation(index)` | 删除或读取 appendage 前景动画；IceRoad CS appendage 用于切换收尾视觉并判断动画结束。 | 视觉层生命周期不等于异常状态生命周期；资源显示和残留需实机或资源链。 |
| `CNSquirrelAppendage.sq_SetValidTime(time)` | 设置 appendage 有效时间。 | TypeSquirrel 标注为毫秒；刷新、提前失效和跨图表现需实机。 |
| `IRDAppendage.getAppendageInfo()` / `IRDAppendage.setValidTime(time)` | 取得 appendage 信息对象并设置有效时间；LightningWall onAttack 追加 appendage 后使用该形状。 | 有效期刷新、重复挂载、提前失效、死亡清理和同步需实机。 |
| `CNSquirrelAppendage.sq_AppendAppendageID(appendage, obj, source, apid, flag)` | 给 appendage 绑定自定义 APID。 | APID 是否冲突、唯一性和刷新规则需目标链核验。 |
| `CNSquirrelAppendage.sq_AddChangeStatusAppendageID(sourceObj, targetObj, time, changeStatus, isPercent, value, apId)` | 给 appendage 添加 change status 项；IceRoad PO 的 skill effect 接收端用于移动速度变化，Burster appendage 用于攻速/移速/施放速度变化。 | 作用对象、APID、叠加、刷新和最终数值必须按目标链和实机验证。 |
| `CNSquirrelAppendage.sq_Append(appendage, obj, source, isBuff)` | 将 appendage/change status 追加到对象。 | 是否作为 buff、生效对象和生命周期必须看调用上下文。 |
| `CNSquirrelAppendage.setBuffIconImage(index)` / `setEnableIsBuff(enable)` | 设置 buff 图标与 buff 显示开关。 | 图标资源、UI显示和持续时间表现需实机或资源链检查。 |

## 对象与场景检查

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `sq_GetCNRDObjectToSQRCharacter(obj)` | 将基础对象转换为 SQR 角色对象。 | 转换后才可调用角色技能 API；失败或空对象要在脚本中防护。 |
| `sq_ObjectToSQRCharacter(obj)` | 将基础对象转换为人物对象；HolongLight 的 PO 超时清理用它把顶层对象转回角色并移除 skill-load。 | 转换结果是否有效取决于运行时对象类型和生命周期；失效对象需实机确认。 |
| `sq_getGrowType(obj)` | 获取人物转职职业编号。 | 编号必须按当前职业脚本和目标技能适配核验，不能只靠展示名称猜。 |
| `sq_IsTowerDungeon()` | 判断当前是否在塔类地下城。 | 只能作为场景条件；塔类之外的特殊副本仍需另查。 |
| `CNRDObject.getObjectManager()` / `CNRDObjectManager.getCollisionObjectNumber()` / `getCollisionObject(index)` | 取得对象管理器并枚举碰撞对象；BlueDragonWill 的公共目标搜索函数用它扫描候选目标。 | 枚举顺序、目标生命周期、性能和联机一致性不能静态证明。 |
| `IRDCollisionObject.isEnemy(obj)` / `isInDamagableState(obj)` / `CNRDObject.isObjectType(objectType)` / `IRDActiveObject.isDead()` | 判断候选对象是否敌对、可受伤、是否 active、是否死亡；BlueDragonWill 的 `findAngleTarget` 用作过滤条件。 | 过滤成功不等于最终锁定、命中或伤害；特殊免疫、离场、死亡边界必须实机。 |
| `IMouse.GetXPos()` / `IMouse.GetYPos()` | 读取鼠标屏幕坐标；CreatorMage Mgrab 用它找鼠标下目标，WindPress PO 用它计算指向。 | TypeSquirrel 语义检索可见候选签名，但直接定义查询未闭合；坐标系、缩放、UI 遮挡和实战手感需实机。 |
| `stage.getMainControl().IsLBDown()` / `IsRBDown()` | 读取主控制输入；WindPress 用左键维持，Mgrab 用右键拖动/松手分支。 | 当前只按主目标脚本实见记录，不写成完整输入 API 手册。 |
| `objectManager.getFieldXPos/getFieldYPos/getFieldZPos(...)` | 把鼠标屏幕坐标换成场景坐标；CreatorMage Mgrab/WindPress 用于目标拖动与指向。 | 地图层、Z 轴、可移动位置、边界裁剪和同步需实机。 |

## PassiveObject 与动态攻击包

| API | 最低含义 | 写入边界 |
| --- | --- | --- |
| `IRDSQRCharacter.sq_SendCreatePassiveObjectPacket(index, level, x, y, z, direction)` | 创建 passiveobject。 | `index` 必须注册；坐标、可见性和命中必须实机。 |
| `IRDSQRCharacter.sq_GetPassiveObject(index)` | 角色按 passiveobject index 找回运行中的 PO；ChainLightning 用于读取 `24241` 的运行变量。 | 返回对象是否存在取决于创建、销毁和当前同步状态；必须做空对象防护。 |
| `IRDCollisionObject.getMyPassiveObjectCount(poIndex)` / `getMyPassiveObject(poIndex, arrayId)` | 枚举并取回自己创建的 passiveobject；LightningWall 用于给 `24218` 广播 move/destroy state，HolongLight 用于找到已有 `24222` 并命令其射出。 | 返回对象数量和状态取决于运行时创建/销毁；必须做空对象防护，状态同步需实机。 |
| `sq_SendCreatePassiveObjectPacketPos(obj, index, level, X, Y, Z)` | 按地图坐标创建 passiveobject；WindPress 用它创建 `24355`。 | 创建者、坐标、目标有效性和同步需实机；`index` 仍走 `passiveobject.lst`。 |
| `CNRDSkill.setSealActiveFunction(enable)` | 设置技能 on/off 状态；IceRoad 追加主 appendage 后把技能设为 off。 | UI 表现、再次施放、冷却、失败恢复和服务端一致性需实机。 |
| `sq_SendCreatePassiveObjectPacketFromPassivePos(obj, index, level, X, Y, Z)` | 从 PO 坐标语境创建另一个 passiveobject；ChainLightning 的 `24241` 用它创建 `24242`。 | `obj` 是 PO；`index` 仍走 `passiveobject.lst`；坐标和同步需实机。 |
| `IRDSQRCharacter.sq_StartWrite()` | 开始向 PO 的 `receiveData` 写入数据。 | 必须与随后创建的 PO 和读取端顺序闭合。 |
| `IRDSQRCharacter.sq_WriteDword(value)` / `sq_WriteWord(value)` / `sq_WriteByte(value)` / `sq_WriteBool(value)` | 向 PO `receiveData` 写入 4 字节 / 2 字节 / 1 字节 / 布尔值。 | 写入顺序和读取顺序必须一致；`byte/bool` 值仍按目标脚本语义解释，不能凭宽度猜字段。 |
| `IRDSQRCharacter.sq_WriteFloat(value)` | 向 PO `receiveData` 写入浮点数。 | 读取端顺序必须一致；常用于角度、倍率等非整数参数。 |
| `sq_BinaryStartWrite()` / `sq_BinaryWriteWord(value)` / `sq_BinaryWriteFloat(value)` / `sq_BinaryWriteDword(value)` | 全局二进制写包，常用于创建 PO 前传递参数；FlameCircle 用 word/float/float/dword 传旋转次数、半径、速度和攻击倍率。 | 读取端顺序必须闭合；`receiveData.readWord/readFloat/readDword` 当前只按目标脚本实见记录。 |
| `sq_BinaryWriteByte(value)` / `sq_BinaryWriteWord(value)` / `sq_BinaryWriteFloat(value)` | 全局二进制写包的 byte、word、float 写入形态。 | 目标读取端必须按同样顺序和宽度读取；宽度不能凭字段名猜。 |
| `sq_BinaryGetReadSize()` | 读取当前二进制包已读大小。 | 常与 `receiveData.getSize()` 做剩余数据判断；当前只按目标脚本实见记录。 |
| `sq_GetGlobalIntVector()` / `sq_IntVectorClear(vector)` / `sq_IntVectorPush(vector, value)` | 获取、清空并写入全局整数向量；可作为 PO state packet 的数据载体。 | 写入顺序必须和 `setState` 读取顺序一致；不能与角色自身 `sq_IntVectPush` 混淆。 |
| `IRDCollisionObject.addSetStatePacket(subState, data, state, isSend, name)` | 给碰撞对象/PO 添加状态包；ChainLightning 24241 用于推进 state 10/11。 | 参数名容易误读，按目标脚本实见解释；状态覆盖和同步需实机。 |
| `CNSquirrelPassiveObject.sq_GetParentState()` / `sq_GetParentSkillSubState()` | PO 读取创建者当前 state 或技能 substate；FireRoad PO 用它等待父技能 CAST2。 | 父对象状态会随运行时变化；只能按目标脚本闭合等待条件，不能静态证明最终时序。 |
| `CNRDPassiveObject.getParent()` / `getTopCharacter()` | PO 取父对象或顶层角色；FlameCircle 24244 用顶层角色判断父角色是否仍在 FlameCircle state，HolongLight 用父对象跟随、用顶层角色清理 skill-load。 | 父角色失效、离场、状态切换和同步都必须实机确认。 |
| `CNSquirrelPassiveObject.sq_FindFirstTarget(startX, endX, yRange, zRange)` / `sq_FindNextTarget(activeTarget, nextXRange, zRange)` | 在范围内找首目标或下一个目标。 | TypeSquirrel 只证明函数形状；目标优先级、随机性、去重和免疫过滤需实机。 |
| `sq_GetObjectId(obj)` / `sq_GetObjectByObjectId(parent, objectId)` | 把对象转成局内 id，再按 id 找回对象。 | 目标销毁、离场、死亡或跨同步帧时返回结果需实机确认。 |
| `sq_GetCNRDObjectToActiveObject(obj)` | 将基础对象转换为活动对象；BlueDragonWill 的 `findAngleTarget` 用它把候选碰撞对象转成 active object 后检查死亡状态。 | 只在目标确实是 active object 时可靠；转换失败必须防护。 |
| `IRDSQRCharacter.callBackAllObject(...)` | 目标脚本用于回调指定类型对象；DarkChange 非 PVP 分支回调 `OBJECTTYPE_ACTIVE` 后自行判断屏幕碰撞和敌对关系。 | TypeSquirrel 签名/注释较弱，本词典只按目标脚本实见记录；对象范围、调用频率、同步和性能需实机。 |
| `sq_CreatePooledObject(ani, autoDestroy)` / `sq_AddObject(parent, child, childType, bool)` | 创建绘制对象并挂到父对象；ChainLightning 用 `OBJECTTYPE_DRAWONLY` 添加闪电线，FrozenLand 用它添加 shockwave、爆炸水柱和水波视觉。 | draw-only 是视觉对象语境；动画攻击盒不等于实际命中来源。 |
| `sq_AddDrawOnlyAniFromParent(obj, aniRoute, x, y, z)` / `sq_ChangeDrawLayer(obj, drawLayer)` | 从父对象创建 draw-only 动画对象并调整绘制层；LightningWall 用于 wall 子视觉、floor/electric mark 和 appendage 电击视觉。 | draw-only 是视觉链路，不证明攻击来源；资源存在、层级和残留需资源链或实机。 |
| `sq_SetEnumDrawLayer(obj, drawLayer)` | 设置绘制图层类型；FrozenLand 的 shockwave draw-only 创建函数用它把对象设到底层。 | TypeSquirrel 警告不要对已实例化对象使用；这里只记录目标脚本调用形状，显示结果需实机。 |
| `setCurrentAnimationFromCutomIndex(obj, index)` | 从自定义索引设置对象动画。 | 函数名原文为 `Cutom`；索引语义必须按当前对象的自定义动画体系核。 |
| `sq_GetCurrentAnimation(obj)` | 获取对象当前动画。 | 只说明动画对象可取，不证明资源存在或显示正常。 |
| `CNRDAnimation.setSpeedRate(rate)` / `IRDSQRCharacter.sq_SetAnimationSpeedRate(ani, rate)` | 设置动画播放速度倍率。 | 手感、帧事件时序和同步需要实机。 |
| `CNRDAnimation.setImageRate(width, height)` / `setImageRateFromOriginal(w, h)` / `setAutoLayerWorkAnimationAddSizeRate(rate)` | 设置 PO 图片和自动层级动画缩放；FlameCircle 用 `setImageRate` 缩放旋转火环主动画和子视觉。 | 视觉缩放不等于攻击范围一定同步。 |
| `sq_SetAttackBoundingBoxSizeRate(currentAni, xRate, yRate, zRate)` | 设置 PO 动画攻击盒缩放。 | 静态只读不能证明实机命中范围；非 PO 场景不要硬套。 |
| `sq_GetUniformVelocity(start, final, current, useTime)` / `sq_GetDistancePos(start, direction, target)` / `sq_setCurrentAxisPos(obj, axis, pos)` | 用时间计算位移并设置对象坐标；FrozenLand Pole 收回中心时用匀速半径变化和轴坐标更新。 | 轨迹、碰撞、销毁时序和同步必须实测。 |
| `sq_GetDistanceObject(obj, target, bool)` | 计算主对象到目标对象的距离；TypeSquirrel 注释提示 Y 轴按特定比例折算，BlueDragonWill 目标搜索用它比较最近目标。 | 第三个参数和距离权重只按目标脚本实见记录；锁定优先级和手感需实机。 |
| `sq_CosTable(angle)` / `sq_SinTable(angle)` | 按角度取余弦/正弦；FrozenLand Pole 用它把角度和半径换成环绕 X/Y。 | 角度单位、取整、Y 轴压缩和最终轨迹按目标脚本记录，实际手感需实机。 |
| `sq_GetAniRealImageSize(ani, rect)` | 读取动画真实图片尺寸；FrozenLand MagicCircle 用它估算半径大小。 | TypeSquirrel 对 `rect` 宽/高含义标注不确定；不能写成固定换算公式。 |
| `sq_GetShuttleValue(min, max, currentTime, term)` / `sq_GetObjectTime(obj)` | 读取对象存在时间并计算循环往复值；LightningWall appendage 用于目标 Z 小范围往复，HolongLight BUFF 火球用对象时间做跟随偏移，PieceOfIce core 用对象时间做震动/浮动坐标。 | 实际浮动、卡肉、目标状态和同步不能静态证明。 |
| `sq_GetAccel(start, final, current, useTime, bool)` | 计算从起始值逐渐靠近目标值的加速变化值；HolongLight BUFF 火球用它靠近父角色位置。 | 轨迹手感、阻挡、卡顿和同步不能静态证明。 |
| `IRDSQRCharacter.sq_SetfindNearLinearMovablePos(...)` | Teleport 用候选目标点、当前位置和半径参数尝试设置临近线性可移动位置。 | TypeSquirrel 注释不够具体；绕障、阻挡、hold 状态、最终落点和同步必须实测。 |
| `IRDSQRCharacter.sq_SetCameraScrollPosition(XPos, YPos, Uk)` | 设置镜头滚动位置。 | Teleport 用于本机镜头基准；实际镜头手感和联机表现需实机。 |
| `sq_GetCurrentAttackInfo(obj)` | 获取当前 AttackInfo。 | 只说明可拿到当前攻击数据，不证明这次攻击一定命中。 |
| `IRDSQRCharacter.sq_SetApplyConversionSkill()` / `IRDSQRCharacter.sq_setCustomHitEffectFileName(path)` | IceSword 切换当前 AttackInfo 后调用转换接口，并设置自定义命中特效路径。 | TypeSquirrel 对转换接口注释较弱；这里只记录目标脚本调用形状，转换、命中特效和资源完整性需实机或资源链。 |
| `CNRDPassiveObject.getDefaultAttackInfo()` | 获取 PO 默认攻击信息。 | 常与 `sq_SetCurrentAttackInfo` 配合；不证明最终命中。 |
| `sq_GetCustomAttackInfo(obj, etcAttackNum)` | 获取对象自定义/附加攻击信息；FireRoad PO 用于从初始攻击包切到第二段攻击包。 | `etcAttackNum` 必须和目标 `.obj` 的攻击信息槽位闭合；命中和伤害仍需实机。 |
| `sq_SetCurrentAttackInfo(obj, attackInfo)` | 设置对象当前攻击信息。 | 只证明当前攻击数据可替换；命中和伤害仍需实机。 |
| `sq_SetCurrentAttackBonusRate(attackInfo, value)` | 设置当前百分比攻击力。 | 静态只读不能证明最终伤害。 |
| `sq_SetCurrentAttackPower(attackInfo, value)` | 设置当前独立攻击力。 | 静态只读不能证明最终伤害。 |
| `sq_SetCurrentAttacknUpForce(attackInfo, value)` | 设置当前攻击浮空力。 | 静态只读不能证明实机浮空表现。 |
| `sq_SetChangeStatusIntoAttackInfo(attackInfo, 0, status, rate, level, time)` | 向攻击信息写入异常状态参数。 | 异常是否触发、抗性、等级、持续时间和 PVP 规则必须实测。 |
| `sq_SetAddWeaponDamage(attackInfo, bool)` | 设置攻击信息是否使用武器伤害加成。 | 只证明脚本写攻击包字段；最终伤害、面板、服务端和 PVP 规则必须实测。 |
| `sq_SetCurrentAttackeDamageAct(attackInfo, damageAct)` | 设置当前攻击的受击反馈模式。 | 僵直、倒地、卡肉和抗性表现不能静态证明。 |
| `AttackInfo.setAttackType(...)` / `AttackInfo.setElement(element)` | 设置攻击信息的攻击类型和元素。 | TypeSquirrel 对 `setAttackType` 参数说明较弱；只按目标脚本实见记录，不写成完整手册。 |
| `sq_SetChangeStatusIntoAttackInfoWithEtc(attackInfo, 0, status, prop, level, validTime, unknown2, unknown3)` | 向攻击信息写入带额外参数的异常状态；LightningWall 用于写入触电概率、等级、持续时间和触电攻击力。 | 概率、等级、额外参数语义、抗性、PVP 和最终触发不能静态证明。 |
| `sq_SetCurrentAttackeHitStunTime(attackInfo, stunTime)` | 设置攻击命中后的强制僵直时间；LightningWall 把该值设为 `0`。 | 只证明攻击包字段被写入；实际僵直、卡肉和抗性表现需实机。 |
| `sq_SendHitObjectPacketByAttackInfo(obj, damager, newAttackInfo)` | 发送带 AttackInfoPacket 的附加攻击。 | 只证明脚本尝试发送攻击包；是否命中、伤害多少、是否同步必须实测。 |
| `sq_SendHitObjectPacket(obj, enemy, hintXPos, hintYPos, hintZPos)` | 向目标发送一次命中包；ChainLightning 24242 用于即时和多段命中。 | 命中、伤害、卡肉、击退、浮空、PVP 和同步必须实机确认。 |
| `sq_sendSetActiveStatusPacket(damager, parentObj, status, rate, level, bool, time)` | 向目标发送异常状态包。 | 概率、等级、持续时间、抗性、免疫和 PVP 规则不能静态证明。 |
| `sq_CreateChangeStatus(type, isPercent, value, validTime)` / `sq_RemoveChangeStatus(obj, apid)` | 创建或移除能力/抗性变化；HolongLight BUFF 火球用它创建防御提升对象。 | 只证明状态变化对象可创建/移除；最终数值效果需实机。 |
| `CNSimpleChangeStatus.sq_AddChangeStatus(...)` / `CNSimpleChangeStatus.sq_Append(ap, obj1, obj2, isBuff)` | 给 change status 追加其他状态项，并把状态对象挂入 appendage/目标对象；HolongLight 用于物防/魔防提升链。 | TypeSquirrel 对重载说明较泛；对象归属、叠加、失效和 Buff UI 需实机。 |
| `CNRDAnimation.setEffectLayer(...)` / `sq_RGB(r, g, b)` / `sq_ALPHA(value)` | 给动画层设置图形效果、颜色和透明度。 | Teleport bodyeffect 用于 LINEARDODGE 体效；实际装扮图层、遮罩和残留需资源链或实机。 |
| `sq_flashScreen(obj, startTime, existTime, endTime, visibility, rgba, graphicEffect, drawLayer)` / `sq_EffectLayerAppendageOnlyBody(obj, rgba, visible, startTime, time, endTime)` / `sq_EffectLayerAppendage(obj, rgb, alpha, beginTime, limitTime, endTime)` | 设置闪屏、人物身体层效果或目标图形层效果；LightningWall 释放中使用闪屏/身体层，IceSword 命中后给目标追加蓝色视觉层。 | 只证明视觉接口调用；显示、层级、残留和多人表现需实机或资源链。 |
| `sq_AniLayerListSize(animation)` / `sq_getAniLayerListObject(animation, layer)` | 读取动画图层数量并获取指定图层对象。 | 图层存在、装扮资源和显示顺序不能静态证明。 |
| `sq_ToRadian(angle)` / `sq_SetCustomRotate(obj, angle)` | 角度转弧度并设置对象旋转；PieceOfIce shard 用水平角度派生视觉旋转。 | 视觉方向、攻击方向和同步不能靠静态只读证明。 |
| `IRDSQRCharacter.sq_SetShake(obj, power, time)` / `sq_SetShake(obj, power, time)` / `sq_SetMyShake(obj, shakeRate, shakeTime)` | 设置屏幕震动或本机可见震动；FlameCircle 爆炸段使用角色成员 `sq_SetShake`。 | 震动幅度、持续感、是否全局/本机和多人表现需实机。 |
| `sq_GetGroup(obj)` / `sq_GetUniqueId(obj)` / `sq_GetObject(parent, group, id)` | 记录并按 group/id 找回目标对象。 | 目标死亡、销毁、离场或同步状态下是否有效需要实机。 |
| `sq_GetCNRDObjectToCollisionObject(obj)` / `sq_AddHitObject(obj, colObj)` | 转换碰撞对象并标记为已命中过；FlameCircle 的 PO 和爆炸段都会用 `sq_AddHitObject` 标记目标。 | 不能静态证明重复命中、最终伤害或异常目标边界。 |
| `IRDCollisionObject.resetHitObjectList()` | 重置攻击命中对象列表，常用于多段伤害；FlameCircle PO 每轮旋转推进后调用。 | 多段命中节奏、目标过滤、PVP 和同步必须实机确认。 |
| `sq_IsHoldable(obj, damager)` / `sq_IsGrabable(attacker, damager)` / `sq_IsFixture(obj)` | 判断目标是否可控制、可抓取或是否为 fixture；LightningWall onAttack 用作追加 appendage 条件。 | 目标类型、免疫、PVP 和服务端判定必须实机确认。 |
| `sq_IsValidActiveStatus(obj, activeStatus)` | 判断对象是否处于指定异常状态；IceRoad CS appendage 检查 `ACTIVESTATUS_SLOW`。 | 当前目标脚本相关分支部分注释；异常实际存在、刷新和结束时机需实机。 |
| `sq_HoldAndDelayDie(...)` | 变参 API；PowerOfDarkness 把它和 appendage 一起用于 onAttack 抓取/控制链。 | TypeSquirrel 对该 API 注释不可靠；只记录目标脚本调用形状，不写完整控制语义。 |
| `EventTimer.setParameter(interval, count)` / `resetInstant(initDelay)` / `isOnEvent(time)` | 设置并查询事件 timer；ChainLightning 24242 用它控制多段 hit packet。 | timer 精度、帧率、卡顿和联机同步不能静态证明。 |
| `CSQCommonVarlist.get_timer_vector(index)` / `CNTimer.Get()` / `CNTimer.Start(...)` | 从变量表取 timer 并读取/启动计时；FrozenLand 角色 substate 2 和 Pole 状态使用。 | `initGetVarTimer` 定义当前未在目标 NUT 或 TypeSquirrel 中闭合；时间推进和同步需实机。 |
| `CSQCommonVarlist.GetparticleCreaterMap(name, path, obj)` / `sq_AddParticleObject(obj, particleCreater)` | 获取粒子创建器并附加粒子；FrozenLand MagicCircle 用于 ice fog 粒子。 | 只证明粒子调用形状；资源存在、层级、残留和多人表现需资源链或实机。 |
| `CNSquirrelAppendage.sq_getAuraMaster(name)` / `sq_AddAuraMaster(...)` / `CNAuraMasterAttract.setAttractionInfo(...)` | 取得或添加 aura master 并设置吸附参数；FrozenLand MagicCircle 用于 `frozenAura`。 | TypeSquirrel 对 aura 参数说明弱；吸附目标过滤、免疫、范围、强度和同步必须实机。 |
| `sq_SetPause(obj, PAUSETYPE_OBJECT, pauseTime)` | 设置对象暂停状态；FireRoad PO 用接收包中的 pauseTime 控制等待。 | 暂停实际体感、动画推进和同步不能静态证明。 |
| `CNSquirrelPassiveObject.sq_SetMaxHitCounterPerObject(hitCount)` | 设置单个 PO 的最大攻击计数；FireRoad PO 从接收包读取 maxHit。 | 只证明命中计数字段可设置；最终命中次数、目标过滤和 PVP 需实机。 |
| `sq_GetDistance(...)` / `sq_Atan2(...)` / `sq_SetfRotateAngle(...)` / `CNRDAnimation.setImageRate(...)` / `sq_Cos(...)` / `sq_Sin(...)` | 计算距离、角度、旋转和缩放；ChainLightning 用于把 draw-only 闪电线对齐到目标，CreatorMage WindPress PO 用于按鼠标方向旋转并缩放动画。 | 只证明几何计算；不证明攻击范围、命中判定或手感。 |
| `sq_ClearAttackBox(animation)` / `sq_AddAttackBox(animation, x, y, z, w, h, d)` | 清空并重建动画攻击盒；CreatorMage WindPress PO 按旋风波方向生成多段攻击盒。 | 攻击盒最终覆盖、目标过滤、PVP 和同步必须实机。 |
| `sq_FindShootingTarget(...)` / `sq_GetShootingHorizonAngle(...)` / `sq_GetShootingVerticalAngle(...)` | 查找射击目标并计算射击角度；HolongLight 创建火球前用它写入水平/垂直角度。 | TypeSquirrel 对 horizon angle 返回标注和目标脚本用法不完全一致；目标选择、空目标、角度手感和同步需实机。 |
| `sq_getRandom(min, max)` | 返回随机整数；PieceOfIce 用于 shard 数量、shard 外观和水平/垂直角度取样。 | 随机分布、端点是否包含、PVP 修正和联机一致性不能静态证明。 |
| `IRDCollisionObject.sendStatePacket(state, value)` | 给碰撞对象发送 state 与一个整数值；PieceOfIce 角色脚本把 keyframe flagIndex 传给 core 的 DAMAGE state。 | `value` 的含义必须按接收端 `setState` 读取闭合；状态包时序和同步需实机。 |
| `sq_CreateDrawOnlyObject(obj, aniRoute, drawLayer, bool)` | 创建 draw-only 视觉对象；PieceOfIce 在 core 上创建 shard 视觉。 | draw-only 不提供攻击来源；资源、层级、残留需资源链或实机。 |
| `CNRDAnimation.addLayerAnimation(layer, ani, bool)` | 给当前动画追加图层动画；PieceOfIce shard 用于追加 dodge 视觉层。 | 图层只证明视觉追加，不能推出命中或攻击盒。 |
| `CNRDAnimation.setCurrentFrameWithChildLayer(frameID)` | 设置当前帧并同步子图层；PieceOfIce core 用 `flagIndex + 3` 切 DAMAGE 帧，END 切 frame 10。 | frame ID 边界、越界处理、子图层同步和实机显示必须运行确认。 |
| `IRDActiveObject.isMovablePos(XPos, YPos)` | 判断指定坐标是否可移动；PieceOfIce shard 在不可移动位置进入 EXPLOSION。 | 地图碰撞、阻挡、落点和爆裂时序不能静态证明。 |
| `sq_ObjectToSQRCharacter(obj)` / `IRDSQRCharacter.sq_GetBonusRateWithPassive(skill, state, levelDataIndex, rate)` | 把对象转为角色并读取含被动修正的攻击倍率；PieceOfIce shard 用它读取本技能攻击倍率。 | 被动最终叠加、父对象异常、命中和最终伤害需实机。 |
| `CNRDObject.setValid(false)` | 将对象设为无效；ChainLightning 收尾时用于禁用 draw-only 闪电线。 | 对象彻底移除、残留和同步表现需实机或资源链检查。 |
| `sq_SendDestroyPacketPassiveObject(obj)` | 在 PO 脚本中销毁自身。 | 销毁时序、同步和残留效果必须实机确认。 |
| `sq_SetStartCoolTime(chr, unknown, intVector)` | Burster appendage onStart 用它写入 Burster 与禁用技能列表相关冷却信息。 | TypeSquirrel 当前未闭合完整语义；冷却 UI、服务端一致性和 PVP 修正需实机。 |
| `IRDCollisionObject.sendStateOnlyPacket(state)` | 给碰撞对象发送只含 state 的状态包；MagicCannon PO 用它从创建动画切到 SHOOT。 | 状态切换时序、是否丢包和同步表现必须实机。 |
| `CNSquirrelPassiveObject.sq_SetMoveParticle(path, horizonAngle, verticalAngle)` | 给 PO 设置移动粒子路径和角度；PieceOfIce shard 使用移动粒子飞行。 | 资源存在、方向显示、轨迹、层级和残留需资源链或实机。 |
| `sq_SetSpeedToMoveParticle(obj, moveType, speed)` / `CNSquirrelPassiveObject.sq_RemoveMoveParticle()` | 设置移动粒子指定轴速度，并在收尾时移除移动粒子；LightningWall move/destroy 阶段使用。 | 轨迹、阻挡、粒子资源、销毁时序和同步需实机或资源链。 |
| `sq_getNewAttackInfoPacket()` | 新建攻击信息数据包。 | 只是数据包容器，需要补足参数。 |
| `sq_createCommonElementalAttack(obj, elementalType, xPos, yPos, zPos, newAttackInfo)` | 用攻击包创建属性攻击。 | 元素类型、命中率、伤害、同步和 PVP 都不能靠静态只读证明。 |

## 目标脚本回调参数

| 形式 | 最低含义 | 写入边界 |
| --- | --- | --- |
| `setCustomData_*(obj, receiveData)` | PO NUT 中常见的自定义数据回调形状。 | 是否被调用取决于 PO 注册和创建包链路。 |
| `receiveData.readDword()` / `receiveData.readWord()` / `receiveData.readFloat()` / `receiveData.getSize()` | 在 WindStrike、CrystalAttack、WaterCannon、ElementalChange magic ball、PowerOfDarkness arrow 和 CreatorMage Mgrab/WindPress 链中观察到的读取写包数据方式。 | TypeSquirrel 当前未查到独立内置定义，只能作为目标脚本实见，不写成通用 API 结论。 |
| `getThrowState()` / `getThrowIndex()` / `getThrowElement()` / `setThrowElement(value)` / `setIsCustomSelectSkill(value)` | 在 ElementalChange 的 Throw 选择链中观察到的角色方法。 | TypeSquirrel 当前未查到独立内置定义；只作为当前目标脚本实见，不外推。 |

## 禁止外推

- `ForceUse_Character` 当前不能作为目标 PVF 已确认 API。
- `stuckRate`、`ENUM_ELEMENT_LIGHT` 等参数即使在旧实测中可用，也必须按目标实验重新核验。
- 当前主目标未安装的自定义 PO 链，不能写成当前主目标事实。
