# Monster AI / 召唤 / 出生 / 掉落只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/monster-mob.zh-CN.md`
- `dictionaries/monster-fields.zh-CN.md`
- `dictionaries/monster-ai-fields.zh-CN.md`
- `indexes/monster-ai-observed-tag-router.zh-CN.md`
- `indexes/monster-ai-expression-router.zh-CN.md`
- `indexes/monster-entry-link-router.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开，编码优先 `Tw`。
2. 输入为数字 monster ID 时，必须先通过 `monster/monster.lst` 解析。
3. 输入为 `.mob` 路径时，先确认主 registry 是否注册，再查其他脚本文本直接路径入边。
4. AI 核查从 `.mob [ai pattern]` 进入，逐个解析难度分支中的 `.ai` 路径，再继续追踪 `.ai -> .ai`。
5. AI 缺失引用按源文件与原始路径记录；不要用同名文件猜测补链。
6. `[SUMMON MONSTER]` 位于行为块时读取 `[INDEX]`；位于 `[TRIGGER] -> [WHICH]` 时按选择器处理。
7. 召唤和出生的 monster ID 均通过 `monster/monster.lst` 解析。
8. map/dungeon `[monster]` 块只把完整数值记录当出生行；`[NPC]`、`[champion]` 后的短行单独记录。
9. `.mob` 掉落块中的物品 ID 按 equipment / stackable 正确 registry 解析。
10. registry 未命中、缺失引用、未观察到入边和未解析 ID 只记录，不修复。
11. 不写 PVF，不修改客户端，不声明 AI、召唤、出生或掉落的运行效果。

## 验收

- monster ID 没有靠文件名或全局数字搜索猜测。
- `.mob -> .ai` 与 `.ai -> .ai` 都有存在/缺失判断。
- 无入边 `.ai` 与未注册 `.mob` 没有被直接判定为废弃文件。
- `[SUMMON MONSTER]` 行为块和选择器用法已分开。
- map/dungeon 完整出生行和短数字附属行已分开。
- 掉落物品 ID 已经过正确 registry 解析，未命中项没有补猜。
- 全程只读，没有生成输出 PVF，没有修改客户端。
