---
title: "Code Review Phase 2: ePost Stack-Specific Rules"
status: active
created: 2026-04-06
updated: 2026-04-06
effort: 5h
phases: 3
platforms: [web]
breaking: false
blocks: []
blockedBy: ["PLAN-0098"]
---

# Plan: Code Review Phase 2 — ePost Stack-Specific Rules

## Scope Rationale

1. **Problem**: Phase 1 created generic web rules (PERF/TS/STATE). Missing ePost-specific conventions — FetchBuilder, NextAuth+Keycloak, B2B modules, next-intl, Redux dual-store. Reviewer can't catch ePost misuse.
2. **Why this way**: Rules co-located with the skill that defines the pattern. Each skill owns its review rules. Same table format as Phase 1 for consistency.
3. **Why now**: Phase 1 infrastructure is in place. Adding ePost rules now means immediate value from `/review` on ePost web code.
4. **Simplest value**: 5 rule files, 5-8 rules each, plus one SKILL.md update for cascading detection.
5. **Cut 50%**: Drop MOD rules (least concrete conventions), drop I18N rules (mostly linting). Keep FETCH + AUTH + REDUX (highest impact).

## Design Decisions

### D1: Separate files per skill (not monolithic)

Each skill owns its `references/code-review-rules.md`:
- `web-api-routes/references/code-review-rules.md` → FETCH rules
- `web-auth/references/code-review-rules.md` → AUTH rules
- `web-modules/references/code-review-rules.md` → MOD rules
- `web-i18n/references/code-review-rules.md` → I18N rules

**Exception**: REDUX rules go in existing `web-frontend/references/code-review-rules.md` as a new section (dual-store is core web-frontend pattern).

**Rationale**: Follows Phase 1 precedent. Skills own their rules. No monolithic file growth.

### D2: Cascading rule detection via file-path patterns

Extend code-review/SKILL.md platform detection with ePost-specific pattern matching:

| File pattern | Rules loaded | Rule file |
|---|---|---|
| `caller/`, `fetch-builder`, `service/` | FETCH | `web-api-routes/references/code-review-rules.md` |
| `auth`, `session`, `feature-flag` | AUTH | `web-auth/references/code-review-rules.md` |
| `_stores/`, `redux`, `slice` | REDUX | Already in `web-frontend/references/code-review-rules.md` |
| `_modules/`, module shell patterns | MOD | `web-modules/references/code-review-rules.md` |
| `messages/`, `useTranslations`, locale | I18N | `web-i18n/references/code-review-rules.md` |

All web reviews always load generic web rules (PERF/TS/STATE). ePost-specific rules load additively when patterns match. Caller passes extra rule paths in dispatch prompt.

### D3: REDUX extends existing web-frontend file

The dual-store pattern is core web-frontend — not a separate concern. Add REDUX section to existing `web-frontend/references/code-review-rules.md` (currently 73 lines, ~85 after REDUX).

## Phases

| # | Phase | Effort | Depends | Status | File |
|---|-------|--------|---------|--------|------|
| 1 | Create ePost rule files (FETCH, AUTH, MOD, I18N) | 2h | — | pending | [phase-01](./phase-01-epost-rule-files.md) |
| 2 | Add REDUX section to web-frontend rules | 1h | — | pending | [phase-02](./phase-02-redux-rules.md) |
| 3 | Update code-review SKILL.md cascading detection | 2h | P1, P2 | pending | [phase-03](./phase-03-cascading-detection.md) |

**Parallelism**: P1 + P2 parallel (non-overlapping files). P3 sequential after both (updates SKILL.md with paths from P1+P2).

## Success Criteria

- [ ] 4 new `code-review-rules.md` files in web skill references (FETCH, AUTH, MOD, I18N)
- [ ] REDUX section added to `web-frontend/references/code-review-rules.md`
- [ ] code-review/SKILL.md documents cascading rule detection with file-path patterns
- [ ] All rule files < 80 lines, 5-8 rules each
- [ ] Same table format as Phase 1 (Rule ID, Rule, Severity, Pass, Fail)
- [ ] Each file has correct frontmatter (`user-invocable: false`, `disable-model-invocation: true`)

## Constraints

- All edits in `packages/` — never `.claude/` directly
- No new dependencies
- Backward-compatible: existing PERF/TS/STATE rules unchanged
- Rule content derived from existing skill SKILL.md files (web-api-routes, web-auth, etc.)
- Each rule file ≤ 80 lines

## Cross-Plan Dependencies

- PLAN-0098 (Phase 1): created platform-aware code-review — we extend it
- PLAN-0065 (audit-rules-standardization): established rule table format — we follow it
