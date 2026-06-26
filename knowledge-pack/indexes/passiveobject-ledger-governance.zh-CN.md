# PassiveObject 账本治理规则

状态：默认可用

用途：约束 PassiveObject / AttackInfo / Hitbox 只读审计如何落账，防止主账本继续膨胀、跨主线污染和辅助对照外推。

## 入口顺序

1. 先读本文件。
2. 再读 `passiveobject-coverage-ledger.zh-CN.md` 查已覆盖、未闭合和风险边界。
3. 按问题读取 hitbox、create recursion、lifecycle / homing 分账本。
4. 新增小桶前，先决定是写入主账本短结论，还是写入分片长结论。

## 文件职责

| 文件 | 职责 | 禁止事项 |
| --- | --- | --- |
| `passiveobject-coverage-ledger.zh-CN.md` | 主账本，只收每桶短结论、边界、下一步。 | 禁止塞完整 frame 坐标、长 create block、全文式流程。 |
| `passiveobject-hitbox-ani-sample-ledger.zh-CN.md` | ANI 帧级 attack / damage box 正样本和反样本。 | 同族大量坐标重复出现时，不再继续堆到主样本账本。 |
| `passiveobject-create-recursion-ledger.zh-CN.md` | create source-target、registry route、recursion stop。 | 禁止重复整段 object / action / atk 过程。 |
| `passiveobject-lifecycle-homing-ledger.zh-CN.md` | destroy、hp、homing、active status runtime-risk 样本。 | 禁止把运行时轨迹、命中结果或销毁时序写成静态结论。 |
| `passiveobject-nonmonster-sample-chain.zh-CN.md` | 较早期的紧凑样本入口。 | 不作为新长表堆放位置。 |
| prefix shard | 同族长明细，例如 `new_event`、`SPC`、`despairtower` 等。 | 主账本只保留路由行，不复制整段长明细。 |

## 允许进入当前主线

| 范围 | 口径 |
| --- | --- |
| `passiveobject/` 下的 `.obj/.act/.atk/.ani` | 当前主线主体。 |
| `actionobject/...` | 是 passiveobject 文件路径前缀，不等于 Monster 主线。 |
| `character/common` 或职业目录下的 passiveobject 文件 | 可作为 PassiveObject / AttackInfo / Hitbox 样本。 |
| `equipmentpassiveobject/...` | 只允许保留已验证且确实说明 passiveobject 机制的历史样本；默认不扩展。 |
| 上游 monster / aicharacter / key / map | 只能作为创建来源、放置来源、registry 边界或上下文说明。 |
| monster / aicharacter / equipment / quest / stackable 数字或 token | 只能作为 registry collision、噪音或上下文风险提示。 |
| 辅助对照 PVF | 只能写“辅助对照中观察到”或“目标集差异提示”。 |

## 禁止和冻结

- 不在当前主线新增 Equipment、Monster、NPC shop、dungeon、quest 的正式结论。
- `equipmentpassiveobject/requiem/003/boom` 与 `equipmentpassiveobject/requiem/003/boom2` 冻结为历史 cross-boundary PassiveObject 样本；除非未来任务明确要求 equipmentpassiveobject 机制，否则不再沿该方向扩展。
- 不写外部线索、旧材料或报告的定位信息。
- 不把辅助对照独有字段、标签、token、列形写成主目标事实。
- 不写客户端资源完整性结论；Script 引用不能证明 ImagePacks2 / NPK 资源齐全。

## 分片触发条件

- 单个账本超过约 100KB 后，只追加短结论和路由行。
- 同一目录族已有 5 个以上相关小桶，或同族 ANI frame 坐标开始重复堆叠时，长明细写入 prefix shard。
- 主账本保留：target bucket、registry route、`obj -> act -> atk -> ani` 链路摘要、create result、runtime risk、shard pointer。
- 如果一个小桶需要追加超过约 1200 个中文字符，或需要在同一个大账本追加超过 3 行，先新建或更新分片。
- 新分片必须接入 `knowledge-index.json`，并通过 manifest 刷新脚本加入 `MANIFEST.json`。

## 落账前检查

| 检查项 | 要求 |
| --- | --- |
| 主目标事实 | 已经过主目标 PVF 只读观察；辅助对照不能替代。 |
| 数字 ID | 已按当前父块和上下文走正确 `.lst` registry。 |
| create chain | `[CREATE PASSIVEOBJECT] [INDEX]` 走 `passiveobject/passiveobject.lst`。 |
| monster / aicharacter 边界 | `[SUMMON MONSTER]`、`[WHICH] [MONSTER]`、`[SUMMON APC]` 等不改走 passiveobject registry。 |
| hitbox | `.atk` 不提供坐标；坐标只来自 `.ani` 反编译帧的 `[ATTACK BOX]` / `[DAMAGE BOX]`。 |
| 跨主线内容 | 只写边界、碰撞、来源或冻结说明，不扩成新主线。 |
| 运行风险 | 命中、伤害、卡肉、击退、浮空、追踪轨迹、销毁时序、同步都必须标为静态只读不能证明。 |
| 文档纯净 | 不含外部线索、旧材料或报告的定位信息。 |
| 收尾 | `MANIFEST.json` 已刷新，知识包检查已通过。 |
