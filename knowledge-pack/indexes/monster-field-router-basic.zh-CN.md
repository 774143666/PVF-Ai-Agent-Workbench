# Monster 字段路由索引

状态：需验证

本索引只帮助 Agent 给 `.mob` 标签分流。它不解释运行语义，不授权写 PVF。

## 使用方式

1. 先通过 `monster/monster.lst` 解析怪物 ID。
2. 读取目标 `.mob`。
3. 按下表把标签归入核查方向。
4. 对引用类字段继续闭合 `.act/.ani/.atk/passiveobject/map/dungeon`。
5. 涉及数值、AI、伤害、掉落或表现时，标为需要游戏内验证。

## 基础身份与显示

| 标签 | 路由 |
| --- | --- |
| `[name]` | 名称文本，检查显示和文本资源。 |
| `[level]` | 等级字段，检查目标怪物等级和难度联动。 |
| `[category]` | 类别块，检查内部 token，不直接解释运行语义。 |
| `[face image]` | 图像资源，进入客户端资源核查。 |
| `[weight]` | 重量入口，涉及击退/浮空/抓取时需实机。 |
| `[floating height]` | 浮空高度入口，涉及碰撞和表现时需实机。 |

## 能力与速度

| 标签 | 路由 |
| --- | --- |
| `[ability category]` | 能力块，常含 HP、攻击、防御等内部 token。 |
| `[ability table]` | 能力表入口，需查表或同类样本。 |
| `[attack speed]` | 攻击速度入口，需结合 action / delay / cooltime。 |
| `[cast speed]` | 施放速度入口，需结合攻击链。 |
| `[move speed]` | 移动速度入口，需结合 AI 与移动 action。 |
| `[hit recovery]` | 受击恢复/硬直入口，需实机验证。 |

常见 `[ability category]` 内部 token：

- `[HP MAX]`
- `[EQUIPMENT_PHYSICAL_ATTACK]`
- `[EQUIPMENT_MAGICAL_ATTACK]`
- `[EQUIPMENT_PHYSICAL_DEFENSE]`
- `[EQUIPMENT_MAGICAL_DEFENSE]`
- `[PHYSICAL_ATTACK]`
- `[MAGICAL_ATTACK]`
- `[PHYSICAL_DEFENSE]`
- `[MAGICAL_DEFENSE]`

## AI 与行为

| 标签 | 路由 |
| --- | --- |
| `[ai pattern]` | AI 模式入口，继续查具体块和同类样本。 |
| `[think term]` | AI 思考间隔入口。 |
| `[vision]` / `[sight]` | 视野或索敌范围入口。 |
| `[warlike]` | 主动性/好战性入口。 |
| `[attack delay]` | 攻击延迟入口。 |
| `[targeting nearest]` | 目标选择入口。 |
| `[targeting time term]` | 目标确认时间入口。 |
| `[waiting action]` | 等待动作入口。 |
| `[move action]` | 移动动作入口。 |
| `[keep distance with target]` | 与目标距离控制入口。 |

## 攻击与动作链

| 标签 | 路由 |
| --- | --- |
| `[attack info]` | 闭合到 `.atk`。 |
| `[attack action]` | 闭合到 `.act/.ani/.atk`。 |
| `[attack motion]` | 检查动作或动画配置。 |
| `[attack kind]` | 攻击类型候选，需样本或实机。 |
| `[action list]` | 动作列表，逐项闭合。 |
| `[etc action]` | 额外动作入口。 |
| `[etc attack info]` | 额外攻击信息入口。 |
| `[superarmor on attack]` | 攻击霸体候选，需实机验证。 |

## 难度、精英与掉落

| 标签 | 路由 |
| --- | --- |
| `[easy]` / `[medium]` / `[hard]` / `[hero]` / `[ultimate]` | 难度分支入口。 |
| `[normal]` / `[expert]` / `[master]` / `[king]` | 版本差异中的难度分支入口。 |
| `[common champion drop item]` | 精英掉落入口，继续解析物品 registry。 |
| `[common champion elemental property]` | 精英元素属性入口。 |
| `[level of difficulty]` | 难度等级入口。 |
| `[independent drop]` | 独立掉落入口；没有目标样本闭合前不要套教程模板。 |

## 音效、死亡与表现

| 标签 | 路由 |
| --- | --- |
| `[damage sound]` | 受击音效资源。 |
| `[die sound]` | 死亡音效资源。 |
| `[die effect]` | 死亡效果入口。 |
| `[damage action 1]` / `[damage action 2]` | 受击动作入口。 |
| `[effect ani file & layer index]` | 效果动画和层级入口。 |

## PassiveObject 与特殊对象

| 标签 | 路由 |
| --- | --- |
| `[passive object filename]` | 被动对象路径入口。 |
| `[passive object index]` | 被动对象索引入口。 |
| `[passive object number]` | 被动对象数量入口。 |
| `[passive object start x cood]` / `[passive object start y cood]` / `[passive object start z cood]` | 被动对象出生坐标入口。 |

注意：涉及 passiveobject 时，必须回到 `passiveobject/passiveobject.lst` 和 `.obj/.act/.ani/.atk` 链继续核查。

## 禁止外推

- 不要把教程中的 monster ID 直接复用到目标 PVF。
- 不要从字段名直接判断伤害、AI、掉率或死亡效果。
- 不要把补充样本独有字段写成当前目标 PVF 默认规则。
- 不要只看 `.mob` 就判断客户端资源完整。
