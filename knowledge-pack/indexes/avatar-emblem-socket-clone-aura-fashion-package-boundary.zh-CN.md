# Avatar / Emblem / Socket / Clone / Aura / Fashion Package Boundary

状态：已完成静态只读封存。

本索引用于路由时装、徽章、镶嵌、克隆、光环、礼包相关问题。它只覆盖 PVF 静态注册链、字段块和资源引用边界，不覆盖实机穿戴、开包、镶嵌、克隆、UI、客户端资源完整或服务端放行。

## 总链路

```text
时装装备：
equipment/equipment.lst
  -> equipment/**/*.equ
    -> [equipment type]
    -> [avatar type select]
    -> [avatar select ability]
    -> [emblem socket default]
    -> [aurora avatar] / [aura ability] / [aurora graphic effects]

徽章道具：
stackable/stackable.lst
  -> stackable/**/*.stk
    -> [stackable type] [avatar emblem]
    -> [avatar emblem target type]

礼包道具：
stackable/stackable.lst
  -> stackable/**/*.stk
    -> [stackable type] [cera package] / [usable cera package]
    -> [package data]
      -> equipment/equipment.lst 或 stackable/stackable.lst

Aura 脚本：
aura/aura.lst
  -> aura/**/*.ora
    -> [effect]
    -> [file name] / .ani / .ptl
```

## 主目标覆盖

| 项目 | 数量 |
| --- | ---: |
| PVF 总文件 | 402963 |
| equipment registry 条目 | 72631 |
| stackable registry 条目 | 10372 |
| aura registry 条目 | 12 |
| 装备 `.equ` 扫描 | 79930 |
| stackable `.stk` 扫描 | 10467 |
| 装备读取错误 | 0 |
| stackable 读取错误 | 0 |
| avatar / aura 相关装备候选 | 48828 |
| 已注册候选装备 | 45478 |
| 未注册候选装备 | 3350 |
| 徽章类 stackable | 610 |
| 礼包类 stackable | 3757 |
| aura `.ora` 文件 | 20 |

## 时装装备类型

| `[equipment type]` | 数量 |
| --- | ---: |
| `[coat avatar]` | 6266 |
| `[pants avatar]` | 6089 |
| `[hair avatar]` | 5950 |
| `[shoes avatar]` | 5861 |
| `[hat avatar]` | 5849 |
| `[breast avatar]` | 5274 |
| `[face avatar]` | 5226 |
| `[waist avatar]` | 5087 |
| `[skin avatar]` | 2416 |
| `[aurora avatar]` | 616 |
| `[weapon avatar]` | 1 |

未注册候选装备只表示存在文件或字段命中，不表示可获得、可穿戴、可发放。

## Socket 块边界

| 父块 | 块数量 | 闭合数量 | 主要 token |
| --- | ---: | ---: | --- |
| `[avatar type select]` | 42692 | 42692 | A/B/C/D/S/M socket |
| `[emblem socket default]` | 497 | 497 | M/A/D/B socket |
| `[avatar emblem target type]` | 558 | 558 | S/C/A/B/D socket |
| `etc [socket info]` | 10 | 9 | A/B/C/D/S socket |

读取规则：

- socket token 不带全局固定语义，必须按父块解释。
- `[avatar type select]` 是时装装备内的候选/孔位结构。
- `[emblem socket default]` 是装备默认孔结构。
- `[avatar emblem target type]` 是徽章道具目标孔结构。
- `etc/chn_equipmentsockettypelist.etc` 是普通装备部位到 socket token 的静态映射，其中 ring 段落使用 `[/socket]` 差异闭合，需按风险记录，不擅自改写。

## 可选能力边界

`[avatar select ability]`：

| 指标 | 数量 |
| --- | ---: |
| 块数量 | 46084 |
| 闭合数量 | 46084 |
| `[SKILL_LEVEL]` 候选项 | 321092 |

边界：

- `[avatar select ability]` 是闭合候选池。
- `[SKILL_LEVEL]` 是候选项类型 token。
- 技能 ID 必须结合职业 token 再路由到 skill registry。
- 不要把本块和固定 `[skill levelup]`、`[skill data up]`、`[all skill item]` 混用。

## 徽章与礼包边界

徽章：

| 指标 | 数量 |
| --- | ---: |
| `[stackable type] [avatar emblem]` | 558 |
| `[avatar emblem target type]` 块 | 558 |
| 已注册徽章类 stackable | 609 |

礼包：

| 指标 | 数量 |
| --- | ---: |
| `[cera package]` | 1820 |
| `[usable cera package]` | 1785 |
| `[package data]` 块 | 3605 |
| ID/数量组 | 30116 |
| 解析到 equipment | 27758 |
| 解析到 stackable | 2343 |
| 未解析 | 15 |

`[package data]` 读取规则：

- 按 “ID、数量” 成组读取。
- ID 先查 equipment registry，再查 stackable registry。
- 未解析 ID 写为静态 registry 风险。
- 静态闭合不证明开包成功、背包空间足够、绑定状态正确或服务端发放。

## 光环边界

装备侧：

| 字段 | 数量 |
| --- | ---: |
| `[aurora avatar]` | 616 |
| `[aura hud icon]` | 575 |
| `[aura ability]` | 546 |
| `[aurora graphic effects]` | 575 |

`[aura ability]` token：

| token | 数量 |
| --- | ---: |
| `[none]` | 250 |
| `[party teleport]` | 183 |
| `[solo teleport]` | 109 |
| `[upgrade solo teleport]` | 4 |

`[aurora graphic effects]`：

| 指标 | 数量 |
| --- | ---: |
| `.ani` 引用 | 1982 |
| `.ani` 静态命中 | 1941 |
| `.ani` 未命中 | 41 |
| 显式闭合次数 | 65 |

Aura registry：

| 指标 | 数量 |
| --- | ---: |
| `aura/aura.lst` 注册条目 | 12 |
| 注册路径命中 | 12 |
| PVF 内 `.ora` 文件 | 20 |
| 未注册 `.ora` | 8 |

边界：

- `[aurora avatar]` 是装备类型；`aura/aura.lst` 是 aura 脚本 registry，二者不能合并。
- `[aura ability]` 中 teleport token 的参数、冷却、队伍范围和实际可用性都需要实机测试。
- `[aurora graphic effects]` 不是所有样本都有关闭标签，不能强制补齐。
- `.ani/.ptl/.img` 引用不能证明客户端资源完整。

## Clone 边界

主目标 clone 关键词命中：

| 层 | 数量 |
| --- | ---: |
| equipment | 298 |
| stackable | 9 |

clone 关键词只能作为定位线索。若要判断克隆时装是否可用，需要另做最小实机样本：克隆 UI、外观继承、消耗材料、客户端资源和服务端放行均不在静态封存范围内。

## 辅助对照提示

辅助对照只作为差异提示，不覆盖主目标。

| 项目 | 辅助对照 |
| --- | ---: |
| PVF 总文件 | 1052773 |
| avatar / aura 相关装备候选 | 72920 |
| 徽章类 stackable | 952 |
| 礼包类 stackable | 6591 |
| `[avatar type select]` | 62369 |
| `[avatar select ability]` | 70177 |
| `[emblem socket default]` | 270 |
| `[aura ability]` | 501 |
| aura `.ora` 文件 | 12 |

辅助对照提示可写为：

- “辅助对照规模更大，提示 avatar / package 内容存在版本差异。”
- “辅助对照出现更多 clone 与 socket 命中，但不能覆盖主目标。”
- “辅助对照存在少量闭合差异，不能作为主目标修正依据。”

## 与已封存主线的边界

| 关联主线 | 只引用什么 | 不重开什么 |
| --- | --- | --- |
| Equipment / Stackable | 引用 registry、基础字段和 stackable 类型。 | 不重开装备/道具全字段盘点。 |
| Stackable Container / Package | 引用容器和礼包静态开包边界。 | 不重开礼盒概率、候选池和 UI 验证。 |
| RandomOption / Mystic | 引用 hidden option / mystic 边界。 | 不重开随机属性池。 |
| Skill Learnability | 引用 skill registry 路由。 | 不重开技能可学、SP/TP 或冷却主线。 |
| Client Assets | 引用客户端资源完整性边界。 | 不在本主线证明 ImagePacks2/NPK/IMG 完整。 |

## 结论模板

可以使用：

```text
主目标静态观察到该时装装备经 equipment registry 注册，文件内存在 avatar 类型和对应 socket / ability 块；该结论不证明实机可穿戴、UI 正常或客户端资源完整。
```

风险写法：

```text
主目标静态观察到该礼包 [package data] 内部分 ID 未能按 equipment / stackable registry 解析，应记录为静态发放链风险；是否影响实机开包需要运行测试。
```
