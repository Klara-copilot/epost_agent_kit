---
name: a11y-wcag
description: Use when accessibility, WCAG, POUR, or a11y compliance is relevant across any platform
user-invocable: false
metadata:
  keywords:
    - a11y
    - accessibility
    - wcag
    - aria
    - screen-reader
    - pour
  agent-affinity:
    - epost-a11y-specialist
  platforms:
    - all
---

# Accessibility Core — WCAG 2.1 AA

Cross-platform foundation for accessibility auditing, fixing, and guidance.

## POUR Framework

| Principle | Requirement |
|-----------|-------------|
| **Perceivable** | Content available through sight, hearing, or touch |
| **Operable** | Interface navigable by keyboard, pointer, voice |
| **Understandable** | Content readable, predictable, input-assisted |
| **Robust** | Compatible with assistive technologies |

## WCAG Conformance Levels

| Level | Requirement | Target |
|-------|-------------|--------|
| **A** | Minimum | Must pass |
| **AA** | Standard (legal baseline) | **Our target** |
| **AAA** | Enhanced | Nice to have |

## Severity & Scoring

Accessibility score: 0–100 (start at 100, subtract per finding).

| Severity | Points | Examples |
|----------|--------|----------|
| Critical | -10 | Missing labels, keyboard traps, no alt text, zero contrast |
| Serious | -5 | No focus indicator, non-descriptive links, missing headings |
| Moderate | -2 | Inconsistent nav, positive tabIndex, heading gaps |
| Minor | -1 | Missing ARIA on decorative elements |

### PR Blocking Rule

Block PR when **any** of:
- 1+ critical violations
- 1+ regressions (resolved finding reappears)
- 5+ serious violations

## Platform Skills

Activate ONLY the skill matching the detected platform:

| Signal | Platform | Skill |
|--------|----------|-------|
| `.swift`, `.xib`, SwiftUI | iOS | `ios-a11y` |
| `.kt`, Compose | Android | `android-a11y` |
| `.tsx`, `.jsx`, HTML, CSS | Web | `web-a11y` |

If no signal, ask the user.

## Operating Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Guidance** | `/review-a11y`, direct questions | Human-readable examples, no file writes |
| **Audit** | `/audit-a11y` | JSON-only output, read-only (no Write/Edit) |
| **Fix** | `/fix-a11y` | JSON status + code edits, surgical changes only |
| **Close** | `/audit-close-a11y` | Update known-findings DB, JSON confirmation |

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Audit violations | `audit-a11y` | `/audit-a11y`, "audit accessibility" |
| Fix violations | `fix-a11y` | `/fix-a11y`, "fix a11y", fix top N |
| Close finding | `audit-close-a11y` | `/audit-close-a11y`, mark resolved |
| Review compliance | `review-a11y` | `/review-a11y`, "review accessibility" |

## Data Store

```
.epost-data/a11y/
├── fixes/
│   ├── findings/     ← audit-a11y reports (audit-YYMMDD-HHMM.json)
│   ├── patches/      ← fix-a11y diffs (finding-{id}-YYMMDD.diff)
│   └── reviews/      ← review-a11y reports (review-YYMMDD-HHMM.json)
├── README.md
├── analysis.md       ← trend summary
└── known-findings.json (v1.3 schema)
```

Schema: `.claude/assets/known-findings-schema.json`
Each finding: `id`, `platform`, `wcag`, `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority` (1–3), `resolved`, `resolved_date`, `fix_applied`, `source`, `first_detected_date`.

On first run, any a11y command creates missing directories and copies `README.md` from assets template.

See `data-store` skill for directory convention and gitignore rules.
