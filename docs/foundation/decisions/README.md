# 现行架构决策索引

本目录只保留初始版本之后仍需要解释的长期决策。当前技术事实优先从[设计索引](../design/README.md)、共享契约、测试和代码读取；初始版本形成过程中的 ADR-0001 至 ADR-0023 已完整归档。

## 当前决策

- [ADR-0024](ADR-0024-human-authored-state-authority.md)：人类修改优先，初始版本实现与精简设计构成当前基线，发现冲突或问题时由人类决定下一步。
- [ADR-0025](ADR-0025-pluggable-authorization-and-data-scope.md)：默认使用本地可插拔授权 Provider，以稳定权限键和查询计划实现功能与数据权限。
- [ADR-0026](ADR-0026-system-table-prefix-and-fresh-baseline.md)：框架表统一使用 `sys_` 物理前缀，并以只面向全新数据库的单一迁移重置早期历史。
- [ADR-20260812-foundation-platform-ownership](ADR-20260812-foundation-platform-ownership.md)：使用 Forge、Foundation 与 Platform 统一表达源码、文档和同步所有权；取代 ADR-0027 的分类方案。
- [ADR-20260812-foundation-platform-migrations](ADR-20260812-foundation-platform-migrations.md)：Foundation 与 Platform 使用独立 Schema 入口、迁移历史和执行顺序。
- [ADR-20260813-layered-runtime-configuration](ADR-20260813-layered-runtime-configuration.md)：Foundation 与 Platform 分层维护环境变量，由 Integration 入口聚合并让进程环境拥有最高优先级。
- [ADR-0029](ADR-0029-frontend-runtime-localization.md)：使用独立前端模块提供运行时中英文切换，以模块资源和严格默认菜单指纹保护用户录入数据。
- [ADR-20260818-scope-owned-documentation-archive-audit](ADR-20260818-scope-owned-documentation-archive-audit.md)：共享归档协议与策略，使用显式仓库角色、所有权分域台账和作用域任务，使下游只处理 Platform；取代 ADR-0033。
- [ADR-20260903-ai-log-and-commit-classification](ADR-20260903-ai-log-and-commit-classification.md)：新 AI 日志与新 Git 提交使用同一受限分类，并通过本地与远端校验渐进接入下游。
- [ADR-20260811-frontend-brand-text-config](ADR-20260811-frontend-brand-text-config.md)：收敛前端品牌文字配置，使用 `VITE_APP_TAGLINE` 同时驱动登录签名和 Logo 产品描述，并按展示位置处理大小写。
- [ADR-0032](ADR-0032-nestjs-fastify-adapter.md)：后端迁移到 NestJS 11，继续使用 Fastify 5 adapter，并保留共享 Zod 契约为唯一 HTTP 数据源。
- [ADR-0034](ADR-0034-position-organization-ownership.md)：岗位作为按部门归属的组织主数据，由独立 `positions` 模块拥有用户岗位关系，不参与授权。
- [ADR-0035](ADR-0035-permission-controlled-root-entry.md)：首页回归权限控制的动态菜单，并以根入口解析器统一选择根页面、首个可访问页面或无权限页。
- [ADR-0036](ADR-0036-nest-provider-dependency-boundary.md)：以 Nest Provider 作为后端依赖边界，移除 `BackendRuntime`，并将认证、授权、repository、access 与 application service 纳入 `@Injectable()` 生命周期。
- [ADR-0038](ADR-0038-bounded-authorization-delegation.md)：授权主体配置和用户角色、部门变更采用有界委托，当前与目标授权都不得超过操作者自身权限和数据范围。
- [ADR-0039](ADR-0039-single-uuidv7-identifiers.md)：全部应用实体使用数据库生成的 UUIDv7，并以 PostgreSQL 18 空库重建单一迁移基线。
- [ADR-20260811](ADR-20260811-adr-filename-convention.md)：新增 ADR 使用日期与主题命名，既有 ADR 文件名和引用保持不变。

新增 ADR 时使用 [ADR 模板](../../templates/adr-template.md)和 `ADR-YYYYMMDD-<topic>.md` 文件名。日期取创建/接受日期，topic 使用小写 kebab-case；同日通过唯一 topic 区分。既有 `ADR-NNNN-<topic>.md` 文件和引用保持不变。ADR 被取代或被后续基线吸收后更新替代关系并移入 `docs/foundation/archive/decisions/`。

- [共享 PRISM 令牌与品牌隔离](ADR-20261003-prism-design-tokens.md)。
