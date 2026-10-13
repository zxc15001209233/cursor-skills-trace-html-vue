---
name: vue-ready-html-to-vue3
description: >-
  Scaffolds an independent Vue3+Vite+TS+Pinia+Element Plus+ECharts project from
  Vue-ready rebuild HTML (data-v-page/component + TraceWidgets). Use when the
  user asks to 转 Vue3、生成 Vue 工程、迁到 vue-trace、HTML 还原为 Vue、一期
  总览+详情工程化. Input is rebuild-style HTML/widgets, not Axure export or
  raw screenshots (use axure-html-restore / screenshot-to-vue-ready-html first).
---

# Vue-ready HTML → Vue3 工程

流水线第 3 步：把已验收的 Vue-ready HTML（`rebuild/`）迁成可运行的独立 Vue3 工程。

参考实现：`~/Desktop/rebuild/vue-trace/`。

## 输入前提（不满足则停）

- 有 `{page}.html` + `data-v-page` / `data-v-component`  
- 有 `assets/widgets/*.js`（`TraceWidgets.mountXxx`）或可 1:1 迁的图表逻辑  
- 有卡片**确定 px** 高度（见 `app.css` / AUDIT）  
- 用户已确认：独立工程（默认不进既有业务仓如 AIPR-WEB）、一期页面范围、是否尽量 Element Plus  

缺 Axure/截图还原时，先跑上游 Skill。

## 技术栈（默认）

Vue 3 + Vite + TypeScript + Vue Router + Pinia + Element Plus + ECharts 5

## 架构约定

```
{vue-app}/
  public/
    trace-widgets/*.js     ← 复杂图 1:1 IIFE（过渡期）
    assets/geo/china.json  ← 地图本地优先（路径与 widget 内 fetch 一致）
  src/
    views/                 ← data-v-page
    layouts/MainLayout.vue
    components/
      filter/ kpi/ charts/ tables/
    stores/filter.ts
    composables/
      useEcharts.ts        ← 自绘/轻量图
      useLegacyWidget.ts   ← 挂载 TraceWidgets
    styles/tokens.css
```

### 组件映射

按 HTML 的 `data-v-component` **一图一 SFC**（或一表一 SFC）。薄封装示例：

```vue
<!-- charts/DailyScanChart.vue -->
<LegacyMount script-src="/trace-widgets/daily-scan.js"
  mount-name="mountDailyScan" :height="333" />
```

### Element Plus 边界

| 用 EP | 少用/不用 EP |
|-------|----------------|
| 侧栏菜单、筛选、Tab、业务表格、按钮 | 图表内部 DOM（地图控件、双环下钻等） |

细微视觉差可接受；**主图表交互与高度**不可简化。

## 执行流程

### 1. 脚手架

```bash
npm create vite@latest {app} -- --template vue-ts
npm i vue-router@4 pinia element-plus @element-plus/icons-vue echarts
npm i -D sass unplugin-vue-components unplugin-auto-import
```

拷贝 `tokens.css`、`china.json`；配置 EP 自动导入 + 中文 locale。

### 2. 壳层

- `MainLayout`：侧栏 + `<router-view>`  
- `FilterBar`：EP 表单；文案/选项对齐 HTML  
- `stores/filter`：集团/本部/日期/口径/Tab/queryVersion  

### 3. 迁图策略（按保真度）

| 复杂度 | 策略 |
|--------|------|
| 简单 KPI/表（列可 EP） | Vue SFC + mock / `el-table` |
| 双环下钻、分位+趋势、桑基、地图控件 | **优先** `useLegacyWidget` 挂原 widget，高度锁 Axure px |
| 已 Vue 化但差距大 | 回退 legacy，再排期重写 |

**禁止**长期用「能跑的简化 ECharts」冒充原型（单环、缺列、矮容器）。

### 4. 高度与布局

从 rebuild `app.css` 锁定，例如：

| 卡片 | 高度 |
|------|------|
| daily-scan | 333 |
| china-map-heat / atc | 417 |
| monthly-ent | 450 |
| ttm / mom-map | 436 |
| yoy-scan / yoy-map | 448 |
| bubble / key-pct / ytd | 520 |
| product-six | 432 |
| top200-* | 439 |

网格比例对齐 HTML（如 flex `1.7 : 1`），不要只靠随意 `el-col 14/10` 凑合后不管验收。

### 5. Tab / Resize

- `el-tabs` + `lazy`；切回调用子组件 `resize()`  
- **禁止**每次 dispose 整树重建  
- 地图：`window.echarts = echarts` 后再 mount IIFE  

### 6. 地图踩坑（必查）

1. Widget fetch 路径 `assets/geo/china.json` → 放到 `public/assets/geo/`  
2. 压缩 geo 上勿误裁 `removeSouthernIslands`（编码 ring 为 string 则跳过）  
3. 挂载后若 canvas 有尺寸但仍大片空白 → 查 MultiPolygon 是否被滤空  

### 7. 审核与修复

对照 rebuild 写差异表（P0/P1/P2）：

- P0：双环下钻、企业表列/切换、分位+趋势、详情 KPI 数值、Top200 列/高度  
- P1：TTM/YoY 完整交互、地图控件定位、固定高度  
- P2：侧栏/筛选 EP 细微差  

修完跑 `npm run build`（含 `vue-tsc`）。

## 验收清单

- [ ] `npm run dev` 一期路由可开  
- [ ] Tab 切换图不塌、不空白  
- [ ] 复杂图与 rebuild 并排：环/柱/桑基/地图交互一致  
- [ ] 卡片高度与 rebuild 同档 px  
- [ ] 地图全省可见（非仅 Polygon 省份）  
- [ ] 不依赖无关业务仓  

## 开场话术

```text
按 vue-ready-html-to-vue3：以 ~/Desktop/rebuild 为金标准，在 {目标目录}
建独立 Vue3 工程。一期页面：{列表}。尽量 Element Plus（筛选+表）；
复杂图用 TraceWidgets 1:1 挂载并锁定 Axure 高度；拷贝 geo；
交付可 npm run dev / build，并出 vs-rebuild 差异表。
```

## 相关

- 上游截图：`screenshot-to-vue-ready-html`  
- 上游 Axure：`axure-html-restore`  
- 设计参考：`vue-trace/docs/superpowers/specs/*`
