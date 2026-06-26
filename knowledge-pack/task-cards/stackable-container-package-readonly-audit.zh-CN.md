# Stackable Container / Package 只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `dictionaries/stackable-fields.zh-CN.md`
- `dictionaries/stackable-container-package-fields.zh-CN.md`
- `indexes/stackable-container-package-boundary.zh-CN.md`
- `encyclopedia/pvf-file-types/equipment-stackable.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 通过 `stackable/stackable.lst` 定位目标 `.stk`，不要只靠文件名、中文名或 ID 大小。
3. 先读基础字段：`[name]`、`[stackable type]`、`[rarity]`、`[attach type]`、`[usable job]`、`[minimum level]`、`[icon]`。
4. 如果文件含 `[package data]` 或 `[package data selection]`，把候选数字按父块上下文解析，不能直接认定都是 stackable。
5. 如果文件含 `[booster category num]`、`[booster selection num]`、`[booster select category]`、`[booster category name]`，按选择器/分类箱读取完整分类块。
6. 如果文件含 `[equipment]`、`[stackable]`、`[avatar]`、`[creature]`、`[recommend]`、`[default select]`、`[result item]`，按块名选择 registry：装备和 avatar 候选走 `equipment/equipment.lst`，stackable 候选走 `stackable/stackable.lst`，creature 候选优先核 equipment creature 语境。
7. 如果文件含 `[random]` / `[random list]`，只记录静态候选池和列形，不把权重写成已验证实机概率。
8. 如果文件含 `[avatar package preview info]` 或图标/预览 IMG 路径，只写 PVF 内引用；客户端资源完整性另验。
9. 辅助对照 PVF 只记录结构和规模差异，不提升为主目标事实。

## 验收

- 能说清目标 ID 来自 `stackable/stackable.lst`。
- 能区分固定礼包 `[package data]`、可选礼包 `[package data selection]`、booster 选择器、随机箱 `[random list]`。
- 能把 `[equipment]`、`[avatar]`、`[stackable]`、`[creature]` 等块里的候选 ID 按正确 registry 闭合。
- 能说明 `avatar package preview info` 只是客户端资源引用，不证明资源存在。
- 能说明静态只读不能证明开包成功、选择 UI 正常、发奖成功、概率正确、背包足够或服务端放行。
- 不生成输出 PVF，不改客户端，不写运行产物进 knowledge-pack。

## 运行边界

静态只读能证明“`.stk` 文件存在、字段存在、候选 ID 在指定 registry 中可闭合”。它不能证明实机可打开、可选择、可领取、随机概率正确、物品发放成功、背包容量足够、客户端资源完整或服务端放行。
