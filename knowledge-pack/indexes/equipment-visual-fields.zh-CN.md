# Equipment Visual Fields 索引

## 用途

本索引用于只读判断 equipment `.equ` 中图标叠加、染色、残影、隐藏图层、标题动画、扩展外观、avatar 替换和粒子引用字段。它只整理目标 PVF 已观察到的结构，不证明客户端资源完整，也不授权直接写 PVF。

Avatar 全身标记、动作路径、特殊隐藏、socket、扩展动画子参数和声音字段另见 `indexes/equipment-avatar-motion-fields.zh-CN.md`。

## 总规则

- `.img`、`.ani`、`.ptl`、`.lay` 或目录路径只证明 PVF 存在引用，不证明客户端资源存在。
- 闭合块必须连同结束标签读取；非闭合字段不得强补结束标签。
- 数字列只按目标样本确认列形；未经过客户端或实机验证的列不能按教程猜测命名。
- 外观字段可以和属性、套装或触发块相邻，但不能据此推导战斗效果。

## 根级外观字段

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[enable dye]` | 需验证 | 根级非闭合双整数值；目标样本均为 `1 0`。只能确认染色能力相关标记和固定列形，两个数字的独立语义未定性。 |
| `[spectrum]` | 需验证 | 根级非闭合五整数值；目标样本显示多组固定五列视觉参数。可作为残影或光谱表现线索，但各列颜色、透明度、间隔或寿命含义仍需客户端验证。 |
| `[extra icon]` | 需验证 | 根级非闭合“`.img` 路径、帧号”字段；同一装备可重复出现。资源存在性需查客户端。 |
| `[clear avatar]` | 需验证 | 根级非闭合单整数标记；目标样本均为 `1`，且常与 clone 类图标字段相邻。静态结构不能证明清除、复制或恢复的具体运行行为。 |

## 隐藏与动画块

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[hide equipment]` | 需验证 | 根级闭合块；块内为反引号包裹的装备或 avatar 部位 token 列表。必须检查 `[/hide equipment]`，不要把 token 当独立字段；精确部位值见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。 |
| `[hide layer]` | 需验证 | 根级或套装效果文件内的闭合整数列表；必须检查 `[/hide layer]`。整数是图层编号线索，不能从数值大小推导前后层关系。 |
| `[custom animation]` | 需验证 | 根级闭合块；目标绝大多数样本为一个 `.ani` 路径，也存在空块。常见于称号，但不能外推为所有装备通用动画格式。 |
| `[expand ani]` | 需验证 | 根级闭合的扩展外观容器；块首可见四个整数，后续可嵌套 `[variation]`、`[layer variation]`、`[equipment ani script]`、`[sub type]` 和 `[expand path]`。必须整体读取到 `[/expand ani]`。 |
| `[expand path]` | 需验证 | `[expand ani]` 内的非闭合目录路径字符串；不能脱离外层块单独使用。 |
| `[particle]` | 需验证 | 根级闭合块；目标列形为位置模式 token、`.ptl` 路径和三个整数。三个数字的坐标或层级含义未定性，资源存在性需查客户端。 |

## 触发式 Avatar 替换

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[replace avatar ani]` | 需验证 | 位于 `[then]` 或 `[set ability] > [then]` 内的闭合块；块内重复“avatar 部位 token、数字引用”。部位 token 也可与 `[equipment type]` 或隐藏块共用，必须按当前父字段解释；精确值见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。正数样本可直接对应同部位目录下的数字文件名，但不一定登记在 `equipment.lst`；目标也观察到 `-1`，其运行语义不可只靠静态结构定性。 |

## 最低验证清单

1. 先确认字段位于 equipment `.equ`，并读取相邻 `[equipment type]`、职业和外层块。
2. 对隐藏、动画、粒子和替换块检查对应结束标签。
3. 对 `.img`、`.ani`、`.ptl`、`.lay` 或目录引用另做客户端资源完整性检查。
4. 对 `[replace avatar ani]` 的正数，先按 avatar 部位目录查同名 `.equ`，不要强行当作 `equipment.lst` ID。
5. 对所有数字列保留原顺序；未做客户端或实机验证时不命名未知列。
