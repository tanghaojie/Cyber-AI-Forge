---
title: PRISM 主题令牌模块
scope: foundation
status: active
owner: project maintainers
updated: 2026-10-03
---

# PRISM 主题令牌模块

## 职责与边界

`packages/design-tokens` 拥有六种主题标识、浅深配色和表面、文字、状态、排版语义；不拥有用户偏好、业务数据或品牌图片。代码位于 `src/foundation/modules/theme/`，不依赖 Vue、Element Plus、Platform 或 Forge。

## 公共接口

- `@cyber-ai-forge/design-tokens` → `theme.ts`：`THEME_COLORS`、`THEME_COLOR_OPTIONS`、`ThemeColor`、`ThemeColorOption`。选项的颜色引用 CSS 变量，具体色值只定义一次。
- `@cyber-ai-forge/design-tokens/theme.css` → `theme.tokens.css`：`--prism-canvas/surface/raised/navigation/text/secondary/muted/line`、`--prism-accent/on-accent/tint`、`--prism-success/warning/danger`、`--prism-font/mono/radius/shadow`。主题色原始值为 `--theme-<id>-light/dark`。
- 宿主在 `html[data-theme]` 设置六个稳定 ID 之一，在 `html` 切换 `dark` class；默认 jade / light。令牌本身没有 DOM 或存储副作用。

## 依赖与数据流

Foundation settings 重导出主题元数据，Store 保持既有存储结构，ThemeController 应用根节点状态。`base.scss` 把 PRISM 变量映射到兼容别名，Element Plus 覆盖引用别名。Forge 宣传站直接导入公共包，保存独立外观偏好，不消费后台 Store。

## 失败模式与验证

未设置主题时使用 jade 浅色；无效存储在宿主校验或回退。字体使用系统回退栈，不依赖字体网络服务。暗色按钮使用深色前景，浅色按钮使用白色前景；状态色不跟随主题色。类型和构建检查验证包入口，同步工具测试覆盖包归属。浏览器 12 组合及可访问性由人工验收，不创建前端自动化测试。

## 下游同步

整个包属于 Foundation 白名单。Integration 必须保留 frontend package.json 的 workspace 依赖及 lockfile 链接，并执行安装。只同步 SCSS 而遗漏包将使构建失败；这应作为升级错误处理，不能复制配色绕过。
