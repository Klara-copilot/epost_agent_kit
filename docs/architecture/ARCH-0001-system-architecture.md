# System Architecture: Agents & Skill Ecosystem

**Status**: Current as of v2.0.0 (2026-03-05)

## Overview

epost_agent_kit is a **multi-agent coordination system** for Claude Code. Agents delegate specialized work via **skills** (passive knowledge + behavior triggers). The system spans 4 packages: `core`, `a11y`, `kit`, `design-system`.

## Core Concepts

### Agents
- **13 agents** in core packages
- Orchestrator + specialists (architect, implementer, reviewer, debugger, tester, researcher, documenter, git-manager, a11y-specialist, brainstormer, kit-designer, muji)
- Each has: name, color, system prompt, triggering patterns, skill bindings
- Load **via agent file** (.claude/agents/) + skills listed in `skills:` frontmatter field

### Skills
- **67 total skills** across 4 packages (core, a11y, kit, design-system)
- Passive knowledge (references, patterns, guidelines)
- Activated on-demand: agent `skills:` list + model-invocable descriptions
- Versions standardized in `skill-index.json`

### Packages
- **core**: 10 agents, ~35 skills (universal, cross-platform)
- **a11y**: 1 agent (epost-a11y-specialist), ~8 a11y-specific skills
- **kit**: 1 agent (epost-kit-designer), ~9 kit authoring skills
- **design-system**: 1 agent (epost-muji), ~10 design system skills

## Delegation Model

```
User Request
    ↓
Smart Routing (skill-discovery)
    ↓
[Select Agent(s)]
    ↓
[Load Skill Context] (skill-index.json)
    ↓
Agent Work (model execution)
    ↓
[Optional: Delegate to Specialist Agent]
    ↓
Completion / Next Step
```

### Agent Selection Rules
1. **Explicit routing**: User mentions agent name → load directly
2. **Task intent**: Detect from action verbs (cook → implementer, fix → reviewer, plan → architect)
3. **Platform signals**: File extensions, keywords → platform-specific agent
4. **Domain signals**: Module path, A11y tags → specialist agent

## Package Topology

```
packages/
├── core/                    # Layer 0: universal
│   ├── agents/              # orchestrator, architect, implementer, ...
│   ├── skills/              # problem-solving, error-recovery, ...
│   ├── scripts/             # get-active-plan, set-active-plan
│   └── package.yaml
├── a11y/                    # Layer 1: a11y-specialist
│   ├── agents/
│   ├── skills/              # a11y base + platform variants (ios-a11y, android-a11y, web-a11y)
│   └── package.yaml
├── kit/                     # Layer 1: kit-designer
│   ├── agents/
│   ├── skills/              # kit-* (skill-development, agent-development, etc.)
│   └── package.yaml
├── design-system/           # Layer 1: epost-muji
│   ├── agents/
│   ├── skills/              # web-figma, web-ui-lib, etc.
│   └── package.yaml
├── platform-android/        # Not in v2.0.0 (external projects)
├── platform-ios/            # Not in v2.0.0
├── platform-web/            # Not in v2.0.0
├── platform-backend/        # Not in v2.0.0
└── domains/                 # Not in v2.0.0
```

## Skill Loading Flow

1. **Agent loaded** → reads `skills:` list from frontmatter
2. **skill-index.json queried** → resolve names to paths
3. **Skill SKILL.md read** → extract patterns, constraints, references
4. **Model-invocable** → if skill description matches task, model can suggest it
5. **Optional auto-load** → skill-discovery protocol adds contextual skills

## Multi-Platform Architecture

### Platform Detection
- **iOS**: `.swift`, `Package.swift`, "SwiftUI", "iOS"
- **Android**: `.kt`, `.kts`, `build.gradle.kts`, "Kotlin", "Compose"
- **Web**: `.tsx`, `.ts`, `package.json`, "React", "Next.js"
- **Backend**: `.java`, `pom.xml`, "Jakarta EE", "WildFly"

### Platform-Specific Skills
- Each platform (ios, android, web) has development + testing + a11y skills
- A11y skills extend base `a11y` skill
- Platform agents (not loaded in v2.0.0) would use platform-specific skills

### Cross-Platform Coordination
- Design tokens defined in design-system
- Web Figma variables (1,059 tokens, 42 collections) as authority
- Platform variants implement design system locally

## Initialization & Generation

### Flow
```
epost-kit init
    ↓
Validate packages/ structure
    ↓
Regenerate .claude/
    ├── agents/      (from packages/*/agents/*.md)
    ├── skills/      (from packages/*/skills/*/)
    ├── hooks/       (from .claude/hooks/ source)
    ├── scripts/     (from packages/*/scripts/)
    ├── commands/    (from .claude/commands.yaml)
    └── settings.json
    ↓
Update skill-index.json
    ↓
.epost-metadata.json checksummed
```

### Critical Rule: packages/ is Source of Truth
- **Edit files in** `packages/*/` (agents, skills, hooks, scripts)
- **Never edit** `.claude/` directly
- `.claude/` is **regenerated on every init** (wiped + rebuilt)
- Changes to `.claude/` are **lost on next init/reinstall**

## Skill Architecture (Mar 2026)

### Consolidation Pattern
- **Old**: `cook`, `cook-fast`, `cook-parallel` (3 skills)
- **New**: `cook` skill with `--fast`, `--parallel` flags in references
- Variant content moved to `references/` subdirectory
- Reduces cognitive load, easier discovery

### Skill Frontmatter Fields
```yaml
name: skill-name
description: Trigger-only (when to use, not workflow summary)
user-invocable: true|false (hide from discovery if false)
context: fork|inline (memory context model)
agent: agent-name (optional: specific agent affinity)
disable-model-invocation: true|false (block model from suggesting)
```

### No `version:` Field
- Skill versioning handled at **package level** (package.yaml)
- Individual skills don't have version field

## Artifact Structure

### Release Artifact: epost_agent_kit-2.0.0.tar.gz
```
epost_agent_kit-2.0.0/
├── packages/
│   ├── core/
│   ├── a11y/
│   ├── kit/
│   └── design-system/
├── docs/
│   ├── index.json
│   ├── architecture.md
│   ├── release-process.md
│   └── ...
├── CHANGELOG.md
├── .epost-metadata.json
├── scripts/
├── .github/
└── README.md
```

### Installation
- Extract artifact
- Run `epost-kit init` to populate `.claude/`
- Read `.epost-metadata.json` to verify version

## Integration Points

### GitHub Actions
- **Release workflow** (`.github/workflows/release.yml`): Tag push → artifact build → GitHub release
- **CI validation**: package.yaml + version validation + build verification

### Persistent Memory
- Agent memory at `.claude/agent-memory/{agent-name}/`
- `MEMORY.md` + topic files (e.g., debugging.md)
- Survives conversations, shared across team via git

### Knowledge Base (KB)
- `docs/index.json` registry
- KB entries: ARCH (architecture), PATTERN (patterns), CONV (conventions), FEAT (features)
- Cross-linked references between docs

## Related Documents

- [Agent Framework](./agent-framework.md) — Agent system details
- [Skill Ecosystem](./skills.md) — Complete skill catalog
- [Release Process](./release-process.md) — How to release v2.x
- [Package Structure](./package-structure.md) — Source file organization
- `packages/*/package.yaml` — Package metadata
- `packages/*/skills/skill-index.json` — Skill registry

---

**Maintainer**: @than
**Last Updated**: 2026-03-05
**Version**: 2.0.0
