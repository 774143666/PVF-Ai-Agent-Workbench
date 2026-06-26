# AttackInfo PVP 触发链试点账本

状态：需验证

本文记录主目标 PVF 中 `.atk [pvp] ... [/pvp]` 文件向上游 `.obj/.act/.ani` 连接的只读试点。它只证明静态引用链和帧级盒字段存在，不证明 PVP 实机伤害、命中、击退、浮空、硬直或竞技场规则。

## 检索结论

| 问题 | 主目标观察 |
| --- | --- |
| 用小写 basename 搜索 `.atk` owner 是否可靠？ | 不可靠。`atpoisonflask.atk`、`bulletbowgun.atk` 等小写 basename 内容搜索可为 0。 |
| `.obj [attack info]` 怎么写路径？ | 可写大小写混合相对路径，例如 `AttackInfo/ATPoisonFlask.atk`、`AttackInfo/BulletBowGun.atk`、`attackinfo/fireball.atk`。 |
| 同一相对 attackinfo 字符串是否等于同一物理 `.atk`？ | 不一定。`AttackInfo/RevengeThunderBolt.atk` 可同时出现在 character/priest 与 equipmentpassiveobject owner 中，但要分别按 owner 目录解析；priest 版是非 PVP `.atk`，装备版才是当前样本 PVP `.atk`。 |
| action 是否可能创建下游 PVP 对象？ | 可以。`event_thunder_item01.act` 连续创建 `[INDEX] 48234`，该 ID 回 `passiveobject/passiveobject.lst` 解析到 `EquipmentPassiveObject/RevengeThunderbolt/RevengeThunderbolt.obj`。 |

## 已闭合正样本

| 样本 | 静态链路 | ANI / 行为观察 | 边界 |
| --- | --- | --- | --- |
| `ATPoisonFlask.atk` | `atpoisonflask.obj [attack info] -> AttackInfo/ATPoisonFlask.atk`；同 `.obj [basic motion] -> Animation/ATEnchantPoison/ATPoisonFlask.ani` | `ATPoisonFlask.ani` 反编译成功，`FRAME000` 有 `[ATTACK BOX]` 六数值列。 | 只证明该 `.atk` 有 owner 和基础 motion 攻击框，不证明异常中毒公式。 |
| `BulletBowGun.atk` | `downbulletbowgun.obj [attack info] -> AttackInfo/BulletBowGun.atk`；同 `.obj [basic motion] -> Animation/BulletBowGun.ani` | `BulletBowGun.ani` 反编译成功，`FRAME000` 有 `[ATTACK BOX]` 六数值列。 | `JumpBulletBowGun.atk` 走 `jumpbulletbowgun.obj`，共用 `BulletBowGun.ani`。 |
| `OutRageBreakFloor.atk` | `outragebreakfloor.obj [attack info] -> AttackInfo/OutRageBreakFloor.atk`；同 `.obj [basic motion] -> Animation/OutRageBreak/floor.ani` | `floor.ani` 反编译成功，`FRAME000`、`FRAME001` 有 `[ATTACK BOX]` 六数值列。 | `OutRageBreakFloor_DS.atk` 走独立 DS `.obj` 和 DS 动画目录。 |
| `BoneShield.atk` | `boneshield.obj [attack info] -> AttackInfo/BoneShield.atk`；同 `.obj` 有 `[basic motion]` 和 `[etc motion]` 多个 ANI。 | owner-listed 7 个 motion 已读；只有 `bone_rotate_none.ani` 观察到 `[ATTACK BOX]`。 | 同一 `.obj` 的不同 motion 不共享 hitbox 结论。 |
| `fireball.atk` | `fire_boom.obj [attack info] -> attackinfo/fireball.atk`；同 `.obj [basic action] -> Action/fire_boom.act` | `fire_boom.act [BASE ANI] -> fire_boom_e1.ani`；`fire_boom_e1.ani` 多帧有 `[ATTACK BOX]`；action 行为块含 `[SET ACTION] [ATTACK] 7 [NOW]`。 | 静态只读不解释 `[ATTACK] 7` 的运行时序。 |
| `boom.atk` | 装备 `boom.obj [attack info] -> attackinfo/boom.atk`；同 `.obj [basic action] -> Action/boom.act` | `boom.act [BASE ANI] -> boom01.ani`，`[SUB ANI] -> boom02.ani`；`boom01.ani` `FRAME000` 到 `FRAME003` 有 `[ATTACK BOX]`，`boom02.ani` 已读但未观察到攻击框。 | `attackinfo/boom.atk`、`boom01.ani` 和 `boom02.ani` 都存在多目录同名风险；本行只闭合装备 `boom/boom.obj` 的相对路径。 |
| `Event_Thunder.atk` | `event_thunder_item1.obj [attack info] -> AttackInfo/Event_Thunder.atk`；同 `.obj [basic action] -> Action/Event_Thunder_item01.act` | `Event_Thunder_item01.act [BASE ANI] -> empty_00.ani`；`empty_00.ani` 为空图像帧；action 多帧创建 `[INDEX] 48234`。 | 父对象自身 PVP `.atk` 与下游创建对象的实际命中关系需运行链验证。 |
| `RevengeThunderBolt.atk` | equipment 版 `revengethunderbolt.obj [attack info] -> AttackInfo/RevengeThunderBolt.atk`；character/priest owner 写同名相对字符串但解析到 priest 目录的非 PVP `.atk`。 | equipment 版 `lighting.act -> TalismanThunderbolt*.ani`，其中 `TalismanThunderbolt1.ani` 有 `[ATTACK BOX]`；priest 版 `TalismanThunderbolt1.ani` 有 `[ATTACK BOX]` 与 `[DAMAGE BOX]`。 | 同名相对 attackinfo 字符串必须按 owner 目录解析，不能直接写成同一物理 `.atk` 多 owner。 |

## Registry 样本

| 上下文 | 数字 | Registry 结果 |
| --- | ---: | --- |
| `event_thunder_item01.act [CREATE PASSIVEOBJECT] [INDEX]` | 48234 | `passiveobject/passiveobject.lst` 命中 `EquipmentPassiveObject/RevengeThunderbolt/RevengeThunderbolt.obj`。 |

## 已分桶闭合

| 分桶 | 主目标只读结论 | 入口 |
| --- | --- | --- |
| 枪手 PVP `.atk` | `passiveobject/character/gunner/attackinfo/` 下 12 个带 `[pvp]` 的 `.atk` 已闭合到 owner `.obj`；普通枪械子弹多走 `[attack info]`，手雷和 Tempester 导弹爆炸可走 `[etc attack info]`；对应 ANI 已有 `[ATTACK BOX]` 正样本。 | `indexes/attackinfo-pvp-gunner-chain-ledger.zh-CN.md` |
| Fighter PVP `.atk` | `passiveobject/character/fighter/attackinfo/` 下 4 个带 `[pvp]` 的 `.atk` 已闭合到 owner `.obj`；野蛮冲撞终段走 `[etc attack info]`，部分视觉 / dodge / etc motion 已读但未见 `[ATTACK BOX]`。 | `indexes/attackinfo-pvp-fighter-chain-ledger.zh-CN.md` |
| Mage PVP `.atk` | `passiveobject/character/mage/attackinfo/` 下 4 个带 `[pvp]` 的 `.atk` 已闭合到 owner `.obj`；`ATChainLightning` 有多 owner；`EnhancedMagicMissile`、`TimerBombExplosion` 等 owner-listed motion 未观察到 `[ATTACK BOX]`，hitbox 映射仍需更深链路验证。 | `indexes/attackinfo-pvp-mage-chain-ledger.zh-CN.md` |
| Priest / Swordman / Thief 小桶 PVP `.atk` | 6 个带 `[pvp]` 的 `.atk` 已闭合到 owner `.obj`；`attack_pierce.atk` 走 `ballacre.obj [etc attack info]` 且主 `[attack info]` 为空；`BoneShield` 7 个 owner-listed motion 中仅 `bone_rotate_none.ani` 有攻击框。 | `indexes/attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md` |
| Common / Equipment PVP `.atk` | 5 个带 `[pvp]` 的 `.atk` 已闭合到目标目录 owner；装备样本多走 `[basic action] -> .act -> ANI`；`Event_Thunder` 父对象自身无攻击框但每帧创建 registry 48234 下游对象。 | `indexes/attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md` |
| zrr_skill PVP `.atk` | 9 个带 `[pvp]` 的 `.atk` 已完成静态只读审计；1 个闭合到 `.obj` 但 owner-listed ANI 断链，8 个未找到 owner 字符串。 | `indexes/attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md` |

## 方法规则

- 先从 `.atk` 所在目录和同 stem 文件清单找候选 `.obj`，再读 `.obj [attack info]` 原文确认。
- 搜索 owner 时优先使用 `.obj` 中实际大小写路径，例如 `AttackInfo/RevengeThunderBolt.atk`；不要只用小写 basename。
- `.obj [basic motion]` 可直接连到 ANI；`.obj [basic action]` 需要先读 `.act [BASE ANI]`、`[SUB ANI]`、`[TRIGGER]`、`[BEHAVIOR]`。
- 看到 `[CREATE PASSIVEOBJECT] [INDEX]` 必须回 `passiveobject/passiveobject.lst` 解析下游对象。
- 只有 `.atk + owner .obj + .act/.ani` 静态链都读到，才能写“静态链路闭合”；仍不能写成实机命中或 PVP 规则已验证。

## 未闭合

- 40 个 PVP `.atk` 已全部完成静态只读审计；其中 31 个已闭合到 owner/ANI 或 owner/action/ANI 观察点，9 个 zrr_skill 文件登记为 owner 未闭合或 ANI 断链风险。
- 多 owner / 同名相对路径风险已在分桶账本中记录；仍不等于实机运行来源已证明。
- 已观察到 `[ATTACK BOX]` / `[DAMAGE BOX]` 的样本仍不证明客户端 ImagePacks2/NPK 资源完整。
