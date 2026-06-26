# 词典

这里放纯词典。词典只解释标签、字段、常见值、装备词条或 API 名称，不写执行流程，也不写来源链。

## 迁入原则

词典只写三类内容：

- 资料明确写过的含义。
- 目标 PVF 可观察事实。
- 已验证结论。

目标 PVF 可观察事实是机器能从目标 PVF 直接读到的结构事实，例如字段在哪类文件出现、registry 能否解析、字段块是什么形态。它不证明改字段后的游戏效果。

资料明确但未目标验证的字段应标为 `需验证`。已知容易误用的字段标为 `禁用`。

## 写法

```text
[tag or field]
状态：默认可用 / 需验证 / 禁用
含义：...
常见位置：...
注意：...
```

## 已建入口

- `pvf-tags.zh-CN.md`
- `npc-shop-fields.zh-CN.md`
- `equipment-fields.zh-CN.md`
- `stackable-fields.zh-CN.md`
- `monster-fields.zh-CN.md`
- `attackinfo-atk-fields.zh-CN.md`

- `monster-action-animation-fields.zh-CN.md`

- `passiveobject-action-fields.zh-CN.md`

- `passiveobject-obj-fields.zh-CN.md`

- `monster-ai-fields.zh-CN.md`

- `nut-runtime-api-boundary-quick.zh-CN.md`
- `nut-runtime-api-boundary.zh-CN.md`
