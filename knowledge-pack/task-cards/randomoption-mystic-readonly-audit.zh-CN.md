# RandomOption / Mystic / Equipment Random 只读核查

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `dictionaries/equipment-fields.zh-CN.md`
- `indexes/equipment-rule-fields.zh-CN.md`
- `dictionaries/randomoption-mystic-fields.zh-CN.md`
- `indexes/randomoption-mystic-equipment-boundary.zh-CN.md`

## 执行

1. 确认目标 PVF，只读打开。
2. 先从 `etc/randomoption/randomoption.lst` 定位随机词条 ID 到 `etc/randomoption/options/*.etc`，不要只靠文件名或目录猜。
3. 读取随机词条文件中的 `[option]`、`[level]` 和属性字段；属性字段只证明可见列形，不证明实机抽到或生效。
4. 读取固定配置文件：`randomizedoptionoverall1.etc`、`randomizedoptionoverall2.etc`、`optiongrouping.etc`、`optiongroupselection.etc`、`optionquantity.etc`、`partselection.etc`、`optionnumbering.etc`、`auctionrandomcategory.etc`、`regenerationrandomoption.etc`。
5. 如核查装备侧随机规则，必须通过 `equipment/equipment.lst` 定位 `.equ`，再读 `[random option]`、`[no random]` 和 `[Force Result Item Rule]`。
6. 如核查 mystic / avatar hidden option，读取 `etc/avatar_roulette/avatarfixedhiddenoptionlist.etc`；其中 ID 不能直接猜成装备或道具，必须按 registry 查。
7. 对 `randomoptionskill.lst` 单独处理：主目标当前注册项未闭合到文件，不能当可用技能随机词条池。
8. 辅助对照 PVF 只记录结构和规模差异，不提升为主目标事实。

## 验收

- 能说清 `randomoption.lst` 到 `options/*.etc` 的闭合链路。
- 能区分随机词条池、全局选择/数量/部位配置、装备侧标记和 avatar roulette 配置。
- 能说明主目标 `randomoptionskill.lst` 当前是缺文件风险，而不是可用技能随机词条结论。
- 能把装备 `[random option]` 写成装备文件内的静态规则字段，而不是随机词条池本体。
- 能说明主目标没有 equipment `[hidden option]`，也没有 `stackable/emblem/hidden_option.stk`。
- 能说明 mystic circle 内部 ID 当前未在常规 `.lst` registry 中闭合。
- 不生成输出 PVF，不改客户端，不写运行产物进 knowledge-pack。

## 运行边界

静态只读能证明“文件存在、registry 是否闭合、字段和列形可见”。它不能证明随机词条实机抽取概率、词条应用成功、封印解除或再生扣费成功、avatar hidden option UI 正常、客户端资源完整、账号条件满足、服务端放行或 PVP 最终规则。
