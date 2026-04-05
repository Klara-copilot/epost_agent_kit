---
name: error-recovery
description: "(ePost) Use when operations fail transiently — \"timeout\", \"retry\", \"circuit breaker\", \"network error\", \"graceful degradation\". Applies resilience patterns: retries, backoff, circuit breakers, graceful degradation."
metadata:
  agent-affinity: [epost-fullstack-developer, epost-debugger, epost-tester]
  keywords: [error, retry, fallback, circuit-breaker, backoff, resilience, failure, exponential, degradation]
  platforms: [all]
  triggers: [error, exception, timeout, retry, fallback]
  connections:
    enhances: [debug]
---

# Error Recovery Skill

Standardized patterns for robust error handling in agent execution.

## When to Use

- Network requests that may timeout or fail
- External API calls with intermittent issues
- File operations on unreliable storage
- Multi-step workflows where individual steps can fail
- Agent delegation with potential cascade failures

## Pattern Decision Table

| Scenario | Strategy | Max Retries | Backoff |
|----------|----------|-------------|---------|
| Network request | Retry | 3 | Exponential (1s, 2s, 4s) |
| External API | Retry + Circuit Breaker | 3 | Exponential |
| File read/write | Retry | 2 | Linear (500ms, 1s) |
| Agent delegation | Circuit Breaker + Fallback | 1 | None |
| Implementation retry | Mutation Discipline | 2 | None (change approach) |
| User input validation | Fail Fast | 0 | None |
| Missing dependency | Fail Fast | 0 | None |

## Core Patterns (summary)

**Retry with Exponential Backoff** — loop with `Math.pow(2, attempt) * 1000ms` delay; check `isRetriable(error)` before each retry.

**Circuit Breaker** — CLOSED → OPEN after N failures → HALF_OPEN after timeout → CLOSED on success. Prevents cascade failures.

**Fallback** — wrap primary in try/catch; call fallback only when `condition(error)` is true. Log fallback activation.

**Fail Fast** — validate input/deps before any operation; throw immediately, never retry non-retriable errors.

**Graceful Degradation** — catch and return safe default (empty list, cached value, disabled feature) for non-critical paths.

**Error Mutation Discipline** — each retry MUST change approach (algorithm, scope, tool, or strategy). Same approach repeated = not a retry, it's a loop. Escalate after 2 failed mutations.

## When to Fail Fast

Do NOT retry:
- Invalid input (schema validation failures)
- Missing required dependencies
- Authentication/authorization errors
- Logical errors in code
- Data corruption

## References

- `references/resilience-patterns.md` — full code examples: retry/backoff (JS + Java), circuit breaker with state diagram, fallback, fail fast, graceful degradation, combined pattern; agent-specific guidelines; best practices

### Related Skills
- `debug` — Systematic debugging methodology and root cause analysis
- `knowledge` — Persist error patterns and recovery strategies (`knowledge --capture`)
