# Skill / State / NUT Runtime 只读核查

状态：默认可用

## 适用

用于派生技能、柔化、强制释放、state/substate、load_state、appendage、自定义 passiveobject、receiveData、动态 AttackInfoPacket 等运行时问题的只读前置核查。

## 先读

- `safety/README.zh-CN.md`
- `encyclopedia/pvf-file-types/skill-skl.zh-CN.md`
- `encyclopedia/pvf-file-types/nut-api-runtime.zh-CN.md`
- `indexes/skill-parameter-index.zh-CN.md`
- `indexes/skill-parameter-facts.compact.json`
- `dictionaries/skill-static-level-parameter-columns.zh-CN.md`
- `indexes/skill-registry-routing.zh-CN.md`
- `indexes/skill-state-nut-runtime-boundary-audit.zh-CN.md`
- `indexes/skill-load-state-entry-coverage.zh-CN.md`
- `dictionaries/nut-runtime-api-boundary.zh-CN.md`
- `workflows/skill-derivative-and-cancel.zh-CN.md`
- `workflows/skill-runtime-parameter-edit.zh-CN.md`
- `indexes/skill-gunner-gatling-steyr-runtime-sample.zh-CN.md`（仅在连射、反坦克炮、TP/特性覆盖类问题中读取）

## 执行

1. 确认目标 PVF，只读打开。
2. 确认目标职业、源技能和目标技能；如果只有技能名，先定位对应 skill `.lst`。
3. 通过职业 skill registry 解析技能 ID，不从数字外形猜。
4. 如需解释 `[static data]`、`[level info]` 或 `[level property]` 列，先查 knowledge-pack 内置结构化参数事实取得候选列义。
5. 读取源技能和目标技能 `.skl`，记录 `[name]`、`[name2]`、`[type]`、`[command]`、`[static data]`、`[level info]`、`[level property]`、`[executable states]`。
6. 将结构化事实表候选列义与目标 `.skl` 的实际列数、列顺序和上下文核对；不一致时只作为线索。
6.1. 如果技能存在 TP/特性/Ex 对应文件，读取对应 `*ex.skl` 或技能树指向文件；基础 `.skl` 修改不保证点 TP 后仍生效。
7. 查目标职业是否存在 `sqr/character/<job>_load_state.nut`。
8. 读取 load_state 中的 `pushScriptFiles`、`pushState`、`pushPassiveObj`。
9. 如果靠 appendage 轮询，读取 `passive_skill_<job>.nut` 和 appendage `.nut`。
10. 记录实际触发窗口：state 级、动作级、帧级；没有动画依据时不要写成精确窗口。
11. 遇到 substate，优先找同目标 PVF 内 `sq_IntVectPush`、`SetSkillState`、`sq_AddSetStatePacket` 用法。
12. 遇到 passiveobject ID，按父块上下文走 `passiveobject/passiveobject.lst`。
13. 遇到技能内级联 PO，例如控制 PO 再创建目标命中 PO，逐级闭合 load_state、registry、写包/读包、state packet 和销毁条件；不要借此重开 PO/AttackInfo/Hitbox 广域采样。
14. 遇到 PO 的 `onAttack` 追加 appendage，闭合目标条件、appendage 路径、有效期来源、视觉/控制 API 和清理条件；不要把静态脚本写成控制成功率。
15. 遇到脚本用 `Appendage/...` 这类运行时路径，确认主目标 PVF 中对应 `sqr/appendage/...` 文件真实存在；找不到时只记录路径引用风险。
16. 遇到 PO 在 `procAppend` / `setCustomData` 里读取父 state/substate、等待动画帧或切换攻击包，闭合父状态来源、动画帧、读包字段和切换条件；不要把静态等待逻辑写成实机命中或最终时序。
17. 遇到 skill-load 或再次施放逻辑，区分“首次进入角色 state”和“再次命令已有 PO/appendage”；闭合 `sq_AddSkillLoad`、`sq_GetSkillLoad`、`use/isCooling`、`sq_RemoveSkillLoad` 和冷却启动条件。
18. 遇到 NUT API，先用 TypeSquirrel 查精确定义；没有候选就写“未找到相关函数”，不要补函数名。
19. 只读结果分为“当前主目标已确认”“辅助对照提示”“历史专项能力引用”“仍需实机验证”。

## 验收

- 技能 ID 已按正确职业 skill registry 解析。
- `.skl`、load_state、appendage 或 PO NUT 路径已列出。
- 结构化参数事实表只作为候选列义；目标 `.skl` 列数和上下文已重新核对。
- state/substate 的证据来自目标 PVF 文件，不是教程或旧样本。
- API 名称已用 TypeSquirrel 查过。
- 已明确哪些链路当前主目标未安装或未命中。
- 已说明命中、伤害、手感、同步、PVP 和客户端资源属于运行测试边界。
- 没有写 PVF，没有改客户端。

## 常见误判

- 把 `ForceUse_Character` 当成目标 PVF 可调用函数。
- 把 `substate == skillId` 当规则。
- 只看 `[executable states]` 就断定可强制。
- 新建 `*_load_state.nut` 后假设它会自动加载。
- 把历史专项输出中存在的 NUT 文件当成当前主目标事实。
- 把辅助对照 PVF 的富样本写法提升为主目标规则。
- 把 `atgunner`、`atmage`、`atfighter` 当作觉醒目录，而不是独立角色/分支 token。
