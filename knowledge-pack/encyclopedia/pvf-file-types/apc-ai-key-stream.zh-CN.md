# APC / AI / Key Stream

状态：默认可用

## 用途

APC 使用 `.aic` 定义角色、技能、装备、AI pattern 和 key stream。AI 文件决定行为分支，key 文件模拟按键输入。

## 常见路径

- `aicharacter/aicharacter.lst`
- `aicharacter/**/*.aic`
- `aicharacter/**/*.ai`
- `aicharacter/**/*.key`
- `skill/**/*.lst`
- `skill/**/*.skl`

## 基本闭环

```text
aicharacter.lst
-> .aic
-> [ai pattern] .ai
-> [key stream] action name -> .key
-> [quick skill] / [skill]
-> skill registry -> .skl
```

## 规则

- `.aic` 中的 skill ID 必须通过目标职业 skill registry 解析。
- key stream 的动作名要回到 `.aic` 映射，不要只看 `.ai` 返回值。
- 相邻目录的 APC 不能当作同一个 APC。
- `.aic` 数值列含义不清时要标为需验证。

## 写入边界

APC 行为改动要闭合 `.aic -> .ai -> .key -> skill`。涉及战斗表现时需要游戏内验证。
