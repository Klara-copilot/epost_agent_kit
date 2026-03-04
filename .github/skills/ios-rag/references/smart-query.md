# RAG Smart Query — HyDE + Multi-Query Retrieval (iOS)

## Purpose

Improve RAG recall on conceptual/abstract queries by generating hypothetical answers (HyDE) and variant queries before searching. Finds more relevant results than a single query alone.

## When to Use

| Query Type | Use Smart Query | Use Standard `query` |
|------------|:-:|:-:|
| Conceptual ("how does theming work?") | yes | partial |
| Cross-cutting ("accessibility in forms") | yes | partial |
| View relationships ("what uses EPButton?") | yes | partial |
| Vague/broad queries | yes | no |
| Specific file ("show me EPButton.swift") | no | yes |
| Known view name | no | yes |

## Process

### Step 1: Analyze Query

Identify before searching:
- **View/type names**: EPButton, SettingsView, ThemeToken
- **Concepts**: dark mode, navigation, state management, accessibility
- **File types**: swift, storyboard, xib
- **Scope**: specific file vs. pattern vs. architecture

### Step 2: Generate Hypothetical Answer (HyDE)

Write a ~50-100 word hypothetical Swift code snippet or doc fragment that would appear in the ideal result. Embed and search this passage — it matches actual code better than a question does.

**Example:**

| User Query | HyDE Passage |
|-----------|-------------|
| "how does button theming work?" | `EPButton applies theme tokens via ThemeProvider. ButtonToken struct defines primary, secondary, and ghost variants. Color values resolve through ColorToken.primary and ColorToken.onPrimary. Font uses TypographyToken.button. Modifier .epButtonStyle(.primary) applies the full token set.` |
| "how to handle navigation?" | `NavigationCoordinator protocol defines push, pop, present methods. Each feature module creates a concrete coordinator. AppCoordinator holds child coordinators in a stack. Deep links resolve through URLScheme handler to coordinator actions.` |

### Step 3: Generate 3-5 Variant Queries

| Strategy | Example (for "button theming") |
|----------|-------------------------------|
| Technical synonyms | "EPButton color token styling" |
| Type-specific | "ButtonToken ThemeProvider modifier" |
| Framework-specific | "SwiftUI ViewModifier button appearance" |
| Design-system specific | "theme token color typography button" |
| Protocol-level | "ButtonStyle protocol custom styling" |

**Tips:**
- Use PascalCase for types (EPButton, ThemeToken)
- Include framework terms (SwiftUI, UIKit, Combine)
- Include design system terms (ThemeToken, ColorToken, TypographyToken)
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
3. **Diversify** across views, models, protocols, extensions
4. **Present** best 5-8 unique results with source query context

## Notes

- The `query` tool already does synonym expansion server-side; this adds LLM-level intelligence on top
- If original query returns 5+ high-score results (>0.5), skip variant queries
- For exact lookups, use `query` with component filter directly

## Related Documents

- `SKILL.md` — Main iOS RAG skill documentation
- `query-patterns.md` — Common query examples and filter patterns
