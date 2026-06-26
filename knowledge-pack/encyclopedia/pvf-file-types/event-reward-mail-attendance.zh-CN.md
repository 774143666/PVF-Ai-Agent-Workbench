# Event Reward / Mail / Attendance 文件类型

状态：默认可用

本文解释活动奖励交付、邮件配置、签到、活动任务和活动奖励表是什么、如何路由、哪些地方必须验证。

## 是什么

活动奖励交付不是单一文件完成的系统，而是多个静态配置层组合：

- `event/ingameeventlist.evt`：活动列表入口，记录活动文件名、日期和状态样值。
- `event/attendance.evt`：签到/疲劳出席配置，含奖励列表和邮件子块。
- `event/heromissionevent.evt`：活动任务配置，含任务条件、奖励物品和邮件文本 token。
- `event/eventreward/reward.evt` 与 `reward_*.evt`：职业/全职业奖励路由和奖励明细。
- `event/eventserver/*.evt`：活动服务端奖励和世界掉落表形态。
- `stackable/stackable.lst`：多数活动奖励、邮件附件、材料、箱子和消耗品的解析 registry。
- `equipment/equipment.lst`：职业奖励表中装备奖励的解析 registry。

## 常见 registry

| Registry | 解析对象 |
| --- | --- |
| `stackable/stackable.lst` | 活动材料、箱子、药水、签到币、邮件附件、奖励消耗品等。 |
| `equipment/equipment.lst` | 活动装备、职业武器、防具、首饰等奖励。 |
| `event/eventreward/reward.evt` | job code 到 `reward_*.evt` 的活动奖励内部路由。 |

## 典型路由

1. 查活动入口：读 `event/ingameeventlist.evt`，找到活动文件名、日期和状态样值。
2. 查签到奖励：读 `event/attendance.evt [reward]`，再按 `stackable/stackable.lst` 解析物品 ID。
3. 查签到邮件：读 `event/attendance.evt [send mail]`、`[inven]`、`[detail]`，只作为邮件配置线索。
4. 查活动任务奖励：读 `event/heromissionevent.evt [mission]`，解析 `[item]` 和 `[condition]`，邮件文本看 `[mail title]`、`[mail content]`。
5. 查职业奖励：先读 `event/eventreward/reward.evt`，再读对应 `reward_*.evt`；`[equipment item]` 走 equipment，`[stackable item]` 走 stackable。
6. 查活动服务端奖励：读 `event/eventserver/eventserver.evt` 或 `eventserverlevelreward.evt`，按父块解析等级、物品和数量样列形。
7. 查世界掉落：`event/eventserver/eventserverworlddrop.evt [world drop]` 只作为世界掉落/概率表，后续转 Clear Reward 或掉落主线。

## 常见误区

- 不要把 `[state] 1` 或日期字段写成活动当前开启。
- 不要把 `20230211` 到 `20240411` 这类静态日期写成当前有效期。
- 不要把 `[db table]` 写成真实数据库表存在。
- 不要把 `[send mail]` 写成邮件已经发送。
- 不要把 `[mail title]`、`[mail content]` 写成客户端文本正常显示。
- 不要把 `postal`、`inven`、`equip` 写成实际投递位置成功。
- 不要把同一个裸数字跨文件、跨 registry 直接复用。
- 不要用辅助对照更大的 registry 或更多活动文件补主目标事实。

## 必须验证的地方

静态只读只能证明 PVF 内部配置存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 活动入口是否出现，按钮是否可点。
- 服务端时间、活动开关、DB 表和计数器是否生效。
- 签到、任务、等级、购买、疲劳、支付等条件是否被正确判定。
- 邮件是否送达，标题/正文是否显示，附件是否到账。
- 奖励是否领取成功，背包空间是否足够，金币或材料是否正确增减。
- 箱子是否能打开，装备是否能生成、穿戴或保持预期状态。
- 客户端 UI、图片、动画、声音和本地化资源是否完整。
