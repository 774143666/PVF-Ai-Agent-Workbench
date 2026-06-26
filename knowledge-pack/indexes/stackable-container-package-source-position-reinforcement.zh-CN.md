# Stackable Container / Package 资料线索补强索引

状态：已补强

适用范围：Stackable 容器、礼包、选择箱、随机箱、booster 选择器、礼包预览资源。

## 定位

本页用于说明：资料线索对 Stackable Container / Package 主线的作用是“定向排查”，不是直接产出字段事实。Workbench 的字段事实仍以主目标 PVF 只读观察为准。

## 资料线索确认的排查方向

资料线索与已封存主线一致支持以下排查顺序：

1. 先从 `stackable/stackable.lst` 解析目标 `.stk`。
2. 读取 `[stackable type]`，初步区分普通道具、booster、booster selection、cera package 等类型线索。
3. 固定礼包重点看 `[package data]`。
4. 可选礼包重点看 `[package data selection]` 或 booster 选择器字段。
5. booster/选择器重点看 `[booster info]`、`[booster selection num]`、`[booster select category]`。
6. 候选块出现 `[equipment]`、`[avatar]`、`[stackable]`、`[creature]` 时，按块名选择 registry，不按数字外形猜。
7. 随机箱重点看 `[random]`、`[random list]` 和权重类数字，但概率必须另行验证。
8. 预览资源重点看 `[avatar package preview info]` 等 PVF 内引用，但客户端资源完整性另验。

## 已加固边界

- `[package data]` 中的数字列不全是 ID；可能混有数量、权重、分类或标志。
- `[package data selection]` 只能证明可选候选配置存在，不能证明 UI、限选、发奖实机正常。
- `[booster info]` 可以为空，也可以包含候选池；空块不能直接判为无效。
- `[avatar]` 候选仍属 equipment 语境；不要按 stackable 解析。
- `[creature]` 候选优先按 equipment creature 商品/蛋语境核查；不要直接跳到 creature registry。
- `[random list]` 的权重列不是已验证实机概率。
- 预览 IMG 引用不证明客户端资源存在。

## 路由建议

当问题涉及“礼包字段为什么这样查”、“固定礼包和可选礼包怎么区分”、“随机箱概率能不能静态证明”、“宠物/装扮/光环自选礼盒候选 ID 走哪个 registry”、“资料库是否支持这些字段”时，先读：

- `safety/README.zh-CN.md`
- `task-cards/stackable-container-package-readonly-audit.zh-CN.md`
- `dictionaries/stackable-container-package-fields.zh-CN.md`
- `indexes/stackable-container-package-boundary.zh-CN.md`
- 本页

## 不能外推

本页不证明：

- 礼包实机可以打开。
- 可选礼包 UI 正常。
- 奖励发放成功。
- 随机概率与静态权重一致。
- 背包空间、堆叠、绑定、期限、职业限制全部生效。
- 商城购买后自动打开成功。
- 客户端图标、预览图或 UI 资源完整。
- 服务器允许对应开包或发奖。
