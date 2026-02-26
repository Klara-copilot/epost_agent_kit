# Sidecar Format Specification

Data formats for the knowledge base system.

## Index Schema

File: `.knowledge/index.json`

```json
{
  "version": "1.0.0",
  "counts": {
    "adrs": 0,
    "patterns": 0,
    "findings": 0,
    "decisions": 0,
    "conventions": 0
  },
  "entries": []
}
```

### Entry Schema

```typescript
interface Entry {
  id: string;              // "ADR-0001", "PATTERN-0005", etc.
  category: Category;      // "adr" | "pattern" | "finding" | "decision" | "convention"
  title: string;           // Human-readable title
  status: Status;          // See status table below
  created: string;         // ISO date "YYYY-MM-DD"
  updated: string;         // ISO date "YYYY-MM-DD"
  tags: string[];          // Freeform tags for search
  path: string;            // Relative path from .knowledge/
  related: string[];       // Related entry IDs
  agent: string;           // Agent that created entry
  supersedes?: string;     // ID of superseded entry (ADRs only)
  superseded-by?: string;  // ID of superseding entry (ADRs only)
}
```

### Category Values

| Category | ID Prefix | Directory |
|----------|-----------|-----------|
| `adr` | `ADR-NNNN` | `adrs/` |
| `pattern` | `PATTERN-NNNN` | `patterns/` |
| `finding` | `FINDING-NNNN` | `findings/` |
| `decision` | `DECISION-NNNN` | `decisions/` |
| `convention` | `CONVENTION-NNNN` | `conventions/` |

### Status Values

| Category | Valid Statuses |
|----------|----------------|
| ADR | `proposed`, `accepted`, `deprecated`, `superseded`, `rejected`, `reverted` |
| Pattern | `active`, `deprecated`, `superseded` |
| Finding | `resolved`, `unresolved`, `recurring` |
| Decision | `accepted`, `rejected`, `revisited` |
| Convention | `active`, `deprecated`, `superseded` |

## Entry Markdown Format

All entries use YAML frontmatter + markdown body.

### Common Frontmatter

```yaml
---
id: CATEGORY-NNNN
title: Short descriptive title
status: [see status table]
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
related: [ID1, ID2]
agent: agent-name
---
```

### Category-Specific Frontmatter

#### ADR
```yaml
---
id: ADR-NNNN
title: Use X for Y
status: accepted
created: 2026-02-08
updated: 2026-02-08
tags: [architecture, component]
related: [ADR-0001, PATTERN-003]
agent: epost-architect
supersedes: ADR-0005
superseded-by: null
---
```

#### Pattern
```yaml
---
id: PATTERN-NNNN
title: Error boundary for async components
status: active
created: 2026-02-08
updated: 2026-02-08
tags: [react, error-handling]
related: [ADR-0002]
agent: epost-implementer
---
```

#### Finding
```yaml
---
id: FINDING-NNNN
title: Object literal in useEffect causes loop
status: resolved
created: 2026-02-08
updated: 2026-02-08
tags: [react, debugging, performance]
related: [PATTERN-005]
agent: epost-debugger
---
```

#### Decision
```yaml
---
id: DECISION-NNNN
title: Use Redux Toolkit over Zustand
status: accepted
created: 2026-02-08
updated: 2026-02-08
tags: [state-management, redux]
related: [ADR-0008, PATTERN-012]
agent: epost-architect
---
```

#### Convention
```yaml
---
id: CONVENTION-NNNN
title: Prefer named exports
status: active
created: 2026-02-08
updated: 2026-02-08
tags: [code-style, typescript]
related: []
agent: epost-reviewer
---
```

## Cross-Reference Format

Use `related` array to link entries by ID:

```yaml
related: [ADR-0001, PATTERN-003, FINDING-012]
```

Creates knowledge graph:
```
ADR-0001 ← → PATTERN-003
    ↓
FINDING-012
```

## ID Assignment

IDs are sequential within each category:

```
ADR-0001, ADR-0002, ADR-0003, ...
PATTERN-0001, PATTERN-0002, ...
FINDING-0001, FINDING-0002, ...
```

**Next ID = max existing ID + 1 per category**

Example:
```
Existing: ADR-0005, ADR-0007, ADR-0012
Next ID: ADR-0013
```

## File Naming

Pattern: `NNNN-kebab-case-title.md`

Examples:
- `0001-use-nextjs-app-router.md`
- `0005-error-boundary-async-components.md`
- `0012-object-literal-useeffect-loop.md`

**No category prefix in filename**, only in ID field.

## Index Update Operations

### Add Entry
1. Increment `counts.<category>`
2. Append to `entries` array
3. Sort entries by `created` desc (newest first)

### Update Entry
1. Find entry by `id`
2. Update fields (typically `updated`, `status`, `related`)
3. Don't change `counts`

### Deprecate Entry
1. Find entry by `id`
2. Set `status: "deprecated"`
3. Set `updated` to current date
4. Optionally set `superseded-by` to new entry ID

### Remove Entry
1. Find entry by `id`
2. Remove from `entries` array
3. Decrement `counts.<category>`
4. Delete markdown file

## Validation Rules

| Rule | Check |
|------|-------|
| **Unique IDs** | No duplicate `id` values |
| **Valid category** | Category in allowed list |
| **Valid status** | Status valid for category |
| **Path exists** | File at `path` exists |
| **Related IDs exist** | All `related` IDs in index |
| **Counts match** | `counts.<category>` = count of entries with that category |
| **Date format** | ISO 8601 `YYYY-MM-DD` |
| **Supersession links** | `supersedes` and `superseded-by` are reciprocal |

## Example Index

```json
{
  "version": "1.0.0",
  "counts": {
    "adrs": 2,
    "patterns": 1,
    "findings": 1,
    "decisions": 0,
    "conventions": 1
  },
  "entries": [
    {
      "id": "ADR-0001",
      "category": "adr",
      "title": "Use Next.js App Router for routing",
      "status": "accepted",
      "created": "2026-02-08",
      "updated": "2026-02-08",
      "tags": ["nextjs", "routing", "architecture"],
      "path": "adrs/0001-use-nextjs-app-router.md",
      "related": ["PATTERN-0001"],
      "agent": "epost-architect",
      "supersedes": null,
      "superseded-by": null
    },
    {
      "id": "PATTERN-0001",
      "category": "pattern",
      "title": "Error boundary for async Server Components",
      "status": "active",
      "created": "2026-02-08",
      "updated": "2026-02-08",
      "tags": ["react", "error-handling", "nextjs"],
      "path": "patterns/0001-error-boundary-async.md",
      "related": ["ADR-0001"],
      "agent": "epost-implementer"
    },
    {
      "id": "FINDING-0001",
      "category": "finding",
      "title": "Object literal in useEffect causes infinite loop",
      "status": "resolved",
      "created": "2026-02-08",
      "updated": "2026-02-08",
      "tags": ["react", "hooks", "performance", "debugging"],
      "path": "findings/0001-object-literal-useeffect-loop.md",
      "related": ["PATTERN-0001"],
      "agent": "epost-debugger"
    },
    {
      "id": "CONVENTION-0001",
      "category": "convention",
      "title": "Prefer named exports over default exports",
      "status": "active",
      "created": "2026-02-08",
      "updated": "2026-02-08",
      "tags": ["code-style", "typescript", "imports"],
      "path": "conventions/0001-prefer-named-exports.md",
      "related": [],
      "agent": "epost-reviewer"
    },
    {
      "id": "ADR-0002",
      "category": "adr",
      "title": "Use Redux Toolkit for global state",
      "status": "accepted",
      "created": "2026-02-08",
      "updated": "2026-02-08",
      "tags": ["redux", "state-management", "architecture"],
      "path": "adrs/0002-use-redux-toolkit.md",
      "related": [],
      "agent": "epost-architect",
      "supersedes": null,
      "superseded-by": null
    }
  ]
}
```

## Migration Path

If `.knowledge/` doesn't exist:

1. Create directory structure
2. Create `index.json` with empty entries
3. Set all counts to 0

If entries exist but no index:

1. Scan directories for markdown files
2. Parse frontmatter from each
3. Generate index from parsed data
4. Validate and write `index.json`
