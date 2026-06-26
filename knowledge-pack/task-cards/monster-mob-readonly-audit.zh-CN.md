# Monster 只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/monster-mob.zh-CN.md`
- `dictionaries/monster-fields.zh-CN.md`
- `indexes/monster-field-router-basic.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 确认目标是怪物 ID、`.mob` 路径、map/dungeon 刷怪入口，还是 action/passiveobject 召唤入口。
3. 如果输入是数字 ID，必须通过 `monster/monster.lst` 解析。
4. 如果输入是 `.mob` 路径，确认它是否被 `monster/monster.lst` 注册；未注册文件只作为引用链候选。
5. 读取目标 `.mob`。
6. 记录基础字段：`[name]`、`[level]`、`[category]`、`[face image]`、`[weight]`、`[floating height]`。
7. 记录能力字段：`[ability category]`、`[ability table]`、速度、硬直、抗性或能力 token。
8. 记录 AI 与行为字段：`[ai pattern]`、`[think term]`、`[vision]`、`[sight]`、`[warlike]`、`[attack delay]`。
9. 记录攻击链字段：`[attack info]`、`[attack action]`、`[attack motion]`、`[action list]`、`[etc attack info]`。
10. 对 `.act/.ani/.atk/passiveobject` 引用继续读对应文件，不能只停在 `.mob`。
11. 记录难度、精英或掉落字段：`[easy]`、`[medium]`、`[hard]`、`[hero]`、`[ultimate]`、`[common champion drop item]`。
12. 遇到物品 ID，按上下文解析 equipment、stackable 或其他正确 registry。
13. 涉及图像、音效、动作资源时，标记为客户端资源边界。
14. 全程不生成输出 PVF，不修改客户端。

## 验收

- 怪物 ID 已通过 `monster/monster.lst` 解析。
- 已说明目标 `.mob` 是否 registry 注册。
- `.mob` 文件读取成功，没有用文件名猜 ID。
- 能力、AI、攻击链、掉落和资源字段已分开记录。
- `.atk`、`.act`、`.ani`、passiveobject 引用没有被混成同一种东西。
- 掉落物或材料 ID 没有从数字形状猜测。
- 对字段数值效果、AI、伤害、掉率、霸体和表现均标为需要验证。
- 没有写 PVF，没有改客户端。
## 主线补充

遇到 AI、未注册 `.mob`、`[SUMMON MONSTER]`、map/dungeon `[monster]` 或掉落块时，继续执行 `task-cards/monster-ai-summon-spawn-drop-readonly-audit.zh-CN.md`。
