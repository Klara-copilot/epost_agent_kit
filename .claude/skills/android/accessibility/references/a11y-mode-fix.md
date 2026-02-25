---
name: a11y-mode-fix
description: Fix mode — surgical accessibility fixes from known-findings database with minimal Kotlin/Compose changes
user-invocable: false
---

# Accessibility Fix Mode

Activated by: `/android:a11y:fix <id>` and `/android:a11y:fix-batch <n>` commands.

## Input

Receives finding objects from `.agent-knowledge/epost-known-findings-android.json`:

```json
{
  "id": 3,
  "wcag": "1.1.1",
  "title": "Close button missing label",
  "screen": "Inbox > Message detail",
  "description": "Close IconButton is read by TalkBack as 'Button' with no label.",
  "file_pattern": "*MessageDetailScreen*",
  "code_pattern": "IconButton.*Close|closeButton",
  "fix_template": "add_content_description",
  "priority": 1,
  "estimated_effort_minutes": 5
}
```

## Output

```json
{
  "finding_id": 3,
  "file": "MessageDetailScreen.kt",
  "status": "FIXED",
  "diff_summary": "Added contentDescription = \"Close\" to close IconButton",
  "lines_changed": 1,
  "confidence": "high"
}
```

## Status Values

| Status | Meaning |
|--------|---------|
| `FIXED` | Fix applied, code matches rules, diff is minimal |
| `NEEDS_REVIEW` | Multiple matches, low confidence, or requires refactoring |
| `SKIPPED` | File/pattern not found, or fix requires major changes |

## Fix Templates

| Template | Action |
|----------|--------|
| `add_content_description` | Add `contentDescription = "..."` to Icon parameter or `semantics { contentDescription = "..." }` |
| `make_image_decorative` | Change `contentDescription` to `null` on purely decorative Image |
| `add_heading_semantics` | Add `Modifier.semantics { heading() }` to visual heading Text |
| `add_form_label` | Add `label = { Text("...") }` to TextField/OutlinedTextField |
| `add_modal_focus_management` | Add `semantics { paneTitle = "..." }` to Dialog + FocusRequester on open |
| `add_live_region` | Add `semantics { liveRegion = LiveRegionMode.Polite }` to dynamic status text |
| `other_manual` | Mark as `NEEDS_REVIEW` — requires manual intervention |

## Fix Process

1. **Locate file** — Search for files matching `file_pattern` (glob)
2. **Locate code** — Search for `code_pattern` (regex) in file
3. **Apply fix** — Use `fix_template` to determine minimal Kotlin/Compose change
4. **Generate diff** — Unified diff format with 3 lines context
5. **Generate summary** — Status, confidence, lines changed

## Constraints

### Do Not Refactor
- Only add accessibility attributes
- Don't change variable names or restructure composables
- Don't reorganize code
- Don't improve unrelated code quality

### Be Surgical
- Minimal changes only — add one parameter or one modifier
- Target exact issue from finding
- Don't fix other issues in same file
- Preserve existing Kotlin code style (indentation, naming)

### Be Confident
- If unsure about variable name, mark `NEEDS_REVIEW`
- Don't guess at composable structure
- Don't assume context not visible in code pattern
- Verify fix matches `android/accessibility/` rules
