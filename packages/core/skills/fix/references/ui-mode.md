---
name: fix-ui-mode
description: "(ePost) Fix UI component findings from known-findings DB"
user-invocable: false
metadata:
  argument-hint: "<ComponentName> [--finding-id <id>] [--top <n>]"
---

# Fix UI Mode

Invoked when: `fix --ui <ComponentName> [--finding-id <id>] [--top <n>]`

Executes inline in main context — the main context dispatches epost-muji via Agent tool.

## Steps

1. Parse `$ARGUMENTS`:
   - If no component name provided: ask "Which component? (e.g. `EpostButton`)" and wait for reply
2. Load `reports/known-findings/ui-components.json`
   - If file not found: report "no UI findings DB — run `/audit --ui <ComponentName>` first" and stop
3. Select finding(s):
   - `--finding-id <id>`: load that specific finding
   - `--top <n>`: load top N unresolved by severity (critical → high → medium → low)
   - No flag: load all unresolved findings for named component
4. Delegate to epost-muji via Agent tool with:
   - Finding objects from DB
   - Component name + `file_pattern`
   - Mode: fix (apply surgical changes)
   - Boundaries: fix ONLY the flagged rule violation — no refactoring
5. Receive fix result from epost-muji:
   - Lines changed
   - Confidence (high|medium|low)
6. Update `reports/known-findings/ui-components.json`: set `fix_applied: true`, `fix_applied_date: today`
7. Output confirmation (JSON + prose summary)
8. Suggest: "Run `/audit --close --ui <id>` to mark as fully resolved after verification"

## Boundaries

- Fix ONE rule violation per finding — no opportunistic improvements
- Do not run a full re-audit after fixing
- If fix requires structural change (STRUCT category) — report instead of fixing, suggest redesign

## Schema Reference

See `audit/references/ui-findings-schema.md` for field definitions and resolution state machine.
