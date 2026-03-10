---
phase: 3
title: "CLI config command cleanup"
effort: 0.5h
depends: [1]
---

# Phase 3 — CLI Config Command Cleanup

## Goal

Remove Perplexity from the interactive `epost-kit config` CLI command. The CLI lives in the separate repo at `/Users/than/Projects/epost-agent-kit-cli/`.

---

## File to Change

**File**: `src/commands/config.ts`

---

## Tasks

### Task 3.1 — Remove Perplexity from engine menu

The config command has an interactive engine selection. Remove the `perplexity` option:

```ts
// BEFORE
{
  message: "Which AI service should agents use when doing research tasks?\n  (websearch uses Claude's built-in tool; gemini/perplexity require API keys)",
  choices: [
    { name: "gemini     — Google Gemini API (set GEMINI_API_KEY)", value: "gemini" },
    { name: "perplexity — Perplexity AI API (set PERPLEXITY_API_KEY)", value: "perplexity" },
    { name: "websearch  — Claude built-in (no API key needed)", value: "websearch" },
  ]
}

// AFTER
{
  message: "Which AI service should agents use when doing research tasks?\n  (websearch uses Claude's built-in tool; gemini requires GEMINI_API_KEY)",
  choices: [
    { name: "gemini    — Google Gemini CLI (set GEMINI_API_KEY)", value: "gemini" },
    { name: "websearch — Claude built-in (no API key needed)", value: "websearch" },
  ]
}
```

### Task 3.2 — Remove Perplexity menu item and handler

Find and remove the conditional that shows `Perplexity model` in the config menu when engine is `perplexity`:

```ts
// DELETE this block:
...(engine === "perplexity"
  ? [{ name: `Perplexity model       ${dim(getPath(config, "skills.research.perplexity.model", ""))}`, value: "research.perplexity.model" }]
  : []),
```

Remove the handler branch for `research.perplexity.model`:

```ts
// DELETE this block:
} else if (choice === "research.perplexity.model") {
  // ...prompt and setByPath for perplexity model
  setByPath(config, "skills.research.perplexity.model", val.trim());
}
```

### Task 3.3 — Verify gemini model item uses correct label

Check that the Gemini model menu item label is clear:

```ts
// Should read clearly:
{ name: `Gemini model  ${dim(getPath(config, "skills.research.gemini.model", ""))}`, value: "research.gemini.model" }
```

---

## Validation

```bash
# In epost-agent-kit-cli repo
cd /Users/than/Projects/epost-agent-kit-cli

# 1. Build TypeScript
npm run build

# 2. Grep for remaining perplexity refs in config command
grep -i "perplexity" src/commands/config.ts
# Should return 0 results

# 3. Manual test (optional)
node dist/index.js config
# Verify engine menu shows only: gemini, websearch
```

---

## Note on Repo Separation

The CLI repo (`epost-agent-kit-cli`) is a separate git repo from `epost_agent_kit`. Changes here require their own commit. The CLI reads `.epost-kit.json` from the project directory — the schema change (removing perplexity) happens in the main kit repo (Phase 1), the CLI change (removing the UI) happens here.

Both changes are independent and can be done in any order.
