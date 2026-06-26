# Item / Stackable 依赖 Planner 流程

状态：默认可用

## 适用

用于装备、可堆叠道具、礼包、宝珠、宠物蛋、时装 / 光环相邻资源的只读依赖规划。

本流程只生成依赖候选、registry 线索、未闭合引用和客户端资源风险提示；不写 PVF，不生成可直接 apply 的 patch，不改客户端。

## 输入

- 目标 PVF。
- equipment 或 stackable 的 ID、PVF path、query，或只读抽样条件。
- 可选 depth；默认保持保守深度。

## 执行

1. 确认目标 PVF，只读打开。
2. 通过对应 `.lst` registry 解析 root，不能从数字外形猜类型。
3. 运行 `tools/pvf-bridge/plan-item-stackable-dependencies.js`。
4. 检查 root 是否唯一。
5. 审阅候选文件列表，区分 equipment、stackable、creature、appendage、monster、passiveobject 等类型。
6. 审阅关系摘要，确认哪些引用 closed，哪些仍 open。
7. 审阅 unresolved report，不把未闭合引用静默当作成功。
8. 审阅 registry additions preview，只作为导入前审阅线索。
9. 审阅 external IMG / NPK 风险；客户端资源完整性必须另查。
10. 如命中 `equipmentpartset.etc`，只做块和成员核查，不自动合并或重排。
11. 如果候选包含光环或时装装备，额外检查 `[avatar func filter]`、`[aurora graphic effects]`、ANI 依赖和客户端资源包来源；planner 的 icon / external IMG 输出不等于外观闭包。

## 验收

- rootCount 为 1。
- readErrorCount 为 0。
- 输出边界显示未写 PVF、未改客户端。
- registry ID 已按正确 registry 解析。
- unresolved 和 external IMG 风险已写清，不被当成可忽略项。

## 常用命令

```powershell
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --id=100 --type=equipment --depth=2
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --id=200 --type=stackable --depth=2
```

## 边界

- planner 输出不是导入计划。
- Script.pvf 引用不证明客户端 `ImagePacks2` / NPK 资源存在。
- 礼包开启、宝珠附魔、光环视觉、宠物运行时都需要后续目标验证。
- 光环视觉至少需要 avatar 字段、ANI 链、IMG/NPK 覆盖和目标客户端实机显示共同闭合。
- 真实导出、导入、写 PVF 或写 NPK 必须另走生产生命周期。
