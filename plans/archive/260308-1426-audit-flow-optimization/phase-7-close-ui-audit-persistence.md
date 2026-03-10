---
phase: 7
title: "audit --close --ui and audit persistence"
effort: 1h
depends: [5]
---

# Phase 7: `/audit --close --ui` and Audit Persistence

## Overview

Two related changes:

1. **`close-ui.md`** — close workflow for UI findings (mirrors `close-a11y.md` exactly)
2. **Audit persistence** — update `audit/references/ui.md` Step 5 (Generate Report) to also persist findings to `.epost-data/ui/known-findings.json` after each audit

## Context

A11y close pattern (source of truth):
- `audit --close <id>` → loads `close-a11y.md` → updates `.epost-data/a11y/known-findings.json`

UI close needs the same:
- `audit --close --ui <id>` → loads `close-ui.md` → updates `.epost-data/ui/known-findings.json`

Without audit persistence, `/fix --ui` and `/close --ui` have nothing to work with — the DB stays empty unless populated during audit.

## Files to Create

### `packages/core/skills/audit/references/close-ui.md`

```markdown
## Close UI Finding

Invoked when: `audit --close --ui <finding-id>`

### Steps

1. Load `.epost-data/ui/known-findings.json`
   - If file not found: report "no UI findings DB — run `/audit --ui` first"
2. Find entry with `id == <finding-id>`
   - If not found: list open finding IDs and prompt user to confirm
3. Check current state:
   - If already `resolved: true`: report "already resolved on {resolved_date}"
   - If `fix_applied: false`: warn "fix not yet applied — run `/fix --ui --finding-id {id}` first"
4. Set:
   - `resolved: true`
   - `resolved_date: today`
5. Save updated JSON
6. Output confirmation:
   ```json
   {
     "finding_id": <id>,
     "component": "<component>",
     "rule_id": "<rule_id>",
     "status": "RESOLVED",
     "resolved_date": "<date>"
   }
   ```

### Boundaries
- Only updates `resolved` and `resolved_date` — never modifies source code
- Does not delete the finding entry (DB is append-only for audit trail)
```

## Files to Modify

### `packages/core/skills/audit/SKILL.md`

Add to flag routing (in the `--close` section or route table):
```
| --close --ui <id> | Mark UI finding resolved | close-ui.md | epost-muji |
```

Add `close-ui.md` to Aspect Files table:
```
| `references/close-ui.md` | Close/resolve a UI finding in known-findings DB |
```

### `packages/core/skills/audit/references/ui.md`

Update **Step 5: Generate Audit Report** to add persistence:

After the existing "Output Markdown report" instruction, add:

```
### Step 5b: Persist Findings (always)

After writing the Markdown report, persist findings to `.epost-data/ui/known-findings.json`:

1. Check if `.epost-data/ui/known-findings.json` exists
   - If not: create it with empty `findings: []` array (schema: ui-known-findings-schema.md)
2. For each finding in this audit with severity critical, high, or medium:
   - Generate next available `id` (max existing id + 1)
   - Map finding fields to schema (rule_id, component, file_pattern, severity, etc.)
   - Set `source: "audit"`, `first_detected_date: today`, `resolved: false`
   - Append to `findings` array (no duplicates: skip if same rule_id + file_pattern already open)
3. Save updated JSON
4. Report: "Persisted {N} findings to .epost-data/ui/known-findings.json"
```

## Todo List

- [ ] Read `packages/core/skills/audit/references/close-a11y.md` for pattern reference
- [ ] Create `packages/core/skills/audit/references/close-ui.md`
- [ ] Add `--close --ui` routing to `packages/core/skills/audit/SKILL.md`
- [ ] Add `close-ui.md` to audit SKILL.md Aspect Files table
- [ ] Add Step 5b (persistence) to `packages/core/skills/audit/references/ui.md`
- [ ] Verify all edits in `packages/` not `.claude/`

## Success Criteria

- close-ui.md has same structure as close-a11y.md (warn if fix not applied, set resolved fields)
- audit/SKILL.md routes `--close --ui <id>` correctly
- audit/references/ui.md Step 5b persists findings to DB after every audit
- Deduplication: same rule_id + file_pattern not added twice
- DB is append-only (no deletions)
