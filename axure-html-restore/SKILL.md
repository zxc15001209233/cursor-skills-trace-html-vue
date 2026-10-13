---
name: axure-html-restore
description: >-
  Restores Axure-exported 追溯/中后台 pages into hand-written Vue-ready HTML
  without iframe or dump-inline; ports echarts-axure widgets 1:1. Use when the
  user asks to 还原 Axure、转 HTML、对齐 echarts-axure、无 iframe 重建、转 Vue3
  原型页, or continues CONVERT-PROMPT conversions under rebuild/. Upstream of
  vue-ready-html-to-vue3; not for screenshot-only (use screenshot-to-vue-ready-html).
---

# Axure → Vue-ready HTML

流水线第 2 步（有 Axure 源时的主路径）：壳手写对齐 Axure；图从 `echarts-axure` **1:1** 迁入 `TraceWidgets`。

完整提示词：`~/Desktop/rebuild/CONVERT-PROMPT.md`（或 `{项目}/rebuild/CONVERT-PROMPT.md`）。

下游：`vue-ready-html-to-vue3`。

## 一句话原则

**壳手写对齐 Axure；图从 echarts-axure 原样迁；不定高、不简化、不 iframe；迁完能切口径且不卡。**

## 必须遵守

1. **禁止** iframe、禁止 dump-inline Axure/echarts DOM  
2. **禁止** 简化重画图表（单环代双环等）；从 `echarts-axure/*.html` **1:1** 迁移  
3. 壳层手写；`data-v-page` / `data-v-component` 标注  
4. 图表容器高度用**确定 px**（对齐 Axure iframe）；禁止 `height:100%` 套在仅有 `min-height` 的父级  
5. 顶栏筛选：label 与控件同一行  
6. 性能：Tab 懒加载保活；地图 GeoJSON 单例 + 本地优先；Resize 防抖；口径切换关动画、避免 O(n²)  
7. widget 自带标题则不要外壳再套重复 toolbar  

## 标准流程

1. **盘点**  
   - `{页面}.html` + `files/{页面}/data.js` + `styles.css`  
   - 列出全部 `echarts-axure/*.html` 及 iframe **精确**宽高  

2. **搭壳**  
   - 侧栏 / 筛选 / Tab / KPI / 表格手写  
   - 图表位只留 mount；`widget-card` 高度写成确定 px  

3. **迁图 1:1**  
   ```bash
   python3 rebuild/scripts/port-axure-widget.py --only MountName1 MountName2
   # 或 --all
   ```  
   - 产出 `assets/widgets/*.js` → `TraceWidgets.mountXxx`  
   - port 必须：id 加前缀、CSS `#id` 同步改写、动态 `getElementById` → `root.querySelector`、多 canvas resize  

4. **性能兜底**  
   - Tab：`mounted` 保活，切回只 resize  
   - 地图：`assets/geo/china.json` + 单例加载  
   - 扫码类：缓存日数据；口径切换 `animate: false`  

5. **审核**  
   - 并排 Axure：环层数、堆叠柱、桑基/六饼、筛选文案  
   - 更新 `AUDIT.md`：✅ / ⚠️  

## 禁止事项（踩坑）

| 做法 | 后果 |
|------|------|
| iframe 嵌 echarts-axure | 无法转 Vue |
| dump-inline 整页脚本 | 难维护 |
| 手写简化 ECharts | 环/柱明显不一致 |
| 不定高容器 | 双环半径 0、柱区挤没 |
| 外壳重复 toolbar | 双标题、控件错位 |
| Tab 每次 dispose 重建 | 切换卡顿 |
| 每次 CDN 拉 china.json | 地图长时间空白 |
| 压缩 geo 上按纬度裁 MultiPolygon | **地图大片空白**（字符串坐标被滤空） |
| port 后 CSS 仍写旧 `#id` | 桑基/省图高度塌 0 |

### 地图空白专项

本地 `china.json` 多为 echarts **压缩编码**（ring 为字符串）。`removeSouthernIslands` 仅对数值坐标裁剪；若 `typeof ring === "string"` 则**跳过裁剪**，否则 MultiPolygon 被掏空。

## 目录约定

```
rebuild/
  {page}.html
  AUDIT.md
  CONVERT-PROMPT.md
  scripts/port-axure-widget.py
  assets/
    tokens.css / app.css / nav.js / app.js
    geo/china.json
    widgets/*.js
    pages/{page}.js
echarts-axure/          ← 只读对照，禁止 iframe
```

## 开场话术

```text
请把 Axure 导出页「{页面名}.html」严格还原为手写 Vue-ready HTML，输出到 rebuild/。
对照：壳=Axure 页；图=echarts-axure（从 data.js 列全）；尺寸=styles.css iframe 宽高。
硬性：无 iframe、无 dump-inline、图表 1:1、data-v-page/component、高度确定 px、
筛选一行、Tab 保活、地图本地优先。交付 HTML+assets+AUDIT。
```

短版：

```text
按 CONVERT-PROMPT 还原「{页面名}」：无 iframe、echarts-axure 1:1 迁入 TraceWidgets，
壳层手写对齐，高度用 Axure iframe 确定 px，交付 AUDIT。
```

## 相关

- 仅有截图：`screenshot-to-vue-ready-html`  
- 转 Vue3 工程：`vue-ready-html-to-vue3`  
- 提示词：`PROMPTS.md`「A」+ `CONVERT-PROMPT.md`
