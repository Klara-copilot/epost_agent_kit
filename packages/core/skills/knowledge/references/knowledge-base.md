---
name: knowledge-base
description: Use when recording ADRs, saving debug findings, persisting patterns, or referencing past decisions in docs/
user-invocable: false

metadata:
  agent-affinity: [epost-planner, epost-debugger, epost-docs-manager, epost-fullstack-developer]
  keywords: [knowledge, adr, decision, pattern, learning, memory, persist, capture]
  platforms: [all]
  triggers: ["ADR", "decision record", "learned pattern", "save finding"]
---

# Knowledge Base Skill

## Purpose

Shared project knowledge management system for persisting architectural decisions, learned patterns, debug findings, coding conventions, system architecture docs, and feature deep-dives across sessions.

## When Active

- Recording architectural decisions
- Capturing implementation patterns
- Documenting debugging findings
- Establishing coding conventions
- Documenting system architecture
- Writing feature deep-dives

## Directory Structure

```
docs/                           # Project root (git-tracked)
├── index.json                  # Machine-readable registry with agentHint
├── decisions/                  # Architectural decisions (ADRs)
│   └── ADR-NNNN-title.md
├── architecture/               # System structure docs
│   └── ARCH-NNNN-title.md
├── patterns/                   # Reusable code patterns
│   └── PATTERN-NNNN-title.md
├── conventions/                # Coding rules
│   └── CONV-NNNN-title.md
├── features/                   # Feature deep-dives
│   └── FEAT-NNNN-title.md
└── findings/                   # Debug insights, gotchas
    └── FINDING-NNNN-title.md
```

## Knowledge Categories

| Category | ID Prefix | Purpose | When to Record |
|----------|-----------|---------|----------------|
| decision | `ADR-NNNN` | Architectural choices with rationale | Non-trivial architectural decisions |
| architecture | `ARCH-NNNN` | System structure and component relationships | Documenting system design |
| pattern | `PATTERN-NNNN` | Reusable implementation approaches | New code patterns emerge |
| convention | `CONV-NNNN` | Coding rules and constraints | Inconsistencies resolved |
| feature | `FEAT-NNNN` | Feature-specific deep-dives | Complex feature needs documentation |
| finding | `FINDING-NNNN` | Debug root causes, gotchas | Non-obvious bugs fixed |

## File Format

### Naming Convention
`PREFIX-NNNN-short-kebab-title.md` where PREFIX matches the category ID prefix.

Examples:
- `ADR-0001-nextjs-app-router.md`
- `ARCH-0001-system-overview.md`
- `CONV-0001-named-exports.md`

### Metadata Convention
- **No YAML frontmatter** — all metadata lives in `docs/index.json`
- Docs use `## Status` and `## Tags` body sections
- Status values: `accepted` (decisions, conventions, patterns) or `current` (architecture, features, findings)

## Document Templates

### ADR (Architecture Decision Record)
```markdown
# ADR-NNNN: {Title}

## Status
Accepted

## Context
{Problem statement and decision drivers}

### Decision Drivers
- **Driver** — explanation

## Decision
{One-sentence statement of what was decided}

## Alternatives Considered
| Option | Pros | Cons | Reason Rejected |
|--------|------|------|-----------------|

## Consequences

### Positive
- ...

### Negative
- ...

### Neutral
- ...

## Tags
tag1, tag2
```

### ARCH (Architecture)
```markdown
# {Title}

## {Section heading}
{Free-form reference prose — system structure, data flow, component relationships}

## {Section heading}
### {Subsection}
- ...
```
Note: ARCH docs are free-form. No Status/Tags sections — metadata in index.json only.

### CONV (Convention)
```markdown
# CONV-NNNN: {Title}

## Status
Accepted

## Convention
{One-paragraph rule statement}

## Examples

### Correct
\`\`\`tsx
// correct code
\`\`\`

### Incorrect
\`\`\`tsx
// incorrect code
\`\`\`

## Exceptions
- ...

## Tags
tag1, tag2
```

### FEAT (Feature Deep-Dive)
```markdown
# {Feature Name} — {Subtitle}

## What is it?
{Description}

## Why is it used?
{Rationale}

## How it works
{Implementation details, code examples, tables}

## Summary
{Key takeaways}
```
Note: FEAT docs are free-form around What/Why/How. No Status/Tags sections.

### PATTERN (Reusable Code Pattern)
```markdown
# PATTERN-NNNN: {Title}

## Status
Accepted

## Pattern
{One-paragraph description}

## Implementation
\`\`\`tsx
// actual working code snippet
\`\`\`

### Explanation
1. Step-by-step breakdown

## Key Points
- ...

## Tags
tag1, tag2
```

### FINDING (Discovered Gotcha / Bug Insight)
```markdown
# FINDING-NNNN: {Title}

## Status
Current

## Finding
{One-paragraph statement of what was discovered}

## Evidence
\`\`\`
{Code snippet showing the behavior}
\`\`\`

## Impact
- ...

## Workaround
1. {Numbered steps}

## Related
- FEAT-NNNN: ...

## Tags
tag1, tag2
```

## Index Format

The `docs/index.json` file provides fast lookups:

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
  "dependencies": {
    "internal": [
      { "repo": "luz_common", "type": "library", "evidence": "pom.xml dependency" }
    ],
    "external": [
      { "name": "Keycloak", "type": "service", "evidence": "keycloak.json config" }
    ]
  },
  "business": {
    "domain": "B2B Inbox",
    "summary": "Digital mailbox for business users",
    "modules": ["inbox", "compose", "archive"],
    "users": "Business administrators and employees"
  },
  "entries": [{
    "id": "ADR-0001",
    "title": "Use Next.js App Router",
    "category": "decision",
    "status": "accepted",
    "audience": ["agent", "human"],
    "path": "docs/decisions/ADR-0001-nextjs-app-router.md",
    "tags": ["nextjs", "routing"],
    "agentHint": "check before choosing routing strategy or adding pages",
    "related": ["ARCH-0001"]
  }]
}
```

### Key Fields

- **`agentHint`** — Single sentence: when should an agent check this entry. Matched against current task keywords.
- **`audience`** — `["agent", "human"]` or `["agent"]` for agent-only entries.
- **`path`** — Relative to project root (e.g., `docs/decisions/ADR-0001.md`).
- **`dependencies.internal[].repo`** — Internal repository name (`luz_*` naming convention).
- **`dependencies.internal[].type`** — `api` | `library` | `shared-db`.
- **`dependencies.internal[].evidence`** — Where this was detected (e.g., `pom.xml`, `package.json`, REST client import).
- **`dependencies.external[].name`** — Third-party service or library name.
- **`dependencies.external[].type`** — `api` | `sdk` | `service`.
- **`dependencies.external[].evidence`** — Config file or code reference where dependency was found.
- **`business.domain`** — Business domain label (e.g., "B2B Inbox", "B2C Notifications").
- **`business.summary`** — One-sentence project description.
- **`business.modules`** — Top-level feature modules detected in project structure.
- **`business.users`** — Target user type inferred from domain or docs.

## Significance Threshold

**Record when**:
- Root cause took >10 minutes to find
- New pattern emerged others should follow
- Architectural decision could be questioned later
- Convention was inconsistent or newly established
- Research yielded key technology choice

**Don't record**:
- Trivial fixes (typos, imports, formatting)
- Well-known patterns (standard React hooks, basic CRUD)
- Information already in official docs
- Obvious bugs with simple fixes

## Knowledge vs Agent Memory

| Aspect | Knowledge Base | Agent Memory |
|--------|----------------|--------------|
| **Scope** | Team-wide, project-level | Agent-specific, session context |
| **Persistence** | Git-tracked, permanent | Auto-managed by Claude |
| **Management** | Explicit recording | Automatic |
| **Purpose** | Share learnings, preserve decisions | Task continuity, context |
| **Format** | Structured markdown + YAML | Unstructured notes |

## Cross-Referencing

Entries reference each other by ID in `related` array:

```yaml
related: [ADR-0001, PATTERN-005, FINDING-012]
```

This creates a knowledge graph linking related concepts.

## Aspect Files

| File | Purpose |
|------|---------|
| `adr-patterns.md` | ADR template and lifecycle |
| `capture.md` | When and how to capture knowledge |
| `sidecar-format-spec.md` | Data formats and schemas |

## Workflow Integration

1. **During implementation**: Discover patterns → capture to `patterns/`
2. **During debugging**: Find root cause → capture to `findings/`
3. **During architecture**: Make design choice → capture to `decisions/`
4. **During review**: Identify convention → capture to `conventions/`
5. **During documentation**: Document system structure → capture to `architecture/`
6. **During feature work**: Complex feature needs guide → capture to `features/`

## Usage

| Intent | Action |
|--------|--------|
| Capture knowledge | Use `knowledge --capture` — persist learning after debug/plan |
| Retrieve knowledge | Use `knowledge` (default) — search internal before planning/research |
| Store data | `data-store` — `.epost-data/` directory patterns |

## Related Skills

- `knowledge` — Unified skill for retrieval and capture
- `docs-seeker` — External documentation retrieval

## References

- `references/adr-patterns.md` — ADR template and lifecycle
- `references/capture.md` — Capture guidelines and templates
- `references/sidecar-format-spec.md` — Data format specifications
