# PVP Mission 只读审计任务卡

状态：默认可用

用途：作为 `pvp_mission/mission.lst -> .msn` 的短入口。本文只记录主目标 PVF 静态只读观察，不证明实机匹配、胜负计数、段位变化、奖励发放、UI 显示或服务端放行。

## 快速结论

- PVP Mission 的正式入口是 `pvp_mission/mission.lst`，不是 `n_quest/quest.lst`。
- 主目标注册 108 条，唯一注册路径 108 个，对应 `.msn` 全部存在，无缺失、无重复、无读取失败。
- `pvp_mission/` 下另有 18 个未注册 `.msn`；它们只能作为风险桶，不能默认写成可达任务。
- 注册 `.msn` 出现 15 类 `[condition]`，覆盖参赛、胜场、击杀、连胜、复仇、剩余 HP、频道移动、晋级、练习模式连击等 PVP 任务条件。
- `[reward item]` 出现在 87 条注册任务里；展开到嵌套职业块后共有 157 个物品奖励引用，全部闭合到既有 item registry。物品字段细节继续引用 Equipment / Stackable 已封存入口。
- `[reward skill]` 4 条、`[reward sp]` 3 条、`[stealing skill]` 5 条，但主目标样本只能证明标签存在；不能据此证明具体技能、SP 或偷学技能实机发放成功。

## 默认处理

1. 问 PVP Mission 注册链、`.msn` 字段、条件类型、未注册风险时，先读本任务卡。
2. 需要字段解释时，读 `dictionaries/pvp-mission-fields.zh-CN.md`。
3. 需要完整矩阵、计数、辅助差异和风险闭环时，读 `indexes/pvp-mission-msn-boundary.zh-CN.md`。
4. 如问题落到普通 Quest，回到 `n_quest/quest.lst` 主线；不要把两条 registry 混用。

## 不能直接下结论

- 文件里写了 `[join]`、`[winning count]`、`[kill count]` 等条件，不等于实机计数器一定增长。
- 文件里写了 `[reward item]`、`[reward skill]`、`[reward sp]`，不等于实机奖励发放成功。
- `prev mission` / `next mission` 静态闭合，不等于 UI 会展示链式任务。
- 未注册 `.msn` 文件存在，不等于任务系统会路由它。
- 辅助对照 PVF 只能提示版本差异，不能覆盖主目标结论。

## 下一步测试建议

最小实机测试应只选注册任务：

1. 选一条 `[join]` 或 `[hereafter join]`，确认 PVP 场次计数是否增长。
2. 选一条 `[winning count]`，确认胜场计数是否增长并触发完成。
3. 选一条有 `[reward item]` 的低风险任务，确认完成后背包物品变化。
4. 选一条 `[move_channel]` / `[move_channel_total]`，确认频道移动是否能触发。
5. 对未注册 `.msn` 只做存在性记录，除非先找到显式调用入口。
