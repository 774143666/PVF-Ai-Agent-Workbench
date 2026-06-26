# 实机验证 PASS 吸收任务卡

状态：默认可用

先读：

- `safety/README.zh-CN.md`
- `workflows/runtime-validation-absorption.zh-CN.md`
- `indexes/knowledge-index.json`

执行：

1. 确认当前任务只是知识吸收；不要写 PVF，不要部署客户端。
2. 运行或参考 `workbench.bat absorb new --id <run-id> --title "<title>" --domain <domain> --status PASS`。
3. 把 PASS 结论写成“当前样本已验证”，并明确没有覆盖的边界。
4. 同步更新字段词典、边界索引、任务卡、workflow、安全护栏和完成状态中受影响的最小文件集。
5. 如果涉及中文/StringLink 文件，只能写“需客户端 UI 文本 smoke check”或“已完成 smoke check”，不要只凭 PVF 读回下结论。
6. 更新 `knowledge-pack/MANIFEST.json`。
7. 运行 `workbench.bat knowledge-check` 和 `workbench.bat doctor check`。

验收：

- clean pack 中没有真实 PVF、客户端、实验输出或报告绝对路径。
- 没有把单一样本扩大成全局规则。
- 自检通过，最终回复说明已吸收项和仍未证明项。
