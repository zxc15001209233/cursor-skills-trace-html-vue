# 流水线示意（可选串联）

三个 Skill **均可单独安装使用**。下图只表示「产物」如何衔接，不是安装依赖。

```
┌─────────────────────┐
│ 仅有 UI 截图        │──► Skill1 screenshot-to-vue-ready-html ──┐
└─────────────────────┘                                         │
                                                                ▼
┌─────────────────────┐                              Vue-ready HTML
│ Axure + 内嵌图表源   │──► Skill2 axure-html-restore ──────────┤
└─────────────────────┘                                         │
                                                                ▼
                                                    Skill3 vue-ready-html-to-vue3
                                                    （输入 = 上一步的 HTML 产物，
                                                      或已有同等约定的 HTML）
                                                                │
                                                                ▼
                                                         独立 Vue3 工程
```

- Skill1 / Skill2：二选一即可得到 Vue-ready HTML  
- Skill3：吃 Vue-ready HTML；不要求本机已安装 Skill1/2  
