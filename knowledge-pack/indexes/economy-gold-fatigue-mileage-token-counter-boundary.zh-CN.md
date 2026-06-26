# Economy / Gold / Fatigue / Mileage / Token / Counter Boundary

状态：默认可用

本文封存金币、疲劳、里程、代币、点数、计数器、费用和每日/账号/角色限制的静态只读边界。结论先用现有 Workbench 与高价值资料路由定向，再经主目标 PVF 只读观察确认；辅助对照只记录差异提示。

## 窄桶范围

当前只处理经济字段的总边界和跨专题归位：

- 金币上限、费用、价格、扣费线索。
- 疲劳阈值、疲劳换点数、疲劳活动和疲劳电池线索。
- 里程、CERA shop mileage、代币和点数线索。
- 活动任务、签到、限制物品、每日次数、重置和计数器线索。
- stackable/equipment/itemshop/quest/event 父块下的代表 ID 解析风险。

当前不重做 NPC Shop、Quest Reward、Event Reward Delivery、Upgrade / Recipe、Clear Reward、ServerParameter 或 UI 主线。

## 主目标文件矩阵

| 文件 | 主目标观察 | 静态结论 | 边界 |
| --- | --- | --- | --- |
| `etc/goldlimitbylevel.etc` | `[gold limit from level]` 闭合块，等级 0-99 与金币数值成对。 | 金币上限静态入口。 | 不证明服务端采用或账号上限刷新。 |
| `etc/mileageshop.etc` | 约 22 KB；含 `[coin]`、`[item]`、`[premium]`、`[creature]`、`[package]`、`[max gift count]`、`[not stackable buy]`、`[recommended avatar list]`。 | 独立里程商店配置入口。 | 不证明兑换、赠送、购买、UI 或服务端放行。 |
| `stackable/mileage.stk` | ID `1999`，名称红利点数，类型 `[waste]`。 | 里程/红利点数本体。 | 不证明账号余额或点数写入。 |
| `nexon/cerashopmileage.txt` | `[default] percent` 和 `[item] ipg_no percent` 表。 | 商城里程百分比/商品号线索。 | `ipg_no` 不是普通 PVF item ID；不证明商城服务采用。 |
| `etc/chn_server_limititemusageinfo.etc` | `[reset item]` 空块，`[refill item]` 1 行，`[Limit Item Usage Info]` 块头。 | 限制物品重置/补充线索。 | 不证明使用次数、补充或日期逻辑生效。 |
| `event/fatiguequantity.evt` | `[db table] event_1201_fortune_cookie_fatigue`，活动说明提到消耗疲劳 30。 | 疲劳活动 DB-like token 线索。 | 不证明 DB 表存在或疲劳计数生效。 |
| `event/attendance.evt` | `[db table]`、`[fatigue] 30`、大量 `[reward]`、`[send mail]`。 | 签到疲劳阈值、奖励和邮件线索。 | 不证明领取、邮件送达或背包写入。 |
| `event/heromissionevent.evt` | 6 个 `[mission]`，含 `[type]`、`[repeat]`、`[reset]`、`[item]`、`[condition]`、邮件 token。 | 活动任务计数/重复/重置线索。 | 不证明计数器增长、重置或奖励发放。 |
| `event/jobfatigue.evt` | `[job fatigue]` 空块。 | 疲劳相关骨架。 | 不证明无逻辑，只能说主目标当前为空块。 |
| `event/usedfatiguegiveitem.evt` | 当前读到空内容。 | 疲劳给物品入口缺实质配置。 | 不证明功能不存在。 |
| `etc/chn_actionpointsystem.etc` | `[action point list]`、用户/系统消息、`[action point medal reward]`、`[action point today reward]`。 | 动作点、今日奖励、奖章奖励线索。 | 部分奖励 ID 未注册；不证明 AP 或今日奖励生效。 |
| `etc/actionpointsystem.etc` | `[UI]` 与 `[Properties]` 路径。 | 动作点系统入口路由。 | 不证明 UI 可用或资源完整。 |
| `etc/chn_actionpointsystem_prop.etc` | `[Sound Tag]` 列表。 | 声音 token 线索。 | 不证明音效播放。 |
| `etc/itemdropinfo_clearreward.etc` | `[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]` 等。 | 金牌费用、翻牌空白物品和 PC 房卡线索。 | 不证明翻牌 UI、扣费或发放。 |
| `etc/serverparameter.etc` | 观察到费用、点数、疲劳、lotto、emblem compound、recipe table、daily count 等大量经济块。 | 高风险全局经济参数入口。 | 不证明服务端最终采用。 |
| `itemshop/recipe3.shp` | `[sell item] 8238 1284 1183 ...`，负数占位。 | 商店商品列表样本。 | 价格不在 `.shp` 内决定；负数不是商品。 |
| `stackable/professional/recipe/rcp_equip_enchant1.stk` | `[price] 50000`、`[int data]`、`[bead item]`、`[string data]`。 | 配方价格、材料和结果列形样本。 | 不证明制作、学习或扣材料。 |
| `equipment/character/common/title/vip_club.equ` | `[upgrade prob increase] 10000`、`[upgrade cost discount] 30.0`。 | 强化概率/费用修饰线索。 | 不证明最终强化概率或扣费公式。 |

## 主目标关键标签分组

| 分组 | 观察到的标签 | 结论 |
| --- | --- | --- |
| 金币/费用 | `[gold limit from level]`、`[stamina recovery cost]`、`[assault cost]`、`[price average]`、`[lotto cost]`、`[premium card cost]`、`[gold card cost table]`、`[price]` | 金币和费用静态入口存在。 |
| 商店/兑换 | `mileageshop [coin]/[item]/[premium]/[creature]`、`.shp [sell item]`、商品 `[price]/[cash]/[need material]/[medal]` | 商店、里程、兑换和商品价格入口按父块分离。 |
| 疲劳/点数 | `[fatigue]`、`[point per fatigue]`、`[event point per fatigue]`、`[limit fatigue battery charging amount]`、`[fatigue battery money amount]` | 疲劳阈值、换点和疲劳电池静态入口存在。 |
| 代币/点数 | `stackable/mileage.stk`、token stackable、`[luck point]`、`[lotto point]`、`nexon/cerashopmileage.txt` | 里程、代币、幸运点和商城里程线索存在。 |
| 计数/重置 | `[db table]`、`[repeat]`、`[reset]`、`[condition]`、`[daily match count]`、`[max gift count]`、`[Limit Item Usage Info]` | 活动、每日和限制物品计数线索存在。 |
| 发放/邮件 | `[reward]`、`[item]`、`[send mail]`、`[mail title]`、`[mail content]` | 奖励候选和邮件配置存在。 |
| 配方/强化 | `[recipe upgrade table]`、`[recipe amplify table]`、`[upgrade cost discount]`、`[prof material variation]`、`[int data]` | 配方、强化和制作消耗/修饰线索存在。 |

## ID 解析样本

| 数字 | 父上下文 | 主目标解析与风险 |
| --- | --- | --- |
| `1999` | `stackable/mileage.stk` | 解析到 stackable 红利点数；不证明账号里程余额。 |
| `7454` | 黑钻贩卖机 token | 解析到 stackable 钻石硬币；不证明贩卖机可用。 |
| `7455` | 黑钻贩卖机 token / PC 房卡空白物品 | 解析到 stackable 黑钻贩卖机代币交换券；不证明掉落或兑换。 |
| `7310` | challenge token | 同时命中 stackable 和 quest；必须按父块解释。 |
| `4183` | `chn_server_limititemusageinfo [refill item]` | 同时命中 stackable 和 quest；限制物品父块下不能凭裸数字猜。 |
| `690000005` | `attendance.evt [reward]` | 解析到 stackable 卡妮娜做的凤梨酥；不证明签到发放。 |
| `690017133` | `heromissionevent.evt [item]` | 解析到 stackable 装有灵魂晶石的盒子；不证明邮件发放。 |
| `8238` | `Recipe3.shp [sell item]` | 同时命中 stackable 纯净的黄金增幅书和 passiveobject；商店商品父块应按 stackable 解释。 |
| `1284` / `1183` | `Recipe3.shp [sell item]` | 解析到 stackable 消耗品；仍不证明购买成功。 |
| `22237` | 配方 `[int data]` 结果样本 | 同时命中 equipment 和 passiveobject；配方结果父块按 equipment 解释。 |
| `3167` | 配方 `[int data]` 材料样本 | 解析到 stackable 暗淡的宇宙灵魂；不证明材料扣除。 |
| `2670469` / `2680770` | `chn_actionpointsystem.etc` 奖励样本 | 当前样本全局解析未命中；只能记未闭合风险。 |

## 与已封存主线的关系

| 已封存主线 | 本主线复用方式 |
| --- | --- |
| NPC Shop / Itemshop / Exchange / Price | 提供 `.shp [sell item]`、商品 `[price]`、`[cash]`、`[need material]`、`[medal]` 与扣费边界。 |
| Quest / Type / Reward / Drop / Ticket | 提供任务条件、奖励、门票、计数器和门票扣除不等于实机成功的边界。 |
| Event Reward Delivery / Mail / Attendance | 提供 `[db table]`、`[fatigue]`、`[reward]`、邮件和活动计数边界。 |
| Upgrade / Reinforce / Amplify / Enchant / Recipe | 提供强化费用折扣、配方价格、材料消耗和制作/附魔不等于成功的边界。 |
| Stackable Container / Package | 提供 stackable 候选池、箱子、礼包、发放和背包风险边界。 |
| Clear Reward / Card Flip / Independent Drop / Probability | 提供金牌费用、PC 房卡、翻牌和概率/发放风险边界。 |
| ServerParameter / Premium / PC Room / Growth Buff | 提供全局经济参数、疲劳、premium card、PC 房和服务端采用风险边界。 |

## 辅助对照差异提示

辅助对照 PVF 只提示同类配置可差异化，不覆盖主目标事实：

| 项 | 主目标 | 辅助提示 |
| --- | --- | --- |
| `etc/mileageshop.etc` | 同名文件存在，块形态与辅助一致。 | 同名文件存在，首段块形态一致。 |
| `stackable/mileage.stk` | 名称为红利点数。 | 名称为里程，且多 `icon mark` 字段。 |
| `nexon/cerashopmileage.txt` | `[default] percent` 与 `[item] ipg_no percent` 表。 | 同名表内容一致。 |
| `etc/goldlimitbylevel.etc` | 低等级与高等级金币上限较低，90+ 为 400000000。 | 数值明显更高，高等级大量为 2000000000。 |
| `etc/chn_server_limititemusageinfo.etc` | `[refill item]` 1 行，`[Limit Item Usage Info]` 无实质行。 | `[refill item]` 多行，仍有 2030 日期 token。 |
| `event/attendance.evt` | `[fatigue] 30`，奖励 ID 为 `690000005` 重复。 | `[fatigue]` 仍为 30，但说明文字和奖励 ID/数量不同。 |
| `event/heromissionevent.evt` | 任务 item 以 `690017133` 为主，条件较小。 | 奖励与条件数字不同，出现 `8`、`900`、`42` 等样本。 |
| token 文件 | 3 个 token 文件。 | 同样 3 个 token 文件，但数据长度略有差异。 |

## 静态不能证明

- 金币、点券、里程、token、疲劳、luck point、lotto point 或 action point 的账号余额。
- 商店购买、里程兑换、配方制作、强化、翻牌、签到、任务或限制物品补充的扣费、返还、领取、发放或背包写入成功。
- DB 表存在、每日/每周/账号/角色重置、计数器增长、重复领取限制或服务端放行。
- `serverparameter`、里程商店、限制物品、活动文件或商城文本表是否被服务端实际读取。
- UI、按钮、页签、邮件界面、商城界面、客户端资源或音效是否正常。
- 辅助对照的高数值、更多行或不同奖励能直接用于主目标。

## 后续入口

- 查具体 NPC 商店价格：转 NPC Shop / Itemshop / Exchange / Price。
- 查签到、邮件、活动奖励：转 Event Reward Delivery / Mail / Attendance。
- 查强化、配方、附魔材料：转 Upgrade / Reinforce / Amplify / Enchant / Recipe。
- 查翻牌费用、PC 房卡、掉落概率：转 Clear Reward / Card Flip / Independent Drop / Probability。
- 查全局疲劳/经济参数：先读本主线，再回 ServerParameter / Premium / PC Room / Growth Buff。
- 要证明实机效果：进入受控实验或服务端/客户端验证，不用静态 Workbench 硬推。
