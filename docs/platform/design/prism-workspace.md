---
title: PRISM 默认 Platform 页面
scope: platform
repository: Cyber-AI-Forge
status: active
owner: project maintainers
updated: 2026-10-03
---

# PRISM 默认 Platform 页面

## 职责与公共接口

`src/platform/modules/home/registerViews.ts` 和 `src/platform/modules/about/registerViews.ts` 保持动态页面注册入口。页面、品牌图片与本地化文案由默认 CYBER Platform 拥有。下游同步保留自己的 Platform，不强制继承这些页面。

## 依赖与数据流

home 消费 Foundation navigation Store 的可访问菜单、PlatformConfig、品牌组件和 PlatformArtwork。快捷入口排除根路径与当前路径，最多四个；不伪造运行指标。about 消费静态本地化工程说明与公开配置，使用相同品牌主视觉。Platform 注册层将本地图片 URL 注入 `brand.artwork`；组件不反向导出到 Foundation。

## 失败与验证

缺少菜单时显示已有空态；未配置品牌图时共享组件提供中性结构。图片按 Vite 资源构建，不请求外部图源。样式覆盖浅/深与主题强调，保留中文、英文以及 GitHub/主页链接。类型与生产构建验证编译；页面、导航、文字溢出和主题组合由维护者人工验收。
