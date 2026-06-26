# Skill Tree / Default / PVP Entry Boundary Matrix

状态：默认可用

用途：回答“技能脚本存在之后，角色在哪里看见它、默认是否带它、PVP 是否另有入口、AutoSkill 是否另有授予线索”。本文只覆盖静态入口分层，不解释命中、伤害、卡肉、冷却 UI、服务端最终放行或客户端资源完整性。

## 本桶主目标入口盘点

| 入口层 | 主目标只读观察 | 当前结论 |
| --- | --- | --- |
| SP/TP 技能树 | `clientonly/skilltree/` 下观察到 21 个文件。常见形态是同职业 `*_sp.co` 与 `*_tp.co` 成对；`creator_sp.co` 只有 SP；部分职业没有 TP 或 PVP 对应表。 | SP/TP 是客户端技能树显示、图标坐标和前置链入口。 |
| PVP 技能树 | `etc/pvpskilltree/` 下观察到 9 个职业表。主目标未观察到 demonic swordman、creator mage、AT priest、AT swordman 的 PVP 技能树表。 | PVP 表是单独静态入口，不能由 SP/TP 自动推导。 |
| 角色默认技能 | `character/**/*.chr` 观察到 11 个角色文件。文件内可见基础 `[skill]`、growtype 段 `[skill]` 和 `[awakening skill]`。 | 默认技能和技能树显示是两条入口，不能互相替代。 |
| AutoSkill | `skill/autoskill.lst` 路由到 9 个 AutoSkill 文件；样本文件按 `[job]`、`[growtype]`、`[AutoSkill]` 分段。 | AutoSkill 是自动授予/等级表线索；本桶不强解全部列。 |
| common / cancel | `clientonly/commonskilllist.co` 与 `clientonly/cancelskilllist.co` 是公共/取消类线索。 | 它们不是 `.skl` 学习字段，也不是默认学会证明。 |

## 入口层不要互证

| 层 | 可证明 | 不可证明 |
| --- | --- | --- |
| skill registry | 当前职业 registry 中技能 ID 指向哪个 `.skl`。 | 不能证明技能树显示、默认学会、PVP 可用。 |
| `.skl` 学习字段 | 技能本体的等级、费用、类型、growtype 适配、命令、冷却等静态字段。 | 不能证明界面一定显示，也不能证明服务端放行。 |
| SP 技能树 | 技能在普通技能树的分组、图标位置、前置链线索。 | 不能证明默认已经学会，不能覆盖 PVP 表。 |
| TP 技能树 | TP/EX 类技能树入口和图标位置。 | 不能把 TP 中的 EX ID 当成基础技能 ID。 |
| PVP 技能树 | PVP 场景下按 level、job index、grow type index 分层的技能/静态基础技能表。 | 不能覆盖 dungeon/SP 规则，也不能证明普通技能树可见。 |
| `.chr` 默认技能 | 建号、转职或觉醒阶段的 PVF 可见默认技能线索。 | 不能证明玩家可继续升级该技能，不能证明运行时最终状态。 |
| AutoSkill | 按 job/growtype 组织的自动技能/等级表线索。 | 本桶不解全部列，不把它直接写成“玩家一定已学会”。 |
| common / cancel | 公共技能列表、取消技能列表或例外线索。 | 不是学习来源，也不是释放成功证明。 |

## 代表技能并列矩阵

### ATMage / IceRoad / ID 7

| 入口 | 主目标只读结果 | 边界 |
| --- | --- | --- |
| registry | `skill/atmageskill.lst` 中 `7` 指向 `ATMage/IceRoad.skl`；同 registry 中 `217` 指向 `ATMage/IceRoadEx.skl`。 | `7` 与 `217` 是同职业 registry 内的基础/EX 关系线索，不能跨职业解释。 |
| `.skl` | `IceRoad.skl` 为 `[active]`；可见 `[required level] 25`、`[required level range] 2`、`[purchase cost] 30`、`[skill class] 1`、`[maximum level] 70`、`[growtype maximum level] 0 0 30 0 0 0`、`[skill fitness growtype] 2`。 | 这些字段说明静态学习形状，不证明默认学会。 |
| 命令/冷却 | 可见 `[command]`、`[command key explain]`、`[consume MP]`、`[cool time] 8000 8000`、`[casting time] 500 500`、`[executable states] 0 8 14`。 | 不能证明命令输入、快捷栏释放、失败释放回滚或 UI 冷却最终成立。 |
| SP 树 | `clientonly/skilltree/atmage_sp.co` 的 glacialmaster 分支中观察到 `index 7`，并有 `next skill 48` 线索。 | SP 树证明显示/前置链线索，不证明默认学会。 |
| TP 树 | `clientonly/skilltree/atmage_tp.co` 的 glacialmaster 分支观察到 `217` 等 TP/EX ID；未把基础 `7` 当 TP 入口。 | TP 入口要按 EX/TP registry 解释，不可与 SP 基础技能混写。 |
| PVP 树 | `etc/pvpskilltree/atmage.etc` 中 grow type 2 的 PVP 表观察到 `7` 与数值列同现。 | PVP 表是单独静态入口，不覆盖普通技能树。 |
| `.chr` 默认技能 | `character/mage/atmage.chr` 的 glacialmaster 默认 `[skill]` 样本中未观察到 `7`。 | SP 可见不等于默认学会。 |
| AutoSkill | `ATMageAutoSkill.skl` 为 at mage 的 job/growtype/AutoSkill 大表，样本中可见大量技能 ID/等级列。 | 本桶只确认入口形态，不强解全部列。 |

### Priest / ReleaseBuffs / ID 222

| 入口 | 主目标只读结果 | 边界 |
| --- | --- | --- |
| registry | `skill/priestskill.lst` 中 `222` 指向 `priest/priestnewskill/ReleaseBuffs.skl`。 | 这是 priest registry 事实；同数字在其他职业 registry 中可指向别的技能。 |
| 数字碰撞 | `skill/atmageskill.lst` 中 `222` 指向 `ATMage/BlueDragonWillEx.skl`。 | 任何“222 技能”都必须先问职业 registry。 |
| `.skl` | `ReleaseBuffs.skl` 为 `[active]`；可见 `[required level] 1`、`[required level range] 3`、`[purchase cost] 0`、`[skill class] 1`、`[maximum level] 50`、`[growtype maximum level] 10 10 10 10 10 10`、`[skill fitness growtype] 0 1 2 3 4`。 | 这些字段只证明该自定义技能文件有静态学习形状。 |
| 命令/冷却 | 可见 `[command]`、`[command key explain]`、`[consume MP]`、`[cool time] 60000 60000`、`[executable states] 0 14 8`。 | 静态冷却与命令不能证明运行时一键 buff 成功。 |
| SP 树 | `clientonly/skilltree/priest_sp.co` 的 crusader 分支中观察到 `index 222` 和 `icon pos 0 67`。 | 证明主目标 SP 树有显示入口，不证明默认学会。 |
| TP/PVP/.chr/AutoSkill/common/cancel | 在本桶限定的 priest TP、PVP、`.chr`、AutoSkill、common/cancel 样本搜索中，未观察到主目标 `222` 入口。 | “未观察到”只限本桶检查范围；不能写成全 PVF 永久不存在。 |

## 辅助对照差异提示

辅助对照只提示差异，不提升为主目标事实：

- SP/TP 目录观察到 25 个文件，比主目标多 AT priest 与 AT swordman 的 SP/TP 入口。
- PVP 目录仍观察到 9 个职业表，未因 SP/TP 扩展而自动增加同名 PVP 表。
- `character/**/*.chr` 观察到 13 个角色文件，比主目标多 AT priest 与 AT swordman 的 `.chr` 入口。
- 限定搜索中，辅助对照未在 priest registry 或 priest SP 树中观察到 `ReleaseBuffs` / `222` 这一主目标自定义入口；另在 cancel 列表观察到 `222` 线索。该差异说明自定义入口不能跨 PVF 直接迁移。

## 验收口径

- 查某个技能时，先定职业 registry，再读 `.skl`，再分别查 SP、TP、PVP、`.chr`、AutoSkill 和 common/cancel。
- 能学会不等于能释放；能释放不等于命中、伤害、卡肉、击退、浮空、追踪或同步成立。
- SP/TP/PVP/default/AutoSkill 是并行入口；一个入口有或没有，都不能单独推出其他入口。
- 静态 PVF 不证明客户端资源完整，也不证明服务端最终规则。

## 下一步测试建议

1. 建 AT Mage glacialmaster，检查 `IceRoad` 是否在普通技能树显示、是否有前置链提示、是否可学习、等级门槛是否为 25。
2. 对 `IceRoad` 分别用命令与快捷栏释放，记录可释放状态、MP、冷却、PVP 冷却差异。
3. 建 priest crusader，检查 `ReleaseBuffs` 是否在技能树显示、是否可学习、命令显示是否为 `↑↑ + Z`。
4. 新建/转职/觉醒后分别记录技能列表，验证 `.chr` 与 AutoSkill 线索是否会变成实际默认技能。
