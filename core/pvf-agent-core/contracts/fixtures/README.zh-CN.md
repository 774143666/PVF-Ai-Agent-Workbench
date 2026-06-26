# Backend Contract Fixtures

这里保存 PVF backend contract 的最小 fixture。

fixture 不是生产修改方案，也不是知识结论。它只描述一组在目标 PVF 中稳定存在、可低成本验证的路径和 `.lst` 闭环。

## 默认 fixture

- `itemshop-birken.fixture.json`
- 验证 `itemshop/itemshop.lst`
- 解析 ID `37`
- 期望路径 `itemshop/birken.shp`
- controlled-output smoke 使用 no-op replace，不改变文件文本内容

## 扩展 fixture

- `skill-swordman-bloodyrave.fixture.json`
- 验证 `skill/swordmanskill.lst`
- 解析 ID `79`
- 期望路径 `skill/Swordman/BloodyRave.skl`
- 只用于 read-only backend/index contract；不定义写出 smoke

- `dungeon-draconiantower.fixture.json`
- 验证 `dungeon/dungeon.lst`
- 解析 ID `11`
- 期望路径 `dungeon/Act2/DraconianTower.dgn`
- 只用于 read-only backend/index contract；不定义写出 smoke

- `apc-swordman-gsd.fixture.json`
- 验证 `aicharacter/aicharacter.lst`
- 解析 ID `201`
- 期望路径 `aicharacter/swordman/gsd/gsd.aic`
- 只用于 read-only backend/index contract；不定义写出 smoke

## 运行示例

```bat
workbench.bat fixture-check check --all-profiles
workbench.bat backend-contract check --profile <profile> --fixture core\pvf-agent-core\contracts\fixtures\apc-swordman-gsd.fixture.json --scope full
```

如果迁移到其它 PVF，优先复制现有 fixture 再改字段，不要改 `pvf-backend-contract.v1.json`。
