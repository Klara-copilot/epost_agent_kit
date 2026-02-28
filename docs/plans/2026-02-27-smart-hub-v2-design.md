# Smart Hub v2 — `/epost` Intelligence Upgrade

**Date**: 2026-02-27
**Status**: Design approved, pending implementation
**Approach**: B — Hub + Context Skill (modular enhancement)

---

## Problem

The `/epost` smart hub uses static keyword matching with a flat lookup table (14 intent categories). It has no awareness of current work context, cannot chain multi-step workflows, and shows a static discovery menu of all 51 commands regardless of relevance.

## Goals

1. **Context awareness** — the hub should know what you're working on (git state, files, errors, platform) and use it to inform routing
2. **Smarter intent detection** — semantic categories with fuzzy matching, context boost, and multi-intent detection
3. **Workflow chaining** — compound requests ("plan then build") delegated to orchestrator
4. **Contextual discovery** — show relevant actions, not all commands

## Architecture

```
User → /epost [arguments]
         │
         ├─ 1. Gather Context Snapshot (hub-context skill)
         │     ├── Git state (branch, staged/unstaged files, recent commits)
         │     ├── Platform detection (file extensions, directory, project signals)
         │     ├── Error signals (build/test failures, type errors)
         │     └── Session hints (active plan files, last command)
         │
         ├─ 2. Parse Intent(s) from arguments
         │     ├── Semantic category matching (not just keywords)
         │     ├── Context boost (error signals boost Fix category, etc.)
         │     ├── Multi-intent detection (conjunctions: "and", "then")
         │     └── Variant auto-selection (fast/deep/parallel from complexity)
         │
         ├─ 3. Route
         │     ├── No arguments → Contextual Discovery Menu
         │     ├── Single intent + clear platform → Direct route (fast path)
         │     └── Multi-intent / ambiguous / project-level → Delegate to orchestrator
         │
         └─ 4. Report routing decision to user
```

### Delegation: Hub vs Orchestrator

| Scenario | Hub handles directly | Delegates to orchestrator |
|----------|---------------------|--------------------------|
| Single clear intent, clear platform | `/epost fix the login bug` → `/fix:fast` | — |
| Multi-intent chain | — | `/epost plan and build notifications` |
| Ambiguous platform | — | `/epost fix the login` (web? iOS?) |
| Project oversight | — | `/epost status of the auth feature` |
| Multi-platform task | — | `/epost test everything` |

---

## Component 1: `hub-context` Skill

**Path**: `.claude/skills/hub-context/SKILL.md`
**Type**: Passive skill loaded by the hub command
**Frontmatter**: `user-invocable: false`, `agent-affinity: [epost-orchestrator]`

### Context Snapshot Protocol

The skill defines what context to gather and how:

```
Context Snapshot:
├── Git State
│   ├── Current branch name (git branch --show-current)
│   ├── Staged files (git diff --cached --name-only)
│   ├── Unstaged changes (git diff --name-only)
│   ├── Untracked files (git ls-files --others --exclude-standard | head -20)
│   ├── Recent commits (git log --oneline -3)
│   └── Merge conflict status (git diff --name-only --diff-filter=U)
│
├── Platform Detection
│   ├── Dominant extensions in changed files (.tsx → web, .swift → iOS, etc.)
│   ├── Current working directory → module detection
│   └── Project structure signals (package.json, Podfile, build.gradle)
│
├── Error Signals
│   ├── Recent build/test output (check for failure patterns in terminal)
│   ├── TypeScript errors (npx tsc --noEmit 2>&1 | head -5, if web context)
│   └── Lint warnings count
│
└── Session Hints
    ├── Active plan files (ls ./plans/*.md 2>/dev/null)
    └── .epost-data/ state (if exists)
```

### Context Summary Format

The skill outputs a structured summary the hub can reason about:

```
[Context] branch: feature/notifications | platform: web
[Context] staged: 3 files (.tsx) | unstaged: 1 file (.ts)
[Context] errors: 2 TypeScript errors in src/components/
[Context] plan: notifications-plan.md (in-progress)
```

---

## Component 2: Enhanced Intent Detection

**Modified file**: `.claude/commands/epost.md`

### Semantic Intent Categories

Replace the flat keyword table with categorized intent groups that include context boost rules:

| Category | Signal Words | Context Boost | Default Route |
|----------|-------------|---------------|---------------|
| **Build** | cook, implement, build, create, add, scaffold, make | Has plan file | `/cook:fast` or orchestrator |
| **Fix** | fix, debug, error, crash, broken, failing, wrong | Has error signals | `/fix:{variant}` by error type |
| **Plan** | plan, design, architect, think about, spec | Complex request | `/plan:fast` or `/plan:deep` |
| **Test** | test, coverage, validate, verify, check tests | Has test failures | Platform `/test` |
| **Review** | review, check code, audit, look at, inspect | Has staged changes | `/review:code` |
| **Git** | commit, push, pr, merge, branch, release | Has staged changes | `/git:{action}` |
| **Docs** | docs, document, write docs, readme | — | `/docs:init` or `/docs:update` |
| **Explore** | scout, search, find, explore, where is, show me | — | `epost-scout` |
| **Knowledge** | which agent, list agents/skills/commands, what's our, convention, kit | Internal ref | `epost-guide` |
| **Research** | research, what is [ext], how does [ext], best practice | External tech | `epost-researcher` |
| **A11y** | a11y, accessibility, wcag, screen reader | — | `/review:a11y` or `/fix:a11y` |
| **Brainstorm** | brainstorm, evaluate, compare, think about options | — | `epost-brainstormer` |

### Context Boost Rules

When the context snapshot contains signals that match a category, that category gets routing priority even with weaker keyword matches:

| Context Signal | Boosts Category | Example |
|---------------|----------------|---------|
| TypeScript/build errors detected | Fix | "what's wrong?" → `/fix:types` |
| Staged files present | Git or Review | "I'm done" → `/git:commit` |
| Active plan file exists | Build | "continue" → `/cook:fast` with plan |
| Test failures detected | Fix or Test | "help" → `/fix:test` |
| Feature branch, no changes | Build or Plan | "what's next?" → continue from plan |
| Clean main branch | Plan or Explore | "what should I do?" → show menu |

### Fuzzy Matching

Instead of exact keyword matching:
- "my tests are broken" → matches Fix ("broken") AND Test ("tests"). Context boost breaks tie.
- "I need to change the button" → matches Build ("change" ≈ "modify" ≈ "implement").
- "what happened?" → context boost determines: if errors → Fix; if clean → Explore.

### Multi-Intent Detection

Detect compound requests via conjunctions and sequential language:

| Pattern | Detected Chain | Delegation |
|---------|---------------|------------|
| "plan and build X" | [Plan, Build] | → orchestrator |
| "fix the bug then commit" | [Fix, Git] | → orchestrator |
| "test and review" | [Test, Review] | → orchestrator |
| "plan, implement, and test the feature" | [Plan, Build, Test] | → orchestrator |

Detection triggers: "and", "then", "after that", "followed by", comma-separated actions, semicolons.

### Variant Auto-Selection

Instead of always defaulting to `:fast`:

| Complexity Signal | Variant |
|-------------------|---------|
| Single file + clear error | `:fast` |
| 2-5 files, one module | `:fast` |
| Multiple modules, some unknowns | `:deep` |
| Multi-platform or needs research | `:deep` or `:parallel` |
| Has existing plan with phases | `:parallel` (follow plan phases) |

---

## Component 3: Orchestrator Delegation Protocol

**Modified file**: `.claude/commands/epost.md` (delegation section)
**Modified file**: `.claude/agents/epost-orchestrator.md` (receiving handoffs)

### Handoff Format

When delegating to the orchestrator, the hub provides:

```
## Hub Handoff

**Original request**: "plan and build the notification system"
**Intent chain**: [Plan, Build]
**Suggested commands**: [/plan:fast, /cook:fast]
**Context**:
  - Branch: feature/notifications
  - Platform: web (detected from .tsx files)
  - Staged: none
  - Plan: none (will be created by first step)
**Delegation reason**: Multi-intent chain detected
```

### Orchestrator Receives

The orchestrator's system prompt is updated to recognize hub handoffs and execute intent chains sequentially, reporting back after each step.

---

## Component 4: Contextual Discovery Menu

**Modified in**: `.claude/commands/epost.md` (discovery menu section)

When invoked with no arguments, the hub gathers context and shows relevant actions:

### Active Work Context

```markdown
## Suggested Actions

You're on `feature/notifications` with 3 staged web files and an active plan.

| # | Action | Command | Why |
|---|--------|---------|-----|
| 1 | Continue implementing | `/cook:fast` | Active plan: notifications-plan.md |
| 2 | Commit your changes | `/git:commit` | 3 files staged |
| 3 | Review before commit | `/review:code` | Staged changes ready |
| 4 | Run web tests | `/web:test` | Verify before commit |

> Type a number or describe what you want to do. Full command list: `/epost help`
```

### Error Context

```markdown
## Suggested Actions

Found 2 TypeScript errors and 1 failing test on `feature/auth`.

| # | Action | Command | Why |
|---|--------|---------|-----|
| 1 | Fix type errors | `/fix:types` | 2 errors in src/auth/ |
| 2 | Fix failing test | `/fix:test` | auth.test.ts failing |
| 3 | Debug the issue | `/fix:deep` | Investigate root cause |

> Type a number or describe what you want to do.
```

### Clean State

```markdown
## What do you want to do?

No active work detected on `main`.

| Action | Command |
|--------|---------|
| Plan a feature | `/epost plan ...` |
| Build something | `/epost build ...` |
| Explore codebase | `/epost scout ...` |
| Ask about the kit | `/epost which agent...` |
| Research tech | `/epost research ...` |
```

---

## Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| Create | `.claude/skills/hub-context/SKILL.md` | Context sensing protocol |
| Modify | `.claude/commands/epost.md` | Rewrite with semantic intent detection, context boost, multi-intent, contextual menu, orchestrator delegation |
| Modify | `.claude/agents/epost-orchestrator.md` | Add hub handoff reception protocol |
| Modify | `.claude/skills/skill-index.json` | Add hub-context entry |
| Modify | `.epost-metadata.json` | Register new files |

---

## Phasing

### Phase 1 (This implementation)
- Context sensing skill
- Semantic intent detection with context boost
- Multi-intent detection with orchestrator delegation
- Contextual discovery menu

### Phase 2 (Future)
- Persistent memory via `.epost-data/` (frequent commands, user patterns)
- Learning from routing corrections ("no, I meant...")
- Confidence scoring with confirmation for low-confidence routes

---

## Verification

1. `/epost` (no args, with staged .tsx files) → shows contextual menu suggesting commit/review
2. `/epost` (no args, with TypeScript errors) → shows menu suggesting fix:types
3. `/epost what's wrong?` (with errors) → routes to fix, not to guide
4. `/epost plan and build notifications` → detects multi-intent, delegates to orchestrator
5. `/epost fix the bug then commit` → detects chain, delegates to orchestrator
6. `/epost fix the login timeout` → single intent, routes directly to `/fix:fast`
7. `/epost which agent handles testing?` → routes to guide (existing behavior preserved)
8. `/epost what is React Server Components?` → routes to researcher (existing behavior preserved)
9. `/epost continue` (with active plan) → routes to `/cook:fast` with plan context
