---
phase: 10
title: "predict — 5-persona expert debate in plan + brainstorm (from ck:predict)"
effort: 30m
depends: []
---

# Phase 10: Predict Mode

Adapted directly from claudekit's `ck:predict` skill. Adds structured 5-persona debate before major architectural decisions. Wired into `/plan` and `/brainstorm`.

Source: `/Users/than/Projects/claudekit/.claude/skills/ck-predict/SKILL.md`
Attribution: Multi-persona prediction pattern adapted from autoresearch by Udit Goenka (MIT)

## Files to Modify

- `packages/core/skills/plan/SKILL.md`
- `packages/core/skills/plan/references/debate-mode.md` (update — already created by cook, align with ck:predict spec)
- `packages/core/skills/brainstorm/SKILL.md` (if exists)

## Changes

### 1. plan/SKILL.md — Add --debate flag

Add to flags table:
```markdown
| `--debate` | Run 5-persona expert debate before generating the plan |
```

Add step reference:
```markdown
When `--debate` is passed (or auto-triggered): see `references/debate-mode.md` before generating phases.
```

### 2. plan/references/debate-mode.md

Full content:

```markdown
# --debate Mode

Five expert personas independently analyze a proposed change, then debate conflicts to produce a consensus verdict before planning begins.

## When to Auto-trigger

Auto-trigger without explicit flag when:
- 3+ interacting systems will be changed
- Existing public API contract is being modified
- Migration or breaking change is in scope
- User expresses uncertainty ("should we", "is this the right approach")

## When NOT to Use

- Trivial or low-risk changes (use `--fast` instead)
- Already-approved work with no open design questions
- Pure dependency upgrades with no API changes

## The 5 Personas

| Persona | Focus | Core Questions |
|---------|-------|----------------|
| **Architect** | System design, scalability, coupling | Does this fit the architecture? Will it scale? What new coupling does it introduce? |
| **Security** | Attack surface, data protection, auth | What can be abused? Where is data exposed? Are auth boundaries respected? |
| **Performance** | Latency, memory, queries, bundle size | What is the latency impact? N+1 queries? Memory leaks? Bundle bloat? |
| **UX** | User experience, accessibility, error states | Is this intuitive? What does the error state look like? Accessible on mobile? |
| **Devil's Advocate** | Hidden assumptions, simpler alternatives | Why not do nothing? What is the simplest alternative? Which assumption could be wrong? |

## Debate Protocol

1. **Read** the proposed change/feature description
2. **Read relevant code** if file paths are available (grep for affected areas)
3. **Each persona analyzes independently** — do not let personas influence each other during this phase
4. **Identify agreements** — points where all (or 4+) personas align
5. **Identify conflicts** — points where personas meaningfully disagree
6. **Weigh tradeoffs** — for each conflict, evaluate which concern has higher impact
7. **Produce verdict** — GO / CAUTION / STOP with actionable recommendations

## Output Format

```
## Prediction Report: [proposal title]

## Verdict: GO | CAUTION | STOP

### Agreements (all personas align)
- [Point 1]
- [Point 2]

### Conflicts & Resolutions

| Topic | Architect | Security | Performance | UX | Devil's Advocate | Resolution |
|-------|-----------|----------|-------------|-----|-----------------|------------|
| [Issue] | [View] | [View] | [View] | [View] | [View] | [Recommendation] |

### Risk Summary

| Risk | Severity | Mitigation |
|------|----------|------------|
| [Risk] | Critical/High/Medium/Low | [Concrete action] |

### Recommendations
1. [Action — rationale]
2. [Action — rationale]
```

## Verdict Levels

| Verdict | Meaning |
|---------|---------|
| **GO** | All personas aligned, no critical risks — proceed with confidence |
| **CAUTION** | Concerns exist but are manageable — mitigations identified, proceed carefully |
| **STOP** | Critical unresolved issue — needs redesign or more information before proceeding |

### STOP Triggers (any one is sufficient)
- Security identifies auth bypass or data exposure with no viable mitigation
- Architect identifies fundamental design incompatibility requiring significant rework
- Performance identifies unacceptable latency or query explosion with no workaround
- Devil's Advocate exposes a false assumption that invalidates the entire approach
```

### 3. brainstorm/SKILL.md — Reference predict mode

Add to flags table:
```markdown
| `--debate` | Run 5-persona debate structure instead of open brainstorm |
```

Note: Check if `packages/core/skills/brainstorm/SKILL.md` exists before editing.

## Todo

- [ ] Read plan/SKILL.md fully before editing
- [ ] Add `--debate` to flags table
- [ ] Read existing debate-mode.md (created by cook) and replace with full ck:predict spec
- [ ] Verify 5-persona table is present (Architect/Security/Performance/UX/Devil's Advocate)
- [ ] Verify verdict is GO/CAUTION/STOP (not proceed/revise/escalate)
- [ ] Check if `packages/core/skills/brainstorm/SKILL.md` exists and add flag reference

## Success Criteria

- debate-mode.md has all 5 personas from ck:predict
- Verdict system is GO/CAUTION/STOP
- STOP triggers listed
- Auto-trigger conditions listed
- Conflicts & Resolutions table format present

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| cook already created debate-mode.md with wrong 3-persona content | High | Read-then-overwrite with correct spec |
| Brainstorm SKILL.md may not exist | Low | Check before editing; skip if absent |

## Security Considerations

None — analysis only, no file writes or external calls.
