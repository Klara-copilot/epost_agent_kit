---
phase: 2
title: "Library mode SEC/PERF/LDRY dimensions"
effort: 1h
depends: []
---

# Phase 2: Library Mode SEC/PERF/LDRY Dimensions

## Tasks

### 2.1 Add SEC section to audit-standards.md

**File**: `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`

Insert after Section 6 (TEST, ends at line 87):

```markdown
## Section 7: Security (SEC) -- Library Mode Conditional

**Activation gate**: Component imports fetch/axios/localStorage OR props include URL/apiKey/endpoint OR imports AI SDK. Skip if none match.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| SEC-001 | No API keys/secrets in localStorage/sessionStorage/hardcoded strings | critical | Credentials via env vars or secure store only | API key in localStorage, hardcoded secret string |
| SEC-002 | External/AI data validated before type casting -- no bare `as X` on unvalidated JSON | high | Runtime validation (zod, io-ts, type guard) before cast | `response.data as MyType` without validation |
| SEC-003 | External endpoint must have origin allowlist or server-side proxy | high | Fetch routed through API route or allowlisted origins | Raw client-side fetch to user-supplied URL |
| SEC-004 | `javascript:` scheme rejected in any URL-accepting prop or string builder | high | URL sanitized or scheme-checked before use | href/src prop accepts arbitrary string without scheme check |
| SEC-005 | API credentials via headers, not query params | high | Auth in Authorization header or cookie | `?apiKey=xxx` in URL |
```

### 2.2 Add PERF section to audit-standards.md

Same file, insert after SEC:

```markdown
## Section 8: Performance (PERF) -- Library Mode Conditional

**Activation gate**: 10+ files in scope OR any file >300 LOC. Skip if neither.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| PERF-001 | Component files <=500 LOC | medium | Under 500 lines | File exceeds 500 LOC -- decompose |
| PERF-002 | Hook files <=400 LOC | medium | Under 400 lines | File exceeds 400 LOC -- split |
| PERF-003 | Expensive computations wrapped in useMemo/useCallback | medium | Memoized where needed | Heavy computation in render path without memoization |
| PERF-004 | Mock/demo data not in production index.ts | high | Mock data in .stories.tsx or __tests__/ only | >100 lines mock data exported from production module |
```

### 2.3 Add LDRY section to audit-standards.md

Same file, insert after PERF:

```markdown
## Section 9: Library DRY (LDRY) -- Always in Library Mode

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| LDRY-001 | No identical utility function bodies in 2+ files | medium | Shared utils in _utils/ | Same function body copy-pasted across files |
| LDRY-002 | No identical type definitions in 2+ files | medium | Shared types in _types/ | Same interface/type duplicated across files |
| LDRY-003 | POC maturity: no console.log, TODO, hardcoded URLs, commented-out blocks in library code | high | Clean production-ready code | POC artifacts left in library source |
```

### 2.4 Update Mode Applicability table

Same file, replace existing Mode Applicability table (lines 92-104) with expanded version:

```markdown
## Mode Applicability

| Section | Library Mode | Consumer Mode | Notes |
|---------|-------------|---------------|-------|
| INTEGRITY | Y | Y | Always first -- blocks on direct library edits |
| PLACE | Y | Y | Different criteria per mode |
| REUSE | - | Y | Consumer-only |
| TW | Y | Y | Both modes parse tailwind.config.ts |
| DRY | - | Y | Consumer-only; gates REUSE false positives |
| REACT | - | Y | Consumer-only |
| POC | - | Y | Consumer-only (but LDRY-003 covers POC in library) |
| STRUCT-TEST | Y | - | Library-only (A11Y, TEST apply to both) |
| SEC | Y (conditional) | Y | Conditional on: localStorage/fetch/apiKey/AI imports |
| PERF | Y (conditional) | Y | Conditional on: 10+ files OR file >300 LOC |
| LDRY | Y | - | Library-only; LDRY-003 covers POC for library |
```

### 2.5 Add Steps 3b/3c/3d to ui.md Library mode

**File**: `packages/core/skills/audit/references/ui.md`

After Step 3 (line 220, "6 Categories Per Platform"), insert before Step 4:

```markdown
### Step 3b: SEC Audit (Library Mode -- Conditional)

**Gate**: Scan imports for `fetch`, `axios`, `localStorage`, `sessionStorage`, props named `url`/`apiKey`/`endpoint`, or AI SDK imports. If none found, skip.

Run SEC-001 through SEC-005 from audit-standards.md. For each violation:
- Assign ID format: `{PLATFORM}-SEC-{NNN}`
- Critical/high severity findings require code snippet in report

### Step 3c: PERF Audit (Library Mode -- Conditional)

**Gate**: 10+ files in audit scope OR any file >300 LOC. If neither, skip.

Run PERF-001 through PERF-004 from audit-standards.md.
- Count LOC per file (exclude blank lines and comments)
- Check useMemo/useCallback coverage on expensive computations
- Flag mock data in production exports

### Step 3d: LIB-DRY Scan (Library Mode -- Always)

Run LDRY-001 through LDRY-003 from audit-standards.md.
- Diff function bodies across files in scope (exact or near-identical)
- Diff type/interface definitions across files
- Scan for POC artifacts: console.log, TODO, hardcoded URLs, commented-out blocks >3 lines
```

## Validation

- [ ] audit-standards.md has Sections 7 (SEC, 5 rules), 8 (PERF, 4 rules), 9 (LDRY, 3 rules)
- [ ] Mode Applicability table has 11 rows (was 8)
- [ ] ui.md has Steps 3b, 3c, 3d between Step 3 and Step 4
- [ ] SEC and PERF have conditional activation gates documented
- [ ] No edits to `.claude/` directory
