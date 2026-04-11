---
title: Scheduled Automated Code Review System
status: active
created: 2026-04-10
updated: 2026-04-11
effort: 3-4 days
phases: 3
platforms: [web, ios, android, backend]
breaking: false
blocks: []
blockedBy: []
---

# Scheduled Automated Code Review System

3-layer automated review: PR gate (Layer 1), daily branch scan (Layer 2), confidence engine (Layer 3, cross-cutting).

**Trigger**: daily cron via `schedule` skill — zero user action required.
**Scan scope**: all branches with activity in last 7 days, diffed against `main`. `kb` branch always excluded.
**Slack channel**: configurable per-repo/cluster (`REVIEW_SLACK_CHANNEL`) — not hardcoded.
**Platform rule packs**: already exist (15 files across Web/iOS/Android/Backend) — Phase 4 deferred; Phase 3 loads them via extension detection.

Builds on existing `code-review` skill and `epost-code-reviewer` agent. No replacement — only extension via confidence metadata and trigger hooks.

## Scope Rationale (5-Why)

1. Manual review is inconsistent and misses cross-platform tech debt.
2. Need automation with confidence scoring to avoid LLM hallucination blocking PRs.
3. Team growing; `code-review` skill exists but isn't wired to PR/cron triggers.
4. MVP = Phase 1 alone (confidence metadata on existing output).
5. Phase 4 (rule packs) is lowest priority — can ship Phases 1–3 first.

## Phases

| # | Phase | File | Effort | Depends |
|---|-------|------|--------|---------|
| 1 | Confidence Engine | [phase-01-confidence-engine.md](phase-01-confidence-engine.md) | 1.5d | — |
| 2 | PR Review Hook (`schedule` polling) | [phase-02-pr-review-hook.md](phase-02-pr-review-hook.md) | 1.5d | 1 |
| 3 | Scheduled Branch Scan + Slack digest | [phase-03-scheduled-branch-scan.md](phase-03-scheduled-branch-scan.md) | 1d | 1 |

Phase 2 and 3 run in parallel after Phase 1. Platform rule packs deferred — 15 rule files already exist per-skill; Phase 3 loads them via file-extension detection.

## File Ownership (no overlap)

- **Phase 1**: `packages/core/skills/code-review/references/confidence-scoring.md`, `packages/core/skills/code-review/references/code-known-findings-schema.md` (extend schema), `packages/core/skills/code-review/SKILL.md` (add section ref)
- **Phase 2**: `packages/core/hooks/pr-review-trigger.cjs`, `packages/core/skills/code-review/references/pr-gate.md`, `packages/core/settings/hooks.json` (register)
- **Phase 3**: `packages/core/skills/code-review/references/branch-scan.md`, `packages/core/scripts/branch-scan-digest.cjs`, `packages/core/skills/code-review/references/slack-digest-template.md`
- **Phase 4 (deferred)**: Rule files already live per-skill. Integration = Phase 3 loading them by extension.

## Constraints

- All new files live under `packages/` — never `.claude/` (generated output)
- Extend `epost-code-reviewer` agent, do NOT replace
- Never auto-merge or auto-approve PRs — comments only
- Never per-commit triggers — PR events or cron only
- Confidence threshold for blocking: `confidence >= 0.8 AND severity >= 4 AND confirmed_by >= 2`
- Informational threshold: `confidence >= 0.5 AND severity >= 2`
- Slack is sole notification channel (reuse `connectors/slack` skill)
- No new external dependencies; reuse `schedule` skill for cron
- YAGNI: no dashboards, no DB, no historical trending storage beyond JSON file in `reports/`

## Success Criteria

- [ ] `code-review` output includes `severity`, `confidence`, `confirmed_by` on every finding
- [ ] PR review hook triggers on PR create/update and posts structured comment
- [ ] Blocking gate only fires on HIGH severity + HIGH confidence (no false-positive blocks in dogfood week)
- [ ] Daily cron runs branch scan and posts Slack digest with `new/resolved/total` counts
- [ ] Platform rule packs auto-selected by file extension detection
- [ ] Existing manual `/review` flow still works unchanged (backward compat)
- [ ] 2-pass LLM consensus reduces FP count by ≥20% on dogfood sample of 10 PRs

## Risks

- **R1**: 2-pass LLM doubles token cost. Mitigation: 2-pass only when confidence < 0.8 on first pass.
- **R2**: Cron spam. Mitigation: digest mode — single Slack message, not per-finding.
- **R3**: Rule pack drift from platform skills. Mitigation: rule pack files cross-link to platform skill files.

## Validation Summary

To be filled during `--validate` step before activation.

## Decisions Made

1. **PR trigger**: `schedule` skill polls GitHub API — no GHA webhook needed.
2. **Slack channel**: configurable per-repo/cluster at deploy time (not hardcoded in skill).
3. **Platform rule packs**: 15 rule files already exist per-skill — Phase 4 deferred; scanning skill loads them via file-extension detection at review time.
4. **History persistence**: `reports/branch-scan-history.json`, rolling 30-run retention.
