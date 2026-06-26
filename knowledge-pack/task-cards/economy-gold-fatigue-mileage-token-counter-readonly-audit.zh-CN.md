# Economy / Gold / Fatigue / Mileage / Token / Counter 只读核查

状态：默认可用

用途：作为金币、疲劳、里程、代币、点数、计数器、费用、扣费字段和每日/账号/角色限制的静态入口短任务卡。本文只记录主目标 PVF 只读观察，不证明扣费成功、返还成功、每日重置、账号计数、背包写入、服务端采用或 UI 正常。

## 快速结论

- 本主线复用 NPC Shop、Quest Reward、Event Reward Delivery、Upgrade / Recipe、Stackable Container、Clear Reward、ServerParameter 等已封存入口，不重开这些大主线。
- 主目标命中 `etc/goldlimitbylevel.etc`，其中 `[gold limit from level]` 是等级到金币上限的成对表形态。
- 主目标命中 `etc/mileageshop.etc`、`stackable/mileage.stk` 与 `nexon/cerashopmileage.txt`。里程商店不是普通 `itemshop/*.shp`，而是独立 `etc/` 表；里程点数本体解析到 `stackable/stackable.lst`。
- 主目标命中 `etc/chn_server_limititemusageinfo.etc`，可见 `[reset item]` 空块、`[refill item]` 行和 `[Limit Item Usage Info]` 块头。该文件只能作为限制/补充使用次数线索。
- 主目标命中 `event/attendance.evt`、`event/fatiguequantity.evt`、`event/heromissionevent.evt` 等活动样本，包含 `[db table]`、`[fatigue]`、`[reward]`、`[type]`、`[repeat]`、`[reset]`、`[condition]`、`[item]`、邮件文本 token 等计数/领取线索。
- 主目标 `etc/serverparameter.etc` 仍是经济高风险入口，观察到 `stamina recovery cost`、`assault cost`、`point per fatigue`、`price average`、`lotto cost`、`emblem compound info`、`recipe upgrade table`、`daily match count`、`premium card cost` 等静态字段。
- 主目标代表 ID 解析显示数字必须按父块和 registry 解释：`8238` 可同时命中 stackable 和 passiveobject；`22237` 可同时命中 equipment 和 passiveobject。
- 辅助对照同名里程、限制物品、金币上限和活动文件存在，但数值、奖励和行数不同；这些只作差异提示，不覆盖主目标事实。

## 默认处理

1. 问金币上限、金币费用、商店价格、里程、疲劳消耗、每日次数、任务计数、活动领取、代币或扣费字段时，先读本任务卡。
2. 需要字段口径时，读 `dictionaries/economy-gold-fatigue-mileage-token-counter-fields.zh-CN.md`。
3. 需要文件矩阵、ID 解析样本和辅助差异时，读 `indexes/economy-gold-fatigue-mileage-token-counter-boundary.zh-CN.md`。
4. 需要文件类型说明时，读 `encyclopedia/pvf-file-types/economy-gold-fatigue-mileage-token-counter.zh-CN.md`。
5. 如果问题转向具体商店购买、强化、活动奖励、翻牌、任务、礼包开包或 UI，转读对应已封存主线。

## 可接受结论

- 可以说主目标存在金币上限表、里程商店表、里程点数道具、CERA shop mileage 文本表、限制物品使用信息、活动疲劳/奖励/计数样本和 serverparameter 经济参数入口。
- 可以说 `etc/mileageshop.etc` 观察到 `[coin]`、`[item]`、`[premium]`、`[creature]`、`[package]`、`[max gift count]`、`[not stackable buy]`、`[recommended avatar list]` 等块。
- 可以说 `stackable/mileage.stk` 对应 `stackable/stackable.lst` 的 `1999`，主目标名称为红利点数，类型为 `[waste]`。
- 可以说黑钻贩卖机相关代币 `7454`、`7455` 解析到 stackable material。
- 可以说 `etc/itemdropinfo_clearreward.etc [gold card cost table]` 是等级/序号到费用数值的静态表，不证明金币扣除。
- 可以说 `event/heromissionevent.evt` 的 `[repeat]`、`[reset]` 和 `[condition]` 是活动任务计数/重置线索，不证明计数器生效。
- 可以说 `[price]` 在 stackable 配方、商店商品等父上下文中可作为价格线索，但不能跨文件族自动同义。

## 禁止结论

- 不把 `[price]`、`[cost]`、`[cash]`、`[medal]`、`[need material]`、`[gold card cost table]` 写成真实扣费成功。
- 不把 `mileage`、`token`、`point`、`coin`、`fatigue` 写成账号余额、疲劳值、点数或代币实际写入成功。
- 不把 `[db table]`、`[repeat]`、`[reset]`、`[condition]`、`[daily match count]` 写成数据库存在、每日重置或计数器实机生效。
- 不把活动 `[reward]`、`[item]`、邮件配置、翻牌空白物品、PC 房卡或里程商店候选写成物品实际发放。
- 不把 `serverparameter` 经济字段写成服务端一定读取或最终公式。
- 不把辅助对照更高金币上限、更多限制物品行或不同活动奖励提升为主目标事实。

## 下一步测试建议

本主线当前只做静态知识封存。后续如果要验证实际经济行为，最小顺序是：先选单一入口，例如里程商店兑换、签到疲劳领取、翻牌金牌费用或限制物品补充次数；再确认 item/equipment registry、账号状态、服务端开关、UI/资源、背包空间和日志；最后走受控输出 PVF、读回和实机验证。不要直接改源 PVF。
