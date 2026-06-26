# 装备字段词典

本文件是 equipment 字段的主入口，不再承担完整字段百科。需要具体列形、低频边界或运行风险时，按下表进入对应专题索引。

装备字段默认状态为 `需验证`：写 PVF 前必须重新读取目标 PVF、解析 registry、保存到显式输出并读回。本文不写来源链，不记录资料库路径，不授权直接写 PVF。

当前已收窄的运行样本：当前主目标装备样本已经证明 `[minimum level]` 可限制低等级角色穿戴，`[usable job]` 可限制非目标职业穿戴。该结论只覆盖当前样本；不外推到所有装备部位、职业 token、转职映射、时装/宠物/称号/消耗品或正向满足条件后的穿戴行为。

## 使用方式

1. 先用 `dictionaries/pvf-tags.zh-CN.md` 或本文定位字段属于哪个专题。
2. 再打开对应 `indexes/*.zh-CN.md` 查看列形、父块边界和风险。
3. 若字段含数字 ID，按专题索引指定的 registry 解析。
4. 若字段涉及图标、声音、`.ani`、avatar 外观或客户端显示，另走客户端资源完整性检查。
5. 低频、遗留、样例型字段只能作为核查入口，不能作为通用写入模板。

## 专题路由

| 问题 | 入口 | 说明 |
| --- | --- | --- |
| 基础显示、交易、经济、核心数值、元素、速度、图标与基础类型 | `indexes/equipment-basic-fields.zh-CN.md` | 主段标量字段与资源引用入口。 |
| 期限、额外掉落、随机选项、世界/频道、不可用内容等规则字段 | `indexes/equipment-rule-fields.zh-CN.md` | 规则块和限制字段入口。 |
| 异常抗性、补充暴击、防御、恢复、任务掉率、复活容器 | `indexes/equipment-resistance-stats.zh-CN.md` | 包含样例型罕见抗性字段。 |
| 条件属性、目标筛选、PVP 修正、动态属性 | `indexes/equipment-conditional-stat-fields.zh-CN.md` | 主要用于 `[if]` / `[then]` 周边属性判断。 |
| 根级图标/隐藏/替换 avatar ani 等外观字段 | `indexes/equipment-visual-fields.zh-CN.md` | 资源存在需另查客户端。 |
| avatar 动作、motion、expand ani、声音和 socket 数量 | `indexes/equipment-avatar-motion-fields.zh-CN.md` | 重点检查动作路径和闭合块。 |
| avatar 类型选择与 socket token | `indexes/avatar-type-select.zh-CN.md` | `[avatar type select]` 与 `[A/B/C/D/M/S socket]`。 |
| avatar 可选能力 | `indexes/avatar-select-ability.zh-CN.md` | `[avatar select ability]` 与 `[SKILL_LEVEL]`。 |
| avatar filter、emblem socket、aura ability、aurora graphic effects | `indexes/avatar-aura-fields.zh-CN.md` | avatar/aura 相邻但独立的块。 |
| aura 底层位置、effect、int/string data、additional effect index | `indexes/equipment-aura-data-fields.zh-CN.md` | 光环与底层效果数据入口。 |
| 强化、账号成长、副职业、经验、职业技能门槛 | `indexes/equipment-upgrade-profession-fields.zh-CN.md` | 包含低频副职业和活动点数字段。 |
| 套装、成长、技能加成、触发条件、触发效果 | `indexes/equipment-effect-fields.zh-CN.md` | 复杂效果主入口。 |
| 运行时触发、召唤、发言、技能运行时修改、范围属性换算 | `indexes/equipment-runtime-trigger-fields.zh-CN.md` | 高风险运行时字段入口。 |
| 低频硬编码、旧式光环、推开/浮空/硬直、过滤器、宠物修正 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md` | 保留原字段，不外推公式。 |
| 方括号反引号值 token、职业 token、socket token、元素 token、旧拼写 | `indexes/equipment-bracket-value-tokens.zh-CN.md` | token 必须按父字段解释。 |
| 固定技能等级加成 | `indexes/skill-levelup.zh-CN.md` | `[skill levelup]` 专项入口。 |
| 技能数据修改类型 | `indexes/skill-data-up-types.zh-CN.md` | `[skill data up]` 专项入口。 |
| 技能 ID registry 选择 | `indexes/skill-registry-routing.zh-CN.md` | 职业 token 到 skill registry 路由。 |

## 快速边界

- `[need material]` 只有在 NPC 商店兑换链路中可作为 `默认可用` 入口；材料 ID 仍需 registry 解析。
- `[minimum level]` 与 `[usable job]` 已有当前主目标装备穿戴限制样本；写入时仍必须按目标装备、角色等级和职业做 readback 与游戏内验证。
- `[price]`、`[cash]`、`[medal]`、`[value]` 等经济字段必须按商店、掉落、装备主段或 stackable 上下文分别解释。
- `[physical attack]`、`[magical attack]`、`[physical defense]`、`[magical defense]` 在本目标语境下不是简单按英文直译；详细见基础字段索引。
- `[HP MAX]`、`[MP MAX]`、`[SKILL_LEVEL]`、`[STUCK ON ATTACK]` 等大小写敏感 token 必须原样保存。
- `[cast speed]` 是属性字段；`[casting]` 是触发条件字段，二者不能混用。
- `[cool time]` 与 `[cooltime]` 是不同拼写，不能静默互换。
- `[pvp]`、`[module]`、`[target]`、`[stat]` 等字段必须按父块解释，不建立全局单义映射。
- `[avatar type select]`、`[avatar select ability]`、`[skill levelup]` 相邻时仍是独立块。
- `[aura ability]` 与 `[avatar select ability]` 都是块结构，但用途不同。
- `[aurora graphic effects]` 在目标样本中并非总有闭合标签，不要强补 `[/aurora graphic effects]`。
- `[passive object]` 在装备效果里标为 `禁用` 快速入口；相关内容走 passiveobject 专项 workflow。

## 低频词条处理原则

目标 PVF 中存在只命中极少文件的字段和 token。它们不能因为冷门就删除，也不能因为出现过就作为常规写法复制。

处理规则：

- 保留原始拼写、空格和大小写。
- 标为 `需验证`、低频、遗留、样例型或专项复核入口。
- 优先放入 `equipment-hardcoded-legacy-fields`、`equipment-bracket-value-tokens` 或对应专题索引。
- 写入前必须重新定位同类样本；无法闭合 runtime 行为时不得提升为通用结论。

典型低频或遗留示例：

| 项 | 处理 |
| --- | --- |
| `[deadlystrike resistance]` / `[deelement resistance]` / `[tradeze resistance]` | 样例型罕见抗性字段，见抗性索引。 |
| `[lift up]` / `[push aside]` / `[rigidity]` | 旧式物理参数，见低频硬编码索引。 |
| `[appendage unique]` / `[passive object filter]` | 需 registry 或专项复核，不能从数字硬猜。 |
| `[smiest]` / `[gt unner]` / `[at ighter]` / `[demonic  swordman]` | 目标原始 token，保留拼写，不自动纠错。 |
| `[skill cosume item]` / `[limit count]` | `[skill data up]` 内低频或遗留 token，见技能数据索引。 |

## 最低核查清单

1. 先确认字段位于根级、套装块、avatar 块、aura 块、`[if]` 还是 `[then]`。
2. 需要闭合的块必须读取到对应结束标签；目标缺失闭合时只能按原样记录，不补造。
3. 所有 ID 按字段上下文选择 registry；职业技能 ID 必须通过职业 token 路由。
4. 文本说明、字段英文名和资源路径都不能单独证明真实效果。
5. 当前 Workbench 是只读知识入口；任何 PVF 写出另走安全生命周期。
