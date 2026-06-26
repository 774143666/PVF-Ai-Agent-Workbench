# Clear Reward / Card Flip / Independent Drop / Probability Boundary

状态：默认可用

本文封存清算奖励、翻牌、独立掉落、PC 房/黑钻掉落、契约倍率和概率/倍率表的静态只读边界。结论先用高价值资料线索定向，再经主目标 PVF 只读观察确认；辅助对照只记录差异提示。

## 主目标范围矩阵

| 层 | 主目标观察 | 结论 |
| --- | --- | --- |
| `etc/independentdrop.lst` | 注册 10 个条目，ID 为 1-7、991-993。 | 独立掉落 ID 稀疏；entry count 不是 ID 上限。 |
| `etc/independentdrop/*.etc` | `etc/independentdrop/` 下观察到 10 个文件，与 registry 条目数闭合。 | 主目标独立掉落文件存在性闭合。 |
| 独立掉落 `[list]` | `1_magneus_normal.etc` 中观察到多组候选 ID 与数值；`991hongse/992lanse/993lvse.etc` 中观察到高位装备 ID 与统一权重。 | `[list]` 是候选列表形态；候选 ID 需按 registry 解析，不都是 stackable。 |
| `etc/itemdropinfo_clearreward.etc` | 存在，数据长度 5857；含 `[drop prob]`、`[drop kind prob]`、`[drop item type prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]` 等块。 | 这是主目标清算/翻牌核心支持表；当前只把付费翻牌费用选行收窄为实机样本，概率、装备池和发放路径仍未证明。 |
| `[drop prob]` profile | `[drop prob count]` 值为 4；同一块内观察到 `default`、`event`、`event2`、`pcroom default`、`pcroom bonus`、`pcroom event` 6 个标签。 | count 与 profile 标签数量不强行等同；只记录观察形态。 |
| 金牌/PC 房空白卡候选 | `[gold card blank item]` 观察为权重、物品 ID、数量；`[pcroom card blank item]` 观察为 PC 房/黑钻候选物品。 | `[gold card blank item]` 替换已有当前主目标负样本，不能作为确定性可见奖励入口；PC 房/黑钻仍需验证。 |
| `etc/serverparameter.etc` | 含 `[drop prob]`、`[result reward prob]`、掉落/奖励倍率、稀有度基准、luck point、premium card、party/dungeon level 加成等块。 | 这是全局概率/倍率支持表，不能写成服务端实机采用。 |
| `etc/bloodclearreward.etc` | 含 `[reward item prob]`、`[reward gold weight]`、`[reward exp weight]`、`[ultimate reward prob]`。 | 属于特殊清算奖励权重表，不等同于普通翻牌表。 |
| `etc/worlddroppcroom*.etc` | 观察到 `worlddroppcroom.etc`、`worlddroppcroom2.etc`、`worlddropwarareapcroom.etc`；前两者 `[world drop]` 覆盖 1-200 等级段，第三者大量 `-1`。 | PC 房/黑钻世界掉落是相邻掉落配置族，不是清算翻牌本体。 |
| `etc/premiumlist*.etc` | `premiumlist.etc` 与 `premiumlist_new.etc` 均命中 `[quest item drop rate]`、`[independent drop rate]`；样本中 `independent drop rate` 为 20/23/27/30。 | 契约/成长倍率是加成线索，不证明服务端特权生效。 |

## Dungeon 标签命中矩阵

| 标签 | 主目标命中 | 主目标样本结论 |
| --- | ---: | --- |
| `[clear reward item]` | 3 个 dungeon 文件 | 活动塔类副本直接含清算奖励物品块。 |
| `[advance altar clear reward]` | 15 个 dungeon 文件 | 极限祭坛普通/测试/生存相关文件含清算奖励块。 |
| `[advance altar survival clear reward]` | 4 个 dungeon 文件 | 生存模式按轮次组织奖励。 |
| `[gold card use]` | 2 个 dungeon 文件 | 个别副本显式关闭或声明金牌使用线索。 |
| `[reward item rate]` | 2 个 dungeon 文件 | 青龙/黄龙大会结果卡内含奖励物品率。 |
| `[result card]` | 2 个 dungeon 文件 | 青龙/黄龙大会有结果卡块。 |
| `[tournament clear reward gold rate]` | 2 个 dungeon 文件 | 大会类副本含金币倍率线索。 |
| `[tournament clear reward exp]` | 2 个 dungeon 文件 | 大会类副本含经验奖励线索。 |
| `[gold drop prob]` | 5 个 dungeon 文件 | warroom 类副本含金币掉落概率/开关线索。 |
| `[common monster item drop prob]` | 5 个 dungeon 文件 | warroom 类副本含普通怪物物品掉落概率/开关线索。 |
| `[common champion item drop prob]` | 5 个 dungeon 文件 | warroom 类副本含 champion 掉落概率/开关线索。 |
| `[super champion item drop prob]` | 5 个 dungeon 文件 | warroom 类副本含 super champion 掉落概率/开关线索。 |
| `[boss item drop prob]` | 5 个 dungeon 文件 | warroom 类副本含 boss 掉落概率/开关线索。 |

## 主目标关键样本

| 样本 | 只读确认 | 用途 |
| --- | --- | --- |
| `etc/independentdrop.lst` | 10 个注册条目；路径大小写混用但实际文件可在 `etc/independentdrop/` 下读到。 | 证明 registry 到文件存在性闭合，且 ID 稀疏。 |
| `etc/independentdrop/1_magneus_normal.etc` | `[list]` 中多组 stackable 候选与权重/数值。 | 证明独立掉落常见候选列表形态。 |
| `etc/independentdrop/991hongse.etc` | `[list]` 中多组高位装备 ID，统一权重。 | 证明独立掉落候选不只限 stackable。 |
| `etc/itemdropinfo_clearreward.etc` | 金牌、PC 房卡、稀有度基准、难度/队伍倍率、item drop ref table 共存。 | 证明清算/翻牌核心支持表是多块组合，不是单一概率字段。 |
| `dungeon/towers/chn_event_01.dgn` | `[clear reward item]` 中观察到物品 ID 与数量列。 | 证明 dungeon 可以自带清算奖励物品。 |
| `dungeon/advancealtar/advancealtar_stage_01.dgn` | `[advance altar clear reward]` 中按 easy/medium/hard 子块列出候选。 | 证明特殊副本可有专用清算奖励结构。 |
| `dungeon/advancealtar/advancealtar_survival_01.dgn` | `[advance altar survival clear reward]` 中按 `[round]` 与 `[list]` 组织奖励。 | 证明轮次型清算奖励结构存在。 |
| `dungeon/shonantournament/bluedragon.dgn` | `[result card]` 内含 `[reward item rate]`，并有大会金币/经验清算标签。 | 证明结果卡与大会清算奖励是 dungeon 特例结构。 |
| `dungeon/warroom/grenselos20-30.dgn` | `[gold drop prob]` 和多类怪物 item drop prob 值为 0；对应 item drop list 为空。 | 证明特殊 dungeon 可显式关闭/置空掉落块，但不能推广到全局。 |

## ID 解析样本

| 数字 | 正确上下文 | 主目标解析 |
| --- | --- | --- |
| `7279` | `etc/itemdropinfo_clearreward.etc [gold card blank item]` 候选物品 | 在 `stackable/stackable.lst` 解析为 `event/goldcard/coupon_goldcard.stk`；替换该类候选不等于接管可见翻牌奖励。 |
| `7454` | `[pcroom card blank item]` 候选物品 | 在 `stackable/stackable.lst` 解析为黑钻售货机相关代币。 |
| `7455` | `[pcroom card blank item]` 与 `worlddroppcroom.etc [world drop]` 候选物品 | 在 `stackable/stackable.lst` 解析为黑钻贩卖机代币交换券。 |
| `2651400` | 独立掉落 `[list]` 候选 | 在 `stackable/stackable.lst` 解析为设计图类 stackable。 |
| `690060026` | 独立掉落 `[list]` 候选 | 在 `stackable/stackable.lst` 解析为材料类 stackable。 |
| `2019664` | 独立掉落高位候选 | 不在 stackable 解析；在 `equipment/equipment.lst` 解析为符文/宠物装备类 equipment。 |
| `10005022` | dungeon `[clear reward item]` 候选 | 在 `stackable/stackable.lst` 解析为活动宝箱。 |
| `10005004` | dungeon `[clear reward item]` 候选 | 在 `stackable/stackable.lst` 解析为活动钥匙/任务类物品。 |
| `2749211` | 极限祭坛清算奖励候选 | 在 `stackable/stackable.lst` 解析为净化的灵魂痕迹。 |
| `2749213` | 极限祭坛清算奖励候选 | 在 `stackable/stackable.lst` 解析为袖珍罐。 |
| `900` | 极限祭坛 event 候选 | 在 `stackable/stackable.lst` 解析为幸运魔锤。 |
| `3323` | 青龙大会 `[reward item rate]` 候选 | 在 `stackable/stackable.lst` 解析为华丽的曲玉。 |
| `31013` | `serverparameter.etc [premium card drop]` 样本数字 | 跨 registry 可解析到 equipment、map、passiveobject，不能脱离父块直接断言物品类型。 |

## 主目标边界结论

- `etc/itemdropinfo_clearreward.etc` 是清算/翻牌支持表，不是唯一掉落概率来源。
- `etc/serverparameter.etc` 是全局概率/倍率支持表，不替代 dungeon、quest、monster 或 independentdrop 的局部配置。
- `etc/independentdrop.lst` 是独立掉落 registry；独立掉落候选 ID 可能落在 stackable 或 equipment。
- `etc/worlddroppcroom*.etc` 是 PC 房/黑钻世界掉落相邻表；与 `[pcroom card blank item]` 有物品层关联，但不等同于翻牌。
- `.dgn` 内的 `[clear reward item]`、`[advance altar clear reward]`、`[result card]`、`[gold card use]` 等是 dungeon 局部特例，不代表全局。
- 权重、倍率、阈值、profile 名称和 tag 存在都只能证明静态配置存在。
- `.dgn [basis level]` 已有当前主目标样本表明会影响怪物强度和付费翻牌费用选行；不要把它当单纯清算费用字段，也不要外推到装备池或免费金币公式。

## 辅助对照差异提示

辅助对照 PVF 只提示同类配置在更大目标集中会扩展，不覆盖主目标事实：

| 项 | 辅助对照提示 |
| --- | --- |
| registry 规模 | `etc/independentdrop.lst` 为 149 条，大于主目标 10 条。 |
| 独立掉落路径 | 辅助对照 `independentdrop.lst` 覆盖 1-108、112、116、117-120、124-136、140-148、152、156-166、177 等稀疏 ID。 |
| clearreward 文件 | 同样存在 `etc/bloodclearreward.etc` 与 `etc/itemdropinfo_clearreward.etc`。 |
| clearreward 内容 | clearreward 基本块同类存在，但金牌/PC 房候选物品与主目标不同。 |
| PC 房相关 | PC 房相关文件更多，并观察到一组 raid reward UI 动画文件；这只提示辅助目标有更多客户端/UI 线索。 |
| dungeon 标签 | `[clear reward item]` 3 个、`[advance altar clear reward]` 13 个、`[gold card use]` 23 个、`[reward item rate]` 2 个、`[result card]` 2 个、warroom 掉落概率类 5 个。 |

## 静态不能证明

- 不能证明清算奖励、翻牌、PC 房卡、黑钻卡、premium card、独立掉落实机发放成功。
- 不能证明 `drop prob`、`bonusrate`、`weight`、`basis`、`dicision` 表示的数值就是实机最终概率。
- 付费 gold card 费用显示选行已有当前主目标样本；仍不能证明金币扣除、翻牌按钮全部状态、PC 房/黑钻状态、契约状态或成长加成由服务端放行。
- 不能证明 dungeon 清图、boss 判定、轮次计数、任务条件、门票扣除、物品条件与这些表一致。
- 不能证明客户端 UI、动画、ImagePacks2 或音频资源完整。

## 后续工作入口

- 要查任务奖励、任务掉落或门票：转 Quest / Type / Reward / Drop / Ticket Boundary。
- 要查副本入口、地图、怪物刷新或 clear 条件：转 Dungeon / Map / Spawn / Entry / Clear / Resource Boundary。
- 要查怪物自身掉落：转 Monster 或 Monster AI / Action / Attack Cross-Layer Boundary。
- 要查礼包、随机箱、袖珍罐内部候选池：转 Stackable Container / Package Boundary。
- 要证明概率或发放：进入实机测试或服务端运行验证阶段，不用静态 Workbench 硬推。
