# System Architecture

epost_agent_kit implements a **parent-child delegation architecture** where global agents orchestrate work and platform-specific agents execute within their domain. This design enables single-source-of-truth component definitions that automatically convert across multiple IDEs.

## Quick Start

**New to epost_agent_kit?** Start here:
1. Understand the [delegation model](./architecture/delegation-model.md) - How agents route work
2. Learn about [agents and roles](./architecture/agents-and-roles.md) - 19 agents working together
3. Explore [platform specialization](./architecture/platform-specialization.md) - Web, iOS, Android

**Advanced features**:
- [Cook command variants](./architecture/cook-command-variants.md) - 4 implementation strategies
- [Skill discovery system](./architecture/skill-discovery.md) - Automated skill loading
- [Planning subsystem](./architecture/planning-subsystem.md) - Task planning patterns
- [Session state management](./architecture/session-state-management.md) - Plan persistence

**Deployment & Integration**:
- [Component mapping](./architecture/component-mapping.md) - IDE conversions
- [Installation & deployment](./architecture/installation-deployment.md) - CLI workflow
- [Extension points](./architecture/extension-points.md) - Adding new components

## Core Principles

1. **Separation of Concerns**: Global agents coordinate; platform agents execute
2. **Single Source of Truth**: Define once, deploy everywhere
3. **Explicit Delegation**: Parent agents never write platform-specific code
4. **Modular Components**: Agents, skills, rules, commands organized by platform
5. **Cross-Platform Parity**: Same functionality across Claude Code, Cursor, Copilot

## Architecture Overview

### Global Layer (9 agents)
- **Orchestrator** - Task router and project manager
- **Architect** - Design and planning
- **Implementer** - Coordinate implementation
- **Reviewer** - Code review and QA
- **Researcher** - Multi-source research
- **Debugger** - Issue diagnosis
- **Tester** - Test orchestration
- **Documenter** - Documentation generation
- **Git-Manager** - Version control

### Specialized Layer (4 agents)
- **Designer** - UI/UX specialist
- **Copywriter** - Content expert
- **Journal-Writer** - Session documentation
- **MCP-Manager** - Protocol integration

### Platform Layer
- **Web**: implementer, tester, designer
- **iOS**: implementer, tester, simulator
- **Android**: implementer, tester

## Key Features (v1.1.0)

### Phase 1: Cook Variants ✓
- `/cook` - Standard implementation
- `/cook:auto` - AI-driven selection
- `/cook:auto:fast` - Speed optimized
- `/cook:auto:parallel` - Multi-module

### Phase 2: New Agents ✓
- 4 specialized agents (Designer, Copywriter, Journal-Writer, MCP-Manager)
- Expands from 15 to 19 total agents

### Phase 3: Android Completion ✓
- 14 templates, patterns, and test examples
- Full Jetpack Compose support

### Phase 4: Skill Discovery ✓
- Automated metadata indexing
- Context-driven activation
- Performance optimized

### Phase 5: Quality Gates ✓
- 80% coverage enforcement
- Security scanning (secrets detection)
- Code review tracking

### Phase 6: Advanced Features ✓
- Output style profiles
- Agent execution profiler
- Error recovery strategies
- Interactive confirmations

## Project Status

**Version**: 1.1.0 (released 2026-02-06)
**Phases Complete**: 1-6 of 10
**Agents**: 19 (9 global + 4 specialized + 10 platform)
**Test Coverage**: 106/106 passing (100%)
**Quality Gates**: Enforced (coverage + security)

## Navigation

### Reference Docs
- See [agents-and-roles.md](./architecture/agents-and-roles.md) for complete agent list
- See [platform-specialization.md](./architecture/platform-specialization.md) for platform details
- See [skill-discovery.md](./architecture/skill-discovery.md) for skill index schema

### How-To Guides
- [Delegation model](./architecture/delegation-model.md) - Understanding routing
- [Cook variants](./architecture/cook-command-variants.md) - Choosing the right strategy
- [Extension points](./architecture/extension-points.md) - Adding new agents/skills

### Full Architecture Documentation
All detailed documentation has been organized into modular files in the `./architecture/` directory for better maintainability and readability.

---

**Last Updated**: 2026-02-06
**Architecture Owner**: Phuong Doan
**Status**: v1.1.0 Complete - Production-ready with 19 agents, quality gates, skill discovery
