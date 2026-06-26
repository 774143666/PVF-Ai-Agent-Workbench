# Release Gate 2：Stage 复制校验

入口：

```bat
workbench.bat release gate2
```

先执行 Gate 1，再把候选文件复制到生成的 stage 目录。复制后逐文件复核大小和 SHA-256，并再次扫描禁止文件。

它不生成安装包，不写 PVF，不复制客户端或本机 profile。
