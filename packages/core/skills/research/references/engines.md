---
name: research-engines
description: Search engine configuration for epost-researcher
user-invocable: false
disable-model-invocation: true
---

# Research Engines

## Engine Selection

Read `$EPOST_RESEARCH_ENGINE` before searching. If unset, use `websearch` (default).

| Value | Engine | Notes |
|-------|--------|-------|
| `websearch` | Claude WebSearch tool | Default — always available |
| `gemini` | `gemini` CLI (from claudekit) | Faster for broad sweeps; requires claudekit installed |

## Using WebSearch (default)

Run multiple `WebSearch` calls in parallel for different facets of the topic:
```
WebSearch("X best practices 2025")
WebSearch("X vs Y comparison site:reddit.com OR site:news.ycombinator.com")
WebSearch("X official documentation site:github.com")
```

Limit to **5 searches max** unless `--deep` flag is set.

## Using Gemini (claudekit integration)

If `$EPOST_RESEARCH_ENGINE=gemini` and `gemini` CLI is available:

1. Read engine config from `.claude/.ck.json` (project) or `~/.claude/.ck.json` (global):
   - `gemini.model` — default: `gemini-2.5-flash-preview`
   - `skills.research.useGemini` — if `false`, fall back to WebSearch

2. Run searches as bash commands (can parallelize):
```bash
gemini -y -m gemini-2.5-flash-preview "Research: X best practices, security considerations, and current adoption trends"
```

3. Save raw Gemini output to the report file before synthesis.

**Gemini CLI not found?** Fall back to WebSearch silently — note "Gemini unavailable, used WebSearch" in report Methodology section.

## Related

- `ck:research` — claudekit's standalone research skill with Gemini-first approach and full report template. Use as an alternative when claudekit is installed and Gemini is preferred over WebSearch.
- `knowledge --external` — Context7 integration for official library/API docs (preferred over web search for library-specific questions)
