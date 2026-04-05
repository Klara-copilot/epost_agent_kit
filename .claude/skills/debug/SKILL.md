---
name: debug
description: "(ePost) Use when: \"debug\", \"trace this\", \"diagnose\", \"it crashes\", \"why is this failing\", or user provides a stack trace. Investigates root cause using platform-specific debugging tools."
argument-hint: "[issue description or error log]"
user-invocable: true
context: fork
agent: epost-debugger
metadata:
  tier: core
  agent-affinity:
    - epost-debugger
    - epost-fullstack-developer
  keywords:
    - debug
    - error
    - bug
    - troubleshoot
    - root-cause
    - stack-trace
    - logging
    - crash
    - exception
    - fix
  platforms:
    - all
  connections:
    enhances: [fix, fix-deep, fix-ci, fix-ui]
  triggers:
    - /debug
    - error
    - bug
    - crash
    - exception
---

## Delegation — REQUIRED

This skill MUST run via `epost-debugger`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/debug`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Debug — Unified Debug Command

Debug platform-specific issues with automatic platform detection.

## Platform Detection

Detect platform per `skill-discovery` protocol.

## 5-Step Diagnosis Protocol

1. **Understand** — What is the symptom? What is the expected vs actual behavior?
2. **Reproduce** — Can it be reproduced? Minimal reproduction case?
3. **Isolate** — Narrow to the smallest failing unit (file, function, line)
4. **Analyze** — Read stack trace top-down, identify root cause frame; use 5 Whys or bisection
5. **Hypothesize & Verify** — Propose fix, apply, confirm it resolves without regressions

> **IRON LAW: NO FIXES WITHOUT ROOT CAUSE FIRST.**
> Applying a fix before identifying root cause is not debugging — it is guessing. Guesses compound into technical debt.

## Escalation Rules

| Situation | Action |
|-----------|--------|
| Root cause unclear after 3 hypotheses | Escalate to user with evidence |
| Fix applied but symptom persists | Re-diagnose from Step 1 |
| State machine bug suspected | Use state diagram overlay (see platform-debug-patterns.md) |

See `verification-before-completion` skill for anti-rationalization table, red flags, and verification gate.

## Trace Artifact Output

After root cause is identified, write a trace to `.epost-cache/traces/`:

```
File: .epost-cache/traces/{YYMMDD-HHMM}-{slug}.json
```

```json
{
  "schema": "1.0",
  "agent": "epost-debugger",
  "timestamp": "<ISO 8601>",
  "type": "debug-trace",
  "data": {
    "rootCause": "<one-sentence description>",
    "filesInvestigated": ["path/to/file.ts", "..."],
    "callChain": ["entryPoint", "calledFn", "crashSite"],
    "fix": "<recommended fix or 'see report'>"
  }
}
```

See `core/references/artifact-persistence-protocol.md` for envelope format and cleanup rules.

## Status Tracking

After diagnosing, update `{plan_dir}/status.md` if diagnosing relates to an active plan:
- **Bug found**: Add to **Known Bugs**: `- {what is broken} — {root cause}`
- **Architecture discovery**: Add to **Architecture Reference**
- **Decision forced by diagnosis**: Add to **Key Decisions**: `| {today} | {decision} | {rationale} |`
- If no status.md exists (debug is not plan-related), skip this step

## Sub-Skill Routing

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Fix broken code | `fix` | `/fix`, "fix this", error/crash/failing |
| Fix deeply | `fix-deep` | `/fix-deep`, complex multi-file bugs |
| Fix CI pipeline | `fix-ci` | `/fix-ci`, CI/CD failures, build pipeline |
| Fix UI issues | `fix-ui` | `/fix-ui`, visual bugs, layout broken |

## References

- `references/platform-debug-patterns.md` — platform-specific tools and log locations: Web/TS/React, iOS/Swift, Android/Kotlin, Backend/Java; state machine tracing; defense-in-depth patterns; root cause analysis techniques
- `references/debugging-flow.dot` — authoritative debugging process flowchart
- `references/condition-based-waiting.md` — patterns for replacing `sleep()` with condition polling

### Related Skills
- `knowledge` — Knowledge storage, retrieval, and post-task capture (`knowledge --capture`)
- `error-recovery` — Error handling and recovery patterns
- `verification-before-completion` — Verify fixes before claiming done

<issue>$ARGUMENTS</issue>

**IMPORTANT:** Analyze the skills catalog and activate needed skills for the detected platform.
