---
phase: 3
title: "Update README.md board and index.json"
effort: 30m
depends: [1, 2]
---

# Phase 3: Update README.md Board and index.json

## Tasks

### 3.1 Rebuild `plans/README.md` Active Board

After archiving, the Active section should list only remaining plans (~23).
Group into categories:

**Active Development**:
- 260305-0204-skill-consolidation
- 260305-0911-plan-skill-process-overhaul
- 260306-0631-muji-audit-standards
- 260306-1117-agent-teams-port
- 260307-0116-klara-consumer-audit
- 260307-1159-update-code-reviewer
- 260307-1230-update-muji-a11y-agents
- 260308-1700-new-team-onboarding-demo
- 260308-2150-hybrid-audit-reliability-standards
- 260309-0521-audit-session-folder-pattern
- 260309-0935-audit-rules-standardization
- 260309-1030-hybrid-audit-orchestration
- 260309-1306-claude-md-natural-routing

**In Progress**:
- 260305-1934-hook-improvements
- 260305-2045-kit-dev-hooks
- 260305-2359-agent-report-templates
- 260305-1702-cleanup-scripts

**Backlog** (draft but still relevant):
- 260301-1017-copilot-target-support
- 260304-1718-audit-ui-lib-component
- 260305-0856-update-skill-creator
- 260305-1024-remove-embedded-cli
- 260305-1119-github-release-process
- 260305-1224-unified-package-versioning

### 3.2 Rebuild `plans/index.json`

Update counts to match reality:
- Remove all archived plan entries (or mark as archived)
- Update counts: `active`, `completed`, `archived`, `total`

### 3.3 Clean up index.json plan entries

Remove entries for plans that reference files in `../../plans/` or `../../tools/` paths (stale cross-references from old structure). Keep entries for plans that still exist in `plans/` directory.

## Validation

- `plans/README.md` has feature page + clean board
- `index.json` counts match `ls plans/26* | wc -l` + `ls plans/archive/ | wc -l`
- No broken file references in index.json
