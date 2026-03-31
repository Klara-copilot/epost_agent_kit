## What This Is

epost_agent_kit is a multi-agent development toolkit for Claude Code. Specialized agents load platform-specific skills on demand and follow shared orchestration rules. The main conversation is always the orchestrator — it dispatches agents via Agent tool and merges results.

---

## Routing

On every user prompt, sense context before acting:
1. Check git state (branch, staged/unstaged files)
2. Detect platform from file extensions (`.tsx`→web, `.swift`→ios, `.kt`→android, `.java`→backend)
3. Check for active plans in `./plans/`
4. Route to best-fit agent based on intent + context

### Prompt Classification

- **Dev task** (action/problem/question about code) → route via intent table below
- **Kit question** ("which agent", "list skills", "our conventions") → answer directly using CLAUDE.md + skill-index
- **External tech question** ("how does React...", "what is gRPC") → `epost-researcher`
- **Conversational** (greetings, opinions, clarifications) → respond directly

### Intent Map

| Intent | Natural prompts (examples) | Routes To |
|--------|---------------------------|-----------|
| Build / Create | "add a button", "implement login", "make X work", "continue the plan" | `epost-fullstack-developer` via Agent tool |
| Fix / Debug | "something is broken", "this crashes", "why does X happen", "it's not working" | `epost-debugger` via Agent tool |
| Plan / Design | "how should we build X", "let's plan", "what's the approach for" | `epost-planner` via Agent tool |
| Ideate / Brainstorm | "brainstorm", "should we", "help me think", "which approach", "compare options", "architecture decision" | `epost-brainstormer` via Agent tool |
| Research | "how does X work", "best practices for", "compare A vs B" | `epost-researcher` via Agent tool |
| Review / Audit | "check my code", "is this good", "review before merge", "audit this" | `epost-code-reviewer` via Agent tool |
| Test | "add tests", "is this covered", "validate this works" | `epost-tester` via Agent tool |
| Docs | "document this", "update the docs", "write a spec" | `epost-docs-manager` via Agent tool |
| Git | "commit", "push", "create a PR", "ship it", "done" | `epost-git-manager` via Agent tool |
| Onboard | "what is this project", "I'm new", "get started" | `/get-started` skill |

**Fuzzy matching** — classify by verb type when no exact signal word:
- Creation verbs (add, make, create, build, set up) → Build
- Problem verbs (broken, wrong, failing, slow, crash) → Fix/Debug
- Question verbs (how, why, what, should, compare) → Research or Plan
- Ideation verbs (brainstorm, debate, explore, weigh, consider, what if) → Ideate/Brainstorm
- Quality verbs (check, review, improve, clean up, refactor, simplify) → Review
- Completion verbs (done, ship, finished, ready, merge) → Git
- Still ambiguous → infer from git context (staged files → Review, active plan → Build, error in prompt → Fix)

**Web-specific examples**: "this component doesn't render" → Fix, "add dark mode" → Build, "page is slow" → Debug, "add a toast notification" → Build, "the CSS is off" → Fix, "update the API endpoint" → Build, "check the bundle size" → Review, "make login faster" → Debug

**Less common intents**: scaffold → `/bootstrap`, convert → `/convert`, design/UI → `epost-muji`, architecture debate → `epost-brainstormer`

### Routing Rules

1. Explicit slash command → execute directly, skip routing
2. TypeScript/build errors in context → route to Fix first
3. Staged files → boost Review or Git intent
4. Active plan exists → boost Build ("continue" → cook)
5. Merge conflicts → suggest fix/resolve
6. Ambiguous after context boost → ask user (max 1 question)
7. All delegations follow `core/references/orchestration.md`
8. **Web context boost**: `.tsx`/`.ts`/`.scss`/`.css` files in `git diff` → auto-set platform=web, load web-frontend skill
9. **Git operations** (commit, push, PR, done, ship) → ALWAYS delegate to `epost-git-manager` via Agent tool. Never handle inline.
10. **Build, Fix, Plan, Test intents** → ALWAYS dispatch via Agent tool. Never execute inline in main context.
11. **Compound git intent**: "commit and push" → dispatch `epost-git-manager` with `--push` (single agent call)

---

## Orchestration

**Single intent** → spawn the matched agent directly via Agent tool.

**Multi-intent** ("plan and build X", "research then implement") → orchestrator decomposes inline and spawns agents in sequence.

**Parallel work** (3+ independent tasks, cross-platform) → use `subagent-driven-development` skill from main context.

**Subagent constraint**: Subagents cannot spawn further subagents. Multi-agent workflows must be orchestrated from the main conversation. Skills that need multi-agent dispatch must NOT use `context: fork`.

**Hybrid audits** (klara-theme code): Orchestrated from main context via `/audit` skill. Dispatch muji (Template A+) first, then code-reviewer with muji's report. Never free-form prompt muji — use structured delegation templates from `audit/references/delegation-templates.md`.

**Escalation**: 3 consecutive failures → surface findings to user. Ambiguous request → ask 1 question max.

See `core/references/orchestration.md` for full protocol.
