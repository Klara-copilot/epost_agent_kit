---
name: cli-development
description: This skill should be used when working on "epost-kit CLI", "epost-agent-cli", "CLI commands", "terminal UI", "cli-table3", "Commander", "inquirer prompts", "CLI onboarding", "CLI branding", or any TypeScript code in the epost-agent-cli directory.
user-invocable: false
---

# epost-kit CLI Development

Domain knowledge for developing the `epost-kit` CLI tool — the installation and management interface for the epost_agent_kit ecosystem.

## Tech Stack

| Dependency | Purpose | Import |
|-----------|---------|--------|
| Commander | Command definitions and argument parsing | `import { Command } from "commander"` |
| @inquirer/prompts | Interactive prompts (select, confirm, checkbox) | `import { select, confirm, checkbox } from "@inquirer/prompts"` |
| ora | Terminal spinners for async operations | `import ora from "ora"` |
| picocolors | Zero-dependency terminal color output | `import pc from "picocolors"` |
| cli-table3 | Table rendering with box-drawing characters | `import Table from "cli-table3"` |
| vitest | Unit and integration testing | `import { describe, it, expect } from "vitest"` |
| js-yaml | YAML parsing for manifests and profiles | `import yaml from "js-yaml"` |

**Runtime**: Node.js 18+, TypeScript 5+, ESM modules (`"type": "module"` in package.json).

## Architecture

```
epost-agent-cli/
  src/
    index.ts              # Entry point, Commander program setup
    commands/             # Command handlers (one file per command)
      init.ts             # epost-kit init (main install flow, ~900 lines)
      onboard.ts          # epost-kit onboard (guided wizard)
      doctor.ts           # epost-kit doctor (health checks)
      profile.ts          # epost-kit profile list|show
      package.ts          # epost-kit package list|add|remove
      update.ts           # epost-kit update
      uninstall.ts        # epost-kit uninstall
      versions.ts         # epost-kit versions
      new.ts              # epost-kit new agent|skill|command
      dev.ts              # epost-kit dev (development server)
      workspace.ts        # epost-kit workspace
    core/                 # Shared utility modules
      ui.ts               # Display primitives (box, table, tree, badge, etc.)
      branding.ts         # ASCII logo, version, tagline constants
      logger.ts           # Logging with colored output + spinner
      package-resolver.ts # Manifest loading, dependency resolution, profile matching
      profile-loader.ts   # Profile YAML parsing, team matching, auto-detect
      ownership.ts        # .epost-metadata.json read/write
      file-system.ts      # File existence checks, safe copy, directory operations
      smart-merge.ts      # Three-way merge for config file updates
      settings-merger.ts  # Settings.json merge strategies
      checksum.ts         # SHA-256 file hashing for integrity
      health-checks.ts    # Health check definitions for doctor command
      backup-manager.ts   # Backup creation before updates
      template-manager.ts # Kit template download from GitHub
      claude-md-generator.ts # CLAUDE.md assembly from package snippets
    types/
      command-options.ts  # TypeScript interfaces for all command option types
  tests/
    unit/core/            # Unit tests for core modules
    unit/commands/        # Unit tests for command handlers
    integration/          # Integration tests (full command flows)
    helpers/              # Test utilities (createTempDir, cleanupTempDir)
  plans/                  # Implementation plan tracking
    INDEX.md              # Plan index with ID, title, date, file
    index.json            # Machine-readable plan index
    completed/            # Completed plan files
    reports/              # Agent reports and analysis
  dist/                   # Compiled JavaScript output
  package.json            # Dependencies and scripts
  tsconfig.json           # TypeScript configuration
```

## Key Patterns

### UI Module Pattern

All `ui.ts` functions return strings — callers decide when and where to print. This enables testability and composition.

```typescript
import { box, heading, stepHeader, packageTable } from "../core/ui.js";

// Caller prints
console.log(heading("Health Check Results"));
console.log(box("content", { title: "Summary" }));
logger.step(1, 5, "Selecting profile");
```

### NO_COLOR / CI Compatibility

All display functions check `NO_COLOR` env var and `TERM=dumb` for ASCII fallback. CI mode is detected via `CI`, `GITHUB_ACTIONS`, `JENKINS_URL`, `BUILDKITE` env vars.

```typescript
// Box characters: ┌─┐│└─┘ → +|-  in NO_COLOR
// Tree connectors: ├── └── │ → |-- `-- |  in NO_COLOR
// Colors: stripped entirely in NO_COLOR
```

### Command Handler Pattern

Each command exports an async function matching `run<CommandName>(opts: <CommandName>Options): Promise<void>`. Options are typed in `types/command-options.ts`.

```typescript
// src/commands/doctor.ts
export async function runDoctor(opts: DoctorOptions): Promise<void> { ... }

// src/types/command-options.ts
export interface DoctorOptions {
  fix?: boolean;
  report?: boolean;
}
```

### Package Manifest System

Packages are defined in `packages/<name>/package.yaml` with structured metadata:

```yaml
name: core
description: Foundation agents, skills, and commands
layer: 0
platforms: [claude-code]
dependencies: []
provides:
  agents: [epost-orchestrator, epost-architect, ...]
  skills: [core, planning, debugging, ...]
  commands: [cook, plan, review, ...]
files:
  agents/: agents/
  skills/: skills/
  commands/: commands/
```

Load manifests via `loadAllManifests(packagesDir)` from `package-resolver.ts`.

### Profile System

Profiles in `profiles/profiles.yaml` define developer role presets:

```yaml
profiles:
  web-b2b-fullstack:
    displayName: "Web B2B Developer (Fullstack)"
    teams: [miracle, atlas]
    packages: [core, platform-web, platform-backend, domain-b2b, ui-ux]
    optional: [arch-cloud]
```

Load via `loadProfiles(path)` and query with `listProfiles()`, `findProfilesByTeam()`, `getProfileInfo()`.

## Testing Patterns

- Use `vitest` (not Jest) — `describe`, `it`, `expect` from `vitest`
- Unit tests: `tests/unit/core/<module>.test.ts`
- Integration tests: `tests/integration/<command>.test.ts`
- For env-dependent tests, use dynamic `import()` to pick up env changes:
  ```typescript
  async function loadUi(env: Record<string, string | undefined> = {}) {
    process.env = { ...originalEnv, ...env };
    return await import("../../../src/core/ui.js");
  }
  ```
- Test helpers: `createTempDir()`, `cleanupTempDir()` from `tests/helpers/test-utils.ts`
- Run tests: `npx vitest run` (all) or `npx vitest run tests/unit/core/ui.test.ts` (specific)
- Build check: `npx tsc --noEmit`

## Build & Run

```bash
cd epost-agent-cli
npm install           # Install dependencies
npm run build         # Compile TypeScript (tsc)
npx tsc --noEmit      # Type check without emitting
npx vitest run        # Run all tests
npm run lint          # ESLint
```

## Plan Tracking

Plans follow the Plan Storage & Index Protocol:
- `plans/INDEX.md` — Markdown table with ID, title, agent, date, file path
- `plans/index.json` — Machine-readable with counts (active/completed/archived/total)
- `plans/completed/` — Completed plan files
- `plans/reports/` — Agent reports and analysis

New plans get sequential IDs (PLAN-0001, PLAN-0002, ...) and must update both INDEX.md and index.json.
