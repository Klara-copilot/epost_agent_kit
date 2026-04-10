---
phase: 4
title: "verify-ga bridge + validation"
effort: 45m
depends: [1, 2, 3]
---

# Phase 4 — verify-ga Bridge + End-to-End Validation

## Context

`verify-ga` in luz_next (.github/skills/) is the project-level implementation with file classification tiers, legacy exceptions, and path conventions specific to klara-theme + luz-epost. It should reference web-analytic as its upstream standard.

## Overview

Bridge the org-level standard (web-analytic) with the project-level implementation (verify-ga), then validate the full flow end-to-end.

## Requirements

### 4.1 — verify-ga upstream reference

Add to `luz_next/.github/skills/verify-ga/SKILL.md` header section:

```markdown
## Upstream Standard
This skill implements the project-specific scan procedure for the org-wide
`web-analytic` standard (epost_agent_kit/packages/platform-web/skills/web-analytic/).
Rules 1-4, Dev Interview Flow, and naming conventions are defined upstream.
This file adds: file classification tiers, luz_next-specific paths, legacy exceptions.
```

### 4.2 — verify-ga references alignment

Verify that verify-ga's `references/ga-rules.md` does not contradict web-analytic's `references/tracking-rules.md`. If discrepancies exist, web-analytic (Layer 0) wins — update verify-ga to align.

Check points:
- Rule 1 placement (root element of interactive component)
- Rule 2 placement (outermost content container INSIDE boundary, not ON boundary)
- Rule 3 change protection process
- Rule 4 naming format (kebab-case)
- Skip conditions match
- Boundary component list matches

### 4.3 — End-to-end validation

Run these test scenarios:

**Test 1: `/audit --code` on web files**
```
Target: apps/luz-epost/app/[locale]/(auth)/communities/page.tsx
Expected: code-reviewer runs → GA check runs inline → report has ## GA/GTM Tracking section
```

**Test 2: `/audit --ga` standalone**
```
Target: apps/luz-epost/app/[locale]/(auth)/organization/
Expected: Dev Interview Flow runs → tracking table output → no code-reviewer dispatch
```

**Test 3: `/audit --code` on non-web files**
```
Target: some-backend.java
Expected: code-reviewer runs → NO GA check (not web platform) → no ## GA/GTM section
```

**Test 4: Hybrid flow with web files**
```
Target: libs/klara-theme/src/lib/components/ (20+ files)
Expected: muji → a11y → code-reviewer → GA check (Step 5.5) → merged report
```

### 4.4 — Sync and deploy

After all edits verified:

```bash
# Sync to epost_agent_kit output
epost-kit init --source=local --packages=core,platform-web --yes

# Sync to luz_next (if installed there)
cd luz_next && epost-kit init --source=local --packages=core,platform-web --yes
```

## Files to Modify

| File | Change |
|------|--------|
| `luz_next/.github/skills/verify-ga/SKILL.md` | Add upstream standard reference |
| `luz_next/.github/skills/verify-ga/references/ga-rules.md` | Align with web-analytic tracking-rules.md (if discrepancies) |

## Files to Read (validation only)

| File | Purpose |
|------|---------|
| `packages/core/skills/audit/SKILL.md` | Verify Phase 1 changes applied |
| `packages/platform-web/skills/web-analytic/SKILL.md` | Verify Phase 2 connections |
| `packages/core/skills/audit/references/output-contract.md` | Verify Phase 3 format |

## Validation

- [ ] verify-ga SKILL.md has upstream standard reference
- [ ] verify-ga ga-rules.md aligned with web-analytic tracking-rules.md (no contradictions)
- [ ] Test 1 passes: --code web → GA section in report
- [ ] Test 2 passes: --ga → standalone GA report
- [ ] Test 3 passes: --code non-web → no GA section
- [ ] Test 4 passes: Hybrid → Step 5.5 GA check included
- [ ] `epost-kit init` sync completes without errors
