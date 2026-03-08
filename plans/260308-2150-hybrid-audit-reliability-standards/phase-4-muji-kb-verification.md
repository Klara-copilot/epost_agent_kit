---
phase: 4
title: "Muji KB load verification gate"
effort: 30m
depends: []
---

# Phase 4: Muji KB Load Verification Gate

## Context Links
- [Plan](./plan.md)
- `packages/design-system/agents/epost-muji.md` — Mandatory KB Load section
- `packages/core/skills/audit/references/ui.md` — Step 1 Discover + Load

## Overview

Add an explicit self-check to muji's agent instructions confirming `libs/klara-theme/docs/index.json` was successfully loaded before running TOKEN, STRUCT, or PROPS audit checks. If KB unavailable, audit continues in degraded mode (logged) rather than silently applying stale assumptions.

Root cause: muji would attempt KB load but proceed without verifying success, leading to audits against incomplete or incorrect standards.

## Files to Modify

- `packages/design-system/agents/epost-muji.md` — add "KB Load Verification" gate after Mandatory KB Load section
- `packages/core/skills/audit/references/ui.md` — add Step 1.5 KB Load Checkpoint between Step 1 and Step 2

## Implementation Steps

### 1. Add KB verification gate to `packages/design-system/agents/epost-muji.md`

After the "Mandatory KB Load (Always First — Web)" section, add:

```markdown
## KB Load Verification Gate (Audit Mode)

Before running any TOKEN, STRUCT, or PROPS audit checks, confirm:
1. `libs/klara-theme/docs/index.json` was successfully read (file exists and is valid JSON)
2. `componentCatalog` set is non-empty (FEAT-0001 parsed)
3. At least one CONV-* entry loaded relevant to the audit scope

If any check fails:
- Retry once (attempt load again)
- If still fails: add to `coverageGaps`: "KB load incomplete: {missing items}"
- Continue audit in degraded mode — rules still apply, but convention context limited
- Methodology: "KB: degraded ({reason})" instead of "KB: loaded ({N} entries)"

**Do not block** audit for KB unavailability — new projects may not have docs yet.
```

### 2. Add Step 1.5 checkpoint to `packages/core/skills/audit/references/ui.md`

Between Step 1 (Discover + Load) and Step 2 (Load Platform Checklist), insert:

```markdown
### Step 1.5: KB Load Checkpoint

Verify Step 1 completed before proceeding to any rule checks:
- `componentCatalog` is non-empty (at least 1 component from FEAT-0001)
- `knowledgeTiersUsed` includes `"L1-docs"` or `"L2-RAG"`
- If both empty: retry KB load once, then proceed with `coverageGaps += "KB unavailable — auditing without component catalog"`
- Log in Methodology: "KB: loaded ({N} entries)" or "KB: degraded ({reason})"
```

## Todo List

- [ ] Add "KB Load Verification Gate" section to `packages/design-system/agents/epost-muji.md`
- [ ] Add "Step 1.5: KB Load Checkpoint" to `packages/core/skills/audit/references/ui.md`
- [ ] Run `epost-kit init` to sync `.claude/`

## Success Criteria

- Muji confirms KB loaded before TOKEN/STRUCT/PROPS checks
- Report Methodology shows "KB: loaded (N entries)" or "KB: degraded (reason)"
- Audit continues (degraded) if KB file missing — does not block
- Retry logic prevents false-negative from transient read failure
