# File Fingerprinting

## Problem

Workflows that re-run on code changes re-analyze every file — even unchanged ones — wasting tokens, time, and budget. On large repos (100K+ LOC), full re-analysis can take minutes and cost significantly.

## Pattern

Before analysis, compute a content hash (fingerprint) for each file. On re-run, compare new hashes to stored fingerprints. Skip files whose hash is unchanged.

**Hash function:** SHA-256 or MD5 of file content (not metadata, not mtime — content only).

**Storage:** `.epost-cache/fingerprints.json`

```json
{
  "schema": "1.0",
  "computed": "2026-04-04T07:27:00Z",
  "files": {
    "src/auth.ts": "a1b2c3d4e5f6...",
    "src/utils.ts": "9f8e7d6c5b4a...",
    "packages/core/SKILL.md": "1234567890ab..."
  }
}
```

**Re-run flow:**
1. Load stored fingerprints (if file missing → treat all files as changed)
2. Compute current hashes for all in-scope files
3. Diff: `changed = current_hash != stored_hash`
4. Run analysis ONLY on changed files
5. Merge results with prior cached analysis
6. Save updated fingerprints

## ePost Application

```
// docs --scan: skip unchanged docs files
Before scanning: load .epost-cache/fingerprints.json
For each docs/ file: compare hash → skip if unchanged
After scanning: update fingerprints file with new hashes

// audit / test: skip files with no changes
Before audit run: fingerprint all source files in scope
Skip files with unchanged hash (no new issues possible)
Report: "12 files analyzed, 8 skipped (unchanged)"

// get-started (Phase 1 re-run)
If project was previously onboarded:
  Load .epost-cache/fingerprints.json
  Only re-analyze changed source files
  Reuse prior tech-stack detection for unchanged files
```

## Implementation Snippet (Node.js)

```javascript
const crypto = require('crypto');
const fs = require('fs');

function fingerprint(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function changed(filePath, stored) {
  if (!stored[filePath]) return true; // new file
  return fingerprint(filePath) !== stored[filePath];
}
```

## Fingerprint Scope Rules

- Hash **file content**, not path or metadata
- Include all files that could affect output (source + config)
- Exclude: lock files (`package-lock.json`), generated files (`dist/`), binary assets
- On schema change: clear all fingerprints and force full re-analysis

## When to Use

- Any workflow that re-runs periodically on the same codebase
- Expensive analysis phases (LLM annotation, test generation, audit)
- CI pipelines where partial analysis saves time
- Large repos (50+ files) where full re-analysis is noticeably slow

## When to Skip

- First run (no prior fingerprints to compare against)
- Workflows that always need fresh output regardless of file changes
- Small repos (<10 files) where the overhead of fingerprinting exceeds the savings
- Security audits that must check all files every time
