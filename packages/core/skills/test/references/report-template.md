# Test Report Template

Use this template when writing a test/validation report.

---

```markdown
# epost-tester: {Scope}

**Date**: {YYYY-MM-DD HH:mm}
**Agent**: epost-tester
**Plan**: `plans/{dir}/plan.md`     <- omit if standalone test run
**Status**: COMPLETE

---

## Executive Summary

{2-3 sentences: what was tested, pass rate, critical failures}

---

## Files Tested

- `{path/to/test.spec.ts}` — {suite name, N tests}
- `{path/to/impl.ts}` — {implementation file checked}

## Results

| Check | Result | Evidence |
|-------|--------|---------|
| {check name} | PASS | {file:line or test name} |
| {check name} | FAIL | {error message} |
| {check name} | SKIP | {reason} |

## Coverage (if applicable)

- **Overall**: {X}%
- **Critical paths**: {X}%
- **Uncovered**: `{file}` lines {N}-{N}

## Failures Detail

### {FAIL-001}: {Check name}
- **Expected**: {behavior}
- **Actual**: {behavior}
- **Fix**: {suggestion}
- **File**: `{path/to/file.ts}` — delegate to epost-fullstack-developer

---

## Verdict

**{PASS | FAIL | PARTIAL}** — {one-line reason}

---

*Unresolved questions:*
- {question or "None"}
```
