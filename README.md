# 截图 / Axure → Vue-ready HTML → Vue3（Agent 流程包）

三套**可单独使用**的 Agent 工作流说明（Markdown）。不绑定单一业务产品，也不绑定某一款编辑器——本质是给 AI 的操作规程；Cursor / VS Code / Windsurf / Claude Code / 其他带 Agent 的工具都能用。

| 包 | 作用 | 输入 | 输出 |
|----|------|------|------|
| [`screenshot-to-vue-ready-html`](./screenshot-to-vue-ready-html/) | 截图还原为可转 Vue 的 HTML | UI 截图 / 参考图 | Vue-ready HTML |
| [`axure-html-restore`](./axure-html-restore/) | Axure 导出还原为 Vue-ready HTML | Axure 页 + 内嵌图表源 | Vue-ready HTML |
| [`vue-ready-html-to-vue3`](./vue-ready-html-to-vue3/) | Vue-ready HTML 迁成 Vue3 工程 | **已有的** Vue-ready HTML | 独立 Vue3 工程 |

每个包的入口文件是目录内的 `SKILL.md`（YAML frontmatter + 正文）。其他工具若无 Skill 机制，**直接把该文件当提示词 / 规则引用即可**。

## 关系说明

- **包 1、2**：入口不同（截图 vs Axure），可二选一；彼此无安装依赖。
- **包 3**：不依赖「必须安装」1 或 2，但依赖它们的**产物**——符合约定的 Vue-ready HTML（`data-v-page` / `data-v-component`、可拆模块、图表固定高等）。  
  若手里已有同等约定的 HTML，可直接用包 3。

串联示意见 [PIPELINE.md](./PIPELINE.md)。

## 怎么用（通用）

任选其一即可，按你当前编辑器 / Agent 习惯：

1. **对话里引用**  
   打开或 `@` / 附加对应目录的 `SKILL.md`，再说你的具体任务（页面名、路径、截图等）。

2. **项目规则**  
   把需要的 `SKILL.md` 拷进仓库约定位置，例如：
   - `.cursor/rules/` 或项目 `AGENTS.md` / `CLAUDE.md`
   - `.github/copilot-instructions.md`（或拆成多份再在说明里链过去）
   - 其他工具的「自定义指令 / System prompt / Rules」配置项  

3. **系统 / 用户提示词**  
   将 `SKILL.md` 正文粘贴进 Agent 的自定义指令；一次只用一个包，避免互相抢上下文。

4. **本机 Cursor Skills 目录（可选）**  
   若使用 Cursor 且希望自动发现 Skill：

```bash
# 按需拷贝一个或多个
cp -R screenshot-to-vue-ready-html ~/.cursor/skills/
cp -R axure-html-restore ~/.cursor/skills/
cp -R vue-ready-html-to-vue3 ~/.cursor/skills/
```

> Cursor 的 `~/.cursor/skills/` 只是其中一种落盘方式，**不是唯一用法**。换编辑器时用上面 1～3 即可。

## 建议

- 一次对话聚焦一个包（例如只做 Axure→HTML，或只做 HTML→Vue3）。  
- 包 3 开干前确认输入 HTML 已满足 Vue-ready 约定，或先跑包 1 / 2。
