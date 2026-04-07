---
phase: 1
title: Strengthen Pre-Write Validation gate in init.md
effort: 45m
depends: []
---

# Phase 1 — Strengthen Pre-Write Validation Gate

## Context

`init.md` currently has two Pre-Write Validation sections (Smart Init §5.5 and Generation Mode §5.5). Both are too permissive:

- Only checks `business.domain`, `entries`, `dependencies` (existence only)
- Does NOT check `path` per entry → luzcomp_scripts bug
- Does NOT check nested `dependencies.internal.libraries` / `apiServices` structure → 2 repos had flat/missing sub-objects
- Uses soft language ("verify") instead of blocking stop

## Files

- `packages/core/skills/docs/references/init.md` (only)

## Changes

### Change 1 — Rewrite §5.5 validation table (Generation Mode, around line 380)

Replace the 3-row "Field | Check | If fails" table with an 8-row blocking checklist:

| Field | Check | If fails |
|-------|-------|----------|
| `.business.domain` | Non-empty string; not `"..."`, `""`, `null` | Re-derive from §4.5 sources; fallback = repo slug |
| `.dependencies.internal.libraries` | Array exists (may be empty) | Add `[]` |
| `.dependencies.internal.apiServices` | Array exists (may be empty) | Add `[]` |
| `.dependencies.external` | Array exists (may be empty) | Add `[]` |
| `.entries` | Non-empty array | At least 1 entry required |
| `.entries[].id` | Matches `/^(ADR\|ARCH\|CONV\|FEAT\|PATTERN\|FINDING\|GUIDE\|API\|INFRA\|INTEG)-\d{4}$/` | Regenerate id as `{PREFIX}-{NNNN}` zero-padded |
| `.entries[].path` | Non-empty string starting with `docs/` | Reconstruct from category dir + filename |
| `.entries[].category` | Matches a key in `categories` map | Use canonical key (`architecture` not `arch`, etc.) |

Prepend with blocking language:

```
**STOP — DO NOT WRITE index.json until every row below passes.** If any row fails, fix the data in memory first, re-run the checklist, then write. Never write a partially-valid index.
```

### Change 2 — Apply the same table to Smart Init §5.5 (around line 130)

Smart Init has its own copy. Replace with the same 8-row table (not a reference — kept inline so the Smart Init flow is self-contained).

### Change 3 — Remove the short validation block in Migration Mode §5.5 (around line 470)

Migration Mode's 3-row table duplicates Generation Mode's old (weaker) version. Replace with: "Run the §5.5 Pre-Write Validation checklist from Generation Mode before writing `index.json`."

## TODO

- [ ] Read current `init.md` §5.5 blocks at all three locations
- [ ] Rewrite Generation Mode §5.5 with 8-row blocking checklist + STOP preamble
- [ ] Rewrite Smart Init §5.5 with the same 8-row checklist
- [ ] Collapse Migration Mode §5.5 to a reference
- [ ] Read back the file to confirm no stray duplicates

## Success Criteria

- [ ] All three Pre-Write Validation sections either contain the 8-row checklist or reference it
- [ ] Every row uses "must" / "STOP" / blocking language (no "verify" / "should")
- [ ] `path`, `id` format, and nested `dependencies.internal.libraries` + `apiServices` + `external` are explicit rows
- [ ] File length net change < +40 lines
