# Avatar / Emblem / Socket / Clone / Aura / Fashion Package 字段字典

状态：默认可用。

本字典只定义静态字段和 registry 边界，不证明实机可穿戴、可镶嵌、可开包、可克隆、UI 正常、客户端资源完整或服务端放行。

## Registry

| registry | 静态用途 | 注意 |
| --- | --- | --- |
| `equipment/equipment.lst` | 装备 ID 到 `.equ` 路径。 | 时装、皮肤、光环装备仍按 equipment registry 解析。 |
| `stackable/stackable.lst` | 道具 ID 到 `.stk` 路径。 | 徽章、礼包、开孔券、克隆相关道具通常在 stackable 侧。 |
| `aura/aura.lst` | aura ID 到 `.ora` 路径。 | `.ora` 是 aura 资源/效果脚本层，不等同于 `[aurora avatar]` 装备。 |

## 时装装备字段

| 字段 | 静态含义 | 边界 |
| --- | --- | --- |
| `[equipment type]` | 装备类型 token。 | 时装常见 `[hat avatar]`、`[hair avatar]`、`[face avatar]`、`[breast avatar]`、`[coat avatar]`、`[waist avatar]`、`[pants avatar]`、`[shoes avatar]`、`[skin avatar]`、`[aurora avatar]`。 |
| `[avatar type select]` | 时装类型/价格/孔位相关闭合块。 | 块内 socket token 只按本块解释；不要与徽章目标孔混合。 |
| `[avatar select ability]` | 时装可选能力候选池。 | 块内 `[SKILL_LEVEL]` 是候选项类型 token，不是固定 `[skill levelup]` 块。 |
| `[avatar func filter]` | 单值数字字段。 | 主目标观察到 `0` 与 `2`；数字语义不能脱离样本硬推。跨版本导入光环或时装装备时，应和目标同类装备对照是否缺少该字段；字段缺失是视觉/功能风险线索，不是单独充分条件。 |
| `[avatar emblem socket num]` | 时装徽章孔数量线索。 | 不证明实机可镶嵌。 |
| `[skin emblem socket]` | 皮肤徽章孔线索。 | 无值存在标记，不要补写数值。 |
| `[full avatar]` | 全身时装标记。 | 无值存在标记，不是容器。 |
| `[hide avatar in town]` | 城镇隐藏时装线索。 | 不证明客户端显示规则。 |
| `[ban animation in pvp]` | PVP 动画禁用线索。 | 不证明 PVP 最终规则。 |
| `[pvp free avatar]` | PVP 相关时装标记。 | 不证明免费或可用。 |

## Socket 字段

| 字段 | 所在层 | 静态含义 |
| --- | --- | --- |
| `[A socket]` | 多层 token | socket token，必须按父块解释。 |
| `[B socket]` | 多层 token | socket token，必须按父块解释。 |
| `[C socket]` | 多层 token | socket token，必须按父块解释。 |
| `[D socket]` | 多层 token | socket token，必须按父块解释。 |
| `[M socket]` | 多层 token | 主目标在 `[emblem socket default]` 和 `[avatar type select]` 均可见。 |
| `[S socket]` | 多层 token | 主目标在 `[avatar type select]`、`[avatar emblem target type]` 和 `etc` socket 表中可见。 |
| `[emblem socket default]` | equipment `.equ` | 默认徽章孔闭合块。 |
| `[avatar emblem target type]` | stackable `.stk` | 徽章道具可镶嵌目标孔闭合块。 |
| `[socket info]` | `etc/chn_equipmentsockettypelist.etc` | 普通装备部位到 socket token 的静态映射。 |

## 徽章与礼包字段

| 字段 | 静态含义 | 边界 |
| --- | --- | --- |
| `[stackable type] [avatar emblem]` | 徽章类道具。 | 继续读 `[avatar emblem target type]`。 |
| `[stackable type] [cera package]` | 礼包/商城包类道具。 | 不证明可开包或发放成功。 |
| `[stackable type] [usable cera package]` | 可使用礼包/商城包类道具。 | 不证明使用成功。 |
| `[package data]` | ID/数量组列表。 | ID 需要按 equipment / stackable registry 解析。 |
| `[impossible contents]` | 禁用内容或场景线索。 | 不证明 UI 或服务端限制。 |

## 光环字段

| 字段 | 静态含义 | 边界 |
| --- | --- | --- |
| `[aurora avatar]` | equipment type 中的光环时装类型。 | 不等同于 aura registry。 |
| `[aura hud icon]` | HUD 图标索引线索。 | 当前未在 PVF 内闭合到独立 registry。 |
| `[aura ability]` | 光环能力闭合块。 | 主目标可见 `[none]`、`[party teleport]`、`[solo teleport]`、`[upgrade solo teleport]`。 |
| `[aurora graphic effects]` | 光环图形效果路径结构。 | 部分样本没有闭合标签；`.ani` 路径不证明客户端资源完整。光环外观闭包至少要继续检查 `.ani` 内部 IMG 引用和目标客户端 ImagePacks2/NPK 覆盖，不能只看装备图标。 |
| `.ora [effect]` | aura 脚本内效果容器。 | 和装备 `.equ` 内 `[effect]` 需按父文件区分。 |
| `.ora [file name]` | aura 效果内资源路径。 | `.ani/.ptl` 命中只证明 PVF 内路径关系。 |

## 克隆边界

clone 在主目标中主要表现为文件名或文本关键词命中。它可以作为定位线索，但不能单独证明：

- 克隆时装系统可用。
- 克隆 UI 正常。
- 外观继承正确。
- 客户端资源完整。
- 服务端允许相关操作。

## 风险写法

可以写：

- “该 ID 在 `[package data]` 中未能解析到 equipment 或 stackable registry，属于静态发放链风险。”
- “该 socket token 位于 `[avatar type select]`，不能直接当作徽章道具目标孔。”
- “该光环 `.ani` 引用未在 PVF 内静态命中，仍需客户端资源链复核。”

不要写：

- “这个礼包一定能开出这些物品。”
- “这个徽章一定能镶嵌成功。”
- “这个光环一定能显示或传送。”
- “这个 clone 道具一定能克隆外观。”
