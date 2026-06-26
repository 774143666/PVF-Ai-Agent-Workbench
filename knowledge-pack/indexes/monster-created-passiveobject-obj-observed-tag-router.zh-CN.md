# Monster 创建链 PassiveObject .obj 标签覆盖路由

状态：需验证

本文件覆盖目标 PVF 中由 monster 动作创建并通过 registry 解析到的 passiveobject `.obj` 字段、闭合标签和反引号 token。覆盖表示结构已观察并有路由，不表示运行效果已验证。

## 覆盖统计

- 字段标签：80 / 80。
- 闭合标签：16 / 16。
- 反引号 token：40 / 40。
- 未覆盖字段标签：0。
- 未覆盖闭合标签：0。
- 未覆盖反引号 token：0。

## 路由边界

- 数字 ID 先经 `passiveobject/passiveobject.lst` 解析，再读取 `.obj`。
- 反引号 `.act/.ani/.atk` 路径按 owner 目录或 PVF 根目录解析。
- 对象生命周期、追踪、碰撞、队伍和销毁效果仍需目标样本与实机验证。
- 反引号 token 必须回到外层 `.obj` 字段解释。

## 全量字段标签

`[absolute zpos]`, `[add object effect]`, `[add particles]`, `[add tail Image]`, `[apply physics]`, `[attack info]`, `[basic action]`, `[basic motion]`, `[can beat index]`, `[category]`。

`[create delay]`, `[create sound]`, `[damage absorb]`, `[destroy particle]`, `[die when parent die]`, `[diff rotation]`, `[draw tail]`, `[draw tail use]`, `[etc action]`, `[etc attack info]`。

`[etc motion]`, `[file]`, `[floating height]`, `[follow parent]`, `[following immortal]`, `[ground brighten height]`, `[ground brighten width]`, `[homing]`, `[homing check gap]`, `[homing direction]`。

`[homing follow]`, `[homing keep distance]`, `[homing time]`, `[homing use]`, `[homing velocity]`, `[homing z axis]`, `[hp destroy]`, `[hp gage]`, `[hp max]`, `[init rotation]`。

`[init rotation z]`, `[initial direction]`, `[int data]`, `[is hp by difficulty]`, `[last action]`, `[layer]`, `[layer level]`, `[matching attack info]`, `[max distance]`, `[max rotation]`。

`[melee attack]`, `[min distance]`, `[name]`, `[object brighten height]`, `[object brighten width]`, `[object destroy condition]`, `[particle]`, `[pass type]`, `[passive object sub type]`, `[passive object type]`。

`[piercing power]`, `[piercing tolerance]`, `[quest type]`, `[sniper type]`, `[sound category]`, `[specific view]`, `[straight homing]`, `[string data]`, `[sync animation rotation]`, `[sync target move]`。

`[tail bottom up layer]`, `[tail rotate]`, `[tail type]`, `[team]`, `[time interval]`, `[under gravity]`, `[vanish on move collision]`, `[wait time]`, `[warning]`, `[width]`。

## 全量闭合标签

`[/add object effect]`, `[/add particles]`, `[/can beat index]`, `[/category]`, `[/draw tail]`, `[/etc action]`, `[/etc attack info]`, `[/etc motion]`, `[/homing]`, `[/int data]`。

`[/object destroy condition]`, `[/particle]`, `[/sniper type]`, `[/sound category]`, `[/string data]`, `[/warning]`。

## 全量反引号 token

`[add object index]`, `[add object index on attack]`, `[after object create]`, `[bottom]`, `[CHARACTER]`, `[close]`, `[closeback]`, `[cover]`, `[cross counter guide director]`, `[destroy action]`。

`[destroy condition]`, `[distantback]`, `[do not pass]`, `[end of animation]`, `[ENEMY]`, `[enemy]`, `[fixture]`, `[gent infiltrate enter boss room]`, `[ME]`, `[middleback]`。

`[MONSTER]`, `[must be destroyed]`, `[nenguard]`, `[noraml]`, `[normal]`, `[object create after destroy]`, `[on attack]`, `[on damage]`, `[on destroyobject]`, `[on end of animation]`。

`[only destroy]`, `[parent]`, `[parent dead]`, `[pass all]`, `[pass only float type]`, `[PASSIVE]`, `[right]`, `[time]`, `[time limite]`, `[z pos equal zero]`。

## 字段统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[absolute zpos]` | 1 | 2 | 2 |
| `[add object effect]` | 2 | 19 | 19 |
| `[add particles]` | 2 | 91 | 91 |
| `[add tail Image]` | 1 | 121 | 11 |
| `[apply physics]` | 1 | 10 | 10 |
| `[attack info]` | 2 | 4391 | 4391 |
| `[basic action]` | 2 | 7595 | 7595 |
| `[basic motion]` | 2 | 561 | 561 |
| `[can beat index]` | 2 | 4 | 4 |
| `[category]` | 1 | 8 | 8 |
| `[create delay]` | 2 | 88 | 52 |
| `[create sound]` | 2 | 13 | 11 |
| `[damage absorb]` | 1 | 1 | 1 |
| `[destroy particle]` | 2 | 179 | 179 |
| `[die when parent die]` | 2 | 8 | 8 |
| `[diff rotation]` | 2 | 321 | 321 |
| `[draw tail]` | 1 | 11 | 11 |
| `[draw tail use]` | 1 | 11 | 11 |
| `[etc action]` | 2 | 2318 | 2318 |
| `[etc attack info]` | 2 | 1357 | 1357 |
| `[etc motion]` | 2 | 369 | 369 |
| `[file]` | 2 | 136 | 85 |
| `[floating height]` | 2 | 4264 | 4264 |
| `[follow parent]` | 2 | 25 | 23 |
| `[following immortal]` | 2 | 10 | 10 |
| `[ground brighten height]` | 1 | 1 | 1 |
| `[ground brighten width]` | 1 | 1 | 1 |
| `[homing]` | 2 | 419 | 419 |
| `[homing check gap]` | 2 | 380 | 380 |
| `[homing direction]` | 2 | 14 | 14 |
| `[homing follow]` | 2 | 419 | 419 |
| `[homing keep distance]` | 2 | 2 | 2 |
| `[homing time]` | 2 | 266 | 266 |
| `[homing use]` | 2 | 419 | 419 |
| `[homing velocity]` | 2 | 419 | 419 |
| `[homing z axis]` | 1 | 17 | 17 |
| `[hp destroy]` | 2 | 953 | 922 |
| `[hp gage]` | 2 | 76 | 76 |
| `[hp max]` | 2 | 848 | 848 |
| `[init rotation]` | 2 | 200 | 200 |
| `[init rotation z]` | 1 | 5 | 5 |
| `[initial direction]` | 1 | 1 | 1 |
| `[int data]` | 2 | 195 | 195 |
| `[is hp by difficulty]` | 2 | 67 | 67 |
| `[last action]` | 2 | 434 | 428 |
| `[layer]` | 2 | 6255 | 6252 |
| `[layer level]` | 2 | 243 | 243 |
| `[matching attack info]` | 1 | 19 | 18 |
| `[max distance]` | 2 | 25 | 25 |
| `[max rotation]` | 2 | 291 | 291 |
| `[melee attack]` | 1 | 4 | 4 |
| `[min distance]` | 2 | 25 | 25 |
| `[name]` | 2 | 5221 | 5221 |
| `[object brighten height]` | 1 | 1 | 1 |
| `[object brighten width]` | 1 | 1 | 1 |
| `[object destroy condition]` | 2 | 3522 | 3521 |
| `[particle]` | 2 | 136 | 85 |
| `[pass type]` | 2 | 5547 | 5547 |
| `[passive object sub type]` | 1 | 4 | 4 |
| `[passive object type]` | 1 | 2 | 2 |
| `[piercing power]` | 2 | 7087 | 7081 |
| `[piercing tolerance]` | 1 | 14 | 14 |
| `[quest type]` | 2 | 2 | 2 |
| `[sniper type]` | 1 | 4 | 4 |
| `[sound category]` | 2 | 359 | 359 |
| `[specific view]` | 1 | 3 | 3 |
| `[straight homing]` | 2 | 2 | 2 |
| `[string data]` | 2 | 103 | 103 |
| `[sync animation rotation]` | 2 | 252 | 252 |
| `[sync target move]` | 2 | 87 | 87 |
| `[tail bottom up layer]` | 1 | 11 | 11 |
| `[tail rotate]` | 1 | 11 | 11 |
| `[tail type]` | 1 | 11 | 11 |
| `[team]` | 2 | 1762 | 1759 |
| `[time interval]` | 1 | 11 | 11 |
| `[under gravity]` | 1 | 2 | 2 |
| `[vanish on move collision]` | 2 | 547 | 546 |
| `[wait time]` | 1 | 4 | 4 |
| `[warning]` | 2 | 25 | 25 |
| `[width]` | 2 | 1626 | 1626 |

## 闭合标签统计表

| 标签 | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[/add object effect]` | 2 | 19 | 19 |
| `[/add particles]` | 2 | 91 | 91 |
| `[/can beat index]` | 2 | 4 | 4 |
| `[/category]` | 1 | 8 | 8 |
| `[/draw tail]` | 1 | 11 | 11 |
| `[/etc action]` | 2 | 2318 | 2318 |
| `[/etc attack info]` | 2 | 1357 | 1357 |
| `[/etc motion]` | 2 | 369 | 369 |
| `[/homing]` | 2 | 419 | 419 |
| `[/int data]` | 2 | 195 | 195 |
| `[/object destroy condition]` | 2 | 3522 | 3521 |
| `[/particle]` | 2 | 136 | 85 |
| `[/sniper type]` | 1 | 4 | 4 |
| `[/sound category]` | 2 | 359 | 359 |
| `[/string data]` | 2 | 103 | 103 |
| `[/warning]` | 2 | 25 | 25 |

## Token 统计表

| Token | 目标集数 | 出现次数 | 文件计数合计 |
| --- | ---: | ---: | ---: |
| `[add object index]` | 2 | 114 | 114 |
| `[add object index on attack]` | 2 | 2 | 2 |
| `[after object create]` | 2 | 264 | 264 |
| `[bottom]` | 2 | 1795 | 1793 |
| `[CHARACTER]` | 2 | 93 | 93 |
| `[close]` | 2 | 89 | 89 |
| `[closeback]` | 1 | 13 | 13 |
| `[cover]` | 2 | 19 | 19 |
| `[cross counter guide director]` | 1 | 3 | 3 |
| `[destroy action]` | 2 | 141 | 141 |
| `[destroy condition]` | 2 | 3443 | 3442 |
| `[distantback]` | 1 | 1 | 1 |
| `[do not pass]` | 2 | 180 | 180 |
| `[end of animation]` | 1 | 3 | 3 |
| `[ENEMY]` | 2 | 220 | 220 |
| `[enemy]` | 1 | 1 | 1 |
| `[fixture]` | 1 | 8 | 8 |
| `[gent infiltrate enter boss room]` | 1 | 1 | 1 |
| `[ME]` | 2 | 4 | 4 |
| `[middleback]` | 2 | 17 | 17 |
| `[MONSTER]` | 2 | 83 | 83 |
| `[must be destroyed]` | 2 | 2 | 2 |
| `[nenguard]` | 1 | 2 | 2 |
| `[noraml]` | 1 | 1 | 1 |
| `[normal]` | 2 | 4320 | 4320 |
| `[object create after destroy]` | 2 | 123 | 123 |
| `[on attack]` | 2 | 20 | 20 |
| `[on damage]` | 2 | 16 | 16 |
| `[on destroyobject]` | 2 | 89 | 89 |
| `[on end of animation]` | 2 | 2058 | 2058 |
| `[only destroy]` | 2 | 26 | 19 |
| `[parent]` | 2 | 5 | 5 |
| `[parent dead]` | 1 | 37 | 37 |
| `[pass all]` | 2 | 5354 | 5354 |
| `[pass only float type]` | 2 | 13 | 13 |
| `[PASSIVE]` | 1 | 18 | 18 |
| `[right]` | 1 | 1 | 1 |
| `[time]` | 1 | 1 | 1 |
| `[time limite]` | 2 | 1329 | 1328 |
| `[z pos equal zero]` | 2 | 22 | 22 |
