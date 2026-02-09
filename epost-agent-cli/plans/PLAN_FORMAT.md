# Implementation Plan Format

Use this template when creating new implementation plans, investigation reports, or design documents.

## Frontmatter Schema

```yaml
---
id: PLAN-NNNN
title: Short descriptive title
type: implementation | investigation | report | design
status: draft | active | completed | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
authors: [agent-name or human-name]
related-plans: [PLAN-NNNN]
related-commits: [sha1, sha2]
tags: [tag1, tag2]
supersedes: PLAN-NNNN      # optional
superseded-by: PLAN-NNNN   # optional
---
```

## Document Sections

```markdown
# [Title]

## Context
Why this plan exists, what problem it solves, what prompted it.

## Scope
What's included and excluded.

## Approach
High-level strategy and key decisions.

## Changes
Specific files and components affected. Use tables for clarity.

## Verification
How to verify successful implementation (commands, checks, expected results).

## Status
Current state, blockers, next steps. Update as work progresses.
```

## Lifecycle

```
draft → active → completed → archived
                ↘ superseded (by a newer plan)
```

## File Naming Convention

```
{agent}-{YYMMDD}-{HHMM}-{short-description}.md
```

Examples:
- `fullstack-developer-260206-1202-phase-05-complex-commands.md`
- `ecosystem-260207-2130-package-restructuring.md`

## Directory Placement

| Status | Directory |
|--------|-----------|
| Draft/Active | `plans/active/` |
| Completed | `plans/completed/` |
| Archived | `plans/archived/` |

> `plans/reports/` is legacy only (PLAN-0001 through PLAN-0015). Do not add new files there.

## After Creating or Completing a Plan

1. Update `INDEX.md` with the plan entry
2. Update `index.json` with the same data
3. Move the file to the appropriate directory if status changed
