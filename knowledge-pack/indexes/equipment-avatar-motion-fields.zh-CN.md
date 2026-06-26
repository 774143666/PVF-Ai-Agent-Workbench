# Equipment Avatar 外观与动作字段索引

## 用途

本索引用于只读判断 avatar equipment `.equ` 中全身外观标记、职业外观隐藏、徽章 socket 标记、残影参数、动作动画映射、扩展动画参数和声音配置。它只记录目标 PVF 的字段结构，不授权直接写 PVF，也不证明客户端资源完整。

## 总规则

- 以下字段默认状态均为 `需验证`。
- `.ani` 路径和声音标识存在于目标 PVF，不代表客户端 `ImagePacks2`、NPK、音频或动画资源齐全。
- 无值字段按“存在标记”读取，不能擅自补 `0`、`1` 或闭合标签。
- 动作路径常为相对路径，必须结合装备职业、当前 `[LAYER]`、`[variation]` 和客户端布局验证。
- 字段拼写和大小写必须原样保留，尤其是 `[LAYER]`、`[ani equiped type]` 与 `[change type ultimateSkillCurScene]`。

## Avatar 标记、隐藏与 socket

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[full avatar]` | 无值存在标记 | 全身 avatar 相关标记；目标无 `[/full avatar]`，不能当作后续隐藏字段的容器。 |
| `[hide avatar in town]` | 无值存在标记 | 城镇隐藏 avatar 线索；实际显示范围需客户端验证。 |
| `[hide grow avatar]` | 闭合字符串列表 | 职业成长外观名称列表，必须读取 `[/hide grow avatar]`。字符串不是 registry ID。 |
| `[hide growtype avatar]` | 闭合整数列表 | 目标样本均为 `2 3 4`，必须读取 `[/hide growtype avatar]`；整数到具体转职阶段的映射未定性。 |
| `[hide unique equipment]` | 闭合 avatar 类型 token 列表 | 目标列出帽子、头发、脸、胸、上衣、腰、裤、鞋等 avatar 类型，必须读取闭合。 |
| `[hide unique layer]` | 闭合图层整数列表 | 特殊外观隐藏图层表；图层顺序和客户端布局需验证。 |
| `[avatar emblem socket num]` | 单整数 | 目标样本值均为 `2`；只确认 socket 数量或配置数线索，实际可镶嵌行为需实机确认。 |
| `[skin emblem socket]` | 无值存在标记 | 皮肤徽章 socket 能力线索；目标无闭合标签。 |
| `[pvp free avatar]` | 单整数 | 目标样本值为 `1` 的 PVP avatar 相关标记；免费、可用或替换行为未由静态文件闭合。 |
| `[ban animation in pvp]` | 无值存在标记 | PVP 动画禁用线索；具体禁用范围需客户端或实机确认。 |

## 显示、聊天与残影参数

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[character name y revision]` | 两个整数 | 角色名称 Y 方向修正参数；两列分别对应的状态或场景未定性。 |
| `[msg balloon on mucu skill]` | 整数、文本 | 技能相关消息气泡线索；目标首列均为 `50`，不能在未解析前直接当作 skill ID。 |
| `[required full set for chatting emoticon]` | 单整数 | 目标值均为 `1` 的全套聊天表情条件线索；与具体套装、表情 ID 的关联未闭合。 |
| `[change type ultimateSkillCurScene]` | 单整数 | 目标值均为 `0` 的硬编码场景类型参数；具体运行行为未定性。 |
| `[spectrum avatar]` | 五或六个数值 | avatar 残影或色彩参数线索；目标既有六值也有五值记录，不能强制补齐。前三列可作为颜色候选，但完整列义和时间单位仍需客户端验证。 |
| `[x move dash speed]` | 单小数 | X 方向移动或冲刺速度率线索；目标值为 `0.5`。 |
| `[y move dash speed]` | 单小数 | Y 方向移动或冲刺速度率线索；目标值为 `0.5`。 |

## 动作动画映射

`[LAYER]` 是单整数图层选择字段。一个文件中可重复出现 `[LAYER]`，每次后接一组动作路径；它不是闭合块。

以下字段目标形态均为一个相对 `.ani` 路径：

| 字段 | 状态 | 读取边界 |
| --- | --- | --- |
| `[waiting motion]` | 需验证 | 待机动作相对 `.ani` 路径。 |
| `[move motion]` | 需验证 | 移动动作相对 `.ani` 路径。 |
| `[sit motion]` | 需验证 | 坐下动作相对 `.ani` 路径。 |
| `[damage motion 1]` | 需验证 | 受击动作 1 相对 `.ani` 路径。 |
| `[damage motion 2]` | 需验证 | 受击动作 2 相对 `.ani` 路径。 |
| `[down motion]` | 需验证 | 倒地动作相对 `.ani` 路径。 |
| `[overturn motion]` | 需验证 | 翻转或起身阶段动作相对 `.ani` 路径；精确阶段需客户端验证。 |
| `[jump motion]` | 需验证 | 跳跃动作相对 `.ani` 路径。 |
| `[jumpattack motion]` | 需验证 | 跳跃攻击动作相对 `.ani` 路径。 |
| `[rest motion]` | 需验证 | 休息动作相对 `.ani` 路径。 |
| `[throw motion 1-1]` | 需验证 | 投掷动作组 1 的第一路径。 |
| `[throw motion 1-2]` | 需验证 | 投掷动作组 1 的第二路径。 |
| `[throw motion 2-1]` | 需验证 | 投掷或指令动作组 2 的第一路径。 |
| `[throw motion 2-2]` | 需验证 | 投掷或指令动作组 2 的第二路径。 |
| `[throw motion 3-1]` | 需验证 | 投掷动作组 3 的第一路径。 |
| `[throw motion 3-2]` | 需验证 | 投掷动作组 3 的第二路径。 |
| `[throw motion 4-1]` | 需验证 | 投掷动作组 4 的第一路径。 |
| `[throw motion 4-2]` | 需验证 | 投掷动作组 4 的第二路径。 |
| `[dash motion]` | 需验证 | 冲刺动作相对 `.ani` 路径。 |
| `[dashattack motion]` | 需验证 | 冲刺攻击动作相对 `.ani` 路径。 |
| `[getitem motion]` | 需验证 | 拾取物品动作相对 `.ani` 路径。 |
| `[buff motion]` | 需验证 | Buff 或施放类动作相对 `.ani` 路径。 |

两个动作字段是闭合路径列表：

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[attack motion]` | 一个或多个相对 `.ani` 路径 | 必须读取 `[/attack motion]`；列表长度随职业和动作集变化。 |
| `[etc motion]` | 多个相对 `.ani` 路径 | 必须读取 `[/etc motion]`；目标可包含大量职业专用动作，不能删减为固定模板。 |

等级或职业分段外观块：

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[level section ani]` | 闭合的等级或职业分段外观块 | 必须读取 `[/level section ani]`；块内可包含 `[variation]`、`[layer variation]` 和 `[equipment ani script]` 等外观字段。分段条件和资源引用必须结合当前装备职业、等级段和客户端资源验证。 |

## 扩展动画与声音

| 字段 | 目标列形 | 读取边界 |
| --- | --- | --- |
| `[custom wav]` | 闭合声音标识列表，可为空 | 可位于根级或 `[expand ani]` 内，必须读取 `[/custom wav]`。声音标识不是文件路径。 |
| `[specific sound]` | 闭合的“场景 token、声音标识”对列表 | 目标可见 `town move` 与 `dungeon dash` 两个场景；不要把场景 token 当声音名。 |
| `[ani equiped type]` | 单类型 token | 仅按 `[expand ani]` 子字段读取；目标可见 `weapon`、`skin avatar`。保留原始 `equiped` 拼写。 |
| `[ani order]` | 单整数 | `[expand ani]` 内动画顺序线索；目标值为 `2`，精确排序规则未定性。 |
| `[expand ani sound]` | 单整数 | `[expand ani]` 内声音开关或模式线索；目标值为 `0` 或 `1`。 |
| `[expand attack box]` | 单整数 | `[expand ani]` 内攻击框扩展参数；目标值为 `0`，实际碰撞行为需实机确认。 |

## 最低验证清单

1. 先确认装备是 avatar、avatar weapon、skin 或 aurora 等相关类型。
2. 无值存在标记不能改成数值字段或容器。
3. 动作路径结合当前 `[LAYER]` 和职业读取。
4. `[attack motion]`、`[etc motion]`、隐藏列表和声音列表必须检查闭合。
5. `[spectrum avatar]` 按目标原始五值或六值形态保存。
6. 所有 `.ani` 和声音引用在客户端侧另行核查。
