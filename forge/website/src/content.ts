export type Locale = 'en' | 'zh'

export interface SceneContent {
  code: string
  kind: 'home' | 'users' | 'roles' | 'navigation' | 'logs' | 'settings'
  title: string
  description: string
}

export interface FeatureContent {
  code: string
  title: string
  description: string
  detail: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
  }
  skip: string
  header: {
    nav: Array<{ label: string; href: string }>
    languageLabel: string
    menuLabel: string
    github: string
  }
  hero: {
    eyebrow: string
    titleTop: string
    titleBottom: string
    lead: string
    source: string
    explore: string
    signal: string
    stats: Array<{ value: string; label: string }>
  }
  manifesto: {
    label: string
    title: string
    lead: string
    directTitle: string
    directText: string
    cyberTitle: string
    cyberText: string
    quote: string
  }
  showcase: {
    label: string
    title: string
    lead: string
    scrollHint: string
    sceneLabel: string
    scenes: SceneContent[]
  }
  features: {
    label: string
    title: string
    lead: string
    items: FeatureContent[]
  }
  workflow: {
    label: string
    title: string
    steps: Array<{ number: string; title: string; description: string; output: string }>
  }
  architecture: {
    label: string
    title: string
    lead: string
    stack: Array<{ name: string; detail: string }>
    contractTitle: string
    contractText: string
  }
  audience: {
    label: string
    title: string
    makersTitle: string
    makersText: string
    developersTitle: string
    developersText: string
  }
  start: {
    label: string
    title: string
    lead: string
    copy: string
    copied: string
    boundariesTitle: string
    boundaries: string[]
  }
  closing: {
    label: string
    title: string
    lead: string
    github: string
    backTop: string
    creator: string
  }
}

export const GITHUB_URL = 'https://github.com/tanghaojie/Cyber-AI-Forge'

export const content: Record<Locale, SiteContent> = {
  en: {
    meta: {
      title: 'Open-Source AI Development & Admin Scaffold | Cyber AI Forge',
      description:
        'Open-source AI development and enterprise admin scaffold for Vue, NestJS, and PostgreSQL applications with auth, RBAC, users, roles, menus, and API logs.',
    },
    skip: 'Skip to main content',
    header: {
      nav: [
        { label: 'Showcase', href: '#showcase' },
        { label: 'Features', href: '#features' },
        { label: 'System', href: '#system' },
        { label: 'Start', href: '#start' },
      ],
      languageLabel: 'Switch language',
      menuLabel: 'Toggle navigation',
      github: 'GitHub',
    },
    hero: {
      eyebrow: 'OPEN SOURCE / AI DEVELOPMENT / ADMIN READY',
      titleTop: 'BUILD WITH CLARITY.',
      titleBottom: 'EVOLVE BY DESIGN.',
      lead: 'A full-stack enterprise admin scaffold for AI-assisted development with authentication, RBAC, users, roles, menus, and API logs—without losing structure after the first demo.',
      source: 'View source',
      explore: 'Explore the system',
      signal: 'SYSTEM ONLINE / READY TO EXTEND',
      stats: [
        { value: '15', label: 'system tables' },
        { value: 'ZOD 4', label: 'runtime contracts' },
        { value: '06', label: 'theme palettes' },
      ],
    },
    manifesto: {
      label: '01 / WHY CYBER',
      title: 'Generating code is easy. Keeping a system coherent is not.',
      lead: 'The hard part begins after the first prompt: modules drift, APIs diverge, decisions disappear, and every new conversation starts from zero.',
      directTitle: 'AI from zero',
      directText:
        'Fast first output. Context lives in chat. Foundations are rebuilt, boundaries are guessed, and the project becomes harder to continue.',
      cyberTitle: 'AI with Cyber',
      cyberText:
        'Start from a working full-stack foundation. Structure, contracts, documentation, and verification give every human and AI the same project truth.',
      quote: 'Cyber does not replace AI. It gives AI a reliable place to work.',
    },
    showcase: {
      label: '02 / PRODUCT SURFACES',
      title: 'One foundation. Every surface aligned.',
      lead: 'Explore the PRISM interface designs, from identity and access to the everyday workspace. Preview images use sample data.',
      scrollHint: 'Select a surface',
      sceneLabel: 'Product scene',
      scenes: [
        {
          code: 'SURFACE_01',
          kind: 'home',
          title: 'Operational workbench',
          description:
            'A clear application shell, live system signals, and an extensible home for real business modules.',
        },
        {
          code: 'SURFACE_02',
          kind: 'users',
          title: 'Identity management',
          description:
            'Users, departments, positions, and lifecycle state organized as explicit system capabilities.',
        },
        {
          code: 'SURFACE_03',
          kind: 'roles',
          title: 'Authorization boundaries',
          description:
            'Stable permission keys and data scopes make access decisions visible, testable, and replaceable.',
        },
        {
          code: 'SURFACE_04',
          kind: 'navigation',
          title: 'Database-driven navigation',
          description:
            'Menus become controlled product structure, not scattered route guesses or hard-coded component paths.',
        },
        {
          code: 'SURFACE_05',
          kind: 'logs',
          title: 'Inspectable API activity',
          description:
            'Filterable request records make backend behavior, retention, and response timing visible to operators.',
        },
        {
          code: 'SURFACE_06',
          kind: 'settings',
          title: 'Operator-controlled workspace',
          description:
            'Navigation, theme, tabs, and brand visibility can be tuned from one focused settings surface.',
        },
      ],
    },
    features: {
      label: '03 / CORE SYSTEM',
      title: 'Built for the work after “generate”.',
      lead: 'Cyber turns a capable AI into a reliable project collaborator by making the engineering environment explicit.',
      items: [
        {
          code: 'STRUCTURE',
          title: 'AI-readable architecture',
          description: 'Stable module names, public files, and one-way dependencies.',
          detail: 'New capability has a known home before code is written.',
        },
        {
          code: 'MEMORY',
          title: 'Durable project context',
          description: 'Human and AI documentation describe the same current system.',
          detail: 'The repository—not the latest chat—is the source of truth.',
        },
        {
          code: 'CONTRACT',
          title: 'Shared runtime contracts',
          description: 'Zod schemas stay alive at the HTTP boundary.',
          detail: 'Types, validation, responses, and OpenAPI evolve together.',
        },
        {
          code: 'FOUNDATION',
          title: 'Enterprise admin foundation',
          description:
            'Authentication, users, roles, menus, dictionaries, and API logs for an admin dashboard.',
          detail: 'Start with the repetitive foundation already working.',
        },
        {
          code: 'BOUNDARIES',
          title: 'Controlled evolution',
          description: 'Design gates and explicit module ownership resist architecture drift.',
          detail: 'Complexity grows inside clear boundaries instead of leaking everywhere.',
        },
        {
          code: 'VERIFY',
          title: 'Verification by design',
          description: 'Contracts and backend rules are backed by automated checks.',
          detail: 'Frontend behavior keeps a clear human acceptance boundary.',
        },
      ],
    },
    workflow: {
      label: '04 / BUILD FLOW',
      title: 'From a plain-language idea to a maintainable module.',
      steps: [
        {
          number: '01',
          title: 'Describe the outcome',
          description:
            'A human explains the application, users, and business rules in ordinary language.',
          output: 'INTENT',
        },
        {
          number: '02',
          title: 'Read the blueprint',
          description:
            'AI loads the repository rules, current designs, module boundaries, and active plan.',
          output: 'CONTEXT',
        },
        {
          number: '03',
          title: 'Build through contracts',
          description:
            'Schema, API, backend, database, and interface are implemented as one traceable flow.',
          output: 'SYSTEM',
        },
        {
          number: '04',
          title: 'Verify and preserve',
          description:
            'Checks run, human-facing behavior is accepted, and decisions return to repository memory.',
          output: 'EVOLUTION',
        },
      ],
    },
    architecture: {
      label: '05 / ARCHITECTURE',
      title: 'One contract path. No shadow specification.',
      lead: 'The stack is familiar. The difference is how deliberately every layer is connected and documented.',
      stack: [
        { name: 'VUE 3', detail: 'Responsive operator interface' },
        { name: 'ZOD 4', detail: 'Shared runtime contract' },
        { name: 'NESTJS', detail: 'Application and HTTP boundary' },
        { name: 'DRIZZLE', detail: 'Explicit data access' },
        { name: 'POSTGRESQL', detail: 'Current persistence baseline' },
      ],
      contractTitle: 'Schema first, everywhere it matters.',
      contractText:
        'Frontend types are inferred. Nest validates requests and responses at runtime. OpenAPI metadata is generated from the same route contracts.',
    },
    audience: {
      label: '06 / WHO IT IS FOR',
      title: 'A serious starting point for different kinds of builders.',
      makersTitle: 'Product makers',
      makersText:
        'Bring the idea and make product decisions. Let AI handle more of the full-stack implementation without requiring you to first become a professional developer.',
      developersTitle: 'Professional developers',
      developersText:
        'Reuse the enterprise foundation, keep frontend and backend aligned, and let AI work inside explicit architecture instead of improvising around it.',
    },
    start: {
      label: '07 / QUICK START',
      title: 'Clone. Configure. Start building.',
      lead: 'Node.js, pnpm, and a fresh PostgreSQL database are all you need for the local foundation.',
      copy: 'Copy commands',
      copied: 'Copied',
      boundariesTitle: 'Current boundaries',
      boundaries: [
        'PostgreSQL is the current database implementation.',
        'The initial migration targets a fresh, empty database.',
        'Production secrets, deployment, and security hardening remain operator responsibilities.',
        'Frontend browser behavior requires human acceptance.',
      ],
    },
    closing: {
      label: 'OPEN SOURCE / READY TO FORGE',
      title: 'Give your next AI-built system a structure worth keeping.',
      lead: 'Start from a full-stack foundation designed for clear growth, shared truth, and continuous work.',
      github: 'Explore Cyber AI Forge on GitHub',
      backTop: 'Back to top',
      creator: 'Created by JTLab / 桀士实验室',
    },
  },
  zh: {
    meta: {
      title: 'AI开发脚手架与后台管理系统脚手架 | Cyber AI Forge',
      description:
        '开源 AI 开发脚手架与全栈后台管理系统脚手架，内置登录、用户、角色、权限、菜单、字典和接口日志，支持 Vue 3、NestJS 与 PostgreSQL。',
    },
    skip: '跳到主要内容',
    header: {
      nav: [
        { label: '界面展示', href: '#showcase' },
        { label: '核心能力', href: '#features' },
        { label: '技术体系', href: '#system' },
        { label: '快速开始', href: '#start' },
      ],
      languageLabel: '切换语言',
      menuLabel: '展开或收起导航',
      github: 'GitHub',
    },
    hero: {
      eyebrow: '开源 / AI 开发 / 后台管理基础',
      titleTop: '让复杂系统，',
      titleBottom: '清晰生长。',
      lead: '面向 AI 辅助开发的全栈后台管理系统脚手架，内置登录、用户、角色、权限、菜单、字典和接口日志，帮助人类与 AI 持续构建真实企业应用。',
      source: '查看源码',
      explore: '探索技术体系',
      signal: '系统在线 / 已准备扩展',
      stats: [
        { value: '15', label: '张系统数据表' },
        { value: 'ZOD 4', label: '运行时契约' },
        { value: '06', label: '种主题配色' },
      ],
    },
    manifesto: {
      label: '01 / 为什么是 CYBER',
      title: '生成代码很容易，让系统始终保持清晰并不容易。',
      lead: '真正困难的工作从第一次提示词之后开始：模块逐渐失控、接口彼此偏离、决策遗失，每个新对话又从零理解项目。',
      directTitle: '让 AI 从零搭建',
      directText:
        '第一版很快，上下文却留在聊天里。基础能力反复重建，边界依赖猜测，项目越做越难继续。',
      cyberTitle: '让 AI 基于 Cyber 构建',
      cyberText:
        '从可运行的全栈基础开始。结构、契约、文档与验证让每个人和每个 AI 共享同一份项目事实。',
      quote: 'Cyber 不替代 AI，它为 AI 提供一个可靠的工作环境。',
    },
    showcase: {
      label: '02 / 产品界面',
      title: '一套基础，让每一层彼此对齐。',
      lead: '浏览 PRISM 界面设计：从身份与授权，到日常工作空间。预览图使用示例数据。',
      scrollHint: '选择界面',
      sceneLabel: '产品场景',
      scenes: [
        {
          code: '界面_01',
          kind: 'home',
          title: '运营工作台',
          description: '清晰的应用壳、实时系统信号，以及用于承载真实业务模块的可扩展首页。',
        },
        {
          code: '界面_02',
          kind: 'users',
          title: '身份与组织管理',
          description: '用户、部门、岗位和生命周期状态被组织成职责明确的系统能力。',
        },
        {
          code: '界面_03',
          kind: 'roles',
          title: '授权边界',
          description: '稳定权限键与数据范围让访问决策可见、可测试、可替换。',
        },
        {
          code: '界面_04',
          kind: 'navigation',
          title: '数据库动态导航',
          description: '菜单成为受控的产品结构，而不是散落的路由猜测或硬编码组件路径。',
        },
        {
          code: '界面_05',
          kind: 'logs',
          title: '接口活动可追溯',
          description: '可筛选的请求记录让后端行为、保留策略和响应耗时对维护者清晰可见。',
        },
        {
          code: '界面_06',
          kind: 'settings',
          title: '可即时生效的工作台偏好',
          description: '导航布局、主题、标签页和品牌展示可以在一个聚焦的设置界面中调整。',
        },
      ],
    },
    features: {
      label: '03 / 核心体系',
      title: '为“生成之后”的长期工作而设计。',
      lead: 'Cyber 把工程环境变得明确，让能力很强的 AI 成为更可靠的项目协作者。',
      items: [
        {
          code: '结构',
          title: 'AI 可理解的架构',
          description: '稳定模块名、公共文件和单向依赖。',
          detail: '代码开始之前，新能力就已经知道应该放在哪里。',
        },
        {
          code: '记忆',
          title: '可持续的项目上下文',
          description: '面向人类与 AI 的文档描述同一个当前系统。',
          detail: '事实来源是仓库，而不是最近一次聊天。',
        },
        {
          code: '契约',
          title: '共享运行时契约',
          description: 'Zod Schema 在 HTTP 边界真正执行。',
          detail: '类型、校验、响应和 OpenAPI 始终共同演进。',
        },
        {
          code: '基础',
          title: '企业后台基础能力',
          description: '认证、用户、角色、权限、菜单、字典和接口日志，组成可扩展的管理后台。',
          detail: '从已经可运行的重复基础工作开始。',
        },
        {
          code: '边界',
          title: '受控演进',
          description: '设计门禁和明确所有权抵抗架构漂移。',
          detail: '复杂度在清晰边界内生长，而不是泄漏到每个角落。',
        },
        {
          code: '验证',
          title: '验证内建于流程',
          description: '契约和后端规则拥有自动化检查。',
          detail: '前端行为同时保留明确的人类验收边界。',
        },
      ],
    },
    workflow: {
      label: '04 / 构建流程',
      title: '从一句自然语言需求，到一个可维护的业务模块。',
      steps: [
        {
          number: '01',
          title: '描述想要的结果',
          description: '人类用普通语言说明应用、使用者与业务规则。',
          output: '意图',
        },
        {
          number: '02',
          title: '读取工程蓝图',
          description: 'AI 读取仓库规则、现行设计、模块边界与活动计划。',
          output: '上下文',
        },
        {
          number: '03',
          title: '沿契约完整构建',
          description: 'Schema、API、后端、数据库和界面形成一条可追踪的数据流。',
          output: '系统',
        },
        {
          number: '04',
          title: '验证并保存事实',
          description: '执行检查、验收用户行为，并把长期决定写回项目记忆。',
          output: '演进',
        },
      ],
    },
    architecture: {
      label: '05 / 技术架构',
      title: '一条契约链路，不维护影子规范。',
      lead: '技术栈并不陌生，真正不同的是每一层都以明确、可验证、可记录的方式彼此连接。',
      stack: [
        { name: 'VUE 3', detail: '响应式管理界面' },
        { name: 'ZOD 4', detail: '共享运行时契约' },
        { name: 'NESTJS', detail: '应用与 HTTP 边界' },
        { name: 'DRIZZLE', detail: '显式数据访问' },
        { name: 'POSTGRESQL', detail: '当前持久化基线' },
      ],
      contractTitle: 'Schema 优先，贯穿真正需要它的地方。',
      contractText:
        '前端从 Schema 推导类型；Nest 在运行时校验请求和响应；OpenAPI 元数据来自同一份路由契约。',
    },
    audience: {
      label: '06 / 适合谁',
      title: '为不同类型的创造者提供同一个可靠起点。',
      makersTitle: '产品创造者',
      makersText: '带来想法并负责产品判断，让 AI 承担更多全栈实现，而不要求你先成为专业开发者。',
      developersTitle: '专业开发者',
      developersText:
        '复用企业应用基础，保持前后端一致，让 AI 在明确架构内工作，而不是围绕项目自由猜测。',
    },
    start: {
      label: '07 / 快速开始',
      title: '克隆、配置，然后开始构建。',
      lead: '准备 Node.js、pnpm 和一个全新的 PostgreSQL 数据库，即可启动本地基础系统。',
      copy: '复制命令',
      copied: '已复制',
      boundariesTitle: '当前实现边界',
      boundaries: [
        '当前数据库实现绑定 PostgreSQL。',
        '初始迁移只面向全新的空数据库。',
        '生产密钥、部署和安全加固仍由维护者负责。',
        '前端浏览器行为需要人类验收。',
      ],
    },
    closing: {
      label: '开源 / 已准备锻造',
      title: '为下一个 AI 构建的系统，准备一套值得保留的结构。',
      lead: '从为清晰生长、共享事实和持续协作设计的全栈基础开始。',
      github: '在 GitHub 探索 Cyber AI Forge',
      backTop: '回到顶部',
      creator: '由 JTLab / 桀士实验室创作',
    },
  },
}
