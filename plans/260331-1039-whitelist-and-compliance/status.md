# Plan Status: Whitelist Tool Model + Skill Description Compliance

## Progress

| Phase | Title | Status | Notes |
|-------|-------|--------|-------|
| 1 | Description Validation Checklist | Done | Checklist section added to skill-development.md; description-validation-checklist.md created |
| 2 | Audit 25 Skill Descriptions | Done | 8 descriptions fixed; 17 passed as-is |
| 3 | Document Consensus-Voting Pattern | Done | consensus-voting.md created in SDD references/ |
| 4 | Whitelist Tool Model | Done | All 11 agents updated; kit docs updated |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | Created description-validation-checklist.md as a separate reference file | skill-development.md already referenced it; cleaner separation |
| 2026-03-31 | Situational trigger descriptions (core, journal, skill-discovery) left without quoted phrases | These trigger on conditions, not user speech — checklist item 5 only applies to phrase-triggered skills |
| 2026-03-31 | epost-git-manager allowedTools set to [Read, Bash] only | Git operations only need to read files and run git CLI commands |
| 2026-03-31 | Kept `tools:` upstream field in agents.md table (marked deprecated) | Document it exists for migration reference |

## Phase 2 Audit Results

| Skill | Status | Change |
|-------|--------|--------|
| audit | PASS | — |
| clean-code | PASS | Extra quotes cosmetic, description is correct |
| code-review | FIXED | Added quoted trigger phrases |
| cook | PASS | — |
| core | PASS | Contextual trigger, no user phrases needed |
| debug | PASS | — |
| docs | PASS | — |
| error-recovery | FIXED | Added quoted trigger phrases |
| fix | PASS | — |
| get-started | PASS | — |
| git | PASS | — |
| journal | PASS | Situational trigger (after completing work) |
| knowledge | FIXED | Removed workflow leak ("checks internal sources first") |
| loop | FIXED | Added quoted metric examples, reframed as trigger |
| mermaidjs | FIXED | Added "Use when user asks" + quoted phrases |
| plan | PASS | — |
| repomix | FIXED | Added (ePost) prefix + quoted trigger phrases |
| review | PASS | — |
| security | FIXED | Added quoted trigger phrases |
| skill-creator | FIXED | Added (ePost) prefix, reframed as trigger |
| skill-discovery | PASS | Process trigger (start of task) |
| subagent-driven-development | PASS | — |
| tdd | PASS | — |
| test | PASS | — |
| thinking | PASS | Situational trigger (stuck after 2+ attempts) |

## Architecture Reference

- `packages/kit/skills/kit/references/skill-development.md` — checklist section added at line ~99
- `packages/kit/skills/kit/references/description-validation-checklist.md` — NEW
- `packages/core/skills/subagent-driven-development/references/consensus-voting.md` — NEW
- 11 agents: `allowedTools:` added to all, `tools:` removed from epost-git-manager
- `packages/kit/skills/kit/references/agent-development.md` — allowedTools recommended, disallowedTools deprecated
- `packages/kit/skills/kit/references/add-agent.md` — step updated
- `packages/kit/skills/kit/references/agents.md` — table updated
