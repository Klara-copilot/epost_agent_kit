# Project Overview & Product Development Requirements

## Executive Summary

epost_agent_kit is a next-generation agent kit framework designed to eliminate platform fragmentation in AI development tooling. It provides a unified architecture that allows teams to define agents, rules, skills, and commands once and automatically deploy them across Claude Code, Cursor, and GitHub Copilot with zero platform-specific rewrites.

**Vision**: Empower developers with AI assistance that follows them across their entire development environment, regardless of which IDE or tool they use.

**Mission**: Build the foundational infrastructure that makes multi-platform agent distribution seamless, maintainable, and scalable.

---

## Target Users

### Primary
- **AI-First Development Teams**: Teams building with Claude, Cursor, and Copilot simultaneously
- **Framework Developers**: Creating specialized tooling on top of agent infrastructure
- **Enterprise Orgs**: Managing development standards across multiple IDEs

### Secondary
- **Independent Developers**: Using multiple IDEs and wanting consistent AI assistance
- **Open Source Maintainers**: Distributing development tooling across platforms
- **Educational Institutions**: Teaching development practices with consistent AI guidance

---

## Project Scope

### In Scope
1. Multi-platform agent architecture (global orchestration + platform delegation)
2. Component conversion across Claude Code, Cursor, GitHub Copilot
3. CLI distribution tool (`npx epost-kit`)
4. Web, iOS, Android platform agent implementations
5. Comprehensive documentation and standards
6. End-to-end verification across all platforms

### Out of Scope
1. Third-party IDE support (VS Code extensions are future work)
2. Real-time synchronization of live changes
3. Agent training or fine-tuning
4. Deprecated Copilot chat modes (targeting VS Code only)

---

## Key Features

### 1. Parent-Child Delegation Architecture
Global agents orchestrate work by detecting context and delegating to specialized platform agents. This separation of concerns ensures clean boundaries and maintainability.

**Benefits**:
- Single workflow definition used across all platforms
- Clear separation between orchestration and execution
- Easier to add new platforms (add platform agents only)
- Reduced code duplication

### 2. Automatic Multi-Platform Conversion
Define agents, rules, and commands once; automatically deploy to any supported IDE.

**Conversion Support**:
- Agents: Claude agent YAML → Cursor AGENTS.md → Copilot agent YAML
- Rules: CLAUDE.md sections → Cursor .mdc rules → Copilot instructions
- Commands: Claude skills → Cursor commands → Copilot prompts

**Benefits**:
- Maintain single source of truth
- Consistency across IDEs
- Reduced manual porting effort

### 3. Modular Skill Organization
Skills organized by platform with shared core components, enabling team members to specialize while maintaining platform independence.

**Organization**:
```
.claude/skills/
├── planning/           # Global (all platforms)
├── research/           # Global (all platforms)
├── web/                # Web-specific
├── ios/                # iOS-specific
└── android/            # Android-specific
```

**Benefits**:
- Clear ownership boundaries
- Platform-specific expertise isolated
- Easy discovery and reuse

### 4. Distribution CLI (`npx epost-kit`)
Simple command-line interface for installing, validating, and managing components.

**Key Commands**:
- `npx epost-kit install` - Full installation
- `npx epost-kit list` - Show all components
- `npx epost-kit create skill` - Scaffold new skills
- `npx epost-kit validate` - Verify spec compliance

**Benefits**:
- One-command setup
- No manual file placement
- Consistent installation across teams

---

## Success Criteria

### Functional Requirements

| Requirement | Definition | Acceptance Criteria |
|-------------|-----------|-------------------|
| **Multi-Platform Agents** | Deploy agents to Claude Code, Cursor, Copilot | 9 global agents + 3 platform sets, all functional |
| **Automatic Conversion** | Rules and commands convert across platforms | 100% conversion fidelity (no manual fixes needed) |
| **CLI Distribution** | `npx epost-kit install` works end-to-end | All components install without errors or conflicts |
| **Platform Delegation** | Global agents delegate to platform-specific agents | All /cook, /test, /debug commands route correctly |
| **Skill Organization** | Shared and platform-specific skills coexist | Skills discoverable and loadable on each platform |
| **Documentation** | Complete developer and user documentation | All features documented with examples |

### Non-Functional Requirements

| Requirement | Definition | Target |
|-------------|-----------|--------|
| **Maintainability** | Agent prompts under size limits | All agents under 200 lines |
| **Discoverability** | Find components easily | CLI list shows 100+ components clearly |
| **Performance** | Installation completes quickly | `npx epost-kit install` < 30s |
| **Consistency** | No platform-specific inconsistencies | Rules behave identically across IDEs |
| **Scalability** | Support new agents without restructuring | Add agents to `.claude/agents/` and sync |

### Quality Gates

1. **Build**: `npm run build` compiles without errors
2. **Lint**: All TypeScript passes ESLint with strict rules
3. **Tests**: 80% code coverage minimum
4. **Cross-Platform**: All commands work on Claude Code, Cursor, Copilot
5. **Documentation**: 100% API documented with examples

---

## High-Level Architecture

### Parent-Child Delegation Flow

```
User Request
    ↓
Orchestrator (detects platform, routes task)
    ↓
Global Agent (architect, implementer, reviewer, etc.)
    ↓
Platform Agent (web/implementer, ios/implementer, etc.)
    ↓
Execution (implement feature, write code, etc.)
```

### Global Agents (9 total)

| Agent | Responsibility | Delegates To |
|-------|---|---|
| **orchestrator** | Top-level router, project manager | All other agents |
| **architect** | Design, planning, research | Implementer (if platform-specific) |
| **implementer** | Feature implementation | web/impl, ios/impl, android/impl |
| **reviewer** | Code review, performance | web/tester, ios/tester, etc. |
| **researcher** | Multi-source research | None (executes directly) |
| **debugger** | Debugging coordination | web/debugger, ios/simulator, etc. |
| **tester** | Test orchestration | web/tester, ios/tester, etc. |
| **documenter** | Cross-platform docs | None (executes directly) |
| **git-manager** | Git operations | None (executes directly) |

### Platform Agents (3 platforms)

**Web Platform** (`web/`):
- `implementer` - Next.js, React, TypeScript, Tailwind
- `tester` - Vitest, Playwright, Testing Library
- `designer` - shadcn, Figma, accessibility

**iOS Platform** (`ios/`):
- `implementer` - Swift 6, SwiftUI, UIKit
- `tester` - XCTest, XCUITest
- `simulator` - Simulator management

**Android Platform** (`android/`):
- `implementer` - Kotlin, Jetpack Compose
- `tester` - JUnit, Espresso

### Component Distribution

```
SOURCE: epost_agent_kit repository
    ↓
    ├─→ Claude Code: .claude/agents/*.md + .claude/skills/ + CLAUDE.md
    ├─→ Cursor: AGENTS.md + .cursor/rules/*.mdc + .cursor/commands/
    └─→ Copilot: .github/agents/*.agent.md + .github/instructions/ + .github/prompts/
```

---

## Implementation Roadmap

### Phase 0: Dependencies & Audit (1h)
- Audit existing agents, skills, commands
- Document cross-platform format requirements
- Prepare tool ecosystem (commander, fs utilities)

### Phase 1: Rules Foundation (2h)
- Create `.claude/rules/` governance files
- Define primary workflow, development rules, orchestration protocol

### Phase 2: Global Agents Restructuring (4h)
- Rename agents (planner→architect, etc.)
- Create orchestrator, merge PM+performance duties
- Update command references

### Phase 3: Web Platform Agents (3h)
- Create web/implementer, web/tester, web/designer
- Move platform-specific skills

### Phase 4: Functional Verification (2h)
- Test agent routing and delegation
- Verify all commands work
- End-to-end smoke tests

### Phase 5: iOS Platform Agents (3h)
- Create ios/implementer, ios/tester, ios/simulator

### Phase 6: Android Platform Agents (2h)
- Create android/implementer, android/tester

### Phase 7: CLI Build (8h)
- Implement discovery, installer, converter
- Build package.json, commander interface
- Create validation tool

### Phase 8: Platform Sync (4h)
- Generate Cursor AGENTS.md and rules
- Generate Copilot agents and instructions
- Test all platform output

### Phase 9: E2E Verification (3h)
- Verify each platform independently
- Cross-platform command testing
- Documentation review

**Total Effort**: 32 hours

---

## Technical Constraints

### Component Specifications

**Agent Frontmatter** (Claude Code):
- `name` - Unique identifier (required)
- `description` - 1-2 sentences (required)
- `tools` - Allowlist of tools (optional, defaults to all)
- `model` - Override model (optional)
- `color` - UI color (optional)

**Rules Format**:
- Claude Code: Sections in CLAUDE.md
- Cursor: `.mdc` files with YAML frontmatter
- Copilot: `.instructions.md` with `applyTo` globs

**Command/Skill Format**:
- Claude Code: Markdown + optional YAML in `.claude/skills/*/SKILL.md`
- Cursor: Plain markdown (no frontmatter) in `.cursor/commands/`
- Copilot: Markdown + YAML in `.github/prompts/`

### Size Limits

- **Agent prompts**: Max 200 lines
- **Individual skills**: Max 300 lines
- **CLAUDE.md**: Max 400 lines (split rules as needed)
- **Commands**: Max 150 lines (split into skills for larger content)

### Cross-Platform Compatibility

- Agents must work with auto-delegation (Cursor AGENTS.md)
- Commands must be convertible between markdown formats
- Tools must exist on all platforms (or map to equivalents)
- No platform-specific secret keys or credentials

---

## Dependencies

### External Skills (Global)
- `anthropics/skill-creator` - Create new skills
- `vercel-labs/find-skills` - Discover skills

### Technology Stack

**CLI Tool**:
- Node.js 18+ (LTS)
- TypeScript 5+
- Commander.js (CLI framework)
- zod (schema validation)

**Agent Platforms**:
- Claude Code SDK
- Cursor API (AGENTS.md spec)
- GitHub Copilot REST API

**Testing**:
- Vitest
- Playwright (cross-platform testing)
- Manual IDE testing

---

## Verification Checklist

### Agent Restructuring Phase
- [ ] 9 global agents exist with correct names
- [ ] Platform agents created in web/, ios/, android/
- [ ] `/core:cook` detects platform and delegates
- [ ] `/web:cook` routes to web/implementer directly
- [ ] All old agent names removed from codebase

### Distribution CLI Phase
- [ ] `npm run build` compiles without errors
- [ ] `npx epost-kit list` shows all components
- [ ] `npx epost-kit install --target claude` creates valid files
- [ ] `npx epost-kit install --target cursor` generates AGENTS.md
- [ ] `npx epost-kit install --target copilot` generates agents
- [ ] `npx epost-kit validate` passes all checks

### Platform Sync Phase
- [ ] Claude Code: All subagents load and delegate correctly
- [ ] Cursor: AGENTS.md readable, rules applied, commands available
- [ ] Copilot: Agents valid with correct frontmatter, handoffs working

### Documentation Phase
- [ ] README.md complete with examples
- [ ] API documentation comprehensive
- [ ] Architecture diagrams clear and accurate
- [ ] Getting started guide for each platform
- [ ] Troubleshooting section included

---

## Metrics & KPIs

### Success Metrics
- **Zero manual rewrites**: 100% component conversion fidelity
- **Fast installation**: `npx epost-kit install` < 30 seconds
- **High discovery**: CLI shows 100+ discoverable components
- **Cross-platform parity**: Same functionality on all 3 IDEs
- **Documentation quality**: 0 reported docs gaps after launch

### Adoption Metrics (Post-Launch)
- Number of teams using epost-kit
- Skills created via CLI per month
- GitHub stars and forks
- Integration success rate (new agents added)

---

## Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Agent naming conflicts | Commands fail to route | Medium | Strict naming conventions, audit pre-launch |
| Cross-platform conversion bugs | Broken features on some IDEs | High | Extensive cross-platform testing |
| Large agent prompts | Exceeds IDE limits | Medium | Enforce 200-line limit during review |
| Tool availability | Some platforms missing tools | Low | Map tools, provide fallbacks |
| Breaking changes | Existing users affected | Low | Versioning, changelog, migration guide |

---

## Next Steps (Immediate)

1. **Phase 0**: Run dependency audit and document findings
2. **Phase 1**: Create `.claude/rules/` files with governance structure
3. **Phase 2**: Begin agent restructuring (start with orchestrator)
4. **Phase 3-4**: Complete agent restructuring and verification
5. **Phase 5-9**: CLI implementation, platform sync, launch

---

**Project Maintained By**: Klara-copilot GitHub Organization
**Created By**: Phuong Doan
**Last Updated**: 2026-02-05
**Current Status**: Planning & Requirements Phase
