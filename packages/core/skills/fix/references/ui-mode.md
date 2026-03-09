---
name: fix-ui-mode
description: "(ePost) Fix UI component findings from known-findings DB"
user-invocable: false
context: fork
agent: epost-muji
metadata:
  argument-hint: "<ComponentName> [--finding-id <id>] [--top <n>]"
---

# Fix UI Mode

Invoked when: `fix --ui <ComponentName> [--finding-id <id>] [--top <n>]`

## Steps

1. Load `.epost-data/ui/known-findings.json`
   - If file not found: report "no UI findings DB — run `/audit --ui` first" and stop
2. Select finding(s):
   - `--finding-id <id>`: load that specific finding
   - `--top <n>`: load top N unresolved by severity + priority
   - No flag: load all unresolved findings for named component
3. Delegate to epost-muji via Agent tool with:
   - Finding objects from DB
   - Component name + `file_pattern`
   - Mode: fix (apply surgical changes)
   - Boundaries: fix ONLY the flagged rule violation — no refactoring
4. Receive fix result from epost-muji:
   - Unified diff
   - Lines changed
   - Confidence (high|medium|low)
5. Save diff to `.epost-data/ui/fixes/patches/finding-{id}-{date}.diff`
6. Update `known-findings.json`: set `fix_applied: true`, `fix_applied_date: today`
7. Output confirmation (JSON + prose summary)
8. Suggest: "Run `/audit --close --ui <id>` to mark as fully resolved after verification"

## Boundaries

- Fix ONE rule violation per finding — no opportunistic improvements
- Do not run a full re-audit after fixing
- If fix requires structural change (STRUCT category) — report instead of fixing, suggest redesign

## Schema Reference

See `audit/references/ui-known-findings-schema.md` for field definitions and resolution state machine.
