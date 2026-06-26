# Creature / Pet 资料线索补强索引

状态：已补强

适用范围：宠物本体、宠物商品、宠物蛋、宠物装备、pet registry、creature 脚本/文本、passiveobject creature 资源、客户端宠物资源。

## 定位

本页用于说明：资料线索对 Creature / Pet 主线的作用是“定向排查”，不是直接产出字段事实。Workbench 的字段事实仍以主目标 PVF 只读观察为准。

## 资料线索确认的排查方向

资料线索与已封存主线一致支持以下分层：

1. 宠物本体走 `creature/creature.lst`，读取 `.cre`。
2. 宠物商品、宠物蛋和宠物装备走 `equipment/equipment.lst` 下的 `equipment/creature/*.equ`。
3. `pet/pet.lst` 是独立小 registry，不并入 creature 主系统。
4. 宠物脚本或文本走 `creature/script/creature.lst` 与 `.wrd`。
5. stackable 容器里的 `[creature]` 候选优先按 equipment creature 商品/蛋语境核查。
6. `[creature species]` 需要回 `creature/creature.lst` 复核。
7. `[output index]` 是 equipment ID 语境，不能当 creature ID。
8. `passiveobject/creature/` 是技能、攻击或效果资源入口，不证明实机命中或伤害。
9. 宠物贴图、动画、UI 和 NPK 属于客户端资源验证面，不能由 PVF 路径直接证明完整。

## 已加固边界

- `creature` 和 `pet` 都可能被资料称作宠物相关目录，但 registry 不同，不能合并。
- 宠物本体 `.cre` 与宠物商品 `.equ` 是两层，不要互相替代。
- 宠物蛋、普通宠物、宠物装备 artifact 都在 equipment creature 语境下出现，需要继续看 `[equipment type]`、`[sub type]`、`[creature species]`、`[output index]` 等字段。
- `[creature species]` 不是天然闭合；遇到具体文件仍需复核。
- `[output index]` 不是 creature 本体 ID。
- 宠物礼包或自选礼盒只说明容器输出候选，不证明孵化、召唤、发奖或 UI 正常。
- 客户端宠物贴图或动画资源必须另查客户端，不能由 PVF 静态路径证明。

## 路由建议

当问题涉及“宠物 ID 到底走哪个 registry”、“宠物蛋和宠物本体怎么区分”、“宠物装备 artifact 怎么核查”、“宠物礼包里的 creature 候选怎么解析”、“宠物贴图/NPK 是否需要另验”、“资料库是否支持这些分层”时，先读：

- `safety/README.zh-CN.md`
- `task-cards/creature-pet-readonly-audit.zh-CN.md`
- `dictionaries/creature-pet-fields.zh-CN.md`
- `indexes/creature-pet-boundary.zh-CN.md`
- `indexes/stackable-container-package-boundary.zh-CN.md`
- 本页

## 不能外推

本页不证明：

- 宠物可以实机召唤。
- 宠物蛋可以孵化成功。
- 宠物礼包或自选礼盒可以发奖。
- 宠物技能可以释放、命中或造成正确伤害。
- 宠物 AI、跟随、同步、冷却、MP 消耗正常。
- 宠物装备 artifact 属性实际生效。
- 宠物进化任务、材料扣除或等级检查生效。
- 客户端宠物贴图、动画、声音或 UI 资源完整。
- 服务器允许对应宠物系统行为。
