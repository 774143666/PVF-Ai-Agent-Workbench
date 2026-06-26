# Swordman comminterrupt / skill 254 生命周期只读账本

状态：默认可用

用途：记录当前主目标中鬼剑士 `skill 254 / swordman_comminterrupt` 的注册、技能文件、被动入口、appendage 挂接、proc 运行边界和 API 语义。本文只证明静态入口链和脚本参数可读，不证明游戏内一定已学习、一定挂接、一定成功柔化或稳定同步。

## 链路摘要

```text
skill/swordmanskill.lst
-> 254 swordman/swordman_comminterrupt.skl
-> sqr/character/swordman_load_state.nut
-> sqr/character/swordman/passive_skill_swordman.nut
-> ProcPassiveSkill_Swordman(obj, skill_index, skill_level)
-> skill_index == 254 and skill_level > 0
-> CNSquirrelAppendage.sq_AppendAppendage(..., 254, false, "character/swordman/appendage/ap_swordman_comminterrupt.nut", true)
-> appendage proc: proc_appendage_swordman_comminterrupt
-> swordman_comminterrupt(appendage)
```

## 当前主目标已确认

| 项 | 只读结论 | 边界 |
| --- | --- | --- |
| skill registry | `skill/swordmanskill.lst` 中 `254 -> swordman/swordman_comminterrupt.skl` | 必须按鬼剑士 skill registry 解析，不能靠数字外形猜。 |
| 技能名称/类型 | `體術逆改`，类型为 `[passive]` | 被动类型不等于默认已学习。 |
| 等级字段 | `[required level] 1`、`[maximum level] 1`、`[growtype maximum level]` 全为 1 | 只能说明技能文件允许的等级形状。 |
| 适配 growtype | `[skill fitness growtype]` 为 `0 1 2 3 4` | 不证明每个分支都会自动获得该技能。 |
| 角色默认技能 | `character/swordman/swordman.chr` 的默认/转职技能列表未把 `254` 作为已观察默认授予项 | 只能说明 `.chr` 默认技能表不证明 254 已学；可达性详见 `skill-swordman-comminterrupt-reachability`。 |
| load_state 入口 | `swordman_load_state.nut` 推入 `passive_skill_swordman.nut` | 证明职业入口链存在。 |
| 被动挂接条件 | `passive_skill_swordman.nut` 只在 `skill_index == 254` 且 `skill_level > 0` 时追加 `ap_swordman_comminterrupt.nut` | 这是学习状态门槛；静态只读不能证明运行时一定触发该回调。 |
| appendage proc | `ap_swordman_comminterrupt.nut` 注册 `"proc" -> "proc_appendage_swordman_comminterrupt"` | proc 频率、时机和生命周期必须运行验证。 |

## proc 运行边界

`ap_swordman_comminterrupt.nut` 的主流程如下：

| 阶段 | 当前脚本观察 | 边界 |
| --- | --- | --- |
| 对象防护 | 读取 `appendage.getParent()` 与 `appendage.getSource()`；任一缺失则 `appendage.setValid(false)` | 只证明脚本有失效防护。 |
| 角色转换 | `sq_GetCNRDObjectToSQRCharacter(parentObj)` 转为 SQR 角色对象 | API 可查；转换失败行为仍看运行时。 |
| 分支判断 | `type = sq_getGrowType(obj)`，后续 `switch(type)` | `type` 是脚本运行时 growtype 编号。 |
| 场景排除 | `sq_IsTowerDungeon()` 为真则 return | 塔类副本中该 proc 不继续。 |
| 状态排除 | 当前状态为 `3/4/5/9/16/236` 时 return | 这些状态只记录为当前脚本排除列表，不解释每个状态语义。 |
| 技能尝试 | `EnableSoften` 先 `setSkillCommandEnable`；`SetSkillState` 再检查 `sq_IsEnterSkill`、`sq_IsUseSkill`、int vector 与 state packet | 点亮技能不等于成功切 state。 |

## 狂战分支与 Frenzy 门控

| 项 | 当前脚本观察 | 边界 |
| --- | --- | --- |
| 分支 | `switch(type)` 的 `case 3` 下处理狂战相关技能 | `sq_getGrowType(obj)` 的编号是运行时编号；不要拿 `.chr` 的 `[growtype N]` 标签直接替换。 |
| Frenzy registry | `76 -> Swordman/Frenzy.skl`，名称 `血之狂暴 / Frenzy`，类型 `[active]` | 只证明技能注册和技能文件字段。 |
| Frenzy 适配 | `Frenzy.skl` 的 `[skill fitness growtype]` 为 `3` | 与脚本 `case 3` 方向一致。 |
| 脚本变量 | 文件顶部 `STATE_FFRENZY <- 0` | 这是脚本变量，不是直接读取 buff 对象。 |
| 翻转条件 | `if(obj.sq_IsEnterSkill(76) != -1)` 时在 0/1 间翻转 `STATE_FFRENZY` | proc 频率、按键保持、重进图、死亡、换图等场景下是否稳定，静态只读不能证明。 |
| Frenzy 后可柔化目标 | `STATE_FFRENZY` 为真时，启用并尝试 `79 -> state 43/[0]`、`103 -> state 60/[102]`、`81 -> state 45/[0,1]` | 只证明当前脚本参数；成功触发仍受输入、冷却、当前状态和技能条件影响。 |

## TypeSquirrel 已核 API

| API | 最低可用含义 | 本链边界 |
| --- | --- | --- |
| `CNSquirrelAppendage.sq_AppendAppendage(parent, source, skillIndex, stackable, path, valid)` | 追加 appendage，`skillIndex` 可为技能编号或 `-1` | 本链使用 `254` 作为 appendage 关联技能。 |
| `CNSquirrelAppendage.sq_IsAppendAppendage(obj, path)` | 判断对象是否已有指定路径 appendage | 当前 `passive_skill_swordman.nut` 用它给 BloodSword QF appendage 去重，不用于 254 去重。 |
| `appendage.sq_AddFunctionName("proc", funcName)` | 给 appendage 注册 proc 回调函数名 | 只说明回调名注册形状。 |
| `sq_GetCNRDObjectToSQRCharacter(obj)` | 转换为 SQR 角色对象 | 转换后才能调用角色技能 API。 |
| `sq_getGrowType(obj)` | 获取人物转职职业编号 | 编号必须按当前脚本和目标职业链核验。 |
| `sq_IsTowerDungeon()` | 判断是否在塔类地下城 | 本链在塔类地下城直接 return。 |
| `setSkillCommandEnable(skillIndex, true)` | 设置技能命令可用，最低含义是亮技能/启用命令 | 不等于技能成功释放。 |
| `sq_IsEnterSkill(index)` | 判断技能输入/进入状态 | 本链用它做技能输入门槛，也用它翻转 `STATE_FFRENZY`。 |
| `sq_IsUseSkill(index)` | 尝试使用技能并返回是否成功 | 成功后才写 int vector 和 state packet。 |
| `sq_AddSetStatePacket(state, STATE_PRIORITY_USER, true)` | 发送状态切换包；substate 来自 int vector | substate 参数必须来自目标链或实机验证。 |

## 可复用判断

| 需求 | 判断 |
| --- | --- |
| 判断当前主目标是否已有 254 被动文件 | 可以：registry 和 `.skl` 均已闭合。 |
| 判断当前主目标是否已有 254 appendage 文件 | 可以：`ap_swordman_comminterrupt.nut` 存在且被 passive 入口引用。 |
| 判断角色是否默认学会 254 | 不能：当前 `.chr` 默认技能表不证明它已学。 |
| 判断 OutRageBreak 普攻强制是否已安装 | 不能：254 账本只证明 comminterrupt 链，不证明普通攻击专项入口。 |
| 判断 Frenzy 状态变量是否可靠 | 不能：`STATE_FFRENZY` 是脚本变量，必须运行测试。 |
| 复用到其他职业 | 不能直接复用：各职业有各自 comminterrupt `.skl` 和 appendage，必须按各自 skill registry、load_state 和脚本重核。 |

## 下一步验收

1. 运行层：创建或选择鬼剑士角色，确认 `體術逆改` 是否可见/已学/可学，等级是否为 1。
2. 运行层：测试学习 254 前后，`ap_swordman_comminterrupt.nut` 的柔化效果是否出现。
3. 运行层：测试 Frenzy 开关、死亡、换图、进塔类副本后 `STATE_FFRENZY` 是否出现误翻转或失效。
4. 资料层：若实机显示 254 已学但 PVF 可见入口仍找不到，需要另查服务端技能授予资料，且先作为线索处理。
