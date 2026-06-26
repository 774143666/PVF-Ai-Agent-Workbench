# OutRageBreak state 45/[0,1] 只读边界账本

状态：默认可用

用途：记录当前主目标中 `OutRageBreak` 的技能注册、追加脚本入口、`state 45 / substate [0,1]` 参数来源，以及动作帧静态边界。本文只证明静态脚本和动作文件可读，不证明实战命中、伤害、输入手感、同步、PVP 表现或客户端资源完整性。

## 链路摘要

```text
skill/swordmanskill.lst
-> 81 OutRageBreak / skill/swordman/outragebreak.skl
-> sqr/character/swordman/passive_skill_swordman.nut
-> skill 254 swordman_comminterrupt 学到后追加 ap_swordman_comminterrupt.nut
-> growtype case 3
-> skill 76 Frenzy 进入检查切换 STATE_FFRENZY
-> STATE_FFRENZY 为真时 SetSkillState(obj, 81, 45, [0,1])
```

## 当前主目标已确认

| 项 | 只读结论 | 边界 |
| --- | --- | --- |
| 技能注册 | `skill/swordmanskill.lst` 中 `81 -> Swordman/OutRageBreak.skl` | 只证明技能 ID 路由。 |
| 技能类型 | `Outrage Break` 是主动技能；技能说明写明只能在 `Frenzy` 已施放状态下使用 | 说明文本不是实机状态机证明。 |
| 中断被动 | `254 -> swordman/swordman_comminterrupt.skl`，类型为被动 | 是否实际学到、等级是否大于 0，要看角色/技能配置。 |
| Frenzy 门控 | `76 -> Swordman/Frenzy.skl`，名称为 `血之狂暴 / Frenzy` | 脚本用 `sq_IsEnterSkill(76)` 切换 `STATE_FFRENZY`，但静态只读不能证明它等价于所有实战 buff 生命周期。 |
| 追加入口 | `passive_skill_swordman.nut` 只在 `skill_index == 254` 且 `skill_level > 0` 时追加 `ap_swordman_comminterrupt.nut` | 这不是常驻普通攻击入口。 |
| 状态参数 | `ap_swordman_comminterrupt.nut` 的 growtype case 3 中，`STATE_FFRENZY` 为真时执行 `SetSkillState(obj,81,45,[0,1])` | 只证明当前脚本参数存在；不能证明一定能在任意动作中触发。 |
| 未安装入口 | 当前主目标未找到 `ap_qf_basicattack_outragebreak` 文件名 | 不能把该名称当作当前主目标事实。 |

## 动作索引

`character/swordman/swordman.chr` 的 `[etc motion]` 为 0 基序号时，本链相关动作如下：

| 动作 | index | 用途 |
| --- | ---: | --- |
| `Animation/OutRageBreakReady.ani` | 66 | 前摇/准备动作。 |
| `Animation/OutRageBreakSlash.ani` | 67 | 下砸/攻击动作。 |

## 动作帧结构

| 动作 | 帧数 | 关键观察 |
| --- | ---: | --- |
| `OutRageBreakReady.ani` | 1 | `FRAME000` delay 为 560。 |
| `OutRageBreakSlash.ani` | 9 | `FRAME005`、`FRAME006`、`FRAME007` 有 `[ATTACK BOX]`；`FRAME008` delay 为 1200。 |

解释：

- `45/[0,1]` 是当前追加脚本传给技能状态机的目标参数，不是动作 index。
- 动作 index `66/67` 来自 `.chr [etc motion]` 顺序，用于理解状态进入后的动作分段。
- `[ATTACK BOX]` 只说明 ani 文件存在攻击盒标签，不能证明实战命中、伤害或浮空。

## 可复用判断

| 需求 | 只读建议 |
| --- | --- |
| 判断当前主目标是否已有 `OutRageBreak 45/[0,1]` 参数 | 可引用本账本：当前参数来源是 `ap_swordman_comminterrupt.nut`。 |
| 判断是否已有普通攻击强制 `OutRageBreak` | 不能引用本账本直接证明；当前未找到对应普通攻击入口文件名。 |
| 判断是否必须处于 Frenzy | 当前技能说明和追加脚本均指向 Frenzy 门控，但实际 buff 生命周期仍需运行测试。 |
| 修改为其他技能派生 | 必须重新解析目标技能 registry、state/substate 和动作表；不能复用 `45/[0,1]`。 |
| 收窄动作窗口 | 需要额外引入动作 index 或帧判断，并做实机验证。 |

## 风险边界

- 静态只读不能证明输入缓冲、技能冷却、HP 消耗、打断优先级或网络同步。
- `EnableSoften` 只先启用技能指令；真正状态切换来自 `SetSkillState` 内的 `sq_IsUseSkill` 与 `sq_AddSetStatePacket`。
- `STATE_FFRENZY` 是脚本变量；它是否在所有进入、退出、死亡、换图、重连场景下稳定，必须实机测。
- 任何普通攻击强制方案如果要成立，必须先在当前主目标中出现明确入口或通过受控实验写入后再验证。

## 下一步验收

1. 只读层：继续核 `skill 254` 的学习来源、可见性和是否会在目标角色构建中达到 `skill_level > 0`。
2. 运行层：用当前主目标不改包测试 Frenzy 开关、体术逆改学习状态、OutRageBreak 指令和冷却关系。
3. 实验层：若要验证普通攻击强制，需要另开受控实验 PVF，不能在当前只读结论里预设成立。
