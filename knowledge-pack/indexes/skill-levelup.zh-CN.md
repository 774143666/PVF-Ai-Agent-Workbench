# Skill Levelup 索引

## 用途

本索引用于解释装备 `.equ` 中 `[skill levelup]` 的基础列形、registry 路由和相邻字段边界。它只提供只读判断规则，不授权直接写 PVF。

## 基础列形

目标 PVF 可观察到 `[skill levelup]` 以三列一组出现：

```text
职业 token
技能 ID
等级变化量
```

同一个 `[skill levelup]` 块可以连续包含多组技能等级变化项。

## 使用边界

- 每组必须按三列读取，不要跨组解释。
- 技能 ID 必须先通过职业 token 选择 skill registry，再解析到 `.skl`。
- 第三列按“等级变化量”处理；不要直接当成技能最终等级、技能学习等级或技能等级上限。
- `[skill levelup]` 可出现在普通装备、avatar/aura、套装属性块等上下文；必须连同外层块一起读。
- 字段文本只说明技能等级变化线索，不证明最终面板、技能树显示或实战效果。

## `[common]` 边界

`[common]` 可在 `[skill levelup]` 的职业 token 位置出现，但它不是独立 skill registry。

使用要求：

- 不要查不存在的 common `.lst`。
- 先确认所在块确实是 `[skill levelup]`。
- 再按适用职业分别检查对应 skill registry。
- 同一个 common ID 需要多职业 registry 交叉确认后，才可当作公共技能线索。

目标 PVF 可观察到 `[common] 176 3` 形态，抽样解析到多职业的“远古记忆”类公共技能。

## 不要混用的相邻字段

| 字段 | 边界 |
| --- | --- |
| `[avatar select ability]` + `[SKILL_LEVEL]` | 这是 avatar 可选技能等级项，列形包含 `` `[SKILL_LEVEL]` ``、职业 token、技能 ID、等级变化量；它不等同于固定 `[skill levelup]` 块。 |
| `[all skill item]` | 这是范围技能等级加成块，包含成长类型、适用条件、等级上下限和值等子字段。 |
| `[skill data up]` | 这是修改技能数据列的块，列形和数据类型 token 与 `[skill levelup]` 不同。 |

## 最低验证清单

1. 找到完整 `[skill levelup] ... [/skill levelup]` 块。
2. 按三列一组切分参数。
3. 对每组读取职业 token、技能 ID、等级变化量。
4. 用职业 token 选择 skill registry。
5. 解析技能 ID 到 `.skl`，读取技能名、类型和基础信息。
6. 如果职业 token 是 `[common]`，抽查多个适用职业 registry。
7. 回到外层装备或套装上下文，确认该块是固定加成、套装加成还是 avatar/aura 加成。
