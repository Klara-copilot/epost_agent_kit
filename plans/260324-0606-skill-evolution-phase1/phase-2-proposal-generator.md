---
phase: 2
title: "Proposal Generator"
effort: 3h
depends: [1]
---

# Phase 2: Proposal Generator

## Context Links
- [Plan](./plan.md)
- [Phase 1 — Signal Infrastructure](./phase-1-signal-infrastructure.md)
- Skill index: `.claude/skills/skill-index.json`
- Knowledge capture: `packages/core/skills/knowledge-capture/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 3h
- Description: Agent-driven proposal generation that reads signals.json, reads the target skill, and writes a concrete proposal file with a minimal diff and rationale.

## Requirements

### Functional
- Read `docs/proposals/signals.json` for signals with status `new`
- For each signal: read target skill SKILL.md, generate proposal with specific change
- Write proposal to `docs/proposals/{skill-name}-{YYMMDD}.md`
- Proposal includes: signal source, current skill excerpt, proposed change (diff), rationale, confidence
- Update signal status from `new` to `proposed` in signals.json
- Proposal frontmatter with status: `pending | approved | rejected`

### Non-Functional
- Proposals are minimal — single-section additions or edits, not full rewrites
- Each proposal targets exactly 1 skill file
- Max proposal size: 50 lines of diff content

## Related Code Files

### Files to Create
- `packages/core/skills/plan/references/evolve-mode.md` — Instructions for generating proposals (loaded by planner or fullstack-dev)
- Proposal template embedded in evolve-mode.md

### Files to Modify
- `packages/core/skills/journal/SKILL.md` — Add "signal emission" reminder in ## Rules section
- `packages/core/skills/cook/SKILL.md` — Add post-completion signal check instruction

### Files to Delete
- None

## Implementation Steps

1. **Create proposal template**
   ```markdown
   ---
   id: prop-{skill}-{YYMMDD}
   targetSkill: {skill-name}
   targetFile: packages/{package}/skills/{skill}/SKILL.md
   signal: {signal-id}
   confidence: high | medium
   status: pending
   created: YYYY-MM-DD
   ---

   # Proposal: {Title}

   ## Signal Source
   - File: {source path}
   - Type: {audit-failure | journal-flag | workaround}
   - Excerpt: "{relevant text}"

   ## Current Skill Excerpt
   ```
   {current text from SKILL.md}
   ```

   ## Proposed Change
   ```diff
   - {old line}
   + {new line}
   ```

   ## Rationale
   {Why this change addresses the signal}

   ## Risk
   {What could go wrong if applied}
   ```

2. **Create `evolve-mode.md` reference**
   - Instructions for the agent generating proposals
   - Read signal → read skill → identify gap → write minimal diff
   - Rules: never rewrite whole skill, always show before/after, always cite signal
   - Triggered manually via `/plan --evolve` or by dispatching fullstack-developer

3. **Add signal emission hints to existing skills**
   - `journal/SKILL.md` — in Rules table, add: "If a workaround was used or a gap was found, note it explicitly in 'What almost went wrong' with the skill name that should have caught it"
   - `cook/SKILL.md` — after phase completion, add: "If you used a workaround not covered by loaded skills, note it in the journal entry"

4. **Proposal generation workflow** (agent-driven, not scripted)
   - User runs `/plan --evolve` or `epost-kit evolve`
   - Planner loads evolve-mode.md
   - Reads signals.json, filters `status: new`
   - For each signal: reads target skill, generates proposal, writes to docs/proposals/
   - Updates signals.json status to `proposed`

## Todo List
- [ ] Create proposal template in evolve-mode.md
- [ ] Write evolve-mode.md with generation instructions
- [ ] Add signal emission hints to journal skill
- [ ] Add workaround reminder to cook skill
- [ ] Test: create a proposal from an existing signal
- [ ] Verify proposal diff is minimal and actionable

## Success Criteria
- Given a signal pointing to skill-discovery, agent generates a proposal file in `docs/proposals/`
- Proposal contains current excerpt, diff, and rationale
- Proposal is under 50 lines of diff content
- signals.json updated to show `proposed` status

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent generates over-broad proposals | Med | evolve-mode.md enforces "single section, minimal diff" rule |
| Signal points to non-existent skill | Low | Extractor validates skill name against skill-index.json |
| Multiple signals for same skill | Low | Group signals, generate 1 proposal per skill |

## Security Considerations
- Proposals write to docs/proposals/ only — never to packages/
- Agent reads skills read-only during generation

## Next Steps
- Phase 3 builds CLI command to review and apply proposals
