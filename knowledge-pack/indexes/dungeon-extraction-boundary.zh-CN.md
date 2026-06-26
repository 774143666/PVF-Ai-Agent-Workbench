# 副本提取输出边界

状态：默认可用

## 可写入报告的结论

- root dungeon 的 registry 解析结果。
- `.dgn -> map -> monster/passiveobject/APC/stackable/UI/audio` 的静态引用闭合状态。
- 缺失引用、读取错误、跨系统引用和客户端资源风险。
- 是否提供了 `ImagePacks2`，以及只读资源检查结果。

## 不可写入为事实的结论

- 客户端可进图、可通关。
- 门票扣除、任务条件、等级条件或服务端放行成功。
- 怪物刷出、AI 正常、Boss 判定、机关触发、路径门动作成功。
- 掉落概率、翻牌 UI、奖励发放、黑钻/PC 房逻辑正确。
- NPK、SoundPacks、Music 或客户端 UI 资源完整。

## 升级到导入前必须补齐

1. 源 PVF、目标 PVF 和目标客户端都已明确。
2. 目标 PVF 中所有冲突路径和 registry ID 已读回。
3. 生成可审阅的最小变更清单。
4. 写入只输出到显式目标 PVF。
5. 输出 PVF 重新打开读回。
6. 涉及客户端资源时单独检查 NPK/ImagePacks2。
7. 需要运行时结论时实机验证。
