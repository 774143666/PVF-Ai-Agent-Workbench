# TypeSquirrel 可选增强

TypeSquirrel 是 NUT/API/符号问题的可选增强，不是 Workbench 的硬依赖。

## 什么时候用

当前 Agent 明确暴露 TypeSquirrel 工具时，用它处理：

- NUT 内置函数查询。
- Squirrel 类、成员、属性、符号定义。
- 当前 PVF 脚本里的局部变量、参数、调用来源解析。
- 工程符号索引查询。

## 使用边界

- 先搜索，再读取精确定义；不要猜 API 名。
- TypeSquirrel 结论只解决脚本/API 语义，不替代目标 PVF 的 `.lst` 解析、文件 readback 或实机验证。
- 没有 TypeSquirrel 时，不阻塞基础 PVF 修改；按 `knowledge-pack` 边界、目标 PVF 文件和 bat/Node CLI 继续。
- 不要把 TypeSquirrel 运行结果、实验记录或大段源码写进 clean `knowledge-pack`。

## 降级方式

如果当前 Agent 没有 TypeSquirrel：

1. 用 `workbench.bat pvf-read search/read/resolve-lst` 定位目标文件。
2. 只根据目标 PVF 中实际出现的 NUT/SKL/OBJ/ATK 结构做静态判断。
3. 对未知 API 标注“需 TypeSquirrel 或实机验证”，不要补全函数名或臆造行为。
