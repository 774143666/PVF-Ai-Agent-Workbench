# Client Assets / ImagePacks2 / NPK / UI 资料线索补强

状态：已补强  
适用范围：客户端图像、UI、NPK、IMG、资源闭合、红叉风险、地图/动作/粒子/外观资源排查  
边界：只读知识页；不证明客户端实机资源正常；不授权写 PVF 或改客户端。

## 核心结论

客户端资源问题必须分三层判断：

1. **PVF 引用层**：`.ui/.wdm/.act/.ani/.ptl/.til/.lay/.map/.dgn` 等文件里出现资源路径，只能说明配置需要这个资源。
2. **ImagePacks2 静态索引层**：NPK/IMG 索引命中只能说明静态索引能找到目标 IMG。
3. **实机渲染层**：是否无红叉、帧号正确、坐标正常、透明度正常、加载顺序正常、客户端补丁生效，必须靠客户端侧验证。

资料线索能提升“查哪里”的确定性，不能把静态命中提升为实机成功。

## 资料线索沉淀

- 资源类教程、资源包样例和工具说明都把 `ImagePacks2/NPK/IMG/UI` 作为客户端侧独立检查对象。
- 副本、地图、世界地图类样例经常出现 cutscene、minimap、worldmap pattern 等 `.img` 字段，适合指导地图/界面资源排查。
- 源码和标签索引反复出现 `[FRAME MAX]`、`[FRAME000]`、`[IMAGE]`、`[IMAGE POS]`、`[GRAPHIC EFFECT]` 等 `.ani` 帧级线索，说明动画资源不能只看路径，还要看帧、位置和效果字段。
- UI 标签线索可用于定位窗口、格子、仪表、跳转目录等 UI 家族，但同名标签跨文件族时不能自动合并含义。
- 资源打包线索提示：整合 NPK 主要是复制 IMG 二进制块；模板式 IMG 引用需要展开；外观层缺失应归类为客户端素材缺口。

## 已封存主目标事实的用法

已封存边界页已经确认主目标存在大量 `.ani/.act/.til/.ptl/.als/.map/.dgn/.ui/.wdm/.twn/.lay` 文件，并完成了 UI/map/action/particle/tile 第一桶与全量 `.ani` 帧级 IMG 的静态索引扫描。

这些统计的正确用法是：

- 静态命中：写成“ImagePacks2 索引可命中”，不要写成“客户端显示正常”。
- 静态缺失：写成“客户端资源风险”，不要直接写成“实机必红叉”。
- 读错或未闭合：写成“静态盘点缺口”，不要直接推断运行失败原因。
- 顶层缺失分布：用于决定优先排查目录，例如 UI/map/worldmap、creature、character、monster、item、interface 等。

## 排查路线

遇到红叉、黑图、图标缺失、UI 缺图、地图贴图缺失、动画帧缺失时，按下面顺序查：

1. 先定位触发问题的 PVF 文件和字段。
2. 抽出资源路径、帧号、坐标、模板展开规则和所属文件族。
3. 查 ImagePacks2/NPK/IMG 静态索引是否命中。
4. 若静态缺失，归类为客户端资源风险；若静态命中，继续做客户端侧验证。
5. 涉及整合 NPK 时，记录 selected IMG、missing、invalid entry、hash/list、外观层缺口和隔离 A/B 条件。
6. 实机验证阶段再判断是否无红叉、帧号正确、界面正常、动画正常。

## 禁止推断

- 不能用 PVF 引用证明客户端资源完整。
- 不能用 ImagePacks2 静态命中证明实机正常。
- 不能用资料样例路径替代目标客户端路径。
- 不能把资源包样例、教程截图、源码提示、注释表解释直接写成主目标事实。
- 不能在本页证明音频播放、UI 正常、动画命中、客户端补丁放行或服务端流程正确。

## 关联入口

- `task-cards/client-assets-imagepacks-ui-readonly-audit.zh-CN.md`
- `dictionaries/client-assets-imagepacks-ui-fields.zh-CN.md`
- `indexes/client-assets-imagepacks-ui-boundary.zh-CN.md`
- `encyclopedia/pvf-file-types/assets-imagepacks-ui.zh-CN.md`
