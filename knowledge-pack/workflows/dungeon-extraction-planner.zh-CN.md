# 副本提取 Planner 流程

状态：默认可用

## 适用

用于把一个副本从源 PVF 中做只读提取规划，形成可审阅的文件闭包、registry 线索、缺失引用和客户端资源风险。

本流程只描述提取和预览，不写 PVF，不部署客户端，不证明目标客户端可进图、可通关或资源完整。真实导入必须另走生产 PVF 生命周期。

## 输入

- 源 PVF。
- dungeon ID、dungeon path 或 dungeon name 三选一。
- 可选的 `ImagePacks2` 路径，只用于客户端资源缺口检查。
- 输出目录，必须位于工作区内。

## 执行

1. 确认源 PVF 是只读来源，不是待覆盖目标。
2. 如果输入是数字，先按 `dungeon/dungeon.lst` 解析；不要用数字大小猜类型。
3. 运行副本 workflow 的 extract 模式，输出到独立目录。
4. 审阅 `manifest.json`，确认 root dungeon 唯一，记录提取文件数量。
5. 审阅 `missing_refs.txt` 和 `read_errors.json`。
6. 审阅 dungeon 到 map 的正向引用，以及 map 中 `[dungeon]` 的反向归属。
7. 审阅 map 中 monster、passiveobject、event monster、map object、pathgate object 等引用。
8. 对 monster、passiveobject、APC、stackable、clear reward、UI、audio 只记录闭合状态和风险，不把运行时效果写成事实。
9. 如果提供 `ImagePacks2`，只检查候选 `.img/.ani/.act/.til/.ui` 等资源风险；Script 侧引用不等于客户端资源存在。
10. 输出 preview index，供后续人工审阅或生产导入前使用。

## 常用命令

```powershell
node "tools\pvf-bridge\dungeon-workflow.js" --mode=extract --source-pvf="E:\path\Script.pvf" --dungeon-id=323 --out="pvf-lab\experiments\task\dungeon-extract"
node "tools\pvf-bridge\dungeon-workflow.js" --mode=extract --source-pvf="E:\path\Script.pvf" --dungeon-path="dungeon/Act2/DraconianTower.dgn" --out="pvf-lab\experiments\task\dungeon-extract" --imagepacks="E:\path\ImagePacks2"
```

## 输出审阅

- `manifest.json`：root、提取文件数、核心链路。
- `missing_refs.txt`：未闭合引用。
- `read_errors.json`：读取失败项。
- `asset_manifest.json`：仅在提供 `ImagePacks2` 时出现，用于客户端资源风险。

## 验收

- root dungeon 唯一。
- `read_errors` 为空。
- `missing_refs` 已人工分类，不静默忽略。
- map、monster、passiveobject、APC、stackable、UI、audio 的 registry 解析边界写清楚。
- 输出明确标记未写 PVF、未改客户端、不是可直接 apply 的 patch。

## 边界

- 提取闭包不是导入计划。
- registry 命中不证明运行时刷怪、AI、机关、掉落、翻牌或通关成功。
- `.dgn/.map/.ui` 中的资源引用不证明 `ImagePacks2`、NPK、SoundPacks 或 Music 完整。
- 需要进图、扣门票、刷怪、Boss、机关、掉落、翻牌、UI 和资源显示结论时，必须实机验证。
