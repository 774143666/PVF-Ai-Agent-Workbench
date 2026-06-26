# PVF Tag Router - Equipment Set And Effect

用于 equipment 套装、成长、技能加成、触发条件、触发效果、运行时效果和低频硬编码字段的详细标签路由。

使用规则：

- 本文件是标签到 Workbench 入口的详细路由表，不是字段解释正文。
- 字段含义、列形、父块边界和写入风险以路由到的专题索引为准。
- 标签和闭合标签必须按目标 PVF 原样读取；写入前仍需重新核查目标样本。

## Equipment 套装与效果入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[set name]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md` |
| `[set item]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；ID 必须走 equipment registry |
| `[set ability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；套装能力块需逐项验证 |
| `[set item master]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；ID 必须走 equipment registry |
| `[part set index]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；单值关联号，先解析 `etc/equipmentpartset.etc` 的 `[equipment part set]` 记录 |
| `[piece set ability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；首值为所需件数，块内效果逐项读取 |
| `[/piece set ability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；正常样本的能力块闭合标签 |
| `[parameter basic explain]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；套装能力说明文本，不证明效果 |
| `[fullset explain]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；套装说明文本 |
| `[fullset basic explain]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；套装基础说明文本 |
| `[fullset detail explain]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；套装详细说明文本 |
| `[effect part set index]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；单值效果套装关联号 |
| `[reference effect part set index]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；单值参考关联号，运行语义未定性 |
| `[dynamic part set index]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；5 个整数的闭合动态套装列表 |
| `[/dynamic part set index]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[level linear ability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；成长能力块需按上下文读取 |
| `[level section ability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；等级分段能力块需检查闭合 |
| `[maximum level]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；成长或等级相关上限线索 |
| `[room list move speed rate]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；运行语义需验证 |
| `[required skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能 ID 需按职业 registry 解析 |
| `[emancipate]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；输入、输出和说明分开读取 |
| `[/emancipate]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[input]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；改造输入的“ID、数量”对列表 |
| `[/input]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[output]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；改造输出，常见装备 ID 与数量 |
| `[/output]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；正常样本的输出闭合标签 |
| `[emancipate explain]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；仅按 `[emancipate]` 内说明文本读取 |
| `[skill levelup]` | 需验证 | `indexes/skill-levelup.zh-CN.md`；三列一组，职业和 skill registry 必须解析 |
| `[all skill item]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；全技能或范围技能等级加成块 |
| `[item growtype]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能加成块内职业或成长类型限定 |
| `[skill apply condition]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能加成适用条件块需检查闭合 |
| `[skill group]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能组 token 不可直接外推 |
| `[lower bound level]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能等级范围下限 |
| `[upper bound level]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能等级范围上限 |
| `[extra condition]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；额外过滤条件块需检查闭合 |
| `[skill phase]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；技能适用阶段线索 |
| `[skill data up]` | 需验证 | `indexes/skill-data-up-types.zh-CN.md`；`indexes/equipment-bracket-value-tokens.zh-CN.md`；职业和 skill registry 必须解析 |
| `[skill cooltime reset]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；高风险技能冷却重置效果 |
| `[perform skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；高风险触发施放技能效果 |
| `[end skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；职业和 skill registry 必须解析 |
| `[if]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；效果块需闭合验证 |
| `[/if]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应条件块闭合标签 |
| `[then]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；效果块需闭合验证 |
| `[/then]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应效果块闭合标签 |
| `[multiple then]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；多分支效果闭合容器 |
| `[/multiple then]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签，目标存在少量残缺样本 |
| `[then probability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；分支选择权重，不替代 `[probability]` |
| `[module]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；`indexes/equipment-bracket-value-tokens.zh-CN.md`；适用模块 token 闭合列表 |
| `[/module]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[target]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；只说明作用对象 |
| `[probability]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；概率语义需同类样本或实机验证 |
| `[duration]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；持续时间参数需同类样本或实机验证 |
| `[equipment duration]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要直接等同于 `[duration]` |
| `[cool time]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[cooltime]` 互换 |
| `[cooltime]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[cool time]` 互换 |
| `[start cooltime]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；条件侧初始冷却参数 |
| `[pvp]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；PVP 块内效果不能外推到普通地下城 |
| `[command]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；输入命令显示序列闭合块 |
| `[/command]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[attack success]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；攻击成功触发条件 |
| `[event attack success]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[attack success]` 互换 |
| `[attack condition]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；攻击条件需组合读取 |
| `[hit]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；被击或受击触发条件 |
| `[casting]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[cast speed]` 混淆 |
| `[use skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；职业 token 和技能 ID 需解析 |
| `[event use skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；事件型使用技能触发条件 |
| `[use command]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；命令编号和时机需确认 |
| `[time]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；间隔、循环、初始等待三整数条件 |
| `[set my state]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；自身动作状态变化事件条件 |
| `[my state]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；自身动作状态 token 条件 |
| `[target state]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；目标动作状态 token 条件 |
| `[skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；职业 token 与技能 ID 对闭合列表 |
| `[/skill]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；对应闭合标签 |
| `[my appendage]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；ID 走 appendage registry |
| `[after attack]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；攻击后触发条件 |
| `[combo]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；连击数条件需验证 |
| `[change status]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和异常状态效果混淆 |
| `[dungeon check]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；副本数字走 dungeon/map 相关 registry |
| `[target active status]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；条件侧异常状态检查 |
| `[my active status]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；条件侧异常状态检查 |
| `[my active status on]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；异常状态进入事件条件 |
| `[buff]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；buff 枚举需样本和实机确认 |
| `[active status]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；异常状态效果需按状态名读取 |
| `[active status control info]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[active status]` 互换 |
| `[restore]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；正负值都需按块解释 |
| `[stat]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；属性修改需结合目标、持续、概率读取 |
| `[stat by condition]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要直接等同于 `[stat]` |
| `[increase damage]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不要和 `[add absolute damage]` 互换 |
| `[add absolute damage]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；伤害公式和叠加规则需实机验证 |
| `[add absolute defense]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；不能只按字段名判断表现 |
| `[reduce duration to human armor at pvp module]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；PVP 持续时间修正字段 |
| `[reduce probability to human armor at pvp module]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；PVP 概率修正字段 |
| `[appendage]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；appendage / script 闭合需专项验证 |
| `[consume item]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；stackable ID 与数量 |
| `[summon monster]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；monster ID、等级、数量 |
| `[attack success effect animation]` | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；动画数量及重复路径、坐标组 |
| `[cooltime group]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；条件侧冷却分组编号 |
| `[party death]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；队友死亡事件 |
| `[target death]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；攻击目标死亡事件 |
| `[event hit]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；事件型受击条件 |
| `[revive]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；复活事件 |
| `[overkill]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；额外杀伤条件 |
| `[disable pvp]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；PVP 禁用条件 |
| `[is awakening state]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；无值觉醒状态条件 |
| `[remove equip]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；无值解除装备条件 |
| `[attack type]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；物理或魔法攻击类型 |
| `[distance]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；近距或远距条件 |
| `[character]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；职业 token 过滤 |
| `[keep my state]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；保持动作状态与时间 |
| `[my prev state]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；前一个动作状态 |
| `[check damage]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；受击损血阈值 |
| `[skill cooltime]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；剩余冷却比较条件 |
| `[target check]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；类型 token 与 ID 对列表 |
| `[/target check]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；对应闭合标签 |
| `[speech on]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；发言闭合块 |
| `[/speech on]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；对应闭合标签 |
| `[summon apc]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；APC ID、等级、数量 |
| `[skill super armor]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；职业 token 与技能 ID |
| `[skill duration]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；技能运行时属性修改 |
| `[add skill summon]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；技能追加召唤闭合块 |
| `[/add skill summon]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；对应闭合标签 |
| `[all skill item container]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；全技能项根级容器 |
| `[/all skill item container]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；对应闭合标签 |
| `[change status in range]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；资源区间条件 |
| `[apply status in range]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；区间属性变化效果 |
| `[swap stat]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；来源到目标属性转换 |
| `[disenchant]` | 需验证 | `indexes/equipment-runtime-trigger-fields.zh-CN.md`；驱散效果，不是分解 |
| `[thorn]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；反伤强度 |
| `[reduction]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；部位与耐久减少量 |
| `[knockback]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；击退动作 |
| `[ice appendage]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；三整数旧式冰冻光环 |
| `[curse appendage]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；四整数旧式诅咒光环 |
| `[appendage unique]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；唯一 appendage 应用 |
| `[push aside]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；推开相关旧式参数 |
| `[lift up]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；浮空或重力相关参数 |
| `[rigidity]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；僵直或硬直参数 |
| `[hardcoding cooltime]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；硬编码冷却 |
| `[hardcoding parameter]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；闭合硬编码参数 |
| `[/hardcoding parameter]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；对应闭合标签 |
| `[passive object filter]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；闭合数字过滤码 |
| `[/passive object filter]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；对应闭合标签 |
| `[creature skill charge time rate]` | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；宠物技能蓄力时间率 |
| `[passive object]` | 禁用 | 不作为装备效果快速入口；走 passiveobject 专项 workflow |
