# Phase 03: Update Skill-Index and Validate

## Context Links
- [Plan](./plan.md)
- [Phase 02](./phase-02-wire-into-generalist-agents.md)

## Overview
**Date**: 2026-02-28
**Priority**: P2
**Description**: Regenerate skill-index.json to include skill-discovery entry, validate end-to-end.
**Implementation Status**: ⏳ Pending

## Key Insights
- `generate-skill-index.cjs` auto-scans SKILL.md files — just needs re-run
- Both `packages/core/skills/skill-index.json` and `.claude/skills/skill-index.json` need update
- Cross-platform handling: ask user when multiple platforms detected (per user preference)

## Requirements
### Functional
- Regenerate skill-index.json with new skill-discovery entry
- Copy updated index to `.claude/skills/skill-index.json`
- Validate: skill count incremented, entry has correct fields
- Dry-run scenario test: "plan biometric login for iOS" → architect loads ios-development skill

### Non-Functional
- Index file stays under 5KB target

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `packages/core/skills/skill-index.json` — Regenerated [OWNED]
- `.claude/skills/skill-index.json` — Copied from source [OWNED]

### Read-Only
- `packages/core/scripts/generate-skill-index.cjs` — Generator script
- Phase 01 skill file (must exist for generator to find it)

## Implementation Steps
1. **Run generator**: `node packages/core/scripts/generate-skill-index.cjs packages/core/skills`
2. **Verify** new entry: `skill-discovery` appears with correct metadata
3. **Copy** to `.claude/skills/skill-index.json` (or re-run with `.claude/skills` path)
4. **Validate count**: was 21 (core) / 47 (unified), now 22 / 48
5. **Scenario test** (manual verification):
   - Architect with skill-discovery loaded reads index → filters ios → finds ios-development, ios-rag, ios-ui-lib, ios-a11y
   - Debugger debugging a .swift file → discovery activates → loads ios-development conventions

## Todo List
- [ ] Regenerate core skill-index.json
- [ ] Regenerate/update unified .claude/skills/skill-index.json
- [ ] Verify entry count and schema
- [ ] Document cross-platform handling decision (ask user)

## Success Criteria
- skill-index.json has `skill-discovery` entry with correct platforms, keywords, agent-affinity
- Both index files (core + unified) are in sync regarding the new entry
- File size < 5KB (core), < 15KB (unified)

## Risk Assessment
**Risks**: Generator might not pick up the new skill if directory structure is wrong
**Mitigation**: Verify directory follows `packages/core/skills/{name}/SKILL.md` pattern

## Security Considerations
None.

## Next Steps
- Plan complete. Ready for `/cook`.
