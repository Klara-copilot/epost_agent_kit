---
phase: 3
title: "Audit all 65 skill descriptions"
effort: 1.5h
depends: [1]
---

# Phase 3: Audit All 65 Skill Descriptions

## Context

65 SKILL.md files exist across `packages/`. Each description must pass the validation checklist created in Phase 1.

## Tasks

### 3.1 Extract and audit all descriptions
For each `packages/**/skills/*/SKILL.md`, extract the `description:` field and check against:

| Check | Rule |
|-------|------|
| Form | Third-person ("This skill should be used when..." or "(ePost) This skill...") |
| Length | Max 1024 characters |
| Keywords | Contains quoted trigger phrases users would say |
| Dual purpose | Describes what AND when |
| No workflow summary | Description does not summarize the skill's workflow steps |
| No vague language | No "helps with", "assists in", "general purpose" |

### 3.2 Fix non-compliant descriptions
For each failing description:
- Rewrite to third-person form with specific trigger phrases
- Ensure dual purpose (what + when)
- Keep under 1024 chars
- Preserve `(ePost)` prefix if present (epost-kit convention)

### 3.3 Run epost-kit init
After all edits, run `epost-kit init` to regenerate `.claude/` from updated `packages/`.

## Skill Locations (65 files)

| Package | Count | Path |
|---------|-------|------|
| core | 25 | `packages/core/skills/*/SKILL.md` |
| kit | 6 | `packages/kit/skills/*/SKILL.md` |
| platform-web | 9 | `packages/platform-web/skills/*/SKILL.md` |
| platform-ios | 3 | `packages/platform-ios/skills/*/SKILL.md` |
| platform-android | 2 | `packages/platform-android/skills/*/SKILL.md` |
| platform-backend | 2 | `packages/platform-backend/skills/*/SKILL.md` |
| a11y | 4 | `packages/a11y/skills/*/SKILL.md` |
| design-system | 3 | `packages/design-system/skills/*/SKILL.md` |
| domains | 2 | `packages/domains/skills/*/SKILL.md` |

## Files Changed

| File | Action |
|------|--------|
| `packages/**/skills/*/SKILL.md` | UPDATE (description field only, up to 65 files) |

## Validation

- [ ] All 65 descriptions use third-person form
- [ ] All descriptions under 1024 chars
- [ ] All descriptions include trigger keywords
- [ ] All descriptions describe what + when
- [ ] No description summarizes workflow steps
- [ ] `epost-kit init` runs successfully after changes
