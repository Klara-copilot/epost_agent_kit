# Predict Mode (`--predict`)

3-persona expert debate protocol. Stress-tests the approach before generating phases.

## When to Use

- 3+ interacting systems will be changed
- Existing public API contract is being modified
- Migration or breaking change is in scope
- User expresses uncertainty ("should we", "is this the right approach")

## The 3 Personas

| # | Persona | Role |
|---|---------|------|
| 1 | Optimist | Argues for the approach's strengths and upside |
| 2 | Skeptic | Challenges assumptions, points out what could go wrong |
| 3 | Pragmatist | Focuses on implementation cost and timeline reality |

## Debate Protocol

1. State the proposed approach in one sentence.
2. Each persona gives a 2-3 sentence argument (in order: Optimist → Skeptic → Pragmatist).
3. Skeptic responds to Optimist's strongest point (one sentence rebuttal).
4. Synthesis: identify top concern and top strength.
5. **Decision**: `proceed` | `revise` | `escalate`

- `revise` → update the approach before generating phases
- `escalate` → surface unresolved debate to user with a single question

## Output Format

```markdown
## Predict Analysis

**Approach**: [one sentence]

**Optimist**: ...
**Skeptic**: ...
**Pragmatist**: ...

**Skeptic rebuttal**: ...

**Top concern**: [from synthesis]
**Top strength**: [from synthesis]
**Decision**: proceed | revise | escalate
```
