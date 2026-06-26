# PVF 文件类型：Content Lifecycle / Dungeon Full Lifecycle

状态：默认可用

用途：说明一个副本从入口到清算的 PVF 静态层级。本文是文件类型总览，不替代各文件族的详细字段词典。

## 静态层级

| 文件族 | 在副本生命周期中的位置 | 主要风险 |
| --- | --- | --- |
| `region/region.lst`、`region/*.rgn` | 区域到城镇的上游入口。 | region ID 不能当 town/worldmap/dungeon ID。 |
| `town/town.lst`、`town/*.twn` | 城镇区域、普通 gate 和 dungeon gate。 | `[dungeon gate]` 后续数字按 worldmap registry。 |
| `worldmap/worldmap.lst`、`worldmap/*.wdm` | worldmap 到 dungeon 列表和 worldmap UI。 | `.wdm` 不证明按钮可点或服务端放行。 |
| `worldmap/ui/*.ui` | worldmap 控件、按钮、IMG/ACT 引用和 dungeon 样绑定。 | UI 控件存在不证明显示或点击正常。 |
| `dungeon/dungeon.lst`、`dungeon/*.dgn` | 副本本体、等级、地图布局、路径门、门票、特殊事件和地图选择。 | `.dgn` 注册不证明实机可进图。 |
| `map/map.lst`、`map/*.map` | 房间本体、tile、背景、声音、怪物出生、地图对象、NPC 和反向 dungeon。 | map 静态类型不证明刷怪、清图或奖励。 |
| `monster/monster.lst`、`monster/*.mob` | 出生怪物本体、motion、attack info、属性和 AI 入口。 | `.mob` 不证明 AI、命中、伤害或掉落。 |
| `passiveobject/passiveobject.lst`、`passiveobject/*.obj` | 地图对象、路径门、破坏物、箱子、trap 或其他对象。 | `.obj` 不证明对象创建、触发、破坏或碰撞。 |
| `stackable/stackable.lst`、`stackable/*.stk` | 门票、候选奖励、翻牌候选或材料。 | stackable 命中不证明扣除或发放。 |
| `etc/itemdropinfo_clearreward.etc` | 全局清算/翻牌支持表。 | 不证明概率、UI、金币扣除或奖励领取。 |
| `.img/.ani/.act/.til/.ptl` 引用 | Script 侧资源引用。 | 不证明客户端 ImagePacks2/NPK/SoundPacks/Music 完整。 |

## 代表链路

当前代表链路为 `Arad -> WestCoast -> SkyCastle -> DraconianTower -> map 1602/1619 -> monster/passiveobject -> UI/resource/audio`。它适合做静态检查模板，但不能替代所有副本类型；特殊副本、活动副本、塔类副本、远古副本、warroom 或 AdvanceAltar 仍要按自身父块复核。

## 实机前最低验收

1. 所有数字 ID 已按父块和 registry 解析。
2. `.dgn` 到 `.map`、`.map` 到 `.mob/.obj` 的路径已读回。
3. 门票字段只在目标副本实际存在时写入目标链。
4. UI、图片、动画、tile、粒子、声音只写为“引用存在”。
5. 任何运行效果都留给客户端/服务端/实机测试。
