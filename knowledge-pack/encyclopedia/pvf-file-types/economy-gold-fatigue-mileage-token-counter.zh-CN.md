# Economy / Gold / Fatigue / Mileage / Token / Counter 文件类型

状态：默认可用

本文解释经济、金币、疲劳、里程、代币、点数、计数器和限制字段是什么、如何路由、哪些结论必须验证。

## 是什么

本主线不是单一经济系统，而是一组跨 `etc/`、`event/`、`stackable/`、`itemshop/`、`equipment/` 和文本表的静态入口：

- `etc/goldlimitbylevel.etc`：等级到金币上限的静态表。
- `etc/mileageshop.etc`：独立里程商店表，含 coin、item、premium、creature 等候选块。
- `stackable/mileage.stk`：里程/红利点数本体。
- `nexon/cerashopmileage.txt`：商城里程 percent 与 ipg_no 表。
- `etc/chn_server_limititemusageinfo.etc`：限制物品 reset/refill/usage info 入口。
- `event/*.evt`：活动疲劳、签到、任务、奖励、邮件和计数器入口。
- `etc/serverparameter.etc`：全局经济参数、费用、点数、疲劳和计数器的高风险集合。
- `itemshop/*.shp` 与商品文件：普通商店和价格/兑换材料入口。
- `stackable/professional/recipe/*.stk`、装备标题等：配方价格、材料消耗和强化费用修饰入口。

## 常见 registry

| Registry | 用途 |
| --- | --- |
| `stackable/stackable.lst` | 里程点数、代币、材料、消耗品、活动奖励、配方、券和箱子。 |
| `equipment/equipment.lst` | 配方结果装备、商店装备、标题装备、费用折扣装备。 |
| `itemshop/itemshop.lst` | 普通 `.shp` 商店注册。里程商店不走普通 `.shp`。 |
| `n_quest/quest.lst` | 某些数字会和 stackable 或其他 registry 冲突。 |
| 其他 registry | passiveobject、map 等也可能命中同一数字，必须靠父块裁决。 |

## 典型路由

1. 查金币上限：读 `etc/goldlimitbylevel.etc [gold limit from level]`。
2. 查普通 NPC 商店价格：先走 NPC 和 `itemshop/itemshop.lst` 到 `.shp [sell item]`，再读商品文件的 `[price]`、`[cash]`、`[need material]` 或 `[medal]`。
3. 查里程商店：读 `etc/mileageshop.etc`，再按父块解析候选数字；里程点数本体读 `stackable/mileage.stk`。
4. 查商城里程百分比：读 `nexon/cerashopmileage.txt`，注意 `ipg_no` 不是普通 PVF item ID。
5. 查疲劳活动：读活动 `.evt` 的 `[db table]`、`[fatigue]`、`[reward]`、`[send mail]`。
6. 查活动任务计数：读 `[mission]` 下的 `[type]`、`[repeat]`、`[reset]`、`[condition]`、`[item]`。
7. 查限制物品次数：读 `etc/chn_server_limititemusageinfo.etc` 的 `[reset item]`、`[refill item]` 和 `[Limit Item Usage Info]`。
8. 查全局费用、点数、每日次数：读 `etc/serverparameter.etc` 的对应父标签，再回专门主线复核。
9. 查配方/强化费用：读配方 stackable 或装备字段，再按 Upgrade / Recipe 主线解释。

## 常见误区

- 不要把里程商店当普通 `itemshop/*.shp`。
- 不要把 `ipg_no` 当 `stackable/stackable.lst` 或 `equipment/equipment.lst` ID。
- 不要把 `[price]` 在所有文件族里自动解释成同一含义。
- 不要把 `token`、`point`、`coin`、`fatigue`、`count`、`reset` 字段写成账号状态或数据库计数成功。
- 不要把 `[db table]` 写成数据库表真实存在。
- 不要把 `[condition]` 的裸数字硬命名为通用列义。
- 不要把高等级金币上限、限制物品行数或活动奖励从辅助对照复制到主目标。

## 必须验证的地方

静态只读只能证明 PVF 内部配置存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 服务端是否实际读取经济参数、里程商店、限制物品和活动表。
- 账号是否有金币、点券、里程、token、疲劳、luck point、action point 或对应余额。
- 购买、兑换、制作、强化、翻牌、签到、任务领取、限制物品补充是否扣费或发放成功。
- 每日、每周、账号、角色维度的计数器是否增长、重置或拦截。
- UI 是否显示、按钮是否可点、邮件是否送达、背包是否写入、客户端资源是否完整。

## 后续测试顺序

如果要从静态知识进入验证阶段，先选一个单点，不要混测整条主线：

1. 里程商店兑换：确认 `mileageshop` 目标条目、里程点数、候选商品 registry、商城/里程服务端开关和 UI。
2. 疲劳签到：确认活动 `.evt`、DB/计数器、疲劳消耗、奖励 stackable、邮件和实机领取。
3. 金牌翻牌费用：确认 clearreward 费用表、金币余额、翻牌 UI、扣费日志和奖励发放。
4. 限制物品补充：确认 `refill item` 目标、日期 token、使用次数计数和服务端限制。
5. 配方或强化费用：确认配方/装备字段、材料/金币余额、NPC/UI、扣除和结果。

所有验证都必须走受控输出 PVF、读回和实机检查；不要覆盖源 PVF。
