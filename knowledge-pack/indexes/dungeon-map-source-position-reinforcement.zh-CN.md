# Dungeon / Map 资料线索补强

状态：已补强  
适用范围：副本注册、地图闭合、worldmap 入口、城镇入口、地图怪物、地图对象、门票、清算、客户端资源闭合  
边界：只读知识页；不证明实机可进图、刷怪正常、清算成功、翻牌成功、BGM/UI/IMG/NPK 正常或服务端放行。

## 核心结论

副本链路必须分层确认：

1. **入口链**：town gate -> worldmap registry -> `.wdm [dungeon]` -> dungeon registry。
2. **普通地图链**：dungeon registry -> `.dgn [map specification] / [boss map specification]` -> map registry。
3. **反向归属链**：map registry -> `.map [dungeon]` -> dungeon registry。
4. **特殊分支**：AdvanceAltar 等专属字段按自身父块读，不套普通 map specification。
5. **房间投放**：`.map [monster]`、`[passive object]`、`[special passive object]` 只说明静态投放。
6. **资源引用**：`.img/.ani/.act/.til/.ui` 只说明 PVF 写了引用，客户端完整性另验。

## 资料线索沉淀

- 副本教程和资料样例把 dgn、map、wdm 三层结构作为基础路线，适合指导初查。
- 示例中的 entering title、cutscene image、minimap image、worldmap pattern、pathgate object、map specification 等字段，只能作为字段家族线索。
- workflow 资料强调提取闭包只跟随选中副本依赖，不自动复制无关全局系统。
- 导入类资料必须视为 dry-run / dependency compare / missing refs 检查路线，不是当前主目标事实。
- 标签交叉线索显示 `[dungeon]` 等标签跨多个文件域出现；同名标签必须按父块和文件类型解释。

## 已封存主目标事实的用法

- 主目标注册副本全部可读，普通 `.dgn -> map` 和大量 `.map -> dungeon` 反向归属已经静态闭合。
- map、worldmap、town、region、monster、passiveobject、stackable、independentdrop 等 ID 都必须走对应 registry。
- 门票 `[required item]` 只写成入场消耗静态字段。
- independent drop 和 clear reward 与任务奖励、普通怪物掉落分开。
- `.map [monster]` 不重开 Monster 主线；`.map [passive object]` 不等同技能 passiveobject。
- 资源引用命中 PVF 不等于客户端 ImagePacks2/NPK 完整。

## 排查路线

遇到副本、地图、入口或资源问题时：

1. 先从对应 registry 定位 ID，不按数字外形猜。
2. 普通副本先读 `.dgn [map specification]` 和 `[boss map specification]`。
3. 旧式或特殊闭合再读 `.map [dungeon]` 和专属字段。
4. worldmap 问题按 town gate、worldmap、dungeon 三段查。
5. 怪物和对象只确认静态投放，实机刷出、AI、锁门和清算另测。
6. 门票、独立掉落、清算翻牌跳转到对应已封存 Quest/Drop 入口。
7. 红叉、黑图、缺音、UI 错位跳转到客户端资源或音频主线。

## 禁止推断

- 不能用教程样例 ID 替代主目标 ID。
- 不能把 `.dgn` 文件存在写成副本已注册。
- 不能把 `.map [dungeon]` 缺失直接写成地图废弃。
- 不能把 `[monster]` 静态投放写成实机刷怪成功。
- 不能把 `[required item]` 写成扣票成功。
- 不能把 clear reward 静态表写成翻牌 UI 或奖励发放成功。
- 不能用 PVF 资源引用证明客户端资源完整。

## 关联入口

- `encyclopedia/pvf-file-types/dungeon-map-worldmap.zh-CN.md`
- `task-cards/dungeon-map-spawn-entry-clear-resource-readonly-audit.zh-CN.md`
- `dictionaries/dungeon-map-spawn-entry-clear-resource-fields.zh-CN.md`
- `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`
- `indexes/quest-drop-reward-ticket-boundary.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
