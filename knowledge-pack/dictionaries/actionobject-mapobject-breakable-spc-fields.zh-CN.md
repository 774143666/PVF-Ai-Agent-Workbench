# ActionObject / MapObject / BreakableObject / SPC Object 字段词典

状态：默认可用

本文记录主目标 PVF 中对象家族的静态字段边界。它只说明字段入口、路径上下文和 registry 路由，不证明实机生成、碰撞、命中、破坏、门逻辑、音效、客户端资源或服务端放行。

## 文件家族

| 家族 | 主目标只读观察 | 边界 |
| --- | ---: | --- |
| `passiveobject/` `.obj` | 6984 | 所有 `.obj` 仍需按 registry、owner 路径和父块上下文读取。 |
| `passiveobject/actionobject/` `.obj` | 3953 | 常见行为对象目录；不等于所有文件都会由地图或技能实际创建。 |
| `passiveobject/actionobject/map/` `.obj` | 1002 | 地图相关 actionobject；仍通过 passiveobject registry 或 owner 链路定位。 |
| `passiveobject/actionobject/monster/` `.obj` | 2130 | 怪物相关 actionobject；不能和 `monster/*.mob` registry 混同。 |
| `passiveobject/actionobject/common/` `.obj` | 171 | 通用对象候选；不证明全局可复用。 |
| `passiveobject/actionobject/breakableobject/` `.obj` | 88 | actionobject 层破坏物；可含 `.act`、HP、销毁粒子、APC 召唤等上下文。 |
| `passiveobject/actionobject/spc/` `.obj` | 202 | SPC 对象家族；当前观察到 `.act/.atk/.ani` 链路样本。 |
| `passiveobject/mapobject/` `.obj` | 1281 | 地图物件家族；常见直接 motion、int/string data、ANI/TIL 资源引用。 |
| `passiveobject/mapobject/breakableobject/` `.obj` | 156 | mapobject 层破坏物；不等于 actionobject 层破坏物。 |
| `passiveobject/mapobject/pathgate/` `.obj` | 617 | 路径门对象候选；静态字段不证明门开关实机正常。 |
| `passiveobject/mapobject/trap/` `.obj` | 124 | 陷阱/机关候选；静态字段不证明触发、伤害或任务计数。 |
| `passiveobject/mapobject/obstacle/` `.obj` | 360 | 障碍物候选；静态字段不证明碰撞实机正确。 |
| `passiveobject/mapobject/particlefactory/` `.obj` | 24 | 粒子工厂候选；静态字段不证明客户端渲染。 |

## 常见对象字段

| 字段 / 块 | 已观察上下文 | 读取边界 |
| --- | --- | --- |
| `[name]` | mapobject/actionobject 样本可见直接文本或 StringLink 样式名称。 | 只证明静态名称字段存在，不证明 UI 显示。 |
| `[width]` | mapobject 破坏物、actionobject 破坏物、SPC 样本可见两数值列。 | 不证明碰撞盒或可通过性实机正确。 |
| `[floating height]` | 多个 `.obj` 样本可见单数值。 | 不证明 Z 轴显示或命中高度。 |
| `[layer]` | 样本可见 `` `[normal]` ``。 | 只记录层 token，不证明客户端排序。 |
| `[pass type]` | 样本可见 `` `[pass all]` ``、`` `[do not pass]` ``。 | 不证明实机通行或碰撞。 |
| `[piercing power]` | actionobject/SPC 样本可见。 | 不解释为穿透公式。 |
| `[team]` | actionobject 破坏物样本可见。 | 不证明阵营、敌我或 PVP 规则。 |
| `[basic action]` | actionobject 样本常见，指向 owner 相对 `.act`。 | 需要继续读取 `.act`；不证明动作播放。 |
| `[etc action]` | actionobject 破坏物样本可见，可列出额外 `.act`。 | 不证明触发条件或生命期。 |
| `[basic motion]` | mapobject 样本常见，直接指向 `.ani`。 | 不要硬解释成 `.act`。 |
| `[etc motion]` | mapobject 样本可见多行 `.ani` 或空串。 | 空串是占位风险；不证明资源存在或播放。 |
| `[attack info]` | actionobject 和部分 mapobject 样本可见，指向 `.atk`。 | `.atk` 静态 payload 不证明 hitbox 命中。 |
| `[object destroy condition]` | actionobject 样本常见；mapobject 主目标仅少量命中。 | 不证明销毁时序或任务计数器。 |
| `[hp max]` / `[hp destroy]` | actionobject 破坏物样本可见；主目标 mapobject 当前样本 `[hp max]` 搜索为 0。 | 不证明破坏物实机血量或可破坏。 |
| `[destroy particle]` | mapobject/actionobject 样本可见粒子路径。 | 不证明客户端粒子资源完整。 |
| `[sound category]` | SPC 样本可见对象创建后声音 token。 | 不证明音频实际播放。 |
| `[int data]` | mapobject/pathgate 样本可见多数值列。 | 只记录列存在，不硬命名每列语义。 |
| `[string data]` | mapobject/pathgate 样本可见 ANI/TIL 或声音 token。 | 字符串可为资源候选，不证明客户端资源完整。 |

## `.act` 行为入口

| 块 | 主目标观察 | 正确 registry / 边界 |
| --- | --- | --- |
| `[MOTION]` | `ActionObject` `.act` 样本中包裹 `[BASE ANI]`、`[SUB ANI]`、`[SOUND]`。 | 只证明动作资源引用；不证明动画帧或 hitbox 生效。 |
| `[BASE ANI]` | 样本可指向 owner 相对 `.ani`。 | 不证明 ANI 能被客户端渲染。 |
| `[SUB ANI]` | 样本可含多行 ANI 和坐标。 | 不证明叠加显示正确。 |
| `[SOUND]` | 样本可含声音 token 和帧序。 | 不证明音频资源存在或播放。 |
| `[TRIGGER]` / `[BEHAVIOR]` | 样本可见帧触发、条件检查和行为块。 | 不证明实机触发或同步。 |
| `[CREATE PASSIVEOBJECT] [INDEX]` | 主目标 `actionobject/` 命中 1543。 | `[INDEX]` 走 `passiveobject/passiveobject.lst`。 |
| `[SUMMON MONSTER] [INDEX]` | 主目标 `actionobject/` 命中 241。 | `[INDEX]` 走 `monster/monster.lst`。 |
| `[SUMMON APC] [INDEX]` | 主目标 `actionobject/` 命中 13。 | `[INDEX]` 走 `aicharacter/aicharacter.lst`。 |
| `[DESTROY]` | 行为样本可见。 | 不证明销毁包发送、任务计数或资源释放成功。 |

## 地图放置入口

| 块 | 主目标观察 | 边界 |
| --- | ---: | --- |
| `.map [passive object]` | `map/` 中命中 2817 个文件。 | 块内首列对象 ID 走 `passiveobject/passiveobject.lst`。 |
| `.map [special passive object]` | 样本可与 `[passive object]` 同图出现。 | 仍需按块结构和上下文读列，不按数字外形猜 registry。 |
| `dungeon/` 中 `[passive object]` | 当前搜索为 0。 | 不代表 dungeon 永远不能间接引用对象；只说明当前主目标搜索结果。 |

## 辅助对照提示

辅助对照 PVF 的同类对象规模明显更大，并且 `mapobject/` 中有少量 `[CREATE PASSIVEOBJECT]` 命中。该差异只说明另一个目标集的对象家族发生扩张，不说明主目标缺失、不说明主目标也支持同字段，也不授权迁移字段。
