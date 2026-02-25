---
name: a11y-mode-audit
description: Audit mode — batch accessibility analysis of Kotlin files producing structured JSON violation reports
user-invocable: false
---

# Accessibility Audit Mode

Activated by: `/android:a11y:audit` command, pre-commit hooks, PR reviews.

**CONSTRAINT: This mode is read-only. Do NOT use Write, Edit, or Bash tools. Only analyze and produce JSON output.**

## Output Format

Produce valid JSON only — no additional text outside JSON:

```json
{
  "total_violations": 5,
  "critical_count": 3,
  "warning_count": 2,
  "block_pr": true,
  "violations": [
    {
      "file": "ProfileScreen.kt",
      "line": 42,
      "type": "missing_content_description",
      "wcag": "1.1.1",
      "severity": "critical",
      "message": "IconButton missing contentDescription",
      "finding_id": null,
      "suggestion": "Add: Icon(Icons.Default.Close, contentDescription = \"Close\")"
    }
  ]
}
```

## Violation Types

### Critical (block PR)
- `missing_content_description` — Interactive Icon/IconButton with `contentDescription = null`
- `interactive_element_no_semantics` — `clickable {}` without `semantics { role = Role.Button }`
- `missing_form_label` — `TextField`/`OutlinedTextField` without `label` parameter
- `missing_heading_semantics` — Visual heading Text without `semantics { heading() }`
- `modal_no_pane_title` — `AlertDialog`/`Dialog` without `semantics { paneTitle = "..." }`
- `missing_live_region` — Dynamic status text without `liveRegion`
- `null_description_on_interactive` — Image with `contentDescription = null` used as button

### Warning (report only)
- `redundant_description` — `contentDescription` includes "button" with Role.Button
- `poor_contrast` — Hardcoded color that may fail WCAG contrast ratio
- `missing_state_description` — Toggle/switch without `stateDescription`

## Block PR Decision

Block (`block_pr: true`) if:
- Any critical violations found
- More than 5 warning violations
- Violations match known findings in `epost-known-findings-android.json` with priority 1

Don't block (`block_pr: false`) if:
- Only warning violations (5 or fewer)
- Violations are in test files (`*Test.kt`, `*Preview*`)
- Violations are in commented code

## Detection Rules

Reference `android/accessibility/` skill files for detailed detection criteria:
- `a11y-buttons.md` — IconButton, clickable {} detection patterns
- `a11y-forms.md` — TextField/OutlinedTextField label detection
- `a11y-images.md` — Image/Icon contentDescription classification
- `a11y-headings.md` — Visual heading detection and heading() semantics
- `a11y-focus.md` — Focus management and liveRegion checks
- `a11y-colors-contrast.md` — Hardcoded color contrast checks
- `a11y-testing.md` — Testing completeness

## Constraints

- **Output valid JSON only** — No additional text outside JSON
- **Be precise** — Exact line numbers and file paths
- **Match known findings** — Include finding_id when matched against `epost-known-findings-android.json`
- **Block appropriately** — Only block on critical violations
- **Provide suggestions** — Include Kotlin/Compose fix suggestions for every violation
