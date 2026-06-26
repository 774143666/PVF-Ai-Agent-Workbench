# AttackInfo PVP 枪手链路账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/character/gunner/attackinfo/` 下带 `[pvp] ... [/pvp]` 的 `.atk` 文件如何静态连回 owner `.obj` 与 ANI。它只证明目标 PVF 的只读结构、PVP 覆盖块和帧级攻击框字段存在；不证明竞技场最终伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| 枪手目录 PVP `.atk` | 12 个，均已在本账本闭合到 owner `.obj`。 |
| PVP 块闭合 | 12 个均读到 `[/pvp]`。 |
| owner 形态 | 普通枪械子弹多为 `.obj [attack info]`；手雷和 Tempester 导弹爆炸可位于 `.obj [etc attack info]`。 |
| 路径大小写 | owner 中保留 `AttackInfo/...`、`attackinfo/...`、`Animation/...` 等原始大小写；不要用小写 basename 推断 owner。 |
| ANI 观察 | 对应 motion 已观察到 `[ATTACK BOX]` 正样本；Tempester normal 爆炸 ANI 读取到但未见 `[ATTACK BOX]`。 |
| registry | 本账本为 direct path 链路；若后续任务需要数字 ID，仍必须回 `passiveobject/passiveobject.lst` 解析。 |

## 普通枪械子弹

| PVP `.atk` | PVP 块内字段 | owner `.obj` | motion / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `bulletbowgun.atk` | `[damage bonus] -8` | `downbulletbowgun.obj`、`upbulletbowgun.obj` | `BulletBowGun.ani` 有 `[ATTACK BOX]`。 | down/up 共用同一 `.atk` 与 ANI。 |
| `jumpbulletbowgun.atk` | `[damage bonus] -10` | `jumpbulletbowgun.obj` | `BulletBowGun.ani` 有 `[ATTACK BOX]`。 | jump 使用独立 `.atk`，但共用 bowgun ANI。 |
| `bullethandcannon.atk` | `[damage bonus] -8` | `downbullethandcannon.obj`、`upbullethandcannon.obj` | `DownBulletHandCannon.ani`、`UpBulletHandCannon.ani` 均有 `[ATTACK BOX]`。 | `jumpbullethandcannon.atk` 已观察为相邻非 PVP `.atk`，不要并入本计数。 |
| `bullethandcannon_wind_shot.atk` | `[damage bonus] -8` | `downbullethandcannon_wind_shot.obj`、`jumpbullethandcannon_wind_shot.obj` | `BulletHandCannon_wind_shot.ani` 有 `[ATTACK BOX]`。 | down/jump 共用同一 wind shot PVP `.atk`。 |
| `upbullethandcannon_wind_shot.atk` | `[damage bonus] -8` | `upbullethandcannon_wind_shot.obj` | `UpBulletHandCannon_wind_shot.ani` 有 `[ATTACK BOX]`。 | up wind shot 使用独立 PVP `.atk`。 |
| `bulletmusket.atk` | `[damage bonus] -5` | `downbulletmusket.obj`、`upbulletmusket.obj` | `BulletMusket.ani` 有 `[ATTACK BOX]`。 | `jumpbulletmusket.atk` 已观察为相邻非 PVP `.atk`。 |
| `bulletrevolver.atk` | `[damage bonus] -12` | `downbulletrevolver.obj`、`upbulletrevolver.obj` | `BulletPistol.ani` 有 `[ATTACK BOX]`。 | 左轮子弹使用 `BulletPistol.ani`，不是 `BulletRevolver.ani`。 |
| `jumpbulletautomatic.atk` | `[damage bonus] -7` | `jumpbulletautomatic.obj` | `BulletPistol.ani` 有 `[ATTACK BOX]`。 | `bulletautomatic.atk` 已观察为相邻非 PVP `.atk`。 |

## 特殊枪手对象

| PVP `.atk` | PVP 块内字段 | owner `.obj` | motion / ANI 观察 | 边界 |
| --- | --- | --- | --- | --- |
| `fm-31explosion.atk` | `[hit info]`，含反引号 token `[blow]`、`[no blood]` 与 `100 1.5` | `fm-31explosion.obj [attack info]` | `../../Common/Animation/FireExplosion.ani` 有 `[ATTACK BOX]`。 | 爆炸对象还带公共粒子引用；粒子存在不证明客户端资源完整。 |
| `grenadenone.atk` | `[lift up] 350` | `grenadenone.obj [etc attack info]` | `GrenadeNone.ani` 有飞行 `[ATTACK BOX]`；`GrenadeNoneBombAirDodge.ani`、`GrenadeNoneBombFloorDodge.ani` 及对应 `.[pvp].ani` 均有爆炸 `[ATTACK BOX]`。 | 主 `[attack info]` 是 `GrenadeFly.atk`；PVP `.atk` 在 `[etc attack info]`，不要把两者合并。 |
| `tempesterexplosion.atk` | `[damage reaction] [down]` 与 `[hit info] [blow] [no blood] 100 1.0` | `tempesterexplosion.obj [attack info]` | `../../Common/Animation/FireExplosion.ani` 有 `[ATTACK BOX]`。 | 与 FM-31 共用公共爆炸 ANI，但 `.atk` 内容不同。 |
| `tempestermissileexp.atk` | `[damage reaction] [down]` 与 `[hit info] [blow] [no blood] 20 1.0` | `tempestermissile.obj [etc attack info]` | `ExpAirDodge.ani`、`ExpLandDodge.ani` 有 `[ATTACK BOX]`；`ExpAirNormal.ani`、`ExpLandNormal.ani` 已读但未见 `[ATTACK BOX]`。 | `TempesterMissile.atk` 是飞行攻击且未观察到 PVP 块；爆炸攻击在 `[etc attack info]`。 |

## 相邻但不并入 PVP 计数

| 文件 | 主目标观察 |
| --- | --- |
| `jumpbullethandcannon.atk` | owner 为 `jumpbullethandcannon.obj`，未观察到 `[pvp]`。 |
| `jumpbulletmusket.atk` | owner 为 `jumpbulletmusket.obj`，未观察到 `[pvp]`。 |
| `jumpbulletrevolver.atk` | owner 为 `jumpbulletrevolver.obj`，未观察到 `[pvp]`。 |
| `bulletautomatic.atk` | owner 为 `downbulletautomatic.obj`、`upbulletautomatic.obj`，未观察到 `[pvp]`。 |
| `tempestermissile.atk` | `tempestermissile.obj [attack info]` 的飞行攻击，未观察到 `[pvp]`。 |
| `tempestergunbullet.atk` | `tempestergunbullet.obj [attack info]`，未观察到 `[pvp]`。 |

## 方法规则

- 查 PVP `.atk` owner 时，先从同目录 `.obj` 候选读取 `[attack info]`、`[etc attack info]` 原文，再确认是否命中目标 `.atk`。
- 看到 `[etc attack info]` 时，必须同时读 `[etc motion]`，因为爆炸/第二段攻击可能不走 `[basic motion]`。
- 看到同名或相邻 `.atk` 没有 `[pvp]`，只能写成相邻非 PVP 样本，不能强行归入 PVP 账本。
- ANI hitbox 结论以二进制 ANI 反编译结果为准；脚本文本搜索无法证明二进制 ANI 中不存在盒字段。

## 未完成

- 本账本只完成枪手目录 12 个 PVP `.atk` 的静态链路，不代表 40 个 PVP `.atk` 全部 owner 闭合。
- 手雷 normal / rolling 等所有 motion 还没有在本账本逐一穷尽；当前只记录与飞行和爆炸 dodge/PVP dodge 相关的正样本。
- Tempester normal 爆炸 ANI 已读但未见 `[ATTACK BOX]`；该差异只能作为静态观察，不能解释运行时选择规则。
- 实机 PVP 伤害、命中、浮空、击退、硬直和资源显示仍需独立运行测试。
