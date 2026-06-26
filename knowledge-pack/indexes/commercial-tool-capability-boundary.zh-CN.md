# 商业工具能力复原边界

状态：需验证

## 用途

本入口只记录商业 PVF 工具能力对 Workbench 的复原边界。商业工具源码和 UI 只作为能力线索，不进入纯净知识包。

## 可吸收

- 能力名称和输入 / 输出形态。
- 是否适合复原为只读 planner。
- 可复用的 Workbench 能力域。
- 明确的不复原边界。

## 不吸收

- 源码方法体。
- UI 控件、按钮证据、行号证据链。
- 授权、群验证、数据库验证、机器码验证。
- 硬编码路径和本地环境假设。
- NUT/SQR 打乱、混淆、批量破坏性写入逻辑。
- NPK 删除、合并、写入行为；这类动作必须另行授权。

## 当前复原路线

| 能力域 | 处理 |
| --- | --- |
| 装备 / stackable / 宝珠 / 礼包 / 宠物 / 光环相邻依赖 | 优先复原为只读 planner。 |
| 副本 / map / APC | 进入提取类能力路由，复用现有 workflow，不重复造核心工具。 |
| NPK / ImagePacks2 查询 | 可后续做只读资源索引；写 NPK 需单独授权。 |
| recipe / quest / 礼包生成器 | 延后为 authoring template，不作为 extraction planner。 |
| 授权验证、群验证、NUT/SQR 打乱 | 禁止复原为默认能力。 |

## 道具类吸收边界

- 礼包、宝珠、宠物和光环能力只吸收为 planner、workflow 路由和运行时验收分层。
- 礼包 wrapper、package data、booster/random/selection 子层、child item 必须分别读取，不互相替代。
- 宝珠只读链路不证明附魔成功；宠物蛋可用不证明礼包 wrapper 可打开；光环装备成功不证明视觉特效正常。
- 礼包生成器、抽奖模拟、服务端放行和客户端资源打包保持 authoring 或 runtime gap，不并入默认 extraction planner。

## 默认入口

- `indexes/extraction-capability-router.zh-CN.md`
- `workflows/item-stackable-dependency-planner.zh-CN.md`
- `workflows/equipment-avatar-aura-creature-extraction-planner.zh-CN.md`
- `workflows/stackable-package-orb-card-extraction-planner.zh-CN.md`
- `workflows/client-asset-path-preview.zh-CN.md`
- `workflows/dungeon-extraction-planner.zh-CN.md`
- `workflows/apc-extraction-planner.zh-CN.md`

## 边界

商业工具输出通常是提取或补登线索，不是目标 PVF 可直接使用的生产计划。所有 ID、路径、registry、客户端资源都必须在目标 PVF 和目标客户端重新闭合。

Workbench 不保留商业工具源码、实验样本、样本道具 ID、按钮语义或证明链。可迁移知识只保留能力路由、字段读法和执行边界。
