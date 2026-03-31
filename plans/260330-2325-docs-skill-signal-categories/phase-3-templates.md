---
phase: 3
title: "Update index.json template + report tables"
effort: 30m
depends: [2]
---

# Phase 3: Update index.json Template + Report Tables

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/docs/references/init.md:238-278` — index.json template
- `packages/core/skills/docs/references/init.md:286-302` — Generation Mode report
- `packages/core/skills/docs/references/init.md:119-141` — Smart Init report

## Overview
- Priority: P2
- Status: Pending
- Effort: 30m
- Description: Make index.json categories dynamic and update report tables to show selected/skipped breakdown

## Requirements

### Functional
- index.json template `categories` object only includes selected categories (not hardcoded 7)
- Generation Mode report table shows all 10 categories with count or "skipped (no signal)" or "N/A"
- Smart Init report shows which gap-fill categories were selected vs skipped

### Non-Functional
- Report format stays markdown table
- index.json template stays valid JSON example

## Files to Modify
- `packages/core/skills/docs/references/init.md` — index.json template section + both report sections

## Implementation Steps

1. **Update index.json template** (currently Step 4 in Generation Mode, will be Step 5 after renumbering)
   - Replace the hardcoded `categories` object with instruction:
     > Only include categories that were **selected** in Step 2. Example shows all possible entries — omit any that were skipped.
   - Add API, INFRA, INTEG to the example alongside existing 7

2. **Update Generation Mode report** (currently Step 5)
   - Replace hardcoded 7-row table with dynamic table instruction:
     ```
     | Category | Count | Files |
     |----------|-------|-------|
     | ADR | N | ADR-0001, ... |
     | ... | ... | ... |
     | API | skipped (no signal) | — |
     ```
   - Selected categories show count + file list
   - Skipped categories show "skipped (no signal)" + dash

3. **Update Smart Init report**
   - Add a "Category Selection" section before the migrated/gap-filled tables:
     ```
     ### Category Selection
     | Category | Status | Signal |
     |----------|--------|--------|
     | ADR | selected (core) | — |
     | FEAT | selected | route files detected |
     | API | skipped | no REST routes or @Path annotations |
     ```

## Todo List
- [ ] Update index.json template to be dynamic
- [ ] Add API/INFRA/INTEG to index.json example
- [ ] Update Generation Mode report table
- [ ] Update Smart Init report with category selection section

## Success Criteria
- index.json template does not hardcode exactly 7 categories
- Report tables include all 10 possible categories
- Skipped categories are clearly marked in reports

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents generate incomplete index.json | Low | Example shows all 10 as reference; instruction says "omit skipped" |

## Security Considerations
- None identified

## Next Steps
- Plan complete. Run `/cook` to implement.
