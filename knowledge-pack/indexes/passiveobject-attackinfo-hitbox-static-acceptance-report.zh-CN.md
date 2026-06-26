# PassiveObject / AttackInfo / Hitbox 静态验收汇报

状态：默认可用

用途：给 PassiveObject / AttackInfo / Hitbox 主线提供一页式验收口径。本文不新增 PVF 观察，不写 PVF，不替代实机测试；它只汇总当前 Workbench 已能证明的静态结构闭环，以及静态只读不能证明的运行风险。

## 一页结论

| 项 | 结论 |
| --- | --- |
| 当前是否继续按目录扩样本 | 否 |
| 静态结构是否可进入验收 | 是 |
| 是否仍有必须补的静态结构缺口 | 当前未发现 |
| 是否已经证明实机命中、伤害、卡肉或轨迹 | 否 |
| 后续新增样本条件 | 只有发现“缺口待补”时，才补一个最小主目标样本 |

## 三轴验收口径

| 轴 | 当前覆盖 | 验收口径 | 剩余风险 |
| --- | --- | --- | --- |
| PassiveObject | `.obj`、`.act`、create recursion、lifecycle、destroy、hp、homing、registry route、跨主线边界。 | 静态结构可进入验收；数字 ID 必须继续按父块走正确 `.lst`。 | 高位未命中 ID、owner 未闭合、静态回环、生命单位、轨迹和销毁时序不能由静态只读证明。 |
| AttackInfo | `.atk` 基础字段、`[active status]`、PVP 覆盖块、PVP owner / ANI 链路。 | `.atk` 只证明攻击信息结构和覆盖块列形；40 个 PVP `.atk` 块已读到闭合。 | `.atk` 不提供 hitbox 坐标；伤害公式、异常状态实效、PVP 最终规则和 9 个 zrr_skill owner / ANI 风险不能静态证明。 |
| Hitbox | `.ani` 帧级 `[ATTACK BOX]`、`[DAMAGE BOX]`、no-box、空图有盒、BASE/SUB 分层、sidecar、断链样本。 | hitbox 坐标只认 `.ani` 反编译帧；`.atk` 坐标推断禁止。 | 坐标单位、碰撞实际表现、卡肉、击退、浮空、客户端资源完整性和断链运行后果只能运行或资源链验证。 |

## 10 项验收门结果

| 判定 | 项目 |
| --- | --- |
| 静态可验收 | PassiveObject registry 路由、`.obj` 字段入口、`.act` 结构、`.atk` 基础字段与 `[active status]`、PVP 块审计、Hitbox ANI 帧级证据、辅助对照边界。 |
| 结构可验收但保留风险 | `[CREATE PASSIVEOBJECT]` 递归与未命中 ID、lifecycle / destroy / hp / homing、PVP owner / ANI 链路。 |
| 缺口待补 | 当前未登记。 |
| 仅运行可验 | 命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步、PVP 最终规则、客户端资源完整性。 |

复核口径以 `passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md` 为准；它比最初验收清单更保守地把 create recursion 和 PVP owner / ANI 中的未闭合项列为结构可验收但保留风险。

## 已排除的范畴污染

| 范畴 | 处理 |
| --- | --- |
| `actionobject/monster/...` | 只按 PassiveObject/actionobject 路径前缀处理，不回流 Monster 主线。 |
| Equipment 历史样本 | 已冻结为 cross-boundary PassiveObject 样本，不作为当前扩样本入口。 |
| NPC shop / dungeon / quest / drop | 不属于本主线，不写入本验收口径。 |
| 辅助对照 PVF 独有字段 | 只作为目标集差异提示，不提升为主目标事实。 |
| 外部教程、社区注释、工具字段 | 只作线索；未经过主目标只读观察的内容不写成 Workbench 结论。 |

## 运行风险清单

| 风险 | 静态只读能证明什么 | 静态只读不能证明什么 |
| --- | --- | --- |
| 命中与伤害 | 结构字段、攻击信息文件、ANI 盒字段是否存在。 | 实际命中、伤害数值、抗性、概率、状态生效。 |
| 卡肉、击退、浮空 | 相关字段或盒坐标是否被观察到。 | 手感、位移、浮空高度、击退距离。 |
| PVP 规则 | PVP 覆盖块是否存在、是否闭合、块内字段列形。 | 竞技场最终规则、客户端或服务端实际采用哪个覆盖值。 |
| create recursion | create 块、registry route、随机候选、未命中 ID 风险。 | 运行时生成频率、循环停止表现、owner 未闭合对象是否实际出现。 |
| lifecycle / homing | destroy、hp、homing 等结构块和列形。 | 生命单位、追踪轨迹、销毁时序、帧跳转表现。 |
| ANI / 资源链 | 反编译成功的 ANI 中是否存在 attack / damage box。 | 客户端 ImagePacks2 / NPK 资源是否完整、断链资源运行后果。 |

## 下一步测试建议

1. 只读验收：按本文件、`passiveobject-attackinfo-hitbox-completion-audit.zh-CN.md`、`passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md`、`passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md` 复核，不再新开目录小桶。
2. 缺口补样本：只有当现有 Workbench 找不到某字段主目标样本、父块上下文、registry 路由或 ANI 展开结果时，才补一个最小主目标只读样本。
3. 实机测试：若要确认命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步或 PVP 最终规则，应另建目标 PVF 实验流程。
4. 资源测试：若要确认 `.ani/.img/.npk` 资源完整性，应另走客户端资源链检查；不能只凭 Script 引用下结论。

## 汇报模板

可以对外使用以下短口径：

> PassiveObject / AttackInfo / Hitbox 当前已具备静态结构验收口径：三轴字段、registry 路由、create 链、PVP 覆盖块和 ANI hitbox 样本均已有 Workbench 路由；当前未发现必须继续广域采样的结构缺口。静态只读仍不能证明命中、伤害、卡肉、击退、浮空、轨迹、销毁时序、同步、PVP 最终规则或客户端资源完整性，这些必须另走运行或资源链测试。
