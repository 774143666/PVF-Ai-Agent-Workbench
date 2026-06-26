# Quest / Drop / Reward / Ticket Boundary

状态：默认可用

用途：作为任务奖励、任务怪物掉任务物、副本门票、独立掉落和清算翻牌边界的封存矩阵。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

重要边界：本文不是全量任务类型矩阵。`[type]`、`[sub type]`、`[int data]` 只封存“必须合读、不能裸猜”的路由原则和少量代表样本；计数、破招、连击、限时、评分、特定动作等任务条件类型仍需单独建立 `Quest Type / Condition Int Data Matrix`。

## 默认读法

1. `safety/README.zh-CN.md`
2. `dictionaries/quest-drop-reward-ticket-fields.zh-CN.md`
3. `task-cards/quest-drop-reward-ticket-readonly-audit.zh-CN.md`
4. 本矩阵
5. 需要闭合售卖物或奖励物时，再读 `encyclopedia/pvf-file-types/equipment-stackable.zh-CN.md`

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| 任务 registry | `n_quest/quest.lst` 注册 2157 个任务 ID；`n_quest/` 下可见的 `.qst` 文件多于注册项。 | 任务事实以 `quest.lst` 注册为入口，不能只靠目录文件存在。 |
| 任务基础字段 | `.qst` 中观察到 `[grade]`、`[difficulty]`、`[npc index]`、`[complete npc index]`、`[job]`、`[grow type]`、`[level]`、`[type]`、`[sub type]`、`[int data]`。 | 当前只封存字段存在和合读原则；尚未封存全量任务类型枚举与每类 `[int data]` 列义。 |
| 任务链 | `[pre required quest]` 在主目标任务样本中广泛出现，可为空块、单块或多块；块内任务 ID 按 `n_quest/quest.lst` 解析。 | 当前主目标已有前置/后继/meet-npc 任务链实机样本；不外推到所有任务链、daily/event 开关或账号重复状态。 |
| 任务关联副本 | `[dungeon info]` 在任务样本中出现，样本副本 ID 可按 `dungeon/dungeon.lst` 闭合。 | 任务关联副本不等于副本入场条件。 |
| 固定奖励 | `[reward type]` 与 `[reward int data]` 成对阅读；`` `[item]` `` 样本可按物品 ID/数量解释，`` `[title]` `` 样本可闭合到 `equipment` 称号装备。 | 不先读 `[reward type]` 就不能解释 `[reward int data]` 裸数字。 |
| 可选奖励 | `[reward selection int data]` 可出现多组候选 ID/数量；样本候选闭合到 `stackable` 设计图。 | 静态候选不证明实机 UI 可选、服务端发放或客户端资源完整。 |
| 任务怪物奖励物 | `[monster reward item]` 在 327 个任务文件中命中；样本列包含怪物、控制值、任务物 ID、数量和概率/数量控制值。 | 当前主目标已有目标怪物掉任务物、任务满足、提交和奖励发放实机样本；仍不等同普通怪物掉落主线。任务物应优先闭合到 quest 类 stackable；普通 material 类 stackable 作为任务怪物奖励物有崩溃风险样本。 |
| 副本门票/入场 | `dungeon/*.dgn` 中 `[required item]` 命中 134 个文件；样本列形为物品 ID、数量和控制值。`[minimum required level]` 命中 336 个文件。 | 当前主目标已有门票数量不足拦截、数量满足放行和扣除样本，也有最低等级列表过滤样本；不证明第三列、多门票、疲劳、组队或深渊。 |
| 独立掉落 | `etc/independentdrop.lst` 注册 10 个独立掉落 ID；对应文件使用 `[list]` 列出候选 ID 与权重/数值。 | 静态权重不能直接写成实机概率，也不等同任务奖励。 |
| 清算翻牌 | `etc/itemdropinfo_clearreward.etc` 可见 `[drop prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]` 等块。 | 当前主目标已证明指定副本 `[basis level]` 会影响付费翻牌费用选行；`[gold card blank item]` 替换不是确定性可见奖励入口。装备池、免费金币公式和概率仍未证明。 |

## 代表链路

| 类型 | 链路 | 可复用结论 |
| --- | --- | --- |
| 任务定位 | 任务 ID -> `n_quest/quest.lst` -> `n_quest/*.qst`。 | 任务文件路径和大小写不能替代 registry。 |
| 接取与完成 NPC | `.qst [npc index]` / `[complete npc index]` -> `npc/npc.lst`。 | `-1` 不解析为 NPC；NPC 可见性需要实机确认。 |
| 任务前置 | `.qst [pre required quest]` -> `n_quest/quest.lst`。 | 多个前置块要逐块读，不要合并成一个裸列表。 |
| 任务收集物 | `.qst [type]` 为 `` `[seeking]` `` 时，`[int data]` 样本可按物品 ID/数量读取。 | 该解释只在对应父块上下文成立。 |
| 任务固定奖励 | `.qst [reward type]` -> `[reward int data]` -> `stackable` 或 `equipment`。 | 同一数字在多 registry 命中时，以父块和奖励类型决定。 |
| 任务可选奖励 | `.qst [reward selection int data]` -> 候选 ID/数量 -> 商品 registry。 | 可选候选存在不证明实机可选择或发放。 |
| 任务怪物掉任务物 | `.qst [monster reward item]` -> 怪物/控制值/任务物 ID/数量；任务物 ID -> `stackable`，并核查 `[stackable type] [quest]` 或同类任务物结构。 | 不把它并入普通 `.mob` 掉落封存主线；非 quest 类型任务物必须有目标 PVF 同类正样本和实机验证。 |
| 副本门票 | `dungeon/dungeon.lst` -> `dungeon/*.dgn [required item]` -> `stackable` 门票/材料。 | 当前主目标已有数量检查和扣除样本；第三列、多门票、疲劳、组队和深渊仍需另验。 |
| 独立掉落 | `etc/independentdrop.lst` -> `etc/independentdrop/*.etc [list]` -> 候选 ID/权重。 | 不证明实机概率和调用场景。 |
| 清算翻牌 | `etc/itemdropinfo_clearreward.etc` -> gold card / pcroom / ref table 块。 | 单列清算系统，不混入任务或商店。 |

## 代表 ID 闭合

| 观察 | 主目标闭合 |
| --- | --- |
| `3062` | 在任务固定奖励样本中按 `stackable` 解析为材料类物品。 |
| `4109` | 在任务怪物奖励物和任务目标样本中按 `stackable` 解析为任务物；同号也命中 `n_quest/quest.lst`，必须靠父块区分。 |
| `4254` / `4253` | 在任务目标或奖励上下文按 `stackable` 解析为任务物；同号也可命中任务 registry，不能裸猜。 |
| `26607` | `` `[title]` `` 奖励样本按 `equipment` 解析为称号装备。 |
| `2654025` / `2654030` | 可选奖励样本按 `stackable` 解析为设计图。 |
| `3340` | 副本 `[required item]` 样本按 `stackable` 解析为入场消耗材料。 |
| `2651400` / `690060026` | 独立掉落 `[list]` 样本按 `stackable` 解析为候选物。 |
| `7279` / `7454` / `7455` | 清算翻牌空白/PC 房候选样本按 `stackable` 解析。 |

## 字段边界

| 字段 | 静态可见含义 | 不可静态证明 |
| --- | --- | --- |
| `[level]` | 任务等级区间。 | 副本入场等级或服务端最终等级规则。 |
| `[pre required quest]` | 前置任务 ID 块。 | 已有一个当前主目标任务链样本；不证明所有任务链状态已满足。 |
| `[int data]` | 任务目标数据，依赖 `[type]` / `[sub type]`。 | 任意裸数字固定代表物品、NPC、怪物或副本。 |
| `[dungeon info]` | 任务关联副本线索。 | 入场消耗、地图资源或实机可进入。 |
| `[monster reward item]` | 任务上下文怪物掉任务物配置；任务物 ID 要和任务 `[int data]` 收集目标保持一致。 | 已有一个当前主目标任务掉落样本；不证明普通怪物掉落或真实掉落概率。非 quest 类型 stackable 有崩溃风险样本。 |
| `[reward int data]` | 固定奖励数据块。 | 已有当前主目标任务物品奖励发放样本；不证明背包不足、可选奖励 UI 或所有奖励类型。 |
| `[reward selection int data]` | 可选奖励候选块。 | 实机选择、发放和客户端资源完整。 |
| `[required item]` | 副本入场消耗/门票静态字段。 | 已有当前主目标数量检查和扣除样本；第三列、多门票、疲劳、组队和深渊仍未证明。 |
| `[minimum required level]` | 副本静态最低等级。 | 已有当前主目标列表过滤样本；不证明最终等级校验只有这一项。 |
| `independentdrop [list]` | 独立掉落候选 ID/权重或数值。 | 实机概率和调用场景。 |
| `clearreward gold card` | 结算翻牌相关成本、候选和引用表。 | 付费翻牌费用选行已有当前主目标样本；装备奖励池、免费金币公式、概率和发放路径仍未证明。 |

## 辅助对照提示

辅助对照 PVF 同样存在 `n_quest/quest.lst`、`etc/independentdrop.lst`、任务奖励、任务怪物奖励物、副本 `[required item]` 和 `etc/itemdropinfo_clearreward.etc`，但注册规模更大：任务、独立掉落、副本和资源数量均高于主目标。辅助结果只提示“同类结构可能扩展”，不能覆盖主目标事实。

## 封存验收

- 能从任务 ID 闭合到 `quest.lst` 和 `.qst`。
- 能解释 `[int data]` 为什么必须依赖父块上下文。
- 能明确说明本文不能支持全量任务类型编辑；任务条件类型矩阵仍是待补主线。
- 能区分任务固定奖励、任务可选奖励、任务怪物掉任务物、独立掉落、清算翻牌和副本门票。
- 能把奖励或掉落候选 ID 按正确 registry 闭合到 `equipment` 或 `stackable`。
- 能说明任务怪物奖励物是否为 quest 类 stackable，并知道非 quest 类型不能默认生产使用。
- 新增完整任务时，能排查 `.qst` 自动扫描和 `quest.lst` 注册双加载导致同名重复的风险。
- 能明确说出静态只读不能证明任务可接、奖励发放、门票扣除、副本入场、掉落概率、清算翻牌或服务端放行。
