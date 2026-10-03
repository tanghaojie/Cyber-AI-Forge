# Foundation 文档入口

`docs/foundation/` 保存共享基础设施的现行事实与完整演进证据。该作用域由 Forge 维护并同步到业务平台；下游只能阅读，不直接修改。

2026-07-29 的代码与现行设计构成项目初始版本基线。人类维护者的当前修改和明确指令优先于 AI 推断及历史文档；发现冲突、问题或意图不明时，AI 应保留人类内容并询问下一步。详见根目录 [AGENTS.md](../../AGENTS.md) 和 [ADR-0024](decisions/ADR-0024-human-authored-state-authority.md)。

## AI 最小阅读协议

每次任务按以下顺序建立上下文：

1. 阅读本文件。
2. 检查 [进行中的计划](plans/README.md)，避免重复实施。
3. 从[设计索引](design/README.md)选择与改动直接相关的文档；不要遍历全部设计。
4. 只有需要理解长期取舍时，才从[现行 ADR 索引](decisions/README.md)选择相关记录。
5. 错误码和人工操作分别按需查询 `reference/`、`guides/`；公共模板从 `../templates/` 使用。

跨模块、新模块或架构任务应额外阅读[系统概览](design/system-overview.md)和[模块边界](design/module-boundaries.md)。局部修复只读所属模块设计和直接相关 ADR。

禁止为“先熟悉项目”而递归读取整个作用域。`docs/foundation/archive/**` 不属于默认上下文；只有用户要求历史、排查回归/兼容性、当前文档明确引用历史证据，或准备恢复旧方案时，才先从[归档索引](archive/README.md)定位一至两份文件。

## 当前目录

```text
docs/foundation/
├── design/          # 当前系统与模块设计
├── decisions/       # 仍有效的 ADR
├── plans/active/    # 正在执行的计划
├── ai-logs/         # 按变更类型分类的正在执行任务协作记录
├── guides/          # 人类操作指南，按需阅读
├── reference/       # 当前参考表，按需查询
└── archive/         # 历史证据，默认不读取
```

## 生命周期

| 类型   | 当前区                           | 进入归档的条件         |
| ------ | -------------------------------- | ---------------------- |
| Design | `design/`                        | 被合并、废弃或大幅重写 |
| ADR    | `decisions/`                     | 被后续 ADR 取代        |
| Plan   | `plans/active/`                  | 完成、取消或被取代     |
| AI Log | `ai-logs/<change-type>/YYYY/MM/` | 对应任务结束           |

当前设计始终描述“现在怎样工作”。当前 ADR 只解释仍有效的长期取舍。计划和日志不复制正式结论，任务结束后与历史过程一起归档。详细规则见[分层文档与历史归档](design/documentation-governance.md)。

## 强制规则与命名

根目录 [AGENTS.md](../../AGENTS.md) 定义 Git 暂存区门禁、文档门禁、归档步骤和 AI 提交标记。

- 设计：稳定英文小写名称，如 `backend.md`。
- 计划：`YYYY-MM-DD-<topic>.md`。
- AI 日志：`<change-type>/YYYY/MM/YYYY-MM-DD-<topic>.md`；`<change-type>` 只能是 `chore`、`docs`、`feat`、`fix`、`refactor`、`style`、`test`、`ci`、`build` 或 `revert`。历史日志保留原来的 `YYYY/MM/` 路径。
- 新增 ADR：`ADR-YYYYMMDD-<topic>.md`；日期取创建/接受日期，topic 使用小写 kebab-case。既有 `ADR-NNNN-<topic>.md` 文件和引用保持不变。
- 正文默认中文，代码标识保持原样。

## AI 任务范围归档审查

涉及业务行为、API、数据模型、模块边界、架构、迁移、ADR、计划或文档治理的 AI 任务，首次修改文件前运行：

```text
pnpm docs:archive:check
```

只读问答、代码浏览、格式化、注释和单文件机械改动可以跳过。若任务范围中途扩大，必须在修改相关文件前补运行。命令只读检查 Git 历史、当前文档、活动计划和归档基线，不依赖任何特定 AI 平台。若结果为
`DUE`，AI 应在报告指定的 `docs/<scope>/plans/active/` 创建或继续带有 `type: documentation-archive-review` 的归档审查计划；
`IN_PROGRESS` 表示同一作用域已有共享任务但 CI 仍等待完成；`UPSTREAM_REQUIRED` 表示下游发现只读 Foundation 问题，必须回 Forge 修复；`BLOCKED` 表示必须请求维护者确认。

合并前或 CI 使用以下入口，只要 managed scope 仍然 due、存在上游必修问题或处于 `BLOCKED` 就返回失败：

```text
pnpm docs:archive:check:ci
```

归档审查不是单纯移动旧文件。AI 必须先通过代码、测试、API 契约、数据库迁移和 Git 历史补充当前
Design/ADR，再将已被当前事实取代的 Design、文档、ADR、计划和 AI 协作记录归入 `archive/`。

机器可读的共享触发策略位于 `archive/archive-policy.json`；仓库角色由根 `.archive-audit.json` 声明，Foundation、Forge、Platform 基线分别位于各自 `archive/archive-ledger.json`。下游只推进 Platform ledger。

- [PRISM 下游升级指南](guides/prism-upgrade.md)：共享主题包、Integration 依赖合并及人工验收。
