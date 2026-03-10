# Phase 3 — Perplexity Integration

## Goal

Implement the Perplexity REST API call pattern for the research engine, including API key handling and model selection.

## Background

Perplexity's Sonar API is OpenAI-compatible. Key details:
- Endpoint: `https://api.perplexity.ai/chat/completions`
- Auth: `Authorization: Bearer $PERPLEXITY_API_KEY`
- Models: `sonar` (fast, citations), `sonar-pro` (deep, more citations), `sonar-reasoning` (chain-of-thought)
- Response includes `citations[]` array — extract and include in report

## Tasks

### 3.1 Create `packages/core/hooks/lib/perplexity-search.cjs`

A lightweight Node.js helper that agents can invoke via Bash:

```js
#!/usr/bin/env node
/**
 * Perplexity search helper
 * Usage: node perplexity-search.cjs "<query>" [model]
 * Env: PERPLEXITY_API_KEY
 */

const query = process.argv[2];
const model = process.argv[3] || process.env.EPOST_PERPLEXITY_MODEL || 'sonar';

if (!query) {
  console.error('Usage: perplexity-search.cjs "<query>" [model]');
  process.exit(1);
}

const apiKey = process.env.PERPLEXITY_API_KEY;
if (!apiKey) {
  // Signal to caller that engine is unavailable → fallback to websearch
  console.error('PERPLEXITY_UNAVAILABLE: PERPLEXITY_API_KEY not set');
  process.exit(2);
}

const body = JSON.stringify({
  model,
  messages: [{ role: 'user', content: query }],
  max_tokens: 2048,
  return_citations: true
});

const https = require('https');
const url = new URL('https://api.perplexity.ai/chat/completions');

const req = https.request({
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const content = parsed.choices?.[0]?.message?.content || '';
      const citations = parsed.citations || [];
      // Output: content + citations block
      process.stdout.write(content);
      if (citations.length) {
        process.stdout.write('\n\n## Sources\n');
        citations.forEach((c, i) => process.stdout.write(`${i + 1}. ${c}\n`));
      }
    } catch (e) {
      console.error('Parse error:', e.message, data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(body);
req.end();
```

Exit code semantics:
- `0` — success, stdout = Markdown response with citations
- `1` — error (parse, network)
- `2` — `PERPLEXITY_UNAVAILABLE` (API key missing) — caller should fall back to WebSearch

### 3.2 Copy to `.claude/hooks/lib/`

After writing in `packages/core/hooks/lib/`, also write the same content to `.claude/hooks/lib/perplexity-search.cjs` for the active local install.

Note: long-term, `epost-kit init` should handle this copy automatically.

### 3.3 Document in `references/engines.md` (phase-2 file)

Add full Perplexity section:

```markdown
## Engine: perplexity

Invocation:
```bash
node "$EPOST_KIT_HOOKS_LIB/perplexity-search.cjs" "$RESEARCH_PROMPT" "$EPOST_PERPLEXITY_MODEL"
```

Exit codes:
- 0 → success, stdout = Markdown + citations
- 2 → key missing → fall back to WebSearch (log in coverage gaps)

Models:
| Model | Speed | Citations | Use case |
|-------|-------|-----------|----------|
| sonar | Fast | Yes | General research |
| sonar-pro | Slower | Rich | Deep investigation |
| sonar-reasoning | Slow | Yes | Complex analysis |

API key: set `PERPLEXITY_API_KEY` in your shell environment or `.env` (not committed).
```

## Security Notes

- Never hardcode `PERPLEXITY_API_KEY` in any config file or skill file
- The helper reads from env only — no `.env` file loading (agent's shell inherits it)
- `PERPLEXITY_API_KEY` should be in `.gitignore` scope (user's shell profile)

## Acceptance

- [ ] `packages/core/hooks/lib/perplexity-search.cjs` created
- [ ] `.claude/hooks/lib/perplexity-search.cjs` updated
- [ ] Exit code 2 + stderr `PERPLEXITY_UNAVAILABLE` on missing key
- [ ] `references/engines.md` Perplexity section complete with model table
- [ ] No API key in any tracked file
