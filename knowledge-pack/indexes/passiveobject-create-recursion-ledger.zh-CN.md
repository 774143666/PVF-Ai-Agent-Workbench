# PassiveObject 创建递归账本

状态：需验证

本文记录主目标 PVF 只读观察到的 `[CREATE PASSIVEOBJECT]` 递归链。它用于指导 Agent 解析创建 ID、避免把上下文不同的 `[INDEX]` 混用，并识别静态回环。静态回环不等于运行时无限循环。

治理提示：本账本接近约 100KB，后续只写 create source-target、registry route 和 recursion stop；同族长链条或批量差异写入分片索引。落账前先读 `passiveobject-ledger-governance.zh-CN.md`。

## 主目标计数

| 字段 / 块 | 主目标只读观察 |
| --- | ---: |
| `[CREATE PASSIVEOBJECT]` | 1653 |
| `[CREATE PASSIVEOBJECT CIRCLE]` | 当前 `passiveobject/` SearchScript 范围 0 |
| `[RANDOM SELECT]` | 219 |
| `[RANDOM]` | 215 |
| `[SUMMON MONSTER]` | 262 |
| `[DIM]` | 431 |

## 解析硬规则

| 位置 | 正确 registry |
| --- | --- |
| `[CREATE PASSIVEOBJECT] [INDEX]` | `passiveobject/passiveobject.lst` |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 先按 passiveobject 检查对象理解，再回 `passiveobject/passiveobject.lst` 复核 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | `monster/monster.lst` |
| `[SUMMON MONSTER] [INDEX]` | `monster/monster.lst` |
| `[SUMMON APC] [INDEX]` | `aicharacter/aicharacter.lst` |
| `[WHICH] [AI CHARACTER] ... [IS INDEX]` | `aicharacter/aicharacter.lst` |

## 样本 A：双对象回环

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `enginecover_1.obj -> Action/enginecover_1.act` | 对象基本动作指向 `enginecover_1.act`。 |
| 2 | `enginecover_1.act [CREATE PASSIVEOBJECT] INDEX 8777` | ID 8777 已回 passiveobject registry 解析。 |
| 3 | `8777 -> enginecover_2.obj -> Action/enginecover_2.act` | 创建目标继续拥有自己的基本动作。 |
| 4 | `enginecover_2.act [CREATE PASSIVEOBJECT] INDEX 10185` | ID 10185 已回 passiveobject registry 解析。 |
| 5 | `10185 -> enginecover_1.obj` | 静态链回到已见对象，形成 `enginecover_1 <-> enginecover_2` 回环。 |

边界：两个 `.act` 中都有触发、行为和销毁结构；静态回环不证明运行时无限生成。

## 样本 B：Crochan 回环与分支

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `enginecover_crochan.obj -> Action/enginecover_crochan1.act` | 源对象基本动作指向第一阶段动作。 |
| 2 | `enginecover_crochan1.act [CREATE PASSIVEOBJECT] INDEX 8767` | ID 8767 已回 passiveobject registry 解析。 |
| 3 | `8767 -> enginecover_crochan2.obj -> Action/enginecover_crochan2.act` | 第二阶段对象闭合到第二阶段动作。 |
| 4 | `enginecover_crochan2.act [CREATE PASSIVEOBJECT] INDEX 8766` | ID 8766 已回 passiveobject registry 解析。 |
| 5 | `8766 -> enginecover_crochan.obj` | 静态链回到源对象，形成回环。 |
| 6 | `enginecover_crochan2.act [CREATE PASSIVEOBJECT] INDEX 8561` | ID 8561 已回 passiveobject registry 解析到 `ActionObject/Monster/GuardianGoblin/SpearJailDust.obj`。 |

边界：同一行为块可创建多个 passiveobject；其中一个分支可回到源对象，另一个分支可进入 `ActionObject/Monster/` 前缀的 passiveobject 文件。前缀含 `Monster` 不等于走 monster registry。

## 样本 C：Fan-out 创建

| 源动作 | 创建 ID | registry 解析 |
| --- | ---: | --- |
| `guide_post_manager.act` | 8782 | `ActionObject/Act8/Map/pirateonthetrain/guide_post.obj` |
| `guide_post_manager.act` | 8784 | `ActionObject/Act8/Map/pirateonthetrain/sea_lamp.obj` |
| `guide_post_manager.act` | 8780 | `ActionObject/Act8/Map/pirateonthetrain/signal_lamp.obj` |

这些目标 `.obj` 样本均可继续闭合到 `[basic motion]` 指向的 ANI。它们是多目标 fan-out，不是回环样本。

## 样本 D：随机行为选择与创建参数

| 源动作 | 随机结构 | 创建结构 | 只读结论 |
| --- | --- | --- | --- |
| `seabird_manager.act` | `[DO BEHAVIOR] [ME] [RANDOM SELECT] 0 1 2 3` | 四个行为块均 `[CREATE PASSIVEOBJECT] INDEX 8773`，但 `[PARTICLE FILENAME]` 不同。 | 这里的 `[RANDOM SELECT]` 是行为编号候选，不是 passiveobject ID。 |
| `seabird_manager_back.act` | 多个触发块使用 `[RANDOM SELECT] 0 1 2 3 4` | 多个行为块创建 `INDEX 8772`，另有空 `[BEHAVIOR]` 块。 | 行为编号可多次随机选择；空行为块不等于空 `[INDEX]`。 |
| `seabird_manager_front.act` | 多个触发块使用 `[RANDOM SELECT] 0 1 2 3 4` | 多个行为块创建 `INDEX 8771`，另有空 `[BEHAVIOR]` 块。 | 同上。 |
| `seabird.act` | `[RANDOM SELECT]` 选择行为编号 | 行为块执行 `[SET FRAME]`，不创建 passiveobject。 | `[RANDOM SELECT]` 不必然与对象创建有关。 |

创建块内的 `[RANDOM]` 样本为两个数值，出现在 `[POS]` 后，可作为创建位置随机参数观察；不要解释为随机 ID。

| ID | registry 解析结果 |
| ---: | --- |
| 8773 | `ActionObject/Act8/Map/pirateonthetrain/seabird_normal.obj` |
| 8772 | `ActionObject/Act8/Map/pirateonthetrain/seabird_back.obj` |
| 8771 | `ActionObject/Act8/Map/pirateonthetrain/seabird_front.obj` |

## 样本 D2：多层创建链与行为随机

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `pirate_ship.obj -> action/pirate_ship.act` | 父对象有 `[basic action]`；对象销毁条件为时间限制。 |
| 2 | `pirate_ship.act [DO BEHAVIOR] [ME] [RANDOM SELECT] 0 4 4 4 4 4 4` | 此处 `[RANDOM SELECT]` 是行为编号候选，不是 passiveobject ID。 |
| 3 | `pirate_ship.act [CREATE PASSIVEOBJECT] INDEX 8770` | 8770 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/pirateship/fire.obj`。 |
| 4 | `fire.obj -> action/fire.act [CREATE PASSIVEOBJECT] INDEX 8755` | 8755 回 passiveobject registry 命中 `ActionObject/Act8/Map/pirateship/pirate_bomb_drop.obj`；创建块内观察到 `[WARNING MARK]` 四数值列。 |
| 5 | `pirate_bomb_drop.obj -> Action/pirate_bomb_drop.act [CREATE PASSIVEOBJECT] INDEX 8778` | 8778 回 passiveobject registry 命中 `ActionObject/Act8/Map/pirateship/pirate_ship_bomb.obj`；随后进入已登记爆炸对象链。 |

边界：该链只证明静态创建关系和 registry 路由；`[SET SPEED]`、`[ZPOS]`、`[WARNING MARK]`、`[PARTICLE]` 的运行时表现仍需实机或运行链验证。

## 样本 D3：actionobject/monster 前缀创建

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `actionobject/monster/3headlessknight.obj -> Action/3headlessknight.act` | 父对象有 `[basic action]`；路径含 `monster` 但仍在 `passiveobject/actionobject/` 前缀下。 |
| 2 | `3headlessknight.act [BASE ANI] -> empty_00.ani` | 父 BASE ANI 可反编译，样本未观察到盒字段。 |
| 3 | `3headlessknight.act [CREATE PASSIVEOBJECT] INDEX 48163` | 48163 回 `passiveobject/passiveobject.lst` 命中 `Monster/HeadlessKnight/Horse_item.obj`。 |
| 4 | 创建块 `[POS] -100000` 后接 `[RANDOM] -140 140 0` | 创建位置列形可为固定位置值加随机参数，不应把 `[POS]` 固定成三数值列。 |
| 5 | `Horse_item.obj -> Ani/Horse.ani / AttackInfo/Horse_item.atk` | 下游对象直连 ANI 与 `.atk`；`Horse.ani` 有 `[ATTACK BOX]`。 |

边界：registry raw path 含 `Monster/` 不等于改走 `monster/monster.lst`；这仍是 passiveobject registry 的创建目标。

## 样本 D4：SPC fan-out 与下游跳转

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `SPC/4season/hp_create.obj -> Action/empty.act` | 管理对象本身不挂 `.atk`。 |
| 2 | `empty.act [DO BEHAVIOR] [ME] [RANDOM SELECT] 0 1 0 1 1` | 此处随机值是行为编号候选，不是 passiveobject ID。 |
| 3 | `empty.act [CREATE PASSIVEOBJECT] INDEX 11008` | 11008 回 passiveobject registry 命中 `ActionObject/SPC/4season/fairy_ok.obj`。 |
| 4 | `empty.act [CREATE PASSIVEOBJECT] INDEX 11009` | 11009 回 passiveobject registry 命中 `ActionObject/SPC/4season/fairy_bad.obj`。 |
| 5 | `empty.act [WHICH] [AI CHARACTER] [IS INDEX] 11401` | 这是检查上下文，不按创建 passiveobject ID 写入。 |
| 6 | `_cannontrap/AttackMonster.act` / `AttackCharacter.act [CREATE PASSIVEOBJECT] INDEX 8044` | 8044 回 passiveobject registry 命中 `ActionObject/SPC/_Cannonball/Body.obj`。 |
| 7 | `_cannonball/Body.act [CREATE PASSIVEOBJECT] INDEX 8846` | 8846 回 passiveobject registry 命中 `ActionObject/Common/SmallBoom3.obj`；触发来源可为 `ZPOS <= 0` 或 `[ON ATTACKSUCCESS]`。 |

边界：SPC 链可从 `ActionObject/SPC/` 跳转到 `ActionObject/Common/`；这仍按 passiveobject registry 逐级闭合，不按目录名猜。

## 样本 D5：SPC Jackie 球体链与检查上下文

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `SPC/Jackie/Frenken_Ball.obj -> Action/Ball_Throw.act` | 父对象挂 `[attack info] Ball_Bomb.atk`，并有 `[hp max]`、`[hp destroy]`、`[is hp by difficulty]`。 |
| 2 | `Ball_Throw.act` 文件内创建 `INDEX 16071`，并在 `ZPOS <= 10` 后创建 `INDEX 16070` | 16071 回 passiveobject registry 命中 `ActionObject/SPC/Jackie/Frenken_Ball_Count_Bomb.obj`；16070 命中 `ActionObject/SPC/Jackie/Frenken_Ball_Count.obj`。 |
| 3 | `Ball_Count.act` 第 3 帧创建 `INDEX 16071` | 倒数对象可再次进入爆发对象。 |
| 4 | `Ball_Bomb.act [WHICH] [MONSTER] [IS INDEX] 61606-61609` | 这些检查目标走 `monster/monster.lst`，不是 passiveobject 创建目标。 |
| 5 | `Ball_Bomb.act` 在对应检查后创建 `INDEX 9950` | 9950 回 passiveobject registry 命中 `ActionObject/Monster/cartelcommand/robot.obj`；raw path 含 `Monster` 不改变创建 registry。该下游对象只有 `Action/robot.act`，不挂 `.atk`；BASE `robot.ani` 与 SUB `die_eff2.ani` 未观察到盒字段。 |
| 6 | `Ball_Bomb.act [WHICH] [MONSTER] [IS INDEX] 61136` | 61136 走 `monster/monster.lst`。 |
| 7 | `Ball_Bomb.act` 在对应检查后创建 `INDEX 8580` | 8580 回 passiveobject registry 命中 `ActionObject/Common/BigBoom2.obj`。 |

边界：`[WHICH] [MONSTER] [IS INDEX]` 是检查上下文，走 monster registry；`[CREATE PASSIVEOBJECT] [INDEX]` 是创建上下文，走 passiveobject registry。不要把两类数字混用。

## 样本 D6：SPC sjar 硬币、召唤与导弹多层链

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `sjar_coin_bom.obj -> sjar_bom_ok.act / sjar_bom_bad.act` | coin 本体通过 `[etc action]` 分出 ok/bad 行为，本体不挂 `.atk`。 |
| 2 | `sjar_bom_ok.act [CREATE PASSIVEOBJECT] INDEX 9202` | 9202 回 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZDrop.obj`。 |
| 3 | `sjar_bom_bad.act [CREATE PASSIVEOBJECT] INDEX 8376` | 8376 回 passiveobject registry 命中 `ActionObject/Trap/MinePressure2.obj`；FRAME1 的 `[RANDOM SELECT] 0 1` 后可选 3 个或 5 个创建块，每块为空 particle，`[POS]` 下为 `[RANDOM] 20 300` 与 `[RANDOM] 0 70 -120`，并使用 basepos、object zpos 和自身方向。 |
| 4 | `MinePressure2 -> MineActive2.act [CREATE PASSIVEOBJECT] INDEX 8375` | 8375 回 passiveobject registry 命中 `ActionObject/Common/MineExplosion2.obj`；创建块为空 particle、level `60`、pos `0 0 0`，创建后同一行为自毁。 |
| 5 | `ZDrop.act [CREATE PASSIVEOBJECT] INDEX 9203` | 9203 回 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZGT.obj`。 |
| 6 | `ZGT.act [CREATE PASSIVEOBJECT] INDEX 9204` | 9204 回 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZMissile.obj`。 |
| 7 | `Missile.act [CREATE PASSIVEOBJECT] INDEX 9206` | 9206 回 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZMissileExp.obj`；`ZMissile.obj` 的 basic action 实际引用 `Action/Missile.act`。 |
| 8 | `ZMissileExp.obj -> JeffMissileEXP.act / JeffMissileEXP.atk` | 对象文件名和引用名不同；必须按 `.obj` 内引用解析，不能按对象名猜 action/atk 文件名。 |
| 9 | `sjar_summon_ok.act [SUMMON MONSTER] [INDEX] [RANDOM SELECT] 56429 / 56008 / 56709 / 56710 / 50071` | 候选均回 `monster/monster.lst` 命中。 |
| 10 | `sjar_summon_bad.act [SUMMON MONSTER] [INDEX] [RANDOM SELECT] 1 / 5002 / 11 / 61703` | 候选均回 `monster/monster.lst` 命中。 |

边界：该样本同时出现创建 passiveobject 与召唤 monster；registry 由父块决定。9202/8376/8375/9203/9204/9206 走 passiveobject registry，召唤候选走 monster registry。

## 样本 D7：TimeLord chain 单步创建与 monster 检查

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/Monster/timegate/TimeLord/Chain.obj -> Action/Chain_start.act` | 16075 回 passiveobject registry 命中；父对象有 `[basic action]`、`[hp max]`、`[hp destroy]`。 |
| 2 | `Chain_start.act [BASE ANI] -> chain_sphere.ani` | BASE ANI 可反编译，样本帧观察到 `[ATTACK BOX]` 与 `[DAMAGE BOX]`。 |
| 3 | `Chain_start.act [CREATE PASSIVEOBJECT] INDEX 16080` | 16080 回 passiveobject registry 命中 `ActionObject/Monster/timegate/TimeLord/Chain2.obj`。 |
| 4 | 创建触发前置条件 | 触发块内观察到 `[WHICH] [ME]`、`[CHECKUP] [ZPOS] [>=] 400`，随后执行两个 `[DO BEHAVIOR] [ME]`。 |
| 5 | `Chain2.obj -> Action/Chain_action.act / Chain_attack_loop.act / Chain_attack_damage.act / Chain_destroy.act` | 下游对象有 basic action、三个 etc action、`Chain.atk`、`hp max` 与 `hp destroy`。 |
| 6 | `Chain_attack_loop.act [DEFAULT ATTACKINFO] ../AttackInfo/Chain_stay.atk` | action 内也可指定默认 `.atk`；不要只在 `.obj [attack info]` 查攻击信息。 |
| 7 | `Chain_attack_loop.act [WHICH] [MONSTER] [IS INDEX] 64013` | 64013 走 `monster/monster.lst` 命中 Andres；同号不按 passiveobject 创建目标解释。 |

边界：`ActionObject/Monster/` 只是 passiveobject/actionobject 内部前缀；`[CREATE PASSIVEOBJECT] [INDEX] 16080` 走 passiveobject registry，`[WHICH] [MONSTER] [IS INDEX] 64013` 走 monster registry。`[ATTACKRECT] [RESET]`、`[CHECKED NO]`、`[DEFAULT ATTACKINFO]`、触发帧和销毁行为均为静态结构入口，不证明实机时序或命中。

## 样本 D7b：gashengrigun EZ8 创建 NenGuard

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/Monster/gashengrigun/ez8_1.obj` | 对象有 `[basic action] Action/EZ8_2.act` 与 `[etc action] Action/Boom2.act`，不挂 `.atk`。 |
| 2 | `EZ8_2.act` | BASE `CountDown.ani` 和 SUB `Stay3.ani` 有 `[DAMAGE BOX]`；Dust/Dust2/Dust3 SUB 未观察到盒字段。 |
| 3 | `Boom2.act [BASE ANI] -> Boom2.ani` | `Boom2.ani` 四帧均有 `[DAMAGE BOX]`。 |
| 4 | `Boom2.act [CREATE PASSIVEOBJECT] INDEX 8588` | 8588 回 `passiveobject/passiveobject.lst` 命中 `Monster/ZealotRebirth/NenGuard_1.obj`。 |
| 5 | `NenGuard_1.obj` | 下游对象有 `[basic motion] NenGuard.ani`、两个 `[etc motion]`、`AttackInfo/NenGuard.atk` 与 `[int data] 4000 12000 200`。 |
| 6 | `NenGuard.ani` / `NenGuard.atk` | basic motion 多帧有多条 `[DAMAGE BOX]`；`.atk` 有 `[active status] [blind] 0 0 0 0 0` 五数值列。 |

边界：`Action/Boom2.act` 在不同 owner 下解析到不同物理 action；gashengrigun 的 `Boom2.act` 不是 chiefmong 的 `Boom2.act`。8588 的 raw path 含 `Monster/`，但仍走 passiveobject registry。辅助对照同 ID 可解析到同 raw path，但 `NenGuard_1.obj [int data]` 与主目标不同，不能覆盖主目标数值。

## 样本 D7c：gashengrigun 前缀混合创建与召唤

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/Monster/gashengrigun/ez8.obj -> Action/EZ8.act / Action/Boom.act` | `EZ8.act` 的 CountDown/Stay2 有 `[DAMAGE BOX]`；`Boom.act` 的 `Boom.ani` 有 `[DAMAGE BOX]`。 |
| 2 | `Boom.act [CREATE PASSIVEOBJECT] INDEX 8794` | 8794 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/BigBoom4.obj`；下游 `_Bigboom4.ani` 有 `[ATTACK BOX]`。 |
| 3 | `gasbomb.obj -> GasBomb.act [CREATE PASSIVEOBJECT] INDEX 8591` | 8591 回 passiveobject registry 命中本前缀 `ActionObject/Monster/Gashengrigun/SleepingGas.obj`；源 `GasBomb.ani` 本身也有 `[ATTACK BOX]`。 |
| 4 | `summonrx78.obj -> Summon.act [CREATE PASSIVEOBJECT] INDEX 8561` | 8561 回 passiveobject registry 命中 `ActionObject/Monster/GuardianGoblin/SpearJailDust.obj`；该下游 BASE ANI 未观察到盒字段。 |
| 5 | `Attack*.act / Run1.act / Summon.act [SUMMON MONSTER] INDEX ...` | 61134、61137、60002、61136 均走 `monster/monster.lst`；不要按 passiveobject registry 解释。 |

边界：同一 actionobject/monster 前缀内可同时出现 passiveobject 创建和 monster 召唤；registry 由父块决定。辅助对照可解析同 raw path，但 registry 总量与主目标不同，不能据此替换主目标计数。

## 样本 D8：Blood_An 随机候选到攻击成功下游链

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/Monster/Blood_An/Action/darkfireshoot.act` | 源 action 的 BASE/SUB ANI 可读，样本未观察到盒字段。 |
| 2 | `darkfireshoot.act [CREATE PASSIVEOBJECT] [INDEX] [RANDOM SELECT] 8718 / 8719 / 8720` | 三个候选均回 `passiveobject/passiveobject.lst` 命中 `darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj`。 |
| 3 | 同一创建块 `[POS]` 后两个 `[RANDOM]` 块 | 这些 `[RANDOM]` 是位置参数，不是随机 ID 候选。 |
| 4 | `darkfire1/2/3.obj` | 三个对象结构同构：`[basic action]` 分别指向 `darkfire1/2/3.act`，共用 `AttackInfo/Damage.atk`，有 on-end animation 销毁块和 `[team] 100`。 |
| 5 | `darkfire1/2/3.act [ON ATTACKSUCCESS] [LAST ATTACKSUCCESS] [SAVE TARGET OBJECT] 0` | 攻击成功触发后保存目标对象，再对检查对象执行行为 1。 |
| 6 | `darkfire1/2/3.act [CREATE PASSIVEOBJECT] INDEX 8725` | 8725 回 passiveobject registry 命中 `ActionObject/Monster/Blood_An/darkfire4.obj`。 |
| 7 | `darkfire4.obj -> darkfire4.act / darkfire.atk` | 末层对象不再创建 passiveobject；action 用 `[RANDOM SELECT] 1..9` 选择行为编号，并通过 `[SET POS FORCE]` 与 `[TRIGGER] n [ON/OFF]` 切换位置/触发。 |

边界：`[INDEX]` 下的 `[RANDOM SELECT] 8718/8719/8720` 是 passiveobject ID 候选；`darkfire4.act` 中 `[CHECKUP OBJECT] [RANDOM SELECT] 1..9` 是行为编号候选。两者不能混用。`[SAVE TARGET OBJECT]`、`[SET POS FORCE]`、`[TRIGGER] n [ON/OFF]` 只证明 action 结构存在，不证明运行坐标、目标保存或命中时序。

## 样本 D9：Grim_seeker 随机候选与静态回返分支

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/Monster/Grim/Grim_seeker/Action/fire2.act` | 源 action 指向 BASE `Fire2.ani`，第 2 帧创建 passiveobject，第 5 / 15 帧检查 monster 61150。 |
| 2 | `fire2.act [CREATE PASSIVEOBJECT] [INDEX] [RANDOM SELECT] 8679 / 8680` | 两个候选均回 `passiveobject/passiveobject.lst` 命中 `FireReady.obj` / `FireReady2.obj`。 |
| 3 | `FireReady.obj` / `FireReady2.obj` | 两者同名、同层、同穿透力、同 on-end animation 销毁；8679 的 basic action 是 `Fire2.act`，8680 的 basic action 是 `Fire3.act`，两者共用 `FireBall.atk`。 |
| 4 | `ActionObject/Monster/Grim/Grim_seeker/Action/fire2_r.act` | 骑乘分支同样在第 2 帧创建 passiveobject，但本文件未观察到 61150 检查块。 |
| 5 | `fire2_r.act [CREATE PASSIVEOBJECT] [INDEX] [RANDOM SELECT] 9136 / 9137` | 两个候选均回 `passiveobject/passiveobject.lst` 命中 `FireReady_Riding.obj` / `FireReady_Riding1.obj`。 |
| 6 | `FireReady_Riding.obj` / `FireReady_Riding1.obj` | 9136 的 basic action 是 `Fire2_r.act`，9137 的 basic action 是 `Fire3.act`；两者使用 `FireBall_r.atk`。 |
| 7 | `Fire3.act` | 未观察到再次创建 passiveobject；第 5 / 15 帧同样检查 `[WHICH] [MONSTER] [IS INDEX] 61150` 并执行 HP restore 结构。 |
| 8 | `FireBall.atk` / `FireBall_r.atk` | 普通分支为 magic/fire/burn，骑乘分支为 physic/fire/burn；`.atk` 记录攻击信息和状态入口，不提供盒坐标。 |
| 9 | `Fire2.ani` | 24 帧均观察到 `[ATTACK BOX]` 六数值列，部分帧同帧多条攻击框。 |

边界：8679 与 9136 在静态引用上会回到各自的源创建 action，因此需要在递归工具里记录“已访问对象/action 后停止”，防止无限展开。静态回返不等于实机无限创建；创建触发、随机结果、销毁时序、HP restore 负值效果和 burn 状态均需实机或运行链路验证。

## 样本 D10：Agaress_Hell 随机候选到攻击成功下游链

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/SPC/_NewHell/Agaress_Hell/Action/darkfireshoot.act` | 源 action 的 BASE/SUB ANI 可读，样本未观察到盒字段。 |
| 2 | `darkfireshoot.act [CREATE PASSIVEOBJECT] [INDEX] [RANDOM SELECT] 16031 / 16052 / 16053` | 三个候选均回 `passiveobject/passiveobject.lst` 命中 `darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj`。 |
| 3 | 同一创建块 `[POS]` 后两个 `[RANDOM]` 块 | 这些 `[RANDOM]` 是位置参数，不是随机 ID 候选。 |
| 4 | `darkfire1/2/3.obj` | 三个对象结构同构：`[basic action]` 分别指向 `darkfire1/2/3.act`，共用 `AttackInfo/Damage.atk`，有 on-end animation 销毁块和 `[team] 100`。 |
| 5 | `darkfire1/2/3.act [ON ATTACKSUCCESS] [LAST ATTACKSUCCESS] [SAVE TARGET OBJECT] 0` | 攻击成功触发后保存目标对象，再对检查对象执行行为 1。 |
| 6 | `darkfire1/2/3.act [CREATE PASSIVEOBJECT] INDEX 16051` | 16051 回 passiveobject registry 命中 `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire4.obj`。 |
| 7 | `darkfire4.obj -> darkfire4.act / darkfire.atk` | 末层对象不再创建 passiveobject；action 用 `[RANDOM SELECT] 1..9` 选择行为编号，并通过 `[SET POS FORCE]` 与 `[TRIGGER] n [ON/OFF]` 切换位置/触发；还可在 `[LAST ATTACKSUCCESS]` 为 passive object 时执行销毁。 |

边界：Agaress_Hell 与 Blood_An 结构高度相似，但 ID、前缀和主目标对象 `[name]` 形态不同，不能互相继承结论。辅助对照同 ID 命中同名对象，但对象 `[name]` 为直接字符串；该差异只能作为辅助观察，不改写主目标字段形态。运行攻击成功、目标保存、位置强制、触发器开关和销毁时序仍需实机验证。

## 样本 D10b：SPC _firewitch/ador 销毁动作创建与召唤碰撞 ID

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/SPC/_firewitch/ador/body.obj` | 对象挂 `[basic action] Action/body.act`、`[attack info] AttackInfo/attack.atk`、`[last action] Action/Destroy.act`，并有 homing 和 on-end animation 销毁块。 |
| 2 | `body.act` | BASE `body.ani` 有攻击框；触发条件为 `[ON ATTACKSUCCESS]` 后对自身执行行为 0，行为 0 为 `[DESTROY]`。 |
| 3 | `Destroy.act [CREATE PASSIVEOBJECT] INDEX 40002` | 40002 回 `passiveobject/passiveobject.lst` 命中 `Common/FireExplosion.obj`；同号在 `monster/monster.lst` 也命中其他 `.mob`，但本上下文不按 monster 解释。 |
| 4 | `Common/FireExplosion.obj` | 下游对象直连 `[basic motion] Animation/FireExplosion.ani`，并挂 `AttackInfo/FireExplosion.atk`；`FireExplosion.ani` 空图帧有攻击框。 |
| 5 | `Destroy.act [WHICH] [ALL MONSTER TEAM] ... [IS INDEX] 601` | 601 在检查上下文中走 `monster/monster.lst`，命中 `Spirit/FireSpirit.mob`；同号在 passiveobject registry 也命中 mapobject，但本上下文不按 passiveobject 解释。 |
| 6 | `Destroy.act [SUMMON MONSTER] [INDEX] 601` | 601 在召唤块中继续走 `monster/monster.lst`；召唤列形为 level `60`、pos `0 0 0`、team `100`、`[NO EFFECT]`。 |

边界：本样本证明同一个 action 可同时创建 passiveobject 与召唤 monster，且 40002 / 601 这类数字可以在不同 registry 中同时命中不同对象。registry 必须由父块决定；FRAME0 触发、检查数量、召唤时序、FireExplosion 实际命中和 homing 轨迹均需实机验证。

## 样本 D10c：SPC _firewitch/meteo 销毁动作创建 Jeff 下游

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/SPC/_firewitch/meteo/body.obj` / `horobe1.obj` / `horobe2.obj` | 三个对象共用 `[basic action] Action/body.act` 与 `[last action] Action/Destroy.act`，但分别挂 `attack.atk`、`horobe1.atk`、`horobe2.atk`；对象销毁条件为 `[on end of animation]`。 |
| 2 | `ActionObject/SPC/_firewitch/meteo/body_cyclops.obj` | 对象单独挂 `[basic action] Action/body_Cyclops.act`、`[last action] Action/Destroy_Cyclops.act` 与 `attack2.atk`；同为 `[on end of animation]` 销毁。 |
| 3 | `body.act` / `body_Cyclops.act` | 两个 action 均在 FRAME0 执行 `[FLASH SCREEN]`，并在 `ZPOS <= 40` 检查后 `[SET FRAME] 1`；本层未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 |
| 4 | `Destroy.act [CREATE PASSIVEOBJECT] INDEX 8236` | 8236 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/Jeff_Omega_BigBoom.obj`；raw path 含 `Monster/` 不改变创建块的 passiveobject registry 路由。 |
| 5 | `Destroy_Cyclops.act [CREATE PASSIVEOBJECT] INDEX 10027` | 10027 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/BigBoom.obj`；该分支下游对象挂 `Big.atk`。 |
| 6 | `8236 / 10027 Jeff 下游` | 8236 下游对象未观察到对象级 `.atk`，其 `Jeff_Omega_BigBoom.act` BASE/SUB ANI 样本未观察到盒字段；10027 下游 `BigBoom.act` 的 BASE `Bigboom1_1.ani` 有攻击框，SUB `_1` 后缀组未观察到盒字段。 |

边界：本样本只证明 `_firewitch/meteo` 的销毁动作可静态创建两个 Jeff 下游 passiveobject，并闭合到对象、action、attackinfo 与 ANI 样本；不证明 meteor 落地时机、frame 跳转、粒子表现、爆炸命中、伤害结算或 sibling 分支是否在实机同时出现。辅助对照同路径、同创建 ID 目标和关键 ANI 盒字段同形，但 registry 总量/行号不同，只作为差异提示。

## 样本 D10d：SPC _cyclone opt action 回同桶 Short1

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `ActionObject/SPC/_Cyclone/{body,goldteida_effect,short1,short2}.obj` | 四个 owner 均挂 `Action/HurricaneOfJudgement.act`，该 action 只挂 BASE `HurricaneOfJudgement.ani`，有 `time + 10000 <= GET TIME` 销毁和 FRAME10 限次 `[SET FRAME] 6`，本 action 未观察到 CREATE 或 SUMMON。 |
| 2 | `ActionObject/SPC/_Cyclone/{short1_1,short2_1}.obj` | 两个 `_1` owner 只挂 `Action/HurricaneOfJudgement_opt.act`，未观察到对象级 `[attack info]` 或 homing。 |
| 3 | `HurricaneOfJudgement_opt.act [CREATE PASSIVEOBJECT] INDEX 48117` | FRAME0/1/2 均执行行为 0，行为 0 创建 48117；FRAME3 执行行为 1 `[DESTROY]`。 |
| 4 | `48117 -> Short1.obj` | 48117 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/_Cyclone/Short1.obj`；主目标 registry 行在 48117-48120 连续登记 `Short1/Short1_1/Short2/Short2_1`。 |
| 5 | `Short1.obj -> HurricaneOfJudgement.act -> HurricaneOfJudgement.ani` | 下游 `Short1.obj` 挂 `Short1.atk` 与 homing，BASE ANI 11 帧均有 `[ATTACK BOX]`；`HurricaneOfJudgement_3.ani` 本体为空图无盒。 |

边界：本样本证明 opt 空图 action 可创建同桶有攻击框的下游对象，不能把 opt 的空图 ANI 写成整条链无 hitbox。48097 / 48118 / 48119 / 48120 在当前主目标数字检索 中未观察到 passiveobject action 入边，只有 registry 或无关数字文本命中；当前只把 48117 作为已闭合创建 ID。辅助对照同 16 文件、48117 目标和关键 ANI 盒字段同形，差异为 name 文本样式与 registry 总量/行号。

## 样本 D10e：SPC mesteria 条件创建 common ShootingStarExp

| 步骤 | 链路 | 只读结论 |
| --- | --- | --- |
| 1 | `ActionObject/SPC/mesteria/HalloweenBuster.obj` | 11012 回 `passiveobject/passiveobject.lst` 命中该对象；对象挂 `Action/HalloweenBuster1.act` 与 `AttackInfo/HalloweenBuster.atk`，同号存在其他 registry 碰撞，必须按 passiveobject 上下文解释。 |
| 2 | `HalloweenBuster1.act` | BASE 为 `HalloweenBuster1.ani`，SUB 为 `HalloweenBuster2.ani` / `HalloweenBuster3.ani`；`ZPOS <= 5` 且 limit `1` 时执行行为 0。 |
| 3 | `行为 0 [CREATE PASSIVEOBJECT] INDEX 40005` | 创建块为空 `[PARTICLE FILENAME]`、level `70`、pos `0 0 0`，随后同一行为块 `[DESTROY]`。 |
| 4 | `40005 -> Common/ShootingStarExp.obj` | 40005 回 `passiveobject/passiveobject.lst` 命中 common 下游对象；同号在 equipment、monster、map registry 中也有碰撞，但 `[CREATE PASSIVEOBJECT] [INDEX]` 上下文不按这些 registry 解释。 |
| 5 | `Common/ShootingStarExp.obj` | 下游对象挂 `Animation/ShootingStarExp.ani` 与 `AttackInfo/ShootingStarExp.atk`，有 `[int data] 99 20 1200 1`；主目标下游 `.atk` 为 magic/fire/down 等 payload，未观察到 damage bonus 或 weapon damage apply。 |
| 6 | hitbox 分层 | 源 BASE `HalloweenBuster1.ani` 四帧均有攻击框，源 SUB `HalloweenBuster2/3.ani` 未观察到盒字段；下游 `ShootingStarExp.ani` 单帧空图有攻击框。 |

边界：本样本只证明 mesteria owner 可在静态 action 结构中按 ZPOS 条件创建 40005 并销毁自身，不证明 ZPOS 触发时机、创建/销毁先后、粒子显示、命中、伤害或击退。辅助对照同 20 文件、核心 action/ANI/40005 路由同形，但 name 文本样式、registry 总量/行号不同，且辅助 common `ShootingStarExp.atk` 额外有 damage bonus `3800` 与 weapon damage apply `1`，不能覆盖主目标结论。

## 样本 D11：FluoreCollider 高位 ID 未闭合与 23055 可闭合

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `character/mage/action/fluorecolliderstart.act` | 第 12 帧创建 `INDEX 90010005`；该 ID 在主目标 passiveobject registry 与全 registry 均未命中。 |
| 2 | `character/mage/action/fluorecolliderstay.act` | 第 1 帧延迟创建 `INDEX 90010006` 后销毁；monster 区域检查后延迟创建 `INDEX 90010007`；第 0 帧创建 `INDEX 90010009`。 |
| 3 | `90010006 / 90010007 / 90010009` | 三个 ID 在主目标 passiveobject registry 与全 registry 均未命中；不得猜测目标 `.obj`。 |
| 4 | `fluorecolliderstay.act` 的 90010007 创建块 | 创建参数可见 `[USE OBJECT ZPOS]` 与 `[FOLLOWING TARGET]`；只证明参数存在，不证明实机追踪或目标存在。 |
| 5 | `character/mage/action/fluorecolliderend.act` | 同一行为块三次创建 `INDEX 23055`，位置分别为 `0 0 0`、`30 0 40`、`-30 0 70`。 |
| 6 | `23055 -> Character/Mage/FluoreColliderNoneExplosion.obj` | 23055 回 `passiveobject/passiveobject.lst` 命中；对象直连 `[basic motion] ../../Common/Animation/NoneExplosion.ani`，并挂 `AttackInfo/FluoreColliderNoneExplosion.atk`。 |
| 7 | 辅助对照差异 | 辅助对照中 90010005 / 90010006 / 90010007 / 90010009 均可回 passiveobject registry 命中 FluoreCollider 对象；这只能说明目标集差异，不能改写主目标未命中结论。 |

边界：`[CREATE PASSIVEOBJECT] [INDEX]` 的正确 registry 仍是 passiveobject；主目标未命中的高位 ID 必须作为未闭合风险保留。辅助对照可提供路径线索，但后续真正改主目标前仍必须回主目标单独复核，不能把辅助独有 registry 当主目标存在。

## 样本 E：INDEX 下随机 passiveobject ID 候选

`[CREATE PASSIVEOBJECT]` 的 `[INDEX]` 后可直接出现 `[RANDOM SELECT] ... [/RANDOM SELECT]`。此时随机候选值按 passiveobject ID 解析，走 `passiveobject/passiveobject.lst`；不要与样本 D 的行为编号随机混用。

| 源动作 | `[INDEX]` 候选 | registry 解析结果 | 只读结论 |
| --- | --- | --- | --- |
| `blood_an/action/darkfireshoot.act` | 8718 / 8719 / 8720 | `ActionObject/Monster/Blood_An/darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj` | 候选均回 passiveobject registry 命中；同一创建块的 `[POS]` 下另有 `[RANDOM]` 位置参数。 |
| `grim_seeker/action/fire2.act` | 8679 / 8680 | `ActionObject/Monster/Grim/Grim_seeker/FireReady.obj` / `FireReady2.obj` | 候选均回 passiveobject registry 命中；8679 的 basic action 静态回到 `Fire2.act`，8680 走 `Fire3.act`；后续 `[WHICH] [MONSTER] [IS INDEX] 61150` 是检查对象上下文。 |
| `grim_seeker/action/fire2_r.act` | 9136 / 9137 | `ActionObject/Monster/Grim/Grim_seeker/FireReady_Riding.obj` / `FireReady_Riding1.obj` | 候选均回 passiveobject registry 命中；9136 的 basic action 静态回到 `Fire2_r.act`，9137 走 `Fire3.act`。 |
| `_newhell/agaress_hell/action/darkfireshoot.act` | 16031 / 16052 / 16053 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj` | 候选均回 passiveobject registry 命中；三个候选攻击成功后创建 16051 `darkfire4.obj`；同一创建块的 `[POS]` 下另有 `[RANDOM]` 位置参数。 |

防误判样本：`lizardman/action/summonstonebody.act` 中 `[CREATE PASSIVEOBJECT] [INDEX] 8568` 是直接 passiveobject ID，已回 registry 命中 `ActionObject/Common/GuardianGrenadeNoneBomb.obj`；同一行为块后面的 `[SUMMON MONSTER] [INDEX] [RANDOM SELECT] 61129 61130 61131 61132 61133` 属于召唤怪物候选，走 `monster/monster.lst`，不是 passiveobject 随机候选。8568 下游 `GrenadeNoneBomb.ani` 有攻击框，但源 `SummonStoneBody.ani` 未观察到盒字段。

## 空 INDEX 与内联列形检索

| 检索项 | 主目标只读观察 | 结论 |
| --- | ---: | --- |
| `[CREATE PASSIVEOBJECT]` | 1653 | 创建块基准计数。 |
| 创建块后 120 字符内出现 `[INDEX]` | 1653 | 当前 `passiveobject/` SearchScript 范围内，创建块均观察到 `[INDEX]` 标签。 |
| `[INDEX]` 后直接接 `[PARTICLE FILENAME]` / `[LEVEL]` / `[POS]` / `[/CREATE PASSIVEOBJECT]` | 0 | 当前搜索范围未观察到空 `[INDEX]` 形态。 |
| `[CREATE PASSIVEOBJECT]` 后直接接 `[PARTICLE FILENAME]` / `[LEVEL]` / `[POS]` / 数字行 | 0 | 当前搜索范围未观察到省略 `[INDEX]` 的内联创建列形。 |

边界：以上是主目标 `passiveobject/` SearchScript 范围的结构检索结论；不要扩写成主目标全 PVF 其他目录或二进制内容的绝对不存在。

## 样本 D10h：SPC _cypherobjectfriend 创建 8036 _CypherElec

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `actionobject/spc/_cypherobjectfriend/cypherobject.obj` / `cypherobject1.obj` | 两个 owner 均挂 `Action/start.act`、`AttackInfo/attack.atk` 和 7 个 etc action；`cypherobject1.obj` 额外有 parent dead / destroy action / only destroy 销毁条件。 |
| 2 | `start/wait/rise/fall/stay*.act` | `start.act` 随机切 custom 4-7；`wait.act` 多帧检查 character 距离 `<= 400` 后切 attack，并在 `time + 4000 <= GET TIME` 后切 fall；rise/fall/stay 系列只做 action 切换，未观察到 create/summon。 |
| 3 | `attack.act` | FRAME0 设置 outline 与随机 X/Y 速度；FRAME6 执行行为 1，创建 passiveobject 8036，随后清 outline、速度归零并切 custom 1。 |
| 4 | `CREATE PASSIVEOBJECT 8036` | 创建块为空 particle、level `45`、pos `-5 0 86`；8036 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 `passiveobject/passiveobject.lst`。 |
| 5 | `8036` | registry 命中 `ActionObject/SPC/_CypherElec/CypherElec.obj`，名称为“麦瑟的魔雷闪电”；辅助对照也解析到同一路径，但 registry 总量/行号不同。 |
| 6 | `_CypherElec/CypherElec.obj -> body.act` | 下游对象挂 `Action/body.act` 与 `AttackInfo/attack.atk`，有 `[homing follow] [ENEMY]`、velocity `250 0`、check gap `100000`、max rotation `360`、on-end-animation 销毁；`body.act` 在攻击成功或 `time + 4000 <= GET TIME` 后销毁，未观察到继续 create/summon。 |

边界：父对象的距离检查、随机速度、frame 触发、8036 生成次数、追踪轨迹和销毁先后都只能由实机验证；静态只读只能证明字段、块闭合、registry 路由和下游文件链路。

## 样本 D10i：SPC _cypherobject2 上游 8035 与下游 8036

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `bluemarble/cypher/action/comein.act` / `cartel/cypher/cypher/action/comein.act` | 两个主目标上游动作同形：FRAME0-4 各三次执行行为 0，行为 0 创建 passiveobject 8035，empty particle，level `45`，pos 为 random X `-400 400` 与 random Y/Z `-150 150 0`。 |
| 2 | `8035 -> ActionObject/SPC/_CypherObject2/CypherObject.obj` | 8035 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 `passiveobject/passiveobject.lst`；对象挂 `Action/start.act`、`AttackInfo/attack.atk` 与 7 个 etc action。 |
| 3 | `_cypherobject2 wait/stay monster-check` | `wait.act` 与 `stay1/2/3.act` 检查 61328：该数字位于 `[WHICH] [MONSTER] [IS INDEX]` 上下文，走 `monster/monster.lst`，不是 passiveobject 创建 ID。 |
| 4 | `_cypherobject2/attack.act` | FRAME0 设置 outline 与随机 X/Y 速度；FRAME6 创建 passiveobject 8036，创建块为空 particle、level `45`、pos `-5 0 86`，随后清 outline、速度归零并切 custom 1。 |
| 5 | `8036 -> _CypherElec/CypherElec.obj` | 8036 走 `passiveobject/passiveobject.lst` 命中 `_CypherElec`；下游有 `[homing follow] [ENEMY]`、body.ani 攻击框、攻击成功或 `time + 4000 <= GET TIME` 销毁，未观察到继续 create/summon。 |
| 6 | 相邻未挂接文件 | `attack1/2/realattack1/realattack2/move` action/ANI 与 `slash.atk` 可读，但未在 `cypherobject.obj` 的 owner 列表或同前缀脚本文本中观察到挂接；只能作为边界样本。 |

边界：上游两个 monster action 只作为 8035 passiveobject 创建来源记录，不转入 Monster 主线；61328 的 HP/距离检查、FRAME 触发次数、8035/8036 生成次数、随机位置和下游追踪命中均需实机验证。辅助对照同核心链路可读，但额外观察到 `stormofmetastasis/ice_wall/cypher2/action/comein.act` 创建 8035，只能作为辅助差异提示。

## 样本 D10j：ActionObject/Monster/New_Event CypherElec0 / CypherElec1

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16068 -> CypherElec0.obj` | 16068 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/CypherElec0.obj`；同号有 equipment registry 碰撞，但本桶创建上下文是 `[CREATE PASSIVEOBJECT]`。 |
| 2 | `dual_face/p1_attack.act` / `p2_attack.act -> 16068` | 两个 action 均在 FRAME3/4/5/7/8 执行同一行为，创建 16068；创建块为空 particle、level `1`，POS 为 `[RANDOM] 70 20` 与 `[RANDOM] 30 -30 100`，并有 `COLLISION GROUP 2 0 1`。 |
| 3 | `dual_face2/action/attack.act -> 16068` | 主目标该 action 在 FRAME3/5/7/9/11 执行创建 16068；创建块为空 particle、level `1`，POS 为 `[RANDOM] 50 -50` 与 `[RANDOM] 30 -30 30`，并有 `COLLISION GROUP 2 0 1`。 |
| 4 | `CypherElec0.obj -> body0.act` | 对象挂 `Action/body0.act` 与 `AttackInfo/attack0.atk`，time limit `10000`；`body0.act` FRAME0 限 3 次设置随机 X/Y 速度并使用自身方向，攻击成功或 `time + 7000 <= GET TIME` 后自毁。 |
| 5 | `16152 -> CypherElec1.obj` | 16152 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/CypherElec1.obj`；同号有 equipment registry 碰撞，但当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。 |
| 6 | `CypherElec1.obj -> body1.act` | 对象挂 `Action/body1.act` 与 `AttackInfo/attack1.atk`，有 `[homing follow] [ENEMY]`、velocity `250 0`、check gap `100000`、max rotation `360` 和 time limit `10000`；`body1.act` 攻击成功或 `time + 4000 <= GET TIME` 后自毁，未继续创建 passiveobject。 |

边界：上游 `monster/newmonsters/...` action 只作为 passiveobject 创建来源记录，不转入 Monster 主线；16068/16152 的同号 equipment 命中只是 registry 碰撞，不改变 `[CREATE PASSIVEOBJECT]` 路由。辅助对照同核心对象/action/atk/ANI 同形，但只观察到 `p1_attack.act` / `p2_attack.act` 两个 16068 创建入口，未观察到主目标 `dual_face2/action/attack.act` 路径；该差异只作目标集提示。

## 样本 D10k：ActionObject/Monster/New_Event AirSword00

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16155 -> AirSword00.obj` | 16155 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/AirSword00.obj`；同号有 equipment registry 碰撞，但本桶创建上下文是 `[CREATE PASSIVEOBJECT]`。 |
| 2 | `AirSword00.obj` | 对象为 floating height `1`、normal layer、pass all、piercing power `1000`，挂 `action/AirSword_start.act`、`AttackInfo/AirSword.atk` 与 etc action `action/AirSword_stay.act`，time limit `10000`；未观察到对象级 `[width]`、`[homing]` 或 team 字段。 |
| 3 | `dual_face/p1_attack2_l.act` / `p2_attack2_r.act -> 16155` | 两个 action 均在 FRAME5 创建 16155；创建块为空 particle、level `1`、POS `75 0 0`、`COLLISION GROUP 2 0 1`。二者在 FRAME0 的 `[WHICH] [MONSTER] [IS INDEX]` 分别检查 61650/61656，数字走 `monster/monster.lst`，不走 passiveobject。 |
| 4 | `dual_face2/action/attack2_l.act` / `attack2_r.act -> 16155` | 两个 action 均在 FRAME0 创建 16155；创建块为空 particle、level `1`、POS `5 0 0`、`COLLISION GROUP 2 0 1`，差异为先分别 `[SET DIRECTION] [LEFT]` / `[RIGHT]`。 |
| 5 | `AirSword_start.act` | BASE `Airsword00.ani`；FRAME0/7/15/20/25/32/40/45/50 执行行为 0 `[ATTACKRECT] [RESET]`，FRAME53 执行行为 1 `[SET ACTION] [CUSTOM] 0 [NOW]`。 |
| 6 | `AirSword_stay.act` | BASE `Airsword00_stay.ani`；含 FRAME10/30/61 的 `[WHICH] [CHARACTER]` 距离 `<= 600` 检查，行为包括 `[ATTACKRECT] [RESET]`、`[PULL APPENDAGE] 4 4 8000/7000/6000` 与 X 轴速度 `1000/500/200/0` 的 `[USE MY DIRECTION]`。 |
| 7 | `AirSword.atk` / `Airsword00*.ani` | `.atk` 为 absolute damage `250`、physic、dark、damage reaction none、push/lift `0/0` 等 payload，不提供坐标；`Airsword00.ani` 55 帧和 `Airsword00_stay.ani` 62 帧每帧均有 `[ATTACK BOX] -72 -20 -28 141 40 44`。 |

边界：本桶未观察到下游继续 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`.atk [active status]` 或 `[homing]`；`[PULL APPENDAGE]`、距离检查、速度切换、攻击框刷新与 time limit 销毁的真实运行效果不能由静态只读证明。辅助对照核心对象/action/atk/ANI 前段同形，但只观察到 `dual_face/p1_attack2_l.act` / `p2_attack2_r.act` 两个创建入口，未观察到主目标 `dual_face2/action/attack2_l.act` / `attack2_r.act` 两个入边，并额外出现 skill 侧数字命中；这些只作目标集差异提示。

## 样本 D10l：ActionObject/Monster/New_Event Missile0

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16153 -> Missile0.obj` | 16153 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/Missile0.obj`；同号有 equipment registry 碰撞，但本桶 registry 路由只按 passiveobject 记录。 |
| 2 | `Missile0.obj` | 对象为 floating height `1`，挂 `action/Missile0.act`、`AttackInfo/BossMissile0.atk` 与 last action `Action/body1_EX.act`，time limit `30000`，after-create sound `TEMPESTER_MISSILE -1`；未观察到对象级 `[width]`、`[layer]`、`[pass type]`、`[piercing power]`、team 或 `[homing]`。 |
| 3 | `Missile0.act` | BASE `BossMissile0.ani`；FRAME0/1 执行行为 0 `[PARTICLE] ../particle/BossMissileSmog0.ptl 0 0 0`，FRAME2 先执行同一粒子行为，再执行行为 1 `[ATTACKRECT] [RESET]`。 |
| 4 | `BossMissile0.atk` / `BossMissile0.ani` | `.atk` 为 weapon damage apply `1`、damage bonus `0`、magic、fire、damage reaction damage、blow、no blood `50 1.0`、push/lift `300/450`，不提供坐标；`BossMissile0.ani` 3 帧均有 `[ATTACK BOX] -24 -10 -9 49 20 18`。 |
| 5 | `body1_EX.act` / explosion ANI | last action BASE `1ExpDodge_M.ani`、SUB `1ExpNormal_M.ani`，二者均为 11 帧表现 ANI，未观察到盒字段；FRAME10 执行 `[DESTROY]`。 |
| 6 | `BossMissileSmog0.ptl` | 粒子侧车指向 `BossMissileSmog0.ani`，life time `400`、creation frequency `20`、object type animation；该 ANI 为 7 帧烟雾表现，未观察到盒字段。 |
| 7 | `主目标反向检索（16153）` | 全 PVF 数字检索未观察到 16153 的 `[CREATE PASSIVEOBJECT]` 创建入口，只命中 registry / itemdictionary / iteminfo / mercenary 等数字表。 |

边界：本桶闭合到 registry、物理对象、attackinfo、飞行态攻击框、last action 和粒子侧车，但未闭合到主目标创建入口；数字表命中不能写成 PO 创建证据。FRAME 触发、攻击刷新、粒子播放、time limit 与 last action 销毁时序都不能由静态只读证明。辅助对照核心链路同形且同样未观察到创建入口；差异为 registry 总量/行号、对象 `[name]` 文本样式和脚本长度不同。

## 样本 D10m：ActionObject/Monster/New_Event Assault_Missile0

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16154 -> Assault_Missile0.obj` | 16154 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/Assault_Missile0.obj`；同号有 equipment registry 碰撞，但本桶创建上下文是 `[CREATE PASSIVEOBJECT]`。 |
| 2 | `Assault_Missile0.obj` | 对象为 width `1 1`、normal layer、do not pass、piercing power `0`、team `100`，挂 `action/Assault_Missile0.act`、`AttackInfo/Assault_Missile0.atk` 与 last action `Action/body1_EX.act`，time limit `30000`，并有 `[homing] [ENEMY]`。 |
| 3 | `zx_77/action/casting.act -> 16154` | FRAME4 与 FRAME6 各创建一次 16154；创建块为空 particle、level `1`、POS `0 5 -1` 与 `10 -5 -1`、`FIX DIRECTION LEFT`、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`。FRAME6 创建后设置 X speed `-30`，FRAME7 设置 X speed `0`。 |
| 4 | `zx_77/action/casting1.act -> 16154` | 与 `casting.act` 同列形，同样在 FRAME4/6 创建 16154；差异为 `FIX DIRECTION RIGHT`。 |
| 5 | `Assault_Missile0.act` | BASE `Missile10.ani`、SUB `Missile20.ani`；FRAME0 限 1 次设置 X/Z `-20/-40`，FRAME1 限 1 次设置 X/Z `900/0`，均使用自身方向；action 内未观察到 `[ATTACKRECT] [RESET]`。 |
| 6 | `AttackInfo / ANI / last action` | `.atk` 为 damage `1200`、damage bonus `2`、physic、no element、damage reaction damage、hit down、blow、push/lift `50/50` 等 payload，不提供坐标；`Missile10.ani` 2 帧有攻击框，`Missile20.ani` 与 last action 的 `1ExpDodge_M.ani` / `1ExpNormal_M.ani` 未观察到盒字段。 |

边界：上游 `monster/newmonsters/.../zx_77` action 只作为 passiveobject 创建入口记录，不转入 Monster 主线；`[ENEMY]` 后无数字 ID，不走 registry。辅助对照同核心链路，但额外观察到 `timespiral/zx_77/action/casting.act` / `casting1.act` 和 atgunner skill 数字命中；这些只作目标集差异提示，不能覆盖主目标上游入边。

## 样本 D10n：ActionObject/Monster/New_Event Hgoblin_Laser

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16157 -> Hgoblin_Laser.obj` | 16157 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/Hgoblin_Laser.obj`；同号有 equipment registry 碰撞，但本桶创建上下文是 `[CREATE PASSIVEOBJECT]`。 |
| 2 | `Hgoblin_Laser.obj` | 对象为 floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/Hgoblin_laser.act` 与 `AttackInfo/BiggunEx.atk`；对象本体未观察到 `[homing]`、对象级销毁块或 team 字段。 |
| 3 | `zx_77/action/attack.act -> 16157` | FRAME0 设置 LEFT；FRAME2 创建 16157，创建块为空 particle、level `1`、POS `15 0 1`、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`。 |
| 4 | `zx_77/action/attack1.act -> 16157` | 与 `attack.act` 同列形，同样在 FRAME2 创建 16157；差异为 FRAME0 设置 RIGHT。 |
| 5 | `Hgoblin_laser.act` | BASE `laser_dodge.ani`、SUB `laser_dodge1.ani 0 -5` 与 `laser_dodge2.ani 0 -4`，播放 `MECAGOBLIN_LAZER`，FRAME12 执行 `[DESTROY]`；action 内未观察到 `[ATTACKRECT] [RESET]`。 |
| 6 | `AttackInfo / ANI` | `.atk` 为 damage `600`、magic、light element、damage reaction damage、blow、push/lift `30/30`、no blood `50 0.5` 等 payload，不提供坐标；`laser_dodge.ani` FRAME001-006 有同形攻击框，两个 SUB ANI 未观察到盒字段。 |

边界：上游 `monster/newmonsters/.../zx_77` action 只作为 passiveobject 创建入口记录，不转入 Monster 主线；实际发射方向、命中刷新、销毁时机和碰撞组表现仍需运行验证。辅助对照同核心链路，但额外观察到 `timespiral/zx_77/action/attack.act` / `attack1.act`、`iteminfo.dat` 和 atpriest skill 数字命中；这些只作目标集差异提示，不能覆盖主目标上游入边。

## 样本 D10o：ActionObject/Monster/New_Event Boss_Command 地图放置 / passive 检查边界

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16167 -> Boss_Command.obj` | 16167 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/Boss_Command.obj`；同号有 equipment registry 碰撞，但地图 `[passive object]` 和 `[WHICH] [PASSIVE] [IS INDEX]` 上下文均按 passiveobject registry 解释。 |
| 2 | `Boss_Command.obj` | 对象为 floating height `1`、bottom layer、pass all、piercing power `1000`，挂 `Action/Boss_Command.act` 和 4 条 etc action；对象本体未观察到 `[attack info]`、`[homing]`、team 或对象级销毁块。 |
| 3 | `new_eventmap2 / twin_raid_boss map [passive object] -> 16167` | 主目标观察到两个地图静态放置入口，列形均为 `ID X Y Z`，分别含 `16167 600 227 0` 与 `16167 742 298 0`；这不是 `[CREATE PASSIVEOBJECT]` 递归链。 |
| 4 | `dual_face / dual_face2 change_start action -> [WHICH] [PASSIVE] [IS INDEX] 16167` | 主目标反向检索观察到 6 个 source action 检查 16167 后对 checkup object 切 custom 0/1 或切换 action；它们是 passive 检查和控制入边，不是创建 16167。 |
| 5 | `Boss_Command*.act [WHICH] [MONSTER] [IS INDEX]` | 61644/61645/61649/61653 位于 monster 检查上下文，走 `monster/monster.lst`，不按 passiveobject ID 解释。 |
| 6 | `source change_start action -> 16191` | 相关 source action 另在 FRAME0 创建 16191，16191 回 passiveobject registry 命中 `ActionObject/Monster/New_Event/EMP.obj`；该创建边只是 Boss_Command 入边动作的相邻事实，EMP 下游已在本账本 16191 行独立展开。 |
| 7 | `限定标签检索` | 本桶核心 Boss_Command obj/action 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`[attack info]`、`.atk [active status]` 或 `.atk [pvp]`；`[SET DAMAGE BOX] [ON]` 是 action 行为字段，不是 ANI 坐标。 |

边界：Boss_Command 当前闭合到 registry、对象、action、linked ANI、地图静态放置和 passive 检查入边，但未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建 16167。地图出生、source action 检查命中、custom trigger 切换、`SET DAMAGE BOX` 行为效果、与 61644/61645/61649/61653 的运行配合都不能由静态只读证明。辅助对照核心对象/action/ANI 同形，但当前只观察到 `new_eventmap2` 放置和 `dual_face` 四个 passive 检查入口，未观察到主目标 `twin_raid_boss` 放置和 `dual_face2` 两个 passive 检查入口；辅助额外技能/升级数值命中只作目标集差异提示。

## 样本 D10p：ActionObject/Monster/New_Event Zx-69_Dorp 创建到召唤出口

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16161 / 16181 -> Zx-69_Dorp*.obj` | 16161 命中 `ActionObject/Monster/New_Event/Zx-69_Dorp.obj`，16181 命中 `ActionObject/Monster/New_Event/Zx-69_Dorp1.obj`；二者在对象和创建块上下文均按 passiveobject registry 解释。 |
| 2 | `Zx-69_Dorp.obj / Zx-69_Dorp1.obj` | 两个对象同形，均为 floating height `1`、normal layer、pass all、piercing power `50000`、basic action `Zx-69_Dorp.act`、`vanish on move collision 0`；差异为 etc action 分别进入 `Zx-69_Dorp_last.act` 与 `Zx-69_Dorp_last1.act`。 |
| 3 | `dual_face p1/p2 summon action` | `p1_zx_69_summon.act` 三次创建 16161，`p2_zx_69_summon.act` 三次创建 16181；创建块均含 particle、level `1`、随机 POS、warning mark、use map pos 与 collision group。 |
| 4 | `dual_face2 zx_69_summon_l/r.act` | 主目标 `zx_69_summon_l.act` 与 `zx_69_summon_r.act` 各三次创建 16161；差异主要为随机坐标范围和最后 `[SET DIRECTION] [LEFT]` / `[RIGHT]`。 |
| 5 | `Zx-69_Dorp.act` | BASE/SUB ANI 均无盒；当自身 ZPOS `<= 10` 且 checked no `>= 1` 时切 custom 0，未观察到 create/summon/homing/attackinfo。 |
| 6 | `Zx-69_Dorp_last.act / last1.act` | 二者均在 FRAME28 执行召唤后自毁：`last` 召唤 61650，`last1` 召唤 61656；召唤块含 level `70`、pos `0 1 0`、no effect、use object zpos、collision group。 |
| 7 | `61650 / 61656` | 两个 ID 位于 `[SUMMON MONSTER] [INDEX]`，走 `monster/monster.lst`，均命中 `Zx-18 机器人` 相关条目；不能按 passiveobject registry 解释。 |
| 8 | `限定标签与数字噪声` | 本桶 obj/action 源文件未观察到 `[attack info]`、`[homing]`、`[active status]`、`[pvp]` 或 `[ATTACKRECT]`；`skill/priest/awakening.skl` 中的 16161 是数值表噪声，不是 PO 创建入口。 |

边界：本桶证明主目标中 16161/16181 可由上游 action 创建，并在落地后通过 last action 召唤 monster 后销毁；不证明随机落点、ZPOS 触发、warning mark、召唤成功率、召唤对象存活、碰撞组或销毁时序。辅助对照核心对象/action/ANI 和 61650/61656 路由同形，但只观察到 `dual_face` 的 p1/p2 创建入口，未观察到主目标 `dual_face2` 左右两个 16161 入边；辅助额外 item/skill 数字噪声只作目标集差异提示。

## 样本 D10q：ActionObject/Monster/New_Event ExpAir 无创建入口 / 攻击框边界

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `16156 -> ExpAir.obj` | 16156 位于 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/New_Event/ExpAir.obj`；同号 equipment registry 也命中，但当前对象上下文按 passiveobject 解释。 |
| 2 | `ExpAir.obj` | 对象为 floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/ExpAir.act` 与 `AttackInfo/TempesterMissileExp.atk`；未观察到对象级 homing、team、width 或销毁块。 |
| 3 | `ExpAir.act` | BASE `Tempester/ExpAirDodge.ani`，SUB `Tempester/ExpAirNormal.ani 0 0`，FRAME7 对自身执行 `[DESTROY]`；未观察到 create/summon/ATTACKRECT。 |
| 4 | `TempesterMissileExp.atk` | `.atk` 为 magic/no element/down/blow、weapon damage apply `1`、push/lift `100/200`、no blood `20 1.0`；未观察到 `[active status]` 或 `[pvp]`，且不提供 hitbox 坐标。 |
| 5 | `linked ANI` | BASE `ExpAirDodge.ani` FRAME000-004 每帧 3 条攻击框，FRAME005-007 无盒；SUB `ExpAirNormal.ani` 无攻击框或伤害框。 |
| 6 | `主目标反向检索` | 16156 全局数字检索未观察到 action/key/map 的创建或放置入口，只命中 registry、equipment、itemdictionary、event 与 skill 数字噪声。 |
| 7 | `同名物理文件边界` | `Action/ExpAir.act` 和 `AttackInfo/TempesterMissileExp.atk` 字符串在 common / character/gunner 等 owner 中也出现，但这些前缀有独立物理 `.act/.atk`，不能与 new_event 合并。 |

边界：本桶闭合到 registry、对象、action、attackinfo 和 linked ANI，但未闭合到主目标创建入口；不能仅凭未命中写成运行绝不出现。FRAME7 自毁、攻击框实际命中、伤害结算、击退/浮空、图像资源渲染和与上游生成者的关系都不能由静态只读证明。辅助对照核心文件、16156 registry、action/atk/ANI 盒字段同形；差异为对象 name 文本样式、registry 总量/行号、对象脚本长度和全局数字噪声集合不同。

## 样本 D10g：SPC _gligexp 多帧创建 30550 FireExplosion

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `actionobject/spc/_gligexp/body.obj` / `body3.obj` | 两个 owner 均挂 `Action/Body.act`，但分别挂 `AttackInfo/Body.atk` 与 `AttackInfo/Body3.atk`；对象级为 on-end-animation 销毁。 |
| 2 | `Body.act` | FRAME1 执行行为 0 一次和行为 1 两次；FRAME2/3 各执行行为 1 两次；FRAME4 执行行为 2。行为 0 为 flash screen + shaking，行为 1 创建 30550，行为 2 `[DESTROY]`。 |
| 3 | `CREATE PASSIVEOBJECT 30550` | 创建块为空 particle、level `0`、pos 为三段 random：`-200 200`、`-100 100`、`50 100`。 |
| 4 | `30550` | 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 `passiveobject/passiveobject.lst`，命中 `Monster/Spirit/FireExplosion.obj`；全 registry 只命中 passiveobject。 |
| 5 | `Monster/Spirit/FireExplosion.obj` | 下游对象为 basic motion `Animation/FireExplosion.ani` 直连，挂 `AttackInfo/FireExplosion.atk`，并在 `[string data]` 列出 4 个 `FireExplosionParticle*.ptl`。 |
| 6 | `body2.obj -> Body2.act` | `body2.obj` 挂 `Action/Body2.act` 与 `AttackInfo/Body2.atk`；`Body2.act` 只挂 `Exp2.ani` 与 sound，未观察到创建链。 |

边界：FRAME 触发次数可以静态列出，但实际运行中是否全部触发、是否受销毁、碰撞、时间或客户端表现影响，不能由只读 PVF 证明。全 PVF 搜 30550 另命中技能、道具和 monster action 等上下文，本样本只记录 `_gligexp` 创建链，不把其他命中扩写成本桶事实。

## 样本 D10f：SPC root flowermanager / icedropmanager / runningicedrop 到 IceDrop

| 步骤 | 链路 | 只读结论 |
| ---: | --- | --- |
| 1 | `actionobject/spc/flowermanager.obj -> action/flowermanager.act` | 对象挂 `Action/Flowermanager.act`，对象级 on-end-animation 销毁；action 在 FRAME0 连续 7 次执行行为 0，创建 8153、particle `../Particle/dummy2.ptl`、level `40`、两段 random pos，随后执行行为 1 `[DESTROY]`。 |
| 2 | `8153` | 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 与 `[WHICH] [PASSIVE] [IS INDEX]` 上下文时走 `passiveobject/passiveobject.lst`，命中 `ActionObject/BreakableObject/IceFlower.obj`；同号存在 stackable 碰撞。 |
| 3 | `BreakableObject/IceFlower.obj` | 当前只做边界目标最小复核：width `54 32`、floating height `0`、pass type `[do not pass]`、hp max `8000`、hp destroy `1`、destroy particle `Particle/IceFlowerDestroy.ptl`。 |
| 4 | `icedropmanager.obj -> action/icedropmanager.act` | action 在 FRAME0 检查 `[WHICH] [PASSIVE] [CHECKUP] [IS INDEX] 8153`，行为 0 创建 8023、空 particle、level `40`、random pos `70 -70` / `30 -30 0`，行为 1 `[DESTROY]`。 |
| 5 | `runningicedrop.obj -> action/runningicedrop.act` | owner 有 homing 块；basic action FRAME0 `[SET ACTION] [CUSTOM] 4 [NOW]`，FRAME6 reset trigger 后 `[DESTROY]`，basic action 本身未创建 8023。 |
| 6 | `runningicedropstraight/up/down/random/2.act` | 5 个 etc action 创建 8023；straight/up/down 各 7 次 level `40`，random 6 次 level `40` 且带 basepos/direction 选项，`runningicedrop2` 7 次 level `47`。 |
| 7 | `8023` | 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 上下文时走 `passiveobject/passiveobject.lst`，命中 `ActionObject/SPC/IceDrop.obj`；同号存在 stackable 碰撞。 |
| 8 | `IceDrop.obj -> IceDrop.act / IceDrop.atk / Blizzard_Big.ani` | IceDrop 挂 `AttackInfo/IceDrop.atk` 与 `Action/IceDrop.act`；`.atk` 为 magic/warter/damage 等 payload，不含坐标；`Blizzard_Big.ani` 有攻击框，SUB effect 与粒子侧车 ANI 未观察到盒字段。 |

边界：`CHECKUP OBJECT`、`SET ACTION CUSTOM 4`、homing 轨迹、FRAME/LIMIT 触发顺序和实际创建次数只能静态观察到结构，不能由只读 PVF 证明运行时一定按该顺序触发。辅助对照核心链路同形，但 registry 总量/行号、额外 quest/map 碰撞和 `flowermanager.obj` 的 sound category 存在差异，不能覆盖主目标。

## 未解析创建 ID 样本

| 源动作 | 创建 ID | registry 解析 | 只读结论 |
| --- | ---: | --- | --- |
| `character/mage/action/fluorecolliderstart.act` | 90010005 | `passiveobject/passiveobject.lst` 未命中；全 registry 解析未命中。 | 保留为未闭合高位 ID；辅助对照可解析为 FluoreCollider 对象，但不能写成主目标存在。 |
| `character/mage/action/fluorecolliderstay.act` | 90010006 / 90010007 / 90010009 | `passiveobject/passiveobject.lst` 未命中；全 registry 解析未命中。 | `90010007` 创建块带 `[USE OBJECT ZPOS]` 与 `[FOLLOWING TARGET]`；辅助对照可解析这些 ID，但主目标仍未闭合。 |
| `character/mage/action/fluorecolliderend.act` | 23055 | `passiveobject/passiveobject.lst` 命中 `Character/Mage/FluoreColliderNoneExplosion.obj`。 | 同一技能系动作中既可出现可解析 ID，也可出现未解析高位 ID；23055 在同一行为块内被创建三次。 |
| `common/action/golgothunder_summon.act` | 48306 | `passiveobject/passiveobject.lst` 命中 `Common/Golgosoul_item.obj`。 | 同一动作可在多个行为块中重复创建同一 ID，但位置不同。 |
| `common/action/title_mega_drop.act` | 62100 | `passiveobject/passiveobject.lst` 命中 `Common/Title_mega.obj`。 | common 小桶创建 ID 可正常回 passiveobject registry。 |
| `character/common/action/fireexplosioncreater.act` | 48198 | `passiveobject/passiveobject.lst` 命中 `Common/FireExplosionItemAttack8.obj`。 | 父对象 ANI 未观察到盒字段；下游对象 ANI 有攻击框。 |
| `actionobject/monster/action/3headlessknight.act` | 48163 | `passiveobject/passiveobject.lst` 命中 `Monster/HeadlessKnight/Horse_item.obj`。 | raw path 含 `Monster/`，但创建 ID 仍按 passiveobject registry 解析。 |
| `actionobject/monster/gashengrigun/action/boom.act` | 8794 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/BigBoom4.obj`。 | 源 `Boom.ani` 为 `[DAMAGE BOX]` 样本；下游 `BigBoom4` 的 BASE ANI 有 `[ATTACK BOX]`。 |
| `actionobject/monster/gashengrigun/action/boom2.act` | 8588 | `passiveobject/passiveobject.lst` 命中 `Monster/ZealotRebirth/NenGuard_1.obj`。 | 创建块位于 `[WHICH] [CHARACTER]` 触发下；raw path 含 `Monster/` 不改变 registry。 |
| `actionobject/monster/gashengrigun/action/gasbomb.act` | 8591 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Gashengrigun/SleepingGas.obj`。 | 创建目标回到同前缀睡眠气体对象；该对象挂 `Gas.atk` 与 `SleepSmoke.ani`。 |
| `actionobject/monster/gashengrigun/action/summon.act` | 8561 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/GuardianGoblin/SpearJailDust.obj`。 | 同一行为块还召唤 61136 monster；创建与召唤分属不同 registry。 |
| `actionobject/spc/4season/action/empty.act` | 11008 / 11009 | `ActionObject/SPC/4season/fairy_ok.obj` / `fairy_bad.obj`。 | 行为随机选择后可 fan-out 到两个 SPC passiveobject。 |
| `actionobject/spc/_cannontrap/action/attackmonster.act` / `attackcharacter.act` | 8044 | `ActionObject/SPC/_Cannonball/Body.obj`。 | trap 攻击动作创建下游发射物。 |
| `actionobject/spc/_cannonball/action/body.act` | 8846 | `ActionObject/Common/SmallBoom3.obj`。 | 发射物落地或攻击成功后创建 common 爆炸对象。 |
| `actionobject/spc/jackie/action/ball_throw.act` | 16070 / 16071 | `ActionObject/SPC/Jackie/Frenken_Ball_Count.obj` / `Frenken_Ball_Count_Bomb.obj`。 | Jackie 球体链可在落地/倒数后进入同子桶对象。 |
| `actionobject/spc/jackie/action/ball_bomb.act` | 9950 / 8580 | `ActionObject/Monster/cartelcommand/robot.obj` / `ActionObject/Common/BigBoom2.obj`。 | 检查 monster 后创建 passiveobject；创建目标 raw path 可跨 actionobject 子前缀。9950 下游已静态闭合为无 `.atk`、ANI 无盒样本。 |
| `actionobject/monster/lizardman/action/summonstonebody.act` | 8568 | `ActionObject/Common/GuardianGrenadeNoneBomb.obj`。 | 同一行为块还召唤 61129-61133；这些候选走 `monster/monster.lst`。 |
| `actionobject/monster/lizardman/action/lizard_stonebody2.act` | 8568 | `ActionObject/Common/GuardianGrenadeNoneBomb.obj`。 | 同 action 中 61129 是 `[WHICH] [MONSTER] [IS INDEX]` 检查目标，走 `monster/monster.lst`。 |
| `actionobject/monster/guardiangoblin/action/realspearjail1/2.act`、`spearjail.act`、`spearjail3.act`、`spearjailready.act` | 8561 / 8568 | `ActionObject/Monster/GuardianGoblin/SpearJailDust.obj` / `ActionObject/Common/GuardianGrenadeNoneBomb.obj`。 | guardian source action 多处同块或同 action 创建两个 passiveobject ID；`spearjail3.act` 的 56108 是 monster 检查目标。 |
| `actionobject/spc/despair_tower/sjar/action/sjar_bom_ok.act` | 9202 | `ActionObject/SPC/Despair_tower/ZDrop.obj`。 | FRAME1 限次触发 `[RANDOM SELECT] 0 1`，两个行为块均创建 9202；创建块为空 particle、`[USE MAP POS]`、固定方向，位置分别为 `159 224 0` 右向 level `70` 与 `923 254 0` 左向 level `0`，FRAME2 自毁。 |
| `actionobject/spc/despair_tower/sjar/action/sjar_bom_bad.act` | 8376 | `ActionObject/Trap/MinePressure2.obj`。 | bad 分支跨到 Trap 前缀；FRAME1 限次触发 `[RANDOM SELECT] 0 1`，第一行为创建 3 个 level `70` 的 8376，第二行为创建 5 个 8376 且首块 level `0`、其余 level `70`；所有创建块均为空 particle、随机 POS、使用自身 basepos/zpos/direction。 |
| `actionobject/trap/action/mineactive2.act` | 8375 | `ActionObject/Common/MineExplosion2.obj`。 | trap 激活后进入 common 爆炸对象；创建块为空 particle、level `60`、pos `0 0 0`，随后执行 `[DESTROY]`。 |
| `actionobject/spc/despair_tower/action/zdrop_start.act` / `zdrop_move.act` / `zdrop_end.act` | 9203 | `ActionObject/SPC/Despair_tower/ZGT.obj`。 | ZDrop 三个 action 均创建 9203；start/move 的随机位置为 X `-150..150`、Y `-130..130`、Z `0`，end 为 X `-200..200`、Y `-100..100`、Z `0`。 |
| `actionobject/spc/despair_tower/action/zgt.act` | 9204 | `ActionObject/SPC/Despair_tower/ZMissile.obj`。 | `ZGT.act` BASE `dumy2.ani`、SUB `WarningMark.ani`，FRAME6 限次创建 9204，empty particle、level `70`、pos `0 0 500`，FRAME9 自毁。 |
| `actionobject/spc/despair_tower/action/missile.act` | 9206 | `ActionObject/SPC/Despair_tower/ZMissileExp.obj`。 | `ZMissile.obj` 实际 basic action 是 `Action/Missile.act`；`Missile.act` 在 `ZPOS <= 40` 且 checked no `> 0` 时创建 9206，empty particle、level `70`、pos `0 0 0`，随后播放销毁粒子、shaking 并自毁；攻击成功也执行同一自毁行为。 |
| `actionobject/monster/timegate/timelord/action/chain_start.act` | 16080 | `ActionObject/Monster/timegate/TimeLord/Chain2.obj`。 | TimeLord chain 父对象在 ZPOS 条件后创建下游 chain2 对象。 |
| `actionobject/monster/blood_an/action/darkfireshoot.act` | 8718 / 8719 / 8720 | `ActionObject/Monster/Blood_An/darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj`。 | `[INDEX]` 下随机 passiveobject ID 候选，三个候选均已闭合到对象和 ANI。 |
| `actionobject/monster/blood_an/action/darkfire1.act` / `darkfire2.act` / `darkfire3.act` | 8725 | `ActionObject/Monster/Blood_An/darkfire4.obj`。 | 三个候选对象攻击成功后进入同一个下游对象。 |
| `actionobject/monster/grim/grim_seeker/action/fire2.act` | 8679 / 8680 | `ActionObject/Monster/Grim/Grim_seeker/FireReady.obj` / `FireReady2.obj`。 | `[INDEX]` 下随机 passiveobject ID 候选；8679 静态回返 `Fire2.act`，8680 走 `Fire3.act`。 |
| `actionobject/monster/grim/grim_seeker/action/fire2_r.act` | 9136 / 9137 | `ActionObject/Monster/Grim/Grim_seeker/FireReady_Riding.obj` / `FireReady_Riding1.obj`。 | `[INDEX]` 下随机 passiveobject ID 候选；9136 静态回返 `Fire2_r.act`，9137 走 `Fire3.act`。 |
| `actionobject/spc/_newhell/agaress_hell/action/darkfireshoot.act` | 16031 / 16052 / 16053 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj`。 | `[INDEX]` 下随机 passiveobject ID 候选，三个候选均已闭合到对象和 ANI。 |
| `actionobject/spc/_newhell/agaress_hell/action/darkfire1.act` / `darkfire2.act` / `darkfire3.act` | 16051 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire4.obj`。 | 三个候选对象攻击成功后进入同一个下游对象。 |
| `actionobject/spc/_firewitch/ador/action/destroy.act` | 40002 | `Common/FireExplosion.obj`。 | 40002 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；同号在 monster registry 也命中其他对象，不能脱离父块解释。 |
| `actionobject/spc/_firewitch/meteo/action/destroy.act` | 8236 | `ActionObject/Monster/Jeff/Jeff_Omega_BigBoom.obj`。 | 8236 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 含 `Monster/` 不改变 registry。 |
| `actionobject/spc/_firewitch/meteo/action/destroy_cyclops.act` | 10027 | `ActionObject/Monster/Jeff/BigBoom.obj`。 | 10027 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；下游对象挂 `Big.atk`，hitbox 仍看 ANI。 |
| `actionobject/spc/_cyclone/action/hurricaneofjudgement_opt.act` | 48117 | `ActionObject/SPC/_Cyclone/Short1.obj`。 | opt action 在 FRAME0/1/2 创建同一 ID，FRAME3 销毁；下游 `Short1.obj` 回主旋风有盒 ANI。 |
| `actionobject/spc/mesteria/action/halloweenbuster1.act` | 40005 | `Common/ShootingStarExp.obj`。 | 40005 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；创建块为空 particle、level `70`、pos `0 0 0`，随后 `[DESTROY]`；下游 `ShootingStarExp.ani` 有攻击框。 |
| `actionobject/monster/advancealtar/action/bomb1_lv1.act` / `bomb1_lv2.act` / `bomb1_lv3.act` / `bomb1_lv4.act` | 12600 / 12646 / 12647 / 12648 | `ActionObject/Monster/AdvanceAltar/LgExp_Lv1.obj` / `LgExp_Lv2.obj` / `LgExp_Lv3.obj` / `LgExp_Lv4.obj`。 | 四个 action 均在 FRAME6 创建下游爆炸对象，创建块为 empty particle、level `0`、pos `0 0 -30`，随后 `[DESTROY]`；下游对象共用 `Action/LgExp.act` 并挂分级 `FireExplosion_Lv*.atk`。 |
| `actionobject/monster/advancealtar/action/catpul_bomb1.act` / `1catpul_bomb1.act` / `2catpul_bomb1.act` / `3catpul_bomb1.act` | 12622 / 12624 / 12626 / 12628 | `ActionObject/Monster/AdvanceAltar/catpul_BombSub.obj` / `catpul_BombSub1.obj` / `catpul_BombSub2.obj` / `catpul_BombSub3.obj`。 | 四个落地 action 分别在 FRAME6 或 FRAME3 创建下游爆炸对象，创建块为 empty particle、level `0`、pos `0 0 -10`，随后 `[DESTROY]`；raw path 含 `Monster` 但仍走 passiveobject registry。 |
| `actionobject/monster/advancealtar/action/3catpul_bombsub.act` | 12634 | `ActionObject/Monster/AdvanceAltar/OilExp.obj`。 | `3catpul_bombsub.act` 在 FRAME4 创建 12634，创建块为 empty particle、level `0`、pos `0 0 -10`，FRAME10 销毁；`OilExp.obj` 下游挂 `Action/OilExp.act` 与 `AttackInfo/catpulStinger.atk`。 |
| `actionobject/monster/advancealtar/action/probomb_lv1.act` / `2probomb.act` / `3probomb.act` / `4probomb.act` | 12616 / 12677 / 12678 / 12679 | `ActionObject/Monster/AdvanceAltar/LgExp2_Lv1.obj` / `LgExp2_Lv2.obj` / `LgExp2_Lv3.obj` / `LgExp2_Lv4.obj`。 | 四个父 action 均在 `ZPOS <= 10`、limit `1` 后创建下游爆炸对象，创建块为 empty particle、level `0`、pos `0 0 0`，随后 `[DESTROY]`；父对象本体不挂 `.atk`，下游 `LgExp2` 才挂 `FireExplosion*.atk`。 |
| `monster/newmonsters/advancealtar/tower/goblin_propeller/action/lv1-4_shootup_stay.act` / `lv1-4_shootup_stay1.act` | 12614 | `ActionObject/Monster/AdvanceAltar/ZepplinBullet_Lv1.obj`。 | 8 个射击 action 均创建 12614 Lv1 子弹，创建块使用 `../Particle/Bullet.ptl`、level `0`、pos `90 0 -50` 与 `100 -10 -50`、`[USE MY DIRECTION]`、`[FIX DIRECTION]`、`[NEUTRAL]`；同一主目标子树未观察到 12680 / 12672 / 12673 创建入口。 |
| `monster/newmonsters/advancealtar/friend/knifetooth/action/bite2_lv1.act` / `bite2_lv2.act` / `bite2_lv3.act` / `bite2_lv4.act` | 12593 / 12668 / 12669 / 12670 | `ActionObject/Monster/AdvanceAltar/denture3_Lv1.obj` / `denture3_Lv2.obj` / `denture3_Lv3.obj` / `denture3_Lv4.obj`。 | 四个 bite2 action 同构：BASE `../animation/Bite2.ani`、sound `R_ANTMON_BITE`、FRAME0 执行 `[CASTING] 300 1` 与 `[SET FRAME] 1`，FRAME2 创建对应 denture3 对象；创建块使用 `../Particle/denture.ptl`、level `0`、pos `90 0 80`。主目标 12593/12670 另有装备/技能等数字碰撞，不能当作 PO 创建入口。 |
| `monster/newmonsters/advancealtar/enemy/keraha/action/cast.act` / `cast1.act` 与 `monster/newmonsters/advancealtar/enemy/vinoshu/action/cast.act` / `cast1.act` | 12606 | `ActionObject/Monster/AdvanceAltar/Iceniddle.obj`。 | 两个 monster owner 的 `cast.act` 同构：FRAME8 在 `[WHICH] [CHARACTER] [GET TARGET] 1 [RANDOM]` 检查后创建 12606，empty particle、level `0`、pos `0 0 0`、warning mark `0 0 100 1`。两个 `cast1.act` 同构：FRAME6/7/8/8 各创建一次 12606，pos 为 `100/200/300/400 0 0`，其余创建列形同上。辅助对照额外有 `advanceatlar` 拼写路径创建入口，不能覆盖主目标。 |
| `actionobject/spc/action/flowermanager.act` | 8153 | `ActionObject/BreakableObject/IceFlower.obj`。 | 8153 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；同号有 stackable 碰撞，当前只登记 IceFlower 为边界目标。 |
| `actionobject/spc/action/icedropmanager.act` | 8023 | `ActionObject/SPC/IceDrop.obj`。 | 8023 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；同号有 stackable 碰撞，下游 IceDrop BASE ANI 有攻击框。 |
| `actionobject/spc/action/runningicedropstraight.act` / `runningicedropup.act` / `runningicedropdown.act` / `runningicedroprandom.act` / `runningicedrop2.act` | 8023 | `ActionObject/SPC/IceDrop.obj`。 | running etc actions 多帧创建同一 IceDrop ID；source TimeControl/TimeControl2 ANI 无盒，下游 IceDrop 承载攻击框。 |
| `actionobject/spc/_gligexp/action/body.act` | 30550 | `Monster/Spirit/FireExplosion.obj`。 | 30550 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 含 `Monster` 不改变 registry。`Body.act` 在 FRAME1/2/3 多次创建该 ID，下游 `FireExplosion.ani` 有攻击框。 |
| `actionobject/spc/_cypherobjectfriend/action/attack.act` | 8036 | `ActionObject/SPC/_CypherElec/CypherElec.obj`。 | 8036 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；`attack.act` 在 FRAME6 创建该 ID，下游 `body.ani` 有攻击框，`body.act` 未继续创建或召唤。 |
| `monster/event/bluemarble/cypher/action/comein.act` / `monster/newmonsters/cartel/cypher/cypher/action/comein.act` | 8035 | `ActionObject/SPC/_CypherObject2/CypherObject.obj`。 | 两个上游 action 均在 FRAME0-4 多次创建 8035；8035 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry。 |
| `actionobject/spc/_cypherobject2/action/attack.act` | 8036 | `ActionObject/SPC/_CypherElec/CypherElec.obj`。 | `_cypherobject2` attack FRAME6 创建同一 8036 下游；与 `_cypherobjectfriend` 是两个父入口，应分开记录触发条件和运行风险。 |
| `monster/newmonsters/new_event/dual/dual_face/action/p1_attack.act` / `p2_attack.act` | 16068 | `ActionObject/Monster/New_Event/CypherElec0.obj`。 | 两个上游 action 多帧创建同一 passiveobject ID，创建块为空 particle、level `1`、随机 POS、`COLLISION GROUP 2 0 1`；raw path 含 `Monster` 不改变 passiveobject registry。 |
| `monster/newmonsters/new_event/dual/dual_face2/action/attack.act` | 16068 | `ActionObject/Monster/New_Event/CypherElec0.obj`。 | 主目标该路径多帧创建 16068；辅助对照未观察到同路径文件或该入边，只作目标集差异提示。 |
| `主目标反向检索（16152）` | 未观察到 | `ActionObject/Monster/New_Event/CypherElec1.obj`。 | 16152 仅闭合到 passiveobject registry 和物理对象/ANI，当前未观察到 `[CREATE PASSIVEOBJECT]` 创建入口；技能/装备等同号命中不能写成 PO 创建证据。 |
| `monster/newmonsters/new_event/dual/dual_face/action/p1_attack2_l.act` / `p2_attack2_r.act` | 16155 | `ActionObject/Monster/New_Event/AirSword00.obj`。 | 两个上游 action 均在 FRAME5 创建 16155，创建块为空 particle、level `1`、POS `75 0 0`、`COLLISION GROUP 2 0 1`；FRAME0 的 61650/61656 是 monster 检查目标，走 `monster/monster.lst`。 |
| `monster/newmonsters/new_event/dual/dual_face2/action/attack2_l.act` / `attack2_r.act` | 16155 | `ActionObject/Monster/New_Event/AirSword00.obj`。 | 主目标两个 action 均在 FRAME0 创建 16155，创建块为空 particle、level `1`、POS `5 0 0`、`COLLISION GROUP 2 0 1`，左右差异来自 `[SET DIRECTION]`；辅助对照未观察到这两个入边。 |
| `主目标反向检索（16153）` | 未观察到 | `ActionObject/Monster/New_Event/Missile0.obj`。 | 16153 仅闭合到 passiveobject registry 和物理对象/ANI，当前未观察到 `[CREATE PASSIVEOBJECT]` 创建入口；registry / itemdictionary / iteminfo / mercenary 等数字表命中不能写成 PO 创建证据。 |
| `monster/newmonsters/new_event/dual/zx_77/action/casting.act` / `casting1.act` | 16154 | `ActionObject/Monster/New_Event/Assault_Missile0.obj`。 | 两个上游 action 均在 FRAME4/6 创建 16154，创建块为空 particle、level `1`、固定方向、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`；辅助对照额外有 `timespiral/zx_77` 入边，不能覆盖主目标。 |
| `monster/newmonsters/new_event/dual/zx_77/action/attack.act` / `attack1.act` | 16157 | `ActionObject/Monster/New_Event/Hgoblin_Laser.obj`。 | 两个上游 action 均在 FRAME2 创建 16157，创建块为空 particle、level `1`、POS `15 0 1`、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`；二者差异为 FRAME0 设置 LEFT/RIGHT。辅助对照额外有 `timespiral/zx_77` 入边，不能覆盖主目标。 |
| `主目标反向检索（16167）` | 未观察到 `[CREATE PASSIVEOBJECT]` 创建 16167 | `ActionObject/Monster/New_Event/Boss_Command.obj`。 | 16167 闭合到 passiveobject registry、地图静态放置和 source action passive 检查入边；数字表、地图放置和 `[WHICH] [PASSIVE] [IS INDEX]` 不能写成创建证据。 |
| `monster/newmonsters/new_event/dual/dual_face/action/l1_chang_start.act` / `l2_chang_start.act` / `p1_chang_start.act` / `p2_chang_start.act` | 16191 | `ActionObject/Monster/New_Event/EMP.obj`。 | 主目标四个 source action 均在 FRAME0 创建 16191，创建块为空 particle filename、level `1`、pos `798 463 90`、`[USE MAP POS]`；`l1/p1` 设置 RIGHT，`l2/p2` 设置 LEFT。四者后续均检查 16167 passiveobject/Boss_Command，`p1/p2` 还检查 61656/61650 monster registry 目标；这些相邻检查不改变 `[CREATE PASSIVEOBJECT] [INDEX]` 的 passiveobject 路由。辅助对照同四个创建 source 命中，额外两个 skill level-info 数字命中不是创建入口。 |
| `monster/newmonsters/new_event/dual/dual_face/action/p1_zx_69_summon.act` | 16161 | `ActionObject/Monster/New_Event/Zx-69_Dorp.obj`。 | 同一 action 三个行为块创建 16161，创建块均含 `../particle/Down.ptl`、level `1`、随机 POS、warning mark、use map pos、collision group。 |
| `monster/newmonsters/new_event/dual/dual_face/action/p2_zx_69_summon.act` | 16181 | `ActionObject/Monster/New_Event/Zx-69_Dorp1.obj`。 | 同一 action 三个行为块创建 16181，列形同 16161，但随机坐标范围不同。 |
| `monster/newmonsters/new_event/dual/dual_face2/action/zx_69_summon_l.act` / `zx_69_summon_r.act` | 16161 | `ActionObject/Monster/New_Event/Zx-69_Dorp.obj`。 | 主目标两个 action 各三次创建 16161，最后分别设置 LEFT / RIGHT；辅助对照未观察到这两个入边。 |
| `monster/newmonsters/new_event/dual/dual_face/action/l2_missile_l.act` / `dual_face2/action/missile_l.act` | 16163 | `ActionObject/Monster/New_Event/missile_L.obj`。 | 主目标两个 source action 均创建左侧 missile，创建块为空 particle、level `1`；`dual_face` 版本 pos `70 -5 50`，`dual_face2` 版本 pos `50 0 10` 且带 collision group。辅助对照未观察到 `dual_face2` 入边。 |
| `monster/newmonsters/new_event/dual/dual_face/action/l1_missile_r.act` / `dual_face2/action/missile_r.act` | 16166 | `ActionObject/Monster/New_Event/missile_R.obj`。 | 主目标两个 source action 均创建右侧 missile，创建块为空 particle、level `1`；`dual_face` 版本 pos `70 -5 50` 并播放导弹音效，`dual_face2` 版本 pos `50 0 10` 且带 collision group。辅助对照未观察到 `dual_face2` 入边。 |
| `actionobject/monster/new_event/action/missile_stay.act` / `missile_stay1.act` | 16164 | `ActionObject/Monster/New_Event/missile_EXP.obj`。 | 两个 stay action 均在 FRAME47 创建 16164，empty particle、level `80`、pos `0 0 0`、warning mark `0 0 180 2`、use object zpos，随后 `[DESTROY]`；二者 teleport 随机 X 区间不同。 |
| `actionobject/monster/new_event/action/missile_destroy.act` | 16165 | `ActionObject/Monster/New_Event/JeffMissileEXP1.obj`。 | `missile_destroy.act` 在 ZPOS `<= 30` 后创建 16165，empty particle、level `80`、pos `0 0 2`、use my direction、use object zpos、no effect，同一触发后销毁自身。 |
| `actionobject/monster/new_event/action/jeffmissileexp.act` | 35112 / 35113 | `ActionObject/Map/Risk_Dungeon/Cartelcommand/LargeExp.obj` / `sniper_exp.obj`。 | FRAME0 先创建 35112，empty particle、level `0`、pos `0 0 0`、`[USE TARGET TEAM]`；随后创建 35113，empty particle、level `0`、pos `0 0 0`。二者仍按 passiveobject registry 解析，不按 path 前缀猜 registry。 |
| `主目标反向检索（16156）` | 未观察到 `[CREATE PASSIVEOBJECT]` 创建 16156 | `ActionObject/Monster/New_Event/ExpAir.obj`。 | 16156 仅闭合到 passiveobject registry 和物理对象/action/atk/ANI；equipment、event、skill 等同号命中不能写成 PO 创建证据。 |
| `主目标反向检索（16158/16159/16160）` | 未观察到 `[CREATE PASSIVEOBJECT]` 创建 16158 / 16159 / 16160 | `ActionObject/Monster/New_Event/G_main.obj` / `G_main_s.obj` / `G_main1.obj`。 | 三个 ID 仅闭合到 passiveobject registry 和物理对象/action/ANI；equipment、item/event、skill 等同号命中不能写成 PO 创建证据。action 内的 61644/61645/64007/64010/64013 位于 monster check 上下文，不是 passiveobject 下游。 |
| `monster/newmonsters/new_event/dual/tank_landrunner/action/boom2.act` | 16162 | `ActionObject/Monster/New_Event/Stingerex.obj`。 | 主目标 source action 在 FRAME5 创建 16162，创建块为空 particle filename、level `80`、pos `50 0 5`；同一 action FRAME0 设置速度 X/Z `100/50`，FRAME6 自毁。辅助对照额外有 `timespiral/tank_landrunner/action/boom2.act` 同形创建入口，不能覆盖主目标。 |
| `aicharacter/gunner/eltis/action/casting.act` | 11101 | `ActionObject/SPC/Despair_tower/Eltis/Eltis_dummy.obj`。 | 11101 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；该上游只作为 Eltis 链路边界记录，不转入 APC 主线。 |
| `actionobject/spc/despair_tower/eltis/action/eltis_dummy.act` | 11100 | `ActionObject/SPC/Despair_tower/Eltis/Eltis_machine.obj`。 | dummy action 6 个定时触发块创建同一 machine ID，均为空 particle、level `0`、`[USE MAP POS]`，pos 分布为 6 个固定地图点。 |
| `actionobject/spc/despair_tower/eltis/action/eltis_machine_explode.act` | 8498 | `ActionObject/Monster/Lizard_man/Event_Thunder_all.obj`。 | 8498 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 含 `Monster` 不改变 registry，创建后同一行为块执行 `[APPEND HIT] 0 0 0`。 |
| `monster/newmonsters/towerofdespair/cross_axe/action/_casting.act` | 9290 | `ActionObject/SPC/Despair_tower/shouting.obj`。 | `_casting.act` FRAME3 创建 9290，empty particle、level `70`、pos `0 0 50`；源路径是上游 action 边界，当前只作为 passiveobject 创建入口记录，不转入 Monster 主线。 |
| `主目标反向检索（despair_tower/shouting2）` | 未观察到 | `ActionObject/SPC/Despair_tower/shouting2.obj` 仅为物理可读对象。 | `passiveobject/passiveobject.lst` 未观察到 `shouting2.obj` raw path；全 PVF 脚本文本未观察到该 raw path 或 `shouting2.obj` 上游引用；9290 相邻 registry 与 `_casting.act` 均只闭合到 `shouting.obj`，因此不登记为已创建目标。 |
| `monster/newmonsters/towerofdespair/cross_axe/action/casting.act` | 9289 | `ActionObject/SPC/Despair_tower/booldRust.obj`。 | `casting.act` FRAME10-16 通过 7 个行为块创建 9289，empty particle、level `70`、`[USE MAP POS]`，pos 为 `569 170/208/242/287/317/350/380 50`，`[FIX DIRECTION]` 右/左交替；源路径只作为上游 action 边界，不转入 Monster 主线。 |
| `主目标全 PVF 数字检索（9236）` | 9236 | `ActionObject/SPC/Despair_tower/APC_niddle.obj`。 | 9236 只在 passiveobject registry、itemdictionary、replay 和 `skill/mage/void*.skl` 数值表中观察到命中；未观察到 action/key 的 `[CREATE PASSIVEOBJECT]` 入口，保留上游未闭合风险。 |
| `aicharacter/atfighter/roychan/action/niddle_pin.act` | 9237 | `ActionObject/SPC/Despair_tower/APC_niddle2.obj`。 | `niddle_pin.act` FRAME4 创建 9237，particle `../key/shot.ptl`、level `70`、pos `80 0 55`；源路径是 AIC action 边界，当前只登记 PassiveObject 创建入口，不转入 APC 主线。9236 当前未闭合到主目标创建入口。 |
| `aicharacter/swordman/ruho/key/attack2.key` | 9216 | `ActionObject/SPC/Despair_tower/reflect_ball.obj`。 | key 内 `[CREATE PASSIVEOBJECT] [INDEX] 9216` 创建 reflect ball，particle `key/shout.ptl`、level `70`、pos `110 0 100`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`；源路径是 AIC key 边界，当前只登记 PassiveObject 创建入口，不转入 AIC 主线。 |
| `actionobject/spc/despair_tower/action/reflect_ball_destroy.act` | 9217 | `ActionObject/SPC/Despair_tower/eg_bomb.obj`。 | destroy action 的 FRAME2 执行创建行为，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`；FRAME4 执行 `[DESTROY]`。9217 下游 `eg_bomb.act` 未继续创建 passiveobject。 |
| `aicharacter/priest/yeomyung/key/attack38.key` | 9218 | `ActionObject/SPC/Despair_tower/pass_shield.obj`。 | key 内 5 次创建 9218，particle `key/shout.ptl`、level `70`，pos 为 `130 0 60`、`90 30 40`、`90 -30 70`、`50 50 40`、`50 -50 70`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`；源路径是 AIC key 边界。 |
| `aicharacter/priest/yeomyung/key/attack38_1.key` | 9218 | `ActionObject/SPC/Despair_tower/pass_shield.obj`。 | key 内 3 次创建 9218，empty particle、level `70`，pos 为 `-70 0 40`、`-95 45 40`、`-70 -45 40`，并带 `[USE MY DIRECTION]`；与 `attack38.key` 是同一 passiveobject 的不同上游入口。 |
| `aicharacter/priest/yeomyung/key/attack106.key` | 9222 | `ActionObject/SPC/Despair_tower/Attack_shield.obj`。 | key 内 1 次创建 9222，empty particle、level `70`、pos `130 0 70`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`；源路径是 AIC key 边界。 |
| `actionobject/spc/despair_tower/action/attack_shield.act` | 9219 | `ActionObject/SPC/Despair_tower/Attack_shield_eff.obj`。 | `attack_shield.act` 在 `[ON ATTACKSUCCESS]` / `[LAST ACTIVE ATTACKSUCCESS]` 上下文创建 9219，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`；FRAME10 自毁。 |
| `actionobject/spc/despair_tower/action/pass_shield.act` | 9219 | `ActionObject/SPC/Despair_tower/Attack_shield_eff.obj`。 | `pass_shield.act` FRAME8 创建 9219，empty particle、level `70`、pos `-10 1 0`、`[USE OBJECT ZPOS]`，随后自毁；FRAME0 另执行反向和 trigger 切换。 |
| `actionobject/spc/despair_tower/action/defence_shield.act` | 9219 | `ActionObject/SPC/Despair_tower/Attack_shield_eff.obj`。 | 主目标只读观察到 9219 的相邻外部入边，创建位置含 `[RANDOM]` X/Y 与 `[USE OBJECT ZPOS]`；defence owner 未在本桶展开，不能写成 attack/pass shield 桶已完成。 |
| `actionobject/spc/despair_tower/action/trap_defence_shield_stay.act` | 9219 | `ActionObject/SPC/Despair_tower/Attack_shield_eff.obj`。 | 主目标只读观察到 9219 的相邻外部入边，创建位置含 `[RANDOM]` X/Y 与 `[USE OBJECT ZPOS]`，部分分支同块自毁或 shaking；trap/defence owner 未在本桶展开。 |
| `aicharacter/priest/yeomyung/key/attack70.key` | 9221 | `ActionObject/SPC/Despair_tower/defence_shield_bottom.obj`。 | key 内创建 9221，empty particle、level `70`、pos `0 0 0`，并带 `[USE MY DIRECTION]`、`[FIX DIRECTION]`、`[NEUTRAL]`、`[NOT USE OBJECT DIRECTION]`；`action_main.ai` 以 9220 数量检查选择该 key。 |
| `actionobject/spc/despair_tower/action/defence_shield_bottom.act` | 9220 | `ActionObject/SPC/Despair_tower/defence_shield.obj`。 | FRAME4 创建 9220，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`；FRAME0 先传送到自身 basepos，FRAME12 自毁。 |
| `aicharacter/priest/yeomyung/key/attack70_1.key` | 9265 | `ActionObject/SPC/Despair_tower/Star_shield.obj`。 | key 内创建 9265，particle `key/shout.ptl`、level `70`、pos `0 0 0`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`。 |
| `actionobject/spc/despair_tower/action/star_shield.act` | 9264 | `ActionObject/SPC/Despair_tower/M_defence_shield_bottom.obj`。 | FRAME5 一次触发 3 个行为，按地图坐标 `690 168 0`、`426 295 0`、`954 295 0` 创建 9264，均为 empty particle、level `70`、`[USE MAP POS]`。 |
| `actionobject/spc/despair_tower/action/star_shield.act` | 9266 | `ActionObject/SPC/Despair_tower/center_shield.obj`。 | FRAME7 创建 9266，empty particle、level `70`、map pos `690 250 0`，FRAME8 自毁；9266 是同链 center 管理对象。 |
| `actionobject/spc/despair_tower/action/trap_defence_shield_bottom.act` | 9263 | `ActionObject/SPC/Despair_tower/M_defence_shield.obj`。 | FRAME4 创建 9263，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`；FRAME12 切 custom 0。 |
| `actionobject/spc/despair_tower/action/center_shield_stay.act` | 9267 | `ActionObject/SPC/Despair_tower/shield_count.obj`。 | 在 9264 与 20429 检查满足时创建 9267，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`，同块删除 center appendage 并自毁。 |

## 地图 `[passive object]` 放置路由样本

| 上下文 | ID | registry 复核 | 只读结论 |
| --- | ---: | --- | --- |
| `towerofdespair_up/15237despair088.map [passive object]` | 9288 | `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/Despair_tower/gravity_d.obj`。 | 该入口是地图放置块，列形按 `ID X Y Z` 重复，观察到 9288 三处放置；它不是 `[CREATE PASSIVEOBJECT]` 递归链。 |
| `towerofdespair_up/15237despair088.map [passive object]` | 9287 | `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/Despair_tower/gravity.obj`。 | 同一放置块还放置普通 `gravity.obj`；普通版与 `_d` 版对象/action 差异应按各自 owner 展开。 |
| `towerofdespair_up/15237despair088.map [passive object]` | 10387 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Map/towerofdespair/banner_up.obj`。 | 同一地图放置列中的其他 ID 仍走 passiveobject registry；当前只作为同块路由边界记录，不展开 mapobject 支线。 |

| `towerofdespair_up/15231despair082.map [passive object]` | 9291 | `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/Despair_tower/summon_marcelo.obj`。 | 该入口是地图静态放置块，列形按 `ID X Y Z` 重复；同图 `[ai character]` 块放置 20435。它不是 `[CREATE PASSIVEOBJECT]` 递归链。 |
| `towerofdespair_down/15178despair049.map [passive object]` | 9940 | `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/Despair_tower/sogno_hit.obj`。 | 该入口是地图静态放置块，列形按 `ID X Y Z` 重复；观察到 `9940 600 319 0`，同图 `[ai character]` 块放置 15414。它不是 `[CREATE PASSIVEOBJECT]` 递归链。 |
| `new_eventmap2/x(x,x)boss_dungoen.map [passive object]` | 16167 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Boss_Command.obj`。 | 该入口是地图静态放置块，列形按 `ID X Y Z` 重复；观察到 `16167 600 227 0`。它不是 `[CREATE PASSIVEOBJECT]` 递归链。 |
| `twin_raid_boss/x(x,x)boss_dungeon.map [passive object]` | 16167 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Boss_Command.obj`。 | 该入口同样是地图静态放置块；观察到 `16167 742 298 0`。辅助对照当前未观察到该放置入口，只作目标集差异提示。 |

结论：`[CREATE PASSIVEOBJECT] [INDEX]` 的正确流程是“先按 passiveobject registry 解析；未命中则记录为未闭合风险”，不是用数字外形或上下文猜出目标。

## 上下文路由样本

| 上下文 | ID | 验证 |
| --- | ---: | --- |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 56139 | passiveobject registry 未命中；`monster/monster.lst` 命中。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 64013 | passiveobject registry 未命中；`monster/monster.lst` 命中。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 61150 | passiveobject registry 未命中；`monster/monster.lst` 命中。 |
| `[WHICH] [ALL MONSTER TEAM] ... [IS INDEX]` | 601 | `monster/monster.lst` 命中；同号在 passiveobject registry 也命中其他对象，但本上下文走 monster。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 8679 | passiveobject registry 命中。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 51201 | passiveobject registry 命中。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 60007 | passiveobject registry 命中。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 16167 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Boss_Command.obj`；这是 source action 检查上下文，不是创建入口。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 61644 / 61645 / 61649 / 61653 | `monster/monster.lst` 命中；这些 ID 位于 Boss_Command action 的 monster 检查上下文，不按 passiveobject registry 解释。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 61644 / 61645 | `monster/monster.lst` 命中；这些 ID 位于 `G_main.act` / `G_main1.act` 的 monster 检查上下文，决定自毁分支，不是 passiveobject 创建或检查目标。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 64007 / 64010 / 64013 | `monster/monster.lst` 命中；这些 ID 位于 `G_main_s.act` 的 monster 检查上下文，决定自毁分支，不按 passiveobject registry 解释。 |
| `[LAST ATTACKSUCCESS] [IS INDEX]` | 61772 / 61776 / 61777 / 61779 | `monster/monster.lst` 命中 antitankgun 相关条目；这些 ID 位于 `JeffMissileEXP.act` 的攻击成功检查上下文，只用于 checkup object 分支，不按 passiveobject 下游解释。 |
| `[SUMMON MONSTER] [INDEX]` | 61650 / 61656 | `monster/monster.lst` 命中 `Zx-18 机器人` 相关条目；这些 ID 位于 Zx-69_Dorp last action 的召唤上下文，不按 passiveobject registry 解释。 |
| `[WHICH] [AI CHARACTER] ... [IS INDEX]` | 10902 | `aicharacter/aicharacter.lst` 命中 `gunner/eltis/eltis.aic`；不走 passiveobject 或 monster registry。 |
| `[SUMMON APC] [INDEX]` | 20435 | `aicharacter/aicharacter.lst` 命中 `priest/marcelo/marcelo.aic`；不走 passiveobject 或 monster registry。 |
| `[WHICH] [AI CHARACTER] ... [IS INDEX]` | 20435 | `aicharacter/aicharacter.lst` 命中 `priest/marcelo/marcelo.aic`；同一 ID 可同时用于 action 检查和地图 `[ai character]` 放置上下文。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 23052 | `passiveobject/passiveobject.lst` 命中 `Character/Mage/MegaDrillReady.obj`。 | `sogno_hit.act` 中该 ID 位于 PASSIVE 检查上下文，不是创建块；它用于检查附近 passiveobject 数量/距离，运行时选中哪个对象和是否触发需实机验证。 |
| `[WHICH] [AI CHARACTER] ... [IS INDEX]` | 15414 | 主目标 `aicharacter/aicharacter.lst` 命中 `magician/sogno/sogno.aic`；同一 ID 还在 `towerofdespair_down/15178despair049.map` 的 `[ai character]` 块放置。 | `sogno_hit.act` 的上下文明确是 AI CHARACTER，所以不按 passiveobject 或 monster 解释。辅助对照中 15414 还与 map/passiveobject registry 发生 ID 碰撞，只能作目标集差异提示。 |

结论：不要把所有 `[INDEX]` 或 `[IS INDEX]` 裸数字统一按 passiveobject 解析；父块和 `[WHICH]` 上下文决定 registry 路由。

## 召唤 Monster 与碰撞 ID 样本

| 上下文 | ID | 正确 registry | 只读结论 |
| --- | ---: | --- | --- |
| `ador/Destroy.act [SUMMON MONSTER] [INDEX]` | 601 | `monster/monster.lst` | 601 命中 `Spirit/FireSpirit.mob`；同号在 passiveobject registry 命中 mapobject，但召唤块不按 passiveobject 解释。 |
| `ador/Destroy.act [CREATE PASSIVEOBJECT] [INDEX]` | 40002 | `passiveobject/passiveobject.lst` | 40002 命中 `Common/FireExplosion.obj`；同号在 monster registry 命中其他 `.mob`，但创建块不按 monster 解释。 |

## 未闭合

- 当前账本是样本闭合，不是 1653 个创建块全量闭合。
- 空 `[INDEX]` 和省略 `[INDEX]` 的内联创建列形在当前 `passiveobject/` SearchScript 范围未观察到；`[INDEX]` 下直接随机 ID 候选已有主目标样本，但不是全量穷尽。
- 主目标已观察到 registry 未解析的高位创建 ID 样本；未命中时必须保留风险，不得反推路径。
- 创建链中的 `[SUMMON MONSTER]`、`[CHECKUP]`、`[DIM]`、`[CASTING]` 等只记录结构，不解释运行触发和时序。
- 后续全量工具需要记录已访问 ID、`.obj`、`.act`，遇到重复时停止递归并标为静态回环。

