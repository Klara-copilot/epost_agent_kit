---
phase: 2
title: "plan — Parallel-mode phase template completeness"
effort: 20m
depends: []
---

# Phase 2: Parallel-mode Phase Template

## Files to Modify

- `packages/core/skills/plan/references/parallel-mode.md`

## Problem

`parallel-mode.md` Step 7 says "Same as deep-mode.md PLUS Parallelization Info section". Any implementer who reads only parallel-mode.md won't see the full required sections — they'll omit Risk Assessment, Security Considerations, Todo List, Key Insights.

## Change

In Step 7 ("Generate Phase Files"), replace the one-liner "Same as hard.md PLUS..." with an explicit ordered section list:

```markdown
### 7. Generate Phase Files

Each phase file MUST include all sections below, in order. Section 7 (Parallelization Info) is new — all others match `deep-mode.md`.

| # | Section | Notes |
|---|---------|-------|
| 1 | `## Context Links` | Plan + R1 + R2 + code files |
| 2 | `## Overview` | Priority, Status, Effort, Description |
| 3 | `## Key Insights` | Findings from research + critical considerations |
| 4 | `## Requirements` | Functional + Non-Functional |
| 5 | `## Architecture` | If applicable |
| 6 | `## Related Code Files` | Modify / Create / Delete |
| 7 | `## Parallelization Info` | ← unique to parallel mode — see template below |
| 8 | `## Implementation Steps` | Detailed numbered steps |
| 9 | `## Todo List` | Checkboxes for tracking |
| 10 | `## Success Criteria` | Definition of done |
| 11 | `## Risk Assessment` | Risk / Impact / Mitigation table |
| 12 | `## Security Considerations` | Auth, data protection, input validation |
| 13 | `## Next Steps` | Dependencies, follow-up tasks |
```

Then keep the existing `## Parallelization Info` template block.

## Todo

- [ ] Read parallel-mode.md fully before editing
- [ ] Locate Step 7 — identify exact text to replace
- [ ] Replace one-liner with explicit section table
- [ ] Verify existing Parallelization Info template block is preserved unchanged

## Success Criteria

- parallel-mode.md Step 7 has explicit section table with all 13 sections
- `## Parallelization Info` template block still present and unchanged
- No other changes to file

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overwriting the Parallelization Info block | High | Careful read-before-edit |

## Security Considerations

None — markdown documentation only.
