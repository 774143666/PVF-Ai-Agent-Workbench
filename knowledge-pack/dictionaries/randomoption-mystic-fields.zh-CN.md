# RandomOption / Mystic 字段字典

状态：默认可用

用途：记录 `etc/randomoption`、`etc/avatar_roulette` 和 equipment 随机规则之间的静态字段边界。本文只记录主目标 PVF 只读观察后的纯结论；辅助对照只作差异提示。

## 文件入口

| 入口 | 主目标观察 | 读法 |
| --- | --- | --- |
| `etc/randomoption/randomoption.lst` | 注册 16 个随机词条文件，16 个全部存在，无缺失、无重复。 | 随机词条 ID 先走该 registry，再读 `etc/randomoption/options/*.etc`。 |
| `etc/randomoption/randomoptionskill.lst` | 注册 20 个 ID，但对应 20 个目标文件均未在主目标中存在。 | 只能记录为缺文件风险；不能当可用技能随机词条池。 |
| `etc/randomoption/options/*.etc` | 主目标可见 16 个词条文件。 | 词条文件通常含 `[option]`、`[level]` 和一个或多个属性字段。 |
| `etc/randomoption/*.etc` 固定配置 | 主目标可见多个未挂入 `randomoption.lst` 的固定配置文件。 | 这些不是“漏注册词条文件”，而是全局选择、数量、部位、分类、再生等支持表。 |
| `etc/avatar_roulette/avatarfixedhiddenoptionlist.etc` | 文件存在，含 `[mystic circle]`、`[upper]`、`[rare]` 和多种属性字段。 | 属于 avatar roulette / hidden option 配置，不等同 equipment `[hidden option]`。 |
| `stackable/emblem/hidden_option.stk` | 主目标不存在。 | 不要按教程或外部路径假定该文件存在。 |

## 随机词条字段

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[option]` | 词条文件内的选项 ID 标记，主目标词条 ID 与 `randomoption.lst` 注册 ID形成链路。 | 文件名和内部 `[option]` 仍需逐文件核对，不能只看文件名。 |
| `[level]` | 词条文件内可见等级行。 | 静态等级行不证明该词条会在该等级装备上实机出现。 |
| 属性字段 | 主目标词条文件可见 `[physical attack]`、`[magical attack]`、`[physical defense]`、`[magical defense]`、`[HP MAX]`、`[stuck resistance]`、`[physical critical hit]`、`[magical critical hit]`、`[equipment physical defense]`、`[equipment magical defense]`、元素攻击等字段。 | 字段名和数值范围只证明静态配置；不证明最终角色面板、概率或客户端显示。 |

## 支持表字段

| 文件 / 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `randomizedoptionoverall1.etc` | 含 `[random application]`、`[level limit]`、`[base item]`、`[option type]`、`[modified option type]`。 | 可作为随机应用、等级、基础物品和选项类型线索；不证明实机抽取结果。 |
| `randomizedoptionoverall2.etc` | 含 `[postfix]`、`[break seal cost]`、`[different weight]`、`[choose postfix]`、`[option modification]`、`[postfix grade modification]`、`[unable to modify postfix grade]`、`[gradeless postfix]`。 | 可见封印、后缀、权重和改造线索；不证明扣费、解封或再生成功。 |
| `optiongrouping.etc` / `[option group]` | 主目标可见 3 个 option group，组内列出随机词条 ID 与权重。 | 组内 ID 应回到 `randomoption.lst` 检查；权重不等于实机概率已验。 |
| `optiongroupselection.etc` | 含 `[choose option group]` 和 `[modified option selection]`，可见装备部位 token 与数字列。 | 部位 token 不是 registry ID；数字列不能裸猜语义。 |
| `optionquantity.etc` | 含 `[quantity ratio]` 和 `[option quantity]`。 | 只证明静态数量/比例配置；不证明最终抽到几条。 |
| `partselection.etc` / `[part type]` | 可见装备部位 token、权重和数字列。 | 部位选择和实际装备可用性仍需运行验证。 |
| `optionnumbering.etc` | 含 `[option value ratio]`。 | 可作数值比例线索；不证明最终数值浮动算法。 |
| `auctionrandomcategory.etc` | 含 `[random category]`，列出分类文字和随机词条 ID。 | 只作为拍卖/分类显示或筛选线索；不证明 UI 分类一定正常。 |
| `regenerationrandomoption.etc` | 含 `[choose part]`、`[adjust quantity ratio]`、`[regeneration price]`。 | 可作再生选项、数量调整和价格线索；不证明再生消耗或服务器放行。 |

## Equipment 侧字段

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[random option]` | 注册 `.equ` 中观察到 58 处，当前全量样本值均为 `1`。 | 它是装备侧规则字段，不是词条池本体；不能压缩成“已确认可随机出词条”。 |
| `[no random]` | 注册 `.equ` 中观察到 221 处，均为无值存在标记。 | 不要按整数读取；也不要和 `[item category]` 块内 token 混写。 |
| `[Force Result Item Rule]` | 注册 `.equ` 中观察到 2374 处，后接两个整数；主目标值包括 `1 0`、`0 500`、`0 150`、`0 250`、`0 1000`、`0 30`。 | 可与随机规则语境相邻，但不是固定等同 `[random option]`；数字语义仍需更强证据。 |
| `[hidden option]` | 主目标注册 `.equ` 中未观察到。 | 不要把 avatar roulette hidden option 或文件名线索写成 equipment 字段事实。 |
| `[item category]` 内 `no random` | 当前注册 `.equ` 扫描未观察到 `[item category]` 块内 `no random` 命中。 | 若后续遇到具体文件，仍需按父块重新核查。 |

## Mystic / Avatar Roulette 字段

| 字段 | 主目标可见结构 | 边界 |
| --- | --- | --- |
| `[mystic circle]` | `avatarfixedhiddenoptionlist.etc` 内可见值 `2675818`。 | 该数字未在主目标常规 `.lst` registry 中闭合；不得猜成 stackable 或 equipment。 |
| `[upper]` | 作为 avatar hidden option 的一段属性配置入口，内部可见多种属性字段。 | 不等同装备部位 registry；实际可选部位和 UI 仍需实机确认。 |
| `[rare]` | 作为另一段 avatar hidden option 属性配置入口。 | 稀有度、可洗属性和客户端显示需运行验证。 |

## 辅助对照提示

辅助对照 PVF 的 `randomoption.lst` 注册项和 `options/*.etc` 文件规模明显更大，且 `randomoptionskill.lst` 在辅助对照中可闭合。该差异只能提示“同类系统在其他版本可能更完整”，不能覆盖主目标缺文件事实。
