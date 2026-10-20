# 截图 / Axure → Vue-ready HTML → Vue3（Agent 流程包）

三套**可单独使用**的 Agent 工作流说明（Markdown）。不绑定单一业务产品，也不绑定某一款编辑器——本质是给 AI 的操作规程；Cursor / VS Code / Windsurf / Claude Code / 其他带 Agent 的工具都能用。

| 包 | 作用 | 输入 | 输出 |
|----|------|------|------|
| [`screenshot-to-vue-ready-html`](./screenshot-to-vue-ready-html/) | 截图还原为可转 Vue 的 HTML | UI 截图 / 参考图 | Vue-ready HTML |
| [`axure-html-restore`](./axure-html-restore/) | Axure 导出还原为 Vue-ready HTML | Axure 页 + 内嵌图表源 | Vue-ready HTML |
| [`vue-ready-html-to-vue3`](./vue-ready-html-to-vue3/) | Vue-ready HTML 迁成 Vue3 工程 | **已有的** Vue-ready HTML | 独立 Vue3 工程 |

每个包的入口文件是目录内的 `SKILL.md`。其他工具若无 Skill 机制，**直接把该文件当提示词 / 规则引用即可**。

## 关系说明

- **包 1、2**：入口不同（截图 vs Axure），可二选一；彼此无安装依赖。
- **包 3**：不依赖「必须安装」1 或 2，但依赖它们的**产物**——符合约定的 Vue-ready HTML（`data-v-page` / `data-v-component`、可拆模块、图表固定高等）。  
  若手里已有同等约定的 HTML，可直接用包 3。

串联示意见 [PIPELINE.md](./PIPELINE.md)。三套均含**统一审核门禁**（P0、P1、P2 都必须修完再交付；书面「P2 未覆盖」不算完成）。审核必须并排打开真源和产出，记下顺序、文案、颜色、重复行的 y/行距、字距、圆角、阴影或尺寸的实测值，以及每张统计图的 series 数和半径（或堆叠段数）。同栏模块挤顶、中间留空带、同一排顶边不齐、边框没包住框内内容、边框层数和原图不一致、相邻边框叠线、卡片下半截空着、同卡标题叠在一起、环图空段或柱顶或饼图标注线和原图不一致、地图轮廓或缩略图和原图不一致、散点或关系图的圆被画布裁掉，算 P1。这些都以这张原图为准，不是默认皮肤；两层环或多种系列收成一层、多出原图没有的模块，算 P0。文件存在、尺寸一致、图不是空白，都不能标 ✅：

| 包 | 对照真源 | 审核产物 |
|----|----------|----------|
| 截图 → HTML | 磁盘原图（大屏优先 1920×1080；禁止只靠聊天压缩图） | 差距清单 |
| Axure → HTML | Axure 页 + 内嵌图表 HTML | `AUDIT.md` |
| HTML → Vue3 | 已验收 Vue-ready HTML | `AUDIT-VUE.md` + `build` 通过 |

**大屏页**：设计稿固定基准分辨率，视口 `scale(sx,sy)` 铺满，允许轻微拉伸（详见各 `SKILL.md` / [PIPELINE.md](./PIPELINE.md)）。

**中国地图**：没有特殊要求时，主图不画十段线。原图有南海缩略图才在右侧放，原图没有不要加，也别给原图没有的小图加「南海诸岛」标题。地图名是 `china` 时组件会自己补右下角缩略图：原图没有就要去掉，原图有就不要再手画第二张（详见各 `SKILL.md`）。

## 用 npx 安装（推荐）

需要本机 Node.js ≥ 18。

### 从 Gitee 一键安装（当前仓库）

```bash
# 全部装到 ~/.cursor/skills（Cursor 默认发现路径）
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git
```

### 常用参数

```bash
# 只装某一个
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git \
  install vue-ready-html-to-vue3

# 装到当前项目目录（任意编辑器均可引用，不依赖 Cursor）
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git \
  --preset local
# → ./agent-skills/<包名>/SKILL.md

# 自定义目录
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git \
  --dest ./.agent-skills

# 覆盖已存在目录
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git --force

# 查看包列表
npx --yes git+https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git list
```

| `--preset` | 目标目录 |
|------------|----------|
| `cursor`（默认） | `~/.cursor/skills` |
| `cursor-project` | `./.cursor/skills` |
| `claude` | `./.claude/skills` |
| `agents` | `./.agents/skills` |
| `local` | `./agent-skills` |

> 若已发布到 npm，也可：`npx html-vue-agent-skills`（包名见 `package.json`）。

## 不用 npx 时

任选其一：

1. **对话里引用** — `@` / 附加对应 `SKILL.md`  
2. **拷进项目规则** — `AGENTS.md`、`CLAUDE.md`、`.github/copilot-instructions.md` 等  
3. **粘贴为自定义指令** — 一次只用一个包  

```bash
# 手动拷贝示例
git clone https://gitee.com/zxc19890923/cursor-skills-trace-html-vue.git
cp -R cursor-skills-trace-html-vue/vue-ready-html-to-vue3 ./agent-skills/
```

## 建议

- 一次对话聚焦一个包（例如只做 Axure→HTML，或只做 HTML→Vue3）。  
- 包 3 开干前确认输入 HTML 已满足 Vue-ready 约定，或先跑包 1 / 2。
