# System Architecture

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## High-Level Overview

epost_agent_kit implements a **multi-platform agent distribution framework** using a **parent-child delegation architecture**. The system enables a single source of truth for AI agents, skills, and commands that automatically converts and distributes across Claude Code, Cursor, and GitHub Copilot.

```
┌──────────────────────────────────────────────────────────────┐
│                        User Request                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Orchestrator Agent                        │
│  • Routes tasks to appropriate global agents                 │
│  • Manages project-level coordination                        │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Global Agents                             │
│  ┌─────────────┬──────────────┬───────────────┬──────────┐  │
│  │  Architect  │  Implementer │   Reviewer    │  Tester  │  │
│  └──────┬──────┴──────┬───────┴───────┬───────┴────┬─────┘  │
│         │             │               │            │         │
└─────────┼─────────────┼───────────────┼────────────┼─────────┘
          │             │               │            │
          ▼             ▼               ▼            ▼
┌──────────────────────────────────────────────────────────────┐
│                   Platform Agents                            │
│  ┌──────────────┬──────────────┬──────────────┬──────────┐  │
│  │     Web      │     iOS      │   Android    │  Backend │  │
│  │  Next.js     │   Swift 6    │   Kotlin     │  Java EE │  │
│  │  React       │   SwiftUI    │   Compose    │  WildFly │  │
│  └──────────────┴──────────────┴──────────────┴──────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. CLI Distribution System

**Purpose**: Package management and distribution tool

**Key Files**:
- `epost-agent-cli/src/cli.ts` - Entry point
- `epost-agent-cli/src/core/package-manager.ts` - Package operations
- `epost-agent-cli/src/core/profile-loader.ts` - Profile management
- `epost-agent-cli/src/core/template-manager.ts` - Template processing
- `epost-agent-cli/src/core/backup-manager.ts` - Backup/restore

**Responsibilities**:
- Install agent kits into target IDEs
- Manage package versions and dependencies
- Handle profile-based installations
- Backup and restore configurations
- Generate platform-specific files

**Dependencies**:
- Commander.js for CLI framework
- Inquirer for interactive prompts
- Cosmiconfig for configuration loading
- Zod for validation

### 2. Agent Orchestration Layer

**Purpose**: Coordinate multi-agent workflows

**Key Files**:
- `.claude/agents/epost-orchestrator.md` - Main router
- `.claude/agents/epost-architect.md` - System design
- `.claude/agents/epost-planner.md` - Plan creation
- `.claude/agents/epost-implementer.md` - Implementation coordination

**Responsibilities**:
- Route tasks to appropriate agents
- Manage agent lifecycle
- Coordinate multi-agent workflows
- Handle context and state
- Report progress and results

**Agent Types**:
1. **Core Agents** (12): Orchestration, coordination, and general tasks
2. **Platform Agents** (4): Domain-specific execution (web, ios, android, backend)
3. **Specialized Agents** (4): Specific capabilities (scout, muji, cli-developer, brainstormer)

### 3. Platform Integration System

**Purpose**: Enable platform-specific implementations

**Architecture**:
```
packages/
├── platform-web/          # Web platform
│   ├── agents/
│   ├── skills/
│   └── commands/
├── platform-ios/          # iOS platform
│   ├── agents/
│   ├── skills/
│   └── commands/
├── platform-android/      # Android platform
│   ├── agents/
│   ├── skills/
│   └── commands/
└── platform-backend/      # Backend platform
    ├── agents/
    ├── skills/
    └── commands/
```

**Responsibilities**:
- Provide platform-specific implementations
- Maintain platform expertise
- Handle platform tooling
- Execute platform tasks
- Report results to global agents

### 4. Package Management System

**Purpose**: Modular component installation

**Key Files**:
- `packages/*/package.yaml` - Package metadata
- `epost-agent-cli/src/core/package-resolver.ts` - Dependency resolution
- `epost-agent-cli/src/core/checksum.ts` - Integrity verification

**Package Structure**:
```yaml
# package.yaml
name: platform-web
version: 0.1.0
description: Web platform components
category: platform

depends:
  - core

agents:
  - epost-web-developer

skills:
  - web/frontend-development
  - web/nextjs
  - web/klara-theme

commands:
  - web:cook
  - web:test
```

**Resolution Process**:
1. Load package metadata
2. Resolve dependencies recursively
3. Verify checksums
4. Install in dependency order
5. Generate platform files

### 5. Template Conversion System

**Purpose**: Convert components across platforms

**Key Files**:
- `epost-agent-cli/src/core/template-manager.ts` - Template processing
- `epost-agent-cli/src/core/claude-md-generator.ts` - Claude format

**Conversion Matrix**:
| Component | Claude Code | Cursor | GitHub Copilot |
|-----------|------------|--------|----------------|
| Agents | `.claude/agents/*.md` | `AGENTS.md` | `.github/agents/*.agent.md` |
| Rules | `CLAUDE.md` | `.cursor/rules/*.mdc` | `.github/instructions/*.instructions.md` |
| Commands | `.claude/commands/*.md` | `.cursor/commands/*.md` | `.github/prompts/*.prompt.md` |
| Skills | `.claude/skills/*/SKILL.md` | Merged into rules | Merged into instructions |

**Conversion Process**:
1. Parse source format (frontmatter + content)
2. Extract metadata and content
3. Transform to target format
4. Apply platform-specific adjustments
5. Write to target location

### 6. Configuration Management

**Purpose**: Handle settings and configuration

**Key Files**:
- `.epost-metadata.json` - Kit metadata
- `.claude/settings.json` - Claude settings
- `epost-agent-cli/src/core/config-loader.ts` - Config loading
- `epost-agent-cli/src/core/settings-merger.ts` - Settings merging

**Configuration Layers**:
1. **Kit metadata**: Version, packages, profile
2. **Claude settings**: Workspace, tools, features
3. **Package configs**: Package-specific settings
4. **User overrides**: Local customizations

## Data Flow

### Installation Flow

```
User Command: npx epost-kit install
        ↓
1. Parse CLI arguments
        ↓
2. Load profile (full, minimal, custom)
        ↓
3. Resolve package dependencies
        ↓
4. Backup existing configuration
        ↓
5. Install packages in order
        ↓
6. Convert templates to target platform
        ↓
7. Generate CLAUDE.md
        ↓
8. Merge settings
        ↓
9. Verify installation
        ↓
10. Report success/errors
```

### Agent Delegation Flow

```
User: "/web:cook implement login"
        ↓
1. Orchestrator receives command
        ↓
2. Analyzes context (web platform detected)
        ↓
3. Routes to global implementer
        ↓
4. Implementer analyzes requirements
        ↓
5. Delegates to web-developer agent
        ↓
6. Web-developer implements in Next.js
        ↓
7. Returns result to implementer
        ↓
8. Implementer validates completion
        ↓
9. Reports to orchestrator
        ↓
10. Orchestrator responds to user
```

### Package Resolution Flow

```
Request: Install "platform-web"
        ↓
1. Load platform-web/package.yaml
        ↓
2. Check dependencies: ["core"]
        ↓
3. Load core/package.yaml
        ↓
4. Check dependencies: []
        ↓
5. Build dependency graph
        ↓
6. Install order: [core, platform-web]
        ↓
7. For each package:
   - Copy agents
   - Copy skills
   - Copy commands
   - Convert formats
        ↓
8. Generate CLAUDE.md with all metadata
        ↓
9. Complete
```

## Key Patterns

### 1. Parent-Child Delegation

**Pattern**: Global agents coordinate; platform agents execute

**Implementation**:
```markdown
# Global Agent (epost-implementer.md)

## Process

1. Receive task from orchestrator
2. Analyze requirements and context
3. Detect target platform (web, iOS, Android)
4. Delegate to platform-specific agent
5. Monitor progress
6. Validate result
7. Report back to orchestrator
```

```markdown
# Platform Agent (epost-web-developer.md)

## Process

1. Receive task from global implementer
2. Use web-specific skills and tools
3. Implement in Next.js/React/TypeScript
4. Run platform-specific tests
5. Report result to global agent
```

### 2. Package Composition

**Pattern**: Build functionality from composable packages

**Example**:
```yaml
# Profile: full.yaml
packages:
  - core                    # Base functionality
  - platform-web            # Web platform
  - platform-ios            # iOS platform
  - platform-android        # Android platform
  - ui-ux                   # Design system
  - domain-b2b              # B2B features
  - domain-b2c              # B2C features
```

### 3. Template-Based Generation

**Pattern**: Single source, multiple outputs

**Example**:
```markdown
# Source: epost-web-developer.md (Claude Code)
---
name: epost-web-developer
description: Web platform specialist
---

# epost-web-developer
...
```

**Converts to**:
```markdown
# Target: AGENTS.md (Cursor)
## epost-web-developer
Web platform specialist
...
```

```markdown
# Target: web-developer.agent.md (Copilot)
name: epost-web-developer
description: Web platform specialist
...
```

### 4. Skill Layering

**Pattern**: Core skills + platform skills

**Structure**:
```
.claude/skills/
├── core/                  # Base skills (all platforms)
│   ├── code-review/
│   ├── debugging/
│   └── problem-solving/
├── web/                   # Web-specific
│   ├── nextjs/
│   ├── frontend-development/
│   └── klara-theme/
├── ios/                   # iOS-specific
│   └── ios-development/
└── android/               # Android-specific
    └── android-development/
```

### 5. Profile-Based Installation

**Pattern**: Predefined installation sets

**Profiles**:
- **full**: All packages (development)
- **minimal**: Core only (lightweight)
- **web-only**: Core + web platform
- **mobile-only**: Core + iOS + Android
- **custom**: User-defined selection

### 6. Kit Design Tools Module (meta-kit-design)

**Purpose**: Tooling for creating and managing agents, skills, and commands

**Key Files**:
- `packages/meta-kit-design/skills/command-development/` - Command development skill
- `.claude/commands/meta/generate-command.md` - Command generator router
- `.claude/commands/generate-command/splash.md` - Splash pattern generator
- `.claude/commands/generate-command/simple.md` - Simple command generator

**Capabilities**:
- **Agent Development**: Guidance on creating agents with proper structure
- **Skill Development**: Patterns for frontmatter, organization, references
- **Command Development**: Frameworks for both splash (router + variants) and simple patterns
- **Codebase Exploration**: Multi-platform file discovery and analysis
- **MCP Management**: Integration management for MCP servers

**Agents Provided**:
- `epost-scout` - Codebase exploration across platforms
- `epost-mcp-manager` - MCP server lifecycle management

**Commands Provided**:
- `/meta:generate-command` - Interactive command generator router
- `/generate-command:splash` - Creates splash pattern (router + variants)
- `/generate-command:simple` - Creates standalone command
- `/docs:component` - Documents klara-theme components from Figma

**Skills Provided**:
- `command-development` - Comprehensive command creation patterns (834 lines)
- `agents/claude/agent-development` - Agent creation workflows
- `agents/claude/skill-development` - Skill authoring conventions
- `agents/mental-model` - Mental model development patterns

## Component Interactions

### CLI ↔ File System

```typescript
// CLI commands interact with file system
class PackageManager {
  async install(packageName: string) {
    // 1. Read package metadata
    const pkg = await this.loadPackage(packageName);

    // 2. Copy files
    await this.fs.copyDirectory(
      pkg.sourcePath,
      this.targetPath
    );

    // 3. Convert templates
    await this.templateManager.convert(
      this.targetPath,
      this.targetIDE
    );

    // 4. Update metadata
    await this.updateMetadata(packageName);
  }
}
```

### Agents ↔ Skills

```markdown
# Agent uses skills for knowledge

## epost-web-developer

### Skills
- web/frontend-development - Next.js patterns
- web/nextjs - App Router, Server Components
- web/klara-theme - Design system components

### Process
1. Load relevant skills
2. Apply knowledge to task
3. Use skill-provided patterns
4. Follow skill conventions
```

### Orchestrator ↔ Global Agents

```
Orchestrator receives: "Plan authentication feature"
    ↓
Orchestrator routes to: architect agent
    ↓
Architect agent:
1. Analyzes requirements
2. Delegates research to researcher
3. Creates system design
4. Delegates planning to planner
5. Returns plan to orchestrator
    ↓
Orchestrator returns plan to user
```

### Global Agents ↔ Platform Agents

```
Implementer receives: "Implement login API"
    ↓
Implementer analyzes:
- File types: .ts (TypeScript)
- Framework: Next.js (detected from package.json)
- Platform: Web
    ↓
Implementer delegates to: web-developer
    ↓
Web-developer:
1. Uses web skills
2. Implements in Next.js
3. Writes tests
4. Returns result
    ↓
Implementer validates and reports
```

## Security Considerations

### 1. File Permissions
- Check write permissions before operations
- Validate file paths (no traversal)
- Backup before modifications

### 2. Input Validation
- Validate CLI arguments (Zod schemas)
- Sanitize user input
- Check package names and versions

### 3. Integrity Verification
- Checksum validation for packages
- Verify source signatures
- Detect tampering

### 4. Credential Management
- Never commit secrets
- Use environment variables
- Gitignore sensitive files

## Performance Optimization

### 1. Parallel Operations
- Install independent packages in parallel
- Run tests concurrently
- Batch file operations

### 2. Caching
- Cache package metadata
- Reuse dependency resolution
- Cache template conversions

### 3. Incremental Updates
- Update only changed files
- Skip unchanged packages
- Preserve user modifications

### 4. Lazy Loading
- Load agents on demand
- Defer skill loading
- Stream large files

## Extensibility Points

### 1. Custom Packages
```yaml
# custom-package/package.yaml
name: my-custom-package
version: 1.0.0
agents:
  - my-custom-agent
skills:
  - my-custom-skill
```

### 2. Custom Profiles
```yaml
# profiles/my-profile.yaml
name: my-profile
description: My custom setup
packages:
  - core
  - my-custom-package
```

### 3. Platform Plugins
```typescript
// Add support for new IDEs
interface PlatformPlugin {
  name: string;
  convert(component: Component): string;
  write(path: string, content: string): Promise<void>;
}
```

### 4. Custom Commands
```markdown
# .claude/commands/my-command.md
---
name: my-command
description: My custom command
---

# My Command
Implementation...
```

## Deployment Architecture

### Distribution Channels

1. **npm Registry**:
   ```bash
   npx epost-kit install
   ```

2. **GitHub Releases**:
   ```bash
   curl -O install-macos.sh
   ./install-macos.sh
   ```

3. **Local Development**:
   ```bash
   cd epost-agent-kit
   ./install-macos.sh
   ```

### Installation Targets

| Target | Path | Format |
|--------|------|--------|
| Claude Code | `.claude/` | YAML frontmatter agents |
| Cursor | `.cursor/`, `AGENTS.md` | Markdown agents, rules |
| GitHub Copilot | `.github/` | Agent files, instructions |

## Future Architecture Considerations

### Phase 3-4: Platform Agents
- Enhanced web-developer capabilities
- iOS-developer improvements
- Android-developer enhancements
- Backend-developer integration

### Phase 5-6: Mobile Platforms
- iOS package completion
- Android package completion
- Mobile-specific skills
- Cross-platform patterns

### Phase 7-9: CLI & Sync
- CLI enhancements
- Sync mechanisms
- E2E verification
- Performance optimization

## Related Documents

- [docs/codebase-summary.md](codebase-summary.md) - Codebase overview
- [docs/code-standards.md](code-standards.md) - Coding conventions
- [docs/deployment-guide.md](deployment-guide.md) - Deployment instructions
- [README.md](../README.md) - Quick start guide
