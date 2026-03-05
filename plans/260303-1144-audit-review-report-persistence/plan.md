---
title: "Audit & review report persistence"
description: "All a11y commands write timestamped reports to .epost-data/a11y/fixes/ subfolders"
status: completed
priority: P2
effort: 1h
branch: master
tags: [workflow, reports, audit, review, a11y]
created: 2026-03-03
---

# Audit & Review Report Persistence

## Overview

Add file-based report persistence to a11y commands so results are preserved in the `.epost-data/a11y/fixes/` folder hierarchy.

## Target Structure

```
.epost-data/a11y/
├── fixes/
│   ├── findings/        ← audit-a11y JSON reports
│   ├── patches/         ← fix-a11y unified diffs (already referenced)
│   └── reviews/         ← review-a11y JSON reports
├── README.md            ← explains structure
├── analysis.md          ← trend summary (updated by audit/review)
└── known-findings.json  ← findings DB (external project, already exists)
```

## Changes

| File | Change |
|------|--------|
| `audit-a11y/SKILL.md` | Add step 9: save JSON to `fixes/findings/audit-YYMMDD-HHMM.json` |
| `review-a11y/SKILL.md` | Add step 7: save JSON to `fixes/reviews/review-YYMMDD-HHMM.json` |
| `fix-a11y/SKILL.md` | Add step: save diff to `fixes/patches/finding-{id}-YYMMDD.diff` (formalize existing ref) |
| `data-store/SKILL.md` | Update domain layout to show `fixes/` subfolders |
| `packages/a11y/assets/a11y-data-readme.md` | Template README for .epost-data/a11y/ |

## Success Criteria

- [ ] audit-a11y saves report to `fixes/findings/`
- [ ] review-a11y saves report to `fixes/reviews/`
- [ ] fix-a11y saves diffs to `fixes/patches/` (formalized)
- [ ] README.md template created
- [ ] data-store skill updated with a11y subfolder layout
