# Formal Region / Town / Worldmap / Area Entry 字段词典

状态：默认可用

本文只记录主目标 PVF 只读观察后可作为 Workbench 默认知识的字段边界。资料库线索用于定向查找，不能绕过主目标观察。

## Registry

| 条目 | 含义 | 解析边界 |
| --- | --- | --- |
| `region/region.lst` | region ID 到 `region/*.rgn` 的注册表。 | 只解析 region 文件；同一数字不能当 town/worldmap/dungeon。 |
| `town/town.lst` | town ID 到 `town/*.twn` 的注册表。 | `region/*.rgn [towns]` 中的数字按此表解析。 |
| `worldmap/worldmap.lst` | worldmap ID 到 `worldmap/*.wdm` 的注册表。 | `town/*.twn` 中 `` `[dungeon gate]` `` 后续数字按此表解析。 |
| `dungeon/dungeon.lst` | dungeon ID 到 `dungeon/*.dgn` 的注册表。 | `worldmap/*.wdm [dungeon]` 和部分 UI 控件绑定数字按此表解析。 |
| `map/map.lst` | map ID 到 `map/*.map` 的注册表。 | 不要把 `town/*.twn [area]` 内观察到的直接地图路径强行解释成 map ID。 |

## `region/*.rgn`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[name]` | region 显示名或说明性名称。 | 静态名称不证明 UI 正常显示。 |
| `[towns]` | 当前 region 包含的 town ID 列表。 | 必须逐项查 `town/town.lst`；缺号是静态风险。 |
| `[minimap]` | 指向 `region/minimap/*.mm` 的小地图文件。 | 只说明 PVF 内部路径引用，不能证明客户端图片或点击层正常。 |

## `region/minimap/*.mm`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[image]` / `[map]` / `[background]` | 区域小地图图像、地图、背景资源 token。 | 静态 token 不证明客户端资源存在或渲染正常。 |
| `[town]` | 小地图上的城镇块，常见子项含 `[index]`、`[area]`、`[real rect]`、`[project rect]`、`[npc]`、`[grid map]`。 | `[index]` 按 town 上下文解析，不按 worldmap/dungeon 猜。 |
| `[world]` | 小地图上的 worldmap 块，常见子项含 `[index]`、`[level]`、`[point]`、`[grid map]`。 | `[index]` 按 worldmap 上下文解析，不按 town/dungeon 猜。 |
| `[npc]` | 小地图 NPC 显示或功能入口线索。 | 不证明 NPC 实机可交互或功能放行。 |

## `town/*.twn`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[entering title]` | 进入城镇时的标题资源或文本入口。 | 不证明客户端标题资源完整。 |
| `[cutscene image]` | 城镇切入图像资源 token。 | 不证明客户端图片存在。 |
| `[dungeon what must be cleared]` | 城镇或区域相关的前置清理/开放条件线索。 | 静态存在不证明服务端放行。 |
| `[only server parsing dungeon what must be cleared]` | 服务端解析倾向的前置清理条件线索。 | 不能用只读 PVF 证明服务端实际执行结果。 |
| `[limit level]` | 城镇或入口层级的等级限制线索。 | 静态等级不证明实机允许进入。 |
| `[area]` | 城镇区域块。主目标样本中第一项是 area 编号，第二项是 `map/` 下直接地图路径。 | 不要把第二项当裸 map ID；仍需确认目标地图文件存在。 |
| `` `[normal]` `` | 普通区域类型。 | 不证明区域可走、NPC 可交互。 |
| `` `[gate]` `` | 城镇间普通 gate 类型，后续常见为坐标/跳转参数。 | 不证明实机传送成功。 |
| `` `[dungeon gate]` `` | 副本入口类型，后续数字按 `worldmap/worldmap.lst` 解析。 | 只证明入口到 worldmap 的静态引用。 |
| `[use private store]` | 城镇区域私商/摆摊相关开关线索。 | 不证明客户端或服务端允许摆摊。 |
| `[safe zone against a]` / `[safe zone against b]` | 观察于战场类城镇的安全区类型线索。 | 不证明 PVP/阵营实机规则。 |

## `map/*.map`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[town movable area]` | 城镇地图内可移动/跳转区域配置。 | 静态配置不证明移动成功。 |
| `[virtual movable area]` | 虚拟移动区域配置。 | 需要实机或更深层脚本验证。 |
| `[visible town minimap]` | 城镇小地图可见层线索。 | 不证明 UI 正常显示。 |
| `[NPC]` / `[passive object]` | 地图内对象放置线索。 | 不证明对象加载、AI、交互或资源完整。 |
| `[sound]` / `[animation]` | 地图声音和动画 token。 | 不证明音频播放或动画渲染。 |

## `worldmap/*.wdm`

| 标签 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `[name]` | worldmap 名称。 | 名称不证明 UI 正常。 |
| `[map image]` | worldmap 图像资源 token。 | 不证明客户端资源完整。 |
| `[ui path]` | 指向 `worldmap/ui/*.ui` 的 UI 文件。 | UI 文件存在不证明客户端渲染和点击正常。 |
| `[dungeon]` | worldmap 下的 dungeon ID 及条件/状态列。 | dungeon 数字按 `dungeon/dungeon.lst` 解析；列语义需上下文验证。 |
| `[in progress]` | 在 `[dungeon]` 内观察到的状态/条件标记。 | 不直接证明任务或开放条件实机生效。 |
| `[hell dungeon]` | 深渊/特殊副本入口线索。 | 不证明实机开放。 |
| `[hell quest]` | 深渊/特殊入口任务条件线索。 | 任务是否可接、可完成需 Quest 主线或实机验证。 |
| `[hell freepass item]` | 深渊/特殊入口门票物品线索。 | 门票扣除和入场成功不能由静态证明。 |
| `[item condition]` | 入场物品条件线索。 | 物品数量、扣除和服务端校验需实机验证。 |

## `worldmap/ui/*.ui`

| 标签或结构 | 观察到的作用 | 风险 |
| --- | --- | --- |
| `background image` / image controls | worldmap UI 背景资源。 | 不证明客户端资源存在或绘制正常。 |
| `balloon` controls | dungeon 按钮或气泡控件；主目标样本中末尾数字可对应 dungeon ID。 | 必须结合 `.wdm [dungeon]` 和 `dungeon/dungeon.lst`，不能单看控件数字。 |
| `switchbox` 等控件 | UI 状态/条件/显示控制线索。 | 不强行解释所有列，不证明 UI 逻辑正常。 |

## 关键边界

- `7` 在不同 registry 中可以分别是 town、worldmap、dungeon 等不同对象。
- registry `entryCount` 不是合法 ID 上限；worldmap `100`、dungeon `11000` 这类高 ID 在主目标样本中可合法解析。
- 未注册文件存在不等于可用；注册文件存在也不等于实机加载成功。
- 辅助对照只提示形态扩展，不覆盖主目标结论。
