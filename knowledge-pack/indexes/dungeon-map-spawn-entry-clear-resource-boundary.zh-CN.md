# Dungeon / Map / Spawn / Entry / Clear / Resource Boundary

状态：默认可用

用途：封存副本注册、入口、地图闭合、出生、地图对象、门票、清算翻牌和资源引用边界。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作规模差异提示。

## 默认读法

1. `safety/README.zh-CN.md`
2. `encyclopedia/pvf-file-types/dungeon-map-worldmap.zh-CN.md`
3. `dictionaries/dungeon-map-spawn-entry-clear-resource-fields.zh-CN.md`
4. `task-cards/dungeon-map-spawn-entry-clear-resource-readonly-audit.zh-CN.md`
5. 本矩阵
6. 需要怪物、任务、门票、独立掉落或清算细节时，只读对应已封存入口，不重开旧主线。

## 主目标静态覆盖

| 桶 | 主目标确认 | 边界 |
| --- | --- | --- |
| PVF 规模 | 主目标只读打开后可见 402963 个 PVF 文件。 | 文件数只是静态规模，不证明客户端资源或服务端配置完整。 |
| registry 规模 | `dungeon/dungeon.lst` 324 项；`map/map.lst` 2378 项；`worldmap/worldmap.lst` 20 项；`town/town.lst` 13 项；`region/region.lst` 3 项；`monster/monster.lst` 1945 项；`passiveobject/passiveobject.lst` 6548 项；`stackable/stackable.lst` 10372 项；`etc/independentdrop.lst` 10 项。 | 所有数字 ID 必须回到对应 registry，不能跨 registry 混用。 |
| 注册副本可读性 | 324 个注册 `.dgn` 全部可读；注册路径缺失 0；读取错误 0。 | 只证明注册文件存在且可解析，不证明实机可进。 |
| 普通 `.dgn -> map` | 注册副本中观察到 1141 个 `[map specification]` 块和 131 个 `[boss map specification]` 块，合计 1272 个 map ID；全部按 `map/map.lst` 命中且文件存在；唯一 map ID 893 个。 | 仅适用于普通 map specification 父块。 |
| 旧式与反向 map 归属 | 2378 个注册 `.map` 全部可读；2265 个 `.map` 有 `[dungeon]` 反向归属；反向 dungeon ID 均可解析；覆盖 311 个注册副本。 | 没有 `[map specification]` 的旧式副本不能直接判坏，要看 `.map [dungeon]`。 |
| 特殊副本分支 | 13 个 AdvanceAltar 注册副本不被普通 `.map [dungeon]` 反向覆盖；样本使用 `[advance altar map]` 连接 map ID，map ID 仍可按 `map/map.lst` 解析。 | AdvanceAltar 是特殊规则，不并入普通副本地图规则。 |
| 副本等级 | 注册副本中 324 个 `.dgn` 均观察到 `[minimum required level]`。 | 当前主目标已有指定副本列表过滤样本；不证明服务端最终等级校验只看这一项。 |
| 门票/入场物 | 注册副本中 133 个 `.dgn` 观察到 `[required item]`；样本物品 ID 可按 `stackable/stackable.lst` 闭合。 | 当前主目标已有无票/数量不足拦截、数量满足放行和扣除样本；第三列、多门票、疲劳、组队、深渊仍未证明。 |
| worldmap 展示 | 291 个注册 `.dgn` 观察到 `[worldmap pattern info]`；20 个 worldmap registry 项均可读。 | 展示配置不证明客户端资源或按钮可点。 |
| 城镇入口 | 13 个 town 中观察到 23 个 `[dungeon gate]` 区域，引用 19 个 worldmap ID，均按 `worldmap/worldmap.lst` 解析。 | 城镇入口静态存在不证明角色能到达或入口可用。 |
| `.map` 基础形状 | 2378 个注册 `.map` 中，类型统计为 `[normal]` 2014、`[boss]` 356、`[dummy]` 8；所有注册 `.map` 可读。 | 类型字符串不证明刷怪、清算或奖励。 |
| `.map` 房间资源 | 所有注册 `.map` 均观察到 `[tile]`、`[sound]`、`[pathgate pos]` 的覆盖面；部分地图含 `[extended tile]`、动画和背景动画。 | `.til/.ani/.act/.img` 引用不证明客户端资源完整。 |
| `.map` 怪物出生 | 注册 map 中广泛观察到 `[monster]`、`[monster specific AI]`、`[event monster position]`；样本怪物 ID 可按 `monster/monster.lst` 解析。 | 不重开 Monster 主线；不证明怪物实机刷出、AI 正常、掉落正确或锁门清算。 |
| `.map` 地图对象 | 注册 map 中广泛观察到 `[passive object]` 和 `[special passive object]`；样本对象 ID 可按 `passiveobject/passiveobject.lst` 解析。 | 当前主目标已有部分 special passive object 掉落/拾取样本；高罐、非物品型对象和玩家技能 passiveobject 不在该样本内。 |
| 独立掉落 | `etc/independentdrop.lst` 注册 10 项；样本文件使用 `[list]` 记录候选物品 ID 与权重/数值。 | 不证明实机掉率，也不等同任务奖励、怪物掉落或清算翻牌。 |
| 清算翻牌 | `etc/itemdropinfo_clearreward.etc` 存在并观察到 `[drop prob]`、`[drop item type prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]`。 | 当前主目标已有 basis level 影响怪物强度和付费翻牌费用选行样本；装备池、免费金币公式、PC 房、发放路径和概率仍未证明。 |

## 代表链路

| 类型 | 链路 | 可复用结论 |
| --- | --- | --- |
| 城镇到副本 | `town/*.twn [area] -> [dungeon gate] -> worldmap/worldmap.lst -> worldmap/*.wdm [dungeon] -> dungeon/dungeon.lst -> .dgn` | 这是可观察到的静态入口链。 |
| 普通 dungeon 到 map | `dungeon/dungeon.lst -> .dgn [map specification] / [boss map specification] -> map/map.lst -> .map` | 第三列是 map ID，必须按 map registry 解析。 |
| map 反向归属 | `map/map.lst -> .map [dungeon] -> dungeon/dungeon.lst` | 用于补普通 map specification 之外的旧式闭合。 |
| 特殊副本 | `.dgn [advance altar map] -> map/map.lst -> .map` | 特殊副本使用专属父块，不套普通规则。 |
| 房间怪物 | `.map [monster] -> monster/monster.lst -> .mob` | 只确认静态出生记录和 monster registry。 |
| 地图对象 | `.map [passive object] -> passiveobject/passiveobject.lst -> .obj` | 只确认地图对象投放。 |
| 门票 | `.dgn [required item] -> stackable/stackable.lst -> .stk` | 只确认静态入场消耗。 |
| worldmap UI | `.wdm [ui path] -> worldmap/ui/*.ui [ui controls] -> .img/.act 引用` | 只确认 PVF UI 引用。 |
| 独立掉落 | `etc/independentdrop.lst -> etc/independentdrop/*.etc [list] -> item ID / weight` | 不与清算翻牌、任务奖励混用。 |
| 清算翻牌 | `etc/itemdropinfo_clearreward.etc -> gold card / pcroom / ref table 块` | 这是全局清算边界，不是普通怪物掉落。 |

## 代表样本

| 样本 | 主目标闭合 |
| --- | --- |
| dungeon ID `11` | `dungeon/dungeon.lst` 解析到 `dungeon/Act2/DraconianTower.dgn`。 |
| DragonianTower 普通 map ID `1602` | `map/map.lst` 解析到 `map/DraconianTower/(1,0)n1826.map`，类型为 `[normal]`。 |
| DragonianTower Boss map ID `1619` | `map/map.lst` 解析到 `map/DraconianTower/(0,2)gsdBoss.map`，类型为 `[boss]`。 |
| DragonianTower map 反向归属 | 两个样本 `.map` 均含 `[dungeon] 11`，可回到 dungeon registry。 |
| monster ID `50` / `51` / `71` | 在 DragonianTower `.map [monster]` 中按 `monster/monster.lst` 分别解析到对应 `.mob`。 |
| passiveobject ID `1044` / `240` / `238` | 在 DragonianTower `.map` 中按 `passiveobject/passiveobject.lst` 解析为地图对象。 |
| worldmap ID `3` | `worldmap/worldmap.lst` 解析到 `worldmap/SkyCastle.wdm`。 |
| `SkyCastle.wdm` | `[dungeon]` 中包含 `11`，`[ui path]` 指向 `worldmap/UI/SkyCastle.ui`。 |
| `SkyCastle.ui` | 观察到 worldmap 背景、按钮、switchbox 和 `.img/.act` 引用。 |
| required item ID `3340` | 在 `KingsRuins.dgn [required item]` 中按 `stackable/stackable.lst` 解析为入场材料。 |
| clear reward item ID `7279` | 在清算翻牌空白候选块中按 `stackable/stackable.lst` 解析。 |
| AdvanceAltar map ID `25081` | 在 `[advance altar map]` 中按 `map/map.lst` 解析到 AdvanceAltar 专属 `.map`。 |

## 辅助对照提示

辅助对照 PVF 只做规模提示：文件数、dungeon、map、worldmap、town、region、independentdrop 等规模均高于主目标。辅助对照说明同类结构可能更丰富，但不能覆盖主目标事实，不能把辅助对照独有 ID 或字段直接写入主目标结论。

## 不可静态证明

- 实机能进入副本。
- 怪物一定刷出、AI 正常、锁门或开门正确。
- Boss 被击杀后清算成功。
- 翻牌 UI 正常、金币扣除成功、奖励发放成功。
- 门票第三列、多门票组合、疲劳、组队、深渊、任务链外围或频道条件被服务端放行。
- 掉落概率与静态权重一致。
- `.img/.ani/.act/.til/.ui` 在客户端 ImagePacks2/NPK 中完整存在。
- BGM、音效、UI 点击、红叉、黑图和客户端显示正常。

## 封存验收

- 能从 town gate、worldmap、dungeon、map、monster、passiveobject、stackable registry 分别说明 ID 归属。
- 能区分普通 `[map specification]`、map 反向 `[dungeon]` 和 AdvanceAltar 特殊 `[advance altar map]`。
- 能说明副本门票、独立掉落、清算翻牌、任务奖励、怪物掉落分别属于不同边界。
- 能说明 PVF 资源引用和客户端资源完整性之间的边界。
- 能给出下一步实机测试项，而不是把静态闭合写成运行成功。
