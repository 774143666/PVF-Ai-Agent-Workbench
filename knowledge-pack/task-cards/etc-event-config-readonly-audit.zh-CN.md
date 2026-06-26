# ETC / Event Config 只读审计任务卡

状态：默认可用

用途：作为 `etc/`、`event/`、活动配置、成长支援、签到、公告窗口、契约/黑钻、清算/掉落支持表和特殊配置家族的短入口。本文只记录主目标 PVF 静态只读观察，不证明活动开启、奖励发放、任务计数、UI 正常、客户端资源完整或服务端放行。

## 快速结论

- 主目标观察到 ETC/Event 关注文件 1334 个，可读关注文件 489 个，读取失败 0。
- 主目标 `etc/` 顶层文件 896 个，`event/` 顶层文件 92 个，`ui/event/` 文件 345 个。
- 主目标未观察到 `event_config/` 顶层目录。
- 资料线索提示的 54 个优先路径中，主目标命中 53 个；唯一未命中的是 `etc/globaltutorialinfo.etc`，主目标实际是 `etc/globaltutorialinfo/` 子目录家族。
- 主目标关注范围内 registry 文件 13 个，条目 114 个，存在 94 个，缺失 20 个；缺失集中在 `etc/randomoption/randomoptionskill.lst`，与 RandomOption 主线一致。
- 代表活动入口包括 `event/ingameeventlist.evt`、`event/eventlistwindow.evt`、`event/eventnotice.evt`、`event/attendance.evt`、`event/heromissionevent.evt`、`event/growthweapon.evt`、`event/returnuserreward.evt`、`event/tw_creatednf.evt`。
- 代表 ETC 支撑入口包括 `etc/serverparameter.etc`、`etc/growthpowerrewardbuff.etc`、`etc/growthpowernpcdialog.etc`、`etc/premiumlist_new.etc`、`etc/chn_server_limititemusageinfo.etc`、`etc/itemdropinfo_clearreward.etc`。

## 默认处理

1. 问 ETC、Event、活动配置、成长支援、签到、公告、活动任务、黑钻、契约、每日重置、活动奖励或特殊配置时，先读本任务卡。
2. 需要术语和字段口径时，读 `dictionaries/etc-event-config-fields.zh-CN.md`。
3. 需要目录、registry、代表文件、辅助差异和边界矩阵时，读 `indexes/etc-event-config-activity-family-boundary.zh-CN.md`。
4. 需要文件类型说明时，读 `encyclopedia/pvf-file-types/etc-event-config.zh-CN.md`。

## 不能直接下结论

- 不能把 `.evt` 文件存在写成活动已经开启。
- 不能把 `[idx]`、`[event id]`、`[state]` 或日期字段写成服务端活动参数已生效。
- 不能把 `[reward]`、`[item]`、`[package reward]`、`[growth equipment reward list]` 写成奖励一定发放。
- 不能把 `db table` 或 DB-like token 写成数据库表存在、计数器生效或服务端放行。
- 不能把 `ui/event/` 文件存在写成 UI 正常、按钮可点或客户端资源完整。
- 不能把资料线索、教程解释、工具字段或社区注释直接写成 Workbench 结论。
- 辅助对照只做差异提示，不能覆盖主目标事实。

## 下一步测试建议

本主线当前不做成果落地和实机测试。后续如果要验证活动配置，最小顺序是：

1. 选一个单独活动入口，例如公告、签到或成长武器。
2. 确认活动列表、活动本体 `.evt`、奖励 item registry、UI 资源和服务端开关分别属于不同验证层。
3. 创建 PVF lab session 和备份。
4. 保存到显式输出 PVF，不覆盖源 PVF。
5. 重新打开输出 PVF 读回。
6. 实机检查活动是否出现、计数是否变化、奖励是否发放、UI 是否正常。
