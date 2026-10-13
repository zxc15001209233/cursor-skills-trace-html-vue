# Cursor Skills · 截图 / Axure → Vue-ready HTML → Vue3

三个 **Cursor Agent Skill**，均可**单独安装、单独使用**。不绑定单一业务产品。

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| [`screenshot-to-vue-ready-html`](./screenshot-to-vue-ready-html/) | 截图还原为可转 Vue 的 HTML | UI 截图 / 参考图 | Vue-ready HTML |
| [`axure-html-restore`](./axure-html-restore/) | Axure 导出还原为 Vue-ready HTML | Axure 页 + 内嵌图表源 | Vue-ready HTML |
| [`vue-ready-html-to-vue3`](./vue-ready-html-to-vue3/) | Vue-ready HTML 迁成 Vue3 工程 | **已有的** Vue-ready HTML | 独立 Vue3 工程 |

## 关系说明

- **Skill 1、2**：入口不同（截图 vs Axure），可二选一，也可都装；彼此无安装依赖。
- **Skill 3**：不依赖「必须安装」1 或 2，但依赖它们的**产物**——符合约定的 Vue-ready HTML（`data-v-page` / `data-v-component`、可拆模块、图表固定高等）。  
  若手里已有同等约定的 HTML，可直接用 Skill 3，不必跑 1/2。

串联示意见 [PIPELINE.md](./PIPELINE.md)。

## 单独安装

复制到 Cursor 个人 skills 目录即可，按需拷贝一个或多个：

```bash
# 只装某一个
cp -R screenshot-to-vue-ready-html ~/.cursor/skills/
cp -R axure-html-restore ~/.cursor/skills/
cp -R vue-ready-html-to-vue3 ~/.cursor/skills/

# 或一次全装
cp -R screenshot-to-vue-ready-html axure-html-restore vue-ready-html-to-vue3 ~/.cursor/skills/
```

装好后在对话里用对应场景触发，或 `@` 引用该目录下的 `SKILL.md`。
