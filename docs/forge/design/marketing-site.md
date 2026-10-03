---
title: Cyber AI Forge 开源推广站
scope: forge
status: active
owner: project maintainers
updated: 2026-10-03
---

# Cyber AI Forge 开源推广站

## 职责与范围

`forge/website` 是独立 Vue + Vite 静态应用，向公开访客展示工程基座、管理能力、设计预览、技术栈和启动方式，部署产物为 GitHub Pages。它不接入管理端 API、认证、生产数据或私有组件。

## 公共接口与依赖

保留 `#showcase`、`#features`、`#system`、`#start` 锚点与 GitHub 仓库链接。英文 `/` 与中文 `/zh/` 通过真实链接切换。Vue、Vite、TypeScript、Vue SSR 之外，仅新增 Foundation 公共 `@cyber-ai-forge/design-tokens` workspace 依赖，不增加动画或三维库。

## PRISM 视觉与交互

站点共用六主题双模式令牌，默认 jade / light；石墨与瓷白表面、细线、较小圆角和中性金属结构图对应管理端设计。Header 提供语言、主题色、深色模式与窄屏导航。外观保存到独立的 `forge-website-appearance` 浏览器键；无效或禁止存储时默认回退并保持内存交互。

展示区使用明确的场景按钮，支持聚焦展示框后左右键切换；不再用滚动旋转、固定超长滚动区或显现观察器。设计预览保存在 `src/assets/design-previews`，保留完整宽高比例并懒加载。页面明确标注 PRISM 设计预览与示例数据，不声称图片为运行截图。原截图保留作历史资产，不再被页面引用。

## 数据流与 SEO

`content.ts` → Vue SSR 构建 → 两个语言 HTML → 客户端 hydration。主要正文和链接在无 JavaScript 时可读，交互控件在挂载后增强。保留语言级 title、description、canonical、hreflang、Open Graph、Twitter Card、JSON-LD、robots、sitemap 和相对资源路径。页面文案仍解释 AI 开发脚手架和后台管理场景。

## 失败模式与同步

静态资源本地打包；字体提供系统回退。复制命令失败时不显示成功，终端原文可手动选择。减少动效时关闭平滑滚动。共享令牌更新也触发 Pages 工作流构建；本轮只提交实现，不直接发布。

Forge 专属站点与设计资产不下发；下游同步 Foundation 令牌和组件。站点的主题控制不读写后台偏好。

## 验证与人工验收

运行格式、Lint、类型、生产构建和归档门禁。检查 `/`、`/zh/` 的预渲染正文、SEO 元信息与相对资源引用。按仓库规定不创建或运行前端/浏览器测试。人工检查 375/768/1024/1440px、六主题双模式、场景选择、键盘焦点、移动导航、语言链接、复制与 GitHub 链接。

## 相关 ADR、计划和 AI 日志

- [ADR-0037：独立静态应用发布开源推广站](../decisions/ADR-0037-static-marketing-site.md)
- [原始实施计划](../archive/plans/2026-08-10-marketing-site.md)
- [视觉优化计划](../archive/plans/2026-08-10-marketing-site-visual-refinement.md)
- [核心卡片语言切换显现修复](../archive/plans/2026-08-10-feature-locale-reveal.md)
- [AI 协作记录](../archive/ai-logs/2026/08/2026-08-10-marketing-site-visual-refinement.md)
- [中英文静态入口与 SEO 增强计划](../archive/plans/2026-08-10-website-seo.md)
- [中英文静态入口与 SEO 增强 AI 协作记录](../archive/ai-logs/2026/08/2026-08-10-website-seo.md)
