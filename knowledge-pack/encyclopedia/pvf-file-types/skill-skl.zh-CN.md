# skill/.skl 技能文件

状态：默认可用

## 用途

`.skl` 描述技能入口、类型、状态、动作、静态数据、派生关系和运行时引用。具体字段会随职业、技能类型和 PVF 版本变化。

## 常见路径

- `skill/*.lst`
- `skill/**/*Skill.lst`
- `skill/**/*.skl`
- `character/**/*.chr`
- `sqr/**/*.nut`
- `passiveobject/**/*.obj`
- `*.atk`

## 基本闭环

```text
职业 skill registry
-> skill ID
-> .skl
-> state / substate / action / static data / NUT 入口
-> 相关 passiveobject / attack / animation / character state
```

## 规则

- 不同职业的 skill registry 名称不一定一致，必须在目标 PVF 中确认。
- state/substate 不能从另一个技能样本直接泛化。
- `[static data]` 数字列需要目标技能或同族样本验证。
- 涉及 NUT 时必须确认目标脚本入口和可调用 API。

## 写入边界

技能改动必须读目标技能链。涉及柔化、派生、强制使用、命中、伤害、特效或动作时，读回后仍需要游戏内验证。
