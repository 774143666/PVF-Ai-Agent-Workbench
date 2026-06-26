# Appendage / Item Common / Equipment Special Effect 字段词典

状态：默认可用

用途：整理主目标 PVF 中 appendage、消耗品共通效果入口、装备 passive object 和附加效果映射的字段路由。字段存在只证明静态结构存在，不证明运行成功。

## 字段路由

| 字段 / 块 | 已观察语境 | 解析方式 | 边界 |
| --- | --- | --- | --- |
| `[appendage]` | 装备 `.equ` 的 `[then]` 效果块。 | 数字走 `appendage/appendage.lst`，再读对应 `appendage/**/*.apd`。 | 不等于 NUT appendage 路径；APD 生效、叠加、持续、图标需运行验证。 |
| `[my appendage]` | 装备 `.equ` 的 `[if]` 条件块。 | 数字走 `appendage/appendage.lst`；语义是自身已有指定 appendage 的条件入口。 | 只证明条件结构；不证明运行时一定挂上或条件刷新正确。 |
| `[appendage unique]` | 装备 `.equ` 的 `[then]` 效果块。 | 数字走 `appendage/appendage.lst`；代表唯一类 appendage 引用形态。 | 唯一性、覆盖、刷新和退出时机不能静态证明。 |
| APD `[type]` | `appendage/**/*.apd`。 | 记录类型，如 `super armor`、`change status`、`change weapon color`。 | 类型名不等于完整运行公式。 |
| APD `[duration]` | `appendage/**/*.apd`。 | 记录持续时间参数。 | 单位、刷新、提前失效、PVP 修正需实机。 |
| APD `[buff]` / `[icon image]` | `appendage/**/*.apd`。 | 记录 buff 标志和图标引用。 | UI 图标显示、资源存在和服务端同步不由静态证明。 |
| APD `[max overlap]` | `appendage/**/*.apd`。 | 记录最大重叠参数。 | 实际叠加规则、覆盖优先级需运行验证。 |
| APD `[string data]` / `[int data]` / `[float data]` | `appendage/**/*.apd`。 | 按原列保留，常见于 change status 参数。 | 不能脱离 APD `[type]` 和父装备块解释。 |
| `[appendage group]` | 消耗品 `.stk`。 | 当前只记录为 stackable 效果分组入口。 | 分组编号不是 appendage registry ID；分组实际规则未在当前样本闭合。 |
| `[passive object in stackable]` | 消耗品 `.stk` 闭合块。 | 第一列按 `passiveobject/passiveobject.lst` 解析；其余列按原样保留。 | 列公式、使用条件、创建成功和目标选择需运行验证。 |
| `[passive object]` | 装备 `.equ` 的 `[then]` 效果块。 | 第一列按 `passiveobject/passiveobject.lst` 解析，再继续读 `.obj/.act/.atk/.ani`。 | 不可作为快速安全写入入口；对象链闭合也不证明命中或伤害。 |
| `[consume item]` | 装备 `.equ` 的 `[then]` 效果块。 | 常见形态为 stackable ID 与数量；ID 按 `stackable/stackable.lst` 解析。 | 是否实际扣除、失败处理、背包检查和服务端放行需实机。 |
| `[additional effect index]` | `equipment/character/partset/*.equ` 和 `equipment/character/dihuo/*.equ` 的 `[piece set ability]` 内。 | 通过 `etc/equipmenteffectset.etc` 和 `etc/additionaleffectlist.etc` 这类 ETC 映射族闭合。 | 不是普通 `.lst` ID；不能套 appendage、equipment、stackable、passiveobject registry。 |
| `[effect equipment part set]` | `etc/equipmenteffectset.etc`。 | 首列为效果套装编号，后接 partset `.equ` 路径和适用 avatar 部位 token。 | 部位适配、穿戴检测和 UI 表现不能静态证明。 |
| `[effect]` / `[index]` | `etc/additionaleffectlist.etc`。 | `[index]` 与 `[additional effect index]` 对应，可继续读 `[type]`、`[animation]`、term 参数。 | 动画资源存在不证明客户端实际显示。 |
| `item_common` 文件名 | 当前只命中 `ui/craneminigame/animation/crane_item_common.*`。 | 按 UI 动画资源处理。 | 未确认存在 `item_common` 通用物品效果数据家族。 |

## 主目标命中概览

| 入口 | 主目标只读命中 |
| --- | ---: |
| equipment `[appendage]` | 549 |
| equipment `[my appendage]` | 279 |
| equipment `[appendage unique]` | 1 |
| equipment `[passive object]` | 575 |
| stackable `[appendage group]` | 107 |
| stackable `[passive object in stackable]` | 5 |
| `[additional effect index]` | 17 |
| `item_common` 文件名字面 | 3 个 UI 动画资源 |

## Registry 规则

| 数字所在父块 | 正确路由 |
| --- | --- |
| equipment `[appendage]` | `appendage/appendage.lst` |
| equipment `[my appendage]` | `appendage/appendage.lst` |
| equipment `[appendage unique]` | `appendage/appendage.lst` |
| equipment `[passive object]` | `passiveobject/passiveobject.lst` |
| stackable `[passive object in stackable]` | `passiveobject/passiveobject.lst` |
| equipment `[consume item]` | `stackable/stackable.lst` |
| `[additional effect index]` | `etc/equipmenteffectset.etc` 与 `etc/additionaleffectlist.etc` 映射族 |
| `.act [CREATE PASSIVEOBJECT] [INDEX]` | `passiveobject/passiveobject.lst` |

