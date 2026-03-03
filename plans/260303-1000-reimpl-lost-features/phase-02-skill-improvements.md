# Phase 02: Commit skill ecosystem improvements

## Context Links
- Parent plan: [plan.md](./plan.md)

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Commit skill content enhancements, metadata additions, and skill-index expansion
**Implementation Status**: Pending

## Key Insights

These improvements span multiple skill files in `packages/`:

### A. Agent skills list expansion (packages/core/agents/, packages/a11y/agents/, packages/design-system/agents/)
- `epost-architect`: added `knowledge-retrieval` to skills
- `epost-implementer`: added `knowledge-retrieval` to skills
- `epost-debugger`, `epost-researcher`, `epost-git-manager`: minor frontmatter tweaks
- `epost-muji`, `epost-a11y-specialist`: minor tweaks

### B. knowledge-retrieval skill (packages/core/skills/knowledge-retrieval/)
- Cross-Source Bridging section (docs/ <-> RAG coordination table)
- Cross-Platform RAG Coordination section (web + iOS RAG queries)
- Enhanced staleness detection (RAG sidecar staleness, `stale_sidecar: true` flag)
- `references/search-strategy.md` updates

### C. Skill metadata additions (packages/core/, packages/a11y/, packages/kit/)
- ~30 skills got `metadata.keywords` and `metadata.platforms` added to frontmatter
- `metadata.connections.requires` added to `kit-add-agent`, `kit-add-skill`
- `kit-agents` and `kit-skill-development` got content additions

### D. skill-index.json expansion (packages/core/skills/skill-index.json)
- Count increased from 52 to 60 skills
- Full metadata (keywords, platforms, triggers, agent-affinity, connections) for each
- Previously missing skills added (a11y variants, audit-a11y, audit-close-a11y, etc.)

### E. docs-update scan mode (packages/core/skills/docs-update/)
- New `--scan` flag for freshness checking
- Mode detection (scan vs update)
- Staleness reporting with git log integration

### F. ios-rag + web-rag improvements
- Sidecar workflow references
- Smart query patterns

### G. hub-context skill
- Minor addition

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/agents/epost-architect.md` [OWNED]
- `packages/core/agents/epost-implementer.md` [OWNED]
- `packages/core/agents/epost-debugger.md` [OWNED]
- `packages/core/agents/epost-researcher.md` [OWNED]
- `packages/core/agents/epost-git-manager.md` [OWNED]
- `packages/core/skills/knowledge-retrieval/SKILL.md` [OWNED]
- `packages/core/skills/knowledge-retrieval/references/search-strategy.md` [OWNED]
- `packages/core/skills/skill-index.json` [OWNED]
- `packages/core/skills/docs-update/SKILL.md` [OWNED]
- `packages/core/skills/hub-context/SKILL.md` [OWNED]
- ~30 skill SKILL.md files for metadata additions
- `packages/kit/skills/kit-add-agent/SKILL.md` [OWNED]
- `packages/kit/skills/kit-add-skill/SKILL.md` [OWNED]
- `packages/kit/skills/kit-agents/SKILL.md` [OWNED]
- `packages/kit/skills/kit-skill-development/SKILL.md` [OWNED]
- `packages/a11y/agents/epost-a11y-specialist.md` [OWNED]
- `packages/a11y/skills/android-a11y/SKILL.md` [OWNED]
- `packages/a11y/skills/ios-a11y/SKILL.md` [OWNED]
- `packages/a11y/skills/web-a11y/SKILL.md` [OWNED]
- `packages/design-system/agents/epost-muji.md` [OWNED]
- `packages/platform-ios/skills/ios-rag/SKILL.md` [OWNED]
- `packages/platform-web/skills/web-rag/SKILL.md` [OWNED]

### Create (EXCLUSIVE)
- `packages/platform-ios/skills/ios-rag/references/smart-query.md` [NEW]

## Implementation Steps
1. Stage all `packages/` skill and agent changes: `git add packages/core/agents/ packages/core/skills/ packages/a11y/ packages/kit/skills/ packages/design-system/agents/ packages/platform-ios/skills/ packages/platform-web/skills/`
2. Review staged diff for unintended changes
3. Commit with message describing skill ecosystem improvements
4. Run `epost-kit init --profile full` to regenerate `.claude/` from updated packages
5. Verify `.claude/skills/skill-index.json` reflects new count and connections

## Todo List
- [ ] Stage packages/ skill changes
- [ ] Review and commit
- [ ] Regenerate .claude/ via init
- [ ] Verify skill-index reflects improvements

## Success Criteria
- All skill improvements present in `packages/` (source of truth)
- `skill-index.json` count >= 60 with connections populated
- `epost-kit lint` passes

## Risk Assessment
**Risks**: Bulk staging might catch unrelated changes
**Mitigation**: Review `git diff --cached` before committing

## Next Steps
After completion: run `epost-kit lint` to validate
