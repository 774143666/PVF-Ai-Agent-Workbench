# Monster AttackInfo .atk 只读核查

状态：默认可用

先读：
- `encyclopedia/pvf-file-types/monster-mob.zh-CN.md`
- `encyclopedia/pvf-file-types/passiveobject-attackinfo-hitbox.zh-CN.md`
- `dictionaries/monster-fields.zh-CN.md`
- `dictionaries/attackinfo-atk-fields.zh-CN.md`
- `indexes/attackinfo-atk-observed-tag-router.zh-CN.md`
- `indexes/attackinfo-atk-backtick-token-router.zh-CN.md`

执行：
1. 确认目标 PVF，只读打开，编码优先 `Tw`。
2. 通过 `monster/monster.lst` 解析目标 monster ID，不能猜 ID。
3. 读取目标 `.mob`，定位 `[attack info]` 块。
4. 将反引号 `.atk` 路径按 `.mob` 所在目录解析；处理 `../` 后再判断文件是否存在。
5. 空反引号按空槽记录；非 `.atk` 值单独标为特殊引用链。
6. 读取闭合到的 `.atk`，按字段路由记录伤害、目标、反应、状态、PVP 或特殊块。
7. 如要解释命中范围，继续核 `.ani [ATTACK BOX]`；如要解释生命周期，继续核 `.act/.obj/NUT`。
8. 不写 PVF，不修改客户端，不把教程或注释语义直接写成结论。

验收：
- `.mob [attack info]` 的每个非空 `.atk` 值都有存在/缺失判断。
- `.atk` 字段只写“观察到和如何核查”，不写未经验证的实战效果。
- 数字 ID 已通过正确 registry 解析。
- 若发现缺失 `.atk`，标为断链/需复核，不当作可用配置。

