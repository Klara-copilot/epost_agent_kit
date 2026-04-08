---
title: Redesign web-prototype-convert skill with 4-phase agentic pipeline
status: done
created: 2026-04-07
updated: 2026-04-07
effort: M
phases: 4
platforms: [web, kit]
breaking: false
blocks: []
blockedBy: []
---

# Web Prototype Convert — Redesign

## Scope Rationale (5-Why)

1. **What problem**: The `web-prototype-convert` skill is a disabled skeleton — its SKILL.md references 5 reference files that don't exist, so the skill cannot run. Users have no tool to convert external mockups (React/Next/Vite/plain HTML) into luz_next + klara-theme production code.
2. **Why this way**: A 4-phase agentic pipeline (Understand → Decide → Implement → Validate) matches how LLMs reason best — semantic intent extraction over pattern matching. Live source reading at Phase C avoids stale cached docs.
3. **Why now**: Prototypes arrive frequently (Letter-Wizard, The-Experiment already analyzed). Without this skill, each conversion is ad-hoc and inconsistent.
4. **Simplest version**: 5 reference files + rewritten SKILL.md under 80 lines. No tooling, no scripts, no new commands. Pure knowledge artifacts that guide LLM reasoning.
5. **Cut 50%**: Keep analysis-checklist, component-mapping, token-mapping; drop style-migration and data-migration into a single combined "migration patterns" file. **Rejected** — data layer (FetchBuilder, RTK, dual-store) is orthogonal to styling and deserves its own file; style and data reasoning happen at different pipeline stages.

## Summary

Replace skeleton SKILL.md with 4-phase pipeline (UNDERSTAND → DECIDE → IMPLEMENT → VALIDATE) and author 5 reference files that guide LLM reasoning for converting external prototypes into luz_next + klara-theme code. All reference files are semantic guides, not static lookup tables.

## Phases

| # | File | Effort | Depends | Ownership |
|---|------|--------|---------|-----------|
| 1 | [phase-01-skill-core-and-analysis.md](phase-01-skill-core-and-analysis.md) | S | — | `SKILL.md`, `references/analysis-checklist.md` |
| 2 | [phase-02-component-and-token-mapping.md](phase-02-component-and-token-mapping.md) | M | 1 | `references/component-mapping.md`, `references/token-mapping.md` |
| 3 | [phase-03-style-and-data-migration.md](phase-03-style-and-data-migration.md) | M | 1 | `references/style-migration.md`, `references/data-migration.md` |
| 4 | [phase-04-eval-and-validation.md](phase-04-eval-and-validation.md) | S | 1,2,3 | `eval-set.yaml`, SKILL.md description tuning |

**Parallelism**: Phase 2 and Phase 3 can run in parallel after Phase 1 (no file overlap).

## Constraints

- All edits in `packages/platform-web/skills/web-prototype-convert/` — NEVER `.claude/`
- SKILL.md ≤ 80 lines (progressive disclosure)
- Each reference file ≤ 200 lines, self-contained
- Reference files = reasoning guides, NOT static lookup tables
- YAGNI: only document patterns from real inputs (React+Tailwind, Next.js, plain HTML+JS, Vite+React+Radix+Zustand)
- No tooling, no scripts — pure markdown knowledge artifacts
- Remove "skill is disabled" warning from SKILL.md after Phase 1

## Success Criteria

- [ ] SKILL.md rewritten with 4-phase pipeline, under 80 lines, no "disabled" note
- [ ] 5 reference files exist, each under 200 lines
- [ ] SKILL.md references resolve (no dangling file links)
- [ ] `user-invocable: true` in frontmatter (skill enabled)
- [ ] Eval set validates the skill triggers on the documented prompts
- [ ] Phase B (DECIDE) output format documented with the 3-section confidence structure (✅/🟡/🔴)
- [ ] Phase C (IMPLEMENT) explicitly instructs agent to read live klara source at conversion time
- [ ] `kit-verify` passes

## Risks

- **Drift from live klara API**: mitigated by Phase C "read live source" rule
- **Reference files ballooning**: enforced by 200-line cap per file
- **Over-specification**: reference files must be reasoning guides, not exhaustive lookup tables — reviewed in Phase 4
