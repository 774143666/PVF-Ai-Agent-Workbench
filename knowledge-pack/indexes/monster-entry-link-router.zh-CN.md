# Monster 入口与关系路由

状态：需验证

本文件记录两份只读目标 PVF 中 monster registry、未注册 `.mob` 入边、`[SUMMON MONSTER]`、map/dungeon 出生和掉落的纯结构结论。它不证明运行条件、概率、AI 行为、掉率或客户端表现。

## Registry 与未注册 .mob

- 数字 monster ID 必须通过 `monster/monster.lst` 解析。
- 未被主 registry 注册的 `.mob` 不能直接当 monster ID 使用。
- 全部可反编译脚本文本扫描后，两份目标均观察到 6 个未注册 `.mob` 由次级 registry 直接引用：

- `monster/flydragon/looseseri.mob`
- `monster/flydragon/serimalion.mob`
- `monster/golem/bronzegolem.mob`
- `monster/golem/claygolem.mob`
- `monster/golem/platany.mob`
- `monster/golem/stoneblade_razor.mob`

- 其他未注册 `.mob` 没有观察到直接路径入边；这只限于静态可反编译脚本文本范围，不能声明运行时绝对无用。

| 指标 | 目标 A | 目标 B |
| --- | ---: | ---: |
| 主 registry 条目 | 1945 | 3371 |
| `.mob` 文件 | 2090 | 3668 |
| 未注册 `.mob` | 145 | 299 |
| 扫描的可反编译脚本文本 | 165910 | 301337 |
| 有直接路径入边的未注册 `.mob` | 6 | 6 |
| 无观察到直接路径入边的未注册 `.mob` | 139 | 293 |

## SUMMON MONSTER

- 行为块中的 monster ID 必须通过 `monster/monster.lst` 解析。
- 两份目标实际观察到直接 `[INDEX]` 与 `[INDEX] -> [RANDOM SELECT]` 两种关系列形。
- 历史闭合拼写 `[/SUMMON MONSETER]` 按 `[/SUMMON MONSTER]` 的结构边界识别，但原文不修改。
- `[TRIGGER] -> [WHICH] -> [SUMMON MONSTER]` 是对象选择器用法，不包含召唤 monster ID，不能按召唤行为块解析。

| 目标集 | 解析模式 | 关系数 |
| --- | --- | ---: |
| 目标 A | `direct` | 809 |
| 目标 A | `random-select` | 49 |
| 目标 B | `direct` | 1729 |
| 目标 B | `random-select` | 110 |

| 指标 | 目标 A | 目标 B |
| --- | ---: | ---: |
| 行为块 | 823 | 1764 |
| 召唤关系 | 858 | 1839 |
| 唯一 monster ID | 420 | 887 |
| registry 未命中 ID | 22 | 129 |
| registry 命中但 `.mob` 缺失 | 0 | 0 |
| `[WHICH]` 选择器用法 | 0 | 1 |
| 历史闭合拼写 | 2 | 3 |
| 解析异常 | 0 | 0 |

## Map / Dungeon 出生

- `[monster]` 块的完整出生记录按 8 个以上数值识别，首个数值按 monster ID 解析。
- `[NPC]`、`[champion]` 等标记后的短数字行是附属列形，不作为独立出生记录。
- registry 未命中 ID 只记录为静态未解析。

| 指标 | 目标 A | 目标 B |
| --- | ---: | ---: |
| map 文件 | 3147 | 4673 |
| dungeon 文件 | 336 | 496 |
| 完整出生记录 | 20689 | 28580 |
| 唯一 monster ID | 1243 | 1903 |
| registry 未命中 ID | 122 | 24 |
| registry 命中但 `.mob` 缺失 | 0 | 0 |
| 短数字附属行 | 12 | 12 |

### Monster 相关 map/dungeon 字段

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[attacked monster info]` | 2 | 21 | 21 |
| `[blood monster]` | 2 | 18 | 18 |
| `[common monster exp const]` | 2 | 10 | 10 |
| `[common monster item drop list]` | 2 | 10 | 10 |
| `[common monster item drop prob]` | 2 | 10 | 10 |
| `[conditional summon monster]` | 1 | 11 | 11 |
| `[event monster]` | 2 | 232 | 232 |
| `[event monster position]` | 2 | 5800 | 5800 |
| `[event monster3]` | 1 | 1 | 1 |
| `[max monster]` | 2 | 10 | 10 |
| `[monster]` | 2 | 6901 | 6856 |
| `[monster collision group]` | 2 | 3 | 3 |
| `[monster condition]` | 2 | 65 | 65 |
| `[monster difficulty bonus]` | 2 | 97 | 89 |
| `[monster exp bonus per user decrease]` | 2 | 10 | 10 |
| `[monster lock]` | 1 | 1 | 1 |
| `[MONSTER SAFE ZONE]` | 2 | 2 | 2 |
| `[monster spawn base interval]` | 2 | 10 | 10 |
| `[monster spawn pos]` | 2 | 44 | 44 |
| `[monster spawn random interval]` | 2 | 10 | 10 |
| `[monster specific AI]` | 2 | 6221 | 6221 |
| `[monster team]` | 2 | 168 | 168 |
| `[monster type spawn cost]` | 2 | 10 | 10 |
| `[monster type spawn interval rate]` | 2 | 10 | 10 |
| `[monster type spawn prob]` | 2 | 10 | 10 |
| `[monsterapc diff table]` | 2 | 60 | 60 |
| `[named monster map pos]` | 2 | 4 | 4 |
| `[show dust monster]` | 1 | 1 | 1 |
| `[spawn common monster index]` | 2 | 10 | 10 |
| `[tournament monster]` | 2 | 4 | 4 |
| `[ultimate monster]` | 2 | 2 | 2 |

### Monster 相关 map/dungeon 闭合标签

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[/attacked monster info]` | 2 | 21 | 21 |
| `[/blood monster]` | 2 | 18 | 18 |
| `[/common monster item drop list]` | 2 | 10 | 10 |
| `[/conditional summon monster]` | 1 | 11 | 11 |
| `[/event monster]` | 2 | 232 | 232 |
| `[/event monster position]` | 2 | 5800 | 5800 |
| `[/event monster2]` | 1 | 1 | 1 |
| `[/event monster3]` | 1 | 1 | 1 |
| `[/monster]` | 2 | 6848 | 6848 |
| `[/monster collision group]` | 2 | 3 | 3 |
| `[/monster condition]` | 2 | 65 | 65 |
| `[/monster difficulty bonus]` | 2 | 97 | 89 |
| `[/MONSTER SAFE ZONE]` | 2 | 2 | 2 |
| `[/monster specific AI]` | 2 | 6221 | 6221 |
| `[/monster team]` | 2 | 168 | 168 |
| `[/monster type spawn prob]` | 2 | 10 | 10 |
| `[/named monster map pos]` | 2 | 4 | 4 |
| `[/spawn common monster index]` | 2 | 10 | 10 |
| `[/tournament monster]` | 2 | 4 | 4 |
| `[/ultimate monster]` | 2 | 2 | 2 |

## .mob 掉落

- 观察到的掉落块必须逐行读取，首个数值按物品 ID 解析。
- 物品 ID 按 equipment / stackable 正确 registry 解析，不按数字形状猜类型。
- registry 未命中只记录为未解析，不补 ID。

| 目标集 | 掉落块 | 记录数 |
| --- | --- | ---: |
| 目标 A | `[death tower item]` | 17 |
| 目标 A | `[super champion drop item]` | 6 |
| 目标 A | `[item]` | 3 |
| 目标 A | `[catch item]` | 1 |
| 目标 B | `[item]` | 816 |
| 目标 B | `[death tower item]` | 17 |
| 目标 B | `[super champion drop item]` | 12 |
| 目标 B | `[catch item]` | 2 |
| 目标 B | `[common champion drop item]` | 1 |

| 指标 | 目标 A | 目标 B |
| --- | ---: | ---: |
| 掉落记录 | 27 | 848 |
| 唯一物品 ID | 9 | 62 |
| equipment 命中 | 0 | 1 |
| stackable 命中 | 27 | 846 |
| 未解析 | 0 | 1 |

未解析 ID `10002121` 只在一个 `[catch item]` 块观察到；已知 registry 无匹配。它是目标数据边界，不是可猜测物品。

## 全局 Monster 掉落配置字段

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[basis of rarity dicision]` | 2 | 6 | 6 |
| `[condition rate]` | 2 | 2 | 2 |
| `[drop prob]` | 2 | 4 | 4 |
| `[drop prob count]` | 2 | 6 | 6 |
| `[dungeon difficulty drop bonusrate]` | 2 | 4 | 4 |
| `[dungeon difficulty drop prob]` | 2 | 2 | 2 |
| `[first boss/named mob hunting]` | 2 | 2 | 2 |
| `[gold quantity]` | 2 | 2 | 2 |
| `[gold volume]` | 2 | 2 | 2 |
| `[item drop ref table]` | 2 | 6 | 6 |
| `[monster type drop bonusrate]` | 2 | 4 | 4 |
| `[party member drop bonusrate]` | 2 | 4 | 4 |

## 覆盖

- AI 引用、召唤行为、召唤选择器、未注册 `.mob` 直接入边、map/dungeon 出生、`.mob` 掉落和全局掉落配置均有独立路由。
- 召唤解析异常：0。
- 掉落结构异常：0。
- 新增主线读取错误：0。
