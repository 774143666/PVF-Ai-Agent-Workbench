# LST Registry / `.lst` 文件类型

状态：默认可用

## 用途

`.lst` 是 PVF 中常见的 ID 列表文件。它可以把数字 ID 映射到 PVF 内部文件路径，也可以映射到名称、文本、数值组或其他非路径数据。

## 主要类型

| 类型 | 例子 | 用法 |
| --- | --- | --- |
| 文件路径 registry | `equipment/equipment.lst`、`stackable/stackable.lst`、`monster/monster.lst`、`map/map.lst`、`dungeon/dungeon.lst` | 把 ID 解析到 PVF 内部文件路径 |
| 职业技能 registry | `skill/swordmanskill.lst`、`skill/mageskill.lst` 等 | 按职业把技能 ID 解析到 `.skl` |
| 名称表 | `itemname.lst`、`monstername.lst`、`npcname.lst`、`skillname*.lst` | 把 ID 解析到显示名或文本，不是文件路径 |
| 数值/分组表 | `n_quest/epicquest.lst`、`aicharacter/operatingvalue.lst` | 保存分组、数值或运行参数线索，不是通用路径 registry |
| 跨语言/旧表 | `*.jpn.lst`、`old passiveobject.lst` | 可作为差异或历史提示，不能默认覆盖主表 |

## 核心规则

- 数字 ID 没有全局唯一语义。
- 选择 registry 前必须先确认字段父块和上下文。
- 同一数字可以在多个 registry 中同时存在。
- 同一文件路径可以被多个 ID 指向。
- 名称表和数值表不能当文件路径 registry。
- 注册路径存在只证明 PVF 内部文件存在，不证明实机成功。
- 未注册文件不等于孤儿；可能由直接路径、动作链、脚本链、资源链或客户端链引用。

## 常见闭环

```text
父块/字段
-> 选择正确 .lst registry
-> 数字 ID
-> PVF 内部路径或表值
-> 读取目标文件或解释表值
-> 再按目标文件类型继续解析
```

示例：

```text
NPC 商店 role
-> itemshop/itemshop.lst
-> itemshop/*.shp
-> [sell item]
-> equipment/equipment.lst 或 stackable/stackable.lst
```

```text
地图怪物 spawn
-> monster/monster.lst
-> monster/*.mob
```

```text
副本地图引用
-> map/map.lst
-> map/*.map
```

## 写入边界

改 PVF 前必须先确认：

1. 目标字段的父块。
2. 该父块使用的 registry。
3. 数字 ID 解析出的 PVF 内部路径。
4. 目标文件存在且块结构符合预期。
5. 输出 PVF 路径不是源 PVF。

只读阶段不能因为 `.lst` 命中就宣布实机成功；写入实验仍需备份、最小改动、显式输出、读回和实机测试。
