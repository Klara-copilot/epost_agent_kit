# RAG Smart Query — HyDE + Multi-Query Retrieval

## Purpose

Improve RAG recall on conceptual/abstract queries by generating hypothetical answers (HyDE) and variant queries before searching. Finds more relevant results than a single query alone.

## When to Use

| Query Type | Use Smart Query | Use Standard `query` |
|------------|:-:|:-:|
| Conceptual ("how does theming work?") | ✅ | ⚠️ |
| Cross-cutting ("accessibility in forms") | ✅ | ⚠️ |
| Component relationships ("what uses Button?") | ✅ | ⚠️ |
| Vague/broad queries | ✅ | ❌ |
| Specific file ("show me Button.tsx") | ❌ | ✅ |
| Known component name | ❌ | ✅ |

## Process

### Step 1: Analyze Query

Identify before searching:
- **Component names**: Button, TextField, Dialog, DatePicker
- **Concepts**: dark mode, form validation, accessibility, animation
- **File types**: TS/TSX, SCSS, JSON
- **Scope**: specific file vs. pattern vs. architecture

### Step 2: Generate Hypothetical Answer (HyDE)

Write a ~50-100 word hypothetical code snippet or doc fragment that would appear in the ideal result. Embed and search this passage — it matches actual code/docs better than a question does.

**Example:**

| User Query | HyDE Passage |
|-----------|-------------|
| "how does button animation work?" | `Button uses framer-motion AnimatePresence with spring transition for hover/press states. Animation variants object defines scale and opacity transforms. CSS transition handles background-color and border-color on hover.` |
| "how to add dark mode support?" | `ThemeProvider wraps app with klara-theme tokens. useTheme() hook accesses current theme. CSS variables var(--kds-color-background) switch between light/dark values. Toggle via data-theme attribute on root.` |

### Step 3: Generate 1-2 Structural Variants

The RAG server auto-expands synonyms and recognizes component aliases (call `expansions` MCP tool to see current data). Do NOT generate synonym variants — generate structural variants only (different angle or scope).

| Strategy | Example (for "button animation") |
|----------|--------------------------------|
| Component-specific (different scope) | "ButtonBase motion variants framer-motion" |
| Architecture-level | "klara-theme button interaction states CSS variables" |

**Tips:**
- Use PascalCase for component names (Button, ButtonBase) — server handles alias expansion
- Focus on structural differences (file-level vs. concept-level, or different component scope)
- Do NOT add synonym variants like "btn animation" or "component hover effect" — server handles these

### Step 4: Execute Queries

```
query(original_query, top_k=3)
query(hyde_passage_truncated_to_100_words, top_k=3)
query(structural_variant_1, top_k=3)
# optional: query(structural_variant_2, top_k=3)
```

Use `top_k=3` per query — yields up to 9-12 candidates before dedup (reduced from 15 since synonym variants are skipped).

### Step 5: Merge Results

1. **Deduplicate** by file path
2. **Boost** files appearing in 2+ query results
3. **Diversify** across code, styles, tests, docs
4. **Present** best 5-8 unique results with source query context

## Filters

Narrow results when domain is clear. Discover valid filter values at runtime via `status` or `catalog` tools — do not hardcode topic, file_type, or module values.

```
filters={"topic": "<discover via status>"}     # Topic area
filters={"category": "component"}              # Only components
filters={"file_type": "<discover via status>"} # File extension
filters={"component": "<canonical from expansions>"}  # Specific component
```

## Worked Example

**User asks:** "What components use [SomeComponent]?"

| Step | Output |
|------|--------|
| HyDE | Write ~50-100 word hypothetical import/usage snippet showing how [SomeComponent] would be consumed |
| Variant 1 | "[SomeComponent] imports usage" |
| Variant 2 | "[SomeComponent] integration pattern" |

## Server-Side Expansion

The RAG server auto-expands queries before embedding:
- **Synonym expansion**: "btn" -> "button", "loading" -> "fetching pending spinner", etc. (60+ groups)
- **Component recognition**: "TextField" -> detected, canonical "text-field" injected into query
- **Multi-word phrase matching**: "design token" -> expanded with klara-theme, scss variable, etc.
- **Punctuation stripping**: "(color, typography)" -> both words expanded correctly

Call `expansions` MCP tool (format: "full") for current synonym groups.
Call `expansions` MCP tool (format: "full") for canonical component names.

### Impact on Strategy

| Technique | Still Needed? | Why |
|-----------|:---:|-----|
| HyDE passage | YES | Server can't generate hypothetical code |
| Structural variants (1-2) | YES | Different angle/scope — not synonyms |
| Synonym variants | NO | Server handles "btn"/"button", "animation"/"transition" |
| Component filter with canonical name | YES | Use name from `expansions` MCP tool |

## Notes

- If original query returns 5+ high-score results, skip all variants
- For exact lookups, use `query` or `navigate` directly

## Related Documents

- `SKILL.md` — Main web RAG skill documentation
- `component-mappings.md` — How to get canonical names via `expansions` MCP tool
- `synonym-groups.md` — How to get synonym groups via `expansions` MCP tool
