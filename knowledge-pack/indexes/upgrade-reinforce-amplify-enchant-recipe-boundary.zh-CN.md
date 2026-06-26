# Upgrade / Reinforce / Amplify / Enchant / Recipe Boundary

状态：默认可用

用途：记录主目标 PVF 中强化、增幅、附魔、配方、配方商店和副职业制作修饰的静态只读边界。本文不授权写 PVF，不证明强化/增幅/附魔/制作/购买/材料扣除/金币扣除/UI/服务端规则成功。

## 审计快照

| 项 | 主目标 | 辅助对照 | 差异提示 |
| --- | ---: | ---: | --- |
| PVF 文件总数 | 402963 | 1052773 | 辅助体量更大。 |
| `equipment/equipment.lst` 条目 | 72631 | 107413 | 辅助装备 registry 更大。 |
| `stackable/stackable.lst` 条目 | 10372 | 20604 | 辅助消耗品 registry 更大。 |
| `itemshop/itemshop.lst` 条目 | 70 | 147 | 辅助商店 registry 更大。 |
| `npc/npc.lst` 条目 | 155 | 473 | 辅助 NPC registry 更大。 |

## 主目标标签计数

| 字段/线索 | 主目标命中文件数 | 代表文件 | 静态结论 |
| --- | ---: | --- | --- |
| `[equipment upgrade]` | 34 | `equipment/character/common/magicstone/n_magicstone_450135.equ` | 装备条件块可按 `upgrade`/`amplify` 条件写入 `.equ`。 |
| `[not amplify]` | 140 | `equipment/character/fighter/weapon/knuckle/102000029.equ` | 装备侧存在禁止增幅样标记。 |
| `[limit upgradable level]` | 1534 | `equipment/character/common/belt/larmor/111612.equ` | 装备侧可写普通强化与增幅强化等级段。 |
| `[impossible contents]` | 930 | `equipment/character/common/magicstone/n_magicstone_450135.equ` | 装备侧可写不可参与内容 token。 |
| `[possible kiri protect]` | 28872 | 多数装备文件 | 保护相关空标签广泛存在。 |
| `[upgrade prob increase]` | 11 | `equipment/character/common/title/vip_club.equ` | 强化概率修饰字段存在。 |
| `[upgrade cost discount]` | 7 | `equipment/character/common/title/vip_club.equ` | 强化费用折扣字段存在。 |
| `[assault cost discount]` | 1 | `equipment/character/common/title/i_am_bully.equ` | 街头争霸费用折扣与强化费用不是同一字段。 |
| `[item overpower part]` | 9 | `equipment/character/common/jacket/cloth/100050072.equ` | 少量套装装备可见特殊空标签。 |
| `[expertjob only]` | 26 | `equipment/character/common/support/support_440352.equ` | 副职业限制字段存在于装备和部分 stackable。 |
| `[prof compound rate]` | 3 | `equipment/character/common/wrist/brac_22237.equ` | 专业制作/合成率修饰线索存在。 |
| `[prof result variation]` | 2 | `equipment/character/common/support/support_440352.equ` | 专业制作结果变化线索存在。 |
| `[prof disjoint result variation]` | 1 | `equipment/character/common/support/support_440353.equ` | 分解结果变化线索存在。 |
| `[prof material variation]` | 1 | `equipment/character/common/support/support_440355.equ` | 材料变化线索存在。 |
| `[prof additional gain exp]` | 1 | `equipment/character/common/wrist/brac_22235.equ` | 副职业经验修饰线索存在。 |
| `[stackable type]` + `` `[recipe]` `` | 1046 | `stackable/professional/recipe/rcp_equip_enchant1.stk` | stackable 配方道具大族存在。 |
| `[bead item]` | 327 | `stackable/professional/recipe/rcp_28.stk` | 配方道具中常见宝珠/产物相关闭合块。 |
| `[enchant]` | 983 | `stackable/monstercard/mcard_agaress.stk`、`stackable/emblem/blue/brightemblem2_bluehitrate.stk` | 附魔字段跨怪物卡片和徽章等父类型出现，必须按父类型区分。 |
| 文件名含 `Recipe` | 996 | `itemshop/recipe1.shp`、`stackable/professional/recipe/*.stk` | 配方线索横跨 itemshop、stackable 和 etc 索引。 |

## 主目标代表链路

| 链路 | 主目标观察 | 已闭合 registry | 边界 |
| --- | --- | --- | --- |
| 装备条件 | `n_magicstone_450135.equ` 在 `[if]` 下有 `[equipment upgrade] upgrade > 14 ... amplify > 14 ... [/equipment upgrade]`。 | 文件本体来自 `equipment/equipment.lst` 家族。 | 只证明装备效果条件配置，不证明强化/增幅状态实机正确。 |
| 禁止增幅 | `102000029.equ` 写 `[not amplify] 1` 和 `[possible kiri protect]`。 | 装备 ID 按 `equipment/equipment.lst`。 | 不证明服务端拒绝增幅或保护券生效。 |
| 等级限制 | `111612.equ` 写 `[limit upgradable level] normal upgrade 30 54 amplify upgrade 55 90 [/limit upgradable level]`。 | 装备 ID 按 `equipment/equipment.lst`。 | 不证明最终可强化等级判断。 |
| 强化概率/费用 | `vip_club.equ` 写 `[upgrade prob increase] 10000`、`[upgrade cost discount] 30.0`。 | 装备称号按 `equipment/equipment.lst`。 | 不证明最终概率、叠加规则或金币扣除。 |
| 副职业修饰 | `brac_22237.equ` 写 `[expertjob only] enchanter 1` 与 `[prof compound rate] 5`。 | `22237` 按 `equipment/equipment.lst` 为附魔手镯。 | 不证明制作成功率公式。 |
| 配方道具 | `rcp_equip_enchant1.stk` 为 `[stackable type] [recipe]`，`[int data]` 中样本材料 `3167`、`3263`、`3227` 按 stackable 解析，结果 `22237` 按 equipment 解析。 | `2600507` 按 `stackable/stackable.lst` 为附魔师设计图。 | 不硬命名全部 `[int data]` 列，不证明学习或制作成功。 |
| 配方商店 | `npc/Klonter.npc [role]` 有 `[amplify item] 0` 与 `[item shop] 35`；`itemshop/itemshop.lst` 中 35 为 `Recipe3.shp`；`Recipe3.shp [sell item]` 为 `8238 1284 1183`。 | 8238、1284、1183 均按 `stackable/stackable.lst` 解析为增幅/扭转/净化相关消耗品。 | 不证明 NPC 商店 UI、购买或金币扣除成功。 |
| 诺顿配方入口 | `npc/Rothon.npc [role]` 有 `[item shop] 8`；`itemshop/itemshop.lst` 中 8 为 `Recipe1.shp`；主目标 `Recipe1.shp` 售卖为空。 | `13` 按 `npc/npc.lst` 为诺顿。 | 不用辅助版本的非空售卖表覆盖主目标。 |
| 怪物卡片附魔 | `mcard_agaress.stk` 写 `[stackable type] [material expert job]`、`[string data]` 卡面和目标 `` `[title name]` ``、`[int data] 101 61165`、`[enchant] physical/magical attack 15`、`[need material] 3340 20`。 | `3701` 按 stackable 为阿加雷斯卡片；`61165` 按 monster 为混乱的阿加雷斯；`3340` 按 stackable 为百万金币。 | 不证明卡片附魔成功、材料扣除或 UI 卡面显示。 |
| 徽章附魔 | `brightemblem2_bluehitrate.stk` 写 `[stackable type] [avatar emblem]`、`[avatar emblem target type] [D socket]` 和 `[enchant] [stuck] -0.4000000059604645`。 | 徽章仍按 `stackable/stackable.lst`。 | 属于 avatar/emblem/socket 边界，不等同怪物卡片附魔。 |

## `itemshop/itemshop.lst` 配方入口

| itemshop ID | 注册文件 | 主目标观察 |
| ---: | --- | --- |
| 8 | `Recipe1.shp` | 诺顿入口，主目标售卖为空。 |
| 32 | `Recipe2.shp` | 注册存在，主目标售卖为空。 |
| 35 | `Recipe3.shp` | 克伦特入口，主目标售卖 `8238`、`1284`、`1183`。 |

## 辅助对照提示

| 字段/线索 | 主目标 | 辅助对照 | 只读提示 |
| --- | ---: | ---: | --- |
| `[equipment upgrade]` | 34 | 12 | 辅助不是主目标的超集，不能覆盖主目标。 |
| `[not amplify]` | 140 | 141 | 基本同形，但数量不同。 |
| `[limit upgradable level]` | 1534 | 53 | 等级限制分布差异很大。 |
| `[upgrade prob increase]` | 11 | 16 | 辅助概率修饰命中更多。 |
| `[upgrade cost discount]` | 7 | 7 | 数量一致不代表数值或文件完全一致。 |
| `[expertjob only]` | 26 | 27 | 辅助多 1 个命中。 |
| `[prof compound rate]` | 3 | 4 | 辅助可见额外命中。 |
| `[bead item]` | 327 | 583 | 辅助配方/宝珠类配置更多。 |
| `[enchant]` | 983 | 2484 | 辅助附魔相关配置更多。 |
| `[stackable type]` + `` `[recipe]` `` | 1046 | 8879 | 辅助配方道具量级更大。 |
| 文件名含 `Recipe` | 996 | 7488 | 辅助有大量 recipe 相关文件。 |

辅助代表差异：

- 辅助 `itemshop/itemshop.lst` 同样注册 `Recipe1.shp`、`Recipe2.shp`、`Recipe3.shp`，但 itemshop 条目总数为 147。
- 辅助 `npc/Klonter.npc` 仍把 `[item shop]` 指向 35，`Recipe3.shp` 类型为 `[etc shop]`，页签为“其他、武器、防具、首饰”，售卖位 333 个；主目标 `Recipe3.shp` 只有 3 个售卖项。
- 辅助 `npc/Rothon.npc` 的 `Recipe1.shp` 有 11 个售卖项，主目标 `Recipe1.shp` 售卖为空。
- 这些只提示版本差异，不能把辅助配方商店、配方产物或高 ID 售卖项写入主目标结论。

## 静态与动态边界

静态只读可以确认：

- 字段、闭合块、文件家族、registry 路由和代表 ID 解析。
- 某些装备、stackable、itemshop、NPC 文件之间存在静态链路。
- 主目标和辅助对照在命中数、商店内容和 registry 体量上的差异。

静态只读不能确认：

- 强化、增幅、附魔、制作、学习、购买、材料扣除、金币扣除或装备状态改变成功。
- 强化概率、增幅概率、费用折扣、制作成功率、产物数量或材料变化的最终公式。
- NPC 对话、商店 UI、附魔 UI、配方 UI、卡片卡面、徽章镶嵌 UI 或客户端资源完整。
- 服务端是否采用这些字段、是否放行、是否另有覆盖规则。
- 辅助对照独有配置是否适用于主目标。
