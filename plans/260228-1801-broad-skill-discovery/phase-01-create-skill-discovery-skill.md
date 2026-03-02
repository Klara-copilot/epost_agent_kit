# Phase 01: Create skill-discovery Skill

## Context Links
- [Plan](./plan.md)
- [Research Report](../reports/research-260228-1703-skill-discovery-broad-investigation.md)

## Overview
**Date**: 2026-02-28
**Priority**: P1
**Description**: Create the shared `skill-discovery` SKILL.md with platform detection, index lookup, and skill loading protocol.
**Implementation Status**: ⏳ Pending

## Key Insights
- Protocol already proven in epost-architect (inline version)
- skill-index.json has `platforms`, `keywords`, `agent-affinity` fields — all usable for filtering
- Web has 11 platform skills, iOS 4, Android 3, Backend 2 — loading all would be excessive; need top-N selection

## Requirements
### Functional
- Platform detection: arguments → git diff → CWD path → none
- Skill lookup: filter skill-index.json by platform prefix and `platforms` field
- Skill loading: read top 3-5 relevant SKILL.md files, extract conventions
- Fallback: no platform detected → skip entirely (generic behavior preserved)
- Cross-platform: when multiple platforms detected → pick dominant (most changed files)

### Non-Functional
- Skill file < 150 lines (concise, not a tutorial)
- Must be `user-invocable: false` (passive background skill)
- No external dependencies

## Related Code Files
### Create (EXCLUSIVE to this phase)
- `packages/core/skills/skill-discovery/SKILL.md` — The skill itself [OWNED]

### Read-Only (reference)
- `.claude/skills/skill-index.json` — Unified index schema
- `packages/core/agents/epost-architect.md` — Existing inline protocol to extract from
- `packages/core/skills/hub-context/SKILL.md` — Platform detection patterns (similar logic)

## Implementation Steps
1. **Create directory** `packages/core/skills/skill-discovery/`
2. **Write SKILL.md** with frontmatter:
   - `name: skill-discovery`
   - `description:` trigger-only format per CSO principles
   - `keywords: [platform, discovery, skill-index, context]`
   - `platforms: [all]`
   - `agent-affinity: [epost-architect, epost-implementer, epost-debugger, epost-tester, epost-reviewer, epost-orchestrator]`
   - `user-invocable: false`
3. **Skill body sections**:
   - When to Activate (platform task detected or command passes platform hint)
   - Platform Detection (3-step: args → git → CWD)
   - Skill Lookup Protocol (read index, filter, rank)
   - Skill Loading Rules (top 3-5, what to extract)
   - Cross-Platform Handling (pick dominant or load both if ≤2 platforms)
   - Skip Conditions (no platform → do nothing)

## Todo List
- [ ] Create `packages/core/skills/skill-discovery/SKILL.md`
- [ ] Verify frontmatter follows CSO trigger-only description format
- [ ] Keep under 150 lines

## Success Criteria
- Skill file exists, valid frontmatter, < 150 lines
- Contains complete protocol: detect → lookup → load → fallback
- Does NOT duplicate hub-context logic (references it instead where applicable)

## Risk Assessment
**Risks**: Skill could become too verbose, bloating agent context
**Mitigation**: Strict 150-line cap; use progressive disclosure (protocol summary first, details in subsections)

## Security Considerations
None — reads local files only, no external calls.

## Next Steps
- Phase 02: Wire skill into agent frontmatter
