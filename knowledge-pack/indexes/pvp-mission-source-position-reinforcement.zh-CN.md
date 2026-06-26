# PVP Mission 资料线索补强

状态：默认可用。

用途：补强已封存的 PVP Mission / mission.lst / MSN 主线，让 Workbench 在遇到 PVP 任务、PK 任务、PVP UI、PVP 地图起点、PVP 音乐音效、普通 Quest 交叉问题时，先按正确家族分流。

## 核心结论

PVP Mission 的正式配置入口是：

`pvp_mission/mission.lst -> .msn`

其他 PVP 相关资料只能作为相邻线索，不能直接提升为 `.msn` 字段语义：

- PVP UI 资源线索说明客户端可能有 PVP 任务界面或 PK 场界面资源，但不能证明某条 `.msn` 会在 UI 显示。
- PVP 地图起点线索说明 map 家族里有 PVP 出生点或练习模式入口，但不能解释 `.msn` 条件计数。
- PVP BGM 和系统音效线索说明 audio/client 资源里存在 PVP 声音方向，但不能解释任务完成逻辑。
- 普通 Quest 和活动 `[mission]` 块不能和 `pvp_mission/mission.lst` 混用。

## 资料线索如何使用

资料线索用于定向搜索和实验设计，不直接作为 Workbench 事实：

- 看到“PK 任务界面”一类资源名时，先路由到 Client Assets，再回到 PVP Mission 核对 `.msn` 是否注册。
- 看到 `[pvp start area]`、`[pvp start area by party slot]`、`[pvp practice start area]` 时，先路由到 Dungeon / Map，不要把它们当成 PVP Mission 条件。
- 看到 PVP BGM、PVP 系统音效、倒计时音效等线索时，先路由到 Audio / SoundPacks，再视情况回到 PVP 场景验证。
- 看到普通活动里的 `[mission]` 块时，先路由到 ETC / Event Config，不要合并进 `.msn` 任务矩阵。
- 看到数字 ID 时，必须按当前父块和 registry 解析；不能把 PVP Mission ID、Quest ID、item ID、map ID 混用。

## 已封存静态事实

当前 PVP Mission 主线已经确认以下静态范围：

- `pvp_mission/mission.lst` 注册 108 条，唯一注册路径 108 个，注册文件全部存在。
- `pvp_mission/` 下共有 126 个 `.msn`，其中 18 个未注册 `.msn` 只能作为风险档。
- 注册 `.msn` 无读取失败、无注册路径重复、无注册文件缺失。
- 注册样本覆盖 15 类 `[condition]`、4 类 `[grade]`、27 个 kind 值、16 类字段标签。
- `[reward item]` 出现在 87 条注册任务中；展开后 157 个物品奖励引用全部闭合到 item registry。
- `[prev mission]` 正数引用全部闭合；`[next mission]` 有 2 个正数引用指向存在但未注册的 `.msn`，只能标记断链风险。

这些数字只表示静态只读盘点结果，不表示实机任务可见、可接、可完成或奖励发放成功。

## 推荐排查顺序

1. 先确认问题是否真的落在 `pvp_mission/mission.lst -> .msn`。
2. 若是 `.msn`，按 `[grade]`、`[kind]`、`[condition]`、`[reward item]`、`[prev mission]`、`[next mission]` 分块读取。
3. 奖励物品必须继续按 item registry 闭合，不能靠数字外形猜。
4. 未注册 `.msn` 只能进入风险档，除非另有显式调用入口。
5. 若问题实际是 PVP 地图出生点，转 Dungeon / Map。
6. 若问题实际是 PVP 界面贴图、BGM 或系统声音，转 Client Assets 或 Audio。
7. 若问题实际是普通任务或活动任务，转 Quest 或 ETC / Event Config。

## 禁止推断

- 不能把 PVP UI 资源存在写成 `.msn` 任务可见。
- 不能把 PVP 地图起点写成 PVP Mission 条件。
- 不能把 PVP 音乐音效写成任务完成逻辑。
- 不能把普通 Quest ID 或活动 mission 块写成 PVP Mission ID。
- 不能把未注册 `.msn` 写成可达任务。
- 不能把静态 reward item 闭合写成实机发奖成功。

## 关联入口

- `indexes/pvp-mission-msn-boundary.zh-CN.md`
- `dictionaries/pvp-mission-fields.zh-CN.md`
- `indexes/quest-drop-reward-ticket-boundary.zh-CN.md`
- `indexes/etc-event-config-activity-family-boundary.zh-CN.md`
- `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
- `indexes/audio-soundpacks-music-boundary.zh-CN.md`

