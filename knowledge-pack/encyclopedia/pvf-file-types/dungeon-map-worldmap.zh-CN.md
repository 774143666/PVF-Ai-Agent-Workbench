# dungeon / map / worldmap

状态：默认可用

## 用途

配置副本、地图、房间、入口、刷怪、地图对象和世界地图展示。正式副本导入还会涉及客户端资源。

## 常见路径

- `dungeon/dungeon.lst`
- `dungeon/**/*.dgn`
- `map/map.lst`
- `map/**/*.map`
- `worldmap/**/*.wdm`
- `monster/**/*.mob`
- `passiveobject/**/*.obj`
- `ImagePacks2`

## 基本闭环

```text
dungeon registry
-> .dgn
-> map registry / map file
-> monster / object / passiveobject / client asset
```

## 完整主线入口

- `task-cards/dungeon-map-spawn-entry-clear-resource-readonly-audit.zh-CN.md`
- `dictionaries/dungeon-map-spawn-entry-clear-resource-fields.zh-CN.md`
- `indexes/dungeon-map-spawn-entry-clear-resource-boundary.zh-CN.md`

## 规则

- `.dgn` 和 `.map` 要双向确认引用关系。
- 普通 `[map specification]`、旧式 `.map [dungeon]` 反向归属和 AdvanceAltar 特殊 `[advance altar map]` 要分开处理。
- Script.pvf 内引用资源不代表客户端资源存在。
- 自定义副本和成熟副本导入不是同一个任务。
- 区域化、入口、任务链、门票、等级条件、结算奖励需要单独验证。

## 写入边界

副本写入必须输出新 PVF。涉及 UI、BGM、贴图、地图对象时，需要客户端资源授权和游戏内验证。
