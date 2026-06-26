# ActionObject / MapObject / BreakableObject / SPC Object Boundary

状态：已完成静态只读封存

用途：记录主目标 PVF 中 `passiveobject/` 对象家族的目录边界、registry 路由、`.obj/.act/.atk/.ani` 链路、地图放置入口和辅助对照差异。本文不重开 PassiveObject / AttackInfo / Hitbox 大主线，不证明实机生成、机关触发、路径门、命中、伤害、破坏、AI、音频、客户端资源或服务端放行。

## 方法边界

- 先用外部资料库中的对象管理、被动对象创建包、ACT 行为和数据传输说明做定向线索；资料只决定检查方向，不直接进入 Workbench 结论。
- 主结论只按主目标 PVF 只读观察写入。
- 辅助 PVF 只记录差异提示，不覆盖主目标事实。
- 数字 ID 必须回到父块和上下文：map 放置、被动对象创建、怪物召唤、APC 召唤分别走不同 registry。

## 主目标目录矩阵

| 小桶 | 主目标只读观察 | 结论 |
| --- | ---: | --- |
| `passiveobject/passiveobject.lst` | 6548 entries | 对象 ID 的第一入口；不能靠数字外形猜 registry。 |
| `passiveobject/` `.obj` | 6984 | 物理文件数可高于 registry 项数；是否注册要回 `.lst`。 |
| `actionobject/` `.obj` | 3953 | 行为对象大族，常见 `.act/.atk/.ani` 链路。 |
| `actionobject/map/` `.obj` | 1002 | 地图相关 actionobject，不等于 mapobject。 |
| `actionobject/monster/` `.obj` | 2130 | 怪物相关 actionobject，不等于 monster registry 本体。 |
| `actionobject/common/` `.obj` | 171 | 通用对象候选，需 owner 链路确认。 |
| `actionobject/breakableobject/` `.obj` | 88 | actionobject 层破坏物，可含 `.act`、HP、销毁粒子。 |
| `actionobject/spc/` `.obj` | 202 | SPC 对象家族，样本确认 `.obj -> .act/.atk/.ani`。 |
| `mapobject/` `.obj` | 1281 | 地图物件大族，常见 motion、string/int data。 |
| `mapobject/breakableobject/` `.obj` | 156 | mapobject 层破坏物，和 actionobject 破坏物分层。 |
| `mapobject/pathgate/` `.obj` | 617 | 路径门对象候选，静态字段不证明门逻辑。 |
| `mapobject/trap/` `.obj` | 124 | 陷阱/机关候选，静态字段不证明触发。 |
| `mapobject/obstacle/` `.obj` | 360 | 障碍候选，静态字段不证明碰撞。 |
| `mapobject/particlefactory/` `.obj` | 24 | 粒子候选，静态字段不证明渲染。 |

## 主目标链路矩阵

| 链路 | 主目标只读观察 | 风险边界 |
| --- | --- | --- |
| `ActionObject .obj -> [basic action]` | `actionobject/` 中 `[basic action]` 命中 3444。 | 只说明 `.obj` 引用 `.act`，不证明动作触发。 |
| `ActionObject .obj -> [attack info]` | `actionobject/` 中 `[attack info]` 命中 1855。 | `.atk` payload 不证明 hitbox 命中或伤害。 |
| `MapObject .obj -> [basic motion]` | `mapobject/` 中 `[basic motion]` 命中 633。 | 直接 motion 不是 `.act` 行为链。 |
| `MapObject .obj -> [etc motion]` | `mapobject/` 中 `[etc motion]` 命中 180。 | 多动画/空串都需要保留原样，不硬解释列。 |
| `MapObject .obj -> [attack info]` | `mapobject/` 中 `[attack info]` 命中 78。 | 少量 mapobject 也可携带 `.atk`，但不代表所有地图物件可攻击。 |
| `MapObject .obj -> [object destroy condition]` | 主目标 `mapobject/` 命中 1。 | 不能把 actionobject 常见销毁条件外推到 mapobject 全族。 |
| `MapObject .obj -> [hp max]` | 主目标 `mapobject/` 命中 0。 | 不能把 actionobject 破坏物 HP 外推到 mapobject。 |
| `ActionObject .act -> [CREATE PASSIVEOBJECT]` | 主目标 `actionobject/` 命中 1543。 | `[INDEX]` 走 passiveobject registry；不证明实机创建成功。 |
| `MapObject .act -> [CREATE PASSIVEOBJECT]` | 主目标 `mapobject/` 命中 0。 | 辅助对照有少量命中，只作版本差异提示。 |
| `ActionObject .act -> [SUMMON MONSTER]` | 主目标 `actionobject/` 命中 241。 | `[INDEX]` 走 monster registry。 |
| `ActionObject .act -> [SUMMON APC]` | 主目标 `actionobject/` 命中 13。 | `[INDEX]` 走 aicharacter registry。 |
| `.map -> [passive object]` | 主目标 `map/` 命中 2817；`dungeon/` 搜索为 0。 | map 放置块首列走 passiveobject registry，不走 map registry。 |

## 代表样本

| 样本 | 主目标只读观察 | 结论 |
| --- | --- | --- |
| `passiveobject/actionobject/act8/map/pirateship/pirate_ship_bomb.obj` | 含 `[pass type] [pass all]`、`[object destroy condition] [on end of animation]`、`[basic action] action/bomb.act`、`[attack info] attackinfo/exp_attack.atk`。 | 典型 actionobject 链路：`.obj` 连接 `.act` 和 `.atk`。 |
| `passiveobject/actionobject/act8/map/pirateship/action/bomb.act` | `[BASE ANI] ../animation/ATExpNormal.ani`、`[SUB ANI]`、`[SOUND] BOMB_01`。 | `.act` 连接动画和声音 token，不证明动画/音频资源实际可用。 |
| `passiveobject/actionobject/act8/map/pirateship/attackinfo/exp_attack.atk` | 含 `[damage] 2510`、`[attack type] [physic]`、`[fire element]`、击退/浮空/血效字段。 | `.atk` 静态 payload 存在，不证明命中或最终伤害。 |
| `passiveobject/mapobject/breakableobject/actionbrazier.obj` | 含 `[basic motion]`、`[etc motion]`、`[int data]`、`[string data]`、`[destroy particle]`、`[name]`。 | mapobject 可直接通过 motion 和数据列组织对象，不必经过 `.act`。 |
| `passiveobject/mapobject/pathgate/act1/frostmirkwoodleftnormal.obj` | `[string data]` 列出多条 ANI 和一个 TIL，`[int data]` 多数值列，名称为左侧门。 | pathgate 静态资源和数据列存在，不证明门开关实机正常。 |
| `passiveobject/actionobject/spc/_airsword/airsword.obj` | 含 `[basic action] Action/airsword.act`、`[attack info] AttackInfo/body.atk`、`[sound category]`、销毁条件。 | SPC 样本可闭合到 `.act/.atk`，但不证明技能或特效实机触发。 |
| `passiveobject/actionobject/breakableobject/alarm.obj` | 含 `[basic action]`、`[etc action]`、`[hp max] 2000`、`[hp destroy] 1`、`[destroy particle]`、`[team]`。 | actionobject 破坏物可带 HP 和额外动作；不证明可破坏或任务联动。 |
| `map/1stbackbone/apc(2,0).map` | 同图存在 `[passive object]`、`[special passive object]`、`[monster]`、`[ai character]` 等块。 | 同一 `.map` 内不同父块的数字必须按各自 registry 和列形解析。 |

## Registry 样本

| 上下文 | ID | 解析结果 | 边界 |
| --- | ---: | --- | --- |
| `passiveobject/passiveobject.lst` | 221 | `MapObject/BreakableObject/Barrel.obj` | passiveobject registry 可注册 mapobject 破坏物。 |
| `.map [passive object]` | 708 | `MapObject/Obstacle/Act3_1stBackbonesmallwall.obj` | 地图放置块首列走 passiveobject registry。 |
| `.map [passive object]` | 709 | `MapObject/Obstacle/Act31stBackboneFar.obj` | 同上，不能按数字猜成 map ID。 |
| `.map [passive object]` | 779 | `MapObject/BreakableObject/1stBackboneLongPot.obj` | special/passive object 附近数字仍需看父块。 |
| `passiveobject/passiveobject.lst` | 2722 | `Character/Common/OlympicFairyShield.obj` | passiveobject registry 也可注册 character/common 对象。 |
| `passiveobject/passiveobject.lst` | 344 | `Monster/Skeleton/FallingStone1.obj` | passiveobject registry 里出现 Monster 路径也不是 monster registry ID。 |
| `.act [CREATE PASSIVEOBJECT] [INDEX]` | 10185 | `ActionObject/Act8/Map/pirateonthetrain/enginecover_1.obj` | 创建被动对象时走 passiveobject registry。 |
| `.act [SUMMON MONSTER] [INDEX]` | 61218 | `monster/Act8/Merman/Merman.mob` | 召唤怪物时走 monster registry。 |
| `.act [SUMMON MONSTER] [INDEX]` | 61219 | `monster/Act8/MermanMage/MermanMage.mob` | 同一 `.act` 可召唤多个 monster ID。 |
| `.act [SUMMON APC] [INDEX]` | 409 | `aicharacter/swordman/die_swordman/die_swordman.aic` | 召唤 APC 时走 aicharacter registry。 |

## 辅助对照差异提示

| 项 | 辅助对照观察 | 处理方式 |
| --- | ---: | --- |
| PVF 文件总数 | 1052773 | 只说明目标集更大。 |
| `passiveobject/passiveobject.lst` | 15519 entries | 不覆盖主目标 6548 entries。 |
| `passiveobject/` `.obj` | 17393 | 不作为主目标规模。 |
| `actionobject/` `.obj` | 8901 | 只提示对象家族扩张。 |
| `actionobject/map/` `.obj` | 2766 | 只作未来差异复核方向。 |
| `actionobject/spc/` `.obj` | 203 | 与主目标接近，但不替代主目标样本。 |
| `mapobject/` `.obj` | 1955 | 高于主目标，不能反写主目标。 |
| `mapobject/pathgate/` `.obj` | 1176 | 路径门家族明显扩张。 |
| `.map [passive object]` | 4049 | 只说明辅助版本 map 放置更多。 |
| `actionobject [CREATE PASSIVEOBJECT]` | 3044 | 高于主目标。 |
| `mapobject [CREATE PASSIVEOBJECT]` | 4 | 主目标当前为 0，因此只写差异提示。 |
| `actionobject [SUMMON MONSTER]` | 440 | 高于主目标。 |
| `actionobject [SUMMON APC]` | 17 | 高于主目标。 |

## 可复用规则

- 先看父块，再选 registry；不要把数字 ID 当全局 ID。
- 先按 owner 相对路径闭合 `.obj/.act/.atk/.ani`，再判断是否还有资源或 runtime 风险。
- `ActionObject` 与 `MapObject` 目录名只能作为静态路由，不作为实机行为分类。
- `BreakableObject` 同名家族存在于 actionobject 和 mapobject 两层，不能混成一个字段模型。
- `SPC` 样本可按 actionobject 链路处理，但不证明具体技能或特殊效果实机触发。
- 辅助对照只说明另一个目标集存在同类或新增形态；主目标结论必须回主目标 PVF 只读观察。

## 未证明事项

- 不证明对象实际创建、销毁、递归、同步、阵营、生效半径、碰撞、路径阻挡或路径门开关。
- 不证明攻击命中、伤害、元素、异常状态、击退、浮空、血效或 PVP 最终规则。
- 不证明破坏物掉落、任务计数器、机关触发、怪物或 APC 召唤在实机成功。
- 不证明 ANI/TIL/PTL/音效 token 在客户端资源中完整，也不证明 NPK 加载顺序正确。
- 不证明服务端会放行任何静态配置。
