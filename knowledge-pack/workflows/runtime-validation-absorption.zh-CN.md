# 实机验证结论吸收流程

状态：默认可用

用途：把一次实机 PASS、FAIL 或负例整理进 clean `knowledge-pack`，避免结论散落在报告、对话和实验目录里。

## 原则

- clean pack 只写可复用结论、字段边界、workflow 护栏和任务卡，不写真实路径、长证据链或实验输出。
- 单一样本只能写成“当前样本证明/否定”，不能写成全局机制。
- 失败样本和负例必须作为边界保留，不能被吸收成默认可用。
- 涉及中文、StringLink、NPC 文本、道具名、描述或副本文本时，PVF 读回正常不等于客户端 UI 文本安全。

## 操作

1. 生成本机 checklist：

   ```bat
   workbench.bat absorb new --id <run-id> --title "<title>" --domain <domain> --status PASS
   ```

2. 根据 checklist 定位需要更新的 clean pack 文件，通常包括：

   - `dictionaries/`：字段含义和已验证样本边界。
   - `indexes/`：open gap、negative sample、完成状态和专题边界。
   - `task-cards/`：Agent 下次执行同类任务时必须遵守的短入口。
   - `workflows/`：会影响流程顺序、验证步骤或风险处理的规则。
   - `safety/`：新发现的编码、覆盖、部署或客户端污染风险。

3. 更新 `knowledge-pack/MANIFEST.json` 的新增条目、bytes、sha256 和 summary。
4. 运行 `workbench.bat knowledge-check`。
5. 运行 `workbench.bat check` 或 `workbench.bat doctor check`。
6. 扫描 clean pack，确认没有误写本机绝对路径、实验 PVF 路径、客户端路径、报告路径或 KV 证据链。

## 验收

- 结论能在词典和边界索引里找到。
- workflow 或 task card 已覆盖下一次 Agent 会踩到的风险。
- manifest 与文件内容一致。
- clean pack 自检通过。
