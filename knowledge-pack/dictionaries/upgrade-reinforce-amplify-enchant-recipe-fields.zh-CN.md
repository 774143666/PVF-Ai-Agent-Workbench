# Upgrade / Reinforce / Amplify / Enchant / Recipe 字段词典

状态：默认可用

本文只记录主目标 PVF 只读观察后可作为 Workbench 默认知识的字段边界。外部资料只作查找线索，不能绕过主目标观察。

## 装备强化/增幅字段

| 标签 | 观察到的静态含义 | 解析边界 |
| --- | --- | --- |
| `[equipment upgrade] ... [/equipment upgrade]` | 装备条件块，可在 `.equ [if]` 下描述 `upgrade` 或 `amplify` 等条件。 | 只证明条件字段存在，不证明强化/增幅状态实机计算正确。 |
| `[possible kiri protect]` | 大量装备可见的保护相关空标签。 | 只记录静态标记，不证明保护券、NPC 或失败保护实机生效。 |
| `[not amplify]` | 装备侧禁止增幅样标记，样本为 `1`。 | 不证明服务端一定拒绝，只能作为静态字段复核入口。 |
| `[limit upgradable level] ... [/limit upgradable level]` | 强化/增幅等级限制闭合块，样本含 `normal upgrade`、`amplify upgrade` 和等级段。 | 不能把等级段写成最终规则；需结合装备等级、服务端规则和实机验证。 |
| `[impossible contents] ... [/impossible contents]` | 装备不可参与内容的 token 块，样本含 `disjoint`、`gift`。 | 不等同于实机分解、赠送或交易一定被拒。 |
| `[upgrade prob increase]` | 强化成功率修饰线索，样本称号写 `10000`。 | 刻度和最终公式未由静态只读证明。 |
| `[upgrade cost discount]` | 强化费用折扣线索，样本称号写 `30.0`。 | 不证明金币扣除、折扣叠加或 NPC 费用公式。 |
| `[assault cost discount]` | 街头争霸费用折扣线索。 | 不属于强化公式；不要混入强化扣费结论。 |
| `[item overpower part]` | 少量套装装备可见的空标签。 | 当前只记录为装备特殊字段，不解释为强化或附魔机制。 |

## 副职业制作字段

| 标签 | 观察到的静态含义 | 解析边界 |
| --- | --- | --- |
| `[expertjob only] ... [/expertjob only]` | 副职业 token 与等级闭合块。主目标样本含 `alchemist`、`disjointer`、`doll_controller`、`enchanter`。 | 必须和同文件机制字段合读；不能把 token 当全局职业枚举。 |
| `[prof compound rate]` | 专业制作/合成率修饰线索，主目标样本值为 `5`。 | 不证明成功率公式或实机制作成功。 |
| `[prof result variation]` | 专业制作结果变化线索，主目标样本形态为 `5 200`。 | 两列精确含义需实机验证。 |
| `[prof disjoint result variation]` | 分解师结果变化线索，主目标样本值为 `10`。 | 不证明分解产物实际增加。 |
| `[prof material variation]` | 材料消耗变化线索，主目标样本值为 `-10`。 | 不证明材料扣除公式或负值语义。 |
| `[prof additional gain exp]` | 副职业经验增加线索，主目标样本形态为 `10 1`。 | 不证明经验实际增加。 |
| `[expert type]` | stackable 副职业道具的专业类型 token。 | 与装备侧 `[expertjob only]` 是不同父块，不能混用。 |
| `[alchemist extraction]` | 炼金提取器样本字段。 | 只证明提取器道具配置存在，不证明提取成功或材料产出。 |

## 配方道具字段

| 标签 | 观察到的静态含义 | 解析边界 |
| --- | --- | --- |
| `[stackable type]` + `` `[recipe]` `` | stackable 配方道具类型。 | 不证明右键使用、学习或制作成功。 |
| `[int data] ... [/int data]` | 配方参数闭合块。样本中可观察到材料 ID/数量、结果 ID/数量和职业/等级样列。 | 不能把所有列硬命名为通用公式；必须按样本、父块和 registry 逐项复核。 |
| `[bead item] ... [/bead item]` | 配方道具中常见闭合块，部分样本为空。 | 不证明产物一定是宝珠；空块也不能写成无效。 |
| `[string data] ... [/string data]` | 配方附加 token，样本含 `` `[craftmanship]` ``。 | token 只作机制线索，不证明工艺系统实机生效。 |
| `[need material]` | 怪物卡片等 stackable 样本可见的材料需求字段。 | 不证明材料扣除成功。 |

## 附魔字段

| 标签 | 观察到的静态含义 | 解析边界 |
| --- | --- | --- |
| `[enchant] ... [/enchant]` | 附魔属性闭合块；怪物卡片样本内可写 `[physical attack]`、`[magical attack]` 或 `[skill levelup]`。徽章样本也可写该块。 | 必须按父文件类型区分怪物卡片、徽章等；不证明附魔成功。 |
| `[string data]` | 怪物卡片样本第一列为卡面 IMG，第二列为目标装备 token，如 `` `[title name]` `` 或 `` `[waist]` ``。 | 不证明 UI 卡面显示或目标部位实机允许。 |
| `[int data]` | 怪物卡片样本可见卡面序号和怪物 ID 样列，样本怪物 ID 可按 `monster/monster.lst` 闭合。 | 不是通用 stackable 列义；必须在 monster card 父块中解释。 |
| `[item category]` + `monster card` | 怪物卡片类别 token。 | 不证明掉落、交易或附魔 UI 正常。 |

## 配方商店字段

| 标签 | 观察到的静态含义 | 解析边界 |
| --- | --- | --- |
| NPC `[role]` + `` `[item shop]` `` | NPC 到 itemshop ID 的入口。样本诺顿为 8，克伦特为 35。 | 只证明 NPC 静态角色入口，不证明对话 UI 或商店打开成功。 |
| `itemshop/itemshop.lst` | itemshop registry。主目标注册 `Recipe1.shp`、`Recipe2.shp`、`Recipe3.shp`。 | 必须按 registry 解析 `.shp`，不要按文件名猜 ID。 |
| `.shp [NPC]` | 商店文件内 NPC ID。 | 要回 `npc/npc.lst` 解析，不按数字猜 NPC。 |
| `.shp [sell item]` | 售卖物 ID 列表，`-1`、`-2` 等为分隔/占位样值。 | 正数仍需按当前商店语境和 registry 解析；不证明购买成功。 |
| `.shp [tab name]` | 商店页签文本。 | 不证明客户端 UI 显示正常。 |

## 解析规则

| 场景 | 正确动作 | 禁止动作 |
| --- | --- | --- |
| 看到装备强化字段 | 先确认 `.equ` 父文件、字段是否闭合、同文件是否有装备类型和限制字段。 | 直接写成强化系统全局规则。 |
| 看到副职业 token | 同读 `[expertjob only]` 与同文件 `[prof ...]` 字段。 | 脱离副职业父块解释制作公式。 |
| 看到配方数字 | 先确认是配方 `[int data]`、商店 `[sell item]`、卡片 `[int data]` 还是材料字段。 | 裸数字按大小猜 stackable/equipment/monster。 |
| 看到 `[enchant]` | 先区分怪物卡片、徽章或其他 stackable 父类型。 | 把所有 `[enchant]` 都写成怪物卡附魔。 |
| 看到辅助对照更大商店 | 只写版本差异提示。 | 用辅助内容补主目标商店事实。 |
