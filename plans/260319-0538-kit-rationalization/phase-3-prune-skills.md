---
phase: 3
title: "Prune Analysis/Reasoning Skills"
effort: 4h
depends: [1]
---

# Phase 3: Prune Analysis/Reasoning Skills

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/` — skill source files
- `.claude/skills/skill-index.json` — skill registry

## Overview
- Priority: P2
- Status: Complete
- Effort: 4h
- Description: Remove or consolidate ~16-20 skills that duplicate native Claude Code capabilities or are thin wrappers. Preserve all domain knowledge skills. Target: 66 -> ~50 skills.

## Requirements

### Functional
- Delete skills that encode generic reasoning Claude already does
- Consolidate kit-authoring skills that overlap
- Move any surviving content from deleted skills into existing references or CLAUDE.md
- Keep skill-index.json accurate

### Non-Functional
- Zero domain knowledge lost
- All a11y, design-system, platform-*, domain-* skills untouched
- skill-discovery protocol still works

## Skills Assessment

### DELETE (native Claude Code handles these)

| Skill | Category | Reason |
|-------|----------|--------|
| sequential-thinking | analysis-reasoning | Claude does chain-of-thought natively |
| problem-solving | analysis-reasoning | Claude does this natively |
| auto-improvement | analysis-reasoning | Thin wrapper over reflection |
| bootstrap | development-tools | One-time use, move to CLAUDE.md |
| convert | development-tools | Rarely used, generic task |
| epost | development-tools | Meta-skill about the kit itself; info in CLAUDE.md |
| repomix | analysis-reasoning | Tool usage, not domain knowledge |
| scout | analysis-reasoning | Grep/Glob instructions; native |
| simulator | development-tools | Niche, rarely used |
| data-store | development-tools | Thin pattern doc, move to CLAUDE.md |
| infra-cloud | infrastructure | Generic, no team-specific content |
| infra-docker | infrastructure | Generic, no team-specific content |

### CONSOLIDATE (merge into parent skills)

| Skill | Merge Into | Reason |
|-------|-----------|--------|
| kit-agent-development | kit/references/ | Reference material, not active skill |
| kit-skill-development | kit/references/ | Reference material, not active skill |
| kit-hooks | kit/references/ | Reference material, not active skill |
| kit-cli | kit/references/ | Reference material, not active skill |
| kit-agents | kit/references/ | Reference material, not active skill |
| kit-verify | kit/references/ | Reference material, not active skill |
| doc-coauthoring | docs/references/ | Thin wrapper, merge into docs skill |
| web-prototype | web-frontend/references/ | Actively used but thin — consolidate content into web-frontend reference |
| web-rag | web-frontend/references/ | RAG config — consolidate into web-frontend reference |

### KEEP UNTOUCHED (domain knowledge)

All skills in these categories stay as-is:
- accessibility (4): a11y, ios-a11y, android-a11y, web-a11y
- design-system (5): figma, design-tokens, ui-lib-dev, launchpad, web-ui-lib
- platform-web (7): web-frontend, web-nextjs, web-api-routes, web-auth, web-i18n, web-testing, web-modules
- platform-ios (3): ios-development, ios-ui-lib, ios-rag
- platform-android (2): android-development, android-ui-lib
- platform-backend (2): backend-javaee, backend-databases
- business-domains (2): domain-b2b, domain-b2c
- orchestration (8): core, skill-discovery, knowledge-retrieval, knowledge-capture, subagent-driven-development, error-recovery, plan, cook
- workflows (6): audit, code-review, review, fix, debug, test, git, docs, research, get-started

## Related Code Files

### Files to Delete (from packages/)
- `packages/core/skills/sequential-thinking/`
- `packages/core/skills/problem-solving/`
- `packages/core/skills/auto-improvement/`
- `packages/core/skills/bootstrap/`
- `packages/core/skills/convert/`
- `packages/core/skills/epost/`
- `packages/core/skills/repomix/`
- `packages/core/skills/scout/`
- `packages/core/skills/simulator/`
- `packages/core/skills/data-store/`
- `packages/core/skills/infra-cloud/`
- `packages/core/skills/infra-docker/`

### Files to Modify
- `packages/core/skills/kit/` — add references/ from merged kit-* skills
- `packages/core/skills/docs/` — merge doc-coauthoring content
- `packages/core/skills/web-frontend/` — merge web-prototype, web-rag references
- `packages/core/skills/skill-index.json` — remove deleted, update merged
- Various package.yaml files — remove skill registrations

### Files to Delete (consolidation)
- `packages/core/skills/kit-agent-development/` (after merge into kit/)
- `packages/core/skills/kit-skill-development/` (after merge into kit/)
- `packages/core/skills/kit-hooks/` (after merge into kit/)
- `packages/core/skills/kit-cli/` (after merge into kit/)
- `packages/core/skills/kit-agents/` (after merge into kit/)
- `packages/core/skills/kit-verify/` (after merge into kit/)
- `packages/core/skills/doc-coauthoring/` (after merge into docs/)
- `packages/core/skills/web-prototype/` (after merge)
- `packages/core/skills/web-rag/` (after merge)

## Implementation Steps

1. **Backup check**: Verify all content is in git (committed or at least tracked)

2. **Delete pure-redundant skills** (12 skills)
   - Delete each directory from packages/
   - Check no skill has `extends:` or `requires:` pointing to deleted skill
   - If dependency found: keep that skill, skip deletion

3. **Consolidate kit-* skills into kit/**
   - Create `packages/core/skills/kit/references/` if not exists
   - For each kit-* skill: move SKILL.md content into `kit/references/{name}.md`
   - Update kit/SKILL.md to reference new files in Aspect Files table
   - Delete original kit-* directories

4. **Consolidate remaining merge targets**
   - doc-coauthoring -> docs/references/coauthoring.md
   - web-prototype -> web-frontend/references/prototype.md
   - web-rag -> web-frontend/references/rag.md

5. **Update skill-index.json**
   - Remove all deleted skill entries
   - Update merged skill entries (kit now has more references)
   - Update count field
   - Verify no duplicates

6. **Update cross-references**
   - Grep for deleted skill names in all remaining skills
   - Update references to point to new locations
   - Check agent skills: lists in agent frontmatter

7. **Run epost-kit init and verify**
   - Verify .claude/ regeneration
   - Verify skill-discovery still finds platform skills
   - Verify /cook, /audit, /fix still load correct skills

## Todo List
- [x] Delete 12 pure-redundant skills from packages/
- [x] Merge 6 kit-* skills into kit/references/
- [x] Merge 3 remaining consolidation targets
- [x] Update skill-index.json (count, entries, no duplicates)
- [x] Fix all cross-references pointing to deleted/merged skills
- [ ] Run epost-kit init (requires running init command — deferred)
- [ ] Test skill-discovery with sample prompts

## Success Criteria
- Skill count: 66 -> ~45-50
- All domain skills intact (a11y, design-system, platform-*, domain-*)
- skill-index.json count matches actual directory count
- No broken extends/requires chains

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleted skill has hidden dependency | High | Pre-check extends/requires in skill-index.json |
| Kit-* merge loses nuance | Med | Keep full content in references/, just relocate |
| Cross-references break silently | Med | Grep for deleted skill names project-wide |

## Security Considerations
- None — skill files are documentation only

## Next Steps
- Phase 4: Hook cleanup
