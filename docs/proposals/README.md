# Skill Evolution Proposals

This directory is the staging area for AI-driven skill improvement proposals.
Nothing in this directory auto-applies — every change requires explicit human approval.

## Workflow

```
journal entry / audit report
         ↓
  extract-signals.cjs
         ↓
   signals.json (new)
         ↓
  /plan --evolve  (agent generates proposals)
         ↓
  {skill}-{YYMMDD}.md (pending)
         ↓
  epost-kit proposals --approve <id>
         ↓
  packages/{pkg}/skills/{skill}/SKILL.md updated
         ↓
  epost-kit init  (sync to .claude/)
```

## Signal Types

| Type | Description | Confidence Threshold |
|------|-------------|---------------------|
| `journal-flag` | "What almost went wrong" section names a skill gap | 2+ occurrences → medium |
| `audit-failure` | Audit report records a FAIL verdict with root cause | 3+ occurrences → high |
| `workaround` | Journal uses "workaround:", "used X instead of Y" | 2+ occurrences → medium |

Single-occurrence signals default to `low` confidence. Low-confidence signals are surfaced
but do not auto-promote to proposals.

## Confidence → Action

| Confidence | Action |
|------------|--------|
| high | Listed prominently in `epost-kit proposals` |
| medium | Listed normally |
| low | Shown with `--all` flag only |

## Proposal Frontmatter

```yaml
---
id: prop-{skill}-{YYMMDD}
targetSkill: {skill-name}
targetFile: packages/{package}/skills/{skill}/SKILL.md
signal: {signal-id}
confidence: high | medium | low
status: pending | approved | rejected
created: YYYY-MM-DD
old_string: "exact text to replace in SKILL.md"
new_string: "replacement text"
---
```

`old_string` / `new_string` are used by `epost-kit proposals --approve` to apply the change.
They must be exact matches to the current SKILL.md content.

## Trigger Signal Extraction

**Manual (recommended for Phase 1):**
```bash
node .claude/scripts/extract-signals.cjs
```

**Auto (runs on session end):**
Configured in `.claude/settings.json` Stop hook — runs silently.

## Files in This Directory

- `signals.json` — Current signal registry (generated, do not edit manually)
- `README.md` — This file
- `{skill}-{YYMMDD}.md` — Individual proposal files (human-reviewable)
