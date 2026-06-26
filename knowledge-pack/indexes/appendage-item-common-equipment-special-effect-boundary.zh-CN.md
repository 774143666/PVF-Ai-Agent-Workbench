# Appendage / Item Common / Equipment Special Effect Boundary

状态：已完成静态只读封存

用途：记录主目标 PVF 中 appendage、消耗品共通效果入口、装备 passive object、附加效果映射和 `item_common` 字面边界。本文不重开 Equipment / Stackable、PassiveObject / AttackInfo / Hitbox 或 Skill / State / NUT Runtime 主线。

## 方法边界

- 外部资料只作为定向线索：提示应优先核验装备触发块、appendage ID、passive object registry、stackable 效果入口和 appendage 生命周期接口。
- 结论只按主目标 PVF 只读观察晋级。
- 辅助对照 PVF 只记录差异提示，不覆盖主目标事实。
- 数字 ID 必须看父块和上下文，不能跨 registry 借义。

## 主目标观察矩阵

| 小桶 | 主目标只读观察 | 结论 |
| --- | --- | --- |
| 装备 appendage 入口 | equipment 范围 `[appendage]` 549、`[my appendage]` 279、`[appendage unique]` 1。 | 装备触发和条件块可引用 APD，但每个数字要回 `appendage/appendage.lst`。 |
| 消耗品效果入口 | stackable 范围 `[appendage group]` 107、`[passive object in stackable]` 5。 | 消耗品可携带效果分组或被动对象入口；列公式未在当前样本完整解释。 |
| 装备 passive object | equipment 范围 `[passive object]` 575。 | 第一列是 passiveobject ID 语境，必须解析到 `.obj` 后继续读对象链。 |
| 附加效果映射 | `[additional effect index]` 17；`etc/equipmenteffectset.etc` 和 `etc/additionaleffectlist.etc` 均命中样本编号。 | 附加效果编号走 ETC 映射族，不是普通 `.lst` registry ID。 |
| `item_common` 字面 | 只命中 `ui/craneminigame/animation/crane_item_common.*` 三个 UI 资源。 | 当前不能写成独立通用物品效果数据域。 |

## 代表链路

| 链路 | 主目标只读闭合 | 风险 |
| --- | --- | --- |
| 装备 appendage | `equipment/character/common/amulet/100300007.equ` 在 `[then]` 内写 `[appendage] 205` 和 `[appendage] 207`；同文件套装块用 `[my appendage] 205` 做条件。`205 -> appendage/equipment/80Lv_Epic_acc_set.apd`，APD `[type] super armor`；`207 -> appendage/equipment/80Lv_Epic_acc_set2.apd`，APD `[type] change status`，含 `attack speed`、`move speed`、`cast speed` 参数。 | 静态只读只证明配置链；霸体、速度、附加伤害、持续、冷却和 PVP 表现需实机。 |
| 装备唯一 appendage | `equipment/character/gunner/weapon/musket/104030042.equ` 在跳跃和跳跃攻击条件下写 `[appendage unique] 212`；`212 -> appendage/equipment/80Lv_Unique_Musket_Cartel.apd`，APD `[type] change status`，`attack speed` 参数为 200。 | `unique` 的覆盖、刷新和退出时机不能静态证明。 |
| 消耗品 appendage group | `stackable/bible_blue.stk` 有 `[appendage group] 0`，并带 `[stat change]` 与 `[stat change duration]`。 | `0` 不是 appendage registry ID；当前不解释 group 规则。 |
| 消耗品 passive object | `stackable/10000375.stk` 有 `[passive object in stackable] 16182 ...`；`16182 -> passiveobject/ActionObject/Monster/New_Event/Dual_face_Item1.obj`，对象有 `[basic action] Action/Dual_face_Item1.act`。 | 只证明道具可指向被动对象；使用时目标、模式切换、对象创建成功和资源显示需运行验证。 |
| 装备 passive object | `equipment/character/common/amulet/100300064.equ` 在 `[then]` 内先 `[consume item] 3037 2`，再 `[passive object] 48214 ...`；`3037 -> stackable/material/cubepiece_clear.stk`，`48214 -> passiveobject/EquipmentPassiveObject/WindForce/kain_sword_summonner.obj`。对象 `[basic action] Action/Basic.act`，该 action 内继续 `[CREATE PASSIVEOBJECT] [INDEX] 48213`。 | 不证明消耗成功、施放成功、下游对象命中、伤害、轨迹、同步或资源完整。 |
| 装备附加效果 | `equipment/character/dihuo/14thwingeffect2_10.equ` 的 `[piece set ability]` 内 `[additional effect index] 6221`；`etc/equipmenteffectset.etc` 将 6221 关联到该 partset 效果文件；`etc/additionaleffectlist.etc` 中 `[index] 6221` 关联足迹类动画和 term 参数。 | 6221 在常规 registry 中未闭合；必须走 ETC 映射族。动画路径不证明客户端实际显示。 |
| `item_common` 字面 | `ui/craneminigame/animation/crane_item_common.act` 只是 `[MOTION]`，引用 `crane_item_common_00.ani` 和 `crane_item_common_01.ani`。 | 这是 UI 动画资源，不是物品共通效果规则。 |

## 辅助对照提示

| 项 | 辅助对照观察 |
| --- | --- |
| equipment `[appendage]` | 命中 931，高于主目标。 |
| equipment `[my appendage]` | 命中 244，低于主目标。 |
| stackable `[appendage group]` | 命中 107，与主目标同量级。 |
| stackable `[passive object in stackable]` | 命中 5，与主目标一致。 |
| `item_common` 字面 | 同样只命中抓娃娃 UI 动画资源。 |
| 样本 ID | 205 和 48214 在辅助对照中也可解析；6221 在 `etc/additionaleffectlist.etc` 中命中。 |

辅助对照只说明同类结构存在，不说明主目标缺失或应迁移辅助数据。

## 可复用规则

- 先定父块，再定 registry；同一个数字可以在多个 registry 中存在，不能离开父块解释。
- APD 是静态 appendage 配置；NUT appendage 是运行脚本体系，二者不能混写。
- 装备 `[passive object]` 与 `.act [CREATE PASSIVEOBJECT] [INDEX]` 都可进入 passiveobject 链，但所处父块不同，参数列不能互套。
- `[additional effect index]` 的正确入口是 ETC 映射族；找不到映射时保留原值，标记未解析。
- `item_common` 当前不是可编辑数据家族；遇到该字面先查文件类型和父目录。

## 未证明事项

- 不证明 appendage 叠加、持续、刷新、失效、buff 图标、PVP 修正或服务端同步。
- 不证明 passiveobject 命中、伤害、AI、轨迹、击退、浮空、对象销毁或客户端资源完整。
- 不证明 additional effect 足迹、翅膀、光效类动画实际显示。
- 不证明 stackable 使用成功、扣除、冷却、背包检查或服务端放行。

