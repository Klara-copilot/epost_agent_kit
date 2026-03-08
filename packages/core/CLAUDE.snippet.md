## Smart Routing

On every user prompt involving a dev task, sense context before acting:
1. Check git state (branch, staged/unstaged files)
2. Detect platform from changed file extensions (`.tsx`→web, `.swift`→ios, `.kt`→android, `.java`→backend)
3. Check for active plans in `./plans/`
4. Route to best-fit skill based on intent + context

**This applies to every prompt — not just `/epost` invocations.**

### Prompt Classification
- **Dev task** (action verbs: cook, fix, plan, test, debug, etc.) → route via intent map below
- **Kit question** ("which agent", "list skills", "our conventions") → route to `epost-project-manager`
- **External tech question** ("how does React...", "what is gRPC") → route to `epost-researcher`
- **Conversational** (greetings, opinions, clarifications) → respond directly, no routing

### Intent → Skill Map

| Intent | Signal Words | Routes To |
|--------|-------------|-----------|
| Build | cook, implement, build, create, add, make, continue | Spawn `epost-fullstack-developer` via Task tool |
| Fix | fix, broken, error, crash, failing, what's wrong | Spawn `epost-debugger` via Task tool |
| Plan | plan, design, architect, spec, roadmap | Spawn `epost-planner` via Task tool (`/plan` skill) |
| Research | research, investigate, compare, best practices | Spawn `epost-researcher` via Task tool |
| Test | test, coverage, validate, verify | Spawn `epost-tester` via Task tool |
| Debug | debug, trace, inspect, diagnose | Spawn `epost-debugger` via Task tool |
| Review | review, check code, audit | Spawn `epost-code-reviewer` via Task tool |
| Git | commit, push, pr, merge, done, ship | `/git --commit`, `/git --push`, `/git --pr` |
| Docs | docs, document, write docs, migrate docs, reorganize docs, scan docs, orphaned files, KB structure, docs audit, knowledge base | Spawn `epost-docs-manager` via Task tool |
| Scaffold | bootstrap, init, scaffold, new project, new module | `/bootstrap` |
| Convert | convert, prototype, migrate | `/convert` |
| A11y | a11y, accessibility, wcag | `/fix --a11y` or `/review --a11y` |
| Onboard | get started, begin, onboard, new to project, what is this | `/get-started` |
| Journal | journal, postmortem, what went wrong, failure log | `epost-journal-writer` (direct) |
| Simplify | simplify, refactor, clean up, reduce complexity | Spawn `epost-fullstack-developer` via Task tool |
| MCP | mcp, tools, discover tools, rag query | `epost-mcp-manager` (direct) |
| Design | design, ui, ux, wireframe, screenshot to code, visual asset | `epost-muji` (direct) |

> **Delegation rule**: When routing to a skill with `context: fork`, use the **Task tool** to spawn the skill's `agent:` value. Never execute fork-context skills inline.

### Context Boost Rules
- TypeScript/build errors detected → always route to `/fix` first
- Staged files present → boost Git or Review intent
- Active plan file exists → boost Build intent ("continue" → `/cook`)
- Merge conflicts → suggest fix/resolve
- Feature branch with no changes → boost Plan or Build

### Multi-Step Workflow Detection
- Multi-intent ("plan and build X") → `epost-project-manager` → `workflow-feature-development`
- Research then plan ("research X, then plan") → `epost-project-manager` → spawns epost-researcher (report) → epost-planner reads report → creates plan
- Bug report with context → `epost-debugger` → `workflow-bug-fixing`
- New project/module → `workflow-project-init`
- Architecture question ("should we migrate...") → `epost-brainstormer` → `workflow-architecture-review`
- Parallel work (3+ independent tasks) → `subagent-driven-development` skill

### Rules
- If user types a slash command explicitly → execute it directly, skip routing
- If ambiguous → use context boost to break tie; if still ambiguous → ask user (max 1 question)
- If multi-intent ("plan and build X") → delegate to `epost-project-manager`
- All agent delegations follow `core/references/orchestration.md` protocol

---

## Using Agents in Copilot Chat

If you are GitHub Copilot (not Claude Code), you cannot spawn agents via Task tool.
Instead: **suggest the right `@agent` for the user to invoke in Copilot Chat.**

When the user asks you something, respond by suggesting: "Use `@agent-name` for this — here's how:"

| User asks... | Suggest |
|-------------|---------|
| "Help me understand this project / module / file" | `@epost-researcher` |
| "I'm new to React/Next.js, explain how X works" | `@epost-researcher` |
| "Plan a new feature / page / module" | `@epost-planner` |
| "Implement / build / create / add this" | `@epost-fullstack-developer` |
| "Fix this error / bug / crash" | `@epost-debugger` |
| "Review my code before committing" | `@epost-code-reviewer` |
| "Check accessibility / a11y / keyboard nav" | `@epost-a11y-specialist` |
| "Write / update documentation" | `@epost-docs-manager` |
| "Design a component / UI / layout" | `@epost-muji` |
| "What agent should I use for X?" | Answer directly using this table |

**Starter prompts to share with users:**
- `@epost-researcher I'm new here. Explain this project and its structure.`
- `@epost-planner Plan a new [feature] for this project.`
- `@epost-fullstack-developer Implement phase 1 of the plan at plans/[plan-dir].`
- `@epost-debugger Fix this error: [paste error]`

**Self-guide rule**: If a user asks you (base Copilot) to do a task that an agent handles better, say:
"For this I'd recommend `@epost-[agent]` — it has deeper context for [reason]. Want me to draft the prompt?"
