# System Architecture

epost_agent_kit implements a **parent-child delegation architecture** where global agents orchestrate work and platform-specific agents execute within their domain. This design enables single-source-of-truth component definitions that automatically convert across multiple IDEs.

## Core Principles

1. **Separation of Concerns**: Global agents coordinate; platform agents execute
2. **Single Source of Truth**: Define once, deploy everywhere
3. **Explicit Delegation**: Parent agents never write platform-specific code
4. **Modular Components**: Agents, skills, rules, commands organized by platform
5. **Cross-Platform Parity**: Same functionality across Claude Code, Cursor, Copilot

## Architecture Documents

### Foundation
- **[Delegation Model](./delegation-model.md)** - Parent-child agent relationships and routing
- **[Agents & Roles](./agents-and-roles.md)** - 13 global + 4 specialized agents (19 total)
- **[Platform Specialization](./platform-specialization.md)** - Web, iOS, Android agents and skills

### Advanced Systems
- **[Cook Command Variants](./cook-command-variants.md)** - 4 implementation strategies (Phase 1)
- **[Skill Discovery](./skill-discovery.md)** - Metadata-driven skill activation (Phase 4)
- **[Planning Subsystem](./planning-subsystem.md)** - Splash pattern for task planning
- **[Session State Management](./session-state-management.md)** - Plan persistence and hooks

### Distribution & Integration
- **[Component Mapping](./component-mapping.md)** - Claude Code, Cursor, Copilot conversion
- **[Installation & Deployment](./installation-deployment.md)** - CLI workflow and distribution
- **[Extension Points](./extension-points.md)** - Adding agents, platforms, and skills

---

**Version**: 1.1.0 (Phase 1-6 Complete)
**Last Updated**: 2026-02-06
**Architecture Owner**: Phuong Doan
**Status**: Production-ready with 19 agents, 4 cook variants, quality gates
