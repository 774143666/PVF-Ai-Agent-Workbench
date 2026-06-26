# Workflows

这里放纯执行流程。workflow 只写怎么做，不写实验来源和旧路径。

默认规则：

- 先只读闭合。
- 写入前确认目标 PVF 和输出 PVF。
- 所有数字 ID 通过 `.lst` 解析。
- 写出后读回。
- 需要游戏内验证的任务，报告里必须说明怎么测。

已建入口：

- `runtime-validation-absorption.zh-CN.md`：实机验证 PASS/FAIL/负例吸收到 clean knowledge-pack 的流程。
- `npc-shop-edit.zh-CN.md`：NPC 商店只读闭合、受控写入和游戏内验收。
- `skill-derivative-and-cancel.zh-CN.md`
- `skill-runtime-parameter-edit.zh-CN.md`：技能运行参数、TP/特性/Ex 覆盖、连射/段数/手感修改流程。
- `item-stackable-dependency-planner.zh-CN.md`：装备、stackable、礼包、宝珠、宠物、光环相邻依赖只读规划。
- `equipment-avatar-aura-creature-extraction-planner.zh-CN.md`：装备、光环、时装、宠物、宠物蛋提取预览。
- `stackable-package-orb-card-extraction-planner.zh-CN.md`：stackable、礼包、宝箱、选择箱、宝珠、卡片提取预览。
- `client-asset-path-preview.zh-CN.md`：ANI/ALS/IMG/NPK/ImagePacks2 资源路径只读预览。
- `dungeon-extraction-planner.zh-CN.md`：副本、地图、怪物、地图对象、APC、UI/资源线索的只读提取预览。
- `apc-extraction-planner.zh-CN.md`：APC / AICharacter / AI / key stream 的只读提取与分析。
