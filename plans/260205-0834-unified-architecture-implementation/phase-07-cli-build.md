# Phase 7: CLI Build (npx epost-kit)

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 4](phase-04-functional-verification.md)
- Research: [CLI Patterns](research/researcher-02-cli-patterns.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 8h
- **Description**: Build the `npx epost-kit` CLI tool that discovers, installs, converts, and validates agent kit components across Claude Code, Cursor, and Copilot platforms.

## Key Insights
- Commander.js: mature, auto-help, subcommand support (recommended by research)
- Node >= 18 minimum for `fs.cpSync` stable + ESM support
- Flat file copy approach; no heavy dependency resolution needed
- Scoped package: `@klara-copilot/epost-kit` for npm registry
- Cross-platform frontmatter conversion is the core complexity:
  - Claude: `name, description, tools, model, color`
  - Cursor: `description, globs, alwaysApply` (rules only; no agent frontmatter)
  - Copilot: `name, description, tools, model, target, handoffs`

## Requirements

### Functional

**CLI Commands**:
- `epost-kit install` - Install components to target platform workspace
- `epost-kit list` - List available components grouped by type and platform
- `epost-kit create <type> <platform> <name>` - Scaffold new component from template
- `epost-kit validate` - Validate all components against specs

**Core Modules**:
- `discovery.ts` - Scan repo for agents, skills, commands, rules by convention
- `installer.ts` - Copy/convert assets to target workspace paths
- `resolver.ts` - Resolve cross-component dependencies
- `targets.ts` - Target path definitions per platform
- `lock.ts` - Track installed components (.epost-kit.lock)

**Supported Targets**:
- `claude` (default) - Native Claude Code format
- `cursor` - Convert to AGENTS.md + .cursor/rules/*.mdc + .cursor/commands/*.md
- `copilot` - Convert to .github/agents/*.agent.md + instructions + prompts

**Flags**:
- `--target <claude|cursor|copilot|all>` (default: claude)
- `--platform <web|ios|android|all>` (default: all)
- `--global` (install to user-level dirs instead of project)
- `--force` (overwrite existing)
- `--dry-run` (show what would happen)

### Non-Functional
- Zero runtime dependencies beyond Commander.js and Node built-ins
- TypeScript source, compiled to JS for distribution
- Node >= 18 engine requirement
- Package size < 500KB published

## Architecture

### Project Structure
```
cli/
  package.json
  tsconfig.json
  bin/
    cli.js                  # Shebang entry point
  src/
    index.ts                # Commander setup + command registration
    commands/
      install.ts            # Discovery -> filter -> convert -> copy
      list.ts               # List components by type/platform
      create.ts             # Scaffold from templates
      validate.ts           # Validate spec compliance
    core/
      discovery.ts          # Scan repo for components
      installer.ts          # Copy/convert to target paths
      converter.ts          # Frontmatter conversion between platforms
      targets.ts            # Target path definitions
      lock.ts               # Installed component tracking
      types.ts              # Shared TypeScript types
    templates/
      agent.md.tmpl         # Agent template
      skill.md.tmpl         # SKILL.md template
      command.md.tmpl       # Command template
```

### Data Flow
```
epost-kit install --target cursor --platform web
  |
  [1] discovery.ts scans repo:
      - .claude/agents/*.md, .claude/agents/web/*.md
      - .claude/skills/web/*/SKILL.md
      - .claude/commands/web/*.md
      - .claude/rules/*.md
  |
  [2] resolver.ts filters by platform (web):
      - global agents + web/* agents
      - shared skills + web/* skills
      - global commands + web/* commands
      - all rules
  |
  [3] converter.ts transforms frontmatter:
      - Agents -> AGENTS.md (combined, markdown sections)
      - Rules -> .cursor/rules/*.mdc (frontmatter conversion)
      - Skills -> .cursor/commands/*.md (skill -> command)
      - Commands -> .cursor/commands/*.md (direct copy)
  |
  [4] installer.ts writes to target workspace:
      - AGENTS.md
      - .cursor/rules/*.mdc
      - .cursor/commands/*.md
  |
  [5] lock.ts writes .epost-kit.lock with installed component list
```

### Conversion Logic

**Agent conversion**:
| Source (Claude) | Target (Cursor) | Target (Copilot) |
|---|---|---|
| `.claude/agents/X.md` | Section in `AGENTS.md` | `.github/agents/X.agent.md` |
| `name:` | Section heading | `name:` |
| `description:` | Section body | `description:` |
| `tools:` | N/A (not supported) | `tools: ['read', 'edit/editFiles']` (mapped) |
| `model:` | N/A | `model:` |
| Body (prompt) | Section content | Body (prompt) |

**Rule conversion**:
| Source | Target (Cursor) | Target (Copilot) |
|---|---|---|
| `CLAUDE.md` | `.cursor/rules/global.mdc` (alwaysApply: true) | `.github/copilot-instructions.md` |
| `.claude/rules/X.md` | `.cursor/rules/X.mdc` | `.github/instructions/X.instructions.md` |

**Skill/Command conversion**:
| Source | Target (Cursor) | Target (Copilot) |
|---|---|---|
| `.claude/skills/X/SKILL.md` | `.cursor/commands/X.md` | `.github/prompts/X.prompt.md` |
| `.claude/commands/X.md` | `.cursor/commands/X.md` | `.github/prompts/X.prompt.md` |

## Related Code Files

### Create
- `cli/package.json`
- `cli/tsconfig.json`
- `cli/bin/cli.js`
- `cli/src/index.ts`
- `cli/src/commands/install.ts`
- `cli/src/commands/list.ts`
- `cli/src/commands/create.ts`
- `cli/src/commands/validate.ts`
- `cli/src/core/discovery.ts`
- `cli/src/core/installer.ts`
- `cli/src/core/converter.ts`
- `cli/src/core/targets.ts`
- `cli/src/core/lock.ts`
- `cli/src/core/types.ts`
- `cli/src/templates/agent.md.tmpl`
- `cli/src/templates/skill.md.tmpl`
- `cli/src/templates/command.md.tmpl`

## Implementation Steps

### Step 1: Initialize project
```bash
mkdir -p cli/bin cli/src/commands cli/src/core cli/src/templates
```

Create `package.json`:
```json
{
  "name": "@klara-copilot/epost-kit",
  "version": "0.1.0",
  "description": "Agent kit distribution CLI for Claude Code, Cursor, and Copilot",
  "type": "module",
  "bin": { "epost-kit": "./bin/cli.js" },
  "files": ["bin/", "dist/", "templates/"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "engines": { "node": ">=18" },
  "dependencies": { "commander": "^12.0.0" },
  "devDependencies": { "typescript": "^5.0.0", "@types/node": "^20.0.0" }
}
```

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

### Step 2: Create types.ts
Define shared types:
```typescript
export type Platform = 'web' | 'ios' | 'android';
export type Target = 'claude' | 'cursor' | 'copilot';
export type ComponentType = 'agent' | 'skill' | 'command' | 'rule' | 'workflow';

export interface Component {
  type: ComponentType;
  name: string;
  platform: Platform | 'global';
  path: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface InstallOptions {
  target: Target;
  platform: Platform | 'all';
  global: boolean;
  force: boolean;
  dryRun: boolean;
}
```

### Step 3: Implement discovery.ts
- Scan `.claude/agents/` for `*.md` files (recursive)
- Scan `.claude/skills/` for `*/SKILL.md` files (recursive)
- Scan `.claude/commands/` for `*.md` files (recursive)
- Scan `.claude/rules/` for `*.md` files
- Parse frontmatter from each file
- Classify platform from path (web/, ios/, android/, or global)
- Return `Component[]`

### Step 4: Implement targets.ts
Define output paths per target:
```typescript
export const TARGET_PATHS: Record<Target, Record<ComponentType, string>> = {
  claude: {
    agent: '.claude/agents',
    skill: '.claude/skills',
    command: '.claude/commands',
    rule: '.claude/rules',
    workflow: '.claude/workflows'
  },
  cursor: {
    agent: '', // -> AGENTS.md
    skill: '.cursor/commands',
    command: '.cursor/commands',
    rule: '.cursor/rules',
    workflow: '.cursor/rules'
  },
  copilot: {
    agent: '.github/agents',
    skill: '.github/prompts',
    command: '.github/prompts',
    rule: '.github/instructions',
    workflow: '.github/workflows'
  }
};
```

### Step 5: Implement converter.ts
- `convertAgent(component, target)` - Transform agent frontmatter + body
- `convertRule(component, target)` - Transform rule frontmatter
- `convertSkill(component, target)` - Transform SKILL.md to command/prompt
- Handle tool name mapping (Claude -> Copilot):
  - `Read` -> `read`, `Edit`/`Write` -> `edit/editFiles`, `Grep`/`Glob` -> `search/codebase`

### Step 6: Implement installer.ts
- `install(components, options)` - Write converted files to target paths
- Check existing files (skip unless --force)
- Create directories recursively
- Log operations (created, skipped, overwritten)

### Step 7: Implement lock.ts
- Write `.epost-kit.lock` JSON with installed component names + versions
- Read lock to detect what's already installed

### Step 8: Implement commands
- `install.ts`: discovery -> filter by platform -> convert -> install -> lock
- `list.ts`: discovery -> group by type+platform -> display table
- `create.ts`: read template -> replace placeholders -> write to correct path
- `validate.ts`: discovery -> validate each component's frontmatter + structure

### Step 9: Create index.ts (Commander CLI)
```typescript
import { Command } from 'commander';
const program = new Command();
program.name('epost-kit').description('Agent kit distribution CLI').version('0.1.0');
// Register subcommands
program.parse();
```

### Step 10: Create bin/cli.js
```javascript
#!/usr/bin/env node
import '../dist/index.js';
```

### Step 11: Build and verify
```bash
cd cli && npm install && npm run build
node bin/cli.js --help
node bin/cli.js list
```

## Todo List

- [ ] Initialize cli/ project structure
- [ ] Create package.json with correct bin/files/engines
- [ ] Create tsconfig.json
- [ ] Implement types.ts
- [ ] Implement discovery.ts (scan repo)
- [ ] Implement targets.ts (path definitions)
- [ ] Implement converter.ts (frontmatter transformation)
- [ ] Implement installer.ts (file copy/write)
- [ ] Implement lock.ts (tracking)
- [ ] Implement install command
- [ ] Implement list command
- [ ] Implement create command
- [ ] Implement validate command
- [ ] Create index.ts (Commander CLI)
- [ ] Create bin/cli.js entry point
- [ ] Create templates (agent, skill, command)
- [ ] Build TypeScript
- [ ] Verify `epost-kit list` works
- [ ] Verify `epost-kit install --target claude` works
- [ ] Verify `epost-kit install --target cursor` produces correct output
- [ ] Verify `epost-kit validate` reports issues

## Success Criteria

- `npm run build` in cli/ compiles without errors
- `npx epost-kit list` shows all components grouped by platform
- `npx epost-kit install --target claude --platform web` copies correct files
- `npx epost-kit install --target cursor` generates AGENTS.md + .cursor/rules + .cursor/commands
- `npx epost-kit install --target copilot` generates .github/agents + instructions + prompts
- `npx epost-kit create skill android my-skill` scaffolds correct directory
- `npx epost-kit validate` reports spec compliance for all components
- Package size < 500KB

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cursor AGENTS.md format underdocumented | Generated file may not work | Follow agents.md spec; test in Cursor manually |
| Copilot handoffs VS Code only | handoffs field ignored on github.com | Include in output but document limitation |
| Frontmatter parsing edge cases | Conversion breaks | Use simple regex for frontmatter (no heavy YAML lib) |
| Large component count slows discovery | CLI slow | Use fs.readdirSync, not recursive glob; component count is small (<50) |

## Security Considerations
- CLI reads files but does not execute arbitrary code
- No network requests (local file operations only)
- No secrets in generated output
- Published package includes only dist/, bin/, templates/

## Next Steps
- Phase 8 uses CLI to actually sync/generate files for Cursor and Copilot targets
- Phase 9 verifies generated output across platforms
