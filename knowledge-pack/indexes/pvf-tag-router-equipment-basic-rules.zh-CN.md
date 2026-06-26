# PVF Tag Router - Equipment Basic And Rules

用于 equipment 基础字段、抗性与补充属性、条件属性、期限限制和规则字段的详细标签路由。

使用规则：

- 本文件是标签到 Workbench 入口的详细路由表，不是字段解释正文。
- 字段含义、列形、父块边界和写入风险以路由到的专题索引为准。
- 标签和闭合标签必须按目标 PVF 原样读取；写入前仍需重新核查目标样本。

## Equipment 基础字段入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[name]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[name2]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[basic explain]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[detail explain]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[explain]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[flavor text]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[grade]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[rarity]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[attach type]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；值 token 见 `indexes/equipment-bracket-value-tokens.zh-CN.md` |
| `[minimum level]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[usable job]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；职业与遗留 token 见 `indexes/equipment-bracket-value-tokens.zh-CN.md` |
| `[repair price]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[value]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[creation rate]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[physical attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[magical attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[physical defense]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[magical defense]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[equipment physical attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[equipment magical attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[equipment physical defense]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[equipment magical defense]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[separate attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[anti evil]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[HP regen speed]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；单值 HP 回复速度线索，时间单位需实机确认 |
| `[MP regen speed]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；单值 MP 回复速度线索，按所在主段或能力块解释 |
| `[inventory limit]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；负重上限增加线索，不等同于 `[weight]` |
| `[all elemental attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[all elemental resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[fire attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[water attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[dark attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[light attack]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[fire resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[water resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[dark resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[light resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[elemental property]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[fire element]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；仅按 `[elemental property]` 的元素枚举 token 读取 |
| `[water element]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；仅按 `[elemental property]` 的元素枚举 token 读取 |
| `[dark element]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；仅按 `[elemental property]` 的元素枚举 token 读取 |
| `[light element]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；仅按 `[elemental property]` 的元素枚举 token 读取 |
| `[no element]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；来源线索候选，目标 equipment 样本未确认 |
| `[attack speed]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[move speed]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[casting speed]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[physical critical hit]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[magical critical hit]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[stuck]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[stuck resistance]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；回避率相关线索，不等同于 `[stuck]` |
| `[hit recovery]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；硬直或受击恢复相关线索，具体表现需实机确认 |
| `[jump power]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；单值跳跃力线索 |
| `[durability]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[weight]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[icon]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；客户端资源另走资产检查 |
| `[field image]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；客户端资源另走资产检查 |
| `[equipment type]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；装备与 avatar 类型 token 见 `indexes/equipment-bracket-value-tokens.zh-CN.md` |
| `[sub type]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[item group name]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[move wav]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；客户端资源另走资产检查 |
| `[animation job]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[variation]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[layer variation]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |
| `[equipment ani script]` | 需验证 | `indexes/equipment-basic-fields.zh-CN.md` |

## Equipment 抗性与补充属性入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[all activestatus resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；全异常状态抗性单数值线索 |
| `[freeze resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；冰冻异常状态抗性 |
| `[bleeding resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；出血异常状态抗性 |
| `[poison resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；中毒异常状态抗性 |
| `[stun resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；眩晕异常状态抗性 |
| `[confuse resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；混乱异常状态抗性 |
| `[lightning resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；感电异常状态抗性 |
| `[curse resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；诅咒异常状态抗性 |
| `[slow resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；减速异常状态抗性 |
| `[blind resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；失明异常状态抗性 |
| `[burn resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；灼伤异常状态抗性 |
| `[sleep resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；睡眠异常状态抗性 |
| `[stone resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；石化异常状态抗性 |
| `[hold resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；束缚或控制类抗性线索 |
| `[piercing resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；机制名未闭合的抗性线索 |
| `[deadlystrike resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；样例型文件中的罕见字段 |
| `[deelement resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；样例型文件中的罕见字段 |
| `[tradeze resistance]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；样例型文件中的罕见原拼写字段 |
| `[increase critical damage]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；效果侧 `%` token 与数值 |
| `[decrease critical damage]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；根级 `%` token 与数值 |
| `[add physical critical hit]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；补充物理暴击字段 |
| `[add magical critical hit]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；补充魔法暴击字段 |
| `[ignore defense]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；单一样本忽略防御线索 |
| `[add absolute defense percent]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；效果侧防御百分比修正 |
| `[creature physical attack]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；creature 物理攻击线索 |
| `[creature magical attack]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；creature 魔法攻击线索 |
| `[MP regen speed rate]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；MP 回复速度率线索 |
| `[hp recovery]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；恢复参数，目标位于 `[rebirth]` |
| `[mp recovery]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；恢复参数，目标位于 `[rebirth]` |
| `[recovery status]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；闭合整数流 |
| `[/recovery status]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；对应闭合标签 |
| `[quest item drop rate bonus]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；任务物品掉落率加成线索 |
| `[war room point bonus]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；`%` token 与数值 |
| `[rebirth]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；概率、消耗、恢复和冷却的闭合容器 |
| `[/rebirth]` | 需验证 | `indexes/equipment-resistance-stats.zh-CN.md`；对应闭合标签 |

## Equipment 条件属性与目标筛选入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[stat change]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；条件侧属性比较，目标闭合形态混合 |
| `[/stat change]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；仅少量目标记录显式使用 |
| `[target stat]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；目标属性比较 |
| `[is stat]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；指定对象属性比较 |
| `[stat change by stat]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；八个逻辑值的属性换算 |
| `[add stat at once]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；效果侧属性、运算符、数值 |
| `[variable stat]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；重复八值动态属性闭合块 |
| `[/variable stat]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；对应闭合标签 |
| `[target type]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；目标种族或类型筛选 |
| `[target grade]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；目标等级类别筛选 |
| `[party count]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；比较符与人数 |
| `[attacker]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；攻击来源 token 与整数 |
| `[element]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；条件侧攻击元素 |
| `[elemental weapon]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；效果侧武器元素赋予 |
| `[weakness]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；效果侧 weakness 单数值 |
| `[reduce duration at pvp module]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；PVP 持续时间缩减参数 |
| `[reduce probability at pvp module]` | 需验证 | `indexes/equipment-conditional-stat-fields.zh-CN.md`；PVP 概率缩减参数 |

## Equipment 期限、限制与规则入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[equipment upgrade]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；强化或增幅条件闭合块 |
| `[/equipment upgrade]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；对应闭合标签 |
| `[account bind linear ability]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；账号绑定线性成长闭合表 |
| `[/account bind linear ability]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；对应闭合标签 |
| `[upgrade prob increase]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；强化成功率增加线索 |
| `[upgrade cost discount]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；强化费用折扣 |
| `[assault cost discount]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；assault 费用折扣 |
| `[item overpower part]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；无值部件强化相关标记 |
| `[expertjob only]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；副职业 token 与等级闭合块 |
| `[/expertjob only]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；对应闭合标签 |
| `[prof compound rate]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；专业制作率线索 |
| `[prof result variation]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；专业结果双数值 |
| `[prof disjoint result variation]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；分解结果变化 |
| `[prof material variation]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；材料消耗变化 |
| `[prof additional gain exp]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；副职业额外经验双数值 |
| `[exp advantage]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；地下城经验加成 |
| `[exp]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；单一样本经验字段 |
| `[user power war point]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；势力战点数线索 |
| `[required job skill]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；职业与技能 ID 对闭合块 |
| `[/required job skill]` | 需验证 | `indexes/equipment-upgrade-profession-fields.zh-CN.md`；对应闭合标签 |
| `[Force Result Item Rule]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级双整数规则字段 |
| `[random option]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级单整数 `1/2/3`，不是布尔开关 |
| `[special monster drop]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级额外掉落标记 |
| `[dungeon type for extra drop]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；额外掉落地城类型 token 闭合块 |
| `[/dungeon type for extra drop]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[difficulty for extra drop]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；额外掉落难度 token 闭合块 |
| `[/difficulty for extra drop]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[usable period]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；单整数使用期限线索 |
| `[expiration date]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；Unix epoch 秒形态的绝对过期时间 |
| `[no random]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级无值存在标记 |
| `[minimum rank]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；公平决斗场装备的单整数门槛 |
| `[usable world]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；世界或频道适用范围 token 闭合块 |
| `[/usable world]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[chat emoticon index]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；通过 `chatemoticon/chatemoticon.lst` 解析 |
| `[special ability]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级特殊能力标记 |
| `[not amplify]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级增幅限制标记 |
| `[epic routing]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；根级路由标记，不等于优先级块 |
| `[limit upgradable level]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；升级类型与上下界闭合块 |
| `[/limit upgradable level]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[routing priority]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；可为空或包含职业 token 的闭合块 |
| `[/routing priority]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[impossible contents]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；禁用项 token 列表 |
| `[/impossible contents]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[character item check]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；重复三列组闭合块 |
| `[/character item check]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
| `[item category]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；分类 token 列表 |
| `[/item category]` | 需验证 | `indexes/equipment-rule-fields.zh-CN.md`；对应闭合标签 |
