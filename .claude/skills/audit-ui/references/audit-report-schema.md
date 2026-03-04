---
name: audit-report-schema
description: Shared JSON schema and severity model for audit-ui-component findings across web, iOS, Android
---

# Audit Report Schema

## Output Format

```json
{
  "component": "EpostButton",
  "platforms": ["web", "ios", "android"],
  "auditor": "epost-muji",
  "date": "YYYY-MM-DD",
  "verdict": "pass | fix-and-reaudit | redesign",
  "summary": {
    "web":     { "critical": 0, "high": 1, "medium": 2, "low": 1 },
    "ios":     { "critical": 0, "high": 0, "medium": 1, "low": 2 },
    "android": { "critical": 1, "high": 0, "medium": 0, "low": 0 },
    "total":   { "critical": 1, "high": 1, "medium": 3, "low": 3 }
  },
  "findings": [...],
  "crossPlatformNotes": [...],
  "mergeRisk": "HIGH — 1 critical in Android blocks merge",
  "topMentoringPoints": [
    "Always access colors via EpostTheme.colors, never hardcode Color(0xFF...)",
    "Modifier parameter must be the first parameter in @Composable functions",
    "State hoisting: keep @Composable functions stateless, lift state to caller"
  ]
}
```

## Finding Schema

```json
{
  "id": "ANDROID-TOKEN-001",
  "platform": "web | ios | android | cross",
  "severity": "critical | high | medium | low",
  "category": "token | pattern | performance | security | a11y | testing | consistency",
  "location": "path/to/File.kt:42",
  "issue": "Hardcoded color Color(0xFF1A73E8) used instead of theme token",
  "expected": "EpostTheme.colors.primary",
  "actual": "Color(0xFF1A73E8)",
  "suggestion": "Replace with `val colors = EpostTheme.colors` then use `colors.primary`",
  "mentoring": "Hardcoded colors break dark mode and theming. EpostTheme tokens automatically handle all theme variants — you get dark mode, brand overrides, and accessibility contrast for free.",
  "reference": "checklist-android.md#TOKEN-001"
}
```

## Cross-Platform Note Schema

```json
{
  "id": "CROSS-001",
  "severity": "high | medium | low",
  "issue": "iOS component uses parameter `tint` but web uses `iconColor` for the same concept",
  "platforms": ["web", "ios"],
  "expected": "Use `iconColor` on all platforms for consistency",
  "mentoring": "Consumers who work across platforms will be confused by different parameter names. Align API shape so the mental model transfers."
}
```

## Severity Definitions

| Severity | Criteria | Blocks Merge? |
|----------|----------|---------------|
| **critical** | Breaks functionality, security vulnerability, direct modification of shared library files | Yes |
| **high** | Hardcoded values that break theming, missing required props, pattern violation that causes tech debt | Recommend yes |
| **medium** | Suboptimal patterns, missing tests, a11y gaps, performance concerns | No, but must fix before GA |
| **low** | Style inconsistencies, naming improvements, minor coverage gaps | No |

## Verdict Criteria

| Verdict | Condition |
|---------|-----------|
| `pass` | 0 critical, 0 high |
| `fix-and-reaudit` | Any high finding, OR 3+ medium findings |
| `redesign` | 2+ critical findings |

## Category Definitions

| Category | Examples |
|----------|---------|
| `token` | Hardcoded color/spacing/font instead of theme token |
| `pattern` | Wrong naming convention, missing forwardRef, non-stateless composable |
| `performance` | Inline object creation in render, missing memoization, recomposition triggers |
| `security` | Hardcoded secret, unvalidated input, unsafe rendering (dangerouslySetInnerHTML) |
| `a11y` | Missing label, no keyboard support, insufficient color contrast |
| `testing` | Missing tests, testing implementation not behavior, no variant coverage |
| `consistency` | Cross-platform API mismatch, naming divergence, token coverage gap |
