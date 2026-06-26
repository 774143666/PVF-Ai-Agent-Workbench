# Formal Region / Town / Worldmap / Area Entry Boundary

状态：默认可用

本文封存正式区域、城镇、worldmap、入口区域和城镇地图移动入口的静态只读边界。结论先用资料库线索定向，再经主目标 PVF 只读观察确认；辅助对照只记录差异提示。

## 主目标范围矩阵

| 层 | 主目标观察 | 结论 |
| --- | --- | --- |
| `region/region.lst` | 3 个注册 region：`1 Arad.rgn`、`2 Heaven.rgn`、`4 Shonan.rgn`。 | region ID 稀疏，不能按连续自然数推断。 |
| `region/*.rgn` | 注册的 3 个 `.rgn` 可读；另观察到未注册 `region/warfare.rgn`。 | 未注册文件存在只能记为静态线索，不能写成可用 region。 |
| `region/*.rgn [towns]` | `Arad` 引用 town 1/2/3/4/5；`Heaven` 引用 6/9/14；`Shonan` 引用 11/12/13；未注册 `Warfare` 引用 7。 | `[towns]` 数字按 `town/town.lst` 解析；主目标中 town ID 14 未注册，是静态缺号风险。 |
| `region/minimap/*.mm` | 观察到 `arad.mm`、`heaven.mm`、`shonan.mm`、`warfare.mm`；`[town]` 命中 4 个文件，`[world]` 命中 3 个文件。 | minimap 是显示/入口层线索；`warfare.mm` 与未注册 `warfare.rgn` 只能作为静态旁路线索。 |
| `town/town.lst` | 13 个注册 town，ID 1-13。 | town registry 与 region/worldmap/dungeon 分离。 |
| `town/*.twn` | 13 个注册 town 文件可读；10 个注册 `.twn` 命中 `` `[dungeon gate]` ``；共观察 23 个 dungeon gate 区域。 | town area 是城镇入口核心；dungeon gate 后续数字按 worldmap 解析。 |
| `town/*.twn [limit level]` | 12 个注册 `.twn` 命中 `[limit level]`；`GuildAgit` 未观察到该标签。 | 等级字段是静态入场线索，不证明服务端放行。 |
| `worldmap/worldmap.lst` | 20 个注册 worldmap，含 ID 100 `Towers.wdm`。 | worldmap ID 可稀疏和高值，不能用条目数推断合法范围。 |
| `town/*.twn` 到 worldmap | 23 个 dungeon gate 引用 19 个唯一 worldmap ID：1-18 和 100；均可在 `worldmap/worldmap.lst` 解析。 | 主目标中 registered town gate 覆盖 19 个 worldmap；`PowerStation.wdm` ID 19 注册但未在观察到的 town gate 中出现。 |
| `worldmap/*.wdm` | 20 个注册 `.wdm` 均命中 `[dungeon]` 和 `[ui path]`；12 个命中 `[hell quest]` 和 `[item condition]`。 | `.wdm` 同时连接 dungeon 列表、UI 文件和入场条件线索。 |
| `worldmap/PowerStation.wdm` | 注册为 worldmap ID 19；`[dungeon]` 块为空，但有 hell/item 条件线索。 | 这是静态部分配置/旁路风险，不能推断常规入口可用。 |
| `worldmap/Towers.wdm` | 注册为 worldmap ID 100；`[dungeon]` 中含 dungeon 11000、11001、20026、11006、11007、323 等高 ID。 | dungeon ID 可远大于 `dungeon/dungeon.lst` 条目数；必须按 registry 解析。 |
| `worldmap/ui/*.ui` | `SkyCastle.ui` 样本中 balloon 控件末尾数字可对应 dungeon 11/12/13/14/17/15/504。 | UI 控件 dungeon 绑定和 `.wdm [dungeon]` 是相邻但分层的配置。 |
| `map/*.map` | `map/` 中 `[town movable area]` 命中 88 个文件；`[visible town minimap]` 命中 3 个文件。 | 城镇地图移动区存在广泛配置，但静态不证明实机移动成功。 |

## 主目标入口链

| 链路 | 解析规则 | 静态边界 |
| --- | --- | --- |
| Region 到 Town | `region/region.lst -> region/*.rgn [towns] -> town/town.lst` | `[towns]` 缺号只记风险，不补猜。 |
| Region 到 Minimap | `region/*.rgn [minimap] -> region/minimap/*.mm` | `.mm` 仅说明显示/点击层配置。 |
| Town 到 Map | `town/town.lst -> town/*.twn [area] -> map/<直接路径>` | 主目标样本中 `[area]` 第二项是直接 map 路径，不是裸 `map/map.lst` ID。 |
| Town 到 Worldmap | `town/*.twn [area] -> `` `[dungeon gate]` `` -> worldmap/worldmap.lst` | dungeon gate 数字按 worldmap registry，不按 dungeon registry。 |
| Worldmap 到 Dungeon | `worldmap/worldmap.lst -> worldmap/*.wdm [dungeon] -> dungeon/dungeon.lst` | `[dungeon]` 后的副本数字按 dungeon registry；条件列不强行解释。 |
| Worldmap 到 UI | `worldmap/*.wdm [ui path] -> worldmap/ui/*.ui` | UI 文件和控件存在不证明客户端显示或点击正常。 |
| UI 到 Dungeon | `worldmap/ui/*.ui` balloon/control 末尾 dungeon 数字 -> `dungeon/dungeon.lst` | 需要和 `.wdm [dungeon]` 分层核查，不能只看 UI 数字。 |
| Map 内移动 | `town/*.twn [area]` 指向 `map/*.map`，再读 `[town movable area]` / `[virtual movable area]` | 只证明移动区配置存在，不证明传送成功。 |

## 主目标关键样本

| 样本 | 只读确认 | 用途 |
| --- | --- | --- |
| `region/heaven.rgn` | `[towns]` 包含 6、9、14；主目标 `town/town.lst` 中 ID 14 未注册。 | 证明 `[towns]` 必须逐项解析，缺号不能靠名字或辅助 PVF 补齐。 |
| `region/warfare.rgn` | 文件存在且 `[towns]` 指向 7，但不在 `region/region.lst` 注册。 | 证明未注册文件不能直接当可用入口。 |
| `town/HendonMyre.twn` | 多个 `[area]`，含普通区域、gate、dungeon gate；dungeon gate 指向 worldmap 2、7、8、14 等。 | 证明一个 town 可挂多个 worldmap 入口。 |
| `town/WestCoast.twn` | dungeon gate 指向 worldmap 3、4、9、10、100 等。 | 证明 worldmap ID 100 可由 town gate 引用。 |
| `worldmap/SkyCastle.wdm` | `[dungeon]` 含 dungeon 11、12、13、14、15、17、504 及若干 `[in progress]` 条目；`[ui path]` 指向 UI。 | 证明 `.wdm` 是 worldmap 到 dungeon 和 UI 的中间层。 |
| `worldmap/UI/SkyCastle.ui` | balloon 控件末尾数字对应 dungeon 11、12、13、14、17、15、504。 | 证明 UI 控件与 `.wdm [dungeon]` 需要共同核查。 |
| `worldmap/PowerStation.wdm` | worldmap ID 19 注册；常规 `[dungeon]` 空；未在 registered town gate 样本中出现。 | 证明注册存在不等于常规入口完整。 |
| `worldmap/Towers.wdm` | worldmap ID 100；高 dungeon ID 可解析到 `dungeon/dungeon.lst` 条目。 | 证明 registry 条目数不是 ID 上限。 |

## 跨 registry 数字风险

| 数字 | 正确 registry 上下文 | 主目标观察 |
| --- | --- | --- |
| `7` | `town/town.lst`、`worldmap/worldmap.lst`、`dungeon/dungeon.lst` 各自独立。 | 可分别指向 town `Warfare.twn`、worldmap `NorthMyre.wdm`、dungeon `Act1/GrakKarak.dgn`。 |
| `14` | 在 `worldmap/worldmap.lst` 可解析；在主目标 `town/town.lst` 不存在。 | `region/heaven.rgn [towns]` 中的 14 是 town 缺号风险，不可拿 worldmap 14 补。 |
| `3` | 在 `worldmap/worldmap.lst` 可解析；在主目标 `region/region.lst` 不存在。 | region ID 稀疏，不能按数字外形推断。 |
| `100` | 在 `worldmap/worldmap.lst` 可解析为 Towers；不是 town ID。 | 可从 town gate 指向 worldmap 100。 |
| `504` | 在 `dungeon/dungeon.lst` 可解析为 dungeon。 | `SkyCastle.wdm` 和 UI 样本中作为 dungeon 绑定出现。 |

## 辅助对照差异提示

辅助对照 PVF 只提示“同类链路在更大范围目标集中会扩展”，不覆盖主目标事实：

| 项 | 辅助对照提示 |
| --- | --- |
| registry 数量 | `region/region.lst` 为 13、`town/town.lst` 为 40、`worldmap/worldmap.lst` 为 54，明显大于主目标。 |
| region | 辅助对照 `[towns]` 命中 13 个 region 文件；主目标只封存主目标自己的 3 个注册 region 和 1 个未注册旁路。 |
| town gate | 辅助对照 town 中 `` `[dungeon gate]` `` 命中 38 个文件；主目标 registered town 样本为 10 个文件、23 个 dungeon gate 区域。 |
| worldmap | 辅助对照 54 个 `.wdm` 均命中 `[dungeon]` 和 `[ui path]`。 |
| ID 14 | 辅助对照 `town/town.lst` 中 ID 14 可解析；主目标中 ID 14 不存在，所以主目标仍记缺号风险。 |

## 静态不能证明

- 不能证明城镇按钮、worldmap UI、气泡、点击区域、地图移动区实机可用。
- 不能证明入场等级、任务、门票、物品条件、深渊条件被服务端放行。
- 不能证明客户端 `ImagePacks2`、UI 图像、地图 tile、动画、声音资源完整。
- 不能证明副本可进入、怪物刷新、清图、翻牌、掉落、奖励结算成功。
- 不能把辅助对照里的新增 region/town/worldmap 当主目标已有功能。

## 后续工作入口

- 要做新区域或新城镇：先复核本链路，再转 Dungeon / Map / Client Assets / Audio。
- 要做新副本入口：本链路只处理入口层，副本内部仍走 Dungeon / Map / Spawn / Entry / Clear / Resource Boundary。
- 要解释入场条件、任务门票或翻牌：转 Quest / Type / Reward / Drop / Ticket Boundary 或后续 Clear Reward / Card Flip 主线。
