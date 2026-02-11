# Phase 3: Update Cascading References

**Priority**: P1
**Status**: pending
**Effort**: 30min
**Depends on**: Phase 2 complete

## Context

After flattening directories, update all cascading references: package.yaml paths, regenerate skill indices, reinstall to .claude/skills/, and verify agent affinity.

## Key Insights

**Package.yaml impact**:
- ui-ux/package.yaml uses slash paths: `muji/ios-theme`, `muji/android-theme`
- Other packages already use dash names (no changes needed)

**Skill index regeneration**:
- Source indices: `packages/*/skills/skill-index.json`
- Global index: `.claude/skills/skill-index.json`

**Agent affinity**:
- Agents reference skills by name, not path (unlikely impact)
- Verify no hardcoded path references

## Requirements

### Functional
- Fix ui-ux/package.yaml skill paths
- Verify no agent path references
- Regenerate source skill indices
- Reinstall to .claude/skills/
- Regenerate global skill index

### Non-functional
- Clear logging for each update
- Validate regeneration success
- Verify no broken references

## Related Code Files

**Modify**:
- `packages/ui-ux/package.yaml` (skill paths)

**Regenerate**:
- `packages/*/skills/skill-index.json` (via generate-skill-index.cjs)
- `.claude/skills/skill-index.json` (after reinstall)

**Verify**:
- `.claude/agents/*.md` (check for path references)

## Implementation Steps

### 1. Verify ui-ux/package.yaml Updated

The migration script should handle this, but verify:

```bash
grep -A 10 "^  skills:" packages/ui-ux/package.yaml
```

**Expected**:
```yaml
  skills:
  - muji-klara-theme
  - muji-ios-theme        # ✅ dash, not slash
  - muji-android-theme    # ✅ dash, not slash
  - muji/figma-variables
  - web/klara-theme
  - web/figma-integration
```

If not updated:
```bash
# Manual fix
sed -i '' 's|muji/ios-theme|muji-ios-theme|g' packages/ui-ux/package.yaml
sed -i '' 's|muji/android-theme|muji-android-theme|g' packages/ui-ux/package.yaml
```

### 2. Check Agent Path References

Verify no agents reference skill paths (should use names only):

```bash
# Search for old nested paths
grep -r "skills/arch/cloud\|skills/backend/\|skills/domain/\|skills/muji/\|skills/rag/" \
  .claude/agents/*.md 2>/dev/null
```

**Expected**: No results (agents use skill names, not paths)

If found, update manually to flat paths.

### 3. Regenerate Source Skill Indices

For each package with affected skills:

```bash
# arch-cloud
node packages/core/scripts/generate-skill-index.cjs packages/arch-cloud/skills

# platform-backend
node packages/core/scripts/generate-skill-index.cjs packages/platform-backend/skills

# domain-b2b
node packages/core/scripts/generate-skill-index.cjs packages/domain-b2b/skills

# domain-b2c
node packages/core/scripts/generate-skill-index.cjs packages/domain-b2c/skills

# ui-ux
node packages/core/scripts/generate-skill-index.cjs packages/ui-ux/skills

# rag-ios
node packages/core/scripts/generate-skill-index.cjs packages/rag-ios/skills

# rag-web
node packages/core/scripts/generate-skill-index.cjs packages/rag-web/skills
```

**Verify**: Each package now has updated `skills/skill-index.json`

### 4. Reinstall to .claude/skills/

This should be handled by migration script, but verify/rerun:

```bash
# Remove old .claude/skills/
rm -rf .claude/skills/*

# Reinstall from packages (migration script does this)
# Or use install script:
.claude/skills/install.sh
```

### 5. Verify .claude/skills/ Structure

Check flat structure installed correctly:

```bash
# Check all 10 flattened skills exist in .claude/skills/
ls -d .claude/skills/arch-cloud
ls -d .claude/skills/backend-databases
ls -d .claude/skills/backend-javaee
ls -d .claude/skills/domain-b2b
ls -d .claude/skills/domain-b2c
ls -d .claude/skills/muji-android-theme
ls -d .claude/skills/muji-ios-theme
ls -d .claude/skills/muji-klara-theme
ls -d .claude/skills/rag-ios-rag
ls -d .claude/skills/rag-web-rag
```

### 6. Regenerate Global Skill Index

```bash
node packages/core/scripts/generate-skill-index.cjs .claude/skills
```

**Verify**: `.claude/skills/skill-index.json` updated

### 7. Validate Skill Index Content

Check that skill names match directory names:

```bash
# Extract skill names from global index
cat .claude/skills/skill-index.json | jq -r '.skills[].name' | \
  grep -E "arch-cloud|backend-databases|backend-javaee|domain-b2b|domain-b2c|muji-android-theme|muji-ios-theme|muji-klara-theme|rag-ios-rag|rag-web-rag"
```

**Expected**: All 10 skill names listed

### 8. Cross-Check Package Definitions

Verify package.yaml matches installed structure:

```bash
# Check arch-cloud
cat packages/arch-cloud/package.yaml | grep -A 1 "skills:"
ls .claude/skills/ | grep arch-cloud

# Check platform-backend
cat packages/platform-backend/package.yaml | grep -A 3 "skills:"
ls .claude/skills/ | grep backend-

# Check ui-ux
cat packages/ui-ux/package.yaml | grep -A 7 "skills:"
ls .claude/skills/ | grep muji-

# ... (verify others)
```

## Todo List

- [ ] Verify ui-ux/package.yaml paths updated
- [ ] Check agent files for path references
- [ ] Regenerate skill indices (7 packages)
- [ ] Reinstall to .claude/skills/
- [ ] Verify flat structure in .claude/skills/
- [ ] Regenerate global skill index
- [ ] Validate skill index content
- [ ] Cross-check package definitions

## Success Criteria

- [ ] ui-ux/package.yaml uses dash paths (not slashes)
- [ ] No agent path references found
- [ ] All source skill indices regenerated
- [ ] .claude/skills/ reinstalled with flat structure
- [ ] Global skill index regenerated
- [ ] All 10 skills listed in global index
- [ ] Package definitions match installed structure
- [ ] No broken references

## Risk Assessment

**Low risk**:
- Skill indices are generated (idempotent)
- Reinstall is full replace (no merge issues)
- Can regenerate multiple times safely

**Validation**:
- Multiple verification steps
- Cross-check between package.yaml and installed structure
- Test skill loading (next phase)

## Security Considerations

- No credential changes
- All operations within repo
- No external API calls

## Next Steps

After successful updates:
1. Proceed to Phase 4 (cleanup empty dirs)
2. Consider running skill load test
3. Prepare final validation
