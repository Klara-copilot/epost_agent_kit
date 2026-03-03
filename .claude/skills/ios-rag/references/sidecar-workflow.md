# Sidecar Generation Workflow (iOS)

AI-generated metadata that enriches RAG indexing quality across the three iOS repositories. Sidecars improve search relevance by providing structured context that embeddings alone miss.

## When to Generate

| Trigger | Action |
|---------|--------|
| Created new SwiftUI view or UIKit controller | Generate sidecar for the new file |
| Major refactor (renamed, restructured) | Regenerate sidecar for affected files |
| RAG result has `stale_sidecar: true` | Regenerate after completing current task |
| RAG result has placeholder metadata | Regenerate with real context |
| View gained new protocol conformances | Update sidecar to reflect new capabilities |

## When NOT to Generate

- Minor edits (typo fixes, comment changes, formatting)
- Test files (`*Tests.swift`, `*UITests.swift`)
- Config files (`*.xcconfig`, `*.plist`)
- Generated files (build output, CoreData models)
- Preview providers (`*_Previews`)

## Metadata Fields

```swift
// Conceptual — call via MCP generate_sidecar tool
generate_sidecar({
  file_path: "luz_ios_designui/Components/Button/EPButton.swift",
  metadata: {
    summary: "Primary button with loading, disabled, and icon variants using SwiftUI",
    component_names: ["EPButton", "EPButtonStyle", "EPButtonSize"],
    topics: ["ui", "design-system", "interaction"],
    protocols: ["View", "ButtonStyle"],
    module: "luz_ios_designui",
    dependencies: ["SwiftUI"],
    design_tokens: ["ButtonToken", "ColorToken.primary"]
  }
})
```

### Field Guidelines

| Field | Content | Example |
|-------|---------|---------|
| `summary` | 1-2 sentences, what the file does | "Navigation bar with back button, title, and action items" |
| `component_names` | All view/class/struct names | `["EPNavBar", "EPNavBarConfig"]` |
| `topics` | 2-4 relevant topic tags | `["ui", "navigation", "design-system"]` |
| `protocols` | Protocol conformances | `["View", "Equatable", "Identifiable"]` |
| `module` | Which of the 3 repos | `"luz_epost_ios"` |
| `dependencies` | Key frameworks beyond SwiftUI/UIKit | `["Combine", "CoreLocation"]` |
| `design_tokens` | Theme token types referenced | `["ColorToken", "TypographyToken"]` |

## Verification

After generating a sidecar, verify it improved results:

```
1. query({ query: "<view name>", top_k: 3 })
2. Check: Is the file in top results?
3. Check: Does score improve over pre-sidecar baseline?
4. Check: Are metadata fields populated (not placeholder)?
```

If results don't improve, review the summary — it should describe behavior and purpose, not just restate the filename.

## Batch Generation

After large refactors affecting 5+ files, generate sidecars for all affected files. Process in dependency order: shared theme tokens first, then design system components, then app views that consume them.
