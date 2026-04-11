---
phase: 1
title: Confidence Engine
effort: 1.5d
depends: []
---

# Phase 1 — Confidence Engine

## Context

Extend existing `code-review` skill output with `(severity, confidence, confirmed_by)` tuple per finding. Cross-cuts all review layers. Without this, Phases 2 and 3 cannot filter noise from blocking vs informational.

## Overview

- Add confidence metadata to finding schema
- Define source-based confidence assignment
- Add 2-pass consensus protocol (conditional)
- Define filter thresholds for blocking vs informational

## Requirements

### Finding Schema Extension

Every finding emitted by `code-review` MUST include:

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

### Confidence Assignment Rules

| Source | confidence | confirmed_by |
|--------|-----------|--------------|
| Deterministic rule / lint / AST | 1.0 | 1 |
| LLM single-pass | 0.5 | 1 |
| LLM 2-pass consensus (both agree) | 0.8 | 2 |
| LLM 3-pass consensus (all agree) | 0.95 | 3 |
| LLM 2-pass conflict (only 1 agrees) | 0.3 | 1 (drop or mark informational) |

### 2-Pass Consensus Protocol

- Run LLM review pass 1 → emit findings with `confidence: 0.5`
- For findings with `severity >= 4`, run pass 2 with independent prompt framing
- If pass 2 surfaces the same finding (matching file/line/category) → `confidence: 0.8, confirmed_by: 2`
- If pass 2 does NOT confirm → `confidence: 0.3` → drop from blocking, keep informational
- Skip pass 2 for `severity < 4` (cost optimization — risk R1 mitigation)

### Filter Thresholds

- **Blocking**: `confidence >= 0.8 AND severity >= 4 AND confirmed_by >= 2`
- **Informational**: `confidence >= 0.5 AND severity >= 2`
- **Dropped**: everything below informational

### Context Scoping Requirement

Every LLM review prompt MUST inject: language + framework + platform (from file extension detection). Research shows 25% FP reduction with explicit scope hints.

## Files to Change

- **Create**: `packages/core/skills/code-review/references/confidence-scoring.md` — full spec of scoring rules, thresholds, 2-pass protocol
- **Modify**: `packages/core/skills/code-review/references/code-known-findings-schema.md` — add `severity`, `confidence`, `confirmed_by`, `source` fields to schema
- **Modify**: `packages/core/skills/code-review/SKILL.md` — add "Confidence Scoring" section linking to reference; add filter rule to output section
- **Modify**: `packages/core/skills/code-review/references/report-template.md` — update report template with new fields

## Validation

- [ ] Schema doc lists all 4 new fields with types and ranges
- [ ] SKILL.md references confidence-scoring.md
- [ ] Run `/review` on a sample PR → verify output includes new fields
- [ ] Run same review twice → verify `confirmed_by` increments correctly on match
- [ ] Verify existing report template still validates (no broken tests)
- [ ] Lint/kit-verify passes

## Success Criteria

- Every finding in a fresh `/review` run has non-null `severity`, `confidence`, `confirmed_by`
- Filter logic documented and testable
- Backward compat: consumers that ignore new fields still work
