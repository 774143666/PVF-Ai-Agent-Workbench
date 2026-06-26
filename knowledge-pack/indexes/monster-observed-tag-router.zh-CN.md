# Monster .mob 观察标签路由

本索引记录只读目标 PVF 的 monster `.mob` 中实际观察到的字段标签与闭合标签。它用于确认标签是否存在、属于哪类核查入口以及是否需要继续闭合引用；不解释数值效果、AI 行为、伤害、掉率或客户端表现。

## 使用边界

- 数字 monster ID 必须通过 `monster/monster.lst` 解析。
- 标签出现只证明目标文件结构中存在该入口。
- 攻击、动作、AI、passiveobject、掉落和 map/dungeon 出生链必须分别继续闭合。
- 所有运行效果均不在本索引的证明范围。

## 字段标签

| 标签 | 路由类别 | 目标数 | 出现次数 | 文件计数 |
| --- | --- | ---: | ---: | ---: |
| `[ability category]` | 能力、数值或抗性入口 | 2 | 5772 | 5758 |
| `[ability table]` | 能力、数值或抗性入口 | 2 | 1978 | 1964 |
| `[accept damage]` | 攻击、动作或表现入口 | 1 | 7 | 4 |
| `[accept hit]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[action]` | 攻击、动作或表现入口 | 1 | 74 | 55 |
| `[action condition]` | 攻击、动作或表现入口 | 1 | 4 | 4 |
| `[action delay]` | 攻击、动作或表现入口 | 1 | 15 | 15 |
| `[action list]` | 攻击、动作或表现入口 | 2 | 468 | 468 |
| `[active status]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[active status defence]` | 其他目标可观察入口 | 1 | 133 | 69 |
| `[add gravity in aerial]` | 其他目标可观察入口 | 2 | 253 | 253 |
| `[ai pattern]` | AI、目标或状态入口 | 2 | 4187 | 4173 |
| `[all]` | 其他目标可观察入口 | 1 | 143 | 60 |
| `[alpha max]` | 其他目标可观察入口 | 1 | 27 | 27 |
| `[ambient sound]` | 攻击、动作或表现入口 | 2 | 2893 | 2861 |
| `[angry cooltime]` | 攻击、动作或表现入口 | 1 | 15 | 15 |
| `[appear sound]` | 攻击、动作或表现入口 | 2 | 3060 | 3041 |
| `[apply absolute time]` | 其他目标可观察入口 | 1 | 26 | 26 |
| `[apply hitstun shaking power rate]` | 攻击、动作或表现入口 | 1 | 27 | 27 |
| `[apply sub layer shadow]` | 身份、资源或显示入口 | 1 | 1 | 1 |
| `[apply time rate]` | 能力、数值或抗性入口 | 1 | 1 | 1 |
| `[armor break resistance]` | 能力、数值或抗性入口 | 2 | 96 | 96 |
| `[atk super on scr]` | 其他目标可观察入口 | 2 | 251 | 158 |
| `[attack action]` | 攻击、动作或表现入口 | 2 | 3630 | 3615 |
| `[attack delay]` | 攻击、动作或表现入口 | 2 | 1636 | 1634 |
| `[attack down prob]` | 攻击、动作或表现入口 | 2 | 54 | 54 |
| `[attack info]` | 攻击、动作或表现入口 | 2 | 5590 | 5568 |
| `[attack kind]` | 攻击、动作或表现入口 | 2 | 1511 | 1511 |
| `[attack motion]` | 攻击、动作或表现入口 | 2 | 1541 | 1541 |
| `[attack sound]` | 攻击、动作或表现入口 | 2 | 2710 | 2682 |
| `[attack speed]` | 攻击、动作或表现入口 | 2 | 5743 | 5718 |
| `[back vision]` | AI、目标或状态入口 | 2 | 20 | 20 |
| `[base table]` | 其他目标可观察入口 | 2 | 95 | 95 |
| `[basic action]` | 攻击、动作或表现入口 | 2 | 14 | 14 |
| `[bleeding]` | 其他目标可观察入口 | 1 | 3 | 3 |
| `[bleeding resistance]` | 能力、数值或抗性入口 | 2 | 1934 | 1927 |
| `[blind resistance]` | 能力、数值或抗性入口 | 2 | 2283 | 2276 |
| `[body only]` | 其他目标可观察入口 | 1 | 27 | 27 |
| `[boss aura effect hide]` | 身份、资源或显示入口 | 1 | 58 | 58 |
| `[burn]` | 其他目标可观察入口 | 1 | 2 | 2 |
| `[burn resistance]` | 能力、数值或抗性入口 | 2 | 1691 | 1687 |
| `[can beat index]` | 其他目标可观察入口 | 2 | 4 | 4 |
| `[cast speed]` | 能力、数值或抗性入口 | 2 | 4813 | 4789 |
| `[catch item]` | 难度、精英或掉落入口 | 2 | 9 | 9 |
| `[category]` | 其他目标可观察入口 | 2 | 5874 | 5655 |
| `[champion multi factor]` | 难度、精英或掉落入口 | 1 | 8 | 4 |
| `[change action]` | 攻击、动作或表现入口 | 1 | 15 | 2 |
| `[change action by condition]` | 攻击、动作或表现入口 | 1 | 2 | 2 |
| `[change direction by target]` | AI、目标或状态入口 | 2 | 168 | 168 |
| `[CHARACTER]` | 其他目标可观察入口 | 2 | 2 | 2 |
| `[character down]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[character job type]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[character kill]` | 其他目标可观察入口 | 1 | 4 | 4 |
| `[come in action]` | 攻击、动作或表现入口 | 2 | 174 | 171 |
| `[come in action ex]` | 攻击、动作或表现入口 | 2 | 6 | 6 |
| `[come in motion]` | 攻击、动作或表现入口 | 2 | 4 | 4 |
| `[common champion drop item]` | 难度、精英或掉落入口 | 2 | 2263 | 2263 |
| `[common champion elemental property]` | 难度、精英或掉落入口 | 2 | 929 | 924 |
| `[condition]` | AI、目标或状态入口 | 1 | 60 | 55 |
| `[conditional amplify damage]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[confuse resistance]` | 能力、数值或抗性入口 | 2 | 2269 | 2262 |
| `[consume mp]` | 能力、数值或抗性入口 | 2 | 2 | 2 |
| `[control passive object]` | AI、目标或状态入口 | 2 | 16 | 16 |
| `[cooltime]` | 攻击、动作或表现入口 | 2 | 4176 | 4159 |
| `[counter attack]` | 攻击、动作或表现入口 | 2 | 32 | 32 |
| `[crazymode keep]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[cube]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[curse resistance]` | 能力、数值或抗性入口 | 2 | 2443 | 2435 |
| `[DAMAGE]` | 攻击、动作或表现入口 | 1 | 10 | 2 |
| `[damage action 1]` | 攻击、动作或表现入口 | 2 | 3435 | 3422 |
| `[damage action 2]` | 攻击、动作或表现入口 | 2 | 3357 | 3347 |
| `[damage motion 1]` | 攻击、动作或表现入口 | 2 | 1726 | 1726 |
| `[damage motion 2]` | 攻击、动作或表现入口 | 2 | 1683 | 1683 |
| `[damage rate]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[damage sound]` | 攻击、动作或表现入口 | 2 | 4023 | 3953 |
| `[damage time balance]` | 攻击、动作或表现入口 | 2 | 30 | 30 |
| `[damagebox to height]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[dark resistance]` | 能力、数值或抗性入口 | 2 | 2302 | 2291 |
| `[darkness hide]` | 其他目标可观察入口 | 1 | 11 | 11 |
| `[dash]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[dash action]` | 攻击、动作或表现入口 | 2 | 37 | 36 |
| `[dash attack]` | 攻击、动作或表现入口 | 2 | 49 | 33 |
| `[dashattack action]` | 攻击、动作或表现入口 | 2 | 18 | 18 |
| `[death tower item]` | 难度、精英或掉落入口 | 2 | 75 | 75 |
| `[decrease time]` | 其他目标可观察入口 | 1 | 59 | 59 |
| `[destination change term]` | 其他目标可观察入口 | 2 | 3835 | 3806 |
| `[destroy count]` | 其他目标可观察入口 | 2 | 19 | 19 |
| `[destroy count damage]` | 攻击、动作或表现入口 | 2 | 21 | 21 |
| `[detail]` | AI、目标或状态入口 | 2 | 198 | 52 |
| `[die cinematic]` | 其他目标可观察入口 | 1 | 4 | 4 |
| `[die effect]` | 身份、资源或显示入口 | 2 | 4509 | 4497 |
| `[die sound]` | 攻击、动作或表现入口 | 2 | 3968 | 3904 |
| `[diving sight]` | AI、目标或状态入口 | 2 | 10 | 10 |
| `[down action]` | 攻击、动作或表现入口 | 2 | 2604 | 2594 |
| `[down motion]` | 攻击、动作或表现入口 | 2 | 1449 | 1449 |
| `[draw hit object hp]` | 攻击、动作或表现入口 | 1 | 9 | 9 |
| `[drop item offset]` | 难度、精英或掉落入口 | 2 | 30 | 30 |
| `[dungeon mode script]` | 其他目标可观察入口 | 1 | 14 | 14 |
| `[easy]` | 难度、精英或掉落入口 | 2 | 3089 | 2728 |
| `[effective state]` | AI、目标或状态入口 | 1 | 27 | 27 |
| `[emergency state recovery]` | AI、目标或状态入口 | 1 | 55 | 53 |
| `[enable]` | 其他目标可观察入口 | 1 | 27 | 27 |
| `[enable state]` | AI、目标或状态入口 | 1 | 15 | 15 |
| `[enable states]` | AI、目标或状态入口 | 1 | 2 | 2 |
| `[equipment]` | 其他目标可观察入口 | 2 | 116 | 112 |
| `[etc action]` | 攻击、动作或表现入口 | 2 | 464 | 464 |
| `[etc attack info]` | 攻击、动作或表现入口 | 2 | 579 | 578 |
| `[etc motion]` | 攻击、动作或表现入口 | 2 | 1352 | 1352 |
| `[etc sound]` | 攻击、动作或表现入口 | 2 | 84 | 84 |
| `[event super on scr]` | 其他目标可观察入口 | 2 | 416 | 282 |
| `[expert]` | 其他目标可观察入口 | 2 | 1463 | 1357 |
| `[explain]` | AI、目标或状态入口 | 2 | 2 | 2 |
| `[face image]` | 身份、资源或显示入口 | 2 | 5732 | 5695 |
| `[fastattack]` | 攻击、动作或表现入口 | 1 | 4 | 4 |
| `[fastmove]` | 其他目标可观察入口 | 1 | 4 | 4 |
| `[fire resistance]` | 能力、数值或抗性入口 | 2 | 2539 | 2524 |
| `[fix direction]` | AI、目标或状态入口 | 2 | 231 | 212 |
| `[fixed height]` | 身份、资源或显示入口 | 2 | 9 | 9 |
| `[floating height]` | 身份、资源或显示入口 | 2 | 2207 | 2207 |
| `[flying mark]` | 其他目标可观察入口 | 2 | 34 | 34 |
| `[follow move map]` | 其他目标可观察入口 | 1 | 12 | 12 |
| `[force draw]` | 其他目标可观察入口 | 1 | 3 | 3 |
| `[forced knockback]` | 其他目标可观察入口 | 2 | 70 | 70 |
| `[freeze]` | 其他目标可观察入口 | 1 | 93 | 53 |
| `[freeze resistance]` | 能力、数值或抗性入口 | 2 | 2685 | 2663 |
| `[frequency rate]` | 能力、数值或抗性入口 | 1 | 27 | 27 |
| `[getup invincible]` | 其他目标可观察入口 | 1 | 4 | 4 |
| `[groop monster]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[hard]` | 难度、精英或掉落入口 | 2 | 3067 | 2710 |
| `[height]` | 身份、资源或显示入口 | 2 | 16 | 16 |
| `[hell monster]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[hero]` | 难度、精英或掉落入口 | 2 | 3082 | 2725 |
| `[hide hp gauge]` | 能力、数值或抗性入口 | 1 | 4 | 4 |
| `[hit recovery]` | 攻击、动作或表现入口 | 2 | 5712 | 5694 |
| `[hitstun resistance]` | 攻击、动作或表现入口 | 1 | 58 | 58 |
| `[hitstun resistance system]` | 攻击、动作或表现入口 | 1 | 59 | 59 |
| `[hold]` | 其他目标可观察入口 | 1 | 100 | 53 |
| `[hold action]` | 攻击、动作或表现入口 | 1 | 2 | 2 |
| `[hold attack]` | 攻击、动作或表现入口 | 2 | 57 | 57 |
| `[hold immune system]` | 其他目标可观察入口 | 1 | 11 | 11 |
| `[hold resistance]` | 能力、数值或抗性入口 | 2 | 2270 | 2254 |
| `[holdable off]` | 其他目标可观察入口 | 1 | 3 | 3 |
| `[hp destroy]` | 能力、数值或抗性入口 | 1 | 4 | 4 |
| `[HP is lower than]` | 能力、数值或抗性入口 | 1 | 5 | 2 |
| `[HP MAX]` | 能力、数值或抗性入口 | 2 | 2 | 2 |
| `[hp regen rate]` | 能力、数值或抗性入口 | 2 | 621 | 615 |
| `[HP regen speed]` | 能力、数值或抗性入口 | 2 | 1587 | 1549 |
| `[ignore active status]` | 其他目标可观察入口 | 1 | 11 | 11 |
| `[ignore condition]` | AI、目标或状态入口 | 1 | 1 | 1 |
| `[image path]` | 身份、资源或显示入口 | 2 | 55 | 52 |
| `[immune active status]` | 其他目标可观察入口 | 1 | 6 | 6 |
| `[increase time]` | 其他目标可观察入口 | 1 | 59 | 59 |
| `[index]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[init cooltime]` | 攻击、动作或表现入口 | 1 | 16 | 15 |
| `[initial target]` | AI、目标或状态入口 | 2 | 71 | 71 |
| `[initial target Permanent]` | AI、目标或状态入口 | 2 | 48 | 48 |
| `[int data]` | 其他目标可观察入口 | 2 | 1362 | 1360 |
| `[intelligence]` | 其他目标可观察入口 | 2 | 2076 | 2051 |
| `[is direction to move]` | AI、目标或状态入口 | 2 | 151 | 151 |
| `[is grabable]` | 其他目标可观察入口 | 2 | 63 | 59 |
| `[is ignore appendage of character]` | 其他目标可观察入口 | 1 | 5 | 5 |
| `[is ignore appendage of monster]` | 其他目标可观察入口 | 1 | 3 | 3 |
| `[is named monster]` | 身份、资源或显示入口 | 2 | 108 | 101 |
| `[is on the object]` | 对象、召唤或骑乘入口 | 2 | 6 | 6 |
| `[item]` | 难度、精英或掉落入口 | 2 | 1283 | 1273 |
| `[jump action]` | 攻击、动作或表现入口 | 2 | 97 | 97 |
| `[jump attack]` | 攻击、动作或表现入口 | 2 | 34 | 24 |
| `[jump motion]` | 攻击、动作或表现入口 | 2 | 115 | 115 |
| `[jump power]` | 能力、数值或抗性入口 | 2 | 236 | 236 |
| `[jump speed]` | 能力、数值或抗性入口 | 2 | 190 | 190 |
| `[jumpattack action]` | 攻击、动作或表现入口 | 2 | 9 | 9 |
| `[jumpattack info]` | 攻击、动作或表现入口 | 2 | 46 | 46 |
| `[jumpattack motion]` | 攻击、动作或表现入口 | 2 | 43 | 43 |
| `[keep distance]` | AI、目标或状态入口 | 2 | 28 | 28 |
| `[keep distance with target]` | AI、目标或状态入口 | 2 | 3044 | 3003 |
| `[keep range distance with target]` | AI、目标或状态入口 | 2 | 1670 | 1659 |
| `[keep range distance with target 1]` | AI、目标或状态入口 | 2 | 8 | 8 |
| `[king]` | 难度、精英或掉落入口 | 2 | 1463 | 1357 |
| `[last action]` | 攻击、动作或表现入口 | 2 | 1296 | 1292 |
| `[last action condition]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[layer effect]` | 身份、资源或显示入口 | 1 | 27 | 27 |
| `[leave body]` | 其他目标可观察入口 | 1 | 8 | 7 |
| `[level]` | 能力、数值或抗性入口 | 2 | 5779 | 5754 |
| `[level of difficulty]` | 难度、精英或掉落入口 | 2 | 449 | 449 |
| `[lie frame]` | 其他目标可观察入口 | 2 | 3825 | 3795 |
| `[life max]` | 其他目标可观察入口 | 2 | 7 | 7 |
| `[light resistance]` | 能力、数值或抗性入口 | 2 | 2412 | 2400 |
| `[lightning resistance]` | 能力、数值或抗性入口 | 2 | 2019 | 2010 |
| `[limit slowdown atkspeed]` | 能力、数值或抗性入口 | 1 | 3 | 3 |
| `[magical]` | 能力、数值或抗性入口 | 1 | 138 | 70 |
| `[master]` | 难度、精英或掉落入口 | 2 | 1471 | 1365 |
| `[matching etc attack info]` | 攻击、动作或表现入口 | 1 | 20 | 20 |
| `[max]` | 其他目标可观察入口 | 1 | 27 | 27 |
| `[medium]` | 难度、精英或掉落入口 | 2 | 3067 | 2710 |
| `[min]` | 其他目标可观察入口 | 1 | 27 | 27 |
| `[MONSTER]` | 其他目标可观察入口 | 2 | 50 | 50 |
| `[monster object type]` | 对象、召唤或骑乘入口 | 1 | 2 | 2 |
| `[monster title]` | 身份、资源或显示入口 | 2 | 92 | 92 |
| `[mounted action]` | 攻击、动作或表现入口 | 2 | 16 | 16 |
| `[mounting action]` | 攻击、动作或表现入口 | 2 | 16 | 16 |
| `[move action]` | 攻击、动作或表现入口 | 2 | 3760 | 3749 |
| `[move motion]` | 攻击、动作或表现入口 | 2 | 1665 | 1665 |
| `[move speed]` | 能力、数值或抗性入口 | 2 | 5616 | 5587 |
| `[moveback action]` | 攻击、动作或表现入口 | 2 | 86 | 86 |
| `[MP MAX]` | 能力、数值或抗性入口 | 2 | 2 | 2 |
| `[MP regen speed]` | 能力、数值或抗性入口 | 2 | 1019 | 1019 |
| `[name]` | 身份、资源或显示入口 | 2 | 5741 | 5727 |
| `[no champion]` | 难度、精英或掉落入口 | 1 | 67 | 67 |
| `[no change target]` | AI、目标或状态入口 | 2 | 12 | 12 |
| `[No Combo Rate Monster]` | 能力、数值或抗性入口 | 2 | 6 | 6 |
| `[non targeted]` | AI、目标或状态入口 | 2 | 23 | 23 |
| `[non targeted by enemy monster]` | AI、目标或状态入口 | 1 | 5 | 5 |
| `[normal]` | 其他目标可观察入口 | 2 | 1464 | 1357 |
| `[normal dash speed]` | 能力、数值或抗性入口 | 2 | 4 | 4 |
| `[on set action]` | 攻击、动作或表现入口 | 1 | 2 | 2 |
| `[option]` | 其他目标可观察入口 | 2 | 32 | 16 |
| `[others]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[out of targetting]` | AI、目标或状态入口 | 2 | 30 | 30 |
| `[overhead gauge pos]` | 身份、资源或显示入口 | 2 | 28 | 28 |
| `[overhead gauge type]` | 身份、资源或显示入口 | 2 | 235 | 235 |
| `[overturn action]` | 攻击、动作或表现入口 | 2 | 2570 | 2564 |
| `[overturn motion]` | 攻击、动作或表现入口 | 2 | 1481 | 1481 |
| `[ozma apc enemy monster]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[pass type]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[PASSIVE]` | AI、目标或状态入口 | 1 | 76 | 19 |
| `[passive]` | AI、目标或状态入口 | 1 | 1 | 1 |
| `[pattern]` | 其他目标可观察入口 | 2 | 257 | 62 |
| `[Pattern]` | 其他目标可观察入口 | 2 | 10 | 7 |
| `[physical]` | 能力、数值或抗性入口 | 1 | 138 | 70 |
| `[physical attack besed on diff]` | 攻击、动作或表现入口 | 2 | 17 | 17 |
| `[piercing resistance]` | 能力、数值或抗性入口 | 2 | 1009 | 1002 |
| `[poison]` | 其他目标可观察入口 | 1 | 3 | 3 |
| `[poison resistance]` | 能力、数值或抗性入口 | 2 | 2155 | 2144 |
| `[proc action]` | 攻击、动作或表现入口 | 2 | 1489 | 1483 |
| `[pseudo boss]` | 其他目标可观察入口 | 1 | 4 | 4 |
| `[pvp]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[ready action]` | 攻击、动作或表现入口 | 2 | 171 | 90 |
| `[recovery action]` | 攻击、动作或表现入口 | 1 | 4 | 4 |
| `[recovery action count]` | 攻击、动作或表现入口 | 1 | 4 | 4 |
| `[recovery motion]` | 攻击、动作或表现入口 | 1 | 3 | 3 |
| `[recovery motion count]` | 攻击、动作或表现入口 | 1 | 3 | 3 |
| `[reduce active status damage]` | 攻击、动作或表现入口 | 1 | 3 | 3 |
| `[reflection object]` | 对象、召唤或骑乘入口 | 2 | 21 | 21 |
| `[resist entry]` | 其他目标可观察入口 | 1 | 11 | 11 |
| `[resist value]` | 其他目标可观察入口 | 1 | 21 | 21 |
| `[ridableobject skill]` | 攻击、动作或表现入口 | 1 | 1 | 1 |
| `[ridableskill definition]` | 攻击、动作或表现入口 | 2 | 55 | 52 |
| `[ridableskill explain]` | 攻击、动作或表现入口 | 1 | 8 | 1 |
| `[ridableskill explanation]` | 攻击、动作或表现入口 | 2 | 190 | 51 |
| `[second interval]` | 其他目标可观察入口 | 1 | 14 | 10 |
| `[set attack action]` | 攻击、动作或表现入口 | 1 | 4 | 4 |
| `[set damage check]` | 攻击、动作或表现入口 | 2 | 408 | 408 |
| `[set max status resistance]` | 能力、数值或抗性入口 | 1 | 44 | 44 |
| `[set minimum active status resistance]` | 能力、数值或抗性入口 | 1 | 53 | 53 |
| `[set minimum tolerance and defence]` | 其他目标可观察入口 | 1 | 71 | 71 |
| `[set position name]` | 身份、资源或显示入口 | 1 | 5 | 5 |
| `[set stay action]` | 攻击、动作或表现入口 | 1 | 51 | 49 |
| `[shaking]` | 难度、精英或掉落入口 | 1 | 27 | 27 |
| `[shaking frequency]` | 难度、精英或掉落入口 | 1 | 27 | 27 |
| `[show hp state gague]` | AI、目标或状态入口 | 1 | 63 | 61 |
| `[sight]` | AI、目标或状态入口 | 2 | 1787 | 1785 |
| `[sit action]` | 攻击、动作或表现入口 | 2 | 2586 | 2578 |
| `[sit motion]` | 攻击、动作或表现入口 | 2 | 1417 | 1417 |
| `[skill]` | 攻击、动作或表现入口 | 2 | 55 | 52 |
| `[slant dash speed]` | 能力、数值或抗性入口 | 2 | 4 | 4 |
| `[slayer]` | 身份、资源或显示入口 | 2 | 1327 | 1221 |
| `[sleep resistance]` | 能力、数值或抗性入口 | 2 | 2209 | 2201 |
| `[slow]` | 其他目标可观察入口 | 1 | 137 | 57 |
| `[slow motion at damaged super armor]` | 攻击、动作或表现入口 | 1 | 18 | 18 |
| `[slow resistance]` | 能力、数值或抗性入口 | 2 | 2274 | 2258 |
| `[spawn prob]` | 其他目标可观察入口 | 2 | 164 | 164 |
| `[specific gen rate item]` | 难度、精英或掉落入口 | 2 | 2 | 2 |
| `[speech on situation]` | 身份、资源或显示入口 | 2 | 1116 | 1116 |
| `[stand]` | 其他目标可观察入口 | 1 | 1 | 1 |
| `[start immune time]` | 其他目标可观察入口 | 2 | 47 | 47 |
| `[state]` | AI、目标或状态入口 | 1 | 1 | 1 |
| `[STAY]` | 其他目标可观察入口 | 1 | 5 | 2 |
| `[stone]` | 其他目标可观察入口 | 1 | 93 | 53 |
| `[stone resistance]` | 能力、数值或抗性入口 | 2 | 2372 | 2361 |
| `[strengthen damaged effect]` | 攻击、动作或表现入口 | 1 | 27 | 27 |
| `[string data]` | 其他目标可观察入口 | 1 | 2 | 2 |
| `[strong]` | 其他目标可观察入口 | 2 | 13 | 12 |
| `[stuck resistance]` | 能力、数值或抗性入口 | 2 | 203 | 202 |
| `[stuckbonus on damage]` | 攻击、动作或表现入口 | 2 | 5167 | 5112 |
| `[stun]` | 其他目标可观察入口 | 1 | 93 | 53 |
| `[stun resistance]` | 能力、数值或抗性入口 | 2 | 2403 | 2392 |
| `[stun time balance]` | 其他目标可观察入口 | 2 | 30 | 30 |
| `[subtitle]` | 身份、资源或显示入口 | 2 | 87 | 21 |
| `[summon skill status up rate]` | 攻击、动作或表现入口 | 2 | 82 | 66 |
| `[summon skill status up type]` | 攻击、动作或表现入口 | 2 | 60 | 60 |
| `[super champion drop item]` | 难度、精英或掉落入口 | 2 | 45 | 39 |
| `[superarmor on attack]` | 攻击、动作或表现入口 | 2 | 130 | 130 |
| `[target appendage]` | AI、目标或状态入口 | 2 | 2 | 2 |
| `[targeting attacker]` | 攻击、动作或表现入口 | 2 | 37 | 37 |
| `[targeting bonus]` | AI、目标或状态入口 | 2 | 619 | 619 |
| `[targeting downed]` | AI、目标或状态入口 | 2 | 21 | 21 |
| `[targeting from direction]` | AI、目标或状态入口 | 2 | 10 | 10 |
| `[targeting high HP]` | AI、目标或状态入口 | 2 | 16 | 16 |
| `[targeting high level]` | AI、目标或状态入口 | 2 | 293 | 293 |
| `[targeting low HP]` | AI、目标或状态入口 | 2 | 261 | 261 |
| `[targeting low level]` | AI、目标或状态入口 | 2 | 228 | 228 |
| `[targeting low physical defense]` | AI、目标或状态入口 | 2 | 24 | 24 |
| `[targeting nearest]` | AI、目标或状态入口 | 2 | 897 | 895 |
| `[targeting time term]` | AI、目标或状态入口 | 2 | 385 | 385 |
| `[think term]` | AI、目标或状态入口 | 2 | 4052 | 4023 |
| `[throw attack]` | 攻击、动作或表现入口 | 2 | 201 | 118 |
| `[time after setstate]` | AI、目标或状态入口 | 1 | 55 | 53 |
| `[title]` | 身份、资源或显示入口 | 2 | 198 | 52 |
| `[transparency]` | 身份、资源或显示入口 | 2 | 16 | 16 |
| `[ultimate]` | 难度、精英或掉落入口 | 2 | 3067 | 2710 |
| `[unmounting action]` | 攻击、动作或表现入口 | 2 | 16 | 16 |
| `[use boss hp gague ui]` | 能力、数值或抗性入口 | 1 | 31 | 31 |
| `[use shaking dissipation]` | 难度、精英或掉落入口 | 1 | 27 | 27 |
| `[value]` | 其他目标可观察入口 | 1 | 20 | 20 |
| `[velocity x]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[velocity y]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[vision]` | AI、目标或状态入口 | 2 | 3888 | 3851 |
| `[waiting action]` | 攻击、动作或表现入口 | 2 | 4031 | 4017 |
| `[waiting motion]` | 攻击、动作或表现入口 | 2 | 1726 | 1726 |
| `[warlike]` | AI、目标或状态入口 | 2 | 3596 | 3498 |
| `[warp attack]` | 攻击、动作或表现入口 | 2 | 24 | 12 |
| `[water resistance]` | 能力、数值或抗性入口 | 2 | 2543 | 2529 |
| `[weak]` | 其他目标可观察入口 | 2 | 2 | 2 |
| `[weapon break resistance]` | 攻击、动作或表现入口 | 2 | 366 | 366 |
| `[weight]` | 能力、数值或抗性入口 | 2 | 5726 | 5708 |
| `[width]` | 身份、资源或显示入口 | 2 | 1880 | 1880 |
| `[x pos]` | 其他目标可观察入口 | 2 | 16 | 16 |
| `[y pos]` | 其他目标可观察入口 | 2 | 16 | 16 |

## 闭合标签

| 标签 | 路由类别 | 目标数 | 出现次数 | 文件计数 |
| --- | --- | ---: | ---: | ---: |
| `[/ability category]` | 闭合边界 | 2 | 5772 | 5758 |
| `[/action]` | 闭合边界 | 1 | 55 | 53 |
| `[/action condition]` | 闭合边界 | 1 | 4 | 4 |
| `[/action list]` | 闭合边界 | 2 | 430 | 430 |
| `[/ai pattern]` | 闭合边界 | 2 | 4187 | 4173 |
| `[/all]` | 闭合边界 | 1 | 143 | 60 |
| `[/atk super on scr]` | 闭合边界 | 2 | 251 | 158 |
| `[/attack action]` | 闭合边界 | 2 | 3665 | 3649 |
| `[/attack down prob]` | 闭合边界 | 2 | 54 | 54 |
| `[/attack info]` | 闭合边界 | 2 | 5590 | 5568 |
| `[/attack kind]` | 闭合边界 | 2 | 1511 | 1511 |
| `[/attack motion]` | 闭合边界 | 2 | 1545 | 1545 |
| `[/can beat index]` | 闭合边界 | 2 | 4 | 4 |
| `[/catch item]` | 闭合边界 | 2 | 9 | 9 |
| `[/category]` | 闭合边界 | 2 | 5676 | 5655 |
| `[/change action by condition]` | 闭合边界 | 1 | 2 | 2 |
| `[/character job type]` | 闭合边界 | 1 | 1 | 1 |
| `[/common champion drop item]` | 闭合边界 | 2 | 2263 | 2263 |
| `[/common champion elemental property]` | 闭合边界 | 2 | 929 | 924 |
| `[/condition]` | 闭合边界 | 1 | 55 | 53 |
| `[/conditional amplify damage]` | 闭合边界 | 1 | 1 | 1 |
| `[/consume mp]` | 闭合边界 | 2 | 2 | 2 |
| `[/control passive object]` | 闭合边界 | 2 | 16 | 16 |
| `[/cooltime]` | 闭合边界 | 2 | 4178 | 4159 |
| `[/counter attack]` | 闭合边界 | 2 | 32 | 32 |
| `[/dash attack]` | 闭合边界 | 2 | 49 | 33 |
| `[/death tower item]` | 闭合边界 | 2 | 75 | 75 |
| `[/die cinematic]` | 闭合边界 | 1 | 2 | 2 |
| `[/dungeon mode script]` | 闭合边界 | 1 | 14 | 14 |
| `[/easy]` | 闭合边界 | 2 | 2708 | 2708 |
| `[/effective state]` | 闭合边界 | 1 | 27 | 27 |
| `[/emergency state recovery]` | 闭合边界 | 1 | 55 | 53 |
| `[/enable state]` | 闭合边界 | 1 | 15 | 15 |
| `[/enable states]` | 闭合边界 | 1 | 2 | 2 |
| `[/equipment]` | 闭合边界 | 2 | 108 | 108 |
| `[/etc action]` | 闭合边界 | 2 | 464 | 464 |
| `[/etc attack info]` | 闭合边界 | 2 | 576 | 576 |
| `[/etc attack infp]` | 闭合边界 | 1 | 1 | 1 |
| `[/etc motion]` | 闭合边界 | 2 | 1352 | 1352 |
| `[/event super on scr]` | 闭合边界 | 2 | 416 | 282 |
| `[/expert]` | 闭合边界 | 2 | 1397 | 1356 |
| `[/hard]` | 闭合边界 | 2 | 2684 | 2684 |
| `[/hero]` | 闭合边界 | 2 | 2685 | 2685 |
| `[/herog]` | 闭合边界 | 2 | 14 | 14 |
| `[/hitstun resistance system]` | 闭合边界 | 1 | 59 | 59 |
| `[/hold attack]` | 闭合边界 | 2 | 57 | 57 |
| `[/ignore condition]` | 闭合边界 | 1 | 1 | 1 |
| `[/immune active status]` | 闭合边界 | 1 | 6 | 6 |
| `[/init cooltime]` | 闭合边界 | 1 | 14 | 13 |
| `[/initial target]` | 闭合边界 | 2 | 71 | 71 |
| `[/int data]` | 闭合边界 | 2 | 1362 | 1360 |
| `[/item]` | 闭合边界 | 2 | 1283 | 1273 |
| `[/jump attack]` | 闭合边界 | 2 | 34 | 24 |
| `[/king]` | 闭合边界 | 2 | 1397 | 1356 |
| `[/layer effect]` | 闭合边界 | 1 | 27 | 27 |
| `[/level of difficulty]` | 闭合边界 | 2 | 449 | 449 |
| `[/master]` | 闭合边界 | 2 | 1397 | 1356 |
| `[/medium]` | 闭合边界 | 2 | 2684 | 2684 |
| `[/normal]` | 闭合边界 | 2 | 1398 | 1357 |
| `[/pattern]` | 闭合边界 | 2 | 12 | 10 |
| `[/physical attack besed on diff]` | 闭合边界 | 2 | 17 | 17 |
| `[/pvp]` | 闭合边界 | 2 | 16 | 16 |
| `[/ready action]` | 闭合边界 | 2 | 171 | 90 |
| `[/reduce active status damage]` | 闭合边界 | 1 | 3 | 3 |
| `[/reflection object]` | 闭合边界 | 2 | 21 | 21 |
| `[/resist entry]` | 闭合边界 | 1 | 11 | 11 |
| `[/resist value]` | 闭合边界 | 1 | 21 | 21 |
| `[/ridableobject skill]` | 闭合边界 | 1 | 1 | 1 |
| `[/ridableskill definition]` | 闭合边界 | 2 | 55 | 52 |
| `[/ridableskill explain]` | 闭合边界 | 1 | 8 | 1 |
| `[/ridableskill explanation]` | 闭合边界 | 2 | 190 | 51 |
| `[/set max status resistance]` | 闭合边界 | 1 | 44 | 44 |
| `[/set minimum active status resistance]` | 闭合边界 | 1 | 53 | 53 |
| `[/set minimum tolerance and defence]` | 闭合边界 | 1 | 71 | 71 |
| `[/shaking]` | 闭合边界 | 1 | 27 | 27 |
| `[/slayer]` | 闭合边界 | 2 | 1261 | 1220 |
| `[/specific gen rate item]` | 闭合边界 | 2 | 2 | 2 |
| `[/speech on situation]` | 闭合边界 | 2 | 1116 | 1116 |
| `[/state]` | 闭合边界 | 1 | 1 | 1 |
| `[/strengthen damaged effect]` | 闭合边界 | 1 | 27 | 27 |
| `[/string data]` | 闭合边界 | 1 | 2 | 2 |
| `[/super champion drop item]` | 闭合边界 | 2 | 45 | 39 |
| `[/targeting bonus]` | 闭合边界 | 2 | 160 | 160 |
| `[/throw attack]` | 闭合边界 | 2 | 201 | 118 |
| `[/transparency]` | 闭合边界 | 2 | 16 | 16 |
| `[/ultimate]` | 闭合边界 | 2 | 2684 | 2684 |
| `[/warp attack]` | 闭合边界 | 2 | 24 | 12 |
