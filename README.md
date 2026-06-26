# PVF Ai Agent 简易使用教程

### 第一步：获取并安装任意一款 Ai Agent 工作台

市面上有很多 Ai Agent 工具，以下只是主流推荐的几款：

| 软件名 | 说明  | 官网  |
| --- | --- | --- |
| WorkBuddy | 腾讯出品，签到送小额的 Ai 使用额度，能力平庸 | https://copilot.tencent.com/work/#download-section |
| Trae | 字节跳动出品，免费排队使用主流 Ai ，能力标准 | https://www.trae.cn/ |
| OpenCode | 纯开源工具，推荐自费购买 Ai API 接入，能力优秀 | https://opencode.ai/zh/download |
| Codex | 需要翻墙能力，需购买价格昂贵的官方会员，能力优秀 | https://openai.com/zh-Hans-CN/codex/ |
| Claude Code | 需要翻墙能力，需购买价格昂贵的官方会员，能力惊人 | https://claude.com/product/claude-code |

### 第二步：接入便宜好用的国产模型 API （以Deepseek+OpenCode为例）

**——注意！看不懂可以去看“模型接入与工作区指定教程.docx”的图文教程——**

1. 打开并登陆Deepseek开发平台：[DeepSeek](https://platform.deepseek.com/usage)
  
2. 打开“用量信息”页面
  
3. 点击“去充值”，一般10元即可使用很久
  
4. 随后打开“API keys”页面
  
5. 点击“创建 API key” （名称可随意填写） 随后复制此 API key
  
6. 打开安装好的Opencode
  
7. 打开设置页面，就是位于软件左下角的小齿轮（或使用快捷键 Ctrl + , ）
  
8. 在设置页面内，打开“提供商”页面，点击下方的“查看更多提供商”
  
9. 点击DeepSeek后面的连接，然后将之前创建的 API key 粘贴进去，确定
  

### 第三步：为 Ai Agent 指定工作区（以OpenCode为例）

**——注意！看不懂可以去看“模型接入与工作区指定教程.docx”的图文教程——**

1. 点击软件左侧边栏的加号打开项目（或使用快捷键 Ctrl + O ）
  
2. 选择你解压好的“PVF-Agent-Workbench”文件夹所在位置
  
3. 在对话框下方选择模型及其思考强度（推荐Deepseek + Max）
  
4. 开始对话使用
  

**小技巧：修改前可准备一份内容量大且BUG很少的 PVF 作为辅助参照（例如幻境/神迹等）Ai会将成功经验平移，可显著降低错误。

### 补充：进阶方案与模型推荐

虽然理论上 Claude Code 这类更强大的工具都需要订阅官方会员，但也可以使用技术手段修改，这里的视频教程仅作推荐：

[ClaudeCode桌面版 = 中文汉化 + 免登录 + 接入DeekSeek + 安装自己的Skill](https://www.bilibili.com/video/BV1RdLm6PEFF/)

[全网最全！60分钟全面掌握Claude Code～【附完整文档】](https://www.bilibili.com/video/BV1NvRyBzEhq/)

如果你明显感觉 Deepseek 无法满足诉求，那么可以考虑以下模型：

Minimax M3：价格和 Deepseek 接近但能力略微逊色，拥有多模态（看图）能力，你能直接发送图片进行交流。

Mimo v2.5：小米大模型，能力和价格都接近 Deepseek，拥有多模态能力。不推荐没有多模态的 Mimo v2.5 Pro。

Kimi K2.6：能力明显强于以上模型，拥有多模态能力，但上下文较短，无法进行长期多轮对话。

GLM 5.2：国产模型的能力巅峰，超越 GPT5.4 的存在。但没有多模态能力，且因过于火爆和国外不可抗力制约，速度明显偏慢。

Claude Opus 4.6：几乎毫无短板的模型，价格达国产模型 20~50 倍（GPT同价）通常作为总设计师、总策划的角色偶尔使用。

ChatGPT 5.5：工业生产级模型，能够非常严谨的执行极其复杂的任务。但是不擅长编撰剧情故事/任务描述等中文文本任务。
