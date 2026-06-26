# Stackable / 礼包 / 宝珠 / 卡片提取 Planner 流程

状态：默认可用

## 适用

用于 stackable 道具、礼包、宝箱、选择箱、随机箱、宝珠、怪物卡片、附魔材料链的只读依赖规划。

本流程只做解析和预览，不生成礼包，不模拟抽奖，不写 PVF，不写 NPK，不证明开箱、附魔、材料扣除或奖励发放成功。

## 输入

- 源 PVF。
- stackable ID、PVF path、名称关键词，或只读抽样条件。
- 可选 depth，默认保持保守深度。

## 执行

1. 先按 `stackable/stackable.lst` 解析 root。
2. 读取 `[stackable type]`，判断是普通道具、礼包/容器、宝珠/卡片、配方、任务物或其它类型。
3. 对礼包、宝箱、选择箱、随机箱，解析候选道具列表、候选装备列表、数量、权重或条件字段；所有数字按父字段选择 registry。
4. 对宝珠和怪物卡片，解析 `[enchant]`、目标装备类型、材料需求、可能的怪物/卡面引用。
5. 对配方或材料链，区分产物 equipment、材料 stackable、NPC itemshop 或任务条件引用。
6. 对 icon、explain、string link、external IMG 和客户端资源只做风险记录。
7. 未命中 ID、未支持字段、跨系统引用全部进入 unresolved。
8. 输出 preview index，不生成可直接 apply 的 patch。

## 分层读法

- 礼包、宝箱、选择箱和随机箱必须拆成 root wrapper、候选内容、选择/随机/booster 子层、最终产物四层读取。
- root wrapper 在 registry 或 iteminfo 中存在，不等于可右键交互、可开启或可发放。
- `[package data]` 只说明候选内容配置，不证明 root 自身可打开。
- 随机箱和 booster 类对象至少分开记录 root 可交互、输出物生成、输出物可用、客户端资源可见四个验收层。
- 宝珠/卡片链拆成宝珠 stackable、卡片或怪物线索、附魔目标类型、材料和 UI 验证；不要把 `[enchant]` 写成所有目标附魔成功。
- 如果 root 只在商业包装或展示入口中出现，且目标 PVF 没有普通获取路径，只能标为需目标验证；不要推断服务端插件或外部代码行为。

## 常用命令

```powershell
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --id=200 --type=stackable --depth=2
node "tools\pvf-bridge\plan-item-stackable-dependencies.js" --pvf="E:\path\Script.pvf" --sample-kind=stackable --sample-keyword=package
```

## 输出审阅

- root stackable 解析结果和类型。
- 容器候选物品、候选装备、数量、概率/权重字段。
- 宝珠/卡片的 `[enchant]`、目标类型、材料需求。
- 关联 equipment、stackable、monster、itemshop、quest 线索。
- unresolved references。
- string link、icon、external asset refs 风险。

## 验收

- root 唯一。
- 每个数字 ID 都按父字段选择 registry。
- 容器、宝珠、卡片、配方没有混用字段语义。
- unresolved 和客户端资源风险已列出。
- 输出明确标记未写 PVF、未生成礼包、未模拟抽奖。

## 边界

- 礼包/宝箱候选列表闭合不证明开箱成功。
- 子物品可用不反推 wrapper 可用；wrapper 和 child item 必须分别验收。
- 概率/权重字段可读不证明服务端抽奖逻辑一致。
- `[enchant]` 可读不证明附魔成功、材料扣除或 UI 正常。
- 生成礼包、生成任务、生成配方属于 authoring template，不属于默认提取 planner。
