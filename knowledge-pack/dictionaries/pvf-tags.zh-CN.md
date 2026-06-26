# PVF 常见标签路由索引

本文是轻量入口，不是全量标签表。需要具体标签时，按专题进入索引分片；字段解释正文仍以各专题词典和 workflow 为准。

使用规则：

- 先按领域选择下方入口，再读取对应详细路由或字段索引。
- `默认可用` 只表示可作为 Workbench 的普通执行入口；仍需读取目标 PVF、解析 registry、显式输出、readback。
- `需验证` 只表示可作为核查入口；写入前必须回到目标 PVF 样本、资料库或游戏内验证。
- `禁用` 不作为快速修改入口。
- 全量 equipment 覆盖由 `indexes/pvf-tag-router-*.zh-CN.md` 分片承接，本文不重复长表。

## 默认入口

| 领域 | 状态 | 入口 |
| --- | --- | --- |
| NPC 商店链路 | 默认可用 | `workflows/npc-shop-edit.zh-CN.md`；`dictionaries/npc-shop-fields.zh-CN.md` |
| Equipment 主入口 | 需验证 | `dictionaries/equipment-fields.zh-CN.md` |
| Equipment 基础、抗性、条件、规则标签 | 需验证 | `indexes/pvf-tag-router-equipment-basic-rules.zh-CN.md` |
| Equipment avatar、aura、外观、动作标签 | 需验证 | `indexes/pvf-tag-router-equipment-avatar-visual.zh-CN.md` |
| Equipment 套装、技能、触发、效果标签 | 需验证 | `indexes/pvf-tag-router-equipment-effect.zh-CN.md` |
| Equipment 反引号 token | 需验证 | `indexes/equipment-bracket-value-tokens.zh-CN.md` |
| Stackable 字段 | 需验证 | `dictionaries/stackable-fields.zh-CN.md` |
| Runtime / APC | 需验证 | runtime、appendage、passiveobject、APC 专项 workflow；不要走 equipment 快速入口 |

## 常用快捷路由

| 标签或问题 | 状态 | 入口 |
| --- | --- | --- |
| `[item shop]` / `[sell item]` | 默认可用 | `workflows/npc-shop-edit.zh-CN.md`；`dictionaries/npc-shop-fields.zh-CN.md` |
| `[price]` / `[cash]` / `[need material]` | 默认可用/需验证 | NPC 商店链路优先；equipment / stackable 同名字段按各自词典解释 |
| `[name]` / `[rarity]` / `[minimum level]` / 基础属性字段 | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；详细标签路由见 basic-rules 分片 |
| `[usable job]` / 职业 token | 需验证 | `indexes/equipment-basic-fields.zh-CN.md`；token 见 `indexes/equipment-bracket-value-tokens.zh-CN.md` |
| `[avatar type select]` / socket token | 需验证 | `indexes/avatar-type-select.zh-CN.md`；详细标签路由见 avatar-visual 分片 |
| `[avatar select ability]` / `[SKILL_LEVEL]` | 需验证 | `indexes/avatar-select-ability.zh-CN.md`；`indexes/skill-registry-routing.zh-CN.md` |
| `[aura ability]` / `[emblem socket default]` / `[aurora graphic effects]` | 需验证 | `indexes/avatar-aura-fields.zh-CN.md` |
| `[set ability]` / `[piece set ability]` / 套装字段 | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；详细标签路由见 effect 分片 |
| `[if]` / `[then]` / 触发条件和效果 | 需验证 | `indexes/equipment-effect-fields.zh-CN.md`；`indexes/equipment-runtime-trigger-fields.zh-CN.md` |
| `[skill levelup]` | 需验证 | `indexes/skill-levelup.zh-CN.md`；职业 skill registry 见 `indexes/skill-registry-routing.zh-CN.md` |
| `[skill data up]` | 需验证 | `indexes/skill-data-up-types.zh-CN.md` |
| 低频硬编码、旧拼写、样例型字段 | 需验证 | `indexes/equipment-hardcoded-legacy-fields.zh-CN.md`；`indexes/equipment-bracket-value-tokens.zh-CN.md` |
| `[passive object]` | 禁用 | 不作为 equipment 快速入口；走 passiveobject 专项 workflow |

## 维护边界

- 本文保持短入口，不再承接全量标签行。
- 新增标签时，先写入对应专题分片或字段索引，再在本文只补领域级入口。
- 如果 coverage 检查发现未覆盖标签，优先补到专题分片，不把主入口重新扩成大表。
- 本文和分片都只放纯 Workbench 路由，不写外部来源位置。
