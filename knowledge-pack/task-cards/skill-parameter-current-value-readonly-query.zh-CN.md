# 技能参数当前值只读查询

状态：需验证

## 适用

用于回答“某技能哪个数据可改”“某字段当前是多少”“某职业哪个技能带某字段”这类技能 `.skl` 参数问题。

## 先读

- `indexes/skill-parameter-index.zh-CN.md`
- `indexes/skill-parameter-facts.compact.json`

## 判断

- 问“哪个字段 / 哪一列”：只用知识包结构化事实表即可回答。
- 问“当前是多少”：必须只读目标 PVF 的对应 `.skl`，知识包不保存当前数值。
- 问“能不能改 / 改后是否生效”：本卡不能授权写 PVF，也不能证明运行效果；转读 `workflows/skill-runtime-parameter-edit.zh-CN.md`。

## 执行

1. 用 `lookup.bySkillName[技能名]` 找 `.skl` 路径；重名时用职业目录或用户上下文过滤。
2. 也可直接遍历 `entriesByPath`，按职业目录和字段关键词检索 `static.meanings` / `level.meanings`。
3. 输出字段定位时，说明表名、列号、含义、单位和倍率线索。
4. 如果需要当前值，打开用户确认的目标 PVF，只读对应 `.skl`。
5. `[static data]` 按列号直接取同一行数值。
6. `[level info]` 第一个数通常是列数；后续按列数分组，每组是一等级的数据。
7. `transforms` 中同一列的 `scale` 可用于显示换算，例如毫秒转秒、整数转百分比。
8. 如果目标 `.skl` 的列数、路径或上下文和知识包不一致，只报告不一致，不继续推断。
9. 回答时分清“知识包定位”和“目标 PVF 当前值”。

## 最小示例

`拔刀斩`：

- 知识包定位：`skill/swordman/momentaryslash.skl`
- `[static data]` col 3：`斩击3个敌人时`
- `transforms` col 3 scale `0.1`
- 若用户问当前数值，读取目标 PVF 的该 `.skl` 后再换算显示。

## 禁止

- 不读取原始大资料库或 derived 来源审计来补答案。
- 不把 PVF 当前数值写回知识包。
- 不从字段名直接推断运行效果。
- 不写 PVF，不改客户端。
