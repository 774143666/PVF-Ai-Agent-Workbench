# PassiveObject / AttackInfo / Hitbox 验收复核账本

状态：默认可用

用途：记录当前 Workbench 对 PassiveObject / AttackInfo / Hitbox 三轴主线的收口复核结果。本文不是 PVF 写入配方，不新增 PVF 观察，不证明实机运行；它用于决定当前主线是否还需要继续广域采样，或是否应改为最小缺口补样本与运行风险另列。

## 复核范围

- 复核对象：当前 Workbench 已整理的 PassiveObject / AttackInfo / Hitbox 三轴资料。
- 复核方式：只读 Workbench 路由与既有主目标只读结论；本账本不打开 PVF、不写 PVF、不改客户端。
- 判定原则：能路由到主目标结论、字段词典、样本账本、registry 规则和风险边界，即判为静态可验收或结构可验收但保留风险；命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步和客户端资源完整性不在静态验收内。

## 总结论

| 项 | 结论 |
| --- | --- |
| 是否发现必须继续广域采样的结构缺口 | 未发现 |
| 是否继续按目录扩样本 | 不默认继续 |
| 是否可进入静态结构验收归档 | 可以进入 |
| 是否等于实机验证完成 | 不等于 |
| 是否等于长程主目标完成声明 | 不等于，本账本只完成收口复核记录 |

## 10 项复核表

| # | 验收门 | 复核结果 | 证据路由 | 剩余风险 | 后续动作 |
| ---: | --- | --- | --- | --- | --- |
| 1 | PassiveObject 数字 ID 与上下文 registry 路由 | 静态可验收 | `passiveobject-coverage-ledger.zh-CN.md`、`passiveobject-create-recursion-ledger.zh-CN.md`、`passiveobject-action-fields.zh-CN.md` | 同号数字仍必须按父块判断；新入口仍需重新解析。 | 不再为 registry 碰撞扩新主线。 |
| 2 | `.obj` 字段入口与边界 | 静态可验收 | `passiveobject-obj-fields.zh-CN.md`、`passiveobject-coverage-ledger.zh-CN.md`、`passiveobject-lifecycle-homing-ledger.zh-CN.md` | 新目录若出现未登记字段，只能按字段缺口补样本。 | 不再按目录穷举 `.obj`。 |
| 3 | `.act` action / trigger / behavior / create / summon 结构 | 静态可验收 | `passiveobject-action-fields.zh-CN.md`、`passiveobject-create-recursion-ledger.zh-CN.md` | owner 链和运行触发时序仍不能静态证明。 | 不再为了增加 action 样本扩桶。 |
| 4 | `[CREATE PASSIVEOBJECT]` 递归、随机候选、回环停止、未命中 ID | 结构可验收但保留风险 | `passiveobject-create-recursion-ledger.zh-CN.md` | 已知 `[CREATE PASSIVEOBJECT]` 规模为 1653；当前范围内 create 块均有 `[INDEX]`，空 INDEX 形态为 0；高位未命中 ID、静态回环和 owner 未闭合仍保留风险。 | 只在新任务命中未登记父块时补最小样本。 |
| 5 | lifecycle / destroy / hp / homing 结构 | 结构可验收但保留风险 | `passiveobject-lifecycle-homing-ledger.zh-CN.md`、`passiveobject-obj-fields.zh-CN.md` | 已知 destroy/hp/homing 为结构块；生命单位、轨迹、销毁时序和公式解释只能运行验证。 | 不再用目录采样补运行语义。 |
| 6 | `.atk` 基础字段与 `[active status]` 结构 | 静态可验收 | `attackinfo-atk-fields.zh-CN.md`、`attackinfo-status-pvp-ledger.zh-CN.md` | `.atk` 不提供 hitbox 坐标；异常状态公式、概率、持续、抗性和伤害结算不可静态硬推。 | `.atk` 继续只记录结构与列形。 |
| 7 | `.atk [pvp] ... [/pvp]` 静态块审计 | 静态可验收 | `attackinfo-pvp-block-inventory.zh-CN.md`、`attackinfo-pvp-chain-pilot-ledger.zh-CN.md` | 已知 40 个 PVP `.atk` 块已读到闭合；PVP 最终规则仍是运行风险。 | 不再为 PVP 块数量继续扩样本。 |
| 8 | PVP owner / ANI 链路 | 结构可验收但保留风险 | `attackinfo-pvp-gunner-chain-ledger.zh-CN.md`、`attackinfo-pvp-fighter-chain-ledger.zh-CN.md`、`attackinfo-pvp-mage-chain-ledger.zh-CN.md`、`attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`、`attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`、`attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md` | 31/40 已到 owner/ANI 或 owner/action/ANI 观察点；9/40 zrr_skill 保留 owner 未闭合或 ANI 断链风险。 | 不在 passiveobject 目录继续猜 zrr owner。 |
| 9 | Hitbox ANI 帧级证据 | 静态可验收 | `passiveobject-hitbox-ani-sample-ledger.zh-CN.md`、`passiveobject-attackinfo-hitbox.zh-CN.md` | 已覆盖 `[ATTACK BOX]`、`[DAMAGE BOX]`、no-box、空图有盒、BASE/SUB 分层、sidecar 和断链；坐标单位、碰撞实际表现和客户端资源完整性只能运行或资源链验证。 | 不再堆同族坐标样本；`.atk` 坐标推断禁止。 |
| 10 | 辅助对照与运行风险边界 | 静态可验收 | `passiveobject-ledger-governance.zh-CN.md`、`passiveobject-coverage-ledger.zh-CN.md`、本账本 | 辅助对照独有字段、ID、token 或列形不能提升为主目标事实；命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步和资源完整性都不由静态只读证明。 | 辅助对照只写差异提示；运行问题另走实验流程。 |

## 范畴复核

| 范畴 | 当前判定 | 处理方式 |
| --- | --- | --- |
| `actionobject/monster/...` | PassiveObject/actionobject 路径前缀，不等于 Monster 主线回流。 | 可作为 PassiveObject owner 路径观察，不开启 Monster 新主线。 |
| 上游 `monster` / `aicharacter` / `map` / `skill` 引用 | 允许作为 registry 或 owner 边界出现。 | 只写边界与路由，不展开成对应主线。 |
| `equipmentpassiveobject/requiem/003/boom` 与 `boom2` | 历史 cross-boundary PassiveObject 样本。 | 冻结，不作为当前扩样本入口。 |
| 辅助对照独有字段或样本 | 仅是目标集差异提示。 | 不写成主目标规则。 |
| 运行效果 | 静态只读不可证明。 | 汇报为运行风险或另建实验任务。 |

## 被本账本收口的旧下一步

部分旧账本仍保留“继续扩大抽样”类历史提示。从本账本建立后，执行顺序改为：

1. 先读 `passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md`。
2. 再读本账本确认当前 10 项复核结果。
3. 只有复核结果明确落入“缺口待补”时，才补一个最小主目标样本。
4. 如果问题属于命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步或资源完整性，则不再静态扩桶，改列运行风险。

## 当前执行建议

- 暂停新的目录型小桶采样。
- 当前已建立 `passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md` 作为一页式静态验收汇报入口。
- 若后续出现具体字段或具体链路缺口，只补最小样本，不恢复广域采样。
