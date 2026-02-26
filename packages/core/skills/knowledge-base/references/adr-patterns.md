# ADR Patterns

Architecture Decision Records (ADRs) document significant architectural choices with full context and rationale.

## ADR Template

```markdown
---
id: ADR-NNNN
title: [Decision title - active voice verb phrase]
status: proposed
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [architecture, component, domain]
related: []
agent: epost-architect
supersedes: null
superseded-by: null
---

# ADR-NNNN: [Decision Title]

## Context

[What is the situation forcing this decision? What constraints exist? What are the driving forces?]

## Decision

[What is the change being proposed? State clearly in active voice.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Side effect 1]

## Alternatives Considered

### Option A: [Alternative name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Rejected because**: [reason]

### Option B: [Alternative name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Rejected because**: [reason]

## References
- [Link to documentation]
- [Related issue/discussion]
```

## Status Lifecycle

```
proposed → accepted → deprecated → superseded
    ↓           ↓           ↓
 rejected   reverted    archived
```

### Status Definitions

| Status | Meaning | Action |
|--------|---------|--------|
| **proposed** | Under consideration | Draft ADR, gathering feedback |
| **accepted** | Approved and active | Implement decision |
| **deprecated** | No longer recommended but not replaced | Migrate away gradually |
| **superseded** | Replaced by another ADR | Link to replacement via `superseded-by` |
| **rejected** | Considered but not approved | Document why in Consequences |
| **reverted** | Was accepted but rolled back | Document reversal rationale |

## Naming Convention

File: `NNNN-short-kebab-title.md`
ID: `ADR-NNNN`

Examples:
- `0001-use-nextjs-app-router.md` → `ADR-0001`
- `0002-adopt-redux-toolkit.md` → `ADR-0002`
- `0003-separate-ios-android-repos.md` → `ADR-0003`

## When to Write an ADR

**Write ADR for**:
- Architectural pattern choices (MVC, layered, microservices)
- Technology stack selections (framework, database, platform)
- Cross-cutting concerns (auth, logging, error handling)
- Infrastructure decisions (deployment, CI/CD, monitoring)
- Data modeling approaches (schema, relationships)
- API design choices (REST, GraphQL, versioning)

**Don't write ADR for**:
- Implementation details (use `patterns/` instead)
- Bug fixes (use `findings/` instead)
- Library version updates (use `decisions/` instead)
- Coding style (use `conventions/` instead)

## Quick Decision vs ADR

| Aspect | Quick Decision | ADR |
|--------|----------------|-----|
| Impact scope | Single component | System-wide |
| Reversibility | Easy to change | Costly to reverse |
| Time horizon | Temporary | Long-term |
| Stakeholders | 1-2 people | Team-wide |
| Complexity | Simple trade-off | Multiple factors |

## Linking ADRs

Use `supersedes` and `superseded-by` to track decision evolution:

```yaml
# ADR-0001 (original)
superseded-by: ADR-0015

# ADR-0015 (replacement)
supersedes: ADR-0001
```

Use `related` for dependencies without supersession:

```yaml
related: [ADR-0002, ADR-0007]
```

## Example ADR

```markdown
---
id: ADR-0001
title: Use Next.js App Router for routing
status: accepted
created: 2026-02-08
updated: 2026-02-08
tags: [nextjs, routing, architecture, react]
related: [PATTERN-003]
agent: epost-architect
supersedes: null
superseded-by: null
---

# ADR-0001: Use Next.js App Router for routing

## Context

The ePost web platform requires a routing solution that supports:
- File-based routing for developer productivity
- Server components for performance
- Nested layouts for UI composition
- Streaming and Suspense for UX

Next.js 14 offers two routing paradigms: Pages Router (legacy) and App Router (new).

## Decision

We will use Next.js App Router for all new routes and incrementally migrate Pages Router routes.

## Consequences

### Positive
- Native Server Components support
- Nested layouts reduce code duplication
- Better TypeScript integration
- Streaming rendering improves perceived performance
- Future-proof (Pages Router in maintenance mode)

### Negative
- Learning curve for team
- Some third-party libraries not compatible
- Migration effort for existing Pages Router code
- Different mental model (server-first vs client-first)

### Neutral
- Need to maintain both routers during migration
- Documentation split between paradigms

## Alternatives Considered

### Option A: Continue with Pages Router
- **Pros**: No migration cost, team familiarity
- **Cons**: Missing Server Components, deprecated future
- **Rejected because**: Technical debt accumulation, missing performance features

### Option B: React Router (client-side only)
- **Pros**: Flexibility, no framework lock-in
- **Cons**: No SSR/SSG, need separate meta-framework
- **Rejected because**: Requires additional infrastructure, loses Next.js benefits

## References
- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
```

## Best Practices

1. **Write ADRs early**: Capture rationale when fresh
2. **Keep ADRs immutable**: Append updates, don't rewrite history
3. **Link liberally**: Connect related decisions
4. **Document alternatives**: Show you considered options
5. **Update status**: Reflect current reality (accept, deprecate, supersede)
6. **Review periodically**: Ensure ADRs match codebase
