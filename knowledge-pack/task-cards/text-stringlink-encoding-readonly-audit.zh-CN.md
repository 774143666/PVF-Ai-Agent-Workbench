# Text / StringLink / Encoding 只读审计任务卡

状态：默认可用

用途：作为 PVF 中文文本、StringLink 样 token、文本字段、本地化资源和编码风险的短入口。本文只记录主目标 PVF 静态只读观察，不证明中文写入流程、UI 显示、字体覆盖、客户端资源完整或服务端放行。

## 快速结论

- 主目标扫描 120571 个文本承载文件，读取失败 0。
- 观察到 61 个字符串资源候选文件，包括 `n_string.lst`、`stringtable.bin`、名称表、`skillname*.lst` 和多目录 `.str` 文件。
- 主目标有 14926 个文件含 StringLink 样 token，共 27719 个 token，唯一 key 18904 个。
- StringLink 主要集中在 `.stk`、`.obj`、`.equ`、`.aic`、`.map`、`.mob`、`.etc`、`.ui`、`.qst`、`.msn`。
- StringLink 主要出现在 `[name]`、`[name2]`、`[map name]`、`[explain]`、`[flavor text]`、`[minimum info]`、`[ui controls]`、`[name_text]`、`[cond_text]` 等字段。
- Tw 解码下大量文本承载文件可见 CJK 字形；文件级 replacement char 命中 270 个，应作为编码风险桶。
- 当前主目标已有数字字段最小替换的编码安全样本；但仍不能证明直接中文文本写入、客户端 UI 全局正常、字体支持、换行宽度、服务端放行或实机文本加载。

## 默认处理

1. 问文本、中文、乱码、StringLink、名称表、`.str`、`stringtable.bin`、编码或本地化时，先读本任务卡。
2. 需要术语和字段口径时，读 `dictionaries/text-stringlink-encoding-fields.zh-CN.md`。
3. 需要分布矩阵、namespace、标签和辅助差异时，读 `indexes/text-stringlink-encoding-localization-boundary.zh-CN.md`。
4. 需要文件类型说明时，读 `encyclopedia/pvf-file-types/text-stringlink-localization.zh-CN.md`。

## 不能直接下结论

- 不能把 StringLink token 写成 UI 一定显示。
- 不能把直接文本写成字体、换行或控件布局正常。
- 不能把 Tw 下可读写成所有编码都正确。
- 不能把 `.str`、名称表或 `stringtable.bin` 写成运行时一定加载。
- 不能把只读观察或 PVF 读回正常写成客户端中文文本安全。
- 辅助对照只做差异提示，不能覆盖主目标事实。

## 下一步测试建议

本主线当前不做实机测试。后续如果要验证文本写入，最小顺序是：

1. 选一个低风险、可见 UI 文本字段。
2. 确认父文件、父块、StringLink 或直接文本形态。
3. 创建 PVF lab session 和备份。
4. 保存到显式输出 PVF，不覆盖源 PVF。
5. 重新打开输出 PVF 读回。
6. 实机检查 UI 是否显示、换行是否正常、是否有乱码和控件溢出。

如果只是含中文/StringLink 文件中的数字字段最小替换，优先使用已验证安全路线：`pvfEncoding=Cn`、不做简繁转换、不自动转换 StringLink，并在客户端检查相关道具名、说明或副本文本。
