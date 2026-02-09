# Search Strategy Reference

How to search each knowledge source effectively.

## Level 1: .knowledge/ Search

### Index Query

**File**: `.knowledge/index.json`

**Filter by category**:
```bash
jq '.entries[] | select(.category == "pattern")' .knowledge/index.json
```

**Filter by tag**:
```bash
jq '.entries[] | select(.tags[] | contains("react"))' .knowledge/index.json
```

**Filter by status**:
```bash
jq '.entries[] | select(.status == "accepted")' .knowledge/index.json
```

**Full-text title search**:
```bash
jq '.entries[] | select(.title | test("error.*boundary"; "i"))' .knowledge/index.json
```

**Get entry path**:
```bash
jq -r '.entries[] | select(.id == "ADR-0001") | .path' .knowledge/index.json
```

**Follow related entries**:
```bash
# Get related IDs
jq -r '.entries[] | select(.id == "ADR-0001") | .related[]' .knowledge/index.json

# Resolve related entries
jq '.entries[] | select(.id | IN("PATTERN-003", "FINDING-012"))' .knowledge/index.json
```

### Content Search

**Grep across all entries**:
```bash
grep -r "Server Component" .knowledge/ --include="*.md"
```

**Search specific category**:
```bash
grep -r "authentication" .knowledge/adrs/ --include="*.md"
```

## Level 2: RAG System Search

### Query Structure

```typescript
{
  query: string,           // Natural language or keywords
  filters: {
    component?: string,    // Component name
    topic?: string,        // Topic/domain
    category?: string,     // Pattern, guide, reference
    file_type?: string,    // tsx, ts, swift, kt
    path?: string          // File path pattern
  },
  limit?: number          // Max results (default 10)
}
```

### Effective Queries

**Broad topic**:
```typescript
query_rag({
  query: "authentication flow",
  filters: { topic: "auth" }
})
```

**Specific component**:
```typescript
query_rag({
  query: "Login button implementation",
  filters: { component: "LoginButton", file_type: "tsx" }
})
```

**Pattern search**:
```typescript
query_rag({
  query: "error boundary usage",
  filters: { category: "pattern", file_type: "tsx" }
})
```

**File path filter**:
```typescript
query_rag({
  query: "navigation hooks",
  filters: { path: "app/hooks/*" }
})
```

### Platform-Specific Ports

| Platform | Port | Content |
|----------|------|---------|
| Web | 2636 | Next.js, React, TypeScript |
| iOS | 2637 | Swift, SwiftUI, UIKit |

## Level 3: Skills Index Search

### Index Query

**File**: `.claude/skills/skill-index.json`

**Find by keyword**:
```bash
jq '.skills[] | select(.keywords[] | contains("debug"))' .claude/skills/skill-index.json
```

**Find by trigger**:
```bash
jq '.skills[] | select(.triggers[] | contains("/debug"))' .claude/skills/skill-index.json
```

**Find by agent**:
```bash
jq '.skills[] | select(.["agent-affinity"][] | contains("epost-implementer"))' .claude/skills/skill-index.json
```

**Get skill path**:
```bash
jq -r '.skills[] | select(.name == "debugging") | .path' .claude/skills/skill-index.json
```

### Aspect Files

After finding skill, check for aspect files:

```bash
# List aspect files
ls .claude/skills/debugging/references/

# Read aspect
cat .claude/skills/debugging/references/root-cause-analysis.md
```

## Level 5: Codebase Search

### Grep Patterns

**Find function usage**:
```bash
grep -r "useAuth" --include="*.tsx" app/
```

**Find imports**:
```bash
grep -r "from '@/components/ErrorBoundary'" --include="*.ts*" .
```

**Find pattern with context**:
```bash
grep -r -A 3 -B 3 "ErrorBoundary" --include="*.tsx" app/
```

**Case-insensitive**:
```bash
grep -ri "authentication" --include="*.ts" .
```

### Glob Patterns

**Find all components**:
```
**/*.tsx in app/components/
```

**Find test files**:
```
**/*.test.ts in app/
```

**Find by naming convention**:
```
**/use*.ts in app/hooks/
```

### Read Strategy

1. **Start broad**: Glob to find files
2. **Filter**: Grep for specific patterns
3. **Read**: Read identified files
4. **Trace**: Follow imports/exports

## Level 6: Context7 Search

### Resolve Library

```typescript
resolve-library-id("library-name")
→ "/org/project/version"
```

**Common libraries**:
- `react` → `/facebook/react/18.2.0`
- `next` → `/vercel/next.js/14.0.0`
- `typescript` → `/microsoft/TypeScript/5.0.0`

### Fetch Docs

```typescript
get-library-docs(
  context7CompatibleLibraryID: "/facebook/react/18.2.0",
  topic: "hooks",
  tokens: 5000
)
```

**Topic examples**:
- "hooks"
- "server-components"
- "error-boundaries"
- "performance"

## Level 7: WebSearch

### Query Patterns

**Documentation**:
```
"[library] [version] [feature] documentation"
→ "React 18 error boundary documentation"
```

**Error resolution**:
```
"[error message] [context]"
→ "TypeError: Cannot read property 'map' of undefined React"
```

**Best practices**:
```
"[technology] best practices 2026"
→ "Next.js App Router best practices 2026"
```

**Comparison**:
```
"[A] vs [B] [year]"
→ "Redux vs Zustand 2026"
```

## Keyword Expansion Techniques

### Synonyms

| Original | Synonyms |
|----------|----------|
| error | exception, failure, bug, crash |
| state | data, store, model, context |
| component | module, widget, element, view |
| hook | custom hook, use*, lifecycle |
| route | path, navigation, link, page |

### Broader/Narrower

**Broader**: "authentication" → "auth" → "security"
**Narrower**: "auth" → "OAuth" → "OAuth 2.0 PKCE flow"

### Related Terms

| Term | Related |
|------|---------|
| Server Component | async, streaming, Suspense, RSC |
| Error boundary | componentDidCatch, fallback, error handling |
| Hook | useState, useEffect, custom hook, lifecycle |
| Routing | navigation, Link, useRouter, dynamic routes |

## Multi-Source Correlation

When results found in multiple sources, correlate:

**Example**: Error boundary pattern

1. **.knowledge/**: `PATTERN-0005: Error boundary for async components`
2. **RAG**: `app/components/ErrorBoundary.tsx` (implementation)
3. **Skills**: `debugging/SKILL.md` (when error boundaries don't catch)
4. **Codebase**: 12 usages via grep
5. **Context7**: React official error boundary docs

**Synthesized answer**:
- **Pattern**: Wrap async Server Components (team convention)
- **Implementation**: `ErrorBoundary.tsx` using react-error-boundary
- **Usage**: 12 components following pattern
- **Limitation**: Doesn't catch event handler errors (per debugging skill)
- **Reference**: React official docs for API details

## Search Optimization Tips

1. **Start specific, broaden if needed**: `"useAuth hook"` → `"auth hook"` → `"authentication"`
2. **Check index before content**: Index is faster, prevents full file reads
3. **Use filters aggressively**: Category, tag, file_type narrow results
4. **Follow relationships**: `related` field in knowledge entries, imports in code
5. **Cache results**: Don't re-search same query in single session
6. **Combine tools**: Grep finds files, Read gets content, index provides metadata
7. **Verify dates**: Prefer recent content, note stale entries

## Related References

- `priority-matrix.md` — When to use which source
- `knowledge-base/references/sidecar-format-spec.md` — Index schema
- `knowledge-base/references/knowledge-capture-guide.md` — Capture new findings
