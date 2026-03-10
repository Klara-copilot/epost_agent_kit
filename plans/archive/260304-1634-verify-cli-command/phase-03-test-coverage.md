# Phase 03: Test Coverage

## Context Links
- Parent plan: [plan.md](./plan.md)
- `epost-agent-cli/tests/integration/doctor-command.test.ts` - Pattern reference

## Overview
**Date**: 2026-03-04
**Priority**: P2
**Description**: Add unit tests for integrity-checker and integration tests for verify command
**Implementation Status**: Pending

## Key Insights
- doctor-command.test.ts uses `createTestProject({ withMetadata: true })` helper
- Test helpers already create temp projects with `.epost-metadata.json`
- vitest is the test runner (already configured)

## Requirements
### Functional
- Unit tests for `integrity-checker.ts`: ok/modified/missing/extra scenarios
- Integration tests for `verify` command: pass, fail, JSON output, strict mode
- Edge cases: missing metadata, corrupted metadata, empty installation

### Non-Functional
- Tests must not depend on real `packages/` directory
- Use temp-project fixtures

## Related Code Files
### Create (EXCLUSIVE)
- `epost-agent-cli/tests/unit/core/integrity-checker.test.ts` [OWNED]
- `epost-agent-cli/tests/integration/verify-command.test.ts` [OWNED]

### Read-Only
- `epost-agent-cli/tests/helpers/temp-project.ts` - createTestProject helper
- `epost-agent-cli/tests/helpers/test-utils.ts` - Test utilities
- `epost-agent-cli/tests/integration/doctor-command.test.ts` - Pattern reference
- `epost-agent-cli/tests/fixtures/sample-metadata.json` - Fixture

## Implementation Steps

1. **Unit: integrity-checker.test.ts**
   - Test: all files match checksums -> all 'ok'
   - Test: one file modified -> detected as 'modified' with mismatched hash
   - Test: file in metadata but missing from disk -> 'missing'
   - Test: file on disk but not in metadata -> 'extra'
   - Test: missing metadata file -> returns empty with warning
   - Test: corrupted metadata JSON -> graceful error

2. **Integration: verify-command.test.ts**
   - Test: valid installation passes all checks
   - Test: modified file triggers warning/error in output
   - Test: `--json` produces valid JSON with expected schema
   - Test: `--strict` with warnings exits 1
   - Test: exit codes: 0 for pass, 1 for errors
   - Mock `process.exit` to capture exit code (same pattern as doctor tests)

3. Fixture: create `tests/fixtures/verify-metadata.json` with known checksums matching fixture files

## Todo List
- [ ] Create integrity-checker unit tests (6 cases)
- [ ] Create verify-command integration tests (5 cases)
- [ ] Add verify fixture metadata file
- [ ] Verify all tests pass: `npx vitest run tests/unit/core/integrity-checker.test.ts tests/integration/verify-command.test.ts`

## Success Criteria
- All unit tests pass
- All integration tests pass
- Coverage of integrity-checker >= 90%

## Risk Assessment
**Risks**: Test setup complexity for packages/ directory mocking
**Mitigation**: Create minimal fixture packages/ with one package.yaml

## Security Considerations
None

## Next Steps
Command is complete. Consider adding to CI pipeline documentation.
