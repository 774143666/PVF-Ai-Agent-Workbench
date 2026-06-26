# AttackInfo PVP zrr_skill 链路账本

状态：需验证

本文记录主目标 PVF 中 `passiveobject/zrr_skill/` 下 9 个带 `[pvp] ... [/pvp]` 的 `.atk` 文件的只读审计结果。它只证明目标 PVF 中这些 PVP 覆盖块已读取，并记录 owner 搜索、`.obj` 链路和 ANI 断链风险；不证明实机 PVP 伤害、命中、击退、浮空、硬直、同步或客户端资源完整。

## 覆盖结论

| 项 | 主目标只读结论 |
| --- | --- |
| 本账本 PVP `.atk` | 9 个，均已读取到闭合 `[/pvp]`。 |
| owner 闭合 | 1 个闭合到 `.obj`，但 owner-listed ANI 在主目标文件名搜索和直接读取中均未命中；8 个未在主目标全 PVF 脚本文本中找到 owner 字符串。 |
| 可闭合样本 | `ATBlizzardStormPole.atk` 由 `atfrozenlandpole.obj [attack info]` 引用。 |
| 断链样本 | `atfrozenlandpole.obj` 明列 `Animation/ATBlizzardStorm/Column/StartColumn_01.ani` 与 `Column_01.ani`，但主目标文件名搜索和直接读取均未找到这两个 ANI；辅助对照同路径也未命中。 |
| 未闭合样本 | `wildwhip2.atk`、`givebloodsub.atk`、`grandwavefullcharge.atk`、zrr 版 `outragebreakfloor*.atk`、`releasewave.atk`、`wavemarkattack*.atk` 均未找到 owner 字符串。 |
| 重要边界 | character/swordman 的 `OutRageBreakFloor` owner 不能替代 zrr_skill 物理路径下的同名 `.atk`。 |

## PVP 块与 owner 结果

| PVP `.atk` | PVP 块内字段 | owner / ANI 只读结果 | 边界 |
| --- | --- | --- | --- |
| `zrr_skill/atmage/attackinfo/atblizzardstormpole.atk` | `[hit direction] [auto]` | `atfrozenlandpole.obj [attack info] -> AttackInfo/ATBlizzardStormPole.atk`；owner `[basic motion]` 指向 `Animation/ATBlizzardStorm/Column/StartColumn_01.ani`，`[etc motion]` 指向 `Animation/ATBlizzardStorm/Column/Column_01.ani`，两个 ANI 在主目标搜索和直接读取中均未命中；辅助对照同路径也未命中。 | owner `.obj` 与 `.atk` 已闭合，hitbox 未闭合，属于 ANI 断链风险；不能写成没有攻击框。 |
| `zrr_skill/swordman/attackinfo/atgroupdance/wildwhip2.atk` | `[lift up] 375` | 全 PVF 脚本文本未找到 `wildwhip2.atk` owner 字符串；`atgroupdance` 目录只观察到 attackinfo 文件，未观察到 owner `.obj`。 | 只能写成 PVP 块已读、owner 未闭合。 |
| `zrr_skill/swordman/attackinfo/givebloodsub.atk` | `[damage reaction] [none]` | 全 PVF 脚本文本未找到 `givebloodsub.atk` owner 字符串。 | 不能按同名或技能名猜 owner。 |
| `zrr_skill/swordman/attackinfo/grandwavefullcharge.atk` | `[ignore super armor] 0` | 全 PVF 脚本文本未找到 `grandwavefullcharge.atk` owner 字符串。 | 只记录 PVP 覆盖值，不解释霸体规则。 |
| `zrr_skill/swordman/attackinfo/outragebreakfloor.atk` | `[lift up] 450` | zrr 物理文件未找到 owner 字符串；完整 `AttackInfo/OutRageBreakFloor.atk` 搜索只命中 character/swordman owner。 | character 版 owner 已闭合，但不能替代 zrr 版物理 `.atk`。 |
| `zrr_skill/swordman/attackinfo/outragebreakfloor_ds.atk` | `[lift up] 450` | zrr 物理文件未找到 owner 字符串；完整 `AttackInfo/OutRageBreakFloor_DS.atk` 搜索只命中 character/swordman owner。 | character DS 版 owner 已闭合，但不能替代 zrr DS 物理 `.atk`。 |
| `zrr_skill/swordman/attackinfo/releasewave.atk` | `[lift up] 300`、`[hit direction] [outer]` | 全 PVF 脚本文本未找到 `releasewave.atk` owner 字符串。 | PVP 块内可同时覆盖数值字段和方向字段。 |
| `zrr_skill/swordman/attackinfo/wavemarkattack.atk` | `[damage reaction] [none]`、`[knuck back] 0`、`[push aside] 0`、`[lift up] 0` | 全 PVF 脚本文本未找到 `wavemarkattack.atk` owner 字符串。 | 根层 `[knuck back]` 为两数值列，PVP 覆盖为一数值列；不要写成固定列形。 |
| `zrr_skill/swordman/attackinfo/wavemarkattack_light.atk` | `[damage reaction] [none]`、`[knuck back] 0`、`[push aside] 0`、`[lift up] 0` | 全 PVF 脚本文本未找到 `wavemarkattack_light.atk` owner 字符串。 | light 版根层为 `[light element]`，PVP 块列形与普通 wavemark 相同。 |

## 已读 zrr swordman `.obj` 边界

| 目录观察 | 主目标只读结论 |
| --- | --- |
| `zrr_skill/swordman` 目录 `.obj` | 文件清单观察到 10 个 `.obj`，均已读取。 |
| 当前 8 个 zrr swordman PVP `.atk` | 10 个 `.obj` 中未观察到这些 PVP `.atk` 的 `[attack info]` 或 `[etc attack info]` 引用。 |
| 相邻非 PVP attackinfo | 已读 `.obj` 可引用 `chargecrashsub.atk`、`meteorsword.atk`、`SwordOfMind.atk`、`SwordOfMindExp.atk`、`SwordOfMindThirdPhase.atk` 等相邻文件；这些不能替代本账本 PVP 目标。 |

## 方法规则

- 对 zrr_skill 的同名 `.atk`，必须按物理路径区分；character 目录已闭合不代表 zrr 目录已闭合。
- 全 PVF `SearchScript` 未命中 owner 字符串不能证明运行时绝对不用；只能证明当前样本脚本文本范围未观察到明文 owner。
- owner `.obj` 指向的 ANI 文件清单未找到时，必须写成 ANI 断链风险，不能写成没有攻击框。
- PVP 块内字段只记录覆盖值，不解释竞技场最终公式。

## 收口结论

- 至此 40 个 PVP `.atk` 均已完成静态只读审计：31 个已分桶闭合到 owner/ANI 或 owner/action/ANI 观察点，9 个 zrr_skill 文件登记为 owner 未闭合或 ANI 断链风险。
- “40/40 已审计”不等于“40/40 实机命中已验证”，也不等于“40/40 owner/ANI 全部闭合”。
- 后续若要证明 zrr_skill 的运行来源，需要进入 skill/load_state/NUT 或实机链路专题，不能在 passiveobject 目录内继续猜 owner。
