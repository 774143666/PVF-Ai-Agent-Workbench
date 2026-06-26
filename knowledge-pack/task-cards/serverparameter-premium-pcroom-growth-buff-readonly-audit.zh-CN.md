# ServerParameter / Premium / PC Room / Growth Buff 只读核查

状态：默认可用

用途：作为服务参数、契约/黑钻、PC 房、成长支援、经验/掉率/疲劳倍率静态入口的短任务卡。本文只记录主目标 PVF 只读观察，不证明服务器采用、账号状态有效、PC 房识别、契约/黑钻生效、疲劳/经验/掉率最终结算或 UI 正常。

## 快速结论

- 本主线复用 ETC / Event Config、Clear Reward / Probability、Event Reward Delivery、Dungeon、Character、Client UI Layout 等已封存入口，不重开这些大主线。
- 主目标命中 `etc/serverparameter.etc`，它是高风险全局参数文件，包含经验、掉落、结果奖励、疲劳、成长 buff、premium card、频道、PVP、经济和杂项表。
- 主目标命中 `etc/premiumlist.etc`、`etc/premiumlist_new.etc`、`etc/premiumserviceeffect.etc`，可见契约/黑钻/服务效果类条目、疲劳/经验/掉率字段、服务效果图片索引和附加装备列表。
- 主目标命中 `etc/pcroom.vm`、`etc/pcroom3.vm`、`etc/pcroom4.vm`、`etc/worlddroppcroom.etc`、`etc/worlddroppcroom2.etc`、`etc/worlddropwarareapcroom.etc`。这些是 PC 房/黑钻贩卖机和世界掉落相邻配置，不等同于清算翻牌本体。
- 主目标命中 `etc/growthpowerrewardbuff.etc` 与 `etc/growthpowernpcdialog.etc`，但当前观察到的主目标内容是空块骨架：`[breakaway section]`、`[exp reward]`、`[package reward]`、`[Dialog]` 块存在但无实质条目。
- 辅助对照同名文件族存在，且成长支援文件为非空配置；这只提示同类 PVF 可以扩张，不覆盖主目标“空块骨架”的事实。

## 默认处理

1. 问服务参数、全局经验、全局掉率、疲劳参数、成长 buff、契约、黑钻、PC 房、premium card 或特权倍率时，先读本任务卡。
2. 需要字段口径时，读 `dictionaries/serverparameter-premium-pcroom-growth-buff-fields.zh-CN.md`。
3. 需要文件矩阵、ID 解析样本和辅助差异时，读 `indexes/serverparameter-premium-pcroom-growth-buff-boundary.zh-CN.md`。
4. 需要文件类型说明时，读 `encyclopedia/pvf-file-types/serverparameter-premium-pcroom-growth-buff.zh-CN.md`。
5. 如果问题转向清算翻牌、独立掉落、任务奖励、活动邮件、UI 或客户端资源，转读对应已封存主线。

## 可接受结论

- 可以说主目标存在服务参数、契约/黑钻、PC 房、成长支援和 premium service 的静态入口文件。
- 可以说 `etc/serverparameter.etc` 同时承载经验倍率、掉落/奖励倍率、疲劳/成长 buff 参数、premium card 候选和多个非本主线参数块。
- 可以说 `etc/premiumlist*.etc` 中观察到 `[fatigue]`、`[exp]`、`[bonus exp]`、`[quest item drop rate]`、`[independent drop rate]`、`[unlimit fatigue]`、`[inventory limit]` 等静态字段。
- 可以说 `etc/premiumserviceeffect.etc` 的 `[premium service]` 条目可通过 `[add equipment list]` 或 `[add selectAble equipment list]` 指向 equipment registry。
- 可以说 `etc/worlddroppcroom*.etc [world drop]` 的候选物品数字要按 stackable/equipment 等上下文解析。
- 可以说主目标成长支援 reward buff / NPC dialog 是空块骨架，辅助对照提供非空样式提示。

## 禁止结论

- 不把 `serverparameter` 字段写成服务器一定读取或采用。
- 不把 PC 房、黑钻、契约、成长 buff 写成账号状态有效或实机已生效。
- 不把 `[drop prob]`、`[result reward prob]`、`bonusrate`、`exp`、`fatigue`、`premium card drop` 写成最终概率、经验、疲劳或奖励结算成功。
- 不把 premium service 图片索引或附加装备写成 UI 正常、图标显示或效果已套用。
- 不把贩卖机 `[output]`、世界掉落 `[world drop]` 或成长礼包 `[package reward]` 写成物品实际发放。
- 不把辅助对照的非空成长支援配置、更多 PC 房输出池或差异字段提升为主目标事实。

## 下一步测试建议

本主线当前只做静态知识封存。后续如果要验证实际效果，最小顺序是：先选单一入口，例如黑钻契约、PC 房世界掉落或成长 buff；再确认目标文件、相关 item/equipment registry、客户端 UI/资源、服务端开关和账号状态；最后走受控输出 PVF、读回和实机验证。不要直接改源 PVF。
