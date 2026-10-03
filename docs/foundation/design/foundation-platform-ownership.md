---
scope: foundation
title: Forge、Foundation 与 Platform 所有权边界
status: accepted
owner: project maintainers
updated: 2026-10-03
---

# Forge、Foundation 与 Platform 所有权边界

## 目标

Cyber AI Forge 作为共享脚手架上游，只维护业务平台共同需要的基础能力；Sight 以及未来业务平台只在稳定的 Platform 扩展区内开发。仓库内容统一分为三个所有权作用域：

- `forge`：Cyber AI Forge 的推广站、品牌宣传和上游维护内容，不同步到业务平台。
- `foundation`：由 Forge 维护并同步到业务平台的认证、授权、管理基础、应用壳、运行时契约、数据库基线、工程规范和同步工具。
- `platform`：当前业务平台拥有的品牌、配置、业务模块、业务契约、业务数据模型、业务迁移和产品文档。

`foundation` 在本项目中表示“业务平台的共享基础设施”，不仅限于传统技术基础设施。认证、用户、角色、菜单等可直接复用的管理能力也属于 Foundation。

## 源码与依赖边界

前端、后端和 API 契约统一使用 `foundation` 与 `platform` 分类。Foundation 只能依赖自身公共能力和领域无关依赖；Platform 可以依赖已登记的 Foundation 公共接口。禁止 Foundation 导入 Platform。

```text
应用组合入口
    -> Foundation 公共入口
    -> Platform 公共入口

Platform -> Foundation
Foundation -X-> Platform
```

稳定组合入口由 Forge 维护，只负责装配两个作用域。业务平台日常开发不修改 Foundation 内部文件或根组合入口；无法通过 Platform 扩展点实现的需求，先在 Forge 增加通用扩展接口，再同步到业务平台。

## 数据库边界

Foundation 与 Platform 分别拥有 Schema 入口和迁移历史，运行时通过稳定聚合入口获得完整 Schema。Foundation 迁移先执行，Platform 迁移后执行；Platform 表可以通过显式外键引用 Foundation 公共表，Foundation 表不得引用 Platform 表。

Sight 当前没有业务表、业务迁移或需要保留的数据，因此本次迁移直接重建空库基线，不兼容旧数据库 journal。物理系统表继续使用 `sys_` 前缀；源码所有权和迁移通道使用 `foundation`，避免为目录重命名引入无业务价值的数据库对象重命名。

## 文档边界

`docs/foundation`、`docs/forge`、`docs/platform` 各自保存设计、ADR、计划、AI 日志与归档。AI 日志从 2026-09-03 起按 `chore`、`docs`、`feat`、`fix`、`refactor`、`style`、`test`、`ci`、`build`、`revert` 分类；Foundation 的现行规范、模板和完整演进证据随上游同步，Forge 专属历史不下发，Platform 历史由业务平台维护。

`docs/templates` 是由 Forge 维护并随 Foundation 同步的公共模板目录。模板通过 `scope: foundation | forge | platform` 指示生成文档的目标作用域，三个作用域共用同一套模板，不复制平行版本。

归档审计脚本和阈值属于 Foundation 共享协议；Foundation、Forge、Platform 分别拥有自己的审查 ledger 和活动计划。根 `.archive-audit.json` 属于仓库本地 Platform 保留配置：Forge 上游管理三个作用域，业务平台下游只管理 Platform，把 Foundation 作为 inherited 只读内容。下游发现 Foundation 文档问题时回 Forge 修复，不创建或更新 Foundation 归档任务。

## 同步所有权

同步策略采用显式路径分类：

- Foundation 路径接收 Forge 更新，业务平台保持只读。
- Platform 路径和根 README 始终保留业务平台同步前版本。
- 根 `.archive-audit.json` 按 Platform 路径保留，使下游角色不会被 Forge 上游配置覆盖。
- Forge 路径不进入业务平台。
- 根配置、锁文件、应用组合入口和 Foundation 数据库迁移属于集成控制文件，生成差异报告并执行专门验证。
- 未匹配路径默认停止同步，不做静默猜测。

同步工具必须在干净工作区运行，使用 `merge --no-ff --no-commit` 建立共同历史，恢复 Platform 所有文件、移除 Forge 专属文件、重建派生产物，并在验证通过后才允许完成合并提交。同步合并提交同样必须遵守提交分类，推荐使用 `chore(sync): merge Forge upstream`。

## 失败模式

- Foundation 导入 Platform：形成上游对具体产品的反向依赖，结构检查必须失败。
- Platform 修改 Foundation：后续同步会产生下游补丁和冲突，应把通用需求先提交到 Forge。
- 两条迁移链共同拥有同一数据库对象：生成或验证必须停止，由维护者确定唯一所有者。
- Foundation 重要升级信息只写在 Forge README：业务平台无法获得升级要求；必须进入 Foundation changelog 和升级指南。
- 活动 Foundation 计划被 Platform AI 误认为本地任务：同步版本只选择已完成的 Foundation 提交；文档 frontmatter 同时记录 scope、repository 和 owner。

## 验证策略

- 静态检查目录分类和单向依赖。
- 契约包构建并实际导入发布入口。
- 后端测试覆盖运行时契约、数据库聚合和迁移所有权。
- 前端执行 TypeScript 与生产构建，浏览器行为由维护者人工验收。
- 同步工具在临时 Git 仓库覆盖 README、Platform、Forge、未知路径、迁移和验证失败场景。

当前实现通过 `.forge-sync.yml` 显式分类路径，`pnpm architecture:check` 检查旧目录和反向依赖，`pnpm forge:sync -- --upstream-ref <ref>` 执行无提交合并、保留 Platform/README、排除 Forge、拒绝未知路径并运行验证。集成控制文件仍进入差异报告，需要下游维护者在验证后人工完成合并提交。

## PRISM 样式包

`packages/design-tokens/**` 是 Foundation 同步内容，包括 workspace manifest 和公开主题资源；它不依赖 Platform 或 Forge。前端与推广站分别声明 workspace 依赖，前端 package.json 和根锁文件作为 Integration 审阅。`brand.artwork` 为可选注入口，CYBER 图片和默认首页仍位于 Platform，推广设计图位于 Forge，均不覆盖下游品牌。
