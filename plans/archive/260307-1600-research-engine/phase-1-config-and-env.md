# Phase 1 — Config Layer + Env Export

## Goal

Add `skills.research` config block to `.epost-kit.json`, validate it in `epost-config-utils.cjs`, and export research engine env vars from `session-init.cjs`.

## Tasks

### 1.1 Update `.epost-kit.json` default config

File: `packages/core/.epost-kit.json`

Add a `skills` section:

```json
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
```

- `engine`: `"gemini" | "perplexity" | "websearch"` (default: `"websearch"`)
- `gemini.model`: Gemini model string passed to `-m` flag
- `perplexity.model`: `"sonar"` (fast) or `"sonar-pro"` (deep, citation-rich)

Also update `.claude/.epost-kit.json` for the local install (same change).

---

### 1.2 Update `epost-config-utils.cjs`

File: `packages/core/hooks/lib/epost-config-utils.cjs`

Add to `DEFAULT_CONFIG`:

```js
skills: {
  research: {
    engine: 'websearch',
    gemini: { model: 'gemini-2.5-flash-preview-04-17' },
    perplexity: { model: 'sonar' }
  }
}
```

Add a `getResearchConfig()` function:

```js
function getResearchConfig(config) {
  const skills = config?.skills?.research || {};
  const engine = ['gemini', 'perplexity', 'websearch'].includes(skills.engine)
    ? skills.engine
    : 'websearch';
  return {
    engine,
    geminiModel: skills.gemini?.model || 'gemini-2.5-flash-preview-04-17',
    perplexityModel: skills.perplexity?.model || 'sonar'
  };
}
```

Export `getResearchConfig` alongside existing exports.

---

### 1.3 Update `session-init.cjs`

File: `packages/core/hooks/session-init.cjs`

After the existing `EPOST_REPORTS_PATH` export, read the research config and export:

```js
const researchCfg = getResearchConfig(config);
process.env.EPOST_RESEARCH_ENGINE = researchCfg.engine;
process.env.EPOST_GEMINI_MODEL    = researchCfg.geminiModel;
process.env.EPOST_PERPLEXITY_MODEL = researchCfg.perplexityModel;
```

Add to session context output (the `additionalContext` block) so agents can read it:

```
Research engine: $EPOST_RESEARCH_ENGINE
Gemini model: $EPOST_GEMINI_MODEL
Perplexity model: $EPOST_PERPLEXITY_MODEL
```

---

### 1.4 Update tests

File: `packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs`

Add test group `getResearchConfig`:
- Default → `{ engine: 'websearch', geminiModel: '...', perplexityModel: 'sonar' }`
- Config `engine: 'gemini'` → engine is `'gemini'`
- Config `engine: 'invalid'` → falls back to `'websearch'`
- Config `gemini.model: 'gemini-3-flash'` → `geminiModel: 'gemini-3-flash'`

Also copy updated test to `.claude/hooks/lib/__tests__/` (generated path).

## Acceptance

- [ ] `packages/core/.epost-kit.json` has `skills.research` block
- [ ] `getResearchConfig()` exported from `epost-config-utils.cjs`
- [ ] `EPOST_RESEARCH_ENGINE` visible in session context
- [ ] Tests pass: `node --test packages/core/hooks/lib/__tests__/epost-config-utils.test.cjs`
