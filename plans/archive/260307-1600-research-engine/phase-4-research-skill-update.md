# Phase 4 — Research Skill Update + Fallback Chain

## Goal

Update `packages/core/skills/research/SKILL.md` to use the engine env var, invoke the correct backend, and fall back to WebSearch if the engine is unavailable. Update the researcher agent and session context accordingly.

## Tasks

### 4.1 Update `packages/core/skills/research/SKILL.md`

Replace the static "Phase 2: Information Gathering" section with an engine-aware block:

```markdown
### Phase 2: Information Gathering

**Check active engine** (set by session-init, default: `websearch`):

```bash
echo $EPOST_RESEARCH_ENGINE   # gemini | perplexity | websearch
```

**Engine invocation (max 5 parallel queries — think carefully before each):**

#### Engine: gemini

```bash
echo "<research query>" | gemini -y -m "$EPOST_GEMINI_MODEL"
```

Availability check: `which gemini` — if not found, log coverage gap and fall back to WebSearch.

#### Engine: perplexity

```bash
node ~/.claude/hooks/lib/perplexity-search.cjs "<research query>" "$EPOST_PERPLEXITY_MODEL"
```

Exit code 2 = key missing → log coverage gap → fall back to WebSearch.

#### Engine: websearch (default / fallback)

Use Claude's built-in `WebSearch` tool with precise queries.

**Fallback chain:**
1. Invoke configured engine
2. If unavailable (binary missing / exit code 2): add to Methodology `coverageGaps[]`
3. Fall back to `WebSearch` automatically — do not block or ask user

See `references/engines.md` for full invocation details, model options, and exit codes.
```

Also update the **Methodology** section in Phase 4 (Report Generation):

```markdown
- **Knowledge Tiers**: which engine was used (Gemini, Perplexity, WebSearch)
- **Coverage Gaps**: if configured engine was unavailable and fallback fired
```

### 4.2 Update `packages/core/agents/epost-researcher.md`

Add to the **Constraints** block (after existing constraints):

```markdown
- Check `$EPOST_RESEARCH_ENGINE` before searching — use the configured engine invocation pattern from `research/references/engines.md`
- If configured engine unavailable: fall back to WebSearch, note in Methodology coverage gaps
- Never hardcode a search engine — always read from env
```

### 4.3 Update session context in `session-init.cjs`

Ensure the `additionalContext` message includes the research engine line so agents can see it without needing to check env themselves:

```
Research engine: gemini (model: gemini-2.5-flash-preview-04-17)
```

Format the line with model inline for Gemini/Perplexity, omit model for websearch.

### 4.4 Add sub-skill routing entry to `research/SKILL.md`

Extend the Sub-Skill Routing table:

| Intent | Sub-Skill / Tool | When |
|--------|-----------------|------|
| Gemini search | `gemini` CLI via Bash | `$EPOST_RESEARCH_ENGINE = gemini` |
| Perplexity search | `perplexity-search.cjs` via Bash | `$EPOST_RESEARCH_ENGINE = perplexity` |
| Web search | `WebSearch` tool | `$EPOST_RESEARCH_ENGINE = websearch` or fallback |

### 4.5 Document in `references/engines.md` — Fallback behaviour

Add section:

```markdown
## Fallback Behaviour

When the configured engine is unavailable:

1. Log to Methodology: `coverageGaps: ["gemini CLI not found in PATH — fell back to WebSearch"]`
2. Continue with WebSearch silently (no user prompt needed)
3. Final report Methodology section must disclose the fallback

Do NOT:
- Block the research waiting for the user to fix the engine
- Retry the engine more than once
- Omit the fallback from Methodology
```

## Acceptance

- [ ] `research/SKILL.md` Phase 2 is engine-aware with all three invocation patterns
- [ ] Fallback chain documented inline and in `engines.md`
- [ ] `epost-researcher.md` constraints reference `$EPOST_RESEARCH_ENGINE`
- [ ] Session context line shows active engine + model
- [ ] Methodology coverage gaps capture engine fallback events
- [ ] Manual test: set `engine: "gemini"` in `.epost-kit.json`, reload session, check `$EPOST_RESEARCH_ENGINE`
- [ ] Manual test: set `engine: "perplexity"` without API key → verify fallback fires and coverage gap is logged
