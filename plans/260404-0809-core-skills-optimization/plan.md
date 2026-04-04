---
updated: 2026-04-04
id: 260404-0809-core-skills-optimization
title: Core Skills Optimization — Token, Frontmatter, Content
status: active
created: 2026-04-04
phases: 3
---

## Goal

Audit and optimize all 32 core skills for:
1. Valid, lean frontmatter (no invalid fields, misplaced fields)
2. Descriptions ≤250 chars (truncated beyond this — trigger phrases lost)
3. Body content efficiency (bloated skills → offload deep content to references/)

Logic and task behavior must remain identical. No feature changes.

## Findings Summary

### Issue 1 — Invalid / misplaced frontmatter fields (affects all skills)

**`argument-hint` buried in `metadata:`** (should be root-level Layer B field):
- 14 skills: audit, cook, debug, didyouknow, docs, fix, get-started, git, plan, research, retro, scenario, test, whatsnew

**`tier` at root level** (not a Claude Code field — belongs in `metadata:` or remove):
- 8 skills: clean-code, core, debug, loop, repomix, security, tdd, kit-verify

**`category` at root level** (not a Claude Code field — belongs in `metadata:` or remove):
- 3 skills: deploy, preview, thinking

**`kit-verify` root-level mess**: `keywords`, `platforms`, `tier` all at root — all belong in `metadata:`

### Issue 2 — Descriptions over 250 chars (truncated, triggers lost)

| Skill | Chars | Priority |
|-------|-------|---------|
| audit | 376 | High |
| loop | 351 | High |
| get-started | 302 | High |
| subagents-driven | 301 | High |
| knowledge | 299 | High |
| understand-patterns | 289 | High |
| docs | 286 | High |
| repomix | 281 | Medium |
| error-recovery | 280 | Medium |
| clean-code | 277 | Medium |
| cook | 277 | Medium |
| git | 276 | Medium |
| security | 276 | Medium |
| debug | 271 | Medium |
| research | 270 | Medium |

### Issue 3 — Oversized SKILL.md bodies

| Skill | Lines | Action |
|-------|-------|--------|
| get-started | 346 | Offload phase steps to references/ |
| debug | 269 | Offload platform-specific debug patterns to references/ |
| error-recovery | 254 | Offload resilience pattern catalog to references/ |
| plan | 253 | Review for offload candidates |
| audit | 230 | Already has references/ — review what's still inline |

---

## Phases

### Phase 1 — Frontmatter cleanup (22 skills)

**Files to edit:**
- Move `argument-hint` from `metadata:` to root in: audit, cook, debug, didyouknow, docs, fix, get-started, git, plan, research, retro, scenario, test, whatsnew
- Move `tier` from root to `metadata.tier` in: clean-code, core, debug, loop, repomix, security, tdd
- Move `category` from root to `metadata.category` in: deploy, preview, thinking
- Fix `kit-verify`: move root-level `keywords`, `platforms`, `tier` into `metadata:`

**Acceptance criteria:**
- No `tier`, `category` at root frontmatter level
- `argument-hint` at root level for all user-invocable skills
- `kit-verify` frontmatter is clean

### Phase 2 — Description trimming (15 skills)

**Rules:**
- Target: ≤250 chars (hard limit — beyond this Claude cannot see trigger phrases)
- Front-load the trigger phrase ("Use when...")
- Remove the "(ePost) [what it does]" prefix duplication — it says it twice
- Keep: platform context, 3-5 trigger phrases, one-line what-it-does
- Do NOT remove trigger phrases — only remove redundant prose

**Files:** audit, loop, get-started, subagents-driven, knowledge, understand-patterns, docs, repomix, error-recovery, clean-code, cook, git, security, debug, research

**Acceptance criteria:**
- All descriptions ≤250 chars
- Key trigger phrases preserved (verify against existing triggers in metadata)
- No description is so short it loses its signal

### Phase 3 — Body size reduction (4 skills)

**Target: ≤150 lines per SKILL.md**

**`get-started` (346 lines)**
- Keep: trigger conditions, output format, what questions to ask
- Offload to `references/onboarding-workflow.md`: the full phase-by-phase discovery steps

**`debug` (269 lines)**
- Keep: when to trigger, 5-step root cause protocol
- Offload to `references/platform-debug-patterns.md`: platform-specific debugging tools, log locations

**`error-recovery` (254 lines)**
- Keep: when to use, decision tree for which pattern
- Offload to `references/resilience-patterns.md`: full retry/circuit-breaker/backoff code examples

**`plan` (253 lines)**
- Keep: what a plan is, phases structure, frontmatter spec
- Offload to `references/plan-templates.md`: example plan structures and phase templates

**Acceptance criteria:**
- Each refactored SKILL.md ≤150 lines
- References are linked from SKILL.md body so Claude knows when to load them
- Behavior identical (same instructions, just moved)

---

## Constraints

- `packages/` only — never edit `.claude/` directly
- Run `node .claude/scripts/generate-skill-index.cjs` after all changes
- Commit after each phase with clear message
- No logic changes — only structural cleanup

## Success Criteria

- All 32 core skill SKILL.md files pass frontmatter validation (no invalid root fields)
- All descriptions ≤250 chars
- Top 4 oversized skills ≤150 lines
- `kit-verify` runs clean after changes
- No agent routing or behavior changed
