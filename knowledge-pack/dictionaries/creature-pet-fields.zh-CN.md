# Creature / Pet 字段字典

状态：默认可用

用途：记录宠物本体、宠物道具/宠物蛋、宠物装备、pet registry 和 creature 运行资源的静态边界。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 入口与 registry

| 入口 | 主目标观察 | 读法 |
| --- | --- | --- |
| `creature/creature.lst` | 注册 451 项，451 项全部存在；存在重复路径注册，无缺失。 | 宠物本体 `.cre` 的主 registry。 |
| `creature/creature.jpn.lst` | 注册 15 项。 | 辅助/地区化 registry；不要替代主 `creature.lst`。 |
| `creature/script/creature.lst` | 注册 103 项，103 项全部存在；存在重复路径注册。 | `.wrd` 文本/脚本入口，不是宠物本体文件。 |
| `pet/pet.lst` | 注册 1 项，文件存在。 | pet 是独立 registry，不等同 creature registry。 |
| `equipment/equipment.lst` -> `equipment/creature/*.equ` | 主目标观察到 672 个 equipment creature 注册项，读取无错误。 | 宠物道具、宠物蛋和宠物装备走 equipment registry。 |
| `passiveobject/creature/` | 主目标观察到 2245 个文件。 | 宠物技能/效果运行资源入口；静态存在不证明实机技能成功。 |

## Creature 本体 `.cre`

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[name]` | 451 个 `.cre` 均可见名称字段。 | 显示文本不证明客户端字库或 UI 正常。 |
| `[width]`、`[floating height]`、`[layer]`、`[gravity]` | 本体尺寸、浮空、层级和重力类字段。 | 不证明实机跟随位置或碰撞表现。 |
| `[move speed]` | 本体移动速度列。 | 实际跟随、路径和同步需实机。 |
| `[start level]`、`[permission level]`、`[max level]`、`[parent max level]` | 等级与成长上限类字段。 | 不证明经验获取、升级或成长曲线正确。 |
| `[artifact slot]` | 多数 `.cre` 可见 artifact slot，例如 red / blue。 | 只证明槽位配置，不证明宠物装备实机可装或属性生效。 |
| `[skill recovery time]`、`[over skill recovery time]`、`[skill MP]`、`[over skill MP]` | 技能冷却和消耗类字段。 | 不证明技能可释放、扣 MP 或冷却 UI 正常。 |
| `[basic motion]`、`[walk motion]`、`[run motion]`、`[skill motion]`、`[over skill motion]`、`[response motion]`、`[etc motion]` | 动画路径字段。 | PVF 引用不证明客户端动画资源完整。 |
| `[attack info]` | 可引用 creature 本地 attackinfo 和 `passiveobject/creature` 相关攻击文件。 | 攻击文件存在不证明命中、伤害或目标选择。 |
| `[skill string]`、`[skill explain]`、`[string data]`、`[int data]` | 技能说明和参数字段。 | 文本和参数不能直接写成运行效果。 |
| `[evolution quest]`、`[evolution creature id]`、`[evolution level]` | 进化任务、目标宠物和等级线索。 | 不证明任务可接、进化成功或材料扣除。 |
| `[using random skill]`、`[random motion]` | 随机技能或随机动作线索。 | 随机分布和运行触发需实机或日志。 |

## Equipment Creature `.equ`

| 字段 | 主目标可见结构 | registry 口径 |
| --- | --- | --- |
| `[equipment type]` | 宠物本体/蛋样本为 `` `[creature]` ``；宠物装备样本可见 `` `[artifact red]` ``、`` `[artifact blue]` ``、`` `[artifact green]` ``。 | 都属于 equipment registry 下的装备类道具，不是 stackable。 |
| `[sub type]` | 主目标 equipment creature 中观察到 `0`、`1`、`2`；样本中普通宠物多为 `0`，宠物蛋样本为 `1`。 | sub type 含义需结合样本和实机确认，不能只凭数值改造。 |
| `[creature species]` | 观察到 561 处，其中 547 处可闭合到 `creature/creature.lst`，14 处未闭合。 | 大多数情况下按 creature registry 复核；未闭合项必须记录风险。 |
| `[output index]` | 观察到 140 处，140 处全部闭合到 `equipment/equipment.lst`。 | 它是 equipment ID 语境，不是 `creature/creature.lst` ID。 |
| `[need material]` | 宠物蛋样本可见材料 ID 和数量。 | 材料 ID 按 stackable 等正确 registry 解析；静态存在不证明扣除成功。 |
| `[creature minimum level]` | 宠物装备 artifact 样本可见最低宠物等级。 | 不证明实机可装备或等级检查通过。 |
| `[creature physical attack]`、`[creature magical attack]`、`[creature skill charge time rate]`、`[creature skill over charge time rate]`、`[creature experience amount rate]` 等 | 宠物装备 artifact 样本可见宠物专用属性。 | 属性字段存在不证明最终面板、生效范围或服务端放行。 |
| `[passive object]` | 少量 equipment creature 可见。 | 只作为运行资源入口线索，不证明触发。 |

## Pet `.pet`

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `pet/pet.lst` | 主目标只有 1 个注册项，闭合到 `.pet`。 | pet registry 很小，不能把 creature 主体都归入 pet。 |
| `[basic motion]`、`[etc motion]`、`[attack info]`、`[int data]`、`[name]` | `.pet` 样本可见动画、攻击信息、参数和名称字段。 | 只能证明 pet 文件结构存在；不证明实机宠物系统等同 creature 系统。 |

## 常见误判

- 不要把 `equipment/creature/*.equ` 的 ID 当成 `creature/creature.lst` ID。
- 不要把 `[output index]` 写成 creature ID；当前观察它闭合到 equipment registry。
- 不要把 `[creature species]` 无脑当作一定闭合；当前有未闭合样本。
- 不要把宠物装备 artifact 写成普通宠物本体。
- 不要把 `passiveobject/creature` 的攻击资源写成宠物技能实机命中。

## 辅助对照提示

辅助对照 PVF 的 creature、equipment creature 和 stackable 宠物相关入口规模更大，但 `pet/pet.lst` 同样只有 1 项。辅助对照只提示版本规模差异，不能覆盖主目标 registry 数量、字段分布和未闭合风险。
