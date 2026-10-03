---
scope: foundation
title: 认证模块
status: active
owner: maintainers
updated: 2026-10-03
---

# 认证模块

## 职责与边界

`auth` 拥有登录、退出、当前用户、JWT 签发与校验、数据库 token 会话、进程内 LRU 读缓存、凭据校验和前端认证 store。后端通过 Nest `JwtModule`、`JwtTokenCache` 和 `AuthService` 暴露当前用户解析、会话撤销、缓存失效、密码验证与密码散列能力；这些 Provider 只注入实际需要的数据库或 JWT 依赖，不公开会话仓储或缓存内部状态。

## 数据流与会话生命周期

1. 登录在数据库中校验用户凭据并读取角色，使用 Platform 配置解析器校验并由 Integration 应用组装层注入的 `JWT_ISSUER` 与 `JWT_AUDIENCE` 签发 subject 为用户 UUID、7 天有效的 HS256 JWT，把 token 的 SHA-256 哈希、用户和过期时间写入 `sys_auth_sessions`，再把 token 标识与当前用户快照写入容量为 100 的进程内 LRU 缓存。数据库不保存可直接复用的明文 token。
2. 登录响应返回 `{ status: 0, data: { user, issued: { token, expiresAt } } }`。`auth.api.ts` 封装登录、当前用户和退出请求，`auth.store.ts` 负责会话状态，并通过 Foundation 的 `accessToken.ts` 把 token 写入由 Platform `storagePrefix` 派生、到期时间来自 `expiresAt` 的浏览器 cookie。共享 API Client 为请求附加 `Authorization: Bearer <token>`；清会话时同时清理当前 cookie、旧 `cyber_access_token` 和 `jtlib_access_token` cookie 及对应 `localStorage` 键。
3. 鉴权先严格解析 Bearer 头并校验 JWT 签名、issuer、audience、算法和过期时间，再按 token 标识读取 LRU；缓存命中会刷新最近使用顺序，不查询数据库。
4. 缓存未命中时，以 token 哈希查询未撤销且未过期的 `sys_auth_sessions`，联查启用用户和角色后回填 LRU。第 101 个 token 只淘汰最久未使用的缓存项，不撤销数据库会话；该 token 下次请求会回源后继续有效。进程重启同样只产生冷缓存。
5. 显式退出先在数据库软删除当前会话，再删除缓存项。用户资料或角色变更只失效相关缓存，使下一次请求回源获得新快照；删除用户时同时撤销该用户全部数据库会话并失效缓存。

`JWT_SECRET` 是后端必填部署配置，至少 32 个字符，不进入版本控制。`JWT_ISSUER` 和 `JWT_AUDIENCE` 可由部署环境覆盖，缺失或空白时分别回退为 `cyber-ai-forge` 和 `cyber-ai-forge-api`；修改任一值都会使旧令牌失效。数据库会话让 token 跨进程重启并可在多实例上回源验证；当前 LRU 仍是实例本地缓存，多实例中的主动撤销可能在其他实例缓存中持续到该项被淘汰或 token 过期，严格即时撤销需要后续增加跨实例失效通知或共享缓存。

## 公共接口

- HTTP：`POST /auth/login`、`POST /auth/logout`、`GET /auth/me`。除登录外的认证请求使用 Bearer token。
- 后端公共文件：`auth.module.ts` 与 `auth.controller.ts` 暴露认证 HTTP 能力；`auth.service.ts` 的 `AuthService` 暴露 `requireCurrentUser`、`currentUserFromAuthorization`、`invalidateUserTokenCache`、`revokeUserTokens`、`invalidateAllTokenCache`；`auth-token-cache.ts` 的 `JwtTokenCache` 只在认证模块内部使用；`auth.security.ts` 暴露 `hashPassword` 与 `verifyPassword`。`sys_auth_sessions` 当前与其他系统表统一登记在 `src/foundation/database/schema.ts`，只有 auth 模块读写。
- 前端公共文件：`auth.api.ts` 封装认证 HTTP 调用；`auth.store.ts` 暴露 `useAuthStore`；`auth.routes.ts` 暴露登录页面懒加载器 `loginPage`。

## 登录页面组合

`pages/LoginPage.vue` 只负责桌面双栏与窄屏单栏的页面组装，不承载认证状态或品牌展示细节。其同目录私有组件不属于 auth 模块的公共接口：

- `pages/components/LoginPresentation.vue` 负责左侧 CYBER 品牌、AI 驱动的企业应用智能构建平台主张、三项工程支柱、创作者署名和纯展示性的全息背景。背景使用主题语义令牌构造透视网格、悬浮几何体、轨道与数据节点；它不读取认证状态、不发起请求，也不改变文案键。
- `pages/components/LoginInteraction.vue` 负责右侧语言切换、工作台访问环境提示、凭据输入、错误提示、提交状态、本地开发账号提示和登录后的 redirect 恢复。它通过 `useAuthStore().login()` 执行既有认证流程，成功后仍替换到路由 query 中的 `redirect` 或首页。
- `pages/components/LoginAppearanceControls.vue` 是 `LoginInteraction` 使用的私有视觉偏好入口，消费 settings 模块登记的 Store、主题元数据和本地化键；它只更新设备级深色模式与主题颜色，不读取认证状态，也不改变登录流程。

登录页桌面展示区和窄屏交互区都将 CYBER Logo 作为 GitHub 项目入口，复用 Platform 配置中的 `githubUrl` 并以新窗口安全属性打开；该外链不参与登录、redirect 或会话流程。

登录页的固定展示文案从 `auth.locales.ts` 提供，首屏用简洁品牌主张和可选 Platform 中性图片表达产品定位；窄屏隐藏左侧展示区，在交互区保留产品标识、访问环境和创作者署名。展示区通过 Foundation 公共 PlatformArtwork 渲染品牌图，不播放连续装饰动画。

认证表单的输入、错误和登录行为仍由原有 store 与 API 负责，展示重设计不改变认证、会话、redirect 或 cookie 语义。登录页外观入口复用应用根的 `ThemeController`，因此主题切换只改变 CSS 令牌和浏览器 `color-scheme`，不改变认证语义。

## 失败模式与测试

缺少 Bearer 头、格式错误、签名错误、过期、数字或非法 UUID subject、数据库会话不存在或已撤销均返回 HTTP 401；单纯缓存未命中会回源数据库。前端全局处理器同时清除用户、token、导航与动态路由。后端自动化测试覆盖密码、JWT 完整性与过期、UUID subject、LRU 容量和最近使用顺序、淘汰后回源与显式清会话；Bearer 注入、登录状态持久化、清状态和路由保护，以及登录前主题入口由维护者人工验收。

`sys_auth_sessions.token_hash` 全表唯一并保留软删除与审计字段。过期或撤销记录仍是历史安全标识，不重新使用；后续可增加独立清理策略，但清理不能改变仍有效 token 的鉴权语义。

登录页的表单、工具栏和 Logo 强调色消费全局语义主题令牌；品牌图片保持中性石墨色，并响应设备级主题颜色和深色模式；认证逻辑、凭据与会话数据不依赖主题设置。

2026-08-07 品牌切换同时更换 JWT issuer/audience 和访问令牌键；旧品牌下签发的令牌不再通过校验，已有用户需要重新登录。该兼容性边界只影响会话，不迁移或删除账号、授权和业务数据。具体命名基线见 ADR-0031。

认证提供当前身份和角色展示信息。`CurrentUser.roles` 中的每项包含内部关联用的角色 ID 与展示用角色名称；认证接口和前端不传递角色编码，顶部栏按角色 ID 的稳定顺序展示全部角色名称。认证不把功能权限或数据策略写入 JWT。业务路由由 authorization 插件在认证后从 Provider 重新解析权限，因此角色权限和数据策略修改可在下一请求生效；认证缓存中的角色快照不是授权判断来源。

初始版本之前的会话方案取舍保留在[归档 ADR](../../archive/README.md)，当前语义以本设计和后端自动化测试为准。
