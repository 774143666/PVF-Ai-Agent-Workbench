# Clear Reward / Independent Drop / Probability 文件类型

状态：默认可用

本文解释清算奖励、翻牌、独立掉落、PC 房/黑钻世界掉落和全局概率/倍率支持表是什么、如何路由、哪些地方必须验证。

## 是什么

清算/翻牌/独立掉落不是单一文件完成的系统，而是多个静态配置层组合：

- `etc/itemdropinfo_clearreward.etc`：清算掉落、翻牌、金牌、PC 房卡片、稀有度和 item drop ref 支持表。
- `etc/serverparameter.etc`：全局掉落、结果奖励、稀有度、幸运点、premium card 和各类倍率支持表。
- `etc/independentdrop.lst` 与 `etc/independentdrop/*.etc`：独立掉落 registry 与候选列表。
- `etc/bloodclearreward.etc`：特殊清算奖励权重表。
- `etc/worlddroppcroom*.etc`：PC 房/黑钻相关世界掉落表。
- `etc/premiumlist*.etc`：契约、成长、特权类倍率线索。
- `dungeon/*.dgn`：局部清算奖励、结果卡、金牌开关、特殊副本掉落概率和奖励结构。

## 常见 registry

| Registry | 解析对象 |
| --- | --- |
| `etc/independentdrop.lst` | independentdrop ID -> `etc/independentdrop/*.etc` |
| `stackable/stackable.lst` | 消耗品、材料、箱子、任务物品、券、钥匙等候选物品 |
| `equipment/equipment.lst` | 装备、符文、宠物装备、武器等候选物品 |
| `dungeon/dungeon.lst` | dungeon ID -> `dungeon/*.dgn` |

## 典型路由

1. 查独立掉落：`etc/independentdrop.lst` 找独立掉落 ID，再读对应 `etc/independentdrop/*.etc [list]`。
2. 查翻牌/金牌/PC 房卡：读 `etc/itemdropinfo_clearreward.etc`，再按候选字段解析 stackable/equipment。
3. 查全局掉落/奖励倍率：读 `etc/serverparameter.etc`，只作为静态参数层。
4. 查 dungeon 特例：从 `dungeon/dungeon.lst` 找 `.dgn`，再看 `[clear reward item]`、`[result card]`、`[gold card use]` 等父块。
5. 查 PC 房/黑钻世界掉落：读 `etc/worlddroppcroom*.etc [world drop]`，再解析候选物品。
6. 查契约/成长倍率：读 `etc/premiumlist*.etc`，只作为倍率和特权线索。

## 常见误区

- 不要把权重、倍率、阈值写成真实概率。
- 不要把 `drop prob count` 直接等同于后续所有 profile 标签数量。
- 不要把独立掉落候选一律当 stackable；高位 ID 可能是 equipment。
- 不要把 PC 房世界掉落写成翻牌本体。
- 不要把 dungeon 局部标签推广成全局清算规则。
- 不要用辅助对照的更多文件或 UI 资源补主目标事实。

## 必须验证的地方

静态只读只能证明 PVF 内部配置存在或存在风险。以下结论必须另做客户端、服务端或实机验证：

- 翻牌 UI 是否出现、按钮是否可点。
- gold card 费用是否扣除成功。
- 清算奖励、PC 房卡、黑钻卡、premium card、独立掉落是否实际发放。
- 权重、倍率、阈值和稀有度表是否等于最终概率。
- 契约、成长、PC 房、黑钻状态是否由服务端识别。
- 客户端图像、动画、音频和 UI 资源是否完整。
