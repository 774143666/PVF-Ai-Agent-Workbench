# Quest / Drop / Reward / Ticket 字段词典

本文件只说明任务、奖励、任务怪物掉任务物、入场消耗、独立掉落和清算翻牌相关字段的静态含义与边界。所有数字 ID 都必须回到当前目标 PVF 的正确 `.lst` registry 解析。

## `n_quest/quest.lst`

状态：默认可用

含义：任务 registry。任务 ID 通过本表解析到 `n_quest/*.qst`。

边界：`n_quest/` 目录下存在未必等于任务已注册；写结论时以 `quest.lst` 的注册关系为第一入口。新增任务如果实机出现同名重复，需要检查目标环境是否同时存在 `.qst` 自动扫描和 `quest.lst` 注册加载路径，避免同一任务被两条路径加载。

## `[grade]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务类别字符串，例如 `` `[epic]` ``、`` `[achievement]` ``、`` `[normaly repeat]` ``。

边界：类别字符串不是奖励类型，也不证明任务在实机任务列表可见。

## `[difficulty]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务难度或显示/分类用的短代码。

边界：不能只凭该字段推出副本难度放行或实机难度要求。

## `[npc index]` / `[complete npc index]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务接取 NPC 与完成 NPC 的静态 ID 线索，应按 `npc/npc.lst` 解析。

边界：`-1` 不是 NPC ID；NPC 静态存在不证明实机中 NPC 可见、任务按钮可见或交付成功。

## `[job]` / `[grow type]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务职业或成长类型限制线索。`` `[all]` `` 表示样本中观察到的全职业写法。

边界：职业、转职、成长线和服务端放行可能还有运行逻辑；静态字段不证明所有角色都能接取。

## `[level]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务等级区间，常见列形为最小等级、最大等级。

边界：等级区间不等同于副本入场等级；副本入场另看 `dungeon/*.dgn` 的 `[minimum required level]` 等字段。

## `[pre required quest]`

状态：默认可用

适用：`n_quest/*.qst`

含义：前置任务块。块内数字按 `n_quest/quest.lst` 解析为任务 ID，可出现空块或多个前置块。

已验证边界：当前主目标实机样本证明，指定任务链中前置任务完成后，后继任务可见并可继续推进。

边界：前置静态存在不证明所有任务链、daily/event 开关、账号重复状态或历史完成记录满足。

## `[type]` / `[sub type]`

状态：需验证

适用：`n_quest/*.qst`

含义：任务目标类型与子类型。样本中可见 `` `[meet npc]` ``、`` `[seeking]` ``、`` `[condition under clear]` `` 等。

已验证边界：当前主目标实机样本证明 `` `[meet npc]` `` 任务类型可与对应 `[int data]` 一起完成 NPC 会面任务。

边界：当前只把 `` `[meet npc]` `` 升级为受限默认结论；全量任务类型矩阵尚未完成。计数、破招、连击、限时、评分等条件类型必须先补主目标只读样本，不能凭字段名或旧经验写结论。

## `[int data]`

状态：需验证

适用：`n_quest/*.qst`

含义：任务目标数据块。含义由 `[type]` 和 `[sub type]` 决定：会面任务可指向 NPC，收集任务可出现物品 ID/数量，通关条件可出现副本、难度或时间类列。

已验证边界：当前主目标实机样本证明，`` `[meet npc]` `` 语境中的 `[int data]` 可指向会面目标并完成任务；任务怪物掉任务物和任务奖励仍按各自父块解释。

边界：这是强上下文字段，不能把所有 `[int data]` 的第一列都写成物品、NPC 或副本。数字必须按父块语义选择正确 registry。除已采样语境外，任务条件编辑一律按“需验证”处理。

## `[dungeon info]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务关联副本块。样本列形可见副本 ID 与附加控制值；副本 ID 按 `dungeon/dungeon.lst` 解析。

边界：任务关联副本不等于副本入场条件；入场消耗、等级、地图和客户端资源另验。

## `[monster reward item]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务进行中的怪物奖励物/任务物掉落配置。样本列可同时包含怪物 ID、难度或控制值、任务物 ID、数量、概率或数量控制值。

已验证边界：当前主目标实机样本证明，指定普通任务中目标怪物可掉落任务物，拾取后满足任务并可提交。

类型边界：运行样本显示，该块中的任务掉落物应优先使用 `[stackable type] [quest]` 或同类任务物 stackable。把普通 `[material]` 类型 stackable 直接放入任务怪物奖励物语境有启动崩溃风险；除非目标 PVF 已有同类正样本并完成实机验证，否则不要这样写。

边界：它是任务上下文里的掉任务物，不是普通怪物全局掉落，也不能替代 `.mob` 掉落或独立掉落表。任务物 ID 仍按 `stackable/stackable.lst` 等正确 registry 解析，并要和任务 `[int data]` 收集目标保持一致。

## `[reward type]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务完成奖励类型。主目标样本可见 `` `[item]` ``、`` `[title]` `` 等；后续奖励数据要按该类型解释。

边界：不要只看 `[reward int data]` 裸数字；必须先读 `[reward type]`。

## `[reward int data]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务完成固定奖励数据块。`[reward type]` 为 `` `[item]` `` 时，样本可见物品 ID/数量成对列；`` `[title]` `` 时样本奖励 ID 可闭合到 `equipment` 的称号装备。

已验证边界：当前主目标实机样本证明，指定任务完成后可按 `[reward type] [item]` 与 `[reward int data]` 发放 stackable 奖励。

边界：同一数字可能同时存在于 `stackable`、`n_quest`、`monster` 等多个 registry。任务奖励上下文要按奖励类型和父块选择 registry，不得凭数字大小猜。

## `[reward selection int data]`

状态：默认可用

适用：`n_quest/*.qst`

含义：任务完成可选奖励数据块。样本可见多组物品 ID/数量，常用于设计图或装备相关候选。

边界：静态候选存在不证明实机 UI 能正常选择、背包空间足够、服务端发放成功或客户端资源完整。

## `dungeon/dungeon.lst`

状态：默认可用

含义：副本 registry。任务 `[dungeon info]`、副本入场和地图链路中的副本 ID 应通过本表解析。

边界：不要把同一个数字在 `quest.lst`、`dungeon.lst`、`stackable.lst` 等 registry 的命中混用。

## `[required item]`

状态：默认可用

适用：`dungeon/*.dgn`

含义：副本入场消耗/门票静态字段。样本列形可见物品 ID、数量和控制值；物品 ID 按 `stackable/stackable.lst` 解析。

已验证边界：当前主目标实机样本证明，指定副本 `[required item]` 会拦截无票/数量不足入场，数量满足时放行并扣除对应数量。

边界：当前样本不证明第三列所有取值、多门票组合、疲劳、组队、深渊或所有副本通用。

## `[minimum required level]`

状态：默认可用

适用：`dungeon/*.dgn`

含义：副本静态最低入场等级。

已验证边界：当前主目标实机样本证明，提高指定副本该字段后，低等级角色看不见该副本或被副本列表过滤。

边界：不等同于任务 `[level]`，也不证明服务端最终等级校验只看这一项。

## `etc/independentdrop.lst`

状态：默认可用

含义：独立掉落 registry。ID 解析到 `etc/independentdrop/*.etc`。

边界：独立掉落表不是任务奖励表，也不是普通怪物 `.mob` 掉落表。

## `[list]`

状态：默认可用

适用：`etc/independentdrop/*.etc`

含义：独立掉落候选列表。样本列形为物品 ID 与权重/数值成对出现；候选 ID 要按目标上下文闭合到 `stackable` 或 `equipment` 等 registry。

边界：静态权重或数值不能直接写成实机概率；实际掉落、地图调用、难度加成和服务端逻辑需另验。

## `etc/itemdropinfo_clearreward.etc`

状态：默认可用

含义：清算/翻牌奖励相关配置文件。主目标可见 `[drop prob]`、`[drop item type prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]` 等块。

边界：它不是任务完成奖励，也不是 NPC 商店价格表。静态翻牌表不能证明结算 UI、金币消耗、翻牌成功、物品发放或 PC 房加成实机生效。

## `[gold card blank item]` / `[pcroom card blank item]`

状态：默认可用

适用：`etc/itemdropinfo_clearreward.etc`

含义：清算翻牌空白/补偿类候选块。样本中候选 ID 可闭合到 `stackable`。

已知负边界：当前主目标实机样本中，替换 `[gold card blank item]` 没有稳定接管可见免费/付费翻牌奖励，实际仍可能翻出随机装备。

边界：只属于清算翻牌上下文，不能拿来解释任务 `[reward int data]` 或独立掉落 `[list]`；不要把它作为确定性清算奖励修改入口。
