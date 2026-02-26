---
description: (ePost) Fix a specific Android accessibility finding by ID from known-findings database
agent: epost-a11y-specialist
---

Fix finding ID $ARGUMENTS from `.agent-knowledge/epost-known-findings-android.json`.

## Instructions

1. Load the finding object with the specified ID from `.agent-knowledge/epost-known-findings-android.json`
2. Use `file_pattern` (glob) to locate the relevant Kotlin file(s)
3. Use `code_pattern` (regex) to locate the specific code element
4. Apply the appropriate fix template:
   - `add_content_description`: Add `contentDescription = "..."` to Icon or `semantics { contentDescription = "..." }`
   - `add_heading_semantics`: Add `Modifier.semantics { heading() }` to visual heading Text
   - `add_form_label`: Add `label = { Text("...") }` to TextField/OutlinedTextField
   - `make_image_decorative`: Change `contentDescription` to `null` on decorative Image
   - `add_modal_focus_management`: Add `semantics { paneTitle = "..." }` + focus management on open
   - `add_live_region`: Add `semantics { liveRegion = LiveRegionMode.Polite }` to dynamic text
   - `other_manual`: Propose fix based on `android/accessibility/` rules, mark NEEDS_REVIEW
5. Create minimal patch (unified diff format)

## Output

```json
{
  "finding_id": 3,
  "file": "path/to/Screen.kt",
  "status": "FIXED",
  "diff_summary": "Added contentDescription to close IconButton",
  "lines_changed": 1,
  "confidence": "high"
}
```

Status: `FIXED`, `NEEDS_REVIEW`, `SKIPPED`

## Constraints
- Surgical changes only — do NOT refactor
- If ambiguous, return `NEEDS_REVIEW`
- Preserve existing Kotlin/Compose code style
