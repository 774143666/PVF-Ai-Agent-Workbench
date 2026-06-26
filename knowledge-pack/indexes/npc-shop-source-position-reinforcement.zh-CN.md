# NPC Shop 资料线索补强索引

状态：已补强

适用范围：NPC Shop / Itemshop / Exchange / Price Boundary。

## 定位

本页用于说明：资料线索对 NPC 商店主线的作用是“定向排查”，不是直接产出字段事实。Workbench 的字段事实仍以主目标 PVF 只读观察为准。

## 资料线索确认的排查方向

资料线索与已封存主线一致支持以下排查顺序：

1. 先从 NPC 侧商店入口进入，确认 NPC 是否声明商店相关字段。
2. 再通过 itemshop registry 解析商店 ID，进入对应 `.shp` 文件。
3. 在 `.shp` 中查看商品列表、页签、每日商店或特殊商店结构。
4. 商品数字继续按父块上下文解析到正确 item registry。
5. 售价、点券、奖章、兑换材料等支付信息继续结合商品文件和字段父块判断。

## 已加固边界

- 商店链路不是“看到数字就找物品”，必须先确认父块和 registry。
- `[sell item]` 能定位商品列表，但不能单独证明购买可用、客户端显示正常或服务端放行。
- `[need material]` 等兑换字段可作为支付/材料线索，但必须结合商品文件上下文继续读。
- 每日商店、秘密商店、点券购买、页签显示等属于重点实验方向，静态只读不能证明刷新、概率、扣费或 UI 实际表现。

## 路由建议

当问题涉及“为什么这样查 NPC 商店”、“资料库是否支持该排查方向”、“商店支付材料怎么找”、“每日商店/秘密商店下一步怎么测”时，先读：

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/itemshop-shp.zh-CN.md`
- `dictionaries/npc-shop-fields.zh-CN.md`
- `indexes/npc-shop-itemshop-exchange-price-boundary.zh-CN.md`
- 本页

## 不能外推

本页不证明：

- 商店购买实机成功。
- 点券、奖章、金币、材料扣除逻辑实机一致。
- 每日商店刷新时间生效。
- 秘密商店或加百利类入口按预期出现。
- 客户端页签、文本、图标或资源完整。
- 服务器允许对应购买或兑换。
