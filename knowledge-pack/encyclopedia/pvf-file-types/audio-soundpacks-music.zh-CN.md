# Audio / SoundPacks / Music / audio.xml

状态：默认可用。

本页说明音频资源相关文件类型和静态边界。它不替代字段字典和边界索引。

## audio.xml

`audio.xml` 是客户端音频 ID 索引。主目标静态观察到三类核心登记：

- EFFECT：音效 ID 到音频文件。
- MUSIC：音乐 ID 到音乐文件。
- RANDOM：随机音频 ID 到一组子项。

`audio.xml` 可以证明 ID 和目标文件之间存在静态登记，但不能证明客户端运行时一定播放、循环正确、音量正确或 fallback 行为正确。

## SoundPacks

SoundPacks 是音效资源容器层，主要以 NPK 承载音频条目。

静态盘点可以确认：

- NPK 文件是否能被解析。
- NPK 内是否存在目标音频条目。
- 某个 EFFECT 指向的音频文件是否能在 SoundPacks 静态命中。

静态盘点不能确认：

- 客户端实际加载顺序。
- 补丁优先级。
- 播放时机。
- 声道、音量、循环、混音。
- 运行时是否被硬编码逻辑替换。

## Music / Mp3

Music / Mp3 是背景音乐资源目录。主目标当前静态观察到 Music 层 `.ogg` 文件；辅助对照提示另一套客户端还存在 Mp3 层。

MUSIC ID 静态闭合口径：

```text
PVF token -> audio.xml MUSIC -> Music / Mp3 文件
```

该链路只能证明静态资源存在，不能证明进图后一定播放，也不能证明循环点和音量正确。

## PVF 音频 token

PVF 里常见的是音频 token，不是客户端绝对路径。

常见入口：

- `.atk` 的 `[hit wav]`
- `.equ`、`.stk` 的 `[move wav]`
- `.stk` 的 `[use wav]`
- `.mob` 的 `[damage sound]`、`[die sound]`、`[etc sound]`
- `.map` 的 `[sound]`、`[opening bgm]`

静态审计时应先确认 token 所在父块，再进入 `audio.xml` 和资源层。不要只凭 token 名字猜资源类型。

## 资源缺失的写法

当 EFFECT / MUSIC 指向的文件未命中时，写为“资源链风险”。

当 RANDOM 子项缺失时，写为“随机组内部风险”。

当 token 未经 `audio.xml` 但 SoundPacks stem 命中时，写为“弱静态闭合”，不要写成完整闭合。

当 token 完全无法闭合时，写为“未闭合风险”，不要写成实机必然失败。
