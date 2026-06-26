# Creature / Pet Boundary

状态：默认可用

用途：作为宠物本体、宠物道具/宠物蛋、宠物装备、pet registry、creature 脚本和运行资源的封存矩阵。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 默认读法

1. `safety/README.zh-CN.md`
2. `task-cards/creature-pet-readonly-audit.zh-CN.md`
3. `dictionaries/creature-pet-fields.zh-CN.md`
4. `indexes/stackable-container-package-boundary.zh-CN.md`
5. 本矩阵

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| creature 本体 | `creature/creature.lst` 注册 451 项，全部存在。 | `.cre` 是宠物本体结构，不是宠物道具。 |
| creature 脚本/文本 | `creature/script/creature.lst` 注册 103 项，全部存在。 | `.wrd` 不替代 `.cre`。 |
| pet registry | `pet/pet.lst` 注册 1 项，文件存在。 | pet 是独立小 registry，不等同 creature 主系统。 |
| equipment creature | `equipment/equipment.lst` 下观察到 672 个 `equipment/creature/*.equ` 注册项。 | 宠物、宠物蛋和宠物装备都走 equipment registry。 |
| 宠物装备 artifact | 主目标可见 `artifact red`、`artifact blue`、`artifact green` 类 equipment creature 文件。 | 属于宠物装备属性层，不是宠物本体。 |
| 被动对象资源 | `passiveobject/creature/` 下观察到 2245 个文件。 | 只证明资源入口存在，不证明技能命中或伤害。 |

## 代表链路

| 链路 | 可复用结论 | 不要推导 |
| --- | --- | --- |
| `creature/creature.lst` -> `.cre` | 宠物本体字段、动作、技能、攻击信息和进化线索从 `.cre` 读取。 | 不要用 equipment ID 直接读 `.cre`。 |
| `equipment/equipment.lst` -> `equipment/creature/*.equ` | 宠物道具、宠物蛋和宠物装备按 equipment registry 闭合。 | 不要按 stackable 或 creature registry 解释 equipment ID。 |
| `.equ [creature species]` -> `creature/creature.lst` | 观察到的大多数 `[creature species]` 可闭合到 creature registry。 | 当前有未闭合样本，遇到具体文件必须复核。 |
| `.equ [output index]` -> `equipment/equipment.lst` | 当前观察到的 `[output index]` 全部闭合到 equipment registry。 | 不要把它写成 creature ID。 |
| `.cre [attack info]` -> attackinfo / passiveobject resource | 可静态追到攻击或被动对象资源路径。 | 不证明命中、伤害、AI、冷却或同步。 |
| stackable 容器 `[creature]` 块 -> equipment creature | 容器/礼包中的 creature 候选样本可闭合到宠物蛋或宠物装备 ID。 | 不要直接跳到 `creature/creature.lst`。 |

## 字段分布

| 字段 / 入口 | 主目标数量或值 | 结论 |
| --- | --- | --- |
| `creature/creature.lst` | 451 项，451 项存在。 | 宠物本体 registry 闭合。 |
| `creature/script/creature.lst` | 103 项，103 项存在。 | 脚本/文本 registry 闭合。 |
| `pet/pet.lst` | 1 项，1 项存在。 | pet registry 存在但规模很小。 |
| `equipment/creature/*.equ` | 672 个注册项，读取无错误。 | 宠物道具层覆盖完成。 |
| equipment creature `[sub type]` | 观察到 `0`、`1`、`2`；数量分布为 `0:531`、`1:136`、`2:2`。 | `0/1/2` 不直接写成完整运行语义。 |
| `[creature species]` | 561 处；547 处闭合到 `creature/creature.lst`，14 处未闭合。 | 可作为 creature 本体 ID 线索，但必须逐文件复核。 |
| `[output index]` | 140 处；140 处全部闭合到 `equipment/equipment.lst`。 | equipment ID 语境。 |
| `passiveobject/creature/` | 2245 个文件。 | 静态资源入口，不证明实机技能。 |

## 辅助对照提示

辅助对照 PVF 的 `creature/creature.lst` 注册 533 项，`equipment/creature` 注册 1770 项，`stackable` 宠物相关路径候选更多；`pet/pet.lst` 仍为 1 项。该差异只说明辅助版本宠物资源和宠物装备规模更大，不能覆盖主目标事实。

## 封存验收

- 能区分 creature 本体、equipment creature 道具层、pet registry、creature script 和 passiveobject creature 运行资源。
- 能把 `[creature species]` 和 `[output index]` 分别按正确 registry 复核。
- 能识别宠物蛋与普通宠物、宠物装备 artifact 的不同层级。
- 能说明 stackable 容器里的 `[creature]` 候选优先按 equipment creature 核查。
- 能说明静态只读不能证明召唤、孵化、技能释放、命中、伤害、客户端资源或服务端放行。
