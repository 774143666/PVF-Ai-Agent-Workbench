# NPC 商店只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/itemshop-shp.zh-CN.md`
- `dictionaries/npc-shop-fields.zh-CN.md`
- `workflows/npc-shop-edit.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 用 NPC 名称或 `npc/npc.lst` 定位目标 `npc/*.npc`。
3. 读取 NPC 文件里的 `[role]`，确认是否存在 `` `[item shop]` ``、`` `[product item]` ``、`` `[secret shop]` `` 等商店相关 role。
4. 取商店相关 role 后面的数字，用 `itemshop/itemshop.lst` 解析商店 ID。
5. 读取目标 `itemshop/*.shp`。
6. 读取 `[NPC]`、`[type]`、`[message]`、`[sell item]` 和可选 `[tab name]`。
7. 普通商店读取 `[sell item]`，每日商店读取 `[one a day item]`；跳过 `-1`、`-2` 等负数控制值。
8. 对每个正数商品 ID 按上下文解析 `stackable`、`equipment` 或 `cash` 等 registry。
9. 读取商品文件，记录 `[name]`、商品类型、`[price]`、`[cash]`、`[need material]`、`[medal]` 等字段。
10. 加百利、每日轮换、日志项、活动商店等只做代表样本闭合；实机出现、刷新、购买和扣费单列风险。
11. 普通金币购买和材料兑换已有当前主目标局部实机样本；点券、胜点、每日刷新、活动商店和服务端开关仍单列风险。

## 验收

- 能说清目标 NPC 使用哪个 `.npc` 文件。
- 能说清 `[role]` 中哪个商店相关入口解析到了哪个 `.shp` 文件。
- 商品 ID 都有 registry 解析结果。
- 负数控制值没有被当成商品。
- 每个商品的价格或材料来源都来自商品文件，不是凭 `.shp` 猜。
- 特殊商店没有被写成实机出现、购买成功或服务端放行事实。
- 普通购买链路没有被外推到点券、胜点、每日刷新、活动商店或所有商品资源。
- 不生成输出 PVF，不改客户端，不写运行产物进 knowledge-pack。
