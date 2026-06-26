# PassiveObject / AttackInfo / Hitbox 短入口路由

状态：默认可用

用途：作为已封存 PassiveObject / AttackInfo / Hitbox 主线的第一层压缩入口。本文不新增 PVF 观察，不替代明细账本，不授权写 PVF；它只规定默认读法、深账本触发条件和静态边界。

## 默认结论

- 本主线已完成静态结构覆盖闭环，日常问题默认只做复核、引用和风险说明。
- 默认不重开 actionobject/SPC、actionobject/monster 或其他目录型广域扩样本。
- 默认不打开大账本；只有明确命中细分问题，或验收入口确认“缺口待补”时，才读对应深账本。
- 深账本统一从 `indexes/passiveobject-deep-ledger-router.zh-CN.md` 选择，不从总路由默认直开。
- 静态账本不能证明命中、伤害、卡肉、击退、浮空、追踪轨迹、销毁时序、同步、PVP 最终规则或客户端资源完整性；这些问题必须走运行测试、目标 PVF 实验或客户端资源链检查。

## 默认读法

1. `indexes/passiveobject-attackinfo-hitbox-completion-audit.zh-CN.md`
2. `indexes/passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md`
3. `indexes/passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md`
4. `indexes/passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md`
5. `dictionaries/attackinfo-atk-fields.zh-CN.md`
6. `dictionaries/passiveobject-obj-fields.zh-CN.md`
7. `dictionaries/passiveobject-action-fields.zh-CN.md`
8. `task-cards/passiveobject-nonmonster-readonly-audit.zh-CN.md`

## 深账本触发条件

先读 `indexes/passiveobject-deep-ledger-router.zh-CN.md`，再按问题类型只打开一个最匹配的深账本。

| 问题类型 | 才打开的深账本 |
| --- | --- |
| 总体覆盖、样本面、已观察目录族 | `indexes/passiveobject-coverage-ledger.zh-CN.md` |
| 生命周期、homing、destroy、hold、移动/销毁边界 | `indexes/passiveobject-lifecycle-homing-ledger.zh-CN.md` |
| ANI 帧、attack box、damage box、命中盒静态字段 | `indexes/passiveobject-hitbox-ani-sample-ledger.zh-CN.md` |
| create/summon 递归、父块上下文、registry 走向 | `indexes/passiveobject-create-recursion-ledger.zh-CN.md` |
| 非 Monster 来源 PassiveObject 链路 | `indexes/passiveobject-nonmonster-sample-chain.zh-CN.md` |
| `.atk` 状态、PVP 块、owner/ANI 闭合 | `indexes/attackinfo-status-pvp-ledger.zh-CN.md`、`indexes/attackinfo-pvp-block-inventory.zh-CN.md` 和对应职业链路账本 |
| Monster 创建 PassiveObject 或 actionobject 交叉问题 | `indexes/monster-created-passiveobject-obj-observed-tag-router.zh-CN.md`、`indexes/monster-created-passiveobject-act-observed-tag-router.zh-CN.md` |

## 冷路由规则

- 大账本保留为审计证据和细分问题索引，不因体量删除。
- 默认答复优先引用完成审计、静态验收汇报、验收清单和字段字典。
- 如果用户只问“是否还要继续补 PassiveObject / AttackInfo / Hitbox”，回答应以“无需继续广域穷举，除非出现明确缺口或运行测试需求”为准。
- 如果用户明确问某个字段、父块、registry 或链路，先查默认读法；默认读法无法覆盖时，只打开一个最匹配的深账本。
- 如果需要新增事实，必须重新走主目标 PVF 只读验证；辅助对照只能作为差异提示，不能提升为主目标事实。
