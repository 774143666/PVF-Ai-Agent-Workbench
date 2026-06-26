# Character / Job / GrowType / Class Enum 只读审计卡

状态：默认可用

用途：作为角色注册、职业 token、growtype、职业技能 registry、技能树职业入口、PVP job/growtype 数字入口、装备/消耗品职业限制的第一层路由。本文只记录主目标 PVF 静态只读观察和辅助对照差异提示，不授权写 PVF，不证明转职、学习、装备、任务、UI 或服务端规则实际生效。

## 快速结论

- 主目标 `character/character.lst` 记录 11 个角色入口，ID `0-10` 与主目标 `skill/skilllist.lst` 的 11 个职业技能 registry 入口顺序一致。
- 主目标 11 个 `.chr` 均在 `character/character.lst` 注册；每个 `.chr` 的 `[job]` 给出该角色的职业 token，例如 `[swordman]`、`[at mage]`、`[demonic swordman]`、`[creator mage]`。
- `.chr` 内的 `[growtype name]`、`[growtype N]`、`[awakening name]`、`[awakening N]` 属于该角色文件内部结构，不能脱离角色文件解释成全局转职枚举。
- 主目标 `skill/autoskill.lst` 只有 `0-8` 九个入口，缺少 `DemonicSwordman` 和 `CreatorMage` 的 autoskill 入口。
- 主目标 `clientonly/skilltree/` 有 21 个 SP/TP 文件；`etc/pvpskilltree/` 有 9 个 PVP 技能树文件。SP/TP、PVP、AutoSkill 是并行静态入口，不能互相补全。
- 技能数字 ID 必须按职业技能 registry 解析。例：ID `254` 在 `swordman`、`atmage`、`priest` registry 下都是 comminterrupt 类技能，但在 `creatormage` registry 下解析为 `CreatorWind.skl`。
- 装备和消耗品大量使用 `[usable job]`，stackable 也可出现 `[item growtype]`；这只说明职业 token 被其它文件族引用，不证明装备可穿、物品可用或服务端放行。

## 首选阅读顺序

1. `dictionaries/character-job-growtype-class-enum-fields.zh-CN.md`
2. `indexes/character-job-growtype-class-enum-boundary.zh-CN.md`
3. `indexes/skill-learnability-tree-command-cooldown-boundary.zh-CN.md`
4. `indexes/skill-tree-default-pvp-entry-boundary.zh-CN.md`
5. `dictionaries/equipment-fields.zh-CN.md`
6. `dictionaries/stackable-fields.zh-CN.md`

## 何时使用

| 问题 | 动作 |
| --- | --- |
| 某个角色 ID 是什么 | 先查 `character/character.lst`，再读对应 `.chr` 的 `[job]` 与 `[growtype name]`。 |
| 某个技能 ID 属于哪个技能 | 先确定父职业 registry，例如 `skill/atmageskill.lst`，再解析 ID。不要用裸数字猜。 |
| 技能树里的 `[index]` 是什么 | 先看同一个 `[character job]` 的职业 token，再按该职业技能 registry 解析。 |
| PVP 技能树里的 `[job index]` / `[grow type index]` 是什么 | 先把 `[job index]` 回到 `character/character.lst` / `skill/skilllist.lst` 同序入口，再在该文件块内解释 growtype 数字。 |
| 装备或消耗品里的 `[usable job]` 是什么 | 只当职业 token 限制字段；是否实际可穿、可用、可交易、可发放必须另测。 |
| 辅助 PVF 有 ATPriest / ATSwordman | 只写差异提示；主目标未注册为角色事实前，不提升为主目标结论。 |

## 禁止外推

- 不把 `.chr` 里的 growtype 名称写成全局运行时枚举表。
- 不把 skill registry 的数字 ID 写成全局技能 ID。
- 不把 `clientonly/skilltree` 的 UI 排布写成技能可学、可用或显示正常。
- 不把 `etc/pvpskilltree` 写成 PVP 最终规则。
- 不把 NUT 文本里的 `sq_getJob`、`sq_getGrowType` 或 `ENUM_CHARACTERJOB_*` 写成实机行为已验证。
- 不把辅助对照 PVF 的 ATPriest / ATSwordman 入口写成主目标事实。
