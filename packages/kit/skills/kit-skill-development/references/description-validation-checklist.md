# Description Validation Checklist

Use this checklist when writing or reviewing skill `description:` fields.

## Quick Checklist

Copy into PR or review notes:

```
- [ ] Form: third-person ("This skill should be used when..." or "(ePost) Use when...")
- [ ] Length: ≤ 1024 characters
- [ ] Trigger keywords: contains quoted phrases users would say
- [ ] Dual purpose: describes BOTH what the skill does AND when to invoke it
- [ ] No workflow summary: description does NOT recap the skill body steps
- [ ] No vague language: no "helps with", "assists in", "general purpose", "smart"
```

## Rules

| Rule | Requirement |
|------|-------------|
| **Form** | Third-person required. Start with "This skill should be used when..." OR "(ePost) Use when..." |
| **Length** | Max 1024 characters (Claude frontmatter hard limit) |
| **Trigger keywords** | Must include specific phrases users would type — ideally quoted strings |
| **Dual purpose** | Must express both the situation (when) and the capability (what it handles) |
| **No workflow summary** | Do NOT list steps the skill body takes — this triggers the Description Trap |
| **No vague language** | Avoid: "helps with", "assists in", "general purpose", "smart hub", "auto-detects" as sole content |

## The Description Trap

When a description summarizes the skill's workflow, the model reads it and skips the body:

> "This skill creates a plan by analyzing tasks, breaking them into phases, estimating effort, and writing markdown."

The model thinks: "I already know what to do — skip the body." The body never runs.

**Fix**: Descriptions must list triggering conditions, NOT procedures.

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| `"Smart hub — auto-detects intent and routes"` | Summary, vague | `"Use when user says 'plan', 'fix', 'cook', or 'review' and context is ambiguous"` |
| `"Helps with accessibility issues"` | Vague, no keywords | `"Use when 'a11y', 'WCAG', 'VoiceOver', 'TalkBack', or 'screen reader' is mentioned"` |
| `"Orchestrates researcher → planner → developer pipeline"` | Workflow summary | `"Use when starting a new project or onboarding to an unfamiliar codebase"` |
| `"Use this when you need things done"` | No specificity | `"Use when user says 'implement', 'build', or 'add' and a platform file is present"` |
| `"General purpose documentation tool"` | Completely vague | `"Use when user asks to 'write docs', 'update docs', 'document this module'"` |

## Good / Bad Examples

### Example 1: cook skill

**Bad:**
```yaml
description: Implements features by detecting platform, loading the right skills, and executing the implementation plan.
```
Problem: Pure workflow summary. Model skips body.

**Good:**
```yaml
description: (ePost) Use when user says "implement", "build", "add a feature", "cook", or "continue the plan" — dispatches platform-aware feature implementation.
```

---

### Example 2: audit skill

**Bad:**
```yaml
description: Audit skill — runs UI, a11y, or code audits depending on context.
```
Problem: Too short, vague, summarizes routing.

**Good:**
```yaml
description: (ePost) Use when user asks to "audit", "check quality", "review before merge", or "run a11y audit" — detects audit type and dispatches the right specialist.
```

---

### Example 3: research skill

**Bad:**
```yaml
description: Helps researchers investigate topics using internal docs and external sources.
```
Problem: "Helps" is vague; "researchers" is circular; no trigger phrases.

**Good:**
```yaml
description: (ePost) Use when user asks to "research", "compare options", "find best practices", or "investigate a technology" — multi-source investigation using internal docs first, then external.
```

---

### Example 4: sequential-thinking skill

**Bad:**
```yaml
description: Applies structured sequential reasoning to decompose problems step by step.
```
Problem: Workflow summary with no trigger context.

**Good:**
```yaml
description: (ePost) Use when facing a complex problem that needs step-by-step breakdown, branching analysis, or iterative reasoning — activates structured problem decomposition.
```

---

## Length Reference

| Length | Status |
|--------|--------|
| < 200 chars | May lack trigger specificity — review |
| 200–600 chars | Ideal range |
| 600–1024 chars | Acceptable if content is dense (many trigger phrases) |
| > 1024 chars | **Rejected** — Claude truncates at hard limit |

## ePost Convention

Prefix `(ePost)` for all skills installed by epost-kit. This scopes the trigger and prevents collisions with third-party skills:

```yaml
description: (ePost) Use when...
```

## Related

- `references/cso-principles.md` — CSO (Cognitive Skill Optimization) principles
- `references/skill-structure.md` — Full anatomy and validation checklist
- `references/skill-authoring-guide.md` — Step-by-step creation guide
