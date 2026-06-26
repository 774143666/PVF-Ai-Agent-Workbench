# Stackable Container / Package 字段字典

状态：默认可用

用途：记录 stackable 容器、礼包、选择箱、随机箱和礼包预览字段的静态边界。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 入口与规模

| 入口 | 主目标观察 | 读法 |
| --- | --- | --- |
| `stackable/stackable.lst` | 注册 10372 项，10372 项全部存在；存在重复路径注册，但无缺失文件。 | 所有 stackable 容器/礼包 ID 先走该 registry。 |
| 路径含 package / box / booster / random / select 等关键词 | 主目标注册项中观察到 1949 个礼包/箱类路径候选。 | 只能当候选范围；最终以字段块为准。 |
| 容器/礼包核心 tag | 主目标注册 `.stk` 中观察到 5885 个文件命中核心容器/礼包 tag。 | 这是字段命中规模，不等于都能实机打开。 |

## Root 与可交互性

| 结构 | 读法 | 边界 |
| --- | --- | --- |
| root wrapper | 按 `stackable/stackable.lst` 和 root `.stk` 读取名称、类型、说明、包装字段。 | registry 存在、说明存在或 iteminfo 存在，不证明可右键交互。 |
| `[stackable type]` | 只能辅助判断普通道具、容器、booster、宝珠、任务物等大类。 | 类型字段不能单独证明开包、抽奖、附魔或发放成功。 |
| child item | 按父块选择 stackable、equipment、creature 或其它 registry 继续闭合。 | child item 可用不反推 root wrapper 可用。 |

## 固定礼包与选择礼包

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[package data]` | 观察到 3623 处；块内可见候选 ID、数量等数字列。 | 候选 ID 必须按上下文解析；同一数字可能在多个 registry 中存在，不能凭数字大小判断；该字段不证明 root 可打开。 |
| `[package data selection]` | 观察到 110 处；块内可见可选候选 ID 与数量列。 | 静态只读只证明可选候选配置，不证明实机 UI 可选、限选数量正确或发放成功。 |
| `[avatar package preview info]` | 观察到 882 处；通常引用 CashShop 预览 IMG 和索引。 | PVF 引用不证明客户端 IMG 存在或预览 UI 正常。 |
| `[secret add item]` | 观察到 32 处。 | 只能作为额外物品线索；触发条件和发放仍需实机。 |

## Booster / 选择器

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[booster info]` | 观察到 1019 处；可为空体，也可与候选块相邻。 | 空体不等于无效；具体交互、选择、随机和产物生成仍需运行验证。 |
| `[booster category num]` | 观察到 250 处；可见分类数量和分类尺寸线索。 | 数字列不能脱离后续分类块解释。 |
| `[booster selection num]` | 观察到 250 处；可见选择数量线索。 | 不证明实机限选数量或 UI 正常。 |
| `[booster select category]` | 观察到 250 处；多组分类块可组合出选择列表。 | 分类块内数字列需结合相邻候选块读取，不能裸猜。 |
| `[booster category name]` | 观察到 170 处；可见分类显示文本。 | 显示文本不证明分类内容完整或客户端字库正常。 |
| `[hide booster info]` | 观察到 9 处。 | 只作为隐藏显示线索；不证明 UI 行为。 |
| `[booster equipment upgrade]` | 观察到 3 处。 | 只按特殊选择器字段保留；升级逻辑需另验。 |

## 候选池块

| 字段 | 主目标可见结构 | registry 口径 |
| --- | --- | --- |
| `[equipment]` | 观察到 225 处；块内候选可闭合到 equipment。 | 走 `equipment/equipment.lst`，不要按 stackable 解释。 |
| `[avatar]` | 观察到 211 处；块内候选为 avatar 装备语境。 | 仍走 `equipment/equipment.lst`，并保留 avatar 父块上下文。 |
| `[stackable]` | 观察到 157 处；块内候选为 stackable 道具语境。 | 走 `stackable/stackable.lst`。 |
| `[creature]` | 观察到 17 处；样本中候选可闭合到 `equipment/creature/*.equ`，例如宠物蛋。 | 优先按 equipment creature 商品/蛋语境核查；不要直接跳到 `creature/creature.lst`。 |
| `[recommend]` | 可见推荐候选列表。 | 推荐候选不是完整候选池，仍需按块内 ID 解析。 |
| `[default select]` | 观察到 2 处；样本可指向另一个 stackable 候选。 | 默认选择不证明玩家不能改选或 UI 正常。 |
| `[result item]` | 观察到 3 处；块内可见结果 ID、数量和权重线索。 | 结果 ID 需按上下文解析；权重不等于已验证概率，也不证明产物已发放。 |
| `[consume item]` | 观察到 46 处；块内可见消耗候选 ID 与数量。 | 静态存在不证明实机扣除成功。 |
| `[target item id]` | 观察到 20 处。 | 只作为目标物品 ID 线索；父块决定 registry。 |

## 随机箱

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[random]` | 观察到 7 处，可为空体标记。 | 不证明随机逻辑已实机运行。 |
| `[random list]` | 观察到 7 处；块内可见长候选池，包含候选 ID、权重/数量/标记类数字。 | 候选 ID 要逐项解析；权重列、保底、重复项、最终概率和产物生成必须实机或更强证据确认。 |

## 常见误判

- 不要把 `[package data]` 的所有数字都解释成物品 ID；数量、权重、分类或标志列也会混在同一行。
- 不要把 `[package data]` 写成 root wrapper 可交互或可开启。
- 不要把 `[avatar]` 候选按 stackable 解析；avatar 是 equipment 语境。
- 不要把 `[creature]` 候选直接按 `creature/creature.lst` 解析；样本中它常闭合到 `equipment/creature` 的宠物或宠物蛋。
- 不要把宠物蛋、宠物道具和 creature 本体混为同一层。
- 不要把资源预览字段写成客户端资源完整。

## 辅助对照提示

辅助对照 PVF 的 `stackable/stackable.lst` 注册项、package/booster 相关字段命中和礼包路径候选规模都更大。该差异只提示其他版本容器/礼包系统更丰富，不能覆盖主目标字段数量和闭合事实。
