---
name: vue-ready-html-to-vue3
description: >-
  Turns Vue-ready hand-written HTML (data-v-page/component, modular widgets,
  fixed-height chart mounts) into an independent Vue3+Vite+TS project. Use when
  the user asks to 转 Vue3、生成 Vue 工程、HTML 迁 Vue、原型工程化. Works for
  any mid-admin/dashboard Vue-ready HTML, not only one product. Input must be
  Vue-ready HTML (use screenshot-to-vue-ready-html or axure-html-restore first).
  Always audit the Vue app against the source HTML and fix P0, P1, and P2
  before claiming migration complete. A documented P2 is not done.
---

# Vue-ready HTML → Vue3 工程（通用）

流水线第 3 步：把**任意**已验收的 Vue-ready HTML 迁成可运行的独立 Vue3 工程。

本 Skill 描述的是**通用迁移动作**，不绑定具体业务名、页面名或某次项目目录。业务特例（如某张地图高度表）放在「可选附录」，默认不要当成硬编码。本包自洽，不依赖未随附的其它 Skill。

## 输入约定（通用契约）

源 HTML 至少满足：

| 约定 | 说明 |
|------|------|
| `data-v-page` | 一页 → 一个 `views/*Page.vue` |
| `data-v-component` | 一区块 → 一个 SFC（或明确合并理由） |
| 语义化结构 | `header` / `aside` / `main` / `section`… |
| 样式可抽 | class + token/css；非满屏无 class 内联 |
| 逻辑可拆 | `widgets/` / `pages/` 模块，或按区块注释分块的 script |
| 图表挂载 | 空容器 + **确定 px 高度**；可 init/dispose |

不满足则先回上游 Skill，或先补标注再迁。若上游带 `AUDIT.md`，迁移时保留其高度/映射结论。

## 真源（对照什么）

| 优先级 | 真源 | 用途 |
|--------|------|------|
| 1 | 已验收的 Vue-ready HTML + `assets/`（及上游 `AUDIT.md`） | 布局、高度 px、组件边界、图表挂载 |
| 2 | 浏览器中源 HTML 与 `npm run dev` 中的 Vue 页并排 | 迁移后审核 |
| — | 聊天截图 / 口头「大概像」 | **不可**当高度或交互的唯一依据 |

## 开工前确认（问清再脚手架）

1. **工程位置**：独立新仓 / 指定目录（默认独立，不擅自改无关业务仓）  
2. **一期页面范围**：从源 HTML 列出，用户确认子集  
3. **UI 库**：默认 Element Plus；可改为 Naive / Ant Design Vue / 无组件库  
4. **图表**：有 ECharts 则装 ECharts；复杂 IIFE widget 过渡期可挂载，目标仍是 Vue SFC  
5. **保真策略**：`strict`（交互/高度对齐源 HTML）或 `ep-acceptable`（表单/表可用组件库）。两种策略都必须修完 P0、P1、P2；用了组件库也不能留下已量到的字距、圆角、阴影或 1～4px 差

## 默认技术栈

Vue 3 + Vite + TypeScript + Vue Router + Pinia  
+（可选）选定的 UI 库 + ECharts（源有图才装）

## 通用目录

```
{vue-app}/
  public/                 ← 静态资源；若有 IIFE widgets / geojson 按源路径镜像
  src/
    views/                ← data-v-page
    layouts/              ← 壳（侧栏+主区等，按源有无）
    components/           ← data-v-component（可按 filter/kpi/charts/tables 分子目录）
    stores/               ← 从筛选/全局状态抽象，字段跟源页面，不预设业务名
    composables/          ← useEcharts、useLegacyWidget（若需要）等
    styles/               ← tokens + 全局样式（从源 css 抽）
    api/                  ← mock + 预留
    router/
  AUDIT-VUE.md            ← 迁移审核表（必交付）
```

命名跟 `data-v-*`，**不要**写死某产品的组件清单。

## 迁移策略（通用）

### A. 壳与路由

1. 盘点全部 `data-v-page` → 路由表  
2. 公共壳（侧栏/顶栏）→ `layouts/*`  
3. 筛选/全局状态 → Pinia；字段从源 HTML 抽取，禁止抄某项目的字段除非源里就有  

### B. 组件拆分

- 每个 `data-v-component` → 一 SFC（一图一文件 / 一表一文件为默认）  
- HTML 注释里的 `views/… · components/…` 优先采用  

### C. 图表保真阶梯

| 情况 | 做法 |
|------|------|
| 逻辑简单、易 Vue 化 | SFC + `useEcharts`（init / setOption / resize / dispose） |
| 复杂交互已有独立 IIFE/`mountXxx` | 过渡期 `useLegacyWidget` 挂载；**高度用源 CSS/AUDIT 的 px** |
| 已 Vue 化但明显简化 | 标为 P0，回挂源 widget 或重迁，禁止长期「能跑的假图」 |

### D. UI 库边界（有组件库时）

| 倾向用组件库 | 倾向保留自绘 |
|--------------|--------------|
| 菜单、表单、日期、Tab、业务表格、对话框 | 图表内部控件、强自定义工具条、像素敏感布局 |

### E. 布局与高度

- 从源 `app.css` / 内联约定 / AUDIT **读取**各卡高度与栅格比例  
- 禁止凭感觉改矮、改 `height:100%` 套 `min-height` 父级  
- Tab：懒加载 + 切回 `resize()`；禁止每次整树 dispose 重建  
- **大屏页**：保留源 HTML 的固定设计稿尺寸（如 1920×1080）+ `scale(sx,sy)` **铺满视口、允许轻微拉伸**；禁止改成流式 `100%` 重排，也禁止只用 `Math.min` 等比留黑边（除非用户明确要求）

### F. 静态资源

- 按源 HTML 的相对路径镜像到 `public/`（含 `assets/geo/*`、字体、图片）  
- Widget 内 `fetch('assets/...')` 的路径必须在 Vite 下可访问  

## 审核 → 修复（必做；对照源 HTML）

**脚手架跑起来 ≠ 迁移完成。** 路由能开、图表不空白，都不算对齐。必须对照源 HTML（及上游 AUDIT）审核后再交付。上游 `AUDIT.md` 里没有实测值的 ✅ 不能沿用，要在浏览器里重测。全局样式和组件库不得用裸 `.panel`、`.kpi` 打进图表内部；canvas 宽高接近整页面板就是样式串了，算缺图。同名节点用坐标锁定，禁止取第一个。

1. **并排对照**：同源路径打开源 HTML vs `npm run dev` 对应路由；逐 `data-v-component` 记下顺序、文案、选中态、高度的实测值  
2. 输出 `AUDIT-VUE.md` 差异表，每行 `源（实测）→ Vue（实测）→ ✅/⚠️ + 等级`。没有实测值的 ✅ 视为未审核：

| 等级 | 含义 | 处理 |
|------|------|------|
| **P0** | 缺图/空白图、高度塌、主交互明显不对、缺列/缺区块、图表被简化成「假图」、层数或系列数被收掉、主卡片顺序错、主数字或角标错、选中态做成另一种控件 | **必须修完** |
| **P1** | 功能明显简化、布局比例差大、Tab/筛选后偶发不 resize、标记色或涨跌色明显不对、缺源里有的图标、同栏重复行距和源不一致或模块挤顶留空带 | **必须修完**（书面说明不能代替修复） |
| **P2** | 组件库替换导致的字距、圆角、阴影、1～4px 差 | **必须修完**。`ep-acceptable` 也不能留。顺序、角标、选中态不能标进 P2 |

3. **先修 P0，再修 P1，再修 P2**；修完再打开两边复测改过的块，直到无 P0、P1、P2。书面说明不能代替修复。与源一致的行为不是未关闭的 P2  
4. 再跑：`npm run build`（含类型检查）通过  
5. 用户说「差距大 / 审核一下 / 继续」时：回到本步，禁止只加功能不对照源 HTML  

**禁止**跳过审核就声称「已迁完 / 已对齐原型」。

## 验收清单（通用）

- [ ] 一期路由可开，`npm run dev` / `build` 通过  
- [ ] 每个源 `data-v-component` 有对应 SFC 或书面合并说明  
- [ ] 图表切换 Tab / 筛选后不塌、不空白  
- [ ] 高度与栅格与源 HTML 同档；字距、圆角、阴影已按实测对齐  
- [ ] 已产出 `AUDIT-VUE.md`，每行有源与 Vue 的实测值，无未关闭的 P0、P1、P2  
- [ ] 无擅自改写无关业务仓库  

## 开场话术

```text
按 vue-ready-html-to-vue3（通用流程）：以 {源 HTML 目录} 为金标准，
在 {目标目录} 建独立 Vue3 工程。一期页面：{列表}。
UI 库：{Element Plus|…}；保真：{strict|ep-acceptable}。
按 data-v-page/component 拆 SFC；复杂图优先挂源 widget 并锁定源高度；
交付可 dev/build，并出 AUDIT-VUE.md（vs 源 HTML 的 P0/P1/P2）；
必须消除 P0、P1、P2 后再交，禁止跳过审核。书面「P2 未覆盖」不算完成。
```

## 可选附录：中后台 + ECharts 常见坑

仅在源包含对应能力时使用，**不是默认必做清单**：

- 地图：本地 GeoJSON；echarts 压缩坐标勿误做纬度裁剪（string ring 跳过）。没有特殊要求时，主图不画十段线（丢掉 `adcode` 为 `100000_JD` 或 `adchar` 为 `JD` 的要素）；偏南岛礁不放进主图视野，只保留在地图右侧标注「南海诸岛」的缩略图里，缩略图同样不画十段线。源 HTML 明确把十段线画在主图上时，按源保留。
- 多图 Tab：保活 + resize；口径切换关动画、避免 O(n²)  
- IIFE 挂载前设置 `window.echarts`  
- 审计时优先查：双环/堆叠是否被简化、表列是否被裁、卡片高度是否被改矮  

历史参考实现（非模板）：某次 `rebuild/` → `vue-trace/` 仅作对照，新项目禁止照抄业务字段与高度表。

## 相关

- 上游截图：`screenshot-to-vue-ready-html`  
- 上游 Axure：`axure-html-restore`
