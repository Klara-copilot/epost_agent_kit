# File Fingerprinting Protocol

## Purpose

Hash-based skip logic for incremental reruns — skip unchanged files to avoid redundant analysis.

## Fingerprint Format

Storage: `.epost-cache/fingerprints.json`

```json
{
  "schema": "1.0",
  "computed": "2026-04-04T07:47:00Z",
  "files": {
    "src/auth.ts": {
      "hash": "a1b2c3d4",
      "mtime": 1743750420000,
      "size": 2048
    },
    "packages/core/SKILL.md": {
      "hash": "9f8e7d6c",
      "mtime": 1743748800000,
      "size": 512
    }
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `hash` | string | SHA-256, first 8 hex chars |
| `mtime` | number | epoch milliseconds |
| `size` | number | bytes |

## Hash Command

Single file:
```bash
shasum -a 256 path/to/file.ts | cut -c1-8
```

Batch (N files — run once, parse output):
```bash
shasum -a 256 file1.ts file2.ts file3.ts | awk '{print $1}' | cut -c1-8
```

## Skip Logic

```
1. Load .epost-cache/fingerprints.json (if missing → treat all files as changed)
2. For each file in scope:
   a. Compute current hash
   b. Compare to stored hash
   c. If match → skip file, log "unchanged: {path}"
   d. If no match or not in store → process file
3. After processing: update fingerprints.json with new hashes
```

Report format: `"12 files analyzed, 8 skipped (unchanged)"`

## Invalidation Rules

| Condition | Action |
|-----------|--------|
| Hash changed | Reprocess file |
| File deleted | Remove entry from fingerprints.json |
| File renamed | Old entry becomes stale — reprocess new path |
| Schema version change | Clear all fingerprints, force full rerun |

## Scope Rules

- Hash **file content** only — not path or metadata
- Include: source files, config files that affect output
- Exclude: `package-lock.json`, `yarn.lock`, `dist/`, `build/`, binary assets

## Storage Location

Always `.epost-cache/fingerprints.json` at project root. Never per-skill or per-agent — shared across all skills.

## Cross-References

- `understand-patterns/references/file-fingerprinting.md` — pattern rationale and Node.js implementation snippet
- `core/references/artifact-persistence-protocol.md` — artifact envelope and cleanup rules
