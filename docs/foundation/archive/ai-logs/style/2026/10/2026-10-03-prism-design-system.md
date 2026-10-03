---
title: PRISM 设计落地
scope: foundation
repository: Cyber-AI-Forge
owner: project maintainers
date: 2026-10-03
status: completed
change_type: style
downstreamAction: sync-foundation-with-integration-review
---

# PRISM 设计落地

用户先要求只设计，随后补充六主题与浅深模式并审核通过；本轮明确授权调整整个项目，同时考虑下游与宣传站。此前设计阶段未修改代码。

暂存区和工作区初始为空。采用共享无运行时依赖的主题包、Foundation 公共组件和可选 Platform 品牌图；保留各平台所有权。RTK 未安装，使用标准命令。pnpm 环境首次运行自动安装依赖并写入待确认的 scarf 构建配置，已恢复这项工具产生的配置；后续关闭运行前自动依赖检查，不执行该遥测构建脚本。

## 实际交付

共享主题包和同步归属；浅深双模式与六主题；应用壳、登录、管理表格、侧面编辑、用户移动卡片、角色详情、部门组织树、个人资料、错误页；CYBER 默认工作台/关于页及品牌图注入；独立双语宣传站、主题控制、场景选择和设计预览。中英文 README 与长期设计文档同步。

用户/角色基础记录保存后若策略失败，保留已保存主体 ID 重试，避免重复创建。未修改后端契约或授权含义。宣传站行内多语句事件被 Prettier 移除分号后构建失败，改为具名函数后重新构建通过。

用户最后明确“本次完成 Forge，供下游同步”。下游品牌、业务页面和宣传资产不由本轮覆盖。

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

## 关联提交

实现提交：`feat(ui): implement PRISM across Forge surfaces`。实际提交哈希在归档闭环中登记。
