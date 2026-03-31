---
phase: 2
title: "Build Gate enhancement — fix suggestions + error linking"
effort: 2h
depends: []
---

# Phase 2: Build Gate Enhancement

## Context Links
- [Plan](./plan.md)
- `packages/core/hooks/lib/build-gate.cjs` — current implementation
- `plans/260310-0954-build-gate-pretooluse-hook/plan.md` — PreToolUse hook plan

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: Make build-gate output actionable. On failure, parse error output, extract file:line references, categorize error type, and suggest next action (e.g., "Run `/fix --types`" for TS errors).

## Requirements
### Functional
- Parse build failure stderr/stdout for file:line error patterns
- Categorize errors: TypeScript, ESLint, import/module, runtime
- Output structured JSON with `errors[]` array (file, line, message, category)
- Add `suggestion` field: recommend `/fix` variant based on error category
- Surface top 3 errors in human-readable format on stderr

### Non-Functional
- No new dependencies (use regex parsing)
- Backward-compatible JSON output (add fields, don't remove)
- Exit codes unchanged (0=pass, 1=fail)

## Related Code Files
### Files to Modify
- `packages/core/hooks/lib/build-gate.cjs:179-194` — `runBuild()` function
  - Currently captures last 500 chars of stderr + last 300 of stdout
  - Expand to parse error patterns and extract structured errors
- `packages/core/hooks/lib/build-gate.cjs:196-242` — `main()` function
  - Add error categorization + suggestion to JSON output
  - Add human-readable error summary to stderr output

### Files to Create
- `packages/core/hooks/lib/error-parser.cjs` — Error pattern matching module
  - TypeScript: `/(\S+\.tsx?)\((\d+),(\d+)\): error TS\d+: (.+)/`
  - ESLint: `/(\S+)\s+(\d+):(\d+)\s+error\s+(.+)/`
  - Webpack/Next.js: `/Error: (.+)\n\s+at (.+):(\d+)/`
  - Import: `/Module not found|Cannot find module/`

### Files to Delete
- None

## Implementation Steps
1. **Create `error-parser.cjs`** with `parseErrors(output)` function:
   - Input: combined stderr+stdout string
   - Output: `{ errors: [{file, line, col, message, category}], suggestion: string }`
   - Category enum: `typescript | eslint | import | runtime | unknown`
   - Suggestion map: typescript -> "/fix --types", eslint -> "fix lint errors", import -> "check imports"
2. **Update `runBuild()`** to capture full stderr (not just last 500 chars) up to 5KB
3. **Update `main()`** to:
   - Call `parseErrors()` on failure
   - Add `errors` and `suggestion` to JSON output
   - Print top 3 errors to stderr in format: `  FILE:LINE — MESSAGE`
   - Print suggestion: `  Suggested: /fix --types`
4. **Test** with sample TS error, ESLint error, and import error outputs

## Todo List
- [ ] Create error-parser.cjs with regex patterns
- [ ] Update runBuild() to capture more output
- [ ] Update main() to use error parser
- [ ] Add suggestion mapping
- [ ] Test with sample error outputs

## Success Criteria
- Build failure output includes file:line references for top 3 errors
- JSON output has `errors[]` array with structured error objects
- `suggestion` field recommends correct `/fix` variant
- Existing tests/usage not broken (backward-compatible JSON)

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Regex patterns miss some error formats | Low | Start with TS + Next.js patterns (most common); add more later |
| Large build output causes memory issues | Low | Cap at 5KB capture |

## Security Considerations
- None identified (no user input, just build output parsing)

## Next Steps
- After implementing, update git skill's commit workflow to surface suggestions from build-gate
