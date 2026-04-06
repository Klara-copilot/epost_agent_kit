---
phase: 4
title: "JetBrains Adapter"
effort: 2h
depends: []
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/`
- JetBrains format: Single `AGENTS.md` at project root (GA, stable)
- ACP (Agent Client Protocol) coming Q2 2026 — out of scope

## Overview

Add a JetBrainsAdapter that generates a single `AGENTS.md` file at project root. This file is auto-loaded by JetBrains AI (IntelliJ, WebStorm, etc.) to provide context about the project's agent system.

The adapter is intentionally simple — JetBrains currently only supports a single markdown guidance file. No agents, no skills, no hooks. Just a well-structured `AGENTS.md` that explains the project and its conventions.

## Requirements

### 4a. Create JetBrainsAdapter

**File**: `src/domains/installation/jetbrains-adapter.ts`

```typescript
export class JetBrainsAdapter implements TargetAdapter {
  readonly name = "jetbrains" as const;
  readonly installDir = ".";  // AGENTS.md goes at project root

  transformAgent(content: string, filename: string): TransformResult {
    // JetBrains doesn't have individual agent files
    // Agents are listed in AGENTS.md preamble
    return { content, filename };
  }

  transformSkill(content: string): string {
    return content; // Skills not used
  }

  transformHooks(): null {
    return null; // No hooks support
  }

  usesSettingsJson(): boolean {
    return false;
  }

  hookScriptDir(): string {
    return "hooks"; // unused
  }

  rootInstructionsFilename(): string {
    return "AGENTS.md";
  }

  replacePathRefs(content: string): string {
    return content; // No path replacement needed
  }

  getWarnings(): CompatibilityWarning[] {
    // Warn that most features are not supported
    return [{
      severity: "medium",
      category: "config",
      feature: "agent system",
      source: "JetBrains target",
      reason: "JetBrains only supports AGENTS.md — agents, skills, hooks, and commands are represented as documentation only",
    }];
  }
}
```

### 4b. Register in factory

**File**: `src/domains/installation/target-adapter.ts`

Add to `TargetName` type: `"jetbrains"`
Add to `createTargetAdapter` switch:

```typescript
case "jetbrains": {
  const { JetBrainsAdapter } = await import("./jetbrains-adapter.js");
  return new JetBrainsAdapter();
}
```

### 4c. AGENTS.md generation

**File**: `src/commands/init.ts`

For jetbrains target, instead of copying agents/skills/hooks, generate a single `AGENTS.md`:

```markdown
# Project Agent System

This project uses epost_agent_kit, a multi-agent development toolkit.

## Available Agents

| Agent | Purpose |
|-------|---------|
| epost-fullstack-developer | Build, implement, multi-file changes |
| epost-debugger | Fix bugs, diagnose errors |
| epost-planner | Design phased implementation plans |
| ... |

## Conventions

[Assembled from CLAUDE.snippet.md content — same snippets, different assembly]

## Platform Stack

[Web: Next.js 14, React 18, TypeScript...]
[iOS: Swift 6, SwiftUI...]
[Backend: Java 8, Jakarta EE...]
```

The content is assembled from the same `claude_snippet` content used for CLAUDE.md, but formatted as a single flat document.

### 4d. Skip file copy for jetbrains

JetBrains target should NOT copy agents/, skills/, hooks/, commands/ directories. Only generate `AGENTS.md`.

## Files to Create/Modify

| File (CLI repo) | Action |
|-----------------|--------|
| `src/domains/installation/jetbrains-adapter.ts` | Create |
| `src/domains/installation/target-adapter.ts` | Modify — add `jetbrains` to TargetName, factory |
| `src/commands/init.ts` | Modify — add jetbrains-specific generation path |

## TODO

- [ ] Create JetBrainsAdapter class
- [ ] Add `jetbrains` to TargetName type
- [ ] Add jetbrains case to factory
- [ ] Add AGENTS.md generation logic in init.ts
- [ ] Skip directory copy for jetbrains target
- [ ] Update `validTargets` array in init.ts
- [ ] Test: `epost-kit init --target jetbrains --yes` → verify AGENTS.md generated
- [ ] Test: No `.jetbrains/` or other dirs created — only AGENTS.md

## Success Criteria

- `epost-kit init --target jetbrains` produces `AGENTS.md` at project root
- `AGENTS.md` contains agent routing table and platform conventions
- No other files created (no agents/, skills/, hooks/ directories)
- Compatibility report notes limited feature support
