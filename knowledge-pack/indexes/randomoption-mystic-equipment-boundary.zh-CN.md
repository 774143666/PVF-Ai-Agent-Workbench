# RandomOption / Mystic / Equipment Random Boundary

状态：默认可用

用途：作为随机词条、mystic / avatar hidden option 和装备随机规则的封存矩阵。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 默认读法

1. `safety/README.zh-CN.md`
2. `task-cards/randomoption-mystic-readonly-audit.zh-CN.md`
3. `dictionaries/randomoption-mystic-fields.zh-CN.md`
4. `indexes/equipment-rule-fields.zh-CN.md`
5. 本矩阵

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| randomoption registry | `etc/randomoption/randomoption.lst` 注册 16 个随机词条文件，16 个全部存在，无缺失、无重复。 | 这是当前主目标规模；换目标 PVF 必须重查。 |
| skill random option registry | `etc/randomoption/randomoptionskill.lst` 存在，但 20 个注册目标文件均缺失。 | 当前主目标不能把 skill random option 当可用池；辅助对照存在不改变主目标事实。 |
| option 文件 | `etc/randomoption/options/*.etc` 可见 16 个词条文件，字段以 `[option]`、`[level]` 和属性字段为核心。 | 文件可读不证明实机抽取、应用、显示或概率。 |
| 支持表 | 主目标可见 overall、grouping、selection、quantity、part、numbering、auction category、regeneration 等固定配置文件。 | 这些文件不是 `randomoption.lst` 漏注册词条；按全局支持表处理。 |
| equipment 侧规则 | 注册 `.equ` 中只观察到 `[random option]`、`[no random]`、`[Force Result Item Rule]` 三类随机相关字段。 | 装备侧字段不是随机词条池本体；不能凭装备字段反推出完整随机系统运行成功。 |
| mystic / avatar hidden option | `etc/avatar_roulette/avatarfixedhiddenoptionlist.etc` 存在，含 `[mystic circle]`、`[upper]`、`[rare]` 和属性字段。 | 属于 avatar roulette 配置；不等同 equipment `[hidden option]`。 |
| hidden option 缺口 | 主目标未观察到 equipment `[hidden option]`，也不存在 `stackable/emblem/hidden_option.stk`。 | 不要用教程、文件名或辅助对照补写主目标不存在的入口。 |

## 代表链路

| 链路 | 可复用结论 | 不要推导 |
| --- | --- | --- |
| `randomoption.lst` -> `options/*.etc` | 随机词条 ID 应先按 registry 解析，再读取词条文件字段。 | 不要从 ID 大小、文件名或中文属性名直接猜运行效果。 |
| `optiongrouping.etc` -> option ID | 组内 ID 可回到 `randomoption.lst` 检查是否存在。 | 权重列不等于已验证实机概率。 |
| `optiongroupselection.etc` / `partselection.etc` -> 部位 token | 可见装备部位 token 与选择/权重列。 | token 不是 equipment registry ID；不证明某装备一定会获得该词条。 |
| `.equ` -> `[random option]` | 装备文件可标记随机规则入口；当前注册 `.equ` 全量样本值为 `1`。 | 不证明该装备在实机一定生成随机词条。 |
| `.equ` -> `[no random]` | 装备文件可标记禁止随机；当前样本为无值存在标记。 | 不要按布尔整数或分类 token 处理。 |
| avatar roulette -> `[mystic circle]` | 文件内可见 `2675818`，但该 ID 未按常规 `.lst` registry 闭合。 | 不猜成 stackable、equipment、商店物品或实机消耗物。 |

## 字段分布

| 字段 / 入口 | 主目标数量或值 | 结论 |
| --- | --- | --- |
| `etc/randomoption/` | 30 个文件，其中 27 个 `.etc`。 | 随机词条系统文件规模较小，但支持表齐全。 |
| `etc/randomoption/options/*.etc` | 16 个文件。 | 与 `randomoption.lst` 的 16 个注册项闭合。 |
| `etc/avatar_roulette/` | 1 个文件。 | avatar hidden option 入口集中在 `avatarfixedhiddenoptionlist.etc`。 |
| `[random option]` in registered `.equ` | 58 处，值均为 `1`。 | 当前主目标只确认 `1`；不把未观察值写成当前事实。 |
| `[no random]` in registered `.equ` | 221 处，均为空体存在标记。 | 按标签存在读取。 |
| `[Force Result Item Rule]` in registered `.equ` | 2374 处；值分布包括 `1 0`、`0 500`、`0 150`、`0 250`、`0 1000`、`0 30`。 | 数字列语义未封死；只作为装备规则字段保留。 |
| `[hidden option]` in registered `.equ` | 0 处。 | 当前主目标没有 equipment hidden option 字段事实。 |
| `[mystic circle]` | 值 `2675818`，常规 `.lst` registry 未命中。 | 只记录为未闭合内部引用。 |

## 辅助对照提示

辅助对照 PVF 的 `randomoption.lst` 注册 182 项且全部存在，`options/*.etc` 规模更大，`randomoptionskill.lst` 20 项也可闭合。该差异只提示其他版本可能具备更完整随机词条池；主目标仍以 16 个普通随机词条和缺失的 skill random option 文件为准。

## 封存验收

- 能从 `randomoption.lst` 闭合到每个 `options/*.etc`。
- 能说明 `randomoptionskill.lst` 在主目标当前是缺文件风险。
- 能区分随机词条文件、全局支持表、装备侧随机规则和 avatar roulette hidden option。
- 能说明 `[random option]`、`[no random]`、`[Force Result Item Rule]` 的主目标分布。
- 能说明主目标没有 equipment `[hidden option]`，也没有 `stackable/emblem/hidden_option.stk`。
- 能说明静态只读不能证明抽词条、洗词条、扣费、UI、资源或服务端放行。
