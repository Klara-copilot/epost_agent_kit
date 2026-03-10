---
phase: 2
title: "Perfect Gemini CLI integration"
effort: 1h
depends: [1]
---

# Phase 2 — Perfect Gemini CLI Integration

## Goal

Align the Gemini integration with claudekit's proven patterns. Key gaps to close:
1. `GEMINI.md` system prompt is too generic; needs MCP proxy mode instructions
2. `engines.md` is missing the symlink setup step and the critical stdin vs `-p` distinction
3. No `GEMINI_API_KEY` guidance anywhere in the kit

---

## Reference: claudekit Patterns

Source: `/Users/than/Projects/claudekit/.claude/skills/mcp-management/references/gemini-cli-integration.md`

Key patterns to adopt:
- **Symlink**: `.gemini/settings.json` → `.claude/.mcp.json` enables MCP tools in Gemini
- **Stdin piping** (CRITICAL): `echo "prompt" | gemini -y -m <model>` — the `-p` flag is deprecated and skips MCP server init
- **Availability**: `gemini --version` / `which gemini` to check before use
- **Auth**: `gemini auth login` (one-time setup)
- **GEMINI.md**: Auto-loaded by gemini CLI when executed in a project directory; controls persona + output format

---

## Tasks

### Task 2.1 — Improve `GEMINI.md`

**File**: `packages/core/assets/GEMINI.md`

Replace with a more complete system prompt that follows claudekit's pattern. The file must handle two modes:
1. **Research mode**: plain Markdown output with citations (when called by `epost-researcher`)
2. **MCP proxy mode**: JSON-only output (when called via `/use-mcp` or similar delegations)

```markdown
# Gemini CLI System Prompt

You are an AI assistant integrated into the epost_agent_kit Claude Code workflow.

## Operating Modes

### Research Mode (default)
When given a research query:
- Return concise, factual Markdown
- Include citations as numbered footnotes with URLs
- Do NOT hallucinate URLs or library versions
- Note when information may be outdated
- Prefer official documentation over blog posts
- Flag uncertainties explicitly

### MCP Proxy Mode
When asked to execute MCP tools:
- Return ONLY raw JSON — no prose, no markdown fences
- Format: `{"server":"<name>","tool":"<tool>","success":true,"result":<output>,"error":null}`
- Maximum 500 characters per response
- No explanatory text before or after JSON

## Constraints
- Be concise and direct
- Prefer official sources
- Cite with URLs where available
- In research mode: Markdown with sources
- In MCP proxy mode: JSON only, single line

## Auto-Loading
This file is auto-loaded by the Gemini CLI when executed in this project directory.
```

---

### Task 2.2 — Improve `engines.md`

**File**: `packages/core/skills/research/references/engines.md`

Rewrite the Gemini section to include:

1. **Installation**:
   ```bash
   npm install -g gemini-cli
   gemini --version  # verify
   ```

2. **Authentication** (one-time):
   ```bash
   gemini auth login
   # OR: set GEMINI_API_KEY in your shell environment
   ```

3. **MCP symlink setup** (enables Gemini to use the same MCP tools as Claude):
   ```bash
   mkdir -p .gemini
   ln -sf ../.claude/.mcp.json .gemini/settings.json
   # Add .gemini/settings.json to .gitignore
   ```

4. **CRITICAL: Stdin piping, NOT `-p` flag**:
   ```bash
   # ✅ CORRECT — initializes MCP servers
   echo "<research query>" | gemini -y -m "$EPOST_GEMINI_MODEL"

   # ❌ WRONG — deprecated, skips MCP server init
   gemini -y -p "<research query>"
   ```
   The `-p` flag bypasses MCP connection initialization — MCP tools will be unavailable.

5. **Flags reference**:
   - `-y`: skip confirmation prompts (auto-approve tool execution)
   - `-m <model>`: model selection

6. **Models table**:
   | Model | Speed | Use case |
   |-------|-------|----------|
   | `gemini-2.5-flash-preview-04-17` | Fast | General research (default) |
   | `gemini-2.5-pro-preview` | Slower | Deep analysis |

7. **Availability check**:
   ```bash
   which gemini
   ```
   If exit code non-zero → engine unavailable → fall back to WebSearch.

8. **System prompt**: `GEMINI.md` at project root is auto-loaded by gemini CLI. Controls persona and output format.

Full rewritten `engines.md`:

```markdown
# Research Engine Reference

## Engine: gemini

### Installation

```bash
npm install -g gemini-cli
gemini --version
```

### Authentication (one-time)

```bash
gemini auth login
# OR: export GEMINI_API_KEY=<your-key> in shell / .env
```

### MCP Symlink Setup (recommended)

Enables Gemini CLI to use the same MCP tools as Claude Code:

```bash
mkdir -p .gemini
ln -sf ../.claude/.mcp.json .gemini/settings.json
echo ".gemini/settings.json" >> .gitignore
```

### CRITICAL: Use Stdin Piping, NOT -p Flag

```bash
# ✅ CORRECT — initializes MCP servers
echo "<research query>" | gemini -y -m "$EPOST_GEMINI_MODEL"

# ❌ WRONG — deprecated, skips MCP init, tools unavailable
gemini -y -p "<research query>"
gemini -y --model "$EPOST_GEMINI_MODEL" -p "<research query>"
```

The `-p` flag runs in "quick mode" — it bypasses MCP server connection initialization.
Always use stdin piping to ensure MCP tools are available.

### Invocation

```bash
echo "$RESEARCH_PROMPT" | gemini -y -m "$EPOST_GEMINI_MODEL"
```

- Requires: `gemini` CLI installed and authenticated
- System prompt: loaded from `GEMINI.md` at project root
- Output: plain Markdown (for research)
- Fallback trigger: `gemini` binary not found → log coverage gap → use WebSearch

### Availability Check

```bash
which gemini
```
Non-zero exit = engine unavailable → fall back to WebSearch.

### Models

| Model | Speed | Use case |
|-------|-------|----------|
| `gemini-2.5-flash-preview-04-17` | Fast | General research (default) |
| `gemini-2.5-pro-preview` | Slower | Deep investigation |

### Flags

- `-y`: Skip confirmation prompts (auto-approve tool execution)
- `-m <model>`: Model selection

---

## Engine: websearch

Built-in Claude `WebSearch` tool. Always available.
No configuration required.

Use with precise queries:
- Include terms like "best practices", "2024/2025", "security", "performance"
- Run multiple related queries in parallel (max 5)

---

## Fallback Chain

```
gemini → (if unavailable) → websearch
```

When the configured engine is unavailable:

1. Log to Methodology: `coverageGaps: ["gemini CLI not found in PATH — fell back to WebSearch"]`
2. Continue with WebSearch silently (no user prompt needed)
3. Final report Methodology section must disclose the fallback

Do NOT:
- Block the research waiting for the user to fix the engine
- Retry the engine more than once
- Omit the fallback from Methodology
```

---

## Validation

```bash
# 1. Verify GEMINI.md updated
grep "MCP Proxy Mode" packages/core/assets/GEMINI.md

# 2. Verify engines.md has symlink setup
grep "ln -sf" packages/core/skills/research/references/engines.md

# 3. Verify stdin piping documented
grep "CORRECT" packages/core/skills/research/references/engines.md

# 4. No perplexity in engines.md
grep -i "perplexity" packages/core/skills/research/references/engines.md
# Should return 0 results
```
