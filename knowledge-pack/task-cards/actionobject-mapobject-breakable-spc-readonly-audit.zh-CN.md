# ActionObject / MapObject / BreakableObject / SPC Object 只读审计卡

状态：默认可用

用途：作为 `passiveobject/` 下 `ActionObject`、`MapObject`、`BreakableObject`、`SPC` 对象家族的第一层路由。本文只记录主目标 PVF 的静态只读观察和辅助对照差异提示，不授权写 PVF，不证明对象生成、机关触发、攻击命中、伤害、碰撞、门逻辑、AI、客户端资源或服务端放行。

## 快速结论

- 主目标 `passiveobject/passiveobject.lst` 记录 6548 个被动对象注册项；本主线确认 `ActionObject`、`MapObject`、`Character/Common`、`Monster/...` 等路径都可以作为该 registry 下的 registered object。
- 主目标 `passiveobject/` 下 `.obj` 文件 6984 个；其中 `actionobject/` 3953 个，`mapobject/` 1281 个。
- `actionobject/` 更常见 `.obj -> [basic action] .act -> [BASE ANI]/[SUB ANI] .ani`，并可通过 `[attack info]` 连接 `.atk`；当前观察到 `actionobject/` 中 `[CREATE PASSIVEOBJECT]` 1543 命中、`[SUMMON MONSTER]` 241 命中、`[SUMMON APC]` 13 命中。
- `mapobject/` 更常见 `[basic motion]`、`[etc motion]`、`[string data]`、`[int data]` 和直接 ANI/TIL 资源引用；主目标当前 `mapobject/` 中 `[CREATE PASSIVEOBJECT]` 搜索为 0，不能把辅助版本里的少量命中反推回主目标。
- `.map [passive object]` 在主目标 `map/` 中命中 2817 个文件；块内首列对象 ID 必须按 `passiveobject/passiveobject.lst` 解析，不能按数字外形猜成 map、monster 或 npc。
- `.act [CREATE PASSIVEOBJECT] [INDEX]` 走 `passiveobject/passiveobject.lst`；`.act [SUMMON MONSTER] [INDEX]` 走 `monster/monster.lst`；`.act [SUMMON APC] [INDEX]` 走 `aicharacter/aicharacter.lst`。
- 静态只读只能确认字段、路径和 registry 入口存在；不证明对象实际生成、路径门开关、破坏物血量、生效阵营、攻击命中、掉落、音效播放或客户端资源完整。

## 首选阅读顺序

1. `dictionaries/actionobject-mapobject-breakable-spc-fields.zh-CN.md`
2. `indexes/actionobject-mapobject-breakable-spc-boundary.zh-CN.md`
3. `dictionaries/passiveobject-obj-fields.zh-CN.md`
4. `dictionaries/passiveobject-action-fields.zh-CN.md`
5. `indexes/passiveobject-nonmonster-sample-chain.zh-CN.md`
6. `indexes/passiveobject-attackinfo-hitbox-compact-router.zh-CN.md`

## 何时使用

| 问题 | 动作 |
| --- | --- |
| 地图里的 `[passive object]` 数字是什么 | 先按父块确认这是 map 静态放置块，再用 `passiveobject/passiveobject.lst` 解析对象 ID。 |
| `.obj` 写着 `[basic action]` | 按 owner 相对路径读 `.act`，再从 `.act` 追 `.ani`、声音 token、行为块或创建块。 |
| `.obj` 写着 `[basic motion]` 或 `[etc motion]` | 优先按 mapobject 静态动画/多动画入口处理，不要硬解释成 `.act` 行为。 |
| `.act` 里出现 `[CREATE PASSIVEOBJECT]` | `[INDEX]` 走 passiveobject registry；仍不证明实机创建成功或递归安全。 |
| `.act` 里出现 `[SUMMON MONSTER]` / `[SUMMON APC]` | 分别走 monster / aicharacter registry；不能用同一个数字表混解。 |
| 辅助 PVF 有主目标没有的对象字段 | 只写差异提示；回到主目标重新只读核验前，不提升为主目标事实。 |

## 禁止外推

- 不把 `ActionObject`、`MapObject`、`BreakableObject` 或 `SPC` 目录名写成实机分类规则。
- 不把 `.obj/.act/.atk/.ani` 静态链路写成对象必定生成、动作必定播放、攻击必定命中或伤害正确。
- 不把 `[hp max]`、`[hp destroy]`、`[object destroy condition]` 写成破坏物实机血量、掉落、任务计数或机关状态已经生效。
- 不把 `.map [passive object]` 写成地图实机加载成功、坐标正确、门逻辑正常或客户端资源完整。
- 不把辅助对照 PVF 的扩张字段、目录规模或命中数写成主目标 PVF 事实。
