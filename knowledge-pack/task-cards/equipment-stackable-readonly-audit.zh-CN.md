# 装备与道具只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/equipment-stackable.zh-CN.md`
- `dictionaries/equipment-fields.zh-CN.md`
- `dictionaries/stackable-fields.zh-CN.md`
- `workflows/item-stackable-dependency-planner.zh-CN.md`
- `indexes/item-stackable-dependency-planner-boundary.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 根据任务判断目标是装备、可堆叠道具、材料、消耗品、礼包、设计图还是任务物品。
3. 通过正确 registry 解析目标 ID，不能用全局搜索替代 registry。
4. 如果目标涉及依赖闭包、礼包候选、宝珠卡片、宠物蛋、光环 / 时装相邻资源或导入前审阅，先运行 item / stackable 只读 planner。
5. 审阅 planner 的 root、candidates、relations、unresolvedReferences、registryAdditionPreview 和 externalAssetRefs；planner 输出不是导入计划。
6. 读取目标 `.equ` 或 `.stk` 文件。
7. 记录基础显示字段：`[name]`、`[grade]`、`[rarity]`、说明文本。
8. 记录限制字段：`[minimum level]`、`[usable job]`、`[attach type]`。
9. 记录经济字段：`[price]`、`[cash]`、`[value]`、`[repair price]`、`[need material]`、`[medal]`。
10. 记录重量和类型字段：`[weight]`、`[equipment type]`、`[stackable type]`、`[sub type]`。
11. 记录资源字段：`[icon]`、`[field image]`、`[move wav]`。
12. 装备文件如有攻击、防御、速度、耐久、套装、触发或效果块，只做字段盘点，不直接下运行结论。
13. 道具文件如有宝箱/选择器块，解析候选装备或道具 ID。
14. 如果文件引用其他物品或材料，继续用对应 registry 解析。
15. 如果涉及商店价格，回到 NPC 商店链路确认这个商品确实被目标商店售卖。
16. 已有当前主目标局部样本：stackable 商店 `[price]` / `[need material]`、`[stack limit]`，equipment `[minimum level]` / `[usable job]`。这些样本只作为边界参考，不外推到所有物品类型。

## 验收

- 目标 ID 已经通过正确 registry 解析。
- 已说明目标文件是 equipment 还是 stackable。
- `[grade]`、`[rarity]`、`[weight]` 已记录，未凭空省略。
- 材料 ID 没有从数字形状猜测。
- `[minimum level]`、`[usable job]` 已有一个当前主目标装备限制样本；新装备或新职业仍需游戏内确认。
- `[passive object]` 没有被当作可直接写装备效果的入口。
- 宝箱/选择器里的候选 ID 已按 equipment 或 stackable registry 解析。
- 如使用 planner，root 唯一、readErrorCount 为 0，且 unresolved / external IMG 风险已记录。
- 没有生成输出 PVF，没有改客户端。
