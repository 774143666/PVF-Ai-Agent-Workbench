# PassiveObject / AttackInfo / Hitbox

状态：需验证

## 用途

PassiveObject 常用于飞行物、召唤物、地图对象、角色公共对象、持续效果和攻击表现。AttackInfo `.atk` 是攻击 payload 的常见承载层；动画 `.ani` 可包含帧级攻击框或受击框结构。

## 基本闭环

```text
入口 A：数字 ID
-> passiveobject/passiveobject.lst
-> passiveobject/<rawPath>.obj
-> .act / .ani / .atk

入口 B：已知 .obj 路径
-> .obj
-> 相对 .act / .ani / .atk

入口 C：上游创建者
-> skill / map / dungeon / monster / action
-> passiveobject ID 或 .obj 链
```

## Registry 边界

- 所有 passiveobject 数字 ID 都必须通过 `passiveobject/passiveobject.lst` 解析。
- registry raw path 前缀可能是 `MapObject`、`Character` 或 `Monster`，但数字 ID 的 registry 仍是 passiveobject。
- 直接读取到的 `.obj` 路径不等于已经知道它的数字 ID；需要数字时仍要回 registry。
- `name_数字` 是名称或字符串链接样式，不是 passiveobject ID。

## `.obj` 边界

- `.obj` 可连接 `.act/.ani/.atk`，并承载身份、宽度、层、通行、动作、AttackInfo、生命周期、销毁、追踪、生命、数据块和资源引用入口。
- `.obj` 引用的 `.act` 可继续创建 passiveobject，必须递归到链路收敛。
- 同名文件位于其他目录不等于当前引用已闭合。
- 生命周期字段、追踪字段、队伍字段、通行字段只证明结构存在，不证明实机碰撞、轨迹、阵营或销毁时序。
- `[object destroy condition]` 块内可出现反引号 token；这些 token 不等于普通字段标签。
- `[homing follow]` 后的 token 决定后续数字路由，例如 `[MONSTER]` 后的数字应走 monster registry。

## 创建边界

- `[CREATE PASSIVEOBJECT] ... [/CREATE PASSIVEOBJECT]` 可出现在 `.act` 的 `[BEHAVIOR]` 等上下文中。
- 闭合块内的 `[INDEX]` 必须回 `passiveobject/passiveobject.lst` 解析。
- `[PARTICLE FILENAME]`、`[LEVEL]`、`[POS]` 等只记录列形，不解释运行公式。
- `[CREATE PASSIVEOBJECT CIRCLE]` 在当前 `passiveobject/` 脚本文本搜索范围未观察到；不要写成主目标全局不存在，也不要把其他范围观察直接提升为本范围结论。

## `.atk` 边界

- Monster 与 passiveobject 都可使用 `.atk`。
- 字段名不能直接推出伤害公式、元素、异常概率、击退、浮空、hit stop、命中或 PVP 结果。
- `[active status]` 只证明状态入口存在；状态 token 后可见三数值列、四数值列或七数值列，列含义需专项验证。
- `[ACTIVE STATUS]` 大写样本可属于 `.act` 上下文，不要和 `.atk [active status]` 合并。
- `[active status apply weapon]` 在主目标 `passiveobject/` 范围未观察到；辅助对照样本不能提升为主目标结论。
- `[pvp] ... [/pvp]` 只证明 PVP 覆盖块存在，块内字段集合可变，不证明竞技场最终规则。
- PVP `.atk` 要证明静态攻击链，需要继续连回 owner `.obj`、`.act` 和 `.ani`；`.atk` 自身不能独立证明命中。
- 历史拼写和大小写变体应按原样保留。

## `.ani` / Hitbox 边界

- `[ATTACK BOX]` 与 `[DAMAGE BOX]` 是帧级盒结构入口。
- 攻击框存在不等于一定造成伤害；受击框存在也不能一律解释为攻击输出。
- 二进制 ANI 无法反编译时必须标为未展开风险。
- 文件名包含 `.ani` 的统计会包含 `.ani.als` 侧车文件；做 hitbox 覆盖时必须按具体文件读取。
- PVF 中动画引用存在不证明客户端 ImagePacks2/NPK 资源完整。

## 入口

- `indexes/passiveobject-coverage-ledger.zh-CN.md`
- `indexes/attackinfo-status-pvp-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-block-inventory.zh-CN.md`
- `indexes/attackinfo-pvp-chain-pilot-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-gunner-chain-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-fighter-chain-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-mage-chain-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`
- `indexes/attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md`
- `indexes/passiveobject-lifecycle-homing-ledger.zh-CN.md`
- `indexes/passiveobject-hitbox-ani-sample-ledger.zh-CN.md`
- `indexes/passiveobject-create-recursion-ledger.zh-CN.md`
- `indexes/passiveobject-nonmonster-sample-chain.zh-CN.md`
- `dictionaries/passiveobject-obj-fields.zh-CN.md`
- `dictionaries/passiveobject-action-fields.zh-CN.md`
- `dictionaries/attackinfo-atk-fields.zh-CN.md`
- `indexes/attackinfo-atk-observed-tag-router.zh-CN.md`
- `indexes/attackinfo-atk-backtick-token-router.zh-CN.md`
- `indexes/monster-created-passiveobject-act-observed-tag-router.zh-CN.md`
- `indexes/monster-created-passiveobject-obj-observed-tag-router.zh-CN.md`
- `indexes/monster-action-animation-ani-observed-tag-router.zh-CN.md`
- `task-cards/passiveobject-nonmonster-readonly-audit.zh-CN.md`
- `task-cards/monster-created-passiveobject-readonly-audit.zh-CN.md`
