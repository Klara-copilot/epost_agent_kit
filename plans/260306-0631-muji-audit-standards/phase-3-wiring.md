---
phase: 3
title: "Agent & Skill Wiring"
effort: 0.5h
depends: [1, 2]
---

# Phase 3: Agent & Skill Wiring

## Objective

Ensure all new reference files are properly linked from existing skills and the audit workflow can find them.

## Tasks

### TODO: Update audit/references/ui.md — fix references

**File**: `packages/core/skills/audit/references/ui.md`

Current Step 2 says: "Load the matching reference file(s): web -> `references/checklist-web.md`"

Update to also reference the standards doc:

```markdown
### Step 2: Load Platform Checklist(s)

Load the matching checklist:
- web: `references/checklist-web.md` (rules from `ui-lib-dev/references/audit-standards.md`)
- ios: `references/checklist-ios.md` (future)
- android: `references/checklist-android.md` (future)
```

Current Step 5 says: "Output structured findings using the schema in `references/audit-report-schema.md`."

This reference is correct — the file will now exist after Phase 2.

### TODO: Update ui-lib-dev SKILL.md — add audit-standards to aspects table

**File**: `packages/design-system/skills/ui-lib-dev/SKILL.md`

Add to Aspect Files table:
```
| `references/audit-standards.md` | Enforceable klara-theme rules (35 rules, 6 categories) | Pass/fail criteria per rule |
```

### TODO: Verify epost-muji agent skills list

**File**: `packages/design-system/agents/epost-muji.md`

Verify `skills:` includes `audit` — currently has: `[core, skill-discovery, figma, design-tokens, ui-lib-dev, ui-guidance, audit]`

**Result**: `audit` already in skills list. NO CHANGE NEEDED.

### TODO: Verify audit skill connections

**File**: `packages/core/skills/audit/SKILL.md`

Verify connections include `ui-lib-dev` in enhances. Currently:
```yaml
connections:
  enhances: [code-review]
```

Update to:
```yaml
connections:
  enhances: [code-review, ui-lib-dev]
```

This signals that audit standards enhance the ui-lib-dev pipeline.

## Validation

- [ ] `ui.md` Step 2 references resolve to existing files
- [ ] `ui.md` Step 5 schema reference resolves to existing file
- [ ] `ui-lib-dev/SKILL.md` aspects table includes audit-standards
- [ ] epost-muji agent can load audit skill which loads checklist-web.md
- [ ] No circular dependencies introduced

## Files Changed Summary

| File | Action |
|------|--------|
| `packages/core/skills/audit/references/ui.md` | Modify — update Step 2 text |
| `packages/design-system/skills/ui-lib-dev/SKILL.md` | Modify — add aspects row |
| `packages/core/skills/audit/SKILL.md` | Modify — add ui-lib-dev to enhances |
