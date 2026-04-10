---
phase: 1
title: "Audit SKILL.md — explicit inline load instructions"
effort: 1h
depends: []
---

# Phase 1 — Audit SKILL.md: Explicit Inline Load Instructions

## Context

audit/SKILL.md already has a GA/GTM section (Mechanism 1 + 2) but lacks explicit instructions for HOW to load web-analytic content at runtime. The agent needs clear steps: what to read, what to skip, and where to insert results.

## Overview

Add precise inline load instructions to audit/SKILL.md so the orchestrator knows exactly:
1. When to trigger GA check (platform detection)
2. What to load from web-analytic (SKILL.md Dev Interview Flow only)
3. How to scope files (app-layer .tsx, skip libs/)
4. Where to output results (session report `## GA/GTM Tracking`)

## Requirements

### 1.1 — Hybrid Flow Step 5.5 (after code-reviewer)

Insert between Steps 5 (code-reviewer dispatch) and 6 (merge reports) in Hybrid Orchestration:

```markdown
5.5. **GA/GTM Tracking Check** (if web platform detected):
   - Read `web-analytic` skill's Dev Interview Flow section
   - For each app-layer `.tsx` file in scope (skip `libs/klara-theme/`):
     - Run Q5→Q9 (Rule 2 interview — boundary detection + ga-data-group)
     - Run Q10 (change protection)
   - Output: `{session_folder}/ga-tracking.md` with tracking table + findings
   - Skip if: no `.tsx` app-layer files in scope, or platform is not web
```

### 1.2 — Single-Agent `--code` flow enhancement

In Step 0 `--code` branch, after "dispatch epost-code-reviewer via Agent tool":

```markdown
After code-reviewer completes AND web platform detected:
1. Read web-analytic SKILL.md § "Dev Interview Flow"
2. Filter scope to app-layer .tsx files only
3. Run Rule 2 interview (Q5→Q9) per file
4. Append `## GA/GTM Tracking` section to code-review report
```

### 1.3 — Standalone `--ga` flow

In Step 0 `--ga` branch, replace current placeholder with:

```markdown
1. Create session folder: `reports/{YYMMDD-HHMM}-{slug}-ga-audit/`
2. Read web-analytic SKILL.md § "Dev Interview Flow"
3. Determine scope:
   - If path argument given → scan that path
   - Else → scan git diff for .tsx files
4. For each file:
   - Q1: detect layer (UI library vs app feature)
   - If UI library → run Rule 1 interview (Q2→Q4)
   - If app feature → run Rule 2 interview (Q5→Q9)
   - Always → Q10 (change protection)
5. Output: `{session_folder}/report.md` with GA/GTM Tracking table
6. Write session.json, update reports/index.json
```

### 1.4 — Explicit token budget note

Add to GA/GTM section:

```markdown
**Token budget**: Load ONLY the Dev Interview Flow section from web-analytic SKILL.md.
Do NOT load references/tracking-rules.md, references/naming-examples.md, or
references/gtm-setup-patterns.md unless a finding requires deeper context.
```

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/audit/SKILL.md` | Update Hybrid Orchestration (add Step 5.5), update `--code` flow, update `--ga` flow, add token budget note |

## Validation

- [ ] Step 5.5 appears between Steps 5 and 6 in Hybrid Orchestration section
- [ ] `--code` flow explicitly says "after code-reviewer completes, if web: read web-analytic"
- [ ] `--ga` flow has complete 6-step procedure (not just "run GA check inline")
- [ ] Token budget note present — references SKILL.md only, not full references/
- [ ] No duplicate interview flow logic (references web-analytic, doesn't copy Q1-Q10)
