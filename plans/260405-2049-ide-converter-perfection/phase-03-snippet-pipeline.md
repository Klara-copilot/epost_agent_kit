---
phase: 3
title: "Snippet Pipeline + Per-Package Snippets"
effort: 3h
depends: [1, 2]
---

## Context

- Plan: [plan.md](plan.md)
- Kit repo: `/Users/than/Projects/epost_agent_kit/`
- Current: Only `packages/core/` has COPILOT.snippet.md and CURSOR.snippet.md
- All packages have CLAUDE.snippet.md

## Overview

Create COPILOT.snippet.md and CURSOR.snippet.md for each platform package so the split-rules and scoped-instructions generators have per-platform content. Also document the snippet pipeline.

## Requirements

### 3a. Create per-package COPILOT.snippet.md

Each package needs a COPILOT.snippet.md tailored for Copilot's context:
- Shorter than CLAUDE.snippet.md (Copilot has smaller context windows)
- Focus on routing and conventions (not tool details — Copilot has its own tools)
- Mention `@agent-name` invocation pattern
- Include starter prompts

**Packages needing COPILOT.snippet.md**:

| Package | Content focus |
|---------|--------------|
| `packages/platform-web/` | Web conventions, Next.js/React patterns, `@epost-fullstack-developer` for web tasks |
| `packages/platform-ios/` | iOS conventions, Swift/SwiftUI patterns, `@epost-fullstack-developer` for iOS tasks |
| `packages/platform-android/` | Android conventions, Kotlin/Compose patterns |
| `packages/platform-backend/` | Backend conventions, Jakarta EE/WildFly patterns |
| `packages/design-system/` | Design token usage, `@epost-muji` for component tasks |
| `packages/a11y/` | Accessibility conventions, WCAG 2.1 AA, `@epost-a11y-specialist` |
| `packages/kit/` | Kit authoring conventions (merge into core for output) |
| `packages/domains/` | B2B/B2C domain context |

### 3b. Create per-package CURSOR.snippet.md

Same packages, adapted for Cursor:
- Mention `@agent-name` in chat invocation
- Reference `.cursor/rules/` for auto-loading
- Note Cursor-specific limitations (no Task tool, no hooks)

### 3c. Update existing core snippets

**packages/core/COPILOT.snippet.md**: Update to reflect scoped instructions awareness:
- Remove platform-specific content (now in per-package files)
- Focus on: project overview, agent routing table, starter prompts, handoff workflow

**packages/core/CURSOR.snippet.md**: Update to reflect split-rules:
- Remove platform-specific content
- Focus on: project overview, agent routing, context rules

### 3d. Document snippet pipeline

Create reference doc explaining how snippets flow through the system.

**File**: `packages/kit/skills/kit-ide-snippets/references/snippet-pipeline.md`

Content:
1. Source: `packages/*/CLAUDE.snippet.md`, `COPILOT.snippet.md`, `CURSOR.snippet.md`
2. Collection: `init.ts` reads `package.yaml` → `claude_snippet` / `copilot_snippet` / `cursor_snippet` fields
3. Fallback: if `copilot_snippet` missing → use `claude_snippet`
4. Assembly: snippets grouped by target, layered by package order
5. Output: CLAUDE.md / copilot-instructions.md + scoped instructions / split .mdc rules

## Files to Create/Modify

| File (kit repo) | Action |
|-----------------|--------|
| `packages/platform-web/COPILOT.snippet.md` | Create |
| `packages/platform-web/CURSOR.snippet.md` | Create |
| `packages/platform-ios/COPILOT.snippet.md` | Create |
| `packages/platform-ios/CURSOR.snippet.md` | Create |
| `packages/platform-android/COPILOT.snippet.md` | Create |
| `packages/platform-android/CURSOR.snippet.md` | Create |
| `packages/platform-backend/COPILOT.snippet.md` | Create |
| `packages/platform-backend/CURSOR.snippet.md` | Create |
| `packages/design-system/COPILOT.snippet.md` | Create |
| `packages/design-system/CURSOR.snippet.md` | Create |
| `packages/a11y/COPILOT.snippet.md` | Create |
| `packages/a11y/CURSOR.snippet.md` | Create |
| `packages/core/COPILOT.snippet.md` | Modify — trim to routing-only |
| `packages/core/CURSOR.snippet.md` | Modify — trim to routing-only |
| `packages/kit/skills/kit-ide-snippets/references/snippet-pipeline.md` | Create |

Also update each package's `package.yaml` to register the new snippet files:
- Add `copilot_snippet: COPILOT.snippet.md` field
- Add `cursor_snippet: CURSOR.snippet.md` field

## TODO

- [ ] Create COPILOT.snippet.md for each platform package
- [ ] Create CURSOR.snippet.md for each platform package
- [ ] Update core COPILOT.snippet.md — remove platform content
- [ ] Update core CURSOR.snippet.md — remove platform content
- [ ] Update package.yaml for each package — register snippet files
- [ ] Create snippet-pipeline.md reference doc
- [ ] Test: `epost-kit init --target vscode --yes` → verify per-platform scoped instructions have correct content
- [ ] Test: `epost-kit init --target cursor --yes` → verify split .mdc files have correct content

## Success Criteria

- Every platform package has both COPILOT.snippet.md and CURSOR.snippet.md
- `package.yaml` for each package registers `copilot_snippet` and `cursor_snippet`
- Scoped instructions contain platform-specific content (not generic routing)
- Split .mdc rules contain platform-specific content
- `snippet-pipeline.md` reference doc exists
