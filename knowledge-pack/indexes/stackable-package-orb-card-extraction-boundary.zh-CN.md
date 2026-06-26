# Stackable / 礼包 / 宝珠 / 卡片提取输出边界

状态：默认可用

## 可写入报告的结论

- root stackable 的 registry 解析结果。
- `[stackable type]` 和父块类型。
- 容器类候选道具、装备、数量、概率/权重字段。
- 宝珠/卡片的 `[enchant]`、目标装备类型、材料需求和相关 monster/equipment/stackable 线索。
- icon、string link、external asset refs 风险。
- unresolved references 和 read errors。

## 不可写入为事实的结论

- 礼包、宝箱、选择箱、随机箱可正常打开。
- 抽奖概率、保底、账号限制或服务端发奖逻辑正确。
- 宝珠或卡片可成功附魔。
- 材料扣除、金币扣除、UI 显示或说明文本正确。
- 客户端资源完整。

## 升级到 authoring 或写入前必须补齐

1. 目标 PVF 中同 ID、同路径、同 registry 冲突已读回。
2. 字段父块和候选 registry 已人工确认。
3. 生成最小变更清单。
4. 写出到显式输出 PVF。
5. 输出 PVF 读回。
6. 开箱、附魔、材料扣除、UI 和资源显示必须实机验证。
