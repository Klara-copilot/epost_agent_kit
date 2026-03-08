---
phase: 2
title: "Doctor health check for research engine"
effort: 1h
depends: [1]
---

# Phase 2 — Doctor Health Check for Research Engine

## Goal

Add a health check to `epost-kit doctor` that validates research engine prerequisites based on configured engine in `.epost-kit.json`.

## Tasks

### 2.1 Add research engine health check function

File: `src/domains/health-checks/health-checks.ts`

Add `checkResearchEngine(cwd: string)` function:

```ts
export async function checkResearchEngine(cwd: string): Promise<CheckResult> {
  // 1. Read .claude/.epost-kit.json (or target IDE dir) to get engine config
  // 2. If engine === 'websearch' → pass (no external deps)
  // 3. If engine === 'gemini' → check `gemini` binary exists (execa which gemini)
  // 4. If engine === 'perplexity' → check PERPLEXITY_API_KEY env var exists
  // 5. Return appropriate pass/warn/fail
}
```

Logic by engine:
- `websearch`: always pass ("Research engine: WebSearch (built-in)")
- `gemini`: check `which gemini` succeeds; warn if not found ("Gemini CLI not installed. Run: npm i -g @google/gemini-cli"). Also check auth: `gemini auth status` or `GEMINI_API_KEY` in env / `.claude/.env`.
- `perplexity`: check `PERPLEXITY_API_KEY` in env OR `.claude/.env`; warn if missing with hint: "Set via `epost-kit config` → Secrets → PERPLEXITY_API_KEY"
- No config / parse error: pass with info ("Research engine: not configured (defaults to websearch)")

For key presence checks: read `.claude/.env` if `process.env.KEY` is absent (same logic as session-init).

### 2.2 Wire into runAllChecks

File: `src/domains/health-checks/health-checks.ts`

Add `checkResearchEngine(cwd)` to the `runAllChecks()` array.

### 2.3 Read .epost-kit.json helper

The health check needs to read `.epost-kit.json` from the install directory. Use the same pattern as `checkMetadata`:

```ts
const configPath = join(cwd, '.claude', '.epost-kit.json');
// fallback: join(cwd, '.cursor', '.epost-kit.json')
```

Parse with `JSON.parse`, extract `skills.research.engine`. No Zod validation needed here — just safe property access.

### 2.4 Add tests

File: `tests/domains/health-checks/research-engine.test.ts`

Test cases:
- Engine `websearch` → status `pass`
- Engine `gemini`, gemini binary found → status `pass`
- Engine `gemini`, gemini binary not found → status `warn`
- Engine `perplexity`, API key set → status `pass`
- Engine `perplexity`, API key missing → status `warn`
- No `.epost-kit.json` → status `pass` (default behavior)

## Files to Change

| File | Change |
|------|--------|
| `src/domains/health-checks/health-checks.ts` | Add `checkResearchEngine()`, wire into `runAllChecks()` |
| `tests/domains/health-checks/research-engine.test.ts` | New test file |

## Acceptance

- [ ] `epost-kit doctor` shows research engine check result
- [ ] Gemini engine warns when `gemini` binary not on PATH
- [ ] Perplexity engine warns when `PERPLEXITY_API_KEY` unset
- [ ] WebSearch engine always passes
- [ ] Tests pass
