# CSO Principles for Skill Development

Cognitive Skill Optimization (CSO) is a set of principles for writing skills that models actually follow, rather than skim and summarize.

## The Description Trap

**Problem:** If a skill's `description:` field summarizes the workflow, the model follows the summary and skips the skill body entirely.

**Rule:** Description = triggering conditions ONLY. Never summarize the process.

### Bad Descriptions (Workflow Leak)

```yaml
# BAD — summarizes the workflow, model will skip body
description: "Use for TDD — write test first, watch it fail, write minimal code, refactor"
description: "Debug by reproducing the issue, tracing root cause, then applying fix"
description: "Review code for security, performance, and correctness issues"
```

### Good Descriptions (Trigger Only)

```yaml
# GOOD — describes WHEN to activate, not WHAT to do
description: "Use when implementing any feature or bugfix, before writing code"
description: "Use when encountering errors, crashes, or unexpected behavior"
description: "Use when receiving code review feedback or processing reviewer comments"
```

### Description Checklist

- [ ] Contains ONLY triggering conditions (when/who/what-situation)
- [ ] Does NOT contain verbs describing the workflow steps
- [ ] Includes keyword coverage: error messages, symptoms, synonyms
- [ ] Under 200 characters
- [ ] Uses third-person phrasing: "Use when..." not "This skill does..."

## Keyword Coverage

Descriptions should include terms users actually say:
- Error messages they'd paste
- Symptoms they'd describe ("slow", "broken", "crash")
- Tool names they'd reference
- Synonyms ("fix" = "repair" = "resolve" = "patch")

## Token Efficiency Guidelines

| Skill Type | Target Word Count | Rationale |
|------------|------------------|-----------|
| Getting-started / setup | < 150 words | One-time use, minimal body |
| Frequent / background | < 200 words | Loaded often, keep lean |
| Process / workflow | < 500 words | Complex but still concise |
| Reference (disable-model-invocation) | Unlimited | Read on demand only |

Move anything beyond these limits to `references/`.

## Anti-Rationalization in Skills

Every discipline skill should close loopholes explicitly. Models find workarounds to vague instructions.

### Required Elements for Discipline Skills

1. **Iron Law block** — One-sentence absolute rule in a blockquote
2. **Common Rationalizations table** — Rationalization → Reality → Required Action
3. **Red Flags list** — Observable behaviors that indicate the rule is being violated
4. **Foundational principle** — "Violating the letter of the rules IS violating the spirit"

### Writing Anti-Rationalization Tables

Each row must:
- Quote a specific phrase the model would generate ("Should work now")
- State why it's wrong ("'Should' is not evidence")
- Give an unambiguous action ("Run the test suite")

Do NOT write vague rows like "Being overconfident → Be careful → Think more." Every row must produce a specific, observable action.

## Spirit vs. Letter Principle

> Violating the letter of the rules IS violating the spirit. There are no clever workarounds that preserve the intent while skipping the steps.

This line should appear in every discipline skill. It preempts the model's tendency to find "technically compliant" shortcuts.

## Cross-References

- `references/persuasion-principles.md` — Psychological foundations for why these techniques work (when available)
- `references/skill-authoring-guide.md` — General skill creation process
- `references/skill-structure.md` — Directory layout and progressive disclosure
