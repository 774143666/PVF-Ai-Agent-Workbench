# Event Reward Delivery / Mail / Attendance Boundary

状态：默认可用

用途：记录主目标 PVF 中活动奖励交付、邮件配置、签到、活动任务、职业奖励表和活动服务端奖励表的静态只读边界。本文不授权写 PVF，不证明活动开启、邮件送达、奖励发放、领取成功、UI 正常、客户端资源完整或服务端放行。

## 审计快照

| 项 | 主目标静态结论 |
| --- | ---: |
| PVF 文件总数 | 402963 |
| `event/` 顶层文件 | 92 |
| `event/eventreward/` 文件 | 13 |
| `event/eventserver/` 文件 | 3 |
| `[send mail]` 命中文件 | 9 |
| `[detail]` 命中文件 | 8 |
| `[mail title]` 命中文件 | 3 |
| `[mail content]` 命中文件 | 2 |
| `postal` 命中文件 | 1 |
| `stackable/stackable.lst` 条目 | 10372 |
| `equipment/equipment.lst` 条目 | 72631 |

## 活动列表入口

主目标 `event/ingameeventlist.evt` 观察到 12 个 `[event]` 条目。代表链路：

| idx | 文件名 | record type | start | end | state | 边界 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 86 | `Attendance.evt` | 1 | 20230211 | 20240411 | 1 | 日期和 state 只是静态字段，不证明活动在 2026-06-11 当前开启。 |
| 406 | `ExchangeRandomItemReward.evt` | 3 | 20111027 | 20111106 | 0 | 不证明随机奖励交换活动可用。 |
| 407 | `AvatarDisjointRandomReward.evt` | 4 | 20111027 | 20111106 | 0 | 不证明随机奖励发放。 |
| 404 | `LevelUpReward.evt` | 13 | 20130514 | 20130711 | 1 | 不证明升级奖励邮件发送。 |

## 签到入口

| 文件 | 标签形态 | 主目标静态观察 | 已解析样本 | 边界 |
| --- | --- | --- | --- | --- |
| `event/attendance.evt` | `[event]`、`[title]`、`[explain]`、`[db table]`、`[fatigue]`、`[reward]`、`[reward explain]`、`[send mail]`、`[inven]`、`[detail]` | 签到/疲劳出席配置；`[fatigue]` 为 `30`；`[reward]` 中重复 `690000005 3`；`[send mail]` 下有 `[detail]` 文本 token。 | `690000005` -> `stackable/twdf/event/130417_DailyCheck/130417_PineappleCake.stk`，名称为“卡妮娜做的凤梨酥”。 | 不证明 DB 表、疲劳计数、签到按钮、邮件发送或奖励领取成功。 |

## 邮件配置入口

主目标 `[send mail]` 命中文件：

| 文件 | 观察到的邮件形态 | 代表解析 | 边界 |
| --- | --- | --- | --- |
| `event/2012newyearevent.evt` | `[final reward]` 后接 `[send mail]`、`[inven]`、`[detail]`。 | `2660462` -> stackable 礼盒。 | 不证明最终奖励或邮件发放。 |
| `event/accountfirstlogin.evt` | `[db table]` 后接 `[send mail]`、附件样 `690000000 1` 和文本 token。 | `690000000` -> stackable 称号礼盒。 | 不证明首登判定或邮件到达。 |
| `event/accountfirstlogin2.evt` | `[job]` 子块按职业给 `8006`，再接 `[detail]`。 | `8006` 在主目标 stackable 中可解析为礼物袋；仍须按 `[job]` 父块解释。 | 不证明职业分支或分期发放。 |
| `event/attendance.evt` | 签到 `[send mail]`，`[detail]` 数字为 `0 0 0 0` 加文本 token。 | 无附件样物品 ID。 | 不证明邮件发送。 |
| `event/avatardisjointrandomreward.evt` | `[random reward item]` 后接 `[send mail]`。 | `2660393` 可按 stackable 解析。 | 不证明随机池或邮件。 |
| `event/exchangerandomitemreward.evt` | `[material]`、`[random reward item]` 后接 `[send mail]`。 | `8287` 需在具体任务中再解析。 | 不证明材料扣除或随机发放。 |
| `event/levelupreward.evt` | 空 `[level up]` 后接 `[send mail]` 和 `[inven]`，无 `[detail]`。 | 无附件样物品 ID。 | 不证明升级奖励开启。 |
| `event/objectbringupevent.evt` | `[eventitem send]` 与 `[send]` 下均可嵌 `[send mail]`。 | `2660413`、`8391` 可按 stackable 解析。 | 不证明培育计数或多段发放。 |
| `event/purchasecashitembonus.evt` | `[send]` 下按购买次数接 `[send mail]`，有物品和疑似金币列形。 | `2660413` 可按 stackable 解析；`1000000` 只保留为数值列风险。 | 不证明购买次数、金币或附件发放。 |

## 活动任务与邮件文本

| 文件 | 标签形态 | 主目标静态观察 | 已解析样本 | 边界 |
| --- | --- | --- | --- | --- |
| `event/heromissionevent.evt` | `[hero event]` 下 6 个 `[mission]`；每个含 `[type]`、`[repeat]`、`[reset]`、`[item]`、`[condition]`、`[mail title]`、`[mail content]`。 | 任务类型含 `payment`、`normal`、`final`；`[item]` 使用条目数 + item/数量样列形；`[condition]` 长度可变。 | `690017133` -> `stackable/690017137.stk`，名称为“装有灵魂晶石的盒子”。 | 不证明任务计数、支付判断、重复重置、邮件或奖励成功。 |
| `event/characdayevent.evt` | `[job]`、`[step]`、`[mail title]`。 | `[step]` 行含阶段、阈值、物品、数量和文本 token。 | `7825`、`8288` 可按 stackable 解析。 | 不证明角色日活动生效。 |
| `event/tw_levelupsupport2nd.evt` | `[job type]`、`[step]`、`[level]`、`[reward]`、`[mail title]`、`[mail content]`。 | `at mage` 等级奖励样表。 | `690000009`、`1106`、`1112` 可按 stackable 解析。 | 不证明升级触发或邮件发放。 |

## 职业奖励表

| 文件 | 静态观察 | 代表解析 | 边界 |
| --- | --- | --- | --- |
| `event/eventreward/reward.evt` | 将 job code `0` 到 `8` 和 `99` 映射到 `reward_swordman.evt`、`reward_fighter.evt`、`reward_gunner.evt`、`reward_mage.evt`、`reward_priest.evt`、`reward_at_gunner.evt`、`reward_thief.evt`、`reward_at_fighter.evt`、`reward_at_mage.evt`、`reward_alljob.evt`。 | 文件名存在于同目录。 | job code 只在该表内解释。 |
| `event/eventreward/reward_alljob.evt` | `[job type] common`；含 `equip`、`inven`、`postal` 子类型；含 `[equipment item]` 和 `[stackable item]`。 | `20197` -> equipment 项链；`10000223`、`3037`、`10000210` 等走 stackable。 | `postal` 只证明静态 token，不证明邮箱投递。 |
| `event/eventreward/reward_swordman.evt` | 多个 `swordman` job type 分支；`[option] upgrade 10`；`[equipment item]`。 | `101040047` -> equipment 武器“炎日[活动]”。 | 不证明强化、装备生成或职业限制实机成功。 |
| `event/eventreward/reward_at_fighter.evt`、`reward_mage.evt`、`reward_priest.evt` | 与 swordman 类似，按职业 token 和装备列表组织。 | 样本装备 ID 均按 equipment 解析。 | 不外推为所有职业奖励运行规则。 |

## 活动服务端奖励表

| 文件 | 静态观察 | 代表解析 | 边界 |
| --- | --- | --- | --- |
| `event/eventserver/eventserver.evt` | 按职业 token 和职业内编号给出等级、物品 ID、数量样列形。 | `8140` -> `stackable/event/eventserver/event_30lv_sm1.stk`。 | 不证明服务端采用或等级奖励发放。 |
| `event/eventserver/eventserverlevelreward.evt` | `[Event Server LevelUp Reward]` 下为等级、物品 ID 样列形。 | `8209`、`8119` 可按 stackable 解析。 | 不证明升级触发。 |
| `event/eventserver/eventserverworlddrop.evt` | `[world drop]` 下为大体量物品/数值表。 | `1106`、`1112` 等样本走 stackable；其它数字需按上下文逐个解析。 | 属于世界掉落/概率边界，不证明邮件、签到或奖励领取。 |

## 辅助对照提示

| 项 | 主目标 | 辅助对照 | 差异提示 |
| --- | ---: | ---: | --- |
| PVF 文件总数 | 402963 | 1052773 | 辅助体量更大。 |
| `event/` 顶层文件 | 92 | 109 | 辅助多出若干 `tw_*` 活动和账号升级奖励入口。 |
| `event/eventreward/` 文件 | 13 | 13 | 职业奖励文件族数量一致。 |
| `[send mail]` 命中文件 | 9 | 9 | 数量一致，但辅助将 `objectbringupevent.evt` 换成 `levelupreward_account.evt` 命中。 |
| `[mail title]` 命中文件 | 3 | 12 | 辅助有更多 TW 活动邮件文本 token。 |
| `stackable/stackable.lst` 条目 | 10372 | 20604 | 辅助物品 registry 更大。 |
| `equipment/equipment.lst` 条目 | 72631 | 107413 | 辅助装备 registry 更大。 |

辅助代表差异：

- 辅助 `event/attendance.evt` 仍有 `[db table]`、`[fatigue]`、`[reward]`、`[send mail]`，但奖励 ID 改为 `490016307`，可按辅助 stackable 解析为“签到硬币”；说明文本出现 88 点疲劳描述，而 `[fatigue]` 字段仍为 `30`，只作为文本/字段不一致风险提示。
- 辅助 `event/ingameeventlist.evt` 的 `Attendance.evt` 日期样值为 `20240601` 到 `20240831`，并多出 `LevelUpReward_account.evt` 条目。
- 辅助 `event/heromissionevent.evt` 的任务奖励 ID 与主目标不同，例如 `690000299`、`2021458801` 可按辅助 stackable 解析。
- 辅助 `event/tw_facebooklike.evt`、`event/tw_levelupsupport3rd.evt` 等提供更多活动奖励和邮件文本形态，但不能覆盖主目标事实。

## 静态与动态边界

静态只读可以确认：

- 活动列表、活动本体、奖励表、邮件子块、DB-like token、日期 token 和文本 token 是否出现。
- 奖励数字在正确父块下能否解析到 stackable 或 equipment registry。
- 主目标和辅助对照在文件数量、命中标签和样本 ID 上的差异。

静态只读不能确认：

- 活动是否真的开启。
- 服务端是否采用 `[state]`、日期、DB-like token、计数器、任务条件或活动 ID。
- 邮件是否发送成功、附件是否到账、金币是否到账、背包空间是否足够。
- 奖励是否可领取、可开箱、可装备或可使用。
- UI 是否显示、按钮是否可点、文本是否正常本地化。
- 客户端资源是否完整。
- 辅助对照中的更多活动是否适用于主目标。
