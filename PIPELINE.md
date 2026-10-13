# 流水线示意（可选串联）

三套流程包**均可单独使用**。下图只表示产物衔接，不是安装依赖。本包**不依赖**未随附的其它 Skill。

```
磁盘原图（优先 1920×1080；禁止仅用聊天压缩图）
        │
        ▼
Skill1 screenshot-to-vue-ready-html
  Step0 鉴定 → JSON → HTML → 审核修 P0
        │
Axure 导出 + 内嵌图表 ──► Skill2 axure-html-restore
                            盘点→壳→迁图 → 审核修 P0 + AUDIT.md
        │                         │
        └──────────┬──────────────┘
                   ▼
            Vue-ready HTML
                   │
                   ▼
Skill3 vue-ready-html-to-vue3
  脚手架 → 拆 SFC → 对照源 HTML 审核修 P0 + AUDIT-VUE.md
  → npm run build
                   │
                   ▼
            独立 Vue3 工程
```

## 三 Skill 统一审核门禁

| Skill | 对照真源 | 审核产物 | 硬规则 |
|-------|----------|----------|--------|
| screenshot-to-vue-ready-html | 磁盘原图（大屏优先 1920×1080） | parse 警告 + 差距清单 | 聊天压缩图不可当唯一真源；无 P0 再交 |
| axure-html-restore | Axure 页 + 内嵌图表 HTML | `AUDIT.md` | 禁止简化重画图；无 P0 再交 |
| vue-ready-html-to-vue3 | 已验收 Vue-ready HTML | `AUDIT-VUE.md` | 能跑 ≠ 迁完；无 P0 且 build 过再交 |

等级约定（三处一致）：

- **P0**：主结构/主数字/缺图塌高/假图 → 必须修  
- **P1**：比例、交互缺截 → 尽量修或书面留下  
- **P2**：细微样式 / 示意装饰 → 可标未覆盖  

**大屏显示**：设计稿固定基准分辨率（默认 1920×1080），视口用 `scale(sx, sy)` 铺满，允许轻微拉伸；禁止流式重排，禁止默认黑边 letterbox。

- Skill1 / Skill2：二选一即可得到 Vue-ready HTML  
- Skill3：吃 Vue-ready HTML；不要求本机已装 Skill1/2  
