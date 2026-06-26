# Avatar Type Select 索引

## 用途

本索引用于解释 avatar 装备 `.equ` 中 `[avatar type select]` 的块结构、数字组形态和块内 socket token 边界。它只提供只读判断规则，不授权直接写 PVF。

## 基础块形

```text
[avatar type select]
数字组与可选 socket token...
[/avatar type select]
```

该块常见于 avatar 装备文件中，但不是所有 avatar 文件都一定存在。读取时必须连同 `[equipment type]`、`[usable job]`、装备路径和闭合标签一起看。

## 块内列形

目标只读样本可观察到块内主体由连续数字组组成，常见为五个数字一组：

```text
数字1 数字2 数字3 数字4 socket数量
```

读取规则：

- 不要只按物理行读取；同一组和 socket token 可能跨行。
- 不要默认每个块都有同样数量的数字组；目标样本可见有 socket token 的多组形态，也可见无 socket token 后直接闭合的形态。
- 当某组末尾的 socket 数量为 `0` 时，不要补写 socket token。
- 当某组末尾的 socket 数量大于 `0` 时，后续应按该数量读取紧邻的 socket token，再确认 `[/avatar type select]` 闭合。
- 数字列的运行语义不在本索引内展开；价格、期限或其他解释都需要另做目标验证。

## Socket Token

目标只读样本确认，在 `[avatar type select]` 内可观察到以下 socket token：

```text
`[A socket]`
`[B socket]`
`[C socket]`
`[D socket]`
`[M socket]`
`[S socket]`
```

常见形态示例：

```text
... 2 `[B socket]`
`[B socket]`
```

```text
... 3 `[S socket]`
`[C socket]`
`[C socket]`
```

使用边界：

- socket token 是 `[avatar type select]` 块内的枚举 token，不是独立字段块。
- token 的反引号、大小写和空格必须按目标 PVF 同类样本保留。
- 不要用装备部位硬编码 socket token；同类样本可作参考，但写入前仍需读取目标文件。
- `` `[A socket]` ``、`` `[B socket]` ``、`` `[D socket]` ``、`` `[M socket]` `` 也可见于 `[emblem socket default]`；必须按所在块解释。
- `` `[C socket]` ``、`` `[S socket]` `` 在目标只读盘点中只确认位于 `[avatar type select]`。

## 与相邻块的边界

`[avatar type select]`、`[avatar select ability]` 和 `[skill levelup]` 是独立结构：

```text
[avatar type select]
...
[/avatar type select]

[avatar select ability]
...
[/avatar select ability]
```

也可观察到 `[avatar type select]` 闭合后先出现独立 `[skill levelup]`，后面再出现 `[avatar select ability]`。三者即使相邻，也不能合并解析。

不要把 socket token 放入 `[avatar select ability]`；也不要把 `[SKILL_LEVEL]` 或固定 `[skill levelup]` 列形套入 `[avatar type select]`。

## 最低验证清单

1. 找到完整 `[avatar type select] ... [/avatar type select]` 块。
2. 确认同一文件的 `[equipment type]`、`[usable job]` 和装备路径。
3. 按连续 token 读取块体，不按换行臆断。
4. 将块内数字按五个一组先做结构读取。
5. 如果组末 socket 数量为 `0`，确认后面没有被误读的 socket token。
6. 如果组末 socket 数量大于 `0`，读取相同数量的紧邻 socket token。
7. socket token 保留目标 PVF 原写法，不手改大小写、空格或反引号。
8. 分开解析后续 `[avatar select ability]` 和 `[skill levelup]`。
9. 对 `` `[M socket]` `` 先确认它位于本块还是 `[emblem socket default]`；不要跨块借用列形。
