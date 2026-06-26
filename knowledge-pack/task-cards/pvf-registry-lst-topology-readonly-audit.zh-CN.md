# PVF Registry / LST Topology 只读审计任务卡

状态：默认可用

用途：作为 `.lst` registry、ID 解析、注册路径存在性、重复路径、未注册文件和孤儿风险的短入口。本文只记录主目标 PVF 静态只读观察，不证明实机加载、客户端资源完整、服务端放行或可删除孤儿。

## 快速结论

- 主目标可读取 83 个 `.lst`，其中 62 个是文件路径 registry、19 个是名称/数值表、2 个为空表。
- 文件路径 registry 共 102778 条注册项，唯一注册路径 100491 个，注册路径存在 102361 条，缺失 417 条。
- 文件路径 registry 内未观察到重复 ID；有 8 个文件路径 registry 存在“多个 ID 指向同一路径”的重复路径现象。
- 跨文件路径 registry 重复数字 ID 有 6255 个；同一个数字在不同 registry 中可以指向完全不同对象。
- 302882 个文件未被文件路径 registry 直接注册；这不是可删除结论，很多 `.ani`、`.act`、`.ai`、`.atk`、`.key`、`.til` 等文件靠直接路径或资源链到达。
- `itemname.lst`、`monstername.lst`、`skillname*.lst`、`n_quest/epicquest.lst` 等属于名称/数值表，不能拿来判断文件路径缺失。

## 默认处理

1. 问数字 ID、`.lst`、registry、未注册文件、孤儿风险时，先读本任务卡。
2. 需要术语口径时，读 `dictionaries/pvf-registry-lst-topology-fields.zh-CN.md`。
3. 需要统计矩阵、缺失 registry、重复路径和跨 registry ID 风险时，读 `indexes/pvf-registry-lst-topology-orphan-boundary.zh-CN.md`。
4. 需要解释 `.lst` 文件类型时，读 `encyclopedia/pvf-file-types/lst-registry-topology.zh-CN.md`。

## 不能直接下结论

- 不能把裸数字 ID 当作全局对象 ID；必须先确认父块、字段和正确 registry。
- 不能把名称/数值表当成文件路径 registry。
- 不能把未注册文件直接写成无效孤儿或可删除文件。
- 不能把注册路径存在写成实机加载成功、UI 正常、客户端资源完整或服务端放行。
- 辅助对照 PVF 只能提示差异，不能覆盖主目标事实。

## 下一步测试建议

本主线不需要实机测试。后续如果进入生产改动，最小验证顺序是：

1. 确认目标字段所属父块。
2. 按父块选择正确 `.lst` registry。
3. 解析 ID 到 PVF 内部路径。
4. 读取目标文件确认存在和块结构。
5. 写入实验时再走备份、最小改动、保存到显式输出、读回和实机验收。

