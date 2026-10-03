---
scope: forge
title: CYBER 品牌与视觉系统
status: active
owner: project maintainers
updated: 2026-10-03
---

# CYBER / Cyber AI Forge 品牌与视觉系统

## 背景与目标

项目原先直接使用维护者个人品牌 `JTLab / 桀士实验室` 作为脚手架名称，导致产品身份与创作者身份混合。当前项目品牌使用 `CYBER` 短品牌，正式名称为 `Cyber AI Forge`，用 PRISM 中性金属与编辑式排版表达 AI 原生、企业应用、模块化、运行时契约和可演进系统底座。

## 范围与非目标

本设计覆盖默认产品命名、Logo、色彩、登录页、应用壳、浏览器元信息、Swagger、README 和品牌相关技术标识。它不改变模块边界、HTTP 契约、数据库表、业务行为或前端人工验收边界，也不把个人品牌扩展成框架内的功能模块。

## 品牌层级

- 产品短名称：`CYBER`。
- 正式名称：`Cyber AI Forge`。
- 英文副标题：`AI-Native Enterprise Application Scaffold`。
- 中文副标题：`AI 驱动的企业应用智能构建平台`。
- 默认产品标签：`AI-NATIVE ENTERPRISE APPLICATION SCAFFOLD`。
- 英文主张：`Build clearly. Evolve safely.`。
- 中文主张：`让复杂系统清晰生长。`。
- 创作者品牌：`JTLab / 桀士实验室`，只以明确标注 `CREATED BY` 的独立署名出现在登录页、README 作者信息等合适位置，不进入 CYBER Logo、侧栏、404 或工作台产品标识。

部署可以通过 `VITE_APP_NAME`、`VITE_APP_FULL_NAME`、`VITE_APP_TAGLINE`、`VITE_APP_GITHUB_URL`、`VITE_APP_CREATOR_NAME` 和 `VITE_APP_CREATOR_FULL_NAME` 覆盖 Platform 品牌文字、项目链接与创作者署名；缺失或空白时回退仓库默认值。`VITE_APP_TAGLINE` 在登录页签名中保持原文，在 Logo 下方的产品描述中转换为大写；没有路由专属标题时，浏览器标题使用 `VITE_APP_FULL_NAME`。替换图形标志时需要同步替换品牌组件和 favicon，避免非 CYBER 名称继续使用 C 形产品标。

## Logo 与视觉语言

默认 Logo 使用连续双层角形 `C`、右侧精密开口、主题色结构端点和同色数据节点。图形表达模块边界、受控数据流和智能核心，不使用盾牌、锁、机器人、大脑、黑客、加密货币或电竞视觉。

- 背景：石墨深色与瓷白浅色，导航随模式同步。
- 主标：暖白色。
- 默认主强调色为翡翠绿；运行时可切换御政丹红、曜石银灰、深空智蓝、灵感紫与琥珀橙。
- Logo 的交互强调随六主题变化；中性金属图片保留石墨背景，不使用彩色光晕。
- 管理页面使用细线、小圆角和低干扰层级；登录、工作台与关于页共用中性结构图片，404 使用纯色排版。

Logo 以仓库内 SVG/Vue 组件实现，保证侧栏、移动端、404 和 favicon 能按尺寸清晰渲染。创作者署名使用独立排版，不作为 Logo 的一部分。

## 技术标识与兼容性

默认根包名、浏览器存储键和 JWT 元数据同步采用 CYBER 命名：

- 根包名：`cyber-ai-forge`。
- workspace 包作用域：`@cyber-ai-forge/*`。
- 访问令牌键：`cyber_ai_forge_access_token`。
- 标签历史键：`cyber_ai_forge_tag_view_history:v1:<userId>`。
- 语言偏好键：`cyber_ai_forge_locale:v1`。
- JWT issuer：`cyber-ai-forge`。
- JWT audience：`cyber-ai-forge-api`。

后端可通过 `API_TITLE`、`API_VERSION`、`API_DESCRIPTION` 覆盖 Swagger 展示信息，并通过 `JWT_ISSUER`、`JWT_AUDIENCE` 覆盖 JWT identity；缺失或空白时使用上述品牌默认值。JWT identity 仍由启动期环境校验和应用组装层单点注入，不维护第二份 Platform 常量文件。

旧 `cyber_access_token` 和 `jtlib_access_token` 会在认证状态清理时一并删除。JWT issuer/audience 切换会使旧令牌失效，用户需要重新登录；数据库账号、菜单、授权和业务数据不迁移也不删除。旧标签历史和语言偏好不迁移，切换后从新的版本化键开始记录。

## 失败模式与安全考虑

- 环境变量只替换文字但未替换 Logo：部署方可能出现名称和 C 形产品标不一致；README 明确要求白标部署同步替换视觉资产。
- 旧认证 cookie 残留：读取不到新键时按未登录处理，清会话时同时清理旧键。
- Logo 在小尺寸失真：组件保留强轮廓、有限色彩和独立 favicon，并通过生产构建与维护者人工检查验证。
- 品牌重命名不得弱化 JWT 的 issuer/audience 校验，也不得为兼容旧品牌而接受多个签发方。

## 测试与验证策略

- 执行根目录格式化、格式检查、ESLint、TypeScript/生产构建和后端测试。
- 搜索当前代码与现行文档，确认旧产品品牌和旧技术标识只保留在明确的兼容性说明中。
- 维护者人工验收桌面与窄屏登录页、侧栏、404、工作台、favicon、浏览器标题和 Swagger 品牌展示；前端不创建或运行自动化测试。

2026-08-07 已完成 `pnpm format`、`pnpm format:check`、`pnpm lint`、`pnpm build` 和 `pnpm test`；格式、Lint、共享契约/后端/前端构建以及 121 项后端测试均通过。浏览器界面和语言切换仍需维护者人工验收。

## 相关 ADR、计划和 AI 日志

- [ADR-0028：分离 CYBER 产品品牌与 JTLab 创作者品牌](../decisions/ADR-0028-product-and-creator-brand-separation.md)
- [ADR-0031：Cyber AI Forge 品牌与项目级技术标识](../decisions/ADR-0031-cyber-ai-forge-brand.md)
- [实施计划](../archive/plans/2026-08-07-cyber-ai-forge-renaming.md)
- [workspace 包作用域迁移计划](../archive/plans/2026-08-10-cyber-ai-forge-package-scope.md)
- [AI 协作记录](../archive/ai-logs/2026/08/2026-08-07-cyber-ai-forge-renaming.md)

PRISM 是视觉方案名，不替换 CYBER 产品身份。默认图片位于 Platform `assets/prism-structure.png`，经可选 `PlatformDefinition.brand.artwork` 注入；宣传站持有自身 Forge 图片副本。详见 [PRISM 设计系统](../../foundation/design/prism-design-system.md)。
