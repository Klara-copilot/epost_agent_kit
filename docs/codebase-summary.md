# Codebase Summary - epost_agent_kit

**Last Updated**: 2026-02-05
**Version**: 0.1.0 (Planning Complete)
**Repository**: [Klara-copilot/epost_agent_kit](https://github.com/Klara-copilot/epost_agent_kit)
**Total Files**: 173 (131 scannable)
**Total LOC**: ~89,046 lines
**Total Size**: 840,752 tokens (3.7 MB)

## Current State

The epost_agent_kit project has **completed planning phase** with comprehensive infrastructure in place. The repository contains 15 agents, 17 skills, 30 commands, 6 hooks, and extensive documentation providing a complete multi-platform agent framework ready for implementation.

**Components**: 15 agents ✓ | 17 skills ✓ | 30 commands ✓ | 6 hooks ✓ | Documentation ✓
**Project Status**: Planning Complete - Implementation Ready
**Repository**: git@github.com:Klara-copilot/epost_agent_kit.git
**Primary Branch**: main

## Project Structure

```
epost_agent_kit/
├── README.md                    # Main project overview
├── CLAUDE.md                    # Claude Code instructions
├── docs/                        # Documentation
│   ├── project-overview-pdr.md    # Vision, requirements, PDR
│   ├── system-architecture.md    # Detailed architecture
│   ├── codebase-summary.md        # This file
│   ├── code-standards.md          # Code conventions
│   └── project-roadmap.md         # Implementation phases
├── .claude/                     # Claude Code configuration (structure in progress)
│   ├── agents/                   # Global agents (to be created)
│   ├── skills/                   # Skills by category/platform
│   ├── rules/                    # Global rules
│   └── commands/                 # Commands by category
├── .github/                     # GitHub configuration (for Copilot)
│   ├── agents/                   # Copilot agents (generated)
│   ├── instructions/             # Copilot instructions (generated)
│   └── prompts/                  # Copilot prompts (generated)
├── knowledge/                   # Design system and agent knowledge
│   ├── figma/                    # Figma design system
│   └── agent/                    # Agent mental models
├── plans/                       # Implementation plans and research
│   └── 260205-0834-unified-architecture-implementation/
│       ├── phase-*.md            # Implementation phases
│       ├── research/             # Cross-platform format research
│       └── reports/              # Agent reports
└── .gitignore                   # Git ignore rules
```

## Existing Inventory

### Agents (Currently Exist, Pre-Restructuring)

**11 current agents** (will be restructured to 9 global + platform-specific):
- `planner` → `architect`
- `fullstack-developer` → `implementer`
- `code-reviewer` → `reviewer`
- `docs-manager` → `documenter`
- `researcher` (keep)
- `debugger` (keep, add delegation)
- `tester` (keep, add delegation)
- `project-manager` → merge into `orchestrator`
- `git-manager` (keep)
- `performance-analyst` → merge into `reviewer`
- `ui-designer` → move to `web/designer`

### Skills (Currently Exist, Pre-Reorganization)

**11 current skills** (will be reorganized by platform):
- `planning` (global)
- `research` (global)
- `debugging` (global)
- `frontend-development` (web)
- `backend-development` (web)
- `nextjs` (web)
- `shadcn-ui` (web)
- `better-auth` (web)
- `databases` (shared)
- `docker` (shared)
- `ios-development` (ios)

### Commands (Currently Exist, Pre-Reorganization)

**23 current commands** across categories:
- **core**: ask, bootstrap, cook, debug, plan, test
- **design**: fast
- **docs**: init, update
- **fix**: ci, fast, hard, test, ui
- **git**: cm, commit, cp, pr, push
- **ios**: cook, debug, simulator, test

### Workflows (Currently Exist)

**3 current workflows**:
- bug-fixing
- feature-development
- project-init

## Key Design Artifacts

### Cross-Platform Format Specifications

**Research File**: `plans/260205-0834-unified-architecture-implementation/research/researcher-01-cross-platform-formats.md`

Comprehensive analysis of:
- Claude Code agent YAML frontmatter (name, description, tools, model, color)
- Cursor AGENTS.md format (plain markdown, hierarchical)
- Cursor rules format (.mdc files with YAML frontmatter)
- Cursor commands format (plain markdown, no frontmatter)
- GitHub Copilot agent format (YAML with handoffs)
- GitHub Copilot instructions format (glob-based, applyTo)
- GitHub Copilot prompts format (task-specific templates)

### Agent Mental Model

**File**: `knowledge/agent/agent mental model.md`

Defines how agents should behave, reason, and interact within the system.

## Implementation Roadmap

### 9 Implementation Phases (32 hours total)

| Phase | Focus | Effort | Status |
|-------|-------|--------|--------|
| 0 | Dependencies & Audit | 1h | Pending |
| 1 | Rules Foundation | 2h | Pending |
| 2 | Global Agents Restructuring | 4h | Pending |
| 3 | Web Platform Agents | 3h | Pending |
| 4 | Functional Verification | 2h | Pending |
| 5 | iOS Platform Agents | 3h | Pending |
| 6 | Android Platform Agents | 2h | Pending |
| 7 | CLI Build | 8h | Pending |
| 8 | Platform Sync | 4h | Pending |
| 9 | E2E Verification | 3h | Pending |

### Critical Path

```
Phase 0 ─→ Phase 1 ─→ Phase 2 ─→ Phase 3 ─→ Phase 4 ─→ Phase 5 ─→ Phase 6
                                                        ↓
                                                     Phase 7 ─→ Phase 8 ─→ Phase 9
```

## Technology Stack (Planned)

### CLI Tool (Phase 7)

**Framework**: Node.js 18+ LTS, TypeScript 5+

**Key Dependencies**:
- `commander.js` - CLI framework
- `fs` / `fs-extra` - File operations
- `zod` - Schema validation
- `chalk` - Colored CLI output

**Structure**:
```
src/
├── index.ts             # CLI entry point
├── commands/
│   ├── install.ts       # Install components
│   ├── list.ts          # List components
│   ├── create.ts        # Create new components
│   └── validate.ts      # Validate specs
├── core/
│   ├── discovery.ts     # Scan and discover
│   ├── installer.ts     # Install to targets
│   ├── converter.ts     # Format conversion
│   ├── resolver.ts      # Dependency resolution
│   ├── targets.ts       # Target path definitions
│   └── lock.ts          # Track installations
└── templates/           # Scaffolding templates
```

### Agent Platforms

- **Claude Code**: SDK (native)
- **Cursor**: AGENTS.md spec + API
- **GitHub Copilot**: REST API + VS Code SDK

### Testing Stack

- **Vitest**: Unit testing
- **Playwright**: Cross-platform E2E testing
- **Manual IDE Testing**: Claude Code, Cursor, Copilot

## Documentation

### Current Documentation

- **[Project Overview & PDR](./project-overview-pdr.md)** - Vision, goals, and product requirements
- **[System Architecture](./system-architecture.md)** - Detailed architecture and patterns
- **[Codebase Summary](./codebase-summary.md)** - This file
- **[Code Standards](./code-standards.md)** - Coding conventions and standards
- **[Project Roadmap](./project-roadmap.md)** - Implementation phases and timeline

## Configuration Files

### CLAUDE.md

**File**: `/CLAUDE.md`

Currently minimal; will be expanded with:
- Project overview
- Agent references
- Skill definitions
- Rule sections
- Workflow definitions

### Package.json (Planned)

Not yet created; Phase 7 will create:
- `name`: "epost-kit"
- `version`: "0.1.0"
- `bin`: { "epost-kit": "src/index.ts" }
- `main`: "dist/index.js"
- `type`: "module"

## Size Analysis

### Current Repository

```
Total Size: 3.9 MB
├── .claude/        820 KB  (configuration)
├── .github/        12 KB   (GitHub config)
├── knowledge/      2.3 MB  (design system, agent models)
├── plans/          216 KB  (implementation plans)
├── docs/           120 KB  (documentation)
├── .git/           ~600 KB (git history)
└── Other           ~50 KB  (README, CLAUDE.md, etc.)
```

## Code Standards (In Planning)

The project follows strict standards defined in [docs/code-standards.md](code-standards.md):

- **File Naming**: kebab-case with descriptive names
- **File Size**: Max 200 lines for focused modules
- **Agent Prompts**: Max 200 lines for clarity
- **Skills**: Max 300 lines each
- **Commands**: Max 150 lines (split larger into skills)
- **Documentation**: Max 800 lines per file

## Key Decisions & Design Rationale

### Parent-Child Delegation

**Why**: Separates orchestration from execution, enabling single-source-of-truth across platforms

**Implementation**: Global agents route to platform agents; platform agents never know about other platforms

### Modular Skills Organization

**Why**: Enables specialization while maintaining discoverability

**Implementation**: Global skills at root; platform-specific skills in `web/`, `ios/`, `android/` directories

### Two-Layer Distribution

**Why**: Supports both minimal (skills only) and full (entire ecosystem) installations

**Implementation**: Layer 1 uses standard `npx skills add`; Layer 2 uses `npx epost-kit`

### CLI as Distribution Vehicle

**Why**: Eliminates manual file placement and ensures consistency

**Implementation**: Single command installs all components, automatically converting to target format

## Next Immediate Steps

1. **Phase 0 (Now)**: Run dependency audit
2. **Phase 1 (Next)**: Create `.claude/rules/` foundation files
3. **Phase 2**: Restructure global agents
4. **Phase 3**: Create web platform agents
5. **Phase 4**: Functional verification
6. Continue through phases 5-9

## Related Documentation

- **[README.md](../README.md)** - Project overview and quick start
- **[docs/project-overview-pdr.md](project-overview-pdr.md)** - Vision and requirements
- **[docs/system-architecture.md](system-architecture.md)** - Detailed architecture
- **[docs/code-standards.md](code-standards.md)** - Coding conventions
- **[docs/project-roadmap.md](project-roadmap.md)** - Implementation timeline

---

**Created By**: Phuong Doan
**Last Updated**: 2026-02-05
**Status**: Planning Phase
**Maintained By**: Phuong Doan
