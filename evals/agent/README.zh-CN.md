# Agent 回归评测

这套评测检查 Agent 是否能正确路由 PVF 任务、保持只读默认、安全写入边界、知识包纯净边界和客户端资源边界。

它不调用模型，也不需要 API key。

## 使用

生成待回答目录：

```bat
workbench.bat eval scaffold
```

命令会返回外部运行目录中的 `responsesDir`。把不同 Agent 的回答保存到该目录，再评分：

```bat
workbench.bat eval check --responses "<scaffold 返回的 responsesDir>"
```

检查评分器自身：

```bat
workbench.bat eval self-test
```

确定性规则只能检查关键安全点和明显违规，不能代替人工判断回答是否真正解决了复杂 PVF 问题。
