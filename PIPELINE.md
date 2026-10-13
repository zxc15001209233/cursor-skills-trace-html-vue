# 通用流水线：截图 / Axure → Vue-ready HTML → Vue3

```
┌─────────────────────┐
│ 仅有 UI 截图        │──► screenshot-to-vue-ready-html ──┐
└─────────────────────┘                                   │
                                                          ▼
┌─────────────────────┐                         Vue-ready HTML
│ Axure + 内嵌图表源   │──► axure-html-restore ───────────┤  （任意中后台/分析页）
└─────────────────────┘                                   │
                                                          ▼
                                              vue-ready-html-to-vue3
                                              （通用迁移动作）
                                                          │
                                                          ▼
                                                   独立 Vue3 工程
```

三条 Skill 都不绑定单一业务产品；业务字段、高度表、组件名一律从**当前源**读取。
