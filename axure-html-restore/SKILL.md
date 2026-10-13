---
name: axure-html-restore
description: >-
  Restores Axure-exported mid-admin/dashboard pages into hand-written Vue-ready
  HTML without iframe or dump-inline; ports embedded chart HTML 1:1 into modular
  widgets. Use when the user asks to 还原 Axure、转 HTML、对齐 echarts-axure、
  无 iframe 重建、转 Vue3 原型页, or CONVERT-PROMPT style work under rebuild/.
  Upstream of vue-ready-html-to-vue3. Not for screenshot-only
  (use screenshot-to-vue-ready-html).
---

# Axure → Vue-ready HTML（通用）

流水线第 2 步：有 Axure 导出时，壳手写对齐；内嵌图表页 **1:1** 迁成可挂载的 widget 模块。

适用于**任意** Axure 中后台/分析页，不绑定单一产品名。若项目内有 `CONVERT-PROMPT.md`，以其为补充细则；无则按本 Skill。

下游：`vue-ready-html-to-vue3`。

## 一句话原则

**壳手写对齐 Axure；图从内嵌图表源原样迁；不定高、不简化、不 iframe；结构可拆 Vue3。**

## 必须遵守

1. **禁止** iframe、禁止 dump-inline Axure/图表 DOM  
2. **禁止** 简化重画图表；从内嵌图表 HTML（常见 `echarts-axure/*.html`）**1:1** 迁移  
3. `data-v-page` / `data-v-component` 标注  
4. 图表容器高度用**确定 px**（对齐 Axure iframe）；禁止 `height:100%` 套仅有 `min-height` 的父级  
5. 顶栏筛选：label 与控件同一行（源如此则保持）  
6. 性能：Tab 懒加载保活；静态地图数据本地优先；Resize 防抖；重计算避免 O(n²)  
7. widget 自带标题则不要外壳再套重复 toolbar  

## 标准流程

1. **盘点**  
   - `{页面}.html` + `files/{页面}/data.js`（或等价）+ `styles.css`  
   - 列出全部内嵌图表源及 iframe **精确**宽高  

2. **搭壳**  
   - 侧栏 / 筛选 / Tab / KPI / 表手写  
   - 图表位只留 mount；高度写成确定 px  

3. **迁图 1:1**  
   - 产出 `assets/widgets/*.js`（或项目约定目录）→ `mountXxx(root)`  
   - 若有 `port-axure-widget.py` 之类脚本优先用；须：id 加前缀、CSS 同步、动态查询挂到 `root`、多实例 resize  

4. **性能兜底**  
   - Tab 保活，切回只 resize  
   - 大静态资源（如地图 GeoJSON）单例 + 本地  

5. **审核**  
   - 并排 Axure：图层结构、交互、筛选项  
   - `AUDIT.md`：源 → 文件 → ✅/⚠️  

## 目录约定（可按项目改名）

```
{out}/
  {page}.html
  AUDIT.md
  assets/
    tokens.css / app.css
    widgets/*.js
    pages/{page}.js
    （可选）geo/*.json
```

挂载命名空间可用 `TraceWidgets` 或项目自定（如 `AppWidgets`），前后一致即可。

## 常见坑（通用）

| 做法 | 后果 |
|------|------|
| iframe 嵌图表 | 难转 Vue |
| 简化 ECharts | 与原型明显不一致 |
| 不定高容器 | 图塌成 0 |
| Tab 每次 dispose | 切换卡顿 |
| 压缩 GeoJSON 上误做纬度裁剪 | 地图大片空白 |

## 开场话术

```text
请把 Axure 导出页「{页面名}.html」严格还原为手写 Vue-ready HTML，输出到 {目录}/。
对照：壳=Axure 页；图=内嵌图表源（从 data.js 列全）；尺寸=iframe 宽高。
硬性：无 iframe、无 dump-inline、图表 1:1、data-v-page/component、高度确定 px。
交付 HTML+assets+AUDIT。
```

## 相关

- 仅截图：`screenshot-to-vue-ready-html`  
- 转 Vue3：`vue-ready-html-to-vue3`  
- 项目细则（若有）：`CONVERT-PROMPT.md`
