# Release Gate 3：无 PVF 冷启动

入口：

```bat
workbench.bat release gate3
```

先执行 Gate 2，再在独立 stage 中运行：

- `check-env`
- `check-knowledge-pack`
- Agent Skill 安装器自检
- Agent eval 自检
- `workbench-doctor --skip-profiles --skip-release-gates`
- stage 内再次执行 Gate 1

本门禁不需要真实 PVF，不创建 profile，不调用 PVF 写入或客户端写入。
