# Clear Reward / Card Flip / Independent Drop / Probability 字段词典

状态：默认可用

本文只记录主目标 PVF 只读观察后可作为 Workbench 默认知识的字段边界。高价值资料线索用于定向查找，不能绕过主目标观察。

## Registry 与文件族

| 条目 | 含义 | 解析边界 |
| --- | --- | --- |
| `etc/independentdrop.lst` | 独立掉落 ID 到 `etc/independentdrop/*.etc` 的注册表。 | 只解析独立掉落配置文件；entry count 不是合法 ID 上限。 |
| `etc/independentdrop/*.etc` | 独立掉落候选列表文件。 | `[list]` 内数字需要按候选物品上下文再查 stackable/equipment 等 registry。 |
| `etc/itemdropinfo_clearreward.etc` | 清算、翻牌、金牌、PC 房卡片和 item drop ref 支持表。 | 只证明静态配置存在，不证明概率或翻牌 UI。 |
| `etc/serverparameter.etc` | 全局掉落、奖励、稀有度、premium card、luck point 等支持表。 | 只作全局静态参数线索，不证明服务端采用。 |
| `etc/bloodclearreward.etc` | 血战/特殊清算奖励权重表。 | 只说明另一类清算奖励支持表存在。 |
| `etc/worlddroppcroom*.etc` | PC 房/黑钻相关世界掉落表。 | `[world drop]` 是世界掉落形态，不等同于清算翻牌本体。 |
| `etc/premiumlist*.etc` | 契约、成长、特权类配置。 | `[quest item drop rate]`、`[independent drop rate]` 是倍率线索，不证明特权实机生效。 |

## `etc/itemdropinfo_clearreward.etc`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[drop prob count]` | 清算掉落概率组计数线索；主目标值为 `4`。 | 不能只凭该值推断后续 profile 数量或实机概率。 |
| `[drop prob]` | 主目标观察到 `default`、`event`、`event2`、`pcroom default`、`pcroom bonus`、`pcroom event` 等 profile 标签及等级段数值。 | profile 数值是静态配置，不证明实机真实掉率。 |
| `[drop kind prob]` | 掉落类别概率/权重线索。 | 列语义需结合运行逻辑，静态不硬推。 |
| `[drop item type prob]` | 物品类型概率/权重线索。 | 不证明某类物品必然进入候选池。 |
| `[dungeon difficulty drop bonusrate]` | 副本难度对掉落的倍率/权重线索。 | 不证明难度加成实机采用。 |
| `[basis of rarity dicision]` | 稀有度判定基准数值。 | 字段名保留原拼写；不把阈值写成最终概率。 |
| `[party member drop bonusrate]` | 队伍人数掉落倍率线索。 | 不证明组队时实机生效。 |
| `[dungeon difficulty gold drop bonusrate]` | 副本难度金币掉落倍率线索。 | 不证明金币实际掉落。 |
| `[reward item rate per map max count]` | 按地图数量给出的奖励物品率/最大次数线索。 | 不证明清图次数、地图数或奖励次数实机一致。 |
| `[gold card cost table]` | 金牌翻牌等级到费用的静态表。 | 不证明金币扣除、显示或服务端放行。 |
| `[gold card create rate]` | 金牌创建率/倍率线索。 | 不证明翻牌实际生成。 |
| `[gold card blank item]` | 金牌空白/补偿候选物品，观察形态为权重、物品 ID、数量。 | 当前主目标负样本表明，替换该字段不会稳定接管可见免费/付费翻牌奖励；不要作为确定性清算奖励入口。 |
| `[pcroom card blank item]` | PC 房/黑钻卡片候选物品，观察形态为权重、物品 ID、数量。 | 不证明 PC 房/黑钻状态生效或奖励发放。 |
| `[item drop ref table]` | 清算掉落参考表，观察为三列循环形态。 | 不强行命名全部列，不写成最终概率表。 |

## `etc/serverparameter.etc`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[drop prob number]` / `[drop prob]` | 全局掉落概率组数量和等级段数值。 | 不证明服务端采用或实机概率一致。 |
| `[dungeon difficulty drop bonusrate]` | 难度掉落倍率线索。 | 与 clearreward 同名标签要按文件上下文区分。 |
| `[party user number drop bonusrate]` | 队伍人数掉落倍率线索。 | 不证明组队实际加成。 |
| `[drop bonusrate of monster kind]` | 怪物类型掉落倍率线索。 | 不替代 monster/drop 具体配置。 |
| `[result reward prob number]` / `[result reward prob]` | 结果奖励概率组数量和等级段数值。 | 不证明清算奖励实机发放。 |
| `[dungeon difficulty reward bonusrate]` | 难度对结果奖励的倍率线索。 | 不证明实机采用。 |
| `[party user number reward bonusrate]` | 队伍人数对结果奖励的倍率线索。 | 不证明组队奖励实机加成。 |
| `[basis of item dicision]` | 物品判定基准值。 | 字段名保留原拼写；不硬推算法。 |
| `[basis of equipment rarity dicision]` | 装备稀有度判定基准值。 | 不写成最终稀有度概率。 |
| `[basis of stackable rarity dicision]` | 消耗品稀有度判定基准值。 | 不写成最终稀有度概率。 |
| `[luck point]` / `[luck point deduction *]` | 幸运点及扣减线索。 | 不证明幸运点系统实机生效。 |
| `[premium card drop]` | premium card 掉落候选线索。 | 其中数字可能跨 registry 重名，必须按上下文复核。 |
| `[premium rarity dicision]` | premium 稀有度判定线索。 | 不写成真实概率。 |
| `[drop routin by party]` | 队伍掉落例程线索。 | 字段名保留原拼写，不硬推运行流程。 |
| `[drop upgrade rarity]` | 掉落稀有度升级线索。 | 不证明实机升级。 |
| `[drop bonus of dungeon level increase]` | 副本等级提高后的掉落加成线索。 | 不证明实机加成。 |

## `etc/independentdrop/*.etc`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[list]` | 独立掉落候选列表；主目标样本中常见为物品 ID 与权重/数值成对出现。 | 候选 ID 可能解析到 stackable，也可能解析到 equipment；不能一律当消耗品。 |
| `[/list]` | 列表闭合标签。 | 缺闭合或列形异常只能记静态风险，不能自动修正。 |

## `dungeon/*.dgn` 相关标签

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[clear reward item]` | 副本清算奖励物品列表；主目标塔类活动副本中观察到。 | 不证明奖励实机发放。 |
| `[advance altar clear reward]` | 极限祭坛普通模式清算奖励块，含难度子块与候选物品。 | 不证明特殊模式结算成功。 |
| `[advance altar survival clear reward]` | 极限祭坛生存模式按轮次给出的清算奖励块。 | 不证明轮次计数或发放成功。 |
| `[result card]` | 结果卡/翻牌结果块，主目标青黄龙样本中观察到。 | 不证明翻牌 UI 正常。 |
| `[reward item rate]` | 结果卡内奖励物品率/数量线索。 | 物品数字按 stackable/equipment 等上下文解析。 |
| `[tournament clear reward exp]` | 大会类副本清算经验奖励线索。 | 不证明经验实机发放。 |
| `[tournament clear reward gold rate]` | 大会类副本金币奖励倍率线索。 | 不证明金币发放。 |
| `[gold card use]` | 副本是否使用金牌翻牌的开关线索。 | 不证明 UI 出现或扣费成功。 |
| `[gold drop prob]` | 特殊 dungeon 中金币掉落概率/开关线索。 | 不证明实机金币掉落。 |
| `[common monster item drop prob]` | 特殊 dungeon 中普通怪物物品掉落概率/开关线索。 | 不证明怪物掉落实机一致。 |
| `[common champion item drop prob]` | 特殊 dungeon 中 champion 物品掉落概率/开关线索。 | 同上。 |
| `[super champion item drop prob]` | 特殊 dungeon 中 super champion 物品掉落概率/开关线索。 | 同上。 |
| `[boss item drop prob]` | 特殊 dungeon 中 boss 物品掉落概率/开关线索。 | 同上。 |
| `[* item drop list]` | 特殊 dungeon 中不同怪物类型的掉落列表块。 | 空列表不能解释为全局无掉落；只说明该文件该块为空。 |

## 关键边界

- 同一标签名在不同文件中含义层级可能不同，例如 `[dungeon difficulty drop bonusrate]` 同时出现在 clearreward 和 serverparameter 语境。
- 同一数字可在多个 registry 解析出不同对象；字段上下文优先于数字外形。
- 静态权重、倍率、阈值和 profile 名称只证明配置存在，不证明实机概率、UI、发放、扣费或服务端逻辑。
- 辅助对照只提示配置族扩张，不替代主目标事实。
- 当前主目标样本已证明指定副本 `[basis level]` 会影响怪物强度和付费翻牌费用选行；这不证明装备奖励池、免费翻牌金币公式或概率来源。
