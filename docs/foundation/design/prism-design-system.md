---
title: PRISM 多主题设计系统
scope: foundation
repository: Cyber-AI-Forge
owner: project maintainers
status: active
updated: 2026-10-03
---

# PRISM 多主题设计系统

## 目标与范围

落实用户已审核的 PRISM 设计，覆盖 Foundation 应用壳、登录、管理页、组件与六主题双模式；相关 Forge 推广站和默认 Platform 品牌一起更新。保留业务契约、认证和授权语义。默认仍为 jade + 浅色。

## 职责与公共接口

`packages/design-tokens` 是 Foundation 维护的无运行时依赖样式包，公开主题元数据和 CSS 令牌。管理端与独立推广站消费相同公开资源；Foundation 不依赖 Platform 或 Forge。主题标识保持 jade/civic/monochrome/azure/violet/amber。

`PlatformDefinition.brand.artwork` 是可选品牌图 URL；Foundation 只通过注入读取，未配置时显示通用结构纹理。下游保留自己的品牌、首页和业务模块，不把 CYBER 品牌素材写入 Foundation。

## 视觉与数据流

中性石墨 / 瓷白表面承载业务，主题只强调操作、选中与焦点，成功 / 警告 / 错误具有独立语义。设置 Store 驱动 html 的 data-theme 与 dark class；所有色彩包括 Element Plus 浮层由公共令牌派生。浅色导航同步变浅，登录和应用使用同一持久化偏好。

表格、表单、抽屉和空态统一间距与排版。用户使用侧面板编辑；角色功能授权与数据范围分别组织；HTTP 状态不替代业务结果。所有业务数据来自已有 API，不使用设计稿的虚构记录。

## 失败模式与验证

主题值沿用现有白名单和旧值迁移；无品牌图时有本地降级，不依赖外部服务。写入失败保留表单与错误说明，数据权限仍经现有契约提交。所有新增文字提供中英文。格式、类型、构建、所有权和同步测试由 AI 执行；浏览器人工验收遵守 AGENTS.md，包含 12 个主题组合、窄屏、键盘与实际 CRUD。

## 下游升级

见 [PRISM 升级指南](../guides/prism-upgrade.md)。设计包归入 Foundation 同步白名单；推广站不下发；Platform 内容按现行同步工具保留。

## 实施结果

共享令牌、应用壳、登录、全部管理模块、默认 Platform 和双语宣传站已接入。用户移动卡片、角色目录/详情、部门树/详情、侧面编辑和权限分区遵循既有 API。用户及角色在第一步保存成功后保留主体 ID，以支持第二步授权失败重试。

宣传站独立使用本地偏好；设计图按预览标注。公共包与 Sync 分类有工具回归覆盖，具体构建/测试结果与浏览器验收范围见[完成计划](../archive/plans/2026-10-03-prism-design-system.md)。
