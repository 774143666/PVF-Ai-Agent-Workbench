# Audio / SoundPacks 资料线索补强

状态：默认可用。

用途：补强已封存的 Audio / SoundPacks / Music 主线，让 Workbench 在遇到音效、BGM、SoundPacks、`audio.xml`、地图音乐和脚本音效调用时，先把问题路由到正确的静态闭环与运行边界。

## 核心结论

音频相关结论必须分层判断：

1. PVF 字段或脚本里出现音频 token，只能证明配置处引用了声音名或音乐名。
2. `audio.xml` 命中 EFFECT、MUSIC 或 RANDOM，只能证明静态音频注册表里存在对应项。
3. SoundPacks 或 Music 资源命中，只能证明目标客户端资源层面存在静态候选。
4. 实际播放、音量、通道、时机、循环、随机项选择、客户端是否加载、服务端是否允许，都不能由静态只读盘点直接证明。

## 资料线索如何使用

- 客户端资源闭环资料把 BGM、音效和 SoundPacks 归入客户端资源验证家族。Workbench 因此应把“静态命中”和“实际播放”分开。
- 地城和地图资料提供 `[sound]`、`[opening bgm]` 这类地图侧入口。遇到地图音乐或地图音效，应同时查看 Dungeon / Map 主线和本音频主线。
- NUT 运行资料中的 `sq_PlaySound`、`stopSound` 等调用，只能作为“脚本可能触发声音”的定位线索。它们不能替代 `audio.xml`、SoundPacks、Music 的静态闭环检查。
- 标签交叉线索中的 `[start sound]`、`[stop sound id]`、移动音效、投掷音效、走路音效等，只能用于定向搜索。字段含义仍要回到主目标 PVF 的父块、文件族和上下文确认。

## 已封存静态事实

当前音频主线已经确认以下静态范围：

- 默认扫描桶：149943 个文件，4030 个唯一 token，281 个 unresolved token。
- `.ani` 扫描桶：236510 个文件，1100 个唯一 token，246 个 unresolved token，12 个读取错误。
- `audio.xml`：10224 条 EFFECT，263 条 MUSIC，1853 条 RANDOM，38 组重复 ID。
- 资源层：79 个 SoundPacks NPK，10386 个 SoundPacks 音频条目，244 个 Music 文件。
- 静态缺口：612 个 EFFECT 文件缺失，24 个 MUSIC 文件缺失，46 个 RANDOM 子项缺失。

这些数字只表示静态只读盘点结果，不表示实机播放结果。

## 推荐排查顺序

1. 先确认音频 token 出现在哪个父块、文件族或脚本调用中。
2. 再按 token 查 `audio.xml` 的 EFFECT、MUSIC 或 RANDOM。
3. RANDOM 命中时继续查子项是否能落到 EFFECT。
4. EFFECT / MUSIC 命中后再检查 SoundPacks 或 Music 静态资源是否存在。
5. 涉及地图、地城或入场音乐时，同时查看 Dungeon / Map 边界。
6. 涉及客户端播放、音量、循环、缺声、随机播放时，必须进入客户端资源和实机验证阶段。

## 禁止推断

- 不能把 PVF token 出现直接当成客户端会播放。
- 不能把 SoundPacks 或 Music 静态存在直接当成实机成功。
- 不能把 NUT sound API 出现直接当成 `audio.xml` 已闭环。
- 不能把 `audio.xml` 缺口直接当成所有场景必定无声；它只能标记静态资源链风险。
- 不能把资料线索直接写成目标 PVF 事实，必须回到主目标 PVF 的只读观察结果。

## 关联入口

- `indexes/audio-soundpacks-music-boundary.zh-CN.md`
- `dictionaries/audio-soundpacks-music-fields.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
- `indexes/client-assets-source-position-reinforcement.zh-CN.md`
- `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`
- `indexes/dungeon-map-source-position-reinforcement.zh-CN.md`

