# PassiveObject 深账本路由

状态：默认可用

用途：把 PassiveObject / AttackInfo / Hitbox 的大账本降级为按需读取资料。默认任务先读 `indexes/passiveobject-attackinfo-hitbox-compact-router.zh-CN.md`；只有命中下表问题时，才打开对应深账本。

## 默认规则

- 不默认读取深账本。
- 深账本用于追样本、覆盖面、父块上下文、registry 路由和静态边界，不直接证明运行效果。
- 命中、伤害、卡肉、击退、浮空、追踪轨迹、销毁时序、同步、PVP 规则和客户端资源完整性都不能由静态账本直接证明。
- 新增事实必须重新读目标 PVF；辅助对照、旧报告和历史样本只能作线索。

## 深账本选择

| 问题 | 打开文件 | 说明 |
| --- | --- | --- |
| 是否已覆盖某类 PassiveObject / AttackInfo / Hitbox 样本 | `indexes/passiveobject-coverage-ledger.zh-CN.md` | 主覆盖账本，只用于看覆盖面和未闭合项。 |
| create/summon 递归、父块上下文、`[CREATE PASSIVEOBJECT] [INDEX]` 走向 | `indexes/passiveobject-create-recursion-ledger.zh-CN.md` | 追 registry、上下游链和未解析 ID。 |
| ANI 帧级 `[ATTACK BOX]` / `[DAMAGE BOX]`、命中盒静态坐标 | `indexes/passiveobject-hitbox-ani-sample-ledger.zh-CN.md` | 只证明静态帧盒存在，不证明手感或命中结果。 |
| destroy、hp destroy、homing、active status、生命周期风险 | `indexes/passiveobject-lifecycle-homing-ledger.zh-CN.md` | 只作生命周期和 homing 静态样本账本。 |
| 非 Monster 来源 PassiveObject 链路 | `indexes/passiveobject-nonmonster-sample-chain.zh-CN.md` | 较紧凑的样本链入口。 |
| `.atk` 状态、PVP 块、owner/ANI 闭合 | `indexes/attackinfo-status-pvp-ledger.zh-CN.md`、`indexes/attackinfo-pvp-block-inventory.zh-CN.md` | 只证明 `.atk` 结构和候选边界。 |
| Monster 创建 PassiveObject 或 actionobject 交叉问题 | `indexes/monster-created-passiveobject-obj-observed-tag-router.zh-CN.md`、`indexes/monster-created-passiveobject-act-observed-tag-router.zh-CN.md` | 只在问题跨到 Monster 创建链时使用。 |

## 落账治理

新增或整理 PassiveObject 账本前，先读：

- `indexes/passiveobject-ledger-governance.zh-CN.md`
- `indexes/passiveobject-attackinfo-hitbox-compact-router.zh-CN.md`

超过一个账本需要补长表时，应优先新建分片或写短结论加路由，不继续把所有明细堆进总账本。

