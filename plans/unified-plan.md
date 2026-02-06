# epost_agent_kit — Unified Plan

## Goal

Restructure the existing epost_agent_kit into a **parent-child delegation architecture** (global agents orchestrate, platform agents execute) AND build an `npx epost-kit` CLI for distribution across Claude Code, Cursor, and Copilot.

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

## Architecture: Two-Layer Distribution

```
Layer 1: npx skills add Klara-copilot/epost_agent_kit   → Skills only (SKILL.md files)
Layer 2: npx epost-kit install                           → Full ecosystem (agents, commands, skills, rules, workflows)
```

---

## Cross-Platform Conversion Table

| Source Component                    | Claude Code                                                                 | Cursor                                       | Copilot                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Agent** (`agents/*.txt`)          | `.claude/agents/*.md` (YAML: name, description, tools, model, color, hooks) | `AGENTS.md` (combined, hierarchical)         | `.github/agents/*.agent.md` (YAML: name, description, tools, model, target, handoffs) |
| **Rule** (`rules/*.md`)             | `CLAUDE.md` sections                                                        | `.cursor/rules/*.mdc` (preserve frontmatter) | `.github/instructions/*.instructions.md` (applyTo conversion)                         |
| **Workflow** (`workflows/*.yaml`)   | `.claude/skills/*/SKILL.md` (preferred) or `.claude/commands/*.md`          | `.cursor/commands/*.md` (slash cmds)         | `.github/prompts/*.prompt.md` or `.github/workflows/*.yml` (CI)                       |
| **Skill** (`skills/*/SKILL.md`)     | `.claude/skills/*/SKILL.md` (native, = slash command)                       | `.cursor/commands/*.md` (converted)          | `.github/prompts/*.prompt.md` (converted)                                             |
| **Knowledge** (`.agent-knowledge/`) | Referenced in CLAUDE.md                                                     | `@file` references in rules                  | Referenced in instructions                                                            |
| **Chat Mode**                       | Subagent (via `.claude/agents/*.md`)                                        | Rules + AGENTS.md                            | `.github/agents/*.agent.md` (chatmodes deprecated)                                    |
| **Open standard files**             | AGENTS.md, CLAUDE.md                                                        | AGENTS.md                                    | AGENTS.md, CLAUDE.md, GEMINI.md                                                       |

---

## Agent Renaming Map

| Current File             | Action | New File            | Role Change                           |
| ------------------------ | ------ | ------------------- | ------------------------------------- |
| `planner.md`             | RENAME | `architect.md`      | Design/planning orchestrator          |
| `fullstack-developer.md` | RENAME | `implementer.md`    | Delegator → platform implementers     |
| `code-reviewer.md`       | RENAME | `reviewer.md`       | Delegator → platform reviewers        |
| `docs-manager.md`        | RENAME | `documenter.md`     | Keep global (docs are cross-platform) |
| `researcher.md`          | KEEP   | `researcher.md`     | Already global                        |
| `debugger.md`            | KEEP   | `debugger.md`       | Delegator → platform debuggers        |
| `tester.md`              | KEEP   | `tester.md`         | Delegator → platform testers          |
| `git-manager.md`         | KEEP   | `git-manager.md`    | Already global                        |
| `project-manager.md`     | MERGE  | → `orchestrator.md` | PM responsibilities absorbed          |
| `performance-analyst.md` | MERGE  | → `reviewer.md`     | Perf analysis part of review          |
| `ui-designer.md`         | MOVE   | → `web/designer.md` | Platform-specific                     |
| (new)                    | CREATE | `orchestrator.md`   | Top-level router + PM duties          |

---

## Target Directory Structure

### Agents

```
.claude/agents/
├── orchestrator.md          # Routes tasks, detects platform, delegates
├── architect.md             # Plans, designs, researches
├── implementer.md           # Delegates to platform implementers
├── reviewer.md              # Code review + performance analysis
├── researcher.md            # Global research, context gathering
├── debugger.md              # Delegates to platform debuggers
├── tester.md                # Delegates to platform testers
├── documenter.md            # Cross-platform documentation
├── git-manager.md           # Cross-platform git operations
├── web/
│   ├── implementer.md       # Next.js, React, Tailwind, shadcn
│   ├── tester.md            # Vitest, Playwright, Testing Library
│   └── designer.md          # shadcn, Figma, a11y
├── ios/
│   ├── implementer.md       # Swift 6, SwiftUI, UIKit
│   ├── tester.md            # XCTest, XCUITest
│   └── simulator.md         # Simulator management
└── android/
    ├── implementer.md       # Kotlin, Jetpack Compose
    └── tester.md            # JUnit, Espresso
```

### Skills (reorganized by platform)

```
.claude/skills/
├── planning/                # Global
├── research/                # Global
├── debugging/               # Global
├── skill-creator/           # Global — from anthropics/skills (creates new skills)
├── find-skills/             # Global — from vercel-labs/skills (discovers skills)
├── databases/               # Shared
├── docker/                  # Shared
├── web/
│   ├── nextjs/
│   ├── frontend-development/
│   ├── backend-development/
│   ├── shadcn-ui/
│   └── better-auth/
├── ios/
│   └── ios-development/
└── android/
    └── android-development/ # Skeleton
```

### Rules

```
.claude/rules/
├── primary-workflow.md
├── development-rules.md
├── orchestration-protocol.md
└── documentation-management.md
```

### Multi-Platform Sync Targets

```
# Claude Code (native)
.claude/agents/*.md              # Subagents with YAML frontmatter
.claude/skills/*/SKILL.md       # Skills as slash commands
CLAUDE.md                        # Rules and instructions

# Cursor
AGENTS.md                        # Agent definitions (hierarchical)
.cursor/rules/*.mdc              # Rules with frontmatter
.cursor/commands/*.md            # Slash commands

# Copilot
.github/agents/*.agent.md       # Agents with frontmatter
.github/instructions/*.instructions.md  # Instructions with applyTo
.github/prompts/*.prompt.md     # Prompt files as slash commands
```

---

## Implementation Phases

### Phase 1: Rules Foundation

Create `.claude/rules/` governance files.

| File                          | Source                                          |
| ----------------------------- | ----------------------------------------------- |
| `primary-workflow.md`         | Adapt from claudekit-main, add platform routing |
| `development-rules.md`        | Adapt from claudekit-main                       |
| `orchestration-protocol.md`   | Add parent→child delegation protocol            |
| `documentation-management.md` | Adapt from claudekit-main                       |

### Phase 2: Agent Restructuring

Rename, create, merge global agents per the renaming map above.

### Phase 3: Platform Agents

Create web/, ios/, android/ platform agent directories with specialized agents.

### Phase 4: Commands/Skills Reorganization

- Update all `/core` commands to use new agent names and delegation
- Create platform-specific command directories
- Migrate workflows → skills where appropriate
- Skills grouped by platform under `.claude/skills/{web,ios,android}/`
- Install global external skills:
  - `npx skills add https://github.com/anthropics/skills --skill skill-creator` → `.claude/skills/skill-creator/`
  - `npx skills add https://github.com/vercel-labs/skills --skill find-skills` → `.claude/skills/find-skills/`

### Phase 5: Distribution CLI

Build `npx epost-kit` with the following components:

| File                       | Purpose                                |
| -------------------------- | -------------------------------------- |
| `package.json`             | npm package def — `epost-kit` CLI      |
| `src/index.ts`             | Entry point — commander CLI            |
| `src/commands/install.ts`  | Discovery → filter → copy to targets   |
| `src/commands/list.ts`     | List components by platform            |
| `src/commands/create.ts`   | Scaffold new components from templates |
| `src/commands/validate.ts` | Validate SKILL.md spec compliance      |
| `src/core/discovery.ts`    | Scan repo by convention                |
| `src/core/installer.ts`    | Copy assets to target workspace paths  |
| `src/core/resolver.ts`     | Resolve cross-component dependencies   |
| `src/core/targets.ts`      | Target path definitions per platform   |
| `src/core/lock.ts`         | Track installed components             |

#### `targets.ts` Mapping (reflects full conversion table)

| Target      | Agents                      | Rules                                    | Commands/Skills               | Workflows                    |
| ----------- | --------------------------- | ---------------------------------------- | ----------------------------- | ---------------------------- |
| Claude Code | `.claude/agents/*.md`       | `CLAUDE.md` sections                     | `.claude/skills/*/SKILL.md`   | `.claude/commands/*.md`      |
| Cursor      | `AGENTS.md`                 | `.cursor/rules/*.mdc`                    | `.cursor/commands/*.md`       | `.cursor/rules/commands.mdc` |
| Copilot     | `.github/agents/*.agent.md` | `.github/instructions/*.instructions.md` | `.github/prompts/*.prompt.md` | `.github/workflows/*.yml`    |

#### CLI Interface

```bash
npx epost-kit install                           # Everything → Claude Code
npx epost-kit install --target all              # Everything → all platforms
npx epost-kit install --platform web            # Global + web components
npx epost-kit install --target cursor           # Convert to Cursor format
npx epost-kit list                              # Show all components
npx epost-kit create skill android my-skill     # Scaffold new skill
npx epost-kit validate                          # Validate spec compliance
```

### Phase 6: Platform Sync

Convert and deploy to all targets:

- Agents → Claude subagents / Cursor AGENTS.md / Copilot agents
- Rules → CLAUDE.md / Cursor .mdc / Copilot instructions
- Commands/Skills → Claude SKILL.md / Cursor commands / Copilot prompt files
- Workflows → Claude commands / Cursor commands.mdc / Copilot Actions

### Phase 7: Verification

End-to-end testing across all targets.

---

## Key Design Decisions

1. **Global agents delegate, never execute platform code**
2. **Platform agents are self-contained** — no cross-platform assumptions
3. **Commands at both levels** — `/cook` (global, auto-detect) and `/web:cook` (explicit)
4. **Skills grouped by platform** — shared skills at root, platform skills under dirs
5. **Rules are global** — platform conventions live in agent prompts
6. **Android as skeleton** — populated with real content later
7. **CLI handles full ecosystem** — skills.sh for SKILL.md only, epost-kit for everything
8. **Commands/skills are cross-platform** — Claude SKILL.md ↔ Cursor commands ↔ Copilot prompts
9. **External skills as global dependencies** — `skill-creator` (anthropics) and `find-skills` (vercel-labs) are always installed as global skills

---

## Verification Checklist

### Agent Restructuring

1. All global agents exist and reference delegation to platform agents
2. All platform agents exist with platform-specific expertise
3. `/core:cook` detects platform and delegates correctly
4. `/web:cook` routes directly to web/implementer
5. Skills accessible from new platform paths
6. Rules loaded and referenced in CLAUDE.md
7. Global external skills installed: `skill-creator` and `find-skills` present in `.claude/skills/`

### Distribution CLI

7. `npm run build` compiles without errors
8. `npx epost-kit list` shows all components grouped by platform
9. `npx epost-kit install --platform web --target claude` copies correct files
10. `npx epost-kit install --target cursor` generates AGENTS.md + rules + commands
11. `npx epost-kit install --target copilot` generates agents + instructions + prompts
12. `npx epost-kit create skill android jetpack-compose` scaffolds correctly
13. `npx epost-kit validate` reports spec compliance

### Platform Sync

14. Open in Cursor — AGENTS.md readable, rules applied, commands available
15. Copilot agents valid with correct frontmatter (name, description, tools, model, target, handoffs)
16. Claude Code subagents valid with correct frontmatter (name, description, tools, model, color, hooks)
17. Commands/skills conversion is bidirectional across all platforms
