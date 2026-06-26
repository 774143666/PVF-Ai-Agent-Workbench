# PassiveObject 生命周期与 Homing 账本

状态：需验证

本文记录主目标 PVF 只读观察到的 passiveobject 生命周期、销毁、消失、追踪字段。它只证明静态结构、列形和 registry 路由，不证明实机销毁时序、碰撞判定、追踪轨迹或运动公式。

治理提示：本账本已超过约 100KB，后续只追加短样本、字段边界和运行风险；长流程或同族批量样本写入分片索引。落账前先读 `passiveobject-ledger-governance.zh-CN.md`。

## 主目标计数

| 字段 / 块 | 主目标只读观察 | 说明 |
| --- | ---: | --- |
| `[object destroy condition] ... [/object destroy condition]` | 1495 | 闭合块；块内可为空，也可出现反引号 token 与数值行。 |
| `[hp max]` | 883 | 一个数值。 |
| `[hp destroy]` | 908 | 一个数值。 |
| `[destroy particle]` | 417 | 一个相对 `.ptl` 路径。 |
| `[vanish on move collision]` | 132 | 一个数值。 |
| `[under gravity]` | 3 | 一个数值，少量样本。 |
| `[homing] ... [/homing]` | 199 | 闭合块。 |
| `[homing use]` | 199 | 一个数值。 |
| `[homing follow]` | 199 | 一个 token；部分 token 后还有 registry ID。 |
| `[homing velocity]` | 199 | 两个数值。 |
| `[homing check gap]` | 199 | 一个数值。 |
| `[sync animation rotation]` | 150 | 一个数值，可选字段。 |
| `[max rotation]` | 166 | 一个数值，可选字段。 |
| `[init rotation]` | 121 | 一个数值，可选字段。 |
| `[diff rotation]` | 135 | 一个数值，可选字段。 |
| `[homing time]` | 127 | 一个数值，可选字段。 |
| `[straight homing]` | 1 | 空标签，位于 `[homing]` 块内。 |

## 生命周期样本

| 样本 | 只读观察 | 边界 |
| --- | --- | --- |
| `guide_post_manager.obj` | `[object destroy condition] ... [/object destroy condition]` 是空闭合块。 | 空块也算结构存在，不能丢弃结束标签。 |
| `medusa_down.obj` | 块内有反引号 token `[destroy condition]`、`[time limite]`，后跟 `10000`。 | 这些是块内 token，不是独立字段标签；拼写按原样保留。 |
| `treasurebox.obj` | 块内有 `[destroy action]`、`[object create after destroy]`、`[add object index]`，数值行为 `1 9330`；同对象有 `[hp destroy] 1`、`[hp max] 5000` 与 `[destroy particle] particle/damage1.ptl`。 | 9330 已回 passiveobject registry 解析；第一个数值含义未静态证明。 |
| `treasurebox_open.obj` | 块内有 `[destroy condition]`、`[time limite]`，后跟 `3000`；不含 hp destroy / hp max。 | 只证明时间样销毁结构，不证明实际毫秒/帧单位。 |
| `junktree.obj` | 块内有 `[destroy condition]`、`[on end of animation]`；同文件有 `[vanish on move collision] 0`、`[hp max] 5500`、`[hp destroy] 1`。 | 动画结束销毁 token 存在；运行触发、碰撞消失判定和 0/1 含义需实机。 |
| `nest.obj` | `[hp max] 20000`、`[hp destroy] 0`、`[destroy particle]`、`[basic action] Action/nest.act` 同时出现；8793 走 passiveobject registry，不走 monster registry。 | `0/1` 含义不能只靠字段名解释；linked ANI 只有 damage box，不证明攻击输出。 |
| `treasurebox.obj` | `[hp destroy] 1`、`[hp max] 5000`、`[destroy particle]` 同时出现。 | 与 `nest.obj` 的 `hp destroy` 值不同，需保留原值。 |
| `bike1.obj` | `[hp max] 20000`、`[hp destroy] 1`、`[destroy particle]`，并以 `[basic motion] Animation/bike1.ani` 直连 ANI；10197 走 passiveobject registry，不走 monster registry。 | 没有 `.act` 也可有生命/销毁粒子结构；直连 ANI 的 damage box 不等于攻击输出。 |
| `deserter_bomb.obj` | `[vanish on move collision] 0`，并有 `[attack info]`；父 action 创建 9110 `deserter_BombSub.obj`。 | 移动碰撞消失字段不等于已证明碰撞行为；9110 是 passiveobject ID，不是 monster ID。 |

## 销毁后创建样本复核
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `pirateonthetrain/treasurebox.obj` | `[object destroy condition]` 闭合块内为 `[destroy action]`、`[object create after destroy]`、`[add object index] 1 9330`；9330 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/pirateonthetrain/treasurebox_open.obj`，在 `monster/monster.lst` 未命中。 | `[add object index]` 的目标按 passiveobject registry 解析；第一列 `1` 不在静态只读中解释。 |
| `treasurebox.obj -> Action/treasurebox.act -> treasurebox.ani` | action 在 `[ON DAMAGE]` 时播放 `damage1.ptl` 粒子；创建打开对象不在 action 内，而在 `.obj` 销毁块内。`treasurebox.ani` 两帧均有 `[DAMAGE BOX] -42 -8 1 79 18 44`。 | source 对象 damage box 是受击/碰撞盒观察，不等于攻击输出。 |
| `treasurebox_open.obj -> Action/treasurebox_open.act -> treasurebox_open.ani` | 打开对象自身有 `[object destroy condition] [destroy condition] [time limite] 3000`；linked open ANI 两帧未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 打开后对象是被 9330 创建的下游 passiveobject；其时间样销毁不证明单位或实机时序。 |

## 销毁后创建路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `treasurebox.obj [object destroy condition] [add object index]` | 9330 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/pirateonthetrain/treasurebox_open.obj`。 |
| 同上 | 9330 | `monster/monster.lst` 未命中。 |

结论：在该样本中 `[add object index]` 后的目标对象走 passiveobject registry；不要把它当 monster ID，也不要解释第一列数值。

## 动画结束销毁 / shared attackinfo 复核
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `JunkTree.obj` | 8004 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/JunkTree.obj`，在 `monster/monster.lst` 未命中。对象写 `[basic action] action/JunkTree.act`、`[attack info] attackInfo/JunkWagon.atk`、`[hp max] 5500`、`[hp destroy] 1`、`[vanish on move collision] 0`，销毁块为 `[destroy condition]` + `[on end of animation]`。 | 8004 是 passiveobject ID；动画结束销毁 token 只证明静态结构，不证明实机触发时序或碰撞消失结果。 |
| `tree_thrower -> 8004` | 三个 source action 均在第 4 帧触发 `[CREATE PASSIVEOBJECT] [INDEX] 8004`，分别挂 `JunkTree.ptl`、`JunkTreeDown.ptl`、`JunkTreeUp.ptl`，`[LEVEL] 40`，`[POS] 63 0 89`。 | 同一 ID 可由多个 source action 创建；粒子文件只证明 PVF 引用，不证明客户端资源完整。 |
| `JunkWagon.obj` | 8000 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/JunkWagon.obj`，在 `monster/monster.lst` 未命中。对象同样挂 `attackInfo/JunkWagon.atk`，但不使用 `[object destroy condition]`；其 action 在落地或攻击成功后执行粒子并 `[DESTROY]`。 | shared `.atk` 不代表 shared lifecycle；销毁结构必须按 owner 对象和 action 分开读。 |
| `JunkTree.ani / JunkWagon.ani` | `JunkTree.ani` 4 帧：FRAME000/001 有 `[ATTACK BOX]`，FRAME001/002/003 有 `[DAMAGE BOX]`；`JunkWagon.ani` 2 帧循环，每帧有三条 `[ATTACK BOX]` 与一条 `[DAMAGE BOX]`。 | `.atk` 提供攻击 payload，盒坐标来自各自 BASE ANI；同一 `.atk` 不保证同一 hitbox。 |

## 动画结束销毁路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `tree_thrower/action/shoottree*.act [CREATE PASSIVEOBJECT] [INDEX]` | 8004 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/JunkTree.obj`。 |
| 同上 | 8004 | `monster/monster.lst` 未命中。 |
| `JunkWagon` sibling | 8000 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/JunkWagon.obj`；`monster/monster.lst` 未命中。 |

结论：`tree_thrower` 三个动作中的 8004 必须按 passiveobject registry 解析；`JunkTree.obj` 复用 `JunkWagon.atk`，但生命周期和 hitbox 仍按各自对象/action/ANI 单独闭合。

## hp destroy / 碰撞消失复核
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `pirateonthetrain/nest.obj` | 8793 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/pirateonthetrain/nest.obj`，在 `monster/monster.lst` 未命中。对象为 `[hp destroy] 0`，action 在 `[ON DAMAGE]` 后播放 `egg.ptl` 并 `[DESTROY]`；`nest.ani` 11 帧均有同组 `[DAMAGE BOX]`。 | `[hp destroy] 0` 的运行含义、伤害触发阈值和销毁时序不能由静态只读证明。 |
| `seatrainretaking/bike1.obj` | 10197 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/seatrainretaking/bike1.obj`，在 `monster/monster.lst` 未命中。对象为 `[hp destroy] 1`，无 `.act/.atk`，以 `[basic motion] Animation/bike1.ani` 直连单帧 damage box ANI。 | 没有 `.act` 不等于没有生命周期字段；`hp destroy 1` 仍不证明实机销毁规则。 |
| `common/deserter_Bomb.obj` | 9109 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/deserter_Bomb.obj`，在 `monster/monster.lst` 未命中。对象写 `[vanish on move collision] 0`、`[basic action]` 与 `[attack info]`；父 `.atk` 为 physic/no element/damage/push/lift 等 payload。 | `[vanish on move collision] 0` 只证明静态字段；移动碰撞消失效果需实机或运行日志。 |
| `deserter_Bomb.act -> 9110` | 父 action 的行为 0 使用 `[CREATE PASSIVEOBJECT] [INDEX] 9110`、空 `[PARTICLE FILENAME]`、`[LEVEL] 60`、`[POS] 0 0 0` 与 `[USE OBJECT ZPOS]`，随后 `[DESTROY]`；9110 回 passiveobject registry 命中 `ActionObject/Common/deserter_BombSub.obj`，在 monster registry 未命中。 | 创建触发来自 action 的 frame/ZPOS/on-damage 条件；静态只读不证明触发频率或弹跳运动效果。 |
| `deserter_BombSub.obj` | 子对象挂 `Action/deserter_BombSub.act` 与 `AttackInfo/deserter_BombSub.atk`；子 `.atk` 为 `[damage] 800`、physic、fire element、push aside 200、lift up 100 等 payload；子 action 第 9 帧执行 `[DESTROY]`。 | `.atk` 给攻击 payload，不给盒坐标；hitbox 仍以子 BASE ANI 为准。 |

## hp destroy / collision 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `nest.obj` registry anchor | 8793 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/pirateonthetrain/nest.obj`；`monster/monster.lst` 未命中。 |
| `bike1.obj` registry anchor | 10197 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Act8/Map/seatrainretaking/bike1.obj`；`monster/monster.lst` 未命中。 |
| `deserter_Bomb.obj` registry anchor | 9109 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/deserter_Bomb.obj`；`monster/monster.lst` 未命中。 |
| `deserter_Bomb.act [CREATE PASSIVEOBJECT] [INDEX]` | 9110 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/deserter_BombSub.obj`；`monster/monster.lst` 未命中。 |

## actionobject/monster advancealtar summonegg / mucus
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `advancealtar/summonegg.obj` / `summonegg2-4.obj` | 四个对象同形：width `20 20`、floating height `1`、pass all、piercing power `0`、`[hp destroy] 1`；hp max 分别为 `2000 / 2400 / 12000 / 5500`。每个对象有一个 basic action 和两个重复 `[last action]`，先 `Action/Mucus2.act`，再对应 `Action/SummonEggBlast*.act`。 | 重复 `[last action]` 只证明静态字段重复；引擎采用顺序、覆盖还是多 last action 运行效果，静态只读不能证明。 |
| `SummonEgg.act` / `SummonEgg2-4.act` | 四个 root-level action 均有 BASE `../Animation/SummonEgg*.ani`、SUB `../Animation/chargecircle.ani 0 0`；FRAME19 在 `[LIMIT] 1` 下执行两个行为：先 `[SUMMON MONSTER]`，再 `[DESTROY]`。召唤列形为 `[INDEX] 数字`、`[LEVEL] 45`、`[POS] 20 0 0`、空 `[NO EFFECT]`。 | `advancealtar/action/summonegg*.act` 主目标不存在；advancealtar owner 复用根级 action。FRAME19 触发和 LIMIT 运行语义需实机验证。 |
| `SummonEggBlast.act` / `SummonEggBlast2-4.act` | 四个 root-level last action 均只挂 BASE `../Animation/SummonEggBlast.ani`；不是编号对应的 `SummonEggBlast2/3/4.ani`。 | 物理 action 指向哪个 ANI 以 action 内容为准，不按文件名编号猜。Blast linked ANI 样本未观察到盒字段。 |
| `mucus2.obj` | `advancealtar/mucus2.obj` 与根级 `mucus2.obj` 均挂 `Action/Mucus3.act` 与 `AttackInfo/Mucus2.atk`；`.atk` 为 magic/no element/down，含 poison 四数值列 `40 0 20000 300`。 | `Action/Mucus2.act` 只挂 `mucus2.ani` 且未见盒字段；`mucus2.obj` 的 hitbox 需沿 `Mucus3.act -> Mucus3.ani` 查。 |

## actionobject/monster advancealtar icestalactite
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `advancealtar/icestalactite.obj` / 根级 `icestalactite.obj` | 两个 owner 同形：width `1 1`、floating height `0`、pass all、piercing power `0`、空闭合 `[string data]`、`[hp max] 80000`、`[hp destroy] 1`、`[team] 100`。 | 本样本没有 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]` 或 homing 数字目标；`name_8006` 是字符串链接，不按 passiveobject ID 解析。 |
| `Icestalactite.act` / `IcestalactiteBroken.act` | 两个 owner 共用根级 action；basic action 指向 `../Animation/Icestalactite.ani`，etc action 与 last action 同指 `../Animation/IcestalactiteBroken.ani`。 | `advancealtar/action/icestalactite*.act` 不存在；不能按 owner 子目录猜物理 action。 |
| `Icestalactite.ani` / `IcestalactiteBroken.ani` | 基础 ANI 为 2 帧，FRAME000 同时有 attack/damage box，FRAME001 只有 damage box；broken ANI 为 4 帧，未观察到盒字段。 | 对象不挂 `.atk` 仍可在 linked ANI 中观察到 hitbox；broken action 是表现/生命周期样本，不证明其参与攻击或受击。 |

## actionobject/monster advancealtar rocket
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `advancealtar/rocket.obj` / 根级 `rocket.obj` | 两个 owner 同形：width `10 5`、floating height `1`、pass all、piercing power `0`、`Action/Rocket.act`、`AttackInfo/Rocket.atk`、空闭合 `[etc action]`、`[last action] Action/RocketBlast.act`、`[hp max] 8000`、`[hp destroy] 1`。 | 本 action 链未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]` 或 `[INDEX]`，无数字 ID registry 路由点；`name_6160` 是字符串链接，不按 passiveobject ID 解析。 |
| `Rocket.atk` owner 复用 | 主目标 `AttackInfo/Rocket.atk` owner 搜索命中 6 个对象：advancealtar/root 的 `book1.obj`、`miatalonsmall.obj`、`rocket.obj`。`.atk` 为 damage `0`、absolute damage `0`、damage bonus `-50`、physic、weapon damage apply `1`、reaction none、push/lift `30`、knuck back `0`。 | `.atk` 不是 rocket 专属；book1 和 miatalonsmall 的 hitbox 需要沿各自 action 单独查，不能继承 `Rocket.ani`。 |
| `advancealtar/rocketblast.obj` / 根级 `rocketblast.obj` | 两个 owner 同形：width `0 0`、floating height `0`、piercing power `1000`、`Action/RocketBlast.act`、`AttackInfo/RocketBlast.atk`、team `100`。`RocketBlast.act` 在 FRAME6 `[DESTROY]`，ON SET ACTION 时 `[SET TEAM] 50`。 | `rocket.obj [last action]` 指向 blast action，但 `rocket.obj` 自身只挂 `Rocket.atk`；`RocketBlast.atk` 属于单独的 `rocketblast.obj` owner。运行时 action 切换与攻击信息采用关系需实机验证。 |
| `Action/RocketBlast.act` 字符串复用 | 主目标该字符串在 7 个 owner 中出现，`AttackInfo/RocketBlast.atk` 在 5 个 owner 中出现；`roket/rocketblast.obj` 已确认解析到独立 `roket/action/rocketblast.act` 与 `roket/attackinfo/rocketblast.atk`，其中 `.atk` 比根级多 `[attack friend] 1`。 | 同字符串不等于同物理文件；必须按 owner 目录解析相对 path。辅助对照同路径核心结构同形，但额外 `drop_rocket.obj` 复用 `Rocket.atk` 只作辅助差异。 |

## actionobject/monster advancealtar rocketman
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `advancealtar/rocketman_bullet.obj` / 根级同名对象 | 两个 owner 同形：floating height `1`、pass all、piercing power `0`、`Action/RocketMan_Bullet.act`、`AttackInfo/RocketMan_Bullet.atk`。`.atk` 为 damage bonus `-20`、physic、weapon damage apply `1`、damage reaction damage、push aside `100`、knuck back `0`。 | 无 hp、last action、homing 或 create ID；hitbox 来自 `RocketMan_Bullet.ani`，不是 `.atk`。 |
| `advancealtar/rocketman_missile.obj` / 根级同名对象 | 两个 owner 同形：floating height `1`、piercing power `1000`、`Action/RocketMan_Missile.act`、`AttackInfo/RocketMan_Missile.atk`、闭合 `[int data] 2000 5000 [/int data]`。`.atk` 为 damage bonus `0`、physic、down、push `200`、lift `300`、knuck back `1`。 | `[int data]` 两数值列只证明静态参数存在，运行含义需实机验证。 |
| 根级 `rocketman_missile2.obj` / `rocketman_missile_item.obj` | `missile2.obj` 复用 `Action/RocketMan_Missile.act` 和 `[int data] 2000 5000`，但挂 `AttackInfo/RocketMan_Missile2.atk`，该 `.atk` 为 absolute damage `1550`、physic、down。`missile_item.obj` 走 `Action/rocket_item.act` 与 `AttackInfo/RocketMan_Missile.atk`；`rocket_item.act` 在 FRAME1-4 四次创建 48143，均回 passiveobject registry 命中 `ActionObject/Monster/RocketMan_Missile2.obj`。 | `missile_item` 是根级额外 owner，不是 advancealtar 同名对象；48143 走 passiveobject registry，不按 monster ID 解释。 |
| `advancealtar/rocketman_rocket1.obj` / `rocketman_rocket11.obj` 与根级同名对象 | `rocket1` 挂 `Action/RocketMan_Rocket1.act`，`rocket11` 挂 `Action/RocketMan_Rocket11.act`，二者都挂 `AttackInfo/RocketMan_Rocket1.atk`。`.atk` 为 damage bonus `-50`、physic/no element、damage reaction damage、hit info blow、no blood `100 2.0`、attack direction hit down、active status stun `70 0 3000`、hit wav `BWANGA_IRONHIT`。 | `.atk` 被 rocket1/rocket11 复用；二者 action 行为不同，不能只按 `.atk` 合并运行结论。 |
| `RocketMan_Rocket1.act` / `RocketMan_Rocket11.act` | `rocket1.act` 在 ZPOS `>= 600` 时创建 8174 并销毁，8174 回 passiveobject registry 命中 `ActionObject/Monster/RocketMan_Rocket2.obj`。`rocket11.act` 在 ZPOS `>= 600` 后切 trigger，并有 `[WHICH] [MONSTER] [IS INDEX] 61235` 检查；61235 回 `monster/monster.lst` 命中 AT-5T，随后创建 10281，10281 回 passiveobject registry 命中 `ActionObject/Monster/RocketMan_Rocket22.obj`。 | 61235 是 monster 检查 ID，不按 passiveobject registry 解释；8174/10281 是 passiveobject 创建 ID。trigger 开关和 CHECKUP OBJECT 运行时序需实机验证。 |
| `advancealtar/rocketman_rocket2.obj` / `rocketman_rocket22.obj` 与根级同名对象 | `rocket2` 挂 `RocketMan_Rocket2.atk`，damage bonus `-50`；`rocket22` 挂 `RocketMan_Rocket22.atk`，damage bonus `20`。二者 `.atk` 其余核心字段同形，均有 stun `70 0 3000`。两个 owner 均有 team `50`。 | 共享 ANI 不代表 `.atk` payload 完全相同；damage bonus 差异需按 owner 保留。 |
| `RocketMan_Rocket2.act` / `RocketMan_Rocket22.act` | 二者 BASE 都是 `RocketMan_Rocket2.ani`，均在落地/攻击成功分支 `[SET TEAM] 50` 后创建 8030，8030 回 passiveobject registry 命中 `ActionObject/Monster/RocketBlast.obj`。`rocket2` 创建 level `40`，`rocket22` 创建 level `58`。 | 8030 是 passiveobject 爆炸下游；静态只读不证明落地、攻击成功、震动或销毁时序。 |
| `advancealtar/rocketmanwarningmark.obj` / 根级同名对象 | 两个 owner 同形：width `0 0`、floating height `0`、layer bottom、piercing power `1000`、`Action/RocketManWarningMark.act`，并有 `[homing]` 闭合块：use `1`、follow `[ENEMY]`、velocity `600 5`、check gap `200`。action 在 FRAME1 `[DESTROY]`。 | `[ENEMY]` 后无数字，不走 registry；warning mark 不挂 `.atk`，linked ANI 也未观察到盒字段。主目标 `Action/RocketManWarningMark.act` owner 搜索命中 3 个对象，辅助对照命中 10 个对象，辅助独有 owner 不写成主目标存在。 |

## advancealtar rocketman ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `RocketMan_Rocket1.act [CREATE PASSIVEOBJECT] [INDEX]` | 8174 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/RocketMan_Rocket2.obj`。 |
| `RocketMan_Rocket11.act [WHICH] [MONSTER] [IS INDEX]` | 61235 | `monster/monster.lst` 命中 `NewMonsters/Riding/at_5t/at_5t.mob`；主目标 passiveobject registry 未命中。 |
| `RocketMan_Rocket11.act [CREATE PASSIVEOBJECT] [INDEX]` | 10281 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/RocketMan_Rocket22.obj`。 |
| `RocketMan_Rocket2.act` / `RocketMan_Rocket22.act [CREATE PASSIVEOBJECT] [INDEX]` | 8030 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/RocketBlast.obj`。 |
| `rocket_item.act [CREATE PASSIVEOBJECT] [INDEX]` | 48143 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/RocketMan_Missile2.obj`。 |

## advancealtar summonegg ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `SummonEgg.act [SUMMON MONSTER] [INDEX]` | 253 | `monster/monster.lst` 命中 `StarFish/StarFishDevourer.mob`；同号在 `passiveobject/passiveobject.lst` 也命中 `MapObject/Trap/Swamp/Glass3.obj`，但本上下文不按 passiveobject 解释。 |
| `SummonEgg2.act [SUMMON MONSTER] [INDEX]` | 61102 | `monster/monster.lst` 命中 `NewMonsters/Gbl/BlackTentacle/BlackTentacle.mob`；`passiveobject/passiveobject.lst` 未命中。 |
| `SummonEgg3.act [SUMMON MONSTER] [INDEX]` | 251 | `monster/monster.lst` 命中 `StarFish/StarFishKing.mob`；同号在 `passiveobject/passiveobject.lst` 也命中 `MapObject/Trap/Swamp/Glass1.obj`，但本上下文不按 passiveobject 解释。 |
| `SummonEgg4.act [SUMMON MONSTER] [INDEX]` | 56101 | `monster/monster.lst` 命中 `NewMonsters/Gbl/Stickcle/Stickcle.mob`；`passiveobject/passiveobject.lst` 未命中。 |

## SPC _avengers 创建 / 召唤边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_avengers/alectoball/body.obj` | 对象挂 `[basic action] Action/Body.act`、`[last action] Action/last.act`、`[attack info] AttackInfo/Body.atk`、`[team] 100` 与 `[object destroy condition] [destroy condition] [on end of animation]`；basic action 在 `[ON ATTACKSUCCESS]` 后 `[DESTROY]`。 | 动画结束销毁、攻击成功销毁和 last action 创建是分层结构；实机触发顺序需运行验证。 |
| `_avengers/alectoball/last.act -> 46004` | last action 在 FRAME0 创建 46004，列形含空 `[PARTICLE FILENAME]`、`[LEVEL] 0`、`[POS] 0 0 0`；46004 回 passiveobject registry 命中 `Common/LightExplosion.obj`，在 monster registry 未命中。 | 46004 必须按 passiveobject ID 解析；下游 common 直连 motion 不等于 actionobject owner。 |
| `_avengers/firerain/body.obj -> 8387` | object 有 `[object destroy condition] [on end of animation]`；action 在 `[ON ATTACKSUCCESS]` 或 `ZPOS <= 30` 条件后创建 8387 并 `[DESTROY]`；8387 回 passiveobject registry 命中 `ActionObject/Common/ExpLand.obj`，在 monster registry 未命中。 | ZPOS/攻击成功触发、CHECKUP OBJECT 和销毁时序不由静态只读证明。 |
| `_avengers/*reviver -> 61347/61348/61349` | 三个 reviver action 均在 FRAME10 用 `[WHICH] [MONSTER] [IS INDEX]` 检查对应 monster，再 `[SUMMON MONSTER] [INDEX]` 召唤同 ID，最后 `[DESTROY]`；61347/61348/61349 回 `monster/monster.lst` 命中 Avengers 三个 `.mob`，在 passiveobject registry 未命中。 | `[SUMMON MONSTER]` 和 `[CREATE PASSIVEOBJECT]` 必须分 registry 处理；这条支线只证明召唤结构，不证明复活/任务模块运行效果。 |

## SPC _avengers ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `alectoball/last.act [CREATE PASSIVEOBJECT] [INDEX]` | 46004 | `passiveobject/passiveobject.lst` 命中 `Common/LightExplosion.obj`；`monster/monster.lst` 未命中。 |
| `firerain/body.act [CREATE PASSIVEOBJECT] [INDEX]` | 8387 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Common/ExpLand.obj`；`monster/monster.lst` 未命中。 |
| `alectoreviver/body.act [SUMMON MONSTER] [INDEX]` | 61347 | `monster/monster.lst` 命中 `NewMonsters/LizardMan/Avengers/Alecto/Body.mob`；`passiveobject/passiveobject.lst` 未命中。 |
| `tisponereviver/body.act [SUMMON MONSTER] [INDEX]` | 61348 | `monster/monster.lst` 命中 `NewMonsters/LizardMan/Avengers/Tispone/Body.mob`；`passiveobject/passiveobject.lst` 未命中。 |
| `megairareviver/body.act [SUMMON MONSTER] [INDEX]` | 61349 | `monster/monster.lst` 命中 `NewMonsters/LizardMan/Avengers/Megaira/Body.mob`；`passiveobject/passiveobject.lst` 未命中。 |

## SPC _cursequeen/void homing / 生命周期
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cursequeen/void/body.obj` | `[homing]` 块闭合，列形为 use `1`、follow `[ENEMY]`、velocity `50 50`、check gap `200`、sync animation rotation `0`、homing time `0`；销毁块为 `[destroy condition] [time limite] 5000`。 | `[ENEMY]` 后无数字 ID，不走 registry；速度、时间和追踪公式不由静态只读证明。 |
| `_cursequeen/void/pursuit1.obj` / `pursuit2.obj` | 与 `body.obj` 同形 homing 和 time-limit 销毁块；分别挂 `Pursuit_attack1.atk` / `Pursuit_attack2.atk`，绝对伤害列为 1200 / 600。 | 两个 pursuit 对象同形不证明所有 pursuit 命名对象都同形；`.atk` payload 不提供 hitbox 坐标。 |
| `Priest_ball1/2_start.act` | FRAME2 后 `[SET ACTION] [CUSTOM] 0 [NOW]`，把 start 阶段切到自定义动作 0。 | 自定义动作 0 的运行选择和时序需实机验证；静态只读只证明触发列形存在。 |
| `Priest_ball1/2_loop.act` | FRAME0 执行 `[ATTACKRECT] [RESET]`，BASE lineardodge loop ANI 有攻击框，SUB normal loop ANI 无盒字段。 | `[ATTACKRECT] [RESET]` 是行为开关/重置样字段，不等同于 ANI hitbox 坐标。 |
| `Priest_ball1/2_end.act` | FRAME2 执行 `[DESTROY]`，end lineardodge ANI 未观察到盒字段。 | end 销毁动作和 `.obj` time-limit 销毁是两层静态结构；实际先后顺序需运行验证。 |

## SPC _cursequeen/spire 生命周期 / active status
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cursequeen/spire/body.obj` | 对象挂 `Action/body.act`、`AttackInfo/attack.atk` 和粒子 `belzebuite_overskill_dark.ptl`；有 `[object destroy condition] [destroy condition] [time limite] 5000`、`[team] 100` 和 after-create 声音 `SPIRE_CRASH`。 | time-limit 销毁只证明静态字段存在；实际生存时长、声音播放和粒子生成时序需运行验证。 |
| `_cursequeen/spire/body.act` | MOTION 只有 BASE `../Animation/body.ani`，未观察到 action 分支、`[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 本桶没有可解析的创建 ID；不能从目录存在反推 registry 入口。 |
| `_cursequeen/spire/attack.atk` | 有 magic / dark element、damage bonus `50`、weapon damage apply `1`、attack enemy `1`，并有三段 `[active status]`：curse 列为 `100 60 10000 100 100 100 100`，slow 列为 `100 60 5000 50 50`，armor break 列为 `100 60 10000 15`。 | `.atk` 只给攻击 payload 和异常状态列形，不给 hitbox 坐标；异常触发概率、持续时间和实机效果需运行验证。 |
| `_cursequeen/spire` prefix | 同前缀 6 个文件内搜索未观察到 homing、`[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`；`passiveobject.lst` 和 NUT 文本搜索未观察到本路径直接入口。 | 这是“目录文件链闭合但未观察到外部数字入口”的样本；不能写成全局未使用，只能写成当前未观察到直接入口。 |

## SPC _cursequeen/cry 生命周期 / active status
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cursequeen/cry/body.obj` | 对象挂 `Action/body.act`、`AttackInfo/attack.atk` 和四条粒子侧车；销毁块为 `[destroy condition] [time limite] 10000`，after-create 声音为 `FT_AVATAR_HORROR_03`。 | time-limit 只证明静态字段存在；实际生存时长、声音播放和粒子生成时序需运行验证。 |
| `_cursequeen/cry/body_tower.obj` | 与 `body.obj` 同形挂同一 `.atk` 和四条粒子侧车，但 basic action 为 `Action/body_Tower.act`，销毁块为 `[time limite] 4500`。 | 同桶两个 owner 不能合并成单一生命周期；需要按 owner 分别记录销毁时间。 |
| `_cursequeen/cry/body.act` / `body_Tower.act` | 两个 action 内容同形：FRAME0 触发一次 `FLASH SCREEN 150 1500 150 200 30 30 30`，并对自身执行 `[ATTACKRECT] [RESET]`。 | 闪屏、攻击矩形重置和命中时序只能证明字段列形存在，不能证明实机触发顺序和手感。 |
| `_cursequeen/cry/attack.atk` | magic / dark element、weapon damage apply `1`、attack enemy `1`，并有 curse `[active status]` 列 `100 60 10000 100 100 100 100`。 | `.atk` 只给攻击 payload 和异常状态列形，不给 hitbox 坐标；curse 实机概率、持续时间和抗性结算需运行验证。 |
| `_cursequeen/cry` prefix | 同前缀文本链内搜索未观察到 homing、`[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`；`passiveobject.lst` 和 NUT 文本搜索未观察到本路径直接入口。 | 这是“目录文件链闭合但未观察到外部数字入口”的样本；不能写成全局未使用。 |

## SPC _firewitch/ador homing / 生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_firewitch/ador/body.obj` | 对象有 `[homing]` 闭合块：use `1`、follow `[ENEMY]`、velocity `250 250`、check gap `600`、sync animation rotation `0`、max rotation `180`；同时有 `[object destroy condition] [destroy condition] [on end of animation]`、`[team] 100` 和 after-create 声音。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪速度、旋转和动画结束销毁时序不由静态只读证明。 |
| `_firewitch/ador/body.act` | BASE `body.ani`；在 `[ON ATTACKSUCCESS]` 触发后对自身执行行为 0，行为 0 为 `[DESTROY]`。 | 攻击成功触发与对象销毁先后需实机验证；静态只读只证明触发与行为结构存在。 |
| `_firewitch/ador/Destroy.act` | last action BASE `destroy.ani`；FRAME0 行为 0 创建 40002，行为 1 召唤 601；另有 `[WHICH] [ALL MONSTER TEAM] ... [IS INDEX] 601` 与 `[CHECKED NO] <= 5` 条件。 | 40002 在创建块中走 passiveobject registry；601 在 monster 检查和召唤块中走 monster registry。两个数字在错误 registry 也有碰撞命中，不能脱离父块解释。 |
| `40002 -> Common/FireExplosion.obj` | 下游对象直连 `Animation/FireExplosion.ani` 并挂 `AttackInfo/FireExplosion.atk`，还有四个 `FireExplosionParticle*.ptl` 字符串数据。 | `.ptl` 字符串只证明 PVF 内部资源引用，不证明客户端 ImagePacks2/NPK 完整；空图攻击框不证明实机命中。 |

## SPC _firewitch/ador ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `Destroy.act [CREATE PASSIVEOBJECT] [INDEX]` | 40002 | `passiveobject/passiveobject.lst` 命中 `Common/FireExplosion.obj`；同号在 `monster/monster.lst` 也命中其他对象，但本上下文不按 monster 解释。 |
| `Destroy.act [WHICH] [ALL MONSTER TEAM] ... [IS INDEX]` | 601 | `monster/monster.lst` 命中 `Spirit/FireSpirit.mob`；同号在 passiveobject registry 也命中 mapobject，但本上下文不按 passiveobject 解释。 |
| `Destroy.act [SUMMON MONSTER] [INDEX]` | 601 | `monster/monster.lst` 命中 `Spirit/FireSpirit.mob`；召唤块不按 passiveobject registry 解释。 |

## SPC _firewitch/firebreath 生命周期 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_firewitch/firebreath/body.obj` | 对象为 floating height `50`、layer normal、pass all、piercing power `1000`，挂 `Action/Body.act` 与 `AttackInfo/Body.atk`；after-create 声音为 `NPC_SERIA_AMB_02`；销毁块为 `[destroy condition] [on end of animation]`。 | 本小桶未观察到对象级 `[homing]`，不能继承相邻 `ador` 的 homing；动画结束销毁时序和 after-create 声音播放需实机验证。 |
| `_firewitch/firebreath/Body.act` | BASE ANI 为 `../Animation/Body.ani`；FRAME5/7/9/11/13/15/17 均对自身执行行为 0，行为 0 为 `[ATTACKRECT] [RESET]`。 | `[ATTACKRECT] [RESET]` 只记录行为结构，不提供 hitbox 坐标；静态只读不证明多次 reset 的实机命中节奏。 |
| `_firewitch/firebreath/Body.atk` | `.atk` 为 damage bonus `-50`、magic、fire element、weapon damage apply `1`、damage reaction damage、push aside `100`、lift up `50`、blow、no blood `10 0.10000000149011612`。 | `.atk` 只登记攻击 payload；hitbox 坐标仍来自 `Body.ani` 帧级 `[ATTACK BOX]`。 |
| `_firewitch/firebreath/Body.ani` | FRAME000-017 观察到 `[ATTACK BOX]`，FRAME018-019 未观察到盒字段；部分帧同帧多条攻击框。 | 静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空、同步或资源渲染。 |

辅助对照同路径同文件数、action、atk 与 ANI hitbox 同形；差异为辅助 `body.obj [name]` 是直接文本，after-create 声音为 `FIRE_02_LOOP`。该差异只作为对照提示，不能覆盖主目标字段。

## SPC _airsword 生命周期 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_airsword/airsword.obj` | 对象为 width `0 0`、floating height `0`、layer normal、pass all、piercing power `1000`，挂 `Action/airsword.act` 与 `AttackInfo/body.atk`；after-create 声音为 `ELBON_WIND`；销毁块为 `[destroy condition] [on end of animation]`。 | 本小桶未观察到对象级 `[homing]`，不能从其他 SPC 对象继承追踪结论。动画结束销毁和 after-create 声音播放需实机验证。 |
| `_airsword/airsword.act` | action 只有一个 `[MOTION]`，BASE ANI 为 `../animation/airsword.ani`；未观察到 `[SUB ANI]`、`[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 本小桶没有数字 ID registry 解析点；`airsword_light.ani` 虽同前缀可读，但未被该 action 挂接。 |
| `_airsword/body.atk` | `.atk` 为 weapon damage apply `1`、damage bonus `100`、physic、attack enemy `1`、no element、down、push aside `100`、lift up `400`、hit horizon、hit wav `SLASH_HIT`、cut、blood `150 1.399999976158142`。 | `.atk` 只登记攻击 payload；hitbox 坐标仍必须看 action 挂接的 ANI 帧级盒字段。本小桶的 action-linked ANI 未观察到盒字段。 |
| `_airsword/airsword.ani` / `airsword_light.ani` | 两个 ANI 均为 3 帧 `LINEARDODGE` 图像表现；`airsword.ani` 被 `airsword.act` 挂为 BASE，`airsword_light.ani` 当前只观察到同前缀相邻文件，未观察到 action 挂接。两者均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 静态无盒只证明当前样本反编译帧未见盒字段，不证明实机无命中、无伤害或无资源表现；相邻 ANI 不能自动接入 owner action。 |

辅助对照同路径同 5 文件、OBJ/ACT/ATK/ANI 列形、无 homing、无创建/召唤链和无盒观察同形；当前未观察到辅助独有字段。该结论只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC _bal 生命周期 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_bal/body.obj` | 对象为 width `1 1`、floating height `0`、layer normal、pass all、piercing power `100`，挂 `Action/body.act` 与 `AttackInfo/body.atk`；after-create 声音为 `ELBON_WIND`；销毁块为 `[destroy condition] [on end of animation]`。 | 本小桶未观察到对象级 `[homing]`，不能从其他 SPC 对象继承追踪结论。动画结束销毁和 after-create 声音播放需实机验证。 |
| `_bal/body.act` | action 只有一个 `[MOTION]`；BASE ANI 为 `../animation/momentaryslash_red_ldodge_upper.ani`，SUB ANI 为 `../animation/momentaryslash_red_ldodge_under.ani`，SUB 偏移列为 `0 0`；未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 本小桶没有数字 ID registry 解析点；BASE 和 SUB 必须分别读，SUB 不继承 BASE 的攻击框。 |
| `_bal/body.atk` | `.atk` 为 weapon damage apply `1`、damage bonus `100`、physic、attack enemy `1`、no element、down、push aside `100`、lift up `400`、hit horizon、hit wav `SLASH_HIT`、cut、blood `150 1.399999976158142`。 | `.atk` 只登记攻击 payload；hitbox 坐标来自 action 挂接的 ANI 帧级盒字段。 |
| `_bal/momentaryslash_red_ldodge_upper.ani` / `momentaryslash_red_ldodge_under.ani` | BASE upper ANI 的 FRAME000-004 均观察到 `[ATTACK BOX] -284 -77 -13 559 157 70`；SUB under ANI 的 FRAME000-004 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空、同步或资源渲染；SUB 无盒也不证明整条 action 无攻击框。 |

辅助对照同路径同 5 文件、OBJ/ACT/ATK/ANI 列形、无 homing、无创建/召唤链和关键 ANI 盒字段同形；当前未观察到辅助独有字段。该结论只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC _bat homing / 生命周期 / 粒子边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_bat/body.obj` | 对象为 width `0 0`、floating height `30`、layer normal、pass all、piercing power `0`，挂 `Action/body.act`、`AttackInfo/attack.atk` 与 `Action/Destroy.act`；team `100`、after-create 声音 `BAT_FLAP`；销毁块为 `[destroy condition] [on end of animation]`。 | 动画结束销毁、攻击成功销毁和 last action 播放粒子的先后顺序需实机验证；after-create 声音和资源表现不由静态只读证明。 |
| `_bat/body.obj [homing]` | homing 闭合块为 use `1`、follow `[ENEMY]`、velocity `300 300`、check gap `300`、sync animation rotation `0`、max rotation `180`。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪目标选择、速度、旋转和同步表现需实机验证。 |
| `_bat/body.act` | BASE ANI 为 `../animation/body.ani`；`[ON ATTACKSUCCESS]` 后对自身执行行为 0，行为 0 为 `[DESTROY]`；未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 本小桶没有数字 ID registry 解析点；攻击成功触发与销毁先后只由运行验证。 |
| `_bat/attack.atk` | `.atk` 为 damage `600`、physic、weapon damage apply `0`、attack enemy `1`、dark element、down、push aside `200`、lift up `100`、hit horizontal、cut、blood `30 0.5`。 | `.atk` 只登记攻击 payload；hitbox 坐标仍来自 `body.ani` 帧级 `[ATTACK BOX]`。 |
| `_bat/Destroy.act -> Destroy.ptl` | last action BASE `destroy.ani`，FRAME0 播放 `../Particle/Destroy.ptl`；`.ptl` 为 animation object 侧车，object 列表引用 `../Animation/Feather1.ani` 与 `../Animation/Feather2.ani`，并有 random range、gravity、move variable、maximum create number、life time、landing vanish 等列。 | `.ptl` 和 Feather ANI 只证明 PVF 内部资源引用和粒子侧车结构，不证明客户端资源完整；粒子移动、落地消失和显示倍率需实机验证。 |
| `_bat/body.ani` / `destroy.ani` / `feather1.ani` / `feather2.ani` | `body.ani` FRAME000-003 均观察到 `[ATTACK BOX]`；`destroy.ani`、`feather1.ani`、`feather2.ani` 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | basic action 的攻击框不继承到 last action 或粒子侧车；静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空或同步。 |

辅助对照同路径同 9 文件、homing/action/atk/ptl/ANI 盒字段、无创建链和无召唤链同形；当前未观察到辅助独有字段。该结论只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC _burnfire homing / active status / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_burnfire/body.obj` | 对象为 width `0 0`、floating height `30`、layer normal、pass all、piercing power `0`，挂 `Action/body.act` 与 `AttackInfo/attack.atk`；team `100`、`[name]` 为字符串链接样 ``<9::weresist_13`火球`>``，after-create 声音 `LANTURN_FIRE -1`；销毁块为 `[destroy condition] [on end of animation]`。 | `[name]` 字符串链接样不是 registry ID；动画结束销毁、after-create 声音和资源表现需实机验证。 |
| `_burnfire/body.obj [homing]` | homing 闭合块为 use `1`、follow `[ENEMY]`、velocity `400 400`、check gap `100`、sync animation rotation `1`、max rotation `360`。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪目标选择、速度、旋转同步和 max rotation 效果需实机验证。 |
| `_burnfire/body.act` | BASE ANI 为 `../animation/body.ani`；`[ON ATTACKSUCCESS]` 后对自身执行行为 0，行为 0 为 `[DESTROY]`；未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 本小桶没有数字 ID registry 解析点；攻击成功触发与对象销毁先后只由运行验证。 |
| `_burnfire/attack.atk` | `.atk` 为 damage bonus `-30`、magic、weapon damage apply `1`、attack enemy `1`、fire element、damage reaction、push aside `100`、lift up `100`、hit horizontal、blow、no blood `30 0.5`，并有 `[active status] [blind] 100 0 5000 10 0` 与 `[burn] 100 0 15000 2000 500 0 1600`。 | `.atk` 只登记攻击与状态 payload；hitbox 坐标仍来自 `body.ani` 帧级 `[ATTACK BOX]`。状态成功率、持续时间、伤害周期和免疫规则不由静态只读证明。 |
| `_burnfire/body.ani` | ANI 有 `[LOOP] 1` 与 spectrum 表现字段；`FRAME000` 和 `FRAME001` 均观察到 `[ATTACK BOX] -19 -10 -15 32 20 31`，两帧均引用 `Monster/CosmoFiend/Fireball.img` index `0`。 | 静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空、旋转同步或资源渲染；`.atk active status` 不替代 ANI 盒字段。 |

辅助对照同路径同 4 文件、homing/action/atk/ANI 盒字段、无创建链和无召唤链同形；差异为辅助 `body.obj [name]` 直接表现为 `火球 ` 文本。该差异只作为对照提示，不能覆盖主目标字段，后续改主目标前仍需回主目标单独复核。

## SPC _cypherelec homing / 计时销毁 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cypherelec/cypherelec.obj` / `cypherelec2.obj` / `cypherelec_item.obj` | 三个 owner 同构为 width `0 0`、floating height `30`、layer normal、pass all、piercing power `1000`、team `100`、after-create 声音 `GLARINE_ATK -1`、销毁块 `[destroy condition] [on end of animation]`。主目标 `[name]` 为字符串链接样 ``<9::name_8011`麥瑟的魔雷閃電`>``。三者分别挂 `Action/body.act` + `AttackInfo/attack.atk`、`Action/body2.act` + `AttackInfo/attack2.atk`、`Action/body3.act` + `AttackInfo/attack_item.atk`。 | `[name]` 字符串链接样不是 registry ID；动画结束销毁、声音播放和资源表现需实机验证。 |
| `_cypherelec/*.obj [homing]` | 三个 owner 均有 homing 闭合块：use `1`、follow `[ENEMY]`、velocity `250 0`、check gap `100000`、sync animation rotation `0`、max rotation `360`。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪目标选择、速度单位、超大 check gap 和旋转效果只能运行验证。 |
| `_cypherelec/body.act` / `body2.act` / `body3.act` | `body.act` 与 `body2.act` 的 BASE ANI 为 `../animation/body.ani`，`body3.act` 的 BASE ANI 为 `../animation/body2.ani`。三者均在 `[ON ATTACKSUCCESS]` 后对自身执行行为 0 `[DESTROY]`，并在 `ON SET ACTION` 执行行为 1，记录 `time = GET TIME` 后打开 trigger `1`；`body.act` / `body3.act` 在 `time + 4000 <= GET TIME` 后销毁，`body2.act` 在 `time + 200 <= GET TIME` 后销毁。 | 计时变量、trigger 打开、攻击成功销毁和动画结束销毁之间的先后关系不能由静态只读证明；本桶 action/obj 未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 |
| `_cypherelec/attack.atk` / `attack2.atk` / `attack_item.atk` | `attack.atk` / `attack2.atk` 分别为 damage bonus `-40` / `-50`；`attack_item.atk` 为 absolute damage `1550`。三者均为 magic、attack enemy `1`、no element、damage reaction damage、push aside `100`、lift up `100`、hit wav `NIGHTH_HIT`、hit horizontal、cut、blood `30 0.5` 等 payload。 | `.atk` 只登记攻击 payload，不提供 hitbox 坐标；伤害结算、击退、浮空、命中音和 cut 表现需实机验证。 |
| `_cypherelec/body.ani` / `body2.ani` | `body.ani` 的 FRAME001-003 有 `[ATTACK BOX] -20 -10 -20 40 20 40`，FRAME004 为 `-26 -10 -31 58 20 61`，FRAME005 为 `-37 -10 -37 78 20 76`；`body2.ani` 的 FRAME001-005 分别为 `53 -10 48 40 20 40`、`54 -10 50 40 20 40`、`53 -10 50 40 20 40`、`44 -10 39 58 20 61`、`35 -10 33 78 20 76`。两者 FRAME000/006/007 未观察到盒字段。 | 静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空、同步或资源渲染；偏移版 `body2.ani` 需按 action 挂接关系单独记录。 |
| `_cypherelec` 路由边界 | 脚本全文搜索 `cypherelec` 未命中引用，`passiveobject/passiveobject.lst` 反向搜索 `cypherelec` 也未命中；本桶未闭合到上游数字入口或 registry ID。 | 不能猜测上游创建者；后续若从数字入口发现该对象，仍需回主目标重新解析。 |

辅助对照同路径同 11 文件、OBJ/ACTION/ATK/ANI 盒字段、无脚本引用和无 registry 反向命中同形；差异为辅助 `[name]` 是直接文本。该差异只作为对照提示，不能覆盖主目标字段，后续改主目标前仍需回主目标单独复核。

## SPC _cypherobjectfriend 到 _CypherElec 创建链 / 生命周期
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cypherobjectfriend/cypherobject.obj` / `cypherobject1.obj` | 两个 owner 同构为 width `0 0`、floating height `30`、normal layer、pass all、piercing power `1000`、basic action `Action/start.act`、attack info `AttackInfo/attack.atk`、7 个 etc action；`cypherobject1.obj` 额外有 parent dead / destroy action / only destroy 销毁条件。 | parent dead 与 only destroy 的实际触发时机、父子关系和销毁动作表现不能由静态只读证明。 |
| `_cypherobjectfriend/start.act` / `wait.act` / `rise.act` / `fall.act` / `stay*.act` | `start.act` 随机切 custom 4-7；`wait.act` 在 FRAME1/3/5/7 对 character 距离 `<= 400` 做检查并可切 attack，ON SET ACTION 后记录 `time = GET TIME`，`time + 4000 <= GET TIME` 后切 fall；rise/fall/stay 系列只做 action 切换。 | character 距离检查、随机 stay 选择、计时变量和实际动作循环只能实机验证；这些 action 未观察到 create/summon。 |
| `_cypherobjectfriend/attack.act` | FRAME0 设置 outline、随机 X 速度 `100/-100` 与随机 Y 速度 `15/-15`；FRAME6 创建 passiveobject 8036，创建块为空 particle、level `45`、pos `-5 0 86`，随后清 outline、速度归零并切 custom 1。 | 随机速度、生成位置、frame 触发次数和实际创建次数不能由静态只读证明。 |
| `8036 -> _CypherElec/CypherElec.obj` | 8036 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，按 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/_CypherElec/CypherElec.obj`；下游对象有 `[homing follow] [ENEMY]`、velocity `250 0`、check gap `100000`、sync animation rotation `0`、max rotation `360`、on-end-animation 销毁。 | `[ENEMY]` 后无数字 ID，不走 registry；homing 轨迹、目标选择、速度单位和动画旋转只能运行验证。 |
| `attack.atk` / `attack.ani` / `attack_glow.ani` | 父 `.atk` 为 physic、weapon damage apply `1`、attack enemy `1`、no element、damage reaction down、push aside `400`、lift up `200`、hit horizontal、blow、no blood `200 1.0`；`attack.ani` 与 `attack_glow.ani` 均为 7 帧且每帧有同形 `[ATTACK BOX] -24 -10 72 40 20 40`。 | `.atk` 不提供 hitbox 坐标；BASE/SUB ANI 均需按帧级字段单独判断。 |
| `_CypherElec/body.act` / `attack.atk` / `body.ani` | 下游 `.atk` 为 magic/no element/damage reaction damage，damage bonus `-40`；`body.act` 在攻击成功或 `time + 4000 <= GET TIME` 后销毁，未继续 create/summon；`body.ani` FRAME001-005 有攻击框，FRAME000/006/007 未观察到盒字段。 | 下游攻击成功、计时销毁、父对象销毁和追踪命中的先后顺序都不能由静态只读证明。 |

辅助对照同路径同文件数、8036 路由、OBJ/ACTION/ATK/ANI 盒字段和无继续 create/summon 同形；差异为 name 字符串样式、registry 总量/行号不同。该差异只作为对照提示，不能覆盖主目标字段。

## SPC _cypherobject2 上游 8035 / 61328 monster-check / 8036 创建链
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `8035 -> _cypherobject2/cypherobject.obj` | 8035 按 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/_CypherObject2/CypherObject.obj`。对象为 width `0 0`、floating height `30`、normal layer、pass all、piercing power `1000`，挂 `Action/start.act`、`AttackInfo/attack.atk` 和 7 个 etc action。 | `[name]` 是 string-link 样，不把其中数字当 registry ID；对象无 homing 和对象级 destroy 块，不等于运行中不会被父链或 action 销毁。 |
| `comein.act -> 8035` | 主目标两个上游 action 创建 8035：`bluemarble/cypher/action/comein.act` 与 `cartel/cypher/cypher/action/comein.act`。二者在 FRAME0-4 各三次执行行为 0，行为 0 创建 8035、empty particle、level `45`、random pos `-400 400` / `-150 150 0`。 | 本桶只记录 passiveobject 创建来源，不展开 Monster 主线；实际创建次数、随机位置和出场时序需实机验证。 |
| `_cypherobject2/wait.act` / `stay1/2/3.act` | `wait.act` 在 FRAME1/3/5/7 检查 61328 距离 `<= 300` 且 HP `> 1 [%]` 后可切 attack，并在 `time + 4500 <= GET TIME` 后切 fall；`stay1/2/3.act` 也检查 61328 后切 wait。61328 按 `monster/monster.lst` 命中“魔雷者麦瑟·莫纳亨”。 | 61328 位于 `[WHICH] [MONSTER] [IS INDEX]` 上下文，不能按 passiveobject registry 解释；距离、HP 百分比、计时变量和动作切换时序只能运行验证。 |
| `_cypherobject2/attack.act -> 8036` | FRAME0 设置 outline、随机 X 速度 `100/-100` 与随机 Y 速度 `15/-15`；FRAME6 创建 passiveobject 8036，empty particle、level `45`、pos `-5 0 86`，随后清 outline、速度归零并切 custom 1。 | 随机速度、生成次数和父对象后续动作状态不能由静态只读证明。 |
| `attack.atk` / `attack.ani` / `attack_glow.ani` | 父 `.atk` 为 damage bonus `400`、physic、weapon damage apply `1`、attack enemy `1`、no element、down、push/lift `400/200`、hit horizontal、blow、no blood `200 1.0`；`attack.ani` 与 `attack_glow.ani` 7 帧均有 `[ATTACK BOX] -24 -10 72 40 20 40`。 | `.atk` 不提供 hitbox 坐标；BASE/SUB ANI 均需按帧级字段判断。 |
| `8036 -> _CypherElec/body.act` | 8036 命中 `_CypherElec/CypherElec.obj`，下游有 `[homing follow] [ENEMY]`、velocity `250 0`、check gap `100000`、max rotation `360`；`body.act` 在攻击成功或 `time + 4000 <= GET TIME` 后销毁，未继续 create/summon；`body.ani` FRAME001-005 有攻击框。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪轨迹、攻击成功、计时销毁和父子对象先后顺序需实机验证。 |
| 相邻未挂接 action/ANI | `attack1/2/realattack1/realattack2/move` action 与 `slash.atk` 可读；attack/realattack 系 ANI 有 damage/attack box，`move.ani` 有 damage box，weapon sidecar 未观察到盒字段。 | 这些文件未在 `cypherobject.obj` owner 列表或同前缀脚本文本中观察到挂接，只能作为边界样本，不能写成当前 owner 的运行 hitbox。 |

辅助对照同 33 文件、8035/8036/61328 核心路由、OBJ/ACTION/ATK/ANI 盒字段同形；差异为 name 字符串样式、registry 总量/行号不同，并额外观察到 `stormofmetastasis/ice_wall/cypher2/action/comein.act` 创建 8035。该额外来源只作为辅助差异提示，不能覆盖主目标上游来源结论。

## ActionObject Monster New_Event CypherElec0 / CypherElec1 创建链 / homing / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16068 CypherElec0.obj` | 16068 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/CypherElec0.obj`。对象为 width `0 0`、floating height `30`、normal layer、pass all、piercing power `1000`、team `100`、basic action `Action/body0.act`、attack info `AttackInfo/attack0.atk`、after-create sound `GLARINE_ATK -1`、time limit `10000`。 | raw path 含 `ActionObject/Monster` 不改变 passiveobject registry；同号 equipment registry 碰撞不能脱离 `[CREATE PASSIVEOBJECT]` 上下文解释。 |
| `16068 上游创建` | 主目标 `dual_face/p1_attack.act` 与 `p2_attack.act` 在 FRAME3/4/5/7/8 创建 16068，empty particle、level `1`、POS `[RANDOM] 70 20` 与 `[RANDOM] 30 -30 100`、`COLLISION GROUP 2 0 1`；`dual_face2/action/attack.act` 在 FRAME3/5/7/9/11 创建 16068，empty particle、level `1`、POS `[RANDOM] 50 -50` 与 `[RANDOM] 30 -30 30`、`COLLISION GROUP 2 0 1`。 | 上游 monster action 只作为 passiveobject 创建入口记录，不展开 Monster 主线；多帧创建次数、随机落点、碰撞组效果和实际生成顺序需运行验证。 |
| `16152 CypherElec1.obj` | 16152 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/CypherElec1.obj`。对象字段同 16068，但 basic action / attackinfo 为 `body1.act` / `attack1.atk`，并有 homing：use `1`、follow `[ENEMY]`、velocity `250 0`、check gap `100000`、sync animation rotation `0`、max rotation `360`。当前未观察到主目标 `[CREATE PASSIVEOBJECT]` 创建入口。 | `[ENEMY]` 后无数字 ID，不走 registry；追踪目标、速度单位、check gap、旋转和未闭合上游入口都需实机或后续只读样本补强。 |
| `body0.act / body1.act` | `body0.act` BASE `body0.ani`，FRAME0 限 3 次设置随机 X 速度 `40..120`、随机 Y 速度 `120..-120` 并使用自身方向；攻击成功或 `time + 7000 <= GET TIME` 后自毁。`body1.act` BASE `body1.ani`，攻击成功或 `time + 4000 <= GET TIME` 后自毁。两者均在 ON SET ACTION 记录 `time = GET TIME` 并打开 trigger 1，未观察到继续创建 passiveobject 或召唤 monster。 | 计时变量、攻击成功、自毁时机、随机速度和 homing 追踪的运行表现不能由静态只读证明。 |
| `AttackInfo / ANI / 辅助对照` | `attack0.atk` / `attack1.atk` 同形：damage `1000`、magic、weapon damage apply `1`、attack enemy `1`、light element、damage reaction damage、push/lift `100/100`、hit wav `R_FG_HIT`、hit horizontal、cut、blood `30 0.5`；`.atk` 不提供坐标。`body0.ani` 与 `body1.ani` 同形，FRAME001-003 为 `[ATTACK BOX] -20 -10 -20 40 20 40`，FRAME004 为 `-26 -10 -31 58 20 61`，FRAME005 为 `-37 -10 -37 78 20 76`，FRAME000/006/007 无盒。`body1_ex.act` 物理可读但未观察到本桶 owner/action 挂接。辅助对照同 16068/16152 路由、核心 obj/action/atk/ANI 同形。 | 辅助差异为对象 `[name]` 直接文本、registry 总量/行号、对象脚本长度不同，且辅助只观察到 `p1_attack.act` / `p2_attack.act` 两个 16068 创建入口，未观察到主目标 `dual_face2` 路径；不能覆盖主目标结论。 |

## ActionObject Monster New_Event AirSword00 创建链 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16155 AirSword00.obj` | 16155 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/AirSword00.obj`。对象为 floating height `1`、normal layer、pass all、piercing power `1000`、basic action `action/AirSword_start.act`、attack info `AttackInfo/AirSword.atk`、etc action `action/AirSword_stay.act`、time limit `10000`；未观察到对象级 `[width]`、team 或 `[homing]`。 | raw path 含 `ActionObject/Monster` 不改变 passiveobject registry；同号 equipment registry 碰撞不能脱离 `[CREATE PASSIVEOBJECT]` 上下文解释。 |
| `16155 上游创建` | 主目标 `dual_face/p1_attack2_l.act` 与 `p2_attack2_r.act` 均在 FRAME5 创建 16155，empty particle、level `1`、POS `75 0 0`、`COLLISION GROUP 2 0 1`；FRAME0 分别检查 monster index 61650/61656。`dual_face2/action/attack2_l.act` 与 `attack2_r.act` 均在 FRAME0 创建 16155，empty particle、level `1`、POS `5 0 0`、`COLLISION GROUP 2 0 1`，并分别设置 left/right。 | 上游 monster action 只作为 passiveobject 创建入口记录，不展开 Monster 主线；61650/61656 走 `monster/monster.lst`。实际生成次数、方向、碰撞组和运行顺序需运行验证。 |
| `AirSword_start.act / AirSword_stay.act` | `AirSword_start.act` BASE `Airsword00.ani`，多帧执行 `[ATTACKRECT] [RESET]`，FRAME53 切 `[SET ACTION] [CUSTOM] 0 [NOW]`。`AirSword_stay.act` BASE `Airsword00_stay.ani`，含 character 距离 `<= 600` 检查、`[PULL APPENDAGE] 4 4 8000/7000/6000` 与 X 轴速度 `1000/500/200/0` 的 `[USE MY DIRECTION]` 行为。 | `[ATTACKRECT] [RESET]`、距离检查、拉拽、速度切换和 time limit 销毁只能静态证明字段存在，不能证明实机命中刷新、拉拽效果或轨迹。 |
| `AttackInfo / ANI / 辅助对照` | `AirSword.atk` 为 absolute damage `250`、physic、weapon damage apply `1`、attack enemy `1`、dark element、damage reaction none、push/lift `0/0`、hit wav `R_DARK_KNIGHT_HIT`、hit horizontal、cut、blood `30 1`；`.atk` 不提供坐标。`Airsword00.ani` 为 55 帧，`Airsword00_stay.ani` 为 62 帧；二者每帧均观察到 `[ATTACK BOX] -72 -20 -28 141 40 44`，未观察到 `[DAMAGE BOX]`。辅助对照同 16155 路由、核心 obj/action/atk/ANI 前段同形。 | 辅助差异为对象 `[name]` 直接文本、registry 总量/行号、对象脚本长度不同；辅助只观察到 `p1_attack2_l.act` / `p2_attack2_r.act` 两个创建入口，未观察到主目标 `dual_face2` 两个入边，并额外出现 skill 侧数字命中，不能覆盖主目标结论。 |

## ActionObject Monster New_Event Missile0 创建入口未闭合 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16153 Missile0.obj` | 16153 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Missile0.obj`。对象为 floating height `1`、basic action `action/Missile0.act`、attack info `AttackInfo/BossMissile0.atk`、last action `Action/body1_EX.act`、time limit `30000`、after-create sound `TEMPESTER_MISSILE -1`；未观察到对象级 `[width]`、`[layer]`、`[pass type]`、`[piercing power]`、team 或 `[homing]`。 | raw path 含 `ActionObject/Monster` 不改变 passiveobject registry；同号 equipment registry 碰撞不能覆盖本桶 passiveobject registry 解析。 |
| `Missile0.act / last action` | `Missile0.act` BASE `BossMissile0.ani`，FRAME0/1 执行烟雾粒子行为，FRAME2 先执行烟雾粒子再执行 `[ATTACKRECT] [RESET]`。last action `body1_EX.act` BASE `1ExpDodge_M.ani`、SUB `1ExpNormal_M.ani`，FRAME10 执行 `[DESTROY]`。 | `[ATTACKRECT] [RESET]`、粒子播放、last action 进入条件、time limit 与销毁时序只能静态证明字段存在，不能证明实机触发顺序。 |
| `AttackInfo / ANI / 粒子侧车` | `BossMissile0.atk` 为 weapon damage apply `1`、damage bonus `0`、magic、fire、damage reaction damage、blow、no blood `50 1.0`、push/lift `300/450`；`.atk` 不提供坐标。`BossMissile0.ani` 3 帧均有 `[ATTACK BOX] -24 -10 -9 49 20 18`。`1ExpDodge_M.ani`、`1ExpNormal_M.ani` 和 `BossMissileSmog0.ani` 均未观察到盒字段。 | 飞行态攻击框、爆炸表现和烟雾粒子应分层记录；表现侧车无盒不证明客户端资源完整，也不证明实机视觉一定正常。 |
| `反向检索 / 辅助对照` | 主目标全 PVF 数字检索未观察到 16153 的 `[CREATE PASSIVEOBJECT]` 创建入口，只命中 registry / itemdictionary / iteminfo / mercenary 等数字表。辅助对照同 16153 路由、核心 obj/action/atk/ANI 同形，且反向数字命中同类数字表。 | 本桶是“对象与 hitbox 已闭合、创建入口未闭合”的样本；辅助差异为对象 `[name]` 直接文本、registry 总量/行号和对象脚本长度不同，不能覆盖主目标结论。 |

## ActionObject Monster New_Event Assault_Missile0 创建链 / homing / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16154 Assault_Missile0.obj` | 16154 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Assault_Missile0.obj`。对象为 width `1 1`、normal layer、do not pass、piercing power `0`、team `100`、basic action `action/Assault_Missile0.act`、attack info `AttackInfo/Assault_Missile0.atk`、last action `Action/body1_EX.act`、time limit `30000`，并有 homing：use `1`、follow `[ENEMY]`、velocity `500 500`、check gap `5000`、sync animation rotation `0`、max/init rotation `0/0`、diff rotation `190`、homing time `1000`、sync target move。 | raw path 含 `ActionObject/Monster` 不改变 passiveobject registry；同号 equipment registry 碰撞不能覆盖本桶 passiveobject registry 解析。`[ENEMY]` 后无数字 ID，不走 registry。 |
| `16154 上游创建` | 主目标 `zx_77/action/casting.act` 与 `casting1.act` 在 FRAME4/6 各创建一次 16154，empty particle、level `1`、POS `0 5 -1` 与 `10 -5 -1`、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`；二者差异为 `FIX DIRECTION LEFT/RIGHT`。 | 上游 monster action 只作为 passiveobject 创建入口记录，不展开 Monster 主线；实际生成次数、方向、碰撞组和触发顺序需运行验证。 |
| `Assault_Missile0.act / last action` | `Assault_Missile0.act` BASE `Missile10.ani`、SUB `Missile20.ani`，FRAME0 限 1 次设置 X/Z speed `-20/-40`，FRAME1 限 1 次设置 X/Z speed `900/0`，均使用自身方向；action 内未观察到 `[ATTACKRECT] [RESET]`。last action `body1_EX.act` BASE `1ExpDodge_M.ani`、SUB `1ExpNormal_M.ani`，FRAME10 执行 `[DESTROY]`。 | homing、速度切换、未显式 reset 的攻击刷新、last action 进入条件和 time limit 销毁不能由静态只读证明。 |
| `AttackInfo / ANI / 辅助对照` | `Assault_Missile0.atk` 为 damage `1200`、damage bonus `2`、weapon damage apply `1`、physic、no element、damage reaction damage、push/lift `50/50`、hit wav `A_WHEEL_HIT`、hit down、blow、no blood `0 1.0`；`.atk` 不提供坐标。`Missile10.ani` 两帧有攻击框：`-14 -10 -6 32 20 13` 与 `-14 -10 -7 32 20 13`；`Missile20.ani` 与 last action 两个爆炸表现 ANI 未观察到盒字段。辅助对照同 16154 路由、核心 obj/action/atk/ANI 同形。 | 辅助差异为对象 `[name]` 直接文本、registry 总量/行号、对象脚本长度不同；辅助额外观察到 `timespiral/zx_77` 两个创建入口和 atgunner skill 数字命中，不能覆盖主目标结论。 |

## ActionObject Monster New_Event Hgoblin_Laser 创建链 / hitbox / 销毁
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16157 Hgoblin_Laser.obj` | 16157 走 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/New_Event/Hgoblin_Laser.obj`。对象为 floating height `1`、normal layer、pass all、piercing power `1000`、basic action `Action/Hgoblin_laser.act`、attack info `AttackInfo/BiggunEx.atk`；对象本体未观察到 width、team、对象级 destroy condition 或 `[homing]`。 | raw path 含 `ActionObject/Monster` 不改变 passiveobject registry；同号 equipment registry 碰撞不能覆盖本桶 passiveobject registry 解析。 |
| `16157 上游创建` | 主目标 `zx_77/action/attack.act` 与 `attack1.act` 在 FRAME2 创建 16157，empty particle、level `1`、POS `15 0 1`、`USE OBJECT ZPOS`、`COLLISION GROUP 2 0 1`；二者差异为 FRAME0 分别设置 LEFT/RIGHT。 | 上游 monster action 只作为 passiveobject 创建入口记录，不展开 Monster 主线；实际发射方向、碰撞组和触发顺序需运行验证。 |
| `Hgoblin_laser.act / AttackInfo / ANI` | `Hgoblin_laser.act` BASE `laser_dodge.ani`、SUB `laser_dodge1.ani 0 -5` 与 `laser_dodge2.ani 0 -4`，播放 `MECAGOBLIN_LAZER`，FRAME12 执行 `[DESTROY]`；action 内未观察到 `[ATTACKRECT] [RESET]`。`BiggunEx.atk` 为 damage `600`、magic、light element、damage reaction damage、push/lift `30/30`、hit wav `THUNDERC_ELEC_HIT`、blow、no blood `50 0.5`；`.atk` 不提供坐标。`laser_dodge.ani` FRAME001-006 有同形攻击框 `-7 -10 -10 660 20 21`；两个 SUB ANI 未观察到盒字段。 | 限定源文件未观察到继续创建、召唤、homing、active status、PVP 或 ATTACKRECT reset。辅助对照核心链路同形；差异为 name/speech 字符串样式、registry 总量/行号、脚本长度和额外 `timespiral/zx_77` 入边等，只能作目标集差异提示。 |

## SPC _cyclone homing / opt 创建 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_cyclone/body.obj` / `short1.obj` / `short2.obj` | 三个 owner 均为 width `2 2`、floating height `0`、layer normal、pass all、piercing power `1000`、team `100`、after-create 声音 `GHOSTSTEP_APPEAR -1`、销毁块 `[destroy condition] [on end of animation]`，并挂 `Action/HurricaneOfJudgement.act`；attackinfo 分别为 `HurricaneOfJudgement.atk`、`Short1.atk`、`Short2.atk`。主目标 `[name]` 为字符串链接样 ``<9::name_8015`天谴飓风 2`>``。 | `[name]` 字符串链接样不是 registry ID；动画结束销毁、声音播放、追踪表现和资源渲染需实机验证。 |
| `_cyclone/goldteida_effect.obj` | 对象结构同上，也挂 `Action/HurricaneOfJudgement.act`，但 attackinfo 为 `HurricaneOfJudgement2.atk`；homing velocity / check gap 与 body/short 分支不同。 | 同 action 不代表 attackinfo 和 homing payload 完全相同；按 owner 保留差异。 |
| `_cyclone/*.obj [homing]` | `body.obj`、`short1.obj`、`short2.obj` 的 homing 闭合块为 follow `[ENEMY]`、velocity `150 150`、check gap `500`、sync animation rotation `0`、max rotation `360`；`goldteida_effect.obj` 为 follow `[ENEMY]`、velocity `250 250`、check gap `300`、sync `0`、max `360`。 | `[ENEMY]` 后无数字 ID，不走 registry；速度、check gap、旋转和目标选择只能运行验证。 |
| `_cyclone/short1_1.obj` / `short2_1.obj` | 两个 `_1` owner 只挂 `Action/HurricaneOfJudgement_opt.act`，未观察到对象级 `[attack info]`、homing 或 sound category；同为 on-end animation 销毁。 | 相邻 `Short1_1.atk` / `Short2_1.atk` 文件存在，但当前样本 owner 搜索未命中，不能自动挂接到 `_1.obj`。 |
| `_cyclone/HurricaneOfJudgement.act` | BASE ANI 为 `../animation/HurricaneOfJudgement.ani`；`ON SET ACTION` 后记录 `time = GET TIME` 并打开 trigger `1`，`time + 10000 <= GET TIME` 后销毁；另有 FRAME10 限次 5 的 `[SET FRAME] 6` 行为；未观察到 `[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 计时、限次 frame 跳转、销毁和旋风循环节奏不由静态只读证明。 |
| `_cyclone/HurricaneOfJudgement_opt.act` | BASE ANI 为 `../animation/HurricaneOfJudgement_3.ani`；FRAME0/1/2 创建 48117，FRAME3 销毁；48117 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/_Cyclone/Short1.obj`。 | 48117 位于 `[CREATE PASSIVEOBJECT]` 内，走 passiveobject registry；重复创建次数、位置 `10 0 0`、level `60` 和销毁时序需实机验证。 |
| `_cyclone/attackinfo/*.atk` | `HurricaneOfJudgement.atk` / `HurricaneOfJudgement2.atk` 为 physic、weapon damage apply `1`、damage bonus `-50` / `100`；`Short1.atk` / `Short1_1.atk` 为 absolute damage `800`；`Short2.atk` / `Short2_1.atk` 为 absolute damage `400`。这些 `.atk` 均有 attack enemy `1`、damage reaction none、push aside `100`、lift up `50`、hit wav `WIND_THROW`、blow、no blood `50 0.20000000298023224`。 | `.atk` 只登记攻击 payload，不提供 hitbox 坐标；`Short1_1/Short2_1.atk` 文件存在不证明 `_1.obj` 使用它们。 |
| `_cyclone/HurricaneOfJudgement.ani` / `HurricaneOfJudgement_3.ani` | 主旋风 ANI 11 帧均有 `[ATTACK BOX]`，且 FRAME001 起可出现同帧多条攻击框；opt ANI 4 帧为空图，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 静态 hitbox 存在不证明实机命中、伤害、卡肉、击退、浮空、同步或资源完整；空图 opt ANI 仍可通过 action 创建下游有盒对象。 |

辅助对照同路径同 16 文件、48117 registry 目标、action/attackinfo/ANI 盒字段同形；差异为辅助 `[name]` 是直接文本，registry 总量/行号不同。该差异只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC _aganzo owner 未闭合 / 时间销毁 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_aganzo/` 文件集合 | 主目标同前缀只观察到 `Action/body.act`、`AttackInfo/attack.atk` 与 `Animation/body.ani` 三个文件，未观察到同前缀 `.obj` owner；脚本全文搜索 `_aganzo` 未命中引用。 | 本桶不能写成完整 PassiveObject 对象；只能记录 action/atk/ANI 侧车结构和 owner 未闭合风险。 |
| `_aganzo/body.act` | BASE ANI 为 `../animation/body.ani`；`[ON ATTACKSUCCESS]` 后对自身执行行为 0，行为 0 为 `[DESTROY]`。 | 攻击成功销毁只证明 action 内静态触发；没有 owner `.obj` 时，不能证明实机会创建或进入该 action。 |
| `_aganzo/body.act` 时间 trigger | `ON SET ACTION` 执行行为 1，记录 `time = GET TIME` 并打开 trigger `1`；另一个默认 off trigger 在 `time + 4000 <= GET TIME` 后执行行为 0 `[DESTROY]`。 | `time` 变量、trigger 1 打开后的计时、4 秒销毁时序和触发优先级都需要运行验证。 |
| `_aganzo/attack.atk` | `.atk` 为 damage `1000`、physic、weapon damage apply `0`、attack enemy `1`、no element、damage reaction damage、push aside `100`、lift up `100`、hit wav `NIGHTH_HIT`、hit horizontal、cut、blood `30 0.5`。 | `.atk` 只登记攻击 payload；hitbox 坐标仍来自 `body.ani` 帧级 `[ATTACK BOX]`。 |
| `_aganzo/body.ani` | 8 帧 lineardodge 表现；FRAME001-003 有 `[ATTACK BOX] -20 -10 -20 40 20 40`，FRAME004 为 `-26 -10 -31 58 20 61`，FRAME005 为 `-37 -10 -37 78 20 76`，FRAME000/006/007 未观察到盒字段。 | 静态 hitbox 存在不证明实机命中、伤害、击退、浮空或资源渲染；owner 未闭合时还不能证明该 ANI 会被运行入口加载。 |

辅助对照同路径同 3 文件、无 `.obj`、action/atk/ANI 盒字段和无脚本引用同形，当前未观察到辅助独有字段。该结论只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC _darkcough basic motion / hitbox / registry 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_darkcough/body.obj` | 对象为 width `1 1`、floating height `0`、layer normal、pass all、piercing power `100`，以 `[basic motion] Animation/body.ani` 直连 ANI，并挂 `AttackInfo/body.atk`；after-create 声音为 `ELBON_WIND -1`，销毁块为 `[destroy condition] [on end of animation]`。 | 本桶没有 action 层；动画结束销毁时序、声音播放和资源表现需实机验证。 |
| `_darkcough/body.obj` 路由边界 | `body.obj` 与 `body.atk` 中未观察到 `[homing]`、`[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`；脚本全文搜索 `_darkcough` 未命中引用，`passiveobject/passiveobject.lst` 反向搜索 `_darkcough` 也未命中。 | 当前未闭合到数字入口或 registry ID；不能猜测上游创建者。后续若从数字入口发现该对象，仍需回主目标重新解析。 |
| `_darkcough/body.atk` | `.atk` 为 damage `400`、magic、attack enemy `1`、dark element、damage reaction damage、push aside `30`、lift up `100`、hit horizon、blow、no blood `100 1.0`。 | `.atk` 只登记攻击 payload；hitbox 坐标来自 `body.ani` 帧级 `[ATTACK BOX]`。 |
| `_darkcough/body.ani` | 13 帧暗色爆炸表现；FRAME001 为 `[ATTACK BOX] -30 -20 -10 85 40 58`，FRAME002 为 `-30 -20 -10 60 40 48`，FRAME003-008 均为 `-45 -35 -25 100 70 82`，FRAME000/009-012 未观察到盒字段。 | 静态 hitbox 存在不证明实机命中、伤害、击退、浮空、同步或客户端资源完整。 |

辅助对照同路径同 3 文件、OBJ/ATK/ANI 盒字段、无脚本引用和无 registry 反向命中同形，当前未观察到辅助独有字段。该结论只作为对照提示，后续改主目标前仍需回主目标单独复核。

## SPC laowu AI CHARACTER 检查 / 生命周期边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `laowu/laowu.obj` | 对象为 width `0 0`、floating height `0`、layer normal、pass all、piercing power `1000`，只挂 `Action/buff.act`；未观察到对象级 `[attack info]`、`[homing]`、`[object destroy condition]`、`[CREATE PASSIVEOBJECT]` 或 `[SUMMON MONSTER]`。 | 这是 buff/检查型 passiveobject 样本；无 `.atk` 与无 homing 不证明实机无视觉、buff 或 AI 检查效果。 |
| `laowu/buff.act` | BASE ANI 为 `buff_normal_front.ani`，SUB 为 `buff_front.ani`，`SUB ANI WITH XYZ` 指向 `buff_back.ani` 与 `buff_normal_back.ani`。`CHECK TIME 500` 后进入 `[WHICH] [AI CHARACTER] [CHECKUP] [IS INDEX] 21401`；`[CHECKED NO] <= 0` 时执行行为 0，行为 0 为 `[DESTROY]`。 | `CHECK TIME`、AI CHARACTER 存活/检查口径、`CHECKED NO` 比较和自毁时序只能运行验证；这些 action 行为字段不提供 hitbox 坐标。 |
| `21401` ID 路由 | 21401 在主目标按 `aicharacter/aicharacter.lst` 命中 `aicharacter/priest/laowu/laowu.aic`；同数值在本桶上下文不是 passiveobject ID，也不是 monster ID。 | `[WHICH] [AI CHARACTER]` 的上下文决定 registry；不要按 `[CREATE PASSIVEOBJECT] [INDEX]` 或 `[SUMMON MONSTER] [INDEX]` 解释该数字。 |
| `laowu/action/empty01.act` | 文件存在但主目标 owner 搜索未命中；BASE `SpecialBalloon.ani`，SUB `AvalancheBalloon.ani`，FRAME1 对自身执行行为 0 `[DESTROY]`。 | owner 未闭合时只能作为同前缀侧车/孤立 action 记录，不能写成 `laowu.obj` 生命周期分支。 |
| `laowu` 路由边界 | `laowu.obj`、`buff.act`、`empty01.act` 中未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[attack info]` 或 `[homing]`；`Action/buff.act` owner 只命中 `laowu.obj`，`Action/empty01.act` owner 未命中，`passiveobject.lst` 反向搜索未观察到 laowu 登记。 | 当前未闭合到 passiveobject 数字入口；后续若从其他桶发现数字或脚本入口，仍需回主目标按 owner/action/ANI 重新复核。 |

辅助对照同路径同 13 文件、`laowu.obj` / `buff.act` / `empty01.act` 核心结构、无 CREATE、无 SUMMON、无 attackinfo、无 homing、action-linked ANI 无盒同形；差异为 21401 仍指向同一 aicharacter raw path，但 aicharacter registry 总量/行号不同。该差异只作对照提示，不能覆盖主目标字段。

## SPC mesteria 条件创建 / 粒子 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `mesteria/HalloweenBuster.obj` | 11012 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/mesteria/HalloweenBuster.obj`；对象为 floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/HalloweenBuster1.act`、`AttackInfo/HalloweenBuster.atk` 与两个 etc motion；`[name]` 为 string-link 样。 | 11012 在其他 registry 有碰撞，只有 passiveobject 上下文能证明本对象；name string-link 不按 ID 解释。 |
| `HalloweenBuster1.act` 生命周期 | BASE/SUB 先闭合到 `HalloweenBuster1/2/3.ani`；`ZPOS <= 5` 且 limit `1` 时执行行为 0，行为 0 创建 40005、空 particle、level `70`、pos `0 0 0`，随后 `[DESTROY]`。本桶未观察到 `[SUMMON MONSTER]`、对象级 `[homing]` 或对象级 `[object destroy condition]`。 | ZPOS 判定、limit 触发次数、创建与自毁先后、对象消失时机只能运行验证；静态只读只证明字段和列形。 |
| `FRAME0/1/2 粒子行为` | 三个 frame trigger 均执行行为 1；行为 1 播放 8 组 `ShootingStarFire.ptl`，该 PTL 引用 `ShootingStar1.ani` / `ShootingStar2.ani`，样本未观察到盒字段。 | `.ptl` 只证明 PVF 内部资源引用和 action 播放结构，不证明客户端资源完整，也不替代 ANI hitbox。 |
| `40005 -> Common/ShootingStarExp.obj` | 40005 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，回 `passiveobject/passiveobject.lst` 命中 `Common/ShootingStarExp.obj`；同号在 equipment、monster、map registry 也有碰撞。 | 创建块上下文决定 registry；不能因同号碰撞改按 equipment、monster 或 map 解释。 |
| `ShootingStarExp.obj / .atk / .ani` | 下游对象挂 `Animation/ShootingStarExp.ani` 与 `AttackInfo/ShootingStarExp.atk`，有 `[int data] 99 20 1200 1`；主目标下游 `.atk` 为 magic、attack enemy、fire、down、hit lift up、blow、no blood、push aside、lift up；`ShootingStarExp.ani` 单帧空图有 `[ATTACK BOX] -100 -30 -20 200 60 40`。 | `.atk` payload 不给 hitbox 坐标；`int data` 数字含义未由静态只读证明。 |
| `HalloweenBusterSub.*` 相邻边界 | 同前缀存在 `HalloweenBusterSub.atk` 与 `HalloweenBusterSub.ani`，sub ANI 单帧有攻击框；但 owner 搜索只命中 `character/mage/halloweenbustersub.obj`，未命中 mesteria owner。 | 相邻可读文件不能自动挂到 mesteria 生命周期或 hitbox 链。 |

辅助对照同 20 文件、`HalloweenBuster.obj` / `HalloweenBuster1.act` / `HalloweenBuster.atk` / 关键 ANI / 40005 路由同形；差异为 name 直接文本、registry 总量/行号不同，且辅助 common `ShootingStarExp.atk` 额外观察到 damage bonus `3800` 与 weapon damage apply `1`。这些只作目标集差异提示，不能覆盖主目标字段结论。

## SPC _gligexp 创建 / hitbox / 销毁
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_gligexp/body.obj` / `body2.obj` / `body3.obj` | 三个 owner 均为 floating height `0`、normal layer、pass all、piercing power `1000`、对象级 on-end-animation 销毁；`body/body3` 共用 `Action/Body.act`，`body2` 走 `Action/Body2.act`。 | `[name]` 是 string-link 样，不把 `name_8026` 当 registry ID。 |
| `Body.act` | BASE `Exp.ani`，SUB `Floor.ani`，sound `FIRE_BOMB 0`；FRAME1 触发 flash/shaking 一次和创建 30550 两次，FRAME2/3 各创建 30550 两次，FRAME4 `[DESTROY]`。 | 静态可列出 FRAME 和行为次数，但不证明实机一定全部触发或按该时序完成。 |
| `30550 -> FireExplosion` | 30550 走 `passiveobject/passiveobject.lst`，命中 `Monster/Spirit/FireExplosion.obj`；下游对象 basic motion 直连 `FireExplosion.ani`，挂 `FireExplosion.atk`，并列出 4 个粒子路径。 | raw path 含 `Monster` 不改变 passiveobject registry；粒子路径只作资源引用，不能证明客户端资源完整。 |
| `Body2.act` | 仅挂 BASE `Exp2.ani` 与 sound `FIRE_BOMB 0`，未观察到 trigger、create、summon 或 destroy 行为。 | `body2.obj` 仍有对象级 on-end-animation 销毁；实际生命周期时序需实机。 |
| `.atk` payload | `Body.atk` 为 damage bonus `180`、magic、no element、weapon damage apply、damage reaction damage；`Body2.atk` 为 damage `3200`、ignore defense、down；`Body3.atk` 为 damage `7000`、ignore defense、down，并有 `[stuck] -100.0`。三者均有 push/lift `100/100`、blow、no blood `50 0.5`。 | `.atk` 不提供 hitbox 坐标，也不证明 ignore defense、stuck、damage bonus 的运行公式。 |
| ANI hitbox | `Exp.ani` 5 帧均有同形超大攻击框 `-1080 -360 -87 2101 700 538`；`Exp2.ani` 单帧空图有同形攻击框；`Floor.ani` 6 帧未观察到盒字段；下游 `FireExplosion.ani` 单帧空图有攻击框 `-65 -40 -50 130 80 100`。 | 空图有盒、SUB 无盒和下游 basic motion 有盒需要分层记录；实际可见、命中和碰撞仍需实机。 |
| `限定标签检索` | 主目标 11 个源文件内 `[CREATE PASSIVEOBJECT]` 只命中 `body.act`；未观察到 `[SUMMON MONSTER]`、`[homing]` 或 `[active status]`。全 PVF 搜 30550 还命中其他上下文。 | 本桶只记录 `_gligexp -> 30550` 创建链，不转入技能、道具或 Monster 主线。 |
| `辅助对照差异` | 辅助对照同 11 文件，核心 action/atk/ANI/30550 路由和无 summon/homing/active status 同形。 | 辅助 owner 与下游 FireExplosion `[name]` 为直接文本，passiveobject registry 总量/行号不同，只作差异提示。 |

## SPC _diredirt 生命周期 / active status / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_diredirt/body.obj` / `body2_weapon.obj` | 两个 owner 均为 width `1 1`、floating height `10`、normal layer、pass all、piercing power `0`、last action `Action/destroy.act`、hp max `800`、hp destroy `1`、after-create sound `ELBON_WIND -1`、对象级 on-end-animation 销毁；`body.obj` 为 team `100`，`body2_weapon.obj` 为 team `99`。 | `[name]` 为 string-link 样，不把其中数字当 registry ID；主目标 `passiveobject.lst` 以 `Dirt` 反向检索未命中，因此本桶未闭合到数字入口。 |
| `body.act` / `body2.act` | 两者 BASE 均为 `../animation/Body.ani`；`[ON ATTACKSUCCESS]` 后对 `[ME]` 执行行为 0 `[DESTROY]`，并在 `[WHICH] [LAST ATTACKSUCCESS]` 下对 `[CHECKUP OBJECT] 1` 执行行为 1 `[DISEASE APPENDAGE]`。`body.act` disease 列形为 `6000 150 200 1000`，`body2.act` 为 `100 0 150 1000`。 | 攻击成功、LAST ATTACKSUCCESS、CHECKUP OBJECT 与 appendage 的实际作用目标和时序不能由静态只读证明。 |
| `destroy.act` / `Destroy.ani` | `destroy.act` 只挂 `../animation/Destroy.ani`；`Destroy.ani` 五帧均只观察到图像、坐标和 delay，未观察到盒字段。 | last action 播放不等于有 hitbox；销毁动画实际是否完整渲染还受客户端资源影响。 |
| `body.atk` / `body2_weapon.atk` | 两个 `.atk` 均为 magic、attack enemy `1`、dark element、damage reaction damage、push aside `30`、lift up `100`、hit horizon、blow、no blood `30 0.20000000298023224`；damage 分别为 `400` 与 `8000`。`body2_weapon.atk` 额外有 `[active status] [poison] 75 70 1500 2200`。 | `.atk` 不提供 hitbox 坐标；poison 四数值列只证明静态列形，不证明异常概率、等级、持续、伤害或实机结算。 |
| `Body.ani` | LOOP `1`、FRAME MAX `4`；FRAME000-003 均同时有 `[ATTACK BOX] -10 -10 -2 20 20 8` 与 `[DAMAGE BOX] -20 -10 -10 40 20 23`。 | 同一 ANI 同帧可同时存在 attack/damage box；实机命中、受击和碰撞表现仍需运行验证。 |
| `限定标签检索` | 主目标 9 个源文件内 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]` 均为 0；`[active status]` 只命中 `body2_weapon.atk`，`[DISEASE APPENDAGE]` 只命中 `body.act` 与 `body2.act`。 | 本桶不产生 passiveobject 创建链或 monster 召唤链；不能从无命中外推到其他 SPC 目录。 |
| `辅助对照差异` | 辅助对照同 9 文件，action/atk/ANI/盒字段/无 create-summon-homing 同形。 | 辅助 owner `[name]` 为直接文本且 registry 总量不同，只作为目标集差异提示。 |

## SPC root flowermanager / icedropmanager / runningicedrop 生命周期 / homing
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `flowermanager.obj` | 对象 width `1 1`、floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/Flowermanager.act`，有 `[sound category] [after object create] NPC_SERIA_AMB_02 -1` 与 `[object destroy condition] [on end of animation]`。 | sound category 是主目标字段；辅助对照同对象 sound 为 `FIRE_02_LOOP -1`，只能作为差异提示。 |
| `Flowermanager.act -> 8153` | BASE `Dummy.ani`；FRAME0 连续 7 次行为 0 创建 8153，particle `../Particle/dummy2.ptl`、level `40`、random pos `-200 200` / `-90 90 0`，随后行为 1 `[DESTROY]`。 | 8153 走 passiveobject registry 命中 IceFlower；本桶只登记边界目标，不展开 BreakableObject 主线。 |
| `IceDropManager.act -> 8153 check -> 8023` | FRAME0 检查 `[WHICH] [PASSIVE] [CHECKUP] [IS INDEX] 8153`；行为 0 创建 8023、空 particle、level `40`、random pos `70 -70` / `30 -30 0`；行为 1 `[DESTROY]`。 | `CHECKUP OBJECT` 与 `[ME]` 行为选择的运行语义不能静态证明，只能记录结构和列形。 |
| `runningicedrop.obj` | 对象挂 `Action/RunningIceDrop.act` 与 5 个 etc action；homing 块为 use `1`、follow `[ENEMY]`、velocity `100 100`、check gap `300`、sync animation rotation `0`、max rotation `270`。 | `[ENEMY]` 后无数字，不走 registry；追踪轨迹、旋转表现和目标选择需实机验证。 |
| `RunningIceDrop.act` | BASE `TimeControl.ani`，FRAME0 limit `1` 后 `[SET ACTION] [CUSTOM] 4 [NOW]`；FRAME6 `[TRIGGER] 0 [RESET]` 后 `[DESTROY]`。 | `CUSTOM 4` 指向哪个 etc action 的运行选择不能只靠静态字段证明。 |
| `RunningIceDropStraight/Up/Down/Random/2.act` | 5 个 etc action 均创建 8023；straight/up/down 为 7 帧 level `40` 轨迹，random 为 6 帧 level `40` 且使用 basepos/direction，`runningicedrop2` 为 7 帧 level `47`。 | 创建次数与帧触发可静态列出，运行中是否全部触发、是否受销毁/碰撞/时间影响仍需实机。 |
| `IceDrop.obj / IceDrop.act / IceDrop.atk` | 8023 命中 `ActionObject/SPC/IceDrop.obj`；对象挂 `Action/IceDrop.act`、`AttackInfo/IceDrop.atk` 与 on-end-animation 销毁。`.atk` 为 damage `1200`、magic、attack enemy、warter、push/lift/no blood 等 payload；BASE `Blizzard_Big.ani` 有攻击框，SUB effect 与粒子侧车无盒。 | `.atk` 不给 hitbox 坐标；on-end 销毁、FRAME1 粒子播放、攻击命中和伤害结算都不是静态只读可证明的运行结果。 |
| `辅助对照差异` | 辅助对照同 14 个 icedrop 命名文件、8 个 root SPC animation、8023/8153 核心 passiveobject 路由和 ANI 盒字段同形。 | 辅助对照 registry 总量/行号不同，8023 额外命中 quest registry，8153 额外命中 map registry；这些只作差异提示。 |

## SPC _firewitch/meteo 生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `_firewitch/meteo/body.obj` / `horobe1.obj` / `horobe2.obj` | 三者均为 floating height `50`、pass all、piercing power `1000`、after-create `MATEO_FLY`，并以 `[object destroy condition] [destroy condition] [on end of animation]` 销毁；三者共用 `Action/body.act` 与 `Action/Destroy.act`，但分别挂 `attack.atk` / `horobe1.atk` / `horobe2.atk`。 | 本小桶未观察到对象级 `[homing]`；不要继承相邻 `ador` 的 homing 结论。动画结束销毁时序和 attackinfo 伤害结算需实机验证。 |
| `_firewitch/meteo/body_cyclops.obj` | 对象同为 after-create `MATEO_FLY` 与 `[on end of animation]` 销毁，但 basic action 为 `Action/body_Cyclops.act`，last action 为 `Action/Destroy_Cyclops.act`，attackinfo 为 `attack2.atk`。 | Cyclops 分支不能和普通 `body/horobe` 分支合并；`attack2.atk` 的 weapon damage apply 和 damage bonus 语义不由静态只读证明。 |
| `body.act` / `body_Cyclops.act` | 两个 action 均在 FRAME0 执行 `[FLASH SCREEN] 150 1500 150 200 30 30 30`；随后检查 `ZPOS <= 40` 且 `[CHECKED NO] > 0` 时对自身执行 `[SET FRAME] 1`。 | `ZPOS` 判定、frame 跳转、落地时机和闪屏表现均为运行风险；静态只读只证明字段和列形存在。 |
| `Destroy.act` / `Destroy_Cyclops.act` | 两个 last action 均在 FRAME0 播放 `../Particle/Destroy.ptl` 并创建下游 passiveobject：普通分支创建 8236，Cyclops 分支创建 10027；创建列形均为空 `[PARTICLE FILENAME]`、level `60`、pos `0 0 0`。 | `.ptl` 只证明 PVF 内部资源引用，不证明客户端资源完整；两个创建 ID 都必须按 passiveobject registry 解析。 |
| `8236 -> Jeff_Omega_BigBoom.obj` | 8236 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/Jeff_Omega_BigBoom.obj`；对象只观察到 `Action/Jeff_Omega_BigBoom.act`，未观察到对象级 `[attack info]`。 | raw path 含 `Monster/` 不改变 registry 路由；无对象级 `.atk` 不等于运行无效果，需继续按 action/ANI 和实机验证区分。 |
| `10027 -> BigBoom.obj` | 10027 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/BigBoom.obj`；对象挂 `Action/BigBoom.act` 与 `AttackInfo/Big.atk`。 | `Big.atk` payload 和 `Bigboom1_1.ani` hitbox 分层记录；爆炸时序、命中和伤害仍需实机验证。 |

## SPC _firewitch/meteo ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `Destroy.act [CREATE PASSIVEOBJECT] [INDEX]` | 8236 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/Jeff_Omega_BigBoom.obj`。 |
| `Destroy_Cyclops.act [CREATE PASSIVEOBJECT] [INDEX]` | 10027 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Jeff/BigBoom.obj`。 |

## ActionObject Monster at_5t_walker rocket 生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `at_5t_walker/rocket1.obj -> rocket1.act` | object 挂 `Action/rocket1.act` 与 `AttackInfo/rocket1.atk`。action 在 FRAME0 出两个销毁粒子；当 `ZPOS >= 350` 时三次创建 10263，三次创建只改 `[PARTICLE FILENAME]`，随后 `[DESTROY]`。 | 10263 走 `passiveobject/passiveobject.lst`；三次创建是否同时生成、粒子显示和销毁时序需实机验证。 |
| `at_5t_walker/rocket2.obj -> rocket2.act` | object 挂 `Action/rocket2.act` 与 `AttackInfo/rocket2.atk`。action 在 FRAME0 播放 `ROCKET_JET_S` 并出粒子；当 `ZPOS <= 20` 时创建 10267 并 `[DESTROY]`；攻击成功后检查 61236 并对 `[CHECKUP OBJECT] 2` 执行 `[RESTORE] [HP] -1 [%]`。 | 10267 走 passiveobject registry；61236 位于 `[WHICH] [LAST ATTACKSUCCESS] [IS INDEX]`，走 `monster/monster.lst`。扣血对象、百分比语义和攻击成功时序不由静态只读证明。 |
| `at_5t_walker/rocketboom.obj` / `rocketboom1.obj` | 二者都有 `[object destroy condition] [destroy condition] [time limite] 1000`，共用 `Action/rocketboom.act`，但分别挂 `JeffMissileEXP.atk` / `JeffMissileEXP1.atk`。 | 物理文件 `rocketboom1.obj` 可读且引用 `JeffMissileEXP1.atk`，但当前只观察到 10267 创建 `rocketboom.obj`；未把 `rocketboom1` 写成该链已解析创建目标。 |
| `at_5t_walker/rocketboom.act` | BASE/SUB ANI 为 `JeffMissileEXP.ani` 与 `JeffMissileEXP1/2/3.ani`；攻击成功检查 61236 后对 `[CHECKUP OBJECT] 0` 执行 `[RESTORE] [HP] -1 [%]`；ON SET ACTION 后 `[SET TEAM] 0`；FRAME5 `[DESTROY]`。 | `SET TEAM`、`RESTORE`、`CHECKUP OBJECT` 与 1000 时间销毁是静态结构；运行先后、敌我效果、命中对象和伤害表现需实机验证。 |

## at_5t_walker rocket ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `rocket1.act [CREATE PASSIVEOBJECT] [INDEX]` | 10263 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/rocket2.obj`。 |
| `rocket2.act [CREATE PASSIVEOBJECT] [INDEX]` | 10267 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/rocketboom.obj`。 |
| `rocket2.act / rocketboom.act [WHICH] [LAST ATTACKSUCCESS] [IS INDEX]` | 61236 | `monster/monster.lst` 命中 `NewMonsters/Cartel/warjack/warjack.mob`；不按 passiveobject ID 解释。 |

## ActionObject Monster at_5t_walker fire/bullet/missile/exp 生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `at_5t_walker/fire.obj -> fire.act` | object 为 floating height `50`、pass all、piercing power `1000`，挂 `Action/fire.act` 与 `AttackInfo/fire.atk`，销毁条件为 `[on end of animation]`。action 多帧执行 `[ATTACKRECT] [RESET]`，FRAME3/11 攻击成功后检查 61236 并对 `[CHECKUP OBJECT] 1` 执行 `[RESTORE] [HP] -1 [%]`。 | 61236 位于 `[WHICH] [LAST ATTACKSUCCESS] [IS INDEX]`，走 `monster/monster.lst`；扣血对象、命中时序和 fire 音效运行表现需实机验证。 |
| `at_5t_walker/bullet.obj` / `bullet1.obj` | `bullet.obj` 挂 `Bullet.act`、`hit.act` 和 `BulletMusket.atk`；`bullet1.obj` 挂 `Bullet1.act` 和 `BulletMusket1.atk`。`Bullet.act` 攻击成功后切 custom action 0；`Bullet.act` / `Bullet1.act` FRAME2 攻击成功后检查 61236，并在 `[CHECKUP OBJECT]` 下随机选择 1-9 或 0-8。 | `[CHECKUP OBJECT] [RANDOM SELECT]` 的数字是检查对象候选，不按 passiveobject 或 monster registry 解析；custom action 0 的运行选择需实机验证。 |
| `at_5t_walker/bombingmissile.obj -> BombingMissile.act` | object 有 width `25 14`、hp max `500`、hp destroy `1`、time-limit `5000` 销毁块，挂 `JeffMissile_Oblique.atk`。action ON SET ACTION 后设置 Z 轴速度 `-500` 与 team `0`；`ZPOS <= 30` 后创建 10284 并 `[DESTROY]`；FRAME0 攻击成功后检查 61236。 | 10284 走 passiveobject registry 命中 `ActionObject/Monster/at_5t_walker/rocketboom1.obj`；61236 走 monster registry。落地条件、team、销毁先后和实际命中对象需实机验证。 |
| `at_5t_walker/exp.obj -> Exp.act` | object 为 floating height `0`、pass all、piercing power `1000`，挂 `Exp_attack.atk`，销毁条件为动画结束。action FRAME1 创建 8715，FRAME0 攻击成功后检查 61236 并对 `[CHECKUP OBJECT] 1` 执行扣血行为。 | 8715 走 passiveobject registry 命中 `ActionObject/Monster/Giselle/GiselleFloor.obj`；这是跨 owner 下游，不是 Monster registry。 |
| `8715 GiselleFloor.obj -> Floor.act` | 下游对象为 bottom layer、pass all、piercing power `1000`，挂 `Floor.act` 与 `Floor_attack.atk`，销毁条件为动画结束；`Floor.act` 在 FRAME1/2 执行 `[ATTACKRECT] [RESET]`。 | 8715 是 passiveobject 下游；Floor 的攻击框来自 `ExpFloorNormal.ani`，`.atk` 只记录 payload。 |

## at_5t_walker fire/bullet/missile/exp ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `BombingMissile.act [CREATE PASSIVEOBJECT] [INDEX]` | 10284 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/rocketboom1.obj`。 |
| `Exp.act [CREATE PASSIVEOBJECT] [INDEX]` | 8715 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/Giselle/GiselleFloor.obj`。 |
| `fire.act / Bullet.act / Bullet1.act / BombingMissile.act / Exp.act [WHICH] [LAST ATTACKSUCCESS] [IS INDEX]` | 61236 | `monster/monster.lst` 命中 `NewMonsters/Cartel/warjack/warjack.mob`；不按 passiveobject ID 解释。 |

## ActionObject Monster at_5t_walker special 批量投放生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `at_5t_walker/special.obj` | object 为 floating height `0`、normal layer、pass all、piercing power `1000`，挂 `Action/special.act`，`[attack info]` 为空字符串；未观察到对象级 `[object destroy condition]`。 | 对象无 `.atk` 不等于链路无攻击；攻击盒来自 action 创建的 10268 下游。 |
| `special.act` 初始化 | BASE/SUB ANI 为 `special.ani` / `special1.ani` / `special2.ani`，有 `AIRPLANE_02` 声音；ON SET ACTION 后 `[IS DIRECTION TO MOVE] 1`、设置 X 轴速度 `800`、记录 `time = GET TIME` 并打开 trigger 1。 | X 轴速度、朝向移动和时间单位只证明静态字段存在，实际飞行/镜头/同步需实机验证。 |
| `special.act` 批量创建 | 当 `time + 2000 <= GET TIME` 后执行 16 个 `[CREATE PASSIVEOBJECT] [INDEX] 10268` 块；每块均为 level `0`、空粒子、三组 `[RANDOM]` 位置列、`[USE MAP POS]`、`[WARNING MARK] 0 0` 与随机预警列，随后关闭 trigger 1 并 `[DESTROY]`。 | 10268 走 passiveobject registry；16 个创建块的实际时序、地图坐标解释、预警表现和对象是否全部生成需实机验证。 |
| `10268 -> BombingMissile.obj` | 10268 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/BombingMissile.obj`；下游 `BombingMissile.act` 继续在低 Z 条件后创建 10284，并在攻击成功后检查 61236。 | 10284 仍走 passiveobject registry，61236 仍走 monster registry；同一链中 registry 由上下文决定。 |

## at_5t_walker special ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `special.act [CREATE PASSIVEOBJECT] [INDEX]` | 10268 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/BombingMissile.obj`。 |
| `BombingMissile.act [CREATE PASSIVEOBJECT] [INDEX]` | 10284 | `passiveobject/passiveobject.lst` 命中 `ActionObject/Monster/at_5t_walker/rocketboom1.obj`。 |
| `BombingMissile.act [WHICH] [LAST ATTACKSUCCESS] [IS INDEX]` | 61236 | `monster/monster.lst` 命中 `NewMonsters/Cartel/warjack/warjack.mob`；不按 passiveobject ID 解释。 |

## ActionObject Monster at_5t_walker barr/destroy/smoke 生命周期 / ID 路由
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `barr.obj` / `barr1.obj` / `barr2.obj` | 三者分别为 width `100 50`、`80 50`、`70 50`；其余核心列形同构：floating height `0`、normal layer、`[pass type] [do not pass]`、basic motion、空 attackinfo、`[destroy particle] Particle/barrdestroy.ptl`、`[can beat index] 61235 [/can beat index]`、`[is blocking obj] 1`、`[hp max] 100000`、`[hp destroy] 1`。 | hp/blocking/可击破字段只证明静态结构；阻挡范围、可击破对象、耐久和销毁表现需实机验证。 |
| `barr* -> barrdestroy.ptl` | `barrdestroy.ptl` 为 z axis 粒子侧车，straight line、gravity `1000`、life time `1000`、landing type `[stop]`、max create number `5`，引用 4 个 particle animation。 | `.ptl` 只证明 PVF 侧引用，不证明客户端 ImagePacks2/NPK 资源存在。 |
| `destroy.obj -> destroy.act` | `destroy.obj` 挂 `Action/destroy.act`，空 attackinfo；`destroy.act` FRAME0 执行 `[PARTICLE] ../particle/destroy.ptl 0 0 0`。 | `Action/destroy.act` 字符串跨 owner 复用，本结论只属于 at_5t_walker owner；粒子播放、销毁时序和视觉需实机验证。 |
| `destroydust.obj` / `shootsmoke.obj` | 二者均为 pass all、piercing power `1000`、basic motion 直连表现 ANI、空 attackinfo；未观察到对象级销毁块或创建行为。 | 表现层对象是否由其他 monster/action 创建，当前未追出；这里只登记对象自身结构和 ANI 盒字段。 |

## at_5t_walker barr/destroy/smoke ID 路由

| 上下文 | 数字 | registry 复核 |
| --- | ---: | --- |
| `barr.obj / barr1.obj / barr2.obj [can beat index]` | 61235 | `monster/monster.lst` 命中 `NewMonsters/Riding/at_5t/at_5t.mob`；主目标 passiveobject registry 未命中。 |

## ActionObject SPC rina 生命周期 / homing
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `rina/event_thunder.obj -> Event_Thunder.act` | object 为 floating height `1`、normal layer、pass all、piercing power `1000`、team `100`，挂 `Action/Event_Thunder.act` 与 `AttackInfo/Event_Thunder.atk`；action FRAME9 对自身执行 `[DESTROY]`。 | action frame 销毁只证明静态触发结构；雷击命中、伤害、击退和销毁时序需实机验证。 |
| `rina/rocketblast.obj -> RocketBlast.act` | object 为 width `0 0`、team `0`，挂 `RocketBlast.atk`；action BASE/SUB 指向 `RocketBlast1/2.ani`，FRAME6 对自身执行 `[DESTROY]`。 | 该 `Action/RocketBlast.act` 字符串跨多个 owner 复用，本结论只属于 rina owner 目录解析出的物理 action。 |
| `rina/rosiclockball.obj -> RosiClockBall.act` | object 有 `[homing]` 闭合块：follow `[ENEMY]`、velocity `10 10`、check gap `100`、sync animation rotation `1`、max/init/diff rotation `360`、homing time `50000`；action FRAME6 或攻击成功后销毁。 | `[ENEMY]` 后无数字，不解析 registry；追踪轨迹、旋转、持续时间、攻击成功触发和销毁先后不由静态只读证明。 |
| `rina/skypotel.obj -> skypotel.act` | object 不挂 `.atk`，action 在 FRAME0/1 对 `[SUMMON MASTER]` 执行行为 0；行为 0 为 `[SET SPEED]`，X 轴 `1200`、Z 轴 `600`。 | `[SUMMON MASTER]` 不是 `[SUMMON MONSTER]`，本桶没有 monster registry 解析点；速度单位、主人对象、运动表现和实际抛射行为需运行验证。 |

## ActionObject SPC despair_tower/sjar ok 分支创建链 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `sjar_coin_bom.obj -> sjar_bom_ok.act` | coin bom 对象为 normal layer、pass all、piercing power `1000`、team `100`，不挂 `.atk`；ok action BASE `sjar_coin_ok.ani`，FRAME1 限次用 `[RANDOM SELECT] 0 1` 选择两种 9202 创建行为，FRAME2 自毁。 | 当前只闭合 ok 分支；bad / fortune / summon 分支不并入本桶结论。 |
| `9202 ZDrop.obj` | 9202 走 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/ZDrop.obj`；对象不挂 `.atk`，basic action 为 `ZDrop_start.act`，etc action 为 `ZDrop_move.act` / `ZDrop_end.act`。三份 action 均创建 9203，创建块为空 particle、level `70` 和随机位置。 | ZDrop 是中间投放层；`MechaDropAppear/Move/Disappear.ani` 均未观察到盒字段，不代表末层无攻击盒。 |
| `9203 ZGT.obj -> 9204 ZMissile.obj` | 9203 走 passiveobject registry 命中 `ZGT.obj`；`ZGT.act` BASE `dumy2.ani`、SUB `WarningMark.ani`，FRAME6 限次创建 9204，empty particle、level `70`、pos `0 0 500`，FRAME9 自毁。 | `dumy2.ani` 与 `WarningMark.ani` 均未观察到盒字段；预警表现不提供 hitbox 坐标。 |
| `9204 ZMissile.obj -> 9206 ZMissileExp.obj` | 9204 走 passiveobject registry 命中 `ZMissile.obj`；对象 basic action 实际为 `Action/Missile.act`，且有 on-end-animation 销毁块。`Missile.act` BASE `Missile.ani`，FRAME0 设置 Z 轴速度 `-430` 和 team `50`；`ZPOS <= 40` 时创建 9206 并播放销毁粒子、shaking、自毁；攻击成功也执行自毁行为。 | 文件名不能推断 action 名；本桶必须按 `.obj` 内引用解析。落地条件、攻击成功触发和销毁先后需运行验证。 |
| `9206 ZMissileExp.obj -> JeffMissileEXP` | 9206 走 passiveobject registry 命中 `ZMissileExp.obj`；对象挂 `Action/JeffMissileEXP.act` 与 `AttackInfo/JeffMissileEXP.atk`，time limit `1000`。`.atk` 为 absolute damage `35000`、weapon damage apply `1`、physic/fire/down、attack enemy `1`、push/lift `50/500`、hit lift up、blow、no blood `100 1.0`。BASE `JeffMissileEXP.ani` FRAME000 有 2 条攻击盒，FRAME001-003 各有 3 条攻击盒，FRAME004-005 无盒；SUB `JeffMissileEXP1/2/3.ani` 未观察到盒字段。 | `.atk` 不提供 hitbox 坐标；实际爆炸命中、震屏、伤害结算和持续帧只能实机验证。 |
| `限定标签检索 / 辅助对照` | 本 13 个源文件内 `[CREATE PASSIVEOBJECT]` 只命中 ok、ZDrop 三 action、ZGT 与 Missile；未观察到 `[SUMMON MONSTER]`、`[homing]` 或 `[active status]`。辅助对照同 19 个 sjar 文件、同 9202/9203/9204/9206 registry 路由、核心 action/atk/ANI 盒字段同形。 | 辅助差异为对象 `[name]` 文本样式、registry 总量/行号和部分对象脚本长度；不能覆盖主目标字段形态。 |

## ActionObject SPC despair_tower/sjar bad 分支 Trap/Common 创建链 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `sjar_coin_bom.obj -> sjar_bom_bad.act` | bad action BASE `sjar_coin_bad.ani`；FRAME1 限次触发 `[RANDOM SELECT] 0 1` 后创建 8376。第一行为 3 个创建块且 level 均为 `70`；第二行为 5 个创建块且首块 level `0`、其余 level `70`。每块均为空 particle，`[POS]` 下为 `[RANDOM] 20 300` 与 `[RANDOM] 0 70 -120`，并使用自身 basepos、object zpos 和自身方向；FRAME2 自毁。 | 本桶只闭合 bad 分支；ok、fortune、summon 分支不并入本节。随机选择结果、实际落点和同帧多对象生成顺序需运行验证。 |
| `8376 MinePressure2.obj` | 8376 走 passiveobject registry 命中 `ActionObject/Trap/MinePressure2.obj`；对象为 bottom layer、pass all、piercing power `1000`，basic action `MineStay2.act`，etc action `MineActive2.act`，attack info `MinePressure.atk`，destroy particle `MinePressureDestroy.ptl`。`MinePressure.atk` 只有 `[damage reaction] [none]`。 | actionobject/Trap 是 passiveobject 路径前缀，不转成 Monster 主线；`.atk` 不提供 hitbox 坐标。 |
| `MineStay2.act / MineActive2.act` | `MineStay2.act` BASE `MinePressureReady2.ani`，SUB `MineAlram2.ani 0 0`，角色距离 `< 100` 时切到 custom action 0。`MineActive2.act` BASE `MinePressureActive2.ani`，SUB `MineAlram2.ani 0 -1` 与 `MinePressureReady2.ani 0 -2`，FRAME1 创建 8375，level `60`、pos `0 0 0`，随后自毁。 | 距离检查、动作切换时机、声音播放和自毁先后不能由静态只读证明。 |
| `8375 MineExplosion2.obj -> MineExplosion` | 8375 走 passiveobject registry 命中 `ActionObject/Common/MineExplosion2.obj`；对象为 normal layer、pass all、piercing power `1000`，basic action `MineExplosion.act`，attack info `MineExplosion2.atk`。`MineExplosion2.atk` 为 damage `1000`、magic、attack enemy `1`、fire element、damage reaction damage、push/lift `50/100`、hit wav `FIRE_EXPLOSION_CREATE`、blow、no blood `100 1.0`。 | common 爆炸对象是下游 passiveobject，不把 attackinfo payload 写成盒坐标；实际伤害、击退和浮空效果需实机验证。 |
| `ANI hitbox / 辅助对照` | `MineAlram2.ani` FRAME000/001 均有 `[ATTACK BOX] -16 -10 -6 31 20 20`；`MinePressureReady2.ani`、`MinePressureActive2.ani` 未观察到盒字段。`MineExplosion.act` BASE `FireExplosion.ani`，SUB `FireExplosionParticle1/2/3/4.ani`；`FireExplosion.ani` FRAME000 有 `[ATTACK BOX] -65 -40 -50 130 80 100`，FRAME001 无盒，四个粒子 SUB ANI 未观察到盒字段。限定检索中 `[CREATE PASSIVEOBJECT]` 只命中 `sjar_bom_bad.act` 和 `MineActive2.act`；未观察到 `[SUMMON MONSTER]`、对象级 `[homing]` 或 `.atk [active status]`。辅助对照同 8376/8375 registry 路由、创建块、`.atk` payload 和关键 ANI 盒字段同形。 | 辅助差异为 registry 总量/行号、对象脚本长度和 `[name]` 文本样式；这些只作为目标集差异提示，不能覆盖主目标结论。 |

## ActionObject SPC despair_tower/eltis 创建链 / hitbox 边界
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `aicharacter/gunner/eltis/action/casting.act -> 11101` | casting action 在行为块中创建 11101，empty particle、level `0`、pos `0 0 0`；11101 回 `passiveobject/passiveobject.lst` 命中 `ActionObject/SPC/Despair_tower/Eltis/Eltis_dummy.obj`。 | 上游位于 aicharacter 路径，当前只作为 Eltis passiveobject 创建入口记录，不转入 APC 主线；实际施放时序需实机。 |
| `Eltis_dummy.obj / Eltis_dummy.act` | dummy 为 pass all、hp max `15000`、hp destroy `1`、team `100`；`Eltis_dummy.act` 6 个定时触发块创建 11100 machine，地图 pos 为 `290 160 0`、`800 160 0`、`155 333 0`、`944 333 0`、`534 160 0`、`534 333 0`；11100 数量达到条件或 10902 AI character 缺失时切 custom 1。 | 11100 数量检查、3 秒/6 秒计时和 custom action 切换只证明静态结构；运行中是否全部触发、是否受销毁影响需实机。 |
| `Eltis_machine.obj / Eltis_machine.act` | machine 为 do not pass、hp max `50000`、hp destroy `1`、destroy particle `SaintFire_distroy.ptl`；`Eltis_machine.act` 检查 11100 数量后切 custom 1。 | machine 本体不挂对象级 `.atk`；`[=>]` 是反编译观察到的比较 token，运行比较语义不由静态只读展开。 |
| `Eltis_machine_explode.act -> 8498` | explode action FRAME8 在敌方队伍检查后创建 8498，empty particle、level `0`、pos `0 0 100`、`[USE NEUTRAL TEAM]`、`[USE OBJECT ZPOS]`，随后 `[APPEND HIT] 0 0 0` 并 `[DESTROY]`。 | 8498 走 passiveobject registry 命中 `ActionObject/Monster/Lizard_man/Event_Thunder_all.obj`；raw path 含 `Monster` 不改变 registry，也不转 Monster 主线。 |
| `Eltis` ANI / attackinfo 边界 | machine 相关 ANI 有 `[DAMAGE BOX] -25 -11 -5 51 22 94`；dummy 和 SaintFire destroy 粒子 ANI 未观察到盒字段；目录内 `saintdarkexp.atk` 未在主目标 `passiveobject/` 脚本文本中观察到挂接。 | `.atk` 不提供 hitbox 坐标；目录内可读 `.atk` 不等于 owner-linked 攻击信息。 |
| `8498 Event_Thunder_all` | 下游对象挂 `Event_Thunder.atk`，`event_thunder_all8.ani` FRAME006 有两条攻击框 `-29 -10 0 54 20 443` 与 `-73 -42 229 168 84 215`；其他 thunder BASE/SUB ANI 当前未观察到盒字段。 | 爆炸/雷击命中、敌方队伍筛选、append hit 和自毁先后需运行验证；8498 还可被其他 passiveobject action 引用，本桶只记录 Eltis 入边。 |
| `限定标签检索` | `eltis` 23 个源文件内 `[CREATE PASSIVEOBJECT]` 只命中 `eltis_dummy.act` 与 `eltis_machine_explode.act`；未观察到 `[SUMMON MONSTER]`、`[homing]` 或 `[active status]`。 | 无命中只限定本前缀和当前样本搜索；不能外推到其他 despair_tower 或 actionobject/SPC 子桶。 |
| `辅助对照差异` | 辅助对照同 23 文件、11101/11100/8498/10902 registry 路由、action 触发链和关键 ANI 盒字段同形。 | 差异为 dummy/name 字符串样式、machine 缺失字符串表现、registry 总量/行号不同；这些只作目标集差异提示。 |

## ActionObject SPC despair_tower/gravity 地图放置 / 生命周期
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `gravity_d.obj / gravity.obj` | 两个对象均为 width `0 0`、floating height `0`、normal layer、pass all、piercing power `1000`，basic action 都为 `Action/gravity.act`。`gravity_d.obj` 的 etc action 为 `gravity_stay_d.act`、`gravity_stay1_d.act`、`gravity.act`；普通 `gravity.obj` 的 etc action 为 `gravity_stay.act`、`gravity_stay1.act`、`gravity.act`。9288 / 9287 均按 passiveobject registry 解析。 | `_d` 与普通版是两个 passiveobject registry 条目；不能把普通版 appendage 行为覆盖到 `_d` 版。 |
| `gravity.act` | BASE ANI 为 `gravity.ani`；距离检查通过后记录 `timecome1 = GET TIME` 并打开 trigger，`timecome1 + 4000 <= GET TIME` 后切 custom 0，FRAME11 设回 FRAME3。 | 计时、距离检查、checked no 和帧跳转只证明静态结构；实际循环、触发次数和地图内效果需实机。 |
| `gravity_stay_d.act / gravity_stay1_d.act` | 两个 `_d` stay action 均挂 `gravity.ani` 与表现 SUB ANI；FRAME0 记录时间并打开 trigger，分别在 20000 / 10000 后切 custom 1 / custom 2，FRAME11 设回 FRAME3。 | `_d` 版本未观察到普通版的 `[CHECKUP OBJECT]`、`[FLASH SCREEN EX]` 或 `[APPENDAGE]`；静态只读不能解释 `_d` 与普通版实际难度差异。 |
| `gravity_stay.act / gravity_stay1.act` | 普通 stay action 在 FRAME0 对全角色队伍执行行为并 `[CHECKUP OBJECT] 1`；20 秒版本附加 attack/move/cast `-30.0` 与 stuck `-40.0`，10 秒版本四项均为 `-60.0`，并带 flash screen。 | appendage 列形只证明字段存在；减速、卡肉、闪屏时长和叠加表现不由静态只读证明。 |
| `地图 [passive object] 放置` | `towerofdespair_up/15237despair088.map` 的 `[passive object]` 块按 `ID X Y Z` 重复列形放置 10387、9288、9288、9288、9287；10387、9288、9287 均走 passiveobject registry。 | 这是地图静态放置，不是 `[CREATE PASSIVEOBJECT]` 递归创建；地图加载、房间触发和实际生效仍需运行验证。 |
| `限定标签检索` | 7 个 `gravity` 对象/action 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`[active status]` 或 `attack` 字符串命中；同前缀 `attackinfo/` 下未观察到 `gravity` 命名 `.atk`。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `despair_tower` 对象。 |
| `辅助对照差异` | 辅助对照同 12 个 `gravity` 文件、9288/9287 registry、地图放置列、关键 action 和 `gravity_on_eff2.ani` 无盒结论同形。 | 差异为 passiveobject registry 总量/行号不同，地图名称字符串链接样式不同；这些只作目标集差异提示。 |

## ActionObject SPC despair_tower/shouting 创建入口 / AttackRect 生命周期
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `shouting.obj / shouting2.obj` | `shouting.obj` 为 close layer，`shouting2.obj` 为 normal layer；二者均为 floating height `0`、pass all、piercing power `1000`、team `100`，并分别挂 `Action/shouting.act` / `AttackInfo/shouting.atk` 与 `Action/shouting2.act` / `AttackInfo/shouting2.atk`。9290 经 passiveobject registry 命中 `ActionObject/SPC/Despair_tower/shouting.obj`；`shouting2.obj` 物理可读但当前未闭合到主目标 registry 数字入口。 | `shouting2` 不能因物理可读就写成已存在数字入口；后续若要修改必须回主目标单独复核 registry。 |
| `shouting.act / shouting2.act` | `shouting.act` BASE `shouting.ani`，SUB `shouting1.ani` / `shouting2.ani`，FRAME0/2/4/6 执行 `[ATTACKRECT] [RESET]`，FRAME7 `[DESTROY]`；`shouting2.act` BASE `shouting_1.ani`，SUB `shouting1_1.ani` / `shouting2_1.ani`，FRAME3/6 reset，FRAME7 destroy。 | reset/destroy 只证明 action 结构；攻击时序、命中帧、销毁先后和卡肉表现需运行验证。 |
| `shouting.atk / shouting2.atk` | 两个 `.atk` 均为 absolute damage `230`、damage bonus `300`、physic、no element、damage reaction damage、push/lift `50/130`、hit down、blow、no blood `70 0.699999988079071`。`shouting.atk` 同时有 attack friend `1` 与 attack enemy `1`，状态为 stun 三列和 confuse 四列；`shouting2.atk` 未观察到 attack friend，状态为 stun 三列和 curse 七列。 | `.atk` 不提供 hitbox 坐标；状态概率、持续、敌我命中和 curse 列语义不能由静态只读证明。 |
| `shouting*.ani` | BASE `shouting.ani` 与 `shouting_1.ani` 的 FRAME000-006 均有 `[ATTACK BOX]`，FRAME007 未观察到盒字段；4 个 SUB ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | BASE 有盒不代表 SUB 继承；hitbox 结论必须按实际 linked ANI 逐帧记录。 |
| `上游创建入口` | `monster/newmonsters/towerofdespair/cross_axe/action/_casting.act` 在 FRAME3 创建 9290，empty particle、level `70`、pos `0 0 50`；9290 走 passiveobject registry 命中 `shouting.obj`。 | 上游路径只作为创建入口边界记录，不转 Monster 主线；同号技能命中是数字噪声，不能写成创建证据。 |
| `shouting2 registry / upstream follow-up` | 主目标复核未在 `passiveobject/passiveobject.lst` 观察到 `shouting2.obj` raw path；全 PVF 脚本文本未观察到 `ActionObject/SPC/Despair_tower/shouting2.obj` 或 `shouting2.obj` 上游引用；9290 相邻 registry 与 `_casting.act` 均只闭合到 `shouting.obj`。同名 `Action/shouting2.act`、`AttackInfo/shouting2.atk` 和 `../Animation/shouting_1.ani` 字符串还命中其他 owner，本桶结论限定 `despair_tower` owner。 | `shouting2` 仍按物理可读的 owner-linked 静态样本处理，不写成正式 passiveobject ID 或创建入口。 |
| `限定标签检索` | 本 6 个对象/action/atk 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]` 或 `[homing]`；`[active status]` 只出现在 `shouting.atk` 与 `shouting2.atk`。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `despair_tower` 对象。 |
| `辅助对照差异` | 辅助对照同 12 文件、9290 registry 目标、上游创建入口、action/atk/BASE 攻击框与 SUB 无盒形态同形。 | 差异为对象 `[name]` 字符串样式与 registry 总量/行号不同；这些只作目标集差异提示。 |

## ActionObject SPC despair_tower/summon_marcelo 地图放置 / SUMMON APC / 无 hitbox
| 对象 / 链路 | 主目标只读结论 | 边界 |
| --- | --- | --- |
| `summon_marcelo.obj` | 9291 经 passiveobject registry 命中；对象为 floating height `0`、close layer、pass all、piercing power `1000`，basic action 为 `Action/Summon_marcelo.act`，未观察到对象级 `[attack info]`、`.atk`、`[homing]` 或 `[object destroy condition]`。 | 这是地图放置 / APC 召唤管理型样本；无 `.atk` 与无盒字段不证明实机无召唤、无视觉或无队伍效果。 |
| `towerofdespair_up/15231despair082.map` | `[passive object]` 块按 `ID X Y Z` 放置 9291，列为 `9291 576 302 0`；同图 `[ai character]` 块放置 20435。 | 地图静态放置不是 `[CREATE PASSIVEOBJECT]` 递归链；地图加载、坐标落点和 AIC 实际生成需运行验证。 |
| `Summon_marcelo.act` | BASE ANI 为 `../Animation/Summon_marcelo.ani`。trigger 0 默认 ON，检查 player 距离和 20435 AIC 距离后执行行为 0；行为 0 `[SUMMON APC] [INDEX] 20435 [LEVEL] 70 [POS] 0 0 20`，并切 trigger 0 OFF / trigger 1 ON。trigger 1 默认 OFF，检查 20435 AIC 不满足后执行行为 1，把 trigger 0 ON / trigger 1 OFF。 | 触发器开关、距离检查、checked no、APC 召唤、队伍 `0` 和 ZPOS 参数只证明静态结构；实际召唤次数、重召唤时机和 APC 存活需运行验证。 |
| `20435` ID 路由 | 20435 在 `[SUMMON APC] [INDEX]` 与 `[WHICH] [AI CHARACTER] [IS INDEX]` 上下文均按 `aicharacter/aicharacter.lst` 命中 `aicharacter/priest/marcelo/marcelo.aic`。 | 同一数字不能按 passiveobject 或 monster registry 解释；本桶只记录 AIC 路由存在，不转入 APC 主线。 |
| `Summon_marcelo.ani` | 7 帧 `ground-big.img` lineardodge 表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | `.act` 的 `[SUMMON APC]` 行为不提供 hitbox 坐标；APC 自身动作和命中不由该 passiveobject ANI 证明。 |
| `限定标签检索` | 本 3 个对象/action/ANI 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]` 或 `[active status]`；同号/相邻搜索中 `cross_axe` action 创建 9289，不创建 9291。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `despair_tower` 对象或 APC 行为。 |
| `辅助对照差异` | 辅助对照同 3 文件、9291 地图放置、20435 AIC/APC 路由、action 触发器和 ANI 无盒结论同形。 | 差异为对象和地图名称直接文本、registry 总量/行号不同，辅助对照额外技能数值命中只作目标集差异提示。 |

## ActionObject SPC despair_tower/booldRust 创建链 / hitbox 边界
| 对象 / 链路 | 主目标只读结论 | 边界 |
| --- | --- | --- |
| `booldRust.obj` | 9289 经 passiveobject registry 命中，且全 registry 只命中 passiveobject；对象为 floating height `0`、normal layer、pass all、piercing power `1000`、team `100`，basic action 为 `Action/booldRust.act`，etc action 为 `Action/booldRust_EX.act`。 | 对象不挂 `[attack info]` 或 `.atk`；damage/status payload 不能从对象层推断。 |
| `booldRust.act` | BASE `GrabBlastBloodEx/cast1.ani`，SUB `cast2.ani`、`cast_light_dodge.ani`、`drain_blood_normal.ani`；FRAME9 执行行为 0，行为 0 为 `[SET ACTION] [CUSTOM] 0 [NOW]`。 | custom 0 如何映射到 etc action、动作切换时序和是否打断需运行验证；action 行为不替代 ANI hitbox。 |
| `booldRust_EX.act` | BASE `exp_blood_normal.ani`，SUB `exp_blood_dodge.ani`、`exp_blood_around_dodge.ani`、`exp_light_back_dodge.ani`、`exp_light_dodge.ani`、`exp_light_front_dodge.ani`、`exp_light_particle_dodge.ani`；FRAME9 执行行为 0 `[DESTROY]`。 | `[DESTROY]` 只证明静态销毁入口；实际销毁时机、残留表现和客户端资源显示需运行验证。 |
| `linked ANI` | 11 个 linked ANI 均可反编译。只有 `cast1.ani` 的 FRAME000 有 `[ATTACK BOX] -1 -1 810 1 1 2`；`cast1.ani` 其余帧与另外 10 个 linked ANI 未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 高 Z、小尺寸攻击框只证明帧级字段存在；不证明实机命中、伤害、卡肉或状态。 |
| `cross_axe/action/casting.act -> 9289` | FRAME10-16 分别创建 9289，empty particle、level `70`、pos `569 170/208/242/287/317/350/380 50`，固定方向右/左交替，使用 map pos。 | 上游路径只作为创建入口边界；不转入 Monster 主线。地图坐标、创建数量和实机触发顺序需运行验证。 |
| `casting.act FRAME19 行为` | 同一上游 action 在 FRAME19 检查全角色队伍距离，也检查 `[AI CHARACTER] [IS INDEX] 20435` 距离；20435 按 `aicharacter/aicharacter.lst` 命中 `priest/marcelo/marcelo.aic`。检查对象执行行为 8，行为 8 为 `[ACTIVE STATUS] [bleeding] 100 70 50000 9000`。 | 该 `[ACTIVE STATUS]` 在上游 action 行为块，不是 `booldRust.obj` 的 `.atk [active status]`；bleeding 作用目标、概率、持续和触发时序需运行验证。 |
| `限定标签检索` | 本 3 个 `booldRust` 对象/action 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`[attack info]`、`[active status]` 或 `[ACTIVE STATUS]`。`skill/thief/moonarc.skl` 的 9289 位于 `[pvp] [level info]` 数值表。 | 无命中只限定本桶源文件和当前样本搜索；skill 数值表命中不能写成 passiveobject 创建证据。 |
| `辅助对照差异` | 辅助对照同 3 个 `booldRust` 文件、9289 registry 目标、上游 `casting.act` 创建行为、20435 AIC 路由、11 个 linked ANI 文件名/dataLength 和 `cast1.ani` 攻击框同形。 | 差异为 passiveobject/aicharacter registry 总量和行号不同，且辅助对照额外技能数值命中；这些只作目标集差异提示。 |

## ActionObject SPC despair_tower/sogno_hit 地图放置 / PASSIVE 检查 / 无 hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `sogno_hit.obj` | 9940 经 passiveobject registry 命中，且主目标全 registry 只命中 passiveobject；对象为 floating height `0`、normal layer、pass all、piercing power `1000`，basic action 为 `action/sogno_hit.act`。 | 对象不挂 `[attack info]` 或 `.atk`；不能从对象层推断伤害、命中或状态 payload。 |
| `sogno_hit.act` | BASE `../Animation/sogno_hit.ani`；FRAME4 先检查 `[PASSIVE] [IS INDEX] 23052` 距离 `<= 6000` 且 checked no `< 1`，再检查 `[AI CHARACTER] [IS INDEX] 15414` 距离 `<= 6000` 且 checked no `>= 1`，对 `[CHECKUP OBJECT] 0` 执行行为 0。行为 0 为 `[SET ACTION] [STAND] [NOW]`。 | 静态只读只能证明检查和行为结构；`CHECKUP OBJECT 0` 实际选择对象、动作切换对象、距离判定和触发时机需运行验证。 |
| `23052 PASSIVE 路由` | 23052 位于 `[WHICH] [PASSIVE] [CHECKUP] [IS INDEX]` 上下文，主目标回 `passiveobject/passiveobject.lst` 命中 `Character/Mage/MegaDrillReady.obj`。 | 这里是检查上下文，不是创建链；当前不展开 23052 owner，只登记 registry 路由和风险边界。 |
| `15414 AI route / map` | 15414 位于 `[WHICH] [AI CHARACTER] [CHECKUP] [IS INDEX]` 上下文，主目标回 `aicharacter/aicharacter.lst` 命中 `magician/sogno/sogno.aic`；同一 map 的 `[ai character]` 块放置 15414。 | 该路由不按 passiveobject 或 monster 解释；AIC 行为、AI 目标选择和战斗实际状态不由当前 PassiveObject 静态桶证明。 |
| `sogno_hit.ani` | 5 帧均为透明 totem 图像表现，未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 无盒字段只证明该 ANI 不提供 hitbox 坐标；透明表现、客户端资源显示和 action 行为效果仍需实机验证。 |
| `15178despair049.map placement` | `[passive object]` 块按 `ID X Y Z` 列形放置 `9940 600 319 0`；同图 `[ai character]` 块放置 `15414 674 287 0 [monster] [boss] 2 0`。 | 该入口是地图静态放置，不是 `[CREATE PASSIVEOBJECT]` 递归链；map 进入、出生顺序和实际对象存活需运行验证。 |
| `限定标签检索` | 主目标 12 个 Sogno 相关源文件内未观察到 `[CREATE PASSIVEOBJECT]`；本 3 个 PassiveObject 源文件未观察到 `[SUMMON MONSTER]`、`[homing]`、`[attack info]`、`[active status]` 或 `[ACTIVE STATUS]`。 | 无命中只限定本桶源文件和当前样本搜索；主目标 9940/15414 的其他全局数字命中不能脱离上下文写成创建证据。 |
| `辅助对照差异` | 辅助对照核心 12 文件、map 放置、9940/23052 路由、action 检查和 ANI 无盒结论同形。 | 差异为 registry 总量/行号、23052 文件摘要长度、15414 多 registry 碰撞，以及 9940/15414 更多全局数字命中；这些只作目标集差异提示，不能覆盖主目标结论。 |

## ActionObject SPC despair_tower/apc_niddle 攻击框 / AttackInfo / 创建入口
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `apc_niddle.obj` | 9236 经 passiveobject registry 命中，且主目标全 registry 只命中 passiveobject；对象为 normal layer、pass all、piercing power `1000`，basic action `Action/APC_niddle.act`，attack info `attackinfo/APC_pinAttack.atk`，object destroy condition 为 `[time limite] 10000`。 | 9236 当前未闭合到主目标创建入口；技能/字典/replay 数字命中不能写成创建证据。 |
| `apc_niddle2.obj` | 9237 经 passiveobject registry 命中，且主目标全 registry 只命中 passiveobject；basic action 与 etc action 均为 `Action/APC_niddle2_1.act`，attack info 为 `attackinfo/APC_pinAttack1.atk`，object destroy condition 为 `[time limite] 10000`。 | etc action 指回同一 action 只证明静态配置；实际动作切换和重复触发需运行验证。 |
| `apc_niddle.act` | BASE `APC_ATHiddenStingAttack.ani`；`[ON ATTACKSUCCESS]` 后对自身执行行为 0，行为 0 为 `[DESTROY]`。 | 攻击成功触发、自毁时机和是否完成状态附加需实机验证。 |
| `apc_niddle2_1.act` | BASE `niddle2.ani`；`[ON ATTACKSUCCESS]` 后自毁；FRAME0 执行行为 1 `[SET SPEED] [X AXIS] 500 [USE MY DIRECTION]`。 | 静态只读不证明实际飞行距离、速度单位、方向锁定或碰撞时机。 |
| `APC_pinAttack.atk` / `APC_pinAttack1.atk` | 两个 `.atk` 均为 damage bonus `0`、physic、weapon damage apply `1`、no element、damage、push aside `100`、lift up `200`、hit wav `HS_HIT`、hit down、cut；`APC_pinAttack.atk` 额外有 `[active status] [curse] 100 70 20000 0 0 0 250`，`APC_pinAttack1.atk` 未观察到 `[active status]`。 | `.atk` 是攻击 payload 与状态字段，不提供 hitbox 坐标；curse 七列含义和实际附加概率/持续需实机或更强证据。 |
| `APC_ATHiddenStingAttack.ani` / `niddle2.ani` | 前者 4 帧均有 `[ATTACK BOX] -27 -8 -8 47 16 19`；后者 6 帧均有 `[ATTACK BOX] -33 -10 -4 67 20 10`；两者未观察到 `[DAMAGE BOX]`。 | hitbox 坐标来自 ANI 帧级字段；动画图像、缩放和延迟不等于实机命中保证。 |
| `aicharacter/atfighter/roychan/action/niddle_pin.act -> 9237` | FRAME4 创建 9237，particle `../key/shot.ptl`、level `70`、pos `80 0 55`。 | 上游是 AIC action 边界，当前只登记 PassiveObject 创建入口，不展开 APC 主线。 |
| `9236 上游入口复核` | 主目标全 PVF 数字检索只观察到 9236 命中 itemdictionary、两份 gunner replay、`passiveobject/passiveobject.lst`、`skill/mage/void.skl` 与 `skill/mage/voidex.skl`；两份 skill 命中均位于 `[level info]` 或 `[pvp] [level info]` 数值表，未观察到 `[CREATE PASSIVEOBJECT]`、action/key 或 map 放置入口。 | 9236 仍是 registry 可解析、对象/action/atk/ANI 可闭合但上游入口未闭合的风险样本；不能写成已找到创建入口，也不能仅凭未命中写成运行绝不出现。 |
| `限定标签检索` | 本 6 个对象/action/atk 源文件未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]` 或 `[homing]`；限定候选文件检索中，主目标技能数字命中未观察到 `[CREATE PASSIVEOBJECT]`。 | 无命中只限定本桶和当前候选；后续若要找 9236 创建入口需继续扩大上游检索。 |
| `辅助对照差异` | 辅助对照核心文件、9236/9237 passiveobject 路由、action/atk/ANI 盒字段同形；辅助 9236 额外观察到 quest/dungeon/skill 等数字噪声，但未观察到 action/key 创建入口；辅助 9237 额外观察到 `yitaapc/.../niddle_pin.act` 创建入口。 | 差异为 registry 总量/行号、9236/9237 额外 quest registry 碰撞、9237 额外 AIC 创建入口，以及更多全局数字命中；这些只作目标集差异提示，不能覆盖主目标。 |

## ActionObject SPC despair_tower/reflect_ball 创建链 / pull appendage / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `aicharacter/swordman/ruho/key/attack2.key -> 9216` | key 内 `[CREATE PASSIVEOBJECT] [INDEX] 9216` 创建 `ActionObject/SPC/Despair_tower/reflect_ball.obj`，particle `key/shout.ptl`、level `70`、pos `110 0 100`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`。 | 上游是 AIC key 边界，当前只登记 PassiveObject 创建入口；`destinationselect.ai` 只检测范围内 passive object 9216，不是创建入口。 |
| `reflect_ball.obj` | 9216 经 passiveobject registry 命中；对象为 floating height `0`、normal layer、pass all、piercing power `1000`，basic action `action/reflect_ball.act`，etc action 为 `reflect_ball_stay.act` / `reflect_ball_destroy.act`，attack info `AttackInfo/reflect_ball.atk`。 | 9216 在主目标技能等级表中也有数字命中，但不处于创建块；数字碰撞不能写成创建证据。 |
| `reflect_ball.act` | BASE `eg-ball_start.ani`，FRAME1-6 多次执行行为 1 `[ATTACKRECT] [RESET]`；默认检查全角色队伍、时间 `400` 后对 `[CHECKUP OBJECT] 2` 执行行为 2 `[PULL APPENDAGE] 6.5 6.5 500`；FRAME7 切 custom 0。 | `PULL APPENDAGE` 的目标选择、拉拽公式和时间单位不由静态只读证明。 |
| `reflect_ball_stay.act` | BASE `eg-ball_stay.ani`，SUB `eg-ball-normal.ani`；FRAME0 的 `[CHECKUP OBJECT] 2` 指向行为 2 `[PULL APPENDAGE] 6.5 6.5 4500`，其余多帧执行 `[ATTACKRECT] [RESET]`，FRAME39 切 custom 1。 | 多帧 reset 只证明静态触发结构；实际攻击刷新、命中频率和拉拽效果需实机验证。 |
| `reflect_ball_destroy.act -> 9217` | BASE `eg-ball-end.ani`，SUB `eg-ball-end-normal.ani`；FRAME2 创建 9217，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`，FRAME4 `[DESTROY]`。 | 9217 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，走 passiveobject registry；销毁时序和下游生成成功仍需运行验证。 |
| `eg_bomb.obj / eg_bomb.act` | 9217 经 passiveobject registry 命中 `eg_bomb.obj`；对象挂 `action/eg_bomb.act` 与 `AttackInfo/eg_bomb.atk`。`eg_bomb.act` BASE `eg_Bomb2.ani`，SUB `eg-end.ani`，FRAME11 `[DESTROY]`，未继续创建下游。 | 本桶静态递归在 9217 处闭合；不代表其他 `eg_bomb` 同名文件或相邻目录同形。 |
| `reflect_ball.atk / eg_bomb.atk` | `reflect_ball.atk` 为 absolute damage `1200`、physic、no element、damage/cut、push/lift `0`；`eg_bomb.atk` 为 absolute damage `40000`、physic、fire element、down/blow、push aside `500`、lift up `450`。两者未观察到 `[active status]` 或 `[pvp]`。 | `.atk` 不提供 hitbox 坐标；伤害、击飞、元素和 PVP 结算效果仍需运行链或实机验证。 |
| `linked ANI` | `eg-ball_start.ani` 8 帧均有攻击框；`eg-ball_stay.ani` 40 帧均有同形攻击框；`eg_bomb2.ani` 的 FRAME003-006 有攻击框。`eg-ball-normal.ani`、`eg-ball-end.ani`、`eg-ball-end-normal.ani`、`eg-end.ani` 未观察到攻击框或伤害框；本桶 linked ANI 均未观察到 `[DAMAGE BOX]`。 | 同一链路内 BASE、SUB、destroy、normal 表现 ANI 必须逐个读帧，不能从 action 或 `.atk` 推断是否有盒。 |
| `限定标签检索` | 本桶对象/action 源文件未观察到 `[SUMMON MONSTER]`、`[SUMMON APC]`、`[homing]`；`eg_bomb.act` 未观察到 `[CREATE PASSIVEOBJECT]`；两份 `.atk` 未观察到 `[active status]` 或 `[pvp]`。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `despair_tower` 对象。 |
| `辅助对照差异` | 辅助对照核心文件、9216/9217 passiveobject 路由、创建入口、action/atk/ANI 盒字段同形。 | 差异为辅助对照 9216 还碰撞 stackable registry，9216/9217 全局数字命中更多，passiveobject registry 总量/行号不同；这些只能作目标集差异提示。 |

## ActionObject SPC despair_tower/attack_shield / pass_shield 创建链 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `aicharacter/priest/yeomyung/key/attack38.key -> 9218` | key 内 5 次创建 `ActionObject/SPC/Despair_tower/pass_shield.obj`，particle `key/shout.ptl`、level `70`，pos 为 `130 0 60`、`90 30 40`、`90 -30 70`、`50 50 40`、`50 -50 70`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`。 | 上游是 AIC key 边界，当前只登记 PassiveObject 创建入口；不转入 APC/AI 主线。 |
| `aicharacter/priest/yeomyung/key/attack38_1.key -> 9218` | key 内 3 次创建同一 9218，empty particle、level `70`，pos 为 `-70 0 40`、`-95 45 40`、`-70 -45 40`，并带 `[USE MY DIRECTION]`。 | 与 `attack38.key` 是同一 passiveobject 的不同上游入口；运行触发顺序需实机或 AIC 流程验证。 |
| `aicharacter/priest/yeomyung/key/attack106.key -> 9222` | key 内 1 次创建 `ActionObject/SPC/Despair_tower/Attack_shield.obj`，empty particle、level `70`、pos `130 0 70`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`。 | 9222 走 passiveobject registry；key 入口不证明攻击成功后一定生成 9219。 |
| `attack_shield.obj` | 9222 经 passiveobject registry 命中；对象为 floating height `0`、normal layer、pass all、piercing power `1000`，basic action `Action/Attack_shield.act`，attack info `AttackInfo/Attack.atk`。 | 技能、道具或回放中的同号数字命中不能写成创建证据。 |
| `attack_shield.act -> 9219` | BASE `Attack_shield.ani`，攻击成功上下文创建 9219，empty particle、level `70`、pos `0 0 0`、`[USE OBJECT ZPOS]`；FRAME10 执行 `[DESTROY]`。 | 攻击成功触发、last active attacksuccess 选择和创建成功时机不由静态只读证明。 |
| `pass_shield.obj` | 9218 经 passiveobject registry 命中；对象为 floating height `0`、normal layer、pass all、piercing power `1000`，basic action `Action/pass_shield.act`，attack info `AttackInfo/hit.atk`，并有 `[hp destroy] 1`。 | `hp destroy` 与 destroyobject 声音只证明对象配置；生命、受击和销毁运行表现需实机验证。 |
| `pass_shield.act -> 9219` | BASE `pass_shield.ani`、SUB `pass_shield1.ani`；FRAME0 反向并关闭 trigger，FRAME8 创建 9219，empty particle、level `70`、pos `-10 1 0`、`[USE OBJECT ZPOS]`，随后 `[DESTROY]`。 | trigger 切换、反向和创建/自毁帧序只能静态定位，不能证明运行时一定按预期触发。 |
| `attack_shield_eff.obj / attack_shield_eff.act` | 9219 经 passiveobject registry 命中 `Attack_shield_eff.obj`；对象无 attackinfo，`attack_shield_eff.act` BASE `attack_shield_eff.ani`，FRAME5 自毁，未继续创建 passiveobject。 | 9219 是本桶 attack/pass shield 的下游 effect，同时还有 defence/trap 相邻外部入边，当前不把 defence/trap owner 算作已展开。 |
| `Attack.atk / hit.atk` | `Attack.atk` 为 absolute damage `25000`、physic、no element、damage、push/lift `900/300`、blow；`hit.atk` 为 absolute damage `8000`、physic、no element、damage、knuck back `-1`、blow。两者未观察到 `[active status]` 或 `[pvp]`。 | `.atk` 不提供 hitbox 坐标；伤害、击退、倒地和 PVP 结算效果仍需运行链或实机验证。 |
| `linked ANI` | `attack_shield.ani` FRAME004-007 有攻击框；`pass_shield.ani` FRAME003-007 有攻击框；`attack_shield_eff.ani` 与 `pass_shield1.ani` 未观察到攻击框或伤害框；本桶 linked ANI 均未观察到 `[DAMAGE BOX]`。 | hitbox 坐标必须来自 ANI 帧级字段，不能从 `.atk`、文件名或 effect/SUB 图层推断。 |
| `限定标签检索` | 本桶对象/action 源文件未观察到 `[SUMMON MONSTER]`、`[SUMMON APC]`、`[homing]`；两份 `.atk` 未观察到 `[active status]` 或 `[pvp]`。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `despair_tower` shield 对象。 |
| `相邻 9219 入边` | 主目标 `defence_shield.act` 与 `trap_defence_shield_stay.act` 也观察到创建 9219，位置列含 `[RANDOM]` X/Y 与 `[USE OBJECT ZPOS]`，部分行为同块 shaking 或自毁。 | 这是 9219 下游对象的相邻外部入边提示；`center_shield`、`star_shield`、`defence_shield` 和 trap 链路应作为下一桶单独闭合。 |
| `辅助对照差异` | 辅助对照核心文件、9218/9219/9222 registry raw path、上游创建、action/atk/ANI 盒字段同形。 | 差异为对象 name 字符串样式、文件长度、registry 总量/行号，以及更多技能/回放数字命中；这些只能作目标集差异提示。 |

## ActionObject SPC despair_tower/star / defence / trap defence shield 生命周期 / damage box
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `attack70.key -> 9221 -> defence_shield_bottom.obj` | `attack70.key` 创建 9221，empty particle、level `70`、pos `0 0 0`，并带 `[USE MY DIRECTION]`、`[FIX DIRECTION]`、`[NEUTRAL]`、`[NOT USE OBJECT DIRECTION]`。9221 经 passiveobject registry 命中 `defence_shield_bottom.obj`。 | 上游是 AIC key 边界；`action_main.ai` 用 9220 数量检查选择 attack70，但实际 AI 决策需运行验证。 |
| `defence_shield_bottom.obj / defence_shield_bottom.act` | bottom 对象为 bottom layer、pass all、team `100`、`[vanish on move collision] 0`；action FRAME0 传送到自身 basepos，FRAME4 创建 9220，FRAME6 对角色距离 `<= 115` 的检查对象执行 `[MUCU LIMIT CONTROL] 7000`，FRAME12 自毁。 | `MUCU LIMIT CONTROL` 的实际控制效果、目标选择和时间单位不由静态只读证明。 |
| `9220 defence_shield.obj / defence_shield.act` | 9220 为 normal layer、`[do not pass]`、team `100`、hp max `90000`、hp destroy `1`、hp gage `1`。action ON DAMAGE 创建 9219 并 shaking；FRAME11 检查附近 9221 后对 checkup object 执行销毁，并对自身多次执行创建 9219。 | 这是防御实体和受击触发链，不是攻击输出链；是否被打、是否销毁、shaking 表现需实机验证。 |
| `attack70_1.key -> 9265 -> star_shield.obj` | `attack70_1.key` 创建 9265，particle `key/shout.ptl`、level `70`、pos `0 0 0`，并带 `[USE MY BASEPOS]`、`[FIX DIRECTION]`、`[NEUTRAL]`。9265 经 passiveobject registry 命中 `Star_shield.obj`。 | 这是 trap defence 链上游，不代表 9264/9263 已经存在；实际 key 触发需 AIC 运行验证。 |
| `star_shield.act -> 9264 / 9266` | FRAME5 按地图坐标创建 9264 三处：`690 168 0`、`426 295 0`、`954 295 0`；FRAME7 创建 9266，map pos `690 250 0`；FRAME8 自毁。 | 9264 是 trap bottom，9266 是 center 管理对象；地图坐标创建成功和空间关系需运行画面验证。 |
| `9264 m_defence_shield_bottom.obj / trap_defence_shield_bottom.act` | 9264 为 bottom layer、pass all、team `100`、`[vanish on move collision] 0`，basic/ etc action 为 `trap_defence_shield_bottom*.act`。bottom action FRAME4 创建 9263，FRAME12 切 custom 0；stay action 在 20429 缺失或附近 9263 缺失时自毁。 | 9264 是生成 trap 防御实体的底层对象；自身 linked losttail/lostmagic ANI 未观察到盒字段。 |
| `9263 m_defence_shield.obj / trap_defence_shield_stay.act` | 9263 为 normal layer、`[do not pass]`、team `100`，basic action `trap_defence_shield.act`，etc action `trap_defence_shield_stay.act`。stay action ON SET ACTION 初始化 `Dcount`，ON DAMAGE 增计数并创建 9219，`Dcount >= 10` 时创建 9219 后自毁；20429 AIC 缺失也会自毁。 | `Dcount` 计数、受击次数、销毁时机和 9219 生成频率是运行风险，静态只读只能证明结构。 |
| `center_shield / shield_count 管理边界` | 9266 `center_shield.act` 对 20429 checkup object 添加防御、回血、元素抗性、stuck、hit recovery、魔防等 appendage；`center_shield_stay.act` 检查 9264 与 20429 后创建 9267、删除 appendage 并自毁。9267 `shield_count.act` 检查 20429 HP `>= 80%` 与 9265 存在性后自毁。 | 当前只作为同链管理边界；appendage、计数和 HP 条件运行效果不能由静态只读证明。 |
| `linked ANI` | `defence_shieldme.ani` FRAME004-011 有 damage box；`Trap_Defence1_shield.ani` FRAME004-011 有 damage box；`Trap_Defence1_shield_stay.ani` FRAME000-002 有 damage box。`defence_shield_tailme.ani`、`trap_defence_shield_losttail/lostmagic*.ani`、`shield_diamond*.ani`、`star_shield.ani`、`conter_shield*.ani`、`shield_count.ani` 未观察到攻击框或伤害框。 | 本桶 linked ANI 未观察到 `[ATTACK BOX]`，所以不能写成攻击输出；damage box 只证明受击/碰撞盒存在。 |
| `未挂接 shield 侧车 ANI` | 主目标 `defence_shield_eff.ani` 与 `defence_shield_magic2.ani` 物理存在且可反编译，但全 PVF 脚本文本未观察到文件名或不带扩展名 token 引用；两者均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。辅助对照同路径、dataLength、无引用和无盒结论同形。 | 只能作为同目录可读侧车边界；静态只读不能证明运行会播放，也不能把它们并入 owner-linked hitbox 链。 |
| `限定标签检索` | 本桶 17 个对象/action 源文件内 `[CREATE PASSIVEOBJECT]` 只命中 6 个 action；未观察到 `[SUMMON MONSTER]`、`[SUMMON APC]`、`[homing]`、`[attack info]`、`[active status]` 或 `[pvp]`。 | 无命中只限定本桶源文件和当前样本搜索；不外推到其他 shield 或其他目录同名对象。 |
| `辅助对照差异` | 辅助对照同 43 个 shield 命名文件、9220/9221/9263/9264/9265/9266/9267 与 20429 registry raw path、核心 action/key/ANI 盒字段同形。 | 差异为 registry 总量/行号、对象脚本长度和 name 字符串样式；辅助对照只能作目标集差异提示。 |

## ActionObject Monster New_Event Boss_Command 地图放置 / passive 检查 / 无 hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `Boss_Command.obj` | 16167 经 passiveobject registry 命中；对象为 bottom layer、pass all、piercing power `1000`，basic action `Boss_Command.act`，4 条 etc action，未观察到 `[attack info]`、`[homing]`、team、width 或对象级销毁块。 | 对象字段只证明静态配置；地图出生、站位、阻挡和可见表现需运行验证。 |
| `Boss_Command.act` | BASE `Boss_Command_test.ani`；FRAME1 检查自身 custom 0/1 关闭后切 custom 2，FRAME2 按 monster 61644 / 61645 的 attack 3 触发状态切 custom 0/1。 | 61644/61645 走 monster registry；检查对象是否存在、attack 3 是否打开、custom 切换时序不能由静态只读证明。 |
| `Boss_Command_Attack.act` | BASE `Boss_Command_test.ani`；FRAME1 检查 61644/61645 后对 checkup object 执行 `[SET DAMAGE BOX] [ON]` 并切 attack 4，FRAME2 检查 61649/61653 后切 attack 2，后续打开 custom 0/1 trigger 并切 custom 3。 | `[SET DAMAGE BOX] [ON]` 是 action 行为字段，不是 ANI `[DAMAGE BOX]` 坐标；行为效果和目标选择需实机验证。 |
| `Boss_Command_Change.act` / `Boss_Command_Change1.act` | 两者分别挂 `Boss_Command_test2.ani` / `Boss_Command_test3.ani`；FRAME2 分别检查 61645 / 61644 后切 attack 3，后续关闭 custom trigger 并切 custom 3。 | trigger 关闭、attack/custom action 的运行状态机只能静态定位，不能证明实际执行顺序。 |
| `linked ANI / sidecar ANI` | `Boss_Command_test.ani`、`Boss_Command_test2.ani`、`Boss_Command_test3.ani` 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；同前缀 `Boss_Command.ani` 物理可读且有 `[DAMAGE TYPE] UNBREAKABLE`，但未观察到脚本引用和盒字段。 | hitbox 坐标只能来自 linked ANI 的帧级盒字段；`[DAMAGE TYPE]` 不等于 damage box，未挂接侧车不能写成 owner-linked hitbox。 |
| `地图与入边` | `new_eventmap2` 与 `twin_raid_boss` 地图 `[passive object]` 块静态放置 16167；`dual_face` / `dual_face2` change_start action 检查 `[PASSIVE] [IS INDEX] 16167` 并切 custom / action。 | 地图放置不是 `[CREATE PASSIVEOBJECT]`；passive 检查不是创建入口。地图加载、对象是否存活、检查命中和动作互锁都需运行验证。 |
| `相邻 16191 EMP 创建` | 相关 source action 中另观察到 `[CREATE PASSIVEOBJECT] [INDEX] 16191`，16191 回 passiveobject registry 命中 `ActionObject/Monster/New_Event/EMP.obj`。 | 16191 是相邻创建边，不是 16167 的下游；EMP 生命周期和 hitbox 已在独立 EMP 主题段展开。 |
| `限定标签检索` | 本桶核心 Boss_Command obj/action 源文件内未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`.atk [active status]` 或 `.atk [pvp]`。 | 无命中只限定本桶源文件和当前样本搜索；不能外推到其他 `new_event` 对象。 |
| `辅助对照差异` | 辅助对照同 16167 registry、9 个核心文件、action/ANI 核心列形和无盒观察同形。 | 差异为对象 name 直接文本、registry 总量/行号、全局数字噪声更多，且辅助对照当前只观察到 `new_eventmap2` 放置和 `dual_face` 四个 passive 检查入口，未观察到主目标 `twin_raid_boss` 放置和 `dual_face2` 两个 passive 检查入口。辅助差异不能覆盖主目标。 |

## ActionObject Monster New_Event Zx-69_Dorp 创建链 / 召唤出口 / 无 hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16161 / 16181 registry` | 16161 走 passiveobject registry 命中 `Zx-69_Dorp.obj`，16181 命中 `Zx-69_Dorp1.obj`；16161 同号还碰撞 equipment registry。 | 当前对象和创建块上下文只按 passiveobject registry 解释；同号装备和数值表命中不能写成 PO 链路证据。 |
| `Zx-69_Dorp.obj / Zx-69_Dorp1.obj` | 两个对象均为 floating height `1`、normal layer、pass all、piercing power `50000`、basic action `Zx-69_Dorp.act`、`vanish on move collision 0`；`Dorp` 的 etc action 指向 `last`，`Dorp1` 指向 `last1`。 | 对象字段只证明静态配置；落点、穿透、移动碰撞消失和可见表现需运行验证。 |
| `Zx-69_Dorp.act` | BASE `Zx-69-Body_Stay.ani`，SUB `G_main_s_1/2/3.ani`；自身 ZPOS `<= 10` 后切 custom 0。 | ZPOS 条件、checked no 计数、custom 切换时序和落地判定不能由静态只读证明。 |
| `Zx-69_Dorp_last.act / last1.act` | 两个 action 均在 FRAME28 触发两个行为：先 `[SUMMON MONSTER]`，后 `[DESTROY]`；61650 / 61656 走 `monster/monster.lst`，均命中 `Zx-18 机器人` 相关条目。 | `[SUMMON MONSTER]` 是召唤出口，不是 passiveobject 下游；召唤成功、生成位置、碰撞组、无特效和自毁先后需实机验证。 |
| `上游创建入口` | `p1_zx_69_summon.act` 三次创建 16161，`p2_zx_69_summon.act` 三次创建 16181；主目标 `dual_face2` 的 `zx_69_summon_l/r.act` 各三次创建 16161 并设置左右方向。 | 上游 source action 只作为 PassiveObject 创建入口记录，不展开 Monster 主线；随机 POS 和 warning mark 的运行表现需实机验证。 |
| `linked ANI / hitbox` | `Zx-69-Body_Stay.ani`、`G_main_s_1.ani`、`G_main_s_2.ani`、`G_main_s_3.ani`、`Zx-69-Body_Open.ani`、`G_Last_s.ani`、`Zx-69_Open.ani` 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 静态无盒只证明当前样本反编译帧未见盒字段；不能证明实机无碰撞、无召唤伤害或无资源表现。 |
| `限定标签检索` | 本桶核心 obj/action 源文件未观察到 `[CREATE PASSIVEOBJECT]` 下游、`[homing]`、`[attack info]`、`[active status]`、`[pvp]` 或 `[ATTACKRECT]`。 | 无命中只限定本桶源文件和当前样本搜索；不外推到其他 `new_event` 对象。 |
| `辅助对照差异` | 辅助对照同 8 个核心文件、16161/16181 路由、61650/61656 summon 路由、obj/action/ANI 无盒观察同形。 | 差异为 registry 总量/行号、辅助只观察到 `dual_face` p1/p2 创建入口、未观察到主目标 `dual_face2` 左右 16161 入边，并有更多 item/skill 数字噪声；这些只能作目标集差异提示。 |

## ActionObject Monster New_Event ExpAir AttackInfo / 自毁 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16156 registry` | 16156 走 passiveobject registry 命中 `ExpAir.obj`；同号还碰撞 equipment registry。 | 当前对象上下文只按 passiveobject registry 解释；同号装备、事件、技能数值命中不能写成 PO 创建证据。 |
| `ExpAir.obj` | 对象为 name string-link、floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/ExpAir.act` 与 `AttackInfo/TempesterMissileExp.atk`。 | 对象字段只证明静态配置；穿透、可见表现和实际攻击归属需运行验证。 |
| `ExpAir.act` | BASE `ExpAirDodge.ani`，SUB `ExpAirNormal.ani 0 0`；FRAME7 触发自身 `[DESTROY]`。 | FRAME7 自毁时序、动画播放完成度、命中刷新和销毁先后不能由静态只读证明。 |
| `TempesterMissileExp.atk` | `.atk` 为 damage bonus `0`、weapon damage apply `1`、magic、attack enemy `1`、no element、down、push/lift `100/200`、blow、no blood `20 1.0`；未观察到 `[active status]` 或 `[pvp]`。 | `.atk` 不提供 hitbox 坐标；状态/PVP 无命中只限定本桶物理 `.atk`。 |
| `linked ANI` | `ExpAirDodge.ani` FRAME000-004 每帧 3 条攻击框，FRAME005-007 无盒；`ExpAirNormal.ani` 8 帧无攻击框或伤害框。 | BASE/SUB hitbox 必须分开读；SUB 无盒不覆盖 BASE 正样本。 |
| `限定标签检索` | 本桶 obj/action/atk 未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`[active status]`、`[pvp]` 或 `[ATTACKRECT]`。 | 无命中只限定本桶源文件和当前样本搜索；不外推到 common/gunner 同名文件或其他 `new_event` 对象。 |
| `同名物理文件边界` | 同名 `ExpAir.act` 在 common 前缀另有物理文件；同名 `TempesterMissileExp.atk` 在 common、new_event、character/gunner 三个物理位置存在。 | 相同字符串不等于同一物理文件；必须按 owner 目录解析相对路径。 |
| `辅助对照差异` | 辅助对照同 24 个 exp 命名文件、16156 registry、action/atk/ANI 盒字段同形。 | 差异为辅助 name 直接文本、registry 总量/行号、对象 dataLength、数字噪声集合不同，并额外有 `iteminfo.dat` 命中；这些只作目标集差异提示。 |

## ActionObject Monster New_Event G_main / G_main_s / G_main1 monster-check 自毁 / 无 hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16158 / 16159 / 16160 registry` | 16158、16159、16160 走 passiveobject registry 分别命中 `G_main.obj`、`G_main_s.obj`、`G_main1.obj`；三者同号还碰撞 equipment registry。 | 当前对象上下文只按 passiveobject registry 解释；同号装备、事件、技能数值命中不能写成 PO 创建证据。 |
| `G_main.obj / G_main_s.obj / G_main1.obj` | 三个对象均为 width `0 0`、floating height `1`、pass all、piercing power `50000`、hp max `1`、hp destroy `1`；basic action 分别为 `G_main.act`、`G_main_s.act`、`G_main1.act`，last action 分别为 `G_Last.act`、`G_Last_s.act`、`G_Last.act`。 | 对象字段只证明静态配置；实际出现、穿透、生命销毁和可见表现需运行验证。 |
| `G_main.act / G_main1.act` | 二者均挂 BASE `G_main_0.ani` 与 SUB `G_main_1/2/3.ani`；分别检查 monster 61644 / 61645，checked no `< 1` 后对自身 `[DESTROY]`。 | 61644/61645 走 `monster/monster.lst`；monster 是否存在、检查计数和自毁时序不能由静态只读证明。 |
| `G_main_s.act` | 挂 BASE `G_main_s_0.ani` 与 SUB `G_main_s_1/2/3.ani`；FRAME4 检查 monster 64007/64010/64013，checked no `<= 0` 后对自身 `[DESTROY]`。 | 64007/64010/64013 走 `monster/monster.lst`；这些检查不构成 Monster 主线展开，也不是 passiveobject ID。 |
| `linked ANI / hitbox` | `G_main_0/1/2/3.ani`、`G_main_s_0/1/2/3.ani`、`G_Last.ani`、`G_Last_s.ani` 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。 | 静态无盒只证明当前样本反编译帧未见盒字段；不能证明实机无碰撞、无碰撞体或无资源表现。 |
| `限定标签检索` | 本桶核心 obj/action 源文件未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[attack info]`、`[homing]`、`[active status]`、`[pvp]` 或 `[ATTACKRECT]`。 | 无命中只限定本桶源文件和当前样本搜索；不外推到其他 `new_event` 对象或同名目录。 |
| `同名与侧车边界` | 主目标另有 `timegate/TimeLord/G_main.obj` / `G_main_s.obj`，分别是 15056/15057 的独立 passiveobject 入口；本桶相邻 `G_main_4.ani` / `G_main_s_4.ani` 可读且无盒，但未观察到 action 挂接。 | 相同文件名不等于同一物理链；未挂接 ANI 只能作为侧车风险，不写成 owner-linked hitbox。 |
| `辅助对照差异` | 辅助对照同 16 个本桶核心文件、16158/16159/16160 registry、obj/action/ANI 无盒观察同形。 | 差异为 registry 总量/行号、64007/64010 显示名称、数字噪声集合不同，且辅助有更多同名 `g_main` 物理文件；这些只作目标集差异提示。 |

## ActionObject Monster New_Event Stingerex 创建入口 / on-end 销毁 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16162 registry` | 16162 走 passiveobject registry 命中 `Stingerex.obj`；同号还碰撞 equipment registry。 | 当前对象上下文和创建块只按 passiveobject registry 解释；同号装备、字典命中不能写成 PO 创建证据。 |
| `Stingerex.obj` | 对象为 name string-link、floating height `1`、normal layer、pass all、piercing power `1000`、team `0`，挂 `Action/stingerex.act` 与 `AttackInfo/Stinger.atk`，对象级销毁条件为 `[on end of animation]`。 | 对象字段只证明静态配置；动画结束销毁时机、穿透、队伍归属和可见表现需运行验证。 |
| `stingerex.act` | BASE `Stinger/ExpDodge.ani`，SUB `ExpFloorNormal.ani 0 1` 与 `ExpFloorDodge.ani 0 2`，播放 `BOMB_02`；action 内未观察到 trigger 或 behavior。 | action 无自毁行为不代表对象不会销毁；本桶销毁来自对象级 on-end condition。 |
| `Stinger.atk` | `.atk` 为 damage `1000`、physic、weapon damage apply `1`、attack enemy `1`、no element、down、push/lift `100/300`、hit wav `STAFF_HIT`、hit down、blow、no blood `200 1.0`；未观察到 `[active status]` 或 `[pvp]`。 | `.atk` 不提供 hitbox 坐标；状态/PVP 无命中只限定本桶物理 `.atk`。 |
| `linked ANI` | `ExpDodge.ani` FRAME000-006 有攻击框，FRAME007-013 无盒；`ExpFloorNormal.ani` 与 `ExpFloorDodge.ani` 均无攻击框或伤害框。 | BASE/SUB hitbox 必须分开读；SUB 地板残留无盒不覆盖 BASE 正样本。 |
| `上游创建入口` | `tank_landrunner/action/boom2.act` FRAME5 创建 16162，level `80`、pos `50 0 5`；FRAME0 设置速度 X/Z `100/50`，FRAME6 对 source 自毁。 | 上游 source action 只作为 PassiveObject 创建入口记录，不展开 Monster 主线；创建时机、源对象是否运行和速度效果需实机验证。 |
| `限定标签检索` | 本桶 obj/action/atk 未观察到 `[CREATE PASSIVEOBJECT]`、`[SUMMON MONSTER]`、`[homing]`、`[active status]`、`[pvp]` 或 `[ATTACKRECT]`。 | 无命中只限定本桶源文件和当前样本搜索；不外推到其他 Stingerex 同名对象。 |
| `同名物理文件边界` | 主目标另有 `timegate/conflagration/Stingerex.obj` 11178 与 `AdvanceAltar/Stingerex.obj` 12587；`AttackInfo/Stinger.atk` 字符串也被多个 owner 复用。 | 相同 basename 或相同 attackinfo 字符串不等于同一物理链；必须按 owner 目录解析相对路径。 |
| `辅助对照差异` | 辅助对照同 6 个核心文件、16162 registry、obj/action/atk/ANI 盒字段和 new_event `boom2.act` 创建入口同形。 | 差异为辅助 name 直接文本、registry 总量/行号、对象 dataLength、数字噪声集合不同，且辅助额外有 `timespiral/tank_landrunner/action/boom2.act` 同形创建入口和更多同名 owner；这些只作目标集差异提示。 |

## ActionObject Monster New_Event EMP action-level active status / no .atk / no hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16191 registry` | 16191 走 passiveobject registry 命中 `EMP.obj`；当前跨 registry 解析未观察到同号 equipment 碰撞。 | 当前对象上下文和创建块只按 passiveobject registry 解释；skill 数值表或同名字符串命中不能写成 PO 创建证据。 |
| `EMP.obj` | 对象为 name string-link、floating height `1`、normal layer、pass all、piercing power `1000`，挂 `Action/EMP.act`；未观察到对象级 `[attack info]`、`[homing]`、team、width 或销毁条件。 | 无 `.atk` owner 不等于无运行效果；状态和击倒行为来自 action 行为块，实际目标和时序需运行验证。 |
| `EMP.act` | BASE `spin_left_back_dodge.ani`，9 个 SUB 覆盖 nova、light、line、spin 视觉层。FRAME8/12 均按角色距离 `<= 1000` 检查后执行行为 0；行为 0 为 `[ACTIVE STATUS] [lightning] 100 80 5000 1` 并 `[SET ACTION] [DOWN] [MY DIRECTION] 1 [FORCE] 100 80 [NOW]`；FRAME23 执行 `[DESTROY]`。 | 这里的 `[ACTIVE STATUS]` 是 action-level 行为，不是 `.atk [active status]`；lightning 概率、持续、目标、击倒和推力效果都不能由静态只读单独证明。 |
| `linked ANI` | 10 个 owner-linked EMP ANI 均未观察到 `[ATTACK BOX]` 或 `[DAMAGE BOX]`；帧内容为图像、坐标、倍率、透明度、lineardodge、flip 和 delay 等表现字段。 | 无盒结论只限定这些实际挂接 ANI；不能外推到 `twin_item/emp_*` 或 `tempester/*` 相邻资源。 |
| `上游创建入口` | `dual_face/action/l1_chang_start.act`、`l2_chang_start.act`、`p1_chang_start.act`、`p2_chang_start.act` 均在 FRAME0 创建 16191，level `1`、pos `798 463 90`、`[USE MAP POS]`。 | 上游 source action 只作为 PassiveObject 创建入口记录，不展开 Monster 主线；FRAME0 创建是否实际触发、地图位置和 source action 分支需实机验证。 |
| `辅助对照差异` | 辅助对照同 16191 registry 路由、核心 action 列形和 no-box 搜索结果；差异为 registry 总量/行号、`EMP.obj` name 直接文本和 dataLength 不同。辅助全局 16191 还命中两个 skill level-info 数值表，`Action/EMP.act` 字符串另命中 castleofthedead 相对路径对象。 | 这些只能作为目标集差异提示；辅助独有数字表和相同相对动作名不能写成主目标 EMP 创建入口或 owner 链。 |

## ActionObject Monster New_Event missile_L/R -> missile_EXP -> JeffMissileEXP1 创建链 / hitbox
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `16163 / 16166 / 16164 / 16165 registry` | 四个 ID 分别命中 `missile_L.obj`、`missile_R.obj`、`missile_EXP.obj`、`JeffMissileEXP1.obj`；四者同号均有 equipment registry 碰撞。 | 本桶对象和创建块上下文只按 `passiveobject/passiveobject.lst` 解释；同号装备、字典、技能或任务数字噪声不能写成 PO 链路证据。 |
| `missile_L.obj / missile_R.obj` | 两个对象同形：name string-link、floating height `1`、normal layer、pass all、piercing power `1000`，basic action `missile_start.act`，etc action 分别为 `missile_stay.act` / `missile_stay1.act`；对象本体不挂 `.atk`、team、homing 或销毁条件。 | 对象字段只证明静态配置；导弹可见、碰撞、阵营和停留切 action 时机需运行验证。 |
| `missile_start/stay/stay1/destroy` | `missile_start.act` 分阶段设置 X/Z 速度并在 FRAME46 切 custom 0；两个 stay action 先升空再 teleport 到不同随机 X 区间，FRAME47 创建 16164 后销毁；`missile_destroy.act` 在 ZPOS `<= 30` 后创建 16165 并销毁。 | 速度、随机落点、teleport、ZPOS 条件、warning mark、创建和销毁先后都只能静态证明字段存在，不能证明实机时序。 |
| `JeffMissileEXP1.obj / JeffMissileEXP1.atk` | 16165 对象为 floating height `0`、normal layer、pass all、piercing power `1000`、team `100`，挂 `JeffMissileEXP.act` 与 `JeffMissileEXP1.atk`，time limit `1000`。`.atk` 为 damage `4000`、absolute damage `3000`、physic、fire、down、push/lift `100/100`、hit lift up、blow、no blood `100 1.0`，未观察到 `.atk [active status]` 或 `.atk [pvp]`。 | `.atk` 不提供 hitbox 坐标；伤害、浮空、击退、火属性和 time limit 销毁需实机验证。 |
| `linked ANI` | `missile.ani`、`missileT.ani`、`missileD.ani`、`missile_eff.ani`、`missile_effD.ani` 均无攻击框或伤害框。`JeffMissileEXP.ani` FRAME000 有 2 条攻击框，FRAME001-003 各有 3 条攻击框，FRAME004-005 无盒；SUB `JeffMissileEXP1/2/3.ani` 无盒。 | 飞行/尾焰/下坠表现层无盒不代表整条链无 hitbox；实际攻击框在 16165 爆炸 BASE ANI。 |
| `35112 / 35113 下游` | `JeffMissileEXP.act` FRAME0 创建 35112 `LargeExp.obj` 与 35113 `sniper_exp.obj`；35112 下游 `ShootingStarExp.ani` 单帧空图有 `[ATTACK BOX] -100 -30 -20 200 60 40`，35113 `sniper_exp.ani` 无盒。 | 35112/35113 位于 `[CREATE PASSIVEOBJECT] [INDEX]` 内，仍走 passiveobject registry；35112/35113 同号 equipment 碰撞不能覆盖本上下文。 |
| `上游创建入口` | `dual_face/l2_missile_l.act` 与 `dual_face2/missile_l.act` 创建 16163；`dual_face/l1_missile_r.act` 与 `dual_face2/missile_r.act` 创建 16166。两条 `dual_face` 路径 pos 为 `70 -5 50`，两条 `dual_face2` 路径 pos 为 `50 0 10` 且带 collision group。 | 上游 source action 只作为 PassiveObject 创建入口记录，不展开 Monster 主线；实际分支、方向、生成次数、碰撞组效果和落点需运行验证。 |
| `monster-check 上下文 / 辅助对照差异` | `JeffMissileEXP.act` 的 `[LAST ATTACKSUCCESS] [IS INDEX]` 61772/61776/61777/61779 均走 `monster/monster.lst`，只用于 checkup object 分支。辅助对照同四个核心 ID、核心 obj/action/atk/ANI 和 35112/35113 下游同形。 | 辅助差异为 name 直接文本、registry 总量/行号、对象脚本长度、数字噪声集合不同，且辅助未观察到主目标 `dual_face2` 左右 missile 入边；这些不能覆盖主目标结论。 |

## Homing 样本

| 样本 | 只读观察 | 边界 |
| --- | --- | --- |
| `medusa_down.obj` | `[homing follow] [ENEMY]`，速度 `80 40`，有 check gap、sync animation rotation、max/init/diff rotation、homing time。 | `[ENEMY]` 是 token，无 registry ID 行。 |
| `medusa_down2.obj` | 与 `medusa_down.obj` 同形，动作路径不同。 | 同形样本不证明全局字段固定。 |
| `mind_control_octo.obj` | `[homing follow] [MONSTER] 61194`，速度 `100 1`，`homing time 0`。 | 61194 已回 monster registry 解析；passiveobject registry 未命中。 |
| `stone.obj` | `[homing follow] [ENEMY]`，速度 `700 500`，有 `[straight homing]` 空标签；无 `[sync animation rotation]`。 | `[straight homing]` 是 homing 内空标记；字段集合可缺省。 |
| `_cursequeen/void/body.obj` / `pursuit1.obj` / `pursuit2.obj` | `[homing follow] [ENEMY]`，速度 `50 50`，check gap `200`，sync animation rotation `0`，homing time `0`，并有 `[time limite] 5000` 销毁块。 | 这是 actionobject/SPC 分桶 homing 正样本；无 registry ID 路由点。 |
| `_firewitch/ador/body.obj` | `[homing follow] [ENEMY]`，速度 `250 250`，check gap `600`，sync animation rotation `0`，max rotation `180`，并有 `[on end of animation]` 销毁块。 | 这是 actionobject/SPC 分桶 homing 正样本；`[ENEMY]` 后无数字，不解析 registry。 |
| `_burnfire/body.obj` | `[homing follow] [ENEMY]`，速度 `400 400`，check gap `100`，sync animation rotation `1`，max rotation `360`，并有 `[on end of animation]` 销毁块。 | 这是 actionobject/SPC 分桶 homing 正样本；`[ENEMY]` 后无数字，不解析 registry。 |
| `_cypherelec/cypherelec.obj` / `cypherelec2.obj` / `cypherelec_item.obj` | `[homing follow] [ENEMY]`，速度 `250 0`，check gap `100000`，sync animation rotation `0`，max rotation `360`，并有 `[on end of animation]` 销毁块。 | 这是 actionobject/SPC 分桶 homing 正样本；`[ENEMY]` 后无数字，不解析 registry。 |
| `_cyclone/body.obj` / `short1.obj` / `short2.obj`；`goldteida_effect.obj` | `[homing follow] [ENEMY]`；body/short 分支速度 `150 150`、check gap `500`、sync animation rotation `0`、max rotation `360`，goldteida 分支速度 `250 250`、check gap `300`、sync `0`、max `360`；均有 `[on end of animation]` 销毁块。 | 这是 actionobject/SPC 分桶内同 action、不同 homing 参数样本；`[ENEMY]` 后无数字，不解析 registry。 |
| `rina/rosiclockball.obj` | `[homing follow] [ENEMY]`，速度 `10 10`，check gap `100`，sync animation rotation `1`，max/init/diff rotation `360`，homing time `50000`。 | 这是 actionobject/SPC rina 分桶 homing 正样本；`[ENEMY]` 后无数字，不解析 registry，实际追踪公式需实机验证。 |
| `actionobject/monster/advancealtar/homingmoth.obj` / 根级 `homingmoth.obj` | 两个 owner 均为 `[homing follow] [ENEMY]`，速度 `0 150`，check gap `1000`，并有 `[on end of animation]` 销毁块；未观察到 sync animation rotation、homing time 或 straight homing 字段。 | `[ENEMY]` 后无数字，不解析 registry；两个 owner 共用根级 action/atk/ANI，不能按 `advancealtar/action/` 猜物理 action。 |

## 样本复核
| 样本 | 主目标只读复核 | 边界 |
| --- | --- | --- |
| `act8/monster/mermadia/medusa_down.obj` | `[object destroy condition]` 内为 `[destroy condition]`、`[time limite]`、`10000`；`[homing follow] [ENEMY]`，速度 `80 40`，check gap `1000`，sync animation rotation `0`，max/init/diff rotation 为 `200 / 180 / 200`，homing time `10000`。 | `[ENEMY]` 后无 registry ID；实际追踪轨迹和时间单位不由静态只读证明。 |
| `medusa_down.obj -> medusa_down.act / medusa_attack.act` | `medusa_down.act` 在攻击成功后切到 custom action 0；`medusa_down.ani` 和 `medusa_attack.ani` 的 4 帧均有同组 `[ATTACK BOX] -15 -10 -10 30 20 24`。 | `.atk` 提供 magic/light/hold 等攻击信息；盒坐标仍来自 ANI。 |
| `act8/monster/mermadia/mind_control_octo.obj` | `[homing follow] [MONSTER] 61194`；61194 回 `monster/monster.lst` 命中 `Act8/congcong/congcong.mob`，在 `passiveobject/passiveobject.lst` 未命中；`homing time` 为 `0`。 | `[MONSTER]` 后数字走 monster registry；不要按 passiveobject ID 解释。 |
| `mind_control_octo.obj -> mind_control_octo.act / last_octo.act` | basic action 有 `[MIND CONTROL APPENDAGE] 60 500 1`；last action 设置 Z 轴速度 300；两个 linked ANI 只有 `[DAMAGE BOX] -22 -10 -9 40 20 40` 样本，未观察到攻击框。 | mind control appendage、homing 与 damage box 均为静态结构；不证明实机控制、追踪或碰撞结果。 |
| `timegate/conflagration/forest_elf/stone.obj` | 主目标 `[straight homing]` 唯一命中；位于 `[homing]` 块内，follow 为 `[ENEMY]`，速度 `700 500`，check gap `510`，max/init/diff rotation 为 `0 / 0 / 100`，homing time `1000`。 | `[straight homing]` 是空标签；主目标只证明该样本存在，不证明所有 homing 都是直线追踪。 |
| `stone.obj -> stone.act / stone.atk / stone.ani` | `stone.act` 在 `ZPOS [=<] 10` 后销毁；`.atk` 为 physic/no element/hold；`stone.ani` 两帧均有 `[ATTACK BOX] -28 -10 0 55 19 41`。 | action 销毁条件、`.atk` payload 与 ANI hitbox 分层记录。 |
| `actionobject/monster/advancealtar/homingmoth.obj` / 根级 `homingmoth.obj` | 两个 owner 核心列形同构：width `10 5`、floating height `1`、pass all、piercing power `0`、`Action/HomingMoth.act`、`AttackInfo/HomingMoth.atk`、homing follow `[ENEMY]`、velocity `0 150`、check gap `1000`、销毁条件 `[on end of animation]`。`advancealtar` owner 的 sound category 在 `[after object create]` 前有 leading `1`，根级 owner 无该 leading `1`。 | 这是 actionobject/monster 内的 homing 样本，不是 Monster 主线；`advancealtar/action/homingmoth.act` 主目标未命中，action 实体在根级 `action/homingmoth.act`。 |
| `HomingMoth.act / HomingMoth.atk / HomingMoth.ani` | `HomingMoth.act` 指向 `../animation/HomingMoth.ani`；`.atk` 为 `[damage] 1600`、physic、no element、none reaction、push/lift `0`、hit horizon、blow、hit wav `R_BUGS_HIT`。`HomingMoth.ani` 17 帧均同时有 attack/damage box。 | `.atk` 不提供盒坐标；静态只读只能证明 17 帧盒字段存在，不能证明实机追踪、命中频率或卡肉效果。 |

## Homing ID 路由

| token | 后续数字 | 正确处理 |
| --- | ---: | --- |
| `[ENEMY]` | 样本无数字 | 按 token 记录，不解析 registry。 |
| `[MONSTER]` | 61194 | 走 `monster/monster.lst`；主目标命中 `Act8/congcong/congcong.mob`。 |

结论：`[homing follow]` 后的 token 决定后续数字是否需要 registry 路由。不要把 homing 内裸数字统一按 passiveobject 解析。

## 辅助对照提示

辅助对照同类字段规模明显大于主目标，例如 `[object destroy condition]`、`[hp destroy]`、`[vanish on move collision]`、`[homing]`、`[active status]` 的命中数均更高。当前样本同路径 `medusa_down.obj`、`mind_control_octo.obj`、`forest_elf/stone.obj` 可读且同形；`treasurebox -> 9330 -> treasurebox_open` 同路径也可读且同形，9330 入边同样只命中源对象和 registry；`nest.obj`、`bike1.obj`、`deserter_Bomb.obj -> 9110 deserter_BombSub.obj` 同路径、同 ID 路由和核心列形可读；`_firewitch/ador` 同路径对象、action、attackinfo、ANI、40002/601 registry 路由同形，差异为 `Common/FireExplosion.obj [name]` 主目标为字符串链接样而辅助为直接文本；`at_5t_walker/rocket1 -> rocket2 -> rocketboom` 同路径对象、action、attackinfo、ANI 和 10263/10267/61236 registry 路由同形；`at_5t_walker/fire/bullet/bullet1/bombingmissile/exp/hit` 同路径对象、action、attackinfo、ANI 和 10284/8715/61236 registry 路由也同形；`at_5t_walker/special -> 10268 bombingmissile` 同路径对象、action、ANI 和 registry 路由同形；`at_5t_walker/barr/destroy/destroydust/shootsmoke` 同路径对象、ANI、粒子侧车和 61235 registry 路由同形。主要差异为 registry 总量/行号、name 字符串样式，以及辅助对照 `fire.obj` 的 after-create sound 为 `FIRE_02_LOOP` 而主目标为 `NPC_SERIA_AMB_02`。但辅助对照 `[homing follow]` 命中 477，`[straight homing]` 命中 2，并额外观察到 `dragonstonestatue/darkmissile` 的 straight homing。辅助独有路径或差异不能写成主目标存在。

## 未闭合

- 这不是 1495 个销毁块与 199 个 homing 块的全量闭合。
- `[object destroy condition]` 内 token 仍需继续分桶，例如时间、动画结束、销毁动作、销毁后创建。
- `[hp destroy] 0/1` 的运行含义不能由静态只读证明。
- homing 速度、旋转、时间、直线追踪的单位和公式不能由静态只读证明。
- 后续应补全分桶：按 `actionobject/`、`character/`、`mapobject/`、`common/` 抽样生命周期和 homing 结构。

