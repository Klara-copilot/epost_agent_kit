---
phase: 2
title: "Reorder hybrid audit: muji first, code-reviewer reads output"
effort: 45m
depends: [1]
---

# Phase 2: Sequential Hybrid Audit

## Current Flow (broken)

```
code-reviewer gets feature module audit request
  ├── (parallel) code-reviewer: SEC, PERF, TS, architecture
  └── (parallel) muji via Template A+: STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST
  merge reports
```

Problems: code-reviewer can't see muji's findings → duplicates. No verdict hierarchy.

## Target Flow

```
code-reviewer gets feature module audit request
  1. Dispatch muji via Template A+ → WAIT for completion
  2. Read muji's report file
  3. Extract: findings (file:line set), verdict, component catalog, docs gaps
  4. Code-reviewer runs SEC/PERF/TS/architecture
     - Skip any issue already flagged by muji at same file:line
     - Use muji's component catalog for architecture context
  5. Merge into one report (muji findings referenced, not re-listed)
  6. Set verdict: max(muji_verdict, own_verdict)
```

## Files to Modify

### 1. `packages/core/agents/epost-code-reviewer.md`

**Delegation Rules table** — change hybrid row:

Current:
```
| Feature module UI review (multi-subdir OR 20+ files in klara-theme) | klara-theme path, large scope | **Hybrid**: code-reviewer handles SEC/PERF/TS/architecture; delegate UI standards (STRUCT/PROPS/TOKEN/BIZ/A11Y/TEST) to muji via Template A+ in parallel; merge reports |
```

New:
```
| Feature module UI review (multi-subdir OR 20+ files in klara-theme) | klara-theme path, large scope | **Hybrid sequential**: (1) dispatch muji via Template A+ and WAIT; (2) read muji report; (3) run SEC/PERF/TS/architecture, dedup against muji findings (file:line); (4) merge into one report |
```

---

### 2. `packages/core/skills/code-review/SKILL.md`

**Dispatch Protocol section** — add sequential hybrid subsection:

After "A11y escalation" block, add:

```markdown
**Hybrid audit — sequential (feature module, klara-theme 20+ files):**
1. Dispatch muji via Template A+ (Task tool) — specify `output_path: {reports_path}/{date}-{slug}-muji-ui-audit.md`
2. WAIT for muji to complete (do not proceed until Task returns)
3. Read muji's Markdown report
4. Extract from muji report:
   - `finding_locations`: Set<"file:line"> of all flagged locations
   - `verdict`: muji's overall verdict
   - `component_catalog`: discovered klara components list
   - `docs_gaps`: any missing/stale docs noted
5. Run SEC/PERF/TS/architecture on same files
   - For each finding: skip if `finding_location` already in muji's set
6. Merge into one report:
   - Add `## UI Audit (delegated to epost-muji)` section: verdict, finding count, report path
   - Do NOT re-list muji's individual findings — reference the report
7. Set final verdict: `max(muji_verdict, own_verdict)` where REDESIGN > FIX-AND-RESUBMIT > APPROVE
   - If muji verdict is REDESIGN → final verdict cannot be APPROVE regardless of own findings
```

---

### 3. `packages/core/skills/audit/references/delegation-templates.md`

**Template A+** — add output path + catalog requirement:

In `Expectations:` block, add:
```
- Save report to: `{reports_path}/{date}-{slug}-muji-ui-audit.md` (so code-reviewer can read it)
- Include `## Component Catalog` section in report: list of all discovered klara components
- Include `## Docs Gaps` section: any missing/stale docs/index.json entries found
```

---

### 4. `packages/core/skills/core/references/workflow-code-review.md`

**Scout Phase or Quality Audit step** — add hybrid mode note:

```markdown
**Klara-theme feature module (20+ files or multi-subdir)**:
- Use hybrid sequential audit (not parallel)
- Dispatch muji FIRST via Template A+, wait for completion
- Read muji report, then run SEC/PERF/TS with dedup
- See `code-review/SKILL.md` Dispatch Protocol for full 7-step sequence
```

## Todo

- [ ] Edit `epost-code-reviewer.md` delegation table row
- [ ] Edit `code-review/SKILL.md` Dispatch Protocol — add sequential hybrid subsection
- [ ] Edit `delegation-templates.md` Template A+ — add output path + catalog/docs-gap requirements
- [ ] Edit `workflow-code-review.md` — add hybrid sequential note

## Success Criteria

- Code-reviewer waits for muji before starting own pass
- No duplicate findings at same file:line
- Final report has one `## UI Audit (delegated...)` section with reference to muji report
- Verdict hierarchy: REDESIGN > FIX-AND-RESUBMIT > APPROVE
