# Skill / State / NUT Runtime Boundary 高覆盖矩阵

状态：默认可用

用途：把 Skill / State / NUT Runtime Boundary 主线从逐技能深拆，切换为高覆盖入口矩阵和模式分桶。本文只记录当前主目标 PVF 只读可见的入口、注册形态、代表样本和缺口，不证明实战命中、伤害、控制、同步、PVP 或客户端资源完整性。

## 高覆盖完成定义

本主线的 100% 完成不是“拆完每一个技能”，而是满足以下验收项：

| 验收项 | 完成口径 | 当前状态 |
| --- | --- | --- |
| load_state 全入口矩阵 | `sqr/character/` 下全部 `*_load_state.nut` 已列入矩阵，并区分脚本推入、state 注册、passiveobject 注册和 API 族。 | 已完成第一版：12/12。 |
| 入口 API 族分型 | 区分 `IRDSQRCharacter`、`CNAvenger`、公共循环 state、script-only 技能库、被动脚本入口。 | 已完成第一版。 |
| 模式代表样本 | 每个运行模式只抽 1 到 2 个主目标样本核验，不逐技能穷举。 | AT Mage、Avenger、CreatorMage、Common Burster、非 Swordman 被动入口和 Priest light state 已补代表。 |
| registry 父块规则 | `pushPassiveObj` 的数字只按 `passiveobject/passiveobject.lst` 解析，skill、monster、APC 不混用。 | 已建立规则；跨职业样本仍需补最小确认。 |
| NUT API 边界字典 | API 按 state 控制、对象创建、appendage、aura、timer、particle、attack packet、movement 分组。 | 已完成 API 分组视图：`indexes/skill-state-nut-runtime-api-group-boundary.zh-CN.md`。 |
| Workbench 闭环 | 新结论写入索引/字典/路由，刷新 MANIFEST，检查脚本通过，PVF 会话关闭。 | 已完成最终检查并封存。 |

## load_state 入口矩阵

当前主目标只读确认 `sqr/character/` 下 12 个 load_state 入口。

| 入口 | API 族 | 脚本推入调用点 | state 注册调用点 | passiveobject 注册调用点 | 高覆盖判断 |
| --- | --- | ---: | ---: | ---: | --- |
| `common_load_state.nut` | `IRDSQRCharacter` 公共循环 | 1 | 1 个循环调用点 | 0 | 全 job 通用 `Burster` state 模式；需一个公共 state 代表样本。 |
| `atfighter_load_state.nut` | `IRDSQRCharacter` script-only | 1 | 0 | 0 | 只推入被动脚本；已由 Gunner 代表样本覆盖同类入口，不逐技能展开。 |
| `atgunner_load_state.nut` | `IRDSQRCharacter` script-only | 1 | 0 | 0 | 同上，不逐技能展开。 |
| `fighter_load_state.nut` | `IRDSQRCharacter` script-only/common | 3 | 0 | 0 | 推入被动、common、header；适合做公共函数/被动入口代表。 |
| `gunner_load_state.nut` | `IRDSQRCharacter` script-only | 1 | 0 | 0 | 已补 Gunner comminterrupt 代表样本。 |
| `mage_load_state.nut` | `IRDSQRCharacter` script-only | 1 | 0 | 0 | 只推入被动脚本；已由 Gunner 代表样本覆盖同类入口，不逐技能展开。 |
| `swordman_load_state.nut` | `IRDSQRCharacter` script-only/custom common | 2 | 0 | 0 | 已有 Swordman 派生/comminterrupt 样本，可作为 script-only 加载后的回调样本。 |
| `thief_load_state.nut` | `IRDSQRCharacter` script-only | 1 | 0 | 0 | 只推入被动脚本；后续不逐技能展开。 |
| `priest_load_state.nut` | `IRDSQRCharacter` light state | 2 | 1 | 0 | 已补 `ReleaseBuffs` 轻 state 代表样本：skill 222 初始化 buff 队列，公共 proc 逐步发 state 13 参数包。 |
| `creatormage_load_state.nut` | `IRDSQRCharacter` hybrid/mouse-control | 12 | 8 | 4 | Creator 是 script-file 技能库 + 鼠标控制 + 少量 state/PO 的混合模式；需代表样本。 |
| `avenger_load_state.nut` | `CNAvenger` 专用族 | 3 | 15 | 11 | API 签名不同于 `IRDSQRCharacter`；需代表样本，不能套 AT Mage。 |
| `atmage_load_state.nut` | `IRDSQRCharacter` heavy state/PO | 4 | 43 | 89 | 已有深样本足够支撑模式分类；后续默认不逐技能继续深拆。 |

统计口径：以上为当前 load_state 中直接可见的调用点。`common_load_state.nut` 的 state 是循环调用点，运行时覆盖所有 job；`atmage_load_state.nut` 中存在重复注册调用点，矩阵按调用点记录，不把重复显示名当语义依据。

## 模式分桶

| 模式桶 | 代表入口 | 已有代表样本 | 缺口处理 |
| --- | --- | --- | --- |
| A. 重型 `IRDSQRCharacter` state + PO | `atmage_load_state.nut` | 已有 WindStrike、WaterCannon、MagicCannon、ChainLightning、LightningWall、FireRoad、IceSword、FlameCircle、BlueDragonWill、FrozenLand、HolongLight、PieceOfIce 等样本。 | 够用；停止默认逐技能深拆。 |
| B. `IRDSQRCharacter` state + appendage / buff / throw | `atmage_load_state.nut`、`swordman_load_state.nut` | 已有 ElementalChange、MagicShield、ManaBurst、Teleport、Swordman comminterrupt。 | 够用；只在新 API 类别出现时补最小样本。 |
| C. `CNAvenger` state + PO 专用族 | `avenger_load_state.nut` | 已补 `Spincutter` 代表样本：`CNAvenger.pushState`、`CNAvenger.pushPassiveObj`、`24101` 初段 PO 与 `24100` 召回/多段 PO；已补 `PowerOfDarkness` 代表样本：`STATE_POWER_OF_DARKNESS = 71`、`SKILL_POWER_OF_DARKNESS = 125`、`24107/24108`、appendage、time event 和全局 PO 创建。 | Avenger 高覆盖代表已够用；后续只引用，不展开 Avenger 全技能。 |
| D. Creator hybrid / mouse-control | `creatormage_load_state.nut` | 已补 `Mgrab` script-file/mouse-control 样本和 `WindPress` state+PO 样本；闭合 `skill/creatormage.lst` 与 `24355` PO registry。 | CreatorMage 高覆盖代表已够用；后续只引用，不逐技能扩样。 |
| E. 公共循环 state | `common_load_state.nut` | 已补 `Burster` 公共循环 state 样本：`STATE_BURSTER = 100`、`SKILL_BURSTER = 198`、全 job loop `pushState`、appendage、禁用技能 static data 和冷却/倍率钩子。 | Common 高覆盖代表已够用；后续只引用，不逐职业扩样。 |
| F. script-only 被动入口 | `atfighter`、`atgunner`、`fighter`、`gunner`、`mage`、`swordman`、`thief` | Swordman 已有回调样本；已补 `Gunner` 非 Swordman 样本：`gunner_load_state.nut` 只推入被动脚本，`ProcPassiveSkill_Gunner` 按 `skill 254` 追加 comminterrupt appendage，appendage proc 再尝试命令开放和 state packet。 | script-only 被动入口代表已够用；后续只引用，不逐职业扩样。 |
| G. light state 入口 | `priest_load_state.nut` | 已补 `ReleaseBuffs` 代表样本：`skill/priestskill.lst -> ReleaseBuffs.skl`、`checkExecutableSkill_ReleaseBuffs`、`initUseBuffSkills`、`procAppend_Priest -> useBuffSkills`、state 13 参数包。 | Priest light state 代表已够用；后续只引用，不展开 Priest 全技能。 |

## 当前高覆盖进度

| 层级 | 说明 | 进度判断 |
| --- | --- | --- |
| 流程层 | 只读 PVF、Workbench 写入、MANIFEST、检查、关闭会话。 | 100%。 |
| 入口矩阵层 | 12 个 load_state 入口和 API 族已形成第一版矩阵。 | 约 80%。 |
| 模式样本层 | AT Mage、Swordman、Avenger、CreatorMage、Common、Gunner passive 和 Priest ReleaseBuffs 已有代表。 | 100%。 |
| API 边界层 | 已有 API 字典与 API 分组验收索引；按入口、技能使用、state 参数、appendage、PO、AttackInfo、对象/场景、timer/冷却、移动/输入、视觉/粒子和弱定义 helper 收口。 | 100%。 |
| 跨职业泛化层 | 已补 Avenger、CreatorMage、Common、非 Swordman 被动入口和 Priest light state；后续默认不继续抽技能。 | 100%。 |

综合估算：本主线按高覆盖口径 100%。这不是“逐技能穷举 100%”，而是入口矩阵、模式桶、registry 规则、API 分组和 Workbench 检查闭环达到当前验收定义。

## 下一步只读优先级

1. 默认不再重采 AT Mage、Avenger、CreatorMage、Common、script-only 被动或 Priest 技能。
2. 若用户问运行效果，直接转运行测试、目标 PVF 实验或客户端资源链检查。
3. 若用户问静态边界，先读 `indexes/skill-state-nut-runtime-api-group-boundary.zh-CN.md` 和 `dictionaries/nut-runtime-api-boundary.zh-CN.md`。

## 禁止误用

- 不能把本矩阵当成技能效果证明。
- 不能把调用点数量当成“技能强弱”或“运行次数”。
- 不能因为 AT Mage 样本多，就继续逐技能补全 AT Mage。
- 不能把 `CNAvenger.pushState` 写成 `IRDSQRCharacter.pushState` 同形参数。
- 不能把 script-only 入口写成没有技能逻辑；它只说明 load_state 没有直接注册 state。
