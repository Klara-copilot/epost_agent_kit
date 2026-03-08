---
phase: 4
title: "Single consolidated report output — no separate JSON files"
effort: 0.5h
depends: []
---

# Phase 4: Single Consolidated Report Output

## Problem

Agents write separate `.json` + `.md` files for the same review, creating report clutter. The user receives 2+ files per agent invocation and more when orchestrators spawn sub-agents.

Two distinct issues:

1. **Per-review dual output**: `epost-code-reviewer` wrote both `*-docs-plans-session-reports.json` AND `*-docs-plans-session-reports.md`. The code-review SKILL.md says "use report-template.md" (Markdown only) but the agent still wrote a JSON schema file unprompted.

2. **Per-session sub-reports**: When an orchestrator spawns sub-agents (code-reviewer, muji, a11y-specialist), each writes its own report file. The orchestrator's "Post-Delegation Report Merging" (Phase 2 addition) lists sub-report paths but doesn't consolidate content — leaving multiple loose files.

## Solution

### Change 1 — Explicit single-file prohibition in code-review SKILL.md

Add to the Output Format section:

```
**Single file only** — write ONE `.md` report per review. Do NOT write a separate `.json` file.
If structured data is needed by a downstream consumer, embed it as a fenced JSON code block
within the Markdown report. Never create parallel `.json` + `.md` files for the same review.
```

### Change 2 — Same prohibition in audit/references/ui.md

The audit UI skill says "dual-output (JSON + Markdown)". Change to:

```
Output: ONE `.md` report per audit. Embed the JSON envelope as a fenced code block
at the end of the Markdown report under `## Machine-Readable Data` — do NOT write a
separate `.json` file.
```

This keeps structured data accessible while eliminating the separate file.

### Change 3 — Orchestrator consolidation rule

In `audit/SKILL.md` and `code-review/SKILL.md` Post-Delegation Merging section, add:

```
**Report consolidation**: After all specialist reports are merged into your report,
the final deliverable is YOUR single report file. Sub-agent reports are source material —
do not surface them as separate deliverables to the user unless explicitly requested.
```

## Files to Modify

- `packages/core/skills/code-review/SKILL.md` — add single-file rule to Output Format
- `packages/core/skills/audit/references/ui.md` — change "dual-output" to embedded JSON block
- `packages/core/skills/audit/SKILL.md` — add consolidation rule to Delegation Protocol

## Todo List

- [ ] Add "Single file only" rule to `packages/core/skills/code-review/SKILL.md` Output Format
- [ ] Change dual-output instruction in `packages/core/skills/audit/references/ui.md` to embedded JSON block
- [ ] Add report consolidation rule to `packages/core/skills/audit/SKILL.md` Delegation Protocol
- [ ] Verify all edits in `packages/` not `.claude/`

## Success Criteria

- Code-review SKILL.md explicitly prohibits separate `.json` files
- Audit ui.md instructs embedding JSON in Markdown, not separate file
- Post-delegation merging instruction clarifies sub-reports are source material, not deliverables
- One review session → one report file

## Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Downstream tooling parsing `.json` files breaks | Low | No known tooling depends on separate JSON; `reports/index.json` is different (manifest, not review) |
| Embedded JSON block too large → bloated report | Low | Findings are already in Markdown table; JSON block is optional/appendix |
