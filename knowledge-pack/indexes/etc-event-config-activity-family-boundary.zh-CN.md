# ETC / Event Config / Activity Family Boundary

状态：默认可用

用途：记录主目标 PVF 中 `etc/`、`event/`、活动配置、成长支援、签到、公告、黑钻/契约、清算/掉落支持表和特殊配置家族的静态只读边界。本文不授权写 PVF。

## 审计快照

| 项 | 主目标静态结论 |
| --- | ---: |
| PVF 文件总数 | 402963 |
| ETC/Event 关注文件 | 1334 |
| 可读关注文件 | 489 |
| 读取失败 | 0 |
| `etc/` 顶层文件 | 896 |
| `event/` 顶层文件 | 92 |
| `event_config/` 顶层文件 | 0 |
| `ui/event/` 文件 | 345 |
| 关注范围 registry 文件 | 13 |
| registry 条目 | 114 |
| registry 存在条目 | 94 |
| registry 缺失条目 | 20 |
| 唯一标签 | 1153 |
| 唯一路径引用 token | 6657 |
| 日期形态文件 | 5 |
| URL 形态文件 | 16 |
| DB-like token 文件 | 44 |
| replacement-char 风险文件 | 28 |

## 文件类型分布

| 扩展名 | 文件数 | 口径 |
| --- | ---: | --- |
| `.rep` | 484 | 练习/回放类配置资源，归 ETC 关注范围但不等同活动 |
| `.ani` | 291 | 活动/UI/引导引用的动画资源，需客户端资源主线验证 |
| `.etc` | 267 | 通用配置表和支持表 |
| `.gdata` | 75 | 引导/帮助页数据 |
| `.evt` | 67 | 活动配置文件 |
| `.ui` | 56 | UI 描述文件 |
| `.als` | 27 | 活动或 ETC 资源附属文件 |
| `.bt` | 13 | bluemarble tile |
| `.lst` | 13 | 关注范围 registry |
| `.act` | 12 | 动作资源 |
| `.bm` | 5 | bluemarble map |
| `.str` | 5 | 字符串资源 |
| `.tbl` | 5 | 表格资源 |
| `.vm` | 3 | vending machine 配置 |

## 目录家族

| 家族 | 主目标观察 | 边界 |
| --- | ---: | --- |
| `etc/` | 896 | 通用配置大桶，必须按文件和父标签解释 |
| `event/` | 92 | 活动 `.evt`、活动奖励、小游戏和活动资源 |
| `ui/event/` | 345 | UI/客户端资源引用，不能证明显示正常 |
| `event_config/` | 0 | 主目标未观察到该顶层目录 |
| `event/bluemarble/` | 21 | bluemarble 活动子家族，含 map/tile registry |
| `event/eventreward/` | 13 | 活动奖励子家族 |
| `event/eventserver/` | 3 | 活动服务端相关文本/配置候选 |
| `event/eventcharacter/` | 2 | 活动角色子家族，含小型 registry |
| `etc/randomoption/` | 30 | 随机属性家族，已由 RandomOption 主线封存 |
| `etc/pvpskilltree/` | 9 | PVP 技能树家族，已由 Skill Learnability 主线封存 |
| `etc/independentdrop/` | 10 | 独立掉落家族，已由 Quest/Dungeon 主线复核 |
| `etc/globaltutorialinfo/` | 10 | 全局教程/引导家族 |

## 代表活动文件

| 文件 | 标签形态 | 静态含义 | 边界 |
| --- | --- | --- | --- |
| `event/ingameeventlist.evt` | `[event_list]`、`[event]`、`[idx]`、`[record type]`、`[start]`、`[end]`、`[state]` | 活动列表、文件引用、日期和状态入口 | 不证明服务端活动开启或时间生效 |
| `event/eventlistwindow.evt` | `[entry]`、`[event info]`、`[link popupwindow type]`、`[popupwindow design]`、`[url hyperlink]` | 活动公告和弹窗配置 | 不证明 UI 正常或链接可用 |
| `event/eventnotice.evt` | `[on]`、`[off]`、`[event id]`、`[event]`、`[item]`、`[start]`、`[ing]`、`[end]` | 活动公告状态/文案分组 | 不证明公告实际展示 |
| `event/attendance.evt` | `[title]`、`[explain]`、`[db table]`、`[fatigue]`、`[reward]`、`[send mail]` | 签到/疲劳出席活动配置 | 不证明 DB 计数、邮件或奖励发放 |
| `event/heromissionevent.evt` | `[hero event]`、`[mission]`、`[type]`、`[repeat]`、`[reset]`、`[item]`、`[condition]`、`[mail title]` | 活动任务、条件、奖励和邮件配置 | 不证明任务计数器或邮件发放 |
| `event/growthweapon.evt` | `[gift growth weapon box]`、`[growth material item]`、`[growth equipment reward list]` | 成长武器活动配置 | item/equipment 数字必须按 registry 解析 |
| `event/returnuserreward.evt` | `[pacakege item]`、`[reward equip item]`、职业标签 | 回归奖励/职业分组配置 | 不证明回归资格判断 |
| `event/tw_creatednf.evt` | `[step]`、`[day]`、`[reward]` | 阶段、天数、奖励表 | 不证明活动进度计算 |
| `event/seriablessing.evt` | `[Seria Blessing]` | 单独活动配置块 | 内部列语义未封存 |

## 代表 ETC 支撑文件

| 文件 | 标签形态 | 静态含义 | 边界 |
| --- | --- | --- | --- |
| `etc/growthpowerrewardbuff.etc` | `[breakaway section]`、`[exp reward]`、`[package reward]` | 成长支援等级段、经验和礼包配置 | 不证明等级判断、经验或礼包发放 |
| `etc/growthpowernpcdialog.etc` | `[Dialog]` | 成长支援 NPC 对话配置 | 不证明 NPC 交互触发 |
| `etc/premiumlist_new.etc` | `[fatigue]`、`[inventory limit]`、`[bonus exp]`、`[quest item drop rate]`、`[independent drop rate]` | 契约/黑钻/服务效果配置 | 不证明契约状态或服务端放行 |
| `etc/serverparameter.etc` | 经验、掉落、奖励、疲劳、频道、深渊/PVP 等全局参数标签 | 高风险全局配置 | 不把字段存在写成实机效果 |
| `etc/chn_server_limititemusageinfo.etc` | `[reset item]`、`[refill item]`、`[Limit Item Usage Info]` | 限制、重置、补充类道具配置 | 不证明每日重置或自动赠送 |
| `etc/itemdropinfo_clearreward.etc` | `[drop prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]` | 清算翻牌和卡牌奖励支持表 | 不证明翻牌 UI、概率或发放 |

## Registry 观察

| Registry | 条目 | 存在 | 缺失 | 口径 |
| --- | ---: | ---: | ---: | --- |
| `etc/independentdrop.lst` | 10 | 10 | 0 | 独立掉落 registry |
| `etc/linksystem/strikercombo.lst` | 8 | 8 | 0 | linksystem 练习/连段资源入口 |
| `etc/pvppracticecombo.lst` | 8 | 8 | 0 | PVP 练习 combo 入口 |
| `etc/pvpskilltree.lst` | 9 | 9 | 0 | PVP 技能树 registry |
| `etc/randomoption/randomoption.lst` | 16 | 16 | 0 | 普通随机词条 registry |
| `etc/randomoption/randomoptionskill.lst` | 20 | 0 | 20 | skill random option 缺文件风险，沿用 RandomOption 主线边界 |
| `etc/superman.lst` | 20 | 20 | 0 | superman 配置入口 |
| `etc/towerlist.lst` | 1 | 1 | 0 | tower 配置入口 |
| `etc/vendingmachine.lst` | 3 | 3 | 0 | vending machine 配置入口 |
| `event/bluemarble/bluemarblemap.lst` | 5 | 5 | 0 | bluemarble map registry |
| `event/bluemarble/bluemarbletile.lst` | 13 | 13 | 0 | bluemarble tile registry |
| `event/eventcharacter/eventcharacter.lst` | 1 | 1 | 0 | event character registry |
| `etc/globaltutorialinfo/characterlist.lst` | 0 | 0 | 0 | 空表 |

## 资料线索命中口径

资料线索只用于列出优先检查路径，不作为正式结论来源。主目标只读确认：

- 成长武器、签到、活动任务、活动公告、活动 notice、回归奖励、创世纪/阶段奖励、Seria Blessing 等 `.evt` 文件存在。
- 成长支援、契约/黑钻、全局参数、限制/重置、清算翻牌等 `.etc` 文件存在。
- `etc/globaltutorialinfo.etc` 未命中，主目标是 `etc/globaltutorialinfo/` 子目录家族。

## 辅助对照提示

| 项 | 主目标 | 辅助对照 | 差异提示 |
| --- | ---: | ---: | --- |
| PVF 文件总数 | 402963 | 1052773 | 辅助体量更大 |
| ETC/Event 关注文件 | 1334 | 1879 | 辅助同族更多 |
| 可读关注文件 | 489 | 902 | 辅助可读表更多 |
| `etc/` 顶层文件 | 896 | 1351 | 辅助配置家族更大 |
| `event/` 顶层文件 | 92 | 109 | 辅助活动文件略多 |
| `event_config/` 顶层文件 | 0 | 0 | 两者均未观察到 |
| registry 条目 | 114 | 419 | 辅助 registry 规模更大 |
| registry 缺失条目 | 20 | 0 | 辅助缺失风险更少 |

辅助对照只提示其他版本 ETC/Event 家族更完整，不能覆盖主目标缺失和规模事实。

## 静态与动态边界

静态只读可以确认：

- 文件、目录、扩展名和 registry 是否存在。
- 标签、路径 token、日期 token、URL token、DB-like token 是否出现。
- registry 条目是否能解析到文件。

静态只读不能确认：

- 活动是否真的开启。
- 服务端活动 ID、活动参数、时间窗口、DB 表或触发器是否生效。
- 奖励、邮件、礼包、掉落、翻牌是否发放。
- UI 是否显示、按钮是否可点、URL 是否可用。
- 客户端资源是否完整。
- 概率、任务计数器、每日重置、疲劳消耗、等级条件或职业条件是否实机一致。

