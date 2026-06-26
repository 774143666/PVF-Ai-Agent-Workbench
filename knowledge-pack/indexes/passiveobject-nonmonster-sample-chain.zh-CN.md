# PassiveObject 非 Monster 样本链路索引

状态：需验证

本文件记录目标 PVF 只读观察到的 passiveobject registry 与非 Monster 专项样本链。它用于告诉 Agent 怎么查 `.obj -> .act/.ani/.atk`，不证明运行伤害、碰撞、同步、卡肉或客户端资源完整。

## 入口边界

| 入口 | 结论 | 注意 |
| --- | --- | --- |
| 数字 ID | 必须通过 `passiveobject/passiveobject.lst` 解析。 | 数字不能按形状猜类型；registry 未命中时保持未解析。 |
| registry raw path | 解析后形成 `passiveobject/<rawPath>`。 | raw path 前缀可能是 `MapObject`、`Character` 或 `Monster`，但 registry 类型仍是 passiveobject。 |
| 直接 `.obj` 内部路径 | 可通过文件清单和读取确认文件存在。 | 没有 registry 行时，不要反推出一个数字 ID。 |
| 辅助对照 PVF | 只能写成“辅助对照同样观察到”或“目标集观察”。 | 辅助对照 registry 条数更多，不能把辅助独有 ID 当成主目标结论。 |

## Registry 样本

| ID | registry | 解析后对象 | 观察到的结构入口 | 边界 |
| ---: | --- | --- | --- | --- |
| 221 | `passiveobject/passiveobject.lst` | `passiveobject/MapObject/BreakableObject/Barrel.obj` | `[width]`、`[floating height]`、`[layer]`、`[pass type]`、`[basic motion]`、`[int data]`、`[string data]`、`[name]` | `MapObject` 是 raw path 前缀，不是另一个 registry。 |
| 2722 | `passiveobject/passiveobject.lst` | `passiveobject/Character/Common/OlympicFairyShield.obj` | `[layer]`、`[pass type]`、`[piercing power]`、`[basic motion]`、`[etc motion]`、`[attack info]`、`[int data]` | Character 前缀样本说明 passiveobject 可承载角色公共对象。 |
| 344 | `passiveobject/passiveobject.lst` | `passiveobject/Monster/Skeleton/FallingStone1.obj` | `[width]`、`[basic motion]`、`[attack info]`、`[int data]`、`[name]` | 这是 passiveobject registry 命中，不等同于 monster registry；当前不扩展 Monster 语义。 |

## Direct Path 样本链

| 起点 | 下游 | 目标观察 |
| --- | --- | --- |
| `passiveobject/actionobject/act8/map/pirateship/pirate_ship_bomb.obj` | `[basic action]` -> `action/bomb.act` | `.act` 内有 `[MOTION] ... [/MOTION]`，包含 `[BASE ANI]`、`[SUB ANI]`、`[SOUND] ... [/SOUND]`。 |
| 同上 | `[attack info]` -> `attackinfo/exp_attack.atk` | `.atk` 中观察到 `[damage]`、`[attack type]`、`[attack enemy]`、`[attack friend]`、`[elemental property]`、`[damage reaction]`、`[attack direction]`、`[hit info]`。 |
| 同上 | `bomb.act [BASE ANI]` -> `../animation/ATExpNormal.ani` | 二进制 ANI 可反编译；多个帧中观察到 `[ATTACK BOX]` 六数值列。 |
| 同上 | `bomb.act [SUB ANI]` -> `../animation/ExpNormal.ani` | 样本只观察到图像、位置、比例、延迟、透明度等表现字段；不代表所有 SUB ANI 都没有攻击盒。 |
| `passiveobject/actionobject/act8/map/pirateonthetrain/itempouch.obj` | `[etc action] ... [/etc action]` | 闭合块内可列多个动作路径。 |
| `passiveobject/character/thief/boneshield.obj` | `[basic motion]` -> `Animation/BoneShield/blank.ani` | 二进制 ANI 可反编译；该样本只观察到空图像、位置、图形效果和延迟，没有观察到攻击盒。 |
| 同上 | `[etc motion] ... [/etc motion]` | 闭合块内列出 6 个动作 ANI；同一对象的不同 motion 不应互相继承 hitbox 结论。 |
| 同上 | `[etc motion]` -> `Animation/BoneShield/bone_none.ani` | 样本观察到循环、图像、位置、插值和延迟；没有观察到攻击盒。 |
| 同上 | `[etc motion]` -> `Animation/BoneShield/bone_rotate_none.ani` | 样本 5 帧均观察到 `[ATTACK BOX]` 六数值列。 |
| `passiveobject/actionobject/act8/map/pirateonthetrain/enginecover_crochan2.obj` | `[basic action]` -> `Action/enginecover_crochan2.act` -> `[BASE ANI]` -> `../Animation/_enginecover_2.ani` | 二进制 ANI 可反编译；样本 3 帧均观察到 `[DAMAGE BOX]` 六数值列。 |
| 同上 | `[attack info]` -> `AttackInfo/BoneShield.atk` | `.atk` 中观察到 `[attack type] [magic]`、`[elemental property] [none element]`、`[damage reaction]`、`[hit wav]`、`[hit info]`，且有 `[pvp] ... [/pvp]` 覆盖块。 |
| `passiveobject/common/action/golgothunder.act` | `[BASE ANI]` -> `../Animation/GolgoThunder.ani` | 二进制 ANI 可反编译；前段帧观察到 `[ATTACK BOX]` 六数值列，后段样本未观察到攻击框。 |
| `passiveobject/common/action/golgothunder_item.act` | `[BASE ANI]` -> `../Animation/GolgoThunder.ani` | 与 `golgothunder.act` 共用同一 BASE ANI。 |
| `passiveobject/common/action/golgothunder_summon.act` | `[BASE ANI]` -> `../Animation/dumy.ani`；多个 `[CREATE PASSIVEOBJECT] INDEX 48306` | `dumy.ani` 未观察到盒字段；48306 回 passiveobject registry 命中 `Common/Golgosoul_item.obj`。 |
| `passiveobject/common/action/title_mega.act` | `[BASE ANI]` -> `../Animation/Title_mega.ani` | 二进制 ANI 可反编译；样本帧观察到 `[ATTACK BOX]` 六数值列；同 `.act` 的 `[SUB ANI]` 指向 `Title_mega_vibration.ani`，未观察到盒字段。 |
| `passiveobject/common/action/title_mega_drop.act` | `[BASE ANI]` -> `Title_mega_drop.ani`；`[SUB ANI]` -> `Title_mega_drop_effect.ani`；创建 62100 | BASE/SUB ANI 均未观察到盒字段；62100 回 passiveobject registry 命中 `Common/Title_mega.obj`。 |
| `passiveobject/mapobject/breakableobject/actionbrazier.obj` | `[basic motion]` -> `Animation/LightStick/BrazierFront.ani` | mapobject 可由 `.obj` 直连 ANI；该 basic motion 样本观察到 `[DAMAGE BOX]` 六数值列。 |
| 同上 | `[etc motion]` -> `BrazierBack.ani` / `BrazierLight.ani` | 两个 etc motion 样本可反编译，未观察到盒字段；同一对象不同 motion 不继承 hitbox 结论。 |
| `passiveobject/mapobject/breakableobject/actionfountain.obj` | `[basic motion]` -> `Fountain.ani`; `[etc motion]` -> `FountainDamage.ani` 等 5 个 ANI | `Fountain.ani` 与 `FountainDamage.ani` 有 `[DAMAGE BOX]`；destroyed / water / glow 类样本未观察到盒字段。 |
| `passiveobject/mapobject/breakableobject/actionstonepillar.obj` | `[basic motion]` -> `StonePillar0.ani`; `[etc motion]` -> `StonePillar1.ani` | basic motion 有 `[DAMAGE BOX]`；etc motion 未观察到盒字段。 |
| `passiveobject/mapobject/breakableobject/eventbarrier_1.obj` | `[basic motion]` -> `EventBarrier.ani`; `[etc motion]` -> `EventBarrierFire.ani` | basic 与 etc motion 均有 `[DAMAGE BOX]`，同帧可出现多条 damage box。 |
| `passiveobject/mapobject/breakableobject/actiontorchilght.obj` | `[basic motion]` -> `TorchlightFront.ani`; `[etc motion]` -> `TorchlightBack.ani` / `TorchlightLight.ani` | basic motion 有 `[DAMAGE BOX]`；back / light motion 未观察到盒字段。 |
| `passiveobject/mapobject/breakableobject/darkflower.obj` | `[basic motion]` -> `DarkFlowerBaseStone.ani`; `[etc motion]` -> `DarkFlower0.ani` 抽样 | basic motion 有 `[DAMAGE BOX]`；抽样 etc motion 未观察到盒字段。 |
| `passiveobject/actionobject/act8/map/seatrainretaking/action/brokenwindow1.act` | `[BASE ANI]` -> `window_1.ani`; `[SUB ANI]` -> `window_2.ani` / `broken_1.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段。 |
| `passiveobject/actionobject/act8/map/seatrainretaking/action/torch.act` | `[BASE ANI]` -> `BrazierFront.ani`; `[SUB ANI]` -> `BrazierBack.ani` / `fire.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段；路径与 mapobject LightStick 同名文件不同。 |
| `passiveobject/actionobject/act8/map/seatrainretaking/action/merman.act` | `[BASE ANI]` -> `merman.ani`; `[SUB ANI]` -> `merman1.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段。 |
| `passiveobject/actionobject/act8/map/seatrainretaking/action/gt96002.act` | `[BASE ANI]` -> `gt96002.ani`; `[SUB ANI]` -> `Dust2.ani` / `Dust3.ani` / `Dust.ani` | BASE ANI 有 `[DAMAGE TYPE] SUPERARMOR` 和 `[DAMAGE BOX]`；SUB ANI 未观察到盒字段。 |
| `passiveobject/character/mage/action/fluorecolliderstart.act` | `[BASE ANI]` 与 `[SUB ANI]` -> `FluoreCollider/create_body*.ani`、`create_wheel.ani`、`create_area.ani`；第 12 帧创建 90010005 | 多个 start ANI 可反编译，样本未观察到盒字段；90010005 在主目标 registry 未命中，不能猜目标对象。 |
| `passiveobject/character/mage/action/fluorecolliderstay.act` | `[BASE ANI] stay_body.ani`；大量 `[SUB ANI]`；`[SUB ANI WITH XYZ] thunder_spark.ani / thunder3.ani / light_magic_gate1.ani` | `stay_body.ani` 有 `[DAMAGE BOX]`；抽样 `stay_lightning_rod.ani`、`thunder_spark.ani` 未观察到盒字段。 |
| `fluorecolliderstay.act` | `[DELAY DO BEHAVIOR]` 后创建 90010006；monster 区域检查后创建 90010007；另创建 90010009 | 三个高位 ID 在主目标 registry 未命中；90010007 创建块带 `[USE OBJECT ZPOS]` 与 `[FOLLOWING TARGET]`。 |
| `fluorecolliderend.act` | 同一行为块三次创建 23055，位置为 `0 0 0`、`30 0 40`、`-30 0 70` | 23055 回 passiveobject registry 命中 `Character/Mage/FluoreColliderNoneExplosion.obj`。 |
| `FluoreColliderNoneExplosion.obj` | `[basic motion] ../../Common/Animation/NoneExplosion.ani`; `[attack info] FluoreColliderNoneExplosion.atk`; `[string data]` 四个粒子路径 | `NoneExplosion.ani` 是空图像帧但有 `[ATTACK BOX]`；`.atk` 记录 magic/light/enemy 和长 damage reaction 参数。 |
| `passiveobject/character/mage/action/atconvergencecannonexplosion.act` | `[BASE ANI] ../Animation/ATConvergenceCannon/Explosion/Explosion_Dodge.ani`; `[SUB ANI]` 空块；0 到 8 帧触发 `[ATTACKRECT] [RESET]` | 主目标 BASE ANI 直接读取未命中，不能判断 hitbox；辅助同路径 ANI 有攻击盒但只能作为差异观察。 |
| `passiveobject/character/common/olympicfairyshield.obj` | `[basic motion]` -> `Animation/OlympicFairyShield.ani`; `[etc motion]` -> `OlympicFairyShieldAttack.ani` / `OlympicFairyShieldWarning.ani` | 三个 ANI 样本均观察到 `[ATTACK BOX]`；同一对象的 basic / etc motion 仍需分别读。 |
| 同上 | `[attack info]` -> `AttackInfo/OlympicFairyShield.atk` | `.atk` 只观察到攻击、敌我、反应、stuck 等结构字段；未提供 hitbox 坐标。 |
| `passiveobject/character/common/fireexplosioncreater.obj` | `[basic action]` -> `Action/FireExplosionCreater.act` -> `[BASE ANI] FireExplosionCreater.ani` | 父对象 ANI 可反编译但未观察到盒字段；该 action 在行为块内创建 48198。 |
| 同上 | `[CREATE PASSIVEOBJECT] INDEX 48198` -> `passiveobject/common/fireexplosionitemattack8.obj` -> `[basic motion] FireExplosion.ani` | 48198 回 passiveobject registry 命中；下游 `FireExplosion.ani` 观察到 `[ATTACK BOX]` 六数值列。 |
| `passiveobject/character/fighter/atenergyball.obj` | `[basic motion] ATEnergyBall.ani`; `[etc motion] EnergyBallExp.ani / ATEnergyBallCharge.ani` | basic 与 charge ANI 有 `[ATTACK BOX]`；exp ANI 仅部分帧有 `[ATTACK BOX]`。 |
| 同上 | `[attack info] ATEnergyBall.atk`; `[etc attack info] ATEnergyBallExp.atk / ATEnergyBallCharge.atk` | `.atk` 字段记录攻击属性和反应；hitbox 仍以对应 ANI 帧为准。 |
| `passiveobject/character/gunner/atnapalmbomb.obj` | `[basic motion] ATNapalmBomb/Bullet.ani`; `[etc motion] Area1.ani / Area2.ani` 抽样 | 三个 owner-listed ANI 均可反编译，样本未观察到盒字段。 |
| `passiveobject/character/gunner/atsteyrfireexplosion.obj` | `[basic motion] ../../Common/Animation/FireExplosion.ani` | owner 通过相对路径借用 common ANI；该 ANI 有 `[ATTACK BOX]`。 |
| `passiveobject/actionobject/act8/map/pirateship/pirate_ship.obj` | `[basic action] -> action/pirate_ship.act` | 父 `.obj` 带时间销毁条件；action 的 BASE/SUB ANI 未观察到盒字段，但 action 创建 8770。 |
| 同上 | `pirate_ship.act -> INDEX 8770 -> fire.obj -> fire.act -> INDEX 8755 -> pirate_bomb_drop.obj -> pirate_bomb_drop.act -> INDEX 8778` | 三个创建 ID 均回 passiveobject registry 命中；末层 8778 指向已知 `pirate_ship_bomb.obj`。 |
| `pirate_ship.act` | `[DO BEHAVIOR] [ME] [RANDOM SELECT]` 与多个 `[SET SPEED]` 行为 | 这里的随机值是行为编号候选；速度设置不替代 hitbox 判断。 |
| `fire.act` | `[CREATE PASSIVEOBJECT] INDEX 8755`，创建块内带 `[WARNING MARK]` | 预警标记是创建参数，不是攻击框。 |
| `pirate_bomb_drop.act` | `[ZPOS] [<=] 40` 后创建 8778 并 `[DESTROY]` | 落地检查和销毁结构不等于爆炸 hitbox；需跟到 8778 下游。 |
| `passiveobject/actionobject/monster/3headlessknight.obj` | `[basic action] -> Action/3headlessknight.act` | 父对象走 action，父 BASE `empty_00.ani` 未观察到盒字段。 |
| 同上 | `[CREATE PASSIVEOBJECT] INDEX 48163 -> passiveobject/monster/headlessknight/horse_item.obj` | 48163 回 passiveobject registry 命中；raw path 含 `Monster/` 不改变 registry 路由。 |
| `horse_item.obj` | `[basic motion] Ani/Horse.ani`; `[attack info] AttackInfo/Horse_item.atk` | `Horse.ani` 有 `[ATTACK BOX]`；`.atk` 有 `[absolute damage]` 等攻击字段，但不提供盒坐标。 |
| `actionobject/monster/powerstation/kohlepowerstation/fitz/boom.obj` | `[basic action] Action/boom.act`; `[attack info] attackinfo/boom.atk`; `[object destroy condition] [time limite] 7000` | owner 相对 `.atk` 解析到 fitz 目录物理文件，`.atk` 为 `[absolute damage] 4500` 与 burn 七数值列；`boom.act [BASE ANI] -> boom.ani`，`FRAME021` 到 `FRAME025` 有攻击框。 |
| `actionobject/monster/powerstation/kohlepowerstation/slime/boom.obj` | `[basic action] Action/boom.act`; `[attack info] attackinfo/boom.atk`; `[object destroy condition] [time limite] 7000` | owner 相对 `.atk` 解析到 slime 目录物理文件，`.atk` 为 `[damage bonus] 100` 与 burn 七数值列；`boom.act [BASE ANI] -> boom01.ani` 有攻击框，`[SUB ANI] -> boom02.ani` 未观察到盒字段。 |
| `equipmentpassiveobject/requiem/003/boom.obj` | `[basic action] Action/boom.act`; `[attack info] attackinfo/boom.atk`; `[object destroy condition] [time limite] 7000` | owner 相对 `.atk` 解析到 requiem/003 目录物理文件，`.atk` 为 `[damage bonus] 100` 与 burn 七数值列；`boom.act` 的 BASE `boom01.ani` 有攻击框，SUB `boom02.ani` 未观察到盒字段。 |
| `requiem/003/boom.act` | 第 10 帧行为 0 为 `[DESTROY]`；另有 `[WHICH] [LAST ATTACKSUCCESS] [DO BEHAVIOR] [CHECKUP OBJECT] 1` | 行为 1 是 `[APPENDAGE] 7000`，附加 `[equipment physical defense] [%] -10` 与 `[equipment magical defense] [%] -10`；只证明静态附加状态结构，不证明实机防御变化公式。 |
| `actionobject/monster/chiefmong/boom.obj` | `[basic action] Action/Boom.act`; `[attack info] AttackInfo/Boom.atk`; `[piercing power] 10000` | owner 相对 `.atk` 解析到 chiefmong 目录物理文件，`.atk` 为 physic/dark 与 `[active status] [curse] 100 70 5000 30 200 20 200`；`Boom.act [BASE ANI] -> Boom.ani` 前 3 帧有攻击框，`[SUB ANI] -> Boom2.ani` 未观察到盒字段。 |
| `actionobject/monster/chiefmong/boom_flu.obj` | `[basic action] Action/Boom2.act`; `[attack info] AttackInfo/Boom2.atk`; `[piercing power] 10000` | owner 相对 `.atk` 解析到 chiefmong 目录 `boom2.atk`，`.atk` 为 `[absolute damage] 500`、physic/dark、无 `[active status]`；`Boom2.act [BASE ANI] -> Boom3.ani`，`FRAME001` 到 `FRAME003` 有攻击框。 |
| `actionobject/monster/powerstation/kohlepowerstation/slime/boom2.obj` | `[basic action] Action/boom.act`; `[attack info] attackinfo/boom2.atk`; `[object destroy condition] [time limite] 7000` | owner 相对 `.atk` 解析到 slime 目录 `boom2.atk`；`.atk` 同时有 `[damage] 3000`、`[absolute damage] 500`、`[damage bonus] 100` 与 burn 七数值列，hitbox 仍来自同目录 `boom.act/boom01.ani`。 |
| `equipmentpassiveobject/requiem/003/boom2.obj` | `[basic action] Action/boom.act`; `[attack info] attackinfo/boom2.atk`; `[object destroy condition] [time limite] 7000` | owner 相对 `.atk` 解析到 requiem/003 目录 `boom2.atk`；`.atk` 为 `[damage bonus] 2900` 与 slow 五数值列，hitbox 仍来自同目录 `boom.act/boom01.ani`。 |
| `actionobject/monster/timegate/conflagration/umtara/boom.obj` | `[basic action] Action/boom.act`; `[attack info] AttackInfo/boom.atk`; `[object destroy condition] [on end of animation]` | owner 相对 `.atk` 解析到 umtara 目录物理文件，`.atk` 为 `[damage bonus] 600`、magic/no element，未观察到 `[active status]`；`boom.act [BASE ANI] -> boom_dodge.ani` 前 8 帧有攻击框，`[SUB ANI] -> boom_normal.ani` 未观察到盒字段。 |
| `actionobject/monster/advancealtar/icestalactite.obj` / 根级 `icestalactite.obj` | `[basic action] Action/Icestalactite.act`; `[etc action] Action/IcestalactiteBroken.act`; `[last action] Action/IcestalactiteBroken.act`; `[hp max] 80000`; `[hp destroy] 1`; `[team] 100` | 两个 owner 共用根级 action/ANI，且对象不挂 `.atk`。`Icestalactite.ani` FRAME000 有 attack/damage box、FRAME001 只有 damage box；`IcestalactiteBroken.ani` 四帧未观察到盒字段。 |
| `actionobject/monster/advancealtar/rocket.obj` / 根级 `rocket.obj` | `[basic action] Action/Rocket.act`; `[attack info] AttackInfo/Rocket.atk`; 空闭合 `[etc action]`; `[last action] Action/RocketBlast.act`; `[hp max] 8000`; `[hp destroy] 1` | 两个 rocket owner 共用根级 action/atk/ANI；`Rocket.ani` 两帧均有 attack box。`Rocket.atk` 还被 book1 和 miatalonsmall 复用，不能当 rocket 专属字段解释。 |
| `actionobject/monster/advancealtar/rocketblast.obj` / 根级 `rocketblast.obj` | `[basic action] Action/RocketBlast.act`; `[attack info] AttackInfo/RocketBlast.atk`; `[piercing power] 1000`; `[team] 100` | 两个 rocketblast owner 共用根级 blast action/atk/ANI；`RocketBlast1.ani` 与 `RocketBlast2.ani` 均有 attack box。`Action/RocketBlast.act` 同字符串在其他目录也出现，必须按 owner 目录解析物理文件。 |
| `actionobject/monster/advancealtar/rocketman_missile.obj` / 根级同名对象 | `[basic action] Action/RocketMan_Missile.act`; `[attack info] AttackInfo/RocketMan_Missile.atk`; `[int data] 2000 5000` | 两个 owner 共用根级 action/atk/ANI；`RocketMan_Missile.ani` 每帧都有 attack/damage box。根级 `rocketman_missile2.obj` 共用 action 但换成 `RocketMan_Missile2.atk`。 |
| `actionobject/monster/advancealtar/rocketman_rocket1.obj` / `rocketman_rocket11.obj` 与根级同名对象 | `rocket1 -> Action/RocketMan_Rocket1.act`; `rocket11 -> Action/RocketMan_Rocket11.act`; 二者均挂 `AttackInfo/RocketMan_Rocket1.atk` | `rocket1.act` 创建 8174 `RocketMan_Rocket2.obj`；`rocket11.act` 检查 monster 61235 后创建 10281 `RocketMan_Rocket22.obj`。 |
| `actionobject/monster/advancealtar/rocketman_rocket2.obj` / `rocketman_rocket22.obj` 与根级同名对象 | `rocket2 -> Action/RocketMan_Rocket2.act + RocketMan_Rocket2.atk`; `rocket22 -> Action/RocketMan_Rocket22.act + RocketMan_Rocket22.atk`; 均有 team `50` | 二者共用 `RocketMan_Rocket2.ani`，并创建 8030 `RocketBlast.obj`；`.atk` damage bonus 不同，不能合并 payload。 |
| `actionobject/monster/advancealtar/rocketmanwarningmark.obj` / 根级同名对象 | `[basic action] Action/RocketManWarningMark.act`; `[homing]` use `1`, follow `[ENEMY]`, velocity `600 5`, check gap `200` | warningmark 不挂 `.atk`，ANI 未观察到盒字段；主目标该 action 字符串还有 c_event owner，辅助对照 owner 更多，必须按目标区分。 |
| `actionobject/monster/advancealtar/arrow_lv1-4.obj` | 四个对象共享 `[basic action] Action/Arrow.act`，分别挂 `AttackInfo/Arrow_Lv1-4.atk`，对象层 width / floating height / layer / pass type / team 同构。 | raw path 含 `actionobject/monster` 仍属于 passiveobject 文件树；本小桶没有创建 ID。shared action 还被 `act8/monster/arrow.obj` 引用，必须限定 owner；四个 `.atk` owner 在主目标各只命中对应等级对象。 |
| `passiveobject/actionobject/common/bigboom.obj` | `[basic action] -> Action/BigBoom.act`; `[attack info] -> AttackInfo/BigBoom.atk` | `.obj` 同时挂 action 与 `.atk`；`.atk` 有绝对伤害和敌友目标字段，但不提供盒坐标。 |
| 同上 | `BigBoom.act [BASE ANI] -> Bigboom1.ani` | `FRAME001` 到 `FRAME003` 观察到 `[ATTACK BOX]` 六数值列。 |
| 同上 | `BigBoom.act [SUB ANI] -> Bigboom2.ani / Bigboom3.ani / AntiairUpperQuake.ani / AntiairUpperQuake2.ani` | 四个 SUB ANI 均可反编译，样本未观察到盒字段。 |
| `BigBoom.act` | `[CHECK PARTYMEMBERS STATE]`、`[LOCK QUEST UNTIL]`、`[ATTACKRECT] [RESET]`、`[TRIGGER QUESTEVENT]`、`[SEND DO BEHAVIOR]` | 行为/任务/队伍状态字段不等于 hitbox；仍以 ANI 帧级盒字段为准。 |
| `passiveobject/actionobject/spc/4season/hp_create.obj` | `[basic action] -> Action/empty.act -> INDEX 11008 / 11009` | 11008 / 11009 回 passiveobject registry 命中 `fairy_ok.obj` / `fairy_bad.obj`；管理对象自身不挂 `.atk`。 |
| `passiveobject/actionobject/spc/4season/fairy_ok.obj` / `fairy_bad.obj` | `[basic action] fairy_small_ok/bad.act`; `[attack info] body.atk`; `[etc action] fairy_small_des_ok/bad.act` | ok/bad 结构同构，共用 `.atk`；basic action 的 BASE `fairy.ani` 有 `[ATTACK BOX]`。 |
| `fairy_small_ok.act` / `fairy_small_bad.act` | `[ON ATTACKSUCCESS] -> [RESTORE] [HP] 10 / -10 [%]`; `[SET ACTION] [CUSTOM] 0 [NOW]` | 恢复/扣血行为和动作切换是 action 结构；不等于 hitbox。 |
| `passiveobject/actionobject/spc/_cannontrap/body.obj` | `[basic action] Body.act`; `[last action] Destroy.act`; `[etc action] AttackMonster.act / AttackCharacter.act`; `[sound category]` | trap 对象同时有生命周期、受击、动作切换、发射物创建和声音类别字段。 |
| `_cannontrap/Body.act` | `[ON DAMAGE] [LAST ATTACKER] [IS TEAM] [CHARCTER TEAM]` 后 `[SET ACTION] [CUSTOM] 0 [NOW]` | token 拼写按 PVF 原样保留；队伍检查不等于 `.atk` 敌我规则。 |
| `_cannontrap/AttackMonster.act` / `AttackCharacter.act` | 创建 `INDEX 8044 -> ActionObject/SPC/_Cannonball/Body.obj` | 两个攻击 action 均创建同一下游发射物；`AttackCharacter.act` 额外按 `MONSTER TEAM` / `CHARCTER TEAM` 分支切换 custom action。 |
| `_cannonball/Body.act` | `ZPOS <= 0` 或 `[ON ATTACKSUCCESS]` 后创建 `INDEX 8846 -> ActionObject/Common/SmallBoom3.obj` | 发射物可在落地或攻击成功后进入 common 爆炸对象。 |
| `passiveobject/actionobject/spc/jackie/frenken_ball.obj` | `[basic action] Ball_Throw.act`; `[attack info] Ball_Bomb.atk`; `[is hp by difficulty] 1` | 对象可同时有血量、难度血量入口、action 和 `.atk`；命中仍需看 ANI。 |
| `jackie/Ball_Throw.act` | 文件内有创建 16071 的行为块；`ZPOS <= 10` 后执行创建 16070 与销毁行为；第 0 帧设置随机 X/Y 速度 | 16071 / 16070 均回 passiveobject registry 命中同一 Jackie 子桶对象；落地触发与速度公式需实机。 |
| `jackie/Ball_Count.act` | 第 3 帧创建 16071 并销毁 | 倒数对象可进入爆发对象。 |
| `jackie/Ball_Bomb.act` | 按 `[WHICH] [MONSTER] [IS INDEX]` 和距离检查创建 9950 或 8580 | 检查的 61606-61609 / 61136 走 monster registry；创建的 9950 / 8580 走 passiveobject registry。 |
| `jackie -> 9950` | `ActionObject/Monster/cartelcommand/robot.obj -> Action/robot.act -> robot.ani / die_eff2.ani` | 9950 下游对象不挂 `.atk`，BASE/SUB ANI 未观察到盒字段；路径中的 `Monster` 是 passiveobject/actionobject 内部前缀，不等同于 Monster 主线。 |
| `jackie/Ball_Bomb.atk` | `[damage bonus] -40`、`[attack type] [magic]`、`[fire element]`、`[active status] [lightning] 100 60 2000 200` | `.atk` 记录攻击信息和状态入口；不提供盒坐标。 |
| `jackie` ANI 抽样 | `Ball_Throw.ani`、`Ball_Count.ani` 有 `[DAMAGE BOX]`；`Ball_count_e.ani`、`ball.ani`、`ball_bomb.ani`、`ball_edge*.ani` 未观察到盒字段 | 同一 action 的 BASE/SUB 视觉层不能互相继承 hitbox。 |
| `jackie -> 8580` | `ActionObject/Common/BigBoom2.obj -> BigBoom2.act -> _Bigboom1.ani` | 8580 下游 common 爆炸 BASE ANI 有 `[ATTACK BOX]`；SUB `_Bigboom2/_Bigboom3` 未观察到盒字段。 |
| `lizardman/SummonStoneBody.act` | 同一行为块创建 8568 并 `[SUMMON MONSTER] [INDEX] [RANDOM SELECT] 61129-61133` | 8568 走 passiveobject registry，命中 `ActionObject/Common/GuardianGrenadeNoneBomb.obj`；61129-61133 走 `monster/monster.lst`。 |
| `lizardman -> 8568` | `GuardianGrenadeNoneBomb.obj -> GranadeExplosion.act / GuardianGrenadeExplosion.atk -> GrenadeNoneBomb.ani` | `.atk` 给 magic/no element/down 等攻击信息；`GrenadeNoneBomb.ani` 前 7 帧有攻击框，effect SUB 无盒。 |
| `guardiangoblin -> 8568` | `realspearjail1/2`、`spearjail`、`spearjail3`、`spearjailready` 均观察到 8568 入边 | 这些 source action 多处还创建 8561；两个 ID 都走 passiveobject registry，但下游 raw path 不同。 |
| `despair_tower/sjar/sjar_coin_bom.obj` | `[basic action] sjar_coin_bom_appear.act`; `[etc action] sjar_bom_ok.act / sjar_bom_bad.act`; `[team] 100` | coin 本体不挂 `.atk`；ok/bad 行为在 etc action 内。 |
| `sjar_bom_ok.act` | `[RANDOM SELECT] 0 1` 后创建 9202，创建参数可见 `[FIX DIRECTION]`、`[USE MAP POS]` | 9202 回 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZDrop.obj`。 |
| `sjar_bom_bad.act` | FRAME1 限次触发 `[RANDOM SELECT] 0 1` 后多次创建 8376；第一行为 3 个 level `70` 创建块，第二行为 5 个创建块且首块 level `0`、其余 level `70`；每块 `[POS]` 下有 `[RANDOM] 20 300` 与 `[RANDOM] 0 70 -120`，并有 `[USE MY BASEPOS]`、`[USE OBJECT ZPOS]`、`[USE MY DIRECTION]`。 | 8376 回 passiveobject registry 命中 `ActionObject/Trap/MinePressure2.obj`；这是跨到 trap 前缀。 |
| `sjar_summon_ok.act` / `sjar_summon_bad.act` | `[SUMMON MONSTER] [INDEX] [RANDOM SELECT]` 分别列出多组 monster ID | 这些候选全部走 `monster/monster.lst`；不按 passiveobject 创建 ID 解释。 |
| `sjar -> ZDrop -> ZGT -> ZMissile -> ZMissileExp` | 9202 创建 9203，9203 创建 9204，9204 在落地或攻击成功后创建 9206 | 多层链均按 passiveobject registry 逐级解析；中间多个 ANI 未观察到盒字段，末层 `JeffMissileEXP.ani` 有 `[ATTACK BOX]`。 |
| `MinePressure2` 下游 | `MineStay2.act` 近角色时切换 custom action；`MineActive2.act` FRAME1 创建 8375，level `60`、pos `0 0 0`，随后自毁；8375 为 `Common/MineExplosion2.obj`。 | `MineAlram2.ani` FRAME000/001 均有 `[ATTACK BOX] -16 -10 -6 31 20 20`；下游 `FireExplosion.ani` FRAME000 有 `[ATTACK BOX] -65 -40 -50 130 80 100`；`MinePressureReady2/Active2.ani` 和爆炸粒子 SUB ANI 未观察到盒字段。 |
| `passiveobject/actionobject/spc/_newhell/agaress_hell/Action/darkfireshoot.act` | `[INDEX] [RANDOM SELECT] 16031 / 16052 / 16053`；`[POS]` 下两个 `[RANDOM]` 参数块 | 三个候选均走 passiveobject registry；位置随机参数不是 ID。 |
| `Agaress_Hell/darkfire1/2/3.obj` | 同构对象：各自 `[basic action] darkfire1/2/3.act`、共用 `Damage.atk`、on-end animation 销毁、`[team] 100` | 三个 BASE ANI 均有 `[ATTACK BOX]`；三个 SUB ANI 未观察到盒字段；主目标 `[name]` 是字符串链接样。 |
| `Agaress_Hell/darkfire1/2/3.act` | `[ON ATTACKSUCCESS] [LAST ATTACKSUCCESS] [SAVE TARGET OBJECT] 0` 后创建 16051 | 16051 回 passiveobject registry 命中 `darkfire4.obj`；攻击成功触发仍需实机验证。 |
| `Agaress_Hell/darkfire4.obj` | `darkfire4.act`、`darkfire.atk` | `darkfire4.ani` 有 `[ATTACK BOX]`；`darkfire4sub.ani` 未观察到盒字段；action 内 `[RANDOM SELECT] 1..9` 是行为编号，不是 ID。 |
| `passiveobject/actionobject/monster/timegate/TimeLord/Cube_L.obj` | `[basic action] Cube_loop.act`；`[etc action] Cube_EX.act` | Cube 两个 action 可闭合到 `Cube.ani` / `Cube_EX.ani`；样本 ANI 未观察到盒字段，但 `Cube_EX.act` 有 team 检查、appendage、append hit、flash screen 与 destroy 行为。 |
| `passiveobject/actionobject/monster/timegate/TimeLord/Chain.obj` | `[basic action] Chain_start.act`；创建 16080 | 16075 与 16080 均回 passiveobject registry；`Chain_start.act` 在 `ZPOS >= 400` 条件后创建 `Chain2.obj` 并销毁。 |
| `passiveobject/actionobject/monster/timegate/TimeLord/Chain2.obj` | `[basic action] Chain_action.act`；`[etc action] Chain_attack_loop.act / Chain_attack_damage.act / Chain_destroy.act`；`[attack info] Chain.atk` | 下游对象同时有多 action、对象级 `.atk` 与 action 内 `[DEFAULT ATTACKINFO] Chain_stay.atk`；多个 BASE/SUB ANI 有 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `Chain_attack_loop.act` | `[WHICH] [MONSTER] [IS INDEX] 64013`；`[CHECKED NO] [<] 1`；`[ATTACKRECT] [RESET]` | 64013 走 `monster/monster.lst` 命中 Andres；检查和攻击矩形重置均为 action 结构，不按 passiveobject 创建 ID 或 ANI hitbox 坐标解释。 |
| `passiveobject/actionobject/monster/timegate/TimeLord/magic_L.obj` | `[basic action] magic_L.act -> magic_L.ani` | `magic_L.ani` 可反编译但未观察到盒字段；该对象不挂 `.atk` 且 action 第 10 帧销毁。 |
| `passiveobject/actionobject/monster/Blood_An/Action/darkfireshoot.act` | `[INDEX] [RANDOM SELECT] 8718 / 8719 / 8720` | 三个候选均走 passiveobject registry，分别命中 `darkfire1.obj` / `darkfire2.obj` / `darkfire3.obj`；源 BASE/SUB ANI 未观察到盒字段。 |
| `Blood_An/darkfire1/2/3.obj` | 同构对象：`[basic action] darkfire1/2/3.act`、共用 `Damage.atk`、on-end animation 销毁、`[team] 100` | 三个 BASE ANI 均有 `[ATTACK BOX]`；三个 SUB ANI 未观察到盒字段。 |
| `Blood_An/darkfire1/2/3.act` | `[ON ATTACKSUCCESS] [LAST ATTACKSUCCESS] [SAVE TARGET OBJECT] 0` 后创建 8725 | 8725 回 passiveobject registry 命中 `darkfire4.obj`；攻击成功触发仍需实机验证。 |
| `Blood_An/darkfire4.obj` | `darkfire4.act`、`darkfire.atk` | `darkfire4.ani` 有 `[ATTACK BOX]`；`darkfire4sub.ani` 未观察到盒字段；action 内 `[RANDOM SELECT] 1..9` 是行为编号，不是 ID。 |
| `passiveobject/actionobject/monster/Grim/Grim_seeker/Action/fire2.act` | `[INDEX] [RANDOM SELECT] 8679 / 8680`；后续 `[WHICH] [MONSTER] [IS INDEX] 61150` | 8679 / 8680 走 passiveobject registry；61150 走 monster registry，两个上下文不能混用。 |
| `Grim_seeker/FireReady.obj` / `FireReady2.obj` | 8679 的 `[basic action] Fire2.act`，8680 的 `[basic action] Fire3.act`；共用 `FireBall.atk` | 8679 是静态可回返分支，8680 进入不再创建 passiveobject 的 `Fire3.act`；`Fire2.ani` 有 `[ATTACK BOX]`。 |
| `Grim_seeker/Action/fire2_r.act` | `[INDEX] [RANDOM SELECT] 9136 / 9137` | 两个候选走 passiveobject registry；9136 静态回到 `Fire2_r.act`，9137 进入 `Fire3.act`。 |
| `Grim_seeker/FireBall.atk` / `FireBall_r.atk` | 普通分支 `[attack type] [magic]`，骑乘分支 `[attack type] [physic]`；二者都有 `[fire element]` 与 `[active status] [burn]` | `.atk` 记录攻击属性和状态入口；命中盒坐标仍来自 `Fire2.ani`。 |
| `actionobject/monster/gashengrigun/ez8_1.obj` | `[basic action] Action/EZ8_2.act`；`[etc action] Action/Boom2.act`；不挂 `.atk` | owner 的 basic/chain hitbox 均来自 action/ANI；`.obj` 本体不提供 attackinfo 字段。 |
| `gashengrigun/action/boom2.act` | `[BASE ANI] ../Animation/Boom2.ani`；第 2 帧 `[WHICH] [CHARACTER]` 后创建 `INDEX 8588` | 8588 已回 passiveobject registry 命中 `Monster/ZealotRebirth/NenGuard_1.obj`；`Boom2.ani` 为 `[DAMAGE BOX]` 正样本。 |
| `monster/zealotrebirth/nenguard_1.obj` | `[basic motion] Ani/NenGuard.ani`；`[etc motion] NenGuardFloor.ani / NenGuardEffect.ani`；`[attack info] AttackInfo/NenGuard.atk`；`[int data] 4000 12000 200` | `NenGuard.ani` 多帧有多条 `[DAMAGE BOX]`；etc motion 未观察到盒字段；`.atk` 有 `[active status] [blind] 0 0 0 0 0` 五数值列。 |
| `actionobject/monster/gashengrigun/ez8.obj` | `[basic action] Action/EZ8.act`；`[etc action] Action/Boom.act`；不挂 `.atk` | `EZ8.act` 的 CountDown/Stay2 有 `[DAMAGE BOX]`；`Boom.act` 创建 8794，需继续回 passiveobject registry。 |
| `gashengrigun/action/boom.act -> 8794` | `[BASE ANI] ../Animation/Boom.ani`；第 2 帧创建 `INDEX 8794` | 8794 命中 `ActionObject/Common/BigBoom4.obj`；源 `Boom.ani` 为 `[DAMAGE BOX]`，下游 `_Bigboom4.ani` 有 `[ATTACK BOX]`。 |
| `gashengrigun/gasbomb.obj -> GasBomb.act -> 8591` | `GasBomb.ani` 有 `[ATTACK BOX]`；action 创建 8591 | 8591 命中本前缀 `SleepingGas.obj`；创建目标挂 `Gas.atk` 与 `SleepSmoke.ani`。 |
| `gashengrigun/sleepinggas*` | `sleepinggas` / `sleepinggas2` / `sleepinggas3_weapon` 分别挂 `Gas.atk` / `Gas2.atk` / `Gas3_weapon.atk` | 三个 `.atk` 均为 no element、none reaction、`CONDITION_SLEEP`、`[sleep]` 三数值列；hitbox 来自 `SleepSmoke.ani` 或 `SleepSmoke4.ani`。 |
| `gashengrigun/g3*` | `Attack*.act` 内 `[SUMMON MONSTER]` 61134/61137 | `_Round*.ani` 未观察到盒字段；召唤 ID 走 `monster/monster.lst`，不按 passiveobject 创建 ID 解释。 |
| `gashengrigun/summonrx78.obj -> Summon.act` | 同一行为块创建 8561 并召唤 61136 | 8561 走 passiveobject registry；61136 走 monster registry。 |
| `actionobject/monster/at_5t_walker/rocket1.obj` | `[basic action] Action/rocket1.act`；`[attack info] AttackInfo/rocket1.atk` | 路径含 `monster` 但对象 ID 10262 位于 passiveobject registry；当前核心创建链从该 owner 的 action 开始。 |
| `at_5t_walker/rocket1.act -> 10263` | `ZPOS >= 350` 后三次 `[CREATE PASSIVEOBJECT] [INDEX] 10263`，粒子路径分别为 rocket/rocket1/rocket2 | 10263 走 `passiveobject/passiveobject.lst`，命中同前缀 `rocket2.obj`；三次创建不是三个不同 ID。 |
| `at_5t_walker/rocket2.act -> 10267 + 61236` | `ZPOS <= 20` 后创建 10267；攻击成功检查 `[IS INDEX] 61236` 后 `[RESTORE] [HP] -1 [%]` | 10267 走 passiveobject registry，61236 走 `monster/monster.lst`；同一 action 内两个数字上下文不同，不能混用 registry。 |
| `at_5t_walker/rocketboom.obj` / `rocketboom1.obj` | 两个物理对象共用 `Action/rocketboom.act`，分别挂 `JeffMissileEXP.atk` / `JeffMissileEXP1.atk`，均有 `[time limite] 1000` 销毁条件 | 当前样本解析到的创建目标是 10267 `rocketboom.obj`；`rocketboom1.obj` 是同目录 sibling 和 owner 字符串命中，不写成该链已创建目标。 |
| `at_5t_walker/rocket*.act/.atk/.ani` | `Action/rocket1.act`、`Action/rocket2.act`、`Action/rocketboom.act` 和 `AttackInfo/JeffMissileEXP*.atk` 在主目标其他 owner 中也出现 | 这些相对路径必须从当前 owner 目录解析；不能把地图、equipmentpassiveobject 或其他 actionobject owner 的同名文件合并。 |
| `at_5t_walker/fire.obj` / `bullet.obj` / `bullet1.obj` | 路径含 `actionobject/monster`，但对象均位于 passiveobject 文件树；`fire` 销毁条件为动画结束，`bullet` 有 etc action `hit.act`。 | 这是 PassiveObject 主线样本，不把路径中的 `monster` 当 Monster registry。 |
| `at_5t_walker/BombingMissile.act -> 10284` | `ZPOS <= 30` 后 `[CREATE PASSIVEOBJECT] [INDEX] 10284`，随后 `[DESTROY]`。 | 10284 走 `passiveobject/passiveobject.lst`，命中 `ActionObject/Monster/at_5t_walker/rocketboom1.obj`；这是区别于 rocket 子链的独立创建分支。 |
| `at_5t_walker/Exp.act -> 8715` | FRAME1 创建 8715，FRAME0 攻击成功检查 61236 后扣血。 | 8715 走 passiveobject registry，命中 `ActionObject/Monster/Giselle/GiselleFloor.obj`；61236 走 monster registry。 |
| `at_5t_walker/Bullet.act` / `Bullet1.act` | `[CHECKUP OBJECT] [RANDOM SELECT]` 下出现 1-9 或 0-8。 | 这些数字在 checkup object 上下文中不是 `.lst` ID，不能当 passiveobject 创建目标。 |
| `at_5t_walker/Exp.act -> GiselleFloor` | 8715 下游跨到 `Giselle/GiselleFloor.obj`，再闭到 `Floor.act` / `Floor_attack.atk` / `ExpFloorNormal.ani`。 | 跨 owner 仍在 passiveobject registry 内；不是 Monster 主线扩展。 |
| `at_5t_walker/special.obj -> special.act` | 对象挂 `Action/special.act`，`[attack info]` 为空；action 初始化移动、速度和时间变量。 | 对象无 `.atk` 不等于链路无攻击，必须继续看 action 创建下游。 |
| `at_5t_walker/special.act -> 10268` | 2 秒条件后 16 次创建 10268，创建块含随机地图位置、`[USE MAP POS]` 与 `[WARNING MARK]`。 | 10268 走 passiveobject registry，命中同前缀 `BombingMissile.obj`；随机列和预警表现不由静态只读解释运行单位。 |
| `special -> 10268 -> 10284 + 61236` | 10268 下游 `BombingMissile.act` 继续创建 10284，并在攻击成功后检查 61236。 | 10284 走 passiveobject registry；61236 走 monster registry。同一静态链内数字上下文不同。 |
| `at_5t_walker/barr*` | 三个对象均为 blocking / hp destroy 样本，basic motion 直连 ANI，空 attackinfo。 | raw path 含 `actionobject/monster` 仍属于 passiveobject 文件树；对象自身不走 monster registry。 |
| `barr* [can beat index] 61235` | 61235 回 `monster/monster.lst` 命中 AT-5T。 | 该数字按字段上下文走 monster registry；主目标 passiveobject registry 未命中。 |
| `at_5t_walker/destroy/destroydust/shootsmoke` | destroy action 只播放 particle；dust/smoke basic motion 直连表现 ANI。 | 三者 `.atk` 为空且未观察到创建 ID；表现层无盒不能外推到其他同名 owner。 |
| `advancealtar/bomb_lv1-4.obj` | 四个对象共享 `Action/bomb.act`，分别挂 `Action/bomb1_Lv1-4.act` 和 `AttackInfo/bomb_Lv1-4.atk`；对象 ID 为 12601 / 12643 / 12644 / 12645。 | `Action/bomb.act` 是跨 owner 字符串，必须按当前 owner 目录解析；父对象 `.atk` 伤害为 `2000 / 3000 / 4000 / 5000`，hitbox 来自 `bomb.ani` / `bomb1.ani`。 |
| `advancealtar/action/bomb1_lv1-4.act -> 12600/12646/12647/12648` | FRAME6 创建下游 passiveobject，empty particle、level `0`、pos `0 0 -30`，随后 `[DESTROY]`。 | 四个 ID 走 `passiveobject/passiveobject.lst`，分别命中 `ActionObject/Monster/AdvanceAltar/LgExp_Lv1-4.obj`；raw path 含 `Monster` 不改变 registry。 |
| `advancealtar/lgexp_lv1-4.obj -> LgExp.act` | 下游对象共用 `Action/LgExp.act`，分别挂 `FireExplosion_Lv1-4.atk`，并有 `[object destroy condition] [on end of animation]`。 | `FireExplosion_Lv1-4.atk` 伤害为 `4000 / 6000 / 9000 / 19000`；`FireExplosion.ani` 三帧都有攻击盒。 |
| `advancealtar/catpul_bomb*.obj` | 12621 / 12623 / 12625 / 12627 回 passiveobject registry 命中四个父弹对象；四者共享或分级挂 `Action/catpul_bomb*.act`、`Action/*catpul_bomb1.act` 和 `AttackInfo/catpul_bomb.atk`。 | 父弹 `.atk` 伤害 `5000`，对象同构为 width `5 5`、floating height `1`、pass all、piercing power `1000`、team `100`；hitbox 来自 linked `BombFly`、`CannonBall(_boom)`、`Fireball(_eff)` 与 `bomb1` 等 ANI。 |
| `advancealtar/action/*catpul_bomb1.act -> 12622/12624/12626/12628` | 四个落地 action 在 FRAME6 或 FRAME3 创建 `catpul_BombSub*`，创建块为空 particle、level `0`、pos `0 0 -10`，随后 `[DESTROY]`。 | 四个 ID 走 `passiveobject/passiveobject.lst`；sub `.atk` 伤害为 `8000 / 10000 / 19000 / 29000`，盒坐标来自 `catpul_EarthQuake(_S).ani` 等 linked ANI。 |
| `advancealtar/action/3catpul_bombsub.act -> 12634 OilExp` | FRAME4 创建 12634 `OilExp.obj`，FRAME10 销毁；`OilExp.obj` 挂 `Action/OilExp.act` 与 `AttackInfo/catpulStinger.atk`。 | `OilExp.act` FRAME1/3/5/7/9/11 执行 `[ATTACKRECT] [RESET]`，FRAME13 `[DESTROY]`；`catpulStinger.atk` 伤害 `4500`，`ExpFloorNormal.ani` FRAME001-012 有攻击盒。 |
| `advancealtar/probomb_lv1-4.obj` | 12615 / 12674 / 12675 / 12676 回 passiveobject registry 命中四个父弹对象；对象只挂 basic action，不挂 `[attack info]`。 | 父对象同构为 normal layer、pass all、piercing power `1000` 与 name；父层 `ProBomb*.ani` 未观察到盒字段，不能写成父层有 hitbox。 |
| `advancealtar/action/probomb_lv1.act + 2/3/4probomb.act -> 12616/12677/12678/12679` | 四个 action 均在 `ZPOS <= 10` 后创建 `LgExp2_Lv1-4`，创建块为空 particle、level `0`、pos `0 0 0`，随后 `[DESTROY]`。 | 四个 ID 走 `passiveobject/passiveobject.lst`；`4ProBomb.act` 实际链接 `3ProBomb.ani`，不是 `4ProBomb.ani`。 |
| `advancealtar/lgexp2_lv1-4.obj -> LgExp.act` | 下游对象共用 `Action/LgExp.act`，分别挂 `FireExplosion.atk`、`FireExplosion1.atk`、`FireExplosion2.atk`、`FireExplosion3.atk`，并有 `[object destroy condition] [on end of animation]`。 | 下游 `.atk` 伤害为 `13000 / 16000 / 20000 / 30000`；`FireExplosion.ani` 三帧都有攻击盒。`Action/LgExp.act` 和 `FireExplosion.atk` 存在跨 owner 复用，必须限定当前 owner。 |
| `advancealtar/zepplinbullet_lv1-4.obj` | 12614 / 12680 / 12672 / 12673 回 passiveobject registry 命中四个子弹对象；对象直接挂 `animation/Bullet.ani` 与 `AttackInfo/Bullet_Lv1-4.atk`。 | 四个对象同构为 width `1 1`、floating height `1`、pass all、piercing power `0`；`Bullet.ani` 五帧都有攻击盒，四个 `.atk` 同构为 `-80` damage bonus、ignore defense、weapon damage apply `1`、no element、blow。 |
| `goblin_propeller/lv1-4_shootup_stay*.act -> 12614` | 主目标 8 个 `monster/newmonsters/advancealtar/tower/goblin_propeller` 射击 action 创建 12614 `ZepplinBullet_Lv1.obj`，创建块使用 `../Particle/Bullet.ptl`、level `0`、pos `90 0 -50` 与 `100 -10 -50`。 | 同一主目标子树未观察到 12680 / 12672 / 12673 创建入口；Lv2-4 只能写成 registry 与对象可解析，不能写成当前创建链已使用。 |
| `advancealtar/denture3_lv1-4.obj` | 12593 / 12668 / 12669 / 12670 回 passiveobject registry 命中四个齿击对象；对象挂 `Action/denture3.act` 与 `attackinfo/denture2_Lv1-4.atk`，并以 `[time limite] 20000` 销毁。 | `denture2_Lv1-4.atk` 伤害为 `15000 / 20000 / 26000 / 40000`，同构 payload 含 physic、no element、blow、slow `100 70 2500 25 25`；`denture2.ani` 两帧都有攻击盒，`teeth1-4.ani` 只是粒子显示帧。 |
| `knifetooth/bite2_lv1-4.act -> 12593/12668/12669/12670` | 主目标 `monster/newmonsters/advancealtar/friend/knifetooth/action/bite2_lv1-4.act` 分别创建四个 denture3 分级对象，创建块使用 `../Particle/denture.ptl`、level `0`、pos `90 0 80`。 | 辅助对照额外存在 `advanceatlar` 拼写路径，并观察到该辅助分支 Lv1 casting 为 `900`；这只能作为辅助差异，不能覆盖主目标正确拼写链的 casting `300`。 |
| `advancealtar/iceniddle.obj` | 12606 回 passiveobject registry 命中 `ActionObject/Monster/AdvanceAltar/Iceniddle.obj`；对象挂 `Action/Iceniddle.act` 与 `AttackInfo/Iceniddle.atk`。 | `.atk` 伤害 `3000`，payload 含 physic、water element、hit down、blow；`Iceniddle.ani` FRAME002-010 有攻击盒，`Iceniddle_Glow.ani` 无盒，action 在 FRAME3/5/8/10 执行 `[ATTACKRECT] [RESET]`，FRAME14 销毁。 |
| `keraha/vinoshu cast*.act -> 12606` | 主目标 `monster/newmonsters/advancealtar/enemy/keraha` 与 `.../vinoshu` 的 `cast.act` / `cast1.act` 创建 12606；`cast.act` 创建 1 次，`cast1.act` 创建 4 次。 | 创建块为空 particle、level `0`、warning mark `0 0 100 1`；`cast1.act` 的四次 pos 为 `100/200/300/400 0 0`。辅助对照额外有 `advanceatlar` 拼写路径和技能/creature 数字碰撞，只能作为辅助差异。 |

## 字段列形

| 文件层 | 字段 | 只读观察到的列形 | 注意 |
| --- | --- | --- | --- |
| `.obj` | `[width]` | 两个数值 | 不直接证明实际碰撞体积。 |
| `.obj` | `[floating height]`、`[piercing power]` | 一个数值 | 运行效果需实机。 |
| `.obj` | `[layer]`、`[pass type]` | 一个反引号 token | token 要按原样保留。 |
| `.obj` | `[basic action]`、`[basic motion]`、`[attack info]` | 一个相对路径 | 从当前 `.obj` 所在目录解析。 |
| `.obj` | `[etc action]`、`[etc motion]` | 多路径闭合块 | 必须读取对应 `[/etc action]` 或 `[/etc motion]`。 |
| `.obj` | `[etc attack info]` | 多个 `.atk` 路径或闭合列表 | 与 `[etc motion]` 不自动一一对应；需要按对象上下文逐条读取。 |
| `.obj` | `[int data]`、`[string data]` | 闭合列表 | 只记录结构入口；列含义需专项验证。 |
| `.act` | `[MOTION]` | 闭合块 | 内部可包含 ANI 和声音引用。 |
| `.act` | `[BASE ANI]` | 一个 ANI 路径 | ANI 通常是二进制，需要反编译。 |
| `.act` | `[SUB ANI]` | 路径与坐标/参数成组，闭合块 | 不要假设每个 SUB ANI 都有攻击盒。 |
| `.act` | `[SET SPEED] ... [/SET SPEED]` | 闭合块，内部可见轴向标签与数值。 | 只记录移动设置入口，不解释运动公式。 |
| `.act` | `[WARNING MARK]` | 四个数值，样本位于创建块内。 | 不等于攻击框，也不证明客户端预警显示。 |
| `.act` | `[POS]` + `[RANDOM]` | 样本可见 `[POS]` 后一数值，再接 `[RANDOM]` 三数值。 | 创建位置列形不可固定写死，需要按块读取后续标签。 |
| `.act` | `[ATTACKRECT] [RESET]` | 行为块内空标签组合。 | 只记录重置行为入口，不当作盒坐标。 |
| `.act` | `[CHECK PARTYMEMBERS STATE]` | 后续可见 `[EVEN ONE DEATH]` 或 `[ALL DEATH]`。 | 队伍状态语义需运行验证。 |
| `.act` | `[DEFAULT ATTACKINFO]` | 一个相对 `.atk` 路径。 | action 内也可指定攻击信息；hitbox 仍需看对应 ANI。 |
| `.act` | `[ON ATTACKSUCCESS]`、`[LAST ATTACKSUCCESS]` | 攻击成功触发入口和目标引用。 | 不证明实际命中或恢复/扣血已经发生。 |
| `.act` | `[RESTORE] [HP] ... [%]` | 恢复块内可见 HP 数值和百分比标记。 | 运行效果、正负号语义和公式需实机验证。 |
| `.act` | `[SET TEAM]`、`[IS TEAM]` | 队伍设置与队伍检查字段。 | 不等同最终敌我伤害规则。 |
| `.act` | `[SUMMON MONSTER] ... [/SUMMON MONSTER]` | 闭合块；`[INDEX]` 可接 `[RANDOM SELECT]` 候选。 | 候选走 monster registry，不走 passiveobject registry。 |
| `.act` | `[FIX DIRECTION]`、`[USE MY DIRECTION]`、`[USE MAP POS]`、`[USE MY BASEPOS]`、`[USE OBJECT ZPOS]`、`[FOLLOWING TARGET]` | 创建块内的方向/坐标/目标引用参数。 | 只证明参数存在，不解释坐标系、朝向、追踪或目标选择。 |
| `.act` | `[GET TARGET]`、`[DISTANCE] [LOW]`、`[CHECKUP OBJECT]` | 目标选择和检查对象触发结构。 | 不证明运行时目标一定存在或被选中。 |
| `.act` | `[APPENDAGE]`、`[APPEND HIT]`、`[FLASH SCREEN]` | 行为块内可见持续时间、速度百分比、追加命中与闪屏参数。 | 只证明附加状态/表现结构存在，不解释实机减速、命中或屏幕表现。 |
| `.act` | `[SAVE TARGET OBJECT]` | 后接一个数值。 | 只证明可保存目标对象引用，不证明目标一定存在或后续命中成功。 |
| `.act` | `[SET POS FORCE] ... [/SET POS FORCE]` | 闭合块，内部可见 `[X START]`、`[Y START]`、`[Z START]`、`[MOVE ME]`。 | 只证明强制位置/移动样结构存在，不解释坐标系或位移公式。 |
| `.act` | `[TRIGGER]` + 数值 + `[ON]` / `[OFF]` | 行为块内可见触发器编号开关。 | 只证明 action 可切换触发器状态，不解释运行时开关时序。 |
| `.act` | `[ENABLE] [OFF]` | 触发块内可见禁用状态。 | 只证明触发器可被配置为关闭，不证明何时重新启用。 |
| `.act` | `[SHAKING]`、`[SET FRAME]` | 行为块内震动和帧设置入口。 | 表现和动画跳转效果需运行验证。 |
| `.obj` | `[sound category] ... [/sound category]` | 闭合声音类别列表。 | 不证明客户端音频资源完整或触发时机。 |
| `.obj` | `[is hp by difficulty]` | 一个数值。 | 不解释难度血量缩放公式。 |
| `.atk` | `[damage]`、`[push aside]`、`[lift up]`、`[stuck]` | 数值 | 字段名不等于公式或最终效果。 |
| `.atk` | `[attack type]`、`[elemental property]`、`[damage reaction]`、`[hit info]` | 后续子标签 | 子标签需要按上下文解释。 |
| `.atk` | `[active status]` | 状态子标签后接一组数值参数。 | 只证明攻击信息中有状态入口，不证明触发概率、持续时间或实机效果。 |
| `.atk` | `[pvp] ... [/pvp]` | 闭合覆盖块 | 只能说明目标样本有 PVP 覆盖结构，不证明 PVP 结算规则。 |
| `.ani` | `[ATTACK BOX]` | 样本为六数值列 | 攻击盒存在不等于一定命中或造成伤害。 |
| `.skl/.obj` | `<9::name_数字...>` | 字符串链接 / 名称引用 | `name_数字` 不是 passiveobject ID；需要对象 ID 时仍查 registry。 |

## 残余风险

- 当前样本是静态只读样本，不做实机验证。
- `[DAMAGE BOX]` 已有 linked 正样本，但仍不是全量 ANI 覆盖；不要把单个样本推广为所有 passiveobject 都有受击盒。
- `.ani` 反编译成功只证明该样本可展开；其他二进制 ANI 仍可能失败。
- `.atk` 的元素、伤害、硬直、击退、浮空、命中和 PVP 差异必须结合调用链与实机验证。
- 文件清单和直接读取可确认路径存在；搜索工具漏命中时，应回到 registry 解析、文件清单和精确读取。
- direct path 样本没有 registry 行时，不能反推出数字 ID；当前样本 `name_4375` 在主目标和辅助对照中均未解析为 passiveobject ID。
- 父对象 ANI 未观察到盒字段时，仍要检查 action 行为是否创建下游 passiveobject；下游 ID 必须回 `passiveobject/passiveobject.lst`。
