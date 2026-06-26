# Upgrade / Reinforce / Amplify / Enchant / Recipe 只读核查

状态：默认可用

用途：用于复核装备强化/增幅字段、强化保护标记、强化概率和费用修饰、副职业制作修饰、附魔卡片、徽章附魔、配方道具、配方商店和 `etc/itemdictionary` 配方索引的静态边界。本文只回答“配置在哪里、数字按哪个父块和 registry 解释、哪些结论必须继续实机验证”，不证明强化成功、增幅成功、附魔成功、制作成功、材料扣除成功、金币扣除成功、NPC UI 正常、客户端资源完整或服务端放行。

## 默认读法

1. 先读 `safety/README.zh-CN.md`，确认当前任务只读，不写 PVF。
2. 再读 `dictionaries/upgrade-reinforce-amplify-enchant-recipe-fields.zh-CN.md`，确认字段和父块边界。
3. 需要主目标矩阵时读 `indexes/upgrade-reinforce-amplify-enchant-recipe-boundary.zh-CN.md`。
4. 需要文件类型解释时读 `encyclopedia/pvf-file-types/upgrade-reinforce-amplify-enchant-recipe.zh-CN.md`。
5. 如果问题转向 NPC 商店、装备基础字段、stackable 容器、随机词条、活动奖励、客户端 UI 或资源加载，转读对应已封存主线，不在本主线扩大采样。

## 核查顺序

1. 高价值资料、教程、社区注释和工具字段只能作定向线索；字段结论必须回主目标 PVF 只读观察。
2. 装备强化/增幅先读 `.equ` 本体：`[equipment upgrade]`、`[not amplify]`、`[limit upgradable level]`、`[possible kiri protect]`、`[impossible contents]`。
3. 强化概率和费用修饰先读 `.equ` 本体：`[upgrade prob increase]`、`[upgrade cost discount]`、`[assault cost discount]`。不要把文本说明当公式。
4. 副职业制作修饰必须把 `[expertjob only]` 和同文件的 `[prof ...]` 字段一起读。
5. 配方道具先读 `stackable/... .stk` 的 `[stackable type]`、`[int data]`、`[bead item]`、`[string data]`，再按父块解析其中的 stackable/equipment 候选。
6. 配方商店先读 NPC `[role]` 中的 `[item shop]` ID，再走 `itemshop/itemshop.lst` 和对应 `.shp [sell item]`。
7. 附魔卡片先读 `stackable/monstercard/*.stk`，确认 `[string data]` 的目标装备 token、`[int data]` 的卡面/怪物样列、`[enchant]` 内属性块和可选 `[need material]`。
8. 徽章也可出现 `[enchant]`，但它属于 avatar emblem/socket 边界，不能和怪物卡片附魔混成同一规则。
9. 裸数字必须按父块和正确 registry 解析。若同一数字跨 registry 命中，以当前父块决定，不按数字外形猜。
10. 辅助对照 PVF 只写差异提示，不能覆盖主目标事实。

## 可接受结论

- 可以说主目标 `equipment/equipment.lst` 有 72631 条，`stackable/stackable.lst` 有 10372 条，`itemshop/itemshop.lst` 有 70 条。
- 可以说主目标存在 `[equipment upgrade]`、`[not amplify]`、`[limit upgradable level]`、`[upgrade prob increase]`、`[upgrade cost discount]` 等装备侧静态字段。
- 可以说主目标 `equipment/character/common/magicstone/n_magicstone_450135.equ` 的 `[equipment upgrade]` 同时观察到 `upgrade > 14` 和 `amplify > 14` 条件样式。
- 可以说主目标 `equipment/character/fighter/weapon/knuckle/102000029.equ` 有 `[not amplify] 1` 和 `[possible kiri protect]`。
- 可以说主目标 `equipment/character/common/belt/larmor/111612.equ` 的 `[limit upgradable level]` 把 `normal upgrade` 与 `amplify upgrade` 分段写在同一闭合块里。
- 可以说主目标 `equipment/character/common/title/vip_club.equ` 有 `[upgrade prob increase] 10000` 和 `[upgrade cost discount] 30.0`。
- 可以说主目标副职业装备通过 `[expertjob only]` 限定 `alchemist`、`disjointer`、`doll_controller`、`enchanter` 等 token，并可同文件携带制作成功率、结果、材料或经验修饰字段。
- 可以说主目标 `itemshop/itemshop.lst` 注册 `Recipe1.shp`、`Recipe2.shp`、`Recipe3.shp`，其中克伦特 `Recipe3.shp` 有 3 个售卖项，均按 `stackable/stackable.lst` 解析。
- 可以说主目标 `stackable/professional/recipe/rcp_equip_enchant1.stk` 是 `[recipe]` 道具，样本结果装备 `22237` 按 `equipment/equipment.lst` 解析为附魔手镯，材料 ID 按 `stackable/stackable.lst` 解析。
- 可以说主目标怪物卡片 `stackable/monstercard/mcard_agaress.stk` 的 `[enchant]` 写物理/魔法攻击属性，`[need material]` 样本按 stackable 解析。

## 禁止结论

- 不把 `[possible kiri protect]` 写成保护券一定生效。
- 不把 `[upgrade prob increase]`、`[upgrade cost discount]` 的静态数值写成最终强化概率或最终扣费公式。
- 不把 `[equipment upgrade]` 条件写成强化/增幅操作成功。
- 不把 `[not amplify]` 写成服务端一定拒绝增幅，只能写为静态禁止增幅标记。
- 不把 `[limit upgradable level]` 写成实机等级限制一定生效。
- 不把 `[prof compound rate]`、`[prof result variation]`、`[prof material variation]` 等写成制作成功、产物翻倍或材料扣减成功。
- 不把配方 `[int data]` 的所有列硬命名为通用公式；只能按样本和父块解释。
- 不把 `.shp [sell item]` 写成 NPC 商店 UI 显示、购买成功或金币扣除成功。
- 不把 `[enchant]` 写成附魔成功、卡片消耗成功或装备属性实际改变。
- 不把辅助对照中更大的配方商店、更多配方文件或更多附魔命中提升为主目标事实。

## 验收提示

日常问到“强化字段在哪”“增幅书/净化书怎么闭合”“附魔卡片和配方怎么查”“为什么配方数字不能直接改”“为什么辅助 PVF 有更多配方”时，先从本文进入。若要证明强化、增幅、附魔、制作、购买、材料扣除、金币扣除、NPC UI 或服务端规则，必须进入后续实机或服务端验证阶段。
