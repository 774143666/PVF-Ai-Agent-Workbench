# Stackable / 礼包 / 宝珠 / 卡片提取预览任务卡

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `workflows/stackable-package-orb-card-extraction-planner.zh-CN.md`
- `indexes/stackable-package-orb-card-extraction-boundary.zh-CN.md`
- `dictionaries/stackable-fields.zh-CN.md`
- `dictionaries/stackable-container-package-fields.zh-CN.md`
- `dictionaries/upgrade-reinforce-amplify-enchant-recipe-fields.zh-CN.md`

## 执行

1. 按 `stackable/stackable.lst` 解析 root。
2. 判断 root 类型：普通 stackable、容器、礼包、宝珠、卡片、配方、任务物。
3. 解析候选物品、装备、材料、目标装备类型、附魔字段。
4. 按字段父块选择 registry，不能只看数字。
5. 输出依赖预览、unresolved、客户端资源风险。

## 补充检查

- 先判断 root 是普通可用道具，还是商业 wrapper、展示入口或兑换外壳。
- wrapper、package data、booster/random/selection 子层和 child item 分别记录；不要用任一层的成功或失败替代其它层。
- 对宝珠只确认 stackable、card/monster、目标装备类型、材料和 UI 风险链路；不承诺附魔运行时成功。
- 若 root 没有目标 PVF 内的普通获取路径，报告只写需验证，不猜外部服务端或插件控制。

## 验收

- root 唯一。
- 字段父块已确认。
- stackable/equipment/monster/itemshop/quest 没有混用 registry。
- 报告明确未写 PVF、未生成礼包、未模拟抽奖。
- 报告明确未证明开包、附魔、UI、材料扣除或奖励发放。

## 禁止

- 不把礼包解析写成礼包生成。
- 不把 `[enchant]` 解析写成附魔实机成功。
- 不把概率字段静态值写成实际掉率或抽奖结果。
- 不把 child item 可用写成 wrapper 可打开。
