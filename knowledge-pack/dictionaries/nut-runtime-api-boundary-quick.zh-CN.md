# NUT Runtime API 快速入口

状态：默认可用

用途：作为 NUT / state / skill runtime 问题的轻量入口。默认先读本文；只有要确认某个具体 API、回调参数或脚本写法时，再打开完整词典 `dictionaries/nut-runtime-api-boundary.zh-CN.md`。

## 总规则

- API 名称先用 TypeSquirrel 查；没有候选时不要猜函数名。
- 函数存在不等于当前脚本入口会运行；必须确认 `load_state`、职业入口或已加载脚本把它推入。
- 函数签名只能说明调用形状，不能证明伤害、命中、同步、PVP、UI、读条、冷却或资源显示。
- 数字参数必须回到目标 PVF 的 `.lst`、`.skl [static data]`、state 包、substate 分支或同脚本上下文解释。
- 涉及客户端视觉、音效、图标、动画资源时，Script 引用不证明 ImagePacks2/NPK 完整。

## 读法

| 需求 | 默认先读 | 何时打开完整词典 |
| --- | --- | --- |
| 入口注册、pushScriptFiles、pushState、pushPassiveObj | 本文 + `indexes/skill-state-nut-runtime-api-group-boundary.zh-CN.md` | 要核具体 API 形状或参数时 |
| 技能使用、切 state、substate、冷却、读 level data | 本文 + 目标技能链索引 | 要确认某个 `sq_*` / `IRDSQRCharacter.*` API 时 |
| 动作帧、读条、动画层、坐标移动 | 本文 + 目标 `.chr/.ani/.skl` 闭合 | 要确认具体动画/帧 API 时 |
| Appendage、buff、active status、对象查找 | 本文 + 目标 appendage / skill 链 | 要确认 appendage 生命周期或对象 API 时 |
| PassiveObject、AttackInfoPacket、动态攻击包 | 本文 + PassiveObject compact router | 要确认 `sq_SendCreatePassiveObjectPacket`、attack packet、回调参数时 |
| 回调参数、`onSetState_*`、`onProc_*`、`onAttack_*` | 本文 + 目标脚本实际入口 | 要确认回调参数最低含义时 |

## 禁止外推

- 不把教程 helper、社区封装、另一个客户端函数名直接当当前目标 PVF API。
- 不把一个职业或一个技能的 substate、static data index、attack packet 用法扩成全职业规则。
- 不把静态脚本闭合写成实机命中、伤害、冷却 UI 或服务端一致性。
- 不把 NUT 改动列入低风险变更；NUT 任务默认需要目标入口链、API 定义、最小改动、读回和实机验证。

## 深层入口

- 完整 API 词典：`dictionaries/nut-runtime-api-boundary.zh-CN.md`
- API 组边界：`indexes/skill-state-nut-runtime-api-group-boundary.zh-CN.md`
- 高覆盖矩阵：`indexes/skill-state-nut-runtime-high-coverage-matrix.zh-CN.md`
- 边界审计：`indexes/skill-state-nut-runtime-boundary-audit.zh-CN.md`

