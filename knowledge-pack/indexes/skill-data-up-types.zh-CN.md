# Skill Data Up 类型索引

## 用途

本索引用于解释装备 `.equ` 中 `[skill data up]` 的数据类型 token。它只提供路由和风险边界，不授权直接写 PVF。

## 基础列形

目标 PVF 可观察到 `[skill data up]` 以成组参数出现：

```text
职业 token
技能 ID
作用域 token
数据类型 token
数据索引
运算符
值
```

同一个 `[skill data up]` 块可以连续包含多组修改项。

## 目标可观察数据类型

| 数据类型 token | 指向的技能文件模块候选 | 使用边界 |
| --- | --- | --- |
| `[static]` | `[static data]` | 数据索引必须回到目标 `.skl` 的静态数据和说明中确认。 |
| `[level]` | `[level info]` / `[level property]` | 数据索引通常指向等级数据列；不同技能列义不同。 |
| `[cooltime]` | `[cool time]` | 可见 `%` 和 `+` 运算；单位、正负和叠加规则需验证。 |
| `[mp]` | `[consume MP]` | 通常涉及技能 MP 消耗；不要只按索引 `0` 套用。 |
| `[skill consume item]` | `[consume item]` | 涉及技能消耗道具；必须读对应 `.skl` 的道具 ID 和数量列。 |
| `[casting time]` | `[casting time]` | 涉及施放时间；单位和最终显示效果需实机或同类样本验证。 |
| `[skill cosume item]` | 遗留拼写，候选仍指向消耗道具数据 | 目标只读样本中实际存在；不得静默修正为 `[skill consume item]`。 |
| `[limit count]` | 次数限制数据候选 | 目标只确认极少样本；索引和值的精确意义需专项验证。 |

## 作用域 Token

常见作用域 token 包括：

- `[dungeon type]`
- `[all]`
- `[war room]`
- `[pvp]`
- `[pvp type]`
- `[assault]`
- `[fair pvp]`

作用域 token 不能只按字面解释。写入或判断前必须确认它所在的是 `[skill data up]` 参数组，而不是其他块的同名 token。

目标中的 `[dungeon]` 当前按 `[module]` 值确认，不作为 `[skill data up]` 作用域结论。所有值 token 的跨字段路由见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。

## 特殊 Token

### `[common]`

`[common]` 可在 `[skill data up]` 的职业 token 位置出现，但它不是独立 skill registry。

目标 PVF 可观察到 `[common] 174 [dungeon type] [level] ...` 形态，说明文本对应“基础精通”类公共技能。该 ID 在多个职业 skill registry 中解析为各职业的 `BasicAttackUp.skl`。

使用边界：

- 不能把 `[common]` 映射成单独的 `.lst`。
- 在 `[skill data up]` 中遇到 `[common]` 时，仍需按适用职业分别检查对应 skill registry。
- 当前只把 `[common] 174` 作为目标可观察的 `[skill data up]` 样本；不要把 `[skill levelup]` 或 `[avatar select ability]` 中的其他 common ID 直接迁移过来。

职业位置还可观察到 `[theif]`、`[gt unner]`、`[at ighter]` 等目标原始拼写。它们不能自动改字，也不能在未核对相邻组和对应 skill registry 前直接用于写入。

### `[maintain mp]`

`[maintain mp]` 是资料候选，但当前目标装备只读观察未确认。

使用边界：

- 不作为当前目标 PVF 可观察类型使用。
- 如未来要处理，必须先在目标 PVF 中找到同类装备样本。

## 最低验证清单

1. 找到完整 `[skill data up] ... [/skill data up]` 块。
2. 按 7 列一组切分参数，不要跨组读列。
3. 用职业 token 选择 skill registry。
4. 解析技能 ID 到 `.skl`。
5. 在 `.skl` 中查对应模块，例如 `[level info]`、`[static data]`、`[cool time]`。
6. 再解释数据索引、运算符和值。
7. 对涉及冷却、消耗和施放时间的修改，保留实机验证要求。
