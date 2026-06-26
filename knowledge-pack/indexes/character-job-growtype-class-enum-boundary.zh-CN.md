# Character / Job / GrowType / Class Enum Boundary

状态：已完成静态只读封存

用途：记录主目标 PVF 中角色注册、职业 token、growtype、职业技能 registry、SP/TP/PVP 技能树、AutoSkill、装备/消耗品职业限制和脚本层 job/growtype 读取入口的静态边界。本文不重开 Skill / State / NUT Runtime、Skill Learnability、Equipment / Stackable 或 Quest 主线，不证明实机转职、学习、释放、装备、任务、UI、PVP、客户端资源或服务端放行。

## 方法边界

- 先使用既有职业 token、usable job、growtype、技能树、NUT job/growtype 调用等内容做定向线索；线索只决定检查方向，不直接进入 Workbench 结论。
- 主结论只按主目标 PVF 只读观察写入。
- 辅助 PVF 只记录差异提示，不覆盖主目标事实。
- 数字 ID 必须回到父块和正确 registry；不能按数字外形猜全局含义。

## 主目标角色与技能入口矩阵

| ID | `character/character.lst` | `.chr [job]` | `skill/skilllist.lst` | `.chr [growtype name]` 首层列表 |
| ---: | --- | --- | --- | --- |
| 0 | `Swordman/Swordman.chr` | `[swordman]` | `SwordmanSkill.lst` | 鬼剑士、剑魂、鬼泣、狂战士、阿修罗、征服者 |
| 1 | `Fighter/Fighter.chr` | `[fighter]` | `FighterSkill.lst` | 格斗家、气功师、散打、街霸、柔道家、格斗家 |
| 2 | `Gunner/Gunner.chr` | `[gunner]` | `GunnerSkill.lst` | 神枪手、漫游枪手、枪炮师、机械师、弹药专家、待确认占位 |
| 3 | `Mage/Mage.chr` | `[mage]` | `MageSkill.lst` | 魔法师、元素师、召唤师、战斗法师、魔道学者、魔法师 |
| 4 | `Priest/Priest.chr` | `[priest]` | `PriestSkill.lst` | 圣职者、圣骑士、蓝拳圣使、驱魔师、复仇者、待确认占位 |
| 5 | `Gunner/ATGunner.chr` | `[at gunner]` | `ATGunnerSkill.lst` | 神枪手、漫游枪手、枪炮师、机械师、弹药专家、神枪手 |
| 6 | `Thief/Thief.chr` | `[thief]` | `ThiefSkill.lst` | 暗夜使者、刺客、死灵术士、忍者、影武者、暗夜使者 |
| 7 | `Fighter/ATFighter.chr` | `[at fighter]` | `ATFighterSkill.lst` | 格斗家、气功师、散打、街霸、柔道家、格斗家 |
| 8 | `Mage/ATMage.chr` | `[at mage]` | `ATMageSkill.lst` | 魔法师、元素爆破师、冰结师、战斗法师、魔道学者、魔法师 |
| 9 | `Swordman/DemonicSwordman.chr` | `[demonic swordman]` | `DemonicSwordman.lst` | 黑暗武士、剑魂、鬼泣、狂战士、阿修罗、征服者 |
| 10 | `Mage/CreatorMage.chr` | `[creator mage]` | `CreatorMage.lst` | 创造者、元素师、召唤师、战斗法师、魔道学者、魔法师 |

结论：主目标角色 ID 与职业技能 registry 顺序一致，但这个一致性只对主目标静态入口成立。后续解析任何技能 ID 时，仍必须先确定职业 registry。

## 入口覆盖矩阵

| 小桶 | 主目标只读观察 | 结论 |
| --- | ---: | --- |
| `character/character.lst` | 11 entries | 角色注册主入口。 |
| `character/**/*.chr` | 11 files | 当前观察到的 `.chr` 均与 `character.lst` 注册项对应。 |
| `skill/skilllist.lst` | 11 entries | 职业技能 registry 入口，与角色顺序一致。 |
| `skill/autoskill.lst` | 9 entries | 只覆盖 `0-8`，缺少 `DemonicSwordman` / `CreatorMage` autoskill 入口。 |
| `clientonly/skilltree/` | 21 files | SP/TP 技能树文件族；`Creator` 只有 `creator_sp.co`，未观察到 `creator_tp.co`。 |
| `etc/pvpskilltree/` | 9 files | PVP 技能树文件族；未观察到 demonic swordman、creator mage、atpriest、atswordman PVP 文件。 |
| `sqr/` `sq_getJob` | 16 files 命中 | 脚本文本存在 job 读取调用。 |
| `sqr/` `sq_getGrowType` | 12 files 命中 | 脚本文本存在 growtype 读取调用。 |

## 字段形态边界

| 场景 | 字段形态 | 主目标样本结论 | 风险 |
| --- | --- | --- | --- |
| 角色注册 | `character/character.lst` 数字 ID -> `.chr` | ID `8` 指向 `Mage/ATMage.chr`。 | 不证明角色可创建。 |
| 职业 token | `.chr [job]` | `ATMage.chr` 写 `[at mage]`，不是从目录名硬猜。 | token 拼写空格很重要。 |
| growtype 名称 | `.chr [growtype name]` | 每个 `.chr` 有该角色内部名称列表。 | 不等于全局枚举。 |
| growtype 分块 | `.chr [growtype N]` | 样本中存在 `growtype 1` 至 `growtype 6` 分块。 | 不证明转职开放或 UI 正常。 |
| 默认技能 | `.chr [skill]` | 块内数字按当前职业技能 registry 解析。 | 不证明创建后实际拥有。 |
| SP/TP 技能树 | `[character job]` + `[index]` | `atmage_sp.co` 的 `[index] 7` 要按 `ATMageSkill.lst` 解析。 | 不证明技能可学。 |
| PVP 技能树 | `[job index]` + `[grow type index]` | `atmage.etc` 中 `[job index] 8` 与主目标角色/技能入口的 ATMage 顺序一致。 | 不证明 PVP 最终规则。 |
| AutoSkill | `[job]` + `[growtype]` | `ATMageAutoSkill.skl` 写 `job = at mage` 和多个 growtype 块。 | 不证明自动加点或创建默认技能实机生效。 |
| 装备/消耗品限制 | `[usable job]` | `equipment` 和 `stackable` 大量命中，可为 `[all]` 或具体职业 token。 | 不证明可穿、可用或服务端放行。 |
| 道具 growtype | `[item growtype]` | 少量 stackable 样本存在该字段。 | 不证明技能加成实机成功。 |

## 跨 registry 数字 ID 样本

| ID | 上下文 registry | 主目标解析 | 结论 |
| ---: | --- | --- | --- |
| 7 | `skill/ATMageSkill.lst` | `ATMage/IceRoad.skl` | 技能 ID 必须带职业上下文。 |
| 222 | `skill/ATMageSkill.lst` | `ATMage/BlueDragonWillEx.skl` | 同一数字在不同职业下可不同。 |
| 222 | `skill/PriestSkill.lst` | `priest/priestnewskill/ReleaseBuffs.skl` | 不能用裸 ID 解释技能。 |
| 174 | `skill/SwordmanSkill.lst` | `Swordman/BasicAttackUp.skl` | 可与其它职业同名但路径不同。 |
| 174 | `skill/ATMageSkill.lst` | `ATMage/BasicAttackUp.skl` | 同名不等于同一文件或同一运行行为。 |
| 254 | `skill/SwordmanSkill.lst` | `swordman/swordman_comminterrupt.skl` | comminterrupt 类样本之一。 |
| 254 | `skill/ATMageSkill.lst` | `ATMage/atmage_comminterrupt.skl` | 同数字按职业变路径。 |
| 254 | `skill/PriestSkill.lst` | `Priest/priest_comminterrupt.skl` | 同数字按职业变路径。 |
| 254 | `skill/CreatorMage.lst` | `CreatorMage/CreatorWind.skl` | 同数字不保证同类技能。 |

## 辅助对照差异提示

| 项 | 辅助对照观察 | 处理方式 |
| --- | --- | --- |
| `character/character.lst` | 仍为 11 entries，但 ID `9` / `10` 为 `ATPriest` / `ATSwordman`。 | 只提示版本差异；不覆盖主目标 `DemonicSwordman` / `CreatorMage`。 |
| `character/**/*.chr` | 13 files，包含 `DemonicSwordman`、`CreatorMage`、`ATPriest`、`ATSwordman`。 | 文件存在不等于角色注册；仍以父 registry 为准。 |
| `skill/skilllist.lst` | ID `9` / `10` 为 `ATPriestSkill.lst` / `ATSwordmanSkill.lst`。 | 提示职业入口可因版本变化；不作为主目标事实。 |
| `clientonly/skilltree/` | 25 files，含 `atpriest_sp/tp` 和 `atswordman_sp/tp`。 | 可作为未来差异复核方向。 |
| `etc/pvpskilltree/` | 9 files，与主目标数量一致。 | 不说明缺失职业在 PVP 实机不可用，只记录静态入口缺口。 |
| 通用 registry 工具列表 | 可能不展示 `ATPriestSkill.lst` / `ATSwordmanSkill.lst` 为默认主 registry。 | 以实际父入口文件为准，不只看工具标签清单。 |

## 可复用规则

- 角色 ID 先走 `character/character.lst`。
- 职业技能 ID 先确定职业，再走对应 `skill/*Skill.lst` 或同级职业技能 `.lst`。
- `at` 前缀按独立角色/分支 token 处理；`atgunner`、`atmage`、`atfighter` 不解释为觉醒、TP 或 Ex 阶段。
- 技能树 `[index]` 先看同块 `[character job]`，再按职业 registry 解析。
- PVP `[job index]` 先回到角色/技能入口顺序，再解释同块 `[grow type index]`。
- `[usable job]` 只记录职业 token 限制，不证明实机可用。
- NUT 中的 job/growtype 调用只证明脚本文本存在相关读取点，不证明运行分支触发。
- 辅助 PVF 的新增职业入口只能作差异提示；主目标结论必须回主目标只读验证。

## 未证明事项

- 不证明新建角色、转职、觉醒、技能学习、自动加点、SP/TP 扣点、命令释放或冷却实机正确。
- 不证明装备/消耗品/称号/时装/宝珠等职业限制在客户端或服务端实际生效。
- 不证明任务职业限制、PVP 技能表、UI 技能树、客户端资源、NUT 分支或服务端枚举一致。
- 不证明辅助对照中存在的 `ATPriest` / `ATSwordman` 可迁移到主目标。
