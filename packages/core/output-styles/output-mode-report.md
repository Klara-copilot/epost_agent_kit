# Report Mode

## Purpose

Structured task completion format for agent outputs. Does NOT override communication tone — defers to CC's native `/output-style`. Adds mandatory structure for status, findings, and risks.

## Mandatory Structure

```
**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
**Agent:** [name]
**Summary:** [1-2 sentences — what was completed]

### Findings
- [key outcome, decision, or file changed]
- ...

### Risks / Follow-up
- [if any — omit section entirely if none]
```

## Rules

- Always open with the Status line — never bury it
- Findings: bullet list only, no prose paragraphs
- Risks: only real risks, not observations or FYIs
- If BLOCKED or NEEDS_CONTEXT: include specific blocker in Summary, not in Risks
