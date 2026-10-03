---
scope: foundation
title: 工作台模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 工作台模块

## 职责与边界

`home` 提供登录后的总览页面，并从导航模块读取当前用户可访问入口生成快捷卡片。它不维护静态业务菜单，也不拥有其他模块数据。

默认工作台实现在 `src/platform/modules/home/`，属于 Platform 自有示范页面。PRISM 中首页依次呈现品牌主张与中性结构图、当前账号的前四个可访问入口、三项工程支柱说明。主张为“让复杂系统，清晰生长。”；不展示未经 API 支持的统计。

快捷入口读取 `navigation.flatItems`，排除 `/` 和当前工作台实际路径，保留动态菜单权限。无入口显示配置提示。共享颜色、PlatformArtwork 与品牌组件负责主题一致性，文字仍来自 home.locales.ts。

## 公共接口与测试

`registerViews.ts` 向动态页面注册表登记工作台懒加载器。工作台是否显示、使用什么路径以及是否作为 `/` 根页面，全部由数据库菜单和当前用户权限决定；静态路由不再直接引用 `HomePage.vue`。页面人工验收关注动态根入口、非根路径入口、导航入口映射、空菜单状态和响应式布局；业务统计接入前需另建数据所有者设计。

首页 Hero 同时展示可点击的 CYBER Logo、Cyber AI Forge 名称和 GitHub 项目入口。Logo 复用品牌组件，外链使用新窗口安全属性，不改变工作台的动态菜单权限和当前用户导航数据流。
