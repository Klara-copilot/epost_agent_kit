# Description Validation Checklist

Validate a skill's `description:` field before publishing. All 7 checks must pass.

## The 7-Point Checklist

| # | Check | Pass | Fail |
|---|-------|------|------|
| 1 | **Trigger phrasing** — starts with "Use when..." (third-person) | `Use when user says "plan"...` | `This skill plans your feature...` |
| 2 | **Concrete triggers** — 2+ quoted trigger examples | `"plan", "design this"` | `when the user wants to plan` |
| 3 | **No workflow summary** — no steps, tools, or sequence | triggers only | `checks sources, then calls API` |
| 4 | **Character limit** — under 1024 chars total | ≤ 1024 | anything longer |
| 5 | **Quoted user phrases** — at least 2 literal phrases in quotes | `"commit"`, `"ship it"` | `commit or push commands` |
| 6 | **Third-person voice** — "Use when user says..." not "I will..." | `Use when user says...` | `I will help you debug...` |
| 7 | **Outcome signal** — states what domain/agent it covers, not how | `runs the appropriate workflow` | `calls agent, reads files, outputs plan` |

## Good vs Bad Examples

### BAD — Description Trap (summarizes workflow)
```yaml
description: "Reads your codebase, calls the planner agent, generates phases, writes plan.md"
```
Model sees the full workflow in the description → skips the skill body. All the detail is "already there."

### GOOD — Trigger-only
```yaml
description: (ePost) Use when user says "plan", "design this", "how should we build", or "create a roadmap" — produces a phased implementation plan scaled to task complexity
```
Model reads this → learns WHEN to trigger. Reads the body → learns HOW.

### BAD — Behavior description (no trigger phrases)
```yaml
description: Autonomously improves a single measurable metric over N iterations with automatic keep/discard
```
Describes behavior, not conditions. Model won't know when to trigger this.

### GOOD — Behavior converted to trigger
```yaml
description: (ePost) Use when user wants to improve a metric like "test coverage", "bundle size", or "lint errors" over multiple iterations — runs autonomous improvement loop with keep/discard per cycle
```

## Common Fail Patterns

| Pattern | Why it fails | Fix |
|---------|-------------|-----|
| Starts with "This skill..." | Not trigger-phrasing | Rewrite as "Use when..." |
| Quotes only in body, none in description | Fails check 5 | Add `"phrase"` examples |
| Contains "first", "then", "finally" | Workflow steps leaked in | Remove sequence words |
| Longer than ~200 chars | Often means workflow leak | Trim to triggers only |
| Missing `(ePost)` prefix | Not a fail for correctness, but inconsistent for ecosystem skills | Add prefix |
| Uses "I will..." | Wrong voice | Change to "Use when user says..." |

## Quick Fix Template

```yaml
description: (ePost) Use when user says "TRIGGER1", "TRIGGER2", or "TRIGGER3" — OUTCOME_SIGNAL
```

Where:
- `TRIGGER1/2/3` = literal phrases users say (in quotes)
- `OUTCOME_SIGNAL` = what domain or capability is activated (not the steps)

## Character Count Check

```bash
echo -n "your description here" | wc -c
```

Target: under 500 chars. Hard limit: 1024 chars (agentskills.io enforced).
