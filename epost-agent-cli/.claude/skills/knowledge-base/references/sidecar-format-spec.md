# Sidecar Format Specification

Data formats for the knowledge base system.

## Index Schema

File: `docs/index.json`

```json
{
  "schemaVersion": "1.0.0",
  "description": "Project documentation registry",
  "updatedAt": "2026-02-28",
  "categories": {
    "decision": "Architectural choices and reasoning (ADRs)",
    "architecture": "System structure, libs, data flow",
    "pattern": "Reusable code patterns with examples",
    "convention": "Coding rules and constraints",
    "feature": "Deep-dive guides for specific features",
    "finding": "Discovered gotchas and debug insights"
  },
  "entries": []
}
```

### Entry Schema

```typescript
interface Entry {
  id: string;              // "ADR-0001", "ARCH-0001", "CONV-0001", etc.
  title: string;           // Human-readable title
  category: Category;      // "decision" | "architecture" | "pattern" | "convention" | "feature" | "finding"
  status: Status;          // See status table below
  audience: Audience[];    // ["agent", "human"] or ["agent"]
  path: string;            // Relative to project root: "docs/decisions/ADR-0001.md"
  tags: string[];          // Freeform tags for search
  agentHint: string;       // When should an agent consult this entry
  related: string[];       // Related entry IDs
  supersedes?: string;     // ID of superseded entry (ADRs only)
  superseded-by?: string;  // ID of superseding entry (ADRs only)
}
```

### Category Values

| Category | ID Prefix | Directory |
|----------|-----------|-----------|
| `decision` | `ADR-NNNN` | `docs/decisions/` |
| `architecture` | `ARCH-NNNN` | `docs/architecture/` |
| `pattern` | `PATTERN-NNNN` | `docs/patterns/` |
| `convention` | `CONV-NNNN` | `docs/conventions/` |
| `feature` | `FEAT-NNNN` | `docs/features/` |
| `finding` | `FINDING-NNNN` | `docs/findings/` |

### Status Values

| Category | Valid Statuses |
|----------|----------------|
| ADR | `proposed`, `accepted`, `deprecated`, `superseded`, `rejected`, `reverted` |
| Architecture | `current`, `deprecated`, `draft` |
| Pattern | `active`, `deprecated`, `superseded` |
| Convention | `active`, `deprecated`, `superseded` |
| Feature | `current`, `draft`, `outdated` |
| Finding | `resolved`, `unresolved`, `recurring` |

## Entry Markdown Format

All entries use YAML frontmatter + markdown body.

### Common Frontmatter

```yaml
---
id: PREFIX-NNNN
title: Short descriptive title
status: [see status table]
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2, tag3]
related: [ID1, ID2]
---
```

### Category-Specific Frontmatter

#### ADR (Decision)
```yaml
---
id: ADR-NNNN
title: Use X for Y
status: accepted
created: 2026-02-08
updated: 2026-02-08
tags: [architecture, component]
related: [ARCH-0001, PATTERN-003]
supersedes: ADR-0005
superseded-by: null
---
```

#### Architecture
```yaml
---
id: ARCH-NNNN
title: System overview and data flow
status: current
created: 2026-02-08
updated: 2026-02-08
tags: [architecture, system-design]
related: [ADR-0001]
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
---
```

#### Convention
```yaml
---
id: CONV-NNNN
title: Prefer named exports
status: active
created: 2026-02-08
updated: 2026-02-08
tags: [code-style, typescript]
related: []
---
```

#### Feature
```yaml
---
id: FEAT-NNNN
title: Authentication flow deep-dive
status: current
created: 2026-02-08
updated: 2026-02-08
tags: [auth, feature]
related: [ADR-0003]
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
ARCH-0001, ARCH-0002, ...
PATTERN-0001, PATTERN-0002, ...
CONV-0001, CONV-0002, ...
FEAT-0001, FEAT-0002, ...
FINDING-0001, FINDING-0002, ...
```

**Next ID = max existing ID + 1 per category**

Example:
```
Existing: ADR-0005, ADR-0007, ADR-0012
Next ID: ADR-0013
```

## File Naming

Pattern: `PREFIX-NNNN-kebab-case-title.md`

Examples:
- `ADR-0001-nextjs-app-router.md`
- `ARCH-0001-system-overview.md`
- `PATTERN-0005-error-boundary-async-components.md`
- `CONV-0001-named-exports.md`
- `FEAT-0001-auth-flow.md`
- `FINDING-0012-object-literal-useeffect-loop.md`

## Index Update Operations

### Add Entry
1. Append to `entries` array
2. Add `agentHint` and `audience` fields
3. Update `updatedAt` timestamp
4. Sort entries by category, then by ID

### Update Entry
1. Find entry by `id`
2. Update fields (typically `status`, `tags`, `related`)
3. Update `updatedAt` timestamp

### Deprecate Entry
1. Find entry by `id`
2. Set `status: "deprecated"`
3. Optionally set `superseded-by` to new entry ID
4. Update `updatedAt` timestamp

### Remove Entry
1. Find entry by `id`
2. Remove from `entries` array
3. Delete markdown file
4. Update `updatedAt` timestamp

## Validation Rules

| Rule | Check |
|------|-------|
| **Unique IDs** | No duplicate `id` values |
| **Valid category** | Category in allowed list |
| **Valid status** | Status valid for category |
| **Path exists** | File at `path` exists |
| **Related IDs exist** | All `related` IDs in index |
| **Date format** | ISO 8601 `YYYY-MM-DD` |
| **Supersession links** | `supersedes` and `superseded-by` are reciprocal |
| **agentHint present** | Every entry has non-empty `agentHint` |
| **audience present** | Every entry has `audience` array |

## Example Index

```json
{
  "schemaVersion": "1.0.0",
  "description": "Project documentation registry",
  "updatedAt": "2026-02-28",
  "categories": {
    "decision": "Architectural choices and reasoning (ADRs)",
    "architecture": "System structure, libs, data flow",
    "pattern": "Reusable code patterns with examples",
    "convention": "Coding rules and constraints",
    "feature": "Deep-dive guides for specific features",
    "finding": "Discovered gotchas and debug insights"
  },
  "entries": [
    {
      "id": "ADR-0001",
      "title": "Use Next.js App Router for routing",
      "category": "decision",
      "status": "accepted",
      "audience": ["agent", "human"],
      "path": "docs/decisions/ADR-0001-nextjs-app-router.md",
      "tags": ["nextjs", "routing", "architecture"],
      "agentHint": "check before choosing routing strategy or adding pages",
      "related": ["PATTERN-0001"],
      "supersedes": null,
      "superseded-by": null
    },
    {
      "id": "ARCH-0001",
      "title": "System architecture overview",
      "category": "architecture",
      "status": "current",
      "audience": ["agent", "human"],
      "path": "docs/architecture/ARCH-0001-system-overview.md",
      "tags": ["architecture", "system-design"],
      "agentHint": "check before making cross-module changes or adding new modules",
      "related": ["ADR-0001"]
    },
    {
      "id": "PATTERN-0001",
      "title": "Error boundary for async Server Components",
      "category": "pattern",
      "status": "active",
      "audience": ["agent", "human"],
      "path": "docs/patterns/PATTERN-0001-error-boundary-async.md",
      "tags": ["react", "error-handling", "nextjs"],
      "agentHint": "check before implementing error handling in Server Components",
      "related": ["ADR-0001"]
    },
    {
      "id": "CONV-0001",
      "title": "Prefer named exports over default exports",
      "category": "convention",
      "status": "active",
      "audience": ["agent", "human"],
      "path": "docs/conventions/CONV-0001-named-exports.md",
      "tags": ["code-style", "typescript", "imports"],
      "agentHint": "check before creating new modules or components",
      "related": []
    },
    {
      "id": "FINDING-0001",
      "title": "Object literal in useEffect causes infinite loop",
      "category": "finding",
      "status": "resolved",
      "audience": ["agent", "human"],
      "path": "docs/findings/FINDING-0001-object-literal-useeffect-loop.md",
      "tags": ["react", "hooks", "performance", "debugging"],
      "agentHint": "check when debugging infinite re-renders or useEffect loops",
      "related": ["PATTERN-0001"]
    }
  ]
}
```

## Migration Path

If `docs/` doesn't exist:

1. Create directory structure (decisions/, architecture/, patterns/, conventions/, features/, findings/)
2. Create `index.json` with empty entries and category definitions
3. Set `schemaVersion` to "1.0.0"

If entries exist but no index:

1. Scan directories for markdown files
2. Parse frontmatter from each
3. Generate `agentHint` from title + tags
4. Set `audience` to `["agent", "human"]` for all
5. Validate and write `index.json`
