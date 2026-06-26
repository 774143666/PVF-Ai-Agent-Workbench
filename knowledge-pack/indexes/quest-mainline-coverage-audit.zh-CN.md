# Quest 主线覆盖审计

状态：默认可用

用途：作为 Quest 主线是否完成静态只读覆盖的验收入口。本文不新增 PVF 修改权限，不替代具体字段字典和矩阵。

## 结论

Quest 主线的注册任务静态只读基础覆盖已补齐：

- `n_quest/quest.lst -> .qst` 注册链已覆盖。
- 任务奖励、任务怪物奖励物、副本门票、独立掉落和清算翻牌边界已封存。
- `[type]` / `[sub type]` / `[int data]` 条件矩阵已覆盖主目标注册任务。
- 前置任务、NPC、等级/职业限制、特殊任务桶、未注册 `.qst` 风险和静态/动态边界已补齐。

默认口径：Quest 主线现在可以作为静态配置路由入口使用；但它仍不能证明实机可接、可完成、可发奖、可扣门票、任务物品掉落真实生效、PVP 规则正确或客户端资源完整。

## 首选入口

| 问题 | 先读 |
| --- | --- |
| 任务类型、子类型、条件列形 | `indexes/quest-type-condition-int-data-matrix.zh-CN.md` |
| 任务字段和标签解释 | `dictionaries/quest-type-condition-fields.zh-CN.md` |
| 任务链、前置、NPC、限制、未注册风险 | `indexes/quest-chain-requirement-boundary.zh-CN.md` |
| 固定奖励、可选奖励、任务怪物奖励物、门票、独立掉落、清算翻牌 | `indexes/quest-drop-reward-ticket-boundary.zh-CN.md`、`dictionaries/quest-drop-reward-ticket-fields.zh-CN.md` |
| 日常执行短入口 | `task-cards/quest-drop-reward-ticket-readonly-audit.zh-CN.md` |

## 覆盖表

| 模块 | 当前状态 | 已有入口 | 仍需注意 |
| --- | --- | --- | --- |
| 任务 registry | 已覆盖 | `n_quest/quest.lst -> .qst` | 未注册 `.qst` 只作风险桶。 |
| `.qst` 基础块 | 已覆盖 | `[grade]`、`[difficulty]`、`[npc index]`、`[complete npc index]`、`[job]`、`[grow type]`、`[level]` | 静态字段不证明服务端规则。 |
| 任务类型枚举 | 已覆盖 | 17 个注册 `[type]` | 1 个空 type 是异常样本。 |
| 条件数据列义 | 已覆盖 | 46 个 type/subtype 组合 | `[int data]` 必须按父 type/subtype 解释。 |
| 通关条件 | 已覆盖 | `[condition under clear]` subtype 0/1/4/5/6/7/8/9/10/11/13/15/16/复合 `-1,6` | 计数器实机口径需运行验证。 |
| 任务链前置 | 已覆盖边界 | `[pre required quest]` | 少量前置 ID 未闭合到注册表，必须保留断链风险。 |
| 接取/完成 NPC | 已覆盖 | `[npc index]`、`[complete npc index]`、`[show npc on clear]`、`[meet npc]` | `-1` 不当作缺失 NPC。 |
| 等级/职业限制 | 已覆盖边界 | `[level]`、`[job]`、`[grow type]`、`[target character]` | 不证明可接取实机成功。 |
| 固定/可选奖励 | 已封存 | `[reward type]`、`[reward int data]`、`[reward selection int data]` | 不证明 UI 选择或发放成功。 |
| 任务怪物奖励物 | 已封存 | `[monster reward item]` | 不证明掉率和服务端放行。 |
| 副本门票 | 已封存 | `dungeon/*.dgn [required item]` | 不证明扣除成功。 |
| 独立掉落/清算翻牌 | 已封存 | 独立掉落和清算翻牌入口 | 不证明实机概率和 UI。 |
| 每日/重复/成就/称号/训练/活动任务 | 已覆盖边界 | `[grade]`、`[event]`、称号簿条件 type | 刷新、活动开关、称号 UI 需运行验证。 |
| 未注册任务文件 | 已审计为风险 | 未注册 `n_quest/**/*.qst` | 出现 `[mobile]`、`[powerwar point]`、`[powerwar win]`、`[pvp match]`，但不进入默认路由。 |
| PVP mission | 相邻主线已封存 | `pvp_mission/mission.lst` | 完整 PVP Mission 见 `indexes/pvp-mission-msn-boundary.zh-CN.md`；本主线只覆盖 `n_quest` 注册任务里的 PVP 相关字段。 |
| 服务端/客户端联动 | 静态不可证明 | 无静态充分入口 | 可接、可完成、计数、发奖、UI、资源完整均需实机或服务端验证。 |

## 验收数字

| 项目 | 主目标注册任务 |
| --- | ---: |
| 注册任务条目 | 2157 |
| 注册 `.qst` 读失败 | 0 |
| 注册 `[type]` | 17 |
| 注册 type/subtype 组合 | 46 |
| 注册字段标签 | 59 |
| 未注册 `.qst` | 1822 |

辅助对照只作为差异提示：它的注册任务更多，也出现主目标注册链路没有的类型；这些不能覆盖主目标结论。

## 禁止外推

- 不凭 `[int data]` 裸数字猜字段含义。
- 不把未注册 `.qst` 当可接任务。
- 不把辅助对照独有 type 写成主目标事实。
- 不把静态条件写成实机计数成功。
- 不把奖励、掉落、门票、PVP、UI 或客户端资源写成静态已证明。
