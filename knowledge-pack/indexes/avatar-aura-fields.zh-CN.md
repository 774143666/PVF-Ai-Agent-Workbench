# Avatar Aura Fields 索引

## 用途

本索引用于只读判断 avatar / aura 装备中的 `[avatar func filter]`、`[emblem socket default]`、`[aura ability]`、`[aurora graphic effects]`。它只提供字段边界和读取规则，不授权直接写 PVF。

## `[avatar func filter]`

形态：

```text
[avatar func filter]
数字
```

只读确认：

- 这是单值数字字段，不是闭合块。
- 目标样本中可见于普通 avatar 部位，也可见于 `[aurora avatar]`。
- 目标样本观察到的值为 `0` 和 `2`；未在目标样本中确认 `1` 或 `3`。

读取边界：

- 必须结合所在文件的 `[equipment type]`、`[usable job]` 和相邻 avatar 块判断。
- 不要把它并入 `[avatar type select]`、`[avatar select ability]` 或 `[skill levelup]`。
- 数字语义未在本索引内定性；写入或修改前必须另做同类目标样本验证。
- 跨版本导入光环装备时，应对照目标 PVF 原生同职业、同部位光环装备是否普遍存在该字段；缺失时标记为视觉/功能风险，但不要把某个数字写成通用修复规则。

## `[emblem socket default]`

形态：

```text
[emblem socket default]
`[socket token]`
`[socket token]`
[/emblem socket default]
```

只读确认：

- 这是独立闭合块。
- 目标样本确认的块内 token 包括 `` `[A socket]` ``、`` `[B socket]` ``、`` `[D socket]` ``、`` `[M socket]` ``。
- 当前未确认 `` `[C socket]` `` 或 `` `[S socket]` `` 位于 `[emblem socket default]` 内；它们已在 `[avatar type select]` 中另行确认。

读取边界：

- socket token 必须按所在块解释；同名 token 不能从一个块借义到另一个块。
- 读取时必须确认 `[/emblem socket default]` 闭合标签。
- 常见样本是一块两行相同 socket token，但不要把“两行相同”写死为规则。

## `[aura ability]`

形态：

```text
[aura ability]
能力 token
可选整数参数
[/aura ability]
```

只读确认：

- 这是独立闭合块。
- 目标全量只读盘点确认 `` `[none]` ``、`` `[party teleport]` ``、`` `[solo teleport]` ``、`` `[upgrade solo teleport]` ``。
- `` `[none]` `` 为单 token。
- 三种 teleport token 后接一个整数参数。资料注释指向传送冷却，但单位、计时起点、队伍范围和升级差异仍需实机确认。

读取边界：

- 必须确认 `[/aura ability]` 闭合标签。
- 不要把该块与 `[avatar select ability]` 混合；两者名字相近但用途和块体不同。
- 精确 token 路由见 `indexes/equipment-bracket-value-tokens.zh-CN.md`。

## `[aurora graphic effects]`

形态：

```text
[aurora graphic effects]
数字前缀 `... .ani`
数字前缀 `... .ani`
可选 [/aurora graphic effects]
```

只读确认：

- 该结构见于 `[aurora avatar]` 的图形效果引用。
- 块体由数字前缀和 `.ani` 路径行组成；目标样本中首行可能有两个数字再接路径，后续行可能只有一个数字再接路径。
- `[/aurora graphic effects]` 只在部分目标样本中出现，不能默认所有 `[aurora graphic effects]` 都有闭合标签。

读取边界：

- 遇到闭合标签时按闭合块读取；未见闭合标签时，应按相邻标签、文件结尾和同类样本谨慎截断。
- `.ani` 路径只说明 PVF 脚本引用，不证明客户端资源一定存在。
- 数字前缀语义未在本索引内定性；不要把它直接解释为帧数、层级或数量。
- 光环视觉检查不能停在装备 `[icon]` 或礼包图标；应继续追踪 `.equ -> [aurora graphic effects] -> .ani -> IMG -> ImagePacks2/NPK`，并把目标客户端实机显示作为最终边界。

## 最低验证清单

1. 先确认所在文件是 avatar / aura 装备上下文。
2. 读取 `[equipment type]`，区分普通 avatar 部位和 `[aurora avatar]`。
3. 对 `[emblem socket default]` 与 `[aura ability]`，必须读取闭合标签。
4. 对 `[aurora graphic effects]`，先查是否存在闭合标签；没有闭合时不要强补闭合。
5. socket token 按所在块解释；A/B/D/M 可用于 `[emblem socket default]`，A/B/C/D/M/S 可用于 `[avatar type select]`。
6. 不把 `[aura ability]`、`[avatar select ability]`、`[skill levelup]` 互相合并。
7. 不根据 `.ani` 路径判断客户端资源完整。
8. 跨版本导入光环时，把 avatar 字段对照、ANI 链和客户端资源包来源列为单独风险项。
