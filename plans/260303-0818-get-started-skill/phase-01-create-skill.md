# Phase 01: Create get-started Skill

## Context Links
- Parent plan: [plan.md](./plan.md)
- Reference: `packages/core/skills/docs-init/SKILL.md`
- Reference: `packages/core/skills/docs-update/SKILL.md`
- Reference: `packages/core/skills/scout/SKILL.md` (fork+agent pattern)

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Create the `/get-started` skill SKILL.md with onboarding logic
**Implementation Status**: Pending

## Key Insights
- Must be `user-invocable: true`, `context: fork`, `agent: epost-researcher` (read-heavy, exploratory)
- Two modes: **new project** (no `docs/`) vs **existing project** (has `docs/`)
- Lightweight — not a full docs-init. Summarize, don't exhaustively generate
- Should delegate to `docs-init` or `docs-update` when user wants full generation/update

## Requirements
### Functional
- Trigger on: "get started", "how to begin", "new to this project", "what is this project"
- Detect `docs/` existence via Glob
- **New project path**: scan key files (README, package.json, configs), create minimal `docs/codebase-summary.md`
- **Existing project path**: read `docs/index.json` or `docs/*.md`, summarize findings
- Report doc staleness (file age > 30 days = stale)
- Ask user: "Want to regenerate docs?" → delegate to `/docs-init`
- Ask user: "Want to update specific sections?" → delegate to `/docs-update`
- Show project status: tech stack, key entry points, getting-started commands

### Non-Functional
- Fast execution (< 30s for scan)
- No destructive operations (read-first)

## Architecture

```
[USER] ──"how to start"──▸ [get-started]
                               │
                    ┌──────────┴──────────┐
                    ▼                      ▼
            [docs/ exists?]         [docs/ missing?]
                    │                      │
              Read docs/*.md         Scan codebase
              Check staleness        Create minimal docs/
              Summarize              codebase-summary.md
                    │                      │
                    └──────────┬───────────┘
                               ▼
                    [Present insights to user]
                               │
                    ┌──────────┴──────────┐
                    ▼                      ▼
           "Regenerate docs?"     "Update specific parts?"
           → delegate docs-init   → delegate docs-update
```

## Related Code Files
### Create (EXCLUSIVE)
- `packages/core/skills/get-started/SKILL.md` - Main skill definition [OWNED]
### Read-Only
- `packages/core/skills/docs-init/SKILL.md` - Reuse scan patterns
- `packages/core/skills/docs-update/SKILL.md` - Delegation target
- `packages/core/skills/repomix/SKILL.md` - Summary patterns
- `packages/core/skills/scout/SKILL.md` - Frontmatter pattern

## Implementation Steps

1. Create `packages/core/skills/get-started/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: get-started
   description: "(ePost) Onboard to a project — scan codebase, read/create docs, suggest updates"
   user-invocable: true
   context: fork
   agent: epost-researcher
   metadata:
     argument-hint: "[project path or question]"
   ---
   ```

2. Skill body sections:
   - **Trigger patterns**: "get started", "how to begin", "new to project", "what is this", "onboard"
   - **Step 1 — Detect context**: Check for `docs/` dir, README, package.json, build files
   - **Step 2a — Existing docs path**: Read `docs/index.json` if exists, else glob `docs/*.md`. Summarize each file in 1-2 lines. Check `git log` dates for staleness.
   - **Step 2b — No docs path**: Scan key files (README, package.json/pom.xml/Package.swift/build.gradle.kts, tsconfig, Dockerfile). Extract: project name, tech stack, scripts/commands, entry points. Create `docs/codebase-summary.md` (lightweight).
   - **Step 3 — Present insights**: Tech stack, directory structure (top 2 levels), key commands (dev/build/test), entry points
   - **Step 4 — Offer next actions**:
     - "Run `/docs-init` for comprehensive documentation"
     - "Run `/docs-update <section>` to update stale sections"
     - List stale docs with dates

3. Add staleness detection logic:
   ```
   For each file in docs/:
     last_modified = git log -1 --format="%ci" -- {file}
     if > 30 days: mark STALE
     if > 90 days: mark OUTDATED
   ```

## Todo List
- [ ] Create `packages/core/skills/get-started/SKILL.md`
- [ ] Verify frontmatter follows kit conventions
- [ ] Test trigger words don't conflict with existing skills

## Success Criteria
- Skill file exists at correct path with valid frontmatter
- Covers both new-project and existing-project flows
- Delegates to docs-init/docs-update instead of reimplementing

## Risk Assessment
**Risks**: Trigger word overlap with `bootstrap` ("new project") or `docs-init`
**Mitigation**: Differentiate — bootstrap = scaffold code, docs-init = generate docs, get-started = onboard + suggest. Use distinct trigger words.

## Security Considerations
- Read-only scan, no secrets exposure
- `docs/` creation is non-destructive (check existence first)

## Next Steps
After completion:
1. Proceed to Phase 02 (wire into routing/index)
2. Run `epost-kit init` to regenerate `.claude/`
