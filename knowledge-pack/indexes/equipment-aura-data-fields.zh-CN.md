# Equipment Aura And Effect Data 索引

## 用途

本索引用于只读判断 equipment `.equ` 中光环数值、通用视觉效果容器、硬编码数据载荷和附加效果关联字段。它只记录目标 PVF 已观察到的结构与最低边界，不证明客户端资源完整，也不授权直接写 PVF。

## 总规则

- `[aura]`、`[item aura]`、`[aura active]`、`[aura ability]` 是不同字段，不能因为中文都可称为“光环”而合并。
- `[int data]`、`[string data]` 是通用载荷容器；必须结合相邻字段和同类样本解释，不能建立一套跨文件通用列名。
- `.ani`、`.ptl`、`.img` 路径只证明 PVF 存在引用，不证明客户端资源存在。
- 光环外观不能只用装备或礼包图标闭包判定；涉及 `[aurora graphic effects]` 时，应继续追 `.ani` 帧级 IMG 和客户端 ImagePacks2/NPK，并保留实机视觉验证边界。
- 数字引用只有在找到对应映射或 registry 后才能命名；同号存在于其他表不构成当前字段的解析依据。

## 光环字段

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[aura hud icon]` | 需验证 | 根级非闭合单整数 HUD 图标索引。目标 PVF 有 575 个样本，但未找到可直接解析该数值的 PVF registry；不能擅自改写为 `.img` 路径或 equipment ID。 |
| `[aura]` | 需验证 | 触发效果侧单整数选择值，目标主要位于 `[multiple then] > [then]`，常见 `4` 至 `8`。同组样本将不同数值作为随机 Buff 分支，但数值到具体效果的映射未在当前设备字段内闭合。 |
| `[item aura]` | 需验证 | 根级或 `[set ability]` 内的四列记录：“属性字符串、运算符、数值、范围”。同一装备可重复；范围单位和叠加规则仍需实机确认。 |
| `[aura active]` | 需验证 | `[then]` 内的四列触发式光环记录：“属性字符串、运算符、数值、范围”。它是效果侧字段，不等同于根级 `[item aura]`。 |
| `[ability case index]` | 需验证 | 根级非闭合单整数关联号，常与套装或效果关联字段相邻。目标 PVF 未找到同名映射文件，不能把它直接解释为 `[aura]` 数值、equipment ID 或 effect part set ID。 |
| `[aura pos datas]` | 需验证 | 根级闭合位置表，必须读取 `[/aura pos datas]`。块内重复四列组：“组号、职业 token、X、Y”；同一职业可在不同组号下重复。目标职业 token 包括常规职业，也确认 `[at swordman]`、`[demonic lancer]`、`[knight]`；精确路由见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。坐标原点、单位和前后层行为需客户端验证。 |

## 通用 Effect 容器

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[effect]` | 需验证 | 根级可重复闭合视觉效果容器，必须读取 `[/effect]`。目标块内包含 `[type]`、`[attach pos]`、`[index]`、可选 `[option]`、可选 `[module]` 和 `[file name]`。 |
| `[type]` | 需验证 | 仅按当前 `[effect]` 子字段读取；目标样本均为 `animation`。不要把这个通用名字当作装备根级类型。 |
| `[attach pos]` | 需验证 | `[effect]` 内单 token 位置字段；目标值为 `bottom` 或 `top`。 |
| `[index]` | 需验证 | `[effect]` 内单整数层位或附着索引线索；目标值为 `-1` 或 `1`，精确渲染意义需客户端验证。 |
| `[option]` | 需验证 | `[effect]` 内可选闭合 token 列表；目标只观察到 `apply custom color` 与 `sync speed` 组合。必须读取 `[/option]`。 |
| `[file name]` | 需验证 | `[effect]` 内单个 `.ani` 路径；必须按反引号字符串读取，资源存在性另查客户端。 |

## 套装外观效果容器

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[set effect file]` | 需验证 | 根级闭合容器，不是单文件路径。目标块包含 `[rest ani]`、`[stay ani]` 和 `[hide layer]`，必须读取 `[/set effect file]`。 |
| `[rest ani]` | 需验证 | `[set effect file]` 内闭合块，目标为“.ani 路径、一个整数”；必须读取 `[/rest ani]`。整数可见 `-1` 或图层号形态，精确意义未定性。 |
| `[stay ani]` | 需验证 | `[set effect file]` 内闭合块，目标为“.ani 路径、一个整数”；必须读取 `[/stay ani]`。不能与 `[rest ani]` 路径互换。 |

## 硬编码数据载荷

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[int data]` | 需验证 | 根级或 `[pvp]` 内的闭合整数数组，必须读取 `[/int data]`。目标长度和列形差异很大，可与 `[hardcoding cooltime]`、`[string data]` 或其他机制相邻；不能脱离具体机制给各列统一命名。 |
| `[string data]` | 需验证 | 根级闭合字符串数组，必须读取 `[/string data]`；目标既有空字符串，也有 `.ptl` 路径及其他参数。它与 `[int data]` 的关联必须按同文件和同类样本确认。 |

## 附加效果关联

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[additional effect index]` | 需验证 | `[piece set ability]` 内单整数附加效果引用。应通过附加效果映射读取对应定义，不是 equipment ID；找不到映射时保留原值并标记未解析。 |

## 最低验证清单

1. 先读取父级容器；`[type]`、`[index]`、`[file name]` 只有位于 `[effect]` 内才按本索引解释。
2. 对所有闭合块确认结束标签，尤其是数据数组、位置表和套装外观容器。
3. 对 `.ani`、`.ptl`、`.img` 引用另做客户端资源检查。
4. 对 `[int data]`、`[string data]` 保留完整原顺序；没有机制级证据时不命名未知列。
5. 对 aura 与附加效果数字，不跨 registry 或映射表借义。
6. 对跨版本光环导入，单独记录图标资源闭包、光环动画链闭包、客户端资源包来源和实机视觉结果；四者不能相互替代。
