# monster/.mob 怪物文件

状态：需验证

## 用途

`.mob` 描述怪物基础属性、行为入口、攻击引用、对象引用、掉落入口和副本内表现。它是怪物修改、刷怪核查、怪物攻击链定位和副本导入验收的核心文件类型。

## 先读

- `dictionaries/monster-fields.zh-CN.md`
- `indexes/monster-field-router-basic.zh-CN.md`
- `task-cards/monster-mob-readonly-audit.zh-CN.md`
- `dictionaries/monster-action-animation-fields.zh-CN.md`
- `task-cards/monster-action-animation-readonly-audit.zh-CN.md`

## 常见路径

- `monster/monster.lst`
- `monster/**/*.mob`
- `monster/**/*.ai`
- `passiveobject/passiveobject.lst`
- `passiveobject/**/*.obj`
- `*.atk`
- `*.act`
- `*.ani`
- `dungeon/**/*.dgn`
- `map/**/*.map`

## 基本闭环

```text
monster/monster.lst
-> monster/**/*.mob
-> ability / ai / action / attack info / drop / resource fields
-> .act / .ani / .atk / passiveobject / map / dungeon
```

## 规则

- 怪物 ID 必须通过 `monster/monster.lst` 解析。
- `monster/` 下可能存在未被 registry 直接注册的 `.mob` 文件；这类文件只能按引用链继续查，不能当成怪物 ID。
- 怪物字段不能从装备、技能、NPC 或 stackable 文件类推。
- 怪物攻击、AI、passiveobject、map spawn 和掉落需要分别闭合。
- 改血量、攻击、行为、技能、AI、掉落或出生逻辑后需要游戏内验证。
- 教程中的怪物 ID 不能直接复用。

## 写入边界

怪物相关写入前先做只读闭合：monster registry、目标 `.mob`、引用的 action、animation、attackinfo、passiveobject、map 和 dungeon。不能闭合时不要写。
## AI、召唤、出生与掉落路由

- `.mob -> .ai`：`dictionaries/monster-ai-fields.zh-CN.md`。
- AI 标签：`indexes/monster-ai-observed-tag-router.zh-CN.md`。
- AI 反引号表达式：`indexes/monster-ai-expression-router.zh-CN.md`。
- 未注册 `.mob`、召唤、出生和掉落：`indexes/monster-entry-link-router.zh-CN.md`。
- 只读核查：`task-cards/monster-ai-summon-spawn-drop-readonly-audit.zh-CN.md`。
