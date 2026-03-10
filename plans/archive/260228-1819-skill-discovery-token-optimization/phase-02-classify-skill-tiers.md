# Phase 02: Classify Skills into Core vs Discoverable Tiers

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-enhance-skill-discovery-lazy-loading.md)

## Overview
**Date**: 2026-02-28
**Priority**: P1
**Description**: Add `tier` field to skill-index.json. Classify each of 48 skills as `core` (always loaded when in agent's list) or `discoverable` (loaded on-demand by skill-discovery).
**Implementation Status**: ⏳ Pending

## Key Insights
- Not all skills are equal: `core` (safety rules) must always load; `docs-seeker` (library lookup) only when researching
- Classification criteria: How often does this skill apply? Always → core. Sometimes → discoverable.
- The generator script needs a minor update to read `tier` from frontmatter

## Requirements
### Functional
- Add `tier: core | discoverable` to each skill's YAML frontmatter
- Update `generate-skill-index.cjs` to include `tier` field in index
- Regenerate both skill-index.json files

### Non-Functional
- Default tier = `discoverable` (if not specified)
- Core tier = only truly universal skills

## Proposed Classification

### Tier: `core` (always loaded when in agent's skills list — 6 skills)
| Skill | Reason |
|-------|--------|
| core | Safety rules, boundaries — ALWAYS needed |
| skill-discovery | Meta-skill for loading others — needed to discover |
| code-review | Primary function for reviewer/implementer |
| debugging | Primary function for debugger |
| planning | Primary function for architect/orchestrator |
| hub-context | Essential for orchestrator routing |

### Tier: `discoverable` (loaded on-demand — 42 skills)
| Category | Skills | Trigger Signals |
|----------|--------|-----------------|
| **Platform** (20) | ios-*, android-*, web-*, backend-* | File extensions, platform keywords |
| **Knowledge** (3) | knowledge-base, knowledge-retrieval, knowledge-capture | ADR, prior art, learnings |
| **Research** (3) | research, docs-seeker, repomix | Best practices, library docs, repo overview |
| **Thinking** (2) | sequential-thinking, problem-solving | Complex problem, stuck, root cause |
| **Recovery** (1) | error-recovery | Retry, timeout, circuit breaker |
| **Documentation** (1) | doc-coauthoring | Write docs, spec, proposal |
| **A11y** (4) | a11y, ios-a11y, android-a11y, web-a11y | Accessibility, WCAG, a11y |
| **Kit** (6) | kit-agents, kit-agent-dev, kit-skill-dev, kit-commands, kit-hooks, kit-cli | Agent/skill/command authoring |
| **Domain** (2) | domain-b2b, domain-b2c | Module names, B2B/B2C keywords |
| **Design** (4) | web-figma, web-figma-variables, web-ui-lib, web-ui-lib-dev | Figma, design tokens, components |
| **Infra** (2) | infra-cloud, infra-docker | Docker, GCP, Terraform |
| **Meta** (3) | data-store, verification-before-completion, receiving-code-review, subagent-driven-development | Context-specific triggers |

## Related Code Files
### Modify (EXCLUSIVE to this phase)
- `packages/core/scripts/generate-skill-index.cjs` — Read `tier` from frontmatter [OWNED]
- All 48 SKILL.md files — Add `tier:` to frontmatter [OWNED]
- `packages/core/skills/skill-index.json` — Regenerated [OWNED]
- `.claude/skills/skill-index.json` — Regenerated [OWNED]

### Read-Only
- Phase 01 enhanced skill-discovery (to verify it uses tier field)

## Implementation Steps
1. **Update generator**: Add `tier` extraction from frontmatter; default to `discoverable`
2. **Add `tier: core` to 6 core skills** frontmatter
3. **Add `tier: discoverable` to remaining 42 skills** (or omit, since default)
4. **Regenerate indexes**: Run generator for both core and unified indexes
5. **Verify**: Check index has tier field for all entries

## Todo List
- [ ] Update `generate-skill-index.cjs` to extract `tier`
- [ ] Add `tier: core` to 6 core skills
- [ ] Regenerate both skill-index.json files
- [ ] Verify tier appears in index entries

## Success Criteria
- All 48 skills have tier in index (6 core, 42 discoverable)
- Generator produces correct tier values
- No frontmatter parsing errors

## Risk Assessment
**Risks**: Misclassifying a critical skill as discoverable → agent misses it
**Mitigation**: Conservative classification — when in doubt, keep as core. Phase 04 validates.

## Security Considerations
None.

## Next Steps
- Phase 03: Slim agent skills lists using tier system
