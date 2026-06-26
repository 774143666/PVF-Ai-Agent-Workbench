# Material Routing Rules

## 默认原则

- 知识包优先，原始资料按需倒查。
- 结论层优先于旧报告。
- 目标 PVF 可观察事实优先于教程和社区资料。
- Script.pvf 引用不证明客户端 ImagePacks2/NPK 资源完整。

## 推荐读取顺序

1. `knowledge-pack/README.zh-CN.md`
2. `knowledge-pack/indexes/knowledge-index.json`
3. 路由命中的 `knowledge-pack/encyclopedia/`、`knowledge-pack/dictionaries/`、`knowledge-pack/workflows/` 或 `knowledge-pack/task-cards/`
4. workspace profile 指向的外部资料库

## 资料可信等级

- `runtime-validated`：目标 PVF 写入、读回、实机验证，可作为配方基础，但仍需目标文件复核。
- `production-recipe`：已整理成生产流程，可执行但必须按目标闭合。
- `target-readonly`：目标 PVF 只读闭合，只能做规划或前置小样本。
- `source-position`：教程、源码、工具字段和社区资料线索，不授权写 PVF。
- `negative-sample`：失败或禁止外推路线，不应重复。

## 禁止默认行为

- 不全量读取 candidate artifacts。
- 不全量读取高价值资料库。
- 不把路径相似当作闭合证据。
- 不把跨客户端样例直接套入当前目标。
