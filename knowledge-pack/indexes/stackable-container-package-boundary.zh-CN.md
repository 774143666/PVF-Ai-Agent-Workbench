# Stackable Container / Package Boundary

状态：默认可用

用途：作为 stackable 容器、礼包、选择箱、随机箱、候选池和礼包预览字段的封存矩阵。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 默认读法

1. `safety/README.zh-CN.md`
2. `task-cards/stackable-container-package-readonly-audit.zh-CN.md`
3. `dictionaries/stackable-container-package-fields.zh-CN.md`
4. `dictionaries/stackable-fields.zh-CN.md`
5. 本矩阵

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| registry | `stackable/stackable.lst` 注册 10372 项，全部存在，无缺失文件。 | 路径重复注册不等于缺文件；具体 ID 仍按 registry 行解析。 |
| 固定礼包 | `[package data]` 观察到 3623 处。 | 只证明静态包内容配置；不证明打开或发奖成功。 |
| 可选礼包 | `[package data selection]` 观察到 110 处。 | 可选 UI、限选数量和发放需实机确认。 |
| booster 选择器 | `[booster info]` 1019 处，分类/选择字段各 250 处，分类名 170 处。 | 分类数字必须结合完整块读取，不能裸猜。 |
| 候选池块 | `[equipment]` 225、`[avatar]` 211、`[stackable]` 157、`[creature]` 17。 | 块名决定 registry；不要从数字外形猜。 |
| 随机箱 | `[random]` / `[random list]` 各 7 处。 | 候选池和权重静态可见，不证明实机概率。 |
| 预览资源 | `[avatar package preview info]` 882 处。 | 只证明 PVF 内资源引用，不证明客户端 IMG 存在。 |

## 代表链路

| 链路 | 可复用结论 | 不要推导 |
| --- | --- | --- |
| `stackable.lst` -> `.stk` -> `[package data]` | 固定礼包可列出候选 ID 与数量类数字。 | 不要把所有列都当 ID；不证明开包成功。 |
| `stackable.lst` -> `.stk` -> `[package data selection]` | 可选礼包可列出候选 ID 与数量类数字。 | 不证明 UI 选择、限选和发奖。 |
| booster 分类字段 -> `[equipment]` / `[avatar]` / `[stackable]` / `[creature]` | 选择器通过分类字段和候选块组合形成候选池。 | 不要跨块混用 registry。 |
| `[avatar]` 候选 | 候选 ID 按 equipment registry 闭合。 | 不要按 stackable 或 creature registry 解释。 |
| `[creature]` 候选 | 代表样本可闭合到 `equipment/creature/*.equ`，包括宠物蛋。 | 不要直接当 `creature/creature.lst` ID。 |
| `[random list]` | 可见随机候选池和权重/数量/标记类数字。 | 权重不等于已验证实机概率。 |

## 辅助对照提示

辅助对照 PVF 的 `stackable/stackable.lst` 注册 20604 项且全部存在；容器/礼包核心 tag 命中 10251 个文件，礼包路径候选 2359 个。辅助对照规模更大，只说明其他版本有更多容器/礼包配置，不覆盖主目标的 10372 项 registry 与字段分布。

## 封存验收

- 能从 stackable ID 闭合到 `.stk`。
- 能区分固定礼包、选择礼包、booster 选择器和随机箱。
- 能按父块把候选 ID 闭合到 `equipment`、`stackable` 或 equipment creature 语境。
- 能说明预览资源字段不证明客户端资源完整。
- 能说明静态只读不能证明开包、选择、扣除、发奖、概率或服务端放行。
