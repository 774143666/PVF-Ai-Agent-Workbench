# PassiveObject / AttackInfo / Hitbox 完成审计

状态：默认可用

用途：对 PassiveObject / AttackInfo / Hitbox 长程主线做逐项完成审计。本文不是 PVF 写入配方，不新增 PVF 观察，不证明实机运行；它只判断当前 Workbench 是否已经满足“静态结构覆盖闭环，并明确静态只读无法证明的运行风险”这一目标。

## 完成判定

| 项 | 判定 |
| --- | --- |
| 是否保持 PassiveObject / AttackInfo / Hitbox 主线 | 已满足 |
| 是否基于主目标只读结论整理 Workbench | 已满足 |
| 是否具备静态结构覆盖闭环 | 已满足 |
| 是否明确静态只读无法证明的运行风险 | 已满足 |
| 是否仍要求继续广域采样 | 不要求 |
| 是否等于实机验证完成 | 不等于 |

结论：当前 Workbench 已可对 PassiveObject / AttackInfo / Hitbox 主线作静态结构验收完成判定。后续不应继续按目录扩样本；只有新问题落入“缺口待补”时，才补一个最小主目标只读样本。

## 逐项审计

| 要求 | 当前证据 | 审计结论 |
| --- | --- | --- |
| 主线没有跑偏 | `passiveobject-ledger-governance.zh-CN.md` 冻结 Equipment 历史样本，说明 `actionobject/monster/...` 是 PassiveObject/actionobject 路径前缀；`passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md` 明确排除 Equipment、Monster、NPC shop、dungeon、quest、drop 扩展。 | 已满足。 |
| 主目标只读事实优先 | create、hitbox、lifecycle、PVP 账本均写明主目标只读观察；辅助对照只写差异提示，不能覆盖主目标结论。 | 已满足。 |
| PassiveObject registry 路由闭合 | `passiveobject-create-recursion-ledger.zh-CN.md` 记录 `[CREATE PASSIVEOBJECT] [INDEX]` 走 `passiveobject/passiveobject.lst`，`[SUMMON MONSTER]` 走 `monster/monster.lst`，`[SUMMON APC]` 走 `aicharacter/aicharacter.lst`；同时记录高位未命中 ID 保留风险。 | 已满足；未命中 ID 已作为风险处理。 |
| PassiveObject `.obj/.act` 结构覆盖 | `passiveobject-obj-fields.zh-CN.md`、`passiveobject-action-fields.zh-CN.md`、`passiveobject-lifecycle-homing-ledger.zh-CN.md` 与 create 账本覆盖对象字段、action、trigger、behavior、create、summon、destroy、hp、homing 等结构。 | 已满足；运行时序另列风险。 |
| AttackInfo `.atk` 结构覆盖 | `attackinfo-atk-fields.zh-CN.md` 与 `attackinfo-status-pvp-ledger.zh-CN.md` 覆盖 `.atk` 基础字段、`[active status]` 和 PVP 相关字段边界；`.atk` 不提供 hitbox 坐标。 | 已满足。 |
| PVP `.atk` 块审计闭合 | `attackinfo-pvp-block-inventory.zh-CN.md` 记录 40 个 PVP `.atk` 均读到闭合 `[/pvp]`；分桶账本记录 31 个到 owner/ANI 或 owner/action/ANI 观察点，9 个 zrr_skill 保留 owner 未闭合或 ANI 断链风险。 | 已满足；未闭合项已归为结构风险，不再猜 owner。 |
| Hitbox 帧级证据闭合 | `passiveobject-hitbox-ani-sample-ledger.zh-CN.md` 记录 `[BASE ANI]`、`[SUB ANI]`、`[ATTACK BOX]`、`[DAMAGE BOX]`、no-box、空图有盒、sidecar 和断链样本；hitbox 坐标只认 `.ani` 反编译帧。 | 已满足；坐标单位和实机碰撞另列风险。 |
| 大账本治理与收口 | `passiveobject-ledger-governance.zh-CN.md` 要求大账本只追加短结论或分片；`passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md` 明确旧“继续扩大抽样”提示被收口。 | 已满足。 |
| 静态不可证明风险已明确 | `passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md` 和验收清单列出命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步、PVP 最终规则、客户端资源完整性均不能由静态只读证明。 | 已满足。 |
| Workbench 纯净性和路由 | `knowledge-index.json` 已接入验收汇报、验收清单、复核账本和本审计；`MANIFEST.json` 由刷新脚本维护；知识包检查作为落账验收门。 | 已满足；当前知识包检查、环境检查和工作区健康检查已通过。 |

## 历史“继续扩样本”提示处理

部分早期大账本保留“继续扩大抽样”或“后续补全分桶”文字。该类文字现在不作为默认下一步，原因如下：

- 它们产生于收口治理前，目标是扩大样本面。
- 当前验收清单和复核账本已经改用“10 项验收门”判断是否真有缺口。
- 当前 10 项验收门未发现必须继续广域采样的结构缺口。
- 因此，旧提示仅作为历史上下文；实际执行顺序以验收汇报、验收清单、复核账本和本完成审计为准。

## 完成后的默认动作

| 场景 | 动作 |
| --- | --- |
| 用户问当前主线是否还要继续扩样本 | 回答“不默认继续”，并引用验收汇报与完成审计。 |
| 用户问某字段或链路缺口 | 先查验收三件套；只有缺口待补时才补最小主目标只读样本。 |
| 用户问命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步或 PVP 规则 | 说明静态只读不能证明，需另走目标 PVF 实验或实机测试。 |
| 用户问客户端资源是否完整 | 说明 Script 引用不能证明资源完整，需另走客户端资源链检查。 |

## 审计结论

PassiveObject / AttackInfo / Hitbox 主线的静态结构覆盖闭环已经达到可验收状态；静态只读无法证明的运行风险已经单独列明。当前没有继续广域采样的结构性理由。
