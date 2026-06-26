# 真实任务验证报告模板

日期：`YYYY-MM-DD`

任务 ID：`<task-id>`

模式：`read-only` / `controlled-output`

## 目标

说明本次任务要验证的真实 PVF 闭环。

示例：

```text
npc -> itemshop.lst -> .shp -> sell item -> item registry/item file
```

## 非目标

- 不覆盖源 PVF。
- 不修改客户端资源。
- 不把一次样本成功外推成通用规则。
- 不把索引命中当成最终证据。

按任务补充其它非目标。

## Profile 与目标 PVF

| profile | source PVF | 用途 |
| --- | --- | --- |
| `<profile-name>` | `<absolute source PVF path>` | `<primary/comparison>` |

## 读取入口

列出本次任务实际读取的 workflow、field dictionary、validated capability 或 source-of-truth。

| 类型 | 路径 |
| --- | --- |
| workflow | `<path>` |
| field dictionary | `<path>` |
| validated capability | `<path>` |

## 基线检查

记录任务开始前执行的只读门禁或环境检查。

```bat
workbench.bat doctor check --all-profiles --scope <scope>
workbench.bat pvf-index status --profile <profile> --scope <scope>
```

结果摘要：

- `summary.ok=<true/false>`
- `passed=<n>`
- `failed=<n>`
- `warnings=<n>`
- 报告路径：`<path>`

允许 warning：

- `<warning>`

## 源 PVF 初始状态

| PVF | size | mtime UTC |
| --- | ---: | --- |
| `<path>` | `<bytes>` | `<ISO time>` |

## 闭环步骤

### Step 1: 入口注册表解析

命令：

```bat
workbench.bat pvf-read resolve-lst --profile <profile> --lst <registry.lst> --id <id> --no-summary
```

结果：

- registry: `<registry.lst>`
- ID: `<id>`
- resolved path: `<pvf/path.ext>`
- entry count: `<n>`

### Step 2: 目标文件 readback

命令：

```bat
workbench.bat pvf-read read --profile <profile> --path <pvf/path.ext> --max-chars <n>
```

读回重点：

```text
<short excerpt or structured summary>
```

### Step 3: 二级/三级 ID 解析

按任务继续解析 sell item、skill state、map/dungeon、passiveobject、asset path 等二级或三级引用。

| source field | ID/path | registry/check | resolved path | readback |
| --- | --- | --- | --- | --- |
| `<field>` | `<id>` | `<registry.lst>` | `<pvf/path.ext>` | `ok/fail` |

## 写出状态

如果本轮只读：

- write authorized: `false`
- source overwritten: `false`
- output PVF: `none`
- backup: `none`
- readback output: `not applicable`

如果本轮 controlled-output：

- write authorized: `true`
- change-set: `<path>`
- dry-run manifest: `<path>`
- backup: `<path>`
- output PVF: `<path>`
- readback output: `ok/fail`
- source overwritten: `false`
- client resource write: `false`

## 源 PVF 复核

| PVF | initial size | final size | initial mtime UTC | final mtime UTC | unchanged |
| --- | ---: | ---: | --- | --- | --- |
| `<path>` | `<bytes>` | `<bytes>` | `<ISO time>` | `<ISO time>` | `true/false` |

## 结论

用短句列出已被目标 PVF 直接证明的事实。

- `<fact>`

## 风险与边界

- 索引只作为加速，最终证据必须来自目标 PVF readback。
- Script.pvf 引用不证明客户端 ImagePacks2 / NPK 资源完整。
- 未实机验证的运行时效果不得标为 `runtime-validated`。
- `<task-specific boundary>`

## 知识吸收建议

| 结论 | 建议等级 | 目标位置 | 原因 |
| --- | --- | --- | --- |
| `<finding>` | `target-readonly/evidence-only/negative-sample/runtime-validated` | `<path or none>` | `<reason>` |

## 后续动作

- `<next action>`
