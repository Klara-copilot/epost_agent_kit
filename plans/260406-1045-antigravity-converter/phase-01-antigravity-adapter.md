---
phase: 1
title: "AntigravityAdapter + Init Wiring"
effort: 3h
depends: []
---

## Context

- Plan: [plan.md](plan.md)
- JetBrains adapter (reuse pattern): `epost-agent-kit-cli/src/domains/installation/jetbrains-adapter.ts`
- Target adapter interface: `epost-agent-kit-cli/src/domains/installation/target-adapter.ts`
- Init command: `epost-agent-kit-cli/src/commands/init.ts`
- Init wizard: `epost-agent-kit-cli/src/commands/init-wizard.ts`

## Overview

Create `AntigravityAdapter` that generates `GEMINI.md` (primary) + `AGENTS.md` (cross-tool). Wire into init pipeline.

## File Ownership

| File | Action |
|------|--------|
| `src/domains/installation/antigravity-adapter.ts` | **CREATE** |
| `src/domains/installation/target-adapter.ts` | MODIFY (add to TargetName + factory) |
| `src/commands/init.ts` | MODIFY (add antigravity short-circuit like jetbrains, generate both files) |
| `src/commands/init-wizard.ts` | MODIFY (add antigravity to editor picker) |

## Requirements

### 1. AntigravityAdapter (`antigravity-adapter.ts`)

Create by cloning `jetbrains-adapter.ts` with these changes:

```typescript
export class AntigravityAdapter implements TargetAdapter {
  readonly name = "antigravity" as const;
  readonly installDir = ".";  // GEMINI.md goes at project root

  // All transform methods: same as JetBrains (return null/passthrough)
  // Key difference:
  rootInstructionsFilename(): string {
    return "GEMINI.md";  // Primary file
  }

  getWarnings(): CompatibilityWarning[] {
    return [{
      severity: "medium",
      category: "config",
      feature: "agent system",
      source: "Antigravity target",
      reason: "Antigravity supports GEMINI.md and AGENTS.md only — agents, skills, hooks, and commands are represented as documentation",
    }];
  }
}
```

### 2. TargetName + Factory (`target-adapter.ts`)

- Add `"antigravity"` to `TargetName` union type
- Add case to `createTargetAdapter` factory switch

### 3. Init Command (`init.ts`)

- Add `"antigravity"` to `validTargets` array (~line 247)
- Add antigravity short-circuit block after the jetbrains block (~line 269):
  - Call `runAntigravityInit()` which generates BOTH files:
    - `GEMINI.md` — Antigravity-specific content (uses `generateGeminiMd()`)
    - `AGENTS.md` — Cross-tool standard (reuses existing `generateAgentsMd()`)
- Create `generateGeminiMd()` function — similar to `generateAgentsMd()` but with:
  - Antigravity-specific preamble ("This project uses epost_agent_kit... Open Antigravity to get started.")
  - Same agent routing table
  - Same platform conventions from snippets
  - Additional section: "## Workspace Rules" noting `.agent/rules/` is available for additional context
  - No "Key Commands" section (Antigravity has no slash commands)

### 4. Init Wizard (`init-wizard.ts`)

- Add Antigravity option to editor picker (~line 302-311):
  ```typescript
  { name: `Antigravity      ${pc.dim("→ GEMINI.md")}`, value: "antigravity" as const }
  ```
- Add to `targetLabel` mapping (~line 320-324)
- Add to `installDirName` mapping (~line 331-335) — value: `"."` (project root)

## Key Design Decisions

- **Two files, not one**: GEMINI.md is Antigravity-specific (highest priority in Antigravity), AGENTS.md is the cross-tool standard. Both generated.
- **Reuse `generateAgentsMd()`**: AGENTS.md content is identical to JetBrains output — call the same function
- **Separate `generateGeminiMd()`**: Different preamble, no "Key Commands", adds Antigravity-specific notes
- **Short-circuit like JetBrains**: No directory creation, no file copying — just generate root files

## TODO

- [ ] Create `src/domains/installation/antigravity-adapter.ts`
- [ ] Add `"antigravity"` to `TargetName` union in `target-adapter.ts`
- [ ] Add factory case in `createTargetAdapter()`
- [ ] Add `"antigravity"` to `validTargets` in `init.ts`
- [ ] Create `runAntigravityInit()` function in `init.ts`
- [ ] Create `generateGeminiMd()` function in `init.ts`
- [ ] Add Antigravity to wizard editor picker in `init-wizard.ts`
- [ ] Add Antigravity to wizard target label + installDir mappings

## Success Criteria

- `epost-kit init --target antigravity --source` produces `GEMINI.md` and `AGENTS.md` at project root
- GEMINI.md has Antigravity-specific preamble, agent routing, platform conventions
- AGENTS.md is identical to JetBrains output
- No `.claude/` references in either file
