# Monster AI / Action / Attack 跨层边界

状态：默认可用

本文件把已封存的 Monster、Monster AI、Monster Action / Animation、Monster AttackInfo、Monster Created PassiveObject 与 PassiveObject / AttackInfo / Hitbox 账本串成一条总边界。它是纯知识路由，不证明运行效果。

## 资料线索吸收位置

- Monster/Object 资料线索只用于提示 `.mob/.obj/.act/.atk/.ani` 这些文件族和字段名可能相关。
- PassiveObject / AttackInfo / Hitbox 资料线索只用于提示 `.obj -> .act/.atk/.ani` 和 hitbox 分层。
- Dungeon/Map 资料线索只用于提示出生、map/dungeon 入边和资源边界。
- 这些线索不能直接晋级为结论；主目标 PVF 的 registry、文件、字段和块结构才是本文件结论来源。

## 既有账本分工

| 层 | 首选入口 | 作用 |
| --- | --- | --- |
| Monster 本体 | `task-cards/monster-mob-readonly-audit.zh-CN.md`、`dictionaries/monster-fields.zh-CN.md` | 解析 monster ID、读取 `.mob`、分离基础属性、AI、动作、攻击、掉落和资源字段。 |
| AI / 召唤 / 出生 / 掉落 | `task-cards/monster-ai-summon-spawn-drop-readonly-audit.zh-CN.md`、`indexes/monster-entry-link-router.zh-CN.md` | 处理 `.mob -> .ai`、`.ai -> .ai`、`[SUMMON MONSTER]`、map/dungeon 出生和 `.mob` 掉落。 |
| Action / Animation | `task-cards/monster-action-animation-readonly-audit.zh-CN.md`、`dictionaries/monster-action-animation-fields.zh-CN.md` | 处理 `.mob/.act -> .act/.ani`、动作触发、行为块和二进制 ANI 反编译。 |
| Monster AttackInfo | `task-cards/monster-attackinfo-atk-readonly-audit.zh-CN.md`、`dictionaries/attackinfo-atk-fields.zh-CN.md` | 处理 `.mob [attack info] -> .atk` 和攻击 payload 字段。 |
| Created PassiveObject | `task-cards/monster-created-passiveobject-readonly-audit.zh-CN.md` | 处理 monster action 创建 passiveobject 后的 `.obj/.act/.atk/.ani` 递归闭合。 |
| PO / Hitbox 总边界 | `indexes/passiveobject-attackinfo-hitbox-compact-router.zh-CN.md` | 复核 `.obj`、`.atk`、`.ani`、hitbox、生命周期和运行风险。 |

## 主目标只读确认

### Registry

| 数字 | 上下文 registry | 主目标解析结果 | 边界 |
| ---: | --- | --- | --- |
| 64013 | `monster/monster.lst` | 命中 Andres `.mob`，主 registry 条目数为 1945。 | 这是 monster ID，不能按 passiveobject 或其他 registry 解释。 |
| 61347 | `monster/monster.lst` | 命中 Alecto `.mob`。 | 可作为 `[SUMMON MONSTER]` 类怪物 ID 样本；召唤是否成功需实机。 |
| 15058 | `passiveobject/passiveobject.lst` | 命中 `S_L.obj`，主 registry 条目数为 6548。 | 这是 passiveobject ID；raw path 含 Monster 不改变 registry。 |
| 16155 | `passiveobject/passiveobject.lst` | 命中 `AirSword00.obj`。 | 同上，不能按 monster ID 解释。 |
| 8568 | `passiveobject/passiveobject.lst` | 命中 `GuardianGrenadeNoneBomb.obj`。 | 同上。 |

### `.mob` 入口层

| 样本 | 观察到的层 | 结论 |
| --- | --- | --- |
| Andres `.mob` | `[attack action]` 列出多个 action 路径；`[attack info]` 列出多个 `.atk` 路径和空槽；`[ai pattern]` 在多个难度分支下列出 4 个 `.ai`。 | `.mob` 是分流入口，不是攻击、AI 或 hitbox 的最终语义层。 |
| Alecto `.mob` | 攻击动作列表中多槽有 action，攻击信息列表中仅部分槽有 `.atk`；仍有标准 AI 分支。 | action 槽和 `.atk` 槽可不同步；空槽不能直接解释为无攻击或无行为。 |

### `.ai` 决策层

| 样本 | 观察到的结构 | 结论 |
| --- | --- | --- |
| Andres `Action.ai` | `number of in attack area()` 可带 `passive object` 和 ID 参数；`is the skill in cooltime()` 后通过 `[return]` 返回 `1`、`6` 或 `-1`。 | AI 可以读取对象/冷却并返回动作选择线索，但静态只读不证明实际选择、时序或目标优先级。 |

### `.act` 行为层

| 样本 | 观察到的结构 | 结论 |
| --- | --- | --- |
| Andres `Attack_0.act` | `[MOTION]` 挂 `BASE ANI` 和 `SUB ANI`；两个 `[TRIGGER]` 在不同帧执行行为；两个 `[BEHAVIOR]` 创建 passiveobject ID 15058。 | action 是动画、触发和对象创建的连接层。 |
| `S_L.act` | `[MOTION]` 挂 `eye_eff1.ani`；多帧触发 `[ATTACKRECT] [RESET]`。 | action 行为可影响攻击矩形或动作状态，但不替代 `.atk` 或 `.ani`。 |
| `AirSword_start.act` | 多帧触发 `[ATTACKRECT] [RESET]`，末段 `[SET ACTION] [CUSTOM] 0 [NOW]`。 | action 可控制攻击矩形刷新和动作切换；实际刷新/切换时序需实机验证。 |

### `.obj` 下游层

| 样本 | 观察到的结构 | 结论 |
| --- | --- | --- |
| `S_L.obj` | 挂 `Action/S_L.act`、`AttackInfo/S_L.atk` 和 time limit 销毁条件。 | `.obj` 下游路径必须按字段值和 owner 目录拼接；直接猜同名 `S_L.act` 会断链。 |
| `AirSword00.obj` | 挂 `AirSword_start.act`、`AirSword_stay.act`、`AirSword.atk` 和 time limit 销毁条件。 | 对象可同时拥有动作、攻击信息和生命周期字段。 |
| `GuardianGrenadeNoneBomb.obj` | 挂 `GranadeExplosion.act`、`GuardianGrenadeExplosion.atk`、team 和 string data。 | 对象字段能连接声音/队伍/攻击信息，但不证明实机阵营或音效播放。 |

### `.atk` payload 层

| 样本 | 观察到的字段 | 结论 |
| --- | --- | --- |
| Andres `Attack_0.atk` | absolute damage、damage bonus、physic、no element、damage reaction、push aside、lift up、hit wav、attack direction、hit info。 | `.atk` 记录攻击 payload，不提供帧级坐标。 |
| `S_L.atk` | damage bonus、physic、weapon damage apply、attack enemy、no element、damage reaction、lift up、push aside、hit wav、attack direction、hit info。 | `.atk` 可以属于 passiveobject 下游；仍需 owner action 和 ANI 判断范围。 |
| `AirSword.atk` | absolute damage、physic、weapon damage apply、attack enemy、dark element、damage reaction none、hit horizontal、cut、blood。 | 元素和反应字段存在不证明最终伤害、异常或 PVP 规则。 |

### `.ani` hitbox 层

| 样本 | 观察到的帧级字段 | 结论 |
| --- | --- | --- |
| Andres `Attack_0_0.ani` | 多帧观察到 `[DAMAGE TYPE] SUPERARMOR` 和 `[DAMAGE BOX]` 六数值列。 | DAMAGE BOX 是帧级盒字段，不等于攻击输出。 |
| `eye_eff1.ani` | 多帧观察到 `[ATTACK BOX]` 六数值列。 | ATTACK BOX 提供帧级攻击盒入口，但伤害仍要结合 `.atk` 和 action。 |
| `Airsword00.ani` | 多帧观察到同形 `[ATTACK BOX]`。 | 攻击盒归属于 owner action 挂接的 ANI，不能从相邻 ANI 继承。 |
| `GrenadeNoneBomb.ani` | 多帧观察到一至两条 `[ATTACK BOX]`；后段帧无盒字段。 | 同一 ANI 内不同帧也可能有盒/无盒差异。 |

## 辅助对照提示

| 项 | 辅助对照观察 | 处理 |
| --- | --- | --- |
| registry 规模 | 同一 monster ID 与 passiveobject ID 可命中同类路径，但 monster registry 和 passiveobject registry 条目数更大，行号不同。 | 只提示版本差异，不覆盖主目标 registry 事实。 |
| Andres `.mob` | 同路径可读；部分名称文本形态、空音效字段、抗性和重量数值与主目标不同。 | 只提示差异，主目标字段值以主目标为准。 |
| `AirSword00.obj` | 核心动作、攻击信息和销毁结构同形；名称文本形态与主目标不同。 | 只提示差异，不提升为主目标事实。 |
| `Attack_0.act` / `S_L.obj` | 核心创建和对象结构同形。 | 可作为差异提示，不证明运行效果。 |

## 总边界

- `.mob` 定位怪物入口；`.ai` 决定结构化选择；`.act` 承接动作、触发和创建；`.obj` 承接对象生命周期；`.atk` 承接攻击 payload；`.ani` 承接帧级盒字段。
- 任意一层存在都不能替代其他层。
- 数字 ID 必须按父块和上下文选择正确 registry。
- 路径必须按 owner-relative 规则解析；相邻同名文件和其他目录同名文件不能补猜。
- 静态只读不证明 AI 正常、怪物刷出、召唤成功、对象销毁、命中、伤害、卡肉、击退、浮空、掉率、客户端资源完整或服务端放行。

## 可封存结论

本主线作为跨层总边界封存后，日常 Monster 行为或攻击问题默认先读本文件，再按命中层跳转到对应细分 task-card。除非出现未覆盖字段、断链或 registry 缺口，不默认重开 Monster、PassiveObject、AttackInfo 或 Hitbox 大范围采样。
