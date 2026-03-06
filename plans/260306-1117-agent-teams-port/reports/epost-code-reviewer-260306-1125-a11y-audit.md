# epost-code-reviewer: A11y Cross-Reference Audit

**Date**: 2026-03-06 11:25
**Agent**: epost-code-reviewer
**Plan**: `plans/260306-1117-agent-teams-port/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Audited all a11y-related files in `packages/` across 5 dimensions: agent refs, skill refs, file refs, knowledge loading, and skill-index sync. Core structure is sound — all 4 a11y skills exist, skill-index paths are valid, and `epost-a11y-specialist` loads correctly. However, 6 "Aspect Files" listed in the audit/fix/review a11y mode files reference platform-mode `.md` files that do not exist anywhere in `packages/`, and `CLAUDE.snippet.md` contains a stale annotation about skill inheritance.

---

## Files Reviewed

- `packages/a11y/agents/epost-a11y-specialist.md` — agent frontmatter + system prompt
- `packages/a11y/skills/a11y/SKILL.md` — base a11y skill
- `packages/a11y/skills/ios-a11y/SKILL.md` + 7 references
- `packages/a11y/skills/android-a11y/SKILL.md` + 6 references
- `packages/a11y/skills/web-a11y/SKILL.md` + 6 references
- `packages/a11y/package.yaml` — package manifest
- `packages/a11y/CLAUDE.snippet.md` — injected CLAUDE.md fragment
- `packages/core/skills/audit/references/a11y.md` — audit-a11y mode
- `packages/core/skills/audit/references/close-a11y.md` — close-a11y mode
- `packages/core/skills/fix/references/a11y-mode.md` — fix-a11y mode
- `packages/core/skills/review/references/a11y.md` — review-a11y mode
- `packages/core/skills/skill-index.json` — skill catalog (47 skills)
- `packages/core/tests/developer-role-scenarios.md` — test scenarios

~approx 800 lines analyzed

## Score

**7.2/10** — structure/routing: 9, file refs: 4 (6 missing), knowledge loading: 8, snippet accuracy: 5, test docs: 5

---

## Findings

### Agent Refs

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| A-001 | OK | `epost-a11y-specialist.md:6` | `skills: [core, skill-discovery, a11y]` — all 3 exist | — |
| A-002 | OK | `epost-a11y-specialist.md:8` | `permissionMode: default` — correct; fix mode needs Write/Edit | — |
| A-003 | OK | `audit/SKILL.md:19` | `agent-affinity: [epost-muji, epost-code-reviewer, epost-a11y-specialist]` — all agents exist | — |

### Skill Refs

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| S-001 | OK | `a11y/SKILL.md:6` | `agent: epost-a11y-specialist` — agent exists | — |
| S-002 | OK | `ios-a11y/SKILL.md:17` | `extends: [a11y]` — a11y skill exists | — |
| S-003 | OK | `android-a11y/SKILL.md:17` | `extends: [a11y]` — a11y skill exists | — |
| S-004 | OK | `web-a11y/SKILL.md:19` | `extends: [a11y]` — a11y skill exists | — |
| S-005 | Medium | `CLAUDE.snippet.md:8-9` | `*(extends ios/*)* ` and `*(extends android/*)* ` annotations are inaccurate — actual `connections.extends` is `[a11y]` only, no ios/* or android/* dependency | Remove the `*(extends X/*)* ` text; replace with `*(extends a11y)*` |

### File Refs

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| F-001 | High | `audit/references/a11y.md:52` | `references/ios-audit-mode.md` listed in Aspect Files table — **does not exist** in `packages/` | Create the file or remove the Aspect Files table entry |
| F-002 | High | `audit/references/a11y.md:53` | `references/android-audit-mode.md` — **does not exist** | Same as F-001 |
| F-003 | High | `fix/references/a11y-mode.md:16` | `references/ios-fix-mode.md` — **does not exist** | Create or remove |
| F-004 | High | `fix/references/a11y-mode.md:17` | `references/android-fix-mode.md` — **does not exist** | Create or remove |
| F-005 | High | `review/references/a11y.md:16` | `references/ios-guidance-mode.md` — **does not exist** | Create or remove |
| F-006 | High | `review/references/a11y.md:17` | `references/android-guidance-mode.md` — **does not exist** | Create or remove |
| F-007 | OK | `ios-a11y/SKILL.md:60` | `ios/development/references/tester.md` → resolves to `packages/platform-ios/skills/ios-development/references/tester.md` — exists | — |
| F-008 | OK | `a11y/SKILL.md:124` | `.claude/assets/known-findings-schema.json` — generated from `packages/a11y/assets/known-findings-schema.json`, exists in `.claude/assets/` after init | — |
| F-009 | OK | All ios-a11y references/ (7 files) | All 7 aspect files exist | — |
| F-010 | OK | All android-a11y references/ (6 files) | All 6 aspect files exist | — |
| F-011 | OK | All web-a11y references/ (6 files) | All 6 aspect files exist | — |

### Knowledge Loading

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| K-001 | OK | `epost-a11y-specialist.md:6` | Agent has `skills: [core, skill-discovery, a11y]` — base a11y skill always loaded | — |
| K-002 | OK | `epost-a11y-specialist.md:13-26` | Platform detection table instructs lazy-loading ios-a11y / android-a11y / web-a11y on demand | — |
| K-003 | Medium | `epost-a11y-specialist.md:6` | Agent does NOT pre-load `ios-a11y`, `android-a11y`, or `web-a11y` in `skills:` list — relies on agent body instruction to activate them. Platform skills are tier: `discoverable`, not pre-wired to agent via `skills:`. If model skips the "IMPORTANT: Activate platform skill" instruction, no platform rules load. | Add platform skills to `skills:` list, or add them to `agent-affinity` in skill-index with a note that skill-discovery will surface them |
| K-004 | Low | `skill-discovery/SKILL.md:157-159` | skill-discovery does mention `a11y + iOS → a11y, ios-a11y` pattern — so lazy loading is documented | — |

### skill-index Sync

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| I-001 | OK | `skill-index.json` | `a11y` entry path `../../a11y/skills/a11y/SKILL.md` — resolves correctly | — |
| I-002 | OK | `skill-index.json` | `ios-a11y` path — resolves correctly | — |
| I-003 | OK | `skill-index.json` | `android-a11y` path — resolves correctly | — |
| I-004 | OK | `skill-index.json` | `web-a11y` path — resolves correctly | — |
| I-005 | OK | `skill-index.json` | `connections.extends` for ios/android/web-a11y all correctly list `[a11y]` | — |
| I-006 | Medium | `skill-index.json` (ios-a11y, android-a11y entries) | `agent-affinity` includes `epost-fullstack-developer` but `epost-fullstack-developer` agent has no a11y signal to trigger discovery — these entries may never be surfaced in practice | Low impact; acceptable as-is or add `a11y` to fullstack-developer skills |

### Test Docs

| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| T-001 | Low | `developer-role-scenarios.md:50,75,128,217,224,231,238,245` | Uses old slash command format `/audit-a11y`, `/fix-a11y`, `/review-a11y`, `/audit-close-a11y` — current commands are `/audit --a11y`, `/fix --a11y`, `/review --a11y`, `/audit --close` | Update test scenarios to new flag-based commands |

---

## Severity Summary

| Critical | High | Medium | Low |
|----------|------|--------|-----|
| 0 | 6 | 3 | 2 |

---

## Files to Fix

| File | Action | Priority |
|------|--------|----------|
| `packages/core/skills/audit/references/` | Create `ios-audit-mode.md` + `android-audit-mode.md` OR remove Aspect Files table | High |
| `packages/core/skills/fix/references/` | Create `ios-fix-mode.md` + `android-fix-mode.md` OR remove Aspect Files table | High |
| `packages/core/skills/review/references/` | Create `ios-guidance-mode.md` + `android-guidance-mode.md` OR remove Aspect Files table | High |
| `packages/a11y/CLAUDE.snippet.md:8-9` | Remove `*(extends ios/*)* ` and `*(extends android/*)*` annotations | Medium |
| `packages/core/tests/developer-role-scenarios.md` | Update stale `/audit-a11y` etc. to `/audit --a11y` flag syntax | Low |

---

## Verdict

**FIX-AND-RESUBMIT** — 6 High findings: Aspect Files tables in audit/fix/review a11y modes reference 6 platform-mode `.md` files that don't exist. These are referenced as "load these for iOS/Android detail" — their absence means the audit, fix, and review modes silently operate without the documented iOS/Android-specific rules when those Aspect Files are explicitly requested by the model.

---

*Unresolved questions:*
- Were the 6 missing mode files (`ios-audit-mode.md`, etc.) intentionally deferred/omitted, or were they accidentally dropped during a refactor? The CHANGELOG for platform-ios shows `/ios:a11y:audit` commands that existed earlier — these mode files may have been the remnants of that old structure.
- K-003: Is the intent to always lazy-load platform skills via the agent body instruction, or should they be pre-wired in `skills:`? The current design works if the model follows the instruction, but it's fragile.
