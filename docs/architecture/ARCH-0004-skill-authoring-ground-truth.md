# ARCH-0004: Skill Authoring — Ground Truth

**Category**: architecture
**Status**: current
**Audience**: agent, human
**Tags**: skills, authoring, frontmatter, progressive-disclosure, ground-truth

---

## Sources

- Anthropic's official guide: "The Complete Guide to Building Skills for Claude" (January 2026)
- Claude Code official docs: `docs.anthropic.com/en/docs/claude-code/slash-commands`

---

## 1. What a Skill Is

A skill is a folder containing:
- `SKILL.md` (required) — instructions in Markdown with YAML frontmatter
- `scripts/` (optional) — executable code (Python, Bash, etc.)
- `references/` (optional) — documentation loaded on demand
- `assets/` (optional) — templates, fonts, icons

Core properties: Composable (works alongside other skills), Portable (identical across Claude.ai, Claude Code, API).

---

## 2. Frontmatter Fields — Two Spec Layers

### Layer A — Agent Skills Open Standard (portable across AI tools)

| Field | Required | Notes |
|---|---|---|
| `name` | No* | Lowercase, hyphens only, max 64 chars. Defaults to directory name. |
| `description` | Recommended | What + when. ≤250 chars shown in listing (truncated). **The only signal Claude uses to decide loading.** |
| `license` | No | MIT, Apache-2.0, etc. |
| `allowed-tools` | No | Space-separated string OR YAML list. Pre-approved tools. |
| `compatibility` | No | 1–500 chars. Environment requirements, target product, system deps. |
| `metadata` | No | Arbitrary key-value bag. Clients read it; Claude ignores it at runtime. |

### Layer B — Claude Code Extensions (official, Claude Code only)

These are **fully official Claude Code fields** — not in the open standard but documented and supported.

> "Claude Code extends the [Agent Skills] standard with additional features like invocation control, subagent execution, and dynamic context injection."

| Field | Default | Purpose |
|---|---|---|
| `argument-hint` | — | Autocomplete hint: `[issue-number]` or `[filename] [format]` |
| `user-invocable` | `true` | `false` = hidden from `/` menu. Skill invoked by Claude only (background knowledge). **Replacement for deprecated `.claude/commands/`.** |
| `disable-model-invocation` | `false` | `true` = never auto-loads. Manual `/name` trigger only. |
| `model` | session default | Override model for this skill. |
| `effort` | session default | `low`, `medium`, `high`, `max` |
| `context` | inline | `fork` = run in a forked subagent context. |
| `agent` | — | Subagent type to use when `context: fork`. |
| `hooks` | — | Lifecycle hooks scoped to this skill. |
| `paths` | — | Glob patterns. Skill auto-loads **only** when working with matching files. Comma-separated or YAML list. |
| `shell` | `bash` | `powershell` for Windows. |

**Commands → Skills migration:**
> "Custom commands have been merged into skills. A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working. Skills add optional features."

### Layer C — Kit-Only Fields (no runtime effect)

Inside `metadata:` — consumed only by `epost-kit` CLI tooling (`find-skill`, `kit-verify`).

| Field | Purpose |
|---|---|
| `metadata.keywords` | `find-skill` search index |
| `metadata.triggers` | Documentation / CLI only |
| `metadata.platforms` | Documentation / CLI only |
| `metadata.connections` | Cross-skill relationship graph for CLI |

### Security restrictions
- No XML angle brackets (`< >`) anywhere in frontmatter
- Names cannot start with `claude` or `anthropic` (reserved)

---

## 3. String Substitution (Claude Code)

| Variable | Value |
|---|---|
| `$ARGUMENTS` | All arguments passed when invoking the skill |
| `$ARGUMENTS[N]` | Specific argument by 0-based index |
| `$N` | Shorthand: `$0` = first arg, `$1` = second |
| `${CLAUDE_SESSION_ID}` | Current session ID |

---

## 4. Progressive Disclosure (3 Levels)

Skills use three levels of context loading to minimize token usage:

```
Level 1: YAML frontmatter
  → Always loaded in Claude's system prompt
  → Purpose: just enough to know WHEN to use the skill
  → Keep lean: description ≤1024 chars

Level 2: SKILL.md body
  → Loaded when Claude decides skill is relevant
  → Full instructions, workflow steps, patterns
  → Keep under 5,000 words

Level 3: references/ files
  → Loaded on demand as Claude navigates them
  → Deep reference material, examples, schemas
  → No size constraint — loaded only when explicitly needed
```

---

## 5. Description Field — The Critical Loading Signal

The description is the **only** field Claude reads to decide whether to load a skill. Get this right.

### Formula

`[When to use it (trigger phrases)] + [What it does] + [Key capabilities]`

### Good examples
```yaml
# Specific, actionable, includes what users say
description: Use when user uploads .fig files, asks for "design specs", "component
  documentation", or "design-to-code handoff". Analyzes Figma design files and
  generates developer handoff documentation.

# Includes trigger phrases
description: Use when user mentions "sprint", "Linear tasks", "project planning",
  or asks to "create tickets". Manages Linear project workflows including sprint
  planning, task creation, and status tracking.
```

### Bad examples
```yaml
# Too vague
description: Helps with projects.

# Missing triggers
description: Creates sophisticated multi-page documentation systems.

# Technical, no user triggers
description: Implements the Project entity model with hierarchical relationships.
```

### Debugging a skill that won't trigger
Ask Claude: "When would you use the [skill-name] skill?" — Claude quotes the description back. Adjust based on what's missing.

---

## 6. Testing Framework

### 1. Triggering tests (target: 90% accuracy)
- Should trigger on obvious tasks
- Should trigger on paraphrased requests
- Should NOT trigger on unrelated topics

Format: `{"query": "...", "should_trigger": true/false}` — this is our `evals/eval-set.json` format.

### 2. Functional tests
Given/When/Then: verify correct output, tool calls succeed, error handling works.

### 3. Performance comparison
Compare token count and tool calls with vs. without the skill enabled.

---

## 7. Troubleshooting Patterns

| Symptom | Cause | Fix |
|---|---|---|
| Skill never loads | Description too vague or missing triggers | Rewrite description; add user-facing trigger phrases |
| Skill loads too often | Description too broad | Add negative triggers; narrow scope with "Do NOT use for..." |
| Instructions not followed | Too verbose; critical steps buried | Front-load critical instructions; use `## CRITICAL:` headers; move depth to references/ |
| SKILL.md too large | All content inline | Move detailed docs to `references/`; keep SKILL.md under 5,000 words |
| Inconsistent results | Ambiguous language | Use concrete, deterministic instructions; bundle validation scripts |

---

## 8. Skill Categories

| Category | Use for | Key techniques |
|---|---|---|
| Document/Asset Creation | Consistent output: documents, designs, code | Style guides, templates, quality checklists |
| Workflow Automation | Multi-step processes, MCP coordination | Step ordering, validation gates, rollback instructions |
| Domain-Specific Intelligence | Embedded expertise beyond tool access | Logic, compliance checks, audit trails |

---

## 9. Nested Directory Auto-Discovery (Monorepo Support)

When working with files in a subdirectory, Claude Code also scans for `.claude/skills/` in that subdirectory:

```
monorepo/
├── .claude/skills/           ← Always loaded (project root)
├── packages/frontend/
│   └── .claude/skills/       ← Loaded when editing files in packages/frontend/
└── packages/mobile/
    └── .claude/skills/       ← Loaded when editing files in packages/mobile/
```

**`--add-dir` exception**: `.claude/skills/` inside additional directories (added via `--add-dir`) are loaded with live change detection. However, other `.claude/` config (agents, commands, output styles) from those directories is NOT loaded.

**epost-kit note**: Our kit doesn't currently use per-package `.claude/skills/`. Skills live at the project root under `.claude/skills/`. The `paths:` field is the preferred approach for platform-scoped auto-loading.

---

## 10. Bundled Skills (Ships with Claude Code)

These skills are built into Claude Code and available in every session without installation:

| Skill | Purpose |
|-------|---------|
| `/batch` | Run multiple independent tasks in parallel using subagents |
| `/claude-api` | Build apps with the Claude API — prompt templates, chat patterns |
| `/debug` | Systematic debugging — investigate errors, root cause analysis |
| `/loop` | Iterate on a metric until target is met (coverage, bundle size, lint) |
| `/simplify` | Reduce code complexity while preserving behavior |

These are prompt-based (no `scripts/`). They can spawn parallel agents and use worktrees. Our kit has its own `debug` and `loop` skills — these extend rather than conflict with the bundled versions.

---

## 11. Skill Priority Hierarchy

When the same skill name exists at multiple scopes:

```
enterprise policy > personal (~/.claude/skills/) > project (.claude/skills/)
```

Plugin skills use `plugin-name:skill-name` namespace — no naming conflicts possible.

---

## 12. File Size Limits

| File | Limit | Reason |
|---|---|---|
| SKILL.md body | ≤5,000 words | Loaded into context on activation — token cost |
| description | ≤1024 chars | Frontmatter is always loaded; truncated in listing display |
| Max skills enabled | 20–50 simultaneously | Context window degradation beyond this |

---

## Related
- `ARCH-0003` — Three-layer knowledge model and skill gap analysis
- `ARCH-0002` — Claude native mechanics and routing design
- `ARCH-0001` — Current system architecture
- `packages/kit/skills/skill-creator/references/cc-skill-spec.md` — Authoritative CC skill spec
- `packages/kit/skills/skill-creator/references/epost-skill-authoring-standards.md` — ePost conventions layered on top
- `packages/kit/skills/kit-skill-development/references/cso-principles.md` — CSO description formula and examples
