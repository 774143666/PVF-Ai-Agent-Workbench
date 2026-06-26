# PassiveObject / AttackInfo / Hitbox 静态闭环验收清单

状态：默认可用

用途：把 PassiveObject / AttackInfo / Hitbox 主线从持续扩样本切换到静态结构验收。本文不是完成声明，也不是写 PVF 配方；它只规定如何判断“现有 Workbench 是否已经足够验收”和“还允许补什么缺口”。

## 判定等级

| 等级 | 含义 | 后续动作 |
| --- | --- | --- |
| 静态可验收 | 已有主目标只读样本、字段词典、路由账本和风险边界，足以支撑结构结论。 | 不再继续广域扩样本。 |
| 结构可验收但保留风险 | 静态结构已清楚，但有 owner 未闭合、ANI 断链、未命中 ID 或运行语义风险。 | 写入风险清单，不用目录穷举补齐。 |
| 仅运行可验 | 静态只读无法证明，例如命中、伤害、卡肉、轨迹、时序、同步、PVP 最终规则。 | 只能进入运行测试或专题链路，不能在静态账本里硬推。 |
| 缺口待补 | 现有 Workbench 找不到主目标样本或路由文件。 | 只补最小小桶，补完即回到验收清单。 |

## 10 项验收门

| # | 验收项 | 当前判定 | 路由文件 | 后续动作 |
| ---: | --- | --- | --- | --- |
| 1 | PassiveObject 数字 ID 与上下文 registry 路由 | 静态可验收 | `passiveobject-coverage-ledger.zh-CN.md`、`passiveobject-create-recursion-ledger.zh-CN.md`、`passiveobject-action-fields.zh-CN.md` | 后续只在新增入口时解析 ID；不因 registry 碰撞扩新主线。 |
| 2 | `.obj` 字段入口和边界 | 静态可验收 | `passiveobject-obj-fields.zh-CN.md`、`passiveobject-coverage-ledger.zh-CN.md`、`passiveobject-lifecycle-homing-ledger.zh-CN.md` | 不再按目录穷举 `.obj`；只补字段缺口。 |
| 3 | `.act` action / trigger / behavior / create / summon 结构 | 静态可验收 | `passiveobject-action-fields.zh-CN.md`、`passiveobject-create-recursion-ledger.zh-CN.md` | 不再为了增加 action 样本而扩桶。 |
| 4 | `[CREATE PASSIVEOBJECT]` 递归、随机候选、回环停止、未命中 ID | 静态可验收 | `passiveobject-create-recursion-ledger.zh-CN.md` | 高位未命中 ID、静态回环和 owner 未闭合保留风险，不猜路径。 |
| 5 | lifecycle / destroy / hp / homing 结构 | 结构可验收但保留风险 | `passiveobject-lifecycle-homing-ledger.zh-CN.md`、`passiveobject-obj-fields.zh-CN.md` | 运行单位、轨迹、销毁时序只列运行风险。 |
| 6 | `.atk` 基础字段与 `[active status]` 结构 | 静态可验收 | `attackinfo-atk-fields.zh-CN.md`、`attackinfo-status-pvp-ledger.zh-CN.md` | 不解释伤害公式、概率、持续、抗性或状态实效。 |
| 7 | `.atk [pvp] ... [/pvp]` 静态块审计 | 静态可验收 | `attackinfo-pvp-block-inventory.zh-CN.md`、`attackinfo-pvp-chain-pilot-ledger.zh-CN.md` | 40/40 块已审计；PVP 最终规则仍是运行风险。 |
| 8 | PVP owner / ANI 链路 | 结构可验收但保留风险 | `attackinfo-pvp-gunner-chain-ledger.zh-CN.md`、`attackinfo-pvp-fighter-chain-ledger.zh-CN.md`、`attackinfo-pvp-mage-chain-ledger.zh-CN.md`、`attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`、`attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`、`attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md` | 31/40 已到 owner/ANI 或 owner/action/ANI 观察点；9/40 zrr_skill 登记 owner 未闭合或 ANI 断链，不在 passiveobject 目录继续猜。 |
| 9 | Hitbox ANI 帧级证据 | 静态可验收 | `passiveobject-hitbox-ani-sample-ledger.zh-CN.md`、`passiveobject-attackinfo-hitbox.zh-CN.md` | 已覆盖 attack box、damage box、no-box、空图有盒、BASE/SUB 分层、sidecar 和断链；不再堆同族坐标。 |
| 10 | 辅助对照与运行风险边界 | 静态可验收 | `passiveobject-ledger-governance.zh-CN.md`、`passiveobject-coverage-ledger.zh-CN.md`、本清单 | 辅助对照只作差异提示；命中、伤害、卡肉、击退、浮空、追踪轨迹、销毁时序、同步和资源完整性都不由静态只读证明。 |

## 收口判定

当前 10 项中，没有发现必须继续广域采样的结构缺口。

结论：

- PassiveObject / AttackInfo / Hitbox 主线应暂停逐目录扩样本。
- 后续新增内容只允许为“验收缺口补样本”或“运行风险另列”。
- 超过约 100KB 的主账本只写短路由；长明细必须分片。
- 不能把 zrr_skill owner 风险、equipmentpassiveobject 历史样本或辅助对照差异扩成新主线。

## 允许补的最小缺口

| 缺口类型 | 允许动作 | 不允许动作 |
| --- | --- | --- |
| Workbench 找不到某字段主目标样本 | 补一个最小样本并写入对应词典或分片。 | 为了覆盖目录数量继续批量扫描。 |
| 新任务出现未见过的父块上下文 | 只读复核父块、registry 和块闭合。 | 用数字外形猜 registry。 |
| `.ani` 反编译失败或引用断链 | 标为断链或未展开风险。 | 写成无 hitbox 或无运行效果。 |
| zrr_skill owner 未闭合 | 保留风险，必要时另开 skill/load_state/NUT 或实机链路专题。 | 在 passiveobject 目录里继续猜 owner。 |
| 辅助对照独有字段 | 写成目标集差异提示。 | 提升为主目标事实。 |

## 验收输出口径

对外汇报时使用以下口径：

- 先读 `passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md` 获取一页式验收汇报；本清单只负责判定门和允许补样本边界。
- “静态结构覆盖可验收”只表示主目标 PVF 的结构、字段、registry 路由、链路边界和不可证明风险已经有 Workbench 路由。
- 它不表示实机命中、伤害、状态概率、PVP 最终规则、轨迹、销毁时序、同步或客户端资源完整性已验证。
- 若要验证运行表现，必须进入单独的运行测试或目标 PVF 实验流程。
