---
phase: 1
title: "Complexity-gated routing + Template A+"
effort: 1h
depends: []
---

# Phase 1: Complexity-Gated Routing + Template A+

## Tasks

### 1.1 Update code-reviewer delegation rules

**File**: `packages/core/agents/epost-code-reviewer.md`

Replace the single delegation row for UI/component review (line 22) with a complexity-gated table:

```markdown
## Delegation Rules

| Task | Signal | Routing |
|------|--------|---------|
| Simple UI review (single dir, <=10 files in klara-theme) | klara-theme path, few files | Delegate to **epost-muji** (Template A) |
| Feature module UI review (multi-subdir OR 20+ files in klara-theme) | klara-theme path, large scope | **Hybrid**: code-reviewer handles SEC/PERF/TS/architecture; delegate UI standards (STRUCT/PROPS/TOKEN/BIZ/A11Y/TEST) to muji via Template A+ in parallel; merge reports |
| A11y issue found | a11y finding | Escalate to **epost-a11y-specialist** via `/audit --a11y` |
| Standard code review | non-UI code | Execute inline using `code-review` skill |
| Critical severity found | critical finding | Activate `knowledge-retrieval` for deeper context before reporting |
```

Keep existing Skill References and Key Constraints sections unchanged.

### 1.2 Add Template A+ to delegation-templates.md

**File**: `packages/core/skills/audit/references/delegation-templates.md`

Insert after Template A (line 30), before Template B:

```markdown
## Template A+: Feature Module UI Standards Delegation (-> epost-muji)

\```
## Delegated UI Standards Audit
Scope: {file_list}
Component(s): {component_names}
Mode: library
Platform: web
Audit focus: STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST only
Out of scope: Security (SEC), Performance (PERF), TypeScript depth -- handled by caller

Expectations:
- Run Library mode steps per audit/references/ui.md
- Apply audit-standards.md rules for Library mode only
- Produce Markdown + JSON dual-output report

Boundaries:
- Analyze and report only -- do not modify source files
- Do not run SEC, PERF, or architecture checks -- caller handles those
- If A11Y findings emerge, collect and note for a11y-specialist delegation

Report back to: {calling_agent}
Output path: {reports_path}
\```
```

### 1.3 Add feature module row to muji Task-Type Routing

**File**: `packages/design-system/agents/epost-muji.md`

Add row to Task-Type Routing table (line 14-22) between "Code Review (UI)" and "Consumer Guidance":

```markdown
| Feature module audit | escalated from code-reviewer via Template A+, large scope klara-theme | Load `audit/references/ui.md` in library mode; scope to delegated files only; skip SEC/PERF |
```

## Validation

- [ ] Code-reviewer agent has 5-row delegation table with complexity signals
- [ ] delegation-templates.md has Template A+ between A and B
- [ ] Muji routing table includes feature module audit row
- [ ] No edits to `.claude/` directory
