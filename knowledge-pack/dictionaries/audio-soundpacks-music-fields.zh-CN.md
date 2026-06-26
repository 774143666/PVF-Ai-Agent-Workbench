# Audio / SoundPacks / Music 字段字典

状态：默认可用。

本字典只定义静态字段和资源索引含义，不证明实机播放、客户端加载顺序、音量、循环、混音或服务端放行。

## PVF 声音字段

| 字段 | 常见文件 | 静态含义 | 备注 |
| --- | --- | --- | --- |
| `[hit wav]` | `.atk` | 命中音效 token。 | 常用于攻击信息；token 通常继续查 `audio.xml` EFFECT 或 RANDOM。 |
| `[PLAY SOUND]` | `.ani` | 动画帧音效 token。 | 脚本已覆盖 `.ani` 桶；token 仍按 `audio.xml` EFFECT/RANDOM 与 SoundPacks 路由，静态命中不证明动画帧实机播放时机。 |
| `[move wav]` | `.equ`、`.stk` | 物品移动/触碰音效 token。 | 装备和消耗品常见。 |
| `[use wav]` | `.stk` | 物品使用音效 token。 | 只能证明静态配置存在，不证明使用成功。 |
| `[damage sound]` | `.mob` | 怪物受击音效 token。 | 属于怪物静态配置的一部分。 |
| `[die sound]` | `.mob` | 怪物死亡音效 token。 | 不证明怪物实机死亡流程触发。 |
| `[etc sound]` | `.mob` | 怪物额外语音/环境音 token。 | 需要结合父块上下文判断用途。 |
| `[sound]` | `.map` | 地图音乐或环境音 token 列表。 | 同一行可同时出现 MUSIC 与 EFFECT/RANDOM/环境音 token。 |
| `[opening bgm]` | `.map` | 地图开场背景音乐 token。 | 通常按 MUSIC 路由，但仍要查 `audio.xml`。 |

## audio.xml 结构

| 类别 | 静态含义 | 闭合目标 |
| --- | --- | --- |
| EFFECT | 音效 ID 到音频文件的登记。 | SoundPacks 内音频条目。 |
| MUSIC | 音乐 ID 到音乐文件的登记。 | Music / Mp3 文件。 |
| RANDOM | 随机音频 ID 到一组子项的登记。 | 子项通常继续落到 EFFECT。 |
| ITEM | RANDOM 内子项。 | 子项 ID 与概率值；概率只表示静态配置。 |

## 资源层

| 资源层 | 静态作用 | 不能证明 |
| --- | --- | --- |
| SoundPacks NPK | 承载音效文件；可静态枚举容器内音频条目。 | 客户端加载顺序、播放成功、补丁优先级、声道和混音。 |
| Music | 承载背景音乐文件。 | 地图进入后一定播放、循环点正确、音量正确。 |
| Mp3 | 辅助对照中可见的音乐目录类型。 | 主目标存在同类目录或资源。 |
| audio.xml | 音频 ID 到文件或随机组的静态索引。 | 播放引擎行为、硬编码 fallback、运行日志正常。 |

## 解析状态

| 状态 | 含义 | 结论强度 |
| --- | --- | --- |
| `audioxml-effect-file-hit` | PVF token 命中 EFFECT，EFFECT 文件在 SoundPacks 静态命中。 | 强静态闭合。 |
| `audioxml-effect-file-missing` | PVF token 命中 EFFECT，但 EFFECT 文件未在 SoundPacks 静态命中。 | 资源缺失风险。 |
| `audioxml-music-file-hit` | PVF token 命中 MUSIC，音乐文件静态命中。 | 强静态闭合。 |
| `audioxml-music-file-missing` | PVF token 命中 MUSIC，但音乐文件未静态命中。 | 资源缺失风险。 |
| `audioxml-random-hit` | PVF token 命中 RANDOM，子项能继续闭合。 | 随机组静态闭合。 |
| `audioxml-random-item-missing` | RANDOM 存在，但部分子项不能继续闭合。 | 随机组内部风险。 |
| `soundpack-stem-hit` | token 未经 `audio.xml`，但与 SoundPacks 文件 stem 命中。 | 弱静态闭合。 |
| `soundpack-path-or-basename-hit` | 显式路径或 basename 命中 SoundPacks。 | 路径级静态闭合。 |
| `unresolved` | token 未能通过 `audio.xml`、SoundPacks 或 Music 静态闭合。 | 未闭合风险。 |

## 主目标字段口径

- 主目标默认桶确认 PVF 声音字段值多为 token。
- 主目标默认桶没有发现显式音频路径引用。
- 主目标存在 `audio.xml` 重复 ID、EFFECT 文件缺失、MUSIC 文件缺失和 RANDOM 子项缺失，均应按静态资源链风险记录。
- 主目标 `.ani` 桶可补充动画层音频 token，但读取错误和帧级播放行为都不能用静态盘点硬推。

## 写作边界

可以写：

- “该 token 静态命中 EFFECT 并落到 SoundPacks 条目。”
- “该 MUSIC ID 静态指向音乐文件，但目标文件未命中，存在资源链风险。”
- “该 RANDOM 组存在缺失子项，随机播放时可能触发资源风险。”

不要写：

- “该音效实机会正常播放。”
- “该音乐进图一定播放。”
- “该缺失一定导致崩溃或无声。”
- “该 NPK 一定会被客户端按预期加载。”
- “辅助对照存在该资源，所以主目标也完整。”
