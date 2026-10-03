# 历史文档归档

## 机器可读的归档治理文件

- [归档触发策略](archive-policy.json)：阈值、范围和立即触发条件。
- [Foundation 归档审查台账](archive-ledger.json)：Foundation 最近一次完成审查的 Git 基线；下游只读。

共享策略由当前归档审查协议读取；Foundation、Forge、Platform 的台账分别位于各自归档目录。它们记录归档机制的状态，不替代当前 Design、ADR 或代码事实。

- 2026-08-06：[仓库原生文档重建与归档审查计划](plans/2026-08-06-repository-native-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-06-repository-native-archive-review.md)。
- 2026-08-06：[仓库原生文档归档审查后续](plans/2026-08-06-repository-native-archive-review-follow-up.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-06-repository-native-archive-review-follow-up.md)。
- 2026-08-06：[认证与工作台视觉刷新后的仓库原生归档审查](plans/2026-08-06-repository-native-archive-review-auth-home.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-06-repository-native-archive-review-auth-home.md)。

本目录保存初始版本形成过程、已完成任务和被合并设计的证据，不定义当前行为，也不属于 AI 默认阅读集。当前事实从[文档入口](../README.md)和[设计索引](../design/README.md)读取；发现冲突时以人类维护者的当前内容为准。

## 2026-07-29 初始版本切点

维护者提交 `f10f584` 及其父提交构成初始版本逻辑基线。ADR-0001 至 ADR-0023 已从当前区移入 `decisions/`，保留从脚手架探索到基线形成的取舍，但不再作为日常任务规范。当前协作原则见 [ADR-0024](../decisions/ADR-0024-human-authored-state-authority.md)。

## 设计快照

| 历史主题                 | 归档文件                                                                                              | 当前来源                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 管理系统能力汇总         | [management-system.md](design/management-system.md)                                                   | [系统概览](../design/system-overview.md)与[模块设计](../design/README.md)                                                      |
| 动态导航与品牌           | [dynamic-navigation-and-branding.md](design/dynamic-navigation-and-branding.md)                       | [前端应用与应用壳](../design/modules/frontend.md)、[菜单](../design/modules/menus.md)与[导航](../design/modules/navigation.md) |
| 系统和模块边界压缩前快照 | [system-overview.md](design/system-overview.md)、[module-boundaries.md](design/module-boundaries.md)  | [系统概览](../design/system-overview.md)与[模块边界](../design/module-boundaries.md)                                           |
| 前端应用壳阶段快照       | [早期快照](design/frontend-shell.md)、[初始版本前快照](design/frontend-shell-pre-initial-baseline.md) | [前端应用与应用壳](../design/modules/frontend.md)                                                                              |

## ADR 主题路由

归档 ADR 均位于 `decisions/`。只在排查回归、理解取舍或准备恢复旧方案时按主题选择一至两份：

| 主题                                       | ADR 范围                                 | 当前来源                                                                                                                                    |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| API 响应、HTTP 状态、运行时契约与 Zod      | ADR-0001 至 ADR-0007                     | [API 契约](../design/modules/api-contract.md)、[后端](../design/modules/backend.md)与[错误码](../reference/error-codes.md)                  |
| 前端技术栈、动态导航、模块入口、布局与图标 | ADR-0008 至 ADR-0013、ADR-0017、ADR-0018 | [前端应用与应用壳](../design/modules/frontend.md)与[模块边界](../design/module-boundaries.md)                                               |
| 软删除、审计和有效记录唯一性               | ADR-0014、ADR-0015                       | [后端](../design/modules/backend.md)及用户、角色、菜单、字典模块设计                                                                        |
| 分层文档和工程工作流                       | ADR-0016、ADR-0021 至 ADR-0023           | [文档治理](../design/documentation-governance.md)、[开发工作流](../design/developer-workflow.md)与[验证策略](../design/testing-strategy.md) |
| JWT 会话和 LRU 读缓存                      | ADR-0019、ADR-0020                       | [认证模块](../design/modules/auth.md)                                                                                                       |
| 文档归档触发协议                           | ADR-0030、ADR-0033                       | [共享协议与所有权分域的文档归档审计](../decisions/ADR-20260818-scope-owned-documentation-archive-audit.md)                                  |

## 完成计划与 AI 协作记录

- 2026-09-03：[AI 日志与 Git 提交分类实施](plans/2026-09-03-ai-log-and-commit-classification.md)及其
  [AI 协作记录](ai-logs/chore/2026/09/2026-09-03-ai-log-and-commit-classification.md)。
- 2026-09-03：[AI 日志与 Git 提交分类后的 Foundation 归档审查](plans/2026-09-03-ai-log-and-commit-classification-archive-review.md)及其
  [AI 协作记录](ai-logs/chore/2026/09/2026-09-03-ai-log-and-commit-classification-archive-review.md)。

- 2026-08-18：[分域文档归档审计重构](plans/2026-08-18-scope-owned-documentation-archive-audit.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-18-scope-owned-documentation-archive-audit.md)。

- 2026-08-13：[集中前后端环境文件目录](plans/2026-08-13-env-directory.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-13-env-directory.md)。

- 2026-08-12：[Forge Foundation/Platform 结构迁移](plans/2026-08-12-foundation-platform-restructure.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-12-foundation-platform-restructure.md)。
- 2026-08-13：[Foundation 与 Platform 分层运行时配置](plans/2026-08-13-layered-runtime-configuration.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-13-layered-runtime-configuration.md)。

- 2026-08-11：[动态根路由解析修复](plans/2026-08-11-dynamic-root-route.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-11-dynamic-root-route.md)。
- 2026-08-11：[前端品牌文字配置收敛](plans/2026-08-11-frontend-brand-text-config.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-11-frontend-brand-text-config.md)。
- 2026-08-11：[前端品牌文字配置归档审查](plans/2026-08-11-frontend-brand-text-config-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-11-frontend-brand-text-config-archive-review.md)。
- 2026-08-11：[ADR 日期命名归档审查](plans/2026-08-11-adr-filename-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-11-adr-filename-archive-review.md)。
- 2026-08-11：[ADR 日期命名规则](plans/2026-08-11-adr-filename-convention.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-11-adr-filename-convention.md)。

- 2026-08-10：[官网中英文静态入口与 SEO 增强](plans/2026-08-10-website-seo.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-website-seo.md)。

- 2026-08-10：[UUIDv7 架构变更文档归档审查](plans/2026-08-10-uuidv7-documentation-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-uuidv7-documentation-archive-review.md)。
- 2026-08-10：[UUIDv7 单一标识符与空库基线实施计划](plans/2026-08-10-uuidv7-identifier-baseline.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-uuidv7-identifier-baseline.md)。
- 2026-08-10：[授权安全修复文档归档审查](plans/2026-08-10-documentation-archive-review-authorization.md)。
- 2026-08-10：[授权委托边界完整修复](plans/2026-08-10-authorization-delegation-boundary.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-authorization-delegation-boundary.md)。
- 2026-08-10：[Cyber AI Forge workspace 包作用域迁移](plans/2026-08-10-cyber-ai-forge-package-scope.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-cyber-ai-forge-package-scope.md)。

- 2026-08-10：[推广站优化后续文档归档审查](plans/2026-08-10-marketing-site-follow-up-archive-review.md)。

- 2026-08-10：[核心卡片语言切换显现修复](plans/2026-08-10-feature-locale-reveal.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-feature-locale-reveal.md)。

- 2026-08-10：[推广站截图与界面细节优化](plans/2026-08-10-marketing-site-visual-refinement.md)、
  [推广站架构变更文档归档审查](plans/2026-08-10-documentation-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-marketing-site-visual-refinement.md)。

- 2026-08-10：[Cyber AI Forge 开源推广站](plans/2026-08-10-marketing-site.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-10-marketing-site.md)。

- 2026-08-08：[BackendRuntime 到 Nest Injectable Provider 重构](plans/2026-08-08-injectable-backend-runtime.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-08-injectable-backend-runtime.md)。

- 2026-08-08：[动态首页与根入口解析](plans/2026-08-08-dynamic-home-root-entry.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-08-dynamic-home-root-entry.md)。
- 2026-08-07：[职位迁移 journal 登记修复与文档归档审查](plans/2026-08-07-position-migration-journal-registration.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-position-migration-journal-registration.md)。
- 2026-08-07：[NestJS 与 Fastify adapter 后端迁移](plans/2026-08-07-nestjs-fastify-migration.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-nestjs-fastify-migration.md)。
- 2026-08-07：[架构变更后的文档归档审查计划](plans/2026-08-07-documentation-archive-review.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-documentation-archive-review.md)。
- 2026-08-07：[按任务范围触发文档归档审查计划](plans/2026-08-07-archive-check-trigger-policy.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-archive-check-trigger-policy.md)。
- 2026-08-07：[前端主题色一致性修复计划](plans/2026-08-07-theme-color-consistency.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-07-theme-color-consistency.md)。

- 2026-08-07：[关于项目页与品牌入口计划](plans/2026-08-07-about-project.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-07-about-project.md)。
- 2026-08-07：[登录页主题外观入口计划](plans/2026-08-07-login-appearance-entry.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-07-login-appearance-entry.md)。
- 2026-08-07：[Cyber AI Forge 品牌与项目标识改名](plans/2026-08-07-cyber-ai-forge-renaming.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-07-cyber-ai-forge-renaming.md)。
- 2026-08-07：[Cyber AI Forge 改名后的文档归档审查](plans/2026-08-07-cyber-ai-forge-archive-review.md)。
- 2026-08-07：[岗位管理模块设计计划](plans/2026-08-07-job-positions-design.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-job-positions-design.md)。
- 2026-08-07：[移除岗位编码设计字段](plans/2026-08-07-position-remove-code-design.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-position-remove-code-design.md)。
- 2026-08-07：[岗位管理功能实施计划](plans/2026-08-07-job-positions-implementation.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-07-job-positions-implementation.md)。
- 2026-08-07：[Health 模块失败状态修复计划](plans/2026-08-07-health-status-failure.md)及其
  [归档审查计划](plans/2026-08-07-health-status-failure-archive-review.md)与
  [AI 协作记录](ai-logs/2026/08/2026-08-07-health-status-failure.md)。
- 2026-08-06：[登录页与工作台首屏信息重设计计划](plans/2026-08-06-auth-home-visual-refresh.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-06-auth-home-visual-refresh.md)。
- 2026-08-05：[个人资料页首页导航高亮修复计划](plans/2026-08-05-profile-navigation-highlight.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-05-profile-navigation-highlight.md)。
- 2026-08-05：[后端关键流程中文注释补充计划](plans/2026-08-05-backend-commentary.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-05-backend-commentary.md)。
- 2026-08-05：[登录页三维展示与交互拆分计划](plans/2026-08-05-login-3d-presentation.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-05-login-3d-presentation.md)。
- 2026-08-05：[个人资料编辑计划](plans/2026-08-05-personal-profile.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-personal-profile.md)。
- 2026-08-05：[数据库 Schema 源码拆分计划](plans/2026-08-05-database-schema-source-split.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-database-schema-source-split.md)。
- 2026-08-05：[菜单图标前端必填校验计划](plans/2026-08-05-menu-icon-validation.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-menu-icon-validation.md)。
- 2026-08-05：[接口日志前端与运维导航计划](plans/2026-08-05-api-logs-frontend.md)及其
  [AI 协作记录](ai-logs/2026/08/2026-08-05-api-logs-frontend.md)。
- 2026-08-05：[接口日志持久化与查询计划](plans/2026-08-05-api-logs.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-api-logs.md)。
- 2026-08-05：[统一 Element Plus 弹窗顶部间距计划](plans/2026-08-05-dialog-top-margin.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-dialog-top-margin.md)。
- 2026-08-05：[系统设置剩余项接入计划](plans/2026-08-05-settings-shell-preferences.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-settings-shell-preferences.md)。
- 2026-08-05：[主题视觉回归修复计划](plans/2026-08-05-theme-visual-regression.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-05-theme-visual-regression.md)。
- 2026-08-04：[主题颜色与深色模式实施计划](plans/2026-08-04-theme-and-dark-mode.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-04-theme-and-dark-mode.md)。
- 2026-08-04：[导航抽屉行为修正计划](plans/2026-08-04-navigation-drawer-correction.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-04-navigation-drawer-correction.md)。
- 2026-08-04：[导航菜单风格设置实施计划](plans/2026-08-04-navigation-style-settings.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-04-navigation-style-settings.md)。
- 2026-08-04：[顶部级联导航实施计划](plans/2026-08-04-top-navigation.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-04-top-navigation.md)。
- 2026-08-04：[系统设置立即生效计划](plans/2026-08-04-settings-immediate-apply.md)及其 [AI 协作记录](ai-logs/2026/08/2026-08-04-settings-immediate-apply.md)。
- 2026-07-31：[移除部门编码实施计划](plans/2026-07-31-remove-department-code.md)及其[AI 协作记录](ai-logs/2026/07/2026-07-31-remove-department-code.md)。
- 2026-07-31：[移除角色编码实施计划](plans/2026-07-31-remove-role-code.md)及其[AI 协作记录](ai-logs/2026/07/2026-07-31-remove-role-code.md)。
- `plans/`：按 `YYYY-MM-DD-<topic>.md` 保存完成、取消或被取代的实施计划。
- `ai-logs/YYYY/MM/`：保存对应任务的结构化协作记录。
- 2026-07-31：[前端系统设置入口实施计划](plans/2026-07-31-system-settings.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-system-settings.md)。
- 2026-07-31：[前端浏览器存储访问能力提取计划](plans/2026-07-31-shared-browser-storage.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-shared-browser-storage.md)。
- 2026-07-31：[共享多语言资源提取计划](plans/2026-07-31-shared-localization-resources.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-shared-localization-resources.md)。
- 2026-07-31：[本地化日期无效值修复计划](plans/2026-07-31-safe-localized-date-formatting.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-safe-localized-date-formatting.md)。
- 2026-07-31：[前端运行时中英文切换实施计划](plans/2026-07-31-runtime-localization.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-runtime-localization.md)。
- 2026-07-31：[SVG 图标库扩充实施计划](plans/2026-07-31-expand-svg-icon-library.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-expand-svg-icon-library.md)。
- 2026-07-31：[CYBER 框架重品牌实施计划](plans/2026-07-31-cyber-branding.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-31-cyber-branding.md)。
- 2026-07-30：[可插拔授权与部门实施计划](plans/2026-07-30-pluggable-authorization.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-pluggable-authorization.md)。
- 2026-07-30：[中文代码注释实施计划](plans/2026-07-30-chinese-code-comments.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-chinese-code-comments.md)。
- 2026-07-30：[部门树形展示实施计划](plans/2026-07-30-department-tree-view.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-department-tree-view.md)。
- 2026-07-30：[系统表前缀与迁移基线重构实施计划](plans/2026-07-30-system-table-prefix-and-migration-baseline.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-system-table-prefix-and-migration-baseline.md)。
- 2026-07-30：[默认菜单迁移基线修正计划](plans/2026-07-30-default-menu-baseline.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-default-menu-baseline.md)。
- 2026-07-30：[前后端系统与业务模块分层及 Header 紧凑化计划](plans/2026-07-30-system-biz-module-layout.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-system-biz-module-layout.md)。
- 2026-07-30：[管理端 tag view 实施计划](plans/2026-07-30-frontend-tag-view.md)及其 [AI 协作记录](ai-logs/2026/07/2026-07-30-frontend-tag-view.md)。
- 2026-06 的文件描述脚手架起点；2026-07-22 至 2026-07-23 主要记录管理基础、契约和测试；2026-07-27 至 2026-07-29 主要记录模块边界、动态导航、认证和工程治理；2026-07-30 起继续记录基线后的功能修正与模型精简。

计划和日志只用于复盘实施过程，不用于定义当前行为。需要定位时先按日期或主题文件名搜索，最多打开与问题最相关的一至两份。

## 2026-10-03 PRISM 全项目界面

- [实施计划](plans/2026-10-03-prism-design-system.md)、[分域审查](plans/2026-10-03-prism-archive-review.md)、[协作记录](ai-logs/style/2026/10/2026-10-03-prism-design-system.md)。
- 当前规范：[PRISM 设计](../design/prism-design-system.md)、[主题令牌模块](../design/modules/design-tokens.md)、[下游升级指南](../guides/prism-upgrade.md)。
