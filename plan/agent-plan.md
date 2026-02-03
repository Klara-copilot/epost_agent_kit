# epost_agent_kit — Restructuring Plan

## Goal

Restructure the existing epost_agent_kit from flat agent layout to a **parent-child delegation architecture**: global agents orchestrate and route, platform agents (web, ios, android) execute. Inspired by claudekit-main patterns. Rename agents to industry-standard terms.

---

## Architecture: Parent-Child Delegation

```
User → /command → Global Agent (orchestrate/route) → Platform Agent (execute)
```

**Global agents** own the workflow (plan, delegate, verify). They never write platform-specific code directly — they spawn platform agents.

**Platform agents** own execution within their domain (web, ios, android). They use platform-specific skills and tools.

```
Global (orchestrate)          Platform (execute)
┌─────────────┐         ┌──────────────────────┐
│ orchestrator │────────►│ web/implementer      │
│ architect    │────────►│ web/tester           │
│ implementer  │────────►│ web/designer         │
│ reviewer     │────────►│ ios/implementer      │
│ researcher   │         │ ios/tester           │
│ debugger     │────────►│ ios/simulator        │
│ tester       │────────►│ android/implementer  │
│ documenter   │         │ android/tester       │
│ git-manager  │         └──────────────────────┘
└─────────────┘
```

---

## Agent Renaming Map

| Current File | Action | New File | Role Change |
|---|---|---|---|
| `planner.md` | RENAME | `architect.md` | Becomes design/planning orchestrator |
| `fullstack-developer.md` | RENAME | `implementer.md` | Becomes delegator → platform implementers |
| `code-reviewer.md` | RENAME | `reviewer.md` | Becomes delegator → platform reviewers |
| `docs-manager.md` | RENAME | `documenter.md` | Keep global (docs are cross-platform) |
| `researcher.md` | KEEP | `researcher.md` | Already global |
| `debugger.md` | KEEP | `debugger.md` | Becomes delegator → platform debuggers |
| `tester.md` | KEEP | `tester.md` | Becomes delegator → platform testers |
| `git-manager.md` | KEEP | `git-manager.md` | Already global (git is cross-platform) |
| `project-manager.md` | MERGE | → into `orchestrator.md` | PM responsibilities absorbed |
| `performance-analyst.md` | MERGE | → into `reviewer.md` | Perf analysis becomes part of review |
| `ui-designer.md` | MOVE | → `web/designer.md` | Platform-specific |
| (new) | CREATE | `orchestrator.md` | Top-level router + PM duties |

---

## Target Directory Structure

### Agents

```
.claude/agents/
├── orchestrator.md          # NEW: routes tasks, detects platform, delegates
├── architect.md             # RENAMED from planner.md: plans, designs, researches
├── implementer.md           # RENAMED from fullstack-developer.md: delegates to platform
├── reviewer.md              # RENAMED from code-reviewer.md + performance-analyst.md
├── researcher.md            # KEEP: global research, context gathering
├── debugger.md              # KEEP: delegates to platform debuggers
├── tester.md                # KEEP: delegates to platform testers
├── documenter.md            # RENAMED from docs-manager.md
├── git-manager.md           # KEEP: cross-platform git operations
│
├── web/                     # NEW platform directory
│   ├── implementer.md       # Next.js, React, Tailwind, shadcn
│   ├── tester.md            # Vitest, Playwright, Testing Library
│   └── designer.md          # FROM ui-designer.md: shadcn, Figma, a11y
│
├── ios/                     # NEW platform directory
│   ├── implementer.md       # Swift 6, SwiftUI, UIKit (content from ios-developer.agent.md)
│   ├── tester.md            # XCTest, XCUITest
│   └── simulator.md         # XcodeBuildMCP simulator management
│
└── android/                 # NEW platform directory (skeleton)
    ├── implementer.md       # Kotlin, Jetpack Compose
    └── tester.md            # JUnit, Espresso
```

### Commands

```
.claude/commands/
├── core/                    # Global commands (KEEP, update for delegation)
│   ├── plan.md              # UPDATE: → architect agent
│   ├── cook.md              # UPDATE: → orchestrator → platform/implementer
│   ├── test.md              # UPDATE: → orchestrator → platform/tester
│   ├── debug.md             # UPDATE: → orchestrator → platform/debugger
│   ├── ask.md               # KEEP: → researcher
│   └── bootstrap.md         # KEEP: → orchestrator
│
├── web/                     # NEW
│   ├── cook.md              # → web/implementer directly
│   ├── test.md              # → web/tester directly
│   └── design.md            # → web/designer directly
│
├── ios/                     # EXISTS (update agent references)
│   ├── cook.md              # → ios/implementer
│   ├── test.md              # → ios/tester
│   ├── debug.md             # → debugger → ios context
│   └── simulator.md         # → ios/simulator
│
├── android/                 # NEW (skeleton)
│   ├── cook.md              # → android/implementer
│   └── test.md              # → android/tester
│
├── fix/                     # KEEP as-is
├── git/                     # KEEP as-is
├── docs/                    # KEEP as-is
└── design/                  # KEEP as-is
```

### Skills (reorganize by platform)

```
.claude/skills/
├── planning/                # KEEP: global
├── research/                # KEEP: global
├── debugging/               # KEEP: global
├── databases/               # KEEP: shared across platforms
├── docker/                  # KEEP: shared
│
├── web/                     # NEW grouping (move existing skills)
│   ├── nextjs/              # MOVE from skills/nextjs/
│   ├── frontend-development/# MOVE from skills/frontend-development/
│   ├── backend-development/ # MOVE from skills/backend-development/
│   ├── shadcn-ui/           # MOVE from skills/shadcn-ui/
│   └── better-auth/         # MOVE from skills/better-auth/
│
├── ios/                     # KEEP structure
│   └── ios-development/     # MOVE from skills/ios-development/
│
└── android/                 # NEW (skeleton)
    └── android-development/ # NEW SKILL.md
```

### Rules (NEW — inspired by claudekit-main)

```
.claude/rules/
├── primary-workflow.md          # Adapted from claudekit: plan→implement→test→review→integrate
├── development-rules.md         # YAGNI/KISS/DRY, file naming, file size, code quality
├── orchestration-protocol.md    # Delegation context, sequential vs parallel, platform routing
└── documentation-management.md  # Plans structure, docs updates, changelog
```

### Workflows (update for platform routing)

```
.claude/workflows/
├── feature-development.md   # UPDATE: add platform detection + routing
├── bug-fixing.md            # UPDATE: add platform detection + routing
└── project-init.md          # KEEP as-is
```

### Multi-platform sync targets

```
.github/agents/                  # Copilot agents
├── ios-developer.agent.md       # EXISTS: update content
├── web-developer.agent.md       # NEW
└── android-developer.agent.md   # NEW (skeleton)

AGENTS.md                        # NEW: for Cursor (all agents summarized)
```

---

## Implementation Phases

### Phase 1: Rules foundation

Create `.claude/rules/` — these govern all agent behavior.

| File | Source |
|---|---|
| `.claude/rules/primary-workflow.md` | Adapt from claudekit-main, add platform routing |
| `.claude/rules/development-rules.md` | Adapt from claudekit-main |
| `.claude/rules/orchestration-protocol.md` | Adapt from claudekit-main, add parent→child delegation |
| `.claude/rules/documentation-management.md` | Adapt from claudekit-main |

### Phase 2: Global agents (rename + create orchestrator)

| Action | File |
|---|---|
| CREATE | `.claude/agents/orchestrator.md` — absorbs project-manager duties, adds platform detection and routing |
| RENAME+REWRITE | `planner.md` → `.claude/agents/architect.md` |
| RENAME+REWRITE | `fullstack-developer.md` → `.claude/agents/implementer.md` — add delegation logic |
| RENAME+REWRITE | `code-reviewer.md` → `.claude/agents/reviewer.md` — absorb performance-analyst |
| RENAME+REWRITE | `docs-manager.md` → `.claude/agents/documenter.md` |
| REWRITE | `.claude/agents/researcher.md` — update for platform-aware context |
| REWRITE | `.claude/agents/debugger.md` — add delegation to platform debuggers |
| REWRITE | `.claude/agents/tester.md` — add delegation to platform testers |
| KEEP | `.claude/agents/git-manager.md` — minor updates only |
| DELETE | `.claude/agents/project-manager.md` (merged into orchestrator) |
| DELETE | `.claude/agents/performance-analyst.md` (merged into reviewer) |
| DELETE | `.claude/agents/ui-designer.md` (moved to web/designer) |

### Phase 3: Platform agents

**Web platform** (from existing skills + ui-designer content):
- `.claude/agents/web/implementer.md` — Next.js, React, Tailwind, shadcn expertise
- `.claude/agents/web/tester.md` — Vitest, Playwright, Testing Library
- `.claude/agents/web/designer.md` — from ui-designer.md + Figma workflow

**iOS platform** (from existing ios-developer.agent.md + ios skills):
- `.claude/agents/ios/implementer.md` — Swift 6, SwiftUI, UIKit, XcodeBuildMCP
- `.claude/agents/ios/tester.md` — XCTest, XCUITest, coverage
- `.claude/agents/ios/simulator.md` — simulator management via MCP

**Android platform** (skeleton):
- `.claude/agents/android/implementer.md` — Kotlin, Jetpack Compose
- `.claude/agents/android/tester.md` — JUnit, Espresso

### Phase 4: Commands update

- Update all `/core` commands to use new agent names and delegation pattern
- Create `/web` command directory (cook, test, design)
- Update `/ios` commands to reference ios/ platform agents
- Create `/android` command directory (cook, test) as skeleton

### Phase 5: Skills reorganization

- Create `skills/web/` directory, move: nextjs, frontend-development, backend-development, shadcn-ui, better-auth
- Move `skills/ios-development/` → `skills/ios/ios-development/`
- Create `skills/android/android-development/SKILL.md` (skeleton)
- Keep global skills in place: planning, research, debugging, databases, docker

### Phase 6: Workflows + settings update

- Update `feature-development.md` and `bug-fixing.md` with platform routing
- Update `.claude/settings.json` to reference new paths
- Update `CLAUDE.md` with new architecture, rules references, delegation protocol
- Update `README.md`

### Phase 7: Multi-platform sync

- Create `AGENTS.md` (Cursor) summarizing all agents
- Create `.github/agents/web-developer.agent.md` (Copilot)
- Update `.github/agents/ios-developer.agent.md`
- Create `.github/agents/android-developer.agent.md` (skeleton)

---

## Key Design Decisions

1. **Global agents delegate, never execute platform code** — orchestrator detects platform from context/user input and routes to the right platform agent
2. **Platform agents are self-contained** — each has its own skills, tools, and conventions. No cross-platform assumptions
3. **Commands at both levels** — `/cook` (global, auto-detects platform) and `/web:cook` (explicit platform bypass)
4. **Skills grouped by platform** — shared skills (databases, docker) stay at root, platform skills go under platform dirs
5. **Rules are global** — all agents follow the same rules. Platform-specific conventions live in the platform agent prompts
6. **Android as skeleton** — created for structure completeness, populated with real content later

---

## Files to Modify/Create (summary)

**CREATE (new files):** ~20 files
- 4 rules, 1 orchestrator agent, 8 platform agents, 3 web commands, 2 android commands, AGENTS.md, 2 copilot agents

**RENAME+REWRITE:** ~5 files
- architect, implementer, reviewer, documenter + update 4 existing agents

**MOVE:** ~6 skill directories
- 5 web skills into web/, 1 ios skill into ios/

**DELETE:** 3 files
- project-manager.md, performance-analyst.md, ui-designer.md

**UPDATE:** ~15 files
- Core commands, iOS commands, workflows, settings.json, CLAUDE.md, README.md

---

## Verification

1. Confirm all global agent files exist and reference delegation to platform agents
2. Confirm all platform agent files exist with platform-specific expertise
3. Run `/core:cook` — verify it asks for or detects platform, then delegates
4. Run `/web:cook` — verify it routes directly to web/implementer
5. Run `/ios:cook` — verify it routes to ios/implementer
6. Confirm skills are accessible from their new platform paths
7. Confirm `.claude/rules/` are loaded and referenced in CLAUDE.md
8. Open in Cursor — verify AGENTS.md is readable
9. Check `.github/agents/` — verify Copilot agents are valid
