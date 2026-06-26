# ETC / Event Config 文件类型

状态：默认可用

## 用途

`etc/` 和 `event/` 是 PVF 中跨度很大的配置家族。它们可以承载全局参数、活动列表、活动本体、成长支援、签到、活动任务、公告弹窗、契约/黑钻、清算翻牌、PVP 表、随机属性支持表、教程引导、小游戏资源 registry 等。

本页只说明主目标 PVF 中观察到的静态文件类型和边界。

## 常见文件类型

| 类型 | 观察位置 | 用法 | 边界 |
| --- | --- | --- | --- |
| `.evt` | `event/*.evt` | 活动本体、活动列表、活动公告、奖励表 | 不证明活动开启或服务端参数生效 |
| `.etc` | `etc/*.etc`、`etc/*/*.etc` | 通用配置、全局参数、支持表 | 不是统一语义，必须看文件名和标签 |
| `.lst` | `etc/*.lst`、`event/*/*.lst` | registry 或列表入口 | 数字 ID 必须按具体 registry 解析 |
| `.ui` | `ui/event/*.ui` | 活动 UI 描述 | 不证明客户端资源完整或 UI 正常 |
| `.str` | `event/*.str`、`etc/*.str` | 字符串资源候选 | 不证明加载优先级 |
| `.gdata` | `etc/guide/*.gdata` 等 | 引导/帮助页数据 | 不证明 UI 展示 |
| `.rep` | `etc/pvppracticecombo/*.rep` 等 | 练习/回放类资源 | 不等同活动配置 |
| `.bm` / `.bt` | `event/bluemarble/` | bluemarble map/tile 资源 | 不证明小游戏实机可玩 |
| `.vm` | vending machine registry 目标 | 贩卖机配置资源 | 不证明入口可见或购买成功 |

## 活动文件链路

常见静态链路可以是：

1. 活动列表文件记录 `[idx]`、日期和状态。
2. `[idx]` 或同块文本引用一个活动 `.evt` 文件名。
3. 活动 `.evt` 内记录奖励、条件、邮件、DB-like token、公告或 UI 线索。
4. 奖励数字再按父上下文解析到 item/equipment/stackable 等 registry。
5. UI 文件、图片、动画和客户端资源另走资源主线验证。

此链路只证明静态结构，不证明服务端活动开关、计数器、奖励或 UI。

## ETC 文件处理规则

- `etc/serverparameter.etc` 是高风险全局配置，不把单个字段存在写成实机效果。
- `etc/premiumlist_new.etc` 可见契约/黑钻/服务效果类标签，但不证明服务端状态或客户端显示。
- `etc/growthpowerrewardbuff.etc` 可见成长支援奖励和经验表形态，但 item 数字仍需 registry 解析。
- `etc/itemdropinfo_clearreward.etc` 与清算翻牌相关，但不证明概率、翻牌 UI 或发放。
- `etc/randomoption/*`、`etc/pvpskilltree/*`、`etc/independentdrop/*` 已有其他主线封存，遇到这些内容应回对应主线复核。

## 写入边界

改 ETC/Event 前必须确认：

1. 目标文件和父块。
2. 数字列应该走哪个 registry。
3. 是否涉及服务端活动开关、DB 表或时间参数。
4. 是否涉及客户端 UI、IMG、ANI、NPK 或声音资源。
5. 是否需要任务计数器、邮件、奖励、掉落或翻牌实机验证。
6. 输出 PVF 不能覆盖源 PVF，保存后必须重新打开读回。

本页不授权直接开启活动、修改奖励、修改全局概率或改客户端资源。
