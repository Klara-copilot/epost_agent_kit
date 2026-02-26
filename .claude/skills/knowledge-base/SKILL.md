---
name: knowledge-base
description: Project knowledge management — ADRs, learned patterns, debug findings, decision history. Use when agents need to persist knowledge for future sessions.
user-invocable: false

metadata:
  agent-affinity: "[epost-architect, epost-debugger, epost-documenter, epost-implementer]"
  keywords: "[knowledge, adr, decision, pattern, learning, memory, persist, capture]"
  platforms: "[all]"
  triggers: "["ADR", "decision record", "learned pattern", "save finding"]""
---

# Knowledge Base Skill

## Purpose

Shared project knowledge management system for persisting architectural decisions, learned patterns, debug findings, technical decisions, and coding conventions across sessions.

## When Active

- Recording architectural decisions
- Capturing implementation patterns
- Documenting debugging findings
- Persisting technical decisions
- Establishing coding conventions

## Directory Structure

```
.knowledge/                    # Project root (git-tracked)
├── index.json                 # Machine-readable index
├── adrs/                      # Architecture Decision Records
│   └── 0001-title.md
├── patterns/                  # Implementation patterns
│   └── 0001-title.md
├── findings/                  # Debug findings and solutions
│   └── 0001-title.md
├── decisions/                 # Technical decisions
│   └── 0001-title.md
└── conventions/               # Coding conventions
    └── 0001-title.md
```

## Knowledge Categories

| Category | Purpose | When to Record |
|----------|---------|----------------|
| ADRs | Architectural choices with rationale | Non-trivial architectural decisions |
| Patterns | Reusable implementation approaches | New code patterns emerge |
| Findings | Debug root causes and resolutions | Non-obvious bugs fixed |
| Decisions | Technology/library choices | Evaluation leads to choice |
| Conventions | Team coding standards | Inconsistencies resolved |

## File Format

### Naming Convention
`NNNN-short-kebab-title.md` where NNNN is zero-padded sequential ID (0001, 0002, etc.)

### Frontmatter Schema

```yaml
---
id: CATEGORY-NNNN
title: Short descriptive title
status: proposed|accepted|deprecated|superseded
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2]
related: [ID1, ID2]
agent: agent-name
supersedes: ID (optional)
superseded-by: ID (optional)
---
```

### ID Prefixes by Category

- ADRs: `ADR-0001`
- Patterns: `PATTERN-0001`
- Findings: `FINDING-0001`
- Decisions: `DECISION-0001`
- Conventions: `CONVENTION-0001`

## Index Format

The `.knowledge/index.json` file provides fast lookups:

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
  "entries": [{
    "id": "ADR-0001",
    "category": "adr",
    "title": "Use Next.js App Router for routing",
    "status": "accepted",
    "created": "2026-02-08",
    "updated": "2026-02-08",
    "tags": ["nextjs", "routing", "architecture"],
    "path": "adrs/0001-use-nextjs-app-router.md",
    "related": ["PATTERN-003"],
    "agent": "epost-architect"
  }]
}
```

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
| `knowledge-capture-guide.md` | When and how to capture knowledge |
| `sidecar-format-spec.md` | Data formats and schemas |

## Workflow Integration

1. **During implementation**: Discover patterns → capture to `patterns/`
2. **During debugging**: Find root cause → capture to `findings/`
3. **During research**: Make technology choice → capture to `decisions/`
4. **During review**: Identify convention → capture to `conventions/`
5. **During architecture**: Make design choice → capture to `adrs/`

## Related Skills

- `knowledge-retrieval` — Search and retrieve knowledge entries
- `knowledge-capture` — Post-task knowledge persistence workflow

## References

- `references/adr-patterns.md` — ADR template and lifecycle
- `references/knowledge-capture-guide.md` — Capture guidelines
- `references/sidecar-format-spec.md` — Data format specifications
