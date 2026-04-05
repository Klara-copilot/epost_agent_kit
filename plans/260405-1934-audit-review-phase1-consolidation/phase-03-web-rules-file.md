---
phase: 3
title: "Web rules file"
effort: 1.5h
depends: [1]
---

# Phase 3: Web Rules File

## Context

- Plan: [plan.md](./plan.md)
- Depends on: Phase 1 (PERF/TS/STATE rules extracted from code-review-standards.md)
- Blocks: none (parallel with P4, P5)

## Overview

Create `web-frontend/references/code-review-rules.md` containing all web-specific code review rules: PERF (performance), TS (type safety), STATE (state management). Also include klara-theme rules if they were previously in code-review-standards.md or audit-standards.md.

## Requirements

- Contains the 16 rules extracted from code-review-standards.md: PERF-001..006, TS-001..006, STATE-001..004
- Same format: Rule ID, Rule, Severity, Pass, Fail columns
- Add lightweight vs escalated split per existing pattern
- Include klara-theme section pointer (rules stay in ui-lib-dev/audit-standards.md for now — muji owns those)
- Keep under 150 lines

## Files Owned (Phase 3 ONLY)

- `packages/platform-web/skills/web-frontend/references/code-review-rules.md` — NEW file

## Tasks

- [x] Create `packages/platform-web/skills/web-frontend/references/code-review-rules.md`
- [x] Add frontmatter:
  ```yaml
  name: web-code-review-rules
  description: "Web-specific code review rules — PERF, TS, STATE categories"
  user-invocable: false
  disable-model-invocation: true
  ```
- [x] Add scope paragraph: "Web platform code review rules. Loaded by code-review skill when reviewing .tsx/.ts/.scss/.css files."
- [x] Copy PERF section (6 rules) from old code-review-standards.md — update scope note to "Web rendering, bundle, React performance"
- [x] Copy TS section (6 rules) — scope: "TypeScript files in web platform"
- [x] Copy STATE section (4 rules) — scope: "Redux, Zustand, React context, XState in web apps"
- [x] Add Lightweight vs Escalated table for these 16 rules:
  - Lightweight: PERF-001..002, TS-001..003, STATE-001..002
  - Escalated: PERF-003..006, TS-004..006, STATE-003..004
- [x] Add pointer: "For klara-theme UI component rules (STRUCT/PROPS/TOKEN/BIZ), see `ui-lib-dev/references/audit-standards.md` — owned by epost-muji."
- [x] Verify <= 150 lines

## Validation

```bash
# File exists
test -f packages/platform-web/skills/web-frontend/references/code-review-rules.md && echo "exists"

# Rule count
grep -c "^| " packages/platform-web/skills/web-frontend/references/code-review-rules.md
# Expected: 16 rule rows (PERF 6 + TS 6 + STATE 4)

# Line count
wc -l packages/platform-web/skills/web-frontend/references/code-review-rules.md
# Expected: <= 150
```

## Success Criteria

- [x] File exists at correct path
- [x] Contains PERF (6), TS (6), STATE (4) = 16 rules
- [x] Lightweight/escalated split documented
- [x] Klara-theme pointer present
- [x] Under 150 lines
