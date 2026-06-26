# PassiveObject 非 Monster 只读审计卡

状态：默认可用

用途：当任务涉及飞行物、召唤物、地图对象、角色公共对象、`.obj/.act/.atk/.ani`、攻击框或 PVP 覆盖块时，用本卡做只读闭合。它不是写 PVF 配方。

## 账本治理

继续新增 PassiveObject 结论前，先读 `indexes/passiveobject-ledger-governance.zh-CN.md`。超过约 100KB 的主账本只追加短结论；长坐标、长创建链和同族批量差异写入分片索引。`equipmentpassiveobject/requiem/003/boom` 与 `equipmentpassiveobject/requiem/003/boom2` 仅作为历史 cross-boundary PassiveObject 样本冻结，不作为当前主线扩展入口。

## 收口验收

当前主线不再默认继续逐目录扩样本。先读 `indexes/passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md`，再读 `indexes/passiveobject-attackinfo-hitbox-completion-audit.zh-CN.md`、`indexes/passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md` 和 `indexes/passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md`，按 PassiveObject / AttackInfo / Hitbox 三轴验收门判断是否存在真实缺口；只有清单或复核账本判为“缺口待补”时，才按最小小桶补样本。

## 怎么查

1. 先读 `indexes/passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md`、`indexes/passiveobject-attackinfo-hitbox-completion-audit.zh-CN.md`、`indexes/passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md` 和 `indexes/passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md`，确认当前问题属于静态可验收、结构风险、运行风险还是缺口待补。
2. 再读 `indexes/passiveobject-ledger-governance.zh-CN.md`，确认当前样本是否允许写主账本短结论或分片长结论。
3. 再读 `indexes/passiveobject-coverage-ledger.zh-CN.md`，确认本主题已覆盖、未闭合和风险边界。
4. 如果任务涉及 `.atk [active status]`、异常状态或 PVP 覆盖块，再读 `indexes/attackinfo-status-pvp-ledger.zh-CN.md`。
5. 如果任务要查已盘点的 PVP 块明细，再读 `indexes/attackinfo-pvp-block-inventory.zh-CN.md`。
6. 如果任务要查 PVP `.atk` 是否处在静态攻击链中，再读 `indexes/attackinfo-pvp-chain-pilot-ledger.zh-CN.md`。
7. 如果任务涉及枪手目录 PVP `.atk` owner 或 ANI，再读 `indexes/attackinfo-pvp-gunner-chain-ledger.zh-CN.md`。
8. 如果任务涉及 Fighter 目录 PVP `.atk` owner 或 ANI，再读 `indexes/attackinfo-pvp-fighter-chain-ledger.zh-CN.md`。
9. 如果任务涉及 Mage 目录 PVP `.atk` owner 或 ANI，再读 `indexes/attackinfo-pvp-mage-chain-ledger.zh-CN.md`。
10. 如果任务涉及 Priest / Swordman / Thief 目录 PVP `.atk` owner 或 ANI，再读 `indexes/attackinfo-pvp-priest-swordman-thief-chain-ledger.zh-CN.md`。
11. 如果任务涉及 Common / Equipment 目录 PVP `.atk` owner 或 ANI，再读 `indexes/attackinfo-pvp-common-equipment-chain-ledger.zh-CN.md`。
12. 如果任务涉及 zrr_skill PVP `.atk` owner 或未闭合风险，再读 `indexes/attackinfo-pvp-zrr-skill-chain-ledger.zh-CN.md`。
13. 如果任务涉及 ANI hitbox 正样本、反样本、空图攻击框或 SUB ANI 边界，再读 `indexes/passiveobject-hitbox-ani-sample-ledger.zh-CN.md`。
14. 如果任务涉及 `[CREATE PASSIVEOBJECT]` 递归链、创建 ID、随机候选或 registry 路由，再读 `indexes/passiveobject-create-recursion-ledger.zh-CN.md`。
15. 如果任务涉及销毁、消失、生命、追踪或 homing，再读 `indexes/passiveobject-lifecycle-homing-ledger.zh-CN.md`。
16. 判断入口是数字 ID、`.obj` 直接路径，还是上游 `.act/.skl/.map/.dgn` 引用。
17. 如果是数字 ID，先用 `passiveobject/passiveobject.lst` 解析；未命中就停止猜测。
18. 读取 `.obj`，记录 `[basic action]`、`[basic motion]`、`[etc action]`、`[etc motion]`、`[attack info]`、`[int data]`、`[string data]`、销毁条件、追踪块和生命字段。
19. 看到 `<...name_数字...>` 时只当名称或字符串链接，不当 passiveobject ID。
20. 相对路径从当前文件所在目录解析；同名文件不能替代目标路径；搜索 `.atk` owner 时保留原始大小写路径。
21. 读取 `.act`，继续展开 `[BASE ANI]`、`[SUB ANI]`、`[TRIGGER]`、`[BEHAVIOR]` 和 `[CREATE PASSIVEOBJECT]`。
22. 看到 `[CREATE PASSIVEOBJECT]` 的 `[INDEX]` 时，必须回 `passiveobject/passiveobject.lst` 解析目标 `.obj`；未命中就标为未闭合风险，不得猜路径。
23. 如果 `[CREATE PASSIVEOBJECT] [INDEX]` 下有 `[RANDOM SELECT]`，候选数字仍逐个走 `passiveobject/passiveobject.lst`；如果 `[SUMMON MONSTER] [INDEX]` 下有 `[RANDOM SELECT]`，候选数字走 `monster/monster.lst`。
24. 看到 `[WHICH] [ALL MONSTER TEAM] ... [IS INDEX]` 或 `[SUMMON MONSTER] [INDEX]` 时，数字走 `monster/monster.lst`；即使同号在 passiveobject registry 也命中，也不能脱离父块改路由。
25. 看到 `[SUMMON APC] [INDEX]` 或 `[WHICH] [AI CHARACTER] ... [IS INDEX]` 时，数字走 `aicharacter/aicharacter.lst`，不走 passiveobject 或 monster registry。
26. 如果入口来自 `.map [passive object]`，数字仍先走 `passiveobject/passiveobject.lst`，但结论写成地图静态放置，不写成 `[CREATE PASSIVEOBJECT]` 递归链。
27. 看到 `[homing follow]` 后带 registry 数字时，按 token 判断 registry；例如 `[MONSTER]` 后的数字走 `monster/monster.lst`。
28. 对 `.ani` 尝试二进制反编译；只在实际展开后记录 `[ATTACK BOX]` 或 `[DAMAGE BOX]`。
29. 读取 `.atk` 时只记录结构标签和列形，不推断伤害公式、元素结算、硬直、击退、浮空、命中、异常状态公式或 PVP 规则。
30. 如果 `.atk` 有 `[pvp] ... [/pvp]`，必须读到 `[/pvp]`；只记录 PVP 覆盖块存在和块内字段集合，不推断竞技场最终规则。
31. 辅助对照 PVF 的新增字段、ID 或样本只能写成对照观察，不能提升为主目标规则。

## 通过标准

- 数字 ID 已通过 `passiveobject/passiveobject.lst` 解析，或明确标为 direct path 样本。
- `name_数字` 没有被误当作 registry ID。
- `.obj -> .act/.ani/.atk` 的相对路径已经按 owner 目录读取。
- 闭合块没有被截断，例如 `[/etc action]`、`[/etc motion]`、`[/int data]`、`[/string data]`、`[/MOTION]`、`[/object destroy condition]`、`[/homing]`、`[/CREATE PASSIVEOBJECT]`。
- `.atk [pvp]` 已读到 `[/pvp]`；`.atk [active status]` 没有被误写成固定闭合块。
- `[CREATE PASSIVEOBJECT] [INDEX]` 已回 registry 解析，不能只保留裸数字。
- `[SUMMON APC] [INDEX]` 与 `[WHICH] [AI CHARACTER] ... [IS INDEX]` 已按 `aicharacter/aicharacter.lst` 解析。
- ANI 反编译失败时已经记录风险；成功时只记录观察到的盒字段。
- 结论没有混入外部线索、旧材料定位信息或辅助 PVF 独有结论。

## 下一步测试

- 只读测试：先按 `indexes/passiveobject-attackinfo-hitbox-static-acceptance-report.zh-CN.md`、`indexes/passiveobject-attackinfo-hitbox-completion-audit.zh-CN.md`、`indexes/passiveobject-attackinfo-hitbox-acceptance-checklist.zh-CN.md` 和 `indexes/passiveobject-attackinfo-hitbox-acceptance-review-ledger.zh-CN.md` 做 10 项验收门复核；只有发现“缺口待补”时，才按最小小桶补一个主目标样本。
- 实机测试：如果要确认伤害、命中、卡肉、击退、浮空、追踪轨迹、销毁时序或同步，必须进入单独的目标 PVF 写入实验流程。
