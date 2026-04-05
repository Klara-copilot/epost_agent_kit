# External Documentation — Level 5 Retrieval

Use when internal sources (docs/, RAG, skills, codebase) don't have what you need. Typically: unfamiliar library API, framework version migration, third-party SDK usage.

## Source Priority

1. Context7 MCP (preferred — always up-to-date)
2. WebSearch — "[library] [version] [topic]"
3. Official docs site via WebFetch
4. GitHub README/docs via `gh` CLI or repomix

## Context7 Workflow

```
1. resolve-library-id  →  get the library's Context7 ID
2. query-docs          →  fetch current documentation for your topic
```

If Context7 fails or doesn't have the library → fall back to WebSearch.

## Effective Query Patterns

| Goal | Query format |
|------|-------------|
| Specific API | `[library] [version] [method/prop]` |
| Task-oriented | `how to [task] in [library]` |
| Error debugging | paste the exact error message |
| Code examples | `[library] examples [feature]` |

## Best Practices

- Always include version in query — docs diverge significantly between versions
- Prefer official docs over community resources
- Read Getting Started before diving into API reference
- Cross-reference with source code if docs are unclear or outdated
- Note breaking changes when upgrading versions
- If docs appear outdated, check the library's GitHub CHANGELOG

## Fallback Chain

```
Context7 → WebSearch → WebFetch official site → GitHub README → npm/PyPI/CocoaPods README
```

Stop as soon as you have sufficient context. Don't exhaust all sources unnecessarily.
