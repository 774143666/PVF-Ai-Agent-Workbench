# Region / Town / Worldmap / Area Entry 文件类型

状态：默认可用

本文解释正式区域、城镇、worldmap 和入口区域相关文件是什么、如何路由、哪些地方必须验证。

## 是什么

`region`、`town`、`worldmap` 和城镇 `map` 共同组成“从大区域到城镇，再到 worldmap，再到 dungeon”的静态入口链：

- `region/*.rgn`：区域定义，列出 town，引用区域 minimap。
- `region/minimap/*.mm`：区域小地图、城镇点、worldmap 点和 NPC 显示层线索。
- `town/*.twn`：城镇定义，列出城镇区域、地图路径、普通 gate 和 dungeon gate。
- `worldmap/*.wdm`：worldmap 定义，列出 dungeon、UI 文件、入场条件线索。
- `worldmap/ui/*.ui`：worldmap UI 控件层，含背景、按钮、气泡、状态控件等。
- `map/*.map`：实际城镇地图或副本房间地图，其中可包含城镇移动区域、NPC、对象、声音、动画。

## 常见 registry

| Registry | 解析对象 |
| --- | --- |
| `region/region.lst` | region ID -> `region/*.rgn` |
| `town/town.lst` | town ID -> `town/*.twn` |
| `worldmap/worldmap.lst` | worldmap ID -> `worldmap/*.wdm` |
| `dungeon/dungeon.lst` | dungeon ID -> `dungeon/*.dgn` |
| `map/map.lst` | map ID -> `map/*.map`，但 `town/*.twn [area]` 的直接路径不要强行当作 map ID。 |

## 典型路由

1. `region/region.lst` 找到 `region/*.rgn`。
2. `.rgn [towns]` 中的数字按 `town/town.lst` 找到 `town/*.twn`。
3. `.rgn [minimap]` 找到 `region/minimap/*.mm`。
4. `.twn [area]` 找到城镇区域和 `map/` 下直接地图路径。
5. `.twn [area]` 内出现 `` `[dungeon gate]` `` 时，后续数字按 `worldmap/worldmap.lst` 找到 `.wdm`。
6. `.wdm [dungeon]` 中的 dungeon 数字按 `dungeon/dungeon.lst` 找到 `.dgn`。
7. `.wdm [ui path]` 找到 `worldmap/ui/*.ui`，再结合 UI 控件核查按钮或气泡绑定。
8. 城镇 `map/*.map` 内的 `[town movable area]`、`[virtual movable area]` 说明地图内移动区配置。

## 常见误区

- 不要把裸数字当全局 ID。
- 不要把 `region/region.lst` 条目数当 region ID 最大值。
- 不要把 `worldmap/worldmap.lst` 条目数当 worldmap ID 或 dungeon ID 最大值。
- 不要用辅助对照 PVF 的新增 town ID 补主目标缺号。
- 不要把未注册 `.rgn/.twn/.wdm` 文件写成可用入口。
- 不要把 `.ui` 文件存在写成客户端 UI 正常。

## 必须验证的地方

静态只读只能证明 PVF 内部引用链存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 城镇是否出现在客户端 UI。
- worldmap 按钮是否可点击。
- dungeon gate 是否真实能进图。
- 等级、任务、门票、物品条件是否服务端放行。
- 地图、UI、动画、音频资源是否完整加载。
- 副本刷怪、清算、翻牌、奖励、掉落是否成功。
