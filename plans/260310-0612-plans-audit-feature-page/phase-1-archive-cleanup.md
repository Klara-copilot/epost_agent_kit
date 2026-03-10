---
phase: 1
title: "Archive completed and stale draft plans"
effort: 1h
depends: []
---

# Phase 1: Archive Completed & Stale Plans

## Tasks

### 1.1 Archive 25 confirmed-completed plans

Run `node .claude/scripts/archive-plan.cjs` for each:

```
260210-1145-flatten-skill-directories
260211-1046-add-epost-branding-prefix
260228-1819-skill-discovery-token-optimization
260303-0818-get-started-skill
260303-1123-ios-a11y-cleanup-findings-workflow
260303-1144-audit-review-report-persistence
260303-1250-skill-taxonomy-cleanup
260303-1308-copilot-init-integration
260304-1237-improve-scout
260304-1527-merge-debugging-skills
260305-1253-align-agents-with-claudekit
260305-1322-agent-redesign-audit
260305-1348-muji-skill-redesign
260305-1601-team-workflows
260307-1446-audit-review-methodology-transparency
260307-1600-research-engine
260307-1651-cli-research-engine-config
260308-0837-deepen-audit-delegation
260308-1021-remove-perplexity-add-gemini
260308-1339-audit-routing-dimension-gaps
260308-1426-audit-flow-optimization
260308-1531-explicit-scope-skip-git-diff
260308-1540-rag-direct-hybrid-sequential
260309-1621-build-success-gate
260309-2043-get-started-simulator-launch
```

### 1.2 Archive 12 stale/superseded drafts

Set status to `completed` first (since archive expects completed), then archive:

```
260228-1801-broad-skill-discovery
260301-1650-smart-skill-ecosystem
260303-1000-reimpl-lost-features
260303-1500-fix-hooks-diagnostic
260303-1502-init-cli-ux-improvements
260304-0408-get-started-auto-orchestration
260304-0659-generalize-get-started
260304-1350-rag-expansion-api
260304-1433-rethink-rag-skills
260304-1509-merge-planning-skills
260304-1634-verify-cli-command
260305-1153-docs-init-fixes
```

### 1.3 Mark done plans with non-standard status

Plans using `done` or `complete` instead of `completed` — normalize before archiving:
- 260307-1651, 260308-1021, 260308-1339, 260308-1426, 260308-1531, 260308-1540, 260309-1621, 260309-2043

## Validation

- `ls plans/archive/ | wc -l` should show 37 archived plan directories
- `ls plans/26* | wc -l` should show ~23 remaining active plans
- No completed/done plans remain in main `plans/` directory
