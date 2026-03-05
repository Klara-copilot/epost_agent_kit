---
title: "Flatten skill directories for agentskills.io name compliance"
description: "Move 10 nested skills to flat structure matching their prefixed names"
status: completed
priority: P1
effort: 1.5h
branch: fix/skill-migration
tags: [migration, skills, agentskills.io, compliance, directory-flattening]
created: 2026-02-10
completed: 2026-02-10
review: APPROVED (10/10)
---

# Directory Flattening Plan for agentskills.io Compliance

## Context

**Issue**: agentskills.io spec requires `name` field must match parent directory name. Currently, 10 skills have nested directories that don't match their prefixed names.

**Decision**: Keep prefixed names (e.g., `muji-klara-theme`, `arch-cloud`), flatten directories to match.

**Current State** (non-compliant):
```
packages/ui-ux/skills/muji/klara-theme/SKILL.md → name: muji-klara-theme ❌
packages/arch-cloud/skills/arch/cloud/SKILL.md → name: arch-cloud ❌
```

**Target State** (compliant):
```
packages/ui-ux/skills/muji-klara-theme/SKILL.md → name: muji-klara-theme ✅
packages/arch-cloud/skills/arch-cloud/SKILL.md → name: arch-cloud ✅
```

## Affected Skills (10 total)

### Arch Layer (1)
1. `arch/cloud/` → `arch-cloud/` (arch-cloud package)

### Backend Layer (2)
2. `backend/databases/` → `backend-databases/` (platform-backend package)
3. `backend/javaee/` → `backend-javaee/` (platform-backend package)

### Domain Layer (2)
4. `domain/b2b/` → `domain-b2b/` (domain-b2b package)
5. `domain/b2c/` → `domain-b2c/` (domain-b2c package)

### UI/UX Layer (3)
6. `muji/android-theme/` → `muji-android-theme/` (ui-ux package)
7. `muji/ios-theme/` → `muji-ios-theme/` (ui-ux package)
8. `muji/klara-theme/` → `muji-klara-theme/` (ui-ux package)

### RAG Layer (2)
9. `rag/ios-rag/` → `rag-ios-rag/` (rag-ios package)
10. `rag/web-rag/` → `rag-web-rag/` (rag-web package)

## Cascading Impacts

### 1. Package.yaml Changes
- **ui-ux/package.yaml**: Update `skills:` paths (currently has slashes: `muji/ios-theme`)
- **No changes needed**: arch-cloud, platform-backend, domain-b2b, domain-b2c, rag-ios, rag-web (already use dash names)

### 2. Agent Affinity
- Check `.claude/agents/*.md` for path references (unlikely, but verify)

### 3. Empty Category Directories
After flattening, these directories become empty (can be deleted):
- `packages/arch-cloud/skills/arch/`
- `packages/platform-backend/skills/backend/`
- `packages/domain-b2b/skills/domain/`
- `packages/domain-b2c/skills/domain/`
- `packages/ui-ux/skills/muji/`
- `packages/rag-ios/skills/rag/`
- `packages/rag-web/skills/rag/`

### 4. Skill Index Regeneration
- `packages/*/skills/skill-index.json` regeneration
- `.claude/skills/skill-index.json` regeneration after reinstall

### 5. .claude/skills/ Reinstall
- Full reinstall to match new flat structure

## Phases

### [Phase 1](phase-01-extend-migration-script.md) ✅ COMPLETE
**Extend migration script with directory flattening**
- Update `scripts/migrate-skills.mjs` with flattening logic
- Add dry-run validation
- **Effort**: 30min
- **Result**: Created `scripts/flatten-skills.mjs` (351 lines)

### [Phase 2](phase-02-execute-flattening.md) ✅ COMPLETE
**Execute directory moves**
- Run migration script (with dry-run preview first)
- Move 10 nested skills to flat structure
- **Effort**: 15min
- **Result**: All 10 directories flattened, 6 category dirs removed, package.yaml updated, skills reinstalled
- **Review**: [code-reviewer-260210-1232-flattening-execution-review.md](reports/code-reviewer-260210-1232-flattening-execution-review.md) - **APPROVED (10/10)**

### [Phase 3](phase-03-update-references.md) ✅ COMPLETE
**Update cascading references**
- Fix ui-ux/package.yaml paths ✅
- Verify no agent path references ✅
- Regenerate skill indices ✅
- Reinstall to .claude/skills/ ✅
- **Effort**: 30min
- **Status**: All completed in Phase 2

### [Phase 4](phase-04-cleanup.md) ✅ COMPLETE
**Clean up empty category directories**
- Delete 7 empty category directories
- Validate final structure
- **Effort**: 15min
- **Result**: 6 empty category dirs removed (muji/ preserved per spec with figma-variables)

## Success Criteria

- [x] All 10 skills moved to flat structure ✅
- [x] Parent directory name = skill name for all 10 skills ✅
- [x] ui-ux/package.yaml updated with flat paths ✅
- [x] skill-index.json regenerated (source + installed) ✅
- [x] .claude/skills/ reinstalled with flat structure ✅
- [x] Empty category directories removed ✅
- [x] No broken references in agents or package files ✅
- [x] All skills loadable by agentskills.io ✅

## Risk Assessment

**Low Risk** - This is simpler than previous name migration:
- No name field changes (already correct)
- Pure directory moves (mv operations)
- Existing migration script provides pattern
- No agent logic changes needed

**Testing**:
- Dry-run preview before execution
- Skill index validation
- Agent affinity verification

## Related Work

- Previous migration: Fixed 18 skills with name/file moves (Phase 1 complete)
- Migration script: `scripts/migrate-skills.mjs` (reusable/extensible)
- Audit pattern: Can use similar structure for validation

## Next Steps

1. Start with Phase 1: Extend migration script
2. Run dry-run to preview all changes
3. Execute phases 2-4 sequentially
4. Validate compliance with agentskills.io spec
