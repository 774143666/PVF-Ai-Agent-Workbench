# Client Assets / ImagePacks2 / NPK / UI / IMG 字段边界

状态：默认可用

## 核心对象

| 对象 | 静态含义 | 边界 |
| --- | --- | --- |
| `ImagePacks2` | 客户端图像资源目录，承载 NPK 或直接 IMG。 | 不是 Script.pvf 的一部分；修改需要单独授权。 |
| `.NPK` | 客户端资源容器，内部索引到 `.img` 条目。 | 容器可读不等于客户端加载顺序正确。 |
| `.img` | 客户端图像资源条目，可被 UI、ANI、TIL、PTL 等引用。 | 索引命中不证明帧号、绘制、透明度、坐标或运行分支正常。 |
| `list.txt` | 资源打包时常见的源引用到 IMG 清单。 | 属于打包中间清单，不是 PVF registry。 |
| `NPK_IMG_save.txt` | 整合 NPK 输出时的 IMG 条目清单。 | 只描述打包产物，不证明实机加载。 |
| `asset_manifest.json` | 资源打包/检查摘要。 | 不能替代实机红叉检查。 |

## PVF 内资源承接文件

| 文件或字段 | 静态含义 | 边界 |
| --- | --- | --- |
| `.ui [ui controls]` | UI 控件结构，可能引用 `.img` 或 `.ani`。 | UI 文件存在不证明客户端界面贴图、控件坐标或交互正常。 |
| `.wdm [ui path]` | worldmap 指向 UI 文件。 | 只证明 PVF 内入口链存在。 |
| `.act [BASE ANI]` | action 指向主动画。 | action 能挂动画不证明动画 IMG 在客户端存在。 |
| `.act [SUB ANI]` | action 追加子动画。 | 子动画不继承主动画资源完整性。 |
| `.ani FRAME image` | 动画帧引用 `.img` 和帧表现数据。 | 需要客户端 IMG、帧号和实机渲染共同验证。 |
| `.ptl [PARTICLE FILENAME]` | 粒子脚本引用动画或图像资源。 | 粒子静态存在不证明实机粒子播放。 |
| `.til [IMAGE]` | 地图 tile 引用地图 `.img`。 | tile 引用不证明进图、地图绘制或碰撞正常。 |
| `.lay` 模板路径 | 角色外观层可使用模板路径引用动作动画。 | `%s` 等模板不是具体文件，不能按裸路径判缺。 |
| `.wav/.ogg/.mp3` | 声音或音乐资源引用。 | 属于 SoundPacks/Music 边界，不由 ImagePacks2 证明。 |

## NPK 打包边界

商业兼容 NPK 的 32-byte gap/check 结论为：

```text
SHA-256((header + count + index table) 截断到 17 字节倍数)
```

这只说明既有打包算法边界；本主线默认不写 NPK，不替换客户端资源。

## 判断口径

- `PVF 引用存在`：Script.pvf 内写了路径或文件链。
- `ImagePacks2 静态命中`：当前客户端 NPK/IMG 索引里找到同名或候选路径。
- `ImagePacks2 静态未命中`：当前索引没找到候选路径，应记为资源风险。
- `实机资源正常`：必须进客户端观察，不由静态只读结论自动推出。
