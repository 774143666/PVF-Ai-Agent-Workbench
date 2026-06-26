# Formal Region / Town / Worldmap / Area Entry 只读核查

状态：默认可用

用途：用于复核正式区域、城镇、worldmap、副本入口和城镇地图移动入口的静态配置链。该入口只回答“配置链如何接上、数字 ID 应按哪个 registry 解析、哪些地方有静态风险”，不证明实机能进图、UI 正常、客户端资源完整或服务端放行。

## 默认读法

1. 先读 `safety/README.zh-CN.md`，确认当前任务是只读知识核查，不写 PVF、不改客户端。
2. 再读 `dictionaries/formal-region-town-worldmap-area-entry-fields.zh-CN.md`，确认字段和标签的上下文。
3. 需要矩阵结论时读 `indexes/formal-region-town-worldmap-area-entry-boundary.zh-CN.md`。
4. 需要文件类型解释时读 `encyclopedia/pvf-file-types/region-town-worldmap-area-entry.zh-CN.md`。
5. 如果任务扩展到副本房间、刷怪、掉落、清算、地图对象或客户端资源，再转读已经封存的 Dungeon / Map / Spawn / Entry / Clear / Resource、Client Assets、Audio 等对应主线。

## 核查顺序

1. 资料库、教程、社区说明、工具字段只能先做定向线索；字段结论必须回到主目标 PVF 只读观察。
2. `region/region.lst` 解析 region ID；不要把 region ID 当 town/worldmap/dungeon ID。
3. `region/*.rgn` 的 `[towns]` 逐项按 `town/town.lst` 解析；缺号只能记为静态风险。
4. `town/town.lst` 解析 town ID；`town/*.twn` 的 `[area]` 先看地图路径和区域类型。
5. `town/*.twn` 的 `` `[dungeon gate]` `` 后续数字按 `worldmap/worldmap.lst` 解析。
6. `worldmap/worldmap.lst` 解析 worldmap ID；`worldmap/*.wdm` 的 `[dungeon]` 内副本数字按 `dungeon/dungeon.lst` 解析。
7. `worldmap/*.wdm` 的 `[ui path]` 指向 `worldmap/ui/*.ui`；UI 控件里的 dungeon 绑定要和 `.wdm [dungeon]` 分层核查。
8. `region/minimap/*.mm` 只作为区域/城镇/worldmap 显示与点击层线索；其中的 `[town]`、`[world]` 数字仍要按父块上下文解析。
9. `map/*.map` 的 `[town movable area]`、`[virtual movable area]` 只说明城镇地图内移动/跳转配置存在，不证明实机移动成功。

## 可接受结论

- 可以说某个 ID 在某个 registry 内解析到哪个 PVF 内部路径。
- 可以说主目标中某个注册项存在、缺失、未注册、未被观察到 town gate 引用。
- 可以说 `town/*.twn [area]` 的地图入口在观察样本中是直接地图路径，不是裸 `map/map.lst` ID。
- 可以说同一个数字在 region、town、worldmap、dungeon 中含义不同，必须按父块和 registry 解析。

## 禁止结论

- 不把静态入口链写成实机能进图。
- 不把 `.wdm [ui path]` 或 `.ui` 控件写成 UI 正常显示。
- 不把地图路径、图片路径、音频 token 写成客户端资源完整。
- 不把 `[limit level]`、清图前置、任务/物品条件写成服务端放行。
- 不把辅助对照 PVF 独有扩展提升为主目标事实。

## 验收提示

本主线封存后，日常问到“新城镇怎么接入口”“某数字是 worldmap 还是 dungeon”“为什么静态有入口但进不去图”等问题，优先从本 task-card 进入，再按具体子问题转到 dungeon、map、client assets 或 quest/drop 相关封存主线。
