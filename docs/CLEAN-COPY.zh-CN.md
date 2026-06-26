# 干净复制到新电脑

这个 Workbench 可以直接拷到另一台电脑给 AI Agent 使用，但干净包只应该包含规则、工具、知识包和示例。不要把本机私有配置、真实 PVF、客户端、索引缓存或运行产物一起当成工作台内容迁移。

## 不要复制

- `config/providers.local.json`
- `config/workspace-profiles.local.json`
- `config/*.secret.json`
- 任何真实 `.pvf`、`.bak`、`.npk`、`.img`

运行产物默认直接写到 Workbench 外部，`workbench.bat check` 会拒绝 Workbench 内残留的非占位运行产物。手动复制前仍应确认没有把外部运行目录、真实 PVF 或客户端一起打包。

## 新电脑启动顺序

1. 进入 Workbench 根目录，运行 `workbench.bat check`。
2. 支持 Agent Skills 的宿主可以直接发现 `.agents/skills/dnf-pvf-xpilot`；需要用户级调用时，在新电脑运行 `workbench.bat skill install --client codex` 或 `--client agents`。
3. 让当前 AI Agent 先读 `AGENTS.md`、`README.zh-CN.md` 和 knowledge-pack 路由入口。
4. 如果需要固定 PVF、客户端和输出目录，重新运行 `workbench.bat profile init ... --set-active` 生成本机 profile。
5. 如果宿主 Agent 支持 MCP，再按 `config/mcp-templates/README.zh-CN.md` 配置 MCP。
6. 如果当前 Agent 没有暴露 MCP 工具，降级使用 `workbench.bat pvf-read`、`workbench.bat pvf-index`、`workbench.bat pvf-change`。

## 复制后判断是否干净

- `workbench.bat check` 应通过。
- `workbench.bat knowledge-check` 应通过。
- `workbench.bat doctor check --skip-profiles` 应通过必需能力通道。
- `workbench.bat eval self-test` 应同时接受正夹具并拒绝负夹具。
- `workbench.bat skill self-test` 应通过结构、安装更新、漂移检测和冲突保护检查。
- `workbench.bat release gate3` 应在独立 stage 中通过。
- `config/workspace-profiles.local.json` 不应该来自旧电脑；需要时在新电脑重新生成。
