# CSO: Cognitive Skill Optimization

Principles for writing skill descriptions that reliably trigger and whose bodies are followed.

---

## The Description Trap

A description that summarizes the workflow causes Claude to skip the skill body entirely — the model sees the full workflow in the description and treats the body as redundant.

**Rule**: Description = triggering conditions ONLY. Never workflow steps.

---

## Official Description Formula

From Anthropic's official guide (January 2026):

```
[When to use it (trigger phrases)] + [What it does] + [Key capabilities]
```

Front-load the trigger conditions. The description is truncated to 250 chars in the slash-command listing — what appears first determines whether Claude recognizes the skill.

---

## Good vs Bad Examples (epost-kit domain)

### Backend testing skill

```yaml
# Good — trigger phrases first, domain signal clear
description: "(ePost) Use when writing backend tests, adding Arquillian integration tests, configuring JaCoCo coverage, or setting up Weld CDI unit tests. Jakarta EE 8 testing patterns — Arquillian, Weld-JUnit, RestAssured, JaCoCo."

# Bad — no triggers
description: "Comprehensive backend testing reference."

# Bad — technical jargon, not user-facing
description: "Arquillian micro-deployment patterns for WildFly 26.1."
```

### iOS testing skill

```yaml
# Good — what users say + file/framework signals
description: "(ePost) Use when writing iOS unit tests, XCUITest E2E flows, Swift Testing @Test macros, or diagnosing test flakiness on iOS. XCTest and XCUITest patterns for Swift 6 / iOS 18+."

# Bad — no triggers
description: "iOS test infrastructure reference."
```

### Generic workflow skill

```yaml
# Good — includes what users actually type
description: "(ePost) Use when user says 'plan', 'design this', 'how should we build', or 'create a roadmap' — produces a phased implementation plan scaled to task complexity."

# Bad — describes behavior, not conditions
description: "Autonomously improves a single measurable metric over N iterations with automatic keep/discard."
```

---

## Debugging a Skill That Won't Trigger

Ask Claude: "When would you use the [skill-name] skill?"

Claude quotes the description back. The answer tells you exactly what's missing. If Claude says "I'd use it for general reference purposes" — you have a vague description. If it can't name user phrases, add them.

---

## Discipline Skill Requirements

Skills that enforce behavioral guardrails (verification, testing, review) MUST include:

1. **Iron Law block** — non-negotiable rule stated explicitly at the top
2. **Anti-Rationalization table** — rows for each common excuse the model might use to skip the rule
3. **Red Flags list** — signals that the model is about to violate the rule

Without these, models find and exploit vague instructions.

---

## Description Validation — 7-Point Checklist

Before publishing a skill, all 7 must pass:

- [ ] Starts with "Use when..." or equivalent trigger phrasing (third-person)
- [ ] Contains at least 2 quoted trigger examples users would actually say
- [ ] Does NOT describe steps, tools used, or sequence (no workflow summary)
- [ ] Under 1024 chars total
- [ ] At least 2 explicit user-facing phrases in quotes
- [ ] Uses "Use when user says..." not "I will..." or "This runs..."
- [ ] States what domain or agent it covers, not the implementation details

See `../../../skill-creator/references/description-validation-checklist.md` for full examples and fail patterns.

---

## Common Fail Patterns

| Pattern | Why it fails | Fix |
|---------|-------------|-----|
| Starts with "This skill..." | Not trigger-phrasing | Rewrite as "Use when..." |
| No quoted user phrases | Fails check 5 | Add `"phrase"` examples |
| Contains "first", "then", "finally" | Workflow steps leaked in | Remove sequence words |
| Describes the output format | Workflow leak | State domain, not steps |
| Too long (>500 chars) | Often means workflow leak | Trim to triggers only |
| Missing `(ePost)` prefix | Inconsistent in ecosystem | Add prefix |

---

## Related

- `ARCH-0004-skill-authoring-ground-truth.md` — canonical ground truth (official spec + kit extensions)
- `../../../skill-creator/references/cc-skill-spec.md` — Anthropic's authoritative CC skill spec
- `../../../skill-creator/references/epost-skill-authoring-standards.md` — ePost conventions layered on top
- `../../../skill-creator/references/description-validation-checklist.md` — 7-point checklist with fail patterns
