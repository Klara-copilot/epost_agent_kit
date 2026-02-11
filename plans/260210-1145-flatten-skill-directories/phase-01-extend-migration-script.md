# Phase 1: Extend Migration Script with Directory Flattening

**Priority**: P1
**Status**: pending
**Effort**: 30min

## Context

Extend existing `scripts/migrate-skills.mjs` with directory flattening logic. Script already handles name changes and package.yaml updates, now needs to handle directory restructuring.

## Key Insights

**Existing script capabilities**:
- Reads audit JSON for skill metadata
- Moves aspect files (references/, assets/)
- Updates SKILL.md name field
- Updates package.yaml and agent files
- Regenerates skill indices
- Reinstalls to .claude/skills/

**New requirement**: Add directory flattening before file moves.

## Requirements

### Functional
- Add `flattenSkillDirectories()` function to handle nested → flat moves
- Detect nested structure pattern: `skills/{category}/{leaf}/` → `skills/{category-leaf}/`
- Preserve all subdirectories: references/, assets/, scripts/, etc.
- Update package.yaml paths after flattening (ui-ux special case)
- Dry-run support with detailed preview

### Non-functional
- Zero data loss during moves
- Idempotent (safe to run multiple times)
- Clear logging for each operation
- Fail fast on errors

## Architecture

### Flattening Logic Flow

```
1. Identify nested skills (category/leaf pattern)
2. For each nested skill:
   a. Validate source exists
   b. Construct target path (category-leaf)
   c. Check target doesn't exist
   d. Move directory (mv operation)
   e. Log operation
3. Update package.yaml paths
4. Proceed with existing migration logic
```

### Target Skills

```javascript
const FLATTEN_TARGETS = [
  { pkg: 'arch-cloud', src: 'skills/arch/cloud', dest: 'skills/arch-cloud' },
  { pkg: 'platform-backend', src: 'skills/backend/databases', dest: 'skills/backend-databases' },
  { pkg: 'platform-backend', src: 'skills/backend/javaee', dest: 'skills/backend-javaee' },
  { pkg: 'domain-b2b', src: 'skills/domain/b2b', dest: 'skills/domain-b2b' },
  { pkg: 'domain-b2c', src: 'skills/domain/b2c', dest: 'skills/domain-b2c' },
  { pkg: 'ui-ux', src: 'skills/muji/android-theme', dest: 'skills/muji-android-theme' },
  { pkg: 'ui-ux', src: 'skills/muji/ios-theme', dest: 'skills/muji-ios-theme' },
  { pkg: 'ui-ux', src: 'skills/muji/klara-theme', dest: 'skills/muji-klara-theme' },
  { pkg: 'rag-ios', src: 'skills/rag/ios-rag', dest: 'skills/rag-ios-rag' },
  { pkg: 'rag-web', src: 'skills/rag/web-rag', dest: 'skills/rag-web-rag' }
];
```

## Related Code Files

**Modify**:
- `scripts/migrate-skills.mjs` (add flattening logic)

**Reference**:
- Existing file move logic: `migrateAspectFiles()`, `migrateNonStandardDirs()`
- Package update logic: `updatePackageYamls()`

## Implementation Steps

### 1. Add Flatten Configuration
```javascript
// After NAME_OVERRIDES constant
const FLATTEN_TARGETS = [
  // ... (10 entries as above)
];
```

### 2. Create `flattenSkillDirectories()` Function
```javascript
function flattenSkillDirectories() {
  log.info('Flattening nested skill directories...');

  for (const target of FLATTEN_TARGETS) {
    const pkgPath = path.join(REPO_ROOT, 'packages', target.pkg);
    const srcPath = path.join(pkgPath, target.src);
    const destPath = path.join(pkgPath, target.dest);

    // Validation
    if (!fs.existsSync(srcPath)) {
      log.warn(`Source not found: ${target.src} in ${target.pkg}`);
      continue;
    }

    if (fs.existsSync(destPath)) {
      log.warn(`Target already exists: ${target.dest} in ${target.pkg}`);
      continue;
    }

    // Move operation
    log.dryRun(`mv ${path.relative(REPO_ROOT, srcPath)} → ${path.relative(REPO_ROOT, destPath)}`);

    if (!DRY_RUN) {
      // Ensure parent directory exists
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      // Move directory
      fs.renameSync(srcPath, destPath);
      stats.skillsProcessed++;
      log.success(`Flattened: ${target.src} → ${target.dest}`);
    }
  }
}
```

### 3. Update `updatePackageYamls()` for Path Fixes
Add special handling for ui-ux/package.yaml:
```javascript
// After name replacement logic
// Fix ui-ux skill paths (slash → flat)
if (pkgName === 'ui-ux') {
  const pathFixes = [
    ['muji/ios-theme', 'muji-ios-theme'],
    ['muji/android-theme', 'muji-android-theme']
  ];

  for (const [oldPath, newPath] of pathFixes) {
    if (content.includes(oldPath)) {
      log.dryRun(`Update ${pkgName}/package.yaml: ${oldPath} → ${newPath}`);
      if (!DRY_RUN) {
        content = content.replace(new RegExp(oldPath, 'g'), newPath);
        updated = true;
      }
    }
  }
}
```

### 4. Update Main Execution Flow
```javascript
function main() {
  // ... existing setup

  // NEW: Flatten directories first (before file moves)
  console.log();
  flattenSkillDirectories();

  // Then proceed with existing migration
  log.info('Starting aspect file migration...\n');
  for (const skill of audit.skills) {
    migrateSkillFiles(skill);
  }

  // ... rest of existing logic
}
```

### 5. Update Stats Tracking
Add flattening counter:
```javascript
const stats = {
  directoriesFlattened: 0, // NEW
  filesMoved: 0,
  // ... existing stats
};
```

## Todo List

- [ ] Add `FLATTEN_TARGETS` configuration
- [ ] Implement `flattenSkillDirectories()` function
- [ ] Add ui-ux path fixes to `updatePackageYamls()`
- [ ] Update main execution flow (flatten before migrate)
- [ ] Add flattening stats to summary
- [ ] Test dry-run mode for all 10 targets
- [ ] Verify logging output is clear

## Success Criteria

- [ ] Script runs in dry-run mode without errors
- [ ] All 10 flattening operations logged
- [ ] ui-ux/package.yaml path fixes logged
- [ ] No breaking changes to existing logic
- [ ] Clear preview of all operations

## Risk Assessment

**Low complexity**:
- Pure directory moves (no file changes)
- Existing patterns to follow
- Dry-run validation available

**Error handling**:
- Check source exists before move
- Check target doesn't exist
- Preserve directory structure (recursive move)
- Log all operations clearly

## Security Considerations

- No external inputs (hardcoded targets)
- File operations within repo only
- Dry-run prevents accidental execution

## Next Steps

After implementation:
1. Run dry-run to preview all operations
2. Review output for correctness
3. Proceed to Phase 2 (execution)
