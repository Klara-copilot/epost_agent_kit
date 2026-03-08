---
phase: 4
title: "Muji agent: consumer audit priorities"
effort: 0.5h
depends: []
---

# Phase 4: Muji Agent Update

**File**: `packages/design-system/agents/epost-muji.md`
**Action**: Expand Consumer Audit section with priority order and INTEGRITY awareness

## Tasks

### 4.1 Expand Consumer Audit Section

Replace current "Consumer Audit" block (lines 69-75) with expanded version:

```markdown
### Consumer Audit

Priority order for consumer code review:

1. **INTEGRITY** -- block if consumer modifies library files directly
2. **PLACE** -- correct file placement and module boundaries
3. **REUSE** -- klara-theme component adoption (no reinventing the wheel)
4. **TW** -- Tailwind token compliance
5. **DRY** -- accept established project conventions
6. **REACT** -- React best practices
7. **POC** -- production maturity (no prototype artifacts)
8. **A11Y + TEST** -- accessibility and test coverage

Review consumer code for:
- INTEGRITY: no direct library modifications (immediate block)
- Design token compliance (correct semantic tokens, no raw values)
- Component reuse (use klara-theme components, not custom equivalents)
- Tailwind compliance (project tokens, no arbitrary values)
- React patterns (hooks, memoization, composition)
- Production readiness (no console.log, TODO, mock data, `as any`)
- Accessibility adherence (ARIA, contrast, touch targets)
- Theme provider integration
```

### 4.2 Add Consumer Audit Trigger to Triggers Section

Add to existing triggers list (line 57-60):
- "Consumer PR review against design system"
- "Check if feature code uses klara-theme correctly"

## Validation

- Consumer audit priority order matches workflow step order from phase 2
- INTEGRITY mentioned as first priority
- Existing library flow unchanged
- No skill list changes needed (audit skill already in muji's skills list)
