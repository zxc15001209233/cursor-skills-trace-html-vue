# 追溯 / 中后台：截图 → HTML → Vue3 流水线

```
┌─────────────────────┐
│ 仅有 UI 截图        │──► screenshot-to-vue-ready-html ──┐
└─────────────────────┘                                   │
                                                          ▼
┌─────────────────────┐                            Vue-ready HTML
│ Axure + echarts-axure│──► axure-html-restore ──────────┤  (rebuild/)
└─────────────────────┘                                   │
                                                          ▼
                                              vue-ready-html-to-vue3
                                                          │
                                                          ▼
                                                   Vue3 独立工程
                                              (Vite/EP/ECharts)
```

## 怎么选入口

| 你有什么 | 从哪一步开始 |
|----------|--------------|
| 只有截图 | Skill 1 |
| Axure 工程 + echarts-axure | Skill 2（跳过 1） |
| 已有 rebuild Vue-ready HTML | Skill 3 |
| 先有图壳、再对齐 Axure 真图 | 1 → 2 → 3 |

## Skill 路径

- `~/.cursor/skills/screenshot-to-vue-ready-html/SKILL.md`
- `~/.cursor/skills/axure-html-restore/SKILL.md`
- `~/.cursor/skills/vue-ready-html-to-vue3/SKILL.md`
