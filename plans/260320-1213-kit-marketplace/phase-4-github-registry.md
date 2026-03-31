---
phase: 4
title: "GitHub Registry Integration"
effort: 4h
depends: [1, 2]
---

# Phase 4: GitHub Registry Integration

Fetch latest bundle definitions + skill metadata from GitHub to enable version comparison and updates.

## Tasks

### 4.1 Remote registry client

**File**: `src/domains/github/registry-client.ts`

Fetch from GitHub raw content (public repo, no auth needed for reads):

```typescript
const REGISTRY_BASE = 'https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/main';
// bundles.yaml lives at repo root: ${REGISTRY_BASE}/bundles.yaml
// skill-index.json: ${REGISTRY_BASE}/.claude/skills/skill-index.json

async function fetchRemoteBundles(): Promise<BundlesConfig>
async function fetchRemoteSkillIndex(): Promise<SkillIndex>
```

- Uses existing `src/domains/github/github-client.ts` HTTP layer
- Cache response for 1 hour (file-based cache in `~/.epost-kit/cache/`)
- Graceful fallback: if fetch fails, use local bundled copy + warn

### 4.2 Version comparison engine

**File**: `src/domains/versioning/version-compare.ts`

```typescript
interface VersionDiff {
  installedKitVersion: string;  // from local .epost.json kitVersion
  latestKitVersion: string;     // from remote bundles.yaml or kit package.json
  hasUpdate: boolean;
  changedSkills: string[];      // skills with content changes between versions
}

function compareVersions(local: EpostConfig, remoteBundles: BundlesConfig): VersionDiff
```

Kit-level version compare (not per-skill). All skills share the kit's semver. Compare local `kitVersion` against remote kit version to detect updates.

### 4.3 Cache management

**File**: `src/domains/github/registry-cache.ts`

- Cache dir: `~/.epost-kit/cache/`
- TTL: 1 hour (configurable via `EPOST_KIT_CACHE_TTL` env var)
- Files: `bundles.yaml.cache`, `skill-index.json.cache`, `cache-meta.json`
- `--no-cache` flag bypasses

### 4.4 Upgrade check integration

**File**: `src/commands/upgrade.ts` (modify)

Wire remote fetch into upgrade flow:
1. `epost-kit upgrade --check` → fetch remote, compare, display diff (no install)
2. `epost-kit upgrade` → fetch remote, compare, prompt per-update, install accepted
3. Show changelog URL if available

### 4.5 Browse integration

**File**: `src/commands/browse.ts` (modify)

When browsing, fetch remote to show "Updates Available" tab accurately:
- Compare installed versions vs remote
- Badge: `↑ 1.0.0 → 1.1.0` on cards with updates
- Updates tab filters to only roles with updated skills

### 4.6 Offline mode

When network unavailable:
- Use local bundled `bundles.yaml` + cached `skill-index.json`
- "Updates Available" tab shows "Offline — run with network to check updates"
- All install/remove operations work offline (files are local)

## Files Changed

| File | Repo | Action |
|------|------|--------|
| `src/domains/github/registry-client.ts` | cli | create |
| `src/domains/github/registry-cache.ts` | cli | create |
| `src/domains/versioning/version-compare.ts` | cli | create |
| `src/commands/upgrade.ts` | cli | modify |
| `src/commands/browse.ts` | cli | modify |

## Validation

- [ ] `epost-kit upgrade --check` fetches from GitHub, shows version diffs
- [ ] Cache works: second call within 1h uses cache (no network)
- [ ] `--no-cache` forces fresh fetch
- [ ] Offline: shows warning, falls back to local data
- [ ] Browse "Updates" tab shows correct update count
- [ ] No auth required for public repo reads

## Tests

- `tests/domains/github/registry-client.test.ts` — mock HTTP, test parse
- `tests/domains/versioning/version-compare.test.ts` — semver compare edge cases
- `tests/domains/github/registry-cache.test.ts` — TTL, invalidation
