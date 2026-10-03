<p align="center">
  <img src="./apps/frontend/public/cyber-mark.svg" alt="CYBER Logo" width="96" />
</p>

<h1 align="center">Cyber AI Forge</h1>

<p align="center">
  <a href="https://tanghaojie.github.io/Cyber-AI-Forge/">Project Website</a>
  ·
  <a href="./README.md">中文</a>
  ·
  <a href="./docs/README.md">Documentation</a>
</p>

<p align="center">
  AI-Native Enterprise Application Scaffold
</p>

> Ordinary scaffolds help people write code; Cyber AI Forge helps people and AI build enterprise applications together.

**Cyber AI Forge** is a pnpm full-stack scaffold positioned as an `AI-Native Enterprise Application Scaffold`.

It gives AI an understandable engineering structure, clear module boundaries, complete administration capabilities, and project documentation that serves both people and AI. Even if you can barely write code, you can describe your requirements and let AI gradually build a real, runnable application from the database and APIs to the user interface.

> Build clearly. Evolve safely. Let complex systems grow clearly.

## <img src="./forge/website/src/assets/readme-icons/context.svg" alt="" width="20" height="20" /> 01 / Why Cyber AI Forge

AI can already generate large amounts of code, but “can generate code” does not mean “can continuously complete a project.” Without clear structure and rules, AI can easily run into these problems:

- Not knowing where new code belongs
- Reimplementing capabilities that already exist
- Modifying modules arbitrarily and gradually breaking project boundaries
- Causing frontend and backend APIs and data structures to fall out of sync
- Producing only a one-off demo that cannot continue to evolve

Cyber AI Forge was created to give people and AI an enterprise application engineering foundation they can understand, use, and evolve together.

## <img src="./forge/website/src/assets/readme-icons/highlights.svg" alt="" width="20" height="20" /> 02 / Core Highlights

### 02.1 / An engineering structure organized for AI

Cyber AI Forge is not a standard scaffold with AI connected to it. It organizes the project for AI-assisted development from the very beginning, starting with module boundaries, file responsibilities, interface contracts, and extension workflows.

- Clear module responsibilities help AI find the correct implementation location
- Public capabilities are exposed through stable public files, reducing arbitrary cross-module changes
- The frontend, backend, and API contract use consistent module naming
- New APIs and business modules follow a clear implementation path
- The project can be continuously modified instead of only generating one-off demos

### 02.2 / Project documentation shared by people and AI

Cyber AI Forge provides more than development documentation for people. It also maintains project rules, architecture descriptions, design documents, and implementation records for AI collaboration.

- Human documentation helps maintainers understand, run, develop, and maintain the project
- AI documentation helps AI restore context, follow rules, and implement changes
- Design documents record module boundaries, data flows, failure modes, and verification strategies
- Collaboration records preserve important assumptions, actual changes, and verification results

This means that even when you switch to another AI or start a new conversation, the project still has a formal set of documents to help AI quickly understand the current facts instead of relying entirely on chat history.

### 02.3 / AI can lead or even complete full-stack development

People are responsible for expressing ideas, describing requirements, and judging results. AI can take the lead on implementation from the database and API contracts to backend endpoints and frontend pages.

For example, you can tell AI:

> I want to build a household expense tracking system with user login, bill categories, income and expense records, monthly statistics, and administrator features. Please implement this application based on Cyber AI Forge.

AI can then continue with database design, Schema definitions, backend routes, frontend pages, menu registration, permission integration, tests, and builds.

### 02.4 / Administration capabilities ready out of the box

The current version includes:

- Login, authentication, and session management
- User, role, department, and authorization management
- Database-driven dynamic menus and page navigation
- Dictionary management
- API logs
- A workbench and administration application shell
- Runtime multilingual foundations for the frontend
- Swagger API documentation

### 02.5 / Shared runtime contracts between frontend and backend

The project uses Zod to define API runtime Schemas and shares them between the frontend and backend:

- The frontend derives types from the Schemas
- The backend performs runtime validation at the HTTP boundary
- Nest Pipes, response validation, and OpenAPI Schemas are derived from the shared Zod contracts
- Swagger/OpenAPI can be generated from backend route Schemas

This allows AI and people to develop around the same interface facts and reduces frontend/backend drift.

## <img src="./forge/website/src/assets/readme-icons/system.svg" alt="" width="20" height="20" /> 03 / System Screenshots

These PRISM interface design previews cover login, the workbench, users, menus, roles, API logs and settings. They contain sample data and are not screenshots of the running application. Functional and responsive behavior requires local, manual acceptance.

<div align="center">
  <img src="./forge/website/src/assets/design-previews/login.png" alt="Cyber AI Forge login page" width="49%" />
  <img src="./forge/website/src/assets/design-previews/home.png" alt="Cyber AI Forge workbench" width="49%" />
</div>

<div align="center">
  <img src="./forge/website/src/assets/design-previews/users.png" alt="Cyber AI Forge user management" width="49%" />
  <img src="./forge/website/src/assets/design-previews/menus.png" alt="Cyber AI Forge menu management" width="49%" />
</div>

<div align="center">
  <img src="./forge/website/src/assets/design-previews/roles.png" alt="Cyber AI Forge role and data permissions" width="49%" />
  <img src="./forge/website/src/assets/design-previews/api-logs.png" alt="Cyber AI Forge API logs" width="49%" />
</div>

<div align="center">
  <img src="./forge/website/src/assets/design-previews/settings.png" alt="Cyber AI Forge system settings" width="49%" />
</div>

## <img src="./forge/website/src/assets/readme-icons/people.svg" alt="" width="20" height="20" /> 04 / Who is it for?

### 04.1 / People who want to build applications with AI

If you have an application idea but can barely write code, you can use Cyber AI Forge as AI’s workbench:

1. Start the project
2. Tell AI what you want to build in natural language
3. Let AI implement the features step by step according to the project structure
4. View the result in a browser and provide feedback
5. Let AI continue improving, fixing, and extending the application

It is suitable for building personal tools, internal management systems, small SaaS products, operations consoles, and other applications that need login, permissions, a database, and administration pages.

AI handles implementation; people remain responsible for expressing requirements, judging product direction, and accepting the results. Cyber AI Forge is not intended to remove people from the process, but to make building an enterprise application possible without first requiring people to become professional programmers.

### 04.2 / Professional developers

If you are a developer, you can use Cyber AI Forge as a full-stack starting point for a real project:

- Reuse system capabilities such as login, permissions, menus, users, and roles
- Use shared API contracts to keep the frontend and backend consistent
- Continue adding business capabilities along module boundaries
- Let AI assist development within explicit engineering rules
- Use existing tests, builds, and design documents to reduce maintenance costs

## <img src="./forge/website/src/assets/readme-icons/grid.svg" alt="" width="20" height="20" /> 05 / Typical Use Cases

- Internal enterprise administration consoles
- Customer relationship management systems
- Order, inventory, or business operations systems
- Content management systems
- Project management and collaboration tools
- Personal knowledge bases or household expense tracking systems
- Administration consoles for small SaaS products
- Personal applications rapidly validated with AI

If your application needs login, permissions, administration, and a database, Cyber AI Forge can be a reliable starting point.

## <img src="./forge/website/src/assets/readme-icons/compare.svg" alt="" width="20" height="20" /> 06 / Why not let AI build everything from scratch?

Of course, you can ask AI to build an application from an empty directory. The issue is not whether AI can generate the first version of the code, but whether the project can continue to be developed, maintained, and handed over reliably after that first version.

| Comparison                     | Ask AI to build from scratch                                                              | Build with Cyber AI Forge                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Starting point                 | An empty directory and a single conversation                                              | A runnable full-stack foundation                                                                |
| AI context                     | Mainly the current chat history                                                           | The project structure, design documents, and AI collaboration documents together                |
| Foundation capabilities        | Login, permissions, menus, and administration must be reimplemented for every project     | System capabilities such as login, users, roles, menus, and authorization are already included  |
| Code location                  | AI has to guess directory and module responsibilities                                     | Module boundaries, public interfaces, and paths for new features are already clear              |
| Frontend/backend collaboration | APIs, types, and data structures can easily become inconsistent                           | Shared Zod runtime contracts keep them consistent                                               |
| Continuous iteration           | New conversations can forget earlier decisions and the project can gradually lose control | Documents and engineering rules help different AIs or new conversations recover project context |
| Final result                   | More likely to be a one-off demo                                                          | Better suited as the starting point for a maintainable, extensible real application             |

So Cyber AI Forge does not replace AI; it provides AI with a more reliable working environment:

> Asking AI to build from scratch solves “can we make a first version?” Cyber AI Forge solves “can we keep building it?”

### 06.1 / The more complex the project, the clearer Cyber’s value

If you only want a one-off script, simple webpage, or short-term demo, asking AI to build from scratch is perfectly reasonable. Cyber AI Forge is designed to solve the collaboration and integration challenges that appear as enterprise applications grow.

#### 06.1.1 / Build complex projects by module

Complex applications usually need to split capabilities such as authentication, users, permissions, orders, customers, and reports into separate modules and build them in stages. Without unified module rules, different stages can easily create duplicate code, confused responsibilities, and unintended interactions. Cyber AI Forge provides module boundaries, public interfaces, and a fixed extension path so AI can build one module at a time while keeping the overall project structure stable.

#### 06.1.2 / Collaboration between people and multiple AIs

When one person, multiple people, or even multiple AIs develop a project at the same time, everyone must share the same project facts: how directories are organized, how APIs are defined, how modules depend on one another, and how the result is verified. Cyber AI Forge records these rules in the engineering structure and project documentation, allowing different people and AIs to divide the work and finally deliver results that can be merged instead of generating mutually incompatible codebases.

#### 06.1.3 / Integrate multiple systems and business capabilities

Integration projects do not only require new features. They must also combine login, permissions, databases, frontend pages, business modules, and external services that may be connected in the future. Cyber AI Forge provides a unified API contract, system modules, and documentation entry points to help AI understand how the pieces connect and reduce the problem of “each module works alone, but the combined system does not.”

You can think of Cyber AI Forge as an engineering blueprint that everyone and every AI can read:

> AI can handle its own construction work; Cyber ensures that all construction follows the same blueprint and is ultimately combined into a system that can be used continuously.

## <img src="./forge/website/src/assets/readme-icons/guide.svg" alt="" width="20" height="20" /> 07 / If you are not technical, give this README to AI first

If you can barely write code, you do not need to understand technical terms such as `pnpm`, `PostgreSQL`, or `Zod` first. You can give this README and the project to an AI that can access project files, let AI become your technical guide, and then complete development step by step with you.

If you use an AI that can only chat, you can copy or upload this README directly. If the AI can access your project folder, ask it to read `README.md`, `AGENTS.md`, and `docs/README.md` first.

Send the following message to AI, then add the application you want to build:

```text
This is the README for the Cyber AI Forge project. Please read it completely first and treat me as someone who can barely write code.

The application I want to build is:
(Describe your idea here in your own words. For example: I want to build a household expense tracking system.)

Please act as my technical guide and help me complete the project as follows:

1. First explain in simple English what this project can do and which stages we need to complete next.
2. First inspect my computer and project environment and tell me what is missing; do not assume I have installed any tools.
3. Guide me through only one step at a time. Explain the purpose of the step first, then tell me exactly what to do.
4. When technical terms appear, explain them in language an ordinary person can understand instead of only giving commands.
5. Wait for my feedback after each step before continuing; do not output all the project code at once.
6. If you can operate on the current project, read README.md, AGENTS.md, and docs/README.md first, then check the project status.
7. Before any operation that might delete files, overwrite data, or affect a database, warn me and obtain my consent.
8. After each stage, tell me how to check the result in a browser and how to report it if it does not match expectations.

Please do not modify code yet. First complete the project introduction, environment check, and overall plan.
```

AI will usually guide you through these stages:

1. Check and prepare the development environment
2. Start the foundational systems included with Cyber AI Forge
3. Break your idea down into implementable features
4. Design the database and page structure
5. Implement features in stages and verify them in a browser
6. Continue modifying and extending the application based on your feedback

You do not need to describe your requirements professionally all at once. You can start by saying “I want to build a customer management tool,” then work with AI to add users, pages, permissions, and business rules step by step.

## <img src="./forge/website/src/assets/readme-icons/start.svg" alt="" width="20" height="20" /> 08 / Quick Start

### 08.1 / Requirements

- Node.js
- pnpm
- PostgreSQL

### 08.2 / Start the project

```bash
pnpm install

# Windows PowerShell
Copy-Item apps/backend/env/.env.foundation.example apps/backend/env/.env.foundation.local
Copy-Item apps/backend/env/.env.platform.example apps/backend/env/.env.platform.local
```

Edit `apps/backend/env/.env.foundation.local`, enter the connection information for a brand-new empty PostgreSQL database, and set a `JWT_SECRET` with at least 32 characters:

```bash
pnpm db:migrate
pnpm dev
```

Open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs

The first migration creates a local administrator:

```text
Username: admin
Password: Admin@123456
```

This credential is for local initialization only. Before entering a shared or production environment, change the password and use secure key configuration.

### 08.3 / Database notes

The current migration chain targets the system-table baseline of a brand-new empty PostgreSQL database and does not support in-place upgrades of an existing database. An old database cannot be used directly as the new `DATABASE_URL`; if the old data must be kept, first stop using the old database and then design a separate data migration plan.

See the [database baseline rebuild guide](docs/foundation/guides/database-baseline-rebuild.md) for details.

## <img src="./forge/website/src/assets/readme-icons/module.svg" alt="" width="20" height="20" /> 09 / How to have AI develop your application

At the beginning of each substantial task, ask AI to read the project documentation and relevant module designs before proposing an implementation plan. For example:

```text
Please read the AGENTS.md and docs/README.md in the project root, as well as the design documents related to this requirement.

Based on the current project module conventions, add a “customer management” module with a customer table, a paginated list, and create, edit, and delete capabilities. Please first explain the module boundary, data model, API contract, and frontend page plan, then begin implementation. After completion, run the applicable tests, build, and format checks and report the verification results.
```

For ordinary users, requirements can be described entirely in natural language. Developers can add data models, permission rules, interaction details, and acceptance criteria.

## <img src="./forge/website/src/assets/readme-icons/module.svg" alt="" width="20" height="20" /> 10 / How to add a business module

When adding business capabilities, the recommended path is:

1. Define the responsibilities and boundaries of the business module
2. Define runtime Schemas and inferred types in `packages/api-contract`
3. Implement the backend module and routes in `apps/backend/src/platform/modules/<module>/`
4. Implement the frontend module and pages in `apps/frontend/src/platform/modules/<module>/`
5. Register pages, menus, and permissions
6. Add backend and contract tests, and list manual frontend acceptance scenarios
7. Run format checks, tests, and the production build

The page loader for database-driven menus is registered in the owning module’s `view-registry.ts`. The central registry discovers it automatically during the build, after which you enter its stable component identifier in menu management.

The scaffold’s built-in system tables consistently use the `sys_` physical prefix, soft deletion, and five lifecycle fields: `is_deleted`, `created_at`, `created_by`, `updated_at`, and `updated_by`.

## <img src="./forge/website/src/assets/readme-icons/architecture.svg" alt="" width="20" height="20" /> 11 / Technical Architecture

```text
Human describes requirements
    ↓
AI reads project documentation and understands the engineering structure
    ↓
Vue 3 frontend
    ↓
Shared Zod runtime API contract
    ↓
NestJS backend + Fastify adapter + Swagger
    ↓
Drizzle ORM
    ↓
PostgreSQL
```

| Layer                 | Technology and responsibility                                               |
| --------------------- | --------------------------------------------------------------------------- |
| Frontend              | Vue 3, Vite, Vue Router, Pinia, Element Plus, Tailwind CSS                  |
| Backend               | TypeScript, NestJS, Fastify adapter, authentication and administration APIs |
| API contract          | Zod runtime Schemas, inferred types, Nest Pipes, and OpenAPI Schemas        |
| Data access           | Drizzle ORM                                                                 |
| Database              | PostgreSQL                                                                  |
| Repository management | pnpm monorepo                                                               |

## <img src="./forge/website/src/assets/readme-icons/structure.svg" alt="" width="20" height="20" /> 12 / Project Structure

```text
apps/
├── frontend/                 # Vue frontend and administration console
└── backend/                  # NestJS/Fastify service, database, and migrations
forge/
└── website/                  # Forge-only promotional site and GitHub Pages build entry point
packages/
└── api-contract/             # API contracts shared by the frontend and backend
docs/
├── foundation/               # Infrastructure knowledge maintained by Forge and inherited downstream
├── forge/                    # Forge-only knowledge excluded from downstream sync
├── platform/                 # Knowledge independently maintained by the current platform
├── templates/                # Documentation templates shared by all three scopes
└── README.md                 # Documentation entry point shared by people and AI
```

System capabilities and product business capabilities are organized separately under `src/foundation/modules/<module>/` and `src/platform/modules/<module>/`. Cross-module dependencies must go through registered public interfaces.

## <img src="./forge/website/src/assets/readme-icons/start.svg" alt="" width="20" height="20" /> 13 / Common Commands

```bash
pnpm dev           # Start the frontend, backend, and API contract development workflow
pnpm build         # TypeScript checks and production build
pnpm test          # Contract build validation and backend tests
pnpm format        # Format project files
pnpm format:check  # Check formatting
pnpm lint          # Run ESLint checks
pnpm db:generate   # Generate migrations from the Drizzle Schema
pnpm db:migrate    # Apply migrations to a brand-new empty database
pnpm db:platform:generate # Generate the independent Platform migration chain
pnpm test:db       # Check PostgreSQL, system tables, and migration records
```

The frontend currently does not maintain automated unit, component, or browser tests; frontend features and browser behavior are accepted manually by maintainers. The backend and shared contracts continue to use automated tests for verification.

## <img src="./forge/website/src/assets/readme-icons/docs.svg" alt="" width="20" height="20" /> 14 / Project Documentation

The [project documentation entry point](docs/README.md) contains current project knowledge for both human maintainers and AI collaboration:

- [Human maintainer development guide](docs/foundation/guides/human-maintainer-development-guide.md): directory responsibilities, runtime Schemas, Drizzle, backend tests, manual frontend acceptance, and database maintenance workflows
- [System and module design](docs/foundation/design/README.md): current architecture, module boundaries, public interfaces, data flows, and verification strategies
- [Database baseline rebuild guide](docs/guides/database-baseline-rebuild.md): creating a database, applying the baseline, verification, and rollback boundaries
- [Error code reference](docs/foundation/reference/error-codes.md): unified responses, error-code ranges, and the registration workflow

The root `README.md` and `README.en.md` belong to the current repository. Forge maintains its own copies, while each downstream business platform maintains its copied versions independently; Foundation sync never overwrites them.

The root `AGENTS.md` records the collaboration rules that AI must follow when modifying the project. Important design, implementation, and verification results will continue to be synchronized into project documentation rather than remaining only in chat history.

## <img src="./forge/website/src/assets/readme-icons/brand.svg" alt="" width="20" height="20" /> 15 / Branding and white-label configuration

CYBER is maintained by JTLab. CYBER / Cyber AI Forge is the project name, and JTLab is the creator brand. The English subtitle is `AI-Native Enterprise Application Scaffold`; the Chinese subtitle is `AI 驱动的企业应用智能构建平台`. The frontend uses a brand system built from graphite black, warm white, mint green `#70CFA2`, and electric-purple nodes by default.

Application text configuration is located in `apps/frontend/src/platform/config/platform.config.ts`. You can also copy `apps/frontend/env/.env.platform.example` and override it per deployment environment with these variables:

- `VITE_APP_NAME`
- `VITE_APP_FULL_NAME`
- `VITE_APP_TAGLINE`

`VITE_APP_TAGLINE` is shown as-is in the login signature and uppercased below the Logo; when a route has no dedicated title, the browser title uses `VITE_APP_FULL_NAME`.

For a white-label deployment, also replace `CyberLogo.vue` and `public/cyber-mark.svg` so the product name stays consistent with the default C-shaped product mark.

## <img src="./forge/website/src/assets/readme-icons/boundary.svg" alt="" width="20" height="20" /> 16 / Current Implementation Boundaries

The current version has completed the administration foundation described above and is suitable for adding real business modules. To evaluate the project correctly, also keep these boundaries in mind:

- The current database implementation is tied to PostgreSQL
- Initial migrations target only a brand-new empty database
- The administration console and backend do not yet have a CI or production deployment baseline; only the promotional site provides automated GitHub Pages deployment
- Production environments still require maintainers to complete secret management, initial-password changes, deployment, and security configuration
- Frontend features and browser behavior require manual acceptance

These boundaries do not prevent the project from serving as a starting point for AI full-stack development, but the corresponding engineering work must be completed separately before entering a shared or production environment.

## <img src="./forge/website/src/assets/readme-icons/vision.svg" alt="" width="20" height="20" /> 17 / Project Vision

Cyber AI Forge aims to turn “building an enterprise application” from an ability reserved for professional developers into a creative process that ordinary people can complete with AI.

People bring the ideas, and AI leads the implementation. The project structure and documentation keep AI on track, while clear engineering boundaries let an application grow from an idea into a genuinely usable, maintainable, and extensible system.

## <img src="./forge/website/src/assets/readme-icons/contribute.svg" alt="" width="20" height="20" /> 18 / Contributing

Issues and feature suggestions are welcome, as are stories about applications built with Cyber AI Forge. Before submitting code or making a substantial design change, please read the [project documentation](docs/README.md) and the root [AGENTS.md](AGENTS.md).
