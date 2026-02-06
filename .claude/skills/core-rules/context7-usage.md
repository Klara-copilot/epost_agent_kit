# Context7 Usage

## Purpose

Rules governing when and how Context7 MCP may be used as a secondary reasoning aid without overriding repository rules.

## Table of Contents

- [Allowed Usage](#allowed-usage) — Line 15
- [Forbidden Usage](#forbidden-usage) — Line 35
- [Conflict Resolution](#conflict-resolution) — Line 50
- [Labeling Requirements](#labeling-requirements) — Line 65

## Allowed Usage

**Context7 may be used for:**
- Validating architectural reasoning
- Cross-checking common pitfalls
- Improving clarity or safety of rules
- Understanding library/framework patterns (when aligning with repo rules)

**Use cases:**
- Verifying rule structure best practices
- Identifying potential ambiguity risks
- Confirming documentation patterns
- Understanding tool integration patterns

## Forbidden Usage

**Context7 must not:**
- Override repository rules
- Introduce new conventions or tooling
- Be treated as default "best practice"
- Replace repository-specific patterns
- Assume external standards apply

**Never use Context7 to:**
- Justify breaking repository rules
- Introduce frameworks not in use
- Override explicit project conventions
- Assume external patterns are better

## Conflict Resolution

**When Context7 conflicts with repository rules:**
1. **Reject Context7** and explain why
2. Prioritize repository rules as ground truth
3. Document the conflict for transparency
4. Propose alternatives aligned with repo rules

**Conflict detection:**
- Compare Context7 suggestions with existing rules
- Identify contradictions explicitly
- Choose repository rules when in doubt
- Explain reasoning to user

## Labeling Requirements

**When Context7 is used:**
- Explicitly label influence as **Context7-informed**
- Explain why it aligns with repository rules
- Show how it complements (not replaces) repo rules
- Maintain repository rules as primary authority

**Labeling format:**
```
Context7-informed: [insight] — aligns with [repo rule] because [reason]
```

**Never:**
- Present Context7 insights as primary authority
- Skip labeling when Context7 influenced decisions
- Mix Context7 advice with repo rules without distinction

## Related Documents

- `SKILL.md` — Core rules index
- `decision-boundaries.md` — Authority limits
