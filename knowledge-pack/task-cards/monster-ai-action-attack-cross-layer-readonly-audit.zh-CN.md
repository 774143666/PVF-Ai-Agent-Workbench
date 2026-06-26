# Monster AI / Action / Attack 跨层只读核查

状态：默认可用

用途：当问题涉及怪物行为、怪物攻击、怪物技能、召唤对象、帧级攻击盒、出生或掉落时，本入口把既有 Monster、AI、Action、AttackInfo、PassiveObject 和 Hitbox 账本串成一条只读核查路线。它不重开 Monster 静态覆盖主线，也不证明实机行为。

## 先读

- `safety/README.zh-CN.md`
- `dictionaries/monster-ai-action-attack-cross-layer-fields.zh-CN.md`
- `indexes/monster-ai-action-attack-cross-layer-boundary.zh-CN.md`
- `task-cards/monster-mob-readonly-audit.zh-CN.md`
- `task-cards/monster-ai-summon-spawn-drop-readonly-audit.zh-CN.md`
- `task-cards/monster-action-animation-readonly-audit.zh-CN.md`
- `task-cards/monster-attackinfo-atk-readonly-audit.zh-CN.md`
- `task-cards/monster-created-passiveobject-readonly-audit.zh-CN.md`

## 执行

1. 先确认入口类型：monster ID、`.mob` 路径、map/dungeon 出生行、`[SUMMON MONSTER]`、`.act`、`.atk`、passiveobject ID、`.obj` 或 `.ani`。
2. 数字 monster ID 必须通过 `monster/monster.lst` 解析；数字 passiveobject ID 必须通过 `passiveobject/passiveobject.lst` 解析。
3. 读取 `.mob` 时分开记录 `[ai pattern]`、动作入口、`[attack action]`、`[attack info]`、召唤/出生/掉落和资源字段，不把它们合并为同一层。
4. `.mob [ai pattern]` 继续闭合到 `.ai`；`.ai` 内的条件、返回和对象选择只记录结构，不推断行为成功。
5. `.mob [attack action]` 或动作字段继续闭合到 `.act`；`.act` 内的 `[MOTION]`、`[TRIGGER]`、`[BEHAVIOR]`、`[CREATE PASSIVEOBJECT]` 分层记录。
6. `.mob [attack info]`、`.obj [attack info]` 或 `.act` 内攻击信息继续闭合到 `.atk`；`.atk` 只记录攻击 payload，不替代 hitbox。
7. `.act [BASE ANI]`、`[SUB ANI]` 和 `.obj` 直连动画继续闭合到 `.ani`；二进制 ANI 要反编译后才能记录 `[ATTACK BOX]`、`[DAMAGE BOX]`。
8. 遇到 `[CREATE PASSIVEOBJECT]`、`[CREATE PASSIVEOBJECT CIRCLE]` 或对象创建候选，逐个解析静态数字 ID，并继续读 `.obj/.act/.atk/.ani` 到链路收敛。
9. 遇到 map/dungeon 出生、`.mob` 掉落或全局掉落字段，转到对应已封存边界复核，不在本卡内扩展概率或清算结论。
10. 辅助对照 PVF 只能记录 registry 总量、行号、字段值或文本形态差异；不得覆盖主目标事实。
11. 不写 PVF，不改客户端，不声明 AI 正常、召唤成功、命中正确、伤害正确、掉率一致、UI 正常、音画资源完整或服务端放行。

## 验收

- 入口数字已经按正确 registry 解析，没有靠数字外形猜类型。
- `.mob`、`.ai`、`.act`、`.atk`、`.obj`、`.ani` 的职责分层清楚。
- 所有相对路径按 owner 文件目录解析；同名相邻文件没有被当成自动闭合。
- 空槽、缺失引用、registry 未命中和反编译失败分别记录，没有互相替代。
- `.atk` payload 与 `.ani` 帧级 hitbox 没有互相替代。
- 创建 passiveobject 的下游链路已解析到 `.obj`，并按需要继续到 action、attackinfo 和 animation。
- 辅助对照只写差异提示，不提升为主目标结论。
- 全程只读，没有生成输出 PVF，没有修改客户端。

## 运行风险

静态只读只能证明目标 PVF 中存在某些 registry、字段、路径、块结构和帧级盒字段。AI 决策、动作时序、命中、伤害、卡肉、击退、浮空、召唤成功、对象销毁、掉率、客户端图像/音效加载和服务端放行都需要后续实机或生产化验证。
