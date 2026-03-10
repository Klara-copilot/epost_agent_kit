# Phase 02: JSON Output + CI Integration

## Context Links
- Parent plan: [plan.md](./plan.md)
- `epost-agent-cli/src/commands/verify.ts`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add `--json` flag for machine-readable output and standardize exit codes
**Implementation Status**: Pending

## Key Insights
- `lint` command already has `--json` mode -- follow same pattern
- `doctor` uses exit codes 0/1/2 -- verify should match
- CI pipelines need JSON output for reporting + gating

## Requirements
### Functional
- `--json` outputs structured JSON with all check results
- Exit code 0=pass, 1=errors, 2=warnings-only (no errors)
- JSON schema: `{ integrity, refs, health, graph, summary }`
- Summary includes counts per severity

### Non-Functional
- JSON output goes to stdout only; no stderr mixing
- Human-readable output unaffected when `--json` not set

## Architecture
```typescript
interface VerifyReport {
  timestamp: string;
  integrity: { total: number; ok: number; modified: string[]; missing: string[] };
  refs: { errors: RefError[]; count: number };
  health: { issues: HealthIssue[]; stats: HealthStats };
  graph: { path: string; skillCount: number; connectionCount: number };
  summary: { errors: number; warnings: number; infos: number; pass: boolean };
}
```

## Related Code Files
### Modify (EXCLUSIVE)
- `epost-agent-cli/src/commands/verify.ts` - Add JSON output path + exit codes [OWNED]
- `epost-agent-cli/src/cli.ts` - Register `--json` flag [OWNED]

### Read-Only
- `epost-agent-cli/src/commands/lint.ts` - Reference for JSON output pattern
- `epost-agent-cli/src/commands/doctor.ts` - Reference for exit code pattern

## Implementation Steps

1. Add `json?: boolean` to `VerifyOptions` interface
2. Register `--json` flag in `cli.ts`: `.option("--json", "Output JSON report", false)`
3. After all checks complete, if `opts.json`:
   - Build `VerifyReport` object
   - `console.log(JSON.stringify(report, null, 2))`
   - `process.exit(exitCode)` -- skip human-readable output
4. Standardize exit codes for non-JSON mode too:
   - 0: all pass
   - 1: errors found
   - 2: warnings only (no errors)
5. Current code uses `process.exit(1)` for errors and falls through for pass -- add explicit exit(2) for warnings-only case

## Todo List
- [ ] Add `json` to VerifyOptions
- [ ] Register `--json` in cli.ts
- [ ] Build VerifyReport type and assembly
- [ ] JSON output path (early return)
- [ ] Standardize exit codes (0/1/2)

## Success Criteria
- `epost-kit verify --json` outputs valid JSON to stdout
- Exit codes match: 0=pass, 1=errors, 2=warnings
- `epost-kit verify --json --strict` exits 1 on warnings

## Risk Assessment
**Risks**: None significant
**Mitigation**: N/A

## Security Considerations
None

## Next Steps
After completion: Phase 03 adds test coverage
