---
phase: 4
title: "Report + Package Pipeline"
effort: 1h
depends: [2, 3]
---

# Phase 4: Report + Package Pipeline

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/skill-creator/scripts/generate_report.py` — HTML report generator
- `packages/core/skills/skill-creator/scripts/package_skill.py` — .skill packager
- `reports/index.json` — report registry

## Overview
- Priority: P2
- Status: Pending
- Effort: 1h
- Description: Route `generate_report.py` output to `reports/` with kit naming conventions. Wire `package_skill.py` for distribution packaging.

## Requirements

### Functional
- `npm run skill:report -- <loop-output.json> [--skill-name <name>]` generates HTML report
- Report saved to `reports/YYMMDD-HHMM-{skill-name}-skill-eval.html` (kit naming convention)
- Report entry appended to `reports/index.json`
- `npm run skill:package -- <skill-path> [output-dir]` packages skill to `.skill` file
- Default output dir for packaging: `dist/skills/`

### Non-Functional
- Bridge scripts under 60 LOC each
- HTML report includes iteration comparison data

## Related Code Files

### Files to Create
- `packages/core/scripts/run-skill-report.cjs` — Bridge for `generate_report.py` + report routing
- `packages/core/scripts/run-skill-package.cjs` — Bridge for `package_skill.py`

### Files to Modify
- `packages/core/package.yaml` — Register new scripts
- `reports/index.json` — Appended programmatically by report script

### Files to Delete
- None

## Implementation Steps

1. **Create `run-skill-report.cjs`**
   - Parse: loop output JSON path (positional), `--skill-name` (optional, extract from JSON if missing)
   - Generate timestamp: `YYMMDD-HHMM` format
   - Spawn: `python3 -m scripts.generate_report <json-path> --static <output-path> --skill-name <name>`
   - Output path: `reports/{timestamp}-{skill-name}-skill-eval.html`
   - After generation: append entry to `reports/index.json`:
     ```json
     {
       "id": "skill-eval-{timestamp}-{skill-name}",
       "type": "skill-eval",
       "agent": "skill-creator",
       "title": "{skill-name} — Skill Evaluation Report",
       "verdict": "COMPLETE",
       "path": "reports/{filename}",
       "created": "YYYY-MM-DD"
     }
     ```

2. **Create `run-skill-package.cjs`**
   - Parse: skill path (positional), output dir (optional, default `dist/skills/`)
   - Ensure output dir exists (`fs.mkdirSync` recursive)
   - Spawn: `python3 -m scripts.package_skill <skill-path> <output-dir>`
   - Report final `.skill` file path on success

3. **Register scripts in package.yaml**
   - Add `run-skill-report.cjs` and `run-skill-package.cjs`

## Todo List
- [ ] Create `packages/core/scripts/run-skill-report.cjs`
- [ ] Create `packages/core/scripts/run-skill-package.cjs`
- [ ] Register in `packages/core/package.yaml`
- [ ] Test: generate report from sample loop output JSON
- [ ] Test: verify report appears in `reports/index.json`
- [ ] Test: package a skill to `dist/skills/`

## Success Criteria
- Reports follow kit naming convention and appear in `reports/index.json`
- Packaged `.skill` files land in predictable output directory
- Both scripts degrade gracefully if python3 unavailable

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `generate_report.py` expects browser for non-static mode | Low | Always use `--static` flag |
| `reports/index.json` concurrent write | Low | Read-modify-write with JSON.parse/stringify |

## Security Considerations
- `package_skill.py` bundles skill files — review excludes sensitive files (already handled by EXCLUDE_DIRS/EXCLUDE_FILES in script)
- Report HTML is static, no server component
