# Consensus-Voting Pattern

Multiple agents independently analyze the same problem, then vote or compare outputs before a decision is made. Used for high-stakes, irreversible choices.

## When to Use

| Use | Do Not Use |
|-----|-----------|
| Architecture decisions (tech stack, data model) | Routine tasks with a single correct answer |
| Security approach (auth model, encryption scheme) | CRUD operations, bug fixes with clear root cause |
| Framework or library choice | Low-risk, easily-reversible decisions |
| Irreversible data model changes | Tasks where one expert is sufficient |

## The Pattern

1. **Dispatch N agents** with the same problem statement and constraints — independently, no cross-reading
2. **Collect outputs** — each agent returns: recommendation + rationale + key risks
3. **Orchestrator compares** — look for: agreement, disagreement points, unique risks raised
4. **Apply aggregation rule** — see below
5. **Decide + document** — record winning recommendation and the dissenting risks that influenced it

## Aggregation Rules

| Decision type | Rule |
|--------------|------|
| Binary choice (A or B) | Majority vote (2/3 or 3/3); if tie, weight by agent confidence |
| Nuanced trade-off | Weighted merge — extract best-rated aspects from each agent's output |
| High-risk (irreversible) | Require consensus (unanimous) or escalate to user |
| Risk identification | Union of all risks raised (no vote needed — more risks = better) |

## Example: Library Choice

```
Problem: Choose a state management library for a Next.js 14 app.

Dispatch:
  Agent A (researcher): evaluate Zustand vs Redux Toolkit on bundle size, learning curve
  Agent B (researcher): evaluate same options on team fit and long-term maintenance

Outputs:
  Agent A: Zustand — lighter, simpler API, sufficient for scope
  Agent B: Redux Toolkit — existing team knowledge, better devtools, audit trail

Aggregation: 1-1 split → escalate to user with both rationales
```

## Cost Warning

Consensus voting costs ~N× the token budget. Only justified for:
- Decisions that can't be reversed in < 1 sprint
- Changes with downstream team impact
- Security or compliance choices

For all other decisions, use a single expert agent.

## Integration with SDD

When using subagents-driven for parallel phases, consensus voting applies **before** phase execution begins — use it to validate architecture decisions in the plan, not during implementation.
