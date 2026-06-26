# Avatar Select Ability 索引

## 用途

本索引用于解释装备 `.equ` 中 `[avatar select ability]` 的块结构、候选项列形和技能等级候选项边界。它只提供只读判断规则，不授权直接写 PVF。

## 基础块形

```text
[avatar select ability]
候选项...
[/avatar select ability]
```

该块是 avatar 装备的可选能力候选池。读取时必须连同装备部位、`[equipment type]`、`[usable job]` 和闭合标签一起看。

目标只读样本确认：该块常见于 avatar 的腰部、皮肤、上衣等部位；腰部和皮肤样本偏属性候选项，上衣样本常见技能等级候选项。实际读取时以完整块体为准，不要只按部位预设内容。

## 属性类候选项

属性类候选项按三列一组读取：

```text
属性 token
运算符
数值
```

目标 PVF 可观察到的属性 token 包括攻击、防御、HP/MP、速度、跳跃力、属性抗性、异常抗性、负重、回复等类别。

目标确认的精确属性 token、空格形式和遗留拼写统一见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。其中 `HP_REGENRATE`、`MP_REGENRATE`、`HP MAX`、`MP MAX`、`MAGICAL ABSOLUTE DEFENSE`、`PHYSICAL ABSOLUTE DEFENSE` 与 `STUCK ON ATTACK` 必须原样保存。

使用边界：

- 属性 token 的大小写、空格和下划线必须按目标 PVF 同类样本保留。
- 不要把该块中的属性候选项当作装备固定主属性。
- 运算符和数值单位需要目标样本或游戏内验证，不要只凭字段名判断面板显示。
- 属性候选项可能在物理行上分行显示，但逻辑上仍按“属性 token、运算符、数值”连续读取。

## 技能等级候选项

技能等级候选项以 `` `[SKILL_LEVEL]` `` 作为候选项类型 token：

```text
`[SKILL_LEVEL]`
职业 token
技能 ID
等级变化量
```

使用边界：

- 技能 ID 必须先通过职业 token 选择 skill registry，再解析到 `.skl`。
- 等级变化量只按该候选项的等级变化处理；不要当成技能最终等级、学习等级或等级上限。
- `` `[SKILL_LEVEL]` `` 是候选项类型 token，不是固定 `[skill levelup]` 块名。
- 关键词搜索可能不能可靠命中 `` `[SKILL_LEVEL]` ``；实务上先定位 `[avatar select ability]`，再读取完整块体。
- 职业 token 可能包含目标内遗留拼写或双空格；只读审查时原样保留，解析前先参考 `indexes/equipment-bracket-value-tokens.zh-CN.md`。

## 与固定 `[skill levelup]` 的区别

| 对比项 | `[avatar select ability]` 内 `` `[SKILL_LEVEL]` `` | 固定 `[skill levelup]` |
| --- | --- | --- |
| 外层块 | `[avatar select ability] ... [/avatar select ability]` | `[skill levelup] ... [/skill levelup]` |
| 用途 | avatar 可选能力候选项 | 装备或套装上下文中的固定技能等级提升 |
| 列形 | `` `[SKILL_LEVEL]` ``、职业 token、技能 ID、等级变化量 | 职业 token、技能 ID、等级变化量 |
| 处理方式 | 先按 avatar 可选项读取，再解析技能 ID | 先按固定三列一组读取，再解析技能 ID |

两者都与技能等级有关，但不能互相替换，也不能把一个块里的列形复制到另一个块中使用。

目标只读样本确认：同一件 avatar 上衣可以先出现 `[avatar select ability] ... [/avatar select ability]`，后面再出现独立 `[skill levelup] ... [/skill levelup]`。二者即使相邻也必须分别解析。

## 最低验证清单

1. 找到完整 `[avatar select ability] ... [/avatar select ability]` 块。
2. 确认装备部位、`[equipment type]` 和 `[usable job]`。
3. 区分候选项是属性类还是 `` `[SKILL_LEVEL]` `` 技能等级类。
4. 属性类按“属性 token、运算符、数值”读取。
5. 技能等级类按“`` `[SKILL_LEVEL]` ``、职业 token、技能 ID、等级变化量”读取。
6. 对技能 ID 使用职业 token 路由到对应 skill registry。
7. 不要把本块结论套到固定 `[skill levelup]`、`[skill data up]` 或 `[all skill item]`。
8. 如果同一文件另有独立 `[skill levelup]`，按固定三列一组另行解析，不要把 `` `[SKILL_LEVEL]` `` 候选项列形套过去。
