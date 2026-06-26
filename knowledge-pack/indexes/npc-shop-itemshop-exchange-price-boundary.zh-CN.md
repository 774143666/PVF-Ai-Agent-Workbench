# NPC Shop / Itemshop / Exchange / Price Boundary

状态：默认可用

用途：作为 NPC 商店、itemshop、兑换材料、价格字段和特殊商店边界的封存矩阵。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 默认读法

1. `safety/README.zh-CN.md`
2. `encyclopedia/pvf-file-types/itemshop-shp.zh-CN.md`
3. `dictionaries/npc-shop-fields.zh-CN.md`
4. `task-cards/npc-shop-readonly-audit.zh-CN.md`
5. 本矩阵

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| registry | `npc/npc.lst` 注册 155 个 NPC；`itemshop/itemshop.lst` 注册 70 个商店 ID；`itemshop/` 下观察到 75 个文件。 | 数量是当前主目标事实；换目标 PVF 必须重查。 |
| 基础入口 | `npc/*.npc` 的 `[role]` 块可放商店相关 role；role 字符串后的数字通过 `itemshop/itemshop.lst` 解析到 `.shp`。 | 不要只搜裸 `[item shop]`；实际文件里 role 字符串带反引号。 |
| 普通商店 | `` `[item shop]` `` 样本可闭合到 `.shp`，例如普通 NPC、事件 NPC、职业/区域 NPC。 | 静态闭合不证明 NPC 在实机可见或商店按钮一定出现。 |
| 生产类商店 | `` `[product item]` `` 样本也可解析到 `itemshop/itemshop.lst` 中的 `.shp`。 | role 类型不同，后续修改要确认入口功能，不要直接等同普通售卖商店。 |
| 秘密商店 | `` `[secret shop]` `` 样本可解析到 `itemshop/itemshop.lst` 中的 `.shp`；加百利类 NPC 还可见通关后可见字段。 | 副本通关出现、商品生成、购买和服务端放行都不是静态可证明事实。 |
| `.shp` 基本结构 | 72 个 `.shp` 命中 `[type]` 和 `[sell item]`；52 个命中 `[tab name]`。 | 未命中页签不代表文件无效；页签显示仍需客户端确认。 |
| 每日商店 | 观察到唯一每日结构，含 `[one a day start time]` 和多组 `[one a day item]`。 | 每日刷新、限购、领取和购买必须实机确认。 |
| 日志结构 | 观察到唯一 `[log item]` / `[item]` 特殊结构。 | 不能当普通 NPC 售卖列表使用。 |

## 代表链路

| 类型 | 链路 | 可复用结论 |
| --- | --- | --- |
| 普通商品商店 | NPC `[role]` 中 `` `[item shop]` `` -> 商店 ID -> `.shp` -> `[sell item]`。 | `[sell item]` 正数是商品候选 ID；`-1`、`-2` 等负数只作控制值线索。 |
| 装备和道具混合 | `.shp` 同一 `[sell item]` 列表里可同时出现 `equipment` 和 `stackable` 商品。 | 商品 ID 必须按 registry 解析，不能从 ID 位数或大小判断类型。 |
| 材料兑换 | 商品文件中 `[need material]` 可出现材料 ID 与数量组合。 | 当前主目标已有 stackable 材料兑换样本；材料 ID 仍要按 `stackable/stackable.lst` 等正确 registry 解析。 |
| 金币/点券/胜点 | 商品文件中可见 `[price]`、`[cash]`、`[medal]`。 | 当前主目标已有 stackable 金币购买样本；点券、胜点、账号余额和特殊服务端开关仍需各自验证。 |
| 活动商店 | 活动 NPC 可通过 `[role]` 指向活动 `.shp`，商品可闭合到 `stackable`。 | 活动开关、任务条件、服务器时间和客户端字符串显示需另验。 |

## 商品 ID 解析边界

| 观察 | 结论 |
| --- | --- |
| `2650912` | 在商店样本中解析为 `stackable` 设计图商品，商品文件含 `[need material]`。 |
| `22126` / `32305` | 在商店样本中解析为 `equipment` 商品，商品文件可见装备价格或材料字段。 |
| `8227` / `8232` | 全局解析可同时命中 `stackable` 和 `passiveobject`。在商店商品和材料上下文中，应按 `stackable` registry 解释。 |
| `10000402` / `10000531` | 每日商店候选项解析为 `stackable`。 |

## 字段边界

| 字段 | 静态可见含义 | 不可静态证明 |
| --- | --- | --- |
| `[role]` | NPC 功能入口，商店相关 role 后接商店 ID。 | 所有 role 数字都能按商店 ID 处理。 |
| `[NPC]` | `.shp` 回指 NPC ID。 | 可替代正向 registry 闭合。 |
| `[type]` | 商店类型字符串。 | 商品类型、价格类型或服务端规则。 |
| `[sell item]` | 普通售卖候选列表。 | 实机购买成功、扣费成功、UI 一定显示。 |
| `[tab name]` | 页签名称列表。 | 页签和负数控制值的完整运行映射。 |
| `[one a day start time]` | 每日商店开始时间线索。 | 每日刷新实机正确。 |
| `[one a day item]` | 每日商店候选商品列表。 | 限购、领取、刷新和购买成功。 |
| `[log item]` / `[item]` | 特殊日志项结构。 | 普通 NPC 售卖列表。 |
| `[price]` | 商店链路中商品金币价格入口。 | 当前主目标已有 stackable 商品购买样本；不代表所有文件族同名字段语义一致。 |
| `[cash]` | 商店链路中点券 / CERA 类价格入口。 | 真实扣点券成功。 |
| `[need material]` | 商店链路中材料兑换入口。 | 当前主目标已有 stackable 商品材料兑换样本；不代表所有活动兑换、账号计数或服务端开关通用。 |
| `[medal]` | 商店链路中装备胜点类价格入口。 | 任意 PVP 材料 ID 等同胜点。 |

## 辅助对照提示

辅助对照 PVF 的 `itemshop/itemshop.lst` 注册项更多，`itemshop/` 文件更多，基础 `Linus -> 2 -> EquipmentShop1.shp` 链路仍同向存在，但商品列表和页签更丰富。辅助对照只能提示“同类结构可能扩展”，不能覆盖主目标事实。

## 封存验收

- 能从 NPC 名称或 ID 闭合到 `.npc`。
- 能从 `[role]` 找到商店相关入口，并通过 `itemshop/itemshop.lst` 解析到 `.shp`。
- 能识别 `.shp` 的 `[NPC]`、`[type]`、`[sell item]`、`[tab name]`、特殊每日/日志结构。
- 能把正数商品 ID 按正确 registry 闭合到 `equipment` 或 `stackable`。
- 能把价格和兑换材料回到商品文件，而不是凭 `.shp` 猜。
- 能明确说出当前主目标只覆盖普通金币购买和材料兑换局部样本；特殊商店、每日刷新、点券、胜点、服务端开关和资源完整性仍需另验。
