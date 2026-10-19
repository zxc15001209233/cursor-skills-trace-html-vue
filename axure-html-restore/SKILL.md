---
name: axure-html-restore
description: >-
  Restores Axure-exported mid-admin/dashboard pages into hand-written Vue-ready
  HTML without iframe or dump-inline; ports embedded chart HTML 1:1 into modular
  widgets. Use when the user asks to 还原 Axure、转 HTML、对齐 echarts-axure、
  无 iframe 重建、转 Vue3 原型页, or CONVERT-PROMPT style work under rebuild/.
  Upstream of vue-ready-html-to-vue3. Always audit against Axure + embedded
  chart sources and fix P0, P1, and P2 before claiming fidelity. A documented
  P2 is not done. Not for screenshot-only
  (use screenshot-to-vue-ready-html).
---

# Axure → Vue-ready HTML（通用）

流水线第 2 步：有 Axure 导出时，壳手写对齐；内嵌图表页 **1:1** 迁成可挂载的 widget 模块。

适用于**任意** Axure 中后台/分析页，不绑定单一产品名。若项目内有 `CONVERT-PROMPT.md`，以其为补充细则；无则按本 Skill。

下游：`vue-ready-html-to-vue3`。本包自洽，不依赖未随附的其它 Skill。

## 一句话原则

**壳手写对齐 Axure；图从内嵌图表源原样迁；不定高、不简化、不 iframe；结构可拆 Vue3；未审核修完 P0、P1、P2 不得声称对齐。**

## 真源（对照什么）

| 优先级 | 真源 | 用途 |
|--------|------|------|
| 1 | Axure 导出页 `{页面}.html` + `data.js` / `styles.css` | 壳布局、筛选项、Tab、文案、iframe 宽高 |
| 2 | 内嵌图表 HTML（常见 `echarts-axure/*.html`） | 图表 option / DOM / 交互 **1:1** |
| — | 聊天截图 | **不可**当量寸或迁图唯一依据（可作沟通线索） |

## 必须遵守

1. **禁止** iframe、禁止 dump-inline Axure/图表 DOM  
2. **禁止** 简化重画图表；从内嵌图表 HTML **1:1** 迁移  
3. `data-v-page` / `data-v-component` 标注  
4. 图表容器高度用**确定 px**（对齐 Axure iframe）；禁止 `height:100%` 套仅有 `min-height` 的父级  
5. 顶栏筛选：label 与控件同一行（源如此则保持）  
6. 性能：Tab 懒加载保活；静态地图数据本地优先；Resize 防抖；重计算避免 O(n²)  
7. widget 自带标题则不要外壳再套重复 toolbar  
8. **禁止**跳过 Step 6 审核就声称「已对齐 Axure」  
9. **壳样式不得漏进 widget**。壳的布局规则必须写成页面根的直接子级（如 `.stage > .panel`）。禁止裸选择器 `.panel`、`.kpi`、`.kpi-row`、`.kpi-main`、`.header`。图表源里常有同名 class；壳写了宽高、widget 规则没覆盖同一属性时，壳的宽高仍然生效，图会被撑出挂载槽再被裁掉  
10. **大屏页**（若源为固定分辨率大屏）：设计稿保持源宽高（常见 1920×1080），视口用 `scale(sx,sy)` 铺满、允许轻微拉伸；禁止改成流式 `100%` 重排或默认黑边 letterbox  

## 标准流程

### 1. 盘点

- `{页面}.html` + `files/{页面}/data.js`（或等价）+ `styles.css`  
- 列出全部内嵌图表源及 iframe **精确**宽高  

### 2. 搭壳

- 侧栏 / 筛选 / Tab / KPI / 表手写  
- 图表位只留 mount；高度写成确定 px  

### 3. 迁图 1:1

- 产出 `assets/widgets/*.js`（或项目约定目录）→ `mountXxx(root)`  
- 若有 `port-axure-widget.py` 之类脚本优先用；须：id 加前缀、CSS 同步、动态查询挂到 `root`、多实例 resize  

### 4. 性能兜底

- Tab 保活，切回只 resize  
- 大静态资源（如地图 GeoJSON）单例 + 本地  

### 5. 产出目录

见下方「目录约定」。

### 6. 对照 Axure 审核 → 修复（必做）

**首轮还原几乎一定有硬错**（漏 iframe、高度塌、图被简化、筛选行错位、KPI 左右对调）。必须审核后再交付。图表挂上了 ≠ 页面对齐了。

**下面这些都不算审核，写了 ✅ 也不得交付：**

- 只核对 widget 文件存在、iframe 宽高一致、地图或 canvas 不是空白
- 只读 `data.js` / HTML 的 DOM 或文本顺序，不在浏览器里量坐标
- `AUDIT.md` 行是 ✅，但没有源的实测值和产出的实测值
- 把 KPI 顺序、角标原文、选中态颜色、源里有的图标/箭头标成 P2「细微样式」
- 字距、圆角、阴影、1～4px 宽差只写进 AUDIT、标成可留，没有改掉
- canvas 存在，但 `offsetWidth/offsetHeight` 接近整页面板（如图被撑成 1700×1004）而不是挂载槽。这是壳样式漏进 widget，算缺图

1. **并排打开** Axure 原页和手写 HTML（`file://` 会让 GeoJSON 失败，用同一本地 http 服务）。每个有内容的页面至少量这些块，色值写计算后的 hex/rgb，不写「蓝色」。同名 `data-label` 或同文案有多个时，用坐标锁定要量的那一个，禁止取查询结果的第一个：
   - **KPI / 指标卡**：视觉从左到右的标题顺序（用坐标，不用 DOM 顺序）、主数字、角标原文、标记色、涨跌色、卡片底色
   - **筛选**：label 在控件上方还是同一行；选中项的背景、边框、文字颜色。源是半透明色块就不要做成实心深底白字
   - **导航**：每一项的 y、高度、当前项底色、分组箭头、子项缩进。不要用统一 margin 代替逐项坐标
   - **Tab**：点击命中按钮本身（透明层盖住按钮 = 没做完）；切换后对应面板显示，其余隐藏
   - **图表**：挂载槽内每个 canvas 的宽高必须落在槽内，不能等于整页面板；标题还在、不是空白、不是另一张简化图
2. **大屏 `scale()`**：对照用未缩放的设计坐标（`offsetWidth` 或源里的 left/top），不要拿缩放后的 `getBoundingClientRect` 和 1920 稿比。动态面板、分组的视觉顺序以页面坐标为准，`objects` 顺序经常和从左到右不一致
3. 差距写入 `AUDIT.md`，按严重度：
   - **P0**：缺图/空白图、高度塌成一条、图表被简化重画、**壳样式漏进 widget 把图撑出或裁掉**、主筛选/Tab/主文案错、缺关键列或区块、**主 KPI 从左到右顺序错、主数字或角标文案错、选中态做成另一种控件**
   - **P1**：布局比例明显偏差、交互缺一截（如口径切换）、重复 toolbar、资源路径偶发失败、**标记色/涨跌色/卡片底色明显不对、缺源里有的图标或分组箭头、Tab 被挡住点不到**、**同栏重复行距和源不一致，或模块挤顶、中间留空带**
   - **P2**：字距、圆角、阴影、1～4px 宽差、示意级装饰。等级低，也必须修完；写成「未覆盖」不算完成
4. **先修 P0，再修 P1，再修 P2**；修完再打开两边复测改过的块，直到无 P0、P1、P2。书面说明不能代替修复。与源一致的行为（源本身没有的交互）不是未关闭的 P2，不要为了消项给源里没有的功能加行为
5. `AUDIT.md` 每行必须带实测：`源（节点 + 实测值）→ 产出（实测值）→ ✅/⚠️ + 等级`。没有实测值的 ✅ 视为未审核
6. 用户说「差距大 / 审核一下 / 细节没对上 / 继续」时：回到本步，禁止无视源重新简化一版  

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
| 跳过审核 | 漏图/错高带病进 Vue3 |
| 图表在、尺寸对就写壳 ✅ | KPI 顺序、角标、选中态带病交付 |
| 用 data.js 的 DOM 顺序当视觉顺序 | 卡片左右对调 |
| 壳用裸 `.panel` / `.kpi` | 同名 class 在图表里被撑成整页，图被裁掉 |
| 同名节点取查询的第一个 | 选中态、颜色量错对象 |

## 验收

- [ ] 无 iframe、无 dump-inline；图表来自内嵌源 1:1  
- [ ] 每个图表位高度为确定 px，且对齐 Axure iframe  
- [ ] `data-v-page` / `data-v-component` 齐全  
- [ ] 已做 Step 6：浏览器并排量过 KPI 顺序/角标/选中态/导航/Tab，以及字距、圆角、阴影、1～4px 宽差；`AUDIT.md` 每行有实测值，无未关闭的 P0、P1、P2
- [ ] 可直接作为 `vue-ready-html-to-vue3` 输入  

## 开场话术

```text
请把 Axure 导出页「{页面名}.html」严格还原为手写 Vue-ready HTML，输出到 {目录}/。
对照：壳=Axure 页；图=内嵌图表源（从 data.js 列全）；尺寸=iframe 宽高。
硬性：无 iframe、无 dump-inline、图表 1:1、data-v-page/component、高度确定 px。
交付 HTML+assets+AUDIT；必须浏览器并排量测壳（顺序、文案、颜色、选中态、字距、圆角、阴影）和图表，消除 P0、P1、P2 后再交。没有实测值的 ✅ 不算审核。书面「P2 未覆盖」不算完成。
```

## 相关

- 仅截图：`screenshot-to-vue-ready-html`  
- 转 Vue3：`vue-ready-html-to-vue3`  
- 项目细则（若有）：`CONVERT-PROMPT.md`
