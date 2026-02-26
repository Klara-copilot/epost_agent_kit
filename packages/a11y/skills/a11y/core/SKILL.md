---
name: a11y/core
description: WCAG 2.1 AA cross-platform accessibility foundation — POUR framework, severity scoring, known-findings database, and operating modes
user-invocable: false
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
| `.swift`, `.xib`, SwiftUI | iOS | `ios/a11y` |
| `.kt`, Compose | Android | `android/a11y` |
| `.tsx`, `.jsx`, HTML, CSS | Web | `web/a11y` |

If no signal, ask the user.

## Operating Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Guidance** | `/review:a11y`, direct questions | Human-readable examples, no file writes |
| **Audit** | `/audit:a11y` | JSON-only output, read-only (no Write/Edit) |
| **Fix** | `/fix:a11y`, `/fix:a11y-batch` | JSON status + code edits, surgical changes only |
| **Close** | `/audit:a11y-close` | Update known-findings DB, JSON confirmation |

## Known-Findings Database

Location: `.epost-data/a11y/known-findings.json` (v1.2 schema)

Each finding has: `id`, `platform`, `wcag`, `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority` (1–3), `resolved`, `resolved_date`.

Schema: `.claude/assets/known-findings-schema.json`
