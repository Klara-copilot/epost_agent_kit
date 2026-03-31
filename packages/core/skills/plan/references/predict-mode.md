# Predict Mode (`--predict`)

5-persona expert debate protocol. Surfaces risks before implementation via independent adversarial analysis.

## When to Use

- Major architectural decisions
- Security-critical feature design
- Contested technical choices (multiple reasonable approaches)
- Any change where failure cost is high

## The 5 Personas

| Persona | Focus |
|---------|-------|
| Architect | System design, scalability, long-term maintainability, coupling |
| Security | Attack surface, auth, data exposure, injection vectors |
| Performance | Bottlenecks, latency, throughput, memory pressure |
| UX | User impact, accessibility, workflow disruption, confusion |
| Devil's Advocate | Challenges assumptions, questions the entire premise, proposes simpler alternatives |

## Workflow

### Step 1 — Brief Each Persona Independently

For each persona (in order, no cross-influence):
1. State the persona's lens explicitly
2. Analyze the proposed change through that lens
3. Produce: **Analysis** / **Concerns** / **Risks** / **Verdict** (GO / CAUTION / STOP)

### Step 2 — Conflict Resolution

When personas disagree, weight by context:
- Security concern in auth/payment feature → Security verdict wins
- Performance concern in batch/reporting feature → Performance verdict wins
- UX concern in consumer-facing feature → UX verdict wins
- Architecture concern for long-lived systems → Architect verdict wins
- Devil's Advocate raises simpler alternative → always explore before dismissing

### Step 3 — Consensus Verdict

Aggregate verdicts:
- All GO → **GO**
- Any STOP → **STOP**
- Mixed GO/CAUTION → **CAUTION**
- STOP from weighted persona (per context) → **STOP**

### Step 4 — Output

Produce the standard report format below.

## Output Format

```markdown
## Predict Analysis: [Change Description]

### Persona Verdicts
| Persona | Verdict | Top Concern |
|---------|---------|-------------|
| Architect | CAUTION | [one sentence] |
| Security | GO | [one sentence] |
| Performance | GO | [one sentence] |
| UX | CAUTION | [one sentence] |
| Devil's Advocate | CAUTION | [one sentence] |

### Conflicts
[Any disagreements and how resolved — or "None"]

### Consensus: CAUTION

### Top Risks
1. [Most critical risk]
2. [Second risk]
3. [Third risk]

### Recommendations
1. Before proceeding: [action]
2. During implementation: [constraint]
3. After completion: [verification]
```

## Verdict Definitions

| Verdict | Meaning |
|---------|---------|
| **GO** | No significant concerns. Proceed. |
| **CAUTION** | Concerns identified. Mitigate before or during implementation. |
| **STOP** | Blocking risk. Do not proceed until resolved. |
