# ServerParameter / Premium / PC Room / Growth Buff 字段词典

状态：默认可用

本文记录主目标 PVF 只读观察后可作为 Workbench 默认知识的服务参数、契约/黑钻、PC 房、成长支援字段边界。本文不授权写 PVF。

## 文件族

| 文件族 | 主目标观察 | 口径 |
| --- | --- | --- |
| `etc/serverparameter.etc` | 1 个文件，含大量全局参数块。 | 高风险全局配置，只能说明静态参数存在。 |
| `etc/premiumlist.etc` / `etc/premiumlist_new.etc` | 旧/新两份 premium 列表均存在。 | 契约、黑钻、特权、疲劳、经验和掉率线索；不证明账号状态。 |
| `etc/premiumserviceeffect.etc` | `[premium service]` 多条服务效果条目。 | 图片索引和附加装备线索；不证明 UI 或效果套用。 |
| `etc/pcroom*.vm` | `pcroom.vm`、`pcroom3.vm`、`pcroom4.vm` 均存在。 | 贩卖机样配置，需按 `[material]`、`[output]` 解析候选物品。 |
| `etc/worlddroppcroom*.etc` | `worlddroppcroom.etc`、`worlddroppcroom2.etc`、`worlddropwarareapcroom.etc` 均存在。 | PC 房/黑钻世界掉落相邻表，不等于翻牌本体。 |
| `etc/growthpowerrewardbuff.etc` | 块存在但当前主目标观察为空。 | 只能说有成长支援骨架。 |
| `etc/growthpowernpcdialog.etc` | `[Dialog]` 块存在但当前主目标观察为空。 | 不证明 NPC 交互或对话触发。 |

## `etc/serverparameter.etc`

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[version]` / `[script version]` | 参数文件版本或脚本版本字段。 | 不证明客户端或服务端版本兼容。 |
| `[clear exp bonusrate]` / `[monster exp bonusrate]` | 清算经验、怪物经验倍率线索。 | 不证明经验实际结算。 |
| `[party user number exp bonusrate]` | 队伍人数经验倍率线索。 | 不证明组队经验加成实机采用。 |
| `[party user number exp bonusrate starter server]` | starter server 语境下队伍经验倍率线索。 | 不证明目标服务端使用该分支。 |
| `[quest item drop bonus starter server]` | starter server 语境下任务道具掉率加成线索。 | 不证明任务道具掉落实机增加。 |
| `[dungeon difficulty exp bonusrate]` | 副本难度经验倍率线索。 | 不证明难度经验实机一致。 |
| `[clear rank exp bonusrate]` | 清算评价经验倍率线索。 | 不证明评价结算。 |
| `[drop prob number]` / `[drop prob]` | 全局掉落概率组和等级段数值形态。 | 不证明最终掉率。 |
| `[dungeon difficulty drop bonusrate]` | 难度掉落倍率线索。 | 同名标签需按文件上下文区分。 |
| `[party user number drop bonusrate]` | 队伍人数掉落倍率线索。 | 不证明组队掉率实机采用。 |
| `[drop bonusrate of monster kind]` | 怪物类型掉落倍率线索。 | 不替代 monster/drop 局部配置。 |
| `[result reward prob number]` / `[result reward prob]` | 结果奖励概率组和等级段数值形态。 | 不证明清算奖励发放。 |
| `[dungeon difficulty reward bonusrate]` | 难度结果奖励倍率线索。 | 不证明清算奖励实机采用。 |
| `[party user number reward bonusrate]` | 队伍人数结果奖励倍率线索。 | 不证明组队奖励实机加成。 |
| `[basis of item dicision]` | 物品判定基准值。 | 字段名保留原拼写；不硬推算法。 |
| `[basis of equipment rarity dicision]` / `[basis of stackable rarity dicision]` | 装备/消耗品稀有度基准。 | 不写成最终稀有度概率。 |
| `[stamina recovery cost]` | 疲劳或耐力恢复费用/等级段表形态。 | 不证明恢复、扣费或 UI。 |
| `[burning fatigue event param]` | 燃烧疲劳活动参数块。 | 不证明活动开启或疲劳消耗逻辑。 |
| `[fatigue event param]` | 疲劳活动参数块。 | 不证明活动开启。 |
| `[point per fatigue]` / `[event point per fatigue]` | 疲劳到点数的静态换算线索。 | 不证明点数写入。 |
| `[limit fatigue battery charging amount]` | 疲劳蓄电池充能上限线索。 | 不证明蓄电池系统生效。 |
| `[min fatigue battery per buff active]` | buff 激活所需疲劳蓄电池下限线索。 | 不证明 buff 激活。 |
| `[fatigue battery per grownup buff active]` / `[grownup buff per fatigue battery active]` | 疲劳蓄电池与 grownup buff 互相关联线索。 | 不证明成长 buff 生效。 |
| `[limit grownup buff cnt fatigue battery]` | 疲劳蓄电池成长 buff 计数上限表。 | 不证明计数器实机采用。 |
| `[pc room party exp bonus rate]` | PC 房组队经验加成线索。 | 不证明 PC 房识别或经验加成。 |
| `[premium card drop]` | premium card 候选掉落表。 | 数字可跨 registry 命中，必须按父块解释。 |
| `[premium rarity dicision]` | premium 稀有度判定线索。 | 不写成真实概率。 |
| `[get eventitem fatigue]` | 活动物品与疲劳阈值线索。 | 不证明活动物品获取。 |

## `etc/premiumlist*.etc`

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[overequip list]` / `[returnitem list]` | premium 服务关联装备槽或返还条目列表。 | 不证明装备/返还实际生效。 |
| `[type]` | premium/contract 服务类型编号。 | 不是全局 item ID。 |
| `[target item]` | 服务关联目标条目线索。 | 需结合父块；不能脱离文件猜 registry。 |
| `[attr]` | `[bonus]`、`[term]` 等服务属性 token。 | 不证明状态逻辑。 |
| `[term]` | 时长/期限列形。 | 不证明期限计算或到期处理。 |
| `[items]` / `[item]` | 服务关联物品候选。 | 数字必须按 stackable/equipment 等上下文解析。 |
| `[fatigue]` | 疲劳值或疲劳相关服务字段。 | 不证明疲劳上限或恢复实际生效。 |
| `[exp]` / `[bonus exp]` | 经验加成线索。 | 不证明经验倍率实机采用。 |
| `[quest item drop rate]` | 任务道具掉率加成线索。 | 不证明掉落。 |
| `[independent drop rate]` | 独立掉落倍率线索，主目标观察到多值表形态。 | 不证明独立掉落实机概率。 |
| `[coin]` / `[gold bonus]` | 币或金币加成线索。 | 不证明货币发放或扣费。 |
| `[inventory limit]` | 背包/负重扩展线索。 | 不证明 UI 或服务端放行。 |
| `[unlimit fatigue]` | 疲劳无限/限制解除线索。 | 不证明账号状态或疲劳系统生效。 |
| `[apply target server]` | 应用目标服务器 token。 | 不证明当前服务端采用。 |
| `[name]` | 服务名文本，如契约、黑钻契约、成长契约。 | 文本存在不证明服务启用。 |
| `[restrict]` | 限制子块线索。 | 不证明限制逻辑。 |

## `etc/premiumserviceeffect.etc`

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[premium service]` | premium service 父块。 | 不证明服务激活。 |
| `[main premium image index]` / `[additional premium image index]` | 图片索引或显示索引线索。 | 不证明 UI 图标显示正常。 |
| `[add equipment list]` | 附加装备候选列表，主目标样本可解析到 `equipment/equipment.lst`。 | 不证明装备效果已套用。 |
| `[add selectAble equipment list]` | 可选附加装备候选列表，观察为索引与 equipment ID 成对形态。 | 不证明选择 UI 或效果生效。 |

## PC 房与成长支援

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[item group]` | `.vm` 贩卖机配置父块。 | 不证明贩卖机入口可见。 |
| `[material]` | 贩卖机材料候选。 | 数字需解析，不证明扣除。 |
| `[output]` | 贩卖机输出池，观察为物品、权重/概率、数量、标志位循环形态。 | 不证明抽取或发放。 |
| `[world drop]` | `worlddroppcroom*.etc` 世界掉落列表，观察为等级段与候选物品组合。 | 不证明 PC 房/黑钻状态或世界掉落实机采用。 |
| `[breakaway section]` | 成长支援等级段/分段块。 | 主目标为空块，不证明等级判断。 |
| `[exp reward]` | 成长支援经验奖励块。 | 主目标为空块，不证明经验发放。 |
| `[package reward]` | 成长支援礼包奖励块。 | 主目标为空块，不证明礼包发放；辅助非空仅作提示。 |
| `[Dialog]` | 成长支援 NPC 对话块。 | 主目标为空块，不证明 NPC 交互。 |

## ID 解析样本

| 数字 | 父上下文 | 主目标解析 |
| --- | --- | --- |
| `7455` | `worlddroppcroom.etc [world drop]` 候选物品 | 解析到 `stackable/stackable.lst` 的黑钻贩卖机代币交换券。 |
| `7463` | `pcroom.vm [output]` 候选物品 | 解析到 `stackable/stackable.lst` 的卡妮娜的手工面包。 |
| `3017951` | `premiumlist_new.etc` 黑钻契约条目 `[item]` | 解析到 `stackable/stackable.lst` 的黑钻会员，类型为 `[contract]`。 |
| `2660543` | `premiumlist_new.etc` 晶体契约条目 `[item]` | 解析到 `stackable/stackable.lst` 的契约类道具。 |
| `9944451` | `premiumserviceeffect.etc [add equipment list]` | 解析到 `equipment/equipment.lst` 的黑钻契约附加效果。 |
| `2312900` | `premiumserviceeffect.etc [add equipment list]` | 解析到 `equipment/equipment.lst` 的成长的合约。 |
| `100300084` | `premiumserviceeffect.etc [add selectAble equipment list]` | 解析到 `equipment/equipment.lst` 的晶体契约效果装备。 |
| `31013` | `serverparameter.etc [premium card drop]` 样本数字 | 可跨 equipment、map、passiveobject 多 registry 命中；不能脱离父块直接断言物品类型。 |

## 通用规则

- 同名标签跨文件不自动同义，必须看父文件和父块。
- 低位数字、高位数字都不能靠外形判断 registry。
- 静态字段只证明配置存在，不证明服务端采用、账号状态、UI、扣费、发放、概率或资源完整。
- 辅助对照只提示同类配置可能更完整，不替代主目标事实。
