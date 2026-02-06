# Migration: /plan Command (Splash Pattern)

**Created by**: Phuong Doan
**Date**: 2026-02-06
**Status**: Active

---

## What Changed

The `/plan` command has been refactored from direct agent delegation into a **splash router pattern** with three specialized variants.

### New Behavior

- `/plan` is now a router that analyzes task complexity and routes to the appropriate variant
- Three variants: `/plan:fast`, `/plan:hard`, `/plan:parallel`
- Active plan state management with session persistence
- Enhanced hook integration for plan context injection

---

## Before vs After

### Before (v0.1)

```
/plan [description] → epost-architect directly
```

Single command, always spawned 3 researchers in parallel.

### After (Current)

```
/plan [description] → router analyzes complexity → routes to variant → epost-architect
```

Router selects optimal variant based on task characteristics:
- Simple tasks → `/plan:fast` (no research)
- Moderate tasks → `/plan:hard` (2 sequential researchers)
- Complex tasks → `/plan:parallel` (research + file ownership matrix)

---

## Backward Compatibility

✅ **No Breaking Changes**:
- `/plan [description]` still works (auto-routes to appropriate variant)
- Existing plans remain valid (no format changes required)
- No changes to `/cook`, `/review`, or other commands
- YAML frontmatter is additive (old plans without frontmatter still work)

---

## New Commands

### /plan:fast
Quick plan without research phase. Use for simple bug fixes, config changes, or well-understood patterns.

### /plan:hard
Deep plan with sequential research. Use for new patterns, architecture decisions, or unfamiliar tech.

### /plan:parallel
Parallel-ready plan with file ownership matrix and dependency graph. Use for multi-module features requiring coordination.

---

## State Management

Plans are now registered as "active" after creation for better context awareness:

**Check active plan**:
```bash
node .claude/scripts/get-active-plan.cjs
```

**Change active plan**:
```bash
node .claude/scripts/set-active-plan.cjs {plan-directory}
```

**Clear active plan**:
```bash
node .claude/scripts/set-active-plan.cjs ""
```

---

## Rollback Strategy

If issues are discovered:

1. **Immediate rollback**: Revert `.claude/commands/core/plan.md` to backup
2. **Partial rollback**: Keep variants but remove router (restore direct delegation)
3. **State management rollback**: Delete `.claude/scripts/` directory; hooks fail-open gracefully

**Backup command** (before using new pattern):
```bash
cp .claude/commands/core/plan.md .claude/commands/core/plan.md.bak
```

---

## Migration Checklist

- [x] Phase 1: Router Implementation
- [x] Phase 2: Fast & Hard Variants
- [x] Phase 3: Parallel Variant
- [x] Phase 4: State Management Scripts
- [x] Phase 5: Hook Integration
- [x] Phase 6: Planning Skill Enhancement
- [x] Phase 7: Documentation & Testing

---

## Support

For issues or questions:
- Check troubleshooting guide: `docs/troubleshooting-guide.md`
- Review system architecture: `docs/system-architecture.md`
- See CLI reference: `docs/cli-reference.md`
