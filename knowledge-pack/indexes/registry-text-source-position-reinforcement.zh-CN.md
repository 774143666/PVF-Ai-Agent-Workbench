# Registry / Text Source-Position Reinforcement

状态：默认可用

用途：记录 PVF Registry / LST Topology 与 Text / StringLink / Encoding 两条已封存主线的资料库线索补强口径。本文只解释 source-position 如何辅助判断，不覆盖主目标 PVF 只读结论，不授权写 PVF。

## 总结论

前两条主线不需要返工；需要补一个解释层。

原因：

- 既有 registry/text 结论的核心数字来自主目标 PVF 只读观察。
- 资料库线索没有推翻既有统计。
- 资料库线索主要证明：这些边界不是凭感觉设定，而是符合常见 PVF 工具、语法、教程和历史材料中的风险提示。

## Registry / LST 补强口径

source-position 线索支持以下口径：

- `.lst` 更接近“key/value 表”，不是天然等于“文件路径 registry”。
- 同样是 `.lst`，可能是 ID 到路径、ID 到名称、ID 到数值、普通键到值，必须按父目录、表内容和使用上下文判断。
- 数字 ID 没有全局语义。看到一个数字时，先确认它属于哪个父块和哪个 registry，再解析。
- 教程或工具中的示例 ID 只能当找样本的线索，不能直接当主目标事实。
- 写入前必须做同 registry 内重复 ID、重复路径和目标路径存在性检查。

对既有主线的影响：

- 不改 `PVF Registry / LST Topology / Orphan Boundary` 的统计。
- 强化“名称/数值表不是路径 registry”的边界。
- 强化“跨 registry 数字 ID 重复是常态风险”的边界。

## Text / StringLink / Encoding 补强口径

source-position 线索支持以下口径：

- 反引号字符串内部可能出现像 `[tag]` 的文本；解析时不能把字符串内文字误判为真实标签块。
- StringLink 样 token 和直接反引号文本只能证明静态文本存在，不能证明 UI 正常显示。
- `.str`、名称表和 `stringtable.bin` 都可以作为文本资源候选，但静态只读不能证明运行时加载优先级。
- 编码、导入、数据库写入和回写流程都有 mojibake 风险；资料库线索不能证明中文写入已安全。
- 任何文本写入结论都必须另走受控写入、读回和实机显示验证。

对既有主线的影响：

- 不改 `Text / StringLink / Encoding / Localization Boundary` 的统计。
- 强化“静态文本存在不等于 UI 显示成功”的边界。
- 强化“不要把字符串内部的标签形文字当结构标签”的解析边界。

## 路由建议

当问题涉及以下方向时，先读对应主线，再读本文作为补强：

- `.lst` 是什么、某个数字 ID 应该按哪个 registry 解析。
- 注册路径缺失、重复路径、未注册文件、孤儿文件判断。
- StringLink、`.str`、名称表、`stringtable.bin`、文本字段和编码风险。
- 资料库、教程、工具源码、GM 字段能不能直接当 Workbench 结论。

默认阅读顺序：

1. `safety/README.zh-CN.md`
2. `indexes/pvf-registry-lst-topology-orphan-boundary.zh-CN.md` 或 `indexes/text-stringlink-encoding-localization-boundary.zh-CN.md`
3. `indexes/registry-text-source-position-reinforcement.zh-CN.md`

## 不能外推

本文不能证明：

- 未注册文件是孤儿或可以删除。
- 某个 `.lst` 数字 ID 在所有 registry 中含义一致。
- `.str`、名称表或 `stringtable.bin` 的运行时优先级。
- 中文写入流程安全。
- UI 字体、换行、文本溢出、客户端资源、服务端放行或实机行为正常。

