---
phase: 1
title: "Muji defensive fallback on missing delegation block"
effort: 45m
depends: []
---

# Phase 1: Muji Defensive Fallback

## Context Links
- [Plan](./plan.md)
- `packages/design-system/agents/epost-muji.md` — muji agent instructions
- `packages/core/skills/audit/references/ui.md` — audit workflow Step 0

## Overview

When muji receives a free-form prompt (no Template A/A+ delegation block), it should auto-detect mode from file paths and run the full audit workflow — not a partial one based only on what the free-form text describes.

Root cause in luz_next: code-reviewer sent a free-form prompt instead of Template A+. Muji audited only what the prompt described, missing most of the 78-rule checklist.

## Files to Modify

- `packages/design-system/agents/epost-muji.md` — add "Delegation Intake Fallback" after "Delegated Audit Intake" section
- `packages/core/skills/audit/references/ui.md` — add fallback detection to Step 0 delegation intake

## Implementation Steps

### 1. Add fallback to `packages/design-system/agents/epost-muji.md`

After the "Delegated Audit Intake" section (currently ends at "The calling agent will merge your findings..."), add:

```markdown
## Delegation Intake Fallback

When invoked via Task tool but the prompt does NOT contain all required delegation block fields (`Scope:`, `Mode:`, `Output path:`):

1. **Log warning**: Add to Methodology section: "⚠️ No structured delegation block detected — defaulting to {mode} auto-detect"
2. **Auto-detect mode** from file paths in the prompt:
   - Any path containing `klara-theme/` or `libs/common/` → **Library Mode**
   - Any path containing `app/`, `features/`, `pages/` → **Consumer Mode**
   - Ambiguous or no paths → **Consumer Mode** (safer default)
3. **Use all file paths mentioned** in the prompt as audit scope
4. **Generate output path**: `reports/{YYMMDD-HHMM}-{slug}-ui-audit/muji-ui-audit.md`
5. **Proceed with full audit workflow** — do not abbreviate based on what the prompt text describes

This fallback must not alter behavior when a properly structured Template A/A+ block is present.
```

### 2. Add fallback to `packages/core/skills/audit/references/ui.md` Step 0

After the delegation intake section in Step 0 (where it says "send your report to calling_agent when done"), add:

```markdown
**Delegation block missing or incomplete?** If invoked via Task tool but `Scope:`, `Mode:`, and `Output path:` fields are absent:
- Auto-detect mode per Step 1 (Mode Detection) using file path patterns
- Use all files mentioned in prompt as scope
- Generate output path: `reports/{YYMMDD-HHMM}-{slug}-ui-audit/muji-ui-audit.md`
- Append to `coverageGaps`: "Delegation block missing — auto-detected {mode} mode"
- Continue with full workflow (do not abbreviate)
```

## Todo List

- [ ] Add "Delegation Intake Fallback" section to `packages/design-system/agents/epost-muji.md`
- [ ] Add fallback detection to `packages/core/skills/audit/references/ui.md` Step 0
- [ ] Run `epost-kit init` to sync `.claude/`

## Success Criteria

- Muji receiving a free-form audit prompt for klara-theme files still runs full Library Mode
- Warning appears in Methodology section of report
- Template A/A+ delegations continue to work unchanged
