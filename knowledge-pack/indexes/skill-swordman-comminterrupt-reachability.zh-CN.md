# Swordman comminterrupt / skill 254 可达性只读账本

状态：默认可用

用途：记录当前主目标中 `skill 254 / swordman_comminterrupt / 體術逆改` 是否能从 PVF 可见入口到达。本文只处理静态可见入口：skill registry、角色默认技能表、客户端技能树、PVP 技能树、取消技能表、公共技能表和任务文件；不证明服务端、角色存档或外部脚本实际授予结果。

## 结论摘要

```text
254 在 skill/swordmanskill.lst 中存在
254 的 .skl 是被动技能，等级上限 1
passive_skill_swordman.nut 只有在 skill_index == 254 且 skill_level > 0 时追加 comminterrupt appendage
但当前只读未在 swordman SP/TP 技能树、PVP 技能树、角色默认技能表、取消技能表、公共技能表或任务文件中找到 254 可达入口
```

## 当前主目标已确认

| 层级 | 只读结论 | 边界 |
| --- | --- | --- |
| skill registry | `skill/swordmanskill.lst` 中 `254 -> swordman/swordman_comminterrupt.skl` | 证明技能文件存在。 |
| 技能文件 | `swordman_comminterrupt.skl` 是 `[passive]`，`[required level] 1`，`[maximum level] 1` | 证明技能可被描述为 1 级被动，不证明玩家能学到。 |
| 挂接入口 | `passive_skill_swordman.nut` 需要 `skill_index == 254` 且 `skill_level > 0` 才追加 `ap_swordman_comminterrupt.nut` | 若运行时拿不到 254 等级，appendage 不会因这段逻辑挂上。 |
| 角色默认技能 | `character/swordman/swordman.chr` 精确搜索未命中 `254` | 当前 `.chr` 默认/转职技能表不证明 254 默认授予。 |
| SP 技能树 | `clientonly/skilltree/swordman_sp.co` 精确搜索未命中 `254` | 当前客户端技能树不证明 254 可见或可点。 |
| TP 技能树 | `clientonly/skilltree/swordman_tp.co` 精确搜索未命中 `254` | 当前 TP 树不证明 254 可见或可点。 |
| PVP 技能树 | `etc/pvpskilltree/swordman.etc` 精确搜索未命中 `254` | 当前 PVP 技能树不证明 254 被授予。 |
| 取消技能表 | `clientonly/cancelskilllist.co` 的 swordman/berserker 段未包含 `254` | 取消技能表不是学习来源；这里只证明它也不给 254 可见线索。 |
| 公共技能表 | `clientonly/commonskilllist.co` 未包含 `254` | 公共技能表不证明 254 是公共技能。 |
| 任务文件 | `n_quest/` 下任务文件对 `254`、`swordman_comminterrupt`、`體術逆改` 均未命中 | 只说明当前 PVF 任务文本/脚本搜索未发现授予线索。 |

## Berserker 技能树观察

`clientonly/skilltree/swordman_sp.co` 的 `berserker` 分支可见链中包含：

- `76 -> 24`
- `24 -> 23 / 79 / 101`
- `23 -> 103`
- `103 -> 81`

这说明当前技能树可见链覆盖 `Frenzy(76)`、`BloodyRave(79)`、`BloodSword(103)`、`OutRageBreak(81)`，但没有把 `254 / 體術逆改` 放进该可见树。

## 数字碰撞排除

`clientonly/skilltree/creator_sp.co` 中也有 `[index] 254`，但它属于 `[creator mage]` 技能树。按 `skill/creatormage.lst` 解析时：

```text
254 -> CreatorMage/CreatorWind.skl
```

所以 Creator 技能树里的 `254` 不是鬼剑士 `swordman_comminterrupt`，不能当作当前链的可达证据。

## 可复用判断

| 问题 | 当前判断 |
| --- | --- |
| 当前主目标是否有 `skill 254` 文件 | 有。 |
| 当前主目标是否有 `skill 254` appendage 挂接逻辑 | 有，但需要运行时 `skill_level > 0`。 |
| 当前主目标是否证明角色默认学会 254 | 不能证明。 |
| 当前主目标是否证明技能树可点 254 | 不能证明。 |
| 当前主目标是否证明任务会授予 254 | 不能证明。 |
| 当前主目标是否能排除所有外部授予 | 不能。角色存档、服务端逻辑、外部脚本或运行时注入不在本静态账本证明范围内。 |

## 风险边界

- `clientonly/skilltree/*.co` 更偏客户端技能树/展示入口，不能单独代表服务端最终学习规则。
- `n_quest/` 未命中只能说明当前任务文件没有发现直接线索，不能证明服务端无其他授予方式。
- 同一个数字在不同职业 registry 中可以代表不同技能；任何 `254` 都必须带父职业 registry 解读。
- 若实机里 `體術逆改` 不可见或等级为 0，当前 NUT 挂接链不会证明 `ap_swordman_comminterrupt.nut` 已运行。

## 下一步验收

1. 运行层：用鬼剑士/狂战角色检查技能界面是否存在 `體術逆改`，等级是否为 1。
2. 运行层：在学习状态为 0 和 1 两种情况下分别测试 `ap_swordman_comminterrupt.nut` 的柔化表现。
3. 只读层：若要继续静态追查，需要寻找非 PVF 可见的服务端技能授予资料；在没有主目标运行证据前，不把它写成 Workbench 事实。
