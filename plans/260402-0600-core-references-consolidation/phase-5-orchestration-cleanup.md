---
phase: 5
title: "Minor orchestration.md cleanup"
effort: 10m
depends: []
---

# Phase 5: orchestration.md Minor Cleanup

## Files to Modify

- EDIT: `packages/core/skills/core/references/orchestration.md`

## Changes

### 1. Replace stub Report Output section

Current (lines 268–273, 8 lines):
```
## Report Output

- Location: `reports/{agent}-{date}-{slug}.md`
- Naming: kebab-case, descriptive, self-documenting
- Content: concise, bullets over paragraphs, unresolved questions at end
- Max: 150 lines (research reports), 80 lines (status reports)
```

Replace with (2 lines):
```
## Report Output

See `report-standard.md` for full report format, naming, size limits, and verdict values.
```

Net: -6 lines.

### 2. Scan for epost-journal-writer

Search orchestration.md for `epost-journal-writer`. Remove or replace with `journal` skill if found. (Current content shows none — this is a safety check.)

## Todo

- [ ] Read orchestration.md
- [ ] Replace `## Report Output` section (8 lines → 2 lines)
- [ ] Scan and fix any epost-journal-writer occurrences

## Success Criteria

- `## Report Output` section is exactly 2 lines (heading + pointer)
- `epost-journal-writer` absent
