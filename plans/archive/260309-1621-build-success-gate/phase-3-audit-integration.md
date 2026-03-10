---
phase: 3
title: "Audit workflow integration"
effort: 0.5h
depends: [1]
---

# Phase 3: Audit Workflow Integration

## Context Links

- [Plan](./plan.md)
- [Phase 1](./phase-1-build-gate-utility.md)
- `packages/core/skills/audit/SKILL.md` -- audit orchestration

## Overview

- Priority: P2
- Status: Pending
- Effort: 0.5h
- Description: Add build verification as a final step in audit workflows. After all audit agents report, verify the project still builds.

## Requirements

### Functional

- Run build-gate as the LAST step of hybrid and single-agent audit flows
- Include build status in the merged audit report
- Build failure does NOT block audit report generation (it's informational)
- Add `## Build Verification` section to merged report

### Non-Functional

- Audit report generation completes even if build fails (audit findings are still valuable)
- Build status is advisory in audit context, mandatory in git context

## Related Code Files

### Files to Modify

- `packages/core/skills/audit/SKILL.md` -- add build verification step after report merge

### Files to Create

- None

## Implementation Steps

1. **Update `audit/SKILL.md` Hybrid Orchestration**
   - After step 6 (Merge reports), add step 6.5:
     ```
     6.5. Run build verification:
          node .claude/hooks/lib/build-gate.cjs
          - Add "## Build Verification" section to report.md:
            - PASS: "Build verification: PASS ({platform}, {duration}ms)"
            - FAIL: "Build verification: FAIL — {error excerpt}"
            - N/A: "Build verification: skipped (no build command detected)"
     ```

2. **Update Single-Agent Delegation Protocol**
   - Add same build verification after step 6 (Write session.json)

## Todo List

- [ ] Add build-gate step to hybrid orchestration
- [ ] Add build-gate step to single-agent protocol
- [ ] Define report section format

## Success Criteria

- Audit reports include build verification section
- Build failure is visible but does not prevent audit completion

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Build adds time to already-long audits | Low | Runs once, after all reports done |

## Security Considerations

- None beyond Phase 1 considerations

## Next Steps

- None (final phase)
