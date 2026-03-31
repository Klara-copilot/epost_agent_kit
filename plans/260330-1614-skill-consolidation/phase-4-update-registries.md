---
phase: 4
title: "Update registries and regenerate indexes"
effort: 1h
depends: [1, 2, 3]
---

# Phase 4: Update Registries and Regenerate Indexes

Update all config files that reference deleted/renamed skills. Regenerate skill-index.json.

## Tasks

### 4.1 Update packages/core/package.yaml

Remove from `provides.skills[]`:
- `security-scan`
- `predict`
- `scenario`
- `retro`
- `llms`
- `clean-code`
- `knowledge-retrieval`
- `knowledge-capture`

Add to `provides.skills[]`:
- `knowledge`

**Result**: 24 skills listed (was 31 - 8 removed + 1 added = 24)

### 4.2 Update generate-skill-index.cjs CATEGORY_MAP

Remove entries:
```
'security-scan': 'quality',
'predict': 'workflow',
'scenario': 'workflow',
'retro': 'workflow',
'llms': 'knowledge',
'clean-code': 'quality',
'knowledge-retrieval': 'knowledge',
'knowledge-capture': 'knowledge',
```

Add entry:
```
'knowledge': 'knowledge',
```

### 4.3 Update generate-skill-index.cjs CONNECTION_MAP

Remove entries:
```
'clean-code':          { enhances: ['code-review'] },
'security-scan':       { enhances: ['code-review'] },
'predict':             { enhances: ['plan'] },
'scenario':            { enhances: ['test'] },
'retro':               { enhances: ['git'] },
'llms':                { enhances: ['docs'] },
'knowledge-retrieval': { enhances: ['plan'] },
'knowledge-capture':   { requires: ['knowledge-retrieval'] },
```

Add entry:
```
'knowledge': { enhances: ['plan', 'debug'] },
```

### 4.4 Update cross-references in other skills

Grep and fix references to deleted skill names in:

| File pattern | What to fix |
|-------------|-------------|
| `packages/core/skills/*/SKILL.md` | Related Skills sections, mentions |
| `packages/core/agents/*.md` | Agent skills lists (if any reference old names) |
| `packages/core/skills/skill-discovery/SKILL.md` | Quick Reference table entries |

Specific known references:
- `skill-discovery/SKILL.md` mentions `knowledge-retrieval` → update to `knowledge`
- `plan/SKILL.md` mentions `knowledge-retrieval` and `knowledge-capture` → update to `knowledge` / `knowledge --capture`
- `subagent-driven-development/SKILL.md` may reference `code-review` + `clean-code` → verify

### 4.5 Regenerate skill-index.json

```bash
cd /Users/than/Projects/epost_agent_kit
node packages/core/scripts/generate-skill-index.cjs packages/core/skills
```

Verify output:
- Count field matches 24
- No entries for deleted skills
- New `knowledge` entry present

### 4.6 Update CLAUDE.snippet.md (if needed)

Check `packages/core/CLAUDE.snippet.md` for any references to deleted skill names. Update if found.

## Validation

- [ ] `package.yaml` has exactly 24 skills
- [ ] `CATEGORY_MAP` has no stale entries, has `knowledge`
- [ ] `CONNECTION_MAP` has no stale entries, has `knowledge`
- [ ] `skill-index.json` count = 24 (or matches actual directory count if other packages add skills)
- [ ] `grep -r 'security-scan\|predict\|scenario\|retro\b\|llms\|clean-code\|knowledge-retrieval\|knowledge-capture' packages/core/skills/` returns 0 hits (excluding this plan)
- [ ] `grep -r 'security-scan\|predict\|scenario\|retro\b\|llms\|clean-code\|knowledge-retrieval\|knowledge-capture' packages/core/agents/` returns 0 hits
