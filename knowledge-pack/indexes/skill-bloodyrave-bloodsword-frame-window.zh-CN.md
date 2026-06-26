# BloodyRave -> BloodSword 动作/帧窗口只读账本

状态：默认可用

用途：记录当前主目标 PVF 中 `BloodyRave` 派生 `BloodSword` 的动作、帧、state/substate 只读闭合。本文只证明静态入口链和动作帧结构可读，不证明命中、伤害、手感、同步或 PVP 表现。

## 链路摘要

```text
skill/swordmanskill.lst
-> 79 BloodyRave / skill/swordman/bloodyrave.skl
-> 103 BloodSword / skill/swordman/bloodsword.skl
-> sqr/character/swordman_load_state.nut
-> sqr/character/swordman/passive_skill_swordman.nut
-> sqr/character/swordman/appendage/ap_qf_bloodyrave_bloodsword.nut
-> state 43 + frame >= 4
-> state 60 + substate [102]
```

## 当前主目标已确认

| 项 | 只读结论 | 边界 |
| --- | --- | --- |
| 源技能 | `skill/swordmanskill.lst` 中 `79 -> Swordman/BloodyRave.skl` | 只证明技能 ID 路由。 |
| 目标技能 | `skill/swordmanskill.lst` 中 `103 -> Swordman/BloodSword.skl` | 只证明技能 ID 路由。 |
| 入口脚本 | `sqr/character/swordman_load_state.nut` 推入 `passive_skill_swordman.nut` 和公共函数脚本 | 证明脚本链存在，不证明实机稳定性。 |
| appendage 挂载 | `passive_skill_swordman.nut` 追加 `ap_qf_bloodyrave_bloodsword.nut` | 只说明当前主目标中有挂载逻辑。 |
| 触发条件 | appendage proc 判断 `obj.sq_GetState() == 43`，再取当前动画帧，`frame >= 4` 后尝试目标技能 | 这是 state + frame 级窗口，不是动作级窗口。 |
| 目标 state | `sq_IntVectPush(102)` 后 `sq_AddSetStatePacket(60, STATE_PRIORITY_USER, true)` | `60/[102]` 只对本 BloodSword 链有当前目标证据。 |

## 动作索引

`character/swordman/swordman.chr` 的 `[etc motion]` 为 0 基序号时，本链相关动作如下：

| 动作 | index | 用途 |
| --- | ---: | --- |
| `Animation/BloodyRaveInhale.ani` | 63 | 吸附段候选动作。 |
| `Animation/BloodyRaveSlash.ani` | 64 | 砍杀段候选动作。 |
| `Animation/BloodSwordMake.ani` | 103 | BloodSword 生成/前摇动作。 |
| `Animation/BloodSwordCharge.ani` | 104 | BloodSword 突刺/攻击动作。 |

当前 appendage 没有判断 `isCurrentCutomAniIndex(63/64)`，所以它不能区分“只允许吸附段”或“只允许砍杀段”。

## 源动作帧结构

| 动作 | 帧数 | 关键观察 |
| --- | ---: | --- |
| `BloodyRaveInhale.ani` | 10 | `FRAME004` 之后仍处于吸附动作；`FRAME009` 出现多段 `[ATTACK BOX]`。 |
| `BloodyRaveSlash.ani` | 6 | `FRAME004` 有 `[SET FLAG] 65534`；`FRAME005` delay 为 400。 |

解释：

- 当前脚本的 `frame >= 4` 会覆盖吸附动作后半段，也会覆盖砍杀动作后半段。
- 若目标是“吸附中也能派生”，当前窗口与动作结构相容。
- 若目标是“只在砍杀后摇派生”，需要增加动作级条件 `isCurrentCutomAniIndex(64)` 或等价判断。
- 若目标是“只在吸附段派生”，需要增加动作级条件 `isCurrentCutomAniIndex(63)` 或等价判断。

## 目标动作帧结构

| 动作 | 帧数 | 关键观察 |
| --- | ---: | --- |
| `BloodSwordMake.ani` | 18 | `FRAME008` 播放 `BLOODSWORD_READY`；整体更像生成/准备动作。 |
| `BloodSwordCharge.ani` | 17 | `FRAME005` 有 `[SET FLAG] 1`；`FRAME006` 起出现 `[ATTACK BOX]`，并播放 `BLOODSWORD` 音效。 |

解释：

- 当前只读能说明 BloodSword 目标动作存在准备段和突刺攻击段。
- `state 60 / substate [102]` 到底从哪个动作段进入，仍以目标 NUT、引擎行为和实机为准。

## 可复用判断

| 需求 | 只读建议 |
| --- | --- |
| 保留宽窗口派生 | 可继续用 `state 43 + frame >= 4` 作为当前目标链的已观察脚本条件。 |
| 收窄到吸附段 | 加动作 index 63 条件，再做实机验证。 |
| 收窄到砍杀后摇 | 加动作 index 64 条件，再做实机验证。 |
| 改其他技能派生 BloodSword | 重新解析源技能 state、源动作、目标 state/substate；不能复用 `43`。 |
| BloodSword 派生到其他技能 | 重新解析目标技能 state/substate；不能复用 `[102]`。 |

## 风险边界

- `.ani` 只读不能证明真实手感、输入缓冲、技能冷却、伤害或同步。
- `[ATTACK BOX]` 的存在只证明动画文件内有攻击盒标签，不证明实机命中。
- `[SET FLAG]` 只证明帧标记存在；脚本是否监听该 flag 要另查 NUT。
- 动作 index 来自当前 `.chr [etc motion]` 顺序，跨职业、跨客户端、跨 PVF 不能复用。

