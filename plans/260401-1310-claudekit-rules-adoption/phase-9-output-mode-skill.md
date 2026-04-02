---
phase: 9
title: "output-mode — 3-mode output style skill (Exec / Teach / Transparency)"
effort: 35m
depends: []
---

# Phase 9: Output Mode Skill

Replaces the previous 5-level `coding-level` concept with 3 distinct, opinionated output modes sourced from user-provided specs. Each mode has a fixed structure and mandatory rules — not just verbosity settings.

## Source Files

- `output-mode-1-transparency.md` — Transparency Mode (Level T)
- `output-mode-2-teacher.md` — Teacher Mode (Level Teach)
- `output-mode-3-efficient.md` — Efficient Mode (Level Exec)

## Files to Create / Modify

- `packages/core/skills/output-mode/SKILL.md` (create)
- `packages/core/skills/output-mode/references/exec.md` (create)
- `packages/core/skills/output-mode/references/teach.md` (create)
- `packages/core/skills/output-mode/references/transparency.md` (create)
- `packages/core/hooks/session-init.cjs` (modify — inject active output mode)
- `packages/core/package.yaml` (modify — add `output-mode` to provides.skills)

## Changes

### 1. output-mode/SKILL.md

```yaml
---
name: output-mode
description: Use when the user sets a communication style, requests "exec mode", "teach me", "show your reasoning", "transparency", or wants to change how Claude outputs.
version: 1.0.0
user-invocable: true
context: inline
---
```

Content:
```markdown
# Output Mode

Sets Claude's output structure for the session. Three modes — each has fixed sections and mandatory rules.

## Usage
```
/output-mode exec          # Efficient: outcome-focused, minimal
/output-mode teach         # Teacher: explain WHY, trade-offs, lessons
/output-mode transparency  # Full trace: every step, decision, routing
/output-mode reset         # Return to default (exec)
```

## Modes

| Mode | Key | When to use |
|------|-----|-------------|
| Efficient | `exec` | Execution, reporting, fast iteration |
| Teacher | `teach` | Learning, onboarding, understanding decisions |
| Transparency | `transparency` | Debugging agent routing, auditing decisions |

## Mode Details

See `references/exec.md`, `references/teach.md`, `references/transparency.md`.

## Session Persistence

Active mode stored via `EPOST_OUTPUT_MODE` env var, injected by `session-init.cjs` at session start.

Default: `exec`.

## Auto-detection Signals

Claude SHOULD auto-apply a mode without explicit command when:
- User asks "why did you…" or "show me your reasoning" → `transparency`
- User says "explain this to me" or "help me understand" → `teach`
- User says "just do it", "quick", "fast" → `exec`
- Explicit `/output-mode` always overrides auto-detection
```

### 2. references/exec.md

Content from `output-mode-3-efficient.md`:
```markdown
# Efficient Mode (exec)

## Mandatory Rules

**Signal**: Focus on outcome. Highlight risks. Remove noise.
**Structure**: Short sections. Bullet points. Status indicators.

## Output Structure

**Task — Status**

Agent: [name]
Flow: [brief]

### Output
### Status
### Notes
### Risks / Follow-up
```

### 3. references/teach.md

Content from `output-mode-2-teacher.md`:
```markdown
# Teacher Mode (teach)

## Mandatory Rules

**Teaching**: Explain WHY before WHAT. Show reasoning. Include alternatives. Connect system steps.
**Insight**: Include trade-offs. Highlight limitations. Provide expert insight.

## Output Structure

# Task Summary

## 1. What happened
## 2. Why this approach
## 3. Alternatives considered
## 4. System flow
## 5. Tools used
## 6. Trade-offs
## 7. Limitations
## 8. Expert insight
## 9. Reusable lesson
```

### 4. references/transparency.md

Content from `output-mode-1-transparency.md`:
```markdown
# Transparency Mode (transparency)

## Mandatory Rules

**Visibility**: Show input → interpretation → routing → execution → result.
Include: rule id, alternatives, confidence, agent, skill, args, timing, trace id.
**Structure**: Deterministic sections. Machine-readable blocks. No narrative.
**Debug**: Show alternatives. Show failures. Include trace id.

## Output Structure

[INPUT]
[INTERPRETATION]
[ROUTING]
[EXECUTION PLAN]
[AGENT]
[ARGS]
[RESULT]
[TIMING]
[TRACE ID]
```

### 5. session-init.cjs — Inject EPOST_OUTPUT_MODE

```javascript
const outputMode = process.env.EPOST_OUTPUT_MODE || 'exec';
const modeLabels = { exec: 'Efficient', teach: 'Teacher', transparency: 'Transparency' };
const modeLabel = modeLabels[outputMode] || 'Efficient';
console.log(`Output mode: ${outputMode} (${modeLabel}) — apply output structure from output-mode skill`);
```

## Todo

- [ ] Create `packages/core/skills/output-mode/` directory + references/
- [ ] Create `SKILL.md` with 3-mode table + auto-detection signals
- [ ] Create `references/exec.md` from efficient spec
- [ ] Create `references/teach.md` from teacher spec
- [ ] Create `references/transparency.md` from transparency spec
- [ ] Read session-init.cjs and add EPOST_OUTPUT_MODE injection
- [ ] Read package.yaml and add `output-mode` to provides.skills

## Success Criteria

- `/output-mode exec|teach|transparency|reset` all work
- Each mode has its own reference file with mandatory rules + output structure
- session-init.cjs injects mode at session start
- Auto-detection signals documented
- Default is `exec`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mode not persisted across tool calls | Medium | session-init injection covers session start |
| Transparency mode generates very long output | Medium | Mode is explicit — user opt-in only |
| Auto-detection conflicts with explicit set | Low | Explicit `/output-mode` always wins |

## Security Considerations

None — output structure only, no data or permissions affected.
