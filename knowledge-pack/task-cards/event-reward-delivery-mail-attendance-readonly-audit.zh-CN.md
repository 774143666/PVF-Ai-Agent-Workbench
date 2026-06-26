# Event Reward Delivery / Mail / Attendance 只读核查

状态：默认可用

用途：用于复核活动奖励发放链、邮件配置、签到奖励、活动任务奖励、职业奖励表和活动服务端奖励表的静态边界。本文只回答“配置在哪里、数字应按哪个 registry 解析、哪些字段只是交付线索”，不证明活动开启、邮件发送成功、奖励领取成功、背包写入成功、金币发放成功、计数器生效、UI 正常、客户端资源完整或服务端放行。

## 默认读法

1. 先读 `safety/README.zh-CN.md`，确认当前任务只读，不写 PVF、不改客户端。
2. 再读 `dictionaries/event-reward-delivery-mail-attendance-fields.zh-CN.md`，确认标签和数字上下文。
3. 需要主目标矩阵时读 `indexes/event-reward-delivery-mail-attendance-boundary.zh-CN.md`。
4. 需要文件类型解释时读 `encyclopedia/pvf-file-types/event-reward-mail-attendance.zh-CN.md`。
5. 如果问题转向活动列表、公告、UI 资源、任务主线、清算翻牌、NPC 商店或礼包箱子，转读 ETC/Event、Client Assets、Quest、Clear Reward、NPC Shop、Stackable Container 等已封存主线。

## 核查顺序

1. 高价值资料、教程、社区说明和工具字段只能作为定向线索；字段结论必须回到主目标 PVF 只读观察。
2. 活动是否被列表引用，先看 `event/ingameeventlist.evt` 的 `[event_list]`、`[idx]`、`[record type]`、`[start]`、`[end]`、`[state]`。
3. 签到奖励先看 `event/attendance.evt` 的 `[db table]`、`[fatigue]`、`[reward]`、`[send mail]`。
4. 活动任务奖励先看 `event/heromissionevent.evt` 的 `[mission]`、`[type]`、`[repeat]`、`[reset]`、`[item]`、`[condition]`、`[mail title]`、`[mail content]`。
5. 职业/全职业奖励表先看 `event/eventreward/reward.evt`，再读对应 `reward_*.evt` 的 `[job type]`、`[sub type]`、`[equipment item]`、`[stackable item]`。
6. 活动服务端奖励表先看 `event/eventserver/`，其中 `eventserver.evt` 和 `eventserverlevelreward.evt` 是等级/职业奖励形态，`eventserverworlddrop.evt` 是世界掉落形态。
7. 裸数字必须按父块解析到 `stackable/stackable.lst` 或 `equipment/equipment.lst`；不能靠数字外形猜。
8. 辅助对照 PVF 只能提示同类字段扩张和差异，不覆盖主目标事实。

## 可接受结论

- 可以说主目标存在 92 个 `event/` 顶层文件、13 个 `event/eventreward/` 文件、3 个 `event/eventserver/` 文件。
- 可以说主目标 `event/ingameeventlist.evt` 记录了 `Attendance.evt` 等活动文件名、日期样值和状态样值。
- 可以说主目标 `event/attendance.evt` 观察到签到标题、说明、DB-like token、疲劳字段、奖励列表和 `[send mail]` 子块。
- 可以说主目标 `[send mail]` 在 9 个 `event/` 文件中命中，`[mail title]` 在 3 个 `event/` 文件中命中，`[mail content]` 在 2 个 `event/` 文件中命中。
- 可以说主目标活动奖励样本 ID 已按正确 registry 闭合，例如签到奖励 `690000005` 解析到 stackable，职业奖励表中 `[equipment item]` 解析到 equipment，`[stackable item]` 解析到 stackable。
- 可以说辅助对照有更多 `event/` 顶层文件和更多 `[mail title]` 命中文件，但这只提示版本差异。

## 禁止结论

- 不把 `[state] 1`、日期字段或活动文件存在写成活动当前开启。
- 不把 `[db table]`、`event_*` token 写成数据库表存在、计数器生效或服务端放行。
- 不把 `[reward]`、`[item]`、`[equipment item]`、`[stackable item]` 写成奖励实际发放。
- 不把 `[send mail]`、`[detail]`、`[mail title]`、`[mail content]` 写成邮件实际发送或文本正常显示。
- 不把 `postal`、`inven`、`equip` 等子类型 token 写成背包、装备栏或邮箱写入成功。
- 不把辅助对照的更多活动文件、更多邮件标题或不同奖励 ID 提升为主目标事实。

## 验收提示

日常问到“活动奖励从哪里来”“签到奖励怎么查”“邮件标题和奖励物品在哪”“为什么活动奖励数字不能直接改”等问题，先从本 task-card 进入。若要证明活动出现、按钮可点、邮件到达、奖励领取、背包占位、金币发放、次数计数或服务端开关，必须进入后续实机或服务端验证阶段。
