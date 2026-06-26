# Audio / SoundPacks / Music / audio.xml Boundary

状态：已完成静态只读封存。

本索引用于路由 PVF 音频 token、`audio.xml`、SoundPacks、Music 之间的静态闭合关系。它只覆盖静态配置与资源索引，不覆盖实机播放、客户端加载顺序、音量、循环、混音、补丁优先级或服务端放行。

## 静态链路

```text
PVF 声音字段 token
  -> audio.xml EFFECT
    -> SoundPacks NPK 内音频条目

PVF 声音字段 token
  -> audio.xml MUSIC
    -> Music / Mp3 音乐文件

PVF 声音字段 token
  -> audio.xml RANDOM
    -> RANDOM 子项
      -> EFFECT
        -> SoundPacks NPK 内音频条目

PVF 声音字段 token
  -> SoundPacks stem / basename
    -> 弱静态闭合或风险提示
```

## 主目标静态覆盖

| 桶 | 扫描文件 | 读取错误 | 唯一 token | 未闭合 token |
| --- | ---: | ---: | ---: | ---: |
| 默认桶 | 149943 | 0 | 4030 | 281 |
| `.ani` 桶 | 236510 | 12 | 1100 | 246 |

主目标音频索引：

| 项目 | 数量 |
| --- | ---: |
| EFFECT | 10224 |
| MUSIC | 263 |
| RANDOM | 1853 |
| 重复 ID | 38 |
| 结构异常项 | 0 |
| EFFECT 文件静态命中 | 9612 |
| EFFECT 文件静态缺失 | 612 |
| MUSIC 文件静态命中 | 239 |
| MUSIC 文件静态缺失 | 24 |
| RANDOM 子项缺失 | 46 |
| SoundPacks NPK | 79 |
| SoundPacks 音频条目 | 10386 |
| SoundPacks 异常容器 | 0 |
| Music 文件 | 244 |

默认桶 token 解析：

| 状态 | 唯一 token |
| --- | ---: |
| `audioxml-effect-file-hit` | 2528 |
| `audioxml-random-hit` | 965 |
| `unresolved` | 281 |
| `audioxml-music-file-hit` | 190 |
| `soundpack-stem-hit` | 50 |
| `audioxml-random-item-missing` | 11 |
| `audioxml-effect-file-missing` | 5 |

`.ani` 桶 token 解析：

| 状态 | 唯一 token |
| --- | ---: |
| `audioxml-effect-file-hit` | 732 |
| `unresolved` | 246 |
| `audioxml-random-hit` | 86 |
| `audioxml-effect-file-missing` | 26 |
| `soundpack-stem-hit` | 10 |

## 字段入口矩阵

| 入口 | 常见文件 | 默认路由 | 需要注意 |
| --- | --- | --- | --- |
| `[hit wav]` | `.atk` | token -> EFFECT/RANDOM -> SoundPacks | 不能证明命中判定或伤害发生。 |
| `[PLAY SOUND]` | `.ani` | token -> EFFECT/RANDOM -> SoundPacks | 动画帧音效入口；当前任务只读盘点覆盖 `.ani` 桶，但不能证明帧级播放时机。 |
| `[move wav]` | `.equ`、`.stk` | token -> EFFECT -> SoundPacks | 不能证明背包 UI 或拖动物品正常。 |
| `[use wav]` | `.stk` | token -> EFFECT/RANDOM -> SoundPacks | 不能证明道具使用成功。 |
| `[damage sound]` | `.mob` | token -> EFFECT/RANDOM -> SoundPacks | 不能证明怪物受击流程触发。 |
| `[die sound]` | `.mob` | token -> EFFECT/RANDOM -> SoundPacks | 不能证明怪物死亡流程触发。 |
| `[etc sound]` | `.mob` | token -> EFFECT/RANDOM -> SoundPacks | 需看父块上下文。 |
| `[sound]` | `.map` | token 列表 -> MUSIC/EFFECT/RANDOM | 同行可能混合音乐与环境音。 |
| `[opening bgm]` | `.map` | token -> MUSIC -> Music | 不能证明进图后开场音乐实际播放。 |

## 主目标已确认的闭合类型

| 类型 | 结论 |
| --- | --- |
| EFFECT -> SoundPacks | 主目标存在大量强静态闭合样本。 |
| MUSIC -> Music | 主目标存在强静态闭合样本，同时有少量缺失音乐文件。 |
| RANDOM -> EFFECT | 主目标存在随机组闭合样本，同时有部分随机子项缺失。 |
| token -> SoundPacks stem | 主目标存在弱闭合样本，不能替代 `audio.xml` 完整闭合。 |
| 显式音频路径 | 主目标默认桶未发现显式音频路径引用。 |

## 主目标风险桶

| 风险 | 主目标观察 | 写法 |
| --- | --- | --- |
| EFFECT 文件缺失 | 612 个 EFFECT 指向的文件未静态命中。 | 写为 SoundPacks 资源链风险。 |
| MUSIC 文件缺失 | 24 个 MUSIC 指向的文件未静态命中。 | 写为 Music 资源链风险。 |
| RANDOM 子项缺失 | 46 个 RANDOM 存在缺失子项。 | 写为随机组内部风险。 |
| 重复 ID | `audio.xml` 有 38 个重复 ID。 | 写为静态索引歧义风险。 |
| `.ani` 读取错误 | `.ani` 桶有 12 个读取错误。 | 写为动画层补样本风险，不扩大为整体失败。 |
| 未闭合 token | 默认桶 281 个，`.ani` 桶 246 个。 | 写为未闭合资源链风险。 |

## 辅助对照提示

辅助对照只作为差异提示，不覆盖主目标。

| 项目 | 辅助对照 |
| --- | ---: |
| PVF 总文件 | 1052773 |
| 扫描文件 | 275859 |
| 读取错误 | 0 |
| EFFECT | 29153 |
| MUSIC | 606 |
| RANDOM | 4857 |
| SoundPacks NPK | 116 |
| SoundPacks 音频条目 | 37258 |
| Music/Mp3 文件 | 529 |
| 唯一 PVF 音频 token | 9728 |
| 未闭合 token | 262 |

辅助对照提示可写为：

- “辅助对照音频资源层更大，提示主目标缺失项可能与客户端资源版本差异有关。”
- “辅助对照存在 Music 与 Mp3 混合目录，主目标当前只观察到 Music 层 `.ogg`。”
- “辅助对照显式路径引用全部静态命中，但该事实不覆盖主目标。”

## 与其他主线的边界

| 关联主线 | 只引用什么 | 不重开什么 |
| --- | --- | --- |
| Dungeon / Map / Spawn / Entry / Clear / Resource | 引用 `.map` 的 `[sound]`、`[opening bgm]` 作为地图音频入口。 | 不重开副本入口、刷怪、清算和门票。 |
| Monster | 引用 `.mob` 的声音字段作为 token 来源。 | 不重开怪物 AI、掉落或攻击链主线。 |
| PassiveObject / AttackInfo / Hitbox | 引用 `.atk` 的 `[hit wav]`。 | 不重开命中盒、伤害或击退结论。 |
| Equipment / Stackable | 引用 `[move wav]`、`[use wav]`。 | 不重开物品字段或道具使用流程。 |
| Client Assets / ImagePacks2 / NPK / UI / IMG | 共用“客户端资源静态索引不能证明实机完整”的边界。 | 不把 ImagePacks2/IMG 结论混入音频资源。 |

## 验收口径

本主线可以封存的条件：

- 已有只读脚本能重建主目标 `audio.xml`、SoundPacks、Music 与 PVF token 统计。
- Workbench 具备 task-card、dictionary、index、encyclopedia 四个入口。
- `knowledge-index.json` 能路由到本主线。
- `MANIFEST.json` 已刷新。
- 知识包检查、环境检查、工作区健康检查通过。
- PVF 会话最终关闭。

## 结论模板

可以使用：

```text
主目标静态观察到该 PVF 音频 token 可通过 audio.xml EFFECT/MUSIC/RANDOM 闭合到 SoundPacks 或 Music 资源索引；该结论只证明静态资源链存在，不证明实机播放。
```

风险写法：

```text
主目标静态观察到该 token 未能通过 audio.xml 与 SoundPacks/Music 闭合，应作为音频资源链风险；是否实机无声、报错或被 fallback 覆盖，需要运行测试或客户端日志确认。
```
