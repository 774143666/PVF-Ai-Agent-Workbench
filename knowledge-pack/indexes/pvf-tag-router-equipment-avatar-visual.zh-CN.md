# PVF Tag Router - Equipment Avatar And Visual

用于 avatar、aura、外观、动作、图标、视觉效果和底层 aura 数据字段的详细标签路由。

使用规则：

- 本文件是标签到 Workbench 入口的详细路由表，不是字段解释正文。
- 字段含义、列形、父块边界和写入风险以路由到的专题索引为准。
- 标签和闭合标签必须按目标 PVF 原样读取；写入前仍需重新核查目标样本。

## Avatar 类型与可选能力入口

| 标签 / token | 状态 | 路由 |
| --- | --- | --- |
| `[avatar type select]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；avatar 类型选择与 socket token 块，需读取完整闭合块 |
| `[/avatar type select]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`[avatar type select]` 的闭合标签 |
| `[A socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`indexes/avatar-aura-fields.zh-CN.md`；按所在块读取，可见于 `[avatar type select]` 与 `[emblem socket default]` |
| `[B socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`indexes/avatar-aura-fields.zh-CN.md`；按所在块读取，可见于 `[avatar type select]` 与 `[emblem socket default]` |
| `[C socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；仅按 `[avatar type select]` 内 socket token 读取 |
| `[D socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`indexes/avatar-aura-fields.zh-CN.md`；按所在块读取，可见于 `[avatar type select]` 与 `[emblem socket default]` |
| `[S socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；仅按 `[avatar type select]` 内 socket token 读取 |
| `[M socket]` | 需验证 | `indexes/avatar-type-select.zh-CN.md`；`indexes/avatar-aura-fields.zh-CN.md`；目标确认可见于 `[avatar type select]` 与 `[emblem socket default]` |
| `[avatar select ability]` | 需验证 | `indexes/avatar-select-ability.zh-CN.md`；`indexes/equipment-bracket-value-tokens.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；avatar 可选能力候选块，需读取完整闭合块 |
| `[SKILL_LEVEL]` | 需验证 | `indexes/avatar-select-ability.zh-CN.md`；仅按 `[avatar select ability]` 内的可选技能等级项读取，不等同于固定 `[skill levelup]` |
| `[avatar func filter]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；单值数字字段，目标观察到 `0` 和 `2` |
| `[emblem socket default]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；默认徽章 socket token 闭合块 |
| `[/emblem socket default]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`[emblem socket default]` 的闭合标签 |
| `[aura ability]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`indexes/equipment-bracket-value-tokens.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；光环能力闭合块 |
| `[/aura ability]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`[aura ability]` 的闭合标签 |
| `[aurora graphic effects]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；`dictionaries/equipment-fields.zh-CN.md`；光环图形效果 `.ani` 引用结构 |
| `[/aurora graphic effects]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md`；只在部分目标样本中出现，不能默认所有 `[aurora graphic effects]` 都有闭合 |

## Equipment 外观与表现入口

| 标签 | 状态 | 路由 |
| --- | --- | --- |
| `[full avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；无值全身 avatar 标记 |
| `[hide avatar in town]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；无值城镇隐藏标记 |
| `[hide grow avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；职业成长外观字符串闭合列表 |
| `[/hide grow avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[hide growtype avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；成长类型整数闭合列表 |
| `[/hide growtype avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[hide unique equipment]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；特殊外观隐藏类型闭合列表 |
| `[/hide unique equipment]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[hide unique layer]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；特殊外观隐藏图层闭合列表 |
| `[/hide unique layer]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[avatar emblem socket num]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；socket 数量或配置数线索 |
| `[skin emblem socket]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；无值皮肤徽章 socket 标记 |
| `[pvp free avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；PVP avatar 相关标记 |
| `[ban animation in pvp]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；无值 PVP 动画禁用标记 |
| `[character name y revision]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；两个整数的名称 Y 修正 |
| `[msg balloon on mucu skill]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；整数与气泡文本 |
| `[required full set for chatting emoticon]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；全套聊天表情条件线索 |
| `[change type ultimateSkillCurScene]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；硬编码场景类型参数 |
| `[spectrum avatar]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；五或六个残影或色彩数值 |
| `[x move dash speed]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；X 方向速度率 |
| `[y move dash speed]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；Y 方向速度率 |
| `[LAYER]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；动作图层单整数，可重复 |
| `[waiting motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[move motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[sit motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[damage motion 1]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[damage motion 2]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[down motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[overturn motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[jump motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[jumpattack motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[rest motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[throw motion 1-1]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 1-2]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 2-1]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 2-2]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 3-1]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 3-2]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 4-1]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[throw motion 4-2]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；投掷动作相对路径 |
| `[dash motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[dashattack motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[getitem motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[buff motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；相对 `.ani` 路径 |
| `[level section ani]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；等级或职业分段外观闭合块 |
| `[/level section ani]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[attack motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；闭合动作路径列表 |
| `[/attack motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[etc motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；闭合职业专用动作路径列表 |
| `[/etc motion]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[custom wav]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；闭合声音标识列表 |
| `[/custom wav]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[specific sound]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；场景与声音标识对闭合列表 |
| `[/specific sound]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；对应闭合标签 |
| `[ani equiped type]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；`[expand ani]` 内类型 token |
| `[ani order]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；`[expand ani]` 内顺序参数 |
| `[expand ani sound]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；`[expand ani]` 内声音参数 |
| `[expand attack box]` | 需验证 | `indexes/equipment-avatar-motion-fields.zh-CN.md`；`[expand ani]` 内攻击框参数 |
| `[enable dye]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；根级双整数染色标记 |
| `[spectrum]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；根级五整数视觉参数 |
| `[hide equipment]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；avatar 装备类型 token 列表 |
| `[/hide equipment]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[hide layer]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；图层编号列表 |
| `[/hide layer]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[custom animation]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；`.ani` 引用闭合块 |
| `[/custom animation]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[expand ani]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；扩展外观闭合容器 |
| `[/expand ani]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[expand path]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；仅按 `[expand ani]` 内目录路径读取 |
| `[extra icon]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；`.img` 路径与帧号 |
| `[clear avatar]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；单整数 avatar 标记 |
| `[replace avatar ani]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；触发式 avatar 替换块 |
| `[/replace avatar ani]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[particle]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；`.ptl` 粒子引用块 |
| `[/particle]` | 需验证 | `indexes/equipment-visual-fields.zh-CN.md`；对应闭合标签 |
| `[aura hud icon]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；单整数 HUD 图标索引 |
| `[aura]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；触发分支内单整数效果选择值 |
| `[item aura]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；属性、运算符、数值、范围 |
| `[aura active]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；效果侧触发式光环记录 |
| `[ability case index]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；未闭合映射的单整数关联号 |
| `[aura pos datas]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；职业位置数据闭合表 |
| `[/aura pos datas]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[effect]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；通用视觉效果闭合容器 |
| `[/effect]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[type]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；仅按 `[effect]` 内子字段读取 |
| `[attach pos]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；效果附着位置 token |
| `[index]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；效果层位或附着索引线索 |
| `[option]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；效果选项 token 闭合块 |
| `[/option]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[file name]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；效果 `.ani` 路径 |
| `[set effect file]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；套装外观效果闭合容器 |
| `[/set effect file]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[rest ani]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；静止动画路径与整数闭合块 |
| `[/rest ani]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[stay ani]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；待机动画路径与整数闭合块 |
| `[/stay ani]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[int data]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；机制相关整数载荷闭合块 |
| `[/int data]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[string data]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；机制相关字符串载荷闭合块 |
| `[/string data]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；对应闭合标签 |
| `[additional effect index]` | 需验证 | `indexes/equipment-aura-data-fields.zh-CN.md`；附加效果映射引用 |
