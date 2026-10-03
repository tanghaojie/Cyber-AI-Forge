---
title: PRISM 全项目界面实施
scope: foundation
repository: Cyber-AI-Forge
owner: project maintainers
status: completed
created: 2026-10-03
updated: 2026-10-03
---

# PRISM 全项目界面实施

用户已批准 23 张设计画板与 12 套主题对照；本任务主作用域 foundation，涉及 forge 和 platform。

- [x] 完成三个作用域的到期归档审查。
- [x] 共享主题包及同步分类。
- [x] 应用壳、认证、组件与管理页。
- [x] Platform 品牌、首页、关于页与 Forge 宣传站。
- [x] 格式、Lint、类型、构建、同步和归档门禁。
- [x] 更新文档、归档计划和日志并提交。

## 验证与回滚

沿用 API 和设置存储，不执行数据库迁移。完成后可按提交回退视觉变更。前端浏览器人工验收，不创建或运行前端自动化测试。

## 相关文档

[设计](../../design/prism-design-system.md)

## 验证结果

- `pnpm install --frozen-lockfile --ignore-scripts --config.strict-dep-builds=false`：通过，锁文件仅增加主题包及两处引用。
- `pnpm build`：通过，含前端 Vue 类型、后端/契约、令牌包及宣传站双语 SSR 构建。现有 Sass legacy API、依赖 PURE 注释和布局混合导入提示保留，不影响产物。
- `pnpm lint`、`pnpm architecture:check`：通过。
- `pnpm test`：10 项同步/文档治理/提交规范测试，143 项后端测试通过；契约 dist 验证通过。没有运行前端或浏览器测试。
- `pnpm format`：已执行；`pnpm format:check` 和 `pnpm docs:archive:check:ci` 通过；提交后重新检查。

命令通过 `npm_config_verify_deps_before_run=false` 避免环境包装器运行前重复安装。未执行数据库迁移、发布或修改下游仓库。

## 人工验收边界

按 AGENTS.md，类型和构建不代替浏览器验收。需检查六主题 × 两模式、375/768/1024/1440px、登录/退出/重定向、导航两种布局、Tags View、即时设置持久化、各模块 CRUD、用户/角色分步保存失败后的重试、角色详情切换、部门检索、个人资料/密码、日志 HTTP 与业务状态、网站双语/主题/场景/复制。

宣传站与 README 的图片明确标注设计预览，不是运行截图。设计图包含示例数据，实际应用始终消费现有 API。

## 交付范围

本次只完成 Forge；下游通过 Foundation 更新与升级指南同步。未修改其他仓库。相关实现提交使用 `feat(ui): implement PRISM across Forge surfaces`，实际实现哈希为 `5c5e8295caf6377dbbebfe5d99e816777638741f`。
