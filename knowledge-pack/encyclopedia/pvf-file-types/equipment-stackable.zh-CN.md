# equipment 与 stackable

状态：默认可用

## 用途

- `equipment/**/*.equ`：装备。
- `stackable/**/*.stk`：材料、消耗品、设计图、礼包、任务物品、活动道具等可堆叠物。

## 常见 registry

- 装备 ID 通过对应装备 registry 或上下文 registry 解析。
- 可堆叠物通过 stackable 相关 registry 解析。
- 同一个数字可能同时存在于装备、stackable、map、passiveobject 等不同 registry。
- 商店、任务、掉落、材料需求等上下文会决定下一步该查哪个 registry。

## 常见字段

基础显示：

- `[name]`、`[name2]`
- `[basic explain]`、`[detail explain]`、`[explain]`、`[flavor text]`

品质、交易和限制：

- `[grade]`：等级或品级相关基础数值。
- `[rarity]`：稀有度或品质等级相关数值。
- `[attach type]`：绑定、交易或附着类型线索。
- `[minimum level]`：最低穿戴或使用等级线索。
- `[usable job]`：职业可用性线索。

经济和商店：

- `[price]`：NPC 商店出售链路中 stackable 商品的普通金币价格。
- `[cash]`：NPC 商店出售链路中的点券 / CERA 类价格。
- `[value]`：价值或价格候选字段，不能跨文件族直接等同。
- `[repair price]`：维修价格线索。
- `[need material]`：需求材料列表，通常是材料 ID 与数量成组出现。
- `[medal]`：NPC 商店出售链路中装备商品的胜点类价格。

装备数值：

- `[physical attack]`、`[magical attack]`
- `[physical defense]`、`[magical defense]`
- `[equipment physical attack]`、`[equipment magical attack]`
- `[equipment physical defense]`、`[equipment magical defense]`
- `[separate attack]`
- `[attack speed]`、`[move speed]`、`[casting speed]`
- `[durability]`、`[weight]`

资源、类型和表现：

- `[icon]`、`[field image]`
- `[equipment type]`、`[sub type]`、`[stackable type]`
- `[item group name]`、`[move wav]`
- `[animation job]`、`[variation]`、`[layer variation]`、`[equipment ani script]`

套装、触发和特殊效果：

- `[set name]`、`[set item]`、`[set ability]`
- `[if]`、`[then]`、`[target]`、`[probability]`
- `[cool time]`、`[cooltime]`
- `[appendage]`、`[skill data up]`
- `[passive object]`：禁用作快速入口，不能默认按 passiveobject registry 解释。

宝箱和选择器：

- `[booster category num]`
- `[booster selection num]`
- `[booster select category]`
- `[recommend]`
- `[equipment]`
- `[booster category name]`
- `[booster info]`

## 规则

- 不从数字形状猜测物品类型。
- 不把教程里的装备 ID、材料 ID 直接复用到目标 PVF。
- 设计图本身通常是 stackable，设计图产物可能是 equipment。
- 价格、材料、胜点字段在 NPC 商店链路中可用，不代表所有系统都读取同名字段。
- 限制类字段和战斗效果字段必须读回并进游戏确认。
- `[grade]`、`[rarity]`、`[weight]` 是常见字段，但改动后仍要看客户端显示和游戏内结果。
- 宝箱/选择器里的 `[equipment]` 是候选内容列表，不是当前文件自身的 registry。

## 写入边界

改装备或道具时，必须确认 registry、目标文件、字段语义、输出 PVF 和读回结果。涉及实际战斗效果时需要游戏内验证。
