# epost_agent_kit — Distribution CLI + Contributor Framework Plan

## Goal

Build an `npx epost-kit` CLI so developers can install agents/skills/commands/rules/workflows from this repo into their workspace. Make platform skills (web/ios/android) open as contributor placeholders for teammates. Stay compatible with `npx skills add` (skills.sh) for the skills portion.

---

## Architecture: Two-Layer Distribution

```
Layer 1: npx skills add Klara-copilot/epost_agent_kit   → Skills only (SKILL.md files)
Layer 2: npx epost-kit install                           → Full ecosystem (agents, commands, skills, rules, workflows)
```

**Why a custom CLI?** skills.sh only handles SKILL.md files. epost_agent_kit has agents, commands, rules, workflows, and knowledge — none of which skills.sh understands. The custom CLI handles the full ecosystem while delegating skill-only installs to skills.sh.

---

## CLI Interface

```bash
# Full install
npx epost-kit install                          # Everything → Claude Code
npx epost-kit install --full --target all       # Everything → all AI agents

# Platform-specific
npx epost-kit install --platform web            # Global + web components
npx epost-kit install --platform ios            # Global + ios components

# Component-specific
npx epost-kit install --component skills        # Skills only
npx epost-kit install --platform web --component skills  # Web skills only

# Multi-agent targets
npx epost-kit install --target claude           # Claude Code (default)
npx epost-kit install --target cursor           # Cursor
npx epost-kit install --target copilot          # GitHub Copilot
npx epost-kit install --target all              # All supported agents

# Contributor tools
npx epost-kit create skill android jetpack-compose   # Scaffold new skill
npx epost-kit create agent ios my-agent              # Scaffold new agent

# Discovery
npx epost-kit list                              # Show all components
npx epost-kit list --platform web               # Show web components
npx epost-kit validate                          # Validate SKILL.md spec compliance
```

Interactive mode (no flags): prompts for platform, components, and targets.

---

## Files to Create

### Package scaffolding

| File | Purpose |
|---|---|
| `package.json` | npm package def — `epost-kit` CLI, tsup build, commander/chalk/gray-matter deps |
| `tsconfig.json` | Strict mode, ESM, Node 18+ |
| `.gitignore` | Add node_modules/, dist/ |

### CLI source (`src/`)

| File | Purpose |
|---|---|
| `src/index.ts` | Entry point — commander CLI with install/list/create/validate commands |
| `src/commands/install.ts` | Main install: discovery → filter → resolve deps → copy to targets → write lock |
| `src/commands/list.ts` | List all available components, optionally filtered by platform |
| `src/commands/create.ts` | Scaffold new skill/agent/command from templates |
| `src/commands/validate.ts` | Validate all SKILL.md files have proper frontmatter per Agent Skills spec |
| `src/core/discovery.ts` | Scan repo by convention: agents, commands, skills, rules, workflows |
| `src/core/installer.ts` | Copy/symlink assets to target workspace paths |
| `src/core/resolver.ts` | Resolve deps: commands→agents, agents→skills references |
| `src/core/targets.ts` | Target path definitions per AI agent (Claude, Cursor, Copilot) |
| `src/core/lock.ts` | Read/write `epost-kit.lock.json` tracking installed components |
| `src/types.ts` | TypeScript type defs: AssetRegistry, Platform, ComponentType, etc. |
| `src/utils/frontmatter.ts` | Parse YAML frontmatter from markdown (wraps gray-matter) |
| `src/utils/fs.ts` | File system helpers (copy dir, ensure dir, etc.) |

### Templates (`templates/`)

| File | Purpose |
|---|---|
| `templates/skill/SKILL.md.template` | Skeleton for new platform skills with frontmatter + sections |
| `templates/agent/agent.md.template` | Skeleton for new platform agents with frontmatter + delegation |
| `templates/command/command.md.template` | Skeleton for new platform commands with frontmatter + routing |

### Contributor docs

| File | Purpose |
|---|---|
| `CONTRIBUTING.md` | Root contributor guide: structure overview, how to add skills/agents/commands, PR process |
| `.claude/skills/web/_CONTRIBUTING.md` | Web platform skill contribution guide + needed skills list |
| `.claude/skills/ios/_CONTRIBUTING.md` | iOS platform skill contribution guide + needed skills list |
| `.claude/skills/android/_CONTRIBUTING.md` | Android platform contribution guide + needed skills list |
| `.claude/agents/web/_CONTRIBUTING.md` | Web agent contribution guide |
| `.claude/agents/ios/_CONTRIBUTING.md` | iOS agent contribution guide |
| `.claude/agents/android/_CONTRIBUTING.md` | Android agent contribution guide |

### Registry

| File | Purpose |
|---|---|
| `registry.json` | Auto-generated manifest of all components (from `npx epost-kit validate`) |

---

## Files to Modify

### SKILL.md frontmatter compliance (13 files)

All existing SKILL.md files need YAML frontmatter added. Currently they have `# Title` only — the Agent Skills spec requires `name` and `description` in YAML frontmatter.

| File | Add frontmatter `name` |
|---|---|
| `.claude/skills/planning/SKILL.md` | `planning` |
| `.claude/skills/research/SKILL.md` | `research` |
| `.claude/skills/debugging/SKILL.md` | `debugging` |
| `.claude/skills/databases/SKILL.md` | `databases` |
| `.claude/skills/docker/SKILL.md` | `docker` |
| `.claude/skills/nextjs/SKILL.md` | `nextjs` |
| `.claude/skills/frontend-development/SKILL.md` | `frontend-development` |
| `.claude/skills/backend-development/SKILL.md` | `backend-development` |
| `.claude/skills/shadcn-ui/SKILL.md` | `shadcn-ui` |
| `.claude/skills/better-auth/SKILL.md` | `better-auth` |
| `.claude/skills/ios-development/SKILL.md` | `ios-development` |

Format to add at top of each SKILL.md:
```yaml
---
name: <directory-name>
description: <extracted from existing ## Purpose section>
---
```

---

## Key Implementation Details

### Discovery engine (`src/core/discovery.ts`)

Scans by file convention:
- **Agents**: `.claude/agents/*.md` (global) + `.claude/agents/{web,ios,android}/*.md` (platform)
- **Commands**: `.claude/commands/core/*.md` (global) + `.claude/commands/{web,ios,android}/*.md` (platform) + `.claude/commands/{fix,git,docs,design}/*.md` (shared)
- **Skills**: `.claude/skills/*/SKILL.md` (global) + `.claude/skills/{web,ios,android}/*/SKILL.md` (platform)
- **Rules**: `.claude/rules/*.md` (always global)
- **Workflows**: `.claude/workflows/*.md` (always global)

Platform determined by directory path. Returns typed `AssetRegistry`.

### Multi-agent targets (`src/core/targets.ts`)

| Target | Agents dir | Commands dir | Skills dir | Rules dir |
|---|---|---|---|---|
| Claude Code | `.claude/agents/` | `.claude/commands/` | `.claude/skills/` | `.claude/rules/` |
| Cursor | `AGENTS.md` (generated) | n/a | `.cursor/skills/` | `.cursor/rules/` |
| Copilot | `.github/agents/` | n/a | `.github/skills/` | `.github/instructions/` |

For Cursor: generates single `AGENTS.md` from all agent frontmatter. For Copilot: converts agents to `.agent.md` format.

### Selective installation logic

- `--platform` filters to that platform's components + **always includes global** (orchestrator, architect etc. are needed for delegation)
- `--component` filters to that component type only
- Combined: `--platform web --component skills` = web skills + global skills
- Dependency resolver: if installing commands, their referenced agents (from `agent:` frontmatter) are auto-included

### Lock file (`epost-kit.lock.json` in workspace root)

```json
{
  "version": "0.1.0",
  "installed": "2026-02-03T12:00:00Z",
  "source": "Klara-copilot/epost_agent_kit@0.1.0",
  "components": {
    "agents": ["orchestrator", "architect", "web/implementer"],
    "skills": ["planning", "web/nextjs"],
    "commands": ["core/cook", "web/cook"],
    "rules": ["primary-workflow"],
    "workflows": ["feature-development"]
  },
  "targets": ["claude"]
}
```

### Platform _CONTRIBUTING.md pattern

Each platform gets a `_CONTRIBUTING.md` listing:
1. What exists (with status: skeleton/partial/complete)
2. What's needed (specific skills/agents to create)
3. How to contribute (`npx epost-kit create skill <platform> <name>`)
4. PR naming convention (`feat(<platform>): add <skill-name> skill`)

---

## Implementation Phases

### Phase 1: SKILL.md compliance (prerequisite)
Add YAML frontmatter to all 13 SKILL.md files. This is required before skills.sh compatibility works.

### Phase 2: Package scaffolding
Create `package.json`, `tsconfig.json`, update `.gitignore`. Install deps. Verify `npm run build` works.

### Phase 3: Core CLI (types + discovery + list)
Build `src/types.ts`, `src/utils/*`, `src/core/discovery.ts`, `src/commands/list.ts`, `src/index.ts`. Verify `npx epost-kit list` shows all components grouped by platform.

### Phase 4: Installer
Build `src/core/targets.ts`, `src/core/resolver.ts`, `src/core/installer.ts`, `src/core/lock.ts`, `src/commands/install.ts`. Verify `npx epost-kit install --platform web --target claude` copies correct files.

### Phase 5: Contributor framework
Create templates, `CONTRIBUTING.md`, platform `_CONTRIBUTING.md` files, `src/commands/create.ts`. Verify `npx epost-kit create skill android jetpack-compose` scaffolds correctly.

### Phase 6: Validation + registry
Build `src/commands/validate.ts`, generate `registry.json`. Verify `npx epost-kit validate` reports spec compliance.

---

## Verification

1. `npm run build` — compiles without errors
2. `npx epost-kit list` — shows all agents, commands, skills grouped by platform
3. `npx epost-kit list --platform ios` — shows only iOS + global components
4. `npx epost-kit install --platform web --target claude` — copies web+global to `.claude/` in a test workspace
5. `npx epost-kit install --target cursor` — generates `AGENTS.md` + copies rules to `.cursor/rules/`
6. `npx epost-kit create skill android jetpack-compose` — creates `.claude/skills/android/jetpack-compose/SKILL.md` from template
7. `npx epost-kit validate` — all SKILL.md files pass spec check
8. `npx skills add Klara-copilot/epost_agent_kit --skill nextjs` — skills.sh discovers and installs the nextjs skill
9. Platform `_CONTRIBUTING.md` files list concrete contribution opportunities
10. `registry.json` accurately reflects all components
