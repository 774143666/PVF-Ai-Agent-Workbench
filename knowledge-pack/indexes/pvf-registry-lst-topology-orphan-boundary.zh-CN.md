# PVF Registry / LST Topology / Orphan Boundary

状态：默认可用

用途：记录主目标 PVF 的 `.lst` 拓扑、文件路径 registry、名称/数值表、路径存在性、重复路径、跨 registry 数字 ID 风险、未注册文件和辅助差异。本文不授权写 PVF。

## 审计快照

| 项 | 主目标静态结论 |
| --- | ---: |
| PVF 文件总数 | 402963 |
| `.lst` 文件 | 83 |
| `.lst` 读取失败 | 0 |
| 文件路径 registry | 62 |
| 名称/数值表 | 19 |
| 空 `.lst` | 2 |
| 文件路径 registry 注册项 | 102778 |
| 唯一注册路径 | 100491 |
| 注册路径存在 | 102361 |
| 注册路径缺失 | 417 |
| 有缺失的文件路径 registry | 10 |
| 文件路径 registry 内重复 ID | 0 |
| 有重复路径的文件路径 registry | 8 |
| 跨文件路径 registry 重复数字 ID | 6255 |
| 跨文件路径 registry 重复路径 | 1329 |
| 未被文件路径 registry 注册的文件 | 302882 |

## 最大文件路径 registry

| registry | 注册项 | 缺失 | 重复路径组 | 口径 |
| --- | ---: | ---: | ---: | --- |
| `equipment/equipment.lst` | 72631 | 0 | 96 | 装备、时装、宠物装备等装备系文件入口 |
| `stackable/stackable.lst` | 10372 | 0 | 55 | 消耗品、材料、礼包、箱子等入口 |
| `passiveobject/passiveobject.lst` | 6548 | 0 | 62 | 被动对象 `.obj` 入口 |
| `map/map.lst` | 2378 | 0 | 0 | 地图 `.map` 入口 |
| `n_quest/quest.lst` | 2157 | 0 | 0 | 普通任务 `.qst` 入口 |
| `monster/monster.lst` | 1945 | 0 | 0 | 怪物 `.mob` 入口 |
| `aicharacter/aicharacter.lst` | 616 | 0 | 0 | APC / AI 角色入口 |
| `creature/creature.lst` | 451 | 0 | 2 | 宠物 `.cre` 入口 |
| `dungeon/dungeon.lst` | 324 | 0 | 0 | 副本 `.dgn` 入口 |

## 注册路径缺失矩阵

| registry | 注册项 | 缺失 | 说明 |
| --- | ---: | ---: | --- |
| `map/map.jpn.lst` | 862 | 318 | 跨语言/历史地图表，缺失集中在旧地图路径 |
| `passiveobject/old passiveobject.lst` | 656 | 52 | 旧 passiveobject 表，含历史路径 |
| `etc/randomoption/randomoptionskill.lst` | 20 | 20 | 指向 `Options/RandomOptions_*.etc`，主目标未命中 |
| `passiveobject/passiveobject.jpn.lst` | 815 | 10 | 跨语言 passiveobject 表，少量历史路径缺失 |
| `dungeon/dungeon.jpn.lst` | 30 | 6 | 跨语言副本表，旧副本路径缺失 |
| `stagemap/stagemap.jpn.lst` | 5 | 5 | 跨语言阶段地图表，未命中 `.wdm` |
| `npc/npc.jpn.lst` | 35 | 2 | 跨语言 NPC 表，少量旧 NPC 缺失 |
| `worldmap/worldmap.jpn.lst` | 5 | 2 | 跨语言世界图表，少量 `.wdm` 缺失 |
| `cashshop/cashshop.lst` | 5 | 1 | `cashshop/Avagacha.shp` 未命中 |
| `town/town.jpn.lst` | 4 | 1 | `town/HendonMyre.jpn.twn` 未命中 |

处理口径：这些是静态路径缺失，不自动等于当前玩法断链。优先把 `.jpn`、`old`、历史表作为风险桶；真正生产改动时只按目标字段所在 registry 解析。

## 名称/数值表边界

| 表 | 注册项 | 口径 |
| --- | ---: | --- |
| `itemname.lst` | 10694 | ID 到名称/文本，不是文件路径 registry |
| `passiveobjectname.lst` | 983 | ID 到名称/文本，不是文件路径 registry |
| `n_quest/epicquest.lst` | 313 | 任务组/数值表，不是 `.qst` 文件 registry |
| `monstername.lst` | 254 | ID 到名称/文本，不是 `.mob` 文件 registry |
| `skillname*.lst` | 多表 | 技能名称表，不是 `.skl` 文件 registry |
| `aicharactername.lst`、`npcname.lst` | 小表 | 名称表，不是 `.aic` / `.npc` 文件 registry |

边界：名称/数值表里的反引号内容可能是中文、乱码形态文本、数字串或组合值，不能拿来做路径存在性判断。

## 重复路径与跨 registry ID 风险

| 类型 | 主目标观察 | 结论 |
| --- | ---: | --- |
| 文件路径 registry 内重复 ID | 0 | 同一 registry 内 ID 唯一，适合按 registry 精确解析 |
| 文件路径 registry 内重复路径 | 8 个 registry | 多个 ID 可复用同一文件路径 |
| 跨文件路径 registry 重复数字 ID | 6255 | 裸数字没有全局语义 |
| 跨文件路径 registry 重复路径 | 1329 | 常见于 `.jpn` 与主表、旧表与主表、资源复用 |

典型风险：

- 数字 `500` 可同时出现在 APC、appendage、副本、怪物、passiveobject 等 registry。
- 数字 `601` 可同时出现在 APC、map、monster、passiveobject 等 registry。
- 同一 passiveobject 文件可由多个 ID 指向，例如地图对象和 fairy 类对象。
- 同一装备或 stackable 文件可由多个 ID 指向，不能只看路径反推唯一 ID。

## 未注册文件边界

主目标有 302882 个文件未被文件路径 registry 直接注册。最多的扩展名：

| 扩展名 | 未注册数 | 边界 |
| --- | ---: | --- |
| `.ani` | 236510 | 动画帧/动作链资源，常由 `.act`、`.als`、`.obj`、`.mob` 等间接引用 |
| `.act` | 18750 | 动作文件，常由角色、怪物、PO 或 AI 链引用 |
| `.ai` | 7518 | AI 脚本/行为文件，常由 `.mob` 或 `.aic` 引用 |
| `.equ` | 7396 | 未注册装备文件或资源层候选，不自动等于可用装备 |
| `.key` | 6928 | key stream / 动作控制资源 |
| `.atk` | 6608 | 攻击信息文件，常由动作链引用 |
| `.til` | 4711 | tile 资源 |
| `.ptl` | 4386 | particle 资源 |
| `.als` | 4153 | animation list 资源 |
| `.qst` | 1822 | 未注册任务文件；不能默认可接 |

处理口径：

- 未注册文件是“未被 `.lst` 直接挂载”，不是“没有引用”。
- 判断孤儿必须继续做路径引用链、资源链、脚本链或客户端链检查。
- 本主线只给出 orphan boundary，不给出删除授权。

## 辅助对照提示

| 项 | 主目标 | 辅助对照 | 差异提示 |
| --- | ---: | ---: | --- |
| PVF 文件总数 | 402963 | 1052773 | 辅助体量更大 |
| 文件路径 registry | 62 | 63 | 辅助多 1 个 |
| 文件路径 registry 注册项 | 102778 | 165282 | 辅助多 62504 |
| 注册路径缺失 | 417 | 410 | 缺失规模接近 |

辅助对照只能提示跨版本差异；主目标事实仍以主目标只读观察为准。

## 静态与动态边界

静态只读可以确认：

- `.lst` 文件是否可读。
- `.lst` 是否更像文件路径 registry、名称/数值表或空表。
- 文件路径 registry 内 ID、路径、缺失和重复。
- 跨 registry 数字 ID 冲突风险。
- 未注册文件的数量、扩展名和顶层目录分布。

静态只读不能确认：

- 实机加载、UI 显示、怪物 AI、任务计数器、技能命中、攻击伤害、音频播放或客户端资源完整。
- 服务端是否放行。
- 未注册文件是否可删除。
- 辅助对照独有 registry 或路径是否适用于主目标。
