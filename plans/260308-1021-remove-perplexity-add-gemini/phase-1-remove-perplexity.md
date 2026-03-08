---
phase: 1
title: "Remove Perplexity integration"
effort: 1.5h
depends: []
---

# Phase 1 — Remove Perplexity Integration

## Goal

Completely remove Perplexity from all layers: script, config utils, session init, skill docs, config files. Leave the engine layer with two options: `gemini` and `websearch`.

---

## Tasks

### Task 1.1 — Delete `perplexity-search.cjs`

**File**: `packages/core/hooks/lib/perplexity-search.cjs`
**Action**: Delete the file entirely.

No replacement needed — the engine layer in `SKILL.md` already routes to WebSearch when gemini is unavailable. The Perplexity engine was an extra, not used in production.

Also delete the mirrored file if it exists: `packages/core/hooks/__tests__/epost-config-utils.test.cjs` (check if it's a duplicate of the lib/__tests__ one).

---

### Task 1.2 — Update `epost-config-utils.cjs`

**File**: `packages/core/hooks/lib/epost-config-utils.cjs`

**Changes**:

1. In `DEFAULT_CONFIG.skills.research`, remove the `perplexity` key:
   ```js
   // BEFORE
   skills: {
     research: {
       engine: 'websearch',
       gemini: { model: 'gemini-2.5-flash-preview-04-17' },
       perplexity: { model: 'sonar' }
     }
   }

   // AFTER
   skills: {
     research: {
       engine: 'websearch',
       gemini: { model: 'gemini-2.5-flash-preview-04-17' }
     }
   }
   ```

2. In `getResearchConfig()`, update valid engines and return value:
   ```js
   // BEFORE
   function getResearchConfig(config) {
     const skills = config?.skills?.research || {};
     const VALID_ENGINES = ['gemini', 'perplexity', 'websearch'];
     const engine = VALID_ENGINES.includes(skills.engine) ? skills.engine : 'websearch';
     return {
       engine,
       geminiModel: skills.gemini?.model || 'gemini-2.5-flash-preview-04-17',
       perplexityModel: skills.perplexity?.model || 'sonar'
     };
   }

   // AFTER
   function getResearchConfig(config) {
     const skills = config?.skills?.research || {};
     const VALID_ENGINES = ['gemini', 'websearch'];
     const engine = VALID_ENGINES.includes(skills.engine) ? skills.engine : 'websearch';
     return {
       engine,
       geminiModel: skills.gemini?.model || 'gemini-2.5-flash-preview-04-17'
     };
   }
   ```

3. Update the JSDoc return type comment:
   ```js
   // @returns {{ engine: string, geminiModel: string }}
   ```

---

### Task 1.3 — Update `session-init.cjs`

**File**: `packages/core/hooks/session-init.cjs`

**Changes**:

1. Remove `EPOST_PERPLEXITY_MODEL` env export:
   ```js
   // DELETE this line:
   writeEnv(envFile, 'EPOST_PERPLEXITY_MODEL', researchCfg.perplexityModel);
   ```

2. Remove perplexity branch in the console.log block near end of `main()`:
   ```js
   // BEFORE
   if (researchCfg.engine === 'gemini') {
     console.log(`Research engine: gemini (model: ${researchCfg.geminiModel})`);
   } else if (researchCfg.engine === 'perplexity') {
     console.log(`Research engine: perplexity (model: ${researchCfg.perplexityModel})`);
   } else {
     console.log(`Research engine: websearch`);
   }

   // AFTER
   if (researchCfg.engine === 'gemini') {
     console.log(`Research engine: gemini (model: ${researchCfg.geminiModel})`);
   } else {
     console.log(`Research engine: websearch`);
   }
   ```

---

### Task 1.4 — Update `.epost-kit.json`

**File**: `packages/core/.epost-kit.json`

Remove `perplexity` block from `skills.research`:
```json
// BEFORE
"skills": {
  "research": {
    "engine": "websearch",
    "gemini": {
      "model": "gemini-2.5-flash-preview-04-17"
    },
    "perplexity": {
      "model": "sonar"
    }
  }
}

// AFTER
"skills": {
  "research": {
    "engine": "websearch",
    "gemini": {
      "model": "gemini-2.5-flash-preview-04-17"
    }
  }
}
```

---

### Task 1.5 — Update `research/references/engines.md`

**File**: `packages/core/skills/research/references/engines.md`

Remove the entire `## Engine: perplexity` section (lines covering Perplexity invocation, exit codes, models table, API key note).

Update the `## Fallback Chain` section to reflect only two engines:
```
gemini → (if unavailable) → websearch
```

---

### Task 1.6 — Update `research/SKILL.md`

**File**: `packages/core/skills/research/SKILL.md`

1. Remove the `#### Engine: perplexity` block from Phase 2:
   ```markdown
   #### Engine: perplexity

   ```bash
   node ~/.claude/hooks/lib/perplexity-search.cjs "<research query>" "$EPOST_PERPLEXITY_MODEL"
   ```

   Exit code 2 = key missing → log coverage gap → fall back to WebSearch.
   ```

2. Remove perplexity row from Sub-Skill Routing table:
   ```markdown
   // DELETE this row:
   | Perplexity search | `perplexity-search.cjs` via Bash | `$EPOST_RESEARCH_ENGINE = perplexity` |
   ```

3. Update the `**Check active engine**` comment:
   ```markdown
   // BEFORE
   echo $EPOST_RESEARCH_ENGINE   # gemini | perplexity | websearch

   // AFTER
   echo $EPOST_RESEARCH_ENGINE   # gemini | websearch
   ```

---

### Task 1.7 — Update test file

**File**: `packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs`

Find and remove test cases for `getResearchConfig` that assert `perplexityModel` in the return value. Update assertions to match the new 2-field return: `{ engine, geminiModel }`.

---

## Validation

```bash
# 1. Verify file deleted
ls packages/core/hooks/lib/perplexity-search.cjs 2>&1  # should error "no such file"

# 2. Run tests
node packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs

# 3. Grep for any remaining perplexity references
grep -r "perplexity" packages/core/ --include="*.cjs" --include="*.json" --include="*.md"
# Should return 0 results
```
