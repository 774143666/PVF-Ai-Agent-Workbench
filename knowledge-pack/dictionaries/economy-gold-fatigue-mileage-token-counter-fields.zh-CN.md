# Economy / Gold / Fatigue / Mileage / Token / Counter 字段词典

状态：默认可用

本文记录主目标 PVF 只读观察后可作为 Workbench 默认知识的经济、金币、疲劳、里程、代币和计数字段边界。本文不授权写 PVF。

## 文件族

| 文件族 | 主目标观察 | 口径 |
| --- | --- | --- |
| `etc/goldlimitbylevel.etc` | 1 个文件，含 `[gold limit from level]` 闭合块。 | 等级到金币上限数值的静态表。 |
| `etc/mileageshop.etc` | 1 个文件，含里程商店多块配置。 | 独立里程商店入口，不是普通 `.shp` 商店。 |
| `stackable/mileage.stk` | 可按 `stackable/stackable.lst` 解析为 ID `1999`。 | 里程/红利点数本体的 stackable 道具入口。 |
| `nexon/cerashopmileage.txt` | 文本表，含 `[default] percent` 与 `[item] ipg_no percent`。 | CERA shop mileage 百分比/商品号线索；不证明商城服务采用。 |
| `etc/chn_server_limititemusageinfo.etc` | 含 `[reset item]`、`[refill item]`、`[Limit Item Usage Info]`。 | 限制物品、重置/补充次数线索。 |
| `event/*.evt` | 样本含签到、疲劳出席、英雄任务等活动结构。 | DB-like token、疲劳阈值、奖励、计数和邮件线索。 |
| `etc/serverparameter.etc` | 经济相关字段与其他全局参数混在同一大表。 | 高风险全局配置入口，只能说明静态参数存在。 |
| `itemshop/*.shp` + 商品文件 | 已封存商店链路中可见 `[sell item]`、商品 `[price]`、`[cash]`、`[need material]`、`[medal]`。 | 价格/材料字段必须回商品文件解释。 |
| `stackable/professional/recipe/*.stk` | 样本配方含 `[price]`、`[int data]`、`[bead item]`、`[string data]`。 | 配方价格和材料/结果列形线索；不证明制作或扣除。 |

## 金币与费用字段

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[gold limit from level]` | 等级与金币上限的成对数值表。 | 不证明服务端采用、账号上限刷新或交易限制。 |
| `[stamina recovery cost]` | `serverparameter` 中疲劳/耐力恢复费用表形态。 | 不证明恢复成功或金币扣除。 |
| `[assault cost]` | `serverparameter` 中街头争霸/assault 费用表形态。 | 不证明入口开启、扣费或结算。 |
| `[price average]` | `serverparameter` 中价格平均值/等级段线索。 | 不证明拍卖、商店或市场公式。 |
| `[lotto cost]` | 彩票/抽取类静态费用线索。 | 不证明抽取、扣费或发奖。 |
| `[premium card cost]` | premium card 静态费用倍率/成本线索。 | 不证明翻牌 UI 或扣费。 |
| `[gold card cost table]` | 清算翻牌金牌费用等级/序号表。 | 不证明金币扣除成功。 |
| `[price]` | 在 stackable 商品或配方父上下文中可作为金币价格线索。 | 跨文件族不自动同义，不证明扣费成功。 |
| `[cash]` | 商店链路中点券/CERA 类价格线索。 | 不证明账号余额或真实扣点券。 |
| `[medal]` | 商店链路中装备胜点类价格线索。 | 不要把任意 PVP 材料 ID 等同胜点。 |
| `[need material]` | 商品、配方或附魔卡片中的材料需求线索。 | 材料 ID 必须按正确 registry 解析；不证明扣材料。 |

## 里程、点数、代币

| 标签/文件 | 静态口径 | 边界 |
| --- | --- | --- |
| `stackable/mileage.stk` | 主目标解析为 `1999`，名称为红利点数，类型 `[waste]`。 | 不证明账号里程余额存在或写入。 |
| `etc/mileageshop.etc [coin]` | 里程商店 coin 类商品块，观察到多列数值与文本。 | 列义不能凭文本硬命名；不证明兑换成功。 |
| `etc/mileageshop.etc [item]` | 里程商店普通物品块。 | 候选数字必须逐项按父块和 registry 复核。 |
| `etc/mileageshop.etc [premium]` | 里程商店 premium 类候选块。 | 不证明 premium 服务购买、生效或到账。 |
| `etc/mileageshop.etc [creature]` | 里程商店 creature 类候选块。 | 不证明宠物/creature 实机获得。 |
| `etc/mileageshop.etc [max gift count]` | 礼赠次数/数量上限线索。 | 不证明每日、账号或角色维度的真实限制。 |
| `etc/mileageshop.etc [not stackable buy]` | 不可堆叠购买限制候选列表。 | 不证明商城 UI 或服务端购买拦截。 |
| `nexon/cerashopmileage.txt [default]` | 默认 percent 行。 | 不证明商城服务采用该百分比。 |
| `nexon/cerashopmileage.txt [item]` | ipg_no 与 percent 表。 | ipg_no 不是 PVF `.lst` item ID，不能按 stackable/equipment 直接解析。 |
| token stackable | `7454`、`7455`、`7310` 等可解析为 stackable material 或同类代币。 | `7310` 同时命中 quest，必须按父块解释。 |
| `[point per fatigue]` / `[event point per fatigue]` | 疲劳到点数的静态换算线索。 | 不证明点数实际增加。 |
| `[lotto point]` | 彩票/抽取类点数表。 | 不证明抽取规则或点数扣除。 |
| `[luck point]` | 幸运点区间表。 | 不证明幸运值实际写入或消耗。 |

## 疲劳与计数器

| 标签 | 静态口径 | 边界 |
| --- | --- | --- |
| `[fatigue]` | 活动样本中的疲劳阈值字段。 | 不证明疲劳消耗被记录或领取按钮可用。 |
| `[db table]` | 活动样本中的 DB-like 表名 token。 | 不证明数据库表真实存在。 |
| `[reward]` | 活动签到奖励列表。 | 数字需按 registry 解析，不证明发放。 |
| `[send mail]` / `[detail]` | 奖励邮件静态配置。 | 不证明邮件送达或背包写入。 |
| `[type]` | 英雄任务样本含 `payment`、`normal`、`final`。 | 不证明支付或任务类型服务端逻辑。 |
| `[repeat]` | 活动任务是否重复的 token。 | 不证明重复领取成功。 |
| `[reset]` | 活动任务重置 token。 | 不证明每日/周期重置实机生效。 |
| `[condition]` | 活动任务条件列形。 | 列义需按该活动父块复核，不证明计数器增长。 |
| `[item]` | 活动任务奖励 item 列表。 | 数字必须按 registry 解析；未注册数字只能记录风险。 |
| `[reset item]` | 限制物品重置块。主目标为空块。 | 不证明无重置逻辑；只证明该块当前为空。 |
| `[refill item]` | 限制物品补充行，主目标样本为 `4183 3` 加日期 token。 | 不证明次数补充成功；`4183` 同时命中 stackable 与 quest，需保留父块。 |
| `[Limit Item Usage Info]` | 限制物品使用信息块头。 | 主目标当前未观察到实质行，不证明功能关闭。 |
| `[daily match count]` | `serverparameter` 中每日匹配次数线索。 | 不证明 PVP/匹配次数实机限制。 |
| `[max clean chatting count]` / `[clean chatting count]` | 聊天清理/计数相关表。 | 不证明聊天限制服务端采用。 |

## ID 解析样本

| 数字 | 父上下文 | 主目标解析 |
| --- | --- | --- |
| `1999` | `stackable/mileage.stk` | `stackable/stackable.lst`：红利点数，类型 `[waste]`。 |
| `7454` | 黑钻贩卖机 token | `stackable/stackable.lst`：钻石硬币，类型 `[material]`。 |
| `7455` | 黑钻贩卖机 token / PC 房卡空白物品 | `stackable/stackable.lst`：黑钻贩卖机代币交换券，类型 `[material]`。 |
| `7310` | challenge token | 可命中 stackable material，也可命中 quest；必须按父块解释。 |
| `4183` | `[refill item]` 样本数字 | 同时命中 stackable 死神的邀请函和 quest；限制物品父块下不能凭裸数字猜。 |
| `8238` | `Recipe3.shp [sell item]` | 可命中 stackable 纯净的黄金增幅书，也可命中 passiveobject；商店商品父块按 stackable 解释。 |
| `22237` | 配方 `[int data]` 结果装备样本 | 可命中 equipment 附魔之隐月手镯，也可命中 passiveobject；配方结果父块按 equipment 解释。 |
| `3167` | 配方 `[int data]` 材料样本 | `stackable/stackable.lst`：暗淡的宇宙灵魂。 |
| `690000005` | `attendance.evt [reward]` | `stackable/stackable.lst`：卡妮娜做的凤梨酥。 |
| `690017133` | `heromissionevent.evt [item]` | `stackable/stackable.lst`：装有灵魂晶石的盒子。 |
| `2670469` / `2680770` | `chn_actionpointsystem.etc` 奖励样本 | 当前样本全局解析未命中；只能记录为未闭合风险，不可写成物品名。 |

## 通用规则

- 同名标签跨文件不自动同义，必须看父文件、父块和 registry。
- `ipg_no`、DB-like token、邮件文本 token 和日期 token 不是普通 PVF item ID。
- 低位数字、高位数字都不能靠外形判断 registry。
- 静态字段只证明配置存在，不证明服务端采用、账号状态、UI、扣费、发放、概率、计数器或资源完整。
- 辅助对照只提示同类配置可能差异更大，不替代主目标事实。
