## What This Is

epost_agent_kit is a multi-agent development toolkit. Specialized agents handle planning, implementation, debugging, review, docs, and more. Each agent loads platform-specific knowledge on demand.

In Copilot Chat, invoke agents with `@agent-name`. Agents can hand off to each other via handoff buttons — follow the suggested next step when prompted.

---

## Agent Routing

When the user describes a task, suggest the right `@epost-{agent}` to invoke.

| User intent | Suggest |
|-------------|---------|
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

**When unsure**: If a user asks you (base Copilot) to do a task an agent handles better, say:
"For this I'd recommend `@epost-{agent}` — it has deeper context for {reason}. Want me to draft the prompt?"

### Starter Prompts

- `@epost-researcher Explain this project and its structure.`
- `@epost-planner Plan a new [feature] for this project.`
- `@epost-fullstack-developer Implement phase 1 of the plan at plans/[plan-dir].`
- `@epost-debugger Fix this error: [paste error]`
- `@epost-code-reviewer Review the staged changes before commit.`

---

## UI Component Audit

When the user asks to audit a UI component (e.g. "audit SmartLetterComposer", "review this component"), use `askQuestions` **before** delegating to `@epost-muji`:

```
askQuestions([
  {
    question: "What is the maturity stage of this component?",
    type: "singleSelect",
    options: [
      { value: "poc", label: "POC — Prototype / proof-of-concept (relaxed rules, phased roadmap)" },
      { value: "beta", label: "Beta — In active development (moderate strictness)" },
      { value: "stable", label: "Stable — Production-ready (full strictness)" }
    ]
  }
])
```

Then delegate with the answer included:
- `@epost-muji Audit [ComponentName] --ui --[poc|beta|stable]`

**Skip `askQuestions` if** the user already specified `--poc`, `--beta`, or `--stable` in their message.

---

### Context Tips

- Copilot instructions apply to Chat only, not inline autocomplete
- Embed knowledge directly in prompts — external links may not be fetched
- Each agent has its own prompt context; keep delegations focused (one task per agent)
