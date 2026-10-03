---
scope: foundation
title: 前端系统设置模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 前端系统设置模块

## 背景与目标

管理端在当前浏览器内保存设备级界面偏好。`settings` 提供集中设置入口、完整值校验和安全的本地持久化；六项设置在变更时立即由应用壳或浏览器标题消费者生效。

## 范围与非目标

模块管理导航菜单风格、主题颜色、深色模式、Tags View、侧栏 Logo 与动态标题六项设置，以及本地持久化和存储不可用时的内存降级。

它不请求或保存后端配置，不跨浏览器或设备同步。Tags View、侧栏 Logo 与动态标题的界面和标题逻辑仍由应用壳与启动组合层实现，设置模块只拥有偏好值。

## 职责与边界

- `settings.store.ts` 是设置数据所有者，负责恢复、校验、立即持久化和清除浏览器数据。登录页外观入口也消费同一 Store，用户无需认证即可设置设备级深色模式与主题颜色。
- `SettingsDialog.vue` 是公开编辑界面。每次选择、开关变化和恢复默认值都立即更新 Store；关闭抽屉不回滚已应用的设置。
- `ThemeController.vue` 是公开应用根控制器，订阅 Store 并把主题颜色、深色状态和浏览器 `color-scheme` 同步至 `html`；它不拥有或复制设置状态。
- `settings.locales.ts` 提供模块固定中英文文案。
- `AdminLayout.vue` 消费 Store 的公开导航、Tags View 与侧栏 Logo 设置并决定应用壳布局；`AppHeader.vue` 仅展示抽屉入口。
- `shared/browserStorage.ts` 只提供安全存储访问，不拥有设置键或业务语义。

## 公共接口与数据流

`settings.store.ts` 导出 `useSettingsStore()`、`SystemSettings`、`NavigationMenuStyle`、`ThemeColor` 和 `DEFAULT_SYSTEM_SETTINGS`。`settings.theme.ts` 公开六套主题元数据，供设置界面和主题控制器一致地使用。共享主题包分别定义浅色与深色的表面、文字、边界和交互令牌；中性品牌图片不随主题染色；健康状态始终使用固定的语义色：正常为绿色、加载为中性灰、异常为红色，不随主题切换。Store 公开只读 `settings`，并提供 `save(settings)` 和 `reset()`；`save()` 校验、克隆并写入浏览器存储。

```text
AppHeader 用户下拉
    -> SettingsDialog 单项变更或恢复默认
        -> settings.store.save() / reset()
    -> localStorage: ${platform.storagePrefix}_system_settings:v1
        -> ThemeController.vue
            -> html[data-theme] + html.dark + color-scheme
                -> CSS variables + Element Plus tokens

AdminLayout
    -> settings.store.settings.navigationMenuStyle / tagsView / sidebarLogo
    -> 顶部或侧边导航布局、Tags View 可见性、侧栏品牌区

LoginInteraction
    -> LoginAppearanceControls
        -> settings.store.save()
        -> 登录页主题与深色模式即时更新

main.ts
    -> settings.store.settings.dynamicTitle
    -> 路由标题或固定 PlatformConfig.name
```

设置值必须是包含全部六项已知字段的有效对象。导航风格为 `sidebar` 或 `top`，主题色为 `jade`、`civic`、`monochrome`、`azure`、`violet` 或 `amber`，其余四项为布尔值。恢复旧版存储时，`aurora`、`ocean`、`violet`、`sunset` 分别映射为 `jade`、`azure`、`violet`、`amber`；其余有效偏好保持不变，并在用户下次保存时写回当前结构。

## 依赖、失败模式与验证

模块依赖 Pinia、Vue、本地化、`shared/browserStorage` 和 Foundation 公共 `@cyber-ai-forge/design-tokens` 主题元数据；应用根只通过登记的 ThemeController 公共文件挂载主题副作用，启动组合层通过登记的 Store 决定浏览器标题，应用壳只通过登记的 Store 和 Dialog 公共文件消费本模块。模块不读取 Router、认证、导航或侧栏内部状态。

损坏、旧版或字段不完整的存储内容会回退默认值。浏览器禁止或拒绝写入 `localStorage` 时，当前会话仍保留内存设置，刷新后的恢复不受保证。深色规则必须以不低于主题浅色规则的选择器优先级覆盖所有表面令牌，避免主题专属浅色背景在深色模式下残留。

AI 执行格式化、格式检查、TypeScript 检查、生产构建和最终 diff 检查，不创建或运行前端自动化测试。维护者人工验收应确认：每项选择无需保存即可应用和持久化、关闭抽屉不回滚、恢复默认值立即生效，刷新后六项设置恢复；登录页外观入口可键盘聚焦，深色模式与六色主题立即更新登录页，刷新后仍恢复；Tags View 关闭后不显示且不清除已保存历史，重新开启后恢复显示；侧栏 Logo 关闭后桌面侧栏不保留品牌区，抽屉侧栏仍有关闭按钮；动态标题关闭后路由和语言切换不改变浏览器标题且始终显示 app name；六色主题与深色模式立即更新应用壳、基础表面、Element Plus 和设置抽屉；窄屏保持抽屉式侧边导航而不改写桌面偏好。

## 兼容性与迁移

存储键为 `${platform.storagePrefix}_system_settings:v1`，不读取历史键。未来出现不兼容结构时递增版本；仅在明确需要保留用户设置时提供一次性迁移。

## 相关记录

- [系统设置立即生效计划](../../archive/plans/2026-08-04-settings-immediate-apply.md)
- [主题颜色与深色模式实施计划](../../archive/plans/2026-08-04-theme-and-dark-mode.md)

PRISM 中 `SettingsDialog.vue` 保留公共文件名和 v-model 接口，内部使用 Element Plus Drawer。六主题以双模式色样呈现，导航样式预览与即时生效语义不变。
