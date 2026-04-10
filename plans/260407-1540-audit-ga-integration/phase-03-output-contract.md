---
phase: 3
title: "Output contract + report template update"
effort: 45m
depends: [1]
---

# Phase 3 — Output Contract + Report Template Update

## Context

The output contract (`references/output-contract.md`) is the single source of truth for audit report structure. It needs to document the GA/GTM tracking section format and file responsibilities.

## Overview

Add GA/GTM tracking report artifacts to the output contract so all agents know the expected format, and update the report template.

## Requirements

### 3.1 — Output contract: new session folder type

Add to Session Folder table:

```markdown
| GA/GTM standalone audit | `reports/{YYMMDD-HHMM}-{slug}-ga-audit/` | main context (inline) |
```

### 3.2 — Output contract: new file in session folder

Add to Files in Session Folder table:

```markdown
| `ga-tracking.md` | Main context (inline) | Hybrid + --code web | GA/GTM tracking table + findings from Dev Interview Flow |
```

### 3.3 — Output contract: responsibility matrix update

Add GA tracking row to Hybrid Audit responsibility matrix:

```markdown
| Write `ga-tracking.md` | **YES** (inline) | no | no | no |
```

### 3.4 — Report template: GA/GTM section

Add to `references/report-template.md` (if exists) or document in output contract:

```markdown
## GA/GTM Tracking

| File | Boundary | ga-data-group | Result |
|------|----------|---------------|--------|
| path/to/file.tsx | Dialog | ✅ present | PASS |
| path/to/other.tsx | RightSidebar | ❌ missing | FAIL |

### Findings
❌ [file.tsx:L42] Missing ga-data-group on content wrapper inside <Dialog>
   → Suggested value: `feature-name-dialog`

### Required Actions
- [ ] Add ga-data-group to file.tsx line 42
- [ ] Confirm value with Data/Marketing before merging

### Skip Log
- libs/klara-theme/button.tsx — klara-theme (Rule 1 scope, not Rule 2)
- apps/luz-epost/utils.tsx — no boundary component
```

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/audit/references/output-contract.md` | Add ga-audit folder type, ga-tracking.md file, responsibility row |
| `packages/core/skills/audit/references/report-template.md` | Add GA/GTM Tracking section template (if file exists) |

## Validation

- [ ] Output contract has `ga-audit` session folder pattern
- [ ] Output contract has `ga-tracking.md` in files table
- [ ] Responsibility matrix shows main context writes GA tracking (not subagent)
- [ ] Report template includes GA/GTM section with table + findings + skip log
- [ ] Skip log format documented (explains why files were excluded)
