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

### Step 3: Generate 3-5 Variant Queries

| Strategy | Example (for "button animation") |
|----------|--------------------------------|
| Technical synonyms | "Button CSS transition hover effect" |
| Component-specific | "ButtonBase motion variants framer-motion" |
| Framework-specific | "React onClick animation spring" |
| Design-system specific | "klara-theme button interaction states" |
| File-type targeted | "button styles SCSS keyframes" |

**Tips:**
- Use PascalCase AND kebab-case (Button / button)
- Include framework terms (React, framer-motion, SCSS)
- Include design system terms (klara-theme, design token, kds)
- Mix code-level and concept-level phrasings

### Step 4: Execute Queries

```
query(original_query, top_k=3)
query(hyde_passage_truncated_to_100_words, top_k=3)
query(variant_1, top_k=3)
query(variant_2, top_k=3)
query(variant_3, top_k=3)
```

Use `top_k=3` per query — yields up to 15 candidates before dedup.

### Step 5: Merge Results

1. **Deduplicate** by file path
2. **Boost** files appearing in 2+ query results
3. **Diversify** across code, styles, tests, docs
4. **Present** best 5-8 unique results with source query context

## Filters

Narrow results when domain is clear:

```
filters={"topic": "design-system"}     # Tokens, themes
filters={"category": "component"}       # Only components
filters={"file_type": "scss"}           # Only styles
filters={"component": "button"}         # Specific component
```

## Worked Example

**User asks:** "What components use the Dialog?"

| Step | Output |
|------|--------|
| HyDE | `import { Dialog, DialogContent, DialogTrigger } from '@klara/dialog'; Dialog is used in ConfirmationModal, DeleteModal, SettingsPanel.` |
| Variant 1 | "Dialog component imports usage" |
| Variant 2 | "DialogContent DialogTrigger integration" |
| Variant 3 | "modal overlay popup klara dialog" |

## Notes

- The `query` tool already does synonym expansion server-side; this adds LLM-level intelligence on top
- If original query returns 5+ high-score results, skip variant queries
- For exact lookups, use `query` or `navigate` directly

## Related Documents

- `SKILL.md` — Main web RAG skill documentation
- `query-patterns.md` — Common query examples and filter patterns
