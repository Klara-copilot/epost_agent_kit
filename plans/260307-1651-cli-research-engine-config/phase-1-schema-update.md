---
phase: 1
title: "Schema + config passthrough"
effort: 1h
depends: []
---

# Phase 1 — Schema + Config Passthrough

## Goal

Extend the CLI's Zod `ConfigSchema` so `skills.research` config is validated and preserved during `init`/`update` flows instead of being silently stripped.

## Tasks

### 1.1 Update ConfigSchema in config-loader.ts

File: `src/domains/config/config-loader.ts`

Add `skills` to the Zod schema:

```ts
skills: z.object({
  research: z.object({
    engine: z.enum(['gemini', 'perplexity', 'websearch']).default('websearch'),
    gemini: z.object({
      model: z.string().default('gemini-2.5-flash-preview-04-17'),
    }).optional(),
    perplexity: z.object({
      model: z.enum(['sonar', 'sonar-pro']).default('sonar'),
    }).optional(),
  }).optional(),
}).optional(),
```

Update `EpostConfig` type (auto-inferred from schema, no manual changes needed).

### 1.2 Load `.claude/.env` secrets in `session-init.cjs`

File: `packages/core/hooks/session-init.cjs`

Before `loadConfig()`, read `.claude/.env` and export any `KEY=value` lines into `process.env` (so `PERPLEXITY_API_KEY` and `GEMINI_API_KEY` are available to tools and scripts in the session):

```js
// Load project-scoped secrets (.claude/.env) — gitignored, never committed
const dotEnvPath = path.join(process.cwd(), '.claude', '.env');
if (fs.existsSync(dotEnvPath)) {
  const lines = fs.readFileSync(dotEnvPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val; // don't override shell env
  }
}
```

Also `writeEnv` the keys to `CLAUDE_ENV_FILE` so they're available in subagent shells:

```js
if (process.env.GEMINI_API_KEY) writeEnv(envFile, 'GEMINI_API_KEY', process.env.GEMINI_API_KEY);
if (process.env.PERPLEXITY_API_KEY) writeEnv(envFile, 'PERPLEXITY_API_KEY', process.env.PERPLEXITY_API_KEY);
```

**Security**: shell env takes priority over `.claude/.env` (the `!process.env[key]` guard). Users who set keys in `~/.zshrc` are unaffected.

Also copy updated `session-init.cjs` to `.claude/hooks/`.

### 1.3 Add env var override support

In `loadConfig()`, after existing env var overrides, add:

```ts
if (process.env.EPOST_RESEARCH_ENGINE) {
  config.skills = config.skills ?? {};
  config.skills.research = config.skills.research ?? {};
  config.skills.research.engine = process.env.EPOST_RESEARCH_ENGINE as any;
}
```

### 1.3 Add tests

File: `tests/domains/config/config-loader.test.ts` (or existing test file)

Test cases:
- Config with `skills.research.engine: 'gemini'` passes validation
- Config with `skills.research.engine: 'invalid'` fails validation
- Config without `skills` passes (optional)
- Env var `EPOST_RESEARCH_ENGINE=perplexity` overrides config
- `perplexity.model` defaults to `'sonar'` when not specified

### 1.4 Copy GEMINI.md to project root during init/update

**Who copies it**: the CLI (`epost-kit init` and `epost-kit update`), same pattern as `CLAUDE.md` (line 622 in `init.ts`).

**Perplexity**: no file to copy — REST API only. `perplexity-search.cjs` ships as part of hooks.

File: `src/commands/init.ts` (and `update.ts` for the same logic)

After the `CLAUDE.md` generation step, add:

```ts
// Copy GEMINI.md to project root (Gemini CLI system prompt — only if not present)
const geminiMdSrc = join(assetsDir, "GEMINI.md");   // from packages/core/assets/
const geminiMdDest = join(projectDir, "GEMINI.md");
if (await fileExists(geminiMdSrc) && !(await fileExists(geminiMdDest))) {
  await copyFile(geminiMdSrc, geminiMdDest);
  logger.info("GEMINI.md → created at project root (Gemini CLI system prompt)");
} else if (await fileExists(geminiMdDest)) {
  logger.debug("GEMINI.md already exists — skipping (user may have customized it)");
}
```

Rules:
- Only copy if `GEMINI.md` **does not already exist** at project root — never overwrite (user customization)
- Copy from `packages/core/assets/GEMINI.md` (part of the release tarball)
- `packages/core/assets/GEMINI.md` must be included in the release package manifest

## Files to Change

| File | Change |
|------|--------|
| `src/domains/config/config-loader.ts` | Add `skills` to `ConfigSchema`, env var override |
| `src/commands/init.ts` | Copy `GEMINI.md` to project root after CLAUDE.md generation |
| `src/commands/update.ts` | Same GEMINI.md copy logic as init |
| `tests/domains/config/config-loader.test.ts` | Add test cases for skills config |

## Acceptance

- [ ] `ConfigSchema.parse({ skills: { research: { engine: 'gemini' }}})` succeeds
- [ ] `ConfigSchema.parse({ skills: { research: { engine: 'bad' }}})` throws ZodError
- [ ] `EPOST_RESEARCH_ENGINE` env var overrides config file
- [ ] `epost-kit init` creates `GEMINI.md` at project root if absent
- [ ] `epost-kit init` skips `GEMINI.md` copy if file already exists
- [ ] All existing tests still pass
