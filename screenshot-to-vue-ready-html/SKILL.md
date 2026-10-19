---
name: screenshot-to-vue-ready-html
description: >-
  Turns UI screenshots or reference images into Vue-ready hand-written HTML
  (data-v-page/component, fixed-height chart mounts, no iframe). Use when the
  user provides 截图/参考图/preview 图 and asks to 转 HTML、还原页面、生成可转
  Vue3 的 HTML；or when only images exist (no Axure export). Not for Axure
  echarts-axure 1:1 port (use axure-html-restore) or full Vue scaffolding
  (use vue-ready-html-to-vue3). Requires a filesystem original (prefer
  1920×1080); chat-compressed images alone are insufficient. Always audit
  against the original and fix P0 and P1 before claiming fidelity. P2 may
  remain documented.
---

# 截图 → Vue-ready HTML

流水线第 1 步：只有 UI 截图/参考图时，产出**可拆成 Vue3 SFC** 的手写 HTML。

下游：用户确认 HTML 后，可用 `vue-ready-html-to-vue3` 建工程。若随后有 Axure 真源，用 `axure-html-restore` 把图表升到 1:1。

## 何时用 / 不用

| 有什么 | 用本 Skill？ |
|--------|--------------|
| 仅截图 / preview 图（**仓库或本地原图路径**） | ✅ |
| Axure 导出 + `echarts-axure` | ❌ → `axure-html-restore` |
| 已是 Vue-ready HTML，要建 Vue3 工程 | ❌ → `vue-ready-html-to-vue3` |

本包自洽：不依赖其它大屏/中后台 Skill 是否已安装。

## 源图硬规则（写任何 CSS 之前）

实战结论：**聊天里发的图会被压缩（常见变成约 1024×576 JPEG 冒充 .png），细字、表头、色阶、控件角标会糊掉，按聊天图还原必然「差距大」。必须从文件系统读原图。**

1. **禁止**把「仅聊天附件」当作唯一真源去量布局/抠数字。  
2. **要求**用户把原图放进仓库或给出本地绝对路径（如 `项目/image.png`、`~/Desktop/.../ref-1920.png`），Agent 用 `Read` / Pillow / `sips` / `file` **读磁盘文件**。  
3. **大屏默认基准 1920×1080**（或用户声明的原生分辨率）。写前必须核真实宽高：
   ```bash
   # macOS 示例
   sips -g pixelWidth -g pixelHeight /path/to/ref.png
   # 或
   python3 -c "from PIL import Image; im=Image.open('...'); print(im.size, im.mode)"
   ```
4. **判定**：
   | 真实宽高 | 动作 |
   |----------|------|
   | 正好 1920×1080（或约定基准） | 可按原尺寸分区 clip 后解析 |
   | 宽 &lt; 1600，或明显是聊天压缩件 | **停**。请用户补文件系统原图；禁止「放大聊天图」当看清了 |
   | 宽 ≥ 1600 但不是基准 | 可继续，但列宽只写大约占比；确认单写明「非 1:1」 |
5. 聊天里 `@image.png` **可以**作为线索，但必须以磁盘上同路径/用户另存的原图为准；若聊天预览与磁盘文件不一致，**以磁盘为准**。  
6. 写 `parse.json` 的 `check_warnings` 必须记录：源图路径、真实宽×高、是否聊天压缩风险。

## 大屏铺满显示（仅大屏页）

设计稿仍按基准分辨率（默认 **1920×1080**）排版；浏览器视口用变换**铺满**，允许轻微非等比拉伸（常见大屏比例略偏时避免黑边）。

```js
// #screen 固定 width:1920px; height:1080px; transform-origin:center center;
function fit() {
  var sx = window.innerWidth / 1920;
  var sy = window.innerHeight / 1080;
  screen.style.transform = "translate(-50%, -50%) scale(" + sx + "," + sy + ")";
}
window.addEventListener("resize", fit);
```

| 做法 | 是否采用 |
|------|----------|
| `scale(sx, sy)` 铺满（可轻微拉伸） | ✅ 大屏默认 |
| `Math.min` 等比缩放留黑边 | ❌ 大屏不要（除非用户明确要求） |
| 直接把布局改成 `width:100%` 流式重排 | ❌ 禁止（破坏设计稿对齐） |

resize 后图表须 `echarts.resize()`。中后台列表/表单页不适用本条。

## 必须遵守

1. **先解析再编码**：禁止跳过结构分析直接乱画  
2. **Vue-ready**：`data-v-page` / `data-v-component`；语义化标签；class + style 块  
3. **图表**：ECharts；容器**固定高度 px**；空节点挂载；逻辑可拆  
4. **禁止** iframe、无法拆的 dump-inline、满屏无 class 内联堆砌  
5. 注释标明 `<!-- Vue3: views/XxxPage.vue · components/Yyy.vue -->`  
6. **禁止**跳过 Step 3 审核就声称「已对齐截图」

## 执行流程（三步；可一键合并，但不可跳过审核）

### Step 0 — 源图鉴定（门禁）

确认磁盘原图路径与真实分辨率；不满足则停，请用户提供 1920×1080（或声明基准）原图。

### Step 1 — 解析截图 → 纯 JSON

只返回 JSON，不要前言。顶层 key：`global_info`、`elements`、`check_warnings`。

每个 element：`type`、`text`（不漏小字）、`color`（#hex）、`bbox` 归一化 `[x1,y1,x2,y2]`、`style`（圆角/阴影/字号/对齐）。

`global_info.vue_hint`：建议组件名（PascalCase）与职责（按页面实际命名，勿套用某业务固定清单）。

解析时应对原图做**分区 clip**（顶栏 / 筛选 / 左列各卡 / 中 KPI+地图 / 右列各卡），再读细字；禁止只看整图缩略糊一眼。

### Step 2 — JSON → Vue-ready HTML

1. 还原布局、相对尺寸、颜色、圆角、阴影、文案  
2. flex/grid 还原留白与对齐  
3. 根：`data-v-page="{PageName}"`；侧栏/筛选/KPI/图卡/表加 `data-v-component`  
4. 图表空容器 + 固定高；script 按区域分块或外链 `widgets`/`pages`  
5. 交付完整 HTML（或 `{page}.html` + 必要 css/js）；列出组件映射表  
6. 将原图复制到输出目录（如 `ref-1920.png`），便于后续对照

### Step 3 — 对照原图审核 → 修复（必做）

**首轮 HTML 几乎一定有硬错**（表头列名、导航左右位、KPI 信息架构、假数据）。必须审核后再交付。

1. 用原图分区 clip，与当前 HTML（同分辨率打开或截屏）**并排对照**  
2. 输出差距清单，按严重度：
   - **P0**：表头/主数字错、导航分区错、关键区块缺失或多余（如地图多了标题条）  
   - **P1**：信息架构（如标题与「同比」是否同行）、控件形态、色相主题  
   - **P2**：装饰线/灯管示意级（标「未覆盖像素级材质」即可，可留）  
3. **先修 P0，再修 P1**；修完再扫一轮，直到无 P0、P1。书面说明不能代替 P0、P1 修复  
4. 向用户交付时写清：已按磁盘原图审核；仍为结构同构，灯管/电路密度未承诺像素级  

用户说「差距大 / 审核一下 / 继续优化」时：回到 Step 3，禁止重新瞎画一版无视原图数字。

### 一键合并（用户未分步时）

Step 0 → JSON → HTML → **审核修复**；禁止跳过 JSON，禁止跳过审核。

## 验收

- [ ] 源图来自文件系统，真实分辨率已记录（大屏优先 1920×1080）  
- [ ] 与原图结构同构（分区、层级、主文案与表头数字）  
- [ ] 已做过 Step 3 审核并消除 P0、P1
- [ ] 每个可复用区块有 `data-v-component`  
- [ ] 图表容器有确定 px 高度  
- [ ] 可直接作为 `vue-ready-html-to-vue3` 输入  

## 开场话术

```text
按 screenshot-to-vue-ready-html：
1) 请提供磁盘上的原图路径（大屏优先 1920×1080）；不要只靠聊天压缩图。
2) 鉴定宽高 → 分区解析为 JSON（含 vue_hint）→ 生成 Vue-ready HTML
   → 对照原图审核并修复 P0/P1。
输出到 {目标路径}。禁止 iframe、禁止跳过 JSON、禁止跳过审核。
```

用户若只丢了聊天图：

```text
聊天图会被压缩，细字与色阶不可靠。请把 1920×1080（或原生分辨率）原图
放到仓库/本地路径后再继续；我不会用放大后的聊天图当量寸依据。
```

## 相关

- 下一步工程化：`vue-ready-html-to-vue3`  
- 有 Axure 真图时升级：`axure-html-restore`  
- 项目内若有 `PROMPTS.md`「截图→HTML」章节可作补充，不作为唯一路径
