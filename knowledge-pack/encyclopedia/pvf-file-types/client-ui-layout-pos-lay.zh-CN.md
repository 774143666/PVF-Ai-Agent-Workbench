# PVF 文件类型：Client UI Layout / `.ui` / `.pos` / `.lay`

状态：默认可用

用途：快速解释客户端 UI 布局相关 PVF 文件。本文只覆盖静态描述，不代表客户端实机效果。

## `.ui`

`.ui` 是 PVF 内的 UI 描述脚本。主目标中有 301 个 `.ui` 文件。

常见结构：

- `[window]`：窗口式 UI 外层，可带类型、对齐、距离、大小和标题。
- `[controls]`：窗口内控件集合。
- `[ui controls]`：单个控件描述块。
- 控件类型：`[image]`、`[button]`、`[text button]`、`[text]`、`[animation]`、`[grid]`、`[gauge]`、`[tree]`、`[checkbox]`、`[radiobutton]`、`[tab group]`、`[tooltips]`、`[hyperlinklabel]` 等。
- 关系字段：`[parent]`、`[parent tab]`、`[parent radio]`、`[ui path]`。
- 选项字段：`[int option]`、`[user option]`。
- 资源字段：IMG、ANI、ACT 路径。

静态能证明：控件类型、控件名/编号、坐标样数字、资源路径、父子关系、grid/tab/gauge 等描述存在。

静态不能证明：窗口出现、按钮可点、文本正常、资源完整、动画播放、事件生效、奖励领取、购买、强化、邮件或任务流程成功。

## `.pos`

主目标 PVF 中未见 `.pos` 文件。

辅助对照中 `.pos` 样本形状是：

- `[MAIN]`
- `[TILETYPE]`
- `[POS]`
- `[UNITNUMBER]`
- 多段 `[UIDATA]`，内部含 `[INDEX]` 与 `[POS]`

这只能说明辅助版本里存在 UI 位置表文件族；主目标结论必须写为 `.pos = 0`，不能借辅助补成主目标事实。

## `.lay`

`.lay` 是角色 motion 层模板文件。主目标中有 10 个，均在 `equipment/character/`。

常见结构：

- `[LAYER]`
- `[waiting motion]`、`[move motion]`、`[sit motion]`、`[damage motion]`、`[jump motion]` 等基础动作。
- `[attack motion] ... [/attack motion]`
- `[etc motion] ... [/etc motion]`
- 路径多为 `%s/Stay.ani`、`%s/Attack1.ani` 这种模板。

读取边界：

- `%s` 需要由外层角色、装备或动画语境替换，不能直接当具体资源路径。
- `.lay` 不提供攻击盒、伤害、取消窗口、动作速度或资源完整证明。

## 常见路由

| 路由 | 说明 |
| --- | --- |
| `worldmap/*.wdm [ui path]` -> `worldmap/ui/*.ui` | worldmap UI 文件入口。 |
| `ui/**/*.ui [ui path]` -> 子 `.ui` | UI 内部引用子 UI。 |
| `clientonly/skilltree/*.co [icon pos]` | 技能树显示坐标，不是 `.ui`，但属于 UI 布局语义。 |
| `equipment/character/*.lay` | 角色 motion 模板。 |

## 数字怎么判断

- `.wdm [dungeon]` 的数字按 `dungeon/dungeon.lst`。
- worldmap `.ui` 的 balloon 末列数字需要结合 `.wdm [dungeon]`。
- 技能树 `[index]` 按对应职业技能 `.lst`，例如 `swordman_sp.co` 用 `skill/swordmanskill.lst`。
- `.ui` 内其他短数字、负数、坐标、帧号、颜色、控件编号、tab index、grid cell 参数，不要按物品、装备、任务或 NPC ID 猜。

## 和 Client Assets 主线的关系

Client Assets / ImagePacks2 主线回答“资源引用和静态索引是否可见”。本主线回答“UI 描述字段长什么样”。

两者都不能证明实机 UI 正常。要证明界面是否出现、是否可点击、资源是否真正加载、文本是否溢出，必须做客户端或实机验证。
