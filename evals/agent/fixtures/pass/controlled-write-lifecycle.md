先解析相关 .lst ID 并读取目标原文，执行 dry-run。随后做时间戳备份，使用 raw/no-simplified 原始文本进行最小替换，只保存到显式的新输出 PVF，不覆盖源 PVF，最后重新打开输出做 readback。
