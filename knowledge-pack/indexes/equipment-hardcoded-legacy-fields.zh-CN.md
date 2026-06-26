# Equipment 低频硬编码与旧式字段索引

## 用途

本索引用于只读判断 equipment `.equ` 中低频的反伤、耐久变化、位移、旧式光环、硬编码参数、过滤器和宠物修正字段。目标样本较少，默认状态均为 `需验证`；无法由 registry 或静态说明闭合的参数必须保留原值，不得补猜。

## 伤害、耐久与位移动作

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[thorn]` | 单整数 | 位于 `[then]`，目标说明对应向攻击者返还伤害；原始值与显示百分比可直接对应的样本存在，但公式、上限和模块限制仍需实机确认。 |
| `[reduction]` | 装备部位 token、数量 | 位于 `[then]`；目标 `weapon 1` 与说明对应自身武器耐久度减少 1。目标、概率和持续效果需同分支读取。 |
| `[knockback]` | 单值 `1` | 位于 `[then]`，目标说明对应击退敌人；实际位移距离不由该单值直接给出。 |
| `[push aside]` | 单整数 | 根级旧式物理参数，可能影响推开或受推表现；目标说明不足以确定精确单位和方向，必须保留原值。 |
| `[lift up]` | 单整数 | 根级旧式浮空或重力相关参数；目标仅一条记录，精确公式未定性。 |
| `[rigidity]` | 单整数 | 根级僵直或硬直相关静态参数；目标数值不可直接换算为帧数或百分比。 |

## 旧式异常光环与 appendage

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[ice appendage]` | 三个整数 | 根级旧式冰冻光环配置。目标说明支持其中一列与作用半径、一列与周期或持续时间相关，但三列完整公式未闭合，必须整组保留。 |
| `[curse appendage]` | 四个整数 | 根级旧式诅咒光环配置。目标说明支持范围光环用途，但概率、半径、周期和持续时间的准确列序未完全闭合，必须整组保留。 |
| `[appendage unique]` | appendage ID | 位于 `[then]`，目标 ID 可通过 `appendage/appendage.lst` 解析；表示唯一化的 appendage 应用或刷新线索，唯一性规则仍需实机确认。 |
| `[passive object filter]` | 闭合的单数字过滤码 | 位于 `[if]`，必须读取 `[/passive object filter]`。目标过滤码未在 `passiveobject/passiveobject.lst` 中解析成功，因此不能当作已注册 passiveobject ID。 |

## 硬编码与宠物修正

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[hardcoding cooltime]` | 单整数 | 根级硬编码冷却，目标按毫秒语境读取；常与相邻 `[int data]` 配套，不能独立复制。 |
| `[hardcoding parameter]` | 闭合的单数字参数 | 根级或 `[pvp]` 内的硬编码参数，必须读取 `[/hardcoding parameter]`。普通与 PVP 数值可不同，真实效果由对应装备的硬编码实现决定。 |
| `[creature skill charge time rate]` | 单小数 | 根级宠物技能蓄力时间率修正；目标值为负数，精确百分比刻度和适用宠物范围需实机验证。 |

## 安全边界

- `[passive object filter]` 的数字不是“看到数字就查 passiveobject registry”；目标 registry 无匹配时应保持未解析状态。
- `[ice appendage]`、`[curse appendage]`、`[push aside]`、`[lift up]`、`[rigidity]` 均属于低频或旧式字段，不应从英文名直接推导公式。
- `[hardcoding parameter]` 和 `[hardcoding cooltime]` 依赖程序硬编码及相邻数据，跨装备复制风险高。
- `[appendage unique]` 的 ID 仍需走 appendage registry；解析成功不等于运行效果已经验证。

## 最低验证清单

1. 保留原始字段名、符号、列数和数值。
2. 检查字段位于根级、`[if]`、`[then]` 还是 `[pvp]`。
3. 只对明确属于 registry 的 ID 做 registry 解析。
4. 旧式光环与硬编码字段修改前必须准备独立实验 PVF 和游戏内回归方案。
5. 当前索引只提供只读知识，不授权写 PVF。
