---
phase: 5
title: "Verification, Convert Command Sync, kit-verify"
effort: 3h
depends: [1, 2, 3, 4]
---

## Context

- Plan: [plan.md](plan.md)
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/`
- Kit repo: `/Users/than/Projects/epost_agent_kit/`
- `convert` command: `src/commands/convert.ts` + `src/domains/conversion/`

## Overview

The standalone `epost-kit convert` command uses a completely separate code path from `epost-kit init`. After phase 1 fixes the init adapter tool mappings, the convert command will still have the old wrong mappings. This phase unifies them and adds verification.

## Requirements

### 5a. Unify convert command with init adapters

The `convert` command (`src/commands/convert.ts`) currently uses:
- `src/domains/conversion/claude-parser.ts` — parses Claude format
- `src/domains/conversion/copilot-formatter.ts` — formats to Copilot
- `src/domains/conversion/tool-mappers.ts` — tool mapping

Option A (recommended): Refactor `convert.ts` to use the same `CopilotAdapter.transformAgent()` from `src/domains/installation/copilot-adapter.ts` instead of the separate `copilot-formatter.ts`.

Option B: Keep separate but import `TOOL_MAP` from a shared constant.

**Go with Option A** — single source of truth. The convert command should:
1. Parse source files (keep `claude-parser.ts`)
2. Use `CopilotAdapter.transformAgent()` for agent transforms
3. Use `CopilotAdapter.transformSkill()` for skill transforms
4. Drop the `copilot-formatter.ts` module (or deprecate)

### 5b. Add target flag to convert command

Currently `convert` only outputs Copilot format. Add `--target` flag:

```bash
epost-kit convert --target vscode    # Copilot (default, backward compat)
epost-kit convert --target cursor    # Cursor
epost-kit convert --target jetbrains # JetBrains
```

### 5c. Add init output verification

**File**: `src/commands/verify.ts` (or integrate into existing `lint.ts`)

Add post-install verification checks:

```typescript
// For vscode target:
verifyNoOldToolNames(githubDir);  // grep for "execute", "read", "edit" as tool values
verifyNoClaudePaths(githubDir);   // grep for .claude/
verifyAgentFileExtension(githubDir); // all agents end in .agent.md
verifyScopedInstructions(githubDir); // instructions/*.instructions.md exist

// For cursor target:
verifySplitRules(cursorDir);      // multiple .mdc files, no monolithic epost-kit.mdc
verifyNoClaudePaths(cursorDir);   // grep for .claude/

// For jetbrains target:
verifyAgentsMd(projectRoot);      // AGENTS.md exists and is non-empty
```

### 5d. Update kit-ide-snippets skill

**File**: `packages/kit/skills/kit-ide-snippets/SKILL.md`

Update to reflect full IDE parity picture:
- Document all 4 targets: claude, vscode (copilot), cursor, jetbrains
- Reference the transformation table from plan.md
- Note experimental/stable status of each target

### 5e. End-to-end smoke test script

Create a test script that runs init for each target and validates output:

**File**: `src/commands/test-targets.ts` (or a test file)

```bash
# Smoke test all targets
for target in claude vscode cursor jetbrains; do
  epost-kit init --target $target --dir /tmp/test-$target --yes
  # Verify expected output structure
done
```

## Files to Create/Modify

| File (CLI repo) | Action |
|-----------------|--------|
| `src/commands/convert.ts` | Modify — use TargetAdapter instead of copilot-formatter |
| `src/domains/conversion/copilot-formatter.ts` | Deprecate or delete |
| `src/commands/lint.ts` or `verify.ts` | Modify — add target-specific checks |

| File (kit repo) | Action |
|-----------------|--------|
| `packages/kit/skills/kit-ide-snippets/SKILL.md` | Modify — full parity docs |

## TODO

- [ ] Refactor convert.ts to use CopilotAdapter / CursorAdapter for transforms
- [ ] Add --target flag to convert command
- [ ] Add post-install verification checks to lint/verify
- [ ] Update kit-ide-snippets SKILL.md
- [ ] Run smoke test: init for all 4 targets, verify output structure
- [ ] Verify: `grep -r '\.claude/' .github/` returns 0 for vscode target
- [ ] Verify: `grep -r '\.claude/' .cursor/` returns 0 for cursor target
- [ ] Verify: no `epost-kit.mdc` monolithic file for cursor target

## Success Criteria

- `epost-kit convert --target vscode` uses same tool mappings as `epost-kit init --target vscode`
- `epost-kit lint` catches wrong tool names in Copilot output
- `epost-kit lint` catches monolithic .mdc in Cursor output
- All 4 targets produce valid, non-empty output
- Zero `.claude/` path references in any non-Claude target output
