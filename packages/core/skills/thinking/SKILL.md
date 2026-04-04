---
name: thinking
description: "(ePost) Activates extended thinking for systematic hypothesis testing and deep analysis. Use when user says \"think deeply\", \"use extended thinking\", \"step-by-step analysis\", or when stuck after multiple failed attempts and needs systematic hypothesis testing"
user-invocable: false
metadata:
  category: workflow
  agent-affinity:
    - epost-debugger
    - epost-planner
    - epost-researcher
  connections:
    enhances:
      - debug
      - plan
      - research
  keywords:
    - stuck
    - spiral
    - complexity
    - assumption
    - hypothesis
    - analysis
    - framework
    - retry
    - failing
    - problem-solving
    - sequential
    - evidence
  triggers:
    - think deeply
    - extended thinking
    - step by step analysis
    - use systematic approach
---

# Thinking Frameworks

Two complementary frameworks. Choose by symptom.

---

## Framework A: Problem-Solving (when stuck or spiraling)

**Trigger:** 2+ failed attempts at the same problem. Stop before retrying — apply a framework first.

### Decision Table

| Symptom | Framework | First Action |
|---------|-----------|--------------|
| Same fix tried 3+ times | Assumption audit | List every assumption, challenge each |
| Problem grows with each fix | Complexity spiral | Simplify the problem, not the fix |
| Can't reproduce locally | Environment isolation | Strip to minimum reproducible case |
| Solution exists but breaks something else | Constraint mapping | Map all constraints explicitly |
| Problem is vague or undefined | 5-why | Ask "why" 5 times |

### Assumption Audit
```
What am I assuming is true? [list all]
What if assumption #N is wrong? [test each one]
Which assumption has the least evidence? [challenge that one first]
```

### Complexity Spiral Escape
1. What is the simplest version of this problem?
2. Can I solve that simpler version first?
3. What is the ONE thing blocking me right now?
4. Stop. Solve only that one thing.

### Constraint Mapping
- What MUST be true for any solution to work?
- What MUST NOT change?
- Given only those constraints — what is the simplest solution?

---

## Framework B: Sequential Thinking (for complex analysis)

**Trigger:** Complex analysis where linear thinking produces conflicting conclusions. Research requiring systematic evidence. Architectural decisions with high uncertainty.

### The Cycle
```
1. Hypothesis  — one falsifiable sentence: "I believe X is true"
2. Evidence    — collect 3–5 pieces (read code, run commands, search)
3. Test        — does evidence support or contradict the hypothesis?
4. Revise      — update hypothesis based on what you found
5. Repeat      — until 3 consecutive rounds produce consistent evidence
```

### Rules
- Hypothesis must be falsifiable — if you can't test it, restate it
- Each step must produce evidence, not speculation
- When hypothesis is contradicted → update it, never rationalize
- Stop when 3 consecutive rounds confirm the same conclusion
- Never proceed to implementation until hypothesis has passed 3 rounds

### Anti-Patterns
- Confirmation bias: collecting only evidence that supports what you already believe
- Premature implementation: moving to code before evidence is conclusive
- Absence fallacy: treating "no evidence against" as "evidence for"

---

## Choosing a Framework

| Starting state | Use |
|---------------|-----|
| Already tried something, it failed | Framework A (Problem-Solving) |
| Starting fresh but problem is complex | Framework B (Sequential Thinking) |
| Stuck in a loop, same fix keeps failing | Framework A — assumption audit |
| Need to understand before acting | Framework B — hypothesis cycle |
| Both apply | Start with B to understand, switch to A if you get stuck |
