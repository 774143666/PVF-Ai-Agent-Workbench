# 装备 / 光环 / 时装 / 宠物提取预览任务卡

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `workflows/equipment-avatar-aura-creature-extraction-planner.zh-CN.md`
- `indexes/equipment-avatar-aura-creature-extraction-boundary.zh-CN.md`
- `workflows/item-stackable-dependency-planner.zh-CN.md`

## 执行

1. 确认源 PVF 和 root 类型。
2. 按正确 registry 解析 ID 或 path。
3. 运行 item/stackable 依赖 planner。
4. 审阅 equipment、stackable、creature、appendage、partset、icon、ANI/IMG 候选。
5. 对光环/时装额外审阅 avatar/aura 视觉风险。
6. 对宠物额外审阅 creature 与 stackable 蛋的分离关系。
7. 输出预览清单和 unresolved。

## 补充检查

- 光环必须从 `[aurora graphic effects]` 继续审阅到 ANI，再审阅 ANI 内部 IMG/NPK 风险。
- 宠物必须区分 stackable 入口、equipment creature、creature 本体和 pet registry。
- 可购买、可兑换、可装备只说明道具链路通过，不说明外观、技能、AI 或特效资源通过。
- 若涉及礼包或宠物蛋，wrapper、child item 和宠物本体分别验收。

## 验收

- root 唯一。
- 候选依赖已按类型分组。
- 未闭合引用和客户端资源风险已列出。
- 报告明确未写 PVF、未写 NPK、未部署客户端。
- 光环、时装和宠物运行时效果已明确标记为后续实机验证项。

## 禁止

- 不把图标显示当成穿戴视觉成功。
- 不把 PVF 引用当成 NPK/ImagePacks2 资源存在。
- 不自动写入 `equipmentpartset.etc` 或 `.lst`。
- 不把宠物蛋可用写成礼包 wrapper 可打开。
