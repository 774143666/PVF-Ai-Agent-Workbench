# 装备 / 光环 / 时装 / 宠物提取输出边界

状态：默认可用

## 可写入报告的结论

- root 物品按正确 registry 的解析结果。
- equipment、stackable、creature、appendage、common/equipment、partset 的候选依赖。
- icon、ANI、IMG、external asset refs 和客户端资源风险。
- 光环/时装视觉相关字段是否出现。
- 宠物蛋与 creature 本体是否可静态关联。
- unresolved references 和 read errors。

## 不可写入为事实的结论

- 穿戴后外观、光环、时装层级在客户端显示成功。
- 宠物召唤、技能、AI、特效或语音成功。
- 套装效果、装备触发、appendage 效果实机生效。
- 客户端 NPK/ImagePacks2 资源完整。

## 升级到导入前必须补齐

1. 源 PVF、目标 PVF、目标客户端明确。
2. 目标 PVF 中同 ID、同路径、同 registry 冲突已读回。
3. 生成最小变更清单。
4. 客户端资源另走 ImagePacks2/NPK 检查。
5. 输出 PVF 重新打开读回。
6. 光环、时装、宠物必须实机验证视觉或运行时效果。
