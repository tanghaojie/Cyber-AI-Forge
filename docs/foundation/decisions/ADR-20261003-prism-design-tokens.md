---
title: 共享 PRISM 令牌与品牌隔离
scope: foundation
repository: Cyber-AI-Forge
owner: project maintainers
status: accepted
date: 2026-10-03
---

# ADR-20261003：共享 PRISM 令牌与品牌隔离

## 背景

用户批准 PRISM 多主题设计，并要求整个项目和下游、宣传站一致演进。仅复制配色会造成跨端漂移，把 CYBER 素材写进基础模块则会破坏下游品牌。

## 决策

使用 Foundation 所有的 `@cyber-ai-forge/design-tokens` 包作为主题与语义色来源，独立于 Vue、Element Plus 和业务 API。应用与宣传站消费公开样式接口。保留六个主题 ID、浅深独立控制和默认偏好。品牌图属于 Platform 可选注入，未配置时 Foundation 自身可用。

## 结果与风险

下游同步共享令牌与管理能力，品牌和业务模块保留。增加一个 workspace 包与同步白名单；升级必须同步锁文件和依赖，运行现行同步验证。宣传站不能依赖后台私有组件或生产数据。

[设计](../design/prism-design-system.md)
