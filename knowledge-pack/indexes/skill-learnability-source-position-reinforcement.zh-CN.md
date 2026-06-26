# Skill Learnability 资料线索补强索引

状态：已补强

适用范围：技能学习、SP/TP 技能树、PVP 技能表、默认技能、AutoSkill、命令输入、冷却和学习消耗边界。

## 定位

本页用于说明：资料线索对 Skill Learnability 主线的作用是“定向排查”，不是直接产出字段事实。Workbench 的字段事实仍以主目标 PVF 只读观察为准。

## 资料线索确认的排查方向

资料线索与已封存主线一致支持以下排查顺序：

1. 先确定职业 skill registry，再解析技能 ID 到 `.skl`。
2. 普通学习等级和学习消耗读 `.skl [required level]`、`[required level range]`、`[purchase cost]` 等字段。
3. TP/EX 强化技能读强化 `.skl [special purchase cost]` 与 `[pre required skill]`。
4. 技能树显示读 `clientonly/skilltree/*_sp.co` 与 `*_tp.co` 的 `[skill info]`、`[index]`、`[icon pos]`、`[next skill]`。
5. PVP 静态入口读 `etc/pvpskilltree/*.etc`，不由 SP/TP 自动推导。
6. 默认技能读 `.chr`，AutoSkill 读 autoskill 表，common/cancel 读对应 clientonly 列表。
7. 命令输入同时看 `[command]` 和 `[command key explain]`，说明文本不能替代 token。
8. 冷却和消耗区分 `.skl [cool time]`、`[start cool time]`、`[auto cooltime apply]`、`[consume MP]`、装备侧 `[cooltime]` 和 `[skill cooltime reset]`。

## 已加固边界

- 技能 ID 不能跨职业 registry 互证。
- `.skl` 学习字段不能证明技能树可见、默认已学或服务端放行。
- SP/TP 技能树不能证明学习扣点、TP 扣点或默认授予。
- PVP 技能树不能覆盖普通 dungeon/SP 规则。
- `.chr` 默认技能、AutoSkill、common/cancel 是并行入口，不是同一件事。
- `[command key explain]` 只是说明文本；真正输入序列仍看 `[command]`。
- `[cool time]`、`[start cool time]`、`[auto cooltime apply]`、装备侧 `[cooltime]` 分属不同层级，不能混写。
- 资料里的运行 API 或教程步骤不能直接写成主目标 PVF 的学习字段事实。

## 路由建议

当问题涉及“这个技能为什么学不了”、“技能树有没有这个技能”、“SP/TP 怎么扣”、“前置技能从哪里看”、“命令和说明为什么不一致”、“冷却字段怎么区分”、“PVP 技能表是否覆盖普通技能树”、“资料库是否支持这些入口”时，先读：

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/skill-skl.zh-CN.md`
- `indexes/skill-registry-routing.zh-CN.md`
- `dictionaries/skill-learnability-command-cooldown-fields.zh-CN.md`
- `indexes/skill-learnability-tree-command-cooldown-boundary.zh-CN.md`
- `indexes/skill-tree-default-pvp-entry-boundary.zh-CN.md`
- `indexes/skill-learnability-cost-sp-tp-ui-boundary.zh-CN.md`
- 本页

## 不能外推

本页不证明：

- 技能实机可以学习。
- SP/TP 点数实际扣除正确。
- 前置不足提示或服务端校验正确。
- 技能树 UI 显示、图标坐标、连线最终正常。
- 命令输入或快捷栏释放成功。
- 冷却、起始冷却、失败释放回滚、PVP 冷却修正正确。
- 装备技能等级加成或冷却重置实际生效。
- 技能命中、伤害、状态、动作、NUT 脚本或客户端资源完整。
