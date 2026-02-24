---
description: (ePost) Fix a specific accessibility finding by ID from known-findings database
agent: epost-a11y-specialist
---

Fix finding ID $ARGUMENTS from `.agent-knowledge/epost-known-findings.json`.

## Instructions

1. Load the finding object with the specified ID from `.agent-knowledge/epost-known-findings.json`
2. Use `file_pattern` (glob) to locate the relevant Swift file(s)
3. Use `code_pattern` (regex) to locate the specific code element
4. Apply the appropriate fix template:
   - `add_button_label`: Add `accessibilityLabel`, `accessibilityTraits = .button`
   - `add_heading_trait`: Add `.header` trait and heading level
   - `add_form_label`: Add `accessibilityLabel` to form field
   - `make_image_decorative`: Set `isAccessibilityElement = false`
   - `add_modal_focus_trap`: Set `accessibilityViewIsModal`, manage focus
   - `add_status_announcement`: Add `UIAccessibility.post()` announcement
   - `other_manual`: Propose fix based on WCAG rules, mark NEEDS_REVIEW
5. Create minimal patch (unified diff format)

## Output

```json
{
  "finding_id": 3,
  "file": "path/to/file.swift",
  "status": "FIXED",
  "diff_summary": "Added accessibilityLabel to mapButton",
  "lines_changed": 2,
  "confidence": "high"
}
```

Status: `FIXED`, `NEEDS_REVIEW`, `SKIPPED`

## Constraints
- Surgical changes only — do NOT refactor
- If ambiguous, return `NEEDS_REVIEW`
- Preserve existing code style
