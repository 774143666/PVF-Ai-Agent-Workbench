# RandomOption / Mystic 资料线索补强

状态：已补强  
适用范围：随机词条、魔法封印、装备随机规则、mystic circle、avatar hidden option、解封/操作/限制类标签  
边界：只读知识页；不证明抽取概率、属性生效、扣费、UI 展示、客户端资源或服务端放行。

## 核心结论

随机属性相关内容必须分层读：

1. **普通随机词条池**：从 `etc/randomoption/randomoption.lst` 闭合到 `etc/randomoption/options/*.etc`。
2. **技能随机词条风险**：`randomoptionskill.lst` 只说明注册入口存在；主目标当前对应文件缺失，不能当可用池。
3. **支持表**：overall、grouping、selection、quantity、part、numbering、auction category、regeneration 等文件是全局选择/数量/部位/分类/再生配置。
4. **装备侧规则**：`.equ` 内 `[random option]`、`[no random]`、`[Force Result Item Rule]` 是装备文件字段，不是词条池本体。
5. **avatar hidden option / mystic**：`mystic circle` 属于 avatar roulette 语境，不能和 equipment `[hidden option]` 混写。
6. **操作/解封/限制标签**：`[random option operate]`、`[random option unseal]`、`[blocked random option]` 等只能作为继续定位父块的线索。

## 资料线索沉淀

- 资料线索支持 `randomoption.lst -> options/*.etc` 是随机词条的优先闭合路线。
- 注释线索把 equipment `[random option]` 指向魔法封印方向；这能解释为什么主目标 `.equ` 中值 `1` 值得保留，但不能证明实机一定抽词条。
- 隐藏属性、mystic circle、emblem、avatar hidden option 经常在资料里并列出现；Workbench 必须把它们当相关但不同的入口。
- 标签交叉线索显示 random option 相关标签会出现在 bin、equ、etc、npc、stk 等多个域；同名标签跨域时不能自动复用含义。
- 源码线索可帮助定位 randomoption/avatar/hidden/mystic 相关文件或字段，但不能替代主目标 PVF 观察。

## 已封存主目标事实的用法

- 主目标普通随机词条：16 个注册项全部闭合，可作为当前主目标普通词条池规模。
- 主目标技能随机词条：20 个注册目标缺文件，只能写风险，不能写可用。
- 主目标装备侧 `[random option]`：58 处且当前值均为 `1`，只能写成装备侧静态规则字段。
- 主目标装备侧 `[no random]`：221 处，均为空体存在标记，不能按整数值读取。
- 主目标 `[Force Result Item Rule]`：2374 处，后接两个整数，数字列语义未封死。
- 主目标 avatar roulette：`[mystic circle]` 内部数字未按常规 registry 闭合，不能猜成道具、装备或商店 ID。
- 主目标缺口：未观察到 equipment `[hidden option]`，也没有 `stackable/emblem/hidden_option.stk`。

## 排查路线

遇到随机属性、魔法封印、洗词条、解封、mystic、隐藏属性问题时：

1. 先确认是词条池、支持表、装备侧规则、avatar hidden option，还是操作/解封类标签。
2. 所有数字 ID 先按父块和对应 registry 解析；不要按数字外形猜。
3. 普通词条先走 `randomoption.lst`，再读 `options/*.etc` 的 `[option]`、`[level]` 和属性字段。
4. 装备规则必须从 equipment registry 定位 `.equ`，再读 `[random option]`、`[no random]`、`[Force Result Item Rule]`。
5. mystic / avatar hidden option 先读 avatar roulette 文件，和 equipment `[hidden option]` 分开记录。
6. 资料里出现但主目标没有的入口，只写“线索存在，主目标未确认”。

## 禁止推断

- 不能用资料中的字段名替代主目标字段事实。
- 不能用 `[random option] = 1` 证明实机抽词条成功。
- 不能把权重列写成已验证概率。
- 不能把 `mystic circle` 数字猜成 stackable、equipment、商店物品或消耗品。
- 不能把 avatar hidden option 写成 equipment `[hidden option]`。
- 不能证明解封扣费、再生消耗、UI 展示、属性应用、客户端资源或服务端放行。

## 关联入口

- `task-cards/randomoption-mystic-readonly-audit.zh-CN.md`
- `dictionaries/randomoption-mystic-fields.zh-CN.md`
- `indexes/randomoption-mystic-equipment-boundary.zh-CN.md`
- `indexes/equipment-rule-fields.zh-CN.md`
