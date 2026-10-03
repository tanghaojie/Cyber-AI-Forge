---
scope: foundation
title: 部门模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 部门模块

## 背景与目标

`departments` 提供可管理的组织树和用户部门归属，为数据权限解析提供稳定的部门、祖先和后代关系。用户拥有一个主部门，并可属于多个附属部门。

## 范围与非目标

模块包括部门树 CRUD、部门闭包关系、部门选项 API、管理页面以及用户部门上下文查询。部门不拥有岗位定义、部门负责人、组织租户、虚拟团队或跨组织关系；岗位由独立的 `positions` 模块管理。

## 职责与边界

- `departments` 拥有 `sys_departments` 部门记录和 `sys_department_closure`。
- `users` 拥有用户与部门的归属关系 `sys_user_departments`，并保证每个有效用户恰有一个主部门。
- `positions` 拥有岗位定义和用户岗位关系；部门不直接读写岗位表，岗位对部门的依赖通过岗位模块消费部门公共查询实现。
- `authorization` 只能通过本模块公开的部门上下文和后代查询消费组织关系，不修改部门树。
- 部门管理页面编辑本模块数据，并通过 authorization 公共 API 编辑该部门作为授权主体的数据策略。

## 公共接口

- HTTP：`GET/POST /admin/departments`、`PUT/DELETE /admin/departments/{id}`、`GET /admin/departments/options`。
- 后端公共文件：`departments.route.ts`、`departments.repository.ts`、`departments.access.ts`。
- 前端公共文件：`departments.api.ts`、`registerViews.ts`。
- 契约：`DepartmentSummary`、`DepartmentRequest`、部门列表和选项响应。

## 数据模型与数据流

`sys_departments` 保存 `parent_id`、名称、排序、启用状态及生命周期字段。部门 ID 是数据库生成的 UUIDv7，供层级、归属和数据策略统一关联；名称是面向用户的展示和搜索信息。根节点使用 `parent_id = NULL`，HTTP 契约对应 `parentId: null`，不保留数字 `0` 虚拟根。

`sys_department_closure` 保存 `(ancestor_id, descendant_id, depth)`，包含每个有效部门到自身的深度 0 记录。创建和移动部门在事务中重建有效闭包；软删除部门时同步软删除涉及该部门的闭包关系。

管理列表接口保持返回带 `parentId` 的扁平数组，前端模块内部按 `parentId` 组装树节点；根节点和同级节点均按 `sortOrder`、`id` 稳定排序。左侧组织树默认展开并允许逐级折叠，右侧显示选中部门详情、编辑、新建下级与删除操作，按名称搜索时保留命中节点的祖先路径；父节点自身命中时保留其完整子树。

父部门编辑器使用同一树结构展示虚拟根节点和可选部门。编辑已有部门时，当前部门及其全部后代不进入候选树，禁用部门保留层级上下文但不可选；后端闭包校验仍是防止环和无效父节点的最终边界。

创建或更新拒绝自引用、父节点不存在、父节点禁用以及把部门移动到自己的后代。存在有效子部门、有效用户归属或自定义数据策略引用时禁止删除；部门软删除不会硬删除岗位，岗位在有效性查询中随已删除部门失效。

## 依赖关系

`departments` 依赖数据库和共享 HTTP 能力；删除校验通过 `users.access.ts` 和 `authorization.references.ts` 检查成员与策略引用。`users` 通过部门选项 API 选择归属；`positions` 单向消费 `departments.access.ts` 校验岗位所属部门；`authorization` 通过 `departments.access.ts` 获取候选部门的有效 ID、祖先和后代。

## 失败模式与安全考虑

- 无法构成完整无环树时事务回滚，不留下部分闭包。
- 禁用部门不会参与新授权决策，但历史归属保留。
- 部门软删除不会级联删除岗位；岗位查询同时过滤部门的 `is_deleted`/`enabled`，因此相关岗位和任职会保留历史但不作为有效上下文。
- 部门选项只向具备用户、角色、岗位或部门管理权限的已认证用户开放；存在子部门、有效用户归属或自定义策略引用时拒绝删除。

## 测试与验证策略

后端测试覆盖闭包构建、循环拒绝、软删除约束和公共查询；前端通过格式检查、TypeScript 检查和生产构建验证静态正确性，树表格的展开/折叠、搜索上下文、父部门树选择、策略抽屉和窄屏布局由维护者人工验收。

## 兼容性与迁移

全新数据库基线创建一个启用的“默认部门”根节点、闭包自关系以及初始管理员主部门归属；后续用户写入流程继续保证有效用户具有主部门。

## 未决问题

无。

## 相关 ADR、计划和 AI 日志

- [ADR-0025](../../decisions/ADR-0025-pluggable-authorization-and-data-scope.md)
- [授权模块](authorization.md)
- [授权与部门实施计划](../../archive/plans/2026-07-30-pluggable-authorization.md)
- [部门树形展示实施计划](../../archive/plans/2026-07-30-department-tree-view.md)
- [授权与部门 AI 协作记录](../../archive/ai-logs/2026/07/2026-07-30-pluggable-authorization.md)
- [部门树形展示 AI 协作记录](../../archive/ai-logs/2026/07/2026-07-30-department-tree-view.md)
- [岗位模块](positions.md)
- [岗位与组织归属 ADR](../../decisions/ADR-0034-position-organization-ownership.md)
