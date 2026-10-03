---
scope: foundation
title: 前端应用与应用壳
status: active
owner: maintainers
updated: 2026-10-03
---

# 前端应用与应用壳

## 定位与边界

`apps/frontend` 是 Vue 3 单页应用，通过 `@cyber-ai-forge/api-contract` 推导的 TypeScript 类型访问后端。它拥有应用启动、认证状态、静态与动态路由、响应式管理端外壳和各前端业务模块；不依赖 NestJS 或 Fastify adapter 内部实现，也不把数据库字符串当作任意动态导入路径。

业务页面、API 和状态按类别归属：脚手架内置能力位于 `src/foundation/modules/<module>/`，后续产品业务位于 `src/platform/modules/<module>/`。`src/foundation/router/`、`src/foundation/layouts/`、`src/foundation/bootstrap/`、`src/foundation/api/` 和领域无关的 `src/foundation/shared/` 只承担应用组合或平台能力，不承载具体业务规则。

## 当前结构与公共边界

- `src/foundation/modules/<module>/pages/`、`src/platform/modules/<module>/pages/`：模块路由页面；`pages/components/`：仅供所属页面使用的列表和 Dialog。
- `src/{foundation,platform}/modules/<module>/*.api.ts`：模块 HTTP 调用；`*.store.ts`：确需跨页面共享的 Pinia 状态。
- `src/{foundation,platform}/modules/<module>/*.locales.ts`：所属模块的中英文运行时固定领域文案；由
  localization 在构建期自动发现。跨模块通用文案必须改用 `shared.*`，不得在模块资源中重复定义。
- `src/{foundation,platform}/modules/**/registerViews.ts`：需要被数据库菜单选择的模块登记页面加载器。
- `src/foundation/modules/api-logs/`：只读接口日志分页查询、筛选表格和元数据详情抽屉；它只消费
  `ApiLogQuery` 和 `ApiLogItem` 的脱敏契约字段。
- `src/foundation/shared/routing/view-registry.ts`：构建期发现全部 `registerViews.ts`，校验稳定 key 并冻结页面注册表。
- `src/foundation/shared/routing/layout-registry.ts`：发现 `src/foundation/layouts/*.vue`，以文件名建立只读布局注册表；`AdminLayout` 必须存在。
- `src/foundation/shared/browserStorage.ts`：向前端模块公开 `browserStorage()`；在 SSR、隐私模式或浏览器策略禁用存储时返回 `null`，调用方保留各自的内存降级和错误处理语义。
- `src/foundation/shared/localization/localization.resource.ts`：定义受支持语言、资源结构和中英文键集合校验；
  `src/foundation/shared/localization/shared.locales.ts`：提供 `shared.*` 命名空间的领域无关界面文案。
- `src/foundation/router/constRoutes.ts`：登录、显式错误页面和不依赖后端菜单的个人资料路由；默认静态配置不占用 `/`。
- `src/foundation/router/routerGuard.ts`：认证恢复、导航加载和首次动态路由安装。
- `src/foundation/router/dynamicRoutes.ts`：根据菜单树生成、注册和清理动态路由。
- `src/foundation/router/index.ts`：创建 Router，组装静态路由、最终 404 和认证守卫。
- `src/foundation/bootstrap/registerHttpErrorHandler.ts`：组装 Router、认证、导航和全局 HTTP 错误动作。
- `src/foundation/components/layout/` 与 `src/foundation/layouts/AdminLayout.vue`：桌面级联顶部导航、移动侧栏抽屉、顶栏和内容出口；头像下拉菜单可打开个人资料页。
- `src/foundation/modules/tag-view/`：账号隔离的页面标签历史、浏览器持久化和标签控制界面。
- `src/foundation/modules/settings/`：设备级系统界面偏好、版本化浏览器持久化、设置抽屉，以及主题颜色与深色模式的应用根控制器；登录页通过 auth 模块私有入口消费其 Store 与主题元数据。
- `src/foundation/modules/localization/`：默认中文的运行时语言状态、模块和 shared 资源发现、Element Plus
  语言包、日期格式化和语言切换器。
- `src/foundation/layouts/EmptyLayout.vue`：只提供一个 `<router-view>` 的可选布局。
- `src/foundation/assets/icons/*.svg`、`src/foundation/shared/icons/icon-registry.ts` 与 `src/foundation/components/AppIcon.vue`：构建期 SVG sprite 和稳定图标名称；每个文件使用 kebab-case 名称、`0 0 24 24` viewBox 和无硬编码颜色的单色描边图形，文件名会自动成为菜单可选的图标名。

模块外部只能依赖模块设计登记的表意公共文件。禁止新增无差别 `index.ts` barrel，禁止跨模块导入页面、私有 composable、内部状态或未登记 service。用户模块通过角色和部门 API 读取归属选项；用户、角色和部门弹窗复用 authorization 的 `DataPolicyEditor.vue` 与 API；菜单弹窗通过 authorization API 读取权限目录。

## 认证数据流

1. `auth.api.ts` 封装登录、当前用户和退出请求，`auth.store.ts` 只编排状态、错误文案和 token 生命周期。
2. 登录成功数据为 `{ user, issued: { token, expiresAt } }`。store 通过 Foundation 的 token 适配器把 token 写入由 Platform `storagePrefix` 派生的 cookie，并使用服务端返回时间作为到期时间；清状态时同时删除旧 `cyber_access_token` 和 `jtlib_access_token`，但不继续使用旧令牌。
3. 共享 API Client 从 token 适配器读取值并附加 `Authorization: Bearer <token>`。
4. 退出或 HTTP 401 清除认证、导航和动态路由状态；token 适配器同时移除 cookie 与旧 `localStorage` 键。
5. `api/result.ts` 在后端既没有合法成功响应也没有错误响应时显示统一消息并抛出异常；HTTP `200` 中的非零业务 `status` 仍由调用模块处理。

cookie 当前由浏览器 JavaScript 管理，不是服务端 `HttpOnly` cookie；其安全边界仍依赖同源 XSS 防护和 Bearer token 规则。

## 导航与路由数据流

1. `constRoutes.ts` 直接注册公开登录、公开 404、受认证保护的无权限页，以及使用 `AdminLayout` 的个人资料页；默认静态配置不注册首页或占用 `/`。
2. 非公开导航进入 `authenticationRouteGuard()`：恢复当前用户；未认证时跳转登录；首次认证成功时加载菜单树、安装动态路由并按原地址重新匹配。
3. `navigation.store.ts` 通过 `navigation.api.ts` 获取 `GET /navigation/menus`，先把相对路径按目录层级解析为规范绝对路径，再缓存树和扁平列表。
4. `dynamicRoutes.ts` 递归生成路由。`directory` 使用显式布局或 `RouterView` 并承载子路由；`menu` 使用已登记页面，显式布局存在时创建只有一个空路径子项的布局包装，否则直接加载页面；`button` 不注册站内路由。菜单路由保留原始 `meta.title` 和 `meta.menuPath`，并额外保存可响应语言切换的 `localizedTitle` 与 `localizedMenuPath` 标签描述；应用壳解析后展示当前语言标题路径。
5. 每棵根菜单子树通过 `router.addRoute()` 注册。安装过程同时记录成功生成的动态根页面和首个站内页面路由名称；认证守卫访问 `/` 时优先使用显式静态根页面，其次动态根页面、首个动态页面，最后进入无权限页。刷新菜单、退出或 401 时调用移除函数并重置动态落点。
6. `AdminLayout` 读取 settings 模块保存的导航风格：桌面端可在固定侧边导航和递归 `TopNavigation.vue` 顶部导航之间切换。顶部只渲染首页和权限过滤后的根菜单；带有子节点的任意节点在鼠标悬停或键盘焦点进入时展开其同级浮层，子级浮层贴靠父项右侧继续级联。目录仅作为分组入口，站内菜单使用 RouterLink，外链按钮在新窗口打开 HTTP(S) 地址；空目录不会显示。`max-width: 1023px` 时，无论保存的桌面偏好为何都自动使用抽屉式侧边导航，不改写该偏好；Header 的菜单按钮始终可见，可在任何尺寸打开或关闭抽屉。
7. `AdminLayout` 把已认证账号 ID、当前 `route.path` 和 `meta.title` 交给 `tag-view` 模块；模块按账号恢复并保存不含 query/hash 的页面历史。关闭当前标签时应用壳导航到相邻标签，无后备项或关闭全部时重新进入 `/` 并由根入口解析当前有效落点。菜单刷新移除当前动态页面时，应用壳也使用同一落点规则替换失效地址。

目录层级通过嵌套路由自然传递上级布局：目录无显式布局时使用 `RouterView`，菜单无显式布局时直接使用页面。当前实现不会为所有动态根菜单自动包裹 `AdminLayout`；需要该布局时由菜单或祖先目录明确选择。未知页面 key、缺少组件名或未知菜单类型不会回退到任意导入；前两者记录控制台错误并跳过路由，未知类型抛出错误。

## 页面注册、布局与样式

`view-registry.ts` 扫描 `@/foundation/modules/**/registerViews.ts`；`platform.register.ts` 独立扫描 `@/platform/modules/**/registerViews.ts` 并通过 Foundation 公共注册函数装配。登记 key 必须符合小写字母开头的 kebab-case 约束且全局唯一；页面标签使用 `{ key?, fallback }` 描述，供菜单编辑器按当前语言解析，未提供或找不到翻译 key 时保留回退文案。缺少 `registerViews()`、非法 key 或跨作用域重复 key 会在启动阶段失败。

当前 Platform 默认品牌为 `CYBER / Cyber AI Forge`。`src/platform/brand/` 和 `src/platform/config/platform.config.ts` 拥有品牌组件与文字配置；名称、副标题、项目链接和创作者署名可由 `VITE_APP_*` 环境变量覆盖，缺失或空白时回退默认值。Foundation 本地开发端口由 `src/foundation/config/foundation.config.ts` 拥有，Integration 的 `src/config/runtime.config.ts` 聚合两层配置。Foundation 只通过 `PlatformDefinition` 注入接口渲染 Logo 和创作者信息，不直接导入 Platform。主题颜色由 settings 模块和语义令牌管理，不属于 `PlatformConfig`。完整边界见[CYBER 品牌与视觉系统](../../../forge/design/branding.md)。

`main.ts` 先调用 `installPlatform()` 登记品牌、Platform 文案和页面，再安装 Pinia、localization 与 Router；`App.vue` 通过 `LocalizationProvider.vue` 为
Element Plus 提供当前语言包。登录页与 Header 共用 `LanguageSwitcher.vue`，语言切换立即
更新固定文案、`<html lang>`、页面标题和本地日期格式，并写入由 Platform `storagePrefix` 派生的版本化键。
数据库与 API 契约不保存语言偏好。动态标题没有路由专属标题时使用 `PlatformConfig.fullName` 与 `PlatformConfig.name` 组合，Logo 下方的产品描述使用 `PlatformConfig.tagline` 的大写形式，登录页签名使用原始 `PlatformConfig.tagline`。

`tag-view` 位于 Header 与主内容之间，历史标签可横向滚动，操作入口提供关闭当前、关闭其他和关闭全部。其版本化 `localStorage` 数据按 UUID 用户 ID 隔离；存储不可用或内容损坏时降级为内存状态，不影响 Router 导航。Header 用户下拉同时提供系统设置入口：该抽屉 对设备级的导航菜单风格、主题颜色、深色模式、Tags View、侧栏 Logo 和动态标题设置逐项立即保存。导航菜单风格控制桌面导航布局；Tags View 控制标签栏可见性但不清空历史，并把应用主区的标签栏高度归零；侧栏 Logo 控制侧栏品牌区，移动抽屉在隐藏品牌时仍保留可访问的关闭按钮；动态标题打开时按当前路由与语言更新浏览器标题，关闭时始终显示 `PlatformConfig.name`。主题颜色和深色模式会立即控制应用根。具体边界见[系统设置模块](settings.md)。

全局变量 `--app-shell-header-height` 定义应用壳顶部高度，当前值为 `72px`。顶部模式的桌面应用壳为单列布局，粘性 Header 保留一级菜单、标题路径和用户菜单；下拉菜单在 Header 层级内显示，避免被内容区裁切。侧边模式的桌面应用壳固定为双列布局，Header 仍保留侧栏开关。窄屏由 `matchMedia('(max-width: 1023px)')` 强制使用抽屉式侧边导航，窗口恢复后重用保存的桌面偏好。菜单打开按钮不按断点隐藏；抽屉打开时侧栏中的关闭按钮与遮罩可关闭它。

布局注册表通过懒加载发现 `src/foundation/layouts/*.vue`。`AdminLayout` 是静态根壳和必备布局；`EmptyLayout` 可供菜单显式选择。Tailwind CSS 负责布局、间距、响应式和多数视觉样式，Element Plus 提供表单、表格、弹窗和反馈；全局 SCSS 按基础、管理布局、过渡和 Element Plus 组件覆盖拆分。其中 `styles/element-plus/el-dialog-override.scss` 将 `--el-dialog-margin-top` 统一设为 `5vh`，适用于所有未自行覆盖该变量的 `el-dialog`。六套主题通过语义 CSS 令牌同时驱动应用表面、Element Plus、首页 Hero、登录页、侧栏品牌区和健康状态；组件只保留与语义状态相关的成功、警告和错误颜色。用户、角色、部门、菜单和字典管理页面共用的内容容器最大宽度为 `1600px`，窄于该宽度时仍保持响应式占满可用空间。

## 全局 HTTP 错误

共享 Client 只识别 HTTP `401`、`404`、`500` 并调用启动时注册的处理器：401 清状态并跳登录，404 跳错误页，500 使用安全消息提示。HTTP `200` 中的非零业务 `status` 由发起请求的模块处理。

## 验证与已知边界

- AI 执行格式、静态检查、TypeScript 检查和生产构建；不创建或运行前端自动化、端到端或浏览器测试。
- 维护者人工验收登录恢复、cookie 到期、退出/401 清理、直接访问动态 URL、页面与布局发现、目录嵌套、权限菜单过滤、标签历史恢复与关闭操作、部门与三类主体策略弹窗和响应式外壳。
- 当前构建会提示 `AdminLayout.vue` 同时被静态与动态导入，因此不会拆入独立动态 chunk；这不阻止生产构建。
- `useHealth` 会在传输异常、超时或无效响应时更新错误状态；系统化可访问性审计和生产环境 API 地址策略尚未补齐。

初始版本之前的前端应用壳和注册表取舍保留在[归档索引](../../archive/README.md)，当前行为以本设计和维护者实现为准。

## PRISM 应用壳与品牌图

公共组件 `src/foundation/components/platform/PlatformArtwork.vue` 消费 `PlatformDefinition.brand.artwork?: string`，展示可选本地品牌图片；未配置时渲染中性几何结构。Foundation 不导入 CYBER 图片。应用壳侧栏为 224px，Header 80px，Tags View 44px；窄屏保持菜单抽屉。页面采用 4–8px 圆角、细边界与主题无关的中性背景。共享 CSS 来源为[主题令牌模块](design-tokens.md)。用户、角色、组织与系统编辑器使用侧边抽屉，保存期间禁用表单和关闭操作。
