---
scope: foundation
title: 角色模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 角色模块

## 职责与边界

`roles` 拥有角色定义、列表、创建、编辑、软删除和独立角色管理页面。角色功能权限和角色数据策略由 authorization 模块拥有；角色不再保存或编辑菜单 ID。

## 公共接口

- HTTP：`GET/POST /admin/roles`、`PUT/DELETE /admin/roles/{id}`。
- 前端公共文件：`registerViews.ts` 登记角色管理页面；`roles.api.ts` 暴露角色管理 API 以及用户模块所需的 `listRoleOptions` 与 `RoleOption`。
- 后端公共文件：`roles.access.ts` 暴露角色存在性和候选角色中的有效角色 ID。
- 契约：`RoleSummary`、`RoleRequest` 及分页响应。

## 依赖、数据流与失败模式

`RolesPage.vue` 聚合 `pages/components/RolesList.vue` 与 `RoleDialog.vue`。列表组件拥有分页、搜索、错误和删除交互；Dialog 保存角色定义后，通过 authorization 公共 API 保存功能权限键和数据策略。新建时若第二步失败，会明确提示角色已保存但授权配置未完成，抽屉保持已创建 ID，重试更新该主体并补齐授权；关闭后可重新编辑。

角色以数据库 ID 作为用户归属、权限授予和数据策略的内部关联标识，名称、职责说明和启用状态构成可维护的角色定义；角色编码不进入数据库、契约或界面。角色列表搜索只匹配名称。所有角色管理写路由要求 `roles.manage`；角色选项读取同时允许 `users.manage`。`sys_role_menus` 仅保留兼容关系，不再由角色仓储读写。

## 测试策略

后端自动化测试覆盖路由门禁、软删除、有效记录唯一索引和模块公共文件；前端功能权限、角色数据策略与业务错误展示由维护者人工验收。

初始版本之前的软删除唯一性取舍保留在[归档 ADR](../../archive/README.md)，当前语义以本设计、数据库 Schema 和后端测试为准。

## PRISM 交互

列表为角色目录与详情双栏，窄屏目录横向滚动。选中角色通过 authorization 的 `getSubjectAccess` 读取直接权限与策略，使用请求序号忽略过期响应。读取失败展示错误，不能把失败解释为空授权。功能权限和数据范围分别展示；自定义部门等完整数据规则在编辑抽屉查看。

RoleDialog 继续是私有组件，基本信息、功能权限、数据范围分为三个页签。权限目录仍来自后端稳定功能键，不虚构 CRUD 功能矩阵；数据策略仍由 DataPolicyEditor 根据资源目录配置。
