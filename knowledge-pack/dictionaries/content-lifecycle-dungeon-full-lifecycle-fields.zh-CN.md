# Content Lifecycle / Dungeon Full Lifecycle 字段词典

状态：默认可用

用途：说明副本完整生命周期中各层标签的静态读法、registry 归属和风险边界。本文不替代已封存的 Dungeon、Formal Region、Quest Ticket、Monster、PassiveObject、Clear Reward、Client Assets、Client UI Layout、Audio 主线。

## 入口与 worldmap

| 字段/块 | 静态读法 | 边界 |
| --- | --- | --- |
| `region/region.lst` | region ID 到 `.rgn` 文件。 | region ID 不等于 town/worldmap/dungeon ID。 |
| `.rgn [towns]` | 块内数字按 `town/town.lst` 解析。 | 缺号只能记为静态风险，不能用别的 registry 补。 |
| `town/town.lst` | town ID 到 `.twn` 文件。 | town ID 不等于 worldmap ID。 |
| `.twn [area]` | 区域块可直接指向 town map 路径，并带 `[normal]`、`[gate]`、`[dungeon gate]` 等类型。 | area 地图路径不是裸 `map/map.lst` ID。 |
| `.twn [dungeon gate]` | 后续数字按 `worldmap/worldmap.lst` 解析。 | 静态 gate 不证明角色能进入或入口可点。 |
| `worldmap/worldmap.lst` | worldmap ID 到 `.wdm` 文件。 | worldmap ID 不等于 dungeon ID。 |
| `.wdm [dungeon]` | 块内 dungeon 数字按 `dungeon/dungeon.lst` 解析；相邻状态/条件数字只按字段上下文保留。 | 不证明按钮可点、条件满足或服务端放行。 |
| `.wdm [ui path]` | 指向 `worldmap/ui/*.ui`。 | UI 文件存在不证明客户端显示正常。 |

## Dungeon 与 map

| 字段/块 | 静态读法 | 边界 |
| --- | --- | --- |
| `dungeon/dungeon.lst` | dungeon ID 到 `.dgn` 文件。 | registry 命中不证明实机可进图。 |
| `.dgn [minimum required level]` | 静态最低等级字段。 | 不证明服务端最终等级校验只按该字段执行。 |
| `.dgn [worldmap pattern info]` | worldmap 显示/槽位资源线索。 | 不证明 worldmap UI 正常或资源完整。 |
| `.dgn [pathgate object]` | 当前代表样本中按 passiveobject registry 解析路径门对象。 | 路径门对象存在不证明开门/锁门逻辑。 |
| `.dgn [map specification]` | 常规副本地图块；第三列按 `map/map.lst` 解析。 | 不把坐标列当 map ID。 |
| `.dgn [boss map specification]` | Boss 地图块；第三列按 `map/map.lst` 解析。 | 静态 Boss map 不证明清图或 Boss 击杀判定。 |
| `.map [dungeon]` | map 到 dungeon 的反向归属。 | 只用于静态闭合，不证明 map 被实际选择。 |
| `.map [type]` | 观察到 `[normal]`、`[boss]` 等类型字符串。 | 类型不证明刷怪、结算或奖励。 |
| `.map [tile]` / `[extended tile]` / `[animation]` / `[background animation]` | tile、动画、背景资源引用。 | 不证明客户端 NPK/IMG/TIL/ANI 资源完整。 |
| `.map [sound]` | BGM/环境声音 token。 | 不证明 SoundPacks/Music 中存在或实机播放。 |

## Spawn、monster 与地图对象

| 字段/块 | 静态读法 | 边界 |
| --- | --- | --- |
| `.map [monster]` | 首列按 `monster/monster.lst` 解析，后续列是出生/控制/类型样参数。 | 不证明怪物刷出、AI 正常、锁门、掉落或清算。 |
| `.map [monster specific AI]` | 与 monster 行相邻的 AI profile 字符串。 | 不证明实机 AI 选择或行动时序。 |
| `.map [event monster position]` | 事件怪物位置候选坐标。 | 不证明事件怪物实际生成。 |
| `.mob [attack motion]` | monster 动作动画入口。 | 不等于攻击命中或 AI 选择。 |
| `.mob [attack info]` | monster 攻击 payload 入口，通常指向 `.atk`。 | 不提供帧级 hitbox 或最终伤害。 |
| `.map [passive object]` | 首列按 `passiveobject/passiveobject.lst` 解析，作为地图静态放置对象。 | 不等同玩家技能 passiveobject，也不证明对象实际生成。 |
| `.map [special passive object]` | 特殊地图对象块；首列仍按父块上下文解析为 passiveobject。 | 后续列不能套普通 `[passive object]` 全部含义。 |
| `.obj [basic motion]` | MapObject 可直接指向 ANI。 | 不必然有 `.act/.atk` 行为链。 |
| `.obj [etc motion]` / `[string data]` / `[int data]` | 额外动画、粒子、声音 token 或对象参数。 | 不证明破坏、掉落、触发、碰撞或音效播放。 |

## Ticket、clear reward、UI 与资源

| 字段/块 | 静态读法 | 边界 |
| --- | --- | --- |
| `.dgn [required item]` | 物品 ID 按 `stackable/stackable.lst` 解析；当前样本门票侧样本为 `KingsRuins.dgn -> 3340`。 | 不证明扣票、入场或服务端放行。 |
| `etc/itemdropinfo_clearreward.etc [drop prob]` | 清算/翻牌支持表中的 profile 与等级段线索。 | 不证明真实概率。 |
| `[gold card cost table]` | 金牌费用表线索。 | 不证明金币扣除成功。 |
| `[gold card blank item]` / `[pcroom card blank item]` | 候选物品 ID 按 stackable registry 解析。 | 不证明奖励发放、PC 房/黑钻状态或 UI 正常。 |
| `.ui [ui controls]` | 控件类型、坐标、IMG/ACT 路径和末列 dungeon 样 ID。 | 坐标、帧号和控件编号不能当 registry；UI 存在不证明可点击。 |
| `.img/.ani/.act/.til/.ptl` 引用 | 只说明 Script 侧引用了这些资源路径。 | 不证明客户端资源包完整或加载顺序正确。 |

## 当前代表 ID

| 上下文 | ID | 主目标解析 |
| --- | ---: | --- |
| worldmap | 3 | `worldmap/SkyCastle.wdm` |
| dungeon | 11 | `dungeon/Act2/DraconianTower.dgn` |
| map | 1602 | `map/DraconianTower/(1,0)n1826.map` |
| map | 1619 | `map/DraconianTower/(0,2)gsdBoss.map` |
| monster | 50 / 51 / 70 / 71 / 72 | 翼龙、蓝翼龙、龙人、鲁卡斯、蓝龙人相关 `.mob` |
| monster | 61726 | event monster 侧样本，解析到黄金哥布林 `.mob` |
| passiveobject | 1044 / 1045 | 天空之城龙头铜像 trap 对象 |
| passiveobject | 240 / 235 / 238 / 801 / 1035 | 喷泉、箱子、柱子、水晶柱等 mapobject |
| passiveobject | 401 | `MapObject/PathGate/Act2/DTLeftNormal.obj` |
| stackable | 3340 | `stackable/material/gold_coin.stk`，门票侧样本 |
| stackable | 7279 / 7454 / 7455 | 清算/PC 房卡候选物品侧样本 |
