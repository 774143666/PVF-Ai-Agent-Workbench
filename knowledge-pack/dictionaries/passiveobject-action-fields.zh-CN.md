# PassiveObject .act 字段词典

状态：需验证

本文记录主目标 PVF 只读观察到的 passiveobject `.act` 结构入口。`.act` 可承载动作、动画、声音、触发器、行为、对象创建、怪物召唤和状态变量操作。字段存在不等于运行条件、目标选择、伤害、同步或表现已经验证。

## Motion 与资源

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[MOTION] ... [/MOTION]` | 闭合块。 | 必须读到结束标签。 |
| `[BASE ANI]` | 一个相对 `.ani` 路径。 | 继续反编译二进制 ANI；hitbox 不在 `.act` 层直接判断。 |
| `[SUB ANI] ... [/SUB ANI]` | 附加 ANI 路径和参数列表；也可为空闭合块。 | 不要假设每个 SUB ANI 都有 hitbox；空块只证明无附加 ANI 列表。 |
| `[SUB ANI WITH XYZ] ... [/SUB ANI WITH XYZ]` | 附加 ANI 路径后接坐标/参数列表。 | 只证明附加 ANI 可带 XYZ 参数；是否有 hitbox 仍需逐个反编译 ANI。 |
| `[SOUND] ... [/SOUND]` | 声音 token 与数值参数。 | 只证明声音引用，不证明客户端资源完整。 |

## Trigger 与 Behavior

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[TRIGGER] ... [/TRIGGER]` | 闭合块，内部可含帧、距离、检查对象、伤害事件、动作事件等。 | 触发时序需运行验证。 |
| `[BEHAVIOR] ... [/BEHAVIOR]` | 闭合块，内部可含创建、销毁、召唤、变量、粒子、动作切换等。 | 多个行为块可并列出现。 |
| `[FRAME]` | 常见为两个数值。 | 不直接证明帧触发成功。 |
| `[LIMIT]` | 一个数值。 | 不直接证明运行次数。 |
| `[DO BEHAVIOR]` | 后接对象范围和行为索引。 | 行为索引需结合当前 `.act` 内行为块顺序。 |
| `[DELAY DO BEHAVIOR]` | 后接对象范围、行为索引和延迟数值。 | 只证明延迟执行行为结构存在，不解释实机计时或触发成功。 |
| `[ON DAMAGE]` | 空标签或事件入口。 | 只证明伤害事件触发入口。 |
| `[ON ATTACKSUCCESS]` | 空标签或事件入口。 | 只证明攻击成功事件触发入口，不证明命中结算已经发生。 |
| `[ON SET ACTION]` | 空标签或事件入口。 | 只证明动作切换事件入口。 |
| `[LAST ATTACKSUCCESS]` | 后接一个数值。 | 位于攻击成功触发链中；具体目标语义需运行验证。 |
| `[LAST ATTACKER]` | 目标范围 token。 | 位于受击触发链中；不单独证明敌我判定。 |
| `[CHARACTER]` | `[WHICH]` 下的对象范围 token。 | 只证明可按角色对象做检查，不证明实际玩家/怪物筛选结果。 |
| `[CHECK PARTYMEMBERS STATE]` | 闭合式检查入口，后续可见 `[EVEN ONE DEATH]` 或 `[ALL DEATH]`。 | 只证明队伍状态检查结构存在，不解释实机队伍判定。 |
| `[IS TEAM] ... [/IS TEAM]` | 闭合检查块，样本可见 `[MONSTER TEAM]`、`[CHARCTER TEAM]`。 | token 按 PVF 原样保留；队伍判定需运行验证。 |
| `[CHECKED NO]` | 检查结果条件入口，样本可接 `[>]` 或 `[<]` 与数值。 | 只证明条件结构存在。 |
| `[AI CHARACTER]` | `[WHICH]` 下的对象范围 token。 | 后续 `[IS INDEX]` 不按 passiveobject 创建 ID 解释。 |
| `[ALL CHARACTER TEAM]` | `[WHICH]` 下的对象范围 token。 | 只证明可按全角色队伍做检查，不证明运行筛选结果。 |
| `[ALL MONSTER TEAM]` | `[WHICH]` 下的对象范围 token。 | 只证明可按全怪物队伍做检查；后续 `[IS OBJECT TYPE] [AI CHARACTER]` 仍是检查结构。 |
| `[ALL ENEMY]` | `[WHICH]` 下的对象范围 token，辅助对照样本中可见。 | 主目标是否使用该 token 仍需目标文件逐项复核。 |
| `[CHECK DISTANCE]` | 两个数值。 | 只证明距离检查结构存在，不证明实机距离坐标系。 |
| `[RANDOM CHECK]` | 两个数值。 | 随机判定概率或周期需运行验证。 |
| `[ZPOS]` + `[<=]` | Z 坐标条件和值。 | 只证明触发检查结构存在，不证明实际落地判定。 |
| `[GET TARGET]` | 可接数值，样本后续可见 `[DISTANCE] [LOW]`。 | 只证明可取目标并按距离排序，不证明运行选中对象。 |
| `[DISTANCE] [LOW]` | 目标选择中的距离排序 token。 | 只记录排序入口，不解释距离公式。 |
| `[CHECKUP OBJECT]` | 后接行为索引。 | 只证明检查对象上下文可触发行为，不解释目标对象生命周期。 |
| `[SAVE TARGET OBJECT]` | 后接一个数值。 | 只证明可保存目标对象引用，不证明运行目标一定存在或后续命中成功。 |
| `[SET SPEED] ... [/SET SPEED]` | 闭合块，内部可见 `[X AXIS]`、`[Y AXIS]` 或 `[Z AXIS]`；数值也可接 `[RANDOM]`。 | 只记录速度设置结构，不解释实际运动公式。 |
| `[SET POS FORCE] ... [/SET POS FORCE]` | 闭合块，内部可见 `[X START]`、`[Y START]`、`[Z START]`、`[MOVE ME]`。 | 只证明强制位置/移动样结构存在，不解释坐标系或位移公式。 |
| `[X START]`、`[Y START]`、`[Z START]` | 每个标签后接一个数值。 | 当前样本位于 `[SET POS FORCE]` 内；坐标含义需运行验证。 |
| `[MOVE ME]` | 空标签，样本位于 `[SET POS FORCE]` 内。 | 只证明位置强制块可指向自身移动，不解释运行效果。 |
| `[SET TEAM]` | 一个数值。 | 只证明 action 可设置队伍数值；不等同最终敌我伤害规则。 |
| `[SET COLOR]` | 三个数值。 | 只证明可设置颜色样参数，不解释客户端表现或渐变时序。 |
| `[SET ACTION]` | 闭合块，样本可见 `[CUSTOM]`、`[NOW]`。 | 只证明动作切换结构存在，不解释运行时切换成功率或时序。 |
| `[SET FRAME]` | 一个数值。 | 只证明可设置帧号，不解释动画跳帧的运行效果。 |
| `[RESTORE]` | 闭合块，样本可见 `[HP]` 数值与 `[%]`。 | 只记录恢复/变动结构，不解释实际回血、扣血或百分比公式。 |
| `[PARTICLE]` | 粒子路径和数值参数。 | 只证明行为块可挂粒子引用，不证明客户端资源完整。 |
| `[SHAKING]` | 两个数值。 | 只证明屏幕/对象震动样行为入口，不解释实际震动表现。 |
| `[APPENDAGE] ... [/APPENDAGE]` | 闭合块，样本可见持续时间、`[attack speed]`、`[cast speed]`、`[move speed]`、`[equipment physical defense]`、`[equipment magical defense]` 与 `[%]` 数值。 | 只证明附加状态/属性参数结构存在，不解释实机减速、防御变化或持续公式。 |
| `[APPEND HIT]` | 三个数值。 | 只证明追加命中样行为入口，不证明实际命中、受击或伤害发生。 |
| `[FLASH SCREEN]` | 七个数值。 | 只证明闪屏表现参数存在，不证明客户端显示效果。 |
| `[ATTACKRECT] [RESET]` | 行为块内的空标签组合。 | 只记录攻击矩形重置行为入口；不要当成 ANI hitbox 坐标。 |
| `[ENABLE]` + `[OFF]` | 触发块内的开关样结构。 | 只证明触发器可配置为关闭，不解释何时启用或运行时状态。 |
| `[TRIGGER]` + 数值 + `[ON]` / `[OFF]` | 行为块内可见触发器编号开关。 | 只证明 action 可切换触发器状态，不解释运行时开关时序。 |
| `[LOCK QUEST UNTIL]` + `[CHANGE MODULE]` | 行为块内可见任务锁和模块数值。 | 只证明任务/模块行为入口，不解释任务系统运行语义。 |
| `[TRIGGER QUESTEVENT]` | 后接一个数值。 | 只证明任务事件触发入口，不解释任务完成条件。 |
| `[SEND DO BEHAVIOR]` | 后接对象范围和行为索引。 | 只证明可向对象发送行为执行请求，运行时目标和时序需验证。 |

## 创建 PassiveObject

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[CREATE PASSIVEOBJECT] ... [/CREATE PASSIVEOBJECT]` | 闭合块；当前 `passiveobject/` SearchScript 范围内 1653 个创建块均观察到 `[INDEX]`。 | 闭合块内 `[INDEX]` 必须回 `passiveobject/passiveobject.lst` 解析；不要扩写成其他目录或二进制内容的绝对结论。 |
| `[INDEX]` | 在创建块内可为一个 passiveobject ID，也可接 `[RANDOM SELECT]` 候选；还可在其他上下文出现。 | 不能脱离父块解释 registry；创建 ID 未命中 registry 时保留未闭合风险，不得猜目标路径。 |
| `[PARTICLE FILENAME]` | 一个字符串或空字符串。 | 只证明粒子文件名参数，不证明资源完整。 |
| `[LEVEL]` | 一个数值。 | 不直接证明实机等级缩放。 |
| `[POS]` | 可见三个数值；也可见一个数值后接 `[RANDOM]` 位置参数。 | 不直接证明实际坐标或朝向；读取时必须看后续是否进入 `[RANDOM]`。 |
| `[WARNING MARK]` | 四个数值。 | 当前样本位于创建块内，只证明预警标记参数存在，不证明客户端显示效果。 |
| `[RANDOM SELECT] ... [/RANDOM SELECT]` | 多个数值。 | 必须看父块：在 `[DO BEHAVIOR]` 下是行为编号候选；在 `[CREATE PASSIVEOBJECT] [INDEX]` 下是 passiveobject ID 候选；在 `[SUMMON MONSTER] [INDEX]` 下是 monster ID 候选。 |
| `[RANDOM]` | 数值区间或多值参数。 | 在创建块样本中可作为位置随机参数；随机规则需实机验证。 |
| `[USE MY DIRECTION]` | 空标签。 | 只证明创建参数可引用自身朝向，不证明最终朝向。 |
| `[FIX DIRECTION]` | 闭合式方向参数入口，样本可见 `[LEFT]` / `[RIGHT]`。 | 只证明固定方向参数存在，不解释运行朝向。 |
| `[USE MAP POS]` | 空标签。 | 只证明创建位置可按地图坐标解释，实际坐标系需运行验证。 |
| `[USE MY BASEPOS]` | 空标签。 | 只证明创建位置可引用自身基础坐标。 |
| `[USE OBJECT ZPOS]` | 空标签。 | 只证明创建位置可引用对象 Z 坐标。 |
| `[FOLLOWING TARGET]` | 空标签，样本位于创建块内。 | 只证明创建对象可带跟随目标参数，不解释运行追踪、目标存在或命中。 |
| `[CREATE PASSIVEOBJECT CIRCLE]` | 当前 `passiveobject/` SearchScript 范围未观察到。 | 不可写成主目标全局不存在；其他范围观察需单独复核。 |

## AttackInfo 引用

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[DEFAULT ATTACKINFO]` | 一个相对 `.atk` 路径。 | action 内也可指定默认攻击信息；它补充 `.obj [attack info]` 路由，但不提供 hitbox 坐标。 |

## 召唤 Monster

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[SUMMON MONSTER] ... [/SUMMON MONSTER]` | 闭合块，内部可含 `[INDEX]`、`[RANDOM SELECT]`、`[LEVEL]`、`[POS]`、`[NO EFFECT]` 等。 | `[INDEX]` 必须走 `monster/monster.lst`，不走 passiveobject registry。 |
| `[NO EFFECT]` | 召唤块内空标签。 | 只证明效果开关样入口，不证明客户端表现。 |

## 召唤 APC

| 字段 / 块 | 已观察列形 | 边界 |
| --- | --- | --- |
| `[SUMMON APC] ... [/SUMMON APC]` | 闭合行为块；样本内可见 `[INDEX]`、`[LEVEL]`、`[POS]`、`[NO EFFECT]`、`[USE MY DIRECTION]`、`[TEAM]`、`[USE OBJECT ZPOS]`。 | `[INDEX]` 走 `aicharacter/aicharacter.lst`，不走 passiveobject 或 monster registry；召唤时序、APC 是否存在、队伍和显示效果需运行验证。 |
| `[TEAM]` | 一个数值，样本为 `0`。 | 位于 `[SUMMON APC]` 内时只证明召唤参数存在，不等同最终敌我关系或伤害规则。 |

## 上下文 ID 路由

| 上下文 | ID 路由 |
| --- | --- |
| `[CREATE PASSIVEOBJECT] [INDEX]` | 走 `passiveobject/passiveobject.lst`。 |
| `[WHICH] [PASSIVE] ... [IS INDEX]` | 可按 passiveobject 目标检查理解，但仍应回 `passiveobject/passiveobject.lst` 复核。 |
| `[WHICH] [MONSTER] ... [IS INDEX]` | 走 monster registry；不要误用 passiveobject registry。 |
| `[WHICH] [AI CHARACTER] ... [IS INDEX]` | 走 `aicharacter/aicharacter.lst`；不要误用 passiveobject 或 monster registry。 |
| `[WHICH] [ALL MONSTER TEAM] ... [IS INDEX]` | 走 monster registry；同号在 passiveobject registry 命中时也不能脱离父块解释。 |
| `[SUMMON MONSTER] [INDEX]` | 走 monster registry。 |
| `[SUMMON APC] [INDEX]` | 走 `aicharacter/aicharacter.lst`。 |

## 递归边界

- `.obj` 引用的 `.act` 可能继续创建 passiveobject，必须递归到不再出现新对象或新动作。
- 递归中遇到重复 ID、重复 `.obj` 或重复 `.act` 时应去重，避免静态链路膨胀。
- 静态回环只证明配置链可回到已见对象，不证明运行时无限循环。
- registry 未命中、空 `[INDEX]` 和缺失文件引用必须单独保留，不能算作已闭合。
- 下游 `.ani` 按 hitbox/动画路由解释；下游 `.atk` 按通用 AttackInfo 路由解释。

## 覆盖

- 创建递归样本：见 `indexes/passiveobject-create-recursion-ledger.zh-CN.md`。
- Hitbox 样本：见 `indexes/passiveobject-hitbox-ani-sample-ledger.zh-CN.md`。
- 历史 Monster 创建链路由：见 `indexes/monster-created-passiveobject-act-observed-tag-router.zh-CN.md`。
