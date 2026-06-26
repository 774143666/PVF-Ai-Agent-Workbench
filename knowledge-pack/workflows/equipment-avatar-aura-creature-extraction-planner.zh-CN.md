# 装备 / 光环 / 时装 / 宠物提取 Planner 流程

状态：默认可用

## 适用

用于装备、光环、时装、宠物、宠物蛋等物品的只读依赖规划。目标是输出可审阅的 PVF 候选文件、registry 线索、未闭合引用和客户端资源风险。

本流程不写 PVF，不写 NPK，不部署客户端，不证明穿戴视觉、宠物召唤、光环特效或属性效果在实机中成功。

## 输入

- 源 PVF。
- equipment、stackable、creature 或 avatar/aura 相关 ID、PVF path、名称关键词。
- 可选客户端 `ImagePacks2`，只用于资源风险检查。

## 执行

1. 先确认 root 类型：equipment、stackable、creature、avatar/aura 相关装备或宠物蛋。
2. 数字 ID 必须按父类型 registry 解析；不要从数字大小猜类型。
3. 运行 item/stackable 依赖 planner 或等价只读闭合。
4. 对装备读取基础字段、视觉字段、appendage、common/equipment、set/partset、icon 和外部资源引用。
5. 对光环和时装额外检查 `[avatar func filter]`、光环/时装视觉字段、ANI 链、IMG/NPK 容器风险。
6. 对宠物和宠物蛋区分 creature 本体、stackable 蛋、技能/特效/图标和客户端资源。
7. 对套装关系只读解析 `equipmentpartset.etc`，不自动合并、不重排。
8. 把未命中 registry、缺失资源、跨系统引用、疑似客户端资源缺口写入 unresolved。

## 分层审阅

- 光环检查拆成 icon、装备字段、avatar/aura 字段、ANI 链、IMG/NPK 资源、目标客户端视觉六层。
- 可购买、可兑换、可装备只说明道具链路通过，不说明光环、时装或宠物外观资源通过。
- 图标闭合、external IMG 命中或装备字段存在，不等于穿戴视觉闭合。
- 宠物检查拆成 stackable/礼包入口、equipment creature 商品或蛋、creature 本体、技能/AI/资源四层。
- 宠物蛋或 child item 可用，不反推礼包 wrapper 可用；wrapper、child item 和宠物本体分别验收。

## 常用命令

```powershell
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --id=100 --type=equipment --depth=2
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --id=200 --type=stackable --depth=2
```

## 输出审阅

- root 解析结果和 root 类型。
- equipment、stackable、creature、appendage、common/equipment、partset 等候选文件。
- icon、ANI、IMG、external asset refs。
- unresolved references。
- registry additions preview。
- aura/avatar/creature 视觉或运行时风险。

## 验收

- root 唯一。
- registry 解析路径正确。
- read error 为 0，或已逐项解释。
- unresolved 已分类。
- 输出明确标记未写 PVF、未写 NPK、未改客户端。

## 边界

- planner 输出不是导入计划。
- icon 闭合不等于穿戴视觉闭合。
- 光环/时装视觉至少需要 PVF 字段、ANI 链、IMG/NPK 覆盖和目标客户端实机显示共同闭合。
- 宠物资源闭合不证明召唤、技能、AI 或特效成功。
- 宠物蛋、宠物装备、creature 本体和 pet registry 是不同层，不能互相代替。
- 真实导出、导入、写 PVF 或写 NPK 必须另走生产生命周期。
