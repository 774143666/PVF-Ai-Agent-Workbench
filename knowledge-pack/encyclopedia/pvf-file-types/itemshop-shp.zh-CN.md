# itemshop/.shp 商店文件

状态：默认可用

## 用途

配置 NPC 商店入口、页签和售卖物。常用于普通 NPC 商店、活动兑换、材料兑换、点券商品和胜点商品核查。

## 常见路径

- `npc/*.npc`
- `npc/npc.lst`
- `itemshop/itemshop.lst`
- `itemshop/*.shp`
- `equipment/**/*.equ`
- `stackable/**/*.stk`
- `cash/**/*.stk`

## 核心闭环

```text
npc/*.npc 的 [role]
-> `[item shop]` / `[product item]` / `[secret shop]` 等商店相关 role
-> itemshop/itemshop.lst
-> itemshop/*.shp
-> [sell item]
-> 按上下文解析商品 registry
-> 读取 equipment / stackable 等商品文件
```

`.shp` 主要回答“这个商店卖哪些候选商品”。价格、点券、材料兑换和胜点等条件通常继续从商品文件读取。

## 常见块

- `[NPC]`：回指 NPC ID，用于核对 `.shp` 归属。
- `[type]`：商店类型字符串，例如武器商店或杂货商店。
- `[message]`：商店打开提示文本或字符串链接。
- `[sell item]`：普通售卖候选商品列表。
- `[tab name]`：页签名称列表，可为空或不存在。
- `[one a day start time]` / `[one a day item]`：每日轮换商店结构。
- `[log item]` / `[item]`：日志或购买记录类特殊结构，不能直接当普通售卖列表。

## 规则

- `[role]` 中商店相关 role 后面的数字通常是商店 ID，不是商品 ID。
- 商店 ID 通过 `itemshop/itemshop.lst` 解析。
- `[sell item]` 中的正数通常是商品候选 ID。
- `[one a day item]` 中的正数也要按商品 registry 解析。
- `-1`、`-2` 等负数不要当商品 ID 解析，只能作为布局、空位、分隔或控制值线索。
- 商品 ID 必须按上下文 registry 解析，不能只用全局搜索结果下结论。
- `[price]`、`[cash]`、`[need material]`、`[medal]` 等支付字段一般在商品文件里确认。
- 同一个商品 ID 不能脱离 registry 判断类型。
- 加百利类 `[secret shop]` 可静态闭合到 `.shp`，但实机出现和可购买仍受副本通关、服务端和运行流程影响。

## 常见支付字段

- `[price]`：普通金币价格，适用于 NPC 商店出售链路中的 `stackable` 商品。
- `[cash]`：点券 / CERA 类价格，适用于现金类商品。
- `[need material]`：材料兑换条件，通常按材料 ID 和数量成组出现。
- `[medal]`：胜点类价格，常见于商店出售链路中的装备商品。

## 写入边界

改商店前必须确认目标 NPC、目标 `.shp`、商品 registry、商品文件、输出 PVF 和读回结果。改价格或兑换材料时，不能只改 `.shp`，还要确认对应商品文件。
