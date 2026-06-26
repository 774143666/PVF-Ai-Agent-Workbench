# Avatar / Emblem / Aura / Package 文件类型

状态：默认可用。

本页说明时装、徽章、光环、礼包相关文件类型和静态边界。

## 时装装备 `.equ`

时装、皮肤、光环装备仍属于 equipment 层，入口是：

```text
equipment/equipment.lst -> equipment/**/*.equ
```

常见 `[equipment type]`：

- `[hat avatar]`
- `[hair avatar]`
- `[face avatar]`
- `[breast avatar]`
- `[coat avatar]`
- `[waist avatar]`
- `[pants avatar]`
- `[shoes avatar]`
- `[skin avatar]`
- `[aurora avatar]`
- `[weapon avatar]`

静态注册存在不证明实机可穿戴，也不证明外观资源完整。

## 徽章 `.stk`

徽章属于 stackable 层，入口是：

```text
stackable/stackable.lst -> stackable/**/*.stk
```

徽章类道具的关键结构：

```text
[stackable type]
`[avatar emblem]`

[avatar emblem target type]
`[socket token]`
[/avatar emblem target type]
```

目标 socket token 必须按 `[avatar emblem target type]` 父块解释，不能和装备默认 socket 或普通装备 socket 表混用。

## 礼包 `.stk`

礼包通常仍属于 stackable 层，常见类型包括：

- `[cera package]`
- `[usable cera package]`

关键结构：

```text
[package data]
ID 数量 ID 数量 ...
[/package data]
```

ID 必须根据上下文解析到 equipment 或 stackable registry。静态解析成功不证明实机开包、发放、绑定状态、背包空间或服务端放行。

## Aura `.ora`

Aura 脚本入口是：

```text
aura/aura.lst -> aura/**/*.ora
```

`.ora` 可包含：

- `[effect]`
- `[file name]`
- `[event]`
- `[target]`
- `[range]`
- `[duration]`

`.ora` 与装备里的 `[aurora avatar]` 不是同一层。`.ora` 只说明 aura 脚本资源链，不说明某件光环装备一定引用它，也不说明客户端显示正常。

## Socket 表

`etc/chn_equipmentsockettypelist.etc` 是普通装备部位到 socket token 的静态映射。

注意：

- 主目标该文件存在 10 个部位映射。
- 其中 ring 段落使用 `[/socket]` 差异关闭，不要擅自改写为 `[/socket info]`。
- 该文件不替代时装内 `[avatar type select]` 或徽章道具内 `[avatar emblem target type]`。

## 客户端资源边界

时装和光环经常引用 `.img`、`.ani`、`.ptl`。

这些引用只能证明 PVF 内存在字符串或脚本路径。客户端 ImagePacks2 / NPK / IMG 是否完整，必须走客户端资源主线；本页不证明资源可渲染、动画帧正确或 UI 正常。
