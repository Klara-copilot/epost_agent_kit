# Priority Matrix Reference

Decision table for selecting knowledge sources across 5 levels.

## Question Type -> Source Priority

### Architectural Decisions

**Question**: "What did we decide about [architecture]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L1 | `.knowledge/adrs` | Explicit architectural decisions |
| 2 | L1 | `.knowledge/decisions` | Technology choices leading to architecture |
| 3 | L3 | Skills | Agent guidance on architecture patterns |
| - | — | Skip RAG | RAG is code-focused, not decision-focused |
| - | — | Skip External | External docs don't have our decisions |

**Example queries**:
- "Why did we choose Next.js App Router?"
- "What's our microservices strategy?"
- "How do we handle authentication?"

---

### Implementation Patterns

**Question**: "How did we implement [feature]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L2 | RAG | Current implementation code |
| 2 | L4 | Codebase | Grep for actual usage |
| 3 | L1 | `.knowledge/patterns` | Documented patterns |
| 4 | L3 | Skills | General implementation guidance |
| - | — | Skip External | Our patterns > generic patterns |

**Example queries**:
- "How do we implement error boundaries?"
- "What's our state management pattern?"
- "How do we fetch data in Server Components?"

---

### Debugging

**Question**: "Why does [X] break?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L1 | `.knowledge/findings` | Previous similar issues |
| 2 | L2 | RAG | Current code that might be failing |
| 3 | L4 | Codebase | Trace actual execution path |
| 4 | L3 | Skills (debugging) | Systematic debugging approach |
| 5 | L5 | WebSearch | External error reports |
| - | — | Skip Context7 | Bug-specific, not general docs |

**Example queries**:
- "Why is this component re-rendering infinitely?"
- "What causes this build error?"
- "Why does deployment fail?"

---

### Library Usage

**Question**: "How to use [library feature]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L5 | Context7 | Official library docs |
| 2 | L2 | RAG | Our existing usage |
| 3 | L1 | `.knowledge/patterns` | Team patterns with library |
| 4 | L5 | WebSearch | Latest guides/tutorials |
| 5 | L4 | Codebase | Grep for examples |
| - | — | Skip `.knowledge/adrs` | Too high-level for API usage |

**Example queries**:
- "How to use React.Suspense?"
- "What are Zod schema patterns?"
- "How to configure Tailwind theme?"

---

### Coding Conventions

**Question**: "What's the convention for [X]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L1 | `.knowledge/conventions` | Explicit team standards |
| 2 | L3 | Skills | Agent-level guidelines |
| 3 | L2 | RAG | Existing code style |
| 4 | L4 | Codebase | Grep for patterns |
| - | — | Skip External | Team-specific, not external |

**Example queries**:
- "How do we name components?"
- "Where do we put utility functions?"
- "What's our testing file structure?"

---

### Available Components

**Question**: "What components exist for [X]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L2 | RAG (scope filter) | Indexed component library |
| 2 | L4 | Codebase | Glob component files |
| 3 | L3 | Skills (muji/*) | Design system reference |
| 4 | L1 | `.knowledge/patterns` | Component patterns |
| - | — | Skip External | Our components, not external |

**Scope-aware queries**:
```typescript
// Design system components
query({ query: "button", filters: { scope: "klara-theme", file_type: "tsx" } })

// Shared components
query({ query: "modal", filters: { scope: "luz-components", file_type: "tsx" } })

// All library components
query({ query: "form input", filters: { scope: "libs", file_type: "tsx" } })
```

**Example queries**:
- "What button components do we have?"
- "Is there a modal component?"
- "What form inputs exist?"

---

### Technology Evaluation

**Question**: "Should we use [technology]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L1 | `.knowledge/decisions` | Prior evaluations |
| 2 | L1 | `.knowledge/adrs` | Architectural context |
| 3 | L5 | WebSearch | Latest trends, comparisons |
| 4 | L5 | Context7 | Official library features |
| 5 | L2 | RAG | What we currently use |
| - | — | Skip codebase raw search | Need evaluation, not usage |

**Example queries**:
- "Should we use Redux or Zustand?"
- "Is Tailwind better than CSS Modules?"
- "Should we migrate to Bun?"

---

### Token / Design System Values

**Question**: "What is the value of [token]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L2 | RAG (scope: klara-theme) | Auto-indexed token files |
| 2 | L4 | Codebase (Grep) | Search SCSS/CSS files directly |
| - | — | Skip `.knowledge/` | Token values are volatile, not decisions |
| - | — | Skip Skills | Skill pointers direct to RAG, not values |
| - | — | Skip External | Internal design system tokens |

**Scope-aware queries**:
```typescript
query({ query: "color tokens", filters: { scope: "klara-theme", topic: "design-system" } })
query({ query: "spacing scale", filters: { scope: "klara-theme", file_type: "scss" } })
```

---

### State Management

**Question**: "How do we manage [state]?"

| Rank | Level | Source | Rationale |
|------|-------|--------|-----------|
| 1 | L1 | `.knowledge/adrs` | State management decisions |
| 2 | L2 | RAG (scope: luz-utils) | Redux toolkit implementation |
| 3 | L4 | Codebase | Grep for slices, selectors |
| 4 | L3 | Skills | General patterns |
| - | — | Skip External | Internal architecture |

---

## Staleness Thresholds

| Source | Freshness | Action if Stale |
|--------|-----------|-----------------|
| `.knowledge/` | Check `updated` field | Verify if >90 days old |
| RAG | Auto-indexed (always fresh) | Trust current |
| Skills | Git commit date | Check last update |
| Codebase | Git HEAD | Trust current |
| Context7 | Live docs (always fresh) | Trust current |
| WebSearch | Publication date | Prefer <2 years, flag if >3 years |

### Staleness Actions

**If knowledge entry >90 days old**:
1. Check if still valid (code still matches pattern?)
2. Update `updated` field if verified
3. Mark `status: deprecated` if obsolete
4. Create new entry if pattern evolved

**If skill >6 months old**:
1. Cross-reference with current codebase
2. Note discrepancies
3. Propose skill update if major drift

**If WebSearch result >2 years old**:
1. Seek more recent sources
2. Note age in citation
3. Validate against current library version

---

## Multi-Source Confidence Scoring

When combining sources, weight by confidence:

| Source | Confidence | Weight |
|--------|------------|--------|
| `.knowledge/` (recent) | High | 0.9 |
| RAG (current code) | High | 0.9 |
| `.knowledge/` (stale) | Medium | 0.6 |
| Skills (current) | High | 0.8 |
| Codebase (grep) | High | 0.9 |
| Context7 (official) | High | 0.9 |
| WebSearch (<1 year) | Medium | 0.7 |
| WebSearch (>2 years) | Low | 0.4 |

**Example scoring**:
```
Question: "How to implement error boundaries?"

Sources found:
- .knowledge/PATTERN-0005 (updated 30 days ago): 0.9
- RAG app/components/ErrorBoundary.tsx: 0.9
- Context7 React docs: 0.9
- WebSearch article (2024): 0.4

Combined confidence: High (0.9)
Recommendation: Follow .knowledge + RAG pattern
```

---

## Skip Rules

**Skip level if**:
- Source doesn't exist (no `.knowledge/` dir -> skip to RAG)
- Platform mismatch (iOS question but only web RAG -> skip RAG)
- Category mismatch (library API question -> skip `.knowledge/adrs`)
- Already found sufficient answer (stop search early)

**Early stop conditions**:
- `.knowledge/` has exact ADR -> stop, don't search further
- RAG has implementation + pattern documented -> stop
- Context7 has official API docs -> stop (for library usage questions)

---

## Source Combination Strategies

### Strategy 1: Layered Lookup
**Use when**: Building complete picture from parts

**Process**:
1. Get high-level decision (L1: ADR)
2. Get implementation pattern (L1: knowledge/patterns)
3. Get code example (L2: RAG / L4: codebase)
4. Get API reference (L5: Context7)

### Strategy 2: Validation Check
**Use when**: Verifying information across sources

**Process**:
1. Find answer in primary source
2. Cross-check against 2+ other sources
3. Note discrepancies
4. Prefer most recent/authoritative

### Strategy 3: Fill Gaps
**Use when**: Partial information in one source

**Process**:
1. Get what you can from best source
2. Identify gaps
3. Query specific sources for gaps only

---

## Related References

- `search-strategy.md` — How to query each source
- `knowledge-base/references/knowledge-capture-guide.md` — When to record findings
- `knowledge-base/references/sidecar-format-spec.md` — Knowledge index schema
