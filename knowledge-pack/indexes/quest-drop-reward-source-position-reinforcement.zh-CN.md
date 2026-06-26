# Quest / Drop / Reward 资料线索补强

状态：已补强  
适用范围：任务注册链、任务类型与条件数据、任务奖励、任务怪物任务物、副本门票、独立掉落、清算翻牌、未注册任务风险  
边界：只读知识页；不证明任务可接、可完成、计数器增长、掉落概率、奖励发放、门票扣除、翻牌 UI、客户端资源或服务端放行。

## 核心结论

任务、掉落和奖励必须按父块分开读：

1. **任务注册链**：任务事实先走 `n_quest/quest.lst -> .qst`，不要只靠目录文件存在。
2. **任务条件**：`[int data]` 必须和 `[type] / [sub type]` 合读，不能按裸数字猜。
3. **固定奖励**：先读 `[reward type]`，再解释 `[reward int data]`。
4. **可选奖励**：`[reward selection int data]` 是可选候选，不等于实机 UI 可选或发放成功。
5. **任务怪物任务物**：`[monster reward item]` 是任务上下文掉任务物，不是普通怪物全局掉落。
6. **副本门票**：`dungeon/*.dgn [required item]` 是入场消耗静态字段，不证明扣除或入场成功。
7. **独立掉落与清算翻牌**：independent drop 和 clear reward 是独立系统，不能和任务奖励混写。

## 资料线索沉淀

- 资料线索把 quest、NPC、item、stackable、drop registry 放在同一链路中，说明任务类问题通常跨多个 registry。
- 工具源码线索能定位 `quest.lst`、`[grade]`、`[type]`、`[int data]`、任务视图、普通/额外/深渊掉落入口，但只作排查入口。
- 标签交叉线索召回了 reward/drop/quest/fatigue/ticket 等大量标签；跨文件域同名标签不能自动共享语义。
- 注释线索对部分 tag 有位置记录，但很多没有有效摘要；列义仍以主目标注册任务矩阵为准。
- 教程中的奖励、掉落、门票示例只提供形态方向，不能复用示例 ID。

## 已封存主目标事实的用法

- 主目标注册任务：2157 个，注册 `.qst` 全部存在且可读。
- 主目标注册条件：17 个 `[type]`、46 个 type/subtype 组合已完成静态矩阵。
- 未注册任务：1822 个 `.qst` 只作为风险桶，不能默认可接或可完成。
- `[condition under clear]` 已拆分多个 subtype；计时、被击、复活币、连击、背击、破招、对象条件等都需要实机验证计数口径。
- `[monster reward item]` 只说明任务上下文任务物候选，不证明普通掉落或实机概率。
- 任务奖励、独立掉落、清算翻牌和副本门票已经分桶封存，后续查询必须先选桶。

## 排查路线

遇到任务、奖励、掉落或门票问题时：

1. 先判断问题属于任务条件、固定奖励、可选奖励、任务怪物任务物、副本门票、独立掉落还是清算翻牌。
2. 任务相关先从 `quest.lst` 解析任务 ID，再读注册 `.qst`。
3. 条件类先读 `[type] / [sub type]`，再读 `[int data]`。
4. 奖励类先读 `[reward type]`，再按类型解析奖励 ID。
5. 掉落类先区分任务物、独立掉落、清算翻牌、普通怪物掉落，不要合并。
6. 门票类先从 dungeon registry 定位副本，再读 `[required item]`。
7. 资料里出现但主目标注册链没有的入口，只写“线索存在，主目标未确认”。

## 禁止推断

- 不能凭 `[int data]` 裸数字猜 NPC、物品、副本或怪物。
- 不能把未注册 `.qst` 写成可接任务。
- 不能把权重列、概率列或控制列写成已验证实机概率。
- 不能把任务怪物任务物写成普通怪物掉落。
- 不能把清算翻牌写成任务完成奖励。
- 不能用静态字段证明任务可完成、计数器增长、奖励到账、门票扣除、翻牌成功或客户端 UI 正常。

## 关联入口

- `indexes/quest-mainline-coverage-audit.zh-CN.md`
- `dictionaries/quest-type-condition-fields.zh-CN.md`
- `indexes/quest-type-condition-int-data-matrix.zh-CN.md`
- `indexes/quest-chain-requirement-boundary.zh-CN.md`
- `dictionaries/quest-drop-reward-ticket-fields.zh-CN.md`
- `indexes/quest-drop-reward-ticket-boundary.zh-CN.md`
- `task-cards/quest-drop-reward-ticket-readonly-audit.zh-CN.md`
