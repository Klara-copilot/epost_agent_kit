# Phase 01: Enhance skill-discovery with Lazy Loading Protocol

## Context Links
- [Plan](./plan.md)

## Overview
**Date**: 2026-02-28
**Priority**: P1
**Description**: Upgrade skill-discovery from "platform detection only" to a general-purpose lazy loader that can discover ANY skill (not just platform skills) based on task context.
**Implementation Status**: ⏳ Pending

## Key Insights
- Current skill-discovery only handles platform detection (ios/android/web/backend)
- Broader opportunity: discover ANY skill — debugging aids, knowledge-base, docs-seeker, sequential-thinking — based on task signals
- skill-index.json already has `keywords` and `triggers` fields for matching
- This makes skill-discovery the universal "context-aware skill loader"

## Requirements
### Functional
- Extend skill-discovery to match task context against ALL skills in index (not just platform-prefixed)
- Add a `tier` concept: `core` (always loaded) vs `discoverable` (loaded on-demand)
- Discovery protocol: detect task type → query index → filter by tier=discoverable → rank by relevance → load top N
- Token budget awareness: cap total discoverable skill bytes (e.g., max 15KB per task)

### Non-Functional
- Skill file stays < 200 lines (up from 150, to accommodate general discovery)
- No breaking change to existing platform detection flow

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `packages/core/skills/skill-discovery/SKILL.md` — Extend with general discovery [OWNED]
- `.claude/skills/skill-discovery/SKILL.md` — Installed copy [OWNED]

### Read-Only
- `.claude/skills/skill-index.json` — Index schema (will need tier field in Phase 02)

## Implementation Steps
1. **Extend SKILL.md** with new sections:
   - **Task Signal Detection**: Beyond platform, detect: debugging signals (errors, stack traces), knowledge signals (ADR, prior art), research signals (best practices, compare), documentation signals (write docs, spec)
   - **General Skill Matching**: Match task signals against skill `keywords` and `triggers` fields
   - **Tier Filtering**: Only discover skills marked `tier: discoverable` in index (once Phase 02 adds this)
   - **Token Budget**: Sum file sizes of candidate skills; cap at 15KB total; prefer smaller skills that cover the need
   - **Already-Loaded Check**: Skip skills already in agent's `skills:` list (avoid duplicate loading)
2. **Preserve existing platform detection** as the first (highest priority) matching strategy
3. **Add general keyword matching** as second strategy
4. **Copy to .claude/skills/**

## Todo List
- [ ] Extend skill-discovery SKILL.md with general discovery protocol
- [ ] Add token budget section
- [ ] Add already-loaded dedup logic
- [ ] Copy to installed location

## Success Criteria
- Skill-discovery can match non-platform skills (e.g., debugging task → loads problem-solving)
- Token budget cap prevents over-loading
- Backward compatible with current platform-only detection

## Risk Assessment
**Risks**: Over-eager matching loads too many skills, negating savings
**Mitigation**: Token budget cap + "max 3 discoverable skills per task" rule

## Security Considerations
None.

## Next Steps
- Phase 02: Add tier field to skill-index.json
