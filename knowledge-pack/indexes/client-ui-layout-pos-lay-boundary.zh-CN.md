# Client UI Layout / `.ui` / `.pos` / `.lay` 静态边界索引

状态：已完成静态只读封存

用途：作为 UI 布局语义的短入口。需要判断 UI 字段、坐标、控件、`.pos` 或 `.lay` 时，先读本文。

## 覆盖结论

| 主题 | 主目标结论 | 边界 |
| --- | --- | --- |
| `.ui` 文件族 | 主目标 301 个；脚本型 UI 描述。 | 不证明客户端资源完整、窗口显示、按钮可点或事件生效。 |
| `.pos` 文件族 | 主目标 0 个。 | 不能把辅助对照 `.pos` 写成主目标事实。 |
| `.lay` 文件族 | 主目标 10 个，均在 `equipment/character/`。 | `%s` 模板不是具体 ANI 路径；不证明动作播放或层级显示正常。 |
| worldmap UI | `.wdm [ui path]` 指向 `worldmap/ui/*.ui`；`.ui` 中有 image、balloon、switchbox、common action。 | dungeon 数字按 `dungeon/dungeon.lst`；按钮可点、入场、资源完整需实机/客户端验证。 |
| 普通窗口 UI | `ui/event/bingo/bingopopupwindow.ui` 可见 `[window]`、对齐、距离、大小、标题、控件集合、父子关系、选项块。 | 活动开启、领取礼物、URL、按钮响应和服务端奖励都不能静态证明。 |
| 背包/列表 UI | `ui/inventory/inventory_item.ui` 可见 tab、radio、grid、tooltip、子 UI 路径。 | 背包容量、分页、拖拽、tooltip 显示和物品移动不能静态证明。 |
| gauge/tree | `ui/characterinfowindow/favorinfo.ui` 可见 tree、gauge。 | 不证明数值刷新或客户端绘制。 |
| 技能树坐标 | `clientonly/skilltree/swordman_sp.co` 可见 `[icon pos]` 和 `[next skill]`。 | 不证明技能学习、SP/TP 足够、UI 点击或服务端放行。 |

## 主目标可复核样本

| 复核目的 | 样本 |
| --- | --- |
| worldmap 到 UI 路由 | `worldmap/granfloris.wdm` -> `WorldMap/UI/GranFloris.ui` |
| worldmap 按钮/气泡控件 | `worldmap/ui/granfloris.ui` |
| worldmap 公共按钮/文本 | `worldmap/ui/common/common.ui` |
| 活动弹窗窗口结构 | `ui/event/bingo/bingopopupwindow.ui` |
| 生产/增幅选择 UI | `ui/amplify/amplifyselectwindow.ui` |
| 背包 grid/tab/tooltip | `ui/inventory/inventory_item.ui`、`ui/inventory/inventory_item_control_group.ui` |
| gauge/tree 控件 | `ui/characterinfowindow/favorinfo.ui` |
| UI 类型展示样本 | `ui/test/testbutton.ui` |
| 角色 motion 层模板 | `equipment/character/swordman.lay` |
| 技能树显示坐标 | `clientonly/skilltree/swordman_sp.co` |

## 定向搜索结果

| 搜索范围 | 关键词 | 主目标命中 |
| --- | --- | --- |
| `ui/` | `[window]` | 119 |
| `ui/` | `[parent]` | 50 |
| `ui/` | `[int option]` | 21 |
| `ui/` | `[user option]` | 13 |
| `ui/` | `` `[grid]` `` | 11 |
| `ui/` | `` `[gauge]` `` | 16 |
| `ui/` | `[window pos]` | 0 |
| `worldmap/ui/` | `[window]` | 0 |

## ID 与数值边界

| 数字所在上下文 | 当前处理 |
| --- | --- |
| `worldmap/granfloris.wdm [dungeon]` 的 `3`、`503`、`1000` | 已按 `dungeon/dungeon.lst` 解析，分别指向 `dungeon/Act1/MirkWood.dgn`、`dungeon/quest/deadmoon.dgn`、`dungeon/Act1/SunderLandDark.dgn`。 |
| `worldmap/ui/granfloris.ui` 的 balloon 末列 `3`、`4`、`5`、`1000` 等 | 只在 worldmap UI 语境中作为 dungeon 绑定线索，需回 `.wdm [dungeon]` 和 `dungeon/dungeon.lst`。 |
| `clientonly/skilltree/swordman_sp.co [index] 173` | 已按 `skill/swordmanskill.lst` 解析为 `skill/Swordman/ArmorMasteryHeavy.skl`；没有通用 `skill/skill.lst`。 |
| `.ui` 内坐标、帧号、控件名、tab 序号、grid cell 数字、颜色数字 | 不当 registry ID；只按父控件字段记录。 |

## 辅助差异提示

| 文件族 / 样本 | 辅助对照提示 | 主目标结论 |
| --- | --- | --- |
| `.ui` | 辅助 346 个。 | 主目标仍以 301 个为准。 |
| `.pos` | 辅助 7 个，集中在 `ui/japan/...`。样本含 `[MAIN]`、`[TILETYPE]`、`[POS]`、`[UNITNUMBER]`、`[UIDATA]`。 | 主目标 `.pos` 为 0。 |
| `.lay` | 辅助 12 个，多出 `atpriest`、`atswordman` 等角色。 | 主目标仍为 10 个。 |
| `worldmap/ui/granfloris.ui` | 同名结构相近，文件长度略不同。 | 只能提示版本差异。 |
| `ui/amplify/amplifyselectwindow.ui` | 同名结构相近，但文本写法有差异。 | 不覆盖主目标 StringLink 样文本观察。 |

## 使用建议

1. 查“某 UI 有没有控件”：读对应 `.ui`，记录 `[ui controls]` 类型、名称、坐标、资源路径、父子关系。
2. 查“某按钮能不能点”：静态只能确认按钮描述；必须进入客户端或实机验证。
3. 查“某数字是不是 ID”：先看父块和文件族，只有 `.wdm [dungeon]`、技能树 `[index]` 等明确语境才解析 registry。
4. 查“资源是否完整”：转读 Client Assets / ImagePacks2 / NPK / UI / IMG Boundary。
5. 查“动作层/职业 motion”：读 `.lay` 只看模板和 motion 槽；具体 ANI、hitbox、动作节奏走 Skill/Action/ANI 相关主线。

## 静态不能证明

- UI 窗口实机出现。
- 按钮可点击或点击事件正确。
- 背包、商店、活动、强化、邮件、任务等流程完成。
- 客户端 ImagePacks2/NPK/IMG/ANI/ACT 资源完整或加载顺序正确。
- 文本字体、换行、颜色、透明度、分辨率适配或遮挡正常。
- 服务器时间、活动状态、奖励领取、金币/材料扣除或服务端放行。
