# Dungeon / Map / Spawn / Entry / Clear / Resource 只读核查

状态：默认可用

用途：复核副本入口、dungeon 注册、map 闭合、房间出生、地图对象、门票、清算翻牌和客户端资源边界。本文是操作入口，不替代详细矩阵。

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/dungeon-map-worldmap.zh-CN.md`
- `dictionaries/dungeon-map-spawn-entry-clear-resource-fields.zh-CN.md`
- `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`
- 需要怪物出生细节时，只引用 `indexes/monster-entry-link-router.zh-CN.md`
- 需要门票、任务掉落、独立掉落或翻牌细节时，只引用 `indexes/quest-drop-reward-ticket-boundary.zh-CN.md`

## 执行

1. 只读打开目标 PVF，编码优先 `Tw`。
2. 副本 ID 必须先通过 `dungeon/dungeon.lst` 解析到 `.dgn`。
3. 普通副本优先读 `.dgn [map specification]` 和 `[boss map specification]`，第三列按 `map/map.lst` 解析。
4. 旧式或特殊副本还要读 `.map [dungeon]` 反向归属；AdvanceAltar 类副本读 `[advance altar map]`。
5. `.map [monster]` 首列按 `monster/monster.lst` 解析；只确认出生静态配置，不重开 Monster 主线。
6. `.map [passive object]` 首列按 `passiveobject/passiveobject.lst` 解析；只确认地图对象，不混同技能 passiveobject。
7. `.dgn [required item]` 的物品 ID 按 `stackable/stackable.lst` 解析。
8. worldmap 入口按 `town [dungeon gate] -> worldmap/worldmap.lst -> .wdm [dungeon] -> dungeon/dungeon.lst` 复核。
9. 清算翻牌只读 `etc/itemdropinfo_clearreward.etc`；独立掉落只读 `etc/independentdrop.lst` 和对应 `.etc`。
10. `.img/.ui/.ani/.act/.til` 引用只证明 PVF 写了引用；客户端 ImagePacks2/NPK 完整性另查。

## 验收

- 没有把数字 ID 按外形猜成副本、地图、怪物、物品或对象。
- `.dgn -> map.lst -> .map` 与 `.map -> dungeon.lst` 的两种闭合形状已区分。
- AdvanceAltar 类特殊分支没有被并入普通 `[map specification]` 规则。
- 门票、任务、怪物出生、独立掉落和清算翻牌没有互相混用。
- 只写静态边界，不声明实机进图、刷怪、清算、翻牌、资源显示或服务端放行成功。

## 下一步实机测试

1. 选一个已有入口副本，确认城镇门、worldmap 按钮和副本列表可见。
2. 进图后确认起始房间、Boss 房间、门、怪物出生和地图对象表现。
3. 若涉及 `[required item]`，分别测有票、无票、数量不足三种入场结果。
4. 通关后确认结算 UI、翻牌、金币消耗和奖励发放。
5. 若出现红叉、黑图、缺音或 UI 错位，再进入客户端 ImagePacks2/NPK 主线。
