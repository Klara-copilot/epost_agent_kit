---
phase: 2
title: "Extract consumer audit rules into dedicated standards file"
effort: 45m
depends: []
---

# Phase 2: Consumer Audit Standards Extraction

## Context (Gap 2)

`packages/core/skills/audit/references/ui.md` mixes workflow steps with rule definitions:
- Steps 1a-1h define consumer-mode rules inline (PLACE, REUSE, TW, DRY, REACT, POC rules + scoring formulas)
- Library mode has a parallel standards file: `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`
- Consumer mode has NO parallel standards file -- rules live inside workflow

The existing `audit-standards.md` already contains consumer sections (PLACE, REUSE, TW, DRY, REACT, POC, Consumer Scoring Formulas, Props Enhancements). These were added in PLAN-0059 (klara-consumer-audit).

So the rules ARE in audit-standards.md already. The problem is that ui.md Steps 1a-1h ALSO contain the rules inline (duplicated).

## Tasks

### 2.1 Refactor ui.md consumer mode steps to reference audit-standards.md

**File**: `packages/core/skills/audit/references/ui.md`

For each consumer step (1a through 1h), replace inline rule definitions with references to `audit-standards.md` while keeping the workflow instructions:

**Step 1a: PLACE Audit** (lines 118-126)
- Keep: "Check component placement/structure against PLACE rules"
- Replace: inline rule enumeration with `Apply PL-1 through PL-7 from ui-lib-dev/references/audit-standards.md Section 1: Component Placement.`
- Keep: the 4 bullet points (they describe audit ACTIONS, not rule definitions)

**Step 1b: Read tailwind.config.ts** (lines 128-132)
- Keep entirely -- this is workflow (parse config, build lookup map), not rule definitions

**Step 1c: DRY Baseline Scan** (lines 134-141)
- Keep: the scan instructions (workflow actions)
- Add reference: `Apply DRY-1 through DRY-3 from audit-standards.md Section 4: DRY Gating.`

**Step 1d: REUSE Audit** (lines 143-151)
- Keep: workflow steps (use componentCatalog, check conventions set, track metrics)
- Replace inline rule list with: `Apply RU-1 through RU-8 from audit-standards.md Section 2: Klara-Theme Reuse.`

**Step 1e: TW Compliance Audit** (lines 153-160)
- Keep: workflow steps (scan classNames, check config map)
- Replace inline rule list with: `Apply TW-1 through TW-5 from audit-standards.md Section 3: Tailwind Compliance.`

**Step 1f: REACT Audit** (lines 162-171)
- Keep first line describing intent
- Replace inline check list with: `Apply RE-1 through RE-8 from audit-standards.md Section 5: React Best Practices.`

**Step 1g: POC Detection** (lines 173-184)
- Keep first line describing intent
- Replace inline scan list with: `Apply POC-1 through POC-7 from audit-standards.md Section 6: Production Maturity.`
- Keep: "Build `pocIndicators[]` list for report" (workflow instruction)

**Step 1h: Consumer Score Calculation** (lines 186-196)
- Replace inline formulas with: `Calculate scores per audit-standards.md Consumer Scoring Formulas section.`
- Keep: "Populate `sectionRatings` in report" (workflow instruction)

### 2.2 No new file needed

The consumer rules already live in `audit-standards.md`. We only need to remove duplication from `ui.md`.

## Validation

- [ ] ui.md Steps 1a-1h reference audit-standards.md sections by name
- [ ] ui.md retains all workflow actions (what to DO) but not rule definitions (what to CHECK)
- [ ] No consumer rules lost -- all exist in audit-standards.md already
- [ ] ui.md still readable as a standalone workflow guide (references are clear)
- [ ] Step 1b (tailwind config parse) unchanged -- it's workflow, not rules
