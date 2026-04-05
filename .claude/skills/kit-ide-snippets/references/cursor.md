# Cursor — Rules, Subagents & Skills

Source: Cursor official docs (cursor.com/docs), Context7

## Three Native Layers

Cursor has three distinct mechanisms for agent guidance — all support description-based selection.

---

### 1. Rules (`.cursor/rules/*.mdc`)

Persistent context injected at the start of model context.

```markdown
---
description: Apply when editing TypeScript files
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
---
Rule content here...
```

| Field | Behaviour |
|---|---|
| `alwaysApply: true` | Always injected into every session |
| `alwaysApply: false` + `description` | Cursor Agent decides based on context |
| `globs` | Auto-applied when matching files are in context |

**Current epost-kit output**: `mdc-generator.ts` generates a single rule with `alwaysApply: true` → entire snippet injected every session regardless of context.

---

### 2. Subagents (`.agents/*.md` or `.cursor/agents/*.md`)

Custom agents that Cursor Agent auto-delegates to based on description.

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
readonly: true
---
You are a security expert auditing code for vulnerabilities...
```

Key fields: `name`, `description`, `model` (`inherit` | model ID), `readonly` (restricts write tools).

**Auto-invoked** — Cursor picks the right subagent from descriptions. No explicit user selection required.

---

### 3. Skills (`.agents/skills/*/SKILL.md`)

**Same SKILL.md format as Claude Code.**

```markdown
---
name: api-designer
description: Design RESTful APIs following OpenAPI 3.0 specification.
  Use when designing new API endpoints or reviewing API contracts.
---
# API Designer Skill
...
```

Directory structure:
```
.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        └── references/
```

- Auto-discovered from `.agents/skills/` at Cursor init
- Agent evaluates descriptions, selects based on current context
- Manually invokable via `/` in agent chat

---

## Current State vs Full Parity

| Feature | Claude Code | Cursor (native) | Current epost-kit output |
|---|---|---|---|
| Skills auto-discovery | `.claude/skills/*/SKILL.md` | `.agents/skills/*/SKILL.md` | ❌ Not generated |
| Subagent auto-routing | `Agent tool` dispatch | `.agents/*.md` descriptions | ❌ Not generated |
| Rules / context injection | `skills:` frontmatter | `.cursor/rules/*.mdc` | ✅ `alwaysApply: true` (blunt) |
| Routing table needed | ❌ Anti-pattern | ❌ If skills/agents wired | ⚠ Yes (current workaround) |

**Gap**: Cursor users get everything injected at once. Claude Code users get on-demand skill loading.

---

## Parity Roadmap

Generate `.agents/skills/` and `.agents/*.md` from `packages/` source — same pipeline as `.claude/skills/`:

```
.agents/
├── skills/                          ← generated from packages/*/skills/
│   ├── web-frontend/SKILL.md
│   ├── backend-javaee/SKILL.md
│   └── ...
├── epost-fullstack-developer.md     ← generated from packages/*/agents/
├── epost-debugger.md
└── ...
```

When this is implemented:
- Routing table in `CURSOR.snippet.md` becomes obsolete — descriptions drive selection natively
- `CURSOR.snippet.md` shrinks to project-specific context only (git conventions, tech stack)
- Rules can be split by platform with `globs` for precise injection

## Interim Optimization (Before Parity)

Split by platform using globs instead of one `alwaysApply: true` blob:

```
.cursor/rules/
├── epost-kit-core.mdc        # alwaysApply: true  (agents, routing)
├── epost-kit-web.mdc         # globs: ["**/*.tsx", "**/*.ts", "**/*.scss"]
├── epost-kit-ios.mdc         # globs: ["**/*.swift"]
├── epost-kit-android.mdc     # globs: ["**/*.kt"]
└── epost-kit-backend.mdc     # globs: ["**/*.java"]
```
