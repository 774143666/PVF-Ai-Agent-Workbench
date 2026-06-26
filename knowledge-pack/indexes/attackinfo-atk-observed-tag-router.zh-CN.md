# AttackInfo .atk 标签覆盖路由

状态：需验证

本文件覆盖目标 PVF 中 monster 与 monster 创建的 passiveobject 链所观察到的 `.atk` 字段、闭合标签和反引号 token。覆盖表示结构已观察并有路由，不表示运行效果已验证。

## 覆盖统计

- 字段标签：122 / 122。
- 闭合标签：3 / 3。
- 反引号 token：28 / 28。
- 未覆盖字段标签：0。
- 未覆盖闭合标签：0。
- 未覆盖反引号 token：0。

## 路由边界

- 先读 `.atk` 原文，再回查 `.mob/.obj/.act` 入边。
- 元素、攻击类型、伤害、异常状态和受击反应不能直接解释为最终公式或实战结果。
- 历史拼写和大小写变体按原样保留，不擅自纠正。
- 缺失 `.atk` 引用按断链处理；同名文件位于其他目录不等于当前路径已闭合。

## 全量字段标签

`[absolute damage]`, `[active status]`, `[ACTIVE STATUS]`, `[active status apply weapon]`, `[all]`, `[all damage rate]`, `[armor break]`, `[attack direction]`, `[attack enemy]`, `[attack friend]`。

`[attack myself]`, `[attack type]`, `[auto]`, `[back]`, `[bleeding]`, `[blind]`, `[blood]`, `[blood blow]`, `[blood cut]`, `[blow]`。

`[bounce]`, `[burn]`, `[confuse]`, `[critical hit]`, `[curse]`, `[custom damage]`, `[cut]`, `[damage]`, `[damage bonus]`, `[damage bouns]`。

`[damage reaction]`, `[damege]`, `[damgae]`, `[damge]`, `[dark]`, `[dark element]`, `[dowb]`, `[down]`, `[Down]`, `[elemental property]`。

`[elemental property multi]`, `[etc]`, `[fire]`, `[fire element]`, `[Fire element]`, `[force elemental property]`, `[force hit stun time]`, `[freeze]`, `[front]`, `[hit]`。

`[hit check by screen pos]`, `[hit direction]`, `[hit down]`, `[hit horizon]`, `[hit horizono]`, `[hit horizontal]`, `[hit horizoon]`, `[hit info]`, `[hit lift up]`, `[hit stun time only damager]`。

`[hit vertical]`, `[hit wav]`, `[hold]`, `[horizontal]`, `[HP drain]`, `[human active status rate]`, `[human damage rate]`, `[ice element]`, `[ignore defense]`, `[ignore diehard]`。

`[ignore super armor]`, `[ignore weight]`, `[incore blow]`, `[inner]`, `[inner custom]`, `[is hit number increasing]`, `[is hit number increasings]`, `[is only hit character]`, `[knock]`, `[knuck back]`。

`[lift up]`, `[light element]`, `[lightning]`, `[lihgt element]`, `[magic]`, `[magical]`, `[mana burn]`, `[masic]`, `[max target hit number]`, `[monster damage rate]`。

`[MP drain]`, `[no blood]`, `[no element]`, `[no elemental]`, `[noblood]`, `[none]`, `[NONE]`, `[none element]`, `[outer]`, `[ozma sanity]`。

`[physic]`, `[physical]`, `[poison]`, `[posion]`, `[push aside]`, `[pvp]`, `[set hp percent damage]`, `[slash]`, `[sleep]`, `[slow]`。

`[stone]`, `[stuck]`, `[stuck prob increase]`, `[stun]`, `[superarmor knuck back]`, `[team]`, `[water element]`, `[weakness]`, `[weakness type]`, `[weapon break]`。

`[weapon damage apply]`, `[wind cut]`。

## 全量闭合标签

`[/elemental property multi]`, `[/pvp]`, `[/set hp percent damage]`。

## 全量反引号 token

`[bleeding]`, `[blood]`, `[blow]`, `[burn]`, `[confuse]`, `[cut]`, `[damage]`, `[dark element]`, `[down]`, `[etc]`。

`[hit down]`, `[hit down up]`, `[hit horizon]`, `[hit lift up]`, `[hit litf up]`, `[ignore defense]`, `[light element]`, `[lightning]`, `[magic]`, `[no blood]`。

`[no element]`, `[noblood]`, `[none]`, `[physic]`, `[slow]`, `[stun]`, `[water element]`, `[weakness]`。

## 字段统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[absolute damage]` | 4 | 1654 | 1641 |
| `[active status]` | 4 | 3009 | 2897 |
| `[ACTIVE STATUS]` | 1 | 2 | 2 |
| `[active status apply weapon]` | 1 | 3 | 3 |
| `[all]` | 1 | 10 | 10 |
| `[all damage rate]` | 2 | 4 | 4 |
| `[armor break]` | 4 | 36 | 36 |
| `[attack direction]` | 4 | 10969 | 10929 |
| `[attack enemy]` | 4 | 9981 | 9958 |
| `[attack friend]` | 4 | 294 | 294 |
| `[attack myself]` | 4 | 73 | 73 |
| `[attack type]` | 4 | 12441 | 12436 |
| `[auto]` | 2 | 61 | 61 |
| `[back]` | 2 | 10 | 10 |
| `[bleeding]` | 4 | 664 | 664 |
| `[blind]` | 4 | 89 | 89 |
| `[blood]` | 4 | 4748 | 4747 |
| `[blood blow]` | 1 | 2 | 2 |
| `[blood cut]` | 1 | 2 | 2 |
| `[blow]` | 4 | 9047 | 9039 |
| `[bounce]` | 4 | 694 | 694 |
| `[burn]` | 4 | 455 | 430 |
| `[confuse]` | 4 | 94 | 94 |
| `[critical hit]` | 3 | 42 | 42 |
| `[curse]` | 4 | 95 | 95 |
| `[custom damage]` | 1 | 4 | 4 |
| `[cut]` | 4 | 2542 | 2542 |
| `[damage]` | 4 | 9767 | 8297 |
| `[damage bonus]` | 4 | 8559 | 8545 |
| `[damage bouns]` | 1 | 1 | 1 |
| `[damage reaction]` | 4 | 12575 | 12528 |
| `[damege]` | 1 | 1 | 1 |
| `[damgae]` | 1 | 1 | 1 |
| `[damge]` | 1 | 2 | 2 |
| `[dark]` | 1 | 7 | 7 |
| `[dark element]` | 4 | 781 | 781 |
| `[dowb]` | 1 | 1 | 1 |
| `[down]` | 4 | 4591 | 4562 |
| `[Down]` | 2 | 5 | 5 |
| `[elemental property]` | 4 | 12335 | 12304 |
| `[elemental property multi]` | 1 | 2 | 2 |
| `[etc]` | 4 | 157 | 157 |
| `[fire]` | 1 | 4 | 4 |
| `[fire element]` | 4 | 1027 | 1027 |
| `[Fire element]` | 3 | 30 | 30 |
| `[force elemental property]` | 1 | 1 | 1 |
| `[force hit stun time]` | 3 | 99 | 99 |
| `[freeze]` | 4 | 244 | 242 |
| `[front]` | 4 | 254 | 254 |
| `[hit]` | 1 | 5 | 5 |
| `[hit check by screen pos]` | 2 | 4 | 4 |
| `[hit direction]` | 4 | 407 | 407 |
| `[hit down]` | 4 | 3727 | 3727 |
| `[hit horizon]` | 4 | 3890 | 3889 |
| `[hit horizono]` | 2 | 9 | 9 |
| `[hit horizontal]` | 4 | 263 | 263 |
| `[hit horizoon]` | 2 | 3 | 3 |
| `[hit info]` | 4 | 12092 | 12084 |
| `[hit lift up]` | 4 | 1710 | 1710 |
| `[hit stun time only damager]` | 1 | 12 | 12 |
| `[hit vertical]` | 2 | 3 | 3 |
| `[hit wav]` | 4 | 11028 | 10897 |
| `[hold]` | 4 | 59 | 59 |
| `[horizontal]` | 2 | 8 | 8 |
| `[HP drain]` | 2 | 39 | 39 |
| `[human active status rate]` | 4 | 13 | 13 |
| `[human damage rate]` | 4 | 18 | 18 |
| `[ice element]` | 2 | 5 | 5 |
| `[ignore defense]` | 4 | 59 | 59 |
| `[ignore diehard]` | 4 | 4 | 4 |
| `[ignore super armor]` | 3 | 156 | 154 |
| `[ignore weight]` | 4 | 75 | 75 |
| `[incore blow]` | 1 | 1 | 1 |
| `[inner]` | 2 | 16 | 16 |
| `[inner custom]` | 2 | 3 | 3 |
| `[is hit number increasing]` | 4 | 128 | 128 |
| `[is hit number increasings]` | 1 | 1 | 1 |
| `[is only hit character]` | 1 | 1 | 1 |
| `[knock]` | 2 | 20 | 20 |
| `[knuck back]` | 4 | 4178 | 4177 |
| `[lift up]` | 4 | 10845 | 10838 |
| `[light element]` | 4 | 731 | 731 |
| `[lightning]` | 4 | 246 | 246 |
| `[lihgt element]` | 1 | 1 | 1 |
| `[magic]` | 4 | 2184 | 2181 |
| `[magical]` | 1 | 1 | 1 |
| `[mana burn]` | 4 | 10 | 10 |
| `[masic]` | 1 | 2 | 2 |
| `[max target hit number]` | 4 | 71 | 71 |
| `[monster damage rate]` | 4 | 202 | 202 |
| `[MP drain]` | 2 | 5 | 5 |
| `[no blood]` | 4 | 7094 | 7089 |
| `[no element]` | 4 | 8984 | 8982 |
| `[no elemental]` | 4 | 143 | 143 |
| `[noblood]` | 4 | 153 | 153 |
| `[none]` | 4 | 875 | 875 |
| `[NONE]` | 1 | 1 | 1 |
| `[none element]` | 2 | 38 | 38 |
| `[outer]` | 2 | 58 | 58 |
| `[ozma sanity]` | 1 | 4 | 4 |
| `[physic]` | 4 | 10108 | 10108 |
| `[physical]` | 2 | 22 | 22 |
| `[poison]` | 4 | 185 | 185 |
| `[posion]` | 1 | 1 | 1 |
| `[push aside]` | 4 | 11016 | 11013 |
| `[pvp]` | 3 | 14 | 14 |
| `[set hp percent damage]` | 1 | 10 | 10 |
| `[slash]` | 2 | 8 | 8 |
| `[sleep]` | 4 | 36 | 36 |
| `[slow]` | 4 | 78 | 78 |
| `[stone]` | 4 | 31 | 31 |
| `[stuck]` | 4 | 2082 | 2064 |
| `[stuck prob increase]` | 2 | 12 | 12 |
| `[stun]` | 4 | 761 | 759 |
| `[superarmor knuck back]` | 2 | 6 | 6 |
| `[team]` | 1 | 5 | 5 |
| `[water element]` | 4 | 532 | 532 |
| `[weakness]` | 4 | 64 | 64 |
| `[weakness type]` | 1 | 1 | 1 |
| `[weapon break]` | 2 | 4 | 4 |
| `[weapon damage apply]` | 4 | 11529 | 11518 |
| `[wind cut]` | 2 | 2 | 2 |

## 闭合标签统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[/elemental property multi]` | 1 | 2 | 2 |
| `[/pvp]` | 3 | 14 | 14 |
| `[/set hp percent damage]` | 1 | 10 | 10 |

## Token 统计表

| Token | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[bleeding]` | 2 | 3 | 3 |
| `[blood]` | 2 | 8 | 8 |
| `[blow]` | 3 | 56 | 56 |
| `[burn]` | 2 | 3 | 3 |
| `[confuse]` | 1 | 1 | 1 |
| `[cut]` | 2 | 6 | 6 |
| `[damage]` | 3 | 53 | 53 |
| `[dark element]` | 1 | 6 | 6 |
| `[down]` | 3 | 40 | 40 |
| `[etc]` | 1 | 2 | 2 |
| `[hit down]` | 3 | 77 | 77 |
| `[hit down up]` | 1 | 1 | 1 |
| `[hit horizon]` | 3 | 365 | 365 |
| `[hit lift up]` | 3 | 873 | 873 |
| `[hit litf up]` | 1 | 1 | 1 |
| `[ignore defense]` | 2 | 6 | 6 |
| `[light element]` | 1 | 1 | 1 |
| `[lightning]` | 2 | 16 | 16 |
| `[magic]` | 1 | 8 | 8 |
| `[no blood]` | 3 | 50 | 50 |
| `[no element]` | 2 | 52 | 52 |
| `[noblood]` | 2 | 6 | 6 |
| `[none]` | 2 | 3 | 3 |
| `[physic]` | 2 | 52 | 52 |
| `[slow]` | 1 | 2 | 2 |
| `[stun]` | 2 | 2 | 2 |
| `[water element]` | 2 | 2 | 2 |
| `[weakness]` | 2 | 2 | 2 |
