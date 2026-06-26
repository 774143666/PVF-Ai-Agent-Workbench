# PassiveObject .obj 字段词典

状态：需验证

本文只记录主目标 PVF 只读观察到的 passiveobject `.obj` 结构入口。字段出现不等于实机碰撞、移动、追踪、伤害、销毁、队伍关系或客户端表现已经验证。

## 文件边界

### `passiveobject/passiveobject.lst -> .obj`

含义：passiveobject 数字 ID 必须先通过 `passiveobject/passiveobject.lst` 解析，再读取对应 `.obj`。

注意：registry 未命中的 ID 只能标为未解析；不得猜路径。registry 命中但对象文件不存在时，标为对象文件断链。

### `.obj -> .act/.ani/.atk`

含义：`.obj` 可通过反引号路径连接动作、动画和 AttackInfo。相对路径按当前 `.obj` 所在目录解析；已经带 PVF 根目录的路径按根目录解析。

注意：同名文件位于其他目录不等于当前引用已闭合；不能仅凭文件名替换路径。

## 身份、宽度、层与通行

| 字段 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[name]` | 名称或字符串链接。 | `<...name_数字...>` 不是 passiveobject ID。 |
| `[width]` | 两个数值。 | 不直接证明碰撞体积。 |
| `[floating height]` | 一个数值。 | 不直接证明实机浮空高度。 |
| `[layer]` | 一个反引号 token。 | token 原样保留。 |
| `[layer level]` | 一个数值。 | 层级排序语义需实机验证。 |
| `[pass type]` | 一个反引号 token。 | 不直接证明实际通行结果。 |
| `[team]` | 一个数值。 | 不要直接等同伤害敌我规则。 |

## 动作、动画与 AttackInfo

| 字段 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[basic action]` | 一个相对 `.act` 路径。 | 继续读取 `.act`。 |
| `[basic motion]` | 一个相对 `.ani` 路径。 | 继续反编译 `.ani`；不要在 `.obj` 层判断 hitbox。 |
| `[etc action] ... [/etc action]` | 多个 `.act` 路径闭合块。 | 必须读到结束标签。 |
| `[etc motion] ... [/etc motion]` | 多个 `.ani` 路径闭合块。 | 同一 `.obj` 的不同 motion 不共享 hitbox 结论。 |
| `[last action]` | 一个 `.act` 路径。 | 运行触发时机需实机验证。 |
| `[attack info]` | 一个 `.atk` 路径。 | 字段存在不等于对象一定造成伤害。 |
| `[etc attack info]` | 多个 `.atk` 路径或闭合列表。 | 需要继续闭合到具体 `.atk`。 |
| `[sound category] ... [/sound category]` | 闭合列表，样本可见事件 token、声音 token 和数值。 | 只证明声音类别引用结构，不证明客户端音频资源完整或触发时机。 |

## 生命周期与销毁

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[object destroy condition] ... [/object destroy condition]` | 可为空闭合块；也可包含反引号 token 与数值行。 | 必须读到结束标签；空块也算结构存在。 |
| `[hp max]` | 一个数值。 | 结构上是生命上限入口；耐久语义需实机验证。 |
| `[hp destroy]` | 一个数值。 | 结构上是血量销毁入口；`0/1` 的实际含义需专项验证。 |
| `[is hp by difficulty]` | 一个数值。 | 只证明生命/难度相关入口存在，不解释难度缩放公式。 |
| `[destroy particle]` | 一个相对 `.ptl` 路径。 | 只证明粒子引用，不证明客户端资源完整。 |
| `[vanish on move collision]` | 一个数值。 | 与移动碰撞消失相邻；碰撞判定需实机验证。 |
| `[under gravity]` | 一个数值。 | 少量样本字段；不直接证明物理公式。 |

### `[object destroy condition]` 块内 token

| token / 行 | 已观察列形 | 边界 |
| --- | --- | --- |
| `` `[destroy condition]` `` | 反引号 token。 | 块内枚举样 token，不是独立字段标签。 |
| `` `[time limite]` `` | 反引号 token 后可跟一个数值。 | 拼写按原样保留；单位需实机验证。 |
| `` `[destroy action]` `` | 反引号 token。 | 只证明销毁动作样入口。 |
| `` `[object create after destroy]` `` | 反引号 token。 | 只证明销毁后创建样入口。 |
| `` `[add object index]` `` | 反引号 token 后可跟数值行；样本为 `1 9330`。 | 样本中的 9330 回 `passiveobject/passiveobject.lst` 解析；第一列含义未静态证明。 |
| `` `[on end of animation]` `` | 反引号 token。 | 只证明动画结束销毁样 token。 |

## 移动、追踪与旋转

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[homing] ... [/homing]` | 闭合块。 | 追踪配置存在，不证明轨迹公式。 |
| `[homing use]` | 一个数值。 | 追踪开关样字段。 |
| `[homing follow]` | 一个反引号 token，如 `[ENEMY]`。 | 目标类型 token 原样保留。 |
| `[homing velocity]` | 两个数值。 | 速度列形存在，不证明单位和公式。 |
| `[homing check gap]` | 一个数值。 | 检查间隔或距离语义需验证。 |
| `[sync animation rotation]` | 一个数值。 | 动画同步旋转需实机验证。 |
| `[max rotation]` | 一个数值。 | 旋转上限语义需实机验证。 |
| `[init rotation]` | 一个数值。 | 初始旋转语义需实机验证。 |
| `[diff rotation]` | 一个数值。 | 旋转差值语义需实机验证。 |
| `[homing time]` | 一个数值。 | 持续时间语义需实机验证。 |
| `[straight homing]` | 空标签，位于 `[homing]` 块内。 | 主目标只观察到少量样本，需专项复核。 |

### `[homing follow]` 路由

| token | 后续数字 | 边界 |
| --- | --- | --- |
| `` `[ENEMY]` `` | 样本无后续 registry ID。 | 按 token 记录，不解析 registry。 |
| `` `[MONSTER]` `` | 样本中后跟 `61194`。 | 数字走 `monster/monster.lst`；不要按 passiveobject registry 解析。 |

## 数据块

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[int data] ... [/int data]` | 数值列表闭合块。 | 列含义需结合对象专题验证。 |
| `[string data] ... [/string data]` | 字符串列表闭合块。 | 可能包含音效、资源或脚本名样字符串；不要猜运行含义。 |

## 覆盖

- 通用入口：见 `indexes/passiveobject-coverage-ledger.zh-CN.md`。
- 生命周期与追踪：见 `indexes/passiveobject-lifecycle-homing-ledger.zh-CN.md`。
- 样本链：见 `indexes/passiveobject-nonmonster-sample-chain.zh-CN.md`。
- Monster 创建链历史路由：见 `indexes/monster-created-passiveobject-obj-observed-tag-router.zh-CN.md`。
