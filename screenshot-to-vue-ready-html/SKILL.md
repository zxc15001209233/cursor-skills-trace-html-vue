---
name: screenshot-to-vue-ready-html
description: >-
  Turns UI screenshots or reference images into Vue-ready hand-written HTML
  (data-v-page/component, fixed-height chart mounts, no iframe). Use when the
  user provides 截图/参考图/preview 图 and asks to 转 HTML、还原页面、生成可转
  Vue3 的 HTML；or when only images exist (no Axure export). Not for Axure
  echarts-axure 1:1 port (use axure-html-restore) or full Vue scaffolding
  (use vue-ready-html-to-vue3).
---

# 截图 → Vue-ready HTML

流水线第 1 步：只有 UI 截图/参考图时，产出**可拆成 Vue3 SFC** 的手写 HTML。

下游：用户确认 HTML 后，可用 `vue-ready-html-to-vue3` 建工程。若随后有 Axure 真源，用 `axure-html-restore` 把图表升到 1:1。

## 何时用 / 不用

| 有什么 | 用本 Skill？ |
|--------|--------------|
| 仅截图 / preview 图 | ✅ |
| Axure 导出 + `echarts-axure` | ❌ → `axure-html-restore` |
| 已是 Vue-ready HTML，要建 Vue3 工程 | ❌ → `vue-ready-html-to-vue3` |
| 可视化大屏复刻 | 优先 `bi-dashboard-generator` |
| 中后台 CRUD 列表/表单 | 优先 `admin-console-generator` |

## 必须遵守

1. **先解析再编码**：禁止跳过结构分析直接乱画  
2. **Vue-ready**：`data-v-page` / `data-v-component`；语义化标签；class + style 块  
3. **图表**：ECharts；容器**固定高度 px**；空节点挂载；逻辑可拆  
4. **禁止** iframe、无法拆的 dump-inline、满屏无 class 内联堆砌  
5. 注释标明 `<!-- Vue3: views/XxxPage.vue · components/Yyy.vue -->`

## 执行流程（两步，可一键合并）

### Step 1 — 解析截图 → 纯 JSON

只返回 JSON，不要前言。顶层 key：`global_info`、`elements`、`check_warnings`。

每个 element：`type`、`text`（不漏小字）、`color`（#hex）、`bbox` 归一化 `[x1,y1,x2,y2]`、`style`（圆角/阴影/字号/对齐）。

`global_info.vue_hint`：建议组件名（PascalCase）与职责（按页面实际命名，勿套用某业务固定清单）。

### Step 2 — JSON → Vue-ready HTML

1. 还原布局、相对尺寸、颜色、圆角、阴影、文案  
2. flex/grid 还原留白与对齐  
3. 根：`data-v-page="{PageName}"`；侧栏/筛选/KPI/图卡/表加 `data-v-component`  
4. 图表空容器 + 固定高；script 按区域分块或外链 `widgets`/`pages`  
5. 交付完整 HTML（或 `{page}.html` + 必要 css/js）；列出组件映射表

### 一键合并（用户未分步时）

先输出 JSON，再生成 HTML；禁止跳过 JSON。

## 验收

- [ ] 与截图结构同构（分区、层级、主文案）  
- [ ] 每个可复用区块有 `data-v-component`  
- [ ] 图表容器有确定 px 高度  
- [ ] 可直接作为 `vue-ready-html-to-vue3` 输入  

## 开场话术

```text
按 screenshot-to-vue-ready-html：先解析附件截图为 JSON（含 vue_hint），
再生成 Vue-ready HTML（data-v-page/component、echarts 固定高挂载），
输出到 {目标路径}。禁止 iframe、禁止跳过 JSON。
```

## 相关

- 下一步工程化：`vue-ready-html-to-vue3`  
- 有 Axure 真图时升级：`axure-html-restore`  
- 项目内若有 `PROMPTS.md`「截图→HTML」章节可作补充，不作为唯一路径
