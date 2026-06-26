# AttackInfo .atk 字段词典

状态：需验证

本文记录主目标 PVF 只读观察到的 `.atk` 结构入口。`.atk` 字段描述攻击信息，但不单独证明伤害公式、命中结果、hit stop、击退、浮空、异常概率、PVP 差异或最终结算。

## 文件边界

### `.mob [attack info] -> .atk`

含义：monster `.mob` 可通过 `[attack info]` 引用 `.atk`。

### `.obj/.act -> .atk`

含义：passiveobject `.obj` 或其下游 `.act` 也可引用 `.atk`。

注意：路径通常相对 owner 文件目录解析；缺失引用必须标为断链，不得按同名文件猜测替换。

## 攻击类型与目标

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[attack type]` | 块内可出现 `[physic]`、`[magic]` 等子标签。 | 只证明类型入口，不证明最终防御结算。 |
| `[attack enemy]` | 一个数值。 | 不单独证明敌我命中规则。 |
| `[attack friend]` | 一个数值。 | 不单独证明友方命中规则。 |
| `[attack direction]` | 块内可出现方向/倒地样子标签。 | 不单独证明实际击中方向。 |
| `[hit horizontal]` / `[hit down]` / `[hit lift up]` | `[attack direction]` 下的方向/受击姿态 token。 | 只证明方向 token 存在，不证明实机击飞、倒地或水平命中效果。 |

## 元素与伤害

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[elemental property]` | 块内可出现 `[no element]`、`[none element]` 等子标签。 | 元素标签存在不证明最终元素伤害或抗性计算。 |
| `[elemental property multi]` | 多元素属性入口。 | 需按目标样本继续拆分子标签。 |
| `[damage]` | 可作为字段或 `[damage reaction]` 内子标签出现。 | 不要推断伤害公式。 |
| `[damage bonus]` | 一个数值。 | 不要推断倍率公式。 |
| `[absolute damage]` | 数值型入口。 | 不要推断固定伤害结算。 |
| `[weapon damage apply]` | 一个数值。 | 是否取武器伤害需实机或运行链验证。 |

## 受击反应与命中信息

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[damage reaction]` | 块内可出现 `[damage]`、`[push aside]`、`[lift up]` 等。 | 只记录结构，不证明卡肉或击退高度。 |
| `[push aside]` | 一个数值。 | 击退距离/速度需实机验证。 |
| `[lift up]` | 一个数值。 | 浮空高度/时间需实机验证。 |
| `[stuck]` | 数值型入口。 | 不直接证明硬直效果。 |
| `[hit wav]` | 一个字符串。 | 只证明音效引用，不证明客户端资源完整。 |
| `[hit info]` | 块内可出现 `[blow]`、`[no blood]` 等子标签。 | 命中表现需结合 ANI hitbox 与实机验证。 |
| `[no blood]` | 常见为两个数值。 | 表现语义需实机验证。 |
| `[blood]` | 样本中可见两个数值。 | 只记录命中表现参数，不证明实际出血表现。 |
| `[cut]` | hit info 子标签。 | 只证明切割类表现入口，不证明最终命中或伤害。 |

## 状态与 PVP 覆盖

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[active status]` | 状态 token 后跟数值列；样本中可见三数值列、四数值列、五数值列和七数值列。 | 概率、等级、持续、伤害或抗性含义需专项验证；样本未观察到 `[/active status]` 闭合标签。 |
| `[pvp] ... [/pvp]` | 闭合覆盖块，内部可重写 `[hit info]`、`[damage reaction]`、`[damage bonus]`、`[lift up]`、`[push aside]` 等局部字段。 | 只证明 PVP 覆盖结构存在，不证明竞技场最终规则；块内字段集合可变。 |
| `[active status apply weapon]` | 主目标 `passiveobject/` 范围未观察到。 | 辅助对照有样本也不能提升为主目标字段结论。 |

## 与 Hitbox 的边界

| 问题 | 结论 |
| --- | --- |
| `.atk` 有伤害字段就一定能命中？ | 不能这么写。还必须闭合到 `.act` 和 `.ani`，确认帧级攻击框。 |
| `.ani` 有 `[ATTACK BOX]` 就一定造成伤害？ | 不能这么写。还要结合触发动作、`.atk`、目标状态和实机。 |
| `[DAMAGE BOX]` 未被脚本搜索命中怎么办？ | 只能写成当前脚本文本索引未命中；二进制 ANI 仍需反编译检查。 |

## 覆盖

- 通用入口：见 `indexes/passiveobject-coverage-ledger.zh-CN.md`。
- 状态 / PVP 专项：见 `indexes/attackinfo-status-pvp-ledger.zh-CN.md`。
- PVP 块全量盘点：见 `indexes/attackinfo-pvp-block-inventory.zh-CN.md`。
- PVP 触发链试点：见 `indexes/attackinfo-pvp-chain-pilot-ledger.zh-CN.md`。
- 枪手 PVP owner/ANI 链路：见 `indexes/attackinfo-pvp-gunner-chain-ledger.zh-CN.md`。
- Fighter PVP owner/ANI 链路：见 `indexes/attackinfo-pvp-fighter-chain-ledger.zh-CN.md`。
- Mage PVP owner/ANI 链路：见 `indexes/attackinfo-pvp-mage-chain-ledger.zh-CN.md`。
- Priest / Swordman / Thief PVP owner/ANI 链路：见 `indexes/attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`。
- Common / Equipment PVP owner/ANI 链路：见 `indexes/attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`。
- zrr_skill PVP owner 审计：见 `indexes/attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md`。
- 详细标签路由：见 `indexes/attackinfo-atk-observed-tag-router.zh-CN.md`。
- 详细 token 路由：见 `indexes/attackinfo-atk-backtick-token-router.zh-CN.md`。
