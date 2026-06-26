# Monster AI / Action / Attack 跨层术语边界

状态：默认可用

本文件只定义怪物跨层核查时的术语和路由边界。字段和链路结论来自主目标 PVF 只读观察；资料库、教程、社区注释和源码字段只作为定向线索。

## 入口与 registry

### monster ID

状态：默认可用

含义：指向怪物 `.mob` 的数字入口。

边界：必须通过 `monster/monster.lst` 解析。相同数字在其他 registry 中可能有不同含义。

### passiveobject ID

状态：默认可用

含义：指向 passiveobject `.obj` 的数字入口，常见于 `[CREATE PASSIVEOBJECT]`。

边界：必须通过 `passiveobject/passiveobject.lst` 解析。raw path 中出现 `Monster`、`MapObject` 或 `Character` 不改变其 registry 身份。

### owner-relative path

状态：默认可用

含义：`.mob/.obj/.act` 内的反引号路径通常相对当前 owner 文件目录解析。

边界：同名文件位于其他目录不等于当前引用已闭合；字段值里写了子目录时必须带子目录拼接。

### empty slot

状态：默认可用

含义：动作槽或攻击信息槽中出现空反引号。

边界：空槽只表示该槽静态未给路径，不证明运行时没有攻击、没有动作或不会由 AI/脚本另行选择。

## `.mob` 层

### `[ai pattern]`

状态：默认可用

含义：怪物 AI 文件入口，可在难度分支下列出多个 `.ai`。

边界：`.ai` 是否被选择、条件是否成立、返回槽位是否触发动作，都不能只靠字段存在证明。

### `[attack action]`

状态：默认可用

含义：怪物攻击动作列表，通常指向 `.act`。

边界：动作存在不等于攻击命中；必须继续读 `.act` 和其挂接的 `.ani/.atk/passiveobject`。

### `[attack info]`

状态：默认可用

含义：怪物攻击信息列表，通常指向 `.atk`。

边界：`.atk` 只提供攻击 payload；是否命中、范围如何、是否产生伤害，还要回 `.act/.ani` 和运行验证。

## `.ai` 层

### AI return slot

状态：需验证

含义：`.ai` 中可通过 `[return]` 返回数字，作为动作或行为选择线索。

边界：返回数字如何映射到具体动作槽，需要结合 `.mob` 动作列表、cooltime 和完整 AI 块；不能脱离上下文解释。

### object selector in AI

状态：需验证

含义：`.ai` 中可观察到目标、monster、apc、passive object 等选择 token。

边界：选择 token 只证明 AI 表达式结构存在，不证明索敌、优先级或运行结果。

## `.act` 层

### `[MOTION]`

状态：默认可用

含义：动作脚本的动画挂接入口，常见子项有 `[BASE ANI]` 和 `[SUB ANI]`。

边界：MOTION 只定位动画；不证明动作一定播放，也不证明图像资源完整。

### `[TRIGGER]` / `[BEHAVIOR]`

状态：默认可用

含义：动作脚本的触发和行为结构。

边界：帧号、条件、行为 ID 和触发时序只能静态记录；执行时机与同步效果需实机验证。

### `[CREATE PASSIVEOBJECT]`

状态：默认可用

含义：动作脚本中的 passiveobject 创建入口。

边界：块内 `[INDEX]` 后的数字走 passiveobject registry；`[PARTICLE FILENAME]`、`[LEVEL]`、`[POS]` 只记录列形，不解释运行公式。

### `[SUMMON MONSTER]`

状态：默认可用

含义：动作脚本中的怪物召唤入口。

边界：行为块内的 monster ID 走 monster registry；选择器上下文中的 `[SUMMON MONSTER]` 不按召唤 ID 解析。

## `.obj` / `.atk` / `.ani` 层

### `.obj`

状态：默认可用

含义：passiveobject 本体文件，可挂接 basic action、etc action、attack info、生命周期、通行、层级和对象销毁条件。

边界：对象字段不证明碰撞、阵营、销毁或追踪实机效果。

### `.atk`

状态：默认可用

含义：AttackInfo 文件，承载攻击类型、元素、伤害参数、受击反应、异常状态、PVP 覆盖和命中表现 token。

边界：`.atk` 不提供帧级坐标；不能单独证明命中范围、伤害公式、异常概率、卡肉、浮空或 PVP 最终规则。

### `[ATTACK BOX]`

状态：默认可用

含义：ANI 帧级攻击盒入口，观察到六数值列形。

边界：攻击盒存在不等于一定造成伤害；还要结合 owner action、`.atk`、目标状态和实机验证。

### `[DAMAGE BOX]`

状态：默认可用

含义：ANI 帧级受击盒、实体盒或碰撞盒入口，观察到六数值列形。

边界：不能把所有 DAMAGE BOX 都解释成攻击输出；需要结合 owner 动作和对象用途。

## 辅助与资料线索

### source-position clue

状态：默认可用

含义：资料库、教程、社区注释、GM 工具字段或源码字段提供的定向线索。

边界：只能提示“去查哪里”，不能直接写成 Workbench 字段结论或 PVF 写入依据。

### auxiliary difference

状态：默认可用

含义：辅助对照 PVF 中观察到的 registry、字段值、文本形态或文件差异。

边界：只作为差异提示，不覆盖主目标 PVF 事实。
