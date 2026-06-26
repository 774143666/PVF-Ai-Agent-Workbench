# Monster 创建 PassiveObject 链只读核查

状态：默认可用

先读：
- `encyclopedia/pvf-file-types/monster-mob.zh-CN.md`
- `encyclopedia/pvf-file-types/passiveobject-attackinfo-hitbox.zh-CN.md`
- `dictionaries/monster-action-animation-fields.zh-CN.md`
- `dictionaries/passiveobject-action-fields.zh-CN.md`
- `dictionaries/passiveobject-obj-fields.zh-CN.md`
- `dictionaries/attackinfo-atk-fields.zh-CN.md`
- `indexes/monster-created-passiveobject-act-observed-tag-router.zh-CN.md`
- `indexes/monster-created-passiveobject-obj-observed-tag-router.zh-CN.md`
- `indexes/attackinfo-atk-observed-tag-router.zh-CN.md`
- `indexes/monster-action-animation-ani-observed-tag-router.zh-CN.md`

执行：
1. 确认目标 PVF，只读打开，编码优先 `Tw`。
2. 扫描目标 monster `.act` 的 `[CREATE PASSIVEOBJECT]` 与 `[CREATE PASSIVEOBJECT CIRCLE]`。
3. 同时识别闭合块和内联直接 ID；闭合块内检查直接 `[INDEX]`、`[RANDOM SELECT]`、`[RANDOM]` 区间与空 `[INDEX]`。
4. 每个静态数字 ID 都通过 `passiveobject/passiveobject.lst` 解析。
5. 读取已解析 `.obj`，闭合其 `.act/.ani/.atk` 引用。
6. 下游 `.act` 如果继续创建 passiveobject，递归展开并对 ID、`.obj`、`.act` 去重，直到不再出现新节点。
7. `.ani` 使用二进制 ANI 反编译；`.atk` 按 AttackInfo 路由核字段和 token。
8. registry 未命中、空 `[INDEX]`、缺失文件引用和反编译失败分别记录，不互相替代。
9. 不写 PVF，不修改客户端，不把教程、样例或字段名直接解释为运行效果。

验收：
- 所有目标 monster `.act` 均有读取结果或明确读错。
- 每个静态 passiveobject ID 均有 registry 命中/未命中判断。
- 每个 registry 命中对象均有 `.obj` 存在/缺失判断。
- 下游 `.obj/.act/.ani/.atk` 引用均有存在/缺失判断。
- 递归创建链已收敛，未因循环重复膨胀。
- `.obj`、下游 `.act` 和 `.atk` 的观察标签已按路由覆盖。
- 没有把静态闭合等同于运行效果或客户端资源完整。
