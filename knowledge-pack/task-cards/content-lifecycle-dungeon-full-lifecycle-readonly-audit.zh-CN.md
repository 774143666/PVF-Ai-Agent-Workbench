# Content Lifecycle / Dungeon Full Lifecycle 只读审计卡

状态：默认可用

用途：把一个代表副本从入口、worldmap、dungeon、map、spawn、monster、地图对象、门票侧样本、清算、UI、资源和音频串成静态检查链。本文只记录主目标 PVF 只读观察和辅助对照差异提示；不授权写 PVF，不证明实机可进图、可通关、可清算或资源完整。

## 先读结论

- 当前代表副本为 dungeon ID `11`，按 `dungeon/dungeon.lst` 解析到 `dungeon/Act2/DraconianTower.dgn`，名称为 `龙人之塔`。
- 静态入口链为 `region/Arad.rgn [towns] -> town/town.lst ID 3 -> town/WestCoast.twn [dungeon gate] 3 -> worldmap/worldmap.lst ID 3 -> worldmap/SkyCastle.wdm [dungeon] 11 -> dungeon/dungeon.lst ID 11`。
- `DraconianTower.dgn` 可见 `[worldmap pattern info]`、`[minimum required level] 16`、`[basis level] 19`、`[pathgate object] 401-410`、普通 `[map specification]` 和 `[boss map specification]`。
- map ID `1602` 解析到 `map/DraconianTower/(1,0)n1826.map`，类型 `[normal]`；map ID `1619` 解析到 `map/DraconianTower/(0,2)gsdBoss.map`，类型 `[boss]`。两张地图均有 `[dungeon] 11` 反向归属。
- 代表地图中怪物 ID `50/51/70/71/72/61726` 均按 `monster/monster.lst` 解析；当前样本读取了 `50`、`51`、`71` 的 `.mob` 本体，用于确认 monster 层继续连接 motion 和 attack info。
- 代表地图对象 ID `1044/240/238/801/1045/235/1035/401` 均按 `passiveobject/passiveobject.lst` 解析；当前样本读取了 `1044`、`240`、`238`、`401` 的 `.obj` 本体，用于确认地图对象、破坏物、箱子和路径门的静态资源入口。
- `DraconianTower.dgn` 本体未观察到 `[required item]`；门票字段只用 dungeon ID `33` 的 `KingsRuins.dgn [required item] 3340 1 1` 作侧样本，`3340` 按 `stackable/stackable.lst` 解析为 `stackable/material/gold_coin.stk`。
- 清算/翻牌只读到全局 `etc/itemdropinfo_clearreward.etc` 的静态块：`[drop prob]`、`[gold card cost table]`、`[gold card blank item]`、`[pcroom card blank item]`、`[item drop ref table]` 等；其中 `7279/7454/7455` 按 stackable registry 可解析。
- UI/资源/音频只证明 PVF 引用存在：`SkyCastle.wdm [ui path]` 指向 `WorldMap/UI/SkyCastle.ui`，UI 控件引用 `.img/.act`，地图引用 `.til/.ani` 和声音 token `M_DRACONIAN_TOWER`、`M_DRACONIAN_TOWER_BOSS`、`R_AMB_WIND`。

## 默认复核动作

1. 先确认问题是否是“副本完整链路”问题，而不是单独的 Monster、Drop、UI、Audio 或 Client Assets 问题。
2. 数字 ID 必须先看父块，再选 registry：region、town、worldmap、dungeon、map、monster、passiveobject、stackable 各自独立。
3. 如果目标副本没有 `[required item]`，不要硬补门票；改写为“该副本未观察到门票块”，再用已封存门票侧样本说明字段读法。
4. 如果需要证明能进图、扣票、刷怪、AI、机关、掉落、翻牌、音乐或 UI 正常，转实机/客户端验证；静态 Workbench 到此停止。

## 辅助对照提示

辅助对照中同一代表 ID 大多可解析到同类路径，但整体规模更大：region、town、worldmap、dungeon、map、monster、passiveobject、stackable、independentdrop registry 均大于主目标。辅助同路径文件还可见差异：`SkyCastle.wdm` 有 hell/freepass/item condition 线索且不含 dungeon `504`；`DraconianTower.dgn` 有 `[special passive object item]`、seal door 和更高的 experience increasing point；`1602` map 多出 `../common/mapcover.ani`；`SkyCastle.ui` switchbox 列值不同。这些只提示版本差异，不覆盖主目标事实。

## 不可静态证明

- 不证明角色能到达城镇入口、worldmap 按钮可点或服务端放行。
- 不证明门票扣除、金币扣除、物品条件、等级条件或任务条件生效。
- 不证明怪物刷出、AI 正常、Boss 判定、路径门开关、机关触发或箱子可破坏。
- 不证明掉落概率、翻牌 UI、奖励发放、PC 房/黑钻状态、premium card 或结算一致。
- 不证明 `.img/.ani/.act/.til/.ptl/.ui`、SoundPacks、Music 或 NPK/ImagePacks2 资源完整。
