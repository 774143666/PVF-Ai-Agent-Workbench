# NUT / API / 运行时脚本

状态：需验证

## 用途

NUT 脚本用于技能、appendage、passiveobject、状态、攻击包和运行时逻辑。它能实现 PVF 静态字段很难表达的行为。

## 常见路径

- `sqr/**/*.nut`
- `load_state/**/*.nut`
- `appendage/**/*.nut`
- `passiveobject/**/*.nut`
- `skill/**/*.skl`

## 规则

- 不猜函数名。需要 API 时必须用 TypeSquirrel 或目标工程符号索引查询。
- 另一个客户端或职业的 NUT 写法只能当参考。
- `ForceUse_Character`、`sq_IsUseSkill`、`pushPassiveObj`、`receiveData`、`AttackInfoPacket` 等调用必须按目标 PVF 和目标脚本链验证。
- 自定义 passiveobject、动态攻击包、appendage 效果都需要实机验证。

## 写入边界

NUT 改动风险高。写入前必须确认入口链、目标对象类型、回调函数、参数含义、输出 PVF、读回和游戏内验证方案。
