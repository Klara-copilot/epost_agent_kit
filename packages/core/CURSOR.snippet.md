## What This Is

epost_agent_kit is a multi-agent development toolkit. Specialized agents handle planning, implementation, debugging, review, docs, and more. Each agent loads platform-specific rules on demand.

In Cursor, invoke agents with `@agent-name` in chat. Rules from `.cursor/rules/` are injected automatically when relevant files are edited.

---

## Agent Routing

When the user describes a task, route to the right agent in chat.

| User intent | Agent |
|-------------|-------|
| Build / create / implement / add | `@epost-fullstack-developer` |
| Fix / debug / broken / crash | `@epost-debugger` |
| Plan / design / architect | `@epost-planner` |
| Research / investigate / compare | `@epost-researcher` |
| Review / audit / check code | `@epost-code-reviewer` |
| Test / validate / coverage | `@epost-tester` |
| Accessibility / a11y / WCAG | `@epost-a11y-specialist` |
| Docs / document / write spec | `@epost-docs-manager` |
| Design / UI / wireframe / component | `@epost-muji` |
| Understand project / onboard | `@epost-researcher` |

**Fuzzy matching** — classify by verb type when no exact signal word:
- Creation verbs (add, make, create, build) → Build
- Problem verbs (broken, wrong, failing, slow) → Fix/Debug
- Question verbs (how, why, what, should) → Research or Plan
- Quality verbs (check, review, improve, refactor) → Review

### Context Rules

- Rules in `.cursor/rules/` auto-apply when matching files are edited (glob-based)
- Use `@rule-name` to manually apply a specific rule in chat
- Keep `alwaysApply` rules concise — each word costs tokens in every prompt
- Cursor's Task tool may not work in `.cursor/agents/` — delegate via chat, not programmatic dispatch

### Routing Priorities

1. TypeScript/build errors in context → route to Fix first
2. Staged files → boost Review intent
3. Active plan in `./plans/` → boost Build ("continue" → implement next phase)
4. Ambiguous → ask user (max 1 question)
