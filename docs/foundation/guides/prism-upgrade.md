---
title: PRISM 下游升级指南
scope: foundation
repository: Cyber-AI-Forge
owner: project maintainers
status: active
updated: 2026-10-03
---

# PRISM 下游升级

通过现有 `pnpm forge:sync -- --upstream-ref <已完成提交>` 合并 Foundation 更新，再完成同步验证和 `chore(sync)` 合并提交。同步前工作区必须干净。

## 自动同步

共享主题包、Foundation 样式、应用壳、认证与管理模块，以及本指南。保留六主题设置和旧值迁移，不清空浏览器偏好。

## Platform 接入

工具保留下游 `src/platform`、品牌、首页、业务模块及根 README，也排除 `forge` 宣传资产。新可选字段 `PlatformDefinition.brand.artwork` 不要求下游立刻修改；缺省展示通用结构。需要自有品牌摄影时，在 Platform 本地导入资源并传入该字段。

自有首页应使用共享语义色 `--canvas`、`--surface`、`--ink`、`--muted`、`--line`、`--primary`、`--primary-foreground`，避免硬编码旧绿色或导入 CYBER 的 Platform 组件。品牌组件应尊重 `tone` 与当前语义色。

## 验收

执行安装、类型 / 生产构建、所有权和同步门禁；人工检查六主题双模式、登录、侧边 / 顶部导航、抽屉、CRUD、用户 / 角色的数据权限以及下游自有页面。不要把设计稿示例账号或日志复制到业务数据中。

## Integration 必须审阅

确认 `apps/frontend/package.json` 含 `@cyber-ai-forge/design-tokens: workspace:*`，并合并根 `pnpm-lock.yaml` 对应 workspace 链接。同步工具会报告 Integration 项，不等于自动保证业务平台无需处理冲突。执行 `pnpm install --frozen-lockfile`；有锁文件合并冲突时先按平台依赖解决再安装。

无需数据库迁移或 API 客户端重新生成。Foundation 的编辑组件公共事件与 v-model 不变；角色详情新增只读授权查询。推广站在 Forge 独立构建，原有下游宣传站可直接消费同一公共 CSS，但不会自动被覆盖。
