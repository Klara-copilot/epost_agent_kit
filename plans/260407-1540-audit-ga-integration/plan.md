---
title: "Audit ↔ Web-Analytic GA/GTM Integration"
description: "Integrate web-analytic Dev Interview Flow into audit skill as inline GA check (Option A). Wire frontmatter connections, add verify-ga project skill sync, validate end-to-end."
status: completed
created: 2026-04-07
updated: 2026-04-07
effort: 3h
phases: 4
platforms: [web]
breaking: false
blocks: []
blockedBy: []
tags: [audit, ga, gtm, web-analytic, tracking, integration]
authors: [epost-planner]
---

# Audit ↔ Web-Analytic GA/GTM Integration

## Summary

Wire `web-analytic` skill into `audit` skill so `/audit --code` (web) and `/audit --ga` produce GA/GTM tracking reports. Currently both skills exist independently — audit references web-analytic but the load path, frontmatter connections, and verify-ga project-level bridge are not wired.

## Context

- **web-analytic** (platform-web, Layer 1): org-wide GA/GTM standard — Rules 1-4, Dev Interview Flow Q1-Q10
- **audit** (core, Layer 0): unified audit command — Hybrid + Single-Agent flows
- **verify-ga** (luz_next .github/skills): project-level scan with file classification tiers
- **Decision**: Option A — load web-analytic inline in audit main context (no subagent spawn)

## Key Dependencies

- `packages/core/skills/audit/SKILL.md` — GA/GTM section already drafted (Mechanism 1 + 2)
- `packages/platform-web/skills/web-analytic/SKILL.md` — Dev Interview Flow complete
- `packages/platform-web/skills/web-analytic/references/` — 3 reference files exist
- `packages/core/skills/audit/references/output-contract.md` — report format authority

## Approach

Option A (inline load): audit detects web platform → loads web-analytic skill → runs Dev Interview Flow inline → appends `## GA/GTM Tracking` to session report. No subagent dispatch needed (lightweight, respects constraint).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Audit SKILL.md — explicit inline load instructions | 1h | completed | [phase-01-audit-load-path.md](phase-01-audit-load-path.md) |
| 2 | Frontmatter connections + package.yaml sync | 30m | completed | [phase-02-connections.md](phase-02-connections.md) |
| 3 | Output contract + report template update | 45m | completed | [phase-03-output-contract.md](phase-03-output-contract.md) |
| 4 | verify-ga bridge + validation | 45m | completed | [phase-04-verify-ga-bridge.md](phase-04-verify-ga-bridge.md) |

## Success Criteria

- [ ] `/audit --code` on web .tsx files produces `## GA/GTM Tracking` section in report
- [ ] `/audit --ga path/` runs standalone Dev Interview Flow, outputs tracking table
- [ ] Hybrid flow Step 5.5 loads web-analytic inline after code-reviewer
- [ ] Single-Agent `--ga` runs Q1→Q10 without code-reviewer dispatch
- [ ] Frontmatter: audit `connections.requires` includes `web-analytic`
- [ ] Frontmatter: web-analytic `connections.enhances` includes `audit`
- [ ] Output contract documents GA/GTM section format
- [ ] verify-ga (luz_next) references web-analytic as upstream standard
- [ ] No duplicate logic between audit + web-analytic (single source of truth)

## Risks

| Risk | Mitigation |
|------|-----------|
| Token bloat — loading web-analytic references inline | Load only SKILL.md interview flow, not full references |
| Scope creep — temptation to add klara-theme scan to audit | Keep Rule 1 scan in verify-ga only (project-level) |
| DRY violation — duplicating interview flow | audit references web-analytic, never copies |
