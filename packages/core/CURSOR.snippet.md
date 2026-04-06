## What This Is

epost_agent_kit is a multi-agent development toolkit. Specialized agents handle planning, implementation, debugging, review, docs, and more. Each agent loads platform-specific rules on demand.

In Cursor, invoke agents with `@agent-name` in chat. Rules from `.cursor/rules/` inject context automatically when relevant files are edited.

---

## Agent Routing

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

---

## Context Rules

- `.cursor/rules/epost-kit.mdc` — always active (base routing, applies to all files)
- `.cursor/rules/platform-web.mdc` — auto-applies for `.ts`, `.tsx`, `.scss`, `.css`
- `.cursor/rules/platform-ios.mdc` — auto-applies for `.swift`
- `.cursor/rules/platform-android.mdc` — auto-applies for `.kt`, `.kts`
- `.cursor/rules/platform-backend.mdc` — auto-applies for `.java`
- `.cursor/rules/design-system.mdc` — always active (design system guidance)
- `.cursor/rules/a11y.mdc` — always active (accessibility conventions)

Use `@rule-name` in chat to manually apply a specific rule.

---

## Routing Priorities

1. TypeScript/build errors in context → route to Fix first
2. Staged files → boost Review intent
3. Active plan in `./plans/` → boost Build ("continue" → implement next phase)
4. Ambiguous → ask user (max 1 question)

---

## Limitations

- Cursor's Task tool may not work in `.cursor/agents/` — delegate via chat, not programmatic dispatch
- No hooks or lifecycle events — agents cannot run automatically on file save
- Each agent invocation starts fresh — include relevant context in your prompt
