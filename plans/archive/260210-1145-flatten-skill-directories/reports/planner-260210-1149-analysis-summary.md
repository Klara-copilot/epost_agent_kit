# Analysis Summary: Skill Directory Flattening Plan

**Created by**: Phuong Doan
**Date**: 2026-02-10
**Plan**: `/Users/ddphuong/Projects/agent-kit/epost-agent-kit/plans/260210-1145-flatten-skill-directories/`

## Executive Summary

Created comprehensive 4-phase plan to flatten 10 nested skill directories for agentskills.io compliance. This is simpler than previous name migration - pure directory moves, no name field changes.

## Problem Statement

**agentskills.io spec violation**: Skill `name` field must match parent directory name.

**Current**: 10 skills have nested structure (category/leaf) but prefixed names:
- `skills/muji/klara-theme/` → name: `muji-klara-theme` ❌
- `skills/arch/cloud/` → name: `arch-cloud` ❌

**Target**: Flatten to match prefixed names:
- `skills/muji-klara-theme/` → name: `muji-klara-theme` ✅
- `skills/arch-cloud/` → name: `arch-cloud` ✅

## Scope Analysis

### Affected Skills (10)

**By category**:
- **Arch** (1): arch/cloud
- **Backend** (2): backend/databases, backend/javaee
- **Domain** (2): domain/b2b, domain/b2c
- **MUJI** (3): muji/android-theme, muji/ios-theme, muji/klara-theme
- **RAG** (2): rag/ios-rag, rag/web-rag

**By package**:
- arch-cloud: 1 skill
- platform-backend: 2 skills
- domain-b2b: 1 skill
- domain-b2c: 1 skill
- ui-ux: 3 skills
- rag-ios: 1 skill
- rag-web: 1 skill

### Cascading Impacts

**Package.yaml** (1 file):
- ui-ux/package.yaml: Update `muji/ios-theme` → `muji-ios-theme`, `muji/android-theme` → `muji-android-theme`
- Other packages: Already use dash names (no changes)

**Skill indices** (7 packages + global):
- Regenerate after flattening
- Source: packages/*/skills/skill-index.json
- Global: .claude/skills/skill-index.json

**Agent affinity**:
- Agents reference by name, not path (unlikely impact)
- Verify no hardcoded paths

**Empty directories** (7):
- Category dirs become empty after flattening
- Can be safely removed

## Plan Structure

### Phase 1: Extend Migration Script (30min)
- Add `FLATTEN_TARGETS` config (10 entries)
- Implement `flattenSkillDirectories()` function
- Update `updatePackageYamls()` for ui-ux path fixes
- Update main execution flow (flatten before migrate)
- Dry-run validation

**Deliverable**: Extended migrate-skills.mjs with flattening logic

### Phase 2: Execute Flattening (15min)
- Dry-run validation
- Execute migration
- Verify 10 directory moves
- Verify subdirectories preserved
- Validate SKILL.md files intact

**Deliverable**: 10 skills flattened to compliant structure

### Phase 3: Update References (30min)
- Fix ui-ux/package.yaml paths
- Check agent path references
- Regenerate skill indices (7 packages)
- Reinstall to .claude/skills/
- Regenerate global skill index

**Deliverable**: All references updated, indices regenerated

### Phase 4: Cleanup (15min)
- Verify empty category directories
- Remove 7 empty dirs
- Final compliance validation
- Git status review

**Deliverable**: Clean structure, all skills compliant

## Technical Approach

**Directory flattening logic**:
```javascript
const FLATTEN_TARGETS = [
  { pkg: 'arch-cloud', src: 'skills/arch/cloud', dest: 'skills/arch-cloud' },
  { pkg: 'platform-backend', src: 'skills/backend/databases', dest: 'skills/backend-databases' },
  // ... (10 total)
];

function flattenSkillDirectories() {
  for (const target of FLATTEN_TARGETS) {
    const srcPath = path.join('packages', target.pkg, target.src);
    const destPath = path.join('packages', target.pkg, target.dest);

    // Validate + Move
    fs.renameSync(srcPath, destPath);
  }
}
```

**Package.yaml fix** (ui-ux special case):
```javascript
// In updatePackageYamls()
if (pkgName === 'ui-ux') {
  content = content.replace(/muji\/ios-theme/g, 'muji-ios-theme');
  content = content.replace(/muji\/android-theme/g, 'muji-android-theme');
}
```

## Risk Assessment

**Complexity**: Low
- Pure directory moves (no file content changes)
- Names already correct (no SKILL.md edits)
- Existing migration script provides pattern

**Reversibility**: High
- Can mv directories back if issues
- Git provides full rollback

**Testing strategy**:
- Dry-run preview before execution
- Step-by-step validation
- Multiple verification points

**Data loss prevention**:
- All subdirectories preserved (recursive move)
- SKILL.md files intact
- Skill indices regenerated (not merged)

## Success Criteria

- [ ] All 10 skills moved to flat structure
- [ ] Parent directory name = skill name (100% compliance)
- [ ] ui-ux/package.yaml paths updated
- [ ] Skill indices regenerated (source + global)
- [ ] .claude/skills/ reinstalled with flat structure
- [ ] Empty category directories removed
- [ ] No broken references
- [ ] All skills loadable by agentskills.io

## Comparison with Previous Migration

**Previous** (Phase 1 complete):
- 18 skills affected
- Name field changes + file moves
- aspect files → references/
- .json files → assets/
- Complex validation

**This migration**:
- 10 skills affected
- Directory moves only (no name changes)
- No file reorganization
- Simpler validation

**Reusability**: Extended migrate-skills.mjs can handle both migrations

## Next Steps

1. **Review plan** with user/team
2. **Phase 1**: Extend migration script (implement flattening logic)
3. **Phase 2**: Execute with dry-run validation first
4. **Phase 3**: Update references and regenerate indices
5. **Phase 4**: Clean up and final validation
6. **Commit**: Create checkpoint after Phase 2 success
7. **Test**: Validate agentskills.io compliance

## Lessons from Previous Work

**From migrate-skills.mjs analysis**:
- Dry-run mode critical for preview
- Stats tracking helps track progress
- Clear logging essential for debugging
- Idempotent operations (safe to rerun)
- Fail fast on validation errors

**Apply to this plan**:
- Use same dry-run pattern
- Add flattening stats counter
- Log each mv operation clearly
- Use safe rmdir (fails if not empty)
- Validate at each phase

## Unresolved Questions

None - scope is clear and straightforward.

## File Manifest

**Plan documents**:
- `plan.md` - Overview with frontmatter
- `phase-01-extend-migration-script.md` - Script extension
- `phase-02-execute-flattening.md` - Execution steps
- `phase-03-update-references.md` - Reference updates
- `phase-04-cleanup.md` - Final cleanup

**Reports**:
- `reports/planner-260210-1149-analysis-summary.md` - This document

**Related**:
- `scripts/migrate-skills.mjs` - Migration script to extend
- `packages/*/package.yaml` - 7 package files (1 needs update)
- `.claude/agents/*.md` - Agent files (verify only)

## Estimated Timeline

- **Phase 1**: 30 min (script extension)
- **Phase 2**: 15 min (execution)
- **Phase 3**: 30 min (references)
- **Phase 4**: 15 min (cleanup)
- **Total**: 1.5h (matches plan frontmatter)

## Conclusion

Plan is comprehensive, low-risk, and straightforward. Reuses existing migration script patterns. Clear validation at each phase. Ready for implementation.
