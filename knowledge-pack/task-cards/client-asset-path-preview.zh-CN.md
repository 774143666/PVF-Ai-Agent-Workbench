# 客户端资源路径预览任务卡

状态：默认可用

## 先读

- `safety/README.zh-CN.md`
- `workflows/client-asset-path-preview.zh-CN.md`
- `indexes/client-asset-path-boundary.zh-CN.md`
- `dictionaries/client-assets-imagepacks-ui-fields.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`

## 执行

1. 确认只做资源路径预览。
2. 收集 PVF 或 planner 输出中的资源引用。
3. 按来源类型分组：装备/光环/宠物、副本、UI、monster、passiveobject、audio。
4. 如果提供客户端目录，只做存在性或候选容器检查。
5. 输出命中、未命中和实机验证风险。

## 验收

- PVF 引用和客户端资源存在性分开。
- 未命中资源已列出。
- 报告明确未写 NPK、未改客户端。

## 禁止

- 不自动加入、删除、合并 NPK/IMG。
- 不把资源存在写成图层或动画运行正确。
- 不把图标闭合写成光环/时装外观成功。
