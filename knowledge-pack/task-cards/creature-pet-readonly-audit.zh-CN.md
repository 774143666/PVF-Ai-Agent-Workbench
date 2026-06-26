# Creature / Pet 只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `dictionaries/creature-pet-fields.zh-CN.md`
- `indexes/creature-pet-boundary.zh-CN.md`
- `dictionaries/equipment-fields.zh-CN.md`
- `indexes/stackable-container-package-boundary.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 如果核查宠物本体，先走 `creature/creature.lst` 定位 `.cre`，不要用 equipment ID 代替 creature ID。
3. 如果核查宠物道具、宠物蛋或宠物装备，先走 `equipment/equipment.lst`，再定位 `equipment/creature/*.equ`。
4. 读取 equipment creature 的 `[equipment type]`、`[sub type]`、`[creature species]`、`[output index]`、`[need material]`、属性字段和资源字段。
5. 对 `[creature species]`，按 `creature/creature.lst` 复核；若不能闭合，记录为风险，不猜。
6. 对 `[output index]`，按 `equipment/equipment.lst` 复核；不要把它当 `creature/creature.lst` ID。
7. 如果核查宠物脚本或名称文本，读 `creature/script/creature.lst` 到 `.wrd`。
8. 如果核查 `pet/pet.lst`，单独按 pet registry 读取 `.pet`，不要和 creature registry 混为一类。
9. 如果涉及宠物技能、攻击、被动对象或动画，只做静态入口闭合；命中、伤害、AI、资源和同步必须另验。
10. 辅助对照 PVF 只记录结构和规模差异，不提升为主目标事实。

## 验收

- 能区分 `creature/creature.lst`、`creature/script/creature.lst`、`pet/pet.lst` 和 `equipment/equipment.lst` 下的 `equipment/creature`。
- 能说明宠物本体 `.cre` 与宠物道具 `.equ` 是两层。
- 能说明 `[creature species]` 与 `[output index]` 走不同 registry。
- 能识别宠物蛋、普通宠物、宠物装备 artifact 的差异。
- 能说明 `passiveobject/creature` 只是运行链资源入口，静态存在不证明宠物技能实机命中或伤害。
- 不生成输出 PVF，不改客户端，不写运行产物进 knowledge-pack。

## 运行边界

静态只读能证明 registry、`.cre`、`.equ`、`.pet`、`.wrd`、动画/攻击/被动对象路径存在。它不能证明宠物可召唤、宠物蛋可孵化、材料扣除成功、宠物技能可释放、攻击命中、伤害正确、AI 行为正确、客户端资源完整或服务端放行。
