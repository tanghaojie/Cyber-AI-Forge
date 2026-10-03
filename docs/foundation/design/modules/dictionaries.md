---
scope: foundation
title: 字典模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 字典模块

## 职责与边界

`dictionaries` 拥有通用字典项的分页、创建、编辑、软删除和独立管理页面，不承载其他业务模块的专属规则。

## 公共接口

- HTTP：`GET/POST /admin/dictionaries`、`PUT/DELETE /admin/dictionaries/{id}`。
- 前端公共文件：`registerViews.ts` 登记字典管理页面；`dictionaries.api.ts` 暴露字典管理 API。
- 契约：`DictionarySummary`、`DictionaryRequest` 及分页响应。

## 失败模式与测试策略

`DictionariesPage.vue` 聚合 `pages/components/DictionariesList.vue` 与 `DictionaryDialog.vue`。
列表组件拥有分页、搜索、错误和删除交互；Dialog 拥有创建/编辑表单、校验和保存，Page 只选择
编辑对象并在保存后刷新列表。

同一类型和值的组合只在未删除字典项中唯一，数据库使用 `is_deleted = false` 部分唯一索引保证并发安全；软删除后允许新字典项复用相同组合，并可保留多条历史记录。所有读取过滤软删除记录。后端自动化测试覆盖分页、排序、状态和有效记录唯一索引；前端表单转换与业务错误展示由维护者人工验收。

初始版本之前的软删除唯一性取舍保留在[归档 ADR](../../archive/README.md)，当前语义以本设计、数据库 Schema 和后端测试为准。

## PRISM 呈现

管理页使用统一页面标题、检索工具栏、66px 数据行、语义状态与命名操作按钮；编辑器改用侧边抽屉，保留已有字段、校验、公共接口与 API。保存期间禁用表单和关闭操作，窄屏抽屉占满视口。前端响应式与 CRUD 由维护者人工验收。
