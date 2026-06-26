# PassiveObject ANI Hitbox 样本账本

状态：需验证

本文记录主目标 PVF 只读观察到的 PassiveObject hitbox 正样本与反样本。它只证明 `.obj/.act/.ani` 静态链路和帧级字段存在，不证明实机命中、伤害、受击、卡肉或同步表现。

治理提示：本账本已超过约 100KB，后续同族大量 frame 坐标不再堆入主样本账本；长明细写入 prefix shard，本账本只保留代表性样本和路由。落账前先读 `passiveobject-ledger-governance.zh-CN.md`。

## 为什么不能只靠搜索

| 入口 | 主目标只读观察 | 结论 |
| --- | ---: | --- |
| `[BASE ANI]` | 5485 | `.act` 到二进制 ANI 的主入口。 |
| `[SUB ANI]` | 2158 | `.act` 到附加 ANI 的入口。 |
| `[MOTION]` | 5481 | 动作块起始标签搜索命中。 |
| `[/MOTION]` | 5485 | 动作块结束标签搜索命中。 |
| `[DAMAGE BOX]` 脚本文本搜索 | 0 | 只能说明脚本文本索引未命中；二进制 ANI 反编译后已有正样本。 |

## 正样本：Attack Box

| 链路 | 帧级观察 | 边界 |
| --- | --- | --- |
| `pirate_ship_bomb.obj -> bomb.act [BASE ANI] -> ATExpNormal.ani` | `FRAME000` 到 `FRAME005` 观察到 `[ATTACK BOX]`，每行六个数值；`FRAME006`、`FRAME007` 样本中未观察到攻击框。 | 攻击框存在不等于一定命中或造成伤害。 |
| `boneshield.obj [etc motion] -> bone_rotate_none.ani` | `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]`，每行六个数值。 | 同一 `.obj` 的其他 motion 不继承该 hitbox 结论。 |
| `common/action/golgothunder.act` / `golgothunder_item.act [BASE ANI] -> GolgoThunder.ani` | `FRAME000` 到 `FRAME005` 观察到 `[ATTACK BOX]`，部分帧同帧多条攻击框；`FRAME006` 到 `FRAME009` 样本未观察到攻击框。 | `common/` 目录多个动作可共用同一 BASE ANI；同一 ANI 后段帧不必都有攻击框。 |
| `common/action/title_mega.act [BASE ANI] -> Title_mega.ani` | `FRAME000` 到 `FRAME038` 均观察到 `[ATTACK BOX]` 六数值列。 | `.act` 中有多段 `[ATTACKRECT] [RESET]` 行为，但 hitbox 结论仍以 ANI 帧级字段为准。 |
| `character/common/olympicfairyshield.obj [basic motion] -> OlympicFairyShield.ani` | `FRAME000`、`FRAME001` 均观察到两条 `[ATTACK BOX]` 六数值列。 | character/common 可由 `.obj [basic motion]` 直连二进制 ANI。 |
| `character/common/olympicfairyshield.obj [etc motion] -> OlympicFairyShieldAttack.ani / OlympicFairyShieldWarning.ani` | 两个 etc motion 样本均观察到 `[ATTACK BOX]` 六数值列。 | 同一对象的 basic / etc motion 必须分别读；本样本中二者都有攻击框。 |
| `character/common/fireexplosioncreater.obj -> fireexplosioncreater.act -> CREATE PASSIVEOBJECT 48198 -> common/fireexplosionitemattack8.obj -> FireExplosion.ani` | 第一层 `FireExplosionCreater.ani` 未观察到盒字段；48198 下游 `FireExplosion.ani` 的 `FRAME000` 观察到 `[ATTACK BOX]` 六数值列。 | 创建管理对象自身无盒不等于整条链无攻击盒；创建 ID 必须回 passiveobject registry。 |
| `character/mage/action/fluorecolliderend.act -> INDEX 23055 -> FluoreColliderNoneExplosion.obj -> Common/Animation/NoneExplosion.ani` | `NoneExplosion.ani` 的 `FRAME000` 是空图像帧，但观察到 `[ATTACK BOX] -65 -45 -50 130 90 100`。 | 空图像不等于无攻击盒；辅助对照同 ANI 也有攻击盒但坐标不同，不能覆盖主目标坐标。 |
| `character/fighter/atenergyball.obj [basic motion] -> ATEnergyBall.ani` | `FRAME000`、`FRAME001` 均观察到 `[ATTACK BOX]` 六数值列。 | fighter 直连 motion 可承载攻击框。 |
| `character/fighter/atenergyball.obj [etc motion] -> EnergyBallExp.ani / ATEnergyBallCharge.ani` | `EnergyBallExp.ani` 的 `FRAME000`、`FRAME002`、`FRAME003` 有 `[ATTACK BOX]`，`FRAME001` 未观察到；`ATEnergyBallCharge.ani` 四帧均有 `[ATTACK BOX]`。 | 同一 etc motion 列表内不同 ANI、不同帧也不能互相继承盒字段。 |
| `character/gunner/atsteyrfireexplosion.obj [basic motion] -> ../../Common/Animation/FireExplosion.ani` | 借用 common 目录 `FireExplosion.ani`，`FRAME000` 观察到 `[ATTACK BOX]` 六数值列。 | 同名/相对路径必须按 owner 目录解析；gunner 对象可引用 common ANI。 |
| `actionobject/monster/powerstation/kohlepowerstation/fitz/boom.obj -> boom.act [BASE ANI] -> boom.ani` | `FRAME021` 到 `FRAME025` 观察到 `[ATTACK BOX]` 六数值列；`FRAME000` 到 `FRAME020`、`FRAME026` 到 `FRAME028` 未观察到攻击框。 | `fitz/boom` 的 action 指向 `boom.ani`，不是同目录不存在的 `boom01/boom02`；hitbox 结论只属于 fitz 物理路径。 |
| `actionobject/monster/powerstation/kohlepowerstation/slime/boom.obj -> boom.act [BASE ANI] -> boom01.ani` | `FRAME000` 到 `FRAME003` 观察到 `[ATTACK BOX] -118 -19 -91 228 38 199`；`FRAME004` 到 `FRAME010` 未观察到攻击框。 | `slime/boom01.ani` 与装备 `boom01.ani` 是不同物理文件；当前观察到同形坐标不等于可跨目录合并。 |
| `equipmentpassiveobject/requiem/003/boom.obj -> boom.act [BASE ANI] -> boom01.ani` | `FRAME000` 到 `FRAME003` 观察到 `[ATTACK BOX] -118 -19 -91 228 38 199`；`FRAME004` 到 `FRAME010` 未观察到攻击框。 | requiem/003 与 slime / equipment boom 的 `boom01.ani` 是不同物理文件；同形坐标仍要按 owner 目录单独闭合。 |
| `actionobject/monster/chiefmong/boom.obj -> Boom.act [BASE ANI] -> Boom.ani` | `FRAME000` 为 `[ATTACK BOX] -31 -10 19 65 20 71`；`FRAME001` 为 `-29 -10 17 60 20 68`；`FRAME002` 为 `-27 -10 12 68 20 84`；`FRAME003` 到 `FRAME007` 未观察到攻击框。 | `AttackInfo/Boom.atk` 与 `Action/Boom.act` 保留大小写；同名 `boom.atk` 不跨 owner 合并。 |
| `actionobject/monster/chiefmong/boom_flu.obj -> Boom2.act [BASE ANI] -> Boom3.ani` | `FRAME001` 为 `[ATTACK BOX] -20 -10 9 40 20 140`；`FRAME002` 为 `-43 -15 0 89 30 187`；`FRAME003` 为 `-45 -20 4 95 40 212`；`FRAME000`、`FRAME004` 到 `FRAME009` 未观察到攻击框。 | `boom_flu.obj` 挂 `AttackInfo/Boom2.atk`，但命中盒仍来自 `Boom2.act` 指向的 `Boom3.ani`。 |
| `actionobject/monster/powerstation/kohlepowerstation/slime/boom2.obj -> boom.act [BASE ANI] -> boom01.ani` | `FRAME000` 到 `FRAME003` 观察到 `[ATTACK BOX] -118 -19 -91 228 38 199`；`FRAME004` 到 `FRAME010` 未观察到攻击框。 | `boom2.obj` 只替换 `.atk` 为 `boom2.atk`，action/hitbox 仍复用同目录 `boom.act/boom01.ani`。 |
| `equipmentpassiveobject/requiem/003/boom2.obj -> boom.act [BASE ANI] -> boom01.ani` | `FRAME000` 到 `FRAME003` 观察到 `[ATTACK BOX] -118 -19 -91 228 38 199`；`FRAME004` 到 `FRAME010` 未观察到攻击框。 | `boom2.obj` 只替换 `.atk` 为 `boom2.atk`，action/hitbox 仍复用 requiem/003 目录 `boom.act/boom01.ani`。 |
| `actionobject/monster/timegate/conflagration/umtara/boom.obj -> boom.act [BASE ANI] -> boom_dodge.ani` | `FRAME000` 到 `FRAME007` 均观察到 `[ATTACK BOX] -82 -10 -71 169 20 150`；`FRAME008`、`FRAME009` 未观察到攻击框。 | `boom_dodge.ani` 是 umtara owner action 的 BASE ANI；hitbox 结论只属于该物理链路。 |
| `actionobject/monster/3headlessknight.obj -> 3headlessknight.act -> INDEX 48163 -> monster/headlessknight/horse_item.obj -> Horse.ani` | 父 action 的 `empty_00.ani` 未观察到盒字段；48163 下游 `Horse.ani` 的 `FRAME000` 到 `FRAME005` 均观察到 `[ATTACK BOX]` 六数值列。 | `actionobject/monster` 和 `passiveobject/monster` 是 passiveobject 路径边界；不等同于 monster registry。 |
| `actionobject/monster/timegate/TimeLord/Chain.obj -> Chain_start.act -> INDEX 16080 -> Chain2.obj -> Chain_action.act [BASE ANI] -> 1chain_start.ani` | `FRAME001` 到 `FRAME004` 观察到 `[ATTACK BOX]`；`FRAME000` 到 `FRAME006` 均观察到 `[DAMAGE BOX]`。 | 16080 走 passiveobject registry；同一 ANI 不同帧的 attack/damage box 仍需逐帧判断。 |
| `actionobject/monster/timegate/TimeLord/Chain2.obj -> Chain_attack_loop.act [BASE ANI] -> chain_sphere_loop.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[ATTACK BOX]` 六数值列。 | loop BASE ANI 有攻击框；不代表同 action 全部 SUB ANI 都同样有或没有盒字段。 |
| `actionobject/monster/timegate/TimeLord/Chain2.obj -> Chain_attack_loop.act [SUB ANI] -> chain_effect_loop.ani / chain_loop_bottom.ani` | 两个 SUB ANI 样本均观察到 `[ATTACK BOX]` 六数值列。 | SUB ANI 也可能承载 hitbox，不能默认写成纯表现层。 |
| `actionobject/monster/timegate/TimeLord/Chain2.obj -> Chain_attack_damage.act [SUB ANI] -> 1chain_damage.ani` | `FRAME000` 到 `FRAME002` 均观察到 `[ATTACK BOX]` 六数值列。 | damage action 的 SUB ANI 可直接承载攻击框；仍不证明实机命中或伤害。 |
| `actionobject/monster/Blood_An/darkfireshoot.act -> [RANDOM SELECT] 8718/8719/8720 -> darkfire1/2/3.obj -> darkfire1/2/3.act [BASE ANI]` | `darkfire1.ani`、`darkfire2.ani`、`darkfire3.ani` 的 `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]` 六数值列。 | `[INDEX]` 下随机候选是 passiveobject ID；候选对象 BASE ANI 有攻击框，不代表源发射 ANI 有框。 |
| `actionobject/monster/Blood_An/darkfire1/2/3.act -> [ON ATTACKSUCCESS] -> INDEX 8725 -> darkfire4.obj -> darkfire4.act [BASE ANI]` | `darkfire4.ani` 的 `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]` 六数值列，并有 `[IMAGE RATE] 0.5 0.5`。 | 8725 是攻击成功后的 passiveobject 下游；运行命中和后续位置切换仍需实机验证。 |
| `actionobject/monster/Grim/Grim_seeker/fire2.act / fire2_r.act -> [RANDOM SELECT] 8679/8680/9136/9137 -> FireReady* -> Fire2.ani` | `Fire2.ani` 的 `FRAME000` 到 `FRAME023` 均观察到 `[ATTACK BOX]` 六数值列；部分帧同帧多条攻击框。 | 8679 / 9136 是静态可回返分支，8680 / 9137 进入 `Fire3.act`；静态回返不证明实机无限创建。 |
| `actionobject/SPC/_NewHell/Agaress_Hell/darkfireshoot.act -> [RANDOM SELECT] 16031/16052/16053 -> darkfire1/2/3.obj -> darkfire1/2/3.act [BASE ANI]` | `darkfire1.ani`、`darkfire2.ani`、`darkfire3.ani` 的 `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]` 六数值列，三者坐标不同。 | `[INDEX]` 下随机候选是 passiveobject ID；源发射 BASE/SUB ANI 未观察到盒字段。 |
| `actionobject/SPC/_NewHell/Agaress_Hell/darkfire1/2/3.act -> [ON ATTACKSUCCESS] -> INDEX 16051 -> darkfire4.obj -> darkfire4.act [BASE ANI]` | `darkfire4.ani` 的 `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX]` 六数值列，并有 `[IMAGE RATE] 0.5 0.5`。 | 16051 是攻击成功后的 passiveobject 下游；运行命中、目标保存、位置切换和销毁仍需实机验证。 |
| `actionobject/common/bigboom.obj -> bigboom.act [BASE ANI] -> Bigboom1.ani` | `FRAME001` 到 `FRAME003` 观察到 `[ATTACK BOX]` 六数值列；`FRAME000`、`FRAME004`、`FRAME005` 样本未观察到攻击框。 | `.act` 中的 `[ATTACKRECT] [RESET]` 是行为字段；hitbox 仍以 ANI 帧级字段为准。 |
| `actionobject/SPC/4season/fairy_ok.obj` / `fairy_bad.obj -> fairy_small_*.act [BASE ANI] -> fairy.ani` | `FRAME000` 到 `FRAME006` 均观察到 `[ATTACK BOX]` 六数值列；帧内还可见 `[LOOP START]` / `[LOOP END]`。 | `[RESTORE] [HP] +/-10 [%]` 是 action 行为字段；攻击框仍来自 ANI。 |
| `actionobject/SPC/_cannontrap/body.obj -> _cannontrap/attack*.act -> INDEX 8044 -> _cannonball/body.obj -> body.ani` | trap 本体 `stay.ani` / `attack.ani` 观察到 `[DAMAGE BOX]`；下游 `_cannonball/body.ani` 的 `FRAME000` 观察到 `[ATTACK BOX]`。 | trap 本体受击/碰撞盒与发射物攻击盒是不同层级。 |
| `_cannonball/body.act -> INDEX 8846 -> actionobject/common/smallboom3.obj -> NapalmBombExplosion.ani` | `FRAME001`、`FRAME002` 观察到 `[ATTACK BOX]`；后段样本未观察到攻击框。 | 发射物落地或攻击成功可创建 common 爆炸对象；运行触发仍需实机验证。 |
| `actionobject/SPC/_firewitch/ador/body.obj -> body.act [BASE ANI] -> body.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[ATTACK BOX] -46 -19 -10 69 38 48`；未观察到 `[DAMAGE BOX]`。 | `.obj` 的 homing 和 `.atk` payload 不替代 ANI hitbox；攻击成功后销毁时序仍需实机验证。 |
| `actionobject/SPC/_firewitch/ador/Destroy.act -> INDEX 40002 -> common/fireexplosion.obj -> FireExplosion.ani` | source `Destroy.ani` 的 7 帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；40002 下游 `FireExplosion.ani` 的空图 `FRAME000` 有 `[ATTACK BOX] -65 -40 -50 130 80 100`。 | 40002 位于 `[CREATE PASSIVEOBJECT]` 内，走 passiveobject registry；空图帧仍可承载攻击框。 |
| `actionobject/SPC/_firewitch/firebreath/body.obj -> Body.act [BASE ANI] -> Body.ani` | `FRAME000` 到 `FRAME017` 均观察到 `[ATTACK BOX]`；`FRAME018`、`FRAME019` 未观察到盒字段。代表坐标：FRAME000 为 `4 -10 -14 64 20 27`；FRAME001 有两条攻击框，其中第二条为 `43 -20 -20 228 40 83`；FRAME004 有四条攻击框，末条为 `157 -64 -95 224 127 190`；FRAME005-017 反复出现四条攻击框组合，首条为 `-7 -20 -28 72 40 53`。 | `Body.act` 的 `[ATTACKRECT] [RESET]` 是行为字段；hitbox 坐标来自 ANI 帧级 `[ATTACK BOX]`。`.atk` 的 fire/magic/push/lift payload 不替代坐标。 |
| `actionobject/SPC/_firewitch/meteo/body.obj` / `horobe1.obj` / `horobe2.obj -> body.act [BASE/SUB ANI]` | BASE `body.ani` 的 `FRAME000` 到 `FRAME002` 均观察到 `[ATTACK BOX] -260 -148 -63 430 285 407`；SUB `glow.ani` 只有 `FRAME007` 观察到 `[ATTACK BOX] -22 -10 -14 35 20 31`。 | 三个 owner 共用同一 action，但分别挂 `attack.atk`、`horobe1.atk`、`horobe2.atk`；`.atk` payload 不替代 ANI hitbox。 |
| `actionobject/SPC/_firewitch/meteo/body_cyclops.obj -> body_Cyclops.act [BASE ANI] -> body_cyclops.ani` | `FRAME000` 到 `FRAME002` 均观察到 `[ATTACK BOX] -87 -60 -42 142 140 168`；`body_Cyclops.act` 当前未观察到 SUB ANI。 | 同前缀存在 `glow_cyclops.ani` 且可读，但主目标 `body_Cyclops.act` 未把它挂成 SUB；不能把同名相邻 ANI 自动接到 action。 |
| `actionobject/SPC/_firewitch/meteo/destroy_cyclops.act -> INDEX 10027 -> actionobject/monster/jeff/bigboom.obj -> BigBoom.act [BASE ANI] -> Bigboom1_1.ani` | source `destroy_cyclops.ani` 未观察到盒字段；10027 下游 `Bigboom1_1.ani` 的 `FRAME000` 到 `FRAME004` 均观察到 `[ATTACK BOX] -120 -10 -20 240 20 260`，`FRAME005` 未观察到攻击框。 | 10027 位于 `[CREATE PASSIVEOBJECT]` 内，走 passiveobject registry；raw path 含 `Monster/` 不改变 registry 路由。 |
| `actionobject/SPC/_bal/body.obj -> body.act [BASE ANI] -> momentaryslash_red_ldodge_upper.ani` | `FRAME000` 到 `FRAME004` 均观察到同一组 `[ATTACK BOX] -284 -77 -13 559 157 70`。 | `body.atk` 是攻击 payload；hitbox 坐标来自 BASE ANI。同一 action 的 SUB under ANI 另读，不能继承 BASE 攻击框。 |
| `actionobject/SPC/_bat/body.obj -> body.act [BASE ANI] -> body.ani` | `FRAME000` 为 `[ATTACK BOX] -11 -13 1 24 25 25`；`FRAME001` 为 `-6 -10 -10 20 20 20`；`FRAME002` 为 `-6 -10 -13 20 20 20`；`FRAME003` 为 `-9 -10 1 20 20 20`。 | 对象 homing 与 `.atk` payload 不替代 ANI hitbox；攻击成功销毁触发和追踪轨迹需实机验证。 |
| `actionobject/SPC/_burnfire/body.obj -> body.act [BASE ANI] -> body.ani` | `FRAME000` 和 `FRAME001` 均观察到同一组 `[ATTACK BOX] -19 -10 -15 32 20 31`；两帧均使用 `Monster/CosmoFiend/Fireball.img` index `0`，第二帧另有 image rate 与 rotate。 | 对象 homing、`.atk [active status]` 和火属性 payload 不替代 ANI hitbox；追踪旋转、状态命中和伤害结算需实机验证。 |
| `actionobject/SPC/_aganzo/action/body.act [BASE ANI] -> body.ani` | `FRAME001` 到 `FRAME003` 均观察到 `[ATTACK BOX] -20 -10 -20 40 20 40`；`FRAME004` 为 `-26 -10 -31 58 20 61`；`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | 本桶未观察到同前缀 `.obj` owner，脚本搜索也未命中 `_aganzo` 引用；只能作为 action-linked ANI 盒字段样本，不能证明运行入口或完整 PassiveObject 对象。 |
| `actionobject/SPC/_darkcough/body.obj [basic motion] -> body.ani` | `FRAME001` 为 `[ATTACK BOX] -30 -20 -10 85 40 58`；`FRAME002` 为 `-30 -20 -10 60 40 48`；`FRAME003` 到 `FRAME008` 均为 `-45 -35 -25 100 70 82`；`FRAME000/009-012` 未观察到盒字段。 | 这是 `.obj [basic motion]` 直连 ANI 样本，不经过 `.act`；`.atk` payload 不提供 hitbox 坐标。 |
| `actionobject/SPC/_cypherelec/cypherelec.obj` / `cypherelec2.obj -> body/body2.act [BASE ANI] -> body.ani` | `FRAME001-003` 均观察到 `[ATTACK BOX] -20 -10 -20 40 20 40`；`FRAME004` 为 `-26 -10 -31 58 20 61`；`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | 两个 owner 共用同一 BASE ANI，但挂不同 `.atk`；`.atk` damage bonus 与 homing 不替代 ANI hitbox。 |
| `actionobject/SPC/_cypherelec/cypherelec_item.obj -> body3.act [BASE ANI] -> body2.ani` | `FRAME001` 为 `[ATTACK BOX] 53 -10 48 40 20 40`，`FRAME002` 为 `54 -10 50 40 20 40`，`FRAME003` 为 `53 -10 50 40 20 40`，`FRAME004` 为 `44 -10 39 58 20 61`，`FRAME005` 为 `35 -10 33 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | item owner 使用偏移版 ANI；静态只读不证明实机命中、追踪轨迹或资源渲染。 |
| `actionobject/SPC/_cyclone/{body,goldteida_effect,short1,short2}.obj -> HurricaneOfJudgement.act [BASE ANI] -> HurricaneOfJudgement.ani` | `FRAME000` 到 `FRAME010` 均观察到 `[ATTACK BOX]`；FRAME000 为单条 `-89 -5 34 38 10 38`，FRAME001 有两条，FRAME002-004 有三条，FRAME005-010 有四条。代表坐标：FRAME005 首条为 `-73 -23 128 138 46 84`，末条为 `-64 -5 2 32 10 33`；FRAME009/010 首条为 `-69 -27 106 160 54 104`。 | 四个 owner 共用同一 BASE ANI，但 attackinfo/homing 参数不同；`.atk` payload 和 homing 不替代 ANI hitbox。 |
| `actionobject/SPC/_cyclone/{short1_1,short2_1}.obj -> HurricaneOfJudgement_opt.act [BASE ANI] -> HurricaneOfJudgement_3.ani -> INDEX 48117` | `HurricaneOfJudgement_3.ani` 为 4 帧空图，FRAME000-003 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；但 opt action 在 FRAME0/1/2 创建 48117，48117 回 registry 命中 `ActionObject/SPC/_Cyclone/Short1.obj`，下游 `Short1.obj -> HurricaneOfJudgement.ani` 有攻击框。 | 空图 opt ANI 不能写成整条链无 hitbox；hitbox 在创建出的下游对象。 |
| `actionobject/SPC/jackie/ball_bomb.act -> INDEX 8580 -> actionobject/common/bigboom2.obj -> _Bigboom1.ani` | `_Bigboom1.ani` 的 `FRAME001` 到 `FRAME003` 观察到 `[ATTACK BOX]`；`FRAME000`、`FRAME004`、`FRAME005` 未观察到攻击框。 | Jackie 爆炸分支可跨到 common 爆炸对象；创建触发来自 monster 检查，运行目标选择需实机。 |
| `actionobject/Trap/MinePressure2.obj -> MineStay2/MineActive2.act [SUB ANI] -> MineAlram2.ani；MineActive2 -> 8375 Common/MineExplosion2 -> FireExplosion.ani` | `MineAlram2.ani` 的 `FRAME000`、`FRAME001` 均观察到 `[ATTACK BOX] -16 -10 -6 31 20 20`；下游 `FireExplosion.ani` 的 `FRAME000` 观察到 `[ATTACK BOX] -65 -40 -50 130 80 100`，`FRAME001` 未观察到盒字段。 | 该 trap 由 sjar bad 分支创建；`MinePressureReady2.ani`、`MinePressureActive2.ani` 与 `FireExplosionParticle1/2/3/4.ani` 未观察到盒字段，`.atk` 只给攻击 payload 不给坐标。 |
| `actionobject/SPC/despair_tower/ZMissileExp.obj -> JeffMissileEXP.act [BASE ANI] -> JeffMissileEXP.ani` | `FRAME000` 观察到 2 条 `[ATTACK BOX]`：`-101 -20 0 204 40 15`、`-70 -30 0 140 60 15`；`FRAME001` 到 `FRAME003` 各观察到 3 条：`-149 -20 0 298 40 30`、`-130 -35 0 260 70 30`、`-90 -45 0 180 90 30`；`FRAME004`、`FRAME005` 未观察到盒字段。 | `ZMissileExp.obj` 的实际引用名为 `JeffMissileEXP`；路径按 `.obj/.act` 引用解析。三个 SUB ANI `JeffMissileEXP1/2/3.ani` 未观察到盒字段。 |
| `actionobject/SPC/icedrop.obj -> IceDrop.act [BASE ANI] -> Blizzard_Big.ani` | `FRAME000` 有 `[ATTACK BOX] -69 -18 79 68 40 115`；`FRAME001` 有两条攻击框 `-40 -28 -16 72 60 145` 与 `-69 -18 79 68 40 115`；`FRAME002` 有 `-40 -28 -16 72 60 145`。 | `IceDrop.atk` 只给 damage/magic/warter/push/lift 等 payload，不提供坐标；hitbox 坐标来自 BASE ANI。 |
| `actionobject/SPC/icedropmanager.act -> INDEX 8023 -> IceDrop.obj -> Blizzard_Big.ani` | manager action 先以 `[WHICH] [PASSIVE] [IS INDEX] 8153` 检查，再创建 8023；manager 自身 `Dummy.ani` 未观察到盒字段，下游 8023 的 IceDrop BASE ANI 有攻击框。 | 管理对象无盒不等于整条链无 hitbox；8023 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，必须走 passiveobject registry。 |
| `actionobject/SPC/runningicedrop.obj -> RunningIceDrop*.act -> INDEX 8023 -> IceDrop.obj` | `RunningIceDropStraight/Up/Down/Random/2.act` 分别创建 8023；`TimeControl.ani` 与 `TimeControl2.ani` 未观察到盒字段，下游 IceDrop 的 `Blizzard_Big.ani` 有攻击框。 | homing owner 和创建出的攻击对象分层记录；追踪参数不替代 ANI hitbox，运行轨迹仍需实机。 |
| `actionobject/SPC/flowermanager.act -> INDEX 8153 -> BreakableObject/IceFlower.obj` | `flowermanager.act` 的 BASE `Dummy.ani` 未观察到盒字段；8153 目标 IceFlower 当前只做最小对象边界复核，未展开其 ANI hitbox。 | 8153 是 passiveobject check/create 边界目标；不把本桶扩写成 BreakableObject 主线。 |
| `actionobject/SPC/_diredirt/body.obj / body2_weapon.obj -> Body.ani` | `Body.ani` 的 `FRAME000` 到 `FRAME003` 均有同形 `[ATTACK BOX] -10 -10 -2 20 20 8`。 | 两个 owner 共用同一个 BASE ANI；`.atk` 的 damage、poison、DISEASE APPENDAGE 不提供坐标。 |
| `actionobject/SPC/_gligexp/body.obj / body3.obj -> Body.act [BASE ANI] -> Exp.ani` | `Exp.ani` 的 `FRAME000` 到 `FRAME004` 均有同形 `[ATTACK BOX] -1080 -360 -87 2101 700 538`。 | `Body.atk` / `Body3.atk` 只给 payload；大范围坐标来自 BASE ANI。 |
| `actionobject/SPC/_gligexp/body2.obj -> Body2.act [BASE ANI] -> Exp2.ani` | `Exp2.ani` 单帧空图有 `[ATTACK BOX] -1080 -360 -87 2101 700 538`。 | 空图仍可带攻击框；是否可见和是否命中需要分开验证。 |
| `actionobject/SPC/_gligexp/Body.act -> INDEX 30550 -> Monster/Spirit/FireExplosion.obj -> FireExplosion.ani` | 30550 下游 `FireExplosion.ani` 单帧空图有 `[ATTACK BOX] -65 -40 -50 130 80 100`。 | 30550 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 含 `Monster` 不改变 registry。 |
| `actionobject/SPC/_cypherobjectfriend/cypherobject*.obj -> attack.act [BASE ANI] -> attack.ani` | `attack.ani` 的 `FRAME000` 到 `FRAME006` 均有同形 `[ATTACK BOX] -24 -10 72 40 20 40`。 | 父对象 `.atk` 只给 physic/no element/down/blow 等 payload；hitbox 坐标来自攻击动作 BASE ANI。 |
| `actionobject/SPC/_cypherobjectfriend/attack.act [SUB ANI] -> attack_glow.ani` | `attack_glow.ani` 的 `FRAME000` 到 `FRAME006` 均有同形 `[ATTACK BOX] -24 -10 72 40 20 40`，但使用 glow 图像和 `LINEARDODGE` 表现。 | SUB ANI 也可自带攻击框；不能假设它继承 BASE，也不能忽略帧级盒字段。 |
| `actionobject/SPC/_cypherobjectfriend/attack.act -> INDEX 8036 -> _CypherElec/CypherElec.obj -> body.ani` | 8036 下游 `body.ani` 的 `FRAME001-003` 为 `[ATTACK BOX] -20 -10 -20 40 20 40`，`FRAME004` 为 `-26 -10 -31 58 20 61`，`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | 8036 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 为 SPC 对象，本链不转入 Monster 主线。 |
| `actionobject/SPC/_cypherobject2/cypherobject.obj -> attack.act [BASE ANI] -> attack.ani` | `attack.ani` 的 `FRAME000` 到 `FRAME006` 均有同形 `[ATTACK BOX] -24 -10 72 40 20 40`。 | 父对象 `.atk` 给 physic/no element/down/blow 等 payload；hitbox 坐标仍来自攻击动作 BASE ANI。 |
| `actionobject/SPC/_cypherobject2/attack.act [SUB ANI] -> attack_glow.ani` | `attack_glow.ani` 的 `FRAME000` 到 `FRAME006` 均有同形 `[ATTACK BOX] -24 -10 72 40 20 40`。 | SUB glow ANI 自带攻击框，不能用 BASE 继承或图像层级推断。 |
| `actionobject/SPC/_cypherobject2/attack.act -> INDEX 8036 -> _CypherElec/CypherElec.obj -> body.ani` | 8036 下游 `body.ani` 的 `FRAME001-003` 为 `[ATTACK BOX] -20 -10 -20 40 20 40`，`FRAME004` 为 `-26 -10 -31 58 20 61`，`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | `_cypherobject2` 与 `_cypherobjectfriend` 都可创建 8036；递归链需按各自父 action 分开记录，不能合并运行触发结论。 |
| `actionobject/Monster/New_Event/CypherElec0.obj -> body0.act [BASE ANI] -> body0.ani` | `body0.ani` 为 8 帧：`FRAME001-003` 均为 `[ATTACK BOX] -20 -10 -20 40 20 40`，`FRAME004` 为 `-26 -10 -31 58 20 61`，`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | 16068 位于 passiveobject registry；`.atk` 只给 magic/light/push/lift 等 payload，不提供坐标。raw path 含 `ActionObject/Monster` 不改变 registry。 |
| `actionobject/Monster/New_Event/CypherElec1.obj -> body1.act [BASE ANI] -> body1.ani` | `body1.ani` 与 `body0.ani` 同形：`FRAME001-003` 均为 `[ATTACK BOX] -20 -10 -20 40 20 40`，`FRAME004` 为 `-26 -10 -31 58 20 61`，`FRAME005` 为 `-37 -10 -37 78 20 76`；`FRAME000/006/007` 未观察到盒字段。 | 16152 位于 passiveobject registry；对象有 `[homing] [ENEMY]`，但 homing 参数不替代 ANI hitbox。 |
| `actionobject/Monster/New_Event/AirSword00.obj -> AirSword_start.act [BASE ANI] -> AirSword00.ani` | `Airsword00.ani` 为 55 帧，`FRAME000-054` 均观察到同形 `[ATTACK BOX] -72 -20 -28 141 40 44`，未观察到 `[DAMAGE BOX]`。 | 16155 位于 passiveobject registry；`.atk` 只给 physic/dark/no reaction/push lift 等 payload，不提供坐标。raw path 含 `ActionObject/Monster` 不改变 registry。 |
| `actionobject/Monster/New_Event/AirSword00.obj -> AirSword_stay.act [BASE ANI] -> AirSword00_stay.ani` | `Airsword00_stay.ani` 为 62 帧，`FRAME000-061` 均观察到同形 `[ATTACK BOX] -72 -20 -28 141 40 44`，未观察到 `[DAMAGE BOX]`。 | stay action 有距离检查、pull appendage 和多档 X 轴速度；静态盒字段不能证明实际拉拽、命中刷新、速度表现或销毁时序。 |
| `actionobject/Monster/New_Event/Missile0.obj -> Missile0.act [BASE ANI] -> BossMissile0.ani` | `BossMissile0.ani` 为 3 帧，`FRAME000-002` 均观察到同形 `[ATTACK BOX] -24 -10 -9 49 20 18`，未观察到 `[DAMAGE BOX]`。 | 16153 位于 passiveobject registry；`.atk` 只给 magic/fire/blow/push/lift 等 payload，不提供坐标。raw path 含 `ActionObject/Monster` 不改变 registry。 |
| `actionobject/Monster/New_Event/Missile0.obj -> body1_EX.act [BASE/SUB ANI]` | last action 的 `1ExpDodge_M.ani` 与 `1ExpNormal_M.ani` 均为 11 帧表现 ANI，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；`body1_EX.act` FRAME10 执行 `[DESTROY]`。 | 同一 owner 的飞行态有攻击框，不代表 last action 爆炸/消失表现也有盒；销毁帧和视觉表现需实机验证。 |
| `actionobject/Monster/New_Event/Missile0.act -> BossMissileSmog0.ptl -> BossMissileSmog0.ani` | 粒子侧车 `BossMissileSmog0.ani` 为 7 帧烟雾表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | action 中的 `[PARTICLE]` 可指向表现层动画；不能把粒子路径当成 hitbox 来源。 |
| `actionobject/Monster/New_Event/Assault_Missile0.obj -> Assault_Missile0.act [BASE ANI] -> Missile10.ani` | `Missile10.ani` 为 2 帧：`FRAME000` 为 `[ATTACK BOX] -14 -10 -6 32 20 13`，`FRAME001` 为 `[ATTACK BOX] -14 -10 -7 32 20 13`，未观察到 `[DAMAGE BOX]`。 | 16154 位于 passiveobject registry；`.atk` 只给 physic/no element/down/blow/push/lift 等 payload，不提供坐标。 |
| `actionobject/Monster/New_Event/Assault_Missile0.obj -> Assault_Missile0.act [SUB ANI] -> Missile20.ani` | `Missile20.ani` 为 8 帧，均为 `m_dodge.img` 线性减淡表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | SUB ANI 不继承 BASE hitbox；必须按实际帧级字段分开记录。 |
| `actionobject/Monster/New_Event/Assault_Missile0.obj -> body1_EX.act [BASE/SUB ANI]` | last action 复用 `1ExpDodge_M.ani` 与 `1ExpNormal_M.ani`，二者均为 11 帧表现 ANI，未观察到盒字段；`body1_EX.act` FRAME10 执行 `[DESTROY]`。 | homing、速度切换和 last action 销毁时序不能由静态 hitbox 单独证明。 |
| `actionobject/Monster/New_Event/Hgoblin_Laser.obj -> Hgoblin_laser.act [BASE ANI] -> laser_dodge.ani` | `laser_dodge.ani` 为 13 帧：`FRAME001` 到 `FRAME006` 均为同形 `[ATTACK BOX] -7 -10 -10 660 20 21`；`FRAME000/007-012` 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 16157 位于 passiveobject registry；`.atk` 只给 magic/light/blow/push/lift 等 payload，不提供坐标。 |
| `actionobject/Monster/New_Event/Hgoblin_Laser.obj -> Hgoblin_laser.act [SUB ANI] -> laser_dodge1.ani / laser_dodge2.ani` | 两个 SUB ANI 均为 13 帧表现层：`laser_dodge1.ani` 使用 middle 图像，`laser_dodge2.ani` 使用 down 图像；当前样本均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE 有攻击框，不代表 SUB 继承 hitbox；SUB 偏移 `0 -5` / `0 -4` 只作为挂接列形记录。 |
| `actionobject/Monster/New_Event/Boss_Command.obj -> Boss_Command*.act [BASE ANI] -> Boss_Command_test*.ani` | `Boss_Command.act` / `Boss_Command_Attack.act` 挂 `Boss_Command_test.ani`，`Boss_Command_Change.act` 挂 `Boss_Command_test2.ani`，`Boss_Command_Change1.act` 挂 `Boss_Command_test3.ani`；三份 linked BASE ANI 均为 5 帧 `G_disappear.img` 表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 本桶无 `.atk` owner；`Boss_Command_Attack.act` 中的 `[SET DAMAGE BOX] [ON]` 是 action 行为字段，不提供 ANI 帧级盒坐标。 |
| `actionobject/Monster/New_Event/Boss_Command.ani` | 物理 ANI 可反编译，5 帧均为 `G_appear.img` 表现并带 `[DAMAGE TYPE] UNBREAKABLE`；主目标全 PVF 脚本文本未观察到 `Boss_Command.ani` / `boss_command.ani` 文件名引用，帧内未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | `[DAMAGE TYPE]` 不是 `[DAMAGE BOX]`；本文件只登记为同前缀可读但未挂接侧车边界，不能写成 owner-linked hitbox。 |
| `actionobject/Monster/New_Event/Zx-69_Dorp.obj / Zx-69_Dorp1.obj -> Zx-69_Dorp.act [BASE/SUB ANI]` | `Zx-69_Dorp.act` 挂 BASE `Zx-69-Body_Stay.ani` 与 SUB `G_main_s_1.ani`、`G_main_s_2.ani`、`G_main_s_3.ani`；4 个 linked ANI 均为表现/待机帧，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 16161/16181 位于 passiveobject registry；对象不挂 `.atk`，hitbox 只能来自 linked ANI 帧级盒字段，不能从 ZPOS 触发或视觉图像推断。 |
| `actionobject/Monster/New_Event/Zx-69_Dorp*.obj -> Zx-69_Dorp_last*.act [BASE/SUB ANI]` | `Zx-69_Dorp_last.act` 和 `Zx-69_Dorp_last1.act` 均挂 BASE `Zx-69-Body_Open.ani` 与 SUB `G_Last_s.ani`、`Zx-69_Open.ani`；3 个 linked ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | last action 在 FRAME28 召唤 monster 并自毁；召唤出口不提供 PassiveObject hitbox 坐标，61650/61656 需按 monster registry 路由。 |
| `actionobject/Monster/New_Event/ExpAir.obj -> ExpAir.act [BASE ANI] -> Tempester/ExpAirDodge.ani` | `ExpAirDodge.ani` 为 8 帧；FRAME000-004 每帧均有 3 条攻击框：`-45 -30 -55 90 60 110`、`-75 -15 -18 150 30 35`、`-60 -23 -35 120 45 70`；FRAME005-007 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 16156 位于 passiveobject registry；`.atk` 只给 magic/no element/down/blow/push/lift 等 payload，不提供坐标。 |
| `actionobject/Monster/New_Event/ExpAir.obj -> ExpAir.act [SUB ANI] -> Tempester/ExpAirNormal.ani` | `ExpAirNormal.ani` 为 8 帧表现层，FRAME000 为空图，其余帧为 normal 图像；未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE 有攻击框不代表 SUB 继承 hitbox；SUB 偏移 `0 0` 只作为挂接列形记录。 |
| `actionobject/Monster/New_Event/G_main.obj / G_main1.obj -> G_main*.act [BASE/SUB ANI]` | `G_main.act` 与 `G_main1.act` 均挂 BASE `G_main_0.ani` 与 SUB `G_main_1.ani`、`G_main_2.ani`、`G_main_3.ani`；4 个 linked ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。`G_Last.ani` 作为 last action BASE 同样未观察到盒字段。 | 16158/16160 位于 passiveobject registry；对象不挂 `.atk`，action 只按 monster check 后自毁。相邻 `G_main_4.ani` 可读且无盒，但未观察到脚本文本挂接，不能写成 owner-linked hitbox。 |
| `actionobject/Monster/New_Event/G_main_s.obj -> G_main_s.act [BASE/SUB ANI]` | `G_main_s.act` 挂 BASE `G_main_s_0.ani` 与 SUB `G_main_s_1.ani`、`G_main_s_2.ani`、`G_main_s_3.ani`；4 个 linked ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。`G_Last_s.ani` 作为 last action BASE 同样未观察到盒字段。 | 16159 位于 passiveobject registry；对象不挂 `.atk`，FRAME4 的 monster check 只决定自毁分支。相邻 `G_main_s_4.ani` 可读且无盒，但未观察到脚本文本挂接。 |
| `actionobject/Monster/New_Event/Stingerex.obj -> stingerex.act [BASE ANI] -> Stinger/ExpDodge.ani` | `ExpDodge.ani` 为 14 帧，FRAME000-006 均有 `[ATTACK BOX]` 六数值列，坐标依次为 `-36 -18 0 71 36 28`、`-56 -23 0 110 46 89`、`-65 -23 0 131 46 132`、`-75 -23 0 150 46 148`、`-75 -23 0 150 46 149`、`-75 -23 0 150 46 150`、`-75 -23 0 150 46 149`；FRAME007-013 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 16162 位于 passiveobject registry；`.atk` 只给 physic/no element/down/hit down/blow/push/lift payload，不提供坐标。 |
| `actionobject/Monster/New_Event/Stingerex.obj -> stingerex.act [SUB ANI] -> Stinger/ExpFloorNormal.ani / ExpFloorDodge.ani` | 两个 SUB ANI 均为 6 帧地板残留/表现层，FRAME000 为空图，后续帧为 `exp_floor.img` 图像、坐标、倍率、RGBA 或 lineardodge；未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE 有攻击框不代表 SUB 继承 hitbox；SUB 偏移 `0 1` / `0 2` 只作为挂接列形记录。 |
| `actionobject/Monster/New_Event/EMP.obj -> EMP.act [BASE/SUB ANI]` | `EMP.act` 挂 BASE `spin_left_back_dodge.ani` 与 9 个 SUB：`emp_nova3.ani`、`dis_light_back_dodge.ani`、`light_normal.ani`、`line_dodge2.ani`、`light_dodge.ani`、`spin_right_back_dodge.ani`、`emp_nova4.ani`、`_emp_nova3.ani`、`_emp_nova4.ani`；主目标 10 个 owner-linked ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 16191 位于 passiveobject registry；本桶无 `.atk` owner，action-level `[ACTIVE STATUS] [lightning]` 和创建入口不提供 hitbox 坐标。相邻 `twin_item/emp_*` 与 `tempester/*` 文件未被本 action 挂接，不能并入 EMP hitbox 结论。 |
| `actionobject/Monster/New_Event/missile_L.obj / missile_R.obj -> missile_start/stay*.act -> missile_EXP.obj -> missile_destroy.act` | `missile.ani`、`missileT.ani`、`missileD.ani`、`missile_eff.ani`、`missile_effD.ani` 均可反编译，帧内为导弹/尾焰图像、旋转、RGBA、lineardodge、delay 等表现字段，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 16163/16166/16164 均位于 passiveobject registry；飞行、升空、teleport、落地创建和销毁行为不提供 hitbox 坐标。 |
| `actionobject/Monster/New_Event/JeffMissileEXP1.obj -> JeffMissileEXP.act [BASE ANI] -> JeffMissileEXP.ani` | `JeffMissileEXP.ani` 为 6 帧；FRAME000 有 2 条攻击框：`-101 -28 0 204 56 15`、`-79 -40 0 160 79 59`；FRAME001 有 3 条：`-131 -26 0 261 51 30`、`-109 -47 0 221 92 30`、`-90 -60 0 180 120 88`；FRAME002/003 前两条同形，第三条分别为 `-90 -60 0 180 120 97` / `-90 -60 0 180 120 105`；FRAME004-005 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 16165 位于 passiveobject registry；`.atk` 只给 physic/fire/down/blow/push/lift 等 payload，不提供坐标。三个 SUB `JeffMissileEXP1/2/3.ani` 未观察到盒字段。 |
| `JeffMissileEXP.act -> INDEX 35112 / 35113 -> risk_dungeon/cartelcommand` | 35112 `LargeExp.obj -> ShootingStarExp.ani` 的空图 `FRAME000` 有 `[ATTACK BOX] -100 -30 -20 200 60 40`；35113 `sniper_exp.obj -> sniper_exp.ani` 为 7 帧地板表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 35112/35113 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；35112/35113 同号 equipment 碰撞不能覆盖本上下文。 |
| `actionobject/SPC/despair_tower/eltis/eltis_machine_explode.act -> INDEX 8498 -> lizard_man/event_thunder_all.obj -> event_thunder_all8.ani` | 8498 下游 `event_thunder_all8.ani` 的 `FRAME006` 有两条 `[ATTACK BOX]`：`-29 -10 0 54 20 443` 与 `-73 -42 229 168 84 215`；`event_thunder_all.ani`、`all1-7.ani`、`all9.ani`、`all10.ani` 当前未观察到盒字段。 | 8498 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；raw path 含 `ActionObject/Monster` 不改变 registry。 |
| `actionobject/SPC/despair_tower/shouting.obj -> shouting.act [BASE ANI] -> shouting.ani` | `shouting.ani` 的 `FRAME000` 到 `FRAME006` 均观察到 `[ATTACK BOX]` 六数值列，坐标依次为 `-70 -55 -76 135 112 151`、`-108 -120 -114 215 245 225`、`-152 -150 -146 296 300 293`、`-197 -200 -183 382 400 368`、`-208 -200 -204 415 400 412`、`-235 -220 -236 478 440 472`、`-235 -220 -236 478 440 472`；`FRAME007` 未观察到盒字段。 | `.atk` 只给 damage / status payload；`shouting.act` 的 `[ATTACKRECT] [RESET]` 是行为入口，hitbox 坐标仍以 BASE ANI 帧级字段为准。 |
| `actionobject/SPC/despair_tower/shouting2.obj -> shouting2.act [BASE ANI] -> shouting_1.ani` | `shouting_1.ani` 的 `FRAME000` 到 `FRAME006` 均观察到 `[ATTACK BOX]` 六数值列，坐标依次为 `-63 -20 -61 123 40 125`、`-87 -21 -85 176 42 172`、`-118 -23 -113 234 46 225`、`-145 -25 -147 284 50 290`、`-145 -25 -147 284 50 290`、`-145 -25 -147 284 50 290`、`-145 -25 -147 284 50 290`；`FRAME007` 未观察到盒字段。 | `shouting2.obj` 物理可读，但经 `.lst`、全 PVF 脚本文本和 9290 上游复核仍未闭合到主目标 registry 数字入口；本行只登记 owner-linked action/ANI 的静态盒字段。 |
| `actionobject/SPC/despair_tower/booldRust.obj -> booldRust.act [BASE ANI] -> GrabBlastBloodEx/cast1.ani` | `cast1.ani` 为 10 帧，`FRAME000` 观察到 `[ATTACK BOX] -1 -1 810 1 1 2`；`FRAME001` 到 `FRAME009` 未观察到盒字段。 | `booldRust.obj` 不挂 `.atk`；这个高 Z、极小尺寸攻击框只证明 ANI 帧级字段存在，不证明实机命中、伤害或状态效果。 |
| `actionobject/SPC/despair_tower/apc_niddle.obj -> apc_niddle.act [BASE ANI] -> APC_ATHiddenStingAttack.ani` | `APC_ATHiddenStingAttack.ani` 为 4 帧，`FRAME000` 到 `FRAME003` 均观察到同形 `[ATTACK BOX] -27 -8 -8 47 16 19`，未观察到 `[DAMAGE BOX]`。 | `.atk` 提供 physic/no element/cut/curse payload；攻击盒坐标仍来自 ANI 帧级字段。攻击成功后 action 自毁，实际命中、状态附加和销毁时机需实机验证。 |
| `actionobject/SPC/despair_tower/apc_niddle2.obj -> apc_niddle2_1.act [BASE ANI] -> niddle2.ani` | `niddle2.ani` 为 6 帧，`FRAME000` 到 `FRAME005` 均观察到同形 `[ATTACK BOX] -33 -10 -4 67 20 10`，未观察到 `[DAMAGE BOX]`。 | `apc_niddle2_1.act` FRAME0 设置 X 轴速度 `500` 且使用自身方向；飞行速度、命中时机和自毁结果不由静态 hitbox 单独证明。 |
| `actionobject/SPC/despair_tower/reflect_ball.obj -> reflect_ball.act [BASE ANI] -> eg-ball_start.ani` | `eg-ball_start.ani` 为 8 帧，`FRAME000-007` 均观察到 `[ATTACK BOX]`，坐标依次为 `-11 -20 -15 20 40 29`、`-16 -20 -17 28 40 37`、`-23 -20 -23 49 40 47`、`-28 -20 -27 56 40 56`、`-32 -20 -32 65 40 62`、`-37 -20 -35 74 40 71`、`-38 -20 -37 75 40 77`、`-44 -20 -46 93 40 94`；未观察到 `[DAMAGE BOX]`。 | `reflect_ball.atk` 只提供 damage/cut 等 payload；start 动画攻击框随帧放大，实际帧命中频率和 `ATTACKRECT RESET` 时机需实机验证。 |
| `actionobject/SPC/despair_tower/reflect_ball.obj -> reflect_ball_stay.act [BASE ANI] -> eg-ball_stay.ani` | `eg-ball_stay.ani` 为 40 帧，`FRAME000-039` 均观察到同形 `[ATTACK BOX] -44 -25 -46 93 50 94`；未观察到 `[DAMAGE BOX]`。 | stay action 多帧执行 `[ATTACKRECT] [RESET]`，并含 `[PULL APPENDAGE] 6.5 6.5 4500`；静态只读不证明拉拽、命中刷新或卡肉效果。 |
| `actionobject/SPC/despair_tower/reflect_ball_destroy.act -> INDEX 9217 -> eg_bomb.obj -> eg_bomb.act [BASE ANI] -> eg_bomb2.ani` | `eg_bomb2.ani` 为 12 帧，`FRAME003-006` 有 `[ATTACK BOX]`，坐标依次为 `-73 -30 -79 143 60 154`、`-110 -40 -93 215 80 204`、`-98 -30 -93 191 60 191`、`-90 -30 -78 180 60 166`；`FRAME000-002` 与 `FRAME007-011` 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 9217 是 9216 destroy action 创建的下游对象；`.atk` 给 fire/down/blow/push/lift payload，爆炸命中范围仍以 `eg_bomb2.ani` 帧级攻击框为准。 |

| `actionobject/SPC/despair_tower/attack_shield.obj -> attack_shield.act [BASE ANI] -> attack_shield.ani` | `attack_shield.ani` 为 11 帧，`FRAME004-007` 有 `[ATTACK BOX]`，坐标依次为 `-8 -15 -15 37 30 29`、`-8 -15 -17 184 30 30`、`-8 -15 -14 268 30 30`、`-15 -15 -11 311 30 25`；`FRAME000-003` 与 `FRAME008-010` 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 9222 位于 passiveobject registry；`.atk` 给 absolute damage `25000` 等 payload，攻击成功创建 9219 的触发和命中时机需实机验证。 |
| `actionobject/SPC/despair_tower/pass_shield.obj -> pass_shield.act [BASE ANI] -> pass_shield.ani` | `pass_shield.ani` 为 9 帧，`FRAME003-007` 有 `[ATTACK BOX]`，坐标依次为 `-34 -15 -6 45 30 11`、`-74 -15 -6 86 30 12`、`-73 -15 -7 86 30 14`、`-76 -15 -7 89 30 13`、`-76 -15 -7 89 30 13`；`FRAME000-002` 与 `FRAME008` 未观察到盒字段，未观察到 `[DAMAGE BOX]`。 | 9218 位于 passiveobject registry；`pass_shield.act` FRAME8 创建 9219 后自毁，实际触发顺序和销毁时机不由静态 hitbox 单独证明。 |

## 正样本：Damage Box

| 链路 | 帧级观察 | 边界 |
| --- | --- | --- |
| `actionobject/SPC/_diredirt/body.obj / body2_weapon.obj -> Body.ani` | `Body.ani` 的 `FRAME000` 到 `FRAME003` 均有同形 `[DAMAGE BOX] -20 -10 -10 40 20 23`，且同帧也有攻击框。 | 同一 ANI 同帧可同时存在攻击框与受击/伤害框；实际碰撞、受击和命中仍需实机。 |
| `enginecover_crochan.obj -> enginecover_crochan1.act -> [CREATE PASSIVEOBJECT] INDEX 8767 -> enginecover_crochan2.obj -> enginecover_crochan2.act [BASE ANI] -> _enginecover_2.ani` | `_enginecover_2.ani` 的 `FRAME000` 到 `FRAME002` 均观察到 `[DAMAGE BOX]`，每行六个数值。 | 受击/碰撞盒存在不等于攻击输出；实机碰撞和受击表现仍需运行验证。 |
| `mapobject/breakableobject/actionbrazier.obj [basic motion] -> BrazierFront.ani` | `FRAME000` 观察到 `[DAMAGE BOX]` 六数值列。 | `mapobject/` 可通过 `.obj [basic motion]` 直连二进制 ANI；不必经 `.act [BASE ANI]`。 |
| `mapobject/breakableobject/actionfountain.obj [basic motion] -> Fountain.ani` | `FRAME000` 观察到 `[DAMAGE BOX]` 六数值列。 | basic motion 是地图物件受击/碰撞盒正样本；不证明攻击输出。 |
| `actionfountain.obj [etc motion] -> FountainDamage.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[DAMAGE BOX]` 六数值列。 | etc motion 也可承载 `[DAMAGE BOX]`，不能默认 etc motion 都是纯表现。 |
| `actionstonepillar.obj [basic motion] -> StonePillar0.ani` | `FRAME000` 观察到 `[DAMAGE BOX]` 六数值列。 | 同对象 etc motion 另读，不能继承 basic motion 结论。 |
| `eventbarrier_1.obj [basic motion] -> EventBarrier.ani` | `FRAME000` 观察到两条 `[DAMAGE BOX]` 六数值列。 | 同一帧可有多条 damage box。 |
| `eventbarrier_1.obj [etc motion] -> EventBarrierFire.ani` | `FRAME000` 到 `FRAME004` 每帧均观察到两条 `[DAMAGE BOX]`。 | etc motion 可连续多帧保留 damage box。 |
| `actiontorchilght.obj [basic motion] -> TorchlightFront.ani` | `FRAME000` 观察到 `[DAMAGE BOX]` 六数值列。 | 文件名拼写按 PVF 原样保留。 |
| `actionobject/SPC/despair_tower/eltis/eltis_machine.obj -> Eltis_machine*.act -> Eltis_machine*.ani` | `Eltis_machine.ani`、`Eltis_machine_effect.ani`、`Eltis_machine_explode.ani`、`Eltis_machine_explode_effect.ani` 全帧观察到同形 `[DAMAGE BOX] -25 -11 -5 51 22 94`；`Eltis_machine_appear.ani` 的 FRAME001-012 有同形 damage box，FRAME000 未观察到盒字段。 | machine 本体受击/碰撞盒与 explode 下游 8498 攻击盒分层记录；`.atk` 不提供这些坐标。 |
| `darkflower.obj [basic motion] -> DarkFlowerBaseStone.ani` | `FRAME000` 观察到 `[DAMAGE BOX]` 六数值列。 | `[pass type] [pass all]` 与是否存在 damage box 是不同层面的字段。 |
| `actionobject/act8/map/seatrainretaking/action/gt96002.act [BASE ANI] -> gt96002.ani` | `FRAME000` 到 `FRAME017` 均观察到 `[DAMAGE TYPE] SUPERARMOR` 与 `[DAMAGE BOX]` 六数值列。 | `[DAMAGE TYPE]` 是帧级相邻字段；静态只读不解释霸体、受击或同步运行效果。 |
| `actionobject/SPC/jackie/Ball_Throw.act [BASE ANI] -> Ball_Throw.ani` | `FRAME000`、`FRAME001` 均观察到 `[DAMAGE BOX]` 六数值列。 | 投掷球体本体受击/碰撞盒与下游爆炸攻击盒分层记录。 |
| `actionobject/SPC/jackie/Ball_Count.act [BASE ANI] -> Ball_Count.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[DAMAGE BOX]` 六数值列。 | 倒数对象有 damage box，但爆炸视觉 SUB `Ball_count_e.ani` 未观察到盒字段。 |
| `actionobject/monster/timegate/TimeLord/Chain_start.act [BASE ANI] -> chain_sphere.ani` | `FRAME003`、`FRAME004` 同时观察到 `[ATTACK BOX]` 与 `[DAMAGE BOX]`，均为六数值列。 | 同一帧可同时存在攻击盒与受击/碰撞盒；字段存在不证明运行命中或受击。 |
| `actionobject/monster/gashengrigun/ez8_1.obj -> EZ8_2.act [BASE ANI] -> CountDown.ani` | `FRAME001` 到 `FRAME005` 观察到 `[DAMAGE BOX] -21 -10 0 34 20 34`；`FRAME000` 未观察到盒字段。 | `ez8_1.obj` 的 basic action 本身也可承载 damage box，不必等到爆炸 etc action。 |
| `actionobject/monster/gashengrigun/ez8_1.obj -> EZ8_2.act [SUB ANI] -> Stay3.ani` | `FRAME000`、`FRAME001` 均观察到 `[DAMAGE BOX] -18 -15 -3 41 31 43`。 | SUB ANI 可承载 damage box；同一 action 的 Dust SUB 仍需单独读。 |
| `actionobject/monster/gashengrigun/ez8_1.obj [etc action] -> Boom2.act [BASE ANI] -> Boom2.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[DAMAGE BOX] -18 -17 -3 41 34 43`。 | `Action/Boom2.act` 字符串在 chiefmong 与 gashengrigun 下解析到不同物理 action；这里是 damage box，不是 chiefmong 的 attack box。 |
| `gashengrigun/Boom2.act -> [CREATE PASSIVEOBJECT] INDEX 8588 -> monster/zealotrebirth/nenguard_1.obj -> NenGuard.ani` | `FRAME000` 到 `FRAME010` 观察到 `[DAMAGE BOX]`；多帧同帧有四条 damage box，`FRAME011` 到 `FRAME013` 未观察到盒字段。 | 8588 走 passiveobject registry；raw path 含 `Monster/` 不改变 registry 路由。 |
| `lizardman/SummonStoneBody.act -> [CREATE PASSIVEOBJECT] INDEX 8568 -> common/GuardianGrenadeNoneBomb.obj -> GrenadeNoneBomb.ani` | `FRAME000` 到 `FRAME006` 每帧观察到两条 `[ATTACK BOX]`；`FRAME007`、`FRAME008` 未观察到攻击框。 | 同一源 action 还通过 `[SUMMON MONSTER]` 随机召唤 61129-61133；召唤候选走 monster registry，8568 走 passiveobject registry。 |
| `guardiangoblin/*spearjail*.act -> [CREATE PASSIVEOBJECT] INDEX 8568 -> common/GuardianGrenadeNoneBomb.obj -> GrenadeNoneBomb.ani` | 5 个 guardian source action 均观察到 8568 入边；下游 `GrenadeNoneBomb.ani` 同上为攻击框正样本。 | source action 多处还创建 8561；8561 与 8568 都走 passiveobject registry，但命中不同 raw path。 |
| `act8/monster/mermadia/medusa_down.obj -> medusa_down.act / medusa_attack.act` | `medusa_down.ani` 与 `medusa_attack.ani` 的 `FRAME000` 到 `FRAME003` 均观察到 `[ATTACK BOX] -15 -10 -10 30 20 24`。 | `.obj` 同时有 `[object destroy condition]` 与 `[homing]`；homing 配置不替代 ANI hitbox。 |
| `act8/monster/mermadia/mind_control_octo.obj -> mind_control_octo.act / last_octo.act` | `mind_control_octo.ani` 两帧、`last_octo.ani` 四帧均观察到 `[DAMAGE BOX] -22 -10 -9 40 20 40`，未观察到攻击框。 | homing follow 的 61194 走 monster registry；mind control appendage 和 damage box 不写成攻击输出。 |
| `timegate/conflagration/forest_elf/stone.obj -> stone.act` | `stone.ani` 的 `FRAME000`、`FRAME001` 均观察到 `[ATTACK BOX] -28 -10 0 55 19 41`。 | `[straight homing]` 是 `.obj [homing]` 内空标签；攻击盒仍来自 linked ANI。 |
| `pirateonthetrain/treasurebox.obj -> treasurebox.act -> treasurebox.ani` | `treasurebox.ani` 的 `FRAME000`、`FRAME001` 均观察到 `[DAMAGE BOX] -42 -8 1 79 18 44`。 | 该对象通过 `.obj [object destroy condition]` 创建 9330；damage box 不等于创建行为或攻击输出。 |
| `pirateonthetrain/treasurebox_open.obj -> treasurebox_open.act -> treasurebox_open.ani` | `treasurebox_open.ani` 两帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 9330 下游打开对象有时间样销毁块；下游 ANI 不继承源对象 damage box。 |
| `actionobject/monster/gashengrigun/ez8.obj -> EZ8.act [SUB ANI] -> Stay2.ani` | `FRAME000` 到 `FRAME002` 均观察到 `[DAMAGE BOX] -18 -15 -3 41 31 43`。 | `ez8.obj` 与 `ez8_1.obj` 共用 `CountDown.ani`，但 SUB 分别为 `Stay2.ani` 与 `Stay3.ani`。 |
| `actionobject/monster/gashengrigun/ez8.obj [etc action] -> Boom.act [BASE ANI] -> Boom.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[DAMAGE BOX] -18 -17 -3 41 34 43`；同 action 创建 8794。 | 8794 继续回 passiveobject registry 命中 `ActionObject/Common/BigBoom4.obj`；本层仍是 damage box。 |
| `gashengrigun/Boom.act -> INDEX 8794 -> actionobject/common/BigBoom4.obj -> _Bigboom4.ani` | `_Bigboom4.ani` 的 `FRAME001` 到 `FRAME003` 有 `[ATTACK BOX]`，坐标依次为 `-71 -13 -12 142 28 134`、`-280 -59 -3 561 119 203`、`-256 -33 0 515 68 203`。 | `BigBoom4.obj` 挂 `BigBoom2.atk`，攻击信息与 hitbox 仍分属 `.atk` 与 `.ani`。 |
| `actionobject/monster/gashengrigun/gasbomb.obj -> GasBomb.act [BASE ANI] -> GasBomb.ani` | `FRAME000` 到 `FRAME003` 均观察到 `[ATTACK BOX] -10 -10 -10 20 20 20`。 | `GasBomb.act` 还创建 8591 `SleepingGas.obj`；攻击盒和后续 sleep 状态对象分层记录。 |
| `actionobject/monster/gashengrigun/sleepinggas.obj / sleepinggas3_weapon.obj -> SleepingGas.act [BASE ANI] -> SleepSmoke.ani` | `FRAME000` 到 `FRAME006` 均观察到 `[ATTACK BOX] -108 -15 -20 211 32 40`。 | 两个 owner 共用 action/ANI，但分别挂 `Gas.atk` 与 `Gas3_weapon.atk`，状态列形不同。 |
| `actionobject/monster/gashengrigun/sleepinggas2.obj -> SleepingGas2.act [BASE ANI] -> SleepSmoke4.ani` | `FRAME000` 到 `FRAME006` 均观察到 `[ATTACK BOX] -67 -15 -20 132 32 40`。 | `SleepingGas2.act` 无 `[ATTACKRECT] [RESET]` 行为块；攻击框仍来自 BASE ANI。 |
| `character/mage/action/fluorecolliderstay.act [BASE ANI] -> FluoreCollider/stay_body.ani` | `FRAME000`、`FRAME001` 均观察到两条 `[DAMAGE BOX]` 六数值列。 | stay 本体可有 damage box；同 action 的其他 SUB / SUB WITH XYZ ANI 样本未观察到盒字段，不能互相继承。 |

| `actionobject/SPC/despair_tower/defence_shield.obj -> defence_shield.act [BASE ANI] -> defence_shieldme.ani` | `defence_shieldme.ani` 为 12 帧，`FRAME004` 有 `[DAMAGE BOX] -103 -35 -17 212 70 137`，`FRAME005` 为 `-110 -40 -15 224 80 147`，`FRAME006-011` 均为 `-109 -40 -17 224 80 147`；未观察到 `[ATTACK BOX]`。 | 9220 是 do-not-pass / hp destroy 防御实体；damage box 只证明受击/碰撞盒，不证明攻击输出。 |
| `actionobject/SPC/despair_tower/m_defence_shield.obj -> trap_defence_shield*.act -> Trap_Defence1_shield*.ani` | `Trap_Defence1_shield.ani` 的 `FRAME004` 有 `[DAMAGE BOX] -66 -25 -17 133 50 141`，`FRAME005-008` 与 `FRAME010-011` 为 `-66 -25 -17 133 50 155`，`FRAME009` 为 `-67 -25 -17 137 50 177`；`Trap_Defence1_shield_stay.ani` 的 `FRAME000-002` 均为 `[DAMAGE BOX] -65 -25 -19 135 50 154`；未观察到 `[ATTACK BOX]`。 | 9263 是 trap 防御实体；ON DAMAGE 和 Dcount 创建 9219 effect，不等于自身 ANI 有攻击框。 |

## 目录分桶与入口形态
| 目录 / 入口 | 主目标只读观察 | 结论 |
| --- | ---: | --- |
| `passiveobject/mapobject/` `[BASE ANI]` | 0 | mapobject 样本未走 `.act [BASE ANI]`；应优先查 `.obj [basic motion]` / `[etc motion]`。 |
| `passiveobject/mapobject/` `[basic motion]` | 633 | mapobject 有大量 `.obj` 直连 ANI 入口。 |
| `passiveobject/mapobject/` `[etc motion]` | 180 | 同一 mapobject 的 basic / etc motion 需要分别反编译。 |
| `passiveobject/common/` `[BASE ANI]` | 5 | common 目录存在少量 `.act [BASE ANI]` 样本。 |
| `passiveobject/common/` `[SUB ANI]` | 2 | common 的 SUB ANI 可为纯表现层反样本。 |
| `passiveobject/character/` `[basic motion]` | 597 | character 目录存在大量 `.obj` 直连 ANI 入口。 |
| `passiveobject/character/` `[etc motion]` | 309 | character 的 etc motion 常为多 ANI 闭合列表，需逐条反编译。 |
| `passiveobject/character/` `[basic action]` | 6 | character 中也存在 `.obj -> .act` 路由，不能只按直连 motion 查。 |
| `passiveobject/character/` `[BASE ANI]` | 7 | character action 内有 BASE ANI，但命中集中在少量 common/mage action。 |
| `passiveobject/character/` `[SUB ANI]` | 4 | 当前命中集中在 mage action；需按动作逐一读闭合块。 |
| `passiveobject/character/` `[attack info]` | 593 | character 对象大量挂接 `.atk`，但 hitbox 仍须进入 ANI 帧级数据。 |
| `passiveobject/actionobject/monster/` 文件清单 | 10980 | actionobject 最大分桶；路径含 monster 不代表改走 monster registry。 |
| `passiveobject/actionobject/common/` 文件清单 | 772 | common actionobject 含爆炸、障碍和通用行为样本；不等同于 `passiveobject/common/` 小桶。 |
| `passiveobject/actionobject/SPC/` 文件清单 | 1259 | SPC 是 actionobject 下的独立分桶；可含恢复/扣血、陷阱、发射物和跨 common 下游链。 |

## Common BASE ANI 小桶闭合

| `.act` | BASE ANI | SUB ANI | hitbox 观察 |
| --- | --- | --- | --- |
| `golgothunder.act` | `GolgoThunder.ani` | 无 | BASE ANI 前段帧有 `[ATTACK BOX]`。 |
| `golgothunder_item.act` | `GolgoThunder.ani` | 无 | 与 `golgothunder.act` 共用同一 BASE ANI。 |
| `golgothunder_summon.act` | `dumy.ani` | 无 | BASE ANI 未观察到盒字段；动作本体多次创建 48306。 |
| `title_mega.act` | `Title_mega.ani` | `Title_mega_vibration.ani` | BASE ANI 有 `[ATTACK BOX]`；SUB ANI 未观察到盒字段。 |
| `title_mega_drop.act` | `Title_mega_drop.ani` | `Title_mega_drop_effect.ani` | BASE 与 SUB ANI 均未观察到盒字段；动作创建 62100。 |

## MapObject BreakableObject 小桶
| `.obj` | basic motion | etc motion 抽样 | hitbox 观察 |
| --- | --- | --- | --- |
| `actionfountain.obj` | `Fountain.ani` | `FountainDamage.ani`、`FountainDestroyed.ani`、`FountainWaterGlow.ani`、`FountainWater.ani`、`FountainWaterGlow2.ani` | basic motion 与 `FountainDamage.ani` 有 `[DAMAGE BOX]`；destroyed / water / glow 类样本未观察到盒字段。 |
| `actionstonepillar.obj` | `StonePillar0.ani` | `StonePillar1.ani` | basic motion 有 `[DAMAGE BOX]`；etc motion 未观察到盒字段。 |
| `eventbarrier_1.obj` | `EventBarrier.ani` | `EventBarrierFire.ani` | basic 与 etc motion 均有 `[DAMAGE BOX]`，且同帧可多条。 |
| `actiontorchilght.obj` | `TorchlightFront.ani` | `TorchlightBack.ani`、`TorchlightLight.ani` | basic motion 有 `[DAMAGE BOX]`；back / light 未观察到盒字段。 |
| `darkflower.obj` | `DarkFlowerBaseStone.ani` | `DarkFlower0.ani` | basic motion 有 `[DAMAGE BOX]`；抽样 etc motion 未观察到盒字段。 |

## ActionObject SUB ANI 抽样

| `.act` | BASE ANI | SUB ANI | hitbox 观察 |
| --- | --- | --- | --- |
| `brokenwindow1.act` | `window_1.ani` | `window_2.ani`、`broken_1.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段。 |
| `torch.act` | `BrazierFront.ani` | `BrazierBack.ani`、`fire.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段。 |
| `merman.act` | `merman.ani` | `merman1.ani` | BASE / SUB ANI 均可反编译，未观察到盒字段。 |
| `gt96002.act` | `gt96002.ani` | `Dust2.ani`、`Dust3.ani`、`Dust.ani` | BASE ANI 有 `[DAMAGE TYPE]` 和 `[DAMAGE BOX]`；SUB ANI 均未观察到盒字段。 |

## ActionObject pirateship 创建链抽样

| 起点 | 创建链 | hitbox 观察 |
| --- | --- | --- |
| `pirate_ship.obj -> pirate_ship.act` | `INDEX 8770 -> fire.obj -> fire.act -> INDEX 8755 -> pirate_bomb_drop.obj -> pirate_bomb_drop.act -> INDEX 8778 -> pirate_ship_bomb.obj` | `pirate_ship.ani`、`pirate_ship_smoke.ani`、`pirate_ship_fire.ani`、`pirate_bomb_drop.ani`、`pirate_bomb_drop_effect1.ani` 均未观察到盒字段；末层 `pirate_ship_bomb` 的爆炸 ANI 已有 `[ATTACK BOX]` 正样本。 |
| `pirate_ship.act` | `[RANDOM SELECT]` 行为编号选择、`[SET SPEED]` 行为、创建 8770 | 行为选择和移动设置不等于 hitbox；仍需跟到下游对象 ANI。 |
| `fire.act` | 第 5 帧按目标距离触发创建 8755，并带 `[WARNING MARK]` | 预警标记字段不等于攻击框；8755 下游继续跟到掉落炸弹对象。 |
| `pirate_bomb_drop.act` | `ZPOS <= 40` 后创建 8778 并 `[DESTROY]` | 落地/销毁结构不等于爆炸 hitbox；8778 下游才进入已知爆炸对象。 |

## Character common / fighter / gunner 抽样

| `.obj` | motion / action 入口 | attackinfo 入口 | hitbox 观察 |
| --- | --- | --- | --- |
| `character/common/olympicfairyshield.obj` | `[basic motion] OlympicFairyShield.ani`；`[etc motion] OlympicFairyShieldAttack.ani / OlympicFairyShieldWarning.ani` | `OlympicFairyShield.atk` | 三个 ANI 样本均观察到 `[ATTACK BOX]`；`.atk` 只给攻击/反应字段，不给盒坐标。 |
| `character/common/fireexplosioncreater.obj` | `[basic action] FireExplosionCreater.act -> [BASE ANI] FireExplosionCreater.ani`；动作创建 48198 | `FireExplosion.atk` | 父对象 ANI 无盒；48198 解析到 `common/fireexplosionitemattack8.obj`，其 `FireExplosion.ani` 有 `[ATTACK BOX]`。 |
| `character/fighter/atenergyball.obj` | `[basic motion] ATEnergyBall.ani`；`[etc motion] EnergyBallExp.ani / ATEnergyBallCharge.ani` | `ATEnergyBall.atk`；`[etc attack info] ATEnergyBallExp.atk / ATEnergyBallCharge.atk` | basic 与 charge ANI 有攻击框；exp ANI 只有部分帧有攻击框。 |
| `character/gunner/atnapalmbomb.obj` | `[basic motion] ATNapalmBomb/Bullet.ani`；`[etc motion] Area1.ani / Area2.ani` 抽样 | `ATNapalmBomb.atk` | 已读 bullet、area1、area2 三个 ANI，样本未观察到盒字段；不能据此判定运行无伤害。 |
| `character/gunner/atsteyrfireexplosion.obj` | `[basic motion] ../../Common/Animation/FireExplosion.ani` | `ATSteyrFireExplosion.atk` | owner 借用 common ANI，该 ANI 有 `[ATTACK BOX]`；`.atk` 字段与 common fire explosion 类似但不是同一物理文件。 |
| `character/mage/FluoreColliderNoneExplosion.obj` | `[basic motion] ../../Common/Animation/NoneExplosion.ani` | `FluoreColliderNoneExplosion.atk` | 23055 可闭合到该对象；`.atk` 为 magic/light/enemy 和长 damage reaction 参数，攻击盒来自 `NoneExplosion.ani`。 |

## ActionObject monster 前缀抽样

| 起点 | 创建链 | hitbox 观察 |
| --- | --- | --- |
| `actionobject/monster/3headlessknight.obj` | `[basic action] 3headlessknight.act -> [CREATE PASSIVEOBJECT] INDEX 48163 -> passiveobject/monster/headlessknight/horse_item.obj` | 父 BASE `empty_00.ani` 是空图帧反样本；48163 下游 `Horse.ani` 有 `[ATTACK BOX]`。 |
| `3headlessknight.act` | `[POS] -100000` 后接 `[RANDOM] -140 140 0` | 创建位置字段可拆成固定值加随机参数，不能把 `[POS]` 固定写成三数值列。 |
| `horse_item.obj` | `[basic motion] Ani/Horse.ani`；`[attack info] Horse_item.atk` | `.atk` 有 `[absolute damage]` 等攻击字段；hitbox 坐标仍来自 `Horse.ani`。 |
| `advancealtar/homingmoth.obj` 与根级 `homingmoth.obj` | 两个 owner 均挂 `Action/HomingMoth.act` 与 `AttackInfo/HomingMoth.atk`；全 PVF owner 搜索确认该 action/atk 只被这两个 owner 引用；`Action/HomingMoth.act` 物理文件在根级 `action/` 下，指向 `../animation/HomingMoth.ani`。 | `HomingMoth.ani` 为 `[LOOP] 1` / `[FRAME MAX] 17`，`FRAME000` 到 `FRAME016` 均同时有 `[ATTACK BOX]` 与 `[DAMAGE BOX]`；代表坐标为 `FRAME000` attack `2 -15 -28 58 20 25` / damage `7 -15 -33 58 20 25`，`FRAME009` attack `-70 -10 -25 58 20 25`，`FRAME016` attack `-22 10 -13 58 20 25`。 |
| `advancealtar/summonegg.obj` / `summonegg2-4.obj` 与根级同名对象 | 四个 owner 均以 root-level `SummonEgg.act` / `SummonEgg2-4.act` 为 basic action；FRAME19 召唤 monster 后 `[DESTROY]`；两个 `[last action]` 分别写 `Action/Mucus2.act` 和对应 `Action/SummonEggBlast*.act`。 | `SummonEgg*.ani` 均为 20 帧，FRAME001-009 与 FRAME011-019 有同组 `[DAMAGE BOX] -26 -10 4 50 20 65`，FRAME000/010 未观察到盒字段；`chargecircle.ani` 与 `SummonEggBlast.ani` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `advancealtar/mucus2.obj` 与根级 `mucus2.obj` | 两个 owner 均挂 root-level `Action/Mucus3.act` 与 `AttackInfo/Mucus2.atk`；`Action/Mucus2.act` 只是 egg 的 last action 字符串，不能替代 `mucus2.obj` 的 basic action。 | `Mucus3.ani` FRAME000-004 有 `[ATTACK BOX]`，代表坐标包括 FRAME000 `-29 -15 -10 121 31 45`、FRAME001 `-25 -15 -19 121 31 230`、FRAME002 `-60 -15 -39 172 31 83`；FRAME005 未观察到盒字段。`mucus2.ani` 未观察到盒字段。 |
| `advancealtar/icestalactite.obj` 与根级 `icestalactite.obj` | 两个 owner 均挂 root-level `Action/Icestalactite.act`，并以 `Action/IcestalactiteBroken.act` 同时作为 etc action 与 last action；对象本体未观察到 `[attack info]`。 | `Icestalactite.ani` FRAME000 有 `[ATTACK BOX] -29 -22 -32 58 44 122` 与 `[DAMAGE BOX] -31 -22 -35 62 44 129`，FRAME001 有 `[DAMAGE BOX] -30 -18 -10 62 39 109` 且未观察到攻击盒。`IcestalactiteBroken.ani` FRAME000-003 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `advancealtar/rocket.obj` 与根级 `rocket.obj` | 两个 owner 均挂 root-level `Action/Rocket.act` 与 `AttackInfo/Rocket.atk`，并以 `Action/RocketBlast.act` 作为 last action；`advancealtar/action/rocket*.act` 与 `advancealtar/attackinfo/rocket*.atk` 主目标未观察到。 | `Rocket.ani` FRAME000 有 `[ATTACK BOX] -20 -22 -80 40 44 100`，FRAME001 有 `[ATTACK BOX] -20 -22 -20 40 44 100`；未观察到 `[DAMAGE BOX]`。 |
| `advancealtar/rocketblast.obj` 与根级 `rocketblast.obj` | 两个 owner 均挂 root-level `Action/RocketBlast.act` 与 `AttackInfo/RocketBlast.atk`；该 action BASE 为 `RocketBlast1.ani`，SUB 为 `RocketBlast2.ani`。 | `RocketBlast1.ani` FRAME001-003 有 `[ATTACK BOX] -91 -30 -6 189 60 33`，FRAME000/004-006 未观察到盒字段。`RocketBlast2.ani` FRAME000 有一条 `[ATTACK BOX] -70 -20 -20 140 40 40`，FRAME001-004 每帧两条攻击盒 `-125 -18 -20 250 36 60` 与 `-85 -30 -20 170 60 60`，FRAME005-006 未观察到盒字段。 |
| `advancealtar/rocketman_bullet.obj` 与根级同名对象 | 两个 owner 均挂 root-level `Action/RocketMan_Bullet.act` 与 `AttackInfo/RocketMan_Bullet.atk`；action 只有 BASE `RocketMan_Bullet.ani`。 | `RocketMan_Bullet.ani` FRAME000-003 均有 `[ATTACK BOX] -30 -10 -16 57 20 31`，未观察到 `[DAMAGE BOX]`。 |
| `advancealtar/rocketman_missile.obj`、根级同名对象与根级 `rocketman_missile2.obj` | `missile.obj` 与 `missile2.obj` 共用 `Action/RocketMan_Missile.act -> RocketMan_Missile.ani`，但 `.atk` 分别为 `RocketMan_Missile.atk` 与 `RocketMan_Missile2.atk`；两个对象都有 `[int data] 2000 5000`。 | `RocketMan_Missile.ani` FRAME000-002 均有 `[ATTACK BOX] -20 -16 -10 40 33 24` 与 `[DAMAGE BOX] -26 -23 -16 52 46 37`。 |
| `advancealtar/rocketman_rocket1.obj` / `rocketman_rocket11.obj` 与根级同名对象 | `rocket1` / `rocket11` 使用不同 action，但二者 BASE 都是 `RocketMan_Rocket1.ani`；`rocket1` 挂 `RocketMan_Rocket1.atk`，`rocket11` 也复用同一 `.atk`。 | `RocketMan_Rocket1.ani` FRAME000-001 均有 `[ATTACK BOX] -2 -10 35 20 20 28` 与 `[DAMAGE BOX] -13 -10 1 37 20 62`。 |
| `advancealtar/rocketman_rocket2.obj` / `rocketman_rocket22.obj` 与根级同名对象 | `rocket2` / `rocket22` 使用不同 action 和不同 `.atk`，但二者 BASE 都是 `RocketMan_Rocket2.ani`。 | `RocketMan_Rocket2.ani` FRAME000-001 均有 `[ATTACK BOX] -10 -20 -4 25 40 31` 与 `[DAMAGE BOX] -18 -10 -6 32 20 68`。 |
| `advancealtar/rocketmanwarningmark.obj` 与根级同名对象 | 对象不挂 `.atk`，只有 root-level `Action/RocketManWarningMark.act`；action FRAME1 执行 `[DESTROY]`。 | `RocketManWarningMark.ani` FRAME000-001 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；这是 homing warning mark 表现样本，不是攻击盒样本。 |
| `advancealtar/arrow_lv1.obj` / `arrow_lv2.obj` / `arrow_lv3.obj` / `arrow_lv4.obj` | 四个对象共享 `Action/Arrow.act`，分别挂 `AttackInfo/Arrow_Lv1.atk` 到 `Arrow_Lv4.atk`；action 只连 BASE `Arrow.ani` 和 sound，未观察到创建、召唤、attackrect 或销毁行为。 | `Arrow.ani` FRAME000-003 均有 `[ATTACK BOX]`，两组坐标交替：FRAME000/002 `-48 -10 -20 102 20 40`，FRAME001/003 `-48 -16 -21 102 31 41`；未观察到 `[DAMAGE BOX]`。四个 `.atk` 只改变 `[damage]` 数值，不提供盒坐标。 |
| `advancealtar/bomb_lv1-4.obj -> bomb1_Lv* -> LgExp_Lv*` | 四个父对象共享 `Action/bomb.act`，各自通过 `Action/bomb1_Lv1-4.act` 在 FRAME6 创建 12600 / 12646 / 12647 / 12648；这些 ID 均回 `passiveobject/passiveobject.lst` 命中 `LgExp_Lv1-4.obj`，下游共用 `Action/LgExp.act`。 | `bomb.ani` FRAME000-003 均有 `[ATTACK BOX] -11 -10 -9 21 20 21`；`bomb1.ani` FRAME000-006 均有 `[ATTACK BOX] -11 -10 -10 20 20 22`；下游 `FireExplosion.ani` FRAME000-002 均有 `[ATTACK BOX] -65 -40 -50 130 80 100`。三个 ANI 均未观察到 `[DAMAGE BOX]`。 |
| `advancealtar/catpul_bomb*.obj -> catpul_BombSub* -> OilExp` | 父弹 action 在落地条件后创建 12622 / 12624 / 12626 / 12628；`3catpul_bombsub.act` 在 FRAME4 额外创建 12634 `OilExp.obj`，12634 下游 `OilExp.act` 多帧执行 `[ATTACKRECT] [RESET]`。这些创建 ID 均回 `passiveobject/passiveobject.lst` 命中，不走 monster registry。 | `BombFly.ani` 两帧均有 `-10 -10 -10 20 20 20`；`CannonBall_boom.ani` 两帧和 `CannonBall.ani` 四帧均有 `-13 -6 -12 24 12 25`；`Fireball.ani` 四帧和 `Fireball_eff.ani` 八帧均有 `-19 -10 -15 32 20 31`；`bomb1.ani` 七帧均有 `-11 -10 -10 20 20 22`。`catpul_EarthQuake_S.ani` / `catpul_EarthQuake.ani` 的 FRAME000-004 有逐帧扩张攻击框，后段样本未观察到盒字段；`ExpFloorNormal.ani` FRAME001-012 均有 `[ATTACK BOX] -95 -37 -12 191 74 22`，FRAME000/013 未观察到盒字段。ring、flash、charge、TombStoneDust、ExpDodge_M、ExpNormal_M、ExpFloorDodge 等表现 / dodge SUB ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `advancealtar/probomb_lv1-4.obj -> LgExp2_Lv*` | 父对象不挂 `.atk`，通过 `ProBomb_Lv1.act` / `2ProBomb.act` / `3ProBomb.act` / `4ProBomb.act` 在 `ZPOS <= 10` 后创建 12616 / 12677 / 12678 / 12679；这些 ID 均回 `passiveobject/passiveobject.lst` 命中 `LgExp2_Lv1-4.obj`。 | 父层 `ProBomb.ani`、`2ProBomb.ani`、`3ProBomb.ani`、`4ProBomb.ani` 均为单帧图像样本，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；当前 owner 链中 `4ProBomb.act` 实际复用 `3ProBomb.ani`。下游共用 `FireExplosion.ani`，FRAME000-002 均有 `[ATTACK BOX] -65 -40 -50 130 80 100`，未观察到 `[DAMAGE BOX]`。 |
| `advancealtar/zepplinbullet_lv1-4.obj` | 四个对象直接挂 `animation/Bullet.ani` 和 `AttackInfo/Bullet_Lv1-4.atk`；12614 / 12680 / 12672 / 12673 均回 `passiveobject/passiveobject.lst` 命中。主目标只在 `goblin_propeller` 的 8 个射击 action 中观察到 12614 创建入口，未在同一子树观察到 Lv2-4 创建入口。 | `Bullet.ani` FRAME000-004 均有 `[ATTACK BOX]`，坐标依次为 `-7 -7 -6 12 14 14`、`-7 -7 -6 13 14 14`、`-8 -8 -7 13 15 15`、`-8 -8 -7 15 15 15`、`-8 -7 -6 14 15 14`；未观察到 `[DAMAGE BOX]`。四个 `Bullet_Lv*.atk` 为同构 attack payload，不提供 hitbox 坐标。 |
| `advancealtar/denture3_lv1-4.obj` | 四个对象直接挂 `Action/denture3.act` 和 `attackinfo/denture2_Lv1-4.atk`；12593 / 12668 / 12669 / 12670 均回 `passiveobject/passiveobject.lst` 命中。主目标创建入口为 `knifetooth/action/bite2_lv1-4.act`，分别在 FRAME2 创建对应 ID。 | `denture3.act` 的 BASE `denture2.ani` FRAME000-001 均有 `[ATTACK BOX] -68 -32 -132 119 60 272`，未观察到 `[DAMAGE BOX]`。`teeth.ptl` 引用的 `teeth1.ani` 到 `teeth4.ani` 均为粒子显示帧，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；四个 `denture2_Lv*.atk` 为同构 attack payload，不提供 hitbox 坐标。 |
| `advancealtar/iceniddle.obj` | 对象挂 `Action/Iceniddle.act` 与 `AttackInfo/Iceniddle.atk`；12606 回 `passiveobject/passiveobject.lst` 命中，创建入口为 keraha / vinoshu 的 `cast.act` 与 `cast1.act`。 | `Iceniddle.ani` FRAME002-010 有攻击盒：FRAME002 `-92 -10 100 29 20 60`；FRAME003 `-28 -10 -6 29 20 57` 与 `29 -10 102 22 20 57`；FRAME004 `17 -10 59 27 20 60`；FRAME005 `-21 -10 -15 48 20 68`；FRAME006 `-49 -10 159 31 20 76` 与 `-20 -10 -12 40 20 66`；FRAME007 `-18 -10 -9 40 20 58`、`-41 -10 142 30 20 63`、`100 -10 125 32 20 47`；FRAME008-010 均为 `-30 -10 -9 62 20 87`。未观察到 `[DAMAGE BOX]`；`Iceniddle_Glow.ani` 未观察到盒字段。 |
| 根级 `rocketman_missile_item.obj` | 对象走 `Action/rocket_item.act`，该 action 在 FRAME1-4 四次创建 48143；48143 回 passiveobject registry 命中 `RocketMan_Missile2.obj`。 | `rocket_item.ani` FRAME000-006 均只有空 image、delay 与 `[DAMAGE TYPE] SUPERARMOR`，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；攻击链需继续到 48143 下游。 |
| `timegate/TimeLord/Cube_L.obj` | `[basic action] Cube_loop.act`；`[etc action] Cube_EX.act` | `Cube.ani` / `Cube_EX.ani` 均可反编译但未观察到盒字段；`Cube_EX.act` 有 team 检查、appendage、append hit、flash screen 和 destroy 行为。 |
| `timegate/TimeLord/Chain.obj -> Chain_start.act -> 16080 -> Chain2.obj` | 16075 / 16080 均回 passiveobject registry 命中；`Chain_start.act` 在 `ZPOS >= 400` 后创建 16080 并销毁 | `chain_sphere.ani`、`1chain_start.ani`、`chain_sphere_loop.ani`、`chain_effect_loop.ani`、`chain_loop_bottom.ani`、`1chain_damage.ani` 有 `[ATTACK BOX]` 或 `[DAMAGE BOX]` 正样本。 |
| `timegate/TimeLord/Chain_attack_loop.act` | `[DEFAULT ATTACKINFO] ../AttackInfo/Chain_stay.atk`；`[WHICH] [MONSTER] [IS INDEX] 64013`；`[ATTACKRECT] [RESET]` | 64013 走 `monster/monster.lst` 命中 Andres；同号不按 passiveobject 创建 ID 解释，`[ATTACKRECT] [RESET]` 仍只是 action 行为字段。 |
| `timegate/TimeLord/magic_L.obj` | `[basic action] magic_L.act -> [BASE ANI] magic_L.ani` | `magic_L.ani` 11 帧均未观察到盒字段；该对象不挂 `.atk` 且 action 第 10 帧销毁。 |
| `actionobject/monster/gashengrigun/ez8_1.obj` | `[basic action] EZ8_2.act`；`[etc action] Boom2.act`；`Boom2.act` 创建 8588 | `EZ8_2` 的 CountDown/Stay3 有 `[DAMAGE BOX]`，Dust/Dust2/Dust3 未观察到盒字段；`Boom2.ani` 有 `[DAMAGE BOX]`，并创建 8588 下游 `NenGuard_1.obj`。 |
| `actionobject/monster/gashengrigun/ez8.obj` | `[basic action] EZ8.act`；`[etc action] Boom.act`；`Boom.act` 创建 8794 | `EZ8` 的 CountDown/Stay2 有 `[DAMAGE BOX]`；`Boom.ani` 有 `[DAMAGE BOX]`，8794 下游 `BigBoom4` 的 BASE ANI 有 `[ATTACK BOX]`。 |
| `actionobject/monster/gashengrigun/g3*` | `g3/g3_1/g3_2/g3_3` 分别走 `Attack/Attack1/Attack2/Attack3.act` | `_Round*.ani` 未观察到盒字段；动作内 `[SUMMON MONSTER]` 的 61134/61137 走 `monster/monster.lst`，不按 passiveobject registry。 |
| `actionobject/monster/gashengrigun/gasbomb.obj` | `[basic action] GasBomb.act`；`GasBomb.act` 创建 8591 | `GasBomb.ani` 有 `[ATTACK BOX]`；8591 回本前缀 `SleepingGas.obj`，后者挂 `Gas.atk` 与 `SleepSmoke.ani` 攻击框。 |
| `actionobject/monster/gashengrigun/sleepinggas*` | 三个对象分别挂 `Gas.atk`、`Gas2.atk`、`Gas3_weapon.atk` | `SleepSmoke.ani` / `SleepSmoke4.ani` 有 `[ATTACK BOX]`；三个 `.atk` 均为 `[active status] [sleep]` 三数值列。 |
| `actionobject/monster/gashengrigun/summonrx78.obj` | `Summon.act` 创建 8561，并召唤 61136 | `DropRed.ani` / `DropEffect.ani` 未观察到盒字段；8561 下游 `SpearJailDust.ani` 也未观察到盒字段。 |
| `monster/zealotrebirth/nenguard_1.obj` | `[basic motion] Ani/NenGuard.ani`；`[etc motion] NenGuardFloor.ani / NenGuardEffect.ani`；`[attack info] NenGuard.atk` | `NenGuard.ani` 多帧有多条 `[DAMAGE BOX]`；Floor/Effect 两个 etc motion 未观察到盒字段。 |
| `Blood_An/darkfireshoot.act` | `[BASE ANI] darkfireshoot.ani`；`[SUB ANI] darkfireshootsub.ani`；落地条件后随机创建 8718/8719/8720 | 源 BASE/SUB ANI 均未观察到盒字段；攻击框在随机创建的下游对象 BASE ANI 中。 |
| `Blood_An/darkfire1/2/3.obj` | 三个候选对象共用 `Damage.atk`，并在攻击成功后创建 8725 | `Damage.atk` 有魔法、光属性、武器伤害应用、damage reaction、push/lift、hit info 和 hit wav；不提供盒坐标。 |
| `Blood_An/darkfire4.obj` | 使用 `darkfire.atk`；`darkfire4.act` 有 `[ATTACKRECT] [RESET]`、行为编号随机、`[SET POS FORCE]` 与触发 ON/OFF | `darkfire.atk` 有 `[damage] -50`、魔法、暗属性、`[attack friend] 1` 等字段；hitbox 仍来自 `darkfire4.ani`。 |
| `Grim_seeker/fire2.act` | `[BASE ANI] Fire2.ani`；`[RANDOM SELECT] 8679 / 8680`；第 5 / 15 帧检查 monster 61150 | 8679 指向 `FireReady.obj` 并静态回到 `Fire2.act`，8680 指向 `FireReady2.obj -> Fire3.act`；`Fire2.ani` 24 帧均有 `[ATTACK BOX]`。 |
| `Grim_seeker/fire2_r.act` | `[BASE ANI] Fire2.ani`；`[RANDOM SELECT] 9136 / 9137` | 9136 指向 `FireReady_Riding.obj` 并静态回到 `Fire2_r.act`，9137 指向 `FireReady_Riding1.obj -> Fire3.act`；骑乘 `.atk` 为 physic/fire/burn。 |
| `Grim_seeker/Fire3.act` | `[BASE ANI] Fire2.ani`；第 5 / 15 帧检查 monster 61150；未观察到创建 passiveobject | 61150 走 `monster/monster.lst`；检查/restore 结构不改变 hitbox 来源。 |

## ActionObject act8 map hp/damage-box 抽样

| `.obj` | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `pirateonthetrain/nest.obj` | 8793 走 `passiveobject/passiveobject.lst`；对象挂 `[basic action] Action/nest.act`，不挂 `.atk`；action 在 `[ON DAMAGE]` 后播放粒子并 `[DESTROY]`。 | `nest.ani` 11 帧均有同组 `[DAMAGE BOX] -48 -8 -15 105 18 44`；未观察到 `[ATTACK BOX]`。 |
| `seatrainretaking/bike1.obj` | 10197 走 `passiveobject/passiveobject.lst`；对象不挂 `.act/.atk`，以 `[basic motion] Animation/bike1.ani` 直连 ANI。 | `bike1.ani` 单帧有 `[DAMAGE BOX] -60 -42 -7 115 81 73`；未观察到 `[ATTACK BOX]`。 |

## ActionObject common 抽样

| `.obj` | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `actionobject/common/bigboom.obj` | `[basic action] BigBoom.act`；`[attack info] BigBoom.atk` | `.atk` 有 `[absolute damage] 40000`、`[attack enemy]` 与 `[attack friend]`；攻击框不在 `.atk` 中。 |
| `bigboom.act` | BASE `Bigboom1.ani`；SUB `Bigboom2.ani`、`Bigboom3.ani`、`AntiairUpperQuake.ani`、`AntiairUpperQuake2.ani` | BASE 有 `[ATTACK BOX]`；四个 SUB ANI 抽样未观察到盒字段。 |
| `bigboom.act` | `[CHECK PARTYMEMBERS STATE]`、`[LOCK QUEST UNTIL]`、`[ATTACKRECT] [RESET]`、`[TRIGGER QUESTEVENT]`、`[DESTROY]` | 这些是 action 行为/触发字段，不是 hitbox 坐标。 |
| `actionobject/common/junktree.obj` | `[basic action] action/JunkTree.act`；`[attack info] attackInfo/JunkWagon.atk`；销毁块为 `[on end of animation]` | shared `.atk` 为 physic/no element/down 与 `damage bonus 70`；`JunkTree.ani` 的 FRAME000 有一条 `[ATTACK BOX]`，FRAME001 同时有 `[ATTACK BOX]` 与 `[DAMAGE BOX]`，FRAME002/003 仅观察到 `[DAMAGE BOX]`。 |
| `actionobject/common/junkwagon.obj` | `[basic action] action/JunkWagon.act`；复用 `attackInfo/JunkWagon.atk`；action 落地或攻击成功后执行粒子与 `[DESTROY]` | `JunkWagon.ani` 是两帧循环；每帧有三条 `[ATTACK BOX]` 与一条 `[DAMAGE BOX]`。同一 `.atk` 不等于同一 hitbox，必须按 owner action/ANI 分开读。 |
| `actionobject/common/deserter_Bomb.obj` | 9109 走 `passiveobject/passiveobject.lst`；对象挂 `deserter_Bomb.act` 与 `deserter_Bomb.atk`，并有 `[vanish on move collision] 0`；父 action 可创建 9110 后 `[DESTROY]`。 | 父 `Bomb.ani` 6 帧均有 `[DAMAGE BOX] -12 -10 -11 23 20 24`；未观察到 `[ATTACK BOX]`。父 `.atk` 不提供盒坐标。 |
| `actionobject/common/deserter_BombSub.obj` | 9110 由父 action 创建，回 passiveobject registry 命中；子对象挂 `deserter_BombSub.act` 与 `deserter_BombSub.atk`，子 `.atk` 为 physic/fire element/damage/push/lift 等 payload。 | 子 BASE `fireBomb_normal.ani` 的 FRAME001-003 有 `[ATTACK BOX]`；FRAME000、FRAME004-009 未观察到盒字段；两个 dodge SUB ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |

## ActionObject SPC 4season / cannontrap 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `SPC/4season/fairy_ok.obj` / `fairy_bad.obj` | basic action 分别为 `fairy_small_ok.act` / `fairy_small_bad.act`；共用 `attackinfo/body.atk`；etc action 指向 destroy action | BASE `fairy.ani` 每帧有 `[ATTACK BOX]`；SUB `HPFairyEF.ani` 和 destroy `FairyDestroy.ani` 未观察到盒字段。 |
| `SPC/4season/hp_create.obj` | `empty.act` 创建 11008 / 11009；自身不挂 `.atk` | `empty.ani` 是空图反样本；11008 / 11009 下游进入 fairy ok/bad。 |
| `SPC/_cannontrap/body.obj` | basic `Body.act`、last `Destroy.act`、etc `AttackMonster.act` / `AttackCharacter.act`；`.obj` 有 hp、team、sound category | `stay.ani` 和 `attack.ani` 有 `[DAMAGE BOX]`；下游创建 8044 发射物。 |
| `SPC/_cannonball/body.obj` | `Body.act` 在 `ZPOS <= 0` 或 `[ON ATTACKSUCCESS]` 时创建 8846 | `body.ani` 有 `[ATTACK BOX]`；8846 下游 `SmallBoom3` 的 `NapalmBombExplosion.ani` 也有 `[ATTACK BOX]`。 |
| `SPC/_airsword/airsword.obj` | basic `airsword.act`、`body.atk`；对象为 normal layer、pass all、piercing power `1000`，以 `[on end of animation]` 销毁；本小桶未观察到 homing、CREATE 或 SUMMON。 | `airsword.act` 只挂 BASE `airsword.ani`；`airsword.ani` 3 帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。相邻 `airsword_light.ani` 可反编译但未被 `airsword.act` 挂接，也未观察到盒字段。 |
| `SPC/_bal/body.obj` | basic `body.act`、`body.atk`；对象为 normal layer、pass all、piercing power `100`，以 `[on end of animation]` 销毁；本小桶未观察到 homing、CREATE 或 SUMMON。 | `body.act` 的 BASE upper ANI 5 帧均有同组 `[ATTACK BOX]`；SUB under ANI 5 帧未观察到盒字段。`.atk` 不提供 hitbox 坐标。 |
| `SPC/_bat/body.obj` | basic `body.act`、last `Destroy.act`、`attack.atk`；对象有 `[homing follow] [ENEMY]`、after-create `BAT_FLAP` 与 `[on end of animation]` 销毁块；本小桶未观察到 CREATE 或 SUMMON。 | `body.ani` 4 帧均有 `[ATTACK BOX]`；`destroy.ani` 无盒；`Destroy.act` 播放 `Destroy.ptl`，粒子侧车 `Feather1/2.ani` 无盒。 |
| `SPC/_burnfire/body.obj` | basic `body.act`、`attack.atk`；对象有 `[homing follow] [ENEMY]`、velocity `400 400`、check gap `100`、sync animation rotation `1`、max rotation `360`，after-create `LANTURN_FIRE` 与 `[on end of animation]` 销毁块；本小桶未观察到 CREATE 或 SUMMON。 | `body.ani` 2 帧均有同一组 `[ATTACK BOX] -19 -10 -15 32 20 31`；`.atk` 有 `[active status] [blind]` 与 `[burn]` payload，但不提供 hitbox 坐标。 |
| `SPC/_aganzo/action/body.act` | 仅观察到 action / attackinfo / ANI 三件套，未观察到同前缀 `.obj` owner；`body.act` 在攻击成功或 `time + 4000 <= GET TIME` 后执行 `[DESTROY]`，无 CREATE 或 SUMMON。 | `body.ani` 8 帧中 FRAME001-005 有攻击框，FRAME000/006/007 无盒；`.atk` 是 physic/no element/cut payload，不提供 hitbox 坐标。owner 未闭合，不能证明实机会创建该对象。 |
| `SPC/_darkcough/body.obj` | basic motion `Animation/body.ani`、attackinfo `body.atk`；对象为 normal layer、pass all、piercing power `100`、after-create `ELBON_WIND` 与 `[on end of animation]` 销毁块；本小桶未观察到 homing、CREATE 或 SUMMON。 | `body.ani` 13 帧中 FRAME001-008 有攻击框，FRAME000/009-012 无盒；该桶无 action 层，hitbox 直接来自 `.obj [basic motion]` 指向的 ANI。 |
| `SPC/_cypherelec/cypherelec.obj` / `cypherelec2.obj` / `cypherelec_item.obj` | 三个 owner 分别挂 `body.act` + `attack.atk`、`body2.act` + `attack2.atk`、`body3.act` + `attack_item.atk`；均有 `[homing follow] [ENEMY]`、velocity `250 0`、check gap `100000`、sync animation rotation `0`、max rotation `360`，并以 `[on end of animation]` 销毁；本小桶未观察到 CREATE 或 SUMMON。 | `body/body2.act` 指向 `body.ani`，`body3.act` 指向 `body2.ani`；两套 ANI 的 FRAME001-005 有 `[ATTACK BOX]`，FRAME000/006/007 无盒。`.atk` payload 和 homing 块不提供 hitbox 坐标。 |
| `SPC/_cyclone/body.obj` / `goldteida_effect.obj` / `short1.obj` / `short2.obj` | 四个 owner 挂 `HurricaneOfJudgement.act`，分别挂 `HurricaneOfJudgement.atk`、`HurricaneOfJudgement2.atk`、`Short1.atk`、`Short2.atk`；均有 `[homing follow] [ENEMY]` 与 on-end animation 销毁，body/short 为 velocity `150 150` check gap `500`，goldteida 为 velocity `250 250` check gap `300`。 | `HurricaneOfJudgement.ani` 11 帧均有攻击框；`.atk` damage bonus / absolute damage 与 homing 参数不提供 hitbox 坐标。 |
| `SPC/_cyclone/short1_1.obj` / `short2_1.obj` | 两个 `_1` owner 只挂 `HurricaneOfJudgement_opt.act`，未观察到对象级 `[attack info]` 或 homing；opt action FRAME0/1/2 创建 48117，FRAME3 销毁。 | BASE `HurricaneOfJudgement_3.ani` 是空图无盒反样本；48117 下游 `Short1.obj` 才回到有攻击框的主旋风 ANI。 |
| `SPC/_firewitch/ador/body.obj` | basic `body.act`、last `Destroy.act`、`attack.atk`；对象有 homing 和 on-end animation 销毁块；`Destroy.act` 同时创建 40002 并召唤 601 | `body.ani` 四帧均有 `[ATTACK BOX]`；`Destroy.ani` 无盒；40002 下游 `Common/FireExplosion.ani` 空图帧有 `[ATTACK BOX]`。 |
| `SPC/_firewitch/firebreath/body.obj` | basic `Body.act`、`Body.atk`；对象为 on-end animation 销毁，无 homing；action 在 5/7/9/11/13/15/17 帧执行 `[ATTACKRECT] [RESET]`。 | `Body.ani` FRAME000-017 均有攻击框，FRAME018-019 未观察到盒字段；本小桶未观察到创建下游对象。 |
| `SPC/_firewitch/meteo/body.obj` / `horobe1.obj` / `horobe2.obj` | 三者共用 `body.act` 与 `Destroy.act`，但分别挂 `attack.atk` / `horobe1.atk` / `horobe2.atk`。 | `body.ani` 三帧均有攻击框；`glow.ani` frame 007 有攻击框；`Destroy.act` 创建 8236，下游 Jeff_Omega_BigBoom action BASE/SUB 样本未观察到盒字段。 |
| `SPC/_firewitch/meteo/body_cyclops.obj` | basic `body_Cyclops.act`、last `Destroy_Cyclops.act`、`attack2.atk`；对象为 on-end animation 销毁。 | `body_cyclops.ani` 三帧均有攻击框；`Destroy_Cyclops.act` 创建 10027，下游 `Bigboom1_1.ani` frame 000-004 有攻击框。 |
| `SPC/rina/event_thunder.obj` | basic `Event_Thunder.act`、`Event_Thunder.atk`、team `100`；action FRAME9 销毁，本小桶未观察到 CREATE 或 SUMMON。 | `Event_Thunder.ani` FRAME000-006 有 `[ATTACK BOX]`，FRAME007-009 未观察到盒字段；多帧同帧多条攻击框。`.atk` 为 magic/no element/down 等 payload，不提供坐标。 |
| `SPC/rina/rocketblast.obj` | basic `RocketBlast.act`、`RocketBlast.atk`、team `0`；action BASE `RocketBlast1.ani`、SUB `RocketBlast2.ani`，FRAME6 销毁。 | `RocketBlast1.ani` FRAME001-003 有同组攻击框，FRAME000/004-006 无盒；`RocketBlast2.ani` FRAME000 有一条攻击框，FRAME001-004 每帧两条攻击框，FRAME005-006 无盒。 |
| `SPC/rina/rosiclockball.obj` | basic `RosiClockBall.act`、`RosiClockBall.atk`，有 `[homing follow] [ENEMY]`、velocity `10 10`、check gap `100`、sync `1`、homing time `50000`；action FRAME6 或攻击成功后销毁。 | `RosiClockBall.ani` 4 帧均有同组 `[ATTACK BOX] -22 -22 -22 44 45 41`；homing 与 `.atk` payload 不提供 hitbox 坐标。 |
| `SPC/rina/skypotel.obj` | basic `skypotel.act`，未观察到对象级 `[attack info]`；action FRAME0/1 使用 `[SUMMON MASTER]` 执行 `[SET SPEED]` X `1200`、Z `600`。 | `skypotel.ani` 3 帧为空图，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；`[SUMMON MASTER]` 不是 `[SUMMON MONSTER]`，不走 monster registry。 |
| `SPC/laowu/laowu.obj` | basic `buff.act`，未观察到对象级 `.atk`、homing、CREATE 或 SUMMON；action BASE `buff_normal_front.ani`，SUB `buff_front.ani`，`SUB ANI WITH XYZ` 指向 `buff_back.ani` 与 `buff_normal_back.ani`；`CHECK TIME 500` 后检查 AI CHARACTER 21401，失败后销毁。 | 四个 action-linked buff ANI 均为 6 帧表现层，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；21401 走 aicharacter registry，不替代 hitbox。 |
| `SPC/laowu/action/empty01.act` | 文件存在但 owner 搜索未命中；BASE `SpecialBalloon.ani`、SUB `AvalancheBalloon.ani`，FRAME1 对自身执行 `[DESTROY]`。 | 两个 balloon ANI 均为 2 帧界面气泡表现，未观察到盒字段；owner 未闭合时不能挂到 `laowu.obj`。 |
| `SPC/mesteria/halloweenbuster.obj` | 11012 回 passiveobject registry 命中；owner 挂 `Action/HalloweenBuster1.act`、`AttackInfo/HalloweenBuster.atk` 与两个 etc motion，未观察到对象级 homing、销毁块或 SUMMON。 | BASE `HalloweenBuster1.ani` 四帧均有 `[ATTACK BOX] -25 -14 -28 54 28 57`；SUB `HalloweenBuster2.ani` / `HalloweenBuster3.ani` 未观察到盒字段。`.atk` payload 不提供坐标。 |
| `SPC/mesteria/halloweenbuster1.act -> 40005` | `ZPOS <= 5` 且 limit `1` 后创建 40005，创建块为空 particle、level `70`、pos `0 0 0`，随后 `[DESTROY]`；40005 回 passiveobject registry 命中 `Common/ShootingStarExp.obj`。 | 40005 下游 `ShootingStarExp.ani` 单帧空图有 `[ATTACK BOX] -100 -30 -20 200 60 40`；同号存在其他 registry 碰撞，但创建上下文按 passiveobject 解释。 |
| `SPC/mesteria/halloweenbuster1.act` 粒子行为 | FRAME0/1/2 均执行行为 1；行为 1 播放 8 组 `ShootingStarFire.ptl`，偏移分别为 `0 0 0`、`5 0 0`、`-5 0 0`、`10 0 5`、`-10 0 5`、`-15 0 0`、`15 0 10`、`-10 0 10`。 | `ShootingStarFire.ptl` 引用 `ShootingStar1.ani` / `ShootingStar2.ani`，当前样本未观察到盒字段；粒子播放不替代 hitbox。 |
| `SPC/mesteria/HalloweenBusterSub.*` | 同前缀存在 `AttackInfo/HalloweenBusterSub.atk` 与 `Animation/HalloweenBusterSub.ani`，`HalloweenBusterSub.ani` 单帧有 `[ATTACK BOX] -120 -50 0 240 100 100`。 | owner 搜索只命中 `character/mage/halloweenbustersub.obj`，未命中 mesteria owner；不能写成 `halloweenbuster.obj` 的 action-linked hitbox。 |

## ActionObject SPC Jackie / sjar 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `SPC/jackie/frenken_ball.obj` | `Ball_Throw.act`；`Ball_Bomb.atk`；对象有 `[is hp by difficulty]` | `Ball_Throw.ani` 有 `[DAMAGE BOX]`；action 可创建 16070/16071。 |
| `SPC/jackie/frenken_ball_count.obj` | `Ball_Count.act`；`Ball_Bomb.atk` | `Ball_Count.ani` 有 `[DAMAGE BOX]`；`Ball_count_e.ani` 未观察到盒字段。 |
| `SPC/jackie/frenken_ball_count_bomb.obj` | `Ball_Bomb.act`；`Ball_Bomb.atk` 含 `[active status] [lightning]` | BASE/SUB 爆炸视觉 ANI 未观察到盒字段；但 action 可创建 8580，下游 `_Bigboom1.ani` 有 `[ATTACK BOX]`。 |
| `Monster/cartelcommand/robot.obj` | 9950 下游对象；`[basic action] Action/robot.act`；不挂 `.atk` | `robot.act` 的 BASE `robot.ani` 和 SUB `die_eff2.ani` 均可反编译，样本帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；9950 静态链不提供攻击盒正样本。 |
| `Common/GuardianGrenadeNoneBomb.obj` | 8568 下游对象；`[basic action] Action/GranadeExplosion.act`；`[attack info] AttackInfo/GuardianGrenadeExplosion.atk` | `.atk` 为 magic/no element/down 与击退/浮空等攻击信息；hitbox 坐标来自 BASE `GrenadeNoneBomb.ani`，SUB `GrenadeNoneBombEffect.ani` 未观察到盒字段。 |
| `SPC/despair_tower/sjar_coin_bom.obj` | etc action 分到 `sjar_bom_ok.act` / `sjar_bom_bad.act`；本体不挂 `.atk` | coin appear/ok/bad ANI 均未观察到盒字段；ok 创建 9202，bad 创建 8376。 |
| `SPC/despair_tower/ZDrop -> ZGT -> ZMissile -> ZMissileExp` | 9202 -> 9203 -> 9204 -> 9206；末层 `JeffMissileEXP.atk` 有 `[absolute damage]` | 中间 `MechaDrop*`、`dumy2`、`WarningMark`、`Missile.ani` 未观察到盒字段；末层 `JeffMissileEXP.ani` 有多条 `[ATTACK BOX]`。 |
| `Trap/MinePressure2 -> Common/MineExplosion2` | 8376 -> 8375；`MinePressure.atk` 只见 `[damage reaction] [none]`；8375 的 `MineExplosion2.atk` 为 damage `1000`、magic、fire、push/lift `50/100`、blow、no blood `100 1.0`。 | `MineAlram2.ani` FRAME000/001 均为 `[ATTACK BOX] -16 -10 -6 31 20 20`；common `FireExplosion.ani` FRAME000 为 `[ATTACK BOX] -65 -40 -50 130 80 100`，粒子 SUB ANI 未观察到盒字段。 |
| `_NewHell/Agaress_Hell/darkfireshoot.act` | `[RANDOM SELECT] 16031 / 16052 / 16053`；三个候选攻击成功后创建 16051 | 源发射 BASE/SUB ANI 无盒；`darkfire1/2/3/4.ani` 有 `[ATTACK BOX]`；`darkfire1/2/3/4sub.ani` 未观察到盒字段。 |

## ActionObject SPC _avengers 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `_avengers/alectoball/body.obj` | basic `Body.act`、last `last.act`、`Body.atk`；对象有 `[object destroy condition] [on end of animation]`，basic action 攻击成功后 `[DESTROY]`。 | owner `Body.ani` 6 帧均有同组 `[ATTACK BOX]`；`last.ani` 单帧也有同组 `[ATTACK BOX]`。 |
| `_avengers/alectoball/last.act -> 46004` | `last.act` 在 FRAME0 创建 46004；46004 回 passiveobject registry 命中 `Common/LightExplosion.obj`，在 monster registry 未命中。 | 46004 下游 `LightExplosion.obj` 以 `[basic motion] Animation/LightExplosion.ani` 直连 ANI，并挂 `LightExplosion.atk`；单帧空图 ANI 有 `[ATTACK BOX] -65 -45 -50 130 90 100`。 |
| `_avengers/firerain/body.obj` | basic `Body.act`、`Body.atk`；对象有 `[object destroy condition] [on end of animation]`，action 在攻击成功或 ZPOS 条件后创建 8387 并 `[DESTROY]`。 | owner `Body.ani` 4 帧均有同组 `[ATTACK BOX] -47 -55 -29 80 109 106`。 |
| `_avengers/firerain/body.act -> 8387` | 8387 回 passiveobject registry 命中 `ActionObject/Common/ExpLand.obj`，在 monster registry 未命中；下游挂 `ExpLand.act` 与 `TempesterMissileExp.atk`。 | 下游 BASE `ExpLandDodge.ani` FRAME000-004 有多条 `[ATTACK BOX]`，FRAME005-006 未观察到盒字段；SUB `ExpLandNormal.ani` 7 帧未观察到盒字段。 |
| `_avengers/*reviver` | `alectoreviver` / `tisponereviver` / `megairareviver` action 在 FRAME10 先用 `[WHICH] [MONSTER] [IS INDEX]` 检查，再 `[SUMMON MONSTER] [INDEX] 61347/61348/61349`，随后 `[DESTROY]`。 | Alecto / Megaira reviver 的 body/count ANI 未观察到盒字段；Tispone reviver body ANI 11 帧均有 `[DAMAGE BOX]`，count ANI 未观察到盒字段。召唤 ID 走 monster registry，不走 passiveobject registry。 |

## ActionObject SPC _cursequeen/void 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `_cursequeen/void/body.obj` | basic `Priest_ball1_start.act`，etc `Priest_ball1_loop.act` / `Priest_ball1_end.act`，`attack.atk`；对象有 `[homing follow] [ENEMY]` 与 `[time limite] 5000` 销毁条件。 | `Void_start_lineardodge.ani` FRAME000-002 均有 `[ATTACK BOX] -20 -8 -20 40 16 40`；`Void_loop_lineardodge.ani` FRAME000-003 均有 `[ATTACK BOX] -33 -10 -35 69 20 68`；`Void_start_normal.ani`、`Void_loop_normal.ani` 与 `Void_end_lineardodge.ani` 未观察到盒字段。 |
| `_cursequeen/void/pursuit1.obj` / `pursuit2.obj` | 二者均走 `Priest_ball2_start.act`、`Priest_ball2_loop.act`、`Priest_ball2_end.act`；分别挂 `pursuit_attack1.atk` / `pursuit_attack2.atk`，绝对伤害列为 1200 / 600。 | `2Void_start_lineardodge.ani` FRAME000-002 与 `2Void_loop_lineardodge.ani` FRAME000-003 均有 `[ATTACK BOX] -19 -8 42 40 16 40`；对应 normal SUB 与 `2Void_end_lineardodge.ani` 未观察到盒字段。 |
| `_cursequeen/void` action 行为层 | start action 在 FRAME2 `[SET ACTION] [CUSTOM] 0 [NOW]`；loop action 在 FRAME0 `[ATTACKRECT] [RESET]`；end action 在 FRAME2 `[DESTROY]`。 | `[ATTACKRECT] [RESET]` 是 action 行为字段，不替代 ANI 帧级 `[ATTACK BOX]`；本小桶未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 |

## ActionObject SPC _cursequeen/spire 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `_cursequeen/spire/body.obj` | basic `Action/body.act`，attackinfo `AttackInfo/attack.atk`；对象还有 particle `belzebuite_overskill_dark.ptl` 和 `[time limite] 5000` 销毁条件。 | `body.ani` 只有 FRAME000，且该帧有 `[ATTACK BOX] -178 -100 -13 348 200 81`。 |
| `_cursequeen/spire/attack.atk` | magic / dark element，damage bonus `50`，weapon damage apply `1`，attack enemy `1`，并有 curse、slow、armor break 三段 `[active status]`。 | `.atk` payload 不提供 hitbox 坐标；命中盒仍以 ANI 帧级字段为准。 |
| `_cursequeen/spire` particle 侧车 | `belzebuite_overskill_dark.ptl` 指向 `../Animation/belzebuite_overskill_dark.ani`，该 ANI 为 4 帧表现动画。 | dark ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；它是表现资源链样本，不是当前样本命中盒来源。 |

## ActionObject SPC _cursequeen/cry 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `_cursequeen/cry/body.obj` / `body_tower.obj` | 二者均挂 `AttackInfo/attack.atk` 和四条粒子侧车；`body.obj` 走 `Action/body.act` 且 time-limit `10000`，`body_tower.obj` 走 `Action/body_Tower.act` 且 time-limit `4500`。 | 共用 `body.ani`：2 帧 loop 空图，FRAME000-001 均有 `[ATTACK BOX] -155 -46 -65 305 50 129`。 |
| `_cursequeen/cry/body.act` / `body_Tower.act` | 两个 action 内容同形，BASE `../Animation/body.ani`，FRAME0 触发 `FLASH SCREEN` 并执行 `[ATTACKRECT] [RESET]`。 | `[ATTACKRECT] [RESET]` 是 action 行为字段，不替代 ANI 帧级 hitbox；坐标仍取 `body.ani`。 |
| `_cursequeen/cry/attack.atk` | magic / dark element，weapon damage apply `1`，attack enemy `1`，blow / no blood / push aside / lift up，并有 curse `[active status]`。 | `.atk` payload 不提供 hitbox 坐标；异常状态触发也不能由静态只读证明实机效果。 |
| `_cursequeen/cry` particle / adjacent ANI | part / inazuma / exp / dark 四条粒子侧车挂接的 ANI 均可读；同目录 `circle_of_magic_1/2/3.ani` 可读但当前未在 owner/action/particle 链中观察到挂接。 | 粒子挂接 ANI 与未挂接 circle ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；不能替代 owner-linked `body.ani` hitbox。 |

## ActionObject Monster at_5t_walker rocket 子链抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `at_5t_walker/rocket1.obj` | `Action/rocket1.act` 指向 `rocket1.ani`，并挂 `rocket1.atk`；action 在 `ZPOS >= 350` 后三次创建 10263。 | `rocket1.ani` 可反编译，但未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；父层仍可通过 action 创建下游 `rocket2.obj`。 |
| `at_5t_walker/rocket2.obj` | `Action/rocket2.act` 指向 `rocket2.ani`，并挂 `rocket2.atk`；action 在 `ZPOS <= 20` 后创建 10267，且攻击成功后检查 monster 61236。 | `rocket2.ani` 单帧有 `[ATTACK BOX] -18 -6 -9 35 12 19`。`.atk` 与 ANI 盒坐标分层记录。 |
| `at_5t_walker/rocketboom.obj` / `rocketboom1.obj` | 二者共用 `Action/rocketboom.act`；分别挂 `JeffMissileEXP.atk` / `JeffMissileEXP1.atk`。 | BASE `JeffMissileEXP.ani` FRAME000 有 2 条攻击盒，FRAME001-003 各有 3 条攻击盒；FRAME004-005 未观察到盒字段。SUB `JeffMissileEXP1/2/3.ani` 未观察到盒字段。 |
| `at_5t_walker/rocketboom.act` 行为层 | 攻击成功后检查 61236 并执行 `[RESTORE] [HP] -1 [%]`；ON SET ACTION 后 `[SET TEAM] 0`；FRAME5 `[DESTROY]`。 | 这些是 action 行为字段，不替代 ANI hitbox；扣血、队伍切换、销毁时序和命中条件需实机验证。 |

## ActionObject Monster at_5t_walker fire / bullet / missile / exp 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `at_5t_walker/fire.obj` | `Action/fire.act` 指向 `fire.ani`，并挂 `fire.atk`；action 在 FRAME3/5/7/9/11/13/15 执行 `[ATTACKRECT] [RESET]`，攻击成功后检查 monster 61236。 | `fire.ani` FRAME000-016 观察到 `[ATTACK BOX]`，FRAME017-020 未观察到盒字段；`.atk` 为 magic/fire/damage 等 payload，不提供盒坐标。 |
| `at_5t_walker/bullet.obj` / `bullet1.obj` | 分别挂 `BulletMusket.atk` / `BulletMusket1.atk`；两者 action 均指向 BASE `Bullet.ani` 和 SUB `Bullet1.ani`，攻击成功后检查 61236。 | `Bullet.ani` 三帧均有 `[ATTACK BOX] -16 -12 -16 32 24 32`；`Bullet1.ani` 三帧未观察到盒字段。`CHECKUP OBJECT RANDOM SELECT` 是检查对象候选，不是 passiveobject ID。 |
| `at_5t_walker/bullet.obj [etc action] -> hit.act` | etc action 只指向 `hit.ani`，不挂独立 `.atk`。 | `hit.ani` 两帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；不能从 basic bullet 的 hitbox 继承到 etc hit。 |
| `at_5t_walker/bombingmissile.obj` | `Action/BombingMissile.act` 指向 `BombingMissile.ani`，并挂 `JeffMissile_Oblique.atk`；ZPOS 条件后创建 10284。 | `BombingMissile.ani` 单帧有 `[ATTACK BOX] -12 -6 -24 30 12 49`；10284 下游是 `rocketboom1.obj`，下游 hitbox 仍按 `rocketboom.act` / `JeffMissileEXP.ani` 另算。 |
| `at_5t_walker/exp.obj` | `Action/Exp.act` 指向 BASE `ATExpNormal.ani`，SUB `ExpNormal.ani` / `ATExpDodge.ani`，并挂 `Exp_attack.atk`；FRAME1 创建 8715。 | `ATExpNormal.ani` FRAME000-005 有攻击框，FRAME006-007 无盒；`ExpNormal.ani` 11 帧和 `ATExpDodge.ani` 8 帧未观察到盒字段。 |
| `Exp.act -> 8715 -> GiselleFloor.obj` | 8715 回 passiveobject registry 命中 `ActionObject/Monster/Giselle/GiselleFloor.obj`；下游 `Floor.act` 指向 `ExpFloorNormal.ani` / `ExpFloorDodge.ani`，挂 `Floor_attack.atk`。 | `ExpFloorNormal.ani` FRAME001-002 有 `[ATTACK BOX] -77 -10 -4 156 20 13`；`ExpFloorDodge.ani` 四帧未观察到盒字段。8715 raw path 含 `Monster` 但 registry 仍是 passiveobject。 |

## ActionObject Monster at_5t_walker special 批量投放抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `at_5t_walker/special.obj` | `Action/special.act` 指向 BASE `special.ani`，SUB `special1.ani` / `special2.ani`；对象级 `[attack info]` 为空字符串。 | 三个 special ANI 均为单帧 MechaDropShadow 图像，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；special 自身不是 hitbox 正样本。 |
| `special.act -> 10268` | 2 秒条件后 16 次创建 10268，创建块含空粒子、level `0`、`[USE MAP POS]`、`[WARNING MARK] 0 0` 和三组随机位置列。 | 10268 回 passiveobject registry 命中 `at_5t_walker/BombingMissile.obj`；hitbox 来自下游 `BombingMissile.ani` 单帧攻击框。 |
| `10268 BombingMissile.obj -> BombingMissile.act -> 10284` | 10268 下游对象挂 `JeffMissile_Oblique.atk`；低 Z 条件后继续创建 10284 `rocketboom1.obj`。 | special 链可静态串到已闭合的 bombingmissile/rocketboom1 分支；实际 16 发投放时序、地图坐标、预警表现和落地命中需实机验证。 |

## ActionObject Monster at_5t_walker barr / destroy / smoke 抽样

| 起点 | action / attackinfo | hitbox 观察 |
| --- | --- | --- |
| `at_5t_walker/barr.obj` / `barr1.obj` / `barr2.obj` | 三者对象级 `.atk` 均为空字符串；均为 `[pass type] [do not pass]`、`[is blocking obj] 1`、`[hp max] 100000`、`[hp destroy] 1`，并引用 `Particle/barrdestroy.ptl`。 | 三者通过 `[basic motion]` 直连 `barr.ani` / `barr1.ani` / `barr2.ani`；三个 ANI 均为单帧 `[DAMAGE BOX]`，未观察到 `[ATTACK BOX]`。这是 blocking/damage-box 样本，不是攻击输出样本。 |
| `barr* [can beat index] 61235` | 61235 回 `monster/monster.lst` 命中 AT-5T，主目标 passiveobject registry 未命中。 | `can beat index` 中的数字按 monster registry 记录；不写成 passiveobject 创建链。 |
| `at_5t_walker/destroy.obj -> destroy.act` | object `.atk` 为空，action FRAME0 播放 `../particle/destroy.ptl`；未观察到 `[CREATE PASSIVEOBJECT]` 或 `[ATTACKRECT]`。 | `destroy.ani` 是单帧空图，无 `[ATTACK BOX]` / `[DAMAGE BOX]`；粒子播放不替代 hitbox。 |
| `at_5t_walker/destroydust.obj` / `shootsmoke.obj` | 二者 `.atk` 为空，均以 `[basic motion]` 直连表现 ANI。 | `destroydust.ani` 22 帧和 `shootsmoke.ani` 6 帧均未观察到盒字段；它们是表现层反样本。 |

## 递归创建锚点

| ID | registry 解析结果 | 样本意义 |
| ---: | --- | --- |
| 8767 | `ActionObject/Act8/Map/pirateonthetrain/enginecover_crochan2.obj` | `enginecover_crochan1.act` 创建的下一层对象。 |
| 8766 | `ActionObject/Act8/Map/pirateonthetrain/enginecover_crochan.obj` | `enginecover_crochan2.act` 可再次创建源对象样对象，提示可能形成循环/往返链。 |
| 8561 | `ActionObject/Monster/GuardianGoblin/SpearJailDust.obj` | 同一行为块中可创建其他 passiveobject 前缀对象。 |
| 10185 | `ActionObject/Act8/Map/pirateonthetrain/enginecover_1.obj` | `enginecover_2.act` 样本中的创建目标。 |
| 48198 | `Common/FireExplosionItemAttack8.obj` | `fireexplosioncreater.act` 创建的下游攻击对象；父对象 ANI 无盒，下游 ANI 有 `[ATTACK BOX]`。 |
| 8770 | `ActionObject/Act8/Map/pirateship/fire.obj` | `pirate_ship.act` 创建的火焰阶段对象。 |
| 8755 | `ActionObject/Act8/Map/pirateship/pirate_bomb_drop.obj` | `fire.act` 创建的掉落炸弹阶段对象。 |
| 8778 | `ActionObject/Act8/Map/pirateship/pirate_ship_bomb.obj` | `pirate_bomb_drop.act` 创建的末层爆炸对象，爆炸 ANI 已有攻击框正样本。 |
| 48163 | `Monster/HeadlessKnight/Horse_item.obj` | `actionobject/monster/3headlessknight.act` 创建的下游 passiveobject；raw path 含 `Monster/` 但仍来自 passiveobject registry。 |
| 11008 | `ActionObject/SPC/4season/fairy_ok.obj` | `4season/empty.act` 创建的 ok fairy 对象。 |
| 11009 | `ActionObject/SPC/4season/fairy_bad.obj` | `4season/empty.act` 创建的 bad fairy 对象。 |
| 8044 | `ActionObject/SPC/_Cannonball/Body.obj` | `_cannontrap` 攻击动作创建的发射物对象。 |
| 8846 | `ActionObject/Common/SmallBoom3.obj` | `_cannonball` 落地或攻击成功后创建的 common 爆炸对象。 |
| 16070 | `ActionObject/SPC/Jackie/Frenken_Ball_Count.obj` | Jackie 球体落地后进入倒数对象。 |
| 16071 | `ActionObject/SPC/Jackie/Frenken_Ball_Count_Bomb.obj` | Jackie 球体链进入爆发对象。 |
| 8004 | `ActionObject/Common/JunkTree.obj` | `tree_thrower` 三个 source action 在第 4 帧创建的树对象；对象复用 `JunkWagon.atk`，但 hitbox 来自 `JunkTree.ani`。 |
| 8000 | `ActionObject/Common/JunkWagon.obj` | 与 8004 共享 `JunkWagon.atk` 的兄弟对象；hitbox 来自 `JunkWagon.ani`，生命周期由自身 action 的 `[DESTROY]` 行为闭合。 |
| 8793 | `ActionObject/Act8/Map/pirateonthetrain/nest.obj` | hp destroy 0 的静态 registry 锚点；当前未观察到由 `[CREATE PASSIVEOBJECT]` 创建。 |
| 10197 | `ActionObject/Act8/Map/seatrainretaking/bike1.obj` | basic motion 直连 ANI 的静态 registry 锚点；当前未观察到由 `[CREATE PASSIVEOBJECT]` 创建。 |
| 9109 | `ActionObject/Common/deserter_Bomb.obj` | 父对象 registry 锚点；其 action 可创建 9110。 |
| 9110 | `ActionObject/Common/deserter_BombSub.obj` | `deserter_Bomb.act` 创建的下游爆炸对象；攻击框来自子 BASE ANI。 |
| 46004 | `Common/LightExplosion.obj` | `_avengers/alectoball/last.act` 创建的 common 直连 motion 对象；`LightExplosion.ani` 单帧有攻击框。 |
| 8387 | `ActionObject/Common/ExpLand.obj` | `_avengers/firerain/body.act` 创建的 actionobject/common 下游对象；BASE `ExpLandDodge.ani` 有攻击框，SUB `ExpLandNormal.ani` 无盒样本。 |
| 9950 | `ActionObject/Monster/cartelcommand/robot.obj` | Jackie 爆炸 action 在特定 monster 检查后创建的 passiveobject；raw path 含 `Monster` 但仍走 passiveobject registry。下游只读闭合到 `Action/robot.act -> robot.ani / die_eff2.ani`，未观察到 `.atk` 或 ANI 盒字段。 |
| 8580 | `ActionObject/Common/BigBoom2.obj` | Jackie 爆炸 action 在特定 monster 检查后创建的 common 爆炸对象。 |
| 9202 | `ActionObject/SPC/Despair_tower/ZDrop.obj` | sjar ok 分支创建的 ZDrop 对象。 |
| 8376 | `ActionObject/Trap/MinePressure2.obj` | sjar bad 分支创建的 trap 对象。 |
| 8375 | `ActionObject/Common/MineExplosion2.obj` | MinePressure2 激活后创建的 common 爆炸对象。 |
| 9203 | `ActionObject/SPC/Despair_tower/ZGT.obj` | ZDrop action 创建的下一层对象。 |
| 9204 | `ActionObject/SPC/Despair_tower/ZMissile.obj` | ZGT action 创建的导弹对象。 |
| 9206 | `ActionObject/SPC/Despair_tower/ZMissileExp.obj` | ZMissile 落地或攻击成功后创建的爆炸对象。 |
| 16075 | `ActionObject/Monster/timegate/TimeLord/Chain.obj` | TimeLord chain 父对象，`Chain_start.act` 可创建 16080。 |
| 16080 | `ActionObject/Monster/timegate/TimeLord/Chain2.obj` | TimeLord chain 下游对象，挂多 action、`Chain.atk` 与 action 内 `Chain_stay.atk`。 |
| 8718 | `ActionObject/Monster/Blood_An/darkfire1.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 8719 | `ActionObject/Monster/Blood_An/darkfire2.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 8720 | `ActionObject/Monster/Blood_An/darkfire3.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 8725 | `ActionObject/Monster/Blood_An/darkfire4.obj` | `darkfire1/2/3.act` 攻击成功后创建的下游对象。 |
| 8679 | `ActionObject/Monster/Grim/Grim_seeker/FireReady.obj` | `fire2.act` 的随机 passiveobject ID 候选之一；basic action 静态回到 `Fire2.act`。 |
| 8680 | `ActionObject/Monster/Grim/Grim_seeker/FireReady2.obj` | `fire2.act` 的随机 passiveobject ID 候选之一；basic action 进入 `Fire3.act`。 |
| 9136 | `ActionObject/Monster/Grim/Grim_seeker/FireReady_Riding.obj` | `fire2_r.act` 的随机 passiveobject ID 候选之一；basic action 静态回到 `Fire2_r.act`。 |
| 9137 | `ActionObject/Monster/Grim/Grim_seeker/FireReady_Riding1.obj` | `fire2_r.act` 的随机 passiveobject ID 候选之一；basic action 进入 `Fire3.act`。 |
| 16031 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire1.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 16052 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire2.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 16053 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire3.obj` | `darkfireshoot.act` 的随机 passiveobject ID 候选之一。 |
| 16051 | `ActionObject/SPC/_NewHell/Agaress_Hell/darkfire4.obj` | `darkfire1/2/3.act` 攻击成功后创建的下游对象。 |
| 40005 | `Common/ShootingStarExp.obj` | `mesteria/HalloweenBuster1.act` 在 `ZPOS <= 5` 条件后创建的 common 下游对象；`ShootingStarExp.ani` 单帧有攻击框。 |
| 8153 | `ActionObject/BreakableObject/IceFlower.obj` | `flowermanager.act` 创建且 `icedropmanager.act` 以 `[WHICH] [PASSIVE] [IS INDEX]` 检查的边界目标；当前只登记最小对象字段，不展开 BreakableObject 子线。 |
| 8023 | `ActionObject/SPC/IceDrop.obj` | `icedropmanager.act` 与 5 个 `RunningIceDrop*.act` 创建的 IceDrop 下游；`IceDrop.obj -> IceDrop.act -> Blizzard_Big.ani` 有攻击框，`.atk` 不提供坐标。 |
| 8236 | `ActionObject/Monster/Jeff/Jeff_Omega_BigBoom.obj` | `_firewitch/meteo/Destroy.act` 创建的 Jeff 下游对象；source destroy ANI 无盒，下游对象未观察到对象级 `.atk`，BASE/SUB ANI 样本未观察到盒字段。 |
| 10027 | `ActionObject/Monster/Jeff/BigBoom.obj` | `_firewitch/meteo/Destroy_Cyclops.act` 创建的 Jeff 下游对象；对象挂 `Big.atk`，BASE `Bigboom1_1.ani` 有攻击框。 |
| 12600 | `ActionObject/Monster/AdvanceAltar/LgExp_Lv1.obj` | `bomb1_Lv1.act` FRAME6 创建的下游爆炸对象；raw path 含 `Monster` 但仍走 passiveobject registry。 |
| 12646 | `ActionObject/Monster/AdvanceAltar/LgExp_Lv2.obj` | `bomb1_Lv2.act` FRAME6 创建的下游爆炸对象。 |
| 12647 | `ActionObject/Monster/AdvanceAltar/LgExp_Lv3.obj` | `bomb1_Lv3.act` FRAME6 创建的下游爆炸对象。 |
| 12648 | `ActionObject/Monster/AdvanceAltar/LgExp_Lv4.obj` | `bomb1_Lv4.act` FRAME6 创建的下游爆炸对象。 |
| 10263 | `ActionObject/Monster/at_5t_walker/rocket2.obj` | `rocket1.act` 在高 Z 条件后三次创建的下游对象。 |
| 10267 | `ActionObject/Monster/at_5t_walker/rocketboom.obj` | `rocket2.act` 在低 Z 条件后创建的爆炸对象。 |
| 10268 | `ActionObject/Monster/at_5t_walker/BombingMissile.obj` | `special.act` 在 2 秒条件后 16 次创建的导弹对象；该对象再按自身 action 创建 10284。 |
| 10284 | `ActionObject/Monster/at_5t_walker/rocketboom1.obj` | `BombingMissile.act` 在低 Z 条件后创建的 sibling 爆炸对象；这是独立于 `rocket1 -> rocket2 -> rocketboom` 的分支。 |
| 8715 | `ActionObject/Monster/Giselle/GiselleFloor.obj` | `at_5t_walker/Exp.act` FRAME1 创建的 GiselleFloor 下游对象；raw path 含 `Monster` 但仍走 passiveobject registry。 |
| 30550 | `Monster/Spirit/FireExplosion.obj` | `_gligexp/Body.act` FRAME1-3 多次创建的下游对象；下游 basic motion `FireExplosion.ani` 单帧有攻击框，raw path 含 `Monster` 但仍按 passiveobject registry 解释。 |
| 8036 | `ActionObject/SPC/_CypherElec/CypherElec.obj` | `_cypherobjectfriend/attack.act` FRAME6 创建的下游追踪闪电对象；下游 `body.ani` FRAME001-005 有攻击框，父 `attack.ani` / `attack_glow.ani` 也有攻击框。 |
| 8035 | `ActionObject/SPC/_CypherObject2/CypherObject.obj` | `cypher/comein.act` 上游动作创建的凳子对象；父 `attack.ani` / `attack_glow.ani` 有攻击框，并在 `attack.act` FRAME6 继续创建 8036。 |
| 16068 | `ActionObject/Monster/New_Event/CypherElec0.obj` | `dual_face/p1_attack.act`、`p2_attack.act` 与 `dual_face2/action/attack.act` 创建的闪电球对象；`body0.ani` FRAME001-005 有攻击框。 |
| 16152 | `ActionObject/Monster/New_Event/CypherElec1.obj` | 物理对象和 passiveobject registry 均可读；`body1.ani` FRAME001-005 有攻击框，但当前未观察到主目标创建入口。 |
| 16155 | `ActionObject/Monster/New_Event/AirSword00.obj` | `dual_face/p1_attack2_l.act`、`p2_attack2_r.act` 与 `dual_face2/action/attack2_l.act` / `attack2_r.act` 创建的旋风剑对象；start/stay 两个 BASE ANI 每帧均有同形攻击框。 |
| 16153 | `ActionObject/Monster/New_Event/Missile0.obj` | 物理对象和 passiveobject registry 均可读；`BossMissile0.ani` 3 帧均有攻击框，但当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。 |
| 16154 | `ActionObject/Monster/New_Event/Assault_Missile0.obj` | `zx_77/action/casting.act` / `casting1.act` 创建的追踪炮弹对象；BASE `Missile10.ani` 两帧有攻击框，SUB `Missile20.ani` 和 last action 爆炸表现无盒。 |
| 16157 | `ActionObject/Monster/New_Event/Hgoblin_Laser.obj` | `zx_77/action/attack.act` / `attack1.act` 创建的激光对象；BASE `laser_dodge.ani` 的 FRAME001-006 有同形攻击框，两个 SUB `laser_dodge1/2.ani` 无盒。 |
| 16167 | `ActionObject/Monster/New_Event/Boss_Command.obj` | 地图 `[passive object]` 静态放置和 source action passive 检查对象；linked `Boss_Command_test/test2/test3.ani` 均无攻击框或伤害框，未观察到 `.atk` owner；同前缀 `Boss_Command.ani` 物理可读但未观察到脚本挂接且无盒。 |
| 16161 | `ActionObject/Monster/New_Event/Zx-69_Dorp.obj` | `dual_face/p1_zx_69_summon.act` 与 `dual_face2/zx_69_summon_l/r.act` 创建的落地召唤门对象；basic/last linked ANI 均未观察到攻击框或伤害框，FRAME28 召唤 61650 后自毁。 |
| 16181 | `ActionObject/Monster/New_Event/Zx-69_Dorp1.obj` | `dual_face/p2_zx_69_summon.act` 创建的同形落地召唤门对象；basic/last linked ANI 均未观察到攻击框或伤害框，FRAME28 召唤 61656 后自毁。 |
| 16156 | `ActionObject/Monster/New_Event/ExpAir.obj` | 物理对象和 passiveobject registry 均可读；当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。BASE `ExpAirDodge.ani` FRAME000-004 每帧 3 条攻击框，SUB `ExpAirNormal.ani` 无盒。 |
| 16158 | `ActionObject/Monster/New_Event/G_main.obj` | 物理对象和 passiveobject registry 均可读；当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。linked `G_main_0/1/2/3.ani` 与 last `G_Last.ani` 均无攻击框或伤害框。 |
| 16159 | `ActionObject/Monster/New_Event/G_main_s.obj` | 物理对象和 passiveobject registry 均可读；当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。linked `G_main_s_0/1/2/3.ani` 与 last `G_Last_s.ani` 均无攻击框或伤害框。 |
| 16160 | `ActionObject/Monster/New_Event/G_main1.obj` | 物理对象和 passiveobject registry 均可读；当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。linked `G_main_0/1/2/3.ani` 与 last `G_Last.ani` 均无攻击框或伤害框。 |
| 16162 | `ActionObject/Monster/New_Event/Stingerex.obj` | `tank_landrunner/action/boom2.act` 在 FRAME5 创建的爆炸对象；BASE `ExpDodge.ani` FRAME000-006 有攻击框，FRAME007-013 无盒，SUB `ExpFloorNormal.ani` / `ExpFloorDodge.ani` 无盒。 |
| 16191 | `ActionObject/Monster/New_Event/EMP.obj` | `dual_face/action/*chang_start.act` 四个 source action 在 FRAME0 创建的表现/状态对象；本桶无 `.atk` owner，`EMP.act` 的 BASE 与 9 个 SUB ANI 均未观察到攻击框或伤害框。 |
| 16163 | `ActionObject/Monster/New_Event/missile_L.obj` | `dual_face/l2_missile_l.act` 与 `dual_face2/missile_l.act` 创建的左侧导弹入口；start/stay linked ANI 无盒，stay FRAME47 创建 16164。 |
| 16166 | `ActionObject/Monster/New_Event/missile_R.obj` | `dual_face/l1_missile_r.act` 与 `dual_face2/missile_r.act` 创建的右侧导弹入口；start/stay1 linked ANI 无盒，stay1 FRAME47 创建 16164。 |
| 16164 | `ActionObject/Monster/New_Event/missile_EXP.obj` | `missile_stay.act` / `missile_stay1.act` 创建的落地中间层；`missile_destroy.act` 的 linked ANI 无盒，ZPOS 条件后创建 16165。 |
| 16165 | `ActionObject/Monster/New_Event/JeffMissileEXP1.obj` | `missile_destroy.act` 创建的实际爆炸对象；`JeffMissileEXP.ani` FRAME000-003 有多条攻击框，SUB `JeffMissileEXP1/2/3.ani` 无盒。 |
| 35112 | `ActionObject/Map/Risk_Dungeon/Cartelcommand/LargeExp.obj` | `JeffMissileEXP.act` FRAME0 创建的下游对象；`ShootingStarExp.ani` 单帧空图有攻击框。 |
| 35113 | `ActionObject/Map/Risk_Dungeon/Cartelcommand/sniper_exp.obj` | `JeffMissileEXP.act` FRAME0 创建的下游对象；`sniper_exp.ani` 为地板表现层，未观察到攻击框或伤害框。 |

## 反样本

| ANI | 只读观察 | 结论 |
| --- | --- | --- |
| `SPC/_cypherobjectfriend/wait.ani` / `wait_glow.ani` / `rise.ani` / `fall.ani` / `stay*.ani` | 这些文件分别由 wait/rise/fall/stay 系列 action 挂接；样本帧只观察到图像、位置、旋转、图形效果和 delay，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 owner 的攻击态有盒，不代表等待、起落、倒地、停留态也有盒；必须按实际挂接 ANI 分层记录。 |
| `SPC/_cypherobject2/wait.ani` / `wait_glow.ani` / `rise.ani` / `fall.ani` / `stay*.ani` | 这些文件分别由 wait/rise/fall/stay 系列 action 挂接；样本帧只观察到图像、位置、旋转、图形效果、lineardodge 或 delay，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 owner 的 attack 动作有盒，不代表等待、起落、倒地和停留态也有盒。 |
| `SPC/_gligexp/Floor.ani` | `Body.act` 的 SUB ANI；FRAME000-005 只观察到 image、image pos、RGBA、lineardodge 和 delay。 | 当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；SUB floor 表现不继承 BASE `Exp.ani` 的攻击框。 |
| `SPC/_diredirt/Destroy.ani` | `destroy.act` 的 BASE ANI；FRAME000-004 只观察到 `Map/Act6/DireDirt.img` 图像、坐标和 delay。 | 当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；last action 的表现 ANI 无盒，不覆盖 basic `Body.ani` 的盒字段。 |
| `SPC/animation/Dummy.ani` / `TimeControl.ani` / `TimeControl2.ani` | `Flowermanager.act`、`IceDropManager.act`、`RunningIceDrop*.act` 的 BASE ANI；Dummy 为单帧透明图，TimeControl/TimeControl2 为 7 帧透明图。 | 当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；这些 manager/homing 表现 ANI 无盒，不代表其创建的 8023 IceDrop 无 hitbox。 |
| `SPC/animation/Blizzard_Big_Effect.ani` / `kemuri01.ani` / `kemuri02.ani` / `kemuri03.ani` | `Blizzard_Big_Effect.ani` 是 `IceDrop.act` 的 SUB ANI；Kemuri 系列为 `IceDrop.ptl` 侧车或同前缀可读粒子动画。 | 当前未观察到盒字段；SUB/粒子侧车不继承 BASE `Blizzard_Big.ani` 的攻击框，也不证明客户端资源完整。 |
| `_enginecover_1.ani` | 可反编译，样本帧只有图像、位置、透明度、延迟等。 | 本文件样本未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `coinptl.ani` | 可反编译，样本帧为硬币特效图像与延迟。 | 本文件样本未观察到盒字段。 |
| `dummy.ani` | 可反编译，样本帧为图像、位置、透明度、延迟。 | 本文件样本未观察到盒字段。 |
| `dust.ani` | 可反编译，样本帧为尘土图像与延迟。 | 本文件样本未观察到盒字段。 |
| `Title_mega_vibration.ani` | `title_mega.act [SUB ANI]` 指向；可反编译，帧内为图像、位置、图形效果和延迟。 | 同一 `.act` 的 BASE ANI 有攻击框，不代表 SUB ANI 也有攻击框。 |
| `dumy.ani` | `golgothunder_summon.act [BASE ANI]` 指向；可反编译，帧内为图像、比例、透明度和延迟。 | 创建管理型动作的 BASE ANI 不必有盒字段。 |
| `Title_mega_drop.ani` / `Title_mega_drop_effect.ani` | `title_mega_drop.act` 的 BASE / SUB ANI；可反编译，帧内为图像、旋转、图形效果和延迟。 | 同一 common 小桶中，drop 动作未观察到盒字段，但可创建下游 passiveobject。 |
| `BrazierBack.ani` / `BrazierLight.ani` | `actionbrazier.obj [etc motion]` 指向；可反编译，样本未观察到盒字段。 | 同一 mapobject 的 basic motion 有 `[DAMAGE BOX]`，不代表 etc motion 也有盒字段。 |
| `FountainDestroyed.ani` / `FountainWaterGlow.ani` / `FountainWater.ani` / `FountainWaterGlow2.ani` | `actionfountain.obj [etc motion]` 指向；可反编译，样本未观察到盒字段。 | 同一对象的 `FountainDamage.ani` 有 damage box，不代表全部 etc motion 都有盒字段。 |
| `StonePillar1.ani` | `actionstonepillar.obj [etc motion]` 指向；可反编译，样本未观察到盒字段。 | 受损表现 motion 不必保留 damage box。 |
| `TorchlightBack.ani` / `TorchlightLight.ani` | `actiontorchilght.obj [etc motion]` 指向；可反编译，样本未观察到盒字段。 | basic motion 与光效/back 层分别判断。 |
| `DarkFlower0.ani` | `darkflower.obj [etc motion]` 指向；可反编译，样本未观察到盒字段。 | `darkflower.obj` 的 basic motion 有 damage box，抽样 etc motion 无盒。 |
| `FluoreCollider/create_body.ani` / `create_body_glow.ani` / `create_wheel.ani` / `create_area.ani` | `fluorecolliderstart.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | SUB ANI 只按各自帧级内容判断；不要从动作名或创建行为推断 hitbox。 |
| `FluoreCollider/parts1.ani` / `parts2.ani` | `fluorecolliderend.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 角色目录动作样本可只有表现帧，没有盒字段。 |
| `FluoreCollider/stay_lightning_rod.ani` / `thunder_spark.ani` | `fluorecolliderstay.act` 的 SUB / SUB ANI WITH XYZ 样本；可反编译，帧内为图像、位置、图形效果、缩放、旋转和延迟。 | stay 的 BASE `stay_body.ani` 有 damage box，不代表这些 SUB ANI 也有。 |
| `FireExplosionCreater.ani` | `fireexplosioncreater.act [BASE ANI]` 指向；五帧均为空图像和延迟，样本未观察到盒字段。 | 父对象可通过 action 创建下游攻击对象；不能只看父 ANI 下结论。 |
| `at_5t_walker/Bullet1.ani` | `Bullet.act` / `Bullet1.act [SUB ANI]` 指向；三帧为 ViperDodge lineardodge 图像与延迟。 | 同 action 的 BASE `Bullet.ani` 有攻击框，不代表 SUB `Bullet1.ani` 也有盒字段。 |
| `at_5t_walker/ExpNormal.ani` / `ATExpDodge.ani` | `Exp.act [SUB ANI]` 指向；样本帧只有图像、位置、缩放或 lineardodge 等表现字段。 | `Exp.act` 的 BASE `ATExpNormal.ani` 有攻击框，不代表两个 SUB ANI 有盒字段。 |
| `at_5t_walker/hit.ani` | `bullet.obj [etc action] -> hit.act [BASE ANI]` 指向；两帧为 hit 图像和 lineardodge。 | etc action 不继承 basic action 的 `Bullet.ani` hitbox。 |
| `at_5t_walker/special.ani` / `special1.ani` / `special2.ani` | `special.act` 的 BASE / SUB ANI；三个文件均为单帧 MechaDropShadow 图像、位置、image rate 和 delay。 | special 管理动作可创建下游 10268，但自身三个 ANI 未观察到盒字段。 |
| `at_5t_walker/destroy.ani` / `destroydust.ani` / `shootsmoke.ani` | destroy action 和两个 basic motion 表现对象指向；可反编译，帧内为图像、位置、缩放、透明度或 delay。 | 这些表现层 ANI 未观察到盒字段；destroy action 的粒子播放也不等于 hitbox。 |
| `Giselle/ExpFloorDodge.ani` | 8715 下游 `GiselleFloor.obj -> Floor.act [SUB ANI]` 指向；四帧未观察到盒字段。 | 同一 floor action 的 BASE `ExpFloorNormal.ani` 有攻击框，不代表 dodge SUB 有盒字段。 |
| `cartelcommand/robot.ani` / `die_eff2.ani` | 9950 `Monster/cartelcommand/robot.obj` 的 BASE / SUB ANI；可反编译，帧内为图像、位置、延迟、图形效果等字段。 | 9950 下游对象本体不挂 `.atk`，且这两个 ANI 未观察到攻击盒或受击盒；不要从对象名或创建来源推断 hitbox。 |
| `lizardman/SummonStoneBody.ani` | `summonstonebody.act [BASE ANI]` 指向；两帧石头图像和长延迟，未观察到盒字段。 | 源召唤动作自身无盒，不代表其创建的 8568 下游爆炸无攻击盒。 |
| `lizardman/StoneBody.ani` | `lizard_stonebody2.act [BASE ANI]` 指向；两帧均有 `[DAMAGE BOX] -70 -10 -12 90 20 124`。 | 这是 source action 的受击/碰撞盒样本，不等于 8568 下游攻击盒。 |
| `guardiangoblin/SpearJail.ani` / `SpearJail_1.ani` / `SpearJail_Effect*.ani` | guardian 8568 入边 source action 的 owner ANI 抽样；`SpearJail.ani` 有 `[DAMAGE BOX]`，`SpearJail_1.ani` 有 `[ATTACK BOX]` 与 `[DAMAGE BOX]`，`SpearJail_Effect.ani` / `SpearJail_Effect2.ani` 未观察到盒字段。 | source owner hitbox 与 8568 下游 hitbox 分层记录；不要互相继承。 |
| `actionobject/monster/powerstation/kohlepowerstation/slime/boom02.ani` | `slime/boom.act [SUB ANI]` 指向；可反编译，`FRAME000` 到 `FRAME008` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE `boom01.ani` 有攻击框，不代表 SUB `boom02.ani` 也有。 |
| `equipmentpassiveobject/requiem/003/boom02.ani` | `requiem/003/boom.act [SUB ANI]` 指向；可反编译，`FRAME000` 到 `FRAME008` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | requiem/003 action 还有攻击成功 appendage 行为；该行为不改变 SUB ANI 帧级盒字段观察。 |
| `actionobject/monster/chiefmong/Boom2.ani` | `chiefmong/Boom.act [SUB ANI]` 指向；可反编译，`FRAME000` 到 `FRAME009` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE `Boom.ani` 前 3 帧有攻击框，不代表 SUB `Boom2.ani` 也有。 |
| `actionobject/monster/timegate/conflagration/umtara/boom_normal.ani` | `umtara/boom.act [SUB ANI]` 指向；可反编译，`FRAME000` 到 `FRAME009` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE `boom_dodge.ani` 前 8 帧有攻击框，不代表 SUB `boom_normal.ani` 也有。 |
| `actionobject/monster/gashengrigun/Dust.ani / Dust2.ani / Dust3.ani` | `EZ8_2.act [SUB ANI]` 指向；均可反编译，样本帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE CountDown 和 SUB Stay3 有 damage box，不代表所有 SUB ANI 都有。 |
| `actionobject/monster/gashengrigun/_Round.ani / _Round2.ani / _Round3.ani / _Round4.ani` | `Attack*.act [BASE/SUB ANI]` 指向；四个 97 帧样本均可反编译，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | `Attack*.act` 的运行效果在 `[SUMMON MONSTER]` 行为，不来自这些旋转表现 ANI 的 hitbox。 |
| `actionobject/monster/gashengrigun/Drop.ani / DropEffect.ani / DropRed.ani / Run1.ani` | `Summon.act` 或 `Run1.act` 指向；可反编译，样本未观察到盒字段。 | 掉落/幻影表现层无盒；对应 action 仍可创建 passiveobject 或召唤 monster。 |
| `actionobject/monster/gashengrigun/SleepSmoke2.ani / SleepSmoke3.ani` | `SleepGas.ptl` 的 object 列表指向；可反编译，样本未观察到盒字段。 | particle 侧车动画不继承 BASE `SleepSmoke.ani` / `SleepSmoke4.ani` 的攻击框。 |
| `actionobject/monster/guardiangoblin/SpearJailDust.ani` | 8561 下游对象 `SpearJailDust.obj -> SpearJailDust.act [BASE ANI]` 指向；可反编译，未观察到盒字段。 | 8561 是 gashengrigun `Summon.act` 创建的一跳下游；无盒结论只限该 ANI。 |
| `monster/zealotrebirth/NenGuardFloor.ani / NenGuardEffect.ani` | `NenGuard_1.obj [etc motion]` 指向；均可反编译，样本帧未观察到盒字段。 | 同一对象的 basic motion `NenGuard.ani` 有多条 damage box，不代表 etc motion 继承。 |
| `ATNapalmBomb/Bullet.ani` / `Area1.ani` / `Area2.ani` | `atnapalmbomb.obj` 的 basic / etc motion 抽样；可反编译，样本未观察到盒字段。 | 展示/区域动画无盒不证明技能运行无命中或无伤害。 |
| `pirate_ship.ani` / `pirate_ship_smoke.ani` | `pirate_ship.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 船体表现层无盒，但 action 仍可创建下游火焰和炸弹对象。 |
| `pirate_ship_fire.ani` | `fire.act [BASE ANI]` 指向；可反编译，样本未观察到盒字段。 | 开火表现帧无盒；该 action 通过创建 8755 继续下游链。 |
| `pirate_bomb_drop.ani` / `pirate_bomb_drop_effect1.ani` | `pirate_bomb_drop.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 掉落表现无盒；落地检查后创建 8778 才进入爆炸对象。 |
| `actionobject/monster/animation/empty_00.ani` | `3headlessknight.act [BASE ANI]` 指向；八帧为空图像和延迟，样本未观察到盒字段。 | 创建管理型 actionobject/monster 父层不必自带攻击框。 |
| `timegate/TimeLord/Cube.ani` / `Cube_EX.ani` | `Cube_loop.act` / `Cube_EX.act` 指向；可反编译，样本帧为图像、位置、图形效果、RGBA 和延迟等。 | Cube action 可承载检查、追加状态和销毁行为，但当前样本 ANI 样本未观察到盒字段。 |
| `timegate/TimeLord/magic/magic_L.ani` | `magic_L.act [BASE ANI]` 指向；可反编译，11 帧为 magic circle 图像、位置、RGBA、图形效果和延迟。 | magic_L 是同组无盒表现样本；不证明 TimeLord 其他对象无 hitbox。 |
| `timegate/TimeLord/Chain/1chain_start_lineeffect.ani` | `Chain_action.act [SUB ANI]` 指向；可反编译，帧内为 image/pos/RGBA/interpolation/graphic effect/delay。 | 同一 action 的其他 BASE/SUB ANI 有盒字段，不代表该 SUB ANI 也有。 |
| `Blood_An/darkfireshoot.ani` / `darkfireshootsub.ani` | `darkfireshoot.act` 的 BASE / SUB ANI；可反编译，帧内为图像、位置、旋转和延迟。 | 源发射动作的表现层未观察到盒字段；需继续跟创建候选对象。 |
| `Blood_An/darkfire1sub.ani` / `darkfire2sub.ani` / `darkfire3sub.ani` / `darkfire4sub.ani` | `darkfire1/2/3/4.act [SUB ANI]` 指向；均可反编译，样本未观察到盒字段。 | 同一 action 的 BASE ANI 有攻击框，不代表 SUB ANI 也有；`darkfire4sub.ani` 还带 `[LOOP]`。 |
| `_NewHell/Agaress_Hell/darkfireshoot.ani` / `darkfireshootsub.ani` | `darkfireshoot.act` 的 BASE / SUB ANI；可反编译，帧内为图像、位置、旋转和延迟。 | 源发射动作的表现层未观察到盒字段；下游候选 BASE ANI 有攻击框。 |
| `_NewHell/Agaress_Hell/darkfire1sub.ani` / `darkfire2sub.ani` / `darkfire3sub.ani` / `darkfire4sub.ani` | `darkfire1/2/3/4.act [SUB ANI]` 指向；均可反编译，样本未观察到盒字段。 | 同一 action 的 BASE ANI 有攻击框，不代表 SUB ANI 也有；`darkfire4sub.ani` 还带 `[LOOP]`。 |
| `Bigboom2.ani` / `Bigboom3.ani` / `AntiairUpperQuake.ani` / `AntiairUpperQuake2.ani` | `bigboom.act [SUB ANI]` 指向；均可反编译，样本未观察到盒字段。 | 同一 action 的 BASE ANI 有攻击框，不代表 SUB ANI 也有。 |
| `HPFairyEF.ani` | `fairy_small_ok/bad.act [SUB ANI]` 指向；可反编译，样本未观察到盒字段。 | 恢复/扣血表现层不等于 hitbox。 |
| `FairyDestroy.ani` | `fairy_small_des_ok/bad.act [BASE ANI]` 指向；可反编译，样本未观察到盒字段。 | destroy action 可只有表现帧和销毁行为。 |
| `SPC/4season/empty.ani` | `hp_create.obj -> empty.act [BASE ANI]` 指向；可反编译，样本未观察到盒字段。 | 管理对象可只负责随机创建下游对象。 |
| `SPC/_airsword/airsword.ani` | `airsword.act [BASE ANI]` 指向；3 帧均为 `Monster/airsword/airsword.img` 图像、位置、`LINEARDODGE` 和 delay。 | 本 action 的 BASE ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；`.atk` payload 不提供坐标。 |
| `SPC/_airsword/airsword_light.ani` | 同前缀相邻 ANI，可反编译；3 帧为 `Monster/airsword/airsword_light.img` 图像、位置、`LINEARDODGE` 和 delay；主目标 `airsword.act` 未挂接它。 | 相邻可读 ANI 不能自动视为 action 链的一部分；本文件样本未观察到盒字段。 |
| `SPC/_bal/momentaryslash_red_ldodge_under.ani` | `body.act [SUB ANI]` 指向，SUB 偏移列为 `0 0`；5 帧均为 `Character/Swordman/Effect/MomentarySlash/drawingsword_red_ldodge_under.img` 图像、位置、插值、lineardodge 和 delay。 | 同 action 的 BASE upper ANI 有攻击框，但该 SUB under ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；SUB 不能继承 BASE hitbox。 |
| `SPC/_bat/destroy.ani` | `Destroy.act [BASE ANI]` 指向；单帧为 `Monster/Wraith/FlyBat.img`、位置、RGBA 和 delay，未观察到盒字段。 | last action 可只负责表现和播放粒子；不能从 basic `body.ani` 继承 hitbox。 |
| `SPC/_bat/feather1.ani` / `feather2.ani` | `Destroy.ptl [object]` 引用；两个 ANI 均为单帧 `Monster/Wraith/FlyBatParticle.img`、位置、image rate 和 delay，未观察到盒字段。 | `.ptl` 侧车动画不等于 hitbox；也不证明客户端 ImagePacks2/NPK 资源完整。 |
| `_firewitch/meteo/destroy.ani` / `destroy_cyclops.ani` | 两个 last action 的 BASE ANI；均可反编译，样本帧为图像、位置、RGBA、图形效果和延迟，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | last action 本体可只负责表现、粒子和创建；命中框需继续看创建出的下游对象。 |
| `Jeff/Bigboom1.ani` / `Bigboom2.ani` / `Bigboom3.ani` / `AntiairUpperQuake.ani` / `AntiairUpperQuake2.ani` | 8236 下游 `Jeff_Omega_BigBoom.act` 的 BASE/SUB ANI；均可反编译，当前样本未观察到盒字段。 | 8236 下游无盒结论只限这些 ANI；不能反推 sibling 10027 也无盒。 |
| `Jeff/Bigboom2_1.ani` / `Bigboom3_1.ani` / `AntiairUpperQuake_1.ani` / `AntiairUpperQuake2_1.ani` | 10027 下游 `BigBoom.act` 的 SUB ANI；均可反编译，当前样本未观察到盒字段。 | 同一 action 的 BASE `Bigboom1_1.ani` 有攻击框，不代表 SUB ANI 也有。 |
| `SPC/rina/skypotel.ani` | `skypotel.act [BASE ANI]` 指向；三帧均为空图和 delay，未观察到盒字段。 | `skypotel.obj` 不挂 `.atk`；action 的 `[SUMMON MASTER]` / `[SET SPEED]` 行为不替代 ANI hitbox。 |
| `SPC/rina/particle/effect.ptl -> ../Animation/StoneSmoke.ani` | 粒子侧车引用的相对 `StoneSmoke.ani` 在 rina 前缀未命中。 | 不能用其他前缀同名 ANI 替代 rina 相对路径；这是侧车引用断链风险，不是 rina hitbox 正样本。 |
| `SPC/laowu/buff_normal_front.ani` / `buff_front.ani` / `buff_back.ani` / `buff_normal_back.ani` | `buff.act` 的 BASE / SUB / SUB ANI WITH XYZ 指向；四个 ANI 均为 6 帧 `Monster/laowu/*` 图像表现，样本未观察到盒字段。 | owner-linked action ANI 无盒，不代表 AI CHARACTER 检查或 buff 表现的运行效果；`.atk` 缺失也不替代 ANI 观察。 |
| `SPC/laowu/buff_normal.ani` / `empty.ani` / `skill_effect.ani` / `skill_light.ani` | 同前缀相邻可读 ANI；当前未观察到 `laowu.obj -> buff.act` 挂接它们。 | 相邻可读文件不能自动视为 action 链的一部分；这些样本未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 |
| `SPC/laowu/SpecialBalloon.ani` / `AvalancheBalloon.ani` | `empty01.act` 指向，但 `empty01.act` 未观察到 owner 命中。 | 文件可读且无盒，只能登记为 owner 未闭合侧车样本，不能写成 `laowu.obj` hitbox 结论。 |
| `SPC/mesteria/ShootingStar1.ani` / `ShootingStar2.ani` | `ShootingStarFire.ptl` 引用的动画侧车；两者各 18 帧 BigFire 表现，其中 `ShootingStar2.ani` 为 lineardodge 表现。 | 当前样本未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；粒子侧车无盒不证明 40005 下游 common 对象无 hitbox。 |
| `SPC/mesteria/BigExp1.ani` / `BigExp2.ani` / `ExpSmoke1.ani` / `ExpSmoke2.ani` / `FireExplosionParticle1.ani` / `FireExplosionParticle2.ani` | 同前缀 PTL 侧车引用或相邻可读表现 ANI；BigExp 为 18 帧，Smoke 为 2 帧，FireExplosionParticle 为 5 帧。 | 当前未观察到这些 ANI 直接由 `HalloweenBuster1.act` 挂接，也未观察到盒字段；不能写成 owner-linked hitbox 正样本。 |
| `SPC/jackie/Ball_count_e.ani` | `Ball_Count.act [SUB ANI]` 指向；可反编译，样本未观察到盒字段。 | 倒数表现层不继承 BASE `Ball_Count.ani` 的 damage box。 |
| `SPC/jackie/ball.ani` / `ball_bomb.ani` / `ball_edge*.ani` | `Ball_Bomb.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 爆炸视觉层无盒不证明整条链无攻击框；action 可创建下游爆炸对象。 |
| `SPC/despair_tower/sjar_coin_appear.ani` / `sjar_coin_ok.ani` / `sjar_coin_bad.ani` | sjar coin appear / ok / bad action 指向；可反编译，样本未观察到盒字段。 | coin 表现对象本体可只负责创建或召唤下游。 |
| `SPC/despair_tower/MechaDropAppear.ani` / `MechaDropMove.ani` / `MechaDropDisappear.ani` | ZDrop 三个 action 的 BASE ANI；可反编译，样本未观察到盒字段。 | ZDrop 是创建中间层，不要只看该层 ANI 判断末层命中。 |
| `SPC/despair_tower/dumy2.ani` / `WarningMark.ani` / `Missile.ani` | ZGT / ZMissile action 指向；可反编译，样本未观察到盒字段。 | 预警和导弹飞行表现层无盒；ZMissile 可创建 9206。 |
| `JeffMissileEXP1.ani` / `JeffMissileEXP2.ani` / `JeffMissileEXP3.ani` | `JeffMissileEXP.act [SUB ANI]` 指向；可反编译，样本未观察到盒字段。 | 同一爆炸 action 的 BASE ANI 有攻击框，不代表 SUB ANI 也有。 |
| `SPC/despair_tower/eltis_dummy*.ani` | `Eltis_dummy.ani`、`Eltis_dummy_appear.ani`、`Eltis_dummy_disappear.ani` 均为透明/空图表现帧，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | dummy 是创建管理层；无盒不代表其创建的 machine 或 machine 创建的 8498 无 hitbox。 |
| `SPC/despair_tower/eltis/SaintFireDistroy_ptl1-4.ani` | `SaintFire_distroy.ptl` 侧车引用 4 个单帧粒子 ANI，均未观察到盒字段。 | `.ptl` 侧车动画不计入 hitbox 正样本，也不证明客户端资源完整。 |
| `SPC/despair_tower/gravity*.ani` | `gravity_d.obj` 与普通 `gravity.obj` 通过 `gravity.act`、`gravity_stay*.act` 链接 `gravity.ani`、`gravity_eff.ani`、`gravity_on_eff.ani`、`gravity_on_eff1.ani`、`gravity_on_eff2.ani`。5 个 ANI 均可反编译：`gravity.ani` 与 `gravity_eff.ani` 为 12 帧 Supplycut 图像，`gravity_on_eff.ani` 为 12 帧 Spark 表现，`gravity_on_eff1.ani` 为 12 帧 LaserBase 表现，`gravity_on_eff2.ani` 为 23 帧 LaserTile 表现；当前样本均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | `gravity_stay.act` / `gravity_stay1.act` 有 flash screen、appendage 减速/卡肉字段，`_d` stay 版本只有计时切 action；这些行为不等于 ANI hitbox。`.atk` 坐标来源在本桶不存在，攻击/受击盒仍只能由实际 linked ANI 证明。 |
| `SPC/despair_tower/shouting1*.ani / shouting2*.ani` | `shouting.act` 的 SUB `shouting1.ani`、`shouting2.ani`，以及 `shouting2.act` 的 SUB `shouting1_1.ani`、`shouting2_1.ani` 均可反编译，样本未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 action 的 BASE ANI 有攻击框，不代表 SUB ANI 继承攻击框；SUB 是否有盒必须逐个 ANI 读帧。 |
| `SPC/despair_tower/summon_marcelo.ani` | `summon_marcelo.obj -> Action/Summon_marcelo.act [BASE ANI]` 指向该 ANI；7 帧均为 `Character/Priest/Effect/RepeatedSmash/ground-big.img` 图像表现，图像坐标 `-221 -150`，缩放约 `0.6 / 0.4`，RGBA 末列为 `0`，图形效果为 `LINEARDODGE`，delay `150`。 | 当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；该 action 的核心行为是 `[SUMMON APC] 20435` 与触发器切换，运行召唤和 APC 存活不由 ANI hitbox 证明。 |
| `SPC/despair_tower/GrabBlastBloodEx linked SUB/EX ANI` | `booldRust.act` 的 SUB `cast2.ani`、`cast_light_dodge.ani`、`drain_blood_normal.ani`，以及 `booldRust_EX.act` 的 BASE/SUB `exp_blood_normal.ani`、`exp_blood_dodge.ani`、`exp_blood_around_dodge.ani`、`exp_light_back_dodge.ani`、`exp_light_dodge.ani`、`exp_light_front_dodge.ani`、`exp_light_particle_dodge.ani` 均可反编译，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一 owner 的 `cast1.ani` FRAME000 有攻击框，不代表其他 SUB/EX 表现 ANI 继承盒字段；EX action 的 `[DESTROY]` 也不提供 hitbox 坐标。 |
| `SPC/despair_tower/sogno_hit.ani` | `sogno_hit.obj -> action/sogno_hit.act [BASE ANI]` 指向该 ANI；5 帧均为 `Character/Priest/Equipment/Weapon/totem/pr_totem90100d.img` index `192`，图像坐标 `-258 -324`，RGBA 末列为 `0`，delay `300`。 | 本文件未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；该 action 的核心行为是检查 23052 passiveobject 与 15414 AIC 后对检查对象执行 `[SET ACTION] [STAND] [NOW]`，不是由 ANI hitbox 提供攻击范围。 |
| `SPC/despair_tower/reflect_ball SUB/end ANI` | `reflect_ball_stay.act` 的 SUB `eg-ball-normal.ani`、`reflect_ball_destroy.act` 的 BASE `eg-ball-end.ani` 与 SUB `eg-ball-end-normal.ani`、`eg_bomb.act` 的 SUB `eg-end.ani` 均可反编译，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 同一对象链路中，BASE start/stay/eg_bomb2 有攻击框，不代表 normal/end/SUB 表现 ANI 继承攻击框；销毁动作是否造成下游爆炸取决于 create 行为，不取决于 end ANI 自带盒字段。 |
| `SPC/despair_tower/attack/pass shield effect/SUB ANI` | `attack_shield_eff.act` 的 BASE `attack_shield_eff.ani` 与 `pass_shield.act` 的 SUB `pass_shield1.ani` 均可反编译，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 9219 effect 和 pass shield SUB 是表现/效果侧车；source BASE `attack_shield.ani`、`pass_shield.ani` 有攻击框，不能把 sidecar 无盒反推到 owner BASE。 |
| `SPC/despair_tower/defence/trap shield 表现 ANI` | `defence_shield_bottom.act` 的 BASE `defence_shield_tailME.ani`，`trap_defence_shield_bottom.act` 的 BASE/SUB `trap_defence_shield_losttail.ani` / `trap_defence_shield_lostmagic.ani`，`trap_defence_shield_bottom_stay.act` 的 BASE/SUB `trap_defence_shield_losttail_stay.ani` / `trap_defence_shield_lostmagic_stay.ani`，以及 `trap_defence_shield*.act` 的 `shield_Diamond.ani` / `shield_Diamond_stay.ani` 均可反编译，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 防御盾 bottom/lost/diamond 多为表现层；不能继承本体 `defence_shieldme.ani` 或 `Trap_Defence1_shield*.ani` 的 damage box。 |
| `SPC/despair_tower/star / center / shield_count 管理 ANI` | `star_shield.ani`、`conter_shield.ani`、`conter_shield_stay.ani`、`shield_count.ani` 均可反编译，当前未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 这些 action 负责地图投放、appendage 或计数/销毁逻辑；无盒结论只限对应 ANI，运行 buff/计数效果需实机验证。 |
| `SPC/despair_tower/defence_shield_eff.ani / defence_shield_magic2.ani` | 两个 ANI 在主目标物理存在且可反编译：`defence_shield_eff.ani` 为 6 帧 `Attack_shield_Hit.img` 表现，`defence_shield_magic2.ani` 为 13 帧 `defence_magic.img` 表现；主目标全 PVF 脚本文本未观察到这两个文件名或不带扩展名 token 的引用；两者均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 这是同目录可读但 owner/action/particle 未挂接的 shield 侧车边界样本；不能写成 owner-linked hitbox，也不能替代 9219 effect 或 defence/trap shield linked ANI 结论。 |
| `at_5t_walker/rocket1.ani` | `rocket1.act [BASE ANI]` 指向；可反编译，单帧为导弹图像、旋转和延迟。 | 本文件样本未观察到盒字段；同一 action 可创建 10263 下游对象。 |
| `at_5t_walker/JeffMissileEXP1.ani` / `JeffMissileEXP2.ani` / `JeffMissileEXP3.ani` | `rocketboom.act [SUB ANI]` 指向；均可反编译，帧内为爆炸表现图像、位置、图形效果和延迟。 | 同一爆炸 action 的 BASE `JeffMissileEXP.ani` 有攻击框，不代表这些 SUB ANI 也有。 |
| `MinePressureReady2.ani` / `MinePressureActive2.ani` | MinePressure2 的 BASE ANI；`MinePressureReady2.ani` 为 1 帧，`MinePressureActive2.ani` 为 2 帧，样本均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | `MineAlram2.ani` 才是本桶 trap 报警 SUB 攻击框来源；ready/active BASE 无盒不能写成下游爆炸无 hitbox。 |
| `window_1.ani` / `window_2.ani` / `broken_1.ani` | `brokenwindow1.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | actionobject 的 SUB ANI 可只是表现层。 |
| `BrazierFront.ani` / `BrazierBack.ani` / `fire.ani` | `torch.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 注意这些是 seatrainretaking actionobject 路径下的 ANI，不等同于 mapobject LightStick 同名路径。 |
| `merman.ani` / `merman1.ani` | `merman.act` 的 BASE / SUB ANI；可反编译，样本未观察到盒字段。 | 文件图像资源名不决定是否有盒字段。 |
| `Dust2.ani` / `Dust3.ani` / `Dust.ani` | `gt96002.act` 的 SUB ANI；可反编译，样本未观察到盒字段。 | 同一 `.act` 的 BASE ANI 有 damage box，不代表 SUB ANI 也有。 |

## 断链 / 未展开风险

| 来源 | 观察 | 结论 |
| --- | --- | --- |
| `atconvergencecannonexplosion.act [BASE ANI]` | 主目标 action 可读，引用 `../Animation/ATConvergenceCannon/Explosion/Explosion_Dodge.ani`；`[SUB ANI]` 是空闭合块；0 到 8 帧均执行 `[ATTACKRECT] [RESET]`。主目标直接读取 `Explosion_Dodge.ani` 未命中，同目录 `Explosion.ani` 也未命中。 | 登记为引用断链 / 未展开风险；不能记录主目标 hitbox 正反结论。辅助对照同路径 ANI 可读且 `FRAME000` 到 `FRAME010` 有 `[ATTACK BOX]`，但不能覆盖主目标缺失事实。 |
| `SPC/_cypherobject2/attack1.ani` / `realattack1.ani` / `attack2.ani` / `realattack2.ani` / `move.ani` | 同前缀相邻 ANI 可反编译：attack/realattack 系列有 damage box 和部分 attack box，`move.ani` 有 damage box；weapon sidecar `attack1_wp.ani`、`attack2_wp.ani`、`move_wp.ani` 未观察到盒字段。 | `cypherobject.obj` 的 action 列表和同前缀脚本文本未观察到这些 action 挂接；只能登记为相邻可读但 owner 未挂接边界，不能写成 `_cypherobject2` owner-linked hitbox。 |

## 未闭合

- 本账本是样本闭合，不是全量 ANI hitbox 统计。
- `.ani.als` 是侧车脚本文本，不可计入二进制 ANI hitbox 覆盖。
- `[ATTACK BOX]` 与 `[DAMAGE BOX]` 的六数值列含义仍需结合客户端坐标系或实机验证。
- 已补 `common/`、`mapobject/`、`character/mage`、`character/common`、`character/fighter`、`character/gunner` 分桶样本；下一步应继续扩大 actionobject / character 目录抽样，并单独登记反编译失败或引用断链样本。
