# Equipment Rules And Limits 索引

## 用途

本索引用于只读判断 equipment `.equ` 中的使用期限、强化范围、内容禁用、路由优先级、角色物品检查和物品分类字段。它只记录目标 PVF 可观察结构与最低核查边界，不授权直接写 PVF。

## 总规则

- 本索引字段状态均为 `需验证`。
- 闭合块必须完整读取到对应 `[/...]`；不要只复制起始标签或单行样本。
- 枚举 token 按原始大小写、空格和反引号保留，不根据中文意思自行改名。
- 数字列不能只凭位置猜成职业 ID、装备 ID、等级或概率；需要同类样本、registry 或实机验证。
- 说明文字和字段名不能单独证明运行效果。

## 字段表

| 字段 | 状态 | 目标 PVF 可观察结构与边界 |
| --- | --- | --- |
| `[Force Result Item Rule]` | 需验证 | 根级非闭合字段，后接两个整数。当前注册 `.equ` 全量扫观察到 2374 处，值包括 `1 0`、`0 500`、`0 150`、`0 250`、`0 1000`、`0 30`；数字语义未定性。它可与随机选项语境相邻，但目标样本也可不带 `[random option]`，因此不能把两者绑定成固定组合。 |
| `[random option]` | 需验证 | 根级非闭合单整数规则字段。当前注册 `.equ` 全量扫观察到 58 处，当前主目标值均为 `1`；不要把未在当前主目标扫出的 `2/3` 写成当前事实。它是装备侧随机规则字段，不是 `etc/randomoption` 词条池本体，精确运行差异仍需实机确认。 |
| `[special monster drop]` | 需验证 | 根级非闭合单整数标记，目标样本均为 `1`。它常与下列两个额外掉落筛选块同时出现，但三者仍是独立字段，不能合并成一个不可拆分的标签。 |
| `[dungeon type for extra drop]` | 需验证 | 闭合 token 块，必须读取 `[/dungeon type for extra drop]`。目标 PVF 当前块内只观察到 `[all]`；它描述额外掉落适用的副本类型范围，不直接证明掉落概率或掉落表。 |
| `[difficulty for extra drop]` | 需验证 | 闭合 token 块，必须读取 `[/difficulty for extra drop]`。目标 PVF 当前块内只观察到 `[ultimate]`；它描述额外掉落适用的难度范围，不直接证明触发率。 |
| `[usable period]` | 需验证 | 根级非闭合字段，后接一个整数。资料解释指向可使用期限，目标样本常见 `7`、`15`、`30`、`300`；时间单位、计时起点、封装状态影响和客户端显示仍需确认。不要和 `[expiration date]` 或 `[usable period after unsealing]` 混用。 |
| `[expiration date]` | 需验证 | 根级非闭合十位整数。目标值可按 Unix epoch 秒转换为绝对时间；客户端采用的显示时区、到期处理和删除行为仍需实机确认。它不是 `[usable period]` 的同义字段。 |
| `[no random]` | 需验证 | 根级无值存在标记。当前注册 `.equ` 全量扫观察到 221 处，均为空体存在标记。目标样本依靠标签是否出现表达规则，不能按单整数读取；当前未观察到 `[item category]` 块内 `no random` 命中，后续若遇具体文件仍需按父块复核。 |
| `[minimum rank]` | 需验证 | 根级非闭合单整数门槛字段，目标 PVF 观察到 `0`、`10`、`15`，常见于公平决斗场装备；具体段位刻度仍需更强证据确认。 |
| `[usable world]` | 需验证 | 闭合 token 块，必须读取 `[/usable world]`。目标 PVF 当前只观察到 `[fair]`，表示世界或频道适用范围；不能仅凭英文名扩展不存在的 token。 |
| `[chat emoticon index]` | 需验证 | 根级非闭合单整数引用。数字必须通过 `chatemoticon/chatemoticon.lst` 解析，不能按 equipment registry 解释；目标样本已确认可解析到对应 `.emo` 文件。 |
| `[special ability]` | 需验证 | 根级非闭合单整数标记，目标样本均为 `1`，常与 `[chat emoticon index]` 相邻。相邻不代表同一字段，具体特殊能力范围仍未定性。 |
| `[not amplify]` | 需验证 | 根级非闭合单整数限制标记，目标样本均为 `1`。可按禁止增幅线索读取，但客户端提示和所有强化系统联动仍需实机确认。 |
| `[epic routing]` | 需验证 | 根级非闭合单整数路由标记，目标样本均为 `1`，可与 `[routing priority]` 同文件出现。它不是优先级块的缩写，精确路由行为仍未定性。 |
| `[limit upgradable level]` | 需验证 | 闭合块，必须读取 `[/limit upgradable level]`。块内连续记录由升级类型 token 与两个整数边界组成；目标样本确认 token 包括 `normal upgrade`、`amplify upgrade`、`separate upgrade`。不要把上下界数字解释成装备 ID。 |
| `[routing priority]` | 需验证 | 闭合块，必须读取 `[/routing priority]`。目标样本既有空块，也有“职业 token + 数字”记录；空块不能按缺失字段处理。具体显示或路由优先级语义未定性。 |
| `[impossible contents]` | 需验证 | 闭合的禁用项 token 列表。目标样本确认 token 包括 `disjoint`、`gift`、`upgrade`、`amplify upgrade`、`separate upgrade`、`charac cargo`。每个 token 独立保留，不把整块简化成单一“不可交易”标志。 |
| `[character item check]` | 需验证 | 闭合块，目标常见为重复三列组：“数字、数字、装备部位文本”。同一块可含多组记录；数字列语义未定性，装备部位文本也不是 equipment registry ID。不要把各组三列拆散。 |
| `[item category]` | 需验证 | 闭合的分类 token 列表。目标样本确认 `boss drop`、`clear avatar`、`no random`；分类 token 只说明该块的类别值，不自动等同于同名独立标签或完整掉落机制。 |

## 最低核查清单

1. 先确认字段位于 equipment `.equ`，并读取相邻的 `[equipment type]`、`[attach type]`、`[rarity]` 或外层块。
2. 对所有闭合字段，确认起止标签成对并保存完整块体。
3. 对 `[limit upgradable level]`，逐组读取升级类型 token 和两个数字边界。
4. 对 `[routing priority]`，区分空块与包含职业 token 的块，不擅自删除空块。
5. 对 `[character item check]`，按连续三列组读取，不把数字列直接映射为职业或成长类型。
6. 对 `[item category]` 和 `[impossible contents]`，按 token 列表处理，不通过中文直译补写目标未出现的 token。
7. 对 `[random option]`，保留原值；当前主目标注册 `.equ` 全量样本为 `1`，禁止补写未观察值。对 `[no random]`，保留“无值存在标记”的结构。
8. 对额外掉落三字段，分别保存标记、地城类型块和难度块；不能仅凭装备文件推出完整掉落机制。
9. 对 `[expiration date]`，按 epoch 秒保存原值并明确显示时区；不要改写为相对天数。
10. 对 `[chat emoticon index]`，必须走聊天表情 registry；其他规则数字没有 registry 证据时不得擅自解析。
11. 对 `[Force Result Item Rule]`、`[usable period]`、`[special ability]`、`[not amplify]` 和路由字段，运行语义、单位及联动规则仍需实机或更强证据确认。
