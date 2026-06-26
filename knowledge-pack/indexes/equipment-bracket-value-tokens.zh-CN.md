# Equipment Bracket Value Tokens 索引

## 用途

本索引用于解释 equipment `.equ` 中以反引号包裹的 `` `[token]` `` 值。它们是字段值、选择项、作用域或展示文本，不等于新的 `[field]` 字段。

本索引只记录目标只读盘点已观察到的值和上下文边界，不授权直接写 PVF。

## 总规则

- 先确定父字段，再解释 token；同一个 token 在不同父字段中可以有不同角色。
- 大小写、空格、下划线和原始拼写必须原样保留。
- token 不是数字 ID，不能送入 equipment registry 或 skill registry 解析。
- 职业 token 只负责选择正确的 skill registry；真正需要解析的是它后面的技能 ID。
- 方括号文本不一定是枚举。位于 `[name]`、`[name2]` 或说明字段时，应先按展示文本处理。
- 目标内孤立的错位或异常上下文不能建立第二套通用语义。

## 交易与附着类型

以下值的正常父字段为 `[attach type]`：

| Token | 目标可观察边界 |
| --- | --- |
| `[trade]` | `[attach type]` 的单值。资料注释指向不可交换类状态，但实际交易、封装和账号规则仍需服务端或实机确认。极少数错位样本不能把它解释成动画职业。 |
| `[sealing]` | `[attach type]` 的单值，封装类状态线索；不要自行补写解除、删除或交易行为。 |
| `[free]` | `[attach type]` 的单值，资料注释指向可交换类状态；实际限制仍需实机确认。 |
| `[trade delete]` | `[attach type]` 的单值。名称不能单独证明“不可交易”和“不可删除”各自的完整运行规则。 |
| `[account]` | `[attach type]` 的单值，账号范围绑定线索；绑定时机和仓库行为需实机确认。 |

## 装备类型与外观部位

普通装备类型主要位于 `[equipment type]`：

| Token | 目标可观察父字段 |
| --- | --- |
| `[weapon]` | `[equipment type]`；也可见于 `[hide equipment]`。 |
| `[coat]` | `[equipment type]`。 |
| `[pants]` | `[equipment type]`。 |
| `[shoes]` | `[equipment type]`。 |
| `[shoulder]` | `[equipment type]`。 |
| `[waist]` | `[equipment type]`。 |
| `[ring]` | `[equipment type]`。 |
| `[wrist]` | `[equipment type]`。 |
| `[amulet]` | `[equipment type]`。 |
| `[title name]` | `[equipment type]` 的称号类型值；不要和 `[title]` 混用。 |
| `[support]` | `[equipment type]`。 |
| `[magic stone]` | `[equipment type]`。 |

Avatar 与外观部位 token 可在 `[equipment type]`、`[hide equipment]`、`[hide unique equipment]` 或 `[replace avatar ani]` 中出现：

| Token | 目标可观察父字段 |
| --- | --- |
| `[hair avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[pants avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[coat avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[shoes avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[hat avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[breast avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[face avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[waist avatar]` | `[equipment type]`、隐藏块、替换块。 |
| `[skin avatar]` | `[equipment type]`、`[replace avatar ani]`。 |
| `[aurora avatar]` | `[equipment type]`、`[replace avatar ani]`。 |
| `[neck avatar]` | 目标只在 `[hide equipment]` 中确认。 |
| `[title]` | 目标只在 `[hide equipment]` 中确认；不要替换为 `[title name]`。 |
| `[weapon avatar]` | 主要位于 `[hide equipment]`，另有少量 `[equipment type]` 和 `[replace avatar ani]` 样本。 |
| `[belt avatar]` | 目标只在 `[hide equipment]` 中确认；不要自动改成 `[waist avatar]`。 |

`[equipment type]` 后面的数字列必须保留原值；本索引不把数字统一命名为槽位、子类型或显示序号。

## 职业与公共路由 Token

下列 token 可用于 `[usable job]`、`[animation job]`、`[skill data up]`、`[skill levelup]`、`[avatar select ability]`、`[aura pos datas]`、`[item growtype]` 或动画位置表。具体可用位置以父字段为准：

| Token | 读取边界 |
| --- | --- |
| `[all]` | 多义范围值。目标可见于 `[usable job]`、`[skill group]`、`[skill phase]`、`[skill data up]`、额外掉落范围、`[item growtype]` 和 `[animation job]`；不能跨父字段借义。 |
| `[swordman]` | 职业路由 token。 |
| `[mage]` | 职业路由 token。 |
| `[fighter]` | 职业路由 token。 |
| `[gunner]` | 职业路由 token。 |
| `[priest]` | 职业路由 token。 |
| `[at gunner]` | 职业路由 token；空格必须保留。 |
| `[at fighter]` | 职业路由 token；空格必须保留。 |
| `[demonic swordman]` | 职业路由 token；空格必须保留。 |
| `[thief]` | 职业路由 token。 |
| `[creator mage]` | 职业路由 token；空格必须保留。 |
| `[at mage]` | 职业路由 token；空格必须保留。 |
| `[at swordman]` | 目标主要见于 `[aura pos datas]`，也见于 `[skill levelup]` 和少量 `[usable job]`。 |
| `[demonic lancer]` | 目标只在 `[aura pos datas]` 中确认。 |
| `[knight]` | 目标只在 `[aura pos datas]` 中确认。 |
| `[common]` | 可位于 `[avatar select ability]`、`[skill levelup]` 和 `[skill data up]`；它不是独立 skill registry，必须按实际适用职业继续解析。 |

以下是目标内实际存在的遗留或可疑拼写。只读时必须原样记录，不能静默修正：

| Token | 目标可观察边界 |
| --- | --- |
| `[theif]` | 大量位于 `[skill data up]`。不能仅因拼写与 `[thief]` 不同就批量替换。 |
| `[demonic  swordman]` | 位于 `[avatar select ability]` 的技能等级候选项；中间是两个空格。 |
| `[gt unner]` | 少量位于 `[skill data up]`。需逐文件与相邻职业组比较后再判断。 |
| `[at ighter]` | 少量位于 `[skill data up]`。需逐文件与相邻 `[at fighter]` 组比较。 |
| `[smiest]` | 单个装备中同时见于 `[usable job]` 和 `[animation job]`；是否可正常运行必须实机确认。 |

## Avatar 可选属性 Token

以下属性 token 只按 `[avatar select ability]` 内的“token、运算符、数值”候选项读取：

| Token | 候选类别 |
| --- | --- |
| `[MAGICAL_ATTACK]` | 魔法攻击类候选。 |
| `[MAGICAL_DEFENSE]` | 魔法防御类候选。 |
| `[CAST_SPEED]` | 施放速度类候选。 |
| `[HP_REGENRATE]` | HP 回复类候选；保留 `REGENRATE` 原拼写。 |
| `[MP_REGENRATE]` | MP 回复类候选；保留 `REGENRATE` 原拼写。 |
| `[ATTACK_SPEED]` | 攻击速度类候选。 |
| `[ACTIVESTATUS_TOLERANCE_ALL]` | 全异常抗性类候选。 |
| `[EQUIPMENT_MAGICAL_DEFENSE]` | 装备魔法防御类候选。 |
| `[HIT_RECOVERY]` | 受击恢复类候选。 |
| `[PHYSICAL_ATTACK]` | 物理攻击类候选。 |
| `[PHYSICAL_DEFENSE]` | 物理防御类候选。 |
| `[EQUIPMENT_PHYSICAL_DEFENSE]` | 装备物理防御类候选。 |
| `[HP MAX]` | HP 上限类候选；空格必须保留。 |
| `[MP MAX]` | MP 上限类候选；空格必须保留。 |
| `[JUMP_POWER]` | 跳跃力类候选。 |
| `[MOVE_SPEED]` | 移动速度类候选。 |
| `[INVENTORY_MAX_WEIGHT]` | 负重上限类候选。 |
| `[ACTIVESTATUS_TOLERANCE_STUCK]` | 命中或僵直相关抗性候选；最终面板语义需实机确认。 |
| `[ELEMENT_TOLERANCE_DARK]` | 暗属性抗性类候选。 |
| `[ELEMENT_TOLERANCE_FIRE]` | 火属性抗性类候选。 |
| `[ELEMENT_TOLERANCE_LIGHT]` | 光属性抗性类候选。 |
| `[ELEMENT_TOLERANCE_WATER]` | 水属性抗性类候选。 |
| `[MAGICAL ABSOLUTE DEFENSE]` | 魔法绝对防御类候选；空格必须保留。少量错位于声音字段的样本不能建立第二种通用含义。 |
| `[PHYSICAL ABSOLUTE DEFENSE]` | 物理绝对防御类候选；空格必须保留。 |
| `[STUCK ON ATTACK]` | 攻击命中相关候选；精确正负含义需实机确认。 |

技能类候选项使用：

| Token | 目标可观察边界 |
| --- | --- |
| `[SKILL_LEVEL]` | `[avatar select ability]` 内的候选类型标记，后接职业 token、技能 ID、等级变化量；不是固定字段 `[skill levelup]`。 |

## Socket Token

| Token | 目标可观察父字段 |
| --- | --- |
| `[A socket]` | `[avatar type select]`、`[emblem socket default]`。 |
| `[B socket]` | `[avatar type select]`、`[emblem socket default]`。 |
| `[C socket]` | 目标只在 `[avatar type select]` 中确认。 |
| `[D socket]` | `[avatar type select]`、`[emblem socket default]`。 |
| `[M socket]` | `[avatar type select]`、`[emblem socket default]`。 |
| `[S socket]` | 目标只在 `[avatar type select]` 中确认。 |

Socket token 必须按所在块解释。块结构和列形分别见 `indexes/avatar-type-select.zh-CN.md` 与 `indexes/avatar-aura-fields.zh-CN.md`。

## Aura Ability Token

| Token | 目标可观察列形 |
| --- | --- |
| `[none]` | `[aura ability]` 内单 token，无后续数字。 |
| `[party teleport]` | `[aura ability]` 内“token、一个整数”。 |
| `[solo teleport]` | `[aura ability]` 内“token、一个整数”。 |
| `[upgrade solo teleport]` | `[aura ability]` 内“token、一个整数”。 |

后三种整数参数与传送冷却相关，但单位、计时起点、队伍范围和升级差异仍需实机确认。

## 元素类型 Token

以下值位于 `[elemental property]`：

| Token | 读取边界 |
| --- | --- |
| `[dark element]` | 暗元素类型值。 |
| `[light element]` | 光元素类型值。 |
| `[fire element]` | 火元素类型值。 |
| `[water element]` | 水元素类型值；不要仅按中文显示自行改成 ice。 |

它们是元素选择值，不是 `[dark attack]`、`[light attack]`、`[fire attack]`、`[water attack]` 数值字段。

## Module、世界与掉落范围 Token

| Token | 目标可观察父字段 |
| --- | --- |
| `[dungeon type]` | 大量作为 `[skill data up]` 作用域，也位于 `[module]`。 |
| `[war room]` | 主要位于 `[module]`，少量用于 `[skill data up]` 作用域。 |
| `[dungeon]` | 目标作为 `[module]` 值确认。 |
| `[dead tower]` | `[module]`。 |
| `[blood system]` | `[module]`。 |
| `[pvp]` | 主要位于 `[module]`，少量用于 `[skill data up]` 作用域；不要与字段 `[pvp]` 混为同一层。 |
| `[pvp type]` | 主要位于 `[module]`，少量用于 `[skill data up]`。 |
| `[tournament dungeon]` | `[module]`。 |
| `[assault]` | 主要位于 `[module]`，少量用于 `[skill data up]`。 |
| `[room list]` | 目标位于 `[effect] > [module]`。 |
| `[fair pvp]` | 主要用于 `[skill data up]`，少量位于 `[module]`。 |
| `[fair]` | `[usable world]`。 |
| `[ultimate]` | `[difficulty for extra drop]`。 |

`[module]` 是闭合 token 列表；作用域 token 是否可互换、是否覆盖当前客户端全部模式，不能只凭名称推导。

## Skill Data Up 数据类型与条件

以下 token 位于 `[skill data up]` 的数据类型列：

| Token | 读取边界 |
| --- | --- |
| `[level]` | 等级数据列选择；具体索引必须回到对应技能文件。极少数也见于 `[skill duration]`，不能跨父字段借义。 |
| `[cooltime]` | 冷却数据选择；可见 `%` 或 `+` 运算。极少数也见于 `[skill duration]`。 |
| `[mp]` | MP 消耗数据选择。 |
| `[static]` | 静态数据选择。 |
| `[skill consume item]` | 技能消耗道具数据选择。 |
| `[casting time]` | 施放时间数据选择。 |
| `[skill cosume item]` | 目标遗留拼写，位于 `[skill data up]`；不得静默改成 `[skill consume item]`。 |
| `[limit count]` | 目标仅确认一个 `[skill data up]` 样本；索引和值的精确意义需专项验证。 |

以下 token 位于 `[extra condition]`：

| Token | 目标可观察边界 |
| --- | --- |
| `[except for ex skill]` | 技能适用条件过滤值；常见于 `[all skill item] > [skill apply condition]`。 |
| `[ex skill]` | 少量技能条件值。 |
| `[normal skill]` | 少量技能条件值。 |

这些条件只过滤所在技能效果块，不是独立技能分类表，也不能脱离外层 `[all skill item]` 使用。

## 方括号展示文本

| Token | 目标可观察边界 |
| --- | --- |
| `[魔槍士]` | 只在 `[name2]` 中作为反引号展示文本出现。它不是职业 token、字段标签或 registry 名。 |

## 最低验证清单

1. 先读取 token 的直接父字段和外层闭合块。
2. 确认它是字段值、作用域、数据类型、职业路由还是展示文本。
3. 保留原始大小写、空格和拼写，不做自动纠错。
4. 职业 token 后有技能 ID 时，按正确职业 registry 解析技能 ID。
5. `[equipment type]`、socket、aura 和 skill data up 的数字列分别按对应专项索引处理。
6. 同名字段与 token 分层记录，例如字段 `[pvp]` 与 `[module]` 内 token `` `[pvp]` ``。
7. 遇到错位或孤立异常时保留原文件并标记复核，不据此创建通用规则。
