# Phase 2: Execute Directory Flattening

**Priority**: P1
**Status**: pending
**Effort**: 15min
**Depends on**: Phase 1 complete

## Context

Execute the directory flattening migration after dry-run validation. This phase moves 10 nested skills to flat structure.

## Key Insights

- Pure directory moves (no file content changes)
- All skills already have correct names
- Simpler than previous migration (no name fixes needed)
- Reversible (can mv back if issues)

## Requirements

### Functional
- Run dry-run first for final validation
- Execute flattening migration
- Verify all 10 directories moved
- Confirm no data loss

### Non-functional
- Clear logging for each operation
- Success confirmation for each move
- Stats summary at completion

## Related Code Files

**Execute**:
- `scripts/migrate-skills.mjs` (run without --dry-run)

**Affected directories**:
- `packages/arch-cloud/skills/arch/cloud` → `packages/arch-cloud/skills/arch-cloud`
- `packages/platform-backend/skills/backend/databases` → `packages/platform-backend/skills/backend-databases`
- `packages/platform-backend/skills/backend/javaee` → `packages/platform-backend/skills/backend-javaee`
- `packages/domain-b2b/skills/domain/b2b` → `packages/domain-b2b/skills/domain-b2b`
- `packages/domain-b2c/skills/domain/b2c` → `packages/domain-b2c/skills/domain-b2c`
- `packages/ui-ux/skills/muji/android-theme` → `packages/ui-ux/skills/muji-android-theme`
- `packages/ui-ux/skills/muji/ios-theme` → `packages/ui-ux/skills/muji-ios-theme`
- `packages/ui-ux/skills/muji/klara-theme` → `packages/ui-ux/skills/muji-klara-theme`
- `packages/rag-ios/skills/rag/ios-rag` → `packages/rag-ios/skills/rag-ios-rag`
- `packages/rag-web/skills/rag/web-rag` → `packages/rag-web/skills/rag-web-rag`

## Implementation Steps

### 1. Dry-Run Validation
```bash
node scripts/migrate-skills.mjs --dry-run --verbose
```

**Expected output**:
```
[DRY-RUN] mv packages/arch-cloud/skills/arch/cloud → packages/arch-cloud/skills/arch-cloud
[DRY-RUN] mv packages/platform-backend/skills/backend/databases → ...
... (10 total operations)
[DRY-RUN] Update ui-ux/package.yaml: muji/ios-theme → muji-ios-theme
[DRY-RUN] Update ui-ux/package.yaml: muji/android-theme → muji-android-theme
```

### 2. Verify Dry-Run Output
Check for:
- [ ] All 10 directory moves logged
- [ ] ui-ux/package.yaml path fixes logged
- [ ] No unexpected operations
- [ ] No error messages

### 3. Execute Migration
```bash
node scripts/migrate-skills.mjs --verbose
```

### 4. Verify Directory Structure
```bash
# Check all 10 new flat directories exist
ls -d packages/arch-cloud/skills/arch-cloud
ls -d packages/platform-backend/skills/backend-databases
ls -d packages/platform-backend/skills/backend-javaee
ls -d packages/domain-b2b/skills/domain-b2b
ls -d packages/domain-b2c/skills/domain-b2c
ls -d packages/ui-ux/skills/muji-android-theme
ls -d packages/ui-ux/skills/muji-ios-theme
ls -d packages/ui-ux/skills/muji-klara-theme
ls -d packages/rag-ios/skills/rag-ios-rag
ls -d packages/rag-web/skills/rag-web-rag
```

### 5. Verify Old Directories Gone
```bash
# Check old nested directories are removed
! ls -d packages/arch-cloud/skills/arch/cloud 2>/dev/null
! ls -d packages/platform-backend/skills/backend/databases 2>/dev/null
# ... (check all 10)
```

### 6. Verify SKILL.md Intact
```bash
# Check SKILL.md files still exist with correct names
for dir in \
  packages/arch-cloud/skills/arch-cloud \
  packages/platform-backend/skills/backend-databases \
  packages/platform-backend/skills/backend-javaee \
  packages/domain-b2b/skills/domain-b2b \
  packages/domain-b2c/skills/domain-b2c \
  packages/ui-ux/skills/muji-android-theme \
  packages/ui-ux/skills/muji-ios-theme \
  packages/ui-ux/skills/muji-klara-theme \
  packages/rag-ios/skills/rag-ios-rag \
  packages/rag-web/skills/rag-web-rag
do
  grep "^name:" "$dir/SKILL.md"
done
```

**Expected**: All names match their parent directory.

### 7. Verify Subdirectories Preserved
```bash
# Check references/, assets/, scripts/ still exist where applicable
ls packages/ui-ux/skills/muji-klara-theme/references/
ls packages/platform-backend/skills/backend-databases/references/
# ... (check others as needed)
```

## Todo List

- [ ] Run dry-run migration
- [ ] Review dry-run output
- [ ] Execute migration
- [ ] Verify all 10 directories moved
- [ ] Verify old directories removed
- [ ] Verify SKILL.md files intact
- [ ] Verify subdirectories preserved
- [ ] Check migration stats summary

## Success Criteria

- [ ] All 10 skills moved to flat structure
- [ ] Parent directory name matches skill name
- [ ] All subdirectories preserved (references/, assets/, scripts/)
- [ ] SKILL.md files intact with correct names
- [ ] Migration completed without errors
- [ ] Stats show 10 directories flattened

## Risk Assessment

**Rollback strategy**: If issues occur, can manually mv directories back:
```bash
mv packages/arch-cloud/skills/arch-cloud packages/arch-cloud/skills/arch/cloud
# ... (for each skill)
```

**Data loss prevention**:
- Dry-run validation first
- Git working tree clean before execution
- Can commit immediately after for safety

## Security Considerations

- All operations within repo boundaries
- No external data access
- No credential changes

## Next Steps

After successful execution:
1. Git status to review changes
2. Proceed to Phase 3 (update references)
3. Consider committing checkpoint
