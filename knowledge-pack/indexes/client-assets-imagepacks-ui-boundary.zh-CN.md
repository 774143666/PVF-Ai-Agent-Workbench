# Client Assets / ImagePacks2 / NPK / UI / IMG Boundary

状态：已完成静态只读封存

## 读取顺序

1. `task-cards/client-assets-imagepacks-ui-readonly-audit.zh-CN.md`
2. `dictionaries/client-assets-imagepacks-ui-fields.zh-CN.md`
3. 本文件
4. `encyclopedia/pvf-file-types/assets-imagepacks-ui.zh-CN.md`

## 主目标 PVF 覆盖

| 项 | 观察结果 |
| --- | ---: |
| PVF 文件总数 | 402963 |
| `.ani` 文件 | 236510 |
| `.act` 文件 | 18750 |
| `.til` 文件 | 4711 |
| `.ptl` 文件 | 4386 |
| `.als` 文件 | 4153 |
| `.map` 文件 | 3147 |
| `.dgn` 文件 | 336 |
| `.ui` 文件 | 301 |
| `.wdm` 文件 | 20 |
| `.twn` 文件 | 14 |
| `.lay` 文件 | 10 |

## 第一桶：UI / 地图 / 动作 / 粒子 / Tile

扫描范围：`.ui/.pos/.wdm/.twn/.dgn/.map/.act/.ptl/.als/.til/.lay`。

| 项 | 观察结果 |
| --- | ---: |
| 扫描文件数 | 35828 |
| 读错数 | 0 |
| 资源引用总数 | 32539 |
| `.ani` 引用出现次数 | 24700 |
| `.img` 引用出现次数 | 4654 |
| `.til` 引用出现次数 | 3146 |
| 唯一外部 `.img` 引用 | 409 |
| ImagePacks2 静态命中 `.img` | 362 |
| ImagePacks2 静态未命中 `.img` | 47 |
| 唯一内部资源引用 | 8223 |
| 内部资源引用命中 PVF | 7920 |
| 内部资源引用未闭合 | 303 |

第一桶未命中 `.img` 顶层分布：`map` 38，`interface` 5，`interface2` 2，`ani` 1，`worldmap` 1。

## 第二桶：全量 ANI 帧级 IMG

扫描范围：全量 `.ani`。

| 项 | 观察结果 |
| --- | ---: |
| `.ani` 扫描数 | 236510 |
| 读错数 | 12 |
| `.img` 引用出现次数 | 230891 |
| 唯一外部 `.img` 引用 | 19064 |
| ImagePacks2 静态命中 `.img` | 13108 |
| ImagePacks2 静态未命中 `.img` | 5956 |

动画桶未命中 `.img` 顶层分布：`creature` 2896，`character` 2078，`monster` 344，`map` 257，`item` 151，`interface2` 146，`interface` 40，`common` 35。

12 个 `.ani` 反编译读错，属于静态盘点缺口；不能把这些文件写成已完成帧级 IMG 核验。

## 客户端 ImagePacks2 静态索引

| 项 | 观察结果 |
| --- | ---: |
| NPK 文件 | 1612 |
| 直接 IMG 文件 | 0 |
| NPK 内 IMG 条目 | 80941 |
| IMG 查找键 | 161532 |
| 异常 NPK 容器 | 0 |

说明：IMG 查找键包含 `sprite/` 前缀兼容候选，因此不是原始 IMG 条目数。

## 辅助对照提示

辅助对照第一桶只作为差异提示：

| 项 | 辅助对照结果 |
| --- | ---: |
| PVF 文件总数 | 1052773 |
| 扫描文件数 | 90916 |
| 唯一外部 `.img` 引用 | 919 |
| ImagePacks2 静态命中 `.img` | 878 |
| ImagePacks2 静态未命中 `.img` | 41 |
| 唯一内部资源引用 | 30838 |
| 内部资源引用未闭合 | 1371 |

辅助对照资源更多、NPK 更多，但不能覆盖主目标客户端缺口。

## 可封存结论

- Script.pvf 资源引用和客户端 ImagePacks2 资源存在是两个层级。
- 本主线已经把主目标第一桶资源承接文件、全量 `.ani` 帧级 `.img` 引用、当前 ImagePacks2 NPK/IMG 索引做了静态对照。
- 当前客户端索引对第一桶 `.img` 命中率较高，但仍有地图/UI 类未命中。
- 当前客户端索引对全量动画 `.img` 仍有大量未命中，集中在 creature、character、monster、map、item、interface2 等顶层。
- 静态未命中是资源风险，不等于实机必定红叉；静态命中也不等于实机显示正常。
- 光环/时装等外观链路可能跨 `equipment .equ`、`.ani`、IMG 和 NPK 容器多层；装备图标命中不能代表外观特效命中。
- 不同来源的 NPK 容器不能默认等价；自制整合包、源客户端原始包和目标客户端既有共享包都需要按目标客户端加载结果区分。

## 仍需实机或专项验证

- 客户端是否实际加载目标 NPK。
- NPK 加载顺序是否覆盖同名 IMG。
- IMG 帧号是否有效。
- UI 控件坐标、按钮响应、窗口层级是否正常。
- 地图 tile 是否实机绘制正常。
- 动画播放、粒子、透明度、缩放、旋转、延迟是否正常。
- 光环、时装、宠物等穿戴外观是否在目标客户端实际可见。
- SoundPacks/Music/audio.xml 是否完整。
- 服务端是否允许相关内容进入对应流程。
