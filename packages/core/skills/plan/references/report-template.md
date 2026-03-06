# Plan Report Template

Use this template when writing a plan summary report.

---

```markdown
# epost-planner: {Plan Title}

**Date**: {YYYY-MM-DD HH:mm}
**Agent**: epost-planner
**Plan**: `plans/{dir}/plan.md`
**Status**: COMPLETE

---

## Executive Summary

{2-3 sentences: what was planned, scope, approach}

---

## Plan Details

- **Directory**: `plans/{dir}/`
- **Phases**: {N} phases
- **Effort**: {estimate}
- **Platforms**: {web | ios | android | backend | kit | all}

## Sources Analyzed

- `{file or path}` — {why it was read}
- `plans/reports/{research-report}.md` — {prior research used}

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `{path/to/file}` | Create/Modify/Delete | Phase {N} |

## Key Dependencies

- {dep 1}
- {dep 2}

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| {risk} | High/Med/Low | {mitigation} |

---

## Verdict

**{READY | NEEDS-RESEARCH | BLOCKED}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```
