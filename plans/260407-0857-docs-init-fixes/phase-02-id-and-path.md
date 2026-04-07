---
phase: 2
title: Fix ID format guidance and path field instructions
effort: 30m
depends: [1]
---

# Phase 2 — ID Format + Path Field Guidance

## Context

luz_payment repo generated `"id": "auth-token-refresh"` instead of `"id": "ADR-0001"`. The init.md schema example (line ~260) shows `"id": "ADR-0001"` correctly, but:

- There is no explicit **ID format specification** separate from the template
- No anti-pattern table showing what NOT to do
- No reminder that `id` and `path` are derived from each other (file `ADR-0001-nextjs-app-router.md` → id `"ADR-0001"`, path `"docs/decisions/ADR-0001-nextjs-app-router.md"`)

luzcomp_scripts repo omitted `path` entirely on some entries. Root cause similar — `path` is in the template but never called out as derivable from filename.

Depends on Phase 1 (same file).

## Files

- `packages/core/skills/docs/references/init.md` (only)

## Changes

### Change 1 — Add a new "Entry Schema & ID Format" subsection before Generation Mode §5 (around line 320)

Insert a compact subsection:

```markdown
### 4.9. Entry Schema & ID Format

Every entry in `docs/index.json` MUST follow this derivation rule:

Given a file `docs/{category-dir}/{PREFIX}-{NNNN}-{slug}.md`:
- `id` = `"{PREFIX}-{NNNN}"` — the prefix + 4-digit zero-padded number, nothing else
- `path` = `"docs/{category-dir}/{PREFIX}-{NNNN}-{slug}.md"` — full relative path from repo root

**Correct**:
```json
{ "id": "ADR-0001", "path": "docs/decisions/ADR-0001-nextjs-app-router.md" }
{ "id": "FEAT-0012", "path": "docs/features/FEAT-0012-inbox-search.md" }
```

**Incorrect — do not emit these**:
| Bad id | Why |
|--------|-----|
| `"auth-token-refresh"` | Missing PREFIX and NNNN — use `"ADR-0001"` or `"FEAT-0001"` |
| `"ADR-1"` | NNNN must be zero-padded to 4 digits |
| `"adr-0001"` | PREFIX is uppercase |
| `"ADR-0001-auth-token"` | id is PREFIX-NNNN only, slug goes in `path` |

**Incorrect — missing path**:
| Bad entry | Fix |
|-----------|-----|
| `{ "id": "ADR-0001", "title": "..." }` (no path) | Add `"path"` — it is REQUIRED, never omit |

Numbering: IDs within a category are sequential starting at 0001. Gaps are allowed but not recommended.
```

### Change 2 — Update the index.json template (§5, around line 358) to add an inline comment

In the `entries[]` example, add comments on the two fields that cause the most errors:

```json
"entries": [
  {
    "id": "ADR-0001",            // REQUIRED — format: PREFIX-NNNN (4-digit zero-padded)
    "title": "...",
    "category": "decision",
    "status": "accepted",
    "audience": ["agent", "human"],
    "path": "docs/decisions/ADR-0001-title.md",  // REQUIRED — full relative path from repo root
    "tags": [],
    "agentHint": "check before ...",
    "related": []
  }
]
```

## TODO

- [ ] Add §4.9 "Entry Schema & ID Format" subsection with Correct/Incorrect tables
- [ ] Annotate `id` and `path` in the template at §5 with REQUIRED comments
- [ ] Ensure new subsection is referenced from Phase 1's validation checklist (`.entries[].id` and `.entries[].path` rows should point to §4.9)

## Success Criteria

- [ ] New §4.9 exists with both "Correct" example and "Incorrect" anti-pattern tables
- [ ] Anti-pattern table includes `"auth-token-refresh"` as a bad id example
- [ ] Template at §5 has REQUIRED comments on `id` and `path`
- [ ] Phase 1 validation checklist rows for `.entries[].id` and `.entries[].path` cross-reference §4.9
