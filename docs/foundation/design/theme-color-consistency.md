---
scope: foundation
title: 前端主题色一致性
status: active
owner: maintainers
updated: 2026-10-03
---

# 前端主题色一致性

## 目标与范围

前端所有可见的品牌色、表面色、文字色、边框色、装饰色和状态色，都必须通过主题语义令牌或明确的状态令牌表达。用户在设置中切换六套主题色或深色模式后，应用壳、登录页、首页、关于页、错误页、导航、标签页、设置弹窗和 Element Plus 组件应保持同一套视觉语义。

本设计覆盖 `apps/frontend` 与 `forge/website` 对 Foundation 公共主题令牌的消费，不改变路由、业务数据、API 契约或主题选项的数量与命名。

## 现行约束

- `@cyber-ai-forge/design-tokens` 是共享主题标识与色值来源；`settings.theme.ts` 重导出元数据并保留旧值迁移。
- `ThemeController.vue` 将主题应用到 `html[data-theme]`、`html.dark` 和 `color-scheme`。
- 主题变量必须区分页面背景、表面、文字、边框、品牌、光晕和状态语义；成功、警告、错误和加载状态不随主题色切换。
- 页面样式使用 `--canvas/surface/ink/muted/line/primary` 兼容别名或 `--prism-*` 公开语义变量；组件级状态只有在确实表达状态时才使用固定状态令牌。
- 主题专属视觉不应通过页面内重复的十六进制颜色实现，避免切换主题时残留旧主题颜色。

## 验证边界

AI 执行格式检查、格式化、TypeScript 检查和生产构建；不创建或运行前端自动化测试。维护者需要人工切换六套主题色、深色模式和窄屏布局，检查主要页面、弹窗、导航和状态提示的对比度与一致性。

## 变更记录

- 2026-08-07：补充主题色一致性审计范围、语义令牌约束和人工验收边界；最终实现与验证结果在任务完成时回填。
- 2026-08-07：将应用壳、品牌组件、登录装饰、首页/个人资料/404、关于项目、权限策略编辑器和 Element Plus 确认框的固定颜色改为主题语义令牌；状态色继续使用独立固定语义。

## 实际验证

- `pnpm format`：通过。
- `pnpm format:check`：通过。
- `npx vue-tsc --noEmit`：通过。
- `pnpm lint`：通过。
- `pnpm --filter @cyber-ai-forge/frontend build`：通过；仅有既存 Sass legacy API、依赖注释和布局动态/静态导入提示。
- 人工验收仍需由维护者完成，重点检查六套主题、深色模式、登录页、应用壳、首页、关于页、404、设置弹窗、Element Plus 组件和窄屏布局。

PRISM 允许登录、工作台与关于页的中性金属品牌图片保持固定石墨底色，以保留素材本身；表单、导航、文字和交互表面仍响应主题与浅深模式。主题色不为图片染色。颜色与组件规则见 [PRISM 设计](prism-design-system.md)。
