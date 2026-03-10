---
title: "Plans audit, archive cleanup, and product feature page"
status: active
created: 2026-03-10
updated: 2026-03-09
effort: 3h
phases: 3
platforms: [all]
breaking: false
---

# Plans Audit, Archive Cleanup, and Product Feature Page

## Context

60 plan directories exist in `plans/`. Many are completed/done but never archived. The `index.json` shows 39 active + 25 completed, 0 archived — but actual frontmatter reveals most "active" plans are actually done. The plans list is cluttered, making it hard to see what is truly in-progress vs historical record. Additionally, the product has no feature page that communicates what epost_agent_kit offers.

## Plan Status Audit Results

### Truly Completed / Done (archive these — 42 plans)

Plans whose frontmatter says `completed`, `done`, or `complete`:

| # | Plan Slug | Title | Status in FM |
|---|-----------|-------|-------------|
| 1 | 260210-1145-flatten-skill-directories | Flatten skill directories | completed |
| 2 | 260211-1046-add-epost-branding-prefix | Add ePost branding prefix | completed |
| 3 | 260228-1819-skill-discovery-token-optimization | Skill discovery token optimization | completed |
| 4 | 260303-0818-get-started-skill | Add /get-started skill | completed |
| 5 | 260303-1123-ios-a11y-cleanup-findings-workflow | iOS a11y cleanup + findings | completed |
| 6 | 260303-1144-audit-review-report-persistence | Audit & review report persistence | completed |
| 7 | 260303-1250-skill-taxonomy-cleanup | Skill taxonomy cleanup | completed |
| 8 | 260303-1308-copilot-init-integration | Copilot adapter integration | completed |
| 9 | 260304-1237-improve-scout | Improve /scout with RAG | completed |
| 10 | 260304-1527-merge-debugging-skills | Merge debugging skills | completed |
| 11 | 260305-1253-align-agents-with-claudekit | Align agent roles with ClaudeKit | completed |
| 12 | 260305-1322-agent-redesign-audit | Agent ecosystem redesign | completed |
| 13 | 260305-1348-muji-skill-redesign | Muji skill redesign | completed |
| 14 | 260305-1601-team-workflows | Team workflows | completed |
| 15 | 260307-1446-audit-review-methodology-transparency | Audit methodology transparency | completed |
| 16 | 260307-1600-research-engine | Research engine | completed |
| 17 | 260307-1651-cli-research-engine-config | CLI research engine config | done |
| 18 | 260308-0837-deepen-audit-delegation | Deepen audit delegation | completed |
| 19 | 260308-1021-remove-perplexity-add-gemini | Remove Perplexity, add Gemini | done |
| 20 | 260308-1339-audit-routing-dimension-gaps | Audit routing dimension gaps | done |
| 21 | 260308-1426-audit-flow-optimization | Audit flow optimization | complete |
| 22 | 260308-1531-explicit-scope-skip-git-diff | Skip git diff for explicit scope | done |
| 23 | 260308-1540-rag-direct-hybrid-sequential | Fix RAG + reorder hybrid audit | done |
| 24 | 260309-1621-build-success-gate | Build-success gate | done |
| 25 | 260309-2043-get-started-simulator-launch | Get-started simulator launch | done |

### Draft — Never Started (archive these — 12 plans)

Plans that were drafted but never implemented, now superseded or stale:

| # | Plan Slug | Title | Reason to Archive |
|---|-----------|-------|-------------------|
| 1 | 260228-1801-broad-skill-discovery | Broad skill discovery | Superseded by skill-discovery-token-optimization |
| 2 | 260301-1650-smart-skill-ecosystem | Smart skill ecosystem | Superseded by skill-consolidation (PLAN-0041) |
| 3 | 260303-1000-reimpl-lost-features | Re-implement lost features | Stale — re-init solved |
| 4 | 260303-1500-fix-hooks-diagnostic | Fix hooks diagnostic | Superseded by hook-improvements (PLAN-0053) |
| 5 | 260303-1502-init-cli-ux-improvements | Init CLI UX improvements | No frontmatter, stale |
| 6 | 260304-0408-get-started-auto-orchestration | Auto-orchestrate /get-started | Superseded by subagent constraint |
| 7 | 260304-0659-generalize-get-started | Generalize /get-started | Partially done, stale |
| 8 | 260304-1350-rag-expansion-api | RAG expansion API | Superseded by rethink-rag-skills |
| 9 | 260304-1433-rethink-rag-skills | Rethink RAG skills | Draft, no implementation |
| 10 | 260304-1509-merge-planning-skills | Merge planning skills | Has implementation reports but plan still "draft" — work done |
| 11 | 260304-1634-verify-cli-command | Verify CLI command | Draft, CLI repo moved |
| 12 | 260305-1153-docs-init-fixes | Fix /docs --init | Draft, 30min effort, stale |

### Keep as Active/Milestone (8 plans)

Plans that are genuinely in-progress or represent significant milestones:

| # | Plan Slug | Title | Why Keep |
|---|-----------|-------|----------|
| 1 | 260305-0204-skill-consolidation | Skill consolidation 99→45 | Major architecture — in progress |
| 2 | 260305-0911-plan-skill-process-overhaul | Plan skill process overhaul | Active, ongoing |
| 3 | 260306-0631-muji-audit-standards | Muji audit standards | Active development |
| 4 | 260306-1117-agent-teams-port | Agent teams port | Active development |
| 5 | 260307-0116-klara-consumer-audit | Klara consumer audit | Active development |
| 6 | 260308-1700-new-team-onboarding-demo | Team onboarding demo | Active — demo prep |
| 7 | 260308-2150-hybrid-audit-reliability-standards | Hybrid audit reliability | Active development |
| 8 | 260309-1306-claude-md-natural-routing | CLAUDE.md natural routing | Active, recent |

### Keep as Active but Stale-ish (need decision — 8 plans)

| # | Plan Slug | Title | Notes |
|---|-----------|-------|-------|
| 1 | 260301-1017-copilot-target-support | Copilot target support | No frontmatter, large plan |
| 2 | 260304-1718-audit-ui-lib-component | Audit UI-lib component | Draft, superseded by muji-audit-standards? |
| 3 | 260305-0856-update-skill-creator | Update skill creator | Draft, still relevant |
| 4 | 260305-1024-remove-embedded-cli | Remove embedded CLI | Active — CLI removed, plan may be done |
| 5 | 260305-1119-github-release-process | GitHub release process | Active, no frontmatter |
| 6 | 260305-1224-unified-package-versioning | Unified package versioning | Active, design |
| 7 | 260305-1702-cleanup-scripts | Cleanup scripts | Active |
| 8 | 260305-1934-hook-improvements | Hook improvements | In-progress |
| 9 | 260305-2045-kit-dev-hooks | Kit dev hooks | In-progress |
| 10 | 260305-2359-agent-report-templates | Agent report templates | In-progress |
| 11 | 260307-1159-update-code-reviewer | Update code-reviewer | Active |
| 12 | 260307-1230-update-muji-a11y-agents | Update muji/a11y agents | Active |
| 13 | 260309-0521-audit-session-folder-pattern | Audit session folder pattern | Active |
| 14 | 260309-0935-audit-rules-standardization | Audit rules standardization | Active, no frontmatter |
| 15 | 260309-1030-hybrid-audit-orchestration | Hybrid audit orchestration | Active, no frontmatter |

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Archive completed & stale plans | 1h | pending | [phase-1](./phase-1-archive-cleanup.md) |
| 2 | Create product feature page | 1.5h | pending | [phase-2](./phase-2-feature-page.md) |
| 3 | Update README.md and index.json | 30m | pending | [phase-3](./phase-3-update-indexes.md) |

## Success Criteria

- All 25 completed plans archived to `plans/archive/`
- All 12 stale drafts archived to `plans/archive/`
- `plans/README.md` shows only active/in-progress plans
- `index.json` counts match reality
- Product feature page exists at `plans/README.md` or project root
- Feature page is friendly, engaging, communicates product value
