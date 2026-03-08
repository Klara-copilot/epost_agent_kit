# Knowledge Capture Guide

When and how to persist learnings to the knowledge base.

## Capture Triggers

### Post-Debugging
**When**: Root cause identified and fix validated
**Capture to**: `findings/`
**Include**: Symptom, root cause, resolution steps, prevention measures

**Example**:
```yaml
---
id: FINDING-0001
title: React useEffect infinite loop with object dependency
status: resolved
created: 2026-02-08
tags: [react, hooks, debugging, performance]
---

**Symptom**: Component re-renders infinitely, browser freezes

**Root Cause**: Object literal in useEffect dependency array creates new reference each render

**Resolution**: Move object creation outside component or use useMemo

**Prevention**: ESLint rule `react-hooks/exhaustive-deps`, prefer primitive dependencies
```

### Post-Implementation
**When**: New code pattern emerges that others should follow
**Capture to**: `patterns/` or `conventions/`
**Include**: When to use, implementation example, caveats

**Example**:
```yaml
---
id: PATTERN-0001
title: Error boundary wrapper for async components
status: active
tags: [react, error-handling, pattern]
---

**When to use**: Wrap async Server Components to prevent error propagation

**Implementation**:
```tsx
// app/components/ErrorBoundary.tsx
export default function ErrorBoundary({
  children, fallback
}: { children: React.ReactNode, fallback: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundaryClient fallback={fallback}>
        {children}
      </ErrorBoundaryClient>
    </Suspense>
  );
}
```

**Caveats**: Only catches errors in children, not in boundary itself
```

### Post-Research
**When**: Technology evaluation completes with decision
**Capture to**: `decisions/`
**Include**: Options evaluated, choice made, rationale

**Example**:
```yaml
---
id: DECISION-0001
title: Use Redux Toolkit over Zustand for state
status: accepted
tags: [state-management, redux, architecture]
related: [ADR-0005]
---

**Options**: Redux Toolkit, Zustand, Jotai, Recoil

**Choice**: Redux Toolkit

**Rationale**:
- Team familiar with Redux patterns
- Better DevTools integration
- Type safety with TypeScript
- Middleware ecosystem (persist, saga)
- Scales to complex state

**Trade-off**: More boilerplate than Zustand
```

### Post-Review
**When**: Recurring code smell identified or new convention established
**Capture to**: `conventions/`
**Include**: Rule, good/bad examples, enforcement

**Example**:
```yaml
---
id: CONVENTION-0001
title: Prefer named exports over default exports
status: active
tags: [code-style, imports, typescript]
---

**Rule**: Use named exports for components, utilities, types

**Good**:
```tsx
export function Button() {}
export const formatDate = () => {};
export type User = { id: string };
```

**Bad**:
```tsx
export default function Button() {}
export default formatDate;
```

**Rationale**: Better IDE refactoring, explicit imports, no naming conflicts

**Enforcement**: ESLint rule `import/no-default-export` except in Next.js pages
```

### Post-Architecture
**When**: Significant architectural decision made
**Capture to**: `adrs/`
**Include**: Full ADR template (see `adr-patterns.md`)

## Significance Threshold

### Record When

| Criteria | Example |
|----------|---------|
| **Non-obvious root cause** | Took >10 minutes to identify |
| **New pattern** | First time using composition pattern |
| **Questionable decision** | "Why did we choose X over Y?" |
| **Inconsistent convention** | Team uses mix of approaches |
| **Key research finding** | Library comparison reveals trade-offs |

### Don't Record

| Type | Reason |
|------|--------|
| **Trivial fixes** | Typos, missing imports, formatting |
| **Well-known patterns** | Standard React hooks, CRUD operations |
| **Official docs** | Already documented in library/framework |
| **Obvious bugs** | Simple logic errors, off-by-one |
| **Personal notes** | Use agent memory instead |

## Memory vs Knowledge Base

| Use Agent Memory For | Use Knowledge Base For |
|----------------------|------------------------|
| Session context (current task state) | Permanent team knowledge |
| Personal working notes | Shared learnings |
| Temporary findings | Validated patterns |
| Task-specific context | Cross-task insights |
| Auto-managed by Claude | Explicitly curated |

**Agent Memory**: "I'm currently debugging auth flow, checked these 3 files"
**Knowledge Base**: "Auth flow uses OAuth 2.0, see ADR-0003 for rationale"

## Capture Workflow

1. **Identify**: What was learned?
2. **Categorize**: Which category fits?
3. **Check existing**: Already documented?
4. **Write entry**: Use appropriate template
5. **Update index**: Add to `index.json`
6. **Cross-reference**: Link related entries

## Entry Templates

### Finding (Debug Root Cause)
```markdown
**Symptom**: [observable behavior]
**Root Cause**: [underlying issue]
**Resolution**: [fix applied]
**Prevention**: [how to avoid in future]
```

### Pattern (Implementation Approach)
```markdown
**When to use**: [scenario]
**Implementation**: [code example]
**Caveats**: [limitations, gotchas]
```

### Decision (Technology Choice)
```markdown
**Options**: [alternatives considered]
**Choice**: [selected option]
**Rationale**: [why chosen]
**Trade-offs**: [acknowledged downsides]
```

### Convention (Coding Standard)
```markdown
**Rule**: [convention statement]
**Good**: [example following rule]
**Bad**: [example violating rule]
**Rationale**: [why this convention]
**Enforcement**: [how to check compliance]
```

### ADR (Architecture)
See `adr-patterns.md` for full template.

## Compact Writing Tips

- **Bullets** over paragraphs
- **Tables** for comparisons
- **Code blocks** for examples
- **Bold** for key terms
- **Links** for references
- **Numbers** not words ("3 steps" not "three steps")
- **Active voice** ("use X" not "X should be used")

## Example Capture Session

**Scenario**: Debugged infinite render loop in Dashboard component

**What was learned**: Using object literal in useEffect deps causes loop

**Significance check**: Non-obvious, took 15 minutes to find

**Category**: `findings/` (debug root cause)

**Write entry**:
```markdown
---
id: FINDING-0012
title: Object literal in useEffect dependency causes infinite loop
status: resolved
created: 2026-02-08
tags: [react, hooks, performance, debugging]
related: [PATTERN-005]
agent: epost-debugger
---

# FINDING-0012: Object literal in useEffect dependency causes infinite loop

**Symptom**: Dashboard component re-renders continuously, browser becomes unresponsive

**Root Cause**: `useEffect` dependency array contains object literal `{ id: userId }`, creating new reference each render

**Resolution**:
1. Extract object to useMemo: `const deps = useMemo(() => ({ id: userId }), [userId])`
2. Or use primitive: `useEffect(() => {...}, [userId])`

**Prevention**:
- Enable ESLint rule `react-hooks/exhaustive-deps`
- Prefer primitive dependencies over objects
- Use React DevTools Profiler to catch render loops early
```

**Update index**:
```json
{
  "counts": { "findings": 13 },
  "entries": [
    {
      "id": "FINDING-0012",
      "category": "finding",
      "title": "Object literal in useEffect dependency causes infinite loop",
      "status": "resolved",
      "created": "2026-02-08",
      "tags": ["react", "hooks", "performance", "debugging"],
      "path": "findings/0012-object-literal-useeffect-loop.md",
      "related": ["PATTERN-005"],
      "agent": "epost-debugger"
    }
  ]
}
```

## Related Skills

- `knowledge-base` — Knowledge system structure
- `knowledge-capture` — Post-task capture workflow
- `knowledge-retrieval` — Search and retrieve entries
