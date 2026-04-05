---
name: research-engines
description: Search engine configuration for epost-researcher
user-invocable: false
disable-model-invocation: true
---

# Research Engines

Use `WebSearch` tool as the primary search engine.

## Search Strategy

Run multiple `WebSearch` calls in parallel for different facets of the topic:
```
WebSearch("X best practices 2025")
WebSearch("X vs Y comparison site:reddit.com OR site:news.ycombinator.com")
WebSearch("X official documentation site:github.com")
```

Limit to **5 searches max** unless `--deep` flag is set.

## Related

- `knowledge --external` — Context7 integration for official library/API docs (preferred over web search for library-specific questions)
- `ck:research` — claudekit's research skill with the same WebSearch approach
