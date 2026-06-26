# Content Lifecycle / Dungeon Full Lifecycle Boundary

状态：默认可用

用途：把已封存的入口、Dungeon、Quest Ticket、Monster、PassiveObject、Clear Reward、Client UI、Client Assets 和 Audio 结论压缩成一条可复核的副本静态生命周期边界。本文不重开各领域大账本。

## 主目标代表链路

| 层 | 主目标只读确认 | 边界 |
| --- | --- | --- |
| Region | `region/region.lst` 中 ID `1 -> Arad.rgn`；`Arad.rgn [towns]` 包含 `3`。 | 只证明 region 到 town 的静态引用。 |
| Town | `town/town.lst` 中 ID `3 -> WestCoast.twn`；`WestCoast.twn` 的 area `3` 和 `5` 均有 `[dungeon gate] 3`。 | `[dungeon gate] 3` 按 worldmap registry，不按 dungeon registry。 |
| Worldmap | `worldmap/worldmap.lst` 中 ID `3 -> SkyCastle.wdm`；`SkyCastle.wdm [dungeon]` 包含 `11`，`[ui path]` 指向 `WorldMap/UI/SkyCastle.ui`。 | 静态 worldmap 不证明按钮可点或条件满足。 |
| Dungeon | `dungeon/dungeon.lst` 中 ID `11 -> Act2/DraconianTower.dgn`；文件可读，名称 `龙人之塔`。 | registry 和文件存在不证明实机可进。 |
| Dungeon fields | `DraconianTower.dgn` 可见 `[minimum required level] 16`、`[basis level] 19`、`[experience increasing point]`、`[champion]`、`[pathgate object] 401-410`。 | 等级、经验、champion、路径门均为静态配置。 |
| Map selection | `DraconianTower.dgn [map specification]` 第三列含 `1602` 等 map ID；quest connection 分支里 `[boss map specification]` 第三列为 `1619`。 | map ID 必须按 `map/map.lst` 解析。 |
| Map files | `1602 -> (1,0)n1826.map` 为 `[normal]`；`1619 -> (0,2)gsdBoss.map` 为 `[boss]`；两者均有 `[dungeon] 11`。 | map 反向归属只证明静态闭合。 |
| Spawn | 代表 map 可见 `[monster]`、`[monster specific AI]`、`[event monster position]`。 | 不证明怪物刷出、AI 正常或事件怪物生成。 |
| Monster | `50/51/70/71/72/61726` 均按 monster registry 命中；已读 `50`、`51`、`71` `.mob`，观察到 motion、attack info、基础属性字段。 | `.mob` 是入口层，不证明命中、伤害或掉落。 |
| Map object | `1044/240/238/801/1045/235/1035/401` 均按 passiveobject registry 命中；已读多个 `.obj`，观察到 basic motion、etc motion、string data、int data、destroy particle。 | 地图对象存在不证明破坏、机关、路径门或碰撞成功。 |
| Ticket side sample | 代表副本未观察到 `[required item]`；`KingsRuins.dgn` 作为门票侧样本有 `[required item] 3340 1 1`，`3340` 解析为 stackable 材料。 | 侧样本只说明门票字段读法，不属于 DragonianTower 入场条件。 |
| Clear reward | `etc/itemdropinfo_clearreward.etc` 可见 `[drop prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]`。 | 不证明概率、翻牌 UI、扣费或奖励发放。 |
| UI | `SkyCastle.ui` 含 image、balloon、switchbox 控件；balloon 末列可见 dungeon 样 ID `11/12/13/14/15/17/504`。 | 控件存在不证明 UI 可点或客户端资源完整。 |
| Resource / Audio | `.dgn/.map/.ui/.obj` 引用 `.img/.ani/.act/.til/.ptl` 和声音 token。 | Script 侧引用不证明 ImagePacks2/NPK/SoundPacks/Music 完整。 |

## 辅助对照差异提示

| 项 | 辅助对照只读提示 | 处理 |
| --- | --- | --- |
| 总规模 | 辅助 PVF 文件数、region/town/worldmap/dungeon/map/monster/passiveobject/stackable/independentdrop registry 均大于主目标。 | 只提示目标集更大，不覆盖主目标规模。 |
| 同 ID 路由 | worldmap `3`、dungeon `11`、map `1602/1619`、monster `50/51/71`、passiveobject `1044/240/238` 均命中同类路径。 | 说明同链路同形存在，不代表字段值相同。 |
| `SkyCastle.wdm` | 辅助同路径不含 dungeon `504`，但多 hell/freepass/item condition 线索。 | 只作版本差异提示。 |
| `DraconianTower.dgn` | 辅助多 `[special passive object item]`、seal door、hell dungeon 等线索，experience increasing point 与主目标不同。 | 不能反写主目标。 |
| `1602` map | 辅助同路径多 `../common/mapcover.ani`。 | 只提示资源引用差异。 |
| `SkyCastle.ui` | 辅助 switchbox 列值不同。 | UI 控件差异不证明实机表现。 |

## 可复用检查表

1. 入口：region/town/worldmap/dungeon gate 是否按 registry 分层闭合。
2. Dungeon：`.dgn` 是否注册、可读、含基础字段、map specification 和 start/boss map。
3. Ticket：目标 `.dgn` 是否真的有 `[required item]`；没有就写无，不套其他副本。
4. Map：map ID 是否按 `map/map.lst` 解析，`.map [dungeon]` 是否反向闭合。
5. Spawn：`.map [monster]` 首列是否按 monster registry 解析。
6. Monster：`.mob` 是否继续给出 motion、attack info、AI 或其他入口；不要停在 map 出生行。
7. Object：`.map [passive object]` / `[special passive object]` 首列是否按 passiveobject registry 解析，再读 `.obj`。
8. Reward：普通掉落、任务奖励、独立掉落、清算翻牌和 dungeon 局部结果卡必须分层，不混用。
9. UI/resource/audio：只记录引用路径和 token，资源完整性交给客户端/资源主线或实机验证。
10. 风险：任何静态完整链都不能写成实机成功。

## 主边界结论

- 本主线证明“主目标中存在一条可观察的副本静态配置链”，不是证明“副本可运行”。
- `DraconianTower` 是入口、map、monster、mapobject、UI 和音频引用的代表样本；门票字段需用另一个带 `[required item]` 的副本作侧样本。
- 辅助对照可提示同链路扩展和字段差异，但主目标事实必须以主目标 PVF 为准。
- 后续做新副本、移植或修复时，先用本检查表验静态链，再进入受控写入或实机验证流程。
