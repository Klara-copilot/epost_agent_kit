---
phase: 2
title: "Code-reviewer hybrid pre-flight checklist"
effort: 45m
depends: []
---

# Phase 2: Code-Reviewer Hybrid Pre-Flight Checklist

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/code-review/SKILL.md` — hybrid audit sequential protocol (Hybrid audit steps)
- `packages/core/agents/epost-code-reviewer.md` — Delegation Rules table
- `packages/core/CLAUDE.snippet.md` — kit routing rules

## Overview

Add explicit pre-flight verification before muji dispatch in hybrid audit flow. Prevents:
- RC-2: No session folder created before dispatch → sub-agent can't write output
- RC-3: Wrong execution order (parallel instead of sequential WAIT)

## Files to Modify

- `packages/core/skills/code-review/SKILL.md` — insert pre-flight block in "Hybrid audit — sequential" steps
- `packages/core/agents/epost-code-reviewer.md` — add pre-flight reminder to Delegation Rules
- `packages/core/CLAUDE.snippet.md` — add Hybrid Audit Protocol routing rules

## Implementation Steps

### 1. Add pre-flight block to `packages/core/skills/code-review/SKILL.md`

In the **Hybrid audit — sequential** section, between step 1 (mkdir) and step 2 (dispatch muji), insert:

```markdown
**Pre-flight checklist (verify ALL before dispatch):**
- [ ] Session folder created: `mkdir -p {session_folder}` executed, path confirmed
- [ ] `output_path` set: `{session_folder}/muji-ui-audit.md`
- [ ] Delegation format: Template A+ from `audit/references/delegation-templates.md` (NOT free-form)
- [ ] Template fields filled: `Scope:`, `Component(s):`, `Mode: library`, `Platform:`, `Output path:`

If any item missing: STOP, fix it, then proceed. Do not dispatch with incomplete setup.
Log: "Pre-flight: {pass | fixed: {items}}" in report Methodology section.
```

### 2. Add pre-flight reminder to `packages/core/agents/epost-code-reviewer.md`

After the Feature module UI review row in Delegation Rules table, add:

```markdown
> **Pre-flight rule**: Before ANY hybrid dispatch, verify: (1) session folder created, (2) output_path set, (3) Template A+ format used. See `code-review/SKILL.md` pre-flight checklist. Never send free-form prompts to muji for library audits.
```

### 3. Add Hybrid Audit Protocol to `packages/core/CLAUDE.snippet.md`

After the Context Boost Rules section, before Multi-Step Workflow Detection, insert:

```markdown
### Hybrid Audit Protocol

When routing audit/review tasks involving UI library code:

| Condition | Action |
|-----------|--------|
| klara-theme target, 20+ files | Route to `epost-code-reviewer` for hybrid sequential audit |
| klara-theme target, ≤10 files | Route to `epost-code-reviewer`, it delegates to muji via Template A |
| Any muji delegation for library audit | MUST use Template A+ from `audit/references/delegation-templates.md` |
| Free-form audit prompt to muji | NEVER — always use structured delegation templates |
| Entry point for hybrid audit | Always `epost-code-reviewer` (creates session folder, dispatches, merges) |

**Why**: Free-form prompts bypass muji's full rule checklist. Template A+ triggers Library Mode with all STRUCT/PROPS/TOKEN/BIZ/A11Y/TEST rules.
```

## Todo List

- [ ] Insert pre-flight block in `packages/core/skills/code-review/SKILL.md` hybrid section
- [ ] Add pre-flight reminder to `packages/core/agents/epost-code-reviewer.md`
- [ ] Add Hybrid Audit Protocol section to `packages/core/CLAUDE.snippet.md`
- [ ] Run `epost-kit init` to sync `.claude/`

## Success Criteria

- Code-reviewer always creates session folder before muji dispatch
- Code-reviewer always uses Template A+ (never free-form) for hybrid audits
- Pre-flight status appears in report Methodology
- CLAUDE.md contains explicit hybrid audit routing rules
