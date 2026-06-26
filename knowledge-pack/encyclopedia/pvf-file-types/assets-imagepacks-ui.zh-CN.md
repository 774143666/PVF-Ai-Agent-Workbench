# ImagePacks2 / NPK / IMG / UI

状态：已完成静态只读封存

## 用途

客户端资源承载贴图、动画、UI、图标、地图资源和部分表现层内容。Script.pvf 只说明引用，不保证客户端资源完整。

## 常见对象

- `ImagePacks2`
- `.npk`
- `.img`
- `.ani`
- `.act`
- `.ui`
- `.pos`
- `list.txt`

## 规则

- PVF 资源引用和客户端资源存在是两件事。
- 缺图、红叉、动作缺失、UI 缺失需要客户端侧检查。
- 修改 NPK、IMG 或客户端目录需要单独授权。
- 新整合 NPK 与原客户端资源共存时，要确认命名、加载顺序和冲突。
- ImagePacks2 静态命中只说明 NPK/IMG 索引中可找到候选路径，不证明实机渲染正常。
- ImagePacks2 静态未命中是资源风险，不等于实机必定红叉。

## 写入边界

默认不改客户端。需要客户端资源时，必须明确目标客户端、备份、输出资源、部署方式和恢复方案。

## 主线入口

- `task-cards/client-assets-imagepacks-ui-readonly-audit.zh-CN.md`
- `dictionaries/client-assets-imagepacks-ui-fields.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
