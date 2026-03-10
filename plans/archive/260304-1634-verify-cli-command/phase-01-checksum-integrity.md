# Phase 01: Checksum Integrity Check

## Context Links
- Parent plan: [plan.md](./plan.md)
- `epost-agent-cli/src/commands/verify.ts`
- `epost-agent-cli/src/core/checksum.ts`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Add installed-file integrity verification using `.epost-metadata.json` checksums
**Implementation Status**: Pending

## Key Insights
- `.epost-metadata.json` already stores per-file checksums + `modified` flag
- `core/checksum.ts` has `hashFile()` and `verifyChecksum()` ready to use
- Current verify only checks ref validity + skill health; never validates installed files match source

## Requirements
### Functional
- Load `.epost-metadata.json`, iterate `files` entries
- For each file: check exists, compute SHA256, compare to stored checksum
- Report: missing files, modified files (checksum mismatch), extra files not in metadata
- Update `modified` field in metadata when drift detected (opt-in via `--fix`)

### Non-Functional
- Parallel file hashing for performance (Promise.all with concurrency limit)
- Graceful handling of missing metadata file (warn, not crash)

## Architecture
```
runVerify()
  ├── loadMetadata()           # read .epost-metadata.json
  ├── checkInstalledIntegrity() # NEW - parallel hash check
  │   ├── hashFile() per entry
  │   ├── compare checksums
  │   └── return IntegrityResult[]
  ├── validateReferences()     # existing
  ├── runSkillHealthChecks()   # existing
  └── extractAllConnections()  # existing
```

## Related Code Files
### Create (EXCLUSIVE)
- `epost-agent-cli/src/core/integrity-checker.ts` - New module [OWNED]

### Modify (EXCLUSIVE)
- `epost-agent-cli/src/commands/verify.ts` - Add integrity check call + display [OWNED]

### Read-Only
- `epost-agent-cli/src/core/checksum.ts` - hashFile, verifyChecksum
- `epost-agent-cli/src/constants.ts` - METADATA_FILE constant
- `epost-agent-cli/src/core/file-system.ts` - fileExists, safeReadFile

## Implementation Steps

1. Create `integrity-checker.ts`:
```typescript
interface IntegrityResult {
  file: string;
  status: 'ok' | 'modified' | 'missing' | 'extra';
  expected?: string;
  actual?: string;
}

export async function checkInstalledIntegrity(
  cwd: string
): Promise<IntegrityResult[]>
```

2. Load metadata via `safeReadFile(join(cwd, METADATA_FILE))`, parse JSON
3. For each `files` entry: `hashFile(join(cwd, filePath))`, compare to `checksum`
4. Scan `.claude/` for files NOT in metadata (extras/orphans) -- info severity
5. Integrate into `runVerify()`: add integrity results to output between header and refs
6. Display: `Integrity: 45/47 ok, 1 modified, 1 missing`
7. Add `--fix` option to CLI registration in `cli.ts`

## Todo List
- [ ] Create `integrity-checker.ts` with `checkInstalledIntegrity()`
- [ ] Add integrity check to `runVerify()` parallel Promise.all
- [ ] Add display section for integrity results
- [ ] Register `--fix` flag in `cli.ts` verify command
- [ ] Handle missing metadata gracefully (warn + skip)

## Success Criteria
- `epost-kit verify` reports modified/missing installed files
- Modified files show expected vs actual checksum in verbose mode
- Missing metadata = warning, not crash

## Risk Assessment
**Risks**: Large installations could be slow with sequential hashing
**Mitigation**: Use `Promise.all` with p-limit for concurrency (already a dep)

## Security Considerations
None -- read-only file verification

## Next Steps
After completion: Phase 02 adds JSON output wrapping all results
