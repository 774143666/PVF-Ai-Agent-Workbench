# Avatar / Emblem / Socket / Clone / Aura / Fashion Package 只读审计任务卡

状态：默认可用。

用途：当任务涉及时装、徽章、镶嵌孔、克隆时装、光环、时装礼包、礼包开出装备或 `aura/aura.lst` 时，先读本任务卡，再进入字段字典和边界索引。

## 适用问题

- 某个时装装备是否已在 equipment registry 中注册。
- 某个徽章道具能镶嵌到哪些 socket token。
- `[avatar type select]`、`[avatar select ability]`、`[emblem socket default]` 应如何分开读取。
- `[package data]` 中的数字 ID 应如何解析。
- `[aurora avatar]`、`[aura ability]`、`[aurora graphic effects]` 和 `aura/aura.lst` 如何分层。
- 克隆、光环、礼包、客户端资源之间的静态边界是什么。

## 默认读取顺序

1. `dictionaries/avatar-emblem-socket-clone-aura-fashion-package-fields.zh-CN.md`
2. `indexes/avatar-emblem-socket-clone-aura-fashion-package-boundary.zh-CN.md`
3. `encyclopedia/pvf-file-types/avatar-emblem-aura-package.zh-CN.md`
4. 如涉及图像资源，再读 `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
5. 如涉及随机属性或 hidden option，只引用 `indexes/randomoption-mystic-equipment-boundary.zh-CN.md`
6. 如涉及普通装备字段，只引用 `dictionaries/equipment-fields.zh-CN.md`
7. 如涉及容器/礼包通用字段，只引用 `indexes/stackable-container-package-boundary.zh-CN.md`

## 主目标已确认

| 项目 | 数量 |
| --- | ---: |
| PVF 总文件 | 402963 |
| equipment registry 条目 | 72631 |
| stackable registry 条目 | 10372 |
| aura registry 条目 | 12 |
| avatar / aura 相关装备候选 | 48828 |
| 已注册候选装备 | 45478 |
| 未注册候选装备 | 3350 |
| 徽章类 stackable | 610 |
| 礼包类 stackable | 3757 |
| `[avatar type select]` 块 | 42692 |
| `[avatar select ability]` 块 | 46084 |
| `[emblem socket default]` 块 | 497 |
| `[avatar emblem target type]` 块 | 558 |
| `[package data]` 块 | 3605 |
| `[aura ability]` 块 | 546 |
| `[aurora graphic effects]` 出现次数 | 575 |

## 审计动作

1. 先判断对象属于 equipment、stackable、aura registry 还是 etc 配置。
2. 数字 ID 必须按父块解析：装备 ID 查 equipment registry，道具 ID 查 stackable registry。
3. 时装装备先看 `[equipment type]`，再看 avatar / aura / socket 相关块。
4. 徽章道具先看 `[stackable type] [avatar emblem]`，再看 `[avatar emblem target type]`。
5. 礼包道具先看 `[stackable type]` 和 `[package data]`，再逐项解析 ID/数量组。
6. 光环先区分装备 `.equ` 中的 aura 字段和 `aura/aura.lst -> .ora`。
7. 客户端 `.img/.ani/.ptl` 资源另走 Client Assets 主线，不在本任务卡中下完整性结论。
8. 跨版本导入光环时，额外对照目标同类光环装备的 `[avatar func filter]`、`[equipment type]`、职业路径和 `[aurora graphic effects]` 结构。
9. 对 `[aurora graphic effects]`，继续列出 `.ani` 依赖和 ANI 内部 IMG 风险；图标闭包不能替代光环外观闭包。
10. 光环最终是否可见、传送能力是否有效、冷却是否正确，仍以目标客户端实机为准。

## 禁止写成的结论

- 不把注册存在写成实机可穿戴。
- 不把 socket token 存在写成实机可镶嵌。
- 不把 `[package data]` 闭合写成实机开包成功或发放成功。
- 不把 clone 关键词写成克隆系统可用。
- 不把 aura 字段写成光环实机显示、传送、冷却或特效正常。
- 不把 `.ani/.ptl/.img` 引用写成客户端资源完整。
- 不把辅助对照差异提升为主目标事实。
- 不把某个 `[avatar func filter]` 数字写成所有光环导入的通用修复。

## 允许的结论口径

- “主目标静态观察到该时装装备已通过 equipment registry 注册，并带有 avatar 类型字段。”
- “主目标静态观察到该徽章道具通过 stackable registry 注册，目标 socket token 位于 `[avatar emblem target type]`。”
- “主目标静态观察到该礼包 `[package data]` 中的 ID 可解析到 equipment / stackable registry。”
- “主目标静态观察到该光环存在 aura 字段或 `.ora` registry 链，但不证明客户端显示正常。”

## 下一步测试建议

实机测试应按最小样本拆开：

- 一件普通时装：验证穿戴、外观、可选能力 UI。
- 一个徽章：验证 socket 兼容、镶嵌 UI、扣除与属性显示。
- 一个礼包：验证开包、发放、背包空间、绑定状态。
- 一个光环：验证穿戴、特效、传送能力或冷却行为。
- 一个 clone 样本：验证克隆 UI、外观继承和客户端资源。
