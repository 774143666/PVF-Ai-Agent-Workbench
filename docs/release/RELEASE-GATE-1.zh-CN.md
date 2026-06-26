# Release Gate 1：候选包检查

入口：

```bat
workbench.bat release gate1
```

检查发行清单中的文件是否存在，计算每个文件的大小和 SHA-256，并拒绝本机 profile、密钥、运行产物、PVF、客户端资源和压缩包。

它只生成报告，不复制、不压缩、不写 PVF。
