# ServerParameter / Premium / PC Room / Growth Buff 文件类型

状态：默认可用

本文解释服务参数、契约/黑钻、PC 房、成长支援和经验/掉率/疲劳倍率静态入口是什么、如何路由、哪些结论必须验证。

## 是什么

本主线不是单一业务系统，而是一组位于 `etc/` 的静态参数和特权支持文件族：

- `etc/serverparameter.etc`：全局参数大表，可同时出现经验倍率、掉落/奖励倍率、疲劳活动参数、成长 buff 参数、premium card、PVP、经济和杂项表。
- `etc/premiumlist.etc`、`etc/premiumlist_new.etc`：契约、黑钻、特权、疲劳、经验、掉率和期限类条目。
- `etc/premiumserviceeffect.etc`：premium service 的图片索引、附加装备或可选附加装备入口。
- `etc/pcroom*.vm`：PC 房/黑钻贩卖机样输出池配置。
- `etc/worlddroppcroom*.etc`：PC 房/黑钻世界掉落相邻表。
- `etc/growthpowerrewardbuff.etc`、`etc/growthpowernpcdialog.etc`：成长支援 reward buff 和 NPC 对话入口；主目标当前只观察到空块骨架。

## 常见 registry

| Registry | 用途 |
| --- | --- |
| `stackable/stackable.lst` | 契约、券、材料、箱子、贩卖机代币等候选物品。 |
| `equipment/equipment.lst` | premium service 附加装备、晶体契约效果装备、成长合约等候选装备。 |
| 其他 registry | 个别数字可能跨 registry 命中；只有父文件和父块能决定解释口径。 |

## 典型路由

1. 查全局经验、疲劳、掉率、结果奖励：先读 `etc/serverparameter.etc`，再按标签分组。
2. 查契约、黑钻、疲劳/经验/掉率特权：读 `etc/premiumlist*.etc`，再解析 `[item]` 或 `[target item]` 相关候选。
3. 查特权效果展示或附加装备：读 `etc/premiumserviceeffect.etc`，再按 equipment registry 解析 `[add equipment list]`。
4. 查 PC 房/黑钻贩卖机：读 `etc/pcroom*.vm`，再解析 `[material]` 与 `[output]`。
5. 查 PC 房/黑钻世界掉落：读 `etc/worlddroppcroom*.etc [world drop]`，再解析候选物品。
6. 查成长支援：读 `etc/growthpowerrewardbuff.etc` 和 `etc/growthpowernpcdialog.etc`；主目标当前只可说有空块骨架。

## 常见误区

- 不要把 `serverparameter.etc` 字段写成服务器一定采用。
- 不要把 premium、黑钻、契约、PC 房或成长支援文本写成账号状态有效。
- 不要把倍率、阈值、权重、等级段写成最终概率、经验、疲劳或掉率公式。
- 不要把贩卖机输出池、premium card、world drop 或 growth package 写成物品实际发放。
- 不要把图片索引、服务效果装备或 UI 线索写成客户端显示正常。
- 不要用辅助对照的非空成长支援内容补主目标空块。

## 必须验证的地方

静态只读只能证明 PVF 内部配置存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 服务器是否实际读取这些参数。
- 账号是否拥有 PC 房、黑钻、契约、成长 buff 或 premium 状态。
- 疲劳、经验、掉率、奖励、世界掉落、premium card、贩卖机输出是否实际结算。
- UI 是否展示、图标是否正确、按钮是否可点、客户端资源是否完整。
- 服务端开关、DB/账号状态、活动时间、角色等级、疲劳消耗与这些静态表是否一致。

## 后续测试顺序

如果要从静态知识进入验证阶段，先选一个单点，不要混测整条主线：

1. 黑钻契约：确认 `premiumlist_new` 目标条目、stackable contract、premium service effect、UI/资源和账号状态。
2. PC 房世界掉落：确认 `worlddroppcroom` 候选物品、PC 房识别条件、掉落入口和实机发放。
3. 成长支援：确认主目标是否需要填充 growthpower 空块，再验证 NPC、等级段、礼包 registry 和实机发放。
4. 疲劳/经验倍率：确认 `serverparameter` 父标签、服务端采用路径和实机结算日志。

所有验证都必须走受控输出 PVF、读回和实机检查；不要覆盖源 PVF。
