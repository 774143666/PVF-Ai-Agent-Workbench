# Audio / SoundPacks / Music / audio.xml 只读审计任务卡

状态：默认可用。

用途：当任务涉及 PVF 声音字段、地图音乐、攻击音效、物品移动/使用音效、`audio.xml`、`SoundPacks`、`Music` 或音频资源缺失风险时，先读本任务卡，再进入字段字典和边界索引。

## 适用问题

- 某个 PVF token 是否能静态追到音效或音乐资源。
- `[hit wav]`、`[move wav]`、`[use wav]`、`[sound]`、`[opening bgm]` 等字段应如何理解。
- `audio.xml` 的 EFFECT / MUSIC / RANDOM 如何参与资源闭合。
- `SoundPacks` NPK 或 `Music` 文件缺失应如何写成风险。
- 客户端资源检查能证明什么，不能证明什么。

## 默认读取顺序

1. `dictionaries/audio-soundpacks-music-fields.zh-CN.md`
2. `indexes/audio-soundpacks-music-boundary.zh-CN.md`
3. `encyclopedia/pvf-file-types/audio-soundpacks-music.zh-CN.md`
4. 如涉及副本地图声音，再读 `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`
5. 如涉及 UI / IMG / ImagePacks2，不复用本主线结论，转读 `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`

## 主目标已确认

- PVF 音频字段主要以 token 形式引用声音或音乐，不以客户端绝对路径作为常规入口。
- 主目标 `audio.xml` 存在，包含 EFFECT、MUSIC、RANDOM 三类核心登记。
- 主目标 `SoundPacks` 能静态解析 NPK 内音频条目。
- 主目标 `Music` 能静态枚举音乐文件。
- PVF token 可以按“PVF 字段 -> `audio.xml` -> SoundPacks / Music”进行静态闭合。

## 主目标统计摘要

| 项目 | 数量 |
| --- | ---: |
| PVF 总文件 | 402963 |
| 默认桶扫描文件 | 149943 |
| 默认桶读取错误 | 0 |
| `.ani` 桶扫描文件 | 236510 |
| `.ani` 桶读取错误 | 12 |
| `audio.xml` EFFECT | 10224 |
| `audio.xml` MUSIC | 263 |
| `audio.xml` RANDOM | 1853 |
| SoundPacks NPK | 79 |
| SoundPacks 音频条目 | 10386 |
| Music 文件 | 244 |
| 默认桶唯一音频 token | 4030 |
| 默认桶未闭合 token | 281 |

## 审计动作

1. 先确认问题里的值是 PVF token、`audio.xml` ID、SoundPacks 文件路径，还是 Music 文件路径。
2. 如果是 PVF token，先查字段上下文，再按 EFFECT / MUSIC / RANDOM 顺序解析。
3. 如果是 RANDOM，继续检查所有子项是否能落到 EFFECT。
4. 如果落到 EFFECT，检查目标音频文件是否能在 SoundPacks 静态索引中命中。
5. 如果落到 MUSIC，检查目标音乐文件是否能在 Music 目录静态命中。
6. 如果只命中 SoundPacks stem 或 basename，只能写为弱闭合或风险，不写成完整 `audio.xml` 闭合。
7. 如果未闭合，记录为资源链风险，不直接写成实机必然无声。

## 禁止写成的结论

- 不把静态命中写成实机一定能听到。
- 不把静态缺失写成实机一定报错或一定无声。
- 不把 NPK 条目存在写成客户端加载顺序正确。
- 不把 `audio.xml` 登记写成音量、循环、淡入淡出、声道或混音正确。
- 不把 PVF token 引用写成服务端放行、客户端补丁完整或运行日志正常。
- 不把辅助对照的资源数量提升为主目标事实。

## 允许的结论口径

- “主目标静态观察到 token 可以通过 EFFECT / MUSIC / RANDOM 闭合到资源索引。”
- “主目标静态观察到部分 token 未能通过 `audio.xml` 与 SoundPacks / Music 闭合，应列为资源链风险。”
- “辅助对照只提示另一套客户端资源层更大或字段更多，不能覆盖主目标结论。”
- “本结论仅覆盖静态 PVF 与客户端资源索引，不覆盖实机播放。”
