---
title: "Planner Report: Correct Skill Name Compliance"
created: 2026-02-10
status: completed
type: corrective-migration
---

# Corrective Migration Plan: Fix Skill Name Compliance

## Summary

Created 4-phase corrective plan to fix 10 skills violating agentskills.io spec.

**Root cause**: Previous migration (260209-2203) incorrectly added category prefixes to skill names, misunderstanding spec requirement.

**Spec requirement**: "name field must match parent directory name"

## Violations Found (10 skills)

| Directory | Current Name ❌ | Should Be ✅ |
|-----------|-----------------|--------------|
| arch/cloud/ | arch-cloud | cloud |
| backend/databases/ | backend-databases | databases |
| backend/javaee/ | backend-javaee | javaee |
| domain/b2b/ | domain-b2b | b2b |
| domain/b2c/ | domain-b2c | b2c |
| muji/android-theme/ | muji-android-theme | android-theme |
| muji/ios-theme/ | muji-ios-theme | ios-theme |
| muji/klara-theme/ | muji-klara-theme | klara-theme |
| rag/ios-rag/ | rag-ios-rag | ios-rag |
| rag/web-rag/ | rag-web-rag | web-rag |

## Plan Structure

**Location**: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260210-1139-correct-skill-name-compliance/`

### Phases

| Phase | Description | Effort | File |
|-------|-------------|--------|------|
| 1 | Update migration script | 0.5h | phase-01-update-migration-script.md |
| 2 | Execute corrective migration | 0.5h | phase-02-execute-corrective-migration.md |
| 3 | Validate compliance | 0.25h | phase-03-validate-compliance.md |
| 4 | Update documentation | 0.25h | phase-04-update-documentation.md |

**Total effort**: 1.5h (vs original 5h migration)

## Approach

### Simplifications vs Original Migration

- ✅ No file moves (structure already correct)
- ✅ Name-only changes (SKILL.md frontmatter)
- ✅ Reuse existing script functions
- ✅ Simpler validation (name = parent check)

### Cascading Updates

1. **SKILL.md**: 10 frontmatter name fields
2. **package.yaml**: 7 provides.skills arrays
3. **Agent files**: 3+ skills arrays
4. **skill-index.json**: Regenerate

### Tool Reuse

Adapt `scripts/migrate-skills.mjs`:

```js
const NAME_CORRECTIONS = {
  'arch-cloud': 'cloud',
  'backend-databases': 'databases',
  // ... 8 more
};
```

## Risk Assessment

**Priority**: P1 (HIGH) — shipped non-compliant skills
**Risk**: LOW — text-only changes, reversible via git
**Impact**: 10 skills, 7 packages, 3+ agents

## Success Criteria

- [ ] All 10 skills: name = parent directory
- [ ] Zero broken package.yaml references
- [ ] Zero broken agent references
- [ ] skill-index.json valid (36 skills)
- [ ] Git commit with corrective changes
- [ ] Original plan marked SUPERSEDED
- [ ] Documentation updated with correct rule

## Context Documents Read

- Previous migration plan: `../plans/archive/260209-2203-skill-migration-no-cli-changes/plan.md`
- Migration script: `scripts/migrate-skills.mjs`
- Skill samples: backend/databases, backend/javaee, domain/b2c

## Key Decisions

1. **Reuse vs rewrite**: Reuse existing script (proven, faster)
2. **Validation scope**: All 36 skills (not just 10 fixes)
3. **Documentation**: Mark original SUPERSEDED, document correct rule
4. **Urgency**: HIGH priority (non-compliant shipped to repo)

## Unresolved Questions

None — scope clear, approach proven, risk minimal.

---

**Plan location**: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260210-1139-correct-skill-name-compliance/plan.md`

**Created by:** Phuong Doan
