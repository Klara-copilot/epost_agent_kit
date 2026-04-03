---
id: 260402-2049-find-skill
title: "/find-skill — Scored External Skill Discovery"
status: approved
created: 2026-04-02
updated: 2026-04-03
platform: all
---

## Summary

Build `/find-skill` as a user-invokable skill with script-backed scanning, quality scoring, and project-relevance ranking. Sources: agent-kernel (Bitbucket SSH clone, cached) + skills.sh (via `npx skills`). No-flag mode searches both and presents a unified ranked list. Install is source-agnostic.

## Clarifications (from review)

| Point | Decision |
|-------|----------|
| agent-kernel location | Clone `git@bitbucket.org:axonivy-prod/agent-kernel.git` via SSH; cache at `~/.epost-kit/cache/agent-kernel/`; pull if > 24h stale |
| `--community` | ~~Removed~~ — no value in listing what's installed |
| `--kernel` mechanism | Same as vercel-labs pattern: git clone remote repo, scan SKILL.md files locally |
| No flag | Search kernel + skills.sh, rank unified by project relevance + quality, kernel results first within same tier |
| `--install` | Source-agnostic — find skill in kernel OR skills.sh, install to both `.claude/skills/` (immediate) + `packages/community/` (git-persisted) |

---

## Phases

| # | Name | Deliverables |
|---|------|-------------|
| 1 | Core scripts | `lib/` modules: scan, quality, relevance, project-context, kernel-sync |
| 2 | Entry point + output | `find-skill.cjs` CLI, ranked table renderer |
| 3 | SKILL.md | Full orchestration with all flag paths |

---

## Phase 1 — Core Scripts

### File layout

```
packages/core/skills/find-skill/
  SKILL.md
  scripts/
    find-skill.cjs                    ← entry point, flag dispatch
    lib/
      kernel-sync.cjs                 ← git clone/pull agent-kernel to ~/.epost-kit/cache/
      scan-skills.cjs                 ← scan a skills dir, extract SkillMeta[]
      score-quality.cjs               ← 10-pt quality score from SkillMeta
      project-context.cjs             ← extract project profile from env
      score-relevance.cjs             ← 10-pt relevance score (meta + context)
```

### `lib/kernel-sync.cjs`

Ensures agent-kernel is available locally, up to date.

```
KERNEL_REPO = git@bitbucket.org:axonivy-prod/agent-kernel.git
CACHE_DIR   = ~/.epost-kit/cache/agent-kernel/
STALE_AFTER = 24h  (check mtime of CACHE_DIR/.git/FETCH_HEAD)
```

**Logic:**
1. If `CACHE_DIR` does not exist → `git clone KERNEL_REPO CACHE_DIR`
2. If exists but FETCH_HEAD older than 24h → `git -C CACHE_DIR pull --ff-only`
3. If clone/pull fails (SSH error, no network) → warn on stderr, return `null` (caller skips kernel results gracefully)
4. Return `CACHE_DIR/skills/` path on success

### `lib/scan-skills.cjs`

Input: `dirPath` (absolute path to a `skills/` directory)

Output: `SkillMeta[]`

```js
{
  name: string,          // frontmatter.name
  description: string,   // frontmatter.description
  keywords: string[],    // frontmatter.metadata?.keywords || []
  triggers: string[],    // frontmatter.metadata?.triggers || []
  platforms: string[],   // frontmatter.metadata?.platforms || []
  userInvocable: boolean|null,
  hasReferences: boolean,
  hasScripts: boolean,
  hasEvals: boolean,
  skillPath: string,     // absolute path to skill dir
}
```

Frontmatter parsing: manual (no deps) — split on `---`, parse `key: value` and `key: [a,b,c]` lines.

### `lib/score-quality.cjs`

Input: `SkillMeta`  
Output: `{ score: number, max: 10 }`

| Check | Pts | Condition |
|-------|-----|-----------|
| Has name | 1 | non-empty |
| Has description | 1 | non-empty |
| Trigger-condition format | 2 | description contains "Use when" (case-insensitive) |
| Has keywords | 1 | `keywords.length > 0` |
| Has triggers | 1 | `triggers.length > 0` |
| Has references/ | 1 | `hasReferences === true` |
| Has evals/ | 1 | `hasEvals === true` |
| user-invocable set | 1 | `userInvocable !== null` |
| Description length | 1 | 30–250 chars |

### `lib/project-context.cjs`

Input: `cwdPath`

Output: `ProjectContext`
```js
{
  platforms: string[],   // e.g. ['web', 'ios', 'android']
  techTerms: string[],   // e.g. ['next.js', 'react', 'typescript', 'swift']
  domainTags: string[],  // e.g. ['agents', 'skills', 'i18n', 'auth']
}
```

Sources (all optional, skip gracefully if missing):
1. `.epost-metadata.json` → `installedPackages` → strip `platform-` prefix
2. `CLAUDE.md` → find "Tech Stack" sections → extract second column from `| **X** | Y |` rows → lowercase, split on spaces/commas
3. `docs/index.json` → flatten `entries[].tags`

### `lib/score-relevance.cjs`

Input: `SkillMeta`, `ProjectContext`  
Output: `{ score: number, max: 10 }`

| Dimension | Max | Logic |
|-----------|-----|-------|
| Platform match | 3 | `skill.platforms ∩ context.platforms`, 1pt each, cap 3 |
| Keyword match | 4 | `skill.keywords ∩ context.techTerms`, 1pt each, cap 4 |
| Domain match | 3 | words in `description + triggers` ∩ `context.domainTags`, 1pt each, cap 3 |

All comparisons: lowercase.

---

## Phase 2 — Entry Point + Output

### `find-skill.cjs` flags

```
node find-skill.cjs [query]                        ← no flag: kernel + skills.sh unified
node find-skill.cjs --kernel [query]               ← kernel only
node find-skill.cjs --community [query]             ← npx skills find (raw, unscored)
node find-skill.cjs --install <name>               ← source-agnostic install
node find-skill.cjs --refresh                      ← force re-pull kernel cache
```

`--cwd <dir>` accepted by all flags (default: `process.cwd()`).

### No-flag (unified search) flow

1. `kernel-sync.cjs` → get kernel skills dir (or `null` on error)
2. Scan kernel skills → score each
3. Run `npx skills find [query] --json` if query given, else skip (avoid listing entire registry)
4. Merge results: kernel results first, then skills.sh results not already in kernel
5. For skills.sh results: quality = N/A (no full SKILL.md), relevance scored from description text only
6. Display unified ranked table (see below)

### Output format (scored sources)

```
Skills matching "react auth"  (kernel: 2, installed: 1)

  SOURCE    NAME                  QUALITY  RELEVANCE  DESCRIPTION
  kernel    ux-review              8/10      7/10      Use when reviewing UI...
  kernel    work-with-luz-k8s      6/10      4/10      How to navigate luz...
  skills.sh auth-pattern           —/10      5/10      NextAuth patterns for...

  [installed]  ux-review ✓ (already in .claude/skills/)

To install: /find-skill --install <name>
```

### `--install <name>` flow

1. Search kernel (sync first) for `<name>` → found?
2. If not in kernel → try `npx skills find <name>` → get GitHub ref
3. Install from kernel: copy `CACHE_DIR/skills/<name>/` → `.claude/skills/<name>/`
4. Install from skills.sh: `npx skills add <github-ref>` → skill lands in `.claude/skills/<name>/`
5. Print confirmation: `"Installed <name> → .claude/skills/<name>/. Active in this session."`

---

## Phase 3 — SKILL.md

Rewrite `packages/core/skills/find-skill/SKILL.md`.

### Key orchestration rules

- Always pass `--cwd` pointing to the project root (find by walking up for `.epost-metadata.json`)
- Script lives at `.claude/skills/find-skill/scripts/find-skill.cjs`
- `--community` runs `npx skills find` directly (no script needed)
- On SSH failure: tell user `"Kernel unavailable (SSH). Results from skills.sh only."`

---

## Constraints

- No npm dependencies in scripts — frontmatter parsed manually, child_process for git/npx
- All lib modules ≤ 200 lines
- Graceful degradation: each source (kernel, skills.sh) can fail independently
- Cache at `~/.epost-kit/cache/` — not inside the project repo

## Success Criteria

- [ ] No-flag search queries both kernel + skills.sh, ranked unified list
- [ ] `--kernel` clones/pulls from Bitbucket SSH, scores all 3 agent-kernel skills
- [ ] `--install <name>` works regardless of source; installs to `.claude/skills/`
- [ ] Kernel cache at `~/.epost-kit/cache/agent-kernel/`, max 24h stale
- [ ] SSH failure degrades gracefully (falls through to skills.sh)
- [ ] Relevance score differs between a web project and a backend-only project
- [ ] All scripts ≤ 200 lines each
