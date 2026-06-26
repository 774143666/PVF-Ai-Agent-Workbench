# Client UI Layout / `.ui` / `.pos` / `.lay` 只读审计卡

状态：已完成静态只读封存

用途：回答“PVF 里 UI 布局、控件、窗口、坐标、`.pos`、`.lay` 能静态证明什么”。本文只记录主目标 PVF 的只读观察和辅助差异提示；不授权写 PVF，不证明客户端 UI 实机正常。

## 先读结论

- 主目标 PVF 中 `.ui` 文件 301 个，均为脚本型 UI 描述文件；`.pos` 文件 0 个；`.lay` 文件 10 个，均位于 `equipment/character/`。
- `.ui` 可静态证明控件类型、控件名/编号、坐标样数字、图片/动画/action 路径、父子关系、tab/radio 关系、grid/gauge/tree/tooltips 等描述存在。
- `.lay` 可静态证明角色动作层模板和 motion 名称列表存在；其中 `%s/...ani` 是模板路径，不是可直接检查的具体资源路径。
- `clientonly/skilltree/*_sp.co` / `*_tp.co` 的 `[icon pos]` 是技能树显示坐标线索；`[index]` 必须按对应职业技能 `.lst` 解析。
- `.ui`、`.lay` 和技能树坐标不证明按钮可点、窗口可见、文本不溢出、拖拽/分页/领取成功、客户端资源完整或服务端放行。

## 主目标样本

| 样本 | 当前确认 | 边界 |
| --- | --- | --- |
| `worldmap/granfloris.wdm` | `[map image]` 指向 `WorldMap/GranFloris.img`；`[ui path]` 指向 `WorldMap/UI/GranFloris.ui`；`[dungeon]` 块含 dungeon ID 与状态样数字。 | dungeon ID 走 `dungeon/dungeon.lst`；`.wdm` 不证明 worldmap 按钮可点或能进图。 |
| `worldmap/ui/granfloris.ui` | 多段 `[ui controls]`，类型含 `[image]`、`[balloon]`、`[switchbox]`；可见坐标、IMG 路径、`[common action]` 和末列 dungeon 样 ID。 | 控件末列数字必须结合 `.wdm [dungeon]` 和 `dungeon/dungeon.lst`；不要把其他坐标/帧号当 registry ID。 |
| `worldmap/ui/common/common.ui` | 含 banner image、text button、text；按钮引用 `Interface/WindowCommon.img`，文本可见 StringLink 样 token。 | 文本 token 不证明字体、换行、按钮点击或客户端资源完整。 |
| `ui/event/bingo/bingopopupwindow.ui` | 含 `[window]`、`[type] popup`、对齐、距离、大小、标题、`[controls]`、`[parent]`、`[int option]`、`[user option]`；控件类型含 text button、control、button、image、board image、text、animation、hyperlinklabel。 | 只证明活动 UI 描述存在；不证明活动开启、领取礼物成功、URL 可打开、按钮可点或奖励发放。 |
| `ui/inventory/inventory_item.ui` | 含 `[variable]`、`[ui path]` 子 UI、checkbox、radiobutton、tab group、parent tab、grid、tooltips、parent radio；grid 下有 `[grid data]`、`[cell basic data]`、`[cell margin]`。 | 不证明背包容量、分页切换、拖拽、物品放入、tooltip 显示或客户端行为。 |
| `ui/amplify/amplifyselectwindow.ui` | 含 image、button、text，坐标和 IMG frame 样数字可见。 | 只证明增幅相关 UI 控件描述存在；不证明增幅流程、套用/取消按钮或服务端结果。 |
| `ui/characterinfowindow/favorinfo.ui` | 含 image、tree、text、gauge。 | gauge 只是一种控件描述，不证明数值刷新或客户端绘制正常。 |
| `equipment/character/swordman.lay` | 含 `[LAYER]`、基础 motion、`[attack motion]`、`[etc motion]`，路径多为 `%s/Stay.ani`、`%s/Attack1.ani` 等模板。 | `%s` 需要由外层角色/装备/动画语境替换；不能直接当缺失资源判断。 |
| `clientonly/skilltree/swordman_sp.co` | `[skill info]` 下可见 `[index]`、`[icon pos]`、`[next skill]`。样本 ID `173` 按 `skill/swordmanskill.lst` 解析为 `skill/Swordman/ArmorMasteryHeavy.skl`。 | 技能树只证明显示入口和坐标线索；不证明技能可学、SP 足够、UI 可点或实机学习成功。 |

## 标签分布提示

在主目标 `ui/` 范围内定向搜索：

- `[window]`：119 个命中。
- `[parent]`：50 个命中。
- `[int option]`：21 个命中。
- `[user option]`：13 个命中。
- `` `[grid]` ``：11 个命中。
- `` `[gauge]` ``：16 个命中。
- `[window pos]`：0 个命中。

`worldmap/ui/` 样本没有 `[window]`，主要是裸 `[ui controls]` 控件集合；普通 `ui/` 下可见独立窗口式 UI。

## 辅助对照提示

辅助 PVF 只作差异提示：

- `.ui` 文件 346 个，多于主目标。
- `.pos` 文件 7 个，集中在 `ui/japan/...`；主目标 `.pos` 为 0，不能把辅助 `.pos` 提升为主目标事实。
- `.lay` 文件 12 个，多出 `equipment/character/atpriest.lay`、`equipment/character/atswordman.lay` 等。
- 辅助 `ui/japan/avatarconvert/avatarconvert.pos` 的结构是 `[MAIN]`、`[TILETYPE]`、`[POS]`、`[UNITNUMBER]`、多段 `[UIDATA]` + `[INDEX]` + `[POS]`。
- 辅助 `ui/amplify/amplifyselectwindow.ui` 与主目标结构相近，但文本写法可有差异；这只提示版本差异。

## 默认复核动作

1. 先确认问题是否落在 `.ui`、`.pos`、`.lay`、worldmap UI、技能树坐标或客户端资源闭合。
2. 如果是资源是否存在，转读 Client Assets / ImagePacks2 主线。
3. 如果是 UI 控件或布局，先读本文，再读字段词典和边界索引。
4. 对数字字段，先看父块：dungeon 走 `dungeon/dungeon.lst`，技能树 index 走对应职业技能 `.lst`；其他裸数字通常只记录为坐标、帧号、控件编号或列值线索。
5. 需要证明 UI 正常时，必须切换到客户端/实机验证；静态只读不能完成。
