# Character / Job / GrowType / Class Enum 字段词典

状态：默认可用

用途：解释主目标 PVF 中角色、职业、growtype、技能树、职业限制相关字段的静态含义和风险边界。本文不证明实机转职、技能学习、装备穿戴、任务过滤、客户端 UI 或服务端放行。

## Registry 与入口

| 字段或文件 | 主目标观察 | 只读结论 | 风险边界 |
| --- | --- | --- | --- |
| `character/character.lst` | 11 entries | 角色 ID 到 `.chr` 路径的主入口。 | 文件存在不等于客户端可创建或服务端放行。 |
| `skill/skilllist.lst` | 11 entries | 职业 ID 到职业技能 `.lst` 的入口；顺序与 `character/character.lst` 一致。 | 只能说明本目标集的静态入口一致，不是跨 PVF 通用规则。 |
| `skill/autoskill.lst` | 9 entries | AutoSkill 的职业入口，只覆盖 ID `0-8`。 | 不能用 `skill/skilllist.lst` 自动补出 9、10。 |
| `clientonly/skilltree/*.co` | 21 files | SP/TP 技能树 UI/学习入口候选。 | 不证明 UI 正常、技能可学、SP/TP 扣点成功。 |
| `etc/pvpskilltree/*.etc` | 9 files | PVP 技能树静态候选入口。 | 不证明 PVP 最终规则、平衡覆盖或实机生效。 |

## `.chr` 角色文件字段

| 字段 | 形态 | 解释 | 风险边界 |
| --- | --- | --- | --- |
| `[job]` | 单个反引号 token，例如 `` `[at mage]` `` | 该 `.chr` 的职业 token。 | token 文本不能靠文件夹名推断；以 `.chr` 实读为准。 |
| `[growtype name]` | 多个文本项 | 该角色文件内的基础/转职显示名称候选。 | 不等于全局 growtype 枚举，也不证明转职开放。 |
| `[growtype N]` | 数字后缀块 | 该角色文件内的成长/转职分块。 | `N` 只在该角色上下文内解释。 |
| `[skill]` | 技能 ID / 等级成对或列表 | 角色基础或 growtype 块内的默认技能候选。 | 技能 ID 必须走该职业 registry；不证明角色创建后实际拥有。 |
| `[awakening name]` | 两个文本项常见 | 觉醒名称候选。 | 文本可有待定占位；不证明觉醒任务或 UI 完整。 |
| `[awakening N]` | 数字后缀块 | 觉醒阶段静态分块。 | 不证明觉醒流程可用。 |
| `[awakening skill]` | 技能 ID / 等级候选 | 觉醒阶段默认技能候选。 | 必须按职业技能 registry 解析。 |

## 角色目录与 `at` 前缀

| 形态 | 解释 | 风险边界 |
| --- | --- | --- |
| `gunner` / `atgunner` | 不同角色或职业分支入口，不是觉醒阶段。 | 不能把 `atgunner` 当成 `gunner` 的觉醒、TP 或 Ex 文件夹。 |
| `mage` / `atmage` | 不同角色或职业分支入口；`.chr [job]` 可写成 `` `[at mage]` ``。 | 目录名、token 空格和 registry 名都要以目标 PVF 实读为准。 |
| `fighter` / `atfighter` | 不同角色或职业分支入口。 | 同名技能 ID 也必须按各自 `skill/*Skill.lst` 解析。 |

规则：`at` 前缀按独立角色/分支 token 处理。解析技能、技能树、装备职业限制或脚本 job 判断时，先从 `character/character.lst`、`.chr [job]`、`skill/skilllist.lst` 和具体职业技能 registry 闭合，不按“觉醒”“特性技能”“派生技能”推断。

## 技能与技能树字段

| 字段 | 文件族 | 解释 | 风险边界 |
| --- | --- | --- | --- |
| `[character job]` | `clientonly/skilltree/*.co` | SP/TP 技能树分块，包含职业 token 和转职别名。 | 不证明客户端 UI 正常或技能可学。 |
| `[skill info]` | `clientonly/skilltree/*.co` | 技能树中的一个技能节点。 | 节点存在不等于学习条件满足。 |
| `[index]` | `clientonly/skilltree/*.co` | 技能 ID，需按当前职业 registry 解析。 | 不得当全局技能 ID。 |
| `[next skill]` | `clientonly/skilltree/*.co` | 技能树节点前后关系候选。 | 不证明前置条件实机生效。 |
| `[job index]` | `etc/pvpskilltree/*.etc` | PVP 表内职业数字入口。 | 需回到主目标角色/技能入口顺序解释。 |
| `[grow type index]` | `etc/pvpskilltree/*.etc` | PVP 表内 growtype 数字入口。 | 只在该 PVP 表上下文内解释。 |
| `[awakening type]` | `etc/pvpskilltree/*.etc` | PVP 表内觉醒阶段字段。 | 不证明 PVP 觉醒规则实际生效。 |
| `[static basic skill]` | `etc/pvpskilltree/*.etc` | PVP 静态基础技能候选。 | 不证明角色实际获得或等级正确。 |
| `[skill fitness growtype]` | `.skl` | 技能适配 growtype 候选列表。 | 不等于可学、可放、可命中。 |
| `[growtype maximum level]` | `.skl` | 按 growtype 分列的技能最大等级候选。 | 不证明 UI、SP/TP、装备加成或服务端最终上限。 |

## 跨文件族限制字段

| 字段 | 文件族 | 解释 | 风险边界 |
| --- | --- | --- | --- |
| `[usable job]` | `equipment/*.equ`、`stackable/*.stk` 等 | 职业 token 限制字段，可出现 `[all]` 或具体职业 token。 | 不证明装备可穿、物品可用、交易或服务端放行。 |
| `[item growtype]` | 少量 `stackable/*.stk` | 道具效果中按 growtype 限定的候选字段。 | 不证明技能加成或道具效果实机生效。 |
| `[SKILL_LEVEL]` | avatar / option 类字段中已有封存观察 | 技能等级加成字段，通常伴随 job token 与技能 ID。 | 必须按 job token 选 registry，不可裸 ID 解析。 |

## NUT / 运行时只读入口

| 符号 | 主目标观察 | 只读结论 | 风险边界 |
| --- | --- | --- | --- |
| `sq_getJob` | `sqr/` 下有命中 | 脚本文本存在读取角色职业的调用。 | 不证明调用路径实际执行。 |
| `sq_getGrowType` | `sqr/` 下有命中 | 脚本文本存在读取 growtype 的调用。 | 不证明运行时值与 `.chr` 静态块一致。 |
| `ENUM_CHARACTERJOB_*` | NUT 文本中可与 `sq_getJob` 同用 | 脚本层存在职业枚举常量引用。 | 常量数值和服务器规则不在本主线证明范围内。 |
| `GROW_TYPE_*` | NUT 文本中可与 `sq_getGrowType` 同用 | 脚本层存在 growtype 常量引用。 | 不把常量名直接映射为所有 `.chr` growtype 名称。 |

## 解析规则

- 角色 ID：先走 `character/character.lst`。
- 职业技能 ID：先确定职业，再走对应 `skill/*Skill.lst`。
- 技能树 `[index]`：先看同块 `[character job]`，再按职业 registry 解析。
- PVP `[job index]`：先回到主目标角色/技能入口顺序，再解释同块 `[grow type index]`。
- 装备/消耗品职业限制：只按 `[usable job]` token 记录静态限制，不推导实机结果。
