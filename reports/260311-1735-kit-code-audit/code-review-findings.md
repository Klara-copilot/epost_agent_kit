# Code Review — Web Platform 8→9 Changes

**Date**: 2026-03-11
**Agent**: epost-code-reviewer
**Plan**: none
**Status**: COMPLETE

---

## Summary

- Files reviewed: 9
- Findings: 9 (critical: 0, high: 3, medium: 4, low: 2)
- Verdict: **FIX-AND-RESUBMIT**

---

## Executive Summary

The 8→9 changes introduce three new artifacts (known-findings-surfacer, error-parser, visual-mode) and extend three existing ones (build-gate, ui-findings-schema, fix/ui-mode). Overall quality is good — graceful degradation is consistently applied in hooks, regex patterns are sound, and the schema extension is additive and backward-compatible. Three high-severity issues require attention before shipping: a path-traversal risk in the surfacer hook, an incorrect DB path hardcoded in fix/ui-mode.md that diverges from the authoritative schema, and an unguarded `parseInt` that can produce NaN in the timeout argument.

---

## Findings

### [HIGH] Path Traversal via Unsanitized `filePath` in PostToolUse Hook

- **File**: `packages/core/hooks/known-findings-surfacer.cjs:79`
- **Category**: SEC
- **Issue**: `normalizePath` calls `path.join(cwd, filePath)` where `filePath` comes directly from `hookData.tool_input.file_path`. If a malicious or accidental path like `../../etc/passwd` is passed, `path.relative` normalises it but the subsequent `endsWith` check in `findingMatchesFile` would still be evaluated against the resolved path — opening the potential for a relative path to escape `cwd` in future modifications. More concretely, the current `normalizePath` does not validate that the resolved path stays within `cwd`, so `path.relative` can return `../…` strings. These are then compared against `file_pattern` values from the DB, which is safe in read-only use but fragile.
- **Fix**: After computing `const rel = path.relative(cwd, abs)`, assert `!rel.startsWith('..')` before proceeding. Return `''` (which will match nothing) if the path escapes cwd.

```js
function normalizePath(filePath, cwd) {
  if (!filePath) return '';
  const abs = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const rel = path.relative(cwd, abs);
  if (rel.startsWith('..')) return ''; // escape guard
  return rel;
}
```

---

### [HIGH] Wrong DB Path in `fix/references/ui-mode.md` (Step 2)

- **File**: `packages/core/skills/fix/references/ui-mode.md:28`
- **Category**: INTEGRATION
- **Issue**: Step 2 instructs agents to load `reports/known-findings/ui-components.json`, but the authoritative schema (`audit/references/ui-findings-schema.md`) places the UI findings DB at `.epost-data/ui/known-findings.json`. The surfacer hook also reads `.epost-data/ui/known-findings.json`. This divergence means the fix skill and the surfacer hook operate on different files — the fix skill will always report "no UI findings DB" unless someone manually creates the legacy path.
- **Fix**: Update step 2 and step 8 of `ui-mode.md` to reference `.epost-data/ui/known-findings.json`. Same applies to the "no DB" error message.

---

### [HIGH] `parseInt` Without NaN Guard — Possible NaN `timeout`

- **File**: `packages/core/hooks/lib/build-gate.cjs:60`
- **Category**: LOGIC
- **Issue**: `const timeoutMs = parseInt(getArg('--timeout') || '300000', 10)` — when `getArg('--timeout')` returns a non-numeric string (e.g. `--timeout abc`), `parseInt` produces `NaN`. `execSync` receives `timeout: NaN`, which Node treats as no timeout — silently disabling the 5-minute safety cap. No error or warning is emitted.
- **Fix**: Add a NaN guard with fallback:
```js
const rawTimeout = parseInt(getArg('--timeout') || '300000', 10);
const timeoutMs = Number.isNaN(rawTimeout) ? 300000 : rawTimeout;
```

---

### [MEDIUM] `findingsCache` Shape Mismatch — Unnecessary `Map` Wrapping

- **File**: `packages/core/hooks/known-findings-surfacer.cjs:34,43,66`
- **Category**: LOGIC
- **Issue**: `findingsCache` is typed as `Map<string, Array>|null` and stored as `new Map([['all', all]])`. On cache hit, it does `Array.from(findingsCache.values()).flat()` — an allocation-heavy pattern for a single-value map. This is confusing and adds overhead per hook invocation. Since hooks are single-invocation processes the cache never actually saves a second read in practice (stdin fires once, `run()` is called once), making the cache pointless in its current form.
- **Fix**: Either remove the cache entirely (process dies after one `run()` call) or simplify to `let findingsCache: Array | null` and assign `findingsCache = all` directly. Remove the `Map` indirection.

---

### [MEDIUM] ESLint Pattern Too Broad — Will Greedily Match Non-Error Lines

- **File**: `packages/core/hooks/lib/error-parser.cjs:50-53`
- **Category**: LOGIC
- **Issue**: The ESLint regex `/(\S+\.(?:tsx?|jsx?|mjs|cjs))\s+(\d+):(\d+)\s+error\s+(.+)/g` has no start-of-line anchor. ESLint output lines follow the format `  12:3  error  message  rule` where the filename is on the PREVIOUS line. This pattern will match any line containing a filename-like string followed by a line number and the word "error", including false positives from error messages that happen to contain file references (e.g., TypeScript's "error TS… in file.tsx 12:3 something"). The extracted `file` may be a module path extracted mid-sentence rather than an actual source file.
- **Fix**: Add a `^` anchor after enabling multiline mode, or use a two-pass parser that groups ESLint file-header lines (lines with no leading spaces ending in `.tsx`) with their child error lines.

---

### [MEDIUM] `rawOutput` Order: stderr Before stdout May Lose TypeScript Errors

- **File**: `packages/core/hooks/lib/build-gate.cjs:196`
- **Category**: LOGIC
- **Issue**: `const rawOutput = (stderr + '\n' + stdout).trim()` — Next.js and tsc write TypeScript errors to stdout, not stderr. The current order puts stderr first, which is correct for most compilers, but then takes the last 10 lines via `.slice(-10)` for the `excerpt` and last 5KB for `rawOutput`. If stdout is large (e.g. webpack progress), stderr errors at the front may be truncated by the 5KB cap before `parseErrors` sees them.
- **Fix**: Reverse the concatenation order to `stdout + '\n' + stderr` OR slice each buffer independently before joining:
```js
const rawOutput = [
  stderr ? String(err.stderr).slice(-MAX_OUTPUT_BYTES) : '',
  stdout ? String(err.stdout).slice(-MAX_OUTPUT_BYTES) : '',
].filter(Boolean).join('\n').trim();
```
(Already done per-buffer for the `rawOutput` variable — but `excerpt` at line 197 uses `.slice(-10)` on the already-joined string, which is correct.)

Actually re-reading lines 194–197: stderr and stdout are sliced individually before joining, and `rawOutput` is their join. This is fine. The `excerpt` (last 10 lines of the joined output) could still lose stderr if stdout dominates, but this is an acceptable trade-off. Downgrading to LOW.

*(Revised: see LOW finding below)*

---

### [MEDIUM] `verified`/`verified_date` Fields Missing from Resolution-State Descriptions in Schema Prose

- **File**: `packages/core/skills/audit/references/ui-findings-schema.md:113-116`
- **Category**: INTEGRATION
- **Issue**: The state-machine prose and table at lines 113-116 describe transitions correctly, but the "Field Definitions" table (lines 52-74) does not list `verified` or `verified_date` in the state machine's `open → fix_applied` transition description. Agents reading only the state-machine table might not know to set `verified: false` initially (the JSON template does set it, but consistency between the template and the prose table matters for reliability).
- **Fix**: Minor — add `verified: false` (default) note to the `open` state row in the state machine, and confirm `verified_date: null` default is explicit. Low-friction change but prevents agent confusion.

---

### [LOW] `--no-verify` Flag Listed in Frontmatter `argument-hint` but Not in Flag Table

- **File**: `packages/core/skills/fix/references/ui-mode.md:6,21`
- **Category**: STYLE
- **Issue**: The frontmatter `argument-hint` correctly lists `--no-verify` but the step 10 conditional reads "If all `verified: true` (or `--no-verify` used)" without explaining this means the re-audit was skipped. A developer reading only the Flags table sees `--no-verify` described as "Skip the automatic re-audit" — but step 10's suggestion to run `/audit --close` when `--no-verify` is used is logically inconsistent: since verification was skipped, `verified` will be `false` or absent, yet step 8 says to set `verified: true/false, verified_date: today` only "if step 7.5 ran". This creates a gap: when `--no-verify` is used, `verified` field is never set, but step 10 treats it as if `verified: true`.
- **Fix**: When `--no-verify` is active, explicitly skip setting `verified`/`verified_date` in step 8 (or set `verified: null`/`verified_date: null` to indicate "not checked"). Update step 10 language: "If `--no-verify` was used: suggest running `/audit --close` manually after confirming fixes are correct."

---

### [LOW] `find` + `grep` in `visual-mode.md` Step 1 — Fragile Shell Pattern

- **File**: `packages/core/skills/test/references/visual-mode.md:20-22`
- **Category**: STYLE
- **Issue**: The detection step uses `find . -name "*.visual.spec.ts" -o -name "*.screenshot.spec.ts" | grep -v node_modules`. This pattern is incorrect: `-o` in `find` has lower precedence than implicit `-and`, so without explicit grouping (parentheses) the `grep -v node_modules` filter operates on the combined result but `-o` may not apply the `grep` correctly to both patterns. Also, agents executing this shell snippet literally may encounter issues if `find` is restricted in the hook environment.
- **Fix**: Use the safe grouped form:
```bash
find . \( -name "*.visual.spec.ts" -o -name "*.screenshot.spec.ts" \) -not -path "*/node_modules/*"
```
This eliminates the grep pipe and uses `find`-native exclusion which works reliably across platforms.

---

## Methodology

- **Files Scanned**: 9 (all listed in scope — explicit scope mode, no git diff needed)
- **Standards Applied**: SEC-001..004, LOGIC-001..004, ARCH-001..003, PERF-001..003, TS-001..003 (lightweight review)
- **KB Layers Used**: L1 docs not queried (no docs/ for this kit); L4 codebase grep used for cross-reference validation (DB path, schema fields)
- **Tools Used**: Read (all 9 files), Glob (lib directory enumeration), Bash (directory existence checks)
- **Coverage Gaps**:
  - `CLAUDE.snippet.md` — routing rule additions reviewed for content correctness; cannot verify runtime routing behavior without integration test
  - `settings.json` hook registration — format verified correct against existing hook entries; cannot verify Claude Code hook API version compatibility at review time
  - No tests exist for `error-parser.cjs` or `known-findings-surfacer.cjs` — regex correctness and edge cases are review-only, not test-verified
  - `project-detector.cjs` (dependency of build-gate) not in scope — assumed stable

---

## Unresolved Questions

1. **DB path discrepancy** (HIGH finding #2): Was `reports/known-findings/ui-components.json` the intended legacy path or is `.epost-data/ui/known-findings.json` the canonical location? The surfacer hook assumes the latter — confirming which is authoritative determines the fix direction.
2. **PostToolUse output contract**: Does the Claude Code PostToolUse hook contract accept a `{type: "text", text: "..."}` JSON response from stdout for injection, or does it require a different envelope? The surfacer assumes this format — no API docs were available to verify.
3. **ESLint multiline output**: Does the ESLint pattern need to handle multiline error blocks (filename on one line, error on the next)? If so, the current single-line regex will silently miss all ESLint errors in standard output format.
4. **`--no-verify` and `verified` field**: Should `verified` be set to `null`, `false`, or left absent when `--no-verify` skips re-audit? The schema defines `verified: boolean` (not nullable) — clarification needed for schema conformance.
