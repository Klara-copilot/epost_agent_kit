# Persuasion Principles for Skill Authoring

Understanding WHY enforcement techniques work helps skill authors apply them systematically. These principles are adapted from influence research (Cialdini 2021, Meincke et al. 2025) applied to LLM instruction-following.

## Authority Principle

Models follow instructions that signal authority and certainty.

**Techniques:**
- Imperative language: "YOU MUST", "NEVER", "ALWAYS"
- Iron Law blocks in blockquotes (visual authority signal)
- Specific, unambiguous actions over vague guidance
- "No exceptions" — closes the "but in this case..." loophole

**Example:**
```markdown
> **IRON LAW: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**
```

**Anti-pattern:** "You should try to verify when possible" (hedging invites non-compliance)

## Commitment Principle

Once a model explicitly acknowledges a rule, it's more likely to follow it.

**Techniques:**
- Force explicit choices: "State which verification command you will run"
- Announce skill usage: "Activating [skill-name] for this task"
- TodoWrite tracking: externalize commitment as checkboxes
- Step-by-step gates: each step must complete before next begins

**Example:**
```markdown
## 5-Step Gate
1. IDENTIFY verification command
2. RUN it now
3. READ full output
4. VERIFY against requirements
5. THEN claim completion
```

## Scarcity / Urgency Principle

Temporal constraints create compliance pressure.

**Techniques:**
- "BEFORE proceeding..." — temporal gate
- "IMMEDIATELY after X..." — no gap for drift
- "FIRST, do Y..." — priority ordering
- "STOP and re-verify if..." — interrupt patterns

**Example:**
```markdown
BEFORE any completion claim, execute ALL five steps in order.
```

**Anti-pattern:** "At some point, you should verify" (no urgency, easily deferred)

## Social Proof Principle

Failure-mode documentation convinces models that the rules exist for good reason.

**Techniques:**
- Common Failures tables: "Every time X happens, Y follows"
- Anti-Rationalization tables: specific phrases → why they're wrong → what to do instead
- Red Flags lists: observable behaviors that indicate violation
- "The most common bug is the obvious one" (statistical framing)

**Example:**
```markdown
| Claim | Problem | Required Action |
|-------|---------|-----------------|
| "Tests pass" | Recalling old results | Run test suite NOW |
```

## Liking Principle — AVOID

The Liking principle creates sycophancy in LLMs. Do NOT use:
- Praise for following rules ("Great job verifying!")
- Friendly framing ("Let's try to remember to...")
- Emotional appeals ("It would be really helpful if...")

Instead: state facts, give commands, provide evidence-based consequences.

## Applying These Principles

When writing a new discipline skill:

1. **Authority**: Write one Iron Law in a blockquote
2. **Commitment**: Create a numbered gate (steps that must execute in order)
3. **Scarcity**: Add temporal constraints (BEFORE, FIRST, IMMEDIATELY)
4. **Social Proof**: Add Common Failures and Anti-Rationalization tables
5. **Avoid Liking**: Remove all hedging, praise, and emotional language

## Cross-References

- `references/cso-principles.md` — CSO methodology for skill descriptions and body structure
- `references/skill-authoring-guide.md` — General skill creation process
