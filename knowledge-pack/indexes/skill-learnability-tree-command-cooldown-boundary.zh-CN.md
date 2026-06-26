# Skill Learnability / Skill Tree / Command / Cooldown 边界索引

状态：默认可用

用途：作为新主线的第一版高覆盖入口，回答“技能脚本存在之后，角色如何学会、如何显示、如何满足输入/冷却/等级条件”的静态只读边界。本文不重开 Skill / State / NUT Runtime Boundary 主线。

## 当前主目标确认

| 桶 | 主目标只读结论 | 边界 |
| --- | --- | --- |
| skill registry | `skill/` 下观察到 14 个 `.lst` 注册入口；`skill/skilllist.lst` 路由到各职业 registry；`skill/autoskill.lst` 路由到 AutoSkill 文件。 | 技能数字必须带职业 registry 解释；不允许靠数字外形猜。 |
| 数字碰撞 | `254` 在 swordman、atmage、priest、creator mage 等 registry 中指向不同 `.skl`。 | 任何跨职业 254 都不能互证。 |
| `.skl` 学习字段 | `[required level]`、`[skill class]`、`[maximum level]`、`[growtype maximum level]`、`[skill fitness growtype]` 是高覆盖字段。 | 这些字段说明技能文件的静态学习形状，不证明技能树可见、默认学会或服务端放行。 |
| 主动技能样本 | 主动技能可同时带 `[command]`、`[command key explain]`、`[consume MP]`、`[casting time]`、`[cool time]`、`[dungeon]` / `[pvp]` 分段。 | 当前主目标已有一个 `[cool time]` 实机采用样本；仍不证明所有技能释放成功、PVP 修正或失败释放回滚。 |
| 被动技能样本 | 被动技能可只有学习、类型、等级和 growtype 适配字段，不带命令/MP/冷却。 | 被动存在不等于默认已学，也不等于 appendage 或 NUT 已生效。 |
| SP/TP 技能树 | `clientonly/skilltree/*_sp.co` 与 `*_tp.co` 按职业分开；`[skill info]` 中观察到 `[index]`、`[icon pos]`、部分 `[next skill]`。 | SP/TP 是显示和前置链线索，不能替代 `.skl` 或服务端校验。 |
| PVP 技能树 | `etc/pvpskilltree/*.etc` 按 `[level]`、`[job index]`、`[grow type index]`、`[skill]`、`[static basic skill]` 分层。 | PVP 表只说明 PVP 静态表形，不覆盖普通技能树。 |
| 默认技能 | `.chr` 中观察到基础 `[skill]`、growtype 段 `[skill]` 和 `[awakening skill]`。 | 默认授予字段和技能树可点字段是两条入口。 |
| common / cancel | `commonskilllist` 给公共技能列表和例外；`cancelskilllist` 给取消技能列表。 | 公共技能仍按适用职业 registry 解析；取消列表不是学习来源。 |
| 动态冷却调用 | 当前主目标未命中 `startSkillCoolTime`。 | 不把旧 Runtime 账本中的动态冷却 API 样本迁移成当前主目标事实。 |

## 字段命中矩阵

搜索范围为主目标 `skill/` 下脚本文件；计数用于判断字段覆盖形态，不等于语义强度。

| 字段 / token | 命中数 | 结论 |
| --- | ---: | --- |
| `[required level]` | 1959 / 1999 | 高覆盖学习字段。 |
| `[required level range]` | 1535 / 1999 | 常见学习相邻字段，但精确规则待专项验证。 |
| `[purchase cost]` | 1418 / 1999 | 常见学习购买消耗字段。 |
| `[skill class]` | 1970 / 1999 | 高覆盖分类字段。 |
| `[maximum level]` | 1972 / 1999 | 高覆盖等级上限字段。 |
| `[growtype maximum level]` | 1972 / 1999 | 高覆盖 growtype 上限字段。 |
| `[skill fitness growtype]` | 1971 / 1999 | 高覆盖 growtype 适配字段。 |
| `[command]` | 799 / 1999 | 部分主动/特殊技能输入字段。 |
| `[command key explain]` | 685 / 1999 | 部分技能 UI 指令说明。 |
| `[executable states]` | 223 / 1999 | 少量技能可释放状态线索。 |
| `[consume MP]` | 761 / 1999 | 部分技能静态 MP 消耗。 |
| `[cool time]` | 711 / 1999 | 部分技能静态冷却。 |
| `[casting time]` | 337 / 1999 | 部分技能静态施放时间。 |
| `[start cool time]` | 281 / 1999 | 少量技能起始冷却字段。 |
| `[auto cooltime apply]` | 118 / 1999 | 少量技能自动冷却应用线索。 |
| `[cast time]` | 0 / 1999 | 主目标未观察到该标签；不要替代 `[casting time]`。 |
| `[required skill]` | 0 / 1999 | 主目标未观察到该标签；技能前置以技能树 `[next skill]` 等入口复核。 |

## 代表模式桶

| 模式桶 | 已观察形态 | 后续使用方式 |
| --- | --- | --- |
| 主动技能基础桶 | 有学习字段、类型、等级、growtype 适配、命令、消耗、冷却和 dungeon/pvp 分段。 | 适合查“为什么界面显示/冷却/命令看起来这样”。 |
| 被动技能学习桶 | 有学习字段和 growtype 适配，但可无命令、MP、冷却。 | 适合查“文件存在但是否默认获得”。 |
| 技能树显示桶 | SP/TP 文件按职业和转职列 `[index]`，可有 `[next skill]`。 | 适合查“界面可见、前置链、SP/TP 分组”。 |
| 默认授予桶 | `.chr` 的基础、growtype、awakening 技能字段。 | 适合查“建号/转职/觉醒是否有 PVF 可见默认技能”。 |
| AutoSkill 桶 | AutoSkill 文件按 `[job]`、`[growtype]` 和 `[AutoSkill]` 大表分段。 | 先当自动授予线索，不强解全部列。 |
| PVP 桶 | PVP skilltree 以等级、职业序号、growtype 和技能/等级列组织。 | 只用于 PVP 静态入口，不覆盖普通 dungeon。 |
| 冷却边界桶 | `.skl` 静态冷却字段存在；当前未命中 NUT `startSkillCoolTime`。 | 一个当前主目标样本已证明 `[cool time]` 可影响实机冷却；装备修正、失败释放、服务端一致性和其他技能仍要实测。 |

## 第二桶入口矩阵

已新增 `indexes/skill-tree-default-pvp-entry-boundary.zh-CN.md`，专门记录 SP、TP、PVP、`.chr` 默认技能、AutoSkill、common/cancel 的分层边界与代表技能并列矩阵。使用本主线时，先读本索引，再读第二桶矩阵，避免把“技能树显示”“默认学会”“PVP 表存在”“AutoSkill 表线索”混成同一件事。

## 第三桶学习点数矩阵

已新增 `indexes/skill-learnability-cost-sp-tp-ui-boundary.zh-CN.md`，专门记录普通 `[purchase cost]`、TP/EX `[special purchase cost]`、`.skl [pre required skill]`、技能树 `[next skill]`、装备 `[skill levelup]` 和装备冷却效果的分层边界。使用本主线时，不要把“学习扣点”“TP 扣点”“技能树前置线”“装备加技能等级”“装备冷却重置”混成同一件事。

## 封存验收

已新增 `indexes/skill-learnability-tree-command-cooldown-completion-audit.zh-CN.md`，作为本主线封存验收入口。使用本主线时，先按该审计确认问题是否已覆盖；只有遇到明确缺口或新字段父块时，才补最小主目标只读样本。

## 辅助对照差异提示

辅助对照只做差异提示：其 `skill/` 注册表更多，观察到 `atpriestskill.lst`、`atswordmanskill.lst` 等主目标未列出的 registry；`skill/` 下 `[required level]` 命中规模也更大。`startSkillCoolTime` 在辅助对照中同样未命中。

这些差异不提升为主目标事实。

## 当前风险

- `[purchase cost]`、`[required level range]`、`[skill class]` 的 UI 和服务端最终规则仍未实机验证。
- `[executable states]` 只是一层静态线索；脚本、当前状态、冷却、输入、快捷栏、装备和服务端都可能继续影响释放。
- `[cool time]` 已有一个当前主目标实机样本；`[start cool time]`、`[auto cooltime apply]`、装备 `[skill data up]` 的 `[cooltime]` 是不同层，不能混写或外推。
- SP/TP/PVP/默认技能/AutoSkill 是并行入口；一个入口缺失不能证明所有入口都缺失。

## 后续建议

本主线已进入默认可用的静态只读封存状态。后续只在明确缺口、新字段父块、具体技能复核或实机测试需求下推进，不做逐技能穷举。
