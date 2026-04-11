---
name: confidence-scoring
description: "(ePost) Confidence scoring rules, 2-pass consensus protocol, and filter thresholds for code-review findings"
user-invocable: false
disable-model-invocation: true
---

# Confidence Scoring

Every finding emitted by `code-review` carries `(severity, confidence, confirmed_by, source)`. These fields drive Phase 2 (PR gate) and Phase 3 (branch scan digest) filtering. Without them, no automated layer can distinguish blocking issues from noise.

## Finding Fields

```json
{
  "id": "SEC-001",
  "file": "src/auth.ts",
  "line": 45,
  "severity": 4,
  "confidence": 0.8,
  "confirmed_by": 2,
  "source": "llm-2pass",
  "message": "..."
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `severity` | `integer` | 1–5 | 5 = critical, 4 = high, 3 = medium, 2 = low, 1 = informational |
| `confidence` | `float` | 0.0–1.0 | How certain the finding is correct |
| `confirmed_by` | `integer` | 1–3 | Number of independent passes that agreed on this finding |
| `source` | `string` | see enum | Origin of the finding |

### source enum

| Value | Meaning |
|-------|---------|
| `"deterministic"` | Lint rule, AST check, or static analysis — no LLM |
| `"llm-1pass"` | LLM single-pass review |
| `"llm-2pass"` | LLM 2-pass consensus (both agree) |
| `"llm-2pass-conflict"` | LLM 2-pass where only one pass flagged it |
| `"llm-3pass"` | LLM 3-pass consensus (all three agree) |

## Confidence Assignment Rules

| Source | `confidence` | `confirmed_by` |
|--------|-------------|----------------|
| Deterministic rule / lint / AST | 1.0 | 1 |
| LLM single-pass | 0.5 | 1 |
| LLM 2-pass consensus (both agree) | 0.8 | 2 |
| LLM 3-pass consensus (all agree) | 0.95 | 3 |
| LLM 2-pass conflict (only 1 agrees) | 0.3 | 1 |

## 2-Pass Consensus Protocol

Run 2-pass only when `severity >= 4` (cost optimization — R1 mitigation):

1. **Pass 1** — run review, emit findings with `confidence: 0.5, confirmed_by: 1, source: "llm-1pass"`
2. For each finding where `severity >= 4`:
   - **Pass 2** — re-run review with independent prompt framing (different role/framing, same diff context)
   - **Match** = same `file` + `line` (±2 tolerance) + same rule category
   - If pass 2 surface the same finding → `confidence: 0.8, confirmed_by: 2, source: "llm-2pass"`
   - If pass 2 does NOT confirm → `confidence: 0.3, confirmed_by: 1, source: "llm-2pass-conflict"` → demote to informational
3. Skip pass 2 for `severity < 4`

### Context Scoping Requirement

Every LLM review prompt MUST inject:

```
Language: {detected from file extension}
Framework: {detected from imports/config}
Platform: {web | ios | android | backend}
```

Research shows 25% false-positive reduction with explicit scope hints. Omitting this context is a quality regression.

## Filter Thresholds

| Tier | Criteria | Action |
|------|----------|--------|
| **Blocking** | `confidence >= 0.8 AND severity >= 4 AND confirmed_by >= 2` | Fail PR gate, surface in digest as 🔴 |
| **Informational** | `confidence >= 0.5 AND severity >= 2` | Surface in digest as 🟡, do not block |
| **Dropped** | Everything below informational | Omit from report |

## Backward Compatibility

Consumers that do not read `confidence`, `severity` (numeric), `confirmed_by`, or `source` continue to work — these are additive fields.

The string `severity` field in `code-known-findings-schema.md` (`"critical"`, `"high"`, etc.) is preserved alongside the new numeric `severity` integer. The integer is used for threshold comparisons; the string is used for human-readable reports.

## Usage by Downstream Layers

- **Phase 2 (PR gate)**: reads `confidence` and numeric `severity` to decide whether to block or comment-only
- **Phase 3 (branch scan)**: aggregates `severity` and `confidence` per branch, emits Slack digest with counts per tier
- **Regression scan**: `confidence` and `confirmed_by` used to weight recurrence signals
