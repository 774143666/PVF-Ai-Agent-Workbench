# Item / Stackable Planner 输出边界

状态：默认可用

## 输出类型

| 输出 | 含义 | 边界 |
| --- | --- | --- |
| root | 通过 registry 解析出的主装备或道具 | root 唯一不等于依赖完整。 |
| candidates | planner 认为相关的 PVF 文件候选 | 候选不是导入清单，需人工审阅。 |
| relations | 源文件到目标文件或 ID 的关系 | closed 只表示只读解析闭合，不证明 runtime。 |
| unresolvedReferences | 未闭合引用 | 可能是缺文件、模板、客户端资源、未支持 tag 或跨系统引用。 |
| registryAdditionPreview | registry 补登线索 | 不是可直接写入的 `.lst` patch。 |
| externalAssetRefs | 外部 IMG / 客户端资源引用 | 必须另走 ImagePacks2 / NPK 检查。 |
| equipmentPartSetBlocks | `equipmentpartset.etc` 只读块 | 不自动合并、不重排、不补全。 |
| auraVisualRisk | 光环/时装外观补充风险 | 需要另查 `[avatar func filter]`、`[aurora graphic effects]`、ANI 内 IMG 和 NPK 容器来源；不是 planner 默认导入闭包。 |

## 通过标准

- `rootCount == 1`
- `readErrorCount == 0`
- `boundary.pvfWritten == false`
- `boundary.clientTouched == false`
- `boundary.outputIsImportPlan == false`

warning 或 unresolved 不必然阻断只读规划，但必须进入报告。

## 不可解释为

- 不等于目标物品可在游戏内正常使用。
- 不等于客户端资源完整。
- 不等于 PVF 导入 patch。
- 不等于技能、宝珠、宠物、光环、礼包运行时语义已验证。
- 不等于光环外观已闭合；图标资源闭合不能替代穿戴视觉验证。

## 后续升级条件

若要从 planner 升级到真实导出 / 导入：

1. 明确源 PVF 和目标 PVF。
2. 建立 lab session。
3. 备份源 PVF。
4. 生成可审阅的最小变更清单。
5. 保存到显式输出 PVF。
6. 重新打开输出 PVF 读回。
7. 若涉及外观、图标、动作或 NPK，另做客户端资源验证。
8. 若涉及光环或时装外观，另做目标客户端穿戴视觉验证。
