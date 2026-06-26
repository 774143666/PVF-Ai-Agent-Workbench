# ETC / Event Config 字段字典

状态：默认可用

用途：解释 `etc/`、`event/` 和活动配置相关标签的静态口径。本文不授权写 PVF。

## 核心术语

| 术语 | 静态含义 | 主目标观察 | 边界 |
| --- | --- | --- | --- |
| `etc/` | 通用配置、支持表、全局参数和小型 registry 家族 | 关注范围内 896 个文件 | 不是一个统一业务系统，必须看具体文件和父标签 |
| `event/` | 活动 `.evt`、活动列表、公告、奖励、小游戏和活动资源配置家族 | 关注范围内 92 个文件 | `.evt` 存在不等于活动开启 |
| `event_config/` | 活动配置顶层目录候选 | 主目标未观察到，辅助也未观察到 | 不能按目录名假设存在 |
| `ui/event/` | 活动 UI 资源引用文件家族 | 主目标 345 个文件 | 不证明客户端 UI 正常或资源完整 |
| `.evt` | 活动配置文本文件 | 主目标 67 个关注文件 | 不证明服务端开关、活动参数或数据库状态 |
| `.etc` | 配置表/支持表/全局参数文本文件 | 主目标 267 个关注文件 | 同名字段跨文件不自动同义 |
| `.lst` | registry 或列表入口 | 关注范围内 13 个 registry 文件 | 数字 ID 必须按父 registry 解析 |
| DB-like token | `db table`、`dnf_event`、`event_*` 等数据库样文本 | 主目标 44 个文件含此类 token | 不证明数据库表存在、触发器存在或计数生效 |
| 日期 token | 8 位日期样文本 | 主目标 5 个文件含日期形态 | 不证明服务器时间、活动周期或时区正确 |
| URL token | URL 样文本 | 主目标 16 个文件含 URL 形态 | 不证明链接可用或 UI 可点击 |

## 活动入口标签

| 标签 | 观察位置 | 静态口径 | 边界 |
| --- | --- | --- | --- |
| `[event_list]` | `event/ingameeventlist.evt` | 活动列表父块 | 不证明服务端活动开启 |
| `[event]` | 多个活动文件 | 活动条目或活动块 | 同名标签需看父文件 |
| `[idx]` | `event/ingameeventlist.evt` | 活动条目的编号/文件引用列形线索 | 不等同全局 item 或 quest ID |
| `[record type]` | `event/ingameeventlist.evt` | 活动记录类型字段 | 不证明计数器实现 |
| `[start]` / `[end]` / `[state]` | 活动列表、公告类文件 | 日期/状态样字段 | 不证明服务器时间或开启状态 |
| `[event id]` | `event/eventnotice.evt` | 活动公告 ID 列表字段 | 不证明公告实际展示 |
| `[on]` / `[off]` / `[ing]` | `event/eventnotice.evt` | 公告状态分组线索 | 不证明状态切换 |

## 活动内容标签

| 标签 | 观察位置 | 静态口径 | 边界 |
| --- | --- | --- | --- |
| `[gift growth weapon box]` | `event/growthweapon.evt` | 成长武器箱子候选字段 | 数字需按物品 registry 复核 |
| `[growth material item]` | `event/growthweapon.evt` | 成长材料道具候选字段 | 不证明材料消耗成功 |
| `[growth material item max]` | `event/growthweapon.evt` | 成长材料上限候选字段 | 不证明上限实机一致 |
| `[event bubble max]` | `event/growthweapon.evt` | 成长阶段上限候选字段 | 不证明 UI 阶段正确 |
| `[event sand max]` | `event/growthweapon.evt` | 每阶段计数候选字段 | 不证明计数器生效 |
| `[growth equipment reward list]` | `event/growthweapon.evt` | 成长装备奖励列表候选字段 | 每个装备 ID 必须解析 registry |
| `[Seria Blessing]` | `event/seriablessing.evt` | 单独活动配置块 | 当前不解释内部列语义 |
| `[step]` / `[day]` / `[reward]` | `event/tw_creatednf.evt` | 阶段、天数、奖励表形态 | 不证明活动进度计算 |

## 签到、任务和邮件标签

| 标签 | 观察位置 | 静态口径 | 边界 |
| --- | --- | --- | --- |
| `[title]` / `[explain]` | `event/attendance.evt`、公告类文件 | 标题和说明文本 | 不证明 UI 显示正常 |
| `[db table]` | `event/attendance.evt` | 数据表名样字段 | 不证明数据库表存在 |
| `[fatigue]` | `event/attendance.evt`、契约类配置 | 疲劳值条件或服务效果字段 | 同名标签跨文件需分开解释 |
| `[reward]` | `event/attendance.evt`、`event/tw_creatednf.evt` | 奖励列表或奖励块 | 不证明奖励发放 |
| `[send mail]` | `event/attendance.evt` | 邮件发送开关/参数候选 | 不证明邮件实际发送 |
| `[hero event]` | `event/heromissionevent.evt` | 活动任务父块 | 不证明活动任务可见 |
| `[mission]` | `event/heromissionevent.evt` | 活动任务条目 | 不证明任务计数增长 |
| `[type]` / `[repeat]` / `[reset]` | `event/heromissionevent.evt` | 活动任务类型、重复、重置候选字段 | 不证明每日重置或重复逻辑 |
| `[item]` / `[condition]` | `event/heromissionevent.evt` | 奖励物品和条件列形 | item 数字必须按 registry 解析 |
| `[mail title]` / `[mail content]` | `event/heromissionevent.evt` | 邮件文本 key 或文本字段 | 不证明邮件发放或本地化加载 |

## 成长支援和契约标签

| 标签 | 观察位置 | 静态口径 | 边界 |
| --- | --- | --- | --- |
| `[breakaway section]` | `etc/growthpowerrewardbuff.etc` | 成长阶段/等级段候选字段 | 不证明等级判断生效 |
| `[exp reward]` | `etc/growthpowerrewardbuff.etc` | 经验奖励/倍率候选字段 | 不证明经验实机增加 |
| `[package reward]` | `etc/growthpowerrewardbuff.etc` | 职业/阶段礼包候选块 | 礼包内 item 必须解析 registry |
| `[Dialog]` | `etc/growthpowernpcdialog.etc` | NPC 对话文本块 | 不证明 NPC 交互触发 |
| `[inventory limit]` | `etc/premiumlist_new.etc` | 背包/负重或扩展类候选字段 | 不证明客户端显示和服务端放行 |
| `[bonus exp]` | `etc/premiumlist_new.etc` | 经验加成候选字段 | 不证明实际经验倍率 |
| `[quest item drop rate]` | `etc/premiumlist_new.etc` | 任务道具掉率候选字段 | 不证明任务道具掉落 |
| `[independent drop rate]` | `etc/premiumlist_new.etc` | 独立掉落倍率候选字段 | 不证明掉率实机一致 |

## 全局配置和清算标签

| 标签 | 观察位置 | 静态口径 | 边界 |
| --- | --- | --- | --- |
| `[script version]` | `etc/serverparameter.etc`、`etc/etcparameter.etc` | 配置版本/脚本版本字段 | 不证明客户端或服务端版本兼容 |
| `[drop prob]` | `etc/serverparameter.etc`、`etc/itemdropinfo_clearreward.etc` | 掉落概率表形态 | 静态权重不等于实机概率已验 |
| `[dungeon difficulty drop bonusrate]` | 清算/全局参数文件 | 副本难度掉落倍率候选字段 | 不证明副本实机掉落 |
| `[gold card cost table]` | `etc/itemdropinfo_clearreward.etc` | 金牌费用表候选字段 | 不证明金币扣除或翻牌 UI |
| `[gold card blank item]` | `etc/itemdropinfo_clearreward.etc` | 金牌空白物品候选字段 | item ID 需解析 |
| `[pcroom card blank item]` | `etc/itemdropinfo_clearreward.etc` | PC 房/黑钻翻牌物品候选字段 | 不证明 PC 房或黑钻状态 |
| `[item drop ref table]` | `etc/itemdropinfo_clearreward.etc` | 掉落引用表候选字段 | 不证明实际发放 |
| `[reset item]` / `[refill item]` | `etc/chn_server_limititemusageinfo.etc` | 重置/补充道具配置线索 | 不证明每日重置或自动赠送 |

## 解析规则

| 场景 | 正确动作 | 禁止动作 |
| --- | --- | --- |
| 看到活动 ID 或 idx | 先确定父文件和父块，再查是否有对应 `.evt` 或服务端入口 | 直接当 item、quest、npc 或 dungeon ID |
| 看到 item / reward 数字 | 按父上下文解析 equipment、stackable 或其他 registry | 靠数字外形猜物品类型 |
| 看到 DB-like token | 记录为服务端/数据库依赖风险 | 写成数据库表已存在或计数器有效 |
| 看到 URL 或 UI 文件 | 记录为 UI/客户端验证点 | 写成客户端可点击或资源完整 |
| 看到资料线索中的字段解释 | 回主目标 PVF 验证文件、标签和列形 | 直接写成正式机制规则 |

