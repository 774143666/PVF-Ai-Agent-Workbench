# Upgrade / Reinforce / Amplify / Enchant / Recipe 文件类型

状态：默认可用

本文解释强化、增幅、附魔、配方和副职业制作相关配置分布在哪些 PVF 文件类型中，以及它们如何路由。

## 是什么

本主线不是一个独立“强化系统文件”。主目标观察到的静态配置分散在多个文件家族中：

- `equipment/**/*.equ`：装备本体，承载强化/增幅条件、禁止增幅、可强化等级限制、强化概率/费用修饰和副职业装备修饰。
- `stackable/**/*.stk`：消耗品、配方、怪物卡片、徽章、专业道具和增幅/净化相关道具。
- `stackable/professional/recipe/*.stk`：副职业配方道具，常见 `[stackable type] [recipe]`、`[int data]`、`[bead item]`、`[string data]`。
- `stackable/monstercard/*.stk`：怪物卡片，常见 `[string data]`、`[int data]`、`[enchant]`、`[need material]`。
- `itemshop/*.shp`：NPC 商店页，`Recipe1.shp`、`Recipe2.shp`、`Recipe3.shp` 是配方/增幅相关商店入口。
- `itemshop/itemshop.lst`：商店 registry，决定 `.shp` 文件的真实 itemshop ID。
- `npc/*.npc`：NPC 角色入口，`[role]` 可把 NPC 连接到 `[item shop]` 或 `[amplify item]`。
- `etc/itemdictionary/(r)recipelistmakeequip.etc`：装备配方展示/索引类表，含 `[equipRecipe list]`。

## 常见 registry

| Registry | 解析对象 |
| --- | --- |
| `equipment/equipment.lst` | 装备、称号、饰品、防具、武器、部分配方结果装备。 |
| `stackable/stackable.lst` | 配方、材料、怪物卡片、徽章、增幅书、净化书、消耗品。 |
| `itemshop/itemshop.lst` | `.shp` 商店文件入口。 |
| `npc/npc.lst` | NPC 文件入口。 |
| `monster/monster.lst` | 怪物卡片 `[int data]` 中的怪物样本 ID。 |

## 典型路由

1. 查装备强化/增幅条件：从 `equipment/equipment.lst` 定位 `.equ`，读取 `[equipment upgrade]`、`[not amplify]`、`[limit upgradable level]`、`[possible kiri protect]`。
2. 查强化概率/费用修饰：在 `.equ` 内读取 `[upgrade prob increase]`、`[upgrade cost discount]`，不要只看说明文本。
3. 查副职业装备修饰：同文件合读 `[expertjob only]` 与 `[prof compound rate]`、`[prof result variation]`、`[prof material variation]` 等字段。
4. 查配方道具：从 `stackable/stackable.lst` 定位 `[stackable type] [recipe]` 的 `.stk`，读取 `[int data]`、`[bead item]`、`[string data]`，再按父块解析材料和结果 ID。
5. 查配方商店：从 NPC `[role]` 的 `[item shop]` 数字进入 `itemshop/itemshop.lst`，再读对应 `.shp [sell item]`。
6. 查怪物卡片附魔：从 `stackable/monstercard/*.stk` 读取 `[string data]` 目标装备 token、`[int data]` 卡面/怪物样列、`[enchant]` 属性块和 `[need material]`。
7. 查徽章附魔：从徽章 `.stk` 读取 `[avatar emblem target type]` 和 `[enchant]`，再转 Avatar / Emblem / Socket 主线判断边界。
8. 查装备配方展示索引：读 `etc/itemdictionary/(r)recipelistmakeequip.etc [equipRecipe list]`，只作为展示/索引表形态，不替代配方道具本体。

## 常见误区

- 不要把 `Recipe1.shp` 文件名猜成 itemshop ID 1；主目标 `itemshop/itemshop.lst` 中它是 ID 8。
- 不要把 `Recipe3.shp [sell item]` 的数字直接写成装备或 stackable；必须按商店语境解析。
- 不要把 `[enchant]` 一律写成怪物卡片附魔；徽章也可出现该块。
- 不要把配方 `[int data]` 的第一列、最后几列硬套成全局公式。
- 不要把 `upgrade prob increase` 的数值直接写成百分比。
- 不要把 `upgrade cost discount` 的数值直接写成最终金币扣费。
- 不要把 `[possible kiri protect]` 写成保护券实机生效。
- 不要把辅助 PVF 的大商店、大 registry 或更多配方文件写成主目标内容。

## 必须验证的地方

静态只读只能证明配置存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 强化、增幅、附魔、制作、学习配方、购买和材料扣除是否成功。
- 强化/增幅概率、费用折扣、副职业成功率、产物数量和材料变化的最终公式。
- 保护券、NPC 强化/增幅入口、配方商店、附魔 UI、徽章 UI 是否可见可用。
- 金币、材料、卡片、配方、装备状态是否正确增减或改变。
- 卡面、图标、商店页签、说明文本、声音和客户端资源是否完整显示。
- 服务端是否采用 PVF 字段，是否另有配置覆盖。
